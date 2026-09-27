import { readFile } from 'node:fs/promises';

import { expect, test } from '@playwright/test';

import { deliverHorseshoeState, loadHorseshoeCacheCard } from './horseshoe-cache-fixture.js';

const paletteDocument = (colors) => ({ ref: {}, modes: colors });

test('theme and palette changes repaint retained horseshoe paint without history or animation restart', async ({ page }) => {
  const errors = await loadHorseshoeCacheCard(page, await readFile(new URL('../dist/flex-horseshoe-card.js', import.meta.url), 'utf8'));
  const palettes = {
    '/theme-color-cache-light.json': paletteDocument({
      light: { 'fhs-cache-start': '#13579b', 'fhs-cache-middle': '#22cc44', 'fhs-cache-end': '#ffd700' },
      dark: { 'fhs-cache-start': '#e65100', 'fhs-cache-middle': '#ffee00', 'fhs-cache-end': '#33bbff' },
    }),
    '/theme-color-cache-replacement.json': paletteDocument({
      light: { 'fhs-cache-start': '#8e24aa', 'fhs-cache-middle': '#ab47bc', 'fhs-cache-end': '#ce93d8' },
      dark: { 'fhs-cache-start': '#00695c', 'fhs-cache-middle': '#26a69a', 'fhs-cache-end': '#80cbc4' },
    }),
  };

  await page.route('**/theme-color-cache-*.json', async (route) => {
    const document = palettes[new URL(route.request().url()).pathname];
    await route.fulfill({ contentType: 'application/json', json: document });
  });

  await page.evaluate(() => {
    const fixture = window.horseshoeCache;
    fixture.historyRequests = [];
    fixture.hass = {
      ...fixture.hass,
      themes: { ...fixture.hass.themes, theme: 'fhs-cache-global-light', darkMode: false },
      callApi: (_method, path) => {
        fixture.historyRequests.push(path);
        const state = fixture.hass.states['sensor.load'];
        const now = Date.now();
        return Promise.resolve([[
          { ...state, state: '18', last_changed: new Date(now - 4 * 60 * 60 * 1000).toISOString() },
          { ...state, state: '25', last_changed: new Date(now - 60 * 60 * 1000).toISOString() },
        ]]);
      },
    };
    const config = {
      ...fixture.config,
      palettes: { cache: 'http://fhs.test/theme-color-cache-light.json' },
      layout: {
        ...fixture.config.layout,
        horseshoes: fixture.config.layout.horseshoes.map((gauge, index) => ({
          ...gauge,
          show: index === 1
            ? { ...gauge.show, horseshoe_style: 'colorstopinterpolated' }
            : gauge.show,
          color_stops: { colors: { 0: 'var(--fhs-cache-start)', 50: 'var(--fhs-cache-middle)', 100: 'var(--fhs-cache-end)' } },
        })),
        sparklines: [{
          id: 'theme-cache-history', xpos: 50, ypos: 80, width: 80, height: 20,
          period: { type: 'rolling_window', rolling_window: { duration: { hour: 24 }, bins: { per_hour: 1 } } },
          sparkline: {
            state_values: { aggregate_func: 'avg' },
            show: { chart_type: 'line', line: true, grid: false, axis: false, labels: false },
            line: { line_width: 1 },
          },
          series: [{ id: 'load-history', entity_index: 0 }],
        }],
      },
    };
    fixture.config = config;
    fixture.card.setConfig(config);
    fixture.card.hass = fixture.hass;
  });

  const gradientColor = () => page.evaluate(() => getComputedStyle(
    window.horseshoeCache.card.shadowRoot.querySelector('.horseshoe__state-gradient stop'),
  ).stopColor);
  const renderedPaint = () => page.evaluate(() => {
    const card = window.horseshoeCache.card;
    const horseshoes = card.shadowRoot.querySelectorAll('.horseshoe');
    return {
      gradient: getComputedStyle(horseshoes[0].querySelector('.horseshoe__state-gradient stop')).stopColor,
      interpolatedSolid: getComputedStyle(horseshoes[1].querySelector('.horseshoe__state-band')).fill,
      stateMarker: getComputedStyle(horseshoes[1].querySelector('.horseshoe__state-marker--circle')).fill,
    };
  });
  await expect.poll(gradientColor).toBe('rgb(19, 87, 155)');
  await page.waitForFunction(() => {
    const graph = window.horseshoeCache.card.cardTools.getBySection('sparklines')[0];
    return graph.sparklineSeries.primaryItem.requestState === 'loaded';
  });
  await page.waitForFunction(() => {
    const second = window.horseshoeCache.card.shadowRoot.querySelectorAll('.horseshoe')[1];
    return second.querySelector('.horseshoe__state-band') && second.querySelector('.horseshoe__state-marker--circle');
  });
  const lightPaint = await renderedPaint();
  expect(lightPaint.interpolatedSolid).not.toBe('');
  expect(lightPaint.stateMarker).toBe(lightPaint.interpolatedSolid);

  const retainedBeforeChanges = await page.evaluate(() => {
    const fixture = window.horseshoeCache;
    const gauges = fixture.card.cardTools.getBySection('horseshoes');
    gauges[0].stateAnimator.animation.duration = 60000;
    fixture.retainedStateGeometry = gauges.map((gauge) => gauge.pathGeometry.activeMeasurement);
    return {
      historyRequests: fixture.historyRequests.length,
    };
  });
  await deliverHorseshoeState(page, 80);
  await page.waitForFunction(() => {
    const animator = window.horseshoeCache.card.cardTools.getBySection('horseshoes')[0].stateAnimator;
    return animator.animating && animator.toProgress === 80;
  });
  const paintBeforeTheme = await renderedPaint();
  const animationNumber = await page.evaluate(() => window.horseshoeCache.card.cardTools.getBySection('horseshoes')[0].stateAnimator.animationNumber);

  await page.evaluate(() => {
    const fixture = window.horseshoeCache;
    fixture.hass = {
      ...fixture.hass,
      themes: { ...fixture.hass.themes, theme: 'fhs-cache-global-dark', darkMode: true },
    };
    fixture.card.hass = fixture.hass;
  });
  await expect.poll(gradientColor).toBe('rgb(230, 81, 0)');
  const darkPaint = await renderedPaint();
  expect(darkPaint.interpolatedSolid).not.toBe(paintBeforeTheme.interpolatedSolid);
  expect(darkPaint.stateMarker).toBe(darkPaint.interpolatedSolid);
  const afterTheme = await page.evaluate(() => {
    const fixture = window.horseshoeCache;
    const gauges = fixture.card.cardTools.getBySection('horseshoes');
    return {
      geometryRetained: gauges.every((gauge, index) => gauge.pathGeometry.activeMeasurement === fixture.retainedStateGeometry[index]),
      animationNumber: gauges[0].stateAnimator.animationNumber,
      animationTarget: gauges[0].stateAnimator.toProgress,
      animating: gauges[0].stateAnimator.animating,
      historyRequests: fixture.historyRequests.length,
    };
  });
  expect(afterTheme.geometryRetained).toBe(true);
  expect(afterTheme.animationNumber).toBe(animationNumber);
  expect(afterTheme.animationTarget).toBe(80);
  expect(afterTheme.animating).toBe(true);
  expect(afterTheme.historyRequests).toBe(retainedBeforeChanges.historyRequests);

  const paletteOnlyMetrics = await page.evaluate(() => {
    const fixture = window.horseshoeCache;
    const gauges = fixture.card.cardTools.getBySection('horseshoes');
    const graphTool = fixture.card.cardTools.getBySection('sparklines')[0];
    const graph = graphTool.primaryGraph;
    gauges[0].stateAnimator.stopAnimation();
    fixture.paletteOnlyMetrics = { processData: 0, graphGeometry: 0, pathGradientGeometry: 0, pathLength: 0, pathPoints: 0 };
    const processData = graph.processData.bind(graph);
    graph.processData = (...args) => {
      fixture.paletteOnlyMetrics.processData += 1;
      return processData(...args);
    };
    const calculateGeometry = graph.calculateGeometry.bind(graph);
    graph.calculateGeometry = (...args) => {
      fixture.paletteOnlyMetrics.graphGeometry += 1;
      return calculateGeometry(...args);
    };
    gauges.forEach((gauge) => {
      const geometry = gauge.pathGeometry;
      const getGradientGeometry = geometry.getGradientGeometry.bind(geometry);
      geometry.getGradientGeometry = (...args) => {
        fixture.paletteOnlyMetrics.pathGradientGeometry += 1;
        return getGradientGeometry(...args);
      };
      const path = geometry.getPathElement();
      const getTotalLength = path.getTotalLength.bind(path);
      path.getTotalLength = (...args) => {
        fixture.paletteOnlyMetrics.pathLength += 1;
        return getTotalLength(...args);
      };
      const getPointAtLength = path.getPointAtLength.bind(path);
      path.getPointAtLength = (...args) => {
        fixture.paletteOnlyMetrics.pathPoints += 1;
        return getPointAtLength(...args);
      };
    });
    fixture.paletteOnlyAnimationNumber = gauges[0].stateAnimator.animationNumber;
    fixture.paletteOnlyHistoryRequests = fixture.historyRequests.length;
    return { animationNumber: fixture.paletteOnlyAnimationNumber };
  });
  await page.evaluate(async () => {
    const fixture = window.horseshoeCache;
    await fixture.card.cardTheme.loadPalettes({ cache: 'http://fhs.test/theme-color-cache-replacement.json' });
  });
  await expect.poll(gradientColor).toBe('rgb(0, 105, 92)');
  const replacementPaint = await renderedPaint();
  expect(replacementPaint.interpolatedSolid).not.toBe(darkPaint.interpolatedSolid);
  expect(replacementPaint.stateMarker).toBe(replacementPaint.interpolatedSolid);

  const retainedAfterChanges = await page.evaluate(() => {
    const fixture = window.horseshoeCache;
    const gauge = fixture.card.cardTools.getBySection('horseshoes')[0];
    return {
      geometryRetained: fixture.card.cardTools.getBySection('horseshoes').every((item, index) => item.pathGeometry.activeMeasurement === fixture.retainedStateGeometry[index]),
      animationNumber: gauge.stateAnimator.animationNumber,
      animating: gauge.stateAnimator.animating,
      historyRequests: fixture.historyRequests.length,
      paletteOnlyMetrics: fixture.paletteOnlyMetrics,
    };
  });
  expect(retainedAfterChanges.geometryRetained).toBe(true);
  expect(retainedAfterChanges.animationNumber).toBe(paletteOnlyMetrics.animationNumber);
  expect(retainedAfterChanges.animating).toBe(false);
  expect(retainedAfterChanges.historyRequests).toBe(afterTheme.historyRequests);
  expect(retainedAfterChanges.paletteOnlyMetrics).toEqual({
    processData: 0,
    graphGeometry: 0,
    pathGradientGeometry: 0,
    pathLength: 0,
    pathPoints: 0,
  });
  expect(errors).toEqual([]);
  await page.evaluate(() => window.horseshoeCache.card.remove());
});

test('view theme observer repaints retained horseshoe colors from inherited CSS variables', async ({ page }) => {
  const errors = await loadHorseshoeCacheCard(page, await readFile(new URL('../dist/flex-horseshoe-card.js', import.meta.url), 'utf8'));
  await page.evaluate(() => {
    const fixture = window.horseshoeCache;
    const view = document.createElement('hui-view-container');
    view.theme = 'fhs-view-day';
    view.style.setProperty('--fhs-view-start', '#165d91');
    view.style.setProperty('--fhs-view-middle', '#258b68');
    view.style.setProperty('--fhs-view-end', '#d89124');
    fixture.view = view;

    fixture.hass = {
      ...fixture.hass,
      themes: { ...fixture.hass.themes, theme: 'fhs-global-theme', darkMode: false },
    };
    fixture.card.hass = fixture.hass;

    const config = {
      ...fixture.config,
      palettes: {},
      layout: {
        ...fixture.config.layout,
        horseshoes: fixture.config.layout.horseshoes.map((gauge) => ({
          ...gauge,
          color_stops: { colors: { 0: 'var(--fhs-view-start)', 50: 'var(--fhs-view-middle)', 100: 'var(--fhs-view-end)' } },
        })),
      },
    };
    fixture.config = config;
    fixture.card.setConfig(config);
    document.querySelector('#host').append(view);
    view.append(fixture.card);
    fixture.card.hass = fixture.hass;
  });

  const gradientColor = () => page.evaluate(() => getComputedStyle(
    window.horseshoeCache.card.shadowRoot.querySelector('.horseshoe__state-gradient stop'),
  ).stopColor);
  await expect.poll(gradientColor).toBe('rgb(22, 93, 145)');
  await page.evaluate(() => {
    const fixture = window.horseshoeCache;
    fixture.retainedViewGeometry = fixture.card.cardTools.getBySection('horseshoes')[0].stateGradient.geometry;
    fixture.view.theme = 'fhs-view-night';
    fixture.view.style.setProperty('--fhs-view-start', '#9b3e27');
    fixture.view.style.setProperty('--fhs-view-middle', '#b56a32');
    fixture.view.style.setProperty('--fhs-view-end', '#e0b742');
  });
  await expect.poll(gradientColor).toBe('rgb(155, 62, 39)');

  const viewUpdate = await page.evaluate(() => {
    const fixture = window.horseshoeCache;
    const gauge = fixture.card.cardTools.getBySection('horseshoes')[0];
    return {
      activeViewTheme: fixture.card.cardTheme.colorContext.viewThemeName,
      geometryRetained: gauge.stateGradient.geometry === fixture.retainedViewGeometry,
      inheritedColor: getComputedStyle(fixture.card).getPropertyValue('--fhs-view-start').trim(),
      observerConnected: fixture.card.cardTheme.connectedToCard,
    };
  });
  expect(viewUpdate).toEqual({
    activeViewTheme: 'fhs-view-night',
    geometryRetained: true,
    inheritedColor: '#9b3e27',
    observerConnected: true,
  });
  expect(errors).toEqual([]);
  await page.evaluate(() => window.horseshoeCache.card.remove());
});
