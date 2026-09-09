---
template: main.html
title: Horseshoe Path Shapes
description: Draw a Flexible Horseshoe Card gauge along an arc, rectangle, polygon, line, wave, spiral, or infinity path.
tags:
  - Horseshoe
  - Paths
  - Polygon
  - Rectangle
---

# Horseshoe path shapes

A horseshoe can follow more than a circular arc. Use another path when a gauge should follow the edge of a panel, form a roof over a value, or become a triangle, hexagon, wave, spiral, or infinity symbol.

The scale, state progress, marker, colors, tick marks, labels, and animation continue to work along the selected shape. See [Horseshoe scale and state](horseshoe-scale-and-state.md#show-the-current-value-with-a-marker) for markers that follow a path or point to an arc from its center.

<!-- Add horseshoe path shape showcase image -->

## :material-horseshoe: Choose a path

Add `path` to a horseshoe and select its `type`. This example draws a complete hexagonal gauge:

```yaml linenums="1"
layout:
  horseshoes:
    - entity_index: 0
      xpos: 50
      ypos: 50
      path:
        type: polygon
        sides: 6
        width: 76
        height: 66
        radius: 4

      horseshoe_scale:
        min: 0
        max: 100

      horseshoe_state:
        width: 8
```

| Path type | Use |
| --- | --- |
| `arc` | A circular or elliptical gauge. |
| `line` | A straight gauge at any angle. |
| `rectangle` | A complete border or a selected route around a panel. |
| `polygon` | A triangle, hexagon, or another many-sided shape. |
| `wave` | A repeating wave. |
| `spiral` | A gauge that winds outward. |
| `infinity` | A continuous figure-eight gauge. |

Without `path`, the horseshoe uses its normal circular arc.

## :material-horseshoe: Follow part of a rectangle or polygon

Rectangle and polygon positions use clockwise corner numbers. A decimal selects a point along the following side:

```text
Rectangle             Triangle              Hexagon

0 ------- 1               0                   0 --- 1
|         |              / \                 /       \
|         |             /   \               5         2
3 ------- 2            2 --- 1               \       /
                                               4 --- 3
```

For example, `0.5` is halfway from corner `0` to corner `1`. On a rectangle, `4` is the end of the final side and returns to corner `0`.

Use `start` and `end` to choose the visible route. This rectangle follows the left half of the top-left corner, the complete top side, and the right half of the top-right corner. It forms a roof that keeps the same proportions at every size:

```yaml linenums="1"
path:
  type: rectangle
  width: 80
  height: 50
  radius: 3
  start: 3.5
  end: 1.5
  direction: clockwise
```

Use the complete range when the gauge should follow the entire shape:

| Shape | Complete path |
| --- | --- |
| Rectangle | `start: 0`, `end: 4` |
| Triangle | `start: 0`, `end: 3` |
| Hexagon | `start: 0`, `end: 6` |

These are also the defaults, so a complete shape does not need `start` or `end`.

## :material-horseshoe: Choose the direction

`direction: clockwise` follows the increasing corner numbers. `direction: counterclockwise` travels around the same shape in the other direction.

```yaml linenums="1"
path:
  type: polygon
  sides: 6
  width: 76
  height: 66
  radius: 4
  start: 0
  end: 4
  direction: counterclockwise
```

The direction determines how the state grows from the configured start. It does not change the corner numbers.

## :material-horseshoe: Choose what faces upward

Use `top` to place a corner or a point along a side at the top of the shape:

| Value | Result |
| --- | --- |
| `top: 0` | Corner `0` faces upward. |
| `top: 0.5` | The middle of side `0` to `1` faces upward. |
| `top: 0.1` | The point ten percent along side `0` to `1` faces upward. |

Odd-sided polygons use `top: 0` by default, which places a corner at the top. Even-sided polygons and rectangles use `top: 0.5`, which makes the upper side horizontal.

Because `top` belongs to the shape itself, tick marks and labels stay correctly positioned and readable.

## :material-horseshoe: Size and round a polygon

Set the polygon's outside dimensions with `width` and `height`:

```yaml linenums="1"
path:
  type: polygon
  sides: 5
  width: 76
  height: 76
```

Add `radius` when the corners should be rounded. It has the same meaning as the radius of a rectangle corner:

```yaml linenums="1"
path:
  type: polygon
  sides: 6
  width: 80
  height: 55
  radius: 4
```

## :material-horseshoe: Keep nested paths aligned

Use the same `start`, `end`, `top`, and `direction` for nested rectangles or polygons. Change only their size. Each path then starts and ends at the same relative place on its own shape:

```yaml linenums="1"
layout:
  horseshoes:
    - id: outer-roof
      entity_index: 0
      xpos: 50
      ypos: 50
      path:
        type: rectangle
        width: 82
        height: 54
        radius: 3
        start: 3.5
        end: 1.5

    - id: inner-roof
      same_as: outer-roof
      path:
        type: rectangle
        width: 68
        height: 42
        radius: 3
        start: 3.5
        end: 1.5
```

See [Reuse™](../../reuse/reuse-introduction.md) when several gauges share more configuration.

## :material-horseshoe: Rectangle and polygon options

| Field | Applies to | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `path.type` | Both | Yes | | `rectangle` or `polygon`. |
| `path.width` | Both | Polygon: Yes | `80` for rectangle | Exact outer width. |
| `path.height` | Both | Polygon: Yes | `80` for rectangle | Exact outer height. |
| `path.radius` | Both | No | `0` | Corner radius; use `0` for sharp corners. |
| `path.sides` | Polygon | Yes | | Number of sides; use an integer of `3` or greater. |
| `path.start` | Both | No | `0` | Position where the path begins. |
| `path.end` | Both | No | `4` or `sides` | Position where the path ends. |
| `path.direction` | Both | No | `clockwise` | `clockwise` or `counterclockwise`. |
| `path.top` | Both | No | `0.5` for even sides; `0` for odd sides | Position that faces upward. |

The [Horseshoe overview](horseshoe-overview.md), [Scale and state](horseshoe-scale-and-state.md), and [Tick marks and labels](horseshoe-tick-marks-and-labels.md) describe the settings shared by all path shapes.

See the [path-shape showcase](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/view-fhs-horseshoe-path-shapes.yaml) for complete arc, line, rectangle, polygon, wave, spiral, and infinity examples.

## :material-horseshoe: Related

* [Horseshoe overview](horseshoe-overview.md)
* [Polygon](../shapes/polygon-tool.md)
* [Scale and state](horseshoe-scale-and-state.md)
* [Tick marks and labels](horseshoe-tick-marks-and-labels.md)
* [Color stops](../../appearance/color-stops.md)
