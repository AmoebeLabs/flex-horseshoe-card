---
template: main.html
title: Color Stops
description: Map numeric entity states to colors with thresholds, gradients, theme-aware modes, palettes, and reusable definitions.
tags:
  - Color Stops
  - Horseshoes
  - Gradients
---
# Color stops

Color stops let the card choose a color from a numeric entity state.

They can be applied to horseshoes and to other layout elements, including states, names, areas, icons, circles, horizontal lines, and vertical lines. This makes it possible to use one consistent value-based color system throughout a card.

For example, low values can appear blue or green, warning values yellow or orange, and high values red.

!!! info "Numeric and textual states"
    Color stops use numeric values.

    Horseshoes and state bands can map textual states to numeric values before applying a color stop.

## :material-horseshoe: Basic idea

A color stop links a numeric value to a color:

```yaml linenums="1"
color_stops:
  colors:
    0: blue       # From 0 to 50: blue
    50: yellow    # From 50 to 100: yellow
    100: red      # From 100 onwards: red
```

How the colors are rendered depends on the target element and, for horseshoes, the configured horseshoe style.

## :material-horseshoe: Color stop formats

The card supports several color stop formats.

=== "Preferred"

    The preferred format is explicit and easy to extend. Several other custom cards use a similar structure.

    ```yaml linenums="1"
    color_stops:
      gap: 3
      colors:
        - value: 0
          color: var(--fhs-sys-rainbow-blue)
        - value: 1
          color: var(--fhs-sys-rainbow-green)
        - value: 2
          color: var(--fhs-sys-rainbow-yellow)
        - value: 3
          color: var(--fhs-sys-rainbow-orange)
        - value: 4
          color: var(--fhs-sys-rainbow-red)
        - value: 5
          color: var(--fhs-sys-rainbow-purple)
    ```

=== "Preferred compact"

    A compact version is also supported:

    ```yaml linenums="1"
    color_stops:
      gap: 3
      colors:
        0: var(--fhs-sys-rainbow-blue)
        1: var(--fhs-sys-rainbow-green)
        2: var(--fhs-sys-rainbow-yellow)
        3: var(--fhs-sys-rainbow-orange)
        4: var(--fhs-sys-rainbow-red)
        5: var(--fhs-sys-rainbow-purple)
    ```

=== "Legacy"

    The older legacy format remains supported:

    ```yaml linenums="1"
    color_stops:
      0: 'blue'
      1: 'green'
      2: 'yellow'
      3: 'orange'
      4: 'red'
      5: 'purple'
    ```

For new cards, use the preferred or preferred compact format. The legacy format is mainly retained for existing configurations.

## :material-horseshoe: Light and dark mode color stops

Color stops can define separate values for Home Assistant light and dark mode.

Use a `modes` section with `light` and/or `dark` entries. The active Home Assistant theme mode determines which mode-specific definition is selected.

```yaml linenums="1"
color_stops:
  gap: 2
  colors:
    0: '#838383'
    1: '#fcc449'
    2: '#ed8003'
    3: '#e73f10'
  modes:
    dark:
      0: 'light-gray'
      1: 'yellow'
      2: '#ed8003'
      3: '#e73f10'
    light:
      0: '#838383'
      1: '#fcc449'
      2: '#ed8003'
      3: '#e73f10'
```

When the current mode has a matching entry under `modes`, the card uses that definition. Otherwise, it falls back to the top-level `colors` entry.

| Active mode | Used definition |
| :---------- | :-------------- |
| Light mode and `modes.light` exists | `modes.light` |
| Dark mode and `modes.dark` exists | `modes.dark` |
| Light mode and `modes.light` is missing | `colors` |
| Dark mode and `modes.dark` is missing | `colors` |
| No `modes` section is defined | `colors` |

The top-level `colors` definition therefore remains useful as the default palette.

!!! note
    The `modes` section is not a color format. It selects a mode-specific color-stop definition for the active Home Assistant theme mode.

### Dark mode only

Define only a dark-mode override and use `colors` as the fallback for light mode:

```yaml linenums="1"
color_stops:
  gap: 2
  colors:
    0: '#838383'
    1: '#fcc449'
    2: '#ed8003'
    3: '#e73f10'
  modes:
    dark:
      0: 'light-gray'
      1: 'yellow'
      2: '#ed8003'
      3: '#e73f10'
```

In this example, dark mode uses `modes.dark`, while light mode falls back to `colors`.

### Light mode only

You can also define only a light-mode override and use `colors` as the fallback for dark mode:

```yaml linenums="1"
color_stops:
  gap: 2
  colors:
    0: '#111111'
    1: '#9b6b00'
    2: '#b85f00'
    3: '#b91c1c'
  modes:
    light:
      0: '#838383'
      1: '#fcc449'
      2: '#ed8003'
      3: '#e73f10'
```

Here, light mode uses `modes.light`, while dark mode falls back to `colors`.

## :material-horseshoe: Using color stops on horseshoes

Horseshoes can apply color stops in several ways. Select the behavior with `show.horseshoe_style`.

```yaml linenums="1"
show:
  horseshoe: true
  horseshoe_style: colorstop
```

Common styles include:

| Style | What you see |
| :---- | :----------- |
| `colorstop` | The horseshoe uses the color for the current value range. |
| `colorstopsegments` | Each color range is shown as a separate solid section. |
| `colorstopgradient` | Creates a smooth gradient using all color stops. |
| `lineargradient` | Creates a gradient using the first and last color stops. |
| `autominmax` | The horseshoe changes color as the value rises or falls. |
| `fixed` | The horseshoe has one fixed color. |

For examples, see [Horseshoe Scale and State](../sections/horseshoe-scale-and-state.md#state-colors).

## :material-horseshoe: Color stops and scale values

For horseshoes, color-stop values are easiest to understand when they match the configured scale.

```yaml linenums="1"
horseshoe_scale:
  min: 0
  max: 5

color_stops:
  colors:
    0: blue
    1: green
    2: yellow
    3: orange
    4: red
    5: purple
```

In this example, both the scale and the color stops use the range `0` to `5`.

For percentages, a `0` to `100` range is usually clearer:

```yaml linenums="1"
horseshoe_scale:
  min: 0
  max: 100

color_stops:
  colors:
    0: red        # 0 to 20: red
    20: orange    # 20 to 60: orange
    60: yellow    # 60 to 80: yellow
    80: green     # 80 to 100: green
```

## :material-horseshoe: Using color stops on text and shapes

Color stops are not limited to horseshoes. They can also color states, areas, names, icons, circles, and lines.

For these elements, the numeric state of the connected entity determines which color stop is used.

!!! info "Layout items use discrete color stops"
    Layout items use the matching color stop for the current value. Color-stop gradients are not currently supported for these elements.

Example with a state and an area:

```yaml linenums="1"
- type: 'custom:flex-horseshoe-card'
  entities:
    - entity: sensor.memory_use_percent
    - entity: light.1st_floor_hall_light

  constants:
    colorStops:
      colors:
        0: 'blue'
        1: 'green'
        2: 'yellow'
        3: 'orange'
        4: 'red'
        5: 'purple'

  layout:
    states:
      - id: 0
        entity_index: 0
        xpos: 50
        ypos: 30
        styles:
          - font-size: 3em;
        color_stops: ref(colorStops)

    areas:
      - id: 0
        entity_index: 0
        xpos: 50
        ypos: 85
        styles:
          - font-size: 1.2em;
        color_stops: ref(colorStops)
```

Both items use the same color-stop definition and are connected to `entity_index: 0`, so they respond to the numeric state of the first entity.

## :material-horseshoe: Theme and palette variables

Color stops work well with Home Assistant themes and external palettes.

Instead of hardcoding colors such as `red` or `#ff0000`, you can reference CSS variables supplied by a theme or palette:

```yaml linenums="1"
color_stops:
  gap: 3
  colors:
    0: var(--fhs-sys-rainbow-blue)
    1: var(--fhs-sys-rainbow-green)
    2: var(--fhs-sys-rainbow-yellow)
    3: var(--fhs-sys-rainbow-orange)
    4: var(--fhs-sys-rainbow-red)
    5: var(--fhs-sys-rainbow-purple)
```

This makes it easier to keep colors consistent across multiple cards.

Use `modes.light` and `modes.dark` when the same thresholds need different colors in light and dark mode.

For more information, see the external palettes page.

## :material-horseshoe: Dynamic color stops with JavaScript templates

JavaScript templates can generate color-stop definitions dynamically.

This is useful when the values or colors depend on Home Assistant states or reusable template variables.

```yaml linenums="1"
color_stops: |
  [[[
    return {
      0: 'blue',
      20: 'green',
      60: 'yellow',
      80: 'orange',
      100: 'red',
    };
  ]]]
```

You can also store reusable color stops in `constants`.

With a JavaScript template:

```yaml linenums="1"
constants:
  batteryColorStops:
    colors:
      0: red
      20: orange
      60: yellow
      80: green

layout:
  horseshoes:
    - entity_index: 0
      color_stops: |
        [[[ return constants['batteryColorStops']; ]]]
```

Or with `ref()`:

```yaml linenums="1"
constants:
  batteryColorStops:
    colors:
      0: red
      20: orange
      60: yellow
      80: green

layout:
  horseshoes:
    - entity_index: 0
      color_stops: ref(batteryColorStops)
```

For more information about template syntax and reusable constants, see [Templates](templating.md).

## :material-horseshoe: Choosing a color-stop style

| Need | Recommended option |
| :--- | :----------------- |
| One color based on the current value | `horseshoe_style: colorstop` |
| Separate colored ranges | `horseshoe_style: colorstopsegments` |
| See the colors change as the value passes each color stop | `horseshoe_style: colorstopgradient` |
| Always show the full change from the first color to the last | `horseshoe_style: lineargradient` |
| Fixed horseshoe color | `horseshoe_style: fixed` with a configured color |
| Shared colors across multiple cards | External palettes, theme variables, or reusable `color_stops` |
| Different colors for light and dark mode | `color_stops.modes.light` and `color_stops.modes.dark` |
| Dynamic color-stop definitions | JavaScript templates or FHS templates |

## :material-horseshoe: Practical tips

Keep color-stop values aligned with the range of the entity or horseshoe scale. A `0` to `100` scale is usually easiest to understand for percentages.

Use clear thresholds for status colors. For example, battery levels are often easier to read with stops at `0`, `20`, `60`, and `80` than with many small intervals.

Use `modes.light` and `modes.dark` when the thresholds stay the same but the colors need to match the active Home Assistant theme.

Keep a top-level `colors` definition as the fallback when a light- or dark-mode override is missing.

Use external palettes when several cards should share the same color system.

Use JavaScript templates only when the color-stop definition must change dynamically. Static definitions are easier to read and maintain.

## :material-horseshoe: Related documentation

- Use [Color Filters](color-filters.md) to transform configured colors without changing the underlying color-stop thresholds.
- Apply color stops to scales and state arcs with [Horseshoe Gauges](../sections/horseshoes-section.md).
- Share colors between cards and themes with [External Palettes](external-palettes.md).
