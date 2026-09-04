import test from 'node:test';
import assert from 'node:assert/strict';
import SparklineGraphTool from '../src/sparkline-graph-tool.js';
import SparklineSeries from '../src/sparkline-series.js';
import SparklineGraph from '../src/sparkline-graph.js';

test('dynamic sparkline config preserves zero thresholds and clamps a calendar day', () => {
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
      },
    };

    const tool = new SparklineGraphTool(config, 0, templates, 'test-card', card);

    assert.equal(tool.historyDurationReady, false);
    assert.equal(tool.primaryGraph, undefined);

    tool.updateRuntimeConfig();

    assert.equal(tool.config.period.type, 'calendar');
    assert.equal(tool.config.period.calendar.duration.hour, 24);
    assert.equal(tool.historyDurationReady, true);
    assert.notEqual(tool.primaryGraph, undefined);
    assert.deepEqual(warnings, ["[FHS sparkline] calendar day duration '6' hours is shorter than one day; using 24 hours"]);

    const activeGraph = tool.primaryGraph;
    tool.updateRuntimeConfig();

    assert.equal(tool.primaryGraph, activeGraph);
    assert.equal(warnings.length, 1);

    card.evaluateJavascriptTemplates = false;
    card.cardTheme.modeChanged = true;
    tool.config.sparkline.colorstops.colors = [
      { value: -10, color: '#1565c0' },
      { value: 0, color: '#d32f2f' },
    ];
    tool.updateRuntimeConfig();

    assert.equal(tool.gradeRanks[0].rangeMax[0], 0);
  } finally {
    globalThis.window = previousWindow;
    console.warn = previousConsoleWarn;
  }
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
        show: { chart_type: 'radial', chart_variant: 'line' },
        radial: {
          arc_degrees: '[[[ return 180; ]]]',
          rotate: '[[[ return -90; ]]]',
          size: 15,
        },
      },
    };

    const tool = new SparklineGraphTool(config, 0, templates, 'test-card', card);
    tool.updateRuntimeConfig();

    assert.equal(tool.config.sparkline.radial.arc_degrees, 180);
    assert.equal(tool.config.sparkline.radial.rotate, -90);
    assert.equal(tool.config.sparkline.radial.size, 15);
    assert.equal(tool.config.sparkline.show.background, true);
    assert.equal(tool.config.sparkline.radial.background.styles.fill, 'var(--secondary-background-color)');
    assert.equal(tool.config.sparkline.line.line_width, 1);
    assert.equal(tool.getConfiguredLineWidth(tool.sparklineSeries.primaryItem.config), 2);
    assert.equal(tool.primaryGraph.getRadialGeometry().arcDegrees, 180);
    assert.equal(tool.primaryGraph.getRadialGeometry().rotate, -90);

    tool.legendMeasuredFontSize = 4;
    tool.legendMeasuredRowHeight = 5;
    tool.legendMeasuredSignature = '4|5';
    radialSize = 20;
    tool.updateRuntimeConfig();

    assert.equal(tool.config.sparkline.radial.size, 20);
    assert.equal(tool.legendMeasuredFontSize, 4);
    assert.equal(tool.legendMeasuredRowHeight, 5);
    assert.equal(tool.legendMeasuredSignature, '4|5');
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
  context.after(() => { globalThis.window = previousWindow; });

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
  const tool = Object.create(SparklineGraphTool.prototype);
  tool.svg = { width: 200, height: 100 };
  tool.legendMeasuredFontSize = undefined;
  tool.legendMeasuredRowHeight = undefined;
  tool.legendMeasuredFontSize = undefined;
  tool.legendMeasuredRowHeight = undefined;

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
  const tool = Object.create(SparklineGraphTool.prototype);
  tool.svg = { width: 200, height: 100 };
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
  const tool = Object.create(SparklineGraphTool.prototype);
  let legendPositionUpdates = 0;
  let cardUpdates = 0;
  Object.assign(tool, {
    config: {
      sparkline: {
        show: { legend: true },
        legend: { line_height: 1.2 },
      },
    },
    legendTextTools: [{
      widthOverflowPending: false,
      updated() {},
      textElement: { getBBox: () => ({ height: 4 }) },
    }],
    legendMeasuredSignature: undefined,
    graphReady: false,
    calculateLegendLayout: () => ({ graphArea: { x: 0, y: 6, width: 100, height: 94 } }),
    updateRuntimeConfig() {},
    updateLegendTextTools() { legendPositionUpdates += 1; },
    card: { requestUpdate() { cardUpdates += 1; } },
  });

  tool.updated();

  assert.equal(legendPositionUpdates, 1);
  assert.equal(cardUpdates, 1);
  assert.deepEqual(tool.graphArea, { x: 0, y: 6, width: 100, height: 94 });
});

test('legend waits for width ellipsis before measuring its visible text', () => {
  const tool = Object.create(SparklineGraphTool.prototype);
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
    legendMeasuredSignature: undefined,
    graphReady: false,
    calculateLegendLayout: () => ({ graphArea: { x: 0, y: 6, width: 100, height: 94 } }),
    updateRuntimeConfig() {},
    updateLegendTextTools() { legendPositionUpdates += 1; },
    card: { requestUpdate() {} },
  });

  tool.updated();

  assert.equal(boundingBoxReads, 0);
  assert.equal(legendPositionUpdates, 0);
  assert.equal(tool.legendMeasuredSignature, undefined);

  legendTextTool.textElement.getBBox = () => {
    boundingBoxReads += 1;
    return { height: 4 };
  };
  tool.updated();

  assert.equal(boundingBoxReads, 1);
  assert.equal(legendPositionUpdates, 1);
  assert.equal(tool.legendMeasuredFontSize, 4);
  assert.equal(tool.legendMeasuredRowHeight, 4.8);
});

test('area chart omits its line layers when show.line is false', () => {
  const tool = Object.create(SparklineGraphTool.prototype);
  Object.assign(tool, {
    cardId: 'test-card',
    index: 0,
    svg: { width: 100, height: 50 },
    graphArea: { width: 100, height: 50 },
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
    sparklineSeries: {
      items: [],
      primaryItem: {
        graph: { width: 100, height: 50 },
      },
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
  const gradients = tool.renderBarFadeGradients(
    [
      { value: 5 },
      { value: -5 },
    ],
    0,
    tool.config,
    0,
  );

  assert.deepEqual(gradients[0].values.slice(1, 3), ['0%', '100%']);
  assert.equal(gradients[0].values[0], 'bar-fill-fade-test-card-3-0-0');
  assert.deepEqual(gradients[1].values.slice(1, 3), ['100%', '0%']);
  assert.equal(gradients[1].values[0], 'bar-fill-fade-test-card-3-0-1');
  assert.equal(tool.renderSvgBarsBackground([{ value: 5 }], 0), '');
});

test('area fade uses the fixed color belonging to each series', () => {
  const tool = Object.create(SparklineGraphTool.prototype);
  const lineColors = ['#1565c0', '#d32f2f'];
  const makeItem = (id) => ({
    id,
    entityConfig: {},
    graph: { drawArea: { height: 40 } },
    config: {
      sparkline: {
        show: { chart_type: 'area', fill: 'fade' },
        line_color: lineColors,
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

test('cartesian line and area series render their independently enabled minmax envelopes', () => {
  const calls = [];
  const makeItem = (id, chartType, showMinMax, color) => ({
    id,
    entityConfig: {},
    graph: {
      coords: [[0, 0, 10]],
      getPath: () => `${id}-line`,
      getArea: () => `${id}-area`,
      getPathMin: () => `${id}-minimum`,
      getPathMax: () => `${id}-maximum`,
      getAreaMinMax: (minimum, maximum) => {
        calls.push([id, minimum, maximum]);
        return `${id}-minmax`;
      },
      calculateYCoordinates: () => [],
    },
    config: {
      color,
      area: { styles: { opacity: 0.25 } },
      sparkline: {
        show: { chart_type: chartType, fill: 'solid', line: true, points: false },
        line_color: [color, color, color],
        line: { line_width: 1, styles: {}, show_dots: false, show_minmax: chartType === 'line' && showMinMax },
        area: { show_dots: false, show_minmax: chartType === 'area' && showMinMax },
        dots: { radius: 1 },
      },
    },
  });
  const tool = Object.create(SparklineGraphTool.prototype);
  Object.assign(tool, {
    cardId: 'test-card',
    index: 6,
    sparklineSeries: {
      items: [
        makeItem('line-range', 'line', true, '#1565c0'),
        makeItem('area-range', 'area', true, '#d32f2f'),
        makeItem('line-only', 'line', false, '#66bb6a'),
      ],
    },
    getConfiguredLineWidth: () => 1,
    getRenderStyles: (styles) => styles,
  });

  const renderedItems = tool.renderSeriesCartesian().values[0];

  assert.deepEqual(calls, [
    ['line-range', 'line-range-minimum', 'line-range-maximum'],
    ['area-range', 'area-range-minimum', 'area-range-maximum'],
  ]);
  assert.match(renderedItems[0].values[1].strings.join(''), /sparkline-series-minmax/);
  assert.match(renderedItems[1].values[1].strings.join(''), /sparkline-series-minmax/);
  assert.equal(renderedItems[2].values[1], '');
});

test('single line minmax uses only the line styles', () => {
  const paintSources = [];
  let renderedStyles;
  let areaStyleCalls = 0;
  const lineStyles = { stroke: 'red', 'stroke-width': 2, opacity: 0.8 };
  const areaStyles = { fill: 'blue', opacity: 0.2 };
  const tool = Object.create(SparklineGraphTool.prototype);
  Object.assign(tool, {
    cardId: 'test-card',
    index: 4,
    graphArea: { width: 80, height: 40 },
    config: {
      sparkline: {
        show: { chart_type: 'line' },
        line: {
          minmax: {
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
    getRenderStyles: (styles) => {
      renderedStyles = styles;
      return styles;
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
});

test('radial area fade follows the visible zero radius', () => {
  const tool = Object.create(SparklineGraphTool.prototype);
  const graph = {
    min: -10,
    max: 10,
    getRadialGeometry: () => ({ centerX: 50, centerY: 50, outerRadius: 40 }),
    getRadialRadiusForValue: (value) => (value + 10) * 2,
  };
  Object.assign(tool, {
    cardId: 'test-card',
    index: 4,
    graphArea: { width: 100, height: 100 },
    sparklineSeries: {
      items: [{
        id: 'temperature',
        graph,
        config: {
          sparkline: {
            show: { chart_type: 'radial', chart_variant: 'area', fill: 'fade' },
          },
        },
      }],
    },
  });

  const masks = tool.renderSeriesRadialAreaMasks();

  assert.match(masks[0].strings.join(''), /radialGradient/);
  assert.ok(masks[0].values.includes('50%'));
  assert.ok(masks[0].values.includes('radial-area-fade-mask-test-card-4-temperature'));
});

test('radial series render all areas below every line and point', () => {
  const tool = Object.create(SparklineGraphTool.prototype);
  const makeItem = (id, variant, color) => ({
    id,
    entityConfig: {},
    graph: {
      getRadialPath: () => `${id}-line`,
      getRadialArea: () => `${id}-area`,
      getRadialMinMaxArea: () => `${id}-minmax`,
      getRadialPoints: () => [[10, 20, 30]],
    },
    config: {
      color,
      area: { styles: {} },
      sparkline: {
        show: {
          chart_variant: variant,
          fill: 'solid',
          line: variant !== 'dots',
          points: variant === 'dots',
        },
        colorstops: { colors: [] },
        colorstops_transition: 'hard',
        line_color: [color, color, color],
        line: { line_width: 1, styles: {}, show_dots: false, show_minmax: variant === 'line' },
        area: { show_dots: false, show_minmax: variant === 'area' },
        dots: { radius: 1 },
      },
    },
  });

  Object.assign(tool, {
    cardId: 'test-card',
    index: 5,
    sparklineSeries: {
      items: [
        makeItem('line-first', 'line', '#1565c0'),
        makeItem('area-second', 'area', '#d32f2f'),
        makeItem('dots-third', 'dots', '#66bb6a'),
      ],
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
  const tool = Object.create(SparklineGraphTool.prototype);
  Object.assign(tool, {
    cardId: 'test-card',
    index: 3,
    activePoint: 2,
    config: { sparkline: { show: { chart_type: 'radial' } } },
    sparklineSeries: {
      primaryItem: {
        graph: {
          getRadialGeometry: () => ({ centerX: 50, centerY: 50, innerRadius: 30, outerRadius: 40 }),
          getRadialAngleForBin: () => 90,
          getRadialPoint: (radius) => ({ x: 50 + radius, y: 50 }),
        },
      },
    },
  });

  const indicator = tool.renderActiveIndicator();

  assert.ok(indicator.values.includes(80));
  assert.ok(indicator.values.includes(90));
  assert.ok(indicator.values.includes('visible'));
});

test('horizontal radial x-axis labels align away from the circumference', () => {
  const tool = Object.create(SparklineGraphTool.prototype);
  const renderedStyles = [];
  const graph = {
    axisArea: { x: 0, width: 100 },
    getRadialGeometry: () => ({ arcDegrees: 360, anglePerBin: 15, outerRadius: 40 }),
    getRadialAngleForFraction: (fraction) => fraction * 360,
    getRadialValueAxisAngle: () => 0,
    getRadialPoint: (radius, angle) => ({ x: radius, y: angle }),
  };

  Object.assign(tool, {
    sparklineSeries: { primaryItem: { graph } },
    axisGraphs: { primary: undefined, secondary: undefined },
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
  const tool = Object.create(SparklineGraphTool.prototype);
  const projectedAngles = [];
  const graph = {
    axisArea: { x: 0, width: 100 },
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
    axisGraphs: { primary: undefined, secondary: undefined },
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
  context.after(() => { globalThis.window = previousWindow; });

  const card = {
    evaluateJavascriptTemplates: false,
    dev: { debug: false },
    config: {},
    entities: [],
    resolvedEntityConfigs: [],
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
  assert.equal(tool.legendItems.length, 3);
  assert.equal(tool.legendTextTools.length, 3);
  assert.ok(tool.legendLayout.legendArea.height > 0);

  const measurementElement = {};
  const ellipsisElement = {};
  tool.legendTextTools[0].widthMeasurementElements[0] = measurementElement;
  tool.legendTextTools[0].widthEllipsisElements[0] = ellipsisElement;
  tool.legendTextTools[0].render();

  assert.equal(tool.legendTextTools[0].widthMeasurementElements[0], measurementElement);
  assert.equal(tool.legendTextTools[0].widthEllipsisElements[0], ellipsisElement);
  assert.match(tool.renderLegend().strings.join(''), /sparkline-legend/);
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
    sparklineSeries: {
      items: [],
      primaryItem: {
        graph: undefined,
        rows: [],
        historyPromise: undefined,
        historySeries: undefined,
        historyRangeStart: undefined,
        historyRangeEnd: undefined,
        historyEntityId: entity.entity_id,
        historyRefreshAt: 0,
        historyResynchronizationRequested: false,
      },
      setRows(item, rows) {
        item.rows = rows;
      },
    },
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

  tool.sparklineSeries.primaryItem.config = tool.config;
  tool.sparklineSeries.primaryItem.entity = entity;
  tool.sparklineSeries.items = [tool.sparklineSeries.primaryItem];
  tool.fetchHistoryIfNeeded(tool.sparklineSeries.primaryItem);
  await tool.sparklineSeries.primaryItem.historyPromise;

  assert.deepEqual(updateFlagsSeenByCard, [true]);
  assert.equal(tool.sparklineSeries.primaryItem.historyResynchronizationRequested, false);
  assert.equal(tool.historyLoading, false);
});

test('sun history and current forecast become exact day and night segments', () => {
  const tool = Object.create(SparklineGraphTool.prototype);
  Object.assign(tool, {
    config: {
      period: {
        type: 'calendar',
        calendar: { offset: 0 },
      },
    },
    dayNightHistory: [
      { state: 'below_horizon', last_changed: '2026-09-02T00:00:00.000Z' },
      { state: 'above_horizon', last_changed: '2026-09-02T06:13:00.000Z' },
    ],
    dayNightSegments: [],
    getDayNightRange: () => ({
      start: new Date('2026-09-02T00:00:00.000Z'),
      end: new Date('2026-09-03T00:00:00.000Z'),
      sourceRangeIsActive: true,
    }),
  });

  tool.buildDayNightSegments({
    state: 'above_horizon',
    last_changed: '2026-09-02T06:13:00.000Z',
    attributes: {
      next_rising: '2026-09-03T06:15:00.000Z',
      next_setting: '2026-09-02T18:47:00.000Z',
    },
  });

  assert.deepEqual(
    tool.dayNightSegments.map((segment) => ({
      state: segment.state,
      start: segment.start.toISOString(),
      end: segment.end.toISOString(),
    })),
    [
      { state: 'night', start: '2026-09-02T00:00:00.000Z', end: '2026-09-02T06:13:00.000Z' },
      { state: 'day', start: '2026-09-02T06:13:00.000Z', end: '2026-09-02T18:47:00.000Z' },
      { state: 'night', start: '2026-09-02T18:47:00.000Z', end: '2026-09-03T00:00:00.000Z' },
    ],
  );
});

test('represented sun history is reused without another request or loading state', () => {
  const tool = Object.create(SparklineGraphTool.prototype);
  const range = {
    start: new Date('2026-09-01T00:00:00.000Z'),
    end: new Date('2026-09-02T00:00:00.000Z'),
    sourceRangeIsActive: false,
  };
  let apiCalls = 0;
  let segmentBuilds = 0;

  Object.assign(tool, {
    config: {
      period: {
        type: 'calendar',
        calendar: { offset: -1 },
      },
    },
    dayNightHistory: [{ state: 'below_horizon', last_changed: range.start.toISOString() }],
    dayNightHistoryPromise: undefined,
    dayNightRangeStart: range.start.getTime(),
    dayNightRangeEnd: range.end.getTime(),
    dayNightResynchronizationRequested: false,
    sparklineSeries: { items: [{ historyLoading: false }] },
    getDayNightRange: () => range,
    buildDayNightSegments() {
      segmentBuilds += 1;
    },
    card: {
      _hass: {
        callApi() {
          apiCalls += 1;
        },
      },
    },
  });

  tool.fetchDayNightHistoryIfNeeded({});

  assert.equal(apiCalls, 0);
  assert.equal(segmentBuilds, 1);
  assert.equal(tool.historyLoading, false);
});

test('day and night resynchronization participates in the normal hass update contract', () => {
  const tool = Object.create(SparklineGraphTool.prototype);
  Object.assign(tool, {
    dayNightResynchronizationRequested: true,
    sparklineSeries: { items: [] },
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

    const range = tool.getHistoryRange({ config: tool.config });

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
    sparklineSeries: {
      items: [],
      primaryItem: {
        historyPromise: undefined,
        historySeries: [{ state: '12' }],
        historyRangeStart: range.start.getTime(),
        historyRangeEnd: range.end.getTime(),
        historyEntityId: undefined,
        historyRefreshAt: 0,
        historyResynchronizationRequested: false,
      },
    },
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

  tool.sparklineSeries.primaryItem.config = tool.config;
  tool.sparklineSeries.primaryItem.entity = {
    entity_id: 'sensor.closed',
    state: '12',
  };
  tool.sparklineSeries.items = [tool.sparklineSeries.primaryItem];
  tool.fetchHistoryIfNeeded(tool.sparklineSeries.primaryItem);

  assert.equal(apiCalls, 0);
  assert.equal(tool.historyPromise, undefined);
});

test('axis margin contains labels and tickmarks independently from data margin', () => {
  const tool = Object.create(SparklineGraphTool.prototype);
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
    axisGraphs: {
      primary: {
        config: {
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
    resolveAxisFontSizePixels: (axis) => (axis === 'x' ? 8 : 10),
    buildXAxisTicks: () => [{ label: '08:00' }, { label: '12:00' }],
    buildYAxisTicks: () => [{ label: '-20' }, { label: '100' }],
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
  const tool = Object.create(SparklineGraphTool.prototype);
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
  const tool = Object.create(SparklineGraphTool.prototype);
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
    config: { geometry: { line_width: 1 } },
    min,
    max,
    coords: [[0, 0, min], [100, 0, max]],
    drawArea: { x: 0, y: 0, width: 100, height: 50 },
    update() {},
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
  });
  const tool = Object.create(SparklineGraphTool.prototype);
  const makeConfig = (chartType) => ({
    period: { type: 'real_time' },
    sparkline: {
      show: { chart_type: chartType, line: true, points: false },
      line: { show_dots: false },
      area: { show_dots: false },
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
    configuredGraphMargin: { t: 0, r: 0, b: 0, l: 0 },
    svg: { line_width: 1 },
    calculateAxisMargin: () => ({ t: 0, r: 0, b: 0, l: 0 }),
    calculateStatistics: () => ({}),
    area: [],
    areaMinMax: [],
    line: [],
    points: [],
    gradient: [],
  });

  tool.updateCartesianSeriesGraphs();

  assert.deepEqual(calls, [[10, 10, 20], [30, 30, 40]]);
  assert.equal(tool.axisGraphs.primary, first.graph);
  assert.equal(tool.axisGraphs.secondary, second.graph);
  assert.equal(tool.graphReady, true);
  assert.equal(tool.line.length, 1);
  assert.equal(tool.points.length, 2);

  first.graph.min = 10;
  first.graph.max = 20;
  second.graph.min = 30;
  second.graph.max = 40;
  first.config.y_axis = { lower_bound: -10, upper_bound: 50 };
  second.config.y_axis = { lower_bound: 0, upper_bound: 100 };
  calls.length = 0;

  tool.updateCartesianSeriesGraphs();

  assert.deepEqual(calls, [[10, -10, 50], [30, 0, 100]]);

  first.graph.min = 10;
  first.graph.max = 20;
  second.graph.min = 30;
  second.graph.max = 40;
  first.config.y_axis = { lower_bound: -1 };
  second.config.y_axis = { upper_bound: 100 };
  calls.length = 0;

  tool.updateCartesianSeriesGraphs();

  assert.deepEqual(calls, [[10, -1, 20], [30, 30, 100]]);
});


test('explicit series use the most restrictive automatic bin density for every graph', () => {
  const tool = Object.create(SparklineGraphTool.prototype);
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
      colorstops: { colors: [] },
    },
    x_axis: { labels: {} },
    y_axis: {},
  });
  const line = { id: 'line', config: makeConfig('line') };
  const dots = { id: 'dots', config: makeConfig('dots') };
  Object.assign(tool, {
    svg: { width: 90, height: 40, line_width: 1, column_spacing: 0.2 },
    graphArea: { width: 90, height: 40 },
    xAxisLabelLength: 10,
    stateBandsStateMap: {},
    config: line.config,
    sparklineSeries: Object.assign(Object.create(SparklineSeries.prototype), { items: [line, dots] }),
  });

  const sharedBinsPerHour = tool.sparklineSeries.calculateSharedBinsPerHour();
  const lineGraphConfig = tool.buildGraphConfig(line.config, sharedBinsPerHour);
  const dotsGraphConfig = tool.buildGraphConfig(dots.config, sharedBinsPerHour);

  assert.equal(sharedBinsPerHour, 1);
  assert.equal(lineGraphConfig.period.rolling_window.bins.per_hour, 1);
  assert.equal(dotsGraphConfig.period.rolling_window.bins.per_hour, 1);
});

test("multiple bar series receive grouped slots and one shared outer margin", () => {
  const calls = [];
  const makeGraph = () => ({
    min: 0,
    max: 10,
    coords: [[0, 0, 0], [100, 0, 10]],
    drawArea: { x: 0, y: 0, width: 100, height: 50 },
    clearSharedYAxisBounds() {},
    update() {},
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
  });
  const makeConfig = (chartType = 'bar') => ({
    period: { type: "real_time" },
    sparkline: {
      show: { chart_type: chartType, points: false },
      line: { show_dots: false },
      area: { show_dots: false },
      dots: { radius: 1 },
    },
    y_axis: {},
  });
  const first = { id: "first", config: makeConfig(), graph: makeGraph(), rows: [{ state: 4 }], entity: { last_changed: '2026-08-13T10:00:00.000Z' } };
  const line = { id: "line", config: makeConfig('line'), graph: makeGraph(), rows: [{ state: 6 }], entity: { last_changed: '2026-08-13T10:00:00.000Z' } };
  const second = { id: "second", config: makeConfig(), graph: makeGraph(), rows: [{ state: 8 }], entity: { last_changed: '2026-08-13T10:00:00.000Z' } };
  const tool = Object.create(SparklineGraphTool.prototype);
  Object.assign(tool, {
    sparklineSeries: Object.assign(Object.create(SparklineSeries.prototype), { items: [first, line, second] }),
    card: { dev: { debug: false } },
    configuredGraphMargin: { t: 0, r: 0, b: 0, l: 0 },
    svg: { line_width: 1, column_spacing: 4, row_spacing: 4 },
    calculateAxisMargin: () => ({ t: 0, r: 0, b: 0, l: 0 }),
    calculateStatistics: () => ({}),
    area: [],
    areaMinMax: [],
    line: [],
    points: [],
    gradient: [],
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

test("multiple series wait for every graph before building shared geometry", () => {
  let pathRead = false;
  const readyGraph = {
    coords: [[0, 0, 10]],
    clearSharedYAxisBounds() {},
    update() {},
    getPath() { pathRead = true; },
  };
  const loadingGraph = {
    coords: [],
    clearSharedYAxisBounds() {},
    update() {},
  };
  const config = {
    period: { type: "real_time" },
    sparkline: { show: { chart_type: "line" } },
  };
  const first = { id: "ready", config, graph: readyGraph, rows: [{ state: 10 }], entity: { last_changed: '2026-08-13T10:00:00.000Z' } };
  const second = { id: "loading", config, graph: loadingGraph, rows: [] };
  const tool = Object.create(SparklineGraphTool.prototype);
  Object.assign(tool, {
    sparklineSeries: Object.assign(Object.create(SparklineSeries.prototype), { items: [first, second] }),
    stats: { stale: true },
    configuredGraphMargin: { t: 0, r: 0, b: 0, l: 0 },
    svg: { column_spacing: 4, row_spacing: 4 },
    calculateAxisMargin: () => ({ t: 0, r: 0, b: 0, l: 0 }),
  });

  tool.updateCartesianSeriesGraphs();

  assert.equal(tool.graphReady, false);
  assert.deepEqual(tool.stats, {});
  assert.equal(pathRead, false);
});


test('offset rolling history stays cached while its moving reference range advances', () => {
  const tool = Object.create(SparklineGraphTool.prototype);
  const item = {
    config: { period: { type: 'rolling_window' } },
    historySeries: [{ state: '12' }],
    historyRangeStart: new Date('2026-08-20T12:00:00.000Z').getTime(),
    historyRangeEnd: new Date('2026-08-21T12:00:00.000Z').getTime(),
  };
  const range = {
    start: new Date('2026-08-20T12:01:00.000Z'),
    end: new Date('2026-08-21T12:01:00.000Z'),
    sourceRangeIsActive: false,
  };

  assert.equal(tool.acceptedHistoryContainsRange(item, range), true);
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
    const tool = Object.create(SparklineGraphTool.prototype);
    tool.config = {
      period: {
        type: 'calendar',
        calendar: { period: 'day', offset: 0, duration: { hour: 24 } },
      },
    };
    const item = {
      config: {
        period: {
          type: 'calendar',
          calendar: { period: 'day', offset: -1, duration: { hour: 24 } },
        },
        sparkline: { show: { chart_type: 'line' } },
      },
    };
    const range = tool.getHistoryRange(item);
    const rows = tool.buildHistorySeries(item, [{ state: '12', last_changed: '2026-08-13T09:30:00.000Z' }], { state: '13' }, range);

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
    const tool = Object.create(SparklineGraphTool.prototype);
    tool.config = {
      period: {
        type: 'rolling_window',
        rolling_window: { offset: 0, duration: { hour: 24 } },
      },
    };
    const item = {
      config: {
        period: {
          type: 'rolling_window',
          rolling_window: { offset: -1, duration: { hour: 24 } },
        },
        sparkline: { show: { chart_type: 'line' } },
      },
    };
    const range = tool.getHistoryRange(item);
    const rows = tool.buildHistorySeries(item, [{ state: '12', last_changed: '2026-08-13T09:30:00.000Z' }], { state: '13' }, range);

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
  const tool = Object.create(SparklineGraphTool.prototype);
  Object.assign(tool, {
    config: { period: parentPeriod, series: [{}, {}] },
    sparklineSeries: {
      items: [
        { config: { ...seriesConfig, period: parentPeriod } },
        { config: seriesConfig },
      ],
    },
    svg: { width: 100, height: 50, line_width: 0, column_spacing: 0 },
    graphArea: { width: 100, height: 50 },
    xAxisLabelLength: 5,
  });

  const graphConfig = tool.buildGraphConfig(seriesConfig, 1);

  assert.equal(graphConfig.period.calendar.offset, 0);
  assert.equal(graphConfig.period.calendar.full_day, true);
});

test('implicit and explicit series share one entity lifecycle and one graph update', (context) => {
  const previousWindow = globalThis.window;
  globalThis.window = { clearTimeout() {} };
  context.after(() => { globalThis.window = previousWindow; });
  const tool = Object.create(SparklineGraphTool.prototype);
  const makeConfig = () => ({ period: { type: 'real_time' } });
  const first = { id: 'first', entity_index: 0, config: makeConfig(), rows: [], historyEntityId: undefined };
  const second = { id: 'second', entity_index: 1, config: makeConfig(), rows: [], historyEntityId: undefined };
  let graphUpdates = 0;

  Object.assign(tool, {
    config: { sparkline: { show: { day_night: false } } },
    sparklineSeries: Object.assign(Object.create(SparklineSeries.prototype), { items: [first, second] }),
    historyDurationReady: true,
    card: { dev: { fakeData: false } },
    binBoundaryTimer: undefined,
    calendarRangeTimer: undefined,
    tooltipVisible: false,
    updateGraphFromSeries() { graphUpdates += 1; },
    updateLegendTextTools() {},
    clearTooltip() {},
    scheduleBinBoundaryRefresh() {},
    scheduleCalendarRangeRefresh() {},
  });

  const entityConfigs = [{}, {}];
  const entities = [
    { entity_id: 'sensor.first', state: '10', last_changed: '2026-08-13T10:00:00.000Z' },
    { entity_id: 'sensor.second', state: '20', last_changed: '2026-08-13T10:00:00.000Z' },
  ];

  tool.setEntities(entityConfigs, entities);

  assert.equal(tool.entity, entities[0]);
  assert.deepEqual(first.rows, [{ state: 10 }]);
  assert.deepEqual(second.rows, [{ state: 20 }]);
  assert.equal(graphUpdates, 1);
});

test('one implicit item enters the cartesian series coordinator', () => {
  const config = {
    entity_index: 0,
    sparkline: { show: { chart_type: 'line' } },
  };
  const configurations = [
    config,
    { ...config, series: [{ id: 'temperature', entity_index: 0 }] },
  ];

  configurations.forEach((seriesConfig) => {
    const tool = Object.create(SparklineGraphTool.prototype);
    let coordinatorCalls = 0;
    Object.assign(tool, {
      config: seriesConfig,
      sparklineSeries: new SparklineSeries(seriesConfig),
      card: { dev: { fakeData: false } },
      updateCartesianSeriesGraphs() {
        coordinatorCalls += 1;
        this.graphReady = false;
      },
    });

    tool.updateGraphFromSeries();

    assert.equal(coordinatorCalls, 1);
  });
});

test('radial barcode exposes only its radial time-axis presentation', () => {
  const tool = Object.create(SparklineGraphTool.prototype);
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
    axisGraphs: {
      primary: {
        config: {
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
    resolveAxisFontSizePixels: () => 8,
    buildYAxisTicks: () => {
      throw new Error('radial barcode has no value axis');
    },
  });

  const margin = tool.calculateRadialAxisMargin(tool.axisGraphs);
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
