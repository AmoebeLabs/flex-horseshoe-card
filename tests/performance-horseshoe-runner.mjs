import {
  assertNoBrowserErrors,
  beginCdpMeasurement,
  DEFAULT_VIEWPORT,
  INPUT_CLOCK,
  makeRunMetadata,
} from './performance-common.mjs';
import { loadHorseshoeCacheCard } from './horseshoe-cache-fixture.js';

const WARMUP_UPDATES = 40;
const REPETITIONS = 5;
const UPDATES_PER_REPETITION = 200;
const MEASURED_UPDATES = REPETITIONS * UPDATES_PER_REPETITION;

export async function openHorseshoePage(browser, build) {
  const page = await browser.newPage({ viewport: { ...DEFAULT_VIEWPORT }, deviceScaleFactor: 1 });
  page.setDefaultTimeout(120000);
  const browserErrors = [];
  page.on('pageerror', (error) => browserErrors.push({ type: 'pageerror', message: error.message }));
  page.on('console', (message) => {
    if (message.type() === 'error') browserErrors.push({ type: 'console', message: message.text() });
  });
  await page.addInitScript((fixedEpoch) => {
    const NativeDate = Date;
    window.benchmarkNow = fixedEpoch;
    window.setBenchmarkNow = (value) => { window.benchmarkNow = value; };
    window.Date = class BenchmarkDate extends NativeDate {
      constructor(...args) { super(...(args.length === 0 ? [window.benchmarkNow] : args)); }
      static now() { return window.benchmarkNow; }
    };
  }, Date.parse(INPUT_CLOCK));
  const fixtureErrors = await loadHorseshoeCacheCard(page, build.bundle);
  if (fixtureErrors.length) browserErrors.push(...fixtureErrors.map((message) => ({ type: 'fixture-pageerror', message })));
  return { page, browserErrors };
}

export async function createMappingCards(page) {
  await page.evaluate(() => {
    const fixture = window.horseshoeCache;
    const source = structuredClone(fixture.config);
    const baseGauge = structuredClone(source.layout.horseshoes[0]);
    const definitions = [
      {
        key: 'linear', initial: '25', scale: { min: 0, max: 100, type: 'linear' },
      },
      {
        key: 'spline', initial: '25', scale: {
          min: 0, max: 100, type: 'spline',
          spline: { anchors: [{ value: 0, position: 0 }, { value: 30, position: 0.2 }, { value: 70, position: 0.8 }, { value: 100, position: 1 }] },
        },
      },
      {
        key: 'ranked', initial: 'medium', scale: { min: 0, max: 2, type: 'linear' },
      },
    ];
    const cards = definitions.map((definition) => {
      const entityId = `sensor.mapping_${definition.key}`;
      fixture.hass.states[entityId] = {
        entity_id: entityId,
        state: definition.initial,
        attributes: { friendly_name: `Mapping ${definition.key}`, unit_of_measurement: '' },
        last_changed: '2026-09-27T11:00:00Z',
        last_updated: '2026-09-27T11:00:00Z',
      };
      const gauge = {
        ...baseGauge,
        id: `mapping-${definition.key}`,
        entity_index: 0,
        horseshoe_scale: definition.scale,
      };
      if (definition.key === 'ranked') {
        gauge.horseshoe_state = { ...gauge.horseshoe_state, mode: 'stringstate_mode' };
        gauge.state_map = {
          type: 'rank_state',
          map: [{ state: 'low', rank: 0 }, { state: 'medium', rank: 1 }, { state: 'high', rank: 2 }],
        };
        gauge.color_stops = { colors: [
          { value: 0, rank: 0, color: '#1b5e20' },
          { value: 1, rank: 1, color: '#f9a825' },
          { value: 2, rank: 2, color: '#b71c1c' },
        ] };
      }
      const card = document.createElement('flex-horseshoe-card');
      card.lovelace = { config: {} };
      card.setConfig({
        ...source,
        entities: [{ entity: entityId }],
        layout: { horseshoes: [gauge] },
      });
      document.querySelector('#host').append(card);
      card.hass = fixture.hass;
      return { key: definition.key, entityId, card, initial: definition.initial };
    });
    window.horseshoeMappings = cards;
  });
  await page.waitForFunction(() => window.horseshoeMappings.every(({ card }) => {
    const [gauge] = card.cardTools.getBySection('horseshoes');
    return gauge.geometry.pathGeometry.isReady() && gauge.runtime.valueMapper;
  }));
  await page.evaluate(async () => {
    await Promise.all(window.horseshoeMappings.map(({ card }) => card.updateComplete));
    await new Promise((resolveFrame) => requestAnimationFrame(() => requestAnimationFrame(resolveFrame)));
    await Promise.all(window.horseshoeMappings.map(({ card }) => card.updateComplete));
  });
  const ready = await page.evaluate(() => window.horseshoeMappings.map(({ key, card }) => ({
    key,
    gaugeCount: card.cardTools.getBySection('horseshoes').length,
    mapperReady: Boolean(card.cardTools.getBySection('horseshoes')[0].runtime.valueMapper),
    pathReady: card.cardTools.getBySection('horseshoes')[0].geometry.pathGeometry.isReady(),
  })));
  if (ready.length !== 3 || ready.some((item) => item.gaugeCount !== 1 || !item.mapperReady || !item.pathReady)) {
    throw new Error(`Horseshoe mapping fixtures did not settle: ${JSON.stringify(ready)}`);
  }
  return ready;
}

async function measureMappingInputs(page) {
  return page.evaluate(async ({ warmupUpdates, repetitions, updatesPerRepetition }) => {
    const results = {};
    const cdpByMapping = {};
    for (const entry of window.horseshoeMappings) {
      const [gauge] = entry.card.cardTools.getBySection('horseshoes');
      const source = entry.card._hass.states[entry.entityId];
      const counts = { mapperBuilds: 0, mapperReuse: 0, scaleBuilds: 0, mappingKeyChanges: 0 };
      let updateIndex = 0;
      const update = () => {
        const next = { ...source, state: entry.key === 'ranked' ? ['low', 'medium', 'high'][updateIndex % 3] : String(5 + ((updateIndex * 37) % 900) / 10) };
        const oldMapper = gauge.runtime.valueMapper;
        const oldScale = gauge.runtime.scale;
        const oldKey = gauge.runtime.mappingKey;
        const start = performance.now();
        gauge.setState(next, {});
        const duration = performance.now() - start;
        if (gauge.runtime.valueMapper !== oldMapper) counts.mapperBuilds += 1;
        else counts.mapperReuse += 1;
        if (gauge.runtime.scale !== oldScale) counts.scaleBuilds += 1;
        if (gauge.runtime.mappingKey !== oldKey) counts.mappingKeyChanges += 1;
        updateIndex += 1;
        return duration;
      };
      for (let index = 0; index < warmupUpdates; index += 1) update();
      const cdp = await window.startBenchmarkCdp();
      const updateTimes = [];
      for (let run = 0; run < repetitions; run += 1) {
        for (let index = 0; index < updatesPerRepetition; index += 1) updateTimes.push(update());
      }
      cdpByMapping[entry.key] = await window.finishBenchmarkCdp(cdp);
      results[entry.key] = {
        warmupUpdates,
        measuredUpdates: repetitions * updatesPerRepetition,
        updateTimesMs: updateTimes,
        meanSetStateMs: updateTimes.reduce((sum, value) => sum + value, 0) / updateTimes.length,
        counts,
      };
    }
    return { results, cdpByMapping };
  }, { warmupUpdates: WARMUP_UPDATES, repetitions: REPETITIONS, updatesPerRepetition: UPDATES_PER_REPETITION });
}

async function measureThemeOnly(page) {
  return page.evaluate(async ({ warmupUpdates, repetitions, updatesPerRepetition }) => {
    const cards = [window.horseshoeCache.card, ...window.horseshoeMappings.map(({ card }) => card)];
    const gauges = cards.flatMap((card) => card.cardTools.getBySection('horseshoes'));
    const mapperRefs = gauges.map((gauge) => gauge.runtime.valueMapper);
    const scaleRefs = gauges.map((gauge) => gauge.runtime.scale);
    const pathRefs = gauges.map((gauge) => gauge.geometry.pathGeometry);
    const measurementRefs = gauges.map((gauge) => gauge.geometry.pathGeometry.activeMeasurement);
    const update = async (index) => {
      const baseHass = window.horseshoeCache.hass;
      const nextHass = { ...baseHass, themes: { ...baseHass.themes, darkMode: index % 2 === 0 } };
      const start = performance.now();
      for (const card of cards) card.hass = nextHass;
      window.horseshoeCache.hass = nextHass;
      await Promise.all(cards.map((card) => card.updateComplete));
      return performance.now() - start;
    };
    for (let index = 0; index < warmupUpdates; index += 1) await update(index);
    const cdp = await window.startBenchmarkCdp();
    const updateTimes = [];
    for (let run = 0; run < repetitions; run += 1) {
      for (let index = 0; index < updatesPerRepetition; index += 1) {
        updateTimes.push(await update(warmupUpdates + run * updatesPerRepetition + index));
      }
    }
    const cpuMs = await window.finishBenchmarkCdp(cdp);
    await new Promise((resolveFrame) => requestAnimationFrame(() => requestAnimationFrame(resolveFrame)));
    return {
      warmupUpdates,
      measuredUpdates: repetitions * updatesPerRepetition,
      updateTimesMs: updateTimes,
      meanUpdateMs: updateTimes.reduce((sum, value) => sum + value, 0) / updateTimes.length,
      cpuMs,
      mapperPreserved: gauges.map((gauge, index) => gauge.runtime.valueMapper === mapperRefs[index]),
      scalePreserved: gauges.map((gauge, index) => gauge.runtime.scale === scaleRefs[index]),
      pathGeometryPreserved: gauges.map((gauge, index) => gauge.geometry.pathGeometry === pathRefs[index]),
      pathMeasurementPreserved: gauges.map((gauge, index) => gauge.geometry.pathGeometry.activeMeasurement === measurementRefs[index]),
      darkMode: window.horseshoeCache.hass.themes.darkMode,
    };
  }, { warmupUpdates: WARMUP_UPDATES, repetitions: REPETITIONS, updatesPerRepetition: UPDATES_PER_REPETITION });
}

async function synchronizeMappingEntityStates(page) {
  await page.evaluate(async () => {
    const fixture = window.horseshoeCache;
    const states = { ...fixture.hass.states };
    window.horseshoeMappings.forEach(({ key, entityId, card }) => {
      const [gauge] = card.cardTools.getBySection('horseshoes');
      states[entityId] = gauge.runtime.entity;
      if (states[entityId].entity_id !== entityId) throw new Error(`${key} mapping state is not tied to its declared entity.`);
    });
    const alignedHass = { ...fixture.hass, states };
    fixture.hass = alignedHass;
    for (const card of [fixture.card, ...window.horseshoeMappings.map(({ card }) => card)]) card.hass = alignedHass;
    await Promise.all([fixture.card, ...window.horseshoeMappings.map(({ card }) => card)].map((card) => card.updateComplete));
    await new Promise((resolveFrame) => requestAnimationFrame(() => requestAnimationFrame(resolveFrame)));
    await Promise.all([fixture.card, ...window.horseshoeMappings.map(({ card }) => card)].map((card) => card.updateComplete));
  });
}

async function measureGradientAndPaint(page) {
  return page.evaluate(async ({ warmupUpdates, repetitions, updatesPerRepetition }) => {
    const { card, hass } = window.horseshoeCache;
    const gauges = card.cardTools.getBySection('horseshoes');
    const modes = new Map();
    for (const gauge of gauges) {
      const mode = gauge.paint.stateGradient.mode;
      if (!modes.has(mode)) modes.set(mode, []);
      modes.get(mode).push(gauge);
    }
    if (!modes.has('full') || !modes.has('current')) {
      throw new Error(`Expected both full/current gradient modes; received ${JSON.stringify([...modes.keys()])}`);
    }
    const mounts = gauges.map((gauge) => gauge.stateAnimator.stateLayerElement);
    if (mounts.some((mount) => !mount)) throw new Error('Expected every horseshoe animator to have a mounted state layer.');
    gauges.forEach((gauge) => gauge.stateAnimator.unbindStateLayer());
    const source = hass.states['sensor.load'];
    const gradientResults = {};
    for (const [label, selected] of modes) {
      const priorRanges = selected.map((gauge) => gauge.paint.stateGradient.ranges);
      let rangeReplacements = 0;
      let updateIndex = 0;
      const update = () => {
        const next = { ...source, state: String(5.1234567 + updateIndex * 0.08765432) };
        selected.forEach((gauge, gaugeIndex) => {
          const previous = gauge.paint.stateGradient.ranges;
          gauge.setState(next, {});
          if (gauge.paint.stateGradient.ranges !== previous) rangeReplacements += 1;
          priorRanges[gaugeIndex] = gauge.paint.stateGradient.ranges;
        });
        updateIndex += 1;
      };
      for (let index = 0; index < warmupUpdates; index += 1) update();
      const cdp = await window.startBenchmarkCdp();
      const timingsMs = [];
      for (let run = 0; run < repetitions; run += 1) {
        const start = performance.now();
        for (let index = 0; index < updatesPerRepetition; index += 1) update();
        timingsMs.push(performance.now() - start);
      }
      gradientResults[label] = {
        gauges: selected.length,
        warmupUpdates,
        updatesPerRepetition,
        timingsMs,
        rangeReplacements,
        cpuMs: await window.finishBenchmarkCdp(cdp),
      };
    }

    const pathElements = gauges.map((gauge) => gauge.geometry.pathGeometry.pathElement);
    const pointReads = gauges.map(() => 0);
    const lengthReads = gauges.map(() => 0);
    pathElements.forEach((element, index) => {
      if (typeof element?.getPointAtLength !== 'function' || typeof element.getTotalLength !== 'function') {
        throw new Error(`Required path measurement operations are unavailable on pathElement[${index}].`);
      }
      const nativePoint = element.getPointAtLength.bind(element);
      const nativeLength = element.getTotalLength.bind(element);
      element.getPointAtLength = (distance) => { pointReads[index] += 1; return nativePoint(distance); };
      element.getTotalLength = () => { lengthReads[index] += 1; return nativeLength(); };
    });
    for (let index = 0; index < warmupUpdates; index += 1) {
      const progress = 5.321987 + index * 0.09;
      gauges.forEach((gauge, gaugeIndex) => gauge.stateAnimator.updateStateLayer(mounts[gaugeIndex], progress));
    }
    const cdp = await window.startBenchmarkCdp();
    const paintTimingsMs = [];
    for (let run = 0; run < repetitions; run += 1) {
      const start = performance.now();
      for (let index = 0; index < updatesPerRepetition; index += 1) {
        const progress = 5.321987 + (warmupUpdates + run * updatesPerRepetition + index) * 0.09;
        gauges.forEach((gauge, gaugeIndex) => gauge.stateAnimator.updateStateLayer(mounts[gaugeIndex], progress));
      }
      paintTimingsMs.push(performance.now() - start);
    }
    const paintCpuMs = await window.finishBenchmarkCdp(cdp);
    const before = gauges.map((gauge) => ({
      points: gauge.geometry.pathGeometry.activeMeasurement.points.size,
      tangents: gauge.geometry.pathGeometry.activeMeasurement.tangents.size,
    }));
    const after = gauges.map((gauge) => ({
      points: gauge.geometry.pathGeometry.activeMeasurement.points.size,
      tangents: gauge.geometry.pathGeometry.activeMeasurement.tangents.size,
    }));
    return {
      gradient: gradientResults,
      paint: {
        gauges: gauges.length,
        warmupUpdates,
        updatesPerRepetition,
        timingsMs: paintTimingsMs,
        pointReads,
        lengthReads,
        cpuMs: paintCpuMs,
      },
      pathCache: { before, after },
    };
  }, { warmupUpdates: WARMUP_UPDATES, repetitions: REPETITIONS, updatesPerRepetition: UPDATES_PER_REPETITION });
}

async function installCdpBridge(page) {
  const session = await page.context().newCDPSession(page);
  await session.send('Performance.enable', { timeDomain: 'threadTicks' });
  await page.exposeFunction('startBenchmarkCdp', async () => (await session.send('Performance.getMetrics')).metrics);
  await page.exposeFunction('finishBenchmarkCdp', async (start) => {
    const end = (await session.send('Performance.getMetrics')).metrics;
    const metric = (metrics, name) => {
      const value = metrics.find((entry) => entry.name === name);
      if (!value) throw new Error(`Required Chromium metric ${name} was unavailable.`);
      return value.value;
    };
    return Object.fromEntries(['ThreadTime', 'TaskDuration', 'ScriptDuration', 'LayoutDuration', 'RecalcStyleDuration'].map((name) => [
      name,
      1000 * (metric(end, name) - metric(start, name)),
    ]));
  });
}

async function runHorseshoeBuild(browser, browserVersion, build) {
  const { page, browserErrors } = await openHorseshoePage(browser, build);
  try {
    const mappingFixtures = await createMappingCards(page);
    const originalFixture = await page.evaluate(() => ({
      gaugeCount: window.horseshoeCache.card.cardTools.getBySection('horseshoes').length,
      gradientModes: [...new Set(window.horseshoeCache.card.cardTools.getBySection('horseshoes').map((gauge) => gauge.paint.stateGradient.mode))],
      pathReady: window.horseshoeCache.card.cardTools.getBySection('horseshoes').every((gauge) => gauge.geometry.pathGeometry.isReady()),
      rowCount: 0,
    }));
    if (originalFixture.gaugeCount !== 3 || !originalFixture.pathReady) {
      throw new Error(`Recovered horseshoe fixture mismatch: ${JSON.stringify(originalFixture)}`);
    }
    await installCdpBridge(page);
    const mapping = await measureMappingInputs(page);
    await synchronizeMappingEntityStates(page);
    const theme = await measureThemeOnly(page);
    const paint = await measureGradientAndPaint(page);
    if (theme.pathGeometryPreserved.some((preserved) => !preserved)
      || theme.pathMeasurementPreserved.some((preserved) => !preserved)) {
      throw new Error(`Theme-only update replaced a path geometry or measurement cache: ${JSON.stringify(theme)}`);
    }
    if (paint.paint.pointReads.some((count) => count === 0) || paint.paint.lengthReads.some((count) => count !== 0)) {
      throw new Error(`Paint workload did not exercise cached path sampling as expected: ${JSON.stringify(paint.paint)}`);
    }
    if (paint.pathCache.before.some((before, index) => before.points !== paint.pathCache.after[index].points
      || before.tangents !== paint.pathCache.after[index].tangents)) {
      throw new Error('Paint updates changed the fixed path measurement cache.');
    }
    assertNoBrowserErrors(browserErrors, 'P21-I', build.role);
    const result = {
      metadata: makeRunMetadata({
        scenario: 'P21-I',
        build,
        browserVersion,
        cardCount: 4,
        warmupUpdates: WARMUP_UPDATES,
        measuredUpdates: MEASURED_UPDATES,
        workload: 'Recovered 3-gauge gradient/path fixture plus linear, spline, and ranked mapping cards; 40 warm-ups and 5x200 measured updates per workload.',
      }),
      fixture: { ...originalFixture, mappings: mappingFixtures },
      mapping,
      theme,
      gradientAndPaint: paint,
      browserErrors,
      settled: true,
    };
    return result;
  } finally {
    await page.close();
  }
}

export async function runHorseshoeScenarios(browser, browserVersion, build, scenarios) {
  if (!scenarios.includes('P21-I')) return [];
  const result = await runHorseshoeBuild(browser, browserVersion, build);
  return [result];
}
