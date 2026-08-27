---
template: main.html
title: Slider control
description: Set one numeric value or a lower and upper range with a linear or circular slider.
tags:
  - Controls
  - Slider
---

# Slider control

A slider lets the user choose a numeric value by dragging a thumb along a visible range. Use it when position within the range is more useful than repeatedly pressing minus and plus, such as for brightness, volume, temperature, scale limits, or history duration.

Connect a single slider to a Home Assistant [Number](https://www.home-assistant.io/integrations/number/), [Input number](https://www.home-assistant.io/integrations/input_number/), or an [Flexible Horseshoe Card input number](fhs-input-number.md). A range slider connects two numeric entities and lets the user choose both a lower and an upper value.

<!-- Add linear, circular, single-value, and range slider screenshots here. -->

## :material-horseshoe: Basic configuration

This example creates a linear brightness slider:

```yaml linenums="1"
entities:
  - entity: fhs_input_number.brightness
    initial: 45
    min: 0
    max: 100
    step: 1
    unit: "%"
    scope: card

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

The slider uses the minimum, maximum, step, value, and unit from the connected entity.

!!! info "Entity and input settings"

    `entity_index: 0` connects the slider to the first entry in `entities`. The `initial`, `min`, `max`, `step`, `unit`, and `scope` settings configure the Flexible Horseshoe Card input, not the Slider control. See [Flexible Horseshoe Card input number](fhs-input-number.md) for all input settings and [Entities](../../card-basics/entities.md) for entity indexes and optional slots.

## :material-horseshoe: Configuration options

| Option | Description |
| --- | --- |
| `type: slider` | Adds a slider control. |
| `entity_index` | Numeric entity used by a single-value slider. |
| `values` | Two numeric entities used as the lower and upper values of a range slider. |
| `xpos`, `ypos` | Position of the slider in the card. |
| `width`, `height` | Size of the slider track and interaction area. |
| `show.item_variant` | Selects a `single` value or a `range` with two values. |
| `show.item_viz` | Displays a `linear` or `circular` slider. |
| `value` | Shows and positions the current value beside the slider. |
| `interaction.update_interval` | Controls how often a value is sent while the user drags. |
| `label` | Optional text positioned beside or above the slider. |
| `visibility` | Shows, hides, or disables the slider. |

The value range and step belong to the connected entity or Flexible Horseshoe Card input.

## :material-horseshoe: Select a lower and upper value

A range slider connects exactly two numeric entities:

```yaml linenums="1"
entities:
  - entity: fhs_input_number.scale_min
    initial: -10
    min: -20
    max: 50
    step: 1
  - entity: fhs_input_number.scale_max
    initial: 40
    min: -20
    max: 50
    step: 1

layout:
  controls:
    - id: scale-range
      type: slider
      values:
        - entity_index: 0
        - entity_index: 1
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

The lower value cannot move above the upper value, and the upper value cannot move below the lower value.

## :material-horseshoe: Use a circular slider

A circular slider is useful when it fits the visual language of a gauge or horseshoe card. Give it equal width and height:

```yaml linenums="1"
- id: target-temperature
  type: slider
  entity_index: 0
  xpos: 50
  ypos: 50
  width: 40
  height: 40
  show:
    item_variant: single
    item_viz: circular
    item_style: ha
```

## :material-horseshoe: Show the current value

Use `value.position` to place the value at `start`, `end`, `top`, `bottom`, or `center`:

```yaml linenums="1"
value:
  position: top
  gap: 3
```

For a range slider, `range_spacing` controls the distance between the two displayed values.

## :material-horseshoe: Control updates while dragging

The slider sends updates while the user drags. Increase `interaction.update_interval` when the target should receive fewer updates:

```yaml linenums="1"
interaction:
  update_interval: 200
```

The value is always sent when the drag ends.

## :material-horseshoe: Related

- [Flexible Horseshoe Card input number](fhs-input-number.md)
- [Number control](number-tool.md)
- [Home Assistant Input number](https://www.home-assistant.io/integrations/input_number/)
