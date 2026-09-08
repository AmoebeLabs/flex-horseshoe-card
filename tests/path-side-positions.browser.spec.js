import { readFile } from 'node:fs/promises';

import { expect, test } from '@playwright/test';

test('browser geometry measures polygon and rounded rectangle side ranges as one path', async ({ page }) => {
  const generatorSource = await readFile(new URL('../src/path-generators.js', import.meta.url), 'utf8');
  const measurements = await page.evaluate(async (source) => {
    const moduleUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
    const {
      buildPolygonPathDefinition,
      buildRectanglePathDefinition,
      calculatePolygonPoints,
    } = await import(moduleUrl);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    document.body.append(svg);
    const polygonConfig = {
      cx: 100, cy: 100, sides: 6, width: 140, height: 100,
      top: 0.1, start: 5.5, end: 2.5, direction: 'clockwise',
    };
    const rectangleConfig = {
      cx: 100, cy: 100, width: 140, height: 90,
      radiusTopLeft: 12, radiusTopRight: 12, radiusBottomRight: 12, radiusBottomLeft: 12,
      top: 0.5, start: 3.5, end: 1.5, direction: 'clockwise',
    };
    const definitions = [
      buildPolygonPathDefinition(polygonConfig),
      buildRectanglePathDefinition(rectangleConfig),
    ];
    const measured = definitions.map((definition) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', definition.d);
      svg.append(path);
      const length = path.getTotalLength();
      const start = path.getPointAtLength(0);
      const middle = path.getPointAtLength(length / 2);
      const end = path.getPointAtLength(length);

      return {
        commandCount: path.getPathData ? path.getPathData().length : definition.d.match(/[MLAZ]/g).length,
        length,
        start: { x: start.x, y: start.y },
        middle: { x: middle.x, y: middle.y },
        end: { x: end.x, y: end.y },
      };
    });
    const polygonPoints = calculatePolygonPoints(polygonConfig);
    const topStart = polygonPoints[0];
    const topEnd = polygonPoints[1];
    const configuredTop = {
      x: topStart.x + (topEnd.x - topStart.x) * 0.1,
      y: topStart.y + (topEnd.y - topStart.y) * 0.1,
    };

    URL.revokeObjectURL(moduleUrl);
    return { measured, configuredTop };
  }, generatorSource);

  const [polygon, rectangle] = measurements.measured;

  expect(polygon.commandCount).toBeGreaterThan(3);
  expect(polygon.length).toBeGreaterThan(150);
  expect(polygon.start.x).not.toBeCloseTo(polygon.end.x, 4);
  expect(polygon.start.y).not.toBeCloseTo(polygon.end.y, 4);
  expect(measurements.configuredTop.x).toBeCloseTo(100, 4);
  expect(measurements.configuredTop.y).toBeLessThan(100);

  expect(rectangle.commandCount).toBeGreaterThan(4);
  expect(rectangle.length).toBeGreaterThan(180);
  expect(rectangle.start.x).toBeCloseTo(30, 4);
  expect(rectangle.start.y).toBeCloseTo(100, 4);
  expect(rectangle.middle.x).toBeCloseTo(100, 4);
  expect(rectangle.middle.y).toBeCloseTo(55, 4);
  expect(rectangle.end.x).toBeCloseTo(170, 4);
  expect(rectangle.end.y).toBeCloseTo(100, 4);
});

test('browser geometry closes only an explicitly complete side range', async ({ page }) => {
  const generatorSource = await readFile(new URL('../src/path-generators.js', import.meta.url), 'utf8');
  const result = await page.evaluate(async (source) => {
    const moduleUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
    const { buildPolygonPathDefinition } = await import(moduleUrl);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    document.body.append(svg);
    const base = {
      cx: 50, cy: 50, sides: 5, radius: 40, top: 0,
      direction: 'clockwise',
    };
    const emptyDefinition = buildPolygonPathDefinition({ ...base, start: 0, end: 0 });
    const completeDefinition = buildPolygonPathDefinition({ ...base, start: 0, end: 5 });
    const lengths = [emptyDefinition, completeDefinition].map((definition) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', definition.d);
      svg.append(path);
      return path.getTotalLength();
    });

    URL.revokeObjectURL(moduleUrl);
    return { emptyDefinition, completeDefinition, lengths };
  }, generatorSource);

  expect(result.emptyDefinition.closed).toBe(false);
  expect(result.lengths[0]).toBe(0);
  expect(result.completeDefinition.closed).toBe(true);
  expect(result.lengths[1]).toBeGreaterThan(200);
});
