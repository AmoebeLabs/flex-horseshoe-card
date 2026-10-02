import test from 'node:test';
import assert from 'node:assert/strict';
import ControlBase from '../src/control-base.js';
import ControlToggle from '../src/control-toggle.js';
import Templates from '../src/templates.js';

const createContext = () => {
  let groupXOffset = 0;
  let colorMode = 'light';
  const card = {
    config: {},
    cardLayout: {
      changedGroupIds: new Set(),
      calculateSvgCoordinatesInGroup: (config) => ({
        xpos: config.xpos + (config.group === 'room' ? groupXOffset : 0),
        ypos: config.ypos,
      }),
      groupManager: {
        getGroupChainForItem: () => [],
      },
      masksClips: {
        applyGradientRefs: (styles) => styles,
      },
    },
    cardTheme: {
      modeChanged: false,
      colorContext: { cacheReady: false },
      getActiveColorStopMode: () => colorMode,
    },
    cardAnimations: {
      styles: {
        controls: {},
        iconsIcon: {},
      },
    },
    evaluateJavascriptTemplates: false,
  };

  return {
    card,
    setGroupXOffset: (value) => { groupXOffset = value; },
    setColorMode: (value) => { colorMode = value; },
  };
};

const createToggleConfig = (icon) => ({
  id: 'light-toggle',
  entity_index: 0,
  group: 'room',
  xpos: 50,
  ypos: 50,
  width: 40,
  content: {
    mode: 'content_icon',
    content_icon: {
      size: 75,
      icon: {
        icon,
      },
    },
  },
});

const createStaticTemplates = () => ({ hasJavascriptTemplates: () => false });

test('Toggle static and valid JavaScript config produce equivalent active presets', () => {
  const staticContext = createContext();
  const javascriptContext = createContext();
  const staticToggle = new ControlToggle(
    createToggleConfig('mdi:lightbulb'),
    0,
    createStaticTemplates(),
    'test-card',
    staticContext.card,
  );
  const javascriptTemplates = new Templates([]);
  javascriptTemplates.beginConfig({
    constants: { toggleIcon: 'mdi:lightbulb' },
    entities: [{ entity: 'switch.test' }],
  });
  javascriptContext.card.evaluateJavascriptTemplates = true;
  const javascriptToggle = new ControlToggle(
    createToggleConfig('[[[ return constants.toggleIcon; ]]]'),
    0,
    javascriptTemplates,
    'test-card',
    javascriptContext.card,
  );

  staticToggle.updateRuntimeConfig();
  javascriptToggle.updateRuntimeConfig();

  assert.equal(javascriptToggle.hasJavascript, true);
  assert.equal(javascriptToggle.config.content.content_icon.icon.icon, 'mdi:lightbulb');
  assert.equal(javascriptToggle.iconTool.config.icon, staticToggle.iconTool.config.icon);
  assert.deepEqual(javascriptToggle.config.ha.on, staticToggle.config.ha.on);
  assert.deepEqual(javascriptToggle.config.ha.off, staticToggle.config.ha.off);
  assert.deepEqual(javascriptToggle.config.svg, staticToggle.config.svg);

  javascriptToggle.hassAvailable();
  javascriptToggle.connected();
  const oldIconTool = javascriptToggle.iconTool;
  javascriptTemplates.context.config.constants.toggleIcon = 'mdi:flash';
  javascriptContext.card.evaluateJavascriptTemplates = true;
  javascriptToggle.updateRuntimeConfig();

  assert.equal(javascriptToggle.configurationChanged, true);
  assert.notStrictEqual(javascriptToggle.iconTool, oldIconTool);
  assert.equal(oldIconTool.iconClosed, true);
  assert.equal(oldIconTool.haIconPath.sourceClosed, true);
  assert.equal(javascriptToggle.iconTool.config.icon, 'mdi:flash');
  assert.equal(javascriptToggle.iconTool.iconClosed, false);
  assert.equal(javascriptToggle.iconTool.haIconPath.sourceClosed, false);

  const entity = { entity_id: 'switch.test', state: 'on', attributes: {} };
  javascriptToggle.setState(entity, { entity: 'switch.test' });
  assert.strictEqual(javascriptToggle.iconTool.runtime.entity, entity);
});

test('Toggle group and theme refreshes retain geometry, presentation, and nested child forwarding', () => {
  const templates = createStaticTemplates();
  const context = createContext();
  const toggle = new ControlToggle(createToggleConfig('mdi:lightbulb'), 0, templates, 'test-card', context.card);
  const entity = { entity_id: 'switch.test', state: 'off', attributes: {} };

  toggle.updateRuntimeConfig();
  toggle.setState(entity, { entity: 'switch.test' });
  toggle.hassAvailable();
  toggle.connected();
  assert.equal(toggle.hasPresentationChanged(), true);
  assert.equal(toggle.hasPresentationChanged(), false);

  const initialX = toggle.config.svg.x;
  context.setGroupXOffset(18);
  context.card.cardLayout.changedGroupIds.add('room');
  toggle.updateRuntimeConfig();

  assert.equal(toggle.configurationChanged, false);
  assert.equal(toggle.groupChanged, true);
  assert.equal(toggle.themeModeChanged, false);
  assert.equal(toggle.config.svg.x, initialX + 18);
  toggle.setState(entity, { entity: 'switch.test' });
  assert.strictEqual(toggle.iconTool.runtime.entity, entity);
  assert.equal(toggle.iconTool.iconClosed, false);
  assert.equal(toggle.iconTool.haIconPath.sourceClosed, false);
  toggle.iconTool.requiresHassUpdate = () => true;
  assert.equal(toggle.requiresHassUpdate(), true);
  assert.equal(toggle.hasPresentationChanged(), true);
  assert.equal(toggle.hasPresentationChanged(), false);

  const groupRefreshedSvg = structuredClone(toggle.config.svg);
  context.card.cardLayout.changedGroupIds.clear();
  context.setColorMode('dark');
  context.card.cardTheme.modeChanged = true;
  const iconBeforeThemeRefresh = toggle.iconTool;
  const forwardedIconUpdates = [];
  const updateIconRuntimeConfig = iconBeforeThemeRefresh.updateRuntimeConfig;
  iconBeforeThemeRefresh.updateRuntimeConfig = function updateRuntimeConfigSpy() {
    forwardedIconUpdates.push(this);
    return updateIconRuntimeConfig.call(this);
  };
  toggle.updateRuntimeConfig();

  assert.equal(toggle.configurationChanged, false);
  assert.equal(toggle.groupChanged, false);
  assert.equal(toggle.themeModeChanged, true);
  assert.strictEqual(toggle.iconTool, iconBeforeThemeRefresh);
  assert.equal(forwardedIconUpdates.length, 1);
  assert.strictEqual(forwardedIconUpdates[0], iconBeforeThemeRefresh);
  assert.deepEqual(toggle.config.svg, groupRefreshedSvg);
  toggle.setState(entity, { entity: 'switch.test' });
  assert.strictEqual(toggle.iconTool.runtime.entity, entity);
  assert.equal(toggle.iconTool.iconClosed, false);
  assert.equal(toggle.iconTool.haIconPath.sourceClosed, false);
  assert.equal(toggle.hasPresentationChanged(), true);
  assert.equal(toggle.hasPresentationChanged(), false);

  toggle.disconnected();
  assert.equal(toggle.iconTool.iconClosed, true);
  assert.equal(toggle.iconTool.haIconPath.sourceClosed, true);
});

test('Toggle retains its label and forwards one theme-only runtime update', () => {
  const context = createContext();
  const config = createToggleConfig('mdi:lightbulb');
  config.label = { text: 'Light' };
  const toggle = new ControlToggle(config, 0, createStaticTemplates(), 'test-card', context.card);

  toggle.updateRuntimeConfig();
  const labelBeforeThemeRefresh = toggle.labelTextTool;
  const forwardedLabels = [];
  const updateLabelRuntimeConfig = labelBeforeThemeRefresh.updateRuntimeConfig;
  labelBeforeThemeRefresh.updateRuntimeConfig = function updateRuntimeConfigSpy() {
    forwardedLabels.push(this);
    return updateLabelRuntimeConfig.call(this);
  };

  context.card.cardTheme.modeChanged = true;
  toggle.updateRuntimeConfig();

  assert.equal(toggle.configurationChanged, false);
  assert.equal(toggle.groupChanged, false);
  assert.equal(toggle.themeModeChanged, true);
  assert.strictEqual(toggle.labelTextTool, labelBeforeThemeRefresh);
  assert.equal(forwardedLabels.length, 1);
  assert.strictEqual(forwardedLabels[0], labelBeforeThemeRefresh);
});

test('ControlBase revalidates invalid static visibility on repeated runtime updates', () => {
  const context = createContext();
  const control = new ControlBase(
    { id: 'invalid-visibility', visibility: 'collapsed' },
    0,
    createStaticTemplates(),
    'test-card',
    context.card,
  );

  assert.throws(() => control.updateRuntimeConfig(), /Invalid visibility 'collapsed'/);
  assert.throws(() => control.updateRuntimeConfig(), /Invalid visibility 'collapsed'/);
});
