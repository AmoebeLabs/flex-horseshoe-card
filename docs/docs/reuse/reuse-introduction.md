---
template: main.html
title: Reuse
description: Reduce repeated Flexible Horseshoe Card YAML with same_as, constants, ref(), calc(), and card templates.
tags:
  - Reuse
  - YAML
---
# Reuse™

Reuse keeps repeated card YAML in one place. It can copy one layout item, repeat a visual arrangement, reuse a shared value or style, or reuse an entire card design depending on how much of the configuration is the same.

This page starts from what you want to repeat and shows which reuse method fits that job.

## :material-horseshoe: Reuse one item

Use `same_as` when another item should start with the same configuration:

```yaml linenums="1"
layout:
  rectangles:
    - id: panel  # Name this item so it can be referenced later
      xpos: 25  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      width: 35  # Width in card coordinates
      height: 30  # Height in card coordinates
      radius: 4  # Radius of this shape
      styles:
        fill: none  # Keep the inside transparent; draw only the border
        stroke: var(--divider-color)  # Border or line color

    - same_as: panel  # Start with the settings from panel
      xpos: 75  # Horizontal position; 50 = center of the card
```

The second Rectangle keeps the first Rectangle's settings and changes only its position.

## :material-horseshoe: Repeat an arrangement

Use groups together with reused items when the same small layout should appear in several places, for example several room summaries.

See [Groups](../card-basics/groups.md) and the [Reusable YAML card examples](reuse-card-examples.md).

## :material-horseshoe: Reuse a value or style

Use `constants` and `ref()` when several items need the same fixed value or block:

```yaml linenums="1"
constants:
  dividerStyle:
    stroke: var(--divider-color)  # Border or line color
    stroke-width: 2  # Border or line thickness

layout:
  lines:
    - orientation: horizontal  # Arrange it from left to right
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 40  # Vertical position; 50 = center of the card
      length: 80  # Length of the line
      styles: ref(dividerStyle)
```

## :material-horseshoe: Keep positions and spacing related

Use `calc()` when a value is easier to understand as a relationship:

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example
  - entity: sensor.example_2  # Entity used by this example

constants:
  centerX: 50
  gap: 12  # Space between these visible parts

layout:
  states:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: calc(centerX - gap)  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
    - entity_index: 1  # Use entity 1 from entities: (0 = first entity)
      xpos: calc(centerX + gap)  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
```
## :material-horseshoe: Reuse a complete card design

Use a [Card template](../card-templates/card-templates-overview.md) when the complete card layout should be used for several entities or rooms.

## :material-horseshoe: Choose the reuse method

Choose the reuse method from what you want to repeat: a complete item, a value/block, or calculated configuration.

| You want to repeat | Use |
| --- | --- |
| One layout item | `same_as` |
| The same arrangement in another place | Groups + `same_as` |
| A fixed number/style/configuration block | `constants` + `ref()` |
| A calculated position/size/spacing | `calc()` |
| A complete card design | Card template |

## :material-horseshoe: Related

- [Reusable YAML card examples](reuse-card-examples.md)
- [Reuse reference](reuse-reference.md)
- [Card templates](../card-templates/card-templates-overview.md)
- [Groups](../card-basics/groups.md)
