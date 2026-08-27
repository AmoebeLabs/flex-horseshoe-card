---
template: main.html
title: Reuse
description: Reduce repeated Flexible Horseshoe Card YAML with same_as, constants, ref(), calc(), and card templates.
tags:
  - Reuse
  - YAML
---

# Reuse™

Reuse™ helps when a card repeats the same visual idea: several similar tools, one shared style, a regular row of items, or the same card design for several rooms. Define the shared part once, then change only what is different.

Start with normal YAML for the first item. Add reuse when copying that item would make the card harder to read or maintain.

## :material-horseshoe: Reuse one layout item

Use `same_as` when the next item should look like an earlier item but appears elsewhere on the card.

```yaml linenums="1"
layout:
  circles:
    - id: left-status   # Full definition of first circle
      xpos: 35
      ypos: 50
      radius: 4
      styles:
        fill: var(--primary-color)

    - id: right-status  # Second circle copies the first
      same_as: left-status
      xpos: 65          # And overrides the xpos
```

The second circle keeps the first circle's size and styling while using its own position. The [Reuse reference](reuse-reference.md) lists the available settings when a copied item needs a different position, size, entity, or nested block.

## :material-horseshoe: Build a regular row

Use `same_as_d...` when each next item should keep the same design but move by a fixed amount. This is useful for room buttons, sensor icons, repeated gauges, or any row where the next item also uses the next entity.

```yaml linenums="1"
constants:
  room_start_x: 20        # Starting xpos
  room_column_width: 30   # Width of each column

layout:
  icons:
    - id: room-1          # Full definition of icon
      entity_index: 0
      xpos: calc(room_start_x)
      ypos: 50
      icon_size: 2

    - id: room-2          # Icon 2 copies first
      same_as: room-1
      same_as_dxpos: calc(room_column_width)  # Shifts xpos to the right
      same_as_dentity_index: 1          # and uses the next entity index

    - id: room-3          # Icon 3 copies second
      same_as: room-2
      same_as_dxpos: calc(room_column_width)  # Shifts xpos to the right
      same_as_dentity_index: 1          # and uses the next entity index
```

`room_column_width` defines the spacing once. `same_as_dxpos` uses that shared value for every next icon, while `same_as_dentity_index` makes every icon use the next entity in the card’s entity list. The same pattern works for vertical spacing, size changes, radii, and line lengths.

![](../assets/screenshots/fhs-demo-card-32b-electricity--dark.webp)

This card shows one fully configured Total horseshoe and three phase horseshoes that reuse it with calculated horizontal offsets. [Open the complete Card 32 example](reuse-card-examples.md#example-card-32) for the full configuration.

## :material-horseshoe: Choose the right approach

| You want to... | Use |
| --- | --- |
| Show another tool that is almost the same | `same_as` |
| Build a regular row, column, or entity sequence from one base item | `same_as_d...` |
| Use one color, size, style, or configuration block in several places | `constants` and `ref()` |
| Keep positions, sizes, or spacing visibly related | `calc()` |
| Build a regular pattern from one item and calculated offsets | `same_as` with `calc()` |
| Use the same complete card design more than once | [Card templates](../card-templates/card-templates-overview.md) |

## :material-horseshoe: Reuse a shared value or style

```yaml linenums="1"
constants:
  status_style:
    fill: var(--primary-color)
    stroke: var(--divider-color)
    stroke-width: 1

layout:
  circles:
    - xpos: 35
      ypos: 50
      radius: 4
      styles: ref(status_style)

    - xpos: 65
      ypos: 50
      radius: 4
      styles: ref(status_style)
```

Changing `status_style` updates every item that uses it. The [Reuse reference](reuse-reference.md) lists the available syntax for shared values, styles, and calculations.

## :material-horseshoe: Continue with complete examples

Use the [Reusable YAML card examples](reuse-card-examples.md) to see these features combined in complete cards. Keep the [Reuse reference](reuse-reference.md) nearby when you need an exact field or syntax reminder.

## :material-horseshoe: Related

- [Reusable YAML card examples](reuse-card-examples.md)
- [Reuse reference](reuse-reference.md)
- [Card templates](../card-templates/card-templates-overview.md)
