---
template: main.html
title: FHS input number
description: Add a browser-local adjustable number to a Flexible Horseshoe Card.
tags:
  - Controls
  - FHS inputs
  - Number
---

# FHS input number

An FHS input number adds an adjustable numeric setting directly to a Flexible Horseshoe Card. Use it for a history duration, scale boundary, threshold, offset, width, or any other number used by the card.

The value is stored in the current browser and does not require a Home Assistant helper. Use a Home Assistant [Input number](https://www.home-assistant.io/integrations/input_number/) instead when automations, other dashboards, or other devices need the same value.

## :material-horseshoe: Basic configuration

Add the input to the card's `entities` list. Its entity ID must start with `fhs_input_number.`.

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

Connect a number control to the input:

```yaml linenums="1"
layout:
  controls:
    - id: history-days
      type: number
      entity_index: 0
      xpos: 50
      ypos: 85
      width: 32
      height: 10
      show:
        item_variant: stepper
        item_viz: buttons
        item_style: outlined_round
```

Use a [slider control](slider-tool.md) instead when the user should adjust the value by dragging along a range.

## :material-horseshoe: Configuration options

| Option | Description |
| --- | --- |
| `entity` | A unique entity ID starting with `fhs_input_number.`. |
| `initial` | Value assigned when the input is created. |
| `min` | Lowest value the input can contain. |
| `max` | Highest value the input can contain. |
| `step` | Amount added or removed by each adjustment. |
| `unit` | Unit shown with the value. |
| `decimals` | Number of decimal places shown for the value. |
| `scope: card` | Keeps a separate value for this card. |
| `scope: global` | Shares the value with FHS cards in the current browser. |
| `persist: true` | Restores a global value after the browser reloads. |
| `name` | Name shown by tools that display the entity name. |
| `icon` | Icon shown by tools that display the entity icon. |

See [Entities](../../card-basics/entities.md) for slots and other entity settings.

## :material-horseshoe: Use the value in a card

The input state contains the current value. Convert it to a number when using it in a calculation.

This example converts a number of days to the hours used by a sparkline history period:

```yaml linenums="1"
period:
  rolling_window:
    duration:
      hour: |
        [[[
          return Number(entities[0].state) * 24;
        ]]]
```

The same pattern can change a scale, threshold, size, position, or other numeric card setting.

## :material-horseshoe: List of actions

Number and slider controls change the value directly. Buttons and other actionable tools can use these actions:

| Action | Result |
| --- | --- |
| `fhs_input_number.set_value` | Sets the input to a specific value. |
| `fhs_input_number.increment` | Adds one configured step. |
| `fhs_input_number.decrement` | Removes one configured step. |

```yaml linenums="1"
tap_action:
  action: perform-action
  perform_action: fhs_input_number.set_value
  target:
    entity_id: fhs_input_number.history_days
  data:
    value: 7
```

The value remains within the configured `min` and `max`.

## :material-horseshoe: Keep the value after reloading

Use `scope: global` with `persist: true` when the number should remain active after reloading the dashboard:

```yaml linenums="1"
entities:
  - entity: fhs_input_number.history_days
    initial: 1
    min: 1
    max: 14
    step: 1
    scope: global
    persist: true
```

Every FHS card in the current browser that defines `fhs_input_number.history_days` receives the same value. Other browsers and devices keep their own value.

## :material-horseshoe: Related

- [Number control](number-tool.md)
- [Slider control](slider-tool.md)
- [Browser-local inputs](browser-local-inputs.md)
- [JavaScript templates](../../dynamic/javascript-templates.md)
