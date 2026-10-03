import assert from 'node:assert/strict';
import test from 'node:test';

import ColorStops from '../src/color-stops.js';
import HorseshoeGauge from '../src/horseshoe-gauge.js';
import { buildGaugeColorStops, getGaugeStateData, normalizeBaseConfig, translateHorseshoeConfig } from '../src/horseshoe-state.js';
import Templates from '../src/templates.js';

/**
 * Builds a Horseshoe against the real card template evaluator and the runtime
 * services used during configuration publication.
 */
function createHorseshoeFixture(source) {
  const horseshoes = Array.isArray(source) ? source : [source];
  const entities = [
    {
      entity_id: 'sensor.main',
      state: '11',
      last_changed: '2026-10-03T12:00:00.000Z',
      attributes: { power: '37.5' },
    },
    {
      entity_id: 'sensor.comparison',
      state: '22',
      last_changed: '2026-10-03T12:00:00.000Z',
      attributes: {},
    },
  ];
  const entityConfigs = [
    { entity: 'sensor.main', attribute: undefined },
    { entity: 'sensor.comparison', attribute: undefined },
  ];
  const cardConfig = {
    entities: entityConfigs,
    constants: {
      horseshoeEvaluations: 0,
      showEvaluations: 0,
      pathEvaluations: 0,
    },
    dev: { debug: false },
  };
  const hass = {
    states: {
      'sensor.main': entities[0],
      'sensor.comparison': entities[1],
    },
    locale: { language: 'en', time_format: '24' },
    config: { time_zone: 'UTC' },
    user: {},
    formatEntityState(_entity, value) {
      return String(value);
    },
    formatEntityAttributeValue(_entity, _attribute, value) {
      return String(value);
    },
  };
  const templates = new Templates(entities);
  templates.beginConfig(cardConfig);
  templates.setHass(hass);
  templates.detectJavascriptTemplates(horseshoes);
  let activeColorStopMode = 'light';

  const group = { id: 'card', xpos: 50, ypos: 50, scale: 1 };
  const groupManager = {
    getGroupForItem() {
      return group;
    },
    getGroupChainForItem() {
      return [];
    },
    isItemVisible() {
      return true;
    },
  };
  const card = {
    config: cardConfig,
    evaluateJavascriptTemplates: true,
    dev: { debug: false, fakeData: false },
    entities,
    resolvedEntityConfigs: entityConfigs,
    _hass: hass,
    cardAnimations: { styles: { horseshoes: {} } },
    cardLayout: {
      changedGroupIds: new Set(),
      groupManager,
      masksClips: {
        applyGradientRefs(styles) {
          return styles;
        },
      },
    },
    cardTheme: {
      modeChanged: false,
      getActiveColorStopMode() {
        return activeColorStopMode;
      },
      colorContext: { cacheReady: false },
    },
    requestUpdate() {},
  };
  const config = { layout: { horseshoes } };
  const tools = HorseshoeGauge.setConfig(config, templates, 'architecture-card', card);

  return {
    card,
    cardConfig,
    config,
    entities,
    templates,
    tools,
    setColorStopMode(mode) {
      activeColorStopMode = mode;
      card.cardTheme.modeChanged = true;
    },
  };
}

/** Translates authored settings without publishing palette-derived output. */
function normalizeGaugeConfig(source) {
  return translateHorseshoeConfig(normalizeBaseConfig(source), 'light');
}

/** Reads the active source stops separately from authored Horseshoe config. */
function getSourceColorStops(config) {
  return ColorStops.normalize(config.color_stops, 'light');
}

test('real Templates preserve prepared source defaults and the outer Horseshoe item context', () => {
  const probe = '[[[ constants.horseshoeEvaluations += 1; return [item.radius, item.show.horseshoe, item.show.horseshoe_style, item.colorstops.scales.default.min, item.colorstops.scales.default.max, item.colorstops.colors[0].color, entity.entity_id, state, entities[1].state].join("|"); ]]]';
  const fixture = createHorseshoeFixture({
    id: 'context-gauge',
    entity_index: 0,
    xpos: 50,
    ypos: 50,
    radius: 30,
    horseshoe_scale: { min: 0, max: 100 },
    color_stops: {
      scales: { default: { min: 1, max: 9 } },
      colors: [
        { value: 100, color: '#abcdef' },
        { value: 0, color: '#123456' },
      ],
    },
    path: { type: 'line', length: 80, angle: 0 },
    probe,
  });
  const [tool] = fixture.tools;

  tool.updateRuntimeConfig();

  assert.equal(fixture.cardConfig.constants.horseshoeEvaluations, 1);
  assert.equal(
    tool.config.probe,
    '30|true|fixed|1|9|#123456|sensor.main|11|22',
  );
  assert.equal(tool.sourceConfig.probe, probe);
  assert.deepEqual(tool.sourceConfig.show, {
    horseshoe: true,
    horseshoe_style: 'fixed',
    labels_at: 'none',
    state_progress: true,
    state_marker: false,
  });
  assert.equal(Object.hasOwn(tool.sourceConfig, 'colorstops'), false);
  assert.equal(Object.hasOwn(tool.config, 'colorstops'), false);
  assert.deepEqual(tool.paint.colorStops.scales.default, { min: 1, max: 9 });
  assert.equal(tool.paint.colorStops.colors[0].color, '#123456');
  assert.equal(tool.config.path.type, 'line');
  assert.equal(tool.config.path.length, 80);
});

test('numeric state maps and entity attributes retain their current value conversion', () => {
  const config = normalizeGaugeConfig({
    horseshoe_scale: { min: 0, max: 100 },
    state_map: {
      map: [{ state: 'charging', value: 42, label: 'Charging', color: '#ff8800' }],
    },
  });
  const sourceStops = getSourceColorStops(config);
  const mapped = getGaugeStateData(
    config,
    { state: 'charging', attributes: {} },
    { attribute: undefined },
    sourceStops,
  );
  const attributeValue = getGaugeStateData(
    config,
    { state: 'unavailable', attributes: { power: '37.5' } },
    { attribute: 'power' },
    sourceStops,
  );

  assert.equal(mapped.rawState, 'charging');
  assert.equal(mapped.value, 42);
  assert.equal(mapped.mappedState.state, 'charging');
  assert.equal(mapped.mappedState.label, 'Charging');
  assert.equal(attributeValue.rawState, 'unavailable');
  assert.equal(attributeValue.value, 37.5);
  assert.equal(attributeValue.mappedState, undefined);
});

test('ranked string stops map states in rank order to zero-based values', () => {
  const config = normalizeGaugeConfig({
    horseshoe_scale: { min: 0, max: 100 },
    horseshoe_state: { mode: 'stringstate_level' },
    color_stops: {
      colors: [
        { state: 'high', rank: 2, color: '#b71c1c' },
        { state: 'low', rank: 0, color: '#1b5e20' },
        { state: 'medium', rank: 1, color: '#f9a825' },
      ],
    },
  });
  const sourceStops = getSourceColorStops(config);
  const result = getGaugeStateData(
    config,
    { state: 'high', attributes: {} },
    { attribute: undefined },
    sourceStops,
  );
  const palette = buildGaugeColorStops(config, result, sourceStops);

  assert.equal(result.rawState, 'high');
  assert.equal(result.value, 2);
  assert.equal(result.mappedState.state, 'high');
  assert.equal(result.mappedState.rank, 2);
  assert.deepEqual(
    result.stateMap.map.map(({ state, value }) => [state, value]),
    [['low', 0], ['medium', 1], ['high', 2]],
  );
  assert.equal(result.stateMap.map[2].color, undefined);
  assert.deepEqual(
    palette.colorStops.colors.map(({ state, value, color }) => [state, value, color]),
    [['low', 0, '#1b5e20'], ['medium', 1, '#f9a825'], ['high', 2, '#b71c1c']],
  );
});

test('rank_state maps numeric thresholds into a rank scale', () => {
  const config = normalizeGaugeConfig({
    horseshoe_scale: { min: 0, max: 20 },
    horseshoe_state: { mode: 'stringstate_mode' },
    state_map: {
      type: 'rank_state',
      map: [
        { state: 'low', rank: 0 },
        { state: 'medium', rank: 1 },
        { state: 'high', rank: 2 },
      ],
    },
    color_stops: {
      colors: [
        { value: 0, rank: 0, color: '#1b5e20' },
        { value: 10, rank: 1, color: '#f9a825' },
        { value: 20, rank: 2, color: '#b71c1c' },
      ],
    },
  });
  const sourceStops = getSourceColorStops(config);
  const result = getGaugeStateData(
    config,
    { state: '15', attributes: {} },
    { attribute: undefined },
    sourceStops,
  );
  const palette = buildGaugeColorStops(config, result, sourceStops);

  assert.equal(result.value, 1.5);
  assert.equal(result.mappedState.state, 'medium');
  assert.equal(result.mappedState.rank, 1);
  assert.equal(result.mappedState.source_value, '15');
  assert.equal(result.mappedState.color, undefined);
  assert.equal(Object.hasOwn(result.mappedState, 'source_color_stop'), false);
  assert.equal(result.scale.min, 0);
  assert.equal(result.scale.max, 3);
  assert.deepEqual(
    palette.colorStops.colors.map(({ state, value, color }) => [state, value, color]),
    [['low', 0, '#1b5e20'], ['medium', 1, '#f9a825'], ['high', 2, '#b71c1c']],
  );
});

test('dynamic visibility stays factory-retained and construction waits to generate its path', () => {
  const fixture = createHorseshoeFixture({
    id: 'dynamic-gauge',
    entity_index: 0,
    xpos: 50,
    ypos: 50,
    horseshoe_scale: { min: 0, max: 100 },
    show: {
      horseshoe: '[[[ constants.showEvaluations += 1; return false; ]]]',
    },
    path: '[[[ constants.pathEvaluations += 1; return { type: "arc", radius: 30 }; ]]]',
  });
  const [tool] = fixture.tools;
  const staticFalseFixture = createHorseshoeFixture({
    id: 'hidden-gauge',
    entity_index: 0,
    horseshoe_scale: { min: 0, max: 100 },
    show: { horseshoe: false },
  });

  assert.equal(fixture.tools.length, 1);
  assert.equal(tool.hasJavascript, true);
  assert.equal(tool.activeConfigInitialized, false);
  assert.equal(tool.render().strings.join(''), '');
  assert.equal(fixture.cardConfig.constants.showEvaluations, 0);
  assert.equal(fixture.cardConfig.constants.pathEvaluations, 0);
  assert.equal(staticFalseFixture.tools.length, 0);

  tool.updateRuntimeConfig();

  assert.equal(fixture.tools.length, 1);
  assert.equal(tool.config.show.horseshoe, false);
  assert.equal(fixture.cardConfig.constants.showEvaluations, 1);
  assert.equal(fixture.cardConfig.constants.pathEvaluations, 1);
});

test('static false gauges skip translation and visible gauges keep their source section index', () => {
  const fixture = createHorseshoeFixture([
    {
      id: 'hidden-without-scale',
      entity_index: 0,
      show: { horseshoe: false },
    },
    {
      id: 'visible-after-hidden',
      entity_index: 0,
      horseshoe_scale: { min: 0, max: 100 },
    },
  ]);

  assert.equal(fixture.tools.length, 1);
  assert.equal(fixture.tools[0].index, 1);
  assert.equal(fixture.tools[0].config.id, 'visible-after-hidden');
});

test('state mapping returns semantic data instead of a state-specific config', () => {
  const config = normalizeGaugeConfig({
    horseshoe_scale: { min: 0, max: 100 },
    state_map: {
      map: [{ state: 'charging', value: 42, label: 'Charging' }],
    },
  });
  const sourceStops = getSourceColorStops(config);
  const stateData = getGaugeStateData(
    config,
    { state: 'charging', attributes: {} },
    { attribute: undefined },
    sourceStops,
  );

  assert.equal(Object.hasOwn(stateData, 'config'), false);
  assert.equal(stateData.rawState, 'charging');
  assert.equal(stateData.value, 42);
  assert.equal(stateData.mappedState.state, 'charging');
});

test('Horseshoe publishes geometry, runtime, and paint through canonical owners only', () => {
  const fixture = createHorseshoeFixture({
    id: 'canonical-owner-gauge',
    entity_index: 0,
    xpos: 50,
    ypos: 50,
    path: { type: 'line', length: 80, angle: 0 },
    horseshoe_scale: { min: 0, max: 100 },
    show: { horseshoe_style: 'colorstop' },
    state_map: {
      map: [{ state: 'active', value: 60, label: 'Active' }],
    },
    color_stops: {
      colors: [
        { value: 0, color: '#1b5e20' },
        { value: 100, color: '#b71c1c' },
      ],
    },
  });
  const [tool] = fixture.tools;

  tool.updateRuntimeConfig();
  const publishedConfig = tool.config;
  const publishedConfigSnapshot = structuredClone(publishedConfig);
  tool.setState(
    { entity_id: 'sensor.main', state: 'active', attributes: {} },
    fixture.cardConfig.entities[0],
  );

  assert.equal(tool.config, publishedConfig);
  assert.deepEqual(tool.config, publishedConfigSnapshot);
  assert.equal(Object.hasOwn(tool.config, 'svg'), false);
  assert.equal(Object.hasOwn(tool, 'activeItemConfig'), false);
  assert.equal(Object.hasOwn(tool, 'runtimeConfig'), false);

  assert.equal(tool.geometry.pathInput.type, 'line');
  assert.equal(typeof tool.geometry.pathDefinition.d, 'string');
  assert.ok(tool.geometry.pathGeometry);

  assert.equal(tool.runtime.value, 60);
  assert.equal(tool.runtime.stateMap.map[0].state, 'active');
  assert.equal(tool.runtime.mappedState.state, 'active');
  assert.equal(tool.runtime.mappedState.color, undefined);
  assert.equal(tool.runtime.scale.min, 0);
  assert.equal(tool.runtime.scale.max, 100);
  assert.equal(typeof tool.runtime.valueMapper.valueToProgress, 'function');
  assert.equal(typeof tool.runtime.displayProgress, 'number');
  assert.ok(Array.isArray(tool.runtime.stateRanges));

  assert.ok(Array.isArray(tool.paint.colorStops.colors));
  assert.ok(Array.isArray(tool.paint.colorStopsMinMax.colors));
  assert.equal(typeof tool.paint.markerStyles.fill, 'string');
  assert.equal('stateGradient' in tool.paint, true);

  [
    'pathConfig',
    'pathDefinition',
    'pathGeometry',
    'scale',
    'valueMapper',
    'value',
    'displayProgress',
    'stateRanges',
    'stateGradient',
    'stateMarkerStyles',
  ].forEach((field) => {
    assert.equal(Object.hasOwn(tool, field), false, field);
  });
});

test('color-only light/dark/light changes retain semantic runtime identities', () => {
  const fixture = createHorseshoeFixture({
    id: 'palette-identity-gauge',
    entity_index: 0,
    xpos: 50,
    ypos: 50,
    path: { type: 'line', length: 80, angle: 0 },
    horseshoe_scale: { min: 0, max: 100 },
    state_map: {
      map: [{ state: 'active', value: 60, label: 'Active' }],
    },
    color_stops: {
      modes: {
        light: [
          { value: 0, color: '#1b5e20' },
          { value: 100, color: '#b71c1c' },
        ],
        dark: [
          { value: 0, color: '#80cbc4' },
          { value: 100, color: '#ff8a65' },
        ],
      },
    },
  });
  const [tool] = fixture.tools;
  const entity = { entity_id: 'sensor.main', state: 'active', attributes: {} };
  const entityConfig = fixture.cardConfig.entities[0];

  tool.updateRuntimeConfig();
  tool.setState(entity, entityConfig);
  const stateMap = tool.runtime.stateMap;
  const scale = tool.runtime.scale;
  const valueMapper = tool.runtime.valueMapper;
  const colors = [tool.paint.colorStops.colors[0].color];

  ['dark', 'light'].forEach((mode) => {
    fixture.setColorStopMode(mode);
    tool.updateRuntimeConfig();
    tool.setState(entity, entityConfig);
    colors.push(tool.paint.colorStops.colors[0].color);
    assert.equal(tool.runtime.stateMap, stateMap);
    assert.equal(tool.runtime.scale, scale);
    assert.equal(tool.runtime.valueMapper, valueMapper);
  });

  assert.notEqual(colors[0], colors[1]);
  assert.equal(colors[0], colors[2]);
});

test('rank threshold changes rebuild semantic state, scale, and value mapping', () => {
  const fixture = createHorseshoeFixture({
    id: 'rank-threshold-gauge',
    entity_index: 0,
    xpos: 50,
    ypos: 50,
    path: { type: 'line', length: 80, angle: 0 },
    horseshoe_scale: { min: 0, max: 20 },
    horseshoe_state: { mode: 'stringstate_mode' },
    state_map: {
      type: 'rank_state',
      map: [
        { state: 'low', rank: 0 },
        { state: 'medium', rank: 1 },
        { state: 'high', rank: 2 },
      ],
    },
    color_stops: '[[[ return { colors: [{ value: 0, rank: 0, color: "#1b5e20" }, { value: constants.rankThreshold, rank: 1, color: "#f9a825" }, { value: 20, rank: 2, color: "#b71c1c" }] }; ]]]',
  });
  const [tool] = fixture.tools;
  const entity = { entity_id: 'sensor.main', state: '15', attributes: {} };
  const entityConfig = fixture.cardConfig.entities[0];
  fixture.cardConfig.constants.rankThreshold = 10;

  tool.updateRuntimeConfig();
  tool.setState(entity, entityConfig);
  const stateMap = tool.runtime.stateMap;
  const scale = tool.runtime.scale;
  const valueMapper = tool.runtime.valueMapper;
  assert.equal(tool.runtime.mappedState.state, 'medium');

  fixture.cardConfig.constants.rankThreshold = 16;
  tool.updateRuntimeConfig();
  tool.setState(entity, entityConfig);

  assert.notEqual(tool.runtime.stateMap, stateMap);
  assert.notEqual(tool.runtime.scale, scale);
  assert.notEqual(tool.runtime.valueMapper, valueMapper);
  assert.equal(tool.runtime.mappedState.state, 'low');
  assert.equal(tool.runtime.value, 0.5);
});
