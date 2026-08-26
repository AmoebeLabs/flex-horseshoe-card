---
template: main.html
title: FHS input number
description: Store a browser-local numeric value for Flexible Horseshoe Card controls and templates.
tags:
  - Controls
  - FHS inputs
  - Number
---

# FHS input number

Use `fhs_input_number` for a numeric card setting such as a history duration, offset, scale boundary, width, or threshold.

## :material-horseshoe: Add a numeric input

```yaml linenums="1"
entities:
  - entity: fhs_input_number.history_days
    initial: 1
    min: 1
    max: 14
    step: 1
    unit: d
    scope: card
```

Connect it to a [number](number-tool.md) or [slider](slider-tool.md) control.

## :material-horseshoe: Set a value

```yaml linenums="1"
tap_action:
  action: perform-action
  perform_action: fhs_input_number.set_value
  target:
    entity_id: fhs_input_number.history_days
  data:
    value: 7
```

Use `fhs_input_number.increment` and `fhs_input_number.decrement` to change the value by its configured step.

## :material-horseshoe: Use the value

Templates receive the input state as text. Convert it when you need a number:

```yaml linenums="1"
hour: |
  [[[
    return Number(entities[0].state) * 24;
  ]]]
```

## :material-horseshoe: Related

- [Number control](number-tool.md)
- [Slider control](slider-tool.md)
- [Browser-local inputs](browser-local-inputs.md)
