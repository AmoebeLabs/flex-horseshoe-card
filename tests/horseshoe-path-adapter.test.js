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
      colorContext: { cacheReady: false },
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
  const measurement = { lengthReads: 0, pointReads: 0 };
  horseshoe.geometry.pathGeometry.bindPathElement({
    getTotalLength: () => {
      measurement.lengthReads += 1;
      return length;
    },
    getPointAtLength: (distance) => {
      measurement.pointReads += 1;
      return { x: startX + distance, y };
    },
  });
  return measurement;
}

test('normal horseshoe configuration enters the path-engine implementation', () => {
  const card = createCard();
  const config = createConfig({ type: 'arc', radius: 40, arc_degrees: 270 });

  assert.equal(HorseshoeGauge.setConfig(config, createTemplates(), 'card', card).length, 1);
});

test('stringstate label selection without a state map renders no labels', () => {
  const card = createCard();
  const config = createConfig({ type: 'arc', radius: 40, arc_degrees: 270 });
  config.layout.horseshoes[0].show = { labels_at: 'stringstate' };
  const [horseshoe] = HorseshoeGauge.setConfig(config, createTemplates(), 'card', card);

  horseshoe.updateRuntimeConfig();
  horseshoe.setState({ entity_id: 'sensor.load', state: '25', attributes: {} }, {});
  bindMeasuredHorizontalPath(horseshoe, 20, 100, 160);

  assert.doesNotThrow(() => horseshoe.buildMeasuredGradientContracts());
  assert.deepEqual(horseshoe.geometry.pathElements.labels, []);
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

  assert.deepEqual(horseshoe.geometry.pathInput, {
    type: 'arc',
    cx: 100,
    cy: 100,
    radiusX: 80,
    radiusY: 80,
    startAngle: -90,
    arcDegrees: 360,
  });
  assert.equal(horseshoe.geometry.pathDefinition.closed, true);
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
      path: { type: 'rectangle', width: 80, height: 60, radius: 5 },
      expected: {
        type: 'rectangle', cx: 100, cy: 100, width: 160, height: 120,
        radiusTopLeft: 10, radiusTopRight: 10, radiusBottomRight: 10, radiusBottomLeft: 10,
        start: 0, end: 4, top: 0.5, direction: 'clockwise',
      },
    },
    {
      path: { type: 'polygon', sides: 6, width: 80, height: 60, radius: 5 },
      expected: {
        type: 'polygon', cx: 100, cy: 100, sides: 6, width: 160, height: 120, radius: 10,
        start: 0, end: 6, top: 0.5, direction: 'clockwise',
      },
    },
    {
      path: { type: 'polygon', sides: 5, width: 80, height: 60, top: 1.25, start: 4.5, end: 2.5, direction: 'counterclockwise' },
      expected: {
        type: 'polygon', cx: 100, cy: 100, sides: 5, width: 160, height: 120, radius: 0,
        start: 4.5, end: 2.5, top: 1.25, direction: 'counterclockwise',
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

    assert.deepEqual(horseshoe.geometry.pathInput, expected);
    assert.equal(typeof horseshoe.geometry.pathDefinition.d, 'string');
    assert.ok(horseshoe.geometry.pathDefinition.d.startsWith('M '));
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

  assert.equal(horseshoe.paint.paintedStateRanges.length, 1);
  assert.equal(horseshoe.paint.paintedStateRanges[0].start, 0);
  assert.equal(horseshoe.paint.paintedStateRanges[0].end, 25);
  assert.equal(horseshoe.paint.paintedStateRanges[0].width, 12);
  assert.equal(horseshoe.paint.backgroundRange.width, 6);

  horseshoe.updateRuntimeConfig();
  horseshoe.setState({ entity_id: 'sensor.load', state: '75', attributes: {} }, {});
  assert.equal(horseshoe.paint.paintedStateRanges[0].end, 75);
});

test('invalid path shape values fail at the adapter boundary', () => {
  const invalidConfigs = [
    createConfig({ type: 'unknown' }),
    createConfig({ type: 'arc', radius: 0 }),
    createConfig({ type: 'rectangle', width: 80, height: 60, radius: 0, start: -0.1 }),
    createConfig({ type: 'rectangle', width: 80, height: 60, radius: 0, end: 4.1 }),
    createConfig({ type: 'polygon', sides: 2, width: 80, height: 60 }),
    createConfig({ type: 'polygon', sides: 6, width: 80, height: 60, radius: -1 }),
    createConfig({ type: 'polygon', sides: 6, width: 80, height: 60, radius: 100 }),
    createConfig({ type: 'polygon', sides: 6, width: 80 }),
    createConfig({ type: 'polygon', sides: 6, width: 80, height: 60, top: 6.1 }),
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
      [horseshoe.paint.paintedStateRanges[0].start, horseshoe.paint.paintedStateRanges[0].end],
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

  assert.deepEqual(horseshoe.geometry.pathElements.ticks.map((tick) => tick.progress), [0, 50, 100]);
  assert.deepEqual(horseshoe.geometry.pathElements.labels.map((label) => label.text), ['0', '5', '10']);

  horseshoe.setState({ entity_id: 'sensor.load', state: '5', attributes: {} }, {});
  horseshoe.buildMeasuredGradientContracts();

  assert.equal(horseshoe.geometry.pathElements.ticks.length, 9);
  assert.deepEqual(horseshoe.geometry.pathElements.labels.map((label) => label.text), ['0', '5', '10', '15', '20', '25', '30', '35', '40']);
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

  assert.equal(horseshoe.geometry.pathElements.ticks.length, 8);
  assert.equal(horseshoe.geometry.pathElements.ticks.every((tick) => tick.layer === 'minor'), true);
});

test('center-attached state markers are limited to arc paths', () => {
  const config = createConfig({ type: 'line', length: 80 });
  Object.assign(config.layout.horseshoes[0], {
    horseshoe_marker: {
      attach_to: 'center',
      icon: 'mdi:arrow-up-bold',
    },
  });
  const [horseshoe] = HorseshoeGauge.setConfig(config, createTemplates(), 'card', createCard());

  assert.throws(
    () => horseshoe.updateRuntimeConfig(),
    /center-attached horseshoe_marker requires path.type arc/,
  );
});

test('state marker styles override the inherited state appearance', () => {
  const config = createConfig({ type: 'line', length: 80 });
  Object.assign(config.layout.horseshoes[0], {
    horseshoe_state: {
      styles: {
        fill: '#2563eb',
        opacity: 0.5,
      },
    },
    horseshoe_marker: {
      styles: {
        fill: '#ffffff',
        opacity: 1,
      },
    },
  });
  const [horseshoe] = HorseshoeGauge.setConfig(config, createTemplates(), 'card', createCard());

  horseshoe.updateRuntimeConfig();
  horseshoe.setState({ entity_id: 'sensor.load', state: '50', attributes: {} }, {});

  assert.equal(horseshoe.config.horseshoe_state.styles.fill, '#2563eb');
  assert.equal(horseshoe.paint.markerStyles.fill, '#ffffff');
  assert.equal(horseshoe.paint.markerStyles.opacity, '1');
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

  assert.deepEqual(horseshoe.paint.scaleRanges.map((range) => [range.start, range.end]), [[0, 50], [50, 100]]);
  assert.deepEqual(horseshoe.paint.paintedStateRanges.map((range) => [range.start, range.end]), [[0, 50], [50, 75]]);
  assert.deepEqual(horseshoe.paint.paintedStateRanges.map((range) => range.color), ['#00ff00', '#ffff00']);
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

  assert.notEqual(horseshoe.paint.backgroundRange.color, '#00ff00');
  assert.notEqual(horseshoe.paint.paintedStateRanges[0].color, '#ff0000');
  assert.match(horseshoe.paint.backgroundRange.color, /^rgb/);
  assert.match(horseshoe.paint.paintedStateRanges[0].color, /^rgb/);
});

test('state markers use the calculated state fill and preserve explicit state styles', () => {
  const config = createConfig({ type: 'line', length: 80 });
  Object.assign(config.layout.horseshoes[0], {
    show: {
      horseshoe_style: 'colorstopinterpolated',
      state_progress: false,
      state_marker: true,
    },
    horseshoe_state: {
      styles: {
        stroke: '#ffffff',
        'stroke-width': 2,
        opacity: 0.6,
      },
    },
    color_stops: {
      colors: {
        0: '#0000ff',
        100: '#00ff00',
      },
    },
  });
  const [horseshoe] = HorseshoeGauge.setConfig(config, createTemplates(), 'card', createCard());

  horseshoe.updateRuntimeConfig();
  horseshoe.setState({ entity_id: 'sensor.load', state: '50', attributes: {} }, {});

  assert.equal(horseshoe.paint.markerStyles.fill, '#007f7fff');
  assert.equal(horseshoe.paint.markerStyles.stroke, '#ffffff');
  assert.equal(horseshoe.paint.markerStyles['stroke-width'], '2');
  assert.equal(horseshoe.paint.markerStyles.opacity, '0.6');
  assert.equal(horseshoe.config.show.state_progress, false);
  assert.equal(horseshoe.config.show.state_marker, true);
});

test('ranked string states keep every segment mounted and change only active opacity', () => {
  const config = createConfig({ type: 'rectangle', width: 80, height: 60 });
  Object.assign(config.layout.horseshoes[0], {
    horseshoe_state: { mode: 'stringstate_level', inactive_opacity: 0.1, styles: { transition: 'fill 5s ease, opacity 5s ease' } },
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

  assert.equal(horseshoe.paint.paintedStateRanges.length, 3);
  assert.deepEqual(horseshoe.paint.paintedStateRanges.map((range) => range.opacity), [1, 1, 0.1]);
  assert.deepEqual(horseshoe.paint.paintedStateRanges.map((range) => range.color), ['#00ff00', '#ffff00', '#ff0000']);
  assert.deepEqual(horseshoe.paint.paintedStateRanges.map((range) => range.transition), [
    'stroke 5s ease, opacity 5s ease',
    'stroke 5s ease, opacity 5s ease',
    'stroke 5s ease, opacity 5s ease',
  ]);
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
    assert.equal(horseshoe.paint.stateGradient, undefined);

    bindMeasuredHorizontalPath(horseshoe, 20, 100, 160);
    horseshoe.buildMeasuredGradientContracts();

    assert.equal(horseshoe.paint.stateGradient.mode, horseshoeStyle === 'colorstopgradient' ? 'full' : 'current');
    assert.deepEqual(
      [horseshoe.paint.stateGradient.revealRange.start, horseshoe.paint.stateGradient.revealRange.end],
      [0, 75],
    );
    assert.equal(horseshoe.paint.stateGradient.ranges.length, 1);
    assert.equal(horseshoe.paint.stateGradient.ranges[0].gradient.stops.length, horseshoeStyle === 'minmaxgradient' ? 2 : 3);
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

  assert.equal(horseshoe.geometry.pathElements.ticks.length, 5);
  assert.equal(horseshoe.geometry.pathElements.labels.length, 5);
  assert.deepEqual(
    { x: horseshoe.geometry.pathElements.labels[1].x, y: horseshoe.geometry.pathElements.labels[1].y },
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
  const backgrounds = horseshoe.paint.backgroundLayers;
  const pathElements = horseshoe.geometry.pathElements;

  horseshoe.setState({ entity_id: 'sensor.load', state: '75', attributes: {} }, {});

  assert.equal(horseshoe.paint.backgroundLayers, backgrounds);
  assert.equal(horseshoe.geometry.pathElements, pathElements);
  assert.equal(horseshoe.paint.paintedStateRanges[0].end, 75);
});

test('a mounted numeric update delegates progress to the state animator without rebuilding static layout', () => {
  const config = createConfig({ type: 'line', length: 80 });
  const [horseshoe] = HorseshoeGauge.setConfig(config, createTemplates(), 'card', createCard());

  horseshoe.updateRuntimeConfig();
  horseshoe.setState({ entity_id: 'sensor.load', state: '25', attributes: {} }, {});
  bindMeasuredHorizontalPath(horseshoe, 20, 100, 160);
  horseshoe.buildMeasuredGradientContracts();
  const pathElements = horseshoe.geometry.pathElements;
  const stateTargets = [];
  horseshoe.stateAnimator.stateLayerElement = {};
  horseshoe.stateAnimator.animateTo = (progress) => stateTargets.push(progress);

  horseshoe.setState({ entity_id: 'sensor.load', state: '75', attributes: {} }, {});

  assert.deepEqual(stateTargets, [75]);
  assert.equal(horseshoe.geometry.pathElements, pathElements);
});

test('full gradient value updates retain their prepared adaptive ranges', () => {
  const config = createConfig({ type: 'line', length: 80 });
  Object.assign(config.layout.horseshoes[0], {
    show: { horseshoe_style: 'colorstopgradient' },
    color_stops: { 0: '#00ff00', 50: '#ffff00', 100: '#ff0000' },
  });
  const [horseshoe] = HorseshoeGauge.setConfig(config, createTemplates(), 'card', createCard());
  horseshoe.updateRuntimeConfig();
  horseshoe.setState({ entity_id: 'sensor.load', state: '25', attributes: {} }, {});
  bindMeasuredHorizontalPath(horseshoe, 20, 100, 160);
  horseshoe.buildMeasuredGradientContracts();
  const ranges = horseshoe.paint.stateGradient.ranges;

  horseshoe.setState({ entity_id: 'sensor.load', state: '75', attributes: {} }, {});

  assert.equal(horseshoe.paint.stateGradient.ranges, ranges);
  assert.equal(horseshoe.paint.stateGradient.revealRange.end, 75);
});

test('state, scale, and background gradients share prepared geometry across paint changes', () => {
  const config = createConfig({ type: 'line', length: 80 });
  Object.assign(config.layout.horseshoes[0], {
    show: {
      horseshoe_style: 'colorstopgradient',
      scale_style: 'colorstopgradient',
      horseshoe_background: 'colorstopgradient',
    },
    color_stops: {
      0: '#0000ff',
      50: '#00ff00',
      100: '#ff0000',
    },
    horseshoe_background: { width: 8, styles: { opacity: 0.25 } },
  });
  const [horseshoe] = HorseshoeGauge.setConfig(config, createTemplates(), 'card', createCard());

  horseshoe.updateRuntimeConfig();
  horseshoe.setState({ entity_id: 'sensor.load', state: '25', attributes: {} }, {});
  const measurement = bindMeasuredHorizontalPath(horseshoe, 20, 100, 160);
  horseshoe.buildMeasuredGradientContracts();
  const background = horseshoe.paint.backgroundLayers.find((layer) => layer.id === 'horseshoe');
  const preparedGeometry = horseshoe.paint.stateGradient.geometry;

  assert.strictEqual(horseshoe.paint.scaleGradient.geometry, preparedGeometry);
  assert.strictEqual(background.gradient.geometry, preparedGeometry);
  const pointReads = measurement.pointReads;

  // Color-stop paint and path thickness change while the measured centerline stays fixed.
  horseshoe.paint.activeColorStops[1].color = '#ffffff';
  horseshoe.config.horseshoe_state.width = 18;
  horseshoe.buildMeasuredGradientContracts();

  const updatedBackground = horseshoe.paint.backgroundLayers.find((layer) => layer.id === 'horseshoe');
  assert.strictEqual(horseshoe.paint.stateGradient.geometry, preparedGeometry);
  assert.strictEqual(horseshoe.paint.scaleGradient.geometry, preparedGeometry);
  assert.strictEqual(updatedBackground.gradient.geometry, preparedGeometry);
  assert.equal(horseshoe.paint.stateGradient.ranges[0].width, 18);
  assert.equal(horseshoe.paint.stateGradient.ranges[0].gradient.stops.some((stop) => stop.color === '#ffffff'), true);
  assert.equal(measurement.pointReads, pointReads);
});

test('scale mapping and path rotation invalidate only their dependent geometry', () => {
  const card = createCard();
  const config = createConfig({ type: 'line', length: 80 });
  Object.assign(config.layout.horseshoes[0], {
    show: {
      horseshoe_style: 'colorstopgradient',
      scale_style: 'colorstopgradient',
      labels_at: 'minmax',
    },
    color_stops: {
      0: '#0000ff',
      50: '#00ff00',
      100: '#ff0000',
    },
    horseshoe_labels: { orientation: 'horizontal', offset: 12 },
  });
  const [horseshoe] = HorseshoeGauge.setConfig(config, createTemplates(), 'card', card);

  horseshoe.updateRuntimeConfig();
  horseshoe.setState({ entity_id: 'sensor.load', state: '25', attributes: {} }, {});
  bindMeasuredHorizontalPath(horseshoe, 20, 100, 160);
  horseshoe.buildMeasuredGradientContracts();
  const preparedGradientGeometry = horseshoe.paint.stateGradient.geometry;
  const originalTransformedGeometry = horseshoe.geometry.transformedPathGeometry;
  const originalLabelPositions = horseshoe.geometry.pathElements.labels.map((label) => [label.x, label.y]);

  horseshoe.config.horseshoe_scale.max = 200;
  card.cardLayout.changedGroupIds.add('card');
  horseshoe.updateRuntimeConfig();
  horseshoe.setState({ entity_id: 'sensor.load', state: '25', attributes: {} }, {});
  horseshoe.buildMeasuredGradientContracts();

  assert.strictEqual(horseshoe.paint.stateGradient.geometry, preparedGradientGeometry);
  assert.equal(horseshoe.paint.stateGradient.ranges[0].gradient.stops.some((stop) => stop.offset === 25 && stop.color === '#00ff00'), true);

  horseshoe.config.rotate = 90;
  card.cardLayout.changedGroupIds.add('card');
  horseshoe.updateRuntimeConfig();
  horseshoe.setState({ entity_id: 'sensor.load', state: '25', attributes: {} }, {});
  horseshoe.buildMeasuredGradientContracts();

  assert.notStrictEqual(horseshoe.geometry.transformedPathGeometry, originalTransformedGeometry);
  assert.notDeepEqual(horseshoe.geometry.pathElements.labels.map((label) => [label.x, label.y]), originalLabelPositions);
  assert.strictEqual(horseshoe.paint.stateGradient.geometry, preparedGradientGeometry);
});

test('paint-only runtime changes retain transformed path measurements', () => {
  const card = createCard();
  const [horseshoe] = HorseshoeGauge.setConfig(createConfig({ type: 'line', length: 80 }), createTemplates(), 'card', card);
  horseshoe.updateRuntimeConfig();
  horseshoe.setState({ entity_id: 'sensor.load', state: '25', attributes: {} }, {});
  bindMeasuredHorizontalPath(horseshoe, 20, 100, 160);
  horseshoe.buildMeasuredGradientContracts();
  const transformedGeometry = horseshoe.geometry.transformedPathGeometry;

  card.cardTheme.modeChanged = true;
  horseshoe.updateRuntimeConfig();
  horseshoe.setState({ entity_id: 'sensor.load', state: '25', attributes: {} }, {});

  assert.equal(horseshoe.geometry.transformedPathGeometry, transformedGeometry);
});

test('moving state markers retain only fixed samples in the permanent path cache', () => {
  const config = createConfig({ type: 'line', length: 80 });
  Object.assign(config.layout.horseshoes[0], {
    show: { state_progress: false, state_marker: true },
    horseshoe_marker: { attach_to: 'path', shape: 'circle', size: 4 },
  });
  const [horseshoe] = HorseshoeGauge.setConfig(config, createTemplates(), 'card', createCard());
  horseshoe.updateRuntimeConfig();
  horseshoe.setState({ entity_id: 'sensor.load', state: '75', attributes: {} }, {});
  bindMeasuredHorizontalPath(horseshoe, 20, 100, 160);
  horseshoe.buildMeasuredGradientContracts();
  const measurements = horseshoe.geometry.pathGeometry.activeMeasurement;
  const fixedSamples = { points: measurements.points.size, tangents: measurements.tangents.size };

  // Moving state positions must not become permanent measurement candidates.
  for (let index = 0; index < 100; index += 1) {
    horseshoe.renderStateAtProgress(10.1234567 + index * 0.71234567, 'card-horseshoe-0');
  }

  assert.equal(measurements.points.size, fixedSamples.points);
  assert.equal(measurements.tangents.size, fixedSamples.tangents);
});

test('current gradients do not retain their moving frame samples permanently', () => {
  const config = createConfig({ type: 'line', length: 80 });
  Object.assign(config.layout.horseshoes[0], {
    show: { horseshoe_style: 'lineargradient' },
    color_stops: { 0: '#00ff00', 50: '#ffff00', 100: '#ff0000' },
  });
  const [horseshoe] = HorseshoeGauge.setConfig(config, createTemplates(), 'card', createCard());
  horseshoe.updateRuntimeConfig();
  horseshoe.setState({ entity_id: 'sensor.load', state: '75', attributes: {} }, {});
  bindMeasuredHorizontalPath(horseshoe, 20, 100, 160);
  horseshoe.buildMeasuredGradientContracts();
  const measurements = horseshoe.geometry.pathGeometry.activeMeasurement;
  const fixedSamples = { points: measurements.points.size, tangents: measurements.tangents.size };

  for (let index = 0; index < 100; index += 1) {
    horseshoe.renderStateAtProgress(10.1234567 + index * 0.71234567, 'card-horseshoe-0');
  }

  assert.equal(measurements.points.size, fixedSamples.points);
  assert.equal(measurements.tangents.size, fixedSamples.tangents);
});

test('changing a measured path stops animation before its old binding is released', () => {
  const previousRequestAnimationFrame = globalThis.requestAnimationFrame;
  const previousCancelAnimationFrame = globalThis.cancelAnimationFrame;
  const frames = new Map();
  globalThis.requestAnimationFrame = (callback) => { frames.set(1, callback); return 1; };
  globalThis.cancelAnimationFrame = (frame) => frames.delete(frame);
  try {
    const card = createCard();
    const [horseshoe] = HorseshoeGauge.setConfig(createConfig({ type: 'line', length: 80 }), createTemplates(), 'card', card);
    horseshoe.updateRuntimeConfig();
    bindMeasuredHorizontalPath(horseshoe, 20, 100, 160);
    horseshoe.stateAnimator.stateLayerElement = { id: 'old-state' };
    horseshoe.stateAnimator.currentProgress = 35;
    horseshoe.stateAnimator.animateTo(80);
    horseshoe.config.path.length = 60;
    card.cardLayout.changedGroupIds.add('card');

    horseshoe.updateRuntimeConfig();

    assert.equal(frames.size, 0);
    assert.equal(horseshoe.stateAnimator.stateLayerElement, undefined);
    assert.equal(horseshoe.stateAnimator.currentProgress, 35);
    assert.equal(horseshoe.geometry.pathGeometry.isReady(), false);
  } finally {
    globalThis.requestAnimationFrame = previousRequestAnimationFrame;
    globalThis.cancelAnimationFrame = previousCancelAnimationFrame;
  }
});

test('disconnect and reconnect retain mapped zero and negative progress without duplicate frames', () => {
  const previousRequestAnimationFrame = globalThis.requestAnimationFrame;
  const previousCancelAnimationFrame = globalThis.cancelAnimationFrame;
  const frames = new Map();
  let nextFrame = 1;
  globalThis.requestAnimationFrame = (callback) => {
    const frame = nextFrame;
    nextFrame += 1;
    frames.set(frame, callback);
    return frame;
  };
  globalThis.cancelAnimationFrame = (frame) => frames.delete(frame);

  try {
    const card = createCard();
    let stateMount = { id: 'state-before-disconnect' };
    const createMasterPath = () => {
      const reads = { length: 0, points: 0 };
      const element = {
        getTotalLength: () => {
          reads.length += 1;
          return 160;
        },
        getPointAtLength: (distance) => {
          reads.points += 1;
          return { x: 20 + distance, y: 100 };
        },
      };
      return { element, reads };
    };
    let masterPath = createMasterPath();
    card.shadowRoot = {
      getElementById: (id) => id.endsWith('-master') ? masterPath.element : stateMount,
    };
    const config = createConfig({ type: 'line', length: 80 });
    Object.assign(config.layout.horseshoes[0], {
      bar_mode: 'bidirectional',
      horseshoe_scale: { min: -100, max: 100 },
      horseshoe_state: { animation: { enabled: true, duration: 100, easing: 'linear' } },
    });
    const [horseshoe] = HorseshoeGauge.setConfig(
      config,
      createTemplates(),
      'card',
      card,
    );
    horseshoe.updateRuntimeConfig();
    const stateUpdates = [];
    horseshoe.stateAnimator.updateStateLayer = (element, progress) => {
      stateUpdates.push({ element, progress });
      horseshoe.renderStateAtProgress(progress, 'card-horseshoe-0');
    };
    horseshoe.setState({ entity_id: 'sensor.load', state: '50', attributes: {} }, {});
    assert.equal(horseshoe.runtime.valueMapper.valueToProgress(horseshoe.runtime.value), 75);
    horseshoe.updated();

    horseshoe.setState({ entity_id: 'sensor.load', state: '-50', attributes: {} }, {});
    assert.equal(horseshoe.runtime.valueMapper.valueToProgress(horseshoe.runtime.value), 25);
    assert.deepEqual(
      [horseshoe.paint.paintedStateRanges[0].start, horseshoe.paint.paintedStateRanges[0].end],
      [25, 50],
    );
    const runNextFrame = (timestamp) => {
      const [frame, callback] = frames.entries().next().value;
      frames.delete(frame);
      callback(timestamp);
    };
    runNextFrame(1000);
    runNextFrame(1050);

    assert.equal(frames.size, 1);
    assert.equal(horseshoe.stateAnimator.currentProgress, 50);

    horseshoe.disconnected();
    horseshoe.disconnected();

    assert.equal(frames.size, 0);
    assert.equal(horseshoe.stateAnimator.frame, undefined);
    assert.equal(horseshoe.stateAnimator.animating, false);
    assert.equal(horseshoe.stateAnimator.stateLayerElement, undefined);
    assert.equal(horseshoe.runtime.displayProgress, 50);
    assert.equal(horseshoe.geometry.pathGeometry.isReady(), false);

    masterPath = createMasterPath();
    stateMount = { id: 'state-after-reconnect' };
    horseshoe.connected();
    horseshoe.connected();
    horseshoe.updated();

    assert.equal(horseshoe.geometry.pathGeometry.isReady(), true);
    assert.equal(horseshoe.stateAnimator.stateLayerElement, stateMount);
    assert.equal(horseshoe.stateAnimator.currentProgress, 50);
    assert.equal(masterPath.reads.length, 0);
    assert.deepEqual(stateUpdates.at(-1), { element: stateMount, progress: 50 });

    horseshoe.setState({ entity_id: 'sensor.load', state: '-100', attributes: {} }, {});
    assert.equal(horseshoe.runtime.valueMapper.valueToProgress(horseshoe.runtime.value), 0);
    runNextFrame(2000);
    runNextFrame(2100);
    assert.equal(horseshoe.stateAnimator.currentProgress, 0);
    assert.equal(horseshoe.runtime.displayProgress, 0);

    horseshoe.setState({ entity_id: 'sensor.load', state: '0', attributes: {} }, {});
    assert.equal(horseshoe.runtime.valueMapper.valueToProgress(horseshoe.runtime.value), 50);
    runNextFrame(3000);
    runNextFrame(3100);
    assert.equal(horseshoe.stateAnimator.currentProgress, 50);
    assert.equal(horseshoe.runtime.displayProgress, 50);
    assert.equal(frames.size, 0);
  } finally {
    globalThis.requestAnimationFrame = previousRequestAnimationFrame;
    globalThis.cancelAnimationFrame = previousCancelAnimationFrame;
  }
});
