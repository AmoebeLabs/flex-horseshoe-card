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
    show: { chart_type: 'line', chart_variant: 'line', points: false, labels: { x: true, y: true } },
    state_values: {
      aggregate_func: 'avg',
      smoothing: false,
      logarithmic: false,
    },
    dots: { radius: 2 },
    radial: { arc_degrees: 360, rotate: 0, size: 50 },
    radial_barcode: { size: 5 },
    line: { show_dots: false, show_minmax: false },
    area: { show_dots: false, show_minmax: false },
  },
  x_axis: {
    labels: { max_length: 5, styles: { 'font-size': '10px' } },
  },
  y_axis: {
    labels: { styles: { 'font-size': '10px' } },
  },
};

test('normalizes existing sparkline config into one coordinator-owned default series', () => {
  const series = new SparklineSeries(graphConfig);

  assert.equal(series.items.length, 1);
  assert.equal(series.primaryItem.id, 'default');
  assert.deepEqual(series.primaryItem.config, graphConfig);
  assert.deepEqual(series.primaryItem.rows, []);
  assert.equal(series.primaryItem.graph, undefined);

  series.createGraph(
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
  assert.equal(series.updateGraphs()[0], true);

  series.clearGraphs();

  assert.equal(series.primaryItem.graph, undefined);
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
      line: { ...graphConfig.sparkline.line, show_minmax: true },
      area: { ...graphConfig.sparkline.area, show_minmax: true },
    },
    series: [
      { id: 'inherited-line', entity_index: 0 },
      { id: 'line-without-range', entity_index: 1, sparkline: { line: { show_minmax: false } } },
      { id: 'inherited-area', entity_index: 2, sparkline: { show: { chart_type: 'area' } } },
      { id: 'area-without-range', entity_index: 3, sparkline: { show: { chart_type: 'area' }, area: { show_minmax: false } } },
    ],
  });

  assert.equal(series.items[0].config.sparkline.line.show_minmax, true);
  assert.equal(series.items[1].config.sparkline.line.show_minmax, false);
  assert.equal(series.items[2].config.sparkline.area.show_minmax, true);
  assert.equal(series.items[3].config.sparkline.area.show_minmax, false);
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

test('runtime config updates keep history and graph state on the same series item', () => {
  const series = new SparklineSeries({
    ...graphConfig,
    series: [{ id: 'temperature', entity_index: 0, color: '#42a5f5' }],
  });
  const item = series.items[0];
  const graph = { coords: [[1, 2, 3]] };
  const history = [{ state: 12 }];
  item.graph = graph;
  item.historySeries = history;
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
  assert.equal(series.items[0].historySeries, history);
  assert.equal(series.items[0].rows, history);
  assert.equal(series.items[0].config.color, '#f9a825');
  assert.equal(series.items[0].config.sparkline.line.line_width, 2);
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
    update() {
      calls.push(['update', this.min, this.max]);
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

  assert.equal(result.ready, true);
  assert.deepEqual(series.items.map((item) => [item.graph.min, item.graph.max]), [[-5, 30], [-5, 30]]);
  assert.equal(calls.filter((call) => call[0] === 'areas').length, 2);
  assert.deepEqual(calls.filter((call) => call[0] === 'areas').map((call) => call[4]), [
    { t: 17, r: 17, b: 17, l: 17 },
    { t: 17, r: 17, b: 17, l: 17 },
  ]);
  assert.deepEqual(result.axisMargin, axisMargin);
});
