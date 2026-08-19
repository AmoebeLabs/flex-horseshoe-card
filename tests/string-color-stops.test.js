import test from 'node:test';
import assert from 'node:assert/strict';
import ColorStops from '../src/color-stops.js';
import CardEntities from '../src/card-entities.js';
import { getGaugeStateData } from '../src/horseshoe-state.js';

const entityConfig = { entities: [{ entity: 'sensor.test' }] };

test('normalizes string color stops without converting states to numbers', () => {
  const colorStops = ColorStops.normalize({
    colors: [
      { state: '1', rank: 1, color: 'green', styles: { opacity: 0.8 } },
      { state: 'off', rank: 0, color: 'gray' },
    ],
  });

  assert.deepEqual(colorStops.colors, [
    { state: '1', rank: 1, color: 'green', styles: { opacity: 0.8 } },
    { state: 'off', rank: 0, color: 'gray' },
  ]);
});

test('resolves exact string states and preserves the complete active stop', () => {
  const cardEntities = new CardEntities({}, {});
  const colorStops = ColorStops.normalize({
    colors: [
      { state: 'off', color: 'gray' },
      { state: '1', color: 'green', styles: { opacity: 0.8 } },
    ],
  });
  const item = { entity_index: 0, show: { item_style: 'colorstop' } };

  assert.deepEqual(
    cardEntities.getItemColorStop(item, colorStops, entityConfig, [{ state: '1', attributes: {} }]),
    { state: '1', color: 'green', styles: { opacity: 0.8 } },
  );
  assert.deepEqual(
    cardEntities.getItemColorStop(item, colorStops, entityConfig, [{ state: 1, attributes: {} }]),
    { state: '1', color: 'green', styles: { opacity: 0.8 } },
  );
});

test('derives horseshoe state geometry from ranked string color stops', () => {
  const config = {
    horseshoe_state: { mode: 'stringstate_mode' },
    colorstops: ColorStops.normalize({
      colors: [
        { state: 'low', rank: 0, color: 'green' },
        { state: 'high', rank: 1, color: 'red' },
      ],
    }),
    horseshoe_scale: { min: 0, max: 100 },
  };
  const result = getGaugeStateData(config, { state: 'high', attributes: {} }, entityConfig.entities[0]);

  assert.equal(result.value, 1);
  assert.deepEqual(result.config.state_map.map.map((entry) => entry.state), ['low', 'high']);
  assert.deepEqual(result.config.colorstops.colors.map((entry) => entry.state), ["low", "high"]);
  assert.equal(result.mappedState.color, 'red');
});


test('keeps numeric stop selection at both configured edges', () => {
  const cardEntities = new CardEntities({}, {});
  const colorStops = ColorStops.normalize({
    colors: [
      { value: 10, color: 'blue' },
      { value: 20, color: 'red' },
    ],
  });
  const item = { entity_index: 0, show: { item_style: 'colorstop' } };
  const config = { entities: [{ entity: 'sensor.test' }] };

  assert.equal(cardEntities.getItemColorStop(item, colorStops, config, [{ state: '-1', attributes: {} }]).color, 'blue');
  assert.equal(cardEntities.getItemColorStop(item, colorStops, config, [{ state: '30', attributes: {} }]).color, 'red');
});

test('returns no color-stop result for an unknown string state', () => {
  const cardEntities = new CardEntities({}, {});
  const colorStops = ColorStops.normalize({
    colors: [{ state: 'on', color: 'green' }],
  });

  assert.equal(
    cardEntities.getItemColorStop(
      { entity_index: 0, show: { item_style: 'colorstop' } },
      colorStops,
      { entities: [{ entity: 'sensor.test' }] },
      [{ state: 'unknown', attributes: {} }],
    ),
    undefined,
  );
});
