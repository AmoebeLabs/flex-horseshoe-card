import test from 'node:test';
import assert from 'node:assert/strict';
import SparklineSeries from '../src/sparkline-series.js';

const graphConfig = {
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
  assert.equal(series.defaultItem.config, graphConfig);
  assert.deepEqual(series.defaultItem.rows, []);
  assert.equal(series.defaultItem.graph, undefined);

  series.createGraph(
    120,
    100,
    { t: 0, r: 0, b: 0, l: 0, x: 0, y: 0 },
    { t: 5, r: 5, b: 5, l: 5, x: 5, y: 5 },
    graphConfig,
    [],
    [],
    {},
  );
  series.setRows([{ state: 12 }]);

  assert.equal(series.defaultItem.graph.config, graphConfig);
  assert.deepEqual(series.defaultItem.rows, [{ state: 12 }]);
  assert.equal(series.updateGraph(), true);

  series.clearGraph();

  assert.equal(series.defaultItem.graph, undefined);
});
