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

A text item adds headings, captions, labels, and compact summaries anywhere on a card. Use it to build one readable label from fixed words and the name, state, or area already shown elsewhere on the card.

<!-- Text examples image -->

## :material-horseshoe: Basic configuration

Set `text` to the value you want to display.

```yaml linenums="1"
layout:
  texts:
    - id: history-title
      text:
        - value: 'History: '
        - value: 7 days
          styles:
            font-weight: bold
      xpos: 50
      ypos: 15
      styles:
        font-size: 1.2em
        font-weight: bold
        text-anchor: middle
```

Use `xpos` and `ypos` to position the text. Common SVG text styles such as `font-size`, `font-weight`, `fill`, `text-anchor`, and `dominant-baseline` control its appearance.

## :material-horseshoe: Configuration options

### Text item

| Field | Description |
| :-- | :-- |
| `id` | Identifies the text item. |
| `text` | A string or list of inline text parts. |
| `localize_tag` | Home Assistant translation key used instead of `text`. |
| `entity_index` | Entity available to JavaScript templates. |
| `xpos`, `ypos` | Position of the text on the card. |
| `styles` | Appearance and alignment shared by the text parts. |
| `text_overflow` | Wraps, shortens, or fits long text. |
| `group` | Places the text in a configured group. |
| `tap_action` | Runs an action when the text is tapped. |
| `hold_action` | Runs an action when the text is held. |
| `double_tap_action` | Runs an action when the text is double-tapped. |

### Inline text part

| Field | Description |
| :-- | :-- |
| `value` | Literal text or a JavaScript template. |
| `localize_tag` | Home Assistant translation key used as this part. |
| `type` | Uses a configured `name`, `state`, or `area` item as this part. |
| `id` | Identifies the configured Name, State, or Area item to show. |
| `source_styles` | Set to `false` when the part should use only the source content, not its appearance. |
| `show.uom`, `uom` | Changes the unit shown by a reused State part. |
| `entity_index` | Entity used by this part when it has its own dynamic value. |
| `new_line` | Starts this part on a new line. |
| `dx`, `dy` | Adjust this part's position in em. |
| `styles` | Appearance of this part. |
| `ellipsis` | Character limit for this part. |

## :material-horseshoe: Inline text parts

Set `text` to a list when a label contains parts with different content or styling.

```yaml linenums="1"
layout:
  texts:
    - id: history-label
      xpos: 50
      ypos: 45
      styles:
        text-anchor: middle
        dominant-baseline: middle
      text:
        - value: 'History: '
          styles:
            fill: var(--secondary-text-color)
        - value: 7 days
          styles:
            fill: var(--primary-text-color)
            font-weight: bold
```

Parts on the same line are placed directly after each other. Include spaces in the values where they are needed.

Each part uses `value` and can have its own `styles`.

## :material-horseshoe: Combine entity information

Use inline parts to make a single summary such as `Living room: 21.4 °C - Ground floor`. This is useful when the name, current value, and assigned area should stay together instead of being positioned as separate labels.

First add the Name, State, and Area items that provide the information. They can stay hidden when the summary is the only place where they should appear. Then select each item by its `type` and `id` in the summary text.

```yaml linenums="1"
layout:
  names:
    - id: room-name
      entity_index: 0
      visibility: hidden

  states:
    - id: room-temperature
      entity_index: 0
      visibility: hidden
      show:
        uom: end

  areas:
    - id: room-area
      entity_index: 0
      visibility: hidden

  texts:
    - id: room-summary
      xpos: 50
      ypos: 50
      styles:
        text-anchor: middle
        dominant-baseline: middle
      text:
        - type: name
          id: room-name
        - value: ': '
        - type: state
          id: room-temperature
          uom:
            styles:
              font-size: 0.75em
        - value: ' - '
        - type: area
          id: room-area
```

The inline part uses the source item's formatted content and appearance. Add styles to the inline part when the summary needs a different appearance. Set `source_styles: false` when only the text or value should be reused.

## :material-horseshoe: Multiple lines

Add `new_line: true` to start a part on the next line.

```yaml linenums="1"
text:
  - value: Indoor climate
    styles:
      fill: var(--secondary-text-color)
  - value: Comfortable
    new_line: true
    styles:
      font-weight: bold
```

Use `dx` and `dy` on an individual part to adjust its horizontal or vertical position.

## :material-horseshoe: Long text

Decide what a label should do when it does not fit in the available space: continue on another line, keep its size and shorten the ending, or keep the complete label visible by using a smaller font.

!!! info "Characters and width"

    `ellipsis: 40` means at most 40 characters. Use `text_overflow.ellipsis.max_width` when the available width on the card should decide what fits.

### Limit the number of characters

Use direct `ellipsis` when a label may contain only a fixed number of characters. Place it on the complete text item to limit every line, or on one inline part to limit that part only.

```yaml linenums="1"
layout:
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

### Use more than one line

Show a longer label on multiple lines while keeping it inside the available width.

```yaml linenums="1"
text_overflow:
  mode: wrap
  wrap:
    max_width: 40
    max_lines: 3
    dy: 1.4
```

### Keep the text size within a fixed width

Use this when the label must stay within a known width while keeping its font size. Unlike `ellipsis: 40`, `max_width: 40` is a width in the card layout, not a character count. Flexible Horseshoe Card shortens the ending only when the complete label is wider than `max_width`.

```yaml linenums="1"
text_overflow:
  mode: ellipsis
  ellipsis:
    max_width: 40
```

### Keep the complete label visible

Flexible Horseshoe Card uses the configured text size while it fits and makes the label smaller only when necessary. Set `min_font_size` to the smallest size that is still readable in your card.

```yaml linenums="1"
text_overflow:
  mode: fit
  fit:
    max_width: 40
    min_font_size: 0.7em
```

## :material-horseshoe: Related

* [Styling](../../appearance/styling.md)
* [Positioning and sizing](../../card-basics/positioning-and-sizing.md)
