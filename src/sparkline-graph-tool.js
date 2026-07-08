/* eslint-disable no-useless-concat */
import { html, svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import BaseTool from './base-tool.js';
import ConfigHelper from './config-helper.js';
import Merge from './merge.js';
import Utils from './utils.js';
import SparklineGraph, { X, Y, V } from './sparkline-graph.js';
import StateTool from './state-tool.js';
import { formatDateVeryShort } from './frontend_mods/common/datetime/format_date.ts';
import { formatTime } from './frontend_mods/common/datetime/format_time.ts';
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
        refresh_interval: '5min',
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
        tooltip: {
          styles: {
            'font-size': '0.9em',
          },
        },
        show: {
          chart_type: 'line',
          line: true,
          area: false,
          grid: false,
          axis: false,
          tickmarks: false,
          labels: false,
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
    if (normalizedConfig.line?.styles !== undefined) {
      normalizedConfig.line.styles = ConfigHelper.toStyleDict(normalizedConfig.line.styles);
    }
    if (normalizedConfig.area?.styles !== undefined) {
      normalizedConfig.area.styles = ConfigHelper.toStyleDict(normalizedConfig.area.styles);
    }
    ['x_axis', 'y_axis'].forEach((axisName) => {
      ['axis', 'grid_major', 'grid_minor', 'tickmarks_major', 'tickmarks_minor', 'labels'].forEach((layerName) => {
        if (normalizedConfig[axisName]?.[layerName]?.styles !== undefined) {
          normalizedConfig[axisName][layerName].styles = ConfigHelper.toStyleDict(normalizedConfig[axisName][layerName].styles);
        }
      });
    });
    const sparklineConfig = Merge.mergeDeep(defaultConfig, normalizedConfig);
    console.log('SparklineGraphTool constructor', sparklineConfig, defaultConfig, index, templates, cardId, card);

    super(sparklineConfig, index, templates, cardId, card, 'sparklines', 'sparklines', 0);

    this.svg = this.calculateSvgDimensions();
    this.config.svg = this.svg;
    this.graphConfig = this.buildGraphConfig(this.config);
    this.Graph = new SparklineGraph(this.svg.width, this.svg.height, this.svg.margin, this.graphConfig, [], [], this.graphConfig.sparkline.state_map ?? {});
    this.series = [];
    this.historySeries = undefined;
    this.gradient = [];
    this.length = [];
    this.linePath = undefined;
    this.areaPath = undefined;
    this.stats = {};
    this.tooltip = {};
    this.activePoint = undefined;
    this.activeX = undefined;
    this.dragging = false;
    this.elements = {};
    this.historyPromise = undefined;
    this.historyRefreshAt = 0;
    this.runtimeYScale = undefined;
    this.runtimeConfig = this.config;
    this.runtimeConfig.svg = this.svg;
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

    return {
      ...coordinates,
      width,
      height,
      line_width,
      x: coordinates.xpos - width / 2,
      y: coordinates.ypos - height / 2,
      margin,
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
   * Builds the config object consumed by SparklineGraph without changing the
   * engine's expected naming.
   *
   * @param {object} config - Sparkline layout config.
   * @returns {object} Engine config.
   */
  buildGraphConfig(config) {
    return {
      width: this.svg.width,
      height: this.svg.height,
      period: config.period,
      sparkline: config.sparkline,
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

    this.svg = this.calculateSvgDimensions(this.runtimeConfig);
    this.runtimeConfig.svg = this.svg;
    this.graphConfig = this.buildGraphConfig(this.runtimeConfig);
    this.Graph = new SparklineGraph(this.svg.width, this.svg.height, this.svg.margin, this.graphConfig, [], [], this.graphConfig.sparkline.state_map ?? {});
    if (this.historySeries) {
      this.series = this.historySeries;
    } else {
      this.series = this.buildRealtimeSeries(entity);
    }

    this.updateGraphFromSeries();
    this.fetchHistoryIfNeeded(entity);
  }

  /**
   * First implementation feeds the engine with current state only. Historical
   * fetching can replace this input without changing render logic.
   *
   * @param {object} entity - Current HA state object.
   * @returns {Array<object>} Series for SparklineGraph.update().
   */
  buildRealtimeSeries(entity) {
    const value = this.getEntityNumericState(entity);

    return [
      {
        ...entity,
        state: value,
        haState: entity.state,
      },
    ];
  }

  /**
   * Parses the SAK-style refresh interval used by the history loader.
   *
   * @returns {number} Refresh interval in milliseconds.
   */
  getHistoryRefreshMs() {
    const interval = this.runtimeConfig.history.refresh_interval;

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
    const periodHours = this.runtimeConfig.period?.calendar?.duration?.hour ?? this.runtimeConfig.period?.rolling_window?.duration?.hour ?? 24;
    const now = new Date();

    if (this.runtimeConfig.period?.type === 'calendar' && this.runtimeConfig.period?.calendar?.period === 'day') {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      start.setHours(start.getHours() + (this.runtimeConfig.period?.calendar?.offset ?? 0) * 24 - (periodHours - 24));

      return {
        start,
        end: new Date(start.getTime() + periodHours * 60 * 60 * 1000),
      };
    }

    if (this.runtimeConfig.period?.type === 'rolling_window') {
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
   * Fetches history when the configured refresh interval has expired. The first
   * render uses the current state, then history replaces the series once loaded.
   *
   * @param {object} entity - Current HA state object.
   */
  fetchHistoryIfNeeded(entity) {
    const now = Date.now();

    if (this.historyPromise || now < this.historyRefreshAt) return;

    const range = this.getHistoryRange();
    const path = this.buildHistoryPath(this.entityConfig.entity, range.start, range.end);
    this.historyPromise = this.card._hass
      .callApi('GET', path)
      .then((history) => {
        this.historySeries = this.buildHistorySeries(history[0], entity, range.end);
        this.series = this.historySeries;
        this.updateGraphFromSeries();
        this.card._updateSparklineEntities();
        this.card._updateToolsUsingSparklineEntities();
        this.historyRefreshAt = Date.now() + this.getHistoryRefreshMs();
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
    const rows = historyRows.concat([currentEntity]);

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
    const range = this.getHistoryRange();
    this.Graph.hours = (range.end.getTime() - range.start.getTime()) / (60 * 60 * 1000);
    this.Graph.update(this.series);
    // console.log('updateGraphFromSeries', this.series, range, this.Graph.hours);

    // Keep the y-axis aligned to the rendered graph, then snap the visible
    // bounds outward to the configured y tick grid so the chart gets breathing
    // room above and below the data.
    const yTicksizeConfig = this.runtimeConfig.y_axis.ticks_minor.ticksize;
    const yTicksize = yTicksizeConfig == null || yTicksizeConfig === 'auto' ? this.getAutoYAxisTicksize('minor') : Number(yTicksizeConfig);
    const snappedMin = Math.floor(this.Graph.min / yTicksize) * yTicksize;
    const snappedMax = Math.ceil(this.Graph.max / yTicksize) * yTicksize;

    this.Graph.min = snappedMin;
    this.Graph.max = snappedMax;

    this.linePath = this.Graph.getPath();
    this.areaPath = this.Graph.getArea(this.linePath);
    if (this.runtimeConfig.sparkline.colorstops.colors.length > 0 && !this.entityConfig?.color) {
      this.gradient[0] = this.Graph.computeGradient(
        computeThresholds(this.runtimeConfig.sparkline.colorstops.colors, this.runtimeConfig.sparkline.colorstops_transition),
        this.runtimeConfig.sparkline.state_values.logarithmic,
      );
    } else {
      this.gradient = [];
    }
    this.stats = this.calculateStatistics(this.series);
  }

  /**
   * Calculates min/max from the raw source values and calculates avg as a
   * time-weighted average. Home Assistant history rows are state changes, so a
   * value that only existed briefly must not count the same as a value that was
   * active for hours.
   *
   * @param {Array<object>} series - Current graph source series.
   * @returns {object} Graph statistics.
   */
  calculateStatistics(series) {
    const sortedSeries = series
      .filter((item) => item && Number.isFinite(Number(item.state)))
      .concat()
      .sort((a, b) => new Date(a.last_changed).getTime() - new Date(b.last_changed).getTime());

    if (sortedSeries.length === 0) {
      return {};
    }

    const values = sortedSeries.map((item) => Number(item.state));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const minItem = sortedSeries.find((item) => Number(item.state) === min);
    const maxItem = sortedSeries.find((item) => Number(item.state) === max);
    const min_time = minItem.last_changed;
    const max_time = maxItem.last_changed;
    let weightedValue = 0;
    let weightedDuration = 0;

    sortedSeries.forEach((item, index) => {
      const value = Number(item.state);
      const startTime = new Date(item.last_changed).getTime();
      const endTime = index < sortedSeries.length - 1 ? new Date(sortedSeries[index + 1].last_changed).getTime() : new Date().getTime();
      const duration = endTime - startTime;

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

  formatTooltipStat(stat, rawValue) {
    const sparklineId = this.config.id;
    const entityId = `fhs_sparkline.${sparklineId}_${stat}`;
    const entity = this.card.entities.find((item) => item?.entity_id === entityId) ?? this.card.entities[this.card.config.entities.length + this.index * 5 + this.getSparklineStatIndex(stat)];
    const entityConfig = this.card.resolvedEntityConfigs.find((item) => item?.entity === entityId) ?? this.card.resolvedEntityConfigs[this.card.config.entities.length + this.index * 5 + this.getSparklineStatIndex(stat)];

    if (!entity || !entityConfig) {
      return { label: this.getTooltipLabel(stat), value: rawValue, uom: '' };
    }

    const formatter = Object.create(StateTool.prototype);
    formatter.entity = {
      ...entity,
      state: rawValue,
    };
    formatter.entityConfig = entityConfig;
    formatter.card = this.card;
    formatter.state = '';
    formatter.uom = '';
    formatter.buildStateAndUom();

    return {
      label: this.getTooltipLabel(stat),
      value: formatter.state,
      uom: formatter.uom,
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

    const titleDate = bucket.end;
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
    const centerX = pointer?.clientX !== undefined ? pointer.clientX - containerBox.left : svgBox ? svgBox.left - containerBox.left + point[X] * scaleX : point[X];
    const centerY = pointer?.clientY !== undefined ? pointer.clientY - containerBox.top : svgBox ? svgBox.top - containerBox.top + point[Y] * scaleY : point[Y];

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

  clearTooltip() {
    this.tooltip = {};
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
    const tooltip = this.elements.tooltip;

    if (!tooltip) return;

    tooltip.style.display = show ? 'block' : 'none';
  }

  updateTooltipPositionDom(e) {
    const tooltip = this.elements.tooltip;
    const containerBox = this.elements.containerRect;
    const touch = e?.touches?.[0] ?? e?.changedTouches?.[0] ?? e;

    if (!tooltip || !containerBox || touch?.clientX === undefined || touch?.clientY === undefined) return;

    tooltip.style.left = `${touch.clientX - containerBox.left}px`;
    tooltip.style.top = `${touch.clientY - containerBox.top}px`;
  }

  updateTooltipContentDom() {
    const tooltip = this.elements.tooltip;

    if (!tooltip) return;

    const title = this.elements.tooltipTitle;
    const rows = this.elements.tooltipRows;

    title.textContent = this.tooltip.title ?? '';
    rows[0].children[0].textContent = this.tooltip.min?.label ?? '';
    rows[0].children[1].textContent = this.tooltip.min ? `${this.tooltip.min.value}${this.tooltip.min.uom}` : '';
    rows[1].children[0].textContent = this.tooltip.avg?.label ?? '';
    rows[1].children[1].textContent = this.tooltip.avg ? `${this.tooltip.avg.value}${this.tooltip.avg.uom}` : '';
    rows[2].children[0].textContent = this.tooltip.max?.label ?? '';
    rows[2].children[1].textContent = this.tooltip.max ? `${this.tooltip.max.value}${this.tooltip.max.uom}` : '';
  }

  updateActivePointer(e) {
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

    if (pointIndex !== previousIndex) {
      this.updateTooltipFromPointIndex(pointIndex, e);
      this.updateTooltipContentDom();
    }

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

    console.log('[sparkline attach refs]', this.index, this.elements);
    if (!this.elements.svg || this.elements.svg.dataset.pointerReady === 'true') return;

    function Frame2() {
      this.rid = null;
      this.updateActivePointer(this.pointerEvent);
    }

    function pointerMove(e) {
      e.preventDefault();

      if (this.dragging) {
        this.pointerEvent = e;
        if (!this.rid) this.rid = window.requestAnimationFrame(Frame2.bind(this));
      }
    }

    function hoverMove(e) {
      if (this.dragging) return;

      if (!this.hovering) {
        this.hovering = true;
        this.elements.containerRect = this.elements.container.getBoundingClientRect();
      }
      this.updateActivePointer(e);
    }

    function hoverLeave() {
      if (this.dragging) return;

      this.hovering = false;
      this.activeX = undefined;
      this.clearTooltip();
      this.updateTooltipVisibilityDom(false);
      this.updateActiveIndicatorDom();
    }

    function pointerDown(e) {
      e.preventDefault();

      // Safari: copied from slider-pointer-example.js. Use touchstart/mousedown
      // as starters, then window pointermove/pointerup so dragging can continue
      // outside the SVG/card.
      window.addEventListener('pointermove', pointerMove.bind(this), false);
      // eslint-disable-next-line no-use-before-define
      window.addEventListener('pointerup', pointerUp.bind(this), false);

      this.dragging = true;
      this.pointerEvent = e;
      this.elements.containerRect = this.elements.container?.getBoundingClientRect();
      this.updateActivePointer(e);
      this.updateTooltipVisibilityDom(true);
      this.updateActiveIndicatorDom();
    }

    function pointerUp(e) {
      e.preventDefault();

      // Safari: copied cleanup pattern from slider-pointer-example.js.
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
      if (this.rid) {
        window.cancelAnimationFrame(this.rid);
        this.rid = null;
      }

      this.clearTooltip();
      this.updateTooltipVisibilityDom(false);
      this.updateActiveIndicatorDom();
      this.elements.containerRect = undefined;
    }

    // For things to work in Safari, keep separate touch and mouse down handlers.
    // The slider showed that pointerdown prevents later window events on Safari.
    this.elements.svg.addEventListener('touchstart', pointerDown.bind(this), false);
    this.elements.svg.addEventListener('mousedown', pointerDown.bind(this), false);

    // Desktop hover is not part of the slider drag behavior. Keep it local to
    // the SVG so mouse users can inspect the graph without clicking.
    this.elements.svg.addEventListener('mousemove', hoverMove.bind(this), false);
    this.elements.svg.addEventListener('mouseleave', hoverLeave.bind(this), false);
    this.elements.svg.dataset.pointerReady = 'true';
  }

  attachPointerHandlersV1() {
    this.elements.svg = this.card.shadowRoot.getElementById(`sparkline-${this.cardId}-${this.index}`);
    this.elements.container = this.card.shadowRoot.getElementById('container');
    this.elements.activeIndicator = this.card.shadowRoot.querySelector('.sparkline-active-indicator');
    this.elements.tooltip = this.card.shadowRoot.querySelector('.sparkline-tooltip');

    if (!this.elements.svg || this.elements.svg.dataset.pointerReady === 'true') return;

    this._pointerMoveHandler =
      this._pointerMoveHandler ||
      ((e) => {
        e.preventDefault();

        if (this.dragging) {
          this.updateActivePointer(e);
        }
      });

    this._pointerDownHandler =
      this._pointerDownHandler ||
      ((e) => {
        e.preventDefault();

        if (e.type === 'touchstart') {
          this.elements.containerRect = this.elements.container?.getBoundingClientRect();
          window.addEventListener('touchmove', this._pointerMoveHandler, { passive: false });
          window.addEventListener('touchend', this._pointerUpHandler, { passive: false });
          window.addEventListener('touchcancel', this._pointerUpHandler, { passive: false });
        } else {
          window.addEventListener('mousemove', this._pointerMoveHandler, false);
          window.addEventListener('mouseup', this._pointerUpHandler, false);
        }

        this.dragging = true;
        this.updateActivePointer(e);
      });

    this._pointerUpHandler =
      this._pointerUpHandler ||
      ((e) => {
        e.preventDefault();

        window.removeEventListener('pointermove', this._pointerMoveHandler, false);
        window.removeEventListener('pointerup', this._pointerUpHandler, false);
        window.removeEventListener('mousemove', this._pointerMoveHandler, false);
        window.removeEventListener('mouseup', this._pointerUpHandler, false);
        window.removeEventListener('touchmove', this._pointerMoveHandler, false);
        window.removeEventListener('touchend', this._pointerUpHandler, false);
        window.removeEventListener('touchcancel', this._pointerUpHandler, false);

        if (!this.dragging) return;

        this.dragging = false;
        this.activeX = undefined;
        this.clearTooltip();
        this.updateTooltipVisibilityDom(false);
        this.updateActiveIndicatorDom();
        this.elements.containerRect = undefined;
      });

    this._hoverMoveHandler =
      this._hoverMoveHandler ||
      ((e) => {
        if (this.dragging) return;

        this.updateActivePointer(e);
      });

    this._hoverLeaveHandler =
      this._hoverLeaveHandler ||
      (() => {
        if (this.dragging) return;

        this.activeX = undefined;
        this.clearTooltip();
        this.updateTooltipVisibilityDom(false);
        this.updateActiveIndicatorDom();
      });

    // Keep separate touch and mouse starters. The move/up listeners are bound on
    // window so the pointer can leave the SVG without breaking tracking.
    this.elements.svg.addEventListener('touchstart', this._pointerDownHandler, { passive: false });
    this.elements.svg.addEventListener('mousedown', this._pointerDownHandler, false);

    // Desktop hover is not part of the slider drag behavior. Keep it local to
    // the SVG so mouse users can inspect the graph without clicking.
    this.elements.svg.addEventListener('mousemove', this._hoverMoveHandler, false);
    this.elements.svg.addEventListener('mouseleave', this._hoverLeaveHandler, false);
    this.elements.svg.dataset.pointerReady = 'true';
  }

  /**
   * Renders the mask used for the area fill.
   *
   * @returns {TemplateResult|string} Area mask definition.
   */
  renderAreaMask() {
    if (!this.areaPath) return '';

    return svg`
      <mask id="sparkline-area-${this.cardId}-${this.index}">
        <path class="sparkline-area-mask" fill="white" d="${this.areaPath}"></path>
      </mask>
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
    return Merge.mergeDeep(this.getStyles({ fill: 'none' }), ConfigHelper.toStyleDict(this.runtimeConfig.line?.styles));
  }

  computeColor(inState, i) {
    const { colorstops, line_color } = this.runtimeConfig.sparkline;
    const state = Number(inState) || 0;
    console.log('computeColor BEFORE', state, colorstops.colors, line_color[i], line_color[0]);
    const threshold = {
      color: line_color[i] || line_color[0],
      ...colorstops.colors.slice(-1)[0],
      ...colorstops.colors.find((ele) => ele.value < state),
    };
    console.log('computeColor AFTER', state, colorstops.colors, line_color[i], line_color[0], threshold.color);
    return this.card.config.entities[i].color || threshold.color;
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
    const fontSize = this.runtimeConfig[`${axis}_axis`]?.labels?.styles?.['font-size'];

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
  buildXAxisTicks(level) {
    const ONE_HOUR = 60 * 60 * 1000;
    const range = this.getHistoryRange();
    const ticksizeConfig = this.runtimeConfig.x_axis[`ticks_${level}`].ticksize;
    const ticksize = ticksizeConfig == null || ticksizeConfig === 'auto' ? this.getAutoXAxisTicksize(level, range) : this.xTicksizeToHours(ticksizeConfig);
    const windowHours = (range.end.getTime() - range.start.getTime()) / ONE_HOUR;
    const intervalCount = Math.max(1, this.Graph.hours * this.Graph.points - 1);
    const intervalPerHour = this.Graph.points;

    const startDate = new Date(range.start);
    startDate.setHours(Math.floor(startDate.getHours() / ticksize) * ticksize, 0, 0, 0);

    const ticks = [];
    let previousTickDate = null;

    const tickCount = Math.max(1, Math.ceil(windowHours / ticksize) + 1);

    for (let tick = 0; tick < tickCount; tick += 1) {
      const tickDate = new Date(startDate);
      tickDate.setHours(startDate.getHours() + tick * ticksize);

      const hour = (tickDate.getTime() - range.start.getTime()) / ONE_HOUR;

      if (hour >= 0 && tickDate <= range.end) {
        const tickIndex = hour * intervalPerHour;
        const x = this.Graph.drawArea.x + (tickIndex / intervalCount) * this.Graph.drawArea.width;

        const tickDay = tickDate.toDateString();
        const previousTickDay = previousTickDate?.toDateString();

        const isMidnight = tickDate.getHours() === 0 && tickDate.getMinutes() === 0 && tickDate.getSeconds() === 0 && tickDate.getMilliseconds() === 0;
        const label =
          isMidnight || (previousTickDate && tickDay !== previousTickDay)
            ? formatDateVeryShort(tickDate, this.card._hass.locale, this.card._hass.config)
            : formatTime(tickDate, this.card._hass.locale, this.card._hass.config);

        ticks.push({
          axis: 'x',
          level,
          value: hour,
          x,
          label,
        });

        previousTickDate = tickDate;
      }
    }

    return ticks;
  }

  buildXAxisTicksV1(level) {
    const ticksize = this.xTicksizeToHours(this.runtimeConfig.x_axis[`ticks_${level}`].ticksize);
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
    const ticksizeConfig = this.runtimeConfig.y_axis[`ticks_${level}`].ticksize;
    const ticksize = ticksizeConfig == null || ticksizeConfig === 'auto' ? this.getAutoYAxisTicksize(level) : Number(ticksizeConfig);
    const min = this.Graph.min;
    const max = this.Graph.max;
    const graphMin = this.runtimeConfig.sparkline.state_values.logarithmic ? Math.log10(Math.max(1, min)) : min;
    const graphMax = this.runtimeConfig.sparkline.state_values.logarithmic ? Math.log10(Math.max(1, max)) : max;
    const yRatio = (graphMax - graphMin) / this.Graph.drawArea.height || 1;
    const firstTick = Math.ceil(min / ticksize) * ticksize;
    const ticks = [];

    for (let value = firstTick; value <= max; value += ticksize) {
      const graphValue = this.runtimeConfig.sparkline.state_values.logarithmic ? Math.log10(Math.max(1, value)) : value;
      const y = this.Graph.drawArea.height + this.Graph.drawArea.y - (graphValue - graphMin) / yRatio;
      const label = new Intl.NumberFormat(this.card._hass.locale?.language || this.card._hass.language).format(value);

      ticks.push({ axis: 'y', level, value, y, label });
    }

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
    const labelsAt = this.runtimeConfig.sparkline.show[`${axis}labels_at`];

    if (labelsAt === 'none') return [];
    if (labelsAt === 'all') return axis === 'x' ? [...this.buildXAxisTicks('minor'), ...this.buildXAxisTicks('major')] : [...this.buildYAxisTicks('minor'), ...this.buildYAxisTicks('major')];
    if (labelsAt === 'ticks_minor') return axis === 'x' ? this.buildXAxisTicks('minor') : this.buildYAxisTicks('minor');
    return axis === 'x' ? this.buildXAxisTicks('major') : this.buildYAxisTicks('major');
  }

  /**
   * Renders the grid layer behind the graph. Grid lines are based on major
   * ticks by default, matching the horseshoe-style tick model.
   *
   * @returns {TemplateResult|string} Grid layer SVG.
   */
  renderGrid() {
    if (this.runtimeConfig.sparkline.show.grid !== true) return '';

    const xStyles = this.getRenderStyles(ConfigHelper.toStyleDict(this.runtimeConfig.x_axis.grid_major.styles));
    const yStyles = this.getRenderStyles(ConfigHelper.toStyleDict(this.runtimeConfig.y_axis.grid_major.styles));
    const xTicks = this.buildXAxisTicks('major');
    const yTicks = this.buildYAxisTicks('major');

    return svg`
      <g class="sparkline-grid sparkline-grid--x" style="pointer-events:none;">
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
      </g>
      <g class="sparkline-grid sparkline-grid--y" style="pointer-events:none;">
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
      </g>
    `;
  }

  /**
   * Renders the x/y axis baselines as a separate layer. The x-axis baseline is
   * the bottom edge of the graph draw area; the y-axis baseline is the left edge.
   *
   * @returns {TemplateResult|string} Axis layer SVG.
   */
  renderAxis() {
    if (this.runtimeConfig.sparkline.show.axis !== true) return '';

    const xStyles = this.getRenderStyles(ConfigHelper.toStyleDict(this.runtimeConfig.x_axis.axis.styles));
    const yStyles = this.getRenderStyles(ConfigHelper.toStyleDict(this.runtimeConfig.y_axis.axis.styles));

    return svg`
      <g class="sparkline-axis" style="pointer-events:none;">
        <line
          class="sparkline-axis-line sparkline-axis-line--x"
          x1="${this.Graph.drawArea.x}"
          y1="${this.Graph.drawArea.y + this.Graph.drawArea.height}"
          x2="${this.Graph.drawArea.x + this.Graph.drawArea.width}"
          y2="${this.Graph.drawArea.y + this.Graph.drawArea.height}"
          style=${styleMap(xStyles)}
        ></line>
        <line
          class="sparkline-axis-line sparkline-axis-line--y"
          x1="${this.Graph.drawArea.x}"
          y1="${this.Graph.drawArea.y}"
          x2="${this.Graph.drawArea.x}"
          y2="${this.Graph.drawArea.y + this.Graph.drawArea.height}"
          style=${styleMap(yStyles)}
        ></line>
      </g>
    `;
  }

  /**
   * Renders axis tickmarks as a separate layer above the graph.
   *
   * @returns {TemplateResult|string} Tickmark layer SVG.
   */
  renderTickmarks() {
    if (this.runtimeConfig.sparkline.show.tickmarks !== true) return '';

    const xTickConfig = this.runtimeConfig.x_axis.tickmarks_major;
    const yTickConfig = this.runtimeConfig.y_axis.tickmarks_major;
    const xStyles = this.getRenderStyles(ConfigHelper.toStyleDict(xTickConfig.styles));
    const yStyles = this.getRenderStyles(ConfigHelper.toStyleDict(yTickConfig.styles));
    const xTicks = this.buildXAxisTicks('major');
    const yTicks = this.buildYAxisTicks('major');
    const xTickSize = Utils.calculateSvgDimension(xTickConfig.size);
    const yTickSize = Utils.calculateSvgDimension(yTickConfig.size);

    return svg`
      <g class="sparkline-tickmarks sparkline-tickmarks--x" style="pointer-events:none;">
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
      </g>
      <g class="sparkline-tickmarks sparkline-tickmarks--y" style="pointer-events:none;">
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
      </g>
    `;
  }

  /**
   * Renders axis labels as a separate top layer. Labels use the same tick values
   * as grid and tickmarks so the layers stay aligned.
   *
   * @returns {TemplateResult|string} Label layer SVG.
   */
  renderAxisLabels() {
    if (this.runtimeConfig.sparkline.show.labels !== true) return '';

    const xStyles = this.getRenderStyles(ConfigHelper.toStyleDict(this.runtimeConfig.x_axis.labels.styles));
    const yStyles = this.getRenderStyles(ConfigHelper.toStyleDict(this.runtimeConfig.y_axis.labels.styles));
    const xTicks = this.buildLabelTicks('x');
    const yTicks = this.buildLabelTicks('y');

    return svg`
      <g class="sparkline-labels sparkline-labels--x" style="pointer-events:none;">
        ${xTicks.map(
          (tick) => svg`
          <text
            class="sparkline-label sparkline-label--x"
            x="${tick.x}"
            y="${this.Graph.drawArea.y + this.Graph.drawArea.height + Utils.calculateSvgDimension(this.runtimeConfig.x_axis.labels.offset)}"
            style=${styleMap(xStyles)}
          >${tick.label}</text>
        `,
        )}
      </g>
      <g class="sparkline-labels sparkline-labels--y" style="pointer-events:none;">
        ${yTicks.map(
          (tick) => svg`
          <text
            class="sparkline-label sparkline-label--y"
            x="${this.Graph.drawArea.x - Utils.calculateSvgDimension(this.runtimeConfig.y_axis.labels.offset)}"
            y="${tick.y}"
            style=${styleMap(yStyles)}
          >${tick.label}</text>
        `,
        )}
      </g>
    `;
  }

  /**
   * Builds area styles in the same order as the other FHS tools: base styles,
   * item styles, then area-specific styles. Rendering applies getRenderStyles().
   *
   * @returns {object} Area style dictionary before render filters.
   */
  getAreaStyles() {
    return Merge.mergeDeep(this.getStyles({}), ConfigHelper.toStyleDict(this.runtimeConfig.area?.styles));
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
    if (this.runtimeConfig.sparkline.colorstops.colors.length > 0) {
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
    if (this.runtimeConfig.sparkline.show.chart_type !== 'area' && this.runtimeConfig.sparkline.show.area !== true) return '';

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
        mask="url(#sparkline-area-${this.cardId}-${this.index})"
      ></rect>
    `;
  }

  /**
   * Renders the line exactly like SAK: a background rectangle is visible only
   * through the white line mask. Gradients come from colorstops on the
   * background, never from painting the line path itself.
   *
   * @returns {TemplateResult|string} Line SVG.
   */
  renderLine() {
    if (this.runtimeConfig.sparkline.show.chart_type !== 'line' && this.runtimeConfig.sparkline.show.line !== true && this.runtimeConfig.sparkline.show.chart_type !== 'area') return '';

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
        mask="url(#sparkline-line-${this.cardId}-${this.index})"
      ></rect>
    `;
  }

  /**
   * Renders dots on the graph when show.points or line/area show_dots is set.
   * The points use the graph engine coordinates directly so they stay aligned
   * with the line and the active pointer.
   *
   * @returns {TemplateResult|string} Points SVG.
   */
  renderSvgPointV1(point, i) {
    const color = this.computeColor(point[V], i);
    return svg`
    <circle
      class='line--point'
      ?inactive=${this.tooltip.index !== point[3]}
      style=${`--mcg-hover: ${color};`}
      stroke=${color}
      fill=${color}
      cx=${point[X]} cy=${point[Y]} r=${this.svg.line_width / 1.5}
      @mouseover=${(e) => this.updateTooltipFromPointIndex(point[3], e)}
      @mouseout=${() => this.clearTooltip()}
    />
  `;
  }

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
      @mouseover=${(e) => this.updateTooltipFromPointIndex(point[3], e)}
      @mouseout=${() => this.clearTooltip()}
    />
  `;
  }

  renderSvgPoints(points, i) {
    if (!points) return;
    const color = this.computeColor(this.card.entities[i].state, i);
    const range = this.getHistoryRange();
    const bucketMs = (60 / this.Graph.points) * 60 * 1000;
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
      ${points.map((point, pointIndex) => this.renderSvgPoint(point, i, new Date(range.start.getTime() + pointIndex * bucketMs).toISOString()))}
    </g>`;
  }

  renderPoints() {
    if (this.runtimeConfig.sparkline.show.points !== true && this.runtimeConfig.sparkline.line?.show_dots !== true && this.runtimeConfig.sparkline.area?.show_dots !== true) return '';

    const points = this.Graph._calcY(this.Graph.coords).map((point, pointIndex) => [point[X], point[Y], point[V], pointIndex]);

    return this.renderSvgPoints(points, 0);
  }

  renderTooltip() {
    const tooltipStyles = ConfigHelper.toStyleDict(this.runtimeConfig.sparkline.tooltip?.styles);
    const styles = {
      left: '0px',
      top: '0px',
      transform: 'translate(-50%, calc(-100% - 6px))',
      'font-size': tooltipStyles['font-size'] ?? '0.5em',
      'max-width': 'calc(100% - 24px)',
      display: 'none',
    };

    return html`
      <div id="sparkline-tooltip-${this.cardId}-${this.index}" class="sparkline-tooltip" style=${styleMap(styles)}>
        <div class="sparkline-tooltip__title"></div>
        <div class="sparkline-tooltip__row"><span></span><span></span></div>
        <div class="sparkline-tooltip__row"><span></span><span></span></div>
        <div class="sparkline-tooltip__row"><span></span><span></span></div>
      </div>
    `;
  }

  /**
   * Renders a minimal active indicator. The later snake uses the same pointer
   * state, but must be added through SparklineGraph segment-path support.
   *
   * @returns {TemplateResult|string} Active indicator SVG.
   */
  renderActiveIndicator() {
    return svg`
      <line
        id="sparkline-active-indicator-${this.cardId}-${this.index}"
        class="sparkline-active-indicator"
        x1="0"
        y1="${this.Graph.drawArea.y}"
        x2="0"
        y2="${this.Graph.drawArea.y + this.Graph.drawArea.height}"
        style="stroke:var(--primary-text-color);stroke-width:1;opacity:0.45;visibility:hidden;pointer-events:none;"
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
   * Renders one sparkline layout item.
   *
   * @returns {TemplateResult} SVG template for the sparkline.
   */
  render() {
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
          style="touch-action:none; pointer-events:auto; overflow:visible;"
        >
          <defs>
            ${this.renderSvgGradient(this.gradient)}
            ${this.renderAreaMask()}
            ${this.renderLineMask()}
          </defs>
          ${this.renderGrid()}
          ${this.renderAxis()}
          ${this.renderArea()}
          ${this.renderLine()}
          ${this.renderPoints()}
          ${this.renderActiveIndicator()}
          ${this.renderTickmarks()}
          ${this.renderAxisLabels()}
        </svg>
      </g>
    `;

    return this.renderItemLayers(content);
  }
}
