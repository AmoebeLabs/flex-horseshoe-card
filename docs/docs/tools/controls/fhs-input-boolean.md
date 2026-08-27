---
template: main.html
title: Flexible Horseshoe Card input boolean
description: Add a browser-local on/off setting to a Flexible Horseshoe Card.
tags:
  - Controls
  - Flexible Horseshoe Card inputs
  - Boolean
---

# Flexible Horseshoe Card input boolean

An Flexible Horseshoe Card input boolean adds an on/off setting directly to a Flexible Horseshoe Card. Use it for choices that belong to the card, such as showing labels, displaying a grid, enabling an extra layer, or switching part of the card on and off.

The value is stored in the current browser and does not require a Home Assistant helper. Use a Home Assistant [Input boolean](https://www.home-assistant.io/integrations/input_boolean/) instead when automations, other dashboards, or other devices need the same setting.

## :material-horseshoe: Basic configuration

Add the input to the card's `entities` list. Its entity ID must start with `fhs_input_boolean.`.

```yaml linenums="1"
entities:
  - entity: fhs_input_boolean.show_labels
    initial: true
    scope: card
```

Connect a toggle control to the input:

```yaml linenums="1"
layout:
  controls:
    - id: show-labels
      type: toggle
      entity_index: 0
      xpos: 50
      ypos: 85
      width: 24
      show:
        item_variant: switch
        item_viz: default
        item_style: ha
```

The toggle now changes the value between `on` and `off`.

## :material-horseshoe: Configuration options

| Option | Description |
| --- | --- |
| `entity` | A unique entity ID starting with `fhs_input_boolean.`. |
| `initial` | Initial value: `true` or `false`. |
| `scope: card` | Keeps a separate value for this card. |
| `scope: global` | Shares the value with Flexible Horseshoe Card cards in the current browser. |
| `persist: true` | Restores a global value after the browser reloads. |
| `name` | Name shown by tools that display the entity name. |
| `icon` | Icon shown by tools that display the entity icon. |

See [Entities](../../card-basics/entities.md) for slots and other entity settings.

## :material-horseshoe: Use the value in a card

Flexible Horseshoe Card exposes the value as the state `on` or `off`. A JavaScript template can use that state to change what the card displays.

This example shows a text label only while the input is on:

```yaml linenums="1"
layout:
  texts:
    - id: scale-labels
      entity_index: 0
      text: Scale labels
      xpos: 50
      ypos: 65
      visibility: |
        [[[
          return state === 'on' ? 'visible' : 'hidden';
        ]]]
```

The same pattern can show a complete [group](../../card-basics/groups.md), change a graph option, or select a different visualization.

## :material-horseshoe: List of actions

A toggle control changes the input directly. Buttons and other actionable tools can use these actions:

| Action | Result |
| --- | --- |
| `fhs_input_boolean.toggle` | Changes `on` to `off`, or `off` to `on`. |
| `fhs_input_boolean.turn_on` | Sets the value to `on`. |
| `fhs_input_boolean.turn_off` | Sets the value to `off`. |

```yaml linenums="1"
tap_action:
  action: perform-action
  perform_action: fhs_input_boolean.toggle
  target:
    entity_id: fhs_input_boolean.show_labels
```

## :material-horseshoe: Keep the value after reloading

Use `scope: global` with `persist: true` when the choice should remain active after reloading the dashboard:

```yaml linenums="1"
entities:
  - entity: fhs_input_boolean.compact_view
    initial: false
    scope: global
    persist: true
```

Every Flexible Horseshoe Card card in the current browser that defines `fhs_input_boolean.compact_view` receives the same value. Other browsers and devices keep their own value.

## :material-horseshoe: Related

- [Toggle control](toggle-tool.md)
- [Browser-local inputs](browser-local-inputs.md)
- [Visibility](../../interaction/visibility.md)
- [JavaScript templates](../../dynamic/javascript-templates.md)
