import Utils from './utils';
import { FONT_SIZE } from './const';
import { SPARKLINE_DATA_STATE } from './sparkline-state.js';

export const X = 0;
export const Y = 1;
export const V = 2;
export const Y2 = 3;
export const RX = 4;
export const RY = 5;
// Margin indexes intentionally match X/Y for tuple-based geometry.
export const L = 0; // compatible with X
export const T = 1; // compatible with Y
export const R = 2;
export const B = 3;
export const ONE_HOUR = 1000 * 3600;

/**
 * Turns Home Assistant History rows for one Sparkline Series into time buckets
 * and SVG positions for the selected graph type. The relevant config shape is:
 *
 * period:
 *   type: rolling_window
 *   rolling_window:
 *     duration: { hour: 24 }
 *     bins: { per_hour: 2 }
 * sparkline:
 *   state_values: { aggregate_func: avg }
 *
 * Sparkline History supplies HA measurements and changed rows. SparklineGraph
 * groups them into buckets and recalculates corrected or live buckets.
 * SparklineSeries shares the graph area and axes; SparklineGraphTool draws the results.
 */
export default class SparklineGraph {
  /**
   * Returns the length of a radial Sparkline's configured arc. SparklineSeries
   * uses it to choose bins per hour when the graph uses automatic bin density.
   *
   * @param {number} width - Configured graph width.
   * @param {number} height - Configured graph height.
   * @param {number} arcDegrees - Visible radial arc.
   * @returns {number} Available radial length in SVG units.
   */
  static calculateRadialArcLength(width, height, arcDegrees) {
    return Math.PI * Math.min(Number(width), Number(height)) * (Number(arcDegrees) / 360);
  }

  /**
   * Creates graph calculations for one Sparkline Series from its config and
   * drawing dimensions. SparklineGraphTool uses the resulting bins, axes and
   * SVG coordinates to draw the graph.
   *
   * @param {number} width - SVG graph width.
   * @param {number} height - SVG graph height.
   * @param {object} axisMargin - Space reserved outside the shared axis area.
   * @param {object} configuredMargin - User-configured margin inside the axes.
   * @param {object} graphInput - Validated sparkline configuration.
   * @param {Array<number>} gradeValues - Numeric grade boundaries.
   * @param {Array<object>} gradeRanks - Visual grade ranges.
   * @param {object} stateMap - Numeric mapping for categorical state bands.
   */
  constructor(width, height, axisMargin, configuredMargin, graphInput, gradeValues = [], gradeRanks = [], stateMap = {}) {
    this.graphArea = {};
    this.axisArea = {};
    this.dataArea = {};
    this._history = undefined;
    this.processedRows = undefined;
    this.processedDataKey = undefined;
    this.processedDataRevision = 0;
    this.processedDataChanged = false;
    this.bucketGroups = new Map();
    this.bucketResults = new WeakMap();
    this.bucketConfigKey = undefined;
    this.bucketStart = undefined;
    this.statisticsGroups = [];
    this.firstBucketRow = undefined;
    this.firstBucketGroup = undefined;
    this.geometryInputSignature = undefined;
    this.geometryResultSignature = undefined;
    this.geometryConfigChanged = true;
    this.dataConfigSignature = undefined;
    this.dataConfigChanged = true;
    this.geometryChanged = false;
    this.dataState = SPARKLINE_DATA_STATE.NOT_LOADED;
    this.processedValues = [];
    this.processedMinValues = [];
    this.processedMaxValues = [];
    this.coords = [];
    this.bucketMeta = [];
    this.statistics = {};
    this._endTime = 0;
    this.valuesPerBucket = 0;
    this.levelCount = 1;
    this.stateBandSegments = [];
    this.stateBandTransitions = [];
    this.xAxis = {};
    this.yAxis = {};
    this._max = 0;
    this._min = 0;
    this.sharedYAxisBounds = undefined;
    this.updateGraphInput(width, height, axisMargin, configuredMargin, graphInput, gradeValues, gradeRanks, stateMap);
  }

  /**
   * Applies graph settings while keeping the processed History bins. The next
   * data update compares the period, bin settings and History rows before reusing them.
   *
   * @param {number} width - SVG graph width.
   * @param {number} height - SVG graph height.
   * @param {object} axisMargin - Outer axis and label space.
   * @param {object} configuredMargin - User-configured plot margin.
   * @param {object} graphInput - Validated graph configuration.
   * @param {Array<number>} gradeValues - Numeric grade boundaries.
   * @param {Array<object>} gradeRanks - Visual grade ranges.
   * @param {object} stateMap - State-band mapping.
   */
  updateGraphInput(width, height, axisMargin, configuredMargin, graphInput, gradeValues, gradeRanks, stateMap) {
    const chartType = graphInput.sparkline.show.chart_type;
    const radial = chartType === 'radial';
    const radialBarcode = chartType === 'radial_barcode';
    const lineOrArea = chartType === 'line' || chartType === 'area' || radial;
    // SparklineSeries uses these settings to decide whether History bins must be
    // rebuilt or only the graph's SVG positions need updating.
    const graphFamily = radial ? graphInput.sparkline.show.chart_variant : chartType;
    const dataConfigSignature = JSON.stringify([
      graphInput.period,
      graphInput.sparkline.state_values.aggregate_func,
      graphFamily,
      graphFamily === 'line' ? graphInput.sparkline.line.show.minmax : graphFamily === 'area' && graphInput.sparkline.area.show.minmax,
      chartType === 'graded' ? gradeValues : undefined,
      chartType === 'state_bands' ? stateMap.map.map((entry) => [entry.state, entry.value]) : undefined,
    ]);
    this.dataConfigChanged = this.dataConfigChanged || this.dataConfigSignature !== dataConfigSignature;
    this.dataConfigSignature = dataConfigSignature;
    // These settings determine axes, data positions and chart shapes.
    // SparklineGraphTool applies color stops, fill, stroke and opacity when it paints the SVG.
    const geometryInputSignature = JSON.stringify([
      width,
      height,
      axisMargin,
      configuredMargin,
      graphInput.geometry,
      graphInput.labelLocale,
      graphInput.period,
      chartType,
      graphInput.sparkline.show.chart_variant,
      graphInput.sparkline.show.chart_viz,
      graphInput.sparkline.show.line,
      graphInput.sparkline.show.points,
      graphInput.sparkline.show.axis,
      graphInput.sparkline.show.tickmarks,
      graphInput.sparkline.show.labels,
      graphInput.sparkline.show.xlabels_at,
      graphInput.sparkline.show.ylabels_at,
      graphInput.sparkline.state_values.logarithmic,
      graphInput.sparkline.state_values.smoothing,
      lineOrArea ? graphInput.sparkline.line.show_dots : undefined,
      lineOrArea ? graphInput.sparkline.area.show_dots : undefined,
      chartType === 'dots' || lineOrArea ? graphInput.sparkline.dots.radius : undefined,
      radial ? [graphInput.sparkline.radial.arc_degrees, graphInput.sparkline.radial.rotate, graphInput.sparkline.radial.size] : undefined,
      radialBarcode ? [graphInput.sparkline.radial_barcode.arc_degrees, graphInput.sparkline.radial_barcode.rotate, graphInput.sparkline.radial_barcode.size] : undefined,
      chartType === 'bar' ? graphInput.sparkline.bar.orientation : undefined,
      chartType === 'equalizer' || chartType === 'graded' ? graphInput.sparkline.equalizer.value_buckets : undefined,
      [graphInput.x_axis.labels.max_length, graphInput.x_axis.labels.offset, graphInput.x_axis.labels.styles['font-size'], graphInput.x_axis.labels.styles['text-anchor'], graphInput.x_axis.tickmarks_major.size],
      [graphInput.y_axis.lower_bound, graphInput.y_axis.upper_bound, graphInput.y_axis.labels.offset, graphInput.y_axis.labels.styles['font-size'], graphInput.y_axis.tickmarks_major.size],
      chartType === 'graded' ? gradeValues : undefined,
      chartType === 'graded' ? gradeRanks.map((rank) => [rank.rank, rank.value, rank.rangeMin, rank.rangeMax]) : undefined,
      chartType === 'state_bands' ? stateMap.map : undefined,
    ]);
    this.geometryConfigChanged = this.geometryConfigChanged || this.geometryInputSignature !== geometryInputSignature;
    this.geometryInputSignature = geometryInputSignature;
    this.input = graphInput;
    this.width = width;
    this.height = height;
    // graphArea is the full SVG size. SparklineGraphTool measures axis labels
    // and passes their outer space to setGraphAreas().
    this.graphArea = { x: 0, y: 0, width, height };
    if (this.geometryConfigChanged) {
      this.setGraphAreas(axisMargin, configuredMargin, 0);
      this.sharedYAxisBounds = undefined;
    }
    // Real-time represents one current value. Historical graphs use their
    // configured duration and bins to position values on the time axis.
    if (this.input.period.type === 'real_time') {
      this.points = 1;
      this.hours = 1;
    } else {
      const period = this.input.period[this.input.period.type];
      this.points = period.bins.per_hour;
      this.hours = period.duration.hour;
    }
    this.aggregateFuncName = this.input.sparkline.state_values.aggregate_func;
    this._smoothing = this.input.sparkline.state_values?.smoothing;
    this._logarithmic = this.input.sparkline.state_values?.logarithmic;
    this._groupBy = this.input.period.group_by;
    this.gradeValues = gradeValues;
    this.gradeRanks = gradeRanks;
    this.stateMap = { ...stateMap };
  }

  /**
   * Calculates min, time-weighted average and max for the rows visible in this
   * Sparkline. Historical averages account for how long each HA state lasted.
   * Real-time graphs use the current entity value and its HA timestamp.
   *
   * @param {Array<object>} series - HA History rows or the current entity value.
   * @param {object|undefined} statisticsRange - Visible start and end timestamps.
   * @param {string|undefined} currentStateTime - HA timestamp for the current value.
   * @returns {object} Stored min, average, max and matching timestamps.
   */
  updateStatistics(series, statisticsRange, currentStateTime) {
    if (this.input.period.type === 'real_time') {
      const state = Number(series[0].state);
      this.statistics = {
        min: state,
        avg: state,
        max: state,
        min_time: currentStateTime,
        max_time: currentStateTime,
      };
      return this.statistics;
    }

    if (series.length === 0) {
      this.statistics = {};
      return this.statistics;
    }

    if (series === this.processedRows && this.statisticsGroups.length > 0) {
      // Reuse the summaries for completed History bins and calculate the
      // time-weighted average for the requested visible range.
      const rangeStart = statisticsRange ? statisticsRange.start : new Date(series[0].last_changed).getTime();
      const rangeEnd = statisticsRange ? statisticsRange.end : Date.now();
      let min = Infinity;
      let max = -Infinity;
      let minTime;
      let maxTime;
      let minTimestamp;
      let maxTimestamp;
      let weightedValue = 0;
      let weightedDuration = 0;
      let previousResult;
      this.statisticsGroups.forEach((group) => {
        if (group === undefined) return;
        let result = this.calculateBucketResult(group);
        if (result.firstTime > rangeEnd) return;
        if (result.lastTime > rangeEnd) {
          // Source snapshots can contain measurements beyond a requested
          // statistics end. Include only the visible prefix of that edge bin.
          const visibleRows = group.filter((row) => new Date(row.last_changed).getTime() <= rangeEnd);
          result = this.calculateBucketResult(visibleRows);
        }
        if (result.min < min) {
          min = result.min;
          minTime = result.minTime;
          minTimestamp = result.minTimestamp;
        }
        if (result.max > max) {
          max = result.max;
          maxTime = result.maxTime;
          maxTimestamp = result.maxTimestamp;
        }
        if (previousResult !== undefined) {
          const duration = Math.max(0, Math.min(result.firstTime, rangeEnd) - Math.max(previousResult.lastTime, rangeStart));
          weightedValue += previousResult.last * duration;
          weightedDuration += duration;
        }
        if (result.firstTime >= rangeStart) {
          weightedValue += result.weightedValue;
          weightedDuration += result.lastTime - result.firstTime;
        } else {
          // When the visible start falls inside the first bin, weight each
          // measurement only from that start onward.
          result.measurements.forEach((measurement, index) => {
            if (index === result.measurements.length - 1) return;
            const duration = Math.max(0, result.measurements[index + 1].time - Math.max(measurement.time, rangeStart));
            weightedValue += measurement.value * duration;
            weightedDuration += duration;
          });
        }
        previousResult = result;
      });
      const duration = Math.max(0, rangeEnd - Math.max(previousResult.lastTime, rangeStart));
      weightedValue += previousResult.last * duration;
      weightedDuration += duration;
      this.statistics = {
        min,
        avg: weightedValue / weightedDuration,
        max,
        min_time: minTime < rangeStart ? new Date(rangeStart).toISOString() : minTimestamp,
        max_time: maxTime < rangeStart ? new Date(rangeStart).toISOString() : maxTimestamp,
      };
      return this.statistics;
    }

    // Sparkline History rows are already chronological. Use their order to
    // calculate how long each HA state remained active.
    const measurements = series.map((item) => ({ item, value: Number(item.state), time: new Date(item.last_changed).getTime() }));
    const rangeStart = statisticsRange ? statisticsRange.start : measurements[0].time;
    const rangeEnd = statisticsRange ? statisticsRange.end : Date.now();
    const visibleSeries = measurements.filter((measurement) => measurement.time <= rangeEnd);
    const values = visibleSeries.map((measurement) => measurement.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const minMeasurement = visibleSeries.find((measurement) => measurement.value === min);
    const maxMeasurement = visibleSeries.find((measurement) => measurement.value === max);
    const min_time = minMeasurement.time < rangeStart ? new Date(rangeStart).toISOString() : minMeasurement.item.last_changed;
    const max_time = maxMeasurement.time < rangeStart ? new Date(rangeStart).toISOString() : maxMeasurement.item.last_changed;
    let weightedValue = 0;
    let weightedDuration = 0;

    // Weight each HA state by how long it remained active in the visible
    // period, so the average reflects duration.
    visibleSeries.forEach((measurement, index) => {
      const nextItemStart = index < visibleSeries.length - 1 ? visibleSeries[index + 1].time : rangeEnd;
      const startTime = Math.max(measurement.time, rangeStart);
      const endTime = Math.min(nextItemStart, rangeEnd);
      const duration = Math.max(0, endTime - startTime);

      weightedValue += measurement.value * duration;
      weightedDuration += duration;
    });

    const avg = weightedValue / weightedDuration;
    this.statistics = { min, avg, max, min_time, max_time };
    return this.statistics;
  }

  /**
   * Reserves space for axis labels and configured margins, then calculates the
   * SVG area available to the selected graph shapes. Bars reserve half a final bar at both time endpoints;
   * dots reserve their radius and inherited stroke around every coordinate.
   * Other chart families use only the configured margin.
   *
   * @param {object} axisMargin - Space occupied by visible axes and labels.
   * @param {object} configuredMargin - User-configured margin inside the axes.
   * @param {number} bucketCount - Number of visible data coordinates.
   * @param {object|undefined} sharedChartGeometryMargin - Series-wide visual extent.
   * @returns {boolean} Whether axisArea or dataArea changed.
   */
  setGraphAreas(axisMargin, configuredMargin, bucketCount, sharedChartGeometryMargin = undefined) {
    const previousAxisArea = this.axisArea;
    const previousDataArea = this.dataArea;
    const chartType = this.input.sparkline.show.chart_type;
    let rendersDots = chartType === 'dots';
    let chartTop = 0;
    let chartRight = 0;
    let chartBottom = 0;
    let chartLeft = 0;

    if (chartType === 'line') {
      rendersDots = this.input.sparkline.show.points === true || this.input.sparkline.line.show_dots === true;
    }
    if (chartType === 'radial') {
      const radialVariant = this.input.sparkline.show.chart_variant;
      rendersDots = radialVariant === 'dots' || this.input.sparkline.show.points === true || this.input.sparkline.line.show_dots === true || this.input.sparkline.area.show_dots === true;
      if (radialVariant !== 'dots' && this.input.sparkline.show.line !== false) {
        const lineExtent = this.input.geometry.line_width / 2;
        chartTop = lineExtent;
        chartRight = lineExtent;
        chartBottom = lineExtent;
        chartLeft = lineExtent;
      }
    }

    if (chartType === 'area') {
      rendersDots = this.input.sparkline.show.points === true || this.input.sparkline.area.show_dots === true;
    }

    if (rendersDots) {
      const radius = Utils.calculateSvgDimension(this.input.sparkline.dots.radius);
      const inheritedStrokeWidth = this.input.geometry.line_width / 2;
      const dotExtent = radius + inheritedStrokeWidth / 2;
      chartTop = Math.max(chartTop, dotExtent);
      chartRight = Math.max(chartRight, dotExtent);
      chartBottom = Math.max(chartBottom, dotExtent);
      chartLeft = Math.max(chartLeft, dotExtent);
    }

    if (chartType === 'bar' && bucketCount > 1) {
      const axisWidth = this.width - axisMargin.l - axisMargin.r;
      const configuredDataWidth = axisWidth - configuredMargin.l - configuredMargin.r;
      // N inclusive bucket centers span dataArea. Solving the final bar width
      // here keeps the first and last half-bars exactly inside axisArea.
      const finalBarWidth = Math.max(1, (configuredDataWidth + this.input.geometry.column_spacing) / bucketCount - this.input.geometry.column_spacing);
      chartLeft = finalBarWidth / 2;
      chartRight = finalBarWidth / 2;
    }

    if (sharedChartGeometryMargin !== undefined) {
      chartTop = sharedChartGeometryMargin.t;
      chartRight = sharedChartGeometryMargin.r;
      chartBottom = sharedChartGeometryMargin.b;
      chartLeft = sharedChartGeometryMargin.l;
    }

    const effectiveMargin = {
      t: configuredMargin.t + chartTop,
      r: configuredMargin.r + chartRight,
      b: configuredMargin.b + chartBottom,
      l: configuredMargin.l + chartLeft,
    };

    this.axisMargin = { ...axisMargin };
    this.chartGeometryMargin = {
      t: chartTop,
      r: chartRight,
      b: chartBottom,
      l: chartLeft,
      x: chartLeft,
      y: chartTop,
    };
    this.effectiveMargin = {
      ...effectiveMargin,
      x: effectiveMargin.l,
      y: effectiveMargin.t,
    };
    this.axisArea = {
      x: axisMargin.l,
      y: axisMargin.t,
      width: this.width - axisMargin.l - axisMargin.r,
      height: this.height - axisMargin.t - axisMargin.b,
    };
    this.dataArea = {
      x: this.axisArea.x + effectiveMargin.l,
      y: this.axisArea.y + effectiveMargin.t,
      top: this.axisArea.y + effectiveMargin.t,
      bottom: axisMargin.b + effectiveMargin.b,
      width: this.axisArea.width - effectiveMargin.l - effectiveMargin.r,
      height: this.axisArea.height - effectiveMargin.t - effectiveMargin.b,
    };
    this.drawArea = this.dataArea;
    this.margin = {
      t: axisMargin.t + effectiveMargin.t,
      r: axisMargin.r + effectiveMargin.r,
      b: axisMargin.b + effectiveMargin.b,
      l: axisMargin.l + effectiveMargin.l,
      x: axisMargin.l + effectiveMargin.l,
      y: axisMargin.t + effectiveMargin.t,
    };

    return (
      previousAxisArea.x !== this.axisArea.x ||
      previousAxisArea.y !== this.axisArea.y ||
      previousAxisArea.width !== this.axisArea.width ||
      previousAxisArea.height !== this.axisArea.height ||
      previousDataArea.x !== this.dataArea.x ||
      previousDataArea.y !== this.dataArea.y ||
      previousDataArea.width !== this.dataArea.width ||
      previousDataArea.height !== this.dataArea.height
    );
  }

  /**
   * Returns the upper numeric bound used by graph geometry.
   *
   * @returns {number} Active upper bound.
   */
  get max() {
    return this._max;
  }

  /**
   * Sets the upper numeric bound used by graph geometry.
   *
   * @param {number} max - Active upper bound.
   */
  set max(max) {
    this._max = max;
  }

  /**
   * Returns the lower numeric bound used by graph geometry.
   *
   * @returns {number} Active lower bound.
   */
  get min() {
    return this._min;
  }

  /**
   * Sets the lower numeric bound used by graph geometry.
   *
   * @param {number} min - Active lower bound.
   */
  set min(min) {
    this._min = min;
  }

  /**
   * Uses the y-axis range shared by the other Series in this Sparkline. Each
   * graph builds its own ticks and paths with values at the same SVG y positions.
   *
   * @param {number} lowerBound - Shared data or configured minimum.
   * @param {number} upperBound - Shared data or configured maximum.
   * @param {boolean} fixedLowerBound - Whether the user configured the minimum.
   * @param {boolean} fixedUpperBound - Whether the user configured the maximum.
   */
  setSharedYAxisBounds(lowerBound, upperBound, fixedLowerBound, fixedUpperBound) {
    this.sharedYAxisBounds = { lowerBound, upperBound, fixedLowerBound, fixedUpperBound };
  }

  /** Clears the shared bounds before the next automatic range measurement. */
  clearSharedYAxisBounds() {
    this.sharedYAxisBounds = undefined;
  }

  /**
   * Processes HA History rows and calculates SVG positions when the current
   * History response contains data. Reuses bins and geometry when their inputs are unchanged.
   *
   * @param {Array<object>|undefined} history - Graph source rows.
   * @param {object|undefined} rowsUpdate - Source changes, or a complete snapshot when omitted.
   * @returns {string} Current processed-data state.
   */
  update(history, rowsUpdate) {
    const dataState = this.processData(history, rowsUpdate);
    if (dataState === SPARKLINE_DATA_STATE.HAS_DATA) this.calculateGeometry();
    return dataState;
  }

  /**
   * Builds bins from initial History, then reuses completed bins on live updates.
   * Corrections recalculate affected bins; moving windows carry the state at
   * their new start. Drawing dimensions are applied in a separate calculation.
   *
   * @param {Array<object>|undefined} history - Graph source rows.
   * @param {object|undefined} rowsUpdate - History delivery; omitted for a complete snapshot.
   * @returns {string} Current processed-data state.
   */
  processData(history, rowsUpdate) {
    this.processedDataChanged = false;
    this.dataConfigChanged = false;
    if (history !== undefined) this._history = history;
    if (this._history === undefined) {
      this.dataState = SPARKLINE_DATA_STATE.NOT_LOADED;
      return this.dataState;
    }
    if (this._history.length === 0) {
      // A successful empty HA History response clears graph values, SVG
      // coordinates, axes and statistics.
      this.processedValues = [];
      this.processedMinValues = [];
      this.processedMaxValues = [];
      this.coords = [];
      this.coordsMin = [];
      this.coordsMax = [];
      this.backgroundCoords = [];
      this.bucketMeta = [];
      this.statistics = {};
      this.stateBandSegments = [];
      this.stateBandTransitions = [];
      this.xAxis = {};
      this.yAxis = {};
      this._min = undefined;
      this._max = undefined;
      this._endTime = 0;
      this.calendarBucketStartMs = undefined;
      this.calendarBucketCount = undefined;
      this.visibleBucketCount = undefined;
      this.dataState = SPARKLINE_DATA_STATE.EMPTY;
      // A later History response or graph-config change starts the next calculation.
      this.geometryConfigChanged = false;
      this.processedRows = this._history;
      this.processedDataKey = undefined;
      this.bucketConfigKey = undefined;
      this.bucketGroups = new Map();
      this.bucketResults = new WeakMap();
      this.statisticsGroups = [];
      this.processedDataRevision += 1;
      this.processedDataChanged = true;
      return this.dataState;
    }

    // State Bands place each HA state change at its exact History timestamp
    // across the configured time range.
    if (this.input.sparkline.show.chart_type === 'state_bands') {
      this.bucketConfigKey = undefined;
      this.statisticsGroups = [];
      this.processedRows = undefined;
      this.processedDataKey = undefined;
      this.processedDataRevision += 1;
      this.processedDataChanged = true;
      this.dataMin = Math.min(...this.stateMap.map.map((entry) => Number(entry.value)));
      this.dataMax = Math.max(...this.stateMap.map.map((entry) => Number(entry.value)));
      this.processedValues = [];
      this.processedMinValues = [];
      this.processedMaxValues = [];
      this.coords = [];
      this.bucketMeta = [];
      this.dataState = SPARKLINE_DATA_STATE.HAS_DATA;
      return this.dataState;
    }

    // Set the period end first; bucket indexes are measured back from this time.
    this._updateEndTime();
    const date = new Date();

    // Calculate how many History bins fit in the configured period.
    let requiredNumOfPoints;
    const bucketMs = ONE_HOUR / this.points;
    this.calendarBucketStartMs = undefined;
    this.calendarBucketCount = undefined;
    this.visibleBucketCount = undefined;
    switch (this.input.period.type) {
      case 'real_time':
        requiredNumOfPoints = 1;
        this.visibleBucketCount = requiredNumOfPoints;
        this.hours = 1;
        break;
      case 'calendar':
        if (this.input.period?.calendar?.period === 'day') {
          const calendarStart = new Date(date);
          calendarStart.setHours(0, 0, 0, 0);
          calendarStart.setHours(calendarStart.getHours() + this.input.period.calendar.offset * 24 - (this.input.period.calendar.duration.hour - 24));

          if (this.input.period.calendar.offset === 0 && this.input.period.calendar.full_day !== true) {
            this.calendarBucketCount = Math.ceil((this._endTime.getTime() - calendarStart.getTime()) / bucketMs);
            this.calendarBucketStartMs = this._endTime.getTime() - this.calendarBucketCount * bucketMs;
          } else {
            this.calendarBucketCount = Math.round((this.input.period.calendar.duration.hour * ONE_HOUR) / bucketMs);
            this.calendarBucketStartMs = calendarStart.getTime();
          }

          requiredNumOfPoints = this.calendarBucketCount;
          this.visibleBucketCount = requiredNumOfPoints;

          // On a full-day axis, current-day data ends at its projected current
          // bucket. Past-day data fills the period through midnight.
          if (this.activeDataEnd !== undefined) {
            this.visibleBucketCount = Math.ceil((this.activeDataEnd.getTime() - this.calendarBucketStartMs) / bucketMs);
          }
        }
        break;
      case 'rolling_window':
        requiredNumOfPoints = Math.ceil(this.hours * this.points);
        this.visibleBucketCount = requiredNumOfPoints;
        break;
      default:
        break;
    }

    // The graph's current time range advances between HA History updates.
    // Check its end time and visible bucket count before reusing the bins.
    const chartType = this.input.sparkline.show.chart_type;
    const graphFamily = chartType === 'radial' ? this.input.sparkline.show.chart_variant : chartType;
    const showMinMax = graphFamily === 'line' ? this.input.sparkline.line.show.minmax === true : graphFamily === 'area' && this.input.sparkline.area.show.minmax === true;
    const processedDataKey = JSON.stringify([
      this.input.period,
      this.hours,
      this.points,
      this.aggregateFuncName,
      graphFamily,
      showMinMax,
      this._endTime.getTime(),
      this.calendarBucketStartMs,
      this.visibleBucketCount,
    ]);
    if (this.processedRows === this._history && this.processedDataKey === processedDataKey) return this.dataState;

    const bucketStart = this.input.period.type === 'calendar' && this.input.period.calendar.period === 'day' ? this.calendarBucketStartMs : this._endTime.getTime() - this.hours * ONE_HOUR;
    const bucketConfigKey = JSON.stringify([this.input.period, this.hours, this.points, this.aggregateFuncName, graphFamily, showMinMax]);
    const historicalBuckets = this.input.period.type === 'rolling_window'
      || (this.input.period.type === 'calendar' && this.input.period.calendar.period === 'day');
    // Rebuild bins when History is replaced or the period and aggregation
    // settings change. For a live update, start at its earliest changed row and
    // keep completed bins before that time.
    const incremental = historicalBuckets && rowsUpdate !== undefined
      && rowsUpdate.rows === this._history && rowsUpdate.previousRows === this.processedRows
      && !rowsUpdate.replaced && this.bucketConfigKey === bucketConfigKey
      && bucketStart >= this.bucketStart && (bucketStart - this.bucketStart) % bucketMs === 0;
    let histGroups;
    if (incremental) {
      histGroups = Array.from({ length: requiredNumOfPoints }, (_, index) => this.bucketGroups.get(bucketStart + index * bucketMs));

      // Replace changed bins with current HA History rows, including delayed
      // samples and corrections. Binary search finds the first changed bucket.
      if (rowsUpdate.changedFrom !== Infinity) {
        const changedIndex = Math.max(0, Math.min(requiredNumOfPoints - 1, Math.floor((rowsUpdate.changedFrom - bucketStart) / bucketMs)));
        const changedStart = bucketStart + changedIndex * bucketMs;
        let lower = 0;
        let upper = this._history.length;
        while (lower < upper) {
          const middle = Math.floor((lower + upper) / 2);
          if (new Date(this._history[middle].last_changed).getTime() < changedStart) lower = middle + 1;
          else upper = middle;
        }
        for (let index = changedIndex; index < histGroups.length; index += 1) histGroups[index] = undefined;
        const changedRows = changedIndex === 0 ? this._history : this._history.slice(lower);
        changedRows.forEach((row) => this._reducer(histGroups, row));
      }

      // Carry the latest earlier HA state into the new first bucket when that
      // bucket has no History row.
      if (bucketStart !== this.bucketStart) {
        let lower = 0;
        let upper = this._history.length;
        while (lower < upper) {
          const middle = Math.floor((lower + upper) / 2);
          if (new Date(this._history[middle].last_changed).getTime() < bucketStart + bucketMs) lower = middle + 1;
          else upper = middle;
        }
        histGroups[0] = lower > 0 ? this._history.slice(0, lower) : undefined;
      }
    } else {
      histGroups = this.input.period.type === 'real_time' ? [this._history] : this._history.reduce((res, item) => this._reducer(res, item), []);
      this.bucketResults = new WeakMap();
    }
    histGroups.length = requiredNumOfPoints;
    // Keep all HA History rows in each bin for period statistics. The first
    // plotted bucket uses its latest state, while statistics include earlier values.
    this.statisticsGroups = histGroups.slice();
    this.bucketGroups.clear();
    histGroups.forEach((group, index) => {
      if (group !== undefined) this.bucketGroups.set(bucketStart + index * bucketMs, group);
    });
    // Use the latest HA state in the first bucket for the first visible slot.
    if (histGroups[0] && histGroups[0].length) {
      const firstRow = histGroups[0][histGroups[0].length - 1];
      if (firstRow !== this.firstBucketRow) {
        this.firstBucketRow = firstRow;
        this.firstBucketGroup = [firstRow];
      }
      histGroups[0] = this.firstBucketGroup;
    }
    histGroups.length = requiredNumOfPoints;

    this.processedValues = this.aggregateBuckets(histGroups);
    this.processedMinValues = [];
    this.processedMaxValues = [];
    this.dataMin = Math.min(...this.processedValues.map((value) => Number(value)));
    this.dataMax = Math.max(...this.processedValues.map((value) => Number(value)));

    // The Sparkline tooltip and optional line/area envelope use the same
    // History-bin min, average, max and count.
    this.bucketMeta = [];
    const firstResult = this.bucketResults.get(histGroups.find((group) => group !== undefined));
    let lastValue = ['delta', 'diff'].includes(this.aggregateFuncName) ? 0 : firstResult.last;
    for (let i = 0; i < histGroups.length; i += 1) {
      const bucket = histGroups[i];
      const value = this.processedValues[i];
      const start = new Date(bucketStart + i * bucketMs);
      const end = new Date(start.getTime() + bucketMs);
      if (bucket === undefined) {
        this.bucketMeta[i] = {
          index: i,
          start,
          end,
          value,
          min: undefined,
          avg: undefined,
          max: undefined,
          count: 0,
        };
        if (showMinMax) {
          this.processedMinValues.push(lastValue);
          this.processedMaxValues.push(lastValue);
        }
      } else {
        const result = this.bucketResults.get(bucket);
        this.bucketMeta[i] = {
          index: i,
          start,
          end,
          value,
          min: result.min,
          avg: result.avg,
          max: result.max,
          count: result.count,
        };
        lastValue = ['delta', 'diff'].includes(this.aggregateFuncName) ? 0 : result.last;
        if (showMinMax) {
          this.processedMinValues.push(result.min);
          this.processedMaxValues.push(result.max);
        }
      }
    }

    // Calculate min/max samples when the selected line or area option requests them.
    if (['line', 'area'].includes(graphFamily) && showMinMax) {
      // Use the min/max envelope to set the visible y-axis range.
      this.dataMin = Math.min(...this.processedMinValues.map((value) => Number(value)));
      this.dataMax = Math.max(...this.processedMaxValues.map((value) => Number(value)));
    }

    this.processedRows = this._history;
    this.bucketConfigKey = bucketConfigKey;
    this.bucketStart = bucketStart;
    this.processedDataKey = processedDataKey;
    this.processedDataRevision += 1;
    this.processedDataChanged = true;
    this.dataState = SPARKLINE_DATA_STATE.HAS_DATA;
    return this.dataState;
  }

  /**
   * Calculates SVG positions and axes for the current bucket values, drawing
   * area, shared y-axis scale and measured margins.
   */
  calculateGeometry() {
    const geometryResultSignature = JSON.stringify([
      this.processedDataRevision,
      this.geometryInputSignature,
      this.axisArea,
      this.dataArea,
      this.sharedYAxisBounds,
    ]);
    if (this.geometryResultSignature === geometryResultSignature) {
      this.geometryChanged = false;
      return false;
    }
    const xRatio = this.drawArea.width / (this.hours * this.points - 1);
    const xStep = Number.isFinite(xRatio) ? xRatio : this.drawArea.width;
    const positionValues = (values) => values.map((value, index) => [xStep * index + this.drawArea.x, 0, value]);

    this.coords = positionValues(this.processedValues);
    this.coordsMin = positionValues(this.processedMinValues);
    this.coordsMax = positionValues(this.processedMaxValues);
    this.min = this.input.y_axis.lower_bound !== undefined ? Number(this.input.y_axis.lower_bound) : this.dataMin;
    this.max = this.input.y_axis.upper_bound !== undefined ? Number(this.input.y_axis.upper_bound) : this.dataMax;
    this.buildAxisGeometry();
    this.geometryResultSignature = geometryResultSignature;
    this.geometryConfigChanged = false;
    this.geometryChanged = true;
    return true;
  }

  /**
   * Stores ticks and bounds for the final drawing area. Series uses the bounds
   * for shared scale coordination; GraphTool consumes the retained axes for
   * labels, tickmarks and grid rendering.
   */
  buildAxisGeometry() {
    const fontSizeX = this.input.x_axis.labels.styles['font-size'];
    const fontSizeY = this.input.y_axis.labels.styles['font-size'];
    const parsedFontSizeX = Number.parseFloat(fontSizeX);
    const parsedFontSizeY = Number.parseFloat(fontSizeY);
    const fontSizePixelsX = fontSizeX.endsWith('%') ? (parsedFontSizeX / 100) * FONT_SIZE : fontSizeX.endsWith('em') || fontSizeX.endsWith('rem') ? parsedFontSizeX * FONT_SIZE : parsedFontSizeX;
    const fontWidthPixels = fontSizePixelsX * 0.45;
    const fontHeightPixels = fontSizeY.endsWith('%') ? (parsedFontSizeY / 100) * FONT_SIZE * 0.85 : fontSizeY.endsWith('em') || fontSizeY.endsWith('rem') ? parsedFontSizeY * FONT_SIZE * 0.85 : parsedFontSizeY * 0.85;
    const xAxis = this.calculateXAxisGeometry(fontWidthPixels, fontSizePixelsX);
    const yAxis = this.input.sparkline.show.chart_type === 'state_bands' ? this.calculateStateBandsYAxisGeometry() : this.calculateYAxisGeometry(fontHeightPixels);

    this.min = yAxis.min;
    this.max = yAxis.max;
    this.xAxis = xAxis;
    this.yAxis = yAxis;
  }

  /**
   * Calculates X-axis times and SVG positions for labels, tickmarks and grid
   * lines. Calendar graphs follow local-day boundaries; rolling graphs use
   * their first and last bucket times.
   *
   * @param {number} fontWidthPixels Average character width in pixels.
   * @param {number} fontSizePixels Configured label font size in pixels.
   * @returns {object} Axis range, interval and ticks.
   */
  calculateXAxisGeometry(fontWidthPixels, fontSizePixels = fontWidthPixels / 0.45) {
    const period = this.input.period[this.input.period.type];
    const now = new Date();
    const bucketMs = ONE_HOUR / this.points;
    let axisStart;
    let axisEnd;
    let dataStart;
    let dataEnd;

    if (this.input.sparkline.show.chart_type === 'state_bands') {
      if (this.input.period.type === 'calendar') {
        axisStart = new Date(now);
        axisStart.setHours(0, 0, 0, 0);
        axisStart.setHours(axisStart.getHours() + period.offset * 24 - (period.duration.hour - 24));
        axisEnd = new Date(axisStart.getTime() + period.duration.hour * ONE_HOUR);
        dataStart = new Date(axisStart);
        dataEnd = period.offset === 0 && period.full_day !== true ? new Date(now) : new Date(axisEnd);
      } else {
        axisEnd = new Date(now);
        axisStart = new Date(axisEnd.getTime() - period.duration.hour * ONE_HOUR);
        dataStart = new Date(axisStart);
        dataEnd = new Date(axisEnd);
      }
    } else if (this.input.period.type === 'calendar' && period.period === 'day') {
      axisStart = new Date(now);
      axisStart.setHours(0, 0, 0, 0);
      axisStart.setHours(axisStart.getHours() + period.offset * 24 - (period.duration.hour - 24));
      axisEnd = new Date(axisStart.getTime() + period.duration.hour * ONE_HOUR - bucketMs);
      dataStart = new Date(axisStart);
      dataEnd = period.offset === 0 && period.full_day !== true ? new Date(this._snapToBin(new Date())) : new Date(axisEnd);
    } else {
      axisStart = new Date(this.bucketMeta[0].start);
      axisEnd = new Date(this.bucketMeta[this.bucketMeta.length - 1].start);
      dataStart = new Date(axisStart);
      dataEnd = new Date(axisEnd);
    }

    const minMs = axisStart.getTime();
    const maxMs = axisEnd.getTime();
    const totalDuration = maxMs - minMs;
    const xProjectionDuration =
      this.input.sparkline.show.chart_type === 'radial_barcode' ? totalDuration + bucketMs : totalDuration;
    const approxLabelWidth = this.input.x_axis.labels.max_length * fontWidthPixels + fontSizePixels;
    const maxLabels = Math.floor(this.drawArea.width / approxLabelWidth);
    const effectiveMaxLabels = Math.max(maxLabels, 2);
    const minTimeStep = totalDuration / (effectiveMaxLabels - 1);
    const timeIntervals = [1000, 5000, 15000, 30000, 60000, 300000, 600000, 900000, 1800000, 3600000, 7200000, 14400000, 21600000, 43200000, 86400000, 172800000, 604800000, 2629800000];
    let selectedIndex = timeIntervals.findIndex((interval) => interval >= minTimeStep);

    if (selectedIndex < 0) selectedIndex = timeIntervals.length - 1;

    while (selectedIndex > 0 && totalDuration / timeIntervals[selectedIndex] < 2) {
      selectedIndex -= 1;
    }

    // Place binned graph ticks on bucket boundaries. Keep the selected X-axis
    // interval when it aligns with bins.per_hour; otherwise use the next one that does.
    if (this.input.sparkline.show.chart_type !== 'state_bands') {
      while (selectedIndex < timeIntervals.length - 1 && (timeIntervals[selectedIndex] * this.points) % ONE_HOUR !== 0) {
        selectedIndex += 1;
      }
    }

    const interval = timeIntervals[selectedIndex];
    const ticks = [];
    const tickTimestamps = new Set();

    // Generate sub-day ticks as local wall-clock slots for every visible
    // calendar day. This anchors hours at local midnight and prevents the
    // rolling-window start time or a DST transition from shifting the phase.
    if (interval < 86400000) {
      const day = new Date(axisStart);
      day.setHours(0, 0, 0, 0);

      while (day.getTime() <= maxMs) {
        for (let slot = 0; slot < 86400000; slot += interval) {
          const hours = Math.floor(slot / ONE_HOUR);
          const minutes = Math.floor((slot % ONE_HOUR) / 60000);
          const seconds = Math.floor((slot % 60000) / 1000);
          const milliseconds = slot % 1000;
          const tickDate = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, minutes, seconds, milliseconds);
          const currentTickMs = tickDate.getTime();

          if (currentTickMs >= minMs && currentTickMs <= maxMs && !tickTimestamps.has(currentTickMs)) {
            tickTimestamps.add(currentTickMs);
            const percentage = (currentTickMs - minMs) / xProjectionDuration;
            ticks.push({
              time: tickDate,
              timestamp: currentTickMs,
              x: this.drawArea.x + percentage * this.drawArea.width,
              isMidnight: tickDate.getHours() === 0 && tickDate.getMinutes() === 0,
            });
          }
        }

        day.setDate(day.getDate() + 1);
        day.setHours(0, 0, 0, 0);
      }
    } else if (interval === timeIntervals[timeIntervals.length - 1]) {
      // The largest automatic interval represents a calendar month rather
      // than a fixed millisecond duration.
      const month = new Date(axisStart.getFullYear(), axisStart.getMonth(), 1);
      if (month.getTime() < minMs) month.setMonth(month.getMonth() + 1);

      while (month.getTime() <= maxMs) {
        const currentTickMs = month.getTime();
        const percentage = (currentTickMs - minMs) / xProjectionDuration;
        ticks.push({
          time: new Date(month),
          timestamp: currentTickMs,
          x: this.drawArea.x + percentage * this.drawArea.width,
          isMidnight: true,
        });
        month.setMonth(month.getMonth() + 1);
      }
    } else {
      // Daily and multi-day ticks stay on local date boundaries. Calendar
      // date increments preserve local midnight across DST changes.
      const daysPerTick = interval / 86400000;
      const day = new Date(axisStart);
      day.setHours(0, 0, 0, 0);
      if (day.getTime() < minMs) day.setDate(day.getDate() + 1);

      while (day.getTime() <= maxMs) {
        const currentTickMs = day.getTime();
        const percentage = (currentTickMs - minMs) / xProjectionDuration;
        ticks.push({
          time: new Date(day),
          timestamp: currentTickMs,
          x: this.drawArea.x + percentage * this.drawArea.width,
          isMidnight: true,
        });
        day.setDate(day.getDate() + daysPerTick);
        day.setHours(0, 0, 0, 0);
      }
    }

    // Calendar bucket coordinates represent bucket starts, but the visible
    // period ends at the exclusive boundary after the final bucket. Replace a
    // tick occupying the same endpoint and expose that actual period end so a
    // six-day axis can finish with the following midnight.
    if (this.input.sparkline.show.chart_type !== 'state_bands' && this.input.period.type === 'calendar' && period.period === 'day') {
      const periodEnd = new Date(axisEnd.getTime() + bucketMs);
      const lastTick = ticks[ticks.length - 1];

      if (lastTick && lastTick.timestamp === axisEnd.getTime()) ticks.pop();

      ticks.push({
        time: periodEnd,
        timestamp: periodEnd.getTime(),
        x: this.drawArea.x + this.drawArea.width,
        isMidnight: periodEnd.getHours() === 0 && periodEnd.getMinutes() === 0,
        isPeriodEnd: true,
      });
    }

    return {
      start: axisStart,
      end: axisEnd,
      dataStart,
      dataEnd,
      interval,
      ticks,
    };
  }

  /**
   * Calculates rows for the configured State Band state_map. Each row uses
   * 10% top margin, 25% label, 15% middle margin, 40% band and 10% bottom margin.
   * Numeric state-map order is retained while the visual row order places the
   * lowest value at the bottom.
   *
   * @returns {object} Categorical Y-axis geometry.
   */
  calculateStateBandsYAxisGeometry() {
    const entries = this.stateMap.map.concat().sort((a, b) => Number(a.value) - Number(b.value));
    const rowHeight = this.drawArea.height / entries.length;
    const rows = entries.map((entry, index) => {
      const visualIndex = entries.length - index - 1;
      const rowTop = this.drawArea.y + visualIndex * rowHeight;
      const fontSize = rowHeight * 0.25;
      const labelY = rowTop + rowHeight * 0.1;
      const bandY = rowTop + rowHeight * 0.5;
      const bandHeight = rowHeight * 0.4;

      return {
        state: entry.state,
        value: Number(entry.value),
        label: entry.display_label,
        y: bandY + bandHeight / 2,
        labelY,
        fontSize,
        bandY,
        bandHeight,
      };
    });
    const gridTicks = entries.slice(1).map((entry, index) => ({
      value: Number(entry.value),
      y: this.drawArea.y + (index + 1) * rowHeight,
    }));

    return {
      min: Number(entries[0].value),
      max: Number(entries[entries.length - 1].value),
      interval: null,
      minorInterval: null,
      ticks: rows,
      gridTicks,
      rows,
    };
  }

  /**
   * Builds State Band segments from exact HA state-change times and clips them
   * to the Sparkline's visible data range.
   *
   * @returns {Array<object>} State rows containing their rendered segments.
   */
  getStateBands() {
    const axisStart = this.xAxis.start.getTime();
    const axisEnd = this.xAxis.end.getTime();
    const dataEnd = this.xAxis.dataEnd.getTime();
    const duration = axisEnd - axisStart;
    const history = this._history.concat().sort((a, b) => new Date(a.last_changed).getTime() - new Date(b.last_changed).getTime());
    const transitions = [];

    history.forEach((item) => {
      const previous = transitions[transitions.length - 1];
      if (!previous || Number(previous.state) !== Number(item.state)) transitions.push(item);
    });

    this.stateBandSegments = [];
    transitions.forEach((item, index) => {
      const start = Math.max(axisStart, new Date(item.last_changed).getTime());
      const nextStart = index < transitions.length - 1 ? new Date(transitions[index + 1].last_changed).getTime() : dataEnd;
      const end = Math.min(axisEnd, dataEnd, nextStart);

      if (start >= end) return;

      const row = this.yAxis.rows.find((stateRow) => stateRow.value === Number(item.state));
      const segment = {
        state: item.haState,
        value: Number(item.state),
        label: row.label,
        start: new Date(start),
        end: new Date(end),
        x: this.drawArea.x + ((start - axisStart) / duration) * this.drawArea.width,
        y: row.bandY,
        width: ((end - start) / duration) * this.drawArea.width,
        height: row.bandHeight,
        centerY: row.bandY + row.bandHeight / 2,
      };

      this.stateBandSegments.push(segment);
    });

    // Draw a transition where adjacent State Bands meet at the same History
    // timestamp.
    this.stateBandTransitions = [];
    for (let index = 0; index < this.stateBandSegments.length - 1; index += 1) {
      const segment = this.stateBandSegments[index];
      const nextSegment = this.stateBandSegments[index + 1];

      if (segment.end.getTime() === nextSegment.start.getTime()) {
        this.stateBandTransitions.push({
          x: nextSegment.x,
          fromY: segment.centerY,
          toY: nextSegment.centerY,
          height: segment.height,
        });
      }
    }

    return this.yAxis.rows.map((row) => ({
      ...row,
      segments: this.stateBandSegments.filter((segment) => segment.value === row.value),
    }));
  }

  /**
   * Calculates numeric y-axis bounds and tick positions for SparklineGraphTool
   * to draw grid lines and labels.
   *
   * @param {number} fontHeightPixels Label height in pixels.
   * @returns {object} Axis range, interval and ticks.
   */
  calculateYAxisGeometry(fontHeightPixels) {
    const fixedLowerBound = this.sharedYAxisBounds !== undefined ? this.sharedYAxisBounds.fixedLowerBound : this.input.y_axis.lower_bound !== undefined;
    const fixedUpperBound = this.sharedYAxisBounds !== undefined ? this.sharedYAxisBounds.fixedUpperBound : this.input.y_axis.upper_bound !== undefined;
    let dataMin = this.sharedYAxisBounds !== undefined ? this.sharedYAxisBounds.lowerBound : fixedLowerBound ? Number(this.input.y_axis.lower_bound) : this.min;
    let dataMax = this.sharedYAxisBounds !== undefined ? this.sharedYAxisBounds.upperBound : fixedUpperBound ? Number(this.input.y_axis.upper_bound) : this.max;

    if (dataMin === dataMax) {
      if (!fixedLowerBound) dataMin -= 1;
      if (!fixedUpperBound) dataMax += 1;
    }

    const minSpacePerLabel = fontHeightPixels * 1.5;
    const axisLength = this.input.sparkline.show.chart_type === 'radial' ? this.getRadialGeometry().radialSize : this.drawArea.height;
    const maxLabels = Math.floor(axisLength / minSpacePerLabel);
    const effectiveMaxLabels = Math.max(maxLabels, 2);

    if (this._logarithmic) {
      const graphMin = Math.log10(Math.max(1, dataMin));
      const graphMax = Math.log10(Math.max(1, dataMax));
      const minExponent = Math.floor(graphMin);
      const maxExponent = Math.ceil(graphMax);
      const ticks = [];

      for (let exponent = minExponent; exponent <= maxExponent; exponent += 1) {
        const value = 10 ** exponent;
        if (value >= dataMin && value <= dataMax) {
          const y = this.drawArea.height + this.drawArea.y - ((Math.log10(value) - graphMin) / (graphMax - graphMin)) * this.drawArea.height;
          ticks.push({ value, y });
        }
      }

      return {
        min: dataMin,
        max: dataMax,
        interval: null,
        minorInterval: null,
        ticks,
      };
    }

    const range = dataMax - dataMin;

    // When y-axis labels are hidden, space tickmarks evenly across the exact
    // data range.
    if (!this.input.sparkline.show.labels.y) {
      const interval = range / (effectiveMaxLabels - 1);
      const ticks = Array.from({ length: effectiveMaxLabels }, (_, index) => {
        const value = dataMin + interval * index;
        const y = this.drawArea.height + this.drawArea.y - ((value - dataMin) / range) * this.drawArea.height;
        return { value, y };
      });

      return {
        min: dataMin,
        max: dataMax,
        interval,
        minorInterval: interval / 2,
        ticks,
      };
    }

    const rawStep = range / (effectiveMaxLabels - 1);
    const exponent = Math.floor(Math.log10(rawStep));
    const powerOfTen = 10 ** exponent;
    const normalizedStep = rawStep / powerOfTen;
    let chosenStep;

    if (normalizedStep <= 1.0) chosenStep = 1.0;
    else if (normalizedStep <= 2.0) chosenStep = 2.0;
    else if (normalizedStep <= 5.0) chosenStep = 5.0;
    else chosenStep = 10.0;

    const interval = chosenStep * powerOfTen;
    const minorInterval = interval / 2;
    // When y-axis labels are visible, round automatic bounds to clean interval
    // values while keeping configured bounds exact.
    const min = fixedLowerBound ? dataMin : Math.floor(dataMin / interval) * interval;
    const max = fixedUpperBound ? dataMax : Math.ceil(dataMax / interval) * interval;
    const ticks = [];
    const majorStart = Math.ceil(min / interval) * interval;

    // Keep both y-axis bounds among the labels, then add clean interval values
    // between them up to the space available.
    const interiorValues = [];
    for (let value = majorStart; value <= max + interval / 100; value += interval) {
      if (value > min + interval / 100 && value < max - interval / 100) interiorValues.push(value);
    }

    const interiorSlots = effectiveMaxLabels - 2;
    let selectedInteriorValues;
    if (interiorValues.length <= interiorSlots) selectedInteriorValues = interiorValues;
    else if (interiorSlots === 1) selectedInteriorValues = [interiorValues[Math.floor(interiorValues.length / 2)]];
    else selectedInteriorValues = Array.from({ length: interiorSlots }, (_, index) => interiorValues[Math.round((index * (interiorValues.length - 1)) / (interiorSlots - 1))]);

    [min, ...selectedInteriorValues, max].forEach((value) => {
      const y = this.drawArea.height + this.drawArea.y - ((value - min) / (max - min)) * this.drawArea.height;
      ticks.push({ value, y });
    });

    return {
      min,
      max,
      interval,
      minorInterval,
      ticks,
    };
  }

  /**
   * Assigns one normalized history row to its visible time bucket. Rolling
   * windows use an exclusive moving end; calendar days use their local-day
   * origin so DST and offsets retain calendar semantics.
   *
   * @param {Array<Array<object>>} res - Time buckets accumulated so far.
   * @param {object} item - Normalized history row.
   * @returns {Array<Array<object>>} Updated time buckets.
   */
  _reducer(res, item) {
    const { type } = this.input.period;
    const period = this.input.period[type];

    let hours = this.hours;

    if (type === 'calendar' && period.period === 'day') {
      const now = new Date();
      const extraHours = period.duration.hour - 24;

      hours = period.offset === 0 && period.full_day !== true ? now.getHours() + now.getMinutes() / 60 + extraHours : period.duration.hour;
    }

    let age = this._endTime - new Date(item.last_changed).getTime();

    if (period.offset === 0 && period.full_day !== true && age < 0) {
      age = 0;
    }

    let key;
    if (type === 'rolling_window') {
      // Rolling windows end just after the active bucket. With 30-minute bins,
      // a sample from 10:30 through 11:00 belongs in the final bucket.
      const bucketCount = hours * this.points;
      const ageInBuckets = (age / ONE_HOUR) * this.points;
      key = Math.max(0, Math.min(bucketCount - 1, Math.floor(bucketCount - ageInBuckets)));
    } else if (type === 'calendar' && period.period === 'day') {
      const bucketMs = ONE_HOUR / this.points;
      key = Math.floor((new Date(item.last_changed).getTime() - this.calendarBucketStartMs) / bucketMs);
      key = Math.max(0, Math.min(this.calendarBucketCount - 1, key));
    } else {
      const endIndex = hours * this.points - 1;
      const interval = (age / ONE_HOUR) * this.points - endIndex;
      key = interval < 0 ? Math.floor(Math.abs(interval)) : 0;
    }

    if (!res[key]) res[key] = [];
    res[key].push(item);

    return res;
  }

  /**
   * Aggregates visible History buckets and carries the last HA state across
   * gaps. calculateGeometry() later turns these values into SVG positions.
   *
   * @param {Array<Array<object>>} history - Bucketed history rows.
   * @returns {Array<number>} One value for each visible bucket.
   */
  aggregateBuckets(history) {
    const values = [];
    const first = history.filter(Boolean)[0];
    // One summary supplies the plotted aggregate, tooltip metadata and min/max
    // envelope. Unchanged raw bin groups reuse their previous summary.
    history.forEach((items) => {
      if (items !== undefined) this.calculateBucketResult(items);
    });
    const firstResult = this.bucketResults.get(first);
    const carryDifference = ['delta', 'diff'].includes(this.aggregateFuncName);
    let last = [firstResult.value, carryDifference ? 0 : firstResult.last];
    for (let i = 0; i < this.visibleBucketCount; i += 1) {
      const item = history[i];
      if (item) {
        const result = this.bucketResults.get(item);
        last = [result.value, carryDifference ? 0 : result.last];
      }
      values.push(item ? last[0] : last[1]);
    }
    return values;
  }

  /**
   * Calculates the value, extrema and time-weighted intervals for one History
   * bin. The graph, tooltip and period statistics use this same summary.
   *
   * @param {Array<object>} items - Chronological numeric measurements in a bin.
   * @returns {object} Aggregate, extrema, timestamps and weighted intervals.
   */
  calculateBucketResult(items) {
    if (this.bucketResults.has(items)) return this.bucketResults.get(items);
    let sum = 0;
    let min = Infinity;
    let max = -Infinity;
    let minTime;
    let maxTime;
    let minTimestamp;
    let maxTimestamp;
    let weightedValue = 0;
    const measurements = [];
    items.forEach((item, index) => {
      const value = Number(item.state);
      const time = new Date(item.last_changed).getTime();
      sum += value;
      if (value < min) { min = value; minTime = time; minTimestamp = item.last_changed; }
      if (value > max) { max = value; maxTime = time; maxTimestamp = item.last_changed; }
      if (index > 0) weightedValue += measurements[index - 1].value * (time - measurements[index - 1].time);
      measurements.push({ value, time });
    });
    const result = {
      min,
      max,
      minTime,
      maxTime,
      minTimestamp,
      maxTimestamp,
      sum,
      avg: sum / items.length,
      count: items.length,
      first: measurements[0].value,
      last: measurements[measurements.length - 1].value,
      firstTime: measurements[0].time,
      lastTime: measurements[measurements.length - 1].time,
      weightedValue,
      measurements,
    };
    switch (this.aggregateFuncName) {
      case 'avg': result.value = result.avg; break;
      case 'min': result.value = min; break;
      case 'max': result.value = max; break;
      case 'sum': result.value = sum; break;
      case 'first': result.value = result.first; break;
      case 'last': result.value = result.last; break;
      case 'delta': result.value = max - min; break;
      case 'diff': result.value = result.last - result.first; break;
      case 'median': result.value = this._median(items); break;
      default: break;
    }
    this.bucketResults.set(items, result);
    return result;
  }

  /**
   * Projects numeric values onto the drawing area's y-axis. Each tuple retains
   * both its normal y and its zero-baseline y for positive/negative bar geometry.
   *
   * @param {Array<Array<number>>} coords - X/value tuples.
   * @returns {Array<Array<number>>} SVG coordinate tuples.
   */
  _calcY(coords) {
    // Apply the same base-10 logarithm to graph values and y-axis bounds.
    const max = this._logarithmic ? Math.log10(Math.max(1, this.max)) : this.max;
    const min = this._logarithmic ? Math.log10(Math.max(1, this.min)) : this.min;

    const yRatio = (max - min) / this.drawArea.height || 1;
    const coords2 = coords.map((coord) => {
      const val = this._logarithmic ? Math.log10(Math.max(1, coord[V])) : coord[V];

      const offset = min < 0 ? Math.abs(min) : 0;
      const val0 = val > 0 ? val - Math.max(0, min) : 0;

      const coord0 = this.drawArea.height + this.drawArea.y - val0 / yRatio;

      const coordY2 =
        val > 0
          ? this.drawArea.height + this.drawArea.top * 1 - offset / yRatio - (val - Math.max(0, min)) / yRatio
          : this.drawArea.height + this.drawArea.top * 1 - (0 - min) / yRatio;
      const coordY = this.drawArea.height + this.drawArea.y * 1 - (val - min) / yRatio;

      return [coord[X], coordY, coord[V], coordY2];
    });
    return coords2;
  }

  /**
   * Returns SVG y-coordinates for values using this graph's current y-axis
   * bounds and drawing area.
   *
   * @param {Array<Array<number>>} coords - X/value tuples.
   * @returns {Array<Array<number>>} SVG coordinate tuples.
   */
  calculateYCoordinates(coords) {
    return this._calcY(coords);
  }

  /**
   * Projects all levels of one equalizer column to rectangle top coordinates.
   *
   * @param {Array<Array<number>>} coord - Equalizer value tuple.
   * @returns {Array<number>} SVG y coordinates for the levels.
   */
  _calcLevelY(coord) {
    // Apply the logarithmic scale before placing equalizer levels.
    const max = this._logarithmic ? Math.log10(Math.max(1, this.max)) : this.max;
    const min = this._logarithmic ? Math.log10(Math.max(1, this.min)) : this.min;

    const yRatio = (max - min) / this.drawArea.height || 1;
    const offset = min < 0 ? Math.abs(min) : 0;
    let yStack = [];
    const coordYs = coord[V].forEach((val, index) => {
      const coordY = val >= 0 ? this.drawArea.height + this.drawArea.top * 1 - (1 * offset) / yRatio - (val - Math.max(0, min)) / yRatio : this.drawArea.height + this.drawArea.top * 1 - (0 - val) / yRatio;
      yStack.push(coordY);
      return yStack;
    });
    return yStack;
  }

  /**
   * Builds the main line path from calculated coordinates. Smoothed paths use
   * midpoints followed by quadratic curve control points.
   *
   * @returns {string} SVG path data.
   */
  getPath() {
    let { coords } = this;
    if (coords.length === 1) {
      // Real-time charts represent one current value across their complete width.
      // Historical charts retain the configured time axis and occupy one bin.
      const singletonWidth = this.input.period.type === 'real_time' ? this.drawArea.width : this.drawArea.width / (this.hours * this.points - 1);
      coords = [coords[0], [coords[0][X] + singletonWidth, 0, coords[0][V]]];
    }
    coords = this._calcY(coords);
    let next;
    let Z;
    let path = '';
    let last = coords[0];
    path += `M${last[X]},${last[Y]}`;

    coords.forEach((point) => {
      next = point;
      Z = this._smoothing ? this._midPoint(last[X], last[Y], next[X], next[Y]) : next;
      path += ` ${Z[X]},${Z[Y]}`;
      path += ` Q ${next[X]},${next[Y]}`;
      last = next;
    });
    path += ` ${next[X]},${next[Y]}`;
    return path;
  }

  /**
   * Builds the forward edge of the per-bucket minimum envelope.
   *
   * @returns {string} SVG path data for minimum values.
   */
  getPathMin() {
    let { coordsMin } = this;
    if (coordsMin.length === 1) {
      const singletonWidth = this.input.period.type === 'real_time' ? this.drawArea.width : this.drawArea.width / (this.hours * this.points - 1);
      coordsMin = [coordsMin[0], [coordsMin[0][X] + singletonWidth, 0, coordsMin[0][V]]];
    }
    coordsMin = this._calcY(coordsMin);
    let next;
    let Z;
    let path = '';
    let last = coordsMin[0];
    path += `M${last[X]},${last[Y]}`;

    coordsMin.forEach((point) => {
      next = point;
      Z = next;
      path += ` ${Z[X]},${Z[Y]}`;
      path += ` Q ${next[X]},${next[Y]}`;
      last = next;
    });
    path += ` ${next[X]},${next[Y]}`;
    return path;
  }

  /**
   * Builds the maximum envelope in reverse so it can close against the minimum
   * edge as one filled shape.
   *
   * @returns {string} Reversed SVG path data for maximum values.
   */
  getPathMax() {
    let { coordsMax } = this;
    if (coordsMax.length === 1) {
      const singletonWidth = this.input.period.type === 'real_time' ? this.drawArea.width : this.drawArea.width / (this.hours * this.points - 1);
      coordsMax = [coordsMax[0], [coordsMax[0][X] + singletonWidth, 0, coordsMax[0][V]]];
    }
    coordsMax = this._calcY(coordsMax);
    let next;
    let Z;
    let path = '';
    let last = coordsMax[coordsMax.length - 1];

    coordsMax.reverse().forEach((point, index, points) => {
      next = point;
      Z = next;
      path += ` ${Z[X]},${Z[Y]}`;
      path += ` Q ${next[X]},${next[Y]}`;
      last = next;
    });
    path += ` ${next[X]},${next[Y]}`;
    path += `M${last[X]},${last[Y]}`;
    return path;
  }

  /**
   * Maps configured color thresholds onto vertical SVG gradient offsets. Stops
   * outside the visible range are interpolated at the current graph boundary.
   *
   * @param {Array<object>} thresholds - Ordered value/color thresholds.
   * @param {boolean} logarithmic - Whether values use logarithmic scaling.
   * @param {Function} interpolateColor - Tool-owned conversion for clipped color stops.
   * @returns {Array<object>} Colors and percentage offsets for SVG stops.
   */
  computeGradient(thresholds, logarithmic, interpolateColor) {
    const scale = logarithmic ? Math.log10(Math.max(1, this._max)) - Math.log10(Math.max(1, this._min)) : this._max - this._min;
    // Extend the scale for the SVG area below the drawing region so gradient
    // thresholds remain aligned with the plotted y-range.
    const scaleOffset = (scale / (this.graphArea.height - this.margin.b)) * this.graphArea.height - scale;
    return thresholds.map((stop, index, arr) => {
      let color;
      if (stop.value > this._max && arr[index + 1]) {
        const factor = (this._max - arr[index + 1].value) / (stop.value - arr[index + 1].value);
        color = interpolateColor(arr[index + 1].color, stop.color, factor);
      } else if (stop.value < this._min && arr[index - 1]) {
        const factor = (arr[index - 1].value - this._min) / (arr[index - 1].value - stop.value);
        color = interpolateColor(arr[index - 1].color, stop.color, factor);
      }
      let offset;
      if (scale <= 0) {
        offset = 0;
      } else if (logarithmic) {
        offset = (Math.log10(Math.max(1, this._max)) - Math.log10(Math.max(1, stop.value))) * (100 / scale);
      } else {
        offset = (this._max - stop.value) * (100 / (scale + scaleOffset));
      }
      return {
        color: color || stop.color,
        offset,
      };
    });
  }

  /**
   * Closes the minimum and reversed maximum paths into one envelope polygon.
   *
   * @param {string} pathMin - Forward minimum path.
   * @param {string} pathMax - Reversed maximum path.
   * @returns {string} Closed SVG path data.
   */
  getAreaMinMax(pathMin, pathMax) {
    let fill = pathMin;
    fill += ` L ${this.coordsMax[this.coordsMax.length - 1][X]},
                ${this.coordsMax[this.coordsMax.length - 1][Y]}`;
    fill += pathMax;
    fill += ' z';
    return fill;
  }

  /**
   * Closes a line path against the visible zero baseline. When zero lies
   * outside the configured range, the nearest graph boundary becomes baseline.
   *
   * @param {string} path - Main line path.
   * @returns {string} Closed SVG area path.
   */
  getArea(path) {
    const max = this._logarithmic ? Math.log10(Math.max(1, this.max)) : this.max;
    const min = this._logarithmic ? Math.log10(Math.max(1, this.min)) : this.min;
    const yRatio = (max - min) / this.drawArea.height || 1;
    const zero = Math.min(max, Math.max(min, 0));
    const baselineY = this.drawArea.y + this.drawArea.height - (zero - min) / yRatio;
    let fill = path;

    fill += ` L ${this.coords[this.coords.length - 1][X]}, ${baselineY}`;
    fill += ` L ${this.coords[0][X]}, ${baselineY} z`;
    return fill;
  }

  /**
   * Converts a clock-oriented polar point to SVG coordinates.
   *
   * @param {number} centerX - Circle center x.
   * @param {number} centerY - Circle center y.
   * @param {number} radiusX - Horizontal radius.
   * @param {number} radiusY - Vertical radius.
   * @param {number} angleInDegrees - Clock-oriented angle.
   * @returns {object} Cartesian x and y.
   */
  polarToCartesian(centerX, centerY, radiusX, radiusY, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: centerX + radiusX * Math.cos(angleInRadians),
      y: centerY + radiusY * Math.sin(angleInRadians),
    };
  }

  /**
   * Calculates the radial layout used by radial barcode, line, area and dots.
   * Sparkline buckets move clockwise from the configured rotation at twelve
   * o'clock, and all radial graph types use the same angles.
   *
   * @returns {object} Center, radius, arc and bucket-angle geometry.
   */
  getRadialGeometry() {
    const outerRadius = Math.min(this.drawArea.width, this.drawArea.height) / 2;
    const radialConfig = this.input.sparkline[this.input.sparkline.show.chart_type];
    const configuredRadialSize = Utils.calculateSvgDimension(radialConfig.size);
    const radialSize = Math.min(configuredRadialSize, outerRadius);
    const innerRadius = outerRadius - radialSize;
    const centerX = this.drawArea.x + this.drawArea.width / 2;
    const centerY = this.drawArea.y + this.drawArea.height / 2;
    const totalBins = Math.ceil(this.hours * this.points);
    const arcDegrees = Number(radialConfig.arc_degrees);
    const rotate = Number(radialConfig.rotate);

    return {
      centerX,
      centerY,
      outerRadius,
      innerRadius,
      radialSize,
      arcDegrees,
      rotate,
      totalBins,
      anglePerBin: arcDegrees / totalBins,
    };
  }

  /**
   * Converts a value to its radius on the configured y-scale. Radial area uses
   * zero for its baseline; lines and dots use each bucket's value.
   *
   * @param {number} value - Numeric bucket or axis value.
   * @returns {number} Radius measured from the radial center.
   */
  getRadialRadiusForValue(value) {
    const geometry = this.getRadialGeometry();
    const max = this._logarithmic ? Math.log10(Math.max(1, this.max)) : this.max;
    const min = this._logarithmic ? Math.log10(Math.max(1, this.min)) : this.min;
    const plottedValue = this._logarithmic ? Math.log10(Math.max(1, value)) : value;
    const ratio = (max - min) / geometry.radialSize;

    return geometry.innerRadius + (plottedValue - min) / ratio;
  }

  /**
   * Returns the clock-oriented angle belonging to a bucket center. Barcode
   * segments use the corresponding start/end boundaries from the same step.
   *
   * @param {number} index - Zero-based bucket index.
   * @returns {number} Clock-oriented angle in degrees.
   */
  getRadialAngleForBin(index) {
    const geometry = this.getRadialGeometry();
    return geometry.rotate + (index + 0.5) * geometry.anglePerBin;
  }

  /**
   * Returns the clock-oriented angle at one relative position along the arc.
   * Axis ticks use the same projection as history bins and barcode segments.
   *
   * @param {number} fraction - Relative position from 0 at start to 1 at end.
   * @returns {number} Clock-oriented angle in degrees.
   */
  getRadialAngleForFraction(fraction) {
    const geometry = this.getRadialGeometry();
    return geometry.rotate + fraction * geometry.arcDegrees;
  }

  /**
   * Places value axes at opposite sides of a full circle and at both ends of a
   * partial arc. This keeps primary and secondary scales separately readable.
   *
   * @param {string} axisId - Primary or secondary y-axis identifier.
   * @returns {number} Clock-oriented radial-axis angle in degrees.
   */
  getRadialValueAxisAngle(axisId) {
    const geometry = this.getRadialGeometry();
    if (axisId === 'primary') return this.getRadialAngleForFraction(0);
    return this.getRadialAngleForFraction(geometry.arcDegrees === 360 ? 0.5 : 1);
  }

  /**
   * Returns a point at one radius and angle in the current radial graph.
   *
   * @param {number} radius - Distance from the radial center.
   * @param {number} angle - Clock-oriented angle in degrees.
   * @returns {object} Cartesian x and y.
   */
  getRadialPoint(radius, angle) {
    const geometry = this.getRadialGeometry();
    return this.polarToCartesian(geometry.centerX, geometry.centerY, radius, radius, angle);
  }

  /**
   * Returns the tangent offset used by value-axis ticks and labels.
   *
   * @param {number} angle - Clock-oriented radial-axis angle.
   * @param {number} distance - Signed distance along the tangent.
   * @returns {object} Cartesian x and y offset.
   */
  getRadialTangentOffset(angle, distance) {
    const radians = (angle * Math.PI) / 180;
    return {
      x: Math.cos(radians) * distance,
      y: Math.sin(radians) * distance,
    };
  }

  /**
   * Converts each graph bucket to SVG x/y, angle and radius values for radial
   * drawing and pointer interaction.
   *
   * @returns {Array<Array<number>>} Radial x/y/value/angle/radius/index tuples.
   */
  getRadialPoints() {
    return this.coords.map((coord, index) => {
      const angle = this.getRadialAngleForBin(index);
      const radius = this.getRadialRadiusForValue(coord[V]);
      const point = this.getRadialPoint(radius, angle);
      return [point.x, point.y, coord[V], angle, radius, index];
    });
  }

  /**
   * Builds line or spline path data from radial points. It deliberately keeps
   * the oldest and newest bucket separate, matching the chronological line
   * ordering used by cartesian history charts.
   *
   * @returns {string} SVG path data for the radial value line.
   */
  getRadialPath() {
    const points = this.getRadialPoints();
    let path = `M${points[0][X]},${points[0][Y]}`;
    let last = points[0];

    points.forEach((point) => {
      const plottedPoint = this._smoothing ? this._midPoint(last[X], last[Y], point[X], point[Y]) : point;
      path += ` ${plottedPoint[X]},${plottedPoint[Y]}`;
      path += ` Q ${point[X]},${point[Y]}`;
      last = point;
    });
    path += ` ${points[points.length - 1][X]},${points[points.length - 1][Y]}`;
    return path;
  }

  /**
   * Closes a radial value path against the visible zero radius. Baseline points
   * follow the same bucket angles in reverse, so partial arcs and negative
   * scales retain the same fill meaning as cartesian area charts.
   *
   * @param {string} path - Radial value-line path.
   * @returns {string} Closed radial area path.
  */
  getRadialArea(path) {
    const zero = Math.min(this.max, Math.max(this.min, 0));
    const baselineRadius = this.getRadialRadiusForValue(zero);
    const baseline = this.coords.map((coord, index) => {
      const angle = this.getRadialAngleForBin(index);
      return this.getRadialPoint(baselineRadius, angle);
    });
    let area = path;

    baseline.reverse().forEach((point) => {
      area += ` L ${point.x},${point.y}`;
    });
    area += ' z';
    return area;
  }

  /**
   * Closes the per-bucket radial minimum and maximum samples into one envelope.
   * Both edges use the same bucket angles as the normal radial path, so line
   * and area variants share scale, rotation, partial arcs and series geometry.
   *
   * @returns {string} Closed SVG path data for the radial min/max envelope.
   */
  getRadialMinMaxArea() {
    const minimumPoints = this.coordsMin.map((coord, index) => {
      const angle = this.getRadialAngleForBin(index);
      return this.getRadialPoint(this.getRadialRadiusForValue(coord[V]), angle);
    });
    const maximumPoints = this.coordsMax.map((coord, index) => {
      const angle = this.getRadialAngleForBin(index);
      return this.getRadialPoint(this.getRadialRadiusForValue(coord[V]), angle);
    });
    let path = `M${minimumPoints[0].x},${minimumPoints[0].y}`;

    minimumPoints.slice(1).forEach((point) => {
      path += ` L ${point.x},${point.y}`;
    });
    maximumPoints.reverse().forEach((point) => {
      path += ` L ${point.x},${point.y}`;
    });
    path += ' z';

    return path;
  }

  /**
   * Creates an SVG arc at one radial scale radius. Draws a full circle as two
   * SVG arc commands because a single command spans less than 360 degrees.
   *
   * @param {number} radius - Radius measured from the graph center.
   * @param {number} startAngle - Clock-oriented start angle.
   * @param {number} endAngle - Clock-oriented end angle.
   * @returns {string} SVG path data.
  */
  getRadialArcPath(radius, startAngle, endAngle) {
    const arcDegrees = endAngle - startAngle;
    const start = this.getRadialPoint(radius, startAngle);

    if (Math.abs(arcDegrees) === 360) {
      const middle = this.getRadialPoint(radius, startAngle + arcDegrees / 2);
      return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${middle.x} ${middle.y} A ${radius} ${radius} 0 0 1 ${start.x} ${start.y}`;
    }

    const end = this.getRadialPoint(radius, endAngle);
    const largeArcFlag = Math.abs(arcDegrees) > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  }

  /**
   * Creates an SVG arc spanning the complete configured radial plot.
   *
   * @param {number} radius - Radius measured from the graph center.
   * @returns {string} SVG path data.
   */
  getRadialPlotArcPath(radius) {
    const geometry = this.getRadialGeometry();
    return this.getRadialArcPath(radius, geometry.rotate, geometry.rotate + geometry.arcDegrees);
  }

  /**
   * Creates one closed annular sector between exact radial angles. Complete
   * circles use two SVG arcs on both edges so the same geometry also supports
   * a day or night period spanning the full visible timeline.
   *
   * @param {number} innerRadius - Inner edge of the ring.
   * @param {number} outerRadius - Outer edge of the ring.
   * @param {number} startAngle - Clock-oriented start angle.
   * @param {number} endAngle - Clock-oriented end angle.
   * @returns {string} Closed SVG path data.
   */
  getRadialAnnularSegmentPath(innerRadius, outerRadius, startAngle, endAngle) {
    const arcDegrees = endAngle - startAngle;
    const outerStart = this.getRadialPoint(outerRadius, startAngle);

    if (Math.abs(arcDegrees) === 360) {
      const outerMiddle = this.getRadialPoint(outerRadius, startAngle + arcDegrees / 2);
      if (innerRadius === 0) {
        const center = this.getRadialGeometry();
        return `M ${outerStart.x} ${outerStart.y} A ${outerRadius} ${outerRadius} 0 0 1 ${outerMiddle.x} ${outerMiddle.y} A ${outerRadius} ${outerRadius} 0 0 1 ${outerStart.x} ${outerStart.y} L ${center.centerX} ${center.centerY} z`;
      }
      const innerStart = this.getRadialPoint(innerRadius, startAngle);
      const innerMiddle = this.getRadialPoint(innerRadius, startAngle - arcDegrees / 2);
      return `M ${outerStart.x} ${outerStart.y} A ${outerRadius} ${outerRadius} 0 0 1 ${outerMiddle.x} ${outerMiddle.y} A ${outerRadius} ${outerRadius} 0 0 1 ${outerStart.x} ${outerStart.y} z M ${innerStart.x} ${innerStart.y} A ${innerRadius} ${innerRadius} 0 0 0 ${innerMiddle.x} ${innerMiddle.y} A ${innerRadius} ${innerRadius} 0 0 0 ${innerStart.x} ${innerStart.y} z`;
    }

    const outerEnd = this.getRadialPoint(outerRadius, endAngle);
    if (innerRadius === 0) {
      const center = this.getRadialGeometry();
      const largeArcFlag = Math.abs(arcDegrees) > 180 ? 1 : 0;
      return `M ${outerStart.x} ${outerStart.y} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y} L ${center.centerX} ${center.centerY} z`;
    }
    const innerStart = this.getRadialPoint(innerRadius, startAngle);
    const innerEnd = this.getRadialPoint(innerRadius, endAngle);
    const largeArcFlag = Math.abs(arcDegrees) > 180 ? 1 : 0;
    return `M ${outerStart.x} ${outerStart.y} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y} L ${innerEnd.x} ${innerEnd.y} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y} z`;
  }

  /**
   * Converts an exact interval from sun.sun History to a background rectangle,
   * chart band or radial ring aligned with its start and end times.
   *
   * @param {Date} segmentStart - Visible segment start.
   * @param {Date} segmentEnd - Visible segment end.
   * @param {Date} rangeStart - Inclusive visible timeline start.
   * @param {Date} rangeEnd - Exclusive visible timeline end.
   * @param {object} config - Validated day/night mode, position, size and offset.
   * @returns {object} Cartesian rectangle or radial path geometry.
   */
  getTimeRangeGeometry(segmentStart, segmentEnd, rangeStart, rangeEnd, config) {
    const duration = rangeEnd.getTime() - rangeStart.getTime();
    const startFraction = (segmentStart.getTime() - rangeStart.getTime()) / duration;
    const endFraction = (segmentEnd.getTime() - rangeStart.getTime()) / duration;
    const chartType = this.input.sparkline.show.chart_type;

    if (chartType === 'radial' || chartType === 'radial_barcode') {
      const radialGeometry = this.getRadialGeometry();
      const outerRadius = config.mode === 'background' ? radialGeometry.outerRadius : radialGeometry.innerRadius + config.offset;
      const innerRadius = config.mode === 'background' ? radialGeometry.innerRadius : outerRadius - config.size;
      const startAngle = this.getRadialAngleForFraction(startFraction);
      const endAngle = this.getRadialAngleForFraction(endFraction);

      return {
        type: 'radial',
        path: this.getRadialAnnularSegmentPath(innerRadius, outerRadius, startAngle, endAngle),
      };
    }

    const x = this.drawArea.x + startFraction * this.drawArea.width;
    const width = (endFraction - startFraction) * this.drawArea.width;
    const height = config.mode === 'background' ? this.drawArea.height : config.size;
    const y =
      config.mode === 'background'
        ? this.drawArea.y
        : config.position === 'top'
          ? this.drawArea.y - config.offset
          : this.drawArea.y + this.drawArea.height - config.size + config.offset;

    return {
      type: 'cartesian',
      x,
      y,
      width,
      height,
    };
  }

  /**
   * Creates the closed annular path behind the complete radial plot. Partial
   * arcs join their inner and outer endpoints; complete circles use two arc
   * pairs and the renderer's even-odd fill rule to preserve the center cutout.
   *
   * @returns {string} Closed SVG path for the configured radial ring.
   */
  getRadialBackgroundPath() {
    const geometry = this.getRadialGeometry();
    return this.getRadialAnnularSegmentPath(geometry.innerRadius, geometry.outerRadius, geometry.rotate, geometry.rotate + geometry.arcDegrees);
  }

  /**
   * Returns the radial History bucket beneath a pointer inside the configured arc.
   *
   * @param {number} x - Pointer x inside the graph SVG.
   * @param {number} y - Pointer y inside the graph SVG.
   * @returns {number} Bucket index, or NaN outside the configured arc.
   */
  getRadialBinIndex(x, y) {
    const geometry = this.getRadialGeometry();
    const radians = Math.atan2(y - geometry.centerY, x - geometry.centerX);
    const pointerAngle = (radians * (180 / Math.PI) + 450) % 360;
    const normalizedStart = ((geometry.rotate % 360) + 360) % 360;
    const normalizedPointer = (((pointerAngle - normalizedStart) % 360) + 360) % 360;

    if (geometry.arcDegrees < 360 && normalizedPointer > geometry.arcDegrees) return NaN;

    const index = Math.min(Math.floor(normalizedPointer / geometry.anglePerBin), geometry.totalBins - 1);
    return index < this.coords.length ? index : NaN;
  }

  /**
   * Calculates the outer and inner arc endpoints for one annular segment.
   *
   * @returns {object} Arc endpoints and SVG arc flags.
   */
  _calcRadialBarcodeCoords(argStartAngle, argEndAngle, argClockwise, argRadiusX, argRadiusY, argWidth) {
    const cx = this.drawArea.x + this.drawArea.width / 2;
    const cy = this.drawArea.y + this.drawArea.height / 2;
    const start = this.polarToCartesian(cx, cy, argRadiusX, argRadiusY, argEndAngle);
    const end = this.polarToCartesian(cx, cy, argRadiusX, argRadiusY, argStartAngle);
    const largeArcFlag = Math.abs(argEndAngle - argStartAngle) <= 180 ? '0' : '1';

    const sweepFlag = argClockwise ? '0' : '1';

    const cutoutRadiusX = argRadiusX - argWidth;
    const cutoutRadiusY = argRadiusY - argWidth;
    const start2 = this.polarToCartesian(cx, cy, cutoutRadiusX, cutoutRadiusY, argEndAngle);
    const end2 = this.polarToCartesian(cx, cy, cutoutRadiusX, cutoutRadiusY, argStartAngle);
    return {
      start,
      end,
      start2,
      end2,
      largeArcFlag,
      sweepFlag,
    };
  }

  /**
   * Converts graph buckets to radial barcode segments. The selected variant
   * uses each value to set segment width or its inner or outer radius; background
   * mode fills the remaining time slots to draw a continuous radial ring.
   *
   * @param {Array<Array<number>>} coords - Graph bucket coordinates.
   * @param {boolean} isBackground - Whether to complete missing period slots.
   * @param {number} columnSpacing - Angular gap between segments.
   * @param {number} rowSpacing - Reserved radial spacing.
   * @returns {Array<Array<number>>} Radial segment coordinate tuples.
   */
  _calcRadialBarcode(coords, isBackground = false, columnSpacing = 4, rowSpacing = 4) {
    const max = this._logarithmic ? Math.log10(Math.max(1, this.max)) : this.max;
    const min = this._logarithmic ? Math.log10(Math.max(1, this.min)) : this.min;
    const radialGeometry = this.getRadialGeometry();
    const segments = radialGeometry.totalBins;
    const angleSize = radialGeometry.anglePerBin;
    const startAngle = radialGeometry.rotate;
    let runningAngle = startAngle;
    const clockWise = true;
    const chartViz = this.input.sparkline.show.chart_viz;
    const halfAngleRadians = ((angleSize - columnSpacing * 2) * Math.PI) / 360;
    const roundedSideFactor = Math.sin(halfAngleRadians);
    let outerRoundFactor = 0;
    let innerRoundFactor = 0;

    // Fit rounded radial barcode styles inside the configured radial band size.
    // Petal and rice-grain edges need extra room at their inner and outer sides.
    switch (chartViz) {
      case "flower":
        outerRoundFactor = this.input.sparkline.show.chart_variant === "sunburst_inward" ? 0 : roundedSideFactor;
        innerRoundFactor = this.input.sparkline.show.chart_variant === "sunburst_outward" ? 0 : roundedSideFactor;
        break;
      case "flower2":
        outerRoundFactor = roundedSideFactor;
        innerRoundFactor = 0;
        break;
      case "rice_grain":
        outerRoundFactor = roundedSideFactor;
        innerRoundFactor = roundedSideFactor;
        break;
      case "bar":
        break;
    }
    const radialBarcodeOuterRadius = radialGeometry.outerRadius / (1 + outerRoundFactor);
    const radialBarcodeInnerRadius = radialGeometry.innerRadius / (1 - innerRoundFactor);
    const radialBarcodeSize = radialBarcodeOuterRadius - radialBarcodeInnerRadius;
    const wRatio = (max - min) / radialBarcodeSize;

    const coords2 = coords.map((coord) => {
      const value = !isBackground ? coord[V] : this.max;
      let ringWidth;
      let radius;
      switch (this.input.sparkline.show?.chart_variant) {
        case 'sunburst':
        case 'sunburst_centered':
          ringWidth = ((this._logarithmic ? Math.log10(Math.max(1, value)) : value) - min) / wRatio;
          radius = radialBarcodeOuterRadius - (radialBarcodeSize - ringWidth) / 2;
          break;
        case 'sunburst_outward':
          ringWidth = ((this._logarithmic ? Math.log10(Math.max(1, value)) : value) - min) / wRatio;
          radius = radialBarcodeOuterRadius - radialBarcodeSize + ringWidth;
          break;
        case 'sunburst_inward':
          ringWidth = ((this._logarithmic ? Math.log10(Math.max(1, value)) : value) - min) / wRatio;
          radius = radialBarcodeOuterRadius;
          break;
        default:
          ringWidth = radialBarcodeSize;
          radius = radialBarcodeOuterRadius;
          break;
      }
      let newX = [];
      let newY = [];
      let radiusX = [];
      let radiusY = [];
      const { start, end, start2, end2, largeArcFlag, sweepFlag } = this._calcRadialBarcodeCoords(runningAngle + columnSpacing, runningAngle + angleSize - columnSpacing, clockWise, radius, radius, ringWidth);
      runningAngle += angleSize;
      newX.push(start.x, end.x, start2.x, end2.x);
      newY.push(start.y, end.y, start2.y, end2.y);
      radiusX.push(radius, radius - ringWidth);
      radiusY.push(radius, radius - ringWidth);
      return [newX, newY, value, 0, radiusX, radiusY, largeArcFlag, sweepFlag];
    });
    if (isBackground) {
      if (coords.length !== segments) {
        let ringWidth;
        let radius;
        const value = this.max;
        switch (this.input.sparkline.show?.chart_variant) {
          case 'sunburst':
          case 'sunburst_centered':
            ringWidth = ((this._logarithmic ? Math.log10(Math.max(1, value)) : value) - min) / wRatio;
            radius = radialBarcodeOuterRadius - (radialBarcodeSize - ringWidth) / 2;
            break;
          case 'sunburst_outward':
            ringWidth = ((this._logarithmic ? Math.log10(Math.max(1, value)) : value) - min) / wRatio;
            radius = radialBarcodeOuterRadius - radialBarcodeSize + ringWidth;
            break;
          case 'sunburst_inward':
            ringWidth = ((this._logarithmic ? Math.log10(Math.max(1, value)) : value) - min) / wRatio;
            radius = radialBarcodeOuterRadius;
            break;
          default:
            ringWidth = radialBarcodeSize;
            radius = radialBarcodeOuterRadius;
            break;
        }
        let bgCoords = [];
        for (let bg = coords.length; bg < segments; bg++) {
          bgCoords[bg] = {};
          bgCoords[bg][X] = bg;
          bgCoords[bg][Y] = 0;
          bgCoords[bg][V] = max;
          let newX = [];
          let newY = [];
          let radiusX = [];
          let radiusY = [];
          const { start, end, start2, end2, largeArcFlag, sweepFlag } = this._calcRadialBarcodeCoords(runningAngle + columnSpacing, runningAngle + angleSize - columnSpacing, clockWise, radius, radius, ringWidth);
          runningAngle += angleSize;
          newX.push(start.x, end.x, start2.x, end2.x);
          newY.push(start.y, end.y, start2.y, end2.y);
          radiusX.push(radius, radius - ringWidth);
          radiusY.push(radius, radius - ringWidth);
          coords2.push([newX, newY, value, 0, radiusX, radiusY, largeArcFlag, sweepFlag]);
        }
      }
    }
    return coords2;
  }

  /**
   * Builds complete radial background segment objects for all period slots.
   *
   * @returns {Array<object>} Background segment geometry.
   */
  getRadialBarcodeBackground(position, total, columnSpacing = 4, rowSpacing = 4) {
    this.backgroundCoords = [];
    this.backgroundCoords = [...this.coords];
    const radialBarcodeCoords = this._calcRadialBarcode(this.backgroundCoords, true, columnSpacing, rowSpacing);

    return radialBarcodeCoords.map((coord, i) => ({
      start: { x: coord[X][0], y: coord[Y][0] },
      end: { x: coord[X][1], y: coord[Y][1] },
      start2: { x: coord[X][2], y: coord[Y][2] },
      end2: { x: coord[X][3], y: coord[Y][3] },
      radius: { x: coord[RX][0], y: coord[RY][0] },
      radius2: { x: coord[RX][1], y: coord[RY][1] },
      largeArcFlag: coord[6],
      sweepFlag: coord[7],
      value: coord[V],
    }));
  }

  /**
   * Converts radial background segments into SVG paths. Flower and rice-grain
   * visualizations derive arc radii from each segment's chord.
   *
   * @returns {Array<string>} SVG path data per background segment.
   */
  getRadialBarcodeBackgroundPaths() {
    const radialBarcodeBackgroundPaths = this.radialBarcodeBackground.map((segment, index) => {
      let rOuterX;
      let rOuterY;
      let rInnerX;
      let rInnerY;
      let sweepFlagTest = '0';

      if (['flower2', 'flower', 'rice_grain'].includes(this.input.sparkline.show?.chart_viz)) {
        // Petal visualizations use the segment chord as their arc radius.
        if (this.input.sparkline.show.chart_viz === 'flower' && this.input.sparkline.show.chart_variant === 'sunburst_inward') {
          rOuterX = segment.radius.x;
          rOuterY = segment.radius.y;
        } else {
          const difX1 = Math.abs(segment.start.x - segment.end.x);
          const difY1 = Math.abs(segment.start.y - segment.end.y);
          rOuterX = Math.sqrt(difX1 * difX1 + difY1 * difY1) / 2;
          rOuterY = rOuterX;
        }
        if (this.input.sparkline.show.chart_viz === 'flower' && this.input.sparkline.show.chart_variant === 'sunburst_outward') {
          rInnerX = segment.radius2.x;
          rInnerY = segment.radius2.y;
        } else {
          const difX2 = Math.abs(segment.start2.x - segment.end2.x);
          const difY2 = Math.abs(segment.start2.y - segment.end2.y);
          rInnerX = Math.sqrt(difX2 * difX2 + difY2 * difY2) / 2;
          rInnerY = rInnerX;
          sweepFlagTest = ['rice_grain', 'flower'].includes(this.input.sparkline.show.chart_viz) ? '1' : '0';
        }
      } else {
        rOuterX = segment.radius.x;
        rOuterY = segment.radius.y;
        rInnerX = segment.radius2.x;
        rInnerY = segment.radius2.y;
      }
      const d = [
        'M',
        segment.start.x,
        segment.start.y,
        'A',
        rOuterX,
        rOuterY,
        0,
        segment.largeArcFlag,
        segment.sweepFlag,
        segment.end.x,
        segment.end.y,
        'L',
        segment.end2.x,
        segment.end2.y,
        'A',
        rInnerX,
        rInnerY,
        0,
        segment.largeArcFlag,
        segment.sweepFlag === sweepFlagTest ? '1' : '0',
        segment.start2.x,
        segment.start2.y,
        'Z',
      ].join(' ');
      return d;
    });
    return radialBarcodeBackgroundPaths;
  }

  /**
   * Builds radial foreground segment objects from available graph buckets.
   *
   * @returns {Array<object>} Foreground segment geometry.
   */
  getRadialBarcode(position, total, columnSpacing = 4, rowSpacing = 4) {
    const radialBarcodeCoords = this._calcRadialBarcode(this.coords, false, columnSpacing, rowSpacing);

    return radialBarcodeCoords.map((coord, i) => ({
      start: { x: coord[X][0], y: coord[Y][0] },
      end: { x: coord[X][1], y: coord[Y][1] },
      start2: { x: coord[X][2], y: coord[Y][2] },
      end2: { x: coord[X][3], y: coord[Y][3] },
      radius: { x: coord[RX][0], y: coord[RY][0] },
      radius2: { x: coord[RX][1], y: coord[RY][1] },
      largeArcFlag: coord[6],
      sweepFlag: coord[7],
      value: coord[V],
    }));
  }

  /**
   * Converts radial foreground segments into the selected SVG petal or bar paths.
   *
   * @returns {Array<string>} SVG path data per foreground segment.
   */
  getRadialBarcodePaths() {
    const radialBarcodePaths = this.radialBarcode.map((segment, index) => {
      let rOuterX;
      let rOuterY;
      let rInnerX;
      let rInnerY;
      let sweepFlagTest = '0';

      if (['flower2', 'flower', 'rice_grain'].includes(this.input.sparkline.show?.chart_viz)) {
        // Petal visualizations use the segment chord as their arc radius.
        if (this.input.sparkline.show.chart_viz === 'flower' && this.input.sparkline.show.chart_variant === 'sunburst_inward') {
          rOuterX = segment.radius.x;
          rOuterY = segment.radius.y;
        } else {
          const difX1 = Math.abs(segment.start.x - segment.end.x);
          const difY1 = Math.abs(segment.start.y - segment.end.y);
          rOuterX = Math.sqrt(difX1 * difX1 + difY1 * difY1) / 2;
          rOuterY = rOuterX;
        }
        if (this.input.sparkline.show.chart_viz === 'flower' && this.input.sparkline.show.chart_variant === 'sunburst_outward') {
          rInnerX = segment.radius2.x;
          rInnerY = segment.radius2.y;
        } else {
          const difX2 = Math.abs(segment.start2.x - segment.end2.x);
          const difY2 = Math.abs(segment.start2.y - segment.end2.y);
          rInnerX = Math.sqrt(difX2 * difX2 + difY2 * difY2) / 2;
          rInnerY = rInnerX;
          sweepFlagTest = ['rice_grain', 'flower'].includes(this.input.sparkline.show.chart_viz) ? '1' : '0';
        }
      } else {
        rOuterX = segment.radius.x;
        rOuterY = segment.radius.y;
        rInnerX = segment.radius2.x;
        rInnerY = segment.radius2.y;
      }
      const d = [
        'M',
        segment.start.x,
        segment.start.y,
        'A',
        rOuterX,
        rOuterY,
        0,
        segment.largeArcFlag,
        segment.sweepFlag,
        segment.end.x,
        segment.end.y,
        'L',
        segment.end2.x,
        segment.end2.y,
        'A',
        rInnerX,
        rInnerY,
        0,
        segment.largeArcFlag,
        segment.sweepFlag === sweepFlagTest ? '1' : '0',
        segment.start2.x,
        segment.start2.y,
        'Z',
      ].join(' ');
      return d;
    });
    return radialBarcodePaths;
  }

  /**
   * Builds cartesian barcode columns. The variant determines whether value
   * controls full height, upward height, downward height, or centered height.
   *
   * @returns {Array<object>} Barcode rectangle geometry.
   */
  getBarcode(position, total, columnSpacing = 4, rowSpacing = 4) {
    const max = this._logarithmic ? Math.log10(Math.max(1, this.max)) : this.max;
    const min = this._logarithmic ? Math.log10(Math.max(1, this.min)) : this.min;

    const coords = this.coords;
    const xRatio = this.drawArea.width / Math.ceil(this.hours * this.points) / total;
    const segmentWidth = xRatio - Math.min(columnSpacing / 2, xRatio / 2);
    const yRatio = (max - min) / this.drawArea.height || 1;

    switch (this.input.sparkline.show.chart_variant) {
      case 'audio':
        return coords.map((coord, i) => ({
          x: xRatio * i * total + xRatio * position + this.drawArea.x,
          y: this.drawArea.height / 2 - ((this._logarithmic ? Math.log10(Math.max(1, coord[V])) : coord[V]) - min) / yRatio / 2,
          height: ((this._logarithmic ? Math.log10(Math.max(1, coord[V])) : coord[V]) - min) / yRatio,
          width: segmentWidth,
          value: coord[V],
        }));
        break;
      case 'stalactites':
        return coords.map((coord, i) => ({
          x: xRatio * i * total + xRatio * position + this.drawArea.x,
          y: 0,
          height: ((this._logarithmic ? Math.log10(Math.max(1, coord[V])) : coord[V]) - min) / yRatio,
          width: segmentWidth,
          value: coord[V],
        }));
        break;
      case 'stalagmites':
        return coords.map((coord, i) => ({
          x: xRatio * i * total + xRatio * position + this.drawArea.x,
          y: this.drawArea.height / 1 - ((this._logarithmic ? Math.log10(Math.max(1, coord[V])) : coord[V]) - min) / yRatio,
          height: ((this._logarithmic ? Math.log10(Math.max(1, coord[V])) : coord[V]) - min) / yRatio,
          width: segmentWidth,
          value: coord[V],
        }));
        break;
      default:
        return coords.map((coord, i) => ({
          x: xRatio * i * total + xRatio * position + this.drawArea.x,
          y: 0,
          height: this.drawArea.height,
          width: segmentWidth,
          value: coord[V],
        }));
        break;
    }
  }

  /**
   * Expands every graph value into the reached equalizer levels and positions
   * multiple entity series side by side inside each time bucket.
   *
   * @returns {Array<object>} Equalizer column geometry.
   */
  getEqualizer(position, total, columnSpacing = 4, rowSpacing = 4) {
    const xRatio = (this.drawArea.width + columnSpacing) / Math.ceil(this.hours * this.points) / total;
    const yRatio = (this._max - this._min) / this.drawArea.height || 1;
    const offset = this._min < 0 ? Math.abs(this._min) / yRatio : 0;

    // Divide the available height between all configured levels and gaps.
    const levelHeight = (this.drawArea.height - this.levelCount * rowSpacing) / this.levelCount;

    let stepRange;
    let equalizerCoords = this.coords.map((coord, i) => {
      let newCoord = [];
      const stepMax = Math.trunc(coord[V] / this.valuesPerBucket);
      const stepMin = Math.trunc(this._min / this.valuesPerBucket);
      stepRange = stepMax - stepMin;

      newCoord[X] = coord[X];
      newCoord[Y] = [];
      newCoord[V] = [];
      for (let i = 0; i < stepRange; i++) {
        newCoord[V][i] = this._min + i * this.valuesPerBucket;
      }
      newCoord[Y] = this._calcLevelY(newCoord);
      return newCoord;
    });
    return equalizerCoords.map((coord, i) => ({
      x: xRatio * i * total + xRatio * position + this.drawArea.x,
      y: coord[Y],
      height: levelHeight,
      width: xRatio - columnSpacing,
      value: coord[V],
    }));
  }

  /**
   * Maps each graph value to its configured grade rank and returns the grade
   * bars reached by that value.
   *
   * @returns {Array<object>} Graded column geometry.
   */
  getGrades(position, total, columnSpacing = 4, rowSpacing = 4) {
    const xRatio = (this.drawArea.width + columnSpacing) / Math.ceil(this.hours * this.points) / total;
    const bucketHeight = (this.drawArea.height - (this.gradeRanks.length - 1) * rowSpacing) / this.gradeRanks.length;

    let stepRange;
    let levelCoords = this.coords.map((coord, i) => {
      let newCoord = [];
      const stepMax = this.gradeRanks.length;
      const stepMin = 0;
      stepRange = stepMax - stepMin;

      newCoord[X] = coord[X];
      newCoord[Y] = [];
      newCoord[V] = [];
      // Find the grade rank and alternative range that contains this value.
      let matchStep = -1;
      let matchBucket = 0;
      let match = false;
      for (let i = 0; i < stepRange; i++) {
        match = false;
        matchBucket = 0;
        for (let j = 0; j < this.gradeRanks[i].rangeMin.length; j++) {
          if (coord[V] >= this.gradeRanks[i].rangeMin[j] && coord[V] < this.gradeRanks[i].rangeMax[j]) {
            match = true;
            matchBucket = j;
            matchStep = i;
          }
        }
      }

      for (let i = 0; i <= stepRange; i++) {
        if (i <= matchStep) newCoord[V][i] = this.gradeRanks[i].rangeMin.length > matchBucket ? this.gradeRanks[i].rangeMin[matchBucket] : this.gradeRanks[i].rangeMin[0];
        newCoord[Y][i] = this.drawArea.height + this.margin.t - i * (bucketHeight + rowSpacing);
      }
      return newCoord;
    });
    return levelCoords.map((coord, i) => ({
      x: xRatio * i * total + xRatio * position + this.drawArea.x,
      y: coord[Y],
      height: bucketHeight,
      width: xRatio - columnSpacing,
      value: coord[V],
    }));
  }

  /**
   * Builds vertical or horizontal bars around the graph's zero baseline and
   * divides each time bucket between the series that share the chart.
   *
   * @returns {Array<object>} Bar rectangle geometry.
   */
  getBars(position, total, columnSpacing = 4, rowSpacing = 4) {
    const coords = this._calcY(this.coords);
    if (this.input.sparkline.bar.orientation === 'horizontal') {
      const bucketHeight = this.drawArea.height / coords.length;
      const barSlotHeight = bucketHeight / total;
      const height = Math.max(1, barSlotHeight - rowSpacing);
      const valueRange = this._max - this._min;
      const zero = Math.min(this._max, Math.max(this._min, 0));
      const zeroX = this.drawArea.x + ((zero - this._min) / valueRange) * this.drawArea.width;

      // Horizontal bars retain the same value scale, but map it onto x. Time
      // buckets and multiple series divide the available height instead.
      return coords.map((coord, i) => {
        const valueX = this.drawArea.x + ((coord[V] - this._min) / valueRange) * this.drawArea.width;
        return {
          x: Math.min(zeroX, valueX),
          y: this.drawArea.y + bucketHeight * i + barSlotHeight * (position + 0.5) - height / 2,
          height,
          width: Math.max(1, Math.abs(valueX - zeroX)),
          value: coord[V],
        };
      });
    }

    const bucketWidth = coords.length > 1 ? coords[1][X] - coords[0][X] : this.drawArea.width;
    const barSlotWidth = bucketWidth / total;
    const yRatio = (this._max - this._min) / this.drawArea.height || 1;
    const offset = this._min < 0 ? Math.abs(this._min) / yRatio : 0;

    const width = Math.max(1, barSlotWidth - columnSpacing);
    return coords.map((coord, i) => ({
      x: coord[X] - bucketWidth / 2 + barSlotWidth * (position + 0.5) - width / 2,
      y: this._min > 0 ? coord[Y] : coord[Y2],
      height: coord[V] > 0 ? (this._min < 0 ? coord[V] / yRatio : (coord[V] - this._min) / yRatio) : coord[Y] - coord[Y2],
      width,
      value: coord[V],
    }));
  }

  /**
   * Calculates the midpoint used as a smoothed line endpoint.
   *
   * @returns {Array<number>} Midpoint x and y.
   */
  _midPoint(Ax, Ay, Bx, By) {
    const Zx = (Ax - Bx) / 2 + Bx;
    const Zy = (Ay - By) / 2 + By;
    return [Zx, Zy];
  }

  /**
   * Aggregates bucket rows by median value.
   *
   * @param {Array<object>} items - Bucket rows.
   * @returns {number} Median state value.
   */
  _median(items) {
    const itemsDup = [...items].sort((a, b) => parseFloat(a.state) - parseFloat(b.state));
    const mid = Math.floor((itemsDup.length - 1) / 2);
    if (itemsDup.length % 2 === 1) return parseFloat(itemsDup[mid].state);
    return (parseFloat(itemsDup[mid].state) + parseFloat(itemsDup[mid + 1].state)) / 2;
  }

  /**
   * Rounds a timestamp down to the start of its configured history bucket.
   *
   * @param {Date} date - Timestamp to align.
   * @returns {Date} Timestamp aligned to the bucket start.
   */
  _snapToBin(date) {
    const binMinutes = 60 / this.points;
    const binMs = binMinutes * 60 * 1000;
    return new Date(Math.floor(date.getTime() / binMs) * binMs);
  }

  /**
   * Sets the end timestamp used to place History rows in visible buckets.
   * Calendar periods end at their configured local boundary; rolling windows
   * end just after the current bucket.
   *
   * @returns {void}
   */
  _updateEndTime() {
    this._endTime = new Date();
    if (this.input.period.type === 'calendar') {
      if (this.input.period.calendar.period === 'day' && (this.input.period.calendar.offset !== 0 || this.input.period.calendar.full_day === true)) {
        // Offset days and full-day calendar graphs end at the configured local
        // midnight after their visible period.
        const calendarStart = new Date(this._endTime);
        calendarStart.setHours(0, 0, 0, 0);
        calendarStart.setHours(calendarStart.getHours() + this.input.period.calendar.offset * 24 - (this.input.period.calendar.duration.hour - 24));
        this._endTime = new Date(calendarStart.getTime() + this.input.period.calendar.duration.hour * ONE_HOUR);
      } else if (this.input.period.calendar.period === 'day') {
        this._endTime = this._snapToBin(this._endTime);
        this._endTime = new Date(this._endTime.getTime() + (60 / this.points) * 60 * 1000);
      }
    } else if (this.input.period.type === 'rolling_window') {
      // Rolling window buckets are stored by their start time. _endTime is the
      // exclusive end of the active bucket, so 10:52 with 30-minute bins ends
      // at 11:00 and the last rendered bucket starts at 10:30.
      this._endTime = this._snapToBin(this._endTime);
      this._endTime = new Date(this._endTime.getTime() + (60 / this.points) * 60 * 1000);
    } else {
      switch (this._groupBy) {
        case 'month':
          this._endTime.setMonth(this._endTime.getMonth() + 1);
          this._endTime.setDate(1);
          break;
        case 'date':
          this._endTime.setDate(this._endTime.getDate() + 1);
          this._endTime.setHours(0, 0, 0, 0);
          break;
        case 'hour':
          this._endTime.setHours(this._endTime.getHours() + 1);
          this._endTime.setMinutes(0, 0, 0);
          break;
        default:
          break;
      }
    }
  }
}
