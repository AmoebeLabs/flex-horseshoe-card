import { readFile } from 'node:fs/promises';

import { expect, test } from '@playwright/test';

test('dynamic Control selectors publish before children and switch with live entity updates', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.route('http://fhs.test/**', (route) => route.fulfill({
    contentType: 'text/html',
    body: '<body style="--primary-text-color:#111;--primary-background-color:#fff;--primary-color:#4285f4;--secondary-background-color:#ddd"><div id="host" style="width:500px"></div></body>',
  }));
  await page.goto('http://fhs.test/control-config-evaluation');
  await page.addScriptTag({
    type: 'module',
    content: await readFile(new URL('../dist/flex-horseshoe-card.js', import.meta.url), 'utf8'),
  });
  await page.evaluate(async () => {
    await customElements.whenDefined('flex-horseshoe-card');
    const card = document.createElement('flex-horseshoe-card');
    card.lovelace = { config: {}, rawConfig: {} };
    const placement = {
      group: 'moving', entity_index: 0, xpos: 50,
      width: '[[[ return Number(state) === 0 ? 36 : 44; ]]]',
    };
    card.setConfig({
      type: 'custom:flex-horseshoe-card',
      entities: [{ entity: 'input_number.control_driver' }],
      layout: {
        groups: [{ id: 'moving', xpos: '[[[ return 35 + Number(entities[0].state) * 10; ]]]', ypos: 50 }],
        controls: [
          { ...placement, id: 'button', type: 'button', ypos: 15,
            show: { item_viz: '[[[ return Number(state) === 0 ? "viz_button" : "viz_line"; ]]]' },
            content: { mode: 'content_text', content_text: { text: 'Button' } } },
          { ...placement, id: 'number', type: 'number', ypos: 32,
            show: { item_style: '[[[ return Number(state) === 0 ? "filled_square" : "outlined_round"; ]]]' } },
          { ...placement, id: 'select', type: 'select', ypos: 50,
            show: { item_viz: '[[[ return Number(state) === 0 ? "viz_button" : "viz_line"; ]]]' },
            option_map: [{ value: '0', text: 'Zero' }, { value: '1', text: 'One' }] },
          { ...placement, id: 'slider', type: 'slider', ypos: 68, value: { show: false },
            scale: { min: 0, max: 10, step: 1 },
            show: { item_viz: '[[[ return Number(state) === 0 ? "linear" : "circular"; ]]]' } },
          { ...placement, id: 'toggle', type: 'toggle', ypos: 85,
            show: { item_style: '[[[ return ["ha", "ios", "industrial"][Number(state)]; ]]]' } },
        ],
      },
    });
    document.querySelector('#host').append(card);
    await card.updateComplete;
    window.controlConfigEvaluationCard = card;
  });
  expect(await page.evaluate(() => window.controlConfigEvaluationCard.shadowRoot
    .querySelectorAll('.button-control, .number-control, .select-control, .slider-control, .toggle-style-animation').length)).toBe(0);

  for (const value of ['0', '1', '2', '0']) {
    await page.evaluate((value) => {
      const card = window.controlConfigEvaluationCard;
      const timestamp = new Date().toISOString();
      const entity = {
        entity_id: 'input_number.control_driver', state: value,
        attributes: { friendly_name: 'Control driver', min: 0, max: 10, step: 1 },
        last_changed: timestamp, last_updated: timestamp,
      };
      card.hass = {
        states: { [entity.entity_id]: entity },
        connection: new EventTarget(),
        locale: { language: 'en', number_format: 'language', time_format: 'language' },
        config: { time_zone: 'UTC' },
        themes: { darkMode: value === '0', themes: {} },
        entities: {}, devices: {}, areas: {}, floors: {}, user: { name: 'Control tests' },
        formatEntityName: (state) => state.attributes.friendly_name,
        formatEntityState: (state) => state.state,
        formatEntityStateToParts: (state, formattedValue) => [{ type: 'value', value: formattedValue ?? state.state }],
      };
    }, value);
    await page.waitForFunction((value) => {
      const controls = window.controlConfigEvaluationCard.cardTools.sections.controls;
      return controls.length === 5 && controls.every((tool) =>
        tool.activeConfigInitialized && tool.config.width === (value === '0' ? 36 : 44));
    }, value);
    const result = await page.evaluate(() => {
      const card = window.controlConfigEvaluationCard;
      return {
        types: card.cardTools.sections.controls.map((tool) => tool.config.type),
        modes: card.cardTools.sections.controls.map((tool) => tool.config.show.item_viz),
        toggleStyle: card.cardTools.sections.controls[4].config.show.item_style,
        childCounts: card.cardTools.sections.controls.map((tool) => tool.getContentTools().length),
        coordinates: card.cardTools.sections.controls.map((tool) =>
          tool.config.type === 'toggle' ? tool.geometry.svg.x : tool.geometry.svg.xpos),
        configHasGeometry: card.cardTools.sections.controls.some((tool) => Object.hasOwn(tool.config, 'svg')),
        invalidAttributes: [...card.shadowRoot.querySelectorAll('svg *')].flatMap((element) =>
          [...element.attributes].map((attribute) => attribute.value)
            .filter((attribute) => /NaN|undefined|\[\[\[/.test(attribute))),
      };
    });
    expect(result.types).toEqual(['button', 'number', 'select', 'slider', 'toggle']);
    expect(result.toggleStyle).toBe(['ha', 'ios', 'industrial'][Number(value)]);
    expect(result.modes).toEqual(value === '0'
      ? ['viz_button', 'buttons', 'viz_button', 'linear', 'default']
      : ['viz_line', 'buttons', 'viz_line', 'circular', 'default']);
    expect(result.coordinates.every((coordinate) => Number.isFinite(coordinate))).toBe(true);
    expect(result.childCounts.slice(0, 3)).toEqual([1, 3, 2]);
    expect(result.configHasGeometry).toBe(false);
    expect(result.invalidAttributes).toEqual([]);
  }
  expect(pageErrors).toEqual([]);
});

test('dynamic tool config waits for hass, then publishes selectors, group geometry, and theme', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.route('http://fhs.test/**', (route) => route.fulfill({
    contentType: 'text/html',
    body: '<body style="--primary-text-color:white;--primary-background-color:black"><div id="host" style="width:400px;height:300px"></div></body>',
  }));
  await page.goto('http://fhs.test/tool-config-evaluation');
  await page.addScriptTag({
    type: 'module',
    content: await readFile(new URL('../dist/flex-horseshoe-card.js', import.meta.url), 'utf8'),
  });

  const initial = await page.evaluate(async () => {
    await customElements.whenDefined('flex-horseshoe-card');
    const card = document.createElement('flex-horseshoe-card');
    card.lovelace = { config: {}, rawConfig: {} };
    card.setConfig({
      type: 'custom:flex-horseshoe-card',
      entities: [{ entity: 'sensor.tool_driver' }],
      layout: {
        groups: [{
          id: 'moving',
          xpos: '[[[ return Number(states["sensor.group_x"].state); ]]]',
          ypos: '[[[ return Number(states["sensor.group_y"].state); ]]]',
        }],
        lines: [{
          id: 'dynamic-line', group: 'moving', entity_index: 0,
          xpos: 50, ypos: 50, length: 22,
          orientation: '[[[ return states["sensor.line_mode"].state; ]]]',
          start: { xpos: 18, ypos: 24 }, end: { xpos: 82, ypos: 76 },
        }],
        rectangles: [{
          id: 'dynamic-rectangle', group: 'moving', entity_index: 0,
          xpos: 50, ypos: 50, width: 28, height: 18,
          fill_mask: '[[[ return states["sensor.fill_mask"].state === "auto" ? "auto" : Number(states["sensor.fill_mask"].state); ]]]',
        }],
        polygons: [{
          id: 'dynamic-polygon', group: 'moving', entity_index: 0,
          xpos: 50, ypos: 50, width: 30, height: 24, radius: 0,
          sides: '[[[ return Number(states["sensor.polygon_sides"].state); ]]]',
          top: '[[[ return Number(states["sensor.polygon_top"].state); ]]]',
        }],
      },
    });
    document.querySelector('#host').append(card);
    await card.updateComplete;
    window.toolConfigEvaluationCard = card;
    return {
      renderedTools: card.shadowRoot.querySelectorAll('.line-tool, .rectangle-tool, .polygon-tool').length,
      groupCount: card.cardLayout.activeGroupConfigs.length,
    };
  });

  expect(initial.renderedTools).toBe(0);
  expect(initial.groupCount).toBe(1);

  await page.evaluate((values) => {
    const states = Object.fromEntries(Object.entries(values).map(([entityId, value]) => [entityId, state(entityId, value)]));
    window.toolConfigEvaluationCard.hass = {
      states,
      connection: new EventTarget(),
      locale: { language: 'en', number_format: 'language', time_format: 'language' },
      config: { time_zone: 'UTC' },
      themes: { darkMode: true, theme: 'default', themes: {} },
      entities: {}, devices: {}, areas: {}, floors: {},
      user: { name: 'Tool config evaluation' },
      formatEntityName: (entity) => entity.attributes.friendly_name,
      formatEntityState: (entity) => entity.state,
      formatEntityStateToParts: (entity, value) => [{ type: 'value', value: value ?? entity.state }],
    };
    function state(entityId, value) {
      const timestamp = new Date().toISOString();
      return {
        entity_id: entityId,
        state: value,
        attributes: { friendly_name: entityId },
        last_changed: timestamp,
        last_updated: timestamp,
      };
    }
  }, {
    'sensor.tool_driver': '1',
    'sensor.line_mode': 'horizontal',
    'sensor.fill_mask': '3',
    'sensor.polygon_sides': '5',
    'sensor.polygon_top': '2',
    'sensor.group_x': '40',
    'sensor.group_y': '45',
  });

  await page.waitForFunction(() => {
    const card = window.toolConfigEvaluationCard;
    return card?.cardTools.sections.lines[0]?.config.orientation === 'horizontal'
      && card.cardTools.sections.polygons[0]?.config.sides === 5;
  });

  const published = await page.evaluate(() => {
    const card = window.toolConfigEvaluationCard;
    const line = card.cardTools.sections.lines[0];
    const rectangle = card.cardTools.sections.rectangles[0];
    const polygon = card.cardTools.sections.polygons[0];
    const rendered = [...card.shadowRoot.querySelectorAll('.line-tool, .rectangle-tool, .rectangle-tool__border, .polygon-tool, .polygon-tool__border')];
    const invalidAttributes = rendered.flatMap((element) => [...element.attributes]
      .map((attribute) => attribute.value)
      .filter((value) => /NaN|undefined|\[\[\[/.test(value)));
    return {
      orientation: line.config.orientation,
      fillMask: rectangle.config.fill_mask,
      polygonSides: polygon.config.sides,
      polygonTop: polygon.config.top,
      group: card.cardLayout.activeGroupConfigs[0],
      themeMode: card.cardTheme.getActiveColorStopMode(),
      renderedCount: rendered.length,
      invalidAttributes,
      numericGeometry: [
        line.geometry.svg.x1, line.geometry.svg.y1, line.geometry.svg.x2, line.geometry.svg.y2,
        rectangle.geometry.svg.xpos, rectangle.geometry.svg.ypos,
        polygon.geometry.pathInput.cx, polygon.geometry.pathInput.cy,
      ].every(Number.isFinite),
    };
  });

  expect(published.orientation).toBe('horizontal');
  expect(published.fillMask).toBe(3);
  expect(published.polygonSides).toBe(5);
  expect(published.polygonTop).toBe(2);
  expect(published.group.xpos).toBe(40);
  expect(published.group.ypos).toBe(45);
  expect(published.themeMode).toBe('dark');
  expect(published.renderedCount).toBeGreaterThanOrEqual(3);
  expect(published.invalidAttributes).toEqual([]);
  expect(published.numericGeometry).toBe(true);

  await page.evaluate(async (values) => {
    const card = window.toolConfigEvaluationCard;
    const states = { ...card._hass.states };
    Object.entries(values).forEach(([entityId, value]) => {
      const previous = states[entityId];
      const timestamp = new Date().toISOString();
      states[entityId] = {
        ...previous,
        state: value,
        last_changed: timestamp,
        last_updated: timestamp,
      };
    });
    card.hass = {
      ...card._hass,
      states,
      themes: { ...card._hass.themes, darkMode: false },
    };
    await card.updateComplete;
  }, {
    'sensor.line_mode': 'fromto',
    'sensor.fill_mask': 'auto',
    'sensor.polygon_sides': '6',
    'sensor.polygon_top': '2',
    'sensor.group_x': '64',
    'sensor.group_y': '38',
  });

  const updated = await page.evaluate(() => {
    const card = window.toolConfigEvaluationCard;
    const line = card.cardTools.sections.lines[0];
    const rectangle = card.cardTools.sections.rectangles[0];
    const polygon = card.cardTools.sections.polygons[0];
    const rendered = [...card.shadowRoot.querySelectorAll('.line-tool, .rectangle-tool, .rectangle-tool__border, .polygon-tool, .polygon-tool__border')];
    return {
      orientation: line.config.orientation,
      lineGeometry: line.geometry.svg,
      fillMask: rectangle.config.fill_mask,
      polygon: polygon.config,
      group: card.cardLayout.activeGroupConfigs[0],
      themeMode: card.cardTheme.getActiveColorStopMode(),
      invalidAttributes: rendered.flatMap((element) => [...element.attributes]
        .map((attribute) => attribute.value)
        .filter((value) => /NaN|undefined|\[\[\[/.test(value))),
      numericGeometry: [
        line.geometry.svg.x1, line.geometry.svg.y1, line.geometry.svg.x2, line.geometry.svg.y2,
        rectangle.geometry.svg.xpos, rectangle.geometry.svg.ypos,
        polygon.geometry.pathInput.cx, polygon.geometry.pathInput.cy,
      ].every(Number.isFinite),
    };
  });

  expect(updated.orientation).toBe('fromto');
  expect(updated.lineGeometry.x1).not.toBe(updated.lineGeometry.x2);
  expect(updated.fillMask).toBe('auto');
  expect(updated.polygon.sides).toBe(6);
  expect(updated.polygon.top).toBe(2);
  expect(updated.group.xpos).toBe(64);
  expect(updated.group.ypos).toBe(38);
  expect(updated.themeMode).toBe('light');
  expect(updated.invalidAttributes).toEqual([]);
  expect(updated.numericGeometry).toBe(true);
  expect(pageErrors).toEqual([]);
  await page.evaluate(() => window.toolConfigEvaluationCard.remove());
});
