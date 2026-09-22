---
template: main.html
title: Local input select
description: Add a local choice from a list of options to a Flexible Horseshoe Card.
tags:
  - Controls
  - Flexible Horseshoe Card inputs
  - Select
---
# Local input select

A local input select is a local choice from a predefined list. It can let the user choose a room, sensor, chart type, display style, history period, or any other named option that only needs to affect the card locally.

A local input select is not created in Home Assistant. Its entity ID must start with `fhs_input_select.`, which tells the card to create and manage the value locally.

This page shows how to define the options, connect a Select control, use the selected state elsewhere in the card, and optionally keep the selection after a reload.

![Flexible Horseshoe select control example 3](../../assets/screenshots/fhs-select-control-example-3.png)

![Flexible Horseshoe select control example 1](../../assets/screenshots/fhs-select-control-example-1.png)

![Flexible Horseshoe select control example 2](../../assets/screenshots/fhs-select-control-example-2.png)

## :material-horseshoe: Add a list of choices

Use a local input select when the card needs to remember one value from a fixed list without creating a Home Assistant helper.

```yaml linenums="1"
entities:
  - entity: fhs_input_select.chart_type  # Create or use this local input
    options:
      - line
      - area
      - bar
      - dots
    initial: line  # Value used when this local input is created
    scope: card  # Keep this value inside this card
```

Quote words such as `on`, `off`, `yes`, or `no` when they must remain text values in YAML.

## :material-horseshoe: Change it with a Select control

Connect the input to a Select control when the user should change that local choice directly from the card.

```yaml linenums="1"
entities:
  - entity: fhs_input_select.mode_1  # Local selection used by the example
    options: [line, area, bar, dots]
    initial: line

layout:
  controls:
    - id: chart-type  # Name this item so it can be referenced later
      type: select  # Create a select control
      entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 85  # Vertical position; 50 = center of the card
      width: 90  # Width of the complete control
      height: 12  # Height of the complete control
```
Use `option_map` on the Select control when an option needs another label, icon, or richer content.

## :material-horseshoe: Use the selected option in the card

The selected option is the entity state:

```yaml linenums="1"
entities:
  - entity: fhs_input_select.chart_type  # Local choice used by the graph
    options: [line, area, bar, dots]
    initial: line
  - entity: sensor.temperature  # Entity whose history is graphed

layout:
  sparklines:
    - entity_index: 1  # Graph the temperature entity
      xpos: 50
      ypos: 50
      width: 80
      height: 35
      # Use the selected local option as the Sparkline chart type.
      sparkline:
        show:
          chart_type: |
            [[[
              return entities[0].state;
            ]]]
```
## :material-horseshoe: Change the selection from an action

Use `fhs_input_select.select_option` to choose an option from an action.

## :material-horseshoe: Share or persist the selection

Use `scope: global` to share the selection between cards in this Home Assistant client. Add `persist: true` to restore it after reloading.

## :material-horseshoe: Configuration options


`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `entity` | string | Yes | — | Unique ID starting with `fhs_input_select.`. |
| `options` | list | Yes | — | Non-empty list of unique, non-empty text values the user can choose from. |
| `initial` | string | No | First option | Choice used when the input is created; it must be one of `options`. |
| `scope` | `card`, `global` | No | `card` | `card` keeps a separate selection per card; `global` shares it between cards in this Home Assistant client. |
| `persist` | boolean | No | `false` | Restores the selection after a client reload; it can only be enabled with `scope: global`. |
| `name` | string | No | Entity ID suffix | Display name exposed by the local entity. |
| `icon` | string | No | `mdi:form-dropdown` | Icon exposed by the local entity. |
| `tap_action` | action | No | `none` | Default tap action inherited by a layout item that uses this local entity and does not define its own tap action. |

## :material-horseshoe: Related

- [Select control](select-tool.md)
- [Local input entities](browser-local-inputs.md)
- [JavaScript templates](../../dynamic/javascript-templates.md)
