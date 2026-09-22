---
template: main.html
title: Select control
description: Show a visible list of options and let someone select one value.
tags:
  - Controls
  - Select
---
# Select control

A Select control shows several named choices directly in the card and lets the user select one of them. The selected value can belong to a Home Assistant select/input_select or to a local input select.

This page shows how to display the options, give them clearer labels or icons, show richer content inside each option, and optionally perform an action when an option is chosen.

## :material-horseshoe: Add a Select control

Use a Select control when the user should choose one visible option from a fixed list.

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

layout:
  controls:
    - id: chart-type  # Name this item so it can be referenced later
      type: select  # Create a select control
      entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 85  # Vertical position; 50 = center of the card
      width: 90  # Width of the complete control
      height: 12  # Height of the complete control

      show:
        item_variant: segmented  # Use the segmented control variant
        item_viz: viz_button  # Use the viz_button visualization
        item_style: outlined_round  # Use the outlined_round appearance/color mode
```

The options come from the connected Select/Input select/local input select.


## :material-horseshoe: Choose orientation, visualization, and style

A Select has one segmented variant. Use `orientation` to place the options next to each other or above each other, `show.item_viz` to choose how each option is indicated, and `show.item_style` to choose the surface shape.

| Field | Values | Default | Visible effect |
| --- | --- | --- | --- |
| `orientation` | `horizontal`, `vertical` | `horizontal` | `horizontal` places options left-to-right; `vertical` stacks them top-to-bottom. |
| `show.item_variant` | `segmented` | `segmented` | Uses the segmented Select layout. |
| `show.item_viz` | `viz_button`, `viz_line` | `viz_button` | `viz_button` gives every option a button-like surface; `viz_line` uses a line indicator instead. |
| `show.item_style` | `filled_round`, `filled_square`, `outlined_round`, `outlined_square` | `filled_round` | `filled_*` uses filled surfaces, `outlined_*` uses border-only surfaces; `*_round` has rounded corners and `*_square` square corners. |
| `visibility` | `visible`, `hidden`, `unavailable` | `visible` | `visible` shows the control normally, `hidden` hides it, and `unavailable` shows its unavailable appearance. |

```yaml linenums="1"
entities:  # Entities used by this example
  - entity: input_select.mode

layout:
  controls:
    - type: select
      entity_index: 0
      xpos: 50
      ypos: 50
      orientation: vertical
      show:
        item_variant: segmented
        item_viz: viz_line
        item_style: outlined_square
```

## :material-horseshoe: Change the track and separators

The Select has a complete background, an inset track, and optional separators between options. `show.separator: false` hides the separators.

```yaml linenums="1"
entities:
  - entity: input_select.mode  # Select controlled by this example

layout:
  controls:
    - type: select  # Create a Select
      entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal center
      ypos: 50  # Vertical center
      show:
        separator: false  # Hide lines between the options
      background:
        radius: 3  # Corner radius of the complete Select surface
      track:
        padding:
          x: 1  # Horizontal inset inside the complete surface
          y: 1  # Vertical inset inside the complete surface
```

The default background radius is `5`. The default track padding is `0.5` in both directions. Separators are shown by default; their default padding is `1` and their default line is `0.25` wide using `var(--divider-color)`.

## :material-horseshoe: Change option labels or icons

Use `option_map` when the visible option should differ from the stored value:

```yaml linenums="1"
entities:
  - entity: input_select.mode                 # entity_index 0: Select controlled by this example
  - entity: sensor.living_room_temperature   # entity_index 1: Value shown for the temperature option
  - entity: sensor.living_room_humidity      # entity_index 2: Value shown for the humidity option

layout:
  controls:
    - type: select  # Create a select control
      entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal center of the control
      ypos: 50  # Vertical center of the control
      option_map:
        - value: "off"  # Option value written when this choice is selected
          text: "Off"  # Text shown to the user
          icon: mdi:fan-off  # Icon shown to the user
        - value: low  # Option value written when this choice is selected
          text: Low  # Text shown to the user
          icon: mdi:fan-speed-1  # Icon shown to the user
        - value: high  # Option value written when this choice is selected
          text: High  # Text shown to the user
          icon: mdi:fan-speed-3  # Icon shown to the user
```
Without custom text, the label follows Home Assistant localization where available.

## :material-horseshoe: Show entity information inside options

Options can contain a repeated horizontal/vertical content layout. Use `option_map[].entity_index` when every option should show information from another entity, such as an icon and current state.

```yaml linenums="1"
entities:
  - entity: input_select.mode  # entity_index 0: Entity controlled by this example
  - entity: sensor.living_room_temperature  # entity_index 1: Value shown in the temperature option
  - entity: sensor.living_room_humidity  # entity_index 2: Value shown in the humidity option

layout:
  controls:
    - type: select  # Create a select control
      entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal center of the control
      ypos: 50  # Vertical center of the control
      content:
        mode: content_vertical  # Arrange the button content as vertical
        content_vertical:
          gap: 0.5  # Space between these visible parts
          items:
            - id: icon  # Name this item so it can be referenced later
              type: icon
              size: 40
            - id: value  # Name this item so it can be referenced later
              type: state

      option_map:
        - value: temperature  # Option represented by this button
          entity_index: 1  # Show the temperature entity configured above
        - value: humidity  # Option represented by this button
          entity_index: 2  # Show the humidity entity configured above
```
## :material-horseshoe: Run an action with the selected value

Use `option(value)` where an action should receive the selected option:

```yaml linenums="1"
entities:
  - entity: input_select.mode  # Entity controlled by this example

layout:
  controls:
    - type: select  # Create a select control
      entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal center of the control
      ypos: 50  # Vertical center of the control
      tap_action:
        action: perform-action  # Run a Home Assistant action
        perform_action: climate.set_hvac_mode  # Home Assistant action to run
        target:
          entity_id: climate.living_room  # Home Assistant entity affected by the action
        data:
          hvac_mode: option(value)
```
## :material-horseshoe: Use a Home Assistant or local Select

Use Home Assistant Select/Input select when the selection is shared outside the card. Use a [Local input select](fhs-input-select.md) when it only controls the card in this Home Assistant client.

## :material-horseshoe: Configuration options


`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `type: select` | string | Yes | — | Selects the Select control. |
| `entity_index` | entity index | Yes | — | Select entity/input changed by the control. |
| `xpos`, `ypos` | number | Yes | — | Position of the complete Select control on the card. |
| `width` | number | No | `34` | Total width shared by all visible options. |
| `height` | number | No | `11` | Height of the complete Select control. |
| `orientation` | `horizontal`, `vertical` | No | `horizontal` | Places options left-to-right or stacks them top-to-bottom. |
| `option_map` | list | No | Entity options | Changes label, icon, content entity, or action value per option. |
| `content` | mapping | No | Vertical content layout | Defines the content repeated inside every option, such as text, an icon, or an entity state. |
| `background` | mapping | No | Radius `5` | Styles the complete Select surface and sets its corner radius. |
| `track` | mapping | No | Padding `0.5`/`0.5` | Sets the inset and styles of the option track inside the background. |
| `show.separator` | boolean | No | `true` | Shows (`true`) or hides (`false`) separators between options. |
| `separator` | mapping | No | Padding `1`; divider line `0.25` | Sets separator spacing and line styles. |
| `show.item_variant` | `segmented` | No | `segmented` | Uses the segmented Select layout: one visible segment for each option. |
| `show.item_viz` | `viz_button`, `viz_line` | No | `viz_button` | Shows each option as a button-like surface or as a line indicator. |
| `show.item_style` | `filled_round`, `filled_square`, `outlined_round`, `outlined_square` | No | `filled_round` | Chooses filled/outlined surfaces with rounded/square corners. |
| `tap_action` | mapping | No | `select-option` | Normally writes the selected option; override it when choosing an option should run another action. |
| `label` | mapping | No | Not set | Optional label. |
| `visibility` | `visible`, `hidden`, `unavailable` / template | No | `visible` | Shows the control, hides it, or displays its unavailable appearance. |

## :material-horseshoe: Related

- [Local input select](fhs-input-select.md)
- [Actions](../../interaction/actions.md)
- [Home Assistant Input select](https://www.home-assistant.io/integrations/input_select/)
