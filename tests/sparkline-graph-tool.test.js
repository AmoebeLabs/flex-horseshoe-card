import test from 'node:test';
import assert from 'node:assert/strict';
import SparklineGraphTool from '../src/sparkline-graph-tool.js';
import SparklineSeries from '../src/sparkline-series.js';
import SparklineGraph from '../src/sparkline-graph.js';
import SparklineHistory from '../src/sparkline-history.js';

/** Supplies inert GraphTool continuations when a test exercises History alone. */
const historyEvents = () => ({
  binBoundaryReached() {},
  seriesHistoryDue() {},
  dayNightHistoryDue() {},
});

/** Builds real sparkline owners with accepted rows and a fixed clock for routing checks. */
function createChangeDetectionTool(context, periodType) {
  const NativeDate = globalThis.Date;
  const previousWindow = globalThis.window;
  const now = NativeDate.parse('2026-09-26T11:59:59.000Z');
  globalThis.Date = class extends NativeDate {
    constructor(...args) {
      super(...(args.length === 0 ? [now] : args));
    }
    static now() {
      return now;
    }
  };
  globalThis.window = {
    matchMedia: () => ({ matches: false }),
    clearTimeout() {},
  };
  context.after(() => {
    globalThis.Date = NativeDate;
    globalThis.window = previousWindow;
  });

  const entity = {
    entity_id: 'sensor.temperature',
    state: periodType === 'real_time' ? '20.1' : '40',
    last_changed: '2026-09-26T11:00:00.000Z',
    attributes: { friendly_name: 'Temperature' },
  };
  const card = {
    config: { entities: [{}] },
    evaluateJavascriptTemplates: false,
    dev: { debug: false, fakeData: false },
    entities: [entity],
    runtimeEntityConfigs: [{ decimals: 0 }],
    _hass: {
      locale: { language: 'en', time_format: '24' },
      config: { time_zone: 'UTC' },
      callApi() {
        throw new Error('accepted rows must not request history');
      },
    },
    cardAnimations: { styles: { sparklines: [] } },
    cardLayout: {
      changedGroupIds: new Set(),
      calculateSvgCoordinatesInGroup: () => ({ xpos: 100, ypos: 100 }),
      groupManager: { getGroupChainForItem: () => [] },
      masksClips: { applyGradientRefs: (styles) => styles },
    },
    cardTheme: {
      modeChanged: false,
      getActiveColorStopMode: () => 'light',
      colorContext: { cacheReady: false },
    },
  };
  const period =
    periodType === 'real_time'
      ? { type: periodType }
      : {
          type: periodType,
          rolling_window: { offset: 0, duration: { hour: 4 }, bins: { per_hour: 1, density: 'medium' } },
        };
  const tool = new SparklineGraphTool(
    {
      id: 'change-detection',
      entity_index: 0,
      xpos: 50,
      ypos: 50,
      width: 80,
      height: 40,
      period,
      sparkline: {
        show: { chart_type: 'line' },
        line: { show: { item_style: 'fixed' }, styles: { stroke: '#1565c0', opacity: 1 } },
      },
    },
    0,
    { hasJavascriptTemplates: () => false },
    'test-card',
    card,
  );
  // History owns real Node boundary timers; close them before this fixture exits.
  context.after(() => tool.sparklineHistory.disconnected());
  tool.updateRuntimeConfig();
  const item = tool.sparklineSeries.primaryItem;
  item.entity = entity;
  item.entityConfig = card.runtimeEntityConfigs[0];
  tool.sparklineHistory.bindSeriesEntity(item);
  if (periodType !== 'real_time') {
    tool.sparklineHistory.acceptHistoryRows(
      item,
      [{ state: '10', last_changed: '2026-09-26T07:00:00.000Z' }, { state: '20', last_changed: '2026-09-26T09:00:00.000Z' }, { state: '30', last_changed: '2026-09-26T10:00:00.000Z' }, entity],
      tool.sparklineHistory.getSeriesRange(item),
    );
  }
  tool.setEntities(card.runtimeEntityConfigs, card.entities);
  // Commit initial measured axis margins before counting later configuration work.
  card.cardTheme.modeChanged = true;
  tool.updateRuntimeConfig();
  tool.setEntities(card.runtimeEntityConfigs, card.entities);
  card.cardTheme.modeChanged = false;
  return tool;
}

test('dynamic sparkline config preserves zero thresholds and clamps a calendar day', () => {
  const previousWindow = globalThis.window;
  const previousConsoleWarn = console.warn;
  const warnings = [];
  let dayNightMode = 'band';
  let gradeStops = [
    { value: 0, color: '#000000' },
    { value: 100, color: '#ffffff' },
  ];
  globalThis.window = {
    matchMedia: () => ({ matches: false }),
    clearTimeout() {},
  };
  console.warn = (message) => warnings.push(message);

  try {
    const templates = {
      hasJavascriptTemplates(value) {
        return JSON.stringify(value).includes('[[[');
      },
      getJsTemplateOrValue(value) {
        const evaluated = structuredClone(value);
        evaluated.period.type = 'calendar';
        evaluated.period.calendar.duration.hour = 6;
        evaluated.sparkline.day_night.mode = dayNightMode;
        evaluated.sparkline.color_stops.colors = structuredClone(gradeStops);
        return evaluated;
      },
    };
    const card = {
      evaluateJavascriptTemplates: true,
      dev: { debug: false },
      entities: [],
      _hass: {
        locale: { language: 'en', time_format: 'language' },
        config: { time_zone: 'UTC' },
      },
      cardLayout: {
        changedGroupIds: new Set(),
        calculateSvgCoordinatesInGroup: () => ({ xpos: 100, ypos: 100 }),
      },
      cardTheme: {
        modeChanged: false,
        getActiveColorStopMode: () => 'light',
        colorContext: { cacheReady: false },
      },
    };
    const config = {
      id: 'dynamic-period',
      entity_index: 0,
      xpos: 50,
      ypos: 50,
      width: 80,
      height: 40,
      margin: 0,
      period: {
        type: '[[[ return entities[0].state; ]]]',
        rolling_window: {
          duration: { hour: 24 },
          bins: { per_hour: 'auto', density: 'medium' },
        },
        calendar: {
          period: 'day',
          offset: 0,
          duration: { hour: '[[[ return 24; ]]]' },
          bins: { per_hour: 'auto', density: 'medium' },
        },
      },
      sparkline: {
        show: { chart_type: 'line' },
        color_stops: { colors: [] },
      },
    };

    const tool = new SparklineGraphTool(config, 0, templates, 'test-card', card);

    assert.equal(tool.sparklineSeries, undefined);
    assert.equal(tool.sparklineHistory, undefined);

    tool.updateRuntimeConfig();

    assert.equal(tool.config.period.type, 'calendar');
    assert.equal(tool.config.period.calendar.duration.hour, 24);
    assert.equal(tool.runtime.periodDurationAvailable, true);
    assert.notEqual(tool.primaryGraph, undefined);
    assert.deepEqual(warnings, ["[FHS sparkline] calendar day duration '6' hours is shorter than one day; using 24 hours"]);

    const activeGraph = tool.primaryGraph;
    tool.updateRuntimeConfig();

    assert.equal(tool.primaryGraph, activeGraph);
    assert.equal(warnings.length, 1);

    gradeStops = [
      { value: -10, color: '#1565c0' },
      { value: 0, color: '#d32f2f' },
    ];
    card.evaluateJavascriptTemplates = true;
    card.cardTheme.modeChanged = false;
    tool.updateRuntimeConfig();

    assert.equal(tool.geometry.gradeRanks[0].rangeMax[0], 0);

    card.evaluateJavascriptTemplates = true;
    dayNightMode = 'invalid';
    assert.throws(() => tool.updateRuntimeConfig(), /sparkline\.day_night\.mode must be background or band/);
  } finally {
    globalThis.window = previousWindow;
    console.warn = previousConsoleWarn;
  }
});

test('static sparkline settings are checked before runtime initialization', () => {
  const templates = { hasJavascriptTemplates: () => false };

  assert.throws(() => new SparklineGraphTool({ sparkline: { day_night: { mode: 'invalid' } } }, 0, templates, 'test-card', {}), /sparkline\.day_night\.mode must be background or band/);
  assert.throws(() => new SparklineGraphTool({ sparkline: { show: { chart_type: 'radial', chart_variant: 'line' }, radial: { size: 0 } } }, 0, templates, 'test-card', {}), /sparkline\.\.size must be greater than 0/);
});

test('calendar and rolling window use complete 24-hour default periods', () => {
  const previousWindow = globalThis.window;
  globalThis.window = {
    matchMedia: () => ({ matches: false }),
    clearTimeout() {},
  };

  try {
    const templates = {
      hasJavascriptTemplates: () => false,
    };
    const card = {
      evaluateJavascriptTemplates: false,
      dev: { debug: false },
      entities: [],
      _hass: {
        locale: { language: 'en', time_format: 'language' },
        config: { time_zone: 'UTC' },
      },
      cardLayout: {
        changedGroupIds: new Set(),
        calculateSvgCoordinatesInGroup: () => ({ xpos: 100, ypos: 100 }),
      },
      cardTheme: {
        modeChanged: false,
        getActiveColorStopMode: () => 'light',
        colorContext: { cacheReady: false },
      },
    };

    ['calendar', 'rolling_window'].forEach((periodType, index) => {
      const tool = new SparklineGraphTool(
        {
          id: `default-${periodType}`,
          entity_index: 0,
          period: {
            type: periodType,
          },
          sparkline: {
            show: { chart_type: 'line' },
          },
        },
        index,
        templates,
        'test-card',
        card,
      );

      assert.equal(tool.config.period[periodType].duration.hour, 24);
      assert.equal(tool.config.period[periodType].bins.per_hour, 'auto');
      assert.equal(tool.config.period[periodType].bins.density, 'medium');
      assert.equal(tool.primaryGraph.hours, 24);
    });
  } finally {
    globalThis.window = previousWindow;
  }
});

test('dynamic radial arc and rotation rebuild the graph with evaluated geometry', () => {
  const previousWindow = globalThis.window;
  let radialSize = 15;
  globalThis.window = {
    matchMedia: () => ({ matches: false }),
    clearTimeout() {},
  };

  try {
    const templates = {
      hasJavascriptTemplates(value) {
        return JSON.stringify(value).includes('[[[');
      },
      getJsTemplateOrValue(value) {
        const evaluated = structuredClone(value);
        evaluated.sparkline.radial.arc_degrees = 180;
        evaluated.sparkline.radial.rotate = -90;
        evaluated.sparkline.radial.size = radialSize;
        evaluated.sparkline.show.grid = false;
        return evaluated;
      },
    };
    const card = {
      evaluateJavascriptTemplates: true,
      dev: { debug: false },
      entities: [],
      _hass: {
        locale: { language: 'en', time_format: 'language' },
        config: { time_zone: 'UTC' },
      },
      cardLayout: {
        changedGroupIds: new Set(),
        calculateSvgCoordinatesInGroup: () => ({ xpos: 100, ypos: 100 }),
      },
      cardTheme: {
        modeChanged: false,
        getActiveColorStopMode: () => 'light',
        colorContext: { cacheReady: false },
      },
    };
    const config = {
      id: 'dynamic-radial',
      entity_index: 0,
      xpos: 50,
      ypos: 50,
      width: 80,
      height: 80,
      period: {
        type: 'rolling_window',
        rolling_window: {
          offset: 0,
          duration: { hour: 24 },
          bins: { per_hour: 1, density: 'medium' },
        },
      },
      sparkline: {
        show: { chart_type: 'radial', chart_variant: 'line', grid: false },
        radial: {
          arc_degrees: '[[[ return 180; ]]]',
          rotate: '[[[ return -90; ]]]',
          size: 15,
        },
      },
    };

    const tool = new SparklineGraphTool(config, 0, templates, 'test-card', card);
    assert.deepEqual(tool.config.sparkline.show.grid, { x: false, y: false });
    tool.updateRuntimeConfig();

    assert.equal(tool.config.sparkline.radial.arc_degrees, 180);
    assert.deepEqual(tool.config.sparkline.show.grid, { x: false, y: false });
    assert.equal(tool.config.sparkline.radial.rotate, -90);
    assert.equal(tool.config.sparkline.radial.size, 15);
    assert.equal(tool.config.sparkline.show.background, true);
    assert.equal(tool.config.sparkline.radial.background.styles.fill, 'var(--secondary-background-color)');
    assert.equal(tool.config.sparkline.line.line_width, 1);
    assert.equal(tool.getConfiguredLineWidth(tool.sparklineSeries.primaryItem.config), 2);
    assert.equal(tool.primaryGraph.getRadialGeometry().arcDegrees, 180);
    assert.equal(tool.primaryGraph.getRadialGeometry().rotate, -90);

    tool.geometry.legendMeasuredFontSize = 4;
    tool.geometry.legendMeasuredRowHeight = 5;
    tool.geometry.legendMeasuredSignature = '4|5';
    radialSize = 20;
    tool.updateRuntimeConfig();

    assert.equal(tool.config.sparkline.radial.size, 20);
    assert.equal(tool.geometry.legendMeasuredFontSize, 4);
    assert.equal(tool.geometry.legendMeasuredRowHeight, 5);
    assert.equal(tool.geometry.legendMeasuredSignature, '4|5');

    radialSize = 0;
    assert.throws(() => tool.updateRuntimeConfig(), /sparkline\.\.size must be greater than 0/);
  } finally {
    globalThis.window = previousWindow;
  }
});

test('real-time graded creates one current-value graph without historical bins', (context) => {
  const previousWindow = globalThis.window;
  globalThis.window = {
    matchMedia: () => ({ matches: false }),
    clearTimeout() {},
  };
  context.after(() => {
    globalThis.window = previousWindow;
  });

  const templates = {
    hasJavascriptTemplates: () => false,
  };
  const card = {
    evaluateJavascriptTemplates: false,
    dev: { debug: false },
    entities: [],
    cardLayout: {
      changedGroupIds: new Set(),
      calculateSvgCoordinatesInGroup: () => ({ xpos: 100, ypos: 100 }),
    },
    cardTheme: {
      modeChanged: false,
      getActiveColorStopMode: () => 'light',
      colorContext: { cacheReady: false },
    },
  };
  const config = {
    id: 'awair-graded',
    entity_index: 0,
    xpos: 50,
    ypos: 50,
    width: 80,
    height: 40,
    period: { real_time: true },
    sparkline: {
      show: { chart_type: 'graded' },
      colorstops: {
        colors: [
          { value: 0, color: '#66bb6a' },
          { value: 50, color: '#f9a825' },
        ],
      },
    },
  };

  const tool = new SparklineGraphTool(config, 0, templates, 'test-card', card);

  assert.equal(tool.config.period.type, 'real_time');
  assert.equal(tool.primaryGraph.points, 1);
  assert.equal(tool.primaryGraph.hours, 1);

  const currentEntity = {
    entity_id: 'sensor.awair_score',
    state: '42',
    last_changed: '2026-09-12T12:00:00.000Z',
  };
  tool.runtime.entity = currentEntity;
  tool.sparklineSeries.primaryItem.entity = currentEntity;
  tool.sparklineSeries.primaryItem.entityConfig = {};
  tool.sparklineSeries.primaryItem.rows = [{ state: 42 }];

  assert.doesNotThrow(() => tool.updateGraphFromSeries());

  const historicalConfig = structuredClone(config);
  historicalConfig.id = 'awair-graded-history';
  historicalConfig.period = {
    type: 'rolling_window',
    rolling_window: {
      offset: 0,
      duration: { hour: 24 },
      bins: { per_hour: 2, density: 'medium' },
    },
  };

  const historicalTool = new SparklineGraphTool(historicalConfig, 0, templates, 'test-card', card);

  assert.equal(historicalTool.config.period.type, 'rolling_window');
  assert.equal(historicalTool.primaryGraph.points, 2);
  assert.equal(historicalTool.primaryGraph.hours, 24);
});

test('legend position reserves a sibling area with matching orientation', () => {
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  tool.geometry.svg = { width: 200, height: 100 };
  tool.geometry.legendMeasuredFontSize = undefined;
  tool.geometry.legendMeasuredRowHeight = undefined;
  tool.geometry.legendMeasuredFontSize = undefined;
  tool.geometry.legendMeasuredRowHeight = undefined;

  const cases = [
    ['top', 'horizontal', { x: 0, y: 18, width: 200, height: 82 }, { x: 0, y: 0, width: 200, height: 16 }],
    ['bottom', 'horizontal', { x: 0, y: 0, width: 200, height: 82 }, { x: 0, y: 84, width: 200, height: 16 }],
    ['left', 'vertical', { x: 52, y: 0, width: 148, height: 100 }, { x: 0, y: 0, width: 50, height: 100 }],
    ['right', 'vertical', { x: 0, y: 0, width: 148, height: 100 }, { x: 150, y: 0, width: 50, height: 100 }],
  ];

  cases.forEach(([position, orientation, graphArea, legendArea]) => {
    tool.config = {
      sparkline: {
        show: { legend: true },
        legend: {
          position,
          orientation,
          width: 25,
          height: 8,
          gap: 1,
          marker_size: 1.5,
          line_height: 1.2,
          styles: { 'font-size': '0.55em' },
        },
      },
    };
    const layout = tool.calculateLegendLayout();
    assert.equal(layout.orientation, orientation);
    assert.deepEqual(layout.graphArea, graphArea);
    assert.deepEqual(layout.legendArea, legendArea);
  });
});

test('legend height follows fixed label font size and row count', () => {
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  tool.geometry.svg = { width: 200, height: 100 };
  tool.config = {
    sparkline: {
      show: { legend: true },
      legend: {
        position: 'top',
        orientation: 'horizontal',
        rows: 2,
        gap: 1,
        item_gap: 1,
        line_height: 1.2,
        marker_size: 1.5,
        styles: { 'font-size': '0.55em' },
      },
    },
  };

  const layout = tool.calculateLegendLayout();

  assert.equal(layout.legendArea.height, 7.92);
  assert.equal(layout.graphArea.y, 9.92);
  assert.equal(layout.graphArea.height, 90.08);
  assert.ok(Math.abs(layout.markerRadius - 1.65) < 1e-12);
});

test('legend measurement rebuilds marker and text positions in the same update', () => {
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  let legendPositionUpdates = 0;
  let cardUpdates = 0;
  Object.assign(tool, {
    config: {
      sparkline: {
        show: { legend: true },
        legend: { line_height: 1.2 },
      },
    },
    legendTextTools: [
      {
        widthOverflowPending: false,
        updated() {},
        textElement: { getBBox: () => ({ height: 4 }) },
      },
    ],
    sparklineSeries: { dataState: 'not_loaded' },
    calculateLegendLayout: () => ({ graphArea: { x: 0, y: 6, width: 100, height: 94 } }),
    updateRuntimeConfig() {},
    updateLegendTextTools() {
      legendPositionUpdates += 1;
    },
    card: {
      requestUpdate() {
        cardUpdates += 1;
      },
    },
    geometry: {
      legendMeasuredSignature: undefined,
    },
  });

  tool.updated();

  assert.equal(legendPositionUpdates, 1);
  assert.equal(cardUpdates, 1);
  assert.deepEqual(tool.geometry.graphArea, { x: 0, y: 6, width: 100, height: 94 });
});

test('legend waits for width ellipsis before measuring its visible text', () => {
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  let legendPositionUpdates = 0;
  let boundingBoxReads = 0;
  const legendTextTool = {
    widthOverflowPending: true,
    updated() {
      this.widthOverflowPending = false;
    },
    textElement: {
      getBBox() {
        boundingBoxReads += 1;
        return { height: 0 };
      },
    },
  };

  Object.assign(tool, {
    config: {
      sparkline: {
        show: { legend: true },
        legend: { line_height: 1.2 },
      },
    },
    legendTextTools: [legendTextTool],
    sparklineSeries: { dataState: 'not_loaded' },
    calculateLegendLayout: () => ({ graphArea: { x: 0, y: 6, width: 100, height: 94 } }),
    updateRuntimeConfig() {},
    updateLegendTextTools() {
      legendPositionUpdates += 1;
    },
    card: { requestUpdate() {} },
    geometry: {
      legendMeasuredSignature: undefined,
    },
  });

  tool.updated();

  assert.equal(boundingBoxReads, 0);
  assert.equal(legendPositionUpdates, 0);
  assert.equal(tool.geometry.legendMeasuredSignature, undefined);

  legendTextTool.textElement.getBBox = () => {
    boundingBoxReads += 1;
    return { height: 4 };
  };
  tool.updated();

  assert.equal(boundingBoxReads, 1);
  assert.equal(legendPositionUpdates, 1);
  assert.equal(tool.geometry.legendMeasuredFontSize, 4);
  assert.equal(tool.geometry.legendMeasuredRowHeight, 4.8);
});

test('area chart omits its line layers when show.line is false', () => {
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  Object.assign(tool, {
    cardId: 'test-card',
    index: 0,
    config: {
      sparkline: {
        show: { chart_type: 'area', item_style: 'fixed', line: false },
        line: { show: { item_style: 'fixed' } },
        colorstops: { colors: [] },
      },
    },
    sparklineSeries: { primaryItem: { entity: { state: '1' }, entityConfig: {}, paint: { colorStops: { scales: {}, colors: [] } }, graph: { coords: [[0, 0, 1]] } } },
    getLineStyles: () => ({
      stroke: 'red',
      'stroke-width': 1,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    }),
    getRenderStyles: (styles) => styles,
    geometry: {
      svg: { width: 100, height: 50 },
      graphArea: { width: 100, height: 50 },
    },
  });

  assert.equal(tool.renderSvgLineMask('M 0 0 L 100 50', 0), '');
  assert.equal(tool.renderSvgLineBackground('M 0 0 L 100 50', 0), '');

  tool.config.sparkline.show.line = true;

  assert.notEqual(tool.renderSvgLineMask('M 0 0 L 100 50', 0), '');
  assert.notEqual(tool.renderSvgLineBackground('M 0 0 L 100 50', 0), '');

  tool.getLineStyles = () => ({
    'stroke-width': 1,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-dasharray': '4 2',
  });
  const dashedMask = tool.renderSvgLineMask('M 0 0 L 100 50', 0);

  assert.match(dashedMask.strings.join(''), /stroke-dasharray/);
  assert.ok(dashedMask.values.includes('4 2'));
});

test('bar fade reverses at zero for positive and negative values', () => {
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  const primaryItem = {
    paint: { colorStops: { scales: {}, colors: [] } },
    graph: { width: 100, height: 50 },
  };
  Object.assign(tool, {
    cardId: 'test-card',
    index: 3,
    config: {
      period: { type: 'rolling_window' },
      sparkline: {
        animate: false,
        show: { chart_type: 'bar', fill: 'fade' },
        bar: {
          orientation: 'vertical',
          foreground: { show: { item_style: 'auto' }, styles: {} },
        },
      },
    },
    sparklineSeries: {
      items: [primaryItem],
      primaryItem,
    },
    computeColor: (value) => (value >= 0 ? 'red' : 'blue'),
    getRenderStyles: (styles) => styles,
  });

  const rendered = tool.renderSvgBars(
    [
      { x: 1, y: 2, width: 3, height: 4, value: 5 },
      { x: 6, y: 7, width: 3, height: 4, value: -5 },
    ],
    0,
  );
  const gradients = tool.renderBarFadeGradients([{ value: 5 }, { value: -5 }], 0, tool.config, 0);

  assert.deepEqual(gradients[0].values.slice(1, 3), ['0%', '100%']);
  assert.equal(gradients[0].values[0], 'bar-fill-fade-test-card-3-0-0');
  assert.deepEqual(gradients[1].values.slice(1, 3), ['100%', '0%']);
  assert.equal(gradients[1].values[0], 'bar-fill-fade-test-card-3-0-1');
  assert.equal(tool.renderSvgBarsBackground([{ value: 5 }], 0), '');
});

test('area fade uses the fixed color belonging to each series', () => {
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  const lineColors = ['#1565c0', '#d32f2f'];
  const makeItem = (id) => ({
    id,
    dataState: 'has_data',
    entity: { state: '20' },
    entityConfig: {},
    graph: { coords: [[0, 0, 20]], drawArea: { width: 80, height: 40 } },
    paint: { colorStops: { scales: {}, colors: [] } },
    config: {
      sparkline: {
        show: { chart_type: 'area', item_style: 'auto', fill: 'fade' },
        line_color: lineColors,
        area: { show: { item_style: 'auto' }, styles: { fill: lineColors[0] } },
      },
    },
  });

  Object.assign(tool, {
    cardId: 'test-card',
    index: 2,
    sparklineSeries: { items: [makeItem('first'), makeItem('second')] },
  });

  const gradients = tool.renderSeriesAreaGradients();

  assert.ok(gradients[0].values.includes('#1565c0'));
  assert.ok(gradients[1].values.includes('#d32f2f'));
});

test('graph paint selection preserves fixed styles and selects color stops from the supplied current value', () => {
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  tool.card = { cardTheme: { colorContext: { cacheReady: false } } };
  const config = {
    sparkline: {},
  };
  const colorStops = { scales: {}, colors: [{ value: 0, color: '#000000' }, { value: 100, color: '#ffffff' }] };

  assert.equal(tool.getConfiguredSparklinePaint(config, colorStops, 'auto', 50, 'red', 'gradient', 'automatic'), 'automatic');
  assert.equal(tool.getConfiguredSparklinePaint(config, colorStops, 'fixed', 50, 'red', 'gradient', 'automatic'), 'red');
  assert.equal(tool.getConfiguredSparklinePaint(config, colorStops, 'colorstop', 50, 'red', 'gradient', 'automatic'), '#000000');
  assert.notEqual(tool.getConfiguredSparklinePaint(config, colorStops, 'colorstopinterpolated', 50, 'red', 'gradient', 'automatic'), '#000000');
  assert.equal(tool.getConfiguredSparklinePaint(config, colorStops, 'colorstopgradient', 50, 'red', 'gradient', 'automatic'), 'gradient');
});

test('single-color graph paint follows the current entity state instead of the last aggregate bin', () => {
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  const paintValues = [];
  Object.assign(tool, {
    cardId: 'test-card',
    index: 0,
    config: {
      sparkline: {
        show: { item_style: 'colorstopinterpolated' },
      },
    },
    sparklineSeries: {
      primaryItem: {
        entity: { state: '25' },
        paint: { colorStops: { scales: {}, colors: [{ value: 0, color: 'blue' }, { value: 100, color: 'green' }] } },
        graph: { coords: [[0, 0, 75]] },
      },
    },
    getEntityNumericState: (item, entity) => Number(entity.state),
    getConfiguredSparklinePaint: (config, colorStops, itemStyle, value) => {
      paintValues.push(value);
      return 'selected-color';
    },
  });

  assert.equal(tool.getSparklineBackgroundPaint({ stroke: 'red' }, 'colorstopinterpolated'), 'selected-color');
  assert.deepEqual(paintValues, [25]);
});

test('explicit Cartesian gradients use each series graph scale', () => {
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  const gradientCalls = [];
  const makeItem = (id, itemStyle) => ({
    id,
    dataState: 'has_data',
    paint: { colorStops: { scales: {}, colors: [{ value: 0, color: 'black' }, { value: 100, color: 'white' }] } },
    graph: {
      computeGradient: (thresholds, logarithmic) => {
        gradientCalls.push([id, thresholds, logarithmic]);
        return [
          { color: `${id}-low`, offset: 0 },
          { color: `${id}-high`, offset: 100 },
        ];
      },
    },
    config: {
      sparkline: {
        show: { chart_type: 'line', item_style: itemStyle },
        line: { show: { item_style: itemStyle }, minmax: { show: { item_style: itemStyle } } },
        area: { show: { item_style: itemStyle }, minmax: { show: { item_style: itemStyle } } },
        colorstops_transition: 'smooth',
        state_values: { logarithmic: false },
      },
    },
  });

  Object.assign(tool, {
    cardId: 'test-card',
    index: 7,
    sparklineSeries: { items: [makeItem('temperature', 'colorstopgradient'), makeItem('humidity', 'fixed')] },
  });

  const gradients = tool.renderSeriesCartesianColorGradients();

  assert.equal(gradientCalls.length, 1);
  assert.ok(gradients[0].values.includes('cartesian-series-color-test-card-7-temperature'));
  assert.equal(gradients[1], '');
});

test('cartesian series render stored paths and independently enabled minmax envelopes', () => {
  const makeItem = (id, chartType, showMinMax, color) => ({
    id,
    dataState: 'has_data',
    entity: { state: '10' },
    entityConfig: {},
    paint: { colorStops: { scales: {}, colors: [] } },
    graph: {
      coords: [[0, 0, 10]],
      getPath() {
        assert.fail('rendering must reuse the stored line path');
      },
      getArea() {
        assert.fail('rendering must reuse the stored area path');
      },
      getPathMin() {
        assert.fail('rendering must reuse the stored minmax path');
      },
      getPathMax() {
        assert.fail('rendering must reuse the stored minmax path');
      },
      getAreaMinMax() {
        assert.fail('rendering must reuse the stored minmax path');
      },
      calculateYCoordinates() {
        assert.fail('rendering must reuse the stored points');
      },
    },
    config: {
      color,
      sparkline: {
        show: { chart_type: chartType, item_style: 'auto', fill: 'solid', line: true, points: false },
        line_color: [color, color, color],
        line: { line_width: 1, styles: {}, show_dots: false, show: { item_style: 'auto', minmax: chartType === 'line' && showMinMax }, minmax: { show: { item_style: 'auto' }, styles: { opacity: 0.25 } } },
        area: { show_dots: false, show: { item_style: 'auto', minmax: chartType === 'area' && showMinMax }, minmax: { show: { item_style: 'auto' } }, styles: { opacity: 0.25 } },
        dots: { radius: 1, styles: { fill: color, stroke: color } },
      },
    },
  });
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  Object.assign(tool, {
    cardId: 'test-card',
    index: 6,
    sparklineSeries: {
      items: [makeItem('line-range', 'line', true, '#1565c0'), makeItem('area-range', 'area', true, '#d32f2f'), makeItem('line-only', 'line', false, '#66bb6a')],
    },
    getConfiguredLineWidth: () => 1,
    getRenderStyles: (styles) => styles,
    geometry: {
      line: ['line-range-line', 'area-range-line', 'line-only-line'],
      area: [undefined, 'area-range-area'],
      areaMinMax: ['line-range-minmax', 'area-range-minmax'],
      points: [],
    },
  });

  const renderedItems = tool.renderSeriesCartesian().values[0];

  assert.match(renderedItems[0].values[1].strings.join(''), /sparkline-series-minmax/);
  assert.match(renderedItems[1].values[1].strings.join(''), /sparkline-series-minmax/);
  assert.equal(renderedItems[2].values[1], '');
});

test('single line minmax uses only the line styles', () => {
  const paintSources = [];
  let renderedStyles;
  let renderedFilters;
  let areaStyleCalls = 0;
  const lineStyles = { stroke: 'red', 'stroke-width': 2, opacity: 0.8 };
  const areaStyles = { fill: 'blue', opacity: 0.2 };
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  Object.assign(tool, {
    cardId: 'test-card',
    index: 4,
    config: {
      sparkline: {
        show: { chart_type: 'line' },
        line: {
          color_filter: { brightness: 1.2 },
          show: { item_style: 'fixed' },
          minmax: {
            color_filter: { brightness: 0.7 },
            show: { item_style: 'colorstopinterpolated' },
            styles: { opacity: 0.4 },
          },
        },
      },
    },
    getLineStyles: () => lineStyles,
    getAreaStyles: () => {
      areaStyleCalls += 1;
      return { ...areaStyles };
    },
    getSparklineBackgroundPaint: (styles) => {
      paintSources.push({ ...styles });
      return styles.stroke;
    },
    getRenderStyles: (styles, filters) => {
      renderedStyles = styles;
      renderedFilters = filters;
      return styles;
    },
    geometry: {
      graphArea: { width: 80, height: 40 },
    },
  });

  tool.renderSvgAreaMinMaxBackground('M 0,0 z', 0);

  assert.deepEqual(paintSources[0], {
    stroke: 'red',
    'stroke-width': 2,
    opacity: '0.4',
  });
  assert.equal(areaStyleCalls, 0);
  assert.equal(lineStyles.opacity, 0.8);
  assert.equal(renderedStyles.fill, 'red');
  assert.equal(renderedStyles.stroke, 'none');
  assert.equal(renderedStyles.opacity, '0.4');
  assert.deepEqual(renderedFilters, [{ brightness: 0.7 }]);
});

test('single line and its minmax band select paint independently', () => {
  const paintChoices = [];
  const filterChoices = [];
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  Object.assign(tool, {
    cardId: 'test-card',
    index: 5,
    config: {
      sparkline: {
        show: { chart_type: 'line', line: true },
        line: {
          color_filter: { saturation: 0.8 },
          show: { item_style: 'fixed' },
          styles: { stroke: 'white', opacity: 0.8 },
          minmax: {
            color_filter: { brightness: 0.6 },
            show: { item_style: 'colorstopinterpolated' },
            styles: { opacity: 0.15 },
          },
        },
      },
    },
    getLineStyles: () => ({ stroke: 'white', 'stroke-width': 1, opacity: 0.8 }),
    getSparklineBackgroundPaint: (styles, itemStyle) => {
      paintChoices.push([itemStyle, styles.stroke]);
      return itemStyle === 'fixed' ? styles.stroke : 'interpolated-color';
    },
    getRenderStyles: (styles, filters) => {
      filterChoices.push(filters);
      return styles;
    },
    geometry: {
      graphArea: { width: 80, height: 40 },
    },
  });

  tool.renderSvgLineBackground('M 0,0 L 80,40', 0);
  tool.renderSvgAreaMinMaxBackground('M 0,0 z', 0);

  assert.deepEqual(paintChoices, [
    ['fixed', 'white'],
    ['colorstopinterpolated', 'white'],
  ]);
  assert.deepEqual(filterChoices, [[{ saturation: 0.8 }], [{ brightness: 0.6 }]]);
});

test('radial area fade follows the visible zero radius', () => {
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  const graph = {
    min: -10,
    max: 10,
    getRadialGeometry: () => ({ centerX: 50, centerY: 50, outerRadius: 40 }),
    getRadialRadiusForValue: (value) => (value + 10) * 2,
  };
  Object.assign(tool, {
    cardId: 'test-card',
    index: 4,
    sparklineSeries: {
      items: [
        {
          id: 'temperature',
          dataState: 'has_data',
          graph,
          config: {
            sparkline: {
              show: { chart_type: 'radial', chart_variant: 'area', fill: 'fade' },
            },
          },
        },
      ],
    },
    geometry: {
      graphArea: { width: 100, height: 100 },
    },
  });

  const masks = tool.renderSeriesRadialAreaMasks();

  assert.match(masks[0].strings.join(''), /radialGradient/);
  assert.ok(masks[0].values.includes('50%'));
  assert.ok(masks[0].values.includes('radial-area-fade-mask-test-card-4-temperature'));
});

test('radial series render all areas below every line and point', () => {
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  const makeItem = (id, variant, color) => ({
    id,
    dataState: 'has_data',
    entity: { state: '30' },
    entityConfig: {},
    graph: {
      coords: [[0, 0, 30]],
      getRadialPath: () => `${id}-line`,
      getRadialArea: () => `${id}-area`,
      getRadialMinMaxArea: () => `${id}-minmax`,
      getRadialPoints: () => [[10, 20, 30]],
    },
    paint: { colorStops: { scales: {}, colors: [] } },
    config: {
      color,
      sparkline: {
        show: {
          chart_variant: variant,
          item_style: 'auto',
          fill: 'solid',
          line: variant !== 'dots',
          points: variant === 'dots',
        },
        colorstops_transition: 'hard',
        line_color: [color, color, color],
        line: { line_width: 1, styles: {}, show_dots: false, show: { item_style: 'auto', minmax: variant === 'line' }, minmax: { show: { item_style: 'auto' }, styles: { opacity: 0.25 } } },
        area: { show_dots: false, show: { item_style: 'auto', minmax: variant === 'area' }, minmax: { show: { item_style: 'auto' } }, styles: {} },
        dots: { radius: 1, styles: { fill: color, stroke: color } },
      },
    },
  });

  Object.assign(tool, {
    cardId: 'test-card',
    index: 5,
    card: { cardTheme: { colorContext: { cacheReady: false } } },
    sparklineSeries: {
      items: [makeItem('line-first', 'line', '#1565c0'), makeItem('area-second', 'area', '#d32f2f'), makeItem('dots-third', 'dots', '#66bb6a')],
    },
    getRenderStyles: (styles) => styles,
  });

  const rendered = tool.renderSeriesRadial();
  const minMaxLayers = rendered.values[0];
  const areaLayers = rendered.values[1];
  const lineLayers = rendered.values[2];
  const pointLayers = rendered.values[3];

  assert.match(minMaxLayers[0].strings.join(''), /sparkline-radial-minmax/);
  assert.match(minMaxLayers[1].strings.join(''), /sparkline-radial-minmax/);
  assert.equal(minMaxLayers[2], '');
  assert.equal(areaLayers[0], '');
  assert.match(areaLayers[1].strings.join(''), /sparkline-radial-area/);
  assert.match(lineLayers[0].strings.join(''), /sparkline-radial-line/);
  assert.match(lineLayers[1].strings.join(''), /sparkline-radial-line/);
  assert.match(pointLayers[2][0].strings.join(''), /sparkline-radial-point/);
});

test('radial indicator retains its active ring segment during a Lit render', () => {
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  Object.assign(tool, {
    cardId: 'test-card',
    index: 3,
    config: { period: { type: 'rolling_window' }, sparkline: { show: { chart_type: 'radial' } } },
    sparklineSeries: {
      primaryItem: {
        graph: {
          getRadialGeometry: () => ({ centerX: 50, centerY: 50, innerRadius: 30, outerRadius: 40 }),
          getRadialAngleForBin: () => 90,
          getRadialPoint: (radius) => ({ x: 50 + radius, y: 50 }),
        },
      },
    },
    runtime: {
      activePoint: 2,
    },
  });

  const indicator = tool.renderActiveIndicator();

  assert.ok(indicator.values.includes(80));
  assert.ok(indicator.values.includes(90));
  assert.ok(indicator.values.includes('visible'));
});

test('horizontal radial x-axis labels align away from the circumference', () => {
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  const renderedStyles = [];
  const graph = {
    axisArea: { x: 0, width: 100 },
    drawArea: { x: 0, width: 100 },
    getRadialGeometry: () => ({ arcDegrees: 360, anglePerBin: 15, outerRadius: 40 }),
    getRadialAngleForFraction: (fraction) => fraction * 360,
    getRadialValueAxisAngle: () => 0,
    getRadialPoint: (radius, angle) => ({ x: radius, y: angle }),
  };

  Object.assign(tool, {
    sparklineSeries: { primaryItem: { graph } },
    config: {
      sparkline: { show: { chart_type: 'radial', labels: { x: true }, tickmarks: { x: false } } },
      x_axis: {
        tickmarks_major: { size: 1 },
        labels: { offset: 2, orientation: 'horizontal', styles: { fill: 'red' } },
      },
    },
    buildLabelTicks: () => [
      { x: 0, label: 'top' },
      { x: 25, label: 'right' },
      { x: 50, label: 'bottom' },
      { x: 75, label: 'left' },
    ],
    getRenderStyles: (styles) => {
      renderedStyles.push(styles);
      return styles;
    },
    geometry: {
      axisGraphs: { primary: undefined, secondary: undefined },
    },
  });

  tool.renderRadialAxisLabels();

  assert.deepEqual(
    renderedStyles.map((styles) => [styles['text-anchor'], styles['dominant-baseline']]),
    [
      ['middle', 'text-after-edge'],
      ['start', 'middle'],
      ['middle', 'hanging'],
      ['end', 'middle'],
    ],
  );
});

test('arc radial x-axis labels use unique readable text paths', () => {
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  const projectedAngles = [];
  const graph = {
    axisArea: { x: 0, width: 100 },
    drawArea: { x: 0, width: 100 },
    getRadialGeometry: () => ({ arcDegrees: 180, anglePerBin: 15, outerRadius: 40 }),
    getRadialAngleForFraction: (fraction) => fraction * 180,
    getRadialValueAxisAngle: () => 0,
    getRadialPoint: (radius, angle) => {
      projectedAngles.push(angle);
      return { x: radius + angle, y: radius - angle };
    },
  };

  Object.assign(tool, {
    cardId: 'test-card',
    index: 7,
    sparklineSeries: { primaryItem: { graph } },
    config: {
      sparkline: { show: { chart_type: 'radial', labels: { x: true }, tickmarks: { x: false } } },
      x_axis: {
        tickmarks_major: { size: 1 },
        labels: { offset: 2, orientation: 'arc', styles: { fill: 'red' } },
      },
    },
    buildLabelTicks: () => [
      { x: 0, label: 'start' },
      { x: 100, label: 'end' },
    ],
    getRenderStyles: (styles) => styles,
    geometry: {
      axisGraphs: { primary: undefined, secondary: undefined },
    },
  });

  const labels = tool.renderRadialAxisLabels().values[0];

  assert.match(labels[0].strings.join(''), /sparkline-radial-label-path--x/);
  assert.match(labels[0].strings.join(''), /<textPath/);
  assert.ok(labels[0].values.includes('test-card-sparkline-7-radial-x-label-0'));
  assert.ok(labels[1].values.includes('test-card-sparkline-7-radial-x-label-1'));
  assert.deepEqual(projectedAngles, [0, -90, 90, 180, 270, 90]);
});

test('radial arc labels retain the configured multi-series legend', (context) => {
  const previousWindow = globalThis.window;
  globalThis.window = {
    matchMedia: () => ({ matches: false }),
    clearTimeout() {},
  };
  context.after(() => {
    globalThis.window = previousWindow;
  });

  const card = {
    evaluateJavascriptTemplates: false,
    dev: { debug: false },
    config: {},
    entities: [],
    runtimeEntityConfigs: [],
    cardAnimations: { styles: { texts: {} } },
    cardLayout: {
      changedGroupIds: new Set(),
      calculateSvgCoordinatesInGroup: (config) => ({ xpos: config.xpos, ypos: config.ypos }),
      getGroupScaleTransform: () => '',
      getGroupScaleStyle: () => '',
      groupManager: {
        getGroupChainForItem: () => [],
        isItemVisible: () => true,
      },
      masksClips: { applyGradientRefs: (styles) => styles },
    },
    cardTheme: {
      modeChanged: false,
      getActiveColorStopMode: () => 'light',
      colorContext: { cacheReady: false },
    },
    cardTools: { getBySection: () => [] },
    actions: { getActionHandlerOptions: () => ({}) },
    _hass: {
      locale: { language: 'en', time_format: 'language' },
      config: { time_zone: 'UTC' },
      formatEntityName: (entity, name) => (typeof name === 'string' ? name : entity.entity_id),
    },
    requestUpdate() {},
  };
  const config = {
    id: 'radial-legend',
    xpos: 50,
    ypos: 50,
    width: 92,
    height: 92,
    margin: 0,
    period: {
      type: 'rolling_window',
      rolling_window: {
        offset: 0,
        duration: { hour: 24 },
        bins: { per_hour: 1, density: 'medium' },
      },
    },
    sparkline: {
      show: {
        chart_type: 'radial',
        chart_variant: 'line',
        legend: true,
      },
      radial: { arc_degrees: 270, rotate: -135, size: 15 },
      legend: { position: 'top', rows: 1, gap: 4, item_gap: 2 },
    },
    x_axis: { labels: { orientation: 'arc', offset: 2 } },
    series: [
      { id: 'living-room', entity_index: 0, name: 'Living room', color: '#42a5f5' },
      { id: 'bedroom', entity_index: 1, name: 'Bedroom', color: '#f9a825' },
      { id: 'study', entity_index: 2, name: 'Study', color: '#66bb6a' },
    ],
  };
  const templates = { hasJavascriptTemplates: () => false };
  const tool = new SparklineGraphTool(config, 0, templates, 'test-card', card);

  tool.sparklineSeries.items.forEach((item, index) => {
    item.entity = { entity_id: `sensor.series_${index}`, state: String(index) };
    item.entityConfig = {};
  });
  tool.updateLegendTextTools();

  assert.equal(tool.config.x_axis.labels.orientation, 'arc');
  assert.equal(tool.config.sparkline.show.legend, true);
  assert.equal(tool.paint.legendItems.length, 3);
  assert.equal(tool.legendTextTools.length, 3);
  assert.ok(tool.geometry.legendLayout.legendArea.height > 0);

  const measurementElement = {};
  const ellipsisElement = {};
  tool.legendTextTools[0].widthMeasurementElements[0] = measurementElement;
  tool.legendTextTools[0].widthEllipsisElements[0] = ellipsisElement;
  tool.legendTextTools[0].render();

  assert.equal(tool.legendTextTools[0].widthMeasurementElements[0], measurementElement);
  assert.equal(tool.legendTextTools[0].widthEllipsisElements[0], ellipsisElement);
  assert.match(tool.renderLegend().strings.join(''), /sparkline-legend/);
});

test('accepted history keeps request exclusion active through direct result publication', async () => {
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  const entity = {
    entity_id: 'sensor.active',
    state: '12',
    last_changed: '2026-08-13T10:00:00.000Z',
    last_updated: '2026-08-13T10:00:00.000Z',
  };
  const updateFlagsSeenByCard = [];
  const hass = {
    callApi: async () => [[entity]],
  };
  const config = {
    id: 'history',
    period: {
      type: 'rolling_window',
      rolling_window: { offset: 0, duration: { hour: 24 } },
    },
    history: {},
    sparkline: { show: { chart_type: 'line' } },
  };
  const item = {
    id: 'default',
    graph: undefined,
    rows: [],
    config,
    entity,
    entityConfig: {},
  };
  const history = new SparklineHistory(config.period, {}, [item], true, false, historyEvents());
  history.bindSeriesEntity(item);

  Object.assign(tool, {
    cardId: 'test-card',
    config,
    entity,
    sparklineSeries: {
      items: [item],
      primaryItem: item,
      setRequestState(item, requestState) {
        item.requestState = requestState;
      },
    },
    sparklineHistory: history,
    card: {
      dev: { debug: false },
      _hass: hass,
      runtimeEntityConfigs: [],
      entities: [],
      requestUpdate() {},
      cardTools: { getBySection: () => [tool] },
      cardEntities: { updateSparklineEntities() {} },
      updateSparklineResult() {
        updateFlagsSeenByCard.push(tool.requiresHassUpdate());
      },
    },
    updateGraphFromSeries() {},
    clearTooltip() {},
    runtime: {
      periodDurationAvailable: true,
    },
  });

  await tool.fetchHistoryIfNeeded(item);

  assert.deepEqual(updateFlagsSeenByCard, [true]);
  assert.equal(tool.requiresHassUpdate(), false);
  assert.equal(tool.historyLoading, false);
  assert.equal(item.requestState, 'loaded');
});

test('an accepted History result queued at disconnect cannot enter the GraphTool pipeline', async (context) => {
  const previousWindow = globalThis.window;
  const previousSetTimeout = globalThis.setTimeout;
  const previousClearTimeout = globalThis.clearTimeout;
  const timers = new Map();
  let acceptHistory;
  const historyResponse = new Promise((accept) => {
    acceptHistory = accept;
  });
  const pipelineCalls = [];
  let nextTimer = 1;

  globalThis.window = {
    removeEventListener() {},
    cancelAnimationFrame() {},
  };
  globalThis.setTimeout = (callback, delay) => {
    const timer = nextTimer;
    nextTimer += 1;
    timers.set(timer, { callback, delay });
    return timer;
  };
  globalThis.clearTimeout = (timer) => timers.delete(timer);
  context.after(() => {
    globalThis.window = previousWindow;
    globalThis.setTimeout = previousSetTimeout;
    globalThis.clearTimeout = previousClearTimeout;
  });

  const period = {
    type: 'rolling_window',
    rolling_window: { offset: 0, duration: { hour: 24 } },
  };
  const entity = {
    entity_id: 'sensor.queued',
    state: '12',
    last_changed: new Date(Date.now() - 60 * 1000).toISOString(),
  };
  const item = {
    id: 'queued',
    entity,
    entityConfig: {},
    rows: [],
    config: {
      id: 'queued',
      period,
      history: { refresh_interval: '1m' },
      sparkline: { show: { chart_type: 'line' } },
    },
  };
  const history = new SparklineHistory(period, {}, [item], true, false, historyEvents());
  history.bindSeriesEntity(item);
  let tool;
  tool = Object.assign(Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} }), {
    cardId: 'test-card',
    config: item.config,
    sparklineHistory: history,
    sparklineSeries: {
      items: [item],
      setRequestState(seriesItem, requestState) {
        seriesItem.requestState = requestState;
      },
    },
    legendTextTools: [],
    rid: null,
    _radialRafId: null,
    clearTooltip() {},
    updateGraphFromSeries() {
      pipelineCalls.push('graph');
    },
    card: {
      dev: { debug: false },
      _hass: { callApi: () => historyResponse },
      requestUpdate() {},
      cardTools: { getBySection: () => [tool] },
      cardEntities: { updateSparklineEntities: () => pipelineCalls.push('entities') },
      runtimeEntityConfigs: [],
      entities: [],
      updateSparklineResult: () => pipelineCalls.push('result'),
    },
  });

  const graphCompletion = tool.fetchHistoryIfNeeded(item);
  acceptHistory([
    [
      {
        state: '11',
        last_changed: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      },
    ],
  ]);
  await Promise.resolve();

  // History has accepted the rows, while GraphTool's promise continuation is still queued.
  assert.equal(history.requiresHassUpdate(), true);
  assert.equal(timers.size, 1);

  tool.disconnected();
  await graphCompletion;

  assert.equal(timers.size, 0);
  assert.equal(history.requiresHassUpdate(), false);
  assert.equal(history.getRequestFacts(item.id).requestState, 'closed');
  assert.deepEqual(item.rows, []);
  assert.deepEqual(pipelineCalls, []);
});

test('accepted multi-day history builds and renders the configured line minmax envelope', async (context) => {
  const previousWindow = globalThis.window;
  globalThis.window = {
    matchMedia: () => ({ matches: false }),
    clearTimeout() {},
  };
  context.after(() => {
    globalThis.window = previousWindow;
  });

  const templates = { hasJavascriptTemplates: () => false };
  const now = Date.now();
  const entity = {
    entity_id: 'sensor.temperature',
    state: '24',
    last_changed: new Date(now).toISOString(),
  };
  const historyRows = [
    { state: '20', last_changed: new Date(now - 66 * 60 * 60 * 1000).toISOString() },
    { state: '25', last_changed: new Date(now - 60 * 60 * 60 * 1000).toISOString() },
    { state: '21', last_changed: new Date(now - 42 * 60 * 60 * 1000).toISOString() },
    { state: '26', last_changed: new Date(now - 36 * 60 * 60 * 1000).toISOString() },
    { state: '22', last_changed: new Date(now - 18 * 60 * 60 * 1000).toISOString() },
    { state: '24', last_changed: new Date(now - 12 * 60 * 60 * 1000).toISOString() },
  ];
  const card = {
    evaluateJavascriptTemplates: false,
    dev: { debug: false, fakeData: false },
    entities: [entity],
    runtimeEntityConfigs: [{}],
    _hass: {
      locale: { language: 'en', time_format: 'language' },
      config: { time_zone: 'UTC' },
      callApi: async () => [historyRows],
    },
    requestUpdate() {},
    updateSparklineResult() {},
    cardLayout: {
      changedGroupIds: new Set(),
      calculateSvgCoordinatesInGroup: () => ({ xpos: 100, ypos: 100 }),
    },
    cardTheme: {
      modeChanged: false,
      getActiveColorStopMode: () => 'light',
      colorContext: { cacheReady: false },
    },
    cardEntities: { updateSparklineEntities() {} },
    cardTools: { getBySection: () => [] },
  };
  const tool = new SparklineGraphTool(
    {
      id: 'temperature-history',
      entity_index: 0,
      xpos: 50,
      ypos: 50,
      width: 80,
      height: 40,
      period: {
        type: 'rolling_window',
        rolling_window: {
          offset: 0,
          duration: { hour: 72 },
          bins: { per_hour: 1 / 24, density: 'medium' },
        },
      },
      sparkline: {
        show: { chart_type: 'line' },
        line: { show: { minmax: true } },
      },
    },
    0,
    templates,
    'test-card',
    card,
  );
  const item = tool.sparklineSeries.primaryItem;
  item.entity = entity;
  item.entityConfig = {};
  tool.runtime.entity = entity;
  tool.runtime.entityConfig = {};
  tool.sparklineHistory.bindSeriesEntity(item);

  await tool.fetchHistoryIfNeeded(item);

  const minMaxPath = item.graph.getAreaMinMax(item.graph.getPathMin(), item.graph.getPathMax());
  tool.getRenderStyles = (styles) => styles;
  const rendered = tool.renderSeriesCartesian().values[0][0];
  assert.ok(item.graph.coordsMin.some((point, index) => point[2] !== item.graph.coordsMax[index][2]));
  assert.equal(item.requestState, 'loaded');
  assert.equal(item.dataState, 'has_data');
  assert.notEqual(minMaxPath, '');
  assert.match(rendered.values[1].strings.join(''), /sparkline-series-minmax/);

  const retainedLine = tool.geometry.line;
  const retainedEnvelope = tool.geometry.areaMinMax;
  tool.updateGraphFromSeries();
  assert.equal(tool.geometry.seriesGeometryChanged, false);
  assert.strictEqual(tool.geometry.line, retainedLine);
  assert.strictEqual(tool.geometry.areaMinMax, retainedEnvelope);
});

test('accepted empty history becomes loaded request state with empty processed data', async (context) => {
  const previousWindow = globalThis.window;
  globalThis.window = {
    matchMedia: () => ({ matches: false }),
    clearTimeout() {},
  };
  context.after(() => {
    globalThis.window = previousWindow;
  });

  const entity = {
    entity_id: 'sensor.no_history',
    state: '24',
    last_changed: new Date().toISOString(),
  };
  const card = {
    evaluateJavascriptTemplates: false,
    dev: { debug: false, fakeData: false },
    entities: [entity],
    runtimeEntityConfigs: [{}],
    _hass: {
      locale: { language: 'en', time_format: 'language' },
      config: { time_zone: 'UTC' },
      callApi: async () => [],
    },
    requestUpdate() {},
    updateSparklineResult() {},
    cardLayout: {
      changedGroupIds: new Set(),
      calculateSvgCoordinatesInGroup: () => ({ xpos: 100, ypos: 100 }),
    },
    cardTheme: {
      modeChanged: false,
      getActiveColorStopMode: () => 'light',
      colorContext: { cacheReady: false },
    },
    cardEntities: { updateSparklineEntities() {} },
    cardTools: { getBySection: () => [] },
  };
  const tool = new SparklineGraphTool(
    {
      id: 'empty-yesterday',
      entity_index: 0,
      xpos: 50,
      ypos: 50,
      width: 80,
      height: 40,
      period: {
        type: 'calendar',
        calendar: {
          period: 'day',
          offset: -1,
          duration: { hour: 24 },
          bins: { per_hour: 1, density: 'medium' },
        },
      },
      sparkline: { show: { chart_type: 'line' } },
    },
    0,
    { hasJavascriptTemplates: () => false },
    'test-card',
    card,
  );
  const item = tool.sparklineSeries.primaryItem;
  item.entity = entity;
  item.entityConfig = {};
  tool.runtime.entity = entity;
  tool.runtime.entityConfig = {};
  tool.sparklineHistory.bindSeriesEntity(item);

  await tool.fetchHistoryIfNeeded(item);

  assert.equal(item.requestState, 'loaded');
  assert.equal(item.dataState, 'empty');
  assert.deepEqual(item.graph.coords, []);
  assert.deepEqual(item.graph.statistics, {});
});

test('failed history changes request state without clearing processed data', () => {
  const previousConsoleError = console.error;
  const item = { id: 'temperature', requestState: 'loading', dataState: 'has_data' };
  let cardUpdates = 0;
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  Object.assign(tool, {
    sparklineSeries: {
      items: [item],
      setRequestState(seriesItem, requestState) {
        seriesItem.requestState = requestState;
      },
    },
    sparklineHistory: {
      getRequestFacts: () => ({ requestState: 'error' }),
    },
    card: {
      updateSparklineResult() {
        cardUpdates += 1;
      },
    },
    clearTooltip() {},
  });
  console.error = () => {};

  try {
    tool.historyRequestCompleted({ status: 'failed', seriesId: item.id, error: new Error('temporary failure') });
  } finally {
    console.error = previousConsoleError;
  }

  assert.equal(item.requestState, 'error');
  assert.equal(item.dataState, 'has_data');
  assert.equal(cardUpdates, 1);
});

test('disconnect closes request state without clearing processed data', (context) => {
  const previousWindow = globalThis.window;
  globalThis.window = { removeEventListener() {}, cancelAnimationFrame() {} };
  context.after(() => {
    globalThis.window = previousWindow;
  });
  const item = { id: 'temperature', requestState: 'loading', dataState: 'has_data' };
  let requestState = 'loading';
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  Object.assign(tool, {
    sparklineSeries: {
      items: [item],
      setRequestState(seriesItem, nextRequestState) {
        seriesItem.requestState = nextRequestState;
      },
    },
    sparklineHistory: {
      disconnected() {
        requestState = 'closed';
      },
      getRequestFacts: () => ({ requestState }),
    },
    clearTooltip() {},
    legendTextTools: [],
    rid: null,
    _radialRafId: null,
  });

  tool.disconnected();

  assert.equal(item.requestState, 'closed');
  assert.equal(item.dataState, 'has_data');
});

test('pointer cleanup releases the owned node and frames and reconnect binds once', (context) => {
  const previousWindow = globalThis.window;
  const pointerWindow = new EventTarget();
  const frames = new Map();
  let nextFrame = 1;
  pointerWindow.requestAnimationFrame = (callback) => {
    const frame = nextFrame++;
    frames.set(frame, callback);
    return frame;
  };
  pointerWindow.cancelAnimationFrame = (frame) => frames.delete(frame);
  globalThis.window = pointerWindow;
  context.after(() => {
    globalThis.window = previousWindow;
  });

  const node = new EventTarget();
  node.dataset = {};
  node.querySelector = () => ({});
  const container = { getBoundingClientRect: () => ({ left: 0, top: 0 }) };
  const tooltip = { querySelector: () => ({}), querySelectorAll: () => [] };
  const nodes = new Map([
    ['sparkline-test-card-0', node],
    ['container', container],
    ['sparkline-active-indicator-test-card-0', {}],
    ['sparkline-tooltip-test-card-0', tooltip],
  ]);
  let pointerUpdates = 0;
  const tool = Object.assign(Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} }), {
    cardId: 'test-card',
    index: 0,
    config: { sparkline: { show: { chart_type: 'line' } } },
    card: { shadowRoot: { getElementById: (id) => nodes.get(id) } },
    elements: {},
    legendTextTools: [],
    sparklineSeries: { items: [] },
    sparklineHistory: { disconnected() {}, connected() {} },
    rid: null,
    _radialRafId: null,
    clearTooltip() {},
    updateTooltipVisibilityDom() {},
    updatePointerBounds() {},
    updateActiveIndicatorDom() {},
    restoreRadialActiveBinDom() {},
    updateActivePointer: () => {
      pointerUpdates += 1;
    },
  });
  // Match constructor-owned callback identity without constructing graph data
  // for this DOM/gesture cleanup fixture.
  ['pointerFrame', 'pointerMove', 'pointerDown', 'pointerUp', 'touchStart', 'mouseDown', 'hoverEnter', 'hoverMove', 'hoverLeave'].forEach((handler) => {
    tool[handler] = tool[handler].bind(tool);
  });
  tool.attachPointerHandlers();
  node.dispatchEvent(new Event('mousedown', { cancelable: true }));
  pointerWindow.dispatchEvent(new Event('pointermove', { cancelable: true }));
  tool._radialRafId = pointerWindow.requestAnimationFrame(() => {
    pointerUpdates += 1;
  });
  assert.equal(tool.runtime.dragging, true);
  assert.equal(frames.size, 2);

  tool.disconnected();
  tool.disconnected();
  const updatesAfterDisconnect = pointerUpdates;
  node.dispatchEvent(new Event('mousedown', { cancelable: true }));
  pointerWindow.dispatchEvent(new Event('pointermove', { cancelable: true }));
  assert.equal(frames.size, 0);
  assert.equal(pointerUpdates, updatesAfterDisconnect);
  assert.equal(tool.runtime.dragging, false);
  assert.equal(tool.runtime.hovering, false);
  assert.equal(tool.runtime.pointerEvent, undefined);
  assert.equal(tool.pointerSvgElement, undefined);
  assert.equal(node.dataset.pointerReady, undefined);
  assert.deepEqual(tool.elements, {});

  // Reusing the same SVG must restore interaction without duplicate callbacks.
  tool.connected();
  tool.attachPointerHandlers();
  tool.attachPointerHandlers();
  node.dispatchEvent(new Event('mousedown', { cancelable: true }));
  assert.equal(pointerUpdates - updatesAfterDisconnect, 1);
  assert.equal(node.dataset.pointerReady, 'true');
  assert.equal(tool.pointerSvgElement, node);
  tool.disconnected();
});

test('day and night resynchronization participates in the normal hass update contract', () => {
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  Object.assign(tool, {
    sparklineHistory: { requiresHassUpdate: () => true },
  });

  assert.equal(tool.requiresHassUpdate(), true);
});

test('calendar history request spans complete calendar days', () => {
  const NativeDate = globalThis.Date;
  const fixedNow = new NativeDate('2026-08-14T12:30:00');

  globalThis.Date = class extends NativeDate {
    constructor(...args) {
      super(...(args.length === 0 ? [fixedNow.getTime()] : args));
    }

    static now() {
      return fixedNow.getTime();
    }
  };

  try {
    const period = {
      type: 'calendar',
      calendar: {
        period: 'day',
        offset: 0,
        duration: { hour: 48 },
      },
    };
    const item = {
      id: 'default',
      config: {
        period,
      },
    };
    const history = new SparklineHistory(period, {}, [item], true, false, historyEvents());

    const range = history.getSeriesRange(item);

    assert.equal(range.start.getTime(), new NativeDate('2026-08-13T00:00:00').getTime());
    assert.equal(range.end.getTime(), new NativeDate('2026-08-15T00:00:00').getTime());
  } finally {
    globalThis.Date = NativeDate;
  }
});

test('axis margin contains labels and tickmarks independently from data margin', () => {
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  Object.assign(tool, {
    config: {
      sparkline: {
        show: {
          chart_type: 'line',
          tickmarks: { x: true, y: true },
          labels: { x: true, y: true },
        },
      },
      x_axis: {
        tickmarks_major: { size: 1 },
        labels: { offset: 2, styles: { 'text-anchor': 'middle' } },
      },
      y_axis: {
        tickmarks_major: { size: 1 },
        labels: { offset: 2 },
      },
    },
    resolveAxisFontSizePixels: (axis) => (axis === 'x' ? 8 : 10),
    buildXAxisTicks: () => [{ label: '08:00' }, { label: '12:00' }],
    buildYAxisTicks: () => [{ label: '-20' }, { label: '100' }],
    geometry: {
      axisGraphs: {
        primary: {
          input: {
            sparkline: {
              show: {
                chart_type: 'line',
                tickmarks: { y: true },
                labels: { y: true },
              },
            },
            y_axis: {
              tickmarks_major: { size: 1 },
              labels: { offset: 2 },
            },
          },
        },
        secondary: undefined,
      },
    },
  });

  assert.deepEqual(tool.calculateAxisMargin(), {
    t: 4.25,
    r: 12,
    b: 14,
    l: 21,
    x: 21,
    y: 4.25,
  });
});

test('per-series line_width reaches the graph geometry', () => {
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  const config = {
    line: { styles: { 'stroke-width': 1 } },
    sparkline: {
      show: { chart_type: 'line' },
      line: { line_width: 2.5, styles: {} },
    },
  };

  assert.equal(tool.getConfiguredLineWidth(config), 5);
});

test('series line_width overrides the shared sparkline line_width', () => {
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  const config = {
    sparkline: {
      show: { chart_type: 'line' },
      line: { line_width: 1, styles: {} },
    },
  };

  assert.equal(tool.getConfiguredLineWidth(config), 2);
});

test('explicit series use independent primary and secondary y-axis ranges', () => {
  const calls = [];
  const makeGraph = (min, max) => ({
    input: { geometry: { line_width: 1 } },
    min,
    max,
    coords: [
      [0, 0, min],
      [100, 0, max],
    ],
    drawArea: { x: 0, y: 0, width: 100, height: 50 },
    processData() {
      return 'has_data';
    },
    calculateGeometry() {},
    setSharedYAxisBounds(lowerBound, upperBound) {
      calls.push([min, lowerBound, upperBound]);
      this.min = lowerBound;
      this.max = upperBound;
    },
    clearSharedYAxisBounds() {},
    setGraphAreas() {},
    calculateYCoordinates: (points) => points,
    getPath: () => 'M 0 0 L 100 50',
    getArea: () => 'M 0 0 L 100 50 Z',
    updateStatistics: () => ({}),
  });
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  const makeConfig = (chartType) => ({
    period: { type: 'real_time' },
    sparkline: {
      show: { chart_type: chartType, line: true, points: false },
      line: { show_dots: false, show: { minmax: false } },
      area: { show_dots: false, show: { minmax: false } },
      dots: { radius: 1 },
      line_color: ['#1565c0', '#d32f2f'],
    },
    y_axis: {},
  });
  const first = { id: 'temperature', y_axis_id: 'primary', config: makeConfig('line'), graph: makeGraph(10, 20), rows: [{ state: 10 }], entity: { last_changed: '2026-08-13T10:00:00.000Z' } };
  const second = { id: 'humidity', y_axis_id: 'secondary', config: makeConfig('dots'), graph: makeGraph(30, 40), rows: [{ state: 30 }], entity: { last_changed: '2026-08-13T10:00:00.000Z' } };

  Object.assign(tool, {
    sparklineSeries: Object.assign(Object.create(SparklineSeries.prototype), { items: [first, second] }),
    card: { dev: { debug: false } },
    calculateAxisMargin: () => ({ t: 0, r: 0, b: 0, l: 0 }),
    geometry: {
      configuredGraphMargin: { t: 0, r: 0, b: 0, l: 0 },
      svg: { line_width: 1 },
      area: [],
      areaMinMax: [],
      line: [],
      points: [],
    },
    paint: {
      gradient: [],
    },
  });

  tool.updateCartesianSeriesGraphs();

  assert.deepEqual(calls, [
    [10, 10, 20],
    [30, 30, 40],
  ]);
  assert.equal(tool.geometry.axisGraphs.primary, first.graph);
  assert.equal(tool.geometry.axisGraphs.secondary, second.graph);
  assert.equal(tool.sparklineSeries.dataState, 'has_data');
  assert.equal(tool.geometry.line.length, 1);
  assert.equal(tool.geometry.points.length, 2);

  first.graph.min = 10;
  first.graph.max = 20;
  second.graph.min = 30;
  second.graph.max = 40;
  first.config.y_axis = { lower_bound: -10, upper_bound: 50 };
  second.config.y_axis = { lower_bound: 0, upper_bound: 100 };
  first.graph.geometryConfigChanged = true;
  second.graph.geometryConfigChanged = true;
  calls.length = 0;

  tool.updateCartesianSeriesGraphs();

  assert.deepEqual(calls, [
    [10, -10, 50],
    [30, 0, 100],
  ]);

  first.graph.min = 10;
  first.graph.max = 20;
  second.graph.min = 30;
  second.graph.max = 40;
  first.config.y_axis = { lower_bound: -1 };
  second.config.y_axis = { upper_bound: 100 };
  first.graph.geometryConfigChanged = true;
  second.graph.geometryConfigChanged = true;
  calls.length = 0;

  tool.updateCartesianSeriesGraphs();

  assert.deepEqual(calls, [
    [10, -1, 20],
    [30, 30, 100],
  ]);
});

test('explicit series use the most restrictive automatic bin density for every graph', () => {
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  const makeConfig = (chartType) => ({
    width: 90,
    period: {
      type: 'rolling_window',
      rolling_window: {
        duration: { hour: 24 },
        bins: { per_hour: 'auto', density: 'medium' },
      },
    },
    sparkline: {
      show: { chart_type: chartType },
    },
    x_axis: { labels: {} },
    y_axis: {},
  });
  const makeItem = (id, chartType) => ({
    id,
    config: makeConfig(chartType),
    paint: { colorStops: { scales: {}, colors: [] } },
  });
  const line = makeItem('line', 'line');
  const dots = makeItem('dots', 'dots');
  Object.assign(tool, {
    config: line.config,
    sparklineSeries: Object.assign(Object.create(SparklineSeries.prototype), { items: [line, dots] }),
    geometry: {
      svg: { width: 90, height: 40, line_width: 1, column_spacing: 0.2 },
      graphArea: { width: 90, height: 40 },
      xAxisLabelLength: 10,
    },
    runtime: {
      stateBandsStateMap: {},
    },
  });

  const binPlan = tool.sparklineSeries.updateBinPlan();
  const lineGraphConfig = tool.buildGraphInput(line, binPlan.perHour);
  const dotsGraphConfig = tool.buildGraphInput(dots, binPlan.perHour);

  assert.deepEqual(binPlan, { perHour: 1, durationHours: 1 });
  assert.equal(lineGraphConfig.period.rolling_window.bins.per_hour, 1);
  assert.equal(dotsGraphConfig.period.rolling_window.bins.per_hour, 1);
});

test('multiple bar series receive grouped slots and one shared outer margin', () => {
  const calls = [];
  const makeGraph = () => ({
    min: 0,
    max: 10,
    coords: [
      [0, 0, 0],
      [100, 0, 10],
    ],
    drawArea: { x: 0, y: 0, width: 100, height: 50 },
    clearSharedYAxisBounds() {},
    processData() {
      return 'has_data';
    },
    calculateGeometry() {},
    setSharedYAxisBounds(lowerBound, upperBound) {
      this.min = lowerBound;
      this.max = upperBound;
    },
    setGraphAreas(...args) {
      calls.push(args);
      this.axisArea = { x: 0, width: 100 };
    },
    getBars(position, total) {
      return [{ x: position === 0 ? -10 : 90, y: 20, width: 20, height: 10, value: 10, position, total }];
    },
    calculateYCoordinates: (points) => points.map((point) => [point[0], 25, point[2]]),
    getPath: () => 'M 0 0 L 100 50',
    updateStatistics: () => ({}),
  });
  const makeConfig = (chartType = 'bar') => ({
    period: { type: 'real_time' },
    sparkline: {
      show: { chart_type: chartType, points: false },
      line: { show_dots: false, show: { minmax: false } },
      area: { show_dots: false, show: { minmax: false } },
      dots: { radius: 1 },
    },
    y_axis: {},
  });
  const first = { id: 'first', config: makeConfig(), graph: makeGraph(), rows: [{ state: 4 }], entity: { last_changed: '2026-08-13T10:00:00.000Z' } };
  const line = { id: 'line', config: makeConfig('line'), graph: makeGraph(), rows: [{ state: 6 }], entity: { last_changed: '2026-08-13T10:00:00.000Z' } };
  const second = { id: 'second', config: makeConfig(), graph: makeGraph(), rows: [{ state: 8 }], entity: { last_changed: '2026-08-13T10:00:00.000Z' } };
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  Object.assign(tool, {
    sparklineSeries: Object.assign(Object.create(SparklineSeries.prototype), { items: [first, line, second] }),
    card: { dev: { debug: false } },
    calculateAxisMargin: () => ({ t: 0, r: 0, b: 0, l: 0 }),
    geometry: {
      configuredGraphMargin: { t: 0, r: 0, b: 0, l: 0 },
      svg: { line_width: 1, column_spacing: 4, row_spacing: 4 },
      area: [],
      areaMinMax: [],
      line: [],
      points: [],
    },
    paint: {
      gradient: [],
    },
  });

  tool.updateCartesianSeriesGraphs();

  assert.deepEqual([first.barPosition, second.barPosition], [0, 1]);
  assert.equal(line.barPosition, undefined);
  assert.deepEqual([first.barTotal, second.barTotal], [2, 2]);
  assert.deepEqual([first.bars[0].position, second.bars[0].position], [0, 1]);
  assert.deepEqual([first.bars[0].total, second.bars[0].total], [2, 2]);
  assert.equal(calls.at(-1)[3].l, 10);
  assert.equal(calls.at(-1)[3].r, 10);
});

test('multiple series wait for every graph before building shared geometry', () => {
  let pathRead = false;
  const readyGraph = {
    coords: [[0, 0, 10]],
    clearSharedYAxisBounds() {},
    processData() {
      return 'has_data';
    },
    calculateGeometry() {},
    getPath() {
      pathRead = true;
    },
  };
  const loadingGraph = {
    coords: [],
    clearSharedYAxisBounds() {},
    processData() {
      return 'not_loaded';
    },
  };
  const config = {
    period: { type: 'real_time' },
    sparkline: { show: { chart_type: 'line' } },
  };
  const first = { id: 'ready', config, graph: readyGraph, rows: [{ state: 10 }], entity: { last_changed: '2026-08-13T10:00:00.000Z' } };
  const second = { id: 'loading', config, graph: loadingGraph, rows: [] };
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  Object.assign(tool, {
    sparklineSeries: Object.assign(Object.create(SparklineSeries.prototype), { items: [first, second] }),
    calculateAxisMargin: () => ({ t: 0, r: 0, b: 0, l: 0 }),
    geometry: {
      configuredGraphMargin: { t: 0, r: 0, b: 0, l: 0 },
      svg: { column_spacing: 4, row_spacing: 4 },
    },
  });

  tool.updateCartesianSeriesGraphs();

  assert.equal(tool.sparklineSeries.dataState, 'not_loaded');
  assert.equal(pathRead, false);
});

test('multiple series keep current data visible when another series is empty', () => {
  let dataPathReads = 0;
  let emptyPathReads = 0;
  const dataGraph = {
    config: { geometry: { line_width: 1 } },
    min: 10,
    max: 20,
    coords: [
      [0, 0, 10],
      [100, 0, 20],
    ],
    drawArea: { x: 0, y: 0, width: 100, height: 50 },
    clearSharedYAxisBounds() {},
    processData() {
      return 'has_data';
    },
    calculateGeometry() {},
    setSharedYAxisBounds() {},
    setGraphAreas() {},
    calculateYCoordinates: (points) => points,
    getPath() {
      dataPathReads += 1;
      return 'M 0 0 L 100 50';
    },
    updateStatistics() {},
  };
  const emptyGraph = {
    coords: [],
    clearSharedYAxisBounds() {},
    processData() {
      return 'empty';
    },
    getPath() {
      emptyPathReads += 1;
      throw new Error('empty graph has no path');
    },
    updateStatistics() {},
  };
  const makeConfig = () => ({
    period: { type: 'real_time' },
    sparkline: {
      show: { chart_type: 'line', line: true, points: false },
      line: { show_dots: false, show: { minmax: false } },
      area: { show_dots: false, show: { minmax: false } },
      dots: { radius: 1 },
    },
    y_axis: {},
  });
  const dataItem = {
    id: 'data',
    y_axis_id: 'primary',
    config: makeConfig(),
    graph: dataGraph,
    rows: [{ state: 10 }],
    entity: { last_changed: '2026-09-12T10:00:00.000Z' },
  };
  const emptyItem = {
    id: 'empty',
    y_axis_id: 'primary',
    config: makeConfig(),
    graph: emptyGraph,
    rows: [],
    entity: { last_changed: '2026-09-12T10:00:00.000Z' },
  };
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  Object.assign(tool, {
    sparklineSeries: Object.assign(Object.create(SparklineSeries.prototype), { items: [dataItem, emptyItem] }),
    card: { dev: { debug: false } },
    calculateAxisMargin: () => ({ t: 0, r: 0, b: 0, l: 0 }),
    geometry: {
      configuredGraphMargin: { t: 0, r: 0, b: 0, l: 0 },
      svg: { line_width: 1, column_spacing: 4, row_spacing: 4 },
      area: [],
      areaMinMax: [],
      line: [],
      points: [],
    },
    paint: {
      gradient: [],
    },
  });

  tool.updateCartesianSeriesGraphs();

  assert.equal(tool.sparklineSeries.dataState, 'has_data');
  assert.equal(dataItem.dataState, 'has_data');
  assert.equal(emptyItem.dataState, 'empty');
  assert.equal(dataPathReads, 1);
  assert.equal(emptyPathReads, 0);
  assert.equal(tool.geometry.line[0], 'M 0 0 L 100 50');
  assert.equal(tool.geometry.line[1], undefined);
});

test('offset rolling history stays cached while its moving reference range advances', () => {
  const item = {
    id: 'yesterday',
    entity: { state: '12', last_changed: '2026-08-21T12:00:00.000Z' },
    entityConfig: {},
    config: {
      period: { type: 'rolling_window', rolling_window: { offset: -1, duration: { hour: 24 } } },
      sparkline: { show: { chart_type: 'line' } },
    },
  };
  const history = new SparklineHistory({ type: 'rolling_window', rolling_window: { offset: 0, duration: { hour: 24 } } }, {}, [item], true, false, historyEvents());
  const acceptedRange = {
    sourceStart: new Date('2026-08-20T12:00:00.000Z'),
    sourceEnd: new Date('2026-08-21T12:00:00.000Z'),
    rollingOffsetDays: -1,
    sourceRangeIsActive: false,
  };
  const nextRange = {
    sourceStart: new Date('2026-08-20T12:01:00.000Z'),
    sourceEnd: new Date('2026-08-21T12:01:00.000Z'),
    sourceRangeIsActive: false,
  };
  history.acceptHistoryRows(item, [{ state: '12', last_changed: '2026-08-21T10:00:00.000Z' }], acceptedRange);

  assert.equal(history.acceptedHistoryContainsRange(item.id, nextRange, 'rolling_window'), true);
});

test('calendar offset history is fetched from its source day and projected onto the reference day', () => {
  const NativeDate = globalThis.Date;
  const fixedNow = new NativeDate('2026-08-14T12:30:00');
  globalThis.Date = class extends NativeDate {
    constructor(...args) {
      super(...(args.length === 0 ? [fixedNow.getTime()] : args));
    }

    static now() {
      return fixedNow.getTime();
    }
  };

  try {
    const plotPeriod = {
      type: 'calendar',
      calendar: { period: 'day', offset: 0, duration: { hour: 24 } },
    };
    const item = {
      id: 'yesterday',
      entity: { state: '13', last_changed: '2026-08-14T12:00:00.000Z' },
      entityConfig: {},
      config: {
        period: {
          type: 'calendar',
          calendar: { period: 'day', offset: -1, duration: { hour: 24 } },
        },
        sparkline: { show: { chart_type: 'line' } },
      },
    };
    const history = new SparklineHistory(plotPeriod, {}, [item], true, false, historyEvents());
    const range = history.getSeriesRange(item);
    const rows = history.acceptHistoryRows(item, [{ state: '12', last_changed: '2026-08-13T09:30:00.000Z' }], range);

    assert.equal(range.sourceRangeIsActive, false);
    assert.equal(range.sourceStart.getTime(), new NativeDate('2026-08-13T00:00:00').getTime());
    assert.equal(range.plotStart.getTime(), new NativeDate('2026-08-14T00:00:00').getTime());
    assert.equal(rows[0].source_time, '2026-08-13T09:30:00.000Z');
    assert.equal(rows[0].plot_time, '2026-08-14T09:30:00.000Z');
    assert.equal(rows[0].last_changed, rows[0].plot_time);
  } finally {
    globalThis.Date = NativeDate;
  }
});

test('rolling window offset uses days and projects the source range forward', () => {
  const NativeDate = globalThis.Date;
  const fixedNow = new NativeDate('2026-08-14T12:30:00.000Z');
  globalThis.Date = class extends NativeDate {
    constructor(...args) {
      super(...(args.length === 0 ? [fixedNow.getTime()] : args));
    }

    static now() {
      return fixedNow.getTime();
    }
  };

  try {
    const plotPeriod = {
      type: 'rolling_window',
      rolling_window: { offset: 0, duration: { hour: 24 } },
    };
    const item = {
      id: 'yesterday',
      entity: { state: '13', last_changed: '2026-08-14T12:00:00.000Z' },
      entityConfig: {},
      config: {
        period: {
          type: 'rolling_window',
          rolling_window: { offset: -1, duration: { hour: 24 } },
        },
        sparkline: { show: { chart_type: 'line' } },
      },
    };
    const history = new SparklineHistory(plotPeriod, {}, [item], true, false, historyEvents());
    const range = history.getSeriesRange(item);
    const rows = history.acceptHistoryRows(item, [{ state: '12', last_changed: '2026-08-13T09:30:00.000Z' }], range);

    assert.equal(range.sourceRangeIsActive, false);
    assert.equal(range.sourceStart.toISOString(), '2026-08-12T12:30:00.000Z');
    assert.equal(range.sourceEnd.toISOString(), '2026-08-13T12:30:00.000Z');
    assert.equal(range.plotStart.toISOString(), '2026-08-13T12:30:00.000Z');
    assert.equal(range.plotEnd.toISOString(), '2026-08-14T12:30:00.000Z');
    assert.equal(rows[0].source_time, '2026-08-13T09:30:00.000Z');
    assert.equal(rows[0].plot_time, '2026-08-14T09:30:00.000Z');
  } finally {
    globalThis.Date = NativeDate;
  }
});

test('calendar series comparisons use one complete shared visible day', () => {
  const parentPeriod = {
    type: 'calendar',
    calendar: { period: 'day', offset: 0, duration: { hour: 24 }, bins: { per_hour: 1 } },
  };
  const seriesConfig = {
    period: {
      type: 'calendar',
      calendar: { period: 'day', offset: -1, duration: { hour: 24 }, bins: { per_hour: 1 } },
    },
    sparkline: { show: { chart_type: 'line' } },
    x_axis: { labels: {} },
    y_axis: {},
  };
  const item = { config: { ...seriesConfig, period: parentPeriod }, paint: { colorStops: { scales: {}, colors: [] } } };
  const comparisonItem = { config: seriesConfig, paint: { colorStops: { scales: {}, colors: [] } } };
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  Object.assign(tool, {
    config: { period: parentPeriod, series: [{}, {}] },
    sparklineSeries: {
      items: [item, comparisonItem],
    },
    geometry: {
      svg: { width: 100, height: 50, line_width: 0, column_spacing: 0 },
      graphArea: { width: 100, height: 50 },
      xAxisLabelLength: 5,
    },
  });

  const graphConfig = tool.buildGraphInput(comparisonItem, 1);

  assert.equal(graphConfig.period.calendar.offset, 0);
  assert.equal(graphConfig.period.calendar.full_day, true);
});

test('implicit and explicit series share one entity lifecycle and one graph update', (context) => {
  const previousWindow = globalThis.window;
  globalThis.window = { clearTimeout() {} };
  context.after(() => {
    globalThis.window = previousWindow;
  });
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  const makeConfig = () => ({ period: { type: 'real_time' } });
  const first = { id: 'first', entity_index: 0, config: makeConfig(), rows: [] };
  const second = { id: 'second', entity_index: 1, config: makeConfig(), rows: [] };
  let graphUpdates = 0;

  Object.assign(tool, {
    config: { sparkline: { show: { day_night: false } } },
    sparklineSeries: Object.assign(Object.create(SparklineSeries.prototype), { items: [first, second] }),
    sparklineHistory: new SparklineHistory({ type: 'real_time' }, {}, [first, second], true, false, historyEvents()),
    card: { dev: { fakeData: false } },
    updateGraphFromSeries() {
      graphUpdates += 1;
    },
    updateLegendTextTools() {},
    clearTooltip() {},
    runtime: {
      entity: undefined,
      entityConfig: undefined,
      periodDurationAvailable: true,
      tooltipVisible: false,
    },
  });

  const entityConfigs = [{}, {}];
  const entities = [
    { entity_id: 'sensor.first', state: '10', last_changed: '2026-08-13T10:00:00.000Z' },
    { entity_id: 'sensor.second', state: '20', last_changed: '2026-08-13T10:00:00.000Z' },
  ];

  tool.setEntities(entityConfigs, entities);

  assert.equal(tool.runtime.entity, entities[0]);
  assert.deepEqual(first.rows, [{ state: 10, last_changed: '2026-08-13T10:00:00.000Z' }]);
  assert.deepEqual(second.rows, [{ state: 20, last_changed: '2026-08-13T10:00:00.000Z' }]);
  assert.equal(graphUpdates, 1);
});

test('one implicit item enters the cartesian series coordinator', () => {
  const config = {
    entity_index: 0,
    sparkline: {
      show: { chart_type: 'line', item_style: 'auto' },
      line: { show: { item_style: 'auto' }, minmax: { show: { item_style: 'auto' } } },
      area: { show: { item_style: 'auto' }, minmax: { show: { item_style: 'auto' } } },
    },
  };
  const configurations = [config, { ...config, series: [{ id: 'temperature', entity_index: 0 }] }];

  configurations.forEach((seriesConfig) => {
    const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
    let coordinatorCalls = 0;
    Object.assign(tool, {
      config: seriesConfig,
      sparklineSeries: new SparklineSeries(SparklineGraphTool.translateConfig(seriesConfig)),
      card: { dev: { fakeData: false } },
      updateCartesianSeriesGraphs() {
        coordinatorCalls += 1;
        this.sparklineSeries.dataState = 'not_loaded';
      },
      runtime: {
        graphDataChanged: true,
      },
    });
    tool.sparklineSeries.items.forEach((item) => {
      item.requestState = 'not_required';
    });

    tool.updateGraphFromSeries();

    assert.equal(coordinatorCalls, 1);
  });
});

test('multi-series presentation waits for every request before rebuilding', () => {
  const seriesConfig = { sparkline: { show: { chart_type: 'line' } } };
  const first = { id: 'first', requestState: 'loaded', config: seriesConfig };
  const second = { id: 'second', requestState: 'loading', config: seriesConfig };
  let coordinatorCalls = 0;
  let tooltipClears = 0;
  const tool = Object.assign(Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} }), {
    config: { sparkline: { show: { chart_type: 'line' } } },
    sparklineSeries: { items: [first, second] },
    card: { dev: { fakeData: false } },
    updateCartesianSeriesGraphs() {
      coordinatorCalls += 1;
    },
    clearTooltip() {
      tooltipClears += 1;
    },
    runtime: {
      graphDataChanged: true,
    },
  });

  tool.updateGraphFromSeries();
  assert.equal(coordinatorCalls, 0);
  assert.equal(tooltipClears, 1);

  second.requestState = 'loaded';
  tool.updateGraphFromSeries();
  assert.equal(coordinatorCalls, 1);
});

test('x-axis ticks come from the current data graph when the first series is empty', () => {
  const dataGraph = {
    xAxis: {
      ticks: [
        {
          time: new Date('2026-09-12T10:00:00.000Z'),
          timestamp: Date.parse('2026-09-12T10:00:00.000Z'),
          x: 42,
          isMidnight: false,
          isPeriodEnd: false,
        },
      ],
    },
  };
  const tool = Object.assign(Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} }), {
    sparklineSeries: { primaryItem: { graph: { xAxis: undefined } } },
    card: {
      _hass: {
        locale: { language: 'en', time_format: '24' },
        config: { time_zone: 'UTC' },
      },
    },
    geometry: {
      axisGraphs: { primary: dataGraph, secondary: undefined },
    },
  });

  const ticks = tool.buildXAxisTicks('major');
  assert.equal(ticks.length, 1);
  assert.equal(ticks[0].x, 42);
  assert.equal(ticks[0].value, Date.parse('2026-09-12T10:00:00.000Z'));
});

test('retained presentation remains interactive while a series refresh is loading', () => {
  const primary = { requestState: 'loaded', dataState: 'has_data' };
  const comparison = { requestState: 'loading', dataState: 'has_data' };
  let tooltipVisibleInDom = true;
  let indicatorUpdates = 0;
  const tool = Object.assign(Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} }), {
    sparklineSeries: { items: [primary, comparison], primaryItem: primary, dataState: 'has_data' },
    config: { sparkline: { show: { chart_type: 'line' } } },
    mouseEventToPoint: () => ({ x: 12, y: 8 }),
    pointToGraphX: (point) => point.x,
    snapPointerXToGraphPoint: (x) => x,
    getPointIndexFromX: () => 2,
    updateTooltipFromPointIndex() {
      this.runtime.tooltip = { index: 2, title: '10:00' };
      this.runtime.tooltipVisible = true;
    },
    updateTooltipContentDom() {},
    updateTooltipPositionDom() {},
    updateTooltipVisibilityDom(visible) {
      tooltipVisibleInDom = visible;
    },
    updateActiveIndicatorDom() {
      indicatorUpdates += 1;
    },
    runtime: {
      tooltip: { index: 3 },
      tooltipVisible: true,
      activePoint: 3,
      activeX: 40,
    },
  });

  tool.updateActivePointer({ clientX: 10, clientY: 10 });

  assert.deepEqual(tool.runtime.tooltip, { index: 2, title: '10:00' });
  assert.equal(tool.runtime.tooltipVisible, true);
  assert.equal(tool.runtime.activePoint, 3);
  assert.equal(tool.runtime.activeX, 12);
  assert.equal(tooltipVisibleInDom, true);
  assert.equal(indicatorUpdates, 1);
});

test('cartesian series exposes unchanged whole-period statistics after real graph processing', () => {
  const config = {
    entity_index: 0,
    width: 100,
    height: 50,
    geometry: { line_width: 1, column_spacing: 4 },
    period: {
      type: 'rolling_window',
      group_by: 'interval',
      rolling_window: {
        offset: 0,
        duration: { hour: 4 },
        bins: { per_hour: 1, density: 'medium' },
      },
    },
    sparkline: {
      show: { chart_type: 'line', chart_variant: 'line', item_style: 'auto', points: false, labels: { x: true, y: true } },
      state_values: { aggregate_func: 'avg', smoothing: false, logarithmic: false },
      line: { show_dots: false, show: { item_style: 'auto', minmax: false }, minmax: { show: { item_style: 'auto' } } },
      area: { show_dots: false, show: { item_style: 'auto', minmax: false }, minmax: { show: { item_style: 'auto' } } },
      dots: { radius: 1 },
      radial: { arc_degrees: 360, rotate: 0, size: 50 },
    },
    x_axis: { labels: { max_length: 5, styles: { 'font-size': '10px' } }, tickmarks_major: { size: 1 } },
    y_axis: { labels: { styles: { 'font-size': '10px' } }, tickmarks_major: { size: 1 } },
  };
  const series = new SparklineSeries(SparklineGraphTool.translateConfig(config));
  const item = series.primaryItem;
  const rangeStart = new Date('2026-09-12T08:00:00.000Z');
  const rangeEnd = new Date('2026-09-12T12:00:00.000Z');
  const rows = [
    { state: 10, haState: '10', last_changed: '2026-09-12T07:00:00.000Z' },
    { state: 20, haState: '20', last_changed: '2026-09-12T09:00:00.000Z' },
    { state: 40, haState: '40', last_changed: '2026-09-12T11:00:00.000Z' },
  ];

  series.configureGraph(item, 100, 50, { t: 0, r: 0, b: 0, l: 0 }, { t: 0, r: 0, b: 0, l: 0 }, config, [], [], {});
  item.graph._updateEndTime = () => {
    item.graph._endTime = rangeEnd;
  };
  item.entity = { last_changed: rows.at(-1).last_changed };
  item.rows = rows;

  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  Object.assign(tool, {
    config,
    sparklineSeries: series,
    card: { dev: { debug: false } },
    calculateAxisMargin: () => ({ t: 0, r: 0, b: 0, l: 0 }),
    sparklineHistory: {
      getSeriesRange: () => ({
        sourceRangeIsActive: true,
        plotStart: rangeStart,
        plotEnd: rangeEnd,
        plotActiveEnd: rangeEnd,
      }),
      hasRows: () => true,
      takeRowsUpdate: () => undefined,
      pruneActiveRows: () => ({
        start: rangeStart.getTime(),
        end: rangeEnd.getTime(),
      }),
    },
    geometry: {
      configuredGraphMargin: { t: 0, r: 0, b: 0, l: 0 },
      svg: { line_width: 1, column_spacing: 4, row_spacing: 4 },
      area: [],
      areaMinMax: [],
      line: [],
      points: [],
    },
    runtime: {
      entity: item.entity,
      entityConfig: item.entityConfig,
      graphDataChanged: true,
    },
    paint: {
      gradient: [],
    },
  });

  tool.updateCartesianSeriesGraphs();

  assert.deepEqual(item.graph.statistics, {
    min: 10,
    avg: 22.5,
    max: 40,
    min_time: rangeStart.toISOString(),
    max_time: '2026-09-12T11:00:00.000Z',
  });
  assert.equal(item.graph.coords.length, 4);
  assert.match(tool.geometry.line[0], /^M/);
});

test('paint-only configuration retains accepted rows, graph calculations and paths', (context) => {
  const tool = createChangeDetectionTool(context, 'rolling_window');
  const item = tool.sparklineSeries.primaryItem;
  const graph = item.graph;
  const retained = {
    rows: item.rows,
    values: graph.processedValues,
    buckets: graph.bucketMeta,
    coords: graph.coords,
    statistics: graph.statistics,
    line: tool.geometry.line,
  };
  const aggregate = context.mock.method(graph, 'aggregateBuckets');
  const geometry = context.mock.method(graph, 'calculateGeometry');
  const statistics = context.mock.method(graph, 'updateStatistics');
  assert.equal(tool.hasPresentationChanged(), true);
  assert.equal(tool.hasPresentationChanged(), false);

  // Activate changed paint through the normal runtime configuration and entity phases.
  tool.config.sparkline.line.styles = { stroke: '#d32f2f', opacity: 0.4 };
  tool.card.cardTheme.modeChanged = true;
  tool.updateRuntimeConfig();
  tool.setEntities(tool.card.runtimeEntityConfigs, tool.card.entities);
  tool.card.cardTheme.modeChanged = false;
  tool.updatePalettePaint();

  assert.strictEqual(item.graph, graph);
  assert.strictEqual(item.rows, retained.rows);
  assert.strictEqual(graph.processedValues, retained.values);
  assert.strictEqual(graph.bucketMeta, retained.buckets);
  assert.strictEqual(graph.coords, retained.coords);
  assert.strictEqual(graph.statistics, retained.statistics);
  assert.strictEqual(tool.geometry.line, retained.line);
  assert.equal(aggregate.mock.callCount(), 0);
  assert.equal(geometry.mock.callCount(), 0);
  assert.equal(statistics.mock.callCount(), 0);
  assert.equal(tool.getLineStyles().stroke, '#d32f2f');
  assert.equal(tool.getLineStyles().opacity, '0.4');
  assert.equal(tool.hasPresentationChanged(), true);
  assert.equal(tool.hasPresentationChanged(), false);
});

test('a changed single Cartesian series prunes and calculates statistics once', (context) => {
  const tool = createChangeDetectionTool(context, 'rolling_window');
  const item = tool.sparklineSeries.primaryItem;
  const prune = context.mock.method(tool.sparklineHistory, 'pruneActiveRows');
  const statistics = context.mock.method(item.graph, 'updateStatistics');
  const aggregate = context.mock.method(item.graph, 'aggregateBuckets');
  const linePath = context.mock.method(item.graph, 'getPath');
  const reducer = context.mock.method(item.graph, '_reducer');
  const completedGroup = item.graph.bucketGroups.get(Date.parse('2026-09-26T09:00:00.000Z'));
  const completedResult = item.graph.bucketResults.get(completedGroup);
  tool.hasPresentationChanged();

  tool.card.entities[0] = { ...tool.runtime.entity, state: '42', last_changed: '2026-09-26T11:30:00.000Z' };
  tool.setEntities(tool.card.runtimeEntityConfigs, tool.card.entities);
  assert.equal(prune.mock.callCount(), 1);
  assert.equal(statistics.mock.callCount(), 1);
  assert.equal(aggregate.mock.callCount(), 1);
  assert.equal(linePath.mock.callCount(), 1);
  assert.equal(reducer.mock.callCount(), 2);
  assert.strictEqual(item.graph.bucketResults.get(completedGroup), completedResult);
  assert.equal(item.graph.statistics.max, 42);
  assert.equal(tool.hasPresentationChanged(), true);
  assert.equal(tool.hasPresentationChanged(), false);
});

test('a single bar renders the final rectangles already calculated by Series', (context) => {
  const tool = createChangeDetectionTool(context, 'rolling_window');
  tool.config.sparkline.show.chart_type = 'bar';
  tool.config.series[0].sparkline.show.chart_type = 'bar';
  tool.card.cardTheme.modeChanged = true;
  tool.updateRuntimeConfig();
  tool.setEntities(tool.card.runtimeEntityConfigs, tool.card.entities);
  tool.card.cardTheme.modeChanged = false;
  const bars = context.mock.method(tool.primaryGraph, 'getBars');
  tool.card.entities[0] = { ...tool.runtime.entity, state: '42', last_changed: '2026-09-26T11:30:00.000Z' };
  tool.setEntities(tool.card.runtimeEntityConfigs, tool.card.entities);
  // The first pass measures outer half-bars; the second supplies final SVG
  // rectangles. Single-item presentation must not add a third calculation.
  assert.equal(bars.mock.callCount(), 2);
  assert.strictEqual(tool.geometry.bar[0], tool.sparklineSeries.primaryItem.bars);
});

['line', 'area'].forEach((chartType) => {
  test(`a changed Cartesian ${chartType} reuses its line, minmax and point paths during rendering`, (context) => {
    const tool = createChangeDetectionTool(context, 'rolling_window');
    tool.config.sparkline.show.chart_type = chartType;
    tool.config.sparkline.show.points = true;
    tool.config.sparkline[chartType].show.minmax = true;
    tool.config.series[0].sparkline.show.chart_type = chartType;
    tool.config.series[0].sparkline.show.points = true;
    tool.config.series[0].sparkline[chartType].show.minmax = true;
    tool.card.cardTheme.modeChanged = true;
    tool.updateRuntimeConfig();
    tool.setEntities(tool.card.runtimeEntityConfigs, tool.card.entities);
    tool.card.cardTheme.modeChanged = false;
    const graph = tool.primaryGraph;
    const linePath = context.mock.method(graph, 'getPath');
    const minPath = context.mock.method(graph, 'getPathMin');
    const maxPath = context.mock.method(graph, 'getPathMax');
    const minMaxPath = context.mock.method(graph, 'getAreaMinMax');
    const areaPath = context.mock.method(graph, 'getArea');
    const points = context.mock.method(graph, 'calculateYCoordinates');

    tool.card.entities[0] = { ...tool.runtime.entity, state: '42', last_changed: '2026-09-26T11:30:00.000Z' };
    tool.setEntities(tool.card.runtimeEntityConfigs, tool.card.entities);
    assert.equal(tool.geometry.line[0], tool.geometry.linePath);
    assert.equal(tool.geometry.areaMinMax[0], tool.geometry.areaMinMaxPath);
    assert.ok(tool.geometry.areaMinMaxPath.length > 0);
    if (chartType === 'area') assert.equal(tool.geometry.area[0], tool.geometry.areaPath);

    const pointCalculationCount = points.mock.callCount();
    assert.ok(pointCalculationCount > 0);
    tool.renderPoints();
    tool.renderPoints();
    tool.renderSeriesCartesian();
    tool.renderSeriesCartesian();
    assert.equal(linePath.mock.callCount(), 1);
    assert.equal(minPath.mock.callCount(), 1);
    assert.equal(maxPath.mock.callCount(), 1);
    assert.equal(minMaxPath.mock.callCount(), 1);
    assert.equal(areaPath.mock.callCount(), chartType === 'area' ? 1 : 0);
    assert.equal(points.mock.callCount(), pointCalculationCount);
  });
});

test('changed historical curves report presentation changes when all published statistics stay equal', (context) => {
  const tool = createChangeDetectionTool(context, 'rolling_window');
  const item = tool.sparklineSeries.primaryItem;
  const graph = item.graph;
  const initialResult = tool.getSeriesResult();
  const initialCoords = structuredClone(graph.coords);
  const initialPath = tool.geometry.line[0];
  const aggregate = context.mock.method(graph, 'aggregateBuckets');
  assert.equal(tool.hasPresentationChanged(), true);
  assert.equal(tool.hasPresentationChanged(), false);

  // Swap equally long interior states: extrema, their times and the weighted mean stay equal.
  const changedRows = item.rows.map((row) => ({
    state: String(row.state === 20 ? 30 : row.state === 30 ? 20 : row.state),
    last_changed: row.last_changed,
  }));
  tool.sparklineHistory.acceptHistoryRows(item, changedRows, tool.sparklineHistory.getSeriesRange(item));
  tool.setEntities(tool.card.runtimeEntityConfigs, tool.card.entities);

  assert.deepEqual(tool.getSeriesResult(), initialResult);
  assert.deepEqual(
    graph.coords.map((point) => point[2]),
    [10, 30, 20, 40],
  );
  assert.notDeepEqual(graph.coords, initialCoords);
  assert.notEqual(tool.geometry.line[0], initialPath);
  assert.equal(aggregate.mock.callCount(), 1);
  assert.equal(tool.hasPresentationChanged(), true);
  assert.equal(tool.hasPresentationChanged(), false);
});

test('real-time row reuse requires equal numeric state and sample timestamp', (context) => {
  const tool = createChangeDetectionTool(context, 'real_time');
  const item = tool.sparklineSeries.primaryItem;
  const graph = item.graph;
  const retained = { rows: item.rows, values: graph.processedValues, coords: graph.coords, statistics: graph.statistics };
  const graphUpdates = context.mock.method(tool, 'updateGraphFromSeries');
  const aggregate = context.mock.method(graph, 'aggregateBuckets');
  assert.equal(tool.hasPresentationChanged(), true);
  assert.equal(tool.hasPresentationChanged(), false);

  // A fresh HA object with equivalent numeric spelling must still update the action context.
  const equivalent = { ...tool.runtime.entity, state: '20.10', attributes: { friendly_name: 'Current temperature' } };
  tool.card.entities[0] = equivalent;
  tool.setEntities(tool.card.runtimeEntityConfigs, tool.card.entities);
  assert.strictEqual(tool.runtime.entity, equivalent);
  assert.strictEqual(item.rows, retained.rows);
  assert.strictEqual(graph.processedValues, retained.values);
  assert.strictEqual(graph.coords, retained.coords);
  assert.strictEqual(graph.statistics, retained.statistics);
  assert.equal(graphUpdates.mock.callCount(), 0);
  assert.equal(aggregate.mock.callCount(), 0);
  assert.equal(tool.hasPresentationChanged(), false);

  // Equal value at a new timestamp is a new sample and must refresh statistic times.
  tool.card.entities[0] = { ...equivalent, last_changed: '2026-09-26T11:01:00.000Z' };
  tool.setEntities(tool.card.runtimeEntityConfigs, tool.card.entities);
  assert.notStrictEqual(item.rows, retained.rows);
  assert.deepEqual(item.rows, [{ state: 20.1, last_changed: '2026-09-26T11:01:00.000Z' }]);
  assert.deepEqual(graph.statistics, {
    min: 20.1,
    avg: 20.1,
    max: 20.1,
    min_time: '2026-09-26T11:01:00.000Z',
    max_time: '2026-09-26T11:01:00.000Z',
  });
  assert.equal(graphUpdates.mock.callCount(), 1);
  assert.equal(aggregate.mock.callCount(), 1);
  assert.equal(tool.hasPresentationChanged(), true);
  const timestampRows = item.rows;

  // Configured decimals never suppress a changed raw value at the same timestamp.
  tool.card.entities[0] = { ...tool.card.entities[0], state: '20.4' };
  tool.setEntities(tool.card.runtimeEntityConfigs, tool.card.entities);
  assert.notStrictEqual(item.rows, timestampRows);
  assert.deepEqual(graph.processedValues, [20.4]);
  assert.equal(graph.statistics.avg, 20.4);
  assert.equal(graph.statistics.min_time, '2026-09-26T11:01:00.000Z');
  assert.equal(graphUpdates.mock.callCount(), 2);
  assert.equal(aggregate.mock.callCount(), 2);
  assert.equal(tool.hasPresentationChanged(), true);
  assert.equal(tool.hasPresentationChanged(), false);
});

test('publishes all derived values from their graph, series and period owners', () => {
  const makeItem = (id, statistics) => ({
    id,
    rows: [{ state: statistics.avg }],
    requestState: 'loaded',
    dataState: 'has_data',
    graph: { statistics },
    config: {
      period: {
        type: 'rolling_window',
        rolling_window: { duration: { hour: 24 } },
      },
      sparkline: {
        show: { chart_type: 'line' },
        state_values: { aggregate_func: 'avg' },
      },
    },
  });
  const primary = makeItem('default', {
    min: 10,
    avg: 20,
    max: 30,
    min_time: '2026-09-12T08:00:00.000Z',
    max_time: '2026-09-12T11:00:00.000Z',
  });
  const comparison = makeItem('yesterday', {
    min: 8,
    avg: 18,
    max: 28,
    min_time: '2026-09-11T08:00:00.000Z',
    max_time: '2026-09-11T11:00:00.000Z',
  });
  const tool = Object.assign(Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} }), {
    sparklineSeries: {
      primaryItem: primary,
      items: [primary, comparison],
      binPlan: { perHour: 2, durationHours: 0.5 },
    },
    runtime: {
      periodDurationAvailable: true,
    },
  });

  assert.deepEqual(tool.getSeriesResult(undefined), {
    min: 10,
    avg: 20,
    max: 30,
    min_time: '2026-09-12T08:00:00.000Z',
    max_time: '2026-09-12T11:00:00.000Z',
    requestState: 'loaded',
    dataState: 'has_data',
    duration: 24,
    bin_duration: 0.5,
    aggregate_func: 'avg',
  });
  assert.deepEqual(tool.getSeriesResult('yesterday'), {
    min: 8,
    avg: 18,
    max: 28,
    min_time: '2026-09-11T08:00:00.000Z',
    max_time: '2026-09-11T11:00:00.000Z',
    requestState: 'loaded',
    dataState: 'has_data',
    duration: 24,
    bin_duration: 0.5,
    aggregate_func: 'avg',
  });
});

test('retained graph statistics are not published as current during loading or error', () => {
  const item = {
    id: 'default',
    requestState: 'loading',
    dataState: 'has_data',
    graph: { statistics: { min: 10, avg: 20, max: 30, min_time: 'old-min', max_time: 'old-max' } },
    config: {
      period: { type: 'rolling_window', rolling_window: { duration: { hour: 24 } } },
      sparkline: { show: { chart_type: 'line' }, state_values: { aggregate_func: 'avg' } },
    },
  };
  const tool = Object.assign(Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} }), {
    sparklineSeries: { primaryItem: item, items: [item], binPlan: { durationHours: 1 } },
    runtime: {
      periodDurationAvailable: true,
    },
  });

  const loadingResult = tool.getSeriesResult();
  assert.equal(loadingResult.requestState, 'loading');
  assert.equal(loadingResult.dataState, 'has_data');
  assert.equal(loadingResult.min, undefined);
  assert.equal(loadingResult.avg, undefined);
  assert.equal(loadingResult.max, undefined);

  item.requestState = 'error';
  const errorResult = tool.getSeriesResult();
  assert.equal(errorResult.requestState, 'error');
  assert.equal(errorResult.min, undefined);
  assert.equal(errorResult.avg, undefined);
  assert.equal(errorResult.max, undefined);
});

test('history spinner follows only explicit loading request state', () => {
  const item = { requestState: 'not_loaded' };
  const tool = Object.assign(Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} }), {
    sparklineSeries: { items: [item] },
  });

  assert.equal(tool.historyLoading, false);
  item.requestState = 'loading';
  assert.equal(tool.historyLoading, true);
  item.requestState = 'error';
  assert.equal(tool.historyLoading, false);
  item.requestState = 'loaded';
  assert.equal(tool.historyLoading, false);
  item.requestState = 'closed';
  assert.equal(tool.historyLoading, false);
});

test('retained presentation renders a loading spinner without disabling interaction', () => {
  const tool = Object.assign(Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} }), {
    sparklineSeries: {
      items: [
        {
          requestState: 'loading',
          dataState: 'has_data',
          graph: {
            drawArea: { x: 0, y: 0, width: 100, height: 50 },
          },
        },
      ],
      primaryItem: {
        graph: {
          drawArea: { x: 0, y: 0, width: 100, height: 50 },
        },
      },
      dataState: 'has_data',
    },
    config: {
      sparkline: {
        loading: {
          size: 10,
          styles: {},
        },
      },
    },
  });

  const spinner = tool.renderHistoryLoadingSpinner();
  assert.match(spinner.strings.join(''), /sparkline-history-spinner/);
});

test('real-time and state-band results omit metadata that does not apply', () => {
  const realTime = {
    id: 'default',
    rows: [{ state: 12 }],
    requestState: 'not_required',
    dataState: 'has_data',
    graph: { statistics: { min: 12, avg: 12, max: 12, min_time: 'now', max_time: 'now' } },
    config: {
      period: { type: 'real_time' },
      sparkline: { show: { chart_type: 'bar' }, state_values: { aggregate_func: 'last' } },
    },
  };
  const stateBands = {
    id: 'default',
    rows: [{ state: 1 }],
    requestState: 'loaded',
    dataState: 'has_data',
    graph: { statistics: { min: 0, avg: 0.5, max: 1, min_time: 'start', max_time: 'end' } },
    config: {
      period: { type: 'rolling_window', rolling_window: { duration: { hour: 12 } } },
      sparkline: { show: { chart_type: 'state_bands' }, state_values: { aggregate_func: 'avg' } },
    },
  };
  const tool = Object.assign(Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} }), {
    sparklineSeries: { primaryItem: realTime, items: [realTime], dataState: 'has_data', binPlan: { perHour: undefined, durationHours: undefined } },
    runtime: {
      periodDurationAvailable: true,
    },
  });

  const realTimeResult = tool.getSeriesResult(undefined);
  assert.equal(realTimeResult.min, 12);
  assert.equal(realTimeResult.duration, undefined);
  assert.equal(realTimeResult.bin_duration, undefined);
  assert.equal(realTimeResult.aggregate_func, undefined);

  tool.sparklineSeries = { primaryItem: stateBands, items: [stateBands], binPlan: { perHour: 1, durationHours: undefined } };
  const stateBandResult = tool.getSeriesResult(undefined);
  assert.equal(stateBandResult.duration, 12);
  assert.equal(stateBandResult.bin_duration, undefined);
  assert.equal(stateBandResult.aggregate_func, undefined);
});

test('radial barcode exposes only its radial time-axis presentation', () => {
  const tool = Object.assign(Object.create(SparklineGraphTool.prototype), { geometry: {}, runtime: {}, paint: {} });
  const calls = [];
  Object.assign(tool, {
    config: {
      sparkline: {
        show: {
          chart_type: 'radial_barcode',
          tickmarks: { x: true, y: true },
          labels: { x: true, y: true },
        },
      },
      x_axis: {
        tickmarks_major: { size: 1 },
        labels: { offset: 2 },
      },
    },
    resolveAxisFontSizePixels: () => 8,
    buildYAxisTicks: () => {
      throw new Error('radial barcode has no value axis');
    },
    geometry: {
      axisGraphs: {
        primary: {
          input: {
            sparkline: {
              show: {
                chart_type: 'radial_barcode',
                tickmarks: { y: true },
                labels: { y: true },
              },
            },
          },
        },
        secondary: undefined,
      },
    },
  });

  const margin = tool.calculateRadialAxisMargin(tool.geometry.axisGraphs);
  assert.ok(margin.t > 0);
  assert.deepEqual(margin, { t: margin.t, r: margin.t, b: margin.t, l: margin.t, x: margin.t, y: margin.t });

  tool.renderRadialGrid = () => calls.push('grid');
  tool.renderRadialAxis = () => calls.push('axis');
  tool.renderRadialTickmarks = () => calls.push('tickmarks');
  tool.renderRadialAxisLabels = () => calls.push('labels');
  tool.renderGrid();
  tool.renderAxis();
  tool.renderTickmarks();
  tool.renderAxisLabels();

  assert.deepEqual(calls, ['grid', 'axis', 'tickmarks', 'labels']);
});
