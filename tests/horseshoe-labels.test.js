import assert from 'node:assert/strict';
import test from 'node:test';

import { GaugeScale } from '../src/horseshoe-geometry.js';
import { buildLabelStopItems } from '../src/horseshoe-labels.js';
import { PathValueMapper } from '../src/path-ranges.js';

function createLabelConfig(labelsAt) {
  return {
    show: { labels_at: labelsAt },
    bar_mode: 'normal',
    mapped_state: { state: 'medium', value: 1 },
    horseshoe_scale: { min: 0, max: 100 },
    horseshoe_state: { mode: 'value' },
    horseshoe_tickmarks: { ticks_major: { ticksize: 25 } },
    horseshoe_labels: {
      distance_min: 0,
      stringstate_mode: { state_map: { map: [] }, before: { styles: {} }, current: { styles: {} }, after: { styles: {} } },
      stringstate_level: { state_map: { map: [] }, before: { styles: {} }, current: { styles: {} }, after: { styles: {} } },
    },
    state_map: { map: [] },
    colorstops: {
      colors: [
        { value: 20, color: 'green' },
        { value: 60, color: 'orange', label: 'warning' },
      ],
    },
  };
}

function createMapper(config) {
  return new PathValueMapper({
    scale: new GaugeScale({ ...config.horseshoe_scale, type: 'linear' }),
    barMode: config.bar_mode,
    zeroRatio: 0,
    stateMode: config.horseshoe_state.mode,
    stateMap: config.state_map.map,
  }, 50);
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
    const config = createLabelConfig(labelsAt);
    assert.deepEqual(buildLabelStopItems(config, createMapper(config)).map((label) => label.text), expected);
  });
});

test('distance_min removes labels that are too close in scale values', () => {
  const config = createLabelConfig('ticks_major');
  config.horseshoe_labels.distance_min = 40;

  assert.deepEqual(buildLabelStopItems(config, createMapper(config)).map((label) => label.text), ['0', '50', '100']);
});

test('mapped-state labels retain configured text and relation styles', () => {
  const config = createLabelConfig('stringstate');
  config.horseshoe_scale = { min: 0, max: 3 };
  config.horseshoe_state.mode = 'stringstate_mode';
  config.state_map.map = [
    { state: 'low', value: 0, color: 'green' },
    { state: 'medium', value: 1, color: 'orange' },
    { state: 'high', value: 2, color: 'red' },
  ];
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

  const labels = buildLabelStopItems(config, createMapper(config));

  assert.deepEqual(labels.map((label) => label.text), ['low', 'Comfortable', 'high']);
  assert.deepEqual(labels.map((label) => label.relation), ['before', 'current', 'after']);
  assert.deepEqual(labels[1].styles, { 'font-weight': 'bold', opacity: '0.8' });
});
