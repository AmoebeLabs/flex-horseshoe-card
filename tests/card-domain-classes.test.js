import test from 'node:test';
import assert from 'node:assert/strict';
import HomeAssistant from '../src/home-assistant.js';
import CardActions from '../src/card-actions.js';
import CardInputEntities from '../src/card-input-entities.js';
import CardTheme from '../src/card-theme.js';
import CardConfig from '../src/card-config.js';
import CardEntities from '../src/card-entities.js';
import CardAnimations from '../src/card-animations.js';
import CardTools from '../src/card-tools.js';
import CardLayout from '../src/card-layout.js';
import Templates from '../src/templates.js';
import BaseTool from '../src/base-tool.js';
import ChildCards from '../src/child-cards.js';

class Connection {
  constructor() {
    this.listeners = new Set();
  }

  addEventListener(type, listener) {
    assert.equal(type, 'ready');
    this.listeners.add(listener);
  }

  removeEventListener(type, listener) {
    assert.equal(type, 'ready');
    this.listeners.delete(listener);
  }

  becomeReady() {
    this.listeners.forEach((listener) => listener());
  }
}

test('HomeAssistant owns exactly one ready listener across connection changes', () => {
  let connectedCalls = 0;
  const firstConnection = new Connection();
  const secondConnection = new Connection();
  const homeAssistant = new HomeAssistant(() => {
    connectedCalls += 1;
  });

  homeAssistant.setHass({ connection: firstConnection });
  assert.equal(firstConnection.listeners.size, 0);

  homeAssistant.connected();
  assert.equal(firstConnection.listeners.size, 1);
  firstConnection.becomeReady();
  assert.equal(connectedCalls, 1);

  homeAssistant.setHass({ connection: secondConnection });
  assert.equal(firstConnection.listeners.size, 0);
  assert.equal(secondConnection.listeners.size, 1);

  homeAssistant.disconnected();
  assert.equal(secondConnection.listeners.size, 0);
});

test('CardActions preserves item, entity, card and default tap precedence', () => {
  const actions = new CardActions(new EventTarget(), {});
  const entityTap = { action: 'toggle' };
  const cardTap = { action: 'navigate', navigation_path: '/test' };
  actions.setConfig({ tap_action: cardTap });
  actions.setHassAndEntities({}, [{ tap_action: entityTap }, {}], [{ entity_id: 'light.first' }, { entity_id: 'sensor.second' }]);

  const itemTap = { action: 'more-info' };
  assert.equal(actions.getGestureConfig({ tap_action: itemTap }, 0, 'tap_action'), itemTap);
  assert.equal(actions.getGestureConfig({}, 0, 'tap_action'), entityTap);
  assert.equal(actions.getGestureConfig({}, 1, 'tap_action'), cardTap);

  actions.setConfig({});
  assert.deepEqual(actions.getGestureConfig({}, 1, 'tap_action'), { action: 'more-info' });
});

test('CardActions routes derived sparkline actions to the source entity', () => {
  const actions = new CardActions(new EventTarget(), {});
  actions.setConfig({});
  actions.setHassAndEntities({}, [{}, { source_entity_index: 0 }], [{ entity_id: 'sensor.source' }, { entity_id: 'fhs_sparkline.graph_avg' }]);

  assert.equal(actions.getActionEntityId(1, {}), 'sensor.source');
  assert.equal(actions.getActionEntityId(1, { entity: 'sensor.override' }), 'sensor.override');
});

test('CardInputEntities validates, initializes and updates card-scoped numbers', () => {
  const entities = [];
  let updateCalls = 0;
  const inputs = new CardInputEntities('test-card', entities, () => {
    updateCalls += 1;
  });
  const config = {
    dev: { debug: false },
    entities: [{ entity: 'fhs_input_number.level', initial: 4, min: 0, max: 10, step: 2, unit: '' }],
  };

  inputs.validateConfig(config);
  inputs.initializeEntities(config.entities);
  assert.equal(entities[0].state, '4');

  inputs.changeNumberValue('fhs_input_number.level', 1);
  assert.equal(entities[0].state, '6');
  assert.equal(inputs.stateChanged, true);
  assert.equal(updateCalls, 1);

  inputs.markStateHandled();
  assert.equal(inputs.stateChanged, false);
});

test('CardTheme reports mode changes and invalidates color-dependent rendering', () => {
  let gradientUpdates = 0;
  let clearedPaths = 0;
  const cardTheme = new CardTheme(
    { style: { setProperty: () => {} } },
    () => {
      gradientUpdates += 1;
    },
    () => {},
  );
  cardTheme.setHorseshoes([{ clearPathItemCache: () => { clearedPaths += 1; } }]);

  assert.equal(cardTheme.updateHass({ selectedTheme: 'default', themes: { theme: 'default', darkMode: false } }), true);
  assert.equal(cardTheme.getActiveColorStopMode(), 'light');
  assert.equal(cardTheme.updateHass({ selectedTheme: 'default', themes: { theme: 'default', darkMode: false } }), false);
  assert.equal(cardTheme.updateHass({ selectedTheme: 'default', themes: { theme: 'default', darkMode: true } }), true);
  assert.equal(cardTheme.getActiveColorStopMode(), 'dark');
  assert.equal(gradientUpdates, 2);
  assert.equal(clearedPaths, 2);

  cardTheme.markModeHandled();
  assert.equal(cardTheme.modeChanged, false);
});

test('CardConfig compiles named entity addresses to final flat indexes', () => {
  const cardConfig = new CardConfig({ hasJavascriptTemplates: () => false });
  const entities = [
    { entity: 'sensor.first', slot: 'rooms' },
    { entity: 'sensor.second' },
    { entity: 'sensor.third', slot: 'history' },
  ];
  const config = {
    layout: {
      controls: [
        { entity_index: 'rooms[1]' },
        { entity_index: 'history[0]' },
      ],
    },
  };

  const slots = cardConfig.buildEntitySlots(entities);
  cardConfig.normalizeEntityIndexAddresses(config);
  cardConfig.flattenEntitySlotIndexes(config, slots);

  assert.deepEqual(slots, { flat: [0, 1, 2], default: [], rooms: [0, 1], history: [2] });
  assert.deepEqual(config.layout.controls.map((control) => control.entity_index), [1, 2]);
});

test('CardConfig initializes developer flags for cards without a dev section', () => {
  const cardConfig = new CardConfig({});
  const config = {};

  cardConfig.initializeDeveloperConfig(config);

  assert.deepEqual(config.dev, {
    debug: false,
    performance: false,
  });
});

test('CardConfig rejects unknown slots and invalid action names at configuration time', () => {
  const cardConfig = new CardConfig({ hasJavascriptTemplates: () => false });
  const invalidSlotConfig = { layout: { controls: [{ entity_index: 'missing[0]' }] } };
  cardConfig.normalizeEntityIndexAddresses(invalidSlotConfig);

  assert.throws(
    () => cardConfig.flattenEntitySlotIndexes(invalidSlotConfig, { flat: [], default: [] }),
    /Unknown entity slot missing/,
  );
  assert.throws(
    () => cardConfig.validateActionConfigs({ tap_action: { action: 'more-infos' } }),
    /Invalid action 'more-infos'/,
  );
  assert.throws(
    () => cardConfig.validateActionConfigs({ double_tap: { action: 'more-info' } }),
    /use 'double_tap_action'/,
  );
});

test('CardConfig assigns stable ids throughout visible layout sections', () => {
  const cardConfig = new CardConfig({ hasJavascriptTemplates: () => false });
  const config = {
    layout: {
      groups: [{}, { id: 'named' }],
      controls: [{}, { id: 'control' }],
      compounds: [{ lines: [{}, { id: 'line' }] }],
      masks: { mask: { circles: [{}] } },
      clips: {},
    },
  };

  cardConfig.assignLayoutItemIds(config);

  assert.deepEqual(config.layout.groups.map((item) => item.id), ['0', 'named']);
  assert.deepEqual(config.layout.controls.map((item) => item.id), ['0', 'control']);
  assert.deepEqual(config.layout.compounds[0].lines.map((item) => item.id), ['0', 'line']);
  assert.equal(config.layout.masks.mask.circles[0].id, '0');
});

test('CardConfig expands calculated constants and independent deep refs', () => {
  const cardConfig = new CardConfig({ hasJavascriptTemplates: () => false });
  const config = {
    constants: {
      spacing: 4,
      width: 'calc(spacing * 2)',
      visual: { width: 'calc(spacing + 1)', styles: { fill: 'red' } },
    },
    layout: {
      controls: [
        { width: 'calc(width + 2)', visual: 'ref(visual)' },
        { visual: 'ref(visual)' },
      ],
    },
  };

  cardConfig.compileStaticValues(config);

  assert.equal(config.constants.width, 8);
  assert.equal(config.layout.controls[0].width, 10);
  assert.equal(config.layout.controls[0].visual.width, 5);
  assert.notEqual(config.layout.controls[0].visual, config.layout.controls[1].visual);
  config.layout.controls[0].visual.styles.fill = 'blue';
  assert.equal(config.layout.controls[1].visual.styles.fill, 'red');
  assert.throws(() => cardConfig.compileStaticValues({ value: 'ref(missing)' }), /Static ref 'missing' not found/);
});

test('CardConfig resolves direct entity ids and named animation slots', () => {
  const cardConfig = new CardConfig({ hasJavascriptTemplates: () => false });
  const config = {
    layout: { controls: [{ entity: 'sensor.second' }] },
    animations: { 'entity.rooms[0]': [{ state: 'on' }] },
  };
  const entities = [{ entity: 'sensor.first' }, { entity: 'sensor.second' }];

  cardConfig.resolveLayoutEntityIndexes(config, entities, { flat: [0, 1], rooms: [1] });

  assert.equal(config.layout.controls[0].entity_index, 1);
  assert.deepEqual(config.animations, { 'entity.1': [{ state: 'on' }] });
});

test('CardEntities links derived sparkline configs to their source entity', () => {
  const cardEntities = new CardEntities(
    { hasJavascriptTemplates: () => false },
    { getActiveColorStopMode: () => 'light' },
  );
  const config = {
    dev: { debug: false },
    entities: [
      { entity: 'sensor.temperature', attribute: 'value', decimals: 2 },
      { entity: 'fhs_sparkline.history_avg' },
    ],
    layout: { sparklines: [{ id: 'history', entity_index: 0 }] },
  };

  const resolved = cardEntities.buildRuntimeEntityConfigs(config, false);

  assert.equal(resolved[1].local, true);
  assert.equal(resolved[1].source_entity_index, 0);
  assert.equal(resolved[1].sparkline_id, 'history');
  assert.equal(resolved[1].sparkline_entity_type, 'avg');
  assert.equal(resolved[1].attribute, undefined);
});

test('CardEntities retains configured decimals in derived sparkline averages', () => {
  const cardEntities = new CardEntities({}, {});
  const resolvedConfigs = [
    { entity: 'sensor.temperature', decimals: 2 },
    {
      entity: 'fhs_sparkline.history_avg',
      local: true,
      source_entity_index: 0,
      sparkline_id: 'history',
      sparkline_entity_type: 'avg',
    },
  ];
  const entities = [{
    entity_id: 'sensor.temperature',
    state: '10.20',
    attributes: { unit_of_measurement: 'C', device_class: 'temperature' },
  }];
  const graph = { config: { id: 'history' }, stats: { avg: 10.2 } };

  cardEntities.updateSparklineEntities(resolvedConfigs, entities, [graph]);

  assert.equal(entities[1].state, '10.20');
  assert.equal(entities[1].attributes.source_entity_id, 'sensor.temperature');
});

test('CardAnimations matches entity state and preserves reused styles and icons', () => {
  const animations = new CardAnimations();
  const config = {
    animations: {
      'entity.0': [{
        state: 'on',
        lines: [
          { animation_id: 'status', styles: { stroke: 'red' } },
          { animation_id: 'status', reuse: true, styles: { opacity: 0.5 } },
        ],
        icons: [{ animation_id: 'main', icon: 'mdi:lightbulb', styles: { fill: 'yellow' } }],
      }],
    },
  };
  const templates = { hasJavascriptTemplates: () => false };

  animations.update(config, [{ state: 'on' }], templates, true);

  assert.deepEqual(animations.styles.lines.status, { stroke: 'red', opacity: '0.5' });
  assert.deepEqual(animations.styles.icons.main, { fill: 'yellow' });
  assert.equal(animations.styles.iconsIcon.main, 'mdi:lightbulb');
});

test('CardTools preserves section render order and separates sparkline runtime updates', () => {
  const cardTools = new CardTools({}, {}, 'card');
  const calls = [];
  const rectangle = { updateRuntimeConfig: () => calls.push('rectangle') };
  const horseshoe = { updateRuntimeConfig: () => calls.push('horseshoe') };
  const sparkline = { updateRuntimeConfig: () => calls.push('sparkline') };

  cardTools.sections.rectangles = [rectangle];
  cardTools.sections.horseshoes = [horseshoe];
  cardTools.sections.sparklines = [sparkline];

  assert.deepEqual(cardTools.getRenderableTools(), [rectangle, horseshoe, sparkline]);
  cardTools.updateSparklineRuntimeConfig();
  cardTools.updateRuntimeConfig();
  assert.deepEqual(calls, ['sparkline', 'horseshoe', 'rectangle']);
});

test('CardTools sorts renderables by z-position and stable render index', () => {
  const cardTools = new CardTools({}, {}, 'card');
  const late = { id: 'late', zpos: 10, renderIndex: 2 };
  const second = { id: 'second', zpos: 5, renderIndex: 2 };
  const first = { id: 'first', zpos: 5, renderIndex: 1 };
  cardTools.sections.rectangles = [late, second, first];

  assert.deepEqual(cardTools.getSortedRenderableTools().map((tool) => tool.id), ['first', 'second', 'late']);
});

test('CardTools measures referenced tool dimensions and geometry', () => {
  const cardTools = new CardTools({}, {}, 'card');
  cardTools.sections.texts = [{
    id: 'label',
    getXpos: () => 20,
    getYpos: () => 30,
    getWidth: () => 40,
    getHeight: () => 10,
  }];
  const reference = { section: 'texts', item_id: 'label', padding: 2 };

  assert.equal(cardTools.getItemWidth(reference), 44);
  assert.equal(cardTools.getItemHeight(reference), 14);
  assert.deepEqual(cardTools.getItemGeometry(reference), { xpos: 20, ypos: 30, width: 40, height: 10 });
});

test('CardEntities uses configured attributes as color-stop values', () => {
  const cardEntities = new CardEntities({}, {});
  const colorStops = {
    colors: [
      { value: 0, color: 'blue' },
      { value: 20, color: 'green' },
      { value: 40, color: 'red' },
    ],
  };
  const item = { entity_index: 0, show: { item_style: 'colorstop' } };
  const config = { entities: [{ attribute: 'temperature' }] };
  const entities = [{ state: '0', attributes: { temperature: 25 } }];

  assert.equal(cardEntities.getItemColorFromStops(item, colorStops, config, entities), 'green');
});

test('CardTools assigns entity state and forwards every shared lifecycle phase', () => {
  const cardTools = new CardTools({}, {}, 'card');
  const calls = [];
  const tool = {
    entity_index: 0,
    setState: (entity, config) => calls.push(['state', entity.state, config.entity]),
    hassAvailable: () => calls.push('hassAvailable'),
    hassConnected: () => calls.push('hassConnected'),
    connected: () => calls.push('connected'),
    disconnected: () => calls.push('disconnected'),
    firstUpdated: () => calls.push('firstUpdated'),
    updated: () => calls.push('updated'),
  };
  cardTools.sections.rectangles = [tool];

  cardTools.setRuntimeEntityStates([{ entity: 'sensor.temperature' }], [{ state: '21.0' }]);
  cardTools.hassAvailable();
  cardTools.hassConnected();
  cardTools.connected();
  cardTools.disconnected();
  cardTools.firstUpdated(new Map());
  cardTools.updated(new Map());

  assert.deepEqual(calls, [
    ['state', '21.0', 'sensor.temperature'],
    'hassAvailable', 'hassConnected', 'connected', 'disconnected', 'firstUpdated', 'updated',
  ]);
});

test('CardTools assigns entity state to nested control tools through the same lifecycle path', () => {
  const cardTools = new CardTools({}, {}, 'card');
  const calls = [];
  const childTool = {
    entity_index: 1,
    setState: (entity, config) => calls.push([entity.state, config.entity]),
  };

  cardTools.setToolEntityState(
    childTool,
    [{ entity: 'sensor.first' }, { entity: 'sensor.second' }],
    [{ state: '10' }, { state: '20' }],
  );

  assert.deepEqual(calls, [['20', 'sensor.second']]);
});

test('CardTools restores card template context after asynchronous sparkline statistics', () => {
  const calls = [];
  const templates = {
    setContext: (context) => calls.push(['context', context]),
  };
  const card = {
    _hass: { states: {} },
    config: { entities: [{ entity: 'fhs_sparkline.graph_avg' }] },
    entities: [{ state: '15' }],
    horseshoes: [],
    entitySlots: { graph: [0] },
    resolvedEntityConfigs: [{ entity: 'fhs_sparkline.graph_avg' }],
    evaluateJavascriptTemplates: false,
  };
  const cardTools = new CardTools(card, templates, 'card');
  cardTools.sections.states = [{
    entity_index: 0,
    updateRuntimeConfig: () => calls.push('runtime'),
    setState: (entity, config) => calls.push(['state', entity.state, config.entity]),
  }];

  cardTools.updateAfterSparklineStatistics();

  assert.deepEqual(calls, [
    ['context', {
      hass: card._hass,
      config: card.config,
      entities: card.entities,
      horseshoes: card.horseshoes,
      entity_slots: card.entitySlots,
    }],
    'runtime',
    ['state', '15', 'fhs_sparkline.graph_avg'],
  ]);
  assert.equal(card.evaluateJavascriptTemplates, false);
});

test('BaseTool reads theme changes from CardTheme during runtime config updates', () => {
  const templates = { hasJavascriptTemplates: () => false };
  const card = {
    cardLayout: { changedGroupIds: new Set() },
    cardTheme: { modeChanged: true },
    evaluateJavascriptTemplates: false,
  };
  const tool = new BaseTool(
    { id: 'status', group: 'card', zpos: 0, dzpos: 0 },
    0,
    templates,
    'card',
    card,
    'lines',
  );
  tool.activeConfigInitialized = true;
  tool.configChanged = false;

  tool.updateRuntimeConfig();

  assert.equal(tool.configChanged, true);
});

test('CardLayout owns aspect ratio and group-based SVG coordinates', () => {
  const templates = { hasJavascriptTemplates: () => false };
  const cardLayout = new CardLayout(templates, 'card');
  const config = {
    layout: {
      aspectratio: '1/2',
      groups: [{ id: 'room', xpos: 60, ypos: 40 }],
      icons: [{ id: 'status', group: 'room', xpos: 50, ypos: 55 }],
    },
  };

  cardLayout.setConfig(config);

  assert.deepEqual(cardLayout.viewBox, { width: 200, height: 400 });
  assert.deepEqual(config.layout.icons[0].svg, { xpos: 120, ypos: 90 });
});

test('CardLayout marks descendants when a dynamic parent group changes', () => {
  const templates = {
    hasJavascriptTemplates: (group) => group.dynamic === true,
    getJsTemplateOrValue: (group) => ({ ...group, xpos: 65 }),
  };
  const cardLayout = new CardLayout(templates, 'card');
  const config = {
    layout: {
      groups: [
        { id: 'parent', xpos: 50, ypos: 50, dynamic: true },
        { id: 'child', parent: 'parent', xpos: 50, ypos: 50 },
      ],
    },
  };

  cardLayout.setConfig(config);
  cardLayout.updateGroups(true);

  assert.deepEqual([...cardLayout.changedGroupIds].sort(), ['child', 'parent']);
  assert.equal(cardLayout.groupManager.getGroup('child').xpos, 65);
  cardLayout.markGroupsHandled();
  assert.equal(cardLayout.changedGroupIds.size, 0);
});

test('ChildCards renders against the CardLayout aspect ratio', () => {
  const childCards = new ChildCards({
    cardLayout: { aspectratio: '1/2' },
  });

  assert.doesNotThrow(() => childCards.render());
});

test('Templates keeps JavaScript context independent for simultaneous cards', () => {
  const firstCardTemplates = new Templates();
  const secondCardTemplates = new Templates();
  const javascript = '[[[ return `${constants.card}:${state}:${user.name}`; ]]]';

  firstCardTemplates.setContext({
    hass: { user: { name: 'Alice' }, states: {} },
    config: { constants: { card: 'first' }, entities: [{ entity: 'sensor.first' }] },
    entities: [{ state: '10', attributes: {} }],
    entity_slots: {},
  });
  secondCardTemplates.setContext({
    hass: { user: { name: 'Bob' }, states: {} },
    config: { constants: { card: 'second' }, entities: [{ entity: 'sensor.second' }] },
    entities: [{ state: '20', attributes: {} }],
    entity_slots: {},
  });

  assert.equal(firstCardTemplates.getJsTemplateOrValue({ entity_index: 0 }, javascript), 'first:10:Alice');
  assert.equal(secondCardTemplates.getJsTemplateOrValue({ entity_index: 0 }, javascript), 'second:20:Bob');
  assert.equal(firstCardTemplates.getJsTemplateOrValue({ entity_index: 0 }, javascript), 'first:10:Alice');
});
