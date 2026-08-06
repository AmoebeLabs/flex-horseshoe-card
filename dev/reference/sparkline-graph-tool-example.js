/* eslint-disable no-useless-concat */
/* eslint-disable @stylistic/implicit-arrow-linebreak */
/* eslint-disable @stylistic/no-confusing-arrow */
import { svg } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

import Merge from './merge';
import BaseTool from './base-tool';
import Utils from './utils';
import SparklineGraph, { X, Y, V } from './sparkline-graph';
import Colors from './colors';

const getTime = (date, extra, locale = 'en-US') => date.toLocaleString(locale, { hour: 'numeric', minute: 'numeric', ...extra });
const getMilli = (hours) => hours * 60 ** 2 * 10 ** 3;
const getFirstDefinedItem = (...collection) => collection.find((item) => typeof item !== 'undefined');
const DEFAULT_COLORS = ['var(--theme-sys-color-primary)', '#3498db', '#e74c3c', '#9b59b6', '#f1c40f', '#2ecc71', '#1abc9c', '#34495e', '#e67e22', '#7f8c8d', '#27ae60', '#2980b9', '#8e44ad'];

/**
 * Starting from the given index, increment the index until an array element with a
 * "value" property is found
 *
 * @param {Array} stops
 * @param {number} startIndex
 * @returns {number}
 */
const findFirstValuedIndex = (stops, startIndex) => {
  for (let i = startIndex, l = stops.length; i < l; i += 1) {
    if (stops[i].value != null) {
      return i;
    }
  }
  throw new Error('Error in threshold interpolation: could not find right-nearest valued stop. ' + 'Do the first and last thresholds have a set "value"?');
};

/**
 * Interpolates the "value" of each stop. Each stop can be a color string or an object of type
 * ```
 * {
 *   color: string
 *   value?: number | null
 * }
 * ```
 * And the values will be interpolated by the nearest valued stops.
 *
 * For example, given values `[ 0, null, null, 4, null, 3]`,
 * the interpolation will output `[ 0, 1.3333, 2.6667, 4, 3.5, 3 ]`
 *
 * Note that values will be interpolated ascending and descending.
 * All that's necessary is that the first and the last elements have values.
 *
 * @param {Array} stops
 * @returns {Array<{ color: string, value: number }>}
 */
const interpolateStops = (stops) => {
  if (!stops || !stops.length) {
    return stops;
  }
  if (stops[0].value == null || stops[stops.length - 1].value == null) {
    throw new Error('The first and last thresholds must have a set "value".\n See xyz manual');
  }

  let leftValuedIndex = 0;
  let rightValuedIndex = null;

  return stops.map((stop, stopIndex) => {
    if (stop.value != null) {
      leftValuedIndex = stopIndex;
      return { ...stop };
    }

    if (rightValuedIndex == null) {
      rightValuedIndex = findFirstValuedIndex(stops, stopIndex);
    } else if (stopIndex > rightValuedIndex) {
      leftValuedIndex = rightValuedIndex;
      rightValuedIndex = findFirstValuedIndex(stops, stopIndex);
    }

    // y = mx + b
    // m = dY/dX
    // x = index in question
    // b = left value

    const leftValue = stops[leftValuedIndex].value;
    const rightValue = stops[rightValuedIndex].value;
    const m = (rightValue - leftValue) / (rightValuedIndex - leftValuedIndex);
    return {
      color: typeof stop === 'string' ? stop : stop.color,
      //      value: m * stopIndex + leftValue,
      value: leftValue + m * (stopIndex - leftValuedIndex),
    };
  });
};

const computeThresholds = (stops, type) => {
  const valuedStops = interpolateStops(stops);
  try {
    valuedStops.sort((a, b) => b.value - a.value);
  } catch (error) {
    console.log('computeThresholds, error', error, valuedStops);
  }

  if (type === 'smooth') {
    return valuedStops;
  } else {
    const rect = [].concat(
      ...valuedStops.map((stop, i) => [
        stop,
        {
          value: stop.value - 0.0001,
          color: valuedStops[i + 1] ? valuedStops[i + 1].color : stop.color,
        },
      ]),
    );
    return rect;
  }
};

/** ****************************************************************************
 * SparklineBarChartTool class
 *
 * Summary.
 *
 */
export default class SparklineGraphTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_GRAPH_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        height: 25,
        width: 25,
        margin: 0,
      },
      period: {
        type: 'unknown',
        real_time: false,
        group_by: 'interval',
      },
      sparkline: {
        state_values: {
          logarithmic: false,
          value_factor: 0,
          aggregate_func: 'avg',
          smoothing: true,
        },
        equalizer: {
          value_buckets: 10,
          square: false,
        },
        graded: {
          square: false,
        },
        animate: true,
        hour24: false,
        font_size: 10,
        line_color: [...DEFAULT_COLORS],
        colorstops: {
          colors: [],
        },
        colorstops_transition: 'smooth',
        state_map: {
          map: [],
        },
        cache: true,
        color: 'var(--primary-color)',
        radial_barcode: {
          size: 5,
          line_width: 0,
          face: {
            hour_marks_count: 24,
          },
        },
        classes: {
          tool: {
            'sak-sparkline': true,
            hover: true,
          },
          bar: {},
          line: {
            'sak-sparkline__line': true,
            hover: true,
          },
          graded_background: {},
          graded_foreground: {},
          radial_barcode_background: {
            'sak-sparkline__radial_barcode__background': true,
          },
          radial_barcode_face_day_night: {
            'sak-sparkline__radial_barcode-face_day-night': true,
          },
          radial_barcode_face_hour_marks: {
            'sak-sparkline__radial_barcode-face_hour-marks': true,
          },
          radial_barcode_face_hour_numbers: {
            'sak-sparkline__radial_barcode-face_hour-numbers': true,
          },
        },
        styles: {
          tool: {},
          line: {},
          bar: {},
          graded_background: {},
          graded_foreground: {},
          radial_barcode_background: {},
          radial_barcode_face_day_night: {},
          radial_barcode_face_hour_marks: {},
          radial_barcode_face_hour_numbers: {},
          area_mask_above: {
            fill: 'url(#sak-sparkline-area-mask-tb-1)',
          },
          area_mask_below: {
            fill: 'url(#sak-sparkline-area-mask-bt-1)',
          },
          bar_mask_above: {
            fill: 'url(#sak-sparkline-bar-mask-tb-80)',
          },
          bar_mask_below: {
            fill: 'url(#sak-sparkline-bar-mask-bt-80)',
          },
        },
        show: { style: 'fixedcolor' },
      },
    };

    const DEFAULT_CALENDER_CONFIG = {
      calendar: {
        period: 'day',
        offset: 0,
        duration: {
          hour: 24,
        },
        bins: {
          per_hour: 1,
        },
      },
    };

    const DEFAULT_ROLLING_WINDOW_CONFIG = {
      rolling_window: {
        duration: {
          hour: 24,
        },
        bins: {
          per_hour: 1,
        },
      },
    };

    const DEFAULT_REAL_TIME_CONFIG = {
      period: {
        real_time: true,
      },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_GRAPH_CONFIG, argConfig), argPos);

    if (this.config.period.real_time) {
      this.config.period.type = 'real_time';
    } else if (this.config.period?.calendar) {
      this.config.period.type = 'calendar';
      this.config.period = Merge.mergeDeep(DEFAULT_CALENDER_CONFIG, this.config.period);
    } else if (this.config.period?.rolling_window) {
      this.config.period.type = 'rolling_window';
      this.config.period = Merge.mergeDeep(DEFAULT_ROLLING_WINDOW_CONFIG, this.config.period);
    }

    this.svg.margin = {};
    if (typeof this.config.position.margin === 'object') {
      this.svg.margin.t = Utils.calculateSvgDimension(this.config.position.margin?.t) || Utils.calculateSvgDimension(this.config.position.margin?.y) || 0;
      this.svg.margin.b = Utils.calculateSvgDimension(this.config.position.margin?.b) || Utils.calculateSvgDimension(this.config.position.margin?.y) || 0;
      this.svg.margin.r = Utils.calculateSvgDimension(this.config.position.margin?.r) || Utils.calculateSvgDimension(this.config.position.margin?.x) || 0;
      this.svg.margin.l = Utils.calculateSvgDimension(this.config.position.margin?.l) || Utils.calculateSvgDimension(this.config.position.margin?.x) || 0;
      this.svg.margin.x = this.svg.margin.l;
      this.svg.margin.y = this.svg.margin.t;
    } else {
      this.svg.margin.x = Utils.calculateSvgDimension(this.config.position.margin);
      this.svg.margin.y = this.svg.margin.x;
      this.svg.margin.t = this.svg.margin.x;
      this.svg.margin.r = this.svg.margin.x;
      this.svg.margin.b = this.svg.margin.x;
      this.svg.margin.l = this.svg.margin.x;
    }

    // Clock face stuff
    this.svg.clockface = {};
    if (this.config.sparkline?.radial_barcode?.face) {
      if (this.config.sparkline.radial_barcode.face?.show_day_night === true) this.svg.clockface.dayNightRadius = Utils.calculateSvgDimension(this.config.sparkline.radial_barcode.face.day_night_radius);
      if (this.config.sparkline.radial_barcode.face?.show_hour_marks === true) this.svg.clockface.hourMarksRadius = Utils.calculateSvgDimension(this.config.sparkline.radial_barcode.face.hour_marks_radius);
      if (['absolute', 'relative'].includes(this.config.sparkline.radial_barcode.face?.show_hour_numbers))
        this.svg.clockface.hourNumbersRadius = Utils.calculateSvgDimension(this.config.sparkline.radial_barcode.face.hour_numbers_radius);
    }
    this._data = [];
    this._bars = [];
    this._scale = {};
    this._needsRendering = false;

    this.classes.tool = {};
    this.classes.bar = {};
    this.classes.radial_barcode_face_day_night = {};
    this.classes.radial_barcode_face_hour_marks = {};
    this.classes.radial_barcode_face_hour_numbers = {};

    this.classes.barcode = {};
    this.classes.barcode_graph = {};
    this.styles.barcode = {};
    this.styles.barcode_graph = {};

    this.classes.traffic_light = {};
    this.classes.graded_background = {};
    this.styles.graded_background = {};

    this.classes.graded_foreground = {};
    this.styles.graded_foreground = {};

    this.classes.equalizer_part = {};
    this.styles.equalizer_part = {};

    this.classes.radial_barcode = {};
    this.classes.radial_barcode_background = {};
    this.classes.radial_barcode_graph = {};
    this.styles.radial_barcode = {};
    this.styles.radial_barcode_background = {};
    this.styles.radial_barcode_graph = {};

    // Helper lines stuff
    this.classes.helper_line1 = {};
    this.classes.helper_line2 = {};
    this.classes.helper_line3 = {};

    this.styles.helper_line1 = {};
    this.styles.helper_line2 = {};
    this.styles.helper_line3 = {};

    this.styles.tool = {};
    this.styles.bar = {};
    this.styles.line = {};
    this.styles.radial_barcode_face_day_night = {};
    this.styles.radial_barcode_face_hour_marks = {};
    this.styles.radial_barcode_face_hour_numbers = {};
    this.stylesBar = {};

    this.seriesIndex = 0;

    this.id = this.toolId;
    // From MGC
    this.bound = [0, 0];
    this.boundSecondary = [0, 0];
    this.length = [];
    this.entity = [];
    this.line = [];
    this.lineMin = [];
    this.lineMax = [];
    this.bar = [];
    this.equalizer = [];
    this.graded = [];
    this.abs = [];
    this.area = [];
    this.areaMinMax = [];
    this.points = [];
    this.gradient = [];
    this.tooltip = {};
    this.updateQueue = [];
    this.updating = false;
    this.stateChanged = false;
    this.initial = true;
    this._md5Config = undefined;
    this.radialBarcodeChart = [];
    this.radialBarcodeChartBackground = [];
    this.barcodeChart = [];

    // Use full widt/height for config
    this.config.width = this.svg.width;
    this.config.height = this.svg.height;

    this.svg.line_width = Utils.calculateSvgDimension(this.config.sparkline[this.config.sparkline.show.chart_type]?.line_width || this.config.line_width || 0);
    this.svg.column_spacing = Utils.calculateSvgDimension(this.config.sparkline[this.config.sparkline.show.chart_type]?.column_spacing || this.config.bar_spacing || 1);
    this.svg.row_spacing = Utils.calculateSvgDimension(this.config.sparkline[this.config.sparkline.show.chart_type]?.row_spacing || this.config.bar_spacing || 1);

    this.gradeValues = [];
    this.config.sparkline.colorstops.colors.map((value, index) => (this.gradeValues[index] = value.value));

    this.stops = Merge.mergeDeep(...this.config.sparkline.colorstops.colors);
    this.gradeRanks = [];
    this.config.sparkline.colorstops.colors.map((value, index) => {
      let rankIndex;
      rankIndex = this.config.sparkline.show?.chart_variant === 'rank_order' && value.rank !== undefined ? value.rank : index;
      if (!this.gradeRanks[rankIndex]) {
        this.gradeRanks[rankIndex] = {};
        this.gradeRanks[rankIndex].value = [];
        this.gradeRanks[rankIndex].rangeMin = [];
        this.gradeRanks[rankIndex].rangeMax = [];
      }
      this.gradeRanks[rankIndex].rank = rankIndex;
      this.gradeRanks[rankIndex].color = value.color;
      // Assume right order from low to high and that next index is upper range
      //
      let rangeMin = value.value;
      let rangeMax = this.config.sparkline.colorstops.colors[index + 1]?.value || Infinity;
      this.gradeRanks[rankIndex].value.push(value.value);
      this.gradeRanks[rankIndex].rangeMin.push(rangeMin);
      this.gradeRanks[rankIndex].rangeMax.push(rangeMax);
      return true;
    });

    this.config.sparkline.colorstops.colors = computeThresholds(this.config.sparkline.colorstops.colors, this.config.sparkline.colorstops_transition);

    this.radialBarcodeChartWidth = Utils.calculateSvgDimension(this.config?.sparkline?.radial_barcode?.size || 5);
    // Graph settings
    this.svg.graph = {};
    this.svg.graph.height = this.svg.height - this.svg.margin.y * 0;
    this.svg.graph.width = this.svg.width - this.svg.margin.x * 0;

    this.config.sparkline.state_map.map.forEach((state, i) => {
      // convert string values to objects
      if (typeof state === 'string') this.config.sparkline.state_map.map[i] = { value: state, label: state };
      // make sure label is set
      this.config.sparkline.state_map.map[i].label = this.config.sparkline.state_map.map[i].label || this.config.sparkline.state_map.map[i].value;
    });

    // Other lines test
    this.xLines = {};
    this.xLines.lines = [];
    if (typeof this.config.sparkline.x_lines?.lines === 'object') {
      let j = 0;
      let helpers = this.config.sparkline.x_lines.lines;
      helpers.forEach((helperLine) => {
        this.xLines.lines[j] = {
          id: helperLine.name,
          zpos: helperLine?.zpos || 'above',
          yshift: Utils.calculateSvgDimension(helperLine?.yshift) || 0,
        };
        j += 1;
      });
    }
    if (typeof this.config.sparkline.x_lines?.numbers === 'object') {
      this.xLines.numbers = { ...this.config.sparkline.x_lines.numbers };
    }

    let { config } = this;

    // #TODO:
    // Should be enabled again, but watch for changes!!!!!!!!!!!!!!!
    //
    // override points per hour to match group_by function
    // switch (this.config.period.group_by) {
    //   case 'week':
    //     this.config.period.bins_per_hour = 1 / (24 * 7);
    //     break;
    //   case 'date':
    //     this.config.period.bins_per_hour = 1 / 24;
    //     break;
    //   case 'hour':
    //     this.config.period.bins_per_hour = 1;
    //     break;
    //   case 'quarterhour':
    //     this.config.period.bins_per_hour = 4;
    //     break;
    //   default:
    //     break;
    // }
    // From MGC
    // if (this.config.points_per_hour)
    //   this.config.period.bins_per_hour = this.config.points_per_hour;
    this.config.sparkline.state_values.smoothing = getFirstDefinedItem(
      this.config.sparkline.state_values.smoothing,
      !this._card.config.entities[this.defaultEntityIndex()].entity.startsWith('binary_sensor.'),
      // !entity.entity.startsWith('binary_sensor.'), // turn off for binary sensor by default
    );

    this.Graph = [];
    this.Graph[0] = new SparklineGraph(this.svg.graph.width, this.svg.graph.height, this.svg.margin, this.config, this.gradeValues, this.gradeRanks, this.config.sparkline.state_map);
    this._firstDataReceived = false;
  }

  set value(state) {
    if (this._stateValue === state) return false;

    const changed = (super.value = state);

    // Push realtime data into the history graph if type = 'real_time'...
    // Maybe in future: history is fetched once, and then real time updates add
    // data to the existing history graph, and deletes old data points...
    if (this.config.period.type === 'real_time') {
      let histState = state;
      const stateHistory = [{ state: histState }];
      this.series = stateHistory;
    }
    return changed;
  }

  /** *****************************************************************************
   * SparklineBarChartTool::set series
   *
   * Summary.
   * Sets the timeseries for the barchart tool. Is an array of states.
   * If this is historical data, the caller has taken the time to create this.
   * This tool only displays the result...
   *
   */
  set data(states) {
    // Bit of an hack.
    // Use set data to set the index of the this.Graph[], ie which entity
    // is updating. This is the real entity_index...
    // this.seriesIndex = states;
  }

  set series(states) {
    if (this.dev && this.dev.fakeData) {
      // How to fake the data...
      let y = 40;
      let z = 40;
      for (let i = 0; i < states.length; i++) {
        if (i < states.length / 2) z -= 4 * i;
        if (i > states.length / 2) z += 3 * i;
        states[i].state = z;
      }
    }
    if (this._card.config.entities[0].fixed_value === true) {
      const last = states[states.length - 1];
      states = [last, last];
    }
    // HACK...
    this.seriesIndex = 0;
    this.Graph[this.seriesIndex].update(states);
    // this.Graph[0].update(states);

    this.updateBounds();

    let { config } = this;
    if (config.sparkline.show.chart_type) {
      let graphPos = 0;
      let entity = this._card.config.entities[this.defaultEntityIndex()];
      const i = 0;
      // this._card.entities.forEach((entity, i) => {
      // this.entity.forEach((entity, i) => {
      if (!entity || this.Graph[i].coords.length === 0) return;
      const bound = this._card.config.entities[i].states === 'secondary' ? this.boundSecondary : this.bound;
      [this.Graph[i].min, this.Graph[i].max] = [bound[0], bound[1]];

      // Process each type of graph, including its options...
      const numVisible = this.visibleEntities.length;

      // +++++ Check for 'bar' graph type
      if (config.sparkline.show.chart_type === 'bar') {
        this.bar[i] = this.Graph[i].getBars(graphPos, numVisible, this.svg.column_spacing); // config.bar_spacing);
        graphPos += 1;
        // Add the next 4 lines as a hack
        if (config.sparkline.colorstops.colors.length > 0 && !this._card.config.entities[i].color)
          this.gradient[i] = this.Graph[i].computeGradient(config.sparkline.colorstops.colors, this.config.sparkline.state_values.logarithmic);
        // +++++ Check for 'area' or 'line' graph type
      } else if (['area', 'line'].includes(config.sparkline.show.chart_type)) {
        const line = this.Graph[i].getPath();
        if (this._card.config.entities[i].show_line !== false) this.line[i] = line;
      }

      // +++++ Check for 'area' graph type
      if (config.sparkline.show.chart_type === 'area') {
        this.area[i] = this.Graph[i].getArea(this.line[i]);
      }

      // +++++ Line might have set the minmax flag...
      if (config.sparkline?.line?.show_minmax || config.sparkline?.area?.show_minmax) {
        const lineMin = this.Graph[i].getPathMin();
        const lineMax = this.Graph[i].getPathMax();
        this.lineMin[i] = lineMin;
        this.lineMax[i] = lineMax;
        this.areaMinMax[i] = this.Graph[i].getAreaMinMax(lineMin, lineMax);
      }

      // +++++ Check for 'dots' graph type or if dots are enabled for area or line graph
      if (config.sparkline.show.chart_type === 'dots' || config.sparkline?.area?.show_dots === true || config.sparkline?.line?.show_dots === true) {
        this.points[i] = this.Graph[i].getPoints();

        // +++++ Check for 'equalizer' graph type
      } else if (this.config.sparkline.show.chart_type === 'equalizer') {
        this.Graph[i].levelCount = this.config.sparkline.equalizer.value_buckets;
        this.Graph[i].valuesPerBucket = (this.Graph[i].max - this.Graph[i].min) / this.config.sparkline.equalizer.value_buckets;
        this.equalizer[i] = this.Graph[i].getEqualizer(0, this.visibleEntities.length, this.svg.column_spacing, this.svg.row_spacing);

        // +++++ Check for 'graded' graph type
      } else if (this.config.sparkline.show.chart_type === 'graded') {
        this.Graph[i].levelCount = this.config.sparkline.equalizer.value_buckets;
        this.Graph[i].valuesPerBucket = (this.Graph[i].max - this.Graph[i].min) / this.config.sparkline.equalizer.value_buckets;
        this.graded[i] = this.Graph[i].getGrades(0, this.visibleEntities.length, this.svg.column_spacing, this.svg.row_spacing);

        // +++++ Check for 'radial_barcode' graph type
      } else if (this.config.sparkline.show.chart_type === 'radial_barcode') {
        this.radialBarcodeChartBackground[i] = this.Graph[i].getRadialBarcodeBackground(0, this.visibleEntities.length, this.svg.column_spacing, this.svg.row_spacing);
        this.radialBarcodeChart[i] = this.Graph[i].getRadialBarcode(0, this.visibleEntities.length, this.svg.column_spacing, this.svg.row_spacing);
        this.Graph[i].radialBarcodeBackground = this.radialBarcodeChartBackground[i];
        this.Graph[i].radialBarcode = this.radialBarcodeChart[i];

        // +++++ Check for 'barcode' graph type
      } else if (this.config.sparkline.show.chart_type === 'barcode') {
        this.barcodeChart[i] = this.Graph[i].getBarcode(0, this.visibleEntities.length, this.svg.column_spacing, this.svg.row_spacing);
        this.Graph[i].barcodeChart = this.barcodeChart[i];
      }

      // Add the next 4 lines as a hack
      if (config.sparkline.colorstops.colors.length > 0 && !this._card.config.entities[i].color)
        this.gradient[i] = this.Graph[i].computeGradient(config.sparkline.colorstops.colors, this.config.sparkline.state_values.logarithmic);

      this.line = [...this.line];
    }
    this.updating = false;
    if (this._firstUpdatedCalled) {
      this._firstUpdatedCalled = false;
      this._firstDataReceived = true;
    } else {
      this._firstUpdatedCalled = true;
      this._firstDataReceived = false;
    }
  }

  hasSeries() {
    return this.defaultEntityIndex();
  }

  _convertState(res) {
    const resultIndex = this.config.sparkline.state_map.map.findIndex((s) => s.value === res.state);
    if (resultIndex === -1) {
      return;
    }

    res.state = resultIndex;
  }

  // NOTE!!!!!!!!!!!!
  // Should this function return a record with:
  // - source value
  // - mapped value
  // - bucket value (or same as mapped value)
  // In that case the software can choose what to get, depending on the mode.
  // I think that that is more consistent than the current 'bin' implementation.
  // That one hides the source value, which is then is fetched again using reverse
  // lookup in the buckets to get the proper value for computing the color!
  // WOuld this work:
  // - .state = source value
  // - .mapped = mapped value
  // - .xlated = translated value, or bucket/bin. Or same as .mapped.
  // OR, if no mapping or else, use state as the resulting value.
  // - .state = translated value
  // - .sourceState = source state
  // if no .sourceState there, nothing translated. No extra memory and stuff
  processStateMap(history) {
    if (this.config.sparkline.state_map?.map?.length > 0) {
      history[0].forEach((item, index) => {
        if (this.config.sparkline.state_map.map.length > 0) history[0][index].haState = item.state;
        this._convertState(item);
        history[0][index].state = item.state;
      });
    }
    if (this.config.sparkline.state_values?.use_value === 'bin') {
      history[0].forEach((item, index) => {
        let matchStep = -1;
        let matchBucket = 0;
        let match = false;
        match = false;
        for (let i = 0; i < this.gradeRanks.length; i++) {
          // In which bucket...
          // Find matching bucket. Can be any of them defined
          matchBucket = 0;
          for (let j = 0; j < this.gradeRanks[i].rangeMin.length; j++) {
            if (item.state >= this.gradeRanks[i].rangeMin[j] && item.state < this.gradeRanks[i].rangeMax[j]) {
              match = true;
              matchBucket = j;
              matchStep = i;
            }
          }
        }
        if (!match) {
          console.log('processStateMap - ILLEGAL value', item, index);
        }
        const newValue = this.gradeRanks[matchStep].rank;
        history[0][index].haState = item.state;
        history[0][index].state = newValue;
      });
    }
    if (this.config.sparkline.state_values.value_factor !== 0) {
      history[0].forEach((item, index) => {
        history[0][index].haState = item.state;
        history[0][index].state = item.state * this.config.sparkline.state_values.value_factor;
      });
    }
  }

  get visibleEntities() {
    return [1];
    return this._card.config.entities.filter((entity) => entity.show_graph !== false);
  }

  get primaryYaxisEntities() {
    return this.visibleEntities.filter((entity) => entity.states === undefined || entity.states === 'primary');
  }

  get secondaryYaxisEntities() {
    return this.visibleEntities.filter((entity) => entity.states === 'secondary');
  }

  get visibleLegends() {
    return this.visibleEntities.filter((entity) => entity.show_legend !== false);
  }

  get primaryYaxisSeries() {
    return this.primaryYaxisEntities.map((entity, index) => this.Graph[index]);
    // return this.primaryYaxisEntities.map((entity) => this.Graph[entity.index]);
  }

  get secondaryYaxisSeries() {
    return this.secondaryYaxisEntities.map((entity) => this.Graph[entity.index]);
  }

  getBoundary(type, series, configVal, fallback) {
    if (!(type in Math)) {
      throw new Error(`The type "${type}" is not present on the Math object`);
    }

    if (configVal === undefined) {
      return Math[type](...series.map((ele) => ele[type])) || fallback;
    }
    if (configVal[0] !== '~') {
      // fixed boundary
      return configVal;
    }
    // soft boundary (respecting out of range values)
    return Math[type](Number(configVal.substr(1)), ...series.map((ele) => ele[type]));
  }

  getBoundaries(series, min, max, fallback, minRange) {
    let boundary = [this.getBoundary('min', series, min, fallback[0], minRange), this.getBoundary('max', series, max, fallback[1], minRange)];

    if (minRange) {
      const currentRange = Math.abs(boundary[0] - boundary[1]);
      const diff = parseFloat(minRange) - currentRange;

      // Doesn't matter if minBoundRange is NaN because this will be false if so
      if (diff > 0) {
        boundary = [boundary[0] - diff / 2, boundary[1] + diff / 2];
      }
    }

    return boundary;
  }

  updateBounds({ config } = this) {
    this.bound = this.getBoundaries(this.primaryYaxisSeries, config.sparkline.state_values.lower_bound, config.sparkline.state_values.upper_bound, this.bound, config.sparkline.state_values.min_bound_range);

    this.boundSecondary = this.getBoundaries(
      this.secondaryYaxisSeries,
      config.sparkline.state_values.lower_bound_secondary,
      config.sparkline.state_values.upper_bound_secondary,
      this.boundSecondary,
      config.sparkline.state_values.min_bound_range_secondary,
    );
  }

  computeColor(inState, i) {
    const { colorstops, line_color } = this.config.sparkline;
    const state = Number(inState) || 0;
    const threshold = {
      color: line_color[i] || line_color[0],
      ...colorstops.colors.slice(-1)[0],
      ...colorstops.colors.find((ele) => ele.value < state),
    };
    return this._card.config.entities[i].color || threshold.color;
  }

  intColor(inState, i) {
    const { colorstops, line_color } = this.config.sparkline;
    const state = Number(inState) || 0;

    let intColor;
    if (colorstops.colors.length > 0) {
      // HACK. Keep check for 'bar' !!!
      if (this.config.sparkline.show.chart_type === 'bar') {
        const { color } = colorstops.colors.find((ele) => ele.value < state) || colorstops.colors.slice(-1)[0];
        intColor = color;
      } else {
        const index = colorstops.colors.findIndex((ele) => ele.value < state);
        const c1 = colorstops.colors[index];
        const c2 = colorstops.colors[index - 1];
        if (c2) {
          const factor = (c2.value - inState) / (c2.value - c1.value);
          intColor = Colors.getGradientValue(c2.color, c1.color, factor);
        } else {
          intColor = index ? colorstops.colors[colorstops.colors.length - 1].color : colorstops.colors[0].color;
        }
      }
    }

    return this._card.config.entities[i].color || intColor || line_color[i] || line_color[0];
  }

  getEndDate() {
    const date = new Date();
    switch (this.config.period?.group_by) {
      case 'date':
        date.setDate(date.getDate() + 1);
        date.setHours(0, 0, 0);
        break;
      case 'hour':
        date.setHours(date.getHours() + 1);
        date.setMinutes(0, 0);
        break;
      default:
        break;
    }
    // When starting on a calendar period, always start at 00:00 hours
    switch (this.config.period?.calendar?.period) {
      case 'day':
        date.setHours(0, 0, 0, 0);
        break;
      default:
        break;
    }
    return date;
  }

  setTooltip(entity, index, value, label = null) {
    // #TODO: Disable
    return;
    const { bins_per_hour, hours_to_show, format } = this.config.period;
    const offset = hours_to_show < 1 && bins_per_hour < 1 ? bins_per_hour * hours_to_show : 1 / bins_per_hour;

    const id = Math.abs(index + 1 - Math.ceil(hours_to_show * bins_per_hour));

    const now = this.getEndDate();

    const oneMinInHours = 1 / 60;
    now.setMilliseconds(now.getMilliseconds() - getMilli(offset * id + oneMinInHours));
    const end = getTime(now, format, this._card._hass.language);
    now.setMilliseconds(now.getMilliseconds() - getMilli(offset - oneMinInHours));
    const start = getTime(now, format, this._card._hass.language);

    this.tooltip = {
      value,
      id,
      entity,
      time: [start, end],
      index,
      label,
    };
  }

  renderSvgAreaMask(fill, i) {
    if (this.config.sparkline.show.chart_type !== 'area') return;
    if (!fill) return;
    const fade = this.config.sparkline.show.fill === 'fade';
    const init = this.length[i] || this._card.config.entities[i].show_line === false;
    // Check for zero crossing...
    const y_zero = this.Graph[i]._min >= 0 ? 0 : (Math.abs(this.Graph[i]._min) / (this.Graph[i]._max - this.Graph[i]._min)) * 100;
    return svg`
    <defs>
      <linearGradient id=${`fill-grad-pos-${this.id}-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='0.1'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-pos-${this.id}-${i}`}>
        <rect width="100%" height="${100 - y_zero}%" fill=${this.config.sparkline.styles.area_mask_above.fill}
         />
      </mask>
      <linearGradient id=${`fill-grad-neg-${this.id}-${i}`} x1="0%" y1="100%" x2="0%" y2="0%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='0.1'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-neg-${this.id}-${i}`}>
        <rect width="100%" y=${100 - y_zero}% height="${y_zero}%" fill=${this.config.sparkline.styles.area_mask_below.fill}
         />
      </mask>
    </defs>

    <mask id=${`fill-${this.id}-${i}`}>
      <path class='fill'
        type=${this.config.sparkline.show.fill}
        .id=${i} anim=${this.config.sparkline.animate} ?init=${init}
        style="animation-delay: ${this.config.sparkline.animate ? `${i * 0.5}s` : '0s'}"
        fill='white'
        mask=${fade ? `url(#fill-grad-mask-pos-${this.id}-${i})` : ''}
        d=${this.area[i]}
      />
      ${
        this.Graph[i]._min < 0
          ? svg`<path class='fill'
            type=${this.config.sparkline.show.fill}
            .id=${i} anim=${this.config.sparkline.animate} ?init=${init}
            style="animation-delay: ${this.config.sparkline.animate ? `${i * 0.5}s` : '0s'}"
            fill='white'
            mask=${fade ? `url(#fill-grad-mask-neg-${this.id}-${i})` : ''}
            d=${this.area[i]}
          />`
          : ''
      }
    </mask>`;
  }

  renderSvgAreaMinMaxMask(fill, i) {
    if (!['area', 'line'].includes(this.config.sparkline.show.chart_type)) return;
    if (!fill) return;
    const fade = this.config.sparkline.show.fill === 'fade';
    const init = this.length[i] || this._card.config.entities[i].show_line === false;
    // Check for zero crossing...
    const y_zero = this.Graph[i]._min >= 0 ? 0 : (Math.abs(this.Graph[i]._min) / (this.Graph[i]._max - this.Graph[i]._min)) * 100;
    return svg`
    <defs>
      <linearGradient id=${`fill-grad-pos-${this.id}-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='0.1'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-pos-${this.id}-${i}`}>
        <rect width="100%" height="${100 - y_zero}%" fill=${this.config.sparkline.styles.area_mask_above.fill}
         />
      </mask>
      <linearGradient id=${`fill-grad-neg-${this.id}-${i}`} x1="0%" y1="100%" x2="0%" y2="0%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='0.1'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-neg-${this.id}-${i}`}>
        <rect width="100%" y=${100 - y_zero}% height="${y_zero}%" fill=${this.config.sparkline.styles.area_mask_below.fill}
         />
      </mask>
    </defs>

    <mask id=${`fillMinMax-${this.id}-${i}`}>
      <path class='fill'
        type=${this.config.sparkline.show.fill}
        .id=${i} anim=${this.config.sparkline.animate} ?init=${init}
        style="animation-delay: ${this.config.sparkline.animate ? `${i * 0.5}s` : '0s'}"
        fill='#555555'
        mask=${fade ? `url(#fill-grad-mask-pos-${this.id}-${i})` : ''}
        d=${this.areaMinMax[i]}
      />
      ${
        this.Graph[i]._min < 0
          ? svg`<path class='fill'
            type=${this.config.sparkline.show.fill}
            .id=${i} anim=${this.config.sparkline.animate} ?init=${init}
            style="animation-delay: ${this.config.sparkline.animate ? `${i * 0.5}s` : '0s'}"
            fill='#444444'
            mask=${fade ? `url(#fill-grad-mask-neg-${this.id}-${i})` : ''}
            d=${this.areaMinMax[i]}
          />`
          : ''
      }
    </mask>`;
  }

  renderSvgLineMask(line, i) {
    if (!line) return;

    const path = svg`
    <path
      class='line'
      .id=${i}
      anim=${this.config.sparkline.animate} ?init=${this.length[i]}
      style="animation-delay: ${this.config.sparkline.animate ? `${i * 0.5}s` : '0s'}"
      fill='none'
      stroke-dasharray=${this.length[i] || 'none'} stroke-dashoffset=${this.length[i] || 'none'}
      stroke=${'white'}
      stroke-width=${this.svg.line_width}
      d=${this.line[i]}
    />`;

    return svg`
    <mask id=${`line-${this.id}-${i}`}>
      ${path}
    </mask>
  `;
  }

  renderSvgLineMinMaxMask(line, i) {
    if (this.config.sparkline.show.chart_type !== 'line') return;
    if (!line) return;

    const path = svg`
    <path
      class='lineMinMax'
      .id=${i}
      anim=${this.config.sparkline.animate} ?init=${this.length[i]}
      style="animation-delay: ${this.config.sparkline.animate ? `${i * 0.5}s` : '0s'}"
      fill='none'
      stroke-dasharray=${this.length[i] || 'none'} stroke-dashoffset=${this.length[i] || 'none'}
      stroke=${'white'}
      stroke-width=${this.svg.line_width}
      d=${this.line[i]}
    />`;

    return svg`
    <mask id=${`lineMinMax-${this.id}-${i}`}>
      ${path}
    </mask>
  `;
  }

  renderSvgPoint(point, i) {
    const color = this.gradient[i] ? this.computeColor(point[V], i) : 'inherit';
    return svg`
    <circle
      class='line--point'
      ?inactive=${this.tooltip.index !== point[3]}
      style=${`--mcg-hover: ${color};`}
      stroke=${color}
      fill=${color}
      cx=${point[X]} cy=${point[Y]} r=${this.svg.line_width / 1.5}
      @mouseover=${() => this.setTooltip(i, point[3], point[V])}
      @mouseout=${() => (this.tooltip = {})}
    />
  `;
  }

  renderSvgPoints(points, i) {
    if (!points) return;
    const color = this.computeColor(this._card.entities[i].state, i);
    return svg`
    <g class='line--points'
      ?tooltip=${this.tooltip.entity === i}
      ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== i}
      ?init=${this.length[i]}
      anim=${this.config.sparkline.animate && this.config.sparkline.show.points !== 'hover'}
      style="animation-delay: ${this.config.sparkline.animate ? `${i * 0.5 + 0.5}s` : '0s'}"
      fill=${color}
      stroke=${color}
      stroke-width=${this.svg.line_width / 2}
      >
      ${points.map((point) => this.renderSvgPoint(point, i))}
    </g>`;
  }

  renderSvgTrafficLight(trafficLight, i) {
    let size;
    if (this.config.sparkline.graded.square === true) {
      // Redistribute height
      size = Math.min(trafficLight.width, trafficLight.height);
      if (size < trafficLight.height) {
        let spaceBetween = (this.svg.graph.height - this.gradeRanks.length * size) / (this.gradeRanks.length - 1);

        for (let j = 0; j < this.gradeRanks.length; j++) {
          trafficLight.y[j] = this.svg.graph.height + this.svg.margin.y - j * (size + spaceBetween);
        }
        trafficLight.height = size;
        trafficLight.width = size;
      } else {
        // #TODO:
        // Redistribute width too !!! trafficLight.x[j] is not right anymore, as the previous width
        // was used to calculate the start x position to draw the rectangle...
        // Problem found with awair3c fce2!!!
        trafficLight.width = size;
      }
    }
    const tlRect = this.gradeRanks.map((bucket, k) => {
      const piet = [];
      const hasValue = typeof trafficLight.value[k] !== 'undefined';
      const classList = hasValue ? this.classes.graded_foreground : this.classes.graded_background;
      const styleList = hasValue ? this.styles.graded_foreground : this.styles.graded_background;
      const color = hasValue ? this.computeColor(trafficLight.value[k] + 0.001, 0) : 'var(--theme-sys-elevation-surface-neutral4)';
      // Safari needs an rx attribute. Can't handle rx as style, so fix this
      // by adding the attribute if defined in styles section...
      const rx = hasValue ? this.styles.graded_foreground?.rx || 0 : this.styles.graded_background?.rx || 0;
      const ry = hasValue ? this.styles.graded_foreground?.ry || rx : this.styles.graded_background?.ry || rx;

      return svg`
    <rect class="${classMap(classList)}" style="${styleMap(styleList)}"
      x=${trafficLight.x + this.svg.line_width / 2}
      y=${trafficLight.y[k] - 1 * trafficLight.height + this.svg.line_width / 2}
      height=${Math.max(1, trafficLight.height - this.svg.line_width)}
      width=${Math.max(1, trafficLight.width - this.svg.line_width)}
      stroke-width="${this.svg.line_width ? this.svg.line_width : 0}"
      fill=${color}
      stroke=${color}
      pathLength="10"
      rx=${rx}
      ry=${ry}
      >
    </rect>`;
    });
    return svg`
    ${tlRect}
    `;
  }

  renderSvgGraded(trafficLights, i) {
    if (!trafficLights) return;
    const color = this.computeColor(this._card.entities[i].state, i);
    const linesBelow = this.xLines.lines.map((helperLine) => {
      if (helperLine.zpos === 'below') {
        return [
          svg`
        <line class=${classMap(this.classes[helperLine.id])}) style="${styleMap(this.styles[helperLine.id])}"
        x1="${this.svg.margin.x}" y1="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
        x2="${this.svg.graph.width + this.svg.margin.x}" y2="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
        pathLength="240"
        >
        </line>
        `,
        ];
      } else return [''];
    });
    const linesAbove = this.xLines.lines.map((helperLine) => {
      if (helperLine.zpos === 'above') {
        return [
          svg`
        <line class="${classMap(this.classes[helperLine.id])}"
              style="${styleMap(this.styles[helperLine.id])}"
        x1="${this.svg.margin.x}" y1="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
        x2="${this.svg.graph.width + this.svg.margin.x}" y2="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
        pathLength="240"
        >
        </line>
        `,
        ];
      } else return [''];
    });
    return svg`
    <g class='traffic-lights'
      ?tooltip=${this.tooltip.entity === i}
      ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== i}
      ?init=${this.length[i]}
      anim=${this.config.sparkline.animate && this.config.sparkline.show.points !== 'hover'}
      style="animation-delay: ${this.config.sparkline.animate ? `${i * 0.5 + 0.5}s` : '0s'}"
      fill=${color}
      stroke=${color}
      stroke-width=${this.svg.line_width / 2}
      >
      ${linesBelow}
      ${trafficLights.map((trafficLight) => this.renderSvgTrafficLight(trafficLight, i))}
      ${linesAbove}
    </g>`;
  }

  renderSvgGradient(gradients) {
    if (!gradients) return;
    const items = gradients.map((gradient, i) => {
      if (!gradient) return;
      return svg`
      <linearGradient id=${`grad-${this.id}-${i}`} gradientTransform="rotate(90)">
        ${gradient.map(
          (stop) => svg`
          <stop stop-color=${stop.color} offset=${`${stop.offset}%`} />
        `,
        )}
      </linearGradient>`;
    });
    return svg`${items}`;
  }

  // Render the rectangle with the line color to be used.
  // The line itself is a mask, that only shows the colors behind it using 'white'
  // as the drawing (fill) color...
  renderSvgLineBackground(line, i) {
    if (!line) return;
    const fill = this.gradient[i] ? `url(#grad-${this.id}-${i})` : this.computeColor(this._card.entities[i].state, i);

    const linesBelow = this.xLines.lines.map((helperLine) => {
      if (helperLine.zpos === 'below') {
        return [
          svg`
        <line class=${classMap(this.classes[helperLine.id])}) style="${styleMap(this.styles[helperLine.id])}"
        x1="${this.svg.margin.x}" y1="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
        x2="${this.svg.graph.width + this.svg.margin.x}" y2="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
        pathLength="240"
        >
        </line>
        `,
        ];
      } else return [''];
    });
    const linesAbove = this.xLines.lines.map((helperLine) => {
      if (helperLine.zpos === 'above') {
        return [
          svg`
        <line class="${classMap(this.classes[helperLine.id])}"
              style="${styleMap(this.styles[helperLine.id])}"
        x1="${this.svg.margin.x}" y1="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
        x2="${this.svg.graph.width + this.svg.margin.x}" y2="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
        pathLength="240"
        >
        </line>
        `,
        ];
      } else return [''];
    });

    return svg`
    ${linesBelow}
    <rect class='line--rect'
      ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== i}
      id=${`line-rect-${this.id}-${i}`}
      fill=${fill} height="100%" width="100%"
      mask=${`url(#line-${this.id}-${i})`}
    />
    ${linesAbove}
    `;
  }

  renderSvgLineMinMaxBackground(line, i) {
    // Hack
    if (this.config.sparkline.show.chart_type !== 'line') return;
    if (!line) return;
    const fill = this.gradient[i] ? `url(#grad-${this.id}-${i})` : this.computeColor(this._card.entities[i].state, i);
    return svg`
    <rect class='line--rect'
      ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== i}
      id=${`line-rect-${this.id}-${i}`}
      fill=${fill} height="100%" width="100%"
      mask=${`url(#lineMinMax-${this.id}-${i})`}
    />`;
  }

  // Render the area below the line graph.
  // Currently called the 'fill', but actually it should be named area, after
  // sparkline area graph according to the mighty internet.
  renderSvgAreaBackground(fill, i) {
    if (this.config.sparkline.show.chart_type !== 'area') return;
    if (!fill) return;
    const svgFill = this.gradient[i] ? `url(#grad-${this.id}-${i})` : this.intColor(this._card.entities[i].state, i);
    const linesBelow = this.xLines.lines.map((helperLine) => {
      if (helperLine.zpos === 'below') {
        return [
          svg`
          <line class=${classMap(this.classes[helperLine.id])}) style="${styleMap(this.styles[helperLine.id])}"
          x1="${this.svg.margin.x}" y1="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
          x2="${this.svg.graph.width + this.svg.margin.x}" y2="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
          pathLength="240"
          >
          </line>
          `,
        ];
      } else return [''];
    });
    const linesAbove = this.xLines.lines.map((helperLine) => {
      if (helperLine.zpos === 'above') {
        return [
          svg`
          <line class="${classMap(this.classes[helperLine.id])}"
                style="${styleMap(this.styles[helperLine.id])}"
          x1="${this.svg.margin.x}" y1="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
          x2="${this.svg.graph.width + this.svg.margin.x}" y2="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
          pathLength="240"
          >
          </line>
          `,
        ];
      } else return [''];
    });

    return svg`
    ${linesBelow}
    <rect class='fill--rect'
      ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== i}
      id=${`fill-rect-${this.id}-${i}`}
      fill=${svgFill} height="100%" width="100%"
      mask=${`url(#fill-${this.id}-${i})`}
    />
    ${linesAbove}
    `;
  }

  renderSvgAreaMinMaxBackground(fill, i) {
    if (!['area', 'line'].includes(this.config.sparkline.show.chart_type)) return;
    if (!fill) return;
    const svgFill = this.gradient[i] ? `url(#grad-${this.id}-${i})` : this.intColor(this._card.entities[i].state, i);
    return svg`
    <rect class='fill--rect'
      ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== i}
      id=${`fill-rect-${this.id}-${i}`}
      fill=${svgFill} height="100%" width="100%"
      mask=${`url(#fillMinMax-${this.id}-${i})`}
    />`;
  }

  renderSvgEqualizerMask(equalizer, index) {
    if (this.config.sparkline.show.chart_type !== 'equalizer') return;

    if (!equalizer) return;
    const fade = this.config.sparkline.show.fill === 'fade';
    const maskNeg = `url(#fill-grad-mask-neg-${this.id}-${index}})`;
    const maskPos = `url(#fill-grad-mask-pos-${this.id}-${index}})`;
    const fillNeg = this.config.sparkline.styles.bar_mask_below.fill;
    const fillPos = this.config.sparkline.styles.bar_mask_above.fill;

    let size;
    if (this.config.sparkline.equalizer.square === true) {
      // Redistribute height
      size = Math.min(equalizer[0].width, equalizer[0].height);
      if (size < equalizer[0].height) {
        let spaceBetween = (this.svg.height - this.config.sparkline.equalizer.value_buckets * size) / (this.config.sparkline.equalizer.value_buckets - 1);

        let newEq = equalizer.map((equalizerPart, i) => {
          let eq = { ...equalizerPart };
          for (let j = 0; j < equalizerPart.y.length; j++) {
            eq.y[j] = this.svg.height - j * (size + spaceBetween);
          }
          eq.width = size;
          eq.height = size;
          return eq;
        });
        equalizer = [...newEq];
      }
    }
    const paths = equalizer.map((equalizerPart, i) => {
      const equalizerPartRect = equalizerPart.value.map((single, j) => {
        const piet = [];
        const animation = this.config.sparkline.animate
          ? svg`
        <animate attributeName='y'
          from=${this.svg.height} to=${equalizerPart.y[j] - 1 * equalizerPart.height - this.svg.line_width}
          begin='0s' dur='2s' fill='remove' restart='whenNotActive' repeatCount='1'
          calcMode='spline' keyTimes='0; 1' keySplines='0.215 0.61 0.355 1'>
        </animate>`
          : '';
        return svg`
      <rect class="${classMap(this.classes.equalizer_part)}"
            style="${styleMap(this.styles.equalizer_part)}"
        data-size=${size}
        x=${equalizerPart.x}
        y=${equalizerPart.y[j] - equalizerPart.height - this.svg.line_width / 100000}
        height=${Math.max(1, equalizerPart.height - this.svg.line_width)}
        width=${Math.max(1, equalizerPart.width - this.svg.line_width)}
        fill=${fade ? (equalizerPart.value > 0 ? fillPos : fillNeg) : 'white'}
        stroke=${fade ? (equalizerPart.value > 0 ? fillPos : fillNeg) : 'white'}
        stroke-width="${this.svg.line_width ? this.svg.line_width : 0}"
        rx="0%"
        style="transition: fill 5s ease;"
        @mouseover=${() => this.setTooltip(index, j, single)}
        @mouseout=${() => (this.tooltip = {})}>
        ${this._firstUpdatedCalled ? animation : ''}
      </rect>`;
      });

      return svg`
      ${equalizerPartRect}`;
    });
    return svg`
    <defs>
      <linearGradient id=${`fill-grad-pos-${this.id}-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='25%' stop-opacity='0.4'/>
        <stop stop-color='white' offset='60%' stop-opacity='0.0'/>
      </linearGradient>
      <linearGradient id=${`fill-grad-neg-${this.id}-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop stop-color='white' offset='40%' stop-opacity='0'/>
        <stop stop-color='white' offset='75%' stop-opacity='0.4'/>
        <stop stop-color='white' offset='100%' stop-opacity='1.0'/>
      </linearGradient>

      <mask id=${`fill-grad-mask-pos-${this.id}-${index}`}>
        <rect width="100%" height="100%"}
      </mask>
    </defs>  
    <mask id=${`equalizer-bg-${this.id}-${index}`}>
      ${paths}
      mask = ${maskPos}
    </mask>
  `;
  }

  renderSvgBarsMask(bars, index) {
    if (this.config.sparkline.show.chart_type !== 'bar') return;

    if (!bars) return;
    const fade = this.config.sparkline.show.fill === 'fade';
    const maskNeg = `url(#fill-grad-mask-neg-${this.id}-${index}})`;
    const maskPos = `url(#fill-grad-mask-pos-${this.id}-${index}})`;
    const fillNeg = this.config.sparkline.styles.bar_mask_below.fill;
    const fillPos = this.config.sparkline.styles.bar_mask_above.fill;

    const paths = bars.map((bar, i) => {
      const animation = this.config.sparkline.animate
        ? svg`
        <animate attributeName='y' from=${this.svg.height} to=${bar.y} dur='2s' fill='remove'
          calcMode='spline' keyTimes='0; 1' keySplines='0.215 0.61 0.355 1'>
        </animate>`
        : '';
      return svg` 

      <rect class='bar' x=${bar.x} y=${bar.y + (bar.value > 0 ? +this.svg.line_width / 2 : -this.svg.line_width / 2)}
        height=${Math.max(1, bar.height - this.svg.line_width / 1 - 0)} width=${bar.width}
        fill=${fade ? (bar.value > 0 ? fillPos : fillNeg) : 'white'}
        stroke=${fade ? (bar.value > 0 ? fillPos : fillNeg) : 'white'}
        stroke-width="${this.svg.line_width ? this.svg.line_width : 0}"
        @mouseover=${() => this.setTooltip(index, i, bar.value)}
        @mouseout=${() => (this.tooltip = {})}>
        ${this._firstUpdatedCalled ? animation : ''}
      </rect>`;
    });
    return svg`
    <defs>
      <linearGradient id=${`fill-grad-pos-${this.id}-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='25%' stop-opacity='0.4'/>
        <stop stop-color='white' offset='60%' stop-opacity='0.0'/>
      </linearGradient>
      <linearGradient id=${`fill-grad-neg-${this.id}-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop stop-color='white' offset='40%' stop-opacity='0'/>
        <stop stop-color='white' offset='75%' stop-opacity='0.4'/>
        <stop stop-color='white' offset='100%' stop-opacity='1.0'/>
      </linearGradient>

      <mask id=${`fill-grad-mask-pos-${this.id}-${index}`}>
        <rect width="100%" height="100%"}
      </mask>
    </defs>  
    <mask id=${`bars-bg-${this.id}-${index}`}>
      ${paths}
      mask = ${maskPos}
    </mask>
  `;
  }

  renderSvgEqualizerBackground(equalizer, index) {
    if (this.config.sparkline.show.chart_type !== 'equalizer') return;
    if (!equalizer) return;

    const fade = this.config.sparkline.show.fill === 'fadenever';
    if (fade) {
      // Is in fact the rendering of the AreaMask... In this case the barsmask.
      // This is incomplete. Need rendering of the background itself too
      // So check AreaBackground too to be complete for the 'fade' functionality of the Area
      const init = this.length[index] || this._card.config.entities[index].show_line === false;
      const svgFill = this.gradient[index] ? `url(#grad-${this.id}-${index})` : this.intColor(this._card.entities[index].state, index);
      const fill = this.gradient[index] ? `url(#fill-grad${this.id}-${index})` : this.intColor(this._card.entities[index].state, index);

      return svg`
      <defs>
        <linearGradient id=${`fill-grad-${this.id}-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop stop-color='white' offset='0%' stop-opacity='1'/>
          <stop stop-color='white' offset='100%' stop-opacity='.1'/>
        </linearGradient>

        <mask id=${`fill-grad-mask-${this.id}-${index}`}>
          <rect width="100%" height="100%" fill=${`url(#fill-grad-${this.id}-${index})`}
        </mask>
      </defs>

      <g mask = ${`url(#fill-grad-mask-${this.id}-${index})`}>
        <rect class='equalizer--bg'
          ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== index}
          id=${`equalizer-bg-${this.id}-${index}`}
          fill=${svgFill} height="100%" width="100%"
          mask=${`url(#equalizer-bg-${this.id}-${index})`}
        />
      /g>`;
    } else {
      const fill = this.gradient[index] ? `url(#grad-${this.id}-${index})` : this.computeColor(this._card.entities[index].state, index);

      const linesBelow = this.xLines.lines.map((helperLine) => {
        if (helperLine.zpos === 'below') {
          return [
            svg`
            <line class=${classMap(this.classes[helperLine.id])}) style="${styleMap(this.styles[helperLine.id])}"
            x1="${this.svg.margin.x}" y1="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
            x2="${this.svg.graph.width + this.svg.margin.x}" y2="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
            pathLength="240"
            >
            </line>
            `,
          ];
        } else return [''];
      });
      const linesAbove = this.xLines.lines.map((helperLine) => {
        if (helperLine.zpos === 'above') {
          return [
            svg`
            <line class="${classMap(this.classes[helperLine.id])}"
                  style="${styleMap(this.styles[helperLine.id])}"
            x1="${this.svg.margin.x}" y1="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
            x2="${this.svg.graph.width + this.svg.margin.x}" y2="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
            pathLength="240"
            >
            </line>
            `,
          ];
        } else return [''];
      });
      return svg`
      ${linesBelow}
      <rect class='equalizer--bg'
        ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== index}
        id=${`equalizer-bg-${this.id}-${index}`}
        fill=${fill} height="100%" width="100%"
        mask=${`url(#equalizer-bg-${this.id}-${index})`}
      />
      ${linesAbove}
      `;
    }
  }

  renderSvgBarsBackground(bars, index) {
    if (this.config.sparkline.show.chart_type !== 'bar') return;
    if (!bars) return;

    const fade = this.config.sparkline.show.fill === 'fadenever';
    if (fade) {
      // Is in fact the rendering of the AreaMask... In this case the barsmask.
      // This is incomplete. Need rendering of the background itself too
      // So check AreaBackground too to be complete for the 'fade' functionality of the Area
      const init = this.length[index] || this._card.config.entities[index].show_line === false;
      const svgFill = this.gradient[index] ? `url(#grad-${this.id}-${index})` : this.intColor(this._card.entities[index].state, index);
      const fill = this.gradient[index] ? `url(#fill-grad${this.id}-${index})` : this.intColor(this._card.entities[index].state, index);

      // mask=${`url(#bars-bg-${this.id}-${index})`}

      return svg`
      <defs>
        <linearGradient id=${`fill-grad-${this.id}-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop stop-color='white' offset='0%' stop-opacity='1'/>
          <stop stop-color='white' offset='100%' stop-opacity='.1'/>
        </linearGradient>

        <mask id=${`fill-grad-mask-${this.id}-${index}`}>
          <rect width="100%" height="100%" fill=${`url(#fill-grad-${this.id}-${index})`}
        </mask>
      </defs>

      <g mask = ${`url(#fill-grad-mask-${this.id}-${index})`}>
        <rect class='bars--bg'
          ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== index}
          id=${`bars-bg-${this.id}-${index}`}
          fill=${svgFill} height="100%" width="100%"
          mask=${`url(#bars-bg-${this.id}-${index})`}
        />
      /g>`;
    } else {
      const fill = this.gradient[index] ? `url(#grad-${this.id}-${index})` : this.computeColor(this._card.entities[index].state, index);
      return svg`
      <rect class='bars--bg'
        ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== index}
        id=${`bars-bg-${this.id}-${index}`}
        fill=${fill} height="100%" width="100%"
        mask=${`url(#bars-bg-${this.id}-${index})`}
      />`;
    }
  }

  // This function to use for coloring the full bar depending on colorstop or color
  // This depends on the style setting. Don't know which one at this point
  renderSvgBars(bars, index) {
    if (!bars) return;
    const items = bars.map((bar, i) => {
      const animation = this.config.sparkline.animate
        ? svg`
        <animate attributeName='y' from=${this.svg.height} to=${bar.y} dur='2s' fill='remove'
          calcMode='spline' keyTimes='0; 1' keySplines='0.215 0.61 0.355 1'>
        </animate>`
        : '';
      const color = this.computeColor(bar.value, index);
      return svg` 
      <rect class='bar' x=${bar.x} y=${bar.y}
        height=${bar.height} width=${bar.width} fill=${color}
        @mouseover=${() => this.setTooltip(index, i, bar.value)}
        @mouseout=${() => (this.tooltip = {})}>
        ${this._firstUpdatedCalled ? animation : ''}
      </rect>`;
    });
    return svg`<g class='bars' ?anim=${this.config.sparkline.animate}>${items}</g>`;
  }

  renderSvgRadialBarcodeBin(bin, path, index) {
    const color = this.intColor(bin.value, 0);
    return svg`
  <path class="${classMap(this.classes.clock_graph)}"
        style="${styleMap(this.styles.clock_graph)}"
    d=${path}
    fill=${color}
    stroke=${color}
  >
  `;
  }

  renderSvgRadialBarcodeBackgroundBin(bin, path, index) {
    let color = 'lightgray';
    return svg`
  <path class="${classMap(this.classes.radial_barcode_background)}"
        style="${styleMap(this.styles.radial_barcode_background)}"
    d=${path}
  >
  `;
  }

  renderSvgRadialBarcodeBackground(radius) {
    const { start, end, start2, end2, largeArcFlag, sweepFlag } = this.Graph[0]._calcRadialBarcodeCoords(0, 359.9, true, radius, radius, this.radialBarcodeChartWidth);
    const radius2 = { x: radius - this.radialBarcodeChartWidth, y: radius - this.radialBarcodeChartWidth };

    const d = [
      'M',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      sweepFlag,
      end.x,
      end.y,
      'L',
      end2.x,
      end2.y,
      'A',
      radius2.x,
      radius2.y,
      0,
      largeArcFlag,
      sweepFlag === '0' ? '1' : '0',
      start2.x,
      start2.y,
      'Z',
    ].join(' ');
    return svg`
    <path
      style="fill: lightgray; opacity: 0.4"
      d="${d}"
    />
  `;
  }

  renderSvgRadialBarcodeFace(radius) {
    //  if (!this.config?.clock?.face) return svg``;
    if (!this.config?.radial_barcode?.face) return svg``;

    const renderDayNight = () =>
      this.config.radial_barcode.face?.show_day_night === true
        ? svg`
          <circle pathLength="1"
          class="${classMap(this.classes.radial_barcode_face_day_night)}" style="${styleMap(this.styles.radial_barcode_face_day_night)}"
          r="${this.svg.clockface.dayNightRadius}" cx=${this.svg.width / 2} cy="${this.svg.height / 2}"
          />
        `
        : '';
    const renderHourMarks = () =>
      this.config.radial_barcode.face?.show_hour_marks === true
        ? svg`
        <circle pathLength=${this.config.radial_barcode.face.hour_marks_count}
        class="${classMap(this.classes.radial_barcode_face_hour_marks)}" style="${styleMap(this.styles.radial_barcode_face_hour_marks)}"
        r="${this.svg.clockface.hourMarksRadius}" cx=${this.svg.width / 2} cy="${this.svg.height / 2}"
        />
       `
        : '';
    // alignment-baseline not working on SVG group tag, so all on svg text
    const renderAbsoluteHourNumbers = () =>
      this.config.radial_barcode.face?.show_hour_numbers === 'absolute'
        ? svg`
        <g>
          <text class="${classMap(this.classes.radial_barcode_face_hour_numbers)}" style="${styleMap(this.styles.radial_barcode_face_hour_numbers)}"
            x="${this.svg.width / 2}" y="${this.svg.height / 2 - this.svg.clockface.hourNumbersRadius}"
            >24</text>
          <text class="${classMap(this.classes.radial_barcode_face_hour_numbers)}" style="${styleMap(this.styles.radial_barcode_face_hour_numbers)}"
            x="${this.svg.width / 2}" y="${this.svg.height / 2 + this.svg.clockface.hourNumbersRadius}"
            >12</text>
          <text class="${classMap(this.classes.radial_barcode_face_hour_numbers)}" style="${styleMap(this.styles.radial_barcode_face_hour_numbers)}"
            x="${this.svg.width / 2 + this.svg.clockface.hourNumbersRadius}" y="${this.svg.height / 2}"
            >6</text>
          <text class="${classMap(this.classes.radial_barcode_face_hour_numbers)}" style="${styleMap(this.styles.radial_barcode_face_hour_numbers)}"
            x="${this.svg.width / 2 - this.svg.clockface.hourNumbersRadius}" y="${this.svg.height / 2}"
            >18</text>
        </g>`
        : '';
    // Note:
    // alignment-baseline not working on SVG group tag, so all on svg text
    const renderRelativeHourNumbers = () =>
      this.config.radial_barcode.face?.show_hour_numbers === 'relative'
        ? svg`
        <g>
          <text class="${classMap(this.classes.radial_barcode_face_hour_numbers)}" style="${styleMap(this.styles.radial_barcode_face_hour_numbers)}"
            x="${this.svg.width / 2}" y="${this.svg.height / 2 - this.svg.clockface.hourNumbersRadius}"
            >0</text>
          <text class="${classMap(this.classes.radial_barcode_face_hour_numbers)}" style="${styleMap(this.styles.radial_barcode_face_hour_numbers)}"
            x="${this.svg.width / 2}" y="${this.svg.height / 2 + this.svg.clockface.hourNumbersRadius}"
            >-12</text>
          <text class="${classMap(this.classes.radial_barcode_face_hour_numbers)}" style="${styleMap(this.styles.radial_barcode_face_hour_numbers)}"
            x="${this.svg.width / 2 + this.svg.clockface.hourNumbersRadius}" y="${this.svg.height / 2}"
            >-18</text>
          <text class="${classMap(this.classes.radial_barcode_face_hour_numbers)}" style="${styleMap(this.styles.radial_barcode_face_hour_numbers)}"
            x="${this.svg.width / 2 - this.svg.clockface.hourNumbersRadius}" y="${this.svg.height / 2}"
            >-6</text>

        </g>`
        : '';

    return svg`
    ${renderDayNight()}
    ${renderHourMarks()}
    ${renderAbsoluteHourNumbers()}
    ${renderRelativeHourNumbers()}
  `;
  }

  // See here: https://pro.arcgis.com/en/pro-app/latest/help/analysis/geoprocessing/charts/data-clock.htm
  // for nice naming conventions using ring, wedge and bin!
  renderSvgRadialBarcode(radialBarcode, index) {
    if (!radialBarcode) return;
    const radialBarcodePaths = this.Graph[index].getRadialBarcodePaths();
    const radialBarcodeBackgroundPaths = this.Graph[index].getRadialBarcodeBackgroundPaths();

    return svg`
    <g class='graph-clock'
      ?tooltip=${this.tooltip.entity === index}
      ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== index}
      ?init=${this.length[index]}
      anim=${this.config.sparkline.animate && this.config.sparkline.show.points !== 'hover'}
      style="animation-delay: ${this.config.sparkline.animate ? `${index * 0.5 + 0.5}s` : '0s'}"
      stroke-width=${this.svg.line_width / 2}>
      ${this.radialBarcodeChartBackground[index].map((bin, i) => this.renderSvgRadialBarcodeBackgroundBin(bin, radialBarcodeBackgroundPaths[i], i))}
      ${radialBarcode.map((bin, i) => this.renderSvgRadialBarcodeBin(bin, radialBarcodePaths[i], i))}
      ${this.renderSvgRadialBarcodeFace(this.svg.width / 2 - 2 * 20)}
    </g>`;
  }

  renderSvgBarcode(barcode, index) {
    if (!barcode) return;
    const paths = barcode.map((barcodePart, i) => {
      // const color = this.computeColor(barcodePart.value, 0);
      // Should use different value for use_value: bin. In that case the index in the colorstop
      // should be used, ie reverse lookup. Not the start/end values of the stop itself, but the
      // bucket value!!
      let color;
      if (this.config.sparkline.state_values?.use_value === 'bin') {
        // If aggrerate func = avg, one might get fractions! Floor those!!
        // However, fraction is still calculated on height, so you can see that it was not in the same
        // bucket all the time. Should also color that one with intColor?? Ie show smoothing ??
        // In that case: if value is 0.3, calculate value in range?
        // rangeMin + rangeMin * fractionOf(value)
        const flooredValue = Math.floor(barcodePart.value);
        if (this.gradeRanks[flooredValue]?.value) {
          const colorValue = this.gradeRanks[flooredValue].value[0] + (this.gradeRanks[flooredValue].rangeMax[0] - this.gradeRanks[flooredValue].rangeMin[0]) * (barcodePart.value - flooredValue);
          color = this.intColor(colorValue, 0);
        } else {
          // Weird stuff. What is that illegal value???
          console.log('renderbarcode, illegal value', barcodePart.value);
        }
      } else {
        color = this.intColor(barcodePart.value, 0);
      }

      const animation = this.config.sparkline.animate
        ? svg`
        <animate attributeName='x' from=${this.svg.margin.x} to=${barcodePart.x} dur='3s' fill='remove'
          calcMode='spline' keyTimes='0; 1' keySplines='0.215 0.61 0.355 1'>
        </animate>`
        : '';
      // Safari needs an rx attribute. Can't handle rx as style, so fix this
      // by adding the attribute if defined in styles section...
      const rx = this.styles.barcode_graph?.rx || 0;
      const ry = this.styles.barcode_graph?.ry || rx;

      // Correct y if barcodePart.height < 1, as this value gets a min of 1
      const realHeight = barcodePart.height - this.svg.margin.t - this.svg.margin.b - this.svg.line_width;
      const yCorr = realHeight < 1 ? -(1 - realHeight) : 0;

      return svg` 
      <!-- Barcode Part -->
      <rect class="${classMap(this.classes.barcode_graph)}"
            style="${styleMap(this.styles.barcode_graph)}"
        x=${barcodePart.x}
        y=${barcodePart.y + yCorr + this.svg.margin.t - this.svg.margin.b + this.svg.line_width / 2}
        height=${Math.max(1, barcodePart.height - this.svg.margin.t - this.svg.margin.b - this.svg.line_width)}
        width=${Math.max(barcodePart.width, 1)}
        fill=${color}
        stroke=${color}
        stroke-width="${this.svg.line_width ? this.svg.line_width : 0}"
        rx="${rx}"
        ry="${ry}"
        @mouseover=${() => this.setTooltip(index, i, barcodePart.value)}
        @mouseout=${() => (this.tooltip = {})}>
        ${this._firstUpdatedCalled ? animation : ''}
      </rect>`;
    });

    const linesBelow = this.xLines.lines.map((line) => {
      if (line.zpos === 'below') {
        return [
          svg`
        <!-- Line Below -->
        <line class=${classMap(this.classes[line.id])} style="${styleMap(this.styles[line.id])}"
        x1="${this.svg.margin.x}" y1="${this.svg.margin.y + this.svg.graph.height / 2 + line.yshift}"
        x2="${this.svg.graph.width + this.svg.margin.x}" y2="${this.svg.margin.y + this.svg.graph.height / 2 + line.yshift}"
        pathLength="240"
        >
        </line>
        `,
        ];
      } else return [''];
    });
    const linesAbove = this.xLines.lines.map((line) => {
      if (line.zpos === 'above') {
        return [
          svg`
        <!-- Line Above-->
        <line class="${classMap(this.classes[line.id])}"
              style="${styleMap(this.styles[line.id])}"
        x1="${this.svg.margin.x}" y1="${this.svg.margin.y + this.svg.graph.height / 2 + line.yshift}"
        x2="${this.svg.graph.width + this.svg.margin.x}" y2="${this.svg.margin.y + this.svg.graph.height / 2 + line.yshift}"
        pathLength="240"
        >
        </line>
        `,
        ];
      } else return [''];
    });
    return svg`
    <!-- Sparkline Barcode Render -->
    <g id="linesBelow">
      ${linesBelow}
    </g>
    <g id="BarcodeParts">
      ${paths}
    </g>
    <g id="linesAbove">
      ${linesAbove}
    </g>
  `;
  }

  renderSvg() {
    let i = 0;
    if (this.config.sparkline.colorstops.colors.length > 0 && !this._card.config.entities[i].color)
      this.gradient[i] = this.Graph[i].computeGradient(this.config.sparkline.colorstops.colors, this.config.sparkline.state_values.logarithmic);
    this.MergeAnimationClassIfChanged();
    this.MergeAnimationStyleIfChanged();

    return svg`
    <svg width="${this.svg.width}" height="${this.svg.height}" overflow="visible"
      x="${this.svg.x}" y="${this.svg.y}"
    >
      <g>
        <!-- Sparkline Tool Gradient Defs -->
        <defs>
          ${this.renderSvgGradient(this.gradient)}
        </defs>
        <!-- Sparkline Tool Graph Area -->
        <svg viewBox="0 0 ${this.svg.width} ${this.svg.height}"
         overflow="visible"
        >
        ${this.area.map((fill, i) => this.renderSvgAreaMask(fill, i))}
        ${this.area.map((fill, i) => this.renderSvgAreaBackground(fill, i))}
        ${this.areaMinMax.map((fill, i) => this.renderSvgAreaMinMaxMask(fill, i))}
        ${this.areaMinMax.map((fill, i) => this.renderSvgAreaMinMaxBackground(fill, i))}
        ${this.line.map((line, i) => this.renderSvgLineMask(line, i))}
        ${this.line.map((line, i) => this.renderSvgLineBackground(line, i))}
        ${this.bar.map((bars, i) => this.renderSvgBarsMask(bars, i))}
        ${this.bar.map((bars, i) => this.renderSvgBarsBackground(bars, i))}
        ${this.equalizer.map((equalizer, i) => this.renderSvgEqualizerMask(equalizer, i))}
        ${this.equalizer.map((equalizer, i) => this.renderSvgEqualizerBackground(equalizer, i))}
        ${this.points.map((points, i) => this.renderSvgPoints(points, i))}
        ${this.barcodeChart.map((barcodePart, i) => this.renderSvgBarcode(barcodePart, i))}
        ${this.radialBarcodeChart.map((radialPart, i) => this.renderSvgRadialBarcode(radialPart, i))}
        ${this.graded.map((grade, i) => this.renderSvgGraded(grade, i))}
        </svg>
      </g>
    </svg>`;
  }

  updated(changedProperties) {
    if (this.config.sparkline.animate && changedProperties.has('line')) {
      if (this.length.length < this.entity.length) {
        this._card.shadowRoot.querySelectorAll('svg path.line').forEach((ele) => {
          this.length[ele.id] = ele.getTotalLength();
        });
        this.length = [...this.length];
      } else {
        this.length = Array(this.entity.length).fill('none');
      }
    }
  }

  /** *****************************************************************************
   * SparklineGraphTool::render()
   *
   * Summary.
   * The actual render() function called by the card for each tool.
   *
   */
  render() {
    return svg`
        <!-- Sparkline Tool Render -->
        <g
          id="sparkline-${this.toolId}"
          class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
          @click=${(e) => this.handleTapEvent(e, this.config)}>
          ${this.renderSvg()}
        </g>
      `;
  }
}
