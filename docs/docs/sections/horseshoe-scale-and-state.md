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

The scale defines the value range shown by the horseshoe. The state shows the current value within that range. Style them separately to create a quiet reference scale and a prominent current state.

## :material-horseshoe: Scale configuration

`horseshoe_scale` defines the value range and the base arc.

| Field | Default | Description |
| :---- | :------ | :---------- |
| `min` | `0` | Lowest value on the scale. |
| `max` | `100` | Highest value on the scale. |
| `type` | `linear` | Mapping used between values and angles. |
| `spline` | | Spline definition required by spline scale types. |
| `width` | `6` | Width of the scale arc. |
| `color` | `var(--primary-background-color)` | Base scale color. |
| `linecap` | `round` | Shape of the scale ends. |
| `color_filter` | | Optional shared color filter. |
| `styles` | | SVG styles applied to the scale. |

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

Use a linear scale unless the visual spacing must follow a verified spline definition. Tick marks and labels use the same scale mapping and therefore stay aligned with the state arc.

## :material-horseshoe: State configuration

`horseshoe_state` controls the active value layer.

| Field | Default | Description |
| :---- | :------ | :---------- |
| `width` | `12` | Width of the active state arc. |
| `color` | `var(--primary-color)` | Fixed state color. |
| `linecap` | `round` | Shape of the state ends. |
| `mode` | `value` | State rendering mode. |
| `segment_gap` | `2` | Gap between applicable state segments. |
| `inactive_opacity` | | Opacity of inactive segments in segmented modes. |
| `state_map` | | Maps non-numeric states to render values. |
| `animation` | | Controls value transition animation. |
| `color_filter` | | Optional shared color filter. |
| `styles` | | SVG styles applied to the state layer. |

```yaml linenums="1"
horseshoe_state:
  width: 12
  mode: value
  linecap: round
  styles:
    - fill: var(--primary-color)
```

## :material-horseshoe: State modes

The selected mode determines whether the state is rendered as one continuous value or as discrete segments.

| Mode | Use |
| :--- | :-- |
| `value` | Renders a continuous active arc up to the current value. |
| `segment` | Renders state using discrete mapped segments. |
| `stringstate_mode` | Maps string states to mutually exclusive segments. |
| `stringstate_level` | Maps string states to ordered levels. |

String-state modes require a state map. Labels can use the same map so that visible text and active geometry remain synchronized.

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

`bar_mode` is configured on the horseshoe item because it affects the geometry shared by the scale and state.

| Mode | Behavior |
| :--- | :------- |
| `normal` | Grows from the scale minimum toward the current value. |
| `bidirectional` | Grows away from the calculated or configured zero position. |
| `bidirectional_symmetrical` | Uses the center of the scale as the zero position. |
| `bidirectional_linear` | Renders the bidirectional value with linear segment geometry. |

For ranges crossing zero, the default `zero_ratio` is calculated from `horseshoe_scale.min` and `horseshoe_scale.max`. Set `zero_ratio` explicitly only when the visual zero position must differ from the numeric ratio.

## :material-horseshoe: Background layer

`horseshoe_background` creates an optional arc behind the complete gauge. Enable it with `show.horseshoe_background` and configure its geometry separately.

| Field | Description |
| :---- | :---------- |
| `width` | Width of the background arc. |
| `offset` | Radial offset from the horseshoe radius. |
| `gap` | Gap used by segmented color-stop backgrounds. |
| `color_filter` | Optional shared color filter. |
| `styles` | SVG styles for the background. |

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

`show.horseshoe_style` determines how the current state receives its color.

| Style | Behavior |
| :---- | :------- |
| `fixed` | Uses the configured state color or fill style. |
| `colorstop` | Uses the threshold color selected for the current value. |
| `colorstopgradient` | Builds a smooth color transition along the value range. |

The same color-stop definition can also be used by backgrounds and tick marks. See [Color Stops](../core-concepts/color-stops.md) for complete color-stop syntax.

## :material-horseshoe: Animation

State changes can animate between the previous and new value. Animation belongs under `horseshoe_state.animation`; global animation concepts and reusable animation definitions are documented in [Animations](../core-concepts/animations.md).

Animation changes only the transition between valid states. The scale range, state map, and color-stop configuration still determine the final geometry and color.

## :material-horseshoe: Related documentation

- [Horseshoe Gauges](horseshoes-section.md)
- [Horseshoe Tick Marks and Labels](horseshoe-ticks-and-labels.md)
- [Color Stops](../core-concepts/color-stops.md)
- [Color Filters](../core-concepts/color-filters.md)
