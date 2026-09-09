import { readFile } from 'node:fs/promises';

import { expect, test } from '@playwright/test';

test('one animation progress drives state markers on every path shape', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.route('http://fhs.test/**', async (route) => {
    const pathname = new URL(route.request().url()).pathname;

    if (pathname === '/horseshoe-marker-fixture') {
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
            import HorseshoeStateMarker from '/src/horseshoe-marker.js';
            import PathStateAnimator from '/src/path-animator.js';
            import {
              buildArcPathDefinition,
              buildInfinityPathDefinition,
              buildLinePathDefinition,
              buildPolygonPathDefinition,
              buildRectanglePathDefinition,
              buildSpiralPathDefinition,
              buildWavePathDefinition,
            } from '/src/path-generators.js';
            import PathGeometry, { TransformedPathGeometry } from '/src/path-geometry.js';
            import { renderNormalizedPathBands } from '/src/path-mask-renderer.js';

            customElements.define('ha-icon', class extends HTMLElement {
              connectedCallback() {
                const source = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                source.path = 'M2 2h20v20H2z';
                source.setAttribute('viewBox', '0 0 24 24');
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', source.path);
                source.append(path);
                this.attachShadow({ mode: 'open' }).append(source);
              }
            });

            const definitions = [
              buildArcPathDefinition({ cx: 50, cy: 50, radiusX: 35, radiusY: 35, startAngle: -135, arcDegrees: 270 }),
              buildLinePathDefinition({ x1: 10, y1: 50, x2: 90, y2: 50 }),
              buildRectanglePathDefinition({
                cx: 50, cy: 50, width: 74, height: 64,
                radiusTopLeft: 8, radiusTopRight: 8, radiusBottomRight: 8, radiusBottomLeft: 8,
                start: 0, end: 4, top: 0.5, direction: 'clockwise',
              }),
              buildPolygonPathDefinition({
                cx: 50, cy: 50, width: 74, height: 74, sides: 6, radius: 4,
                start: 0, end: 6, top: 0.5, direction: 'clockwise',
              }),
              buildWavePathDefinition({ x1: 10, y1: 50, x2: 90, y2: 50, waves: 2, amplitude: 15 }),
              buildSpiralPathDefinition({ cx: 50, cy: 50, radiusInner: 6, radiusOuter: 40, startAngle: -90, degrees: 720, points: 48 }),
              buildInfinityPathDefinition({ cx: 50, cy: 50, radiusX: 40, radiusY: 25 }),
            ];
            const positions = definitions.map((definition, index) => ({
              x: 10 + (index % 4) * 110,
              y: 10 + Math.floor(index / 4) * 110,
            }));
            const card = { iconCache: {}, iconBoundsCache: {}, svgUrlCache: {}, requestUpdate() {} };
            const markerConfig = {
              attach_to: 'path', shape: 'circle', icon: undefined,
              rotate: 0, offset: 3, size: 8, aspectratio: 1, start_offset: 0, end_offset: 0,
            };
            const stateStyles = { fill: '#ef4444', stroke: '#7f1d1d', opacity: 0.9 };
            const stateLayerConfig = {
              opacity: 1, fillOpacity: 1, strokeOpacity: 1,
              border: { color: 'transparent', width: 0 },
            };

            render(svg\`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 220">
                \${definitions.map((definition, index) => svg\`
                  <g class="shape" data-index=\${index} transform="translate(\${positions[index].x} \${positions[index].y})">
                    <path class="background" d=\${definition.d} fill="none" stroke="#cbd5e1" stroke-width="8"></path>
                    <path class="master" d=\${definition.d} fill="none" stroke="transparent" stroke-width="0"></path>
                    <g class="state"></g>
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
              const marker = new HorseshoeStateMarker(card, \`marker-\${index}\`);
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
                  render(svg\`
                    \${renderNormalizedPathBands(definition, [range], stateLayerConfig, \`state-\${index}\`, 'state-progress')}
                    \${marker.render(geometry, definition, markerConfig, progress, stateStyles)}
                  \`, element);
                },
                onComplete: () => {},
              });
              animator.bindStateLayer(stateLayer);
              const initialMarker = stateLayer.querySelector('.horseshoe__state-marker');

              return {
                animator,
                geometry,
                initial: { x: Number(initialMarker.getAttribute('cx')), y: Number(initialMarker.getAttribute('cy')) },
                getMeasurementCount: () => measurementCount,
              };
            });

            fixtures.forEach((fixture) => fixture.animator.animateTo(80));

            // Render every supported path-marker source against the same measured
            // line. Cached sources avoid network and isolate source selection.
            card.iconCache['mdi:test-marker'] = 'M2 2h20v20H2z';
            card.iconBoundsCache['mdi:test-marker'] = { x: 2, y: 2, width: 20, height: 20 };
            const cachedSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            cachedSvg.setAttribute('viewBox', '0 0 24 24');
            const cachedSvgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            cachedSvgPath.setAttribute('d', 'M12 2L22 22H2z');
            cachedSvg.append(cachedSvgPath);
            card.svgUrlCache['/marker.svg'] = cachedSvg;
            const sourceConfigs = [
              { ...markerConfig, shape: 'circle' },
              { ...markerConfig, shape: 'triangle' },
              { ...markerConfig, shape: undefined, icon: 'mdi:test-marker' },
              { ...markerConfig, shape: undefined, icon: 'url(/marker.svg)' },
              { ...markerConfig, shape: undefined, icon: 'url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==)' },
            ];
            const sourceHost = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            sourceHost.id = 'marker-sources';
            document.querySelector('svg').append(sourceHost);
            render(svg\`
              \${sourceConfigs.map((config, index) => svg\`
                <g transform="translate(\${index * 20} 0)">
                  \${new HorseshoeStateMarker(card, \`source-\${index}\`).render(fixtures[1].geometry, definitions[1], config, 50, stateStyles)}
                </g>
              \`)}
            \`, sourceHost);

            // A center marker uses the transformed arc center and state point,
            // so item flips affect the complete pointer without mirrored text
            // or icon content.
            const centerHost = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            centerHost.id = 'center-marker';
            document.querySelector('svg').append(centerHost);
            const centerGeometry = new TransformedPathGeometry(fixtures[0].geometry, {
              a: -1, b: 0, c: 0, d: 1, e: 100, f: 0,
            });
            const centerConfig = {
              attach_to: 'center', shape: undefined, icon: 'mdi:test-marker',
              rotate: 15, offset: 0, size: undefined, aspectratio: 8, start_offset: 4, end_offset: -2,
            };
            render(svg\`
              \${new HorseshoeStateMarker(card, 'center-source').render(
                centerGeometry,
                { cx: 50, cy: 50 },
                centerConfig,
                80,
                stateStyles,
              )}
            \`, centerHost);

            // Exercise the real asynchronous MDI source route. The marker owns
            // a state-mount repaint because a normal card render does not own
            // the Lit tree inside that dedicated mount.
            const loadingHost = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            loadingHost.id = 'loading-marker';
            document.querySelector('svg').append(loadingHost);
            const loadingCard = {
              iconCache: {}, iconBoundsCache: {}, svgUrlCache: {}, shadowRoot: document,
              updateComplete: Promise.resolve(), requestUpdate() {},
            };
            const loadingConfig = { ...centerConfig, icon: 'mdi:loaded-marker' };
            let loadingMarker;
            const renderLoadedMarker = () => render(svg\`
              \${loadingMarker.render(
                centerGeometry,
                { cx: 50, cy: 50 },
                loadingConfig,
                80,
                stateStyles,
              )}
            \`, loadingHost);
            loadingMarker = new HorseshoeStateMarker(loadingCard, 'loading-source', renderLoadedMarker);
            renderLoadedMarker();

            window.markerFixture = { fixtures, centerGeometry };
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

  await page.goto('http://fhs.test/horseshoe-marker-fixture');
  await expect.poll(() => page.evaluate(() => window.markerFixture?.fixtures.every((fixture) => !fixture.animator.animating))).toBe(true);
  expect(pageErrors).toEqual([]);

  const result = await page.evaluate(() => window.markerFixture.fixtures.map((fixture, index) => {
    const marker = document.querySelector(`.shape[data-index="${index}"] .horseshoe__state-marker`);
    const expectedPoint = fixture.geometry.pointAtProgress(80);
    const expectedNormal = fixture.geometry.normalAtProgress(80, 'left');

    return {
      progress: fixture.animator.currentProgress,
      measurementCount: fixture.getMeasurementCount(),
      markerCount: document.querySelectorAll(`.shape[data-index="${index}"] .horseshoe__state-marker`).length,
      moved: Number(marker.getAttribute('cx')) !== fixture.initial.x || Number(marker.getAttribute('cy')) !== fixture.initial.y,
      x: Number(marker.getAttribute('cx')),
      y: Number(marker.getAttribute('cy')),
      expectedX: expectedPoint.x + expectedNormal.x * 3,
      expectedY: expectedPoint.y + expectedNormal.y * 3,
      fill: marker.style.fill,
      dashArray: document.querySelector(`.shape[data-index="${index}"] .state-progress__fill-stroke__body`).getAttribute('stroke-dasharray'),
    };
  }));

  expect(result).toHaveLength(7);
  result.forEach((shape) => {
    expect(shape.progress).toBe(80);
    expect(shape.measurementCount).toBe(1);
    expect(shape.markerCount).toBe(1);
    expect(shape.moved).toBe(true);
    expect(shape.x).toBeCloseTo(shape.expectedX, 5);
    expect(shape.y).toBeCloseTo(shape.expectedY, 5);
    expect(shape.fill).toBe('rgb(239, 68, 68)');
    expect(shape.dashArray).toBe('80 100');
  });

  const sources = await page.evaluate(() => ({
    circles: document.querySelectorAll('#marker-sources .horseshoe__state-marker--circle').length,
    triangles: document.querySelectorAll('#marker-sources .horseshoe__state-marker--triangle').length,
    haIcons: document.querySelectorAll('#marker-sources .horseshoe__state-marker--ha-icon').length,
    svgIcons: document.querySelectorAll('#marker-sources .horseshoe__state-marker--svg').length,
    images: document.querySelectorAll('#marker-sources .horseshoe__state-marker--image').length,
    haIconTransform: document.querySelector('#marker-sources .horseshoe__state-marker--ha-icon')?.getAttribute('transform'),
    imageAspectRatio: document.querySelector('#marker-sources .horseshoe__state-marker--image')?.getAttribute('preserveAspectRatio'),
  }));

  expect(sources.circles).toBe(1);
  expect(sources.triangles).toBe(1);
  expect(sources.haIcons).toBe(1);
  expect(sources.svgIcons).toBe(1);
  expect(sources.images).toBe(1);
  expect(sources.imageAspectRatio).toBe('none');
  expect(sources.haIconTransform).toContain(`scale(${8 / 24} ${8 / 24}) translate(-12 -12)`);

  const centerMarker = await page.evaluate(() => {
    const center = window.markerFixture.centerGeometry.pointInCardCoordinates({ x: 50, y: 50 });
    const statePoint = window.markerFixture.centerGeometry.pointAtProgress(80);
    const deltaX = statePoint.x - center.x;
    const deltaY = statePoint.y - center.y;
    const distance = Math.hypot(deltaX, deltaY);
    const directionX = deltaX / distance;
    const directionY = deltaY / distance;
    const start = { x: center.x + directionX * 4, y: center.y + directionY * 4 };
    const end = { x: statePoint.x + directionX * -2, y: statePoint.y + directionY * -2 };
    const marker = document.querySelector('#center-marker .horseshoe__state-marker');

    return {
      transform: marker.getAttribute('transform'),
      expectedX: (start.x + end.x) / 2,
      expectedY: (start.y + end.y) / 2,
      expectedRotation: Math.atan2(directionY, directionX) * 180 / Math.PI + 15,
      expectedScaleX: Math.hypot(end.x - start.x, end.y - start.y) / 20,
      expectedScaleY: Math.hypot(end.x - start.x, end.y - start.y) / 20 / 8,
      fill: marker.style.fill,
    };
  });
  const transformValues = centerMarker.transform.match(/translate\(([-\d.]+) ([-\d.]+)\) rotate\(([-\d.]+)\) scale\(([-\d.]+) ([-\d.]+)\)/);

  expect(Number(transformValues[1])).toBeCloseTo(centerMarker.expectedX, 5);
  expect(Number(transformValues[2])).toBeCloseTo(centerMarker.expectedY, 5);
  expect(Number(transformValues[3])).toBeCloseTo(centerMarker.expectedRotation, 5);
  expect(Number(transformValues[4])).toBeCloseTo(centerMarker.expectedScaleX, 5);
  expect(Number(transformValues[5])).toBeCloseTo(centerMarker.expectedScaleY, 5);
  expect(centerMarker.fill).toBe('rgb(239, 68, 68)');

  await expect.poll(() => page.locator('#loading-marker .horseshoe__state-marker--ha-icon').count()).toBe(1);
  expect(await page.locator('#loading-marker foreignObject').count()).toBe(0);
});
