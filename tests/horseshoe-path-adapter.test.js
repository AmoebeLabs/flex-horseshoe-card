import assert from 'node:assert/strict';
import test from 'node:test';

import HorseshoeGauge from '../src/horseshoe-gauge.js';

function createCard() {
  const group = { id: 'card', xpos: 50, ypos: 50 };

  return {
    cardLayout: {
      changedGroupIds: new Set(),
      groupManager: {
        getGroupForItem: () => group,
        getGroupChainForItem: () => [],
        isItemVisible: () => true,
      },
      masksClips: { applyGradientRefs: (styles) => styles },
      getGroupScaleTransform: () => '',
      getGroupScaleStyle: () => '',
    },
    cardTheme: {
      modeChanged: false,
      getActiveColorStopMode: () => 'light',
    },
    cardAnimations: { styles: { horseshoes: {} } },
    actions: { getActionHandlerOptions: () => ({}), handleAction: () => {} },
    _hass: {
      formatEntityState: (_entity, state) => `State ${state}`,
      formatEntityAttributeValue: (_entity, _attribute, state) => `Attribute ${state}`,
    },
    requestUpdate: () => {},
    config: {},
  };
}

function createTemplates() {
  return {
    hasJavascriptTemplates: () => false,
  };
}

function createConfig(path) {
  return {
    layout: {
      horseshoes: [{
        entity_index: 0,
        xpos: 50,
        ypos: 50,
        path,
        horseshoe_scale: { min: 0, max: 100 },
      }],
    },
  };
}

function bindMeasuredHorizontalPath(horseshoe, startX, y, length) {
  horseshoe.pathGeometry.bindPathElement({
    getTotalLength: () => length,
    getPointAtLength: (distance) => ({ x: startX + distance, y }),
  });
}

test('normal horseshoe configuration enters the path-engine implementation', () => {
  const card = createCard();
  const config = createConfig({ type: 'arc', radius: 40, arc_degrees: 270 });

  assert.equal(HorseshoeGauge.setConfig(config, createTemplates(), 'card', card).length, 1);
});

test('committed path elements are found when the generated card id starts with a digit', () => {
  const card = createCard();
  const requestedIds = [];
  card.shadowRoot = {
    getElementById: (id) => {
      requestedIds.push(id);
      return id.endsWith('-master')
        ? {
            getTotalLength: () => 100,
            getPointAtLength: (distance) => ({ x: distance, y: 0 }),
          }
        : {};
    },
  };
  const [horseshoe] = HorseshoeGauge.setConfig(
    createConfig({ type: 'arc', radius: 40, arc_degrees: 270 }),
    createTemplates(),
    '4tcnsjaa0',
    card,
  );

  horseshoe.updateRuntimeConfig();
  horseshoe.updated();

  assert.deepEqual(requestedIds, [
    '4tcnsjaa0-horseshoe-0-master',
    '4tcnsjaa0-horseshoe-0-state',
  ]);
});

test('original root fields and the horseshoes_v2 alias enter the same gauge implementation', () => {
  const rootConfig = {
    entity_index: 0,
    xpos: 50,
    ypos: 50,
    radius: 40,
    horseshoe_scale: { min: 0, max: 100 },
    layout: {},
  };
  const aliasConfig = {
    layout: {
      horseshoes_v2: [{
        entity_index: 0,
        xpos: 50,
        ypos: 50,
        radius: 40,
        horseshoe_scale: { min: 0, max: 100 },
      }],
    },
  };

  assert.equal(HorseshoeGauge.setConfig(rootConfig, createTemplates(), 'card', createCard()).length, 1);
  assert.equal(HorseshoeGauge.setConfig(aliasConfig, createTemplates(), 'card', createCard()).length, 1);
});

test('legacy scale tickmarks enter the path engine through the shared configuration conversion', () => {
  const card = createCard();
  const config = createConfig({ type: 'arc', radius: 40, arc_degrees: 270 });
  Object.assign(config.layout.horseshoes[0], {
    radius: 40,
    tickmarks_radius: 38,
    show: { scale_tickmarks: true },
    horseshoe_scale: { min: 0, max: 100, ticksize: 10, width: 6, color: '#333333' },
  });

  const [horseshoe] = HorseshoeGauge.setConfig(config, createTemplates(), 'card', card);
  horseshoe.updateRuntimeConfig();

  assert.equal(horseshoe.config.show.tickmarks, true);
  assert.equal(horseshoe.config.horseshoe_tickmarks.ticks_major.ticksize, 10);
  assert.equal(horseshoe.config.horseshoe_tickmarks.ticks_major.offset, -2);
});

test('existing arc fields become one complete path contract and retain a true 360 degree ring', () => {
  const card = createCard();
  const config = {
    layout: {
      horseshoes: [{
        entity_index: 0,
        xpos: 50,
        ypos: 50,
        radius: 40,
        arc_degrees: 360,
        start_angle: -90,
        horseshoe_scale: { min: 0, max: 100 },
      }],
    },
  };
  const [horseshoe] = HorseshoeGauge.setConfig(config, createTemplates(), 'card', card);

  horseshoe.updateRuntimeConfig();

  assert.deepEqual(horseshoe.pathContract, {
    type: 'arc',
    cx: 100,
    cy: 100,
    radiusX: 80,
    radiusY: 80,
    startAngle: -90,
    arcDegrees: 360,
  });
  assert.equal(horseshoe.pathDefinition.closed, true);
});

test('all frozen path shapes normalize percentage config into complete generator contracts', () => {
  const cases = [
    {
      path: { type: 'arc', radius_x: 40, radius_y: 30, start_angle: -90, arc_degrees: 270 },
      expected: { type: 'arc', cx: 100, cy: 100, radiusX: 80, radiusY: 60, startAngle: -90, arcDegrees: 270 },
    },
    {
      path: { type: 'line', length: 80, angle: 0 },
      expected: { type: 'line', x1: 20, y1: 100, x2: 180, y2: 100 },
    },
    {
      path: { type: 'rectangle', width: 80, height: 60, radius: 5, start: 'right', direction: 'counterclockwise' },
      expected: {
        type: 'rectangle', x: 20, y: 40, width: 160, height: 120,
        radiusTopLeft: 10, radiusTopRight: 10, radiusBottomRight: 10, radiusBottomLeft: 10,
        start: 'right', direction: 'counterclockwise',
      },
    },
    {
      path: { type: 'wave', length: 80, angle: 0, waves: 4, amplitude: 6 },
      expected: { type: 'wave', x1: 20, y1: 100, x2: 180, y2: 100, waves: 4, amplitude: 12 },
    },
    {
      path: { type: 'spiral', radius_inner: 5, radius_outer: 40, start_angle: -90, degrees: 720, points: 64 },
      expected: { type: 'spiral', cx: 100, cy: 100, radiusInner: 10, radiusOuter: 80, startAngle: -90, degrees: 720, points: 64 },
    },
    {
      path: { type: 'infinity', radius_x: 40, radius_y: 25 },
      expected: { type: 'infinity', cx: 100, cy: 100, radiusX: 80, radiusY: 50 },
    },
  ];

  cases.forEach(({ path, expected }) => {
    const card = createCard();
    const [horseshoe] = HorseshoeGauge.setConfig(createConfig(path), createTemplates(), 'card', card);

    horseshoe.updateRuntimeConfig();

    assert.deepEqual(horseshoe.pathContract, expected);
    assert.equal(typeof horseshoe.pathDefinition.d, 'string');
    assert.ok(horseshoe.pathDefinition.d.startsWith('M '));
  });
});

test('fixed linear mode maps entity state to the same normalized progress for every shape', () => {
  const card = createCard();
  const [horseshoe] = HorseshoeGauge.setConfig(
    createConfig({ type: 'wave', length: 80, angle: 0, waves: 3, amplitude: 8 }),
    createTemplates(),
    'card',
    card,
  );

  horseshoe.updateRuntimeConfig();
  horseshoe.setState({ entity_id: 'sensor.load', state: '25', attributes: {} }, {});

  assert.equal(horseshoe.renderContract.stateRanges.length, 1);
  assert.equal(horseshoe.renderContract.stateRanges[0].start, 0);
  assert.equal(horseshoe.renderContract.stateRanges[0].end, 25);
  assert.equal(horseshoe.renderContract.stateRanges[0].width, 12);
  assert.equal(horseshoe.renderContract.backgroundRange.width, 6);

  horseshoe.updateRuntimeConfig();
  horseshoe.setState({ entity_id: 'sensor.load', state: '75', attributes: {} }, {});
  assert.equal(horseshoe.renderContract.stateRanges[0].end, 75);
});

test('invalid path shape values fail at the adapter boundary', () => {
  const invalidConfigs = [
    createConfig({ type: 'unknown' }),
    createConfig({ type: 'arc', radius: 0 }),
    createConfig({ type: 'rectangle', width: 80, height: 60, radius: 0, start: 'corner' }),
  ];
  invalidConfigs.forEach((config) => {
    const card = createCard();
    const [horseshoe] = HorseshoeGauge.setConfig(config, createTemplates(), 'card', card);

    assert.throws(() => horseshoe.updateRuntimeConfig(), /\[horseshoes\]/);
  });
});

test('normal, bidirectional, and absolute bars produce path-independent state ranges', () => {
  const cases = [
    { barMode: 'normal', min: 0, max: 100, state: '25', expected: [0, 25] },
    { barMode: 'bidirectional', min: -100, max: 100, state: '-50', expected: [25, 50] },
    { barMode: 'absolute', min: -100, max: 100, state: '-50', expected: [0, 50] },
  ];

  cases.forEach(({ barMode, min, max, state, expected }) => {
    const config = createConfig({ type: 'wave', length: 80, waves: 3, amplitude: 8 });
    Object.assign(config.layout.horseshoes[0], {
      bar_mode: barMode,
      horseshoe_scale: { min, max },
    });
    const [horseshoe] = HorseshoeGauge.setConfig(config, createTemplates(), 'card', createCard());

    horseshoe.updateRuntimeConfig();
    horseshoe.setState({ entity_id: 'sensor.load', state, attributes: {} }, {});

    assert.deepEqual(
      [horseshoe.renderContract.stateRanges[0].start, horseshoe.renderContract.stateRanges[0].end],
      expected,
    );
  });
});

test('absolute labels and ticks follow the signed scale branch occupying the complete path', () => {
  const config = createConfig({ type: 'line', length: 80 });
  Object.assign(config.layout.horseshoes[0], {
    bar_mode: 'absolute',
    show: {
      labels_at: 'ticks_major',
      tickmarks: { major: true, minor: false },
    },
    horseshoe_scale: { min: -10, max: 40 },
    horseshoe_tickmarks: {
      ticks_major: { ticksize: 5, width: 6, thickness: 2, offset: 0, styles: { fill: '#ffffff' } },
    },
    horseshoe_labels: { orientation: 'horizontal', offset: 12 },
  });
  const [horseshoe] = HorseshoeGauge.setConfig(config, createTemplates(), 'card', createCard());

  horseshoe.updateRuntimeConfig();
  horseshoe.setState({ entity_id: 'sensor.load', state: '-5', attributes: {} }, {});
  bindMeasuredHorizontalPath(horseshoe, 20, 100, 160);
  horseshoe.buildMeasuredGradientContracts();

  assert.deepEqual(horseshoe.pathElements.ticks.map((tick) => tick.progress), [0, 50, 100]);
  assert.deepEqual(horseshoe.pathElements.labels.map((label) => label.text), ['0', '5', '10']);

  horseshoe.setState({ entity_id: 'sensor.load', state: '5', attributes: {} }, {});
  horseshoe.buildMeasuredGradientContracts();

  assert.equal(horseshoe.pathElements.ticks.length, 9);
  assert.deepEqual(horseshoe.pathElements.labels.map((label) => label.text), ['0', '5', '10', '15', '20', '25', '30', '35', '40']);
});

test('major and minor tickmark visibility remains independently configurable', () => {
  const config = createConfig({ type: 'line', length: 80 });
  Object.assign(config.layout.horseshoes[0], {
    show: { tickmarks: { major: false, minor: true } },
    horseshoe_tickmarks: {
      ticks_major: { ticksize: 25, width: 6, thickness: 2, offset: 0, styles: { fill: '#ffffff' } },
      ticks_minor: { ticksize: 10, width: 3, thickness: 1, offset: 0, styles: { fill: '#ffffff' } },
    },
  });
  const [horseshoe] = HorseshoeGauge.setConfig(config, createTemplates(), 'card', createCard());

  horseshoe.updateRuntimeConfig();
  horseshoe.setState({ entity_id: 'sensor.load', state: '50', attributes: {} }, {});
  bindMeasuredHorizontalPath(horseshoe, 20, 100, 160);
  horseshoe.buildMeasuredGradientContracts();

  assert.equal(horseshoe.pathElements.ticks.length, 8);
  assert.equal(horseshoe.pathElements.ticks.every((tick) => tick.layer === 'minor'), true);
});

test('color-stop segments share one normalized contract for scale and clipped state', () => {
  const config = createConfig({ type: 'line', length: 80 });
  Object.assign(config.layout.horseshoes[0], {
    show: { horseshoe_style: 'colorstopsegments', scale_style: 'colorstopsegments' },
    color_stops: {
      colors: {
        0: '#00ff00',
        50: '#ffff00',
        100: '#ff0000',
      },
    },
  });
  const [horseshoe] = HorseshoeGauge.setConfig(config, createTemplates(), 'card', createCard());

  horseshoe.updateRuntimeConfig();
  horseshoe.setState({ entity_id: 'sensor.load', state: '75', attributes: {} }, {});

  assert.deepEqual(horseshoe.renderContract.scaleRanges.map((range) => [range.start, range.end]), [[0, 50], [50, 100]]);
  assert.deepEqual(horseshoe.renderContract.stateRanges.map((range) => [range.start, range.end]), [[0, 50], [50, 75]]);
  assert.deepEqual(horseshoe.renderContract.stateRanges.map((range) => range.color), ['#00ff00', '#ffff00']);
});

test('the path-engine gauge applies the existing item and layer color-filter cascade before path rendering', () => {
  const config = createConfig({ type: 'line', length: 80 });
  Object.assign(config.layout.horseshoes[0], {
    color_filter: { grayscale: 1 },
    horseshoe_scale: { min: 0, max: 100, styles: { fill: '#00ff00' } },
    horseshoe_state: { styles: { fill: '#ff0000' } },
  });
  const [horseshoe] = HorseshoeGauge.setConfig(config, createTemplates(), 'card', createCard());

  horseshoe.updateRuntimeConfig();
  horseshoe.setState({ entity_id: 'sensor.load', state: '50', attributes: {} }, {});

  assert.notEqual(horseshoe.renderContract.backgroundRange.color, '#00ff00');
  assert.notEqual(horseshoe.renderContract.stateRanges[0].color, '#ff0000');
  assert.match(horseshoe.renderContract.backgroundRange.color, /^rgb/);
  assert.match(horseshoe.renderContract.stateRanges[0].color, /^rgb/);
});

test('ranked string states keep every segment mounted and change only active opacity', () => {
  const config = createConfig({ type: 'rectangle', width: 80, height: 60 });
  Object.assign(config.layout.horseshoes[0], {
    horseshoe_state: { mode: 'stringstate_level', inactive_opacity: 0.1 },
    color_stops: {
      colors: [
        { state: 'low', color: '#00ff00', rank: 0 },
        { state: 'medium', color: '#ffff00', rank: 1 },
        { state: 'high', color: '#ff0000', rank: 2 },
      ],
    },
  });
  const [horseshoe] = HorseshoeGauge.setConfig(config, createTemplates(), 'card', createCard());

  horseshoe.updateRuntimeConfig();
  horseshoe.setState({ entity_id: 'sensor.level', state: 'medium', attributes: {} }, {});

  assert.equal(horseshoe.renderContract.stateRanges.length, 3);
  assert.deepEqual(horseshoe.renderContract.stateRanges.map((range) => range.opacity), [1, 1, 0.1]);
  assert.deepEqual(horseshoe.renderContract.stateRanges.map((range) => range.color), ['#00ff00', '#ffff00', '#ff0000']);
});

test('full and current gradients are built from measured geometry after value mapping', () => {
  ['colorstopgradient', 'lineargradient', 'minmaxgradient'].forEach((horseshoeStyle) => {
    const config = createConfig({ type: 'line', length: 80 });
    Object.assign(config.layout.horseshoes[0], {
      show: { horseshoe_style: horseshoeStyle },
      color_stops: { 0: '#00ff00', 50: '#ffff00', 100: '#ff0000' },
    });
    const [horseshoe] = HorseshoeGauge.setConfig(config, createTemplates(), 'card', createCard());

    horseshoe.updateRuntimeConfig();
    horseshoe.setState({ entity_id: 'sensor.load', state: '75', attributes: {} }, {});
    assert.equal(horseshoe.stateGradient, undefined);

    bindMeasuredHorizontalPath(horseshoe, 20, 100, 160);
    horseshoe.buildMeasuredGradientContracts();

    assert.equal(horseshoe.stateGradient.mode, horseshoeStyle === 'colorstopgradient' ? 'full' : 'current');
    assert.deepEqual(
      [horseshoe.stateGradient.revealRange.start, horseshoe.stateGradient.revealRange.end],
      [0, 75],
    );
    assert.equal(horseshoe.stateGradient.ranges.length > 1, true);
  });
});

test('rotated tickmarks and labels receive final coordinates without a parent text transform', () => {
  const config = createConfig({ type: 'line', length: 80 });
  Object.assign(config.layout.horseshoes[0], {
    rotate: 90,
    show: {
      labels_at: 'ticks_major',
      tickmarks: { major: true, minor: false },
      label_badges: true,
    },
    horseshoe_tickmarks: {
      ticks_major: { ticksize: 25, width: 6, thickness: 2, offset: 0, styles: { fill: '#ffffff' } },
    },
    horseshoe_labels: { orientation: 'horizontal', offset: 12, styles: { fill: '#ffffff' } },
  });
  const [horseshoe] = HorseshoeGauge.setConfig(config, createTemplates(), 'card', createCard());

  horseshoe.updateRuntimeConfig();
  horseshoe.setState({ entity_id: 'sensor.load', state: '50', attributes: {} }, {});
  bindMeasuredHorizontalPath(horseshoe, 20, 100, 160);
  horseshoe.buildMeasuredGradientContracts();

  assert.equal(horseshoe.pathElements.ticks.length, 5);
  assert.equal(horseshoe.pathElements.labels.length, 5);
  assert.deepEqual(
    { x: horseshoe.pathElements.labels[1].x, y: horseshoe.pathElements.labels[1].y },
    { x: 112, y: 60 },
  );
  const renderedSource = horseshoe.render().strings.join('');
  assert.match(renderedSource, /horseshoe__path[^>]*transform=/);
  assert.doesNotMatch(renderedSource, /horseshoe__path-elements[^>]*transform=/);
});

test('numeric state updates retain measured backgrounds, tickmarks, and labels', () => {
  const config = createConfig({ type: 'line', length: 80 });
  Object.assign(config.layout.horseshoes[0], {
    show: {
      horseshoe_background: 'fixed',
      labels_at: 'ticks_major',
      tickmarks: { major: true, minor: false },
    },
    horseshoe_background: { width: 8, styles: { fill: '#222222' } },
    horseshoe_tickmarks: {
      ticks_major: { ticksize: 25, width: 6, thickness: 2, styles: { fill: '#ffffff' } },
    },
  });
  const [horseshoe] = HorseshoeGauge.setConfig(config, createTemplates(), 'card', createCard());

  horseshoe.updateRuntimeConfig();
  horseshoe.setState({ entity_id: 'sensor.load', state: '25', attributes: {} }, {});
  bindMeasuredHorizontalPath(horseshoe, 20, 100, 160);
  horseshoe.buildMeasuredGradientContracts();
  const backgrounds = horseshoe.backgroundLayers;
  const pathElements = horseshoe.pathElements;

  horseshoe.setState({ entity_id: 'sensor.load', state: '75', attributes: {} }, {});

  assert.equal(horseshoe.backgroundLayers, backgrounds);
  assert.equal(horseshoe.pathElements, pathElements);
  assert.equal(horseshoe.renderContract.stateRanges[0].end, 75);
});

test('a mounted numeric update delegates progress to the state animator without rebuilding static layout', () => {
  const config = createConfig({ type: 'line', length: 80 });
  const [horseshoe] = HorseshoeGauge.setConfig(config, createTemplates(), 'card', createCard());

  horseshoe.updateRuntimeConfig();
  horseshoe.setState({ entity_id: 'sensor.load', state: '25', attributes: {} }, {});
  bindMeasuredHorizontalPath(horseshoe, 20, 100, 160);
  horseshoe.buildMeasuredGradientContracts();
  const pathElements = horseshoe.pathElements;
  const stateTargets = [];
  horseshoe.stateAnimator.stateLayerElement = {};
  horseshoe.stateAnimator.animateTo = (progress) => stateTargets.push(progress);

  horseshoe.setState({ entity_id: 'sensor.load', state: '75', attributes: {} }, {});

  assert.deepEqual(stateTargets, [75]);
  assert.equal(horseshoe.pathElements, pathElements);
});
