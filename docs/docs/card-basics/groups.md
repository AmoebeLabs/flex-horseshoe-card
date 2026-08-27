---
template: main.html
title: Groups
description: Position several related card tools together and move them as one visual unit.
tags:
  - Groups
  - Layout
---

# Groups

Use a group when several tools belong together. Move the group to reposition all of them at once. Each tool keeps its own relative position within the group.

## Basic usage

This group combines an icon, name, state, and line into one room summary:

```yaml linenums="1"
layout:
  groups:
    - id: living-room
      xpos: 50
      ypos: 30

  icons:
    - id: room-icon
      group: living-room
      entity_index: 0
      xpos: 35
      ypos: 50
      size: 4

  names:
    - id: room-name
      group: living-room
      entity_index: 0
      xpos: 45
      ypos: 44
      styles:
        text-anchor: start

  states:
    - id: room-state
      group: living-room
      entity_index: 0
      xpos: 45
      ypos: 56
      styles:
        text-anchor: start

  lines:
    - id: room-status
      group: living-room
      entity_index: 0
      xpos: 50
      ypos: 68
      length: 30
      orientation: horizontal
```

The tool coordinates describe their positions inside the group. Changing only the group's `xpos` or `ypos` moves the icon, name, state, and line together.

## Arrange tools around the center

The local center of a group is `xpos: 50`, `ypos: 50`.

- Use a value below `50` to place a tool left of or above the center.
- Use a value above `50` to place a tool right of or below the center.
- Keep related tools near the center when the same arrangement will be reused elsewhere.

The group itself uses the normal card coordinates.

## Repeat an arrangement

Create another group when the same visual arrangement should appear elsewhere. Reuse each tool with `same_as` and assign the new group.

```yaml linenums="1"
layout:
  groups:
    - id: living-room
      xpos: 50
      ypos: 30

    - id: bedroom
      xpos: 50
      ypos: 70

  names:
    - id: living-room-name
      group: living-room
      entity_index: 0
      xpos: 45
      ypos: 44

    - id: bedroom-name
      same_as: living-room-name
      group: bedroom
      entity_index: 1

  states:
    - id: living-room-state
      group: living-room
      entity_index: 0
      xpos: 45
      ypos: 56

    - id: bedroom-state
      same_as: living-room-state
      group: bedroom
      entity_index: 1
```

Both room summaries keep the same internal arrangement. Their groups determine where they appear on the card.

See [Reusing items with same_as](../reuse/reuse-with-same_as.md) when more parts of the arrangement should be reused.

## Show content when it is needed

A group can reveal a complete part of the card for a selected mode, tab, or entity state. For example, show the history view only while History is selected:

```yaml linenums="1"
layout:
  groups:
    - id: history
      xpos: 50
      ypos: 60
      visibility: |
        [[[
          return entities[0].state === 'on'
            ? 'visible'
            : 'hidden';
        ]]]
```

See [Visibility](../interaction/visibility.md) for conditional examples.

## Configuration

| Field | Description |
| --- | --- |
| `id` | Names the group so tools can refer to it. |
| `xpos` | Horizontal position of the complete group on the card. |
| `ypos` | Vertical position of the complete group on the card. |
| `visibility` | Shows or hides the group and its tools. |

## Related

- [Positioning and sizing](positioning-and-sizing.md)
- [Reuse](../reuse/reuse-introduction.md)
- [Visibility](../interaction/visibility.md)
