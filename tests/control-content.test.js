import test from 'node:test';
import assert from 'node:assert/strict';
import ControlButton from '../src/control-button.js';
import ControlContent from '../src/control-content.js';
import ControlSelect from '../src/control-select.js';
import ControlTool from '../src/control-tool.js';

const createContext = () => ({
  templates: {
    hasJavascriptTemplates: () => false,
  },
  card: {
    entities: [{ entity_id: 'sensor.test', state: '', attributes: {} }],
    resolvedEntityConfigs: [{}],
    cardLayout: {
      changedGroupIds: new Set(),
      calculateSvgCoordinatesInGroup: (config) => ({
        xpos: config.xpos,
        ypos: config.ypos,
      }),
    },
    cardTheme: {
      modeChanged: false,
    },
    cardAnimations: {
      styles: {},
    },
  },
});

/** Builds three simple visual tools so layout and inheritance can be inspected directly. */
const createVerticalContent = () => {
  const { templates, card } = createContext();

  return new ControlContent(
    {
      padding: {
        x: 3,
        y: {
          top: 2,
          bottom: 4,
        },
      },
      gap: 3,
      items: [
        {
          id: 'top',
          type: 'line',
          length: 5,
        },
        {
          id: 'middle',
          type: 'circle',
          radius: 2,
          margin: {
            top: 2,
          },
        },
        {
          id: 'bottom',
          type: 'line',
          length: 5,
        },
      ],
    },
    'vertical',
    {
      xpos: 50,
      ypos: 50,
      width: 60,
      height: 30,
      group: 'controls',
    },
    {
      middle: {
        entity_index: 9,
        styles: {
          fill: 'red',
        },
      },
    },
    4,
    'test-content',
    templates,
    'card',
    card,
  );
};

test('centers every tool type in its equal content cell', () => {
  const content = createVerticalContent();
  const [top, middle, bottom] = content.childTools.map((child) => child.tool.config);

  assert.equal(top.xpos, 50);
  assert.equal(top.ypos, 40);
  assert.equal(top.yposc, 40);

  // The second cell is centered at 49; its top margin shifts the usable box to 50.
  assert.equal(middle.xpos, 50);
  assert.equal(middle.ypos, 50);
  assert.equal(middle.yposc, 50);

  assert.equal(bottom.xpos, 50);
  assert.equal(bottom.ypos, 58);
  assert.equal(bottom.yposc, 58);
});

test('inherits the segment entity and applies item overrides by id', () => {
  const content = createVerticalContent();
  const [top, middle, bottom] = content.childTools;

  assert.equal(top.tool.entity_index, 4);
  assert.equal(middle.tool.entity_index, 9);
  assert.equal(bottom.tool.entity_index, 4);
  assert.equal(middle.tool.config.styles.fill, 'red');

  content.childTools.forEach((child) => {
    assert.equal(child.tool.config.tap_action.action, 'none');
    assert.equal(child.tool.config.hold_action.action, 'none');
    assert.equal(child.tool.config.double_tap_action.action, 'none');
    assert.equal(child.tool.config.styles['pointer-events'], 'none');
  });
});

test('rejects duplicate ids and unsupported content types at the config boundary', () => {
  const { templates, card } = createContext();
  const createContent = (items) => new ControlContent(
    { padding: 0, gap: 0, items },
    'horizontal',
    {
      xpos: 50,
      ypos: 50,
      width: 20,
      height: 10,
      group: 'controls',
    },
    {},
    0,
    'invalid-content',
    templates,
    'card',
    card,
  );

  assert.throws(
    () => createContent([
      { id: 'same', type: 'line' },
      { id: 'same', type: 'circle' },
    ]),
    /Duplicate content item id/,
  );
  assert.throws(
    () => createContent([{ id: 'unknown', type: 'rectangle' }]),
    /Invalid content item type/,
  );
});
test('centers items across a horizontal content stack', () => {
  const { templates, card } = createContext();
  const content = new ControlContent(
    {
      padding: { x: 2, y: 1 },
      gap: 4,
      items: [
        { id: 'left', type: 'line', length: 5 },
        { id: 'right', type: 'line', length: 5 },
      ],
    },
    'horizontal',
    {
      xpos: 50,
      ypos: 50,
      width: 30,
      height: 10,
      group: 'controls',
    },
    {},
    0,
    'horizontal-content',
    templates,
    'card',
    card,
  );
  const [left, right] = content.childTools.map((child) => child.tool.config);

  assert.equal(left.xpos, 42.5);
  assert.equal(left.ypos, 50);
  assert.equal(right.xpos, 57.5);
  assert.equal(right.ypos, 50);
});

test('forwards the complete parent lifecycle to every child tool', () => {
  const content = createVerticalContent();
  const calls = [];
  const createTool = (id, requiresUpdate) => ({
    updateRuntimeConfig: () => calls.push(`${id}:runtime`),
    hassAvailable: () => calls.push(`${id}:hass`),
    connected: () => calls.push(`${id}:connected`),
    disconnected: () => calls.push(`${id}:disconnected`),
    hassConnected: () => calls.push(`${id}:reconnected`),
    firstUpdated: () => calls.push(`${id}:first`),
    updated: () => calls.push(`${id}:updated`),
    requiresHassUpdate: () => requiresUpdate,
  });

  content.childTools = [
    { tool: createTool('first', false) },
    { tool: createTool('second', true) },
  ];

  content.updateRuntimeConfig();
  content.hassAvailable();
  content.connected();
  content.disconnected();
  content.hassConnected();
  content.firstUpdated();
  content.updated();

  assert.equal(content.requiresHassUpdate(), true);
  assert.deepEqual(calls, [
    'first:runtime', 'second:runtime',
    'first:hass', 'second:hass',
    'first:connected', 'second:connected',
    'first:disconnected', 'second:disconnected',
    'first:reconnected', 'second:reconnected',
    'first:first', 'second:first',
    'first:updated', 'second:updated',
  ]);
});
test('button and select opt into explicit content without changing control entity ownership', () => {
  const { templates, card } = createContext();
  const button = new ControlButton(
    {
      id: 'visual-button',
      entity_index: 7,
      xpos: 50,
      ypos: 50,
      content: {
        mode: 'content_vertical',
        content_vertical: {
          items: [
            { id: 'value', type: 'state', styles: { 'font-size': '0.7em' } },
            { id: 'status', type: 'line', length: 4 },
          ],
        },
      },
    },
    0,
    templates,
    'card',
    card,
  );
  const select = new ControlSelect(
    {
      id: 'visual-select',
      entity_index: 0,
      xpos: 50,
      ypos: 50,
      width: 60,
      height: 20,
      option_map: [
        { value: 0, entity_index: 1 },
        { value: 1, entity_index: 2 },
      ],
      content: {
        mode: 'content_vertical',
        content_vertical: {
          items: [{ id: 'status', type: 'line', length: 4 }],
        },
      },
    },
    0,
    templates,
    'card',
    card,
  );

  assert.equal(button.entity_index, 7);
  assert.equal(button.contentVisual.childTools[0].tool.entity_index, 7);
  assert.equal(button.contentVisual.childTools[0].type, 'text');
  assert.equal(button.contentVisual.childTools[0].tool.config.styles['font-size'], '0.7em');
  assert.equal(button.contentVisual.childTools[0].tool.sourceTextParts[0].styles, undefined);
  assert.equal(select.entity_index, 0);
  assert.deepEqual(
    select.optionContentVisuals.map((content) => content.childTools[0].tool.entity_index),
    [1, 2],
  );
});

test('entityless button initializes literal content without an entity state', () => {
  const { templates, card } = createContext();
  const button = new ControlButton(
    {
      id: 'url-button',
      xpos: 50,
      ypos: 50,
      content: {
        mode: 'content_text',
        content_text: { text: 'Action' },
      },
      tap_action: { action: 'url', url_path: 'https://example.com' },
    },
    0,
    templates,
    'card',
    card,
  );

  button.updateRuntimeConfig();
  button.setStaticState();

  assert.equal(button.entity_index, undefined);
  assert.equal(button.active, false);
  assert.equal(button.contentTextTool.textParts[0].value, 'Action');
});

/**
 * Keeps the optional controls section absent and lets select own option filtering.
 */
test('control config compilation filters disabled select options without inventing controls', () => {
  const templates = {
    hasJavascriptTemplates: () => false,
  };
  const config = {
    layout: {
      controls: [
        {
          type: 'select',
          option_map: [
            { value: 0 },
            { value: 1, disabled: true },
            { value: 2, disabled: '1' },
          ],
        },
      ],
    },
  };

  ControlTool.compileConfig(config, templates);

  const configWithoutControls = { layout: {} };

  assert.deepEqual(config.layout.controls[0].option_map.map((option) => option.value), [0]);
  assert.deepEqual(ControlTool.setConfig(configWithoutControls, templates, 'card', {}), []);
  assert.equal(Object.hasOwn(configWithoutControls.layout, 'controls'), false);
});

test('select separates matching state, action value and translated presentation', () => {
  const { templates, card } = createContext();
  const select = new ControlSelect(
    {
      id: 'state-value-select',
      entity_index: 0,
      xpos: 50,
      ypos: 50,
      option_map: [
        {
          state: 'heating',
          value: 'heat',
          text: 'Verwarmen',
          action_data: { temperature: 21 },
          tap_action: {
            action: 'perform-action',
            perform_action: 'climate.set_hvac_mode',
            data: {
              hvac_mode: 'option(value)',
              temperature: 'option(action_data.temperature)',
            },
          },
          hold_action: {
            actions: [
              {
                action: 'perform-action',
                data: { mode: 'option(value)' },
              },
              {
                action: 'perform-action',
                data: { temperature: 'option(action_data.temperature)' },
              },
            ],
          },
        },
        { value: 'cool', text: 'Koelen' },
      ],
    },
    0,
    templates,
    'card',
    card,
  );

  select.setState(
    { entity_id: 'climate.room', state: 'heating', attributes: {} },
    {},
  );

  assert.equal(select.selectedOptionIndex, 0);
  assert.equal(select.config.option_map[0].text, 'Verwarmen');
  assert.equal(select.optionActionConfigs[0].tap_action.data.hvac_mode, 'heat');
  assert.equal(select.optionActionConfigs[0].tap_action.data.temperature, 21);
  assert.equal(select.optionActionConfigs[0].hold_action.actions[0].data.mode, 'heat');
  assert.equal(select.optionActionConfigs[0].hold_action.actions[1].data.temperature, 21);
  assert.equal(select.config.option_map[1].state, 'cool');
});

test('select builds and refreshes an omitted option_map from entity attributes', () => {
  const { templates, card } = createContext();
  const select = new ControlSelect(
    {
      id: 'entity-options-select',
      entity_index: 0,
      xpos: 50,
      ypos: 50,
    },
    0,
    templates,
    'card',
    card,
  );

  select.updateRuntimeConfig();
  select.setState(
    {
      entity_id: 'input_select.chart_type',
      state: 'area',
      attributes: { options: ['line', 'area', 'bar'] },
    },
    {},
  );

  assert.deepEqual(
    select.config.option_map.map(({ state, value, text }) => ({ state, value, text })),
    [
      { state: 'line', value: 'line', text: 'line' },
      { state: 'area', value: 'area', text: 'area' },
      { state: 'bar', value: 'bar', text: 'bar' },
    ],
  );
  assert.equal(select.selectedOptionIndex, 1);
  assert.equal(select.optionActionConfigs[2].tap_action.option, 'bar');
  const unchangedOptionTextTools = select.optionTextTools;

  select.setState(
    {
      entity_id: 'input_select.chart_type',
      state: 'bar',
      attributes: { options: ['line', 'area', 'bar'] },
    },
    {},
  );

  assert.equal(select.optionTextTools, unchangedOptionTextTools);

  select.setState(
    {
      entity_id: 'input_select.chart_type',
      state: 'dots',
      attributes: { options: ['line', 'dots'] },
    },
    {},
  );

  assert.deepEqual(select.config.option_map.map((option) => option.value), ['line', 'dots']);
  assert.equal(select.selectedOptionIndex, 1);
  assert.equal(select.optionTextTools.length, 2);
});

test('select matches a configured entity attribute and rejects invalid option references', () => {
  const { templates, card } = createContext();
  const select = new ControlSelect(
    {
      id: 'attribute-select',
      entity_index: 0,
      xpos: 50,
      ypos: 50,
      option_map: [
        { value: 'eco' },
        { value: 'comfort' },
      ],
    },
    0,
    templates,
    'card',
    card,
  );

  select.setState(
    {
      entity_id: 'climate.room',
      state: 'heat',
      attributes: { preset_mode: 'comfort' },
    },
    { attribute: 'preset_mode' },
  );

  assert.equal(select.selectedOptionIndex, 1);
  assert.throws(
    () => ControlSelect.buildOptionActionConfig({
      value: 'heat',
      tap_action: {
        action: 'perform-action',
        data: { mode: 'option(missing)' },
      },
    }),
    /not found/,
  );
});
