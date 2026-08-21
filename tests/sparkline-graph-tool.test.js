import test from 'node:test';
import assert from 'node:assert/strict';
import SparklineGraphTool from '../src/sparkline-graph-tool.js';

test('dynamic calendar period initializes and clamps a rolling duration to one day', () => {
  const previousWindow = globalThis.window;
  const previousConsoleWarn = console.warn;
  const warnings = [];
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
        type: "[[[ return entities[0].state; ]]]",
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
      },
    };

    const tool = new SparklineGraphTool(config, 0, templates, 'test-card', card);

    assert.equal(tool.historyDurationReady, false);
    assert.equal(tool.Graph, undefined);

    tool.updateRuntimeConfig();

    assert.equal(tool.config.period.type, 'calendar');
    assert.equal(tool.config.period.calendar.duration.hour, 24);
    assert.equal(tool.historyDurationReady, true);
    assert.notEqual(tool.Graph, undefined);
    assert.deepEqual(warnings, [
      "[FHS sparkline] calendar day duration '6' hours is shorter than one day; using 24 hours",
    ]);

    tool.updateRuntimeConfig();

    assert.equal(warnings.length, 1);
  } finally {
    globalThis.window = previousWindow;
    console.warn = previousConsoleWarn;
  }
});

test('area chart omits its line layers when show.line is false', () => {
  const tool = Object.create(SparklineGraphTool.prototype);
  Object.assign(tool, {
    cardId: 'test-card',
    index: 0,
    svg: { width: 100, height: 50 },
    config: {
      sparkline: {
        show: { chart_type: 'area', line: false },
        colorstops: { colors: [] },
      },
    },
    getLineStyles: () => ({
      stroke: 'red',
      'stroke-width': 1,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    }),
    getRenderStyles: (styles) => styles,
  });

  assert.equal(tool.renderSvgLineMask('M 0 0 L 100 50', 0), '');
  assert.equal(tool.renderSvgLineBackground('M 0 0 L 100 50', 0), '');

  tool.config.sparkline.show.line = true;

  assert.notEqual(tool.renderSvgLineMask('M 0 0 L 100 50', 0), '');
  assert.notEqual(tool.renderSvgLineBackground('M 0 0 L 100 50', 0), '');
});

test('bar fade reverses at zero for positive and negative values', () => {
  const tool = Object.create(SparklineGraphTool.prototype);
  Object.assign(tool, {
    cardId: 'test-card',
    index: 3,
    config: {
      period: { type: 'rolling_window' },
      sparkline: {
        animate: false,
        show: { chart_type: 'bar', fill: 'fade' },
        bar: { foreground: { styles: {} } },
      },
    },
    historySeries: [],
    Graph: { width: 100, height: 50 },
    computeColor: (value) => (value >= 0 ? 'red' : 'blue'),
    getRenderStyles: (styles) => styles,
  });

  const rendered = tool.renderSvgBars([
    { x: 1, y: 2, width: 3, height: 4, value: 5 },
    { x: 6, y: 7, width: 3, height: 4, value: -5 },
  ], 0);
  const positiveBar = rendered.values[3][0];
  const negativeBar = rendered.values[3][1];

  assert.deepEqual(positiveBar.values[0].values.slice(1, 3), ['0%', '100%']);
  assert.equal(positiveBar.values[7], 'url(#bar-fill-fade-test-card-3-0-0)');
  assert.deepEqual(negativeBar.values[0].values.slice(1, 3), ['100%', '0%']);
  assert.equal(negativeBar.values[7], 'url(#bar-fill-fade-test-card-3-0-1)');
  assert.equal(tool.renderSvgBarsBackground([{ value: 5 }], 0), '');
});

test('accepted history keeps its update flag active through the card pipeline', async () => {
  const tool = Object.create(SparklineGraphTool.prototype);
  const entity = {
    entity_id: 'sensor.active',
    state: '12',
    last_changed: '2026-08-13T10:00:00.000Z',
    last_updated: '2026-08-13T10:00:00.000Z',
  };
  const range = {
    start: new Date('2026-08-12T10:00:00.000Z'),
    end: new Date('2026-08-13T10:00:00.000Z'),
  };
  const updateFlagsSeenByCard = [];
  const hass = {
    callApi: async () => [[entity]],
  };

  Object.assign(tool, {
    cardId: 'test-card',
    config: {
      id: 'history',
      period: {
        type: 'rolling_window',
        rolling_window: { duration: { hour: 24 } },
      },
      history: {},
    },
    entity,
    historyDurationReady: true,
    historyPromise: undefined,
    historySeries: undefined,
    historyPeriodSignature: 'active-period',
    historyEntityId: entity.entity_id,
    historyResynchronizationRequested: false,
    historyLoading: false,
    preserveGraphWhileHistoryLoads: false,
    card: {
      dev: { debug: false },
      _hass: hass,
      resolvedEntityConfigs: [],
      entities: [],
      requestUpdate() {},
      cardTools: { getBySection: () => [tool] },
      cardEntities: { updateSparklineEntities() {} },
      setHass() {
        updateFlagsSeenByCard.push(tool.requiresHassUpdate());
      },
    },
    getHistoryRange: () => range,
    acceptedHistoryContainsRange: () => false,
    buildHistorySeries: (rows) => rows,
    addCurrentEntityToHistory() {},
    updateGraphFromSeries() {},
    clearTooltip() {},
  });

  tool.fetchHistoryIfNeeded(entity);
  await tool.historyPromise;

  assert.deepEqual(updateFlagsSeenByCard, [true]);
  assert.equal(tool.historyResynchronizationRequested, false);
  assert.equal(tool.historyLoading, false);
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
    const tool = Object.create(SparklineGraphTool.prototype);
    tool.config = {
      period: {
        type: 'calendar',
        calendar: {
          period: 'day',
          offset: 0,
          duration: { hour: 48 },
        },
      },
    };

    const range = tool.getHistoryRange();

    assert.equal(range.start.getTime(), new NativeDate('2026-08-13T00:00:00').getTime());
    assert.equal(range.end.getTime(), new NativeDate('2026-08-15T00:00:00').getTime());
  } finally {
    globalThis.Date = NativeDate;
  }
});

test('completed calendar history is not fetched again while its fixed range is represented', () => {
  const tool = Object.create(SparklineGraphTool.prototype);
  const range = {
    start: new Date('2026-08-12T00:00:00.000Z'),
    end: new Date('2026-08-13T00:00:00.000Z'),
  };
  let apiCalls = 0;

  Object.assign(tool, {
    config: {
      id: 'closed-history',
      period: {
        type: 'calendar',
        calendar: {
          period: 'day',
          offset: -1,
          duration: { hour: 24 },
        },
      },
      history: {},
    },
    historyDurationReady: true,
    historyPromise: undefined,
    historySeries: [{ state: '12' }],
    historyRangeStart: range.start.getTime(),
    historyRangeEnd: range.end.getTime(),
    historyResynchronizationRequested: false,
    getHistoryRange: () => range,
    card: {
      dev: { debug: false },
      _hass: {
        callApi() {
          apiCalls += 1;
        },
      },
    },
  });

  tool.fetchHistoryIfNeeded({
    entity_id: 'sensor.closed',
    state: '12',
  });

  assert.equal(apiCalls, 0);
  assert.equal(tool.historyPromise, undefined);
});
