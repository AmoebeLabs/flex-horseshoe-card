---
template: main.html
title: Number control
description: Increase or decrease a numeric entity in fixed steps.
tags:
  - Controls
  - Number
---

# Number control

A number control gives the user minus and plus buttons for changing a numeric value in fixed steps. Use it for settings such as a history duration, target value, threshold, scale limit, or display size.

Connect it to a Home Assistant [Number](https://www.home-assistant.io/integrations/number/) or [Input number](https://www.home-assistant.io/integrations/input_number/) when the value is also used by Home Assistant. Use an [Flexible Horseshoe Card input number](fhs-input-number.md) when the value only controls Flexible Horseshoe Card cards in the current browser.

<!-- Add filled and outlined number control screenshots here. -->

## :material-horseshoe: Basic configuration

This example lets the user choose a history period between 1 and 14 days:

```yaml linenums="1"
entities:
  - entity: fhs_input_number.history_days
    initial: 1
    min: 1
    max: 14
    step: 1
    unit: d
    scope: card

layout:
  controls:
    - id: history-days
      type: number
      entity_index: 0
      xpos: 50
      ypos: 50
      width: 42
      height: 12

      show:
        item_variant: stepper
        item_viz: buttons
        item_style: outlined_round
```

The control uses the current value, minimum, maximum, step, and unit from the connected entity.

!!! info "Entity and input settings"

    `entity_index: 0` connects the control to the first entry in `entities`. The `initial`, `min`, `max`, `step`, `unit`, and `scope` settings configure the Flexible Horseshoe Card input, not the Number control. See [Flexible Horseshoe Card input number](fhs-input-number.md) for all input settings and [Entities](../../card-basics/entities.md) for entity indexes and optional slots.

## :material-horseshoe: Configuration options

| Option | Description |
| --- | --- |
| `type: number` | Adds a number control. |
| `entity_index` | Numeric entity or Flexible Horseshoe Card input changed by the control. |
| `xpos`, `ypos` | Position of the control in the card. |
| `width`, `height` | Size of the complete control. |
| `orientation` | Places the buttons horizontally or vertically. |
| `show.item_style` | Uses `filled_round`, `filled_square`, `outlined_round`, or `outlined_square`. |
| `content` | Changes the minus and plus symbols, icons, or value presentation. |
| `label` | Optional text positioned beside or above the control. |
| `visibility` | Shows, hides, or disables the control. |

The number range and step belong to the connected entity or Flexible Horseshoe Card input.

## :material-horseshoe: Choose an appearance

=== "Filled and round"

    ```yaml linenums="1"
    show:
      item_variant: stepper
      item_viz: buttons
      item_style: filled_round
    ```

=== "Outlined and round"

    ```yaml linenums="1"
    show:
      item_variant: stepper
      item_viz: buttons
      item_style: outlined_round
    ```

=== "Outlined and square"

    ```yaml linenums="1"
    show:
      item_variant: stepper
      item_viz: buttons
      item_style: outlined_square
    ```

## :material-horseshoe: Use icons for minus and plus

The default buttons show minus and plus as text. Use icons when they fit the card better:

```yaml linenums="1"
content:
  mode: content_horizontal
  content_horizontal:
    minus:
      mode: content_icon
    plus:
      mode: content_icon
```

When icon mode is used, a vertical control uses directional icons appropriate for its orientation.

## :material-horseshoe: Show a label

Place a label beside the control when the value needs a short description:

```yaml linenums="1"
label:
  position: top
  gap: 3
  text: History
  styles:
    font-size: 0.6em
```

## :material-horseshoe: Related

- [Flexible Horseshoe Card input number](fhs-input-number.md)
- [Slider control](slider-tool.md)
- [Home Assistant Input number](https://www.home-assistant.io/integrations/input_number/)
