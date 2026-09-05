import assert from 'node:assert/strict';
import test from 'node:test';

import HorseshoeGauge from '../src/horseshoe-gauge.js';
import HorseshoeV3 from '../src/horseshoe-v3.js';

function createCard() {
  const group = { id: 'card', xpos: 50, ypos: 50 };

  return {
    cardLayout: {
      changedGroupIds: new Set(),
      groupManager: {
        getGroupForItem: () => group,
      },
      getGroupScaleTransform: () => '',
      getGroupScaleStyle: () => '',
    },
    cardTheme: {
      modeChanged: false,
      getActiveColorStopMode: () => 'light',
    },
    cardAnimations: { styles: { horseshoes_v3: {} } },
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
      horseshoes_v3: [{
        entity_index: 0,
        xpos: 50,
        ypos: 50,
        path,
        horseshoe_scale: { min: 0, max: 100 },
      }],
    },
  };
}

test('temporary V3 section never enters the existing horseshoe implementation', () => {
  const card = createCard();
  const config = createConfig({ type: 'arc', radius: 40, arc_degrees: 270 });

  assert.equal(HorseshoeGauge.setConfig(config, createTemplates(), 'card', card).length, 0);
  assert.equal(HorseshoeV3.setConfig(config, createTemplates(), 'card', card).length, 1);
});

test('existing arc fields become one complete V3 arc contract and retain a true 360 degree ring', () => {
  const card = createCard();
  const config = {
    layout: {
      horseshoes_v3: [{
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
  const [horseshoe] = HorseshoeV3.setConfig(config, createTemplates(), 'card', card);

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
    const [horseshoe] = HorseshoeV3.setConfig(createConfig(path), createTemplates(), 'card', card);

    horseshoe.updateRuntimeConfig();

    assert.deepEqual(horseshoe.pathContract, expected);
    assert.equal(typeof horseshoe.pathDefinition.d, 'string');
    assert.ok(horseshoe.pathDefinition.d.startsWith('M '));
  });
});

test('fixed linear mode maps entity state to the same normalized progress for every shape', () => {
  const card = createCard();
  const [horseshoe] = HorseshoeV3.setConfig(
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

test('unsupported V3 modes and invalid shape values fail at the adapter boundary', () => {
  const invalidConfigs = [
    createConfig({ type: 'unknown' }),
    createConfig({ type: 'arc', radius: 0 }),
    createConfig({ type: 'rectangle', width: 80, height: 60, radius: 0, start: 'corner' }),
  ];
  const segmented = createConfig({ type: 'arc', radius: 40 });
  segmented.layout.horseshoes_v3[0].show = { horseshoe_style: 'colorstopsegments' };

  [...invalidConfigs, segmented].forEach((config) => {
    const card = createCard();
    const [horseshoe] = HorseshoeV3.setConfig(config, createTemplates(), 'card', card);

    assert.throws(() => horseshoe.updateRuntimeConfig(), /\[horseshoes_v3\]/);
  });
});
