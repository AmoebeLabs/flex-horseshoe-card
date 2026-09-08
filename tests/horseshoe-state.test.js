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
  assert.equal(config.show.state_progress, true);
  assert.equal(config.show.state_marker, false);
  assert.deepEqual(config.horseshoe_marker, {
    attach_to: 'path',
    shape: 'circle',
    icon: undefined,
    rotate: 0,
    offset: 0,
    size: 12,
    start_offset: 0,
    end_offset: 0,
  });
});

test('path marker configuration uses an explicit source and preserves signed placement', () => {
  const baseConfig = normalizeBaseConfig({
    horseshoe_scale: { min: 0, max: 100 },
    horseshoe_state: { width: 8 },
    horseshoe_marker: {
      icon: 'mdi:dots-horizontal',
      size: 10,
      rotate: -90,
      offset: -4,
    },
  }, 0, groupManager, 'dark');
  const config = normalizeRuntimeConfig(baseConfig, 'dark');

  assert.deepEqual(config.horseshoe_marker, {
    attach_to: 'path',
    shape: undefined,
    icon: 'mdi:dots-horizontal',
    rotate: -90,
    offset: -4,
    size: 10,
    start_offset: 0,
    end_offset: 0,
  });
});

test('center marker configuration requires an icon and keeps both signed offsets', () => {
  const baseConfig = normalizeBaseConfig({
    horseshoe_scale: { min: 0, max: 100 },
    horseshoe_marker: {
      attach_to: 'center',
      icon: 'mdi:arrow-up-bold',
      rotate: 180,
      start_offset: -2,
      end_offset: 3,
    },
  }, 0, groupManager, 'dark');
  const config = normalizeRuntimeConfig(baseConfig, 'dark');

  assert.deepEqual(config.horseshoe_marker, {
    attach_to: 'center',
    shape: undefined,
    icon: 'mdi:arrow-up-bold',
    rotate: 180,
    offset: 0,
    size: undefined,
    start_offset: -2,
    end_offset: 3,
  });
});

test('marker configuration rejects ambiguous, missing, and invalid values', () => {
  const config = {
    horseshoe_scale: { min: 0, max: 100, type: 'linear' },
    colorstops: { scales: {}, colors: [] },
  };

  assert.throws(
    () => normalizeRuntimeConfig({ ...config, horseshoe_marker: { attach_to: 'center' } }),
    /center-attached horseshoe_marker requires icon/,
  );
  assert.throws(
    () => normalizeRuntimeConfig({ ...config, horseshoe_marker: { icon: 'mdi:gauge', shape: 'circle' } }),
    /either icon or shape/,
  );
  assert.throws(
    () => normalizeRuntimeConfig({ ...config, horseshoe_marker: { shape: 'square' } }),
    /shape 'square' is invalid/,
  );
  assert.throws(
    () => normalizeRuntimeConfig({ ...config, horseshoe_marker: { size: 0 } }),
    /size must be greater than zero/,
  );
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
