---
template: main.html
title: Color Stops
description: Use color stops to change colors based on numeric entity states, including horseshoe color modes and gradients.
tags:
  - Color Stops
  - Horseshoes
  - Gradients
---

# Color stops

Color stops let the card choose colors based on a numeric entity state.

They can be used for horseshoes, but also for other layout items such as states, names, areas, icons, circles, horizontal lines, and vertical lines. This makes it possible to use the same value-based color logic throughout a card.

For example, a low value can be blue or green, a warning value can be yellow or orange, and a high value can become red.

!!! info "Numeric states"
    Color stops are based on numeric values.

    The card compares the numeric state of the connected entity with the configured stop values. If the state cannot be converted to a number, the color stop logic cannot reliably select a matching color.

## :material-horseshoe: Basic idea

A color stop maps a value to a color:

```yaml linenums="1"
color_stops:
  colors:
    0: blue
    50: yellow
    100: red
```

If the entity state is near `0`, the card uses the first color. If it is near `50`, it uses the middle color. If it is near `100`, it uses the last color.

How those colors are applied depends on the item and, for horseshoes, on the configured horseshoe style.

## :material-horseshoe: Color stop formats

The card supports several color stop formats.

The preferred format is explicit and easy to extend:

=== "Preferred"
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

A compact version is also supported:

=== "Preferred compact"
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

The older legacy form is still supported:

=== "Legacy"
    ```yaml linenums="1"
    color_stops:
      0: 'blue'
      1: 'green'
      2: 'yellow'
      3: 'orange'
      4: 'red'
      5: 'purple'
    ```

For new cards, the preferred or preferred compact format is recommended. The legacy form is mainly kept for existing configurations.

## :material-horseshoe: Using color stops on horseshoes

Horseshoes can use color stops in different ways. The selected behavior is configured with `show.horseshoe_style`.

Common styles include:

| Style | Description |
| :---- | :---------- |
| `colorstop` | Uses the color that matches the current state |
| `colorstopgradient` | Uses color stops as a gradient along the horseshoe |
| `fixed` | Uses a fixed horseshoe color instead of value-based color stops |
| `lineargradient` | Uses a linear gradient where supported |

The exact visual result depends on the horseshoe settings and the color stop configuration.

Example:

```yaml linenums="1"
horseshoes:
  - entity_index: 0
    xpos: 50
    ypos: 50
    radius: 40
    show:
      horseshoe: true
      horseshoe_style: colorstopgradient
    horseshoe_scale:
      min: 0
      max: 100
      width: 6
    horseshoe_state:
      width: 10
    color_stops:
      gap: 3
      colors:
        0: var(--fhs-sys-rainbow-blue)
        25: var(--fhs-sys-rainbow-green)
        50: var(--fhs-sys-rainbow-yellow)
        75: var(--fhs-sys-rainbow-orange)
        100: var(--fhs-sys-rainbow-red)
```

In this example, the horseshoe scale runs from `0` to `100`, and the color stops follow the same value range.

## :material-horseshoe: `colorstop`

Use `colorstop` when the horseshoe should use one selected color based on the current entity state.

```yaml linenums="1"
show:
  horseshoe: true
  horseshoe_style: colorstop
```

This is useful when you want clear state bands, for example:

- green for normal
- orange for warning
- red for critical

```yaml linenums="1"
color_stops:
  colors:
    0: green
    70: orange
    90: red
```

## :material-horseshoe: `colorstopgradient`

Use `colorstopgradient` when the horseshoe should show a gradient based on the color stops.

```yaml linenums="1"
show:
  horseshoe: true
  horseshoe_style: colorstopgradient
```

This is useful for gauges where the whole range should be visible, such as power, temperature, battery level, or usage.

```yaml linenums="1"
color_stops:
  gap: 3
  colors:
    0: var(--fhs-sys-rainbow-blue)
    25: var(--fhs-sys-rainbow-green)
    50: var(--fhs-sys-rainbow-yellow)
    75: var(--fhs-sys-rainbow-orange)
    100: var(--fhs-sys-rainbow-red)
```

## :material-horseshoe: `lineargradient`

Use `lineargradient` when a linear gradient is needed instead of a value-selected color or horseshoe-following gradient.

```yaml linenums="1"
show:
  horseshoe: true
  horseshoe_style: lineargradient
```

A linear gradient is useful when the visual effect should follow a straight gradient direction instead of only selecting a color stop.

The exact result depends on the horseshoe rendering and the configured colors.

## :material-horseshoe: Color stops and scale values

For horseshoes, color stops usually work best when their values match the scale of the horseshoe.

Example:

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

Here, the color stop values use the same range as the horseshoe scale: `0` to `5`.

For a percentage value, a `0` to `100` range is usually clearer:

```yaml linenums="1"
horseshoe_scale:
  min: 0
  max: 100

color_stops:
  colors:
    0: red
    20: orange
    60: yellow
    80: green
```

## :material-horseshoe: Using color stops on text and shapes

Color stops are not limited to horseshoes. They can also be used on layout items such as states, areas, names, icons, circles, and lines.

In these cases, the numeric state of the connected entity determines the color of the item.

Example with a state and an area:

```yaml linenums="1"
- type: 'custom:flex-horseshoe-card'
  entities:
    - entity: sensor.memory_use_percent
    - entity: light.1st_floor_hall_light

  states:
    - id: 0
      entity_index: 0
      xpos: 50
      ypos: 30
      styles:
        - font-size: 3em;
      color_stops:
        0: 'blue'
        1: 'green'
        2: 'yellow'
        3: 'orange'
        4: 'red'
        5: 'purple'

  areas:
    - id: 0
      entity_index: 0
      xpos: 50
      ypos: 85
      styles:
        - font-size: 1.2em;
      color_stops:
        0: 'blue'
        1: 'green'
        2: 'yellow'
        3: 'orange'
        4: 'red'
        5: 'purple'
```

This example uses the same color stops for the state and the area. Both are connected to `entity_index: 0`, so both use the numeric state of the first entity.

## :material-horseshoe: Color stops with external palettes

Color stops work well with external palettes.

Instead of hardcoding colors such as `red` or `#ff0000`, you can use CSS variables loaded from a palette:

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

This makes it easier to keep colors consistent across multiple cards. It also allows light and dark mode variants when the palette provides them.

For more details, see the external palettes page.

## :material-horseshoe: Dynamic color stops with JavaScript templates

Color stops can also be generated dynamically with JavaScript templates.

This is useful when the list of colors or values should depend on Home Assistant states or reusable template variables.

Example:

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

You can also define reusable color stop definitions in `variables` and use them where needed:

```yaml linenums="1"
variables:
  batteryColorStops:
    0: red
    20: orange
    60: yellow
    80: green

layout:
  horseshoes:
    - entity_index: 0
      color_stops: |
        [[[ return variables['batteryColorStops']; ]]]
```

For more details about template syntax and reusable variables, see the JavaScript templating page.

## :material-horseshoe: Choosing a color stop style

| Need | Recommended option |
| :--- | :----------------- |
| One color based on the current value | `horseshoe_style: colorstop` |
| Smooth gradient along the horseshoe | `horseshoe_style: colorstopgradient` |
| Straight gradient effect where supported | `horseshoe_style: lineargradient` |
| Fixed horseshoe color | `horseshoe_style: fixed` with a configured color |
| Shared colors across many cards | External palettes with CSS variables |
| Dynamic color stop definitions | JavaScript templates or `variables` |

## :material-horseshoe: Practical tips

Keep color stop values close to the value range of the entity or horseshoe scale. A `0..100` scale is usually easiest for percentages.

Use clear threshold values for status-like colors. For example, battery colors often make more sense as `0`, `20`, `60`, and `80` than as many small steps.

Use external palettes when several cards should share the same color language.

Use JavaScript templates only when the color stop definition really needs to be dynamic. Static color stops are easier to read and maintain.
