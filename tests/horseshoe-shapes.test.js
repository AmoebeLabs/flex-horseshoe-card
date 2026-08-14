import test from 'node:test';
import assert from 'node:assert/strict';
import Colors from '../src/colors.js';
import { GaugeGeometry, GaugeScale } from '../src/horseshoe-geometry.js';
import { buildColorStopGradientPathItems, buildLabelItems, buildScalePathItems, buildStatePathItems } from '../src/horseshoe-shapes.js';
import { normalizeRuntimeConfig } from '../src/horseshoe-state.js';
import buildTickPathItems from '../src/horseshoe-tickmarks.js';

/** Builds the minimum normal horseshoe config needed to inspect its resolved state color. */
const createRuntimeConfig = (horseshoeStyle) => ({
  show: {
    horseshoe_style: horseshoeStyle,
  },
  bar_mode: 'normal',
  horseshoe_state: {
    mode: 'value',
    width: 4,
    linecap: {
      start: 'butt',
      end: 'butt',
    },
  },
  colorstops: {
    colors: [
      { value: 0, color: '#000000' },
      { value: 100, color: '#ffffff' },
    ],
  },
});

const geometry = {
  startAngle: 0,
  radius: 40,
  valueToAngle: (value) => value,
  pointAt: (angle, radius) => ({
    x: Math.cos(angle * Math.PI / 180) * radius,
    y: Math.sin(angle * Math.PI / 180) * radius,
  }),
};

test('resolves discrete and interpolated horseshoe state colors independently', () => {
  const discrete = buildStatePathItems(createRuntimeConfig('colorstop'), geometry, 50);
  const interpolated = buildStatePathItems(createRuntimeConfig('colorstopinterpolated'), geometry, 50);

  assert.equal(discrete[0].arc.color, '#000000');
  assert.equal(interpolated[0].arc.color, Colors.calculateStrokeColor(50, createRuntimeConfig('colorstopinterpolated').colorstops, true));
  assert.notEqual(interpolated[0].arc.color, discrete[0].arc.color);
});


const absoluteColorStops = {
  scales: {},
  colors: [
    { value: -15, color: '#008000' },
    { value: -5, color: '#00ff00' },
    { value: 0, color: '#808080' },
    { value: 5, color: '#ff8000' },
    { value: 40, color: '#ff0000' },
  ],
};

const createAbsoluteRuntimeConfig = (options = {}) => ({
  show: {
    horseshoe_style: options.horseshoeStyle ?? 'colorstop',
    scale_style: options.scaleStyle ?? 'colorstopsegments',
    labels_at: options.labelsAt ?? 'ticks_major',
    tickmarks: true,
  },
  bar_mode: 'absolute',
  svg: {
    xpos: 50,
    ypos: 50,
    radius: 40,
    tickmarks_radius: 40,
  },
  arc_degrees: 180,
  start_angle: 0,
  rotate: 0,
  flip: 'none',
  horseshoe_scale: {
    min: options.min ?? 0,
    max: options.max ?? 15,
    type: options.type ?? 'linear',
    spline: options.spline,
    width: 4,
    color: '#444444',
    linecap: { start: 'butt', end: 'butt' },
  },
  horseshoe_state: {
    mode: 'value',
    width: 4,
    color: '#ffffff',
    linecap: { start: 'butt', end: 'butt' },
  },
  horseshoe_labels: {
    offset: 8,
    distance_min: 0,
  },
  horseshoe_tickmarks: {
    ticks_major: {
      ticksize: options.ticksize ?? 5,
      width: 2,
      thickness: 1,
      offset: 0,
      color_mode: 'colorstop',
      styles: {},
    },
  },
  colorstops: absoluteColorStops,
  colorstopsMinMax: absoluteColorStops,
});

const createAbsoluteGeometry = (runtimeConfig, value) => {
  const scale = new GaugeScale(runtimeConfig.horseshoe_scale);
  return new GaugeGeometry(runtimeConfig, scale, value);
};

test('absolute mode folds both signs onto one shared 0..max scale', () => {
  const config = createAbsoluteRuntimeConfig();
  const geometry = createAbsoluteGeometry(config, -5);

  assert.equal(geometry.valueToRatio(-5), 1 / 3);
  assert.equal(geometry.valueToRatio(5), 1 / 3);
  assert.equal(geometry.valueToRatio(-30), 1);
  assert.equal(geometry.valueToRatio(30), 1);
});

test('absolute mode gives asymmetric signed branches the complete horseshoe', () => {
  const config = createAbsoluteRuntimeConfig({ min: -10, max: 40 });
  const geometry = createAbsoluteGeometry(config, -5);

  assert.equal(geometry.valueToRatio(-5), 0.5);
  assert.ok(Math.abs(geometry.valueToRatio(5) - 0.125) < 1e-12);
  assert.equal(geometry.valueToRatio(-20), 1);
  assert.equal(geometry.valueToRatio(80), 1);
});

test('absolute mode keeps signed color selection while sharing state geometry', () => {
  const config = createAbsoluteRuntimeConfig();
  const geometry = createAbsoluteGeometry(config, -5);
  const negative = buildStatePathItems(config, geometry, -5);

  geometry.setActiveValue(5);
  const positive = buildStatePathItems(config, geometry, 5);

  assert.equal(negative[0].arc.endAngle, positive[0].arc.endAngle);
  assert.equal(negative[0].arc.color, '#00ff00');
  assert.equal(positive[0].arc.color, '#ff8000');
});

test('every continuous horseshoe style builds an absolute state branch', () => {
  const styles = [
    'fixed',
    'autominmax',
    'colorstop',
    'colorstopinterpolated',
    'colorstopsegments',
    'minmaxgradient',
    'lineargradient',
    'colorstopgradient',
  ];

  styles.forEach((horseshoeStyle) => {
    const config = createAbsoluteRuntimeConfig({ horseshoeStyle });
    const geometry = createAbsoluteGeometry(config, -5);
    const paths = buildStatePathItems(config, geometry, -5);

    assert.ok(paths.length > 0, horseshoeStyle);
    assert.ok(paths.some((item) => item.path), horseshoeStyle);

    if (horseshoeStyle === 'colorstopgradient') {
      assert.ok(buildColorStopGradientPathItems(config, geometry).length > 0);
    }
  });
});

test('absolute scale, ticks, and labels follow the active signed branch', () => {
  const config = createAbsoluteRuntimeConfig({ min: -10, max: 40, ticksize: 5 });
  const geometry = createAbsoluteGeometry(config, -5);
  const negativeScale = buildScalePathItems(config, geometry);
  const negativeTicks = buildTickPathItems(config, geometry);
  const negativeLabels = buildLabelItems(config, geometry);

  assert.deepEqual(negativeTicks.map((item) => item.value), [0, -5, -10]);
  assert.deepEqual(negativeLabels.map((item) => item.text), ['0', '5', '10']);
  assert.ok(negativeScale.some((item) => item.arc.color === '#008000' || item.arc.color === '#00ff00'));
  assert.ok(!negativeScale.some((item) => item.arc.color === '#ff0000'));

  assert.equal(geometry.setActiveValue(0), true);
  assert.equal(geometry.absoluteSign, 1);

  const positiveTicks = buildTickPathItems(config, geometry);
  const positiveLabels = buildLabelItems(config, geometry);

  assert.deepEqual(positiveTicks.map((item) => item.value), [0, 5, 10, 15, 20, 25, 30, 35, 40]);
  assert.deepEqual(positiveLabels.map((item) => item.text), ['0', '5', '10', '15', '20', '25', '30', '35', '40']);
});

test('absolute projection preserves spline branch mapping', () => {
  const config = createAbsoluteRuntimeConfig({
    min: -10,
    max: 40,
    type: 'spline',
    spline: {
      anchors: [
        { value: -5, position: 0.1 },
        { value: 0, position: 0.25 },
        { value: 20, position: 0.75 },
      ],
    },
  });
  const geometry = createAbsoluteGeometry(config, -5);

  assert.equal(geometry.valueToRatio(-10), 1);
  assert.equal(geometry.valueToRatio(0), 0);
  assert.ok(geometry.valueToRatio(-5) > 0 && geometry.valueToRatio(-5) < 1);
  assert.ok(geometry.valueToRatio(20) > 0 && geometry.valueToRatio(20) < 1);
});

test('absolute projection normalizes splineorg endpoint positions to the complete arc', () => {
  const config = createAbsoluteRuntimeConfig({
    min: -10,
    max: 40,
    type: 'splineorg',
    spline: {
      anchors: [
        { value: -10, position: 0.1 },
        { value: 0, position: 0.3 },
        { value: 40, position: 0.9 },
      ],
    },
  });
  const geometry = createAbsoluteGeometry(config, -10);

  assert.equal(geometry.valueToRatio(-10), 1);
  assert.equal(geometry.valueToRatio(0), 0);
  assert.equal(geometry.valueToRatio(40), 1);
});

test('absolute runtime config rejects displaced zero and scales without zero', () => {
  const config = {
    show: { horseshoe_style: 'fixed' },
    bar_mode: 'absolute',
    radius: 40,
    arc_degrees: 180,
    horseshoe_scale: { min: 1, max: 15, type: 'linear' },
    horseshoe_state: { mode: 'value' },
    colorstops: absoluteColorStops,
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

test('one-sided positive bidirectional scale aligns state, labels, and ticks on the positive half', () => {
  const config = {
    ...createAbsoluteRuntimeConfig({ min: 0, max: 40, ticksize: 10 }),
    bar_mode: 'bidirectional',
    zero_ratio: 0.5,
  };
  const geometry = createAbsoluteGeometry(config, 20);
  const state = buildStatePathItems(config, geometry, 20);
  const labels = buildLabelItems(config, geometry);
  const ticks = buildTickPathItems(config, geometry);

  assert.equal(geometry.valueToRatio(0), 0.5);
  assert.equal(geometry.valueToRatio(20), 0.75);
  assert.equal(geometry.valueToRatio(40), 1);
  assert.equal(state[0].arc.startAngle, 90);
  assert.equal(state[0].arc.endAngle, 135);
  assert.deepEqual(labels.map((item) => item.angle), [90, 112.5, 135, 157.5, 180]);
  assert.deepEqual(ticks.map((item) => (item.startAngle + item.endAngle) / 2), [90, 112.5, 135, 157.5, 180]);
});

test('switching a positive scale from normal to bidirectional moves labels and ticks', () => {
  const normalConfig = {
    ...createAbsoluteRuntimeConfig({ min: 0, max: 40, ticksize: 10 }),
    bar_mode: 'normal',
    zero_ratio: 0,
  };
  const bidirectionalConfig = {
    ...normalConfig,
    bar_mode: 'bidirectional',
    zero_ratio: 0.5,
  };
  const normalGeometry = createAbsoluteGeometry(normalConfig, 20);
  const bidirectionalGeometry = createAbsoluteGeometry(bidirectionalConfig, 20);

  assert.deepEqual(buildLabelItems(normalConfig, normalGeometry).map((item) => item.angle), [0, 45, 90, 135, 180]);
  assert.deepEqual(buildLabelItems(bidirectionalConfig, bidirectionalGeometry).map((item) => item.angle), [90, 112.5, 135, 157.5, 180]);
  assert.deepEqual(buildTickPathItems(normalConfig, normalGeometry).map((item) => (item.startAngle + item.endAngle) / 2), [0, 45, 90, 135, 180]);
  assert.deepEqual(buildTickPathItems(bidirectionalConfig, bidirectionalGeometry).map((item) => (item.startAngle + item.endAngle) / 2), [90, 112.5, 135, 157.5, 180]);
});

test('one-sided negative bidirectional scale occupies the negative half', () => {
  const config = {
    ...createAbsoluteRuntimeConfig({ min: -40, max: 0, ticksize: 10 }),
    bar_mode: 'bidirectional_symmetrical',
    zero_ratio: 0.5,
  };
  const geometry = createAbsoluteGeometry(config, -20);

  assert.equal(geometry.valueToRatio(-40), 0);
  assert.equal(geometry.valueToRatio(-20), 0.25);
  assert.equal(geometry.valueToRatio(0), 0.5);
});

test('bidirectional ticks and labels count outward from zero', () => {
  const config = {
    ...createAbsoluteRuntimeConfig({ min: -15, max: 35, ticksize: 10 }),
    bar_mode: 'bidirectional_symmetrical',
    zero_ratio: 0.5,
  };
  const geometry = createAbsoluteGeometry(config, 5);

  assert.deepEqual(buildTickPathItems(config, geometry).map((item) => item.value), [-10, 0, 10, 20, 30]);
  assert.deepEqual(buildLabelItems(config, geometry).map((item) => item.text), ['-10', '0', '10', '20', '30']);
});

test('bidirectional positive scales keep zero without creating negative labels', () => {
  const config = {
    ...createAbsoluteRuntimeConfig({ min: 5, max: 35, ticksize: 10 }),
    bar_mode: 'bidirectional',
    zero_ratio: 0.5,
  };
  const geometry = createAbsoluteGeometry(config, 15);

  assert.deepEqual(buildTickPathItems(config, geometry).map((item) => item.value), [0, 10, 20, 30]);
  assert.deepEqual(buildLabelItems(config, geometry).map((item) => item.text), ['0', '10', '20', '30']);
});

test('absolute colorstopgradient follows negative colors from zero toward the scale minimum', () => {
  const config = createAbsoluteRuntimeConfig({
    min: -10,
    max: 40,
    horseshoeStyle: 'colorstopgradient',
  });
  const geometry = createAbsoluteGeometry(config, -5);
  const paths = buildColorStopGradientPathItems(config, geometry);

  assert.equal(paths[0].arc.startValue, 0);
  assert.equal(paths[0].arc.gradient.startColor, '#808080');
  assert.ok(new Set(paths.flatMap((item) => [item.arc.gradient.startColor, item.arc.gradient.endColor])).size > 2);
  assert.equal(paths[paths.length - 1].arc.endValue, -10);
  assert.equal(paths[paths.length - 1].arc.gradient.endColor, '#008000');
});

