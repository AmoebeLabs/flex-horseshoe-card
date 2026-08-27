---
template: main.html
title: Rectangle
description: Add fixed or automatically fitted rectangles to a Flexible Horseshoe Card.
tags:
  - Rectangle
  - Card tools
---

# Rectangle

A rectangle adds a four-sided visual element anywhere on the card. Use it as a background, border, panel, highlight, or other visual element.

Rectangles can have a fixed size or automatically fit around a state, name, or area.

<!-- Rectangle examples image -->

## :material-horseshoe: Basic configuration

Add rectangles under `layout.rectangles`:

```yaml linenums="1"
layout:
  rectangles:
    - id: background
      xpos: 50
      ypos: 50
      width: 40
      height: 12
      radius: 2
      styles:
        fill: var(--primary-color)
        opacity: 0.3
```

`xpos` and `ypos` position the center of the rectangle. `width` and `height` define its size.

`radius` rounds the corners.

For more about the card coordinate system, see [Positioning and sizing](../../card-basics/positioning-and-sizing.md).

## :material-horseshoe: Configuration options

| Field           | Required | Default                 | Description                                       |
| --------------- | :------: | ----------------------- | ------------------------------------------------- |
| `xpos`          |   Fixed  |                         | Horizontal position of the rectangle center       |
| `ypos`          |   Fixed  |                         | Vertical position of the rectangle center         |
| `width`         |   Fixed  |                         | Rectangle width                                   |
| `height`        |   Fixed  |                         | Rectangle height                                  |
| `fit.section`   |    Fit   |                         | Referenced section: `states`, `names`, or `areas` |
| `fit.item_id`   |    Fit   |                         | `id` of the item to fit around                    |
| `fit.padding.x` |    No    | `1.5`                   | Horizontal padding around the fitted item         |
| `fit.padding.y` |    No    | `0.5`                   | Vertical padding around the fitted item           |
| `radius`        |    No    | `0`                     | Corner radius                                     |
| `entity_index`  |    No    | Not set                 | Entity used by state-dependent features           |
| `styles`        |    No    | Default rectangle style | SVG and CSS styling                               |
| `color_stops`   |    No    | Not set                 | Colors the rectangle from its entity value        |

Use either fixed `xpos`, `ypos`, `width`, and `height`, or `fit`.

## :material-horseshoe: Fit around another item

A rectangle can automatically follow the position and rendered size of a state, name, or area.

This is useful for backgrounds, borders, and highlights around text whose size can change because of formatting, fonts, values, or language.

The referenced item needs an `id`:

```yaml linenums="1"
layout:
  states:
    - id: current-state
      entity_index: 0
      xpos: 50
      ypos: 50

  rectangles:
    - id: state-background
      fit:
        section: states
        item_id: current-state
      radius: 2
      styles:
        fill: var(--primary-color)
        opacity: 0.3
```

Add extra space around the fitted item with `padding`:

```yaml linenums="1"
fit:
  section: states
  item_id: current-state
  padding:
    x: 2
    y: 1
```

A fitted rectangle gets its position, width, and height from the referenced item, so fixed `xpos`, `ypos`, `width`, and `height` are not needed.

## :material-horseshoe: Fill and outline

Rectangles are SVG elements and can use standard SVG styling:

```yaml linenums="1"
styles:
  fill: var(--card-background-color)
  stroke: var(--divider-color)
  stroke-width: 1
  opacity: 0.8
```

Common properties include:

| Property         | Use                               |
| ---------------- | --------------------------------- |
| `fill`           | Inside color                      |
| `stroke`         | Outline color                     |
| `stroke-width`   | Outline width                     |
| `opacity`        | Opacity of the complete rectangle |
| `fill-opacity`   | Opacity of the fill               |
| `stroke-opacity` | Opacity of the outline            |

See [Styling](../../appearance/styling.md) for the complete styling guide.

## :material-horseshoe: Color from an entity

Connect a rectangle to an entity with `entity_index` when its color should respond to the entity state:

```yaml linenums="1"
layout:
  rectangles:
    - xpos: 50
      ypos: 50
      width: 40
      height: 12
      entity_index: 0

      show:
        item_style: colorstop

      colorstop:
        fill: true
        stroke: true

      styles:
        stroke-width: 1

      color_stops:
        colors:
          0: green
          50: orange
          100: red
```

Use `colorstop` for distinct color ranges or `colorstopgradient` for blended colors.

See [Color stops](../../appearance/color-stops.md) for configuring ranges, gradients, palettes, and interpolation.

## :material-horseshoe: Related

* [Circle](circle-tool.md)
* [Line](line-tool.md)
* [Positioning and sizing](../../card-basics/positioning-and-sizing.md)
* [Styling](../../appearance/styling.md)
* [Color stops](../../appearance/color-stops.md)
* [Actions](../../interaction/actions.md)
* [Animations](../../interaction/animations.md)
* [Reusing items with same_as](../../reuse/reuse-with-same_as.md)
