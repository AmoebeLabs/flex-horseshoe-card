---
template: main.html
title: Number control
description: Increase or decrease a numeric entity in fixed steps.
tags:
  - Controls
  - Number
---
# Number control

A Number control changes a numeric entity or local input in fixed steps with minus and plus buttons. It is useful when exact step-by-step changes are clearer than dragging a slider.

This page shows how to connect a numeric value, choose the control appearance and orientation, replace the symbols with icons, and add a label.

## :material-horseshoe: Add a Number control

Use a Number control when a numeric value is best changed in exact steps rather than by dragging.

```yaml linenums="1"
entities:
  - entity: fhs_input_number.history_days  # Create or use this local input
    initial: 1  # Value used when this local input is created
    min: 1
    max: 14
    step: 1  # Amount added or removed by each adjustment
    unit: d  # Unit shown with the value
    scope: card  # Keep this value inside this card

layout:
  controls:
    - id: history-days  # Name this item so it can be referenced later
      type: number  # Create a number control
      entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      width: 42  # Width of the complete control
      height: 12  # Height of the complete control

      show:
        item_variant: stepper  # Use the stepper control variant
        item_viz: buttons  # Use the buttons visualization
        item_style: outlined_round  # Use the outlined_round appearance/color mode
```

The range and step come from the connected numeric entity/input.

## :material-horseshoe: Change the appearance

`show.item_style` accepts four button appearances:

- `filled_round` — filled buttons with rounded corners.
- `filled_square` — filled buttons with square corners.
- `outlined_round` — border-only buttons with rounded corners.
- `outlined_square` — border-only buttons with square corners.

The Number control uses `show.item_variant: stepper` and `show.item_viz: buttons`.


```yaml linenums="1"
entities:
  - entity: input_number.temperature  # Entity controlled by this example

layout:
  controls:
    - type: number  # Create a number control
      entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal center of the control
      ypos: 50  # Vertical center of the control
      show:
        item_variant: stepper  # Use the stepper control variant
        item_viz: buttons  # Use the buttons visualization
        item_style: filled_round  # Use the filled_round appearance/color mode
```
## :material-horseshoe: Change spacing and press feedback

`padding` controls the inset inside the complete Number control and `gap` controls the space between the decrease button, value, and increase button. The defaults are `0.5` for both padding directions and `0.5` for the gap.

The complete control background defaults to radius `2` with a transparent fill. Button presses briefly scale the pressed button to `0.9`; the default press animation lasts `140` ms with `ease-out`.

```yaml linenums="1"
entities:
  - entity: input_number.example  # Number changed by this control

layout:
  controls:
    - type: number  # Create a Number control
      entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal center
      ypos: 50  # Vertical center
      padding:
        x: 1  # Horizontal inset
        y: 1  # Vertical inset
      gap: 1  # Space between minus, value, and plus
      animation:
        press:
          scale: 0.95  # Scale reached while a button is pressed
          duration: 180  # Press animation duration in milliseconds
          easing: ease-out  # Press animation timing curve
```

## :material-horseshoe: Use icons instead of minus and plus text

Icons can make the decrease/increase buttons more compact while keeping the same step behavior.

```yaml linenums="1"
entities:
  - entity: input_number.temperature  # Entity controlled by this example

layout:
  controls:
    - type: number  # Create a number control
      entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal center of the control
      ypos: 50  # Vertical center of the control
      content:
        mode: content_horizontal  # Arrange the button content as horizontal
        content_horizontal:
          minus:
            mode: content_icon  # Arrange the button content as icon
          plus:
            mode: content_icon  # Arrange the button content as icon
```
A vertical control uses icons suited to its direction.

## :material-horseshoe: Add a label

Add a label when the value alone does not make the purpose of the Number control obvious.

```yaml linenums="1"
entities:
  - entity: input_number.temperature  # Entity controlled by this example

layout:
  controls:
    - type: number  # Create a number control
      entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal center of the control
      ypos: 50  # Vertical center of the control
      label:
        position: top  # Place this element at the top
        gap: 3  # Space between these visible parts
        text: History  # Text shown to the user
        styles:
          font-size: 0.6em  # Size of the displayed text
```
## :material-horseshoe: Use a Home Assistant or local number

Use a Home Assistant Number/Input number when the value must exist outside the card. Use a [Local input number](fhs-input-number.md) when the value only controls the card locally.

## :material-horseshoe: Configuration options


`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `type: number` | string | Yes | — | Selects the Number control. |
| `entity_index` | entity index | Yes | — | Numeric entity/input changed by the control. |
| `xpos`, `ypos` | number | Yes | — | Position of the complete Number control on the card. |
| `width` | number | No | `30` | Width available for the minus button, current value, and plus button together. |
| `height` | number | No | `10` | Height of the complete Number control. |
| `orientation` | `horizontal`, `vertical` | No | `horizontal` | `horizontal` places decrease/value/increase left-to-right; `vertical` stacks them bottom/value/top with matching directional icons. |
| `show.item_variant` | `stepper` | No | `stepper` | Uses the minus/value/plus stepper form. |
| `show.item_viz` | `buttons` | No | `buttons` | Uses separate decrease and increase button areas around the value. |
| `show.item_style` | `filled_round`, `filled_square`, `outlined_round`, `outlined_square` | No | `filled_square` | Chooses filled/outlined buttons with rounded/square corners. |
| `content` | mapping | No | Horizontal − / value / + layout | Minus/plus symbols/icons and value presentation. |
| `padding` | mapping | No | `x: 0.5`, `y: 0.5` | Insets the content from the outer Number-control bounds. |
| `gap` | number | No | `0.5` | Space between the decrease button, value, and increase button. |
| `background` | mapping | No | Radius `2`, transparent fill | Styles the complete Number-control background. |
| `animation.press` | mapping | No | Scale `0.9`, `140` ms, `ease-out` | Sets the scale, duration, and easing of the button press feedback. |
| `label` | mapping | No | Not set | Optional label. `label.position` accepts `start`, `end`, `top`, or `bottom`. |
| `visibility` | `visible`, `hidden`, `unavailable` / template | No | `visible` | Shows the control normally, hides it, or displays its unavailable appearance. |

## :material-horseshoe: Related

- [Local input number](fhs-input-number.md)
- [Slider](slider-tool.md)
- [Home Assistant Input number](https://www.home-assistant.io/integrations/input_number/)
