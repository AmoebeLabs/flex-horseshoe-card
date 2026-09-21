---
template: main.html
title: Toggle control
description: Display and change an on/off entity with a configurable switch.
tags:
  - Controls
  - Toggle
---
# Toggle control

A Toggle control switches an on/off entity or local input directly from the card. The behavior stays the same while the switch can use different visual styles, orientations, and optional thumb icons.

This page shows how to connect the on/off value, choose the switch appearance, make it vertical, and use it with a local boolean.

## :material-horseshoe: Add a Toggle

A Toggle gives an on/off entity or input a direct switch on the card.

```yaml linenums="1"
entities:
  - entity: input_boolean.guest_mode  # Home Assistant entity used by this card

layout:
  controls:
    - id: guest-mode  # Name this item so it can be referenced later
      type: toggle  # Create a toggle control
      entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      width: 24  # Width of the complete control

      show:
        item_variant: switch  # Use the switch control variant
        item_viz: default  # Use the default visualization
        item_style: ha  # Use the ha appearance/color mode
```

Selecting the Toggle changes the connected entity between `on` and `off`.

## :material-horseshoe: Choose the switch appearance

`show.item_style` changes the visible switch design without changing its on/off behavior:

- `ha` — Home Assistant-style switch.
- `ios` — iOS-style switch.
- `industrial` — industrial switch appearance.

The other Toggle selectors have one static value each: `show.item_variant: switch` selects the switch form and `show.item_viz: default` selects its normal switch visualization.

The behavior stays the same; only the visible switch changes.

## :material-horseshoe: Show an icon in the thumb

Add a thumb icon when the switch state or purpose is easier to recognize visually than from the switch shape alone.

```yaml linenums="1"
entities:
  - entity: input_boolean.example  # Entity controlled by this example

layout:
  controls:
    - type: toggle  # Create a toggle control
      entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal center of the control
      ypos: 50  # Vertical center of the control
      width: 24  # Required width of the complete Toggle
      content:
        mode: content_icon  # Show an icon inside the moving thumb
        content_icon:
          icon:
            icon: mdi:check  # Icon shown to the user
```
Omit `content` when no thumb icon is needed.

## :material-horseshoe: Change the switch transition

The thumb movement and color transition use `animation.duration` and `animation.easing`. The defaults are `250` milliseconds and `ease-out`.

```yaml linenums="1"
entities:
  - entity: input_boolean.example  # Entity controlled by this example

layout:
  controls:
    - type: toggle  # Create a Toggle
      entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal center
      ypos: 50  # Vertical center
      width: 24  # Required Toggle width
      animation:
        duration: 400  # Transition time in milliseconds
        easing: ease-in-out  # CSS easing used by the transition
```

## :material-horseshoe: Use a vertical Toggle

Use a vertical Toggle when the available card space or layout works better with movement from bottom to top.

```yaml linenums="1"
entities:
  - entity: input_boolean.example  # Entity controlled by this example

layout:
  controls:
    - type: toggle  # Create a toggle control
      entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal center of the control
      ypos: 50  # Vertical center of the control
      width: 24  # Required width of the complete Toggle
      orientation: vertical  # Arrange it from bottom to top
```
The switch then moves vertically instead of horizontally.

## :material-horseshoe: Use a local on/off setting

Use a local boolean when the on/off choice only controls this card/browser and does not need to exist as a Home Assistant helper.

```yaml linenums="1"
entities:
  - entity: fhs_input_boolean.show_labels  # Create or use this local input
    initial: true  # Value used when this local input is created
    scope: card  # Keep this value inside this card
```

Connect the Toggle to that input exactly as you would connect it to a Home Assistant entity. See [Local input boolean](fhs-input-boolean.md).

## :material-horseshoe: Configuration options


`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `type: toggle` | string | Yes | — | Selects the Toggle control. |
| `entity_index` | entity index | Yes | — | On/off entity/input changed by the Toggle. |
| `xpos`, `ypos` | number | Yes | — | Position of the Toggle center on the card. |
| `width` | number | Yes | — | Width of the complete Toggle. The selected style determines its proportional height. |
| `orientation` | `horizontal`, `vertical` | No | `horizontal` | `horizontal` moves the thumb left/right; `vertical` moves it down/up. |
| `show.item_variant` | `switch` | No | `switch` | Uses the switch form. |
| `show.item_viz` | `default` | No | `default` | Uses the normal Toggle visualization. |
| `show.item_style` | `ha`, `ios`, `industrial` | No | `ha` | `ha` uses the Home Assistant-style switch, `ios` the iOS-style switch, and `industrial` the square industrial appearance. |
| `content` | mapping | No | No content | Adds an icon or other supported content inside the moving thumb. |
| `animation.duration` | number | No | `250` ms | Sets how long the thumb/color transition takes. |
| `animation.easing` | CSS easing | No | `ease-out` | Sets the timing curve used by the Toggle transition. |
| `label` | mapping | No | Not set | Optional label. |
| `visibility` | `visible`, `hidden`, `unavailable` / template | No | `visible` | Shows the Toggle normally, hides it, or displays its unavailable appearance. |

## :material-horseshoe: Related

- [Local input boolean](fhs-input-boolean.md)
- [Visibility](../../interaction/visibility.md)
- [Home Assistant Input boolean](https://www.home-assistant.io/integrations/input_boolean/)
