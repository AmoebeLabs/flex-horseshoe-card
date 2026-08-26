---
template: main.html
title: FHS input boolean
description: Store a browser-local on/off choice for Flexible Horseshoe Card controls and visibility.
tags:
  - Controls
  - FHS inputs
  - Boolean
---

# FHS input boolean

Use `fhs_input_boolean` for an on/off choice that only affects FHS cards in the current browser.

## :material-horseshoe: Add a boolean input

```yaml linenums="1"
entities:
  - entity: fhs_input_boolean.show_labels
    initial: true
    scope: card
```

Connect it to a toggle:

```yaml linenums="1"
layout:
  controls:
    - id: show-labels
      type: toggle
      entity_index: 0
      xpos: 50
      ypos: 85
      width: 24
      show:
        item_variant: switch
        item_viz: default
        item_style: ha
```

Templates read the state as `on` or `off`.

## :material-horseshoe: Change it with an action

```yaml linenums="1"
tap_action:
  action: perform-action
  perform_action: fhs_input_boolean.toggle
  target:
    entity_id: fhs_input_boolean.show_labels
```

The available actions are `toggle`, `turn_on`, and `turn_off`.

## :material-horseshoe: Related

- [Toggle control](toggle-tool.md)
- [Visibility](../../interaction/visibility.md)
- [Browser-local inputs](browser-local-inputs.md)
