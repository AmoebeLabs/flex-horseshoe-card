import assert from 'node:assert/strict';
import test from 'node:test';

import { GaugeScale } from '../src/horseshoe-geometry.js';
import { PathValueMapper } from '../src/path-ranges.js';

/** Builds one mapper around the production scale implementation. */
const createMapper = ({
  min = 0,
  max = 100,
  type = 'linear',
  spline,
  barMode = 'normal',
  zeroRatio = 0,
  stateMode = 'value',
  stateMap,
  activeValue = 0,
} = {}) => new PathValueMapper({
  scale: new GaugeScale({ min, max, type, spline }),
  barMode,
  zeroRatio,
  stateMode,
  stateMap,
}, activeValue);

test('normal values become path-independent 0..100 ranges', () => {
  const mapper = createMapper();

  assert.equal(mapper.valueToProgress(63), 63);
  assert.deepEqual(mapper.buildSemanticRanges(63), [{
    id: 'state',
    start: 0,
    end: 63,
    active: true,
    sourceValue: 63,
    role: 'state',
  }]);
});

test('spline and splineorg scales map values before path progress is produced', () => {
  const spline = createMapper({
    type: 'spline',
    spline: {
      anchors: [
        { value: 25, position: 0.1 },
        { value: 50, position: 0.8 },
        { value: 75, position: 0.9 },
      ],
    },
  });
  const splineorg = createMapper({
    type: 'splineorg',
    spline: {
      anchors: [
        { value: 0, position: 0 },
        { value: 50, position: 0.8 },
        { value: 100, position: 1 },
      ],
    },
  });

  assert.ok(Math.abs(spline.valueToProgress(50) - 80) < 1e-12);
  assert.ok(Math.abs(splineorg.valueToProgress(50) - 80) < 1e-12);
  assert.ok(Math.abs(spline.buildSemanticRanges(50)[0].end - 80) < 1e-12);
});

test('absolute mode folds either active signed branch over the complete path', () => {
  const positiveScale = createMapper({ max: 40, barMode: 'absolute', activeValue: -10 });
  const signedScale = createMapper({ min: -10, max: 40, barMode: 'absolute', activeValue: -5 });

  assert.equal(positiveScale.valueToProgress(-20), 50);
  assert.deepEqual(positiveScale.getActiveSourceRange(), { start: 0, end: -40 });
  assert.equal(positiveScale.magnitudeToSourceValue(12), -12);
  assert.equal(positiveScale.getActiveMagnitudeMax(), 40);

  assert.ok(Math.abs(signedScale.valueToProgress(-5) - 50) < 1e-12);
  assert.ok(Math.abs(signedScale.valueToProgress(20) - 50) < 1e-12);
  assert.equal(signedScale.setActiveValue(20), true);
  assert.deepEqual(signedScale.getActiveSourceRange(), { start: 0, end: 40 });
  assert.equal(signedScale.magnitudeToSourceValue(12), 12);
});

test('absolute color stops retain only the active branch in visual order', () => {
  const mapper = createMapper({ min: -10, max: 40, barMode: 'absolute', activeValue: -5 });
  const stops = [
    { value: -10, color: 'green' },
    { value: -5, color: 'lime' },
    { value: 0, color: 'gray' },
    { value: 5, color: 'orange' },
  ];

  assert.deepEqual(mapper.getActiveColorStops(stops).map((stop) => stop.value), [0, -5, -10]);
});

test('bidirectional modes build a range between zero and the mapped value', () => {
  const positive = createMapper({ max: 40, barMode: 'bidirectional', zeroRatio: 0.5 });
  const signed = createMapper({ min: -20, max: 40, barMode: 'bidirectional_symmetrical', zeroRatio: 0.5 });
  const linear = createMapper({ min: -20, max: 40, barMode: 'bidirectional_linear', zeroRatio: 1 / 3 });

  assert.equal(positive.valueToProgress(20), 75);
  assert.deepEqual(positive.buildSemanticRanges(20)[0], {
    id: 'state',
    start: 50,
    end: 75,
    active: true,
    sourceValue: 20,
    role: 'state',
  });
  assert.equal(signed.valueToProgress(-10), 25);
  assert.deepEqual(signed.buildSemanticRanges(-10)[0], {
    id: 'state',
    start: 25,
    end: 50,
    active: true,
    sourceValue: -10,
    role: 'state',
  });
  assert.ok(Math.abs(linear.buildSemanticRanges(10)[0].start - (100 / 3)) < 1e-12);
  assert.equal(linear.buildSemanticRanges(10)[0].end, 50);
});

test('mapped states receive equal semantic slots and mode-specific activation', () => {
  const stateMap = [
    { state: 'low', value: 0 },
    { state: 'medium', value: 1 },
    { state: 'high', value: 2 },
  ];
  const current = createMapper({ stateMode: 'stringstate_mode', stateMap });
  const level = createMapper({ stateMode: 'stringstate_level', stateMap });

  assert.deepEqual(current.buildSemanticRanges(1).map(({ start, end, active, relation }) => ({ start, end, active, relation })), [
    { start: 0, end: 100 / 3, active: false, relation: 'before' },
    { start: 100 / 3, end: 200 / 3, active: true, relation: 'current' },
    { start: 200 / 3, end: 100, active: false, relation: 'after' },
  ]);
  assert.deepEqual(level.buildSemanticRanges(1).map((range) => range.active), [true, true, false]);
  assert.deepEqual(current.buildSemanticRanges(99).map((range) => range.relation), ['after', 'after', 'after']);
});

test('semantic ranges contain no path geometry or paint properties', () => {
  const range = createMapper().buildSemanticRanges(50)[0];

  ['angle', 'radius', 'path', 'd', 'color', 'fill', 'stroke', 'styles'].forEach((property) => {
    assert.equal(Object.hasOwn(range, property), false);
  });
});
