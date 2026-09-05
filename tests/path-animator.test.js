import assert from 'node:assert/strict';
import test from 'node:test';

import PathStateAnimator from '../src/path-animator.js';
import { buildAdaptivePathGradient, setFullPathGradientRevealRange } from '../src/path-gradient-renderer.js';

/** Creates a deterministic requestAnimationFrame queue for animator tests. */
function createFrameScheduler() {
  let nextFrame = 1;
  const callbacks = new Map();

  return {
    requestFrame: (callback) => {
      const frame = nextFrame;
      nextFrame += 1;
      callbacks.set(frame, callback);
      return frame;
    },
    cancelFrame: (frame) => callbacks.delete(frame),
    runNextFrame: (timestamp) => {
      const [frame, callback] = callbacks.entries().next().value;
      callbacks.delete(frame);
      callback(timestamp);
    },
    pendingFrames: () => callbacks.size,
  };
}

test('disabled path animation updates only its bound state layer immediately', () => {
  const scheduler = createFrameScheduler();
  const stateLayer = { id: 'state' };
  const staticLayer = { id: 'static' };
  const updates = [];
  const completed = [];
  const animator = new PathStateAnimator({
    animation: { enabled: false, duration: 100, easing: 'linear' },
    initialProgress: 20,
    requestFrame: scheduler.requestFrame,
    cancelFrame: scheduler.cancelFrame,
    updateStateLayer: (element, progress) => updates.push({ element, progress }),
    onComplete: (progress) => completed.push(progress),
  });

  animator.bindStateLayer(stateLayer);
  animator.animateTo(80);

  assert.deepEqual(updates, [
    { element: stateLayer, progress: 20 },
    { element: stateLayer, progress: 80 },
  ]);
  assert.deepEqual(completed, [80]);
  assert.equal(updates.some((update) => update.element === staticLayer), false);
  assert.equal(scheduler.pendingFrames(), 0);
  assert.equal(animator.animating, false);
});

test('an interrupted transition continues from its displayed path progress', () => {
  const scheduler = createFrameScheduler();
  const updates = [];
  const completed = [];
  const animator = new PathStateAnimator({
    animation: { enabled: true, duration: 100, easing: 'linear' },
    initialProgress: 20,
    requestFrame: scheduler.requestFrame,
    cancelFrame: scheduler.cancelFrame,
    updateStateLayer: (_element, progress) => updates.push(progress),
    onComplete: (progress) => completed.push(progress),
  });

  animator.bindStateLayer({ id: 'state' });
  animator.animateTo(80);
  scheduler.runNextFrame(1000);
  scheduler.runNextFrame(1050);
  animator.animateTo(100);
  scheduler.runNextFrame(1100);
  scheduler.runNextFrame(1150);
  scheduler.runNextFrame(1200);

  assert.deepEqual(updates, [20, 20, 50, 50, 75, 100]);
  assert.deepEqual(completed, [100]);
  assert.equal(animator.currentProgress, 100);
  assert.equal(animator.animating, false);
  assert.equal(scheduler.pendingFrames(), 0);
});

test('stopping a transition preserves the visible state and cancels pending work', () => {
  const scheduler = createFrameScheduler();
  const updates = [];
  const animator = new PathStateAnimator({
    animation: { enabled: true, duration: 100, easing: 'ease-out' },
    initialProgress: 10,
    requestFrame: scheduler.requestFrame,
    cancelFrame: scheduler.cancelFrame,
    updateStateLayer: (_element, progress) => updates.push(progress),
    onComplete: () => {},
  });

  animator.bindStateLayer({ id: 'state' });
  animator.animateTo(90);
  scheduler.runNextFrame(1000);
  scheduler.runNextFrame(1050);
  const visibleProgress = animator.currentProgress;
  animator.stopAnimation();

  assert.equal(visibleProgress, 80);
  assert.equal(animator.currentProgress, visibleProgress);
  assert.equal(animator.animating, false);
  assert.equal(scheduler.pendingFrames(), 0);
  assert.deepEqual(updates, [10, 10, 80]);
});

test('full-gradient animation retains adaptive geometry and changes only its reveal range', () => {
  const scheduler = createFrameScheduler();
  let lengthReads = 0;
  let pointReads = 0;
  const geometry = {
    getTotalLength: () => {
      lengthReads += 1;
      return 100;
    },
    pointAtProgress: (progress) => {
      pointReads += 1;
      return { x: progress, y: 20 };
    },
  };
  const gradient = buildAdaptivePathGradient(geometry, {
    mode: 'full',
    range: { start: 0, end: 20 },
    colorStops: [
      { progress: 0, color: '#000000' },
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
  });
  const adaptiveRanges = gradient.ranges;
  const measurementCounts = { lengthReads, pointReads };
  const animator = new PathStateAnimator({
    animation: { enabled: true, duration: 100, easing: 'linear' },
    initialProgress: 20,
    requestFrame: scheduler.requestFrame,
    cancelFrame: scheduler.cancelFrame,
    updateStateLayer: (_element, progress) => setFullPathGradientRevealRange(gradient, { start: 0, end: progress }),
    onComplete: () => {},
  });

  animator.bindStateLayer({ id: 'gradient-state' });
  animator.animateTo(80);
  scheduler.runNextFrame(1000);
  scheduler.runNextFrame(1050);
  scheduler.runNextFrame(1100);

  assert.equal(gradient.ranges, adaptiveRanges);
  assert.deepEqual(gradient.revealRange, {
    id: 'gradient-reveal',
    start: 0,
    end: 80,
    startCap: 'round',
    endCap: 'round',
    dash: { array: [80, 100], offset: 0 },
  });
  assert.deepEqual({ lengthReads, pointReads }, measurementCounts);
});
