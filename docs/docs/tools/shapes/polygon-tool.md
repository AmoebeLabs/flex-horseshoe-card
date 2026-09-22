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

A Polygon is a multi-sided shape such as a triangle, square, pentagon, or hexagon. It can be used as a background, badge, indicator, frame, or as a matching shape behind another card element.

This page shows how to choose the number of sides, size and orient the Polygon, round its corners, style it, and use it together with a Horseshoe.

## :material-horseshoe: Add a Polygon

A Polygon creates a triangle, hexagon, or another multi-sided shape. `width` and `height` can be set independently, so the shape can also be stretched horizontally or vertically.

```yaml linenums="1"
layout:
  polygons:
    - xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      sides: 6  # Number of sides of the polygon
      width: 60  # Width in card coordinates
      height: 52  # Height in card coordinates
      styles:
        fill: none  # Keep the inside transparent; draw only the border
        stroke: var(--primary-color)  # Border color
```

## :material-horseshoe: Choose the number of sides

Change `sides` to create another regular shape:

- `3` — triangle
- `4` — quadrilateral
- `6` — hexagon
- higher values — more sides

## :material-horseshoe: Change the size and corners

Use `width` and `height` to size the Polygon. Use `radius` to round its corners; `0` keeps them sharp.

```yaml linenums="1"
layout:
  polygons:
    - xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      sides: 6  # Number of sides of the polygon
      width: 70  # Width in card coordinates
      height: 60  # Height in card coordinates
      radius: 4  # Radius of this shape
```

## :material-horseshoe: Choose what faces upward

`top` selects which point on the Polygon faces the top of the card.

For example:

- `top: 0` places corner `0` at the top;
- `top: 0.5` places the middle of the first side at the top;
- decimal values choose a position along a side.

Use `top` to choose whether a point or a flat side faces upward.

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

## :material-horseshoe: Fill the Polygon or show only the border

Use `styles` to control the fill, border (`stroke`), border width, opacity, and other appearance.

A thick or partly transparent border can look darker where the fill continues underneath it. `fill_mask` prevents that visual overlap by stopping the fill farther inward.

## :material-horseshoe: Prevent the fill and border from visually overlapping

When a Polygon has both a fill and a border, part of the border lies inside the Polygon. If the fill continues underneath that part, opacity can make the border look darker or heavier than intended.

The default `fill_mask: auto` stops the fill at the inside edge of the border. You normally leave it unchanged. Set a larger value only when you deliberately want the fill to stop farther inward and create extra visible space. `0` allows the fill to continue underneath the border; negative values are not supported.

```yaml linenums="1"
layout:
  polygons:
    - xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      sides: 6  # Draw a six-sided Polygon
      width: 60  # Outside width
      height: 52  # Outside height
      styles:
        fill: var(--primary-color)  # Fill color
        fill-opacity: 0.25  # Make the fill partly transparent
        stroke: var(--primary-color)  # Border color
        stroke-opacity: 0.5  # Make the border partly transparent
        stroke-width: 4  # Thick borders make overlap easier to notice
      fill_mask: auto  # Keep the fill from visually stacking underneath the border
```

## :material-horseshoe: Use the same shape for a Horseshoe path

A Horseshoe can use a polygon-shaped path. See [Horseshoe path shapes](../horseshoe/horseshoe-path-shapes.md).

## :material-horseshoe: Change color or behavior with an entity

Add `entity_index` when the Polygon should use an entity for color, visibility, actions, or other supported behavior. See [Color stops](../../appearance/color-stops.md) and [Interaction](../../interaction/interaction-overview.md).

## :material-horseshoe: Configuration options


`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `xpos` | number | Yes | — | Horizontal center position. |
| `ypos` | number | Yes | — | Vertical center position. |
| `sides` | integer | Yes | — | Number of sides; must be 3 or greater. |
| `width` | number | Yes | — | Outer width. |
| `height` | number | Yes | — | Outer height. |
| `radius` | number | No | `0` | Corner radius. |
| `top` | number | No | `0` odd sides / `0.5` even sides | Chooses which corner or side faces upward; the default keeps odd and even polygons visually upright. |
| `fill_mask` | `auto` / number ≥ 0 | No | `auto` | Controls where the fill ends relative to the border. `0` lets it continue underneath the border; `auto` stops it at the inside edge; larger values move it farther inward. |
| `entity_index` | entity index | No | Not set | Entity used for value-dependent appearance and behavior. |
| `styles` | mapping | No | Default polygon style | Sets the fill, border (`stroke`), border width, opacity, and other visible Polygon styling. |
| `color_stops` | mapping | No | Not set | Colors the polygon based on an entity value. |

## :material-horseshoe: Related

- [Shapes](shapes-overview.md)
- [Horseshoe path shapes](../horseshoe/horseshoe-path-shapes.md)
- [Color stops](../../appearance/color-stops.md)
