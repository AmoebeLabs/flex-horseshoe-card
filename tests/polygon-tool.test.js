import test from 'node:test';
import assert from 'node:assert/strict';
import PolygonTool from '../src/polygon-tool.js';
import { buildPolygonPathDefinition } from '../src/path-generators.js';

const templates = { hasJavascriptTemplates: () => false };
const card = {
  cardLayout: {
    calculateSvgCoordinatesInGroup: (config) => ({ xpos: config.xpos * 2, ypos: config.ypos * 2 }),
  },
};

test('PolygonTool uses the shared complete polygon path for width and height sizing', () => {
  const tool = new PolygonTool({
    sides: 6,
    xpos: 50,
    ypos: 50,
    width: 70,
    height: 50,
    top: 0.5,
  }, 0, templates, 'card', card);
  const expected = buildPolygonPathDefinition({
    type: 'polygon',
    cx: 100,
    cy: 100,
    sides: 6,
    width: 140,
    height: 100,
    start: 0,
    end: 6,
    top: 0.5,
    direction: 'clockwise',
  });

  assert.equal(tool.pathDefinition.d, expected.d);
  assert.equal(tool.pathDefinition.closed, true);
});

test('PolygonTool defaults odd polygons to a top corner and accepts radius sizing', () => {
  const tool = new PolygonTool({
    sides: 5,
    xpos: 50,
    ypos: 50,
    radius: 30,
  }, 0, templates, 'card', card);

  assert.equal(tool.pathContract.top, 0);
  assert.equal(tool.pathContract.radius, 60);
  assert.equal(tool.points[0].x, 100);
  assert.equal(tool.points[0].y, 40);
});

test('PolygonTool defaults even polygons to a flat top side', () => {
  const tool = new PolygonTool({
    sides: 4,
    xpos: 50,
    ypos: 50,
    width: 50,
    height: 40,
  }, 0, templates, 'card', card);

  assert.equal(tool.pathContract.top, 0.5);
  assert.ok(Math.abs(tool.points[0].y - tool.points[1].y) < 1e-10);
});

test('PolygonTool rejects incomplete and ambiguous sizing at the config boundary', () => {
  assert.throws(
    () => new PolygonTool({ sides: 6, xpos: 50, ypos: 50, width: 50 }, 0, templates, 'card', card),
    /requires either radius, or both width and height/,
  );
  assert.throws(
    () => new PolygonTool({ sides: 6, xpos: 50, ypos: 50, radius: 20, width: 50, height: 50 }, 0, templates, 'card', card),
    /requires either radius, or both width and height/,
  );
});

test('PolygonTool rejects invalid side counts and top positions at the config boundary', () => {
  assert.throws(
    () => new PolygonTool({ sides: 2, xpos: 50, ypos: 50, radius: 20 }, 0, templates, 'card', card),
    /sides must be an integer equal to or greater than 3/,
  );
  assert.throws(
    () => new PolygonTool({ sides: 5, xpos: 50, ypos: 50, radius: 20, top: 5.1 }, 0, templates, 'card', card),
    /top must be a number from 0 through 5/,
  );
});
