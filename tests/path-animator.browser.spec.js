import { readFile } from 'node:fs/promises';

import { expect, test } from '@playwright/test';

test('state animation preserves measured geometry and every static path layer', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.route('http://fhs.test/**', async (route) => {
    const pathname = new URL(route.request().url()).pathname;

    if (pathname === '/path-animation-fixture') {
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
            import PathStateAnimator from '/src/path-animator.js';
            import { buildPathElements } from '/src/path-elements.js';
            import { renderPathElements } from '/src/path-elements-renderer.js';
            import {
              buildArcPathDefinition,
              buildInfinityPathDefinition,
              buildLinePathDefinition,
              buildRectanglePathDefinition,
              buildSpiralPathDefinition,
              buildWavePathDefinition,
            } from '/src/path-generators.js';
            import PathGeometry from '/src/path-geometry.js';
            import { renderNormalizedPathBands } from '/src/path-mask-renderer.js';

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
              x: 10 + (index % 3) * 110,
              y: 10 + Math.floor(index / 3) * 110,
            }));
            const featureConfig = {
              ticks: [
                { id: 'tick', layer: 'major', progress: 50, side: 'left', offset: 3, length: 6, shape: 'line', radius: 0, styles: { stroke: '#0f172a' } },
              ],
              labels: [
                {
                  id: 'label', progress: 50, side: 'left', offset: 13, text: '50', orientation: 'horizontal', length: 24, samples: 7,
                  styles: { fill: '#0f172a', 'font-size': '6px' },
                  badge: { visible: false, shape: 'circle', radius: 0, width: 0, height: 0, styles: { fill: 'none' } },
                },
              ],
              markers: [],
            };
            const stateLayerConfig = {
              opacity: 0.75,
              fillOpacity: 1,
              strokeOpacity: 1,
              border: { color: '#0f172a', width: 1 },
            };

            render(svg\`
              <svg id="path-animation-showcase" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 220">
                \${definitions.map((definition, index) => svg\`
                  <g class="shape" data-index=\${index} transform="translate(\${positions[index].x} \${positions[index].y})">
                    <path class="background" d=\${definition.d} fill="none" stroke="#cbd5e1" stroke-width="8"></path>
                    <path class="master" d=\${definition.d} fill="none" stroke="transparent" stroke-width="0" visibility="hidden"></path>
                    <g class="state"></g>
                    <g class="features"></g>
                  </g>
                \`)}
              </svg>
            \`, document.querySelector('#fixture'));

            const fixtures = definitions.map((definition, index) => {
              const shape = document.querySelector(\`.shape[data-index="\${index}"]\`);
              const master = shape.querySelector('.master');
              const nativeGetTotalLength = master.getTotalLength.bind(master);
              let measurementCount = 0;
              master.getTotalLength = () => {
                measurementCount += 1;
                return nativeGetTotalLength();
              };

              const geometry = new PathGeometry(() => {});
              geometry.setPathDefinition(definition);
              geometry.bindPathElement(master);
              render(renderPathElements(buildPathElements(geometry, featureConfig), \`animation-feature-\${index}\`), shape.querySelector('.features'));

              const stateLayer = shape.querySelector('.state');
              const animator = new PathStateAnimator({
                animation: { enabled: true, duration: 60, easing: 'linear' },
                initialProgress: 20,
                requestFrame: window.requestAnimationFrame.bind(window),
                cancelFrame: window.cancelAnimationFrame.bind(window),
                updateStateLayer: (element, progress) => {
                  const range = {
                    id: 'state', start: 0, end: progress, length: progress,
                    color: '#2563eb', width: 6, opacity: 1,
                    startCap: 'round', endCap: 'round',
                    dash: { array: [progress, 100], offset: 0 },
                  };
                  render(
                    renderNormalizedPathBands(definition, [range], stateLayerConfig, \`animation-state-\${index}\`, 'path-animation-state'),
                    element,
                  );
                },
                onComplete: () => {},
              });
              animator.bindStateLayer(stateLayer);

              return {
                animator,
                geometry,
                getMeasurementCount: () => measurementCount,
                nodes: {
                  master,
                  background: shape.querySelector('.background'),
                  features: shape.querySelector('.path-tick-label-badge-marker'),
                  stateBody: shape.querySelector('.path-animation-state__fill-stroke__body'),
                },
              };
            });

            fixtures.forEach((fixture) => fixture.animator.animateTo(80));
            window.pathAnimationFixture = { fixtures };
          </script>
        `,
      });
      return;
    }

    const source = await readFile(new URL(`..${pathname}`, import.meta.url), 'utf8');

    if (pathname === '/src/path-animator.js') {
      await route.fulfill({
        contentType: 'text/javascript',
        body: source.replace(
          "import { clamp } from './frontend_mods/common/number/clamp.ts';",
          'const clamp = (value, lower, upper) => Math.min(upper, Math.max(lower, value));',
        ),
      });
      return;
    }

    await route.fulfill({ contentType: 'text/javascript', body: source });
  });

  await page.goto('http://fhs.test/path-animation-fixture');
  await page.waitForTimeout(100);
  expect(pageErrors).toEqual([]);
  await expect.poll(() => page.evaluate(() => window.pathAnimationFixture?.fixtures.every((fixture) => !fixture.animator.animating))).toBe(true);

  await page.evaluate(() => window.pathAnimationFixture.fixtures.forEach((fixture) => fixture.animator.animateTo(35)));
  await expect.poll(() => page.evaluate(() => window.pathAnimationFixture.fixtures.every((fixture) => !fixture.animator.animating))).toBe(true);

  const result = await page.evaluate(() => window.pathAnimationFixture.fixtures.map((fixture, index) => {
    const shape = document.querySelector(`.shape[data-index="${index}"]`);
    const stateBody = shape.querySelector('.path-animation-state__fill-stroke__body');

    return {
      progress: fixture.animator.currentProgress,
      measurementCount: fixture.getMeasurementCount(),
      masterPreserved: fixture.nodes.master === shape.querySelector('.master'),
      backgroundPreserved: fixture.nodes.background === shape.querySelector('.background'),
      featuresPreserved: fixture.nodes.features === shape.querySelector('.path-tick-label-badge-marker'),
      stateBodyPreserved: fixture.nodes.stateBody === stateBody,
      dashArray: stateBody.getAttribute('stroke-dasharray'),
      geometryReady: fixture.geometry.isReady(),
    };
  }));

  expect(result).toHaveLength(6);
  result.forEach((shape) => {
    expect(shape.progress).toBe(35);
    expect(shape.measurementCount).toBe(1);
    expect(shape.masterPreserved).toBe(true);
    expect(shape.backgroundPreserved).toBe(true);
    expect(shape.featuresPreserved).toBe(true);
    expect(shape.stateBodyPreserved).toBe(true);
    expect(shape.dashArray).toBe('35 100');
    expect(shape.geometryReady).toBe(true);
  });
});
