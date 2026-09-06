import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeBaseConfig, normalizeRuntimeConfig } from '../src/horseshoe-state.js';

const groupManager = {
  getGroupForItem: () => undefined,
};

test('minimal horseshoe configuration normalizes an empty color-stop configuration', () => {
  const baseConfig = normalizeBaseConfig({
    entity_index: 0,
    xpos: 50,
    ypos: 50,
    radius: 40,
    horseshoe_scale: { min: 0, max: 40 },
  }, 0, groupManager, 'dark');
  const config = normalizeRuntimeConfig(baseConfig, 'dark');

  assert.deepEqual(config.colorstops, { scales: {}, colors: [] });
  assert.equal(config.horseshoe_scale.min, 0);
  assert.equal(config.horseshoe_scale.max, 40);
  assert.equal(config.horseshoe_labels.distance_min, 0);
});

test('absolute mode validates a scale containing an undisplaced zero', () => {
  const config = {
    show: { horseshoe_style: 'fixed' },
    bar_mode: 'absolute',
    radius: 40,
    arc_degrees: 180,
    horseshoe_scale: { min: 1, max: 15, type: 'linear' },
    horseshoe_state: { mode: 'value' },
    colorstops: { scales: {}, colors: [] },
  };

  assert.throws(() => normalizeRuntimeConfig(config), /requires horseshoe_scale.min <= 0/);
  assert.throws(
    () => normalizeRuntimeConfig({
      ...config,
      horseshoe_scale: { min: 0, max: 15, type: 'linear' },
      zero_ratio: 0.25,
    }),
    /does not support zero_ratio/,
  );
  assert.equal(normalizeRuntimeConfig({
    ...config,
    horseshoe_scale: { min: -10, max: 40, type: 'linear' },
  }).bar_mode, 'absolute');
});

test('string-state segment gap follows color stops unless explicitly configured', () => {
  const config = {
    show: { horseshoe_style: 'colorstop' },
    arc_degrees: 0.3,
    horseshoe_scale: { min: 0, max: 4, type: 'linear' },
    horseshoe_state: { mode: 'stringstate_level' },
    colorstops: {
      gap: 0.01,
      scales: {},
      colors: [
        { state: 'low', color: '#838383' },
        { state: 'moderate', color: '#fcc449' },
        { state: 'high', color: '#ed8003' },
        { state: 'very_high', color: '#e73f10' },
      ],
    },
  };

  assert.equal(normalizeRuntimeConfig(config).horseshoe_state.segment_gap, 0.01);
  assert.equal(normalizeRuntimeConfig({
    ...config,
    horseshoe_state: { ...config.horseshoe_state, segment_gap: 0.02 },
  }).horseshoe_state.segment_gap, 0.02);
});
