import test from 'node:test';
import assert from 'node:assert/strict';
import SparklineGraphTool from '../src/sparkline-graph-tool.js';

const FIXED_NOW = Date.parse('2026-09-26T11:59:59.000Z');

/** Keeps pointer listeners and animation frames observable without replacing graph behavior. */
class PointerWindow extends EventTarget {
  constructor() {
    super();
    this.frames = new Map();
    this.cancelledFrames = [];
    this.listeners = new Map();
    this.nextFrame = 1;
  }

  addEventListener(type, listener, options) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(listener);
    super.addEventListener(type, listener, options);
  }

  removeEventListener(type, listener, options) {
    this.listeners.get(type)?.delete(listener);
    super.removeEventListener(type, listener, options);
  }

  listenerCount(type) {
    return this.listeners.get(type)?.size ?? 0;
  }

  matchMedia() {
    return { matches: false };
  }

  requestAnimationFrame(callback) {
    const id = this.nextFrame++;
    this.frames.set(id, callback);
    return id;
  }

  cancelAnimationFrame(id) {
    this.cancelledFrames.push(id);
    this.frames.delete(id);
  }

  clearTimeout() {}

  flushFrames() {
    while (this.frames.size > 0) {
      const pendingFrames = [...this.frames.entries()];
      this.frames.clear();
      pendingFrames.forEach(([, callback]) => callback(0));
    }
  }
}

/** Supplies only the SVG, tooltip and event-boundary methods used by GraphTool. */
class PointerNode extends EventTarget {
  constructor(rect = { left: 0, top: 0, width: 300, height: 300 }) {
    super();
    this.rect = rect;
    this.dataset = {};
    this.attributes = new Map();
    this.listeners = new Map();
    this.style = {
      display: 'none',
      visibility: 'hidden',
      setProperty(name, value) {
        this[name] = value;
      },
      removeProperty(name) {
        delete this[name];
      },
    };
    this.closestResult = undefined;
    this.bins = [];
  }

  addEventListener(type, listener, options) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(listener);
    super.addEventListener(type, listener, options);
  }

  removeEventListener(type, listener, options) {
    this.listeners.get(type)?.delete(listener);
    super.removeEventListener(type, listener, options);
  }

  listenerCount(type) {
    return this.listeners.get(type)?.size ?? 0;
  }

  getBoundingClientRect() {
    return this.rect;
  }

  createSVGPoint() {
    const point = {
      matrixTransform() {
        return { x: point.x, y: point.y };
      },
    };
    return point;
  }

  getScreenCTM() {
    return { inverse: () => ({}) };
  }

  closest() {
    return this.closestResult;
  }

  querySelectorAll() {
    return this.bins;
  }

  setAttribute(name, value) {
    this.attributes.set(name, value);
  }
}

/** Installs a deterministic browser boundary while leaving tool and graph instances real. */
function installPointerEnvironment() {
  const NativeDate = globalThis.Date;
  const previousWindow = globalThis.window;
  const pointerWindow = new PointerWindow();

  globalThis.Date = class extends NativeDate {
    constructor(...args) {
      super(...(args.length === 0 ? [FIXED_NOW] : args));
    }

    static now() {
      return FIXED_NOW;
    }
  };
  globalThis.window = pointerWindow;

  return {
    pointerWindow,
    restore() {
      globalThis.Date = NativeDate;
      globalThis.window = previousWindow;
    },
  };
}

/** Creates one real graph tool with accepted history or a current real-time sample. */
function createPointerFixture(context, pointerWindow, { chartType = 'line', periodType = 'rolling_window', offset = 0, dynamicChartType = false } = {}) {
  let selectedChartType = chartType;
  const entity = {
    entity_id: 'sensor.pointer_test',
    state: '42',
    last_changed: '2026-09-26T11:55:00.000Z',
    attributes: { friendly_name: 'Pointer test', unit_of_measurement: 'W' },
  };
  const rollingWindow = {
    offset,
    duration: { hour: 4 },
    bins: { per_hour: 1, density: 'medium' },
  };
  const config = {
    id: 'pointer-test',
    entity_index: 0,
    xpos: 50,
    ypos: 50,
    width: 80,
    height: 48,
    margin: 0,
    name: dynamicChartType ? '[[[ runtime chart selector ]]]' : undefined,
    period: periodType === 'real_time' ? { type: 'real_time' } : { type: periodType, [periodType]: structuredClone(rollingWindow) },
    sparkline: {
      show: {
        chart_type: dynamicChartType ? 'line' : chartType,
        chart_variant: 'line',
        grid: false,
        axis: false,
        tickmarks: false,
        labels: false,
        legend: false,
      },
      state_values: { aggregate_func: periodType === 'real_time' ? 'last' : 'avg' },
      radial: { arc_degrees: 360, rotate: 0, size: 12 },
      radial_barcode: { arc_degrees: 360, rotate: 0, size: 5 },
      bar: {
        orientation: 'horizontal',
        foreground: { show: { item_style: 'fixed' }, styles: { fill: '#42a5f5' } },
      },
      color_stops: {
        scales: { default: { min: 0, max: 100 } },
        colors: [
          { value: 0, color: '#42a5f5' },
          { value: 50, color: '#f9a825' },
          { value: 100, color: '#ef5350' },
        ],
      },
    },
    y_axis: { lower_bound: 0, upper_bound: 100 },
  };
  const templates = {
    hasJavascriptTemplates(value) {
      return JSON.stringify(value).includes('[[[');
    },
    getJsTemplateOrValue(value) {
      const evaluated = structuredClone(value);
      evaluated.name = 'Pointer test';
      evaluated.sparkline.show.chart_type = selectedChartType;
      return evaluated;
    },
  };
  const card = {
    config: { entities: [{}] },
    evaluateJavascriptTemplates: true,
    dev: { debug: false, fakeData: false },
    entities: [entity],
    resolvedEntityConfigs: [{}],
    _hass: {
      locale: { language: 'en', time_format: '24' },
      config: { time_zone: 'UTC' },
      states: {},
      entities: { [entity.entity_id]: {} },
      callApi() {
        throw new Error('accepted test history must not request HA history');
      },
      localize(key) {
        return key.split('.').at(-1);
      },
      formatEntityStateToParts(_entity, state) {
        return [
          { type: 'value', value: String(state) },
          { type: 'unit', value: 'W' },
        ];
      },
      formatEntityAttributeValueToParts(_entity, attribute) {
        return [{ type: 'value', value: String(attribute) }];
      },
    },
    cardAnimations: { styles: { sparklines: [] } },
    cardLayout: {
      changedGroupIds: new Set(),
      calculateSvgCoordinatesInGroup: () => ({ xpos: 100, ypos: 100 }),
      groupManager: { getGroupChainForItem: () => [] },
      masksClips: { applyGradientRefs: (styles) => styles },
    },
    cardTheme: { modeChanged: false, getActiveColorStopMode: () => 'light' },
    cardEntities: { updateSparklineEntities() {} },
    cardTools: { getBySection: () => [] },
    requestUpdate() {},
    updateSparklineResult() {},
  };
  const tool = new SparklineGraphTool(config, 0, templates, 'pointer-test', card);
  tool.updateRuntimeConfig();

  const item = tool.sparklineSeries.primaryItem;
  item.entity = entity;
  item.entityConfig = card.resolvedEntityConfigs[0];
  tool.sparklineHistory.bindSeriesEntity(item);
  if (periodType !== 'real_time') {
    const historyDay = offset === 0 ? '2026-09-26' : '2026-09-25';
    const rows = [10, 20, 30, 40].map((state, index) => ({
      state: String(state),
      last_changed: `${historyDay}T${String(8 + index).padStart(2, '0')}:00:00.000Z`,
    }));
    tool.sparklineHistory.acceptHistoryRows(item, rows, tool.sparklineHistory.getSeriesRange(item));
  }
  tool.setEntities(card.resolvedEntityConfigs, card.entities);

  const svg = new PointerNode({ left: 0, top: 0, width: tool.svg.width, height: tool.svg.height });
  const container = new PointerNode({ left: 0, top: 0, width: 300, height: 300 });
  const tooltipTitle = { textContent: '' };
  const makeTooltipRow = () => ({
    children: [
      { textContent: '' },
      { children: [{ textContent: '' }, { textContent: '' }] },
    ],
  });
  const tooltipRows = [makeTooltipRow(), makeTooltipRow(), makeTooltipRow()];
  const tooltip = new PointerNode();
  tooltip.querySelector = () => tooltipTitle;
  tooltip.querySelectorAll = () => tooltipRows;
  const indicator = new PointerNode();
  const nodes = new Map([
    [`sparkline-pointer-test-0`, svg],
    ['container', container],
    ['sparkline-active-indicator-pointer-test-0', indicator],
    ['sparkline-tooltip-pointer-test-0', tooltip],
  ]);
  card.shadowRoot = { getElementById: (id) => nodes.get(id) };
  tool.attachPointerHandlers();

  context.after(() => tool.disconnected());

  return {
    card,
    indicator,
    item,
    nodes,
    pointerWindow,
    svg,
    tool,
    tooltip,
    get selectedChartType() {
      return selectedChartType;
    },
    setChartType(nextChartType) {
      selectedChartType = nextChartType;
      card.cardTheme.modeChanged = true;
      tool.updateRuntimeConfig();
      card.cardTheme.modeChanged = false;
      tool.setEntities(card.resolvedEntityConfigs, card.entities);
      tool.attachPointerHandlers();
    },
  };
}

/** Maps a real graph bucket into the fake SVG's client coordinate space. */
function pointerEventAtBucket(fixture, chartType, index, eventType = 'mousemove') {
  const { tool, svg } = fixture;
  const graph = tool.primaryGraph;
  const pointIndex = Math.min(index, graph.coords.length - 1);
  let point;

  if (chartType === 'radial') {
    const geometry = graph.getRadialGeometry();
    const radius = (geometry.innerRadius + geometry.outerRadius) / 2;
    point = graph.getRadialPoint(radius, graph.getRadialAngleForBin(pointIndex));
    svg.closestResult = undefined;
  } else if (chartType === 'radial_barcode') {
    point = { x: graph.drawArea.x + graph.drawArea.width / 2, y: graph.drawArea.y + graph.drawArea.height / 2 };
    svg.closestResult = { dataset: { pointIndex: String(pointIndex) } };
  } else {
    point = { x: graph.coords[pointIndex][0], y: graph.coords[pointIndex][1] };
    svg.closestResult = undefined;
  }

  return Object.assign(new Event(eventType, { cancelable: true }), {
    clientX: tool.graphArea.x + point.x,
    clientY: tool.graphArea.y + point.y,
  });
}

test('bound pointer callbacks follow the current line, radial and radial-barcode graph route', (context) => {
  const environment = installPointerEnvironment();
  const { pointerWindow } = environment;
  const fixture = createPointerFixture(context, pointerWindow, { dynamicChartType: true });
  context.after(environment.restore);
  const { tool, svg } = fixture;
  const routes = [];
  const updateRadial = tool.updateRadialActivePointer.bind(tool);
  const updatePointIndex = tool.getPointIndexFromX.bind(tool);

  ['pointerFrame', 'pointerMove', 'pointerDown', 'pointerUp', 'touchStart', 'mouseDown', 'hoverEnter', 'hoverMove', 'hoverLeave'].forEach((handler) => {
    assert.notStrictEqual(tool[handler], SparklineGraphTool.prototype[handler]);
  });

  tool.updateRadialActivePointer = (event) => {
    routes.push(tool.config.sparkline.show.chart_type);
    updateRadial(event);
  };
  tool.getPointIndexFromX = (x) => {
    routes.push('line');
    return updatePointIndex(x);
  };

  for (const chartType of ['line', 'radial', 'line', 'radial_barcode']) {
    tool.stopPointerInteraction();
    if (chartType !== fixture.selectedChartType) fixture.setChartType(chartType);
    const event = pointerEventAtBucket(fixture, chartType, 1);
    svg.dispatchEvent(event);
    pointerWindow.flushFrames();
    assert.equal(tool.tooltip.index, 1);
  }

  assert.deepEqual(routes, ['line', 'radial', 'line', 'radial_barcode']);
});

test('SVG replacement releases old handlers and binds the replacement only once', (context) => {
  const environment = installPointerEnvironment();
  const { pointerWindow } = environment;
  const fixture = createPointerFixture(context, pointerWindow);
  context.after(environment.restore);
  const { tool, svg: oldSvg, nodes } = fixture;
  let pointerCalls = 0;
  const updatePointer = tool.updateActivePointer.bind(tool);
  tool.updateActivePointer = (event) => {
    pointerCalls += 1;
    updatePointer(event);
  };

  tool.attachPointerHandlers();
  assert.equal(oldSvg.listenerCount('mousemove'), 1);
  assert.equal(oldSvg.dataset.pointerReady, 'true');

  const newSvg = new PointerNode({ left: 0, top: 0, width: tool.svg.width, height: tool.svg.height });
  nodes.set('sparkline-pointer-test-0', newSvg);
  tool.attachPointerHandlers();
  tool.attachPointerHandlers();

  assert.equal(oldSvg.listenerCount('mousemove'), 0);
  assert.equal(oldSvg.dataset.pointerReady, undefined);
  assert.equal(newSvg.listenerCount('mousemove'), 1);
  assert.equal(newSvg.dataset.pointerReady, 'true');

  oldSvg.dispatchEvent(pointerEventAtBucket(fixture, 'line', 1));
  assert.equal(pointerCalls, 0);
  assert.equal(pointerWindow.frames.size, 0);
  assert.equal(pointerWindow.listenerCount('pointermove'), 0);
  newSvg.dispatchEvent(pointerEventAtBucket(fixture, 'line', 1));
  assert.equal(pointerCalls, 1);
  assert.equal(tool.tooltip.index, 1);
});

test('pointerup, pointercancel, touchcancel and disconnect stop drag frames without a final calculation', async (context) => {
  const environment = installPointerEnvironment();
  const { pointerWindow } = environment;

  for (const ending of ['pointerup', 'pointercancel', 'touchcancel', 'disconnect']) {
    await context.test(ending, (subtest) => {
      const fixture = createPointerFixture(subtest, pointerWindow);
      const { tool, svg, tooltip, indicator } = fixture;
      let pointerCalculations = 0;
      const updatePointer = tool.updateActivePointer.bind(tool);
      tool.updateActivePointer = (event) => {
        pointerCalculations += 1;
        updatePointer(event);
      };

      const downType = ending === 'touchcancel' ? 'touchstart' : 'mousedown';
      const downEvent = Object.assign(new Event(downType, { cancelable: true }), {
        clientX: 25,
        clientY: 20,
        ...(ending === 'touchcancel' ? { touches: [{ clientX: 25, clientY: 20 }] } : {}),
      });
      svg.dispatchEvent(downEvent);
      pointerWindow.dispatchEvent(Object.assign(new Event('pointermove', { cancelable: true }), { clientX: 50, clientY: 24 }));
      const pendingId = tool.rid;
      const pendingFrame = pointerWindow.frames.get(pendingId);
      assert.notEqual(pendingId, null);
      assert.equal(tool.dragging, true);

      if (ending === 'disconnect') {
        tool.disconnected();
      } else {
        pointerWindow.dispatchEvent(new Event(ending, { cancelable: true }));
      }

      const calculationsAtEnd = pointerCalculations;
      assert.equal(tool.dragging, false);
      assert.equal(tool.pointerEvent, undefined);
      assert.deepEqual(tool.tooltip, {});
      assert.equal(tool.tooltipVisible, false);
      assert.equal(tool.rid, null);
      assert.equal(tool._radialRafId, null);
      assert.equal(pointerWindow.frames.has(pendingId), false);
      assert.equal(pointerWindow.cancelledFrames.includes(pendingId), true);
      assert.equal(pointerWindow.listenerCount('pointermove'), 0);
      assert.equal(pointerWindow.listenerCount('pointerup'), 0);
      assert.equal(pointerWindow.listenerCount('pointercancel'), 0);
      assert.equal(pointerWindow.listenerCount('touchcancel'), 0);
      assert.equal(tooltip.style.display, 'none');
      assert.equal(indicator.style.visibility, 'hidden');

      // A callback already handed to the browser must remain inert after cancellation.
      pendingFrame(0);
      assert.equal(pointerCalculations, calculationsAtEnd);
    });
  }
  context.after(environment.restore);
});

test('a queued radial hover frame cannot restore a tooltip after leaving the SVG', (context) => {
  const environment = installPointerEnvironment();
  const { pointerWindow } = environment;
  const fixture = createPointerFixture(context, pointerWindow, { chartType: 'radial' });
  context.after(environment.restore);
  const { tool, svg } = fixture;
  let pointerCalculations = 0;
  const updatePointer = tool.updateActivePointer.bind(tool);
  tool.updateActivePointer = (event) => {
    pointerCalculations += 1;
    updatePointer(event);
  };

  svg.dispatchEvent(pointerEventAtBucket(fixture, 'radial', 1));
  const pendingId = tool._radialRafId;
  const pendingFrame = pointerWindow.frames.get(pendingId);
  assert.notEqual(pendingId, null);

  svg.dispatchEvent(new Event('mouseleave'));
  const calculationsAfterLeave = pointerCalculations;
  assert.equal(tool.hovering, false);
  assert.equal(tool.tooltipVisible, false);
  assert.deepEqual(tool.tooltip, {});
  assert.equal(pointerWindow.frames.has(pendingId), false);

  pendingFrame(0);
  assert.equal(pointerCalculations, calculationsAfterLeave);
  assert.equal(tool.tooltipVisible, false);
});

test('a pending drag frame uses the latest pointer event and chart configuration', (context) => {
  const environment = installPointerEnvironment();
  const { pointerWindow } = environment;
  const fixture = createPointerFixture(context, pointerWindow);
  context.after(environment.restore);
  const { tool } = fixture;
  const routedEvents = [];
  tool.dragging = true;
  tool.updateRadialActivePointer = (event) => routedEvents.push(event);

  const firstEvent = pointerEventAtBucket(fixture, 'line', 0, 'pointermove');
  const latestEvent = pointerEventAtBucket(fixture, 'line', 2, 'pointermove');
  tool.pointerMove(firstEvent);
  const pendingId = tool.rid;
  tool.pointerMove(latestEvent);
  tool.config.sparkline.show.chart_type = 'radial';

  pointerWindow.flushFrames();

  assert.equal(routedEvents.length, 1);
  assert.strictEqual(routedEvents[0], latestEvent);
  assert.equal(tool.rid, null);
  assert.equal(pendingId !== null, true);
});

test('a normal radial data refresh recomputes the active selection through the radial route', (context) => {
  const environment = installPointerEnvironment();
  const { pointerWindow } = environment;
  const fixture = createPointerFixture(context, pointerWindow, { chartType: 'radial' });
  context.after(environment.restore);
  const { card, item, tool, svg } = fixture;
  const pointerEvent = pointerEventAtBucket(fixture, 'radial', 1);
  svg.dispatchEvent(pointerEvent);
  pointerWindow.flushFrames();
  assert.equal(tool.tooltipVisible, true);
  const priorValues = item.graph.coords.map((point) => point[2]);

  const radialEvents = [];
  const updateRadial = tool.updateRadialActivePointer.bind(tool);
  tool.updateRadialActivePointer = (event) => {
    radialEvents.push(event);
    updateRadial(event);
  };
  const changedEntity = {
    ...card.entities[0],
    state: '75',
    last_changed: '2026-09-26T11:58:00.000Z',
  };
  card.entities[0] = changedEntity;
  const changedRows = [15, 35, 55, 65].map((state, index) => ({
    state: String(state),
    last_changed: `2026-09-26T${String(8 + index).padStart(2, '0')}:00:00.000Z`,
  }));
  tool.sparklineHistory.acceptHistoryRows(item, changedRows, tool.sparklineHistory.getSeriesRange(item));
  tool.setEntities(card.resolvedEntityConfigs, card.entities);

  assert.deepEqual(radialEvents, [pointerEvent]);
  assert.notDeepEqual(item.graph.coords.map((point) => point[2]), priorValues);
  assert.equal(tool.tooltipVisible, true);
  assert.equal(tool.pointerEvent, pointerEvent);
});

test('accepted empty radial data clears the active selection and tooltip', (context) => {
  const environment = installPointerEnvironment();
  const { pointerWindow } = environment;
  const fixture = createPointerFixture(context, pointerWindow, { chartType: 'radial', offset: -1 });
  context.after(environment.restore);
  const { item, tool, svg } = fixture;
  svg.dispatchEvent(pointerEventAtBucket(fixture, 'radial', 1));
  pointerWindow.flushFrames();
  assert.equal(tool.tooltipVisible, true);
  assert.notEqual(tool.activePoint, undefined);

  tool.sparklineHistory.acceptHistoryRows(item, [], tool.sparklineHistory.getSeriesRange(item));
  tool.setEntities(fixture.card.resolvedEntityConfigs, fixture.card.entities);

  assert.equal(tool.sparklineSeries.dataState, 'empty');
  assert.equal(tool.hovering, false);
  assert.equal(tool.pointerEvent, undefined);
  assert.equal(tool.tooltipVisible, false);
  assert.deepEqual(tool.tooltip, {});
  assert.equal(tool.activePoint, undefined);
  assert.equal(fixture.indicator.style.visibility, 'hidden');
});

test('real-time bar, equalizer and graded retain tooltips without a selection indicator', (context) => {
  const environment = installPointerEnvironment();
  const { pointerWindow } = environment;

  for (const chartType of ['bar', 'equalizer', 'graded']) {
    const fixture = createPointerFixture(context, pointerWindow, { chartType, periodType: 'real_time' });
    const { svg, tool, tooltip } = fixture;
    svg.dispatchEvent(pointerEventAtBucket(fixture, chartType, 0));

    assert.equal(tool.tooltipVisible, true, `${chartType} tooltip stays available`);
    assert.equal(tool.tooltip.index, 0);
    assert.equal(tooltip.style.display, 'block');
    assert.equal(tool.renderActiveIndicator(), '', `${chartType} has no time-selection indicator`);
  }
  context.after(environment.restore);
});

test('historical line selection still renders its active indicator', (context) => {
  const environment = installPointerEnvironment();
  const { pointerWindow } = environment;
  const fixture = createPointerFixture(context, pointerWindow, { chartType: 'line' });
  context.after(environment.restore);
  const { indicator, svg, tool } = fixture;

  svg.dispatchEvent(pointerEventAtBucket(fixture, 'line', 1));

  assert.equal(tool.tooltipVisible, true);
  assert.equal(indicator.style.visibility, 'visible');
  assert.ok(tool.renderActiveIndicator().values.includes('visible'));
});

test('idle pointer dispatch schedules no frame, adds no global listeners or requests history', (context) => {
  const environment = installPointerEnvironment();
  const { pointerWindow } = environment;
  const fixture = createPointerFixture(context, pointerWindow);
  context.after(environment.restore);
  let historyRequests = 0;
  fixture.card._hass.callApi = () => { historyRequests += 1; };
  fixture.tool.disconnected();

  pointerWindow.dispatchEvent(new Event('pointermove', { cancelable: true }));
  fixture.svg.dispatchEvent(new Event('mousemove', { cancelable: true }));

  assert.equal(pointerWindow.frames.size, 0);
  assert.equal(fixture.svg.listenerCount('mousemove'), 0);
  assert.equal(pointerWindow.listenerCount('pointermove'), 0);
  assert.equal(pointerWindow.listenerCount('pointerup'), 0);
  assert.equal(pointerWindow.listenerCount('pointercancel'), 0);
  assert.equal(pointerWindow.listenerCount('touchcancel'), 0);
  assert.equal(historyRequests, 0);
});
