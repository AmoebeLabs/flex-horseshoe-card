---
template: main.html
title: Color stops
description: Color horseshoes, shapes, text, icons, and graphs from numeric values or named states.
tags:
  - Color stops
  - Horseshoes
  - Shapes
  - Sparkline
---

# Color stops

Color stops connect entity values or named states to colors. Define them once and use the same visual scale on horseshoes, shapes, entity tools, and graphs.

<!-- Add numeric and state-based color-stop examples here. -->

## :material-horseshoe: Numeric color stops

```yaml linenums="1"
color_stops:
  colors:
    - value: 0
      color: "#42a5f5"
    - value: 20
      color: "#66bb6a"
    - value: 30
      color: "#f9a825"
    - value: 40
      color: "#d32f2f"
```

Each `value` starts a new color range.

## :material-horseshoe: State-based color stops

Use `state` for named values:

```yaml linenums="1"
color_stops:
  colors:
    - state: low
      color: "#66bb6a"
      rank: 0
    - state: moderate
      color: "#f9a825"
      rank: 1
    - state: high
      color: "#ed8003"
      rank: 2
    - state: very_high
      color: "#d32f2f"
      rank: 3
```

`rank` gives ordered visualizations, such as graded charts and string-state horseshoes, their level order.

## :material-horseshoe: Color a horseshoe

```yaml linenums="1"
show:
  horseshoe_style: colorstop

color_stops:
  colors:
    - value: 0
      color: green
    - value: 70
      color: orange
    - value: 90
      color: red
```

Common horseshoe styles are:

| Style | Result |
| --- | --- |
| `colorstop` | One color for the current value or state |
| `colorstopsegments` | Separate solid color ranges |
| `colorstopgradient` | Gradient that follows the configured stop values |
| `lineargradient` | All configured colors distributed evenly |
| `minmaxgradient` | Continuous minimum, zero, and maximum gradient |

See [Horseshoe scale and state](../tools/horseshoe/horseshoe-scale-and-state.md).

## :material-horseshoe: Color a shape or entity tool

```yaml linenums="1"
show:
  item_style: colorstopinterpolated

colorstopinterpolated:
  fill: true
  stroke: false

color_stops:
  colors:
    - value: 0
      color: green
    - value: 50
      color: orange
    - value: 100
      color: red
```

| Item style | Result |
| --- | --- |
| `colorstop` | One matching color |
| `colorstopsegments` | Separate solid ranges where the tool supports segments |
| `colorstopinterpolated` | One blended color for the current numeric value |

Use the matching style block to choose whether the color affects `fill`, `stroke`, or both.

## :material-horseshoe: Add a gap between segments

```yaml linenums="1"
color_stops:
  gap: 2
  colors:
    - value: 0
      color: green
    - value: 50
      color: orange
    - value: 100
      color: red
```

The tool can override the shared gap when one visualization needs different spacing.

## :material-horseshoe: Light and dark colors

```yaml linenums="1"
color_stops:
  colors:
    0: "#838383"
    1: "#fcc449"
    2: "#ed8003"
    3: "#e73f10"

  modes:
    dark:
      0: lightgray
      1: yellow
      2: "#ed8003"
      3: "#e73f10"
```

The mode-specific list is used when that Home Assistant theme mode is active. The main `colors` list is used for other modes.

## :material-horseshoe: Reuse color stops

Store a shared definition as a template:

```yaml linenums="1"
fhs_user_templates:
  templates:
    temperature_colors:
      template:
        type: color_stops
      color_stops:
        colors:
          - value: 0
            color: "#42a5f5"
          - value: 20
            color: "#66bb6a"
          - value: 30
            color: "#f9a825"
          - value: 40
            color: "#d32f2f"
```

Use it wherever the same scale is needed:

```yaml linenums="1"
color_stops:
  template:
    name: temperature_colors
```

## :material-horseshoe: Related

- [Horseshoe](../tools/horseshoe/horseshoe-overview.md)
- [Shapes](../tools/shapes/shapes-overview.md)
- [Sparkline graphs](../tools/sparkline/sparkline-overview.md)
- [Palettes](palettes.md)
