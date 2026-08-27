---
template: main.html
title: Card tools
description: Choose the visual tools and interactive controls to add to a Flexible Horseshoe Card.
tags:
  - Card tools
  - Layout
---

# Card tools

Card tools are the elements you add to a Flexible Horseshoe Card. Choose the tools you want to show, then position and style each one independently.

<!-- Add a labeled overview image of the available tool families here. -->

## :material-horseshoe: Available tools

| You want to show | Use |
| --- | --- |
| Current state, name, area, or icon | [Entity tools](entities/entity-state-tool.md) |
| A line, circle, arc, rectangle, or custom text | [Shapes](shapes/shapes-overview.md) |
| A value on a circular scale | [Horseshoe](horseshoe/horseshoe-overview.md) |
| Entity history or statistics | [Sparkline](sparkline/sparkline-overview.md) |
| A button, toggle, selector, stepper, or slider | [Interactive controls](controls/controls-overview.md) |

## :material-horseshoe: Add tools to the layout

Each tool belongs to a named list under `layout`:

```yaml linenums="1"
layout:
  icons:
    - entity_index: 0
      xpos: 50
      ypos: 25

  states:
    - entity_index: 0
      xpos: 50
      ypos: 50

  circles:
    - xpos: 50
      ypos: 50
      radius: 30
  #
  # Etcetera
  #
```

Tools can share an entity, use different entities, or remain independent of entity data.

## :material-horseshoe: Configure a tool

Start with the page for the item you want to add. Continue with these guides when you want to change how it behaves:

| Goal | Guide |
| --- | --- |
| Place an item on the card | [Positioning and sizing](../card-basics/positioning-and-sizing.md) |
| Arrange several items together | [Groups](../card-basics/groups.md) |
| Change colors, fonts, or outlines | [Styling](../appearance/styling.md) |
| Show colors based on a value or state | [Color stops](../appearance/color-stops.md) |
| Run something when an item is tapped | [Actions](../interaction/actions.md) |
| Show or hide an item | [Visibility](../interaction/visibility.md) |
| Reuse a repeated item | [Reuse](../reuse/reuse-introduction.md) |

## :material-horseshoe: Related

- [Card overview](../card-basics/card-overview.md)
- [Positioning and sizing](../card-basics/positioning-and-sizing.md)
- [Styling](../appearance/styling.md)
- [Actions](../interaction/actions.md)
- [Reuse](../reuse/reuse-introduction.md)
