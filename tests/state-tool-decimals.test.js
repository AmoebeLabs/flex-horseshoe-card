import test from 'node:test';
import assert from 'node:assert/strict';
import StateTool from '../src/state-tool.js';

/**
 * Creates the smallest complete StateTool runtime needed to exercise the final
 * Home Assistant formatter-parts path and visible state string.
 */
function createStateTool({ state, haFormattedValue, haPrecision, decimals, format }) {
  const entity = {
    entity_id: 'sensor.study_temperature',
    state,
    attributes: {
      device_class: 'temperature',
      unit_of_measurement: '°C',
      step: 0.1,
    },
  };
  const hass = {
    language: 'nl',
    locale: { language: 'nl-NL', number_format: 'decimal_comma' },
    entities: {
      [entity.entity_id]: {
        entity_id: entity.entity_id,
        display_precision: haPrecision,
      },
    },
    states: {
      [entity.entity_id]: entity,
    },
    formatEntityStateToParts: () => [
      { type: 'value', value: haFormattedValue },
      { type: 'unit', value: '°C' },
    ],
    formatEntityAttributeValueToParts: () => [],
  };
  const tool = Object.create(StateTool.prototype);

  tool.config = {
    format,
    show: { uom: 'end' },
  };
  tool.entityConfig = {
    entity: entity.entity_id,
    decimals,
  };
  tool.entity = entity;
  tool.card = { _hass: hass };
  tool.textEllipsis = (value) => value;

  return tool;
}

test('keeps Home Assistant precision when FHS has no decimal override', () => {
  const tool = createStateTool({
    state: '10.20',
    haFormattedValue: '10,2',
    haPrecision: 1,
  });

  tool.buildStateAndUom();

  assert.equal(tool.state, '10,2');
  assert.equal(tool.uom, '°C');
});

test('entity decimals override Home Assistant precision and retain trailing zero', () => {
  const trailingZero = createStateTool({
    state: '10.20',
    haFormattedValue: '10,2',
    haPrecision: 1,
    decimals: 2,
  });
  const twoDecimals = createStateTool({
    state: '10.22',
    haFormattedValue: '10,2',
    haPrecision: 1,
    decimals: 2,
  });

  trailingZero.buildStateAndUom();
  twoDecimals.buildStateAndUom();

  assert.equal(trailingZero.state, '10,20');
  assert.equal(twoDecimals.state, '10,22');
});

test('format decimal bounds override entity decimals last', () => {
  const tool = createStateTool({
    state: '10.20',
    haFormattedValue: '10,2',
    haPrecision: 1,
    decimals: 2,
    format: {
      decimals_min: 0,
      decimals_max: 2,
    },
  });

  tool.buildStateAndUom();

  assert.equal(tool.state, '10,2');
});
