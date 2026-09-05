import assert from 'node:assert/strict';
import test from 'node:test';

import PathGeometry from '../src/path-geometry.js';

/**
 * Creates a measurable path stand-in and exposes its browser-call count.
 *
 * @param {number} totalLength - Actual SVG path length returned by the stand-in.
 * @returns {object} Path element stand-in and measurement counter.
 */
function createMeasuredPath(totalLength) {
  const measurement = { calls: 0 };
  const pathElement = {
    getTotalLength() {
      measurement.calls += 1;
      return totalLength;
    },
  };

  return { pathElement, measurement };
}

test('binds an active path before geometry-dependent output becomes ready', () => {
  let requestedRenders = 0;
  const geometry = new PathGeometry(() => {
    requestedRenders += 1;
  });
  const definition = {
    d: 'M 0 0 L 100 0',
    closed: false,
    direction: 'forward',
    signature: 'line-100',
  };
  const { pathElement, measurement } = createMeasuredPath(100);

  assert.equal(geometry.setPathDefinition(definition), true);
  assert.equal(geometry.isReady(), false);
  assert.equal(geometry.bindPathElement(pathElement), true);
  assert.equal(geometry.isReady(), true);
  assert.equal(geometry.getPathDefinition(), definition);
  assert.equal(geometry.getPathElement(), pathElement);
  assert.equal(geometry.getTotalLength(), 100);
  assert.equal(measurement.calls, 1);
  assert.equal(requestedRenders, 1);
});

test('reuses one binding and measurement for unchanged geometry', () => {
  let requestedRenders = 0;
  const geometry = new PathGeometry(() => {
    requestedRenders += 1;
  });
  const definition = {
    d: 'M 0 0 L 100 0',
    closed: false,
    direction: 'forward',
    signature: 'line-100',
  };
  const { pathElement, measurement } = createMeasuredPath(100);

  geometry.setPathDefinition(definition);
  geometry.bindPathElement(pathElement);

  assert.equal(geometry.setPathDefinition(definition), false);
  assert.equal(geometry.bindPathElement(pathElement), false);
  assert.equal(geometry.isReady(), true);
  assert.equal(geometry.getTotalLength(), 100);
  assert.equal(measurement.calls, 1);
  assert.equal(requestedRenders, 1);
});

test('invalidates a changed signature and measures its committed path', () => {
  let requestedRenders = 0;
  const geometry = new PathGeometry(() => {
    requestedRenders += 1;
  });
  const firstDefinition = {
    d: 'M 0 0 L 100 0',
    closed: false,
    direction: 'forward',
    signature: 'line-100',
  };
  const secondDefinition = {
    d: 'M 0 0 L 200 0',
    closed: false,
    direction: 'forward',
    signature: 'line-200',
  };
  const firstPath = createMeasuredPath(100);
  const secondPath = createMeasuredPath(200);

  geometry.setPathDefinition(firstDefinition);
  geometry.bindPathElement(firstPath.pathElement);

  assert.equal(geometry.setPathDefinition(secondDefinition), true);
  assert.equal(geometry.isReady(), false);
  assert.equal(geometry.bindPathElement(secondPath.pathElement), true);
  assert.equal(geometry.isReady(), true);
  assert.equal(geometry.getTotalLength(), 200);
  assert.equal(firstPath.measurement.calls, 1);
  assert.equal(secondPath.measurement.calls, 1);
  assert.equal(requestedRenders, 2);
});

test('reuses cached browser measurements when a prior signature becomes active again', () => {
  let requestedRenders = 0;
  const geometry = new PathGeometry(() => {
    requestedRenders += 1;
  });
  const firstDefinition = {
    d: 'M 0 0 L 100 0',
    closed: false,
    direction: 'forward',
    signature: 'line-100',
  };
  const secondDefinition = {
    d: 'M 0 0 L 200 0',
    closed: false,
    direction: 'forward',
    signature: 'line-200',
  };
  const firstPath = createMeasuredPath(100);
  const secondPath = createMeasuredPath(200);
  const reboundFirstPath = createMeasuredPath(100);

  geometry.setPathDefinition(firstDefinition);
  geometry.bindPathElement(firstPath.pathElement);
  geometry.setPathDefinition(secondDefinition);
  geometry.bindPathElement(secondPath.pathElement);
  geometry.setPathDefinition(firstDefinition);

  assert.equal(geometry.isReady(), false);
  assert.equal(geometry.bindPathElement(reboundFirstPath.pathElement), true);
  assert.equal(geometry.isReady(), true);
  assert.equal(geometry.getTotalLength(), 100);
  assert.equal(firstPath.measurement.calls, 1);
  assert.equal(secondPath.measurement.calls, 1);
  assert.equal(reboundFirstPath.measurement.calls, 0);
  assert.equal(requestedRenders, 3);
});
