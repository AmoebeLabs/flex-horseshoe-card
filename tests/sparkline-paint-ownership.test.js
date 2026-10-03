import assert from 'node:assert/strict';
import test from 'node:test';
import ColorStops from '../src/color-stops.js';
import Merge from '../src/merge.js';
import SparklineGraphTool from '../src/sparkline-graph-tool.js';
import SparklineSeries from '../src/sparkline-series.js';

test('series paint keeps public definitions and explicit legacy provenance on stable items', () => {
  const source = {
    sparkline: {
      color_stops: {
        scales: { default: { min: 0, max: 100 } },
        colors: [{ value: 0, color: '#000000' }, { value: 100, color: '#ffffff' }],
        modes: {
          light: [{ value: 0, color: '#1565c0' }, { value: 100, color: '#ef6c00' }],
          dark: [{ value: 0, color: '#90caf9' }, { value: 100, color: '#ffcc80' }],
        },
      },
    },
    series: [
      { id: 'inherited', entity_index: 0 },
      {
        id: 'public',
        entity_index: 1,
        sparkline: {
          color_stops: {
            scales: { local: { min: -10, max: 110 } },
            modes: {
              light: [{ value: 0, color: '#2e7d32' }, { value: 100, color: '#c62828' }],
              dark: [{ value: 0, color: '#a5d6a7' }, { value: 100, color: '#ef9a9a' }],
            },
          },
        },
      },
      {
        id: 'legacy',
        entity_index: 2,
        sparkline: {
          colorstops: {
            scales: { default: { min: -10, max: 110 } },
            colors: [{ value: 50, color: '#7b1fa2' }],
            gap: 3,
          },
        },
      },
    ],
  };
  const config = SparklineGraphTool.translateConfig(source);
  const authoredDefinitions = config.series.map((item) => ({
    color_stops: structuredClone(item.sparkline.color_stops),
    colorstops: structuredClone(item.sparkline.colorstops),
  }));
  const series = new SparklineSeries(config, source);
  const lightParentPaint = ColorStops.normalize(source.sparkline.color_stops, 'light');
  series.updatePalettePaint(lightParentPaint, 'light');

  assert.deepEqual(series.items[0].paint.colorStops, lightParentPaint);
  assert.equal(Object.hasOwn(series.items[0].paint, 'colorStopsOverride'), false);
  assert.deepEqual(
    series.items[1].paint.colorStops,
    ColorStops.normalize(config.series[1].sparkline.color_stops, 'light'),
  );
  assert.equal(Object.hasOwn(series.items[1].paint, 'colorStopsOverride'), false);
  assert.deepEqual(
    series.items[2].paint.colorStopsOverride,
    source.series[2].sparkline.colorstops,
  );
  assert.notStrictEqual(series.items[2].paint.colorStopsOverride, source.series[2].sparkline.colorstops);
  assert.deepEqual(
    series.items[2].paint.colorStops,
    Merge.mergeDeep(
      {},
      ColorStops.normalize(config.series[2].sparkline.color_stops, 'light'),
      source.series[2].sparkline.colorstops,
    ),
  );
  assert.deepEqual(config.series.map((item) => ({
    color_stops: item.sparkline.color_stops,
    colorstops: item.sparkline.colorstops,
  })), authoredDefinitions);

  const inheritedItem = series.items[0];
  const legacyItem = series.items[2];
  const graph = { processedValues: [10, 50, 90] };
  const rows = [{ state: 50 }];
  inheritedItem.graph = graph;
  legacyItem.graph = graph;
  legacyItem.rows = rows;
  const lightCalculationSignature = series.getPaletteCalculationSignature(lightParentPaint);
  const darkParentPaint = ColorStops.normalize(source.sparkline.color_stops, 'dark');

  series.updatePalettePaint(darkParentPaint, 'dark');

  assert.deepEqual(series.items[0].paint.colorStops.colors[0].color, '#90caf9');
  assert.deepEqual(series.getPaletteCalculationSignature(darkParentPaint), lightCalculationSignature);
  assert.strictEqual(series.items[0], inheritedItem);
  assert.strictEqual(series.items[2], legacyItem);
  assert.strictEqual(legacyItem.graph, graph);
  assert.strictEqual(legacyItem.rows, rows);

  const changedSource = structuredClone(source);
  changedSource.sparkline.color_stops.scales.default.max = 200;
  changedSource.series = [changedSource.series[2], changedSource.series[0], changedSource.series[1]];
  delete changedSource.series[0].sparkline.colorstops;
  const changedConfig = SparklineGraphTool.translateConfig(changedSource);
  const changedParentPaint = ColorStops.normalize(changedSource.sparkline.color_stops, 'dark');
  series.updateConfig(changedConfig, changedSource);
  series.updatePalettePaint(changedParentPaint, 'dark');

  assert.strictEqual(series.items[0], legacyItem);
  assert.strictEqual(series.items[1], inheritedItem);
  assert.strictEqual(legacyItem.config, changedConfig.series[0]);
  assert.strictEqual(legacyItem.graph, graph);
  assert.strictEqual(legacyItem.rows, rows);
  assert.equal(Object.hasOwn(legacyItem.paint, 'colorStopsOverride'), false);
  assert.deepEqual(
    legacyItem.paint.colorStops,
    ColorStops.normalize(changedConfig.series[0].sparkline.color_stops, 'dark'),
  );
  assert.notEqual(series.getPaletteCalculationSignature(changedParentPaint), lightCalculationSignature);
});

test('real-time bar scale defaults validate from authored public or legacy definitions before paint exists', () => {
  const validScale = { default: { min: 0, max: 100 } };
  const makeConfig = (sparklinePalette) => ({
    period: { type: 'real_time' },
    sparkline: {
      show: { chart_type: 'bar' },
      ...sparklinePalette,
    },
  });

  assert.doesNotThrow(() => SparklineGraphTool.translateConfig(makeConfig({
    color_stops: { scales: validScale },
  })));
  assert.doesNotThrow(() => SparklineGraphTool.translateConfig(makeConfig({
    colorstops: { scales: validScale },
  })));
  assert.throws(
    () => SparklineGraphTool.translateConfig(makeConfig({ color_stops: { scales: { default: { min: 0 } } } })),
    /requires color_stops\.scales\.default\.min and max/,
  );
  assert.throws(
    () => SparklineGraphTool.translateConfig(makeConfig({})),
    /requires color_stops\.scales\.default or y_axis\.lower_bound and y_axis\.upper_bound/,
  );
});
