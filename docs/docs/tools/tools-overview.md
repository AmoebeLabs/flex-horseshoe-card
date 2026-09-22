---
template: main.html
title: Card tools
description: Choose the visual tools and interactive controls to add to a Flexible Horseshoe Card.
tags:
  - Card tools
  - Layout
---
# Card tools

Card tools are the visible building blocks placed under an `layout:`. Some show current entity information, some add visual shapes, Horseshoes show values on a scale, Sparklines show history, and controls let the user change something.

This page introduces those tool groups and shows where each type is added so you can choose the tool that matches what you want to put on the card.

## :material-horseshoe: Entity information

Use these tools to show information that Home Assistant already knows about an entity:

| You want to show... | Tool |
| --- | --- |
| Current value or state | [State](entities/entity-state-tool.md) |
| Entity, device, area, or floor name | [Name](entities/entity-name-tool.md) |
| Area | [Area](entities/entity-area-tool.md) |
| Icon | [Icon](entities/entity-icon-tool.md) |

## :material-horseshoe: Shapes and text

Use shapes to add backgrounds, borders, separators, highlights, labels, or other visual parts:

- [Rectangle](shapes/rectangle-tool.md)
- [Circle](shapes/circle-tool.md)
- [Line](shapes/line-tool.md)
- [Arc](shapes/arc-tool.md)
- [Polygon](shapes/polygon-tool.md)
- [Text](shapes/text-tool.md)

See [Shapes](shapes/shapes-overview.md) for an overview.

## :material-horseshoe: Show a value on a gauge

Use a [Horseshoe](horseshoe/horseshoe-overview.md) to show the current value along an arc or another path. Add tick marks, labels, markers, colors, or another path when needed.

## :material-horseshoe: Show history

Use a [Sparkline graph](sparkline/sparkline-overview.md) to show how one or more entities changed over time. Choose a line, area, dots, bars, barcode, radial chart, state bands, or another supported graph type.

## :material-horseshoe: Add controls

Use [Interactive controls](controls/controls-overview.md) when someone should be able to change something directly from the card:

- Button
- Toggle
- Select
- Number
- Slider

## :material-horseshoe: Add a tool to the layout

Each tool lives in its matching section under `layout:`:

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  icons:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 30  # Vertical position; 50 = center of the card

  states:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card

  rectangles:
    - xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 70  # Vertical position; 50 = center of the card
      width: 40  # Width in card coordinates
      height: 10  # Height in card coordinates
```
The page for each tool shows what you can do with that tool and the complete configuration options at the end.

## :material-horseshoe: Item IDs

Every normal layout item receives an `id`. You can set a readable ID yourself when another feature needs to refer to that item. If you omit it, the card generates a text ID from the item's zero-based position inside its own layout section: the first item gets `"0"`, the second `"1"`, then `"2"`, and so on. Numbering starts again in every section.

For example, the first Rectangle and the first State can both have the automatically generated ID `"0"` because they belong to different layout sections. Use an explicit ID when you want a stable readable reference for features such as `same_as`.

## :material-horseshoe: Related

- [Card overview](../card-basics/card-overview.md)
- [Positioning and sizing](../card-basics/positioning-and-sizing.md)
- [Appearance](../appearance/appearance-overview.md)
- [Interaction and behavior](../interaction/interaction-overview.md)
