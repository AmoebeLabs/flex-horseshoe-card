import {
  assertNoBrowserErrors,
  beginCdpMeasurement,
  makeRunMetadata,
  openBundlePage,
  settleCards,
} from './performance-common.mjs';

const CARD_COUNT = 24;
const STATIC_FILL = '#1565c0';
const DYNAMIC_FILL = '[[[ return Number(state) >= 20.5 ? "#d32f2f" : "#1565c0"; ]]]';

const scenarioDefinitions = {
  'P21-A': { dynamic: false, update: 'unrelated', expectedState: '20', workload: 'Irrelevant HA state update with static config.' },
  'P21-B': { dynamic: true, update: 'unrelated', expectedState: '20', workload: 'Irrelevant HA state update with marked JavaScript config.' },
  'P21-C': { dynamic: false, update: 'visible', expectedState: '21', workload: 'Declared entity changes from 20.1 to 21.1; rounded text changes.' },
  'P21-D': { dynamic: false, update: 'equal', expectedState: '20', workload: 'Declared entity changes from 20.1 to 20.4; rounded text and paint stay equal.' },
  'P21-E': { dynamic: true, update: 'equal', expectedState: '20', workload: 'Declared entity changes; JavaScript config evaluates to the existing fill.' },
  'P21-F': { dynamic: true, update: 'visible', expectedState: '21', workload: 'Declared entity changes; JavaScript config evaluates to a new fill.' },
};

async function createUpdateFixture(page, definition) {
  await page.evaluate(({ cardCount, dynamic, expectedState }) => {
    const timestamp = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const states = {
      'sensor.noise': {
        entity_id: 'sensor.noise', state: '0', attributes: { friendly_name: 'Noise' },
        last_changed: timestamp, last_updated: timestamp,
      },
    };
    const entityIds = Array.from({ length: cardCount }, (_, index) => `sensor.power_${String(index).padStart(2, '0')}`);
    entityIds.forEach((entityId) => {
      states[entityId] = {
        entity_id: entityId,
        state: '20.1',
        attributes: { friendly_name: 'Power', unit_of_measurement: 'W' },
        last_changed: timestamp,
        last_updated: timestamp,
      };
    });
    const hass = {
      states,
      connection: new EventTarget(),
      locale: { language: 'en', number_format: 'language', time_format: 'language' },
      config: { time_zone: 'UTC' },
      themes: { darkMode: true, themes: {} },
      entities: {}, devices: {}, areas: {}, floors: {}, user: { name: 'Plan 21 benchmark' },
      formatEntityName: (entity) => entity.attributes.friendly_name,
      formatEntityState: (entity) => entity.state,
      formatEntityStateToParts: (entity, value) => [{ type: 'value', value: value ?? entity.state }],
    };
    const cards = entityIds.map((entityId, index) => {
      const card = document.createElement('flex-horseshoe-card');
      card.lovelace = { config: {} };
      card.setConfig({
        type: 'custom:flex-horseshoe-card',
        entities: [{ entity: entityId, decimals: 0 }],
        dev: { performance: true, debug: false },
        layout: {
          states: [{
            id: `reading-${index}`, entity_index: 0, xpos: 50, ypos: 50,
            show: { uom: 'none' },
            styles: { fill: dynamic ? '[[[ return Number(state) >= 20.5 ? "#d32f2f" : "#1565c0"; ]]]' : '#1565c0' },
          }],
        },
      });
      document.querySelector('#host').append(card);
      card.hass = hass;
      return card;
    });
    window.plan21 = { cards, hass, entityIds, expectedState };
  }, { cardCount: CARD_COUNT, dynamic: definition.dynamic, expectedState: definition.expectedState });

  await page.waitForFunction(() => window.plan21.cards.every((card) => (
    card.shadowRoot.querySelector('.state__value')?.textContent.trim() === '20'
  )));
  const cards = Array.from({ length: CARD_COUNT });
  await settleCards(page, cards);
  const initial = await page.evaluate(() => ({
    stateValues: window.plan21.cards.map((card) => card.shadowRoot.querySelector('.state__value')?.textContent.trim()),
    dynamicTools: window.plan21.cards.map((card) => card.cardTools.getRenderableTools().some((tool) => tool.hasJavascript)),
  }));
  if (initial.stateValues.length !== CARD_COUNT || initial.stateValues.some((value) => value !== '20')) {
    throw new Error('Update fixture did not settle to the identical initial text on all 24 cards.');
  }
  if (initial.dynamicTools.some((dynamic) => dynamic !== definition.dynamic)) {
    throw new Error(`JavaScript fixture mismatch: expected dynamic=${definition.dynamic}.`);
  }
  return cards;
}

async function instrumentUpdateFixture(page) {
  await page.evaluate((cardCount) => {
    const counters = {
      setHassCalls: 0,
      javascriptEvaluations: 0,
      entityConfigEvaluations: 0,
      groupUpdates: 0,
      cardRuntimeConfigPasses: 0,
      toolRuntimeConfigUpdates: 0,
      configInvalidations: 0,
      configObjectReplacements: 0,
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
      wrap(card.templates, 'evaluateJsTemplate', 'javascriptEvaluations', 'card.templates');
      wrap(card.cardEntities, 'buildRuntimeEntityConfigs', 'entityConfigEvaluations', 'card.cardEntities');
      wrap(card.cardLayout, 'updateGroups', 'groupUpdates', 'card.cardLayout');
      wrap(card.cardTools, 'updateRuntimeConfig', 'cardRuntimeConfigPasses', 'card.cardTools');
      wrap(card, 'requestUpdate', 'requestUpdate', 'card');
      wrap(card, 'render', 'render', 'card');

      for (const tool of card.cardTools.getRenderableTools()) {
        if (typeof tool.updateRuntimeConfig !== 'function') throw new Error('Required renderable tool.updateRuntimeConfig is unavailable.');
        const original = tool.updateRuntimeConfig;
        tool.updateRuntimeConfig = function countToolConfigWork(...args) {
          counters.toolRuntimeConfigUpdates += 1;
          const oldConfig = this.config;
          const result = original.apply(this, args);
          if (this.configurationChanged) counters.configInvalidations += 1;
          if (this.config !== oldConfig) counters.configObjectReplacements += 1;
          return result;
        };
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
  }, CARD_COUNT);
}

async function deliverScenarioUpdate(page, definition) {
  return page.evaluate(async ({ update }) => {
    const { cards, hass, entityIds } = window.plan21;
    let nextHass;
    if (update === 'unrelated') {
      nextHass = {
        ...hass,
        states: { ...hass.states, 'sensor.noise': { ...hass.states['sensor.noise'], state: '1' } },
      };
    } else {
      const nextState = update === 'visible' ? '21.1' : '20.4';
      const states = { ...hass.states };
      entityIds.forEach((entityId) => {
        states[entityId] = { ...states[entityId], state: nextState, last_updated: new Date().toISOString() };
      });
      nextHass = { ...hass, states };
    }

    const startedAt = performance.now();
    cards.forEach((card) => { card.hass = nextHass; });
    window.plan21.counters && (window.plan21.counters.setHassCalls += cards.length);
    await Promise.all(cards.map((card) => card.updateComplete));
    await new Promise((resolveFrame) => requestAnimationFrame(() => requestAnimationFrame(resolveFrame)));
    await Promise.all(cards.map((card) => card.updateComplete));
    const wallMs = performance.now() - startedAt;
    const stateValues = cards.map((card) => card.shadowRoot.querySelector('.state__value')?.textContent.trim());
    const fills = cards.map((card) => getComputedStyle(card.shadowRoot.querySelector('.state__value')).fill);
    return { wallMs, stateValues, fills };
  }, { update: definition.update });
}

async function runOnePass(browser, build, scenario, definition, instrument) {
  const { page, browserErrors } = await openBundlePage(browser, build.bundle);
  try {
    const cards = await createUpdateFixture(page, definition);
    if (instrument) await instrumentUpdateFixture(page);
    if (!instrument) await page.evaluate(() => { performance.clearMeasures(); performance.clearMarks(); });
    const cdp = instrument ? undefined : await beginCdpMeasurement(page);
    const result = await deliverScenarioUpdate(page, definition);
    const cpuMs = cdp ? await cdp.finish() : undefined;
    const finalState = await page.evaluate(() => window.plan21.hass.states[window.plan21.entityIds[0]].state);
    const expectedVisible = definition.expectedState;
    if (result.stateValues.some((value) => value !== expectedVisible)) {
      throw new Error(`${scenario}/${build.role} did not settle visible text to '${expectedVisible}': ${JSON.stringify(result.stateValues)}`);
    }
    if (result.stateValues.length !== CARD_COUNT) throw new Error(`${scenario}/${build.role} did not render all 24 cards.`);
    if (definition.dynamic && scenario === 'P21-F' && result.fills.some((fill) => fill !== 'rgb(211, 47, 47)')) {
      throw new Error(`${scenario}/${build.role} did not publish the dynamic red fill: ${JSON.stringify(result.fills)}`);
    }
    if (definition.dynamic && scenario !== 'P21-F' && result.fills.some((fill) => fill !== 'rgb(21, 101, 192)')) {
      throw new Error(`${scenario}/${build.role} unexpectedly changed dynamic paint: ${JSON.stringify(result.fills)}`);
    }
    const operations = instrument ? await page.evaluate(() => ({ ...window.plan21.counters })) : undefined;
    if (instrument) {
      if (operations.setHassCalls !== CARD_COUNT) throw new Error(`${scenario} expected 24 measured hass deliveries; got ${operations.setHassCalls}.`);
      const postBaselineB = scenario === 'P21-B' && build.role === 'candidate' && build.isPostBaselineBundle;
      const shouldEvaluateJs = definition.dynamic && scenario !== 'P21-A' && !postBaselineB;
      if (shouldEvaluateJs && operations.javascriptEvaluations === 0) throw new Error(`${scenario} expected marked JavaScript evaluation but counted none.`);
      if (!shouldEvaluateJs && operations.javascriptEvaluations !== 0) throw new Error(`${scenario} unexpectedly evaluated JavaScript ${operations.javascriptEvaluations} times.`);
      if (operations.presentationDiffAvailable !== 0 && operations.presentationDiffAvailable !== CARD_COUNT) {
        throw new Error(`${scenario} found presentation-gate methods on only some cards.`);
      }
      if (scenario === 'P21-E' && operations.configInvalidations !== 0) {
        throw new Error(`P21-E expected unchanged evaluated config; got ${operations.configInvalidations} config invalidations.`);
      }
      if (scenario === 'P21-F' && operations.configInvalidations === 0) {
        throw new Error('P21-F expected changed evaluated config but counted no config invalidations.');
      }
      if (postBaselineB) {
        const expectedZero = ['javascriptEvaluations', 'entityConfigEvaluations', 'groupUpdates', 'cardRuntimeConfigPasses',
          'toolRuntimeConfigUpdates', 'configInvalidations', 'requestUpdate', 'render'];
        const nonzero = expectedZero.filter((key) => operations[key] !== 0);
        if (nonzero.length) throw new Error(`Post-baseline P21-B expected zero work for ${expectedZero.join(', ')}; observed ${nonzero.map((key) => `${key}=${operations[key]}`).join(', ')}.`);
      }
    }
    assertNoBrowserErrors(browserErrors, scenario, build.role);
    const userTiming = instrument ? undefined : await page.evaluate(() => {
      const groups = new Map();
      performance.getEntriesByType('measure').filter((entry) => entry.name.startsWith('FHS:')).forEach((entry) => {
        const group = groups.get(entry.name) ?? { count: 0, totalMs: 0 };
        group.count += 1;
        group.totalMs += entry.duration;
        groups.set(entry.name, group);
      });
      return Object.fromEntries([...groups.entries()].map(([name, value]) => [name, {
        count: value.count,
        totalMs: Math.round(value.totalMs * 100) / 100,
        meanMs: Math.round(value.totalMs / value.count * 100) / 100,
      }]));
    });
    return {
      scenario,
      buildRole: build.role,
      pass: instrument ? 'operation-counters' : 'unwrapped-timing',
      inputStateAfter: finalState,
      wallMs: instrument ? undefined : result.wallMs,
      cpuMs,
      operations,
      userTiming,
      visibleState: expectedVisible,
      visibleFills: [...new Set(result.fills)],
      browserErrors,
      settled: true,
    };
  } finally {
    await page.close();
  }
}

export async function runUpdateScenarios(browser, browserVersion, build, scenarios) {
  const results = [];
  for (const scenario of scenarios) {
    const definition = scenarioDefinitions[scenario];
    if (!definition) continue;
    const timing = await runOnePass(browser, build, scenario, definition, false);
    const operations = await runOnePass(browser, build, scenario, definition, true);
    results.push({
      metadata: makeRunMetadata({
        scenario,
        build,
        browserVersion,
        cardCount: CARD_COUNT,
        warmupUpdates: 0,
        measuredUpdates: 1,
        workload: definition.workload,
      }),
      timing,
      operationPass: operations,
    });
  }
  return results;
}
