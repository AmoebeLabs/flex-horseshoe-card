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

An arc draws part of a circle on the card. Use it as a background shape, curved panel, highlight, or decorative element.

An arc is defined by its center, radius, and the number of degrees it covers.

<!-- Arc examples image -->

## :material-horseshoe: Basic configuration

Add arcs under `layout.arcs`:

```yaml linenums="1"
layout:
  arcs:
    - id: background-arc
      xpos: 50
      ypos: 50
      radius: 40
      arc_degrees: 260
      styles:
        fill: var(--primary-background-color)
```

`xpos` and `ypos` position the center of the arc.

`radius` controls its size and `arc_degrees` controls how much of the circle is drawn.

## :material-horseshoe: Configuration options

| Field          | Required | Default           | Description                             |
| -------------- | :------: | ----------------- | --------------------------------------- |
| `xpos`         |    No    | `50`              | Horizontal position of the arc center   |
| `ypos`         |    No    | `50`              | Vertical position of the arc center     |
| `radius`       |    No    | `45`              | Radius of the arc                       |
| `arc_degrees`  |    No    | `260`             | Number of degrees covered by the arc    |
| `rotate`       |    No    | `0`               | Rotates the arc around its center       |
| `flip`         |    No    | `none`            | Flips the arc                           |
| `entity_index` |    No    | Not set           | Entity used by state-dependent features |
| `styles`       |    No    | Default arc style | SVG and CSS styling                     |
| `color_stops`  |    No    | Not set           | Colors the arc from its entity value    |

## :material-horseshoe: Arc size and direction

Change `arc_degrees` to create shorter or longer arcs:

=== "180 degrees"

    ```yaml linenums="1"
    - xpos: 50
      ypos: 50
      radius: 40
      arc_degrees: 180
    ```

=== "260 degrees"

    ```yaml linenums="1"
    - xpos: 50
      ypos: 50
      radius: 40
      arc_degrees: 260
    ```

=== "Full circle"

    ```yaml linenums="1"
    - xpos: 50
      ypos: 50
      radius: 40
      arc_degrees: 360
    ```

## :material-horseshoe: Rotate the arc

Use `rotate` to move the opening around the circle without changing the number of degrees:

```yaml linenums="1"
- xpos: 50
  ypos: 50
  radius: 40
  arc_degrees: 260
  rotate: 90
```

This makes it easy to use the same arc shape at different orientations.

## :material-horseshoe: Fill and outline

Arc shapes support SVG fill and outline styling:

```yaml linenums="1"
styles:
  fill: var(--secondary-background-color)
  stroke: var(--divider-color)
  stroke-width: 1
  opacity: 0.8
```

Common properties include:

| Property         | Use                         |
| ---------------- | --------------------------- |
| `fill`           | Inside color                |
| `stroke`         | Outline color               |
| `stroke-width`   | Outline width               |
| `opacity`        | Opacity of the complete arc |
| `fill-opacity`   | Opacity of the fill         |
| `stroke-opacity` | Opacity of the outline      |

See [Styling](../../appearance/styling.md) for the complete styling guide.

## :material-horseshoe: Color from an entity

Connect an arc to an entity when its color should respond to the entity state.

Arc color stops are applied to the fill by default:

```yaml linenums="1"
- xpos: 50
  ypos: 50
  radius: 40
  arc_degrees: 260
  entity_index: 0

  show:
    item_style: colorstop

  color_stops:
    colors:
      0: green
      50: orange
      100: red
```

See [Color stops](../../appearance/color-stops.md) for ranges, gradients, palettes, and interpolation.

## :material-horseshoe: Related

* [Circle](circle-tool.md)
* [Rectangle](rectangle-tool.md)
* [Positioning and sizing](../../card-basics/positioning-and-sizing.md)
* [Styling](../../appearance/styling.md)
* [Color stops](../../appearance/color-stops.md)
* [Actions](../../interaction/actions.md)
* [Animations](../../interaction/animations.md)
