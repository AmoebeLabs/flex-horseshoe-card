import { SPARKLINE_HISTORY_RESULT, SPARKLINE_REQUEST_STATE } from './sparkline-state.js';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const HISTORY_RETRY_MS = 30 * 1000;

/**
 * Keeps Home Assistant History rows for a Sparkline's Series and optional
 * `sun.sun` day/night background.
 *
 * Covered time ranges reuse rows already returned by HA. Timers advance active
 * graph bins and request History when a calendar period reaches a new day.
 */
export default class SparklineHistory {

  /**
   * Creates the History caches and applies the first Sparkline settings.
   *
   * @param {object} plotPeriod - Sparkline period that sets the shared graph time range.
   * @param {object} stateBandsStateMap - Configured state_map for categorical Sparkline values.
   * @param {Array<object>} seriesItems - Current Sparkline Series and their entity settings.
   * @param {boolean} periodDurationAvailable - Whether the evaluated duration is ready for an HA History request.
   * @param {boolean} dayNightEnabled - Whether this Sparkline requests sun.sun History for its background.
   * @param {object} events - Callbacks into SparklineGraphTool for bin changes and History requests.
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
    this.updateInputs(plotPeriod, stateBandsStateMap, seriesItems, periodDurationAvailable, dayNightEnabled);
  }

  /**
   * Applies current Sparkline settings while keeping rows for Series IDs that remain configured.
   *
   * When a new period needs HA rows outside the saved range, the graph keeps its
   * existing rows until History returns data for the new period. A changed
   * Sparkline period also clears sun.sun rows for the previous day/night range.
   * A smaller period can reuse retained rows; removing a Series cancels its
   * retry timer and makes any late response stale, even if that ID is later reused.
   *
   * @param {object} plotPeriod - Current Sparkline period and shared graph range.
   * @param {object} stateBandsStateMap - Current state_map for categorical graphs.
   * @param {Array<object>} seriesItems - Current Sparkline Series items.
   * @param {boolean} periodDurationAvailable - Whether the current period can be requested from HA.
   * @param {boolean} dayNightEnabled - Whether the Sparkline shows day/night shading.
   * @returns {{periodChanged: boolean}} Whether a Series History period changed.
   */
  updateInputs(plotPeriod, stateBandsStateMap, seriesItems, periodDurationAvailable, dayNightEnabled) {
    this.plotPeriod = plotPeriod;
    this.stateBandsStateMap = stateBandsStateMap;
    this.seriesItems = seriesItems;
    this.periodDurationAvailable = periodDurationAvailable;
    this.dayNightEnabled = dayNightEnabled;
    let periodChanged = false;

    const activeIds = new Set(seriesItems.map((item) => item.id));
    this.seriesRecords.forEach((record, id) => {
      if (!activeIds.has(id)) {

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
          sourceRowsChanged: true,
          sourceRowsReplaced: true,
          sourceRowChanges: [],
          rowsConversionSignature: undefined,
          preparedRowsBySource: new WeakMap(),
          rowsUpdate: { previousRows: undefined, replaced: true, changedFrom: Infinity },
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
      record.acceptedResultPending = false;

      const requestedRangeIsMissing = item.config.period.type !== 'real_time'
        && periodDurationAvailable
        && !this.acceptedHistoryContainsRange(item.id, this.getSeriesRange(item), item.config.period.type);

      record.resynchronizationRequested = requestedRangeIsMissing;
      record.preserveGraphWhileLoading = requestedRangeIsMissing && record.rows !== undefined;
      if (item.config.period.type === 'real_time') record.requestState = SPARKLINE_REQUEST_STATE.NOT_REQUIRED;
      else if (!periodDurationAvailable) record.requestState = SPARKLINE_REQUEST_STATE.NOT_LOADED;
      else if (requestedRangeIsMissing) record.requestState = SPARKLINE_REQUEST_STATE.LOADING;
      else record.requestState = record.rows === undefined ? SPARKLINE_REQUEST_STATE.NOT_LOADED : SPARKLINE_REQUEST_STATE.LOADED;
    });

    const dayNightPeriodSignature = JSON.stringify([dayNightEnabled, plotPeriod]);
    if (dayNightPeriodSignature !== this.dayNightRecord.periodSignature) {

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
   * Selects HA History timestamps for one Series and the shared timestamps for its graph.
   *
   * The Sparkline period and parent offset set the visible graph range. A
   * Series period offset selects another HA source range relative to that
   * parent range, then maps those rows onto the same graph
   * range. Calendar days follow local midnight, including 23- and 25-hour DST
   * days; rolling periods use elapsed hours.
   *
   * @param {object} item - Series whose period selects its HA History range.
   * @returns {object} HA source and visible Sparkline time boundaries.
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
   * Clears this Series' saved History when its configured entity or attribute changes.
   * Rows and pending responses from the previous HA source must not appear on the new Series.
   *
   * @param {object} item - Series with its current HA entity and entity settings.
   * @returns {boolean} Whether the configured entity or attribute changed.
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

  /**
   * Returns whether this Series has a pending HA History request, its request
   * state and retry time, and whether its current graph stays visible while loading.
   */
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

  /** Returns whether any Series keeps its current graph while HA loads a missing range. */
  preservesGraphWhileLoading() {
    return this.seriesItems.some((item) => this.seriesRecords.get(item.id).preserveGraphWhileLoading);
  }

  /** Returns whether a timer or accepted HA response needs another normal FHS setHass update. */
  requiresHassUpdate() {
    return this.dayNightRecord.resynchronizationRequested || this.seriesItems.some((item) => {
      const record = this.seriesRecords.get(item.id);
      return record.resynchronizationRequested || record.acceptedResultPending;
    });
  }

  /**
   * Starts timers for active Sparkline bins and the next local calendar midnight.
   *
   * @param {string} chartType - Current Sparkline chart type.
   * @param {string|number} stateBandsInterval - Configured state_bands update interval.
   * @param {number} binsPerHour - Shared number of graph bins per hour.
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

  /**
   * Calls SparklineGraphTool just after the next active bin boundary so it can
   * add the latest HA state. Wall-clock alignment keeps frequent HA updates
   * from postponing the next graph bin. State bands use their configured
   * update_interval; other charts use the shared Series bin density.
   */
  scheduleNextBinBoundary() {
    globalThis.clearTimeout(this.binBoundaryTimer);
    this.binBoundaryTimer = undefined;
    const historicalItems = this.seriesItems.filter((item) => item.config.period.type !== 'real_time');
    const activeSourceExists = historicalItems.some((item) => item.entity !== undefined && this.getSeriesRange(item).sourceRangeIsActive);
    if (!activeSourceExists) return;

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

  /**
   * At local midnight, checks calendar Series and sun.sun ranges, then asks
   * SparklineGraphTool to load any range that moved to another day.
   */
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
   * Runs a Series History refresh or retry at its deadline, even if other HA states update meanwhile.
   *
   * @param {object} item - Current Sparkline Series item.
   * @param {number} requestAt - Absolute refresh or retry deadline in milliseconds.
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
   * Converts an FHS interval to milliseconds; a number means seconds, while
   * strings can use ms, s/sec, m/min, or h/hour.
   *
   * @param {string|number} interval - State-bands update or History refresh interval.
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
   * Rebuilds day/night shading when HA's current sun state or sunrise/sunset forecast changes.
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

  /** Returns the Sparkline plot range used for sun.sun History, without a Series offset. */
  getDayNightRange() {
    const range = this.getSeriesRange({ config: { period: this.plotPeriod } });
    return {
      start: range.plotStart,
      end: range.plotEnd,
      sourceRangeIsActive: range.sourceRangeIsActive,
    };
  }

  /** Returns the day/night intervals SparklineGraphTool draws behind the graph. */
  getDayNightSegments() {
    return this.dayNightRecord.segments;
  }

  /**
   * Turns sun.sun History transitions into day and night graph segments.
   * For today's calendar range, also uses HA's current state and next sunrise/sunset.
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
   * Reuses sun.sun History when it covers this Sparkline range; otherwise calls
   * HA's History API and rebuilds the day/night background.
   *
   * Responses for a replaced period are discarded; if a calendar day changes
   * during a request, History is requested again for the new day. A failed HA
   * request waits 30 seconds before retrying. sun.sun rows build only the
   * day/night background and never enter a Sparkline Series.
   *
   * @param {object} hass - Current Home Assistant object used for the API request.
   * @returns {object} Whether a request started and, when available, its range and promise.
   */
  requestDayNightHistory(hass) {
    if (!this.connectedToCard) return { started: false };
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

      isCurrent: () => this.connectedToCard && record.requestNumber === requestNumber,
    };
  }

  /**
   * Reuses saved HA rows when they cover this Series range; otherwise requests
   * a missing range, a reconnect resynchronization, or a configured
   * history.refresh_interval update, then converts returned rows for the graph.
   * Waits for the configured period duration to be evaluated before calling HA.
   *
   * FHS waits for the current request before requesting that Series again. If a
   * larger period needs more rows, keep the current graph visible until HA
   * returns the matching History. Ignore responses after this card, Series
   * entity or period changes. Failed requests wait 30 seconds before retrying.
   *
   * @param {object} item - Series whose entity and period select the HA History request.
   * @param {object} hass - Current Home Assistant object used for the API request.
   * @returns {object} Whether History is available and, when available, the selected range and request promise.
   */
  requestSeriesHistory(item, hass) {
    const record = this.seriesRecords.get(item.id);
    if (!this.connectedToCard || !this.periodDurationAvailable) {
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
        const rebuildGraphInput = record.preserveGraphWhileLoading;
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
          rebuildGraphInput,
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

      isCurrent: () => this.connectedToCard
        && this.seriesRecords.get(item.id) === record
        && record.requestNumber === requestNumber,
    };
  }

  /** Builds HA's history/period path for one entity and absolute range, requesting no attributes. */
  buildHistoryPath(entityId, start, end) {
    const startTime = encodeURIComponent(start.toISOString());
    const endTime = encodeURIComponent(end.toISOString());
    const filterEntityId = encodeURIComponent(entityId);

    return `history/period/${startTime}?filter_entity_id=${filterEntityId}&end_time=${endTime}&minimal_response&no_attributes`;
  }

  /** Allows another History request after SparklineGraphTool has processed the accepted rows. */
  finishAcceptedResult(seriesId) {
    const record = this.seriesRecords.get(seriesId);
    record.acceptedResultPending = false;
  }

  /**
   * Stops History timers and makes pending HA responses harmless while the FHS
   * card is detached, while retaining accepted rows for a later reconnect.
   */
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

  /**
   * After the FHS card returns to the DOM or HA reports websocket `ready`, marks
   * missing or active Series ranges and loaded sun.sun History for the next
   * setHass pass. Cached Series rows remain available while HA returns updates.
   */
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
        record.resynchronizationRequested = this.periodDurationAvailable;
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

  /** Stops bin and midnight timers without clearing accepted HA History rows. */
  stopTimeBoundaryUpdates() {
    globalThis.clearTimeout(this.binBoundaryTimer);
    globalThis.clearTimeout(this.calendarRangeTimer);
    this.binBoundaryTimer = undefined;
    this.calendarRangeTimer = undefined;
  }

  hasRows(seriesId) {
    return this.seriesRecords.get(seriesId).rows !== undefined;
  }

  getRows(seriesId) {
    return this.seriesRecords.get(seriesId).rows;
  }

  /**
   * Gives SparklineGraph the accumulated row changes, then starts a new change batch.
   * Several live inserts or pruning steps can be collected before GraphTool reads them.
   *
   * @param {string} seriesId - Configured Sparkline Series ID.
   * @returns {object} Previous/current rows, replacement flag and earliest changed timestamp.
   */
  takeRowsUpdate(seriesId) {
    const record = this.seriesRecords.get(seriesId);
    const update = { ...record.rowsUpdate, rows: record.rows };
    record.rowsUpdate = { previousRows: record.rows, replaced: false, changedFrom: Infinity };
    return update;
  }

  clearSeries(seriesId) {
    const record = this.seriesRecords.get(seriesId);
    globalThis.clearTimeout(record.requestTimer);
    record.requestNumber += 1;
    record.requestPromise = undefined;
    record.requestTimer = undefined;
    record.sourceRows = undefined;
    record.rows = undefined;
    record.sourceRowsChanged = true;
    record.sourceRowsReplaced = true;
    record.sourceRowChanges = [];
    record.rowsConversionSignature = undefined;
    record.preparedRowsBySource = new WeakMap();
    record.rowsUpdate = { previousRows: undefined, replaced: true, changedFrom: Infinity };
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
   * Copies an HA History response in chronological order so live edits do not
   * change HA's array. An empty response replaces old rows; active ranges then
   * add the latest HA state before building graph rows.
   *
   * @param {object} item - Series and entity settings for this History response.
   * @param {Array<object>} historyRows - Rows returned by Home Assistant.
   * @param {object} range - HA source and Sparkline plot boundaries for the request.
   * @returns {Array<object>} Rows prepared for the Sparkline graph.
   */
  acceptHistoryRows(item, historyRows, range) {
    const record = this.seriesRecords.get(item.id);

    record.sourceRows = historyRows.slice();
    record.sourceRowsChanged = true;
    record.sourceRowsReplaced = true;
    record.sourceRowChanges = [];
    record.rowsUpdate.replaced = true;
    record.sourceRangeStart = range.sourceStart.getTime();
    record.sourceRangeEnd = range.sourceEnd.getTime();
    record.acceptedSourceKey = record.sourceKey;
    record.requestState = SPARKLINE_REQUEST_STATE.LOADED;

    if (range.sourceRangeIsActive) this.addCurrentEntityState(item, range);
    else this.buildSeriesRows(item, range);

    return record.rows;
  }

  /**
   * Adds the latest HA entity state or configured attribute to an active History range.
   * A matching timestamp is one sample, including when HA History already
   * returned it; a corrected value replaces that sample. Otherwise inserts
   * delayed live states in timestamp order.
   *
   * @param {object} item - Series with its current HA entity state.
   * @param {object} range - Current HA source and Sparkline plot boundaries.
   * @returns {Array<object>} Updated rows prepared for the Sparkline graph.
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

    let lower = record.sourceRows.length;
    if (lower > 0 && new Date(record.sourceRows[lower - 1].last_changed).getTime() >= currentTime) {
      let upper = lower;
      lower = 0;
      while (lower < upper) {
        const middle = Math.floor((lower + upper) / 2);
        if (new Date(record.sourceRows[middle].last_changed).getTime() < currentTime) lower = middle + 1;
        else upper = middle;
      }
    }
    const previousRow = record.sourceRows[lower];
    if (lower < record.sourceRows.length && new Date(previousRow.last_changed).getTime() === currentTime) {
      record.sourceRows[lower] = currentRow;
      if (previousRow.state !== currentState) {
        record.sourceRowsChanged = true;
        record.sourceRowChanges.push({ previousRow, currentRow });
      } else if (record.preparedRowsBySource.has(previousRow)) {
        // HA can replace an entity while its value and time stay equal. Carry
        // its converted row forward so a later correction can replace that row.
        record.preparedRowsBySource.set(currentRow, record.preparedRowsBySource.get(previousRow));
      }
    } else {
      record.sourceRows.splice(lower, 0, currentRow);
      record.sourceRowsChanged = true;
      record.sourceRowChanges.push({ previousRow: undefined, currentRow });
    }

    this.buildSeriesRows(item, range);
    return record.rows;
  }

  /**
   * Converts HA History into graph rows, mapping state_map values for state_bands
   * or numeric states for other charts. Keeps each HA timestamp in source_time
   * and shifts plot_time so offset Series use the Sparkline's shared graph range.
   * Unchanged HA measurements keep their converted graph rows; a new History
   * response or changed Series offset/state_map converts the retained rows again.
   * If a correction makes a previously valid state unusable, its old graph row
   * is removed. Calendar offsets keep repeated winter-hour samples chronological.
   *
   * @param {object} item - Series and chart settings used to convert HA rows.
   * @param {object} range - HA source and shared Sparkline plot boundaries.
   * @returns {Array<object>} Chronological rows prepared for the graph.
   */
  buildSeriesRows(item, range) {
    const record = this.seriesRecords.get(item.id);
    const categorical = item.config.sparkline.show.chart_type === 'state_bands';
    const conversionSignature = JSON.stringify([range.calendarOffsetDays, range.rollingOffsetDays, categorical, this.stateBandsStateMap]);
    if (!record.sourceRowsChanged && record.rowsConversionSignature === conversionSignature) return record.rows;

    const rebuildRows = record.sourceRowsReplaced || record.rowsConversionSignature !== conversionSignature;
    if (record.rowsConversionSignature !== conversionSignature) {
      record.preparedRowsBySource = new WeakMap();
      record.rowsUpdate.replaced = true;
    }
    let preparedRows = rebuildRows ? [] : record.rows;
    let rowsToConvert = record.sourceRows;

    if (!rebuildRows) {
      rowsToConvert = [];
      // Calendar offsets can place repeated winter-hour samples at the same
      // graph time. Use their original HA time to find the exact row to replace.
      record.sourceRowChanges.forEach(({ previousRow, currentRow }) => {
        if (previousRow !== undefined) {
          const previousPreparedRow = record.preparedRowsBySource.get(previousRow);
          if (previousPreparedRow !== undefined) {
            if (preparedRows === record.rows) preparedRows = record.rows.slice();
            let lower = 0;
            let upper = preparedRows.length;
            while (lower < upper) {
              const middle = Math.floor((lower + upper) / 2);
              const row = preparedRows[middle];
              if (row.last_changed < previousPreparedRow.last_changed
                || (row.last_changed === previousPreparedRow.last_changed && row.source_time < previousPreparedRow.source_time)) lower = middle + 1;
              else upper = middle;
            }
            preparedRows.splice(lower, 1);
          }
        }
        if (currentRow !== undefined) rowsToConvert.push(currentRow);
      });
    }

    rowsToConvert.forEach((row) => {
      let preparedRow;
      if (record.preparedRowsBySource.has(row)) {
        preparedRow = record.preparedRowsBySource.get(row);
      } else {
        const sourceTime = new Date(row.last_changed);
        const plotTime = new Date(sourceTime);

        if (range.calendarOffsetDays !== undefined) plotTime.setDate(plotTime.getDate() - range.calendarOffsetDays);
        else plotTime.setTime(plotTime.getTime() - range.rollingOffsetDays * DAY_MS);

        record.rowsUpdate.changedFrom = Math.min(record.rowsUpdate.changedFrom, plotTime.getTime());

        if (categorical) {
          const mappedState = this.stateBandsStateMap.map.find((entry) => String(entry.state) === String(row.state));
          if (mappedState !== undefined) {
            preparedRow = {
              ...row,
              source_time: sourceTime.toISOString(),
              plot_time: plotTime.toISOString(),
              last_changed: plotTime.toISOString(),
              state: Number(mappedState.value),
              haState: row.state,
            };
          }
        } else if (Number.isFinite(Number(row.state))) {
          preparedRow = {
            ...row,
            source_time: sourceTime.toISOString(),
            plot_time: plotTime.toISOString(),
            last_changed: plotTime.toISOString(),
            state: Number(row.state),
            haState: row.state,
          };
        }
        record.preparedRowsBySource.set(row, preparedRow);
      }
      if (preparedRow === undefined) return;
      if (rebuildRows) preparedRows.push(preparedRow);
      else {

        let lower = preparedRows.length;
        if (lower > 0 && preparedRows[lower - 1].last_changed >= preparedRow.last_changed) {
          let upper = lower;
          lower = 0;
          while (lower < upper) {
            const middle = Math.floor((lower + upper) / 2);
            const previous = preparedRows[middle];
            if (previous.last_changed < preparedRow.last_changed
              || (previous.last_changed === preparedRow.last_changed && previous.source_time < preparedRow.source_time)) lower = middle + 1;
            else upper = middle;
          }
        }
        if (lower === preparedRows.length) {

          if (preparedRows === record.rows) preparedRows = record.rows.concat(preparedRow);
          else preparedRows.push(preparedRow);
        } else {
          if (preparedRows === record.rows) preparedRows = record.rows.slice();
          preparedRows.splice(lower, 0, preparedRow);
        }
      }
    });

    if (rebuildRows && range.calendarOffsetDays !== undefined
      && preparedRows.some((row, index) => index > 0 && row.last_changed < preparedRows[index - 1].last_changed)) {
      preparedRows.sort((first, second) => first.last_changed < second.last_changed ? -1 : first.last_changed > second.last_changed ? 1 : 0);
    }

    const previousRows = record.rows;
    const rowsUnchanged = preparedRows === previousRows || (rebuildRows && previousRows !== undefined
      && previousRows.length === preparedRows.length
      && preparedRows.every((row, index) => row.state === previousRows[index].state
        && row.haState === previousRows[index].haState
        && row.source_time === previousRows[index].source_time
        && row.last_changed === previousRows[index].last_changed));
    if (!rowsUnchanged) record.rows = preparedRows;
    record.sourceRowsChanged = false;
    record.sourceRowsReplaced = false;
    record.sourceRowChanges = [];
    record.rowsConversionSignature = conversionSignature;
    return record.rows;
  }

  /**
   * Checks whether saved HA rows for this Series can supply the requested range.
   * Live ranges need the saved older edge because current entity states are added
   * separately; closed calendar ranges need both saved boundaries.
   *
   * @param {string} seriesId - Configured Sparkline Series ID.
   * @param {object} range - Requested HA source boundaries.
   * @param {string} periodType - Current Series period type.
   * @returns {boolean} Whether saved History can be reused for this range.
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
   * Removes expired rows from an active Series while keeping the last earlier
   * state needed to carry its value into the first visible Sparkline bin. A
   * later wider active or calendar range requests HA rows again if pruning
   * removed the older measurements it needs.
   *
   * @param {object} item - Active historical Series to trim.
   * @param {number} pointsPerHour - Graph bin density used to find the visible start.
   * @returns {{start: number, end: number}} Visible time range used for graph statistics.
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

    let lower = 0;
    let upper = record.sourceRows.length;
    const oldestTime = sourceRangeStart.getTime();
    while (lower < upper) {
      const middle = Math.floor((lower + upper) / 2);
      if (new Date(record.sourceRows[middle].last_changed).getTime() < oldestTime) lower = middle + 1;
      else upper = middle;
    }
    const firstRetainedIndex = Math.max(0, lower - 1);
    if (firstRetainedIndex > 0) {

      for (let index = 0; index < firstRetainedIndex; index++) {
        record.sourceRowChanges.push({ previousRow: record.sourceRows[index], currentRow: undefined });
      }
      record.sourceRows = record.sourceRows.slice(firstRetainedIndex);
      record.sourceRowsChanged = true;
    }

    record.sourceRangeStart = Math.max(record.sourceRangeStart, range.sourceStart.getTime());
    this.buildSeriesRows(item, range);
    item.rows = record.rows;

    return {
      start: plotRangeStart,
      end: range.plotActiveEnd.getTime(),
    };
  }
}
