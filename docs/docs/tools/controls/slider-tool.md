---
template: main.html
title: Slider control
description: Set one numeric value or a lower and upper range with a linear or circular slider.
tags:
  - Controls
  - Slider
---

# Slider control

Use a slider for values that are easier to choose visually than with repeated minus and plus actions.

<!-- Add linear, circular, single, and range slider examples here. -->

## :material-horseshoe: Single value

```yaml linenums="1"
entities:
  - entity: fhs_input_number.brightness
    initial: 45
    min: 0
    max: 100
    step: 1

layout:
  controls:
    - id: brightness
      type: slider
      entity_index: 0
      xpos: 50
      ypos: 50
      width: 70
      height: 12

      value:
        position: top

      show:
        item_variant: single
        item_viz: linear
        item_style: ha
```

## :material-horseshoe: Lower and upper values

A range slider connects two numeric entities:

```yaml linenums="1"
- id: comfort-range
  type: slider
  values:
    - entity_index: lower[0]
    - entity_index: upper[0]
  xpos: 50
  ypos: 50
  width: 70
  height: 12

  value:
    position: top
    range_spacing: 10

  show:
    item_variant: range
    item_viz: linear
    item_style: ha
```

## :material-horseshoe: Circular slider

Change `item_viz` to `circular` and give the control equal width and height:

```yaml linenums="1"
show:
  item_variant: single
  item_viz: circular
  item_style: ha
```

## :material-horseshoe: Value updates

Use `interaction.update_interval` to choose how often dragging sends an updated value:

```yaml linenums="1"
interaction:
  update_interval: 100
```

## :material-horseshoe: Related

- [FHS input number](fhs-input-number.md)
- [Number](number-tool.md)
- [Actions](../../interaction/actions.md)
