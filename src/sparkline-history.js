const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

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
   */
  constructor(plotPeriod, stateBandsStateMap, seriesItems) {
    this.seriesRecords = new Map();
    this.updateConfig(plotPeriod, stateBandsStateMap, seriesItems);
  }

  /**
   * Applies evaluated period and state-map configuration while retaining records
   * for Series IDs that still exist.
   *
   * @param {object} plotPeriod - Parent period defining the shared timeline.
   * @param {object} stateBandsStateMap - Valid categorical states and graph values.
   * @param {Array<object>} seriesItems - Current normalized Sparkline Series items.
   */
  updateConfig(plotPeriod, stateBandsStateMap, seriesItems) {
    this.plotPeriod = plotPeriod;
    this.stateBandsStateMap = stateBandsStateMap;

    const activeIds = new Set(seriesItems.map((item) => item.id));
    this.seriesRecords.forEach((record, id) => {
      if (!activeIds.has(id)) this.seriesRecords.delete(id);
    });
    seriesItems.forEach((item) => {
      if (!this.seriesRecords.has(item.id)) {
        this.seriesRecords.set(item.id, {
          sourceRows: undefined,
          rows: undefined,
          sourceRangeStart: undefined,
          sourceRangeEnd: undefined,
        });
      }
    });
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
    record.sourceRows = undefined;
    record.rows = undefined;
    record.sourceRangeStart = undefined;
    record.sourceRangeEnd = undefined;
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
