---
template: main.html
title: Reusing items with same_as
description: Reuse an earlier Flexible Horseshoe Card tool and change only the fields that differ.
tags:
  - Reuse
  - same_as
---

# Reusing items with same_as

Use `same_as` when several tools share most of their configuration.

## :material-horseshoe: Reuse by ID

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

The second line inherits the first line and changes only its ID and position.

## :material-horseshoe: Apply an offset

Use a `same_as_d...` field when the new value is an offset from the reused item:

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

Common offsets include `same_as_dxpos`, `same_as_dypos`, `same_as_dwidth`, `same_as_dheight`, and `same_as_dradius`.

## :material-horseshoe: Replace a complete nested block

Use `same_as_replace` when one nested part should be replaced instead of combined:

```yaml linenums="1"
- id: humidity
  same_as: temperature
  same_as_replace:
    - color_stops
  color_stops:
    template:
      name: humidity_colors
```

## :material-horseshoe: Reuse from the original

A reused item can become the base for the next item, as in evenly spaced rows. Reference the original item instead when every variation should start from exactly the same definition.

## :material-horseshoe: Related

- [Reuse overview](reuse-introduction.md)
- [Calculations with calc()](../dynamic/calculations-with-calc.md)
- [Groups](../card-basics/groups.md)
