import assert from 'node:assert/strict';
import test from 'node:test';
import ArcTool from '../src/arc-tool.js';
import AreaTool from '../src/area-tool.js';
import BaseTool from '../src/base-tool.js';
import CardLayout from '../src/card-layout.js';
import CircleTool from '../src/circle-tool.js';
import ControlNumber from '../src/control-number.js';
import ConfigHelper from '../src/config-helper.js';
import IconTool from '../src/icon-tool.js';
import LineTool from '../src/line-tool.js';
import Merge from '../src/merge.js';
import NameTool from '../src/name-tool.js';
import PolygonTool from '../src/polygon-tool.js';
import RectangleTool from '../src/rectangle-tool.js';
import SparklineGraphTool from '../src/sparkline-graph-tool.js';
import StateTool from '../src/state-tool.js';
import Templates from '../src/templates.js';

/** Supplies the shared services touched by real tool constructors. */
function createToolCard() {
  return {
    cardLayout: {
      changedGroupIds: new Set(),
      calculateSvgCoordinatesInGroup: (item) => ({
        xpos: item.xpos * 2,
        ypos: item.ypos * 2,
      }),
      getGroupScaleTransform: () => '',
      getGroupScaleStyle: (_item, geometry) => geometry,
    },
    cardTheme: {
      modeChanged: false,
      getActiveColorStopMode: () => 'fixed',
    },
    cardAnimations: {
      styles: {
        arcs: {},
        circles: {},
        lines: {},
        rectangles: {},
        polygons: {},
        names: {},
        areas: {},
        states: {},
        icons: {},
      },
    },
    cardTools: {
      getItemWidth: (width) => width,
      getItemHeight: (height) => height,
      getItemGeometry: () => ({ xpos: 50, ypos: 50, width: 20, height: 10 }),
    },
    config: {},
    iconCache: { 'mdi:check': 'M 3 12 L 9 18 L 21 6' },
    iconBoundsCache: {},
    evaluateJavascriptTemplates: false,
    requestUpdates: 0,
    requestUpdate() {
      this.requestUpdates += 1;
    },
  };
}

test('simple tools keep derived SVG and polygon paths in geometry', () => {
  const templates = { hasJavascriptTemplates: () => false };
  const card = createToolCard();
  const tools = [
    new ArcTool({ id: 'arc', xpos: 30, ypos: 40 }, 0, templates, 'card', card),
    new CircleTool({ id: 'circle', xpos: 30, ypos: 40, radius: 6 }, 0, templates, 'card', card),
    new LineTool({
      id: 'line', animation_section: 'lines', xpos: 30, ypos: 40, length: 20,
    }, 0, templates, 'card', card),
    new RectangleTool({
      id: 'rectangle', xpos: 30, ypos: 40, width: 20, height: 12,
    }, 0, templates, 'card', card),
    new PolygonTool({
      id: 'polygon', xpos: 30, ypos: 40, sides: 5, width: 20, height: 12, radius: 0,
    }, 0, templates, 'card', card),
    new IconTool({ id: 'icon', xpos: 30, ypos: 40, icon: 'mdi:check' }, 0, templates, 'card', card),
  ];

  tools.forEach((tool) => {
    assert.ok(tool.geometry.svg, tool.constructor.name + ' exposes geometry.svg');
    assert.equal(Object.hasOwn(tool.config, 'svg'), false, tool.constructor.name + ' does not store derived config.svg');
  });

  const polygon = tools.find((tool) => tool instanceof PolygonTool);
  assert.ok(polygon.geometry.pathInput);
  assert.equal(typeof polygon.geometry.pathDefinition.d, 'string');
  assert.equal(Object.hasOwn(polygon.config, 'pathInput'), false);
  assert.equal(Object.hasOwn(polygon.config, 'pathDefinition'), false);

  const iconConfig = { id: 'layout-icon', xpos: 50, ypos: 50 };
  const layout = new CardLayout(templates, 'card');
  layout.setConfig({ layout: { groups: [], icons: [iconConfig] } });
  assert.equal(Object.hasOwn(iconConfig, 'svg'), false);
});

test('Name, Area and State separate runtime text from measured geometry', () => {
  const templates = { hasJavascriptTemplates: () => false };
  const card = createToolCard();
  const tools = [
    [new NameTool({ id: 'name', xpos: 20, ypos: 30 }, 0, templates, 'card', card), 'name'],
    [new AreaTool({ id: 'area', xpos: 20, ypos: 30 }, 0, templates, 'card', card), 'area'],
    [new StateTool({ id: 'state', xpos: 20, ypos: 30 }, 0, templates, 'card', card), 'state'],
  ];
  const geometryFields = [
    'svg',
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
  ];

  tools.forEach(([tool, runtimeField]) => {
    assert.ok(Object.hasOwn(tool.runtime, runtimeField));
    assert.ok(tool.geometry.svg);
    geometryFields.forEach((field) => assert.notEqual(tool.geometry[field], undefined, tool.constructor.name + '.' + field));
    assert.equal(Object.hasOwn(tool.config, 'svg'), false);
  });
  assert.ok(Object.hasOwn(tools[2][0].runtime, 'uom'));
});

test('BaseTool clones source before applying its explicit translator without subclass dispatch', () => {
  const templates = { hasJavascriptTemplates: () => false };
  const card = createToolCard();
  const config = { id: 'translated', group: 'room', xpos: 15 };
  const translationInputs = [];
  let translations = 0;
  let subclassDispatches = 0;
  const translateConfig = (candidate) => {
    translations += 1;
    translationInputs.push(structuredClone(candidate));
    return { ...candidate, translatedX: candidate.xpos + 5 };
  };
  class DerivedTool extends BaseTool {
    translateConfig() {
      subclassDispatches += 1;
    }
  }

  const tool = new DerivedTool(
    config,
    0,
    templates,
    'card',
    card,
    'rectangles',
    'rectangles',
    undefined,
    undefined,
    translateConfig,
  );

  assert.equal(translations, 1);
  assert.equal(subclassDispatches, 0);
  assert.strictEqual(tool.translateConfig, translateConfig);
  assert.deepEqual(translationInputs[0], tool.sourceConfig);
  assert.equal(tool.sourceConfig.translatedX, undefined);
  assert.equal(tool.config.translatedX, 20);

  tool.activeConfigInitialized = true;
  card.cardLayout.changedGroupIds.add('room');
  card.cardTheme.modeChanged = true;
  tool.updateRuntimeConfig();

  assert.equal(tool.groupChanged, true);
  assert.equal(tool.themeModeChanged, true);
  assert.equal(translations, 1);
  assert.equal(subclassDispatches, 0);
});

test('BaseTool translates only changed JavaScript candidates and retains equal config identity', () => {
  let xpos = 2;
  let evaluations = 0;
  let translations = 0;
  const templates = {
    hasJavascriptTemplates: () => true,
    getJsTemplateOrValue: (_item, source) => {
      evaluations += 1;
      return { ...structuredClone(source), xpos };
    },
  };
  const card = createToolCard();
  const source = { id: 'dynamic', xpos: '[[[ return value; ]]]' };
  const translateConfig = (candidate) => {
    translations += 1;
    return { ...candidate, translatedX: candidate.xpos * 10 };
  };
  const tool = new BaseTool(
    source,
    0,
    templates,
    'card',
    card,
    'rectangles',
    'rectangles',
    undefined,
    undefined,
    translateConfig,
  );
  const sourceConfigSnapshot = structuredClone(tool.sourceConfig);

  assert.equal(translations, 0);
  card.evaluateJavascriptTemplates = true;
  tool.updateRuntimeConfig();
  assert.equal(tool.config.xpos, 2);
  assert.equal(tool.config.translatedX, 20);
  assert.equal(translations, 1);
  const unchangedConfig = tool.config;

  tool.updateRuntimeConfig();
  assert.strictEqual(tool.config, unchangedConfig);
  assert.equal(translations, 1);

  card.evaluateJavascriptTemplates = false;
  card.cardLayout.changedGroupIds.add('card');
  card.cardTheme.modeChanged = true;
  tool.updateRuntimeConfig();
  assert.equal(translations, 1);

  card.cardLayout.changedGroupIds.clear();
  card.cardTheme.modeChanged = false;
  xpos = 3;
  card.evaluateJavascriptTemplates = true;
  tool.updateRuntimeConfig();
  assert.notStrictEqual(tool.config, unchangedConfig);
  assert.equal(tool.config.translatedX, 30);
  assert.equal(translations, 2);

  const changedConfig = tool.config;
  tool.updateRuntimeConfig();
  assert.strictEqual(tool.config, changedConfig);
  assert.equal(translations, 2);
  assert.deepEqual(tool.sourceConfig, sourceConfigSnapshot);
  assert.equal(tool.sourceConfig.xpos, '[[[ return value; ]]]');
  assert.ok(evaluations >= 4);
});

test('BaseTool group scale origin uses geometry while retaining the legacy SVG fallback', () => {
  const templates = { hasJavascriptTemplates: () => false };
  const card = createToolCard();
  let receivedGeometry;
  card.cardLayout.getGroupScaleStyle = (_item, geometry) => {
    receivedGeometry = geometry;
    return 'origin';
  };
  const tool = new BaseTool({
    id: 'origin',
    svg: { xpos: 10, ypos: 20 },
  }, 0, templates, 'card', card, 'rectangles');
  const geometry = { xpos: 70, ypos: 80 };
  tool.geometry = { svg: geometry };

  assert.equal(tool.getGroupScaleStyle(), 'origin');
  assert.strictEqual(receivedGeometry, geometry);

  delete tool.geometry;
  tool.getGroupScaleStyle();
  assert.strictEqual(receivedGeometry, tool.config.svg);
});

test('BaseTool uses complete parent-resolved paint styles without mutating configured styles', () => {
  const templates = { hasJavascriptTemplates: () => false };
  const card = createToolCard();
  card.cardAnimations.styles.rectangles.highlight = { stroke: 'animated' };
  const tool = new BaseTool({
    id: 'paint',
    animation_id: 'highlight',
    styles: { fill: 'configured', stroke: 'configured', 'font-size': '12px' },
  }, 0, templates, 'card', card, 'rectangles');
  const originalConfigStyles = structuredClone(tool.config.styles);

  // Controls resolve their visual state first, then child styles and transition.
  const parentStyles = Merge.mergeDeep(
    { fill: 'parent', stroke: 'paint', 'font-size': '20px', opacity: '0.7' },
    ConfigHelper.toStyleDict(tool.config.styles),
    { transition: 'fill 250ms ease' },
  );
  tool.setPaintStyles(parentStyles);
  assert.deepEqual(tool.getStyles({ fill: 'base', opacity: 1 }), {
    fill: 'configured',
    opacity: '0.7',
    stroke: 'animated',
    'font-size': '12px',
    transition: 'fill 250ms ease',
  });
  assert.deepEqual(tool.config.styles, originalConfigStyles);

  // A complete replacement may deliberately omit properties; the child does
  // not merge its configured styles back into that parent-owned result.
  tool.setPaintStyles({ stroke: 'paint', 'font-size': '20px' });
  assert.deepEqual(tool.getStyles({ fill: 'base', opacity: 1 }), {
    fill: 'base',
    opacity: 1,
    stroke: 'animated',
    'font-size': '20px',
  });
  assert.equal(card.requestUpdates, 0);

  tool.setPaintStyles(undefined);
  assert.deepEqual(tool.getStyles({ fill: 'base', opacity: 1 }), {
    fill: 'configured',
    opacity: 1,
    stroke: 'animated',
    'font-size': '12px',
  });
  assert.equal(tool.paint.styles, undefined);
  assert.deepEqual(tool.config.styles, originalConfigStyles);
  assert.equal(card.requestUpdates, 0);
});

test('Icon applies state-map styles after parent paint, then color stops and animation', () => {
  const templates = { hasJavascriptTemplates: () => false };
  const card = createToolCard();
  card.cardAnimations.styles.iconsIcon = {};
  card.cardAnimations.styles.icons.highlight = { opacity: '0.9', 'stroke-width': '7' };
  card.resolvedEntityConfigs = [{}];
  card.entities = [];
  let activeStop;
  card.cardEntities = { paint: { colorStops: [[]] }, getItemColorStop: () => activeStop };
  const tool = new IconTool({
    id: 'painted-icon',
    entity_index: 0,
    xpos: 50,
    ypos: 50,
    icon: 'mdi:check',
    animation_id: 'highlight',
    show: { item_style: 'colorstop' },
    colorstop: { fill: true, stroke: true },
    styles: { fill: '#1565c0', stroke: '#1565c0', 'stroke-width': '1' },
    state_map: { map: [{
      state: 'default',
      styles: { fill: '#d32f2f', color: '#d32f2f', opacity: '0.6', 'stroke-width': '3' },
    }] },
  }, 0, templates, 'card', card);
  tool.updateRuntimeConfig();
  const originalConfig = structuredClone(tool.config);
  const originalSource = structuredClone(tool.sourceConfig);
  const parentStyles = Merge.mergeDeep(
    { fill: '#43a047', stroke: '#43a047', opacity: '0.4', cursor: 'crosshair' },
    ConfigHelper.toStyleDict(tool.config.styles),
    { transition: 'fill 250ms ease' },
  );
  const parentSnapshot = structuredClone(parentStyles);
  let renderedStyles;
  // Capture the final dictionary at the render boundary. The real Icon render
  // and BaseTool color-stop/animation composition run; filters/layers stay out.
  tool.getRenderStyles = (styles) => {
    renderedStyles = styles;
    return styles;
  };
  tool.renderItemLayers = (content) => content;
  tool.actionHandler = () => undefined;

  tool.setPaintStyles(parentStyles);
  tool.render();
  assert.equal(renderedStyles.fill, '#d32f2f');
  assert.equal(renderedStyles.color, '#d32f2f');
  assert.equal(renderedStyles.stroke, '#1565c0');
  assert.equal(renderedStyles.opacity, '0.9');
  assert.equal(renderedStyles['stroke-width'], '7');
  assert.equal(renderedStyles.cursor, 'crosshair');
  assert.equal(renderedStyles.transition, 'fill 250ms ease');

  activeStop = { color: '#f9a825', styles: { opacity: '0.8', 'stroke-width': '5' } };
  tool.render();
  assert.equal(renderedStyles.fill, '#f9a825');
  assert.equal(renderedStyles.color, '#f9a825');
  assert.equal(renderedStyles.stroke, '#f9a825');
  assert.equal(renderedStyles.opacity, '0.9');
  assert.equal(renderedStyles['stroke-width'], '7');

  // Without a selected map, the complete parent dictionary remains authoritative.
  activeStop = undefined;
  tool.runtime.stateMapItem = undefined;
  tool.render();
  assert.equal(renderedStyles.fill, '#1565c0');
  assert.equal(renderedStyles.opacity, '0.9');
  assert.equal(renderedStyles.cursor, 'crosshair');

  tool.setStaticState();
  tool.setPaintStyles(undefined);
  tool.render();
  assert.equal(renderedStyles.fill, '#d32f2f');
  assert.equal(renderedStyles.color, '#d32f2f');
  assert.equal(renderedStyles.cursor, undefined);
  assert.equal(renderedStyles.transition, undefined);
  assert.deepEqual(tool.config, originalConfig);
  assert.deepEqual(tool.sourceConfig, originalSource);
  assert.deepEqual(parentStyles, parentSnapshot);
});

test('reapplying identical measured-text paint does not invalidate exact geometry', () => {
  const templates = { hasJavascriptTemplates: () => false };
  const card = createToolCard();
  const tool = new NameTool({ id: 'name', xpos: 50, ypos: 50 }, 0, templates, 'card', card);
  const styles = { 'font-size': '1.25em', fill: '#123456' };
  tool.runtime.name = 'Stable label';
  tool.setPaintStyles(styles);
  tool.geometry.hasExactMeasurement = true;
  const signature = tool.geometry.textMeasurementSignature;

  tool.setPaintStyles(structuredClone(styles));

  assert.equal(tool.geometry.textMeasurementSignature, signature);
  assert.equal(tool.geometry.hasExactMeasurement, true);
  assert.equal(card.requestUpdates, 0);
});

test('Arc templates see default or explicit radius and equal evaluations retain config identity', () => {
  const templates = new Templates([]);
  templates.beginConfig({ entities: [], constants: {} });
  templates.setHass({
    states: { 'sensor.radius': { state: '2' } },
    user: {},
  });
  const card = createToolCard();
  card.evaluateJavascriptTemplates = true;
  const radiusExpression = '[[[ return item.radius * Number(states["sensor.radius"].state); ]]]';
  const omittedInput = { id: 'omitted-radius', xpos: 50, ypos: 50, rotate: radiusExpression };
  const explicitInput = { id: 'explicit-radius', xpos: 50, ypos: 50, radius: 23, rotate: radiusExpression };
  const omittedSnapshot = structuredClone(omittedInput);
  const explicitSnapshot = structuredClone(explicitInput);
  const omittedArc = new ArcTool(omittedInput, 0, templates, 'card', card);
  const explicitArc = new ArcTool(explicitInput, 1, templates, 'card', card);
  const omittedSourceSnapshot = structuredClone(omittedArc.sourceConfig);
  const explicitSourceSnapshot = structuredClone(explicitArc.sourceConfig);

  omittedArc.updateRuntimeConfig();
  explicitArc.updateRuntimeConfig();

  assert.equal(omittedArc.sourceConfig.radius, 45);
  assert.equal(omittedArc.config.rotate, 90);
  assert.equal(omittedArc.geometry.svg.radius, 90);
  assert.equal(explicitArc.sourceConfig.radius, 23);
  assert.equal(explicitArc.config.rotate, 46);
  assert.equal(explicitArc.geometry.svg.radius, 46);
  assert.equal(Object.hasOwn(omittedArc.config, 'svg'), false);

  const unchangedConfig = omittedArc.config;
  omittedArc.updateRuntimeConfig();
  assert.strictEqual(omittedArc.config, unchangedConfig);

  templates.setHass({
    states: { 'sensor.radius': { state: '3' } },
    user: {},
  });
  omittedArc.updateRuntimeConfig();
  assert.notStrictEqual(omittedArc.config, unchangedConfig);
  assert.equal(omittedArc.config.rotate, 135);
  assert.deepEqual(omittedInput, omittedSnapshot);
  assert.deepEqual(explicitInput, explicitSnapshot);
  assert.deepEqual(omittedArc.sourceConfig, omittedSourceSnapshot);
  assert.deepEqual(explicitArc.sourceConfig, explicitSourceSnapshot);
  assert.equal(omittedArc.sourceConfig.rotate, radiusExpression);
  assert.equal(explicitArc.sourceConfig.rotate, radiusExpression);
});

test('Sparkline tooltip formatters consume StateTool runtime value and unit', () => {
  const entity = {
    entity_id: 'sensor.pressure',
    state: '12.34',
    attributes: { unit_of_measurement: 'kPa' },
  };
  const entityConfig = { entity: 'sensor.pressure' };
  const card = {
    entities: [entity],
    resolvedEntityConfigs: [entityConfig],
    _hass: {
      locale: { language: 'en-US' },
      localize: (key) => (key.endsWith('.mean') ? 'mean' : 'maximum'),
      formatEntityStateToParts: (sourceEntity, value) => [
        { type: 'value', value },
        { type: 'unit', value: sourceEntity.attributes.unit_of_measurement },
      ],
    },
  };
  const tool = Object.create(SparklineGraphTool.prototype);
  tool.card = card;
  tool.entity_index = 0;

  assert.deepEqual(tool.formatTooltipStat('avg', 5.678), {
    label: 'Mean',
    value: '5.68',
    uom: 'kPa',
  });
  assert.deepEqual(tool.formatTooltipStat('max', undefined), {
    label: 'Maximum',
    value: '',
    uom: '',
  });
  assert.deepEqual(tool.formatSeriesTooltipValue({
    entity,
    entityConfig: { ...entityConfig, unit: 'mbar' },
  }, 1.234), {
    value: '1.23',
    uom: 'mbar',
  });
});

test('ControlNumber render centers its StateTool value from measured geometry', () => {
  const control = Object.create(ControlNumber.prototype);
  const background = { radius: 0, styles: {} };
  const valueStateTool = {
    config: { svg: { xpos: 5, ypos: 6 } },
    geometry: {
      svg: { xpos: 105, ypos: 115 },
      hasExactMeasurement: true,
      measuredXpos: 70,
      measuredYpos: 80,
      measuredWidth: 40,
      measuredHeight: 10,
    },
    render: () => '',
  };

  Object.assign(control, {
    config: {
      width: 60,
      height: 30,
      xpos: 50,
      ypos: 50,
      background,
      content: {
        mode: 'active',
        active: {
          value: { size: 100 },
          minus: { background },
          plus: { background },
        },
      },
    },
    geometry: {
      svg: { xpos: 100, ypos: 100 },
      buttonSize: 10,
      valueWidth: 30,
      valueHeight: 20,
      minusCenterX: 20,
      minusCenterY: 50,
      plusCenterX: 80,
      plusCenterY: 50,
    },
    card: {
      cardLayout: {
        calculateSvgCoordinatesInGroup: (item) => ({
          xpos: item.xpos * 2,
          ypos: item.ypos * 2,
        }),
      },
    },
    valueStateTool,
    minusContentTool: { render: () => '' },
    plusContentTool: { render: () => '' },
    runtime: { minusActionConfig: {}, plusActionConfig: {} },
    entity_index: 0,
    getStyles: (styles) => styles,
    getGroupScaleTransform: () => '',
    getGroupScaleStyle: () => '',
    renderControl: (content) => content,
    controlActionHandler: () => undefined,
    handleControlAction() {},
  });

  const rendered = control.render();
  const valueTransform = rendered.values.find(
    (value) => typeof value === 'string' && value.includes('translate(105 115)'),
  );

  assert.equal(valueTransform, 'translate(105 115) scale(0.75) translate(-70 -80)');
});
