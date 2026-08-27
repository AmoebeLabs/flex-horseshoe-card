---
template: main.html
title: Toggle control
description: Display and change an on/off entity with a configurable switch.
tags:
  - Controls
  - Toggle
---

# Toggle control

A toggle gives the user a switch for changing an entity between on and off. Use it for lights, switches, Home Assistant [Input booleans](https://www.home-assistant.io/integrations/input_boolean/), and other entities that support a toggle action.

Use an [Flexible Horseshoe Card input boolean](fhs-input-boolean.md) when the switch controls something inside Flexible Horseshoe Card itself, such as labels, a grid, an extra layer, or another display option in the current browser.

<!-- Add Home Assistant, iOS, and industrial toggle screenshots here. -->

## :material-horseshoe: Basic configuration

This example controls a Home Assistant input boolean:

```yaml linenums="1"
entities:
  - entity: input_boolean.guest_mode

layout:
  controls:
    - id: guest-mode
      type: toggle
      entity_index: 0
      xpos: 50
      ypos: 50
      width: 24

      show:
        item_variant: switch
        item_viz: default
        item_style: ha
```

Selecting the toggle changes the connected entity between `on` and `off`.

!!! info "Entity settings"

    `entity_index: 0` connects the toggle to the first entry in `entities`. See [Entities](../../card-basics/entities.md) for entity indexes and optional slots. For a browser-local on/off value, see [Flexible Horseshoe Card input boolean](fhs-input-boolean.md).

## :material-horseshoe: Configuration options

| Option | Description |
| --- | --- |
| `type: toggle` | Adds a toggle control. |
| `entity_index` | On/off entity or Flexible Horseshoe Card input changed by the toggle. |
| `xpos`, `ypos` | Position of the toggle in the card. |
| `width` | Width of the toggle. Its height follows the selected style. |
| `orientation` | Displays the toggle horizontally or vertically. |
| `show.item_style` | Uses the `ha`, `ios`, or `industrial` appearance. |
| `content` | Optionally shows an icon inside the moving thumb. |
| `label` | Optional text positioned beside or above the toggle. |
| `visibility` | Shows, hides, or disables the toggle. |

## :material-horseshoe: Choose a style

The styles change the appearance while keeping the same on/off behavior.

=== "Home Assistant"

    ```yaml linenums="1"
    show:
      item_variant: switch
      item_viz: default
      item_style: ha
    ```

=== "iOS"

    ```yaml linenums="1"
    show:
      item_variant: switch
      item_viz: default
      item_style: ios
    ```

=== "Industrial"

    ```yaml linenums="1"
    show:
      item_variant: switch
      item_viz: default
      item_style: industrial
    ```

## :material-horseshoe: Show an icon

A toggle can show an icon inside its moving thumb. The icon follows the on and off states of the selected style:

```yaml linenums="1"
content:
  mode: content_icon
  content_icon:
    icon:
      icon: mdi:check
```

Omit `content` for a toggle without an icon.

## :material-horseshoe: Use a vertical toggle

Set `orientation: vertical` when the switch should move from bottom to top:

```yaml linenums="1"
- id: guest-mode-vertical
  type: toggle
  entity_index: 0
  orientation: vertical
  xpos: 50
  ypos: 50
  width: 24
  show:
    item_variant: switch
    item_viz: default
    item_style: ha
```

## :material-horseshoe: Use a browser-local setting

This toggle changes an Flexible Horseshoe Card display setting without creating a Home Assistant helper:

```yaml linenums="1"
entities:
  - entity: fhs_input_boolean.show_labels
    initial: true
    scope: card

layout:
  controls:
    - id: show-labels
      type: toggle
      entity_index: 0
      xpos: 50
      ypos: 85
      width: 24
```

See [Flexible Horseshoe Card input boolean](fhs-input-boolean.md) for using the `on` and `off` state elsewhere in the card.

## :material-horseshoe: Related

- [Flexible Horseshoe Card input boolean](fhs-input-boolean.md)
- [Home Assistant Input boolean](https://www.home-assistant.io/integrations/input_boolean/)
- [Visibility](../../interaction/visibility.md)
