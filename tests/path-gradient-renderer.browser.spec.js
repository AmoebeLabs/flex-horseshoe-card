import { readFile } from 'node:fs/promises';

import { expect, test } from '@playwright/test';

test('adaptive gradients remain continuous and bounded on every path geometry', async ({ page }) => {
  await page.route('http://fhs.test/**', async (route) => {
    const pathname = new URL(route.request().url()).pathname;

    if (pathname === '/gradient-fixture') {
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
              buildInfinityPathDefinition,
              buildLinePathDefinition,
              buildRectanglePathDefinition,
              buildSpiralPathDefinition,
              buildWavePathDefinition,
            } from '/src/path-generators.js';
            import PathGeometry from '/src/path-geometry.js';
            import { buildAdaptivePathGradient, renderAdaptivePathGradient } from '/src/path-gradient-renderer.js';

            const definitions = [
              buildArcPathDefinition({
                cx: 50, cy: 50, radiusX: 38, radiusY: 38,
                startAngle: 0, arcDegrees: 270,
              }),
              buildLinePathDefinition({ x1: 10, y1: 50, x2: 90, y2: 50 }),
              buildRectanglePathDefinition({
                x: 12, y: 12, width: 76, height: 76,
                radiusTopLeft: 8, radiusTopRight: 8,
                radiusBottomRight: 8, radiusBottomLeft: 8,
                start: 'top', direction: 'clockwise',
              }),
              buildWavePathDefinition({
                x1: 10, y1: 50, x2: 90, y2: 50,
                waves: 2, amplitude: 18,
              }),
              buildSpiralPathDefinition({
                cx: 50, cy: 50, radiusInner: 6, radiusOuter: 42,
                startAngle: -90, degrees: 720, points: 48,
              }),
              buildInfinityPathDefinition({
                cx: 50, cy: 50, radiusX: 42, radiusY: 27,
              }),
            ];
            const positions = definitions.map((definition, index) => ({
              x: 10 + (index % 3) * 110,
              y: 10 + Math.floor(index / 3) * 110,
            }));
            const config = {
              mode: 'full',
              range: { start: 0, end: 75 },
              colorStops: [
                { progress: 0, color: '#ef4444' },
                { progress: 35, color: '#facc15' },
                { progress: 70, color: '#22c55e' },
                { progress: 100, color: '#3b82f6' },
              ],
              width: 9,
              startCap: 'round',
              endCap: 'round',
              maxSegmentLength: 6,
              minSegmentLength: 1,
              maxTangentAngle: 8,
              maxSegments: 96,
              overlap: 0.5,
            };
            const layer = {
              opacity: 0.72,
              fillOpacity: 1,
              strokeOpacity: 1,
              border: { color: '#111827', width: 0 },
            };

            render(svg\`
              <svg id="gradient-showcase" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 230" width="680" height="460">
                \${definitions.map((definition, index) => svg\`
                  <g class="shape" data-index=\${index} transform="translate(\${positions[index].x} \${positions[index].y})">
                    <path class="master" d=\${definition.d} pathLength="100" fill="none" stroke="transparent"></path>
                    <g class="paint"></g>
                  </g>
                \`)}
              </svg>
            \`, document.querySelector('#fixture'));

            const buildStarted = performance.now();
            const gradients = definitions.map((definition, index) => {
              const geometry = new PathGeometry(() => {});
              geometry.setPathDefinition(definition);
              geometry.bindPathElement(document.querySelector(\`.shape[data-index="\${index}"] .master\`));
              return buildAdaptivePathGradient(geometry, config);
            });
            const buildDuration = performance.now() - buildStarted;
            const renderStarted = performance.now();

            gradients.forEach((gradient, index) => {
              render(
                renderAdaptivePathGradient(definitions[index], gradient, layer, \`gradient-\${index}\`, 'path-gradient'),
                document.querySelector(\`.shape[data-index="\${index}"] .paint\`),
              );
            });

            const renderDuration = performance.now() - renderStarted;
            const frameStarted = performance.now();
            await new Promise((resolve) => requestAnimationFrame(resolve));
            const frameDuration = performance.now() - frameStarted;

            window.gradientFixture = {
              definitions,
              gradients,
              positions,
              metrics: {
                buildDuration,
                renderDuration,
                frameDuration,
                nodeCount: document.querySelectorAll('#gradient-showcase *').length,
                segmentCounts: gradients.map((gradient) => gradient.ranges.length),
              },
            };
          </script>
        `,
      });
      return;
    }

    const source = await readFile(new URL(`..${pathname}`, import.meta.url), 'utf8');

    if (pathname === '/src/path-gradient-renderer.js') {
      const browserColorInterpolation = `
        const Colors = {
          calculateStrokeColor(progress, colorStops) {
            const stops = colorStops.colors;
            if (progress <= stops[0].value) return stops[0].color;
            if (progress >= stops[stops.length - 1].value) return stops[stops.length - 1].color;
            const endIndex = stops.findIndex((stop) => progress < stop.value);
            const start = stops[endIndex - 1];
            const end = stops[endIndex];
            const ratio = (progress - start.value) / (end.value - start.value);
            const channels = [1, 3, 5].map((offset) => Math.floor(
              Number.parseInt(start.color.slice(offset, offset + 2), 16) * (1 - ratio)
              + Number.parseInt(end.color.slice(offset, offset + 2), 16) * ratio,
            ));
            return \`rgb(\${channels.join(',')})\`;
          },
        };
      `;
      await route.fulfill({
        contentType: 'text/javascript',
        body: source.replace("import Colors from './colors.js';", browserColorInterpolation),
      });
      return;
    }

    await route.fulfill({ contentType: 'text/javascript', body: source });
  });

  await page.goto('http://fhs.test/gradient-fixture');
  await page.waitForFunction(() => window.gradientFixture !== undefined);

  const result = await page.evaluate(async () => {
    const { gradients, positions, metrics } = window.gradientFixture;
    const sourceSvg = document.querySelector('#gradient-showcase');
    const image = new Image();
    const loaded = new Promise((resolve, reject) => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', reject, { once: true });
    });
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sourceSvg.outerHTML)}`;
    await loaded;

    const canvas = document.createElement('canvas');
    canvas.width = 340;
    canvas.height = 230;
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const paintedSamples = [...document.querySelectorAll('.shape')].map((shape, index) => {
      const master = shape.querySelector('.master');
      const totalLength = master.getTotalLength();
      return Array.from({ length: 73 }, (_, sampleIndex) => {
        const point = master.getPointAtLength(((sampleIndex + 1) / 100) * totalLength);
        const pixel = context.getImageData(Math.round(point.x + positions[index].x), Math.round(point.y + positions[index].y), 1, 1).data;
        return pixel[0] < 245 || pixel[1] < 245 || pixel[2] < 245;
      });
    });
    const infinityOrder = [...document.querySelectorAll('.shape[data-index="5"] .path-gradient__band__fill')]
      .map((range) => Number(range.dataset.pathRange.replace('gradient-', '')));

    return {
      metrics,
      allSamplesPainted: paintedSamples.map((samples) => samples.every(Boolean)),
      infinityOrder,
      allRangeOpacitiesAreOne: gradients.every((gradient) => gradient.ranges.every((range) => range.opacity === 1)),
    };
  });

  expect(result.allSamplesPainted).toEqual([true, true, true, true, true, true]);
  expect(result.allRangeOpacitiesAreOne).toBe(true);
  expect(result.infinityOrder).toEqual([...result.infinityOrder].sort((valueA, valueB) => valueA - valueB));
  expect(Math.max(...result.metrics.segmentCounts)).toBeLessThanOrEqual(96);
  expect(result.metrics.nodeCount).toBeLessThan(5000);
  expect(result.metrics.buildDuration).toBeLessThan(250);
  expect(result.metrics.renderDuration).toBeLessThan(100);
  expect(result.metrics.frameDuration).toBeLessThan(100);
});
