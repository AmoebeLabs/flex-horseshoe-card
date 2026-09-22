---
template: main.html
title: Local input boolean
description: Add a local on/off setting to a Flexible Horseshoe Card.
tags:
  - Controls
  - Flexible Horseshoe Card inputs
  - Boolean
---
# Local input boolean

A local input boolean is a local on/off value that can be used by the card like an entity state. It is useful for choices that only affect the card, such as showing labels, enabling a grid, or revealing an extra layer, without creating a Home Assistant helper.

A local input boolean is not created in Home Assistant. Its entity ID must start with `fhs_input_boolean.`, which tells the card to create and manage the value locally.

This page shows how to define the boolean, control it, use its `on`/`off` state elsewhere in the card, and optionally keep the value after a reload.

## :material-horseshoe: Add an on/off value

Use a local boolean when the card needs to remember a local true/false choice without a Home Assistant helper.

```yaml linenums="1"
entities:
  - entity: fhs_input_boolean.show_labels  # Create or use this local input
    initial: true  # Value used when this local input is created
    scope: card  # Keep this value inside this card
```

The state is exposed as `on` or `off`.

## :material-horseshoe: Change it with a Toggle

A Toggle is the direct visual control for changing a local boolean between on and off.

```yaml linenums="1"
entities:
  - entity: fhs_input_boolean.option_1  # Local on/off value used by the example
    initial: false

layout:
  controls:
    - id: show-labels  # Name this item so it can be referenced later
      type: toggle  # Create a toggle control
      entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 85  # Vertical position; 50 = center of the card
      width: 24  # Width of the complete control
```
## :material-horseshoe: Use the value in the card

This example only shows a Text item while the input is on:

```yaml linenums="1"
entities:
  - entity: fhs_input_boolean.option_1  # Local on/off value used by the example
    initial: false

layout:
  texts:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      text: Scale labels  # Text shown to the user
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 65  # Vertical position; 50 = center of the card
      visibility: |
        [[[
          return state === 'on' ? 'visible' : 'hidden';
        ]]]
```
## :material-horseshoe: Change the value from an action

Available actions:

| Action | Result |
| --- | --- |
| `fhs_input_boolean.toggle` | Toggles on/off |
| `fhs_input_boolean.turn_on` | Sets on |
| `fhs_input_boolean.turn_off` | Sets off |

## :material-horseshoe: Share or persist the value

Use `scope: global` to share the value with other cards in this Home Assistant client. Add `persist: true` to restore a global value after reloading.

## :material-horseshoe: Configuration options


`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `entity` | string | Yes | — | Unique ID starting with `fhs_input_boolean.`. |
| `initial` | boolean | No | `false` / `off` | Value used when the local input is first created; omit it to start in the off state. |
| `scope` | `card`, `global` | No | `card` | `card` keeps a separate value per card; `global` shares the value between cards in this Home Assistant client. |
| `persist` | boolean | No | `false` | Restores the value after a client reload; it can only be enabled with `scope: global`. |
| `name` | string | No | Entity ID suffix | Display name exposed by the local entity. |
| `icon` | string | No | `mdi:toggle-switch` | Icon exposed by the local entity. |
| `tap_action` | action | No | `none` | Default tap action inherited by a layout item that uses this local entity and does not define its own tap action. |

## :material-horseshoe: Related

- [Toggle](toggle-tool.md)
- [Local input entities](browser-local-inputs.md)
- [Visibility](../../interaction/visibility.md)
- [JavaScript templates](../../dynamic/javascript-templates.md)
