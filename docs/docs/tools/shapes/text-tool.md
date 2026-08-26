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

Use `layout.texts` for headings, captions, labels, and other text placed anywhere on a card. A text item can contain one value or several inline parts.

## Basic text

Set `text` to the value you want to display.

```yaml linenums="1"
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

Use `xpos` and `ypos` to position the text. Common SVG text styles such as `font-size`, `font-weight`, `fill`, `text-anchor`, and `dominant-baseline` control its appearance.

## Translated text

Use `localize_tag` to display a Home Assistant label in the user's selected language.

```yaml linenums="1"
layout:
  texts:
    - id: duration-title
      localize_tag: ui.dialogs.helper_settings.timer.duration
      xpos: 50
      ypos: 15
```

The value must be an existing Home Assistant translation key.

## Inline text parts

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

Each part can use `value`, `localize_tag`, and its own `styles`.

```yaml linenums="1"
text:
  - localize_tag: ui.dialogs.helper_settings.timer.duration
  - value: ': '
  - value: 7 days
    styles:
      font-weight: bold
```

## Multiple lines

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

## Dynamic text

A text value can use a JavaScript template. When the text item has an `entity_index`, the template receives that entity's state.

```yaml linenums="1"
layout:
  texts:
    - id: active-period
      entity_index: 0
      xpos: 50
      ypos: 50
      text:
        - value: 'Period: '
        - value: |
            [[[
              return `${state} day${Number(state) === 1 ? '' : 's'}`;
            ]]]
          styles:
            font-weight: bold
```

See [JavaScript templates](../../dynamic/javascript-templates.md) for the shared template syntax.

## Long text

Use `text_overflow` when text must stay within a fixed width.

### Wrap

Wrap text at spaces and optionally limit the number of lines.

```yaml linenums="1"
text_overflow:
  mode: wrap
  wrap:
    max_width: 40
    max_lines: 3
    dy: 1.4
```

### Ellipsis

Shorten text to the available width.

```yaml linenums="1"
text_overflow:
  mode: ellipsis
  ellipsis:
    max_width: 40
```

### Fit

Reduce the complete text item until it fits.

```yaml linenums="1"
text_overflow:
  mode: fit
  fit:
    max_width: 40
    min_font_size: 0.7em
```

## Configuration

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
| `new_line` | Starts this part on a new line. |
| `dx`, `dy` | Adjust this part's position in em. |
| `styles` | Appearance of this part. |
| `ellipsis` | Character limit for this part. |

Continue with [Actions](../../interaction/actions.md), [Styling](../../appearance/styling.md), or [Positioning and sizing](../../card-basics/positioning-and-sizing.md) when the text needs those features.
