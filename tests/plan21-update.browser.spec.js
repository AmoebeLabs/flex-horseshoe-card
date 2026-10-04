import { readFile } from 'node:fs/promises';

import { expect, test } from '@playwright/test';

const now = new Date('2026-09-26T12:00:00.000Z');
const workKeys = [
  'javascript',
  'entityConfigs',
  'groups',
  'sparklineConfig',
  'runtimeConfigs',
  'runtimeStates',
  'animations',
  'toolRuntimeConfigs',
  'toolEntities',
  'toolStates',
  'effectiveStyles',
  'geometry',
  'textMeasurement',
  'translation',
  'requestUpdates',
  'renders',
];
const zeroWork = Object.fromEntries(workKeys.map((key) => [key, 0]));

/** Loads real card instances with controllable HA state and History API delivery. */
async function loadPlan21Cards(page, specs) {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  // Leave transport time before the fixed pause target, including on Firefox.
  await page.clock.install({ time: new Date(now.getTime() - 60_000) });
  await page.clock.pauseAt(now);
  await page.route('http://fhs.test/**', (route) => route.fulfill({
    contentType: 'text/html',
    body: '<body style=\"--primary-text-color:#222;--primary-background-color:#fff;--primary-color:#1565c0;--secondary-background-color:#eee\"><div id=\"host\" style=\"width:600px\"></div></body>',
  }));
  await page.goto('http://fhs.test/plan21-update');
  await page.addScriptTag({
    type: 'module',
    content: await readFile(new URL('../dist/flex-horseshoe-card.js', import.meta.url), 'utf8'),
  });
  await page.evaluate(async ({ cardSpecs, timestamp }) => {
    await customElements.whenDefined('flex-horseshoe-card');
    if (!customElements.get('p21-probe-card')) {
      class Plan21ProbeCard extends HTMLElement {
        constructor() {
          super();
          this.hassAssignments = 0;
        }

        setConfig(config) {
          this.childConfig = config;
        }

        set hass(value) {
          this.currentHass = value;
          this.hassAssignments += 1;
        }
      }
      customElements.define('p21-probe-card', Plan21ProbeCard);
    }
    window.loadCardHelpers = async () => ({
      createCardElement: async (config) => {
        const child = document.createElement(config.type);
        child.setConfig(config);
        return child;
      },
    });

    const changedAt = new Date(timestamp - 30 * 60 * 1000).toISOString();
    const baseStates = {
      'sensor.power': {
        entity_id: 'sensor.power',
        state: '20.1',
        attributes: { friendly_name: 'Power', unit_of_measurement: 'W' },
        last_changed: changedAt,
        last_updated: changedAt,
      },
      'sensor.external': {
        entity_id: 'sensor.external',
        state: '8',
        attributes: { friendly_name: 'External value', unit_of_measurement: '' },
        last_changed: changedAt,
        last_updated: changedAt,
      },
      'sensor.unrelated': {
        entity_id: 'sensor.unrelated',
        state: '1',
        attributes: { friendly_name: 'Unrelated value', unit_of_measurement: '' },
        last_changed: changedAt,
        last_updated: changedAt,
      },
      'sun.sun': {
        entity_id: 'sun.sun',
        state: 'below_horizon',
        attributes: {
          next_rising: '2026-09-27T06:00:00.000Z',
          next_setting: '2026-09-26T18:00:00.000Z',
        },
        last_changed: changedAt,
        last_updated: changedAt,
      },
    };
    window.plan21 = { cards: {} };
    cardSpecs.forEach((spec) => {
      const requests = [];
      const hass = {
        states: structuredClone(baseStates),
        connection: new EventTarget(),
        locale: { language: 'en', number_format: 'language', time_format: '24' },
        config: { time_zone: 'UTC' },
        themes: { darkMode: false, themes: {} },
        entities: {},
        devices: {},
        areas: {},
        floors: {},
        user: { name: 'Plan 21' },
        localize: (key) => key,
        formatEntityName: (state) => state.attributes.friendly_name,
        formatEntityState: (state) => state.state,
        formatEntityStateToParts: (state, value) => [
          { type: 'value', value: value ?? state.state },
          { type: 'unit', value: state.attributes.unit_of_measurement },
        ],
        callApi: (_method, path) => new Promise((resolve) => requests.push({ path, resolve })),
      };
      const card = document.createElement('flex-horseshoe-card');
      card.lovelace = { config: {}, rawConfig: {} };
      card.setConfig(spec.config);
      document.querySelector('#host').append(card);
      card.hass = hass;
      window.plan21.cards[spec.id] = { card, hass, requests };
    });
  }, { cardSpecs: specs, timestamp: now.getTime() });

  const ids = specs.map((spec) => spec.id);
  await page.waitForFunction((cardIds) => cardIds.every((id) => {
    const { card } = window.plan21.cards[id];
    const tools = Object.values(card.cardTools.sections).flat();
    const childCount = Array.isArray(card.config.cards) ? card.config.cards.length : 0;
    return card._hass !== undefined
      && tools.every((tool) => tool.runtimeConfigInitialized)
      && card.childCards.items.length === childCount;
  }), ids);
  await settlePlan21Cards(page, ids);
  return pageErrors;
}

/** Lets each Lit pass and text-measurement frame finish before reading output. */
async function settlePlan21Cards(page, ids) {
  for (let frame = 0; frame < 3; frame += 1) {
    await page.evaluate(async (cardIds) => {
      await Promise.all(cardIds.map((id) => window.plan21.cards[id].card.updateComplete));
    }, ids);
    await page.clock.runFor(34);
  }
  await page.evaluate(async (cardIds) => {
    await Promise.all(cardIds.map((id) => window.plan21.cards[id].card.updateComplete));
  }, ids);
}

/** Wraps existing lifecycle owners so tests count real work, not a test-only diff API. */
async function observePlan21Work(page, ids) {
  await page.evaluate(({ cardIds, keys }) => {
    const wrap = (owner, method, counter, work) => {
      if (typeof owner[method] !== 'function') return;
      const original = owner[method];
      owner[method] = function observedPlan21Work(...args) {
        work[counter] += 1;
        return original.apply(this, args);
      };
    };

    cardIds.forEach((id) => {
      const fixture = window.plan21.cards[id];
      const { card } = fixture;
      const work = Object.fromEntries(keys.map((key) => [key, 0]));
      wrap(card, 'requestUpdate', 'requestUpdates', work);
      wrap(card, 'render', 'renders', work);
      wrap(card.templates, 'getJsTemplateOrValue', 'javascript', work);
      wrap(card.cardEntities, 'buildRuntimeEntityConfigs', 'entityConfigs', work);
      wrap(card.cardLayout, 'updateGroups', 'groups', work);
      wrap(card.cardTools, 'updateSparklineRuntimeConfig', 'sparklineConfig', work);
      wrap(card.cardTools, 'updateRuntimeConfig', 'runtimeConfigs', work);
      wrap(card.cardTools, 'setRuntimeEntityStates', 'runtimeStates', work);
      wrap(card.cardAnimations, 'update', 'animations', work);

      const visited = new Set();
      const observeTool = (tool) => {
        if (visited.has(tool)) return;
        visited.add(tool);
        wrap(tool, 'updateRuntimeConfig', 'toolRuntimeConfigs', work);
        wrap(tool, 'setEntities', 'toolEntities', work);
        wrap(tool, 'setState', 'toolStates', work);
        wrap(tool, 'setEffectiveStyles', 'effectiveStyles', work);
        wrap(tool, 'calculateSvgDimensions', 'geometry', work);
        wrap(tool, 'updateTextMeasurement', 'textMeasurement', work);
        wrap(tool, 'translateConfig', 'translation', work);
        if (tool.getContentTools) tool.getContentTools().forEach(observeTool);
        if (tool.labelTextTool) observeTool(tool.labelTextTool);
        if (tool.childTools) tool.childTools.forEach((child) => observeTool(child.tool));
      };
      Object.values(card.cardTools.sections).flat().forEach(observeTool);
      fixture.work = work;
    });
  }, { cardIds: ids, keys: workKeys });
}

/** Clears lifecycle counters between independent relevant updates. */
async function resetPlan21Work(page, id) {
  await page.evaluate((cardId) => {
    const work = window.plan21.cards[cardId].work;
    Object.keys(work).forEach((key) => { work[key] = 0; });
  }, id);
}

/** Publishes one new entity object through the card's actual hass setter. */
async function deliverPlan21State(page, id, entityId, state) {
  await page.evaluate(({ cardId, entityId, state }) => {
    const fixture = window.plan21.cards[cardId];
    fixture.hass = {
      ...fixture.hass,
      states: {
        ...fixture.hass.states,
        [entityId]: { ...fixture.hass.states[entityId], state },
      },
    };
    fixture.card.hass = fixture.hass;
  }, { cardId: id, entityId, state });
  await settlePlan21Cards(page, [id]);
}

test('unrelated hass delivery stops FHS work but still reaches child cards', async ({ page }) => {
  const errors = await loadPlan21Cards(page, [
    {
      id: 'static',
      config: {
        type: 'custom:flex-horseshoe-card',
        entities: [{ entity: 'sensor.power', decimals: 0 }],
        layout: {
          states: [{ id: 'power', entity_index: 0, xpos: 50, ypos: 50, show: { uom: 'none' } }],
        },
      },
    },
    {
      id: 'dynamic',
      config: {
        type: 'custom:flex-horseshoe-card',
        entities: [{ entity: 'sensor.power' }],
        constants: { gateEvaluations: 0 },
        layout: {
          rectangles: [{
            id: 'dynamic-rectangle',
            entity_index: 0,
            xpos: '[[[ constants.gateEvaluations += 1; return 45; ]]]',
            ypos: 50,
            width: 20,
            height: 10,
            styles: { fill: '#1565c0' },
          }],
        },
        cards: [{
          type: 'p21-probe-card',
          xpos: 50,
          ypos: 50,
          width: 20,
          height: 10,
          frameless: false,
        }],
      },
    },
  ]);
  await observePlan21Work(page, ['static', 'dynamic']);
  const initial = await page.evaluate(() => {
    const fixture = window.plan21.cards.dynamic;
    return {
      gateEvaluations: fixture.card.templates.context.config.constants.gateEvaluations,
      childAssignments: fixture.card.childCards.items[0].card.hassAssignments,
    };
  });

  await page.evaluate(() => {
    ['static', 'dynamic'].forEach((id) => {
      const fixture = window.plan21.cards[id];
      fixture.hass = {
        ...fixture.hass,
        states: {
          ...fixture.hass.states,
          'sensor.unrelated': { ...fixture.hass.states['sensor.unrelated'], state: '2' },
        },
      };
      fixture.card.hass = fixture.hass;
    });
  });
  await settlePlan21Cards(page, ['static', 'dynamic']);

  const result = await page.evaluate(() => {
    const staticFixture = window.plan21.cards.static;
    const dynamicFixture = window.plan21.cards.dynamic;
    const child = dynamicFixture.card.childCards.items[0].card;
    return {
      staticWork: staticFixture.work,
      dynamicWork: dynamicFixture.work,
      gateEvaluations: dynamicFixture.card.templates.context.config.constants.gateEvaluations,
      childAssignments: child.hassAssignments,
      childReceivedCurrentHass: child.currentHass === dynamicFixture.hass,
    };
  });
  expect(result.staticWork).toEqual(zeroWork);
  expect(result.dynamicWork).toEqual(zeroWork);
  expect(result.gateEvaluations).toBe(initial.gateEvaluations);
  expect(result.childAssignments).toBe(initial.childAssignments + 1);
  expect(result.childReceivedCurrentHass).toBe(true);
  expect(errors).toEqual([]);
});

test('declared dependency evaluates each JS field once and only retranslates changed results', async ({ page }) => {
  const errors = await loadPlan21Cards(page, [{
    id: 'dependency',
    config: {
      type: 'custom:flex-horseshoe-card',
      entities: [{ entity: 'sensor.power', decimals: 0 }],
      constants: { xposEvaluations: 0, fillEvaluations: 0 },
      layout: {
        states: [{ id: 'power', entity_index: 0, xpos: 50, ypos: 30, show: { uom: 'none' } }],
        rectangles: [{
          id: 'dependency-rectangle',
          entity_index: 0,
          xpos: '[[[ constants.xposEvaluations += 1; return Number(state) >= 25 ? 70 : 45; ]]]',
          ypos: 65,
          width: 20,
          height: 10,
          styles: {
            fill: '[[[ constants.fillEvaluations += 1; return "#1565c0"; ]]]',
          },
        }],
      },
    },
  }]);
  await observePlan21Work(page, ['dependency']);
  await page.evaluate(() => {
    const fixture = window.plan21.cards.dependency;
    const tool = fixture.card.cardTools.sections.rectangles[0];
    fixture.initialConfig = tool.config;
    fixture.initialPath = fixture.card.shadowRoot.querySelector('.rectangle-tool__border').getAttribute('d');
    fixture.initialX = tool.geometry.svg.xpos;
    fixture.initialXposEvaluations = fixture.card.templates.context.config.constants.xposEvaluations;
    fixture.initialFillEvaluations = fixture.card.templates.context.config.constants.fillEvaluations;
  });
  const initial = await page.evaluate(() => {
    const fixture = window.plan21.cards.dependency;
    return {
      xposEvaluations: fixture.initialXposEvaluations,
      fillEvaluations: fixture.initialFillEvaluations,
      x: fixture.initialX,
    };
  });

  await deliverPlan21State(page, 'dependency', 'sensor.power', '20.4');
  const equalResult = await page.evaluate(() => {
    const fixture = window.plan21.cards.dependency;
    const tool = fixture.card.cardTools.sections.rectangles[0];
    return {
      work: fixture.work,
      sameConfig: tool.config === fixture.initialConfig,
      samePath: fixture.card.shadowRoot.querySelector('.rectangle-tool__border').getAttribute('d') === fixture.initialPath,
      sameX: tool.geometry.svg.xpos === fixture.initialX,
      x: tool.geometry.svg.xpos,
      state: fixture.card.entities[0].state,
      displayedState: fixture.card.shadowRoot.querySelector('.state__value').textContent.trim(),
      xposEvaluations: fixture.card.templates.context.config.constants.xposEvaluations,
      fillEvaluations: fixture.card.templates.context.config.constants.fillEvaluations,
    };
  });
  expect(equalResult.sameConfig).toBe(true);
  expect(equalResult.samePath).toBe(true);
  expect(equalResult.sameX).toBe(true);
  expect(equalResult.state).toBe('20.4');
  expect(equalResult.displayedState).toBe('20');
  expect(equalResult.xposEvaluations).toBe(initial.xposEvaluations + 1);
  expect(equalResult.fillEvaluations).toBe(initial.fillEvaluations + 1);
  expect(equalResult.work.translation).toBe(0);
  expect(equalResult.work.requestUpdates).toBeGreaterThan(0);
  expect(equalResult.work.renders).toBeGreaterThan(0);

  await resetPlan21Work(page, 'dependency');
  await deliverPlan21State(page, 'dependency', 'sensor.power', '30');
  const changedResult = await page.evaluate(() => {
    const fixture = window.plan21.cards.dependency;
    const tool = fixture.card.cardTools.sections.rectangles[0];
    const rectangle = fixture.card.shadowRoot.querySelector('.rectangle-tool__border');
    return {
      work: fixture.work,
      configChanged: tool.config !== fixture.initialConfig,
      pathChanged: rectangle.getAttribute('d') !== fixture.initialPath,
      x: tool.geometry.svg.xpos,
      fill: getComputedStyle(fixture.card.shadowRoot.querySelector('.rectangle-tool__fill')).fill,
      state: fixture.card.shadowRoot.querySelector('.state__value').textContent.trim(),
      xposEvaluations: fixture.card.templates.context.config.constants.xposEvaluations,
      fillEvaluations: fixture.card.templates.context.config.constants.fillEvaluations,
    };
  });
  expect(changedResult.configChanged).toBe(true);
  expect(changedResult.pathChanged).toBe(true);
  expect(changedResult.x).not.toBe(equalResult.x);
  expect(changedResult.fill).toBe('rgb(21, 101, 192)');
  expect(changedResult.state).toBe('30');
  expect(changedResult.xposEvaluations).toBe(equalResult.xposEvaluations + 1);
  expect(changedResult.fillEvaluations).toBe(equalResult.fillEvaluations + 1);
  expect(changedResult.work.translation).toBe(1);
  expect(changedResult.work.requestUpdates).toBeGreaterThan(0);
  expect(changedResult.work.renders).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test('theme-dependent JavaScript config refreshes on theme context changes', async ({ page }) => {
  const errors = await loadPlan21Cards(page, [{
    id: 'theme',
    config: {
      type: 'custom:flex-horseshoe-card',
      entities: [{ entity: 'sensor.power' }],
      constants: { themeEvaluations: 0 },
      layout: {
        rectangles: [{
          id: 'theme-rectangle',
          xpos: 50,
          ypos: 50,
          width: 30,
          height: 20,
          styles: {
            fill: '[[[ constants.themeEvaluations += 1; return hass.themes.darkMode ? "#d32f2f" : "#1565c0"; ]]]',
          },
        }],
      },
    },
  }]);
  await observePlan21Work(page, ['theme']);
  const initial = await page.evaluate(() => ({
    evaluations: window.plan21.cards.theme.card.templates.context.config.constants.themeEvaluations,
    fill: getComputedStyle(window.plan21.cards.theme.card.shadowRoot.querySelector('.rectangle-tool__fill')).fill,
  }));
  expect(initial.fill).toBe('rgb(21, 101, 192)');

  await page.evaluate(() => {
    const fixture = window.plan21.cards.theme;
    fixture.hass = {
      ...fixture.hass,
      themes: { ...fixture.hass.themes, darkMode: true },
    };
    fixture.card.hass = fixture.hass;
  });
  await settlePlan21Cards(page, ['theme']);
  const refreshed = await page.evaluate(() => ({
    evaluations: window.plan21.cards.theme.card.templates.context.config.constants.themeEvaluations,
    fill: getComputedStyle(window.plan21.cards.theme.card.shadowRoot.querySelector('.rectangle-tool__fill')).fill,
    work: window.plan21.cards.theme.work,
  }));
  expect(refreshed.evaluations).toBe(initial.evaluations + 1);
  expect(refreshed.fill).toBe('rgb(211, 47, 47)');
  expect(refreshed.work.requestUpdates).toBeGreaterThan(0);
  expect(refreshed.work.renders).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test('local input changes publish the current value through the normal update route', async ({ page }) => {
  const errors = await loadPlan21Cards(page, [{
    id: 'local-input',
    config: {
      type: 'custom:flex-horseshoe-card',
      entities: [{ entity: 'fhs_input_number.local_level', initial: 20.1, decimals: 0 }],
      layout: {
        states: [{ id: 'local-level', entity_index: 0, xpos: 50, ypos: 50, show: { uom: 'none' } }],
      },
    },
  }]);
  await observePlan21Work(page, ['local-input']);
  await page.evaluate(() => {
    const fixture = window.plan21.cards['local-input'];
    fixture.card.cardInputEntities.setNumberValue('fhs_input_number.local_level', 20.6);
  });
  await settlePlan21Cards(page, ['local-input']);
  const result = await page.evaluate(() => {
    const fixture = window.plan21.cards['local-input'];
    return {
      state: fixture.card.entities[0].state,
      displayed: fixture.card.shadowRoot.querySelector('.state__value').textContent.trim(),
      work: fixture.work,
    };
  });
  expect(result.state).toBe('20.6');
  expect(result.displayed).toBe('21');
  expect(result.work.requestUpdates).toBeGreaterThan(0);
  expect(result.work.renders).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test('nested Text measurement receives the selected animation font styles', async ({ page }) => {
  const errors = await loadPlan21Cards(page, [{
    id: 'animated-text',
    config: {
      type: 'custom:flex-horseshoe-card',
      entities: [{ entity: 'sensor.power' }],
      animations: {
        'entity.0': [{
          state: 'on',
          texts: [{ animation_id: 'nested-font', styles: { 'font-size': '2em' } }],
        }],
      },
      layout: {
        controls: [{
          id: 'font-control',
          type: 'button',
          entity_index: 0,
          xpos: 50,
          ypos: 50,
          width: 60,
          height: 20,
          content: {
            mode: 'content_text',
            content_text: {
              text: 'Nested text follows its final animated font size',
              animation_id: 'nested-font',
              styles: { 'font-size': '1em', fill: '#1565c0' },
              text_overflow: { mode: 'ellipsis', ellipsis: { max_width: 36 } },
            },
          },
        }],
      },
    },
  }]);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => {
    const tool = window.plan21.cards['animated-text'].card.cardTools.sections.controls[0].getContentTools()[0];
    return tool.geometry.hasExactMeasurement
      && tool.runtime.widthMeasurementParts.length > 0
      && !tool.widthOverflowPending;
  });
  await observePlan21Work(page, ['animated-text']);
  const before = await page.evaluate(() => {
    const control = window.plan21.cards['animated-text'].card.cardTools.sections.controls[0];
    const tool = control.getContentTools()[0];
    return {
      revision: tool.widthOverflowRevision,
      fontSize: getComputedStyle(tool.textElement.firstElementChild).fontSize,
      configuredFontSize: tool.getStyles({})['font-size'],
      tokenWidth: tool.widthMeasurementElements.reduce((sum, element) => sum + element.getComputedTextLength(), 0),
    };
  });
  expect(before.configuredFontSize).toBe('1em');
  expect(Number.parseFloat(before.fontSize)).toBeGreaterThan(0);

  await page.evaluate(() => {
    const fixture = window.plan21.cards['animated-text'];
    const card = fixture.card;
    const control = card.cardTools.sections.controls[0];
    const tool = control.getContentTools()[0];
    fixture.measurementOrder = [];
    fixture.updatePhases = [];
    const updateRuntimeConfig = card.cardTools.updateRuntimeConfig;
    card.cardTools.updateRuntimeConfig = function observedRuntimeConfig(...args) {
      fixture.updatePhases.push('runtime-config');
      return updateRuntimeConfig.apply(this, args);
    };
    const setRuntimeEntityStates = card.cardTools.setRuntimeEntityStates;
    card.cardTools.setRuntimeEntityStates = function observedRuntimeStates(...args) {
      fixture.updatePhases.push('runtime-states');
      return setRuntimeEntityStates.apply(this, args);
    };
    const updateAnimation = card.cardAnimations.update;
    card.cardAnimations.update = function observedAnimationUpdate(...args) {
      fixture.updatePhases.push('animations');
      const result = updateAnimation.apply(this, args);
      fixture.measurementOrder.push({
        owner: 'animation',
        fontSize: this.styles.texts['nested-font']?.['font-size'],
      });
      return result;
    };
    const updateTextMeasurement = tool.updateTextMeasurement;
    tool.updateTextMeasurement = function observedTextMeasurement(...args) {
      fixture.measurementOrder.push({
        owner: 'measurement',
        fontSize: this.getStyles({ 'font-size': '1em' })['font-size'],
      });
      return updateTextMeasurement.apply(this, args);
    };
  });
  await deliverPlan21State(page, 'animated-text', 'sensor.power', 'on');
  await page.waitForFunction((previousRevision) => {
    const tool = window.plan21.cards['animated-text'].card.cardTools.sections.controls[0].getContentTools()[0];
    return tool.widthOverflowRevision > previousRevision
      && tool.geometry.hasExactMeasurement
      && !tool.widthOverflowPending;
  }, before.revision);

  const after = await page.evaluate(() => {
    const fixture = window.plan21.cards['animated-text'];
    const tool = fixture.card.cardTools.sections.controls[0].getContentTools()[0];
    const animationIndex = fixture.measurementOrder.findIndex((event) => event.owner === 'animation' && event.fontSize === '2em');
    return {
      revision: tool.widthOverflowRevision,
      fontSize: getComputedStyle(tool.textElement.firstElementChild).fontSize,
      tokenWidth: tool.widthMeasurementElements.reduce((sum, element) => sum + element.getComputedTextLength(), 0),
      text: tool.textElement.textContent.trim(),
      updatePhases: fixture.updatePhases,
      measurementAfterAnimation: fixture.measurementOrder.slice(animationIndex + 1)
        .some((event) => event.owner === 'measurement' && event.fontSize === '2em'),
      work: fixture.work,
    };
  });
  expect(after.revision).toBeGreaterThan(before.revision);
  expect(Number.parseFloat(after.fontSize)).toBeCloseTo(Number.parseFloat(before.fontSize) * 2, 2);
  expect(after.tokenWidth).toBeGreaterThan(before.tokenWidth);
  // Font metrics differ across browsers; the visible prefix may be shorter,
  // but it must remain a prefix of the source followed by the configured ellipsis.
  expect(after.text).toMatch(/^N.*\.\.\.$/);
  expect('Nested text follows its final animated font size'.startsWith(after.text.slice(0, -3))).toBe(true);
  expect(after.updatePhases.indexOf('runtime-config')).toBeLessThan(after.updatePhases.indexOf('animations'));
  expect(after.updatePhases.indexOf('animations')).toBeLessThan(after.updatePhases.indexOf('runtime-states'));
  expect(after.measurementAfterAnimation).toBe(true);
  expect(after.work.requestUpdates).toBeGreaterThan(0);
  expect(after.work.renders).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test('day/night Sparkline keeps its implicit sun entity in the owner invalidation gate', async ({ page }) => {
  const errors = await loadPlan21Cards(page, [{
    id: 'day-night',
    config: {
      type: 'custom:flex-horseshoe-card',
      entities: [{ entity: 'sensor.power' }],
      layout: {
        sparklines: [{
          id: 'day-night-graph',
          entity_index: 0,
          xpos: 50,
          ypos: 50,
          width: 88,
          height: 72,
          period: {
            type: 'rolling_window',
            rolling_window: { duration: { hour: 4 }, bins: { per_hour: 4, density: 'medium' } },
          },
          sparkline: {
            show: {
              chart_type: 'line',
              chart_variant: 'line',
              line: true,
              day_night: true,
              labels: { x: false, y: false },
            },
            state_values: { aggregate_func: 'avg' },
            line: { line_width: 2 },
          },
        }],
      },
    },
  }]);

  await page.waitForFunction(() => window.plan21.cards['day-night'].requests.some((request) => request.path.includes('sun.sun')));
  await page.evaluate(() => {
    const requests = window.plan21.cards['day-night'].requests.splice(0);
    requests.forEach((request) => request.resolve([[]]));
  });
  await page.waitForFunction(() => {
    const graph = window.plan21.cards['day-night'].card.cardTools.sections.sparklines[0];
    return !graph.requiresHassUpdate() && graph.sparklineHistory.dayNightRecord.requestPromise === undefined;
  });
  await settlePlan21Cards(page, ['day-night']);
  await observePlan21Work(page, ['day-night']);
  await page.evaluate(() => {
    const fixture = window.plan21.cards['day-night'];
    const graph = fixture.card.cardTools.sections.sparklines[0];
    fixture.ownerGateResults = [];
    const requiresHassUpdate = graph.requiresHassUpdate;
    graph.requiresHassUpdate = function recordOwnerGate(...args) {
      const required = requiresHassUpdate.apply(this, args);
      fixture.ownerGateResults.push(required);
      return required;
    };
    const sun = {
      ...fixture.hass.states['sun.sun'],
      state: 'above_horizon',
      last_changed: new Date(Date.now() + 1000).toISOString(),
    };
    fixture.hass = {
      ...fixture.hass,
      states: { ...fixture.hass.states, 'sun.sun': sun },
    };
    fixture.card.hass = fixture.hass;
  });
  await settlePlan21Cards(page, ['day-night']);
  const result = await page.evaluate(() => {
    const fixture = window.plan21.cards['day-night'];
    const graph = fixture.card.cardTools.sections.sparklines[0];
    return {
      gateObservedOwnerWork: fixture.ownerGateResults.includes(true),
      currentSunState: graph.sparklineHistory.dayNightRecord.sunEntity.state,
      ownerSettled: !graph.requiresHassUpdate(),
      requests: fixture.work.requestUpdates,
      renders: fixture.work.renders,
    };
  });
  expect(result.gateObservedOwnerWork).toBe(true);
  expect(result.currentSunState).toBe('above_horizon');
  expect(result.ownerSettled).toBe(true);
  expect(result.requests).toBeGreaterThan(0);
  expect(result.renders).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});
