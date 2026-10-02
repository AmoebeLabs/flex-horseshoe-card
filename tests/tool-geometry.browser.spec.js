import { readFile } from 'node:fs/promises';

import { expect, test } from '@playwright/test';

/** Loads the actual distribution with stable Home Assistant entity fixtures. */
async function loadToolCard(page, config) {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.route('http://fhs.test/**', (route) => route.fulfill({
    contentType: 'text/html',
    body: '<body style="--primary-text-color:white;--primary-background-color:black"><div id="host" style="width:400px;height:300px"></div></body>',
  }));
  await page.goto('http://fhs.test/tool-geometry');
  await page.addScriptTag({
    type: 'module',
    content: await readFile(new URL('../dist/flex-horseshoe-card.js', import.meta.url), 'utf8'),
  });

  await page.evaluate(async (cardConfig) => {
    await customElements.whenDefined('flex-horseshoe-card');
    const card = document.createElement('flex-horseshoe-card');
    card.lovelace = { config: {}, rawConfig: {} };
    card.setConfig(cardConfig);
    card.iconCache['mdi:check'] = 'M 3 12 L 9 18 L 21 6';
    document.querySelector('#host').append(card);

    const timestamp = new Date().toISOString();
    const toolEntity = {
      entity_id: 'sensor.tool',
      state: '1',
      attributes: { friendly_name: 'Measured sensor', unit_of_measurement: 'kW' },
      last_changed: timestamp,
      last_updated: timestamp,
    };
    const iconEntity = {
      entity_id: 'sensor.icon',
      state: 'on',
      attributes: { friendly_name: 'Mapped icon' },
      last_changed: timestamp,
      last_updated: timestamp,
    };
    const hass = {
      states: {
        [toolEntity.entity_id]: toolEntity,
        [iconEntity.entity_id]: iconEntity,
      },
      connection: new EventTarget(),
      locale: { language: 'en', number_format: 'language', time_format: 'language' },
      config: { time_zone: 'UTC' },
      themes: { darkMode: true, themes: {} },
      entities: {},
      devices: {},
      areas: {},
      floors: {},
      user: { name: 'Tool geometry' },
      formatEntityName: (entity, options) => options?.type === 'area'
        ? 'Kitchen Area'
        : entity.attributes.friendly_name,
      formatEntityState: (entity) => entity.state,
      formatEntityStateToParts: (entity, value) => [
        { type: 'value', value: value ?? entity.state },
        { type: 'unit', value: entity.attributes.unit_of_measurement },
      ],
    };
    card.hass = hass;
    window.toolGeometryFixture = { card, hass };
  }, config);

  return pageErrors;
}

/** Waits for the migrated measured-text tools and legacy TextTool to finish their first measurement. */
async function waitForTextMeasurements(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => {
    const card = window.toolGeometryFixture?.card;
    if (!card) return false;
    const measuredTools = ['names', 'areas', 'states'].map((section) => card.cardTools.sections[section][0]);
    const legacyText = card.cardTools.sections.texts[0];
    return measuredTools.every((tool) => tool?.geometry?.hasExactMeasurement)
      && legacyText?.hasExactMeasurement;
  });
}

test('simple shapes follow moved group geometry, scale and flip while Icon retains state_map flip', async ({ page }) => {
  const errors = await loadToolCard(page, {
    type: 'custom:flex-horseshoe-card',
    entities: [{ entity: 'sensor.tool' }, { entity: 'sensor.icon' }],
    layout: {
      groups: [{
        id: 'room',
        xpos: '[[[ return Number(states["sensor.tool"].state) === 1 ? 40 : 60; ]]]',
        ypos: '[[[ return Number(states["sensor.tool"].state) === 1 ? 45 : 55; ]]]',
        scale: '[[[ return Number(states["sensor.tool"].state) === 1 ? 1.25 : 1.5; ]]]',
      }],
      arcs: [{ id: 'arc', group: 'room', xpos: 50, ypos: 50, radius: 12, flip: 'x' }],
      circles: [{ id: 'circle', group: 'room', xpos: 50, ypos: 50, radius: 6, flip: 'x' }],
      lines: [{
        id: 'line',
        group: 'room',
        orientation: 'fromto',
        start: { xpos: 30, ypos: 40 },
        end: { xpos: 70, ypos: 60 },
        flip: 'x',
      }],
      rectangles: [{
        id: 'rectangle', group: 'room', xpos: 50, ypos: 50, width: 18, height: 12, flip: 'x',
      }],
      polygons: [{
        id: 'polygon', group: 'room', xpos: 50, ypos: 50, sides: 5, width: 20, height: 16, radius: 0, flip: 'x',
      }],
      icons: [{
        id: 'mapped-icon',
        entity_index: 1,
        group: 'room',
        xpos: 50,
        ypos: 50,
        icon: 'mdi:check',
        state_map: { map: [{ state: 'on', flip: 'x' }] },
      }],
    },
  });
  await page.waitForFunction(() => {
    const card = window.toolGeometryFixture?.card;
    return card?.cardLayout?.activeGroupConfigs?.[0]?.xpos === 40
      && card.shadowRoot.querySelector('.icon-position');
  });

  const initial = await page.evaluate(() => {
    const card = window.toolGeometryFixture.card;
    const root = card.shadowRoot;
    const selectors = {
      arcs: '.arc-tool',
      circles: '.circle-tool',
      lines: '.line-tool',
      rectangles: '.rectangle-tool__fill',
      polygons: '.polygon-tool__fill',
    };
    const shapes = Object.fromEntries(Object.entries(selectors).map(([section, selector]) => {
      const tool = card.cardTools.sections[section][0];
      const element = root.querySelector(selector);
      const group = element.closest('g[transform]');
      return [section, {
        xpos: tool.geometry.svg.xpos,
        ypos: tool.geometry.svg.ypos,
        hasConfigSvg: Object.hasOwn(tool.config, 'svg'),
        transform: group.getAttribute('transform'),
        origin: group.style.transformOrigin.split(/\s+/).slice(0, 2).join(' '),
      }];
    }));
    const polygon = card.cardTools.sections.polygons[0];
    const icon = card.cardTools.sections.icons[0];
    const iconGroup = root.querySelector('.icon-position').parentElement;
    return {
      shapes,
      polygonPath: polygon.geometry.pathDefinition.d,
      polygonPathCenter: [polygon.geometry.pathInput.cx, polygon.geometry.pathInput.cy],
      icon: {
        xpos: icon.geometry.svg.xpos,
        ypos: icon.geometry.svg.ypos,
        hasConfigSvg: Object.hasOwn(icon.config, 'svg'),
        stateMapFlip: icon.runtime.stateMapItem.flip,
        transform: iconGroup.getAttribute('transform'),
        origin: iconGroup.style.transformOrigin.split(/\s+/).slice(0, 2).join(' '),
      },
    };
  });

  Object.values(initial.shapes).forEach((shape) => {
    expect(shape.hasConfigSvg).toBe(false);
    expect(shape.xpos).toBeCloseTo(80, 2);
    expect(shape.ypos).toBeCloseTo(90, 2);
    expect(shape.transform).toBe('scale(-1.25, 1.25)');
    expect(shape.origin).toBe('80px 90px');
  });
  expect(initial.polygonPath).not.toBe('');
  expect(initial.polygonPathCenter).toEqual([80, 90]);
  expect(initial.icon).toEqual({
    xpos: 80,
    ypos: 90,
    hasConfigSvg: false,
    stateMapFlip: 'x',
    transform: 'scale(-1.25, 1.25)',
    origin: '80px 90px',
  });

  await page.evaluate(() => {
    const { card, hass } = window.toolGeometryFixture;
    const changedAt = new Date(Date.now() + 1000).toISOString();
    const nextToolState = {
      ...hass.states['sensor.tool'],
      state: '2',
      last_changed: changedAt,
      last_updated: changedAt,
    };
    const nextHass = {
      ...hass,
      states: { ...hass.states, 'sensor.tool': nextToolState },
    };
    window.toolGeometryFixture.hass = nextHass;
    card.hass = nextHass;
  });
  await page.evaluate(() => window.toolGeometryFixture.card.updateComplete);
  const movedPositions = await page.evaluate(() => {
    const card = window.toolGeometryFixture.card;
    return {
      group: [card.cardLayout.activeGroupConfigs[0].xpos, card.cardLayout.activeGroupConfigs[0].ypos],
      polygon: [card.cardTools.sections.polygons[0].geometry.svg.xpos, card.cardTools.sections.polygons[0].geometry.svg.ypos],
    };
  });
  expect(movedPositions.group, errors.join('\n')).toEqual([60, 55]);
  expect(movedPositions.polygon[0]).toBeCloseTo(120, 6);
  expect(movedPositions.polygon[1]).toBeCloseTo(110, 6);

  const moved = await page.evaluate(() => {
    const card = window.toolGeometryFixture.card;
    const root = card.shadowRoot;
    const elements = ['.arc-tool', '.circle-tool', '.line-tool', '.rectangle-tool__fill', '.polygon-tool__fill'];
    const shapeGroups = elements.map((selector) => {
      const group = root.querySelector(selector).closest('g[transform]');
      return {
        transform: group.getAttribute('transform'),
        origin: group.style.transformOrigin.split(/\s+/).slice(0, 2).join(' '),
      };
    });
    const iconGroup = root.querySelector('.icon-position').parentElement;
    return {
      shapes: Object.fromEntries(
        ['arcs', 'circles', 'lines', 'rectangles', 'polygons'].map((section) => {
          const geometry = card.cardTools.sections[section][0].geometry.svg;
          return [section, { xpos: geometry.xpos, ypos: geometry.ypos }];
        }),
      ),
      shapeGroups,
      icon: {
        transform: iconGroup.getAttribute('transform'),
        origin: iconGroup.style.transformOrigin.split(/\s+/).slice(0, 2).join(' '),
        stateMapFlip: card.cardTools.sections.icons[0].runtime.stateMapItem.flip,
      },
    };
  });

  Object.values(moved.shapes).forEach((shape) => {
    expect(shape.xpos).toBeCloseTo(120, 2);
    expect(shape.ypos).toBeCloseTo(110, 2);
  });
  moved.shapeGroups.forEach((group) => {
    expect(group.transform).toBe('scale(-1.5, 1.5)');
    expect(group.origin).toBe('120px 110px');
  });
  expect(moved.icon).toEqual({
    transform: 'scale(-1.5, 1.5)',
    origin: '120px 110px',
    stateMapFlip: 'x',
  });
  expect(errors).toEqual([]);
  await page.evaluate(() => window.toolGeometryFixture.card.remove());
});

test('measured Name, Area and State drive Rectangle fit alongside legacy TextTool fit', async ({ page }) => {
  const errors = await loadToolCard(page, {
    type: 'custom:flex-horseshoe-card',
    entities: [{ entity: 'sensor.tool' }],
    layout: {
      names: [{ id: 'name', entity_index: 0, xpos: 50, ypos: 20 }],
      areas: [{ id: 'area', entity_index: 0, xpos: 50, ypos: 40 }],
      states: [{ id: 'state', entity_index: 0, xpos: 50, ypos: 60, show: { uom: 'end' } }],
      texts: [{ id: 'legacy', xpos: 50, ypos: 80, text: 'Legacy measured label' }],
      rectangles: [
        { id: 'name-fit', fit: { section: 'names', item_id: 'name', padding: { x: 3, y: 2 } } },
        { id: 'area-fit', fit: { section: 'areas', item_id: 'area', padding: { x: 3, y: 2 } } },
        { id: 'state-fit', fit: { section: 'states', item_id: 'state', padding: { x: 3, y: 2 } } },
        { id: 'legacy-fit', fit: { section: 'texts', item_id: 'legacy', padding: { x: 3, y: 2 } } },
      ],
    },
  });
  await waitForTextMeasurements(page);
  await page.waitForFunction(() => {
    const card = window.toolGeometryFixture.card;
    const references = [
      ['names', 'name-fit'],
      ['areas', 'area-fit'],
      ['states', 'state-fit'],
      ['texts', 'legacy-fit'],
    ];
    return references.every(([section, rectangleId]) => {
      const source = card.cardTools.sections[section][0];
      const rectangle = card.cardTools.sections.rectangles.find((tool) => tool.id === rectangleId);
      const geometry = source.geometry ?? source;
      const exact = source.geometry ? source.geometry.hasExactMeasurement : source.hasExactMeasurement;
      return exact && Math.abs(rectangle.geometry.svg.width - (geometry.measuredWidth + 6) * 2) < 0.05;
    });
  });

  const fits = await page.evaluate(() => {
    const card = window.toolGeometryFixture.card;
    return [
      ['names', 'name-fit'],
      ['areas', 'area-fit'],
      ['states', 'state-fit'],
      ['texts', 'legacy-fit'],
    ].map(([section, rectangleId]) => {
      const source = card.cardTools.sections[section][0];
      const rectangle = card.cardTools.sections.rectangles.find((tool) => tool.id === rectangleId);
      const geometry = source.geometry ?? source;
      return {
        exact: source.geometry ? source.geometry.hasExactMeasurement : source.hasExactMeasurement,
        centerX: geometry.measuredXpos,
        centerY: geometry.measuredYpos,
        width: geometry.measuredWidth,
        height: geometry.measuredHeight,
        rectangle: rectangle.geometry.svg,
      };
    });
  });

  fits.forEach((fit) => {
    expect(fit.exact).toBe(true);
    expect(fit.rectangle.xpos).toBeCloseTo(fit.centerX, 2);
    expect(fit.rectangle.ypos).toBeCloseTo(fit.centerY, 2);
    expect(fit.rectangle.width).toBeCloseTo((fit.width + 6) * 2, 2);
    expect(fit.rectangle.height).toBeCloseTo((fit.height + 4) * 2, 2);
  });
  expect(errors).toEqual([]);
  await page.evaluate(() => window.toolGeometryFixture.card.remove());
});

test('complete parent paint updates measured geometry and Rectangle fit without mutating config.styles', async ({ page }) => {
  const errors = await loadToolCard(page, {
    type: 'custom:flex-horseshoe-card',
    entities: [{ entity: 'sensor.tool' }],
    layout: {
      names: [{
        id: 'painted-name',
        entity_index: 0,
        xpos: 50,
        ypos: 50,
        styles: { 'font-size': '1em', fill: '#1565c0' },
      }],
      rectangles: [{
        id: 'painted-fit',
        fit: { section: 'names', item_id: 'painted-name', padding: { x: 2, y: 1 } },
      }],
    },
  });
  await page.waitForFunction(() => window.toolGeometryFixture
    ?.card.cardTools.sections.names[0]?.geometry.hasExactMeasurement);

  const before = await page.evaluate(() => {
    const card = window.toolGeometryFixture.card;
    const name = card.cardTools.sections.names[0];
    return {
      width: name.geometry.measuredWidth,
      height: name.geometry.measuredHeight,
      rectangleWidth: card.cardTools.sections.rectangles[0].geometry.svg.width,
      configStyles: structuredClone(name.config.styles),
    };
  });

  await page.evaluate(() => {
    const card = window.toolGeometryFixture.card;
    const name = card.cardTools.sections.names[0];
    name.setPaintStyles({ ...name.config.styles, 'font-size': '2em', fill: '#d32f2f' });
    card.requestUpdate();
  });
  await page.waitForFunction((previous) => {
    const card = window.toolGeometryFixture.card;
    const name = card.cardTools.sections.names[0];
    const rectangle = card.cardTools.sections.rectangles[0];
    return name.geometry.hasExactMeasurement
      && name.geometry.measuredWidth > previous.width * 1.5
      && name.geometry.measuredHeight > previous.height * 1.5
      && Math.abs(rectangle.geometry.svg.width - (name.geometry.measuredWidth + 4) * 2) < 0.05;
  }, before);

  const after = await page.evaluate(() => {
    const card = window.toolGeometryFixture.card;
    const name = card.cardTools.sections.names[0];
    return {
      width: name.geometry.measuredWidth,
      height: name.geometry.measuredHeight,
      rectangleWidth: card.cardTools.sections.rectangles[0].geometry.svg.width,
      configStyles: name.config.styles,
      paintStyles: name.paint.styles,
      computedFontSize: getComputedStyle(name.textElement.firstElementChild).fontSize,
      computedFill: getComputedStyle(name.textElement.firstElementChild).fill,
      effectiveFontSize: name.getStyles({ 'font-size': '1.5em' })['font-size'],
    };
  });

  expect(after.width).toBeGreaterThan(before.width * 1.5);
  expect(after.height).toBeGreaterThan(before.height * 1.5);
  expect(after.rectangleWidth).toBeCloseTo((after.width + 4) * 2, 2);
  expect(after.configStyles).toEqual(before.configStyles);
  expect(after.paintStyles).toEqual({ 'font-size': '2em', fill: '#d32f2f' });
  expect(after.computedFontSize).not.toBe('');
  expect(after.computedFill).toBe('rgb(211, 47, 47)');
  expect(after.effectiveFontSize).toBe('2em');
  expect(errors).toEqual([]);
  await page.evaluate(() => window.toolGeometryFixture.card.remove());
});

test('Icon state-map styles remain visible over complete parent paint', async ({ page }) => {
  const errors = await loadToolCard(page, {
    type: 'custom:flex-horseshoe-card',
    entities: [{ entity: 'sensor.icon' }],
    layout: {
      icons: [{
        id: 'painted-icon',
        entity_index: 0,
        xpos: 50,
        ypos: 50,
        icon: 'mdi:check',
        styles: { fill: '#1565c0', color: '#1565c0', 'stroke-width': '1' },
        state_map: { map: [{
          state: 'on',
          styles: { fill: '#d32f2f', color: '#d32f2f', opacity: '0.6' },
        }] },
      }],
    },
  });
  await page.waitForFunction(() => window.toolGeometryFixture.card
    .shadowRoot.querySelector('.icon-style-animation'));

  const originalStyles = await page.evaluate(() => {
    const card = window.toolGeometryFixture.card;
    const icon = card.cardTools.sections.icons[0];
    const configured = structuredClone(icon.config.styles);
    // Reproduce the Control order: parent visual state, authored child styles,
    // then transition. Publish that whole result without changing child config.
    icon.setPaintStyles({
      fill: '#43a047',
      color: '#43a047',
      cursor: 'crosshair',
      ...icon.config.styles,
      transition: 'fill 250ms ease',
    });
    card.requestUpdate();
    return configured;
  });
  await page.waitForFunction(() => {
    const element = window.toolGeometryFixture.card.shadowRoot
      .querySelector('.icon-style-animation');
    return element.style.cursor === 'crosshair';
  });

  const painted = await page.evaluate(() => {
    const card = window.toolGeometryFixture.card;
    const styles = getComputedStyle(card.shadowRoot.querySelector('.icon-style-animation'));
    return { fill: styles.fill, color: styles.color, opacity: styles.opacity,
      configured: card.cardTools.sections.icons[0].config.styles };
  });
  expect(painted.fill).toBe('rgb(211, 47, 47)');
  expect(painted.color).toBe('rgb(211, 47, 47)');
  expect(painted.opacity).toBe('0.6');
  expect(painted.configured).toEqual(originalStyles);

  await page.evaluate(() => {
    const card = window.toolGeometryFixture.card;
    card.cardTools.sections.icons[0].setPaintStyles(undefined);
    card.requestUpdate();
  });
  await page.waitForFunction(() => window.toolGeometryFixture.card.shadowRoot
    .querySelector('.icon-style-animation').style.cursor === '');
  const cleared = await page.evaluate(() => {
    const card = window.toolGeometryFixture.card;
    const styles = getComputedStyle(card.shadowRoot.querySelector('.icon-style-animation'));
    return { fill: styles.fill, configured: card.cardTools.sections.icons[0].config.styles };
  });
  expect(cleared.fill).toBe('rgb(211, 47, 47)');
  expect(cleared.configured).toEqual(originalStyles);
  expect(errors).toEqual([]);
  await page.evaluate(() => window.toolGeometryFixture.card.remove());
});
