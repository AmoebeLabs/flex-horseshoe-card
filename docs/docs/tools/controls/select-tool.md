---
template: main.html
title: Select control
description: Show a visible list of options and let someone select one value.
tags:
  - Controls
  - Select
---

# Select control

A select control shows a list of options directly inside the card and lets the user choose one. Use it for a room, sensor, operating mode, history period, chart type, or another named choice.

Connect it to a Home Assistant [Select](https://www.home-assistant.io/integrations/select/) or [Input select](https://www.home-assistant.io/integrations/input_select/) when the selected value is used elsewhere in Home Assistant. Use an [FHS input select](fhs-input-select.md) for a choice that only changes FHS cards in the current browser.

<!-- Add horizontal and vertical select control screenshots here. -->

## :material-horseshoe: Basic configuration

This example lets the user choose a sparkline chart type:

```yaml linenums="1"
entities:
  - entity: fhs_input_select.chart_type
    options:
      - line
      - area
      - bar
      - dots
    initial: line
    scope: card

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

The control displays the options supplied by the connected entity. An `option_map` is only needed when the visible label, icon, content, or action value should be different.

!!! info "Entity and input settings"

    `entity_index: 0` connects the control to the first entry in `entities`. The `options`, `initial`, and `scope` settings configure the FHS input, not the Select control. See [FHS input select](fhs-input-select.md) for all input settings and [Entities](../../card-basics/entities.md) for entity indexes and optional slots.

## :material-horseshoe: Configuration options

| Option | Description |
| --- | --- |
| `type: select` | Adds a select control. |
| `entity_index` | Select entity or FHS input changed by the control. |
| `xpos`, `ypos` | Position of the control in the card. |
| `width`, `height` | Size available to all options together. |
| `orientation` | Arranges the options horizontally or vertically. |
| `option_map` | Changes the label, icon, content entity, or action value for individual options. |
| `content` | Content arrangement repeated inside every option. |
| `show.item_viz` | Shows complete option buttons with `viz_button` or an indicator with `viz_line`. |
| `show.item_style` | Uses `filled_round`, `filled_square`, `outlined_round`, or `outlined_square`. |
| `tap_action` | Optional action performed when an option is selected. |
| `label` | Optional text positioned beside or above the select. |
| `visibility` | Shows, hides, or disables the select. |

## :material-horseshoe: Change labels and icons

Use `option_map` when an option should have a clearer label or a recognizable icon:

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

The `value` is written to the connected entity. The `text` and `icon` determine what the user sees.

## :material-horseshoe: Show entity information in every option

Every option can display the same horizontal or vertical content arrangement. This example shows an icon, current value, and compact status line for each sensor:

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

Each `entity_index` supplies the icon, value, and status shown inside that option. Selecting an option still changes the select entity connected to the complete control.

## :material-horseshoe: Perform an action with the selected option

A select can pass the selected value to a Home Assistant action. This example changes an HVAC mode:

```yaml linenums="1"
tap_action:
  action: perform-action
  perform_action: climate.set_hvac_mode
  target:
    entity_id: climate.living_room
  data:
    hvac_mode: option(value)
```

`option(value)` inserts the value from the selected option.

## :material-horseshoe: Related

- [FHS input select](fhs-input-select.md)
- [Home Assistant Input select](https://www.home-assistant.io/integrations/input_select/)
- [Actions](../../interaction/actions.md)
