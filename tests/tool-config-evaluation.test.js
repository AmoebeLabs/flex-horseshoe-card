import assert from 'node:assert/strict';
import test from 'node:test';
import BaseTool from '../src/base-tool.js';
import LineTool from '../src/line-tool.js';
import PolygonTool from '../src/polygon-tool.js';
import RectangleTool from '../src/rectangle-tool.js';
import Templates from '../src/templates.js';

/** Creates the production template evaluator with the runtime context used by tools. */
function createTemplates(constants = {}) {
  const templates = new Templates([]);
  const config = { constants, entities: [] };
  templates.beginConfig(config);
  templates.setHass({ states: {}, themes: { darkMode: true }, user: {} });
  return { templates, config };
}

/** Supplies only the card services exercised by the real tool constructors. */
function createToolCard() {
  const cardLayout = {
    changedGroupIds: new Set(),
    coordinateCalls: 0,
    calculateSvgCoordinatesInGroup(item) {
      this.coordinateCalls += 1;
      return { xpos: item.xpos * 2, ypos: item.ypos * 2 };
    },
    getGroupScaleTransform: () => '',
    getGroupScaleStyle: (_item, geometry) => geometry,
  };

  return {
    cardLayout,
    cardTheme: {
      modeChanged: false,
      getActiveColorStopMode: () => 'fixed',
    },
    cardTools: {
      getItemWidth: (width) => width,
      getItemHeight: (height) => height,
      getItemGeometry: () => ({ xpos: 50, ypos: 50, width: 20, height: 10 }),
    },
    cardAnimations: { styles: { lines: {}, rectangles: {}, polygons: {} } },
    config: {},
    evaluateJavascriptTemplates: false,
    requestUpdate() {},
  };
}

/** Marks a test config through the production detector before constructing a tool. */
function detect(templates, config) {
  templates.detectJavascriptTemplates(config);
  return config;
}

test('Line evaluates horizontal, vertical, and fromto orientation before geometry', () => {
  const lineSource = {
    id: 'dynamic-line',
    xpos: 30,
    ypos: 40,
    length: 24,
    start: { xpos: 18, ypos: 22 },
    end: { xpos: 76, ypos: 84 },
    orientation: '[[[ return constants.orientation; ]]]',
  };
  const { templates, config: templateConfig } = createTemplates({ orientation: 'horizontal' });
  detect(templates, lineSource);
  const card = createToolCard();
  const dynamicLine = new LineTool(lineSource, 0, templates, 'card', card);

  assert.equal(card.cardLayout.coordinateCalls, 0);
  assert.deepEqual(dynamicLine.geometry, {});
  assert.equal(dynamicLine.config.orientation, lineSource.orientation);
  assert.equal(dynamicLine.sourceConfig.orientation, lineSource.orientation);

  for (const orientation of ['horizontal', 'vertical', 'fromto']) {
    templateConfig.constants.orientation = orientation;
    card.evaluateJavascriptTemplates = true;
    dynamicLine.updateRuntimeConfig();

    const staticConfig = { ...lineSource, orientation };
    const { templates: staticTemplates } = createTemplates();
    staticTemplates.detectJavascriptTemplates(staticConfig);
    const staticLine = new LineTool(staticConfig, 0, staticTemplates, 'card', createToolCard());

    assert.equal(dynamicLine.config.orientation, orientation);
    assert.deepEqual(dynamicLine.geometry.svg, staticLine.geometry.svg);
  }
});

test('Rectangle evaluates numeric and auto fill_mask without changing its geometry', () => {
  const rectangleSource = {
    id: 'dynamic-rectangle',
    xpos: 42,
    ypos: 36,
    width: 32,
    height: 18,
    radius: 3,
    fill_mask: '[[[ return constants.fill_mask; ]]]',
  };
  const { templates, config: templateConfig } = createTemplates({ fill_mask: 4 });
  detect(templates, rectangleSource);
  const card = createToolCard();
  const dynamicRectangle = new RectangleTool(rectangleSource, 0, templates, 'card', card);
  assert.equal(dynamicRectangle.config.fill_mask, rectangleSource.fill_mask);
  dynamicRectangle.updateRuntimeConfig();

  const staticNumber = new RectangleTool(
    { ...rectangleSource, fill_mask: 4 }, 0, createTemplates().templates, 'card', createToolCard(),
  );
  assert.equal(dynamicRectangle.config.fill_mask, 4);
  assert.deepEqual(dynamicRectangle.geometry.svg, staticNumber.geometry.svg);

  const publishedConfig = dynamicRectangle.config;
  const originalGeometry = structuredClone(dynamicRectangle.geometry.svg);
  card.evaluateJavascriptTemplates = true;
  dynamicRectangle.updateRuntimeConfig();
  assert.strictEqual(dynamicRectangle.config, publishedConfig);

  templateConfig.constants.fill_mask = 'auto';
  dynamicRectangle.updateRuntimeConfig();
  const staticAuto = new RectangleTool(
    { ...rectangleSource, fill_mask: 'auto' }, 0, createTemplates().templates, 'card', createToolCard(),
  );
  assert.equal(dynamicRectangle.config.fill_mask, 'auto');
  assert.deepEqual(dynamicRectangle.geometry.svg, originalGeometry);
  assert.deepEqual(dynamicRectangle.geometry.svg, staticAuto.geometry.svg);
});

test('Polygon waits for evaluated sides and top, then completes odd/even defaults', () => {
  const explicitTopSource = {
    id: 'dynamic-polygon',
    xpos: 48,
    ypos: 52,
    width: 34,
    height: 28,
    radius: 0,
    sides: '[[[ return constants.sides; ]]]',
    top: '[[[ return constants.top; ]]]',
  };
  const { templates, config: templateConfig } = createTemplates({ sides: 6, top: 2 });
  detect(templates, explicitTopSource);
  const card = createToolCard();
  const dynamicPolygon = new PolygonTool(explicitTopSource, 0, templates, 'card', card);

  assert.equal(card.cardLayout.coordinateCalls, 0);
  assert.deepEqual(dynamicPolygon.geometry, {});
  assert.equal(dynamicPolygon.config.sides, explicitTopSource.sides);
  assert.equal(dynamicPolygon.config.top, explicitTopSource.top);
  dynamicPolygon.updateRuntimeConfig();

  const staticPolygon = new PolygonTool(
    { ...explicitTopSource, sides: 6, top: 2 }, 0, createTemplates().templates, 'card', createToolCard(),
  );
  assert.deepEqual(dynamicPolygon.config, staticPolygon.config);
  assert.deepEqual(dynamicPolygon.geometry, staticPolygon.geometry);

  const defaultTopSource = {
    id: 'dynamic-default-top',
    xpos: 50,
    ypos: 50,
    width: 30,
    height: 24,
    radius: 0,
    sides: '[[[ return constants.sides; ]]]',
  };
  const defaultContext = createTemplates({ sides: 6 });
  detect(defaultContext.templates, defaultTopSource);
  const defaultCard = createToolCard();
  const defaultTopPolygon = new PolygonTool(defaultTopSource, 0, defaultContext.templates, 'card', defaultCard);
  assert.equal(defaultCard.cardLayout.coordinateCalls, 0);
  defaultTopPolygon.updateRuntimeConfig();

  for (const [sides, top] of [[6, 0.5], [5, 0]]) {
    if (sides === 5) {
      defaultContext.config.constants.sides = sides;
      defaultCard.evaluateJavascriptTemplates = true;
      defaultTopPolygon.updateRuntimeConfig();
    }

    const expected = new PolygonTool(
      { ...defaultTopSource, sides }, 0, createTemplates().templates, 'card', createToolCard(),
    );
    assert.equal(defaultTopPolygon.config.top, top);
    assert.deepEqual(defaultTopPolygon.geometry, expected.geometry);
  }
});

test('Static invalid translation fails in construction; dynamic invalid results fail on publication', () => {
  const rectangleConfig = {
    id: 'invalid-mask', xpos: 50, ypos: 50, width: 20, height: 12, fill_mask: -1,
  };
  assert.throws(
    () => new RectangleTool(rectangleConfig, 0, createTemplates().templates, 'card', createToolCard()),
    /fill_mask/,
  );

  const dynamicSource = {
    ...rectangleConfig,
    fill_mask: '[[[ return constants.fill_mask; ]]]',
  };
  const { templates } = createTemplates({ fill_mask: -1 });
  detect(templates, dynamicSource);
  const dynamicRectangle = new RectangleTool(dynamicSource, 0, templates, 'card', createToolCard());
  assert.throws(() => dynamicRectangle.updateRuntimeConfig(), /fill_mask/);
});

test('Dynamic entity_index binds only after config publication and keeps default bindings', () => {
  const entityZero = { entity_id: 'sensor.zero', state: 'zero' };
  const entityOne = { entity_id: 'sensor.one', state: 'one' };
  const entityConfigs = [{ entity: entityZero.entity_id }, { entity: entityOne.entity_id }];
  const source = {
    id: 'dynamic-binding',
    entity_index: '[[[ return constants.selected_entity; ]]]',
  };
  const { templates, config: templateConfig } = createTemplates({ selected_entity: 1 });
  detect(templates, source);
  const tool = new BaseTool(source, 0, templates, 'card', createToolCard(), 'rectangles', 'rectangles', 0);

  tool.updateRuntimeConfig();
  assert.equal(tool.config.entity_index, 1);
  assert.equal(tool.entity_index, 1);
  tool.setEntities(entityConfigs, [entityZero, entityOne]);
  assert.strictEqual(tool.runtime.entity, entityOne);

  templateConfig.constants.selected_entity = 0;
  tool.card.evaluateJavascriptTemplates = true;
  tool.updateRuntimeConfig();
  assert.equal(tool.config.entity_index, 0);
  assert.equal(tool.entity_index, 0);
  tool.setEntities(entityConfigs, [entityZero, entityOne]);
  assert.strictEqual(tool.runtime.entity, entityZero);

  const defaultTool = new BaseTool(
    { id: 'default-binding' }, 0, createTemplates().templates, 'card', createToolCard(), 'rectangles', 'rectangles', 0,
  );
  defaultTool.setEntities(entityConfigs, [entityZero, entityOne]);
  assert.equal(defaultTool.entity_index, 0);
  assert.strictEqual(defaultTool.runtime.entity, entityZero);
});

test('Dynamic zpos and dzpos publish a concrete render layer', () => {
  const source = {
    id: 'dynamic-layer',
    zpos: '[[[ return constants.zpos; ]]]',
    dzpos: '[[[ return constants.dzpos; ]]]',
  };
  const { templates, config: templateConfig } = createTemplates({ zpos: 18, dzpos: -3 });
  detect(templates, source);
  const card = createToolCard();
  const tool = new BaseTool(source, 0, templates, 'card', card, 'rectangles');

  tool.updateRuntimeConfig();
  assert.equal(tool.config.zpos, 18);
  assert.equal(tool.config.dzpos, -3);
  assert.equal(tool.zpos, 15);

  templateConfig.constants.zpos = 31;
  templateConfig.constants.dzpos = 4;
  card.evaluateJavascriptTemplates = true;
  tool.updateRuntimeConfig();
  assert.equal(tool.config.zpos, 31);
  assert.equal(tool.config.dzpos, 4);
  assert.equal(tool.zpos, 35);
});
