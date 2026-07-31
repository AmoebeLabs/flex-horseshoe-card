---
template: main.html
title: Text
description: Add standalone labels, headings, button captions, and multipart text anywhere in a Flexible Horseshoe Card layout.
tags:
- Text
- Layout
- Labels
---

# Text

Use `layout.texts` for text that does not come directly from an entity name,
area, or state. It is useful for headings, captions, button labels, units, and
short explanations placed anywhere on a card.

A text item does not need an entity. Its default action is `none`, so a label
placed over a rectangle does not block the rectangle's action.

## :material-horseshoe: Basic text

Set `text` to a string for a simple label:

```yaml
layout:
  texts:
    - id: history-title
      text: History
      xpos: 50
      ypos: 15
      styles:
        font-size: 1.2em
        font-weight: bold
        text-anchor: middle
```

## :material-horseshoe: Multipart text

Set `text` to a list when parts need different styles or should appear on
separate lines:

```yaml
layout:
  texts:
    - id: history-label
      xpos: 50
      ypos: 45
      styles:
        text-anchor: middle
        dominant-baseline: middle
      text:
        - value: History
          styles:
            fill: var(--secondary-text-color)
        - value: 7 days
          new_line: true
          styles:
            fill: var(--primary-text-color)
            font-weight: bold
```

Parts on the same line are placed directly after each other. Add spaces to the
part values where needed:

```yaml
text:
  - value: 'Selected: '
  - value: 7 days
    styles:
      font-weight: bold
```

`new_line: true` starts a new line. Use `dy` to change the line spacing; its
default is `1.2` em. `dx` and `dy` can also move individual parts.

## :material-horseshoe: Dynamic parts

Each part can use its own entity, JavaScript template, state map, color stops,
styles, and animation. When `entity_index` is omitted from a part, it uses the
entity from the complete text item when one is configured.

```yaml
texts:
  - id: active-period
    xpos: 50
    ypos: 50
    entity_index: 0
    text:
      - value: 'Period: '
      - value: |
          [[[
            return `${state} day${Number(state) === 1 ? '' : 's'}`;
          ]]]
        styles:
          font-weight: bold
```

A state map can replace the displayed value and other settings for a part:

```yaml
text:
  - value: Unknown
    entity_index: 1
    state_map:
      map:
        - state: 'on'
          value: Active
          styles:
            fill: var(--success-color)
        - state: 'off'
          value: Inactive
          styles:
            fill: var(--secondary-text-color)
```

## :material-horseshoe: Ellipsis

Use `ellipsis` on the complete text item to limit every visual line. The limit
is shared by all parts on that line and starts again after `new_line`.

```yaml
texts:
  - id: compact-label
    xpos: 50
    ypos: 50
    ellipsis: 16
    text:
      - value: 'History period: '
      - value: 7 days
        styles:
          font-weight: bold
```

A part may also have its own `ellipsis`. That limit is applied before the
limit of the complete text item.

## :material-horseshoe: Configuration fields

### Text item

| Field | Required | Default | Description |
| :---- | :------: | :------ | :---------- |
| `id` | :material-close: | Generated | Identifies the item for `same_as`, animations, and references. |
| `text` | :material-check: | | A string or list of text parts. |
| `xpos` | :material-check: | | Horizontal position on the card canvas. |
| `ypos` | :material-check: | | Vertical position on the card canvas. |
| `entity_index` | :material-close: | None | Entity used by the item and inherited by parts without their own entity. |
| `ellipsis` | :material-close: | None | Maximum number of characters on each visual line. |
| `styles` | :material-close: | | Styles inherited by all parts, including alignment and font settings. |
| `tap_action` | :material-close: | `none` | Action for the complete text item. |
| `hold_action` | :material-close: | None | Hold action for the complete text item. |
| `double_tap_action` | :material-close: | None | Double-tap action for the complete text item. |
| `group` | :material-close: | Card | Places the text in a configured group. |
| `same_as` | :material-close: | None | Reuses an earlier item from `layout.texts`. |

### Text part

| Field | Required | Default | Description |
| :---- | :------: | :------ | :---------- |
| `value` | :material-check: | | Text or a JavaScript template that returns text. |
| `type` | :material-close: | `text` | Part type. Literal text uses `text`. |
| `entity_index` | :material-close: | Item entity | Entity used by templates, state maps, and color stops for this part. |
| `new_line` | :material-close: | `false` | Starts the part on a new line. |
| `dx` | :material-close: | `0` | Horizontal offset in em. |
| `dy` | :material-close: | `0`, or `1.2` for a new line | Vertical offset in em. |
| `ellipsis` | :material-close: | None | Maximum number of characters for this part. |
| `styles` | :material-close: | | Overrides inherited styles for this part. |
| `state_map` | :material-close: | None | Changes the part for matching entity states. |
| `color_stops` | :material-close: | None | Colors the part from its entity value. |
| `animation_id` | :material-close: | None | Connects this part to a text animation. |

## :material-horseshoe: Reusing labels

Text items support `same_as` and the usual numeric delta fields. This makes a
row of button labels concise:

```yaml
texts:
  - id: one-day
    text: 1 day
    xpos: 25
    ypos: 50
  - id: two-days
    same_as: one-day
    text: 2 days
    same_as_dxpos: 25
  - id: seven-days
    same_as: two-days
    text: 7 days
    same_as_dxpos: 25
```

