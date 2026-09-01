import Colors from './colors';
import Utils from './utils';
import { FONT_SIZE } from './const';

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
 * Converts normalized Home Assistant history into chart-independent buckets
 * and chart-specific SVG geometry. The relevant normalized config shape is:
 *
 * period:
 *   type: rolling_window
 *   rolling_window:
 *     duration: { hour: 24 }
 *     bins: { per_hour: 2 }
 * sparkline:
 *   state_values: { aggregate_func: avg }
 *
 * SparklineGraphTool owns the lifecycle around this engine: it supplies rows,
 * consumes the generated geometry, and renders that geometry with Lit.
 */
export default class SparklineGraph {
  /**
   * Returns the drawable circumference represented by a radial arc. Series
   * uses this engine-owned measurement only to choose one shared auto density.
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
   * Creates the geometry engine for one normalized sparkline configuration.
   * SparklineGraphTool owns fetching and rendering; this class turns source
   * rows into bucket metadata, axis geometry, and chart-specific coordinates.
   *
   * @param {number} width - SVG graph width.
   * @param {number} height - SVG graph height.
   * @param {object} axisMargin - Space reserved outside the shared axis area.
   * @param {object} configuredMargin - User-configured margin inside the axes.
   * @param {object} config - Validated sparkline configuration.
   * @param {Array<number>} gradeValues - Numeric grade boundaries.
   * @param {Array<object>} gradeRanks - Visual grade ranges.
   * @param {object} stateMap - Numeric mapping for categorical state bands.
   */
  constructor(width, height, axisMargin, configuredMargin, config, gradeValues = [], gradeRanks = [], stateMap = {}) {
    this.aggregateFuncMap = {
      avg: this._average,
      median: this._median,
      max: this._maximum,
      min: this._minimum,
      first: this._first,
      last: this._last,
      sum: this._sum,
      delta: this._delta,
      diff: this._diff,
    };

    this.config = config;

    this.width = width;
    this.height = height;

    // graphArea is the complete SVG viewport. The engine owns every area used
    // for chart geometry; the tool only supplies the measured outer axis space.
    this.graphArea = {};
    this.graphArea.x = 0;
    this.graphArea.y = 0;
    this.graphArea.width = width - 2 * this.graphArea.x;
    this.graphArea.height = height - 2 * this.graphArea.y;

    this.axisArea = {};
    this.dataArea = {};
    this.setGraphAreas(axisMargin, configuredMargin, 0);

    this._history = undefined;
    this.coords = [];
    this.bucketMeta = [];
    this.stateBandSegments = [];
    this.stateBandTransitions = [];
    this.xAxis = {};
    this.yAxis = {};
    this._max = 0;
    this._min = 0;
    this.sharedYAxisBounds = undefined;
    // Real-time retains the original one-value graph contract and has no
    // duration or bins. Historical period types use their configured range.
    if (this.config.period.type === 'real_time') {
      this.points = 1;
      this.hours = 1;
    } else {
      const period = this.config.period[this.config.period.type];
      this.points = period.bins.per_hour;
      this.hours = period.duration.hour;
    }
    this.aggregateFuncName = this.config.sparkline.state_values.aggregate_func;
    this._calcPoint = this.aggregateFuncMap[this.aggregateFuncName];
    this._smoothing = this.config.sparkline.state_values?.smoothing;
    this._logarithmic = this.config.sparkline.state_values?.logarithmic;
    this._groupBy = this.config.period.group_by;
    this._endTime = 0;
    this.valuesPerBucket = 0;
    this.levelCount = 1;
    this.gradeValues = gradeValues;
    this.gradeRanks = gradeRanks;
    this.stateMap = { ...stateMap };
    this.radialConfig = this.config.sparkline.radial;
    this.radialBarcodeSize = Utils.calculateSvgDimension(this.config.sparkline.radial_barcode.size);
  }

  /**
   * Applies outer axis space and calculates the inner paint extent owned by
   * the active chart. Bars reserve half a final bar at both time endpoints;
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
    const chartType = this.config.sparkline.show.chart_type;
    let rendersDots = chartType === 'dots';
    let chartTop = 0;
    let chartRight = 0;
    let chartBottom = 0;
    let chartLeft = 0;

    if (chartType === 'line') {
      rendersDots = this.config.sparkline.show.points === true || this.config.sparkline.line.show_dots === true;
    }
    if (chartType === 'radial') {
      const radialVariant = this.config.sparkline.show.chart_variant;
      rendersDots = radialVariant === 'dots' || this.config.sparkline.show.points === true || this.config.sparkline.line.show_dots === true || this.config.sparkline.area.show_dots === true;
      if (radialVariant !== 'dots' && this.config.sparkline.show.line !== false) {
        const lineExtent = this.config.geometry.line_width / 2;
        chartTop = lineExtent;
        chartRight = lineExtent;
        chartBottom = lineExtent;
        chartLeft = lineExtent;
      }
    }

    if (chartType === 'area') {
      rendersDots = this.config.sparkline.show.points === true || this.config.sparkline.area.show_dots === true;
    }

    if (rendersDots) {
      const radius = Utils.calculateSvgDimension(this.config.sparkline.dots.radius);
      const inheritedStrokeWidth = this.config.geometry.line_width / 2;
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
      const finalBarWidth = Math.max(1, (configuredDataWidth + this.config.geometry.column_spacing) / bucketCount - this.config.geometry.column_spacing);
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
    this.configuredMargin = { ...configuredMargin };
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
   * Pins this graph to the y-range shared by the owning SparklineSeries
   * coordinator. The engine still calculates its own ticks and paths, but all
   * series convert values into the same SVG y coordinates.
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
   * Stores normalized source rows for the next graph update.
   *
   * @param {Array<object>} data - History rows prepared by SparklineGraphTool.
   */
  set history(data) {
    this._history = data;
  }

  /**
   * Updates graph data and reports whether complete axis geometry is available.
   *
   * @param {Array<object>|undefined} history - Graph source rows.
   * @returns {boolean} True after axis geometry has been built; otherwise false.
   */
  update(history = undefined) {
    if (history) {
      this._history = history;
    }
    if (!this._history) return false;
    if (this._history.length === 0) return false;

    // State bands use exact transition timestamps and never aggregate or align
    // their visible history range to graph buckets.
    if (this.config.sparkline.show.chart_type === 'state_bands') {
      this.min = Math.min(...this.stateMap.map.map((entry) => Number(entry.value)));
      this.max = Math.max(...this.stateMap.map.map((entry) => Number(entry.value)));
      this.coords = [];
      this.bucketMeta = [];
      this.buildAxisGeometry();
      return true;
    }

    // Establish the time boundary before rows are assigned to buckets.
    this._updateEndTime();
    let date = new Date();
    date.getDate();
    this.offsetHours = 0;
    if (this.config.period.type === 'calendar') {
      if (this.config.period?.calendar?.period === 'day') {
        let extraHours = this.config.period.calendar.duration.hour - 24;
        let hours = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600 + extraHours;
        this.offsetHours = Math.abs(this.config.period.calendar.offset * 24);
      }
    }

    // Determine the fixed number of visible slots before reducing history.
    let requiredNumOfPoints;
    const bucketMs = ONE_HOUR / this.points;
    this.calendarBucketStartMs = undefined;
    this.calendarBucketCount = undefined;
    this.visibleBucketCount = undefined;
    this.offsetHours = 0;
    switch (this.config.period.type) {
      case 'real_time':
        requiredNumOfPoints = 1;
        this.visibleBucketCount = requiredNumOfPoints;
        this.hours = 1;
        break;
      case 'calendar':
        if (this.config.period?.calendar?.period === 'day') {
          const calendarStart = new Date(date);
          calendarStart.setHours(0, 0, 0, 0);
          calendarStart.setHours(calendarStart.getHours() + this.config.period.calendar.offset * 24 - (this.config.period.calendar.duration.hour - 24));

          if (this.config.period.calendar.offset === 0 && this.config.period.calendar.full_day !== true) {
            this.calendarBucketCount = Math.ceil((this._endTime.getTime() - calendarStart.getTime()) / bucketMs);
            this.calendarBucketStartMs = this._endTime.getTime() - this.calendarBucketCount * bucketMs;
          } else {
            this.offsetHours = Math.abs(this.config.period.calendar.offset * this.hours);
            this.calendarBucketCount = Math.round((this.config.period.calendar.duration.hour * ONE_HOUR) / bucketMs);
            this.calendarBucketStartMs = calendarStart.getTime();
          }

          requiredNumOfPoints = this.calendarBucketCount;
          this.visibleBucketCount = requiredNumOfPoints;

          // A current series in a complete comparison day ends at its projected
          // current time. Historical series retain every bucket through midnight.
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

    // The real-time series already is its single graph bucket. Only historical
    // period types require timestamp-based reduction into buckets.
    const histGroups = this.config.period.type === 'real_time' ? [this._history] : this._history.reduce((res, item) => this._reducer(res, item), []);
    // Preserve one preceding sample so its state carries into the first slot.
    if (histGroups[0] && histGroups[0].length) {
      histGroups[0] = [histGroups[0][histGroups[0].length - 1]];
    }
    histGroups.length = requiredNumOfPoints;

    try {
      this.coords = this._calcPoints(histGroups);
    } catch (error) {
      console.log('error in calcpoints');
    }
    this.min = Math.min(...this.coords.map((item) => Number(item[V])));
    this.max = Math.max(...this.coords.map((item) => Number(item[V])));

    const bucketStart = this.config.period.type === 'calendar' && this.config.period.calendar.period === 'day' ? this.calendarBucketStartMs : this._endTime.getTime() - this.hours * ONE_HOUR;
    this.bucketMeta = [];
    for (let i = 0; i < histGroups.length; i += 1) {
      const bucket = histGroups[i];
      const point = this.coords[i];
      const start = new Date(bucketStart + i * bucketMs);
      const end = new Date(start.getTime() + bucketMs);
      const items = bucket ? bucket.filter(Boolean) : [];

      if (items.length === 0) {
        this.bucketMeta[i] = {
          index: i,
          start,
          end,
          value: point ? point[V] : undefined,
          min: undefined,
          avg: undefined,
          max: undefined,
          count: 0,
        };
      } else {
        const values = items.map((item) => Number(item.state));
        const sum = values.reduce((acc, value) => acc + value, 0);
        this.bucketMeta[i] = {
          index: i,
          start,
          end,
          value: point ? point[V] : undefined,
          min: Math.min(...values),
          avg: sum / values.length,
          max: Math.max(...values),
          count: values.length,
        };
      }
    }

    // Calculate min/max samples only for the active graph family.
    // Line settings must not leak into area, and area settings must not leak into line.
    const chartType = this.config.sparkline.show.chart_type;
    const graphFamily = chartType === 'radial' ? this.config.sparkline.show.chart_variant : chartType;
    const showMinMax = graphFamily === 'line' ? this.config.sparkline.line?.show_minmax === true : graphFamily === 'area' && this.config.sparkline.area?.show_minmax === true;

    if (['line', 'area'].includes(graphFamily) && showMinMax) {
      const histGroupsMinMax = this._history.reduce((res, item) => this._reducerMinMax(res, item), []);

      // Preserve the same preceding sample in both envelope series.
      if (histGroupsMinMax[0][0] && histGroupsMinMax[0][0].length) {
        histGroupsMinMax[0][0] = [histGroupsMinMax[0][0][histGroupsMinMax[0][0].length - 1]];
      }
      if (histGroupsMinMax[1][0] && histGroupsMinMax[1][0].length) {
        histGroupsMinMax[1][0] = [histGroupsMinMax[1][0][histGroupsMinMax[1][0].length - 1]];
      }

      // Match the envelope arrays to the primary graph slot count.
      histGroupsMinMax[0].length = requiredNumOfPoints;
      histGroupsMinMax[1].length = requiredNumOfPoints;

      const histGroupsMin = [...histGroups];
      const histGroupsMax = [...histGroups];

      let prevFunction = this._calcPoint;
      this._calcPoint = this.aggregateFuncMap.min;
      this.coordsMin = [];
      this.coordsMin = this._calcPoints(histGroupsMin);
      this._calcPoint = this.aggregateFuncMap.max;
      this.coordsMax = [];
      this.coordsMax = this._calcPoints(histGroupsMax);
      this._calcPoint = prevFunction;

      // The envelope, rather than the aggregate line, defines the visible range.
      this.min = Math.min(...this.coordsMin.map((item) => Number(item[V])));
      this.max = Math.max(...this.coordsMax.map((item) => Number(item[V])));
    }

    // Optional graph bounds override only their configured side. Automatic
    // ranges remain unchanged when neither bound is present.
    if (this.config.y_axis.lower_bound !== undefined) this.min = Number(this.config.y_axis.lower_bound);
    if (this.config.y_axis.upper_bound !== undefined) this.max = Number(this.config.y_axis.upper_bound);

    this.buildAxisGeometry();
    return true;
  }

  /**
   * Calculates reusable x-axis and y-axis geometry next to the existing graph
   * API. The graph engine keeps providing coords/path helpers as before, while
   * the tool layer can later consume these prepared ticks and ranges directly.
   */
  buildAxisGeometry() {
    const fontSizeX = this.config.x_axis.labels.styles['font-size'];
    const fontSizeY = this.config.y_axis.labels.styles['font-size'];
    const parsedFontSizeX = Number.parseFloat(fontSizeX);
    const parsedFontSizeY = Number.parseFloat(fontSizeY);
    const fontWidthPixels = fontSizeX.endsWith('%') ? (parsedFontSizeX / 100) * FONT_SIZE * 0.45 : fontSizeX.endsWith('em') || fontSizeX.endsWith('rem') ? parsedFontSizeX * FONT_SIZE * 0.45 : parsedFontSizeX * 0.45;
    const fontHeightPixels = fontSizeY.endsWith('%') ? (parsedFontSizeY / 100) * FONT_SIZE * 0.85 : fontSizeY.endsWith('em') || fontSizeY.endsWith('rem') ? parsedFontSizeY * FONT_SIZE * 0.85 : parsedFontSizeY * 0.85;
    const xAxis = this.calculateXAxisGeometry(fontWidthPixels);
    const yAxis = this.config.sparkline.show.chart_type === 'state_bands' ? this.calculateStateBandsYAxisGeometry() : this.calculateYAxisGeometry(fontHeightPixels);

    this.min = yAxis.min;
    this.max = yAxis.max;
    this.xAxis = xAxis;
    this.yAxis = yAxis;
  }

  /**
   * Calculates the time range and tick positions for the x-axis without using
   * graph coords. Calendar and rolling_window stay separated here, while the
   * existing graph rendering remains untouched for now.
   *
   * @param {number} fontWidthPixels Average character width in pixels.
   * @returns {object} Axis range, interval and ticks.
   */
  calculateXAxisGeometry(fontWidthPixels) {
    const period = this.config.period[this.config.period.type];
    const now = new Date();
    const bucketMs = ONE_HOUR / this.points;
    let axisStart;
    let axisEnd;
    let dataStart;
    let dataEnd;

    if (this.config.sparkline.show.chart_type === 'state_bands') {
      if (this.config.period.type === 'calendar') {
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
    } else if (this.config.period.type === 'calendar' && period.period === 'day') {
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
    const approxLabelWidth = (this.config.x_axis.labels.max_length / 5) * (1 * fontWidthPixels + FONT_SIZE);
    const maxLabels = Math.floor(this.drawArea.width / approxLabelWidth);
    const effectiveMaxLabels = Math.max(maxLabels, 4);
    const minTimeStep = totalDuration / (effectiveMaxLabels - 1);
    const timeIntervals = [1000, 5000, 15000, 30000, 60000, 300000, 600000, 900000, 1800000, 3600000, 7200000, 14400000, 21600000, 43200000, 86400000, 172800000, 604800000, 2629800000];
    let selectedIndex = timeIntervals.findIndex((interval) => interval >= minTimeStep);

    if (selectedIndex < 0) selectedIndex = timeIntervals.length - 1;

    while (selectedIndex > 0 && totalDuration / timeIntervals[selectedIndex] < 2) {
      selectedIndex -= 1;
    }

    // Binned graphs can only place ticks on bucket boundaries. Keep the
    // automatically selected density, unless its interval is incompatible
    // with bins.per_hour; then use the next compatible existing interval.
    if (this.config.sparkline.show.chart_type !== 'state_bands') {
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
            const percentage = (currentTickMs - minMs) / totalDuration;
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
        const percentage = (currentTickMs - minMs) / totalDuration;
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
        const percentage = (currentTickMs - minMs) / totalDuration;
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
    if (this.config.sparkline.show.chart_type !== 'state_bands' && this.config.period.type === 'calendar' && period.period === 'day') {
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
   * Calculates categorical rows for state bands. Every row uses 10% top
   * margin, 25% label, 15% middle margin, 40% band and 10% bottom margin.
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
   * Builds exact historical state periods inside the prepared categorical rows.
   * The first known state is clipped to the visible start and unknown time is
   * intentionally left empty.
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

    // Keep transition geometry separate from the rendered state segments. A
    // transition exists only where two known states meet at the same time.
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
   * Calculates the numeric range and tick positions for the y-axis so the tool
   * can later render grid and labels from engine output instead of recalculating
   * them a second time.
   *
   * @param {number} fontHeightPixels Label height in pixels.
   * @returns {object} Axis range, interval and ticks.
   */
  calculateYAxisGeometry(fontHeightPixels) {
    const fixedLowerBound = this.sharedYAxisBounds !== undefined ? this.sharedYAxisBounds.fixedLowerBound : this.config.y_axis.lower_bound !== undefined;
    const fixedUpperBound = this.sharedYAxisBounds !== undefined ? this.sharedYAxisBounds.fixedUpperBound : this.config.y_axis.upper_bound !== undefined;
    let dataMin = this.sharedYAxisBounds !== undefined ? this.sharedYAxisBounds.lowerBound : fixedLowerBound ? Number(this.config.y_axis.lower_bound) : this.min;
    let dataMax = this.sharedYAxisBounds !== undefined ? this.sharedYAxisBounds.upperBound : fixedUpperBound ? Number(this.config.y_axis.upper_bound) : this.max;

    if (dataMin === dataMax) {
      if (!fixedLowerBound) dataMin -= 1;
      if (!fixedUpperBound) dataMax += 1;
    }

    const minSpacePerLabel = fontHeightPixels * 1.5;
    const axisLength = this.config.sparkline.show.chart_type === 'radial' ? this.getRadialGeometry().radialSize : this.drawArea.height;
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

    // Without y labels there are no numeric endpoints to round. Divide the exact
    // data range evenly so optional grid lines and tickmarks remain visually regular.
    if (!this.config.sparkline.show.labels.y) {
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
    // Visible y labels need clean endpoint values. Without y labels, retain the
    // exact data range so the graph uses the complete available chart height or radial band.
    const min = fixedLowerBound ? dataMin : Math.floor(dataMin / interval) * interval;
    const max = fixedUpperBound ? dataMax : Math.ceil(dataMax / interval) * interval;
    const ticks = [];
    const majorStart = Math.ceil(min / interval) * interval;

    // The scale bounds explain the visible range. Fill the remaining label
    // positions with clean interval values, then retain an even selection when
    // more clean ticks exist than the available axis length can display.
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
   * Collects the exact minimum and maximum samples per time bucket. These
   * parallel series form the optional min/max envelope behind line and area
   * charts independently of the selected aggregate function.
   *
   * @param {Array<Array<object>>} res - Minimum and maximum bucket collections.
   * @param {object} item - Normalized history row.
   * @returns {Array<Array<object>>} Updated bucket collections.
   */
  _reducerMinMax(res, item) {
    const age = this._endTime - new Date(item.last_changed).getTime();
    const interval = (age / ONE_HOUR) * this.points - this.hours * this.points;

    const key = interval < 0 ? Math.floor(Math.abs(interval)) : 0;
    if (!res[0]) res[0] = [];
    if (!res[1]) res[1] = [];
    if (!res[0][key]) {
      res[0][key] = {};
      res[1][key] = {};
    }
    res[0][key].state = Math.min(res[0][key].state ? res[0][key].state : Number.POSITIVE_INFINITY, item.state);
    res[0][key].haState = Math.min(res[0][key].haState ? res[0][key].haState : Number.POSITIVE_INFINITY, item.haState);
    res[1][key].state = Math.max(res[1][key].state ? res[1][key].state : Number.NEGATIVE_INFINITY, item.state);
    res[1][key].haState = Math.max(res[1][key].haState ? res[1][key].haState : Number.NEGATIVE_INFINITY, item.haState);
    return res;
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
    const { type } = this.config.period;
    const period = this.config.period[type];

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
      // Rolling windows use an exclusive end time. A sample inside the active
      // 10:30-11:00 bucket must therefore land on the last bucket index, not
      // one bucket earlier.
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
   * Converts buckets into x/value tuples. Empty buckets carry the most recent
   * raw state while populated buckets use the configured aggregate function.
   *
   * @param {Array<Array<object>>} history - Bucketed history rows.
   * @returns {Array<Array<number>>} Tuples in X, Y placeholder and value order.
   */
  _calcPoints(history) {
    const coords = [];
    let xRatio = this.drawArea.width / (this.hours * this.points - 1);
    xRatio = Number.isFinite(xRatio) ? xRatio : this.drawArea.width;

    const first = history.filter(Boolean)[0];
    let last = [this._calcPoint(first), this._lastValue(first)];
    const getCoords = (item, i) => {
      const x = xRatio * i + this.drawArea.x;
      if (item) last = [this._calcPoint(item), this._lastValue(item)];
      return coords.push([x, 0, item ? last[0] : last[1]]);
    };

    for (let i = 0; i < this.visibleBucketCount; i += 1) getCoords(history[i], i);

    return coords;
  }

  /**
   * Projects numeric values onto the drawing area's y-axis. Each tuple retains
   * both its normal y and its zero-baseline y for positive/negative bar geometry.
   *
   * @param {Array<Array<number>>} coords - X/value tuples.
   * @returns {Array<Array<number>>} SVG coordinate tuples.
   */
  _calcY(coords) {
    // Logarithmic graphs project values and bounds in the same domain.
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
          ? this.drawArea.height + this.drawArea.top * 1 - offset / yRatio - (val - Math.max(0, min)) / yRatio // - this.margin.y * 2
          : this.drawArea.height + this.drawArea.top * 1 - (0 - min) / yRatio; // - this.margin.y * 4;
      const coordY = this.drawArea.height + this.drawArea.y * 1 - (val - min) / yRatio; // - this.margin.y * 2;

      return [coord[X], coordY, coord[V], coordY2];
    });
    return coords2;
  }

  /**
   * Projects graph value tuples onto the current public drawing geometry.
   * Consumers use this method after shared axis bounds and margins are set.
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
    // account for logarithmic graph
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
   * Returns visible point coordinates, applying midpoint smoothing when the
   * configured line uses curves.
   *
   * @returns {Array<Array<number>>} Point tuples with source bucket indexes.
   */
  getPoints() {
    let { coords } = this;
    if (coords.length === 1) {
      // Real-time charts represent one current value across their complete width.
      // Historical charts retain the configured time axis and occupy one bin.
      const singletonWidth = this.config.period.type === 'real_time' ? this.drawArea.width : this.drawArea.width / (this.hours * this.points - 1);
      coords = [coords[0], [coords[0][X] + singletonWidth, 0, coords[0][V]]];
    }
    coords = this._calcY(coords);
    let next;
    let Z;
    let last = coords[0];
    coords.shift();
    const coords2 = coords.map((point, i) => {
      next = point;
      Z = this._smoothing ? this._midPoint(last[X], last[Y], next[X], next[Y]) : next;
      const sum = this._smoothing ? (next[V] + last[V]) / 2 : next[V];
      last = next;
      return [Z[X], Z[Y], sum, i + 1];
    });
    return coords2;
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
      const singletonWidth = this.config.period.type === 'real_time' ? this.drawArea.width : this.drawArea.width / (this.hours * this.points - 1);
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
      const singletonWidth = this.config.period.type === 'real_time' ? this.drawArea.width : this.drawArea.width / (this.hours * this.points - 1);
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
      const singletonWidth = this.config.period.type === 'real_time' ? this.drawArea.width : this.drawArea.width / (this.hours * this.points - 1);
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
   * @returns {Array<object>} Colors and percentage offsets for SVG stops.
   */
  computeGradient(thresholds, logarithmic) {
    const scale = logarithmic ? Math.log10(Math.max(1, this._max)) - Math.log10(Math.max(1, this._min)) : this._max - this._min;
    // Extend the scale for the SVG area below the drawing region so gradient
    // thresholds remain aligned with the plotted y-range.
    const scaleOffset = (scale / (this.graphArea.height - this.margin.b)) * this.graphArea.height - scale;
    return thresholds.map((stop, index, arr) => {
      let color;
      if (stop.value > this._max && arr[index + 1]) {
        const factor = (this._max - arr[index + 1].value) / (stop.value - arr[index + 1].value);
        color = Colors.getGradientValue(arr[index + 1].color, stop.color, factor);
      } else if (stop.value < this._min && arr[index - 1]) {
        const factor = (arr[index - 1].value - this._min) / (arr[index - 1].value - stop.value);
        color = Colors.getGradientValue(arr[index - 1].color, stop.color, factor);
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
   * Describes the polar plot shared by radial barcode, line, area and dots.
   * History advances clockwise from the configured rotation at twelve o'clock;
   * every renderer consumes these values instead of deriving its own angles.
   *
   * @returns {object} Center, radius, arc and bucket-angle geometry.
   */
  getRadialGeometry() {
    const outerRadius = Math.min(this.drawArea.width, this.drawArea.height) / 2;
    const radialSize = Math.min(Utils.calculateSvgDimension(this.radialConfig.size), outerRadius);
    const innerRadius = outerRadius - radialSize;
    const centerX = this.drawArea.x + this.drawArea.width / 2;
    const centerY = this.drawArea.y + this.drawArea.height / 2;
    const totalBins = Math.ceil(this.hours * this.points);
    const arcDegrees = Number(this.radialConfig.arc_degrees);
    const rotate = Number(this.radialConfig.rotate);

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
   * Converts one value into its radius on the active y-scale. Zero is not
   * special here: radial area asks for zero explicitly when it builds its
   * baseline, while line and dots project their actual bucket values.
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
   * Projects graph buckets into the shared radial coordinate system. Tuple
   * indexes remain compatible with normal graph coordinates; angle, radius and
   * source bucket index are appended for radial rendering and interaction.
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
   * contract used by cartesian history charts.
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
    const geometry = this.getRadialGeometry();
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
   * Creates an SVG arc at one radial scale radius. Full circles are split into
   * two arcs because one SVG arc command cannot describe 360 degrees.
   *
   * @param {number} radius - Radius measured from the graph center.
   * @param {number} startAngle - Clock-oriented start angle.
   * @param {number} endAngle - Clock-oriented end angle.
   * @returns {string} SVG path data.
   */
  getRadialArcPath(radius, startAngle, endAngle) {
    const geometry = this.getRadialGeometry();
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
   * Creates the closed annular path behind the complete radial plot. Partial
   * arcs join their inner and outer endpoints; complete circles use two arc
   * pairs and the renderer's even-odd fill rule to preserve the center cutout.
   *
   * @returns {string} Closed SVG path for the configured radial ring.
   */
  getRadialBackgroundPath() {
    const geometry = this.getRadialGeometry();
    const startAngle = geometry.rotate;
    const endAngle = geometry.rotate + geometry.arcDegrees;
    const outerStart = this.getRadialPoint(geometry.outerRadius, startAngle);

    if (geometry.arcDegrees === 360) {
      const outerMiddle = this.getRadialPoint(geometry.outerRadius, startAngle + 180);
      let path = `M ${outerStart.x} ${outerStart.y} A ${geometry.outerRadius} ${geometry.outerRadius} 0 0 1 ${outerMiddle.x} ${outerMiddle.y} A ${geometry.outerRadius} ${geometry.outerRadius} 0 0 1 ${outerStart.x} ${outerStart.y} z`;

      if (geometry.innerRadius > 0) {
        const innerStart = this.getRadialPoint(geometry.innerRadius, startAngle);
        const innerMiddle = this.getRadialPoint(geometry.innerRadius, startAngle - 180);
        path += ` M ${innerStart.x} ${innerStart.y} A ${geometry.innerRadius} ${geometry.innerRadius} 0 0 0 ${innerMiddle.x} ${innerMiddle.y} A ${geometry.innerRadius} ${geometry.innerRadius} 0 0 0 ${innerStart.x} ${innerStart.y} z`;
      }
      return path;
    }

    const outerEnd = this.getRadialPoint(geometry.outerRadius, endAngle);
    const largeArcFlag = geometry.arcDegrees > 180 ? 1 : 0;
    if (geometry.innerRadius === 0) {
      return `M ${outerStart.x} ${outerStart.y} A ${geometry.outerRadius} ${geometry.outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y} L ${geometry.centerX} ${geometry.centerY} z`;
    }

    const innerStart = this.getRadialPoint(geometry.innerRadius, startAngle);
    const innerEnd = this.getRadialPoint(geometry.innerRadius, endAngle);
    return `M ${outerStart.x} ${outerStart.y} A ${geometry.outerRadius} ${geometry.outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y} L ${innerEnd.x} ${innerEnd.y} A ${geometry.innerRadius} ${geometry.innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y} z`;
  }

  /**
   * Maps a pointer in graph coordinates back to the radial history bucket.
   * Points outside a partial arc have no bucket and therefore no tooltip.
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
   * Returns the annular endpoints used to draw one radial barcode segment.
   *
   * @param {number} startAngle - Segment start angle.
   * @param {number} endAngle - Segment end angle.
   * @param {boolean} clockwise - Arc direction.
   * @param {number} radiusX - Horizontal outer radius.
   * @param {number} radiusY - Vertical outer radius.
   * @param {number} width - Ring width.
   * @returns {object} Outer and inner endpoints with SVG arc flags.
   */
  calculateRadialSegment(startAngle, endAngle, clockwise, radiusX, radiusY, width) {
    return this._calcRadialBarcodeCoords(startAngle, endAngle, clockwise, radiusX, radiusY, width);
  }

  /**
   * Transforms graph buckets into annular geometry. Variants change whether
   * value controls width, inner radius, outer radius, or neither; background
   * mode completes every period slot to provide a continuous hit surface.
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
    const wRatio = (max - min) / this.radialBarcodeSize;

    const coords2 = coords.map((coord) => {
      const value = !isBackground ? coord[V] : this.max;
      let ringWidth;
      let radius;
      switch (this.config.sparkline.show?.chart_variant) {
        case 'sunburst':
        case 'sunburst_centered':
          ringWidth = ((this._logarithmic ? Math.log10(Math.max(1, value)) : value) - min) / wRatio;
          radius = radialGeometry.outerRadius - (this.radialBarcodeSize - ringWidth) / 2;
          break;
        case 'sunburst_outward':
          ringWidth = ((this._logarithmic ? Math.log10(Math.max(1, value)) : value) - min) / wRatio;
          radius = radialGeometry.outerRadius - this.radialBarcodeSize + ringWidth;
          break;
        case 'sunburst_inward':
          ringWidth = ((this._logarithmic ? Math.log10(Math.max(1, value)) : value) - min) / wRatio;
          radius = radialGeometry.outerRadius;
          break;
        default:
          ringWidth = this.radialBarcodeSize;
          radius = radialGeometry.outerRadius;
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
      radiusX.push(radialGeometry.outerRadius, radialGeometry.outerRadius - this.radialBarcodeSize);
      radiusY.push(radialGeometry.outerRadius, radialGeometry.outerRadius - this.radialBarcodeSize);
      return [newX, newY, value, 0, radiusX, radiusY, largeArcFlag, sweepFlag];
    });
    if (isBackground) {
      if (coords.length !== segments) {
        let ringWidth;
        let radius;
        const value = this.max;
        switch (this.config.sparkline.show?.chart_variant) {
          case 'sunburst':
          case 'sunburst_centered':
            ringWidth = ((this._logarithmic ? Math.log10(Math.max(1, value)) : value) - min) / wRatio;
            radius = radialGeometry.outerRadius - (this.radialBarcodeSize - ringWidth) / 2;
            break;
          case 'sunburst_outward':
            ringWidth = ((this._logarithmic ? Math.log10(Math.max(1, value)) : value) - min) / wRatio;
            radius = radialGeometry.outerRadius - this.radialBarcodeSize + ringWidth;
            break;
          case 'sunburst_inward':
            ringWidth = ((this._logarithmic ? Math.log10(Math.max(1, value)) : value) - min) / wRatio;
            radius = radialGeometry.outerRadius;
            break;
          default:
            ringWidth = this.radialBarcodeSize;
            radius = radialGeometry.outerRadius;
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
          radiusX.push(radialGeometry.outerRadius, radialGeometry.outerRadius - this.radialBarcodeSize);
          radiusY.push(radialGeometry.outerRadius, radialGeometry.outerRadius - this.radialBarcodeSize);
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

      if (['flower2', 'flower', 'rice_grain'].includes(this.config.sparkline.show?.chart_viz)) {
        // Petal visualizations use the segment chord as their arc radius.
        if (this.config.sparkline.show.chart_viz === 'flower' && this.config.sparkline.show.chart_variant === 'sunburst_inward') {
          rOuterX = segment.radius.x;
          rOuterY = segment.radius.y;
        } else {
          const difX1 = Math.abs(segment.start.x - segment.end.x);
          const difY1 = Math.abs(segment.start.y - segment.end.y);
          rOuterX = Math.sqrt(difX1 * difX1 + difY1 * difY1) / 2;
          rOuterY = rOuterX;
        }
        if (this.config.sparkline.show.chart_viz === 'flower' && this.config.sparkline.show.chart_variant === 'sunburst_outward') {
          rInnerX = segment.radius2.x;
          rInnerY = segment.radius2.y;
        } else {
          const difX2 = Math.abs(segment.start2.x - segment.end2.x);
          const difY2 = Math.abs(segment.start2.y - segment.end2.y);
          rInnerX = Math.sqrt(difX2 * difX2 + difY2 * difY2) / 2;
          rInnerY = rInnerX;
          sweepFlagTest = ['rice_grain', 'flower'].includes(this.config.sparkline.show.chart_viz) ? '1' : '0';
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

      if (['flower2', 'flower', 'rice_grain'].includes(this.config.sparkline.show?.chart_viz)) {
        // Petal visualizations use the segment chord as their arc radius.
        if (this.config.sparkline.show.chart_viz === 'flower' && this.config.sparkline.show.chart_variant === 'sunburst_inward') {
          rOuterX = segment.radius.x;
          rOuterY = segment.radius.y;
        } else {
          const difX1 = Math.abs(segment.start.x - segment.end.x);
          const difY1 = Math.abs(segment.start.y - segment.end.y);
          rOuterX = Math.sqrt(difX1 * difX1 + difY1 * difY1) / 2;
          rOuterY = rOuterX;
        }
        if (this.config.sparkline.show.chart_viz === 'flower' && this.config.sparkline.show.chart_variant === 'sunburst_outward') {
          rInnerX = segment.radius2.x;
          rInnerY = segment.radius2.y;
        } else {
          const difX2 = Math.abs(segment.start2.x - segment.end2.x);
          const difY2 = Math.abs(segment.start2.y - segment.end2.y);
          rInnerX = Math.sqrt(difX2 * difX2 + difY2 * difY2) / 2;
          rInnerY = rInnerX;
          sweepFlagTest = ['rice_grain', 'flower'].includes(this.config.sparkline.show.chart_viz) ? '1' : '0';
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

    switch (this.config.sparkline.show.chart_variant) {
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
   * Maps every graph value to its configured grade rank and returns the reached
   * traffic-light levels for each time bucket.
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
      x: xRatio * i * total + xRatio * position + this.drawArea.x, // Remove start spacing + spacing,
      y: coord[Y],
      height: bucketHeight,
      width: xRatio - columnSpacing,
      value: coord[V],
    }));
  }

  /**
   * Builds bars around the graph's zero baseline and divides each time bucket
   * horizontally when multiple entity series share the chart.
   *
   * @returns {Array<object>} Bar rectangle geometry.
   */
  getBars(position, total, columnSpacing = 4, rowSpacing = 4) {
    const coords = this._calcY(this.coords);
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
   * Aggregates bucket rows by arithmetic mean.
   *
   * @param {Array<object>} items - Bucket rows.
   * @returns {number} Mean state value.
   */
  _average(items) {
    return items.reduce((sum, entry) => sum + parseFloat(entry.state), 0) / items.length;
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
   * Returns the highest state value in a bucket.
   *
   * @param {Array<object>} items - Bucket rows.
   * @returns {number} Maximum state value.
   */
  _maximum(items) {
    return Math.max(...items.map((item) => item.state));
  }

  /**
   * Returns the lowest state value in a bucket.
   *
   * @param {Array<object>} items - Bucket rows.
   * @returns {number} Minimum state value.
   */
  _minimum(items) {
    return Math.min(...items.map((item) => item.state));
  }

  /**
   * Returns the first state value in a bucket.
   *
   * @param {Array<object>} items - Bucket rows.
   * @returns {number} First state value.
   */
  _first(items) {
    return parseFloat(items[0].state);
  }

  /**
   * Returns the last state value in a bucket.
   *
   * @param {Array<object>} items - Bucket rows.
   * @returns {number} Last state value.
   */
  _last(items) {
    return parseFloat(items[items.length - 1].state);
  }

  /**
   * Adds all state values in a bucket.
   *
   * @param {Array<object>} items - Bucket rows.
   * @returns {number} Sum of state values.
   */
  _sum(items) {
    return items.reduce((sum, entry) => sum + parseFloat(entry.state), 0);
  }

  /**
   * Calculates the numeric range between the highest and lowest bucket values.
   *
   * @param {Array<object>} items - Bucket rows.
   * @returns {number} Difference between maximum and minimum.
   */
  _delta(items) {
    return this._maximum(items) - this._minimum(items);
  }

  /**
   * Calculates the signed difference between the bucket's last and first values.
   *
   * @param {Array<object>} items - Bucket rows.
   * @returns {number} Signed difference.
   */
  _diff(items) {
    return this._last(items) - this._first(items);
  }

  /**
   * Returns the latest unaggregated state used to carry empty buckets forward.
   *
   * @param {Array<object>} items - Bucket rows.
   * @returns {number} Last state value.
   */
  _lastValue(items) {
    if (['delta', 'diff'].includes(this.aggregateFuncName)) {
      return 0;
    } else {
      return parseFloat(items[items.length - 1].state) || 0;
    }
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
   * Sets the period end used by reducers. Calendar history ends at its fixed
   * local boundary; rolling history ends at the exclusive boundary following
   * the current bucket.
   *
   * @returns {void}
   */
  _updateEndTime() {
    this._endTime = new Date();
    if (this.config.period.type === 'calendar') {
      if (this.config.period.calendar.period === 'day' && (this.config.period.calendar.offset !== 0 || this.config.period.calendar.full_day === true)) {
        // Historical days and shared day comparisons have a fixed local end.
        // The active day keeps its current-bin end unless a comparison needs
        // the complete 24-hour reference axis.
        const calendarStart = new Date(this._endTime);
        calendarStart.setHours(0, 0, 0, 0);
        calendarStart.setHours(calendarStart.getHours() + this.config.period.calendar.offset * 24 - (this.config.period.calendar.duration.hour - 24));
        this._endTime = new Date(calendarStart.getTime() + this.config.period.calendar.duration.hour * ONE_HOUR);
      } else if (this.config.period.calendar.period === 'day') {
        this._endTime = this._snapToBin(this._endTime);
        this._endTime = new Date(this._endTime.getTime() + (60 / this.points) * 60 * 1000);
      }
    } else if (this.config.period.type === 'rolling_window') {
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
