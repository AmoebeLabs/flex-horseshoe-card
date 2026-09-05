import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildArcPathDefinition,
  buildLinePathDefinition,
  buildRectanglePathDefinition,
  buildWavePathDefinition,
} from '../src/path-generators.js';
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
  opacity: 0.4,
  linecap: 'round',
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
    const rendered = renderPathStrokeLayers(pathDefinition, background, paintedRanges, `path-${index}`);
    const renderedRanges = rendered.values[10];

    assert.equal(rendered.values[0], pathDefinition.signature);
    assert.equal(rendered.values[3], pathDefinition.d);
    assert.equal(rendered.values[5], pathDefinition.d);
    assert.equal(rendered.values[6], background.color);
    assert.equal(rendered.values[7], background.width);
    assert.equal(rendered.values[8], background.opacity);
    assert.equal(rendered.values[9], background.linecap);
    assert.equal(renderedRanges.length, 2);

    renderedRanges.forEach((range, rangeIndex) => {
      assert.equal(range.values[3], pathDefinition.d);
      assert.equal(range.values[4], paintedRanges[rangeIndex].color);
      assert.equal(range.values[5], paintedRanges[rangeIndex].width);
      assert.equal(range.values[6], paintedRanges[rangeIndex].opacity);
      assert.equal(range.values[7], 'butt');
      assert.equal(range.values[8], paintedRanges[rangeIndex].dash.array.join(' '));
      assert.equal(range.values[9], paintedRanges[rangeIndex].dash.offset);
    });
  });
});

test('mixed endpoint caps stay exact until the dedicated mask renderer is added', () => {
  const mixedRange = {
    ...paintedRanges[0],
    startCap: 'round',
    endCap: 'butt',
  };
  const rendered = renderPathStrokeLayers(pathDefinitions[1], background, [mixedRange], 'mixed');

  assert.equal(rendered.values[10][0].values[7], 'butt');
});
