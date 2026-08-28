---
template: main.html
title: Line
description: Add horizontal, vertical, or point-to-point lines to a Flexible Horseshoe Card.
tags:
  - Line
  - Card tools
---

# Line

A line adds a simple visual connection or separation to a card. Use it as a divider, status indicator, scale mark, connector, or decorative element.

<!-- Add horizontal, vertical, and point-to-point line examples here. -->

## :material-horseshoe: Basic configuration

```yaml linenums="1"
layout:
  lines:
    - id: divider
      xpos: 50
      ypos: 50
      length: 70
      orientation: horizontal
      styles:
        stroke: var(--divider-color)
        stroke-width: 1
```

## :material-horseshoe: Configuration options

| Field | Required | Description |
| --- | :---: | --- |
| `orientation` | Yes | `horizontal`, `vertical`, or `fromto` |
| `xpos`, `ypos` | Horizontal or vertical | Position of the line center |
| `length` | Horizontal or vertical | Total line length |
| `start`, `end` | Point to point | Coordinates of both ends |
| `entity_index` | No | Entity used by colors and actions |
| `styles` | No | Stroke, width, opacity, and line ends |
| `color_stops` | No | Value- or state-based colors |

## :material-horseshoe: Choose the direction

=== "Horizontal"

    ```yaml linenums="1"
    - xpos: 50
      ypos: 50
      length: 70
      orientation: horizontal
    ```

=== "Vertical"

    ```yaml linenums="1"
    - xpos: 50
      ypos: 50
      length: 70
      orientation: vertical
    ```

=== "Point to point"

    ```yaml linenums="1"
    - orientation: fromto
      start:
        xpos: 20
        ypos: 30
      end:
        xpos: 80
        ypos: 70
    ```

## :material-horseshoe: Line ends

Use `stroke-linecap` to choose the line ends:

```yaml linenums="1"
styles:
  stroke: var(--primary-color)
  stroke-width: 2
  stroke-linecap: round
```

## :material-horseshoe: Color from an entity

```yaml linenums="1"
- entity_index: 0
  xpos: 50
  ypos: 50
  length: 70
  orientation: horizontal

  show:
    item_style: colorstopinterpolated

  colorstopinterpolated:
    stroke: true
    fill: false

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

- [Circle](circle-tool.md)
- [Arc](arc-tool.md)
- [Rectangle](rectangle-tool.md)
- [Styling](../../appearance/styling.md)
- [Color stops](../../appearance/color-stops.md)
