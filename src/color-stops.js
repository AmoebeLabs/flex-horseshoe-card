import Templates from './templates.js';

/**
 * Normalizes every supported color-stop config shape into one runtime object.
 *
 * The renderer expects a predictable structure: a scales dictionary and a sorted
 * colors array. This class accepts the compact FHS shapes, SAK-style shapes,
 * template output, and optional light/dark mode blocks.
 */
export default class ColorStops {
  /**
   * Converts a raw color-stop config into the normalized runtime shape.
   *
   * @param {object|Array<object>|undefined} value - Raw color-stop config or template output.
   * @param {string|undefined} mode - Active color-stop mode, usually light or dark.
   * @returns {{scales: object, colors: Array<object>}} Normalized color-stop config.
   */
  static normalize(value, mode) {
    // No config means no scales and no color stops; callers can render their fixed color path.
    if (!value) {
      return {
        scales: {},
        colors: [],
      };
    }

    // FHS list shape:
    //
    // color_stops:
    //   - 0: red
    //   - 10: green
    //
    // Or template returning:
    //
    // return [
    //   { 0: 'red' },
    //   { 10: 'green' },
    // ];
    if (Array.isArray(value)) {
      return {
        scales: {},
        colors: ColorStops.normalizeColors(value),
      };
    }

    // FHS dict shape:
    //
    // color_stops:
    //   0: red
    //   10: green
    if (ColorStops.isPlainObject(value) && !value.colors && !value.scales && !value.modes) {
      return {
        scales: {},
        colors: ColorStops.normalizeColors(value),
      };
    }

    // SAK v1/v2 shape:
    //
    // colorstops:
    //   any_field...
    //   scales:
    //     default:
    //       min: 0
    //       max: 5000
    //   colors:
    //     ...
    if (ColorStops.isPlainObject(value)) {
      return {
        ...value,
        scales: ColorStops.normalizeScales(value.scales),
        colors: ColorStops.normalizeColors(ColorStops.getDarkOrLightColors(value, mode)),
      };
    }

    return {
      scales: {},
      colors: [],
    };
  }

  /**
   * Selects the active mode-specific color list or falls back to the default list.
   *
   * @param {object} value - Color-stop config containing colors and optional modes.
   * @param {string|undefined} mode - Active color-stop mode, usually light or dark.
   * @returns {object|Array<object>|undefined} Raw colors block for the active mode.
   */
  static getDarkOrLightColors(value, mode) {
    const standardColors = value.colors;
    const darkOrLightColors = mode && ColorStops.isPlainObject(value.modes) ? value.modes[mode] : undefined;

    if (darkOrLightColors === undefined || darkOrLightColors === null) {
      return standardColors;
    }

    return darkOrLightColors;
  }

  /**
   * Normalizes optional named scale definitions while preserving their fields.
   *
   * @param {object|undefined} value - Raw scales dictionary.
   * @returns {object} Normalized scales dictionary.
   */
  static normalizeScales(value) {
    if (!ColorStops.isPlainObject(value)) return {};

    return Object.fromEntries(
      Object.entries(value).map(([scaleName, scale]) => [
        scaleName,
        ColorStops.isPlainObject(scale)
          ? {
              ...scale,
            }
          : scale,
      ]),
    );
  }

  /**
   * Normalizes a colors block into sorted color-stop entries.
   *
   * @param {object|Array<object>|undefined} value - Raw colors block.
   * @returns {Array<object>} Sorted color-stop entries with numeric values.
   */
  static normalizeColors(value) {
    if (!value) return [];

    // Array supports both:
    //
    // colors:
    //   - value: 10
    //     color: red
    //
    // and:
    //
    // color_stops:
    //   - 10: red
    //   - 20: green
    if (Array.isArray(value)) {
      // flatMap keeps both supported array shapes in one sequential flow.
      return value
        .flatMap((entry) => ColorStops.normalizeColorArrayEntry(entry))
        .filter(Boolean)
        .sort((a, b) => a.value - b.value);
    }

    // Dict:
    //
    // color_stops:
    //   10: red
    //   20: green
    if (ColorStops.isPlainObject(value)) {
      return Object.entries(value)
        .map(([rawValue, color]) => ColorStops.normalizeColorPair(rawValue, color))
        .filter(Boolean)
        .sort((a, b) => a.value - b.value);
    }

    return [];
  }

  /**
   * Normalizes one array entry, supporting explicit entries and list-of-dicts entries.
   *
   * @param {object} entry - One raw array entry from the colors list.
   * @returns {Array<object>} Zero, one, or many normalized color-stop entries.
   */
  static normalizeColorArrayEntry(entry) {
    // SAK v2 shape:
    //
    // - value: 10
    //   color: red
    // eslint-disable-next-line prefer-object-has-own
    if (ColorStops.isPlainObject(entry) && Object.prototype.hasOwnProperty.call(entry, 'value') && Object.prototype.hasOwnProperty.call(entry, 'color')) {
      const normalizedEntry = ColorStops.normalizeColorEntry(entry);
      return normalizedEntry ? [normalizedEntry] : [];
    }

    // FHS list-of-dicts shape:
    //
    // - 10: red
    // - 20: green
    if (ColorStops.isPlainObject(entry)) {
      return Object.entries(entry)
        .map(([rawValue, color]) => ColorStops.normalizeColorPair(rawValue, color))
        .filter(Boolean);
    }

    return [];
  }

  /**
   * Normalizes a compact value/color pair into the canonical stop shape.
   *
   * @param {string|number} rawValue - Color-stop value from an object key.
   * @param {string} color - Color configured for that value.
   * @returns {object|null} Normalized color-stop entry or null when invalid.
   */
  static normalizeColorPair(rawValue, color) {
    const numericValue = Number(rawValue);

    if (!Number.isFinite(numericValue)) return null;
    if (color === undefined || color === null) return null;

    return {
      value: numericValue,
      color: String(color),
    };
  }

  /**
   * Normalizes an explicit color-stop entry while preserving extra metadata.
   *
   * Fields such as rank, state, label, or future metadata must survive because
   * other runtime layers can use them after color-stop normalization.
   *
   * @param {object} entry - Raw explicit color-stop entry.
   * @returns {object|null} Normalized color-stop entry or null when invalid.
   */
  static normalizeColorEntry(entry) {
    if (!ColorStops.isPlainObject(entry)) return null;

    const value = Number(entry.value);

    if (!Number.isFinite(value)) return null;
    if (entry.color === undefined || entry.color === null) return null;

    return {
      ...entry,
      value,
      color: String(entry.color),
    };
  }

  /**
   * Duplicates a single stop at maxValue so segment builders have a span to draw.
   *
   * @param {object} colorStops - Normalized color-stop config.
   * @param {number} maxValue - Scale maximum used for the synthetic stop.
   * @returns {object} Color-stop config with at least two stops when possible.
   */
  static ensureMinimumStops(colorStops, maxValue) {
    if (!colorStops?.colors || colorStops.colors.length !== 1) {
      return colorStops;
    }

    return {
      ...colorStops,
      colors: [
        colorStops.colors[0],
        {
          value: maxValue,
          color: colorStops.colors[0].color,
        },
      ],
    };
  }

  /**
   * Checks for plain object config blocks.
   *
   * @param {*} value - Value to check.
   * @returns {boolean} True when the value is a non-array object.
   */
  static isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  /**
   * Manual normalizer smoke test for supported config shapes and template output.
   *
   * This is intentionally kept in this file because it documents the accepted
   * input shapes next to the normalization code that handles them.
   */
  static _testColorStopsNormalizer() {
    const item = {
      entity_index: 0,
    };

    const tests = [
      {
        name: 'FHS dict',
        raw: {
          0: 'red',
          10: 'green',
          20: 'blue',
        },
      },

      {
        name: 'FHS dict with quoted keys',
        raw: {
          0: 'red',
          10: 'green',
          20: 'blue',
        },
      },

      {
        name: 'FHS list of dicts',
        raw: [{ 0: 'red' }, { 10: 'green' }, { 20: 'blue' }],
      },

      {
        name: 'FHS list of dicts with quoted keys',
        raw: [{ 0: 'red' }, { 10: 'green' }, { 20: 'blue' }],
      },

      {
        name: 'FHS dict with template values',
        raw: {
          0: `[[[
          return 'red';
        ]]]`,
          10: `[[[
          return 'green';
        ]]]`,
          20: `[[[
          return 'blue';
        ]]]`,
        },
      },

      {
        name: 'FHS list with template values',
        raw: [
          {
            0: `[[[
            return 'red';
          ]]]`,
          },
          {
            10: `[[[
            return 'green';
          ]]]`,
          },
          {
            20: `[[[
            return 'blue';
          ]]]`,
          },
        ],
      },

      {
        name: 'FHS dict with template keys',
        raw: {
          '[[[ return 0; ]]]': 'red',
          '[[[ return 10; ]]]': 'green',
          '[[[ return 20; ]]]': 'blue',
        },
      },

      {
        name: 'FHS dict with template keys and values',
        raw: {
          '[[[ return 0; ]]]': `[[[
          return 'red';
        ]]]`,
          '[[[ return 10; ]]]': `[[[
          return 'green';
        ]]]`,
          '[[[ return 20; ]]]': `[[[
          return 'blue';
        ]]]`,
        },
      },

      {
        name: 'FHS list with template keys and values',
        raw: [
          {
            '[[[ return 0; ]]]': `[[[
            return 'red';
          ]]]`,
          },
          {
            '[[[ return 10; ]]]': `[[[
            return 'green';
          ]]]`,
          },
          {
            '[[[ return 20; ]]]': `[[[
            return 'blue';
          ]]]`,
          },
        ],
      },

      {
        name: 'Whole FHS color_stops as template returning dict',
        raw: `[[[
        return {
          0: 'red',
          10: 'green',
          20: 'blue',
        };
      ]]]`,
      },

      {
        name: 'Whole FHS color_stops as template returning list',
        raw: `[[[
        return [
          { 0: 'red' },
          { 10: 'green' },
          { 20: 'blue' },
        ];
      ]]]`,
      },

      {
        name: 'SAK v1 colorstops.colors dict',
        raw: {
          colors: {
            0: 'red',
            10: 'green',
            20: 'blue',
          },
        },
      },

      {
        name: 'SAK v1 colorstops.colors dict with template keys',
        raw: {
          colors: {
            '[[[ return 0; ]]]': 'red',
            '[[[ return 10; ]]]': 'green',
            '[[[ return 20; ]]]': 'blue',
          },
        },
      },

      {
        name: 'SAK v1 colorstops.colors dict with template values',
        raw: {
          colors: {
            0: `[[[
            return 'red';
          ]]]`,
            10: `[[[
            return 'green';
          ]]]`,
            20: `[[[
            return 'blue';
          ]]]`,
          },
        },
      },

      {
        name: 'SAK v2 colors list',
        raw: {
          scales: {
            default: {
              min: 0,
              max: 20,
            },
          },
          colors: [
            {
              value: 0,
              color: 'red',
            },
            {
              value: 10,
              color: 'green',
            },
            {
              value: 20,
              color: 'blue',
            },
          ],
        },
      },

      {
        name: 'SAK v2 colors list unsorted',
        raw: {
          scales: {
            default: {
              min: 0,
              max: 20,
            },
          },
          colors: [
            {
              value: 20,
              color: 'blue',
              rank: 2,
            },
            {
              value: 0,
              color: 'red',
              rank: 1,
            },
            {
              value: 10,
              color: 'green',
              rank: 1,
            },
          ],
        },
      },

      {
        name: 'SAK v2 colors list with template values',
        raw: {
          scales: {
            default: {
              min: `[[[
              return 0;
            ]]]`,
              max: `[[[
              return 20;
            ]]]`,
            },
          },
          colors: [
            {
              value: `[[[
              return 0;
            ]]]`,
              color: `[[[
              return 'red';
            ]]]`,
            },
            {
              value: `[[[
              return 10;
            ]]]`,
              color: `[[[
              return 'green';
            ]]]`,
            },
            {
              value: `[[[
              return 20;
            ]]]`,
              color: `[[[
              return 'blue';
            ]]]`,
            },
          ],
        },
      },

      {
        name: 'SAK v2 whole colors list as template',
        raw: {
          scales: {
            default: {
              min: 0,
              max: 20,
            },
          },
          colors: `[[[
          return [
            { value: 0, color: 'red' },
            { value: 10, color: 'green' },
            { value: 20, color: 'blue' },
          ];
        ]]]`,
        },
      },
    ];

    const expectedColors = [
      {
        value: 0,
        color: 'red',
      },
      {
        value: 10,
        color: 'green',
      },
      {
        value: 20,
        color: 'blue',
      },
    ];

    tests.forEach((test) => {
      // Templates are resolved first because normalize() expects final values and numeric keys.
      const resolved = Templates.getJsTemplateOrValue(item, test.raw, { resolveKeys: true });

      const normalized = ColorStops.normalize(resolved);

      const simpleColors = normalized.colors.map((entry) => ({
        value: entry.value,
        color: entry.color,
      }));

      const passed = JSON.stringify(simpleColors) === JSON.stringify(expectedColors);

      console.log(`[colorstops test] ${passed ? 'PASS' : 'FAIL'} - ${test.name}`, {
        raw: test.raw,
        resolved,
        normalized,
        simpleColors,
        expectedColors,
      });
    });
  }
}
