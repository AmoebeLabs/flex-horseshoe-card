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
              color: '#444444', width: 10,
              opacity: 1, fillOpacity: 1, strokeOpacity: 1,
              border: { color: '#222222', width: 1 },
              startCap: 'butt', endCap: 'butt',
            };
            const foreground = {
              opacity: 1, fillOpacity: 0.25, strokeOpacity: 1,
              border: { color: '#000000', width: 2 },
            };
            const ranges = [
              {
                id: 'low', start: 0, end: 35, color: '#00aa00', width: 8,
                opacity: 1,
                startCap: 'round', endCap: 'butt',
                dash: { array: [35, 100], offset: 0 },
              },
              {
                id: 'high', start: 40, end: 75, color: '#cc0000', width: 8,
                opacity: 1,
                startCap: 'butt', endCap: 'round',
                dash: { array: [35, 100], offset: -40 },
              },
            ];
            const capCombinations = [
              { id: 'butt-butt', startCap: 'butt', endCap: 'butt' },
              { id: 'round-round', startCap: 'round', endCap: 'round' },
              { id: 'round-butt', startCap: 'round', endCap: 'butt' },
              { id: 'butt-round', startCap: 'butt', endCap: 'round' },
            ];
            const overlapBackground = {
              color: 'transparent', width: 0,
              opacity: 1, fillOpacity: 1, strokeOpacity: 1,
              border: { color: 'transparent', width: 0 },
              startCap: 'butt', endCap: 'butt',
            };
            const overlapForeground = {
              opacity: 1, fillOpacity: 0.25, strokeOpacity: 1,
              border: { color: 'transparent', width: 0 },
            };
            const overlapDefinition = buildLinePathDefinition({ x1: 10, y1: 0, x2: 210, y2: 0 });
            const overlapRanges = [
              {
                id: 'first', start: 0, end: 51, color: '#00aa00', width: 8,
                opacity: 1,
                startCap: 'butt', endCap: 'butt', dash: { array: [51, 100], offset: 0 },
              },
              {
                id: 'second', start: 49, end: 100, color: '#00aa00', width: 8,
                opacity: 1,
                startCap: 'butt', endCap: 'butt', dash: { array: [51, 100], offset: -49 },
              },
            ];

            render(svg\`
              <svg viewBox="0 0 220 240" width="220" height="240">
                \${definitions.map((definition, index) => svg\`
                  <g class="shape" data-index=\${index}
                    transform="translate(\${(index % 2) * 110} \${Math.floor(index / 2) * 110})">
                    \${renderPathStrokeLayers(definition, background, foreground, ranges, \`shape-\${index}\`)}
                  </g>
                \`)}
                <g class="opacity-overlap" transform="translate(0 225)">
                  \${renderPathStrokeLayers(
                    overlapDefinition,
                    overlapBackground,
                    overlapForeground,
                    overlapRanges,
                    'opacity-overlap',
                  )}
                </g>
                <g class="cap-contracts" visibility="hidden">
                  \${definitions.map((definition, shapeIndex) => capCombinations.map((combination) => svg\`
                    <g class="cap-contract" data-shape=\${shapeIndex} data-combination=\${combination.id}>
                      \${renderPathStrokeLayers(
                        definition,
                        background,
                        foreground,
                        [{
                          id: combination.id,
                          start: 20,
                          end: 80,
                          color: '#00aa00',
                          width: 8,
                          opacity: 1,
                          startCap: combination.startCap,
                          endCap: combination.endCap,
                          dash: { array: [60, 100], offset: -20 },
                        }],
                        \`cap-\${shapeIndex}-\${combination.id}\`,
                      )}
                    </g>
                  \`))}
                </g>
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
    const background = shape.querySelector('.path-stroke-renderer__background-band__fill-stroke__body');
    const ranges = [...shape.querySelectorAll('.path-stroke-renderer__range-band__fill-stroke__body')];
    const lowStartCap = shape.querySelector('.path-stroke-renderer__range-band__fill-stroke__cap--start');
    const highEndCap = shape.querySelector('.path-stroke-renderer__range-band__fill-stroke__cap--end');
    const renderedPaths = [...shape.querySelectorAll('path')];
    const totalLength = master.getTotalLength();
    const pointAt = (progress) => master.getPointAtLength((progress / 100) * totalLength);
    const isPaintedAt = (path, progress) => path.isPointInStroke(pointAt(progress));

    return {
      sameCenterline: renderedPaths.every((path) => path.getAttribute('d') === master.getAttribute('d')),
      normalized: renderedPaths.every((path) => path.getAttribute('pathLength') === '100'),
      backgroundAtGap: isPaintedAt(background, 37.5),
      low: [20, 37.5, 50, 80].map((progress) => isPaintedAt(ranges[0], progress)),
      high: [20, 37.5, 50, 80].map((progress) => isPaintedAt(ranges[1], progress)),
      lowStartCap: isPaintedAt(lowStartCap, 0),
      highEndCap: isPaintedAt(highEndCap, 75),
      fillCapCount: shape.querySelectorAll('.path-stroke-renderer__range-band__fill-stroke__cap').length,
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
      lowStartCap: true,
      highEndCap: true,
      fillCapCount: 2,
    });
  });

  const capContracts = await page.evaluate(() => [...document.querySelectorAll('.cap-contract')].map((contract) => {
    const master = contract.querySelector('.path-stroke-renderer__master');
    const capPaths = [...contract.querySelectorAll('.path-stroke-renderer__range-band__fill-stroke__cap')];
    const totalLength = master.getTotalLength();
    const pointAt = (progress) => master.getPointAtLength((progress / 100) * totalLength);

    return {
      combination: contract.dataset.combination,
      capCount: capPaths.length,
      startPainted: capPaths.some((path) => path.isPointInStroke(pointAt(20))),
      endPainted: capPaths.some((path) => path.isPointInStroke(pointAt(80))),
    };
  }));

  expect(capContracts).toHaveLength(16);
  capContracts.forEach((contract) => {
    const expected = {
      'butt-butt': { capCount: 0, startPainted: false, endPainted: false },
      'round-round': { capCount: 2, startPainted: true, endPainted: true },
      'round-butt': { capCount: 1, startPainted: true, endPainted: false },
      'butt-round': { capCount: 1, startPainted: false, endPainted: true },
    }[contract.combination];

    expect(contract).toEqual({ combination: contract.combination, ...expected });
  });

  const linePixels = await page.evaluate(async () => {
    const sourceSvg = document.querySelector('#fixture > svg');
    const image = new Image();
    const imageLoaded = new Promise((resolve, reject) => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', reject, { once: true });
    });
    const standaloneSvg = sourceSvg.outerHTML.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
    const imageUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(standaloneSvg)}`;
    image.src = imageUrl;
    await imageLoaded;

    const canvas = document.createElement('canvas');
    canvas.width = 220;
    canvas.height = 240;
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 220, 240);
    context.drawImage(image, 0, 0, 220, 240);
    const pixel = (x, y) => [...context.getImageData(x, y, 1, 1).data];
    return {
      roundCapOverlap: pixel(121, 50),
      transparentFill: pixel(140, 50),
      border: pixel(140, 45),
      outside: pixel(140, 42),
      gradientSegment: pixel(60, 225),
      gradientOverlap: pixel(110, 225),
    };
  });

  expect(linePixels.roundCapOverlap).toEqual(linePixels.transparentFill);
  expect(linePixels.transparentFill[0]).toBeGreaterThan(40);
  expect(linePixels.transparentFill[1]).toBeGreaterThan(85);
  expect(linePixels.border[0]).toBeLessThan(25);
  expect(linePixels.border[1]).toBeLessThan(25);
  expect(linePixels.outside).toEqual([255, 255, 255, 255]);
  expect(linePixels.gradientOverlap).toEqual(linePixels.gradientSegment);
});
