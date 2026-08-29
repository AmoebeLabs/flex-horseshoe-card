---
template: main.html
title: Interactive controls
description: Add buttons, toggles, selectors, number steppers, and sliders to a Flexible Horseshoe Card.
tags:
  - Controls
  - Actions
---

# Interactive controls

Interactive controls add buttons, toggles, selectors, number steppers, and sliders to a card. Use them to operate an entity, change a card setting, or run a Home Assistant action where it is useful.

Use controls with Home Assistant entities when the value belongs to Home Assistant and may also be used by automations, dashboards, or other devices. Use [browser-local Flexible Horseshoe Card inputs](browser-local-inputs.md) for choices that only affect Flexible Horseshoe Card cards in the current browser.

{{ loop_video(
  "2026.08.13-fhs-showcase-controls.mp4",
  "Interactive controls in the Flexible Horseshoe Card",
  "Buttons, toggles, selectors, number steppers, and sliders shown in one card.",
  "fhs-card-awair-selectable--dark.png",
  "2026-08-13",
  "PT0M45S",
  "400px") }}

## :material-horseshoe: Available controls

| Control | What it lets the user do |
| --- | --- |
| [Button](button-tool.md) | Open details, navigate, toggle an entity, or run an action. |
| [Number](number-tool.md) | Increase or decrease a numeric value in fixed steps. |
| [Select](select-tool.md) | Choose one option from a visible list. |
| [Slider](slider-tool.md) | Set a numeric value or choose a lower and upper value. |
| [Toggle](toggle-tool.md) | Turn an on/off entity or browser-local setting on or off. |

## :material-horseshoe: Add a control

Place controls under `layout.controls`. Every control has its own position and size inside the card:

```yaml linenums="1"
layout:
  controls:
    - id: light-details
      type: button
      entity_index: 0
      xpos: 50
      ypos: 80
      width: 40
      height: 12
      tap_action:
        action: more-info
```

Use the individual control pages for complete examples and the options available to that control.

## :material-horseshoe: Choose where the value lives

A control can work with:

- a Home Assistant entity such as a light, switch, number, select, or input helper;
- a [browser-local Flexible Horseshoe Card input](browser-local-inputs.md);
- an action that already names its own target, navigation path, or URL.

Use a Home Assistant entity when its state needs to be available outside the card. Flexible Horseshoe Card inputs are useful for display modes, chart periods, visible layers, and other settings that belong to the card itself.

## :material-horseshoe: Actions and availability

Buttons can define their own tap, hold, and double-tap actions. Other controls normally change their connected entity or Flexible Horseshoe Card input directly.

Set `visibility: unavailable` when a control should remain visible but cannot be used in the current situation. The control becomes visually subdued and does not respond to interaction.

See [Actions](../../interaction/actions.md) for action types and [Visibility](../../interaction/visibility.md) for showing, hiding, or disabling controls.
