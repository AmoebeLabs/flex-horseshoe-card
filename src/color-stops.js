// color-stops.js
//
// color_stops:
//   0: var(--theme-gradient-color-01)
//   10: var(--theme-gradient-color-02)

// colorstops:
//   colors:
//     0: '#49ce4b'
//     600: '#fed125'

// colorstops:
//   scales:
//     default:
//       min: 0
//       max: 5000
//   colors:
//     - value: 0
//       color: '#49ce4b'
//       rank: 1
//     - value: 600
//       color: '#fed125'
//       rank: 1

// Using templates in color stops is fully supported.
// color_stops:
//   "[[[ return states['input_number.low'].state; ]]]": |
//     [[[
//       return states['input_boolean.warning'].state === 'on'
//         ? 'red'
//         : 'green';
//     ]]]

// colorstops:
//   scales:
//     default:
//       min: |
//         [[[
//           return Number(states['input_number.scale_min'].state);
//         ]]]
//       max: |
//         [[[
//           return Number(states['input_number.scale_max'].state);
//         ]]]
//   colors:
//     - value: |
//         [[[
//           return Number(states['input_number.low'].state);
//         ]]]
//       color: '#49ce4b'
//       rank: 1
import Templates from './templates.js';

export default class ColorStops {
  static normalize(value) {
    if (!value) {
      return {
        scales: {},
        colors: [],
      };
    }

    // FHC list shape:
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

    // FHC dict shape:
    //
    // color_stops:
    //   0: red
    //   10: green
    if (ColorStops.isPlainObject(value) && !value.colors && !value.scales) {
      return {
        scales: {},
        colors: ColorStops.normalizeColors(value),
      };
    }

    // SAK v1/v2 shape:
    //
    // colorstops:
    //   scales:
    //     default:
    //       min: 0
    //       max: 5000
    //   colors:
    //     ...
    if (ColorStops.isPlainObject(value)) {
      return {
        scales: ColorStops.normalizeScales(value.scales),
        colors: ColorStops.normalizeColors(value.colors),
      };
    }

    return {
      scales: {},
      colors: [],
    };
  }

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

  // static normalizeColors(value) {
  //   if (!value) return [];

  //   // SAK v2:
  //   //
  //   // colors:
  //   //   - value: 0
  //   //     color: '#49ce4b'
  //   //     rank: 1
  //   if (Array.isArray(value)) {
  //     return value
  //       .map((entry) => ColorStops.normalizeColorEntry(entry))
  //       .filter(Boolean)
  //       .sort((a, b) => a.value - b.value);
  //   }

  //   // FHC current + SAK v1:
  //   //
  //   // color_stops:
  //   //   0: red
  //   //   10: blue
  //   //
  //   // or:
  //   //
  //   // colorstops:
  //   //   colors:
  //   //     0: red
  //   //     10: blue
  //   if (ColorStops.isPlainObject(value)) {
  //     return Object.entries(value)
  //       .map(([rawValue, color]) => {
  //         const numericValue = Number(rawValue);

  //         if (!Number.isFinite(numericValue)) return null;

  //         return {
  //           value: numericValue,
  //           color: String(color),
  //         };
  //       })
  //       .filter(Boolean)
  //       .sort((a, b) => a.value - b.value);
  //   }

  //   return [];
  // }

  // static normalizeColorEntry(entry) {
  //   if (!ColorStops.isPlainObject(entry)) return null;

  //   const value = Number(entry.value);

  //   if (!Number.isFinite(value)) return null;
  //   if (entry.color === undefined || entry.color === null) return null;

  //   return {
  //     ...entry,
  //     value,
  //     color: String(entry.color),
  //   };
  // }

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

    // FHC list-of-dicts shape:
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

  static normalizeColorPair(rawValue, color) {
    const numericValue = Number(rawValue);

    if (!Number.isFinite(numericValue)) return null;
    if (color === undefined || color === null) return null;

    return {
      value: numericValue,
      color: String(color),
    };
  }

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

  static isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  static _testColorStopsNormalizer() {
    const item = {
      entity_index: 0,
    };

    const tests = [
      {
        name: 'FHC dict',
        raw: {
          0: 'red',
          10: 'green',
          20: 'blue',
        },
      },

      {
        name: 'FHC dict with quoted keys',
        raw: {
          0: 'red',
          10: 'green',
          20: 'blue',
        },
      },

      {
        name: 'FHC list of dicts',
        raw: [{ 0: 'red' }, { 10: 'green' }, { 20: 'blue' }],
      },

      {
        name: 'FHC list of dicts with quoted keys',
        raw: [{ 0: 'red' }, { 10: 'green' }, { 20: 'blue' }],
      },

      {
        name: 'FHC dict with template values',
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
        name: 'FHC list with template values',
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
        name: 'FHC dict with template keys',
        raw: {
          '[[[ return 0; ]]]': 'red',
          '[[[ return 10; ]]]': 'green',
          '[[[ return 20; ]]]': 'blue',
        },
      },

      {
        name: 'FHC dict with template keys and values',
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
        name: 'FHC list with template keys and values',
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
        name: 'Whole FHC color_stops as template returning dict',
        raw: `[[[
        return {
          0: 'red',
          10: 'green',
          20: 'blue',
        };
      ]]]`,
      },

      {
        name: 'Whole FHC color_stops as template returning list',
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
