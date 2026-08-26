---
template: main.html
title: Line
description: Draw horizontal, vertical, and point-to-point lines in a Flexible Horseshoe Card.
tags:
  - Line
  - Card tools
  - Shapes
---

# Line

Use lines as dividers, borders, connectors, indicators, or other simple visual elements.

Lines can be horizontal, vertical, or drawn between two points.

<!-- Line examples image -->

## :material-horseshoe: Basic use

Add lines under `layout.lines`:

```yaml linenums="1"
layout:
  lines:
    - id: divider
      xpos: 50
      ypos: 50
      length: 60
      orientation: horizontal
```

`xpos` and `ypos` position the center of the line and `length` determines its size.

The default orientation is `horizontal`.

## :material-horseshoe: Orientation

Choose how the line is drawn with `orientation`.

=== "Horizontal"

    ```yaml linenums="1"
    - xpos: 50
      ypos: 50
      length: 60
      orientation: horizontal
    ```

    The line extends equally to the left and right of `xpos`.

=== "Vertical"

    ```yaml linenums="1"
    - xpos: 50
      ypos: 50
      length: 60
      orientation: vertical
    ```

    The line extends equally above and below `ypos`.

=== "From point to point"
    Use `fromto` to draw a line between any two positions:

    ```yaml linenums="1"
    - orientation: fromto
      start:
        xpos: 20
        ypos: 25
      end:
        xpos: 80
        ypos: 75
    ```

    This can be used for diagonal lines or to connect two arbitrary positions.

See [Positioning and sizing](../../card-basics/positioning-and-sizing.md) for more about the card coordinate system.

## :material-horseshoe: Line appearance

Lines use SVG stroke styling:

```yaml linenums="1"
layout:
  lines:
    - xpos: 50
      ypos: 50
      length: 60
      styles:
        stroke: var(--primary-color)
        stroke-width: 3
        stroke-linecap: round
        opacity: 0.8
```

By default, a line uses the primary text color, a width of `2`, and rounded ends.

| Property         | Use                    |
| ---------------- | ---------------------- |
| `stroke`         | Line color             |
| `stroke-width`   | Line thickness         |
| `stroke-linecap` | Shape of the line ends |
| `opacity`        | Line opacity           |

See [Styling](../../appearance/styling.md) for the complete styling guide.

##:material-horseshoe:  Color from an entity

Connect a line to an entity with `entity_index` when its color should respond to the entity state:

```yaml linenums="1"
layout:
  lines:
    - xpos: 50
      ypos: 50
      length: 60
      entity_index: 0

      show:
        item_style: colorstop

      color_stops:
        colors:
          0: green
          50: orange
          100: red
```

Color stops are applied to the line stroke.

See [Color stops](../../appearance/color-stops.md) for ranges, gradients, palettes, and interpolation.

##:material-horseshoe:  Configuration

### Horizontal and vertical lines

| Field          | Required | Default            | Description                             |
| -------------- | :------: | ------------------ | --------------------------------------- |
| `orientation`  |    No    | `horizontal`       | `horizontal` or `vertical`              |
| `xpos`         |    No    | `50`               | Horizontal position of the line center  |
| `ypos`         |    No    | `50`               | Vertical position of the line center    |
| `length`       |    No    | `10`               | Length of the line                      |
| `entity_index` |    No    | Not set            | Entity used by state-dependent features |
| `styles`       |    No    | Default line style | SVG and CSS styling                     |
| `color_stops`  |    No    | Not set            | Colors the line from its entity value   |

### Point-to-point lines

| Field         | Required | Description                            |
| ------------- | :------: | -------------------------------------- |
| `orientation` |    Yes   | Set to `fromto`                        |
| `start.xpos`  |    Yes   | Horizontal position of the start point |
| `start.ypos`  |    Yes   | Vertical position of the start point   |
| `end.xpos`    |    Yes   | Horizontal position of the end point   |
| `end.ypos`    |    Yes   | Vertical position of the end point     |

### Shared tool options

Lines can also use shared card-tool features such as:

* `id`
* `group`
* `same_as`
* actions
* color stops
* animations

These are documented in their respective guides rather than repeated for every tool.

## :material-horseshoe: Legacy horizontal and vertical lines

Older cards can use separate `hlines` and `vlines` sections.

=== "hlines"

    ```yaml linenums="1"
    layout:
      hlines:
        - xpos: 50
          ypos: 50
          length: 60
    ```

=== "vlines"

    ```yaml linenums="1"
    layout:
      vlines:
        - xpos: 50
          ypos: 50
          length: 60
    ```

These remain supported for existing configurations. Use `layout.lines` with `orientation` for new cards.

## :material-horseshoe: Related

* [Rectangle](rectangle.md)
* [Circle](circle.md)
* [Arc](arc.md)
* [Positioning and sizing](../../card-basics/positioning-and-sizing.md)
* [Styling](../../appearance/styling.md)
* [Color stops](../../appearance/color-stops.md)
* [Actions](../../interaction/actions.md)
* [Animations](../../interaction/animations.md)
* [Reusing items with same_as](../../reuse/same-as.md)
