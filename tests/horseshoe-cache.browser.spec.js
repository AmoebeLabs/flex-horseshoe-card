import { readFile } from 'node:fs/promises';

import { expect, test } from '@playwright/test';

import { deliverHorseshoeState, loadHorseshoeCacheCard } from './horseshoe-cache-fixture.js';

test('moving gradients and markers keep browser samples and SVG output bounded', async ({ page }) => {
  const errors = await loadHorseshoeCacheCard(page, await readFile(new URL('../dist/flex-horseshoe-card.js', import.meta.url), 'utf8'));
  const result = await page.evaluate(() => {
    const { card } = window.horseshoeCache;
    return card.cardTools.getBySection('horseshoes').map((gauge) => {
      const geometry = gauge.pathGeometry;
      const fixed = geometry.activeMeasurement;
      const before = { points: fixed.points.size, tangents: fixed.tangents.size };
      const fullGeometry = gauge.scaleGradient.geometry;
      const stateRanges = gauge.stateGradient.ranges;
      const staticElements = gauge.pathElements;
      const master = geometry.getPathElement();
      const nativeLength = master.getTotalLength.bind(master);
      let lengthReads = 0;
      master.getTotalLength = () => { lengthReads += 1; return nativeLength(); };
      const mount = gauge.stateAnimator.stateLayerElement;
      const fixedPosition = geometry.pointAtProgress(25);
      let maximumNodeCount = 0;

      // Drive the actual gauge paint callback through distinct intermediate
      // positions, then repeat them. Old SVG children and samples must be released.
      for (let cycle = 0; cycle < 2; cycle += 1) {
        for (let index = 1; index <= 400; index += 1) {
          const progress = 0.1234567 + index * 0.24123456;
          gauge.stateAnimator.updateStateLayer(mount, progress);
          maximumNodeCount = Math.max(maximumNodeCount, mount.querySelectorAll('*').length);
        }
      }
      const temporaryCount = geometry.temporarySamples.points.size;
      const nativePoint = master.getPointAtLength.bind(master);
      let repeatedPointReads = 0;
      master.getPointAtLength = (distance) => { repeatedPointReads += 1; return nativePoint(distance); };
      gauge.stateAnimator.updateStateLayer(mount, 0.1234567 + 400 * 0.24123456);
      const after = { points: fixed.points.size, tangents: fixed.tangents.size };
      const nodesAfter = mount.querySelectorAll('*').length;
      gauge.disconnected();
      return {
        before, after, lengthReads, temporaryCount, repeatedPointReads,
        fullGeometryPreserved: gauge.scaleGradient.geometry === fullGeometry,
        fullGeometryShared: gauge.stateGradient.mode !== 'full' || gauge.stateGradient.geometry === fullGeometry,
        fullRangesPreserved: gauge.stateGradient.mode !== 'full' || gauge.stateGradient.ranges === stateRanges,
        staticElementsPreserved: gauge.pathElements === staticElements,
        fixedPositionPreserved: geometry.activeMeasurement.points.get(25) === fixedPosition,
        maximumNodeCount, nodesAfter,
        temporaryAfterDisconnect: geometry.temporarySamples.points.size + geometry.temporarySamples.tangents.size,
        frameAfterDisconnect: gauge.stateAnimator.frame,
      };
    });
  });
  result.forEach((gauge) => {
    expect(gauge.after).toEqual(gauge.before);
    expect(gauge.lengthReads).toBe(0);
    expect(gauge.repeatedPointReads).toBe(0);
    expect(gauge.temporaryCount).toBeLessThan(2000);
    expect(gauge.maximumNodeCount).toBeLessThan(2500);
    expect(gauge.nodesAfter).toBeGreaterThan(0);
    expect(gauge.fullGeometryPreserved).toBe(true);
    expect(gauge.fullGeometryShared).toBe(true);
    expect(gauge.fullRangesPreserved).toBe(true);
    expect(gauge.staticElementsPreserved).toBe(true);
    expect(gauge.fixedPositionPreserved).toBe(true);
    expect(gauge.temporaryAfterDisconnect).toBe(0);
    expect(gauge.frameAfterDisconnect).toBeUndefined();
  });
  expect(errors).toEqual([]);
});

test('real card updates, replacement and reconnect retain only the live animator', async ({ page }) => {
  const errors = await loadHorseshoeCacheCard(page, await readFile(new URL('../dist/flex-horseshoe-card.js', import.meta.url), 'utf8'));
  await deliverHorseshoeState(page, 80);
  await expect.poll(() => page.evaluate(() => window.horseshoeCache.card.cardTools.getBySection('horseshoes')
    .every((gauge) => gauge.stateAnimator.currentProgress === 80 && !gauge.stateAnimator.animating))).toBe(true);
  await deliverHorseshoeState(page, 0);
  await expect.poll(() => page.evaluate(() => window.horseshoeCache.card.cardTools.getBySection('horseshoes')
    .every((gauge) => gauge.stateAnimator.currentProgress === 0 && !gauge.stateAnimator.animating))).toBe(true);

  await page.evaluate(() => {
    const fixture = window.horseshoeCache;
    fixture.oldGauges = fixture.card.cardTools.getBySection('horseshoes');
    fixture.oldGauges.forEach((gauge) => gauge.stateAnimator.animateTo(75));
    fixture.card.setConfig(fixture.config);
    fixture.card.hass = fixture.hass;
  });
  await page.waitForFunction(() => window.horseshoeCache.card.cardTools.getBySection('horseshoes').every((gauge) => gauge.pathGeometry.isReady()));
  await deliverHorseshoeState(page, 60);
  await expect.poll(() => page.evaluate(() => window.horseshoeCache.card.cardTools.getBySection('horseshoes')
    .every((gauge) => gauge.stateAnimator.currentProgress === 60 && !gauge.stateAnimator.animating))).toBe(true);
  const lifetime = await page.evaluate(async () => {
    const fixture = window.horseshoeCache;
    const gauges = fixture.card.cardTools.getBySection('horseshoes');
    const measurements = gauges.map((gauge) => gauge.pathGeometry.activeMeasurement);
    gauges.forEach((gauge) => gauge.stateAnimator.animateTo(90));
    fixture.card.remove();
    const disconnected = gauges.every((gauge) => !gauge.stateAnimator.animating && gauge.stateAnimator.frame === undefined
      && gauge.stateAnimator.stateLayerElement === undefined && !gauge.pathGeometry.isReady());
    document.querySelector('#host').append(fixture.card);
    fixture.card.hass = fixture.hass;
    await fixture.card.updateComplete;
    await new Promise((done) => requestAnimationFrame(done));
    return {
      disconnected,
      oldOwnersReleased: fixture.oldGauges.every((gauge) => !gauge.stateAnimator.animating && gauge.stateAnimator.stateLayerElement === undefined),
      measurementsRetained: gauges.every((gauge, index) => gauge.pathGeometry.activeMeasurement === measurements[index]),
    };
  });
  expect(lifetime).toEqual({ disconnected: true, oldOwnersReleased: true, measurementsRetained: true });
  await deliverHorseshoeState(page, 35);
  await expect.poll(() => page.evaluate(() => window.horseshoeCache.card.cardTools.getBySection('horseshoes')
    .every((gauge) => gauge.stateAnimator.currentProgress === 35 && !gauge.stateAnimator.animating))).toBe(true);
  expect(errors).toEqual([]);
  await page.evaluate(() => window.horseshoeCache.card.remove());
});

test('late palette colors and theme mode changes repaint retained gradient geometry', async ({ page }) => {
  const errors = await loadHorseshoeCacheCard(page, await readFile(new URL('../dist/flex-horseshoe-card.js', import.meta.url), 'utf8'));
  let paletteRequest;
  await page.route('**/cache-palette.json', (route) => { paletteRequest = route; });
  await page.evaluate(() => {
    const fixture = window.horseshoeCache;
    fixture.card.setConfig({
      ...fixture.config,
      palettes: { cache: 'http://fhs.test/cache-palette.json' },
      layout: {
        horseshoes: fixture.config.layout.horseshoes.map((gauge) => ({
          ...gauge,
          color_stops: { colors: { 0: 'var(--fhs-cache-start)', 50: 'var(--fhs-cache-middle)', 100: 'var(--fhs-cache-end)' } },
        })),
      },
    });
    fixture.card.hass = fixture.hass;
  });
  await expect.poll(() => Boolean(paletteRequest)).toBe(true);
  await page.waitForFunction(() => window.horseshoeCache.card.cardTools.getBySection('horseshoes')
    .every((gauge) => gauge.pathGeometry.isReady() && gauge.stateGradient));
  await page.evaluate(() => {
    const fixture = window.horseshoeCache;
    fixture.fullGeometry = fixture.card.cardTools.getBySection('horseshoes')[0].stateGradient.geometry;
  });

  // Palette completion changes paint after measurement; it must retain the
  // prepared intervals even though their previously unresolved colors change.
  await paletteRequest.fulfill({
    contentType: 'application/json',
    json: {
      ref: {},
      modes: {
        light: { 'fhs-cache-start': '#13579b', 'fhs-cache-middle': '#22cc44', 'fhs-cache-end': '#ffd700' },
        dark: { 'fhs-cache-start': '#e65100', 'fhs-cache-middle': '#ffee00', 'fhs-cache-end': '#33bbff' },
      },
    },
  });
  await expect.poll(() => page.evaluate(() => {
    const stop = window.horseshoeCache.card.shadowRoot.querySelector('.horseshoe__state-gradient stop');
    return getComputedStyle(stop).stopColor;
  })).toBe('rgb(19, 87, 155)');

  await page.evaluate(() => {
    const fixture = window.horseshoeCache;
    fixture.hass = { ...fixture.hass, themes: { ...fixture.hass.themes, darkMode: true } };
    fixture.card.hass = fixture.hass;
  });
  await expect.poll(() => page.evaluate(() => {
    const stop = window.horseshoeCache.card.shadowRoot.querySelector('.horseshoe__state-gradient stop');
    return getComputedStyle(stop).stopColor;
  })).toBe('rgb(230, 81, 0)');
  expect(await page.evaluate(() => window.horseshoeCache.card.cardTools.getBySection('horseshoes')[0].stateGradient.geometry
    === window.horseshoeCache.fullGeometry)).toBe(true);
  expect(errors).toEqual([]);
  await page.evaluate(() => window.horseshoeCache.card.remove());
});
