import test from 'node:test';
import assert from 'node:assert/strict';
import SparklineSeries from '../src/sparkline-series.js';

const graphConfig = {
  entity_index: 0,
  geometry: { line_width: 0, column_spacing: 4 },
  period: {
    type: 'real_time',
    groupBy: 'interval',
  },
  sparkline: {
    show: { chart_type: 'line', points: false },
    state_values: {
      aggregate_func: 'avg',
      smoothing: false,
      logarithmic: false,
    },
    dots: { radius: 2 },
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
  assert.equal(series.defaultItem.id, 'default');
  assert.deepEqual(series.defaultItem.config, graphConfig);
  assert.deepEqual(series.defaultItem.rows, []);
  assert.equal(series.defaultItem.graph, undefined);

  series.createGraph(
    series.defaultItem,
    120,
    100,
    { t: 0, r: 0, b: 0, l: 0, x: 0, y: 0 },
    { t: 5, r: 5, b: 5, l: 5, x: 5, y: 5 },
    graphConfig,
    [],
    [],
    {},
  );
  series.setRows(series.defaultItem, [{ state: 12 }]);

  assert.deepEqual(series.defaultItem.config, graphConfig);
  assert.equal(series.defaultItem.graph.config, graphConfig);
  assert.deepEqual(series.defaultItem.rows, [{ state: 12 }]);
  assert.equal(series.updateGraphs()[0], true);

  series.clearGraphs();

  assert.equal(series.defaultItem.graph, undefined);
});


test('normalizes explicit series in declaration order with independent graph settings', () => {
  const series = new SparklineSeries({
    ...graphConfig,
    series: [
      { id: 'temperature', entity_index: 0, color: '#42a5f5' },
      {
        id: 'humidity',
        entity_index: 1,
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
  assert.equal(series.items[0].config.series, undefined);
  assert.equal(series.items[1].config.series, undefined);
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

  assert.equal(bars.defaultItem.config.sparkline.show.chart_type, 'bar');
  assert.equal(bars.items[1].config.period.rolling_window.offset, -1);

  assert.throws(
    () => new SparklineSeries({
      ...graphConfig,
      series: [{ id: 'different-duration', entity_index: 0, period: { real_time: { duration: { hour: 12 } } } }],
    }),
    /period may only override real_time.offset/,
  );
});
