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
    radius: 4,
    top: 0.5,
  }, 0, templates, 'card', card);
  const expected = buildPolygonPathDefinition({
    type: 'polygon',
    cx: 100,
    cy: 100,
    sides: 6,
    width: 140,
    height: 100,
    radius: 8,
    start: 0,
    end: 6,
    top: 0.5,
    direction: 'clockwise',
  });

  assert.equal(tool.pathDefinition.d, expected.d);
  assert.equal(tool.pathDefinition.closed, true);
});

test('PolygonTool defaults odd polygons to a top corner and radius to no rounding', () => {
  const tool = new PolygonTool({
    sides: 5,
    xpos: 50,
    ypos: 50,
    width: 60,
    height: 60,
  }, 0, templates, 'card', card);

  assert.equal(tool.pathConfig.top, 0);
  assert.equal(tool.pathConfig.radius, 0);
  assert.match(tool.pathDefinition.d, /^M 100 40 /);
});

test('PolygonTool defaults even polygons to a flat top side', () => {
  const tool = new PolygonTool({
    sides: 4,
    xpos: 50,
    ypos: 50,
    width: 50,
    height: 40,
  }, 0, templates, 'card', card);
  const [startX, startY, nextX, nextY] = tool.pathDefinition.d.match(/-?\d+(?:\.\d+)?/g).map(Number);

  assert.equal(tool.pathConfig.top, 0.5);
  assert.deepEqual([startX, startY, nextX], [50, 60, 150]);
  assert.ok(Math.abs(nextY - 60) < 1e-10);
});

test('PolygonTool rejects incomplete dimensions and oversized corner radii at the config boundary', () => {
  assert.throws(
    () => new PolygonTool({ sides: 6, xpos: 50, ypos: 50, width: 50 }, 0, templates, 'card', card),
    /width and height must be greater than zero/,
  );
  assert.throws(
    () => new PolygonTool({ sides: 6, xpos: 50, ypos: 50, radius: 50, width: 50, height: 50 }, 0, templates, 'card', card),
    /radius is too large/,
  );
});

test('PolygonTool rejects invalid side counts and top positions at the config boundary', () => {
  assert.throws(
    () => new PolygonTool({ sides: 2, xpos: 50, ypos: 50, width: 50, height: 50 }, 0, templates, 'card', card),
    /sides must be an integer equal to or greater than 3/,
  );
  assert.throws(
    () => new PolygonTool({ sides: 5, xpos: 50, ypos: 50, width: 50, height: 50, top: 5.1 }, 0, templates, 'card', card),
    /top must be a number from 0 through 5/,
  );
});
