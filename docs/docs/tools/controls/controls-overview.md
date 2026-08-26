---
template: main.html
title: Interactive controls
description: Add buttons, toggles, selectors, number steppers, and sliders to a Flexible Horseshoe Card.
tags:
  - Controls
  - Actions
---

# Interactive controls

Controls let someone operate an entity, choose how a card is displayed, or run a Home Assistant action directly from the card.

<!-- Add the controls showcase image here. -->

{{ loop_video(
  "2026.08.13-fhs-showcase-controls.mp4",
  "Interactive controls in the Flexible Horseshoe Card",
  "Buttons, toggles, selectors, number steppers, and sliders shown in one card.",
  "fhs-demo-card-awair-selectable--dark.png",
  "2026-08-13",
  "PT0M45S",
  "400px") }}

## :material-horseshoe: Choose a control

| Control | Use it to |
| --- | --- |
| [Button](button-tool.md) | Run a tap, hold, or double-tap action. |
| [Toggle](toggle-tool.md) | Show and change an on/off state. |
| [Select](select-tool.md) | Choose one option from a visible list. |
| [Number](number-tool.md) | Increase or decrease a value in fixed steps. |
| [Slider](slider-tool.md) | Set one value or a lower and upper range. |

Add controls under `layout.controls`:

```yaml linenums="1"
layout:
  controls:
    - id: details
      type: button
      entity_index: 0
      xpos: 50
      ypos: 80
      width: 40
      height: 12
      tap_action:
        action: more-info
```

## :material-horseshoe: Connect a value

Controls can use:

- a Home Assistant entity;
- a Home Assistant helper such as `input_select`, `input_number`, or `input_boolean`;
- a [browser-local FHS input](browser-local-inputs.md).

Use a Home Assistant entity when the value should be shared with automations and other devices. Use an FHS input when the value only changes cards in the current browser.

## :material-horseshoe: Variants, visualizations, and styles

A control separates its function, visualization, and appearance:

```yaml linenums="1"
show:
  item_variant: segmented
  item_viz: viz_button
  item_style: outlined_round
```

| Setting | Chooses |
| --- | --- |
| `item_variant` | The control form, such as a segmented select or number stepper. |
| `item_viz` | How the active part is shown, such as a button or line. |
| `item_style` | The visual preset, such as filled, outlined, round, or square. |

Each control page lists the combinations intended for that control.

## :material-horseshoe: Related

- [Actions](../../interaction/actions.md)
- [Browser-local inputs](browser-local-inputs.md)
- [Visibility](../../interaction/visibility.md)
- [Styling](../../appearance/styling.md)
