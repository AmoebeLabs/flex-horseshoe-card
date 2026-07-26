---
template: main.html
title: Positioning and Groups
description: Position items on the card coordinate system with `xpos` and `ypos`, and use groups to move and reuse related layout elements together.
tags:
- Positioning
- Groups
---

# Positioning and groups

The Flexible Horseshoe Card uses relative positioning. Most visual elements are placed with `xpos` and `ypos`.

For simple cards, you can position each item directly on the card. When several elements belong together or repeat across the layout, groups are usually easier to manage. You arrange the items once around a shared local center, then position the complete group elsewhere on the card.

## :material-horseshoe: The card canvas

For a square card with an aspect ratio of `1/1`, the base layout canvas is `100 × 100`.

The coordinate system works as follows:

* `xpos: 0` is the left edge of the card.
* `xpos: 50` is the horizontal center.
* `xpos: 100` is the right edge.
* `ypos: 0` is the top edge.
* `ypos: 50` is the vertical center.
* `ypos: 100` is the bottom edge.

For example:

```yaml linenums="1"
xpos: 50
ypos: 50
```

places an item in the center of a square card.

Other aspect ratios change the effective canvas dimensions. An aspect ratio of `2/1`, for example, creates a wider `200 × 100` canvas:

```yaml linenums="1"
aspectratio: 2/1
```

The same positioning model still applies. In this case, `xpos: 100` is the horizontal center and `xpos: 200` is the right edge.

## :material-horseshoe: Positioning individual items

Most layout items use `xpos` and `ypos` to define their position.

```yaml linenums="1"
states:
  - entity_index: 0
    xpos: 50
    ypos: 55
```

This places the state value near the center of the card.

Its exact visual alignment also depends on the element type and styling. Text items may use `text-anchor`, icons may use `align`, and shapes may use additional fields such as `length` or `radius`.

## :material-horseshoe: Items that can be positioned

The following layout sections commonly use `xpos` and `ypos`:

| Section      | Positioned item                |
| :----------- | :----------------------------- |
| `areas`      | Entity area text               |
| `names`      | Entity name text               |
| `states`     | Entity state text              |
| `icons`      | Entity icon or standalone icon |
| `circles`    | Circle center point            |
| `hlines`     | Horizontal line center point   |
| `vlines`     | Vertical line center point     |
| `horseshoes` | Horseshoe center point         |
| `groups`     | Group placement point          |

Each element type can also have its own geometry settings. Circles use `radius`, lines use `length`, and horseshoes use fields such as `radius`, `arc_degrees`, `rotate`, and `flip`.

## :material-horseshoe: Why use groups?

Groups are useful when several elements form one visual unit.

For example, an electricity card may show a name, state, and small circle for each phase. The internal arrangement stays the same for L1, L2, and L3, while each phase block appears in a different position.

![](../assets/screenshots/fhs-demo-card-30a-electricity--dark.png){width=300}

Instead of calculating every absolute position separately, you can:

1. arrange the name, state, and circle once;
2. assign those items to a group;
3. place the group at the desired card position.

This keeps the layout easier to understand and makes later adjustments much simpler.

## :material-horseshoe: Defining groups

Groups are configured under `layout.groups`.

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

Each group has a name and a position. Layout items can refer to that name through the `group` field.

```yaml linenums="1"
names:
  - entity_index: 1
    group: L1
    xpos: 47
    ypos: 50
```

The item still has its own `xpos` and `ypos`, but those values now define its position within the local group layout.

## :material-horseshoe: Designing grouped items around `50, 50`

Grouped items are usually easiest to reuse when they are arranged around the local center at `xpos: 50` and `ypos: 50`.

Think of the group as a small coordinate area inside the card. When its items are positioned around that center, the entire arrangement can be moved more predictably.

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

In this example:

* the name appears slightly left of center;
* the state appears slightly right of center;
* the circle appears slightly above center.

You can then move the complete arrangement by changing only the group position.

## :material-horseshoe: Groups and `same_as`

Groups become especially useful when combined with `same_as`.

Define one item, then reuse it in another group. The reused item keeps the same local `xpos`, `ypos`, and styling, while its group determines the final position on the card.

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

All three names use the same local position. They appear in different places because each one belongs to a different group.

This avoids repeating the same coordinates and styles for every item.

## :material-horseshoe: Moving a group

Once several items belong to a group, you can move them together by changing the group position.

Original position:

```yaml linenums="1"
groups:
  L1:
    xpos: 23
    ypos: 72
```

Updated position:

```yaml linenums="1"
groups:
  L1:
    xpos: 30
    ypos: 75
```

Every item assigned to `L1` moves with the group. This is usually much easier than updating each element separately.

## :material-horseshoe: Scaling and rotating groups

Where supported, groups can also transform several related items together.

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

This is useful when the same local arrangement needs to appear at a different size or orientation.

## :material-horseshoe: When to use groups

Use groups when:

* several elements belong together visually;
* the same arrangement appears more than once;
* related items should move as one unit;
* reused items share the same local position and styling;
* local coordinates are easier to understand than repeated absolute positions.

A group is usually unnecessary for a single standalone item. In that case, direct positioning is often clearer.

## :material-horseshoe: Practical tips

Start with a square card and use the `100 × 100` canvas as your reference. Once the layout works, adjust the aspect ratio when the card needs to be wider or taller.

For grouped elements, design around `50, 50`. Position each item slightly around that center, then move the group itself to the correct place on the card.

Use `same_as` when repeated grouped items share the same local coordinates and styling. Override only the fields that differ, such as `entity_index` or `group`.

Keep groups small and meaningful. A group should usually represent one visual block, such as a phase, row, label-and-value pair, or repeated cluster.

For complete examples that combine groups, calculated positions, and reused items, see [Reusable YAML Card Examples](../reuse/reuse-card-examples.md). For all available group fields and syntax, see [Groups Section](../sections/groups-section.md).
