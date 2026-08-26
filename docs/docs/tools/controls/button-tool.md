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

Use a button to open details, toggle an entity, navigate, open a URL, or perform a Home Assistant action.

<!-- Add button control examples here. -->

## :material-horseshoe: Basic button

```yaml linenums="1"
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
          items:
            - id: icon
              type: icon
              icon: mdi:information-outline
            - id: label
              type: text
              text: Details

      tap_action:
        action: more-info
```

A button does not need an entity when its configured action already identifies the target, navigation path, or URL.

## :material-horseshoe: Button content

A button can combine visual items in a horizontal or vertical arrangement:

| Content type | Shows |
| --- | --- |
| `text` | Configured text |
| `icon` | An entity icon or configured icon |
| `state` | Entity value and unit |
| `name` | Entity name |
| `area` | Entity area |
| `line` | Compact status line |
| `circle` | Compact status circle |
| `horseshoe` | Compact horseshoe |
| `sparkline` | Compact history graph |

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

Use `padding` around the complete content, `gap` between items, and `margin` on an individual item.

Content is visual only. The button itself handles the action.

## :material-horseshoe: Button appearance

| Visualization | Result |
| --- | --- |
| `viz_button` | Shows the complete button surface. |
| `viz_line` | Uses a line as the active indicator. |

Use `filled_round`, `filled_square`, `outlined_round`, or `outlined_square` for `item_style`.

## :material-horseshoe: Related

- [Actions](../../interaction/actions.md)
- [Select content](select-tool.md#select-content)
- [Styling](../../appearance/styling.md)
