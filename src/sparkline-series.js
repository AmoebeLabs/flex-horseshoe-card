import Merge from './merge.js';
import SparklineGraph from './sparkline-graph.js';
import Utils from './utils.js';

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
    this.items = [];
    this.updateConfig(config);
  }

  /**
   * Builds complete per-series configuration while retaining runtime history
   * and graph state. Public YAML without series enters the same collection as
   * one implicit item; explicit items override the normalized parent config.
   *
   * @param {object} config - Validated static or runtime sparkline configuration.
   */
  updateConfig(config) {
    const hasExplicitSeries = config.series !== undefined;
    const configuredSeries = hasExplicitSeries
      ? config.series
      : [{ id: 'default', entity_index: config.entity_index }];
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
      if (typeof seriesConfig.y_axis === 'string') {
        throw new Error(`[sparklines] series '${seriesConfig.id}' uses y_axis for axis configuration; assign the series with y_axis_id`);
      }
      if (hasExplicitSeries && seriesConfig.period !== undefined) {
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
      if (hasExplicitSeries && !['line', 'area', 'dots', 'bar'].includes(chartType)) {
        throw new Error(`[sparklines] series '${seriesConfig.id}' chart_type must be line, area, dots or bar`);
      }
      ids.add(seriesConfig.id);
    });

    this.items = configuredSeries.map((seriesConfig) => {
      const effectiveConfig = Merge.mergeDeep({}, config, seriesConfig);
      const existingItem = this.items.find((item) => item.id === seriesConfig.id);
      delete effectiveConfig.id;
      delete effectiveConfig.series;

      if (existingItem !== undefined) {
        existingItem.entity_index = seriesConfig.entity_index;
        existingItem.y_axis_id = seriesConfig.y_axis_id ?? 'primary';
        existingItem.config = effectiveConfig;
        return existingItem;
      }

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
    this.hasExplicitSeries = hasExplicitSeries;
  }

  /** Returns the established single-series item for existing renderer paths. */
  get defaultItem() {
    return this.items[0];
  }

  /**
   * Converts one effective series density into a concrete number of hourly
   * buckets. Every value used here is complete after configuration merging.
   *
   * @param {object} config - Effective series configuration.
   * @returns {number} Concrete bins per hour.
   */
  calculateBinsPerHour(config) {
    const periodConfig = config.period[config.period.type];
    const binsPerHour = periodConfig.bins.per_hour;
    if (binsPerHour !== 'auto') return binsPerHour;

    const binsPerHourOptions = [1 / 24, 1 / 12, 0.125, 1 / 6, 0.25, 0.5, 1, 2, 3, 4, 6, 12];
    const widthUnitsPerBinByGraphType = {
      line: 1,
      area: 1,
      dots: 2,
      bar: 2,
      barcode: 2,
      equalizer: 2,
      graded: 2,
      radial_barcode: 5.6,
    };
    const densityFactor = {
      low: 2,
      medium: 1,
      high: 0.5,
    };
    const graphType = config.sparkline.show.chart_type;
    const availableWidth = graphType === 'radial_barcode' ? Math.PI * config.width : config.width;
    const widthUnitsPerBin = widthUnitsPerBinByGraphType[graphType] * densityFactor[periodConfig.bins.density];
    const maximumBinsPerHour = availableWidth / widthUnitsPerBin / periodConfig.duration.hour;

    for (let index = binsPerHourOptions.length - 1; index >= 0; index -= 1) {
      if (binsPerHourOptions[index] <= maximumBinsPerHour) return binsPerHourOptions[index];
    }
    return binsPerHourOptions[0];
  }

  /**
   * Chooses one density for the shared x-axis. The most space-demanding item
   * limits every graph so coordinates, ticks, and pointer buckets align.
   *
   * @returns {number} Shared bins per hour.
   */
  calculateSharedBinsPerHour() {
    return Math.min(...this.items.map((item) => this.calculateBinsPerHour(item.config)));
  }

  /**
   * Updates every graph and applies the geometry shared by the collection.
   * Axis margins are measured by the Lit tool; bounds, plot extents, and bar
   * slots are coordinated here before the tool builds its SVG presentation.
   *
   * @param {object} axisMargin - Space measured for shared axes and labels.
   * @param {object} configuredMargin - User-configured plot margin.
   * @param {number} columnSpacing - Horizontal spacing between grouped bars.
   * @param {number} rowSpacing - Vertical spacing used by bar geometry.
   * @returns {object} Shared readiness, axes, and final margin state.
   */
  updateCartesianGraphs(axisMargin, configuredMargin, columnSpacing, rowSpacing) {
    this.items.forEach((item) => {
      item.graph.clearSharedYAxisBounds();
      item.graph.update(item.rows);
    });

    const readyItems = this.items.filter((item) => item.graph.coords.length > 0);
    if (readyItems.length !== this.items.length) {
      return {
        ready: false,
        axisGraphs: { primary: undefined, secondary: undefined },
        axisMargin,
      };
    }

    const primaryItems = readyItems.filter((item) => item.y_axis_id === 'primary');
    const secondaryItems = readyItems.filter((item) => item.y_axis_id === 'secondary');
    const axisGraphs = {
      primary: primaryItems.length > 0 ? primaryItems[0].graph : undefined,
      secondary: secondaryItems.length > 0 ? secondaryItems[0].graph : undefined,
    };

    [primaryItems, secondaryItems].forEach((axisItems) => {
      if (axisItems.length === 0) return;

      const configuredBoundsItem = axisItems.find((item) => item.config.y_axis.lower_bound !== undefined);
      const lowerBound = configuredBoundsItem !== undefined
        ? Number(configuredBoundsItem.config.y_axis.lower_bound)
        : Math.min(...axisItems.map((item) => item.graph.min));
      const upperBound = configuredBoundsItem !== undefined
        ? Number(configuredBoundsItem.config.y_axis.upper_bound)
        : Math.max(...axisItems.map((item) => item.graph.max));

      axisItems.forEach((item) => {
        item.graph.setSharedYAxisBounds(lowerBound, upperBound);
        item.graph.update(item.rows);
      });
    });

    const barItems = readyItems.filter((item) => item.config.sparkline.show.chart_type === 'bar');
    readyItems.forEach((item) => {
      item.graph.setGraphAreas(axisMargin, configuredMargin, item.graph.coords.length, { t: 0, r: 0, b: 0, l: 0 });
      item.graph.update(item.rows);
    });

    const sharedChartGeometryMargin = { t: 0, r: 0, b: 0, l: 0 };
    this.items.forEach((item) => {
      const chartType = item.config.sparkline.show.chart_type;
      const rendersDots = chartType === 'dots'
        || item.config.sparkline.show.points === true
        || item.config.sparkline.line.show_dots === true
        || item.config.sparkline.area.show_dots === true;
      if (rendersDots) {
        const dotExtent = Utils.calculateSvgDimension(item.config.sparkline.dots.radius) + item.graph.config.geometry.line_width / 4;
        sharedChartGeometryMargin.t = Math.max(sharedChartGeometryMargin.t, dotExtent);
        sharedChartGeometryMargin.r = Math.max(sharedChartGeometryMargin.r, dotExtent);
        sharedChartGeometryMargin.b = Math.max(sharedChartGeometryMargin.b, dotExtent);
        sharedChartGeometryMargin.l = Math.max(sharedChartGeometryMargin.l, dotExtent);
      }
    });

    barItems.forEach((item, position) => {
      item.barPosition = position;
      item.barTotal = barItems.length;
      const bars = item.graph.getBars(position, barItems.length, columnSpacing, rowSpacing);
      const firstBar = bars[0];
      const lastBar = bars[bars.length - 1];
      const leftOverflow = item.graph.axisArea.x - firstBar.x;
      const rightOverflow = lastBar.x + lastBar.width - (item.graph.axisArea.x + item.graph.axisArea.width);
      sharedChartGeometryMargin.l = Math.max(sharedChartGeometryMargin.l, leftOverflow);
      sharedChartGeometryMargin.r = Math.max(sharedChartGeometryMargin.r, rightOverflow);
    });

    readyItems.forEach((item) => {
      item.graph.setGraphAreas(axisMargin, configuredMargin, item.graph.coords.length, sharedChartGeometryMargin);
      item.graph.update(item.rows);
    });
    barItems.forEach((item) => {
      item.bars = item.graph.getBars(item.barPosition, item.barTotal, columnSpacing, rowSpacing);
    });

    return { ready: true, axisGraphs, axisMargin };
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
