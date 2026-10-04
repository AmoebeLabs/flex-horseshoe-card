import { readFile } from 'node:fs/promises';

import { expect, test } from '@playwright/test';

const now = new Date('2026-09-26T12:00:00.000Z');

/** Loads the built card with fixed time and controlled Home Assistant states. */
async function loadCard(page, config) {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.clock.install({ time: now });
  await page.clock.pauseAt(now);
  await page.route('http://fhs.test/**', (route) => route.fulfill({
    contentType: 'text/html',
    body: '<body style="--primary-text-color:white;--primary-color:blue"><div id="host" style="width:400px"></div></body>',
  }));
  await page.goto('http://fhs.test/card-change-detection');
  await page.addScriptTag({
    type: 'module',
    content: await readFile(new URL('../dist/flex-horseshoe-card.js', import.meta.url), 'utf8'),
  });
  await page.evaluate(async (cardConfig) => {
    await customElements.whenDefined('flex-horseshoe-card');
    const card = document.createElement('flex-horseshoe-card');
    card.lovelace = { config: {} };
    const timestamp = Date.now();
    const changedAt = new Date(timestamp - 30 * 60 * 1000).toISOString();
    const power = {
      entity_id: 'sensor.power',
      state: '20.1',
      attributes: { friendly_name: 'Power', unit_of_measurement: 'W', voltage: '120.1' },
      last_changed: changedAt,
      last_updated: changedAt,
    };
    const external = {
      entity_id: 'sensor.external',
      state: '8',
      attributes: { friendly_name: 'External value', unit_of_measurement: '' },
      last_changed: changedAt,
      last_updated: changedAt,
    };
    const hass = {
      states: { [power.entity_id]: power, [external.entity_id]: external },
      connection: new EventTarget(),
      locale: { language: 'en', number_format: 'language', time_format: 'language' },
      config: { time_zone: 'UTC' },
      themes: { darkMode: true, themes: {} },
      entities: {},
      devices: {},
      areas: {},
      floors: {},
      user: { name: 'Change detection' },
      formatEntityName: (state) => state.attributes.friendly_name,
      formatEntityState: (state) => state.state,
      formatEntityStateToParts: (state, value) => [
        { type: 'value', value: value ?? state.state },
        { type: 'unit', value: state.attributes.unit_of_measurement },
      ],
      formatEntityAttributeValueToParts: (state, attribute) => [
        { type: 'value', value: state.attributes[attribute] },
      ],
    };
    card.setConfig(cardConfig);
    document.querySelector('#host').append(card);
    card.hass = hass;
    window.changeDetection = { card, hass, renderCount: 0, requestCount: 0 };
  }, config);
  await page.waitForFunction(() => window.changeDetection.card.shadowRoot.querySelector('.state__value') !== null);
  await settleCardRendering(page);
  await page.evaluate(() => {
    const { card } = window.changeDetection;
    const render = card.render.bind(card);
    card.render = (...args) => {
      window.changeDetection.renderCount += 1;
      return render(...args);
    };
    const requestUpdate = card.requestUpdate.bind(card);
    card.requestUpdate = (...args) => {
      window.changeDetection.requestCount += 1;
      return requestUpdate(...args);
    };
  });
  return pageErrors;
}

/** Waits for card updates and DOM-measurement follow-ups before output is read. */
async function settleCardRendering(page) {
  await page.evaluate(() => window.changeDetection.card.updateComplete);
  await page.clock.runFor(34);
  await page.evaluate(() => window.changeDetection.card.updateComplete);
  await page.clock.runFor(34);
  await page.evaluate(() => window.changeDetection.card.updateComplete);
}

/** Delivers one HA state update while preserving the entity's metadata. */
async function deliverState(page, entityId, state) {
  await page.evaluate(({ entityId, state }) => {
    const { card, hass } = window.changeDetection;
    const nextHass = {
      ...hass,
      states: { ...hass.states, [entityId]: { ...hass.states[entityId], state } },
    };
    window.changeDetection.hass = nextHass;
    card.hass = nextHass;
  }, { entityId, state });
  await settleCardRendering(page);
}

/** Delivers an HA attribute-only update while preserving the entity state. */
async function deliverAttribute(page, entityId, attribute, value) {
  await page.evaluate(({ entityId, attribute, value }) => {
    const { card, hass } = window.changeDetection;
    const entity = hass.states[entityId];
    const nextHass = {
      ...hass,
      states: {
        ...hass.states,
        [entityId]: { ...entity, attributes: { ...entity.attributes, [attribute]: value } },
      },
    };
    window.changeDetection.hass = nextHass;
    card.hass = nextHass;
  }, { entityId, attribute, value });
  await settleCardRendering(page);
}

test('rounded text and fixed paint stay correct across relevant updates', async ({ page }) => {
  const errors = await loadCard(page, {
    type: 'custom:flex-horseshoe-card',
    entities: [{ entity: 'sensor.power', decimals: 0 }],
    layout: {
      states: [{
        id: 'power', entity_index: 0, xpos: 50, ypos: 50,
        show: { uom: 'none' },
        styles: { fill: '#1565c0', 'text-anchor': 'middle' },
      }],
    },
  });
  const initial = await page.evaluate(() => {
    const value = window.changeDetection.card.shadowRoot.querySelector('.state__value');
    return { text: value.textContent.trim(), fill: getComputedStyle(value).fill };
  });
  expect(initial.text).toBe('20');
  expect(initial.fill).toBe('rgb(21, 101, 192)');

  // Relevant raw data updates still reach Lit even while displayed text stays rounded.
  await page.evaluate(() => {
    window.changeDetection.renderCount = 0;
    window.changeDetection.requestCount = 0;
  });
  await deliverState(page, 'sensor.power', '20.4');
  const stillRounded = await page.evaluate(() => {
    const value = window.changeDetection.card.shadowRoot.querySelector('.state__value');
    return {
      text: value.textContent.trim(),
      fill: getComputedStyle(value).fill,
      rawState: window.changeDetection.card.entities[0].state,
      renders: window.changeDetection.renderCount,
      requests: window.changeDetection.requestCount,
    };
  });
  expect(stillRounded.text).toBe('20');
  expect(stillRounded.fill).toBe(initial.fill);
  expect(stillRounded.rawState).toBe('20.4');
  expect(stillRounded.requests).toBeGreaterThan(0);
  expect(stillRounded.renders).toBeGreaterThan(0);

  // Crossing the rounding boundary changes the visible text.
  await page.evaluate(() => {
    window.changeDetection.renderCount = 0;
    window.changeDetection.requestCount = 0;
  });
  await deliverState(page, 'sensor.power', '20.6');
  const roundedUp = await page.evaluate(() => {
    const value = window.changeDetection.card.shadowRoot.querySelector('.state__value');
    return {
      text: value.textContent.trim(),
      fill: getComputedStyle(value).fill,
      renders: window.changeDetection.renderCount,
      requests: window.changeDetection.requestCount,
    };
  });
  expect(roundedUp.text).toBe('21');
  expect(roundedUp.fill).toBe(initial.fill);
  expect(roundedUp.requests).toBeGreaterThan(0);
  expect(roundedUp.renders).toBeGreaterThan(0);
  expect(errors).toEqual([]);
  await page.evaluate(() => window.changeDetection.card.remove());
});

test('configured HA attribute updates refresh the state tool output', async ({ page }) => {
  const errors = await loadCard(page, {
    type: 'custom:flex-horseshoe-card',
    entities: [{ entity: 'sensor.power', attribute: 'voltage', decimals: 0 }],
    layout: {
      states: [{
        id: 'voltage', entity_index: 0, xpos: 50, ypos: 50,
        show: { uom: 'none' },
      }],
    },
  });
  expect(await page.evaluate(() => window.changeDetection.card.shadowRoot.querySelector('.state__value').textContent.trim())).toBe('120');

  await page.evaluate(() => {
    window.changeDetection.renderCount = 0;
    window.changeDetection.requestCount = 0;
  });
  await deliverAttribute(page, 'sensor.power', 'voltage', '121.2');
  const updated = await page.evaluate(() => {
    const card = window.changeDetection.card;
    return {
      text: card.shadowRoot.querySelector('.state__value').textContent.trim(),
      voltage: card.cardTools.sections.states[0].runtime.entity.attributes.voltage,
      requests: window.changeDetection.requestCount,
      renders: window.changeDetection.renderCount,
    };
  });
  expect(updated.text).toBe('121');
  expect(updated.voltage).toBe('121.2');
  expect(updated.requests).toBeGreaterThan(0);
  expect(updated.renders).toBeGreaterThan(0);
  expect(errors).toEqual([]);
  await page.evaluate(() => window.changeDetection.card.remove());
});

test('raw color-stop threshold changes paint and renders while rounded text stays equal', async ({ page }) => {
  const errors = await loadCard(page, {
    type: 'custom:flex-horseshoe-card',
    entities: [{ entity: 'sensor.power', decimals: 0 }],
    layout: {
      states: [{
        id: 'power', entity_index: 0, xpos: 50, ypos: 50,
        show: { uom: 'none', item_style: 'colorstop' },
        color_stops: {
          colors: [
            { value: 0, color: '#1565c0' },
            { value: 20.25, color: '#66bb6a' },
            { value: 30, color: '#e53935' },
          ],
        },
      }],
    },
  });
  const initial = await page.evaluate(() => {
    const value = window.changeDetection.card.shadowRoot.querySelector('.state__value');
    return { text: value.textContent.trim(), fill: getComputedStyle(value).fill };
  });
  expect(initial.text).toBe('20');
  expect(initial.fill).toBe('rgb(21, 101, 192)');

  // Raw 20.4 crosses 20.25 even though both measurements display as 20.
  await page.evaluate(() => {
    window.changeDetection.renderCount = 0;
    window.changeDetection.requestCount = 0;
  });
  await deliverState(page, 'sensor.power', '20.4');
  const crossed = await page.evaluate(() => {
    const value = window.changeDetection.card.shadowRoot.querySelector('.state__value');
    return {
      text: value.textContent.trim(),
      fill: getComputedStyle(value).fill,
      renders: window.changeDetection.renderCount,
      requests: window.changeDetection.requestCount,
    };
  });
  expect(crossed.text).toBe('20');
  expect(crossed.fill).toBe('rgb(102, 187, 106)');
  expect(crossed.fill).not.toBe(initial.fill);
  expect(crossed.requests).toBeGreaterThan(0);
  expect(crossed.renders).toBeGreaterThan(0);
  expect(errors).toEqual([]);
  await page.evaluate(() => window.changeDetection.card.remove());
});

test('inline state paint, unit and group output stay current at equal rounded text', async ({ page }) => {
  const errors = await loadCard(page, {
    type: 'custom:flex-horseshoe-card',
    entities: [{ entity: 'sensor.power', decimals: 0 }],
    animations: {
      'entity.0': [
        { state: '20.4', texts: [{ animation_id: 0, styles: { fill: '#66bb6a' } }] },
        { state: '20.49', texts: [{ animation_id: 0, styles: { fill: '#66bb6a' } }] },
      ],
    },
    layout: {
      groups: [{
        id: 'reading', xpos: '[[[ return Number(states["sensor.power"].state) >= 20.25 ? 60 : 40; ]]]', ypos: 50,
      }],
      states: [{
        id: 'power', group: 'reading', entity_index: 0, xpos: 50, ypos: 50,
        show: { uom: 'end' },
      }],
      texts: [{
        id: 'inline-power', group: 'reading', xpos: 50, ypos: 70,
        text: [{ type: 'state', entity_index: 0, show: { uom: 'end' }, animation_id: 0, styles: { fill: '#1565c0' } }],
      }],
    },
  });
  const initial = await page.evaluate(() => {
    const root = window.changeDetection.card.shadowRoot;
    const inline = root.querySelector('text[id$="-text-0"]');
    return {
      state: root.querySelector('.state__value').textContent.trim(),
      stateUnit: root.querySelector('.state__uom').textContent.trim(),
      inline: [...inline.querySelectorAll('.text-tool__part')].map((part) => part.textContent.trim()),
      inlineFill: getComputedStyle(inline.querySelector('.text-tool__part')).fill,
      groupX: window.changeDetection.card.cardLayout.runtimeGroupConfigs[0].xpos,
    };
  });
  expect(initial).toEqual({
    state: '20', stateUnit: 'W', inline: ['20', 'W'], inlineFill: 'rgb(21, 101, 192)', groupX: 40,
  });

  await page.evaluate(() => {
    window.changeDetection.renderCount = 0;
    window.changeDetection.requestCount = 0;
  });
  await page.evaluate(() => {
    const { card, hass } = window.changeDetection;
    const power = {
      ...hass.states['sensor.power'],
      state: '20.4',
      attributes: { ...hass.states['sensor.power'].attributes, unit_of_measurement: 'kW' },
    };
    const nextHass = { ...hass, states: { ...hass.states, 'sensor.power': power } };
    window.changeDetection.hass = nextHass;
    card.hass = nextHass;
  });
  await settleCardRendering(page);
  const changed = await page.evaluate(() => {
    const root = window.changeDetection.card.shadowRoot;
    const inline = root.querySelector('text[id$="-text-0"]');
    return {
      state: root.querySelector('.state__value').textContent.trim(),
      stateUnit: root.querySelector('.state__uom').textContent.trim(),
      inline: [...inline.querySelectorAll('.text-tool__part')].map((part) => part.textContent.trim()),
      inlineFill: getComputedStyle(inline.querySelector('.text-tool__part')).fill,
      groupX: window.changeDetection.card.cardLayout.runtimeGroupConfigs[0].xpos,
      renders: window.changeDetection.renderCount,
      requests: window.changeDetection.requestCount,
    };
  });
  expect(changed.state).toBe('20');
  expect(changed.stateUnit).toBe('kW');
  expect(changed.inline).toEqual(['20', 'kW']);
  expect(changed.inlineFill).toBe('rgb(102, 187, 106)');
  expect(changed.groupX).toBe(60);
  expect(changed.requests).toBeGreaterThan(0);
  expect(changed.renders).toBeGreaterThan(0);

  await page.evaluate(() => {
    window.changeDetection.renderCount = 0;
    window.changeDetection.requestCount = 0;
  });
  await deliverState(page, 'sensor.power', '20.49');
  const equalOutput = await page.evaluate(() => {
    const root = window.changeDetection.card.shadowRoot;
    const inline = root.querySelector('text[id$="-text-0"]');
    return {
      state: root.querySelector('.state__value').textContent.trim(),
      stateUnit: root.querySelector('.state__uom').textContent.trim(),
      inline: [...inline.querySelectorAll('.text-tool__part')].map((part) => part.textContent.trim()),
      inlineFill: getComputedStyle(inline.querySelector('.text-tool__part')).fill,
      groupX: window.changeDetection.card.cardLayout.runtimeGroupConfigs[0].xpos,
      renders: window.changeDetection.renderCount,
      requests: window.changeDetection.requestCount,
      rawState: window.changeDetection.card.entities[0].state,
    };
  });
  expect(equalOutput.state).toBe('20');
  expect(equalOutput.stateUnit).toBe('kW');
  expect(equalOutput.inline).toEqual(['20', 'kW']);
  expect(equalOutput.inlineFill).toBe('rgb(102, 187, 106)');
  expect(equalOutput.groupX).toBe(60);
  expect(equalOutput.rawState).toBe('20.49');
  expect(equalOutput.requests).toBeGreaterThan(0);
  expect(equalOutput.renders).toBeGreaterThan(0);
  expect(errors).toEqual([]);
  await page.evaluate(() => window.changeDetection.card.remove());
});

test('undeclared JavaScript state reads wait for the next legitimate card update', async ({ page }) => {
  const errors = await loadCard(page, {
    type: 'custom:flex-horseshoe-card',
    entities: [{ entity: 'sensor.power', decimals: 0 }],
    layout: {
      states: [{ id: 'power', entity_index: 0, xpos: 50, ypos: 40, show: { uom: 'none' } }],
      texts: [{
        id: 'external-reading', xpos: 50, ypos: 70,
        text: '[[[ return "outside=" + states["sensor.external"].state; ]]]',
      }],
    },
  });
  const initialText = await page.evaluate(() => window.changeDetection.card.shadowRoot.querySelector('text[id$="-text-0"]').textContent.trim());
  expect(initialText).toBe('outside=8');

  // An arbitrary state-map read is readable, but does not subscribe the card.
  await page.evaluate(() => {
    window.changeDetection.renderCount = 0;
    window.changeDetection.requestCount = 0;
  });
  await deliverState(page, 'sensor.external', '9');
  const ignored = await page.evaluate(() => ({
    text: window.changeDetection.card.shadowRoot.querySelector('text[id$="-text-0"]').textContent.trim(),
    renders: window.changeDetection.renderCount,
    requests: window.changeDetection.requestCount,
    externalState: window.changeDetection.hass.states['sensor.external'].state,
  }));
  expect(ignored.text).toBe('outside=8');
  expect(ignored.externalState).toBe('9');
  expect(ignored.requests).toBe(0);
  expect(ignored.renders).toBe(0);

  await page.evaluate(() => {
    window.changeDetection.renderCount = 0;
    window.changeDetection.requestCount = 0;
  });
  await deliverState(page, 'sensor.power', '20.4');
  const refreshed = await page.evaluate(() => ({
    text: window.changeDetection.card.shadowRoot.querySelector('text[id$="-text-0"]').textContent.trim(),
    requests: window.changeDetection.requestCount,
    renders: window.changeDetection.renderCount,
  }));
  expect(refreshed.text).toBe('outside=9');
  expect(refreshed.requests).toBeGreaterThan(0);
  expect(refreshed.renders).toBeGreaterThan(0);
  expect(errors).toEqual([]);
  await page.evaluate(() => window.changeDetection.card.remove());
});

test('declared external JavaScript state reads update immediately', async ({ page }) => {
  const errors = await loadCard(page, {
    type: 'custom:flex-horseshoe-card',
    entities: [
      { entity: 'sensor.power', decimals: 0 },
      { entity: 'sensor.external' },
    ],
    layout: {
      states: [{ id: 'power', entity_index: 0, xpos: 50, ypos: 40, show: { uom: 'none' } }],
      texts: [{
        id: 'external-reading', xpos: 50, ypos: 70,
        text: '[[[ return "outside=" + states["sensor.external"].state; ]]]',
      }],
    },
  });
  await page.evaluate(() => {
    window.changeDetection.renderCount = 0;
    window.changeDetection.requestCount = 0;
  });
  await deliverState(page, 'sensor.external', '9');
  const updated = await page.evaluate(() => ({
    text: window.changeDetection.card.shadowRoot.querySelector('text[id$="-text-0"]').textContent.trim(),
    requests: window.changeDetection.requestCount,
    renders: window.changeDetection.renderCount,
  }));
  expect(updated.text).toBe('outside=9');
  expect(updated.requests).toBeGreaterThan(0);
  expect(updated.renders).toBeGreaterThan(0);
  expect(errors).toEqual([]);
  await page.evaluate(() => window.changeDetection.card.remove());
});
