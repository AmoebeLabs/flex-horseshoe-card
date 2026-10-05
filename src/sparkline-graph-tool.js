/* eslint-disable arrow-body-style */
/* eslint-disable no-useless-concat */
import { html, svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import BaseTool from './base-tool.js';
import Colors from './colors';
import ColorStops from './color-stops.js';
import ConfigHelper from './config-helper.js';
import Merge from './merge.js';
import Templates from './templates.js';
import Utils from './utils.js';
import { X, Y, V } from './sparkline-graph.js';
import SparklineSeries from './sparkline-series.js';
import SparklineHistory from './sparkline-history.js';
import { SPARKLINE_DATA_STATE, SPARKLINE_HISTORY_RESULT, SPARKLINE_REQUEST_STATE } from './sparkline-state.js';
import StateTool from './state-tool.js';
import TextTool from './text-tool.js';
import { formatDateVeryShort } from './frontend_mods/common/datetime/format_date.ts';
import { formatTime } from './frontend_mods/common/datetime/format_time.ts';
import { formatDateTime } from './frontend_mods/common/datetime/format_date_time.ts';
import { formatNumericDuration } from './frontend_mods/common/datetime/format_duration.ts';
import { FONT_SIZE, SVG_DEFAULT_DIMENSIONS } from './const.js';

/**
 * Finds the next Sparkline color stop that has an explicit threshold value.
 *
 * @param {Array<object>} stops - Color stops from the Sparkline config.
 * @param {number} startIndex - Index at which to start looking.
 * @returns {number} Index of the next color stop with a value.
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
 * Fills missing color-stop values at even numeric intervals between thresholds.
 *
 * @param {Array<object>} stops - Sparkline color stops, including the first and last values.
 * @returns {Array<object>} Color stops with a value on every entry.
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

const DEFAULT_COLORS = ['var(--theme-sys-color-primary)', '#3498db', '#e74c3c', '#9b59b6', '#f1c40f', '#2ecc71', '#1abc9c', '#34495e', '#e67e22', '#7f8c8d', '#27ae60', '#2980b9', '#8e44ad'];

// These are the axes each Sparkline chart type can draw. Config can hide an
// available axis, but it cannot add an X or Y axis that the chart does not use.
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

/** Converts a shared axis-layer switch into matching X and Y settings. */
const normalizeAxisVisibility = (show) => {
  ['grid', 'axis', 'tickmarks', 'labels'].forEach((layerName) => {
    const layerVisibility = show[layerName];
    if (typeof layerVisibility === 'boolean') {
      show[layerName] = { x: layerVisibility, y: layerVisibility };
    }
  });
};

/** Checks the day/night modes, dimensions and period combinations used by FHS. */
const validateDayNightConfig = (config) => {
  const dayNight = config.sparkline.day_night;
  if (!['background', 'band'].includes(dayNight.mode)) {
    throw new Error('[sparklines] sparkline.day_night.mode must be background or band');
  }
  if (!['top', 'bottom'].includes(dayNight.position)) {
    throw new Error('[sparklines] sparkline.day_night.position must be top or bottom');
  }
  if (!Number.isFinite(Number(dayNight.size)) || Number(dayNight.size) <= 0) {
    throw new Error('[sparklines] sparkline.day_night.size must be greater than 0');
  }
  if (!Number.isFinite(Number(dayNight.offset))) {
    throw new Error('[sparklines] sparkline.day_night.offset must be a number');
  }
  if (config.sparkline.show.day_night && config.period.type === 'real_time') {
    throw new Error('[sparklines] show.day_night requires a calendar or rolling_window period');
  }
  if (config.sparkline.show.day_night && config.period.type === 'calendar' && Number(config.period.calendar.offset) > 0) {
    throw new Error('[sparklines] show.day_night does not support future calendar offsets');
  }
};

/** Checks concrete radial chart variants, arc angle, rotation and band size. */
const validateRadialConfig = (config) => {
  const chartType = config.sparkline.show.chart_type;
  const radial = config.sparkline[chartType];
  if (chartType === 'radial' && !['line', 'area', 'dots'].includes(config.sparkline.show.chart_variant)) {
    throw new Error('[sparklines] radial chart_variant must be line, area or dots');
  }
  if (!Number.isFinite(Number(radial.arc_degrees)) || Number(radial.arc_degrees) <= 0 || Number(radial.arc_degrees) > 360) {
    throw new Error('[sparklines] sparkline..arc_degrees must be greater than 0 and at most 360');
  }
  if (!Number.isFinite(Number(radial.rotate))) {
    throw new Error('[sparklines] sparkline..rotate must be numeric');
  }
  if (!Number.isFinite(Number(radial.size)) || Number(radial.size) <= 0) {
    throw new Error('[sparklines] sparkline..size must be greater than 0');
  }
};

/**
 * Converts Sparkline color stops to the thresholds used by SVG gradients.
 * Smooth transitions use the configured stops; hard transitions add a nearby
 * threshold so one color ends before the next begins.
 *
 * @param {Array<object>} stops - Sparkline color stops with numeric values.
 * @param {string} type - Configured color-stop transition mode.
 * @returns {Array<object>} Thresholds passed to SparklineGraph.computeGradient().
 */
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
 * Runs one `layout.sparklines` entry: binds its HA entities, requests History,
 * calculates graph and axis geometry, and renders the chart as SVG through Lit.
 * The card also uses its Series statistics to update matching `fhs_sparkline.*`
 * entity values before it updates the other FHS tools.
 */
export default class SparklineGraphTool extends BaseTool {
  /** Returns the first Series graph used for shared time ticks and pointer input. */
  get primaryGraph() {
    return this.sparklineSeries.primaryItem.graph;
  }

  /** Returns true while any Series is waiting for its HA History request. */
  get historyLoading() {
    return this.sparklineSeries.items.some((item) => item.requestState === SPARKLINE_REQUEST_STATE.LOADING);
  }

  /**
   * Creates one Sparkline tool for every entry in `layout.sparklines`.
   *
   * @param {object} config - FHS card config containing the Sparkline layout entries.
   * @param {object} templates - FHS JavaScript-template evaluator.
   * @param {string} cardId - Card id used in generated SVG element ids.
   * @param {LitElement} card - FHS card that supplies HA data and shared layout helpers.
   * @returns {Array<SparklineGraphTool>} Sparkline tools in layout order.
   */
  static setConfig(config, templates, cardId, card) {
    const sparklines = config.layout?.sparklines ?? [];

    return sparklines.map((sparklineConfig, index) => new SparklineGraphTool(sparklineConfig, index, templates, cardId, card));
  }

  /**
   * Adds Sparkline defaults, converts authored styles and checks chart settings.
   * Before JavaScript config runs, template-valued branches stay intact; the
   * evaluated config expands and checks the returned Series entries for graph setup.
   *
   * @param {object} config - Config for one Sparkline layout entry.
   * @param {boolean} forTemplateContext - True while adding defaults before JavaScript config runs.
   * @returns {object} Sparkline config ready for template evaluation or graph setup.
   */
  static translateConfig(config, forTemplateContext = false) {
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
          duration: {
            hour: 24,
          },
          bins: {
            per_hour: 'auto',
            density: 'medium',
          },
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
          styles: {
            fill: 'var(--primary-color)',
            stroke: 'var(--primary-color)',
          },
        },
        line: {
          line_width: 1,
          show_dots: false,
          color_filter: {},
          show: {
            item_style: 'auto',
            minmax: false,
          },
          styles: {
            fill: 'none',
            stroke: 'var(--primary-text-color)',
            'stroke-width': 1,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          },
          minmax: {
            color_filter: {},
            show: {
              item_style: 'auto',
            },
            styles: {
              opacity: 0.25,
            },
          },
        },
        area: {
          show_dots: false,
          color_filter: {},
          show: {
            item_style: 'auto',
            minmax: false,
          },
          styles: {
            fill: 'var(--primary-color)',
            opacity: 0.25,
          },
          minmax: {
            color_filter: {},
            show: {
              item_style: 'auto',
            },
          },
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
          item_style: 'auto',
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
    };
    const normalizedConfig = Merge.mergeDeep({}, config);

    // Older FHS YAML can select a live graph with period.real_time.
    if (normalizedConfig.period?.real_time === true) {
      normalizedConfig.period.type = 'real_time';
    }
    ['bar', 'equalizer'].forEach((chartType) => {
      if (normalizedConfig.sparkline?.[chartType]?.background?.styles !== undefined && !Templates.isJsTemplate(normalizedConfig.sparkline?.[chartType]?.background?.styles)) {
        normalizedConfig.sparkline[chartType].background.styles = ConfigHelper.toStyleDict(normalizedConfig.sparkline[chartType].background.styles);
      }
    });
    if (normalizedConfig.sparkline?.bar?.foreground?.styles !== undefined && !Templates.isJsTemplate(normalizedConfig.sparkline?.bar?.foreground?.styles)) {
      normalizedConfig.sparkline.bar.foreground.styles = ConfigHelper.toStyleDict(normalizedConfig.sparkline.bar.foreground.styles);
    }
    if (normalizedConfig.sparkline?.dots?.styles !== undefined && !Templates.isJsTemplate(normalizedConfig.sparkline?.dots?.styles)) {
      normalizedConfig.sparkline.dots.styles = ConfigHelper.toStyleDict(normalizedConfig.sparkline.dots.styles);
    }
    if (normalizedConfig.sparkline?.show != null) normalizeAxisVisibility(normalizedConfig.sparkline.show);
    ['line', 'area'].forEach((chartType) => {
      if (normalizedConfig.sparkline?.[chartType]?.styles !== undefined && !Templates.isJsTemplate(normalizedConfig.sparkline?.[chartType]?.styles)) {
        normalizedConfig.sparkline[chartType].styles = ConfigHelper.toStyleDict(normalizedConfig.sparkline[chartType].styles);
      }
    });
    if (normalizedConfig.sparkline?.radial?.background?.styles !== undefined && !Templates.isJsTemplate(normalizedConfig.sparkline?.radial?.background?.styles)) {
      normalizedConfig.sparkline.radial.background.styles = ConfigHelper.toStyleDict(normalizedConfig.sparkline.radial.background.styles);
    }
    ['day', 'night'].forEach((periodName) => {
      if (normalizedConfig.sparkline?.day_night?.[periodName]?.styles !== undefined && !Templates.isJsTemplate(normalizedConfig.sparkline?.day_night?.[periodName]?.styles)) {
        normalizedConfig.sparkline.day_night[periodName].styles = ConfigHelper.toStyleDict(normalizedConfig.sparkline.day_night[periodName].styles);
      }
    });
    if (normalizedConfig.sparkline?.state_bands?.styles !== undefined && !Templates.isJsTemplate(normalizedConfig.sparkline?.state_bands?.styles)) {
      normalizedConfig.sparkline.state_bands.styles = ConfigHelper.toStyleDict(normalizedConfig.sparkline.state_bands.styles);
    }
    if (normalizedConfig.sparkline?.state_bands?.background?.styles !== undefined && !Templates.isJsTemplate(normalizedConfig.sparkline?.state_bands?.background?.styles)) {
      normalizedConfig.sparkline.state_bands.background.styles = ConfigHelper.toStyleDict(normalizedConfig.sparkline.state_bands.background.styles);
    }
    if (normalizedConfig.sparkline?.graded?.background?.styles !== undefined && !Templates.isJsTemplate(normalizedConfig.sparkline?.graded?.background?.styles)) {
      normalizedConfig.sparkline.graded.background.styles = ConfigHelper.toStyleDict(normalizedConfig.sparkline.graded.background.styles);
    }
    if (normalizedConfig.sparkline?.graded?.foreground?.styles !== undefined && !Templates.isJsTemplate(normalizedConfig.sparkline?.graded?.foreground?.styles)) {
      normalizedConfig.sparkline.graded.foreground.styles = ConfigHelper.toStyleDict(normalizedConfig.sparkline.graded.foreground.styles);
    }
    ['x_axis', 'y_axis'].forEach((axisName) => {
      ['axis', 'grid_major', 'grid_minor', 'tickmarks_major', 'tickmarks_minor', 'labels'].forEach((layerName) => {
        if (normalizedConfig[axisName]?.[layerName]?.styles !== undefined && !Templates.isJsTemplate(normalizedConfig[axisName]?.[layerName]?.styles)) {
          normalizedConfig[axisName][layerName].styles = ConfigHelper.toStyleDict(normalizedConfig[axisName][layerName].styles);
        }
      });
    });
    const sparklineConfig = Merge.mergeDeep(defaultConfig, normalizedConfig);
    if (!forTemplateContext && normalizedConfig.sparkline?.line_color !== undefined) {
      // Keep the line colors prepared for JavaScript templates; merging the
      // default palette again here would add the default colors twice.
      sparklineConfig.sparkline.line_color = normalizedConfig.sparkline.line_color;
    }

    if (!Templates.isJsTemplate(sparklineConfig.sparkline) && !Templates.isJsTemplate(sparklineConfig.sparkline.show)) {
      ['line', 'area'].forEach((chartType) => {
        const layer = sparklineConfig.sparkline[chartType];
        if (Templates.isJsTemplate(layer)) return;
        if (!Templates.isJsTemplate(layer.show)) {
          layer.show.item_style = normalizedConfig.sparkline?.[chartType]?.show?.item_style
            ?? sparklineConfig.sparkline.show.item_style;
        }
        if (!Templates.isJsTemplate(layer.minmax) && !Templates.isJsTemplate(layer.minmax.show)) {
          layer.minmax.show.item_style = normalizedConfig.sparkline?.[chartType]?.minmax?.show?.item_style
            ?? sparklineConfig.sparkline.show.item_style;
        }
      });
    }

    if (forTemplateContext && (Templates.isJsTemplate(sparklineConfig.sparkline) || Templates.isJsTemplate(sparklineConfig.period))) {
      return sparklineConfig;
    }

    const dayNightConfigurationUsesJavascript = Templates.hasJavascriptTemplates({
      show: sparklineConfig.sparkline.show.day_night,
      day_night: sparklineConfig.sparkline.day_night,
      period: sparklineConfig.period,
    });
    if (!forTemplateContext && !dayNightConfigurationUsesJavascript) validateDayNightConfig(sparklineConfig);

    const chartType = sparklineConfig.sparkline.show.chart_type;
    if (["radial", "radial_barcode"].includes(chartType)) {
      const radialConfig = sparklineConfig.sparkline[chartType];
      const radialConfigurationUsesJavascript = Templates.hasJavascriptTemplates({ radial: radialConfig });
      if (!forTemplateContext && !radialConfigurationUsesJavascript) validateRadialConfig(sparklineConfig);
    }

    // Top and bottom legends use rows; left and right legends use columns.
    if (!Templates.isJsTemplate(sparklineConfig.sparkline.legend) && (sparklineConfig.sparkline.legend.position === 'left' || sparklineConfig.sparkline.legend.position === 'right')) {
      sparklineConfig.sparkline.legend.orientation = 'vertical';
    } else if (!Templates.isJsTemplate(sparklineConfig.sparkline.legend)) {
      sparklineConfig.sparkline.legend.orientation = 'horizontal';
    }

    ['calendar', 'rolling_window'].forEach((periodType) => {
      if (sparklineConfig.period[periodType] === undefined || Templates.isJsTemplate(sparklineConfig.period[periodType])) return;

      if (Templates.isJsTemplate(sparklineConfig.period[periodType].bins)) return;
      sparklineConfig.period[periodType].bins ??= {};
      sparklineConfig.period[periodType].bins.per_hour ??= 'auto';
      sparklineConfig.period[periodType].bins.density ??= 'medium';
      sparklineConfig.period[periodType].offset ??= 0;
    });

    if (sparklineConfig.sparkline.show.chart_type === 'state_bands') {
      // State values are discrete, so use hard color changes and place Y labels inside each band.
      sparklineConfig.sparkline.colorstops_transition = 'hard';
      if (normalizedConfig.y_axis?.labels?.styles?.['text-anchor'] === undefined) {
        sparklineConfig.y_axis.labels.styles['text-anchor'] = 'start';
      }
      if (normalizedConfig.y_axis?.labels?.styles?.['dominant-baseline'] === undefined) {
        sparklineConfig.y_axis.labels.styles['dominant-baseline'] = 'hanging';
      }
    }

    if (forTemplateContext) return sparklineConfig;

    if (sparklineConfig.period.type === 'calendar' && sparklineConfig.period.calendar.period === 'day' && Number(sparklineConfig.period.calendar.duration.hour) < 24) {
      // A calendar day must cover a full day, even when a previous rolling-window
      // setting left a shorter duration in the reused config.
      const requestedDuration = sparklineConfig.period.calendar.duration.hour;
      sparklineConfig.period.calendar.duration.hour = 24;
      console.warn(`[FHS sparkline] calendar day duration '${requestedDuration}' hours is shorter than one day; using 24 hours`);
    }

    normalizeAxisVisibility(sparklineConfig.sparkline.show);
    {
      ['bar', 'equalizer'].forEach((chartType) => {
        const background = sparklineConfig.sparkline[chartType].background;
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
      if (sparklineConfig.sparkline.show.chart_type === "bar") {
        if (!['horizontal', 'vertical'].includes(sparklineConfig.sparkline.bar.orientation)) {
          throw new Error('[sparklines] sparkline.bar.orientation must be horizontal or vertical');
        }
        const foreground = sparklineConfig.sparkline.bar.foreground;
        if (!["auto", "none", "fixed", "colorstopsegments", "colorstopgradient"].includes(foreground.show.item_style)) {
          throw new Error("[sparklines] sparkline.bar.foreground.show.item_style must be auto, none, fixed, colorstopsegments or colorstopgradient");
        }
        foreground.styles = ConfigHelper.toStyleDict(foreground.styles);
      }
    }

    {
      const hasLowerBound = sparklineConfig.y_axis.lower_bound !== undefined;
      const hasUpperBound = sparklineConfig.y_axis.upper_bound !== undefined;

      if (hasLowerBound && !Number.isFinite(Number(sparklineConfig.y_axis.lower_bound))) {
        throw new Error('[sparklines] y_axis.lower_bound must be numeric');
      }
      if (hasUpperBound && !Number.isFinite(Number(sparklineConfig.y_axis.upper_bound))) {
        throw new Error('[sparklines] y_axis.upper_bound must be numeric');
      }
      if (hasLowerBound && hasUpperBound && Number(sparklineConfig.y_axis.lower_bound) >= Number(sparklineConfig.y_axis.upper_bound)) {
        throw new Error('[sparklines] y_axis.lower_bound must be smaller than y_axis.upper_bound');
      }
    }

    if (sparklineConfig.period.type === "real_time" && ["bar", "equalizer"].includes(sparklineConfig.sparkline.show.chart_type)) {
      // One live HA value cannot set its own Y range; use a color-stop scale or explicit bounds.
      const colorStopDefinition = sparklineConfig.sparkline.color_stops ?? sparklineConfig.sparkline.colorstops;
      const colorStopScale = ColorStops.normalize(colorStopDefinition).scales.default;
      const hasYAxisBounds = sparklineConfig.y_axis.lower_bound !== undefined && sparklineConfig.y_axis.upper_bound !== undefined;

      if (colorStopScale === undefined && !hasYAxisBounds) {
        throw new Error(`[sparklines] real-time ${sparklineConfig.sparkline.show.chart_type} requires color_stops.scales.default or y_axis.lower_bound and y_axis.upper_bound`);
      }
      if (colorStopScale !== undefined && (colorStopScale.min === undefined || colorStopScale.max === undefined)) {
        throw new Error(`[sparklines] real-time ${sparklineConfig.sparkline.show.chart_type} requires color_stops.scales.default.min and max`);
      }
    }


    const hasExplicitSeries = normalizedConfig.series !== undefined;
    const configuredSeries = hasExplicitSeries ? normalizedConfig.series : [{ id: 'default', entity_index: sparklineConfig.entity_index ?? 0 }];
    const ids = new Set();
    const chartTypes = [];

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
        const periodType = sparklineConfig.period.type;
        // A Series can select another source range, but the parent Sparkline
        // still supplies the time range shown on the graph.
        const periodOverride = seriesConfig.period[periodType];

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
      const chartType = seriesConfig.sparkline?.show?.chart_type ?? sparklineConfig.sparkline.show.chart_type;
      if (hasExplicitSeries && !['line', 'area', 'dots', 'bar', 'radial'].includes(chartType)) {
        throw new Error(`[sparklines] series '${seriesConfig.id}' chart_type must be line, area, dots, bar or radial`);
      }
      if (chartType === 'radial') {
        const chartVariant = seriesConfig.sparkline?.show?.chart_variant ?? sparklineConfig.sparkline.show.chart_variant;
        if (!['line', 'area', 'dots'].includes(chartVariant)) {
          throw new Error(`[sparklines] radial series '${seriesConfig.id}' chart_variant must be line, area or dots`);
        }
        if (seriesConfig.sparkline?.radial !== undefined) {
          throw new Error(`[sparklines] radial series '${seriesConfig.id}' uses the parent sparkline.radial geometry`);
        }
      }
      chartTypes.push(chartType);
      ids.add(seriesConfig.id);
    });

    if (chartTypes.includes('radial') && chartTypes.some((chartType) => chartType !== 'radial')) {
      throw new Error('[sparklines] radial series cannot be combined with cartesian series');
    }
    if ((sparklineConfig.sparkline.show.chart_type === 'radial') !== chartTypes.every((chartType) => chartType === 'radial')) {
      throw new Error('[sparklines] parent chart_type must be radial when its series are radial');
    }

    sparklineConfig.series = configuredSeries.map((seriesConfig) => {
      const seriesConfigComplete = Merge.mergeDeep({}, sparklineConfig, seriesConfig);
      delete seriesConfigComplete.series;

      // A Series-wide paint choice fills line and area settings only when that
      // Series has not configured the individual chart layer.
      const seriesItemStyle = seriesConfig.sparkline?.show?.item_style;
      seriesConfigComplete.sparkline.line.show.item_style = seriesConfig.sparkline?.line?.show?.item_style
        ?? seriesItemStyle
        ?? sparklineConfig.sparkline.line.show.item_style;
      seriesConfigComplete.sparkline.line.minmax.show.item_style = seriesConfig.sparkline?.line?.minmax?.show?.item_style
        ?? seriesItemStyle
        ?? sparklineConfig.sparkline.line.minmax.show.item_style;
      seriesConfigComplete.sparkline.area.show.item_style = seriesConfig.sparkline?.area?.show?.item_style
        ?? seriesItemStyle
        ?? sparklineConfig.sparkline.area.show.item_style;
      seriesConfigComplete.sparkline.area.minmax.show.item_style = seriesConfig.sparkline?.area?.minmax?.show?.item_style
        ?? seriesItemStyle
        ?? sparklineConfig.sparkline.area.minmax.show.item_style;

      [
        ['sparkline.show.item_style', seriesConfigComplete.sparkline.show.item_style],
        ['sparkline.line.show.item_style', seriesConfigComplete.sparkline.line.show.item_style],
        ['sparkline.line.minmax.show.item_style', seriesConfigComplete.sparkline.line.minmax.show.item_style],
        ['sparkline.area.show.item_style', seriesConfigComplete.sparkline.area.show.item_style],
        ['sparkline.area.minmax.show.item_style', seriesConfigComplete.sparkline.area.minmax.show.item_style],
      ].forEach(([name, itemStyle]) => {
        if (!['auto', 'fixed', 'colorstop', 'colorstopinterpolated', 'colorstopgradient'].includes(itemStyle)) {
          throw new Error(`[sparklines] series '${seriesConfig.id}' ${name} must be auto, fixed, colorstop, colorstopinterpolated or colorstopgradient`);
        }
      });


      seriesConfigComplete.y_axis_id = seriesConfig.y_axis_id ?? 'primary';
      return seriesConfigComplete;
    });
    return sparklineConfig;
  }

  /**
   * Stores a Sparkline config and initializes its graph, History, SVG and pointer state.
   * JavaScript-backed configs wait for updateRuntimeConfig() before Series and
   * SparklineGraph instances are created.
   *
   * @param {object} config - One Sparkline layout entry.
   * @param {number} index - Position of this Sparkline in `layout.sparklines`.
   * @param {object} templates - FHS JavaScript-template evaluator.
   * @param {string} cardId - Card id used in generated SVG element ids.
   * @param {LitElement} card - FHS card that supplies HA data and shared layout helpers.
   */
  constructor(config, index, templates, cardId, card) {
    super(SparklineGraphTool.translateConfig(config, true), index, templates, cardId, card, 'sparklines', 'sparklines', 0, undefined, SparklineGraphTool.translateConfig);
    this.geometry = {};
    this.paint = {};
    this.interpolateGradientColor = (colorA, colorB, fraction) => Colors.getGradientValue(
      colorA,
      colorB,
      fraction,
      this.card.cardTheme.colorContext,
    );

    this.legendTextTools = [];
    this.runtime.legendHassAvailable = false;
    this.paint.gradient = [];
    this.geometry.length = [];
    this.geometry.area = [];
    this.geometry.areaMinMax = [];
    this.geometry.line = [];
    this.geometry.bar = [];
    this.geometry.equalizer = [];
    this.geometry.points = [];
    this.geometry.barcodeChart = [];
    this.geometry.barcodeChartBackground = [];
    this.geometry.radialBarcodeChart = [];
    this.geometry.radialBarcodeChartBackground = [];
    this.geometry.graded = [];
    this.geometry.stateBands = [];

    this.geometry.linePath = undefined;
    this.geometry.lineMinPath = undefined;
    this.geometry.lineMaxPath = undefined;
    this.geometry.areaPath = undefined;
    this.geometry.areaMinMaxPath = undefined;
    this.runtime.tooltip = {};
    this.runtime.tooltipVisible = false;
    this.runtime.activePoint = undefined;
    this.runtime.activeX = undefined;
    this.runtime.dragging = false;
    this.runtime.hovering = false;
    this.runtime.pointerEvent = undefined;
    this.runtime.pointerEventTarget = undefined;
    this.elements = {};
    this.pointerSvgElement = undefined;
    this.rid = null;
    this._radialRafId = null;
    this.runtime.pointerSourceSignature = undefined;
    // Keep callback identities stable so SVG and window listeners can be removed later.
    ['pointerFrame', 'pointerMove', 'pointerDown', 'pointerUp', 'touchStart', 'mouseDown', 'hoverEnter', 'hoverMove', 'hoverLeave'].forEach((handler) => {
      this[handler] = this[handler].bind(this);
    });
    this.runtime.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.runtime.graphDataChanged = true;

    if (!this.hasJavascript) this.initializeGraphOwners();
  }

  /** Applies changed Series settings and refreshes their colors for the active HA theme. */
  completeRuntimeConfig(newConfig, evaluatedSourceConfig) {
    if (this.configurationChanged) {
      if (this.sparklineSeries === undefined) {
        this.sparklineSeries = new SparklineSeries(newConfig, evaluatedSourceConfig);
      } else {
        this.sparklineSeries.updateConfig(newConfig, evaluatedSourceConfig);
      }
    }
    if (this.sparklineSeries !== undefined && (this.configurationChanged || this.themeModeChanged || this.groupChanged)) {
      this.sparklineSeries.updatePalettePaint(this.paint.colorStops, this.card.cardTheme.getActiveColorStopMode());
      const paletteCalculationSignature = this.sparklineSeries.getPaletteCalculationSignature(this.paint.colorStops);
      this.runtime.paletteCalculationChanged = this.runtime.paletteCalculationSignature !== paletteCalculationSignature;
      this.runtime.paletteCalculationSignature = paletteCalculationSignature;
    } else {
      this.runtime.paletteCalculationChanged = false;
    }
    return newConfig;
  }

  /**
   * Creates Sparkline Series and History, then prepares the first graph layout.
   * A chart without explicit series uses one internal Series named default.
   */
  initializeGraphOwners() {
    if (this.paint.colorStops === undefined) {
      const colorStopsDefinition = this.config.sparkline.color_stops ?? this.config.sparkline.colorstops;
      this.paint.colorStops = ColorStops.normalize(colorStopsDefinition, this.card.cardTheme.getActiveColorStopMode());
    }
    if (this.sparklineSeries === undefined) this.sparklineSeries = new SparklineSeries(this.config, this.sourceConfig);

    this.geometry.svg = this.calculateSvgDimensions();
    this.geometry.legendMeasuredFontSize = undefined;
    this.geometry.legendMeasuredRowHeight = undefined;
    this.geometry.legendMeasuredSignature = undefined;
    this.geometry.legendMeasurementConfigSignature = JSON.stringify({
      visible: this.config.sparkline.show.legend,
      config: this.config.sparkline.legend,
    });
    this.geometry.graphGeometryChanged = false;
    this.geometry.legendLayout = this.calculateLegendLayout();
    this.geometry.graphArea = this.geometry.legendLayout.graphArea;
    this.legendTextTools = [];
    this.runtime.legendTextSignature = undefined;
    this.geometry.configuredGraphMargin = this.geometry.svg.margin;
    this.geometry.axisMargin = { t: 0, r: 0, b: 0, l: 0, x: 0, y: 0 };
    this.geometry.axisGraphs = { primary: undefined, secondary: undefined };
    this.runtime.stateBandsStateMap = this.config.sparkline.state_map;
    this.geometry.gradeValues = [];
    this.geometry.gradeRanks = [];

    const initialHistoryDuration = this.config.period.type === 'real_time' ? 1 : Number(this.config.period[this.config.period.type].duration.hour);
    this.runtime.periodDurationAvailable = this.config.period.type === 'real_time' || (Number.isFinite(initialHistoryDuration) && initialHistoryDuration > 0);
    this.sparklineHistory = new SparklineHistory(
      this.config.period,
      this.runtime.stateBandsStateMap,
      this.sparklineSeries.items,
      this.runtime.periodDurationAvailable,
      this.config.sparkline.show.day_night,
      {
        binBoundaryReached: () => this.historyBinBoundaryReached(),
        seriesHistoryDue: (seriesId) => this.historySeriesRequestDue(seriesId),
        dayNightHistoryDue: () => this.fetchDayNightHistoryIfNeeded(),
      },
    );

    if (this.runtime.periodDurationAvailable) this.sparklineSeries.updateBinPlan();
    const sharedBinsPerHour = this.runtime.periodDurationAvailable ? this.sparklineSeries.binPlan.perHour : undefined;
    if (this.paint.colorStops !== undefined) {
      this.sparklineSeries.updatePalettePaint(this.paint.colorStops, this.card.cardTheme.getActiveColorStopMode());
    }
    if (this.runtime.periodDurationAvailable && this.sparklineSeries.primaryItem.paint.colorStops !== undefined) {
      this.sparklineSeries.items.forEach((item) => {
        const graphInput = this.buildGraphInput(item, sharedBinsPerHour);
        this.sparklineSeries.configureGraph(
          item,
          this.geometry.graphArea.width,
          this.geometry.graphArea.height,
          this.geometry.axisMargin,
          this.geometry.configuredGraphMargin,
          graphInput,
          this.geometry.gradeValues,
          this.geometry.gradeRanks,
          graphInput.sparkline.state_map ?? {},
        );
      });
    }

    this.geometry.radialBarcodeChartWidth = Utils.calculateSvgDimension(this.config.sparkline.radial_barcode.size);
    if (this.card.cardTools?.connectedToCard === false) this.sparklineHistory.disconnected();
  }
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

  /** Reserves the configured top, bottom, left or right area for the Series legend. */
  calculateLegendLayout() {
    const legend = this.config.sparkline.legend;
    const horizontal = legend.orientation === 'horizontal';
    const gap = this.config.sparkline.show.legend ? Utils.calculateSvgDimension(legend.gap) : 0;
    const legendWidth = horizontal ? this.geometry.svg.width : Utils.calculateSvgDimension(legend.width);
    const legendFontSize = this.geometry.legendMeasuredFontSize ?? this.resolveLegendFontSize();
    const legendRowHeight = this.geometry.legendMeasuredRowHeight ?? legendFontSize * Number(legend.line_height);
    const markerRadius = Math.min(Utils.calculateSvgDimension(legend.marker_size), legendFontSize / 2);
    const legendRows = Number(legend.rows);
    const legendHeight = horizontal ? (legend.height === undefined ? legendRowHeight * legendRows : Utils.calculateSvgDimension(legend.height)) : this.geometry.svg.height;
    const legendArea = { x: 0, y: 0, width: 0, height: 0 };
    const graphArea = { x: 0, y: 0, width: this.geometry.svg.width, height: this.geometry.svg.height };

    if (this.config.sparkline.show.legend) {
      legendArea.width = legendWidth;
      legendArea.height = legendHeight;

      if (legend.position === 'top') {
        graphArea.y = legendHeight + gap;
        graphArea.height = this.geometry.svg.height - legendHeight - gap;
      } else if (legend.position === 'bottom') {
        graphArea.height = this.geometry.svg.height - legendHeight - gap;
        legendArea.y = graphArea.height + gap;
      } else if (legend.position === 'left') {
        graphArea.x = legendWidth + gap;
        graphArea.width = this.geometry.svg.width - legendWidth - gap;
      } else if (legend.position === 'right') {
        graphArea.width = this.geometry.svg.width - legendWidth - gap;
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

  /** Converts the configured legend font size to the SVG units used by this card. */
  resolveLegendFontSize() {
    const styles = ConfigHelper.toStyleDict(this.config.sparkline.legend.styles);
    const fontSize = styles['font-size'];
    const value = Number.parseFloat(fontSize);
    const fontSizePixels =
      typeof fontSize === 'number' ? value : fontSize.endsWith('em') || fontSize.endsWith('rem') ? value * FONT_SIZE : fontSize.endsWith('px') ? value : fontSize.endsWith('%') ? (value / 100) * FONT_SIZE : value;

    return fontSizePixels * (100 / SVG_DEFAULT_DIMENSIONS);
  }

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
   * Reserves outer space for visible Cartesian ticks and labels. The configured
   * Sparkline margin is applied separately inside the axes, around graph data.
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
    const primaryGraph = this.geometry.axisGraphs.primary;
    const secondaryGraph = this.geometry.axisGraphs.secondary;
    const primaryChartAxes = primaryGraph !== undefined ? CHART_AXES[primaryGraph.input.sparkline.show.chart_type] : undefined;
    const secondaryChartAxes = secondaryGraph !== undefined ? CHART_AXES[secondaryGraph.input.sparkline.show.chart_type] : undefined;
    const primaryShowYTickmarks = primaryGraph !== undefined && primaryChartAxes.y && primaryGraph.input.sparkline.show.tickmarks.y;
    const secondaryShowYTickmarks = secondaryGraph !== undefined && secondaryChartAxes.y && secondaryGraph.input.sparkline.show.tickmarks.y;
    const primaryShowYLabels = primaryGraph !== undefined && primaryChartAxes.y && primaryGraph.input.sparkline.show.labels.y;
    const secondaryShowYLabels = secondaryGraph !== undefined && secondaryChartAxes.y && secondaryGraph.input.sparkline.show.labels.y;
    const primaryYTickSize = primaryShowYTickmarks ? Utils.calculateSvgDimension(primaryGraph.input.y_axis.tickmarks_major.size) : 0;
    const secondaryYTickSize = secondaryShowYTickmarks ? Utils.calculateSvgDimension(secondaryGraph.input.y_axis.tickmarks_major.size) : 0;
    const primaryYLabelOffset = primaryShowYLabels ? Utils.calculateSvgDimension(primaryGraph.input.y_axis.labels.offset) : 0;
    const secondaryYLabelOffset = secondaryShowYLabels ? Utils.calculateSvgDimension(secondaryGraph.input.y_axis.labels.offset) : 0;
    const primaryYLabels = primaryShowYLabels ? this.buildYAxisTicks('major', primaryGraph).map((tick) => tick.label) : [];
    const secondaryYLabels = secondaryShowYLabels ? this.buildYAxisTicks('major', secondaryGraph).map((tick) => tick.label) : [];
    const primaryYLabelWidth = primaryYLabels.reduce((length, label) => Math.max(length, label.length), 0) * yFontSize * 0.5;
    const secondaryYLabelWidth = secondaryYLabels.reduce((length, label) => Math.max(length, label.length), 0) * yFontSize * 0.5;
    let t = 0;
    let r = 0;
    let b = xTickSize;
    let l = 0;

    // X endpoint labels reserve space beyond the graph; primary and secondary Y labels use opposite sides.
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

    if (primaryShowYLabels && primaryGraph.input.sparkline.show.chart_type !== 'state_bands') {
      l = Math.max(l, primaryYTickSize + primaryYLabelOffset + primaryYLabelWidth);
      t = Math.max(t, yFontHeight / 2);
      b = Math.max(b, yFontHeight / 2);
    } else if (primaryShowYTickmarks) {
      l = Math.max(l, primaryYTickSize);
    }
    if (secondaryShowYLabels && secondaryGraph.input.sparkline.show.chart_type !== 'state_bands') {
      r = Math.max(r, secondaryYTickSize + secondaryYLabelOffset + secondaryYLabelWidth);
      t = Math.max(t, yFontHeight / 2);
      b = Math.max(b, yFontHeight / 2);
    } else if (secondaryShowYTickmarks) {
      r = Math.max(r, secondaryYTickSize);
    }

    return { t, r, b, l, x: l, y: t };
  }

  /** Reserves equal outer space for the enabled radial axes, ticks and labels. */
  calculateRadialAxisMargin(axisGraphs) {
    const show = this.config.sparkline.show;
    const chartAxes = CHART_AXES[show.chart_type];
    const xTickSize = chartAxes.x && show.tickmarks.x ? Utils.calculateSvgDimension(this.config.x_axis.tickmarks_major.size) : 0;
    const xLabelExtent =
      chartAxes.x && show.labels.x ? Utils.calculateSvgDimension(this.config.x_axis.labels.offset) + this.resolveAxisFontSizePixels('x', FONT_SIZE) : 0;
    const yGraphs = [axisGraphs.primary, axisGraphs.secondary].filter(
      (graph) => graph !== undefined && CHART_AXES[graph.input.sparkline.show.chart_type].y,
    );
    let yExtent = 0;

    yGraphs.forEach((graph) => {
      const yTickSize = graph.input.sparkline.show.tickmarks.y ? Utils.calculateSvgDimension(graph.input.y_axis.tickmarks_major.size) : 0;
      const yLabelExtent = graph.input.sparkline.show.labels.y
        ? Utils.calculateSvgDimension(graph.input.y_axis.labels.offset) +
          this.buildYAxisTicks('major', graph).reduce((width, tick) => Math.max(width, tick.label.length), 0) * this.resolveAxisFontSizePixels('y', FONT_SIZE) * 0.5
        : 0;
      yExtent = Math.max(yExtent, yTickSize + yLabelExtent);
    });

    const extent = Math.max(xTickSize + xLabelExtent, yExtent);
    return { t: extent, r: extent, b: extent, l: extent, x: extent, y: extent };
  }

  /**
   * Builds the graph settings for one Series using the Sparkline's shared time axis.
   * SparklineHistory applies a Series offset when it requests HA rows, then maps
   * those rows onto this shared graph period so comparison Series line up.
   */
  buildGraphInput(item, sharedBinsPerHour) {
    const config = item.config;
    const period = Merge.mergeDeep({}, this.config.period);
    const graphType = config.sparkline.show.chart_type;
    const comparesCalendarDays = period.type === 'calendar' && this.sparklineSeries.items.some((item) => Number(item.config.period.calendar.offset) !== Number(this.config.period.calendar.offset));

    // Compare complete calendar days; otherwise the earlier day would stop at
    // the current time of day while the current day continues to now.
    if (comparesCalendarDays) period.calendar.full_day = true;
    // State bands use exact mapped HA state changes instead of numeric time bins.
    const sparkline =
      graphType === 'state_bands'
        ? {
            ...config.sparkline,
            state_map: this.runtime.stateBandsStateMap,
          }
        : config.sparkline;
    const yAxis = Merge.mergeDeep({}, config.y_axis);

    // Normally, configured bounds fix the Y range and unset bounds follow Series
    // data. For a live bar/equalizer, a default color-stop scale takes precedence
    // over both bounds, giving the single current value a fixed min/max range.
    const defaultColorStopScale = item.paint.colorStops.scales.default;
    if (period.type === 'real_time' && ['bar', 'equalizer'].includes(graphType) && defaultColorStopScale !== undefined) {
      yAxis.lower_bound = Number(defaultColorStopScale.min);
      yAxis.upper_bound = Number(defaultColorStopScale.max);
    }

    if (period.type !== 'real_time') {
      period[period.type].bins.per_hour = sharedBinsPerHour;
    }

    return {
      width: this.geometry.graphArea.width,
      height: this.geometry.graphArea.height,
      geometry: {
        line_width: this.getConfiguredLineWidth(config),
        column_spacing: this.geometry.svg.column_spacing,
        row_spacing: this.geometry.svg.row_spacing,
      },
      labelLocale: this.geometry.xAxisLabelLocaleKey,
      period,
      sparkline,
      x_axis: {
        ...config.x_axis,
        labels: {
          ...config.x_axis.labels,
          max_length: this.geometry.xAxisLabelLength,
        },
      },
      y_axis: yAxis,
    };
  }

  /**
   * Reuses the Series graphs for ordinary HA/History updates. Reapply their
   * settings and drawing area when config, group, color-stop scales, localized
   * labels or browser-measured legend dimensions change.
   */
  updateRuntimeConfig() {
    const firstDynamicPublication = this.hasJavascript && !this.runtimeConfigInitialized;
    super.updateRuntimeConfig();

    if (this.configurationChanged || this.groupChanged || this.runtime.paletteCalculationChanged) this.geometry.graphGeometryChanged = true;

    if (firstDynamicPublication) this.initializeGraphOwners();

    const historyDuration = this.config.period.type === 'real_time' ? 1 : Number(this.config.period[this.config.period.type].duration.hour);
    this.runtime.periodDurationAvailable = this.config.period.type === 'real_time' || (Number.isFinite(historyDuration) && historyDuration > 0);

    if (this.card.dev.debug && this.configChanged) {
      console.log('[FHS sparkline runtime period]', {
        cardId: this.cardId,
        sparklineId: this.config.id,
        periodType: this.config.period.type,
        durationHours: this.config.period.type === 'rolling_window' ? this.config.period.rolling_window.duration.hour : this.config.period.calendar.duration.hour,
        historyResynchronizationRequested: this.sparklineHistory.getRequestFacts(this.sparklineSeries.primaryItem.id).resynchronizationRequested,
      });
    }

    if (this.sparklineHistory.preservesGraphWhileLoading()) return;

    const localeKey = JSON.stringify([this.card._hass.locale, this.card._hass.config.time_zone]);

    if (this.geometry.xAxisLabelLocaleKey !== localeKey) {
      // Sample localized month and hour labels so the X-axis margin follows the
      // current HA language and time zone instead of assuming English label widths.
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

      this.geometry.xAxisLabelLength = Math.max(...labelLengths);
      this.geometry.xAxisLabelLocaleKey = localeKey;
      this.geometry.graphGeometryChanged = true;
    }

    if (!this.geometry.graphGeometryChanged) return;

    if (this.config.sparkline.show.chart_type === 'state_bands') {
      const entity = this.card.entities[this.entity_index];
      const entityConfig = this.card.runtimeEntityConfigs[this.entity_index];
      // Format each state-map label like the HA entity or attribute shown by Text and State tools.
      this.runtime.stateBandsStateMap = {
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

    this.geometry.svg = this.calculateSvgDimensions(this.config);
    const legendMeasurementConfigSignature = JSON.stringify({
      visible: this.config.sparkline.show.legend,
      config: this.config.sparkline.legend,
    });
    if (legendMeasurementConfigSignature !== this.geometry.legendMeasurementConfigSignature) {
      this.geometry.legendMeasuredFontSize = undefined;
      this.geometry.legendMeasuredRowHeight = undefined;
      this.geometry.legendMeasuredSignature = undefined;
      this.geometry.legendMeasurementConfigSignature = legendMeasurementConfigSignature;
    }
    this.geometry.legendLayout = this.calculateLegendLayout();
    this.geometry.graphArea = this.geometry.legendLayout.graphArea;
    this.geometry.configuredGraphMargin = this.geometry.svg.margin;

    // Stop a gesture when a chart mode, period type or Series-to-entity mapping changes what its bucket index means.
    const pointerSourceSignature = JSON.stringify([
      this.config.sparkline.show.chart_type,
      this.config.period.type,
      this.sparklineSeries.items.map((item) => [item.id, item.entity_index, item.config.sparkline.show.chart_type]),
    ]);
    if (this.runtime.pointerSourceSignature !== pointerSourceSignature) this.stopPointerInteraction();
    this.runtime.pointerSourceSignature = pointerSourceSignature;
    const historyConfigChanges = this.sparklineHistory.updateInputs(
      this.config.period,
      this.runtime.stateBandsStateMap,
      this.sparklineSeries.items,
      this.runtime.periodDurationAvailable,
      this.config.sparkline.show.day_night,
    );
    this.sparklineSeries.items.forEach((item) => {
      this.sparklineSeries.setRequestState(item, this.sparklineHistory.getRequestFacts(item.id).requestState);
    });

    if (historyConfigChanges.periodChanged) {
      if (this.historyLoading) this.stopPointerInteraction();
      // A larger period may need older HA rows. Keep the current SVG until those rows arrive.
      if (this.sparklineHistory.preservesGraphWhileLoading()) return;
    }

    // Do not draw a historical graph until its requested period has a positive duration.
    if (!this.runtime.periodDurationAvailable) {
      this.sparklineSeries.items.forEach((item) => {
        item.rows = [];
        this.sparklineHistory.clearSeries(item.id);
      });
      this.sparklineSeries.clearGraphs();
      this.stopPointerInteraction();
      this.geometry.graphGeometryChanged = false;
      return;
    }

    this.geometry.gradeValues = [];
    this.paint.colorStops.colors.map((value, index) => (this.geometry.gradeValues[index] = value.value));

    this.geometry.gradeRanks = [];
    this.paint.colorStops.colors.map((value, index) => {
      const rankIndex = this.config.sparkline.show.chart_variant === 'rank_order' && value.rank !== undefined ? value.rank : index;

      if (!this.geometry.gradeRanks[rankIndex]) {
        this.geometry.gradeRanks[rankIndex] = {
          value: [],
          rangeMin: [],
          rangeMax: [],
        };
      }

      this.geometry.gradeRanks[rankIndex].rank = rankIndex;
      this.geometry.gradeRanks[rankIndex].value.push(value.value);
      this.geometry.gradeRanks[rankIndex].rangeMin.push(value.value);
      this.geometry.gradeRanks[rankIndex].rangeMax.push(this.paint.colorStops.colors[index + 1]?.value ?? Infinity);
      return true;
    });
    // One bin rate keeps historical Series on matching X positions even when
    // their chart widths or configured densities differ.
    this.sparklineSeries.updateBinPlan();
    const sharedBinsPerHour = this.sparklineSeries.binPlan.perHour;
    this.sparklineSeries.items.forEach((item) => {
      const graphInput = this.buildGraphInput(item, sharedBinsPerHour);
      this.sparklineSeries.configureGraph(
        item,
        this.geometry.graphArea.width,
        this.geometry.graphArea.height,
        this.geometry.axisMargin,
        this.geometry.configuredGraphMargin,
        graphInput,
        this.geometry.gradeValues,
        this.geometry.gradeRanks,
        graphInput.sparkline.state_map ?? {},
      );
    });
    this.geometry.graphGeometryChanged = false;
  }

  /**
   * Binds every Series to its configured HA entity or attribute, prepares live
   * and History rows, and recalculates the graph after all Series requests finish.
   * Day/night shading requests `sun.sun` separately from the configured Series.
   *
   * @param {Array<object>} entityConfigs - Current FHS config for each HA entity slot.
   * @param {Array<object>} entities - Current HA entity state for each FHS entity slot.
   */
  setEntities(entityConfigs, entities) {
    this.sparklineSeries.items.forEach((item) => {
      item.entity = entities[item.entity_index];
      item.entityConfig = entityConfigs[item.entity_index];
    });

    const primaryItem = this.sparklineSeries.primaryItem;
    super.setState(primaryItem.entity, primaryItem.entityConfig);

    let sourceEntityChanged = false;
    this.sparklineSeries.items.forEach((item) => {
      const previousRows = item.rows;
      const realTime = item.config.period.type === 'real_time';
      const historyEntityChanged = this.sparklineHistory.bindSeriesEntity(item);
      this.sparklineSeries.setRequestState(item, this.sparklineHistory.getRequestFacts(item.id).requestState);

      if (historyEntityChanged) {
        sourceEntityChanged = true;
        item.rows = [];
      }

      // A real-time graph uses the current HA state; historical graphs add that
      // same state only when the requested time range includes the present.
      if (realTime) {
        const value = this.getEntityNumericState(item, item.entity);
        // HA can record a new sample time without changing the formatted state value.
        if (item.rows.length !== 1 || item.rows[0].state !== value || item.rows[0].last_changed !== item.entity.last_changed) {
          item.rows = [{ state: value, last_changed: item.entity.last_changed }];
        }
      } else if (!this.runtime.periodDurationAvailable) {
        item.rows = [];
      } else if (this.sparklineHistory.hasRows(item.id) && !this.sparklineHistory.getRequestFacts(item.id).preserveGraphWhileLoading) {
        const range = this.sparklineHistory.getSeriesRange(item);
        this.sparklineHistory.addCurrentEntityState(item, range);
        item.rows = this.sparklineHistory.getRows(item.id);
      } else {
        if (item.rows.length > 0) item.rows = [];
      }
      if (item.rows !== previousRows) this.runtime.graphDataChanged = true;
    });

    if (sourceEntityChanged) {
      this.sparklineHistory.stopTimeBoundaryUpdates();
      this.stopPointerInteraction();
    }

    const historicalItems = this.sparklineSeries.items.filter((item) => item.config.period.type !== 'real_time');
    if (historicalItems.length === 0) this.sparklineHistory.stopTimeBoundaryUpdates();

    const allSeriesRequestsCompleted = this.sparklineSeries.items.every((item) => [
      SPARKLINE_REQUEST_STATE.LOADED,
      SPARKLINE_REQUEST_STATE.NOT_REQUIRED,
    ].includes(item.requestState));
    const graphCalculationRequired = this.runtime.periodDurationAvailable && (this.runtime.graphDataChanged
      || this.sparklineSeries.items.some((item) => item.graph.dataConfigChanged || item.graph.geometryConfigChanged));
    // Wait for every comparison Series so shared axes never mix new and old History rows.
    if (allSeriesRequestsCompleted && graphCalculationRequired) {
      this.updateGraphFromSeries();
      this.synchronizePointerPresentation();
    }


    historicalItems.forEach((item) => this.fetchHistoryIfNeeded(item));
    if (this.config.sparkline.show.day_night) {
      // The day/night layer follows HA's sun.sun History, not a user-selected graph Series.
      const sunEntity = this.card._hass.states['sun.sun'];
      this.sparklineHistory.bindDayNightEntity(sunEntity);
      this.fetchDayNightHistoryIfNeeded();
    }
    // Refresh active rows at bin boundaries and check for new calendar History at local midnight.
    if (historicalItems.length > 0 && !this.sparklineHistory.preservesGraphWhileLoading()) {
      this.sparklineHistory.scheduleTimeBoundaryUpdates(
        this.config.sparkline.show.chart_type,
        this.config.sparkline.state_bands.update_interval,
        this.sparklineSeries.binPlan.perHour,
      );
    }
  }

  /** Adds the newly current HA state at a bin boundary and refreshes graph statistics. */
  historyBinBoundaryReached() {
    this.runtime.graphDataChanged = true;
    this.sparklineSeries.items.forEach((item) => {
      if (item.config.period.type === 'real_time') return;
      const range = this.sparklineHistory.getSeriesRange(item);
      if (this.sparklineHistory.hasRows(item.id) && !this.sparklineHistory.getRequestFacts(item.id).preserveGraphWhileLoading) {
        this.sparklineHistory.addCurrentEntityState(item, range);
        item.rows = this.sparklineHistory.getRows(item.id);
      }
    });
    this.updateGraphFromSeries();
    this.synchronizePointerPresentation();
    this.card.updateSparklineResult(this);
  }

  /** Starts the HA History refresh requested for one Series. */
  historySeriesRequestDue(seriesId) {
    const item = this.sparklineSeries.items.find((seriesItem) => seriesItem.id === seriesId);
    const previousRequestState = item.requestState;
    this.fetchHistoryIfNeeded(item);
    if (item.requestState !== previousRequestState) this.card.updateSparklineResult(this);
  }

  /** Stops History timers, keeps accepted rows, and releases the SVG and legend Text handlers. */
  disconnected() {
    if (this.hasJavascript && !this.runtimeConfigInitialized) return;
    this.sparklineHistory.disconnected();
    this.legendTextTools.forEach((tool) => tool.disconnected());
    this.sparklineSeries.items.forEach((item) => {
      this.sparklineSeries.setRequestState(item, this.sparklineHistory.getRequestFacts(item.id).requestState);
    });
    this.detachPointerHandlers();
  }

  /**
   * Marks active History ranges for refresh when the Sparkline reconnects. The
   * next HA update requests fresh rows while keeping previously loaded rows.
   */
  connected() {
    if (this.hasJavascript && !this.runtimeConfigInitialized) return;
    this.sparklineHistory.connected();
    this.legendTextTools.forEach((tool) => tool.connected());
    this.sparklineSeries.items.forEach((item) => {
      this.sparklineSeries.setRequestState(item, this.sparklineHistory.getRequestFacts(item.id).requestState);
    });
    this.clearTooltip();
  }

  /** Refreshes cached History after Home Assistant reports that its websocket is ready. */
  hassConnected() {
    this.connected();
    this.legendTextTools.forEach((tool) => tool.hassConnected());
  }

  /** Lets the legend Text tools format Series names from Home Assistant entity data. */
  hassAvailable() {
    this.runtime.legendHassAvailable = true;
    this.legendTextTools.forEach((tool) => tool.hassAvailable());
  }

  /**
   * Returns true when the next HA state update must retry History or bind a new
   * `sun.sun` entity for the day/night layer.
   */
  requiresHassUpdate() {
    if (this.hasJavascript && !this.runtimeConfigInitialized) return true;
    return this.sparklineHistory.requiresHassUpdate()
      || (this.sparklineHistory.dayNightEnabled
        && this.sparklineHistory.dayNightRecord.sunEntity !== this.card._hass.states['sun.sun']);
  }

  /** Requests `sun.sun` History for the time range shaded as day and night. */
  fetchDayNightHistoryIfNeeded() {
    const request = this.sparklineHistory.requestDayNightHistory(this.card._hass);
    if (request.started) return request.promise.then((result) => {
      if (request.isCurrent()) this.dayNightHistoryRequestCompleted(result);
    });
    return undefined;
  }

  /** Ignores an outdated sun History response and redraws after a current response. */
  dayNightHistoryRequestCompleted(result) {
    if (result.status === SPARKLINE_HISTORY_RESULT.STALE) {
      if (result.retryImmediately) this.fetchDayNightHistoryIfNeeded();
      return;
    }
    if (result.status === SPARKLINE_HISTORY_RESULT.FAILED) {
      console.error('[FHS sparkline day/night history request failed]', result.error);
      this.card.requestUpdate();
      return;
    }

    this.card.requestUpdate();
  }

  /**
   * Requests HA History for one Series when its configured time range is missing
   * or its `history.refresh_interval` has elapsed.
   *
   * @param {object} item - Sparkline Series with its HA entity and period config.
   */
  fetchHistoryIfNeeded(item) {
    const request = this.sparklineHistory.requestSeriesHistory(item, this.card._hass);
    if (!request.historyAvailable) return undefined;

    const requestFacts = this.sparklineHistory.getRequestFacts(item.id);
    this.sparklineSeries.setRequestState(item, requestFacts.requestState);

    if (this.card.dev.debug) {
      console.log('[FHS sparkline history decision]', {
        cardId: this.cardId,
        sparklineId: item.config.id,
        durationHours: item.config.period.type === 'rolling_window' ? item.config.period.rolling_window.duration.hour : item.config.period.calendar.duration.hour,
        historyPromiseActive: requestFacts.requestPending,
        historyRows: this.sparklineHistory.getRows(item.id)?.length,
        historyResynchronizationRequested: requestFacts.resynchronizationRequested,
        representedRange: request.representedRange,
        rangeStart: request.range.start.toISOString(),
        rangeEnd: request.range.end.toISOString(),
      });
    }

    if (request.loadingStarted) {
      this.stopPointerInteraction();
    }
    if (request.started) return request.promise.then((result) => {
      if (request.isCurrent()) this.historyRequestCompleted(result);
    });
    return undefined;
  }

  /**
   * Ignores stale or failed HA History. Accepted rows update the Series graph,
   * then the card refreshes configured `fhs_sparkline.*` entities that use its statistics.
   */
  historyRequestCompleted(result) {
    if (result.status === SPARKLINE_HISTORY_RESULT.STALE) {
      if (result.retryImmediately) {
        const item = this.sparklineSeries.items.find((seriesItem) => seriesItem.id === result.seriesId);
        this.historySeriesRequestDue(item.id);
      }
      return;
    }
    if (result.status === SPARKLINE_HISTORY_RESULT.FAILED) {
      const item = this.sparklineSeries.items.find((seriesItem) => seriesItem.id === result.seriesId);
      this.sparklineSeries.setRequestState(item, this.sparklineHistory.getRequestFacts(item.id).requestState);
      this.stopPointerInteraction();
      console.error('[FHS sparkline history request failed]', result.error);
      this.card.updateSparklineResult(this);
      return;
    }

    const item = this.sparklineSeries.items.find((seriesItem) => seriesItem.id === result.seriesId);
    this.sparklineSeries.setRequestState(item, this.sparklineHistory.getRequestFacts(item.id).requestState);
    try {
      if ((result.rebuildGraphInput || this.geometry.graphGeometryChanged) && !this.sparklineHistory.preservesGraphWhileLoading()) {
        this.updateRuntimeConfig();
        this.sparklineHistory.scheduleTimeBoundaryUpdates(
          this.config.sparkline.show.chart_type,
          this.config.sparkline.state_bands.update_interval,
          this.sparklineSeries.binPlan.perHour,
        );
      }

      // SparklineHistory already added the current HA state when this range includes now.
      item.rows = result.rows;
      this.runtime.graphDataChanged = true;
      this.updateGraphFromSeries();
      this.synchronizePointerPresentation();

      if (this.card.dev.debug) {
        console.log('[FHS sparkline history response]', {
          cardId: this.cardId,
          sparklineId: item.config.id,
          requestedRangeStart: result.range.start.toISOString(),
          requestedRangeEnd: result.range.end.toISOString(),
          historyRows: result.rows.length,
          requestedEntityId: item.entity.entity_id,
        });
      }

      this.card.updateSparklineResult(this);
    } finally {
      // Keep this History result pending until the card has refreshed its fhs_sparkline.* values.
      this.sparklineHistory.finishAcceptedResult(result.seriesId);
    }
  }

  /** Reads the configured HA attribute, or the entity state, as a graph number. */
  getEntityNumericState(item, entity) {
    if (item.entityConfig?.attribute) {
      return Number(entity.attributes[item.entityConfig.attribute]);
    }

    return Number(entity.state);
  }

  /**
   * Calculates line, area, dot and bar Series against shared Cartesian axes.
   * Series on the primary and secondary Y axes get separate shared value ranges;
   * an empty History result clears the previous SVG paths instead of leaving old data visible.
   */
  updateCartesianSeriesGraphs() {
    const statisticsRanges = new Map();
    this.sparklineSeries.items.forEach((item) => {
      if (item.config.period.type !== 'real_time') {
        const range = this.sparklineHistory.getSeriesRange(item);
        if (range.sourceRangeIsActive && this.sparklineHistory.hasRows(item.id)) {
          statisticsRanges.set(item, this.sparklineHistory.pruneActiveRows(item, item.graph.points));
        }
        item.graph.hours = (range.plotEnd.getTime() - range.plotStart.getTime()) / (60 * 60 * 1000);
        item.graph.activeDataEnd = range.sourceRangeIsActive ? range.plotActiveEnd : undefined;
        item.rowsUpdate = this.sparklineHistory.takeRowsUpdate(item.id);
      } else {
        item.graph.activeDataEnd = undefined;
        item.rowsUpdate = undefined;
      }
    });

    const coordinatedGraphs = this.sparklineSeries.updateCartesianGraphs(
      (axisGraphs) => {
        this.geometry.axisGraphs = axisGraphs;
        return this.calculateAxisMargin();
      },
      this.geometry.configuredGraphMargin,
      this.geometry.svg.column_spacing,
      this.geometry.svg.row_spacing,
    );
    this.geometry.seriesGeometryChanged = coordinatedGraphs.geometryChanged;
    if (this.runtime.graphDataChanged && coordinatedGraphs.dataState === SPARKLINE_DATA_STATE.HAS_DATA) {
      this.sparklineSeries.items.forEach((item) => {
        if (item.dataState !== SPARKLINE_DATA_STATE.HAS_DATA) return;
        item.graph.updateStatistics(item.rows, statisticsRanges.get(item), item.entity.last_changed);
      });
    }
    // Keep the existing SVG paths when new rows or paint leave graph geometry unchanged.
    if (coordinatedGraphs.geometryChanged === false) return;

    // Remove old SVG paths before checking whether the current rows contain graphable values.
    this.geometry.area = [];
    this.geometry.areaMinMax = [];
    this.geometry.line = [];
    this.geometry.bar = [];
    this.geometry.points = [];
    this.geometry.barcodeChart = [];
    this.geometry.barcodeChartBackground = [];
    this.geometry.radialBarcodeChart = [];
    this.geometry.radialBarcodeChartBackground = [];
    this.geometry.equalizer = [];
    this.geometry.graded = [];
    this.geometry.stateBands = [];
    this.paint.gradient = [];
    this.geometry.linePath = undefined;
    this.geometry.lineMinPath = undefined;
    this.geometry.lineMaxPath = undefined;
    this.geometry.areaPath = undefined;
    this.geometry.areaMinMaxPath = undefined;

    if (coordinatedGraphs.dataState !== SPARKLINE_DATA_STATE.HAS_DATA) {
      this.stopPointerInteraction();
      return;
    }
    this.geometry.axisGraphs = coordinatedGraphs.axisGraphs;
    this.geometry.axisMargin = coordinatedGraphs.axisMargin;

    this.sparklineSeries.items.forEach((item, index) => {
      if (item.dataState !== SPARKLINE_DATA_STATE.HAS_DATA) return;

      const { graph, config } = item;
      const chartType = config.sparkline.show.chart_type;
      if (['line', 'area'].includes(chartType)) {
        const path = graph.getPath();
        if (config.sparkline.show.line !== false && (this.sparklineSeries.items.length > 1 || this.runtime.entityConfig?.show_line !== false)) this.geometry.line[index] = path;
        if (index === 0) this.geometry.linePath = path;
        if (chartType === 'area') {
          this.geometry.area[index] = graph.getArea(path);
          if (index === 0) this.geometry.areaPath = this.geometry.area[index];
        }
        const showMinMax = chartType === 'line' ? config.sparkline.line.show.minmax === true : config.sparkline.area.show.minmax === true;
        if (showMinMax) {
          const minPath = graph.getPathMin();
          const maxPath = graph.getPathMax();
          this.geometry.areaMinMax[index] = graph.getAreaMinMax(minPath, maxPath);
          if (index === 0) {
            this.geometry.lineMinPath = minPath;
            this.geometry.lineMaxPath = maxPath;
            this.geometry.areaMinMaxPath = this.geometry.areaMinMax[index];
          }
        }
      }
      if (chartType === 'dots' || config.sparkline.show.points === true || config.sparkline.line.show_dots === true || config.sparkline.area.show_dots === true) {
        this.geometry.points[index] = graph.calculateYCoordinates(graph.coords).map((point, pointIndex) => [point[X], point[Y], point[V], pointIndex]);
      }
    });

    const graph = this.primaryGraph;
    const zeroY = graph.calculateYCoordinates([[graph.drawArea.x, 0, 0]])[0][Y];
    // Keep the entrance animation inside the plot when zero is outside the visible value range.
    this.geometry.animationBaselineY = Math.min(graph.drawArea.y + graph.drawArea.height, Math.max(graph.drawArea.y, zeroY));
  }

  /** Gives radial Series one time arc and shared primary/secondary value ranges. */
  updateRadialSeriesGraphs() {
    const statisticsRanges = new Map();
    this.sparklineSeries.items.forEach((item) => {
      if (item.config.period.type !== 'real_time') {
        const range = this.sparklineHistory.getSeriesRange(item);
        if (range.sourceRangeIsActive && this.sparklineHistory.hasRows(item.id)) {
          statisticsRanges.set(item, this.sparklineHistory.pruneActiveRows(item, item.graph.points));
        }
        item.graph.hours = (range.plotEnd.getTime() - range.plotStart.getTime()) / (60 * 60 * 1000);
        item.graph.activeDataEnd = range.sourceRangeIsActive ? range.plotActiveEnd : undefined;
        item.rowsUpdate = this.sparklineHistory.takeRowsUpdate(item.id);
      } else {
        item.graph.activeDataEnd = undefined;
        item.rowsUpdate = undefined;
      }
    });

    const coordinatedGraphs = this.sparklineSeries.updateRadialGraphs((axisGraphs) => {
      this.geometry.axisGraphs = axisGraphs;
      return this.calculateRadialAxisMargin(axisGraphs);
    }, this.geometry.configuredGraphMargin);
    if (coordinatedGraphs.dataState !== SPARKLINE_DATA_STATE.HAS_DATA) {
      this.stopPointerInteraction();
      return;
    }
    this.geometry.axisGraphs = coordinatedGraphs.axisGraphs;
    this.geometry.axisMargin = coordinatedGraphs.axisMargin;

    this.sparklineSeries.items.forEach((item) => {
      if (item.dataState !== SPARKLINE_DATA_STATE.HAS_DATA) return;
      if (this.runtime.graphDataChanged) item.graph.updateStatistics(item.rows, statisticsRanges.get(item), item.entity.last_changed);
    });
  }

  /**
   * Waits for every Series History request, then calculates the selected chart
   * type and its SVG geometry from the current rows.
   */
  updateGraphFromSeries() {
    const allSeriesRequestsCompleted = this.sparklineSeries.items.every((item) => [
      SPARKLINE_REQUEST_STATE.LOADED,
      SPARKLINE_REQUEST_STATE.NOT_REQUIRED,
    ].includes(item.requestState));
    if (!allSeriesRequestsCompleted) {
      this.stopPointerInteraction();
      return;
    }

    const dataChanged = this.runtime.graphDataChanged || this.sparklineSeries.items.some((item) => item.graph.dataConfigChanged);
    this.runtime.graphDataChanged = dataChanged;
    try {
      const chartType = this.config.sparkline.show.chart_type;
      const cartesianSeries = this.sparklineSeries.items.every((item) => ['line', 'area', 'dots', 'bar'].includes(item.config.sparkline.show.chart_type));
      const radialSeries = this.sparklineSeries.items.every((item) => item.config.sparkline.show.chart_type === 'radial');
      const index = 0;
      const total = 1;

      if (this.card.dev.fakeData && chartType !== 'state_bands') {
        // Change preview values but keep HA timestamps so normal History bins still apply.
        let generatedState = 40;
        const primaryItem = this.sparklineSeries.primaryItem;

        primaryItem.rows = primaryItem.rows.map((seriesItem, seriesIndex) => {
          if (seriesIndex < primaryItem.rows.length / 2) generatedState -= 4 * seriesIndex;
          if (seriesIndex > primaryItem.rows.length / 2) generatedState += 3 * seriesIndex;
          return { ...seriesItem, state: generatedState, haState: generatedState };
        });
      }
      if (radialSeries) {
        this.updateRadialSeriesGraphs();
        return;
      }

      if (cartesianSeries) {
        this.updateCartesianSeriesGraphs();
        if (this.sparklineSeries.dataState !== SPARKLINE_DATA_STATE.HAS_DATA || this.sparklineSeries.items.length > 1) return;
        if (this.geometry.seriesGeometryChanged === false) {
          this.updateSparklinePaint();
          return;
        }
      }

      const sourceRangeIsActive = !cartesianSeries && this.config.period.type !== 'real_time'
        && this.sparklineHistory.getSeriesRange(this.sparklineSeries.primaryItem).sourceRangeIsActive;
      const statisticsRange = sourceRangeIsActive && this.sparklineHistory.hasRows(this.sparklineSeries.primaryItem.id)
        ? this.sparklineHistory.pruneActiveRows(this.sparklineSeries.primaryItem, this.primaryGraph.points)
        : undefined;

      let graphGeometryChanged = true;
      if (!cartesianSeries) {
        if (this.config.period.type !== 'real_time') {
          const range = this.sparklineHistory.getSeriesRange(this.sparklineSeries.primaryItem);
          this.primaryGraph.hours = (range.plotEnd.getTime() - range.plotStart.getTime()) / (60 * 60 * 1000);
          this.sparklineSeries.primaryItem.rowsUpdate = this.sparklineHistory.takeRowsUpdate(this.sparklineSeries.primaryItem.id);
        } else {
          this.sparklineSeries.primaryItem.rowsUpdate = undefined;
        }

        this.geometry.axisGraphs = { primary: this.primaryGraph, secondary: undefined };
        this.sparklineSeries.updateGraphs();
        graphGeometryChanged = this.primaryGraph.geometryChanged;

        if (this.sparklineSeries.dataState !== SPARKLINE_DATA_STATE.HAS_DATA) {
          this.clearSingleSeriesPaths();
          this.stopPointerInteraction();
          return;
        }

        const axisMargin =
          chartType === 'radial_barcode' ? this.calculateRadialAxisMargin(this.geometry.axisGraphs) : this.calculateAxisMargin();
        const graphAreasChanged = this.primaryGraph.setGraphAreas(axisMargin, this.geometry.configuredGraphMargin, this.primaryGraph.coords.length);
        if (graphAreasChanged) {
          graphGeometryChanged = true;
          this.geometry.axisMargin = axisMargin;
          this.sparklineSeries.updateGraphs();
          if (this.sparklineSeries.dataState !== SPARKLINE_DATA_STATE.HAS_DATA) {
            this.clearSingleSeriesPaths();
            this.stopPointerInteraction();
            return;
          }
        }
      }
      if (!graphGeometryChanged) {
        this.updateSparklinePaint();
        if (!cartesianSeries && dataChanged) this.primaryGraph.updateStatistics(this.sparklineSeries.primaryItem.rows, statisticsRange, this.runtime.entity.last_changed);
        return;
      }

      if (!cartesianSeries) {
        this.clearSingleSeriesPaths();
        if (chartType === 'state_bands') {
          this.geometry.animationBaselineY = this.primaryGraph.drawArea.y + this.primaryGraph.drawArea.height;
        } else {
          const zeroY = this.primaryGraph.calculateYCoordinates([[this.primaryGraph.drawArea.x, 0, 0]])[0][Y];
          // Keep the entrance animation inside the plot when zero is outside the visible value range.
          this.geometry.animationBaselineY = Math.min(this.primaryGraph.drawArea.y + this.primaryGraph.drawArea.height, Math.max(this.primaryGraph.drawArea.y, zeroY));
        }
      }

      this.geometry.stateBands = chartType === 'state_bands' && this.sparklineHistory.hasRows(this.sparklineSeries.primaryItem.id) ? this.primaryGraph.getStateBands() : [];

      if (this.primaryGraph.coords.length > 0) {
        if (!cartesianSeries && (this.config.sparkline.show.points === true || this.config.sparkline.line.show_dots === true || this.config.sparkline.area.show_dots === true)) {
          this.geometry.points[index] = this.primaryGraph.calculateYCoordinates(this.primaryGraph.coords).map((point, pointIndex) => [point[X], point[Y], point[V], pointIndex]);
        }

        if (chartType === 'bar') {
          this.geometry.bar[index] = this.sparklineSeries.primaryItem.bars;
        } else if (chartType === 'equalizer') {
          this.primaryGraph.levelCount = this.config.sparkline.equalizer.value_buckets;
          this.primaryGraph.valuesPerBucket = (this.primaryGraph.max - this.primaryGraph.min) / this.config.sparkline.equalizer.value_buckets;
          this.geometry.equalizer[index] = this.primaryGraph.getEqualizer(index, total, this.geometry.svg.column_spacing, this.geometry.svg.row_spacing);
        } else if (chartType === 'graded') {
          this.primaryGraph.levelCount = this.config.sparkline.equalizer.value_buckets;
          this.primaryGraph.valuesPerBucket = (this.primaryGraph.max - this.primaryGraph.min) / this.config.sparkline.equalizer.value_buckets;
          this.geometry.graded[index] = this.primaryGraph.getGrades(index, total, this.geometry.svg.column_spacing, this.geometry.svg.row_spacing);
        } else if (chartType === 'radial_barcode') {
          this.geometry.radialBarcodeChartBackground[index] = this.primaryGraph.getRadialBarcodeBackground(index, total, this.geometry.svg.column_spacing, this.geometry.svg.row_spacing);
          this.geometry.radialBarcodeChart[index] = this.primaryGraph.getRadialBarcode(index, total, this.geometry.svg.column_spacing, this.geometry.svg.row_spacing);
          this.primaryGraph.radialBarcodeBackground = this.geometry.radialBarcodeChartBackground[index];
          this.primaryGraph.radialBarcode = this.geometry.radialBarcodeChart[index];
        } else if (chartType === 'barcode') {
          this.geometry.barcodeChart[index] = this.primaryGraph.getBarcode(index, total, this.geometry.svg.column_spacing, this.geometry.svg.row_spacing);
        }
      }

      this.updateSparklinePaint();
      if (!cartesianSeries && dataChanged) this.primaryGraph.updateStatistics(this.sparklineSeries.primaryItem.rows, statisticsRange, this.runtime.entity.last_changed);
    } finally {
      this.runtime.graphDataChanged = false;
    }
  }


  /** Recalculates Sparkline colors after color stops or the HA light/dark mode changes. */
  updatePalettePaint() {
    if (!this.runtimeConfigInitialized) return;
    this.sparklineSeries.updatePalettePaint(this.paint.colorStops, this.card.cardTheme.getActiveColorStopMode());
    const paletteCalculationSignature = this.sparklineSeries.getPaletteCalculationSignature(this.paint.colorStops);
    this.runtime.paletteCalculationChanged = this.runtime.paletteCalculationSignature !== paletteCalculationSignature;
    this.runtime.paletteCalculationSignature = paletteCalculationSignature;
    if (this.runtime.paletteCalculationChanged) this.geometry.graphGeometryChanged = true;
    if (this.sparklineSeries.dataState !== SPARKLINE_DATA_STATE.HAS_DATA || this.sparklineSeries.items.length !== 1) return;
    this.updateSparklinePaint();
  }

  /** Builds the SVG color gradient used by auto and color-stop-gradient styles. */
  updateSparklinePaint() {
    const colorStops = this.sparklineSeries.primaryItem.paint.colorStops;
    const layerRequestsColorStopGradient = [
      this.config.sparkline.line.show.item_style,
      this.config.sparkline.line.minmax.show.item_style,
      this.config.sparkline.area.show.item_style,
      this.config.sparkline.area.minmax.show.item_style,
    ].includes('colorstopgradient');
    if (
      colorStops.colors.length > 0
      && (this.config.sparkline.show.item_style === 'colorstopgradient' || layerRequestsColorStopGradient || !this.runtime.entityConfig?.color)
    ) {
      this.paint.gradient[0] = this.primaryGraph.computeGradient(
        computeThresholds(colorStops.colors, this.config.sparkline.colorstops_transition),
        this.config.sparkline.state_values.logarithmic,
        this.interpolateGradientColor,
      );
    } else {
      this.paint.gradient = [];
    }
  }

  clearSingleSeriesPaths() {
    this.geometry.area = [];
    this.geometry.areaMinMax = [];
    this.geometry.line = [];
    this.geometry.bar = [];
    this.geometry.equalizer = [];
    this.geometry.points = [];
    this.geometry.barcodeChart = [];
    this.geometry.barcodeChartBackground = [];
    this.geometry.radialBarcodeChart = [];
    this.geometry.radialBarcodeChartBackground = [];
    this.geometry.graded = [];
    this.geometry.stateBands = [];
    this.paint.gradient = [];
    this.geometry.linePath = undefined;
    this.geometry.lineMinPath = undefined;
    this.geometry.lineMaxPath = undefined;
    this.geometry.areaPath = undefined;
    this.geometry.areaMinMaxPath = undefined;
  }

  /**
   * Returns statistics and applicable period details for one Series, used to
   * update configured `fhs_sparkline.*` entities. Statistics stay empty until
   * every Series request is current; bin details appear only for binned History.
   *
   * @param {string|undefined} seriesId - Series id, or undefined for the first Series.
   * @returns {object} Current statistics and History details for that Series.
   */
  getSeriesResult(seriesId) {
    const item = seriesId === undefined
      ? this.sparklineSeries.primaryItem
      : this.sparklineSeries.items.find((seriesItem) => seriesItem.id === seriesId);
    const periodType = item.config.period.type;
    const historical = periodType !== 'real_time';
    const binned = historical && item.config.sparkline.show.chart_type !== 'state_bands';
    const seriesRequestsCompleted = this.sparklineSeries.items.every((seriesItem) => [
      SPARKLINE_REQUEST_STATE.LOADED,
      SPARKLINE_REQUEST_STATE.NOT_REQUIRED,
    ].includes(seriesItem.requestState));
    const currentResultHasData = item.dataState === SPARKLINE_DATA_STATE.HAS_DATA && seriesRequestsCompleted;
    const statistics = currentResultHasData ? item.graph.statistics : {};

    return {
      min: statistics.min,
      avg: statistics.avg,
      max: statistics.max,
      min_time: statistics.min_time,
      max_time: statistics.max_time,
      requestState: item.requestState,
      dataState: item.dataState,
      duration: historical && this.runtime.periodDurationAvailable ? item.config.period[periodType].duration.hour : undefined,
      bin_duration: binned && this.runtime.periodDurationAvailable && seriesRequestsCompleted ? this.sparklineSeries.binPlan.durationHours : undefined,
      aggregate_func: binned && this.runtime.periodDurationAvailable ? item.config.sparkline.state_values.aggregate_func : undefined,
    };
  }

  /**
   * Converts mouse or touch screen coordinates to this Sparkline's SVG space.
   * The plot group's screen matrix includes nested SVG placement and parent
   * transforms, which Firefox can omit from the outer SVG viewport matrix.
   *
   * @param {MouseEvent|TouchEvent|PointerEvent} e - Browser interaction event.
   * @returns {DOMPoint} Pointer position in this Sparkline's SVG coordinates.
   */
  mouseEventToPoint(e) {
    let p = this.elements.svg.createSVGPoint();

    p.x = e.touches ? e.touches[0].clientX : e.clientX;
    p.y = e.touches ? e.touches[0].clientY : e.clientY;
    const ctm = this.elements.graphGroup.getScreenCTM().inverse();
    p = p.matrixTransform(ctm);
    p.x += this.geometry.graphArea.x;
    p.y += this.geometry.graphArea.y;
    return p;
  }

  pointToGraphX(point) {
    const x = point.x - this.geometry.graphArea.x;

    return Math.max(0, Math.min(x, this.geometry.graphArea.width));
  }

  /** Snaps a Cartesian pointer to the nearest plotted History bucket. */
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
   * Finds a radial bin from its clicked SVG element or the pointer's angle.
   *
   * @param {MouseEvent|TouchEvent|PointerEvent} event - Browser interaction event.
   * @param {boolean} usePointerCoordinates - Reproject the event after graph bins change.
   * @returns {number} Radial bin index, or NaN when outside the configured arc.
   */
  getRadialPointIndexFromEvent(event, usePointerCoordinates) {
    // Use the saved barcode target during a gesture. After graph or layout
    // changes, reproject the pointer coordinates against the current bins.
    const barcodeBin = this.runtime.pointerEventTarget.closest?.('.sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin');
    if (barcodeBin && !usePointerCoordinates) {
      const pointIndex = Number(barcodeBin.dataset.pointIndex);
      return pointIndex < this.primaryGraph.coords.length ? pointIndex : NaN;
    }

    const point = this.mouseEventToPoint(event);
    return this.primaryGraph.getRadialBinIndex(point.x - this.geometry.graphArea.x, point.y - this.geometry.graphArea.y);
  }
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

  /** Uses HA's localized min, mean and max labels for Sparkline tooltip rows. */
  getTooltipLabel(stat) {
    const localized = this.card._hass.localize(`ui.panel.developer-tools.statistics.${stat === 'avg' ? 'mean' : stat}`);

    if (!localized) return stat;

    return localized.charAt(0).toUpperCase() + localized.slice(1);
  }

  /**
   * Formats min, average or max with the source HA entity's decimal precision and unit.
   *
   * @param {string} stat - Sparkline statistic name: min, avg or max.
   * @param {number|undefined} rawValue - Numeric value from the selected History bucket.
   * @returns {object} Localized label, formatted value and source unit.
   */
  formatTooltipStat(stat, rawValue) {
    const label = this.getTooltipLabel(stat);

    if (rawValue === undefined) return { label, value: '', uom: '' };

    const sourceEntity = this.card.entities[this.entity_index];
    const sourceEntityConfig = this.card.runtimeEntityConfigs[this.entity_index];
    const sourceFormatter = Object.create(StateTool.prototype);

    sourceFormatter.config = sourceEntityConfig;
    sourceFormatter.card = this.card;
    sourceFormatter.runtime = { entity: sourceEntity, entityConfig: sourceEntityConfig, state: '', uom: '' };
    sourceFormatter.buildStateAndUom();

    const activeLocale = this.card._hass.locale.language;
    const decimalSeparator = new Intl.NumberFormat(activeLocale).formatToParts(1.1).find((part) => part.type === 'decimal').value;
    const decimalIndex = sourceFormatter.runtime.state.lastIndexOf(decimalSeparator);
    const decimals = decimalIndex === -1 ? 0 : sourceFormatter.runtime.state.length - decimalIndex - 1;
    const formattedValue = new Intl.NumberFormat(activeLocale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(rawValue);

    return { label, value: formattedValue, uom: sourceFormatter.runtime.uom };
  }

  /**
   * Formats one comparison Series value with its HA entity's precision and unit.
   *
   * @param {object} item - Series with its HA entity and entity config.
   * @param {number|undefined} rawValue - Numeric value from that Series bucket.
   * @returns {object} Formatted value and source unit.
   */
  formatSeriesTooltipValue(item, rawValue) {
    if (rawValue === undefined) return { value: '', uom: '' };

    const sourceFormatter = Object.create(StateTool.prototype);
    sourceFormatter.config = item.entityConfig;
    sourceFormatter.runtime = { entity: item.entity, entityConfig: item.entityConfig, state: '', uom: '' };
    sourceFormatter.card = this.card;
    sourceFormatter.buildStateAndUom();

    const activeLocale = this.card._hass.locale.language;
    const decimalSeparator = new Intl.NumberFormat(activeLocale).formatToParts(1.1).find((part) => part.type === 'decimal').value;
    const decimalIndex = sourceFormatter.runtime.state.lastIndexOf(decimalSeparator);
    const decimals = decimalIndex === -1 ? 0 : sourceFormatter.runtime.state.length - decimalIndex - 1;
    const value = new Intl.NumberFormat(activeLocale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(rawValue);

    return { value, uom: sourceFormatter.runtime.uom };
  }

  /**
   * Shows the HA state and formatted start, end and duration for one state band.
   *
   * @param {object} segment - State band with its HA state, start and end times.
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

    this.runtime.activeX = segment.x + segment.width / 2;
    this.runtime.tooltip = {
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
   * Shows the selected History bucket, formatting its time and values with HA
   * locale settings; comparison charts show the nearest bucket for each Series.
   *
   * @param {number} pointIndex - Index shared by graph coordinates and bucket metadata.
   * @param {MouseEvent|TouchEvent|PointerEvent|undefined} event - Current pointer event.
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
      this.runtime.tooltip = {};
      return;
    }

    const titleDate = bucket.start;
    const title =
      titleDate.getHours() === 0 && titleDate.getMinutes() === 0 && titleDate.getSeconds() === 0 && titleDate.getMilliseconds() === 0
        ? formatDateVeryShort(titleDate, locale, config)
        : formatTime(titleDate, locale, config);

    if (this.sparklineSeries.items.length > 1) {
      const series = this.sparklineSeries.items.map((item, seriesIndex) => {
        const label = this.formatSeriesName(item);
        const color = item.config.color ?? item.entityConfig.color ?? item.config.sparkline.line_color[seriesIndex];

        // Keep an empty Series in the legend, but never show values from its previous History rows.
        if (item.dataState === SPARKLINE_DATA_STATE.EMPTY) return { label, color, value: '', uom: '' };

        const seriesPointIndex = item.graph.coords.reduce(
          (nearestIndex, candidate, candidateIndex) => (Math.abs(candidate[X] - point[X]) < Math.abs(item.graph.coords[nearestIndex][X] - point[X]) ? candidateIndex : nearestIndex),
          0,
        );
        const seriesBucket = item.graph.bucketMeta[seriesPointIndex];
        const formatted = this.formatSeriesTooltipValue(item, seriesBucket.avg);
        return {
          label,
          color,
          ...formatted,
        };
      });
      const scaleX = svgBox ? svgBox.width / this.geometry.svg.width : 1;
      const scaleY = svgBox ? svgBox.height / this.geometry.svg.height : 1;
      const pointer = event?.touches ? event.touches[0] : event;
      const centerX =
        pointer?.clientX !== undefined ? pointer.clientX - containerBox.left : this.runtime.tooltip.x !== undefined ? this.runtime.tooltip.x : svgBox ? svgBox.left - containerBox.left + (this.geometry.graphArea.x + point[X]) * scaleX : point[X];
      const centerY =
        pointer?.clientY !== undefined ? pointer.clientY - containerBox.top : this.runtime.tooltip.y !== undefined ? this.runtime.tooltip.y : svgBox ? svgBox.top - containerBox.top + (this.geometry.graphArea.y + point[Y]) * scaleY : point[Y];
      this.runtime.tooltip = {
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
    const scaleX = svgBox ? svgBox.width / this.geometry.svg.width : 1;
    const scaleY = svgBox ? svgBox.height / this.geometry.svg.height : 1;
    const pointer = event?.touches ? event.touches[0] : event;
    const centerX =
      pointer?.clientX !== undefined ? pointer.clientX - containerBox.left : this.runtime.tooltip.x !== undefined ? this.runtime.tooltip.x : svgBox ? svgBox.left - containerBox.left + (this.geometry.graphArea.x + point[X]) * scaleX : point[X];
    const centerY =
      pointer?.clientY !== undefined ? pointer.clientY - containerBox.top : this.runtime.tooltip.y !== undefined ? this.runtime.tooltip.y : svgBox ? svgBox.top - containerBox.top + (this.geometry.graphArea.y + point[Y]) * scaleY : point[Y];

    this.runtime.tooltip = {
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
   * Updates the active radial bin, marker and tooltip for the selected time
   * without asking Lit to rerender the whole card for each pointer move.
   *
   * @param {number} pointIndex - Selected radial History bin.
   * @param {MouseEvent|TouchEvent|PointerEvent} event - Current pointer event.
   */
  updateTooltipFromRadial(pointIndex, event) {
    this.runtime.activeX = undefined;
    this.runtime.activePoint = pointIndex;
    this.elements.containerRect = this.elements.container.getBoundingClientRect();
    const svgBox = this.elements.svg.getBoundingClientRect();
    const scaleX = svgBox.width / this.geometry.svg.width;
    const scaleY = svgBox.height / this.geometry.svg.height;
    this.elements.tooltipBounds = {
      left: svgBox.left - this.elements.containerRect.left + (this.geometry.graphArea.x + this.primaryGraph.drawArea.x) * scaleX,
      top: svgBox.top - this.elements.containerRect.top + (this.geometry.graphArea.y + this.primaryGraph.drawArea.y) * scaleY,
      right: svgBox.left - this.elements.containerRect.left + (this.geometry.graphArea.x + this.primaryGraph.drawArea.x + this.primaryGraph.drawArea.width) * scaleX,
      bottom: svgBox.top - this.elements.containerRect.top + (this.geometry.graphArea.y + this.primaryGraph.drawArea.y + this.primaryGraph.drawArea.height) * scaleY,
    };
    this.updateRadialActiveBinDom(pointIndex);
    this.updateActiveIndicatorDom();
    this.updateTooltipFromPointIndex(pointIndex, event);
    this.updateTooltipContentDom();
    this.updateTooltipPositionDom(event);
    this.updateTooltipVisibilityDom(true);
  }

  /** Clears the selected History bucket and hides its tooltip and marker. */
  clearTooltip() {
    this.runtime.tooltip = {};
    this.runtime.activeX = undefined;
    this.runtime.activePoint = undefined;
    this.runtime.tooltipVisible = false;
  }

  /** Coalesces rapid radial hover events into one frame using the latest pointer coordinates. */
  scheduleRadialHoverFrame() {
    if (this._radialRafId) return;

    const frameId = window.requestAnimationFrame(() => {
      // An older queued frame must not select a bin after cancellation or replacement.
      if (this._radialRafId !== frameId) return;
      this._radialRafId = null;
      if (this.runtime.hovering && !this.runtime.dragging) this.updateActivePointer(this.runtime.pointerEvent, false);
    });
    this._radialRafId = frameId;
  }

  /** Restores each radial barcode path's original inline styles after hover. */
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

  /** Saves the configured SVG styles, then highlights one radial barcode bin. */
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

  updateActiveIndicatorDom() {
    const activeIndicator = this.elements.activeIndicator;
    if (!activeIndicator) return;

    if (this.config.sparkline.show.chart_type === 'radial') {
      if (this.runtime.activePoint === undefined) {
        activeIndicator.style.visibility = 'hidden';
        return;
      }
      const geometry = this.primaryGraph.getRadialGeometry();
      const angle = this.primaryGraph.getRadialAngleForBin(this.runtime.activePoint);
      const start = this.primaryGraph.getRadialPoint(geometry.innerRadius, angle);
      const end = this.primaryGraph.getRadialPoint(geometry.outerRadius, angle);
      activeIndicator.setAttribute('x1', `${start.x}`);
      activeIndicator.setAttribute('y1', `${start.y}`);
      activeIndicator.setAttribute('x2', `${end.x}`);
      activeIndicator.setAttribute('y2', `${end.y}`);
      activeIndicator.style.visibility = 'visible';
      return;
    }

    if (this.runtime.activeX === undefined) {
      activeIndicator.style.visibility = 'hidden';
      return;
    }
    activeIndicator.setAttribute('x1', `${this.runtime.activeX}`);
    activeIndicator.setAttribute('x2', `${this.runtime.activeX}`);
    activeIndicator.style.visibility = 'visible';
  }
  updateTooltipVisibilityDom(show) {
    this.runtime.tooltipVisible = show;
    const tooltip = this.elements.tooltip;

    if (!tooltip) return;

    tooltip.style.display = show ? 'block' : 'none';
  }

  /** Positions the HTML tooltip in card pixels and clamps it to the plotted graph area. */
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
    this.runtime.tooltip.x = left;
    this.runtime.tooltip.y = top;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  updateTooltipContentDom() {
    const tooltip = this.elements.tooltip;

    if (!tooltip) return;

    const title = this.elements.tooltipTitle;
    const rows = this.elements.tooltipRows;

    title.textContent = this.runtime.tooltip.title ?? '';
    if (this.sparklineSeries.items.length > 1) {
      rows.forEach((row, index) => {
        const series = this.runtime.tooltip.series[index];
        row.children[0].children[1].textContent = series.label;
        row.children[1].children[0].textContent = series.value;
        row.children[1].children[1].textContent = series.uom ? ` ${series.uom}` : '';
      });
      return;
    }
    rows[0].children[0].textContent = this.runtime.tooltip.min?.label ?? '';
    rows[0].children[1].children[0].textContent = this.runtime.tooltip.min?.value ?? '';
    rows[0].children[1].children[1].textContent = this.runtime.tooltip.min?.uom ? ` ${this.runtime.tooltip.min.uom}` : '';
    rows[1].children[0].textContent = this.runtime.tooltip.avg?.label ?? '';
    rows[1].children[1].children[0].textContent = this.runtime.tooltip.avg?.value ?? '';
    rows[1].children[1].children[1].textContent = this.runtime.tooltip.avg?.uom ? ` ${this.runtime.tooltip.avg.uom}` : '';
    rows[2].children[0].textContent = this.runtime.tooltip.max?.label ?? '';
    rows[2].children[1].children[0].textContent = this.runtime.tooltip.max?.value ?? '';
    rows[2].children[1].children[1].textContent = this.runtime.tooltip.max?.uom ? ` ${this.runtime.tooltip.max.uom}` : '';
  }

  /**
   * Selects a Cartesian bucket, state band or radial bin under the pointer.
   *
   * @param {MouseEvent|TouchEvent|PointerEvent} e - Current browser interaction.
   * @param {boolean} usePointerCoordinates - Reproject after data or graph geometry changes.
   */
  updateActivePointer(e, usePointerCoordinates) {
    this.runtime.pointerEvent = e;

    if (['radial', 'radial_barcode'].includes(this.config.sparkline.show.chart_type)) {
      this.updateRadialActivePointer(e, usePointerCoordinates);
      return;
    }

    if (
      this.sparklineSeries.dataState !== SPARKLINE_DATA_STATE.HAS_DATA
      || this.sparklineSeries.primaryItem.dataState !== SPARKLINE_DATA_STATE.HAS_DATA
    ) {
      this.stopPointerInteraction();
      return;
    }

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
    this.runtime.activeX = this.snapPointerXToGraphPoint(pointerX);
    const pointIndex = this.getPointIndexFromX(this.runtime.activeX);

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
   * Finds and highlights the radial bin under the pointer or touch.
   *
   * @param {MouseEvent|TouchEvent|PointerEvent} e - Current browser interaction.
   * @param {boolean} usePointerCoordinates - Reproject after data or graph geometry changes.
   */
  updateRadialActivePointer(e, usePointerCoordinates) {
    if (
      this.sparklineSeries.dataState !== SPARKLINE_DATA_STATE.HAS_DATA
      || this.sparklineSeries.primaryItem.dataState !== SPARKLINE_DATA_STATE.HAS_DATA
    ) {
      this.stopPointerInteraction();
      return;
    }

    const pointIndex = this.getRadialPointIndexFromEvent(e, usePointerCoordinates);

    if (!Number.isFinite(pointIndex)) {
      this.clearTooltip();
      this.updateTooltipVisibilityDom(false);
      this.updateActiveIndicatorDom();
      this.restoreRadialActiveBinDom();
      return;
    }

    this.elements.containerRect = this.elements.container.getBoundingClientRect();
    const svgBox = this.elements.svg.getBoundingClientRect();
    const scaleX = svgBox.width / this.geometry.svg.width;
    const scaleY = svgBox.height / this.geometry.svg.height;
    this.elements.tooltipBounds = {
      left: svgBox.left - this.elements.containerRect.left + (this.geometry.graphArea.x + this.primaryGraph.drawArea.x) * scaleX,
      top: svgBox.top - this.elements.containerRect.top + (this.geometry.graphArea.y + this.primaryGraph.drawArea.y) * scaleY,
      right: svgBox.left - this.elements.containerRect.left + (this.geometry.graphArea.x + this.primaryGraph.drawArea.x + this.primaryGraph.drawArea.width) * scaleX,
      bottom: svgBox.top - this.elements.containerRect.top + (this.geometry.graphArea.y + this.primaryGraph.drawArea.y + this.primaryGraph.drawArea.height) * scaleY,
    };
    this.updateTooltipFromRadial(pointIndex, e);
  }

  /**
   * Refreshes tooltip and indicator references after Lit renders, then attaches
   * pointer events to the current SVG. Lit can replace the SVG itself, so a new
   * root first loses the old listeners before the new ones are attached.
   */
  attachPointerHandlers() {
    if (this.hasJavascript && !this.runtimeConfigInitialized) return;
    const currentSvg = this.card.shadowRoot.getElementById(`sparkline-${this.cardId}-${this.index}`);
    if (currentSvg !== this.pointerSvgElement) this.detachPointerHandlers();

    this.elements.svg = currentSvg;
    this.elements.container = this.card.shadowRoot.getElementById('container');
    this.elements.activeIndicator = this.card.shadowRoot.getElementById(`sparkline-active-indicator-${this.cardId}-${this.index}`);
    this.elements.tooltip = this.card.shadowRoot.getElementById(`sparkline-tooltip-${this.cardId}-${this.index}`);
    this.elements.tooltipTitle = this.elements.tooltip.querySelector('.sparkline-tooltip__title');
    this.elements.tooltipRows = this.elements.tooltip.querySelectorAll('.sparkline-tooltip__row');
    this.elements.containerRect = this.elements.container.getBoundingClientRect();

    if (!currentSvg) return;
    this.elements.graphGroup = currentSvg.querySelector('.sparkline-plot');
    if (currentSvg === this.pointerSvgElement) {
      this.synchronizePointerPresentation();
      return;
    }

    this.pointerSvgElement = currentSvg;
    currentSvg.dataset.pointerReady = 'true';
    currentSvg.addEventListener('mousedown', this.mouseDown, false);
    currentSvg.addEventListener('touchstart', this.touchStart, { passive: false });
    currentSvg.addEventListener('mousemove', this.hoverMove, false);
    currentSvg.addEventListener('mouseenter', this.hoverEnter, false);
    currentSvg.addEventListener('mouseleave', this.hoverLeave, false);
  }

  /** Removes handlers from the old SVG and clears any active pointer interaction. */
  detachPointerHandlers() {
    this.stopPointerInteraction();
    if (this.pointerSvgElement) {
      this.pointerSvgElement.removeEventListener('mousedown', this.mouseDown, false);
      this.pointerSvgElement.removeEventListener('touchstart', this.touchStart, false);
      this.pointerSvgElement.removeEventListener('mousemove', this.hoverMove, false);
      this.pointerSvgElement.removeEventListener('mouseenter', this.hoverEnter, false);
      this.pointerSvgElement.removeEventListener('mouseleave', this.hoverLeave, false);
      delete this.pointerSvgElement.dataset.pointerReady;
      this.pointerSvgElement = undefined;
    }
    this.elements = {};
  }

  /** Removes window drag listeners, cancels pointer frames and hides the tooltip. */
  stopPointerInteraction() {
    if (this.runtime.dragging || this.runtime.hovering || this.pointerSvgElement) {
      window.removeEventListener('pointermove', this.pointerMove, false);
      window.removeEventListener('pointerup', this.pointerUp, false);
      window.removeEventListener('pointercancel', this.pointerUp, false);
      window.removeEventListener('touchcancel', this.pointerUp, false);
      window.cancelAnimationFrame(this.rid);
      window.cancelAnimationFrame(this._radialRafId);
    }
    this.rid = null;
    this._radialRafId = null;
    this.runtime.dragging = false;
    this.runtime.hovering = false;
    this.runtime.pointerEvent = undefined;
    this.runtime.pointerEventTarget = undefined;
    this.clearTooltip();

    if (this.pointerSvgElement) {
      this.updateTooltipVisibilityDom(false);
      this.updateActiveIndicatorDom();
      this.restoreRadialActiveBinDom();
      this.elements.containerRect = undefined;
    }
  }

  /** Reprojects the active marker and tooltip after graph, layout or mounted-SVG updates. */
  synchronizePointerPresentation() {
    if (!this.pointerSvgElement || (!this.runtime.hovering && !this.runtime.dragging)) return;
    if (this.sparklineSeries.dataState !== SPARKLINE_DATA_STATE.HAS_DATA
      || this.sparklineSeries.primaryItem.dataState !== SPARKLINE_DATA_STATE.HAS_DATA) {
      this.stopPointerInteraction();
      return;
    }
    this.updatePointerBounds();
    this.updateActivePointer(this.runtime.pointerEvent, true);
  }

  /** Measures tooltip bounds and extends Cartesian hit testing by half a bucket at each edge. */
  updatePointerBounds() {
    this.elements.containerRect = this.elements.container.getBoundingClientRect();
    const svgBox = this.elements.svg.getBoundingClientRect();
    const scaleX = svgBox.width / this.geometry.svg.width;
    const scaleY = svgBox.height / this.geometry.svg.height;
    const radial = ['radial', 'radial_barcode'].includes(this.config.sparkline.show.chart_type);
    const hoverPaddingX = radial ? 0 : this.primaryGraph.coords.length > 1 ? ((this.primaryGraph.coords[1][0] - this.primaryGraph.coords[0][0]) * scaleX) / 2 : 12;
    this.elements.tooltipBounds = {
      left: svgBox.left - this.elements.containerRect.left + (this.geometry.graphArea.x + this.primaryGraph.drawArea.x) * scaleX - hoverPaddingX,
      top: svgBox.top - this.elements.containerRect.top + (this.geometry.graphArea.y + this.primaryGraph.drawArea.y) * scaleY,
      right: svgBox.left - this.elements.containerRect.left + (this.geometry.graphArea.x + this.primaryGraph.drawArea.x + this.primaryGraph.drawArea.width) * scaleX + hoverPaddingX,
      bottom: svgBox.top - this.elements.containerRect.top + (this.geometry.graphArea.y + this.primaryGraph.drawArea.y + this.primaryGraph.drawArea.height) * scaleY,
    };
  }

  pointerFrame() {
    this.rid = null;
    if (this.runtime.dragging) this.updateActivePointer(this.runtime.pointerEvent, false);
  }

  /** Handles at most one drag position per browser frame and saves the original hit target. */
  pointerMove(event) {
    if (!this.runtime.dragging) return;
    event.preventDefault();
    this.runtime.pointerEvent = event;
    this.runtime.pointerEventTarget = event.target;
    if (!this.rid) {
      const frameId = window.requestAnimationFrame(() => {
        if (this.rid === frameId) this.pointerFrame();
      });
      this.rid = frameId;
    }
  }

  hoverEnter(event) {
    this.hoverMove(event);
  }

  hoverMove(event) {
    if (this.runtime.dragging) return;
    this.runtime.pointerEvent = event;
    this.runtime.pointerEventTarget = event.target;
    if (this.sparklineSeries.dataState !== SPARKLINE_DATA_STATE.HAS_DATA
      || this.sparklineSeries.primaryItem.dataState !== SPARKLINE_DATA_STATE.HAS_DATA) {
      this.stopPointerInteraction();
      return;
    }

    if (!this.runtime.hovering) {
      this.runtime.hovering = true;
      this.updatePointerBounds();
    }

    if (['radial', 'radial_barcode'].includes(this.config.sparkline.show.chart_type)) {
      this.scheduleRadialHoverFrame();
    } else {
      this.updateActivePointer(event, false);
    }
  }

  hoverLeave() {
    if (!this.runtime.dragging) this.stopPointerInteraction();
  }

  /** Starts a mouse or touch drag and tracks its later moves outside the SVG. */
  pointerDown(event) {
    event.preventDefault();
    this.stopPointerInteraction();
    this.runtime.dragging = true;
    this.runtime.pointerEvent = event;
    this.runtime.pointerEventTarget = event.target;
    this.updatePointerBounds();
    window.addEventListener('pointermove', this.pointerMove, false);
    window.addEventListener('pointerup', this.pointerUp, false);
    window.addEventListener('pointercancel', this.pointerUp, false);
    window.addEventListener('touchcancel', this.pointerUp, false);
    this.updateActivePointer(event, false);
  }

  pointerUp(event) {
    event.preventDefault();
    this.stopPointerInteraction();
  }

  touchStart(event) {
    this.pointerDown(event);
  }

  mouseDown(event) {
    this.pointerDown(event);
  }

  /**
   * Splits area fade around zero so positive and negative fills fade from
   * their graph edge toward the same zero baseline.
   *
   * @param {string} fill - Generated SVG area path.
   * @param {number} i - Render index used in the SVG mask id.
   * @returns {TemplateResult|string} SVG mask or an empty result.
   */
  renderSvgAreaMask(fill, i) {
    if (this.config.sparkline.show.chart_type !== 'area') return '';
    if (!fill) return '';
    const fade = this.config.sparkline.show.fill === 'fade';
    const init = this.geometry.length[i] || this.card.config.entities[i].show_line === false;
    const yZero = this.primaryGraph.min >= 0 ? 0 : (Math.abs(this.primaryGraph.min) / (this.primaryGraph.max - this.primaryGraph.min)) * 100;

    return svg`
      <linearGradient id=${`fill-grad-pos-${this.cardId}-${this.index}-${i}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2=${this.geometry.graphArea.height}>
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='0.1'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-pos-${this.cardId}-${this.index}-${i}`} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width=${this.geometry.graphArea.width} height=${this.geometry.graphArea.height}>
        <rect x="0" y="0" width=${this.geometry.graphArea.width} height=${this.geometry.graphArea.height * (1 - yZero / 100)} fill=${`url(#fill-grad-pos-${this.cardId}-${this.index}-${i})`}
         />
      </mask>
      <linearGradient id=${`fill-grad-neg-${this.cardId}-${this.index}-${i}`} gradientUnits="userSpaceOnUse" x1="0" y1=${this.geometry.graphArea.height} x2="0" y2="0">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='0.1'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-neg-${this.cardId}-${this.index}-${i}`} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width=${this.geometry.graphArea.width} height=${this.geometry.graphArea.height}>
        <rect x="0" y=${this.geometry.graphArea.height * (1 - yZero / 100)} width=${this.geometry.graphArea.width} height=${this.geometry.graphArea.height * (yZero / 100)} fill=${`url(#fill-grad-neg-${this.cardId}-${this.index}-${i})`}
         />
      </mask>

    <mask id=${`fill-${this.cardId}-${this.index}-${i}`} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width=${this.geometry.graphArea.width} height=${this.geometry.graphArea.height}>
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

  /** Colors the area through its shape/fade mask using the configured area paint. */
  renderSvgAreaBackground(fill, i) {
    if (this.config.sparkline.show.chart_type !== 'area') return '';
    if (!fill) return '';

    const areaStyles = this.getAreaStyles();
    const backgroundStyles = areaStyles;
    backgroundStyles.fill = this.getSparklineBackgroundPaint(areaStyles, this.config.sparkline.area.show.item_style);
    backgroundStyles.stroke = 'none';

    return svg`
      <rect
        class="sparkline-area-rect"
        x="0"
        y="0"
        width="${this.geometry.graphArea.width}"
        height="${this.geometry.graphArea.height}"
        style=${styleMap(this.getRenderStyles(backgroundStyles, [this.config.sparkline.area.color_filter]))}
        mask="url(#fill-${this.cardId}-${this.index}-${i})"
      ></rect>
    `;
  }

  /** Defines the SVG mask for the band between each History bin's minimum and maximum. */
  renderSvgAreaMinMaxMask(fill, i) {
    if (!['area', 'line'].includes(this.config.sparkline.show.chart_type)) return '';
    if (!fill) return '';

    return svg`
      <mask id=${`fillMinMax-${this.cardId}-${this.index}-${i}`}>
        <path
          class='fill'
          type=${this.config.sparkline.show.fill}
          .id=${i} anim=${this.config.sparkline.animate} ?init=${this.geometry.length[i]}
          style="animation-delay: ${this.config.sparkline.animate ? `${i * 0.5}s` : '0s'}"
          fill='white'
          d=${fill}
        />
      </mask>
    `;
  }

  /** Colors the min/max band with its chart type's own styles and color filter. */
  renderSvgAreaMinMaxBackground(fill, i) {
    if (!['area', 'line'].includes(this.config.sparkline.show.chart_type)) return '';
    if (!fill) return '';

    let backgroundStyles;
    if (this.config.sparkline.show.chart_type === 'line') {
      backgroundStyles = Merge.mergeDeep(
        this.getLineStyles(),
        ConfigHelper.toStyleDict(this.config.sparkline.line.minmax.styles),
      );
    } else {
      backgroundStyles = this.getAreaStyles();
    }
    const itemStyle = this.config.sparkline.show.chart_type === 'line'
      ? this.config.sparkline.line.minmax.show.item_style
      : this.config.sparkline.area.minmax.show.item_style;
    backgroundStyles.fill = this.getSparklineBackgroundPaint(backgroundStyles, itemStyle);
    backgroundStyles.stroke = 'none';

    return svg`
      <rect
        class="sparkline-area-rect"
        x="0"
        y="0"
        width="${this.geometry.graphArea.width}"
        height="${this.geometry.graphArea.height}"
        style=${styleMap(this.getRenderStyles(backgroundStyles, [
          this.config.sparkline[this.config.sparkline.show.chart_type].minmax.color_filter,
        ]))}
        mask="url(#fillMinMax-${this.cardId}-${this.index}-${i})"
      ></rect>
    `;
  }

  /** Masks the line's SVG color layer to its configured stroke shape. */
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

  /** Colors the line through its stroke mask while keeping line opacity and color filters. */
  renderSvgLineBackground(line, i) {
    if (this.config.sparkline.show.line !== true) return '';
    if (!line) return '';

    const lineStyles = this.getLineStyles();
    const backgroundStyles = lineStyles;
    backgroundStyles.fill = this.getSparklineBackgroundPaint(lineStyles, this.config.sparkline.line.show.item_style);
    backgroundStyles.stroke = 'none';

    delete backgroundStyles['stroke-width'];
    delete backgroundStyles['stroke-linecap'];
    delete backgroundStyles['stroke-linejoin'];

    return svg`
      <rect
        class="sparkline-line-rect"
        x="0"
        y="0"
        width="${this.geometry.graphArea.width}"
        height="${this.geometry.graphArea.height}"
        style=${styleMap(this.getRenderStyles(backgroundStyles, [this.config.sparkline.line.color_filter]))}
        mask="url(#sparkline-line-${this.cardId}-${this.index}-${i})"
      ></rect>
    `;
  }

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

  /** Combines FHS and animation styles with Sparkline line styles and configured width. */
  getLineStyles() {
    const styles = Merge.mergeDeep(this.getStyles({ fill: 'none' }), ConfigHelper.toStyleDict(this.config.sparkline.line?.styles));
    styles['stroke-width'] = this.getConfiguredLineWidth(this.config);
    return styles;
  }

  /** Prefers the HA entity color, then color stops and the configured line colors. */
  computeColor(inState, i) {
    const { line_color, colorstops_transition } = this.config.sparkline;
    const colorStops = this.sparklineSeries.primaryItem.paint.colorStops;
    const state = Number(inState) || 0;
    const thresholdColor = Colors.calculateStrokeColor(state, colorStops, colorstops_transition === 'smooth', this.card.cardTheme.colorContext);

    return this.card.config.entities[i].color || thresholdColor || line_color[i] || line_color[0];
  }

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

  /** Uses HA's localized date format at midnight and time format for other X ticks. */
  buildXAxisTicks(level) {
    const ticks = [];
    const xAxisGraph = this.geometry.axisGraphs.primary !== undefined ? this.geometry.axisGraphs.primary : this.geometry.axisGraphs.secondary;

    xAxisGraph.xAxis.ticks.forEach((tick) => {
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

  buildYAxisTicks(level, graph) {
    if (graph.input.sparkline.show.chart_type === 'state_bands') {
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

  /** Returns major X or Y ticks for labels; grid lines and tick marks use the same tick builders. */
  buildLabelTicks(axis, graph) {
    const labelsAt = graph.input.sparkline.show[axis + 'labels_at'];

    if (labelsAt === 'none') return [];
    return axis === 'x' ? this.buildXAxisTicks('major') : this.buildYAxisTicks('major', graph);
  }

  /** Draws radial grid spokes at time ticks and arcs at configured Y values. */
  renderRadialGrid() {
    const graph = this.primaryGraph;
    const geometry = graph.getRadialGeometry();
    const chartAxes = CHART_AXES[this.config.sparkline.show.chart_type];
    const xStyles = this.getRenderStyles(ConfigHelper.toStyleDict(this.config.x_axis.grid_major.styles));
    const yGraph = this.geometry.axisGraphs.primary ?? this.geometry.axisGraphs.secondary;
    const yStyles = this.getRenderStyles(ConfigHelper.toStyleDict(yGraph.input.y_axis.grid_major.styles));
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
        CHART_AXES[yGraph.input.sparkline.show.chart_type].y && yGraph.input.sparkline.show.grid.y
          ? yTicks.map((tick) => {
              const radius = yGraph.getRadialRadiusForValue(tick.value);
              return svg`<path class="sparkline-radial-grid--y" d=${graph.getRadialPlotArcPath(radius)} fill="none" style=${styleMap(yStyles)}></path>`;
            })
          : ''
      }
    `;
  }

  renderRadialBackground() {
    if (!this.config.sparkline.show.background) return '';

    const styles = this.getRenderStyles(ConfigHelper.toStyleDict(this.config.sparkline.radial.background.styles));
    return svg`<path class="sparkline-radial-background" d=${this.primaryGraph.getRadialBackgroundPath()} fill-rule="evenodd" style=${styleMap(styles)}></path>`;
  }

  /**
   * Draws day and night intervals from `sun.sun` History over the Sparkline's
   * time range, as rectangles for Cartesian charts or paths for radial charts.
   */
  renderDayNightLayer() {
    const dayNightSegments = this.sparklineHistory.getDayNightSegments();
    if (!this.config.sparkline.show.day_night || dayNightSegments.length === 0 || this.sparklineSeries.dataState !== SPARKLINE_DATA_STATE.HAS_DATA) return '';

    const range = this.sparklineHistory.getDayNightRange();
    const dayNightConfig = {
      mode: this.config.sparkline.day_night.mode,
      position: this.config.sparkline.day_night.position,
      size: Utils.calculateSvgDimension(this.config.sparkline.day_night.size),
      offset: Utils.calculateSvgDimension(this.config.sparkline.day_night.offset),
    };

    return svg`
      <g class='sparkline-day-night' pointer-events='none'>
        ${dayNightSegments.map((segment) => {
          const geometry = this.primaryGraph.getTimeRangeGeometry(segment.start, segment.end, range.start, range.end, dayNightConfig);
          const styles = this.getRenderStyles(this.config.sparkline.day_night[segment.state].styles);

          return geometry.type === 'radial'
            ? svg`<path class='sparkline-day-night__${segment.state}' d=${geometry.path} fill-rule='evenodd' style=${styleMap(styles)}></path>`
            : svg`<rect class='sparkline-day-night__${segment.state}' x=${geometry.x} y=${geometry.y} width=${geometry.width} height=${geometry.height} style=${styleMap(styles)}></rect>`;
        })}
      </g>
    `;
  }

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
    const primaryStyles = this.geometry.axisGraphs.primary ? this.getRenderStyles(ConfigHelper.toStyleDict(this.geometry.axisGraphs.primary.input.y_axis.axis.styles)) : {};
    const secondaryStyles = this.geometry.axisGraphs.secondary ? this.getRenderStyles(ConfigHelper.toStyleDict(this.geometry.axisGraphs.secondary.input.y_axis.axis.styles)) : {};

    return svg`
      ${chartAxes.x && this.config.sparkline.show.axis.x ? svg`<path class="sparkline-radial-axis--x" d=${outerPath} fill="none" style=${styleMap(xStyles)}></path>` : ''}
      ${this.geometry.axisGraphs.primary && CHART_AXES[this.geometry.axisGraphs.primary.input.sparkline.show.chart_type].y && this.geometry.axisGraphs.primary.input.sparkline.show.axis.y ? svg`<line class="sparkline-radial-axis--y" x1=${primaryStart.x} y1=${primaryStart.y} x2=${primaryEnd.x} y2=${primaryEnd.y} style=${styleMap(primaryStyles)}></line>` : ''}
      ${this.geometry.axisGraphs.secondary && CHART_AXES[this.geometry.axisGraphs.secondary.input.sparkline.show.chart_type].y && this.geometry.axisGraphs.secondary.input.sparkline.show.axis.y ? svg`<line class="sparkline-radial-axis--y-secondary" x1=${secondaryStart.x} y1=${secondaryStart.y} x2=${secondaryEnd.x} y2=${secondaryEnd.y} style=${styleMap(secondaryStyles)}></line>` : ''}
    `;
  }

  renderRadialTickmarks() {
    const graph = this.primaryGraph;
    const geometry = graph.getRadialGeometry();
    const chartAxes = CHART_AXES[this.config.sparkline.show.chart_type];
    const xSize = Utils.calculateSvgDimension(this.config.x_axis.tickmarks_major.size);
    const xStyles = this.getRenderStyles(ConfigHelper.toStyleDict(this.config.x_axis.tickmarks_major.styles));
    const xTicks = this.buildXAxisTicks('major').filter((tick) => geometry.arcDegrees < 360 || !tick.isPeriodEnd);
    const axisItems = [
      { graph: this.geometry.axisGraphs.primary, angle: graph.getRadialValueAxisAngle('primary'), direction: -1, suffix: '' },
      { graph: this.geometry.axisGraphs.secondary, angle: graph.getRadialValueAxisAngle('secondary'), direction: 1, suffix: '-secondary' },
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
        if (!axis.graph || !CHART_AXES[axis.graph.input.sparkline.show.chart_type].y || !axis.graph.input.sparkline.show.tickmarks.y) return '';
        const size = Utils.calculateSvgDimension(axis.graph.input.y_axis.tickmarks_major.size);
        const styles = this.getRenderStyles(ConfigHelper.toStyleDict(axis.graph.input.y_axis.tickmarks_major.styles));
        const tangent = graph.getRadialTangentOffset(axis.angle, size * axis.direction);
        return this.buildYAxisTicks('major', axis.graph).map((tick) => {
          const radius = axis.graph.getRadialRadiusForValue(tick.value);
          const point = graph.getRadialPoint(radius, axis.angle);
          return svg`<line class="sparkline-radial-tickmark--y${axis.suffix}" x1=${point.x} y1=${point.y} x2=${point.x + tangent.x} y2=${point.y + tangent.y} style=${styleMap(styles)}></line>`;
        });
      })}
    `;
  }

  /** Places radial time and value labels along the configured arc or horizontally. */
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

      if (tickIndex > 0) {
        // Limit each curved label to the nearer neighboring tick so adjacent text does not collide.
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
      { graph: this.geometry.axisGraphs.primary, angle: graph.getRadialValueAxisAngle('primary'), direction: -1, suffix: '' },
      { graph: this.geometry.axisGraphs.secondary, angle: graph.getRadialValueAxisAngle('secondary'), direction: 1, suffix: '-secondary' },
    ];

    return svg`
      ${
        chartAxes.x && this.config.sparkline.show.labels.x
          ? xLabelItems.map((labelItem, tickIndex) => {
              const { tick, angle, arcSize } = labelItem;
              const radius = geometry.outerRadius + xTickSize + xOffset;
              const point = graph.getRadialPoint(radius, angle);

              if (this.config.x_axis.labels.orientation === 'arc') {
                const normalizedAngle = ((angle % 360) + 360) % 360;
                const isTopHalf = normalizedAngle <= 90 || normalizedAngle >= 270;
                // Reverse the lower-half path direction so its text follows the circle upright.
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
        if (!axis.graph || !CHART_AXES[axis.graph.input.sparkline.show.chart_type].y || !axis.graph.input.sparkline.show.labels.y) return '';
        const tickSize = axis.graph.input.sparkline.show.tickmarks.y ? Utils.calculateSvgDimension(axis.graph.input.y_axis.tickmarks_major.size) : 0;
        const offset = Utils.calculateSvgDimension(axis.graph.input.y_axis.labels.offset);
        const tangent = graph.getRadialTangentOffset(axis.angle, (tickSize + offset) * axis.direction);
        const textAnchor = tangent.x < 0 ? 'end' : tangent.x > 0 ? 'start' : 'middle';
        const styles = this.getRenderStyles({ ...ConfigHelper.toStyleDict(axis.graph.input.y_axis.labels.styles), 'text-anchor': textAnchor, 'dominant-baseline': 'middle' });
        return this.buildLabelTicks('y', axis.graph).map((tick) => {
          const radius = axis.graph.getRadialRadiusForValue(tick.value);
          const point = graph.getRadialPoint(radius, axis.angle);
          return svg`<text class="sparkline-radial-label--y${axis.suffix}" x=${point.x + tangent.x} y=${point.y + tangent.y} style=${styleMap(styles)}>${tick.label}</text>`;
        });
      })}
    `;
  }
  /** Draws enabled major grid lines at graph ticks, using spokes and arcs for radial charts. */
  renderGrid() {
    if (['radial', 'radial_barcode'].includes(this.config.sparkline.show.chart_type)) return this.renderRadialGrid();
    const chartAxes = CHART_AXES[this.config.sparkline.show.chart_type];
    const showX = this.config.sparkline.show.grid.x && chartAxes.x;
    const primaryGraph = this.geometry.axisGraphs.primary;
    const secondaryGraph = this.geometry.axisGraphs.secondary;
    const yGraph = primaryGraph !== undefined ? primaryGraph : secondaryGraph;
    const showY = yGraph !== undefined && yGraph.input.sparkline.show.grid.y && CHART_AXES[yGraph.input.sparkline.show.chart_type].y;
    if (!showX && !showY) return '';

    const xStyles = this.getRenderStyles(ConfigHelper.toStyleDict(this.config.x_axis.grid_major.styles));
    let yStyles;
    if (yGraph !== undefined) yStyles = this.getRenderStyles(ConfigHelper.toStyleDict(yGraph.input.y_axis.grid_major.styles));
    const xTicks = this.buildXAxisTicks('major');
    const yTicks =
      yGraph !== undefined && yGraph.input.sparkline.show.chart_type === 'state_bands'
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

  /** Draws only the axes supported by this chart type and enabled in Sparkline config. */
  renderAxis() {
    if (['radial', 'radial_barcode'].includes(this.config.sparkline.show.chart_type)) return this.renderRadialAxis();
    const chartAxes = CHART_AXES[this.config.sparkline.show.chart_type];
    const showX = this.config.sparkline.show.axis.x && chartAxes.x;
    const primaryGraph = this.geometry.axisGraphs.primary;
    const secondaryGraph = this.geometry.axisGraphs.secondary;
    const showPrimaryY = primaryGraph !== undefined && primaryGraph.input.sparkline.show.axis.y && CHART_AXES[primaryGraph.input.sparkline.show.chart_type].y;
    const showSecondaryY = secondaryGraph !== undefined && secondaryGraph.input.sparkline.show.axis.y && CHART_AXES[secondaryGraph.input.sparkline.show.chart_type].y;
    if (!showX && !showPrimaryY && !showSecondaryY) return '';

    const xStyles = this.getRenderStyles(ConfigHelper.toStyleDict(this.config.x_axis.axis.styles));
    const primaryYStyles = primaryGraph !== undefined ? this.getRenderStyles(ConfigHelper.toStyleDict(primaryGraph.input.y_axis.axis.styles)) : undefined;
    const secondaryYStyles = secondaryGraph !== undefined ? this.getRenderStyles(ConfigHelper.toStyleDict(secondaryGraph.input.y_axis.axis.styles)) : undefined;
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

  /** Draws major tick marks outside the enabled Cartesian or radial axes. */
  renderTickmarks() {
    if (['radial', 'radial_barcode'].includes(this.config.sparkline.show.chart_type)) return this.renderRadialTickmarks();
    const chartAxes = CHART_AXES[this.config.sparkline.show.chart_type];
    const showX = this.config.sparkline.show.tickmarks.x && chartAxes.x;
    const primaryGraph = this.geometry.axisGraphs.primary;
    const secondaryGraph = this.geometry.axisGraphs.secondary;
    const showPrimaryY = primaryGraph !== undefined && primaryGraph.input.sparkline.show.tickmarks.y && CHART_AXES[primaryGraph.input.sparkline.show.chart_type].y;
    const showSecondaryY = secondaryGraph !== undefined && secondaryGraph.input.sparkline.show.tickmarks.y && CHART_AXES[secondaryGraph.input.sparkline.show.chart_type].y;
    if (!showX && !showPrimaryY && !showSecondaryY) return '';

    const xTickConfig = this.config.x_axis.tickmarks_major;
    const xStyles = this.getRenderStyles(ConfigHelper.toStyleDict(xTickConfig.styles));
    const xTicks = this.buildXAxisTicks('major');
    const xTickSize = Utils.calculateSvgDimension(xTickConfig.size);
    const primaryYStyles = primaryGraph !== undefined ? this.getRenderStyles(ConfigHelper.toStyleDict(primaryGraph.input.y_axis.tickmarks_major.styles)) : undefined;
    const secondaryYStyles = secondaryGraph !== undefined ? this.getRenderStyles(ConfigHelper.toStyleDict(secondaryGraph.input.y_axis.tickmarks_major.styles)) : undefined;
    const primaryYTicks = primaryGraph !== undefined ? this.buildYAxisTicks('major', primaryGraph) : [];
    const secondaryYTicks = secondaryGraph !== undefined ? this.buildYAxisTicks('major', secondaryGraph) : [];
    const primaryYTickSize = primaryGraph !== undefined ? Utils.calculateSvgDimension(primaryGraph.input.y_axis.tickmarks_major.size) : 0;
    const secondaryYTickSize = secondaryGraph !== undefined ? Utils.calculateSvgDimension(secondaryGraph.input.y_axis.tickmarks_major.size) : 0;
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

  /** Draws localized X labels, numeric Y labels beside axes, and mapped-state labels inside bands. */
  renderAxisLabels() {
    if (['radial', 'radial_barcode'].includes(this.config.sparkline.show.chart_type)) return this.renderRadialAxisLabels();
    const chartAxes = CHART_AXES[this.config.sparkline.show.chart_type];
    const showX = this.config.sparkline.show.labels.x && chartAxes.x;
    const primaryGraph = this.geometry.axisGraphs.primary;
    const secondaryGraph = this.geometry.axisGraphs.secondary;
    const showPrimaryY = primaryGraph !== undefined && primaryGraph.input.sparkline.show.labels.y && CHART_AXES[primaryGraph.input.sparkline.show.chart_type].y;
    const showSecondaryY = secondaryGraph !== undefined && secondaryGraph.input.sparkline.show.labels.y && CHART_AXES[secondaryGraph.input.sparkline.show.chart_type].y;
    if (!showX && !showPrimaryY && !showSecondaryY) return '';

    const xStyles = this.getRenderStyles(ConfigHelper.toStyleDict(this.config.x_axis.labels.styles));
    const primaryYStyles = primaryGraph !== undefined ? this.getRenderStyles(ConfigHelper.toStyleDict(primaryGraph.input.y_axis.labels.styles)) : undefined;
    const secondaryYStyles = secondaryGraph !== undefined ? this.getRenderStyles(ConfigHelper.toStyleDict(secondaryGraph.input.y_axis.labels.styles)) : undefined;
    const xTicks = this.buildLabelTicks('x', this.primaryGraph);
    const primaryYTicks = primaryGraph !== undefined ? this.buildLabelTicks('y', primaryGraph) : [];
    const secondaryYTicks = secondaryGraph !== undefined ? this.buildLabelTicks('y', secondaryGraph) : [];
    const xTickSize = this.config.sparkline.show.tickmarks.x && chartAxes.x ? Utils.calculateSvgDimension(this.config.x_axis.tickmarks_major.size) : 0;
    const primaryYTickSize =
      primaryGraph !== undefined && primaryGraph.input.sparkline.show.tickmarks.y && CHART_AXES[primaryGraph.input.sparkline.show.chart_type].y
        ? Utils.calculateSvgDimension(primaryGraph.input.y_axis.tickmarks_major.size)
        : 0;
    const secondaryYTickSize =
      secondaryGraph !== undefined && secondaryGraph.input.sparkline.show.tickmarks.y && CHART_AXES[secondaryGraph.input.sparkline.show.chart_type].y
        ? Utils.calculateSvgDimension(secondaryGraph.input.y_axis.tickmarks_major.size)
        : 0;
    const primaryYLabelOffset = primaryGraph !== undefined ? Utils.calculateSvgDimension(primaryGraph.input.y_axis.labels.offset) : 0;
    const secondaryYLabelOffset = secondaryGraph !== undefined ? Utils.calculateSvgDimension(secondaryGraph.input.y_axis.labels.offset) : 0;
    const stateBands = primaryGraph !== undefined && primaryGraph.input.sparkline.show.chart_type === 'state_bands';
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

  /** Combines FHS and animation styles with Sparkline area styles. */
  getAreaStyles() {
    return Merge.mergeDeep(this.getStyles({}), ConfigHelper.toStyleDict(this.config.sparkline.area.styles));
  }

  /**
   * Selects paint for the SVG rectangle behind a masked line or area.
   * The graph line itself uses its separate stroke color.
   */
  getSparklineBackgroundPaint(styles, itemStyle) {
    const colorStops = this.sparklineSeries.primaryItem.paint.colorStops;
    const currentValue = this.getEntityNumericState(this.sparklineSeries.primaryItem, this.sparklineSeries.primaryItem.entity);
    const fixedPaint = styles.stroke || styles.fill;
    const gradientPaint = `url(#grad-${this.cardId}-${this.index}-0)`;
    const automaticPaint = colorStops.colors.length > 0 ? gradientPaint : fixedPaint;

    return this.getConfiguredSparklinePaint(this.config, colorStops, itemStyle, currentValue, fixedPaint, gradientPaint, automaticPaint);
  }

  /**
   * Applies Sparkline `item_style`: fixed color, a color-stop color, an
   * interpolated color, or the automatic paint selected for this chart layer.
   */
  getConfiguredSparklinePaint(config, colorStops, itemStyle, value, fixedPaint, gradientPaint, automaticPaint) {
    if (itemStyle === 'auto') return automaticPaint;
    if (itemStyle === 'fixed') return fixedPaint;
    if (itemStyle === 'colorstop') return Colors.calculateStrokeColor(value, colorStops, false, this.card.cardTheme.colorContext);
    if (itemStyle === 'colorstopinterpolated') return Colors.calculateStrokeColor(value, colorStops, true, this.card.cardTheme.colorContext);
    return gradientPaint;
  }


  renderSvgPoint(point, i, bucketStart) {
    const itemStyle = this.config.sparkline.show.item_style;
    const dotStyles = ConfigHelper.toStyleDict(this.config.sparkline.dots.styles);
    const fixedColor = dotStyles.fill || dotStyles.stroke;
    const pointColor = this.computeColor(point[V], i);
    const currentValue = this.getEntityNumericState(this.sparklineSeries.primaryItem, this.sparklineSeries.primaryItem.entity);
    const color = this.getConfiguredSparklinePaint(this.config, this.sparklineSeries.primaryItem.paint.colorStops, itemStyle, currentValue, fixedColor, pointColor, pointColor);
    const radius = Utils.calculateSvgDimension(this.config.sparkline.dots.radius);
    return svg`
    <circle
      class='line--point'
      ?inactive=${this.runtime.tooltip.index !== point[3]}
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
        this.config.sparkline.animate && (this.config.period.type === 'real_time' || this.sparklineHistory.hasRows(this.sparklineSeries.primaryItem.id))
          ? svg`
        <animate
          attributeName='cy'
          from=${this.geometry.animationBaselineY}
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


  renderSvgPoints(points, i) {
    if (!points) return;
    const color = this.computeColor(this.card.entities[i].state, i);
    return svg`
    <g class='line--points'
      ?tooltip=${this.runtime.tooltip.entity === i}
      ?inactive=${this.runtime.tooltip.entity !== undefined && this.runtime.tooltip.entity !== i}
      ?init=${this.geometry.length[i]}
      anim=${this.config.sparkline.animate && this.config.sparkline.show.points !== 'hover'}
      style="animation-delay: ${this.config.sparkline.animate ? `${i * 0.5 + 0.5}s` : '0s'}"
      stroke-width=${this.geometry.svg.line_width / 2}
      fill=${color}
      stroke=${color}
      >
      ${points.map((point, pointIndex) => this.renderSvgPoint(point, i, this.primaryGraph.bucketMeta[pointIndex].start.toISOString()))}
    </g>`;
  }

  renderPoints() {
    if (this.config.sparkline.show.chart_type !== 'dots' && this.config.sparkline.show.points !== true && this.config.sparkline.line?.show_dots !== true && this.config.sparkline.area?.show_dots !== true) return '';

    return this.renderSvgPoints(this.geometry.points[0], 0);
  }

  renderTooltip() {
    const tooltipStyles = ConfigHelper.toStyleDict(this.config.sparkline.tooltip?.styles);
    const styles = {
      left: this.runtime.tooltip.x !== undefined ? `${this.runtime.tooltip.x}px` : '0px',
      top: this.runtime.tooltip.y !== undefined ? `${this.runtime.tooltip.y}px` : '0px',
      transform: 'translate(-50%, calc(-100% - 6px))',
      'font-size': tooltipStyles['font-size'] ?? '0.5em',
      'max-width': 'calc(100% - 24px)',
      'pointer-events': 'none',
      display: this.runtime.tooltipVisible ? 'block' : 'none',
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
  renderActiveIndicator() {
    if (this.config.period.type === 'real_time') return '';
    if (this.config.sparkline.show.chart_type === 'radial_barcode' || this.config.sparkline.show.chart_type === 'graded') return '';

    if (this.config.sparkline.show.chart_type === 'radial') {
      const geometry = this.primaryGraph.getRadialGeometry();
      const angle = this.runtime.activePoint === undefined ? undefined : this.primaryGraph.getRadialAngleForBin(this.runtime.activePoint);
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
          style="stroke:var(--primary-text-color);stroke-width:1;opacity:0.45;visibility:${this.runtime.activePoint === undefined ? 'hidden' : 'visible'};pointer-events:none;"
        ></line>
      `;
    }

    return svg`
      <line
        id="sparkline-active-indicator-${this.cardId}-${this.index}"
        class="sparkline-active-indicator"
        x1="${this.runtime.activeX ?? 0}"
        y1="${this.primaryGraph.drawArea.y}"
        x2="${this.runtime.activeX ?? 0}"
        y2="${this.primaryGraph.drawArea.y + this.primaryGraph.drawArea.height}"
        style="stroke:var(--primary-text-color);stroke-width:1;opacity:0.45;visibility:${this.runtime.activeX === undefined ? 'hidden' : 'visible'};pointer-events:none;"
      ></line>
    `;
  }
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

  /** Renders each mapped HA state interval as a colored, optionally animated band. */
  renderSvgStateBands() {
    if (this.config.sparkline.show.chart_type !== 'state_bands') return '';

    const animate = this.config.sparkline.animate && this.sparklineHistory.hasRows(this.sparklineSeries.primaryItem.id);
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
        ${this.geometry.stateBands.map((row) =>
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

  /** Draws graded color ranks; calculated colors control fill and stroke, while styles shape the rectangles. */
  renderSvgTrafficLight(trafficLight, i) {
    const backgroundStyles = { ...this.config.sparkline.graded.background.styles };
    const foregroundStyles = { ...this.config.sparkline.graded.foreground.styles };
    const backgroundColor = 'var(--theme-sys-elevation-surface-neutral4)';

    delete backgroundStyles.fill;
    delete backgroundStyles.stroke;
    delete foregroundStyles.fill;
    delete foregroundStyles.stroke;

    return svg`
      ${this.geometry.gradeRanks.map((grade, k) => {
        const value = trafficLight.value[k];
        const hasValue = typeof value !== 'undefined';
        const foregroundColor = hasValue ? this.computeColor(value + 0.001, 0) : 'transparent';
        const rectY = Array.isArray(trafficLight.y) ? trafficLight.y[k] : trafficLight.y;
        const rectHeight = Math.max(1, trafficLight.height - this.geometry.svg.line_width);
        const rectWidth = Math.max(1, trafficLight.width - this.geometry.svg.line_width);

        return svg`
          <rect
            class='traffic-light-background'
            x=${trafficLight.x + this.geometry.svg.line_width / 2}
            y=${rectY - trafficLight.height + this.geometry.svg.line_width / 2}
            height=${rectHeight}
            width=${rectWidth}
            fill=${backgroundColor}
            stroke=${backgroundColor}
            stroke-width=${this.geometry.svg.line_width ? this.geometry.svg.line_width : 0}
            pathLength='10'
            style=${styleMap(this.getRenderStyles(backgroundStyles))}
          ></rect>
          <rect
            class='traffic-light-foreground'
            x=${trafficLight.x + this.geometry.svg.line_width / 2}
            y=${rectY - trafficLight.height + this.geometry.svg.line_width / 2}
            height=${rectHeight}
            width=${rectWidth}
            fill=${foregroundColor}
            stroke=${foregroundColor}
            stroke-width=${this.geometry.svg.line_width ? this.geometry.svg.line_width : 0}
            pathLength='10'
            style=${styleMap(this.getRenderStyles(foregroundStyles))}
          ></rect>
        `;
      })}
    `;
  }

  renderSvgGraded(trafficLights, i) {
    if (!trafficLights) return '';
    const color = this.computeColor(this.card.entities[i].state, i);

    return svg`
      <g class='traffic-lights'
        ?tooltip=${this.runtime.tooltip.entity === i}
        ?inactive=${this.runtime.tooltip.entity !== undefined && this.runtime.tooltip.entity !== i}
        ?init=${this.geometry.length[i]}
        anim=${this.config.sparkline.animate && this.config.sparkline.show.points !== 'hover'}
        style="animation-delay: ${this.config.sparkline.animate ? `${i * 0.5 + 0.5}s` : '0s'}"
        fill=${color}
        stroke=${color}
        stroke-width=${this.geometry.svg.line_width / 2}
      >
        ${trafficLights.map((trafficLight) => this.renderSvgTrafficLight(trafficLight, i))}
      </g>
    `;
  }

  /**
   * Keeps live equalizer buckets in the SVG and changes their opacity with the
   * current value. Historical equalizers size the mask from accepted History rows.
   */
  renderSvgEqualizerMask(equalizer, index) {
    if (this.config.sparkline.show.chart_type !== 'equalizer') return '';
    if (!equalizer) return '';

    const animate = this.config.sparkline.animate && (this.config.period.type === 'real_time' || this.sparklineHistory.hasRows(this.sparklineSeries.primaryItem.id));
    const animationStartY = this.geometry.animationBaselineY;

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
          realTimePart.y[levelIndex] = this.primaryGraph.drawArea.y + this.primaryGraph.drawArea.height - levelIndex * (equalizerPart.height + this.geometry.svg.row_spacing);
        }

        return realTimePart;
      });
    }

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

  /** Builds the History-bar mask used by the shared color layer, with matching bar animations. */
  renderSvgBarsMask(bars, index) {
    if (this.config.sparkline.show.chart_type !== 'bar') return '';
    if (this.config.period.type === 'real_time') return '';
    if (!bars) return '';

    const animate = this.config.sparkline.animate && this.sparklineHistory.hasRows(this.sparklineSeries.primaryItem.id);

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

  renderSvgEqualizerTrack(equalizer) {
    const background = this.config.sparkline.equalizer.background;
    const itemStyle = background.show.item_style;
    if (itemStyle === 'none') return '';
    const colorStops = this.sparklineSeries.primaryItem.paint.colorStops;
    const linearGradientColorStops = {
      colors: colorStops.colors.map((colorStop, index) => ({
        value: index / (colorStops.colors.length - 1),
        color: colorStop.color,
      })),
    };
    return svg`
      <g class='equalizer-track'>
        ${equalizer.map((equalizerPart) => {
          let width = equalizerPart.width;
          let height = equalizerPart.height;
          let levelSpacing = this.geometry.svg.row_spacing;
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
                  ? Colors.calculateStrokeColor(levelIndex / (this.config.sparkline.equalizer.value_buckets - 1), linearGradientColorStops, true, this.card.cardTheme.colorContext)
                  : Colors.calculateStrokeColor(value, colorStops, itemStyle === 'colorstopgradient', this.card.cardTheme.colorContext);
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

  renderSvgBarTrack(index) {
    const background = this.config.sparkline.bar.background;
    const itemStyle = background.show.item_style;
    if (itemStyle === 'none') return '';
    const colorStops = this.sparklineSeries.items[index].paint.colorStops;
    let backgroundStyles = { ...background.styles };
    let gradientDefinition = '';
    if (itemStyle === 'fixed') {
      backgroundStyles = { fill: background.color, ...backgroundStyles };
    } else {
      let gradient;
      if (itemStyle === 'lineargradient') {
        gradient = [...colorStops.colors].reverse().map((colorStop, colorIndex, colorStops) => ({
          color: colorStop.color,
          offset: (colorIndex / (colorStops.length - 1)) * 100,
        }));
      } else {
        const thresholds = computeThresholds(colorStops.colors, itemStyle === 'colorstopsegments' ? 'hard' : 'smooth');
        gradient = this.primaryGraph.computeGradient(thresholds, this.config.sparkline.state_values.logarithmic, this.interpolateGradientColor);
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
    const width = Math.max(1, this.primaryGraph.drawArea.width - this.geometry.svg.column_spacing);
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

  renderSvgEqualizerBackground(equalizer, index) {
    if (this.config.sparkline.show.chart_type !== 'equalizer') return '';
    if (!equalizer) return '';

    const fill = this.paint.gradient[0] ? `url(#grad-${this.cardId}-${this.index}-0)` : this.computeColor(this.card.entities[index].state, index);
    return svg`
      <rect
        class='equalizer--bg'
        ?inactive=${this.runtime.tooltip.entity !== undefined && this.runtime.tooltip.entity !== index}
        id=${`equalizer-bg-${this.cardId}-${index}`}
        fill=${fill}
        height="100%"
        width="100%"
        mask=${`url(#equalizer-bg-${this.cardId}-${index})`}
      ></rect>
    `;
  }

  renderSvgBarsBackground(bars, index) {
    if (this.config.sparkline.show.chart_type !== 'bar') return '';
    // Faded bars draw their own gradients; omit this shared layer so transparent ends stay faded.
    if (this.config.sparkline.show.fill === 'fade') return '';
    if (this.config.period.type === 'real_time') return '';
    if (!bars) return '';

    const fill = this.paint.gradient[0] ? `url(#grad-${this.cardId}-${this.index}-0)` : this.computeColor(this.card.entities[index].state, index);
    return svg`
      <rect
        class='bars--bg'
        ?inactive=${this.runtime.tooltip.entity !== undefined && this.runtime.tooltip.entity !== index}
        id=${`bars-bg-${this.cardId}-${index}`}
        fill=${fill}
        height="100%"
        width="100%"
        mask=${`url(#bars-bg-${this.cardId}-${index})`}
      ></rect>
    `;
  }

  /**
   * Colors each bar from its value and configured foreground style. Live bars
   * transition in place; History bars animate when their SVG rectangles appear.
   */
  renderSvgBars(bars, index) {
    if (!bars) return '';
    const colorStops = this.sparklineSeries.items[index].paint.colorStops;

    const animate = this.config.sparkline.animate && (this.config.period.type === 'real_time' || this.sparklineHistory.hasRows(this.sparklineSeries.primaryItem.id));
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
            color = Colors.calculateStrokeColor(bar.value, colorStops, false, this.card.cardTheme.colorContext);
          } else if (foregroundItemStyle === 'colorstopgradient') {
            color = Colors.calculateStrokeColor(bar.value, colorStops, true, this.card.cardTheme.colorContext);
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

  /** Draws configured hour marks and either clock labels or offsets measured from the period end. */
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

  renderSvgRadialBarcode(radialBarcode, index) {
    if (!radialBarcode) return '';
    const geometry = this.primaryGraph.getRadialGeometry();
    const radialBarcodePaths = this.primaryGraph.getRadialBarcodePaths();
    const radialBarcodeBackgroundPaths = this.primaryGraph.getRadialBarcodeBackgroundPaths();

    return svg`
      <g class='graph-clock'
        ?tooltip=${this.runtime.tooltip.entity === index}
        ?inactive=${this.runtime.tooltip.entity !== undefined && this.runtime.tooltip.entity !== index}
        ?init=${this.geometry.length[index]}
        anim=${this.config.sparkline.animate && this.config.sparkline.show.points !== 'hover'}
        style="animation-delay: ${this.config.sparkline.animate ? `${index * 0.5 + 0.5}s` : '0s'}"
        stroke-width=${this.geometry.svg.line_width / 2}
      >
        ${this.geometry.radialBarcodeChartBackground[index].map((bin, i) => this.renderSvgRadialBarcodeBackgroundBin(bin, radialBarcodeBackgroundPaths[i], i))}
        ${radialBarcode.map((bin, i) => this.renderSvgRadialBarcodeBin(bin, radialBarcodePaths[i], i))}
        ${this.renderSvgRadialBarcodeFace(geometry.outerRadius - this.geometry.radialBarcodeChartWidth)}
      </g>
    `;
  }

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
                this.config.sparkline.animate && (this.config.period.type === 'real_time' || this.sparklineHistory.hasRows(this.sparklineSeries.primaryItem.id))
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


  /** Shows HA History loading without replacing the graph; reduced motion gets a static spinner. */
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
            this.runtime.prefersReducedMotion
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

  /** Draws each Series' background track and grouped bars from the calculated bar positions. */
  renderSeriesBars() {
    return svg`
      ${this.sparklineSeries.items.map((item, index) => {
        if (item.dataState !== SPARKLINE_DATA_STATE.HAS_DATA || item.config.sparkline.show.chart_type !== 'bar') return '';

        const { config } = item;
        const color = config.color ?? item.entityConfig.color ?? config.sparkline.line_color[index];
        const foregroundStyles = { ...config.sparkline.bar.foreground.styles };
        const fade = config.sparkline.show.fill === 'fade';
        const animate = config.sparkline.animate && (config.period.type === 'real_time' || this.sparklineHistory.hasRows(item.id));
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

  /** Defines each bar's fade in SVG defs so single and multi-Series charts use the same fill references. */
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

  /** Aligns each Series' color-stop values with its radial value range and inner/outer radii. */
  renderSeriesRadialGradients() {
    return this.sparklineSeries.items.map((item) => {
      const { config, graph } = item;
      const colorStops = item.paint.colorStops;
      if (
        item.dataState !== SPARKLINE_DATA_STATE.HAS_DATA
        || config.sparkline.show.chart_type !== 'radial'
        || colorStops.colors.length === 0
        || ![
          config.sparkline.show.item_style,
          config.sparkline.line.show.item_style,
          config.sparkline.line.minmax.show.item_style,
          config.sparkline.area.show.item_style,
          config.sparkline.area.minmax.show.item_style,
        ].some((itemStyle) => ['auto', 'colorstopgradient'].includes(itemStyle))
      ) return '';

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
          ${colorStops.colors.map(
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

  /** Fits each Series' color gradient to its own Y range, including secondary-axis Series. */
  renderSeriesCartesianColorGradients() {
    return this.sparklineSeries.items.map((item) => {
      const { config, graph } = item;
      const colorStops = item.paint.colorStops;
      const chartType = config.sparkline.show.chart_type;
      const layerItemStyles = chartType === 'line'
        ? [config.sparkline.line.show.item_style, config.sparkline.line.minmax.show.item_style]
        : [config.sparkline.line.show.item_style, config.sparkline.area.show.item_style, config.sparkline.area.minmax.show.item_style];
      if (item.dataState !== SPARKLINE_DATA_STATE.HAS_DATA || !['line', 'area'].includes(chartType) || !layerItemStyles.includes('colorstopgradient')) return '';

      const gradient = graph.computeGradient(
        computeThresholds(colorStops.colors, config.sparkline.colorstops_transition),
        config.sparkline.state_values.logarithmic,
        this.interpolateGradientColor,
      );

      return svg`
        <linearGradient id=${`cartesian-series-color-${this.cardId}-${this.index}-${item.id}`} gradientTransform="rotate(90)">
          ${gradient.map((stop) => svg`<stop stop-color=${stop.color} offset=${`${stop.offset}%`}></stop>`)}
        </linearGradient>
      `;
    });
  }

  /** Fades radial areas toward their visible zero radius, across positive or negative value ranges. */
  renderSeriesRadialAreaMasks() {
    return this.sparklineSeries.items.map((item) => {
      const { config, graph } = item;
      if (item.dataState !== SPARKLINE_DATA_STATE.HAS_DATA || config.sparkline.show.chart_type !== 'radial' || config.sparkline.show.chart_variant !== 'area' || config.sparkline.show.fill !== 'fade') return '';

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
            width=${this.geometry.graphArea.width}
            height=${this.geometry.graphArea.height}
            fill=${`url(#${gradientId})`}
          ></rect>
        </mask>
      `;
    });
  }

  /** Fades each area toward the graph bottom; color-stop gradients keep their colors through a fade mask. */
  renderSeriesAreaGradients() {
    return this.sparklineSeries.items.map((item, index) => {
      const { config, graph } = item;
      if (item.dataState !== SPARKLINE_DATA_STATE.HAS_DATA || config.sparkline.show.chart_type !== 'area' || config.sparkline.show.fill !== 'fade') return '';

      const gradientId = `series-area-fade-${this.cardId}-${this.index}-${item.id}`;
      const maskId = `series-area-fade-mask-${this.cardId}-${this.index}-${item.id}`;
      const itemStyle = config.sparkline.area.show.item_style;
      const colorStops = item.paint.colorStops;
      const areaStyles = ConfigHelper.toStyleDict(config.sparkline.area.styles);
      const fixedColor = config.color ?? item.entityConfig.color ?? areaStyles.fill ?? config.sparkline.line_color[index];
      const automaticColor = config.color ?? item.entityConfig.color ?? config.sparkline.line_color[index];
      const currentValue = this.getEntityNumericState(item, item.entity);
      const selectedColor = this.getConfiguredSparklinePaint(config, colorStops, itemStyle, currentValue, fixedColor, automaticColor, automaticColor);

      if (itemStyle === 'colorstopgradient') {
        return svg`
          <linearGradient id=${gradientId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2=${graph.drawArea.height}>
            <stop stop-color="white" offset="0%" stop-opacity="1"></stop>
            <stop stop-color="white" offset="100%" stop-opacity="0.1"></stop>
          </linearGradient>
          <mask id=${maskId} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
            <rect x="0" y="0" width=${graph.drawArea.width} height=${graph.drawArea.height} fill=${`url(#${gradientId})`}></rect>
          </mask>
        `;
      }

      return svg`
        <linearGradient id=${gradientId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2=${graph.drawArea.height}>
          <stop stop-color=${selectedColor} offset="0%" stop-opacity="1"></stop>
          <stop stop-color=${selectedColor} offset="100%" stop-opacity="0.1"></stop>
        </linearGradient>
      `;
    });
  }

  /** Draws each Cartesian Series fill, min/max band, line and configured points. */
  renderSeriesCartesian() {
    return svg`
      ${this.sparklineSeries.items.map((item, index) => {
        if (item.dataState !== SPARKLINE_DATA_STATE.HAS_DATA) return '';

        const { config } = item;
        const colorStops = item.paint.colorStops;
        const chartType = config.sparkline.show.chart_type;
        const automaticColor = config.color ?? item.entityConfig.color ?? config.sparkline.line_color[index];
        const lineStyles = {
          ...ConfigHelper.toStyleDict(config.sparkline.line.styles),
          'stroke-width': this.getConfiguredLineWidth(config),
        };
        const areaStyles = ConfigHelper.toStyleDict(config.sparkline.area.styles);
        const dotStyles = ConfigHelper.toStyleDict(config.sparkline.dots.styles);
        const path = this.geometry.line[index];
        const areaPath = this.geometry.area[index];
        const minMaxPath = this.geometry.areaMinMax[index];
        const points = chartType === 'dots' || config.sparkline.show.points === true || config.sparkline.line.show_dots === true || config.sparkline.area.show_dots === true
          ? this.geometry.points[index]
          : [];
        const pointRadius = Utils.calculateSvgDimension(config.sparkline.dots.radius);
        const currentValue = this.getEntityNumericState(item, item.entity);
        const gradientPaint = `url(#cartesian-series-color-${this.cardId}-${this.index}-${item.id})`;
        const fixedLinePaint = config.color ?? item.entityConfig.color ?? lineStyles.stroke;
        const fixedAreaPaint = config.color ?? item.entityConfig.color ?? areaStyles.fill;
        const linePaint = this.getConfiguredSparklinePaint(config, colorStops, config.sparkline.line.show.item_style, currentValue, fixedLinePaint, gradientPaint, automaticColor);
        const areaPaint = this.getConfiguredSparklinePaint(config, colorStops, config.sparkline.area.show.item_style, currentValue, fixedAreaPaint, gradientPaint, automaticColor);

        const areaFade = config.sparkline.show.fill === 'fade';
        const areaGradientId = `series-area-fade-${this.cardId}-${this.index}-${item.id}`;
        const areaMaskId = `series-area-fade-mask-${this.cardId}-${this.index}-${item.id}`;
        const areaFill = areaFade && chartType === 'area' && config.sparkline.area.show.item_style !== 'colorstopgradient' ? `url(#${areaGradientId})` : areaPaint;
        const minMaxStyles = chartType === 'line'
          ? Merge.mergeDeep({}, lineStyles, ConfigHelper.toStyleDict(config.sparkline.line.minmax.styles))
          : areaStyles;
        const minMaxItemStyle = chartType === 'line' ? config.sparkline.line.minmax.show.item_style : config.sparkline.area.minmax.show.item_style;
        const minMaxPaint = this.getConfiguredSparklinePaint(config, colorStops, minMaxItemStyle, currentValue, chartType === 'line' ? fixedLinePaint : fixedAreaPaint, gradientPaint, automaticColor);

        return svg`
          ${
            areaPath
              ? svg`<path class="sparkline-series-area" d="${areaPath}" fill=${areaFill} stroke="none" mask=${areaFade && config.sparkline.area.show.item_style === 'colorstopgradient' ? `url(#${areaMaskId})` : ''} style=${styleMap(this.getRenderStyles({ ...areaStyles, fill: areaFill }, [config.sparkline.area.color_filter]))}></path>`
              : ''
          }
          ${
            minMaxPath
              ? svg`<path class="sparkline-series-minmax" d="${minMaxPath}" fill=${minMaxPaint} stroke="none" style=${styleMap(this.getRenderStyles(
                { ...minMaxStyles, fill: minMaxPaint, stroke: 'none' },
                chartType === 'line'
                  ? [config.sparkline.line.minmax.color_filter]
                  : [config.sparkline.area.minmax.color_filter],
              ))}></path>`
              : ''
          }
          ${
            path && config.sparkline.show.line !== false
              ? svg`<path class="sparkline-series-line" d="${path}" fill="none" stroke="${linePaint}" style=${styleMap(this.getRenderStyles({ ...lineStyles, fill: 'none', stroke: linePaint }, [config.sparkline.line.color_filter]))}></path>`
              : ''
          }
          ${points.map((point) => {
            const pointColor = Colors.calculateStrokeColor(point[V], colorStops, true, this.card.cardTheme.colorContext);
            const fixedPointPaint = config.color ?? item.entityConfig.color ?? dotStyles.fill ?? dotStyles.stroke;
            const pointPaint = this.getConfiguredSparklinePaint(config, colorStops, config.sparkline.show.item_style, currentValue, fixedPointPaint, pointColor, automaticColor);
            return svg`<circle class="sparkline-series-point" cx="${point[X]}" cy="${point[Y]}" r="${pointRadius}" style=${styleMap(this.getRenderStyles({ ...dotStyles, fill: pointPaint, stroke: pointPaint }))}></circle>`;
          })}
        `;
      })}
    `;
  }

  /** Draws each radial Series area, min/max band, line and configured points. */
  renderSeriesRadial() {
    const seriesLayers = this.sparklineSeries.items.map((item, index) => {
      if (item.dataState !== SPARKLINE_DATA_STATE.HAS_DATA) return undefined;

      const { config, graph } = item;
      const colorStops = item.paint.colorStops;
      const variant = config.sparkline.show.chart_variant;
      const seriesColor = config.color ?? item.entityConfig.color;
      const automaticColor = seriesColor ?? (colorStops.colors.length > 0 ? `url(#radial-series-color-${this.cardId}-${this.index}-${item.id})` : config.sparkline.line_color[index]);
      const lineStyles = {
        ...ConfigHelper.toStyleDict(config.sparkline.line.styles),
        'stroke-width': this.getConfiguredLineWidth(config),
      };
      const areaStyles = ConfigHelper.toStyleDict(config.sparkline.area.styles);
      const dotStyles = ConfigHelper.toStyleDict(config.sparkline.dots.styles);
      const path = ['line', 'area'].includes(variant) ? graph.getRadialPath() : undefined;
      const areaPath = variant === 'area' ? graph.getRadialArea(path) : undefined;
      const showMinMax = variant === 'line' ? config.sparkline.line.show.minmax === true : variant === 'area' && config.sparkline.area.show.minmax === true;
      const minMaxPath = showMinMax ? graph.getRadialMinMaxArea() : undefined;
      const areaFade = variant === 'area' && config.sparkline.show.fill === 'fade';
      const areaMaskId = `radial-area-fade-mask-${this.cardId}-${this.index}-${item.id}`;
      const points = variant === 'dots' || config.sparkline.show.points === true || config.sparkline.line.show_dots === true || config.sparkline.area.show_dots === true ? graph.getRadialPoints() : [];
      const pointRadius = Utils.calculateSvgDimension(config.sparkline.dots.radius);
      const currentValue = this.getEntityNumericState(item, item.entity);
      const gradientPaint = `url(#radial-series-color-${this.cardId}-${this.index}-${item.id})`;
      const fixedLinePaint = seriesColor ?? lineStyles.stroke;
      const fixedAreaPaint = seriesColor ?? areaStyles.fill;
      const linePaint = this.getConfiguredSparklinePaint(config, colorStops, config.sparkline.line.show.item_style, currentValue, fixedLinePaint, gradientPaint, automaticColor);
      const areaPaint = this.getConfiguredSparklinePaint(config, colorStops, config.sparkline.area.show.item_style, currentValue, fixedAreaPaint, gradientPaint, automaticColor);
      const minMaxStyles = variant === 'line'
        ? Merge.mergeDeep({}, lineStyles, ConfigHelper.toStyleDict(config.sparkline.line.minmax.styles))
        : areaStyles;
      const minMaxItemStyle = variant === 'line' ? config.sparkline.line.minmax.show.item_style : config.sparkline.area.minmax.show.item_style;
      const minMaxPaint = this.getConfiguredSparklinePaint(config, colorStops, minMaxItemStyle, currentValue, variant === 'line' ? fixedLinePaint : fixedAreaPaint, gradientPaint, automaticColor);

      return {
        config,
        colorStops,
        seriesColor,
        automaticColor,
        linePaint,
        areaPaint,
        minMaxPaint,
        lineStyles,
        areaStyles,
        dotStyles,
        minMaxStyles,
        path,
        areaPath,
        minMaxPath,
        areaFade,
        areaMaskId,
        points,
        pointRadius,
        currentValue,
        index,
      };
    }).filter((layer) => layer !== undefined);

    return svg`
      ${seriesLayers.map((layer) =>
        layer.minMaxPath
          ? svg`<path class="sparkline-radial-minmax" d="${layer.minMaxPath}" fill=${layer.minMaxPaint} stroke="none" style=${styleMap(this.getRenderStyles(
            { ...layer.minMaxStyles, fill: layer.minMaxPaint, stroke: 'none' },
            layer.config.sparkline.show.chart_variant === 'line'
              ? [layer.config.sparkline.line.minmax.color_filter]
              : [layer.config.sparkline.area.minmax.color_filter],
          ))}></path>`
          : '',
      )}
      ${seriesLayers.map((layer) =>
        layer.areaPath
          ? svg`<path class="sparkline-radial-area" d="${layer.areaPath}" fill=${layer.areaPaint} stroke="none" mask=${layer.areaFade ? `url(#${layer.areaMaskId})` : ''} style=${styleMap(this.getRenderStyles({ ...layer.areaStyles, fill: layer.areaPaint }, [layer.config.sparkline.area.color_filter]))}></path>`
          : '',
      )}
      ${seriesLayers.map((layer) =>
        layer.path && layer.config.sparkline.show.line !== false
          ? svg`<path class="sparkline-radial-line" d="${layer.path}" fill="none" stroke="${layer.linePaint}" style=${styleMap(this.getRenderStyles({ ...layer.lineStyles, fill: 'none', stroke: layer.linePaint }, [layer.config.sparkline.line.color_filter]))}></path>`
          : '',
      )}
      ${seriesLayers.map((layer) =>
        layer.points.map((point) => {
            const colorStopPointPaint = Colors.calculateStrokeColor(point[V], layer.colorStops, true, this.card.cardTheme.colorContext);
            const automaticPointPaint = layer.seriesColor
              ?? (layer.colorStops.colors.length > 0
                ? Colors.calculateStrokeColor(point[V], layer.colorStops, layer.config.sparkline.colorstops_transition === 'smooth', this.card.cardTheme.colorContext)
                : layer.config.sparkline.line_color[layer.index]);
            const fixedPointPaint = layer.seriesColor ?? layer.dotStyles.fill ?? layer.dotStyles.stroke;
            const pointPaint = this.getConfiguredSparklinePaint(
              layer.config,
              layer.colorStops,
              layer.config.sparkline.show.item_style,
              layer.currentValue,
              fixedPointPaint,
              colorStopPointPaint,
              automaticPointPaint,
            );
            return svg`<circle class="sparkline-radial-point" cx="${point[X]}" cy="${point[Y]}" r="${layer.pointRadius}" style=${styleMap(this.getRenderStyles({ ...layer.dotStyles, fill: pointPaint, stroke: pointPaint }))}></circle>`;
          }),
      )}
    `;
  }
  /** Prefers configured names; otherwise combines the HA area with the entity or translated attribute name. */
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
   * Builds one Text tool and color marker per Series, fitting each legend name
   * to its slot with width-based ellipsis while keeping the configured font size.
   */
  updateLegendTextTools() {
    if (this.hasJavascript && !this.runtimeConfigInitialized) return;
    const legend = this.config.sparkline.legend;
    if (!this.config.sparkline.show.legend) {
      this.legendTextTools.forEach((tool) => tool.disconnected());
      this.paint.legendItems = [];
      this.legendTextTools = [];
      this.runtime.legendTextSignature = undefined;
      return;
    }

    const items = this.sparklineSeries.items;
    const area = this.geometry.legendLayout.legendArea;
    const horizontal = this.geometry.legendLayout.orientation === 'horizontal';
    const rows = Number(legend.rows);
    const columns = horizontal ? Math.ceil(items.length / rows) : 1;
    const slotWidth = area.width / columns;
    const slotHeight = area.height / (horizontal ? rows : items.length);
    const markerSize = this.geometry.legendLayout.markerRadius;
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
        xpos: (this.geometry.svg.x + textX) / 2,
        ypos: (this.geometry.svg.y + textY) / 2,
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

    if (textSignature === this.runtime.legendTextSignature) return;

    this.legendTextTools.forEach((tool) => tool.disconnected());
    legendItems.forEach((item) => {
      item.textTool.updateRuntimeConfig();
      item.textTool.setStaticState();
      if (this.runtime.legendHassAvailable) item.textTool.hassAvailable();
      if (this.sparklineHistory.connectedToCard) item.textTool.connected();
      else item.textTool.disconnected();
    });
    this.paint.legendItems = legendItems;
    this.legendTextTools = legendItems.map((item) => item.textTool);
    this.runtime.legendTextSignature = textSignature;
  }

  /** Uses browser-measured legend Text height after width-based ellipsis to recalculate graph space. */
  updated() {
    if (this.hasJavascript && !this.runtimeConfigInitialized) return;
    const legendTextMeasurementWasPending = this.legendTextTools.some((textTool) => textTool.widthOverflowPending);

    this.legendTextTools.forEach((textTool) => textTool.updated());

    if (!this.config.sparkline.show.legend || this.legendTextTools.length === 0) return;

    // Width-based ellipsis first renders invisible measuring text. Wait for its
    // visible label on the next render before reserving the legend row height.
    if (legendTextMeasurementWasPending) return;

    const textElement = this.legendTextTools[0].textElement;
    // The label shares the graph's SVG viewBox, so its measured height is already
    // in the SVG units used to reserve graph space.
    const measuredTextHeight = textElement.getBBox().height;
    const lineHeight = Number(this.config.sparkline.legend.line_height);
    const measuredRowHeight = measuredTextHeight * lineHeight;
    const measuredSignature = measuredTextHeight + '|' + measuredRowHeight;

    if (measuredSignature === this.geometry.legendMeasuredSignature) return;

    const graphHadData = this.sparklineSeries.dataState === SPARKLINE_DATA_STATE.HAS_DATA;
    this.geometry.legendMeasuredSignature = measuredSignature;
    this.geometry.legendMeasuredFontSize = measuredTextHeight;
    this.geometry.legendMeasuredRowHeight = measuredRowHeight;
    this.geometry.legendLayout = this.calculateLegendLayout();
    this.geometry.graphArea = this.geometry.legendLayout.graphArea;
    this.geometry.graphGeometryChanged = true;
    this.updateRuntimeConfig();
    this.updateLegendTextTools();
    if (graphHadData) this.updateGraphFromSeries();
    this.card.requestUpdate();
  }

  /** Draws the Series names with Text tools and their configured color markers. */
  renderLegend() {
    if (!this.config.sparkline.show.legend) return svg``;

    return svg`
      <g class="sparkline-legend" pointer-events="none">
        <g transform="translate(${-this.geometry.svg.x} ${-this.geometry.svg.y})">
          ${this.legendTextTools.map((textTool) => textTool.render())}
        </g>
        ${this.paint.legendItems.map(
          (item) => svg`
          <circle
            class="sparkline-legend__marker"
            cx="${item.markerX}"
            cy="${item.markerY}"
            r="${this.geometry.legendLayout.markerRadius}"
            fill="${item.color}"
          ></circle>
        `,
        )}
      </g>
    `;
  }
  /**
   * Renders the Sparkline SVG definitions, day/night background, graph layers,
   * axes and legend once its config is ready. Historical charts stay empty until
   * HA History arrives; a larger refresh can keep the last complete graph visible.
   */
  renderSvg() {
    if (this.hasJavascript && !this.runtimeConfigInitialized) return svg``;
    if (this.sparklineSeries.dataState !== SPARKLINE_DATA_STATE.HAS_DATA) {
      return svg`
        <g
          transform="${this.getGroupScaleTransform()}"
          style="${this.getGroupScaleStyle()}"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="sparkline-${this.cardId}-${this.index}"
            x="${this.geometry.svg.x}"
            y="${this.geometry.svg.y}"
            width="${this.geometry.svg.width}"
            height="${this.geometry.svg.height}"
            viewBox="0 0 ${this.geometry.svg.width} ${this.geometry.svg.height}"
            overflow="visible"
            touch-action="none"
            style="touch-action:none; pointer-events:none; overflow:visible;"
            @pointerdown=${(event) => event.stopPropagation()}
            @click=${(event) => event.stopPropagation()}
          >
            <g class="sparkline-plot" transform="translate(${this.geometry.graphArea.x} ${this.geometry.graphArea.y})">
              ${this.runtime.periodDurationAvailable ? this.renderHistoryLoadingSpinner() : svg``}
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
          x="${this.geometry.svg.x}"
          y="${this.geometry.svg.y}"
          width="${this.geometry.svg.width}"
          height="${this.geometry.svg.height}"
          viewBox="0 0 ${this.geometry.svg.width} ${this.geometry.svg.height}"
          overflow="visible"
          touch-action="none"
          style="touch-action:none; pointer-events:auto; overflow:visible;"
          ${this.actionHandler()}
          @action=${(event) => this.handleAction(event)}
          @pointerdown=${(event) => event.stopPropagation()}
          @click=${(event) => event.stopPropagation()}
        >
          <defs>
            ${this.renderSvgGradient(this.paint.gradient)}
            ${this.sparklineSeries.items.length > 1 ? this.renderSeriesAreaGradients() : ''}
            ${this.sparklineSeries.items.length > 1 ? this.renderSeriesCartesianColorGradients() : ''}
            ${this.config.sparkline.show.chart_type === 'radial' ? this.renderSeriesRadialGradients() : ''}
            ${this.config.sparkline.show.chart_type === 'radial' ? this.renderSeriesRadialAreaMasks() : ''}
            ${this.geometry.area.map((fill, i) => this.renderSvgAreaMask(fill, i))}
            ${this.geometry.areaMinMax.map((fill, i) => this.renderSvgAreaMinMaxMask(fill, i))}
            ${this.geometry.line.map((line, i) => this.renderSvgLineMask(line, i))}
            ${this.renderSvgStateBandsMask()}
          </defs>
          <g class="sparkline-plot" transform="translate(${this.geometry.graphArea.x} ${this.geometry.graphArea.y})">
            <g
              class="sparkline-background-layers"
              opacity="1"
              pointer-events="none"
            >
              ${this.config.sparkline.show.chart_type === 'radial' ? this.renderRadialBackground() : ''}
              ${this.renderDayNightLayer()}
            </g>
            <g
            opacity="1"
            style="pointer-events:auto"
          >
          ${this.renderCartesianHitArea()}
          ${this.config.sparkline.show.chart_type === 'radial' ? this.renderRadialHitArea() : ''}
          ${this.renderGrid()}
          ${this.config.sparkline.show.chart_type === 'radial' ? this.renderSeriesRadial() : ''}
          ${this.sparklineSeries.items.length > 1 ? this.renderSeriesBars() : ''}
          ${
            this.config.sparkline.show.chart_type !== 'radial'
              ? svg`<g transform="translate(0 ${this.geometry.animationBaselineY})">
                <g>
                  ${
                    this.config.sparkline.animate && ['line', 'area'].includes(this.config.sparkline.show.chart_type) && (this.config.period.type === 'real_time' || this.sparklineHistory.hasRows(this.sparklineSeries.primaryItem.id))
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
                  <g transform="translate(0 ${-this.geometry.animationBaselineY})">
                    ${
                      this.sparklineSeries.items.length > 1
                        ? this.renderSeriesCartesian()
                        : svg`
                        ${this.geometry.area.map((fill, i) => this.renderSvgAreaBackground(fill, i))}
                        ${this.geometry.areaMinMax.map((fill, i) => this.renderSvgAreaMinMaxBackground(fill, i))}
                        ${this.geometry.line.map((line, i) => this.renderSvgLineBackground(line, i))}
                      `
                    }
                  </g>
                </g>
              </g>
            `
              : ''
          }
          ${this.geometry.bar.map((bars, i) => this.renderSvgBarsMask(bars, i))}
          ${this.geometry.bar.map((bars, i) => this.renderSvgBarTrack(i))}
          ${this.geometry.bar.map((bars, i) => this.renderSvgBarsBackground(bars, i))}
          ${this.geometry.bar.map((bars, i) => this.renderSvgBars(bars, i))}
          ${this.geometry.equalizer.map((equalizer, i) => this.renderSvgEqualizerMask(equalizer, i))}
          ${this.geometry.equalizer.map((equalizer, i) => this.renderSvgEqualizerTrack(equalizer, i))}
          ${this.geometry.equalizer.map((equalizer, i) => this.renderSvgEqualizerBackground(equalizer, i))}
          ${this.geometry.barcodeChart.map((barcodePart, i) => this.renderSvgBarcode(barcodePart, i))}
          ${this.geometry.radialBarcodeChart.map((radialPart, i) => this.renderSvgRadialBarcode(radialPart, i))}
          ${this.geometry.graded.map((grade, i) => this.renderSvgGraded(grade, i))}
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

  /** Waits for JavaScript config, then places the Sparkline SVG in its FHS group. */
  render() {
    if (this.hasJavascript && !this.runtimeConfigInitialized) return svg``;
    return this.renderItemLayers(this.renderSvg());
  }
}
