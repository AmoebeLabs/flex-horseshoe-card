import assert from 'node:assert/strict';
import test from 'node:test';

import { buildPathElements } from '../src/path-elements.js';
import { renderPathElements } from '../src/path-elements-renderer.js';

function createMeasuredLineGeometry(closed = false) {
  return {
    getPathDefinition: () => ({ closed }),
    getTotalLength: () => 100,
    pointAtProgress: (progress) => ({ x: progress, y: 50 }),
    tangentAtProgress: () => ({ x: 1, y: 0 }),
    normalAtProgress: (_progress, side) => side === 'left' ? { x: 0, y: -1 } : { x: 0, y: 1 },
  };
}

const tickLabelMarkerConfig = {
  ticks: [
    { id: 'major-25', layer: 'major', progress: 25, side: 'left', offset: 2, length: 8, shape: 'line', radius: 0, styles: { stroke: 'black' } },
    { id: 'minor-75', layer: 'minor', progress: 75, side: 'right', offset: 3, length: 0, shape: 'circle', radius: 2, styles: { fill: 'black' } },
  ],
  labels: [
    {
      id: 'horizontal', progress: 25, side: 'left', offset: 14, text: '25', orientation: 'horizontal', length: 30, samples: 7, styles: { fill: 'black' },
      badge: { visible: true, shape: 'circle', radius: 5, width: 0, height: 0, styles: { fill: 'white' } },
    },
    {
      id: 'path', progress: 75, side: 'right', offset: 14, text: '75', orientation: 'path', length: 30, samples: 7, styles: { fill: 'black' },
      badge: { visible: true, shape: 'capsule', radius: 3, width: 18, height: 8, styles: { fill: 'white' } },
    },
  ],
  markers: [
    { id: 'forward', progress: 50, side: 'left', offset: 5, direction: 'forward', shape: 'triangle', length: 10, width: 6, radius: 0, styles: { fill: 'red' } },
    { id: 'reverse', progress: 50, side: 'right', offset: 5, direction: 'backward', shape: 'circle', length: 10, width: 6, radius: 3, styles: { fill: 'blue' } },
  ],
};

test('ticks, labels, badges, and markers use measured points and normals', () => {
  const layout = buildPathElements(createMeasuredLineGeometry(), tickLabelMarkerConfig);

  assert.deepEqual(layout.ticks.map((tick) => ({ id: tick.id, x1: tick.x1, y1: tick.y1, x2: tick.x2, y2: tick.y2 })), [
    { id: 'major-25', x1: 25, y1: 48, x2: 25, y2: 40 },
    { id: 'minor-75', x1: 75, y1: 53, x2: 75, y2: 53 },
  ]);
  assert.deepEqual(layout.labels.map((label) => ({ id: label.id, x: label.x, y: label.y })), [
    { id: 'horizontal', x: 25, y: 36 },
    { id: 'path', x: 75, y: 64 },
  ]);
  assert.equal(layout.labels[1].guidePath, 'M 60 64 L 65 64 L 70 64 L 75 64 L 80 64 L 85 64 L 90 64');
  assert.deepEqual(layout.markers[0].points, [
    { x: 55, y: 45 },
    { x: 45, y: 42 },
    { x: 45, y: 48 },
  ]);
  assert.equal(layout.markers[1].rotation, -180);
});

test('tickmark and label positions use transformed geometry while horizontal labels remain untransformed', () => {
  const transformedGeometry = {
    getPathDefinition: () => ({ closed: false }),
    getTotalLength: () => 100,
    pointAtProgress: (progress) => ({ x: 50, y: 100 - progress }),
    tangentAtProgress: () => ({ x: 0, y: -1 }),
    normalAtProgress: (_progress, side) => side === 'left' ? { x: -1, y: 0 } : { x: 1, y: 0 },
  };
  const layout = buildPathElements(transformedGeometry, tickLabelMarkerConfig);
  const rendered = renderPathElements(layout, 'transformed');

  assert.deepEqual({ x: layout.labels[0].x, y: layout.labels[0].y }, { x: 36, y: 75 });
  assert.equal(layout.labels[0].tangentRotation, -90);
  assert.doesNotMatch(rendered.strings.join(''), /path-label-horizontal[^>]*transform=/);
});

test('path labels remain centered at either end of an open path', () => {
  const endpointConfig = {
    ticks: [],
    labels: [
      { ...tickLabelMarkerConfig.labels[1], id: 'start', progress: 0 },
      { ...tickLabelMarkerConfig.labels[1], id: 'end', progress: 100 },
    ],
    markers: [],
  };
  const layout = buildPathElements(createMeasuredLineGeometry(), endpointConfig);

  assert.match(layout.labels[0].guidePath, /^M -15 64 .* L 15 64$/);
  assert.match(layout.labels[1].guidePath, /^M 85 64 .* L 115 64$/);
  assert.deepEqual(layout.labels.map((label) => label.guideStartOffset), [50, 50]);
});

test('reversed path traversal reverses the local guide instead of transforming its text', () => {
  const reversedGeometry = {
    getPathDefinition: () => ({ closed: false }),
    getTotalLength: () => 100,
    pointAtProgress: (progress) => ({ x: 100 - progress, y: 50 }),
    tangentAtProgress: () => ({ x: -1, y: 0 }),
    normalAtProgress: (_progress, side) => side === 'left' ? { x: 0, y: 1 } : { x: 0, y: -1 },
  };
  const reversedConfig = {
    ticks: [],
    labels: [{ ...tickLabelMarkerConfig.labels[1], progress: 75 }],
    markers: [],
  };
  const layout = buildPathElements(reversedGeometry, reversedConfig);
  const rendered = renderPathElements(layout, 'reversed');

  assert.equal(layout.labels[0].guidePath, 'M 10 36 L 15 36 L 20 36 L 25 36 L 30 36 L 35 36 L 40 36');
  assert.equal(layout.labels[0].guideStartOffset, 50);
  assert.doesNotMatch(rendered.strings.join(''), /scale\(-1/);
});

test('closed seams place progress zero once and wrap path-label guide geometry', () => {
  const closedConfig = {
    ticks: [
      { ...tickLabelMarkerConfig.ticks[0], id: 'zero', progress: 0 },
      { ...tickLabelMarkerConfig.ticks[0], id: 'hundred', progress: 100 },
    ],
    labels: [
      { ...tickLabelMarkerConfig.labels[1], id: 'zero-label', progress: 0 },
      { ...tickLabelMarkerConfig.labels[1], id: 'hundred-label', progress: 100 },
    ],
    markers: [
      { ...tickLabelMarkerConfig.markers[0], id: 'zero-marker', progress: 0 },
      { ...tickLabelMarkerConfig.markers[0], id: 'hundred-marker', progress: 100 },
    ],
  };
  const layout = buildPathElements(createMeasuredLineGeometry(true), closedConfig);

  assert.equal(layout.ticks.length, 1);
  assert.equal(layout.labels.length, 1);
  assert.equal(layout.markers.length, 1);
  assert.match(layout.labels[0].guidePath, /^M 85 64 L 90 64 L 95 64 L 0 64 L 5 64 L 10 64 L 15 64$/);
  assert.equal(layout.labels[0].guideStartOffset, 50);
});

test('renderer consumes final tickmark, label, badge, and marker coordinates without geometry input', () => {
  const layout = buildPathElements(createMeasuredLineGeometry(), tickLabelMarkerConfig);
  const rendered = renderPathElements(layout, 'items');
  const source = rendered.strings.join('');

  assert.match(source, /path-tickmarks/);
  assert.match(source, /path-label-badges/);
  assert.match(source, /path-labels/);
  assert.match(source, /path-markers/);
  assert.equal(rendered.values[0].length, 2);
  assert.equal(rendered.values[1].length, 2);
  assert.equal(rendered.values[2].length, 2);
  assert.equal(rendered.values[3].length, 2);
});
