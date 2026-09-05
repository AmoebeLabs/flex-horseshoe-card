import { readFile } from 'node:fs/promises';

import { test, expect } from '@playwright/test';

test('SVGGeometryElement reports actual length and points independently from pathLength', async ({ page }) => {
  await page.setContent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="40">
      <path id="actual" d="M 10 20 L 210 20"></path>
      <path id="normalized" d="M 10 20 L 210 20" pathLength="100"></path>
    </svg>
  `);

  const geometry = await page.evaluate(() => {
    const actual = document.querySelector('#actual');
    const normalized = document.querySelector('#normalized');
    const actualMidpoint = actual.getPointAtLength(actual.getTotalLength() / 2);
    const normalizedMidpoint = normalized.getPointAtLength(normalized.getTotalLength() / 2);

    return {
      actualLength: actual.getTotalLength(),
      normalizedLength: normalized.getTotalLength(),
      normalizedPathLength: Number(normalized.getAttribute('pathLength')),
      actualMidpoint: { x: actualMidpoint.x, y: actualMidpoint.y },
      normalizedMidpoint: { x: normalizedMidpoint.x, y: normalizedMidpoint.y },
    };
  });

  expect(geometry.actualLength).toBeCloseTo(200, 5);
  expect(geometry.normalizedLength).toBeCloseTo(200, 5);
  expect(geometry.normalizedPathLength).toBe(100);
  expect(geometry.actualMidpoint).toEqual({ x: 110, y: 20 });
  expect(geometry.normalizedMidpoint).toEqual({ x: 110, y: 20 });
});

test('pathLength 100 gives different actual paths the same relative dash coverage', async ({ page }) => {
  await page.setContent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="440" height="80">
      <path id="short" d="M 10 20 L 210 20" pathLength="100"
        fill="none" stroke="black" stroke-width="10" stroke-dasharray="25 75"></path>
      <path id="long" d="M 10 60 L 410 60" pathLength="100"
        fill="none" stroke="black" stroke-width="10" stroke-dasharray="25 75"></path>
    </svg>
  `);

  const paintedPoints = await page.evaluate(() => {
    const shortPath = document.querySelector('#short');
    const longPath = document.querySelector('#long');

    return {
      shortInside: shortPath.isPointInStroke(new DOMPoint(50, 20)),
      shortOutside: shortPath.isPointInStroke(new DOMPoint(90, 20)),
      longInside: longPath.isPointInStroke(new DOMPoint(90, 60)),
      longOutside: longPath.isPointInStroke(new DOMPoint(130, 60)),
    };
  });

  expect(paintedPoints).toEqual({
    shortInside: true,
    shortOutside: false,
    longInside: true,
    longOutside: false,
  });
});

test('an invisible zero-size master path remains measurable', async ({ page }) => {
  await page.setContent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"
      aria-hidden="true" style="position:absolute;visibility:hidden;pointer-events:none">
      <path id="measurement" d="M 5 5 C 25 45 75 45 95 5" pathLength="100"></path>
    </svg>
  `);

  const measurement = await page.evaluate(() => {
    const path = document.querySelector('#measurement');
    const length = path.getTotalLength();
    const midpoint = path.getPointAtLength(length / 2);

    return {
      connected: path.isConnected,
      length,
      midpoint: { x: midpoint.x, y: midpoint.y },
    };
  });

  expect(measurement.connected).toBe(true);
  expect(measurement.length).toBeGreaterThan(90);
  expect(measurement.midpoint.x).toBeCloseTo(50, 3);
  expect(measurement.midpoint.y).toBeGreaterThan(30);
});

test('geometry-dependent content stays hidden until its first path binding is complete', async ({ page }) => {
  await page.setContent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="80">
      <path id="measurement" d="M 10 40 L 210 40" pathLength="100"
        fill="none" stroke="transparent"></path>
      <circle id="dependent" cx="0" cy="0" r="5" visibility="hidden"></circle>
    </svg>
    <script>
      window.bindPathGeometry = () => new Promise((resolve) => {
        requestAnimationFrame(() => {
          const path = document.querySelector('#measurement');
          const dependent = document.querySelector('#dependent');
          const point = path.getPointAtLength(path.getTotalLength() / 2);

          dependent.setAttribute('cx', point.x);
          dependent.setAttribute('cy', point.y);
          dependent.setAttribute('visibility', 'visible');
          resolve();
        });
      });
    </script>
  `);

  await expect(page.locator('#dependent')).toHaveAttribute('visibility', 'hidden');
  await page.evaluate(() => window.bindPathGeometry());
  await expect(page.locator('#dependent')).toHaveAttribute('visibility', 'visible');
  await expect(page.locator('#dependent')).toHaveAttribute('cx', '110');
  await expect(page.locator('#dependent')).toHaveAttribute('cy', '40');
});

test('PathGeometry measures each signature once and hides output during rebinding', async ({ page }) => {
  const pathGeometrySource = await readFile(new URL('../src/path-geometry.js', import.meta.url), 'utf8');

  await page.setContent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="80">
      <path id="measurement" d="M 10 40 L 110 40" pathLength="100"
        fill="none" stroke="transparent"></path>
      <circle id="dependent" cx="0" cy="0" r="5" visibility="hidden"></circle>
    </svg>
  `);

  const lifecycle = await page.evaluate(async (moduleSource) => {
    const moduleUrl = URL.createObjectURL(new Blob([moduleSource], { type: 'text/javascript' }));
    const { default: PathGeometry } = await import(moduleUrl);
    const pathElement = document.querySelector('#measurement');
    const dependent = document.querySelector('#dependent');
    const nativeGetTotalLength = pathElement.getTotalLength.bind(pathElement);
    let measurementCalls = 0;
    let requestedRenders = 0;

    pathElement.getTotalLength = () => {
      measurementCalls += 1;
      return nativeGetTotalLength();
    };

    const geometry = new PathGeometry(() => {
      requestedRenders += 1;
    });
    const shortDefinition = {
      d: 'M 10 40 L 110 40',
      closed: false,
      direction: 'forward',
      signature: 'line-100',
    };
    const longDefinition = {
      d: 'M 10 40 L 210 40',
      closed: false,
      direction: 'forward',
      signature: 'line-200',
    };

    geometry.setPathDefinition(shortDefinition);
    geometry.bindPathElement(pathElement);
    dependent.setAttribute('visibility', geometry.isReady() ? 'visible' : 'hidden');
    const initial = {
      ready: geometry.isReady(),
      visibility: dependent.getAttribute('visibility'),
      totalLength: geometry.getTotalLength(),
      measurementCalls,
      requestedRenders,
    };

    geometry.setPathDefinition(shortDefinition);
    geometry.bindPathElement(pathElement);
    const unchanged = { measurementCalls, requestedRenders };

    geometry.setPathDefinition(longDefinition);
    dependent.setAttribute('visibility', geometry.isReady() ? 'visible' : 'hidden');
    pathElement.setAttribute('d', longDefinition.d);
    const invalidated = {
      ready: geometry.isReady(),
      visibility: dependent.getAttribute('visibility'),
    };
    geometry.bindPathElement(pathElement);
    const changed = {
      ready: geometry.isReady(),
      totalLength: geometry.getTotalLength(),
      measurementCalls,
      requestedRenders,
    };

    geometry.setPathDefinition(shortDefinition);
    pathElement.setAttribute('d', shortDefinition.d);
    geometry.bindPathElement(pathElement);
    const reused = {
      ready: geometry.isReady(),
      totalLength: geometry.getTotalLength(),
      measurementCalls,
      requestedRenders,
    };

    URL.revokeObjectURL(moduleUrl);
    return { initial, unchanged, invalidated, changed, reused };
  }, pathGeometrySource);

  expect(lifecycle).toEqual({
    initial: {
      ready: true,
      visibility: 'visible',
      totalLength: 100,
      measurementCalls: 1,
      requestedRenders: 1,
    },
    unchanged: {
      measurementCalls: 1,
      requestedRenders: 1,
    },
    invalidated: {
      ready: false,
      visibility: 'hidden',
    },
    changed: {
      ready: true,
      totalLength: 200,
      measurementCalls: 2,
      requestedRenders: 2,
    },
    reused: {
      ready: true,
      totalLength: 100,
      measurementCalls: 2,
      requestedRenders: 3,
    },
  });
});
