/* eslint-disable no-useless-concat */
import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import BaseTool from './base-tool.js';
import ConfigHelper from './config-helper.js';
import Merge from './merge.js';
import Utils from './utils.js';
import SparklineGraph from './sparkline-graph.js';

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
        period: 'today',
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
          bins: {
            per_hour: 1,
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
        colorstops: {
          colors: [],
        },
        colorstops_transition: 'smooth',
        show: {
          chart_type: 'line',
          line: true,
          area: false,
          grid: false,
          tickmarks: false,
          labels: false,
          xlabels_at: 'ticks_major',
          ylabels_at: 'ticks_major',
        },
      },
      x_axis: {
        ticks_major: {
          ticksize: '1h',
        },
        ticks_minor: {
          ticksize: '15min',
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
          size: 3,
          styles: {
            stroke: 'var(--primary-text-color)',
            'stroke-width': 1,
            opacity: 0.45,
          },
        },
        tickmarks_minor: {
          size: 2,
          styles: {
            stroke: 'var(--primary-text-color)',
            'stroke-width': 1,
            opacity: 0.25,
          },
        },
        labels: {
          offset: 4,
          styles: {
            fill: 'var(--primary-text-color)',
            'font-size': '8px',
            'text-anchor': 'middle',
            'dominant-baseline': 'hanging',
            opacity: 0.7,
          },
        },
      },
      y_axis: {
        ticks_major: {
          ticksize: 1,
        },
        ticks_minor: {
          ticksize: 0.5,
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
          size: 3,
          styles: {
            stroke: 'var(--primary-text-color)',
            'stroke-width': 1,
            opacity: 0.45,
          },
        },
        tickmarks_minor: {
          size: 2,
          styles: {
            stroke: 'var(--primary-text-color)',
            'stroke-width': 1,
            opacity: 0.25,
          },
        },
        labels: {
          offset: 4,
          styles: {
            fill: 'var(--primary-text-color)',
            'font-size': '8px',
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
      ['grid_major', 'grid_minor', 'tickmarks_major', 'tickmarks_minor', 'labels'].forEach((layerName) => {
        if (normalizedConfig[axisName]?.[layerName]?.styles !== undefined) {
          normalizedConfig[axisName][layerName].styles = ConfigHelper.toStyleDict(normalizedConfig[axisName][layerName].styles);
        }
      });
    });
    const sparklineConfig = Merge.mergeDeep(defaultConfig, normalizedConfig);

    super(sparklineConfig, index, templates, cardId, card, 'sparklines', 'sparklines', 0);

    this.svg = this.calculateSvgDimensions();
    this.config.svg = this.svg;
    this.graphConfig = this.buildGraphConfig(this.config);
    this.Graph = new SparklineGraph(this.svg.width, this.svg.height, this.svg.margin, this.graphConfig, [], [], this.graphConfig.sparkline.state_map ?? {});
    this.series = [];
    this.historySeries = undefined;
    this.gradient = [];
    this.linePath = undefined;
    this.areaPath = undefined;
    this.stats = {};
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

    return {
      ...coordinates,
      width,
      height,
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
   * Builds the today history range. The graph engine keeps the visual scale at
   * 00:00 -> 24:00 through its calendar period config.
   *
   * @returns {object} Start and end Date objects.
   */
  getHistoryRange() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    return {
      start,
      end: new Date(),
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
    this.historyPromise = this.card._hass.callApi('GET', path)
      .then((history) => {
        this.historySeries = this.buildHistorySeries(history[0], entity);
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
   * @returns {Array<object>} SparklineGraph history series.
   */
  buildHistorySeries(historyRows, currentEntity) {
    const rows = historyRows.concat([currentEntity]);

    return rows.map((row) => {
      const value = Number(row.state);

      return Merge.mergeDeep(row, {
        state: value,
        haState: row.state,
      });
    });
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
    this.Graph.update(this.series);

    // Keep the y-axis and graph stable between small state updates. The graph
    // engine first calculates raw min/max from the source series. The visible
    // scale then snaps outward to the configured minor y ticksize. The runtime
    // scale is allowed to grow when new data exceeds the current bounds, but it
    // does not shrink on ordinary HA state updates. That keeps grid, labels and
    // the line on the same stable y-scale during the active period.
    const yTicksize = Number(this.runtimeConfig.y_axis.ticks_minor.ticksize);
    const sourceValues = this.series.map((item) => Number(item.state));
    const sourceMin = Math.min(...sourceValues);
    const sourceMax = Math.max(...sourceValues);
    const snappedMin = Math.floor(sourceMin / yTicksize) * yTicksize;
    const snappedMax = Math.ceil(sourceMax / yTicksize) * yTicksize;

    if (this.runtimeYScale === undefined) {
      this.runtimeYScale = { min: snappedMin, max: snappedMax };
    } else {
      this.runtimeYScale.min = Math.min(this.runtimeYScale.min, snappedMin);
      this.runtimeYScale.max = Math.max(this.runtimeYScale.max, snappedMax);
    }

    this.Graph.min = this.runtimeYScale.min;
    this.Graph.max = this.runtimeYScale.max;

    this.linePath = this.Graph.getPath();
    this.areaPath = this.Graph.getArea(this.linePath);
    this.gradient[0] = this.Graph.computeGradient(
      computeThresholds(this.runtimeConfig.sparkline.colorstops.colors, this.runtimeConfig.sparkline.colorstops_transition),
      this.runtimeConfig.sparkline.state_values.logarithmic,
    );
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
    const sortedSeries = series.concat().sort((a, b) => new Date(a.last_changed).getTime() - new Date(b.last_changed).getTime());
    const values = sortedSeries.map((item) => Number(item.state));
    const min = Math.min(...values);
    const max = Math.max(...values);
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

    return { min, avg, max };
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
    const x = point.x;

    return Math.max(0, Math.min(x, this.svg.width));
  }

  /**
   * Updates active pointer state for indicator/snake rendering.
   *
   * @param {MouseEvent|TouchEvent|PointerEvent} e - Browser interaction event.
   */
  updateActivePointer(e) {
    this.activeX = this.pointToGraphX(this.mouseEventToPoint(e));
  }

  /**
   * Attaches the proven slider pointer handlers to the sparkline SVG after Lit
   * has rendered the element.
   */
  attachPointerHandlers() {
    this.elements.svg = this.card.shadowRoot.getElementById(`sparkline-${this.cardId}-${this.index}`);

    if (!this.elements.svg || this.elements.svg.dataset.pointerReady === 'true') return;

    function Frame2() {
      this.rid = window.requestAnimationFrame(Frame2.bind(this));
      this.card.requestUpdate();
    }

    function pointerMove(e) {
      e.preventDefault();

      if (this.dragging) {
        this.updateActivePointer(e);
        Frame2.call(this);
      }
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
      this.updateActivePointer(e);
      Frame2.call(this);
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

      if (this.rid) {
        window.cancelAnimationFrame(this.rid);
        this.rid = null;
      }

      this.card.requestUpdate();
    }

    function hoverMove(e) {
      if (this.dragging) return;

      this.updateActivePointer(e);
      this.card.requestUpdate();
    }

    function hoverLeave() {
      if (this.dragging) return;

      this.activeX = undefined;
      this.card.requestUpdate();
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
          ${gradient.map((stop) => svg`
            <stop stop-color=${stop.color} offset=${`${stop.offset}%`}></stop>
          `)}
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
    return Merge.mergeDeep(
      this.getStyles({ fill: 'none' }),
      ConfigHelper.toStyleDict(this.runtimeConfig.line?.styles),
    );
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
   * Builds x-axis ticks from the configured period and ticksize. The current
   * today period renders the full 00:00 -> 24:00 range so grid and labels stay
   * stable while the day progresses.
   *
   * @param {string} level - major or minor.
   * @returns {Array<object>} X-axis ticks.
   */
  buildXAxisTicks(level) {
    const ticksize = this.xTicksizeToHours(this.runtimeConfig.x_axis[`ticks_${level}`].ticksize);
    const ticks = [];

    for (let hour = 0; hour <= 24; hour += ticksize) {
      const x = this.Graph.drawArea.x + (hour / 24) * this.Graph.drawArea.width;
      const wholeHours = Math.floor(hour);
      const minutes = Math.round((hour - wholeHours) * 60);
      const label = `${String(wholeHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

      ticks.push({ axis: 'x', level, value: hour, x, label });
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
    const ticksize = Number(this.runtimeConfig.y_axis[`ticks_${level}`].ticksize);
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
        ${xTicks.map((tick) => svg`
          <line
            class="sparkline-grid-line sparkline-grid-line--x-major"
            x1="${tick.x}"
            y1="${this.Graph.drawArea.y}"
            x2="${tick.x}"
            y2="${this.Graph.drawArea.y + this.Graph.drawArea.height}"
            style=${styleMap(xStyles)}
          ></line>
        `)}
      </g>
      <g class="sparkline-grid sparkline-grid--y" style="pointer-events:none;">
        ${yTicks.map((tick) => svg`
          <line
            class="sparkline-grid-line sparkline-grid-line--y-major"
            x1="${this.Graph.drawArea.x}"
            y1="${tick.y}"
            x2="${this.Graph.drawArea.x + this.Graph.drawArea.width}"
            y2="${tick.y}"
            style=${styleMap(yStyles)}
          ></line>
        `)}
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
        ${xTicks.map((tick) => svg`
          <line
            class="sparkline-tickmark sparkline-tickmark--x-major"
            x1="${tick.x}"
            y1="${this.Graph.drawArea.y + this.Graph.drawArea.height}"
            x2="${tick.x}"
            y2="${this.Graph.drawArea.y + this.Graph.drawArea.height + xTickSize}"
            style=${styleMap(xStyles)}
          ></line>
        `)}
      </g>
      <g class="sparkline-tickmarks sparkline-tickmarks--y" style="pointer-events:none;">
        ${yTicks.map((tick) => svg`
          <line
            class="sparkline-tickmark sparkline-tickmark--y-major"
            x1="${this.Graph.drawArea.x - yTickSize}"
            y1="${tick.y}"
            x2="${this.Graph.drawArea.x}"
            y2="${tick.y}"
            style=${styleMap(yStyles)}
          ></line>
        `)}
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
        ${xTicks.map((tick) => svg`
          <text
            class="sparkline-label sparkline-label--x"
            x="${tick.x}"
            y="${this.Graph.drawArea.y + this.Graph.drawArea.height + Utils.calculateSvgDimension(this.runtimeConfig.x_axis.labels.offset)}"
            style=${styleMap(xStyles)}
          >${tick.label}</text>
        `)}
      </g>
      <g class="sparkline-labels sparkline-labels--y" style="pointer-events:none;">
        ${yTicks.map((tick) => svg`
          <text
            class="sparkline-label sparkline-label--y"
            x="${this.Graph.drawArea.x - Utils.calculateSvgDimension(this.runtimeConfig.y_axis.labels.offset)}"
            y="${tick.y}"
            style=${styleMap(yStyles)}
          >${tick.label}</text>
        `)}
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
    return Merge.mergeDeep(
      this.getStyles({}),
      ConfigHelper.toStyleDict(this.runtimeConfig.area?.styles),
    );
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
   * Renders a minimal active indicator. The later snake uses the same pointer
   * state, but must be added through SparklineGraph segment-path support.
   *
   * @returns {TemplateResult|string} Active indicator SVG.
   */
  renderActiveIndicator() {
    if (this.activeX === undefined) return '';

    return svg`
      <line
        class="sparkline-active-indicator"
        x1="${this.activeX}"
        y1="0"
        x2="${this.activeX}"
        y2="${this.svg.height}"
        style="stroke:var(--primary-text-color);stroke-width:1;opacity:0.45;pointer-events:none;"
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
          ${this.renderArea()}
          ${this.renderLine()}
          ${this.renderActiveIndicator()}
          ${this.renderTickmarks()}
          ${this.renderAxisLabels()}
        </svg>
      </g>
    `;

    return this.renderItemLayers(content);
  }
}
