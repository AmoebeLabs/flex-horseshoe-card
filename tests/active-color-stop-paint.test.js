import assert from 'node:assert/strict';
import test from 'node:test';
import BaseTool from '../src/base-tool.js';
import CardEntities from '../src/card-entities.js';
import ColorStops from '../src/color-stops.js';
import Templates from '../src/templates.js';
import TextTool from '../src/text-tool.js';

function createCard(themeMode = 'light') {
  let activeThemeMode = themeMode;
  const cardTheme = {
    modeChanged: false,
    colorContext: {},
    getActiveColorStopMode: () => activeThemeMode,
    setMode: (mode) => { activeThemeMode = mode; },
  };
  const cardEntities = new CardEntities({ hasJavascriptTemplates: () => false }, cardTheme);
  const card = {
    cardTheme,
    cardEntities,
    cardLayout: {
      changedGroupIds: new Set(),
      calculateSvgCoordinatesInGroup: (item) => ({ xpos: item.xpos, ypos: item.ypos }),
      getGroupScaleTransform: () => '',
      getGroupScaleStyle: () => '',
    },
    cardAnimations: { styles: { texts: {} } },
    cardTools: {
      sections: { names: [], areas: [], states: [] },
      getBySection(section) { return this.sections[section]; },
    },
    config: { entities: [{ entity: 'sensor.test' }] },
    entities: [{ state: 'on', attributes: {} }],
    resolvedEntityConfigs: [{ entity: 'sensor.test' }],
    evaluateJavascriptTemplates: false,
    requestUpdate() {},
    _hass: { localize: (key) => key },
  };

  return card;
}

test('BaseTool keeps the supplied template context and publishes palette before completion', () => {
  const card = createCard();
  const definition = { colors: [{ value: 0, color: '#1976d2' }] };
  const calls = [];
  const evaluatedConfigs = [];
  const translatedInputs = [];
  const templates = {
    hasJavascriptTemplates: () => true,
    getJsTemplateOrValue(item, value, options) {
      calls.push({ item, value, options });
      const evaluatedConfig = { ...value, xpos: 32 };
      evaluatedConfigs.push(evaluatedConfig);
      return evaluatedConfig;
    },
  };
  class PaletteCompletingTool extends BaseTool {
    completeRuntimeConfig(config, evaluatedSourceConfig) {
      this.paletteAtCompletion = this.paint.colorStops;
      this.sourceAtCompletion = evaluatedSourceConfig;
      return config;
    }
  }
  const translateConfig = (config) => {
    translatedInputs.push(config);
    return { ...config };
  };
  const tool = new PaletteCompletingTool({
    id: 'contextual',
    xpos: '[[[ position ]]]',
    ypos: 50,
    color_stops: definition,
  }, 0, templates, 'card', card, 'rectangles', 'rectangles', undefined, undefined, translateConfig);
  const templateContext = {
    ...tool.sourceConfig,
    index: 4,
    group_config: { id: 'initial-group' },
    colorstops: ColorStops.normalize(definition, 'light'),
  };
  const templateOptions = { resolveKeys: true };

  tool.updateRuntimeConfig(tool.sourceConfig, templateOptions, templateContext);

  assert.equal(calls.length, 1);
  assert.strictEqual(calls[0].item, templateContext);
  assert.strictEqual(calls[0].value, tool.sourceConfig);
  assert.strictEqual(calls[0].options, templateOptions);
  assert.strictEqual(translatedInputs[0], evaluatedConfigs[0]);
  assert.strictEqual(tool.sourceAtCompletion, evaluatedConfigs[0]);
  assert.deepEqual(tool.config.color_stops, definition);
  assert.equal(Object.hasOwn(tool.config, 'colorstops'), false);
  assert.deepEqual(tool.paint.colorStops, ColorStops.normalize(definition, 'light'));
  assert.strictEqual(tool.paletteAtCompletion, tool.paint.colorStops);

  card.evaluateJavascriptTemplates = true;
  tool.updateRuntimeConfig(tool.sourceConfig, templateOptions, templateContext);
  assert.equal(calls.length, 2);
  assert.equal(tool.sourceAtCompletion, undefined);
  assert.equal(translatedInputs.length, 1);

  class StaticSourceCompletingTool extends BaseTool {
    completeRuntimeConfig(config, evaluatedSourceConfig) {
      this.sourceAtCompletion = evaluatedSourceConfig;
      return config;
    }
  }
  const staticTool = new StaticSourceCompletingTool(
    { id: 'static-source', xpos: 50, ypos: 50 },
    1,
    { hasJavascriptTemplates: () => false },
    'card',
    card,
    'rectangles',
  );
  staticTool.updateRuntimeConfig();
  assert.strictEqual(staticTool.sourceAtCompletion, staticTool.sourceConfig);
});

test('BaseTool normalizes nested Sparkline legacy stops and clears removed generic stops', () => {
  const card = createCard();
  const publicStops = {
    colors: [{ value: 0, color: '#43a047' }],
    modes: { dark: [{ value: 0, color: '#81c784' }] },
  };
  const legacyStops = { colors: [{ value: 0, color: '#e53935' }] };
  const sparklineTool = new BaseTool({
    id: 'graph',
    sparkline: { color_stops: publicStops, colorstops: legacyStops },
  }, 0, { hasJavascriptTemplates: () => false }, 'card', card, 'sparklines');

  sparklineTool.updateRuntimeConfig();

  assert.deepEqual(sparklineTool.paint.colorStops, ColorStops.normalize(publicStops, 'light'));
  assert.strictEqual(sparklineTool.config.sparkline.colorstops, legacyStops);

  card.cardTheme.setMode('dark');
  card.cardTheme.modeChanged = true;
  sparklineTool.updateRuntimeConfig();
  assert.deepEqual(sparklineTool.paint.colorStops, ColorStops.normalize(publicStops, 'dark'));
  assert.strictEqual(sparklineTool.config.sparkline.colorstops, legacyStops);

  const dynamicSource = {
    id: 'dynamic-item',
    xpos: '[[[ position ]]]',
    color_stops: { colors: [{ value: 0, color: '#00897b' }] },
  };
  const dynamicTemplates = {
    hasJavascriptTemplates: () => true,
    getJsTemplateOrValue: (_item, value) => structuredClone(value),
  };
  const genericCard = createCard();
  const genericTool = new BaseTool(dynamicSource, 1, dynamicTemplates, 'card', genericCard, 'rectangles');

  genericTool.updateRuntimeConfig();
  assert.deepEqual(genericTool.paint.colorStops, ColorStops.normalize(dynamicSource.color_stops, 'light'));

  const nextSource = structuredClone(genericTool.sourceConfig);
  delete nextSource.color_stops;
  genericCard.evaluateJavascriptTemplates = true;
  genericTool.updateRuntimeConfig(nextSource, { resolveKeys: true }, nextSource);

  assert.equal(genericTool.paint, undefined);
  assert.equal(Object.hasOwn(genericTool.config, 'colorstops'), false);
  assert.deepEqual(genericTool.sourceConfig.color_stops, dynamicSource.color_stops);
});

test('CardEntities owns normalized entity palettes and inherits derived source paint', () => {
  const card = createCard();
  const sourceDefinition = { colors: [{ value: 0, color: '#5e35b1' }] };
  const config = {
    dev: { debug: false },
    entities: [
      { entity: 'sensor.source', color_stops: sourceDefinition },
      { entity: 'fhs_sparkline.graph_avg' },
    ],
    layout: { sparklines: [{ id: 'graph', entity_index: 0 }] },
  };

  const resolved = card.cardEntities.buildRuntimeEntityConfigs(config, false);

  assert.deepEqual(card.cardEntities.paint.colorStops[0], ColorStops.normalize(sourceDefinition, 'light'));
  assert.strictEqual(card.cardEntities.paint.colorStops[1], card.cardEntities.paint.colorStops[0]);
  assert.equal(Object.hasOwn(resolved[0], 'colorstops'), false);
  assert.equal(Object.hasOwn(resolved[1], 'colorstops'), false);
  assert.deepEqual(resolved[1].color_stops, sourceDefinition);

  delete config.entities[0].color_stops;
  card.cardEntities.buildRuntimeEntityConfigs(config, false);
  assert.deepEqual(card.cardEntities.paint.colorStops, [undefined, undefined]);
});

test('Text parts use their own state-map and referenced paint, then entity fallback', () => {
  const card = createCard();
  const outerStops = { colors: [{ value: 0, color: '#f4511e' }] };
  const ownStops = { colors: [{ value: 0, color: '#1e88e5' }] };
  const mappedStops = { colors: [{ value: 0, color: '#8e24aa' }] };
  const referencedStops = { colors: [{ value: 0, color: '#00897b' }] };
  const entityStops = { colors: [{ value: 0, color: '#43a047' }] };
  card.cardEntities.paint.colorStops[0] = ColorStops.normalize(entityStops, 'light');
  const selectedPalettes = [];
  card.cardEntities.getItemColorStop = (_item, colorStops) => {
    selectedPalettes.push(colorStops);
    return { color: colorStops.colors[0].color, styles: { opacity: '0.5' } };
  };
  const sourceTool = {
    id: 'named-source',
    entity_index: 0,
    getTextParts: () => [{ type: 'name', value: 'referenced value', entity_index: 0, styles: { fill: '#263238' } }],
  };
  card.cardTools.sections.names.push(sourceTool);
  card.cardAnimations.styles.texts.animated = { fill: '#212121' };

  const tool = new TextTool({
    id: 'palette-text',
    xpos: 50,
    ypos: 50,
    color_stops: outerStops,
    text: [
      {
        value: 'own value',
        entity_index: 0,
        animation_id: 'animated',
        show: { item_style: 'colorstop' },
        color_stops: ownStops,
      },
      {
        value: 'mapped value',
        entity_index: 0,
        show: { item_style: 'colorstop' },
        state_map: { map: [{ state: 'on', color_stops: mappedStops }] },
      },
      {
        type: 'name',
        id: 'named-source',
        entity_index: 0,
        show: { item_style: 'colorstop' },
        color_stops: referencedStops,
      },
      { value: 'entity value', entity_index: 0, show: { item_style: 'colorstop' } },
    ],
  }, 0, Templates, 'card', card);

  tool.updateRuntimeConfig();
  tool.setState(card.entities[0], card.resolvedEntityConfigs[0]);
  const rendered = tool.getRenderedTextParts(tool.runtime.textParts, false);

  assert.deepEqual(selectedPalettes.slice(-4).map((palette) => palette.colors[0].color), [
    '#1e88e5', '#8e24aa', '#00897b', '#43a047',
  ]);
  assert.equal(rendered[0].renderStyles.fill, '#212121');
  assert.equal(rendered[1].renderStyles.fill, '#8e24aa');
  assert.equal(rendered[2].renderStyles.fill, '#00897b');
  assert.equal(rendered[3].renderStyles.fill, '#43a047');
  assert.strictEqual(rendered[0].paint, tool.runtime.textParts[0].paint);
  assert.strictEqual(rendered[2].paint, tool.runtime.textParts[2].paint);
  assert.deepEqual(tool.config.text[0].color_stops, ownStops);
  assert.deepEqual(tool.config.text[1].state_map.map[0].color_stops, mappedStops);
  assert.deepEqual(tool.config.text[2].color_stops, referencedStops);
  assert.equal(Object.hasOwn(tool.config, 'colorstops'), false);
  tool.config.text.forEach((part) => assert.equal(Object.hasOwn(part, 'colorstops'), false));
  tool.runtime.textParts.forEach((part) => assert.equal(Object.hasOwn(part, 'colorstops'), false));
});

test('Text wrap fanout retains the same part paint owner', () => {
  const card = createCard();
  const definition = { colors: [{ value: 0, color: '#3949ab' }] };
  const tool = new TextTool({
    id: 'wrapped-palette-text',
    xpos: 50,
    ypos: 50,
    text_overflow: { mode: 'wrap', wrap: { characters: 5 } },
    text: [{
      value: 'alpha beta',
      entity_index: 0,
      show: { item_style: 'colorstop' },
      color_stops: definition,
    }],
  }, 0, Templates, 'card', card);

  tool.updateRuntimeConfig();
  tool.setState(card.entities[0], card.resolvedEntityConfigs[0]);

  assert.deepEqual(tool.runtime.textParts.map((part) => part.value), ['alpha', 'beta']);
  assert.strictEqual(tool.runtime.textParts[0].paint, tool.runtime.textParts[1].paint);
  assert.deepEqual(tool.runtime.textParts[0].paint.colorStops, ColorStops.normalize(definition, 'light'));
});
