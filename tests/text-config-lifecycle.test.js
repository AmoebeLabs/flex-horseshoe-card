import assert from 'node:assert/strict';
import test from 'node:test';
import TextTool from '../src/text-tool.js';
import Templates from '../src/templates.js';

function createHarness(evaluate) {
  const calls = [];
  const events = [];
  const entities = Array.from({ length: 4 }, (_value, index) => ({
    state: index === 0 ? 'on' : `state-${index}`,
    attributes: { friendly_name: `friendly-${index}` },
  }));
  const resolvedEntityConfigs = entities.map((_entity, index) => ({ name: `entity-${index}` }));
  const localizations = [];
  const card = {
    cardLayout: {
      changedGroupIds: new Set(),
      calculateSvgCoordinatesInGroup: (item) => ({ xpos: item.xpos, ypos: item.ypos }),
      getGroupScaleTransform: () => '',
      getGroupScaleStyle: () => '',
    },
    cardTheme: {
      modeChanged: false,
      getActiveColorStopMode: () => 'fixed',
    },
    cardAnimations: { styles: { texts: {}, names: {}, areas: {}, states: {} } },
    cardTools: {
      sections: { names: [], areas: [], states: [] },
      getBySection(section) { return this.sections[section]; },
    },
    config: {},
    entities,
    resolvedEntityConfigs,
    evaluateJavascriptTemplates: true,
    _hass: {
      localize(key) {
        localizations.push(key);
        return `localized:${key}`;
      },
      formatEntityName: (entity) => entity.attributes.friendly_name,
    },
    requestUpdate() {},
  };
  const templates = {
    hasJavascriptTemplates: Templates.hasJavascriptTemplates,
    getJsTemplateOrValue(item, value) {
      const call = { item: structuredClone(item), value: structuredClone(value) };
      calls.push(call);
      events.push(call);
      return evaluate(item, structuredClone(value));
    },
  };

  return { card, templates, calls, events, localizations };
}

test('TextTool normalizes and displays literal scalar and multipart text', () => {
  const harness = createHarness((_item, value) => value);
  const scalar = new TextTool({ id: 'scalar', xpos: 50, ypos: 50, text: 'literal' }, 0,
    harness.templates, 'card', harness.card);

  scalar.updateRuntimeConfig();
  scalar.setState(undefined, undefined);

  assert.deepEqual(scalar.runtime.textParts.map(({ type, value }) => ({ type, value })), [
    { type: 'text', value: 'literal' },
  ]);
  assert.deepEqual(scalar.sourceConfig.text, [{ type: 'text', value: 'literal' }]);
  assert.deepEqual(scalar.config.text.map(({ value }) => value), ['literal']);
  assert.notStrictEqual(scalar.config.text, scalar.sourceConfig.text);
  assert.equal(Object.hasOwn(scalar, 'sourceTextParts'), false);
  assert.equal(Object.hasOwn(scalar, 'activeTextParts'), false);
  assert.equal(Object.hasOwn(scalar, 'activeTextPartsSignature'), false);
  assert.equal(Object.hasOwn(scalar, 'textParts'), false);
  assert.equal(typeof scalar.textConfigSignature, 'string');
  assert.ok(Array.isArray(scalar.runtime.widthMeasurementParts));
  assert.ok(Array.isArray(scalar.runtime.widthOverflowParts));
  assert.ok(scalar.geometry.svg);
  assert.equal(Object.hasOwn(scalar.config, 'svg'), false);
  [
    'textFitScale',
    'characterWidthFactor',
    'textFontSize',
    'estimatedWidth',
    'estimatedHeight',
    'measuredWidth',
    'measuredHeight',
    'measuredXpos',
    'measuredYpos',
    'hasExactMeasurement',
    'textMeasurementSignature',
    'widthOverflowSourceSignature',
    'widthOverflowMeasurementSignature',
  ].forEach((field) => assert.equal(Object.hasOwn(scalar.geometry, field), true, `geometry.${field}`));

  const multipart = new TextTool({
    id: 'multipart',
    xpos: 50,
    ypos: 50,
    text: [{ value: 'first' }, { value: 'second', new_line: true }],
  }, 1, harness.templates, 'card', harness.card);

  multipart.updateRuntimeConfig();
  multipart.setState(undefined, undefined);

  assert.deepEqual(multipart.runtime.textParts.map(({ type, value, new_line, dy }) => ({
    type, value, new_line, dy,
  })), [
    { type: 'text', value: 'first', new_line: undefined, dy: undefined },
    { type: 'text', value: 'second', new_line: true, dy: 1.2 },
  ]);
});

test('complete Text source has current JavaScript metadata without changing outer scheduling', () => {
  const harness = createHarness((_item, value) => ({ ...value, value: 'evaluated-part' }));
  const tool = new TextTool({
    id: 'part-only-metadata',
    xpos: 50,
    ypos: 50,
    text: [{ value: '[[[ part_value ]]]' }],
  }, 0, harness.templates, 'card', harness.card);

  // The complete source includes part JavaScript, while BaseTool schedules only outer fields.
  assert.equal(tool.hasJavascript, false);
  assert.equal(tool.textPartsHaveJavascript, true);
  assert.equal(harness.templates.hasJavascriptTemplates(tool.sourceConfig), true);
  assert.equal(harness.templates.hasJavascriptTemplates(tool.sourceConfig), true);

  tool.updateRuntimeConfig();
  assert.equal(harness.calls.length, 1);
  assert.equal(harness.calls[0].value.type, 'text');
  assert.equal(tool.config.text[0].value, 'evaluated-part');
  assert.equal(tool.hasJavascript, false);
});

test('outer and part JavaScript use separate exact calls and item contexts', () => {
  const scenarios = [
    {
      id: 'outer-only',
      xpos: '[[[ outer_x ]]]',
      text: 'literal',
      expected: [['outer', 'outer-only', 0]],
    },
    {
      id: 'part-only',
      xpos: 50,
      text: [{ id: 'part-context', entity_index: 1, value: '[[[ part_value ]]]' }],
      expected: [['part', 'part-context', 1]],
    },
    {
      id: 'combined',
      xpos: '[[[ outer_x ]]]',
      text: [{ id: 'part-context', entity_index: 1, value: '[[[ part_value ]]]' }],
      expected: [['outer', 'combined', 0], ['part', 'part-context', 1]],
    },
  ];

  scenarios.forEach((scenario) => {
    const harness = createHarness((item, value) => {
      const evaluated = structuredClone(value);
      if (Object.hasOwn(evaluated, 'type')) evaluated.value = `part:${item.id}:${item.entity_index}`;
      if (evaluated.xpos === '[[[ outer_x ]]]') evaluated.xpos = 24;
      return evaluated;
    });
    const tool = new TextTool({
      id: scenario.id,
      entity_index: 0,
      xpos: scenario.xpos,
      ypos: 50,
      text: scenario.text,
    }, 0, harness.templates, 'card', harness.card);

    tool.updateRuntimeConfig();
    tool.setState(harness.card.entities[0], harness.card.resolvedEntityConfigs[0]);

    assert.deepEqual(harness.calls.map(({ item, value }) => [
      Object.hasOwn(value, 'type') ? 'part' : 'outer', item.id, item.entity_index,
    ]), scenario.expected);

    const outerCall = harness.calls.find(({ item, value }) => item.id === scenario.id
      && !Object.hasOwn(value, 'type'));
    if (outerCall) {
      assert.equal(Object.hasOwn(outerCall.item, 'text'), false);
      assert.equal(Object.hasOwn(outerCall.value, 'text'), false);
    }
  });
});

test('inline source config precedes part evaluation and uses each evaluated entity binding', () => {
  let nextEntityIndex = 2;
  const harness = createHarness((item, value) => {
    const replace = (candidate) => {
      if (Array.isArray(candidate)) return candidate.map(replace);
      if (candidate && typeof candidate === 'object') {
        return Object.fromEntries(Object.entries(candidate).map(([key, entry]) => [key, replace(entry)]));
      }
      if (candidate === '[[[ outer_x ]]]') return 25;
      if (candidate === '[[[ source_x ]]]') return 40;
      if (candidate === '[[[ part_value ]]]') return `part-at-${item.entity_index}`;
      return candidate;
    };
    const evaluated = replace(value);
    if (item.id === 'inline-text' && evaluated.type === 'name') {
      evaluated.entity_index = nextEntityIndex;
    }
    return evaluated;
  });
  const tool = new TextTool({
    id: 'inline-text',
    entity_index: 0,
    xpos: '[[[ outer_x ]]]',
    ypos: 50,
    text: [{
      type: 'name',
      entity_index: 1,
      xpos: '[[[ source_x ]]]',
      value: '[[[ part_value ]]]',
    }],
  }, 0, harness.templates, 'card', harness.card);
  const sourceTool = tool.inlineTextSourceTools[0];
  const originalSetState = sourceTool.setState.bind(sourceTool);
  sourceTool.setState = (entity, entityConfig) => {
    harness.events.push({
      phase: 'source-state',
      entityIndex: sourceTool.entity_index,
      configEntityIndex: sourceTool.config.entity_index,
      state: entity.state,
    });
    originalSetState(entity, entityConfig);
  };

  const assertUpdate = (expectedEntityIndex, expectedPartContext) => {
    harness.events.length = 0;
    harness.calls.length = 0;
    tool.updateRuntimeConfig();
    assert.deepEqual(harness.calls.map(({ item, value }) => {
      if (item.id === 'inline-text-source-0') return 'inline-source';
      return Object.hasOwn(value, 'type') ? 'part' : 'outer';
    }), ['outer', 'inline-source', 'part']);
    assert.equal(harness.calls[2].item.entity_index, expectedPartContext);
    assert.equal(tool.config.text[0].entity_index, expectedEntityIndex);
    assert.equal(sourceTool.entity_index, expectedEntityIndex);
    assert.equal(sourceTool.config.entity_index, expectedEntityIndex);
    const sourceConfigBeforeState = sourceTool.config;

    tool.setState(harness.card.entities[0], harness.card.resolvedEntityConfigs[0]);

    assert.deepEqual(harness.events.map((event) => {
      if (event.phase) return event.phase;
      if (event.item.id === 'inline-text-source-0') return 'inline-source';
      return Object.hasOwn(event.value, 'type') ? 'part' : 'outer';
    }), ['outer', 'inline-source', 'part', 'source-state']);
    assert.deepEqual(harness.events[3], {
      phase: 'source-state',
      entityIndex: expectedEntityIndex,
      configEntityIndex: expectedEntityIndex,
      state: `state-${expectedEntityIndex}`,
    });
    assert.equal(sourceTool.entity_index, expectedEntityIndex);
    assert.equal(sourceTool.config.entity_index, expectedEntityIndex);
    assert.strictEqual(sourceTool.config, sourceConfigBeforeState);
    assert.deepEqual(tool.runtime.textParts.map(({ value }) => value), [`friendly-${expectedEntityIndex}`]);
  };

  assertUpdate(2, 1);
  nextEntityIndex = 3;
  assertUpdate(3, 2);
});

test('state-map localization and referenced source text reach displayed output', () => {
  const harness = createHarness((_item, value) => value);
  const localized = new TextTool({
    id: 'localized',
    entity_index: 0,
    xpos: 50,
    ypos: 50,
    text: [{
      value: 'fallback',
      localize_tag: 'text.fallback',
      state_map: { map: [{ state: 'on', localize_tag: 'text.ready' }] },
    }],
  }, 0, harness.templates, 'card', harness.card);

  localized.updateRuntimeConfig();
  localized.setState(harness.card.entities[0], harness.card.resolvedEntityConfigs[0]);

  assert.deepEqual(harness.localizations, ['text.ready']);
  assert.deepEqual(localized.runtime.textParts.map(({ value }) => value), ['localized:text.ready']);

  harness.card.cardTools.sections.names.push({
    id: 'referenced-name',
    entity_index: 1,
    getTextParts() {
      return [{ type: 'name', value: 'referenced source' }];
    },
  });
  const referenced = new TextTool({
    id: 'referenced-text',
    xpos: 50,
    ypos: 50,
    text: [{ type: 'name', id: 'referenced-name' }],
  }, 1, harness.templates, 'card', harness.card);

  referenced.updateRuntimeConfig();
  referenced.setState(undefined, undefined);

  assert.deepEqual(referenced.runtime.textParts.map(({ value }) => value), ['referenced source']);
});
