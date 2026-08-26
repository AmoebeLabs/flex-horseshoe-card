---
template: main.html
title: Select control
description: Show a visible list of options and let someone select one value.
tags:
  - Controls
  - Select
---

# Select control

Use a select to choose a mode, room, sensor, time period, chart type, or another named option.

<!-- Add horizontal and vertical select examples here. -->

## :material-horseshoe: Basic select

```yaml linenums="1"
entities:
  - entity: fhs_input_select.chart_type
    options:
      - line
      - area
      - bar
      - dots
    initial: line

layout:
  controls:
    - id: chart-type
      type: select
      entity_index: 0
      xpos: 50
      ypos: 85
      width: 90
      height: 12

      show:
        item_variant: segmented
        item_viz: viz_button
        item_style: outlined_round
```

When `option_map` is omitted, the select uses the options supplied by the connected entity. This works with `fhs_input_select`, Home Assistant Dropdown helpers, and Select entities.

## :material-horseshoe: Labels and icons

Use `option_map` when an option needs a different label or icon:

```yaml linenums="1"
option_map:
  - value: "off"
    text: "Off"
    icon: mdi:fan-off
  - value: low
    text: Low
    icon: mdi:fan-speed-1
  - value: medium
    text: Medium
    icon: mdi:fan-speed-2
  - value: high
    text: High
    icon: mdi:fan-speed-3
```

The `value` is the option selected on the entity. `text` and `icon` control what the segment shows.

## :material-horseshoe: Select content

Every segment can show the same content arrangement. Use an `items` list for rich content:

```yaml linenums="1"
content:
  mode: content_vertical
  content_vertical:
    padding:
      x: 0.5
      y:
        top: 1
        bottom: 1
    gap: 0.5
    items:
      - id: icon
        type: icon
        size: 40
      - id: value
        type: state
        styles:
          font-size: 0.55em
      - id: status
        type: line
        length: 4

option_map:
  - value: score
    entity_index: room_sensors[0]
  - value: temperature
    entity_index: room_sensors[1]
  - value: humidity
    entity_index: room_sensors[2]
```

Each option can select the entity shown inside its segment. This keeps icons, values, and status indicators aligned while the select still changes one chosen value.

## :material-horseshoe: Select another entity

Use `option(value)` when each segment should supply a value to a Home Assistant action:

```yaml linenums="1"
tap_action:
  action: perform-action
  perform_action: climate.set_hvac_mode
  target:
    entity_id: climate.living_room
  data:
    hvac_mode: option(value)
```

## :material-horseshoe: Related

- [FHS input select](fhs-input-select.md)
- [Button content](button-tool.md#button-content)
- [Actions](../../interaction/actions.md)
