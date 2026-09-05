import { readFile } from 'node:fs/promises';

import { expect, test } from '@playwright/test';

test('path features follow measured geometry on every supported path shape', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.route('http://fhs.test/**', async (route) => {
    const pathname = new URL(route.request().url()).pathname;

    if (pathname === '/path-feature-fixture') {
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
            import {
              buildArcPathDefinition,
              buildInfinityPathDefinition,
              buildLinePathDefinition,
              buildRectanglePathDefinition,
              buildSpiralPathDefinition,
              buildWavePathDefinition,
            } from '/src/path-generators.js';
            import PathGeometry from '/src/path-geometry.js';
            import { buildPathElements } from '/src/path-elements.js';
            import { renderPathElements } from '/src/path-elements-renderer.js';

            const definitions = [
              buildArcPathDefinition({ cx: 50, cy: 50, radiusX: 35, radiusY: 35, startAngle: -135, arcDegrees: 270 }),
              buildLinePathDefinition({ x1: 10, y1: 50, x2: 90, y2: 50 }),
              buildRectanglePathDefinition({
                x: 13, y: 13, width: 74, height: 74,
                radiusTopLeft: 9, radiusTopRight: 9, radiusBottomRight: 9, radiusBottomLeft: 9,
                start: 'top', direction: 'clockwise',
              }),
              buildWavePathDefinition({ x1: 10, y1: 50, x2: 90, y2: 50, waves: 2, amplitude: 15 }),
              buildSpiralPathDefinition({ cx: 50, cy: 50, radiusInner: 6, radiusOuter: 40, startAngle: -90, degrees: 720, points: 48 }),
              buildInfinityPathDefinition({ cx: 50, cy: 50, radiusX: 40, radiusY: 25 }),
            ];
            const positions = definitions.map((definition, index) => ({
              x: 10 + (index % 3) * 115,
              y: 10 + Math.floor(index / 3) * 125,
            }));
            const featureConfig = {
              ticks: [0, 12.5, 25, 50, 75, 100].map((progress, index) => ({
                id: \`tick-\${index}\`, layer: index % 2 === 0 ? 'major' : 'minor', progress,
                side: 'left', offset: 3, length: index % 2 === 0 ? 7 : 4,
                shape: index % 2 === 0 ? 'line' : 'circle', radius: 1.5,
                styles: { stroke: '#334155', fill: '#334155', 'stroke-width': 1 },
              })),
              labels: [
                {
                  id: 'horizontal', progress: 0, side: 'left', offset: 15, text: 'Start', orientation: 'horizontal', length: 32, samples: 9,
                  styles: { fill: '#0f172a', 'font-size': '6px', 'text-anchor': 'middle', 'dominant-baseline': 'central' },
                  badge: { visible: true, shape: 'circle', radius: 6, width: 0, height: 0, styles: { fill: '#e2e8f0' } },
                },
                {
                  id: 'path', progress: 50, side: 'right', offset: 13, text: 'Half', orientation: 'path', length: 34, samples: 11,
                  styles: { fill: '#0f172a', 'font-size': '6px', 'text-anchor': 'middle', 'dominant-baseline': 'central' },
                  badge: { visible: true, shape: 'capsule', radius: 3, width: 24, height: 9, styles: { fill: '#fef3c7' } },
                },
              ],
              markers: [
                { id: 'forward', progress: 0, side: 'right', offset: 6, direction: 'forward', shape: 'triangle', length: 9, width: 6, radius: 0, styles: { fill: '#dc2626' } },
                { id: 'crossing', progress: 50, side: 'right', offset: 6, direction: 'backward', shape: 'circle', length: 9, width: 6, radius: 2.5, styles: { fill: '#2563eb' } },
                { id: 'seam', progress: 100, side: 'right', offset: 6, direction: 'forward', shape: 'triangle', length: 9, width: 6, radius: 0, styles: { fill: '#16a34a' } },
              ],
            };

            render(svg\`
              <svg id="path-feature-showcase" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 250" width="700" height="500">
                <rect width="350" height="250" fill="white"></rect>
                \${definitions.map((definition, index) => svg\`
                  <g class="shape" data-index=\${index} transform="translate(\${positions[index].x} \${positions[index].y})">
                    <path class="master" d=\${definition.d} fill="none" stroke="#94a3b8" stroke-width="5"></path>
                    <g class="features"></g>
                  </g>
                \`)}
              </svg>
            \`, document.querySelector('#fixture'));

            const geometries = definitions.map((definition, index) => {
              const geometry = new PathGeometry(() => {});
              geometry.setPathDefinition(definition);
              geometry.bindPathElement(document.querySelector(\`.shape[data-index="\${index}"] .master\`));
              return geometry;
            });
            const layouts = geometries.map((geometry) => buildPathElements(geometry, featureConfig));
            const repeatedLayouts = geometries.map((geometry) => buildPathElements(geometry, featureConfig));

            layouts.forEach((layout, index) => {
              render(renderPathElements(layout, \`shape-\${index}\`), document.querySelector(\`.shape[data-index="\${index}"] .features\`));
            });

            window.pathFeatureFixture = { definitions, geometries, layouts, repeatedLayouts };
          </script>
        `,
      });
      return;
    }

    const source = await readFile(new URL(`..${pathname}`, import.meta.url));
    await route.fulfill({ contentType: 'text/javascript', body: source });
  });

  await page.goto('http://fhs.test/path-feature-fixture');
  await page.waitForTimeout(100);
  expect(pageErrors).toEqual([]);
  await expect.poll(() => page.evaluate(() => window.pathFeatureFixture !== undefined)).toBe(true);

  const result = await page.evaluate(() => {
    const { definitions, geometries, layouts, repeatedLayouts } = window.pathFeatureFixture;

    return layouts.map((layout, index) => {
      const geometry = geometries[index];
      const sourcePoint = geometry.pointAtProgress(25);
      const sourceNormal = geometry.normalAtProgress(25, 'left');
      const tick = layout.ticks.find((candidate) => candidate.progress === 25);
      const offsetVector = { x: tick.x1 - sourcePoint.x, y: tick.y1 - sourcePoint.y };
      const shape = document.querySelector(`.shape[data-index="${index}"]`);

      return {
        closed: definitions[index].closed,
        tickCount: layout.ticks.length,
        markerCount: layout.markers.length,
        labelCount: layout.labels.length,
        finite: [...layout.ticks, ...layout.labels, ...layout.markers].every((item) => (
          Number.isFinite(item.x ?? item.x1) && Number.isFinite(item.y ?? item.y1)
        )),
        normalOffset: offsetVector.x * sourceNormal.x + offsetVector.y * sourceNormal.y,
        repeatedLayoutMatches: JSON.stringify(layout) === JSON.stringify(repeatedLayouts[index]),
        horizontalTransform: shape.querySelector('.path-label[data-path-item-id="horizontal"]').getAttribute('transform'),
        guideLength: shape.querySelector('.path-label-guide').getTotalLength(),
        visibleBadgeCount: shape.querySelectorAll('.path-label-badge').length,
      };
    });
  });

  expect(result).toHaveLength(6);
  result.forEach((shape) => {
    expect(shape.tickCount).toBe(shape.closed ? 5 : 6);
    expect(shape.markerCount).toBe(shape.closed ? 2 : 3);
    expect(shape.labelCount).toBe(2);
    expect(shape.finite).toBe(true);
    expect(shape.normalOffset).toBeCloseTo(3, 5);
    expect(shape.repeatedLayoutMatches).toBe(true);
    expect(shape.horizontalTransform).toBeNull();
    expect(shape.guideLength).toBeGreaterThan(0);
    expect(shape.visibleBadgeCount).toBe(2);
  });

  const infinity = result[5];
  expect(infinity.closed).toBe(true);
  expect(infinity.markerCount).toBe(2);
});
