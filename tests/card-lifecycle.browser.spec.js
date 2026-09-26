import { readFile } from 'node:fs/promises';

import { expect, test } from '@playwright/test';

const now = new Date('2026-09-26T12:00:00.000Z');

/** Loads the real built card with deferred HA requests and a fixed clock. */
async function loadCard(page, { multiple = false, calendar = false } = {}) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.clock.install({ time: now });
  await page.clock.pauseAt(now);
  await page.route('http://fhs.test/**', (route) => route.fulfill({
    contentType: 'text/html',
    body: '<body style="--primary-text-color:white;--primary-color:blue"><div id="host" style="width:400px"></div></body>',
  }));
  await page.goto('http://fhs.test/card-lifecycle');
  await page.addScriptTag({ type: 'module', content: await readFile(new URL('../dist/flex-horseshoe-card.js', import.meta.url), 'utf8') });
  await page.evaluate(async ({ multiple, calendar }) => {
    await customElements.whenDefined('flex-horseshoe-card');
    const card = document.createElement('flex-horseshoe-card');
    card.lovelace = { config: {} };
    const counters = { hass: 0, graph: 0, source: 0, history: 0 };
    const requests = [];
    const timestamp = Date.now();
    const entity = {
      entity_id: 'sensor.power', state: '20',
      attributes: { friendly_name: 'Power', unit_of_measurement: 'W' },
      last_changed: new Date(timestamp - 30 * 60 * 1000).toISOString(),
      last_updated: new Date(timestamp - 30 * 60 * 1000).toISOString(),
    };
    const other = { ...entity, entity_id: 'sensor.other', state: '30' };
    const types = ['min', 'avg', 'max', 'min_time', 'max_time', 'duration', 'bin_duration', 'aggregate_func'];
    const periodType = calendar ? 'calendar' : 'rolling_window';
    const config = {
      type: 'custom:flex-horseshoe-card',
      entities: [
        { entity: entity.entity_id },
        { entity: 'fhs_input_number.days', initial: 1, min: 1, max: 14, step: 1 },
        ...types.map((type) => ({ entity: `fhs_sparkline.history_${type}` })),
        ...(multiple ? [{ entity: other.entity_id }, { entity: 'fhs_sparkline.history_other_avg' }] : []),
      ],
      styles: { opacity: '[[[ return entities[3].state === "unavailable" ? 0.5 : 1; ]]]' },
      animations: {
        'entity.3': [{
          state: '[[[ return entities[3].state; ]]]',
          states: [{ animation_id: 0, styles: { opacity: '[[[ return entities[3].state === "unavailable" ? 0.5 : 1; ]]]' } }],
        }],
      },
      layout: {
        groups: [{ id: 'derived', xpos: '[[[ return entities[3].state === "unavailable" ? 25 : 50; ]]]', ypos: 20 }],
        states: [
          { id: 'avg', group: 'derived', entity_index: 3, xpos: 40, ypos: 50 },
          { id: 'avg-copy', group: 'derived', entity_index: 3, xpos: 60, ypos: 50 },
        ],
        texts: [{ id: 'derived-text', xpos: 50, ypos: 30, text: '[[[ return "avg=" + entities[3].state; ]]]' }],
        sparklines: [{
          id: 'history', xpos: 50, ypos: 65, width: 80, height: 40,
          period: { type: periodType, [periodType]: {
            ...(calendar ? { offset: -1 } : {}),
            duration: { hour: '[[[ return Number(entities[1].state) * 24; ]]]' }, bins: { per_hour: 1 },
          } },
          sparkline: { show: { chart_type: 'line' }, line: { show: { minmax: true } } },
          series: [{ id: 'power', entity_index: 0 }, ...(multiple ? [{ id: 'other', entity_index: 10 }] : [])],
        }],
      },
    };
    card.setConfig(config);
    const graph = card.cardTools.getBySection('sparklines')[0];
    // Count owner entry points without replacing their processing or rendering.
    const setHass = card.setHass.bind(card);
    card.setHass = (...args) => { counters.hass++; return setHass(...args); };
    const updateSources = card.updateSourceEntities.bind(card);
    card.updateSourceEntities = (...args) => { counters.source++; return updateSources(...args); };
    const calculate = graph.updateGraphFromSeries.bind(graph);
    graph.updateGraphFromSeries = (...args) => { counters.graph++; return calculate(...args); };
    const hass = {
      states: { [entity.entity_id]: entity, [other.entity_id]: other }, connection: new EventTarget(),
      locale: { language: 'en', number_format: 'language', time_format: 'language' },
      config: { time_zone: 'UTC' }, themes: { darkMode: true, themes: {} },
      entities: {}, devices: {}, areas: {}, floors: {}, user: { name: 'Lifecycle' },
      formatEntityName: (state) => state.attributes.friendly_name,
      formatEntityState: (state) => state.state,
      formatEntityStateToParts: (state, value) => [{ type: 'value', value: value ?? state.state }],
      callApi: (_method, path) => {
        counters.history++;
        return new Promise((accept, reject) => requests.push({ path, accept, reject }));
      },
    };
    // Include one sample outside the initial day; it must survive shrink/expand.
    const rows = [
      { ...entity, state: '5', last_changed: new Date(timestamp - 13 * 24 * 60 * 60 * 1000).toISOString() },
      { ...entity, state: '10', last_changed: new Date(timestamp - 2 * 60 * 60 * 1000).toISOString() },
      entity,
    ];
    document.querySelector('#host').append(card);
    card.hass = hass;
    window.lifecycle = { card, graph, hass, config, requests, rows, counters, entities: card.entities };
  }, { multiple, calendar });
  await page.waitForFunction(() => window.lifecycle.requests.length > 0);
  return errors;
}

test('one HA and history pass publishes all values to StateTool, JS, groups and animations', async ({ page }) => {
  const errors = await loadCard(page);
  await page.evaluate(() => window.lifecycle.requests[0].accept([window.lifecycle.rows]));
  await page.waitForFunction(() => window.lifecycle.graph.sparklineSeries.primaryItem.requestState === 'loaded');
  const result = await page.evaluate(async () => {
    const { card, counters, entities } = window.lifecycle;
    await card.updateComplete;
    const published = card.entities.slice(2).map((entity) => entity.state);
    const avg = card.entities[3].state;
    const stateTools = card.cardTools.getBySection('states');
    return {
      counters, published, avg, sameArray: card.entities === entities,
      stateTools: stateTools.map((tool) => tool.state),
      text: card.shadowRoot.textContent,
      groupX: card.cardLayout.activeGroupConfigs[0].xpos,
      opacity: card.activeCardStyles.opacity,
      animationOpacity: card.cardAnimations.styles.states[0].opacity,
    };
  });
  expect(result.counters).toEqual({ hass: 1, graph: 1, source: 1, history: 1 });
  expect(result.sameArray).toBe(true);
  expect(result.published).toHaveLength(8);
  expect(result.published).not.toContain('unavailable');
  expect(result.published[7]).toBe('avg');
  expect(Number(result.published[0])).toBe(5);
  expect(Number(result.published[2])).toBe(20);
  expect(result.stateTools).toEqual([result.avg, result.avg]);
  expect(result.text).toContain(`avg=${result.avg}`);
  expect(result.groupX).toBe(50);
  expect(result.opacity).toBe(1);
  expect(result.animationOpacity).toBe('1');
  expect(errors).toEqual([]);
  await page.evaluate(() => window.lifecycle.card.remove());
});

test('local shrink reuses history and re-expansion fetches its pruned range without HA re-entry', async ({ page }) => {
  const errors = await loadCard(page);
  await page.evaluate(() => window.lifecycle.requests[0].accept([window.lifecycle.rows]));
  await page.waitForFunction(() => window.lifecycle.graph.sparklineSeries.primaryItem.requestState === 'loaded');
  await page.evaluate(() => window.lifecycle.card.cardInputEntities.setNumberValue('fhs_input_number.days', 14));
  await page.waitForFunction(() => window.lifecycle.requests.length === 2);
  await page.evaluate(() => window.lifecycle.requests[1].accept([window.lifecycle.rows]));
  await page.waitForFunction(() => window.lifecycle.graph.sparklineSeries.primaryItem.requestState === 'loaded' && window.lifecycle.card.entities[7].state === '14');
  const expanded = await page.evaluate(() => window.lifecycle.graph.getSeriesResult());

  await page.evaluate(() => window.lifecycle.card.cardInputEntities.setNumberValue('fhs_input_number.days', 1));
  await page.waitForFunction(() => window.lifecycle.card.entities[7].state === '1');
  expect(await page.evaluate(() => window.lifecycle.counters.history)).toBe(2);
  await page.evaluate(() => window.lifecycle.card.cardInputEntities.setNumberValue('fhs_input_number.days', 14));
  await page.waitForFunction(() => window.lifecycle.requests.length === 3);
  await page.evaluate(() => window.lifecycle.requests[2].accept([window.lifecycle.rows]));
  await page.waitForFunction(() => window.lifecycle.graph.sparklineSeries.primaryItem.requestState === 'loaded' && window.lifecycle.card.entities[7].state === '14');
  const final = await page.evaluate(() => ({
    counters: window.lifecycle.counters,
    result: window.lifecycle.graph.getSeriesResult(),
    sameArray: window.lifecycle.entities === window.lifecycle.card.entities,
    requestState: window.lifecycle.graph.sparklineSeries.primaryItem.requestState,
  }));
  expect(final.counters.hass).toBe(1);
  expect(final.counters.history).toBe(3);
  expect(final.requestState).toBe('loaded');
  expect(final.result).toEqual(expanded);
  expect(final.sameArray).toBe(true);
  expect(errors).toEqual([]);
  await page.evaluate(() => window.lifecycle.card.remove());
});

test('elapsed bins and palette paint finish locally without source or request work', async ({ page }) => {
  const errors = await loadCard(page);
  await page.evaluate(() => window.lifecycle.requests[0].accept([window.lifecycle.rows]));
  await page.waitForFunction(() => window.lifecycle.graph.sparklineSeries.primaryItem.requestState === 'loaded');
  const initial = await page.evaluate(() => ({ ...window.lifecycle.counters }));
  // History schedules just beyond the exact boundary so the new bin is active.
  await page.clock.runFor(60 * 60 * 1000 + 11);
  const afterBin = await page.evaluate(() => ({ ...window.lifecycle.counters }));
  expect(afterBin).toEqual({ ...initial, graph: initial.graph + 1 });
  await page.route('http://fhs.test/palette.json', (route) => route.fulfill({
    json: { ref: {}, modes: { dark: { 'fhs-test-line': '#123456' }, light: { 'fhs-test-line': '#abcdef' } } },
  }));
  const afterPaint = await page.evaluate(async () => {
    const { card, counters } = window.lifecycle;
    // Exercise the real asynchronous completion callback, not just its target.
    await card.cardTheme.loadPalettes({ test: 'http://fhs.test/palette.json' });
    await card.updateComplete;
    return { counters: { ...counters }, color: card.style.getPropertyValue('--fhs-test-line') };
  });
  expect(afterPaint.counters).toEqual(afterBin);
  expect(afterPaint.color).toBe('#123456');
  expect(errors).toEqual([]);
  await page.evaluate(() => window.lifecycle.card.remove());
});

test('replacement ignores old history and reconnect resumes through one external HA pass', async ({ page }) => {
  const errors = await loadCard(page);
  await page.evaluate(() => {
    const { card, hass, config } = window.lifecycle;
    let publications = 0;
    const publish = card.updateSparklineResult.bind(card);
    card.updateSparklineResult = (...args) => { publications++; return publish(...args); };
    window.lifecycle.publications = () => publications;
    card.setConfig(config);
    window.lifecycle.graph = card.cardTools.getBySection('sparklines')[0];
    card.hass = hass;
  });
  await page.waitForFunction(() => window.lifecycle.requests.length === 2);
  await page.evaluate(() => window.lifecycle.requests[0].accept([[{ ...window.lifecycle.rows[0], state: '999' }]]));
  expect(await page.evaluate(() => window.lifecycle.publications())).toBe(0);
  expect(await page.evaluate(() => window.lifecycle.card.entities[3].state)).toBe('unavailable');
  await page.evaluate(() => window.lifecycle.requests[1].accept([window.lifecycle.rows]));
  await page.waitForFunction(() => window.lifecycle.graph.sparklineSeries.primaryItem.requestState === 'loaded');
  expect(await page.evaluate(() => window.lifecycle.publications())).toBe(1);
  const loadedAvg = await page.evaluate(() => window.lifecycle.card.entities[3].state);

  await page.evaluate(() => {
    const { card, hass } = window.lifecycle;
    card.remove();
    document.querySelector('#host').append(card);
    card.hass = hass;
  });
  await page.waitForFunction(() => window.lifecycle.requests.length === 3);
  await page.evaluate(() => window.lifecycle.requests[2].accept([window.lifecycle.rows]));
  await page.waitForFunction(() => window.lifecycle.graph.sparklineSeries.primaryItem.requestState === 'loaded');
  expect(await page.evaluate(() => window.lifecycle.card.entities[3].state)).toBe(loadedAvg);
  expect(await page.evaluate(() => window.lifecycle.counters.hass)).toBe(3);
  expect(await page.evaluate(() => window.lifecycle.publications())).toBe(2);
  expect(errors).toEqual([]);
  await page.evaluate(() => window.lifecycle.card.remove());
});

test('partial, empty and failed series do not publish retained statistics as new data', async ({ page }) => {
  const errors = await loadCard(page, { multiple: true, calendar: true });
  await page.waitForFunction(() => window.lifecycle.requests.length === 2);
  // Yesterday has no live sample; one accepted source still waits for its peer.
  await page.evaluate(() => window.lifecycle.requests[0].accept([window.lifecycle.rows]));
  await page.waitForFunction(() => window.lifecycle.graph.sparklineSeries.primaryItem.requestState === 'loaded');
  expect(await page.evaluate(() => window.lifecycle.card.entities[3].state)).toBe('unavailable');
  await page.evaluate(() => window.lifecycle.requests[1].accept([]));
  await page.waitForFunction(() => window.lifecycle.graph.sparklineSeries.items[1].requestState === 'loaded');
  const complete = await page.evaluate(() => ({
    primary: window.lifecycle.card.entities[3].state,
    other: window.lifecycle.card.entities[11].state,
    otherData: window.lifecycle.graph.sparklineSeries.items[1].dataState,
    counters: { ...window.lifecycle.counters },
  }));
  expect(complete.primary).not.toBe('unavailable');
  expect(complete.other).toBe('unavailable');
  expect(complete.otherData).toBe('empty');

  await page.evaluate(() => window.lifecycle.card.cardInputEntities.setNumberValue('fhs_input_number.days', 14));
  await page.waitForFunction(() => window.lifecycle.requests.length === 4);
  await page.evaluate(() => {
    window.lifecycle.requests[2].accept([window.lifecycle.rows]);
    window.lifecycle.requests[3].reject(new Error('HA history unavailable'));
  });
  await page.waitForFunction(() => window.lifecycle.graph.sparklineSeries.items[1].requestState === 'error');
  expect(await page.evaluate(() => window.lifecycle.card.entities[3].state)).toBe('unavailable');
  // Only the failed peer retries; completion activates the shared new geometry.
  await page.clock.runFor(30 * 1000 + 1);
  await page.waitForFunction(() => window.lifecycle.requests.length === 5);
  await page.evaluate(() => window.lifecycle.requests[4].accept([window.lifecycle.rows]));
  await page.waitForFunction(() => window.lifecycle.graph.sparklineSeries.items[1].requestState === 'loaded');
  expect(await page.evaluate(() => window.lifecycle.card.entities[3].state)).not.toBe('unavailable');
  expect(await page.evaluate(() => window.lifecycle.card.entities[11].state)).not.toBe('unavailable');
  expect(await page.evaluate(() => window.lifecycle.graph.graphConfig.period.calendar.duration.hour)).toBe(14 * 24);
  expect(await page.evaluate(() => window.lifecycle.counters.hass)).toBe(1);
  expect(errors).toEqual([]);
  await page.evaluate(() => window.lifecycle.card.remove());
});
