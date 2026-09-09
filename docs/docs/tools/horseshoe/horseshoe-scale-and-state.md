---
template: main.html
title: Horseshoe Scale and State
description: Configure horseshoe value ranges, state progress, markers, mapped states, backgrounds, colors, and animations.
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
| `min`          | Color-stop scale or `0`           | Defines the lowest value on the scale.                         |
| `max`          | Color-stop scale or `100`         | Defines the highest value on the scale.                        |
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

When `color_stops.scales.default` defines a minimum and maximum, the horseshoe uses that range automatically. Explicit `horseshoe_scale.min` or `horseshoe_scale.max` values override the corresponding color-stop values. If neither is configured, the range falls back to `0` through `100`.

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

## :material-horseshoe: Show the current value with a marker

A marker makes the current value visible at one exact position. It can replace the filled state path, mark the end of that path, or become a pointer from the center of a circular gauge.

Choose the result with two independent `show` options:

| Result | `state_progress` | `state_marker` |
| --- | :---: | :---: |
| Filled path | `true` | `false` |
| Marker without a filled path | `false` | `true` |
| Filled path ending in a marker | `true` | `true` |
| Scale without a state indication | `false` | `false` |

`state_progress` is `true` by default. `state_marker` is `false` by default, so existing horseshoes keep their normal filled state path.

### Mark the value on the path

This configuration replaces the filled state path with a circle at the current value:

```yaml linenums="1"
layout:
  horseshoes:
    - entity_index: 0
      xpos: 50
      ypos: 50
      radius: 40
      arc_degrees: 270

      show:
        state_progress: false
        state_marker: true

      horseshoe_scale:
        min: 0
        max: 100
        width: 6

      horseshoe_state:
        width: 10
```

No `horseshoe_marker` block is needed for this basic result. The default marker is a circle with the same size as `horseshoe_state.width`.

A path marker works on every horseshoe path shape. It follows an arc, line, rectangle, polygon, wave, spiral, or infinity path and moves to the current value.

### Add a marker to the filled path

Show both options when the marker should emphasize the end of the filled path. This example uses an icon and gives it a contrasting fill and border:

```yaml linenums="1"
layout:
  horseshoes:
    - entity_index: 0
      xpos: 50
      ypos: 50
      path:
        type: rectangle
        width: 72
        height: 48
        radius: 5

      show:
        state_progress: true
        state_marker: true

      horseshoe_scale:
        min: 0
        max: 100
        width: 6

      horseshoe_state:
        width: 8

      horseshoe_marker:
        attach_to: path
        icon: mdi:dots-horizontal
        size: 9
        offset: 0
        styles:
          - fill: var(--card-background-color)
          - stroke: var(--primary-text-color)
          - stroke-width: 1
```

`offset: 0` keeps the marker centered on the path. Positive and negative values move it to either side, which is useful when the marker should remain beside the progress path instead of covering it.

### Point to the value from the center

A center marker turns an arc into a dial or VU-style gauge. The icon starts near the center and points toward the current value:

```yaml linenums="1"
layout:
  horseshoes:
    - entity_index: 0
      xpos: 50
      ypos: 50
      radius: 40
      arc_degrees: 270

      show:
        state_progress: false
        state_marker: true

      horseshoe_scale:
        min: 0
        max: 100
        width: 6

      horseshoe_state:
        width: 8

      horseshoe_marker:
        attach_to: center
        icon: mdi:arrow-up-thin
        rotate: 0
        aspectratio: 8
        start_offset: 3
        end_offset: -2
        styles:
          - fill: var(--primary-text-color)
          - opacity: 0.8
```

Center attachment is available for arc paths. `start_offset` moves the beginning away from the center. A negative `end_offset` stops the pointer before the scale; a positive value extends it beyond the scale. Increase `aspectratio` to make the pointer narrower.

An icon that naturally points upward uses `rotate: 0`. Use `rotate` to correct another icon before it follows the value. For example, `mdi:bow-arrow` points diagonally and uses `rotate: -45`.

### Choose the marker shape

| Source | Configuration | Result |
| --- | --- | --- |
| Circle | `shape: circle` | A round marker; this is the default for a path marker without an icon. |
| Triangle | `shape: triangle` | An arrow-like marker that follows the path. |
| Home Assistant icon | `icon: mdi:icon-name` | Uses any available Home Assistant or MDI icon. |
| External SVG | `icon: url(/local/icons/marker.svg)` | Uses an SVG file as the marker. |
| Image | `icon: url(/local/images/marker.png)` | Uses a PNG, WebP, or JPEG image. |

Configure either `shape` or `icon`, not both. A center marker requires an icon.

### Marker appearance

Without marker styles, the marker uses the same current-state color, color stops, color filter, opacity, and animation as `horseshoe_state`. It therefore changes together with the filled state path.

`horseshoe_marker.styles` gives the marker its own appearance when it needs to remain visible on top of the progress path:

```yaml linenums="1"
horseshoe_marker:
  attach_to: path
  shape: circle
  size: 9
  styles:
    - fill: var(--card-background-color)
    - stroke: var(--primary-text-color)
    - stroke-width: 1
```

### Marker options

| Field | Applies to | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `attach_to` | All markers | No | `path` | Places the marker on the path or, with `center`, between the center and an arc. |
| `shape` | Path | No | `circle` when no icon is configured | Chooses `circle` or `triangle`. |
| `icon` | Path and center | Center only | None | Uses a Home Assistant icon or `url(...)` file instead of a built-in shape. |
| `size` | Path | No | `horseshoe_state.width` | Sets the marker length or circle diameter. |
| `aspectratio` | Icons and triangle | No | `1` | Controls the marker proportions; larger values make it narrower. |
| `rotate` | Icons and triangle | No | `0` | Corrects the marker's natural direction in degrees. |
| `offset` | Path | No | `0` | Moves the marker to either side of the path. |
| `start_offset` | Center | No | `0` | Moves the pointer start away from or behind the center. |
| `end_offset` | Center | No | `0` | Stops the pointer before the scale or extends it beyond the scale. |
| `styles` | All markers | No | Current `horseshoe_state` appearance | Gives the marker explicit SVG styles. |

See the [state-marker showcase](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/view-fhs-horseshoe-state-markers.yaml) for complete arc, line, rectangle, and center-pointer cards.

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
| `normal`                    | Grows from the scale minimum toward the current value.                |
| `bidirectional`             | Grows away from the calculated or configured zero position.           |
| `bidirectional_symmetrical` | Uses the center of the scale as the zero position.                    |
| `bidirectional_linear`      | Displays the bidirectional value with linear segment geometry.        |
| `absolute`                  | Grows from the arc start using the active signed branch's magnitude. |

When the scale range crosses zero, the default `zero_ratio` is calculated from `horseshoe_scale.min` and `horseshoe_scale.max`. Set `zero_ratio` manually only when the visual zero position should differ from the numeric ratio.

### Absolute bars

`bar_mode: absolute` keeps the entity value signed for state text and color-stop selection, but draws its magnitude from the physical start of the horseshoe. Do not configure `zero_ratio` for this mode.

A `0..max` scale shares one magnitude range between both signs. With `min: 0` and `max: 15`, both `-5` and `+5` fill one third of the arc. Signed color stops remain independent, so those values can still use different colors.

A scale that crosses zero gives each sign its own complete arc. With `min: -10` and `max: 40`, `-5` fills half of the negative branch while `+5` fills one eighth of the positive branch. The active branch also supplies scale/background colors, ticks, and magnitude labels. At exactly zero, the positive branch is active.

`absolute` uses the configured linear, `spline`, or `splineorg` mapping independently for each branch and supports every continuous horseshoe color style.

```yaml linenums="1"
bar_mode: absolute

horseshoe_scale:
  min: -10
  max: 40
  type: linear

color_stops:
  - -10: green
  - 0: gray
  - 5: orange
  - 40: red
```

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

## :material-horseshoe: State colors

Use `show.horseshoe_style` to control how the horseshoe is colored.

| Style                    | What it does                                                      |
| :----------------------- | :---------------------------------------------------------------- |
| `fixed`                  | Uses a single fixed color.                                        |
| `autominmax`             | Changes the horseshoe color as the value moves through the scale. |
| `colorstop`              | Uses the color that matches the current value range.              |
| `colorstopinterpolated`  | Interpolates the current state color between adjacent color stops. |
| `colorstopsegments`      | Displays each color range as a separate solid segment.            |
| `minmaxgradient`         | Creates a continuous minimum/zero/maximum gradient over the active horseshoe. |
| `colorstopgradient`      | Creates a smooth gradient from all configured color stops.        |
| `lineargradient`         | Distributes all configured colors evenly over the rendered range. |

`colorstopgradient` uses every configured color stop. For example, with blue at `0`, yellow at `50`, and red at `100`, the gradient runs from blue through yellow to red. The horseshoe reveals that gradient up to the current value.

For a normal bar, `lineargradient` distributes every configured color evenly over the active horseshoe. The numeric distance between color-stop values does not affect their visual spacing.

For a bidirectional bar, `lineargradient` creates separate gradients for negative and positive values. Each side distributes its applicable colors evenly between the outer scale value and zero. Add a color stop at `0` to control the center color, or let Flexible Horseshoe Card calculate it from the surrounding stops.

```yaml linenums="1"
bar_mode: bidirectional

show:
  horseshoe_style: lineargradient

horseshoe_scale:
  min: -5
  max: 5

color_stops:
  colors:
    -5: red
    0: gray
    5: green
```

In this example, negative values use a gray-to-red gradient, while positive values use a gray-to-green gradient. When the scale extends below or above zero, define at least one color stop on each side that should display a gradient.


The same color stops can also be reused by backgrounds and tick marks. See [Color Stops](../../appearance/color-stops.md) for the complete syntax.

## :material-horseshoe: Animation

State changes can animate from the previous value to the new one. Configure this behavior under `horseshoe_state.animation`. General animation concepts and reusable definitions are covered in [Animations](../../interaction/animations.md).

Animation affects only the transition between valid states. The scale range, state map, and color-stop settings still determine the final geometry and color.

## :material-horseshoe: Related documentation

* [Horseshoe Gauges](horseshoe-overview.md)
* [Horseshoe Tick Marks and Labels](horseshoe-tick-marks-and-labels.md)
* [Color Stops](../../appearance/color-stops.md)
* [Color Filters](../../appearance/color-filters.md)
