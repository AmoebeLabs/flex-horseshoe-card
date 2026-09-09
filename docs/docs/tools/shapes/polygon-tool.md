---
template: main.html
title: Polygon
description: Add triangles, hexagons, and other polygon shapes to a Flexible Horseshoe Card.
tags:
  - Polygon
  - Shapes
  - Card tools
---

# Polygon

A polygon adds a shape with three or more sides to your card. Use polygons as backgrounds, borders, status surfaces, or together with a polygon-shaped horseshoe.

## :material-horseshoe: When to use a polygon

Use a polygon when you want a shape such as a triangle, pentagon, or hexagon.

For a simple four-sided shape, use a [Rectangle](../shapes/rectangle-tool.md) instead. To create a gauge that follows the outline of a polygon, use a [Horseshoe with a polygon path](../../tools/horseshoe/horseshoe-path-shapes.md).

## :material-horseshoe: Example

**[IMAGE: simple hexagon centered on a card]**

This example creates a hexagon in the center of the card:

```yaml
layout:
  polygons:
    - xpos: 50
      ypos: 50
      sides: 6      # An hexagon
      width: 80     # With width...
      height: 55    # ..and height
```

Polygons are added under `layout.polygons`.

The position is set with `xpos` and `ypos`. The number of sides determines the basic shape, while `width` and `height` determine its size.

## :material-horseshoe: Basic configuration

### Number of sides

Use `sides` to choose the shape.

```yaml
layout:
  polygons:
    - xpos: 50
      ypos: 50
      sides: 5
      width: 80
      height: 80
```

**[IMAGE: triangle, pentagon and hexagon next to each other, labelled 3 / 5 / 6 sides]**

A polygon requires at least three sides.

!!! info "Odd-sided polygons point upward by default. Even-sided polygons have a horizontal side at the top."

### Size

`width` and `height` set the outside dimensions of the polygon.

Use the same value for both to keep the shape evenly proportioned:

```yaml
width: 80
height: 80
```

Use different values to make it wider or taller:

```yaml
width: 80
height: 55
```

**[IMAGE: same hexagon at 80×80 and 80×55]**

### Rounded corners

Use `radius` to round the corners:

```yaml
layout:
  polygons:
    - xpos: 50
      ypos: 50
      sides: 6
      width: 80
      height: 55
      radius: 4
```

Omit `radius`, or use `0`, for sharp corners.

**[IMAGE: same polygon with radius 0 and radius 4]**

## :material-horseshoe:  Orientation

Use `top` to choose which corner or side of the polygon faces upward.

Corners are numbered clockwise.

**[IMAGE/DIAGRAM: triangle and hexagon with corner numbers]**

For a triangle and hexagon:

```text
Triangle              Hexagon

 top: 0              top: 0.5

    0                  0 --- 1
   / \                /       \
  2---1              5         2
                      \       /
                       4 --- 3
```

`top: 0` places corner `0` at the top:

```yaml
top: 0
```

`top: 0.5` places the middle of the side between corners `0` and `1` at the top:

```yaml
top: 0.5
```

Decimal values select a position along the side toward the next corner. For example, `top: 0.1` selects a point ten percent of the way from corner `0` to corner `1`.


| Value | Result |
| --- | --- |
| `top: 0` | Corner `0` faces upward. |
| `top: 0.5` | The middle of the side from `0` to `1` faces upward. |
| `top: 0.1` | The point ten percent along the side from `0` to `1` faces upward. |

**[IMAGE: same hexagon with top: 0 and top: 0.5 side by side]**

## :material-horseshoe: Styling

Use `styles` to change the fill, outline, opacity, and other SVG properties.

```yaml
layout:
  polygons:
    - xpos: 50
      ypos: 50
      sides: 6
      width: 80
      height: 55
      radius: 4
      styles:
        fill: var(--primary-color)
        fill-opacity: 0.2
        stroke: var(--primary-color)
        stroke-width: 1
```

**[IMAGE: styled hexagon produced by this configuration]**

See [Styling] for the available styling options.

## :material-horseshoe: Using a polygon with a horseshoe

A polygon can be used as the background for a horseshoe with a polygon path.

**[IMAGE: existing polygon + matching horseshoe example]**

Use the same position, size, number of sides, corner radius, and `top` value for both shapes:

```yaml
layout:
  polygons:
    - xpos: 50
      ypos: 50
      sides: 6
      width: 80
      height: 55
      radius: 4
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
        radius: 4
        top: 0.5

      horseshoe_scale:
        min: 0
        max: 100
```

The polygon and horseshoe now follow exactly the same outline.

See [Horseshoe path shapes] for partial polygon gauges and direction settings.

## :material-horseshoe: Entity-based appearance and interaction

A polygon does not need an entity.

Add `entity_index` when its appearance or behavior should depend on an entity:

```yaml
entity_index: 0
```

This can be used with:

* [Color stops](../../appearance/color-stops.md)
* [Color filters](../../appearance/color-filters.md)
* [Actions](../../interaction/actions.md)
* [Animations](../../interaction/animations.md)

## :material-horseshoe: Configuration options

| Field          | Required | Default               | Description                                              |
| -------------- | -------- | --------------------- | -------------------------------------------------------- |
| `xpos`         | Yes      |                       | Horizontal center position.                              |
| `ypos`         | Yes      |                       | Vertical center position.                                |
| `sides`        | Yes      |                       | Number of sides. Must be `3` or greater.                 |
| `width`        | Yes      |                       | Outer width of the polygon.                              |
| `height`       | Yes      |                       | Outer height of the polygon.                             |
| `radius`       | No       | `0`                   | Corner radius.                                           |
| `top`          | No       | Depends on `sides`    | Position on the polygon that faces upward.               |
| `fill_mask`    | No       | `auto`                | Removes fill beneath the inside part of the outline.     |
| `entity_index` | No       |                       | Entity used for value-dependent appearance and behavior. |
| `styles`       | No       | Default polygon style | SVG styling for the polygon.                             |
| `color_stops`  | No       |                       | Colors the polygon based on an entity value.             |

### `top` defaults

* Odd number of sides: `0`
* Even number of sides: `0.5`

### `fill_mask`

Polygons support the same fill and outline (stroke) styles as rectangles. When both have opacity set, `fill_mask: auto` prevents their colors from becoming darker where they overlap. If you set the fill_mask to a negative number, the inside of the filled polygon becomes smaller: you see the background between the outline (stroke) and the filled inside of the polygon.


## :material-horseshoe: Styling and interaction

Connect a polygon through `entity_index` when its color or behavior should follow an entity. Continue with [Color stops](../../appearance/color-stops.md), [Color filters](../../appearance/color-filters.md), [Actions](../../interaction/actions.md), and [Animations](../../interaction/animations.md).

The [complete polygon and horseshoe example](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/fhs-card-polygon-horseshoe-v1.yaml) combines a filled polygon, a matching gauge, a state, and a slider.

## :material-horseshoe: Related

* [Horseshoe path shapes](../horseshoe/horseshoe-path-shapes.md)
* [Rectangle](../shapes/rectangle-tool.md)
* [Positioning and sizing](../../card-basics/positioning-and-sizing.md)
* [Styling](../../appearance/styling.md)
* [Reuse™](../../reuse/reuse-introduction.md)

