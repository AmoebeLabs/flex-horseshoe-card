import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildArcPathDefinition,
  buildLinePathDefinition,
  buildRectanglePathDefinition,
  buildWavePathDefinition,
} from '../src/path-generators.js';
import { renderNormalizedPathBands } from '../src/path-mask-renderer.js';
import { renderPathStrokeLayers } from '../src/path-renderer.js';

const pathDefinitions = [
  buildArcPathDefinition({
    cx: 50,
    cy: 50,
    radiusX: 40,
    radiusY: 40,
    startAngle: 0,
    arcDegrees: 270,
  }),
  buildLinePathDefinition({ x1: 10, y1: 50, x2: 90, y2: 50 }),
  buildRectanglePathDefinition({
    x: 10,
    y: 10,
    width: 80,
    height: 80,
    radiusTopLeft: 8,
    radiusTopRight: 8,
    radiusBottomRight: 8,
    radiusBottomLeft: 8,
    start: 'top',
    direction: 'clockwise',
  }),
  buildWavePathDefinition({
    x1: 10,
    y1: 50,
    x2: 90,
    y2: 50,
    waves: 2,
    amplitude: 12,
  }),
];
const background = {
  color: '#222222',
  width: 10,
  opacity: 1,
  fillOpacity: 0.4,
  strokeOpacity: 0.7,
  border: { color: '#111111', width: 1 },
  startCap: 'round',
  endCap: 'round',
};
const foreground = {
  opacity: 0.9,
  fillOpacity: 0.8,
  strokeOpacity: 0.6,
  border: { color: '#111111', width: 2 },
};
const paintedRanges = [
  {
    id: 'low',
    start: 0,
    end: 35,
    length: 35,
    color: '#00aa00',
    width: 8,
    opacity: 0.8,
    startCap: 'butt',
    endCap: 'butt',
    dash: { array: [35, 100], offset: 0 },
  },
  {
    id: 'high',
    start: 40,
    end: 75,
    length: 35,
    color: '#cc0000',
    width: 8,
    opacity: 1,
    startCap: 'butt',
    endCap: 'butt',
    dash: { array: [35, 100], offset: -40 },
  },
];

test('every generated shape uses the same generic stroke and dash layers', () => {
  pathDefinitions.forEach((pathDefinition, index) => {
    const rendered = renderPathStrokeLayers(
      pathDefinition,
      background,
      foreground,
      paintedRanges,
      `path-${index}`,
    );
    const renderedBackground = rendered.values[5];
    const renderedRanges = rendered.values[6];

    assert.equal(rendered.values[0], pathDefinition.signature);
    assert.equal(rendered.values[3], pathDefinition.d);
    assert.equal(renderedBackground.values[1], background.opacity);
    assert.equal(renderedBackground.values[4], background.fillOpacity);
    assert.equal(renderedRanges.values[1], foreground.opacity);
    assert.equal(renderedRanges.values[4], foreground.fillOpacity);
    assert.equal(renderedRanges.values[5].length, 2);

    renderedRanges.values[5].forEach((range, rangeIndex) => {
      const fillStroke = range.values[3];

      assert.equal(range.values[2], paintedRanges[rangeIndex].opacity);
      assert.equal(fillStroke.values[2], pathDefinition.d);
      assert.equal(fillStroke.values[3], paintedRanges[rangeIndex].color);
      assert.equal(fillStroke.values[4], paintedRanges[rangeIndex].width);
      assert.equal(fillStroke.values[5], paintedRanges[rangeIndex].dash.array.join(' '));
      assert.equal(fillStroke.values[6], paintedRanges[rangeIndex].dash.offset);
    });
  });
});

test('all endpoint cap combinations add round strokes only where selected', () => {
  [
    { startCap: 'butt', endCap: 'butt', expected: [] },
    { startCap: 'round', endCap: 'round', expected: ['start', 'end'] },
    { startCap: 'round', endCap: 'butt', expected: ['start'] },
    { startCap: 'butt', endCap: 'round', expected: ['end'] },
  ].forEach((combination, index) => {
    const range = { ...paintedRanges[0], ...combination };
    const rendered = renderNormalizedPathBands(
      pathDefinitions[1],
      [range],
      foreground,
      `caps-${index}`,
      'caps-band',
    );
    const fillStroke = rendered.values[5][0].values[3];
    const renderedCaps = fillStroke.values[7]
      .filter((cap) => typeof cap !== 'symbol')
      .map((cap) => cap.values[2]);

    assert.deepEqual(renderedCaps, combination.expected);
  });
});

test('border mask removes the complete fill width from a wider independent border', () => {
  const rendered = renderNormalizedPathBands(
    pathDefinitions[1],
    [paintedRanges[0]],
    foreground,
    'bordered',
    'bordered-band',
  );
  const borderLayers = rendered.values[2];
  const borderMask = borderLayers.values[0][0];
  const outerMaskStroke = borderMask.values[3];
  const innerMaskStroke = borderMask.values[4];
  const visibleBorderRange = borderLayers.values[3][0];
  const visibleBorderStroke = visibleBorderRange.values[5];

  assert.equal(outerMaskStroke.values[3], 'white');
  assert.equal(outerMaskStroke.values[4], 12);
  assert.equal(innerMaskStroke.values[3], 'black');
  assert.equal(innerMaskStroke.values[4], 8);
  assert.equal(visibleBorderStroke.values[3], '#111111');
  assert.equal(visibleBorderStroke.values[4], 12);
  assert.equal(visibleBorderRange.values[2], paintedRanges[0].opacity);
  assert.equal(borderLayers.values[2], 0.6);
});
