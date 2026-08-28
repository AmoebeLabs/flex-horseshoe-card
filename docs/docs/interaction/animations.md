---
template: main.html
title: Animations
description: Change or animate Flexible Horseshoe Card tools when an entity reaches a state.
tags:
  - Interaction
  - Animations
  - CSS
---

# Animations

Use animations to draw attention to a state change, highlight an active device, or change a tool's appearance.

## :material-horseshoe: Animate a matching state

Give the target tool an `animation_id`:

```yaml linenums="1"
layout:
  circles:
    - animation_id: 10
      entity_index: 0
      xpos: 50
      ypos: 50
      radius: 30
```

Then describe what happens for a state:

```yaml linenums="1"
animations:
  entity.0:
    - state: "on"
      circles:
        - animation_id: 10
          styles:
            - fill: var(--primary-color)
            - animation: pulse 1s ease-in-out both
            - transform-origin: center
```

`entity.0` watches the first card entity. The matching `animation_id` identifies the tool that changes.

## :material-horseshoe: Included animation names

Common choices include:

- `pulse`
- `flash`
- `heartBeat`
- `jello`
- `shake`
- `swing`
- `zoomIn`
- `zoomOut`

Use them through the CSS `animation` property.

## :material-horseshoe: Use a dynamic style

For a numeric threshold or a condition involving several entities, put the condition directly in the style:

```yaml linenums="1"
styles:
  animation: |
    [[[
      return Number(state) > 30
        ? 'flash 1s ease-in-out 3'
        : 'none';
    ]]]
```

See [JavaScript templates](../dynamic/javascript-templates.md) for the available values and more examples.

## :material-horseshoe: Related

- [Styling](../appearance/styling.md)
- [Visibility](visibility.md)
- [JavaScript templates](../dynamic/javascript-templates.md)
