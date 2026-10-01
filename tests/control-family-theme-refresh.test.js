import test from 'node:test';
import assert from 'node:assert/strict';
import ControlButton from '../src/control-button.js';
import ControlNumber from '../src/control-number.js';
import ControlSelect from '../src/control-select.js';
import ControlSlider from '../src/control-slider.js';
import CardLayout from '../src/card-layout.js';

const CONTROL_FAMILIES = [
  {
    name: 'button',
    Tool: ControlButton,
    config: {
      content: {
        mode: 'content_text',
        content_text: { text: 'Run' },
      },
    },
  },
  { name: 'number', Tool: ControlNumber, config: {} },
  {
    name: 'select',
    Tool: ControlSelect,
    config: { option_map: [{ value: 'off' }, { value: 'on' }] },
  },
  {
    name: 'slider',
    Tool: ControlSlider,
    config: { entity_index: 0, scale: { min: 0, max: 100, step: 1 } },
  },
];

const createControlContext = () => {
  const groupPosition = { xpos: 50, ypos: 50 };
  const templates = {
    hasJavascriptTemplates: (config) => config.dynamic === true,
    getJsTemplateOrValue: (config) => ({ ...config, ...groupPosition }),
  };
  const cardLayout = new CardLayout(templates, 'card');
  cardLayout.setConfig({
    layout: {
      groups: [{ id: 'room', ...groupPosition, dynamic: true }],
    },
  });
  const card = {
    cardLayout,
    cardTheme: { modeChanged: false, colorContext: { cacheReady: false } },
    cardAnimations: { styles: {} },
  };

  return { card, templates, groupPosition };
};

const createControl = (family, card, templates) => new family.Tool(
  {
    id: `${family.name}-refresh`,
    group: 'room',
    xpos: 40,
    ypos: 35,
    ...family.config,
  },
  0,
  templates,
  'card',
  card,
);

const captureGeometry = (control) => ({
  control: structuredClone(control.config.svg),
  children: control.getContentTools().map((tool) => structuredClone(tool.geometry ? tool.geometry.svg : tool.config.svg)),
});

for (const family of CONTROL_FAMILIES) {
  test(`${family.name} preserves child tools and geometry on theme-only refresh while forwarding updates`, () => {
    const { card, templates } = createControlContext();
    const control = createControl(family, card, templates);
    control.updateRuntimeConfig();

    const childTools = control.getContentTools();
    const geometry = captureGeometry(control);
    const updatedChildren = [];
    childTools.forEach((tool) => {
      const updateRuntimeConfig = tool.updateRuntimeConfig.bind(tool);
      tool.updateRuntimeConfig = (...args) => {
        updatedChildren.push(tool);
        return updateRuntimeConfig(...args);
      };
    });

    card.cardTheme.modeChanged = true;
    control.updateRuntimeConfig();

    const refreshedChildren = control.getContentTools();
    assert.equal(refreshedChildren.length, childTools.length);
    childTools.forEach((tool, index) => {
      assert.strictEqual(refreshedChildren[index], tool);
      assert.strictEqual(updatedChildren[index], tool);
    });
    assert.equal(updatedChildren.length, childTools.length);
    assert.deepEqual(captureGeometry(control), geometry);
  });

  test(`${family.name} rebuilds and repositions child tools on group geometry change`, () => {
    const { card, templates, groupPosition } = createControlContext();
    const control = createControl(family, card, templates);
    control.updateRuntimeConfig();

    const previousChildren = control.getContentTools();
    const previousGeometry = captureGeometry(control);
    groupPosition.xpos = 65;
    groupPosition.ypos = 37;
    card.cardLayout.updateGroups(true);
    assert.equal(card.cardLayout.changedGroupIds.has('room'), true);
    control.updateRuntimeConfig();

    const refreshedChildren = control.getContentTools();
    assert.equal(refreshedChildren.length, previousChildren.length);
    refreshedChildren.forEach((tool, index) => {
      assert.notStrictEqual(tool, previousChildren[index]);
      const svg = tool.geometry ? tool.geometry.svg : tool.config.svg;
      assert.notEqual(svg.xpos, previousGeometry.children[index].xpos);
      assert.notEqual(svg.ypos, previousGeometry.children[index].ypos);
    });
    assert.notEqual(control.config.svg.xpos, previousGeometry.control.xpos);
    assert.notEqual(control.config.svg.ypos, previousGeometry.control.ypos);
  });
}
