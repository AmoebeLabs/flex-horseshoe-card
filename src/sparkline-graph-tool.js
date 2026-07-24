/* eslint-disable arrow-body-style */
/* eslint-disable no-useless-concat */
import { html, svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import BaseTool from './base-tool.js';
import Colors from './colors';
import ConfigHelper from './config-helper.js';
import Merge from './merge.js';
import Utils from './utils.js';
import SparklineGraph, { X, Y, V } from './sparkline-graph.js';
import StateTool from './state-tool.js';
import { formatDateVeryShort } from './frontend_mods/common/datetime/format_date.ts';
import { formatTime } from './frontend_mods/common/datetime/format_time.ts';
import { formatDateTime } from './frontend_mods/common/datetime/format_date_time.ts';
import { formatNumericDuration } from './frontend_mods/common/datetime/format_duration.ts';
import { computeStateDisplay } from './frontend_mods/common/entity/compute_state_display.ts';
import { FONT_SIZE } from './const.js';

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
  radial_barcode: { x: false, y: false },
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
 * This class is deliberately a thin FHS wrapper around the SAK SparklineGraph
 * calculation engine. The graph engine owns coordinate, spline, path and area
 * calculation. This wrapper only adapts FHS layout config, styles, masks/clips,
 * and pointer interaction to the existing FHS tool pipeline.
 */
export default class SparklineGraphTool extends BaseTool {
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
        period: 'rolling_window', // maakt niet uit wat hier staat? wordt niet gebruikt??
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
          // 2026.07.05 aantal van deze calender instelling overschrijftr dus de rolling window instelling. waar nu weer
          // aangetoond dus. maar wat gevolg voor rst van grafiek? nog onduidelijk. blijft tot einde van de dag lopen. of eigenlijk tot de helft vreemd genoeg
          // komt dus nooit verder. waar zit deze rare fout.
          //
          // er zitten ergens testen die hierdoor fout gaan. want die kijken of één van de twee bestaat. zonder het type te controleren
          // ik vermoed dat het daarom misgaat dus... Gevolgen??
          bins: {
            per_hour: 4, // 6, wel heel toevallig. kijken met 12 dan eens... grafiek nog steeds fout. lijkt erop alsof deze bij rolling_window wordt overschreven?
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
        equalizer: {
          value_buckets: 10,
          square: false,
        },
        graded: {
          square: false,
        },
        state_bands: {
          radius: 0.5,
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
        radial_barcode: {
          size: 5,
          line_width: 0,
          face: {
            show_day_night: false,
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
        show: {
          chart_type: 'line',
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
          xlabels_at: 'ticks_major',
          ylabels_at: 'ticks_major',
        },
      },
      x_axis: {
        axis: {
          styles: {
            stroke: 'var(--primary-text-color)',
            'stroke-width': 1,
            opacity: 0.45,
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
            stroke: 'var(--divider-color)',
            'stroke-width': 1,
            opacity: 0.35,
          },
        },
        grid_minor: {
          styles: {
            stroke: 'var(--divider-color)',
            'stroke-width': 1,
            opacity: 0.15,
          },
        },
        tickmarks_major: {
          size: 1,
          styles: {
            stroke: 'var(--primary-text-color)',
            'stroke-width': 1,
            opacity: 0.45,
          },
        },
        tickmarks_minor: {
          size: 0.5,
          styles: {
            stroke: 'var(--primary-text-color)',
            'stroke-width': 1,
            opacity: 0.25,
          },
        },
        labels: {
          offset: 2,
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
            stroke: 'var(--primary-text-color)',
            'stroke-width': 1,
            opacity: 0.45,
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
            stroke: 'var(--divider-color)',
            'stroke-width': 1,
            opacity: 0.35,
          },
        },
        grid_minor: {
          styles: {
            stroke: 'var(--divider-color)',
            'stroke-width': 1,
            opacity: 0.15,
          },
        },
        tickmarks_major: {
          size: 1,
          styles: {
            stroke: 'var(--primary-text-color)',
            'stroke-width': 1,
            opacity: 0.45,
          },
        },
        tickmarks_minor: {
          size: 0.5,
          styles: {
            stroke: 'var(--primary-text-color)',
            'stroke-width': 1,
            opacity: 0.25,
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
    if (normalizedConfig.sparkline?.state_bands?.styles !== undefined) {
      normalizedConfig.sparkline.state_bands.styles = ConfigHelper.toStyleDict(normalizedConfig.sparkline.state_bands.styles);
    }
    if (normalizedConfig.sparkline?.state_bands?.background?.styles !== undefined) {
      normalizedConfig.sparkline.state_bands.background.styles = ConfigHelper.toStyleDict(normalizedConfig.sparkline.state_bands.background.styles);
    }
    ['x_axis', 'y_axis'].forEach((axisName) => {
      ['axis', 'grid_major', 'grid_minor', 'tickmarks_major', 'tickmarks_minor', 'labels'].forEach((layerName) => {
        if (normalizedConfig[axisName]?.[layerName]?.styles !== undefined) {
          normalizedConfig[axisName][layerName].styles = ConfigHelper.toStyleDict(normalizedConfig[axisName][layerName].styles);
        }
      });
    });
    const sparklineConfig = Merge.mergeDeep(defaultConfig, normalizedConfig);

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

    super(sparklineConfig, index, templates, cardId, card, 'sparklines', 'sparklines', 0);

    this.svg = this.calculateSvgDimensions();
    this.containedGraphMargin = this.svg.margin;
    this.config.svg = this.svg;
    this.stateBandsStateMap = this.config.sparkline.state_map;
    this.graphConfig = this.buildGraphConfig(this.config);
    this.Graph = new SparklineGraph(this.svg.width, this.svg.height, this.svg.margin, this.graphConfig, [], [], this.graphConfig.sparkline.state_map ?? {});
    this.series = [];
    this.historySeries = undefined;
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
    this.radialBarcodeChartWidth = Utils.calculateSvgDimension(this.config?.sparkline?.radial_barcode?.size || 5);
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
    this.historyPromise = undefined;
    this.historyRefreshAt = 0;
    this.binBoundaryTimer = undefined;
    this.calendarRangeTimer = undefined;
    this.historyRangeStart = undefined;
    this.historyRangeEnd = undefined;
    this.historyResynchronizationRequested = false;
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
    const coordinates = this.card._calculateSvgCoordinatesInGroup(config);
    const width = Utils.calculateSvgDimension(config.width);
    const height = Utils.calculateSvgDimension(config.height);
    const margin = this.calculateSparklineMargin(config.margin);
    const line_width = Utils.calculateSvgDimension(config.sparkline?.[config.sparkline.show.chart_type]?.styles?.['stroke-width'] || config.sparkline?.line?.styles?.['stroke-width'] || config.line_width || 0);
    // this.svg.line_width = Utils.calculateSvgDimension(this.config.sparkline[this.config.sparkline.show.chart_type]?.line_width || this.config.line_width || 0);
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
   * Calculates the minimum graph margins needed to keep enabled tickmarks and
   * axis labels inside the configured sparkline width and height.
   *
   * The graph engine already treats margins as the space outside drawArea. This
   * method adds only the space required by visible axis layers and keeps larger
   * user-configured margins unchanged.
   *
   * @returns {object} Effective graph margins with t/r/b/l/x/y values.
   */
  calculateContainedGraphMargin() {
    const configuredMargin = this.calculateSparklineMargin(this.config.margin);
    const chartAxes = CHART_AXES[this.config.sparkline.show.chart_type];
    const showXTickmarks = chartAxes.x && this.config.sparkline.show.tickmarks.x;
    const showYTickmarks = chartAxes.y && this.config.sparkline.show.tickmarks.y;
    const showXLabels = chartAxes.x && this.config.sparkline.show.labels.x;
    const showYLabels = chartAxes.y && this.config.sparkline.show.labels.y;
    const xTickSize = showXTickmarks ? Utils.calculateSvgDimension(this.config.x_axis.tickmarks_major.size) : 0;
    const yTickSize = showYTickmarks ? Utils.calculateSvgDimension(this.config.y_axis.tickmarks_major.size) : 0;
    const xLabelOffset = showXLabels ? Utils.calculateSvgDimension(this.config.x_axis.labels.offset) : 0;
    const yLabelOffset = showYLabels ? Utils.calculateSvgDimension(this.config.y_axis.labels.offset) : 0;
    const xFontSize = this.resolveAxisFontSizePixels('x', FONT_SIZE);
    const yFontSize = this.resolveAxisFontSizePixels('y', FONT_SIZE);
    const xFontHeight = xFontSize * 0.85;
    const yFontHeight = yFontSize * 0.85;
    const yLabels = this.buildYAxisTicks('major').map((tick) => tick.label);
    const yLabelLength = yLabels.reduce((length, label) => Math.max(length, label.length), 0);
    const yLabelWidth = yLabelLength * yFontSize * 0.5;
    let t = configuredMargin.t;
    let r = configuredMargin.r;
    let b = Math.max(configuredMargin.b, xTickSize);
    let l = Math.max(configuredMargin.l, yTickSize);

    // X labels remain uniformly anchored. Reserve horizontal room only for
    // labels attached to an actual draw-area endpoint.
    if (showXLabels) {
      const xTicks = this.buildXAxisTicks('major');
      const firstLabelWidth = xTicks[0].label.length * xFontSize * 0.6;
      const lastTick = xTicks[xTicks.length - 1];
      const lastLabelWidth = lastTick.label.length * xFontSize * 0.6;
      const lastTickIsAxisEnd = lastTick.value === this.Graph.xAxis.end.getTime();
      const xTextAnchor = this.config.x_axis.labels.styles['text-anchor'];

      b = Math.max(b, xTickSize + xLabelOffset + xFontHeight);

      if (xTextAnchor === 'start') {
        if (lastTickIsAxisEnd) r = Math.max(r, lastLabelWidth);
      } else if (xTextAnchor === 'end') {
        l = Math.max(l, firstLabelWidth);
      } else {
        l = Math.max(l, firstLabelWidth / 2);
        if (lastTickIsAxisEnd) r = Math.max(r, lastLabelWidth / 2);
      }
    }

    // Y labels sit left of their tickmarks. Half a line of vertical room keeps
    // the labels on the highest and lowest ticks inside the outer viewport.
    if (showYLabels && this.config.sparkline.show.chart_type !== 'state_bands') {
      l = Math.max(l, yTickSize + yLabelOffset + yLabelWidth);
      t = Math.max(t, yFontHeight / 2);
      b = Math.max(b, yFontHeight / 2);
    }

    return {
      t,
      r,
      b,
      l,
      x: l,
      y: t,
    };
  }

  /**
   * Builds the config object consumed by SparklineGraph without changing the
   * engine's expected naming.
   *
   * @param {object} config - Sparkline layout config.
   * @returns {object} Engine config.
   */
  buildGraphConfig(config) {
    const sparkline =
      config.sparkline.show.chart_type === 'state_bands'
        ? {
            ...config.sparkline,
            state_map: this.stateBandsStateMap,
          }
        : config.sparkline;

    return {
      width: this.svg.width,
      height: this.svg.height,
      period: config.period,
      sparkline,
      x_axis: {
        ...config.x_axis,
        labels: {
          ...config.x_axis.labels,
          max_length: this.xAxisLabelLength,
        },
      },
      y_axis: config.y_axis,
    };
  }

  /**
   * Updates runtime entity context and recalculates graph paths from current data.
   *
   * @param {object} entity - Home Assistant entity state object for this tool.
   * @param {object} entityConfig - Entity configuration for this tool.
   */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    // Determine the longest label produced by Home Assistant for the active
    // locale. Short month names are not guaranteed to contain three characters,
    // and 12-hour clocks need room for a two-digit hour plus AM or PM.
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
    }

    if (this.config.sparkline.show.chart_type === 'state_bands') {
      this.stateBandsStateMap = {
        ...this.config.sparkline.state_map,
        map: this.config.sparkline.state_map.map.map((entry) => {
          const state = String(entry.state ?? entry.value);
          const stateEntity = {
            ...entity,
            state,
          };
          const formattedState = this.card._hass.formatEntityState?.(entity, state);
          const formattedStateEntity = this.card._hass.formatEntityState?.(stateEntity);
          const computedState = computeStateDisplay(
            this.card._hass.localize,
            stateEntity,
            this.card._hass.locale,
            [],
            this.card._hass.config,
            this.card._hass.entities,
          );
          const displayLabel =
            [formattedState, formattedStateEntity, computedState].find((label) => label !== undefined && label !== state) ?? formattedState ?? formattedStateEntity ?? computedState;

          return {
            ...entry,
            display_label: entry.label ?? displayLabel ?? entry.display_label,
          };
        }),
      };
    }

    this.svg = this.calculateSvgDimensions(this.config);
    this.svg.margin = this.containedGraphMargin;
    this.config.svg = this.svg;
    this.graphConfig = this.buildGraphConfig(this.config);
    this.Graph = new SparklineGraph(this.svg.width, this.svg.height, this.svg.margin, this.graphConfig, [], [], this.graphConfig.sparkline.state_map ?? {});
    const realTime = this.config.period.type === 'real_time';
    const activeHistoryPeriod = this.config.period.type === 'rolling_window' || (this.config.period.type === 'calendar' && this.config.period.calendar.offset === 0);
    const closedHistoricalCalendar = this.config.period.type === 'calendar' && this.config.period.calendar.offset < 0;

    // Real-time mode owns one current sample and never enters the history
    // lifecycle. Clear an existing boundary timer when runtime config changes
    // from a history period to real-time.
    if (realTime) {
      window.clearTimeout(this.binBoundaryTimer);
      window.clearTimeout(this.calendarRangeTimer);
      this.series = this.buildRealtimeSeries(entity);
    } else if (this.historySeries) {
      // Active periods append every Home Assistant state update before the
      // complete series is reduced again into buckets. main.js reads the newly
      // calculated statistics immediately after this tool update.
      if (activeHistoryPeriod) this.addCurrentEntityToHistory(entity);
      this.series = this.historySeries;
    } else if (closedHistoricalCalendar) {
      // A closed calendar period stays empty until its requested Home Assistant
      // history arrives. Showing the current state here would display data from
      // outside the requested historical range.
      this.series = [];
    } else {
      this.series = this.buildRealtimeSeries(entity);
    }

    // Closed calendar history has no valid graph input until Home Assistant
    // returns the requested range. Do not calculate or expose current data in
    // that interval while the first history request is pending.
    if (!closedHistoricalCalendar || this.historySeries) {
      this.updateGraphFromSeries();

      if (this.tooltipVisible && this.pointerEvent) {
        this.updateActivePointer(this.pointerEvent);
      }
    }

    if (realTime) return;

    this.fetchHistoryIfNeeded(entity);
    this.scheduleBinBoundaryRefresh();
    this.scheduleCalendarRangeRefresh();
  }

  /**
   * Builds the one-item current-state series used before history loads and used
   * permanently by real-time mode.
   *
   * @param {object} entity - Current HA state object.
   * @returns {Array<object>} Series for SparklineGraph.update().
   */
  buildRealtimeSeries(entity) {
    const stateBands = this.config.sparkline.show.chart_type === 'state_bands';
    const mappedState = stateBands ? this.stateBandsStateMap.map.find((entry) => String(entry.state) === String(entity.state)) : undefined;
    const value = stateBands ? Number(mappedState.value) : this.getEntityNumericState(entity);
    const now = stateBands ? entity.last_changed : new Date().toISOString();

    return [
      {
        ...entity,
        state: value,
        haState: entity.state,
        last_changed: now,
        last_updated: now,
      },
    ];
  }

  /**
   * Adds the current Home Assistant state as a normal history row. The reducer
   * then processes fetched and live samples through the same bucket path.
   *
   * @param {object} entity - Current HA state object.
   */
  addCurrentEntityToHistory(entity) {
    // Current Home Assistant state belongs only to active history periods.
    // Closed calendar ranges must contain fetched source rows exclusively.
    if (this.config.period.type === 'calendar' && this.config.period.calendar.offset < 0) return;

    const current = this.buildRealtimeSeries(entity)[0];
    const last = this.historySeries[this.historySeries.length - 1];

    if (last.last_changed !== current.last_changed) {
      this.historySeries.push(current);
    }
  }

  /**
   * Prunes an active history series to the bucket-aligned graph window. One
   * preceding row is retained because its state remains active at the start of
   * the first visible bucket. Source rows and timestamps remain unchanged.
   *
   * @returns {object} Start and end timestamps used for visible statistics.
   */
  pruneLiveHistoryToActiveWindow() {
    const bucketMs = (60 / this.Graph.points) * 60 * 1000;
    const now = Date.now();
    const periodHours = this.config.period.type === 'rolling_window' ? this.config.period.rolling_window.duration.hour : this.config.period.calendar.duration.hour;
    const rangeStart =
      this.config.sparkline.show.chart_type === 'state_bands'
        ? this.getHistoryRange().start.getTime()
        : this.config.period.type === 'rolling_window'
          ? Math.floor(now / bucketMs) * bucketMs + bucketMs - periodHours * 60 * 60 * 1000
          : this.getHistoryRange().start.getTime();
    const sortedSeries = this.historySeries.concat().sort((a, b) => new Date(a.last_changed).getTime() - new Date(b.last_changed).getTime());
    let precedingRow;
    const activeRows = [];

    sortedSeries.forEach((row) => {
      if (new Date(row.last_changed).getTime() < rangeStart) {
        precedingRow = row;
      } else {
        activeRows.push(row);
      }
    });

    this.historySeries = precedingRow ? [precedingRow, ...activeRows] : activeRows;
    this.series = this.historySeries;

    return {
      start: rangeStart,
      end: now,
    };
  }

  scheduleBinBoundaryRefresh() {
    window.clearTimeout(this.binBoundaryTimer);
    const activeHistoryPeriod = this.config.period.type === 'rolling_window' || (this.config.period.type === 'calendar' && this.config.period.calendar.offset === 0);

    // Closed calendar periods have no active bucket and therefore no ordinary
    // bin-boundary work. Their range refresh belongs to the midnight lifecycle.
    if (!activeHistoryPeriod) return;

    if (!this.entity) return;

    const bucketMs = (60 / this.Graph.points) * 60 * 1000;
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
      this.card._updateSparklineEntities();
      this.card._updateToolsUsingSparklineEntities();
      this.card.requestUpdate();
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
      const range = this.getHistoryRange();
      const rangeChanged = range.start.getTime() !== this.historyRangeStart || range.end.getTime() !== this.historyRangeEnd;

      if (rangeChanged && this.historyPromise) {
        this.historyPromise.finally(() => this.fetchHistoryIfNeeded(this.entity));
      } else if (rangeChanged) {
        this.fetchHistoryIfNeeded(this.entity);
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
    if (this.historySeries && (this.config.period.type === 'rolling_window' || (this.config.period.type === 'calendar' && this.config.period.calendar.offset === 0))) {
      this.historyResynchronizationRequested = true;
    }
  }

  /** Marks existing history for resynchronization after an HA reconnect. */
  hassConnected() {
    if (this.historySeries && (this.config.period.type === 'rolling_window' || (this.config.period.type === 'calendar' && this.config.period.calendar.offset === 0))) {
      this.historyResynchronizationRequested = true;
    }
  }

  /**
   * Reports whether reconnect handling requires the next setHass pass.
   *
   * @returns {boolean} True when existing history must be fetched again.
   */
  requiresHassUpdate() {
    return this.historyResynchronizationRequested;
  }

  /**
   * Parses the SAK-style refresh interval used by the history loader.
   *
   * @returns {number} Refresh interval in milliseconds.
   */
  getHistoryRefreshMs() {
    const interval = this.config.history.refresh_interval;

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
   * Builds the time window used by both the x-axis and the history request.
   * Calendar windows stay anchored to midnight; rolling windows count backwards
   * from now.
   *
   * @returns {object} Start and end Date objects.
   */
  getHistoryRange() {
    const periodHours = this.config.period?.calendar?.duration?.hour ?? this.config.period?.rolling_window?.duration?.hour ?? 24;
    const now = new Date();

    if (this.config.period?.type === 'calendar' && this.config.period?.calendar?.period === 'day') {
      const start = new Date(now);
      // 1. Altijd strak op het begin van vandaag zetten (00:00:00)
      start.setHours(0, 0, 0, 0);

      // 2. Exact jouw oude logica, omgerekend naar dagen:
      const offsetDays = this.config.period?.calendar?.offset ?? 0;
      const durationDaysAdjustment = (periodHours - 24) / 24;

      // 3. Pas de dagen veilig toe (JavaScript handelt maanden/jaren perfect af)
      start.setDate(start.getDate() + offsetDays - durationDaysAdjustment);

      return {
        start,
        end: new Date(start.getTime() + periodHours * 60 * 60 * 1000),
      };
    }

    return {
      start: new Date(now.getTime() - periodHours * 60 * 60 * 1000),
      end: now,
    };
  }

  getHistoryRangeV2() {
    const periodHours = this.config.period?.calendar?.duration?.hour ?? this.config.period?.rolling_window?.duration?.hour ?? 24;
    const now = new Date();

    if (this.config.period?.type === 'calendar' && this.config.period?.calendar?.period === 'day') {
      const start = new Date(now);
      // 1. Zet de tijd strak op het begin van vandaag (00:00:00)
      start.setHours(0, 0, 0, 0);

      // 2. Bereken hoeveel dagen we terug moeten op basis van de duration (bijv. 48 uur = 2 dagen terug)
      const durationDays = periodHours / 24;

      // 3. Pas de offset en de durationDays toe om de startdatum te bepalen
      const offsetDays = this.config.period?.calendar?.offset ?? 0;
      start.setDate(start.getDate() + offsetDays - durationDays);

      return {
        start,
        // 4. De eindtijd is simpelweg de starttijd plus de periodHours (48 uur later)
        end: new Date(start.getTime() + periodHours * 60 * 60 * 1000),
      };
    }

    // Rolling window logica blijft ongewijzigd
    return {
      start: new Date(now.getTime() - periodHours * 60 * 60 * 1000),
      end: now,
    };
  }

  getHistoryRangeV1() {
    const periodHours = this.config.period?.calendar?.duration?.hour ?? this.config.period?.rolling_window?.duration?.hour ?? 24;
    const now = new Date();

    if (this.config.period?.type === 'calendar' && this.config.period?.calendar?.period === 'day') {
      const start = new Date(now);
      start.setHours(0, 0, 0);
      start.setHours(start.getHours() + (this.config.period?.calendar?.offset ?? 0) * 24 - (periodHours - 24));

      return {
        start,
        end: new Date(start.getTime() + periodHours * 60 * 60 * 1000),
      };
    }

    if (this.config.period?.type === 'rolling_window') {
      return {
        start: new Date(now.getTime() - periodHours * 60 * 60 * 1000),
        end: now,
      };
    }

    return {
      start: new Date(now.getTime() - periodHours * 60 * 60 * 1000),
      end: now,
    };
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
   * @param {object} entity - Current HA state object.
   */
  fetchHistoryIfNeeded(entity) {
    const now = Date.now();
    const range = this.getHistoryRange();
    const calendarPeriod = this.config.period.type === 'calendar';
    const closedHistoricalCalendar = calendarPeriod && this.config.period.calendar.offset < 0;
    const representedRange = range.start.getTime() === this.historyRangeStart && range.end.getTime() === this.historyRangeEnd;
    const calendarRangeChanged = calendarPeriod && !representedRange;
    const periodicResynchronizationDue = this.config.history.refresh_interval !== undefined && now >= this.historyRefreshAt;

    if (this.historyPromise) return;
    if (closedHistoricalCalendar && representedRange) return;
    if (this.historySeries && !calendarRangeChanged && !this.historyResynchronizationRequested && !periodicResynchronizationDue) return;

    const path = this.buildHistoryPath(this.entityConfig.entity, range.start, range.end);
    // console.log('[fetchHistoryIfNeeded] range', range);
    this.historyPromise = this.card._hass
      .callApi('GET', path)
      .then((history) => {
        const historyRows = history.length === 0 ? [] : history[0];
        this.historySeries = this.buildHistorySeries(historyRows, entity, range.end);
        this.historyRangeStart = range.start.getTime();
        this.historyRangeEnd = range.end.getTime();
        this.addCurrentEntityToHistory(entity);
        this.series = this.historySeries;
        this.updateGraphFromSeries();
        this.card._updateSparklineEntities();
        this.card._updateToolsUsingSparklineEntities();
        if (this.config.history.refresh_interval !== undefined) this.historyRefreshAt = Date.now() + this.getHistoryRefreshMs();
        this.historyResynchronizationRequested = false;
        this.card.requestUpdate();
      })
      .finally(() => {
        this.historyPromise = undefined;
      });
  }

  /**
   * Converts Home Assistant history rows to the exact input shape expected by
   * SparklineGraph. Keep the original HA state in haState and feed the numeric
   * value through state.
   *
   * @param {Array<object>} historyRows - Rows returned by the HA history API.
   * @param {object} currentEntity - Current HA state object.
   * @param {Date} rangeEnd - End of the requested history window.
   * @returns {Array<object>} SparklineGraph history series.
   */
  buildHistorySeries(historyRows, currentEntity, rangeEnd) {
    const closedHistoricalCalendar = this.config.period.type === 'calendar' && this.config.period.calendar.offset < 0;
    const rows = closedHistoricalCalendar ? historyRows : historyRows.concat([currentEntity]);

    if (this.config.sparkline.show.chart_type === 'state_bands') {
      return rows.map((row) => {
        const mappedState = this.stateBandsStateMap.map.find((entry) => String(entry.state) === String(row.state));

        return {
          ...row,
          state: Number(mappedState.value),
          haState: row.state,
        };
      });
    }

    // // console.log('buildHistorySeries', rows, currentEntity, rangeEnd);
    // // return rows
    let newRows = rows
      .filter((row) => row && Number.isFinite(Number(row.state)))
      .map((row) => {
        const value = Number(row.state);

        return Merge.mergeDeep(row, {
          state: value,
          haState: row.state,
        });
      });
    // console.log('buildHistorySeries', newRows, currentEntity, rangeEnd);
    return newRows;
  }

  /**
   * Extracts the numeric value used by the graph engine.
   *
   * @param {object} entity - Current HA state object.
   * @returns {number} Numeric graph state.
   */
  getEntityNumericState(entity) {
    if (this.entityConfig?.attribute) {
      return Number(entity.attributes[this.entityConfig.attribute]);
    }

    return Number(entity.state);
  }

  /**
   * Runs the reused graph engine and stores the generated FHS render paths.
   */
  updateGraphFromSeries() {
    const chartType = this.config.sparkline.show.chart_type;
    const index = 0;
    const total = 1;

    // Development mode replaces only the values with the deterministic example
    // sequence. Source timestamps remain intact so normal bucketing is exercised.
    if (this.card.dev.fakeData && chartType !== 'state_bands') {
      let generatedState = 40;

      this.series.forEach((seriesItem, seriesIndex) => {
        if (seriesIndex < this.series.length / 2) generatedState -= 4 * seriesIndex;
        if (seriesIndex > this.series.length / 2) generatedState += 3 * seriesIndex;
        seriesItem.state = generatedState;
        seriesItem.haState = generatedState;
      });
    }

    const activeHistoryPeriod = this.config.period.type === 'rolling_window' || (this.config.period.type === 'calendar' && this.config.period.calendar.offset === 0);
    const statisticsRange = activeHistoryPeriod && this.historySeries ? this.pruneLiveHistoryToActiveWindow() : undefined;

    // Real-time uses the graph engine's existing one-hour/one-point calculation.
    // Only history-backed modes calculate and apply a requested history range.
    if (this.config.period.type !== 'real_time') {
      const range = this.getHistoryRange();
      this.Graph.hours = (range.end.getTime() - range.start.getTime()) / (60 * 60 * 1000);
    }

    this.Graph.update(this.series);

    // Width and height define the complete sparkline viewport. Rebuild only
    // when formatted labels or visible axis layers require a different draw
    // area; normal state updates keep using the cached contained margins.
    const containedGraphMargin = this.calculateContainedGraphMargin();
    if (
      containedGraphMargin.t !== this.containedGraphMargin.t ||
      containedGraphMargin.r !== this.containedGraphMargin.r ||
      containedGraphMargin.b !== this.containedGraphMargin.b ||
      containedGraphMargin.l !== this.containedGraphMargin.l
    ) {
      this.containedGraphMargin = containedGraphMargin;
      this.svg.margin = containedGraphMargin;
      this.graphConfig = this.buildGraphConfig(this.config);
      this.Graph = new SparklineGraph(this.svg.width, this.svg.height, this.svg.margin, this.graphConfig, [], [], this.graphConfig.sparkline.state_map ?? {});

      if (this.config.period.type !== 'real_time') {
        const range = this.getHistoryRange();
        this.Graph.hours = (range.end.getTime() - range.start.getTime()) / (60 * 60 * 1000);
      }

      this.Graph.update(this.series);
    }

    // Use the graph engine y-scale for every vertical introduction animation.
    // Clamp value zero to the draw area for positive-only and negative-only scales.
    if (chartType === 'state_bands') {
      this.animationBaselineY = this.Graph.drawArea.y + this.Graph.drawArea.height;
    } else {
      const zeroY = this.Graph._calcY([[this.Graph.drawArea.x, 0, 0]])[0][Y];
      this.animationBaselineY = Math.min(this.Graph.drawArea.y + this.Graph.drawArea.height, Math.max(this.Graph.drawArea.y, zeroY));
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
    this.stateBands = chartType === 'state_bands' && this.historySeries ? this.Graph.getStateBands() : [];

    if (this.Graph.coords.length > 0) {
      if (['area', 'line'].includes(chartType)) {
        this.linePath = this.Graph.getPath();
        if (this.entityConfig?.show_line !== false) {
          this.line[index] = this.linePath;
        }
        if (chartType === 'area') {
          this.areaPath = this.Graph.getArea(this.linePath);
          this.area[index] = this.areaPath;
        } else {
          this.areaPath = undefined;
        }

        if (this.config.sparkline?.line?.show_minmax === true || this.config.sparkline?.area?.show_minmax === true) {
          this.lineMinPath = this.Graph.getPathMin();
          this.lineMaxPath = this.Graph.getPathMax();
          this.areaMinMaxPath = this.Graph.getAreaMinMax(this.lineMinPath, this.lineMaxPath);
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
        this.points[index] = this.Graph.getPoints();
      }

      if (chartType === 'bar') {
        this.bar[index] = this.Graph.getBars(index, total, 4, 4);
      } else if (chartType === 'equalizer') {
        this.Graph.levelCount = this.config.sparkline.equalizer.value_buckets;
        this.Graph.valuesPerBucket = (this.Graph.max - this.Graph.min) / this.config.sparkline.equalizer.value_buckets;
        this.equalizer[index] = this.Graph.getEqualizer(index, total, this.svg.column_spacing, this.svg.row_spacing);
      } else if (chartType === 'graded') {
        this.Graph.levelCount = this.config.sparkline.equalizer.value_buckets;
        this.Graph.valuesPerBucket = (this.Graph.max - this.Graph.min) / this.config.sparkline.equalizer.value_buckets;
        this.graded[index] = this.Graph.getGrades(index, total, 4, 4);
      } else if (chartType === 'radial_barcode') {
        this.radialBarcodeChartBackground[index] = this.Graph.getRadialBarcodeBackground(index, total, this.svg.column_spacing, this.svg.row_spacing);
        this.radialBarcodeChart[index] = this.Graph.getRadialBarcode(index, total, this.svg.column_spacing, this.svg.row_spacing);
        this.Graph.radialBarcodeBackground = this.radialBarcodeChartBackground[index];
        this.Graph.radialBarcode = this.radialBarcodeChart[index];
      } else if (chartType === 'barcode') {
        this.barcodeChart[index] = this.Graph.getBarcode(index, total, 4, 4);
      }
    }

    if (this.config.sparkline.colorstops.colors.length > 0 && !this.entityConfig?.color) {
      this.gradient[0] = this.Graph.computeGradient(computeThresholds(this.config.sparkline.colorstops.colors, this.config.sparkline.colorstops_transition), this.config.sparkline.state_values.logarithmic);
    } else {
      this.gradient = [];
    }
    this.stats = this.calculateStatistics(this.series, statisticsRange);
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

  mouseEventToPointV1(e) {
    let p = this.elements.svg.createSVGPoint();
    const touch = e.touches?.[0] ?? e.changedTouches?.[0] ?? e;
    p.x = touch.clientX;
    p.y = touch.clientY;
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
    const x = point.x;

    return Math.max(0, Math.min(x, this.svg.width));
  }

  /**
   * Snaps the pointer X to the closest graph sample X so hover and drag track
   * the same interval positions as the rendered line.
   *
   * @param {number} x - Raw pointer X in SVG coordinates.
   * @returns {number} Snapped graph X position.
   */
  snapPointerXToGraphPoint(x) {
    const coords = this.Graph.coords;
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

  // Version from Gemini. Extended with angle to allow touch go outside SVG

  getRadialBarcodePointIndexFromEvent(e) {
    // 1. Extract touch or cursor data safely
    const touch = e?.touches?.[0] ?? e?.changedTouches?.[0];
    const point = touch ?? e;

    // 2. COORDINATE-BASED RADARS (Handles active pointer tracking)
    if (point?.clientX !== undefined && point?.clientY !== undefined) {
      // A. PRIMARY SHADOW-DOM PIXEL RADAR: Try exact pixel hit test inside the web component scope
      const shadowContainer = this.elements.svg.getRootNode();
      const hitTestScope = shadowContainer instanceof ShadowRoot ? shadowContainer : document;
      const elementStack = Array.from(hitTestScope.elementsFromPoint(point.clientX, point.clientY));

      const matchedElement = elementStack.find((el) => el?.closest?.('.sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin'));

      const bin = matchedElement?.closest?.('.sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin');

      // If the browser successfully tracks the exact node underneath the point, return its index immediately
      if (bin) {
        return Number(bin.dataset.pointIndex);
      }

      // B. SECONDARY ANGLE RADAR: Webkit/Safari Fallback (When finger drifts outside Shadow DOM limits)
      // Query a specific radial element (like the background group) to keep the center calculation stable
      const radialContainer = this.elements.svg.querySelector('.sparkline-radial-barcode__bg-bin')?.parentNode ?? this.elements.svg;
      const svgRect = radialContainer.getBoundingClientRect();
      const centerX = svgRect.left + svgRect.width / 2;
      const centerY = svgRect.top + svgRect.height / 2;

      // Calculate raw angle in radians (-PI to PI)
      const radians = Math.atan2(point.clientY - centerY, point.clientX - centerX);

      // Convert radians to degrees and apply the +90 deg offset
      // to align index 0 precisely at 12 o'clock (top), turning clockwise
      const degrees = (radians * (180 / Math.PI) + 360 + 90) % 360;

      // Fetch the total number of petals rendered in the DOM tree. Use background bins!!!!
      const binsList = this.elements.svg.querySelectorAll('.sparkline-radial-barcode__bg-bin');
      const totalBins = binsList.length;

      if (totalBins === 0) return NaN;

      // Convert the calculated degree slice directly into your petal index
      const degreesPerBin = 360 / totalBins;
      const calculatedIndex = Math.floor(degrees / degreesPerBin);

      // Clamp the index safely between 0 and the maximum index to prevent array bounds errors
      return Math.min(Math.max(0, calculatedIndex), totalBins - 1);
    }

    // 3. TRADITIONAL DESKTOP FALLBACK
    // Executed for non-coordinate or accessibility actions where raw screen pixels (clientX) are absent,
    // but a valid, direct DOM event target is present (e.g., standard keyboard focus/blur triggers).
    const target = e?.target ?? e?.currentTarget;
    const bin = target?.closest?.('.sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin');
    return bin ? Number(bin.dataset.pointIndex) : NaN;
  }

  getRadialBarcodePointIndexFromEventV5(e) {
    // 1. Extract touch or cursor data safely
    const touch = e?.touches?.[0] ?? e?.changedTouches?.[0];
    const point = touch ?? e;

    // 2. COORDINATE-BASED RADARS (Handles standard mouse/touch movement)
    if (point?.clientX !== undefined && point?.clientY !== undefined) {
      // A. PRIMARY SHADOW-DOM RADAR: Try exact pixel hit test inside the web component
      const shadowContainer = this.elements.svg.getRootNode();
      const hitTestScope = shadowContainer instanceof ShadowRoot ? shadowContainer : document;
      const elementStack = Array.from(hitTestScope.elementsFromPoint(point.clientX, point.clientY));

      const matchedElement = elementStack.find((el) => el?.closest?.('.sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin'));

      const bin = matchedElement?.closest?.('.sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin');

      // If the cursor/finger is directly touching a petal, return its index immediately
      if (bin) {
        return Number(bin.dataset.pointIndex);
      }

      // B. SECONDARY ANGLE RADAR: Distance & Angle calculation (When finger/cursor drifts outside)
      // Only execute this if the user started the interaction intentionally by clicking/touching a petal first
      if (this.isInteractionLocked) {
        // Query a specific radial container (like the background group) to keep the center stable
        // even if there are titles/legends inside the same SVG space.
        const radialContainer = this.elements.svg.querySelector('.sparkline-radial-barcode__bg-bin')?.parentNode ?? this.elements.svg;
        const svgRect = radialContainer.getBoundingClientRect();
        const centerX = svgRect.left + svgRect.width / 2;
        const centerY = svgRect.top + svgRect.height / 2;

        // Calculate raw angle in radians (-PI to PI)
        const radians = Math.atan2(point.clientY - centerY, point.clientX - centerX);

        // Convert to degrees and apply a +90 deg offset to shift index 0 from 3 o'clock to 12 o'clock (top)
        const degrees = (radians * (180 / Math.PI) + 360 + 90) % 360;

        // Fetch the total number of bins from the DOM tree
        const binsList = this.elements.svg.querySelectorAll('.sparkline-radial-barcode__bin');
        const totalBins = binsList.length;

        if (totalBins === 0) return NaN;

        // Calculate the size of each individual wedge/slice in degrees
        const degreesPerBin = 360 / totalBins;

        // Calculate which slice the finger is pointing at while dragging far away
        const calculatedIndex = Math.floor(degrees / degreesPerBin);

        // Clamp the index safely between 0 and the max available index (loop-free)
        return Math.min(Math.max(0, calculatedIndex), totalBins - 1);
      }

      // If the pointer is outside the layout and the interaction loop wasn't locked on start, ignore it
      return NaN;
    }

    // 3. TRADITIONAL DESKTOP FALLBACK
    // Executed for legacy or accessibility actions where raw screen pixels (clientX) are absent,
    // but a valid, direct DOM event target is present (e.g., standard keyboard focus/blur triggers).
    const target = e?.target ?? e?.currentTarget;
    const bin = target?.closest?.('.sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin');
    return bin ? Number(bin.dataset.pointIndex) : NaN;
  }

  // Version from Gemini. V4 works for hover and touch
  getRadialBarcodePointIndexFromEventV4(e) {
    // 1. Extract touch data safely (supports touchmove and touchend via changedTouches)
    const touch = e?.touches?.[0] ?? e?.changedTouches?.[0];
    const point = touch ?? e;

    // 2. SHADOW-DOM PIERCING RADAR
    if (point?.clientX !== undefined) {
      // Dynamically fetch the Shadow Root containing your SVG component
      const shadowContainer = this.elements.svg.getRootNode();

      // Fall back to document if the component is running in a standard DOM tree
      const hitTestScope = shadowContainer instanceof ShadowRoot ? shadowContainer : document;

      // Execute the radar scan inside the correct Shadow DOM layer
      const elementStack = Array.from(hitTestScope.elementsFromPoint(point.clientX, point.clientY));

      // Find the exact matching DOM element that belongs to a barcode bin
      const matchedElement = elementStack.find((el) => el?.closest?.('.sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin'));

      // Retrieve the actual bin element and return its index as a Number
      const bin = matchedElement?.closest?.('.sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin');
      return bin ? Number(bin.dataset.pointIndex) : NaN;
    }

    // 3. TRADITIONAL DESKTOP FALLBACK
    const target = e?.target ?? e?.currentTarget;
    const bin = target?.closest?.('.sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin');
    return bin ? Number(bin.dataset.pointIndex) : NaN;
  }

  getRadialBarcodePointIndexFromEventV3(e) {
    // 1. Extract touch data if available.
    // 'changedTouches' is essential for mobile Safari during 'touchend' events.
    const touch = e?.touches?.[0] ?? e?.changedTouches?.[0];
    const point = touch ?? e;

    console.log('[getRadialBarcodePointIndexFromEvent], touch, point, e ', touch, point, e);
    // 2. UNIFIED COORDINATE RADAR (Handles both Mobile 'touchmove' and Desktop 'mousemove')
    // This block dynamically checks exactly what is underneath the user's finger or cursor.
    if (point?.clientX !== undefined) {
      // Convert NodeList to an Array to fully avoid loops or generators (no regenerator-runtime)
      const elementStack = Array.from(document.elementsFromPoint(point.clientX, point.clientY));

      // Scan the stack of elements underneath the point using functional array iteration
      const matchedElement = elementStack.find((el) => el?.closest?.('.sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin'));

      // Retrieve the actual bin element and return its index
      const bin = matchedElement?.closest?.('.sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin');
      console.log('[getRadialBarcodePointIndexFromEvent], MATCHING ', elementStack, matchedElement, bin);
      return bin ? Number(bin.dataset.pointIndex) : NaN;
    }

    // 3. TRADITIONAL DESKTOP FALLBACK
    // Used for standard desktop events that do not rely on screen coordinates,
    // such as direct keyboard focus, blur, or direct component-level element events.
    const target = e?.target ?? e?.currentTarget;
    const bin = target?.closest?.('.sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin');
    return bin ? Number(bin.dataset.pointIndex) : NaN;
  }

  // Version from bae52a0
  getRadialBarcodePointIndexFromEventV2(e) {
    const touch = e?.touches?.[0] ?? e?.changedTouches?.[0];
    const target = touch ? document.elementFromPoint(touch.clientX, touch.clientY) : e?.currentTarget;
    const bin = target?.closest?.('.sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin');
    console.log('[getRadialBarcodePointIndexFromEvent], bin', bin);
    return Number(bin?.dataset?.pointIndex);
  }

  getRadialBarcodePointIndexFromEventV1(e) {
    const touch = e?.touches?.[0] ?? e?.changedTouches?.[0];
    const point = touch ?? e;
    const target =
      point?.clientX !== undefined
        ? document.elementsFromPoint(point.clientX, point.clientY).find((element) => element?.closest?.('.sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin'))
        : (e?.target ?? e?.currentTarget);
    const bin = target?.closest?.('.sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin');
    return Number(bin?.dataset?.pointIndex);
  }

  /**
   * Updates active pointer state for indicator/snake rendering.
   *
   * @param {MouseEvent|TouchEvent|PointerEvent} e - Browser interaction event.
   */
  getPointIndexFromX(x) {
    const coords = this.Graph.coords;
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
      index: this.Graph.stateBandSegments.indexOf(segment),
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

  updateTooltipFromPointIndex(pointIndex, event) {
    const bucket = this.Graph.bucketMeta[pointIndex];
    const point = this.Graph.coords[pointIndex];
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

    const min = this.formatTooltipStat('min', bucket.min);
    const avg = this.formatTooltipStat('avg', bucket.avg);
    const max = this.formatTooltipStat('max', bucket.max);
    const scaleX = svgBox ? svgBox.width / this.svg.width : 1;
    const scaleY = svgBox ? svgBox.height / this.svg.height : 1;
    const pointer = event?.touches ? event.touches[0] : event;
    const centerX = pointer?.clientX !== undefined ? pointer.clientX - containerBox.left : this.tooltip.x !== undefined ? this.tooltip.x : svgBox ? svgBox.left - containerBox.left + point[X] * scaleX : point[X];
    const centerY = pointer?.clientY !== undefined ? pointer.clientY - containerBox.top : this.tooltip.y !== undefined ? this.tooltip.y : svgBox ? svgBox.top - containerBox.top + point[Y] * scaleY : point[Y];

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

  updateTooltipFromRadialBarcode(pointIndex, event) {
    this.activeX = undefined;
    this.elements.containerRect = this.elements.container.getBoundingClientRect();
    const svgBox = this.elements.svg.getBoundingClientRect();
    const scaleX = svgBox.width / this.svg.width;
    const scaleY = svgBox.height / this.svg.height;
    this.elements.tooltipBounds = {
      left: svgBox.left - this.elements.containerRect.left + this.Graph.drawArea.x * scaleX,
      top: svgBox.top - this.elements.containerRect.top + this.Graph.drawArea.y * scaleY,
      right: svgBox.left - this.elements.containerRect.left + (this.Graph.drawArea.x + this.Graph.drawArea.width) * scaleX,
      bottom: svgBox.top - this.elements.containerRect.top + (this.Graph.drawArea.y + this.Graph.drawArea.height) * scaleY,
    };
    this.updateRadialActiveBinDom(pointIndex);
    this.updateActiveIndicatorDom();
    this.updateTooltipFromPointIndex(pointIndex, event);
    this.updateTooltipContentDom();
    this.updateTooltipPositionDom(event);
    this.updateTooltipVisibilityDom(true);
  }

  clearTooltip() {
    this.tooltip = {};
    this.tooltipVisible = false;
  }

  clearRadialTooltip() {
    this.clearTooltip();
    this.updateTooltipVisibilityDom(false);
    this.updateActiveIndicatorDom();
  }

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

      this.updateTooltipFromRadialBarcode(pointIndex, event);
    });
  }

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

  updateRadialActiveBinDom(pointIndex) {
    // const bins = this.elements.svg?.querySelectorAll('.sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin');
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

    if (this.activeX === undefined) {
      activeIndicator.style.visibility = 'hidden';
      return;
    }

    activeIndicator.setAttribute('x1', `${this.activeX}`);
    activeIndicator.setAttribute('x2', `${this.activeX}`);
    activeIndicator.style.visibility = 'visible';
  }

  updateTooltipVisibilityDom(show) {
    this.tooltipVisible = show;
    const tooltip = this.elements.tooltip;

    if (!tooltip) return;

    tooltip.style.display = show ? 'block' : 'none';
  }

  updateTooltipPositionDom(e) {
    const tooltip = this.elements.tooltip;
    const containerBox = this.elements.containerRect || this.elements.container.getBoundingClientRect();
    const touch = e?.touches?.[0] ?? e?.changedTouches?.[0] ?? e;

    if (!tooltip || !containerBox) return;

    if (touch?.clientX === undefined || touch?.clientY === undefined) return;

    let left = touch.clientX - containerBox.left;
    let top = touch.clientY - containerBox.top;
    const isTouch = e?.touches?.length > 0 || e?.changedTouches?.length > 0;
    if (isTouch && this.config.sparkline.show.chart_type === 'radial_barcode') {
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

  updateTooltipContentDom() {
    const tooltip = this.elements.tooltip;

    if (!tooltip) return;

    const title = this.elements.tooltipTitle;
    const rows = this.elements.tooltipRows;

    title.textContent = this.tooltip.title ?? '';
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

  updateActivePointer(e) {
    this.pointerEvent = e;

    if (this.config.sparkline.show.chart_type === 'state_bands') {
      const pointerX = this.pointToGraphX(this.mouseEventToPoint(e));
      const segment = this.Graph.stateBandSegments.find((stateBand) => pointerX >= stateBand.x && pointerX <= stateBand.x + stateBand.width);

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

  updateTooltipFromPointer(e) {
    const pointerX = this.pointToGraphX(this.mouseEventToPoint(e));
    const pointIndex = this.getPointIndexFromX(pointerX);

    if (pointIndex === undefined) {
      this.clearTooltip();
      return;
    }

    this.updateTooltipFromPointIndex(pointIndex, e);
  }

  updateRadialActivePointer(e) {
    const pointIndex = this.getRadialBarcodePointIndexFromEvent(e);

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
      left: svgBox.left - this.elements.containerRect.left + this.Graph.drawArea.x * scaleX,
      top: svgBox.top - this.elements.containerRect.top + this.Graph.drawArea.y * scaleY,
      right: svgBox.left - this.elements.containerRect.left + (this.Graph.drawArea.x + this.Graph.drawArea.width) * scaleX,
      bottom: svgBox.top - this.elements.containerRect.top + (this.Graph.drawArea.y + this.Graph.drawArea.height) * scaleY,
    };
    this.updateTooltipFromRadialBarcode(pointIndex, e);
  }

  /**
   * Attaches the proven slider pointer handlers to the sparkline SVG after Lit
   * has rendered the element.
   */

  firstUpdatedFromSliderExample(changedProperties) {
    // const thisValue = this;
    this.labelValue = this._stateValue;

    // function Frame() {
    //   thisValue.rid = window.requestAnimationFrame(Frame);
    //   thisValue.updateValue(thisValue, thisValue.m);
    //   thisValue.updateThumb(thisValue, thisValue.m);
    //   thisValue.updateActiveTrack(thisValue, thisValue.m);
    // }

    function Frame2() {
      this.rid = window.requestAnimationFrame(Frame2);
      this.updateValue(this, this.m);
      this.updateThumb(this, this.m);
      this.updateActiveTrack(this, this.m);
    }

    function pointerMove(e) {
      let scaleValue;

      e.preventDefault();

      if (this.dragging) {
        this.m = this.mouseEventToPoint(e);

        switch (this.config.position.orientation) {
          case 'horizontal':
            scaleValue = this.svgCoordinateToSliderValue(this, this.m);
            this.m.x = this.valueToSvg(this, scaleValue);
            this.m.x = Math.max(this.svg.scale.min, Math.min(this.m.x, this.svg.scale.max));
            this.m.x = Math.round(this.m.x / this.svg.scale.step) * this.svg.scale.step;
            break;

          case 'vertical':
            scaleValue = this.svgCoordinateToSliderValue(this, this.m);
            this.m.y = this.valueToSvg(this, scaleValue);
            this.m.y = Math.round(this.m.y / this.svg.scale.step) * this.svg.scale.step;
            break;

          default:
        }
      }
    }

    if (this.dev.debug) console.log('slider - firstUpdated');
    this.elements = {};
    this.elements.svg = this._card.shadowRoot.getElementById('rangeslider-'.concat(this.toolId));
    this.elements.capture = this.elements.svg.querySelector('#capture');
    this.elements.track = this.elements.svg.querySelector('#rs-track');
    this.elements.activeTrack = this.elements.svg.querySelector('#active-track');
    this.elements.thumbGroup = this.elements.svg.querySelector('#rs-thumb-group');
    this.elements.thumb = this.elements.svg.querySelector('#rs-thumb');
    this.elements.label = this.elements.svg.querySelector('#rs-label tspan');

    if (this.dev.debug) console.log('slider - firstUpdated svg = ', this.elements.svg, 'path=', this.elements.path, 'thumb=', this.elements.thumb, 'label=', this.elements.label, 'text=', this.elements.text);

    function pointerDown(e) {
      e.preventDefault();

      // @NTS: Keep this comment for later!!
      // Safari: We use mouse stuff for pointerdown, but have to use pointer stuff to make sliding work on Safari. WHY??
      window.addEventListener('pointermove', pointerMove.bind(this), false);
      // eslint-disable-next-line no-use-before-define
      window.addEventListener('pointerup', pointerUp.bind(this), false);

      // @NTS: Keep this comment for later!!
      // Below lines prevent slider working on Safari...
      //
      // window.addEventListener('mousemove', pointerMove.bind(this), false);
      // window.addEventListener('touchmove', pointerMove.bind(this), false);
      // window.addEventListener('mouseup', pointerUp.bind(this), false);
      // window.addEventListener('touchend', pointerUp.bind(this), false);

      const mousePos = this.mouseEventToPoint(e);
      const thumbPos = this.svg.thumb.x1 + this.svg.thumb.cx;
      if (mousePos.x > thumbPos - 10 && mousePos.x < thumbPos + this.svg.thumb.width + 10) {
        // fireEvent(window, 'haptic', 'heavy');
      } else {
        // fireEvent(window, 'haptic', 'error');
        return;
      }

      // User is dragging the thumb of the slider!
      this.dragging = true;

      // Check for drag_action. If none specified, or update_interval = 0, don't update while dragging...

      if (this.config.user_actions?.drag_action && this.config.user_actions?.drag_action.update_interval) {
        if (this.config.user_actions.drag_action.update_interval > 0) {
          this.timeOutId = setTimeout(() => this.callDragService(), this.config.user_actions.drag_action.update_interval);
        } else {
          this.timeOutId = null;
        }
      }
      this.m = this.mouseEventToPoint(e);

      if (this.config.position.orientation === 'horizontal') {
        this.m.x = Math.round(this.m.x / this.svg.scale.step) * this.svg.scale.step;
      } else {
        this.m.y = Math.round(this.m.y / this.svg.scale.step) * this.svg.scale.step;
      }
      if (this.dev.debug) console.log('pointerDOWN', Math.round(this.m.x * 100) / 100);
    }

    function pointerUp(e) {
      e.preventDefault();

      // @NTS: Keep this comment for later!!
      // Safari: Fixes unable to grab pointer
      window.removeEventListener('pointermove', pointerMove.bind(this), false);
      window.removeEventListener('pointerup', pointerUp.bind(this), false);

      window.removeEventListener('mousemove', pointerMove.bind(this), false);
      window.removeEventListener('touchmove', pointerMove.bind(this), false);
      window.removeEventListener('mouseup', pointerUp.bind(this), false);
      window.removeEventListener('touchend', pointerUp.bind(this), false);

      if (!this.dragging) return;

      this.dragging = false;
      clearTimeout(this.timeOutId);
      this.target = 0;
      if (this.dev.debug) console.log('pointerUP');
      this.callTapService();
    }

    // @NTS: Keep this comment for later!!
    // For things to work in Safari, we need separate touch and mouse down handlers...
    // DON't ask WHY! The pointerdown method prevents listening on window events later on.
    // ie, we can't move our finger

    // this.elements.svg.addEventListener("pointerdown", pointerDown.bind(this), false);

    this.elements.svg.addEventListener('touchstart', pointerDown.bind(this), false);
    this.elements.svg.addEventListener('mousedown', pointerDown.bind(this), false);
  }

  attachPointerHandlers() {
    this.elements.svg = this.card.shadowRoot.getElementById(`sparkline-${this.cardId}-${this.index}`);
    this.elements.container = this.card.shadowRoot.getElementById('container');
    this.elements.activeIndicator = this.card.shadowRoot.getElementById(`sparkline-active-indicator-${this.cardId}-${this.index}`);
    this.elements.tooltip = this.card.shadowRoot.getElementById(`sparkline-tooltip-${this.cardId}-${this.index}`);
    this.elements.tooltipTitle = this.elements.tooltip.querySelector('.sparkline-tooltip__title');
    this.elements.tooltipRows = this.elements.tooltip.querySelectorAll('.sparkline-tooltip__row');
    this.elements.containerRect = this.elements.container.getBoundingClientRect();

    if (!this.elements.svg || this.elements.svg.dataset.pointerReady === 'true') return;

    const isRadialBarcode = this.config.sparkline.show.chart_type === 'radial_barcode';

    this.elements.svg.dataset.pointerReady = 'true';

    // 1. INLINE INSTANCE HANDLERS (Your lazy-allocation pattern)
    this.Frame2 =
      this.Frame2 ||
      function Frame2() {
        this.rid = null;
        if (isRadialBarcode) {
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
          // const hoverPaddingX = isRadialBarcode ? 0 : this.Graph.coords.length > 1 ? ((this.Graph.coords - this.Graph.coords) * scaleX) / 2 : 12;
          // FIXED: Restored your exact original array coordinate lookups ([1][0] and [0][0])
          const hoverPaddingX = isRadialBarcode ? 0 : this.Graph.coords.length > 1 ? ((this.Graph.coords[1][0] - this.Graph.coords[0][0]) * scaleX) / 2 : 12;
          this.elements.tooltipBounds = {
            left: svgBox.left - this.elements.containerRect.left + this.Graph.drawArea.x * scaleX - hoverPaddingX,
            top: svgBox.top - this.elements.containerRect.top + this.Graph.drawArea.y * scaleY,
            right: svgBox.left - this.elements.containerRect.left + (this.Graph.drawArea.x + this.Graph.drawArea.width) * scaleX + hoverPaddingX,
            bottom: svgBox.top - this.elements.containerRect.top + (this.Graph.drawArea.y + this.Graph.drawArea.height) * scaleY,
          };
        }

        if (isRadialBarcode) {
          // console.log('[hoverMove] - isRadialBarcode -', e);
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
        if (isRadialBarcode) {
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

        if (isRadialBarcode) {
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

        if (isRadialBarcode) {
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

  attachPointerHandlersV4() {
    this.elements.svg = this.card.shadowRoot.getElementById(`sparkline-${this.cardId}-${this.index}`);
    this.elements.container = this.card.shadowRoot.getElementById('container');
    this.elements.activeIndicator = this.card.shadowRoot.getElementById(`sparkline-active-indicator-${this.cardId}-${this.index}`);
    this.elements.tooltip = this.card.shadowRoot.getElementById(`sparkline-tooltip-${this.cardId}-${this.index}`);
    this.elements.tooltipTitle = this.elements.tooltip.querySelector('.sparkline-tooltip__title');
    this.elements.tooltipRows = this.elements.tooltip.querySelectorAll('.sparkline-tooltip__row');
    this.elements.containerRect = this.elements.container.getBoundingClientRect();

    if (!this.elements.svg || this.elements.svg.dataset.pointerReady === 'true') return;

    const isRadialBarcode = this.config.sparkline.show.chart_type === 'radial_barcode';

    function Frame2() {
      this.rid = null;
      if (isRadialBarcode) {
        this.updateRadialActivePointer(this.pointerEvent);
      } else {
        this.updateActivePointer(this.pointerEvent);
      }
    }

    function pointerMove(e) {
      e.preventDefault();
      console.log('[pointerMove]', e);

      if (this.dragging) {
        this.pointerEvent = e;
        if (!this.rid) this.rid = window.requestAnimationFrame(Frame2.bind(this));
      }
    }

    function hoverEnter(e) {
      const pointIndex = Number(e.currentTarget?.dataset?.pointIndex);
      console.log('[hoverEnter] - e, pointIndex', e, pointIndex);
      this.pointerEvent = e;
      this.activeX = undefined;
      this._radialPendingLeave = false;
      this._radialPendingPointIndex = pointIndex;
      this._radialPendingEvent = e;
      this.scheduleRadialHoverFrame();
    }

    function hoverMove(e) {
      if (this.dragging) return;

      console.log('[hoverMove]', e);

      if (!this.hovering) {
        this.hovering = true;
        this.elements.containerRect = this.elements.container.getBoundingClientRect();
        const svgBox = this.elements.svg.getBoundingClientRect();
        const scaleX = svgBox.width / this.svg.width;
        const scaleY = svgBox.height / this.svg.height;
        const hoverPaddingX = isRadialBarcode ? 0 : this.Graph.coords.length > 1 ? ((this.Graph.coords - this.Graph.coords) * scaleX) / 2 : 12;
        this.elements.tooltipBounds = {
          left: svgBox.left - this.elements.containerRect.left + this.Graph.drawArea.x * scaleX - hoverPaddingX,
          top: svgBox.top - this.elements.containerRect.top + this.Graph.drawArea.y * scaleY,
          right: svgBox.left - this.elements.containerRect.left + (this.Graph.drawArea.x + this.Graph.drawArea.width) * scaleX + hoverPaddingX,
          bottom: svgBox.top - this.elements.containerRect.top + (this.Graph.drawArea.y + this.Graph.drawArea.height) * scaleY,
        };
      }

      if (isRadialBarcode) {
        console.log('[hoverMove] - isRadialBarcode -', e);
        this.updateRadialActivePointer(e);
      } else {
        this.updateActivePointer(e);
      }
    }

    function hoverLeave(e) {
      if (this.dragging) return;
      console.log('[hoverLeave]', e);

      this.hovering = false;
      this.pointerEvent = undefined;
      this.activeX = undefined;
      this.clearTooltip();
      this.updateTooltipVisibilityDom(false);
      this.updateActiveIndicatorDom();
    }

    function barCodeLeave(e) {
      if (this.dragging) return;
      console.log('[barCodeLeave]', e);

      this.hovering = false;
      this.pointerEvent = undefined;
      this.activeX = undefined;
      this.clearTooltip();
      this.restoreRadialActiveBinDom();
    }

    function pointerDown(e) {
      e.preventDefault();
      console.log('[pointerDown]', e);

      // @NTS: Keep this comment for later!!
      // Safari: We use mouse stuff for pointerdown, but have to use pointer stuff to make sliding work on Safari. WHY??
      window.addEventListener('pointermove', pointerMove.bind(this), false);
      // eslint-disable-next-line no-use-before-define
      window.addEventListener('pointerup', pointerUp.bind(this), false);

      this.dragging = true;
      this.pointerEvent = e;
      this.elements.containerRect = this.elements.container.getBoundingClientRect();
      if (isRadialBarcode) {
        this.updateRadialActivePointer(e);
      } else {
        this.updateActivePointer(e);
      }
      this.updateTooltipVisibilityDom(true);
      this.updateActiveIndicatorDom();
      Frame2.call(this);
    }

    function pointerUp(e) {
      e.preventDefault();
      console.log('[pointerUp]', e);

      // @NTS: Keep this comment for later!!
      // Safari: Fixes unable to grab pointer
      window.removeEventListener('pointermove', pointerMove.bind(this), false);
      window.removeEventListener('pointerup', pointerUp.bind(this), false);

      if (!this.dragging) return;

      this.dragging = false;
      this.activeX = undefined;
      this.pointerEvent = undefined;
      this.rid = null;
      this.clearTooltip();
      this.updateTooltipVisibilityDom(false);
      this.updateActiveIndicatorDom();
      this.elements.containerRect = undefined;

      // FIXED FOR MOBILE TOUCH RELEASES:
      // Since mobile touches now resolve through the global window pointerup loop,
      // we must explicitly trigger the radial bin restoration here as well.
      if (isRadialBarcode) {
        this.restoreRadialActiveBinDom();
      }
      Frame2.call(this);
    }

    function touchStart(e) {
      e.preventDefault();
      console.log('[touchStart]', e);

      // FIXED BY UNCOMMENTING SAFARI'S UNIFIED POINTER SLIDER INTERACTION:
      // Activating the global pointer tracking loops during a mobile touch initiation
      // forces Webkit to treat the finger trace like an un-captured desktop mouse layout,
      // letting the coordinates expand cleanly past the web component limits.
      window.addEventListener('pointermove', pointerMove.bind(this), false);
      window.addEventListener('pointerup', pointerUp.bind(this), false);

      this.dragging = true;
      this.pointerEvent = e;
      this.elements.containerRect = this.elements.container.getBoundingClientRect();

      if (isRadialBarcode) {
        this.updateRadialActivePointer(e);
      } else {
        this.updateActivePointer(e);
      }
      this.updateTooltipVisibilityDom(true);
      this.updateActiveIndicatorDom();
      Frame2.call(this);
    }

    function mouseDown(e) {
      pointerDown.call(this, e);
    }

    // Core element registrations preserved in their exact original states
    this.elements.svg.addEventListener('mousedown', mouseDown.bind(this), false);
    this.elements.svg.addEventListener('touchstart', touchStart.bind(this), { passive: false });

    this.elements.svg.addEventListener('mousemove', hoverMove.bind(this), false);
    this.elements.svg.addEventListener('mouseenter', hoverEnter.bind(this), false);
    this.elements.svg.addEventListener('mouseleave', barCodeLeave.bind(this), false);
    this.elements.svg.addEventListener('mouseleave', hoverLeave.bind(this), false);
  }

  attachPointerHandlersV3() {
    this.elements.svg = this.card.shadowRoot.getElementById(`sparkline-${this.cardId}-${this.index}`);
    this.elements.container = this.card.shadowRoot.getElementById('container');
    this.elements.activeIndicator = this.card.shadowRoot.getElementById(`sparkline-active-indicator-${this.cardId}-${this.index}`);
    this.elements.tooltip = this.card.shadowRoot.getElementById(`sparkline-tooltip-${this.cardId}-${this.index}`);
    this.elements.tooltipTitle = this.elements.tooltip.querySelector('.sparkline-tooltip__title');
    this.elements.tooltipRows = this.elements.tooltip.querySelectorAll('.sparkline-tooltip__row');
    this.elements.containerRect = this.elements.container.getBoundingClientRect();

    if (!this.elements.svg || this.elements.svg.dataset.pointerReady === 'true') return;

    const isRadialBarcode = this.config.sparkline.show.chart_type === 'radial_barcode';

    function Frame2() {
      this.rid = null;
      if (isRadialBarcode) {
        this.updateRadialActivePointer(this.pointerEvent);
      } else {
        this.updateActivePointer(this.pointerEvent);
      }
    }

    function pointerMove(e) {
      e.preventDefault();
      console.log('[pointerMove]', e);

      if (this.dragging) {
        this.pointerEvent = e;
        if (!this.rid) this.rid = window.requestAnimationFrame(Frame2.bind(this));
      }
    }

    function hoverEnter(e) {
      const pointIndex = Number(e.currentTarget?.dataset?.pointIndex);
      console.log('[hoverEnter] - e, pointIndex', e, pointIndex);
      this.pointerEvent = e;
      this.activeX = undefined;
      this._radialPendingLeave = false;
      this._radialPendingPointIndex = pointIndex;
      this._radialPendingEvent = e;
      this.scheduleRadialHoverFrame();
    }

    function hoverMove(e) {
      if (this.dragging) return;

      console.log('[hoverMove]', e);

      if (!this.hovering) {
        this.hovering = true;
        this.elements.containerRect = this.elements.container.getBoundingClientRect();
        const svgBox = this.elements.svg.getBoundingClientRect();
        const scaleX = svgBox.width / this.svg.width;
        const scaleY = svgBox.height / this.svg.height;
        const hoverPaddingX = isRadialBarcode ? 0 : this.Graph.coords.length > 1 ? ((this.Graph.coords[1][0] - this.Graph.coords[0][0]) * scaleX) / 2 : 12;
        this.elements.tooltipBounds = {
          left: svgBox.left - this.elements.containerRect.left + this.Graph.drawArea.x * scaleX - hoverPaddingX,
          top: svgBox.top - this.elements.containerRect.top + this.Graph.drawArea.y * scaleY,
          right: svgBox.left - this.elements.containerRect.left + (this.Graph.drawArea.x + this.Graph.drawArea.width) * scaleX + hoverPaddingX,
          bottom: svgBox.top - this.elements.containerRect.top + (this.Graph.drawArea.y + this.Graph.drawArea.height) * scaleY,
        };
      }

      if (isRadialBarcode) {
        console.log('[hoverMove] - isRadialBarcode -', e);
        this.updateRadialActivePointer(e);
      } else {
        this.updateActivePointer(e);
      }
    }

    function hoverLeave(e) {
      if (this.dragging) return;
      console.log('[hoverLeave]', e);

      this.hovering = false;
      this.pointerEvent = undefined;
      this.activeX = undefined;
      this.clearTooltip();
      this.updateTooltipVisibilityDom(false);
      this.updateActiveIndicatorDom();
    }

    function barCodeLeave(e) {
      if (this.dragging) return;
      console.log('[barCodeLeave]', e);

      this.hovering = false;
      this.pointerEvent = undefined;
      this.activeX = undefined;
      this.clearTooltip();
      this.restoreRadialActiveBinDom();
    }

    function pointerDown(e) {
      e.preventDefault();
      console.log('[pointerDown]', e);

      // @NTS: Keep this comment for later!!
      // Safari: We use mouse stuff for pointerdown, but have to use pointer stuff to make sliding work on Safari. WHY??
      window.addEventListener('pointermove', pointerMove.bind(this), false);
      // eslint-disable-next-line no-use-before-define
      window.addEventListener('pointerup', pointerUp.bind(this), false);

      this.dragging = true;
      this.pointerEvent = e;
      this.elements.containerRect = this.elements.container.getBoundingClientRect();
      if (isRadialBarcode) {
        this.updateRadialActivePointer(e);
      } else {
        this.updateActivePointer(e);
      }
      this.updateTooltipVisibilityDom(true);
      this.updateActiveIndicatorDom();
      Frame2.call(this);
    }

    function pointerUp(e) {
      e.preventDefault();
      console.log('[pointerUp]', e);

      // @NTS: Keep this comment for later!!
      // Safari: Fixes unable to grab pointer
      window.removeEventListener('pointermove', pointerMove.bind(this), false);
      window.removeEventListener('pointerup', pointerUp.bind(this), false);

      window.removeEventListener('mousemove', pointerMove.bind(this), false);
      window.removeEventListener('touchmove', pointerMove.bind(this), false);
      window.removeEventListener('mouseup', pointerUp.bind(this), false);
      window.removeEventListener('touchend', pointerUp.bind(this), false);

      if (!this.dragging) return;

      this.dragging = false;
      this.activeX = undefined;
      this.pointerEvent = undefined;
      this.rid = null;
      this.clearTooltip();
      this.updateTooltipVisibilityDom(false);
      this.updateActiveIndicatorDom();
      this.elements.containerRect = undefined;
      Frame2.call(this);
    }

    function touchStart(e) {
      e.preventDefault();
      console.log('[touchStart]', e);

      // FIXED FOR MOBILE SAFARI DRAWS OUTSIDE THE SVG:
      // Mobile Safari locks touches exclusively to the element where the touch gesture started.
      // Listening on 'window' will fail to stream events once your finger leaves the layout borders.
      // We store the bound instances cleanly on the class structure so we can unbind them accurately.
      // eslint-disable-next-line no-use-before-define
      this._touchMoveInstance = touchMove.bind(this);
      // eslint-disable-next-line no-use-before-define
      this._touchEndInstance = touchEndCleanup.bind(this);

      this.elements.svg.addEventListener('touchmove', this._touchMoveInstance, { passive: false });
      this.elements.svg.addEventListener('touchend', this._touchEndInstance, false);

      this.dragging = true;
      this.pointerEvent = e;
      this.elements.containerRect = this.elements.container.getBoundingClientRect();

      // Execute your original configuration hooks with the accurate execution scope
      hoverEnter.call(this, e);
    }

    function mouseDown(e) {
      pointerDown.call(this, e);
    }

    function touchMove(e) {
      // Mobile Safari Optimization: Stop the background document from scrolling
      // while the user is actively scanning across the barcode elements.
      if (e.type === 'touchmove') {
        e.preventDefault();
      }

      if (isRadialBarcode) {
        // console.log('[touchMove] - isRadialBarcode -', e);
        this.updateRadialActivePointer(e);
      } else {
        this.updateActivePointer(e);
      }
    }

    function touchEndCleanup(e) {
      // Clean up the dynamic mobile touch handlers from the SVG node safely
      this.elements.svg.removeEventListener('touchmove', this._touchMoveInstance, { passive: false });
      this.elements.svg.removeEventListener('touchend', this._touchEndInstance, false);

      // Route straight to your original barCodeLeave logic to trigger resets
      barCodeLeave.call(this, e);

      // Force dragging state down to match pointerUp workflow
      this.dragging = false;
      Frame2.call(this);
    }

    // @NTS: Keep this comment for later!!
    // For things to work in Safari, we need separate touch and mouse down handler
    this.elements.svg.addEventListener('mousedown', mouseDown.bind(this), false);
    this.elements.svg.addEventListener('touchstart', touchStart.bind(this), { passive: false });

    this.elements.svg.addEventListener('mousemove', hoverMove.bind(this), false);
    this.elements.svg.addEventListener('mouseenter', hoverEnter.bind(this), false);
    this.elements.svg.addEventListener('mouseleave', barCodeLeave.bind(this), false);
    this.elements.svg.addEventListener('mouseleave', hoverLeave.bind(this), false);
  }

  attachPointerHandlersV2() {
    this.elements.svg = this.card.shadowRoot.getElementById(`sparkline-${this.cardId}-${this.index}`);
    this.elements.container = this.card.shadowRoot.getElementById('container');
    this.elements.activeIndicator = this.card.shadowRoot.getElementById(`sparkline-active-indicator-${this.cardId}-${this.index}`);
    this.elements.tooltip = this.card.shadowRoot.getElementById(`sparkline-tooltip-${this.cardId}-${this.index}`);
    this.elements.tooltipTitle = this.elements.tooltip.querySelector('.sparkline-tooltip__title');
    this.elements.tooltipRows = this.elements.tooltip.querySelectorAll('.sparkline-tooltip__row');
    this.elements.containerRect = this.elements.container.getBoundingClientRect();

    if (!this.elements.svg || this.elements.svg.dataset.pointerReady === 'true') return;

    const isRadialBarcode = this.config.sparkline.show.chart_type === 'radial_barcode';

    function Frame2() {
      this.rid = null;
      if (isRadialBarcode) {
        this.updateRadialActivePointer(this.pointerEvent);
      } else {
        this.updateActivePointer(this.pointerEvent);
      }
    }

    function pointerMove(e) {
      e.preventDefault();
      console.log('[pointerMove]', e);

      if (this.dragging) {
        this.pointerEvent = e;
        if (!this.rid) this.rid = window.requestAnimationFrame(Frame2.bind(this));
      }
    }

    function hoverEnter(e) {
      const pointIndex = Number(e.currentTarget?.dataset?.pointIndex);
      console.log('[hoverEnter] - e, pointIndex', e, pointIndex);
      this.pointerEvent = e;
      this.activeX = undefined;
      this._radialPendingLeave = false;
      this._radialPendingPointIndex = pointIndex;
      this._radialPendingEvent = e;
      this.scheduleRadialHoverFrame();
    }

    function hoverMove(e) {
      if (this.dragging) return;

      console.log('[hoverMove]', e);

      if (!this.hovering) {
        this.hovering = true;
        this.elements.containerRect = this.elements.container.getBoundingClientRect();
        const svgBox = this.elements.svg.getBoundingClientRect();
        const scaleX = svgBox.width / this.svg.width;
        const scaleY = svgBox.height / this.svg.height;
        const hoverPaddingX = isRadialBarcode ? 0 : this.Graph.coords.length > 1 ? ((this.Graph.coords[1][0] - this.Graph.coords[0][0]) * scaleX) / 2 : 12;
        this.elements.tooltipBounds = {
          left: svgBox.left - this.elements.containerRect.left + this.Graph.drawArea.x * scaleX - hoverPaddingX,
          top: svgBox.top - this.elements.containerRect.top + this.Graph.drawArea.y * scaleY,
          right: svgBox.left - this.elements.containerRect.left + (this.Graph.drawArea.x + this.Graph.drawArea.width) * scaleX + hoverPaddingX,
          bottom: svgBox.top - this.elements.containerRect.top + (this.Graph.drawArea.y + this.Graph.drawArea.height) * scaleY,
        };
      }

      if (isRadialBarcode) {
        // console.log('[hoverMove] - isRadialBarcode -', e);
        this.updateRadialActivePointer(e);
      } else {
        this.updateActivePointer(e);
      }
    }

    function hoverLeave(e) {
      if (this.dragging) return;
      console.log('[hoverLeave]', e);

      this.hovering = false;
      this.pointerEvent = undefined;
      this.activeX = undefined;
      this.clearTooltip();
      this.updateTooltipVisibilityDom(false);
      this.updateActiveIndicatorDom();
    }

    function barCodeLeave(e) {
      if (this.dragging) return;
      console.log('[barCodeLeave]', e);

      this.hovering = false;
      this.pointerEvent = undefined;
      this.activeX = undefined;
      this.clearTooltip();
      this.restoreRadialActiveBinDom();
    }

    function pointerDown(e) {
      e.preventDefault();
      console.log('[pointerDown]', e);

      // @NTS: Keep this comment for later!!
      // Safari: We use mouse stuff for pointerdown, but have to use pointer stuff to make sliding work on Safari. WHY??
      window.addEventListener('pointermove', pointerMove.bind(this), false);
      // eslint-disable-next-line no-use-before-define
      window.addEventListener('pointerup', pointerUp.bind(this), false);

      // @NTS: Keep this comment for later!!
      // Below lines prevent slider working on Safari...
      //
      // window.addEventListener('mousemove', pointerMove.bind(this), false);
      // window.addEventListener('touchmove', pointerMove.bind(this), false);
      // window.addEventListener('mouseup', pointerUp.bind(this), false);
      // window.addEventListener('touchend', pointerUp.bind(this), false);

      this.dragging = true;
      this.pointerEvent = e;
      this.elements.containerRect = this.elements.container.getBoundingClientRect();
      if (isRadialBarcode) {
        this.updateRadialActivePointer(e);
      } else {
        this.updateActivePointer(e);
      }
      this.updateTooltipVisibilityDom(true);
      this.updateActiveIndicatorDom();
      Frame2.call(this);
    }

    function pointerUp(e) {
      e.preventDefault();
      console.log('[pointerUp]', e);

      // @NTS: Keep this comment for later!!
      // Safari: Fixes unable to grab pointer
      window.removeEventListener('pointermove', pointerMove.bind(this), false);
      window.removeEventListener('pointerup', pointerUp.bind(this), false);

      window.removeEventListener('mousemove', pointerMove.bind(this), false);
      window.removeEventListener('touchmove', pointerMove.bind(this), false);
      window.removeEventListener('mouseup', pointerUp.bind(this), false);
      window.removeEventListener('touchend', pointerUp.bind(this), false);

      if (!this.dragging) return;

      this.dragging = false;
      this.activeX = undefined;
      this.pointerEvent = undefined;
      this.rid = null;
      this.clearTooltip();
      this.updateTooltipVisibilityDom(false);
      this.updateActiveIndicatorDom();
      this.elements.containerRect = undefined;
      Frame2.call(this);
    }

    function touchStart(e) {
      e.preventDefault();
      console.log('[touchStart]', e);

      // @NTS: Keep this comment for later!!
      // Safari: We use mouse stuff for pointerdown, but have to use pointer stuff to make sliding work on Safari. WHY??
      window.addEventListener('pointermove', pointerMove.bind(this), false);
      // eslint-disable-next-line no-use-before-define
      window.addEventListener('pointerup', pointerUp.bind(this), false);
      // eslint-disable-next-line no-use-before-define
      window.addEventListener('touchmove', touchMove.bind(this), { passive: false });
      // eslint-disable-next-line no-use-before-define
      // this.elements.svg.addEventListener('touchmove', touchMove.bind(this), { passive: false });
      window.addEventListener('touchend', barCodeLeave.bind(this), false);

      // @NTS: Keep this comment for later!!
      // Below lines prevent slider working on Safari...
      //
      // window.addEventListener('mousemove', pointerMove.bind(this), false);
      // window.addEventListener('touchmove', pointerMove.bind(this), false);
      // window.addEventListener('mouseup', pointerUp.bind(this), false);
      // window.addEventListener('touchend', pointerUp.bind(this), false);

      this.dragging = true;
      this.pointerEvent = e;
      this.elements.containerRect = this.elements.container.getBoundingClientRect();

      hoverEnter.call(e);
      // pointerDown.call(e);
    }

    function mouseDown(e) {
      pointerDown.call(e);
    }

    function touchMove(e) {
      // Mobile Safari Optimization: Stop the background document from scrolling
      // while the user is actively scanning across the barcode elements.
      if (e.type === 'touchmove') {
        e.preventDefault();
      }

      if (isRadialBarcode) {
        // console.log('[touchMove] - isRadialBarcode -', e);
        this.updateRadialActivePointer(e);
      } else {
        this.updateActivePointer(e);
      }
    }
    // @NTS: Keep this comment for later!!
    // For things to work in Safari, we need separate touch and mouse down handlers...
    // DON't ask WHY! The pointerdown method prevents listening on window events later on.
    // ie, we can't move our finger

    // this.elements.svg.addEventListener("pointerdown", pointerDown.bind(this), false);

    if (['line', 'area', 'dots', 'bar', 'barcode'].includes(this.config.sparkline.show.chart_type)) {
      // this.elements.svg.addEventListener('touchstart', pointerDown.bind(this), false);
      this.elements.svg.addEventListener('touchstart', touchStart.bind(this), false);
      this.elements.svg.addEventListener('mousedown', mouseDown.bind(this), false);
      // this.elements.svg.addEventListener('mousemove', pointerMove.bind(this), false);

      this.elements.svg.addEventListener('mouseenter', hoverEnter.bind(this), false);
      this.elements.svg.addEventListener('mousemove', hoverMove.bind(this), false);
      this.elements.svg.addEventListener('mouseleave', hoverLeave.bind(this), false);

      this.elements.container.addEventListener('mousemove', hoverMove.bind(this), false);
      this.elements.container.addEventListener('mouseleave', hoverLeave.bind(this), false);
    } else if (['radial_barcode'].includes(this.config.sparkline.show.chart_type)) {
      // Catch touch and mousedown events to start 'hover' on mobile
      this.elements.svg.addEventListener('touchstart', touchStart.bind(this), false);
      this.elements.svg.addEventListener('mousedown', mouseDown.bind(this), false);
      // this.elements.svg.addEventListener('touchmove', touchMove.bind(this), { passive: false });
      // this.elements.svg.addEventListener('touchend', barCodeLeave.bind(this), false);

      // getRadialBarcodePointIndexFromEvent

      // Catch hover eents to start 'hover' on desktop
      this.elements.svg.addEventListener('mouseenter', hoverEnter.bind(this), false);
      this.elements.svg.addEventListener('mouseleave', barCodeLeave.bind(this), false);
      this.elements.svg.addEventListener('mouseleave', hoverLeave.bind(this), false);
      this.elements.svg.addEventListener('mousemove', hoverMove.bind(this), false);

      // Again: next part is for desktop using 'hover'
      // Connect to both the foreground and background parts. The top bin will respond to the eventlistener
      // this.elements.svg.querySelectorAll('.sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin').forEach((bin) => {
      //   bin.addEventListener('mouseenter', hoverEnter.bind(this), false);
      //   // bin.addEventListener('mousemove', hoverMove.bind(this), false);
      //   bin.addEventListener('mouseleave', hoverLeave.bind(this), false);
      // });
    }
    this.elements.svg.dataset.pointerReady = 'true';
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
    const yZero = this.Graph.min >= 0 ? 0 : (Math.abs(this.Graph.min) / (this.Graph.max - this.Graph.min)) * 100;

    return svg`
      <linearGradient id=${`fill-grad-pos-${this.cardId}-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='0.1'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-pos-${this.cardId}-${i}`}>
        <rect width="100%" height="${100 - yZero}%" fill=${`url(#fill-grad-pos-${this.cardId}-${i})`}
         />
      </mask>
      <linearGradient id=${`fill-grad-neg-${this.cardId}-${i}`} x1="0%" y1="100%" x2="0%" y2="0%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='0.1'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-neg-${this.cardId}-${i}`}>
        <rect width="100%" y=${100 - yZero}% height="${yZero}%" fill=${`url(#fill-grad-neg-${this.cardId}-${i})`}
         />
      </mask>

    <mask id=${`fill-${this.cardId}-${i}`}>
      <path class='fill'
        type=${this.config.sparkline.show.fill}
        .id=${i} anim=${this.config.sparkline.animate} ?init=${init}
        style="animation-delay: ${this.config.sparkline.animate ? `${i * 0.5}s` : '0s'}"
        fill='white'
        mask=${fade ? `url(#fill-grad-mask-pos-${this.cardId}-${i})` : ''}
        d=${fill}
      />
      ${
        this.Graph.min < 0
          ? svg`<path class='fill'
            type=${this.config.sparkline.show.fill}
            .id=${i} anim=${this.config.sparkline.animate} ?init=${init}
            style="animation-delay: ${this.config.sparkline.animate ? `${i * 0.5}s` : '0s'}"
            fill='white'
            mask=${fade ? `url(#fill-grad-mask-neg-${this.cardId}-${i})` : ''}
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
        width="${this.svg.width}"
        height="${this.svg.height}"
        style=${styleMap(this.getRenderStyles(backgroundStyles))}
        mask="url(#fill-${this.cardId}-${i})"
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
      <mask id=${`fillMinMax-${this.cardId}-${i}`}>
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
        width="${this.svg.width}"
        height="${this.svg.height}"
        style=${styleMap(this.getRenderStyles(backgroundStyles))}
        mask="url(#fillMinMax-${this.cardId}-${i})"
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
    if (!line) return '';

    const lineStyles = this.getLineStyles();

    return svg`
      <mask id="sparkline-line-${this.cardId}-${i}">
        <path
          class="sparkline-line-mask"
          fill="none"
          stroke="white"
          stroke-width="${lineStyles['stroke-width']}"
          stroke-linecap="${lineStyles['stroke-linecap']}"
          stroke-linejoin="${lineStyles['stroke-linejoin']}"
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
        width="${this.svg.width}"
        height="${this.svg.height}"
        style=${styleMap(this.getRenderStyles(backgroundStyles))}
        mask="url(#sparkline-line-${this.cardId}-${i})"
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
      <mask id="sparkline-lineMinMax-${this.cardId}-${i}">
        <path
          class="sparkline-line-mask"
          fill="none"
          stroke="white"
          stroke-width="${lineStyles['stroke-width']}"
          stroke-linecap="${lineStyles['stroke-linecap']}"
          stroke-linejoin="${lineStyles['stroke-linejoin']}"
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
        width="${this.svg.width}"
        height="${this.svg.height}"
        style=${styleMap(this.getRenderStyles(backgroundStyles))}
        mask="url(#sparkline-lineMinMax-${this.cardId}-${i})"
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
    return Merge.mergeDeep(this.getStyles({ fill: 'none' }), ConfigHelper.toStyleDict(this.config.line?.styles));
  }

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
    const perfect = this.calculatePerfectXAxis(range.start, range.end, this.Graph.drawArea.width, fontWidthPixels);

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
    const perfect = this.calculatePerfectYAxis(this.Graph.min, this.Graph.max, this.Graph.drawArea.height, fontHeightPixels);

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

    this.Graph.xAxis.ticks.forEach((tick) => {
      const label = tick.isMidnight ? formatDateVeryShort(tick.time, this.card._hass.locale, this.card._hass.config) : formatTime(tick.time, this.card._hass.locale, this.card._hass.config);

      ticks.push({
        axis: 'x',
        level,
        value: tick.timestamp,
        x: tick.x,
        label,
      });
    });

    return ticks;
  }

  buildXAxisTicksV1(level) {
    const ticksize = this.xTicksizeToHours(this.config.x_axis[`ticks_${level}`].ticksize);
    const range = this.getHistoryRange();
    const tickMs = ticksize * 60 * 60 * 1000;
    const startDate = new Date(Math.floor(range.start.getTime() / tickMs) * tickMs);
    const windowHours = (range.end.getTime() - range.start.getTime()) / (60 * 60 * 1000);
    const intervalCount = Math.max(1, this.Graph.hours * this.Graph.points - 1);
    const intervalPerHour = this.Graph.points;

    const ticks = [];
    let previousTickDate = null;

    const tickCount = Math.max(1, Math.ceil(windowHours / ticksize));
    for (let tick = 0; tick < tickCount; tick += 1) {
      const hour = tick * ticksize;
      const tickDate = new Date(startDate.getTime() + hour * 60 * 60 * 1000);
      const tickIndex = hour * intervalPerHour;
      const x = this.Graph.drawArea.x + (tickIndex / intervalCount) * this.Graph.drawArea.width;
      const tickDay = tickDate.toDateString();
      const previousTickDay = previousTickDate ? previousTickDate.toDateString() : null;
      const label = hour === 0 || tickDay !== previousTickDay ? formatDateVeryShort(tickDate, this.card._hass.locale, this.card._hass.config) : formatTime(tickDate, this.card._hass.locale, this.card._hass.config);

      console.log('[buildXAxisTicks] stuff in loop: ', x, hour, tickIndex, intervalCount, tickDate, label, previousTickDate, previousTickDay, tickDay);
      ticks.push({ axis: 'x', level, value: hour, x, label });
      previousTickDate = tickDate;
    }

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
  buildYAxisTicks(level) {
    if (this.config.sparkline.show.chart_type === 'state_bands') {
      return this.Graph.yAxis.ticks.map((tick) => ({
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

    this.Graph.yAxis.ticks.forEach((tick) => {
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
  buildLabelTicks(axis) {
    const labelsAt = this.config.sparkline.show[`${axis}labels_at`];

    if (labelsAt === 'none') return [];
    return axis === 'x' ? this.buildXAxisTicks('major') : this.buildYAxisTicks('major');
  }

  /**
   * Renders the grid layer behind the graph. Grid lines are based on major
   * ticks by default, matching the horseshoe-style tick model.
   *
   * @returns {TemplateResult|string} Grid layer SVG.
   */
  renderGrid() {
    const chartAxes = CHART_AXES[this.config.sparkline.show.chart_type];
    const showX = this.config.sparkline.show.grid.x && chartAxes.x;
    const showY = this.config.sparkline.show.grid.y && chartAxes.y;
    if (!showX && !showY) return '';

    const xStyles = this.getRenderStyles(ConfigHelper.toStyleDict(this.config.x_axis.grid_major.styles));
    const yStyles = this.getRenderStyles(ConfigHelper.toStyleDict(this.config.y_axis.grid_major.styles));
    const xTicks = this.buildXAxisTicks('major');
    const yTicks =
      this.config.sparkline.show.chart_type === 'state_bands'
        ? this.Graph.yAxis.gridTicks.map((tick) => ({
            axis: 'y',
            level: 'major',
            value: tick.value,
            y: tick.y,
          }))
        : this.buildYAxisTicks('major');

    return svg`
      ${
        showX
          ? svg`<g class="sparkline-grid sparkline-grid--x" style="pointer-events:none;">
        ${xTicks.map(
          (tick) => svg`
          <line
            class="sparkline-grid-line sparkline-grid-line--x-major"
            x1="${tick.x}"
            y1="${this.Graph.drawArea.y}"
            x2="${tick.x}"
            y2="${this.Graph.drawArea.y + this.Graph.drawArea.height}"
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
            x1="${this.Graph.drawArea.x}"
            y1="${tick.y}"
            x2="${this.Graph.drawArea.x + this.Graph.drawArea.width}"
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
    const chartAxes = CHART_AXES[this.config.sparkline.show.chart_type];
    const showX = this.config.sparkline.show.axis.x && chartAxes.x;
    const showY = this.config.sparkline.show.axis.y && chartAxes.y;
    if (!showX && !showY) return '';

    const xStyles = this.getRenderStyles(ConfigHelper.toStyleDict(this.config.x_axis.axis.styles));
    const yStyles = this.getRenderStyles(ConfigHelper.toStyleDict(this.config.y_axis.axis.styles));

    return svg`
      <g class="sparkline-axis" style="pointer-events:none;">
        ${
          showX
            ? svg`<line
          class="sparkline-axis-line sparkline-axis-line--x"
          x1="${this.Graph.drawArea.x}"
          y1="${this.Graph.drawArea.y + this.Graph.drawArea.height}"
          x2="${this.Graph.drawArea.x + this.Graph.drawArea.width}"
          y2="${this.Graph.drawArea.y + this.Graph.drawArea.height}"
          style=${styleMap(xStyles)}
        ></line>`
            : ''
        }
        ${
          showY
            ? svg`<line
          class="sparkline-axis-line sparkline-axis-line--y"
          x1="${this.Graph.drawArea.x}"
          y1="${this.Graph.drawArea.y}"
          x2="${this.Graph.drawArea.x}"
          y2="${this.Graph.drawArea.y + this.Graph.drawArea.height}"
          style=${styleMap(yStyles)}
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
    const chartAxes = CHART_AXES[this.config.sparkline.show.chart_type];
    const showX = this.config.sparkline.show.tickmarks.x && chartAxes.x;
    const showY = this.config.sparkline.show.tickmarks.y && chartAxes.y;
    if (!showX && !showY) return '';

    const xTickConfig = this.config.x_axis.tickmarks_major;
    const yTickConfig = this.config.y_axis.tickmarks_major;
    const xStyles = this.getRenderStyles(ConfigHelper.toStyleDict(xTickConfig.styles));
    const yStyles = this.getRenderStyles(ConfigHelper.toStyleDict(yTickConfig.styles));
    const xTicks = this.buildXAxisTicks('major');
    const yTicks = this.buildYAxisTicks('major');
    const xTickSize = Utils.calculateSvgDimension(xTickConfig.size);
    const yTickSize = Utils.calculateSvgDimension(yTickConfig.size);

    return svg`
      ${
        showX
          ? svg`<g class="sparkline-tickmarks sparkline-tickmarks--x" style="pointer-events:none;">
        ${xTicks.map(
          (tick) => svg`
          <line
            class="sparkline-tickmark sparkline-tickmark--x-major"
            x1="${tick.x}"
            y1="${this.Graph.drawArea.y + this.Graph.drawArea.height}"
            x2="${tick.x}"
            y2="${this.Graph.drawArea.y + this.Graph.drawArea.height + xTickSize}"
            style=${styleMap(xStyles)}
          ></line>
        `,
        )}
      </g>`
          : ''
      }
      ${
        showY
          ? svg`<g class="sparkline-tickmarks sparkline-tickmarks--y" style="pointer-events:none;">
        ${yTicks.map(
          (tick) => svg`
          <line
            class="sparkline-tickmark sparkline-tickmark--y-major"
            x1="${this.Graph.drawArea.x - yTickSize}"
            y1="${tick.y}"
            x2="${this.Graph.drawArea.x}"
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
   * Renders axis labels as a separate top layer. Labels use the same tick values
   * as grid and tickmarks so the layers stay aligned.
   *
   * @returns {TemplateResult|string} Label layer SVG.
   */
  renderAxisLabels() {
    const chartAxes = CHART_AXES[this.config.sparkline.show.chart_type];
    const showX = this.config.sparkline.show.labels.x && chartAxes.x;
    const showY = this.config.sparkline.show.labels.y && chartAxes.y;
    if (!showX && !showY) return '';

    const xStyles = this.getRenderStyles(ConfigHelper.toStyleDict(this.config.x_axis.labels.styles));
    const yStyles = this.getRenderStyles(ConfigHelper.toStyleDict(this.config.y_axis.labels.styles));
    const xTicks = this.buildLabelTicks('x');
    const yTicks = this.buildLabelTicks('y');
    const xTickSize = this.config.sparkline.show.tickmarks.x && chartAxes.x ? Utils.calculateSvgDimension(this.config.x_axis.tickmarks_major.size) : 0;
    const yTickSize = this.config.sparkline.show.tickmarks.y && chartAxes.y ? Utils.calculateSvgDimension(this.config.y_axis.tickmarks_major.size) : 0;
    const stateBands = this.config.sparkline.show.chart_type === 'state_bands';

    return svg`
      ${
        showX
          ? svg`<g class="sparkline-labels sparkline-labels--x" style="pointer-events:none;">
        ${xTicks.map(
          (tick) => svg`
          <text
            class="sparkline-label sparkline-label--x"
            x="${tick.x}"
            y="${this.Graph.drawArea.y + this.Graph.drawArea.height + xTickSize + Utils.calculateSvgDimension(this.config.x_axis.labels.offset)}"
            style=${styleMap(xStyles)}
          >${tick.label}</text>
        `,
        )}
      </g>`
          : ''
      }
      ${
        showY
          ? svg`<g class="sparkline-labels sparkline-labels--y" style="pointer-events:none;">
        ${yTicks.map(
          (tick) => svg`
          <text
            class="sparkline-label sparkline-label--y"
            x="${stateBands ? this.Graph.drawArea.x + Utils.calculateSvgDimension(this.config.y_axis.labels.offset) : this.Graph.drawArea.x - yTickSize - Utils.calculateSvgDimension(this.config.y_axis.labels.offset)}"
            y="${stateBands ? tick.labelY : tick.y}"
            style=${styleMap(stateBands ? { ...yStyles, 'font-size': `${tick.fontSize}px` } : yStyles)}
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
  // renderSvgPointV1(point, i) {
  //   const color = this.computeColor(point[V], i);
  //   return svg`
  //   <circle
  //     class='line--point'
  //     ?inactive=${this.tooltip.index !== point[3]}
  //     style=${`--mcg-hover: ${color};`}
  //     stroke=${color}
  //     fill=${color}
  //     cx=${point[X]} cy=${point[Y]} r=${this.svg.line_width / 1.5}
  //     @mouseover=${(e) => this.updateTooltipFromPointIndex(point[3], e)}
  //     @mouseout=${() => this.clearTooltip()}
  //   />
  // `;
  // }

  renderSvgPoint(point, i, bucketStart) {
    const color = this.computeColor(point[V], i);
    return svg`
    <circle
      class='line--point'
      ?inactive=${this.tooltip.index !== point[3]}
      style=${`--mcg-hover: ${color};`}
      data-point-index=${point[3]}
      data-state=${point[V]}
      data-bucket-start=${bucketStart}
      data-bucket-end=${new Date(bucketStart).getTime() + (60 / this.Graph.points) * 60 * 1000}
      stroke=${color}
      fill=${color}
      cx=${point[X]} cy=${point[Y]} r=${this.svg.line_width / 1.5}
    >
      ${
        this.config.sparkline.animate && (this.config.period.type === 'real_time' || this.historySeries)
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
      ${
        this.config.sparkline.show.chart_type === 'dots'
          ? svg`
          <rect
            class='dots-hit_area'
            height=${this.Graph.height}
            width=${this.Graph.width}
            stroke-width="0"
            opacity="0"
          ></rect>
          `
          : svg``
      }
      ${points.map((point, pointIndex) => this.renderSvgPoint(point, i, this.Graph.bucketMeta[pointIndex].start.toISOString()))}
    </g>`;
  }

  renderPoints() {
    if (this.config.sparkline.show.chart_type !== 'dots' && this.config.sparkline.show.points !== true && this.config.sparkline.line?.show_dots !== true && this.config.sparkline.area?.show_dots !== true) return '';

    const points = this.Graph._calcY(this.Graph.coords).map((point, pointIndex) => [point[X], point[Y], point[V], pointIndex]);

    return this.renderSvgPoints(points, 0);
  }

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
        <div class="sparkline-tooltip__row">
          <span></span>
          <span style=${styleMap(valueCellStyles)}>
            <span></span>
            <span style=${styleMap(unitStyles)}></span>
          </span>
        </div>
        <div class="sparkline-tooltip__row">
          <span></span>
          <span style=${styleMap(valueCellStyles)}>
            <span></span>
            <span style=${styleMap(unitStyles)}></span>
          </span>
        </div>
        <div class="sparkline-tooltip__row">
          <span></span>
          <span style=${styleMap(valueCellStyles)}>
            <span></span>
            <span style=${styleMap(unitStyles)}></span>
          </span>
        </div>
      </div>
    `;
  }

  /**
   * Renders a minimal active indicator.
   * The later snake uses the same pointer
   * state, but must be added through SparklineGraph segment-path support.
   *
   * @returns {TemplateResult|string} Active indicator SVG.
   */
  renderActiveIndicator() {
    if (this.config.sparkline.show.chart_type === 'radial_barcode') return '';

    return svg`
      <line
        id="sparkline-active-indicator-${this.cardId}-${this.index}"
        class="sparkline-active-indicator"
        x1="${this.activeX ?? 0}"
        y1="${this.Graph.drawArea.y}"
        x2="${this.activeX ?? 0}"
        y2="${this.Graph.drawArea.y + this.Graph.drawArea.height}"
        style="stroke:var(--primary-text-color);stroke-width:1;opacity:0.45;visibility:${this.activeX === undefined ? 'hidden' : 'visible'};pointer-events:none;"
      ></line>
    `;
  }

  renderActiveIndicatorV1() {
    return svg`
      <line
        class="sparkline-active-indicator"
        x1="0"
        y1="${this.Graph.drawArea.y}"
        x2="0"
        y2="${this.Graph.drawArea.y + this.Graph.drawArea.height}"
        style="stroke:var(--primary-text-color);stroke-width:1;opacity:0;pointer-events:none;"
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
    const rows = this.Graph.yAxis.rows.concat().sort((left, right) => left.y - right.y);
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
        ${this.Graph.stateBandTransitions.map(
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
        ${this.Graph.stateBandSegments.map((segment) => {
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
        x=${this.Graph.drawArea.x - padding}
        y=${this.Graph.drawArea.y}
        width=${this.Graph.drawArea.width + padding * 2}
        height=${this.Graph.drawArea.height}
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

    const animate = this.config.sparkline.animate && this.historySeries;
    const configuredStyles = this.getRenderStyles(Merge.mergeDeep(this.getStyles({}), ConfigHelper.toStyleDict(this.config.sparkline.state_bands.styles)));

    return svg`
      <g class='state-bands'>
        <rect
          class='state-bands__hit-area'
          x=${this.Graph.drawArea.x}
          y=${this.Graph.drawArea.y}
          width=${this.Graph.drawArea.width}
          height=${this.Graph.drawArea.height}
          stroke-width='0'
          opacity='0'
        ></rect>
        ${this.stateBands.map((row) => row.segments.map((segment) => {
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
                ${animate
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
                  : ''}
              </rect>
            `;
          }),
        )}
      </g>
    `;
  }

  renderSvgTrafficLight(trafficLight, i) {
    const values = trafficLight.value || [];
    return svg`
      ${values.map((value, k) => {
        const hasValue = typeof value !== 'undefined';
        const color = hasValue ? this.computeColor(value + 0.001, 0) : 'var(--theme-sys-elevation-surface-neutral4)';
        const rectY = Array.isArray(trafficLight.y) ? trafficLight.y[k] : trafficLight.y;
        const rectHeight = Math.max(1, trafficLight.height - this.svg.line_width);
        const rectWidth = Math.max(1, trafficLight.width - this.svg.line_width);
        return svg`
          <rect
            x=${trafficLight.x + this.svg.line_width / 2}
            y=${rectY - trafficLight.height + this.svg.line_width / 2}
            height=${rectHeight}
            width=${rectWidth}
            fill=${color}
            stroke=${color}
            stroke-width=${this.svg.line_width ? this.svg.line_width : 0}
            rx="0"
            ry="0"
            pathLength="10"
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

  renderSvgEqualizerMask(equalizer, index) {
    if (this.config.sparkline.show.chart_type !== 'equalizer') return '';
    if (!equalizer) return '';

    // History-backed graphs first render a temporary current-state series.
    // Start the SVG animation only when the requested history is available.
    const animate = this.config.sparkline.animate && (this.config.period.type === 'real_time' || this.historySeries);
    const animationStartY = this.animationBaselineY;

    // Square mode uses the smallest generated dimension for both axes. When
    // the level height shrinks, redistribute all levels over the graph area.
    if (this.config.sparkline.equalizer.square === true) {
      const size = Math.min(equalizer[0].width, equalizer[0].height);
      const levelSpacing = size < equalizer[0].height ? (this.Graph.drawArea.height - this.config.sparkline.equalizer.value_buckets * size) / (this.config.sparkline.equalizer.value_buckets - 1) : 0;

      equalizer = equalizer.map((equalizerPart) => {
        const squarePart = { ...equalizerPart };
        if (size < equalizerPart.height) {
          squarePart.y = equalizerPart.y.map((level, levelIndex) => this.Graph.drawArea.y + this.Graph.drawArea.height - levelIndex * (size + levelSpacing));
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

  renderSvgBarsMask(bars, index) {
    if (this.config.sparkline.show.chart_type !== 'bar') return '';
    if (!bars) return '';

    // Keep the mask and visible bars synchronized during their introduction.
    const animate = this.config.sparkline.animate && (this.config.period.type === 'real_time' || this.historySeries);

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

  renderSvgBarsBackground(bars, index) {
    if (this.config.sparkline.show.chart_type !== 'bar') return '';
    if (!bars) return '';

    const fill = this.gradient[0] ? `url(#grad-${this.cardId}-0)` : this.computeColor(this.card.entities[index].state, index);
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

  renderSvgBars(bars, index) {
    if (!bars) return '';

    // Existing animate nodes are retained by Lit. State updates therefore do
    // not restart the graph, while a newly inserted calendar bar animates once.
    const animate = this.config.sparkline.animate && (this.config.period.type === 'real_time' || this.historySeries);

    return svg`
      <g class='bars' ?anim=${this.config.sparkline.animate}>
        <rect
          class='bars-hit_area'
          width=${this.Graph.width}
          height=${this.Graph.height}
          stroke-width='0'
          opacity='0'
        ></rect>
        ${bars.map((bar, i) => {
          const color = this.computeColor(bar.value, index);
          return svg`
            <rect
              class='bar'
              x=${bar.x}
              y=${bar.y}
              height=${Math.max(1, bar.height)}
              width=${Math.max(1, bar.width)}
              fill=${color}
              stroke=${color}
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
          `;
        })}
      </g>
    `;
  }

  // @mouseover=${() => this.updateTooltipFromPointIndex(i, undefined)}
  // @mouseout=${() => this.clearTooltip()}

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

  renderSvgRadialBarcodeBackground(radius) {
    const { start, end, start2, end2, largeArcFlag, sweepFlag } = this.Graph._calcRadialBarcodeCoords(0, 359.9, true, radius, radius, this.radialBarcodeChartWidth);
    const radius2 = { x: radius - this.radialBarcodeChartWidth, y: radius - this.radialBarcodeChartWidth };
    const backgroundStyles = ConfigHelper.toStyleDict(this.config.sparkline.radial_barcode?.background?.styles);

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
      <path fill="lightgray" d="${d}" style=${styleMap(this.getRenderStyles(backgroundStyles))}></path>
    `;
  }

  renderSvgRadialBarcodeFace(radius) {
    if (!this.config?.sparkline?.radial_barcode?.face) return svg``;

    const dayNightRadius = radius * 0.62;
    const hourMarksRadius = radius * 0.84;
    const hourNumbersRadius = radius * 0.74;

    const renderDayNight = () => {
      return this.config.sparkline.radial_barcode.face?.show_day_night === true
        ? svg`
        <circle pathLength="1" r="${dayNightRadius}" cx=${this.svg.width / 2} cy="${this.svg.height / 2}"></circle>
      `
        : '';
    };

    const renderHourMarks = () => {
      return this.config.sparkline.radial_barcode.face?.show_hour_marks === true
        ? svg`
        <circle pathLength=${this.config.sparkline.radial_barcode.face.hour_marks_count} r="${hourMarksRadius}" cx=${this.svg.width / 2} cy="${this.svg.height / 2}"></circle>
      `
        : '';
    };

    const renderAbsoluteHourNumbers = () => {
      return this.config.sparkline.radial_barcode.face?.show_hour_numbers === 'absolute'
        ? svg`
        <g>
          <text x="${this.svg.width / 2}" y="${this.svg.height / 2 - hourNumbersRadius}">24</text>
          <text x="${this.svg.width / 2}" y="${this.svg.height / 2 + hourNumbersRadius}">12</text>
          <text x="${this.svg.width / 2 + hourNumbersRadius}" y="${this.svg.height / 2}">6</text>
          <text x="${this.svg.width / 2 - hourNumbersRadius}" y="${this.svg.height / 2}">18</text>
        </g>
      `
        : '';
    };

    const renderRelativeHourNumbers = () => {
      return this.config.sparkline.radial_barcode.face?.show_hour_numbers === 'relative'
        ? svg`
        <g>
          <text x="${this.svg.width / 2}" y="${this.svg.height / 2 - hourNumbersRadius}">0</text>
          <text x="${this.svg.width / 2}" y="${this.svg.height / 2 + hourNumbersRadius}">-12</text>
          <text x="${this.svg.width / 2 + hourNumbersRadius}" y="${this.svg.height / 2}">-18</text>
          <text x="${this.svg.width / 2 - hourNumbersRadius}" y="${this.svg.height / 2}">-6</text>
        </g>
      `
        : '';
    };

    return svg`
      ${renderDayNight()}
      ${renderHourMarks()}
      ${renderAbsoluteHourNumbers()}
      ${renderRelativeHourNumbers()}
    `;
  }

  renderSvgRadialBarcode(radialBarcode, index) {
    if (!radialBarcode) return '';
    const radialBarcodePaths = this.Graph.getRadialBarcodePaths();
    const radialBarcodeBackgroundPaths = this.Graph.getRadialBarcodeBackgroundPaths();

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
        ${this.renderSvgRadialBarcodeFace(this.svg.width / 2 - 40)}
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
        <rect
          class='barcode-hit_area'
          width=${this.Graph.width}
          height=${this.Graph.height}
          stroke-width='0'
          opacity='0'
        ></rect>      
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
                this.config.sparkline.animate && (this.config.period.type === 'real_time' || this.historySeries)
                  ? svg`
                <animate
                  attributeName='x'
                  from=${this.Graph.drawArea.x}
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
   * Renders one sparkline layout item.
   *
   * @returns {TemplateResult} SVG template for the sparkline.
   */
  renderSvg() {
    // A closed calendar period contains fetched source history exclusively.
    // Render an empty tool surface until that first asynchronous request has
    // completed, because there is intentionally no current-state placeholder.
    if (this.config.period.type === 'calendar' && this.config.period.calendar.offset < 0 && !this.historySeries) {
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
            overflow="hidden"
            touch-action="none"
            style="touch-action:none; pointer-events:auto; overflow:hidden;"
          ></svg>
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
          overflow="hidden"
          touch-action="none"
          style="touch-action:none; pointer-events:auto; overflow:hidden;"
        >
          <defs>
            ${this.renderSvgGradient(this.gradient)}
            ${this.area.map((fill, i) => this.renderSvgAreaMask(fill, i))}
            ${this.areaMinMax.map((fill, i) => this.renderSvgAreaMinMaxMask(fill, i))}
            ${this.line.map((line, i) => this.renderSvgLineMask(line, i))}
            ${this.renderSvgStateBandsMask()}
          </defs>
          <g transform="translate(0 ${this.animationBaselineY})">
            <g>
              ${
                this.config.sparkline.animate &&
                ['line', 'area'].includes(this.config.sparkline.show.chart_type) &&
                (this.config.period.type === 'real_time' || this.historySeries)
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
                ${this.area.map((fill, i) => this.renderSvgAreaBackground(fill, i))}
                ${this.areaMinMax.map((fill, i) => this.renderSvgAreaMinMaxBackground(fill, i))}
                ${this.line.map((line, i) => this.renderSvgLineBackground(line, i))}
              </g>
            </g>
          </g>
          ${this.bar.map((bars, i) => this.renderSvgBarsMask(bars, i))}
          ${this.bar.map((bars, i) => this.renderSvgBarsBackground(bars, i))}
          ${this.bar.map((bars, i) => this.renderSvgBars(bars, i))}
          ${this.equalizer.map((equalizer, i) => this.renderSvgEqualizerMask(equalizer, i))}
          ${this.equalizer.map((equalizer, i) => this.renderSvgEqualizerBackground(equalizer, i))}
          ${this.barcodeChart.map((barcodePart, i) => this.renderSvgBarcode(barcodePart, i))}
          ${this.radialBarcodeChart.map((radialPart, i) => this.renderSvgRadialBarcode(radialPart, i))}
          ${this.graded.map((grade, i) => this.renderSvgGraded(grade, i))}
          ${this.renderSvgStateBandsBackground()}
          ${this.renderSvgStateBands()}
          ${this.renderGrid()}
          ${this.renderAxis()}
          ${this.renderPoints()}
          ${this.renderActiveIndicator()}
          ${this.renderTickmarks()}
          ${this.renderAxisLabels()}
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
