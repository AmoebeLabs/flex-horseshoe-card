/* eslint-disable arrow-body-style */
/* eslint-disable no-useless-concat */
import { html, svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import BaseTool from './base-tool.js';
import Colors from './colors';
import ConfigHelper from './config-helper.js';
import Merge from './merge.js';
import Utils from './utils.js';
import { X, Y, V } from './sparkline-graph.js';
import SparklineSeries from './sparkline-series.js';
import StateTool from './state-tool.js';
import TextTool from './text-tool.js';
import { formatDateVeryShort } from './frontend_mods/common/datetime/format_date.ts';
import { formatTime } from './frontend_mods/common/datetime/format_time.ts';
import { formatDateTime } from './frontend_mods/common/datetime/format_date_time.ts';
import { formatNumericDuration } from './frontend_mods/common/datetime/format_duration.ts';
import { FONT_SIZE, SVG_DEFAULT_DIMENSIONS } from './const.js';

/**
 * Starting from the given index, increment the index until an array element with
 * a value property is found. Copied from the SAK sparkline tool so colorstops
 * behave the same way.
 *
 * @param {Array} stops - Colorstop list.
 * @param {number} startIndex - First index to inspect.
 * @returns {number} First index with a configured value.
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
 * Interpolates missing colorstop values. Copied from the SAK sparkline tool so
 * the FHS wrapper keeps the same colorstop semantics.
 *
 * @param {Array} stops - Colorstop list.
 * @returns {Array<object>} Colorstops with value on every stop.
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

    const leftValue = stops[leftValuedIndex].value;
    const rightValue = stops[rightValuedIndex].value;
    const m = (rightValue - leftValue) / (rightValuedIndex - leftValuedIndex);
    return {
      color: typeof stop === 'string' ? stop : stop.color,
      value: leftValue + m * (stopIndex - leftValuedIndex),
    };
  });
};

/**
 * Converts user colorstops into graph thresholds. Copied from the SAK sparkline
 * tool so smooth/stepped transitions keep the same behavior.
 *
 * @param {Array} stops - Colorstop list.
 * @param {string} type - Transition type.
 * @returns {Array<object>} Threshold list for SparklineGraph.computeGradient().
 */
const DEFAULT_COLORS = ['var(--theme-sys-color-primary)', '#3498db', '#e74c3c', '#9b59b6', '#f1c40f', '#2ecc71', '#1abc9c', '#34495e', '#e67e22', '#7f8c8d', '#27ae60', '#2980b9', '#8e44ad'];

// Available automatic axes per chart type. Visibility settings can hide an
// available axis, but cannot add an axis that has no meaning for that chart.
const CHART_AXES = {
  line: { x: true, y: true },
  area: { x: true, y: true },
  bar: { x: true, y: true },
  dots: { x: true, y: true },
  equalizer: { x: true, y: true },
  state_bands: { x: true, y: true },
  graded: { x: false, y: false },
  barcode: { x: true, y: false },
  radial: { x: true, y: true },
  radial_barcode: { x: true, y: false },
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
  }

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
};

/**
 * FHS layout sparkline graph tool.
 *
 * The tool binds Home Assistant entities, requests history, and renders the
 * resulting SVG through Lit. SparklineSeries coordinates the graph collection;
 * each SparklineGraph owns the geometry for one normalized series item.
 */
export default class SparklineGraphTool extends BaseTool {
  /** Returns the primary graph used by shared axes and pointer interaction. */
  get primaryGraph() {
    return this.sparklineSeries.primaryItem.graph;
  }

  get historyLoading() {
    return this.sparklineSeries.items.some((item) => item.historyLoading);
  }

  /**
   * Builds sparkline tool instances from layout.sparklines.
   *
   * @param {object} config - Full card configuration after static normalization.
   * @param {object} templates - Template resolver shared with the card.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance with shared render helpers.
   * @returns {Array<SparklineGraphTool>} Configured sparkline tools.
   */
  static setConfig(config, templates, cardId, card) {
    const sparklines = config.layout?.sparklines ?? [];

    return sparklines.map((sparklineConfig, index) => new SparklineGraphTool(sparklineConfig, index, templates, cardId, card));
  }

  /**
   * Stores static sparkline config and prepares the reused SAK graph engine.
   *
   * @param {object} config - Static sparkline item config.
   * @param {number} index - Sparkline index inside layout.sparklines.
   * @param {object} templates - Template resolver shared with the card.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance with shared render helpers.
   */
  constructor(config, index, templates, cardId, card) {
    const defaultConfig = {
      xpos: 50,
      ypos: 50,
      width: 25,
      height: 25,
      margin: 0,
      history: {
        period: 'rolling_window',
      },
      period: {
        type: 'calendar',
        group_by: 'interval',
        calendar: {
          period: 'day',
          offset: 0,
          duration: {
            hour: 24,
          },
          bins: {
            per_hour: 'auto',
            density: 'medium',
          },
        },
        rolling_window: {
          offset: 0,
        },
      },
      sparkline: {
        state_values: {
          logarithmic: false,
          value_factor: 0,
          aggregate_func: 'avg',
          smoothing: true,
        },
        line_color: [...DEFAULT_COLORS],
        colorstops: {
          colors: [],
        },
        colorstops_transition: 'smooth',
        dots: {
          radius: 2,
        },
        line: {
          line_width: 1,
          show_dots: false,
        },
        area: {
          show_dots: false,
        },
        bar: {
          orientation: 'vertical',
          background: {
            show: {
              item_style: 'none',
            },
            color: 'var(--divider-color)',
            colorstopsegments: {
              fill: true,
              stroke: false,
            },
            lineargradient: {
              fill: true,
              stroke: false,
            },
            colorstopgradient: {
              fill: true,
              stroke: false,
            },
            styles: {
              opacity: 0.2,
              rx: 0,
              ry: 0,
            },
          },
          foreground: {
            show: {
              item_style: "auto",
            },
            color: "var(--primary-color)",
            styles: { rx: 0, ry: 0 },
          },
        },
        equalizer: {
          value_buckets: 10,
          square: false,
          background: {
            show: {
              item_style: 'none',
            },
            color: 'var(--divider-color)',
            colorstopsegments: {
              fill: true,
              stroke: false,
            },
            lineargradient: {
              fill: true,
              stroke: false,
            },
            colorstopgradient: {
              fill: true,
              stroke: false,
            },
            styles: {
              opacity: 0.2,
              rx: 0,
              ry: 0,
            },
          },
        },
        graded: {
          square: false,
          background: {
            styles: {},
          },
          foreground: {
            styles: {},
          },
        },
        state_bands: {
          radius: 0.5,
          update_interval: '5min',
          styles: {
            'stroke-width': 0,
          },
          background: {
            padding: 0.75,
            connection_width: 0.375,
            styles: {
              opacity: 0.3,
            },
          },
        },
        radial: {
          rotate: 0,
          arc_degrees: 360,
          size: 50,
          background: {
            styles: {
              fill: 'var(--secondary-background-color)',
              stroke: 'var(--divider-color)',
              'stroke-width': 0.5,
              opacity: 0.3,
            },
          },
        },
        radial_barcode: {
          rotate: 0,
          arc_degrees: 360,
          size: 5,
          line_width: 0,
          face: {
            show_hour_marks: false,
            show_hour_numbers: false,
            hour_marks_count: 24,
          },
          background: {
            styles: {
              opacity: 0.3,
            },
          },
        },
        tooltip: {
          styles: {
            'font-size': '0.9em',
          },
        },
        day_night: {
          mode: 'background',
          position: 'bottom',
          size: 4,
          offset: 0,
          day: {
            styles: {
              fill: 'transparent',
            },
          },
          night: {
            styles: {
              fill: 'var(--divider-color)',
              'fill-opacity': 0.2,
            },
          },
        },
        legend: {
          position: 'top',
          width: 25,
          rows: 1,
          gap: 4,
          item_gap: 1,
          line_height: 1.2,
          marker_size: 1.5,
          styles: {
            fill: 'var(--primary-text-color)',
            'font-size': '0.55em',
            opacity: 0.8,
          },
        },
        show: {
          chart_type: 'line',
          chart_variant: 'line',
          background: true,
          day_night: false,
          points: false,
          line: true,
          area: false,
          grid: {
            x: false,
            y: false,
          },
          axis: {
            x: false,
            y: false,
          },
          tickmarks: {
            x: false,
            y: false,
          },
          labels: {
            x: false,
            y: false,
          },
          legend: false,
          xlabels_at: 'ticks_major',
          ylabels_at: 'ticks_major',
        },
      },
      x_axis: {
        axis: {
          styles: {
            stroke: 'color-mix(in srgb, var(--primary-text-color) 30%, var(--card-background-color))',
            'stroke-width': 1,
          },
        },
        ticks_major: {
          ticksize: 'auto',
        },
        ticks_minor: {
          ticksize: 'auto',
        },
        grid_major: {
          styles: {
            stroke: 'color-mix(in srgb, var(--primary-text-color) 6%, var(--card-background-color))',
            'stroke-width': 1,
          },
        },
        grid_minor: {
          styles: {
            stroke: 'color-mix(in srgb, var(--primary-text-color) 3%, var(--card-background-color))',
            'stroke-width': 1,
          },
        },
        tickmarks_major: {
          size: 1,
          styles: {
            stroke: 'color-mix(in srgb, var(--primary-text-color) 30%, var(--card-background-color))',
            'stroke-width': 1,
          },
        },
        tickmarks_minor: {
          size: 0.5,
          styles: {
            stroke: 'color-mix(in srgb, var(--primary-text-color) 18%, var(--card-background-color))',
            'stroke-width': 1,
          },
        },
        labels: {
          offset: 2,
          orientation: 'horizontal',
          styles: {
            fill: 'var(--primary-text-color)',
            'font-size': '0.5em',
            'text-anchor': 'middle',
            'dominant-baseline': 'hanging',
            opacity: 0.7,
          },
        },
      },
      y_axis: {
        axis: {
          styles: {
            stroke: 'color-mix(in srgb, var(--primary-text-color) 30%, var(--card-background-color))',
            'stroke-width': 1,
          },
        },
        ticks_major: {
          ticksize: 'auto',
        },
        ticks_minor: {
          ticksize: 'auto',
        },
        grid_major: {
          styles: {
            stroke: 'color-mix(in srgb, var(--primary-text-color) 6%, var(--card-background-color))',
            'stroke-width': 1,
          },
        },
        grid_minor: {
          styles: {
            stroke: 'color-mix(in srgb, var(--primary-text-color) 3%, var(--card-background-color))',
            'stroke-width': 1,
          },
        },
        tickmarks_major: {
          size: 1,
          styles: {
            stroke: 'color-mix(in srgb, var(--primary-text-color) 30%, var(--card-background-color))',
            'stroke-width': 1,
          },
        },
        tickmarks_minor: {
          size: 0.5,
          styles: {
            stroke: 'color-mix(in srgb, var(--primary-text-color) 18%, var(--card-background-color))',
            'stroke-width': 1,
          },
        },
        labels: {
          offset: 2,
          styles: {
            fill: 'var(--primary-text-color)',
            'font-size': '0.5em',
            'text-anchor': 'end',
            'dominant-baseline': 'middle',
            opacity: 0.7,
          },
        },
      },
      line: {
        styles: {
          fill: 'none',
          stroke: 'var(--primary-text-color)',
          'stroke-width': 1,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        },
      },
      area: {
        styles: {
          fill: 'var(--primary-color)',
          opacity: 0.25,
        },
      },
    };
    const normalizedConfig = Merge.mergeDeep({}, config);

    // Preserve the original real-time boolean while selecting its graph mode.
    if (normalizedConfig.period?.real_time === true) {
      normalizedConfig.period.type = 'real_time';
    }
    // Normalize supplied background style maps. Visibility and paint always
    // remain controlled by the explicit runtime show.item_style selector.
    ['bar', 'equalizer'].forEach((chartType) => {
      if (normalizedConfig.sparkline?.[chartType]?.background?.styles !== undefined) {
        normalizedConfig.sparkline[chartType].background.styles = ConfigHelper.toStyleDict(normalizedConfig.sparkline[chartType].background.styles);
      }
    });
    if (normalizedConfig.sparkline?.bar?.foreground?.styles !== undefined) {
      normalizedConfig.sparkline.bar.foreground.styles = ConfigHelper.toStyleDict(normalizedConfig.sparkline.bar.foreground.styles);
    }
    // Legacy booleans enabled or disabled both axes. Convert them once in the
    // configuration layer so rendering always receives explicit x/y values.
    ['grid', 'axis', 'tickmarks', 'labels'].forEach((layerName) => {
      const layerVisibility = normalizedConfig.sparkline?.show?.[layerName];
      if (typeof layerVisibility === 'boolean') {
        normalizedConfig.sparkline.show[layerName] = {
          x: layerVisibility,
          y: layerVisibility,
        };
      }
    });
    if (normalizedConfig.line?.styles !== undefined) {
      normalizedConfig.line.styles = ConfigHelper.toStyleDict(normalizedConfig.line.styles);
    }
    if (normalizedConfig.area?.styles !== undefined) {
      normalizedConfig.area.styles = ConfigHelper.toStyleDict(normalizedConfig.area.styles);
    }
    if (normalizedConfig.sparkline?.radial?.background?.styles !== undefined) {
      normalizedConfig.sparkline.radial.background.styles = ConfigHelper.toStyleDict(normalizedConfig.sparkline.radial.background.styles);
    }
    ['day', 'night'].forEach((periodName) => {
      if (normalizedConfig.sparkline?.day_night?.[periodName]?.styles !== undefined) {
        normalizedConfig.sparkline.day_night[periodName].styles = ConfigHelper.toStyleDict(normalizedConfig.sparkline.day_night[periodName].styles);
      }
    });
    if (normalizedConfig.sparkline?.state_bands?.styles !== undefined) {
      normalizedConfig.sparkline.state_bands.styles = ConfigHelper.toStyleDict(normalizedConfig.sparkline.state_bands.styles);
    }
    if (normalizedConfig.sparkline?.state_bands?.background?.styles !== undefined) {
      normalizedConfig.sparkline.state_bands.background.styles = ConfigHelper.toStyleDict(normalizedConfig.sparkline.state_bands.background.styles);
    }
    if (normalizedConfig.sparkline?.graded?.background?.styles !== undefined) {
      normalizedConfig.sparkline.graded.background.styles = ConfigHelper.toStyleDict(normalizedConfig.sparkline.graded.background.styles);
    }
    if (normalizedConfig.sparkline?.graded?.foreground?.styles !== undefined) {
      normalizedConfig.sparkline.graded.foreground.styles = ConfigHelper.toStyleDict(normalizedConfig.sparkline.graded.foreground.styles);
    }
    ['x_axis', 'y_axis'].forEach((axisName) => {
      ['axis', 'grid_major', 'grid_minor', 'tickmarks_major', 'tickmarks_minor', 'labels'].forEach((layerName) => {
        if (normalizedConfig[axisName]?.[layerName]?.styles !== undefined) {
          normalizedConfig[axisName][layerName].styles = ConfigHelper.toStyleDict(normalizedConfig[axisName][layerName].styles);
        }
      });
    });
    const sparklineConfig = Merge.mergeDeep(defaultConfig, normalizedConfig);

    const dayNightConfigurationUsesJavascript = templates.hasJavascriptTemplates({
      show: sparklineConfig.sparkline.show.day_night,
      day_night: sparklineConfig.sparkline.day_night,
      period: sparklineConfig.period,
    });
    if (!dayNightConfigurationUsesJavascript) {
      if (!['background', 'band'].includes(sparklineConfig.sparkline.day_night.mode)) {
        throw new Error('[sparklines] sparkline.day_night.mode must be background or band');
      }
      if (!['top', 'bottom'].includes(sparklineConfig.sparkline.day_night.position)) {
        throw new Error('[sparklines] sparkline.day_night.position must be top or bottom');
      }
      if (!Number.isFinite(Number(sparklineConfig.sparkline.day_night.size)) || Number(sparklineConfig.sparkline.day_night.size) <= 0) {
        throw new Error('[sparklines] sparkline.day_night.size must be greater than 0');
      }
      if (!Number.isFinite(Number(sparklineConfig.sparkline.day_night.offset))) {
        throw new Error('[sparklines] sparkline.day_night.offset must be a number');
      }
      if (sparklineConfig.sparkline.show.day_night && sparklineConfig.period.type === 'real_time') {
        throw new Error('[sparklines] show.day_night requires a calendar or rolling_window period');
      }
      if (sparklineConfig.sparkline.show.day_night && sparklineConfig.period.type === 'calendar' && Number(sparklineConfig.period.calendar.offset) > 0) {
        throw new Error('[sparklines] show.day_night does not support future calendar offsets');
      }
    }

    // Static radial values are validated now. JavaScript-backed values become
    // concrete in updateRuntimeConfig() and enter the same validation there.
    const chartType = sparklineConfig.sparkline.show.chart_type;
    if (["radial", "radial_barcode"].includes(chartType)) {
      const radialConfig = sparklineConfig.sparkline[chartType];
      const radialConfigurationUsesJavascript = templates.hasJavascriptTemplates({ radial: radialConfig });
      if (!radialConfigurationUsesJavascript) {
        if (chartType === "radial" && !["line", "area", "dots"].includes(sparklineConfig.sparkline.show.chart_variant)) {
          throw new Error("[sparklines] radial chart_variant must be line, area or dots");
        }
        if (!Number.isFinite(Number(radialConfig.arc_degrees)) || Number(radialConfig.arc_degrees) <= 0 || Number(radialConfig.arc_degrees) > 360) {
          throw new Error(`[sparklines] sparkline..arc_degrees must be greater than 0 and at most 360`);
        }
        if (!Number.isFinite(Number(radialConfig.rotate))) {
          throw new Error(`[sparklines] sparkline..rotate must be numeric`);
        }
        if (!Number.isFinite(Number(radialConfig.size)) || Number(radialConfig.size) <= 0) {
          throw new Error(`[sparklines] sparkline..size must be greater than 0`);
        }
      }
    }

    // The legend position determines its orientation. Top and bottom reserve a
    // horizontal row; left and right reserve a vertical column.
    if (sparklineConfig.sparkline.legend.position === 'left' || sparklineConfig.sparkline.legend.position === 'right') {
      sparklineConfig.sparkline.legend.orientation = 'vertical';
    } else {
      sparklineConfig.sparkline.legend.orientation = 'horizontal';
    }

    // Both historical period types expose the same automatic bin interface.
    // Keep 'auto' in the tool config; only buildGraphConfig resolves it for the engine.
    ['calendar', 'rolling_window'].forEach((periodType) => {
      if (sparklineConfig.period[periodType] === undefined) return;

      sparklineConfig.period[periodType].bins ??= {};
      sparklineConfig.period[periodType].bins.per_hour ??= 'auto';
      sparklineConfig.period[periodType].bins.density ??= 'medium';
      sparklineConfig.period[periodType].offset ??= 0;
    });

    // State-band labels live inside each categorical row. Apply their natural
    // left/top alignment and use hard color stops because each band is a discrete state.
    if (sparklineConfig.sparkline.show.chart_type === 'state_bands') {
      sparklineConfig.sparkline.colorstops_transition = 'hard';
      if (normalizedConfig.y_axis?.labels?.styles?.['text-anchor'] === undefined) {
        sparklineConfig.y_axis.labels.styles['text-anchor'] = 'start';
      }
      if (normalizedConfig.y_axis?.labels?.styles?.['dominant-baseline'] === undefined) {
        sparklineConfig.y_axis.labels.styles['dominant-baseline'] = 'hanging';
      }
    }
    // console.log('SparklineGraphTool constructor', sparklineConfig, defaultConfig, index, templates, cardId, card);

    const periodUsesJavascript = templates.hasJavascriptTemplates(sparklineConfig.period);
    super(sparklineConfig, index, templates, cardId, card, 'sparklines', 'sparklines', 0);

    // Existing YAML becomes one internal default series before any graph exists.
    this.sparklineSeries = new SparklineSeries(this.config);

    this.svg = this.calculateSvgDimensions();
    this.legendMeasuredFontSize = undefined;
    this.legendMeasuredRowHeight = undefined;
    this.legendMeasuredSignature = undefined;
    this.legendMeasurementConfigSignature = JSON.stringify({
      visible: this.config.sparkline.show.legend,
      config: this.config.sparkline.legend,
    });
    this.graphGeometryChanged = false;
    this.legendLayout = this.calculateLegendLayout();
    this.graphArea = this.legendLayout.graphArea;
    this.legendTextTools = [];
    this.legendTextSignature = undefined;
    this.configuredGraphMargin = this.svg.margin;
    this.axisMargin = { t: 0, r: 0, b: 0, l: 0, x: 0, y: 0 };
    this.axisGraphs = { primary: undefined, secondary: undefined };
    this.config.svg = this.svg;
    this.stateBandsStateMap = this.config.sparkline.state_map;
    this.gradeValues = [];
    this.gradeRanks = [];

    // A JavaScript-backed period becomes concrete during updateRuntimeConfig().
    // Static periods can create their graph immediately from the source config.
    this.historyDurationReady = false;
    if (!periodUsesJavascript) {
      const initialHistoryDuration = this.config.period.type === 'real_time' ? 1 : Number(this.config.period[this.config.period.type].duration.hour);
      this.historyDurationReady = this.config.period.type === 'real_time' || (Number.isFinite(initialHistoryDuration) && initialHistoryDuration > 0);
    }

    // Real-time charts render the current value directly and have no bins.
    // Historical charts coordinate one shared density across their series.
    const sharedBinsPerHour = this.historyDurationReady && this.config.period.type !== 'real_time' ? this.sparklineSeries.calculateSharedBinsPerHour() : undefined;
    this.graphConfig = this.historyDurationReady ? this.buildGraphConfig(this.config, sharedBinsPerHour) : undefined;
    if (this.historyDurationReady) {
      this.sparklineSeries.items.forEach((item) => {
        const graphConfig = this.buildGraphConfig(item.config, sharedBinsPerHour);
        this.sparklineSeries.createGraph(
          item,
          this.graphArea.width,
          this.graphArea.height,
          this.axisMargin,
          this.configuredGraphMargin,
          graphConfig,
          this.gradeValues,
          this.gradeRanks,
          graphConfig.sparkline.state_map ?? {},
        );
      });
    }
    this.graphReady = false;
    this.gradient = [];
    this.length = [];
    this.area = [];
    this.areaMinMax = [];
    this.line = [];
    this.bar = [];
    this.equalizer = [];
    this.points = [];
    this.barcodeChart = [];
    this.barcodeChartBackground = [];
    this.radialBarcodeChart = [];
    this.radialBarcodeChartBackground = [];
    this.graded = [];
    this.stateBands = [];
    this.radialBarcodeChartWidth = Utils.calculateSvgDimension(this.config.sparkline.radial_barcode.size);
    this.linePath = undefined;
    this.lineMinPath = undefined;
    this.lineMaxPath = undefined;
    this.areaPath = undefined;
    this.areaMinMaxPath = undefined;
    this.stats = {};
    this.tooltip = {};
    this.tooltipVisible = false;
    this.activePoint = undefined;
    this.activeX = undefined;
    this.dragging = false;
    this.elements = {};
    this.binBoundaryTimer = undefined;
    this.calendarRangeTimer = undefined;
    this.dayNightHistory = undefined;
    this.dayNightHistoryPromise = undefined;
    this.dayNightRangeStart = undefined;
    this.dayNightRangeEnd = undefined;
    this.dayNightPeriodSignature = JSON.stringify([this.config.sparkline.show.day_night, this.config.period]);
    this.dayNightSunSignature = undefined;
    this.dayNightResynchronizationRequested = false;
    this.dayNightSegments = [];
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.runtimeYScale = undefined;
    this.config.svg = this.svg;
  }

  /**
   * Converts FHS position and margin config into the dimensions expected by the
   * reused SAK graph engine.
   *
   * @param {object} config - Static or runtime sparkline config.
   * @returns {object} SVG dimensions for the outer placement and graph engine.
   */
  calculateSvgDimensions(config = this.config) {
    const coordinates = this.card.cardLayout.calculateSvgCoordinatesInGroup(config);
    const width = Utils.calculateSvgDimension(config.width);
    const height = Utils.calculateSvgDimension(config.height);
    const margin = this.calculateSparklineMargin(config.margin);
    const line_width = this.getConfiguredLineWidth(config);
    const column_spacing = Utils.calculateSvgDimension(config.sparkline[config.sparkline.show.chart_type]?.column_spacing || this.config.bar_spacing || 1);
    const row_spacing = Utils.calculateSvgDimension(config.sparkline[config.sparkline.show.chart_type]?.row_spacing || this.config.bar_spacing || 1);

    return {
      ...coordinates,
      width,
      height,
      line_width,
      x: coordinates.xpos - width / 2,
      y: coordinates.ypos - height / 2,
      margin,
      column_spacing,
      row_spacing,
    };
  }

  /**
   * Reads the active graph's line width from the same per-series config that
   * controls its chart type. The value is shared with the engine geometry and
   * the SVG mask so a wider line also reserves the correct visual extent.
   *
   * @param {object} config - Complete sparkline or per-series configuration.
   * @returns {number} Line width in SVG viewBox units.
   */
  getConfiguredLineWidth(config) {
    const chartType = config.sparkline.show.chart_type;
    const chartConfig = config.sparkline[chartType];
    const lineConfig = config.sparkline.line;
    const configuredLineWidth =
      chartConfig?.line_width !== undefined
        ? chartConfig.line_width
        : lineConfig?.line_width !== undefined
          ? lineConfig.line_width
          : chartConfig?.styles?.['stroke-width'] !== undefined
            ? chartConfig.styles['stroke-width']
            : lineConfig?.styles?.['stroke-width'];

    return configuredLineWidth === undefined ? 0 : Utils.calculateSvgDimension(configuredLineWidth);
  }

  /**
   * Reserves a sibling legend area and leaves the remaining rectangle to
   * SparklineGraph. Series count only divides the reserved area into slots.
   *
   * @returns {object} Legend and graph rectangles in the outer SVG viewBox.
   */
  calculateLegendLayout() {
    const legend = this.config.sparkline.legend;
    const horizontal = legend.orientation === 'horizontal';
    const gap = this.config.sparkline.show.legend ? Utils.calculateSvgDimension(legend.gap) : 0;
    const legendWidth = horizontal ? this.svg.width : Utils.calculateSvgDimension(legend.width);
    const legendFontSize = this.legendMeasuredFontSize ?? this.resolveLegendFontSize();
    const legendRowHeight = this.legendMeasuredRowHeight ?? legendFontSize * Number(legend.line_height);
    const markerRadius = Math.min(Utils.calculateSvgDimension(legend.marker_size), legendFontSize / 2);
    const legendRows = Number(legend.rows);
    const legendHeight = horizontal ? (legend.height === undefined ? legendRowHeight * legendRows : Utils.calculateSvgDimension(legend.height)) : this.svg.height;
    const legendArea = { x: 0, y: 0, width: 0, height: 0 };
    const graphArea = { x: 0, y: 0, width: this.svg.width, height: this.svg.height };

    if (this.config.sparkline.show.legend) {
      legendArea.width = legendWidth;
      legendArea.height = legendHeight;

      if (legend.position === 'top') {
        graphArea.y = legendHeight + gap;
        graphArea.height = this.svg.height - legendHeight - gap;
      } else if (legend.position === 'bottom') {
        graphArea.height = this.svg.height - legendHeight - gap;
        legendArea.y = graphArea.height + gap;
      } else if (legend.position === 'left') {
        graphArea.x = legendWidth + gap;
        graphArea.width = this.svg.width - legendWidth - gap;
      } else if (legend.position === 'right') {
        graphArea.width = this.svg.width - legendWidth - gap;
        legendArea.x = graphArea.width + gap;
      }
    }

    return {
      orientation: legend.orientation,
      markerRadius,
      legendArea,
      graphArea,
    };
  }

  /**
   * Converts the legend's CSS-like font-size into SVG viewBox units.
   * The same 12px base used by the card text tools keeps automatic legend
   * height aligned with the visible label font rather than with raw CSS pixels.
   *
   * @returns {number} Legend font size in SVG viewBox units.
   */
  resolveLegendFontSize() {
    const styles = ConfigHelper.toStyleDict(this.config.sparkline.legend.styles);
    const fontSize = styles['font-size'];
    const value = Number.parseFloat(fontSize);
    const fontSizePixels =
      typeof fontSize === 'number' ? value : fontSize.endsWith('em') || fontSize.endsWith('rem') ? value * FONT_SIZE : fontSize.endsWith('px') ? value : fontSize.endsWith('%') ? (value / 100) * FONT_SIZE : value;

    return fontSizePixels * (100 / SVG_DEFAULT_DIMENSIONS);
  }

  /**
   * Keeps SAK margin semantics in one sequential block for the graph engine.
   *
   * @param {number|object} marginConfig - Margin from sparkline config.
   * @returns {object} Margin object with t/r/b/l/x/y.
   */
  calculateSparklineMargin(marginConfig) {
    const margin = {};

    if (typeof marginConfig === 'object') {
      margin.t = Utils.calculateSvgDimension(marginConfig.t) || Utils.calculateSvgDimension(marginConfig.y) || 0;
      margin.b = Utils.calculateSvgDimension(marginConfig.b) || Utils.calculateSvgDimension(marginConfig.y) || 0;
      margin.r = Utils.calculateSvgDimension(marginConfig.r) || Utils.calculateSvgDimension(marginConfig.x) || 0;
      margin.l = Utils.calculateSvgDimension(marginConfig.l) || Utils.calculateSvgDimension(marginConfig.x) || 0;
      margin.x = margin.l;
      margin.y = margin.t;
    } else {
      margin.x = Utils.calculateSvgDimension(marginConfig);
      margin.y = margin.x;
      margin.t = margin.x;
      margin.r = margin.x;
      margin.b = margin.x;
      margin.l = margin.x;
    }

    return margin;
  }

  /**
   * Measures the space outside axisArea used by visible labels and tickmarks.
   * Configured graph margin is deliberately excluded: it belongs inside the
   * axes and only changes the later dataArea.
   *
   * @returns {object} Axis margins with t/r/b/l/x/y values.
   */
  calculateAxisMargin() {
    const chartAxes = CHART_AXES[this.config.sparkline.show.chart_type];
    const showXTickmarks = chartAxes.x && this.config.sparkline.show.tickmarks.x;
    const showXLabels = chartAxes.x && this.config.sparkline.show.labels.x;
    const xTickSize = showXTickmarks ? Utils.calculateSvgDimension(this.config.x_axis.tickmarks_major.size) : 0;
    const xLabelOffset = showXLabels ? Utils.calculateSvgDimension(this.config.x_axis.labels.offset) : 0;
    const xFontSize = this.resolveAxisFontSizePixels('x', FONT_SIZE);
    const yFontSize = this.resolveAxisFontSizePixels('y', FONT_SIZE);
    const xFontHeight = xFontSize;
    const yFontHeight = yFontSize * 0.85;
    const primaryGraph = this.axisGraphs.primary;
    const secondaryGraph = this.axisGraphs.secondary;
    const primaryChartAxes = primaryGraph !== undefined ? CHART_AXES[primaryGraph.config.sparkline.show.chart_type] : undefined;
    const secondaryChartAxes = secondaryGraph !== undefined ? CHART_AXES[secondaryGraph.config.sparkline.show.chart_type] : undefined;
    const primaryShowYTickmarks = primaryGraph !== undefined && primaryChartAxes.y && primaryGraph.config.sparkline.show.tickmarks.y;
    const secondaryShowYTickmarks = secondaryGraph !== undefined && secondaryChartAxes.y && secondaryGraph.config.sparkline.show.tickmarks.y;
    const primaryShowYLabels = primaryGraph !== undefined && primaryChartAxes.y && primaryGraph.config.sparkline.show.labels.y;
    const secondaryShowYLabels = secondaryGraph !== undefined && secondaryChartAxes.y && secondaryGraph.config.sparkline.show.labels.y;
    const primaryYTickSize = primaryShowYTickmarks ? Utils.calculateSvgDimension(primaryGraph.config.y_axis.tickmarks_major.size) : 0;
    const secondaryYTickSize = secondaryShowYTickmarks ? Utils.calculateSvgDimension(secondaryGraph.config.y_axis.tickmarks_major.size) : 0;
    const primaryYLabelOffset = primaryShowYLabels ? Utils.calculateSvgDimension(primaryGraph.config.y_axis.labels.offset) : 0;
    const secondaryYLabelOffset = secondaryShowYLabels ? Utils.calculateSvgDimension(secondaryGraph.config.y_axis.labels.offset) : 0;
    const primaryYLabels = primaryShowYLabels ? this.buildYAxisTicks('major', primaryGraph).map((tick) => tick.label) : [];
    const secondaryYLabels = secondaryShowYLabels ? this.buildYAxisTicks('major', secondaryGraph).map((tick) => tick.label) : [];
    const primaryYLabelWidth = primaryYLabels.reduce((length, label) => Math.max(length, label.length), 0) * yFontSize * 0.5;
    const secondaryYLabelWidth = secondaryYLabels.reduce((length, label) => Math.max(length, label.length), 0) * yFontSize * 0.5;
    let t = 0;
    let r = 0;
    let b = xTickSize;
    let l = 0;

    // X labels are outside axisArea. Endpoint label extents reserve outer
    // viewport space independently from both y-axis groups.
    if (showXLabels) {
      const xTicks = this.buildXAxisTicks('major');
      const firstLabelWidth = xTicks[0].label.length * xFontSize * 0.6;
      const lastLabelWidth = xTicks[xTicks.length - 1].label.length * xFontSize * 0.6;
      const xTextAnchor = this.config.x_axis.labels.styles['text-anchor'];
      const firstLabelLeftExtent = xTextAnchor === 'end' ? firstLabelWidth : xTextAnchor === 'start' ? 0 : firstLabelWidth / 2;
      const lastLabelRightExtent = xTextAnchor === 'start' ? lastLabelWidth : xTextAnchor === 'end' ? 0 : lastLabelWidth / 2;

      b = Math.max(b, xTickSize + xLabelOffset + xFontHeight);
      l = Math.max(l, firstLabelLeftExtent);
      r = Math.max(r, lastLabelRightExtent);
    }

    // Primary labels/ticks reserve the left side; secondary labels/ticks
    // reserve the right side. Both groups use the same axisArea.
    if (primaryShowYLabels && primaryGraph.config.sparkline.show.chart_type !== 'state_bands') {
      l = Math.max(l, primaryYTickSize + primaryYLabelOffset + primaryYLabelWidth);
      t = Math.max(t, yFontHeight / 2);
      b = Math.max(b, yFontHeight / 2);
    } else if (primaryShowYTickmarks) {
      l = Math.max(l, primaryYTickSize);
    }
    if (secondaryShowYLabels && secondaryGraph.config.sparkline.show.chart_type !== 'state_bands') {
      r = Math.max(r, secondaryYTickSize + secondaryYLabelOffset + secondaryYLabelWidth);
      t = Math.max(t, yFontHeight / 2);
      b = Math.max(b, yFontHeight / 2);
    } else if (secondaryShowYTickmarks) {
      r = Math.max(r, secondaryYTickSize);
    }

    return { t, r, b, l, x: l, y: t };
  }

  /**
   * Reserves equal outer space for radial ticks and labels. Polar geometry is
   * centered after this presentation margin is removed, so every renderer and
   * every series keeps the same center and radius.
   *
   * @param {object} axisGraphs - Primary and optional secondary scale graphs.
   * @returns {object} Symmetric radial margin.
   */
  calculateRadialAxisMargin(axisGraphs) {
    const show = this.config.sparkline.show;
    const chartAxes = CHART_AXES[show.chart_type];
    const xTickSize = chartAxes.x && show.tickmarks.x ? Utils.calculateSvgDimension(this.config.x_axis.tickmarks_major.size) : 0;
    const xLabelExtent =
      chartAxes.x && show.labels.x ? Utils.calculateSvgDimension(this.config.x_axis.labels.offset) + this.resolveAxisFontSizePixels('x', FONT_SIZE) : 0;
    const yGraphs = [axisGraphs.primary, axisGraphs.secondary].filter(
      (graph) => graph !== undefined && CHART_AXES[graph.config.sparkline.show.chart_type].y,
    );
    let yExtent = 0;

    yGraphs.forEach((graph) => {
      const yTickSize = graph.config.sparkline.show.tickmarks.y ? Utils.calculateSvgDimension(graph.config.y_axis.tickmarks_major.size) : 0;
      const yLabelExtent = graph.config.sparkline.show.labels.y
        ? Utils.calculateSvgDimension(graph.config.y_axis.labels.offset) +
          this.buildYAxisTicks('major', graph).reduce((width, tick) => Math.max(width, tick.label.length), 0) * this.resolveAxisFontSizePixels('y', FONT_SIZE) * 0.5
        : 0;
      yExtent = Math.max(yExtent, yTickSize + yLabelExtent);
    });

    const extent = Math.max(xTickSize + xLabelExtent, yExtent);
    return { t: extent, r: extent, b: extent, l: extent, x: extent, y: extent };
  }

  /**
   * Builds the config object consumed by SparklineGraph without changing the
   * engine's expected naming.
   *
   * @param {object} config - Sparkline layout config.
   * @param {number|undefined} sharedBinsPerHour - Coordinator-resolved bin density shared by all items.
   * @returns {object} Engine config.
   */
  buildGraphConfig(config, sharedBinsPerHour = undefined) {
    // Every series is projected onto the parent sparkline's visible period.
    // Its own offset only selects source history; the graph engine receives
    // plot-time boundaries so all series share the x-axis exactly.
    const period = Merge.mergeDeep({}, this.config.period);
    const graphType = config.sparkline.show.chart_type;
    const comparesCalendarDays = period.type === 'calendar' && this.sparklineSeries.items.some((item) => Number(item.config.period.calendar.offset) !== Number(this.config.period.calendar.offset));

    // A comparison needs one complete shared day. Without it, an offset series
    // is correctly projected but is clipped at the current time of day.
    if (comparesCalendarDays) period.calendar.full_day = true;
    const sparkline =
      graphType === 'state_bands'
        ? {
            ...config.sparkline,
            state_map: this.stateBandsStateMap,
          }
        : config.sparkline;
    const yAxis = Merge.mergeDeep({}, config.y_axis);

    // Real-time bar and equalizer graphs represent one value against the scale
    // owned by their color stops. Pass those concrete bounds to the graph
    // engine before it calculates coordinates, ticks, and labels.
    const defaultColorStopScale = config.sparkline.colorstops?.scales?.default;
    if (period.type === 'real_time' && ['bar', 'equalizer'].includes(graphType) && defaultColorStopScale !== undefined) {
      yAxis.lower_bound = Number(defaultColorStopScale.min);
      yAxis.upper_bound = Number(defaultColorStopScale.max);
    }

    // SparklineGraph only receives numeric bins. State bands use exact
    // transitions and retain one neutral internal point interval.
    if (period.type !== 'real_time') {
      period[period.type].bins.per_hour = graphType === 'state_bands' ? 1 : (sharedBinsPerHour ?? this.sparklineSeries.calculateBinsPerHour(config));
    }

    return {
      width: this.graphArea.width,
      height: this.graphArea.height,
      geometry: {
        line_width: this.getConfiguredLineWidth(config),
        column_spacing: this.svg.column_spacing,
      },
      period,
      sparkline,
      x_axis: {
        ...config.x_axis,
        labels: {
          ...config.x_axis.labels,
          max_length: this.xAxisLabelLength,
        },
      },
      y_axis: yAxis,
    };
  }

  /** Updates graph configuration and geometry before entity data is assigned. */
  updateRuntimeConfig() {
    super.updateRuntimeConfig();

    // Configuration activates a new graph contract. Keep this pending while a
    // larger history range loads, so its replacement graphs are created only
    // after the matching data has arrived.
    if (this.configChanged) this.graphGeometryChanged = true;

    // Runtime controls can change radial appearance, arc and rotation. Validate
    // the evaluated values before series coordination creates graph engines.
    if (this.configChanged) {
      const chartType = this.config.sparkline.show.chart_type;
      if (["radial", "radial_barcode"].includes(chartType)) {
        const radialConfig = this.config.sparkline[chartType];
        if (chartType === "radial" && !["line", "area", "dots"].includes(this.config.sparkline.show.chart_variant)) {
          throw new Error("[sparklines] radial chart_variant must be line, area or dots");
        }
        if (!Number.isFinite(Number(radialConfig.arc_degrees)) || Number(radialConfig.arc_degrees) <= 0 || Number(radialConfig.arc_degrees) > 360) {
          throw new Error(`[sparklines] sparkline..arc_degrees must be greater than 0 and at most 360`);
        }
        if (!Number.isFinite(Number(radialConfig.rotate))) {
          throw new Error(`[sparklines] sparkline..rotate must be numeric`);
        }
        if (!Number.isFinite(Number(radialConfig.size)) || Number(radialConfig.size) <= 0) {
          throw new Error(`[sparklines] sparkline..size must be greater than 0`);
        }
      }

      this.config.sparkline.day_night.day.styles = ConfigHelper.toStyleDict(this.config.sparkline.day_night.day.styles);
      this.config.sparkline.day_night.night.styles = ConfigHelper.toStyleDict(this.config.sparkline.day_night.night.styles);
      if (!['background', 'band'].includes(this.config.sparkline.day_night.mode)) {
        throw new Error('[sparklines] sparkline.day_night.mode must be background or band');
      }
      if (!['top', 'bottom'].includes(this.config.sparkline.day_night.position)) {
        throw new Error('[sparklines] sparkline.day_night.position must be top or bottom');
      }
      if (!Number.isFinite(Number(this.config.sparkline.day_night.size)) || Number(this.config.sparkline.day_night.size) <= 0) {
        throw new Error('[sparklines] sparkline.day_night.size must be greater than 0');
      }
      if (!Number.isFinite(Number(this.config.sparkline.day_night.offset))) {
        throw new Error('[sparklines] sparkline.day_night.offset must be a number');
      }
      if (this.config.sparkline.show.day_night && this.config.period.type === 'real_time') {
        throw new Error('[sparklines] show.day_night requires a calendar or rolling_window period');
      }
      if (this.config.sparkline.show.day_night && this.config.period.type === 'calendar' && Number(this.config.period.calendar.offset) > 0) {
        throw new Error('[sparklines] show.day_night does not support future calendar offsets');
      }

      const activeDayNightPeriodSignature = JSON.stringify([this.config.sparkline.show.day_night, this.config.period]);
      if (activeDayNightPeriodSignature !== this.dayNightPeriodSignature) {
        this.dayNightHistory = undefined;
        this.dayNightRangeStart = undefined;
        this.dayNightRangeEnd = undefined;
        this.dayNightSegments = [];
        this.dayNightResynchronizationRequested = this.config.sparkline.show.day_night;
        this.dayNightPeriodSignature = activeDayNightPeriodSignature;
      }
      if (!this.config.sparkline.show.day_night) {
        this.dayNightHistory = undefined;
        this.dayNightRangeStart = undefined;
        this.dayNightRangeEnd = undefined;
        this.dayNightSegments = [];
        this.dayNightResynchronizationRequested = false;
      }
    }

    // A calendar day always spans at least one complete day. A duration can
    // still contain 6 or 12 hours after switching from a rolling window, so
    // normalize that transition before history and graph geometry consume it.
    if (this.configChanged && this.config.period.type === 'calendar' && this.config.period.calendar.period === 'day' && Number(this.config.period.calendar.duration.hour) < 24) {
      const requestedDuration = this.config.period.calendar.duration.hour;
      this.config.period.calendar.duration.hour = 24;
      console.warn(`[FHS sparkline] calendar day duration '${requestedDuration}' hours is shorter than one day; using 24 hours`);
    }

    // Dynamic JavaScript templates can return a boolean again after the initial
    // config pass. Normalize it to the x/y shape consumed by the graph renderer.
    ['grid', 'axis', 'tickmarks', 'labels'].forEach((layerName) => {
      const layerVisibility = this.config.sparkline.show[layerName];
      if (typeof layerVisibility === 'boolean') {
        this.config.sparkline.show[layerName] = {
          x: layerVisibility,
          y: layerVisibility,
        };
      }
    });
    // Bar and equalizer backgrounds use the same explicit item-style selector
    // and color-stop paint dictionaries as the other FHS layout items.
    if (this.configChanged) {
      ['bar', 'equalizer'].forEach((chartType) => {
        const background = this.config.sparkline[chartType].background;
        const itemStyle = background.show.item_style;

        background.styles = ConfigHelper.toStyleDict(background.styles);
        if (!['none', 'fixed', 'colorstopsegments', 'lineargradient', 'colorstopgradient'].includes(itemStyle)) {
          throw new Error(`[sparklines] sparkline.${chartType}.background.show.item_style must be none, fixed, colorstopsegments, lineargradient or colorstopgradient`);
        }
        if (itemStyle === 'colorstopsegments' || itemStyle === 'lineargradient' || itemStyle === 'colorstopgradient') {
          if (typeof background[itemStyle].fill !== 'boolean' || typeof background[itemStyle].stroke !== 'boolean') {
            throw new Error(`[sparklines] sparkline.${chartType}.background.${itemStyle}.fill and stroke must be boolean`);
          }
        }
      });
      if (this.config.sparkline.show.chart_type === "bar") {
        if (!['horizontal', 'vertical'].includes(this.config.sparkline.bar.orientation)) {
          throw new Error('[sparklines] sparkline.bar.orientation must be horizontal or vertical');
        }
        const foreground = this.config.sparkline.bar.foreground;
        if (!["auto", "none", "fixed", "colorstopsegments", "colorstopgradient"].includes(foreground.show.item_style)) {
          throw new Error("[sparklines] sparkline.bar.foreground.show.item_style must be auto, none, fixed, colorstopsegments or colorstopgradient");
        }
        foreground.styles = ConfigHelper.toStyleDict(foreground.styles);
      }
    }

    // Each configured side fixes that edge of the visible range. The series
    // coordinator calculates the omitted edge from the active graph data.
    if (this.configChanged) {
      const hasLowerBound = this.config.y_axis.lower_bound !== undefined;
      const hasUpperBound = this.config.y_axis.upper_bound !== undefined;

      if (hasLowerBound && !Number.isFinite(Number(this.config.y_axis.lower_bound))) {
        throw new Error('[sparklines] y_axis.lower_bound must be numeric');
      }
      if (hasUpperBound && !Number.isFinite(Number(this.config.y_axis.upper_bound))) {
        throw new Error('[sparklines] y_axis.upper_bound must be numeric');
      }
      if (hasLowerBound && hasUpperBound && Number(this.config.y_axis.lower_bound) >= Number(this.config.y_axis.upper_bound)) {
        throw new Error('[sparklines] y_axis.lower_bound must be smaller than y_axis.upper_bound');
      }
    }

    // A single real-time value cannot produce a meaningful automatic range.
    // Bar and equalizer therefore require the active color-stop template to
    // publish the numeric scale used to render their current-value height.
    if (this.configChanged && this.config.period.type === "real_time" && ["bar", "equalizer"].includes(this.config.sparkline.show.chart_type)) {
      const colorStopScale = this.config.sparkline.colorstops.scales?.default;
      const hasYAxisBounds = this.config.y_axis.lower_bound !== undefined && this.config.y_axis.upper_bound !== undefined;

      // A current-value graph needs a numeric range for its height. That range
      // can come from color stops or directly from the configured y axis.
      if (colorStopScale === undefined && !hasYAxisBounds) {
        throw new Error(`[sparklines] real-time ${this.config.sparkline.show.chart_type} requires color_stops.scales.default or y_axis.lower_bound and y_axis.upper_bound`);
      }
      if (colorStopScale !== undefined && (colorStopScale.min === undefined || colorStopScale.max === undefined)) {
        throw new Error(`[sparklines] real-time ${this.config.sparkline.show.chart_type} requires color_stops.scales.default.min and max`);
      }
    }

    // Historical tools remain inactive until a dynamic duration provides a
    // finite positive range. Real-time tools have no history duration.
    const historyDuration = this.config.period.type === 'real_time' ? 1 : Number(this.config.period[this.config.period.type].duration.hour);
    this.historyDurationReady = this.config.period.type === 'real_time' || (Number.isFinite(historyDuration) && historyDuration > 0);

    if (this.card.dev.debug && this.configChanged) {
      console.log('[FHS sparkline runtime period]', {
        cardId: this.cardId,
        sparklineId: this.config.id,
        periodType: this.config.period.type,
        durationHours: this.config.period.type === 'rolling_window' ? this.config.period.rolling_window.duration.hour : this.config.period.calendar.duration.hour,
        historyResynchronizationRequested: this.sparklineSeries.primaryItem.historyResynchronizationRequested,
      });
    }

    // Keep the accepted graph geometry and paths unchanged until the requested
    // larger history range has arrived. Rebuilding here would stretch the old
    // samples over the new period before that data exists.
    if (this.sparklineSeries.primaryItem.preserveGraphWhileHistoryLoads) return;

    // Determine the longest label produced by Home Assistant for the active locale.
    const localeKey = JSON.stringify([this.card._hass.locale, this.card._hass.config.time_zone]);

    if (this.xAxisLabelLocaleKey !== localeKey) {
      const locale = this.card._hass.locale;
      const hassConfig = this.card._hass.config;
      const labelLengths = [];

      for (let month = 0; month < 12; month += 1) {
        const date = new Date(Date.UTC(2025, month, 21, 12, 21));
        labelLengths.push(formatDateVeryShort(date, locale, hassConfig).replace(/\s/g, '').length);
      }

      for (let hour = 0; hour < 24; hour += 1) {
        const time = new Date(Date.UTC(2025, 6, 21, hour, 21));
        labelLengths.push(formatTime(time, locale, hassConfig).replace(/\s/g, '').length);
      }

      this.xAxisLabelLength = Math.max(...labelLengths);
      this.xAxisLabelLocaleKey = localeKey;
      this.graphGeometryChanged = true;
    }

    // State and history updates reuse the existing graph engines. Only an
    // activated config, locale-dependent label change or measured legend size
    // changes their configuration and available drawing area.
    if (!this.graphGeometryChanged) return;

    if (this.config.sparkline.show.chart_type === 'state_bands') {
      const entity = this.card.entities[this.entity_index];
      const entityConfig = this.card.resolvedEntityConfigs[this.entity_index];
      this.stateBandsStateMap = {
        ...this.config.sparkline.state_map,
        map: this.config.sparkline.state_map.map.map((entry) => {
          const state = String(entry.state ?? entry.value);
          const displayLabel = entityConfig.attribute !== undefined ? this.card._hass.formatEntityAttributeValue(entity, entityConfig.attribute, state) : this.card._hass.formatEntityState(entity, state);

          return {
            ...entry,
            display_label: entry.label ?? displayLabel,
          };
        }),
      };
    }

    this.svg = this.calculateSvgDimensions(this.config);
    const legendMeasurementConfigSignature = JSON.stringify({
      visible: this.config.sparkline.show.legend,
      config: this.config.sparkline.legend,
    });
    if (legendMeasurementConfigSignature !== this.legendMeasurementConfigSignature) {
      this.legendMeasuredFontSize = undefined;
      this.legendMeasuredRowHeight = undefined;
      this.legendMeasuredSignature = undefined;
      this.legendMeasurementConfigSignature = legendMeasurementConfigSignature;
    }
    this.legendLayout = this.calculateLegendLayout();
    this.graphArea = this.legendLayout.graphArea;
    this.configuredGraphMargin = this.svg.margin;
    this.config.svg = this.svg;

    // Runtime templates can change shared sparkline settings. Each existing
    // series receives one effective config while its runtime data stays intact.
    this.sparklineSeries.updateConfig(this.config);

    // A period belongs to each history source. When a runtime template changes
    // one offset, only that source is invalidated; the shared plot period stays
    // intact and the other series retain their accepted history.
    if (this.configChanged) {
      let anyHistoryPeriodChanged = false;

      this.sparklineSeries.items.forEach((item) => {
        const activeHistoryPeriodSignature = JSON.stringify(item.config.period);
        const historyPeriodChanged = activeHistoryPeriodSignature !== item.historyPeriodSignature;
        if (historyPeriodChanged) anyHistoryPeriodChanged = true;

        if (historyPeriodChanged && (item.historySeries || item.historyPromise)) {
          item.historyResynchronizationRequested = true;

          if (this.historyDurationReady && !this.acceptedHistoryContainsRange(item, this.getHistoryRange(item))) {
            item.historyLoading = true;
            item.preserveGraphWhileHistoryLoads = item.historySeries !== undefined;
            this.clearTooltip();
          } else {
            item.historyLoading = false;
            item.preserveGraphWhileHistoryLoads = false;
          }
        }
        item.historyPeriodSignature = activeHistoryPeriodSignature;
      });
      if (anyHistoryPeriodChanged) {
        window.clearTimeout(this.binBoundaryTimer);
        window.clearTimeout(this.calendarRangeTimer);
      }
    }

    if (!this.historyDurationReady) {
      window.clearTimeout(this.binBoundaryTimer);
      window.clearTimeout(this.calendarRangeTimer);
      this.sparklineSeries.items.forEach((item) => {
        item.historyLoading = false;
        item.preserveGraphWhileHistoryLoads = false;
        item.rows = [];
      });
      this.graphConfig = undefined;
      this.sparklineSeries.clearGraphs();
      this.graphReady = false;
      this.stats = {};
      this.clearTooltip();
      this.graphGeometryChanged = false;
      return;
    }

    // Graded charts use color-stop ranks as their fixed vertical buckets.
    this.gradeValues = [];
    this.config.sparkline.colorstops.colors.map((value, index) => (this.gradeValues[index] = value.value));

    this.gradeRanks = [];
    this.config.sparkline.colorstops.colors.map((value, index) => {
      const rankIndex = this.config.sparkline.show.chart_variant === 'rank_order' && value.rank !== undefined ? value.rank : index;

      if (!this.gradeRanks[rankIndex]) {
        this.gradeRanks[rankIndex] = {
          value: [],
          rangeMin: [],
          rangeMax: [],
        };
      }

      this.gradeRanks[rankIndex].rank = rankIndex;
      this.gradeRanks[rankIndex].color = value.color;
      this.gradeRanks[rankIndex].value.push(value.value);
      this.gradeRanks[rankIndex].rangeMin.push(value.value);
      this.gradeRanks[rankIndex].rangeMax.push(this.config.sparkline.colorstops.colors[index + 1]?.value ?? Infinity);
      return true;
    });
    // Real-time charts render the current value directly and have no bins.
    // Historical charts coordinate one shared density across their series.
    const sharedBinsPerHour = this.historyDurationReady && this.config.period.type !== 'real_time' ? this.sparklineSeries.calculateSharedBinsPerHour() : undefined;
    this.graphConfig = this.buildGraphConfig(this.config, sharedBinsPerHour);
    this.sparklineSeries.items.forEach((item) => {
      const graphConfig = this.buildGraphConfig(item.config, sharedBinsPerHour);
      this.sparklineSeries.createGraph(
        item,
        this.graphArea.width,
        this.graphArea.height,
        this.axisMargin,
        this.configuredGraphMargin,
        graphConfig,
        this.gradeValues,
        this.gradeRanks,
        graphConfig.sparkline.state_map ?? {},
      );
    });
    this.graphReady = false;
    this.graphGeometryChanged = false;
  }

  /**
   * Binds every normalized source to its coordinator item. The following
   * history-loop step consumes each bound item independently.
   *
   * @param {Array<object>} entityConfigs - Active entity configurations.
   * @param {Array<object>} entities - Current Home Assistant entity states.
   */
  setEntities(entityConfigs, entities) {
    this.sparklineSeries.items.forEach((item) => {
      item.entity = entities[item.entity_index];
      item.entityConfig = entityConfigs[item.entity_index];
    });

    const primaryItem = this.sparklineSeries.primaryItem;
    super.setState(primaryItem.entity, primaryItem.entityConfig);

    // A series item owns all history associated with its current source. Apply
    // the same reset and data selection to implicit and explicit items.
    let sourceEntityChanged = false;
    this.sparklineSeries.items.forEach((item) => {
      const realTime = item.config.period.type === 'real_time';
      const historyEntityChanged = item.historyEntityId !== undefined && item.historyEntityId !== item.entity.entity_id;
      item.historyEntityId = item.entity.entity_id;

      if (historyEntityChanged) {
        sourceEntityChanged = true;
        item.historySeries = undefined;
        item.rows = [];
        item.stats = {};
        item.historyRangeStart = undefined;
        item.historyRangeEnd = undefined;
        item.historyRefreshAt = 0;
        item.historyResynchronizationRequested = !realTime;
        item.historyLoading = !realTime && this.historyDurationReady;
        item.preserveGraphWhileHistoryLoads = false;
      }

      if (realTime) {
        item.rows = [{ state: this.getEntityNumericState(item, item.entity) }];
      } else if (!this.historyDurationReady) {
        item.rows = [];
      } else if (item.historySeries && !item.preserveGraphWhileHistoryLoads) {
        item.rows = item.historySeries;
      } else {
        item.rows = [];
      }
    });

    if (sourceEntityChanged) {
      window.clearTimeout(this.binBoundaryTimer);
      window.clearTimeout(this.calendarRangeTimer);
      this.stats = {};
      this.clearTooltip();
    }

    const historicalItems = this.sparklineSeries.items.filter((item) => item.config.period.type !== 'real_time');
    if (historicalItems.length === 0) {
      window.clearTimeout(this.binBoundaryTimer);
      window.clearTimeout(this.calendarRangeTimer);
    }

    if (this.sparklineSeries.items.some((item) => item.rows.length > 0)) {
      this.updateGraphFromSeries();
      if (this.tooltipVisible && this.pointerEvent) {
        this.updateActivePointer(this.pointerEvent);
      }
    }

    historicalItems.forEach((item) => this.fetchHistoryIfNeeded(item));
    if (this.config.sparkline.show.day_night) {
      const sunEntity = this.card._hass.states['sun.sun'];
      const sunSignature = JSON.stringify([
        sunEntity.state,
        sunEntity.last_changed,
        sunEntity.attributes.next_rising,
        sunEntity.attributes.next_setting,
      ]);
      if (sunSignature !== this.dayNightSunSignature) {
        this.dayNightSunSignature = sunSignature;
        if (this.dayNightHistory !== undefined) {
          const dayNightRange = this.getDayNightRange();
          if (dayNightRange.sourceRangeIsActive) {
            this.dayNightHistory.push({
              state: sunEntity.state,
              last_changed: sunEntity.last_changed,
            });
          }
          this.buildDayNightSegments(sunEntity);
        }
      }
      this.fetchDayNightHistoryIfNeeded(sunEntity);
    }
    if (historicalItems.length > 0 && historicalItems.every((item) => !item.preserveGraphWhileHistoryLoads)) {
      this.scheduleBinBoundaryRefresh();
      this.scheduleCalendarRangeRefresh();
    }
    this.updateLegendTextTools();
  }

  /**
   * Prunes one active history source to its bucket-aligned graph window. One
   * preceding row remains because its state is active at the first visible bin.
   *
   * @param {object} item - Series item that owns the history and graph.
   * @returns {object} Start and end timestamps used for visible statistics.
   */
  pruneLiveHistoryToActiveWindow(item) {
    const bucketMs = (60 / item.graph.points) * 60 * 1000;
    const now = Date.now();
    const periodHours = item.config.period.type === 'rolling_window' ? item.config.period.rolling_window.duration.hour : item.config.period.calendar.duration.hour;
    const rangeStart =
      item.config.sparkline.show.chart_type === 'state_bands'
        ? this.getHistoryRange(item).start.getTime()
        : item.config.period.type === 'rolling_window'
          ? Math.floor(now / bucketMs) * bucketMs + bucketMs - periodHours * 60 * 60 * 1000
          : this.getHistoryRange(item).start.getTime();
    const sortedSeries = item.historySeries.concat().sort((a, b) => new Date(a.last_changed).getTime() - new Date(b.last_changed).getTime());
    let precedingRow;
    const activeRows = [];

    sortedSeries.forEach((row) => {
      if (new Date(row.last_changed).getTime() < rangeStart) {
        precedingRow = row;
      } else {
        activeRows.push(row);
      }
    });

    item.historySeries = precedingRow ? [precedingRow, ...activeRows] : activeRows;
    item.rows = item.historySeries;

    return {
      start: rangeStart,
      end: now,
    };
  }

  /**
   * Advances active history charts when wall-clock time enters a new bucket.
   * No history is fetched here: the graph carries its last value into the new
   * bucket, recalculates local statistics, and lets the card's normal hass
   * pipeline propagate those statistics to tools that reference them.
   */
  scheduleBinBoundaryRefresh() {
    window.clearTimeout(this.binBoundaryTimer);
    const sourceRangeIsActive = this.sparklineSeries.items.some((item) => item.config.period.type !== 'real_time' && this.getHistoryRange(item).sourceRangeIsActive);

    // Only an active source range needs an advancing visible bucket. Offset
    // sources are complete comparison data and remain unchanged between fetches.
    if (!sourceRangeIsActive) return;

    if (!this.entity) return;

    // State bands have no buckets. Their timer only advances the exact current
    // data end; all other chart types retain their normal bin-boundary timing.
    const bucketMs = this.config.sparkline.show.chart_type === 'state_bands' ? this.getRefreshIntervalMs(this.config.sparkline.state_bands.update_interval) : (60 / this.primaryGraph.points) * 60 * 1000;
    const now = Date.now();
    const delay = bucketMs - (now % bucketMs) + 10;

    this.binBoundaryTimer = window.setTimeout(() => {
      // Advancing time creates the new graph bucket. SparklineGraph carries the
      // previous value visually across an empty bucket, but historySeries must
      // remain unchanged until Home Assistant supplies a real state update.

      this.updateGraphFromSeries();
      if (this.tooltipVisible && this.pointerEvent) {
        this.updateActivePointer(this.pointerEvent);
      }
      // A bin boundary advances the in-memory graph without fetching history.
      // Refresh local statistics and their bound tools from the recalculated series.
      if (this.config.sparkline.show.day_night && this.dayNightHistory !== undefined) {
        this.buildDayNightSegments(this.card._hass.states['sun.sun']);
      }
      this.card.cardEntities.updateSparklineEntities(this.card.resolvedEntityConfigs, this.card.entities, this.card.cardTools.getBySection('sparklines'));
      this.card.setHass(this.card._hass);
      this.scheduleBinBoundaryRefresh();
    }, delay);
  }

  /**
   * Schedules the next calendar range check at local midnight. The callback
   * recalculates from the current local date because suspended browsers may run
   * it later than the originally scheduled transition.
   */
  scheduleCalendarRangeRefresh() {
    window.clearTimeout(this.calendarRangeTimer);

    if (this.config.period.type !== 'calendar') return;

    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);
    const delay = nextMidnight.getTime() - now.getTime() + 10;

    this.calendarRangeTimer = window.setTimeout(() => {
      this.sparklineSeries.items.forEach((item) => {
        const range = this.getHistoryRange(item);
        const rangeChanged = range.start.getTime() !== item.historyRangeStart || range.end.getTime() !== item.historyRangeEnd;

        if (rangeChanged && item.historyPromise) {
          item.historyPromise.finally(() => this.fetchHistoryIfNeeded(item));
        } else if (rangeChanged) {
          this.fetchHistoryIfNeeded(item);
        }
      });
      if (this.config.sparkline.show.day_night) {
        const dayNightRange = this.getDayNightRange();
        const dayNightRangeChanged = dayNightRange.start.getTime() !== this.dayNightRangeStart || dayNightRange.end.getTime() !== this.dayNightRangeEnd;
        if (dayNightRangeChanged) this.fetchDayNightHistoryIfNeeded(this.card._hass.states['sun.sun']);
      }
      this.scheduleCalendarRangeRefresh();
    }, delay);
  }

  /**
   * Stops timers owned by this sparkline tool when its parent card disconnects.
   */
  disconnected() {
    window.clearTimeout(this.binBoundaryTimer);
    window.clearTimeout(this.calendarRangeTimer);
  }

  /**
   * Marks existing history for resynchronization when a reused card returns to
   * the DOM. The next normal Home Assistant state pass performs the fetch.
   */
  connected() {
    this.sparklineSeries.items.forEach((item) => {
      const sourceRangeIsActive = item.config.period.type !== 'real_time' && this.getHistoryRange(item).sourceRangeIsActive;
      if (item.historySeries && sourceRangeIsActive) item.historyResynchronizationRequested = true;
    });
    if (this.config.sparkline.show.day_night && this.dayNightHistory !== undefined) this.dayNightResynchronizationRequested = true;
  }

  /** Marks existing history for resynchronization after an HA reconnect. */
  hassConnected() {
    this.connected();
  }

  /**
   * Reports whether reconnect handling requires the next setHass pass.
   *
   * @returns {boolean} True when existing history must be fetched again.
   */
  requiresHassUpdate() {
    return this.dayNightResynchronizationRequested || this.sparklineSeries.items.some((item) => item.historyResynchronizationRequested);
  }

  /**
   * Parses the SAK-style interval used by history resynchronization and state-band refreshes.
   *
   * @param {string|number} interval - Configured SAK-style interval.
   * @returns {number} Refresh interval in milliseconds.
   */
  getRefreshIntervalMs(interval) {
    if (typeof interval === 'number') return interval * 1000;

    const match = interval.match(/^(\d+(?:\.\d+)?)(ms|s|sec|m|min|h|hour)$/);
    const value = Number(match[1]);
    const unit = match[2];

    if (unit === 'ms') return value;
    if (unit === 's' || unit === 'sec') return value * 1000;
    if (unit === 'm' || unit === 'min') return value * 60 * 1000;
    return value * 60 * 60 * 1000;
  }

  /**
   * Returns the parent plot range used by the one shared day/night layer.
   * Individual comparison-series offsets deliberately do not select another
   * sun timeline.
   *
   * @returns {object} Visible start/end and active-range state.
   */
  getDayNightRange() {
    const range = this.getHistoryRange({ config: this.config });
    return {
      start: range.plotStart,
      end: range.plotEnd,
      sourceRangeIsActive: range.sourceRangeIsActive,
    };
  }

  /**
   * Converts historical horizon states and the current Sun forecast into
   * continuous, clipped day/night periods. Forecast attributes are only used
   * for the remaining part of the active calendar day.
   *
   * @param {object} sunEntity - Current Home Assistant sun.sun state.
   */
  buildDayNightSegments(sunEntity) {
    const range = this.getDayNightRange();
    const rangeStart = range.start.getTime();
    const rangeEnd = range.end.getTime();
    const horizonStates = this.dayNightHistory.map((row) => ({
      state: row.state === 'above_horizon' ? 'day' : 'night',
      time: new Date(row.last_changed).getTime(),
    }));

    if (range.sourceRangeIsActive) {
      horizonStates.push({
        state: sunEntity.state === 'above_horizon' ? 'day' : 'night',
        time: new Date(sunEntity.last_changed).getTime(),
      });
    }

    if (this.config.period.type === 'calendar' && Number(this.config.period.calendar.offset) === 0) {
      horizonStates.push(
        { state: 'day', time: new Date(sunEntity.attributes.next_rising).getTime() },
        { state: 'night', time: new Date(sunEntity.attributes.next_setting).getTime() },
      );
    }

    horizonStates.sort((first, second) => first.time - second.time);
    const transitions = [];
    horizonStates.forEach((horizonState) => {
      if (horizonState.time > rangeEnd) return;
      const previous = transitions[transitions.length - 1];
      if (previous && previous.state === horizonState.state) return;
      transitions.push(horizonState);
    });

    this.dayNightSegments = [];
    transitions.forEach((transition, index) => {
      const start = Math.max(rangeStart, transition.time);
      const end = Math.min(rangeEnd, index < transitions.length - 1 ? transitions[index + 1].time : rangeEnd);
      if (start >= end) return;

      this.dayNightSegments.push({
        state: transition.state,
        start: new Date(start),
        end: new Date(end),
      });
    });
  }

  /**
   * Loads the horizon-state history represented by the parent sparkline
   * period. The auxiliary request never changes graph loading state or clears
   * already rendered series.
   *
   * @param {object} sunEntity - Current Home Assistant sun.sun state.
   */
  fetchDayNightHistoryIfNeeded(sunEntity) {
    const range = this.getDayNightRange();
    const representedRange =
      this.dayNightHistory !== undefined &&
      (this.config.period.type === 'rolling_window'
        ? this.dayNightRangeStart <= range.start.getTime()
        : this.dayNightRangeStart === range.start.getTime() && this.dayNightRangeEnd === range.end.getTime());

    if (this.dayNightHistoryPromise) return;
    if (representedRange && !this.dayNightResynchronizationRequested) {
      this.buildDayNightSegments(sunEntity);
      return;
    }

    const requestEnd = new Date(Math.min(range.end.getTime(), Date.now()));
    const requestedPeriodSignature = this.dayNightPeriodSignature;
    const path = this.buildHistoryPath('sun.sun', range.start, requestEnd);
    this.dayNightHistoryPromise = this.card._hass
      .callApi('GET', path)
      .then((history) => {
        if (requestedPeriodSignature !== this.dayNightPeriodSignature) return;

        this.dayNightHistory = history.length === 0 ? [] : history[0];
        this.dayNightRangeStart = range.start.getTime();
        this.dayNightRangeEnd = range.end.getTime();
        this.dayNightResynchronizationRequested = false;
        this.buildDayNightSegments(sunEntity);
        this.card.requestUpdate();
      })
      .finally(() => {
        this.dayNightHistoryPromise = undefined;
        if (this.dayNightResynchronizationRequested) this.fetchDayNightHistoryIfNeeded(this.card._hass.states['sun.sun']);
      });
  }

  /**
   * Builds the source request and visible plot window for one series. Calendar
   * windows stay anchored to local midnight; rolling windows count backwards
   * from now. The returned start/end aliases are always the source API range.
   *
   * @param {object} item - Series item whose offset selects the source range.
   * @returns {object} Source and plot Date boundaries.
   */
  getHistoryRange(item) {
    const plotPeriod = this.config.period;
    const sourcePeriod = item.config.period;
    const periodHours = plotPeriod.type === 'rolling_window' ? plotPeriod.rolling_window.duration.hour : plotPeriod.calendar.duration.hour;
    const now = new Date();

    if (plotPeriod.type === 'calendar' && plotPeriod.calendar.period === 'day') {
      const plotStart = new Date(now);
      plotStart.setHours(0, 0, 0, 0);
      plotStart.setDate(plotStart.getDate() + plotPeriod.calendar.offset - (periodHours - 24) / 24);
      const plotEnd = new Date(plotStart.getTime() + periodHours * 60 * 60 * 1000);
      const calendarOffsetDays = Number(sourcePeriod.calendar.offset) - Number(plotPeriod.calendar.offset);
      const sourceStart = new Date(plotStart);
      const sourceEnd = new Date(plotEnd);
      const plotActiveEnd = new Date(now);

      // Calendar arithmetic preserves each source sample's local clock time
      // while yesterday, last week, or another day is drawn as the reference day.
      sourceStart.setDate(sourceStart.getDate() + calendarOffsetDays);
      sourceEnd.setDate(sourceEnd.getDate() + calendarOffsetDays);
      plotActiveEnd.setDate(plotActiveEnd.getDate() - calendarOffsetDays);

      return {
        start: sourceStart,
        end: sourceEnd,
        sourceStart,
        sourceEnd,
        plotStart,
        plotEnd,
        plotActiveEnd,
        calendarOffsetDays,
        sourceRangeIsActive: Number(sourcePeriod.calendar.offset) === 0,
      };
    }

    const plotEnd = now;
    const plotStart = new Date(now.getTime() - periodHours * 60 * 60 * 1000);
    const rollingOffsetDays = Number(sourcePeriod.rolling_window.offset) - Number(plotPeriod.rolling_window.offset);
    const sourceStart = new Date(plotStart.getTime() + rollingOffsetDays * 24 * 60 * 60 * 1000);
    const sourceEnd = new Date(plotEnd.getTime() + rollingOffsetDays * 24 * 60 * 60 * 1000);
    const plotActiveEnd = new Date(now.getTime() - rollingOffsetDays * 24 * 60 * 60 * 1000);

    return {
      start: sourceStart,
      end: sourceEnd,
      sourceStart,
      sourceEnd,
      plotStart,
      plotEnd,
      plotActiveEnd,
      rollingOffsetDays,
      sourceRangeIsActive: Number(sourcePeriod.rolling_window.offset) === 0,
    };
  }

  /**
   * Checks whether accepted history already covers a newly requested range.
   * Active ranges receive current states separately, so only their older edge
   * has to be present. Closed calendar ranges require both fixed edges.
   *
   * @param {object} item - Series item with accepted history metadata.
   * @param {object} range - Requested history start and end dates.
   * @returns {boolean} True when no missing history is needed for rendering.
   */
  acceptedHistoryContainsRange(item, range) {
    if (item.historySeries === undefined) return false;

    const sourceRangeIsActive = range.sourceRangeIsActive;

    if (sourceRangeIsActive) {
      return item.historyRangeStart <= range.start.getTime();
    }

    // An offset rolling window is a completed comparison snapshot. Its API
    // boundaries move with the reference clock, but the accepted source rows
    // remain the selected historical window until the period or entity changes.
    if (item.config.period.type === 'rolling_window') return true;

    return item.historyRangeStart <= range.start.getTime() && item.historyRangeEnd >= range.end.getTime();
  }

  /**
   * Builds the Home Assistant history API path for this entity.
   *
   * @param {string} entityId - Source Home Assistant entity id.
   * @param {Date} start - History start time.
   * @param {Date} end - History end time.
   * @returns {string} Home Assistant callApi path.
   */
  buildHistoryPath(entityId, start, end) {
    const startTime = encodeURIComponent(start.toISOString());
    const endTime = encodeURIComponent(end.toISOString());
    const filterEntityId = encodeURIComponent(entityId);

    return `history/period/${startTime}?filter_entity_id=${filterEntityId}&end_time=${endTime}&minimal_response&no_attributes`;
  }

  /**
   * Fetches history when its normal deadline expires or when a calendar now
   * represents a different concrete start/end range. Closed historical ranges
   * are fetched once per represented local day.
   *
   * @param {object} item - Series item with its current HA entity.
   */
  fetchHistoryIfNeeded(item) {
    if (!this.historyDurationReady) return;

    const { config, entity } = item;
    const now = Date.now();
    const range = this.getHistoryRange(item);
    const sourceRangeIsClosed = !range.sourceRangeIsActive;
    const representedRange = this.acceptedHistoryContainsRange(item, range);
    const periodicResynchronizationDue = config.history.refresh_interval !== undefined && now >= item.historyRefreshAt;

    if (this.card.dev.debug) {
      console.log('[FHS sparkline history decision]', {
        cardId: this.cardId,
        sparklineId: config.id,
        durationHours: config.period.type === 'rolling_window' ? config.period.rolling_window.duration.hour : config.period.calendar.duration.hour,
        historyPromiseActive: item.historyPromise !== undefined,
        historySeriesRows: item.historySeries?.length,
        historyResynchronizationRequested: item.historyResynchronizationRequested,
        representedRange,
        rangeStart: range.start.toISOString(),
        rangeEnd: range.end.toISOString(),
      });
    }

    if (item.historyPromise) return;
    if (sourceRangeIsClosed && representedRange && !item.historyResynchronizationRequested && !periodicResynchronizationDue) return;
    if (item.historySeries && representedRange && !item.historyResynchronizationRequested && !periodicResynchronizationDue) return;

    // Only missing ranges show a loading indicator. Periodic refreshes and
    // reductions already have complete visible data and remain undimmed.
    if (!representedRange) {
      item.historyLoading = true;
      this.clearTooltip();
      this.card.requestUpdate();
    }

    const requestedHistoryEntityId = entity.entity_id;
    const path = this.buildHistoryPath(requestedHistoryEntityId, range.start, range.end);
    const requestedHistoryPeriodSignature = item.historyPeriodSignature;
    // console.log('[fetchHistoryIfNeeded] range', range);
    item.historyPromise = this.card._hass
      .callApi('GET', path)
      .then((history) => {
        const historyRows = history.length === 0 ? [] : history[0];
        const requestMatchesActivePeriod = requestedHistoryPeriodSignature === item.historyPeriodSignature;
        const requestMatchesActiveEntity = requestedHistoryEntityId === item.historyEntityId;

        if (this.card.dev.debug) {
          console.log('[FHS sparkline history response]', {
            cardId: this.cardId,
            sparklineId: config.id,
            requestedRangeStart: range.start.toISOString(),
            requestedRangeEnd: range.end.toISOString(),
            historyRows: historyRows.length,
            requestedEntityId: requestedHistoryEntityId,
            requestMatchesActivePeriod,
            requestMatchesActiveEntity,
          });
        }

        // A local or global FHS input can change the period or source entity while
        // this request is in flight. Ignore obsolete data; finally synchronizes
        // the currently active entity and represented period.
        if (!requestMatchesActivePeriod || !requestMatchesActiveEntity) return;

        item.historySeries = this.buildHistorySeries(item, historyRows, entity, range);
        item.historyRangeStart = range.start.getTime();
        item.historyRangeEnd = range.end.getTime();
        item.historyLoading = false;

        // The previous graph was deliberately kept intact during an expansion.
        // Rebuild its geometry only after matching history has been accepted.
        if (item.preserveGraphWhileHistoryLoads) {
          item.preserveGraphWhileHistoryLoads = false;
          this.updateRuntimeConfig();
        }

        item.rows = item.historySeries;
        this.updateGraphFromSeries();
        this.card.cardEntities.updateSparklineEntities(this.card.resolvedEntityConfigs, this.card.entities, this.card.cardTools.getBySection('sparklines'));
        if (config.history.refresh_interval !== undefined) item.historyRefreshAt = Date.now() + this.getRefreshIntervalMs(config.history.refresh_interval);

        item.historyResynchronizationRequested = true;
        // Keep the history flag active during the synchronous card pipeline so
        // its existing render decision sees the newly accepted graph data.
        this.card.setHass(this.card._hass);
        item.historyResynchronizationRequested = false;
      })
      .catch((error) => {
        if (!item.historyResynchronizationRequested) {
          item.historyLoading = false;
          this.card.requestUpdate();
        }
        throw error;
      })
      .finally(() => {
        item.historyPromise = undefined;

        // A period or source entity may change while an earlier request is in
        // flight. Fetch the active combination after that request has completed.
        if (item.historyResynchronizationRequested) this.fetchHistoryIfNeeded(item);
      });
  }

  /**
   * Converts Home Assistant history rows to the exact input shape expected by
   * SparklineGraph. Keep the original HA state in haState and feed the numeric
   * value through state.
   *
   * @param {object} item - Series item that owns graph conversion rules.
   * @param {Array<object>} historyRows - Rows returned by the HA history API.
   * @param {object} currentEntity - Current HA state object.
   * @param {object} range - Source and plot boundaries for this history request.
   * @returns {Array<object>} SparklineGraph history series.
   */
  buildHistorySeries(item, historyRows, currentEntity, range) {
    const rows = historyRows;

    // Preserve the source timestamp for tooltips and diagnostics, then replace
    // only last_changed with plot time. SparklineGraph remains unaware of
    // offsets and continues to bucket one ordinary visible time range.
    const projectRowTime = (row) => {
      const sourceTime = new Date(row.last_changed);
      const plotTime = new Date(sourceTime);

      if (range.calendarOffsetDays !== undefined) {
        plotTime.setDate(plotTime.getDate() - range.calendarOffsetDays);
      } else {
        plotTime.setTime(plotTime.getTime() - range.rollingOffsetDays * 24 * 60 * 60 * 1000);
      }

      return {
        source_time: sourceTime.toISOString(),
        plot_time: plotTime.toISOString(),
        last_changed: plotTime.toISOString(),
      };
    };

    if (item.config.sparkline.show.chart_type === 'state_bands') {
      return rows.map((row) => {
        const mappedState = this.stateBandsStateMap.map.find((entry) => String(entry.state) === String(row.state));

        return {
          ...row,
          ...projectRowTime(row),
          state: Number(mappedState.value),
          haState: row.state,
        };
      });
    }

    return rows
      .filter((row) => row && Number.isFinite(Number(row.state)))
      .map((row) =>
        Merge.mergeDeep(row, {
          ...projectRowTime(row),
          state: Number(row.state),
          haState: row.state,
        }),
      );
  }

  /**
   * Extracts the numeric value used by the graph engine.
   *
   * @param {object} entity - Current HA state object.
   * @returns {number} Numeric graph state.
   */
  getEntityNumericState(item, entity) {
    if (item.entityConfig?.attribute) {
      return Number(entity.attributes[item.entityConfig.attribute]);
    }

    return Number(entity.state);
  }

  /**
   * Runs every cartesian series through its graph engine, then pins
   * their y coordinates to shared axis ranges. Item zero supplies the primary
   * presentation graph; every item follows the same graph update lifecycle.
   */
  updateCartesianSeriesGraphs() {
    const statisticsRanges = new Map();
    this.sparklineSeries.items.forEach((item) => {
      if (item.config.period.type !== 'real_time') {
        const range = this.getHistoryRange(item);
        if (range.sourceRangeIsActive && item.historySeries) {
          statisticsRanges.set(item, this.pruneLiveHistoryToActiveWindow(item));
        }
        item.graph.hours = (range.plotEnd.getTime() - range.plotStart.getTime()) / (60 * 60 * 1000);
        item.graph.activeDataEnd = range.sourceRangeIsActive ? range.plotActiveEnd : undefined;
      } else {
        item.graph.activeDataEnd = undefined;
      }
    });

    const coordinatedGraphs = this.sparklineSeries.updateCartesianGraphs(
      (axisGraphs) => {
        this.axisGraphs = axisGraphs;
        return this.calculateAxisMargin();
      },
      this.configuredGraphMargin,
      this.svg.column_spacing,
      this.svg.row_spacing,
    );
    this.graphReady = coordinatedGraphs.ready;
    if (!this.graphReady) {
      this.stats = {};
      return;
    }
    this.axisGraphs = coordinatedGraphs.axisGraphs;
    this.axisMargin = coordinatedGraphs.axisMargin;

    this.area = [];
    this.areaMinMax = [];
    this.line = [];
    this.points = [];
    this.gradient = [];
    this.sparklineSeries.items.forEach((item, index) => {
      const { graph, config } = item;
      const chartType = config.sparkline.show.chart_type;
      if (['line', 'area'].includes(chartType)) {
        const path = graph.getPath();
        if (config.sparkline.show.line !== false) this.line[index] = path;
        if (chartType === 'area') this.area[index] = graph.getArea(path);
      }
      if (chartType === 'dots' || config.sparkline.show.points === true || config.sparkline.line.show_dots === true || config.sparkline.area.show_dots === true) {
        this.points[index] = graph.calculateYCoordinates(graph.coords).map((point, pointIndex) => [point[X], point[Y], point[V], pointIndex]);
      }
    });

    const graph = this.primaryGraph;
    const zeroY = graph.calculateYCoordinates([[graph.drawArea.x, 0, 0]])[0][Y];
    this.animationBaselineY = Math.min(graph.drawArea.y + graph.drawArea.height, Math.max(graph.drawArea.y, zeroY));
    this.sparklineSeries.items.forEach((item) => {
      if (item.config.period.type === 'real_time') {
        const state = Number(item.rows[0].state);
        item.stats = {
          min: state,
          avg: state,
          max: state,
          min_time: item.entity.last_changed,
          max_time: item.entity.last_changed,
        };
      } else {
        item.stats = this.calculateStatistics(item.rows, statisticsRanges.get(item));
      }
    });
    this.stats = this.sparklineSeries.primaryItem.stats;
  }

  /**
   * Runs radial series through the same history and scale lifecycle while the
   * graph engines remain the sole owners of polar coordinate calculations.
   */
  updateRadialSeriesGraphs() {
    const statisticsRanges = new Map();
    this.sparklineSeries.items.forEach((item) => {
      if (item.config.period.type !== 'real_time') {
        const range = this.getHistoryRange(item);
        if (range.sourceRangeIsActive && item.historySeries) {
          statisticsRanges.set(item, this.pruneLiveHistoryToActiveWindow(item));
        }
        item.graph.hours = (range.plotEnd.getTime() - range.plotStart.getTime()) / (60 * 60 * 1000);
        item.graph.activeDataEnd = range.sourceRangeIsActive ? range.plotActiveEnd : undefined;
      } else {
        item.graph.activeDataEnd = undefined;
      }
    });

    const coordinatedGraphs = this.sparklineSeries.updateRadialGraphs((axisGraphs) => {
      this.axisGraphs = axisGraphs;
      return this.calculateRadialAxisMargin(axisGraphs);
    }, this.configuredGraphMargin);
    this.graphReady = coordinatedGraphs.ready;
    if (!this.graphReady) {
      this.stats = {};
      return;
    }
    this.axisGraphs = coordinatedGraphs.axisGraphs;
    this.axisMargin = coordinatedGraphs.axisMargin;

    this.sparklineSeries.items.forEach((item) => {
      if (item.config.period.type === 'real_time') {
        const state = Number(item.rows[0].state);
        item.stats = {
          min: state,
          avg: state,
          max: state,
          min_time: item.entity.last_changed,
          max_time: item.entity.last_changed,
        };
      } else {
        item.stats = this.calculateStatistics(item.rows, statisticsRanges.get(item));
      }
    });
    this.stats = this.sparklineSeries.primaryItem.stats;
  }

  /**
   * Runs the reused graph engine and stores the generated FHS render paths.
   */
  updateGraphFromSeries() {
    const chartType = this.config.sparkline.show.chart_type;
    const cartesianSeries = this.sparklineSeries.items.every((item) => ['line', 'area', 'dots', 'bar'].includes(item.config.sparkline.show.chart_type));
    const radialSeries = this.sparklineSeries.items.every((item) => item.config.sparkline.show.chart_type === 'radial');
    const index = 0;
    const total = 1;

    // Development mode replaces only the values with the deterministic example
    // sequence. Source timestamps remain intact so normal bucketing is exercised.
    if (this.card.dev.fakeData && chartType !== 'state_bands') {
      let generatedState = 40;

      this.sparklineSeries.primaryItem.rows.forEach((seriesItem, seriesIndex) => {
        if (seriesIndex < this.sparklineSeries.primaryItem.rows.length / 2) generatedState -= 4 * seriesIndex;
        if (seriesIndex > this.sparklineSeries.primaryItem.rows.length / 2) generatedState += 3 * seriesIndex;
        seriesItem.state = generatedState;
        seriesItem.haState = generatedState;
      });
    }
    if (radialSeries) {
      this.updateRadialSeriesGraphs();
      return;
    }

    // Cartesian charts always use the coordinator, including the implicit
    // one-item collection. Single-series paint and statistics remain richer.
    if (cartesianSeries) {
      this.updateCartesianSeriesGraphs();
      if (!this.graphReady || this.sparklineSeries.items.length > 1) return;
    }

    const sourceRangeIsActive = this.getHistoryRange(this.sparklineSeries.primaryItem).sourceRangeIsActive;
    const statisticsRange = sourceRangeIsActive && this.sparklineSeries.primaryItem.historySeries ? this.pruneLiveHistoryToActiveWindow(this.sparklineSeries.primaryItem) : undefined;

    if (!cartesianSeries) {
      // Real-time uses the graph engine's existing one-hour/one-point calculation.
      // Only history-backed modes calculate and apply a requested history range.
      if (this.config.period.type !== 'real_time') {
        const range = this.getHistoryRange(this.sparklineSeries.primaryItem);
        this.primaryGraph.hours = (range.plotEnd.getTime() - range.plotStart.getTime()) / (60 * 60 * 1000);
      }

      this.axisGraphs = { primary: this.primaryGraph, secondary: undefined };
      this.graphReady = this.sparklineSeries.updateGraphs()[0];

      // An accepted history response can legitimately contain no numeric rows.
      // The engine then has no axis geometry, so no graph-dependent work follows.
      if (!this.graphReady) {
        this.stats = {};
        return;
      }

      // The provisional graph supplies formatted ticks and a concrete bucket
      // count. The tool measures outer axis space; the graph engine then owns
      // the final axisArea and chart-specific dataArea.
      const axisMargin =
        chartType === 'radial_barcode' ? this.calculateRadialAxisMargin(this.axisGraphs) : this.calculateAxisMargin();
      const graphAreasChanged = this.primaryGraph.setGraphAreas(axisMargin, this.configuredGraphMargin, this.primaryGraph.coords.length);
      if (graphAreasChanged) {
        this.axisMargin = axisMargin;
        this.graphReady = this.sparklineSeries.updateGraphs()[0];
      }
    }
    // Use the graph engine y-scale for every vertical introduction animation.
    // Clamp value zero to the draw area for positive-only and negative-only scales.
    if (chartType === 'state_bands') {
      this.animationBaselineY = this.primaryGraph.drawArea.y + this.primaryGraph.drawArea.height;
    } else {
      const zeroY = this.primaryGraph.calculateYCoordinates([[this.primaryGraph.drawArea.x, 0, 0]])[0][Y];
      this.animationBaselineY = Math.min(this.primaryGraph.drawArea.y + this.primaryGraph.drawArea.height, Math.max(this.primaryGraph.drawArea.y, zeroY));
    }

    this.area = [];
    this.areaMinMax = [];
    this.line = [];
    this.bar = [];
    this.equalizer = [];
    this.points = [];
    this.barcodeChart = [];
    this.barcodeChartBackground = [];
    this.radialBarcodeChart = [];
    this.radialBarcodeChartBackground = [];
    this.graded = [];
    this.stateBands = chartType === 'state_bands' && this.sparklineSeries.primaryItem.historySeries ? this.primaryGraph.getStateBands() : [];

    if (this.primaryGraph.coords.length > 0) {
      if (['area', 'line'].includes(chartType)) {
        this.linePath = this.primaryGraph.getPath();
        if (this.entityConfig?.show_line !== false) {
          this.line[index] = this.linePath;
        }
        if (chartType === 'area') {
          this.areaPath = this.primaryGraph.getArea(this.linePath);
          this.area[index] = this.areaPath;
        } else {
          this.areaPath = undefined;
        }

        const showMinMax = chartType === 'line' ? this.config.sparkline?.line?.show_minmax === true : this.config.sparkline?.area?.show_minmax === true;

        if (showMinMax) {
          this.lineMinPath = this.primaryGraph.getPathMin();
          this.lineMaxPath = this.primaryGraph.getPathMax();
          this.areaMinMaxPath = this.primaryGraph.getAreaMinMax(this.lineMinPath, this.lineMaxPath);
          this.areaMinMax[index] = this.areaMinMaxPath;
        } else {
          this.lineMinPath = undefined;
          this.lineMaxPath = undefined;
          this.areaMinMaxPath = undefined;
        }
      } else {
        this.linePath = undefined;
        this.lineMinPath = undefined;
        this.lineMaxPath = undefined;
        this.areaPath = undefined;
        this.areaMinMaxPath = undefined;
      }

      if (chartType === 'dots' || this.config.sparkline.show.points === true || this.config.sparkline?.line?.show_dots === true || this.config.sparkline?.area?.show_dots === true) {
        this.points[index] = this.primaryGraph.getPoints();
      }

      if (chartType === 'bar') {
        this.bar[index] = this.primaryGraph.getBars(index, total, this.svg.column_spacing, this.svg.row_spacing);
        if (this.config.period.type === 'real_time' && this.config.sparkline.bar.orientation === 'vertical') {
          // The engine places a one-point bar around its left-edge coordinate.
          // Center that single bar inside the complete real-time draw area.
          this.bar[index][0].x = this.primaryGraph.drawArea.x + (this.primaryGraph.drawArea.width - this.bar[index][0].width) / 2;
        }
      } else if (chartType === 'equalizer') {
        this.primaryGraph.levelCount = this.config.sparkline.equalizer.value_buckets;
        this.primaryGraph.valuesPerBucket = (this.primaryGraph.max - this.primaryGraph.min) / this.config.sparkline.equalizer.value_buckets;
        this.equalizer[index] = this.primaryGraph.getEqualizer(index, total, this.svg.column_spacing, this.svg.row_spacing);
      } else if (chartType === 'graded') {
        this.primaryGraph.levelCount = this.config.sparkline.equalizer.value_buckets;
        this.primaryGraph.valuesPerBucket = (this.primaryGraph.max - this.primaryGraph.min) / this.config.sparkline.equalizer.value_buckets;
        this.graded[index] = this.primaryGraph.getGrades(index, total, this.svg.column_spacing, this.svg.row_spacing);
      } else if (chartType === 'radial_barcode') {
        this.radialBarcodeChartBackground[index] = this.primaryGraph.getRadialBarcodeBackground(index, total, this.svg.column_spacing, this.svg.row_spacing);
        this.radialBarcodeChart[index] = this.primaryGraph.getRadialBarcode(index, total, this.svg.column_spacing, this.svg.row_spacing);
        this.primaryGraph.radialBarcodeBackground = this.radialBarcodeChartBackground[index];
        this.primaryGraph.radialBarcode = this.radialBarcodeChart[index];
      } else if (chartType === 'barcode') {
        this.barcodeChart[index] = this.primaryGraph.getBarcode(index, total, this.svg.column_spacing, this.svg.row_spacing);
      }
    }

    if (this.config.sparkline.colorstops.colors.length > 0 && !this.entityConfig?.color) {
      this.gradient[0] = this.primaryGraph.computeGradient(computeThresholds(this.config.sparkline.colorstops.colors, this.config.sparkline.colorstops_transition), this.config.sparkline.state_values.logarithmic);
    } else {
      this.gradient = [];
    }
    // Real-time has one current value and no timestamped history series. Keep
    // the local statistics entities complete using the source entity timestamp.
    if (this.config.period.type === 'real_time') {
      const state = Number(this.sparklineSeries.primaryItem.rows[0].state);
      this.stats = {
        min: state,
        avg: state,
        max: state,
        min_time: this.entity.last_changed,
        max_time: this.entity.last_changed,
      };
    } else {
      this.stats = this.calculateStatistics(this.sparklineSeries.primaryItem.rows, statisticsRange);
    }
  }

  /**
   * Calculates min/max from the raw source values and calculates avg as a
   * time-weighted average. Home Assistant history rows are state changes, so a
   * value that only existed briefly must not count the same as a value that was
   * active for hours.
   *
   * @param {Array<object>} series - Current graph source series.
   * @param {object|undefined} statisticsRange - Active visible start/end timestamps.
   * @returns {object} Graph statistics.
   */
  calculateStatistics(series, statisticsRange) {
    const sortedSeries = series
      .filter((item) => item && Number.isFinite(Number(item.state)))
      .concat()
      .sort((a, b) => new Date(a.last_changed).getTime() - new Date(b.last_changed).getTime());

    if (sortedSeries.length === 0) {
      return {};
    }

    const rangeStart = statisticsRange ? statisticsRange.start : new Date(sortedSeries[0].last_changed).getTime();
    const rangeEnd = statisticsRange ? statisticsRange.end : Date.now();
    const visibleSeries = sortedSeries.filter((item) => new Date(item.last_changed).getTime() <= rangeEnd);
    const values = visibleSeries.map((item) => Number(item.state));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const minItem = visibleSeries.find((item) => Number(item.state) === min);
    const maxItem = visibleSeries.find((item) => Number(item.state) === max);
    const minItemTime = new Date(minItem.last_changed).getTime();
    const maxItemTime = new Date(maxItem.last_changed).getTime();
    const min_time = minItemTime < rangeStart ? new Date(rangeStart).toISOString() : minItem.last_changed;
    const max_time = maxItemTime < rangeStart ? new Date(rangeStart).toISOString() : maxItem.last_changed;
    let weightedValue = 0;
    let weightedDuration = 0;

    visibleSeries.forEach((item, index) => {
      const value = Number(item.state);
      const itemStart = new Date(item.last_changed).getTime();
      const nextItemStart = index < visibleSeries.length - 1 ? new Date(visibleSeries[index + 1].last_changed).getTime() : rangeEnd;
      const startTime = Math.max(itemStart, rangeStart);
      const endTime = Math.min(nextItemStart, rangeEnd);
      const duration = Math.max(0, endTime - startTime);

      weightedValue += value * duration;
      weightedDuration += duration;
    });

    const avg = weightedValue / weightedDuration;

    return { min, avg, max, min_time, max_time };
  }

  /**
   * mouseEventToPoint
   *
   * Translate mouse/touch client window coordinates to SVG window coordinates.
   * Copied from slider-pointer-example.js because that event/SVG conversion has
   * proven to work on Safari and touch devices.
   *
   * @param {MouseEvent|TouchEvent|PointerEvent} e - Browser interaction event.
   * @returns {DOMPoint} Point in this tool SVG coordinate space.
   */
  mouseEventToPoint(e) {
    let p = this.elements.svg.createSVGPoint();

    p.x = e.touches ? e.touches[0].clientX : e.clientX;
    p.y = e.touches ? e.touches[0].clientY : e.clientY;
    const ctm = this.elements.svg.getScreenCTM().inverse();
    p = p.matrixTransform(ctm);
    return p;
  }

  /**
   * Converts an SVG point into the active graph x position. Pointer movement can
   * go outside the graph; only the calculated graph x is clamped.
   *
   * @param {DOMPoint} point - SVG point from mouseEventToPoint().
   * @returns {number} Clamped x coordinate inside the graph.
   */
  pointToGraphX(point) {
    const x = point.x - this.graphArea.x;

    return Math.max(0, Math.min(x, this.graphArea.width));
  }

  /**
   * Snaps the pointer X to the closest graph sample X so hover and drag track
   * the same interval positions as the rendered line.
   *
   * @param {number} x - Raw pointer X in SVG coordinates.
   * @returns {number} Snapped graph X position.
   */
  snapPointerXToGraphPoint(x) {
    const coords = this.primaryGraph.coords;
    if (!coords || coords.length === 0) return x;

    let snappedX = coords[0][0];
    let snappedDistance = Math.abs(x - snappedX);

    for (let i = 1; i < coords.length; i += 1) {
      const currentX = coords[i][0];
      const currentDistance = Math.abs(x - currentX);

      if (currentDistance < snappedDistance) {
        snappedX = currentX;
        snappedDistance = currentDistance;
      }
    }

    return snappedX;
  }

  /**
   * Finds the radial bin under a pointer. Barcode paths provide an exact DOM
   * hit; line, area and dots use the engine's shared angle-to-bin projection.
   *
   * @param {MouseEvent|TouchEvent|PointerEvent} event - Browser interaction event.
   * @returns {number} Radial bin index, or NaN outside the configured arc.
   */
  getRadialPointIndexFromEvent(event) {
    const target = event.target ?? event.currentTarget;
    const barcodeBin = target.closest?.('.sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin');
    if (barcodeBin) {
      const pointIndex = Number(barcodeBin.dataset.pointIndex);
      return pointIndex < this.primaryGraph.coords.length ? pointIndex : NaN;
    }

    const point = this.mouseEventToPoint(event);
    return this.primaryGraph.getRadialBinIndex(point.x - this.graphArea.x, point.y - this.graphArea.y);
  }
  /**
   * Updates active pointer state for indicator/snake rendering.
   *
   * @param {MouseEvent|TouchEvent|PointerEvent} e - Browser interaction event.
   */
  getPointIndexFromX(x) {
    const coords = this.primaryGraph.coords;
    if (!coords || coords.length === 0) return undefined;

    let snappedIndex = 0;
    let snappedDistance = Math.abs(x - coords[0][0]);

    for (let i = 1; i < coords.length; i += 1) {
      const currentDistance = Math.abs(x - coords[i][0]);

      if (currentDistance < snappedDistance) {
        snappedIndex = i;
        snappedDistance = currentDistance;
      }
    }

    return snappedIndex;
  }

  /**
   * Uses Home Assistant's statistics terminology for tooltip row labels so
   * min, mean and max follow the active frontend locale.
   *
   * @param {string} stat - Internal statistic name.
   * @returns {string} Localized label with an initial capital.
   */
  getTooltipLabel(stat) {
    const localized = this.card._hass.localize(`ui.panel.developer-tools.statistics.${stat === 'avg' ? 'mean' : stat}`);

    if (!localized) return stat;

    return localized.charAt(0).toUpperCase() + localized.slice(1);
  }

  /**
   * Formats a bucket statistic with the precision and unit produced for the
   * source entity by StateTool. Empty buckets have no statistics.
   *
   * @param {string} stat - min, avg or max.
   * @param {number|undefined} rawValue - Aggregated value from bucketMeta.
   * @returns {object} Tooltip label, formatted value and unit.
   */
  formatTooltipStat(stat, rawValue) {
    const label = this.getTooltipLabel(stat);

    if (rawValue === undefined) return { label, value: '', uom: '' };

    const sourceEntity = this.card.entities[this.entity_index];
    const sourceEntityConfig = this.card.resolvedEntityConfigs[this.entity_index];
    const sourceFormatter = Object.create(StateTool.prototype);

    // Read precision and unit from the source entity's normal StateTool output.
    sourceFormatter.entity = sourceEntity;
    sourceFormatter.entityConfig = sourceEntityConfig;
    sourceFormatter.config = sourceEntityConfig;
    sourceFormatter.card = this.card;
    sourceFormatter.state = '';
    sourceFormatter.uom = '';
    sourceFormatter.buildStateAndUom();

    const activeLocale = this.card._hass.locale.language;
    const decimalSeparator = new Intl.NumberFormat(activeLocale).formatToParts(1.1).find((part) => part.type === 'decimal').value;
    const decimalIndex = sourceFormatter.state.lastIndexOf(decimalSeparator);
    const decimals = decimalIndex === -1 ? 0 : sourceFormatter.state.length - decimalIndex - 1;
    const formattedValue = new Intl.NumberFormat(activeLocale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(rawValue);

    return { label, value: formattedValue, uom: sourceFormatter.uom };
  }

  /**
   * Formats one aggregated bucket value with the source entity precision and
   * unit. Multi-series tooltips use this once per declared series.
   *
   * @param {object} item - Series item that owns the source formatting.
   * @param {number|undefined} rawValue - Aggregated bucket value.
   * @returns {object} Formatted value and unit.
   */
  formatSeriesTooltipValue(item, rawValue) {
    if (rawValue === undefined) return { value: '', uom: '' };

    const sourceFormatter = Object.create(StateTool.prototype);
    sourceFormatter.entity = item.entity;
    sourceFormatter.entityConfig = item.entityConfig;
    sourceFormatter.config = item.entityConfig;
    sourceFormatter.state = '';
    sourceFormatter.uom = '';
    sourceFormatter.card = this.card;
    sourceFormatter.buildStateAndUom();

    const activeLocale = this.card._hass.locale.language;
    const decimalSeparator = new Intl.NumberFormat(activeLocale).formatToParts(1.1).find((part) => part.type === 'decimal').value;
    const decimalIndex = sourceFormatter.state.lastIndexOf(decimalSeparator);
    const decimals = decimalIndex === -1 ? 0 : sourceFormatter.state.length - decimalIndex - 1;
    const value = new Intl.NumberFormat(activeLocale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(rawValue);

    return { value, uom: sourceFormatter.uom };
  }

  /**
   * Builds tooltip content and selects the segment center for the active indicator.
   * Existing cartesian charts continue to use their bin tooltip unchanged.
   *
   * @param {object} segment - Active state-band segment from the graph engine.
   */
  updateTooltipFromStateBandSegment(segment) {
    const locale = this.card._hass.locale;
    const config = this.card._hass.config;
    const containerBox = this.elements.containerRect || this.elements.container.getBoundingClientRect();
    const durationMs = segment.end.getTime() - segment.start.getTime();
    let remainingSeconds = Math.floor(durationMs / 1000);
    const days = Math.floor(remainingSeconds / 86400);
    remainingSeconds -= days * 86400;
    const hours = Math.floor(remainingSeconds / 3600);
    remainingSeconds -= hours * 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds - minutes * 60;

    this.activeX = segment.x + segment.width / 2;
    this.tooltip = {
      entity: this.entity_index,
      index: this.primaryGraph.stateBandSegments.indexOf(segment),
      title: segment.label,
      min: {
        label: 'Start',
        value: formatDateTime(segment.start, locale, config),
        uom: '',
      },
      avg: {
        label: 'End',
        value: formatDateTime(segment.end, locale, config),
        uom: '',
      },
      max: {
        label: 'Duration',
        value: formatNumericDuration(locale, { days, hours, minutes, seconds }),
        uom: '',
      },
      containerWidth: containerBox.width,
      containerHeight: containerBox.height,
    };
  }

  /**
   * Builds the cartesian tooltip model from one aggregated history bucket.
   * Position is measured in the card container because the tooltip is HTML,
   * while the active point itself belongs to the scaled SVG coordinate space.
   *
   * @param {number} pointIndex - Index shared by graph coordinates and bucket metadata.
   * @param {MouseEvent|TouchEvent|PointerEvent} event - Current pointer event.
   */
  updateTooltipFromPointIndex(pointIndex, event) {
    const bucket = this.primaryGraph.bucketMeta[pointIndex];
    const point = this.primaryGraph.coords[pointIndex];
    const locale = this.card._hass.locale;
    const config = this.card._hass.config;
    const svgBox = this.elements.svg?.getBoundingClientRect();
    const containerBox = this.card.shadowRoot.getElementById('container')?.getBoundingClientRect();
    const pointBox = event?.currentTarget?.getBoundingClientRect();

    if (!bucket || !point || !containerBox) {
      this.tooltip = {};
      return;
    }

    const titleDate = bucket.start;
    const title =
      titleDate.getHours() === 0 && titleDate.getMinutes() === 0 && titleDate.getSeconds() === 0 && titleDate.getMilliseconds() === 0
        ? formatDateVeryShort(titleDate, locale, config)
        : formatTime(titleDate, locale, config);

    if (this.sparklineSeries.items.length > 1) {
      const series = this.sparklineSeries.items.map((item, seriesIndex) => {
        // Each engine owns its own bucket list. Match the selected primary x
        // coordinate so a series can have a different number of visible bins.
        const seriesPointIndex = item.graph.coords.reduce(
          (nearestIndex, candidate, candidateIndex) => (Math.abs(candidate[X] - point[X]) < Math.abs(item.graph.coords[nearestIndex][X] - point[X]) ? candidateIndex : nearestIndex),
          0,
        );
        const seriesBucket = item.graph.bucketMeta[seriesPointIndex];
        const formatted = this.formatSeriesTooltipValue(item, seriesBucket.avg);
        return {
          label: this.formatSeriesName(item),
          color: item.config.color ?? item.entityConfig.color ?? item.config.sparkline.line_color[seriesIndex],
          ...formatted,
        };
      });
      const scaleX = svgBox ? svgBox.width / this.svg.width : 1;
      const scaleY = svgBox ? svgBox.height / this.svg.height : 1;
      const pointer = event?.touches ? event.touches[0] : event;
      const centerX =
        pointer?.clientX !== undefined ? pointer.clientX - containerBox.left : this.tooltip.x !== undefined ? this.tooltip.x : svgBox ? svgBox.left - containerBox.left + (this.graphArea.x + point[X]) * scaleX : point[X];
      const centerY =
        pointer?.clientY !== undefined ? pointer.clientY - containerBox.top : this.tooltip.y !== undefined ? this.tooltip.y : svgBox ? svgBox.top - containerBox.top + (this.graphArea.y + point[Y]) * scaleY : point[Y];
      this.tooltip = {
        entity: this.entity_index,
        index: pointIndex,
        x: centerX,
        y: centerY,
        title,
        series,
        containerWidth: containerBox.width,
        containerHeight: containerBox.height,
      };
      return;
    }

    const min = this.formatTooltipStat('min', bucket.min);
    const avg = this.formatTooltipStat('avg', bucket.avg);
    const max = this.formatTooltipStat('max', bucket.max);
    const scaleX = svgBox ? svgBox.width / this.svg.width : 1;
    const scaleY = svgBox ? svgBox.height / this.svg.height : 1;
    const pointer = event?.touches ? event.touches[0] : event;
    const centerX =
      pointer?.clientX !== undefined ? pointer.clientX - containerBox.left : this.tooltip.x !== undefined ? this.tooltip.x : svgBox ? svgBox.left - containerBox.left + (this.graphArea.x + point[X]) * scaleX : point[X];
    const centerY =
      pointer?.clientY !== undefined ? pointer.clientY - containerBox.top : this.tooltip.y !== undefined ? this.tooltip.y : svgBox ? svgBox.top - containerBox.top + (this.graphArea.y + point[Y]) * scaleY : point[Y];

    this.tooltip = {
      entity: this.entity_index,
      index: pointIndex,
      x: centerX,
      y: centerY,
      title,
      min,
      avg,
      max,
      count: bucket.count,
      containerWidth: containerBox.width,
      containerHeight: containerBox.height,
    };
  }

  /**
   * Applies a radial hover frame directly to the current DOM. Pointer movement
   * can occur much faster than entity updates, so highlighting and tooltip
   * placement bypass a complete Lit card render.
   *
   * @param {number} pointIndex - Radial history bin to highlight.
   * @param {MouseEvent|TouchEvent|PointerEvent} event - Current pointer event.
   */
  updateTooltipFromRadial(pointIndex, event) {
    this.activeX = undefined;
    this.activePoint = pointIndex;
    this.elements.containerRect = this.elements.container.getBoundingClientRect();
    const svgBox = this.elements.svg.getBoundingClientRect();
    const scaleX = svgBox.width / this.svg.width;
    const scaleY = svgBox.height / this.svg.height;
    this.elements.tooltipBounds = {
      left: svgBox.left - this.elements.containerRect.left + (this.graphArea.x + this.primaryGraph.drawArea.x) * scaleX,
      top: svgBox.top - this.elements.containerRect.top + (this.graphArea.y + this.primaryGraph.drawArea.y) * scaleY,
      right: svgBox.left - this.elements.containerRect.left + (this.graphArea.x + this.primaryGraph.drawArea.x + this.primaryGraph.drawArea.width) * scaleX,
      bottom: svgBox.top - this.elements.containerRect.top + (this.graphArea.y + this.primaryGraph.drawArea.y + this.primaryGraph.drawArea.height) * scaleY,
    };
    this.updateRadialActiveBinDom(pointIndex);
    this.updateActiveIndicatorDom();
    this.updateTooltipFromPointIndex(pointIndex, event);
    this.updateTooltipContentDom();
    this.updateTooltipPositionDom(event);
    this.updateTooltipVisibilityDom(true);
  }

  /**
   * Clears the tooltip model shared by the next Lit render.
   */
  clearTooltip() {
    this.tooltip = {};
    this.activePoint = undefined;
    this.tooltipVisible = false;
  }

  /**
   * Hides radial hover output while retaining the rendered graph.
   */
  clearRadialTooltip() {
    this.clearTooltip();
    this.updateTooltipVisibilityDom(false);
    this.updateActiveIndicatorDom();
  }

  /**
   * Coalesces radial move and leave events into one animation-frame update.
   * The latest pending event wins, which keeps touch tracking responsive
   * without repeatedly measuring and mutating layout in the same frame.
   */
  scheduleRadialHoverFrame() {
    if (this._radialRafId) return;

    this._radialRafId = window.requestAnimationFrame(() => {
      this._radialRafId = null;

      if (this._radialPendingLeave) {
        this._radialPendingLeave = false;
        this._radialPendingPointIndex = undefined;
        this._radialPendingEvent = undefined;
        this.restoreRadialActiveBinDom();
        this.clearRadialTooltip();
        return;
      }

      const pointIndex = this._radialPendingPointIndex;
      const event = this._radialPendingEvent;
      this._radialPendingPointIndex = undefined;
      this._radialPendingEvent = undefined;

      if (!Number.isFinite(pointIndex)) return;

      this.updateTooltipFromRadial(pointIndex, event);
    });
  }

  /**
   * Restores radial segment styles captured before pointer highlighting.
   */
  restoreRadialActiveBinDom() {
    const bins = this.elements.svg?.querySelectorAll('.sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin');
    if (!bins) return;

    bins.forEach((bin) => {
      if (!bin.__fhsRadialOriginalStyle) return;

      const restoreStyle = (prop, value) => {
        if (value === '') {
          bin.style.removeProperty(prop);
        } else {
          bin.style.setProperty(prop, value);
        }
      };

      restoreStyle('opacity', bin.__fhsRadialOriginalStyle.opacity);
      restoreStyle('filter', bin.__fhsRadialOriginalStyle.filter);
      restoreStyle('stroke-width', bin.__fhsRadialOriginalStyle.strokeWidth);
    });
  }

  /**
   * Emphasizes one radial foreground bin and dims its peers. Original inline
   * styles are saved on each SVG path so leaving the chart restores custom
   * user styling rather than replacing it with hard-coded defaults.
   *
   * @param {number} pointIndex - Foreground bin to emphasize.
   */
  updateRadialActiveBinDom(pointIndex) {
    const bins = this.elements.svg?.querySelectorAll('.sparkline-radial-barcode__bin');
    if (!bins) return;

    bins.forEach((bin) => {
      if (!bin.__fhsRadialOriginalStyle) {
        bin.__fhsRadialOriginalStyle = {
          opacity: bin.style.opacity,
          filter: bin.style.filter,
          strokeWidth: bin.style.strokeWidth,
        };
      }

      const isActive = pointIndex >= 0 && Number(bin.dataset.pointIndex) === pointIndex;
      bin.style.setProperty('opacity', isActive ? '1' : '0.35');
      bin.style.setProperty('filter', isActive ? 'brightness(1.15)' : 'none');
      bin.style.setProperty('stroke-width', isActive ? '2' : '1');
    });
  }

  /**
   * Synchronizes the active indicator with cartesian x or radial angle.
   */
  updateActiveIndicatorDom() {
    const activeIndicator = this.elements.activeIndicator;
    if (!activeIndicator) return;

    if (this.config.sparkline.show.chart_type === 'radial') {
      if (this.activePoint === undefined) {
        activeIndicator.style.visibility = 'hidden';
        return;
      }
      const geometry = this.primaryGraph.getRadialGeometry();
      const angle = this.primaryGraph.getRadialAngleForBin(this.activePoint);
      const start = this.primaryGraph.getRadialPoint(geometry.innerRadius, angle);
      const end = this.primaryGraph.getRadialPoint(geometry.outerRadius, angle);
      activeIndicator.setAttribute('x1', `${start.x}`);
      activeIndicator.setAttribute('y1', `${start.y}`);
      activeIndicator.setAttribute('x2', `${end.x}`);
      activeIndicator.setAttribute('y2', `${end.y}`);
      activeIndicator.style.visibility = 'visible';
      return;
    }

    if (this.activeX === undefined) {
      activeIndicator.style.visibility = 'hidden';
      return;
    }
    activeIndicator.setAttribute('x1', `${this.activeX}`);
    activeIndicator.setAttribute('x2', `${this.activeX}`);
    activeIndicator.style.visibility = 'visible';
  }
  /**
   * Updates both the persistent tooltip state and its current HTML element.
   *
   * @param {boolean} show - Whether the tooltip must be visible.
   */
  updateTooltipVisibilityDom(show) {
    this.tooltipVisible = show;
    const tooltip = this.elements.tooltip;

    if (!tooltip) return;

    tooltip.style.display = show ? 'block' : 'none';
  }

  /**
   * Positions the HTML tooltip inside the card and keeps it within the graph
   * bounds measured at pointer-entry time.
   *
   * @param {MouseEvent|TouchEvent|PointerEvent} e - Current pointer event.
   */
  updateTooltipPositionDom(e) {
    const tooltip = this.elements.tooltip;
    const containerBox = this.elements.containerRect || this.elements.container.getBoundingClientRect();
    const touch = e?.touches?.[0] ?? e?.changedTouches?.[0] ?? e;

    if (!tooltip || !containerBox) return;

    if (touch?.clientX === undefined || touch?.clientY === undefined) return;

    let left = touch.clientX - containerBox.left;
    let top = touch.clientY - containerBox.top;
    const isTouch = e?.touches?.length > 0 || e?.changedTouches?.length > 0;
    if (isTouch && ['radial', 'radial_barcode'].includes(this.config.sparkline.show.chart_type)) {
      left += 18;
      top -= 28;
    }
    const bounds = this.elements.tooltipBounds || {
      left: 0,
      top: 0,
      right: containerBox.width,
      bottom: containerBox.height,
    };

    left = Math.max(bounds.left, Math.min(left, bounds.right));
    top = Math.max(bounds.top, Math.min(top, bounds.bottom));
    this.tooltip.x = left;
    this.tooltip.y = top;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  /**
   * Writes the current tooltip model into the already-rendered HTML rows.
   */
  updateTooltipContentDom() {
    const tooltip = this.elements.tooltip;

    if (!tooltip) return;

    const title = this.elements.tooltipTitle;
    const rows = this.elements.tooltipRows;

    title.textContent = this.tooltip.title ?? '';
    if (this.sparklineSeries.items.length > 1) {
      rows.forEach((row, index) => {
        const series = this.tooltip.series[index];
        row.children[0].children[1].textContent = series.label;
        row.children[1].children[0].textContent = series.value;
        row.children[1].children[1].textContent = series.uom ? ` ${series.uom}` : '';
      });
      return;
    }
    rows[0].children[0].textContent = this.tooltip.min?.label ?? '';
    rows[0].children[1].children[0].textContent = this.tooltip.min?.value ?? '';
    rows[0].children[1].children[1].textContent = this.tooltip.min?.uom ? ` ${this.tooltip.min.uom}` : '';
    rows[1].children[0].textContent = this.tooltip.avg?.label ?? '';
    rows[1].children[1].children[0].textContent = this.tooltip.avg?.value ?? '';
    rows[1].children[1].children[1].textContent = this.tooltip.avg?.uom ? ` ${this.tooltip.avg.uom}` : '';
    rows[2].children[0].textContent = this.tooltip.max?.label ?? '';
    rows[2].children[1].children[0].textContent = this.tooltip.max?.value ?? '';
    rows[2].children[1].children[1].textContent = this.tooltip.max?.uom ? ` ${this.tooltip.max.uom}` : '';
  }

  /**
   * Updates the active cartesian bucket or exact state-band segment. This is
   * the common pointer route used by hover and drag after browser coordinates
   * have entered the SVG.
   *
   * @param {MouseEvent|TouchEvent|PointerEvent} e - Current pointer event.
   */
  updateActivePointer(e) {
    this.pointerEvent = e;

    if (this.config.sparkline.show.chart_type === 'state_bands') {
      const pointerX = this.pointToGraphX(this.mouseEventToPoint(e));
      const segment = this.primaryGraph.stateBandSegments.find((stateBand) => pointerX >= stateBand.x && pointerX <= stateBand.x + stateBand.width);

      if (!segment) {
        this.clearTooltip();
        this.updateTooltipVisibilityDom(false);
        this.updateActiveIndicatorDom();
        return;
      }

      this.updateTooltipFromStateBandSegment(segment);
      this.updateTooltipContentDom();
      this.updateActiveIndicatorDom();
      this.updateTooltipPositionDom(e);
      this.updateTooltipVisibilityDom(true);
      return;
    }

    const pointerX = this.pointToGraphX(this.mouseEventToPoint(e));
    this.activeX = this.snapPointerXToGraphPoint(pointerX);
    const pointIndex = this.getPointIndexFromX(this.activeX);
    const previousIndex = this.tooltip.index;

    if (pointIndex === undefined) {
      this.clearTooltip();
      this.updateTooltipVisibilityDom(false);
      this.updateActiveIndicatorDom();
      return;
    }

    this.updateTooltipFromPointIndex(pointIndex, e);
    this.updateTooltipContentDom();

    this.updateActiveIndicatorDom();
    this.updateTooltipPositionDom(e);
    this.updateTooltipVisibilityDom(true);
  }

  /**
   * Rebuilds cartesian tooltip state from a pointer and requests a Lit update.
   * This route is used where direct DOM synchronization is not active.
   *
   * @param {MouseEvent|TouchEvent|PointerEvent} e - Current pointer event.
   */
  updateTooltipFromPointer(e) {
    const pointerX = this.pointToGraphX(this.mouseEventToPoint(e));
    const pointIndex = this.getPointIndexFromX(pointerX);

    if (pointIndex === undefined) {
      this.clearTooltip();
      return;
    }

    this.updateTooltipFromPointIndex(pointIndex, e);
  }

  /**
   * Queues the radial bin identified by the latest pointer coordinates.
   *
   * @param {MouseEvent|TouchEvent|PointerEvent} e - Current pointer event.
   */
  updateRadialActivePointer(e) {
    const pointIndex = this.getRadialPointIndexFromEvent(e);

    // console.log('[updateRadialActivePointer] - pointIndex, e ', pointIndex, e);
    if (!Number.isFinite(pointIndex)) {
      this.clearTooltip();
      this.updateTooltipVisibilityDom(false);
      this.updateActiveIndicatorDom();
      return;
    }

    this.elements.containerRect = this.elements.container.getBoundingClientRect();
    const svgBox = this.elements.svg.getBoundingClientRect();
    const scaleX = svgBox.width / this.svg.width;
    const scaleY = svgBox.height / this.svg.height;
    this.elements.tooltipBounds = {
      left: svgBox.left - this.elements.containerRect.left + (this.graphArea.x + this.primaryGraph.drawArea.x) * scaleX,
      top: svgBox.top - this.elements.containerRect.top + (this.graphArea.y + this.primaryGraph.drawArea.y) * scaleY,
      right: svgBox.left - this.elements.containerRect.left + (this.graphArea.x + this.primaryGraph.drawArea.x + this.primaryGraph.drawArea.width) * scaleX,
      bottom: svgBox.top - this.elements.containerRect.top + (this.graphArea.y + this.primaryGraph.drawArea.y + this.primaryGraph.drawArea.height) * scaleY,
    };
    this.updateTooltipFromRadial(pointIndex, e);
  }

  /**
   * Connects the rendered SVG to the shared hover and drag lifecycle. Handlers
   * are allocated once per tool instance; drag listeners move to window so
   * tracking continues outside the graph and through Safari touch behavior.
   */
  attachPointerHandlers() {
    this.elements.svg = this.card.shadowRoot.getElementById(`sparkline-${this.cardId}-${this.index}`);
    this.elements.container = this.card.shadowRoot.getElementById('container');
    this.elements.activeIndicator = this.card.shadowRoot.getElementById(`sparkline-active-indicator-${this.cardId}-${this.index}`);
    this.elements.tooltip = this.card.shadowRoot.getElementById(`sparkline-tooltip-${this.cardId}-${this.index}`);
    this.elements.tooltipTitle = this.elements.tooltip.querySelector('.sparkline-tooltip__title');
    this.elements.tooltipRows = this.elements.tooltip.querySelectorAll('.sparkline-tooltip__row');
    this.elements.containerRect = this.elements.container.getBoundingClientRect();

    if (!this.elements.svg || this.elements.svg.dataset.pointerReady === 'true') return;

    const isRadialChart = ['radial', 'radial_barcode'].includes(this.config.sparkline.show.chart_type);

    this.elements.svg.dataset.pointerReady = 'true';

    // Handler identity must remain stable: window listeners are removed with
    // the exact function object that was registered during pointer-down.
    this.Frame2 =
      this.Frame2 ||
      function Frame2() {
        this.rid = null;
        if (isRadialChart) {
          this.updateRadialActivePointer(this.pointerEvent);
        } else {
          this.updateActivePointer(this.pointerEvent);
        }
      }.bind(this);

    this.pointerMove =
      this.pointerMove ||
      function pointerMove(e) {
        e.preventDefault();
        // console.log('[pointerMove]', e);

        if (this.dragging) {
          this.pointerEvent = e;
          if (!this.rid) this.rid = window.requestAnimationFrame(this.Frame2);
        }
      }.bind(this);

    this.hoverEnter =
      this.hoverEnter ||
      function hoverEnter(e) {
        const pointIndex = Number(e.currentTarget?.dataset?.pointIndex);
        // console.log('[hoverEnter] - e, pointIndex', e, pointIndex);
        this.pointerEvent = e;
        this.activeX = undefined;
        this._radialPendingLeave = false;
        this._radialPendingPointIndex = pointIndex;
        this._radialPendingEvent = e;
        this.scheduleRadialHoverFrame();
      }.bind(this);

    this.hoverMove =
      this.hoverMove ||
      function hoverMove(e) {
        if (this.dragging) return;

        // console.log('[hoverMove]', e);

        if (!this.hovering) {
          this.hovering = true;
          this.elements.containerRect = this.elements.container.getBoundingClientRect();
          const svgBox = this.elements.svg.getBoundingClientRect();
          const scaleX = svgBox.width / this.svg.width;
          const scaleY = svgBox.height / this.svg.height;
          // Half a bucket extends hover hit testing to both chart edges.
          const hoverPaddingX = isRadialChart ? 0 : this.primaryGraph.coords.length > 1 ? ((this.primaryGraph.coords[1][0] - this.primaryGraph.coords[0][0]) * scaleX) / 2 : 12;
          this.elements.tooltipBounds = {
            left: svgBox.left - this.elements.containerRect.left + (this.graphArea.x + this.primaryGraph.drawArea.x) * scaleX - hoverPaddingX,
            top: svgBox.top - this.elements.containerRect.top + (this.graphArea.y + this.primaryGraph.drawArea.y) * scaleY,
            right: svgBox.left - this.elements.containerRect.left + (this.graphArea.x + this.primaryGraph.drawArea.x + this.primaryGraph.drawArea.width) * scaleX + hoverPaddingX,
            bottom: svgBox.top - this.elements.containerRect.top + (this.graphArea.y + this.primaryGraph.drawArea.y + this.primaryGraph.drawArea.height) * scaleY,
          };
        }

        if (isRadialChart) {
          // console.log('[hoverMove] - isRadialChart -', e);
          this.updateRadialActivePointer(e);
        } else {
          this.updateActivePointer(e);
        }
      }.bind(this);

    this.hoverLeave =
      this.hoverLeave ||
      function hoverLeave(e) {
        if (this.dragging) return;
        // console.log('[hoverLeave]', e);

        this.hovering = false;
        this.pointerEvent = undefined;
        this.activeX = undefined;
        this.clearTooltip();
        this.updateTooltipVisibilityDom(false);
        this.updateActiveIndicatorDom();
      }.bind(this);

    this.barCodeLeave =
      this.barCodeLeave ||
      function barCodeLeave(e) {
        if (this.dragging) return;
        // console.log('[barCodeLeave]', e);

        this.hovering = false;
        this.pointerEvent = undefined;
        this.activeX = undefined;
        this.clearTooltip();
        this.restoreRadialActiveBinDom();
      }.bind(this);

    this.pointerDown =
      this.pointerDown ||
      function pointerDown(e) {
        e.preventDefault();
        // console.log('[pointerDown]', e);

        window.addEventListener('pointermove', this.pointerMove, false);
        window.addEventListener('pointerup', this.pointerUp, false);

        this.dragging = true;
        this.pointerEvent = e;
        this.elements.containerRect = this.elements.container.getBoundingClientRect();
        if (isRadialChart) {
          this.updateRadialActivePointer(e);
        } else {
          this.updateActivePointer(e);
        }
        this.updateTooltipVisibilityDom(true);
        this.updateActiveIndicatorDom();
        this.Frame2();
      }.bind(this);

    this.pointerUp =
      this.pointerUp ||
      function pointerUp(e) {
        e.preventDefault();
        // console.log('[pointerUp]', e);

        window.removeEventListener('pointermove', this.pointerMove, false);
        window.removeEventListener('pointerup', this.pointerUp, false);

        if (!this.dragging) return;

        this.dragging = false;
        this.activeX = undefined;
        this.pointerEvent = undefined;
        this.rid = null;
        this.clearTooltip();
        this.updateTooltipVisibilityDom(false);
        this.updateActiveIndicatorDom();
        this.elements.containerRect = undefined;

        if (isRadialChart) {
          this.restoreRadialActiveBinDom();
        }

        this.Frame2();
      }.bind(this);

    this.touchStart =
      this.touchStart ||
      function touchStart(e) {
        e.preventDefault();
        // console.log('[touchStart]', e);

        window.addEventListener('pointermove', this.pointerMove, false);
        window.addEventListener('pointerup', this.pointerUp, false);

        this.dragging = true;
        this.pointerEvent = e;
        this.elements.containerRect = this.elements.container.getBoundingClientRect();

        if (isRadialChart) {
          this.updateRadialActivePointer(e);
        } else {
          this.updateActivePointer(e);
        }
        this.updateTooltipVisibilityDom(true);
        this.updateActiveIndicatorDom();
        this.Frame2();
      }.bind(this);

    this.mouseDown =
      this.mouseDown ||
      function mouseDown(e) {
        this.pointerDown(e);
      }.bind(this);

    // 2. CORE REGISTRATIONS (Clean and highly scannable)
    this.elements.svg.addEventListener('mousedown', this.mouseDown, false);
    this.elements.svg.addEventListener('touchstart', this.touchStart, { passive: false });

    this.elements.svg.addEventListener('mousemove', this.hoverMove, false);
    this.elements.svg.addEventListener('mouseenter', this.hoverEnter, false);
    this.elements.svg.addEventListener('mouseleave', this.barCodeLeave, false);
    this.elements.svg.addEventListener('mouseleave', this.hoverLeave, false);
  }

  /**
   * Renders the original SAK area mask logic for the sparkline area fill.
   *
   * @param {string} fill - Area path to mask.
   * @param {number} i - Entity index.
   * @returns {TemplateResult|string} Area mask definition.
   */
  renderSvgAreaMask(fill, i) {
    if (this.config.sparkline.show.chart_type !== 'area') return '';
    if (!fill) return '';
    const fade = this.config.sparkline.show.fill === 'fade';
    const init = this.length[i] || this.card.config.entities[i].show_line === false;
    const yZero = this.primaryGraph.min >= 0 ? 0 : (Math.abs(this.primaryGraph.min) / (this.primaryGraph.max - this.primaryGraph.min)) * 100;

    return svg`
      <linearGradient id=${`fill-grad-pos-${this.cardId}-${this.index}-${i}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2=${this.graphArea.height}>
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='0.1'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-pos-${this.cardId}-${this.index}-${i}`} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width=${this.graphArea.width} height=${this.graphArea.height}>
        <rect x="0" y="0" width=${this.graphArea.width} height=${this.graphArea.height * (1 - yZero / 100)} fill=${`url(#fill-grad-pos-${this.cardId}-${this.index}-${i})`}
         />
      </mask>
      <linearGradient id=${`fill-grad-neg-${this.cardId}-${this.index}-${i}`} gradientUnits="userSpaceOnUse" x1="0" y1=${this.graphArea.height} x2="0" y2="0">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='0.1'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-neg-${this.cardId}-${this.index}-${i}`} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width=${this.graphArea.width} height=${this.graphArea.height}>
        <rect x="0" y=${this.graphArea.height * (1 - yZero / 100)} width=${this.graphArea.width} height=${this.graphArea.height * (yZero / 100)} fill=${`url(#fill-grad-neg-${this.cardId}-${this.index}-${i})`}
         />
      </mask>

    <mask id=${`fill-${this.cardId}-${this.index}-${i}`} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width=${this.graphArea.width} height=${this.graphArea.height}>
      <path class='fill'
        type=${this.config.sparkline.show.fill}
        .id=${i} anim=${this.config.sparkline.animate} ?init=${init}
        style="animation-delay: ${this.config.sparkline.animate ? `${i * 0.5}s` : '0s'}"
        fill='white'
        mask=${fade ? `url(#fill-grad-mask-pos-${this.cardId}-${this.index}-${i})` : ''}
        d=${fill}
      />
      ${
        this.primaryGraph.min < 0
          ? svg`<path class='fill'
            type=${this.config.sparkline.show.fill}
            .id=${i} anim=${this.config.sparkline.animate} ?init=${init}
            style="animation-delay: ${this.config.sparkline.animate ? `${i * 0.5}s` : '0s'}"
            fill='white'
            mask=${fade ? `url(#fill-grad-mask-neg-${this.cardId}-${this.index}-${i})` : ''}
            d=${fill}
          />`
          : ''
      }
    </mask>`;
  }

  /**
   * Renders area as a colored background rect through the area mask.
   *
   * @param {string} fill - Area path to show.
   * @param {number} i - Entity index.
   * @returns {TemplateResult|string} Area background SVG.
   */
  renderSvgAreaBackground(fill, i) {
    if (this.config.sparkline.show.chart_type !== 'area') return '';
    if (!fill) return '';

    const areaStyles = this.getAreaStyles();
    const backgroundStyles = areaStyles;
    backgroundStyles.fill = this.getSparklineBackgroundPaint(areaStyles);
    backgroundStyles.stroke = 'none';

    return svg`
      <rect
        class="sparkline-area-rect"
        x="0"
        y="0"
        width="${this.graphArea.width}"
        height="${this.graphArea.height}"
        style=${styleMap(this.getRenderStyles(backgroundStyles))}
        mask="url(#fill-${this.cardId}-${this.index}-${i})"
      ></rect>
    `;
  }

  /**
   * Renders the min/max area background when enabled.
   *
   * @param {string} fill - Min/max area path.
   * @param {number} i - Entity index.
   * @returns {TemplateResult|string} Area min/max background SVG.
   */
  renderSvgAreaMinMaxMask(fill, i) {
    if (!['area', 'line'].includes(this.config.sparkline.show.chart_type)) return '';
    if (!fill) return '';

    return svg`
      <mask id=${`fillMinMax-${this.cardId}-${this.index}-${i}`}>
        <path
          class='fill'
          type=${this.config.sparkline.show.fill}
          .id=${i} anim=${this.config.sparkline.animate} ?init=${this.length[i]}
          style="animation-delay: ${this.config.sparkline.animate ? `${i * 0.5}s` : '0s'}"
          fill='white'
          d=${fill}
        />
      </mask>
    `;
  }

  /**
   * Renders the min/max area background when enabled.
   *
   * @param {string} fill - Min/max area path.
   * @param {number} i - Entity index.
   * @returns {TemplateResult|string} Area min/max background SVG.
   */
  renderSvgAreaMinMaxBackground(fill, i) {
    if (!['area', 'line'].includes(this.config.sparkline.show.chart_type)) return '';
    if (!fill) return '';

    const areaStyles = this.getAreaStyles();
    const backgroundStyles = areaStyles;
    backgroundStyles.fill = this.getSparklineBackgroundPaint(areaStyles);
    backgroundStyles.stroke = 'none';

    return svg`
      <rect
        class="sparkline-area-rect"
        x="0"
        y="0"
        width="${this.graphArea.width}"
        height="${this.graphArea.height}"
        style=${styleMap(this.getRenderStyles(backgroundStyles))}
        mask="url(#fillMinMax-${this.cardId}-${this.index}-${i})"
      ></rect>
    `;
  }

  /**
   * Renders the mask used for gradient-backed line drawing.
   *
   * @param {string} line - Line path.
   * @param {number} i - Entity index.
   * @returns {TemplateResult|string} Line mask definition.
   */
  renderSvgLineMask(line, i) {
    if (this.config.sparkline.show.line !== true) return '';
    if (!line) return '';

    const lineStyles = this.getLineStyles();

    return svg`
      <mask id="sparkline-line-${this.cardId}-${this.index}-${i}">
        <path
          class="sparkline-line-mask"
          fill="none"
          stroke="white"
          stroke-width="${lineStyles['stroke-width']}"
          stroke-linecap="${lineStyles['stroke-linecap']}"
          stroke-linejoin="${lineStyles['stroke-linejoin']}"
          stroke-dasharray="${lineStyles['stroke-dasharray']}"
          stroke-dashoffset="${lineStyles['stroke-dashoffset']}"
          d="${line}"
        ></path>
      </mask>
    `;
  }

  /**
   * Renders the line background through the line mask.
   *
   * @param {string} line - Line path.
   * @param {number} i - Entity index.
   * @returns {TemplateResult|string} Line background SVG.
   */
  renderSvgLineBackground(line, i) {
    if (this.config.sparkline.show.line !== true) return '';
    if (!line) return '';

    const lineStyles = this.getLineStyles();
    const backgroundStyles = lineStyles;
    backgroundStyles.fill = this.getSparklineBackgroundPaint(lineStyles);
    backgroundStyles.stroke = 'none';

    delete backgroundStyles['stroke-width'];
    delete backgroundStyles['stroke-linecap'];
    delete backgroundStyles['stroke-linejoin'];

    return svg`
      <rect
        class="sparkline-line-rect"
        x="0"
        y="0"
        width="${this.graphArea.width}"
        height="${this.graphArea.height}"
        style=${styleMap(this.getRenderStyles(backgroundStyles))}
        mask="url(#sparkline-line-${this.cardId}-${this.index}-${i})"
      ></rect>
    `;
  }

  /**
   * Renders the line min/max background through the min/max line mask.
   *
   * @param {string} line - Line path.
   * @param {number} i - Entity index.
   * @returns {TemplateResult|string} Line min/max background SVG.
   */
  renderSvgLineMinMaxMask(line, i) {
    if (this.config.sparkline.show.chart_type !== 'line') return '';
    if (!line) return '';

    const lineStyles = this.getLineStyles();

    return svg`
      <mask id="sparkline-lineMinMax-${this.cardId}-${this.index}-${i}">
        <path
          class="sparkline-line-mask"
          fill="none"
          stroke="white"
          stroke-width="${lineStyles['stroke-width']}"
          stroke-linecap="${lineStyles['stroke-linecap']}"
          stroke-linejoin="${lineStyles['stroke-linejoin']}"
          stroke-dasharray="${lineStyles['stroke-dasharray']}"
          stroke-dashoffset="${lineStyles['stroke-dashoffset']}"
          d="${line}"
        ></path>
      </mask>
    `;
  }

  /**
   * Renders the line min/max background through the min/max line mask.
   *
   * @param {string} line - Line path.
   * @param {number} i - Entity index.
   * @returns {TemplateResult|string} Line min/max background SVG.
   */
  renderSvgLineMinMaxBackground(line, i) {
    if (this.config.sparkline.show.chart_type !== 'line') return '';
    if (!line) return '';

    const lineStyles = this.getLineStyles();
    const backgroundStyles = lineStyles;
    backgroundStyles.fill = this.getSparklineBackgroundPaint(lineStyles);
    backgroundStyles.stroke = 'none';

    delete backgroundStyles['stroke-width'];
    delete backgroundStyles['stroke-linecap'];
    delete backgroundStyles['stroke-linejoin'];

    return svg`
      <rect
        class="sparkline-line-rect"
        x="0"
        y="0"
        width="${this.graphArea.width}"
        height="${this.graphArea.height}"
        style=${styleMap(this.getRenderStyles(backgroundStyles))}
        mask="url(#sparkline-lineMinMax-${this.cardId}-${this.index}-${i})"
      ></rect>
    `;
  }

  /**
   * Renders the mask used for gradient-backed line drawing.
   *
   * @returns {TemplateResult|string} Line mask definition.
   */
  renderLineMask() {
    if (!this.linePath) return '';

    const lineStyles = this.getLineStyles();

    return svg`
      <mask id="sparkline-line-${this.cardId}-${this.index}">
        <path
          class="sparkline-line-mask"
          fill="none"
          stroke="white"
          stroke-width="${lineStyles['stroke-width']}"
          stroke-linecap="${lineStyles['stroke-linecap']}"
          stroke-linejoin="${lineStyles['stroke-linejoin']}"
          stroke-dasharray="${lineStyles['stroke-dasharray']}"
          stroke-dashoffset="${lineStyles['stroke-dashoffset']}"
          d="${this.linePath}"
        ></path>
      </mask>
    `;
  }

  /**
   * Renders SAK-style SVG gradients produced from sparkline.colorstops.colors.
   *
   * @param {Array<Array<object>>} gradients - Gradient stop lists.
   * @returns {TemplateResult|string} SVG gradient definitions.
   */
  renderSvgGradient(gradients) {
    if (!gradients) return '';

    const items = gradients.map((gradient, i) => {
      if (!gradient) return '';

      return svg`
        <linearGradient id=${`grad-${this.cardId}-${this.index}-${i}`} gradientTransform="rotate(90)">
          ${gradient.map(
            (stop) => svg`
            <stop stop-color=${stop.color} offset=${`${stop.offset}%`}></stop>
          `,
          )}
        </linearGradient>
      `;
    });

    return svg`${items}`;
  }

  /**
   * Builds line styles in the same order as the other FHS tools: base styles,
   * item styles, then line-specific styles. Rendering applies getRenderStyles().
   *
   * @returns {object} Line style dictionary before render filters.
   */
  getLineStyles() {
    const styles = Merge.mergeDeep(this.getStyles({ fill: 'none' }), ConfigHelper.toStyleDict(this.config.sparkline.line?.styles));
    styles['stroke-width'] = this.getConfiguredLineWidth(this.config);
    return styles;
  }

  /**
   * Selects the visible series color using the same precedence as entity tools:
   * entity override, calculated color stop, indexed line color, then the first
   * series color.
   *
   * @param {number|string} inState - Value represented by the SVG item.
   * @param {number} i - Entity or series index.
   * @returns {string} CSS color for the rendered item.
   */
  computeColor(inState, i) {
    const { colorstops, line_color, colorstops_transition } = this.config.sparkline;
    const state = Number(inState) || 0;
    const thresholdColor = Colors.calculateStrokeColor(state, colorstops, colorstops_transition === 'smooth');

    return this.card.config.entities[i].color || thresholdColor || line_color[i] || line_color[0];
  }

  /**
   * Converts a configured x-axis ticksize into hours. X-axis ticksize is time
   * based, for example 15min, 1h or 6h.
   *
   * @param {string|number} ticksize - Configured x-axis tick interval.
   * @returns {number} Tick interval in hours.
   */
  xTicksizeToHours(ticksize) {
    if (typeof ticksize === 'number') return ticksize;

    const match = ticksize.match(/^(\d+(?:\.\d+)?)(m|min|h|hour)$/);
    const value = Number(match[1]);
    const unit = match[2];

    if (unit === 'm' || unit === 'min') return value / 60;
    return value;
  }

  /**
   * Reads the configured axis label font size from the style dictionary. The
   * builder uses this to size auto ticks without inventing a second config.
   *
   * @param {string} axis - x or y.
   * @param {number} fallback - Default font size in pixels.
   * @returns {number} Font size in pixels.
   */
  resolveAxisFontSizePixels(axis, fallback = FONT_SIZE) {
    const fontSize = this.config[`${axis}_axis`]?.labels?.styles?.['font-size'];

    if (typeof fontSize === 'number') {
      return fontSize;
    }

    if (typeof fontSize !== 'string') {
      return fallback;
    }

    const value = Number.parseFloat(fontSize);

    if (!Number.isFinite(value)) {
      return fallback;
    }

    if (fontSize.endsWith('px')) {
      return value;
    }

    if (fontSize.endsWith('em') || fontSize.endsWith('rem')) {
      return value * FONT_SIZE;
    }

    if (fontSize.endsWith('%')) {
      return (value / 100) * FONT_SIZE;
    }

    return value;
  }

  /**
   * Calculates the auto x-axis tick size from available width and label font
   * size. This reuses the example perfect-axis logic for the interval choice.
   *
   * @param {string} level - major or minor.
   * @param {object} range - History range returned by getHistoryRange().
   * @returns {number} Tick interval in hours.
   */
  getAutoXAxisTicksize(level, range) {
    const fontSizePixels = this.resolveAxisFontSizePixels('x', FONT_SIZE);
    const fontWidthPixels = Math.max(3, fontSizePixels * (level === 'minor' ? 0.35 : 0.45));
    const perfect = this.calculatePerfectXAxis(range.start, range.end, this.primaryGraph.drawArea.width, fontWidthPixels);

    return perfect.ticksize / (60 * 60 * 1000);
  }

  /**
   * Calculates the auto y-axis tick size from available height and label font
   * size. This reuses the example perfect-axis logic for the interval choice.
   *
   * @param {string} level - major or minor.
   * @returns {number} Tick interval in data units.
   */
  getAutoYAxisTicksize(level) {
    const fontSizePixels = this.resolveAxisFontSizePixels('y', FONT_SIZE);
    const fontHeightPixels = Math.max(6, fontSizePixels * (level === 'minor' ? 0.65 : 0.85));
    const perfect = this.calculatePerfectYAxis(this.primaryGraph.min, this.primaryGraph.max, this.primaryGraph.drawArea.height, fontHeightPixels);

    return level === 'minor' ? Math.max(perfect.interval / 2, 0.5) : Math.max(perfect.interval, 0.5);
  }

  /**
   * Calculates human-readable Y-axis ticks, limits, and intervals for a chart.
   *
   * @param {number} dataMin - The lowest sensor value in the dataset.
   * @param {number} dataMax - The highest sensor value in the dataset.
   * @param {number} chartHeightPixels - The vertical height of the SVG chart area.
   * @param {number} fontHeightPixels - The size of the font used for labels (default: 12).
   * @returns {object} An object containing grid limits, interval, and an array of tick values.
   */
  calculatePerfectYAxis(dataMin, dataMax, chartHeightPixels, fontHeightPixels = FONT_SIZE) {
    // 1. Prevent crash if min and max are identical (e.g., a flat line of a constant value)
    if (dataMin === dataMax) {
      dataMin -= 1;
      dataMax += 1;
    }

    // 2. Calculate maximum labels that can fit vertically including padding (2x font height)
    const minSpacePerLabel = fontHeightPixels * 1.5;
    const maxLabels = Math.floor(chartHeightPixels / minSpacePerLabel);

    // Safety check: always allow at least 2 labels (bottom and top)
    const effectiveMaxLabels = Math.max(maxLabels, 2);

    // 3. Calculate raw step size
    const range = dataMax - dataMin;
    const rawStep = range / (effectiveMaxLabels - 1);

    // 4. Logarithmic magic: determine the order of magnitude (the exponent)
    const exponent = Math.floor(Math.log10(rawStep));
    const powerOfTen = 10 ** exponent;

    // 5. Normalize the step size to a value between 1 and 10
    const normalizedStep = rawStep / powerOfTen;

    // 6. Select the closest clean "human-friendly" interval
    let chosenStep;
    if (normalizedStep <= 1.0) chosenStep = 1.0;
    else if (normalizedStep <= 2.0) chosenStep = 2.0;
    else if (normalizedStep <= 5.0) chosenStep = 5.0;
    else chosenStep = 10.0;

    // The final interval (e.g., 0.5 or 5000)
    const interval = chosenStep * powerOfTen;

    // 7. Round the min and max limits to clean numbers (Nice Scaling)
    const gridMin = Math.floor(dataMin / interval) * interval;
    const gridMax = Math.ceil(dataMax / interval) * interval;

    // 8. Generate all individual tick values for the grid lines
    const ticks = [];
    let currentValue = gridMin;

    // Prevent infinite loops caused by JS floating-point rounding errors
    const precision = Math.max(0, -exponent + 2);

    while (currentValue <= gridMax + interval / 100) {
      ticks.push(Number(currentValue.toFixed(precision)));
      currentValue += interval;
    }

    // Return all data required to render the SVG
    return {
      gridMin: Number(gridMin.toFixed(precision)),
      gridMax: Number(gridMax.toFixed(precision)),
      interval,
      ticks, // The list of values where lines and labels should be drawn
    };
  }

  /**
   * Calculates human-readable X-axis time ticks and formats them for SVG.
   * Switches to a date format (e.g., "5 Jul") on midnight transitions.
   *
   * @param {number|Date} minTime - The earliest timestamp in the data (ms or Date).
   * @param {number|Date} maxTime - The latest timestamp in the data (ms or Date).
   * @param {number} chartWidthPixels - The horizontal width of the SVG chart area.
   * @param {number} fontWidthPixels - Average pixel width of a character (default: 7).
   * @returns {array} Array of tick objects containing value, x-coordinate, and string label.
   */
  calculatePerfectXAxis(minTime, maxTime, chartWidthPixels, fontWidthPixels = FONT_SIZE * 0.6) {
    const minMs = new Date(minTime).getTime();
    const maxMs = new Date(maxTime).getTime();
    const totalDuration = maxMs - minMs;

    if (totalDuration <= 0) return { ticksize: 0, ticks: [] };

    const approxLabelWidth = 1 * fontWidthPixels + FONT_SIZE; // 16;
    const maxLabels = Math.floor(chartWidthPixels / approxLabelWidth);
    const effectiveMaxLabels = Math.max(maxLabels, 4);
    const minTimeStep = totalDuration / (effectiveMaxLabels - 1);

    const timeIntervals = [1000, 5000, 15000, 30000, 60000, 300000, 600000, 900000, 1800000, 3600000, 7200000, 14400000, 21600000, 43200000, 86400000, 172800000, 604800000, 2629800000];

    let selectedIndex = timeIntervals.findIndex((interval) => interval >= minTimeStep);
    if (selectedIndex < 0) {
      selectedIndex = timeIntervals.length - 1;
    }

    while (selectedIndex > 0 && totalDuration / timeIntervals[selectedIndex] < 2) {
      selectedIndex -= 1;
    }

    const selectedInterval = timeIntervals[selectedIndex];

    let currentTickMs = Math.ceil(minMs / selectedInterval) * selectedInterval;
    const ticks = [];
    let previousTickDate = null;

    while (currentTickMs <= maxMs) {
      const tickDate = new Date(currentTickMs);
      const percentage = (currentTickMs - minMs) / totalDuration;
      const xPixel = percentage * chartWidthPixels;
      const tickDay = tickDate.toDateString();
      const previousTickDay = previousTickDate ? previousTickDate.toDateString() : null;
      const label = !previousTickDate || tickDay !== previousTickDay ? formatDateVeryShort(tickDate, this.card._hass.locale, this.card._hass.config) : formatTime(tickDate, this.card._hass.locale, this.card._hass.config);

      ticks.push({
        value: currentTickMs,
        x: Number(xPixel.toFixed(1)),
        label,
      });

      previousTickDate = tickDate;
      currentTickMs += selectedInterval;
    }

    return { ticksize: selectedInterval, ticks };
  }

  /**
   * Builds x-axis ticks from the configured period and ticksize. The current
   * today period renders the full 00:00 -> 24:00 range so grid and labels stay
   * stable while the day progresses.
   *
   * @param {string} level - major or minor.
   * @returns {Array<object>} X-axis ticks.
   */
  /**
   * Builds x-axis ticks from the graph bucket starts and graph coordinates.
   * Grid, tickmarks and labels must use the same x values as the rendered
   * graph points. Therefore this maps each tick time to a bucket index and
   * reads x from Graph.coords instead of recalculating chart geometry here.
   *
   * @param {string} level - major or minor.
   * @returns {Array<object>} X-axis ticks.
   */
  buildXAxisTicks(level) {
    const ticks = [];

    this.primaryGraph.xAxis.ticks.forEach((tick) => {
      const label = tick.isMidnight ? formatDateVeryShort(tick.time, this.card._hass.locale, this.card._hass.config) : formatTime(tick.time, this.card._hass.locale, this.card._hass.config);

      ticks.push({
        axis: 'x',
        level,
        value: tick.timestamp,
        x: tick.x,
        label,
        isPeriodEnd: tick.isPeriodEnd === true,
      });
    });

    return ticks;
  }

  /**
   * Builds y-axis ticks from the effective graph bounds and configured ticksize.
   * If the visible range is smaller than the ticksize and no configured tick
   * falls inside the range, the y grid/labels intentionally render nothing.
   *
   * @param {string} level - major or minor.
   * @returns {Array<object>} Y-axis ticks.
   */
  buildYAxisTicks(level, graph) {
    if (graph.config.sparkline.show.chart_type === 'state_bands') {
      return graph.yAxis.ticks.map((tick) => ({
        axis: 'y',
        level,
        value: tick.value,
        y: tick.y,
        labelY: tick.labelY,
        fontSize: tick.fontSize,
        label: tick.label,
      }));
    }

    const formatter = new Intl.NumberFormat(this.card._hass.locale?.language || this.card._hass.language);
    const ticks = [];

    graph.yAxis.ticks.forEach((tick) => {
      ticks.push({
        axis: 'y',
        level,
        value: tick.value,
        y: tick.y,
        label: formatter.format(tick.value),
      });
    });

    return ticks;
  }

  /**
   * Returns the ticks used for a labels layer. xlabels_at/ylabels_at decide
   * which configured tick set receives labels.
   *
   * @param {string} axis - x or y.
   * @returns {Array<object>} Label ticks.
   */
  buildLabelTicks(axis, graph) {
    const labelsAt = graph.config.sparkline.show[axis + 'labels_at'];

    if (labelsAt === 'none') return [];
    return axis === 'x' ? this.buildXAxisTicks('major') : this.buildYAxisTicks('major', graph);
  }

  /** Renders time spokes and concentric value arcs for a radial chart. */
  renderRadialGrid() {
    const graph = this.primaryGraph;
    const geometry = graph.getRadialGeometry();
    const chartAxes = CHART_AXES[this.config.sparkline.show.chart_type];
    const xStyles = this.getRenderStyles(ConfigHelper.toStyleDict(this.config.x_axis.grid_major.styles));
    const yGraph = this.axisGraphs.primary ?? this.axisGraphs.secondary;
    const yStyles = this.getRenderStyles(ConfigHelper.toStyleDict(yGraph.config.y_axis.grid_major.styles));
    const xTicks = this.buildXAxisTicks('major').filter((tick) => geometry.arcDegrees < 360 || !tick.isPeriodEnd);
    const yTicks = this.buildYAxisTicks('major', yGraph);

    return svg`
      ${
        chartAxes.x && this.config.sparkline.show.grid.x
          ? xTicks.map((tick) => {
              const fraction = (tick.x - graph.drawArea.x) / graph.drawArea.width;
              const angle = graph.getRadialAngleForFraction(fraction);
              const start = graph.getRadialPoint(geometry.innerRadius, angle);
              const end = graph.getRadialPoint(geometry.outerRadius, angle);
              return svg`<line class="sparkline-radial-grid--x" x1=${start.x} y1=${start.y} x2=${end.x} y2=${end.y} style=${styleMap(xStyles)}></line>`;
            })
          : ''
      }
      ${
        CHART_AXES[yGraph.config.sparkline.show.chart_type].y && yGraph.config.sparkline.show.grid.y
          ? yTicks.map((tick) => {
              const radius = yGraph.getRadialRadiusForValue(tick.value);
              return svg`<path class="sparkline-radial-grid--y" d=${graph.getRadialPlotArcPath(radius)} fill="none" style=${styleMap(yStyles)}></path>`;
            })
          : ''
      }
    `;
  }

  /** Renders the configured annular plot background behind every radial series. */
  renderRadialBackground() {
    if (!this.config.sparkline.show.background) return '';

    const styles = this.getRenderStyles(ConfigHelper.toStyleDict(this.config.sparkline.radial.background.styles));
    return svg`<path class="sparkline-radial-background" d=${this.primaryGraph.getRadialBackgroundPath()} fill-rule="evenodd" style=${styleMap(styles)}></path>`;
  }

  /**
   * Renders exact sun-state intervals as the shared layer behind every graph
   * series. SparklineGraph supplies either rectangle or annular geometry, so
   * this method only applies the separately configured day and night styles.
   *
   * @returns {object|string} Lit SVG day/night layer or an empty result.
   */
  renderDayNightLayer() {
    if (!this.config.sparkline.show.day_night || this.dayNightSegments.length === 0 || !this.graphReady) return '';

    const range = this.getDayNightRange();
    const dayNightConfig = {
      mode: this.config.sparkline.day_night.mode,
      position: this.config.sparkline.day_night.position,
      size: Utils.calculateSvgDimension(this.config.sparkline.day_night.size),
      offset: Utils.calculateSvgDimension(this.config.sparkline.day_night.offset),
    };

    return svg`
      <g class='sparkline-day-night' pointer-events='none'>
        ${this.dayNightSegments.map((segment) => {
          const geometry = this.primaryGraph.getTimeRangeGeometry(segment.start, segment.end, range.start, range.end, dayNightConfig);
          const styles = this.getRenderStyles(this.config.sparkline.day_night[segment.state].styles);

          return geometry.type === 'radial'
            ? svg`<path class='sparkline-day-night__${segment.state}' d=${geometry.path} fill-rule='evenodd' style=${styleMap(styles)}></path>`
            : svg`<rect class='sparkline-day-night__${segment.state}' x=${geometry.x} y=${geometry.y} width=${geometry.width} height=${geometry.height} style=${styleMap(styles)}></rect>`;
        })}
      </g>
    `;
  }

  /** Renders the outer time arc and primary/secondary radial value axes. */
  renderRadialAxis() {
    const graph = this.primaryGraph;
    const geometry = graph.getRadialGeometry();
    const chartAxes = CHART_AXES[this.config.sparkline.show.chart_type];
    const outerPath = graph.getRadialPlotArcPath(geometry.outerRadius);
    const primaryAngle = graph.getRadialValueAxisAngle('primary');
    const secondaryAngle = graph.getRadialValueAxisAngle('secondary');
    const primaryStart = graph.getRadialPoint(geometry.innerRadius, primaryAngle);
    const primaryEnd = graph.getRadialPoint(geometry.outerRadius, primaryAngle);
    const secondaryStart = graph.getRadialPoint(geometry.innerRadius, secondaryAngle);
    const secondaryEnd = graph.getRadialPoint(geometry.outerRadius, secondaryAngle);
    const xStyles = this.getRenderStyles(ConfigHelper.toStyleDict(this.config.x_axis.axis.styles));
    const primaryStyles = this.axisGraphs.primary ? this.getRenderStyles(ConfigHelper.toStyleDict(this.axisGraphs.primary.config.y_axis.axis.styles)) : {};
    const secondaryStyles = this.axisGraphs.secondary ? this.getRenderStyles(ConfigHelper.toStyleDict(this.axisGraphs.secondary.config.y_axis.axis.styles)) : {};

    return svg`
      ${chartAxes.x && this.config.sparkline.show.axis.x ? svg`<path class="sparkline-radial-axis--x" d=${outerPath} fill="none" style=${styleMap(xStyles)}></path>` : ''}
      ${this.axisGraphs.primary && CHART_AXES[this.axisGraphs.primary.config.sparkline.show.chart_type].y && this.axisGraphs.primary.config.sparkline.show.axis.y ? svg`<line class="sparkline-radial-axis--y" x1=${primaryStart.x} y1=${primaryStart.y} x2=${primaryEnd.x} y2=${primaryEnd.y} style=${styleMap(primaryStyles)}></line>` : ''}
      ${this.axisGraphs.secondary && CHART_AXES[this.axisGraphs.secondary.config.sparkline.show.chart_type].y && this.axisGraphs.secondary.config.sparkline.show.axis.y ? svg`<line class="sparkline-radial-axis--y-secondary" x1=${secondaryStart.x} y1=${secondaryStart.y} x2=${secondaryEnd.x} y2=${secondaryEnd.y} style=${styleMap(secondaryStyles)}></line>` : ''}
    `;
  }

  /** Renders angular time marks and tangent value marks. */
  renderRadialTickmarks() {
    const graph = this.primaryGraph;
    const geometry = graph.getRadialGeometry();
    const chartAxes = CHART_AXES[this.config.sparkline.show.chart_type];
    const xSize = Utils.calculateSvgDimension(this.config.x_axis.tickmarks_major.size);
    const xStyles = this.getRenderStyles(ConfigHelper.toStyleDict(this.config.x_axis.tickmarks_major.styles));
    const xTicks = this.buildXAxisTicks('major').filter((tick) => geometry.arcDegrees < 360 || !tick.isPeriodEnd);
    const axisItems = [
      { graph: this.axisGraphs.primary, angle: graph.getRadialValueAxisAngle('primary'), direction: -1, suffix: '' },
      { graph: this.axisGraphs.secondary, angle: graph.getRadialValueAxisAngle('secondary'), direction: 1, suffix: '-secondary' },
    ];

    return svg`
      ${
        chartAxes.x && this.config.sparkline.show.tickmarks.x
          ? xTicks.map((tick) => {
              const fraction = (tick.x - graph.drawArea.x) / graph.drawArea.width;
              const angle = graph.getRadialAngleForFraction(fraction);
              const inner = graph.getRadialPoint(geometry.outerRadius, angle);
              const outer = graph.getRadialPoint(geometry.outerRadius + xSize, angle);
              return svg`<line class="sparkline-radial-tickmark--x" x1=${inner.x} y1=${inner.y} x2=${outer.x} y2=${outer.y} style=${styleMap(xStyles)}></line>`;
            })
          : ''
      }
      ${axisItems.map((axis) => {
        if (!axis.graph || !CHART_AXES[axis.graph.config.sparkline.show.chart_type].y || !axis.graph.config.sparkline.show.tickmarks.y) return '';
        const size = Utils.calculateSvgDimension(axis.graph.config.y_axis.tickmarks_major.size);
        const styles = this.getRenderStyles(ConfigHelper.toStyleDict(axis.graph.config.y_axis.tickmarks_major.styles));
        const tangent = graph.getRadialTangentOffset(axis.angle, size * axis.direction);
        return this.buildYAxisTicks('major', axis.graph).map((tick) => {
          const radius = axis.graph.getRadialRadiusForValue(tick.value);
          const point = graph.getRadialPoint(radius, axis.angle);
          return svg`<line class="sparkline-radial-tickmark--y${axis.suffix}" x1=${point.x} y1=${point.y} x2=${point.x + tangent.x} y2=${point.y + tangent.y} style=${styleMap(styles)}></line>`;
        });
      })}
    `;
  }

  /** Renders horizontal time and value labels around the radial plot. */
  renderRadialAxisLabels() {
    const graph = this.primaryGraph;
    const geometry = graph.getRadialGeometry();
    const chartAxes = CHART_AXES[this.config.sparkline.show.chart_type];
    const xTickSize = chartAxes.x && this.config.sparkline.show.tickmarks.x ? Utils.calculateSvgDimension(this.config.x_axis.tickmarks_major.size) : 0;
    const xOffset = Utils.calculateSvgDimension(this.config.x_axis.labels.offset);
    const xLabelStyles = ConfigHelper.toStyleDict(this.config.x_axis.labels.styles);
    const xTicks = this.buildLabelTicks('x', graph).filter((tick) => {
      const fraction = (tick.x - graph.drawArea.x) / graph.drawArea.width;
      return geometry.arcDegrees < 360 || fraction < 1;
    });
    const xLabelItems = xTicks.map((tick, tickIndex) => {
      const fraction = (tick.x - graph.drawArea.x) / graph.drawArea.width;
      const angle = graph.getRadialAngleForFraction(fraction);
      let arcSize = geometry.anglePerBin;

      // Adjacent tick centers bound the arc available to this label. At an arc
      // endpoint the sole neighbour supplies that same natural interval.
      if (tickIndex > 0) {
        const previousTick = xTicks[tickIndex - 1];
        const previousFraction = (previousTick.x - graph.drawArea.x) / graph.drawArea.width;
        arcSize = Math.abs(angle - graph.getRadialAngleForFraction(previousFraction));
      }
      if (tickIndex < xTicks.length - 1) {
        const nextTick = xTicks[tickIndex + 1];
        const nextFraction = (nextTick.x - graph.drawArea.x) / graph.drawArea.width;
        const nextArcSize = Math.abs(graph.getRadialAngleForFraction(nextFraction) - angle);
        arcSize = tickIndex > 0 ? Math.min(arcSize, nextArcSize) : nextArcSize;
      }

      return { tick, angle, arcSize };
    });
    const axisItems = [
      { graph: this.axisGraphs.primary, angle: graph.getRadialValueAxisAngle('primary'), direction: -1, suffix: '' },
      { graph: this.axisGraphs.secondary, angle: graph.getRadialValueAxisAngle('secondary'), direction: 1, suffix: '-secondary' },
    ];

    return svg`
      ${
        chartAxes.x && this.config.sparkline.show.labels.x
          ? xLabelItems.map((labelItem, tickIndex) => {
              const { tick, angle, arcSize } = labelItem;
              const radius = geometry.outerRadius + xTickSize + xOffset;
              const point = graph.getRadialPoint(radius, angle);

              if (this.config.x_axis.labels.orientation === 'arc') {
                // Arc labels follow a short path around their tick. Reverse the
                // lower-half path so its text remains upright and readable.
                const normalizedAngle = ((angle % 360) + 360) % 360;
                const isTopHalf = normalizedAngle <= 90 || normalizedAngle >= 270;
                const startAngle = angle - arcSize / 2;
                const endAngle = angle + arcSize / 2;
                const pathStart = graph.getRadialPoint(radius, isTopHalf ? startAngle : endAngle);
                const pathEnd = graph.getRadialPoint(radius, isTopHalf ? endAngle : startAngle);
                const sweepFlag = isTopHalf ? 1 : 0;
                const pathId = `${this.cardId}-sparkline-${this.index}-radial-x-label-${tickIndex}`;
                const styles = this.getRenderStyles({ ...xLabelStyles, "text-anchor": "middle", "dominant-baseline": "text-after-edge" });

                return svg`
                  <path id=${pathId} class="sparkline-radial-label-path--x" d="M ${pathStart.x} ${pathStart.y} A ${radius} ${radius} 0 0 ${sweepFlag} ${pathEnd.x} ${pathEnd.y}" fill="none" stroke="none"></path>
                  <text class="sparkline-radial-label--x" style=${styleMap(styles)}>
                    <textPath href="#${pathId}" startOffset="50%" text-anchor="middle" dominant-baseline="central">${tick.label}</textPath>
                  </text>
                `;
              }

              // Horizontal labels align away from the circumference. At the
              // top and bottom they stay centered and use the outward edge.
              const angleRadians = (angle * Math.PI) / 180;
              const horizontalDirection = Math.sin(angleRadians);
              const verticalDirection = -Math.cos(angleRadians);
              const textAnchor = horizontalDirection < -0.1 ? 'end' : horizontalDirection > 0.1 ? 'start' : 'middle';
              const dominantBaseline = verticalDirection < -0.1 ? 'text-after-edge' : verticalDirection > 0.1 ? 'hanging' : 'middle';
              const styles = this.getRenderStyles({ ...xLabelStyles, 'text-anchor': textAnchor, 'dominant-baseline': dominantBaseline });
              return svg`<text class="sparkline-radial-label--x" x=${point.x} y=${point.y} style=${styleMap(styles)}>${tick.label}</text>`;
            })
          : ''
      }
      ${axisItems.map((axis) => {
        if (!axis.graph || !CHART_AXES[axis.graph.config.sparkline.show.chart_type].y || !axis.graph.config.sparkline.show.labels.y) return '';
        const tickSize = axis.graph.config.sparkline.show.tickmarks.y ? Utils.calculateSvgDimension(axis.graph.config.y_axis.tickmarks_major.size) : 0;
        const offset = Utils.calculateSvgDimension(axis.graph.config.y_axis.labels.offset);
        const tangent = graph.getRadialTangentOffset(axis.angle, (tickSize + offset) * axis.direction);
        const textAnchor = tangent.x < 0 ? 'end' : tangent.x > 0 ? 'start' : 'middle';
        const styles = this.getRenderStyles({ ...ConfigHelper.toStyleDict(axis.graph.config.y_axis.labels.styles), 'text-anchor': textAnchor, 'dominant-baseline': 'middle' });
        return this.buildLabelTicks('y', axis.graph).map((tick) => {
          const radius = axis.graph.getRadialRadiusForValue(tick.value);
          const point = graph.getRadialPoint(radius, axis.angle);
          return svg`<text class="sparkline-radial-label--y${axis.suffix}" x=${point.x + tangent.x} y=${point.y + tangent.y} style=${styleMap(styles)}>${tick.label}</text>`;
        });
      })}
    `;
  }
  /**
   * Renders the grid layer behind the graph. Grid lines are based on major
   * ticks by default, matching the horseshoe-style tick model.
   *
   * @returns {TemplateResult|string} Grid layer SVG.
   */
  renderGrid() {
    if (['radial', 'radial_barcode'].includes(this.config.sparkline.show.chart_type)) return this.renderRadialGrid();
    const chartAxes = CHART_AXES[this.config.sparkline.show.chart_type];
    const showX = this.config.sparkline.show.grid.x && chartAxes.x;
    const primaryGraph = this.axisGraphs.primary;
    const secondaryGraph = this.axisGraphs.secondary;
    const yGraph = primaryGraph !== undefined ? primaryGraph : secondaryGraph;
    const showY = yGraph !== undefined && yGraph.config.sparkline.show.grid.y && CHART_AXES[yGraph.config.sparkline.show.chart_type].y;
    if (!showX && !showY) return '';

    const xStyles = this.getRenderStyles(ConfigHelper.toStyleDict(this.config.x_axis.grid_major.styles));
    let yStyles;
    if (yGraph !== undefined) yStyles = this.getRenderStyles(ConfigHelper.toStyleDict(yGraph.config.y_axis.grid_major.styles));
    const xTicks = this.buildXAxisTicks('major');
    const yTicks =
      yGraph !== undefined && yGraph.config.sparkline.show.chart_type === 'state_bands'
        ? yGraph.yAxis.gridTicks.map((tick) => ({ axis: 'y', level: 'major', value: tick.value, y: tick.y }))
        : yGraph !== undefined
          ? this.buildYAxisTicks('major', yGraph)
          : [];

    return svg`
      ${
        showX
          ? svg`<g class="sparkline-grid sparkline-grid--x" style="pointer-events:none;">
        ${xTicks.map(
          (tick) => svg`
          <line
            class="sparkline-grid-line sparkline-grid-line--x-major"
            x1="${tick.x}"
            y1="${this.primaryGraph.axisArea.y}"
            x2="${tick.x}"
            y2="${this.primaryGraph.axisArea.y + this.primaryGraph.axisArea.height}"
            style=${styleMap(xStyles)}
          ></line>
        `,
        )}
      </g>`
          : ''
      }
      ${
        showY
          ? svg`<g class="sparkline-grid sparkline-grid--y" style="pointer-events:none;">
        ${yTicks.map(
          (tick) => svg`
          <line
            class="sparkline-grid-line sparkline-grid-line--y-major"
            x1="${yGraph.axisArea.x}"
            y1="${tick.y}"
            x2="${yGraph.axisArea.x + yGraph.axisArea.width}"
            y2="${tick.y}"
            style=${styleMap(yStyles)}
          ></line>
        `,
        )}
      </g>`
          : ''
      }
    `;
  }

  /**
   * Renders the x/y axis baselines as a separate layer. The x-axis baseline is
   * the bottom edge of the graph draw area; the y-axis baseline is the left edge.
   *
   * @returns {TemplateResult|string} Axis layer SVG.
   */
  renderAxis() {
    if (['radial', 'radial_barcode'].includes(this.config.sparkline.show.chart_type)) return this.renderRadialAxis();
    const chartAxes = CHART_AXES[this.config.sparkline.show.chart_type];
    const showX = this.config.sparkline.show.axis.x && chartAxes.x;
    const primaryGraph = this.axisGraphs.primary;
    const secondaryGraph = this.axisGraphs.secondary;
    const showPrimaryY = primaryGraph !== undefined && primaryGraph.config.sparkline.show.axis.y && CHART_AXES[primaryGraph.config.sparkline.show.chart_type].y;
    const showSecondaryY = secondaryGraph !== undefined && secondaryGraph.config.sparkline.show.axis.y && CHART_AXES[secondaryGraph.config.sparkline.show.chart_type].y;
    if (!showX && !showPrimaryY && !showSecondaryY) return '';

    const xStyles = this.getRenderStyles(ConfigHelper.toStyleDict(this.config.x_axis.axis.styles));
    const primaryYStyles = primaryGraph !== undefined ? this.getRenderStyles(ConfigHelper.toStyleDict(primaryGraph.config.y_axis.axis.styles)) : undefined;
    const secondaryYStyles = secondaryGraph !== undefined ? this.getRenderStyles(ConfigHelper.toStyleDict(secondaryGraph.config.y_axis.axis.styles)) : undefined;
    const rightX = secondaryGraph !== undefined ? secondaryGraph.axisArea.x + secondaryGraph.axisArea.width : 0;

    return svg`
      <g class="sparkline-axis" style="pointer-events:none;">
        ${
          showX
            ? svg`<line
          class="sparkline-axis-line sparkline-axis-line--x"
          x1="${this.primaryGraph.axisArea.x}"
          y1="${this.primaryGraph.axisArea.y + this.primaryGraph.axisArea.height}"
          x2="${this.primaryGraph.axisArea.x + this.primaryGraph.axisArea.width}"
          y2="${this.primaryGraph.axisArea.y + this.primaryGraph.axisArea.height}"
          style=${styleMap(xStyles)}
        ></line>`
            : ''
        }
        ${
          showPrimaryY
            ? svg`<line
          class="sparkline-axis-line sparkline-axis-line--y"
          x1="${primaryGraph.axisArea.x}"
          y1="${primaryGraph.axisArea.y}"
          x2="${primaryGraph.axisArea.x}"
          y2="${primaryGraph.axisArea.y + primaryGraph.axisArea.height}"
          style=${styleMap(primaryYStyles)}
        ></line>`
            : ''
        }
        ${
          showSecondaryY
            ? svg`<line
          class="sparkline-axis-line sparkline-axis-line--y-secondary"
          x1="${rightX}"
          y1="${secondaryGraph.axisArea.y}"
          x2="${rightX}"
          y2="${secondaryGraph.axisArea.y + secondaryGraph.axisArea.height}"
          style=${styleMap(secondaryYStyles)}
        ></line>`
            : ''
        }
      </g>
    `;
  }

  /**
   * Renders axis tickmarks as a separate layer above the graph.
   *
   * @returns {TemplateResult|string} Tickmark layer SVG.
   */
  renderTickmarks() {
    if (['radial', 'radial_barcode'].includes(this.config.sparkline.show.chart_type)) return this.renderRadialTickmarks();
    const chartAxes = CHART_AXES[this.config.sparkline.show.chart_type];
    const showX = this.config.sparkline.show.tickmarks.x && chartAxes.x;
    const primaryGraph = this.axisGraphs.primary;
    const secondaryGraph = this.axisGraphs.secondary;
    const showPrimaryY = primaryGraph !== undefined && primaryGraph.config.sparkline.show.tickmarks.y && CHART_AXES[primaryGraph.config.sparkline.show.chart_type].y;
    const showSecondaryY = secondaryGraph !== undefined && secondaryGraph.config.sparkline.show.tickmarks.y && CHART_AXES[secondaryGraph.config.sparkline.show.chart_type].y;
    if (!showX && !showPrimaryY && !showSecondaryY) return '';

    const xTickConfig = this.config.x_axis.tickmarks_major;
    const xStyles = this.getRenderStyles(ConfigHelper.toStyleDict(xTickConfig.styles));
    const xTicks = this.buildXAxisTicks('major');
    const xTickSize = Utils.calculateSvgDimension(xTickConfig.size);
    const primaryYStyles = primaryGraph !== undefined ? this.getRenderStyles(ConfigHelper.toStyleDict(primaryGraph.config.y_axis.tickmarks_major.styles)) : undefined;
    const secondaryYStyles = secondaryGraph !== undefined ? this.getRenderStyles(ConfigHelper.toStyleDict(secondaryGraph.config.y_axis.tickmarks_major.styles)) : undefined;
    const primaryYTicks = primaryGraph !== undefined ? this.buildYAxisTicks('major', primaryGraph) : [];
    const secondaryYTicks = secondaryGraph !== undefined ? this.buildYAxisTicks('major', secondaryGraph) : [];
    const primaryYTickSize = primaryGraph !== undefined ? Utils.calculateSvgDimension(primaryGraph.config.y_axis.tickmarks_major.size) : 0;
    const secondaryYTickSize = secondaryGraph !== undefined ? Utils.calculateSvgDimension(secondaryGraph.config.y_axis.tickmarks_major.size) : 0;
    const rightX = secondaryGraph !== undefined ? secondaryGraph.axisArea.x + secondaryGraph.axisArea.width : 0;

    return svg`
      ${
        showX
          ? svg`<g class="sparkline-tickmarks sparkline-tickmarks--x" style="pointer-events:none;">
        ${xTicks.map(
          (tick) => svg`
          <line
            class="sparkline-tickmark sparkline-tickmark--x-major"
            x1="${tick.x}"
            y1="${this.primaryGraph.axisArea.y + this.primaryGraph.axisArea.height}"
            x2="${tick.x}"
            y2="${this.primaryGraph.axisArea.y + this.primaryGraph.axisArea.height + xTickSize}"
            style=${styleMap(xStyles)}
          ></line>
        `,
        )}
      </g>`
          : ''
      }
      ${
        showPrimaryY
          ? svg`<g class="sparkline-tickmarks sparkline-tickmarks--y" style="pointer-events:none;">
        ${primaryYTicks.map(
          (tick) => svg`
          <line
            class="sparkline-tickmark sparkline-tickmark--y-major"
            x1="${primaryGraph.axisArea.x - primaryYTickSize}"
            y1="${tick.y}"
            x2="${primaryGraph.axisArea.x}"
            y2="${tick.y}"
            style=${styleMap(primaryYStyles)}
          ></line>
        `,
        )}
      </g>`
          : ''
      }
      ${
        showSecondaryY
          ? svg`<g class="sparkline-tickmarks sparkline-tickmarks--y-secondary" style="pointer-events:none;">
        ${secondaryYTicks.map(
          (tick) => svg`
          <line
            class="sparkline-tickmark sparkline-tickmark--y-secondary-major"
            x1="${rightX}"
            y1="${tick.y}"
            x2="${rightX + secondaryYTickSize}"
            y2="${tick.y}"
            style=${styleMap(secondaryYStyles)}
          ></line>
        `,
        )}
      </g>`
          : ''
      }
    `;
  }

  /**
   * Renders axis labels as a separate top layer. Labels use the same tick values
   * as grid and tickmarks so the layers stay aligned.
   *
   * @returns {TemplateResult|string} Label layer SVG.
   */
  renderAxisLabels() {
    if (['radial', 'radial_barcode'].includes(this.config.sparkline.show.chart_type)) return this.renderRadialAxisLabels();
    const chartAxes = CHART_AXES[this.config.sparkline.show.chart_type];
    const showX = this.config.sparkline.show.labels.x && chartAxes.x;
    const primaryGraph = this.axisGraphs.primary;
    const secondaryGraph = this.axisGraphs.secondary;
    const showPrimaryY = primaryGraph !== undefined && primaryGraph.config.sparkline.show.labels.y && CHART_AXES[primaryGraph.config.sparkline.show.chart_type].y;
    const showSecondaryY = secondaryGraph !== undefined && secondaryGraph.config.sparkline.show.labels.y && CHART_AXES[secondaryGraph.config.sparkline.show.chart_type].y;
    if (!showX && !showPrimaryY && !showSecondaryY) return '';

    const xStyles = this.getRenderStyles(ConfigHelper.toStyleDict(this.config.x_axis.labels.styles));
    const primaryYStyles = primaryGraph !== undefined ? this.getRenderStyles(ConfigHelper.toStyleDict(primaryGraph.config.y_axis.labels.styles)) : undefined;
    const secondaryYStyles = secondaryGraph !== undefined ? this.getRenderStyles(ConfigHelper.toStyleDict(secondaryGraph.config.y_axis.labels.styles)) : undefined;
    const xTicks = this.buildLabelTicks('x', this.primaryGraph);
    const primaryYTicks = primaryGraph !== undefined ? this.buildLabelTicks('y', primaryGraph) : [];
    const secondaryYTicks = secondaryGraph !== undefined ? this.buildLabelTicks('y', secondaryGraph) : [];
    const xTickSize = this.config.sparkline.show.tickmarks.x && chartAxes.x ? Utils.calculateSvgDimension(this.config.x_axis.tickmarks_major.size) : 0;
    const primaryYTickSize =
      primaryGraph !== undefined && primaryGraph.config.sparkline.show.tickmarks.y && CHART_AXES[primaryGraph.config.sparkline.show.chart_type].y
        ? Utils.calculateSvgDimension(primaryGraph.config.y_axis.tickmarks_major.size)
        : 0;
    const secondaryYTickSize =
      secondaryGraph !== undefined && secondaryGraph.config.sparkline.show.tickmarks.y && CHART_AXES[secondaryGraph.config.sparkline.show.chart_type].y
        ? Utils.calculateSvgDimension(secondaryGraph.config.y_axis.tickmarks_major.size)
        : 0;
    const primaryYLabelOffset = primaryGraph !== undefined ? Utils.calculateSvgDimension(primaryGraph.config.y_axis.labels.offset) : 0;
    const secondaryYLabelOffset = secondaryGraph !== undefined ? Utils.calculateSvgDimension(secondaryGraph.config.y_axis.labels.offset) : 0;
    const stateBands = primaryGraph !== undefined && primaryGraph.config.sparkline.show.chart_type === 'state_bands';
    const rightX = secondaryGraph !== undefined ? secondaryGraph.axisArea.x + secondaryGraph.axisArea.width : 0;

    return svg`
      ${
        showX
          ? svg`<g class="sparkline-labels sparkline-labels--x" style="pointer-events:none;">
        ${xTicks.map(
          (tick) => svg`
          <text
            class="sparkline-label sparkline-label--x"
            x="${tick.x}"
            y="${this.primaryGraph.axisArea.y + this.primaryGraph.axisArea.height + xTickSize + Utils.calculateSvgDimension(this.config.x_axis.labels.offset)}"
            style=${styleMap(xStyles)}
          >${tick.label}</text>
        `,
        )}
      </g>`
          : ''
      }
      ${
        showPrimaryY
          ? svg`<g class="sparkline-labels sparkline-labels--y" style="pointer-events:none;">
        ${primaryYTicks.map(
          (tick) => svg`
          <text
            class="sparkline-label sparkline-label--y"
            x="${stateBands ? primaryGraph.drawArea.x + primaryYLabelOffset : primaryGraph.axisArea.x - primaryYTickSize - primaryYLabelOffset}"
            y="${stateBands ? tick.labelY : tick.y}"
            style=${styleMap(stateBands ? { ...primaryYStyles, 'font-size': `${tick.fontSize}px` } : primaryYStyles)}
          >${tick.label}</text>
        `,
        )}
      </g>`
          : ''
      }
      ${
        showSecondaryY
          ? svg`<g class="sparkline-labels sparkline-labels--y-secondary" style="pointer-events:none;">
        ${secondaryYTicks.map(
          (tick) => svg`
          <text
            class="sparkline-label sparkline-label--y-secondary"
            x="${rightX + secondaryYTickSize + secondaryYLabelOffset}"
            y="${tick.y}"
            style=${styleMap({ ...secondaryYStyles, 'text-anchor': 'start' })}
          >${tick.label}</text>
        `,
        )}
      </g>`
          : ''
      }
    `;
  }

  /**
   * Builds area styles in the same order as the other FHS tools: base styles,
   * item styles, then area-specific styles. Rendering applies getRenderStyles().
   *
   * @returns {object} Area style dictionary before render filters.
   */
  getAreaStyles() {
    return Merge.mergeDeep(this.getStyles({}), ConfigHelper.toStyleDict(this.config.area?.styles));
  }

  /**
   * Returns the SAK-style graph background paint. Colorstops create a gradient
   * background; fixed styles keep their configured foreground/background color.
   * The line itself is never painted with a gradient.
   *
   * @param {object} styles - Render-ready style dictionary.
   * @returns {string} Fill for the background rectangle behind a mask.
   */
  getSparklineBackgroundPaint(styles) {
    if (this.config.sparkline.colorstops.colors.length > 0) {
      return `url(#grad-${this.cardId}-${this.index}-0)`;
    }

    return styles.stroke || styles.fill;
  }

  /**
   * Renders area by drawing a styled rectangle through the area mask.
   *
   * @returns {TemplateResult|string} Area SVG.
   */
  renderArea() {
    return this.renderSvgAreaBackground(this.areaPath, this.entity_index);
  }

  /**
   * Renders the line exactly like SAK: a background rectangle is visible only
   * through the white line mask. Gradients come from colorstops on the
   * background, never from painting the line path itself.
   *
   * @returns {TemplateResult|string} Line SVG.
   */
  renderLine() {
    return this.renderSvgLineBackground(this.linePath, this.entity_index);
  }

  /**
   * Renders dots on the graph when show.points or line/area show_dots is set.
   * The points use the graph engine coordinates directly so they stay aligned
   * with the line and the active pointer.
   *
   * @returns {TemplateResult|string} Points SVG.
   */

  renderSvgPoint(point, i, bucketStart) {
    const color = this.computeColor(point[V], i);
    const radius = Utils.calculateSvgDimension(this.config.sparkline.dots.radius);
    return svg`
    <circle
      class='line--point'
      ?inactive=${this.tooltip.index !== point[3]}
      style=${`--mcg-hover: ${color};`}
      data-point-index=${point[3]}
      data-state=${point[V]}
      data-bucket-start=${bucketStart}
      data-bucket-end=${new Date(bucketStart).getTime() + (60 / this.primaryGraph.points) * 60 * 1000}
      stroke=${color}
      fill=${color}
      cx=${point[X]} cy=${point[Y]} r=${radius}
    >
      ${
        this.config.sparkline.animate && (this.config.period.type === 'real_time' || this.sparklineSeries.primaryItem.historySeries)
          ? svg`
        <animate
          attributeName='cy'
          from=${this.animationBaselineY}
          to=${point[Y]}
          begin='0s'
          dur='2s'
          fill='remove'
          restart='whenNotActive'
          repeatCount='1'
          calcMode='spline'
          keyTimes='0; 1'
          keySplines='0.215 0.61 0.355 1'
        ></animate>
      `
          : ''
      }
    </circle>
  `;
  }

  // @mouseover=${(e) => this.updateTooltipFromPointIndex(point[3], e)}
  // @mouseout=${() => this.clearTooltip()}

  /**
   * Renders one series of point markers. Each marker keeps its bucket index and
   * timestamp so the shared pointer lifecycle can recover tooltip metadata.
   *
   * @param {Array<Array<number>>} points - SVG point tuples.
   * @param {number} i - Series index.
   * @returns {object|undefined} Lit SVG template for the point group.
   */
  renderSvgPoints(points, i) {
    if (!points) return;
    const color = this.computeColor(this.card.entities[i].state, i);
    return svg`
    <g class='line--points'
      ?tooltip=${this.tooltip.entity === i}
      ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== i}
      ?init=${this.length[i]}
      anim=${this.config.sparkline.animate && this.config.sparkline.show.points !== 'hover'}
      style="animation-delay: ${this.config.sparkline.animate ? `${i * 0.5 + 0.5}s` : '0s'}"
      stroke-width=${this.svg.line_width / 2}
      fill=${color}
      stroke=${color}
      >
      ${points.map((point, pointIndex) => this.renderSvgPoint(point, i, this.primaryGraph.bucketMeta[pointIndex].start.toISOString()))}
    </g>`;
  }

  /**
   * Builds point tuples only for chart modes that expose dots, then delegates
   * the actual SVG and animation attributes to the series renderer.
   *
   * @returns {object|string} Lit SVG template or an empty result.
   */
  renderPoints() {
    if (this.config.sparkline.show.chart_type !== 'dots' && this.config.sparkline.show.points !== true && this.config.sparkline.line?.show_dots !== true && this.config.sparkline.area?.show_dots !== true) return '';

    const points = this.primaryGraph.calculateYCoordinates(this.primaryGraph.coords).map((point, pointIndex) => [point[X], point[Y], point[V], pointIndex]);

    return this.renderSvgPoints(points, 0);
  }

  /**
   * Renders the HTML tooltip shell inside the card container. Pointer updates
   * write into these stable nodes directly, while a normal Lit render recreates
   * the same state after entity or configuration changes.
   *
   * @returns {object} Lit HTML template for the tooltip.
   */
  renderTooltip() {
    const tooltipStyles = ConfigHelper.toStyleDict(this.config.sparkline.tooltip?.styles);
    const styles = {
      left: this.tooltip.x !== undefined ? `${this.tooltip.x}px` : '0px',
      top: this.tooltip.y !== undefined ? `${this.tooltip.y}px` : '0px',
      transform: 'translate(-50%, calc(-100% - 6px))',
      'font-size': tooltipStyles['font-size'] ?? '0.5em',
      'max-width': 'calc(100% - 24px)',
      'pointer-events': 'none',
      display: this.tooltipVisible ? 'block' : 'none',
    };
    const valueCellStyles = {
      display: 'inline-flex',
      'align-items': 'baseline',
      'justify-content': 'flex-end',
      'text-align': 'right',
      'white-space': 'nowrap',
    };
    const unitStyles = {
      'font-size': '0.72em',
      transform: 'translateY(-0.32em)',
      opacity: '0.8',
    };

    return html`
      <div id="sparkline-tooltip-${this.cardId}-${this.index}" class="sparkline-tooltip" style=${styleMap(styles)}>
        <div class="sparkline-tooltip__title"></div>
        ${
          this.sparklineSeries.items.length > 1
            ? this.sparklineSeries.items.map(
                (item, index) => html`
            <div class="sparkline-tooltip__row sparkline-tooltip__row--series">
              <span style=${styleMap({ display: 'inline-flex', alignItems: 'center', gap: '0.35em' })}>
                <span class="sparkline-tooltip__series-color" style=${styleMap({ width: '0.7em', height: '0.7em', background: item.config.color ?? item.entityConfig.color ?? item.config.sparkline.line_color[index], borderRadius: '50%' })}></span>
                <span></span>
              </span>
              <span style=${styleMap(valueCellStyles)}>
                <span></span>
                <span style=${styleMap(unitStyles)}></span>
              </span>
            </div>
          `,
              )
            : html`
            <div class="sparkline-tooltip__row"><span></span><span style=${styleMap(valueCellStyles)}><span></span><span style=${styleMap(unitStyles)}></span></span></div>
            <div class="sparkline-tooltip__row"><span></span><span style=${styleMap(valueCellStyles)}><span></span><span style=${styleMap(unitStyles)}></span></span></div>
            <div class="sparkline-tooltip__row"><span></span><span style=${styleMap(valueCellStyles)}><span></span><span style=${styleMap(unitStyles)}></span></span></div>
          `
        }
      </div>
    `;
  }

  /**
   * Covers the cartesian draw area with one transparent interaction surface.
   * SVG only receives pointer events over painted shapes; this surface keeps
   * tooltip tracking continuous in the empty space between visual marks.
   *
   * @returns {TemplateResult|string} Cartesian interaction surface.
   */
  renderCartesianHitArea() {
    if (['radial', 'radial_barcode', 'graded', 'state_bands'].includes(this.config.sparkline.show.chart_type)) return svg``;

    return svg`
      <rect
        class="sparkline-cartesian-hit-area"
        x="${this.primaryGraph.drawArea.x}"
        y="${this.primaryGraph.drawArea.y}"
        width="${this.primaryGraph.drawArea.width}"
        height="${this.primaryGraph.drawArea.height}"
        fill="rgba(0, 0, 0, 0)"
        pointer-events="all"
      ></rect>
    `;
  }

  /**
   * Covers the configured radial sector with one transparent interaction
   * surface. Pointer-to-bin conversion remains owned by SparklineGraph.
   *
   * @returns {TemplateResult} Radial interaction surface.
   */
  renderRadialHitArea() {
    const geometry = this.primaryGraph.getRadialGeometry();
    const radius = geometry.innerRadius + geometry.radialSize / 2;
    const path = this.primaryGraph.getRadialPlotArcPath(radius);

    return svg`
      <path
        class="sparkline-radial-hit-area"
        d=${path}
        fill="none"
        stroke="rgba(0, 0, 0, 0)"
        stroke-width=${geometry.radialSize}
        pointer-events="stroke"
      ></path>
    `;
  }
  /**
   * Renders the active cartesian position or radial bucket angle.
   *
   * @returns {TemplateResult|string} Active indicator SVG.
   */
  renderActiveIndicator() {
    if (this.config.sparkline.show.chart_type === 'radial_barcode' || this.config.sparkline.show.chart_type === 'graded') return '';

    if (this.config.sparkline.show.chart_type === 'radial') {
      const geometry = this.primaryGraph.getRadialGeometry();
      const angle = this.activePoint === undefined ? undefined : this.primaryGraph.getRadialAngleForBin(this.activePoint);
      const start = angle === undefined ? { x: geometry.centerX, y: geometry.centerY } : this.primaryGraph.getRadialPoint(geometry.innerRadius, angle);
      const end = angle === undefined ? { x: geometry.centerX, y: geometry.centerY } : this.primaryGraph.getRadialPoint(geometry.outerRadius, angle);
      return svg`
        <line
          id="sparkline-active-indicator-${this.cardId}-${this.index}"
          class="sparkline-active-indicator sparkline-active-indicator--radial"
          x1=${start.x}
          y1=${start.y}
          x2=${end.x}
          y2=${end.y}
          style="stroke:var(--primary-text-color);stroke-width:1;opacity:0.45;visibility:${this.activePoint === undefined ? 'hidden' : 'visible'};pointer-events:none;"
        ></line>
      `;
    }

    return svg`
      <line
        id="sparkline-active-indicator-${this.cardId}-${this.index}"
        class="sparkline-active-indicator"
        x1="${this.activeX ?? 0}"
        y1="${this.primaryGraph.drawArea.y}"
        x2="${this.activeX ?? 0}"
        y2="${this.primaryGraph.drawArea.y + this.primaryGraph.drawArea.height}"
        style="stroke:var(--primary-text-color);stroke-width:1;opacity:0.45;visibility:${this.activeX === undefined ? 'hidden' : 'visible'};pointer-events:none;"
      ></line>
    `;
  }
  /**
   * Renders the continuous state-band background shape as a mask. Expanded
   * segment rectangles provide the border around each foreground segment and
   * rounded transition lines connect consecutive states behind those segments.
   *
   * @returns {TemplateResult|string} State-band background mask definition.
   */
  renderSvgStateBandsMask() {
    if (this.config.sparkline.show.chart_type !== 'state_bands') return '';

    const padding = Utils.calculateSvgDimension(this.config.sparkline.state_bands.background.padding);
    const connectionWidth = Utils.calculateSvgDimension(this.config.sparkline.state_bands.background.connection_width);
    const radius = Utils.calculateSvgDimension(this.config.sparkline.state_bands.radius) + padding;
    const rows = this.primaryGraph.yAxis.rows.concat().sort((left, right) => left.y - right.y);
    const gradientStartY = rows[0].y;
    const gradientEndY = rows[rows.length - 1].y;

    return svg`
      <linearGradient
        id=${`state-bands-bg-gradient-${this.cardId}-${this.index}`}
        gradientUnits='userSpaceOnUse'
        x1='0'
        y1=${gradientStartY}
        x2='0'
        y2=${gradientEndY}
      >
        ${rows.map(
          (row) => svg`
            <stop
              offset=${`${((row.y - gradientStartY) / (gradientEndY - gradientStartY)) * 100}%`}
              stop-color=${this.computeColor(row.value, this.entity_index)}
            ></stop>
          `,
        )}
      </linearGradient>
      <mask id=${`state-bands-bg-${this.cardId}-${this.index}`}>
        ${this.primaryGraph.stateBandTransitions.map(
          (transition) => svg`
            <line
              x1=${transition.x}
              y1=${transition.fromY}
              x2=${transition.x}
              y2=${transition.toY}
              stroke='white'
              stroke-width=${connectionWidth}
              stroke-linecap='round'
            ></line>
          `,
        )}
        ${this.primaryGraph.stateBandSegments.map((segment) => {
          const x = segment.x - padding;
          const width = segment.width + padding * 2;

          return svg`
            <rect
              x=${x}
              y=${segment.y - padding}
              width=${width}
              height=${segment.height + padding * 2}
              rx=${radius}
              ry=${radius}
              fill='white'
            ></rect>
          `;
        })}
      </mask>
    `;
  }

  /**
   * Renders the vertical state-color gradient through the separate state-band
   * background mask. Foreground state segments are rendered independently.
   *
   * @returns {TemplateResult|string} State-band background SVG layer.
   */
  renderSvgStateBandsBackground() {
    if (this.config.sparkline.show.chart_type !== 'state_bands') return '';

    const backgroundStyles = this.getRenderStyles(ConfigHelper.toStyleDict(this.config.sparkline.state_bands.background.styles));
    const padding = Utils.calculateSvgDimension(this.config.sparkline.state_bands.background.padding);

    return svg`
      <rect
        class='state-bands__background'
        x=${this.primaryGraph.drawArea.x - padding}
        y=${this.primaryGraph.drawArea.y}
        width=${this.primaryGraph.drawArea.width + padding * 2}
        height=${this.primaryGraph.drawArea.height}
        fill=${`url(#state-bands-bg-gradient-${this.cardId}-${this.index})`}
        mask=${`url(#state-bands-bg-${this.cardId}-${this.index})`}
        style=${styleMap(backgroundStyles)}
      ></rect>
    `;
  }

  /**
   * Renders exact state periods as colored horizontal bands. The transparent
   * hit area keeps the existing whole-graph pointer flow active between bands.
   *
   * @returns {TemplateResult|string} State-band SVG layer.
   */
  renderSvgStateBands() {
    if (this.config.sparkline.show.chart_type !== 'state_bands') return '';

    const animate = this.config.sparkline.animate && this.sparklineSeries.primaryItem.historySeries;
    const configuredStyles = this.getRenderStyles(Merge.mergeDeep(this.getStyles({}), ConfigHelper.toStyleDict(this.config.sparkline.state_bands.styles)));

    return svg`
      <g class='state-bands'>
        <rect
          class='state-bands__hit-area'
          x=${this.primaryGraph.drawArea.x}
          y=${this.primaryGraph.drawArea.y}
          width=${this.primaryGraph.drawArea.width}
          height=${this.primaryGraph.drawArea.height}
          stroke-width='0'
          opacity='0'
        ></rect>
        ${this.stateBands.map((row) =>
          // eslint-disable-next-line @stylistic/implicit-arrow-linebreak
          row.segments.map((segment) => {
            const color = this.computeColor(segment.value, this.entity_index);
            const segmentStyles = {
              ...configuredStyles,
              fill: color,
              stroke: color,
            };

            return svg`
              <rect
                class='state-bands__segment'
                data-state=${segment.state}
                data-value=${segment.value}
                data-start=${segment.start.toISOString()}
                data-end=${segment.end.toISOString()}
                x=${segment.x}
                y=${segment.y}
                width=${segment.width}
                height=${segment.height}
                rx=${Utils.calculateSvgDimension(this.config.sparkline.state_bands.radius)}
                ry=${Utils.calculateSvgDimension(this.config.sparkline.state_bands.radius)}
                style=${styleMap(segmentStyles)}
              >
                ${
                  animate
                    ? svg`
                    <animate
                      attributeName='width'
                      from='0'
                      to=${segment.width}
                      begin='0s'
                      dur='2s'
                      fill='remove'
                      restart='whenNotActive'
                      repeatCount='1'
                      calcMode='spline'
                      keyTimes='0; 1'
                      keySplines='0.215 0.61 0.355 1'
                    ></animate>
                  `
                    : ''
                }
              </rect>
            `;
          }),
        )}
      </g>
    `;
  }

  /**
   * Renders the graded background and foreground rectangles with their configured styles.
   * The computed color remains authoritative for fill and stroke.
   *
   * @param {object} trafficLight - Graded rectangle geometry and values.
   * @param {number} i - Rendered series index.
   * @returns {TemplateResult} Graded rectangle SVG.
   */
  renderSvgTrafficLight(trafficLight, i) {
    const backgroundStyles = { ...this.config.sparkline.graded.background.styles };
    const foregroundStyles = { ...this.config.sparkline.graded.foreground.styles };
    const backgroundColor = 'var(--theme-sys-elevation-surface-neutral4)';

    // Graded colors are calculated per rectangle and cannot be overridden by styles.
    delete backgroundStyles.fill;
    delete backgroundStyles.stroke;
    delete foregroundStyles.fill;
    delete foregroundStyles.stroke;

    return svg`
      ${this.gradeRanks.map((grade, k) => {
        const value = trafficLight.value[k];
        const hasValue = typeof value !== 'undefined';
        const foregroundColor = hasValue ? this.computeColor(value + 0.001, 0) : 'transparent';
        const rectY = Array.isArray(trafficLight.y) ? trafficLight.y[k] : trafficLight.y;
        const rectHeight = Math.max(1, trafficLight.height - this.svg.line_width);
        const rectWidth = Math.max(1, trafficLight.width - this.svg.line_width);

        return svg`
          <rect
            class='traffic-light-background'
            x=${trafficLight.x + this.svg.line_width / 2}
            y=${rectY - trafficLight.height + this.svg.line_width / 2}
            height=${rectHeight}
            width=${rectWidth}
            fill=${backgroundColor}
            stroke=${backgroundColor}
            stroke-width=${this.svg.line_width ? this.svg.line_width : 0}
            pathLength='10'
            style=${styleMap(this.getRenderStyles(backgroundStyles))}
          ></rect>
          <rect
            class='traffic-light-foreground'
            x=${trafficLight.x + this.svg.line_width / 2}
            y=${rectY - trafficLight.height + this.svg.line_width / 2}
            height=${rectHeight}
            width=${rectWidth}
            fill=${foregroundColor}
            stroke=${foregroundColor}
            stroke-width=${this.svg.line_width ? this.svg.line_width : 0}
            pathLength='10'
            style=${styleMap(this.getRenderStyles(foregroundStyles))}
          ></rect>
        `;
      })}
    `;
  }

  /**
   * Renders the traffic-light grade collection for one entity series.
   *
   * @param {Array<object>} trafficLights - Calculated grade rectangles.
   * @param {number} i - Entity or series index.
   * @returns {object|string} Lit SVG template or an empty result.
   */
  renderSvgGraded(trafficLights, i) {
    if (!trafficLights) return '';
    const color = this.computeColor(this.card.entities[i].state, i);

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
        ${trafficLights.map((trafficLight) => this.renderSvgTrafficLight(trafficLight, i))}
      </g>
    `;
  }

  /**
   * Builds the luminance mask that reveals equalizer foreground buckets.
   * Real-time mode keeps every SVG bucket stable and changes opacity; history
   * mode sizes the mask from aggregated values and may animate its introduction.
   *
   * @param {Array<object>} equalizer - Equalizer geometry from SparklineGraph.
   * @param {number} index - Entity or series index used in the mask id.
   * @returns {object|string} Lit SVG mask template or an empty result.
   */
  renderSvgEqualizerMask(equalizer, index) {
    if (this.config.sparkline.show.chart_type !== 'equalizer') return '';
    if (!equalizer) return '';

    // History-backed graphs first render a temporary current-state series.
    // Start the SVG animation only when the requested history is available.
    const animate = this.config.sparkline.animate && (this.config.period.type === 'real_time' || this.sparklineSeries.primaryItem.historySeries);
    const animationStartY = this.animationBaselineY;

    // Real-time keeps every bucket in the mask so state updates only change
    // opacity. Stable SVG nodes can fade in and out; historical equalizers
    // retain their existing value-sized masks and introduction animation.
    if (this.config.period.type === 'real_time') {
      equalizer = equalizer.map((equalizerPart) => {
        const realTimePart = {
          ...equalizerPart,
          activeLevelCount: equalizerPart.value.length,
          value: [],
          y: [],
        };

        for (let levelIndex = 0; levelIndex < this.config.sparkline.equalizer.value_buckets; levelIndex += 1) {
          realTimePart.value[levelIndex] = this.primaryGraph.min + levelIndex * this.primaryGraph.valuesPerBucket;
          realTimePart.y[levelIndex] = this.primaryGraph.drawArea.y + this.primaryGraph.drawArea.height - levelIndex * (equalizerPart.height + this.svg.row_spacing);
        }

        return realTimePart;
      });
    }

    // Square mode uses the smallest generated dimension for both axes. When
    // the level height shrinks, redistribute all levels over the graph area.
    if (this.config.sparkline.equalizer.square === true) {
      const size = Math.min(equalizer[0].width, equalizer[0].height);
      const levelSpacing = size < equalizer[0].height ? (this.primaryGraph.drawArea.height - this.config.sparkline.equalizer.value_buckets * size) / (this.config.sparkline.equalizer.value_buckets - 1) : 0;

      equalizer = equalizer.map((equalizerPart) => {
        const squarePart = { ...equalizerPart };
        if (size < equalizerPart.height) {
          squarePart.y = equalizerPart.y.map((level, levelIndex) => this.primaryGraph.drawArea.y + this.primaryGraph.drawArea.height - levelIndex * (size + levelSpacing));
        }
        squarePart.width = size;
        squarePart.height = size;
        return squarePart;
      });
    }

    return svg`
      <mask id=${`equalizer-bg-${this.cardId}-${index}`}>
        ${equalizer.map((equalizerPart) => {
          return equalizerPart.value.map(
            (single, j) => svg`
          <rect
            x=${equalizerPart.x}
            y=${equalizerPart.y[j] - equalizerPart.height}
            height=${Math.max(1, equalizerPart.height)}
            width=${Math.max(1, equalizerPart.width)}
            fill='white'
            style=${styleMap({
              opacity: this.config.period.type === 'real_time' ? (j < equalizerPart.activeLevelCount ? 1 : 0) : undefined,
              transition: this.config.period.type === 'real_time' && this.config.sparkline.animate ? 'opacity 0.5s ease' : undefined,
            })}
          >
            ${
              animate
                ? svg`
              <animate
                attributeName='y'
                from=${animationStartY}
                to=${equalizerPart.y[j] - equalizerPart.height}
                begin='0s'
                dur='2s'
                fill='remove'
                restart='whenNotActive'
                repeatCount='1'
                calcMode='spline'
                keyTimes='0; 1'
                keySplines='0.215 0.61 0.355 1'
              ></animate>
            `
                : ''
            }
          </rect>
        `,
          );
        })}
      </mask>
    `;
  }

  /**
   * Builds the history-bar mask used by the shared gradient background. The
   * mask follows the same introduction geometry as the visible bars.
   *
   * @param {Array<object>} bars - Bar geometry from SparklineGraph.
   * @param {number} index - Entity or series index used in the mask id.
   * @returns {object|string} Lit SVG mask template or an empty result.
   */
  renderSvgBarsMask(bars, index) {
    if (this.config.sparkline.show.chart_type !== 'bar') return '';
    if (this.config.period.type === 'real_time') return '';
    if (!bars) return '';

    // Keep the mask and visible bars synchronized during their introduction.
    const animate = this.config.sparkline.animate && this.sparklineSeries.primaryItem.historySeries;

    return svg`
      <mask id=${`bars-bg-${this.cardId}-${index}`}>
        ${bars.map(
          (bar) => svg`
          <rect
            x=${bar.x}
            y=${bar.y}
            height=${Math.max(1, bar.height)}
            width=${Math.max(1, bar.width)}
            fill='white'
          >
            ${
              animate
                ? svg`
              <animate
                attributeName='y'
                from=${bar.value > 0 ? bar.y + Math.max(1, bar.height) : bar.y}
                to=${bar.y}
                begin='0s'
                dur='2s'
                fill='remove'
                restart='whenNotActive'
                repeatCount='1'
                calcMode='spline'
                keyTimes='0; 1'
                keySplines='0.215 0.61 0.355 1'
              ></animate>
              <animate
                attributeName='height'
                from='0'
                to=${Math.max(1, bar.height)}
                begin='0s'
                dur='2s'
                fill='remove'
                restart='whenNotActive'
                repeatCount='1'
                calcMode='spline'
                keyTimes='0; 1'
                keySplines='0.215 0.61 0.355 1'
              ></animate>
            `
                : ''
            }
          </rect>
        `,
        )}
      </mask>
    `;
  }

  /** Renders the complete equalizer scale as an optional static background track. */
  renderSvgEqualizerTrack(equalizer) {
    const background = this.config.sparkline.equalizer.background;
    const itemStyle = background.show.item_style;
    if (itemStyle === 'none') return '';
    const linearGradientColorStops = {
      colors: this.config.sparkline.colorstops.colors.map((colorStop, index) => ({
        value: index / (this.config.sparkline.colorstops.colors.length - 1),
        color: colorStop.color,
      })),
    };
    return svg`
      <g class='equalizer-track'>
        ${equalizer.map((equalizerPart) => {
          let width = equalizerPart.width;
          let height = equalizerPart.height;
          let levelSpacing = this.svg.row_spacing;
          if (this.config.sparkline.equalizer.square === true) {
            const size = Math.min(width, height);
            levelSpacing = size < height ? (this.primaryGraph.drawArea.height - this.config.sparkline.equalizer.value_buckets * size) / (this.config.sparkline.equalizer.value_buckets - 1) : levelSpacing;
            width = size;
            height = size;
          }
          return Array.from({ length: this.config.sparkline.equalizer.value_buckets }, (unused, levelIndex) => {
            const value = this.primaryGraph.min + levelIndex * this.primaryGraph.valuesPerBucket;
            let backgroundStyles = { ...background.styles };
            if (itemStyle === 'fixed') {
              backgroundStyles = { fill: background.color, ...backgroundStyles };
            } else {
              const color =
                itemStyle === 'lineargradient'
                  ? Colors.calculateStrokeColor(levelIndex / (this.config.sparkline.equalizer.value_buckets - 1), linearGradientColorStops, true)
                  : Colors.calculateStrokeColor(value, this.config.sparkline.colorstops, itemStyle === 'colorstopgradient');
              if (background[itemStyle].fill) backgroundStyles.fill = color;
              if (background[itemStyle].stroke) backgroundStyles.stroke = color;
            }
            const y = this.primaryGraph.drawArea.y + this.primaryGraph.drawArea.height - levelIndex * (height + levelSpacing) - height;
            return svg`
              <rect
                class='equalizer-track__bucket'
                x=${equalizerPart.x}
                y=${y}
                width=${Math.max(1, width)}
                height=${Math.max(1, height)}
                style=${styleMap(this.getRenderStyles(backgroundStyles))}
              ></rect>
            `;
          });
        })}
      </g>
    `;
  }

  /** Renders the complete bar scale as an optional static background track. */
  renderSvgBarTrack(index) {
    const background = this.config.sparkline.bar.background;
    const itemStyle = background.show.item_style;
    if (itemStyle === 'none') return '';
    let backgroundStyles = { ...background.styles };
    let gradientDefinition = '';
    if (itemStyle === 'fixed') {
      backgroundStyles = { fill: background.color, ...backgroundStyles };
    } else {
      let gradient;
      if (itemStyle === 'lineargradient') {
        gradient = [...this.config.sparkline.colorstops.colors].reverse().map((colorStop, colorIndex, colorStops) => ({
          color: colorStop.color,
          offset: (colorIndex / (colorStops.length - 1)) * 100,
        }));
      } else {
        const thresholds = computeThresholds(this.config.sparkline.colorstops.colors, itemStyle === 'colorstopsegments' ? 'hard' : 'smooth');
        gradient = this.primaryGraph.computeGradient(thresholds, this.config.sparkline.state_values.logarithmic);
      }
      const gradientId = `bar-track-gradient-${this.cardId}-${this.index}-${index}`;
      const gradientReference = `url(#${gradientId})`;
      if (background[itemStyle].fill) backgroundStyles.fill = gradientReference;
      if (background[itemStyle].stroke) backgroundStyles.stroke = gradientReference;
      gradientDefinition = svg`
        <defs>
          <linearGradient id=${gradientId} gradientTransform='rotate(90)'>
            ${gradient.map(
              (stop) => svg`
              <stop stop-color=${stop.color} offset=${`${stop.offset}%`}></stop>
            `,
            )}
          </linearGradient>
        </defs>
      `;
    }
    const width = Math.max(1, this.primaryGraph.drawArea.width - this.svg.column_spacing);
    const x = this.primaryGraph.drawArea.x + (this.primaryGraph.drawArea.width - width) / 2;
    return svg`
      ${gradientDefinition}
      <rect
        class='bar-track'
        x=${x}
        y=${this.primaryGraph.drawArea.y}
        width=${width}
        height=${this.primaryGraph.drawArea.height}
        rx=${background.styles.rx}
        ry=${background.styles.ry}
        style=${styleMap(this.getRenderStyles(backgroundStyles))}
      ></rect>
    `;
  }

  /**
   * Applies the configured series color or gradient through the equalizer mask.
   *
   * @param {Array<object>} equalizer - Equalizer geometry.
   * @param {number} index - Entity or series index.
   * @returns {object|string} Lit SVG background template or an empty result.
   */
  renderSvgEqualizerBackground(equalizer, index) {
    if (this.config.sparkline.show.chart_type !== 'equalizer') return '';
    if (!equalizer) return '';

    const fill = this.gradient[0] ? `url(#grad-${this.cardId}-${this.index}-0)` : this.computeColor(this.card.entities[index].state, index);
    return svg`
      <rect
        class='equalizer--bg'
        ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== index}
        id=${`equalizer-bg-${this.cardId}-${index}`}
        fill=${fill}
        height="100%"
        width="100%"
        mask=${`url(#equalizer-bg-${this.cardId}-${index})`}
      ></rect>
    `;
  }

  /**
   * Applies the configured series color or gradient through the history-bar mask.
   *
   * @param {Array<object>} bars - Bar geometry.
   * @param {number} index - Entity or series index.
   * @returns {object|string} Lit SVG background template or an empty result.
   */
  renderSvgBarsBackground(bars, index) {
    if (this.config.sparkline.show.chart_type !== 'bar') return '';
    // Fade belongs to each value-colored bar. The shared color-stop layer
    // would otherwise remain visible through its transparent end.
    if (this.config.sparkline.show.fill === 'fade') return '';
    if (this.config.period.type === 'real_time') return '';
    if (!bars) return '';

    const fill = this.gradient[0] ? `url(#grad-${this.cardId}-${this.index}-0)` : this.computeColor(this.card.entities[index].state, index);
    return svg`
      <rect
        class='bars--bg'
        ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== index}
        id=${`bars-bg-${this.cardId}-${index}`}
        fill=${fill}
        height="100%"
        width="100%"
        mask=${`url(#bars-bg-${this.cardId}-${index})`}
      ></rect>
    `;
  }

  /**
   * Renders bar geometry as stable SVG rectangles. Real-time updates transition
   * their dimensions in place; newly inserted history bars use SVG animation.
   *
   * @param {Array<object>} bars - Bar geometry from SparklineGraph.
   * @param {number} index - Entity or series index.
   * @returns {object|string} Lit SVG bar template or an empty result.
   */
  renderSvgBars(bars, index) {
    if (!bars) return '';

    // Existing animate nodes are retained by Lit. State updates therefore do
    // not restart the graph, while a newly inserted calendar bar animates once.
    const animate = this.config.sparkline.animate && (this.config.period.type === 'real_time' || this.sparklineSeries.primaryItem.historySeries);
    const horizontal = this.config.sparkline.bar.orientation === 'horizontal';
    const realTimeBarTransition =
      this.config.sparkline.animate && this.config.period.type === 'real_time'
        ? horizontal
          ? 'x 2s cubic-bezier(0.215, 0.61, 0.355, 1), width 2s cubic-bezier(0.215, 0.61, 0.355, 1)'
          : 'y 2s cubic-bezier(0.215, 0.61, 0.355, 1), height 2s cubic-bezier(0.215, 0.61, 0.355, 1)'
        : undefined;
    const foreground = this.config.sparkline.bar.foreground;
    const foregroundItemStyle = foreground.show.item_style;
    if (foregroundItemStyle === 'none') return '';
    const foregroundStyles = { ...foreground.styles };
    const fade = this.config.sparkline.show.fill === 'fade';

    // The graph color remains authoritative; foreground styles control shape,
    // transforms, opacity and other presentation properties.
    delete foregroundStyles.fill;
    delete foregroundStyles.stroke;

    return svg`
      <g class='bars' ?anim=${this.config.sparkline.animate}>
        <defs>${this.renderBarFadeGradients(bars, index, this.config, index)}</defs>
        ${bars.map((bar, i) => {
          let color;
          if (foregroundItemStyle === 'fixed') {
            color = foreground.color;
          } else if (foregroundItemStyle === 'colorstopsegments') {
            color = Colors.calculateStrokeColor(bar.value, this.config.sparkline.colorstops, false);
          } else if (foregroundItemStyle === 'colorstopgradient') {
            color = Colors.calculateStrokeColor(bar.value, this.config.sparkline.colorstops, true);
          } else {
            color = this.computeColor(bar.value, index);
          }
          const gradientId = `bar-fill-fade-${this.cardId}-${this.index}-${index}-${i}`;
          const fill = fade ? `url(#${gradientId})` : color;
          return svg`
            <rect
              class='bar'
              x=${bar.x}
              y=${bar.y}
              height=${Math.max(1, bar.height)}
              width=${Math.max(1, bar.width)}
              rx=${foregroundStyles.rx}
              ry=${foregroundStyles.ry}
              fill=${fill}
              stroke=${color}
              style=${styleMap(
                this.getRenderStyles({
                  x: realTimeBarTransition && horizontal ? `${bar.x}px` : undefined,
                  y: realTimeBarTransition ? `${bar.y}px` : undefined,
                  height: realTimeBarTransition ? `${Math.max(1, bar.height)}px` : undefined,
                  width: realTimeBarTransition && horizontal ? `${Math.max(1, bar.width)}px` : undefined,
                  transition: realTimeBarTransition,
                  ...foregroundStyles,
                }),
              )}
            >
              ${
                animate && horizontal
                  ? svg`
                <animate
                  attributeName='x'
                  from=${bar.value >= 0 ? bar.x : bar.x + Math.max(1, bar.width)}
                  to=${bar.x}
                  begin='0s'
                  dur='2s'
                  fill='remove'
                  restart='whenNotActive'
                  repeatCount='1'
                  calcMode='spline'
                  keyTimes='0; 1'
                  keySplines='0.215 0.61 0.355 1'
                ></animate>
                <animate
                  attributeName='width'
                  from='0'
                  to=${Math.max(1, bar.width)}
                  begin='0s'
                  dur='2s'
                  fill='remove'
                  restart='whenNotActive'
                  repeatCount='1'
                  calcMode='spline'
                  keyTimes='0; 1'
                  keySplines='0.215 0.61 0.355 1'
                ></animate>
              `
                  : animate
                    ? svg`
                <animate
                  attributeName='y'
                  from=${bar.value > 0 ? bar.y + Math.max(1, bar.height) : bar.y}
                  to=${bar.y}
                  begin='0s'
                  dur='2s'
                  fill='remove'
                  restart='whenNotActive'
                  repeatCount='1'
                  calcMode='spline'
                  keyTimes='0; 1'
                  keySplines='0.215 0.61 0.355 1'
                ></animate>
                <animate
                  attributeName='height'
                  from='0'
                  to=${Math.max(1, bar.height)}
                  begin='0s'
                  dur='2s'
                  fill='remove'
                  restart='whenNotActive'
                  repeatCount='1'
                  calcMode='spline'
                  keyTimes='0; 1'
                  keySplines='0.215 0.61 0.355 1'
                ></animate>
              `
                  : ''
              }
            </rect>
          `;
        })}
      </g>
    `;
  }

  // @mouseover=${() => this.updateTooltipFromPointIndex(i, undefined)}
  // @mouseout=${() => this.clearTooltip()}

  /**
   * Renders one colored radial history segment with its pointer lookup index.
   *
   * @param {object} bin - Aggregated radial bin.
   * @param {string} path - SVG path for the foreground segment.
   * @param {number} index - History bucket index.
   * @returns {object} Lit SVG path template.
   */
  renderSvgRadialBarcodeBin(bin, path, index) {
    const color = this.computeColor(bin.value, this.entity_index);
    const foregroundStyles = ConfigHelper.toStyleDict(this.config.sparkline.radial_barcode?.foreground?.styles);
    delete foregroundStyles.fill;
    delete foregroundStyles.stroke;

    return svg`
      <path
        class='sparkline-radial-barcode__bin'
        data-point-index=${index}
        d=${path}
        fill=${color}
        stroke=${color}
        style=${styleMap(this.getRenderStyles(foregroundStyles))}
      ></path>
    `;
  }

  /**
   * Renders one complete radial hit target behind its optional foreground bin.
   *
   * @param {object} bin - Background radial bin.
   * @param {string} path - SVG path for the background segment.
   * @param {number} index - History bucket index.
   * @returns {object} Lit SVG path template.
   */
  renderSvgRadialBarcodeBackgroundBin(bin, path, index) {
    const backgroundStyles = ConfigHelper.toStyleDict(this.config.sparkline.radial_barcode?.background?.styles);
    delete backgroundStyles.fill;
    delete backgroundStyles.stroke;

    return svg`
      <path
        class='sparkline-radial-barcode__bg-bin'
        data-point-index=${index}
        d=${path}
        fill='lightgray'
        style=${styleMap(this.getRenderStyles(backgroundStyles))}
      ></path>
    `;
  }

  /**
   * Renders optional clock references inside a radial barcode. Absolute labels
   * show clock hours; relative labels show offsets from the active period end.
   *
   * @param {number} radius - Available face radius.
   * @returns {object|string} Lit SVG face template.
   */
  renderSvgRadialBarcodeFace(radius) {
    if (!this.config?.sparkline?.radial_barcode?.face) return svg``;

    const geometry = this.primaryGraph.getRadialGeometry();
    const hourMarksRadius = radius * 0.84;
    const hourNumbersRadius = radius * 0.74;

    const renderHourMarks = () => {
      return this.config.sparkline.radial_barcode.face?.show_hour_marks === true
        ? svg`
        <circle pathLength=${this.config.sparkline.radial_barcode.face.hour_marks_count} r="${hourMarksRadius}" cx=${geometry.centerX} cy=${geometry.centerY}></circle>
      `
        : '';
    };

    const renderAbsoluteHourNumbers = () => {
      return this.config.sparkline.radial_barcode.face?.show_hour_numbers === 'absolute'
        ? svg`
        <g>
          <text x=${geometry.centerX} y=${geometry.centerY - hourNumbersRadius}>24</text>
          <text x=${geometry.centerX} y=${geometry.centerY + hourNumbersRadius}>12</text>
          <text x=${geometry.centerX + hourNumbersRadius} y=${geometry.centerY}>6</text>
          <text x=${geometry.centerX - hourNumbersRadius} y=${geometry.centerY}>18</text>
        </g>
      `
        : '';
    };

    const renderRelativeHourNumbers = () => {
      return this.config.sparkline.radial_barcode.face?.show_hour_numbers === 'relative'
        ? svg`
        <g>
          <text x=${geometry.centerX} y=${geometry.centerY - hourNumbersRadius}>0</text>
          <text x=${geometry.centerX} y=${geometry.centerY + hourNumbersRadius}>-12</text>
          <text x=${geometry.centerX + hourNumbersRadius} y=${geometry.centerY}>-18</text>
          <text x=${geometry.centerX - hourNumbersRadius} y=${geometry.centerY}>-6</text>
        </g>
      `
        : '';
    };

    return svg`
      ${renderHourMarks()}
      ${renderAbsoluteHourNumbers()}
      ${renderRelativeHourNumbers()}
    `;
  }

  /**
   * Combines background hit bins, available foreground bins, and the optional
   * clock face into one radial series.
   *
   * @param {Array<object>} radialBarcode - Foreground radial bins.
   * @param {number} index - Entity or series index.
   * @returns {object|string} Lit SVG radial template or an empty result.
   */
  renderSvgRadialBarcode(radialBarcode, index) {
    if (!radialBarcode) return '';
    const geometry = this.primaryGraph.getRadialGeometry();
    const radialBarcodePaths = this.primaryGraph.getRadialBarcodePaths();
    const radialBarcodeBackgroundPaths = this.primaryGraph.getRadialBarcodeBackgroundPaths();

    return svg`
      <g class='graph-clock'
        ?tooltip=${this.tooltip.entity === index}
        ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== index}
        ?init=${this.length[index]}
        anim=${this.config.sparkline.animate && this.config.sparkline.show.points !== 'hover'}
        style="animation-delay: ${this.config.sparkline.animate ? `${index * 0.5 + 0.5}s` : '0s'}"
        stroke-width=${this.svg.line_width / 2}
      >
        ${this.radialBarcodeChartBackground[index].map((bin, i) => this.renderSvgRadialBarcodeBackgroundBin(bin, radialBarcodeBackgroundPaths[i], i))}
        ${radialBarcode.map((bin, i) => this.renderSvgRadialBarcodeBin(bin, radialBarcodePaths[i], i))}
        ${this.renderSvgRadialBarcodeFace(geometry.outerRadius - this.radialBarcodeChartWidth)}
      </g>
    `;
  }

  /**
   * Renders cartesian barcode buckets as independently colored SVG columns.
   *
   * @param {Array<object>} barcode - Barcode geometry from SparklineGraph.
   * @param {number} index - Entity or series index.
   * @returns {object|string} Lit SVG barcode template or an empty result.
   */
  renderSvgBarcode(barcode, index) {
    if (!barcode) return '';

    const barcodeStyles = ConfigHelper.toStyleDict(this.config.sparkline.barcode?.styles);
    delete barcodeStyles.fill;
    delete barcodeStyles.stroke;

    return svg`
      <g class='bars' ?anim=${this.config.sparkline.animate}>
        ${barcode.map((barcodePart, i) => {
          const color = this.computeColor(barcodePart.value, index);
          return svg`
            <rect
              class='bar'
              x=${barcodePart.x}
              y=${barcodePart.y}
              height=${Math.max(1, barcodePart.height)}
              width=${barcodePart.width}
              fill=${color}
              stroke=${color}
              style=${styleMap(this.getRenderStyles(barcodeStyles))}
            >
              ${
                this.config.sparkline.animate && (this.config.period.type === 'real_time' || this.sparklineSeries.primaryItem.historySeries)
                  ? svg`
                <animate
                  attributeName='x'
                  from=${this.primaryGraph.drawArea.x}
                  to=${barcodePart.x}
                  begin='0s'
                  dur='3s'
                  fill='remove'
                  restart='whenNotActive'
                  repeatCount='1'
                  calcMode='spline'
                  keyTimes='0; 1'
                  keySplines='0.215 0.61 0.355 1'
                ></animate>
              `
                  : ''
              }
            </rect>
          `;
        })}
      </g>
    `;
  }

  // @mouseover=${() => this.updateTooltipFromPointIndex(i, undefined)}
  // @mouseout=${() => this.clearTooltip()}

  /**
   * Renders the native SVG history loading indicator in the center of the
   * graph's actual draw area. The arc rotates and changes length unless the
   * browser requests reduced motion.
   *
   * @returns {TemplateResult} SVG loading indicator or an empty template.
   */
  renderHistoryLoadingSpinner() {
    if (!this.historyLoading) return svg``;

    const centerX = this.primaryGraph.drawArea.x + this.primaryGraph.drawArea.width / 2;
    const centerY = this.primaryGraph.drawArea.y + this.primaryGraph.drawArea.height / 2;
    const radius = Math.min(this.primaryGraph.drawArea.width, this.primaryGraph.drawArea.height) * 0.08;
    const strokeWidth = radius * 0.2;
    const circumference = 2 * Math.PI * radius;
    const shortArc = circumference * 0.15;
    const longArc = circumference * 0.65;

    return svg`
      <g class="sparkline-history-spinner" pointer-events="none">
        <circle
          cx=${centerX}
          cy=${centerY}
          r=${radius}
          fill="none"
          stroke="var(--primary-color)"
          stroke-width=${strokeWidth}
          opacity="0.2"
        ></circle>
        <circle
          cx=${centerX}
          cy=${centerY}
          r=${radius}
          fill="none"
          stroke="var(--primary-color)"
          stroke-width=${strokeWidth}
          stroke-linecap="round"
          stroke-dasharray="${shortArc} ${circumference - shortArc}"
        >
          ${
            this.prefersReducedMotion
              ? svg``
              : svg`
                <animate
                  attributeName="stroke-dasharray"
                  values="${shortArc} ${circumference - shortArc}; ${longArc} ${circumference - longArc}; ${shortArc} ${circumference - shortArc}"
                  dur="1.4s"
                  repeatCount="indefinite"
                ></animate>
                <animate
                  attributeName="stroke-dashoffset"
                  values="0; ${-circumference * 0.25}; ${-circumference}"
                  dur="1.4s"
                  repeatCount="indefinite"
                ></animate>
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 ${centerX} ${centerY}"
                  to="360 ${centerX} ${centerY}"
                  dur="1.4s"
                  repeatCount="indefinite"
                ></animateTransform>
              `
          }
        </circle>
      </g>
    `;
  }

  /**
   * Renders coordinated bar items before the remaining cartesian layers. Each series supplies a
   * stable color, while SparklineGraph has already calculated its grouped bars.
   *
   * @returns {TemplateResult} Grouped bar layers in declaration order.
   */
  renderSeriesBars() {
    return svg`
      ${this.sparklineSeries.items.map((item, index) => {
        if (item.config.sparkline.show.chart_type !== 'bar') return '';

        const { config } = item;
        const color = config.color ?? item.entityConfig.color ?? config.sparkline.line_color[index];
        const foregroundStyles = { ...config.sparkline.bar.foreground.styles };
        const fade = config.sparkline.show.fill === 'fade';
        const animate = config.sparkline.animate && (config.period.type === 'real_time' || item.historySeries);
        const realTimeBarTransition = config.sparkline.animate && config.period.type === 'real_time' ? 'y 2s cubic-bezier(0.215, 0.61, 0.355, 1), height 2s cubic-bezier(0.215, 0.61, 0.355, 1)' : undefined;
        delete foregroundStyles.fill;
        delete foregroundStyles.stroke;

        return svg`
          <g class="bars" ?anim=${config.sparkline.animate}>
            <defs>${this.renderBarFadeGradients(item.bars, index, config, item.id, color)}</defs>
            ${item.bars.map((bar, barIndex) => {
              const gradientId = `bar-fill-fade-${this.cardId}-${this.index}-${item.id}-${barIndex}`;
              const fill = fade ? `url(#${gradientId})` : color;
              return svg`
                <rect
                  class="bar"
                  x=${bar.x}
                  y=${bar.y}
                  height=${Math.max(1, bar.height)}
                  width=${Math.max(1, bar.width)}
                  rx=${foregroundStyles.rx}
                  ry=${foregroundStyles.ry}
                  fill=${fill}
                  stroke=${color}
                  style=${styleMap(
                    this.getRenderStyles({
                      y: realTimeBarTransition ? `${bar.y}px` : undefined,
                      height: realTimeBarTransition ? `${Math.max(1, bar.height)}px` : undefined,
                      transition: realTimeBarTransition,
                      ...foregroundStyles,
                    }),
                  )}
                >
                  ${
                    animate
                      ? svg`
                      <animate
                        attributeName="y"
                        from=${bar.value > 0 ? bar.y + Math.max(1, bar.height) : bar.y}
                        to=${bar.y}
                        begin="0s"
                        dur="2s"
                        fill="remove"
                        restart="whenNotActive"
                        repeatCount="1"
                        calcMode="spline"
                        keyTimes="0; 1"
                        keySplines="0.215 0.61 0.355 1"
                      ></animate>
                      <animate
                        attributeName="height"
                        from="0"
                        to=${Math.max(1, bar.height)}
                        begin="0s"
                        dur="2s"
                        fill="remove"
                        restart="whenNotActive"
                        repeatCount="1"
                        calcMode="spline"
                        keyTimes="0; 1"
                        keySplines="0.215 0.61 0.355 1"
                      ></animate>
                    `
                      : ''
                  }
                </rect>
              `;
            })}
          </g>
        `;
      })}
    `;
  }

  /**
   * Creates per-bar fade gradients in defs so SVG paint-server references work
   * consistently for one-item and multi-item bar presentation.
   *
   * @param {Array<object>} bars - Bar geometry.
   * @param {number} index - Entity or series index.
   * @param {object} config - Single-series or per-series configuration.
   * @param {string|number} seriesId - Stable identifier used in gradient ids.
   * @param {string|undefined} seriesColor - Configured color for the current series item.
   * @returns {TemplateResult|string} Gradient definitions.
   */
  renderBarFadeGradients(bars, index, config, seriesId, seriesColor = undefined) {
    if (config.sparkline.show.fill !== 'fade') return '';

    return bars.map((bar, barIndex) => {
      const color = seriesColor ?? this.computeColor(bar.value, index);
      const gradientId = `bar-fill-fade-${this.cardId}-${this.index}-${seriesId}-${barIndex}`;
      return svg`
        <linearGradient
          id=${gradientId}
          x1="0%"
          y1=${bar.value >= 0 ? '0%' : '100%'}
          x2="0%"
          y2=${bar.value >= 0 ? '100%' : '0%'}
        >
          <stop stop-color=${color} offset="0%" stop-opacity="1"></stop>
          <stop stop-color=${color} offset="100%" stop-opacity="0.1"></stop>
        </linearGradient>
      `;
    });
  }

  /**
   * Defines value-colored radial paint in the same polar coordinate system as
   * the graph. A fixed series color bypasses this definition during rendering.
   *
   * @returns {TemplateResult} Per-series radial gradient definitions.
   */
  renderSeriesRadialGradients() {
    return this.sparklineSeries.items.map((item) => {
      const { config, graph } = item;
      if (config.sparkline.show.chart_type !== 'radial' || config.sparkline.colorstops.colors.length === 0) return '';

      const geometry = graph.getRadialGeometry();
      const scale = graph.max - graph.min;
      return svg`
        <radialGradient
          id=${`radial-series-color-${this.cardId}-${this.index}-${item.id}`}
          gradientUnits="userSpaceOnUse"
          cx=${geometry.centerX}
          cy=${geometry.centerY}
          r=${geometry.outerRadius}
        >
          ${config.sparkline.colorstops.colors.map(
            (stop) => svg`
            <stop
              offset=${`${Math.max(0, Math.min(100, ((geometry.innerRadius + ((Number(stop.value) - graph.min) / scale) * geometry.radialSize) / geometry.outerRadius) * 100))}%`}
              stop-color=${stop.color}
            ></stop>
          `,
          )}
        </radialGradient>
      `;
    });
  }

  /**
   * Defines opacity masks for radial area series that request fade. The mask
   * becomes transparent at the visible zero radius and gains opacity toward
   * either scale edge, preserving positive, negative and mixed ranges.
   *
   * @returns {TemplateResult} Per-series radial area fade definitions.
   */
  renderSeriesRadialAreaMasks() {
    return this.sparklineSeries.items.map((item) => {
      const { config, graph } = item;
      if (config.sparkline.show.chart_type !== 'radial' || config.sparkline.show.chart_variant !== 'area' || config.sparkline.show.fill !== 'fade') return '';

      const geometry = graph.getRadialGeometry();
      const zero = Math.min(graph.max, Math.max(graph.min, 0));
      const baselineOffset = (graph.getRadialRadiusForValue(zero) / geometry.outerRadius) * 100;
      const gradientId = `radial-area-fade-gradient-${this.cardId}-${this.index}-${item.id}`;
      const maskId = `radial-area-fade-mask-${this.cardId}-${this.index}-${item.id}`;

      return svg`
        <radialGradient
          id=${gradientId}
          gradientUnits="userSpaceOnUse"
          cx=${geometry.centerX}
          cy=${geometry.centerY}
          r=${geometry.outerRadius}
        >
          <stop offset="0%" stop-color="white" stop-opacity="1"></stop>
          <stop offset=${`${baselineOffset}%`} stop-color="white" stop-opacity="0.1"></stop>
          <stop offset="100%" stop-color="white" stop-opacity="1"></stop>
        </radialGradient>
        <mask id=${maskId} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
          <rect
            x="0"
            y="0"
            width=${this.graphArea.width}
            height=${this.graphArea.height}
            fill=${`url(#${gradientId})`}
          ></rect>
        </mask>
      `;
    });
  }

  /**
   * Creates the vertical fade paint for coordinated area items. Each item owns
   * its graph path and therefore receives a stable paint-server definition.
   *
   * @returns {TemplateResult|string} Area fade gradients.
   */
  renderSeriesAreaGradients() {
    return this.sparklineSeries.items.map((item, index) => {
      const { config, graph } = item;
      if (config.sparkline.show.chart_type !== 'area' || config.sparkline.show.fill !== 'fade') return '';

      const gradientId = `series-area-fade-${this.cardId}-${this.index}-${item.id}`;
      return svg`
        <linearGradient id=${gradientId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2=${graph.drawArea.height}>
          <stop stop-color=${config.color ?? item.entityConfig.color ?? config.sparkline.line_color[index]} offset="0%" stop-opacity="1"></stop>
          <stop stop-color=${config.color ?? item.entityConfig.color ?? config.sparkline.line_color[index]} offset="100%" stop-opacity="0.1"></stop>
        </linearGradient>
      `;
    });
  }

  /**
   * Draws coordinated series from their own graph engines. The coordinator has
   * already aligned their axes and geometry before this presentation step.
   *
   * @returns {TemplateResult} Cartesian series layers in declaration order.
   */
  renderSeriesCartesian() {
    return svg`
      ${this.sparklineSeries.items.map((item, index) => {
        const { config, graph } = item;
        const chartType = config.sparkline.show.chart_type;
        const color = config.color ?? item.entityConfig.color ?? config.sparkline.line_color[index];
        const lineStyles = {
          ...ConfigHelper.toStyleDict(config.sparkline.line.styles),
          'stroke-width': this.getConfiguredLineWidth(config),
        };
        const areaStyles = ConfigHelper.toStyleDict(config.area.styles);
        const path = ['line', 'area'].includes(chartType) ? graph.getPath() : undefined;
        const areaPath = chartType === 'area' ? graph.getArea(path) : undefined;
        const showMinMax = chartType === 'line' ? config.sparkline.line.show_minmax === true : chartType === 'area' && config.sparkline.area.show_minmax === true;
        const minMaxPath = showMinMax ? graph.getAreaMinMax(graph.getPathMin(), graph.getPathMax()) : undefined;
        const points =
          chartType === 'dots' || config.sparkline.show.points === true || config.sparkline.line.show_dots === true || config.sparkline.area.show_dots === true ? graph.calculateYCoordinates(graph.coords) : [];
        const pointRadius = Utils.calculateSvgDimension(config.sparkline.dots.radius);

        const areaFade = config.sparkline.show.fill === 'fade';
        const areaGradientId = `series-area-fade-${this.cardId}-${this.index}-${item.id}`;
        const areaFill = areaFade && chartType === 'area' ? `url(#${areaGradientId})` : color;

        return svg`
          ${
            areaPath
              ? svg`<path class="sparkline-series-area" d="${areaPath}" fill=${areaFill} stroke="none" style=${styleMap(this.getRenderStyles({ ...areaStyles, fill: areaFill }))}></path>`
              : ''
          }
          ${
            minMaxPath
              ? svg`<path class="sparkline-series-minmax" d="${minMaxPath}" fill=${areaFill} stroke="none" style=${styleMap(this.getRenderStyles({ ...areaStyles, fill: areaFill }))}></path>`
              : ''
          }
          ${
            path && config.sparkline.show.line !== false
              ? svg`<path class="sparkline-series-line" d="${path}" fill="none" stroke="${color}" style=${styleMap(this.getRenderStyles({ ...lineStyles, fill: 'none', stroke: color }))}></path>`
              : ''
          }
          ${points.map((point) => svg`<circle class="sparkline-series-point" cx="${point[X]}" cy="${point[Y]}" r="${pointRadius}" fill="${color}" stroke="${color}"></circle>`)}
        `;
      })}
    `;
  }

  /**
   * Draws radial series in declaration order from graph-engine coordinates.
   * Variants select only the SVG primitive; angle, radius and paths remain
   * products of each coordinated SparklineGraph instance.
   *
   * @returns {TemplateResult} Radial series layers.
   */
  renderSeriesRadial() {
    const seriesLayers = this.sparklineSeries.items.map((item, index) => {
      const { config, graph } = item;
      const variant = config.sparkline.show.chart_variant;
      const fixedColor = config.color ?? item.entityConfig.color;
      const color = fixedColor ?? (config.sparkline.colorstops.colors.length > 0 ? `url(#radial-series-color-${this.cardId}-${this.index}-${item.id})` : config.sparkline.line_color[index]);
      const lineStyles = {
        ...ConfigHelper.toStyleDict(config.sparkline.line.styles),
        'stroke-width': this.getConfiguredLineWidth(config),
      };
      const areaStyles = ConfigHelper.toStyleDict(config.area.styles);
      const path = ['line', 'area'].includes(variant) ? graph.getRadialPath() : undefined;
      const areaPath = variant === 'area' ? graph.getRadialArea(path) : undefined;
      const showMinMax = variant === 'line' ? config.sparkline.line.show_minmax === true : variant === 'area' && config.sparkline.area.show_minmax === true;
      const minMaxPath = showMinMax ? graph.getRadialMinMaxArea() : undefined;
      const areaFade = variant === 'area' && config.sparkline.show.fill === 'fade';
      const areaMaskId = `radial-area-fade-mask-${this.cardId}-${this.index}-${item.id}`;
      const points = variant === 'dots' || config.sparkline.show.points === true || config.sparkline.line.show_dots === true || config.sparkline.area.show_dots === true ? graph.getRadialPoints() : [];
      const pointRadius = Utils.calculateSvgDimension(config.sparkline.dots.radius);

      return {
        config,
        fixedColor,
        color,
        lineStyles,
        areaStyles,
        path,
        areaPath,
        minMaxPath,
        areaFade,
        areaMaskId,
        points,
        pointRadius,
        index,
      };
    });

    return svg`
      ${seriesLayers.map((layer) =>
        layer.minMaxPath
          ? svg`<path class="sparkline-radial-minmax" d="${layer.minMaxPath}" fill=${layer.color} stroke="none" style=${styleMap(this.getRenderStyles({ ...layer.areaStyles, fill: layer.color }))}></path>`
          : '',
      )}
      ${seriesLayers.map((layer) =>
        layer.areaPath
          ? svg`<path class="sparkline-radial-area" d="${layer.areaPath}" fill=${layer.color} stroke="none" mask=${layer.areaFade ? `url(#${layer.areaMaskId})` : ''} style=${styleMap(this.getRenderStyles({ ...layer.areaStyles, fill: layer.color }))}></path>`
          : '',
      )}
      ${seriesLayers.map((layer) =>
        layer.path && layer.config.sparkline.show.line !== false
          ? svg`<path class="sparkline-radial-line" d="${layer.path}" fill="none" stroke="${layer.color}" style=${styleMap(this.getRenderStyles({ ...layer.lineStyles, fill: 'none', stroke: layer.color }))}></path>`
          : '',
      )}
      ${seriesLayers.map((layer) =>
        layer.points.map((point) => {
            const pointColor =
              layer.fixedColor ??
              (layer.config.sparkline.colorstops.colors.length > 0
                ? Colors.calculateStrokeColor(point[V], layer.config.sparkline.colorstops, layer.config.sparkline.colorstops_transition === 'smooth')
                : layer.config.sparkline.line_color[layer.index]);
            return svg`<circle class="sparkline-radial-point" cx="${point[X]}" cy="${point[Y]}" r="${layer.pointRadius}" fill="${pointColor}" stroke="${pointColor}"></circle>`;
          }),
      )}
    `;
  }
  /**
   * Returns one compact series label for both legend and tooltip.
   *
   * Explicit series and entity names keep priority. Automatic names combine
   * the registry area with the short entity or translated attribute name so
   * equal measurements from different devices remain distinguishable.
   *
   * @param {object} item - Runtime sparkline series item.
   * @returns {string} Home Assistant formatted series name.
   */
  formatSeriesName(item) {
    if (item.config.name !== undefined) {
      return this.card._hass.formatEntityName(item.entity, item.config.name);
    }

    if (item.entityConfig.name !== undefined) {
      return this.card._hass.formatEntityName(item.entity, item.entityConfig.name);
    }

    if (item.entityConfig.attribute !== undefined) {
      const attributeName = this.card._hass.formatEntityAttributeName(item.entity, item.entityConfig.attribute);
      return this.card._hass.formatEntityName(item.entity, [{ type: 'area' }, { type: 'text', text: attributeName }]);
    }

    return this.card._hass.formatEntityName(item.entity, [{ type: 'area' }, { type: 'entity' }]);
  }

  /**
   * Creates one TextTool per legend label after slot geometry is known.
   * The labels stay at the configured font size; TextTool receives the slot
   * width as a measured ellipsis limit rather than shrinking the font.
   */
  updateLegendTextTools() {
    const legend = this.config.sparkline.legend;
    if (!this.config.sparkline.show.legend) {
      this.legendItems = [];
      this.legendTextTools = [];
      this.legendTextSignature = undefined;
      return;
    }

    const items = this.sparklineSeries.items;
    const area = this.legendLayout.legendArea;
    const horizontal = this.legendLayout.orientation === 'horizontal';
    const rows = Number(legend.rows);
    const columns = horizontal ? Math.ceil(items.length / rows) : 1;
    const slotWidth = area.width / columns;
    const slotHeight = area.height / (horizontal ? rows : items.length);
    const markerSize = this.legendLayout.markerRadius;
    const markerGap = Utils.calculateSvgDimension(legend.item_gap);
    const textStyles = {
      ...ConfigHelper.toStyleDict(legend.styles),
      'text-anchor': 'start',
      'dominant-baseline': 'central',
      'pointer-events': 'none',
    };

    const legendItems = items.map((item, index) => {
      const label = this.formatSeriesName(item);
      const color = item.config.color ?? item.entityConfig?.color ?? item.config.sparkline.line_color[index];
      const row = horizontal ? Math.floor(index / columns) : index;
      const column = horizontal ? index % columns : 0;
      const slotX = area.x + column * slotWidth;
      const slotY = area.y + row * slotHeight;
      const markerX = slotX + markerGap + markerSize;
      const markerY = slotY + slotHeight / 2;
      const textX = markerX + markerSize + markerGap;
      const textWidth = slotWidth - markerGap * 3 - markerSize * 2;
      const textY = markerY;
      const textConfig = {
        id: this.id + '-legend-' + item.id,
        xpos: (this.svg.x + textX) / 2,
        ypos: (this.svg.y + textY) / 2,
        text: label,
        text_overflow: {
          mode: 'ellipsis',
          ellipsis: {
            max_width: textWidth / 2,
          },
        },
        styles: textStyles,
        tap_action: { action: 'none' },
      };

      return {
        label,
        color,
        markerX,
        markerY,
        textX,
        textY,
        textTool: new TextTool(textConfig, index, this.templates, this.cardId, this.card),
      };
    });
    const textSignature = JSON.stringify(
      legendItems.map((item) => ({
        label: item.label,
        color: item.color,
        markerX: item.markerX,
        markerY: item.markerY,
        textX: item.textX,
        textY: item.textY,
        styles: textStyles,
      })),
    );

    if (textSignature === this.legendTextSignature) return;

    legendItems.forEach((item) => {
      item.textTool.updateRuntimeConfig();
      item.textTool.setStaticState();
    });
    this.legendItems = legendItems;
    this.legendTextTools = legendItems.map((item) => item.textTool);
    this.legendTextSignature = textSignature;
  }

  /**
   * Forwards Lit's post-render measurement pass to legend TextTool instances.
  * Width-based ellipsis is resolved only after SVG has measured each label.
  */
  updated() {
    const legendTextMeasurementWasPending = this.legendTextTools.some((textTool) => textTool.widthOverflowPending);

    this.legendTextTools.forEach((textTool) => textTool.updated());

    if (!this.config.sparkline.show.legend || this.legendTextTools.length === 0) return;

    // A pending TextTool renders only its invisible width-measurement text.
    // It requests another card render after resolving ellipsis; measure the
    // visible legend text in that next pass instead of collapsing the row to 0.
    if (legendTextMeasurementWasPending) return;

    // TextTool and the legend share the same nested SVG. Its bounding box is
    // already expressed in the local viewBox, so no CSS-pixel conversion is needed.
    const textElement = this.legendTextTools[0].textElement;
    const measuredTextHeight = textElement.getBBox().height;
    const lineHeight = Number(this.config.sparkline.legend.line_height);
    const measuredRowHeight = measuredTextHeight * lineHeight;
    const measuredSignature = measuredTextHeight + '|' + measuredRowHeight;

    if (measuredSignature === this.legendMeasuredSignature) return;

    const graphWasReady = this.graphReady;
    this.legendMeasuredSignature = measuredSignature;
    this.legendMeasuredFontSize = measuredTextHeight;
    this.legendMeasuredRowHeight = measuredRowHeight;
    this.legendLayout = this.calculateLegendLayout();
    this.graphArea = this.legendLayout.graphArea;
    this.graphGeometryChanged = true;
    this.updateRuntimeConfig();
    this.updateLegendTextTools();
    if (graphWasReady) this.updateGraphFromSeries();
    this.card.requestUpdate();
  }

  /**
   * Renders one aligned color marker and label for every declared series.
   * The slots are equal; the graph engine never needs to know legend text.
   *
   * @returns {TemplateResult|string} Legend SVG or an empty template.
   */
  renderLegend() {
    if (!this.config.sparkline.show.legend) return svg``;

    return svg`
      <g class="sparkline-legend" pointer-events="none">
        <g transform="translate(${-this.svg.x} ${-this.svg.y})">
          ${this.legendTextTools.map((textTool) => textTool.render())}
        </g>
        ${this.legendItems.map(
          (item) => svg`
          <circle
            class="sparkline-legend__marker"
            cx="${item.markerX}"
            cy="${item.markerY}"
            r="${this.legendLayout.markerRadius}"
            fill="${item.color}"
          ></circle>
        `,
        )}
      </g>
    `;
  }
  /**
   * Renders one sparkline layout item.
   *
   * @returns {TemplateResult} SVG template for the sparkline.
   */
  renderSvg() {
    // Every historical mode remains empty until its first Home Assistant
    // history response is accepted. Current entity state is never a placeholder.
    if (!this.graphReady) {
      return svg`
        <g
          transform="${this.getGroupScaleTransform()}"
          style="${this.getGroupScaleStyle()}"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="sparkline-${this.cardId}-${this.index}"
            x="${this.svg.x}"
            y="${this.svg.y}"
            width="${this.svg.width}"
            height="${this.svg.height}"
            viewBox="0 0 ${this.svg.width} ${this.svg.height}"
            overflow="visible"
            touch-action="none"
            style="touch-action:none; pointer-events:none; overflow:visible;"
            @pointerdown=${(event) => event.stopPropagation()}
            @click=${(event) => event.stopPropagation()}
          >
            <g transform="translate(${this.graphArea.x} ${this.graphArea.y})">
              ${this.historyDurationReady ? this.renderHistoryLoadingSpinner() : svg``}
            </g>
            ${this.renderLegend()}
          </svg>
        </g>
      `;
    }

    const content = svg`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="sparkline-${this.cardId}-${this.index}"
          x="${this.svg.x}"
          y="${this.svg.y}"
          width="${this.svg.width}"
          height="${this.svg.height}"
          viewBox="0 0 ${this.svg.width} ${this.svg.height}"
          overflow="visible"
          touch-action="none"
          style="touch-action:none; pointer-events:${this.historyLoading ? 'none' : 'auto'}; overflow:visible;"
          ${this.actionHandler()}
          @action=${(event) => this.handleAction(event)}
          @pointerdown=${(event) => event.stopPropagation()}
          @click=${(event) => event.stopPropagation()}
        >
          <defs>
            ${this.renderSvgGradient(this.gradient)}
            ${this.sparklineSeries.items.length > 1 ? this.renderSeriesAreaGradients() : ''}
            ${this.config.sparkline.show.chart_type === 'radial' ? this.renderSeriesRadialGradients() : ''}
            ${this.config.sparkline.show.chart_type === 'radial' ? this.renderSeriesRadialAreaMasks() : ''}
            ${this.area.map((fill, i) => this.renderSvgAreaMask(fill, i))}
            ${this.areaMinMax.map((fill, i) => this.renderSvgAreaMinMaxMask(fill, i))}
            ${this.line.map((line, i) => this.renderSvgLineMask(line, i))}
            ${this.renderSvgStateBandsMask()}
          </defs>
          <g transform="translate(${this.graphArea.x} ${this.graphArea.y})">
            <g
              class="sparkline-background-layers"
              opacity=${this.historyLoading ? 0.2 : 1}
              pointer-events="none"
            >
              ${this.config.sparkline.show.chart_type === 'radial' ? this.renderRadialBackground() : ''}
              ${this.renderDayNightLayer()}
            </g>
            <g
            opacity=${this.historyLoading ? 0.2 : 1}
            style="pointer-events:${this.historyLoading ? 'none' : 'auto'}"
          >
          ${this.renderCartesianHitArea()}
          ${this.config.sparkline.show.chart_type === 'radial' ? this.renderRadialHitArea() : ''}
          ${this.renderGrid()}
          ${this.config.sparkline.show.chart_type === 'radial' ? this.renderSeriesRadial() : ''}
          ${this.sparklineSeries.items.length > 1 ? this.renderSeriesBars() : ''}
          ${
            this.config.sparkline.show.chart_type !== 'radial'
              ? svg`<g transform="translate(0 ${this.animationBaselineY})">
                <g>
                  ${
                    this.config.sparkline.animate && ['line', 'area'].includes(this.config.sparkline.show.chart_type) && (this.config.period.type === 'real_time' || this.sparklineSeries.primaryItem.historySeries)
                      ? svg`
                    <animateTransform
                      attributeName='transform'
                      type='scale'
                      from='1 0'
                      to='1 1'
                      begin='0s'
                      dur='2s'
                      fill='remove'
                      restart='whenNotActive'
                      repeatCount='1'
                      calcMode='spline'
                      keyTimes='0; 1'
                      keySplines='0.215 0.61 0.355 1'
                    ></animateTransform>
                  `
                      : ''
                  }
                  <g transform="translate(0 ${-this.animationBaselineY})">
                    ${
                      this.sparklineSeries.items.length > 1
                        ? this.renderSeriesCartesian()
                        : svg`
                        ${this.area.map((fill, i) => this.renderSvgAreaBackground(fill, i))}
                        ${this.areaMinMax.map((fill, i) => this.renderSvgAreaMinMaxBackground(fill, i))}
                        ${this.line.map((line, i) => this.renderSvgLineBackground(line, i))}
                      `
                    }
                  </g>
                </g>
              </g>
            `
              : ''
          }
          ${this.bar.map((bars, i) => this.renderSvgBarsMask(bars, i))}
          ${this.bar.map((bars, i) => this.renderSvgBarTrack(i))}
          ${this.bar.map((bars, i) => this.renderSvgBarsBackground(bars, i))}
          ${this.bar.map((bars, i) => this.renderSvgBars(bars, i))}
          ${this.equalizer.map((equalizer, i) => this.renderSvgEqualizerMask(equalizer, i))}
          ${this.equalizer.map((equalizer, i) => this.renderSvgEqualizerTrack(equalizer, i))}
          ${this.equalizer.map((equalizer, i) => this.renderSvgEqualizerBackground(equalizer, i))}
          ${this.barcodeChart.map((barcodePart, i) => this.renderSvgBarcode(barcodePart, i))}
          ${this.radialBarcodeChart.map((radialPart, i) => this.renderSvgRadialBarcode(radialPart, i))}
          ${this.graded.map((grade, i) => this.renderSvgGraded(grade, i))}
          ${this.renderSvgStateBandsBackground()}
          ${this.renderSvgStateBands()}
          ${this.renderAxis()}
          ${this.sparklineSeries.items.length === 1 && this.config.sparkline.show.chart_type !== 'radial' ? this.renderPoints() : ''}
          ${this.renderActiveIndicator()}
          ${this.renderTickmarks()}
          ${this.renderAxisLabels()}
            </g>
            ${this.renderHistoryLoadingSpinner()}
          </g>
          ${this.renderLegend()}
        </svg>
      </g>
    `;

    return content;
  }

  /**
   * Renders one sparkline layout item.
   *
   * @returns {TemplateResult} SVG template for the sparkline.
   */
  render() {
    return this.renderItemLayers(this.renderSvg());
  }
}
