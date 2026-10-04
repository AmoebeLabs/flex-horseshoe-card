import assert from 'node:assert/strict';
import test from 'node:test';
import ControlButton from '../src/control-button.js';
import ControlNumber from '../src/control-number.js';
import ControlSelect from '../src/control-select.js';
import ControlSlider from '../src/control-slider.js';
import ControlToggle from '../src/control-toggle.js';
import ControlTool from '../src/control-tool.js';
import ConfigHelper from '../src/config-helper.js';
import Templates from '../src/templates.js';

const CONTROL_TYPES = {
  button: ControlButton,
  number: ControlNumber,
  select: ControlSelect,
  slider: ControlSlider,
  toggle: ControlToggle,
};

const template = (name) => `[[[ return constants.${name}; ]]]`;

/** Creates the shared entity and card services used by the real tool constructors. */
function createHarness(constants = {}) {
  const entities = [
    {
      entity_id: 'switch.main',
      state: 'on',
      attributes: {
        friendly_name: 'Main switch',
        min: 0,
        max: 100,
        step: 5,
        options: ['off', 'on'],
      },
    },
    {
      entity_id: 'input_number.lower',
      state: '20',
      attributes: { friendly_name: 'Lower value' },
    },
    {
      entity_id: 'input_number.upper',
      state: '80',
      attributes: { friendly_name: 'Upper value' },
    },
    {
      entity_id: 'sensor.override',
      state: 'idle',
      attributes: { friendly_name: 'Override entity' },
    },
  ];
  const entityConfigs = entities.map(({ entity_id }) => ({ entity: entity_id }));
  const cardConfig = {
    constants,
    entities: entityConfigs,
    dev: { debug: false },
  };
  const templates = new Templates(entities);
  templates.beginConfig(cardConfig);
  templates.setHass({ states: {}, user: { id: 'test-user' } });

  const card = {
    config: cardConfig,
    entities,
    runtimeEntityConfigs: entityConfigs,
    evaluateJavascriptTemplates: false,
    cardLayout: {
      changedGroupIds: new Set(),
      offset: { x: 0, y: 0 },
      calculateSvgCoordinatesInGroup(item) {
        return {
          xpos: item.xpos + this.offset.x,
          ypos: (item.yposc ?? item.ypos) + this.offset.y,
        };
      },
      getGroupScaleTransform: () => '',
      getGroupScaleStyle: () => '',
      groupManager: { getGroupChainForItem: () => [] },
      masksClips: { applyGradientRefs: (styles) => styles },
    },
    cardTheme: {
      modeChanged: false,
      colorContext: { cacheReady: false },
      getActiveColorStopMode: () => 'fixed',
    },
    cardAnimations: {
      styles: {
        controls: {},
        icons: {},
        iconsIcon: {},
        texts: {},
        names: {},
        areas: {},
        states: {},
        lines: {},
        rectangles: {},
        polygons: {},
      },
    },
    cardTools: {
      sections: { texts: [], names: [], areas: [], states: [] },
      getBySection(section) { return this.sections[section]; },
      getItemWidth: (width) => width,
      getItemHeight: (height) => height,
      getItemGeometry: () => ({ xpos: 50, ypos: 50, width: 20, height: 10 }),
    },
    iconCache: { 'mdi:lightbulb': 'M 3 3 L 21 21' },
    iconBoundsCache: {},
    actions: {
      getActionHandlerOptions: () => ({ hasTap: true, hasHold: false, hasDoubleClick: false }),
      handleAction() {},
    },
    _hass: {
      formatEntityState: (_entity, state) => `State ${state}`,
      formatEntityStateToParts: (_entity, state) => [{ type: 'value', value: state }],
      formatEntityAttributeValueToParts: (entity, attribute) => [{ type: 'value', value: entity.attributes[attribute] }],
      formatEntityAttributeValue: (_entity, attribute, state) => `${attribute} ${state}`,
      localize: (key) => `localized:${key}`,
    },
    requestUpdate() {},
    requestUpdates() {},
  };

  return { card, templates, entities, entityConfigs, cardConfig, constants };
}

/** Dispatches through the public compile-time control type using a copied source item. */
function createControl(type, source, harness) {
  const [control] = ControlTool.setConfig(
    { layout: { controls: [{ type, ...structuredClone(source) }] } },
    harness.templates,
    'test-card',
    harness.card,
  );
  return control;
}

/** Records calls to the production Templates evaluator without replacing it. */
function recordTemplateEvaluations(templates) {
  const calls = [];
  const evaluate = templates.evaluateJsTemplate.bind(templates);
  templates.evaluateJsTemplate = (item, javascript) => {
    calls.push({ id: item.id, entity_index: item.entity_index, javascript });
    return evaluate(item, javascript);
  };
  return calls;
}

test('static and JavaScript selectors converge for all five dispatched controls', () => {
  const scenarios = [
    {
      type: 'button',
      values: {
        orientation: 'vertical', width: 24, itemStyle: 'outlined_round',
        itemViz: 'viz_line', visibility: 'hidden',
      },
      static: {
        orientation: 'vertical', width: 24, visibility: 'hidden',
        show: { item_variant: 'default', item_viz: 'viz_line', item_style: 'outlined_round' },
        content: { mode: 'content_text', content_text: { text: 'Run' } },
      },
      javascript: {
        orientation: template('orientation'), width: template('width'), visibility: template('visibility'),
        show: { item_variant: 'default', item_viz: template('itemViz'), item_style: template('itemStyle') },
        content: { mode: 'content_text', content_text: { text: 'Run' } },
      },
    },
    {
      type: 'select',
      values: {
        orientation: 'vertical', width: 36, itemStyle: 'outlined_square',
        itemViz: 'viz_line', visibility: 'visible',
      },
      static: {
        entity_index: 0, orientation: 'vertical', width: 36,
        show: { item_variant: 'segmented', item_viz: 'viz_line', item_style: 'outlined_square' },
        option_map: [
          { value: 'off', text: 'Off' },
          { value: 'on', text: 'On' },
        ],
      },
      javascript: {
        entity_index: 0, orientation: template('orientation'), width: template('width'),
        visibility: template('visibility'),
        show: {
          item_variant: 'segmented', item_viz: template('itemViz'), item_style: template('itemStyle'),
        },
        option_map: [
          { value: 'off', text: 'Off' },
          { value: 'on', text: 'On' },
        ],
      },
    },
    {
      type: 'slider',
      values: {
        orientation: 'vertical', width: 30, itemVariant: 'range',
        itemViz: 'circular', itemStyle: 'ha',
      },
      static: {
        orientation: 'vertical', width: 30, entity_index: 1,
        show: { item_variant: 'range', item_viz: 'circular', item_style: 'ha' },
        values: [{ entity_index: 1 }, { entity_index: 2 }],
        scale: { min: 0, max: 100, step: 5 },
        value: { show: false },
      },
      javascript: {
        orientation: template('orientation'), width: template('width'), entity_index: 1,
        show: {
          item_variant: template('itemVariant'), item_viz: template('itemViz'), item_style: template('itemStyle'),
        },
        values: [{ entity_index: 1 }, { entity_index: 2 }],
        scale: { min: 0, max: 100, step: 5 },
        value: { show: false },
      },
    },
    {
      type: 'number',
      values: {
        orientation: 'vertical', width: 30, itemStyle: 'outlined_round',
      },
      static: {
        entity_index: 0, orientation: 'vertical', width: 30,
        show: { item_variant: 'stepper', item_viz: 'buttons', item_style: 'outlined_round' },
      },
      javascript: {
        entity_index: 0, orientation: template('orientation'), width: template('width'),
        show: {
          item_variant: 'stepper', item_viz: 'buttons', item_style: template('itemStyle'),
        },
      },
    },
    {
      type: 'toggle',
      values: {
        orientation: 'vertical', width: 40, itemStyle: 'ios',
      },
      static: {
        entity_index: 0, orientation: 'vertical', width: 40,
        show: { item_variant: 'switch', item_viz: 'default', item_style: 'ios' },
      },
      javascript: {
        entity_index: 0, orientation: template('orientation'), width: template('width'),
        show: {
          item_variant: 'switch', item_viz: 'default', item_style: template('itemStyle'),
        },
      },
    },
  ];

  scenarios.forEach((scenario) => {
    const staticHarness = createHarness({ ...scenario.values });
    const javascriptHarness = createHarness({ ...scenario.values });
    staticHarness.card.evaluateJavascriptTemplates = true;
    javascriptHarness.card.evaluateJavascriptTemplates = true;
    const staticControl = createControl(scenario.type, {
      id: `${scenario.type}-equivalence`, group: 'room', xpos: 48, ypos: 52, ...scenario.static,
    }, staticHarness);
    const javascriptControl = createControl(scenario.type, {
      id: `${scenario.type}-equivalence`, group: 'room', xpos: 48, ypos: 52, ...scenario.javascript,
    }, javascriptHarness);

    assert.ok(staticControl instanceof CONTROL_TYPES[scenario.type]);
    assert.ok(javascriptControl instanceof CONTROL_TYPES[scenario.type]);
    assert.equal(javascriptControl.sourceConfig.type, scenario.type);
    javascriptControl.updateRuntimeConfig();
    staticControl.updateRuntimeConfig();

    assert.deepEqual(javascriptControl.config, staticControl.config, `${scenario.type} current config`);
    assert.deepEqual(javascriptControl.geometry.svg, staticControl.geometry.svg, `${scenario.type} geometry`);
    assert.equal(Object.hasOwn(javascriptControl.config, 'svg'), false, `${scenario.type} config has no svg alias`);
    assert.ok(javascriptControl.geometry.svg, `${scenario.type} publishes geometry.svg`);
    if (scenario.type === 'number') assert.equal(Object.hasOwn(javascriptControl, 'numberGeometry'), false);

    if (scenario.type === 'select') {
      javascriptControl.setState(javascriptHarness.entities[0], javascriptHarness.entityConfigs[0]);
      staticControl.setState(staticHarness.entities[0], staticHarness.entityConfigs[0]);
      assert.deepEqual(javascriptControl.runtime.options, staticControl.runtime.options);
      assert.equal(javascriptControl.runtime.selectedIndex, 1);
      assert.deepEqual(javascriptControl.runtime.optionDisplayTexts, ['Off', 'On']);
      assert.equal(javascriptControl.runtime.actionConfigs[1].tap_action.option, 'on');
    } else if (scenario.type === 'slider') {
      javascriptControl.setState(javascriptHarness.entities[1], javascriptHarness.entityConfigs[1]);
      staticControl.setState(staticHarness.entities[1], staticHarness.entityConfigs[1]);
      assert.deepEqual(javascriptControl.runtime.values, [20, 80]);
      assert.deepEqual(javascriptControl.runtime.displayValues, [20, 80]);
      assert.equal(javascriptControl.runtime.available, true);
      assert.deepEqual(javascriptControl.runtime.scale, { min: 0, max: 100, step: 5 });
    } else if (scenario.type === 'number') {
      javascriptControl.setState(javascriptHarness.entities[0], javascriptHarness.entityConfigs[0]);
      staticControl.setState(staticHarness.entities[0], staticHarness.entityConfigs[0]);
      assert.equal(javascriptControl.runtime.minusActionConfig.tap_action.perform_action, 'switch.decrement');
      assert.equal(javascriptControl.runtime.plusActionConfig.tap_action.perform_action, 'switch.increment');
    } else {
      javascriptControl.setState(javascriptHarness.entities[0], javascriptHarness.entityConfigs[0]);
      staticControl.setState(staticHarness.entities[0], staticHarness.entityConfigs[0]);
      assert.deepEqual(javascriptControl.runtime, staticControl.runtime);
      if (scenario.type === 'button') {
        assert.equal(javascriptControl.runtime.active, true);
        assert.equal(javascriptControl.runtime.stateMapItem.active, true);
      }
    }

    assert.deepEqual(javascriptControl.config, staticControl.config, `${scenario.type} config after state`);

    const previousSvg = structuredClone(javascriptControl.geometry.svg);
    javascriptHarness.card.evaluateJavascriptTemplates = false;
    javascriptHarness.card.cardLayout.offset.x = 7;
    javascriptHarness.card.cardLayout.offset.y = -4;
    javascriptHarness.card.cardLayout.changedGroupIds.add('room');
    javascriptControl.updateRuntimeConfig();
    assert.equal(javascriptControl.geometry.svg.xpos, previousSvg.xpos + 7, `${scenario.type} group x`);
    assert.equal(javascriptControl.geometry.svg.ypos, previousSvg.ypos - 4, `${scenario.type} group y`);
  });
});

test('preset completion is visible through item before remaining parent templates run', () => {
  const constants = {
    style: 'outlined_round',
    calls: { style: 0, width: 0 },
  };
  const harness = createHarness(constants);
  const calls = recordTemplateEvaluations(harness.templates);
  const button = createControl('button', {
    id: 'preset-item-context',
    group: 'room',
    xpos: 50,
    ypos: 50,
    show: { item_style: '[[[ constants.calls.style += 1; return constants.style; ]]]' },
    width: '[[[ constants.calls.width += 1; return item.background.radius + 20; ]]]',
    content: { mode: 'content_text', content_text: { text: 'Preset' } },
  }, harness);
  const staticButton = createControl('button', {
    id: 'preset-item-context',
    group: 'room',
    xpos: 50,
    ypos: 50,
    show: { item_style: 'outlined_round' },
    width: 25,
    content: { mode: 'content_text', content_text: { text: 'Preset' } },
  }, createHarness());

  button.updateRuntimeConfig();
  staticButton.updateRuntimeConfig();

  assert.equal(constants.calls.style, 1);
  assert.equal(constants.calls.width, 1);
  assert.equal(calls.filter(({ javascript }) => javascript.includes('constants.calls.style')).length, 1);
  assert.equal(calls.filter(({ javascript }) => javascript.includes('constants.calls.width')).length, 1);
  assert.equal(button.config.background.radius, 5);
  assert.equal(button.config.width, 25);
  assert.deepEqual(button.config, staticButton.config);
  assert.deepEqual(button.geometry.svg, staticButton.geometry.svg);
});

test('selector fields run once per requested pass and retain one current signature', () => {
  const constants = {
    style: 'ha',
    orientation: 'horizontal',
    width: 40,
    calls: { style: 0, orientation: 0, width: 0 },
  };
  const harness = createHarness(constants);
  const evaluations = recordTemplateEvaluations(harness.templates);
  const styleSource = '[[[ constants.calls.style += 1; return constants.style; ]]]';
  const orientationSource = '[[[ constants.calls.orientation += 1; return constants.orientation; ]]]';
  const widthSource = '[[[ constants.calls.width += 1; return constants.width; ]]]';
  const toggle = createControl('toggle', {
    id: 'dynamic-toggle-style',
    entity_index: 0,
    group: 'room',
    xpos: 50,
    ypos: 50,
    orientation: orientationSource,
    width: widthSource,
    show: { item_style: styleSource },
  }, harness);
  const sourceSnapshot = structuredClone(toggle.sourceConfig);

  toggle.updateRuntimeConfig();
  assert.deepEqual(constants.calls, { style: 1, orientation: 1, width: 1 });
  assert.equal(toggle.config.show.item_style, 'ha');
  assert.ok(toggle.geometry.svg);
  const firstConfig = toggle.config;
  const firstSignature = toggle.evaluatedConfigSignature;
  assert.equal(typeof firstSignature, 'string');

  harness.card.evaluateJavascriptTemplates = true;
  toggle.updateRuntimeConfig();
  assert.deepEqual(constants.calls, { style: 2, orientation: 2, width: 2 });
  assert.strictEqual(toggle.config, firstConfig);
  assert.equal(toggle.evaluatedConfigSignature, firstSignature);

  constants.style = 'ios';
  constants.orientation = 'vertical';
  constants.width = 44;
  toggle.updateRuntimeConfig();
  assert.deepEqual(constants.calls, { style: 3, orientation: 3, width: 3 });
  assert.notStrictEqual(toggle.config, firstConfig);
  assert.equal(toggle.config.show.item_style, 'ios');
  assert.equal(toggle.config.orientation, 'vertical');
  assert.equal(toggle.config.width, 44);
  assert.notEqual(toggle.evaluatedConfigSignature, firstSignature);
  const iosGeometry = toggle.geometry.svg;
  const iosSignature = toggle.evaluatedConfigSignature;

  constants.style = 'industrial';
  toggle.updateRuntimeConfig();
  assert.deepEqual(constants.calls, { style: 4, orientation: 4, width: 4 });
  assert.equal(toggle.config.show.item_style, 'industrial');
  assert.notStrictEqual(toggle.geometry.svg, iosGeometry);
  assert.notEqual(toggle.evaluatedConfigSignature, iosSignature);

  const industrialConfig = toggle.config;
  harness.card.evaluateJavascriptTemplates = false;
  constants.style = 'ha';
  toggle.updateRuntimeConfig();
  assert.deepEqual(constants.calls, { style: 4, orientation: 4, width: 4 });
  assert.strictEqual(toggle.config, industrialConfig);
  assert.deepEqual(toggle.sourceConfig, sourceSnapshot);
  assert.equal(toggle.sourceConfig.show.item_style, styleSource);
  assert.equal(toggle.sourceConfig.orientation, orientationSource);
  assert.equal(toggle.sourceConfig.width, widthSource);
  assert.equal(Object.hasOwn(toggle.config, 'svg'), false);
});

test('Button and shared Select child templates evaluate once in each child context', () => {
  const childTemplate = '[[[ constants.calls.child += 1; return `${item.entity_index}:${entity.entity_id}`; ]]]';
  const buttonConstants = {
    parentIndex: 0,
    calls: { parent: 0, child: 0 },
  };
  const buttonHarness = createHarness(buttonConstants);
  const buttonEvaluations = recordTemplateEvaluations(buttonHarness.templates);
  const button = createControl('button', {
    id: 'button-child-context',
    entity_index: '[[[ constants.calls.parent += 1; return constants.parentIndex; ]]]',
    group: 'room',
    xpos: 50,
    ypos: 50,
    content: {
      mode: 'content_vertical',
      content_vertical: {
        padding: { x: 1, y: 1 },
        gap: 1,
        items: [
          { id: 'inherits-parent', type: 'text', text: childTemplate },
          { id: 'explicit-entity', type: 'text', entity_index: 2, text: childTemplate },
        ],
      },
    },
  }, buttonHarness);

  button.updateRuntimeConfig();
  assert.deepEqual(buttonConstants.calls, { parent: 1, child: 2 });
  const firstContent = button.contentVisual;
  const oldInherited = firstContent.childTools.find(({ id }) => id === 'inherits-parent').tool;
  const oldExplicit = firstContent.childTools.find(({ id }) => id === 'explicit-entity').tool;
  const oldInheritedSource = structuredClone(oldInherited.sourceConfig);
  let oldInheritedDisconnects = 0;
  const inheritedDisconnect = oldInherited.disconnected.bind(oldInherited);
  oldInherited.disconnected = (...args) => {
    oldInheritedDisconnects += 1;
    return inheritedDisconnect(...args);
  };

  assert.equal(button.entity_index, 0);
  assert.equal(oldInherited.entity_index, 0);
  assert.equal(oldExplicit.entity_index, 2);
  assert.equal(oldInherited.config.text[0].value, '0:switch.main');
  assert.equal(oldExplicit.config.text[0].value, '2:input_number.upper');
  assert.ok(button.evaluatedConfigSignature.includes(childTemplate));
  assert.equal(buttonEvaluations.filter(({ javascript }) => javascript.includes('calls.child')).length, 2);
  assert.ok(buttonEvaluations.filter(({ javascript }) => javascript.includes('calls.child'))
    .every(({ id }) => id !== button.id));

  buttonConstants.parentIndex = 1;
  buttonHarness.card.evaluateJavascriptTemplates = true;
  button.updateRuntimeConfig();

  const nextContent = button.contentVisual;
  const nextInherited = nextContent.childTools.find(({ id }) => id === 'inherits-parent').tool;
  const nextExplicit = nextContent.childTools.find(({ id }) => id === 'explicit-entity').tool;
  assert.notStrictEqual(nextContent, firstContent);
  assert.notStrictEqual(nextInherited, oldInherited);
  assert.notStrictEqual(nextExplicit, oldExplicit);
  assert.equal(oldInheritedDisconnects, 1);
  assert.deepEqual(oldInherited.sourceConfig, oldInheritedSource);
  assert.equal(button.entity_index, 1);
  assert.equal(nextInherited.entity_index, 1);
  assert.equal(nextExplicit.entity_index, 2);
  assert.equal(nextInherited.config.text[0].value, '1:input_number.lower');
  assert.equal(nextExplicit.config.text[0].value, '2:input_number.upper');
  assert.deepEqual(buttonConstants.calls, { parent: 2, child: 4 });
  assert.equal(buttonEvaluations.filter(({ javascript }) => javascript.includes('calls.child')).length, 4);

  button.setState(buttonHarness.entities[1], buttonHarness.entityConfigs[1]);
  assert.strictEqual(nextInherited.runtime.entity, buttonHarness.entities[1]);
  assert.strictEqual(nextExplicit.runtime.entity, buttonHarness.entities[2]);

  const selectConstants = { calls: { selector: 0, child: 0 }, style: 'outlined_round' };
  const selectHarness = createHarness(selectConstants);
  const selectEvaluations = recordTemplateEvaluations(selectHarness.templates);
  const select = createControl('select', {
    id: 'select-shared-child-context',
    entity_index: 0,
    group: 'room',
    xpos: 50,
    ypos: 50,
    show: {
      item_style: '[[[ constants.calls.selector += 1; return constants.style; ]]]',
    },
    option_map: [
      { value: 'off', text: 'Off', entity_index: 1 },
      { value: 'on', text: 'On', entity_index: 2 },
    ],
    content: {
      mode: 'content_vertical',
      content_vertical: {
        padding: { x: 0.5, y: 0.5 },
        gap: 0.5,
        items: [{ id: 'shared-label', type: 'text', text: childTemplate }],
      },
    },
  }, selectHarness);

  select.updateRuntimeConfig();
  const optionTextTools = select.getContentTools().map((content) => content.childTools[0].tool);
  assert.deepEqual(selectConstants.calls, { selector: 1, child: 2 });
  assert.deepEqual(optionTextTools.map((tool) => tool.entity_index), [1, 2]);
  assert.deepEqual(optionTextTools.map((tool) => tool.config.text[0].value), [
    '1:input_number.lower',
    '2:input_number.upper',
  ]);
  assert.equal(select.config.content.content_vertical.items[0].text, childTemplate);
  assert.equal(selectEvaluations.filter(({ javascript }) => javascript.includes('calls.child')).length, 2);
  assert.deepEqual(
    selectEvaluations.filter(({ javascript }) => javascript.includes('calls.child'))
      .map(({ entity_index }) => entity_index),
    [1, 2],
  );
  assert.ok(selectEvaluations.filter(({ javascript }) => javascript.includes('calls.child'))
    .every(({ id }) => id !== select.id));
});

test('whole action templates and nested action templates receive haptics after evaluation', () => {
  const actionTemplate = '[[[ constants.calls.tap += 1; return { action: "toggle" }; ]]]';
  const nestedActionTemplate = '[[[ constants.calls.hold += 1; return "toggle"; ]]]';
  const constants = { calls: { tap: 0, hold: 0 } };
  const harness = createHarness(constants);
  const evaluations = recordTemplateEvaluations(harness.templates);
  const button = createControl('button', {
    id: 'source-safe-actions',
    group: 'room',
    xpos: 50,
    ypos: 50,
    tap_action: actionTemplate,
    hold_action: { action: nestedActionTemplate },
    content: { mode: 'content_text', content_text: { text: 'Actions' } },
  }, harness);
  const staticButton = createControl('button', {
    id: 'static-actions',
    group: 'room',
    xpos: 50,
    ypos: 50,
    tap_action: { action: 'toggle' },
    hold_action: { action: 'toggle' },
    content: { mode: 'content_text', content_text: { text: 'Actions' } },
  }, createHarness());

  assert.equal(button.sourceConfig.tap_action, actionTemplate);
  assert.equal(button.sourceConfig.hold_action.action, nestedActionTemplate);
  button.updateRuntimeConfig();
  staticButton.updateRuntimeConfig();

  assert.deepEqual(constants.calls, { tap: 1, hold: 1 });
  assert.equal(evaluations.filter(({ javascript }) => javascript.includes('calls.tap')).length, 1);
  assert.equal(evaluations.filter(({ javascript }) => javascript.includes('calls.hold')).length, 1);
  assert.deepEqual(button.config.tap_action, { action: 'toggle', haptic: 'selection' });
  assert.deepEqual(button.config.hold_action, { action: 'toggle', haptic: 'medium' });
  assert.deepEqual(button.config.tap_action, staticButton.config.tap_action);
  assert.deepEqual(button.config.hold_action, staticButton.config.hold_action);
  assert.equal(button.sourceConfig.tap_action, actionTemplate);
  assert.equal(button.sourceConfig.hold_action.action, nestedActionTemplate);

  // A dynamic no-action gesture has exactly the same default-feedback behavior
  // as its static form, while authored haptics remain an explicit override.
  for (const action of ['none', 'toggle']) {
    const dynamic = createControl('button', {
      id: 'nested-action-result', xpos: 50, ypos: 50,
      tap_action: { action: '[[[ return constants.action; ]]]' },
    }, createHarness({ action }));
    const fixed = createControl('button', {
      id: 'nested-action-result', xpos: 50, ypos: 50,
      tap_action: { action },
    }, createHarness());
    assert.equal(Object.hasOwn(dynamic.sourceConfig.tap_action, 'haptic'), false);
    dynamic.updateRuntimeConfig();
    assert.deepEqual(dynamic.config.tap_action, fixed.config.tap_action);
  }
});

test('removing a dynamic Control label ends its child lifetime exactly once', () => {
  const harness = createHarness({ showLabel: true });
  harness.card.evaluateJavascriptTemplates = true;
  const control = createControl('button', {
    id: 'removable-label', xpos: 50, ypos: 50,
    label: '[[[ return constants.showLabel ? { text: "Label" } : undefined; ]]]',
  }, harness);
  control.updateRuntimeConfig();
  const firstLabel = control.labelTextTool;
  const disconnect = firstLabel.disconnected.bind(firstLabel);
  let closes = 0;
  firstLabel.disconnected = () => { closes += 1; disconnect(); };

  harness.constants.showLabel = false;
  control.updateRuntimeConfig();
  assert.equal(control.config.label, undefined);
  assert.equal(control.labelTextTool, undefined);
  assert.equal(firstLabel.textClosed, true);
  assert.equal(closes, 1);
  control.updateRuntimeConfig();
  assert.equal(closes, 1);

  harness.constants.showLabel = true;
  control.updateRuntimeConfig();
  assert.ok(control.labelTextTool);
  assert.notStrictEqual(control.labelTextTool, firstLabel);
  assert.equal(control.labelTextTool.config.text[0].value, 'Label');
});

test('direct Select option icon templates use their completed option binding', () => {
  const harness = createHarness({ calls: [] });
  const icon = '[[[ constants.calls.push(entity.entity_id); return entity.entity_id === "input_number.lower" ? "mdi:arrow-down" : "mdi:arrow-up"; ]]]';
  const control = createControl('select', {
    id: 'option-icon-binding', entity_index: 0, xpos: 50, ypos: 50,
    option_map: [
      { value: 'low', entity_index: 1, icon },
      { value: 'high', entity_index: 2, icon },
    ],
  }, harness);
  control.updateRuntimeConfig();
  assert.deepEqual(control.optionIconTools.map((tool) => tool.entity_index), [1, 2]);
  assert.deepEqual(control.optionIconTools.map((tool) => tool.config.icon), ['mdi:arrow-down', 'mdi:arrow-up']);
  assert.deepEqual(harness.constants.calls, ['input_number.lower', 'input_number.upper']);
  assert.equal(control.sourceConfig.option_map[0].icon, icon);
  control.setState(harness.entities[0], harness.entityConfigs[0]);
  assert.deepEqual(control.optionIconTools.map((tool) => tool.runtime.entity), harness.entities.slice(1, 3));
});

test('whole label styles and dynamic label position are normalized before publication', () => {
  const stylesTemplate = '[[[ constants.calls.styles += 1; return { fill: "red", "font-size": "1.2em", "text-anchor": "end" }; ]]]';
  const positionTemplate = '[[[ constants.calls.position += 1; return constants.position; ]]]';
  const constants = { position: 'top', calls: { styles: 0, position: 0 } };
  const harness = createHarness(constants);
  const evaluations = recordTemplateEvaluations(harness.templates);
  const dynamicButton = createControl('button', {
    id: 'dynamic-control-label',
    group: 'room',
    xpos: 50,
    ypos: 50,
    label: {
      text: 'Temperature',
      position: positionTemplate,
      styles: stylesTemplate,
    },
    content: { mode: 'content_text', content_text: { text: 'Set' } },
  }, harness);
  const staticButton = createControl('button', {
    id: 'static-control-label',
    group: 'room',
    xpos: 50,
    ypos: 50,
    label: {
      text: 'Temperature',
      position: 'top',
      styles: { fill: 'red', 'font-size': '1.2em', 'text-anchor': 'end' },
    },
    content: { mode: 'content_text', content_text: { text: 'Set' } },
  }, createHarness());

  assert.equal(dynamicButton.sourceConfig.label.styles, stylesTemplate);
  assert.equal(dynamicButton.sourceConfig.label.position, positionTemplate);
  dynamicButton.updateRuntimeConfig();
  staticButton.updateRuntimeConfig();

  assert.deepEqual(constants.calls, { styles: 1, position: 1 });
  assert.equal(evaluations.filter(({ javascript }) => javascript.includes('calls.styles')).length, 1);
  assert.equal(evaluations.filter(({ javascript }) => javascript.includes('calls.position')).length, 1);
  assert.deepEqual(dynamicButton.config.label, staticButton.config.label);
  assert.equal(dynamicButton.config.label.styles.fill, 'red');
  assert.equal(dynamicButton.config.label.styles['font-size'], '1.2em');
  assert.equal(dynamicButton.config.label.styles['text-anchor'], 'end');
  assert.ok(dynamicButton.labelTextTool.geometry.svg.ypos < dynamicButton.geometry.svg.ypos);
  assert.deepEqual(dynamicButton.labelTextTool.geometry.svg, staticButton.labelTextTool.geometry.svg);
  assert.equal(dynamicButton.sourceConfig.label.styles, stylesTemplate);
  assert.equal(dynamicButton.sourceConfig.label.position, positionTemplate);
});

test('multipart label styles remain child-owned source until Text evaluation', () => {
  const stylesTemplate = '[[[ constants.calls += 1; return { fill: entity.state === "80" ? "red" : "blue", "font-size": "1.2em" }; ]]]';
  const harness = createHarness({ calls: 0 });
  const evaluations = recordTemplateEvaluations(harness.templates);
  const button = createControl('button', {
    id: 'multipart-control-label',
    entity_index: 0,
    xpos: 50,
    ypos: 50,
    label: {
      styles: { fill: 'green', opacity: 0.6 },
      text: [{ entity_index: 2, value: 'Upper value', styles: stylesTemplate }],
    },
    content: { mode: 'content_text', content_text: { text: 'Set' } },
  }, harness);

  button.updateRuntimeConfig();
  const label = button.labelTextTool;
  assert.equal(button.sourceConfig.label.text[0].styles, stylesTemplate);
  assert.equal(label.sourceConfig.text[0].styles[1], stylesTemplate);
  assert.equal(harness.constants.calls, 1);
  assert.deepEqual(evaluations.filter(({ javascript }) => javascript.includes('constants.calls += 1'))
    .map(({ entity_index }) => entity_index), [2]);
  assert.deepEqual(ConfigHelper.toStyleDict(label.config.text[0].styles), {
    'text-anchor': 'end',
    'dominant-baseline': 'central',
    fill: 'red',
    opacity: '0.6',
    'font-size': '1.2em',
  });

  harness.card.evaluateJavascriptTemplates = true;
  harness.entities[2].state = '20';
  button.updateRuntimeConfig();
  assert.strictEqual(button.labelTextTool, label);
  assert.equal(harness.constants.calls, 2);
  assert.equal(ConfigHelper.toStyleDict(label.config.text[0].styles).fill, 'blue');
});

test('dynamic controls tolerate render and lifecycle calls before their first publication', () => {
  const constants = { mode: 'content_text', itemViz: 'viz_button', calls: { mode: 0 } };
  const harness = createHarness(constants);
  const button = createControl('button', {
    id: 'pre-publication-button',
    group: 'room',
    xpos: 50,
    ypos: 50,
    show: { item_viz: template('itemViz') },
    content: {
      mode: '[[[ constants.calls.mode += 1; return constants.mode; ]]]',
      content_text: { text: 'Ready' },
    },
  }, harness);

  assert.deepEqual(button.getContentTools(), []);
  assert.deepEqual(button.geometry, {});
  assert.doesNotThrow(() => button.render());
  assert.doesNotThrow(() => button.connected());
  assert.doesNotThrow(() => button.hassAvailable());
  assert.doesNotThrow(() => button.hassConnected());
  assert.doesNotThrow(() => button.firstUpdated(new Map()));
  assert.doesNotThrow(() => button.requiresHassUpdate());
  assert.doesNotThrow(() => button.disconnected());
  assert.equal(constants.calls.mode, 0);

  harness.card.evaluateJavascriptTemplates = true;
  button.updateRuntimeConfig();
  const firstChild = button.getContentTools()[0];
  assert.equal(constants.calls.mode, 1);
  assert.ok(button.geometry.svg);
  assert.equal(Object.hasOwn(button.config, 'svg'), false);
  assert.equal(firstChild.config.text[0].value, 'Ready');

  button.connected();
  assert.equal(firstChild.textClosed, false);
  button.updateRuntimeConfig();
  assert.strictEqual(button.getContentTools()[0], firstChild);
  assert.equal(constants.calls.mode, 2);
  button.disconnected();
});

test('paint and HA option changes stay in runtime without rewriting canonical config', () => {
  const buttonHarness = createHarness();
  const button = createControl('button', {
    id: 'paint-button',
    entity_index: 0,
    group: 'room',
    xpos: 50,
    ypos: 50,
    content: { mode: 'content_text', content_text: { text: 'Power' } },
  }, buttonHarness);
  button.updateRuntimeConfig();
  const buttonConfigSnapshot = structuredClone(button.config);
  const buttonText = button.getContentTools()[0];
  const buttonTextConfigStyles = structuredClone(buttonText.config.styles);
  const buttonTextSourceStyles = structuredClone(buttonText.sourceConfig.styles);

  button.setState({ ...buttonHarness.entities[0], state: 'off' }, buttonHarness.entityConfigs[0]);
  const inactivePaint = structuredClone(buttonText.paint.styles);
  assert.equal(button.runtime.active, false);
  assert.equal(button.runtime.stateMapItem.active, false);
  button.setState({ ...buttonHarness.entities[0], state: 'on' }, buttonHarness.entityConfigs[0]);

  assert.equal(button.runtime.active, true);
  assert.equal(button.runtime.stateMapItem.active, true);
  assert.notDeepEqual(buttonText.paint.styles, inactivePaint);
  assert.deepEqual(button.config, buttonConfigSnapshot);
  assert.deepEqual(buttonText.config.styles, buttonTextConfigStyles);
  assert.deepEqual(buttonText.sourceConfig.styles, buttonTextSourceStyles);
  assert.ok(buttonText.paint.styles.fill);

  const paintSelectHarness = createHarness();
  const paintSelect = createControl('select', {
    id: 'paint-select',
    entity_index: 0,
    group: 'room',
    xpos: 50,
    ypos: 50,
    option_map: [
      { value: 'off', text: 'Off' },
      { value: 'on', text: 'On' },
    ],
  }, paintSelectHarness);
  paintSelect.updateRuntimeConfig();
  const selectConfigSnapshot = structuredClone(paintSelect.config);
  paintSelect.setState({ ...paintSelectHarness.entities[0], state: 'off' }, paintSelectHarness.entityConfigs[0]);
  const selectedText = paintSelect.getContentTools().find((tool) => Array.isArray(tool.config.text));
  const selectedTextConfigStyles = structuredClone(selectedText.config.styles);
  const selectedTextSourceStyles = structuredClone(selectedText.sourceConfig.styles);
  const unselectedPaint = structuredClone(selectedText.paint.styles);
  paintSelect.setState({ ...paintSelectHarness.entities[0], state: 'on' }, paintSelectHarness.entityConfigs[0]);

  assert.equal(paintSelect.runtime.selectedIndex, 1);
  assert.notDeepEqual(selectedText.paint.styles, unselectedPaint);
  assert.deepEqual(paintSelect.config, selectConfigSnapshot);
  assert.deepEqual(selectedText.config.styles, selectedTextConfigStyles);
  assert.deepEqual(selectedText.sourceConfig.styles, selectedTextSourceStyles);

  const dynamicSelectHarness = createHarness({ width: 34 });
  const dynamicSelect = createControl('select', {
    id: 'runtime-ha-options',
    entity_index: 0,
    group: 'room',
    xpos: 50,
    ypos: 50,
    width: '[[[ return constants.width; ]]]',
  }, dynamicSelectHarness);

  dynamicSelect.updateRuntimeConfig();
  const configBeforeHaOptions = structuredClone(dynamicSelect.config);
  const sourceBeforeHaOptions = structuredClone(dynamicSelect.sourceConfig);
  const firstHaEntity = {
    ...dynamicSelectHarness.entities[0],
    state: 'low',
    attributes: { ...dynamicSelectHarness.entities[0].attributes, options: ['low', 'high'] },
  };
  dynamicSelect.setState(firstHaEntity, dynamicSelectHarness.entityConfigs[0]);

  assert.deepEqual(dynamicSelect.runtime.options.map(({ value }) => value), ['low', 'high']);
  assert.deepEqual(dynamicSelect.runtime.optionDisplayTexts, ['State low', 'State high']);
  assert.equal(dynamicSelect.runtime.selectedIndex, 0);
  assert.deepEqual(dynamicSelect.config, configBeforeHaOptions);
  assert.deepEqual(dynamicSelect.sourceConfig, sourceBeforeHaOptions);

  const secondHaEntity = {
    ...firstHaEntity,
    state: 'boost',
    attributes: { ...firstHaEntity.attributes, options: ['low', 'boost'] },
  };
  dynamicSelect.setState(secondHaEntity, dynamicSelectHarness.entityConfigs[0]);
  assert.deepEqual(dynamicSelect.runtime.options.map(({ value }) => value), ['low', 'boost']);
  assert.equal(dynamicSelect.runtime.selectedIndex, 1);
  assert.deepEqual(dynamicSelect.config, configBeforeHaOptions);

  dynamicSelectHarness.constants.width = 42;
  dynamicSelectHarness.card.evaluateJavascriptTemplates = true;
  dynamicSelect.updateRuntimeConfig();
  assert.equal(dynamicSelect.config.width, 42);
  assert.deepEqual(dynamicSelect.runtime.options.map(({ value }) => value), ['low', 'boost']);
  assert.deepEqual(dynamicSelect.config.option_map, configBeforeHaOptions.option_map);
  assert.deepEqual(dynamicSelect.sourceConfig, sourceBeforeHaOptions);
});

test('Button and Select whole-value visualizations survive selector passes and switches', () => {
  const visualizationTemplate = (name) => `[[[ constants.calls.${name} += 1; return {
    animation: { duration: constants.values.${name}.duration, easing: "linear" },
    indicator: { position: constants.values.${name}.position }
  }; ]]]`;
  const selectorTemplate = '[[[ constants.calls.selector += 1; return constants.itemViz; ]]]';
  const passes = [
    {
      itemViz: 'viz_button',
      values: {
        viz_button: { duration: 311, position: 'bottom' },
        viz_line: { duration: 412, position: 'top' },
      },
    },
    {
      itemViz: 'viz_line',
      values: {
        viz_button: { duration: 513, position: 'top' },
        viz_line: { duration: 614, position: 'bottom' },
      },
    },
  ];

  for (const type of ['button', 'select']) {
    const constants = {
      itemViz: 'viz_button',
      values: structuredClone(passes[0].values),
      calls: { selector: 0, viz_button: 0, viz_line: 0 },
    };
    const harness = createHarness(constants);
    const evaluations = recordTemplateEvaluations(harness.templates);
    const control = createControl(type, {
      id: `${type}-whole-value-visualization`,
      entity_index: 0,
      group: 'room',
      xpos: 50,
      ypos: 50,
      show: {
        item_variant: type === 'button' ? 'default' : 'segmented',
        item_viz: selectorTemplate,
        item_style: type === 'button' ? 'filled_square' : 'filled_round',
      },
      viz_button: visualizationTemplate('viz_button'),
      viz_line: visualizationTemplate('viz_line'),
    }, harness);
    const sourceConfig = control.sourceConfig;
    const sourceSnapshot = structuredClone(sourceConfig);
    let previousConfig;

    passes.forEach((pass, passIndex) => {
      constants.itemViz = pass.itemViz;
      constants.values = structuredClone(pass.values);
      if (passIndex > 0) harness.card.evaluateJavascriptTemplates = true;

      control.updateRuntimeConfig();

      const staticHarness = createHarness();
      const staticControl = createControl(type, {
        id: `${type}-whole-value-visualization`,
        entity_index: 0,
        group: 'room',
        xpos: 50,
        ypos: 50,
        show: {
          item_variant: type === 'button' ? 'default' : 'segmented',
          item_viz: pass.itemViz,
          item_style: type === 'button' ? 'filled_square' : 'filled_round',
        },
        viz_button: {
          animation: { duration: pass.values.viz_button.duration, easing: 'linear' },
          indicator: { position: pass.values.viz_button.position },
        },
        viz_line: {
          animation: { duration: pass.values.viz_line.duration, easing: 'linear' },
          indicator: { position: pass.values.viz_line.position },
        },
      }, staticHarness);
      staticControl.updateRuntimeConfig();

      assert.deepEqual(control.config, staticControl.config, `${type} ${pass.itemViz} config`);
      assert.deepEqual(control.geometry.svg, staticControl.geometry.svg, `${type} ${pass.itemViz} geometry`);
      assert.equal(control.config.show.item_viz, pass.itemViz);
      assert.deepEqual(constants.calls, {
        selector: passIndex + 1,
        viz_button: passIndex + 1,
        viz_line: passIndex + 1,
      });
      assert.equal(evaluations.filter(({ javascript }) => javascript.includes('calls.selector')).length, passIndex + 1);
      assert.equal(evaluations.filter(({ javascript }) => javascript.includes('calls.viz_button')).length, passIndex + 1);
      assert.equal(evaluations.filter(({ javascript }) => javascript.includes('calls.viz_line')).length, passIndex + 1);
      assert.strictEqual(control.sourceConfig, sourceConfig);
      assert.deepEqual(control.sourceConfig, sourceSnapshot);
      assert.equal(control.sourceConfig.show.item_viz, selectorTemplate);
      assert.equal(control.sourceConfig.viz_button, visualizationTemplate('viz_button'));
      assert.equal(control.sourceConfig.viz_line, visualizationTemplate('viz_line'));

      if (previousConfig) assert.notStrictEqual(control.config, previousConfig);
      previousConfig = control.config;
    });
  }
});

test('Button whole-value state_map matches static configuration without rewriting source', () => {
  const stateMapTemplate = `[[[ constants.calls.stateMap += 1; return {
    map: [
      { state: constants.activeState, active: true },
      { state: "default", active: false }
    ]
  }; ]]]`;
  const constants = { activeState: 'on', calls: { stateMap: 0 } };
  const harness = createHarness(constants);
  const evaluations = recordTemplateEvaluations(harness.templates);
  const button = createControl('button', {
    id: 'whole-value-state-map',
    entity_index: 0,
    xpos: 50,
    ypos: 50,
    state_map: stateMapTemplate,
  }, harness);
  const sourceConfig = button.sourceConfig;
  const sourceSnapshot = structuredClone(sourceConfig);
  const staticHarness = createHarness();
  const staticButton = createControl('button', {
    id: 'whole-value-state-map',
    entity_index: 0,
    xpos: 50,
    ypos: 50,
    state_map: {
      map: [
        { state: 'on', active: true },
        { state: 'default', active: false },
      ],
    },
  }, staticHarness);

  button.updateRuntimeConfig();
  staticButton.updateRuntimeConfig();

  assert.equal(constants.calls.stateMap, 1);
  assert.equal(evaluations.filter(({ javascript }) => javascript.includes('calls.stateMap')).length, 1);
  assert.deepEqual(button.config, staticButton.config);
  assert.deepEqual(button.geometry.svg, staticButton.geometry.svg);
  assert.equal(button.config.state_map.map[0].state, 'on');
  button.setState(harness.entities[0], harness.entityConfigs[0]);
  staticButton.setState(staticHarness.entities[0], staticHarness.entityConfigs[0]);
  assert.equal(button.runtime.active, true);
  assert.equal(button.runtime.active, staticButton.runtime.active);
  assert.strictEqual(button.sourceConfig, sourceConfig);
  assert.deepEqual(button.sourceConfig, sourceSnapshot);
  assert.equal(button.sourceConfig.state_map, stateMapTemplate);

  const selectorMap = { map: [{ state: 'custom', active: true }] };
  const selectorOrientationTemplate = '[[[ constants.calls.orientation += 1; return item.state_map.map.length === 1 && item.state_map.map[0].state === "custom" ? "horizontal" : "vertical"; ]]]';
  const selectorHarness = createHarness({ calls: { orientation: 0 } });
  const selectorEvaluations = recordTemplateEvaluations(selectorHarness.templates);
  const selectorButton = createControl('button', {
    id: 'selector-sees-replacement-state-map',
    entity_index: 0,
    xpos: 50,
    ypos: 50,
    orientation: selectorOrientationTemplate,
    state_map: selectorMap,
  }, selectorHarness);
  const staticSelectorHarness = createHarness();
  const staticSelectorButton = createControl('button', {
    id: 'selector-sees-replacement-state-map',
    entity_index: 0,
    xpos: 50,
    ypos: 50,
    orientation: 'horizontal',
    state_map: selectorMap,
  }, staticSelectorHarness);

  selectorButton.updateRuntimeConfig();
  staticSelectorButton.updateRuntimeConfig();

  assert.equal(selectorHarness.constants.calls.orientation, 1);
  assert.equal(selectorEvaluations.filter(({ javascript }) => javascript.includes('calls.orientation')).length, 1);
  assert.equal(selectorButton.config.orientation, 'horizontal');
  assert.deepEqual(selectorButton.config, staticSelectorButton.config);
  assert.deepEqual(selectorButton.geometry.svg, staticSelectorButton.geometry.svg);
  assert.equal(selectorButton.sourceConfig.orientation, selectorOrientationTemplate);
});

test('generated control children evaluate and publish state from their own bindings', () => {
  const buttonContexts = [];
  const buttonHarness = createHarness({
    parentIndex: 0,
    parentCalls: 0,
    contexts: buttonContexts,
  });
  const buttonEvaluations = recordTemplateEvaluations(buttonHarness.templates);
  const parentIndexTemplate = '[[[ constants.parentCalls += 1; return constants.parentIndex; ]]]';
  const buttonIconTemplate = `[[[ constants.contexts.push({
    kind: "button-icon", index: item.entity_index, entity: entity.entity_id, state
  }); return "mdi:lightbulb"; ]]]`;
  const buttonTextTemplate = `[[[ constants.contexts.push({
    kind: "button-text", index: item.entity_index, entity: entity.entity_id, state
  }); return entity.entity_id + ":" + state; ]]]`;
  const button = createControl('button', {
    id: 'button-direct-child-bindings',
    entity_index: parentIndexTemplate,
    group: 'room',
    xpos: 50,
    ypos: 50,
    content: {
      mode: 'content_horizontal',
      content_horizontal: {
        icon: { entity_index: 1, icon: buttonIconTemplate },
        text: { entity_index: 2, text: buttonTextTemplate },
      },
    },
  }, buttonHarness);
  const buttonSource = button.sourceConfig;
  const buttonSourceSnapshot = structuredClone(buttonSource);

  button.updateRuntimeConfig();
  button.setState(buttonHarness.entities[0], buttonHarness.entityConfigs[0]);

  assert.equal(button.contentIconTool.entity_index, 1);
  assert.equal(button.contentIconTool.config.icon, 'mdi:lightbulb');
  assert.equal(button.contentTextTool.entity_index, 2);
  assert.equal(button.contentTextTool.config.text[0].value, 'input_number.upper:80');
  assert.deepEqual(buttonContexts, [
    { kind: 'button-icon', index: 1, entity: 'input_number.lower', state: '20' },
    { kind: 'button-text', index: 2, entity: 'input_number.upper', state: '80' },
  ]);
  assert.strictEqual(button.contentIconTool.runtime.entity, buttonHarness.entities[1]);
  assert.strictEqual(button.contentIconTool.runtime.entityConfig, buttonHarness.entityConfigs[1]);
  assert.strictEqual(button.contentTextTool.runtime.entity, buttonHarness.entities[2]);
  assert.strictEqual(button.contentTextTool.runtime.entityConfig, buttonHarness.entityConfigs[2]);

  buttonHarness.constants.parentIndex = 3;
  buttonHarness.card.evaluateJavascriptTemplates = true;
  button.updateRuntimeConfig();
  button.setState(buttonHarness.entities[3], buttonHarness.entityConfigs[3]);

  assert.equal(button.entity_index, 3);
  assert.equal(button.contentIconTool.config.icon, 'mdi:lightbulb');
  assert.equal(button.contentTextTool.config.text[0].value, 'input_number.upper:80');
  assert.deepEqual(buttonContexts.slice(2), [
    { kind: 'button-icon', index: 1, entity: 'input_number.lower', state: '20' },
    { kind: 'button-text', index: 2, entity: 'input_number.upper', state: '80' },
  ]);
  assert.equal(buttonEvaluations.filter(({ javascript }) => javascript.includes('button-icon')).length, 2);
  assert.equal(buttonEvaluations.filter(({ javascript }) => javascript.includes('button-text')).length, 2);
  assert.strictEqual(button.contentIconTool.runtime.entity, buttonHarness.entities[1]);
  assert.strictEqual(button.contentIconTool.runtime.entityConfig, buttonHarness.entityConfigs[1]);
  assert.strictEqual(button.contentTextTool.runtime.entity, buttonHarness.entities[2]);
  assert.strictEqual(button.contentTextTool.runtime.entityConfig, buttonHarness.entityConfigs[2]);
  assert.strictEqual(button.sourceConfig, buttonSource);
  assert.deepEqual(button.sourceConfig, buttonSourceSnapshot);
  assert.equal(button.sourceConfig.entity_index, parentIndexTemplate);

  const toggleContexts = [];
  const toggleHarness = createHarness({ contexts: toggleContexts });
  const toggleEvaluations = recordTemplateEvaluations(toggleHarness.templates);
  const toggleIconTemplate = `[[[ constants.contexts.push({
    index: item.entity_index, entity: entity.entity_id, state
  }); return "mdi:lightbulb"; ]]]`;
  const toggle = createControl('toggle', {
    id: 'toggle-direct-icon-binding',
    entity_index: 0,
    xpos: 50,
    ypos: 50,
    content: {
      mode: 'content_icon',
      content_icon: {
        icon: { entity_index: 2, icon: toggleIconTemplate },
      },
    },
  }, toggleHarness);
  toggle.updateRuntimeConfig();
  toggle.setState(toggleHarness.entities[0], toggleHarness.entityConfigs[0]);

  assert.equal(toggle.iconTool.entity_index, 2);
  assert.deepEqual(toggleContexts, [
    { index: 2, entity: 'input_number.upper', state: '80' },
  ]);
  assert.equal(toggleEvaluations.filter(({ javascript }) => javascript.includes('constants.contexts.push')).length, 1);
  assert.strictEqual(toggle.iconTool.runtime.entity, toggleHarness.entities[2]);
  assert.strictEqual(toggle.iconTool.runtime.entityConfig, toggleHarness.entityConfigs[2]);
  assert.equal(toggle.sourceConfig.content.content_icon.icon.icon, toggleIconTemplate);

  const selectContexts = [];
  const selectHarness = createHarness({ contexts: selectContexts });
  const selectEvaluations = recordTemplateEvaluations(selectHarness.templates);
  const selectTextTemplate = (option) => `[[[ constants.contexts.push({
    option: "${option}", index: item.entity_index, entity: entity.entity_id, state
  }); return entity.entity_id + ":" + state; ]]]`;
  const select = createControl('select', {
    id: 'select-direct-option-text-bindings',
    entity_index: 0,
    xpos: 50,
    ypos: 50,
    option_map: [
      { value: 'off', entity_index: 1, text: selectTextTemplate('off') },
      { value: 'on', entity_index: 2, text: selectTextTemplate('on') },
    ],
  }, selectHarness);
  select.updateRuntimeConfig();
  select.setState(selectHarness.entities[0], selectHarness.entityConfigs[0]);

  assert.deepEqual(select.optionTextTools.map((tool) => tool.entity_index), [1, 2]);
  assert.deepEqual(select.optionTextTools.map((tool) => tool.config.text[0].value), [
    'input_number.lower:20',
    'input_number.upper:80',
  ]);
  assert.ok(selectContexts.some(({ option, index, entity, state }) =>
    option === 'off' && index === 1 && entity === 'input_number.lower' && state === '20'));
  assert.ok(selectContexts.some(({ option, index, entity, state }) =>
    option === 'on' && index === 2 && entity === 'input_number.upper' && state === '80'));
  assert.ok(selectEvaluations.filter(({ javascript }) => javascript.includes('constants.contexts.push'))
    .every(({ entity_index }) => [1, 2].includes(entity_index)));
  assert.strictEqual(select.optionTextTools[0].runtime.entity, selectHarness.entities[1]);
  assert.strictEqual(select.optionTextTools[0].runtime.entityConfig, selectHarness.entityConfigs[1]);
  assert.strictEqual(select.optionTextTools[1].runtime.entity, selectHarness.entities[2]);
  assert.strictEqual(select.optionTextTools[1].runtime.entityConfig, selectHarness.entityConfigs[2]);
  assert.equal(select.sourceConfig.option_map[0].text, selectTextTemplate('off'));

  const numberContexts = [];
  const numberHarness = createHarness({ contexts: numberContexts });
  const numberEvaluations = recordTemplateEvaluations(numberHarness.templates);
  const numberIconTemplate = `[[[ constants.contexts.push({
    kind: "number-icon", index: item.entity_index, entity: entity.entity_id, state
  }); return "mdi:minus"; ]]]`;
  const numberTextTemplate = `[[[ constants.contexts.push({
    kind: "number-text", index: item.entity_index, entity: entity.entity_id, state
  }); return entity.entity_id + ":" + state; ]]]`;
  const numberStateTemplate = `[[[ constants.contexts.push({
    kind: "number-state", index: item.entity_index, entity: entity.entity_id, state
  }); return "none"; ]]]`;
  const number = createControl('number', {
    id: 'number-generated-child-bindings',
    entity_index: 0,
    xpos: 50,
    ypos: 50,
    content: {
      mode: 'content_horizontal',
      content_horizontal: {
        minus: {
          mode: 'content_icon',
          content_icon: { icon: { entity_index: 1, icon: numberIconTemplate } },
        },
        plus: {
          mode: 'content_text',
          content_text: { entity_index: 2, text: numberTextTemplate },
        },
        value: { entity_index: 3, show: { uom: numberStateTemplate } },
      },
    },
  }, numberHarness);
  number.updateRuntimeConfig();
  number.setState(numberHarness.entities[0], numberHarness.entityConfigs[0]);

  assert.equal(number.minusContentTool.entity_index, 1);
  assert.equal(number.minusContentTool.config.icon, 'mdi:minus');
  assert.equal(number.plusContentTool.entity_index, 2);
  assert.equal(number.plusContentTool.config.text[0].value, 'input_number.upper:80');
  assert.equal(number.valueStateTool.entity_index, 3);
  assert.deepEqual(numberContexts, [
    { kind: 'number-icon', index: 1, entity: 'input_number.lower', state: '20' },
    { kind: 'number-text', index: 2, entity: 'input_number.upper', state: '80' },
    { kind: 'number-state', index: 3, entity: 'sensor.override', state: 'idle' },
  ]);
  assert.equal(numberEvaluations.filter(({ javascript }) => javascript.includes('number-icon')).length, 1);
  assert.equal(numberEvaluations.filter(({ javascript }) => javascript.includes('number-text')).length, 1);
  assert.equal(numberEvaluations.filter(({ javascript }) => javascript.includes('number-state')).length, 1);
  assert.strictEqual(number.minusContentTool.runtime.entity, numberHarness.entities[1]);
  assert.strictEqual(number.minusContentTool.runtime.entityConfig, numberHarness.entityConfigs[1]);
  assert.strictEqual(number.plusContentTool.runtime.entity, numberHarness.entities[2]);
  assert.strictEqual(number.plusContentTool.runtime.entityConfig, numberHarness.entityConfigs[2]);
  assert.strictEqual(number.valueStateTool.runtime.entity, numberHarness.entities[3]);
  assert.strictEqual(number.valueStateTool.runtime.entityConfig, numberHarness.entityConfigs[3]);
  assert.equal(number.sourceConfig.content.content_horizontal.minus.content_icon.icon.icon, numberIconTemplate);
  assert.equal(number.sourceConfig.content.content_horizontal.plus.content_text.text, numberTextTemplate);
  assert.equal(number.sourceConfig.content.content_horizontal.value.show.uom, numberStateTemplate);
});
