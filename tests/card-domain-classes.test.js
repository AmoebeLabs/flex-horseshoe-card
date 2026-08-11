import test from 'node:test';
import assert from 'node:assert/strict';
import HomeAssistant from '../src/home-assistant.js';
import CardActions from '../src/card-actions.js';
import CardInputEntities from '../src/card-input-entities.js';
import CardTheme from '../src/card-theme.js';

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
