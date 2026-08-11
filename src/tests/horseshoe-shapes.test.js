import test from 'node:test';
import assert from 'node:assert/strict';
import Colors from '../colors.js';
import { buildStatePathItems } from '../horseshoe-shapes.js';

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
