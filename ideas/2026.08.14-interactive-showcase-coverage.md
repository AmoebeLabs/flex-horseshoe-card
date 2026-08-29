# Interactive showcase coverage

## Purpose

Interactive showcases combine user documentation with visual regression testing. Flexible Horseshoe Card input entities and controls let one card exercise related configuration combinations without maintaining a separate card for every result.

Each showcase should:

- preserve older showcase versions for visual comparison;
- use named `fhs_input_select` values where the configuration itself uses named values;
- expose only combinations supported by the selected visualization;
- mark temporarily inapplicable controls as `unavailable` instead of removing them;
- position every control row through a named layout constant;
- remain useful as a readable configuration example.

## Existing coverage

### Horseshoe

The horseshoe showcase covers styles, scale and background modes, ticks, labels, offsets, widths, bar modes, scale bounds, and out-of-range state values.

### Cartesian sparkline

The cartesian showcase covers line, area, bar, dots, color transitions, smoothing, fade, line overlay, points, min/max, axes, grids, ticks, and labels.

### Radial barcode

The radial barcode showcase covers chart variants and segment visualizations.

### Interactive controls

The control showcases cover button, toggle, select, number, and linear/circular slider controls and their principal visual variants.

## Planned coverage

### 1. Cartesian history controls: v4

Extend the cartesian showcase with the shared historical-data pipeline:

- period type: `rolling_window` and `calendar`;
- duration, including the 24-hour minimum when switching from a shorter rolling window to a calendar day;
- calendar offset;
- automatic and fixed bins per hour;
- automatic-bin density;
- aggregation function.

The calendar offset control is unavailable for rolling windows. Density is unavailable when a fixed bin interval is selected. Changing any history setting must fetch and render the newly requested range without requiring another entity update.

### 2. Linear barcode showcase

Cover the regular barcode chart and its supported variants, spacing, color transitions, period settings, and touch tooltip behavior.

### 3. Equalizer and graded showcase

Use one card for these related level-based charts. Cover value buckets, square mode, row and column spacing, foreground/background styles, tracks, color stops, and historical versus real-time behavior. Type-specific controls use `visibility: unavailable`.

### 4. State bands showcase

Use a categorical source entity and cover state maps, radius, background padding, connection width, update interval, axes, ticks, labels, and transitions between named states.

### 5. Radial barcode v2

Extend the existing variant/viz matrix with ring size, line width, column and row spacing, background/foreground styling, day/night display, hour marks, and absolute/relative hour numbers.

## Verification

For every showcase:

1. Exercise every select option and toggle in light and dark mode.
2. Confirm unavailable controls cannot interact and return when their condition applies.
3. Confirm runtime configuration changes update geometry, history, colors, labels, and tooltips immediately.
4. Retain focused automated tests for bugs first exposed by showcase interaction.
5. Run the complete build before committing the showcase.
