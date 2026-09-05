import { readFile } from 'node:fs/promises';

import { expect, test } from '@playwright/test';

test('representative fixed horseshoe matches the frozen browser geometry contract', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(`${error.name}: ${error.message}\n${error.stack}`));

  await page.route('http://fhs.test/**', async (route) => {
    const pathname = new URL(route.request().url()).pathname;

    if (pathname === '/horseshoe-path-adapter-fixture') {
      await route.fulfill({
        contentType: 'text/html',
        body: `
          <div id="parity-fixture"></div>
          <script type="importmap">
            {
              "imports": {
                "lit": "/node_modules/lit/index.js",
                "lit/": "/node_modules/lit/",
                "lit-html": "/node_modules/lit-html/lit-html.js",
                "lit-html/": "/node_modules/lit-html/",
                "lit-element/": "/node_modules/lit-element/",
                "@lit/reactive-element": "/node_modules/@lit/reactive-element/reactive-element.js",
                "@lit/reactive-element/": "/node_modules/@lit/reactive-element/"
              }
            }
          </script>
          <script type="module">
            import { render, svg } from 'lit';
            import { buildArcPathDefinition } from '/src/path-generators.js';
            import { renderNormalizedPathBands } from '/src/path-mask-renderer.js';

            const pathDefinition = buildArcPathDefinition({
              cx: 100, cy: 100, radiusX: 80, radiusY: 80,
              startAngle: -135, arcDegrees: 270,
            });
            const layer = {
              opacity: 1, fillOpacity: 1, strokeOpacity: 1,
              border: { color: 'transparent', width: 0 },
            };
            const scaleRange = {
              id: 'scale', start: 0, end: 100, color: '#d1d5db', width: 6,
              opacity: 1, startCap: 'round', endCap: 'round',
              dash: { array: [100, 100], offset: 0 },
            };
            const stateRange = {
              id: 'state', start: 0, end: 60, color: '#2563eb', width: 12,
              opacity: 1, startCap: 'round', endCap: 'round',
              dash: { array: [60, 100], offset: 0 },
            };

            // The reference expresses the frozen current fixed-arc contract:
            // identical center/radius/angles, widths, caps, and 60% state.
            const referencePoint = (angle) => ({
              x: 100 + 80 * Math.cos(angle * Math.PI / 180),
              y: 100 + 80 * Math.sin(angle * Math.PI / 180),
            });
            const referenceStart = referencePoint(-135);
            const referenceEnd = referencePoint(135);
            const referencePath = 'M ' + referenceStart.x + ' ' + referenceStart.y
              + ' A 80 80 0 1 1 ' + referenceEnd.x + ' ' + referenceEnd.y;

            render(svg\`
              <svg id="parity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" width="800" height="400">
                <g class="old">
                  <path class="old-scale" d=\${referencePath} pathLength="100" fill="none" stroke="#d1d5db" stroke-width="6" stroke-linecap="round"></path>
                  <path class="old-state" d=\${referencePath} pathLength="100" fill="none" stroke="#2563eb" stroke-width="12" stroke-linecap="round" stroke-dasharray="60 100"></path>
                </g>
                <g class="new" transform="translate(200 0)">
                  \${renderNormalizedPathBands(pathDefinition, [scaleRange], layer, 'new-scale', 'horseshoe__scale')}
                  \${renderNormalizedPathBands(pathDefinition, [stateRange], layer, 'new-state', 'horseshoe__state-band')}
                </g>
              </svg>
            \`, document.querySelector('#parity-fixture'));

            window.fixtureReady = true;
          </script>
        `,
      });
      return;
    }

    const source = await readFile(new URL(`..${pathname}`, import.meta.url));
    await route.fulfill({ contentType: 'text/javascript', body: source });
  });

  await page.goto('http://fhs.test/horseshoe-path-adapter-fixture');
  await page.waitForTimeout(500);
  const diagnostics = await page.evaluate(() => ({
    ready: window.fixtureReady === true,
    resources: performance.getEntriesByType('resource').map((entry) => entry.name),
  }));
  if (pageErrors.length) throw new Error(JSON.stringify({ pageErrors, diagnostics }, null, 2));
  if (!diagnostics.ready) throw new Error(JSON.stringify(diagnostics, null, 2));

  const parity = await page.evaluate(() => {
    const oldState = document.querySelector('.old-state');
    const oldScale = document.querySelector('.old-scale');
    const newState = document.querySelector('.new .horseshoe__state-band__fill-stroke__body');
    const newScale = document.querySelector('.new .horseshoe__scale__fill-stroke__body');
    const bounds = (element) => {
      const box = element.getBBox();
      return { x: box.x, y: box.y, width: box.width, height: box.height };
    };

    return {
      oldStateBounds: bounds(oldState),
      newStateBounds: bounds(newState),
      oldScaleBounds: bounds(oldScale),
      newScaleBounds: bounds(newScale),
      oldStateWidth: getComputedStyle(oldState).strokeWidth,
      newStateWidth: getComputedStyle(newState).strokeWidth,
      oldScaleWidth: getComputedStyle(oldScale).strokeWidth,
      newScaleWidth: getComputedStyle(newScale).strokeWidth,
      newDash: newState.getAttribute('stroke-dasharray'),
    };
  });

  expect(parity.oldStateWidth).toBe(parity.newStateWidth);
  expect(parity.oldScaleWidth).toBe(parity.newScaleWidth);
  expect(parity.newDash).toBe('60 100');
  expect(parity.newScaleBounds.width).toBeCloseTo(parity.oldScaleBounds.width, 6);
  expect(parity.newScaleBounds.height).toBeCloseTo(parity.oldScaleBounds.height, 6);
  expect(parity.newStateBounds.width).toBeCloseTo(parity.oldStateBounds.width, 6);
  expect(parity.newStateBounds.height).toBeCloseTo(parity.oldStateBounds.height, 6);
  await expect(page.locator('#parity-fixture')).toHaveScreenshot('final-horseshoe-paths.png');
});
