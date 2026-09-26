import { readFile } from 'node:fs/promises';

import { expect, test } from '@playwright/test';

const now = new Date('2026-09-26T12:00:00.000Z');

/** Loads the built card with a fixed clock and controllable Home Assistant history. */
async function loadPointerCard(page, { runtimeChartType = false, realTime = false } = {}) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.clock.install({ time: now });
  await page.clock.pauseAt(now);
  await page.route('http://fhs.test/**', (route) => route.fulfill({
    contentType: 'text/html',
    body: '<body style="margin:0;--primary-text-color:white;--primary-color:#42a5f5"><div id="host" style="width:520px;padding:40px"></div></body>',
  }));
  await page.goto('http://fhs.test/sparkline-pointer');
  await page.addScriptTag({
    type: 'module',
    content: await readFile(new URL('../dist/flex-horseshoe-card.js', import.meta.url), 'utf8'),
  });
  await page.evaluate(async ({ runtimeChartType, realTime }) => {
    await customElements.whenDefined('flex-horseshoe-card');
    const timestamp = Date.now();
    const entity = {
      entity_id: 'sensor.pointer_power',
      state: '42',
      attributes: { friendly_name: 'Pointer power', unit_of_measurement: 'W' },
      last_changed: new Date(timestamp - 5 * 60 * 1000).toISOString(),
      last_updated: new Date(timestamp - 5 * 60 * 1000).toISOString(),
    };
    const chartMode = { entity_id: 'sensor.chart_mode', state: 'line', attributes: {} };
    const rows = Array.from({ length: 16 }, (_, index) => ({
      ...entity,
      state: String(10 + index * 2),
      last_changed: new Date(timestamp - ((15 - index) * 15 + 5) * 60 * 1000).toISOString(),
    }));
    const requests = [];
    const hass = {
      states: { [entity.entity_id]: entity, [chartMode.entity_id]: chartMode },
      connection: new EventTarget(),
      locale: { language: 'en', number_format: 'language', time_format: '24' },
      config: { time_zone: 'UTC' },
      themes: { darkMode: true, themes: {} },
      entities: {}, devices: {}, areas: {}, floors: {}, user: { name: 'Pointer test' },
      localize: (key) => key,
      formatEntityName: (state) => state.attributes.friendly_name,
      formatEntityState: (state) => state.state,
      formatEntityStateToParts: (state, value) => [
        { type: 'value', value: value ?? state.state },
        { type: 'unit', value: state.attributes.unit_of_measurement },
      ],
      callApi: (_method, path) => new Promise((resolve, reject) => requests.push({ path, resolve, reject })),
    };
    const config = {
      type: 'custom:flex-horseshoe-card',
      entities: [{ entity: entity.entity_id }],
      layout: {
        sparklines: [{
          id: 'pointer-history', entity_index: 0, xpos: 50, ypos: 50, width: 88, height: 72,
          period: realTime ? { type: 'real_time' } : {
            type: 'rolling_window',
            rolling_window: { duration: { hour: 4 }, bins: { per_hour: 4, density: 'medium' } },
          },
          sparkline: {
            show: {
              chart_type: runtimeChartType ? '[[[ return states["sensor.chart_mode"].state; ]]]' : 'line',
              chart_variant: 'line', line: true, grid: false, axis: false,
              tickmarks: false, labels: false, legend: false,
            },
            state_values: { aggregate_func: 'avg' },
            line: { line_width: 2 },
            radial: { arc_degrees: 270, rotate: -135, size: 14 },
          },
        }],
      },
    };
    const card = document.createElement('flex-horseshoe-card');
    card.lovelace = { config: {} };
    card.setConfig(config);
    document.querySelector('#host').append(card);
    card.hass = hass;
    window.pointerRegression = { card, config, entity, errors: [], graph: card.cardTools.getBySection('sparklines')[0], hass, requests, rows };
  }, { runtimeChartType, realTime });

  if (!realTime) {
    await page.waitForFunction(() => window.pointerRegression.requests.length > 0);
    await page.evaluate(() => window.pointerRegression.requests[0].resolve([window.pointerRegression.rows]));
    await page.waitForFunction(() => window.pointerRegression.graph.sparklineSeries.primaryItem.requestState === 'loaded');
  }
  await page.waitForFunction(() => window.pointerRegression.graph.elements.svg?.isConnected);
  await page.evaluate(() => window.pointerRegression.card.updateComplete);
  await page.clock.runFor(50);
  return errors;
}

/** Moves the browser pointer to a real graph bucket using the SVG's screen transform. */
async function moveToBucket(page, index, radial = false) {
  const target = await page.evaluate(({ index, radial }) => {
    const graph = window.pointerRegression.graph;
    const data = graph.primaryGraph;
    const pointIndex = Math.min(index, data.coords.length - 1);
    let point;
    if (radial) {
      const geometry = data.getRadialGeometry();
      point = data.getRadialPoint((geometry.innerRadius + geometry.outerRadius) / 2, data.getRadialAngleForBin(pointIndex));
    } else {
      const coordinates = data.calculateYCoordinates(data.coords);
      point = { x: coordinates[pointIndex][0], y: coordinates[pointIndex][1] };
      // A singleton is selected anywhere in the hit area; aim inside it so
      // WebKit does not have to hit-test the exact viewport boundary.
      if (data.coords.length === 1) {
        point = { x: data.drawArea.x + data.drawArea.width / 2, y: data.drawArea.y + data.drawArea.height / 2 };
      }
    }
    const svgPoint = graph.elements.svg.createSVGPoint();
    svgPoint.x = graph.graphArea.x + point.x;
    svgPoint.y = graph.graphArea.y + point.y;
    const client = svgPoint.matrixTransform(graph.elements.svg.getScreenCTM());
    return { x: client.x, y: client.y, index: pointIndex };
  }, { index, radial });
  await page.mouse.move(target.x, target.y);
  await page.clock.runFor(34);
  expect(await page.evaluate(() => {
    const graph = window.pointerRegression.graph;
    return { visible: graph.tooltipVisible, index: graph.tooltip.index };
  })).toEqual({ visible: true, index: target.index });
  return target;
}

async function changeChartType(page, chartType) {
  await page.evaluate((state) => {
    const fixture = window.pointerRegression;
    const nextHass = {
      ...fixture.hass,
      states: {
        ...fixture.hass.states,
        'sensor.chart_mode': { ...fixture.hass.states['sensor.chart_mode'], state },
      },
    };
    fixture.hass = nextHass;
    fixture.card.hass = nextHass;
  }, chartType);
  await page.waitForFunction((type) => window.pointerRegression.graph.config.sparkline.show.chart_type === type, chartType);
  await page.evaluate(() => window.pointerRegression.card.updateComplete);
  await page.clock.runFor(34);
}

test('historical Cartesian hover shows its tooltip and indicator, then clears on leave', async ({ page }) => {
  const errors = await loadPointerCard(page);
  await moveToBucket(page, 7);
  const shown = await page.evaluate(() => ({
    title: window.pointerRegression.graph.elements.tooltipTitle.textContent,
    tooltip: window.pointerRegression.graph.elements.tooltip.style.display,
    indicator: window.pointerRegression.graph.elements.activeIndicator.style.visibility,
  }));
  expect(shown.title).not.toBe('');
  expect(shown.tooltip).toBe('block');
  expect(shown.indicator).toBe('visible');

  await page.mouse.move(8, 8);
  await page.waitForFunction(() => !window.pointerRegression.graph.tooltipVisible);
  expect(await page.evaluate(() => ({
    tooltip: window.pointerRegression.graph.elements.tooltip.style.display,
    indicator: window.pointerRegression.graph.elements.activeIndicator.style.visibility,
  }))).toEqual({ tooltip: 'none', indicator: 'hidden' });
  expect(errors).toEqual([]);
});

test('runtime line-radial-line routing uses the current chart and a replaced SVG releases its old root', async ({ page }) => {
  const errors = await loadPointerCard(page, { runtimeChartType: true });
  await moveToBucket(page, 3);
  await changeChartType(page, 'radial');
  await moveToBucket(page, 9, true);
  await changeChartType(page, 'line');
  await moveToBucket(page, 12);

  await page.evaluate(() => {
    const fixture = window.pointerRegression;
    fixture.oldGraph = fixture.graph;
    fixture.oldRoot = fixture.graph.elements.svg;
    const emptyConfig = structuredClone(fixture.config);
    emptyConfig.layout.sparklines = [];
    fixture.card.setConfig(emptyConfig);
    fixture.card.hass = { ...fixture.hass, states: { ...fixture.hass.states } };
  });
  await page.waitForFunction(() => !window.pointerRegression.oldRoot.isConnected);
  await page.evaluate(async () => {
    const fixture = window.pointerRegression;
    await fixture.card.updateComplete;
    fixture.card.setConfig(fixture.config);
    fixture.card.hass = { ...fixture.hass, states: { ...fixture.hass.states } };
    fixture.graph = fixture.card.cardTools.getBySection('sparklines')[0];
  });
  await page.waitForFunction(() => window.pointerRegression.requests.length > 1);
  await page.evaluate(() => window.pointerRegression.requests[1].resolve([window.pointerRegression.rows]));
  await page.waitForFunction(() => window.pointerRegression.graph.sparklineSeries.primaryItem.requestState === 'loaded');
  await page.waitForFunction(() => window.pointerRegression.graph.elements.svg?.isConnected);
  await page.clock.runFor(50);

  const replacement = await page.evaluate(() => ({
    oldRootConnected: window.pointerRegression.oldRoot.isConnected,
    oldRootReady: window.pointerRegression.oldRoot.dataset.pointerReady,
    oldToolRoot: window.pointerRegression.oldGraph.pointerSvgElement,
    rootReplaced: window.pointerRegression.graph.elements.svg !== window.pointerRegression.oldRoot,
  }));
  expect(replacement.oldRootConnected).toBe(false);
  expect(replacement.oldRootReady).toBeUndefined();
  expect(replacement.oldToolRoot).toBeUndefined();
  expect(replacement.rootReplaced).toBe(true);
  await page.evaluate(() => window.pointerRegression.oldRoot.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 100, clientY: 100 })));
  expect(await moveToBucket(page, 5)).toMatchObject({ index: 5 });
  expect(errors).toEqual([]);
});

test('pointer cancel and disconnect clear tracking; reconnect binds the rendered graph again', async ({ page }) => {
  const errors = await loadPointerCard(page);
  const start = await moveToBucket(page, 4);
  await page.mouse.down();
  await page.mouse.move(start.x + 8, start.y + 4);
  await page.evaluate(() => window.dispatchEvent(new PointerEvent('pointercancel', { cancelable: true })));
  await page.mouse.up();
  await page.evaluate(() => window.dispatchEvent(new PointerEvent('pointermove', { cancelable: true, clientX: 450, clientY: 350 })));
  await page.clock.runFor(50);
  expect(await page.evaluate(() => ({
    dragging: window.pointerRegression.graph.dragging,
    tooltip: window.pointerRegression.graph.tooltipVisible,
    pointer: window.pointerRegression.graph.pointerEvent,
  }))).toEqual({ dragging: false, tooltip: false, pointer: undefined });

  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x + 10, start.y + 3);
  const disconnected = await page.evaluate(() => {
    const fixture = window.pointerRegression;
    fixture.oldRoot = fixture.graph.elements.svg;
    fixture.card.remove();
    window.dispatchEvent(new PointerEvent('pointermove', { cancelable: true, clientX: 460, clientY: 360 }));
    return {
      dragging: fixture.graph.dragging,
      pointer: fixture.graph.pointerEvent,
      tooltip: fixture.graph.tooltipVisible,
      svgReady: fixture.oldRoot.dataset.pointerReady,
    };
  });
  await page.clock.runFor(50);
  expect(disconnected).toEqual({ dragging: false, pointer: undefined, tooltip: false, svgReady: undefined });

  await page.evaluate(() => {
    const fixture = window.pointerRegression;
    document.querySelector('#host').append(fixture.card);
    fixture.hass = { ...fixture.hass, states: { ...fixture.hass.states } };
    fixture.card.hass = fixture.hass;
  });
  await page.waitForFunction(() => window.pointerRegression.graph.elements.svg?.dataset.pointerReady === 'true');
  await page.clock.runFor(34);
  await moveToBucket(page, 8);
  expect(await page.evaluate(() => window.pointerRegression.graph.tooltipVisible)).toBe(true);
  expect(errors).toEqual([]);
});

test('real-time sparkline keeps its value tooltip without a time-selection indicator', async ({ page }) => {
  const errors = await loadPointerCard(page, { realTime: true });
  await moveToBucket(page, 0);
  const result = await page.evaluate(() => ({
    tooltipVisible: window.pointerRegression.graph.tooltipVisible,
    tooltipDisplay: window.pointerRegression.graph.elements.tooltip.style.display,
    indicator: window.pointerRegression.graph.elements.svg.querySelector('.sparkline-active-indicator'),
    requestCount: window.pointerRegression.requests.length,
  }));
  expect(result.tooltipVisible).toBe(true);
  expect(result.tooltipDisplay).toBe('block');
  expect(result.indicator).toBeNull();
  expect(result.requestCount).toBe(0);
  expect(errors).toEqual([]);
});
