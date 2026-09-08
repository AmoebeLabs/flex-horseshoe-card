import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildAdaptivePathGradient,
  renderAdaptivePathGradient,
  setFullPathGradientRevealRange,
} from '../src/path-gradient-renderer.js';

const straightGeometry = {
  getTotalLength: () => 200,
  pointAtProgress: (progress) => ({ x: progress * 2, y: 20 }),
};
const baseConfig = {
  mode: 'full',
  range: { start: 0, end: 60 },
  colorStops: [
    { progress: 0, color: '#000000' },
    { progress: 50, color: '#ff0000' },
    { progress: 100, color: '#ffffff' },
  ],
  width: 8,
  startCap: 'round',
  endCap: 'round',
  maxSegmentLength: 25,
  minSegmentLength: 1,
  maxTangentAngle: 12,
  maxSegments: 96,
  overlap: 0.5,
};

test('full gradient keeps one straight range with static color stops behind the active reveal range', () => {
  const first = buildAdaptivePathGradient(straightGeometry, baseConfig);
  const second = buildAdaptivePathGradient(straightGeometry, {
    ...baseConfig,
    range: { start: 0, end: 80 },
  });

  assert.equal(first.ranges.length, 1);
  assert.deepEqual(first.ranges, second.ranges);
  assert.notDeepEqual(first.revealRange, second.revealRange);
  assert.deepEqual(first.ranges.map((range) => range.opacity), [1]);
  assert.equal(first.ranges[0].startCap, 'round');
  assert.equal(first.ranges.at(-1).endCap, 'round');
  assert.deepEqual(first.ranges[0].gradient.stops, [
    { offset: 0, color: '#000000' },
    { offset: 50, color: '#ff0000' },
    { offset: 100, color: '#ffffff' },
  ]);
});

test('a diagonal straight path also keeps one gradient range', () => {
  const diagonalGeometry = {
    getTotalLength: () => Math.hypot(200, 80),
    pointAtProgress: (progress) => ({ x: progress * 2, y: progress * 0.8 }),
  };
  const gradient = buildAdaptivePathGradient(diagonalGeometry, baseConfig);

  assert.equal(gradient.ranges.length, 1);
});

test('full gradient reveal updates retain adaptive ranges and cap configuration', () => {
  const gradient = buildAdaptivePathGradient(straightGeometry, baseConfig);
  const ranges = gradient.ranges;
  const updated = setFullPathGradientRevealRange(gradient, { start: 15, end: 75 });

  assert.equal(updated, gradient);
  assert.equal(updated.ranges, ranges);
  assert.deepEqual(updated.revealRange, {
    id: 'gradient-reveal',
    start: 15,
    end: 75,
    startCap: 'round',
    endCap: 'round',
    dash: { array: [60, 100], offset: -15 },
  });
});

test('current gradient redistributes all configured colors over the active range', () => {
  const gradient = buildAdaptivePathGradient(straightGeometry, {
    ...baseConfig,
    mode: 'current',
    range: { start: 20, end: 60 },
  });

  assert.equal(gradient.ranges[0].start, 20);
  assert.equal(gradient.ranges.at(-1).end, 60);
  assert.deepEqual(gradient.ranges[0].gradient.stops, [
    { offset: 0, color: '#000000' },
    { offset: 50, color: '#ff0000' },
    { offset: 100, color: '#ffffff' },
  ]);
});

test('adaptive splitting responds to curvature and never exceeds the configured DOM budget', () => {
  const turningGeometry = {
    getTotalLength: () => 100,
    pointAtProgress: (progress) => {
      const angle = (progress / 100) * Math.PI;
      return { x: Math.cos(angle) * 50, y: Math.sin(angle) * 50 };
    },
  };
  const gradient = buildAdaptivePathGradient(turningGeometry, {
    ...baseConfig,
    colorStops: [
      { progress: 0, color: '#000000' },
      { progress: 100, color: '#ffffff' },
    ],
    maxSegmentLength: 1000,
    minSegmentLength: 0.001,
    maxTangentAngle: 8,
    maxSegments: 16,
  });

  assert.equal(gradient.ranges.length, 16);
  assert.equal(gradient.ranges.every((range) => range.end > range.start), true);
});

test('gradient joins overlap by a fixed SVG length', () => {
  const turningGeometry = {
    getTotalLength: () => 100,
    pointAtProgress: (progress) => {
      const angle = (progress / 100) * Math.PI;
      return { x: Math.cos(angle) * 50, y: Math.sin(angle) * 50 };
    },
  };
  const gradient = buildAdaptivePathGradient(turningGeometry, {
    ...baseConfig,
    colorStops: [
      { progress: 0, color: '#000000' },
      { progress: 100, color: '#ffffff' },
    ],
    maxSegmentLength: 25,
  });

  assert.ok(Math.abs(gradient.ranges[0].end - gradient.ranges[1].start - 0.5) < 1e-10);
});

test('renderer defines local gradients and reuses generic masked path bands', () => {
  const gradient = buildAdaptivePathGradient(straightGeometry, baseConfig);
  const layer = {
    opacity: 0.4,
    fillOpacity: 0.8,
    strokeOpacity: 0.7,
    border: { color: '#333333', width: 1 },
  };
  const pathDefinition = { d: 'M 0 20 L 200 20', signature: 'gradient-line' };
  const rendered = renderAdaptivePathGradient(pathDefinition, gradient, layer, 'gradient-test', 'path-gradient');
  const gradientDefinitions = rendered.values[1];
  const bands = rendered.values[3];

  assert.equal(gradientDefinitions.length, gradient.ranges.length);
  assert.equal(bands.values[1], layer.opacity);
  assert.equal(bands.values[5][0].values[4].values[5], '60 100');
  assert.equal(bands.values[5][0].values[4].values[6], 0);
});

test('normalized reveal clipping does not use a spatial mask at path crossings', () => {
  const gradient = buildAdaptivePathGradient(straightGeometry, {
    ...baseConfig,
    range: { start: 20, end: 60 },
  });
  const layer = {
    opacity: 1,
    fillOpacity: 1,
    strokeOpacity: 1,
    border: { color: '#333333', width: 0 },
  };
  const rendered = renderAdaptivePathGradient({ d: 'M 0 20 L 200 20' }, gradient, layer, 'crossing', 'path-gradient');
  const bands = rendered.values[3];
  const visibleFills = bands.values[5];

  assert.equal(rendered.strings.join('').includes('reveal-mask'), false);
  assert.equal(visibleFills[0].values[4].values[6], -20);
  assert.equal(visibleFills[0].values[4].values[5], '40 100');
});
