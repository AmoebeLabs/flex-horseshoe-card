---
template: main.html
title: Sparkline Specialized Charts
description: Configure equalizer, graded, state bands, barcode, and radial barcode history charts, including their colors, styling, axes, and touch tooltips.
tags:
- Section
- Sparkline
- Barcode
- State Bands
---

# Sparkline specialized charts

Specialized charts offer different ways to display historical data without using a conventional line or area chart. Equalizer and graded charts highlight numeric levels, state bands show how named states change over time, and barcode charts use color to make changes in value easy to recognize.

## :material-horseshoe: Shared color behavior

Specialized charts can calculate a separate color for each displayed bin or level. Use `colorstops_transition` to choose between clearly defined color thresholds and smooth transitions between the configured colors.

```yaml linenums="1"
sparkline:
  colorstops_transition: smooth
  color_stops:
    colors:
      - value: 0
        color: '#49ce4b'
      - value: 50
        color: '#fed125'
      - value: 100
        color: '#e9343d'
```

See [Color Stops](../core-concepts/color-stops.md) for reusable color-stop templates and threshold definitions.

## :material-horseshoe: Equalizer chart

### Basic usage

An equalizer divides the visible Y range into a configurable number of levels. For each time bin, it highlights the levels that correspond to the recorded value.

|                                                                Equalizer chart                                                                |
| :-------------------------------------------------------------------------------------------------------------------------------------------: |
| ![Flexible Horseshoe Card - Sparkline Equalizer Chart](../assets/screenshots/fhs-demo-card-equalizer-study-temperature--dark.webp){width=300} |

```yaml linenums="1"
sparkline:
  show:
    chart_type: equalizer
  equalizer:
    value_buckets: 10
    square: false
```

### Configuration fields

| Field                      |     Required     | Default | Description                                             |
| :------------------------- | :--------------: | :------ | :------------------------------------------------------ |
| `show.chart_type`          | :material-check: |         | Use `equalizer` to display an equalizer chart.          |
| `equalizer.value_buckets`  | :material-close: | `10`    | The number of vertical value levels shown in the chart. |
| `equalizer.square`         | :material-close: | `false` | Displays square levels when enabled.                    |
| `equalizer.column_spacing` | :material-close: | `1`     | The amount of space between consecutive time bins.      |
| `equalizer.row_spacing`    | :material-close: | `1`     | The amount of space between value levels.               |

### Styling

Equalizer levels use the configured entity color, line colors, or color stops. When color stops are calculated per bin, the chart can communicate both the value and its threshold state at a glance.

### Period support

| `real_time` | `rolling_window` | `calendar` |
| :-: | :-: | :-: |
| :material-check: | :material-check: | :material-check: |

### Axes, grid, labels, and tooltip

| Display element       | Support         |
| :-------------------- | :-------------- |
| X-axis                | Yes, automatic. |
| Y-axis                | Yes, automatic. |
| Grid                  | X and Y.        |
| Tick marks            | X and Y.        |
| Labels                | X and Y.        |
| Tooltip and indicator | No.             |

## :material-horseshoe: Graded chart

### Basic usage

A graded chart assigns each bin value to one of the ranks defined by its color stops. This is useful when the category or grade matters more than the value’s exact numeric position.

```yaml linenums="1"
sparkline:
  show:
    chart_type: graded
  graded:
    square: false
```

Add ranks to the color-stop entries when their visual order should differ from their numeric definition order.

### Configuration fields

| Field                     |     Required     | Default | Description                                                       |
| :------------------------ | :--------------: | :------ | :---------------------------------------------------------------- |
| `show.chart_type`         | :material-check: |         | Use `graded` to display a graded chart.                           |
| `graded.square`           | :material-close: | `false` | Displays square grade indicators when enabled.                    |
| `equalizer.value_buckets` | :material-close: | `10`    | The number of grade levels visible in the chart.                  |
| `color_stops.colors`      | :material-check: |         | Defines the values, colors, and optional ranks used by the chart. |

### Styling

The ranks in the configured color stops determine which grade is shown and which color it uses. Color-stop templates are especially useful when several cards share the same grading scale.

### Period support

| `real_time` | `rolling_window` | `calendar` |
| :-: | :-: | :-: |
| :material-check: | :material-check: | :material-check: |

### Axes, grid, labels, and tooltip

| Display element       | Support |
| :-------------------- | :------ |
| X-axis                | No.     |
| Y-axis                | No.     |
| Grid                  | No.     |
| Tick marks            | No.     |
| Labels                | No.     |
| Tooltip and indicator | No.     |

## :material-horseshoe: State bands chart

### Basic usage

A state bands chart places each mapped entity state on its own row. The width of a horizontal segment shows how long that state remained active. Rounded connections between rows make changes from one state to another easy to follow.

|                                                               State bands chart                                                               |
| :-------------------------------------------------------------------------------------------------------------------------------------------: |
| ![Flexible Horseshoe Card - Sparkline State Bands Chart](../assets/screenshots/fhs-demo-card-state_band-pollen-kruiden--dark.webp){width=300} |

```yaml linenums="1"
sparkline:
  show:
    chart_type: state_bands
    grid:
      x: true
      y: true
    axis:
      x: true
      y: true
    labels:
      x: true
      y: true

  state_map:
    type: state_value
    map:
      - state: low
        value: 0
        label: Low
      - state: moderate
        value: 1
        label: Moderate
      - state: high
        value: 2
        label: High
      - state: very_high
        value: 3
        label: Very high

  color_stops:
    colors:
      - value: 0
        color: lightgray
      - value: 1
        color: '#f1c40f'
      - value: 2
        color: '#e67e22'
      - value: 3
        color: '#e74c3c'
```

The `value` determines both the vertical row and the matching color stop. When `label` is omitted, the translated Home Assistant state label is used where available.

State bands always use discrete colors. Smooth interpolation between color stops does not apply to this chart type.

### Configuration fields

| Field                                     |     Required     | Default           | Description                                                                                               |
| :---------------------------------------- | :--------------: | :---------------- | :-------------------------------------------------------------------------------------------------------- |
| `show.chart_type`                         | :material-check: |                   | Use `state_bands` to display a state bands chart.                                                         |
| `state_map.type`                          | :material-check: |                   | Use `state_value` to map named states to numeric rows.                                                    |
| `state_map.map`                           | :material-check: |                   | Defines each source state, its numeric row value, and an optional display label.                          |
| `color_stops.colors`                      | :material-close: | `[]`              | Assigns a color to each mapped value. When no color stops are configured, the normal graph color is used. |
| `state_bands.radius`                      | :material-close: | `0.5`             | Controls the corner radius of the foreground segments.                                                    |
| `state_bands.update_interval`             | :material-close: | `5min`            | Determines how often the current segment advances while the entity state remains unchanged.               |
| `state_bands.styles`                      | :material-close: | `stroke-width: 0` | Applies styles to the foreground state segments.                                                          |
| `state_bands.background.padding`          | :material-close: | `0.75`            | Controls the visible border around the foreground segments.                                               |
| `state_bands.background.connection_width` | :material-close: | `0.375`           | Controls the width of the transition connections between rows.                                            |
| `state_bands.background.styles`           | :material-close: | `opacity: 0.3`    | Applies styles to the connected background layer.                                                         |

### Styling

Each foreground segment uses the color stop assigned to its mapped value. The separate background layer follows the same row colors and connects consecutive segments.

Use `state_bands.styles` to style the foreground segments and `state_bands.background.styles` to style the connected layer behind them.

### Period support

| `real_time` | `rolling_window` | `calendar` |
| :-: | :-: | :-: |
| :material-close: | :material-check: | :material-check: |

### Axes, grid, labels, and tooltip

| Display element       | Support                       |
| :-------------------- | :---------------------------- |
| X-axis                | Yes, automatic time axis.     |
| Y-axis                | Yes, categorical state rows.  |
| Grid                  | X ticks and Y row separators. |
| Tick marks            | X and Y.                      |
| Labels                | X times and Y state labels.   |
| Tooltip and indicator | Yes, per state segment.       |

Move the pointer or a finger across the chart to inspect a state period. The indicator snaps to the center of the active segment. The tooltip then shows the state, start time, end time, and duration.

## :material-horseshoe: Barcode chart

### Basic usage

A barcode chart draws one narrow colored segment for each time bin. Time runs from left to right, while the color of each segment represents its value.

The examples below show several available variations. The top sparkline displays the current day using radial barcode, audio, and `rice_grain` visualizations. The six sparklines below it show the previous week, with the average in the center and the minimum and maximum values at the bottom.

|                                                               Barcode                                                               |                                                             Barcode - Audio variant                                                             |
| :---------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------: |
| ![Flexible Horseshoe Card - Sparkline Barcode Chart](../assets/screenshots/fhs-demo-card-study-temperature-week-barcode--dark.webp) | ![Flexible Horseshoe Card - Sparkline Barcode/Audio Chart](../assets/screenshots/fhs-demo-card-study-temperature-week-barcode-audio--dark.webp) |

|                                                                Barcode - Stalactites variant                                                                |                                                                Barcode - Stalagmites variant                                                                |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------: |
| ![Flexible Horseshoe Card - Sparkline Barcode/Stalactites Chart](../assets/screenshots/fhs-demo-card-study-temperature-week-barcode-stalactites--dark.webp) | ![Flexible Horseshoe Card - Sparkline Barcode/Stalagmites Chart](../assets/screenshots/fhs-demo-card-study-temperature-week-barcode-stalagmites--dark.webp) |

```yaml linenums="1"
sparkline:
  show:
    chart_type: barcode
    chart_variant: audio
  colorstops_transition: smooth
  color_stops:
    colors:
      - value: 0
        color: '#3498db'
      - value: 50
        color: '#2ecc71'
      - value: 100
        color: '#e74c3c'
```

Each segment uses the value of its own time bin. The current entity state is therefore not applied to the entire historical barcode.

Leave `chart_variant` unset to display full-height segments. Use `audio` for centered value bars, `stalactites` for bars that grow downward from the top, or `stalagmites` for bars that grow upward from the bottom.

### Configuration fields

| Field                   |     Required     | Default  | Description                                                                               |
| :---------------------- | :--------------: | :------- | :---------------------------------------------------------------------------------------- |
| `show.chart_type`       | :material-check: |          | Use `barcode` to display a barcode chart.                                                 |
| `show.chart_variant`    | :material-close: | Not set  | Choose `audio`, `stalactites`, or `stalagmites`. Leave it unset for full-height segments. |
| `color_stops.colors`    | :material-close: | `[]`     | Defines the value-based color of each segment.                                            |
| `colorstops_transition` | :material-close: | `smooth` | Chooses between hard and smooth transitions between colors.                               |
| `barcode.styles`        | :material-close: | `{}`     | Applies SVG styles to the barcode segments.                                               |

### Styling

Use `barcode.styles` to control the appearance of the segments. Their data-driven colors continue to come from the configured color stops.

### Period support

| `real_time` | `rolling_window` | `calendar` |
| :-: | :-: | :-: |
| :material-close: | :material-check: | :material-check: |

### Axes, grid, labels, and tooltip

| Display element       | Support         |
| :-------------------- | :-------------- |
| X-axis                | Yes, automatic. |
| Y-axis                | No.             |
| Grid                  | X only.         |
| Tick marks            | X only.         |
| Labels                | X only.         |
| Tooltip and indicator | Yes.            |

## :material-horseshoe: Radial barcode chart

### Basic usage

A radial barcode arranges the configured time bins around a circle. The full configured period is distributed around the ring, starting with the first bin and ending with the last.

|                                                                 Radial Barcode chart - Sunburst variant - flower viz                                                                 |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| ![Flexible Horseshoe Card - Sparkline Radial Barcode/Flower with Tooltip Chart](../assets//screenshots/fhs-demo-card-study-temperature-radial_barcode-tooltip--dark.webp){width=300} |

```yaml linenums="1"
sparkline:
  show:
    chart_type: radial_barcode
    chart_variant: sunburst
    chart_viz: flower

  radial_barcode:
    size: 5
    line_width: 0
    background:
      styles:
        - opacity: 0.15
    foreground:
      styles:
        - opacity: 1
    face:
      show_hour_marks: true
      hour_marks_count: 24
```

Move the pointer or a finger over the ring to inspect an individual segment. The selected foreground segment is highlighted, while the remaining segments are dimmed relative to their configured opacity. The tooltip displays the value and time information for the selected bin.

Leave `chart_viz` unset for backwards-compatible default behavior. You can also set `chart_viz: bar` explicitly. With a fixed-width variant these form a regular ring; with a sunburst variant they become value-sized radial bars. Choose `flower`, `flower2`, or `rice_grain` to replace the bars with rounded shapes.

Leave `chart_variant` unset for backwards-compatible behavior. You can also set `chart_variant: fixed` explicitly for a fixed-width ring. Use `sunburst`, `sunburst_centered`, `sunburst_outward`, or `sunburst_inward` when each segment’s radial size should represent its value.

### Configuration fields

| Field                                   |     Required     | Default        | Description                                                                                    |
| :-------------------------------------- | :--------------: | :------------- | :--------------------------------------------------------------------------------------------- |
| `show.chart_type`                       | :material-check: |                | Use `radial_barcode` to display a radial barcode chart.                                        |
| `show.chart_viz`                        | :material-close: | Not set        | Supports `bar`, `flower`, `flower2`, or `rice_grain`. `bar` is the explicit standard-segment mode; its geometry follows the selected `chart_variant`. |
| `show.chart_variant`                    | :material-close: | Not set        | Supports `fixed`, `sunburst`, `sunburst_centered`, `sunburst_outward`, and `sunburst_inward`. `fixed` explicitly selects the fixed-width ring. |
| `radial_barcode.size`                   | :material-close: | `5`            | Controls the radial width of the barcode ring.                                                 |
| `radial_barcode.line_width`             | :material-close: | `0`            | Adds line width to the radial segments.                                                        |
| `radial_barcode.background.styles`      | :material-close: | `opacity: 0.3` | Applies styles to the complete reference ring.                                                 |
| `radial_barcode.foreground.styles`      | :material-close: | `{}`           | Applies styles to the data-driven foreground segments.                                         |
| `radial_barcode.face.show_day_night`    | :material-close: | `false`        | Displays the day-and-night face.                                                               |
| `radial_barcode.face.show_hour_marks`   | :material-close: | `false`        | Displays hour marks.                                                                           |
| `radial_barcode.face.show_hour_numbers` | :material-close: | `false`        | Displays absolute or relative hour numbers.                                                    |
| `radial_barcode.face.hour_marks_count`  | :material-close: | `24`           | Defines the number of hour marks.                                                              |

### Styling

Use `foreground.styles` for the colored data segments and `background.styles` for the reference ring behind them.

During interaction, the foreground emphasis changes temporarily to highlight the selected segment. Once the interaction ends, the configured styles are restored.

Each foreground segment receives its color from the color stops, based on that segment’s own bin value.

### Period support

| `real_time` | `rolling_window` | `calendar` |
| :-: | :-: | :-: |
| :material-close: | :material-check: | :material-check: |

### Axes, grid, labels, and tooltip

| Display element | Support                  |
| :-------------- | :----------------------- |
| X-axis          | No.                      |
| Y-axis          | No.                      |
| Grid            | No.                      |
| Tick marks      | No.                      |
| Labels          | No.                      |
| Tooltip         | Yes, per radial segment. |
| Indicator       | No.                      |

## :material-horseshoe: Related documentation

* [Sparkline Graphs](sparklines-section.md)
* [Sparkline History Periods and Bins](sparkline-history-periods.md)
* [Sparkline Cartesian Charts and Axes](sparkline-cartesian-charts.md)
* [Color Stops](../core-concepts/color-stops.md)
* [CSS Styling](../core-concepts/css-styling.md)
