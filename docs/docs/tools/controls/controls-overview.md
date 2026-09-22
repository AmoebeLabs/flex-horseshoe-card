---
template: main.html
title: Interactive controls
description: Add buttons, toggles, selectors, number steppers, and sliders to a Flexible Horseshoe Card.
tags:
  - Controls
  - Actions
---
# Interactive controls

Interactive controls let the user change something directly from a card. A Button performs an action, while a Toggle or Select changes a choice. Number and Slider controls change numeric values.

This page introduces the available controls and explains when to use a Home Assistant entity or a local input.

## :material-horseshoe: Choose a control

Choose the control by the interaction the user needs: switch a value, select an option, adjust a number, drag a range, or run an action.

| You want to... | Control |
| --- | --- |
| Run an action, open details, navigate, or open a URL | [Button](button-tool.md) |
| Turn something on or off | [Toggle](toggle-tool.md) |
| Choose one option from a list | [Select](select-tool.md) |
| Increase or decrease a number in steps | [Number](number-tool.md) |
| Drag to a value or numeric range | [Slider](slider-tool.md) |

## :material-horseshoe: Add a control

Controls live under `layout.controls`:

```yaml linenums="1"
entities:
  - entity: light.living_room  # Home Assistant entity used by this card

layout:
  controls:
    - type: toggle  # Create a toggle control
      entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      width: 24  # Width of the complete control
```

Each control page shows the settings that belong to that control.

## :material-horseshoe: Choose the control type

Set `type` to one of these values:

| `type` | What the user sees |
| --- | --- |
| `toggle` | An on/off switch. |
| `select` | A visible set of selectable options. |
| `number` | Minus/value/plus step buttons. |
| `button` | A pressable action button. |
| `slider` | A draggable numeric value or range. |

Controls that show a label use `label.position: start`, `end`, `top`, or `bottom` to place the label around the control.

## :material-horseshoe: Choose where the value lives

A control can use:

- a Home Assistant entity when the value or action should be available outside this card;
- a [Local input](browser-local-inputs.md) when the value only controls the card locally.

For example, use a Home Assistant `input_boolean` for a mode that automations use, and an `fhs_input_boolean` for a display choice such as showing labels.

## :material-horseshoe: Show, hide, or disable a control

Controls support visibility/disabled behavior. Use it when a control should only be available in a particular state. See [Visibility](../../interaction/visibility.md).

## :material-horseshoe: Run actions

Buttons and supported controls use the same action system as other items. See [Actions](../../interaction/actions.md).

## :material-horseshoe: Related

- [Local input entities](browser-local-inputs.md)
- [Actions](../../interaction/actions.md)
- [Visibility](../../interaction/visibility.md)
