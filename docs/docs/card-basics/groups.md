---
template: main.html
title: Groups
description: Position several related card tools together and move them as one visual unit.
tags:
  - Groups
  - Layout
---
# Groups

A group keeps several card items together as one visual arrangement. The items keep their positions relative to the group, while moving the group moves the complete arrangement at once.

This page shows how to create a group, position items inside it, repeat the same arrangement elsewhere, and show or hide the complete group together.

## :material-horseshoe: Put related items in a group

This example keeps an icon, name, and state together:

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  groups:
    - id: room  # Name this item so it can be referenced later
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 30  # Vertical position; 50 = center of the card

  icons:
    - group: room  # Position this item inside group room
      entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 35  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card

  names:
    - group: room  # Position this item inside group room
      entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 45  # Horizontal position; 50 = center of the card
      ypos: 44  # Vertical position; 50 = center of the card
      styles:
        text-anchor: start  # Horizontal alignment of the text

  states:
    - group: room  # Position this item inside group room
      entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 45  # Horizontal position; 50 = center of the card
      ypos: 56  # Vertical position; 50 = center of the card
      styles:
        text-anchor: start  # Horizontal alignment of the text
```
Changing only the group's `xpos` or `ypos` moves all three items together.

## :material-horseshoe: Position items inside the group

The center of a group is `50, 50`.

- Values below `50` move an item left or up.
- Values above `50` move an item right or down.
- `50, 50` keeps the item at the group center.

The group itself uses the normal card coordinates.

## :material-horseshoe: Put a group inside another group

Set `parent` when one group should be positioned relative to another group. The child group also uses `50, 50` as its no-offset position.

```yaml linenums="1"
layout:
  groups:
    - id: dashboard-section
      xpos: 60  # Position of the parent group on the card
      ypos: 50

    - id: room
      parent: dashboard-section  # Position this group relative to dashboard-section
      xpos: 50  # No horizontal offset from the parent
      ypos: 65  # Move 15 units down from the parent
```

A parent must name an existing group. Groups cannot form a circular parent chain.

## :material-horseshoe: Scale a group

Set `scale` to resize items that use the group. A single number scales both directions; an `x`/`y` mapping lets you scale horizontally and vertically by different amounts.

```yaml linenums="1"
layout:
  groups:
    - id: compact
      xpos: 50
      ypos: 50
      scale: 0.8  # Render items in this group at 80% size

    - id: wide
      xpos: 50
      ypos: 75
      scale:
        x: 1.2  # Make grouped items wider
        y: 0.8  # Make grouped items shorter
```

Omit `scale` to leave the grouped items at their normal size.

## :material-horseshoe: Repeat the same arrangement elsewhere

Create another group and reuse the items when the same arrangement should appear somewhere else:

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example
  - entity: sensor.example_2  # Entity used by this example

layout:
  groups:
    - id: living-room  # Name this item so it can be referenced later
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 30  # Vertical position; 50 = center of the card
    - id: bedroom  # Name this item so it can be referenced later
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 70  # Vertical position; 50 = center of the card

  names:
    - id: room-name  # Name this item so it can be referenced later
      group: living-room  # Position this item inside group living-room
      entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 45  # Horizontal position; 50 = center of the card
      ypos: 44  # Vertical position; 50 = center of the card

    - same_as: room-name  # Start with the settings from room-name
      group: bedroom  # Position this item inside group bedroom
      entity_index: 1  # Use entity 1 from entities: (0 = first entity)
```
See [Reuse](../reuse/reuse-introduction.md) when more of the arrangement should be reused.

## :material-horseshoe: Adjust colors for a complete group

Set `color_filter` on the group when all items in that group should receive the same color adjustment. Items can still add their own filter settings.

```yaml linenums="1"
layout:
  groups:
    - id: muted
      xpos: 50
      ypos: 50
      color_filter:
        saturation: 0.4  # Reduce color intensity for items in this group
```

See [Color filters](../appearance/color-filters.md) for the available filter fields.

## :material-horseshoe: Show or hide a complete group

Apply visibility to the group when a complete part of the card should appear or disappear together:

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  groups:
    - id: history  # Name this item so it can be referenced later
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 60  # Vertical position; 50 = center of the card
      visibility: |
        [[[
          return entities[0].state === 'on' ? 'visible' : 'hidden';
        ]]]
```
See [Visibility](../interaction/visibility.md) for more examples.

## :material-horseshoe: Configuration options


`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `id` | string | No | List position as text | Name used by `group`, `parent`, and `same_as`. If omitted, the card uses the group's zero-based position in `layout.groups` as a text ID: `"0"`, `"1"`, `"2"`, and so on. |
| `parent` | string | No | Card root | Positions this group relative to the named parent group. |
| `xpos` | number | Yes | — | Horizontal position of the complete group. For a child group, `50` means no horizontal offset from its parent. |
| `ypos` | number | Yes | — | Vertical position of the complete group. For a child group, `50` means no vertical offset from its parent. |
| `scale` | number or `{x, y}` | No | `1` | Scales items that use this group. A number scales both directions; `x` and `y` set them separately. |
| `visibility` | `visible`, `hidden`, or template | No | `visible` | `visible` renders the group and its contents; `hidden` hides the group and items below it in the parent chain. A template can return either value dynamically. |
| `color_filter` | mapping | No | Not set | Applies the configured color adjustments to items in this group. Parent-group filters are applied before child-group and item filters. |
| `same_as` | string | No | Not set | Starts this group from an earlier group in `layout.groups`. |
| `same_as_replace` | list of paths | No | Not set | Replaces selected inherited fields instead of combining them with the reused group. |

## :material-horseshoe: Related

- [Positioning and sizing](positioning-and-sizing.md)
- [Reuse](../reuse/reuse-introduction.md)
- [Visibility](../interaction/visibility.md)
