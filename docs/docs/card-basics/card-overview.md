---
template: main.html
title: Card overview
description: Understand the main parts of a Flexible Horseshoe Card configuration.
tags:
  - Card basics
  - Layout
---

# Card overview

The Flexible Horseshoe Card is a highly customizable Home Assistant card for visualizing and controlling entity data. It combines values, icons, horseshoes, graphs, labels, and controls in a configurable card with flexible sizing and positioning. Reusable templates make it possible to build consistent cards without repeating the same configuration.



<!-- Add an annotated card screenshot here. -->

## :material-horseshoe: The basic structure

```yaml linenums="1"
type: custom:flex-horseshoe-card

entities:
  - entity: sensor.living_room_temperature

layout:
  aspectratio: 1/1

  icons:
    - entity_index: 0
      xpos: 50
      ypos: 35

  states:
    - entity_index: 0
      xpos: 50
      ypos: 55
```

| Part | What you configure |
| --- | --- |
| `type` | Selects the Flexible Horseshoe Card. |
| `entities` | Lists the Home Assistant entities and browser-local inputs used by the card. |
| `layout` | Contains the tools and controls shown on the card. |

## :material-horseshoe: Entities

Each entity receives an index based on its position in the `entities` list. Tools use `entity_index` to select one.

Use slots when a descriptive name is clearer than a number:

```yaml linenums="1"
entities:
  - entity: sensor.living_room_temperature
    slot: temperature

layout:
  states:
    - entity_index: temperature[0]
      xpos: 50
      ypos: 50
```

See [Entities](entities.md) for entity settings, slots, attributes, and formatting.

## :material-horseshoe: Layout tools

Tools are grouped by what they show:

- entity tools show a state, name, area, or icon;
- shapes add lines, circles, arcs, rectangles, and text;
- horseshoes show a value on a scale;
- sparklines show history;
- controls let someone change a value or run an action.

See [Card tools](../tools/tools-overview.md) to choose the right tool.

## :material-horseshoe: Card size

`layout.aspectratio` sets the shape of the card:

```yaml linenums="1"
layout:
  aspectratio: 1/1.4
```

The first number is the width and the second is the height.

## :material-horseshoe: Related

- [Your first card](../getting-started/your-first-card.md)
- [Entities](entities.md)
- [Groups](groups.md)
- [Positioning and sizing](positioning-and-sizing.md)
