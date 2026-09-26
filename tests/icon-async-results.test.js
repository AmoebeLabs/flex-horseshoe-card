import assert from 'node:assert/strict';
import test from 'node:test';
import IconTool from '../src/icon-tool.js';
import { getComponentIcons, getPlatformIcons } from '../src/frontend_mods/data/icons.ts';

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

function nextTurn() {
  return new Promise((resolve) => setImmediate(resolve));
}

function iconResponse(integration, state, icon) {
  return {
    resources: {
      [integration]: {
        sensor: {
          test_translation: { state: { [state]: icon } },
        },
      },
    },
  };
}

function createIconContext(connection, entitySources) {
  const entities = {};
  const components = new Set();
  entitySources.forEach(({ entityId, integration }) => {
    entities[entityId] = { entity_id: entityId, platform: integration, translation_key: 'test_translation' };
    components.add(integration);
  });

  const card = {
    _hass: {
      entities,
      config: { components: [...components] },
      connection,
    },
    cardLayout: { calculateSvgCoordinatesInGroup: () => ({ xpos: 50, ypos: 50 }) },
    cardAnimations: { styles: { iconsIcon: {} } },
    entitiesIconKey: {},
    entitiesIcon: {},
    entitiesIconPending: new Map(),
    updates: 0,
    requestUpdate() { this.updates += 1; },
  };

  const createTool = (entityId, state) => {
    const tool = new IconTool(
      { id: entityId, xpos: 50, ypos: 50, width: 10, height: 10 },
      0,
      { hasJavascriptTemplates: () => false },
      'async-icon-test',
      card,
    );
    tool.entity = {
      entity_id: entityId,
      state,
      attributes: { device_class: 'measurement', icon: undefined },
    };
    tool.entityConfig = { entity: entityId, attribute: undefined };
    return tool;
  };

  return { card, createTool };
}

test('IconTool keeps the current source and shares one in-flight HA formatter lookup', async () => {
  const integrations = ['fhs_icon_source_a_705', 'fhs_icon_source_b_705'];
  const sources = [
    { entityId: 'sensor.async_icon_a', integration: integrations[0] },
    { entityId: 'sensor.async_icon_b', integration: integrations[1] },
  ];
  const requests = new Map();
  const messages = [];
  const connection = {
    haVersion: '2026.9.0',
    sendMessagePromise(message) {
      messages.push(message);
      const request = deferred();
      requests.set(message.integration, request);
      return request.promise;
    },
  };
  const { card, createTool } = createIconContext(connection, sources);
  const first = createTool(sources[0].entityId, 'ready');
  const shared = createTool(sources[0].entityId, 'ready');

  first.buildIcon(undefined);
  shared.buildIcon(undefined);
  assert.equal(messages.length, 1);
  assert.equal(messages[0].category, 'entity');

  first.entity = { ...first.entity, entity_id: sources[1].entityId };
  first.entityConfig = { entity: sources[1].entityId, attribute: undefined };
  first.buildIcon(undefined);
  shared.entity = { ...shared.entity, entity_id: sources[1].entityId };
  shared.entityConfig = { entity: sources[1].entityId, attribute: undefined };
  shared.buildIcon(undefined);
  assert.equal(messages.length, 2);

  requests.get(integrations[1]).resolve(iconResponse(integrations[1], 'ready', 'mdi:current-source'));
  await nextTurn();
  requests.get(integrations[0]).resolve(iconResponse(integrations[0], 'ready', 'mdi:obsolete-source'));
  await nextTurn();

  const currentKey = sources[1].entityId + '|state';
  const obsoleteKey = sources[0].entityId + '|state';
  assert.equal(first.buildIcon(undefined), 'mdi:current-source');
  assert.equal(shared.buildIcon(undefined), 'mdi:current-source');
  assert.equal(card.entitiesIcon[currentKey], 'mdi:current-source');
  assert.equal(card.entitiesIcon[obsoleteKey], undefined);
  assert.equal(card.updates, 1);
});

test('IconTool ignores a stale formatter rejection and retries through the real HA formatter module', async () => {
  const integration = 'fhs_icon_retry_705';
  const entityId = 'sensor.async_icon_retry';
  const requests = [];
  const messages = [];
  const connection = {
    haVersion: '2026.9.0',
    sendMessagePromise(message) {
      messages.push(message);
      const request = deferred();
      requests.push(request);
      return request.promise;
    },
  };
  const { card, createTool } = createIconContext(connection, [{ entityId, integration }]);
  const tool = createTool(entityId, 'before');
  const originalConsoleError = console.error;
  const errors = [];
  console.error = (...args) => errors.push(args);

  try {
    tool.buildIcon(undefined);
    assert.equal(messages.length, 1);

    // The entity value changes while HA is still resolving the old formatter request.
    tool.entity.state = 'after';
    requests[0].reject(new Error('temporary websocket failure'));
    await nextTurn();
    assert.equal(errors.length, 0);
    assert.equal(card.entitiesIconPending.size, 0);

    tool.buildIcon(undefined);
    assert.equal(messages.length, 2);
    requests[1].resolve(iconResponse(integration, 'after', 'mdi:recovered'));
    await nextTurn();

    assert.equal(tool.buildIcon(undefined), 'mdi:recovered');
    assert.equal(card.entitiesIcon[entityId + '|state'], 'mdi:recovered');
    assert.equal(card.updates, 1);
  } finally {
    console.error = originalConsoleError;
  }
});

test('getComponentIcons retries a failed catalogue and protects a forced replacement', async () => {
  const domain = 'fhs_component_async_705';
  const requests = [];
  const connection = {
    haVersion: '2026.9.0',
    sendMessagePromise(message) {
      assert.equal(message.category, 'entity_component');
      const request = deferred();
      requests.push(request);
      return request.promise;
    },
  };
  const hassConfig = { components: [domain] };

  const failed = getComponentIcons(connection, hassConfig, domain);
  assert.equal(requests.length, 1);
  requests[0].reject(new Error('component catalogue offline'));
  await assert.rejects(failed, /component catalogue offline/);

  const retry = getComponentIcons(connection, hassConfig, domain);
  assert.equal(requests.length, 2);
  const recoveredCatalogue = { _: { default: 'mdi:recovered-component' } };
  requests[1].resolve({ resources: { [domain]: recoveredCatalogue } });
  assert.strictEqual(await retry, recoveredCatalogue);

  const oldForced = getComponentIcons(connection, hassConfig, domain, true);
  const currentForced = getComponentIcons(connection, hassConfig, domain, true);
  assert.equal(requests.length, 4);
  requests[2].reject(new Error('obsolete forced component catalogue'));
  await assert.rejects(oldForced, /obsolete forced component catalogue/);

  const currentFromCache = getComponentIcons(connection, hassConfig, domain);
  assert.equal(requests.length, 4);
  const currentCatalogue = { _: { default: 'mdi:current-component' } };
  requests[3].resolve({ resources: { [domain]: currentCatalogue } });
  assert.strictEqual(await currentForced, currentCatalogue);
  assert.strictEqual(await currentFromCache, currentCatalogue);
});

test('getPlatformIcons keeps a newer forced request after an older rejection', async () => {
  const integration = 'fhs_platform_cache_705';
  const requests = [];
  const connection = {
    haVersion: '2026.9.0',
    sendMessagePromise(message) {
      assert.equal(message.category, 'entity');
      assert.equal(message.integration, integration);
      const request = deferred();
      requests.push(request);
      return request.promise;
    },
  };
  const hassConfig = { components: [integration] };

  const oldForced = getPlatformIcons(hassConfig, connection, integration, true);
  const currentForced = getPlatformIcons(hassConfig, connection, integration, true);
  assert.equal(requests.length, 2);
  requests[0].reject(new Error('obsolete forced platform catalogue'));
  await assert.rejects(oldForced, /obsolete forced platform catalogue/);

  const currentFromCache = getPlatformIcons(hassConfig, connection, integration);
  assert.equal(requests.length, 2);
  const currentCatalogue = { sensor: { test_translation: { state: { ready: 'mdi:current-platform' } } } };
  requests[1].resolve({ resources: { [integration]: currentCatalogue } });
  assert.strictEqual(await currentForced, currentCatalogue);
  assert.strictEqual(await currentFromCache, currentCatalogue);
});
