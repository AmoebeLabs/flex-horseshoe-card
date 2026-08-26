---
template: main.html
title: Number control
description: Increase or decrease a numeric entity in fixed steps.
tags:
  - Controls
  - Number
---

# Number control

Use a number control when someone should change a value with minus and plus buttons.

<!-- Add filled and outlined number controls here. -->

## :material-horseshoe: Basic number stepper

```yaml linenums="1"
entities:
  - entity: fhs_input_number.history_days
    initial: 1
    min: 1
    max: 14
    step: 1
    unit: d

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

The control uses the entity minimum, maximum, step, value, and unit.

## :material-horseshoe: Choose an appearance

Use one of these `item_style` values:

- `filled_round`
- `filled_square`
- `outlined_round`
- `outlined_square`

The outlined styles keep the background quiet while preserving a clear control boundary.

## :material-horseshoe: Use icons for minus and plus

```yaml linenums="1"
content:
  mode: content_horizontal
  content_horizontal:
    minus:
      mode: content_icon
    plus:
      mode: content_icon
```

## :material-horseshoe: Related

- [FHS input number](fhs-input-number.md)
- [Slider](slider-tool.md)
- [Styling](../../appearance/styling.md)
