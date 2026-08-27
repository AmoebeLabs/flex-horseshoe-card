---
template: main.html
title: Visibility
description: Show, hide, or disable Flexible Horseshoe Card tools and controls.
tags:
  - Interaction
  - Visibility
---

# Visibility

Use `visibility` to choose whether a tool or control is shown and available.

| Value | Result |
| --- | --- |
| `visible` | Shows the item normally. |
| `hidden` | Hides the item. |
| `unavailable` | Shows a control as unavailable and prevents interaction. |

## :material-horseshoe: Hide an item

```yaml linenums="1"
- id: optional-label
  text: Extra details
  xpos: 50
  ypos: 80
  visibility: hidden
```

## :material-horseshoe: Change visibility from a state

```yaml linenums="1"
visibility: |
  [[[
    return entities[entity_slots.show_details[0]].state === 'on'
      ? 'visible'
      : 'hidden';
  ]]]
```

## :material-horseshoe: Disable an unavailable control

Use `unavailable` when the control should remain visible but cannot be used for the current choice:

```yaml linenums="1"
visibility: |
  [[[
    return entities[entity_slots.chart_type[0]].state === 'dots'
      ? 'unavailable'
      : 'visible';
  ]]]
```

The control applies its unavailable appearance and ignores interaction.

## :material-horseshoe: Show and hide a group

Set visibility on a group to affect all tools placed inside it. See [Groups](../card-basics/groups.md).

## :material-horseshoe: Related

- [Flexible Horseshoe Card input boolean](../tools/controls/fhs-input-boolean.md)
- [JavaScript templates](../dynamic/javascript-templates.md)
- [Animations](animations.md)
