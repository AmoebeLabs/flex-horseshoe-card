---
template: main.html
title: Layout Overview
description: Understand the `layout` structure, card coordinate system, groups, and available visual and entity layout sections.
tags:
  - Layout
  - Section
---

# Layout overview

The `layout` section is where you place the visual parts of the card.

It contains the items that are drawn on the card canvas, such as states, names, icons, areas, circles, horizontal lines, and vertical lines. Each item gets its own position and optional styling. This makes it possible to build anything from a simple value card to a more detailed dashboard element with multiple visual parts.

This page gives a short overview of the available layout sections. For detailed configuration options, see the dedicated pages for each section.

## :material-horseshoe: The layout structure

Most visual items are placed inside `layout`:

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

The exact fields depend on the item type. A line uses `length`, a circle uses `radius` or `radius_percent`, and an icon uses fields such as `icon_size`, `align`, and optionally `icon`.

## :material-horseshoe: Positioning on the card

Layout items are positioned on a relative card canvas.

For a square card with an aspect ratio of `1/1`, the base canvas is `100 x 100`:

- `xpos: 0` is the left side of the card.
- `xpos: 50` is the horizontal center.
- `xpos: 100` is the right side of the card.
- `ypos: 0` is the top of the card.
- `ypos: 50` is the vertical center.
- `ypos: 100` is the bottom of the card.

For example:

```yaml
xpos: 50
ypos: 50
```

places an item in the center of a square card.

Different aspect ratios change the effective canvas size. For example, an aspect ratio of `2/1` creates a wider `200 x 100` canvas. The same positioning logic still applies, but the available horizontal space becomes larger.

More advanced positioning, including aspect ratios, groups, scaling, rotation, and reusable grouped items, is explained in the [Groups and positioning](groups-section.md) page.

## :material-horseshoe: Available layout sections

The layout section can contain several types of items.

| Section | Used for | Details |
| :------ | :------- | :------ |
| `states` | Displaying entity states and units | [Entity elements](home-assistant-entity-elements.md) |
| `names` | Displaying entity names | [Entity elements](home-assistant-entity-elements.md) |
| `areas` | Displaying Home Assistant areas | [Entity elements](home-assistant-entity-elements.md) |
| `icons` | Displaying entity icons or standalone icons | [Entity elements](home-assistant-entity-elements.md) |
| `circles` | Drawing circular shapes | [Visual shapes](visual-shapes.md) |
| `hlines` | Drawing horizontal lines | [Visual shapes](visual-shapes.md) |
| `vlines` | Drawing vertical lines | [Visual shapes](visual-shapes.md) |
| `groups` | Placing multiple items together | [Groups](groups-section.md) |

## :material-horseshoe: Entity elements

Entity elements show information from Home Assistant entities.

Use these sections when you want to display text or icons:

- `states` for entity values
- `names` for entity names
- `areas` for Home Assistant areas
- `icons` for entity icons or standalone icons

These items usually use `entity_index` to connect to an entity from the card's `entities` section.

Example:

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

For all fields and examples, see [Home Assistant entity elements](home-assistant-entity-elements.md).

## :material-horseshoe: Visual shapes

Visual shapes are simple SVG elements that help structure the card visually.

Use these sections when you want to add separators, backgrounds, markers, or other visual helpers:

- `circles`
- `hlines`
- `vlines`

Example:

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

For all fields and examples, see [Visual shapes](visual-shapes.md).

## :material-horseshoe: Groups

Groups let you place several items together.

This is useful when a set of items belongs together, such as a name, state, and small separator circle. Instead of calculating the final position for each item separately, you can design the items around a shared local center and then place the whole group on the card.

Groups are especially useful together with `same_as`, because repeated items can share the same local `xpos` and `ypos`. The group then determines where each copy appears on the card.

For details and examples, see [Groups](groups-section.md).

## :material-horseshoe: Styling and dynamic behavior

Most layout items support styling through the `styles` field. Depending on the section, items can also use color stops, animations, and JavaScript templates.

Use styling when the appearance is fixed.

Use dynamic templates when the appearance should react to entity states.

Detailed styling options are described on the dedicated pages for entity elements, visual shapes, color stops, and templating.

## :material-horseshoe: When to use this page

Use this page as a quick overview of the layout structure.

For detailed fields, examples, and behavior, use the dedicated pages:

- [Home Assistant entity elements](home-assistant-entity-elements.md)
- [Visual shapes](visual-shapes.md)
- [Groups](groups-section.md)
- [Reuse](../reuse/reuse-introduction.md)
- [Color stops](../core-concepts/color-stops.md)
- [Templating](../core-concepts/templating.md)
