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
    this.linePath = this.Graph.getPath();
    this.areaPath = this.Graph.getArea(this.linePath);
    this.gradient[0] = this.Graph.computeGradient(
      computeThresholds(this.runtimeConfig.sparkline.colorstops.colors, this.runtimeConfig.sparkline.colorstops_transition),
      this.runtimeConfig.sparkline.state_values.logarithmic,
    );
    this.stats = this.calculateStatistics(this.series);
  }

  /**
   * Calculates min/avg/max from the same graph series. These values become local
   * fhs_sparkline entities in the next implementation step.
   *
   * @param {Array<object>} series - Current graph series.
   * @returns {object} Graph statistics.
   */
  calculateStatistics(series) {
    const values = series.map((item) => Number(item.state));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, value) => sum + value, 0) / values.length;

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
          ${this.renderArea()}
          ${this.renderLine()}
          ${this.renderActiveIndicator()}
        </svg>
      </g>
    `;

    return this.renderItemLayers(content);
  }
}
