---
template: main.html
title: Positioning and sizing
description: Position and size tools in the Flexible Horseshoe Card coordinate system.
tags:
  - Card basics
  - Positioning
  - Sizing
---
# Positioning and sizing

Every visible item is placed on the card with card coordinates. On a normal square card, `0, 0` is the top-left and `50, 50` is the center; individual tools then add their own size settings such as radius, width, or height.

This page explains the card coordinate system, how `xpos` and `ypos` place an item, and how `aspectratio` changes the shape of the complete card.

<!-- Keep/add the coordinate-system diagram here. -->

## :material-horseshoe: Position an item

The card positions visible items by their center, so `xpos: 50` and `ypos: 50` place an item in the middle of a normal card.

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  icons:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 25  # Vertical position; 50 = center of the card
```
| Position | `xpos` | `ypos` |
| --- | ---: | ---: |
| Top-left | `0` | `0` |
| Center | `50` | `50` |
| Bottom-right | `100` | `100` |

Use intermediate values to place the item anywhere between those points.

`yposc` is an alternative vertical-center coordinate accepted by layout items. It uses the same `0`–`100` coordinate scale as `ypos`. Normal configurations can use `ypos`; where `yposc` is set, the card uses it as the vertical center instead.

## :material-horseshoe: Make the card wider or taller

Use `layout.aspectratio` to change the shape of the card:

=== "Square"

    ```yaml linenums="1"
    layout:
      aspectratio: 1/1    # Square card
```

=== "Wide"

    ```yaml linenums="1"
    layout:
      aspectratio: 1.5/1  # 1.5 times wider than high
```

=== "Tall"

    ```yaml linenums="1"
    layout:
      aspectratio: 1/1.5  # 1.5 times higher than wide
```

Each tool explains its own size settings. For example, a Circle uses a radius, a Rectangle uses width and height, and a Sparkline uses width and height.

## :material-horseshoe: Change which item is drawn on top

Use `zpos` to change the layer position of an item. Larger values are drawn above items with lower values. If you omit it, each layout section uses its own default so the normal tool types appear in a predictable order.

| Layout section | Default `zpos` |
| --- | ---: |
| Arcs | `100` |
| Rectangles | `200` |
| Polygons | `250` |
| Circles | `300` |
| Horseshoes | `400` |
| Lines | `500` |
| Icons | `600` |
| Sparklines | `650` |
| Areas | `700` |
| Names | `800` |
| States | `900` |
| Texts | `1000` |
| Controls | `1100` |

`dzpos` adds an offset to that resolved layer position. Its default is `0`. For example, `dzpos: 1` moves an item just above the normal layer for its own section without replacing the section's `zpos`.

```yaml linenums="1"
layout:
  circles:
    - xpos: 50  # Horizontal center
      ypos: 50  # Vertical center
      radius_percent: 30  # Circle size
      dzpos: 1  # Draw just above the normal Circle layer

  rectangles:
    - xpos: 50  # Horizontal center
      ypos: 50  # Vertical center
      width: 70  # Rectangle width
      height: 30  # Rectangle height
      zpos: 350  # Override the normal Rectangle layer of 200
```

## :material-horseshoe: Mirror an item

Layout items that support `flip` can be mirrored without changing their position. The default is `none`.

- `none` — leaves the item unchanged.
- `x` — mirrors it horizontally, left to right.
- `y` — mirrors it vertically, top to bottom.
- `both` — mirrors it horizontally and vertically.

```yaml linenums="1"
layout:
  rectangles:
    - xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      width: 40  # Width in card coordinates
      height: 20  # Height in card coordinates
      flip: x  # Mirror the Rectangle horizontally
```

## :material-horseshoe: Move several items together

Use a group when several items belong together and should move as one block:

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  groups:
    - id: heading  # Name this item so it can be referenced later
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 20  # Vertical position; 50 = center of the card

  icons:
    - group: heading  # Position this item inside group heading
      entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 40  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card

  names:
    - group: heading  # Position this item inside group heading
      entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 55  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
```
See [Groups](groups.md) for positioning inside a group and reusing an arrangement.

## :material-horseshoe: Related

- [Card overview](card-overview.md)
- [Groups](groups.md)
- [Card tools](../tools/tools-overview.md)
