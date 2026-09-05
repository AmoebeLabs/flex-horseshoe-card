import { readFile } from 'node:fs/promises';

import { expect, test } from '@playwright/test';

test('generic renderer paints the same normalized ranges on every path shape', async ({ page }) => {
  await page.route('http://fhs.test/**', async (route) => {
    const pathname = new URL(route.request().url()).pathname;

    if (pathname === '/fixture') {
      await route.fulfill({
        contentType: 'text/html',
        body: `
          <div id="fixture"></div>
          <script type="importmap">
            {
              "imports": {
                "lit": "/node_modules/lit/index.js",
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
            import {
              buildArcPathDefinition,
              buildLinePathDefinition,
              buildRectanglePathDefinition,
              buildWavePathDefinition,
            } from '/src/path-generators.js';
            import { renderPathStrokeLayers } from '/src/path-renderer.js';

            const definitions = [
              buildArcPathDefinition({
                cx: 50, cy: 50, radiusX: 35, radiusY: 35,
                startAngle: 0, arcDegrees: 270,
              }),
              buildLinePathDefinition({ x1: 10, y1: 50, x2: 90, y2: 50 }),
              buildRectanglePathDefinition({
                x: 15, y: 15, width: 70, height: 70,
                radiusTopLeft: 8, radiusTopRight: 8,
                radiusBottomRight: 8, radiusBottomLeft: 8,
                start: 'top', direction: 'clockwise',
              }),
              buildWavePathDefinition({
                x1: 10, y1: 50, x2: 90, y2: 50,
                waves: 2, amplitude: 12,
              }),
            ];
            const background = {
              color: '#444444', width: 10, opacity: 1, linecap: 'butt',
            };
            const ranges = [
              {
                id: 'low', color: '#00aa00', width: 8, opacity: 1,
                startCap: 'butt', endCap: 'butt',
                dash: { array: [35, 100], offset: 0 },
              },
              {
                id: 'high', color: '#cc0000', width: 8, opacity: 1,
                startCap: 'butt', endCap: 'butt',
                dash: { array: [35, 100], offset: -40 },
              },
            ];

            render(svg\`
              <svg viewBox="0 0 220 220" width="440" height="440">
                \${definitions.map((definition, index) => svg\`
                  <g class="shape" data-index=\${index}
                    transform="translate(\${(index % 2) * 110} \${Math.floor(index / 2) * 110})">
                    \${renderPathStrokeLayers(definition, background, ranges, \`shape-\${index}\`)}
                  </g>
                \`)}
              </svg>
            \`, document.querySelector('#fixture'));
            window.fixtureReady = true;
          </script>
        `,
      });
      return;
    }

    const source = await readFile(new URL(`..${pathname}`, import.meta.url));
    await route.fulfill({ contentType: 'text/javascript', body: source });
  });

  await page.goto('http://fhs.test/fixture');
  await page.waitForFunction(() => window.fixtureReady === true);

  const renderedShapes = await page.evaluate(() => [...document.querySelectorAll('.shape')].map((shape) => {
    const master = shape.querySelector('.path-stroke-renderer__master');
    const background = shape.querySelector('.path-stroke-renderer__background');
    const ranges = [...shape.querySelectorAll('.path-stroke-renderer__range')];
    const totalLength = master.getTotalLength();
    const pointAt = (progress) => master.getPointAtLength((progress / 100) * totalLength);
    const isPaintedAt = (path, progress) => path.isPointInStroke(pointAt(progress));

    return {
      sameCenterline: [background, ...ranges].every((path) => path.getAttribute('d') === master.getAttribute('d')),
      normalized: [master, background, ...ranges].every((path) => path.getAttribute('pathLength') === '100'),
      backgroundAtGap: isPaintedAt(background, 37.5),
      low: [20, 37.5, 50, 80].map((progress) => isPaintedAt(ranges[0], progress)),
      high: [20, 37.5, 50, 80].map((progress) => isPaintedAt(ranges[1], progress)),
    };
  }));

  expect(renderedShapes).toHaveLength(4);
  renderedShapes.forEach((shape) => {
    expect(shape).toEqual({
      sameCenterline: true,
      normalized: true,
      backgroundAtGap: true,
      low: [true, false, false, false],
      high: [false, false, true, false],
    });
  });
});
