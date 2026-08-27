---
template: main.html
title: Constants and ref()
description: Define a fixed value or configuration block once and reuse it throughout a card.
tags:
  - Dynamic configuration
  - Constants
  - Reuse
---

# Use the same values and styles

Use this when several parts of a card need the same color stops, styling, dimensions, or other values. Define it once, give it a clear name, and use it wherever the card needs it.

## :material-horseshoe: Give repeated styling one name

Use one named style for items that should look the same.

```yaml linenums="1"
constants:
  divider_style:
    stroke: var(--divider-color)
    stroke-width: 1

layout:
  lines:
    - xpos: 50
      ypos: 40
      length: 80
      styles: ref(divider_style)

    - xpos: 50
      ypos: 60
      length: 80
      styles: ref(divider_style)
```

Changing `divider_style` updates both lines.

## :material-horseshoe: Share a value or a complete block

| Option | Use it when you want to... |
| --- | --- |
| `constants` | Give a shared fixed value or YAML block one readable name. |
| `ref(name)` | Insert that named value or YAML block into an item. |

## :material-horseshoe: Keep matching gauges the same size

```yaml linenums="1"
constants:
  gauge_radius: 38

layout:
  horseshoes:
    - radius: ref(gauge_radius)
```

## :material-horseshoe: Give several items the same color scale

Use this for a repeated color scale, style, or another block that should stay identical.

```yaml linenums="1"
constants:
  comfort_colors:
    colors:
      0: var(--info-color)
      20: var(--success-color)
      25: var(--warning-color)

layout:
  horseshoes:
    - id: living-room
      color_stops: ref(comfort_colors)

    - id: bedroom
      color_stops: ref(comfort_colors)
```

## :material-horseshoe: Name the measurements in a layout

Constants can make calculated layouts easier to read:

```yaml linenums="1"
constants:
  center_x: 50
  spacing: 12

layout:
  circles:
    - xpos: calc(center_x - spacing)
      ypos: 50
      radius: 3

    - xpos: calc(center_x + spacing)
      ypos: 50
      radius: 3
```

See [Calculations with calc()](calculations-with-calc.md) when the shared values describe positions, dimensions, or regular spacing.

## :material-horseshoe: Related

- [Reuse overview](../reuse/reuse-introduction.md)
- [Calculations with calc()](calculations-with-calc.md)
- [Reuse reference](../reuse/reuse-reference.md)
