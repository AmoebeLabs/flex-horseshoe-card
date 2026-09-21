---
template: main.html
title: Visual Shapes
description: Configure rectangles, polygons, circles, and lines as positioned and styled visual building blocks in card layouts.
tags:
- Rectangles
- Polygons
- Circles
- Horizontal Lines
- Vertical Lines
---
# Visual shapes

Shapes are simple visual building blocks that do not need to display a value themselves. They can create backgrounds, borders, separators, badges, highlights, and other structure around the information shown by the card.

This section introduces the available Arc, Circle, Line, Polygon, Rectangle, and Text tools and points to the page for each shape.

## :material-horseshoe: Choose a shape

Choose the shape by the visible geometry you need; each shape page then explains only the settings relevant to that shape.

| You want to add... | Shape |
| --- | --- |
| A panel, background, border, or fitted box | [Rectangle](rectangle-tool.md) |
| A circular background, dot, or ring | [Circle](circle-tool.md) |
| A separator or connection | [Line](line-tool.md) |
| A curved line or partial circle | [Arc](arc-tool.md) |
| A triangle, hexagon, or other polygon | [Polygon](polygon-tool.md) |
| A heading, caption, or composed text | [Text](text-tool.md) |

## :material-horseshoe: Add a shape

Each shape has its own section under `layout:`. For example:

```yaml linenums="1"
layout:
  rectangles:
    - xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      width: 60  # Width in card coordinates
      height: 30  # Height in card coordinates
      radius: 4  # Radius of this shape
      styles:
        fill: var(--card-background-color)  # Fill color of this item
        stroke: var(--divider-color)  # Border or line color
```

The individual shape pages show how to size, style, color, fit, or reuse that shape.

## :material-horseshoe: Use an entity with a shape

A shape can use an entity when its color, visibility, action, or another supported setting should follow that entity:

```yaml linenums="1"
entities:
  - entity: sensor.cpu_usage  # Home Assistant entity used by this card

layout:
  circles:
    - entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      radius: 20  # Radius of the circle
```

## :material-horseshoe: Reuse the same shape

Use `id` and `same_as` when several shapes should start from the same definition. See [Reuse](../../reuse/reuse-introduction.md).

## :material-horseshoe: Related

- [Positioning and sizing](../../card-basics/positioning-and-sizing.md)
- [Appearance](../../appearance/appearance-overview.md)
- [Visibility](../../interaction/visibility.md)

[line-tool support]: https://github.com/amoebelabs/swiss-army-knife-card/releases/
