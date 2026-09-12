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
   * @param {boolean} historyDurationReady - Whether the evaluated history period can be requested.
   */
  constructor(plotPeriod, stateBandsStateMap, seriesItems, historyDurationReady) {
    this.seriesRecords = new Map();
    this.connectedToCard = true;
    this.updateConfig(plotPeriod, stateBandsStateMap, seriesItems, historyDurationReady);
  }

  /**
   * Applies evaluated period and state-map configuration while retaining records
   * for Series IDs that still exist.
   *
   * @param {object} plotPeriod - Parent period defining the shared timeline.
   * @param {object} stateBandsStateMap - Valid categorical states and graph values.
   * @param {Array<object>} seriesItems - Current normalized Sparkline Series items.
   * @param {boolean} historyDurationReady - Whether the evaluated history period can be requested.
   * @returns {object} History changes that affect GraphTool scheduling.
   */
  updateConfig(plotPeriod, stateBandsStateMap, seriesItems, historyDurationReady) {
    this.plotPeriod = plotPeriod;
    this.stateBandsStateMap = stateBandsStateMap;
    this.seriesItems = seriesItems;
    this.historyDurationReady = historyDurationReady;
    let periodChanged = false;

    const activeIds = new Set(seriesItems.map((item) => item.id));
    this.seriesRecords.forEach((record, id) => {
      if (!activeIds.has(id)) {
        // Removing a Series also makes every completion created for that source stale.
        record.requestNumber += 1;
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
          loading: false,
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
      if (periodSignature === record.periodSignature) return;

      periodChanged = true;
      record.periodSignature = periodSignature;
      record.requestNumber += 1;
      record.requestPromise = undefined;
      record.retryAt = 0;
      record.resynchronizationRequested = true;
      record.acceptedResultPending = false;

      const requestedRangeIsMissing = item.config.period.type !== 'real_time'
        && historyDurationReady
        && !this.acceptedHistoryContainsRange(item.id, this.getSeriesRange(item), item.config.period.type);
      record.loading = requestedRangeIsMissing;
      record.preserveGraphWhileLoading = requestedRangeIsMissing && record.rows !== undefined;
    });

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
      record.loading = item.config.period.type !== 'real_time' && this.historyDurationReady;
      record.resynchronizationRequested = item.config.period.type !== 'real_time';
    }

    record.sourceKey = sourceKey;
    return sourceChanged;
  }

  /** Returns request and preservation facts consumed by GraphTool presentation. */
  getRequestFacts(seriesId) {
    const record = this.seriesRecords.get(seriesId);
    return {
      loading: record.loading,
      requestPending: record.requestPromise !== undefined,
      preserveGraphWhileLoading: record.preserveGraphWhileLoading,
      resynchronizationRequested: record.resynchronizationRequested,
      retryAt: record.retryAt,
    };
  }

  /** Returns whether at least one Series is waiting for missing history. */
  isLoading() {
    return this.seriesItems.some((item) => this.seriesRecords.get(item.id).loading);
  }

  /** Returns whether accepted graph data must remain unchanged during a request. */
  preservesGraphWhileLoading() {
    return this.seriesItems.some((item) => this.seriesRecords.get(item.id).preserveGraphWhileLoading);
  }

  /** Reports request work that must enter the next normal card update pass. */
  requiresHassUpdate() {
    return this.seriesItems.some((item) => {
      const record = this.seriesRecords.get(item.id);
      return record.resynchronizationRequested || record.acceptedResultPending;
    });
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
    if (!this.historyDurationReady) {
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

    const loadingStarted = !representedRange && !record.loading;
    if (!representedRange) {
      record.loading = true;
      record.preserveGraphWhileLoading = record.rows !== undefined;
    }

    const requestedSourceKey = record.sourceKey;
    const requestedPeriodSignature = record.periodSignature;
    const requestedRangeStart = range.sourceStart.getTime();
    const requestedRangeEnd = range.sourceEnd.getTime();
    const requestNumber = record.requestNumber + 1;
    record.requestNumber = requestNumber;
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
          return { status: 'stale', seriesId: item.id, retryImmediately };
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
          return { status: 'stale', seriesId: item.id, retryImmediately: true };
        }

        const historyRows = history.length === 0 ? [] : history[0];
        const rebuildGraphConfig = record.preserveGraphWhileLoading;
        this.acceptHistoryRows(currentItem, historyRows, range);
        record.requestPromise = undefined;
        record.loading = false;
        record.retryAt = 0;
        record.preserveGraphWhileLoading = false;
        record.resynchronizationRequested = false;
        record.acceptedResultPending = true;
        if (currentItem.config.history.refresh_interval !== undefined) {
          record.refreshAt = Date.now() + this.getIntervalMilliseconds(currentItem.config.history.refresh_interval);
        }

        return {
          status: 'accepted',
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

        if (!requestStillMatches) return { status: 'stale', seriesId: item.id, retryImmediately: false };

        record.requestPromise = undefined;
        record.loading = false;
        record.retryAt = Date.now() + HISTORY_RETRY_MS;
        record.resynchronizationRequested = true;
        return { status: 'failed', seriesId: item.id, error, retryAt: record.retryAt };
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
    this.seriesRecords.forEach((record) => {
      record.requestNumber += 1;
      record.requestPromise = undefined;
      record.loading = false;
      record.retryAt = 0;
      record.resynchronizationRequested = false;
      record.preserveGraphWhileLoading = false;
      record.acceptedResultPending = false;
    });
  }

  /** Marks active accepted sources for refresh when their card reconnects. */
  connected() {
    this.connectedToCard = true;
    this.seriesItems.forEach((item) => {
      if (item.config.period.type === 'real_time') return;

      const record = this.seriesRecords.get(item.id);
      if (record.rows !== undefined && this.getSeriesRange(item).sourceRangeIsActive) {
        record.resynchronizationRequested = true;
      }
    });
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
    record.requestNumber += 1;
    record.requestPromise = undefined;
    record.sourceRows = undefined;
    record.rows = undefined;
    record.sourceRangeStart = undefined;
    record.sourceRangeEnd = undefined;
    record.acceptedSourceKey = undefined;
    record.loading = false;
    record.refreshAt = 0;
    record.retryAt = 0;
    record.resynchronizationRequested = false;
    record.preserveGraphWhileLoading = false;
    record.acceptedResultPending = false;
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
