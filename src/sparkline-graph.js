import Colors from './colors';
import Utils from './utils';

export const X = 0;
export const Y = 1;
export const V = 2;
export const Y2 = 3;
export const RX = 4;
export const RY = 5;
// Margins
export const L = 0; // compatible with X
export const T = 1; // compatible with Y
export const R = 2;
export const B = 3;
export const ONE_HOUR = 1000 * 3600;

// export const clockWidth = 20;

export default class SparklineGraph {
  constructor(width, height, margin, config, gradeValues = [], gradeRanks = [], stateMap = {}) {
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

    // console.log('[SparklineGraph] constructor', width, height, margin, config, gradeValues, gradeRanks, stateMap);
    // Just trying to make sense for the graph drawing area
    //
    // @2023.07.02
    // What if there is a margin top/bottom and margin left/right. Then we would be able to create
    // anything that needs some offset for the actual drawing of the graph.
    // The only graph type that is relevant is the line/area graph.
    // - the area below the line goes to the bottom of the graph
    // - the line itself only upto the draw area of the graph, leaving space for the area fill
    // - See examples in Pinterest...
    //
    this.graphArea = {};
    this.graphArea.x = 0;
    this.graphArea.y = 0;
    this.graphArea.width = width - 2 * this.graphArea.x;
    this.graphArea.height = height - 2 * this.graphArea.y;

    this.drawArea = {};
    this.drawArea.x = margin.l;
    this.drawArea.y = margin.t;
    this.drawArea.top = margin.t;
    this.drawArea.bottom = margin.b;
    this.drawArea.width = width - (margin.l + margin.r);
    this.drawArea.height = height - (margin.t + margin.b);

    this._history = undefined;
    this.coords = [];
    this.bucketMeta = [];
    this.width = width;
    this.height = height;
    this.margin = margin;
    // Testing
    this._max = 0;
    this._min = 0;
    const period = this.config.period[this.config.period.type];
    this.points = period.bins.per_hour || 1;
    this.hours = period.duration.hour || 24;
    // this.points = this.config.period?.calendar?.bins?.per_hour || this.config.period?.rolling_window?.bins?.per_hour || 1;
    // this.hours = this.config.period?.calendar?.duration?.hour || this.config.period?.rolling_window?.duration?.hour || 24;
    this.aggregateFuncName = this.config.sparkline.state_values.aggregate_func;
    this._calcPoint = this.aggregateFuncMap[this.aggregateFuncName] || this._average;
    this._smoothing = this.config.sparkline.state_values?.smoothing;
    this._logarithmic = this.config.sparkline.state_values?.logarithmic;
    this._groupBy = this.config.period.groupBy;
    this._endTime = 0;
    this.valuesPerBucket = 0;
    this.levelCount = 1;
    this.gradeValues = gradeValues;
    this.gradeRanks = gradeRanks;
    this.stateMap = { ...stateMap };
    this.radialBarcodeSize = Utils.calculateSvgDimension(this.config.sparkline?.radial_barcode?.size || 5);
    // console.log('[SparklineGraph] constructor', this);
  }

  get max() {
    return this._max;
  }

  set max(max) {
    this._max = max;
  }

  get min() {
    return this._min;
  }

  set min(min) {
    this._min = min;
  }

  set history(data) {
    this._history = data;
  }

  update(history = undefined) {
    if (history) {
      this._history = history;
    }
    if (!this._history) return;
    if (this._history?.length === 0) return;

    // Update time stuff
    this._updateEndTime();
    let date = new Date();
    date.getDate();
    this.offsetHours = 0;
    if (this.config.period.type === 'calendar') {
      if (this.config.period?.calendar?.period === 'day') {
        // HACK to make sure any calculation uses the right amount of hours for today only!!
        // Does not work for shifting to yesterday I think
        let extraHours = this.config.period.calendar.duration.hour - 24;
        let hours = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600 + extraHours;
        this.offsetHours = Math.abs(this.config.period.calendar.offset * 24);
        console.log('[update]', hours, extraHours, this.offsetHours, this.hours);
      }
    }

    // console.log('[update] histGroups BEFORE reducer', history, this.hours, this.points, this.offsetHours);

    const histGroups = this._history.reduce((res, item) => this._reducer(res, item), []);
    // drop potential out of bound entry's except one
    if (histGroups[0] && histGroups[0].length) {
      histGroups[0] = [histGroups[0][histGroups[0].length - 1]];
    }
    // @2026.07.05
    // Wat nu? bij rolling_window en instelling bins.per_hour van 12 zie ik in de logging dat een bin 10 minuten is
    // dat moet dan dus 60 / 12 = 5 minuten zijn. zou dat oorzaak zijn dat grafiek rechte lijn toont? dus maar de helft
    // van de grafiek kan vullen omdat bins 2x zo groot zijn als de bedoeling???????????????
    //
    // Logging laat 24 6 0 zien. dus hours = 24. Klopt. points = 6. Huh? is dat die 10 minuten? offset = 0. Klopt.
    // Die 6 kun je toch nooit terugrekenen naar 5 minuten?
    // this.points moet dus bins.per_hour zijn. dus ook 12 in dit geval...
    // console.log('[update] histGroups AFTER reducer', histGroups, this.hours, this.points, this.offsetHours);

    // extend length to fill missing history.
    let requiredNumOfPoints;
    // for now it is ok...
    this.offsetHours = 0;
    switch (this.config.period.type) {
      case 'real_time':
        requiredNumOfPoints = 1;
        this.hours = 1;
        break;
      case 'calendar':
        if (this.config.period?.calendar?.period === 'day') {
          // If config says duration of 48 hours, then this.hours contains that config
          let hours = this.hours;
          if (this.config.period.calendar.offset === 0) {
            let extraHours = this.config.period.calendar.duration.hour - 24;
            hours = date.getHours() + date.getMinutes() / 60 + extraHours;
          } else {
            // this.offsetHours = Math.abs(this.config.period.calendar.offset * 24);
            this.offsetHours = Math.abs(this.config.period.calendar.offset * this.hours);
          }
          requiredNumOfPoints = Math.ceil(hours * this.points);
        }
        break;
      case 'rolling_window':
        requiredNumOfPoints = Math.ceil(this.hours * this.points);
        break;
      default:
        break;
    }

    histGroups.length = requiredNumOfPoints;

    try {
      this.coords = this._calcPoints(histGroups);
    } catch (error) {
      console.log('error in calcpoints');
    }
    this.min = Math.min(...this.coords.map((item) => Number(item[V])));
    this.max = Math.max(...this.coords.map((item) => Number(item[V])));

    const bucketMs = ONE_HOUR / this.points;
    const bucketStart = this._endTime.getTime() - this.hours * ONE_HOUR;
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

    // Check for line and area for minmax calculations
    if (['line', 'area'].includes(this.config.sparkline.show.chart_type) && (this.config.sparkline.line?.show_minmax === true || this.config.sparkline.area?.show_minmax === true)) {
      // Just testing...
      // https://stackoverflow.com/questions/43576241/using-reduce-to-find-min-and-max-values
      const histGroupsMinMax = this._history.reduce((res, item) => this._reducerMinMax(res, item), []);

      // drop potential out of bound entry's except one
      if (histGroupsMinMax[0][0] && histGroupsMinMax[0][0].length) {
        histGroupsMinMax[0][0] = [histGroupsMinMax[0][0][histGroupsMinMax[0][0].length - 1]];
      }
      if (histGroupsMinMax[1][0] && histGroupsMinMax[1][0].length) {
        histGroupsMinMax[1][0] = [histGroupsMinMax[1][0][histGroupsMinMax[1][0].length - 1]];
      }

      // extend length to fill missing history
      // const requiredNumOfPoints = Math.ceil(this.hours * this.points);
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

      // Adjust scale in this case...
      this.min = Math.min(...this.coordsMin.map((item) => Number(item[V])));
      this.max = Math.max(...this.coordsMax.map((item) => Number(item[V])));
    }
  }

  // This reducer calculates the min and max in a bucket. This is the REAL min and max
  // The other functions calculate the min and max from the function used (mostly avg)!!
  // This real min/max could be used to show the min/max graph on the background. Some filled
  // graph would be nice. That would mean we calculate each point (per bucket) and connect the
  // first point of the min/max array, and the last point of the min/max array.
  //
  // Array should be changed to [0][key], so we can pass the res[0] to some function to calculate
  // the resulting points. Must in that case also pass the function, ie max or min. Not the default
  // function, as that would give us (again) possible the avg...
  //
  // It could run with a single reducer, if using [0] for the buckets to calculate the function
  // and [1] for min, and [2] for max value in that bucket...

  _reducerMinMax(res, item) {
    const age = this._endTime - new Date(item.last_changed).getTime();
    // const endIndex = this.config.period.type === 'rolling_window' ? this.hours * this.points - 1 : this.hours * this.points;
    // const interval = (age / ONE_HOUR) * this.points - endIndex;
    const interval = (age / ONE_HOUR) * this.points - this.hours * this.points;

    const key = interval < 0 ? Math.floor(Math.abs(interval)) : 0;
    if (!res[0]) res[0] = [];
    if (!res[1]) res[1] = [];
    if (!res[0][key]) {
      res[0][key] = {};
      res[1][key] = {};
    }
    // Min value is always 0. So something goes wrong with Number I guess??
    // If item.state invalid, then returns 0 ???
    res[0][key].state = Math.min(res[0][key].state ? res[0][key].state : Number.POSITIVE_INFINITY, item.state);
    res[0][key].haState = Math.min(res[0][key].haState ? res[0][key].haState : Number.POSITIVE_INFINITY, item.haState);
    // Max seems to be OK!
    res[1][key].state = Math.max(res[1][key].state ? res[1][key].state : Number.NEGATIVE_INFINITY, item.state);
    res[1][key].haState = Math.max(res[1][key].haState ? res[1][key].haState : Number.NEGATIVE_INFINITY, item.haState);
    return res;
  }

  // #TODO @2023.07.26:
  // The reducer should not have to check for hours. This wasn't required some changes ago
  // Must be looked in to...

  // Finally working for calendar and rolling_window types

  _reducer(res, item) {
    const { type } = this.config.period;
    const period = this.config.period[type];

    let hours = this.hours;

    if (type === 'calendar' && period.period === 'day') {
      const now = new Date();
      const extraHours = period.duration.hour - 24;

      hours = period.offset === 0 ? now.getHours() + now.getMinutes() / 60 + extraHours : period.duration.hour;
    }

    let age = this._endTime - new Date(item.last_changed).getTime();

    if (period.offset === 0 && age < 0) {
      age = 0;
    }

    const endIndex = hours * this.points - 1;
    const interval = (age / ONE_HOUR) * this.points - endIndex;
    const key = interval < 0 ? Math.floor(Math.abs(interval)) : 0;

    if (!res[key]) res[key] = [];
    res[key].push(item);

    return res;
  }

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

    for (let i = 0; i < history.length; i += 1) getCoords(history[i], i);

    return coords;
  }

  _calcY(coords) {
    // account for logarithmic graph
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

  // Calculate y coordinate for level stuff
  // The calculated y coordinate is the TOP y coodinate of the rectangle to be displayed
  _calcLevelY(coord) {
    // account for logarithmic graph
    const max = this._logarithmic ? Math.log10(Math.max(1, this.max)) : this.max;
    const min = this._logarithmic ? Math.log10(Math.max(1, this.min)) : this.min;

    const yRatio = (max - min) / this.drawArea.height || 1;
    const offset = min < 0 ? Math.abs(min) : 0;
    let yStack = [];
    // should be reduce or something... to return an array...
    const coordYs = coord[V].forEach((val, index) => {
      const coordY = val >= 0 ? this.drawArea.height + this.drawArea.top * 1 - (1 * offset) / yRatio - (val - Math.max(0, min)) / yRatio : this.drawArea.height + this.drawArea.top * 1 - (0 - val) / yRatio;
      yStack.push(coordY);
      return yStack;
    });
    return yStack;
  }

  getPoints() {
    let { coords } = this;
    if (coords.length === 1) {
      coords[1] = [this.width + this.margin.x, 0, coords[0][V]];
    }
    coords = this._calcY(this.coords);
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

  getPath() {
    let { coords } = this;
    if (coords.length === 1) {
      coords[1] = [this.width + this.margin.x, 0, coords[0][V]];
    }
    coords = this._calcY(this.coords);
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

  getPathMin() {
    let { coordsMin } = this;
    if (coordsMin.length === 1) {
      coordsMin[1] = [this.width + this.margin.x, 0, coordsMin[0][V]];
    }
    coordsMin = this._calcY(this.coordsMin);
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

  // Get this in reverse...
  getPathMax() {
    let { coordsMax } = this;
    if (coordsMax.length === 1) {
      coordsMax[1] = [this.width + this.margin.x, 0, coordsMax[0][V]];
    }
    coordsMax = this._calcY(this.coordsMax);
    let next;
    let Z;
    let path = '';
    // let last = coordsMax[0];
    let last = coordsMax[coordsMax.length - 1];
    // path += `M${last[X]},${last[Y]}`;

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

  computeGradient(thresholds, logarithmic) {
    const scale = logarithmic ? Math.log10(Math.max(1, this._max)) - Math.log10(Math.max(1, this._min)) : this._max - this._min;
    // Must account for bottom margin. How????
    // Percentage of bottom is
    const scaleOffset = (scale / (this.graphArea.height - this.margin.b)) * this.graphArea.height - scale;
    return thresholds.map((stop, index, arr) => {
      let color;
      if (stop.value > this._max && arr[index + 1]) {
        const factor = (this._max - arr[index + 1].value) / (stop.value - arr[index + 1].value);
        // color = interpolateColor(arr[index + 1].color, stop.color, factor);
        color = Colors.getGradientValue(arr[index + 1].color, stop.color, factor);
      } else if (stop.value < this._min && arr[index - 1]) {
        const factor = (arr[index - 1].value - this._min) / (arr[index - 1].value - stop.value);
        color = Colors.getGradientValue(arr[index - 1].color, stop.color, factor);
        // color = interpolateColor(arr[index - 1].color, stop.color, factor);
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

  // #TODO. Is not right...
  // Weird stuff...
  getAreaMinMax(pathMin, pathMax) {
    let fill = pathMin;
    fill += ` L ${this.coordsMax[this.coordsMax.length - 1][X]},
                ${this.coordsMax[this.coordsMax.length - 1][Y]}`;
    fill += pathMax;
    fill += ' z';
    return fill;
  }

  getArea(path) {
    const y_zero = this._min >= 0 ? this.height : this.height + 0 - (Math.abs(this._min) / (this._max - this._min)) * this.height;
    const height = y_zero + this.drawArea.y * 1.5; // Should be this.svg.line_width;
    let fill = path;
    // fill += ` L ${this.drawArea.width + this.drawArea.x}, ${height}`;
    // fill += ` L ${this.coords[0][X]}, ${height} z`;
    fill += ` L ${this.coords[this.coords.length - 1][X] + this.drawArea.x}, ${height}`;
    fill += ` L ${this.coords[0][X]}, ${height} z`;
    return fill;
  }

  polarToCartesian(centerX, centerY, radiusX, radiusY, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: centerX + radiusX * Math.cos(angleInRadians),
      y: centerY + radiusY * Math.sin(angleInRadians),
    };
  }

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

  _calcRadialBarcode(coords, isBackground = false, columnSpacing = 4, rowSpacing = 4) {
    const max = this._logarithmic ? Math.log10(Math.max(1, this.max)) : this.max;
    const min = this._logarithmic ? Math.log10(Math.max(1, this.min)) : this.min;
    const segments = this.hours * this.points;
    const angleSize = 360 / segments;
    const startAngle = 0;
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
          radius = (this.drawArea.width - this.radialBarcodeSize + ringWidth) / 2;
          break;
        case 'sunburst_outward':
          ringWidth = ((this._logarithmic ? Math.log10(Math.max(1, value)) : value) - min) / wRatio;
          radius = this.drawArea.width / 2 - this.radialBarcodeSize + ringWidth;
          break;
        case 'sunburst_inward':
          ringWidth = ((this._logarithmic ? Math.log10(Math.max(1, value)) : value) - min) / wRatio;
          radius = this.drawArea.width / 2;
          break;
        default:
          ringWidth = this.radialBarcodeSize;
          radius = this.drawArea.width / 2;
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
      radiusX.push(this.drawArea.width / 2, this.drawArea.width / 2 - this.radialBarcodeSize);
      radiusY.push(this.drawArea.height / 2, this.drawArea.height / 2 - this.radialBarcodeSize);
      // return [newX, newY, coord[V], 0, radiusX, radiusY, largeArcFlag, sweepFlag];
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
            radius = (this.drawArea.width - this.radialBarcodeSize + ringWidth) / 2;
            break;
          case 'sunburst_outward':
            ringWidth = ((this._logarithmic ? Math.log10(Math.max(1, value)) : value) - min) / wRatio;
            radius = this.drawArea.width / 2 - this.radialBarcodeSize + ringWidth;
            break;
          case 'sunburst_inward':
            ringWidth = ((this._logarithmic ? Math.log10(Math.max(1, value)) : value) - min) / wRatio;
            radius = this.drawArea.width / 2;
            break;
          default:
            ringWidth = this.radialBarcodeSize;
            radius = this.drawArea.width / 2;
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
          radiusX.push(this.drawArea.width / 2, this.drawArea.width / 2 - this.radialBarcodeSize);
          radiusY.push(this.drawArea.height / 2, this.drawArea.height / 2 - this.radialBarcodeSize);
          coords2.push([newX, newY, value, 0, radiusX, radiusY, largeArcFlag, sweepFlag]);
        }
      }
    }
    return coords2;
  }

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

  getRadialBarcodeBackgroundPaths() {
    const radialBarcodeBackgroundPaths = this.radialBarcodeBackground.map((segment, index) => {
      let rOuterX;
      let rOuterY;
      let rInnerX;
      let rInnerY;
      let sweepFlagTest = '0';

      if (['flower2', 'flower', 'rice_grain'].includes(this.config.sparkline.show?.chart_viz)) {
        // Outer part. For flower this depends on the inward/outward setting
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

  getRadialBarcodePaths() {
    const radialBarcodePaths = this.radialBarcode.map((segment, index) => {
      let rOuterX;
      let rOuterY;
      let rInnerX;
      let rInnerY;
      let sweepFlagTest = '0';

      if (['flower2', 'flower', 'rice_grain'].includes(this.config.sparkline.show?.chart_viz)) {
        // Outer part. For flower2 this depends on the inward/outward setting
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

  getBarcode(position, total, columnSpacing = 4, rowSpacing = 4) {
    const max = this._logarithmic ? Math.log10(Math.max(1, this.max)) : this.max;
    const min = this._logarithmic ? Math.log10(Math.max(1, this.min)) : this.min;

    const coords = this.coords;
    const xRatio = (this.drawArea.width + columnSpacing) / Math.ceil(this.hours * this.points) / total;
    const yRatio = (max - min) / this.drawArea.height || 1;

    switch (this.config.sparkline.show.chart_variant) {
      case 'audio':
        return coords.map((coord, i) => ({
          x: xRatio * i * total + xRatio * position + this.drawArea.x,
          y: this.drawArea.height / 2 - ((this._logarithmic ? Math.log10(Math.max(1, coord[V])) : coord[V]) - min) / yRatio / 2,
          height: ((this._logarithmic ? Math.log10(Math.max(1, coord[V])) : coord[V]) - min) / yRatio,
          width: xRatio - columnSpacing / 2,
          value: coord[V],
        }));
        break;
      case 'stalactites':
        return coords.map((coord, i) => ({
          x: xRatio * i * total + xRatio * position + this.drawArea.x,
          y: 0,
          height: ((this._logarithmic ? Math.log10(Math.max(1, coord[V])) : coord[V]) - min) / yRatio,
          width: xRatio - columnSpacing / 2,
          value: coord[V],
        }));
        break;
      case 'stalagmites':
        return coords.map((coord, i) => ({
          x: xRatio * i * total + xRatio * position + this.drawArea.x,
          y: this.drawArea.height / 1 - ((this._logarithmic ? Math.log10(Math.max(1, coord[V])) : coord[V]) - min) / yRatio,
          height: ((this._logarithmic ? Math.log10(Math.max(1, coord[V])) : coord[V]) - min) / yRatio,
          width: xRatio - columnSpacing / 2,
          value: coord[V],
        }));
        break;
      default:
        return coords.map((coord, i) => ({
          x: xRatio * i * total + xRatio * position + this.drawArea.x,
          y: 0,
          height: this.drawArea.height,
          width: xRatio - columnSpacing / 2,
          value: coord[V],
        }));
        break;
    }
  }

  // Get array of levels. Just levels which draw a little bar at each level once reached
  getEqualizer(position, total, columnSpacing = 4, rowSpacing = 4) {
    const xRatio = (this.drawArea.width + columnSpacing) / Math.ceil(this.hours * this.points) / total;
    const yRatio = (this._max - this._min) / this.drawArea.height || 1;
    const offset = this._min < 0 ? Math.abs(this._min) / yRatio : 0;

    // Calculate height of each level rectangle
    // we have drawarea.height. We have steprange and spacing.
    // height / steprange = max height rectangle. Minus spacing = height??
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
      // Check for buckets, and ranges min/max...
      // i is the bucket index!
      let matchStep = -1;
      let matchBucket = 0;
      let match = false;
      // #TODO
      // Both loops can be in one loop, using else if not (yet) in bucket. There MUST be a bucket
      // Is the assumption... Or leave it this way, and assume there might be NO bucket...
      for (let i = 0; i < stepRange; i++) {
        // In which bucket...
        // Find matching bucket. Can be any of them defined
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
        //        if (i <= matchStep) newCoord[V][i] = this.gradeRanks[i].length > matchBucket ? this.gradeRanks[i].rangeMin[matchBucket] : this.gradeRanks[i].rangeMin[0];
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

  getBars(position, total, columnSpacing = 4, rowSpacing = 4) {
    const coords = this._calcY(this.coords);
    const xRatio = (this.drawArea.width + columnSpacing) / Math.ceil(this.hours * this.points) / total;
    const yRatio = (this._max - this._min) / this.drawArea.height || 1;
    const offset = this._min < 0 ? Math.abs(this._min) / yRatio : 0;

    return coords.map((coord, i) => ({
      x: xRatio * i * total + xRatio * position + this.drawArea.x, // Remove start spacing + spacing,
      y: this._min > 0 ? coord[Y] : coord[Y2],
      height: coord[V] > 0 ? (this._min < 0 ? coord[V] / yRatio : (coord[V] - this._min) / yRatio) : coord[Y] - coord[Y2],
      width: xRatio - columnSpacing,
      value: coord[V],
    }));
  }

  _midPoint(Ax, Ay, Bx, By) {
    const Zx = (Ax - Bx) / 2 + Bx;
    const Zy = (Ay - By) / 2 + By;
    return [Zx, Zy];
  }

  _average(items) {
    return items.reduce((sum, entry) => sum + parseFloat(entry.state), 0) / items.length;
  }

  _median(items) {
    //    const itemsDup = [...items].sort((a, b) => parseFloat(a) - parseFloat(b));
    const itemsDup = [...items].sort((a, b) => parseFloat(a.state) - parseFloat(b.state));
    const mid = Math.floor((itemsDup.length - 1) / 2);
    if (itemsDup.length % 2 === 1) return parseFloat(itemsDup[mid].state);
    return (parseFloat(itemsDup[mid].state) + parseFloat(itemsDup[mid + 1].state)) / 2;
  }

  _maximum(items) {
    return Math.max(...items.map((item) => item.state));
  }

  _minimum(items) {
    return Math.min(...items.map((item) => item.state));
  }

  _first(items) {
    return parseFloat(items[0].state);
  }

  _last(items) {
    return parseFloat(items[items.length - 1].state);
  }

  _sum(items) {
    return items.reduce((sum, entry) => sum + parseFloat(entry.state), 0);
  }

  _delta(items) {
    return this._maximum(items) - this._minimum(items);
  }

  _diff(items) {
    return this._last(items) - this._first(items);
  }

  _lastValue(items) {
    if (['delta', 'diff'].includes(this.aggregateFuncName)) {
      return 0;
    } else {
      return parseFloat(items[items.length - 1].state) || 0;
    }
  }

  _snapToBin(date) {
    const binMinutes = 60 / this.points;
    const binMs = binMinutes * 60 * 1000;
    return new Date(Math.floor(date.getTime() / binMs) * binMs);
  }

  _updateEndTime() {
    this._endTime = new Date();
    if (this.config.period.type === 'calendar') {
      if (this.config.period.calendar.period === 'day' && this.config.period.calendar.offset !== 0) {
        // #TODO:
        // Should account for hours_to_show. Maybe user wants to show the past 48 hours.
        // Now I assume it is just yesterday, ie hours_to_show === 24
        // this._endTime.setHours(0, 0, 0, 0);
        // this.hours = 24;
        // console.log('[_updateEndTime] for period.type = calendar BEFORE', this._endTime);

        this._endTime.setHours(-this.config.period.calendar.duration.hour);
        this._endTime.setHours(0, 0, 0, 0);
        // console.log('[_updateEndTime] for period.type = calendar AFTER', this._endTime);
      }
    } else if (this.config.period.type === 'rolling_window') {
      // keep the real current time for rolling windows
      // console.log('[_updateEndTime] for period.type = rolling_window BEFORE', this._endTime);
      this._endTime = this._snapToBin(this._endTime);
      // console.log('[_updateEndTime] for period.type = rolling_window AFTER', this._endTime);
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
