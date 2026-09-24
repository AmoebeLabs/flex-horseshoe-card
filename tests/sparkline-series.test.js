import test from 'node:test';
import assert from 'node:assert/strict';
import SparklineSeries from '../src/sparkline-series.js';

const graphConfig = {
  entity_index: 0,
  geometry: { line_width: 0, column_spacing: 4 },
  period: {
    type: 'real_time',
    group_by: 'interval',
  },
  sparkline: {
    show: { chart_type: 'line', chart_variant: 'line', item_style: 'auto', points: false, labels: { x: true, y: true } },
    state_values: {
      aggregate_func: 'avg',
      smoothing: false,
      logarithmic: false,
    },
    dots: { radius: 2, styles: { fill: 'var(--primary-color)', stroke: 'var(--primary-color)' } },
    radial: { arc_degrees: 360, rotate: 0, size: 50 },
    radial_barcode: { size: 5 },
    line: { show_dots: false, show: { item_style: 'auto', minmax: false }, minmax: { show: { item_style: 'auto' } } },
    area: { show_dots: false, show: { item_style: 'auto', minmax: false }, minmax: { show: { item_style: 'auto' } } },
  },
  x_axis: {
    labels: { max_length: 5, styles: { 'font-size': '10px' } },
    tickmarks_major: { size: 1 },
  },
  y_axis: {
    labels: { styles: { 'font-size': '10px' } },
    tickmarks_major: { size: 1 },
  },
};

test('normalizes existing sparkline config into one coordinator-owned default series', () => {
  const series = new SparklineSeries(graphConfig);

  assert.equal(series.items.length, 1);
  assert.equal(series.primaryItem.id, 'default');
  assert.deepEqual(series.primaryItem.config, graphConfig);
  assert.deepEqual(series.primaryItem.rows, []);
  assert.equal(series.primaryItem.graph, undefined);
  assert.equal(series.primaryItem.requestState, 'not_loaded');
  assert.equal(series.primaryItem.dataState, 'not_loaded');

  series.configureGraph(
    series.primaryItem,
    120,
    100,
    { t: 0, r: 0, b: 0, l: 0, x: 0, y: 0 },
    { t: 5, r: 5, b: 5, l: 5, x: 5, y: 5 },
    graphConfig,
    [],
    [],
    {},
  );
  series.setRows(series.primaryItem, [{ state: 12 }]);

  assert.deepEqual(series.primaryItem.config, graphConfig);
  assert.equal(series.primaryItem.graph.config, graphConfig);
  assert.deepEqual(series.primaryItem.rows, [{ state: 12 }]);
  assert.equal(series.updateGraphs()[0], 'has_data');

  series.clearGraphs();

  assert.equal(series.primaryItem.graph, undefined);
});

test('runtime graph configuration keeps the same graph and its processed values', () => {
  const series = new SparklineSeries(graphConfig);
  const item = series.primaryItem;
  const margin = { t: 0, r: 0, b: 0, l: 0 };
  series.configureGraph(item, 120, 100, margin, margin, graphConfig, [], [], {});
  const graph = item.graph;
  const rows = [{ state: 12 }];
  graph.processData(rows);
  const processedValues = graph.processedValues;

  series.configureGraph(item, 180, 100, margin, margin, structuredClone(graphConfig), [], [], {});
  assert.strictEqual(item.graph, graph);
  assert.strictEqual(item.graph.processedValues, processedValues);
  assert.equal(item.graph.width, 180);
});

test('auto density reuses processed data until resizing changes its effective bin plan', () => {
  const config = structuredClone(graphConfig);
  config.width = 120;
  config.height = 100;
  config.period = {
    type: 'rolling_window',
    group_by: 'interval',
    rolling_window: { offset: 0, duration: { hour: 24 }, bins: { per_hour: 'auto', density: 'medium' } },
  };
  const series = new SparklineSeries(config);
  const margin = { t: 0, r: 0, b: 0, l: 0 };
  const rows = [
    { state: 4, last_changed: '2026-08-20T00:00:00.000Z' },
    { state: 8, last_changed: '2026-08-20T10:00:00.000Z' },
  ];

  const useWidth = (width) => {
    config.width = width;
    series.updateConfig(config);
    const { perHour } = series.updateBinPlan();
    const effectiveConfig = structuredClone(series.primaryItem.config);
    effectiveConfig.period.rolling_window.bins.per_hour = perHour;
    series.configureGraph(series.primaryItem, width, 100, margin, margin, effectiveConfig, [], [], {});
    return perHour;
  };

  assert.equal(useWidth(120), 4);
  const graph = series.primaryItem.graph;
  graph._updateEndTime = () => { graph._endTime = new Date('2026-08-21T00:00:00.000Z'); };
  const aggregateBuckets = graph.aggregateBuckets.bind(graph);
  let aggregationCount = 0;
  graph.aggregateBuckets = (buckets) => {
    aggregationCount += 1;
    return aggregateBuckets(buckets);
  };
  graph.processData(rows);
  assert.equal(aggregationCount, 1);

  assert.equal(useWidth(130), 4);
  assert.strictEqual(series.primaryItem.graph, graph);
  graph.processData(rows);
  assert.equal(aggregationCount, 1);

  assert.equal(useWidth(300), 12);
  graph.processData(rows);
  assert.equal(aggregationCount, 2);
});


test('normalizes explicit series in declaration order with independent graph settings', () => {
  const series = new SparklineSeries({
    ...graphConfig,
    series: [
      { id: 'temperature', entity_index: 0, color: '#42a5f5' },
      {
        id: 'humidity',
        entity_index: 1,
        y_axis_id: 'secondary',
        sparkline: {
          show: { chart_type: 'dots' },
          state_values: { aggregate_func: 'max' },
        },
      },
    ],
  });

  assert.deepEqual(series.items.map((item) => item.id), ['temperature', 'humidity']);
  assert.deepEqual(series.items.map((item) => item.entity_index), [0, 1]);
  assert.equal(series.items[0].config.color, '#42a5f5');
  assert.equal(series.items[1].config.sparkline.show.chart_type, 'dots');
  assert.equal(series.items[1].config.sparkline.state_values.aggregate_func, 'max');
  assert.equal(series.items[0].y_axis_id, 'primary');
  assert.equal(series.items[1].y_axis_id, 'secondary');
  assert.equal(series.items[0].config.series, undefined);
  assert.equal(series.items[1].config.series, undefined);
});

test('series inherit parent minmax settings and can override them independently', () => {
  const series = new SparklineSeries({
    ...graphConfig,
    sparkline: {
      ...graphConfig.sparkline,
      line: { ...graphConfig.sparkline.line, show: { ...graphConfig.sparkline.line.show, minmax: true } },
      area: { ...graphConfig.sparkline.area, show: { ...graphConfig.sparkline.area.show, minmax: true } },
    },
    series: [
      { id: 'inherited-line', entity_index: 0 },
      { id: 'line-without-range', entity_index: 1, sparkline: { line: { show: { minmax: false } } } },
      { id: 'inherited-area', entity_index: 2, sparkline: { show: { chart_type: 'area' } } },
      { id: 'area-without-range', entity_index: 3, sparkline: { show: { chart_type: 'area' }, area: { show: { minmax: false } } } },
    ],
  });

  assert.equal(series.items[0].config.sparkline.line.show.minmax, true);
  assert.equal(series.items[1].config.sparkline.line.show.minmax, false);
  assert.equal(series.items[2].config.sparkline.area.show.minmax, true);
  assert.equal(series.items[3].config.sparkline.area.show.minmax, false);
});

test('series inherit the graph paint style and can override it independently', () => {
  const series = new SparklineSeries({
    ...graphConfig,
    sparkline: {
      ...graphConfig.sparkline,
      show: { ...graphConfig.sparkline.show, item_style: 'fixed' },
    },
    series: [
      { id: 'fixed', entity_index: 0 },
      { id: 'gradient', entity_index: 1, sparkline: { show: { item_style: 'colorstopgradient' } } },
    ],
  });

  assert.equal(series.items[0].config.sparkline.show.item_style, 'fixed');
  assert.equal(series.items[0].config.sparkline.line.show.item_style, 'auto');
  assert.equal(series.items[1].config.sparkline.show.item_style, 'colorstopgradient');
  assert.equal(series.items[1].config.sparkline.line.show.item_style, 'colorstopgradient');
  assert.equal(series.items[1].config.sparkline.line.minmax.show.item_style, 'colorstopgradient');
  assert.throws(
    () => new SparklineSeries({ ...graphConfig, sparkline: { ...graphConfig.sparkline, show: { ...graphConfig.sparkline.show, item_style: 'unknown' } } }),
    /sparkline\.show\.item_style must be/,
  );
});

test('series layer paint overrides remain independent from the series-wide choice', () => {
  const series = new SparklineSeries({
    ...graphConfig,
    series: [
      {
        id: 'temperature',
        entity_index: 0,
        sparkline: {
          show: { item_style: 'colorstopgradient' },
          line: {
            show: { item_style: 'fixed' },
            minmax: { show: { item_style: 'colorstopinterpolated' } },
          },
        },
      },
    ],
  });

  assert.equal(series.primaryItem.config.sparkline.show.item_style, 'colorstopgradient');
  assert.equal(series.primaryItem.config.sparkline.line.show.item_style, 'fixed');
  assert.equal(series.primaryItem.config.sparkline.line.minmax.show.item_style, 'colorstopinterpolated');
  assert.equal(series.primaryItem.config.sparkline.area.show.item_style, 'colorstopgradient');
  assert.equal(series.primaryItem.config.sparkline.area.minmax.show.item_style, 'colorstopgradient');
});

test('implicit and explicit one-series configs produce the same effective graph config', () => {
  const implicit = new SparklineSeries(graphConfig);
  const explicit = new SparklineSeries({
    ...graphConfig,
    series: [{ id: 'temperature', entity_index: 0 }],
  });

  assert.deepEqual(implicit.items[0].config, explicit.items[0].config);
  assert.equal(implicit.items[0].y_axis_id, 'primary');
  assert.equal(explicit.items[0].y_axis_id, 'primary');
  assert.equal(implicit.hasExplicitSeries, false);
  assert.equal(explicit.hasExplicitSeries, true);
});

test('stores one effective historical bin plan for implicit and explicit series', () => {
  const historicalConfig = {
    ...graphConfig,
    width: 90,
    height: 40,
    period: {
      type: 'rolling_window',
      group_by: 'interval',
      rolling_window: {
        offset: 0,
        duration: { hour: 24 },
        bins: { per_hour: 'auto', density: 'medium' },
      },
    },
  };
  const implicit = new SparklineSeries(historicalConfig);
  const explicit = new SparklineSeries({
    ...historicalConfig,
    series: [
      { id: 'line', entity_index: 0 },
      { id: 'dots', entity_index: 1, sparkline: { show: { chart_type: 'dots' } } },
    ],
  });

  const implicitBinPlan = implicit.updateBinPlan();
  const explicitBinPlan = explicit.updateBinPlan();

  assert.deepEqual(implicitBinPlan, { perHour: 3, durationHours: 1 / 3 });
  assert.deepEqual(explicitBinPlan, { perHour: 1, durationHours: 1 });
  assert.equal(explicit.binPlan, explicitBinPlan);
});

test('real-time and state-band series do not expose a derived bin duration', () => {
  const realTime = new SparklineSeries(graphConfig);
  const stateBands = new SparklineSeries({
    ...graphConfig,
    period: {
      type: 'rolling_window',
      group_by: 'interval',
      rolling_window: {
        offset: 0,
        duration: { hour: 24 },
        bins: { per_hour: 'auto', density: 'medium' },
      },
    },
    sparkline: {
      ...graphConfig.sparkline,
      show: { ...graphConfig.sparkline.show, chart_type: 'state_bands' },
    },
  });

  assert.deepEqual(realTime.updateBinPlan(), { perHour: undefined, durationHours: undefined });
  assert.deepEqual(stateBands.updateBinPlan(), { perHour: 1, durationHours: undefined });
});

test('shared Cartesian scale processes historical rows once per real series graph', () => {
  const config = {
    ...graphConfig,
    period: {
      type: 'rolling_window',
      group_by: 'interval',
      rolling_window: { offset: 0, duration: { hour: 4 }, bins: { per_hour: 1 } },
    },
    series: [
      { id: 'temperature', entity_index: 0 },
      { id: 'humidity', entity_index: 1 },
    ],
  };
  const series = new SparklineSeries(config);
  const values = [[4, 8], [10, 20]];
  const processingCounts = [];

  series.items.forEach((item, index) => {
    series.configureGraph(item, 120, 100, { t: 0, r: 0, b: 0, l: 0 }, { t: 5, r: 5, b: 5, l: 5 }, item.config, [], [], {});
    item.graph._updateEndTime = () => {
      item.graph._endTime = new Date('2026-08-20T12:00:00.000Z');
    };
    series.setRows(item, values[index].map((value, valueIndex) => ({
      state: String(value),
      haState: String(value),
      last_changed: `2026-08-20T0${valueIndex + 8}:30:00.000Z`,
    })));
    const processData = item.graph.processData.bind(item.graph);
    processingCounts[index] = 0;
    item.graph.processData = (rows) => {
      processingCounts[index] += 1;
      return processData(rows);
    };
  });

  const result = series.updateCartesianGraphs(
    () => ({ t: 0, r: 0, b: 0, l: 0 }),
    { t: 5, r: 5, b: 5, l: 5 },
    4,
    4,
  );

  assert.equal(result.dataState, 'has_data');
  assert.deepEqual(processingCounts, [1, 1]);
  assert.deepEqual(series.items.map((item) => item.graph.coords.map((point) => point[2])), [[4, 8, 8, 8], [10, 20, 20, 20]]);
  assert.equal(series.items[0].graph.min, series.items[1].graph.min);
  assert.equal(series.items[0].graph.max, series.items[1].graph.max);
});

test('Cartesian series reuse measured geometry for paint and remeasure changed layout', () => {
  const config = structuredClone(graphConfig);
  config.period = {
    type: 'rolling_window',
    group_by: 'interval',
    rolling_window: { offset: 0, duration: { hour: 4 }, bins: { per_hour: 1 } },
  };
  const series = new SparklineSeries(config);
  const margin = { t: 0, r: 0, b: 0, l: 0 };
  const rows = [
    { state: '4', last_changed: '2026-08-20T08:30:00.000Z' },
    { state: '8', last_changed: '2026-08-20T09:30:00.000Z' },
  ];
  const item = series.primaryItem;
  series.configureGraph(item, 120, 100, margin, margin, item.config, [], [], {});
  item.graph._updateEndTime = () => { item.graph._endTime = new Date('2026-08-20T12:00:00.000Z'); };
  series.setRows(item, rows);
  let measurements = 0;
  const measureAxisMargin = () => {
    measurements += 1;
    return margin;
  };

  assert.equal(series.updateCartesianGraphs(measureAxisMargin, margin, 4, 4).geometryChanged, true);
  const coords = item.graph.coords;
  const values = item.graph.processedValues;
  assert.equal(measurements, 1);

  const paintConfig = structuredClone(config);
  paintConfig.sparkline.line.styles = { opacity: 0.4 };
  series.updateConfig(paintConfig);
  series.configureGraph(item, 120, 100, margin, margin, item.config, [], [], {});
  assert.equal(series.updateCartesianGraphs(measureAxisMargin, margin, 4, 4).geometryChanged, false);
  assert.strictEqual(item.graph.coords, coords);
  assert.strictEqual(item.graph.processedValues, values);
  assert.equal(measurements, 1);

  const labelConfig = structuredClone(paintConfig);
  labelConfig.x_axis.labels.styles['font-size'] = '16px';
  series.updateConfig(labelConfig);
  series.configureGraph(item, 120, 100, margin, margin, item.config, [], [], {});
  assert.equal(series.updateCartesianGraphs(measureAxisMargin, margin, 4, 4).geometryChanged, true);
  assert.notStrictEqual(item.graph.coords, coords);
  assert.strictEqual(item.graph.processedValues, values);
  assert.equal(measurements, 2);

  assert.equal(series.updateCartesianGraphs(measureAxisMargin, margin, 4, 5).geometryChanged, true);
  assert.strictEqual(item.graph.processedValues, values);
  assert.equal(measurements, 3);
});

test('runtime config updates keep rows and graph state on the same series item', () => {
  const series = new SparklineSeries({
    ...graphConfig,
    series: [{ id: 'temperature', entity_index: 0, color: '#42a5f5' }],
  });
  const item = series.items[0];
  const graph = { coords: [[1, 2, 3]] };
  const history = [{ state: 12 }];
  item.graph = graph;
  item.rows = history;

  series.updateConfig({
    ...graphConfig,
    sparkline: {
      ...graphConfig.sparkline,
      line: { ...graphConfig.sparkline.line, line_width: 2 },
    },
    series: [{ id: 'temperature', entity_index: 0, color: '#f9a825' }],
  });

  assert.equal(series.items[0], item);
  assert.equal(series.items[0].graph, graph);
  assert.equal(series.items[0].rows, history);
  assert.equal(series.items[0].config.color, '#f9a825');
  assert.equal(series.items[0].config.sparkline.line.line_width, 2);
  assert.equal(series.items[0].requestState, 'not_loaded');
  assert.equal(series.items[0].dataState, 'not_loaded');
});

test('request state changes independently from retained processed data', () => {
  const series = new SparklineSeries(graphConfig);
  const item = series.primaryItem;

  item.dataState = 'has_data';
  series.setRequestState(item, 'loading');
  assert.equal(item.requestState, 'loading');
  assert.equal(item.dataState, 'has_data');

  series.setRequestState(item, 'error');
  assert.equal(item.requestState, 'error');
  assert.equal(item.dataState, 'has_data');
});

test('valid data and valid empty form one current multi-series result', () => {
  const processCalls = [];
  const series = new SparklineSeries({
    ...graphConfig,
    series: [
      { id: 'temperature', entity_index: 0 },
      { id: 'humidity', entity_index: 1 },
    ],
  });
  const graphFor = (state, min, max) => ({
    config: { geometry: { line_width: 1 } },
    min,
    max,
    coords: state === 'has_data' ? [[0, 0, min], [100, 0, max]] : [],
    axisArea: { x: 0, width: 100 },
    clearSharedYAxisBounds() {},
    processData() {
      processCalls.push(state);
      return state;
    },
    calculateGeometry() {},
    setSharedYAxisBounds(lowerBound, upperBound) {
      this.min = lowerBound;
      this.max = upperBound;
    },
    setGraphAreas() {},
    getBars() { return []; },
  });
  series.items[0].graph = graphFor('has_data', 10, 20);
  series.items[1].graph = graphFor('empty', undefined, undefined);

  const result = series.updateCartesianGraphs(
    () => ({ t: 0, r: 0, b: 0, l: 0 }),
    { t: 0, r: 0, b: 0, l: 0 },
    4,
    4,
  );

  assert.equal(result.dataState, 'has_data');
  assert.deepEqual(processCalls, ['has_data', 'empty']);
  assert.deepEqual(series.items.map((item) => item.dataState), ['has_data', 'empty']);
  assert.equal(result.axisGraphs.primary, series.items[0].graph);
});

test('multi-series coordination waits while one item is not loaded', () => {
  const series = new SparklineSeries({
    ...graphConfig,
    series: [
      { id: 'temperature', entity_index: 0 },
      { id: 'humidity', entity_index: 1 },
    ],
  });
  series.items[0].graph = {
    coords: [[0, 0, 10]],
    clearSharedYAxisBounds() {},
    processData() { return 'has_data'; },
    calculateGeometry() {},
  };
  series.items[1].graph = {
    coords: [],
    clearSharedYAxisBounds() {},
    processData() { return 'not_loaded'; },
  };

  const result = series.updateCartesianGraphs(() => {}, {}, 4, 4);

  assert.equal(result.dataState, 'not_loaded');
  assert.deepEqual(series.items.map((item) => item.dataState), ['has_data', 'not_loaded']);
});

test('rejects explicit series without stable unique entity-bound ids', () => {
  assert.throws(
    () => new SparklineSeries({
      ...graphConfig,
      series: [
        { id: 'temperature', entity_index: 0 },
        { id: 'temperature', entity_index: 1 },
      ],
    }),
    /series ids must be unique/,
  );

  assert.throws(
    () => new SparklineSeries({
      ...graphConfig,
      series: [{ id: 'temperature' }],
    }),
    /requires entity_index/,
  );

  assert.throws(
    () => new SparklineSeries({
      ...graphConfig,
      series: [{ id: 'temperature', entity_index: 0, y_axis_id: 'right' }],
    }),
    /y_axis_id must be primary or secondary/,
  );

  assert.throws(
    () => new SparklineSeries({
      ...graphConfig,
      series: [{ id: 'temperature', entity_index: 0, y_axis: 'secondary' }],
    }),
    /uses y_axis for axis configuration; assign the series with y_axis_id/,
  );
});

test('allows cartesian line, area, dots and bar series with an offset-only period override', () => {
  const bars = new SparklineSeries({
    ...graphConfig,
    period: {
      type: 'rolling_window',
      rolling_window: { offset: 0, duration: { hour: 24 }, bins: { per_hour: 1 } },
    },
    series: [
      { id: 'bars', entity_index: 0, sparkline: { show: { chart_type: 'bar' } } },
      {
        id: 'yesterday',
        entity_index: 1,
        period: {
          rolling_window: { offset: -1 },
          calendar: { offset: -1 },
        },
      },
    ],
  });

  assert.equal(bars.primaryItem.config.sparkline.show.chart_type, 'bar');
  assert.equal(bars.items[1].config.period.rolling_window.offset, -1);

  assert.throws(
    () => new SparklineSeries({
      ...graphConfig,
      series: [{ id: 'different-duration', entity_index: 0, period: { real_time: { duration: { hour: 12 } } } }],
    }),
    /period may only override real_time.offset/,
  );
});

test('accepts radial variants as one geometry family and rejects mixed geometry', () => {
  const radial = new SparklineSeries({
    ...graphConfig,
    sparkline: {
      ...graphConfig.sparkline,
      show: { ...graphConfig.sparkline.show, chart_type: 'radial', chart_variant: 'line' },
    },
    series: [
      { id: 'line', entity_index: 0 },
      { id: 'area', entity_index: 1, sparkline: { show: { chart_variant: 'area' } } },
      { id: 'dots', entity_index: 2, sparkline: { show: { chart_variant: 'dots' } } },
    ],
  });

  assert.deepEqual(radial.items.map((item) => item.config.sparkline.show.chart_variant), ['line', 'area', 'dots']);
  assert.throws(
    () => new SparklineSeries({
      ...graphConfig,
      sparkline: {
        ...graphConfig.sparkline,
        show: { ...graphConfig.sparkline.show, chart_type: 'radial', chart_variant: 'line' },
      },
      series: [
        { id: 'radial', entity_index: 0 },
        { id: 'line', entity_index: 1, sparkline: { show: { chart_type: 'line' } } },
      ],
    }),
    /radial series cannot be combined with cartesian series/,
  );
  assert.throws(
    () => new SparklineSeries({
      ...graphConfig,
      series: [{ id: 'radial', entity_index: 0, sparkline: { show: { chart_type: 'radial' } } }],
    }),
    /parent chart_type must be radial/,
  );
  assert.throws(
    () => new SparklineSeries({
      ...graphConfig,
      sparkline: {
        ...graphConfig.sparkline,
        show: { ...graphConfig.sparkline.show, chart_type: 'radial', chart_variant: 'line' },
      },
      series: [{
        id: 'different-arc',
        entity_index: 0,
        sparkline: { radial: { arc_degrees: 180 } },
      }],
    }),
    /uses the parent sparkline.radial geometry/,
  );
});

test('radial series share scale bounds and one measured outer margin', () => {
  const calls = [];
  const makeGraph = (min, max, lineWidth) => ({
    min,
    max,
    coords: [[0, 0, min], [1, 0, max]],
    config: {
      geometry: { line_width: lineWidth },
      y_axis: { lower_bound: undefined, upper_bound: undefined },
    },
    clearSharedYAxisBounds() {
      calls.push(['clear', min, max]);
    },
    setSharedYAxisBounds(lowerBound, upperBound) {
      this.min = lowerBound;
      this.max = upperBound;
      calls.push(['bounds', lowerBound, upperBound]);
    },
    setGraphAreas(axisMargin, configuredMargin, bucketCount, sharedChartGeometryMargin) {
      calls.push(['areas', axisMargin, configuredMargin, bucketCount, sharedChartGeometryMargin]);
    },
    processData() {
      calls.push(['data', this.min, this.max]);
      return 'has_data';
    },
    calculateGeometry() {
      calls.push(['geometry', this.min, this.max]);
    },
    buildAxisGeometry() {
      calls.push(['axis', this.min, this.max]);
    },
  });
  const series = new SparklineSeries({
    ...graphConfig,
    sparkline: {
      ...graphConfig.sparkline,
      show: { ...graphConfig.sparkline.show, chart_type: 'radial', chart_variant: 'line' },
    },
    series: [
      { id: 'inside', entity_index: 0 },
      {
        id: 'outside',
        entity_index: 1,
        sparkline: {
          show: { chart_variant: 'dots' },
          dots: { radius: 8 },
        },
      },
    ],
  });
  series.items[0].graph = makeGraph(10, 20, 2);
  series.items[1].graph = makeGraph(-5, 30, 4);
  const axisMargin = { t: 4, r: 4, b: 4, l: 4, x: 4, y: 4 };
  const configuredMargin = { t: 1, r: 2, b: 3, l: 4, x: 4, y: 1 };

  const result = series.updateRadialGraphs(() => axisMargin, configuredMargin);

  assert.equal(result.dataState, 'has_data');
  assert.equal(calls.filter((call) => call[0] === 'data').length, 2);
  assert.deepEqual(series.items.map((item) => [item.graph.min, item.graph.max]), [[-5, 30], [-5, 30]]);
  assert.equal(calls.filter((call) => call[0] === 'areas').length, 2);
  assert.deepEqual(calls.filter((call) => call[0] === 'areas').map((call) => call[4]), [
    { t: 17, r: 17, b: 17, l: 17 },
    { t: 17, r: 17, b: 17, l: 17 },
  ]);
  assert.deepEqual(result.axisMargin, axisMargin);
});

test('radial series retain shared geometry when only their color changes', () => {
  const config = structuredClone(graphConfig);
  config.period = {
    type: 'rolling_window',
    group_by: 'interval',
    rolling_window: { offset: 0, duration: { hour: 4 }, bins: { per_hour: 1 } },
  };
  config.sparkline.show.chart_type = 'radial';
  const series = new SparklineSeries(config);
  const item = series.primaryItem;
  const margin = { t: 0, r: 0, b: 0, l: 0 };
  const rows = [
    { state: '4', last_changed: '2026-08-20T08:30:00.000Z' },
    { state: '8', last_changed: '2026-08-20T09:30:00.000Z' },
  ];
  series.configureGraph(item, 120, 120, margin, margin, item.config, [], [], {});
  item.graph._updateEndTime = () => { item.graph._endTime = new Date('2026-08-20T12:00:00.000Z'); };
  series.setRows(item, rows);
  let measurements = 0;
  const measureAxisMargin = () => {
    measurements += 1;
    return margin;
  };

  assert.equal(series.updateRadialGraphs(measureAxisMargin, margin).geometryChanged, true);
  const coords = item.graph.coords;
  const values = item.graph.processedValues;

  const paintConfig = structuredClone(config);
  paintConfig.sparkline.line.styles = { opacity: 0.4, stroke: 'red' };
  series.updateConfig(paintConfig);
  series.configureGraph(item, 120, 120, margin, margin, item.config, [], [], {});
  assert.equal(series.updateRadialGraphs(measureAxisMargin, margin).geometryChanged, false);
  assert.strictEqual(item.graph.coords, coords);
  assert.strictEqual(item.graph.processedValues, values);
  assert.equal(measurements, 1);
});
