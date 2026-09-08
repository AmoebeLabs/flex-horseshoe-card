---
template: main.html
title: Polygon
description: Add triangles, hexagons, and other regular polygon shapes to a Flexible Horseshoe Card.
tags:
  - Polygon
  - Shapes
  - Card tools
---

# Polygon

A polygon adds a triangle, hexagon, or another regular shape anywhere on the card. Use it as a background, border, status surface, or as the matching background for a polygon-shaped horseshoe.

<!-- Add polygon tool examples image -->

## :material-horseshoe: Basic configuration

Add polygons under `layout.polygons`. Choose the number of sides and give the shape either a radius or an exact width and height:

```yaml linenums="1"
layout:
  polygons:
    - id: status-background
      xpos: 50
      ypos: 50
      sides: 6
      radius: 35
      styles:
        fill: var(--primary-color)
        fill-opacity: 0.2
        stroke: var(--primary-color)
        stroke-width: 1
```

An odd-sided polygon points upward by default. An even-sided polygon has a horizontal side at the top.

## :material-horseshoe: Choose the size

Use `radius` when the polygon should keep its regular proportions:

```yaml linenums="1"
layout:
  polygons:
    - xpos: 50
      ypos: 50
      sides: 5
      radius: 35
```

Use `width` and `height` when the polygon must fit an exact area. Both fields are required together:

```yaml linenums="1"
layout:
  polygons:
    - xpos: 50
      ypos: 50
      sides: 6
      width: 80
      height: 55
```

## :material-horseshoe: Choose what faces upward

Corner numbers increase clockwise. A decimal identifies a point along the side leading to the next corner:

```text
Triangle              Hexagon

    0                  0 --- 1
   / \                /       \
  2---1              5         2
                      \       /
                       4 --- 3
```

`top` places one of these positions at the top of the shape:

| Value | Result |
| --- | --- |
| `top: 0` | Corner `0` faces upward. |
| `top: 0.5` | The middle of the side from `0` to `1` faces upward. |
| `top: 0.1` | The point ten percent along the side from `0` to `1` faces upward. |

This example turns a hexagon until corner `0` is at the top:

```yaml linenums="1"
layout:
  polygons:
    - xpos: 50
      ypos: 50
      sides: 6
      radius: 35
      top: 0
```

## :material-horseshoe: Match a polygon horseshoe

A polygon and a polygon-shaped horseshoe match exactly when their position, size, number of sides, and `top` value are equal. This lets you place a filled surface behind a gauge:

```yaml linenums="1"
layout:
  polygons:
    - xpos: 50
      ypos: 50
      sides: 6
      width: 80
      height: 55
      top: 0.5
      styles:
        fill: var(--primary-color)
        fill-opacity: 0.12

  horseshoes:
    - entity_index: 0
      xpos: 50
      ypos: 50
      path:
        type: polygon
        sides: 6
        width: 80
        height: 55
        top: 0.5
      horseshoe_scale:
        min: 0
        max: 100
```

See [Horseshoe path shapes](../horseshoe/horseshoe-path-shapes.md) for partial polygon gauges and direction settings.

## :material-horseshoe: Configuration options

| Field | Required | Default | Description |
| --- | :---: | --- | --- |
| `xpos` | Yes | | Horizontal center position. |
| `ypos` | Yes | | Vertical center position. |
| `sides` | Yes | | Number of sides; use an integer of `3` or greater. |
| `radius` | One size | | Distance from the center to each corner. |
| `width` | One size | | Exact width; requires `height`. |
| `height` | One size | | Exact height; requires `width`. |
| `top` | No | `0` for odd sides; `0.5` for even sides | Side position that faces upward. |
| `fill_mask` | No | `auto` | Fill width removed along the inside of the outline. |
| `entity_index` | No | Not set | Entity used for value-dependent colors, actions, and animations. |
| `styles` | No | Default polygon style | Fill, outline, opacity, and other SVG styles. |
| `color_stops` | No | Not set | Colors the polygon from its entity value. |

Use either `radius`, or use `width` and `height`. Do not combine both sizing methods.

## :material-horseshoe: Styling and interaction

Polygons support the same fill and outline styles as rectangles. When both are translucent, `fill_mask: auto` prevents their colors from becoming darker where they meet.

Connect a polygon through `entity_index` when its color or behavior should follow an entity. Continue with [Color stops](../../appearance/color-stops.md), [Color filters](../../appearance/color-filters.md), [Actions](../../interaction/actions.md), and [Animations](../../interaction/animations.md).

The [complete polygon and horseshoe example](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/fhs-card-polygon-horseshoe-v1.yaml) combines a filled polygon, a matching gauge, a state, and a slider.

## :material-horseshoe: Related

* [Horseshoe path shapes](../horseshoe/horseshoe-path-shapes.md)
* [Rectangle](rectangle-tool.md)
* [Positioning and sizing](../../card-basics/positioning-and-sizing.md)
* [Styling](../../appearance/styling.md)
* [Reuse™](../../reuse/reuse-introduction.md)
