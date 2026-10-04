import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

// Exercise Main's actual orchestration without importing its browser/JSON bundle.
// Browser tests cover the real domains; these stubs count calls across Gate 1.
const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const parsed = ts.createSourceFile('main.js', source, ts.ScriptTarget.Latest, true);
const cardClass = parsed.statements.find((node) => ts.isClassDeclaration(node));
const methods = cardClass.members.filter((node) => ['setHass', 'updateSourceEntities'].includes(node.name?.getText(parsed)));
// eslint-disable-next-line no-new-func
const mainMethods = new Function(`return ({${methods.map((node) => node.getText(parsed)).join(',')}});`)();

/** Builds one already-initialized card with a declared source and counted owners. */
function makeCard({ dynamic = false, pending = false } = {}) {
  const entity = { entity_id: 'sensor.reading', state: '20.1', attributes: { value: 1 } };
  const entityConfig = { entity: 'sensor.reading' };
  const hass = { states: { 'sensor.reading': entity } };
  const calls = { templates: 0, ha: 0, children: 0, config: 0, groups: 0, tools: 0, presentation: 0, availability: 0 };
  const card = {
    ...mainMethods,
    _hass: hass,
    dev: { performance: false },
    config: { entities: [entityConfig] },
    entities: [entity],
    runtimeEntityConfigs: [entityConfig],
    entityConfigsInitialized: true,
    templates: { setHass() { calls.templates += 1; } },
    homeAssistant: { localeChanged: false, entityDisplayChanged: false, setHass() { calls.ha += 1; } },
    cardTheme: { updateHass: () => false },
    childCards: { setHass(value) { calls.children += 1; card.childHass = value; } },
    cardInputEntities: { stateChanged: false },
    cardEntities: {
      buildRuntimeEntityConfigs() { calls.config += 1; return [entityConfig]; },
      updateSparklineEntities: () => [],
    },
    cardLayout: { updateGroups() { calls.groups += 1; } },
    actions: { setHassAndEntities() {} },
    cardTools: {
      getRenderableTools: () => [{ hasJavascript: dynamic, requiresHassUpdate: () => pending }],
      hassAvailable() { calls.availability += 1; },
      updateSparklineRuntimeConfig() { calls.tools += 1; },
      setSparklineEntityStates() {},
      getBySection: () => [],
    },
    updateEntityPresentation() { calls.presentation += 1; },
  };
  return { card, calls, hass, entity };
}

for (const dynamic of [false, true]) {
  test(`irrelevant HA delivery skips FHS config/tools and still reaches children (JS=${dynamic})`, () => {
    const { card, calls, hass } = makeCard({ dynamic });
    const nextHass = { ...hass, states: { ...hass.states, 'sensor.noise': { state: 'changed' } } };
    card.setHass(nextHass);
    assert.deepEqual(calls, { templates: 1, ha: 1, children: 1, config: 0, groups: 0, tools: 0, presentation: 0, availability: 0 });
    assert.strictEqual(card.childHass, nextHass);
    assert.strictEqual(card._hass, nextHass);
  });
}

test('changed raw state and attributes both enter the normal route without formatted-string comparison', () => {
  for (const patch of [{ state: '20.4' }, { attributes: { value: 2 } }]) {
    const { card, calls, hass, entity } = makeCard();
    const nextEntity = { ...entity, ...patch };
    card.setHass({ ...hass, states: { ...hass.states, 'sensor.reading': nextEntity } });
    assert.strictEqual(card.entities[0], nextEntity);
    assert.equal(calls.config, 1);
    assert.equal(calls.tools, 1);
    assert.equal(calls.presentation, 1);
    assert.equal(card.evaluateJavascriptTemplates, true);
  }
});

test('theme, local-input and initial-delivery context remain relevant', () => {
  for (const kind of ['theme', 'local', 'initial']) {
    const { card, calls, hass } = makeCard();
    if (kind === 'theme') card.cardTheme.updateHass = () => true;
    if (kind === 'local') card.cardInputEntities.stateChanged = true;
    if (kind === 'initial') {
      card._hass = undefined;
      card.entityConfigsInitialized = false;
    }
    card.setHass(hass);
    assert.equal(calls.config, 1, kind);
    assert.equal(calls.tools, 1, kind);
    assert.equal(calls.presentation, 1, kind);
    assert.equal(calls.availability, kind === 'initial' ? 1 : 0, kind);
  }
});

test('retained owner work enters the runtime route without reevaluating unchanged source config', () => {
  const { card, calls, hass } = makeCard({ pending: true });
  card.setHass(hass);
  assert.equal(calls.config, 0);
  assert.equal(calls.tools, 1);
  assert.equal(calls.presentation, 1);
  assert.equal(card.evaluateJavascriptTemplates, false);
});
