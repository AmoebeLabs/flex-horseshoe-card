---
template: main.html
title: Layout Overview
description: Understand the `layout` structure, card coordinate system, groups, and available visual and entity layout sections.
tags:
- Layout
- Section
---

# Layout overview

The `layout` section controls where the visual elements of the card appear.

It contains items such as states, names, standalone text, icons, areas, circles, horizontal lines, and vertical lines. Each item can have its own position and styling, making it possible to create anything from a simple value card to a more detailed dashboard component with several coordinated elements.

This page introduces the available layout sections and the shared positioning model. For complete field descriptions and examples, follow the links to the dedicated pages.

## :material-horseshoe: The layout structure

Most visual elements are configured inside `layout`:

```yaml
layout:
  states:
    - entity_index: 0
      xpos: 50
      ypos: 45

  names:
    - entity_index: 0
      xpos: 50
      ypos: 60

  texts:
    - text: History
      xpos: 50
      ypos: 15

  icons:
    - entity_index: 0
      xpos: 50
      ypos: 25

  circles:
    - xpos: 50
      ypos: 50
      radius: 25

  hlines:
    - xpos: 50
      ypos: 70
      length: 80
```

The available fields depend on the element type. Lines use `length`, circles use `radius` or `radius_percent`, and icons use fields such as `icon_size`, `align`, and optionally `icon`.

## :material-horseshoe: Positioning on the card

Layout items use a relative card canvas.

For a square card with an aspect ratio of `1/1`, the base canvas is `100 × 100`:

* `xpos: 0` places an item at the left edge.
* `xpos: 50` places it at the horizontal center.
* `xpos: 100` places it at the right edge.
* `ypos: 0` places it at the top.
* `ypos: 50` places it at the vertical center.
* `ypos: 100` places it at the bottom.

For example:

```yaml
xpos: 50
ypos: 50
```

places an item in the center of a square card.

Other aspect ratios change the effective canvas dimensions. An aspect ratio of `2/1`, for example, creates a wider `200 × 100` canvas. The positioning model remains the same, but more horizontal space becomes available.

Advanced positioning, including groups, reusable local layouts, scaling, and rotation, is covered in [Groups](groups-section.md) and the related positioning documentation.

## :material-horseshoe: Available layout sections

The `layout` section supports several element types.

| Section   | Used for                                    | Details                                   |
| :-------- | :------------------------------------------ | :---------------------------------------- |
| `states`  | Displaying entity states and units          | [Entity elements](entities-section.md)    |
| `texts`   | Displaying standalone or multipart text     | [Text](texts-section.md)                  |
| `names`   | Displaying entity names                     | [Entity elements](entities-section.md)    |
| `areas`   | Displaying Home Assistant areas             | [Entity elements](entities-section.md)    |
| `icons`   | Displaying entity icons or standalone icons | [Entity elements](entities-section.md)    |
| `circles` | Drawing circular shapes                     | [Visual shapes](visual-shapes-section.md) |
| `hlines`  | Drawing horizontal lines                    | [Visual shapes](visual-shapes-section.md) |
| `vlines`  | Drawing vertical lines                      | [Visual shapes](visual-shapes-section.md) |
| `groups`  | Positioning several related items together  | [Groups](groups-section.md)               |

## :material-horseshoe: Entity elements

Entity elements display text or icons from Home Assistant entities.

Use these sections for entity-driven content:

* `states` displays entity values.
* `names` displays entity names.
* `areas` displays Home Assistant areas.
* `icons` displays entity icons or standalone icons.

These items usually connect to an entry in the card-level `entities` section through `entity_index`.

```yaml
layout:
  states:
    - entity_index: 0
      xpos: 50
      ypos: 45

  names:
    - entity_index: 0
      xpos: 50
      ypos: 60
```

See [Home Assistant entity elements](entities-section.md) for all supported fields and examples.

Use [Text](texts-section.md) for headings, captions, button labels, and other
text that does not have to come directly from a Home Assistant entity.

## :material-horseshoe: Visual shapes

Visual shapes are lightweight SVG elements that help organize the card.

Use them as separators, backgrounds, markers, outlines, or other visual accents:

* `circles`
* `hlines`
* `vlines`

```yaml
layout:
  hlines:
    - xpos: 50
      ypos: 70
      length: 80
      styles:
        - stroke: var(--divider-color)
        - stroke-width: 2

  circles:
    - xpos: 50
      ypos: 50
      radius: 25
      styles:
        - fill: none
        - stroke: var(--primary-text-color)
```

See [Visual shapes](visual-shapes-section.md) for configuration details and styling examples.

## :material-horseshoe: Groups

Groups let several related items share one final position.

This is useful when elements form a small visual unit, such as a name, state, and separator circle. Instead of calculating an absolute position for every item, you can arrange them around a shared local center and then position the complete group on the card.

Groups work especially well with `same_as`. Reused items can keep the same local `xpos` and `ypos`, while the assigned group determines where each copy appears.

See [Groups](groups-section.md) for detailed examples.

## :material-horseshoe: Styling and dynamic behavior

Most layout items support inline styling through `styles`. Depending on the section, they may also support color stops, animations, and JavaScript templates.

Use `styles` for fixed appearance settings such as color, opacity, font size, or stroke width.

Use color stops, animations, or templates when the appearance should respond to entity states or other runtime values.

The dedicated pages for entity elements, visual shapes, color stops, animations, and templating describe the available options in more detail.

## :material-horseshoe: Related documentation

Use this page as a starting point, then continue with the section that matches the element you want to add:

* [Home Assistant entity elements](entities-section.md)
* [Text](texts-section.md)
* [Visual shapes](visual-shapes-section.md)
* [Groups](groups-section.md)
* [Reuse](../reuse/reuse-introduction.md)
* [Color Stops](../core-concepts/color-stops.md)
* [Templating](../core-concepts/templating.md)
