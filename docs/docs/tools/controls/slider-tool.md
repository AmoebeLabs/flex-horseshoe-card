---
template: main.html
title: Slider control
description: Set one numeric value or a lower and upper range with a linear or circular slider.
tags:
  - Controls
  - Slider
---
# Slider control

A Slider control changes a numeric value by dragging a thumb along a visible range. It can control one value or a lower/upper range and can be drawn as a linear or circular slider.

This page shows how to create both slider forms, display the current value, and control how often updates are sent while the user drags.

## :material-horseshoe: Add a single-value Slider

Use a single Slider when the user should drag one numeric value, such as brightness, volume, or a threshold.

```yaml linenums="1"
entities:
  - entity: fhs_input_number.brightness  # Create or use this local input
    initial: 45  # Value used when this local input is created
    min: 0
    max: 100
    step: 1  # Amount added or removed by each adjustment
    unit: "%"  # Unit shown with the value
    scope: card  # Keep this value inside this card

layout:
  controls:
    - id: brightness  # Name this item so it can be referenced later
      type: slider  # Create a slider control
      entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      width: 70  # Width of the complete control
      height: 12  # Height of the complete control

      value:
        position: top  # Place this element at the top

      show:
        item_variant: single  # Use the single control variant
        item_viz: linear  # Use the linear visualization
        item_style: ha  # Use the ha appearance/color mode
```

## :material-horseshoe: Select a lower and upper value

A range Slider uses two numeric entities/inputs:

```yaml linenums="1"
entities:
  - entity: fhs_input_number.lower  # Numeric value controlled by the Slider
    initial: 20
    min: 0
    max: 100
    step: 1
  - entity: fhs_input_number.upper  # Numeric value controlled by the Slider
    initial: 80
    min: 0
    max: 100
    step: 1

layout:
  controls:
    - id: scale-range  # Name this item so it can be referenced later
      type: slider  # Create a slider control
      values:
        - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
        - entity_index: 1  # Use entity 1 from entities: (0 = first entity)
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      width: 70  # Width of the complete control
      height: 12  # Height of the complete control

      show:
        item_variant: range  # Use the range control variant
        item_viz: linear  # Use the linear visualization
        item_style: ha  # Use the ha appearance/color mode
```
The lower value cannot move above the upper value, and the upper value cannot move below the lower value.

## :material-horseshoe: Use a circular Slider

Use the circular visualization when a compact radial control fits the card better than a straight track.

```yaml linenums="1"
entities:
  - entity: fhs_input_number.lower  # Numeric value controlled by the Slider
    initial: 20
    min: 0
    max: 100
    step: 1

layout:
  controls:
    - id: target-temperature  # Name this item so it can be referenced later
      type: slider  # Create a slider control
      entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      width: 40  # Width of the complete control
      height: 40  # Height of the complete control
      show:
        item_variant: single  # Use the single control variant
        item_viz: circular  # Use the circular visualization
        item_style: ha  # Use the ha appearance/color mode
```
Equal width/height gives the circular Slider its normal round area.

## :material-horseshoe: Show the current value

Show the value when the user needs numeric feedback while or after moving the Slider.

```yaml linenums="1"
entities:
  - entity: input_number.temperature  # Entity controlled by this example

layout:
  controls:
    - type: slider  # Create a slider control
      entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal center of the control
      ypos: 50  # Vertical center of the control
      value:
        position: top  # Place this element at the top
        gap: 3  # Space between these visible parts
```
`value.position` accepts `start`, `end`, `top`, `bottom`, and `center`. `start` places the value to the left of the Slider, `end` to the right, `top` above it, `bottom` below it, and `center` at the Slider center. For a range Slider, `range_spacing` sets the horizontal distance between the two displayed values.

## :material-horseshoe: Reduce updates while dragging

Increase the update interval when writing every tiny pointer movement would create unnecessary service calls or state updates.

```yaml linenums="1"
entities:
  - entity: input_number.temperature  # Entity controlled by this example

layout:
  controls:
    - type: slider  # Create a slider control
      entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal center of the control
      ypos: 50  # Vertical center of the control
      interaction:
        update_interval: 200  # Minimum time between updates while dragging, in milliseconds
```
The final value is still sent when the drag ends.

## :material-horseshoe: Choose the Slider form and visualization

`show.item_variant` accepts `single` and `range`. `single` shows one thumb for one numeric value; `range` shows a lower and upper thumb and therefore uses exactly two entries under `values`.

`show.item_viz` accepts `linear` and `circular`. `linear` draws a straight track; `circular` draws the control around a circle. The current static `show.item_style` value is `ha`. For a linear Slider, `orientation` is `horizontal` or `vertical`.

## :material-horseshoe: Change Slider movement and geometry

`animation.duration` controls how long the thumb/active track takes to move to a new value; the default is `180` ms. `animation.easing` defaults to `ease-in-out`.

For a linear Slider, `linear.track`, `linear.active`, and `linear.thumb` change the track, active part, and thumb. The default track is `8` high with radius `4`; the default thumb is `0.8` wide, `4` high, with a `12`-unit hit area.

For a circular Slider, `circular.start_angle` defaults to `-135`, `circular.arc_degrees` to `270`, `circular.clockwise` to `true`, and `circular.radius` to `12`. `circular.arc_degrees` must be greater than `0` and at most `360`. Its track and active path both default to width `5`.

```yaml linenums="1"
entities:
  - entity: input_number.temperature  # Numeric entity changed by the Slider

layout:
  controls:
    - type: slider  # Create a Slider
      entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal center
      ypos: 50  # Vertical center
      animation:
        duration: 250  # Movement duration in milliseconds
        easing: ease-out  # Movement timing curve
      linear:
        track:
          height: 6  # Thickness of the inactive linear track
          radius: 3  # Corner radius of the linear track
```

## :material-horseshoe: Choose how the Slider writes its value

`set_value_action` defaults to the Slider-only `set-value` shorthand. It sends the active Slider value to the selected numeric entity's set-value action.

```yaml linenums="1"
entities:
  - entity: input_number.temperature  # Numeric entity changed by the Slider

layout:
  controls:
    - type: slider
      entity_index: 0
      xpos: 50
      ypos: 50
      set_value_action:
        action: set-value  # Write the current thumb value to entity_index 0
```

For a custom single-value action, `value_field` names the field that receives the Slider value. For a range action, `value_fields` maps destination fields to `lower` or `upper`; those are the only two range value names.

## :material-horseshoe: Use a Home Assistant or local number

Use Home Assistant Number/Input number for values needed outside the card, or [Local input number](fhs-input-number.md) for a local display/control setting.

## :material-horseshoe: Configuration options

Choose the table for the Slider you are building. A single Slider controls one numeric entity. A range Slider controls exactly two numeric entities and therefore uses `values` instead of a top-level `entity_index`.

### Single-value Slider

| Option | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `type: slider` | string | Yes | — | Selects the Slider control. |
| `entity_index` | entity index | Yes | — | Numeric entity whose value the Slider reads and changes. |
| `xpos` | number | Yes | — | Horizontal position of the Slider center. |
| `ypos` | number | Yes | — | Vertical position of the Slider center. |
| `show.item_variant` | `single` | No | `single` | Shows one thumb for one numeric value. Use the Range Slider form below for `range`. |

### Range Slider

| Option | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `type: slider` | string | Yes | — | Selects the Slider control. |
| `show.item_variant` | `range` | Yes | — | Shows a lower and upper thumb. |
| `values` | list | Yes | — | Exactly two value entries: first the lower value, then the upper value. |
| `values[].entity_index` | entity index | Yes | — | Numeric entity controlled by that thumb. |
| `xpos` | number | Yes | — | Horizontal position of the Slider center. |
| `ypos` | number | Yes | — | Vertical position of the Slider center. |

### Options for both Slider forms

| Option | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `width` | number | No | `40` linear; `30` circular | Width of the complete Slider interaction area. |
| `height` | number | No | `10` linear; `30` circular | Height of the complete Slider interaction area. |
| `orientation` | `horizontal`, `vertical` | No | `horizontal` | Sets a linear Slider to a left/right or vertical track. |
| `show.item_viz` | `linear`, `circular` | No | `linear` | Uses a straight track or circular control. |
| `show.item_style` | `ha` | No | `ha` | Uses the Home Assistant Slider appearance. |
| `scale.min` | number / `{attribute: ...}` | No | `{attribute: min}` | Sets the lowest Slider value directly, or reads it from the named attribute of the primary Slider entity. |
| `scale.max` | number / `{attribute: ...}` | No | `{attribute: max}` | Sets the highest Slider value directly, or reads it from the named attribute of the primary Slider entity. |
| `scale.step` | number / `{attribute: ...}` | No | `{attribute: step}` | Sets the increment between selectable values directly, or reads it from the named entity attribute. |
| `value.show` | boolean | No | `true` | Shows or hides the current value text. |
| `value.position` | `center`, `start`, `end`, `top`, `bottom` | No | `top` linear; `center` circular | Places the displayed value at the center, left/start, right/end, above, or below the Slider. |
| `value.range_spacing` | number | No | `8` | For a range Slider, sets the horizontal space between the lower and upper displayed values. |
| `set_value_action` | mapping | No | `action: set-value` | Controls how the Slider writes its value. The default writes to the bound numeric entity; custom actions can inject the value with `value_field` or `value_fields`. |
| `interaction.update_interval` | number | No | `100` ms | Limits writes while dragging; `0` writes every movement, while larger values reduce update frequency. The final value is always sent when dragging stops. |
| `animation.duration` | number ≥ 0 | No | `180` ms | Sets the visual movement duration after a value change. |
| `animation.easing` | CSS easing | No | `ease-in-out` | Sets the timing curve of Slider movement. |
| `linear` | mapping | No | Default linear geometry | Configures the linear track, active part, and thumb. |
| `circular` | mapping | No | `-135°`, `270°`, clockwise, radius `12` | Configures circular start angle, arc size, direction, radius, track, active path, and thumb. |
| `label` | mapping | No | Not set | Adds a label. `label.position` accepts `start`, `end`, `top`, or `bottom`. |
| `visibility` | `visible`, `hidden`, `unavailable` / template | No | `visible` | Shows the Slider normally, hides it, or displays its unavailable appearance. |

## :material-horseshoe: Related

- [Local input number](fhs-input-number.md)
- [Number control](number-tool.md)
- [Home Assistant Input number](https://www.home-assistant.io/integrations/input_number/)
