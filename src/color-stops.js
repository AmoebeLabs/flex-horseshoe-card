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

export default class ColorStops {
  static normalize(value) {
    if (!value) {
      return {
        scales: {},
        colors: [],
      };
    }

    // FHC current shape:
    //
    // color_stops:
    //   0: red
    //   10: blue
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

  static normalizeColors(value) {
    if (!value) return [];

    // SAK v2:
    //
    // colors:
    //   - value: 0
    //     color: '#49ce4b'
    //     rank: 1
    if (Array.isArray(value)) {
      return value
        .map((entry) => ColorStops.normalizeColorEntry(entry))
        .filter(Boolean)
        .sort((a, b) => a.value - b.value);
    }

    // FHC current + SAK v1:
    //
    // color_stops:
    //   0: red
    //   10: blue
    //
    // or:
    //
    // colorstops:
    //   colors:
    //     0: red
    //     10: blue
    if (ColorStops.isPlainObject(value)) {
      return Object.entries(value)
        .map(([rawValue, color]) => {
          const numericValue = Number(rawValue);

          if (!Number.isFinite(numericValue)) return null;

          return {
            value: numericValue,
            color: String(color),
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.value - b.value);
    }

    return [];
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
}
