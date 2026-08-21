import test from 'node:test';
import assert from 'node:assert/strict';
import SparklineGraph, { V } from '../src/sparkline-graph.js';

const createGraphConfig = ({
  chartType = 'line',
  smoothing = false,
  showLineMinMax = false,
  showAreaMinMax = false,
  lowerBound,
  upperBound,
} = {}) => ({
  period: {
    type: 'rolling_window',
    groupBy: 'interval',
    rolling_window: {
      offset: 0,
      duration: { hour: 4 },
      bins: { per_hour: 1 },
    },
  },
  sparkline: {
    show: { chart_type: chartType },
    state_values: { aggregate_func: 'avg', smoothing, logarithmic: false },
    line: { show_minmax: showLineMinMax },
    area: { show_minmax: showAreaMinMax },
  },
  x_axis: { labels: { max_length: 5, styles: { 'font-size': '10px' } } },
  y_axis: {
    lower_bound: lowerBound,
    upper_bound: upperBound,
    labels: { styles: { 'font-size': '10px' } },
  },
});

/**
 * Creates the normalized single-series engine currently owned by
 * SparklineGraphTool. These tests lock that boundary before a series
 * coordinator starts creating multiple graph engines.
 */
const createGraph = (config = createGraphConfig()) => new SparklineGraph(
  120,
  100,
  { l: 10, t: 10, r: 10, b: 10 },
  config,
);

/** Keeps floating-point SVG geometry assertions exact and readable. */
const rounded = (value) => Number(value.toFixed(6));

test('reports whether update produced complete axis geometry', () => {
  const graph = Object.create(SparklineGraph.prototype);
  Object.assign(graph, {
    config: { sparkline: { show: { chart_type: 'state_bands' } } },
    stateMap: {
      map: [
        { state: 'off', value: 0, display_label: 'Off' },
        { state: 'on', value: 1, display_label: 'On' },
      ],
    },
    coords: [],
    bucketMeta: [],
    _history: undefined,
    buildAxisGeometry() {
      this.xAxis = { start: new Date(0), end: new Date(1) };
      this.yAxis = { rows: [] };
    },
  });

  assert.equal(graph.update(), false);
  graph.history = [];
  assert.equal(graph.update(), false);
  graph.history = [{ state: 1 }];
  assert.equal(graph.update(), true);
  assert.deepEqual(graph.xAxis, { start: new Date(0), end: new Date(1) });
});

test('rolling history becomes fixed buckets with carry-forward metadata', () => {
  const graph = createGraph();
  graph._updateEndTime = () => {
    graph._endTime = new Date('2026-08-20T12:00:00.000Z');
  };
  graph.buildAxisGeometry = () => {};

  graph.update([
    { state: '4', haState: '4', last_changed: '2026-08-20T08:30:00.000Z' },
    { state: '8', haState: '8', last_changed: '2026-08-20T09:15:00.000Z' },
    { state: '12', haState: '12', last_changed: '2026-08-20T09:45:00.000Z' },
    { state: '20', haState: '20', last_changed: '2026-08-20T11:30:00.000Z' },
  ]);

  assert.deepEqual(graph.coords.map((point) => [rounded(point[0]), point[V]]), [
    [10, 4],
    [43.333333, 10],
    [76.666667, 12],
    [110, 20],
  ]);
  assert.deepEqual(graph.bucketMeta.map((bucket) => ({
    start: bucket.start.toISOString(),
    value: bucket.value,
    min: bucket.min,
    avg: bucket.avg,
    max: bucket.max,
    count: bucket.count,
  })), [
    { start: '2026-08-20T08:00:00.000Z', value: 4, min: 4, avg: 4, max: 4, count: 1 },
    { start: '2026-08-20T09:00:00.000Z', value: 10, min: 8, avg: 10, max: 12, count: 2 },
    { start: '2026-08-20T10:00:00.000Z', value: 12, min: undefined, avg: undefined, max: undefined, count: 0 },
    { start: '2026-08-20T11:00:00.000Z', value: 20, min: 20, avg: 20, max: 20, count: 1 },
  ]);
  assert.equal(graph.min, 4);
  assert.equal(graph.max, 20);
});

test('single-bucket aggregate functions retain their meaning', () => {
  const graph = createGraph();
  const rows = [{ state: '8' }, { state: '2' }, { state: '11' }, { state: '5' }];

  assert.deepEqual({
    avg: graph.aggregateFuncMap.avg(rows),
    median: graph.aggregateFuncMap.median(rows),
    max: graph.aggregateFuncMap.max(rows),
    min: graph.aggregateFuncMap.min(rows),
    first: graph.aggregateFuncMap.first(rows),
    last: graph.aggregateFuncMap.last(rows),
    sum: graph.aggregateFuncMap.sum(rows),
    delta: graph.aggregateFuncMap.delta.call(graph, rows),
    diff: graph.aggregateFuncMap.diff.call(graph, rows),
  }, {
    avg: 6.5,
    median: 6.5,
    max: 11,
    min: 2,
    first: 8,
    last: 5,
    sum: 26,
    delta: 9,
    diff: -3,
  });
});

test('automatic y bounds expand while configured bounds stay exact', () => {
  const automaticGraph = createGraph();
  automaticGraph.min = 3;
  automaticGraph.max = 17;
  const automaticAxis = automaticGraph.calculateYAxisGeometry(10);

  assert.deepEqual({
    min: automaticAxis.min,
    max: automaticAxis.max,
    interval: automaticAxis.interval,
    minorInterval: automaticAxis.minorInterval,
    ticks: automaticAxis.ticks.map((tick) => ({ value: tick.value, y: rounded(tick.y) })),
  }, {
    min: 2.5,
    max: 17.5,
    interval: 5,
    minorInterval: 2.5,
    ticks: [
      { value: 5, y: 76.666667 },
      { value: 10, y: 50 },
      { value: 15, y: 23.333333 },
    ],
  });

  const fixedGraph = createGraph(createGraphConfig({ lowerBound: 0, upperBound: 20 }));
  fixedGraph.min = 3;
  fixedGraph.max = 17;

  assert.deepEqual(fixedGraph.calculateYAxisGeometry(10), {
    min: 0,
    max: 20,
    interval: 5,
    minorInterval: 2.5,
    ticks: [
      { value: 0, y: 90 },
      { value: 5, y: 70 },
      { value: 10, y: 50 },
      { value: 15, y: 30 },
      { value: 20, y: 10 },
    ],
  });
});

test('rolling x-axis uses bucket starts and draw-area positions', () => {
  const graph = createGraph();
  graph.bucketMeta = [
    { start: new Date('2026-08-20T08:00:00.000Z') },
    { start: new Date('2026-08-20T09:00:00.000Z') },
    { start: new Date('2026-08-20T10:00:00.000Z') },
    { start: new Date('2026-08-20T11:00:00.000Z') },
  ];

  const axis = graph.calculateXAxisGeometry(4.5);

  assert.equal(axis.start.toISOString(), '2026-08-20T08:00:00.000Z');
  assert.equal(axis.end.toISOString(), '2026-08-20T11:00:00.000Z');
  assert.equal(axis.interval, 3600000);
  assert.deepEqual(axis.ticks.map((tick) => ({
    time: tick.time.toISOString(),
    x: rounded(tick.x),
  })), [
    { time: '2026-08-20T08:00:00.000Z', x: 10 },
    { time: '2026-08-20T09:00:00.000Z', x: 43.333333 },
    { time: '2026-08-20T10:00:00.000Z', x: 76.666667 },
    { time: '2026-08-20T11:00:00.000Z', x: 110 },
  ]);
});

test('line points and paths preserve smoothing geometry', () => {
  const graph = createGraph();
  graph.min = 0;
  graph.max = 20;
  graph.coords = [[10, 0, 0], [60, 0, 10], [110, 0, 20]];

  assert.deepEqual(graph.getPoints(), [[60, 50, 10, 1], [110, 10, 20, 2]]);
  assert.equal(graph.getPath(), 'M10,90 10,90 Q 10,90 60,50 Q 60,50 110,10 Q 110,10 110,10');

  graph._smoothing = true;
  assert.deepEqual(graph.getPoints(), [[35, 70, 5, 1], [85, 30, 15, 2]]);
  assert.equal(graph.getPath(), 'M10,90 10,90 Q 10,90 35,70 Q 60,50 85,30 Q 110,10 110,10');
});

test('area closes against zero or the nearest visible boundary', () => {
  const graph = createGraph();
  graph.coords = [[10, 0, -10], [60, 0, 10], [110, 0, 20]];
  graph.min = -10;
  graph.max = 20;

  assert.equal(
    graph.getArea('M10,90 60,36.666666666666664 110,10'),
    'M10,90 60,36.666666666666664 110,10 L 110, 63.33333333333333 L 10, 63.33333333333333 z',
  );

  graph.min = 5;
  graph.max = 20;
  assert.equal(
    graph.getArea('M10,90 60,63.33333333333333 110,10'),
    'M10,90 60,63.33333333333333 110,10 L 110, 90 L 10, 90 z',
  );
});

test('line and area min/max envelopes retain bucket extrema', () => {
  for (const chartType of ['line', 'area']) {
    const graph = createGraph(createGraphConfig({
      chartType,
      showLineMinMax: chartType === 'line',
      showAreaMinMax: chartType === 'area',
    }));
    graph._updateEndTime = () => {
      graph._endTime = new Date('2026-08-20T12:00:00.000Z');
    };
    graph.buildAxisGeometry = () => {};

    graph.update([
      { state: '4', haState: '4', last_changed: '2026-08-20T08:30:00.000Z' },
      { state: '8', haState: '8', last_changed: '2026-08-20T09:15:00.000Z' },
      { state: '12', haState: '12', last_changed: '2026-08-20T09:45:00.000Z' },
      { state: '20', haState: '20', last_changed: '2026-08-20T11:30:00.000Z' },
    ]);

    assert.deepEqual(graph.coordsMin.map((point) => point[V]), [4, 8, 12, 20]);
    assert.deepEqual(graph.coordsMax.map((point) => point[V]), [4, 12, 12, 20]);
    assert.equal(graph.min, 4);
    assert.equal(graph.max, 20);
    assert.match(graph.getAreaMinMax(graph.getPathMin(), graph.getPathMax()), / z$/);
  }
});

test('bars share the zero baseline across negative and positive values', () => {
  const graph = createGraph();
  graph.coords = [[10, 0, -10], [60, 0, 0], [110, 0, 20]];
  graph.min = -10;
  graph.max = 20;
  const bars = graph.getBars(0, 1, 4);

  assert.deepEqual(bars.map((bar) => ({
    x: rounded(bar.x),
    y: rounded(bar.y),
    width: rounded(bar.width),
    height: rounded(bar.height),
    value: bar.value,
  })), [
    { x: -13, y: 63.333333, width: 46, height: 26.666667, value: -10 },
    { x: 37, y: 63.333333, width: 46, height: 0, value: 0 },
    { x: 87, y: 10, width: 46, height: 53.333333, value: 20 },
  ]);
  assert.equal(rounded(bars[0].y), rounded(bars[2].y + bars[2].height));

  graph.coords = [[10, 0, 5], [60, 0, 10], [110, 0, 15]];
  graph.min = 5;
  graph.max = 15;
  assert.deepEqual(graph.getBars(0, 1, 4).map((bar) => ({
    y: bar.y,
    height: bar.height,
  })), [
    { y: 90, height: 0 },
    { y: 50, height: 40 },
    { y: 10, height: 80 },
  ]);
});
