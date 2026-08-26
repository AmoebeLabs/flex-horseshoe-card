---
template: main.html
title: Toggle control
description: Display and change an on/off entity with a configurable switch.
tags:
  - Controls
  - Toggle
---

# Toggle control

Use a toggle for lights, switches, input booleans, and other entities with an on/off state.

<!-- Add HA, iOS, and industrial toggle examples here. -->

## :material-horseshoe: Basic toggle

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

Selecting the control changes the connected entity.

## :material-horseshoe: Choose a style

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

A toggle can show an icon inside its moving indicator:

```yaml linenums="1"
content:
  mode: content_icon
  content_icon:
    icon:
      icon: mdi:check
```

## :material-horseshoe: Browser-local toggle

Use `fhs_input_boolean` when the state only controls the appearance or behavior of FHS cards in this browser.

See [FHS input boolean](fhs-input-boolean.md).

## :material-horseshoe: Related

- [Browser-local inputs](browser-local-inputs.md)
- [Actions](../../interaction/actions.md)
- [Visibility](../../interaction/visibility.md)
