---
template: main.html
title: Arc
description: Draw circular arc shapes in a Flexible Horseshoe Card.
tags:
  - Arc
  - Card tools
  - Shapes
---
# Arc

An Arc is a curved visual shape drawn from part of a circle. Unlike a Horseshoe, an Arc does not represent progress by itself; it is simply a shape you can use as a border, accent, divider, or background element.

This page shows how to place an Arc, set its radius and visible angle, rotate it, change its fill/border, and optionally color it from an entity value.

## :material-horseshoe: Add an Arc

Use an Arc for a fixed curved visual element such as a border, accent, or partial circle that is not itself a Horseshoe gauge.

```yaml linenums="1"
layout:
  arcs:
    - xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      radius: 40  # Radius of the arc
      arc_degrees: 260  # Draw 260° of the full 360° circle
      styles:
        fill: none  # Keep the inside transparent; draw only the border
        stroke: var(--divider-color)  # Border color
        stroke-width: 2  # Border thickness
```

## :material-horseshoe: Change how much of the circle is shown

`arc_degrees` controls the visible part of the circle:

```yaml linenums="1"
layout:
  arcs:
    - xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      radius: 40  # Radius of the arc
      arc_degrees: 180  # Draw 180° of the full 360° circle
```

## :material-horseshoe: Rotate or flip the Arc

Use `rotate` to turn the Arc around its center. `flip` mirrors the Arc: `none` leaves it unchanged, `x` mirrors it horizontally (left/right), `y` mirrors it vertically (top/bottom), and `both` mirrors it in both directions.

## :material-horseshoe: Fill the Arc or show only the border

Use `styles` to control fill, stroke, stroke width, opacity, and related SVG appearance.

## :material-horseshoe: Change color with an entity

Add `entity_index` and `color_stops` when the Arc color should follow an entity value or state.

## :material-horseshoe: Configuration options


`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `xpos` | number | No | `50` | Horizontal position of the arc center. |
| `ypos` | number | No | `50` | Vertical position of the arc center. |
| `radius` | number | No | `45` | Radius of the arc. |
| `arc_degrees` | number | No | `260` | Number of degrees covered by the arc. |
| `rotate` | number | No | `0` | Rotates the arc around its center. |
| `flip` | `none`, `x`, `y`, `both` | No | `none` | Mirrors the Arc horizontally, vertically, or in both directions. |
| `entity_index` | entity index | No | Not set | Entity used by state-dependent features. |
| `styles` | mapping | No | Filled with `var(--primary-background-color)`; no border | Sets the Arc fill, optional border (`stroke`), border thickness (`stroke-width`), opacity, and other visible styling. |
| `color_stops` | mapping | No | Not set | Colors the arc from its entity value. |

## :material-horseshoe: Related

- [Shapes](shapes-overview.md)
- [Horseshoe](../horseshoe/horseshoe-overview.md)
- [Color stops](../../appearance/color-stops.md)
