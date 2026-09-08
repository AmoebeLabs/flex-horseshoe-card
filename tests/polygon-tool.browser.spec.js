import { readFile } from 'node:fs/promises';

import { expect, test } from '@playwright/test';

test('polygon layout tool renders on the exact shared horseshoe polygon path', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(`${error.name}: ${error.message}\n${error.stack}`));

  await page.route('http://fhs.test/**', async (route) => {
    const pathname = new URL(route.request().url()).pathname;

    if (pathname === '/polygon-tool-fixture') {
      await route.fulfill({
        contentType: 'text/html',
        body: `
          <div id="fixture"></div>
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
            import PolygonTool from '/src/polygon-tool.js';
            import { buildPolygonPathDefinition } from '/src/path-generators.js';

            const card = {
              config: {},
              cardAnimations: { styles: { polygons: {} } },
              cardLayout: {
                calculateSvgCoordinatesInGroup: (config) => ({ xpos: config.xpos * 2, ypos: config.ypos * 2 }),
                getGroupScaleTransform: () => '',
                getGroupScaleStyle: () => '',
                groupManager: {
                  getGroupChainForItem: () => [],
                  isItemVisible: () => true,
                },
                masksClips: { applyGradientRefs: (styles) => styles },
              },
              actions: {
                getActionHandlerOptions: () => ({}),
                handleAction: () => {},
              },
            };
            const templates = { hasJavascriptTemplates: () => false };
            const tool = new PolygonTool({
              sides: 6, xpos: 50, ypos: 50, width: 70, height: 50, radius: 4, top: 0.5,
              styles: { fill: '#38bdf8', 'fill-opacity': 0.35, stroke: '#0f172a', 'stroke-width': 3 },
            }, 0, templates, 'fixture', card);
            const horseshoePath = buildPolygonPathDefinition({
              type: 'polygon', cx: 100, cy: 100, sides: 6, width: 140, height: 100, radius: 8,
              start: 0, end: 6, top: 0.5, direction: 'clockwise',
            });

            render(svg\`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="400" height="400">
                \${tool.render()}
                <path class="horseshoe-reference" d=\${horseshoePath.d} fill="none" stroke="#ef4444" stroke-width="1"></path>
              </svg>
            \`, document.querySelector('#fixture'));
            window.fixtureReady = true;
          </script>
        `,
      });
      return;
    }

    if (pathname === '/src/color-filter.js') {
      await route.fulfill({
        contentType: 'text/javascript',
        body: 'export default class ColorFilter { static applyToStyles(styles) { return styles; } }',
      });
      return;
    }

    const source = await readFile(new URL(`..${pathname}`, import.meta.url));
    await route.fulfill({ contentType: 'text/javascript', body: source });
  });

  await page.goto('http://fhs.test/polygon-tool-fixture');
  await page.waitForTimeout(500);
  const diagnostics = await page.evaluate(() => ({
    ready: window.fixtureReady === true,
    resources: performance.getEntriesByType('resource').map((entry) => entry.name),
  }));
  if (pageErrors.length) throw new Error(JSON.stringify({ pageErrors, diagnostics }, null, 2));
  if (!diagnostics.ready) throw new Error(JSON.stringify(diagnostics, null, 2));

  const paths = await page.evaluate(() => {
    const polygon = document.querySelector('.polygon-tool__border');
    const horseshoe = document.querySelector('.horseshoe-reference');
    const polygonBox = polygon.getBBox();
    const horseshoeBox = horseshoe.getBBox();

    return {
      samePath: polygon.getAttribute('d') === horseshoe.getAttribute('d'),
      polygonBox: { x: polygonBox.x, y: polygonBox.y, width: polygonBox.width, height: polygonBox.height },
      horseshoeBox: { x: horseshoeBox.x, y: horseshoeBox.y, width: horseshoeBox.width, height: horseshoeBox.height },
    };
  });

  expect(paths.samePath).toBe(true);
  expect(paths.polygonBox).toEqual(paths.horseshoeBox);
  await expect(page.locator('#fixture')).toHaveScreenshot('polygon-tool-horseshoe-overlay.png');
});
