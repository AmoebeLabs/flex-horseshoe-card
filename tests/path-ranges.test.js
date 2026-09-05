import assert from 'node:assert/strict';
import test from 'node:test';

import { GaugeScale } from '../src/horseshoe-geometry.js';
import { buildPaintedRanges, PathValueMapper } from '../src/path-ranges.js';

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
  assert.deepEqual(mapper.buildStateRanges(63), [{
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
  assert.ok(Math.abs(spline.buildStateRanges(50)[0].end - 80) < 1e-12);
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
  assert.deepEqual(positive.buildStateRanges(20)[0], {
    id: 'state',
    start: 50,
    end: 75,
    active: true,
    sourceValue: 20,
    role: 'state',
  });
  assert.equal(signed.valueToProgress(-10), 25);
  assert.deepEqual(signed.buildStateRanges(-10)[0], {
    id: 'state',
    start: 25,
    end: 50,
    active: true,
    sourceValue: -10,
    role: 'state',
  });
  assert.ok(Math.abs(linear.buildStateRanges(10)[0].start - (100 / 3)) < 1e-12);
  assert.equal(linear.buildStateRanges(10)[0].end, 50);
});

test('mapped states receive equal value slots and mode-specific activation', () => {
  const stateMap = [
    { state: 'low', value: 0 },
    { state: 'medium', value: 1 },
    { state: 'high', value: 2 },
  ];
  const current = createMapper({ stateMode: 'stringstate_mode', stateMap });
  const level = createMapper({ stateMode: 'stringstate_level', stateMap });

  assert.deepEqual(current.buildStateRanges(1).map(({ start, end, active, relation }) => ({ start, end, active, relation })), [
    { start: 0, end: 100 / 3, active: false, relation: 'before' },
    { start: 100 / 3, end: 200 / 3, active: true, relation: 'current' },
    { start: 200 / 3, end: 100, active: false, relation: 'after' },
  ]);
  assert.deepEqual(level.buildStateRanges(1).map((range) => range.active), [true, true, false]);
  assert.deepEqual(current.buildStateRanges(99).map((range) => range.relation), ['after', 'after', 'after']);
});

test('value ranges contain no path geometry or paint properties', () => {
  const range = createMapper().buildStateRanges(50)[0];

  ['angle', 'radius', 'path', 'd', 'color', 'fill', 'stroke', 'styles'].forEach((property) => {
    assert.equal(Object.hasOwn(range, property), false);
  });
});

test('continuous progress preserves true endpoints and produces one normalized dash', () => {
  const stateRanges = createMapper().buildStateRanges(63);
  const paintedRanges = buildPaintedRanges(stateRanges, {
    clip: { start: 0, end: 100 },
    gap: 4,
    endpointGap: { start: 0, end: 0 },
    linecap: { start: 'round', end: 'butt' },
    paints: [{ color: '#ff9800', width: 6, opacity: 0.8 }],
  });

  assert.deepEqual(paintedRanges, [{
    id: 'state',
    start: 0,
    end: 63,
    length: 63,
    active: true,
    sourceValue: 63,
    role: 'state',
    color: '#ff9800',
    width: 6,
    opacity: 0.8,
    startCap: 'round',
    endCap: 'butt',
    dash: {
      array: [63, 100],
      offset: 0,
    },
  }]);
});

test('segmented ranges split internal gaps and retain the complete outer endpoints', () => {
  const stateRanges = createMapper({
    stateMode: 'segment',
    stateMap: [
      { state: 'low', value: 0 },
      { state: 'medium', value: 1 },
      { state: 'high', value: 2 },
    ],
  }).buildStateRanges(1);
  const paintedRanges = buildPaintedRanges(stateRanges, {
    clip: { start: 0, end: 100 },
    gap: 4,
    endpointGap: { start: 0, end: 0 },
    linecap: { start: 'round', end: 'round' },
    paints: [
      { color: 'green', width: 5, opacity: 1 },
      { color: 'orange', width: 5, opacity: 1 },
      { color: 'red', width: 5, opacity: 1 },
    ],
  });

  assert.equal(paintedRanges[0].start, 0);
  assert.equal(paintedRanges[0].end, 100 / 3 - 2);
  assert.equal(paintedRanges[1].start, 100 / 3 + 2);
  assert.equal(paintedRanges[1].end, 200 / 3 - 2);
  assert.equal(paintedRanges[2].start, 200 / 3 + 2);
  assert.equal(paintedRanges[2].end, 100);
  assert.deepEqual(paintedRanges.map((range) => [range.startCap, range.endCap]), [
    ['round', 'butt'],
    ['butt', 'butt'],
    ['butt', 'round'],
  ]);
  assert.deepEqual(paintedRanges.map((range) => range.color), ['green', 'orange', 'red']);
});

test('explicit endpoint gaps shorten only the outside of the complete painted range', () => {
  const paintedRanges = buildPaintedRanges(createMapper().buildStateRanges(100), {
    clip: { start: 0, end: 100 },
    gap: 8,
    endpointGap: { start: 3, end: 5 },
    linecap: { start: 'butt', end: 'round' },
    paints: [{ color: 'blue', width: 4, opacity: 1 }],
  });

  assert.equal(paintedRanges[0].start, 3);
  assert.equal(paintedRanges[0].end, 95);
  assert.deepEqual(paintedRanges[0].dash, {
    array: [92, 100],
    offset: -3,
  });
});

test('clipping clamps ranges to 0..100 and removes ranges without visible length', () => {
  const config = {
    clip: { start: 0, end: 100 },
    gap: 4,
    endpointGap: { start: 0, end: 0 },
    linecap: { start: 'round', end: 'round' },
    paints: [
      { color: 'green', width: 4, opacity: 1 },
      { color: 'red', width: 4, opacity: 1 },
    ],
  };
  const clampedRanges = buildPaintedRanges([
    { id: 'visible', start: -10, end: 130, active: true, sourceValue: 50, role: 'state' },
  ], {
    ...config,
    paints: [config.paints[0]],
  });
  const collapsedRanges = buildPaintedRanges([
    { id: 'collapsed', start: 0, end: 1, active: true, sourceValue: 0, role: 'state' },
    { id: 'visible', start: 1, end: 100, active: true, sourceValue: 50, role: 'state' },
  ], config);

  assert.equal(clampedRanges[0].start, 0);
  assert.equal(clampedRanges[0].end, 100);
  assert.deepEqual(collapsedRanges.map((range) => range.id), ['visible']);
  assert.equal(collapsedRanges[0].startCap, 'round');
  assert.equal(collapsedRanges[0].endCap, 'round');
});

test('color-stop intervals clip to active progress before gap and cap placement', () => {
  const mapper = createMapper();
  const stopRanges = mapper.buildColorStopRanges([0, 25, 50, 75, 100]);
  const paintedRanges = buildPaintedRanges(stopRanges, {
    clip: { start: 0, end: 63 },
    gap: 4,
    endpointGap: { start: 0, end: 0 },
    linecap: { start: 'round', end: 'butt' },
    paints: [
      { color: 'green', width: 6, opacity: 1 },
      { color: 'yellow', width: 6, opacity: 1 },
      { color: 'orange', width: 6, opacity: 1 },
      { color: 'red', width: 6, opacity: 1 },
    ],
  });

  assert.deepEqual(paintedRanges.map((range) => ({
    start: range.start,
    end: range.end,
    color: range.color,
    startCap: range.startCap,
    endCap: range.endCap,
  })), [
    { start: 0, end: 23, color: 'green', startCap: 'round', endCap: 'butt' },
    { start: 27, end: 48, color: 'yellow', startCap: 'butt', endCap: 'butt' },
    { start: 52, end: 63, color: 'orange', startCap: 'butt', endCap: 'butt' },
  ]);
});

test('absolute color-stop intervals follow the active signed branch in path order', () => {
  const mapper = createMapper({ min: -10, max: 40, barMode: 'absolute', activeValue: -5 });

  assert.deepEqual(mapper.buildColorStopRanges([-10, -5, 0, 5, 40]), [
    {
      id: 'color-stop-0',
      start: 0,
      end: 50,
      active: true,
      sourceValue: 0,
      sourceEndValue: -5,
      role: 'color-stop',
    },
    {
      id: 'color-stop-1',
      start: 50,
      end: 100,
      active: true,
      sourceValue: -5,
      sourceEndValue: -10,
      role: 'color-stop',
    },
  ]);
});

test('bidirectional and string-state ranges use the same paint and dash contract', () => {
  const bidirectional = createMapper({ min: -20, max: 20, barMode: 'bidirectional', zeroRatio: 0.5 })
    .buildStateRanges(-10);
  const stringStates = createMapper({
    stateMode: 'stringstate_level',
    stateMap: [
      { state: 'low', value: 0 },
      { state: 'high', value: 1 },
    ],
  }).buildStateRanges(1);
  const bidirectionalPaint = buildPaintedRanges(bidirectional, {
    clip: { start: 0, end: 100 },
    gap: 2,
    endpointGap: { start: 0, end: 0 },
    linecap: { start: 'round', end: 'round' },
    paints: [{ color: 'blue', width: 4, opacity: 1 }],
  });
  const stringPaint = buildPaintedRanges(stringStates, {
    clip: { start: 0, end: 100 },
    gap: 2,
    endpointGap: { start: 0, end: 0 },
    linecap: { start: 'round', end: 'round' },
    paints: [
      { color: 'green', width: 4, opacity: 0.5 },
      { color: 'red', width: 4, opacity: 1 },
    ],
  });

  assert.deepEqual(bidirectionalPaint[0].dash, {
    array: [25, 100],
    offset: -25,
  });
  assert.deepEqual(stringPaint.map((range) => range.dash), [
    { array: [49, 100], offset: 0 },
    { array: [49, 100], offset: -51 },
  ]);
  assert.deepEqual(stringPaint.map((range) => range.active), [true, true]);
});

test('painted output is identical for arc, line, rectangle, and wave consumers', () => {
  const stateRanges = createMapper().buildStateRanges(42);
  const config = {
    clip: { start: 0, end: 100 },
    gap: 0,
    endpointGap: { start: 0, end: 0 },
    linecap: { start: 'butt', end: 'round' },
    paints: [{ color: 'purple', width: 3, opacity: 0.7 }],
  };
  const outputs = ['arc', 'line', 'rectangle', 'wave'].map(() => buildPaintedRanges(stateRanges, config));

  outputs.slice(1).forEach((output) => assert.deepEqual(output, outputs[0]));
  outputs[0].forEach((range) => {
    ['angle', 'radius', 'path', 'd', 'x', 'y'].forEach((property) => {
      assert.equal(Object.hasOwn(range, property), false);
    });
  });
});
