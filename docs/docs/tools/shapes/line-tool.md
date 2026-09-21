---
template: main.html
title: Line
description: Add horizontal, vertical, or point-to-point lines to a Flexible Horseshoe Card.
tags:
  - Line
  - Card tools
---
# Line

A Line is a straight visual element that can separate, connect, underline, or highlight parts of a card. It can be horizontal, vertical, or drawn between two explicit points.

This page shows how to choose the line direction, place and size it, control its ends and appearance, and optionally let its color follow an entity value.

## :material-horseshoe: Add a horizontal line

Use a horizontal line to separate content, underline a value, or add a simple visual guide across the card.

```yaml linenums="1"
layout:
  lines:
    - orientation: horizontal  # Arrange it from left to right
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      length: 60  # Length of the line
      styles:
        stroke: var(--divider-color)  # Border or line color
        stroke-width: 2  # Border or line thickness
```

## :material-horseshoe: Add a vertical line

Use a vertical line to separate columns or create a simple vertical visual guide.

```yaml linenums="1"
layout:
  lines:
    - orientation: vertical  # Arrange it from bottom to top
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      length: 40  # Length of the line
```

## :material-horseshoe: Draw a line between two points

Use `fromto` when a center position plus length is not enough — for example when the line must connect two known points. In this form you give the start and end directly, so `xpos`, `ypos`, and `length` are not needed:

```yaml linenums="1"
layout:
  lines:
    - orientation: fromto  # Draw the line between start and end
      start:
        x: 20
        y: 30
      end:
        x: 80
        y: 70
```

You can also write the same point-to-point line with `x1`, `y1`, `x2`, and `y2`. `x1`/`y1` define the start point and `x2`/`y2` define the end point. If `start` or `end` is also present, that mapping is used for that endpoint instead.

```yaml linenums="1"
layout:
  lines:
    - orientation: fromto  # Draw between two explicit points
      x1: 20  # Start x coordinate
      y1: 30  # Start y coordinate
      x2: 80  # End x coordinate
      y2: 70  # End y coordinate
```

## :material-horseshoe: Change the line ends

Set `styles.stroke-linecap` to choose the shape of both line ends: `butt` ends exactly at the endpoint with a flat edge, `round` uses a rounded end, and `square` uses a flat end that extends slightly beyond the endpoint. The default is `round`.

```yaml linenums="1"
layout:
  lines:
    - orientation: horizontal
      xpos: 50
      ypos: 50
      length: 60
      styles:
        stroke: var(--divider-color)
        stroke-width: 4
        stroke-linecap: square  # Flat ends that extend slightly past the endpoints
```

## :material-horseshoe: Change color with an entity

Add `entity_index` and `color_stops` when the line color should follow an entity value or state. See [Color stops](../../appearance/color-stops.md).

## :material-horseshoe: Configuration options

Choose the table for the kind of line you want to draw. A horizontal line has useful defaults; vertical and point-to-point lines only need the fields that differ from that default.

### Horizontal line

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `orientation` | `horizontal` | No | `horizontal` | Draws a left-to-right horizontal line centered on `xpos`/`ypos`; omit it for this default form. |
| `xpos` | number | No | `50` | Horizontal position of the line center. |
| `ypos` | number | No | `50` | Vertical position of the line center. |
| `length` | number | No | `10` | Total line length. |

### Vertical line

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `orientation` | `vertical` | Yes | — | Draws a top-to-bottom vertical line centered on `xpos`/`ypos`. |
| `xpos` | number | No | `50` | Horizontal position of the line center. |
| `ypos` | number | No | `50` | Vertical position of the line center. |
| `length` | number | No | `10` | Total line length. |

### Line between two points

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `orientation` | `fromto` | Yes | — | Draws the line directly between the configured `start` and `end` coordinates. |
| `start` | coordinate mapping | Yes | — | Start position with `x`/`y` (or `xpos`/`ypos`). |
| `end` | coordinate mapping | Yes | — | End position with `x`/`y` (or `xpos`/`ypos`). |

Alternative coordinate form:

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `x1` | number | Yes | — | Horizontal coordinate of the start point when `start` is omitted. |
| `y1` | number | Yes | — | Vertical coordinate of the start point when `start` is omitted. |
| `x2` | number | Yes | — | Horizontal coordinate of the end point when `end` is omitted. |
| `y2` | number | Yes | — | Vertical coordinate of the end point when `end` is omitted. |

### Options for every Line

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `entity_index` | entity index | No | Not set | Selects an entity when the line color or action should follow that entity. |
| `styles` | mapping | No | Default Line style | Sets line color (`stroke`), thickness (`stroke-width`), opacity, and other visible styling. `stroke-linecap` accepts `butt`, `round`, or `square`; its default is `round`. |
| `color_stops` | mapping | No | Not set | Changes the line color from an entity value or state. |

## :material-horseshoe: Related

- [Shapes](shapes-overview.md)
- [Appearance](../../appearance/appearance-overview.md)
- [Color stops](../../appearance/color-stops.md)
