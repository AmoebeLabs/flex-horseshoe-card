---
template: main.html
title: Reusing items with same_as
description: Reuse an earlier Flexible Horseshoe Card tool and change only the fields that differ.
tags:
  - Reuse
  - same_as
---

# Show several items the same way

Use this when a card shows several rooms, sensors, dividers, or gauges with the same appearance. Describe the first item normally; each following item only needs to say what changes.

## :material-horseshoe: Copy one item and place it elsewhere

Give the first item an `id`. Use that ID in `same_as` for the next item.

```yaml linenums="1"
layout:
  lines:
    - id: first-divider
      xpos: 50
      ypos: 35
      length: 80
      orientation: horizontal
      styles:
        stroke: var(--divider-color)
        stroke-width: 1

    - id: second-divider
      same_as: first-divider
      ypos: 65
```

The second line has the same length and styling as the first line, but appears at another position.

## :material-horseshoe: Change what is different

| Option | Use it when you want to... |
| --- | --- |
| `same_as` | Start with the configuration of an earlier item in the same tool list. |
| A normal field, such as `xpos` or `styles` | Give the reused item its own value. |
| `same_as_d...` | Move or resize the reused item relative to its starting value. |
| `same_as_replace` | Use a completely different nested block, such as another color-stop definition. |

## :material-horseshoe: Keep rooms or sensors evenly spaced

Use a `same_as_d...` field when the next item should keep a consistent distance from the previous item:

```yaml linenums="1"
layout:
  circles:
    - id: room-1
      xpos: 20
      ypos: 50
      radius: 4

    - id: room-2
      same_as: room-1
      same_as_dxpos: 20

    - id: room-3
      same_as: room-2
      same_as_dxpos: 20
```

Use the matching delta field for the value you want to change:

| Field | Use it to... |
| --- | --- |
| `same_as_dxpos` | Move the next item horizontally. |
| `same_as_dypos` | Move the next item vertically. |
| `same_as_dwidth` | Make the next item wider or narrower. |
| `same_as_dheight` | Make the next item taller or shorter. |
| `same_as_dlength` | Change the length of a line. |
| `same_as_dradius` | Change the radius of a circle, arc, or horseshoe. |
| `same_as_dentity_index` | Use the next entity from the card’s entity list. |

The same `same_as_d...` pattern can be used with another numeric field when a repeated item needs a relative difference.

## :material-horseshoe: Give one copied item its own colors

Use `same_as_replace` when a reused item needs a different complete nested setting, for example its own color-stop definition:

```yaml linenums="1"
- id: humidity
  same_as: temperature
  same_as_replace:
    - color_stops
  color_stops:
    template:
      name: humidity_colors
```

## :material-horseshoe: Choose how a repeated row grows

A reused item can become the basis for the next item, which is useful for a row with equal spacing. Reference the original item instead when every copy should use its own fixed offset from one shared base. See [Repeating layouts with same_as and calc()](reuse-combined.md) for both patterns side by side.

## :material-horseshoe: Related

- [Reuse overview](reuse-introduction.md)
- [Calculations with calc()](../dynamic/calculations-with-calc.md)
- [Groups](../card-basics/groups.md)
