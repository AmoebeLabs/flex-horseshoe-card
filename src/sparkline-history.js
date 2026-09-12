import { SPARKLINE_HISTORY_RESULT, SPARKLINE_REQUEST_STATE } from './sparkline-state.js';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const HISTORY_RETRY_MS = 30 * 1000;

/**
 * Owns the source records and time windows used by one Sparkline tool.
 *
 * The parent period determines one shared plot window. Each normalized Series
 * item supplies its effective source period, so an offset changes the requested
 * timestamps without introducing another timeline inside the graph engine.
 */
export default class SparklineHistory {
  /**
   * Creates stable record storage for the normalized Series collection.
   *
   * @param {object} plotPeriod - Parent period defining the shared timeline.
   * @param {object} stateBandsStateMap - Valid categorical states and graph values.
   * @param {Array<object>} seriesItems - Normalized Sparkline Series items.
   * @param {boolean} periodDurationAvailable - Whether the evaluated graph period can be used.
   * @param {boolean} dayNightEnabled - Whether this History owner also maintains sun history.
   * @param {object} events - GraphTool continuations for due requests and elapsed bins.
   */
  constructor(plotPeriod, stateBandsStateMap, seriesItems, periodDurationAvailable, dayNightEnabled, events) {
    this.seriesRecords = new Map();
    this.connectedToCard = true;
    this.events = events;
    this.binBoundaryTimer = undefined;
    this.calendarRangeTimer = undefined;
    this.refreshTiming = undefined;
    this.dayNightRecord = {
      rows: undefined,
      rangeStart: undefined,
      rangeEnd: undefined,
      periodSignature: undefined,
      sunSignature: undefined,
      sunEntity: undefined,
      segments: [],
      requestNumber: 0,
      requestPromise: undefined,
      requestTimer: undefined,
      retryAt: 0,
      resynchronizationRequested: false,
    };
    this.updateConfig(plotPeriod, stateBandsStateMap, seriesItems, periodDurationAvailable, dayNightEnabled);
  }

  /**
   * Applies evaluated period and state-map configuration while retaining records
   * for Series IDs that still exist.
   *
   * @param {object} plotPeriod - Parent period defining the shared timeline.
   * @param {object} stateBandsStateMap - Valid categorical states and graph values.
   * @param {Array<object>} seriesItems - Current normalized Sparkline Series items.
   * @param {boolean} periodDurationAvailable - Whether the evaluated graph period can be used.
   * @param {boolean} dayNightEnabled - Whether sun history belongs to this Sparkline.
   * @returns {object} History changes that affect GraphTool scheduling.
   */
  updateConfig(plotPeriod, stateBandsStateMap, seriesItems, periodDurationAvailable, dayNightEnabled) {
    this.plotPeriod = plotPeriod;
    this.stateBandsStateMap = stateBandsStateMap;
    this.seriesItems = seriesItems;
    this.periodDurationAvailable = periodDurationAvailable;
    this.dayNightEnabled = dayNightEnabled;
    let periodChanged = false;

    const activeIds = new Set(seriesItems.map((item) => item.id));
    this.seriesRecords.forEach((record, id) => {
      if (!activeIds.has(id)) {
        // Removing a Series also makes every completion created for that source stale.
        record.requestNumber += 1;
        globalThis.clearTimeout(record.requestTimer);
        this.seriesRecords.delete(id);
      }
    });
    seriesItems.forEach((item) => {
      if (!this.seriesRecords.has(item.id)) {
        this.seriesRecords.set(item.id, {
          sourceRows: undefined,
          rows: undefined,
          sourceRangeStart: undefined,
          sourceRangeEnd: undefined,
          sourceKey: undefined,
          acceptedSourceKey: undefined,
          periodSignature: JSON.stringify(item.config.period),
          requestNumber: 0,
          requestPromise: undefined,
          requestTimer: undefined,
          requestState: item.config.period.type === 'real_time' ? SPARKLINE_REQUEST_STATE.NOT_REQUIRED : SPARKLINE_REQUEST_STATE.NOT_LOADED,
          refreshAt: 0,
          retryAt: 0,
          resynchronizationRequested: false,
          preserveGraphWhileLoading: false,
          acceptedResultPending: false,
        });
        return;
      }

      const record = this.seriesRecords.get(item.id);
      const periodSignature = JSON.stringify(item.config.period);
      if (periodSignature === record.periodSignature) {
        if (item.config.period.type === 'real_time') record.requestState = SPARKLINE_REQUEST_STATE.NOT_REQUIRED;
        else if (!periodDurationAvailable) record.requestState = SPARKLINE_REQUEST_STATE.NOT_LOADED;
        return;
      }

      periodChanged = true;
      record.periodSignature = periodSignature;
      record.requestNumber += 1;
      record.requestPromise = undefined;
      globalThis.clearTimeout(record.requestTimer);
      record.requestTimer = undefined;
      record.retryAt = 0;
      record.resynchronizationRequested = true;
      record.acceptedResultPending = false;

      const requestedRangeIsMissing = item.config.period.type !== 'real_time'
        && periodDurationAvailable
        && !this.acceptedHistoryContainsRange(item.id, this.getSeriesRange(item), item.config.period.type);
      record.preserveGraphWhileLoading = requestedRangeIsMissing && record.rows !== undefined;
      if (item.config.period.type === 'real_time') record.requestState = SPARKLINE_REQUEST_STATE.NOT_REQUIRED;
      else if (!periodDurationAvailable) record.requestState = SPARKLINE_REQUEST_STATE.NOT_LOADED;
      else if (requestedRangeIsMissing) record.requestState = SPARKLINE_REQUEST_STATE.LOADING;
      else record.requestState = record.rows === undefined ? SPARKLINE_REQUEST_STATE.NOT_LOADED : SPARKLINE_REQUEST_STATE.LOADED;
    });

    const dayNightPeriodSignature = JSON.stringify([dayNightEnabled, plotPeriod]);
    if (dayNightPeriodSignature !== this.dayNightRecord.periodSignature) {
      // A changed parent period selects another absolute sun range. The old
      // completion and retry deadline cannot write into that replacement range.
      globalThis.clearTimeout(this.dayNightRecord.requestTimer);
      this.dayNightRecord.requestNumber += 1;
      this.dayNightRecord.rows = undefined;
      this.dayNightRecord.rangeStart = undefined;
      this.dayNightRecord.rangeEnd = undefined;
      this.dayNightRecord.segments = [];
      this.dayNightRecord.requestPromise = undefined;
      this.dayNightRecord.requestTimer = undefined;
      this.dayNightRecord.retryAt = 0;
      this.dayNightRecord.resynchronizationRequested = dayNightEnabled;
      this.dayNightRecord.periodSignature = dayNightPeriodSignature;
    }

    if (periodChanged || !periodDurationAvailable) this.stopTimeBoundaryUpdates();

    return { periodChanged };
  }

  /**
   * Calculates one Series source range and its position on the parent timeline.
   * Calendar days advance through local midnights, preserving 23-hour and
   * 25-hour days; rolling windows retain exact elapsed-hour semantics.
   *
   * @param {object} item - Series item whose effective period selects the source.
   * @returns {object} Absolute source and shared plot boundaries.
   */
  getSeriesRange(item) {
    const sourcePeriod = item.config.period;
    const periodType = this.plotPeriod.type;
    const periodHours = Number(this.plotPeriod[periodType].duration.hour);
    const plotOffset = Number(this.plotPeriod[periodType].offset);
    const sourceOffset = Number(sourcePeriod[periodType].offset);
    const offsetDifference = sourceOffset - plotOffset;
    const now = new Date();

    if (periodType === 'calendar' && this.plotPeriod.calendar.period === 'day') {
      const calendarDays = periodHours / 24;
      const plotStart = new Date(now);
      plotStart.setHours(0, 0, 0, 0);
      plotStart.setDate(plotStart.getDate() + plotOffset - (calendarDays - 1));

      const plotEnd = new Date(plotStart);
      plotEnd.setDate(plotEnd.getDate() + calendarDays);
      const sourceStart = new Date(plotStart);
      const sourceEnd = new Date(plotEnd);
      const plotActiveEnd = new Date(now);

      // The offset difference moves source timestamps to the selected day while
      // the graph continues to receive timestamps on the one parent timeline.
      sourceStart.setDate(sourceStart.getDate() + offsetDifference);
      sourceEnd.setDate(sourceEnd.getDate() + offsetDifference);
      plotActiveEnd.setDate(plotActiveEnd.getDate() - offsetDifference);

      return {
        start: sourceStart,
        end: sourceEnd,
        sourceStart,
        sourceEnd,
        plotStart,
        plotEnd,
        plotActiveEnd,
        calendarOffsetDays: offsetDifference,
        sourceRangeIsActive: sourceOffset === 0,
      };
    }

    // Rolling parent offsets move the visible timeline first. A Series override
    // then selects its absolute source relative to that already-positioned plot.
    const plotEnd = new Date(now.getTime() + plotOffset * DAY_MS);
    const plotStart = new Date(plotEnd.getTime() - periodHours * HOUR_MS);
    const sourceStart = new Date(plotStart.getTime() + offsetDifference * DAY_MS);
    const sourceEnd = new Date(plotEnd.getTime() + offsetDifference * DAY_MS);
    const plotActiveEnd = new Date(now.getTime() - offsetDifference * DAY_MS);

    return {
      start: sourceStart,
      end: sourceEnd,
      sourceStart,
      sourceEnd,
      plotStart,
      plotEnd,
      plotActiveEnd,
      rollingOffsetDays: offsetDifference,
      sourceRangeIsActive: sourceOffset === 0,
    };
  }

  /**
   * Binds a Series record to the Home Assistant source that supplies its rows.
   * Changing the entity or configured attribute invalidates accepted rows and
   * every in-flight completion for the previous source.
   *
   * @param {object} item - Series item with its current entity and entity config.
   * @returns {boolean} True when an existing source was replaced.
   */
  bindSeriesEntity(item) {
    const record = this.seriesRecords.get(item.id);
    const sourceKey = JSON.stringify([item.entity.entity_id, item.entityConfig.attribute]);
    const sourceChanged = record.sourceKey !== undefined && record.sourceKey !== sourceKey;

    if (sourceChanged) {
      this.clearSeries(item.id);
      record.resynchronizationRequested = item.config.period.type !== 'real_time';
      if (item.config.period.type === 'real_time') record.requestState = SPARKLINE_REQUEST_STATE.NOT_REQUIRED;
      else if (this.periodDurationAvailable) record.requestState = SPARKLINE_REQUEST_STATE.LOADING;
      else record.requestState = SPARKLINE_REQUEST_STATE.NOT_LOADED;
    }

    record.sourceKey = sourceKey;
    return sourceChanged;
  }

  /** Returns request and preservation facts consumed by GraphTool presentation. */
  getRequestFacts(seriesId) {
    const record = this.seriesRecords.get(seriesId);
    return {
      requestState: record.requestState,
      requestPending: record.requestPromise !== undefined,
      preserveGraphWhileLoading: record.preserveGraphWhileLoading,
      resynchronizationRequested: record.resynchronizationRequested,
      retryAt: record.retryAt,
    };
  }

  /** Returns whether accepted graph data must remain unchanged during a request. */
  preservesGraphWhileLoading() {
    return this.seriesItems.some((item) => this.seriesRecords.get(item.id).preserveGraphWhileLoading);
  }

  /** Reports request work that must enter the next normal card update pass. */
  requiresHassUpdate() {
    return this.dayNightRecord.resynchronizationRequested || this.seriesItems.some((item) => {
      const record = this.seriesRecords.get(item.id);
      return record.resynchronizationRequested || record.acceptedResultPending;
    });
  }

  /**
   * Schedules the next visible bucket and local-calendar boundary. Repeated HA
   * state updates recalculate the same absolute deadlines instead of extending
   * them, so normal entity traffic cannot postpone a graph transition.
   *
   * @param {string} chartType - Active parent chart type.
   * @param {string|number} stateBandsInterval - Exact state-band update interval.
   * @param {number} binsPerHour - Shared Series bin density.
   */
  scheduleTimeBoundaryUpdates(chartType, stateBandsInterval, binsPerHour) {
    this.refreshTiming = { chartType, stateBandsInterval, binsPerHour };
    globalThis.clearTimeout(this.binBoundaryTimer);
    globalThis.clearTimeout(this.calendarRangeTimer);
    this.binBoundaryTimer = undefined;
    this.calendarRangeTimer = undefined;

    if (!this.connectedToCard || !this.periodDurationAvailable) return;

    const historicalItems = this.seriesItems.filter((item) => item.config.period.type !== 'real_time');
    if (historicalItems.length === 0) return;

    this.scheduleNextBinBoundary();
    this.scheduleNextCalendarBoundary();
  }

  /** Schedules only the next active-source bin transition. */
  scheduleNextBinBoundary() {
    globalThis.clearTimeout(this.binBoundaryTimer);
    this.binBoundaryTimer = undefined;
    const historicalItems = this.seriesItems.filter((item) => item.config.period.type !== 'real_time');
    const activeSourceExists = historicalItems.some((item) => item.entity !== undefined && this.getSeriesRange(item).sourceRangeIsActive);
    if (!activeSourceExists) return;

    // State bands advance at their exact configured interval. Every numeric
    // graph advances at the shared bin boundary selected by Series.
    const bucketMs = this.refreshTiming.chartType === 'state_bands'
      ? this.getIntervalMilliseconds(this.refreshTiming.stateBandsInterval)
      : HOUR_MS / this.refreshTiming.binsPerHour;
    const now = Date.now();
    const delay = bucketMs - (now % bucketMs) + 10;

    this.binBoundaryTimer = globalThis.setTimeout(() => {
      this.binBoundaryTimer = undefined;
      if (this.dayNightEnabled && this.dayNightRecord.rows !== undefined) this.buildDayNightSegments();
      this.events.binBoundaryReached();
      this.scheduleNextBinBoundary();
    }, delay);
  }

  /** Schedules only the next local-calendar range transition. */
  scheduleNextCalendarBoundary() {
    globalThis.clearTimeout(this.calendarRangeTimer);
    this.calendarRangeTimer = undefined;
    if (this.plotPeriod.type !== 'calendar') return;

    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);
    const delay = nextMidnight.getTime() - now.getTime() + 10;

    this.calendarRangeTimer = globalThis.setTimeout(() => {
      this.calendarRangeTimer = undefined;

      // A local date transition changes absolute calendar ranges. History
      // identifies exactly which retained sources no longer cover that day.
      this.seriesItems.forEach((item) => {
        if (item.config.period.type === 'real_time') return;

        const range = this.getSeriesRange(item);
        const record = this.seriesRecords.get(item.id);
        const rangeChanged = range.sourceStart.getTime() !== record.sourceRangeStart || range.sourceEnd.getTime() !== record.sourceRangeEnd;
        if (rangeChanged) this.events.seriesHistoryDue(item.id);
      });

      if (this.dayNightEnabled) {
        const range = this.getDayNightRange();
        const rangeChanged = range.start.getTime() !== this.dayNightRecord.rangeStart || range.end.getTime() !== this.dayNightRecord.rangeEnd;
        if (rangeChanged) this.events.dayNightHistoryDue();
      }

      this.scheduleNextCalendarBoundary();
    }, delay);
  }

  /**
   * Schedules one retry or configured refresh against the current Series
   * identity. Source/config replacement clears the timer before it can emit.
   *
   * @param {object} item - Current normalized Series item.
   * @param {number} requestAt - Absolute request deadline in milliseconds.
   */
  scheduleSeriesHistoryRequest(item, requestAt) {
    const record = this.seriesRecords.get(item.id);
    globalThis.clearTimeout(record.requestTimer);

    record.requestTimer = globalThis.setTimeout(() => {
      record.requestTimer = undefined;
      record.retryAt = 0;
      record.resynchronizationRequested = true;
      this.events.seriesHistoryDue(item.id);
    }, Math.max(0, requestAt - Date.now()));
  }

  /**
   * Converts the configured history interval notation to milliseconds. The
   * same conversion drives refresh deadlines now and timer scheduling later.
   *
   * @param {string|number} interval - Configured SAK-style interval.
   * @returns {number} Interval in milliseconds.
   */
  getIntervalMilliseconds(interval) {
    if (typeof interval === 'number') return interval * 1000;

    const match = interval.match(/^(\d+(?:\.\d+)?)(ms|s|sec|m|min|h|hour)$/);
    const value = Number(match[1]);
    const unit = match[2];

    if (unit === 'ms') return value;
    if (unit === 's' || unit === 'sec') return value * 1000;
    if (unit === 'm' || unit === 'min') return value * 60 * 1000;
    return value * HOUR_MS;
  }

  /**
   * Binds the current sun state and forecast to the separate day/night source.
   * A changed HA sun value rebuilds presentation segments from retained history
   * without modifying normal numeric Series records.
   *
   * @param {object} sunEntity - Current Home Assistant sun.sun entity.
   */
  bindDayNightEntity(sunEntity) {
    const sunSignature = JSON.stringify([
      sunEntity.state,
      sunEntity.last_changed,
      sunEntity.attributes.next_rising,
      sunEntity.attributes.next_setting,
    ]);

    this.dayNightRecord.sunEntity = sunEntity;
    if (sunSignature === this.dayNightRecord.sunSignature) return;

    this.dayNightRecord.sunSignature = sunSignature;
    if (this.dayNightRecord.rows !== undefined) this.buildDayNightSegments();
  }

  /** Returns the parent plot range represented by the shared day/night layer. */
  getDayNightRange() {
    const range = this.getSeriesRange({ config: { period: this.plotPeriod } });
    return {
      start: range.plotStart,
      end: range.plotEnd,
      sourceRangeIsActive: range.sourceRangeIsActive,
    };
  }

  /** Returns the clipped sun intervals consumed by GraphTool rendering. */
  getDayNightSegments() {
    return this.dayNightRecord.segments;
  }

  /** Returns day/night request facts for lifecycle and integration tests. */
  getDayNightRequestFacts() {
    return {
      requestPending: this.dayNightRecord.requestPromise !== undefined,
      retryAt: this.dayNightRecord.retryAt,
      resynchronizationRequested: this.dayNightRecord.resynchronizationRequested,
      rangeStart: this.dayNightRecord.rangeStart,
      rangeEnd: this.dayNightRecord.rangeEnd,
    };
  }

  /**
   * Converts historical horizon states and the current Sun forecast into
   * continuous, clipped day/night periods on the parent plot timeline.
   */
  buildDayNightSegments() {
    const range = this.getDayNightRange();
    const rangeStart = range.start.getTime();
    const rangeEnd = range.end.getTime();
    const sunEntity = this.dayNightRecord.sunEntity;
    const horizonStates = this.dayNightRecord.rows.map((row) => ({
      state: row.state === 'above_horizon' ? 'day' : 'night',
      time: new Date(row.last_changed).getTime(),
    }));

    if (range.sourceRangeIsActive) {
      horizonStates.push({
        state: sunEntity.state === 'above_horizon' ? 'day' : 'night',
        time: new Date(sunEntity.last_changed).getTime(),
      });
    }

    if (this.plotPeriod.type === 'calendar' && Number(this.plotPeriod.calendar.offset) === 0) {
      horizonStates.push(
        { state: 'day', time: new Date(sunEntity.attributes.next_rising).getTime() },
        { state: 'night', time: new Date(sunEntity.attributes.next_setting).getTime() },
      );
    }

    horizonStates.sort((first, second) => first.time - second.time);
    const transitions = [];
    horizonStates.forEach((horizonState) => {
      if (horizonState.time > rangeEnd) return;
      const previous = transitions[transitions.length - 1];
      if (previous && previous.state === horizonState.state) return;
      transitions.push(horizonState);
    });

    const segments = [];
    transitions.forEach((transition, index) => {
      const start = Math.max(rangeStart, transition.time);
      const end = Math.min(rangeEnd, index < transitions.length - 1 ? transitions[index + 1].time : rangeEnd);
      if (start >= end) return;

      segments.push({
        state: transition.state,
        start: new Date(start),
        end: new Date(end),
      });
    });
    this.dayNightRecord.segments = segments;
  }

  /**
   * Requests the separate sun history represented by the parent period. The
   * accepted rows build only the background intervals and never enter numeric
   * Series loading or bin processing.
   *
   * @param {object} hass - Home Assistant API client.
   * @returns {object} Start decision and completion promise.
   */
  requestDayNightHistory(hass) {
    const record = this.dayNightRecord;
    const range = this.getDayNightRange();
    const representedRange = record.rows !== undefined
      && (this.plotPeriod.type === 'rolling_window'
        ? record.rangeStart <= range.start.getTime()
        : record.rangeStart === range.start.getTime() && record.rangeEnd === range.end.getTime());

    if (record.requestPromise !== undefined || Date.now() < record.retryAt) {
      return { started: false, representedRange, range };
    }
    if (representedRange && !record.resynchronizationRequested) {
      this.buildDayNightSegments();
      return { started: false, representedRange, range };
    }

    const requestEnd = new Date(Math.min(range.end.getTime(), Date.now()));
    const requestedPeriodSignature = record.periodSignature;
    const requestedRangeStart = range.start.getTime();
    const requestedRangeEnd = range.end.getTime();
    const requestNumber = record.requestNumber + 1;
    record.requestNumber = requestNumber;
    const path = this.buildHistoryPath('sun.sun', range.start, requestEnd);

    const requestPromise = hass.callApi('GET', path).then(
      (history) => {
        const requestOwnerStillMatches = this.connectedToCard
          && record.requestNumber === requestNumber
          && record.periodSignature === requestedPeriodSignature;
        if (!requestOwnerStillMatches) {
          return { status: SPARKLINE_HISTORY_RESULT.STALE, retryImmediately: false };
        }

        const currentRange = this.getDayNightRange();
        const rangeStillMatches = this.plotPeriod.type === 'calendar'
          ? currentRange.start.getTime() === requestedRangeStart && currentRange.end.getTime() === requestedRangeEnd
          : range.sourceRangeIsActive
            ? requestedRangeStart <= currentRange.start.getTime()
            : true;
        if (!rangeStillMatches) {
          record.requestPromise = undefined;
          record.resynchronizationRequested = true;
          return { status: SPARKLINE_HISTORY_RESULT.STALE, retryImmediately: true };
        }

        globalThis.clearTimeout(record.requestTimer);
        record.rows = history.length === 0 ? [] : history[0];
        record.rangeStart = range.start.getTime();
        record.rangeEnd = range.end.getTime();
        record.requestPromise = undefined;
        record.requestTimer = undefined;
        record.retryAt = 0;
        record.resynchronizationRequested = false;
        this.buildDayNightSegments();
        return { status: SPARKLINE_HISTORY_RESULT.ACCEPTED, range };
      },
      (error) => {
        const requestStillMatches = this.connectedToCard
          && record.requestNumber === requestNumber
          && record.periodSignature === requestedPeriodSignature;
        if (!requestStillMatches) return { status: SPARKLINE_HISTORY_RESULT.STALE, retryImmediately: false };

        record.requestPromise = undefined;
        record.retryAt = Date.now() + HISTORY_RETRY_MS;
        record.resynchronizationRequested = true;
        globalThis.clearTimeout(record.requestTimer);
        record.requestTimer = globalThis.setTimeout(() => {
          record.requestTimer = undefined;
          record.retryAt = 0;
          this.events.dayNightHistoryDue();
        }, HISTORY_RETRY_MS);
        return { status: SPARKLINE_HISTORY_RESULT.FAILED, error, retryAt: record.retryAt };
      },
    );
    record.requestPromise = requestPromise;

    return {
      started: true,
      representedRange,
      range,
      promise: requestPromise,
    };
  }

  /**
   * Starts one HA history request when the source is missing, stale or due for
   * refresh. History accepts matching rows itself; the returned promise only
   * tells GraphTool what presentation work follows that result.
   *
   * @param {object} item - Bound Series item requesting its effective source.
   * @param {object} hass - Home Assistant API client.
   * @returns {object} Start decision, loading transition and completion promise.
   */
  requestSeriesHistory(item, hass) {
    const record = this.seriesRecords.get(item.id);
    if (!this.periodDurationAvailable) {
      return {
        historyAvailable: false,
        started: false,
        loadingStarted: false,
      };
    }

    const range = this.getSeriesRange(item);
    const representedRange = this.acceptedHistoryContainsRange(item.id, range, item.config.period.type);
    const refreshDue = item.config.history.refresh_interval !== undefined && Date.now() >= record.refreshAt;
    const sourceRangeIsClosed = !range.sourceRangeIsActive;

    if (record.requestPromise !== undefined || record.acceptedResultPending || Date.now() < record.retryAt) {
      return {
        historyAvailable: true,
        started: false,
        loadingStarted: false,
        representedRange,
        range,
      };
    }
    if (sourceRangeIsClosed && representedRange && !record.resynchronizationRequested && !refreshDue) {
      return {
        historyAvailable: true,
        started: false,
        loadingStarted: false,
        representedRange,
        range,
      };
    }
    if (record.rows !== undefined && representedRange && !record.resynchronizationRequested && !refreshDue) {
      return {
        historyAvailable: true,
        started: false,
        loadingStarted: false,
        representedRange,
        range,
      };
    }

    const loadingStarted = !representedRange && record.requestState !== SPARKLINE_REQUEST_STATE.LOADING;
    if (!representedRange) {
      record.preserveGraphWhileLoading = record.rows !== undefined;
    }
    record.requestState = SPARKLINE_REQUEST_STATE.LOADING;

    const requestedSourceKey = record.sourceKey;
    const requestedPeriodSignature = record.periodSignature;
    const requestedRangeStart = range.sourceStart.getTime();
    const requestedRangeEnd = range.sourceEnd.getTime();
    const requestNumber = record.requestNumber + 1;
    record.requestNumber = requestNumber;
    globalThis.clearTimeout(record.requestTimer);
    record.requestTimer = undefined;
    const path = this.buildHistoryPath(item.entity.entity_id, range.sourceStart, range.sourceEnd);

    const requestPromise = hass.callApi('GET', path).then(
      (history) => {
        const currentRecord = this.seriesRecords.get(item.id);
        const requestOwnerStillMatches = this.connectedToCard
          && currentRecord === record
          && record.requestNumber === requestNumber
          && record.sourceKey === requestedSourceKey
          && record.periodSignature === requestedPeriodSignature;

        if (!requestOwnerStillMatches) {
          const retryImmediately = this.connectedToCard && currentRecord === record && record.requestNumber === requestNumber;
          if (retryImmediately) {
            record.requestPromise = undefined;
            record.resynchronizationRequested = true;
          }
          return { status: SPARKLINE_HISTORY_RESULT.STALE, seriesId: item.id, retryImmediately };
        }

        const currentItem = this.seriesItems.find((seriesItem) => seriesItem.id === item.id);
        const currentRange = this.getSeriesRange(currentItem);
        const rangeStillMatches = item.config.period.type === 'calendar'
          ? currentRange.sourceStart.getTime() === requestedRangeStart && currentRange.sourceEnd.getTime() === requestedRangeEnd
          : range.sourceRangeIsActive
            ? requestedRangeStart <= currentRange.sourceStart.getTime()
            : true;
        if (!rangeStillMatches) {
          record.requestPromise = undefined;
          record.resynchronizationRequested = true;
          return { status: SPARKLINE_HISTORY_RESULT.STALE, seriesId: item.id, retryImmediately: true };
        }

        const historyRows = history.length === 0 ? [] : history[0];
        const rebuildGraphConfig = record.preserveGraphWhileLoading;
        this.acceptHistoryRows(currentItem, historyRows, range);
        globalThis.clearTimeout(record.requestTimer);
        record.requestPromise = undefined;
        record.requestTimer = undefined;
        record.retryAt = 0;
        record.preserveGraphWhileLoading = false;
        record.resynchronizationRequested = false;
        record.acceptedResultPending = true;
        record.requestState = SPARKLINE_REQUEST_STATE.LOADED;
        if (currentItem.config.history.refresh_interval !== undefined) {
          record.refreshAt = Date.now() + this.getIntervalMilliseconds(currentItem.config.history.refresh_interval);
          this.scheduleSeriesHistoryRequest(currentItem, record.refreshAt);
        }

        return {
          status: SPARKLINE_HISTORY_RESULT.ACCEPTED,
          seriesId: item.id,
          rows: record.rows,
          range,
          rebuildGraphConfig,
        };
      },
      (error) => {
        const currentRecord = this.seriesRecords.get(item.id);
        const requestStillMatches = this.connectedToCard
          && currentRecord === record
          && record.requestNumber === requestNumber
          && record.sourceKey === requestedSourceKey
          && record.periodSignature === requestedPeriodSignature;

        if (!requestStillMatches) return { status: SPARKLINE_HISTORY_RESULT.STALE, seriesId: item.id, retryImmediately: false };

        record.requestPromise = undefined;
        record.retryAt = Date.now() + HISTORY_RETRY_MS;
        record.resynchronizationRequested = true;
        record.requestState = SPARKLINE_REQUEST_STATE.ERROR;
        this.scheduleSeriesHistoryRequest(item, record.retryAt);
        return { status: SPARKLINE_HISTORY_RESULT.FAILED, seriesId: item.id, error, retryAt: record.retryAt };
      },
    );
    record.requestPromise = requestPromise;

    return {
      historyAvailable: true,
      started: true,
      loadingStarted,
      representedRange,
      range,
      promise: requestPromise,
    };
  }

  /** Builds the Home Assistant history API path for one absolute source range. */
  buildHistoryPath(entityId, start, end) {
    const startTime = encodeURIComponent(start.toISOString());
    const endTime = encodeURIComponent(end.toISOString());
    const filterEntityId = encodeURIComponent(entityId);

    return `history/period/${startTime}?filter_entity_id=${filterEntityId}&end_time=${endTime}&minimal_response&no_attributes`;
  }

  /** Marks an accepted result as published through the current GraphTool pipeline. */
  finishAcceptedResult(seriesId) {
    const record = this.seriesRecords.get(seriesId);
    record.acceptedResultPending = false;
  }

  /** Invalidates requests while retaining accepted rows across a DOM disconnect. */
  disconnected() {
    this.connectedToCard = false;
    this.stopTimeBoundaryUpdates();
    this.seriesRecords.forEach((record) => {
      globalThis.clearTimeout(record.requestTimer);
      record.requestNumber += 1;
      record.requestPromise = undefined;
      record.requestTimer = undefined;
      record.retryAt = 0;
      record.resynchronizationRequested = false;
      record.preserveGraphWhileLoading = false;
      record.acceptedResultPending = false;
      record.requestState = SPARKLINE_REQUEST_STATE.CLOSED;
    });
    globalThis.clearTimeout(this.dayNightRecord.requestTimer);
    this.dayNightRecord.requestNumber += 1;
    this.dayNightRecord.requestPromise = undefined;
    this.dayNightRecord.requestTimer = undefined;
    this.dayNightRecord.retryAt = 0;
    this.dayNightRecord.resynchronizationRequested = false;
  }

  /** Marks active accepted sources for refresh when their card reconnects. */
  connected() {
    this.connectedToCard = true;
    this.seriesItems.forEach((item) => {
      const record = this.seriesRecords.get(item.id);
      if (item.config.period.type === 'real_time') {
        record.requestState = SPARKLINE_REQUEST_STATE.NOT_REQUIRED;
        return;
      }

      if (record.rows !== undefined && this.getSeriesRange(item).sourceRangeIsActive) {
        record.resynchronizationRequested = true;
        record.requestState = SPARKLINE_REQUEST_STATE.LOADING;
      } else if (record.rows !== undefined) {
        record.requestState = SPARKLINE_REQUEST_STATE.LOADED;
      } else {
        record.requestState = this.periodDurationAvailable ? SPARKLINE_REQUEST_STATE.LOADING : SPARKLINE_REQUEST_STATE.NOT_LOADED;
      }
      if (item.config.history.refresh_interval !== undefined && record.rows !== undefined) {
        this.scheduleSeriesHistoryRequest(item, record.refreshAt);
      }
    });
    if (this.dayNightEnabled && this.dayNightRecord.rows !== undefined) {
      this.dayNightRecord.resynchronizationRequested = true;
    }
  }

  /** Stops wall-clock boundaries while retaining accepted source rows. */
  stopTimeBoundaryUpdates() {
    globalThis.clearTimeout(this.binBoundaryTimer);
    globalThis.clearTimeout(this.calendarRangeTimer);
    this.binBoundaryTimer = undefined;
    this.calendarRangeTimer = undefined;
  }

  /** Returns whether this Series already has accepted source records. */
  hasRows(seriesId) {
    return this.seriesRecords.get(seriesId).rows !== undefined;
  }

  /** Returns the prepared records consumed by SparklineGraph. */
  getRows(seriesId) {
    return this.seriesRecords.get(seriesId).rows;
  }

  /** Returns the accepted absolute source boundaries for request reuse. */
  getAcceptedRange(seriesId) {
    const record = this.seriesRecords.get(seriesId);
    return {
      start: record.sourceRangeStart,
      end: record.sourceRangeEnd,
    };
  }

  /** Removes accepted source and prepared records after a source identity change. */
  clearSeries(seriesId) {
    const record = this.seriesRecords.get(seriesId);
    globalThis.clearTimeout(record.requestTimer);
    record.requestNumber += 1;
    record.requestPromise = undefined;
    record.requestTimer = undefined;
    record.sourceRows = undefined;
    record.rows = undefined;
    record.sourceRangeStart = undefined;
    record.sourceRangeEnd = undefined;
    record.acceptedSourceKey = undefined;
    record.refreshAt = 0;
    record.retryAt = 0;
    record.resynchronizationRequested = false;
    record.preserveGraphWhileLoading = false;
    record.acceptedResultPending = false;
    record.requestState = SPARKLINE_REQUEST_STATE.NOT_LOADED;
  }

  /**
   * Stores a matching HA response, adds the live sample when applicable, and
   * publishes normalized records on the shared plot timeline.
   *
   * @param {object} item - Bound Series item and its conversion configuration.
   * @param {Array<object>} historyRows - Rows returned by Home Assistant.
   * @param {object} range - Source and plot boundaries used by the request.
   * @returns {Array<object>} Prepared rows consumed by SparklineGraph.
   */
  acceptHistoryRows(item, historyRows, range) {
    const record = this.seriesRecords.get(item.id);
    record.sourceRows = historyRows.slice();
    record.sourceRangeStart = range.sourceStart.getTime();
    record.sourceRangeEnd = range.sourceEnd.getTime();
    record.acceptedSourceKey = record.sourceKey;
    record.requestState = SPARKLINE_REQUEST_STATE.LOADED;

    if (range.sourceRangeIsActive) this.addCurrentEntityState(item, range);
    else this.buildSeriesRows(item, range);

    return record.rows;
  }

  /**
   * Adds or replaces the current HA measurement in an active source range. A
   * matching timestamp is one measurement, including when the history endpoint
   * already returned that state.
   *
   * @param {object} item - Bound Series item with current HA entity state.
   * @param {object} range - Current source and plot boundaries.
   * @returns {Array<object>} Prepared rows after the current state is included.
   */
  addCurrentEntityState(item, range) {
    const record = this.seriesRecords.get(item.id);
    if (record.sourceRows === undefined || !range.sourceRangeIsActive) return record.rows;

    const currentState = item.entityConfig.attribute !== undefined
      ? item.entity.attributes[item.entityConfig.attribute]
      : item.entity.state;
    const currentRow = {
      ...item.entity,
      state: currentState,
    };
    const currentTime = new Date(currentRow.last_changed).getTime();
    const currentRowIndex = record.sourceRows.findIndex((row) => new Date(row.last_changed).getTime() === currentTime);

    if (currentRowIndex === -1) record.sourceRows.push(currentRow);
    else record.sourceRows[currentRowIndex] = currentRow;

    this.buildSeriesRows(item, range);
    return record.rows;
  }

  /**
   * Converts retained source rows into ordered numeric or categorical records on
   * the shared graph timeline.
   *
   * @param {object} item - Bound Series item and graph configuration.
   * @param {object} range - Source-to-plot offset information.
   * @returns {Array<object>} Complete prepared graph records.
   */
  buildSeriesRows(item, range) {
    const record = this.seriesRecords.get(item.id);
    const rows = record.sourceRows.concat().sort((first, second) => new Date(first.last_changed).getTime() - new Date(second.last_changed).getTime());
    const preparedRows = [];

    rows.forEach((row) => {
      const sourceTime = new Date(row.last_changed);
      const plotTime = new Date(sourceTime);

      if (range.calendarOffsetDays !== undefined) plotTime.setDate(plotTime.getDate() - range.calendarOffsetDays);
      else plotTime.setTime(plotTime.getTime() - range.rollingOffsetDays * DAY_MS);

      if (item.config.sparkline.show.chart_type === 'state_bands') {
        const mappedState = this.stateBandsStateMap.map.find((entry) => String(entry.state) === String(row.state));
        if (mappedState === undefined) return;

        preparedRows.push({
          ...row,
          source_time: sourceTime.toISOString(),
          plot_time: plotTime.toISOString(),
          last_changed: plotTime.toISOString(),
          state: Number(mappedState.value),
          haState: row.state,
        });
        return;
      }

      if (!Number.isFinite(Number(row.state))) return;
      preparedRows.push({
        ...row,
        source_time: sourceTime.toISOString(),
        plot_time: plotTime.toISOString(),
        last_changed: plotTime.toISOString(),
        state: Number(row.state),
        haState: row.state,
      });
    });

    record.rows = preparedRows;
    return record.rows;
  }

  /**
   * Reports whether accepted history covers the requested absolute source range.
   * Active windows receive live measurements separately and therefore require
   * only the accepted older edge; closed calendar snapshots require both edges.
   *
   * @param {string} seriesId - Stable normalized Series ID.
   * @param {object} range - Requested source boundaries.
   * @param {string} periodType - Active period type.
   * @returns {boolean} True when the accepted source can be reused.
   */
  acceptedHistoryContainsRange(seriesId, range, periodType) {
    const record = this.seriesRecords.get(seriesId);
    if (record.rows === undefined) return false;
    if (record.acceptedSourceKey !== record.sourceKey) return false;
    if (range.sourceRangeIsActive) return record.sourceRangeStart <= range.sourceStart.getTime();
    if (periodType === 'rolling_window') return true;
    return record.sourceRangeStart <= range.sourceStart.getTime() && record.sourceRangeEnd >= range.sourceEnd.getTime();
  }

  /**
   * Removes expired live source rows while retaining the state active at the
   * first visible bucket, and returns the range used by graph statistics.
   *
   * @param {object} item - Active Series item.
   * @param {number} pointsPerHour - Shared bin density selected by Series.
   * @returns {object} Plot timestamps used for visible statistics.
   */
  pruneActiveRows(item, pointsPerHour) {
    const record = this.seriesRecords.get(item.id);
    const range = this.getSeriesRange(item);
    const bucketMs = HOUR_MS / pointsPerHour;
    const periodHours = Number(item.config.period[item.config.period.type].duration.hour);
    const plotRangeStart = item.config.sparkline.show.chart_type === 'state_bands'
      ? range.plotStart.getTime()
      : item.config.period.type === 'rolling_window'
        ? Math.floor(range.plotEnd.getTime() / bucketMs) * bucketMs + bucketMs - periodHours * HOUR_MS
        : range.plotStart.getTime();
    const sourceRangeStart = new Date(plotRangeStart);

    if (range.calendarOffsetDays !== undefined) sourceRangeStart.setDate(sourceRangeStart.getDate() + range.calendarOffsetDays);
    else sourceRangeStart.setTime(sourceRangeStart.getTime() + range.rollingOffsetDays * DAY_MS);

    const sortedRows = record.sourceRows.concat().sort((first, second) => new Date(first.last_changed).getTime() - new Date(second.last_changed).getTime());
    let precedingRow;
    const activeRows = [];
    sortedRows.forEach((row) => {
      if (new Date(row.last_changed).getTime() < sourceRangeStart.getTime()) precedingRow = row;
      else activeRows.push(row);
    });

    record.sourceRows = precedingRow ? [precedingRow, ...activeRows] : activeRows;
    this.buildSeriesRows(item, range);
    item.rows = record.rows;

    return {
      start: plotRangeStart,
      end: range.plotActiveEnd.getTime(),
    };
  }
}
