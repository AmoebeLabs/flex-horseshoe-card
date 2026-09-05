import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createValueAnimatorState,
  startValueAnimation,
} from '../src/horseshoe-animator.js';
import { renderLabelBadgesLayer } from '../src/horseshoe-renderer.js';
import {
  buildLabelItems,
  buildScaleArcs,
} from '../src/horseshoe-shapes.js';

const linearGeometry = {
  startAngle: 0,
  endAngle: 180,
  radius: 40,
  getActiveSourceRange: () => ({ start: 0, end: 100 }),
  getActiveColorStops: (colorStops) => colorStops,
  valueToRatio: (value) => Number(value) / 100,
  valueToAngle: (value) => Number(value) * 1.8,
  pointAt: (angle, radius) => ({ x: angle + radius, y: angle - radius }),
};

test('segmented scale splits internal gaps and preserves configured endpoint caps', () => {
  const arcs = buildScaleArcs({
    show: { scale_style: 'colorstopsegments' },
    horseshoe_scale: {
      color: '#444444',
      linecap: { start: 'round', end: 'square' },
    },
    colorstops: {
      gap: 10,
      colors: [
        { value: 0, color: '#00ff00' },
        { value: 50, color: '#ffff00' },
        { value: 100, color: '#ff0000' },
      ],
    },
  }, linearGeometry);

  assert.deepEqual(arcs.map((arc) => ({
    startAngle: arc.startAngle,
    endAngle: arc.endAngle,
    startCap: arc.startCap,
    endCap: arc.endCap,
  })), [
    { startAngle: 0, endAngle: 85, startCap: 'round', endCap: 'butt' },
    { startAngle: 95, endAngle: 180, startCap: 'butt', endCap: 'square' },
  ]);
});

test('minmax labels retain both scale endpoints and feed one badge per label', () => {
  const runtimeConfig = {
    show: {
      labels_at: 'minmax',
      label_badges: true,
    },
    bar_mode: 'normal',
    horseshoe_scale: { min: 0, max: 100 },
    horseshoe_state: { width: 6 },
    horseshoe_labels: {
      offset: 8,
      orientation: 'horizontal',
      distance_min: 0,
      badges: { styles: { fill: '#222222' } },
    },
    colorstops: { colors: [] },
  };
  const labelItems = buildLabelItems(runtimeConfig, linearGeometry);
  const renderedBadges = renderLabelBadgesLayer(
    runtimeConfig,
    { cx: 50, cy: 50 },
    'contract-card',
    0,
    labelItems,
  );

  assert.deepEqual(labelItems.map((item) => ({ text: item.text, angle: item.angle })), [
    { text: '0', angle: 0 },
    { text: '100', angle: 180 },
  ]);
  assert.match(renderedBadges.strings.join(''), /horseshoe__label-badges-layer/);
  assert.equal(renderedBadges.values[1].length, 2);
});

test('disabled value animation publishes only the final value', () => {
  const updates = [];
  const completed = [];

  startValueAnimation(
    createValueAnimatorState(),
    { enabled: false, duration: 2500, easing: 'ease-out', debug: false },
    { fromValue: 10, toValue: 30 },
    {
      onUpdate: (value) => updates.push(value),
      onComplete: (value) => completed.push(value),
    },
  );

  assert.deepEqual(updates, [30]);
  assert.deepEqual(completed, [30]);
});

test('value animation interpolates display state and completes at the target', (context) => {
  const frames = [];
  const updates = [];
  const completed = [];
  const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
  const originalCancelAnimationFrame = globalThis.cancelAnimationFrame;

  globalThis.requestAnimationFrame = (callback) => {
    frames.push(callback);
    return frames.length;
  };
  globalThis.cancelAnimationFrame = () => {};
  context.after(() => {
    globalThis.requestAnimationFrame = originalRequestAnimationFrame;
    globalThis.cancelAnimationFrame = originalCancelAnimationFrame;
  });

  const animatorState = createValueAnimatorState();
  startValueAnimation(
    animatorState,
    { enabled: true, duration: 100, easing: 'linear', debug: false },
    { fromValue: 10, toValue: 30 },
    {
      onUpdate: (value) => updates.push(value),
      onComplete: (value) => completed.push(value),
    },
  );

  frames.shift()(1000);
  frames.shift()(1050);
  frames.shift()(1100);

  assert.deepEqual(updates, [10, 20, 30]);
  assert.deepEqual(completed, [30]);
  assert.equal(animatorState.animating, false);
});
