import Merge from './merge.js';
import SparklineGraph from './sparkline-graph.js';

/**
 * Coordinates the graph engines belonging to one sparkline item.
 *
 * Existing YAML produces one implicit default item. Explicit series inherit the
 * sparkline item config and override only their own source and graph settings.
 */
export default class SparklineSeries {
  /**
   * Normalizes static config into stable series items before runtime state and
   * history are attached. IDs are the identity used by request and tooltip code.
   *
   * @param {object} config - Validated sparkline layout item configuration.
   */
  constructor(config) {
    const configuredSeries = config.series === undefined
      ? [{ id: 'default', entity_index: config.entity_index }]
      : config.series;
    const ids = new Set();

    configuredSeries.forEach((seriesConfig) => {
      if (typeof seriesConfig.id !== 'string' || seriesConfig.id.length === 0) {
        throw new Error('[sparklines] every series requires a non-empty id');
      }
      if (ids.has(seriesConfig.id)) {
        throw new Error('[sparklines] series ids must be unique');
      }
      if (!Number.isInteger(seriesConfig.entity_index)) {
        throw new Error(`[sparklines] series '${seriesConfig.id}' requires entity_index`);
      }
      if (config.series !== undefined && seriesConfig.period !== undefined) {
        const periodType = config.period.type;
        const periodOverride = seriesConfig.period[periodType];

        // A series may carry offsets for calendar and rolling windows together.
        // Only the parent-selected period branch is active for this sparkline.
        if (periodOverride === undefined || Object.keys(periodOverride).some((key) => key !== 'offset')) {
          throw new Error(`[sparklines] series '${seriesConfig.id}' period may only override ${periodType}.offset`);
        }
        if (!Number.isFinite(Number(periodOverride.offset))) {
          throw new Error(`[sparklines] series '${seriesConfig.id}' period ${periodType}.offset must be numeric`);
        }
      }
      const yAxisId = seriesConfig.y_axis_id ?? 'primary';
      if (!['primary', 'secondary'].includes(yAxisId)) {
        throw new Error(`[sparklines] series '${seriesConfig.id}' y_axis_id must be primary or secondary`);
      }
      const chartType = seriesConfig.sparkline?.show?.chart_type ?? config.sparkline.show.chart_type;
      if (config.series !== undefined && !['line', 'area', 'dots', 'bar'].includes(chartType)) {
        throw new Error(`[sparklines] series '${seriesConfig.id}' chart_type must be line, area, dots or bar`);
      }
      ids.add(seriesConfig.id);
    });

    this.items = configuredSeries.map((seriesConfig) => {
      const effectiveConfig = Merge.mergeDeep({}, config, seriesConfig);
      delete effectiveConfig.id;
      delete effectiveConfig.series;

      return {
        id: seriesConfig.id,
        entity_index: seriesConfig.entity_index,
        y_axis_id: seriesConfig.y_axis_id ?? 'primary',
        config: effectiveConfig,
        entity: undefined,
        entityConfig: undefined,
        graph: undefined,
        stats: {},
        rows: [],
        historySeries: undefined,
        historyPromise: undefined,
        historyRangeStart: undefined,
        historyRangeEnd: undefined,
        historyEntityId: undefined,
        historyLoading: false,
        historyRefreshAt: 0,
        historyResynchronizationRequested: false,
        preserveGraphWhileHistoryLoads: false,
        historyPeriodSignature: JSON.stringify(effectiveConfig.period),
      };
    });
  }

  /** Returns the established single-series item for existing renderer paths. */
  get defaultItem() {
    return this.items[0];
  }

  /**
   * Replaces the graph for one series after static or runtime config changed.
   *
   * @param {object} item - Coordinator-owned series item.
   * @param {number} width - SVG graph width.
   * @param {number} height - SVG graph height.
   * @param {object} axisMargin - Outer axis and label space.
   * @param {object} configuredMargin - User-configured inner margin.
   * @param {object} graphConfig - Engine configuration for the active runtime state.
   * @param {Array<number>} gradeValues - Numeric grade boundaries.
   * @param {Array<object>} gradeRanks - Visual grade ranges.
   * @param {object} stateMap - State-band mapping for the graph engine.
   */
  createGraph(item, width, height, axisMargin, configuredMargin, graphConfig, gradeValues, gradeRanks, stateMap) {
    item.graph = new SparklineGraph(
      width,
      height,
      axisMargin,
      configuredMargin,
      graphConfig,
      gradeValues,
      gradeRanks,
      stateMap,
    );
  }

  /** Removes graph geometry while a dynamic period has no valid duration. */
  clearGraphs() {
    this.items.forEach((item) => { item.graph = undefined; });
  }

  /** Replaces the current normalized rows for one coordinator-owned item. */
  setRows(item, rows) {
    item.rows = rows;
  }

  /** Runs all initialized graph engines against their own normalized rows. */
  updateGraphs() {
    return this.items.map((item) => item.graph.update(item.rows));
  }
}
