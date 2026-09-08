import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildArcPathDefinition,
  buildInfinityPathDefinition,
  buildLinePathDefinition,
  buildPathDefinition,
  buildPolygonPathDefinition,
  buildRectanglePathDefinition,
  buildSpiralPathDefinition,
  buildWavePathDefinition,
  calculatePolygonMaximumRadius,
  calculatePolygonPoints,
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

test('rectangle generator dispatches the same numeric side-position geometry', () => {
  const config = {
    type: 'rectangle',
    cx: 50,
    cy: 50,
    width: 80,
    height: 60,
    radiusTopLeft: 5,
    radiusTopRight: 10,
    radiusBottomRight: 15,
    radiusBottomLeft: 20,
    start: 0,
    end: 4,
    top: 0.5,
    direction: 'clockwise',
  };
  const direct = buildRectanglePathDefinition(config);
  const dispatched = buildPathDefinition(config);

  assert.equal(direct.closed, true);
  assert.equal((direct.d.match(/ A /g) ?? []).length, 8);
  assert.match(direct.d, / Z$/);
  assert.equal(dispatched.signature, direct.signature);
});

test('rectangle generator traverses a complete sharp path counterclockwise', () => {
  const definition = buildRectanglePathDefinition({
    cx: 50,
    cy: 50,
    width: 80,
    height: 60,
    radiusTopLeft: 0,
    radiusTopRight: 0,
    radiusBottomRight: 0,
    radiusBottomLeft: 0,
    start: 4,
    end: 0,
    top: 0.5,
    direction: 'counterclockwise',
  });

  assert.equal(definition.d, 'M 10 20 L 10 80 L 90 80 L 90 20 L 10 20 Z');
});

test('polygon points keep the natural odd and even top orientation', () => {
  const triangle = calculatePolygonPoints({ cx: 50, cy: 50, sides: 3, width: 80, height: 80, top: 0 });
  const hexagon = calculatePolygonPoints({ cx: 50, cy: 50, sides: 6, width: 80, height: 80, top: 0.5 });

  assert.ok(Math.abs(triangle[0].x - 50) < 1e-10);
  assert.equal(triangle[0].y, 10);
  assert.ok(Math.abs(hexagon[0].y - hexagon[1].y) < 1e-10);
  assert.ok(Math.abs((hexagon[0].x + hexagon[1].x) / 2 - 50) < 1e-10);
});

test('polygon width and height produce exact outer dimensions', () => {
  const points = calculatePolygonPoints({ cx: 50, cy: 50, sides: 5, width: 80, height: 60, top: 0 });
  const xValues = points.map((point) => point.x);
  const yValues = points.map((point) => point.y);

  assert.ok(Math.abs(Math.max(...xValues) - Math.min(...xValues) - 80) < 1e-10);
  assert.ok(Math.abs(Math.max(...yValues) - Math.min(...yValues) - 60) < 1e-10);
});

test('polygon generator selects decimal side positions in both directions', () => {
  const clockwise = buildPolygonPathDefinition({
    type: 'polygon', cx: 50, cy: 50, sides: 4, width: 80, height: 60, radius: 0,
    top: 0.5, start: 3.5, end: 1.5, direction: 'clockwise',
  });
  const counterClockwise = buildPolygonPathDefinition({
    type: 'polygon', cx: 50, cy: 50, sides: 4, width: 80, height: 60, radius: 0,
    top: 0.5, start: 1.5, end: 3.5, direction: 'counterclockwise',
  });

  assert.equal(clockwise.closed, false);
  assert.equal(counterClockwise.closed, false);
  assert.match(clockwise.d, /^M 10 50 L 10 /);
  assert.match(clockwise.d, / L 90 50$/);
  assert.match(counterClockwise.d, /^M 90 50 L 90 /);
  assert.match(counterClockwise.d, / L 10 50$/);
  assert.equal(buildPathDefinition({
    type: 'polygon', cx: 50, cy: 50, sides: 4, width: 80, height: 60, radius: 0,
    top: 0.5, start: 3.5, end: 1.5, direction: 'clockwise',
  }).signature, clockwise.signature);
});

test('polygon generator distinguishes zero length from an exact complete path', () => {
  const config = {
    type: 'polygon', cx: 50, cy: 50, sides: 6, width: 80, height: 80, radius: 0,
    top: 0.5, direction: 'clockwise',
  };
  const empty = buildPolygonPathDefinition({ ...config, start: 0, end: 0 });
  const complete = buildPolygonPathDefinition({ ...config, start: 0, end: 6 });
  const completeCounterClockwise = buildPolygonPathDefinition({
    ...config, start: 0, end: 6, direction: 'counterclockwise',
  });

  assert.equal(empty.closed, false);
  assert.doesNotMatch(empty.d, / L /);
  assert.equal(complete.closed, true);
  assert.match(complete.d, / Z$/);
  assert.equal((complete.d.match(/ L /g) ?? []).length, 6);
  assert.equal(completeCounterClockwise.closed, true);
  assert.equal((completeCounterClockwise.d.match(/ L /g) ?? []).length, 6);
  assert.notEqual(completeCounterClockwise.d, complete.d);
});

test('polygon radius rounds corners without changing its configured size contract', () => {
  const config = {
    type: 'polygon', cx: 50, cy: 50, sides: 4, width: 80, height: 60, radius: 5,
    top: 0.5, start: 0, end: 4, direction: 'clockwise',
  };
  const definition = buildPolygonPathDefinition(config);

  assert.equal(definition.closed, true);
  assert.equal((definition.d.match(/ A 5 5 /g) ?? []).length, 8);
  assert.equal((definition.d.match(/ L /g) ?? []).length, 4);
  assert.ok(Math.abs(calculatePolygonMaximumRadius(config) - 30) < 1e-10);
});

test('rounded polygon places the configured decimal side position exactly at the top', () => {
  const definition = buildPolygonPathDefinition({
    type: 'polygon', cx: 100, cy: 100, sides: 3, width: 140, height: 80, radius: 10,
    top: 0.25, start: 0.25, end: 0.25, direction: 'clockwise',
  });
  const [x, y] = definition.d.slice(2).split(' ').map(Number);

  assert.ok(Math.abs(x - 100) < 1e-10);
  assert.ok(y < 100);
});

test('side-positioned rectangle builds the same roof at every size', () => {
  const definition = buildRectanglePathDefinition({
    cx: 50, cy: 50, width: 80, height: 60,
    radiusTopLeft: 0, radiusTopRight: 0, radiusBottomRight: 0, radiusBottomLeft: 0,
    top: 0.5, start: 3.5, end: 1.5, direction: 'clockwise',
  });

  assert.equal(definition.closed, false);
  assert.equal(definition.d, 'M 10 50 L 10 20 L 90 20 L 90 50');
});

test('side-positioned rectangle assigns integer positions to rounded-corner midpoints', () => {
  const definition = buildRectanglePathDefinition({
    cx: 50, cy: 50, width: 80, height: 60,
    radiusTopLeft: 10, radiusTopRight: 10, radiusBottomRight: 10, radiusBottomLeft: 10,
    top: 0.5, start: 0, end: 4, direction: 'clockwise',
  });
  const [, startX, startY] = definition.d.match(/^M ([^ ]+) ([^ ]+)/);

  assert.ok(Math.abs(Number(startX) - (20 + 10 * Math.cos(225 * Math.PI / 180))) < 1e-10);
  assert.ok(Math.abs(Number(startY) - (30 + 10 * Math.sin(225 * Math.PI / 180))) < 1e-10);
  assert.equal(definition.closed, true);
  assert.equal((definition.d.match(/ A /g) ?? []).length, 8);
  assert.match(definition.d, / Z$/);
});

test('side-positioned rectangle keeps a complete path in either direction', () => {
  const config = {
    cx: 50, cy: 50, width: 80, height: 60,
    radiusTopLeft: 10, radiusTopRight: 10, radiusBottomRight: 10, radiusBottomLeft: 10,
    top: 0.5, start: 0, end: 4,
  };
  const clockwise = buildRectanglePathDefinition({ ...config, direction: 'clockwise' });
  const counterClockwise = buildRectanglePathDefinition({ ...config, direction: 'counterclockwise' });

  assert.equal(clockwise.closed, true);
  assert.equal(counterClockwise.closed, true);
  assert.equal((clockwise.d.match(/ A /g) ?? []).length, 8);
  assert.equal((counterClockwise.d.match(/ A /g) ?? []).length, 8);
  assert.notEqual(counterClockwise.d, clockwise.d);
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

test('spiral generator follows the configured radii and sweep as one smooth path', () => {
  const config = {
    type: 'spiral',
    cx: 50,
    cy: 50,
    radiusInner: 5,
    radiusOuter: 40,
    startAngle: -90,
    degrees: 720,
    points: 48,
  };
  const definition = buildSpiralPathDefinition(config);
  const dispatched = buildPathDefinition(config);

  assert.equal(definition.closed, false);
  assert.match(definition.d, /^M 50 45 C /);
  assert.equal((definition.d.match(/ C /g) ?? []).length, 48);
  const [, endX, endY] = definition.d.match(/ ([^ ]+) ([^ ]+)$/);
  assert.ok(Math.abs(Number(endX) - 50) < 1e-10);
  assert.equal(Number(endY), 10);
  assert.equal(dispatched.signature, definition.signature);
});

test('infinity generator closes one tangent-continuous self-intersecting path', () => {
  const config = {
    type: 'infinity',
    cx: 50,
    cy: 50,
    radiusX: 40,
    radiusY: 25,
  };
  const definition = buildInfinityPathDefinition(config);
  const dispatched = buildPathDefinition(config);

  assert.equal(definition.closed, true);
  assert.match(definition.d, /^M 50 50 C 70 25 90 25 90 50 /);
  assert.equal((definition.d.match(/ C /g) ?? []).length, 4);
  assert.match(definition.d, /C 10 75 30 75 50 50 Z$/);
  assert.equal(dispatched.signature, definition.signature);
});
