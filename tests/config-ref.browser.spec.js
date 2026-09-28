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

test('measured text drives Rectangle fit inside a scaled group', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.route('http://fhs.test/**', (route) => route.fulfill({
    contentType: 'text/html',
    body: '<body style="--primary-text-color:white;--primary-background-color:black"><div id="host" style="width:400px"></div></body>',
  }));
  await page.goto('http://fhs.test/text-fit');
  await page.addScriptTag({
    type: 'module',
    content: await readFile(new URL('../dist/flex-horseshoe-card.js', import.meta.url), 'utf8'),
  });

  await page.evaluate(async () => {
    await customElements.whenDefined('flex-horseshoe-card');
    const card = document.createElement('flex-horseshoe-card');
    card.lovelace = { config: {}, rawConfig: {} };
    card.setConfig({
      type: 'custom:flex-horseshoe-card',
      entities: [{ entity: 'sensor.text_fit' }],
      layout: {
        groups: [{ id: 'offset', xpos: 55, ypos: 47, scale: 1.25 }],
        texts: [{ id: 'label', group: 'offset', xpos: 50, ypos: 50, text: 'Measured fit label', styles: ['font-size: 1.2em'] }],
        rectangles: [{
          id: 'frame', group: 'offset', fit: { section: 'texts', item_id: 'label', padding: { x: 2, y: 1 } },
          radius: 2, styles: ['fill: none', 'stroke: red', 'stroke-width: 1'],
        }],
      },
    });
    document.querySelector('#host').append(card);
    card.hass = {
      states: {
        'sensor.text_fit': {
          entity_id: 'sensor.text_fit', state: '1', attributes: { friendly_name: 'Text fit' },
          last_changed: new Date().toISOString(), last_updated: new Date().toISOString(),
        },
      },
      connection: new EventTarget(),
      locale: { language: 'en', number_format: 'language', time_format: 'language' },
      config: { time_zone: 'UTC' },
      themes: { darkMode: true, themes: {} },
      entities: {}, devices: {}, areas: {}, floors: {}, user: { name: 'Text fit' },
      formatEntityName: (state) => state.attributes.friendly_name,
      formatEntityState: (state) => state.state,
      formatEntityStateToParts: (state, value) => [{ type: 'value', value: value ?? state.state }],
    };
    window.textFitCard = card;
  });

  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => window.textFitCard?.cardTools?.sections.texts[0]?.hasExactMeasurement);

  const geometry = await page.evaluate(() => {
    const card = window.textFitCard;
    const textTool = card.cardTools.sections.texts[0];
    const rectangle = card.cardTools.sections.rectangles[0];
    const text = card.shadowRoot.querySelector('text[id$="-text-0"]');
    const border = card.shadowRoot.querySelector('.rectangle-tool__border');
    const measured = card.cardTools.getItemGeometry({ section: 'texts', item_id: 'label' });
    const textBox = text.getBBox();
    const textPixels = text.getBoundingClientRect();
    const borderPixels = border.getBoundingClientRect();
    return {
      exact: textTool.hasExactMeasurement,
      measured,
      rectangle: rectangle.config.svg,
      textBox: { width: textBox.width, height: textBox.height },
      textPixels: { left: textPixels.left, top: textPixels.top, right: textPixels.right, bottom: textPixels.bottom },
      borderPixels: { left: borderPixels.left, top: borderPixels.top, right: borderPixels.right, bottom: borderPixels.bottom },
    };
  });

  expect(geometry.exact).toBe(true);
  expect(geometry.measured.width * 2).toBeCloseTo(geometry.textBox.width, 2);
  expect(geometry.measured.height * 2).toBeCloseTo(geometry.textBox.height, 2);
  expect(geometry.rectangle.xpos).toBeCloseTo(geometry.measured.xpos, 2);
  expect(geometry.rectangle.ypos).toBeCloseTo(geometry.measured.ypos, 2);
  expect(geometry.rectangle.width).toBeCloseTo((geometry.measured.width + 4) * 2, 2);
  expect(geometry.rectangle.height).toBeCloseTo((geometry.measured.height + 2) * 2, 2);
  expect(geometry.borderPixels.left).toBeLessThan(geometry.textPixels.left);
  expect(geometry.borderPixels.top).toBeLessThan(geometry.textPixels.top);
  expect(geometry.borderPixels.right).toBeGreaterThan(geometry.textPixels.right);
  expect(geometry.borderPixels.bottom).toBeGreaterThan(geometry.textPixels.bottom);
  expect(pageErrors).toEqual([]);
  await page.evaluate(() => window.textFitCard.remove());
});

test('state-mapped Icon uses its effective flip inside a scaled group', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.route('http://fhs.test/**', (route) => route.fulfill({
    contentType: 'text/html',
    body: '<body style="--primary-text-color:white;--primary-background-color:black"><div id="host" style="width:400px"></div></body>',
  }));
  await page.goto('http://fhs.test/icon-scale');
  await page.addScriptTag({
    type: 'module',
    content: await readFile(new URL('../dist/flex-horseshoe-card.js', import.meta.url), 'utf8'),
  });

  await page.evaluate(async () => {
    await customElements.whenDefined('flex-horseshoe-card');
    const card = document.createElement('flex-horseshoe-card');
    card.lovelace = { config: {}, rawConfig: {} };
    card.setConfig({
      type: 'custom:flex-horseshoe-card',
      entities: [{ entity: 'sensor.icon_test' }],
      layout: {
        groups: [{ id: 'scaled', xpos: 55, ypos: 50, scale: 1.5 }],
        icons: [{
          id: 'indicator', entity_index: 0, group: 'scaled', xpos: 50, ypos: 50,
          icon: 'mdi:check', state_map: { map: [{ state: 'on', flip: 'x' }] },
        }],
      },
    });
    card.iconCache['mdi:check'] = 'M 3 12 L 9 18 L 21 6';
    document.querySelector('#host').append(card);
    card.hass = {
      states: {
        'sensor.icon_test': {
          entity_id: 'sensor.icon_test', state: 'on', attributes: { friendly_name: 'Icon test' },
          last_changed: new Date().toISOString(), last_updated: new Date().toISOString(),
        },
      },
      connection: new EventTarget(),
      locale: { language: 'en', number_format: 'language', time_format: 'language' },
      config: { time_zone: 'UTC' },
      themes: { darkMode: true, themes: {} },
      entities: {}, devices: {}, areas: {}, floors: {}, user: { name: 'Icon test' },
      formatEntityName: (state) => state.attributes.friendly_name,
      formatEntityState: (state) => state.state,
      formatEntityStateToParts: (state, value) => [{ type: 'value', value: value ?? state.state }],
    };
    window.iconScaleCard = card;
  });

  await page.waitForFunction(() => window.iconScaleCard?.shadowRoot?.querySelector('.icon-position'));
  const icon = await page.evaluate(() => {
    const card = window.iconScaleCard;
    const outerGroup = card.shadowRoot.querySelector('.icon-position').parentElement;
    return {
      transform: outerGroup.getAttribute('transform'),
      origin: outerGroup.style.transformOrigin,
      path: outerGroup.querySelector('.icon-center path')?.getAttribute('d'),
    };
  });

  expect(icon.transform).toBe('scale(-1.5, 1.5)');
  expect(icon.origin).toMatch(/^110px 100px(?: 0px)?$/);
  expect(icon.path).toBe('M 3 12 L 9 18 L 21 6');
  expect(pageErrors).toEqual([]);
  await page.evaluate(() => window.iconScaleCard.remove());
});
