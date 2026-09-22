---
template: main.html
title: Button control
description: Add an action button with text, icons, entity information, or compact visual content.
tags:
  - Controls
  - Button
  - Actions
---
# Button control

A Button is an interactive control that performs an action when the user presses it. It can open entity details, toggle an entity, call a Home Assistant action, navigate to another view, or work without an entity when the action already contains its own target.

This page shows how to add a button, choose its content and appearance, and connect tap, hold, or double-tap actions.

## :material-horseshoe: Add a Button

This button opens more information for the selected entity:

```yaml linenums="1"
entities:
  - entity: light.living_room  # Home Assistant entity used by this card

layout:
  controls:
    - id: light-details  # Name this item so it can be referenced later
      type: button  # Create a button control
      entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 80  # Vertical position; 50 = center of the card
      width: 42  # Width of the complete control
      height: 12  # Height of the complete control

      content:
        mode: content_horizontal  # Arrange the button content as horizontal
        content_horizontal:
          gap: 2  # Space between these visible parts
          icon:
            icon: mdi:information-outline  # Icon shown to the user
          text:
            text: Details  # Text shown to the user

      tap_action:
        action: more-info  # Open Home Assistant More info
```

## :material-horseshoe: Show text, an icon, or both

Choose the content arrangement with `content.mode`:

| Mode | Result |
| --- | --- |
| `content_text` | Text centered in the button |
| `content_icon` | Icon centered in the button |
| `content_horizontal` | Icon/text/items next to each other |
| `content_vertical` | Icon/text/items above and below each other |

For a Button, the content direction is controlled by `content.mode`: use `content_horizontal` or `content_vertical`. The separate `orientation` field is not used by the current Button control.

## :material-horseshoe: Change the Button appearance

Choose a complete button surface or a quieter indicator-line visualization:

```yaml linenums="1"
entities:
  - entity: light.living_room  # Entity controlled by this example

layout:
  controls:
    - type: button  # Create a button control
      entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal center of the control
      ypos: 50  # Vertical center of the control
      show:
        item_variant: default  # Use the default control variant
        item_viz: viz_button  # Use the viz_button visualization
        item_style: outlined_round  # Use the outlined_round appearance/color mode
```
`show.item_style` accepts:

- `filled_round` — filled Button with rounded corners.
- `filled_square` — filled Button with square corners.
- `outlined_round` — outlined Button with rounded corners.
- `outlined_square` — outlined Button with square corners.

`show.item_viz` accepts `viz_button` and `viz_line`. `viz_button` uses the complete Button surface for its active/inactive appearance. `viz_line` keeps the Button clickable but shows the state emphasis as an indicator line. `show.item_variant` currently has one value: `default`.

## :material-horseshoe: Use tap, hold, or double tap

A Button can define `tap_action`, `hold_action`, and `double_tap_action` independently. See [Actions](../../interaction/actions.md) for the supported actions.

## :material-horseshoe: Use a Button without an entity

No `entity_index` is needed when the action already contains everything it needs:

```yaml linenums="1"
layout:
  controls:
    - id: open-energy  # Name this item so it can be referenced later
      type: button  # Create a button control
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 80  # Vertical position; 50 = center of the card
      width: 42  # Width of the complete control
      height: 12  # Height of the complete control
      content:
        mode: content_text  # Arrange the button content as text
        content_text:
          text: Energy  # Text shown to the user
      tap_action:
        action: navigate  # Open another dashboard path
        navigation_path: /energy  # Dashboard path to open
```

## :material-horseshoe: Configuration options


`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `type: button` | string | Yes | — | Selects the Button control. |
| `entity_index` | entity index | No | Not set | Entity used by content and entity-based actions. |
| `xpos`, `ypos` | number | Yes | — | Position of the Button center on the card. |
| `width` | number | No | `20` | Width of the complete clickable Button. |
| `height` | number | No | `10` | Height of the complete clickable Button. |
| `content` | mapping | No | `content_horizontal` | Text, icon, entity information, or compact visual content. `content.mode` selects `content_text`, `content_icon`, `content_horizontal`, or `content_vertical`. |
| `background` | mapping | No | Radius `2` | Sets the complete Button surface radius and base styles before the selected visual style/state is applied. |
| `show.item_variant` | `default` | No | `default` | Uses the current Button form. |
| `show.item_viz` | `viz_button`, `viz_line` | No | `viz_button` | `viz_button` emphasizes the full Button surface; `viz_line` emphasizes an indicator line. |
| `show.item_style` | `filled_round`, `filled_square`, `outlined_round`, `outlined_square` | No | `filled_square` | Chooses filled/outlined surfaces with rounded/square corners. |
| `tap_action` | mapping | No | `toggle` | Action run when the Button is tapped; the default toggles the selected entity. |
| `hold_action` | mapping | No | Not set | Optional separate action run when the Button is held. |
| `double_tap_action` | mapping | No | Not set | Optional separate action run when the Button is double-tapped. |
| `label` | mapping | No | Not set | Optional label beside/above the Button. |
| `visibility` | `visible`, `hidden`, `unavailable` / template | No | `visible` | `visible` shows the Button normally, `hidden` hides it, and `unavailable` shows its unavailable appearance and prevents normal interaction. |

## :material-horseshoe: Related

- [Actions](../../interaction/actions.md)
- [Visibility](../../interaction/visibility.md)
- [Styling](../../appearance/styling.md)
