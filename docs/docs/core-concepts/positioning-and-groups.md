---
template: main.html
title: Positioning and Groups
description: Position items on the card coordinate system with `xpos` and `ypos`, and use groups to move and reuse related layout elements together.
tags:
  - Positioning
  - Groups
---

# Positioning and groups

The Flexible Horseshoe Card uses relative positioning. Most visual items are placed with `xpos` and `ypos`.

For simple cards, you can position each item directly on the card. For repeated or related items, groups are often easier: you design the items once around a local center point, and then place the whole group somewhere on the card.

## :material-horseshoe: The card canvas

For a square card with an aspect ratio of `1/1`, the base layout canvas is `100 x 100`.

This means:

- `xpos: 0` is the left side of the card
- `xpos: 50` is the horizontal center
- `xpos: 100` is the right side of the card
- `ypos: 0` is the top of the card
- `ypos: 50` is the vertical center
- `ypos: 100` is the bottom of the card

For example:

```yaml linenums="1"
xpos: 50
ypos: 50
```

places an item in the center of a square card.

Different aspect ratios change the effective canvas size. For example, an aspect ratio of `2/1` creates a wider `200 x 100` canvas. The same positioning logic still applies, but there is more horizontal space available.

```yaml linenums="1"
aspectratio: 2/1
```

In that case, `xpos: 100` is the horizontal center of the wider card, and `xpos: 200` is the right side.

## :material-horseshoe: Positioning individual items

Most layout items use `xpos` and `ypos` to define their position.

```yaml linenums="1"
states:
  - entity_index: 0
    xpos: 50
    ypos: 55
```

This places the state value around the center of the card.

The exact visual alignment also depends on the type of item and its styling. Text items may use `text-anchor`, icons may use `align`, and lines or circles also use fields such as `length` or `radius`.

## :material-horseshoe: Items that can be positioned

The following layout sections commonly use `xpos` and `ypos`:

| Section | Positioned item |
| :------ | :-------------- |
| `areas` | Entity area text |
| `names` | Entity name text |
| `states` | Entity state text |
| `icons` | Entity icon or standalone icon |
| `circles` | Circle center point |
| `hlines` | Horizontal line center point |
| `vlines` | Vertical line center point |
| `horseshoes` | Horseshoe center point |
| `groups` | Group placement point |

Each item type may have extra positioning-related fields. For example, circles use `radius`, lines use `length`, and horseshoes use settings such as `radius`, `arc_degrees`, `rotate`, and `flip`.

## :material-horseshoe: Why use groups?

Groups are useful when several items belong together.

For example, you may want to show a name, state, and small circle for each phase of an electricity meter. The items inside each phase look the same, but the whole phase block appears in a different place on the card.

Instead of calculating every item position separately, you can:

1. design the name, state, and circle once;
2. place those items in a group;
3. move the group to the desired position.

This keeps the layout easier to understand and easier to adjust.

## :material-horseshoe: Defining groups

Groups are defined in the `layout.groups` section.

```yaml linenums="1"
layout:
  groups:
    L1:
      xpos: 23
      ypos: 72
    L2:
      xpos: 73
      ypos: 72
    L3:
      xpos: 48
      ypos: 83
```

Each group has a name and a position. Layout items can then refer to that group by name.

```yaml linenums="1"
names:
  - entity_index: 1
    group: L1
    xpos: 47
    ypos: 50
```

The item still has its own `xpos` and `ypos`, but those coordinates are now used inside the group.

## :material-horseshoe: Design grouped items around `50,50`

Groups work best when the items inside the group are designed around `xpos: 50` and `ypos: 50`.

Think of the group as a small local layout area. If the items are arranged around the local center, the group can be moved around the card more predictably.

Example:

```yaml linenums="1"
names:
  - id: first
    entity_index: 1
    group: L1
    xpos: 47
    ypos: 50
    styles:
      - text-anchor: end

states:
  - id: first
    entity_index: 1
    group: L1
    xpos: 53
    ypos: 50
    styles:
      - text-anchor: start

circles:
  - id: first
    group: L1
    xpos: 50
    ypos: 47
    radius: 2
```

In this example, the name is slightly left of the group center, the state is slightly right of the group center, and the circle is slightly above the center.

The whole group can then be moved by changing only the group position.

## :material-horseshoe: Groups and `same_as`

Groups become especially useful when combined with `same_as`.

You can define one item and reuse it for another group. The reused item can keep the same local `xpos` and `ypos`, because the group decides where it appears on the card.

```yaml linenums="1"
names:
  - id: first
    entity_index: 1
    group: L1
    xpos: 47
    ypos: 50
    styles:
      - text-anchor: end

  - id: second
    entity_index: 2
    same_as: first
    group: L2

  - id: third
    entity_index: 3
    same_as: first
    group: L3
```

Here, all three name items use the same local position. They appear in different places because they belong to different groups.

This avoids repeating the same positioning and styling over and over again.

## :material-horseshoe: Moving a group

Once several items belong to a group, moving them is simple.

```yaml linenums="1"
groups:
  L1:
    xpos: 23
    ypos: 72
```

Change the group position:

```yaml linenums="1"
groups:
  L1:
    xpos: 30
    ypos: 75
```

All items in group `L1` move together.

This is often much easier than updating every individual item.

## :material-horseshoe: Scaling and rotating groups

Groups can also be used to transform related items together, where supported.

A group may include options such as scaling or rotation:

```yaml linenums="1"
groups:
  L1:
    xpos: 50
    ypos: 50
    scale:
      x: 1
      y: 1
    rotate: 90
```

This can be useful when a small collection of items needs to be reused in a different orientation or size.

## :material-horseshoe: When to use groups

Use groups when:

- several items visually belong together
- the same group of items appears multiple times
- you want to move related items as one block
- you want to combine repeated items with `same_as`
- you want to keep local item positions simple

Do not use groups for every item. For a single unique item, direct positioning is often easier to read.

## :material-horseshoe: Practical tips

Start with a simple square card and place items using the `100 x 100` reference. Once the layout works, adjust the aspect ratio if the card needs to be wider or narrower.

For grouped items, design around `50,50`. Put the related items slightly around that center point, then move the group itself to the correct place on the card.

Use `same_as` when multiple grouped items share the same local position and styling. Change only the fields that are different, such as `entity_index` or `group`.

Keep groups small and meaningful. A group should usually represent one visual block, such as one phase, one row, one label/value pair, or one repeated cluster.

For complete cards that combine groups, calculated positions, and reused items, see [Reusable YAML Card Examples](../reuse/reuse-card-examples.md). For the available group fields and section syntax, see the [Groups Section](../sections/groups-section.md).
