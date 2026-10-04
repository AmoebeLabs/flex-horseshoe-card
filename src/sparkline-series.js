import SparklineGraph from './sparkline-graph.js';
import ColorStops from './color-stops.js';
import Merge from './merge.js';
import Utils from './utils.js';
import { SPARKLINE_DATA_STATE, SPARKLINE_REQUEST_STATE } from './sparkline-state.js';

/**
 * Coordinates the graph engines belonging to one sparkline layout item.
 *
 * GraphTool supplies complete canonical entries. Series retains their runtime
 * items and coordinates shared bins, axis ranges and graph placement.
 */
export default class SparklineSeries {
  /**
   * Binds complete config to stable series items before runtime state and
   * history are attached. IDs are the identity used by request and tooltip code.
   *
   * @param {object} config - Validated sparkline layout item configuration.
   * @param {object|undefined} sourceConfig - Raw source evaluated for this publication.
   */
  constructor(config, sourceConfig) {
    this.items = [];
    this.binPlan = undefined;
    this.dataState = SPARKLINE_DATA_STATE.NOT_LOADED;
    this.updateConfig(config, sourceConfig);
  }

  /**
   * Rebinds canonical entries while retaining runtime history and graph state.
   *
   * @param {object} config - Validated static or runtime sparkline configuration.
   * @param {object|undefined} sourceConfig - Raw source evaluated for this publication.
   */
  updateConfig(config, sourceConfig) {
    const seriesLayoutSignature = JSON.stringify(config.series.map((seriesConfig) => [
      seriesConfig.id, seriesConfig.y_axis_id, seriesConfig.sparkline.show.chart_type,
    ]));
    if (this.seriesLayoutSignature !== seriesLayoutSignature) {
      this.cartesianLayout = undefined;
      this.radialLayout = undefined;
    }
    this.seriesLayoutSignature = seriesLayoutSignature;

    // Bind canonical entries by ID, and keep only the explicitly authored
    // legacy series override needed to compose each item's active palette.
    this.items = config.series.map((seriesConfig) => {
      const existingItem = this.items.find((item) => item.id === seriesConfig.id);
      if (existingItem !== undefined) {
        existingItem.entity_index = seriesConfig.entity_index;
        existingItem.y_axis_id = seriesConfig.y_axis_id;
        existingItem.config = seriesConfig;
        if (sourceConfig !== undefined) {
          delete existingItem.paint.colorStopsOverride;
          const authoredSeries = sourceConfig.series?.find((entry) => entry.id === seriesConfig.id);
          if (authoredSeries?.sparkline?.colorstops !== undefined) {
            existingItem.paint.colorStopsOverride = structuredClone(authoredSeries.sparkline.colorstops);
          }
        }
        return existingItem;
      }
      const item = {
        id: seriesConfig.id,
        entity_index: seriesConfig.entity_index,
        y_axis_id: seriesConfig.y_axis_id,
        config: seriesConfig,
        paint: {},
        entity: undefined,
        entityConfig: undefined,
        graph: undefined,
        rows: [],
        requestState: SPARKLINE_REQUEST_STATE.NOT_LOADED,
        dataState: SPARKLINE_DATA_STATE.NOT_LOADED,
      };
      const authoredSeries = sourceConfig?.series?.find((entry) => entry.id === seriesConfig.id);
      if (authoredSeries?.sparkline?.colorstops !== undefined) {
        item.paint.colorStopsOverride = structuredClone(authoredSeries.sparkline.colorstops);
      }
      return item;
    });
    this.binPlan = undefined;

    // Every retained item must be current before the collection is current.
    const currentItems = this.items.filter((item) => [SPARKLINE_DATA_STATE.HAS_DATA, SPARKLINE_DATA_STATE.EMPTY].includes(item.dataState));
    const dataItems = this.items.filter((item) => item.dataState === SPARKLINE_DATA_STATE.HAS_DATA);
    this.dataState = currentItems.length !== this.items.length
      ? SPARKLINE_DATA_STATE.NOT_LOADED
      : dataItems.length > 0
        ? SPARKLINE_DATA_STATE.HAS_DATA
        : SPARKLINE_DATA_STATE.EMPTY;
  }

  /** Rebuilds each stable item's active palette from its public definition and authored legacy override. */
  updatePalettePaint(parentColorStops, colorStopMode) {
    this.items.forEach((item) => {
      const publicColorStops = item.config.sparkline.color_stops;
      const inheritedColorStops = publicColorStops !== undefined
        ? ColorStops.normalize(publicColorStops, colorStopMode)
        : parentColorStops;
      item.paint.colorStops = item.paint.colorStopsOverride !== undefined
        ? Merge.mergeDeep({}, inheritedColorStops, item.paint.colorStopsOverride)
        : inheritedColorStops;
    });
  }

  /** Identifies palette inputs that affect numeric scales, grades or ranks, excluding color-only changes. */
  getPaletteCalculationSignature(parentColorStops) {
    return JSON.stringify([
      [parentColorStops.scales, parentColorStops.colors.map((stop) => [stop.value, stop.rank, stop.state])],
      this.items.map((item) => [
        item.id,
        item.paint.colorStops.scales,
        item.paint.colorStops.colors.map((stop) => [stop.value, stop.rank, stop.state]),
      ]),
    ]);
  }

  /**
   * Returns item zero of the normalized collection. It supplies shared
   * presentation such as axes, pointer interaction, and existing statistics;
   * its data, history, and graph lifecycle is identical to every other item.
   */
  get primaryItem() {
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
      radial: 1,
      radial_barcode: 5.6,
    };
    const densityFactor = {
      low: 2,
      medium: 1,
      high: 0.5,
    };
    const graphType = config.sparkline.show.chart_type;
    const availableWidth = ['radial', 'radial_barcode'].includes(graphType) ? SparklineGraph.calculateRadialArcLength(config.width, config.height, config.sparkline.radial.arc_degrees) : config.width;
    const widthUnitsPerBin = widthUnitsPerBinByGraphType[graphType] * densityFactor[periodConfig.bins.density];
    const maximumBinsPerHour = availableWidth / widthUnitsPerBin / periodConfig.duration.hour;

    for (let index = binsPerHourOptions.length - 1; index >= 0; index -= 1) {
      if (binsPerHourOptions[index] <= maximumBinsPerHour) return binsPerHourOptions[index];
    }
    return binsPerHourOptions[0];
  }

  /**
   * Stores the effective bin layout shared by every graph in this collection.
   * The most space-demanding historical series limits the collection so graph
   * coordinates, ticks and pointer buckets remain aligned. Real-time and state
   * bands do not expose a derived bin duration.
   *
   * @returns {object} Effective bins per hour and derived bin duration.
   */
  updateBinPlan() {
    const historicalItems = this.items.filter((item) => item.config.period.type !== 'real_time');

    if (historicalItems.length === 0) {
      this.binPlan = { perHour: undefined, durationHours: undefined };
      return this.binPlan;
    }

    if (historicalItems[0].config.sparkline.show.chart_type === 'state_bands') {
      this.binPlan = { perHour: 1, durationHours: undefined };
      return this.binPlan;
    }

    const perHour = Math.min(...historicalItems.map((item) => this.calculateBinsPerHour(item.config)));
    this.binPlan = { perHour, durationHours: 1 / perHour };
    return this.binPlan;
  }

  /**
   * Updates every graph and applies the geometry shared by the collection.
   * Axis margins are measured by the Lit tool; bounds, plot extents, and bar
   * slots are coordinated here before the tool builds its SVG presentation.
   *
   * @param {Function} measureAxisMargin - Reads shared axes and labels after graph data exists.
   * @param {object} configuredMargin - User-configured plot margin.
   * @param {number} columnSpacing - Horizontal spacing between grouped bars.
   * @param {number} rowSpacing - Vertical spacing used by bar geometry.
   * @returns {object} Shared processed-data state, axes, and final margin state.
   */
  updateCartesianGraphs(measureAxisMargin, configuredMargin, columnSpacing, rowSpacing) {
    this.items.forEach((item) => {
      item.dataState = item.graph.processData(item.rows, item.rowsUpdate);
    });

    const currentItems = this.items.filter((item) => [SPARKLINE_DATA_STATE.HAS_DATA, SPARKLINE_DATA_STATE.EMPTY].includes(item.dataState));
    const dataItems = this.items.filter((item) => item.dataState === SPARKLINE_DATA_STATE.HAS_DATA);
    if (currentItems.length !== this.items.length || dataItems.length === 0) {
      this.cartesianLayout = undefined;
      this.dataState = currentItems.length === this.items.length ? SPARKLINE_DATA_STATE.EMPTY : SPARKLINE_DATA_STATE.NOT_LOADED;
      return {
        dataState: this.dataState,
        axisGraphs: { primary: undefined, secondary: undefined },
      };
    }

    // Paint-only updates retain the measured axes and path coordinates. Every
    // series must agree before reusing a shared plot layout.
    const dataItemIds = JSON.stringify(dataItems.map((item) => item.id));
    const layoutInputs = JSON.stringify([configuredMargin, columnSpacing, rowSpacing]);
    if (this.cartesianLayout !== undefined && this.cartesianLayout.dataItemIds === dataItemIds && this.cartesianLayout.layoutInputs === layoutInputs && dataItems.every((item) => !item.graph.processedDataChanged && !item.graph.geometryConfigChanged)) {
      this.dataState = SPARKLINE_DATA_STATE.HAS_DATA;
      return { dataState: this.dataState, ...this.cartesianLayout, geometryChanged: false };
    }

    dataItems.forEach((item) => {
      item.graph.clearSharedYAxisBounds();
      item.graph.calculateGeometry();
    });

    const primaryItems = dataItems.filter((item) => item.y_axis_id === 'primary');
    const secondaryItems = dataItems.filter((item) => item.y_axis_id === 'secondary');
    const axisGraphs = {
      primary: primaryItems.length > 0 ? primaryItems[0].graph : undefined,
      secondary: secondaryItems.length > 0 ? secondaryItems[0].graph : undefined,
    };

    const axisMargin = measureAxisMargin(axisGraphs);

    [primaryItems, secondaryItems].forEach((axisItems) => {
      if (axisItems.length === 0) return;

      const configuredLowerBoundItem = axisItems.find((item) => item.config.y_axis.lower_bound !== undefined);
      const configuredUpperBoundItem = axisItems.find((item) => item.config.y_axis.upper_bound !== undefined);
      const lowerBound = configuredLowerBoundItem !== undefined ? Number(configuredLowerBoundItem.config.y_axis.lower_bound) : Math.min(...axisItems.map((item) => item.graph.min));
      const upperBound = configuredUpperBoundItem !== undefined ? Number(configuredUpperBoundItem.config.y_axis.upper_bound) : Math.max(...axisItems.map((item) => item.graph.max));

      axisItems.forEach((item) => {
        item.graph.setSharedYAxisBounds(lowerBound, upperBound, configuredLowerBoundItem !== undefined, configuredUpperBoundItem !== undefined);
      });
    });

    const barItems = dataItems.filter((item) => item.config.sparkline.show.chart_type === 'bar');
    dataItems.forEach((item) => {
      item.graph.setGraphAreas(axisMargin, configuredMargin, item.graph.coords.length, { t: 0, r: 0, b: 0, l: 0 });
    });
    // Bar overflow needs positions at the measured axis margin before the
    // shared visual extent is known. Other chart families wait for final area.
    barItems.forEach((item) => item.graph.calculateGeometry());

    const sharedChartGeometryMargin = { t: 0, r: 0, b: 0, l: 0 };
    dataItems.forEach((item) => {
      const chartType = item.config.sparkline.show.chart_type;
      const rendersDots = chartType === 'dots' || item.config.sparkline.show.points === true || item.config.sparkline.line.show_dots === true || item.config.sparkline.area.show_dots === true;
      if (rendersDots) {
        const dotExtent = Utils.calculateSvgDimension(item.config.sparkline.dots.radius) + item.graph.input.geometry.line_width / 4;
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

    dataItems.forEach((item) => {
      item.graph.setGraphAreas(axisMargin, configuredMargin, item.graph.coords.length, sharedChartGeometryMargin);
      item.graph.calculateGeometry();
    });
    barItems.forEach((item) => {
      item.bars = item.graph.getBars(item.barPosition, item.barTotal, columnSpacing, rowSpacing);
      if (this.items.length === 1 && item.config.period.type === 'real_time' && item.config.sparkline.bar.orientation === 'vertical') {
        // The one-value vertical bar uses the whole drawing area as its slot.
        item.bars[0].x = item.graph.drawArea.x + (item.graph.drawArea.width - item.bars[0].width) / 2;
      }
    });

    this.dataState = SPARKLINE_DATA_STATE.HAS_DATA;
    this.cartesianLayout = { axisGraphs, axisMargin, dataItemIds, layoutInputs };
    return { dataState: this.dataState, axisGraphs, axisMargin, geometryChanged: true };
  }

  /**
   * Coordinates radial graph engines without deriving polar coordinates here.
   * Every axis group receives one shared value range; SparklineGraph then maps
   * those values and the shared bins into its own radial geometry.
   *
   * @param {Function} measureAxisMargin - Measures optional radial labels and ticks.
   * @param {object} configuredMargin - User-configured plot margin.
   * @returns {object} Shared readiness, axes and final radial margin state.
   */
  updateRadialGraphs(measureAxisMargin, configuredMargin) {
    this.items.forEach((item) => {
      item.dataState = item.graph.processData(item.rows, item.rowsUpdate);
    });

    const currentItems = this.items.filter((item) => [SPARKLINE_DATA_STATE.HAS_DATA, SPARKLINE_DATA_STATE.EMPTY].includes(item.dataState));
    const dataItems = this.items.filter((item) => item.dataState === SPARKLINE_DATA_STATE.HAS_DATA);
    if (currentItems.length !== this.items.length || dataItems.length === 0) {
      this.radialLayout = undefined;
      this.dataState = currentItems.length === this.items.length ? SPARKLINE_DATA_STATE.EMPTY : SPARKLINE_DATA_STATE.NOT_LOADED;
      return {
        dataState: this.dataState,
        axisGraphs: { primary: undefined, secondary: undefined },
      };
    }

    const dataItemIds = JSON.stringify(dataItems.map((item) => item.id));
    const layoutInputs = JSON.stringify(configuredMargin);
    if (this.radialLayout !== undefined && this.radialLayout.dataItemIds === dataItemIds && this.radialLayout.layoutInputs === layoutInputs && dataItems.every((item) => !item.graph.processedDataChanged && !item.graph.geometryConfigChanged)) {
      this.dataState = SPARKLINE_DATA_STATE.HAS_DATA;
      return { dataState: this.dataState, ...this.radialLayout, geometryChanged: false };
    }

    dataItems.forEach((item) => {
      item.graph.clearSharedYAxisBounds();
      item.graph.calculateGeometry();
    });

    const primaryItems = dataItems.filter((item) => item.y_axis_id === 'primary');
    const secondaryItems = dataItems.filter((item) => item.y_axis_id === 'secondary');
    const axisGraphs = {
      primary: primaryItems.length > 0 ? primaryItems[0].graph : undefined,
      secondary: secondaryItems.length > 0 ? secondaryItems[0].graph : undefined,
    };

    [primaryItems, secondaryItems].forEach((axisItems) => {
      if (axisItems.length === 0) return;

      const configuredLowerBoundItem = axisItems.find((item) => item.config.y_axis.lower_bound !== undefined);
      const configuredUpperBoundItem = axisItems.find((item) => item.config.y_axis.upper_bound !== undefined);
      const lowerBound = configuredLowerBoundItem !== undefined ? Number(configuredLowerBoundItem.config.y_axis.lower_bound) : Math.min(...axisItems.map((item) => item.graph.min));
      const upperBound = configuredUpperBoundItem !== undefined ? Number(configuredUpperBoundItem.config.y_axis.upper_bound) : Math.max(...axisItems.map((item) => item.graph.max));

      axisItems.forEach((item) => {
        item.graph.setSharedYAxisBounds(lowerBound, upperBound, configuredLowerBoundItem !== undefined, configuredUpperBoundItem !== undefined);
        item.graph.buildAxisGeometry();
      });
    });

    const axisMargin = measureAxisMargin(axisGraphs);
    const sharedChartGeometryMargin = { t: 0, r: 0, b: 0, l: 0 };

    // Every radial renderer uses one center and outer radius. Reserve the
    // largest visible line or dot extent for the complete collection.
    dataItems.forEach((item) => {
      const variant = item.config.sparkline.show.chart_variant;
      let extent = 0;

      if (variant !== 'dots' && item.config.sparkline.show.line !== false) {
        extent = item.graph.input.geometry.line_width / 2;
      }
      if (variant === 'dots' || item.config.sparkline.show.points === true || item.config.sparkline.line.show_dots === true || item.config.sparkline.area.show_dots === true) {
        const dotExtent = Utils.calculateSvgDimension(item.config.sparkline.dots.radius) + item.graph.input.geometry.line_width / 4;
        extent = Math.max(extent, dotExtent);
      }

      sharedChartGeometryMargin.t = Math.max(sharedChartGeometryMargin.t, extent);
      sharedChartGeometryMargin.r = Math.max(sharedChartGeometryMargin.r, extent);
      sharedChartGeometryMargin.b = Math.max(sharedChartGeometryMargin.b, extent);
      sharedChartGeometryMargin.l = Math.max(sharedChartGeometryMargin.l, extent);
    });

    dataItems.forEach((item) => {
      item.graph.setGraphAreas(axisMargin, configuredMargin, item.graph.coords.length, sharedChartGeometryMargin);
      item.graph.calculateGeometry();
    });

    this.dataState = SPARKLINE_DATA_STATE.HAS_DATA;
    this.radialLayout = { axisGraphs, axisMargin, dataItemIds, layoutInputs };
    return { dataState: this.dataState, axisGraphs, axisMargin, geometryChanged: true };
  }

  /**
   * Updates the graph for one series after static or runtime config changed.
   * Keeping its instance also keeps the processed bins available when the
   * effective source and bucket plan have not changed.
   *
   * @param {object} item - Coordinator-owned series item.
   * @param {number} width - SVG graph width.
   * @param {number} height - SVG graph height.
   * @param {object} axisMargin - Outer axis and label space.
   * @param {object} configuredMargin - User-configured inner margin.
   * @param {object} graphInput - Engine configuration for the active runtime state.
   * @param {Array<number>} gradeValues - Numeric grade boundaries.
   * @param {Array<object>} gradeRanks - Visual grade ranges.
   * @param {object} stateMap - State-band mapping for the graph engine.
   */
  configureGraph(item, width, height, axisMargin, configuredMargin, graphInput, gradeValues, gradeRanks, stateMap) {
    if (item.graph === undefined) {
      item.graph = new SparklineGraph(width, height, axisMargin, configuredMargin, graphInput, gradeValues, gradeRanks, stateMap);
    } else {
      item.graph.updateGraphInput(width, height, axisMargin, configuredMargin, graphInput, gradeValues, gradeRanks, stateMap);
    }
    item.dataState = item.graph.dataState;
  }

  /** Removes graph geometry while a dynamic period has no valid duration. */
  clearGraphs() {
    this.cartesianLayout = undefined;
    this.radialLayout = undefined;
    this.items.forEach((item) => {
      item.graph = undefined;
      item.dataState = SPARKLINE_DATA_STATE.NOT_LOADED;
    });
    this.dataState = SPARKLINE_DATA_STATE.NOT_LOADED;
  }

  /** Stores the request state reported by the History owner for one item. */
  setRequestState(item, requestState) {
    item.requestState = requestState;
  }

  /** Runs all initialized graph engines against their own normalized rows. */
  updateGraphs() {
    const dataStates = this.items.map((item) => {
      item.dataState = item.graph.update(item.rows, item.rowsUpdate);
      return item.dataState;
    });
    const currentItems = this.items.filter((item) => [SPARKLINE_DATA_STATE.HAS_DATA, SPARKLINE_DATA_STATE.EMPTY].includes(item.dataState));
    this.dataState = currentItems.length !== this.items.length
      ? SPARKLINE_DATA_STATE.NOT_LOADED
      : this.items.some((item) => item.dataState === SPARKLINE_DATA_STATE.HAS_DATA)
        ? SPARKLINE_DATA_STATE.HAS_DATA
        : SPARKLINE_DATA_STATE.EMPTY;
    return dataStates;
  }
}
