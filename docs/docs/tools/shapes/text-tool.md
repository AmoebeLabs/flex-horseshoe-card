---
template: main.html
title: Text
description: Add labels, headings, captions, and styled text anywhere in a Flexible Horseshoe Card.
tags:
  - Text
  - Layout
  - Labels
---
# Text

The Text tool adds your own text to a card. It can show a heading, caption, unit, fixed label, or combine several pieces such as entity names and states into one positioned text item.

This page shows how to add plain and inline text, combine entity information, use multiple lines, style the text, and keep long labels readable.

## :material-horseshoe: Add text

Use Text for fixed wording or for a sentence assembled from literal text and entity information.

```yaml linenums="1"
layout:
  texts:
    - text: Living room  # Text shown to the user
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 20  # Vertical position; 50 = center of the card
```

## :material-horseshoe: Style and position the text

Position and style Text when it needs to align with the surrounding card content instead of using its basic appearance.

```yaml linenums="1"
layout:
  texts:
    - text: Living room  # Text shown to the user
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 20  # Vertical position; 50 = center of the card
      styles:
        font-size: 1.2em  # Size of the displayed text
        font-weight: bold  # Weight of the displayed text
        text-anchor: middle  # Horizontal alignment of the text
```

## :material-horseshoe: Combine text with entity information

Use inline text parts when one line should contain fixed text and entity information together. Each inline part can provide a fixed value or use supported `name`, `state`, or `area` information.

Keep the complete inline configuration inside the Text item so the order and spacing remain obvious.

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  texts:
    - xpos: 50  # Horizontal position of the combined line
      ypos: 50  # Vertical position of the combined line
      text:
        - value: "Temperature: "  # Fixed text shown first
        - type: state  # Add the current entity state after the fixed text
          entity_index: 0  # Use the first configured entity for this part
          show:
            uom: end  # Show the entity unit after the state
```
## :material-horseshoe: Start a new line

Use `new_line` on an inline part when the next piece should continue on a new line. Use `dx` and `dy` to make small position adjustments between parts.

## :material-horseshoe: Keep long text readable

`text_overflow.mode` has three values:

- `wrap` — breaks text over multiple lines. Configure exactly one of `characters` or `max_width`; `max_lines` limits the number of lines and `dy` sets the spacing between generated lines.
- `ellipsis` — shortens text and adds `...`. Configure exactly one of `characters` or `max_width`.
- `fit` — reduces the text size until it fits within `max_width`. `min_font_size` sets the smallest allowed font size. Fit does not enlarge text, wrap it, or shorten it with `...`.

### Wrap text

```yaml linenums="1"
layout:  # Visible card items configured by this example
  texts:
    - text: A longer label that may need more than one line
      xpos: 50
      ypos: 30
      text_overflow:
        mode: wrap
        wrap:
          max_width: 40
          max_lines: 2
          dy: 1.2
```

Use `characters` instead of `max_width` when wrapping should be based on character count rather than measured width. Do not set both for the same `wrap` configuration.

### Shorten text with an ellipsis

```yaml linenums="1"
layout:  # Visible card items configured by this example
  texts:
    - text: A longer label that must stay on one line
      xpos: 50
      ypos: 50
      text_overflow:
        mode: ellipsis
        ellipsis:
          max_width: 40
```

Use `characters` instead of `max_width` when the limit should be a fixed character count. Do not set both for the same `ellipsis` configuration.

### Shrink text to fit

```yaml linenums="1"
layout:  # Visible card items configured by this example
  texts:
    - text: A complete label that must remain visible
      xpos: 50
      ypos: 70
      styles:
        font-size: 1.4em
      text_overflow:
        mode: fit
        fit:
          max_width: 40
          min_font_size: 0.8em
```

The configured font size is kept when the text already fits. When it is too wide, the card only reduces the size as far as needed, but not below `min_font_size`.

## :material-horseshoe: Configuration options

Choose plain text when one value is enough. Choose multipart text when several pieces — for example a label and an entity state — must be rendered together. In both cases the outer Text item still uses `text:`; `localize_tag` modifies a text value and does not replace the required `text` field.

### Plain Text item

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `text` | string / number | Yes | — | Text shown to the user. |
| `xpos` | number | Yes | — | Horizontal text position. |
| `ypos` | number | Yes | — | Vertical text position. |
| `localize_tag` | string | No | Not set | Uses a Home Assistant localization key for the configured scalar text. |

### Multipart Text item

Here `text` is a list. Each list item is one visible part, in display order.

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `text` | list | Yes | — | Ordered list of literal and/or entity-derived text parts. |
| `xpos` | number | Yes | — | Horizontal position where the combined text starts. |
| `ypos` | number | Yes | — | Vertical position where the combined text starts. |

### Literal inline part

Use this form for a fixed word, separator, unit, or other literal value inside multipart text.

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `value` | string / number | Yes | — | Literal value shown by this part. |
| `type` | `text` | No | `text` | Keeps this part as the literal `value` configured in the same part. |
| `localize_tag` | string | No | Not set | Localizes this literal text where a Home Assistant localization key is used. |

### Entity-derived inline part

Use this form when a part should show a Name, State, or Area instead of fixed text.

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `type` | `name`, `state`, `area` | Yes | — | `name` inserts the selected entity name, `state` inserts its displayed state, and `area` inserts its Home Assistant area name. |
| `entity_index` | entity index | No | Parent Text entity | Selects another configured entity for this part. |
| `id` | string | No | Not set | Reuses an existing Name, State, or Area item by its `id` instead of creating the source inline. |
| `show.uom` | `none`, `end`, `top`, `bottom` | No | Source State default | With `type: state`, `none` hides the unit, `end` places it after the value, `top` above it, and `bottom` below it. |
| `source_styles` | boolean | No | `true` | Keeps the styles of the referenced Name, State, or Area source. |

### Options for every inline part

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `new_line` | boolean | No | `false` | Starts this part on a new line. |
| `dx` | number | No | `0` | Moves this part horizontally from the current text position; positive moves right, negative left. |
| `dy` | number | No | `0` | Moves this part vertically from the current text position; positive moves down, negative up. |
| `styles` | mapping | No | Source / parent Text style | Changes only this part's appearance. |
| `ellipsis` | number | No | Not set | Shortens this part after the configured character limit. |

### Options for every Text item

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `id` | string | No | List position as text | Gives the Text item a name that other card features can reference. If omitted, the card uses the item's zero-based position in `layout.texts` as a text ID: `"0"`, `"1"`, `"2"`, and so on. |
| `entity_index` | entity index | No | Not set | Makes one configured entity available to the Text item and its templates. |
| `styles` | mapping | No | Default Text style | Sets font size, weight, alignment, color, and other text appearance. |
| `text_overflow` | mapping | No | Not set | Wraps, shortens, or shrinks text when it would otherwise become too wide. `mode` is `wrap`, `ellipsis`, or `fit`. |
| `group` | string | No | Not set | Places the Text item in a layout group so related items can move together. |
| `tap_action`, `hold_action`, `double_tap_action` | mapping | No | Not set | Adds interaction to the complete Text item. |

## :material-horseshoe: Related

- [State](../entities/entity-state-tool.md)
- [Name](../entities/entity-name-tool.md)
- [Positioning and sizing](../../card-basics/positioning-and-sizing.md)
