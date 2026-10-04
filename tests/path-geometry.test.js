import assert from 'node:assert/strict';
import test from 'node:test';

import PathGeometry, { buildOffsetPathDefinition, TransformedPathGeometry } from '../src/path-geometry.js';

/**
 * Creates a measurable path stand-in and exposes its browser-call count.
 *
 * @param {number} totalLength - Actual SVG path length returned by the stand-in.
 * @returns {object} Path element stand-in and measurement counter.
 */
function createMeasuredPath(totalLength) {
  const measurement = { calls: 0, pointCalls: 0 };
  const pathElement = {
    getTotalLength() {
      measurement.calls += 1;
      return totalLength;
    },
    getPointAtLength(distance) {
      measurement.pointCalls += 1;
      return { x: distance, y: 20 };
    },
  };

  return { pathElement, measurement };
}

/**
 * Creates a straight horizontal SVG geometry stand-in for point contracts.
 *
 * @param {number} totalLength - Length and end coordinate of the path.
 * @returns {object} Path element stand-in.
 */
function createHorizontalPath(totalLength) {
  return {
    getTotalLength() {
      return totalLength;
    },
    getPointAtLength(distance) {
      return { x: distance, y: 20 };
    },
  };
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
  assert.equal(geometry.pathElement, pathElement);
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
  const gradientConfig = {
    mode: 'full',
    range: { start: 0, end: 100 },
    maxSegmentLength: 25,
    minSegmentLength: 1,
    maxTangentAngle: 12,
    maxSegments: 96,
    overlap: 2,
  };

  geometry.setPathDefinition(firstDefinition);
  geometry.bindPathElement(firstPath.pathElement);
  const firstGradientGeometry = geometry.getGradientGeometry(gradientConfig);

  assert.equal(geometry.setPathDefinition(secondDefinition), true);
  assert.equal(geometry.isReady(), false);
  assert.equal(geometry.bindPathElement(secondPath.pathElement), true);
  const secondGradientGeometry = geometry.getGradientGeometry(gradientConfig);

  assert.equal(geometry.isReady(), true);
  assert.equal(geometry.getTotalLength(), 200);
  assert.notStrictEqual(secondGradientGeometry, firstGradientGeometry);
  assert.deepEqual(
    [firstGradientGeometry.ranges[0].coordinates.x2, secondGradientGeometry.ranges[0].coordinates.x2],
    [100, 200],
  );
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
  geometry.pointAtProgress(25);
  geometry.tangentAtProgress(25);
  geometry.setPathDefinition(secondDefinition);
  geometry.bindPathElement(secondPath.pathElement);
  geometry.setPathDefinition(firstDefinition);

  assert.equal(geometry.isReady(), false);
  assert.equal(geometry.bindPathElement(reboundFirstPath.pathElement), true);
  assert.equal(geometry.isReady(), true);
  assert.equal(geometry.getTotalLength(), 100);
  geometry.pointAtProgress(25);
  geometry.tangentAtProgress(25);
  assert.equal(firstPath.measurement.calls, 1);
  assert.equal(secondPath.measurement.calls, 1);
  assert.equal(reboundFirstPath.measurement.calls, 0);
  assert.equal(reboundFirstPath.measurement.pointCalls, 0);
  assert.equal(requestedRenders, 3);
});

test('moving raw and transformed samples stay bounded and reuse an identical pass', () => {
  const measurement = { pointCalls: 0 };
  const geometry = new PathGeometry(() => {});
  geometry.setPathDefinition({ signature: 'moving-samples', closed: false });
  geometry.bindPathElement({
    getTotalLength: () => 200,
    getPointAtLength: (distance) => {
      measurement.pointCalls += 1;
      return { x: distance, y: 20 };
    },
  });
  const transformed = new TransformedPathGeometry(geometry, {
    a: 0,
    b: 1,
    c: -1,
    d: 0,
    e: 100,
    f: 0,
  });

  geometry.pointAtProgress(10);
  geometry.tangentAtProgress(10);
  const fixedSamples = {
    points: geometry.activeMeasurement.points.size,
    tangents: geometry.activeMeasurement.tangents.size,
  };

  for (let index = 0; index < 500; index += 1) {
    const progress = index / 5;
    const sampleKey = `marker:${progress}`;
    geometry.beginTemporarySampling(sampleKey);
    const point = transformed.pointAtProgress(progress);
    const tangent = transformed.tangentAtProgress(progress);
    const firstPassReads = measurement.pointCalls;

    // A second consumer in the same drawing pass shares the transformed sample.
    geometry.beginTemporarySampling(sampleKey);
    assert.deepEqual(transformed.pointAtProgress(progress), point);
    assert.deepEqual(transformed.tangentAtProgress(progress), tangent);
    assert.equal(measurement.pointCalls, firstPassReads);
    assert.ok(geometry.temporarySamples.points.size <= 1);
    assert.ok(geometry.temporarySamples.tangents.size <= 1);
    geometry.endTemporarySampling();
  }

  assert.equal(geometry.temporarySamples.points.size, 1);
  assert.equal(geometry.temporarySamples.tangents.size, 1);
  assert.deepEqual(
    { points: geometry.activeMeasurement.points.size, tangents: geometry.activeMeasurement.tangents.size },
    fixedSamples,
  );

  geometry.pointAtProgress(10);
  geometry.tangentAtProgress(10);
  assert.deepEqual(
    { points: geometry.activeMeasurement.points.size, tangents: geometry.activeMeasurement.tangents.size },
    fixedSamples,
  );
});

test('converts normalized progress to actual browser distance inside PathGeometry', () => {
  const geometry = new PathGeometry(() => {});
  const definition = {
    d: 'M 0 20 L 200 20',
    closed: false,
    direction: 'forward',
    signature: 'line-200',
  };

  geometry.setPathDefinition(definition);
  geometry.bindPathElement(createHorizontalPath(200));

  assert.deepEqual(geometry.pointAtProgress(0), { x: 0, y: 20 });
  assert.deepEqual(geometry.pointAtProgress(25), { x: 50, y: 20 });
  assert.deepEqual(geometry.pointAtProgress(50), { x: 100, y: 20 });
  assert.deepEqual(geometry.pointAtProgress(75), { x: 150, y: 20 });
  assert.deepEqual(geometry.pointAtProgress(100), { x: 200, y: 20 });
});

test('returns normalized tangent and opposing left/right normals', () => {
  const geometry = new PathGeometry(() => {});
  const definition = {
    d: 'M 0 20 L 200 20',
    closed: false,
    direction: 'forward',
    signature: 'line-200',
  };

  geometry.setPathDefinition(definition);
  geometry.bindPathElement(createHorizontalPath(200));

  assert.deepEqual(geometry.tangentAtProgress(0), { x: 1, y: 0 });
  assert.deepEqual(geometry.tangentAtProgress(50), { x: 1, y: 0 });
  assert.deepEqual(geometry.tangentAtProgress(100), { x: 1, y: 0 });
  assert.deepEqual(geometry.normalAtProgress(50, 'left'), { x: 0, y: -1 });
  assert.deepEqual(geometry.normalAtProgress(50, 'right'), { x: -0, y: 1 });
});

test('transformed geometry publishes final points and directions without transforming feature elements', () => {
  const geometry = new PathGeometry(() => {});
  const definition = {
    d: 'M 0 20 L 200 20',
    closed: false,
    direction: 'forward',
    signature: 'line-200',
  };

  geometry.setPathDefinition(definition);
  geometry.bindPathElement(createHorizontalPath(200));

  const transformed = new TransformedPathGeometry(geometry, {
    a: 0,
    b: 1,
    c: -1,
    d: 0,
    e: 120,
    f: 0,
  });

  assert.deepEqual(transformed.pointAtProgress(25), { x: 100, y: 50 });
  assert.deepEqual(transformed.tangentAtProgress(50), { x: 0, y: 1 });
  const rotatedNormal = transformed.normalAtProgress(50, 'left');
  assert.ok(Math.abs(rotatedNormal.x - 1) < 1e-10);
  assert.ok(Math.abs(rotatedNormal.y) < 1e-10);
  assert.ok(Math.abs(transformed.getTotalLength() - 200) < 0.000001);
});

test('offset paths sample the same measured geometry and preserve topology', () => {
  const geometry = new PathGeometry(() => {});
  const definition = {
    d: 'M 0 20 L 200 20',
    closed: false,
    direction: 'forward',
    signature: 'line-offset',
  };

  geometry.setPathDefinition(definition);
  geometry.bindPathElement(createHorizontalPath(200));

  const offset = buildOffsetPathDefinition(geometry, 10, 'left', 4);

  assert.equal(offset.d, 'M 0 10 L 50 10 L 100 10 L 150 10 L 200 10');
  assert.equal(offset.closed, false);
  assert.equal(offset.direction, 'forward');
});

test('reflected feature normals preserve the transformed side of the source path', () => {
  const geometry = new PathGeometry(() => {});
  const definition = {
    d: 'M 0 20 L 200 20',
    closed: false,
    direction: 'forward',
    signature: 'line-reflected',
  };

  geometry.setPathDefinition(definition);
  geometry.bindPathElement(createHorizontalPath(200));

  const reflected = new TransformedPathGeometry(geometry, {
    a: -1,
    b: 0,
    c: 0,
    d: 1,
    e: 200,
    f: 0,
  });

  assert.deepEqual(reflected.tangentAtProgress(50), { x: -1, y: 0 });
  const reflectedNormal = reflected.normalAtProgress(50, 'left');
  assert.ok(Math.abs(reflectedNormal.x) < 1e-10);
  assert.ok(Math.abs(reflectedNormal.y + 1) < 1e-10);
});
