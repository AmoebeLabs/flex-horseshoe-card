---
template: main.html
title: Circle
description: Add fixed or percentage-sized circles to a Flexible Horseshoe Card.
tags:
  - Circle
  - Card tools
---

# Circle

A circle adds a round visual element to a card. Use it as an indicator, background, outline, status marker, or decorative element.

<!-- Add circle examples here. -->

## :material-horseshoe: Basic configuration

```yaml linenums="1"
layout:
  circles:
    - id: status
      xpos: 50
      ypos: 50
      radius: 25
      styles:
        fill: none
        stroke: var(--primary-color)
        stroke-width: 2
```

`xpos` and `ypos` position the center.

## :material-horseshoe: Configuration options

| Field | Required | Description |
| --- | :---: | --- |
| `xpos` | Yes | Horizontal position of the center |
| `ypos` | Yes | Vertical position of the center |
| `radius` | One radius | Radius in SVG units |
| `radius_percent` | One radius | Radius relative to the card |
| `entity_index` | No | Entity used by state-dependent colors and actions |
| `styles` | No | Fill, outline, and opacity |
| `color_stops` | No | Value- or state-based colors |

Use either `radius` or `radius_percent`.

## :material-horseshoe: Choose the radius

=== "Fixed radius"

    ```yaml linenums="1"
    - xpos: 50
      ypos: 50
      radius: 25
    ```

=== "Percentage radius"

    ```yaml linenums="1"
    - xpos: 50
      ypos: 50
      radius_percent: 25
    ```

Use `radius_percent` when the circle should scale with the card.

## :material-horseshoe: Fill and outline

| Style | Use |
| --- | --- |
| `fill` | Inside color |
| `stroke` | Outline color |
| `stroke-width` | Outline width |
| `opacity` | Opacity of the complete circle |
| `fill-opacity` | Opacity of the fill |
| `stroke-opacity` | Opacity of the outline |

## :material-horseshoe: Color from an entity

Connect the circle to an entity and select a color-stop style:

=== "Outline color"

    ```yaml linenums="1"
    - entity_index: 0
      xpos: 50
      ypos: 50
      radius: 20

      show:
        item_style: colorstop

      color_stops:
        colors:
          - value: 0
            color: green
          - value: 50
            color: orange
          - value: 100
            color: red
    ```

=== "Filled circle"

    ```yaml linenums="1"
    - entity_index: 0
      xpos: 50
      ypos: 50
      radius: 20

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

## :material-horseshoe: Related

- [Arc](arc-tool.md)
- [Line](line-tool.md)
- [Rectangle](rectangle-tool.md)
- [Positioning and sizing](../../card-basics/positioning-and-sizing.md)
- [Color stops](../../appearance/color-stops.md)
