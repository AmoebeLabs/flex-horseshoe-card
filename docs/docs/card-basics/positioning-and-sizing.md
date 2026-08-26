---
template: main.html
title: Positioning and sizing
description: Position and size tools in the Flexible Horseshoe Card coordinate system.
tags:
  - Card basics
  - Positioning
  - Sizing
---

# Positioning and sizing

Place tools with `xpos` and `ypos`. The card coordinate system starts at `0, 0` in the top-left and uses `50, 50` as its center.

<!-- Add a coordinate-system diagram here. -->

## :material-horseshoe: Position a tool

```yaml linenums="1"
layout:
  icons:
    - entity_index: 0
      xpos: 50
      ypos: 25
      size: 4
```

| Position | `xpos` | `ypos` |
| --- | ---: | ---: |
| Top-left | `0` | `0` |
| Center | `50` | `50` |
| Bottom-right | `100` | `100` |

Tools are positioned from their visual center unless their own page describes another anchor.

## :material-horseshoe: Choose the card shape

Use `layout.aspectratio` to make the card square, wide, or tall:

=== "Square"

    ```yaml linenums="1"
    layout:
      aspectratio: 1/1
    ```

=== "Wide"

    ```yaml linenums="1"
    layout:
      aspectratio: 1.5/1
    ```

=== "Tall"

    ```yaml linenums="1"
    layout:
      aspectratio: 1/1.5
    ```

## :material-horseshoe: Size tools

| Tool | Common size fields |
| --- | --- |
| Text and entity text | `font-size`, overflow settings |
| Icon | `size` |
| Circle | `radius` or `radius_percent` |
| Arc and horseshoe | `radius`, `arc_degrees` |
| Line | `length`, `thickness` |
| Rectangle | `width`, `height`, `radius` |
| Sparkline and control | `width`, `height` |

## :material-horseshoe: Move related tools together

Use a group when several tools form one visual block. Positions inside the group are relative to its center.

```yaml linenums="1"
layout:
  groups:
    - id: heading
      xpos: 50
      ypos: 15

  icons:
    - group: heading
      entity_index: 0
      xpos: 40
      ypos: 50

  names:
    - group: heading
      entity_index: 0
      xpos: 55
      ypos: 50
```

See [Groups](groups.md) for complete examples.

## :material-horseshoe: Related

- [Card overview](card-overview.md)
- [Groups](groups.md)
- [Card tools](../tools/tools-overview.md)
- [Calculations with calc()](../dynamic/calculations-with-calc.md)
