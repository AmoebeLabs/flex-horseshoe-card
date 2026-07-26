---
template: main.html
title: Horseshoe Scale and State
description: Configure horseshoe value ranges, scale geometry, state modes, mapped states, backgrounds, colors, and animations.
tags:
- Section
- Horseshoe
- Scale
---

# Horseshoe scale and state

The scale defines the value range and base geometry of the horseshoe. The state layer shows the current value within that range. Styling them separately makes it possible to keep the scale subtle while giving the active value more visual emphasis.

## :material-horseshoe: Scale configuration

Use `horseshoe_scale` to define the value range and appearance of the base arc.

| Field          | Default                           | Description                                                    |
| :------------- | :-------------------------------- | :------------------------------------------------------------- |
| `min`          | `0`                               | Defines the lowest value on the scale.                         |
| `max`          | `100`                             | Defines the highest value on the scale.                        |
| `type`         | `linear`                          | Chooses how values are mapped to angles.                       |
| `spline`       |                                   | Provides the spline definition required by spline scale types. |
| `width`        | `6`                               | Controls the width of the scale arc.                           |
| `color`        | `var(--primary-background-color)` | Applies the base scale color.                                  |
| `linecap`      | `round`                           | Chooses the shape of the scale ends.                           |
| `color_filter` |                                   | Applies an optional shared color filter.                       |
| `styles`       |                                   | Applies SVG styles to the scale layer.                         |

```yaml linenums="1"
horseshoe_scale:
  min: 0
  max: 100
  type: linear
  width: 6
  linecap: round
  styles:
    - fill: var(--divider-color)
    - opacity: 0.5
```

A linear scale is the best choice for most gauges. Use a spline scale only when the spacing needs to follow a verified spline definition. Tick marks, labels, and the state arc all use the same mapping, so they remain aligned.

## :material-horseshoe: State configuration

Use `horseshoe_state` to control the active value layer.

| Field              | Default                | Description                                                   |
| :----------------- | :--------------------- | :------------------------------------------------------------ |
| `width`            | `12`                   | Controls the width of the active state arc.                   |
| `color`            | `var(--primary-color)` | Applies a fixed state color.                                  |
| `linecap`          | `round`                | Chooses the shape of the state ends.                          |
| `mode`             | `value`                | Chooses how the state is rendered.                            |
| `segment_gap`      | `2`                    | Defines the space between applicable state segments.          |
| `inactive_opacity` |                        | Controls the opacity of inactive segments in segmented modes. |
| `state_map`        |                        | Maps non-numeric states to numeric render values.             |
| `animation`        |                        | Controls the transition between state values.                 |
| `color_filter`     |                        | Applies an optional shared color filter.                      |
| `styles`           |                        | Applies SVG styles to the state layer.                        |

```yaml linenums="1"
horseshoe_state:
  width: 12
  mode: value
  linecap: round
  styles:
    - fill: var(--primary-color)
```

## :material-horseshoe: State modes

The selected mode determines whether the current state appears as one continuous arc or as a set of discrete segments.

| Mode                | Use                                                                           |
| :------------------ | :---------------------------------------------------------------------------- |
| `value`             | Displays a continuous active arc from the scale minimum to the current value. |
| `segment`           | Displays the state as discrete mapped segments.                               |
| `stringstate_mode`  | Maps string states to mutually exclusive segments.                            |
| `stringstate_level` | Maps string states to ordered levels.                                         |

String-state modes require a state map. Labels can use the same mapping, which keeps the visible text synchronized with the active segment.

```yaml linenums="1"
horseshoe_state:
  mode: stringstate_level
  state_map:
    map:
      - state: low
        value: 1
      - state: medium
        value: 2
      - state: high
        value: 3
```

## :material-horseshoe: Normal and bidirectional bars

Configure `bar_mode` on the horseshoe item itself because it affects the geometry shared by both the scale and the state.

| Mode                        | Behavior                                                       |
| :-------------------------- | :------------------------------------------------------------- |
| `normal`                    | Grows from the scale minimum toward the current value.         |
| `bidirectional`             | Grows away from the calculated or configured zero position.    |
| `bidirectional_symmetrical` | Uses the center of the scale as the zero position.             |
| `bidirectional_linear`      | Displays the bidirectional value with linear segment geometry. |

When the scale range crosses zero, the default `zero_ratio` is calculated from `horseshoe_scale.min` and `horseshoe_scale.max`. Set `zero_ratio` manually only when the visual zero position should differ from the numeric ratio.

## :material-horseshoe: Background layer

`horseshoe_background` adds an optional arc behind the full gauge. Enable it with `show.horseshoe_background`, then configure its geometry and appearance separately.

| Field          | Description                                                              |
| :------------- | :----------------------------------------------------------------------- |
| `width`        | Controls the width of the background arc.                                |
| `offset`       | Moves the background inward or outward relative to the horseshoe radius. |
| `gap`          | Adds space between segmented color-stop background parts.                |
| `color_filter` | Applies an optional shared color filter.                                 |
| `styles`       | Applies SVG styles to the background layer.                              |

```yaml linenums="1"
show:
  horseshoe_background: fixed

horseshoe_background:
  width: 16
  offset: 0
  styles:
    - fill: var(--divider-color)
    - opacity: 0.2
```

## :material-horseshoe: Fixed and color-stop rendering

Use `show.horseshoe_style` to choose how the active state receives its color.

| Style               | Behavior                                                  |
| :------------------ | :-------------------------------------------------------- |
| `fixed`             | Uses the configured state color or fill style.            |
| `colorstop`         | Uses the threshold color that matches the current value.  |
| `colorstopgradient` | Creates a smooth color transition across the value range. |

The same color-stop definition can also be reused by backgrounds and tick marks. See [Color Stops](../core-concepts/color-stops.md) for the complete syntax and available transition modes.

## :material-horseshoe: Animation

State changes can animate from the previous value to the new one. Configure this behavior under `horseshoe_state.animation`. General animation concepts and reusable definitions are covered in [Animations](../core-concepts/animations.md).

Animation affects only the transition between valid states. The scale range, state map, and color-stop settings still determine the final geometry and color.

## :material-horseshoe: Related documentation

* [Horseshoe Gauges](horseshoes-section.md)
* [Horseshoe Tick Marks and Labels](horseshoe-ticks-and-labels.md)
* [Color Stops](../core-concepts/color-stops.md)
* [Color Filters](../core-concepts/color-filters.md)
