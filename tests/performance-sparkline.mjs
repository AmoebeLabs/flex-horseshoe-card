import {
  assertNoBrowserErrors,
  beginCdpMeasurement,
  makeRunMetadata,
  openBundlePage,
} from './performance-common.mjs';

const CARD_COUNT = 24;
const WARMUP_UPDATES = 7;
const MEASURED_UPDATES = 15;
const TOTAL_UPDATES = WARMUP_UPDATES + MEASURED_UPDATES;

function workloadFor(scenario) {
  if (scenario === 'P21-G') {
    return {
      rows: 800,
      days: 1,
      intervalMs: 108000,
      period: { hour: 24 },
      description: 'Historical 24-card rolling 24-hour Sparkline workload; 800 rows/card; 12 bins/hour.',
    };
  }
  return {
    rows: 20160,
    days: 14,
    intervalMs: 60000,
    period: { day: 14 },
    description: 'Heavy 24-card rolling 14-day Sparkline workload; 20,160 rows/card; 12 bins/hour.',
  };
}

async function createSparklineFixture(page, workload) {
  await page.evaluate(({ cardCount, rowsCount, days, intervalMs, period }) => {
    const now = Date.now();
    const entity = {
      entity_id: 'sensor.power', state: '20',
      attributes: { friendly_name: 'Power', unit_of_measurement: 'W' },
      last_changed: new Date(now - 60000).toISOString(),
      last_updated: new Date(now - 60000).toISOString(),
    };
    const rows = Array.from({ length: rowsCount }, (_, index) => ({
      ...entity,
      state: String(20 + Math.sin(index / 20)),
      last_changed: new Date(now - days * 86400000 + index * intervalMs).toISOString(),
    }));
    const counters = { historyRequests: 0 };
    const hass = {
      states: { [entity.entity_id]: entity }, connection: new EventTarget(),
      locale: { language: 'en', number_format: 'language', time_format: 'language' },
      config: { time_zone: 'UTC' }, themes: { darkMode: true, themes: {} },
      entities: {}, devices: {}, areas: {}, floors: {}, user: { name: 'Plan 21 benchmark' },
      formatEntityName: (state) => state.attributes.friendly_name,
      formatEntityState: (state) => state.state,
      formatEntityStateToParts: (state, value) => [{ type: 'value', value: value ?? state.state }],
      callApi: async () => { counters.historyRequests += 1; return [rows]; },
    };
    const cards = [];
    for (let index = 0; index < cardCount; index += 1) {
      const card = document.createElement('flex-horseshoe-card');
      card.lovelace = { config: {} };
      card.setConfig({
        type: 'custom:flex-horseshoe-card',
        entities: [{ entity: entity.entity_id }],
        dev: { performance: true, debug: false },
        layout: { sparklines: [{
          id: 'history', entity_index: 0, xpos: 50, ypos: 50, width: 90, height: 60,
          period: { type: 'rolling_window', rolling_window: { duration: period, bins: { per_hour: 12 } } },
          sparkline: { show: { chart_type: 'line', line: true, grid: true, labels: true } },
        }] },
      });
      document.querySelector('#host').append(card);
      card.hass = hass;
      cards.push(card);
    }
    window.plan21 = { cards, hass, counters, rows, rowsCount };
  }, { cardCount: CARD_COUNT, rowsCount: workload.rows, days: workload.days, intervalMs: workload.intervalMs, period: workload.period });

  await page.waitForFunction(() => window.plan21.cards.every((card) => (
    card.cardTools.getBySection('sparklines')[0].primaryGraph.coords.length > 0
  )), undefined, { timeout: 180000 });
  await page.evaluate(async () => {
    await Promise.all(window.plan21.cards.map((card) => card.updateComplete));
    await new Promise((resolveFrame) => requestAnimationFrame(() => requestAnimationFrame(resolveFrame)));
    await Promise.all(window.plan21.cards.map((card) => card.updateComplete));
  });
  const ready = await page.evaluate(() => ({
    cards: window.plan21.cards.length,
    rows: window.plan21.rowsCount,
    graphs: window.plan21.cards.map((card) => card.cardTools.getBySection('sparklines')[0].primaryGraph.coords.length),
    initialHistoryRequests: window.plan21.counters.historyRequests,
  }));
  if (ready.cards !== CARD_COUNT || ready.graphs.some((count) => count === 0)) {
    throw new Error(`Sparkline fixture failed to settle: ${JSON.stringify(ready)}`);
  }
  if (ready.initialHistoryRequests === 0) throw new Error('Sparkline fixture did not issue a History request.');
  await page.evaluate((requestCount) => { window.plan21.initialHistoryRequests = requestCount; }, ready.initialHistoryRequests);
  return ready;
}

async function instrumentSparklineFixture(page) {
  await page.evaluate((cardCount) => {
    const counters = {
      setHassCalls: 0,
      historyRequests: 0,
      buildSeriesRows: 0,
      pruneActiveRows: 0,
      processData: 0,
      updateStatistics: 0,
      calculateGeometry: 0,
      getPath: 0,
      calculateAxisMargin: 0,
      updateGraphFromSeries: 0,
      updateActivePointer: 0,
      requestUpdate: 0,
      render: 0,
      presentationDiffCalls: 0,
      presentationDiffAvailable: 0,
    };
    const wrap = (owner, method, key, context) => {
      if (!owner || typeof owner[method] !== 'function') throw new Error(`Required benchmark operation '${context}.${method}' is unavailable.`);
      const original = owner[method];
      owner[method] = function countedOperation(...args) {
        counters[key] += 1;
        return original.apply(this, args);
      };
    };
    for (const card of window.plan21.cards.slice(0, cardCount)) {
      const [tool] = card.cardTools.getBySection('sparklines');
      if (!tool) throw new Error('Required Sparkline tool is missing.');
      const operations = [
        [tool.sparklineHistory, 'buildSeriesRows', 'buildSeriesRows'],
        [tool.sparklineHistory, 'pruneActiveRows', 'pruneActiveRows'],
        [tool.primaryGraph, 'processData', 'processData'],
        [tool.primaryGraph, 'updateStatistics', 'updateStatistics'],
        [tool.primaryGraph, 'calculateGeometry', 'calculateGeometry'],
        [tool.primaryGraph, 'getPath', 'getPath'],
        [tool, 'calculateAxisMargin', 'calculateAxisMargin'],
        [tool, 'updateGraphFromSeries', 'updateGraphFromSeries'],
        [tool, 'updateActivePointer', 'updateActivePointer'],
        [card, 'requestUpdate', 'requestUpdate'],
        [card, 'render', 'render'],
      ];
      for (const [owner, method, key] of operations) {
        wrap(owner, method, key, 'sparkline owner');
      }
      if (typeof card.cardTools.hasPresentationChanged === 'function') {
        counters.presentationDiffAvailable += 1;
        const original = card.cardTools.hasPresentationChanged.bind(card.cardTools);
        card.cardTools.hasPresentationChanged = (...args) => {
          counters.presentationDiffCalls += 1;
          return original(...args);
        };
      }
    }
    window.plan21.counters = counters;
    window.plan21.hass.callApi = async () => { counters.historyRequests += 1; return [window.plan21.rows]; };
  }, CARD_COUNT);
}

async function applyUpdate(page, index) {
  return page.evaluate(async (updateIndex) => {
    const fixture = window.plan21;
    if (updateIndex > 1) window.setBenchmarkNow(Date.now() + 1000);
    const previousEntity = fixture.hass.states['sensor.power'];
    const nextEntity = updateIndex === 0 ? previousEntity : {
      ...previousEntity,
      state: String(20 + Math.max(0, updateIndex - 1) / 100),
      last_changed: updateIndex > 1 ? new Date().toISOString() : previousEntity.last_changed,
      last_updated: new Date().toISOString(),
    };
    const nextHass = { ...fixture.hass, states: { ...fixture.hass.states, 'sensor.power': nextEntity } };
    const startedAt = performance.now();
    fixture.cards.forEach((card) => { card.hass = nextHass; });
    if (fixture.counters.setHassCalls !== undefined) fixture.counters.setHassCalls += fixture.cards.length;
    await Promise.all(fixture.cards.map((card) => card.updateComplete));
    fixture.hass = nextHass;
    return performance.now() - startedAt;
  }, index);
}

async function runSparklinePass(browser, browserVersion, build, scenario, workload, instrument) {
  const { page, browserErrors } = await openBundlePage(browser, build.bundle);
  try {
    page.setDefaultTimeout(180000);
    const ready = await createSparklineFixture(page, workload);
    if (instrument) {
      await instrumentSparklineFixture(page);
    }
    const warmupMs = [];
    for (let index = 0; index < WARMUP_UPDATES; index += 1) {
      warmupMs.push(await applyUpdate(page, index));
      await page.waitForTimeout(30);
    }
    if (instrument) {
      await page.evaluate(() => {
        const counters = window.plan21.counters;
        Object.keys(counters).forEach((key) => {
          if (key !== 'presentationDiffAvailable') counters[key] = 0;
        });
      });
    }
    const cdp = instrument ? undefined : await beginCdpMeasurement(page);
    const measuredMs = [];
    for (let index = WARMUP_UPDATES; index < TOTAL_UPDATES; index += 1) {
      measuredMs.push(await applyUpdate(page, index));
      await page.waitForTimeout(30);
    }
    const cpuMs = cdp ? await cdp.finish() : undefined;
    await page.evaluate(async () => {
      await Promise.all(window.plan21.cards.map((card) => card.updateComplete));
      await new Promise((resolveFrame) => requestAnimationFrame(() => requestAnimationFrame(resolveFrame)));
      await Promise.all(window.plan21.cards.map((card) => card.updateComplete));
    });
    const operations = instrument ? await page.evaluate(() => ({
      ...window.plan21.counters,
      historyRequestsInitial: window.plan21.initialHistoryRequests,
      cards: window.plan21.cards.length,
      graphsWithData: window.plan21.cards.filter((card) => card.cardTools.getBySection('sparklines')[0].primaryGraph.coords.length > 0).length,
    })) : undefined;
    assertNoBrowserErrors(browserErrors, scenario, build.role);
    return {
      metadata: makeRunMetadata({
        scenario,
        build,
        browserVersion,
        cardCount: CARD_COUNT,
        rowCount: workload.rows,
        binsPerHour: 12,
        warmupUpdates: WARMUP_UPDATES,
        measuredUpdates: MEASURED_UPDATES,
        workload: workload.description,
      }),
      pass: instrument ? 'operation-counters' : 'unwrapped-timing',
      fixture: ready,
      warmupMeanMs: warmupMs.reduce((sum, value) => sum + value, 0) / warmupMs.length,
      timing: instrument ? undefined : {
        updateWallMs: measuredMs,
        meanUpdateMs: measuredMs.reduce((sum, value) => sum + value, 0) / measuredMs.length,
        medianUpdateMs: [...measuredMs].sort((a, b) => a - b)[Math.floor(measuredMs.length / 2)],
        cpuMs,
      },
      operations,
      browserErrors,
      settled: true,
    };
  } finally {
    await page.close();
  }
}

export async function runSparklineScenarios(browser, browserVersion, build, scenarios) {
  const results = [];
  for (const scenario of scenarios.filter((value) => value === 'P21-G' || value === 'P21-H')) {
    const workload = workloadFor(scenario);
    const timing = await runSparklinePass(browser, browserVersion, build, scenario, workload, false);
    const counters = await runSparklinePass(browser, browserVersion, build, scenario, workload, true);
    if (counters.operations.cards !== CARD_COUNT || counters.operations.graphsWithData !== CARD_COUNT) {
      throw new Error(`${scenario}/${build.role} counter pass did not settle 24 populated graphs.`);
    }
    results.push({ scenario, timing, counterPass: counters });
  }
  return results;
}
