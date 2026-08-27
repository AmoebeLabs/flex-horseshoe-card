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

A button gives the user a clear command inside the card. Use it to open entity details, toggle an entity, navigate to another view, open a URL, or perform a Home Assistant action.

A button can use the entity connected through `entity_index`, or it can act without an entity when its action already contains a target, path, or URL. See [Actions](../../interaction/actions.md) for all supported actions.

<!-- Add a button control screenshot here. -->

## :material-horseshoe: Basic configuration

This button opens the more-info dialog for the first card entity:

```yaml linenums="1"
entities:
  - entity: light.living_room

layout:
  controls:
    - id: light-details
      type: button
      entity_index: 0
      xpos: 50
      ypos: 80
      width: 42
      height: 12

      show:
        item_variant: default
        item_viz: viz_button
        item_style: outlined_round

      content:
        mode: content_horizontal
        content_horizontal:
          gap: 2
          icon:
            icon: mdi:information-outline
          text:
            text: Details

      tap_action:
        action: more-info
```

!!! info "Entity and action settings"

    `entity_index: 0` connects the button to the first entry in `entities`. The button can omit `entity_index` when its action already specifies a target, path, or URL. See [Entities](../../card-basics/entities.md) for entity indexes and optional slots, and [Actions](../../interaction/actions.md) for action configuration.

## :material-horseshoe: Configuration options

| Option | Description |
| --- | --- |
| `type: button` | Adds a button control. |
| `entity_index` | Entity used by the button content and by actions such as `more-info` or `toggle`. |
| `xpos`, `ypos` | Position of the button in the card. |
| `width`, `height` | Size of the button. |
| `orientation` | Arranges the button horizontally or vertically. |
| `content` | Text, icon, entity information, or compact visual content shown inside the button. |
| `show.item_viz` | Shows a complete button with `viz_button` or an active indicator with `viz_line`. |
| `show.item_style` | Uses `filled_round`, `filled_square`, `outlined_round`, or `outlined_square`. |
| `tap_action` | Action performed when the user taps the button. |
| `hold_action` | Action performed when the user holds the button. |
| `double_tap_action` | Action performed when the user double-taps the button. |
| `label` | Optional text positioned beside or above the button. |
| `visibility` | Shows, hides, or disables the button. |

See [Positioning and sizing](../../card-basics/positioning-and-sizing.md) for coordinates and dimensions.

## :material-horseshoe: Button content

A button can show text, an icon, or both. Choose the arrangement with `content.mode`:

| Mode | Content |
| --- | --- |
| `content_text` | Text centered in the button. |
| `content_icon` | An icon centered in the button. |
| `content_horizontal` | Icon and text arranged next to each other. |
| `content_vertical` | Icon and text arranged above and below each other. |

For a compact status display, horizontal and vertical content can also contain an `items` list with entity values or visual tools:

```yaml linenums="1"
content:
  mode: content_vertical
  content_vertical:
    padding:
      x: 1
      y:
        top: 1
        bottom: 1
    gap: 1
    items:
      - id: icon
        type: icon
        size: 40
      - id: value
        type: state
        styles:
          font-size: 0.6em
      - id: status
        type: line
        length: 5
```

The content is visual. Tapping anywhere on the button performs the button action.

## :material-horseshoe: Button appearance

Use `viz_button` for a conventional button surface. Use `viz_line` when the button should keep a quieter background and indicate its active state with a line.

=== "Filled and round"

    ```yaml linenums="1"
    show:
      item_variant: default
      item_viz: viz_button
      item_style: filled_round
    ```

=== "Outlined and round"

    ```yaml linenums="1"
    show:
      item_variant: default
      item_viz: viz_button
      item_style: outlined_round
    ```

=== "Indicator line"

    ```yaml linenums="1"
    show:
      item_variant: default
      item_viz: viz_line
      item_style: outlined_round
    ```

## :material-horseshoe: Button without an entity

An entity is not needed when the action already identifies what should happen:

```yaml linenums="1"
- id: open-energy
  type: button
  xpos: 50
  ypos: 80
  width: 42
  height: 12
  content:
    mode: content_text
    content_text:
      text: Energy
  tap_action:
    action: navigate
    navigation_path: /energy
```

## :material-horseshoe: Related

- [Actions](../../interaction/actions.md)
- [Visibility](../../interaction/visibility.md)
- [Styling](../../appearance/styling.md)
