import SparklineGraph from './sparkline-graph.js';
import ColorStops from './color-stops.js';
import Merge from './merge.js';
import Utils from './utils.js';
import { SPARKLINE_DATA_STATE, SPARKLINE_REQUEST_STATE } from './sparkline-state.js';

/**
 * Keeps the Series used by one FHS Sparkline and their SparklineGraph instances.
 * It shares binning, axis ranges and chart placement so the graphs line up.
 */
export default class SparklineSeries {

  /**
   * Creates the Series items for this Sparkline config.
   *
   * @param {object} config - Current Sparkline config with translated Series entries.
   * @param {object|undefined} sourceConfig - Original config containing authored per-Series color-stop overrides.
   */
  constructor(config, sourceConfig) {
    this.items = [];
    this.binPlan = undefined;
    this.dataState = SPARKLINE_DATA_STATE.NOT_LOADED;
    this.updateConfig(config, sourceConfig);
  }

  /**
   * Applies the current Series configs while keeping History rows and graphs
   * for Series whose IDs remain in the Sparkline config.
   *
   * @param {object} config - Current Sparkline config with translated Series entries.
   * @param {object|undefined} sourceConfig - Original config used to read authored `sparkline.colorstops` overrides.
   */
  updateConfig(config, sourceConfig) {
    const seriesLayoutSignature = JSON.stringify(config.series.map((seriesConfig) => [
      seriesConfig.id, seriesConfig.y_axis_id, seriesConfig.sparkline.show.chart_type,
    ]));
    // A changed Series ID, axis or chart type changes how the shared graph is laid out.
    if (this.seriesLayoutSignature !== seriesLayoutSignature) {
      this.cartesianLayout = undefined;
      this.radialLayout = undefined;
    }
    this.seriesLayoutSignature = seriesLayoutSignature;

    // Reuse the item with the same ID so its HA History rows and graph survive config updates.
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

    // An empty History response is complete; the Sparkline stays loading only
    // while at least one configured Series has no current result.
    const currentItems = this.items.filter((item) => [SPARKLINE_DATA_STATE.HAS_DATA, SPARKLINE_DATA_STATE.EMPTY].includes(item.dataState));
    const dataItems = this.items.filter((item) => item.dataState === SPARKLINE_DATA_STATE.HAS_DATA);
    this.dataState = currentItems.length !== this.items.length
      ? SPARKLINE_DATA_STATE.NOT_LOADED
      : dataItems.length > 0
        ? SPARKLINE_DATA_STATE.HAS_DATA
        : SPARKLINE_DATA_STATE.EMPTY;
  }

  /**
   * Applies the HA theme's color stops and each Series' configured overrides.
   * A per-Series `sparkline.colorstops` override is merged last.
   *
   * @param {object} parentColorStops - Normalized color stops from the parent Sparkline.
   * @param {string} colorStopMode - Active HA theme mode used to normalize Series color stops.
   */
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

  /**
   * Returns the color-stop inputs that can change Sparkline grade positions
   * or rank ordering; changing only stop colors does not move graph data.
   *
   * @param {object} parentColorStops - Normalized color stops from the parent Sparkline.
   * @returns {string} Comparison value for color-stop scales, numeric values, ranks and states.
   */
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
   * Returns the first Series used for unqualified `fhs_sparkline.*` values and
   * Sparkline statistics. Its graph supplies shared x-axis ticks and pointer input.
   */
  get primaryItem() {
    return this.items[0];
  }

  /**
   * Chooses the History bins per hour for a Series, including automatic density.
   *
   * @param {object} config - Sparkline config for this Series.
   * @returns {number} Configured or automatically selected History bins per hour.
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
    // Automatic bins use only as much detail as the chart width and density can show.
    // Radial charts can use only their visible arc; other chart types use the full width.
    const availableWidth = ['radial', 'radial_barcode'].includes(graphType) ? SparklineGraph.calculateRadialArcLength(config.width, config.height, config.sparkline.radial.arc_degrees) : config.width;
    const widthUnitsPerBin = widthUnitsPerBinByGraphType[graphType] * densityFactor[periodConfig.bins.density];
    const maximumBinsPerHour = availableWidth / widthUnitsPerBin / periodConfig.duration.hour;

    for (let index = binsPerHourOptions.length - 1; index >= 0; index -= 1) {
      if (binsPerHourOptions[index] <= maximumBinsPerHour) return binsPerHourOptions[index];
    }
    return binsPerHourOptions[0];
  }

  /**
   * Chooses one History bin plan for all historical Series in this Sparkline.
   * The lowest bins-per-hour choice keeps their time buckets aligned. Real-time
   * has no History plan, and state_bands has no calculated bin duration.
   *
   * @returns {object} Shared bins per hour and bin duration in hours.
   */
  updateBinPlan() {
    const historicalItems = this.items.filter((item) => item.config.period.type !== 'real_time');

    if (historicalItems.length === 0) {
      this.binPlan = { perHour: undefined, durationHours: undefined };
      return this.binPlan;
    }

    if (historicalItems[0].config.sparkline.show.chart_type === 'state_bands') {
      // State bands use a fixed per-hour request plan and have no calculated bin duration.
      this.binPlan = { perHour: 1, durationHours: undefined };
      return this.binPlan;
    }

    const perHour = Math.min(...historicalItems.map((item) => this.calculateBinsPerHour(item.config)));
    this.binPlan = { perHour, durationHours: 1 / perHour };
    return this.binPlan;
  }

  /**
   * Processes History rows and lays out the Cartesian Series in one shared chart.
   * Series on the same primary or secondary axis use common value bounds.
   *
   * @param {Function} measureAxisMargin - Measures space needed by the visible axis labels.
   * @param {object} configuredMargin - Configured space around the chart area.
   * @param {number} columnSpacing - Space between columns in bar charts.
   * @param {number} rowSpacing - Space between grouped bars.
   * @returns {object} Current data state, shared axes and whether chart geometry changed.
   */
  updateCartesianGraphs(measureAxisMargin, configuredMargin, columnSpacing, rowSpacing) {
    this.items.forEach((item) => {
      item.dataState = item.graph.processData(item.rows, item.rowsUpdate);
    });

    const currentItems = this.items.filter((item) => [SPARKLINE_DATA_STATE.HAS_DATA, SPARKLINE_DATA_STATE.EMPTY].includes(item.dataState));
    const dataItems = this.items.filter((item) => item.dataState === SPARKLINE_DATA_STATE.HAS_DATA);
    // Empty History is ready but contributes no graph; if every Series is empty,
    // return without drawing a chart.
    if (currentItems.length !== this.items.length || dataItems.length === 0) {
      this.cartesianLayout = undefined;
      this.dataState = currentItems.length === this.items.length ? SPARKLINE_DATA_STATE.EMPTY : SPARKLINE_DATA_STATE.NOT_LOADED;
      return {
        dataState: this.dataState,
        axisGraphs: { primary: undefined, secondary: undefined },
      };
    }

    const dataItemIds = JSON.stringify(dataItems.map((item) => item.id));
    const layoutInputs = JSON.stringify([configuredMargin, columnSpacing, rowSpacing]);
    // Paint-only changes need no new axes or SVG coordinates; reuse the measured
    // layout while every Series' data and chart geometry remain unchanged.
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

    // Graphs sharing an axis use the same low and high values so their lines align.
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
    // First place bars against the measured axis area; their overflow sets the
    // extra left and right margins shared by the chart.
    barItems.forEach((item) => item.graph.calculateGeometry());

    const sharedChartGeometryMargin = { t: 0, r: 0, b: 0, l: 0 };
    // Keep the widest dots inside the same drawing area used by every Series.
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
    // Recalculate bar positions inside the final shared chart area.
    barItems.forEach((item) => {
      item.bars = item.graph.getBars(item.barPosition, item.barTotal, columnSpacing, rowSpacing);
      if (this.items.length === 1 && item.config.period.type === 'real_time' && item.config.sparkline.bar.orientation === 'vertical') {
        // A single live value uses the full drawing area as its slot; center its bar.
        item.bars[0].x = item.graph.drawArea.x + (item.graph.drawArea.width - item.bars[0].width) / 2;
      }
    });

    this.dataState = SPARKLINE_DATA_STATE.HAS_DATA;
    this.cartesianLayout = { axisGraphs, axisMargin, dataItemIds, layoutInputs };
    return { dataState: this.dataState, axisGraphs, axisMargin, geometryChanged: true };
  }

  /**
   * Processes History rows and lays out the radial Series around one shared center.
   *
   * @param {Function} measureAxisMargin - Measures space needed by the visible axis labels.
   * @param {object} configuredMargin - Configured space around the chart area.
   * @returns {object} Current data state, shared axes and whether chart geometry changed.
   */
  updateRadialGraphs(measureAxisMargin, configuredMargin) {
    this.items.forEach((item) => {
      item.dataState = item.graph.processData(item.rows, item.rowsUpdate);
    });

    const currentItems = this.items.filter((item) => [SPARKLINE_DATA_STATE.HAS_DATA, SPARKLINE_DATA_STATE.EMPTY].includes(item.dataState));
    const dataItems = this.items.filter((item) => item.dataState === SPARKLINE_DATA_STATE.HAS_DATA);
    // Empty History is ready but contributes no radial graph; if every Series
    // is empty, return without drawing a chart.
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
    // Reuse the shared center and measured axes when Series data and chart geometry are unchanged.
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

    // Radial graphs sharing an axis use the same low and high values.
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
    // Every radial Series shares one center and outer radius. Reserve the
    // largest line or dot extent so no graph exceeds that common drawing area.
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
   * Creates or updates this Series' SparklineGraph with its current SVG size and drawing config.
   * Updating the existing graph lets it keep processed History values when its inputs are unchanged.
   *
   * @param {object} item - Series item receiving the graph.
   * @param {number} width - Width of the Sparkline drawing area in SVG units.
   * @param {number} height - Height of the Sparkline drawing area in SVG units.
   * @param {object} axisMargin - Space reserved for axis labels.
   * @param {object} configuredMargin - Configured chart margins.
   * @param {object} graphInput - Current translated config used by SparklineGraph.
   * @param {number[]} gradeValues - Numeric color-stop values used by graded charts.
   * @param {Array<object>} gradeRanks - Rank values used by rank-order charts.
   * @param {object} stateMap - State labels and colors used by state-band charts.
   */
  configureGraph(item, width, height, axisMargin, configuredMargin, graphInput, gradeValues, gradeRanks, stateMap) {
    if (item.graph === undefined) {
      item.graph = new SparklineGraph(width, height, axisMargin, configuredMargin, graphInput, gradeValues, gradeRanks, stateMap);
    } else {
      item.graph.updateGraphInput(width, height, axisMargin, configuredMargin, graphInput, gradeValues, gradeRanks, stateMap);
    }
    item.dataState = item.graph.dataState;
  }

  /** Removes SparklineGraphs and resets shared layouts when the period has no valid duration. */
  clearGraphs() {
    this.cartesianLayout = undefined;
    this.radialLayout = undefined;
    this.items.forEach((item) => {
      item.graph = undefined;
      item.dataState = SPARKLINE_DATA_STATE.NOT_LOADED;
    });
    this.dataState = SPARKLINE_DATA_STATE.NOT_LOADED;
  }

  /** Stores the HA History request state without changing the Series' graph data state. */
  setRequestState(item, requestState) {
    item.requestState = requestState;
  }

  /** Updates each SparklineGraph, returns per-Series states and stores the combined Sparkline state. */
  updateGraphs() {
    const dataStates = this.items.map((item) => {
      item.dataState = item.graph.update(item.rows, item.rowsUpdate);
      return item.dataState;
    });
    // A completed empty History response is current; the Sparkline is empty only
    // when every Series is current and none has values.
    const currentItems = this.items.filter((item) => [SPARKLINE_DATA_STATE.HAS_DATA, SPARKLINE_DATA_STATE.EMPTY].includes(item.dataState));
    this.dataState = currentItems.length !== this.items.length
      ? SPARKLINE_DATA_STATE.NOT_LOADED
      : this.items.some((item) => item.dataState === SPARKLINE_DATA_STATE.HAS_DATA)
        ? SPARKLINE_DATA_STATE.HAS_DATA
        : SPARKLINE_DATA_STATE.EMPTY;
    return dataStates;
  }
}
