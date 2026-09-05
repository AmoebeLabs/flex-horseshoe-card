import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildArcPathDefinition,
  buildLinePathDefinition,
  buildPathDefinition,
  buildRectanglePathDefinition,
  buildWavePathDefinition,
} from '../src/path-generators.js';

test('arc generator builds partial clockwise and counter-clockwise centerlines', () => {
  const clockwise = buildArcPathDefinition({
    cx: 50,
    cy: 50,
    radiusX: 40,
    radiusY: 30,
    startAngle: 0,
    arcDegrees: 270,
  });
  const counterClockwise = buildArcPathDefinition({
    cx: 50,
    cy: 50,
    radiusX: 40,
    radiusY: 30,
    startAngle: 0,
    arcDegrees: -90,
  });

  assert.equal(clockwise.closed, false);
  assert.equal(clockwise.direction, 'forward');
  assert.match(clockwise.d, /^M 90 50 A 40 30 0 1 1 /);
  assert.match(counterClockwise.d, /^M 90 50 A 40 30 0 0 0 /);
  assert.notEqual(clockwise.signature, counterClockwise.signature);
});

test('arc generator splits a complete ring into two centerline arcs', () => {
  const definition = buildArcPathDefinition({
    cx: 50,
    cy: 50,
    radiusX: 40,
    radiusY: 40,
    startAngle: -90,
    arcDegrees: 360,
  });

  assert.equal(definition.closed, true);
  assert.equal((definition.d.match(/ A /g) ?? []).length, 2);
  assert.match(definition.d, / Z$/);
});

test('line generator preserves configured endpoints', () => {
  const definition = buildLinePathDefinition({
    x1: 10,
    y1: 20,
    x2: 90,
    y2: 80,
  });

  assert.deepEqual(definition, {
    d: 'M 10 20 L 90 80',
    closed: false,
    direction: 'forward',
    signature: JSON.stringify({
      d: 'M 10 20 L 90 80',
      closed: false,
      direction: 'forward',
    }),
  });
});

test('rectangle generator keeps one signature for equivalent geometry', () => {
  const config = {
    type: 'rectangle',
    x: 10,
    y: 20,
    width: 80,
    height: 60,
    radiusTopLeft: 5,
    radiusTopRight: 10,
    radiusBottomRight: 15,
    radiusBottomLeft: 20,
    start: 'top',
    direction: 'clockwise',
  };
  const direct = buildRectanglePathDefinition(config);
  const dispatched = buildPathDefinition(config);

  assert.equal(direct.closed, true);
  assert.equal(direct.d, 'M 50 20 L 80 20 Q 90 20 90 30 L 90 50 L 90 65 Q 90 80 75 80 L 50 80 L 30 80 Q 10 80 10 60 L 10 50 L 10 25 Q 10 20 15 20 L 50 20 Z');
  assert.equal(dispatched.signature, direct.signature);
});

test('rectangle generator changes origin and traversal without changing its bounds', () => {
  const definition = buildRectanglePathDefinition({
    x: 10,
    y: 20,
    width: 80,
    height: 60,
    radiusTopLeft: 0,
    radiusTopRight: 0,
    radiusBottomRight: 0,
    radiusBottomLeft: 0,
    start: 'right',
    direction: 'counter-clockwise',
  });

  assert.match(definition.d, /^M 90 50 L 90 20/);
  assert.match(definition.d, /L 90 50 Z$/);
});

test('wave generator preserves endpoints and emits two cubic halves per wave', () => {
  const definition = buildWavePathDefinition({
    x1: 10,
    y1: 50,
    x2: 130,
    y2: 50,
    waves: 3,
    amplitude: 12,
  });

  assert.equal(definition.closed, false);
  assert.match(definition.d, /^M 10 50 /);
  assert.equal((definition.d.match(/ C /g) ?? []).length, 6);
  assert.match(definition.d, /130 50$/);
});

test('wave generator applies amplitude perpendicular to a vertical baseline', () => {
  const definition = buildWavePathDefinition({
    x1: 50,
    y1: 10,
    x2: 50,
    y2: 90,
    waves: 1,
    amplitude: 9,
  });

  assert.match(definition.d, /^M 50 10 C 38 /);
  assert.match(definition.d, /50 90$/);
});
