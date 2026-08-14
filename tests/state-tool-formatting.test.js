import test from 'node:test';
import assert from 'node:assert/strict';
import StateTool from '../src/state-tool.js';

/**
 * Creates the complete formatter boundary without constructing SVG/Lit state.
 * HA formatter output is supplied by each test so FHS can be checked against
 * the exact ordered parts it receives at runtime.
 */
function createStateTool({
  state = '10.20',
  parts = [{ type: 'value', value: '10.20' }],
  attribute,
  attributeValue,
  attributes = {},
  decimals,
  unit,
  convert,
  format,
  haPrecision = 2,
  locale = { language: 'en-US', number_format: 'comma_decimal', time_format: '24' },
}) {
  const entity = {
    entity_id: 'sensor.formatting_test',
    state,
    attributes: {
      device_class: 'temperature',
      unit_of_measurement: '°C',
      step: 0.01,
      ...attributes,
    },
  };

  if (attribute !== undefined) entity.attributes[attribute] = attributeValue;

  const calls = {
    state: [],
    attribute: [],
  };
  const hass = {
    language: locale.language,
    selectedLanguage: locale.language,
    locale,
    entities: {
      [entity.entity_id]: {
        entity_id: entity.entity_id,
        display_precision: haPrecision,
      },
    },
    states: {
      [entity.entity_id]: entity,
    },
    formatEntityStateToParts: (_entity, value) => {
      calls.state.push(value);
      return parts.map((part) => ({ ...part }));
    },
    formatEntityAttributeValueToParts: (_entity, name, value) => {
      calls.attribute.push({ name, value });
      return parts.map((part) => ({ ...part }));
    },
  };
  const tool = Object.create(StateTool.prototype);

  tool.config = {
    format,
    show: { uom: 'end' },
  };
  tool.entityConfig = {
    entity: entity.entity_id,
    attribute,
    decimals,
    unit,
    convert,
  };
  tool.entity = entity;
  tool.card = { _hass: hass };
  tool.textEllipsis = (value) => value;

  return { tool, calls };
}

test('returns Home Assistant parts unchanged when FHS has no override', () => {
  const haParts = [
    { type: 'value', value: '1,234.50' },
    { type: 'literal', value: ' ' },
    { type: 'unit', value: '°C' },
  ];
  const { tool, calls } = createStateTool({ state: '1234.50', parts: haParts });

  assert.deepEqual(tool.formatEntityStateParts(), haParts);
  assert.deepEqual(calls.state, ['1234.50']);

  tool.buildStateAndUom();

  assert.equal(tool.state, '1,234.50');
  assert.equal(tool.uom, '°C');
});

test('uses the HA attribute formatter and preserves its complete parts array', () => {
  const haParts = [
    { type: 'literal', value: '~' },
    { type: 'value', value: '45.2' },
    { type: 'literal', value: ' approximately ' },
    { type: 'unit', value: '%' },
  ];
  const { tool, calls } = createStateTool({
    attribute: 'humidity',
    attributeValue: 45.2,
    parts: haParts,
  });

  assert.deepEqual(tool.formatEntityStateParts(), haParts);
  assert.deepEqual(calls.attribute, [{ name: 'humidity', value: undefined }]);

  tool.buildStateAndUom();

  assert.equal(tool.state, '~45.2 approximately');
  assert.equal(tool.uom, '%');
});

test('raw_state_keep bypasses HA formatting and raw_state_clean only cleans that raw value', () => {
  const raw = createStateTool({
    state: 'heat_pump_active',
    parts: [{ type: 'value', value: 'Heat pump active' }],
    format: { raw_state_keep: true },
  });
  const clean = createStateTool({
    state: 'heat_pump_active',
    parts: [{ type: 'value', value: 'Heat pump active' }],
    format: { raw_state_keep: true, raw_state_clean: true },
  });

  assert.deepEqual(raw.tool.formatEntityStateParts(), [{ type: 'value', value: 'heat_pump_active' }]);
  assert.deepEqual(clean.tool.formatEntityStateParts(), [{ type: 'value', value: 'heat pump active' }]);
  assert.deepEqual(raw.calls.state, []);
  assert.deepEqual(clean.calls.state, []);
});

test('raw_state_clean alone leaves Home Assistant formatting active', () => {
  const haParts = [{ type: 'value', value: 'Heat pump active' }];
  const { tool, calls } = createStateTool({
    state: 'heat_pump_active',
    parts: haParts,
    format: { raw_state_clean: true },
  });

  assert.deepEqual(tool.formatEntityStateParts(), haParts);
  assert.deepEqual(calls.state, ['heat_pump_active']);
});

test('decimals replace only the digit-bearing value part of split negative currency', () => {
  const { tool } = createStateTool({
    state: '-3.91',
    decimals: 1,
    parts: [
      { type: 'value', value: '-' },
      { type: 'unit', value: '£' },
      { type: 'value', value: '3.91' },
    ],
  });

  assert.deepEqual(tool.formatEntityStateParts(), [
    { type: 'value', value: '-' },
    { type: 'unit', value: '£' },
    { type: 'value', value: '3.9' },
  ]);

  tool.buildStateAndUom();

  assert.equal(tool.state, '-3.9');
  assert.equal(tool.uom, '£');
});

test('decimals retain a sign already combined with the numeric value part', () => {
  const { tool } = createStateTool({
    state: '-3.91',
    decimals: 1,
    format: { locale: 'nl-NL' },
    parts: [
      { type: 'value', value: '-3,91' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: '€' },
    ],
  });

  assert.deepEqual(tool.formatEntityStateParts(), [
    { type: 'value', value: '-3,9' },
    { type: 'literal', value: ' ' },
    { type: 'unit', value: '€' },
  ]);
});

test('currency before and after the number retains native part order', () => {
  const before = createStateTool({
    state: '3.91',
    decimals: 1,
    parts: [
      { type: 'unit', value: '$' },
      { type: 'value', value: '3.91' },
    ],
  }).tool;
  const after = createStateTool({
    state: '3.91',
    decimals: 1,
    format: { locale: 'nl-NL' },
    parts: [
      { type: 'value', value: '3,91' },
      { type: 'literal', value: '\u00a0' },
      { type: 'unit', value: '€' },
    ],
  }).tool;

  assert.deepEqual(before.formatEntityStateParts(), [
    { type: 'unit', value: '$' },
    { type: 'value', value: '3.9' },
  ]);
  assert.deepEqual(after.formatEntityStateParts(), [
    { type: 'value', value: '3,9' },
    { type: 'literal', value: '\u00a0' },
    { type: 'unit', value: '€' },
  ]);
});

test('Unicode decimal digits identify the numeric value part', () => {
  const { tool } = createStateTool({
    state: '3.91',
    decimals: 1,
    format: { locale: 'ar-EG' },
    parts: [
      { type: 'unit', value: 'ر.س.' },
      { type: 'literal', value: '\u00a0' },
      { type: 'value', value: '٣٫٩١' },
    ],
  });
  const expected = new Intl.NumberFormat('ar-EG', {
    useGrouping: true,
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(3.91);

  assert.deepEqual(tool.formatEntityStateParts(), [
    { type: 'unit', value: 'ر.س.' },
    { type: 'literal', value: '\u00a0' },
    { type: 'value', value: expected },
  ]);
});

const numberOverrideCases = [
  {
    name: 'decimals changes only precision',
    decimals: 1,
    format: undefined,
    expected: '1,234.6',
  },
  {
    name: 'separator false removes only grouping',
    decimals: undefined,
    format: { separator: false },
    expected: '1234.56',
  },
  {
    name: 'locale changes only number locale',
    decimals: undefined,
    format: { locale: 'nl-NL' },
    expected: '1.234,56',
  },
  {
    name: 'decimals combine with separator false',
    decimals: 1,
    format: { separator: false },
    expected: '1234.6',
  },
  {
    name: 'decimals combine with locale',
    decimals: 1,
    format: { locale: 'nl-NL' },
    expected: '1.234,6',
  },
  {
    name: 'locale combines with separator false',
    decimals: undefined,
    format: { locale: 'nl-NL', separator: false },
    expected: '1234,56',
  },
  {
    name: 'decimal bounds allow variable precision',
    state: '1234.50',
    decimals: 2,
    format: { decimals_min: 0, decimals_max: 2 },
    expected: '1,234.5',
  },
  {
    name: 'decimal minimum is capped by maximum',
    state: '1234.56',
    decimals: undefined,
    format: { decimals_min: 3, decimals_max: 1 },
    expected: '1,234.6',
  },
];

for (const testCase of numberOverrideCases) {
  test(testCase.name, () => {
    const state = testCase.state ?? '1234.56';
    const parts = [
      { type: 'value', value: '1,234.56' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'W' },
    ];
    const { tool } = createStateTool({
      state,
      parts,
      decimals: testCase.decimals,
      format: testCase.format,
    });
    const result = tool.formatEntityStateParts();

    assert.equal(result[0].value, testCase.expected);
    assert.deepEqual(result.slice(1), parts.slice(1));
  });

  test(`${testCase.name} for a negative value`, () => {
    const state = `-${testCase.state ?? '1234.56'}`;
    const parts = [
      { type: 'value', value: '-1,234.56' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'W' },
    ];
    const { tool } = createStateTool({
      state,
      parts,
      decimals: testCase.decimals,
      format: testCase.format,
    });
    const result = tool.formatEntityStateParts();

    assert.equal(result[0].value, `-${testCase.expected}`);
    assert.deepEqual(result.slice(1), parts.slice(1));
  });
}

test('entity decimals retain the Home Assistant number format preference', () => {
  const { tool } = createStateTool({
    state: '1234.56',
    decimals: 1,
    locale: {
      language: 'en-US',
      number_format: 'decimal_comma',
      time_format: '24',
    },
    parts: [
      { type: 'value', value: '1.234,56' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'W' },
    ],
  });

  assert.deepEqual(tool.formatEntityStateParts(), [
    { type: 'value', value: '1.234,6' },
    { type: 'literal', value: ' ' },
    { type: 'unit', value: 'W' },
  ]);
});

test('convert changes the value before decimals formatting', () => {
  const { tool, calls } = createStateTool({
    state: '123',
    convert: 'divide(10)',
    decimals: 1,
    parts: [
      { type: 'value', value: '12.3' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'W' },
    ],
  });

  assert.deepEqual(tool.formatEntityStateParts(), [
    { type: 'value', value: '12.3' },
    { type: 'literal', value: ' ' },
    { type: 'unit', value: 'W' },
  ]);
  assert.deepEqual(calls.state, ['12.3']);
});

test('numeric converters preserve precision for the later formatter', () => {
  const cases = [
    ['brightness_pct', '128', '50'],
    ['multiply(10)', '1.23', '12.3'],
    ['divide(10)', '123', '12.3'],
    ['multiply(10)', '-1.23', '-12.3'],
    ['divide(10)', '-123', '-12.3'],
  ];

  for (const [convert, state, expected] of cases) {
    assert.equal(StateTool.buildState(state, { convert, entity: 'sensor.formatting_test' }, { states: {} }, {}), expected);
  }
});

test('unit and decimals change only their own parts', () => {
  const { tool } = createStateTool({
    state: '12.34',
    decimals: 1,
    unit: 'kW',
    parts: [
      { type: 'value', value: '12.34' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'W' },
    ],
  });

  assert.deepEqual(tool.formatEntityStateParts(), [
    { type: 'value', value: '12.3' },
    { type: 'literal', value: ' ' },
    { type: 'unit', value: 'kW' },
  ]);
});

test('string formatters transform their value before HA builds parts', async (t) => {
  const timestamp = new Date('2024-01-15T13:45:30Z');
  const locale = { language: 'en-GB', number_format: 'comma_decimal', time_format: '24' };
  const dateCases = [
    ['datetime', new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(timestamp)],
    ['datetime-short', new Intl.DateTimeFormat('en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(timestamp)],
    ['datetime-short_with-year', new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(timestamp)],
    ['datetime_seconds', new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(timestamp)],
    ['datetime-numeric', new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: false }).format(timestamp)],
    ['date', new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }).format(timestamp)],
    ['date_month', new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(timestamp)],
    ['date_month_year', new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(timestamp)],
    ['date-short', new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(timestamp)],
    ['date-numeric', new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric' }).format(timestamp)],
    ['date_weekday', new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(timestamp)],
    ['date_weekday_day', new Intl.DateTimeFormat('en-GB', { weekday: 'long', month: 'long', day: 'numeric' }).format(timestamp)],
    ['date_weekday-short', new Intl.DateTimeFormat('en-GB', { weekday: 'short' }).format(timestamp)],
    ['time', new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: '2-digit', hour12: false }).format(timestamp)],
    ['time-24h', new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: '2-digit', hour12: false }).format(timestamp)],
    ['time-24h_date-short', new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(timestamp)],
    ['time_weekday', new Intl.DateTimeFormat('en-GB', { weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false }).format(timestamp)],
    ['time_seconds', new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(timestamp)],
  ];

  for (const [format, expected] of dateCases) {
    await t.test(format, () => {
      const { tool, calls } = createStateTool({
        state: timestamp.toISOString(),
        format,
        locale,
        parts: [{ type: 'value', value: expected }],
      });

      tool.formatEntityStateParts();

      assert.deepEqual(calls.state, [expected]);
    });
  }

  const simpleCases = [
    ['brightness', '128', '50 %'],
    ['brightness_pct', '128', '50 %'],
    ['duration', '3661', '1:01:01'],
    ['total', '3661', 'Not Yet Supported'],
  ];

  for (const [format, state, expected] of simpleCases) {
    await t.test(format, () => {
      const { tool, calls } = createStateTool({
        state,
        format,
        parts: [{ type: 'value', value: expected }],
      });

      tool.formatEntityStateParts();

      assert.deepEqual(calls.state, [expected]);
    });
  }
});

test('relative and recent time formatters use the current time boundary', () => {
  const locale = { language: 'en-GB', number_format: 'comma_decimal', time_format: '24' };
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const recent = new Date(Date.now() - 5 * 60 * 1000);
  const relative = createStateTool({
    state: twoHoursAgo.toISOString(),
    format: 'relative',
    locale,
    parts: [{ type: 'value', value: '2 hours ago' }],
  });
  const recentTime = new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  }).format(recent);
  const recentTool = createStateTool({
    state: recent.toISOString(),
    format: 'time-24h_date-short',
    locale,
    parts: [{ type: 'value', value: recentTime }],
  });

  relative.tool.formatEntityStateParts();
  recentTool.tool.formatEntityStateParts();

  assert.deepEqual(relative.calls.state, ['2 hours ago']);
  assert.deepEqual(recentTool.calls.state, [recentTime]);
});

test('invalid date input passes through unchanged', () => {
  const { tool, calls } = createStateTool({
    state: 'not-a-date',
    format: 'datetime',
    parts: [{ type: 'value', value: 'not-a-date' }],
  });

  tool.formatEntityStateParts();

  assert.deepEqual(calls.state, ['not-a-date']);
});
