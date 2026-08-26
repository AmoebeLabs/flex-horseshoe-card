---
template: main.html
title: Circle
description: Add fixed or percentage-sized circles to a Flexible Horseshoe Card.
tags:
  - Circle
  - Card tools
---

# Circle

Use circles as indicators, backgrounds, outlines, status markers, or decorative elements anywhere on the card.

A circle is positioned by its center point and can use either a fixed radius or a radius that scales with the card.

<!-- Circle examples image -->

## :material-horseshoe: Basic use

Add circles under `layout.circles`:

```yaml linenums="1"
layout:
  circles:
    - id: status
      xpos: 50
      ypos: 50
      radius: 25
      styles:
        stroke-width: 2
```

`xpos` and `ypos` position the center of the circle.

Use either `radius` or `radius_percent` to define its size.

## :material-horseshoe: Size and position

=== "Fixed radius"

    Use `radius` for a radius in SVG units:

    ```yaml linenums="1"
    - xpos: 50
      ypos: 50
      radius: 25
    ```

=== "Percentage radius"
    Use `radius_percent` when the circle should scale relative to the card:

    ```yaml linenums="1"
    - xpos: 50
      ypos: 50
      radius_percent: 25
    ```

See [Positioning and sizing](../../card-basics/positioning-and-sizing.md) for more about the card coordinate system.

## :material-horseshoe: Fill and outline

Circles are SVG elements and can use standard fill and outline styling:

```yaml linenums="1"
styles:
  fill: none
  stroke: var(--primary-color)
  stroke-width: 2
  opacity: 0.8
```

Common styles include:

| Property         | Use                            |
| ---------------- | ------------------------------ |
| `fill`           | Inside color                   |
| `stroke`         | Outline color                  |
| `stroke-width`   | Outline width                  |
| `opacity`        | Opacity of the complete circle |
| `fill-opacity`   | Opacity of the fill            |
| `stroke-opacity` | Opacity of the outline         |

See [Styling](../../appearance/styling.md) for the complete styling guide.

## :material-horseshoe: Color from an entity

Connect a circle to an entity with `entity_index` when its color should respond to the entity state.

By default, circle color stops are applied to the outline.

=== "Outline color"

````
```yaml linenums="1"
- xpos: 50
  ypos: 50
  radius: 20
  entity_index: 0

  show:
    item_style: colorstop

  color_stops:
    colors:
      0: green
      50: orange
      100: red
```
````

=== "Filled circle"

````
Color the inside instead by enabling `fill` and disabling `stroke`:

```yaml linenums="1"
- xpos: 50
  ypos: 50
  radius: 20
  entity_index: 0

  show:
    item_style: colorstopgradient

  colorstopgradient:
    fill: true
    stroke: false

  color_stops:
    colors:
      0: green
      50: orange
      100: red
```
````

Use `colorstop` for distinct color ranges or `colorstopgradient` for blended colors.

See [Color stops](../../appearance/color-stops.md) for ranges, gradients, palettes, and interpolation.

## :material-horseshoe: Configuration

| Field            |   Required   | Default | Description                               |
| ---------------- | :----------: | ------- | ----------------------------------------- |
| `xpos`           |      Yes     |         | Horizontal position of the circle center  |
| `ypos`           |      Yes     |         | Vertical position of the circle center    |
| `radius`         | One required | `0`     | Radius in SVG units                       |
| `radius_percent` | One required | Not set | Radius based on the card percentage scale |
| `entity_index`   |      No      | Not set | Entity used by state-dependent features   |
| `styles`         |      No      | `{}`    | SVG and CSS styling                       |
| `color_stops`    |      No      | Not set | Colors the circle from its entity value   |

!!! note
Use either `radius` or `radius_percent`.

### :material-horseshoe: Shared tool options

Circles also support shared card-tool features such as:

* `id`
* `group`
* `same_as`
* color stops
* animations
* haptics

These are documented in their respective guides rather than repeated for every tool.

## :material-horseshoe: Related

* [Rectangle](rectangle.md)
* [Line](line.md)
* [Positioning and sizing](../../card-basics/positioning-and-sizing.md)
* [Styling](../../appearance/styling.md)
* [Color stops](../../appearance/color-stops.md)
* [Animations](../../interaction/animations.md)
* [Reusing items with same_as](../../reuse/same-as.md)
