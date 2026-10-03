import assert from 'node:assert/strict';
import test from 'node:test';

import ColorStops from '../src/color-stops.js';
import { GaugeScale } from '../src/horseshoe-geometry.js';
import { buildLabelStopItems } from '../src/horseshoe-labels.js';
import { PathValueMapper } from '../src/path-ranges.js';

/** Builds a configured value mapper from runtime scale and state owners. */
function createLabelRuntime(config) {
  const scale = new GaugeScale({ ...config.horseshoe_scale, type: 'linear' });
  const stateMap = config.state_map;

  return {
    scale,
    stateMap,
    mappedState: undefined,
    valueMapper: new PathValueMapper({
      scale,
      barMode: config.bar_mode,
      zeroRatio: 0,
      stateMode: config.horseshoe_state.mode,
      stateMap: stateMap.map,
    }, 50),
  };
}

/** Keeps authored settings, runtime mapping, and active palette in their owners. */
function createLabelFixture(labelsAt) {
  const config = {
    show: { labels_at: labelsAt },
    bar_mode: 'normal',
    horseshoe_scale: { min: 0, max: 100 },
    horseshoe_state: { mode: 'value' },
    horseshoe_tickmarks: { ticks_major: { ticksize: 25 } },
    horseshoe_labels: {
      distance_min: 0,
      stringstate_mode: { state_map: { map: [] }, before: { styles: {} }, current: { styles: {} }, after: { styles: {} } },
      stringstate_level: { state_map: { map: [] }, before: { styles: {} }, current: { styles: {} }, after: { styles: {} } },
    },
    state_map: { map: [] },
    color_stops: {
      colors: [
        { value: 20, color: 'green' },
        { value: 60, color: 'orange', label: 'warning' },
      ],
    },
  };
  const runtime = createLabelRuntime(config);
  const paint = { colorStops: ColorStops.normalize(config.color_stops, 'light') };

  return { config, runtime, paint };
}

test('numeric label choices select min/max, zero, color stops, major ticks, or both', () => {
  const cases = [
    { labelsAt: 'minmax', expected: ['0', '100'] },
    { labelsAt: 'minmax0', expected: ['0', '100'] },
    { labelsAt: 'colorstop', expected: ['0', '20', 'warning', '100'] },
    { labelsAt: 'ticks_major', expected: ['0', '25', '50', '75', '100'] },
    { labelsAt: 'both', expected: ['0', '20', '25', '50', 'warning', '75', '100'] },
  ];

  cases.forEach(({ labelsAt, expected }) => {
    const { config, runtime, paint } = createLabelFixture(labelsAt);
    assert.deepEqual(
      buildLabelStopItems(config, runtime, paint).map((label) => label.text),
      expected,
    );
  });
});

test('distance_min removes labels that are too close in scale values', () => {
  const { config, runtime, paint } = createLabelFixture('ticks_major');
  config.horseshoe_labels.distance_min = 40;

  assert.deepEqual(
    buildLabelStopItems(config, runtime, paint).map((label) => label.text),
    ['0', '50', '100'],
  );
});

test('mapped-state labels use runtime semantics and configured text and relation styles', () => {
  const { config, paint } = createLabelFixture('stringstate');
  config.horseshoe_scale = { min: 0, max: 3 };
  config.horseshoe_state.mode = 'stringstate_mode';
  config.state_map = {
    map: [
      { state: 'low', value: 0 },
      { state: 'medium', value: 1 },
      { state: 'high', value: 2 },
    ],
  };
  config.horseshoe_labels.stringstate_mode = {
    state_map: {
      map: [{
        state: 'medium',
        label: 'Comfortable',
        styles: { opacity: '0.8' },
        before: { styles: {} },
        current: { styles: {} },
        after: { styles: {} },
      }],
    },
    before: { styles: { 'font-weight': 'normal' } },
    current: { styles: { 'font-weight': 'bold' } },
    after: { styles: { 'font-weight': 'normal' } },
  };
  const runtime = createLabelRuntime(config);
  runtime.mappedState = runtime.stateMap.map[1];

  assert.equal(Object.hasOwn(config, 'mapped_state'), false);
  assert.equal(Object.hasOwn(config, 'colorstops'), false);
  assert.equal(runtime.scale.min, 0);
  assert.equal(runtime.scale.max, 3);
  assert.equal(runtime.mappedState.state, 'medium');

  const labels = buildLabelStopItems(config, runtime, paint);

  assert.deepEqual(labels.map((label) => label.text), ['low', 'Comfortable', 'high']);
  assert.deepEqual(labels.map((label) => label.relation), ['before', 'current', 'after']);
  assert.deepEqual(labels[1].styles, { 'font-weight': 'bold', opacity: '0.8' });
});
