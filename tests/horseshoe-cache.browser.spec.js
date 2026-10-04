import { readFile } from 'node:fs/promises';

import { expect, test } from '@playwright/test';

import { deliverHorseshoeState, loadHorseshoeCacheCard } from './horseshoe-cache-fixture.js';

test('moving gradients and markers keep browser samples and SVG output bounded', async ({ page }) => {
  const errors = await loadHorseshoeCacheCard(page, await readFile(new URL('../dist/flex-horseshoe-card.js', import.meta.url), 'utf8'));
  const result = await page.evaluate(() => {
    const { card } = window.horseshoeCache;
    return card.cardTools.getBySection('horseshoes').map((gauge) => {
      const geometry = gauge.geometry.pathGeometry;
      const fixed = geometry.activeMeasurement;
      const before = { points: fixed.points.size, tangents: fixed.tangents.size };
      const fullGeometry = gauge.paint.scaleGradient.geometry;
      const stateRanges = gauge.paint.stateGradient.ranges;
      const staticElements = gauge.geometry.pathElements;
      const master = geometry.pathElement;
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
        fullGeometryPreserved: gauge.paint.scaleGradient.geometry === fullGeometry,
        fullGeometryShared: gauge.paint.stateGradient.mode !== 'full' || gauge.paint.stateGradient.geometry === fullGeometry,
        fullRangesPreserved: gauge.paint.stateGradient.mode !== 'full' || gauge.paint.stateGradient.ranges === stateRanges,
        staticElementsPreserved: gauge.geometry.pathElements === staticElements,
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
  await page.waitForFunction(() => window.horseshoeCache.card.cardTools.getBySection('horseshoes').every((gauge) => gauge.geometry.pathGeometry.isReady()));
  await deliverHorseshoeState(page, 60);
  await expect.poll(() => page.evaluate(() => window.horseshoeCache.card.cardTools.getBySection('horseshoes')
    .every((gauge) => gauge.stateAnimator.currentProgress === 60 && !gauge.stateAnimator.animating))).toBe(true);
  const lifetime = await page.evaluate(async () => {
    const fixture = window.horseshoeCache;
    const gauges = fixture.card.cardTools.getBySection('horseshoes');
    const measurements = gauges.map((gauge) => gauge.geometry.pathGeometry.activeMeasurement);
    gauges.forEach((gauge) => gauge.stateAnimator.animateTo(90));
    fixture.card.remove();
    const disconnected = gauges.every((gauge) => !gauge.stateAnimator.animating && gauge.stateAnimator.frame === undefined
      && gauge.stateAnimator.stateLayerElement === undefined && !gauge.geometry.pathGeometry.isReady());
    document.querySelector('#host').append(fixture.card);
    fixture.card.hass = fixture.hass;
    await fixture.card.updateComplete;
    await new Promise((done) => requestAnimationFrame(done));
    return {
      disconnected,
      oldOwnersReleased: fixture.oldGauges.every((gauge) => !gauge.stateAnimator.animating && gauge.stateAnimator.stateLayerElement === undefined),
      measurementsRetained: gauges.every((gauge, index) => gauge.geometry.pathGeometry.activeMeasurement === measurements[index]),
    };
  });
  expect(lifetime).toEqual({ disconnected: true, oldOwnersReleased: true, measurementsRetained: true });
  await deliverHorseshoeState(page, 35);
  await expect.poll(() => page.evaluate(() => window.horseshoeCache.card.cardTools.getBySection('horseshoes')
    .every((gauge) => gauge.stateAnimator.currentProgress === 35 && !gauge.stateAnimator.animating))).toBe(true);
  expect(errors).toEqual([]);
  await page.evaluate(() => window.horseshoeCache.card.remove());
});

test('dynamic Horseshoe stays inert until first hass publication across disconnect and reconnect', async ({ page }) => {
  const errors = await loadHorseshoeCacheCard(page, await readFile(new URL('../dist/flex-horseshoe-card.js', import.meta.url), 'utf8'));
  await page.evaluate(async () => {
    const fixture = window.horseshoeCache;
    const card = document.createElement('flex-horseshoe-card');
    const sourceGauge = fixture.config.layout.horseshoes[0];
    card.lovelace = { config: {}, rawConfig: {} };
    card.setConfig({
      ...fixture.config,
      layout: {
        ...fixture.config.layout,
        horseshoes: [{
          ...sourceGauge,
          id: 'dynamic-lifecycle',
          path: '[[[ return { type: "arc", radius: Number(states["sensor.load"].state), arc_degrees: 270 }; ]]]',
          show: { ...sourceGauge.show, horseshoe: '[[[ return true; ]]]' },
        }],
      },
    });
    document.querySelector('#host').append(card);
    await card.updateComplete;
    const [gauge] = card.cardTools.getBySection('horseshoes');
    window.horseshoeLifecycle = { card, gauge, iconPath: gauge.stateMarker.haIconPath, hass: fixture.hass };
  });

  // Keep every config-dependent entry point inert before HA publishes a state.
  const beforePublication = await page.evaluate(() => {
    const { card, gauge, iconPath } = window.horseshoeLifecycle;
    gauge.updated();
    const rendered = gauge.render().strings.join('');
    card.cardTools.updatePalettePaint();
    return {
      connected: card.cardTools.connectedToCard,
      dynamic: gauge.hasJavascript,
      initialized: gauge.runtimeConfigInitialized,
      rendered,
      noPathInput: gauge.geometry.pathInput === undefined,
      noPathDefinition: gauge.geometry.pathDefinition === undefined,
      noValueMapper: gauge.runtime.valueMapper === undefined,
      noAnimator: gauge.stateAnimator === undefined,
      pathUnbound: !gauge.geometry.pathGeometry.isReady(),
      resourceOpen: !iconPath.sourceClosed,
    };
  });
  expect(beforePublication).toEqual({
    connected: true,
    dynamic: true,
    initialized: false,
    rendered: '',
    noPathInput: true,
    noPathDefinition: true,
    noValueMapper: true,
    noAnimator: true,
    pathUnbound: true,
    resourceOpen: true,
  });

  // Disconnect first, then publish HA while detached to verify the resource remains closed.
  const publishedWhileDetached = await page.evaluate(async () => {
    const { card, gauge, iconPath, hass } = window.horseshoeLifecycle;
    card.remove();
    const disconnected = card.cardTools.disconnectedFromCard && iconPath.sourceClosed;
    card.hass = hass;
    await card.updateComplete;
    return {
      disconnected,
      initialized: gauge.runtimeConfigInitialized,
      pathPublished: gauge.config.path.radius === 25 && typeof gauge.geometry.pathDefinition.d === 'string',
      valuePublished: gauge.runtime.value === 25 && Boolean(gauge.runtime.valueMapper),
      animatorCreated: Boolean(gauge.stateAnimator),
      stillDisconnected: card.cardTools.disconnectedFromCard,
      resourceStillClosed: iconPath.sourceClosed,
      pathStillUnbound: !gauge.geometry.pathGeometry.isReady(),
    };
  });
  expect(publishedWhileDetached).toEqual({
    disconnected: true,
    initialized: true,
    pathPublished: true,
    valuePublished: true,
    animatorCreated: true,
    stillDisconnected: true,
    resourceStillClosed: true,
    pathStillUnbound: true,
  });

  await page.evaluate(async () => {
    const { card } = window.horseshoeLifecycle;
    document.querySelector('#host').append(card);
    await card.updateComplete;
    await new Promise((done) => requestAnimationFrame(done));
    await card.updateComplete;
  });
  await expect.poll(() => page.evaluate(() => {
    const { card, gauge, iconPath } = window.horseshoeLifecycle;
    return card.cardTools.connectedToCard && !iconPath.sourceClosed
      && gauge.geometry.pathGeometry.isReady() && Boolean(gauge.stateAnimator.stateLayerElement);
  })).toBe(true);

  await page.evaluate(() => {
    const lifecycle = window.horseshoeLifecycle;
    const entity = lifecycle.hass.states['sensor.load'];
    lifecycle.hass = {
      ...lifecycle.hass,
      states: { ...lifecycle.hass.states, 'sensor.load': { ...entity, state: '40' } },
    };
    lifecycle.card.hass = lifecycle.hass;
  });
  await expect.poll(() => page.evaluate(() => {
    const { gauge } = window.horseshoeLifecycle;
    return gauge.config.path.radius === 40 && gauge.runtime.value === 40;
  })).toBe(true);
  expect(errors).toEqual([]);
  await page.evaluate(() => {
    window.horseshoeLifecycle.card.remove();
    window.horseshoeCache.card.remove();
  });
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
    .every((gauge) => gauge.geometry.pathGeometry.isReady() && gauge.paint.stateGradient));
  await page.evaluate(() => {
    const fixture = window.horseshoeCache;
    fixture.fullGeometry = fixture.card.cardTools.getBySection('horseshoes')[0].paint.stateGradient.geometry;
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
  expect(await page.evaluate(() => window.horseshoeCache.card.cardTools.getBySection('horseshoes')[0].paint.stateGradient.geometry
    === window.horseshoeCache.fullGeometry)).toBe(true);
  expect(errors).toEqual([]);
  await page.evaluate(() => window.horseshoeCache.card.remove());
});
