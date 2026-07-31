---
template: main.html
title: Groups Section
description: Group related layout items around a shared position and reuse grouped elements to build consistent card layouts.
tags:
- Groups
- Section
---

# Groups section

Groups make it easier to position related layout items as a single visual unit.

Instead of assigning every item its final position on the card, you can first arrange a small collection of items around a shared local center. The group then places that complete collection at its final position. This works well for repeated combinations such as a name, state, icon, or separator that belong together.

Groups are especially useful in combination with `same_as`. Reused items can keep the same local `xpos` and `ypos` values because the group determines where they appear on the card. This keeps repeated layouts easier to read, adjust, and maintain.

## :material-horseshoe: Basic idea

A group defines a position on the card grid. Items from different layout sections can refer to that group and are placed relative to its position.

```yaml linenums="1" hl_lines="2 3 6 9"
layout:
  groups:
    L1:
      xpos: 65
      ypos: 45
    L2:
      xpos: 65
      ypos: 56
    L3:
      xpos: 65
      ypos: 67
```

In this example, `L1`, `L2`, and `L3` define three separate positions on the card. Each group can contain items from different sections, including `names`, `states`, `circles`, icons, and lines.

## :material-horseshoe: Designing around the group center

Grouped items are usually easiest to reuse when they are arranged around the center of their local group area.

In most layouts, this means positioning items around `xpos: 50` and `ypos: 50`. The group then moves the entire local arrangement to its final position on the card.

For example:

* place a name slightly to the left of center
* place a state slightly to the right
* add a small circle between them
* use the group to position the complete mini-layout

This separates the internal arrangement from its final card position. The item definitions describe how the parts relate to one another, while the group controls where the full set appears.

## :material-horseshoe: Reusing grouped names

In the example below, the first name defines the local position and styling. The next two names reuse that definition with `same_as` and only assign a different group.

```yaml linenums="1" hl_lines="1 5 11 14"
names:
  - entity_index: 1
    xpos: 47
    ypos: 50
    group: L1
    styles:
      - text-anchor: end
      - font-size: 1.2em

  - entity_index: 2
    same_as: 0
    group: L2

  - entity_index: 3
    same_as: 0
    group: L3
```

All three names keep the same local coordinates. Only the group changes, so the same name layout appears at three different positions on the card.

## :material-horseshoe: Reusing grouped circles

The same pattern works for circles. The first circle defines the local position, radius, and appearance. The remaining circles reuse those settings and only change their group assignment.

```yaml linenums="1" hl_lines="1 4 10 12"
circles:
  - xpos: 50
    ypos: 47
    group: L1
    radius: 2
    styles:
      - fill: var(--primary-text-color)
      - opacity: 0.5

  - same_as: 0
    group: L2

  - same_as: 0
    group: L3
```

This is useful for separators and small decorative elements that should keep the same relative position within each repeated group.

## :material-horseshoe: Reusing grouped states

States can be reused in the same way. The first state defines the local layout, while the others reuse that definition and receive their final position from their assigned group.

```yaml linenums="1" hl_lines="1 5 11 14"
states:
  - entity_index: 1
    xpos: 53
    ypos: 50
    group: L1
    styles:
      - text-anchor: start
      - font-size: 1.2em

  - entity_index: 2
    same_as: 0
    group: L2

  - entity_index: 3
    same_as: 0
    group: L3
```

Together with the name and circle examples above, this creates three repeated mini-layouts:

* a name on the left
* a circle in the middle
* a state on the right

The internal arrangement stays the same. Only the assigned group changes.

## :material-horseshoe: Why groups work well with `same_as`

Without groups, each repeated item usually needs its own absolute position. That means updating `xpos` and `ypos` separately for every name, state, circle, icon, or line.

With groups, repeated items can keep the same local coordinates. You only need to change the group assignment.

This makes larger layouts easier to maintain because:

* the visual structure is defined once
* repeated items can reuse that structure with `same_as`
* each group controls the final position on the card
* moving a complete set only requires changing the group position

## :material-horseshoe: When to use groups

Use groups when several items form one visual unit or should move together.

Typical examples include:

* a name, state, and icon that form a compact label
* repeated values such as L1, L2, and L3
* a circle or line used as a separator
* several elements that should share one position
* the same layout repeated in multiple places on the card

A group is usually unnecessary for a single standalone item. In that case, positioning the item directly with `xpos` and `ypos` is often clearer.

## :material-horseshoe: Showing and hiding complete groups

Groups support `visibility: visible` and `visibility: hidden`. Every item in a
hidden group remains active, but the complete group is invisible and cannot be
clicked. A hidden parent group also hides all nested groups.

Groups do not support `disabled`. Use `disabled: true` on the individual layout
items when they should not be created at all.

Because visibility accepts JavaScript templates, groups can act as dashboard
tabs. A local FHS input or a Home Assistant helper selects the visible group:

```yaml
entities:
  - entity: fhs_input_number.active_tab
    initial: 1

layout:
  groups:
    - id: tab-overview
      xpos: 50
      ypos: 50
      visibility: |
        [[[
          return Number(entities[0].state) === 1
            ? 'visible'
            : 'hidden';
        ]]]

    - id: tab-history
      xpos: 50
      ypos: 50
      visibility: |
        [[[
          return Number(entities[0].state) === 2
            ? 'visible'
            : 'hidden';
        ]]]

    - id: tab-details
      xpos: 50
      ypos: 50
      visibility: |
        [[[
          return Number(entities[0].state) === 3
            ? 'visible'
            : 'hidden';
        ]]]
```

Assign the content of each tab to its matching group. Rectangles with text
labels can update `fhs_input_number.active_tab` through their `tap_action`.
The same pattern works with a Home Assistant `input_select` or `input_number`
when several dashboards or devices should share the selected tab.
