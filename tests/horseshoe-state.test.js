import assert from 'node:assert/strict';
import test from 'node:test';

import ColorStops from '../src/color-stops.js';
import {
  buildGaugeColorStops,
  getGaugeStateData,
  normalizeBaseConfig,
  translateHorseshoeConfig,
} from '../src/horseshoe-state.js';

/** Applies source preparation followed by authored-config translation. */
function translateConfig(source, colorStopMode) {
  return translateHorseshoeConfig(normalizeBaseConfig(source), colorStopMode);
}

test('minimal authored configuration keeps active empty stops outside config', () => {
  const baseConfig = normalizeBaseConfig({
    entity_index: 0,
    xpos: 50,
    ypos: 50,
    radius: 40,
    horseshoe_scale: { min: 0, max: 40 },
  });
  const config = translateHorseshoeConfig(baseConfig, 'dark');
  const sourceStops = ColorStops.normalize(config.color_stops, 'dark');
  const runtime = {
    scale: config.horseshoe_scale,
    stateMap: config.state_map,
  };
  const palette = buildGaugeColorStops(config, runtime, sourceStops);

  assert.equal(baseConfig.show.horseshoe_style, 'fixed');
  assert.equal(Object.hasOwn(baseConfig, 'colorstops'), false);
  assert.equal(Object.hasOwn(baseConfig, 'group_config'), false);
  assert.equal(Object.hasOwn(config, 'colorstops'), false);
  assert.equal(Object.hasOwn(config, 'colorstopsMinMax'), false);
  assert.equal(Object.hasOwn(config, 'svg'), false);
  assert.deepEqual(palette.colorStops, { scales: {}, colors: [] });
  assert.deepEqual(palette.minMax, { scales: {}, colors: [] });
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
    aspectratio: 1,
    start_offset: 0,
    end_offset: 0,
    styles: {},
  });
});

test('path marker translation preserves its explicit source and signed placement', () => {
  const config = translateConfig({
    horseshoe_scale: { min: 0, max: 100 },
    horseshoe_state: { width: 8 },
    horseshoe_marker: {
      icon: 'mdi:dots-horizontal',
      size: 10,
      rotate: -90,
      offset: -4,
      styles: {
        fill: 'white',
        opacity: 0.8,
      },
    },
  }, 'dark');

  assert.deepEqual(config.horseshoe_marker, {
    attach_to: 'path',
    shape: undefined,
    icon: 'mdi:dots-horizontal',
    rotate: -90,
    offset: -4,
    size: 10,
    aspectratio: 1,
    start_offset: 0,
    end_offset: 0,
    styles: {
      fill: 'white',
      opacity: '0.8',
    },
  });
});

test('center marker translation requires an icon and preserves both signed offsets', () => {
  const config = translateConfig({
    horseshoe_scale: { min: 0, max: 100 },
    horseshoe_marker: {
      attach_to: 'center',
      icon: 'mdi:arrow-up-bold',
      rotate: 180,
      aspectratio: 8,
      start_offset: -2,
      end_offset: 3,
    },
  }, 'dark');

  assert.deepEqual(config.horseshoe_marker, {
    attach_to: 'center',
    shape: undefined,
    icon: 'mdi:arrow-up-bold',
    rotate: 180,
    offset: 0,
    size: undefined,
    aspectratio: 8,
    start_offset: -2,
    end_offset: 3,
    styles: {},
  });
});

test('marker translation rejects ambiguous, missing, and invalid values', () => {
  const config = {
    horseshoe_scale: { min: 0, max: 100, type: 'linear' },
  };

  assert.throws(
    () => translateConfig({ ...config, horseshoe_marker: { attach_to: 'center' } }, 'dark'),
    /center-attached horseshoe_marker requires icon/,
  );
  assert.throws(
    () => translateConfig({ ...config, horseshoe_marker: { icon: 'mdi:gauge', shape: 'circle' } }, 'dark'),
    /either icon or shape/,
  );
  assert.throws(
    () => translateConfig({ ...config, horseshoe_marker: { shape: 'square' } }, 'dark'),
    /shape 'square' is invalid/,
  );
  assert.throws(
    () => translateConfig({ ...config, horseshoe_marker: { size: 0 } }, 'dark'),
    /size must be greater than zero/,
  );
  assert.throws(
    () => translateConfig({ ...config, horseshoe_marker: { aspectratio: 0 } }, 'dark'),
    /aspectratio must be greater than zero/,
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
    color_stops: { colors: [] },
  };

  assert.throws(() => translateConfig(config, 'dark'), /requires horseshoe_scale.min <= 0/);
  assert.throws(
    () => translateConfig({
      ...config,
      horseshoe_scale: { min: 0, max: 15, type: 'linear' },
      zero_ratio: 0.25,
    }, 'dark'),
    /does not support zero_ratio/,
  );
  assert.equal(translateConfig({
    ...config,
    horseshoe_scale: { min: -10, max: 40, type: 'linear' },
  }, 'dark').bar_mode, 'absolute');
});

test('rank-state mapping keeps palette colors in paint and preserves authored map colors', () => {
  const config = translateConfig({
    horseshoe_scale: { min: 0, max: 20 },
    horseshoe_state: { mode: 'stringstate_mode' },
    state_map: {
      type: 'rank_state',
      map: [
        { state: 'low', rank: 0 },
        { state: 'medium', rank: 1, color: '#configured' },
        { state: 'high', rank: 2 },
      ],
    },
    color_stops: {
      colors: [
        { value: 0, rank: 0, color: '#1b5e20' },
        { value: 10, rank: 1, color: '#f9a825' },
        { value: 20, rank: 2, color: '#b71c1c' },
      ],
    },
  }, 'light');
  const sourceStops = ColorStops.normalize(config.color_stops, 'light');
  const runtime = getGaugeStateData(
    config,
    { state: '15', attributes: {} },
    { attribute: undefined },
    sourceStops,
  );
  const palette = buildGaugeColorStops(config, runtime, sourceStops);

  assert.equal(Object.hasOwn(config, 'colorstops'), false);
  assert.equal(Object.hasOwn(runtime, 'config'), false);
  assert.equal(runtime.value, 1.5);
  assert.equal(runtime.scale.min, 0);
  assert.equal(runtime.scale.max, 3);
  assert.equal(runtime.mappedState.state, 'medium');
  assert.equal(runtime.mappedState.color, '#configured');
  assert.equal(runtime.stateMap.map[0].color, undefined);
  assert.deepEqual(
    palette.colorStops.colors.map(({ value, color }) => [value, color]),
    [[0, '#1b5e20'], [1, '#configured'], [2, '#b71c1c']],
  );
  assert.deepEqual(
    palette.minMax.colors.map(({ value, color }) => [value, color]),
    [[0, '#1b5e20'], [3, '#b71c1c']],
  );
});

test('string-state segment gap follows authored color stops unless explicitly configured', () => {
  const config = {
    show: { horseshoe_style: 'colorstop' },
    arc_degrees: 0.3,
    horseshoe_scale: { min: 0, max: 4, type: 'linear' },
    horseshoe_state: { mode: 'stringstate_level' },
    color_stops: {
      gap: 0.01,
      colors: [
        { state: 'low', color: '#838383' },
        { state: 'moderate', color: '#fcc449' },
        { state: 'high', color: '#ed8003' },
        { state: 'very_high', color: '#e73f10' },
      ],
    },
  };

  assert.equal(translateConfig(config, 'dark').horseshoe_state.segment_gap, 0.01);
  assert.equal(translateConfig({
    ...config,
    horseshoe_state: { ...config.horseshoe_state, segment_gap: 0.02 },
  }, 'dark').horseshoe_state.segment_gap, 0.02);
});
