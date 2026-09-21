---
template: main.html
title: Horseshoe Scale and State
description: Configure horseshoe value ranges, state progress, markers, mapped states, backgrounds, colors, and animations.
tags:
- Section
- Horseshoe
- Scale
---
# Horseshoe value and progress

A Horseshoe needs a value range and a rule for turning the current entity value into visible progress along its path. The scale defines where values belong, while the state/progress settings define how the active part of the path is drawn.

This page shows how to set the range, use linear or spline mapping, change progress width and direction, and handle positive/negative or mapped-state displays.

## :material-horseshoe: Set the value range

The scale range tells the Horseshoe where the minimum and maximum values sit on its path, so the current value can be placed correctly.

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  horseshoes:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      radius: 42  # Distance from the center to the Horseshoe path

      horseshoe_scale:
        min: 0  # Value at the start of the scale
        max: 100  # Value at the end of the scale
```
Values at or below `min` start at the beginning of the scale; values at or above `max` reach the end.

## :material-horseshoe: Change the visible thickness

Use the scale width for the base path and the state width for the current-value progress:

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  horseshoes:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      radius: 42  # Distance from the center to the Horseshoe path

      horseshoe_scale:
        min: 0  # Value at the start of the scale
        max: 100  # Value at the end of the scale
        width: 6  # Thickness of the base scale path

      horseshoe_state:
        width: 12  # Thickness of the active value/progress path
```
These widths change the drawing thickness; they do not change the Horseshoe radius.

## :material-horseshoe: Show progress normally

`bar_mode: normal` shows the value from the start of the scale toward the end. This is the normal choice for values such as percentage, temperature, storage, or load.

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  horseshoes:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      bar_mode: normal  # Choose where progress starts and in which direction it grows
      horseshoe_scale:
        min: 0  # Value at the start of the scale
        max: 100  # Value at the end of the scale
```
## :material-horseshoe: Show positive and negative values

Use a bidirectional mode when values can move in both directions around zero, such as importing/exporting power or charging/discharging.

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  horseshoes:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      bar_mode: bidirectional  # Choose where progress starts and in which direction it grows

      horseshoe_scale:
        min: -5000  # Value at the start of the scale
        max: 5000  # Value at the end of the scale
```
The five `bar_mode` values are:

- `normal` — progress grows from the scale minimum toward the maximum.
- `bidirectional` — progress grows away from zero. The zero position can be set with `zero_ratio`; when it is omitted the card derives the position from the configured scale.
- `bidirectional_symmetrical` — zero is in the center and positive/negative progress grows away from that center.
- `bidirectional_linear` — positive and negative progress grows away from zero with a linear distribution along each side.
- `absolute` — the visible progress shows the magnitude from the start of the Horseshoe path. The signed entity value is still available for the displayed state and color selection. `horseshoe_scale.min` must be `<= 0`, `horseshoe_scale.max` must be `> 0`, and `zero_ratio` must not be set.

`zero_ratio` applies to `bidirectional`, `bidirectional_symmetrical`, and `bidirectional_linear`; do not set it with `normal` or `absolute`.

## :material-horseshoe: Use a non-linear scale

Use `horseshoe_scale.type` when equal value differences should not always take equal visual space. A spline scale can emphasize part of the range while keeping the complete value range visible.

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  horseshoes:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      horseshoe_scale:
        min: 0  # Value at the start of the scale
        max: 14  # Value at the end of the scale
        type: spline
        spline:
          anchors:
            - value: 5      # The value 5...
              position: 0.2 # ...is placed at 20% of the visible path
            - value: 8      # The value 8...
              position: 0.8 # ...is placed at 80% of the visible path
```
Here, values from 5 to 8 use most of the visible path, while the ranges below 5 and above 8 use less space. `linear` gives equal value differences equal visible distance. `spline` follows the configured anchors with a smooth curve that keeps their order without overshooting them. `splineorg` uses the older spline behavior kept for existing configurations and can produce a different curve between the same anchors.

## :material-horseshoe: Show named states as a level

Use the Horseshoe state modes together with `state_map` when textual states such as `low`, `medium`, and `high` should occupy positions or levels on the path.

Use `stringstate_mode` when only the segment for the current mapped state should be active. Use `stringstate_level` when the current segment and every earlier/lower mapped segment should be active. Both modes use the order of the entries in `state_map.map`; keep the matching label configuration with the same state mapping so the visible text follows the active segment.

## :material-horseshoe: Add a background behind the gauge

A background path can make the complete gauge range remain visible even when the active progress covers only part of it.

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  horseshoes:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      horseshoe_scale: {}  # Required scale block; uses the default 0–100 linear scale

      show:
        horseshoe_background: fixed

      horseshoe_background:
        width: 16  # Thickness of the background path
        color: var(--divider-color)
```
Defining `horseshoe_background` alone does not show it; select the background mode under `show` as well.

`show.horseshoe_background` accepts these values:

- `none` — hides the background. This is the default.
- `fixed` — uses the configured background color/styles across the complete path.
- `colorstopsegments` — divides the background into hard color-stop sections.
- `lineargradient` — spreads the configured colors evenly across the complete path.
- `colorstopgradient` — positions the gradient colors according to their configured scale values.

The tick and label background selectors use the same five values. Their own page explains the corresponding `horseshoe_tickmarks.background` and `horseshoe_labels.background` settings.

## :material-horseshoe: Choose how progress is colored

Use `show.horseshoe_style` to choose how the active progress path is colored. The default is `fixed`.

| Value | Visible result |
| --- | --- |
| `fixed` | Uses `horseshoe_state.color` and the configured state styles for the complete active progress. |
| `colorstop` | Uses one discrete color-stop color for the current value; the complete active progress uses that color. |
| `colorstopinterpolated` | Blends between neighboring color stops for the current value; the complete active progress uses the resulting color. |
| `colorstopsegments` | Divides the active progress into hard color-stop sections at their configured values. |
| `autominmax` | Uses one interpolated current-value color between the automatic minimum and maximum endpoint colors. |
| `minmaxgradient` | Draws a gradient across the active progress between the endpoint colors of the active value range. |
| `lineargradient` | Draws all applicable configured colors across the active progress at equal visual spacing; the numeric distances between color-stop values do not change that spacing. |
| `colorstopgradient` | Draws a continuous gradient whose colors are positioned by their configured values, including non-linear scale mapping. |

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  horseshoes:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      horseshoe_scale:
        min: 0
        max: 100
      show:
        horseshoe_style: colorstopgradient  # Place gradient colors at their configured scale values
      color_stops:
        colors:
          - value: 0
            color: green
          - value: 40
            color: orange
          - value: 100
            color: red
```

## :material-horseshoe: Choose how the base scale is colored

Use `show.scale_style` for the complete base scale behind the active progress.

| Value | Visible result |
| --- | --- |
| `fixed` | Uses `horseshoe_scale.color` across the complete scale. This is the default. |
| `colorstopsegments` | Divides the complete scale into hard color-stop sections. |
| `lineargradient` | Spreads the configured colors evenly across the complete path, regardless of the numeric distance between their values. |
| `colorstopgradient` | Positions gradient colors according to their configured values and the active scale mapping. |

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  horseshoes:
    - entity_index: 0
      horseshoe_scale:
        min: 0
        max: 100
      show:
        scale_style: colorstopsegments  # Show hard color ranges across the complete base scale
      color_stops:
        colors:
          - value: 0
            color: green
          - value: 50
            color: orange
          - value: 100
            color: red
```

## :material-horseshoe: Animate value changes

Use the supported Horseshoe animation settings when the progress should animate between values. For state-triggered CSS animation of complete items, see [Animations](../../interaction/animations.md).

## :material-horseshoe: Configuration reference

### Linear scale

A linear scale is the default. Equal differences in value use equal distances on the Horseshoe.

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `min` | number | No | Color-stop scale or `0` | Value at the beginning of the scale. |
| `max` | number | No | Color-stop scale or `100` | Value at the end of the scale. |
| `type` | `linear` | No | `linear` | Keeps equal value differences equally spaced. Use the separate Spline scale form for `spline` or `splineorg`. |

### Spline scale

Use a spline only when part of the value range needs more or less visible space than another part.

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `type` | `spline`, `splineorg` | Yes | — | `spline` uses the current smooth anchor mapping; `splineorg` uses the older spline behavior kept for existing configurations. |
| `spline` | mapping | Yes | — | Defines how values are redistributed along the visible path. |
| `min` | number | No | Color-stop scale or `0` | Value at the beginning of the complete scale. |
| `max` | number | No | Color-stop scale or `100` | Value at the end of the complete scale. |

### Scale appearance

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `width` | number | No | `6` | Thickness of the base scale path. |
| `color` | color | No | `var(--primary-background-color)` | Fixed base-path color. |
| `linecap` | string / mapping | No | `round` | Shape of the path ends. |
| `color_filter` | mapping | No | Not set | Transforms the calculated scale color without changing the underlying value. |
| `styles` | mapping | No | Not set | Adds SVG/CSS appearance overrides. |

### Current-value progress

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `width` | number | No | `12` | Thickness of the active value/progress path. |
| `color` | color | No | `var(--primary-color)` | Fixed active-path color. |
| `linecap` | string / mapping | No | `round` | Shape of the active path ends. |
| `mode` | `value`, `segment`, `stringstate_mode`, `stringstate_level` | No | `value` | `value` draws normal numeric progress; `segment` divides `state_map` into equal sections and activates the matching section; `stringstate_mode` activates only the current mapped string-state section; `stringstate_level` activates the current mapped section and every earlier section. |
| `segment_gap` | number | No | `0` | Space between visible segments in `segment`, `stringstate_mode`, and `stringstate_level`; `0` leaves adjacent segments touching. |
| `inactive_opacity` | number | No | Not set | Makes inactive segments lighter or more transparent when that mode draws inactive segments. |
| `state_map` | mapping | No | Not set | Maps named entity states to the numeric level/position used by string-state modes. |
| `animation` | mapping | No | Default progress animation | Controls how the active path moves from the previous value to the new value. |
| `color_filter` | mapping | No | Not set | Transforms the active color without changing the progress value. |
| `styles` | mapping | No | Not set | Adds SVG/CSS appearance overrides. |

### Color selectors

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `show.horseshoe_style` | `fixed`, `colorstop`, `colorstopinterpolated`, `colorstopsegments`, `autominmax`, `minmaxgradient`, `lineargradient`, `colorstopgradient` | No | `fixed` | Chooses how the active progress path is colored. The visible result of every value is listed above. |
| `show.scale_style` | `fixed`, `colorstopsegments`, `lineargradient`, `colorstopgradient` | No | `fixed` | Chooses the color treatment of the complete base scale. |
| `show.horseshoe_background` | `none`, `fixed`, `colorstopsegments`, `lineargradient`, `colorstopgradient` | No | `none` | Chooses whether the background is hidden, fixed-color, segmented, evenly graduated, or positioned by color-stop values. |

### Bar modes

| Mode | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `normal` | mode | No | Default | Progress grows from the start of the scale toward the current value. |
| `bidirectional` | mode | No | Not set | Progress grows away from zero; `zero_ratio` can set the zero position, otherwise it is derived from the scale. |
| `bidirectional_symmetrical` | mode | No | Not set | Places zero in the center; positive and negative progress grows away from that center. |
| `bidirectional_linear` | mode | No | Not set | Positive and negative progress grows away from zero with a linear distribution along each side. |
| `absolute` | mode | No | Not set | Shows magnitude from the start of the path while keeping the signed value available for displayed state/color. Requires scale `min <= 0`, `max > 0`, and no `zero_ratio`. |

## :material-horseshoe: Related documentation

- [Horseshoe overview](horseshoe-overview.md)
- [Markers](horseshoe-markers.md)
- [Tick marks and labels](horseshoe-tick-marks-and-labels.md)
- [Color stops](../../appearance/color-stops.md)
