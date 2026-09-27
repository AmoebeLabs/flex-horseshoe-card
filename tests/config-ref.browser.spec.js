import { readFile } from 'node:fs/promises';

import { expect, test } from '@playwright/test';

test('complete card renders referenced multipart text and same_as color-stop replacement', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.route('http://fhs.test/**', (route) => route.fulfill({
    contentType: 'text/html',
    body: '<body style="--primary-text-color:white;--primary-background-color:black;--primary-color:blue"><div id="host" style="width:400px"></div></body>',
  }));
  await page.goto('http://fhs.test/config-ref');
  await page.addScriptTag({
    type: 'module',
    content: await readFile(new URL('../dist/flex-horseshoe-card.js', import.meta.url), 'utf8'),
  });

  await page.evaluate(async (config) => {
    await customElements.whenDefined('flex-horseshoe-card');
    const card = document.createElement('flex-horseshoe-card');
    card.lovelace = { config: {}, rawConfig: {} };
    card.setConfig(config);
    document.querySelector('#host').append(card);
    card.hass = {
      states: {
        'sensor.ref_test': {
          entity_id: 'sensor.ref_test',
          state: '50',
          attributes: { friendly_name: 'Reference test', unit_of_measurement: '%' },
          last_changed: new Date().toISOString(),
          last_updated: new Date().toISOString(),
        },
      },
      connection: new EventTarget(),
      locale: { language: 'en', number_format: 'language', time_format: 'language' },
      config: { time_zone: 'UTC' },
      themes: { darkMode: true, themes: {} },
      entities: {},
      devices: {},
      areas: {},
      floors: {},
      user: { name: 'Config refs' },
      formatEntityName: (state) => state.attributes.friendly_name,
      formatEntityState: (state) => state.state,
      formatEntityStateToParts: (state, value) => [
        { type: 'value', value: value ?? state.state },
        { type: 'unit', value: state.attributes.unit_of_measurement },
      ],
    };
    window.configRefCard = card;
  }, {
    type: 'custom:flex-horseshoe-card',
    entities: [{ entity: 'sensor.ref_test' }],
    constants: {
      label_parts: [{ value: 'Referenced' }, { value: ' text' }],
      replacement_colors: [{ value: 50, color: '#42a5f5' }],
    },
    layout: {
      texts: [
        { id: 'label-base', xpos: 50, ypos: 25, text: 'Base label' },
        { id: 'label-reference', same_as: 'label-base', text: 'ref(label_parts)' },
      ],
      rectangles: [
        {
          id: 'color-base', xpos: 50, ypos: 60, width: 60, height: 20, radius: 2,
          entity_index: 0,
          show: { item_style: 'colorstop' },
          colorstop: { fill: true, stroke: false },
          color_stops: {
            scales: { default: { min: 0, max: 100 } },
            colors: [{ value: 0, color: '#111111' }, { value: 100, color: '#eeeeee' }],
          },
        },
        {
          id: 'color-reference', same_as: 'color-base',
          color_stops: { colors: 'ref(replacement_colors)' },
        },
      ],
    },
  });

  await page.waitForFunction(() => {
    const card = window.configRefCard;
    const label = card?.shadowRoot?.querySelector('text[id$="-text-1"]');
    return label?.textContent === 'Referenced text';
  });

  const rendered = await page.evaluate(() => {
    const card = window.configRefCard;
    const label = card.shadowRoot.querySelector('text[id$="-text-1"]');
    return {
      text: label.textContent,
      parts: [...label.querySelectorAll('.text-tool__part')].map((part) => part.textContent),
      configuredParts: card.config.layout.texts[1].text,
      inheritedColors: card.config.layout.rectangles[0].color_stops.colors,
      referencedColors: card.config.layout.rectangles[1].color_stops.colors,
      inheritedScale: card.config.layout.rectangles[1].color_stops.scales.default,
      rectangleFill: getComputedStyle(card.shadowRoot.querySelectorAll('.rectangle-tool__fill')[1]).fill,
    };
  });

  expect(rendered.text).toBe('Referenced text');
  expect(rendered.parts).toEqual(['Referenced', ' text']);
  expect(rendered.configuredParts).toEqual([{ value: 'Referenced' }, { value: ' text' }]);
  expect(rendered.inheritedColors).toEqual([{ value: 0, color: '#111111' }, { value: 100, color: '#eeeeee' }]);
  expect(rendered.referencedColors).toEqual([{ value: 50, color: '#42a5f5' }]);
  expect(rendered.inheritedScale).toEqual({ min: 0, max: 100 });
  expect(rendered.rectangleFill).toBe('rgb(66, 165, 245)');
  expect(pageErrors).toEqual([]);
  await page.evaluate(() => window.configRefCard.remove());
});
