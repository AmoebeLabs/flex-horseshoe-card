---
template: main.html
title: Groups Section
description: Group related layout items around a shared position and reuse grouped elements to build consistent card layouts.
tags:
  - Groups
  - Section
---

# Groups section

Groups make it easier to place multiple related layout items together.

Instead of giving every item its final position on the card, you can design a small set of items around a shared local center point and then place that whole set with a group. This is useful for repeated parts of a card, such as a name, state, and separator circle that belong together.

Groups become especially useful together with `same_as`. Reused items can keep the same `xpos` and `ypos` values, because their final position is determined by the group they belong to. This makes repeated layouts much easier to read and maintain.

## :material-horseshoe: Basic idea

A group defines a position on the card grid.

Items from different layout sections can then refer to that group. The card places those items relative to the group position.

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

In this example, the groups `L1`, `L2`, and `L3` define three positions on the card. Each group can contain items from different sections, such as `names`, `states`, and `circles`.

## :material-horseshoe: Designing items around the group center

When using groups, it is usually best to design grouped items around the center of the local group area.

In most cases, that means positioning the grouped items around `xpos: 50` and `ypos: 50`. The group then moves the complete set of items to its final position on the card.

For example:

- a name can be placed slightly left of center
- a state can be placed slightly right of center
- a small circle can be placed between them
- the group decides where that complete mini-layout appears on the card

This keeps the item definitions reusable. The items describe the internal layout, while the group describes the final position.

## :material-horseshoe: Reusing grouped names

In the example below, the first name defines the local position and styling. The next two names reuse that definition with `same_as` and only change the group.

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
                same_as: 1
                group: L2
              - entity_index: 3
                same_as: 1
                group: L3
```

The `xpos` and `ypos` values stay the same for all three names. Only the group changes. This means the same local layout is placed at three different positions on the card.

## :material-horseshoe: Reusing grouped circles

The same approach works for circles. The first circle defines the local position, radius, and styles. The other circles copy it and only use a different group.

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

This is useful for repeated separators or small decorative elements that should appear in the same relative position inside each group.

## :material-horseshoe: Reusing grouped states

States can be reused in the same way. The first state defines the local layout. The other states copy it and are placed by their own group.

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
                same_as: 1
                group: L2
              - entity_index: 3
                same_as: 1
                group: L3
```

Together with the names and circles above, this creates three repeated mini-layouts:

- name on the left
- circle in the middle
- state on the right

Only the group changes for each repeated set.

## :material-horseshoe: Why groups work well with `same_as`

Without groups, every repeated item usually needs its own absolute position. That means you have to adjust `xpos` and `ypos` for each name, state, circle, icon, or line.

With groups, repeated items can keep the same local coordinates. You only change the group assignment.

This makes larger layouts easier to maintain because:

- the visual structure is defined once
- repeated items can use `same_as`
- each group controls the final card position
- moving a whole set of related items only requires changing the group position

## :material-horseshoe: When to use groups

Use groups when several items belong together visually.

Typical examples are:

- a name, state, and icon that form one small label
- repeated phase values such as L1, L2, and L3
- a circle or line used as a separator between related values
- multiple items that should move together
- a repeated layout that should appear in several places on the card

For single, standalone items, a group is usually not needed. In those cases, placing the item directly with `xpos` and `ypos` is often clearer.
