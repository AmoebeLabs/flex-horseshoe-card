---
template: main.html
title: Local input number
description: Add a local adjustable number to a Flexible Horseshoe Card.
tags:
  - Controls
  - Flexible Horseshoe Card inputs
  - Number
---
# Local input number

A local input number is a local numeric value that can be used by the card like an entity state. It is useful for settings such as a history duration, threshold, scale limit, size, or offset when Home Assistant does not need to own that value.

A local input number is not created in Home Assistant. Its entity ID must start with `fhs_input_number.`, which tells the card to create and manage the value locally.

This page shows how to define its range and step, change it with controls or actions, use the number elsewhere in the card, and optionally persist it on this Home Assistant client.

## :material-horseshoe: Add a number

Use a local input number when the card needs a local numeric value. Add `min` and/or `max` only when the value needs limits; without them the value is unbounded in that direction.

```yaml linenums="1"
entities:
  - entity: fhs_input_number.history_days  # Create or use this local input
    initial: 1  # Value used when this local input is created
    min: 1
    max: 14
    step: 1  # Amount added or removed by each adjustment
    unit: d  # Unit shown with the value
    scope: card  # Keep this value inside this card
```

## :material-horseshoe: Change it with a Number control or Slider

Connect a [Number control](number-tool.md) for minus/plus steps or a [Slider](slider-tool.md) for direct dragging.

## :material-horseshoe: Use the value in the card

Read the state in a JavaScript template and convert it to a number when needed:

```yaml linenums="1"
entities:
  - entity: fhs_input_number.history_days  # Local number used to choose the history length
    initial: 1
    min: 1
    max: 14
  - entity: sensor.temperature  # Entity whose history is graphed

layout:
  sparklines:
    - entity_index: 1  # Graph the temperature entity
      xpos: 50
      ypos: 50
      width: 80
      height: 35
      # Convert the selected number of days to hours for the Sparkline.
      period:
        rolling_window:
          duration:
            hour: |
              [[[
                return Number(entities[0].state) * 24;
              ]]]
```
## :material-horseshoe: Change the value from an action

Actions can update the local number when the value should change from another control instead of a Number or Slider control.

| Action | Result |
| --- | --- |
| `fhs_input_number.set_value` | Sets a specific value |
| `fhs_input_number.increment` | Adds one step |
| `fhs_input_number.decrement` | Removes one step |

The result stays within `min` and `max`.

## :material-horseshoe: Share or persist the value

Use `scope: global` to share the number with cards in this Home Assistant client. Add `persist: true` to restore the global value after a reload.

## :material-horseshoe: Configuration options


`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `entity` | string | Yes | — | Unique ID starting with `fhs_input_number.`. |
| `initial` | number | Yes | — | Initial numeric value. |
| `min`, `max` | number | No | Not set | Optional lower and upper limits. When both are set, `min` must be lower than `max`; `initial` must fall inside the configured limits. Omit either bound when the value should remain unbounded in that direction. |
| `step` | number | No | `1` | Amount added or removed by an increment/decrement action or step control; it must be greater than zero. |
| `unit` | string | No | Empty | Unit shown with the local number; omit it when the value has no unit. |
| `decimals` | integer | No | `0` | Number of decimal places used when this local number is displayed. |
| `scope` | `card`, `global` | No | `card` | `card` keeps a separate value per card; `global` shares the value between cards in this Home Assistant client. |
| `persist` | boolean | No | `false` | Restores the value after a client reload; it can only be enabled with `scope: global`. |
| `name` | string | No | Entity ID suffix | Display name exposed by the local entity. |
| `icon` | string | No | Not set | Optional icon exposed by the local entity. |
| `tap_action` | action | No | `none` | Default tap action inherited by a layout item that uses this local entity and does not define its own tap action. |

## :material-horseshoe: Related

- [Number control](number-tool.md)
- [Slider](slider-tool.md)
- [Local input entities](browser-local-inputs.md)
- [JavaScript templates](../../dynamic/javascript-templates.md)
