---
template: main.html
title: Reuse™ Reference
description: Reference the processing order, supported sections, syntax, and constraints for `same_as`, `calc()`, constants, and `ref()`.
tags:
- Reuse
- Reference
---

# Reuse™ reference

Use this page when a Reuse™ overview example shows a feature you want to adjust for your own layout.

For the practical starting points, see the [Reuse overview](reuse-introduction.md). For complete cards, see [Reusable YAML card examples](reuse-card-examples.md).

## :material-horseshoe: Choose the setting that matches the result

| You want to... | Use |
| --- | --- |
| Show another item with the same appearance | `same_as` |
| Move, resize, or use the next entity for a copied item | `same_as_d...` |
| Remove a copied list or block before adding a new one | `same_as_replace` |
| Use the same number, style, or configuration block several times | `constants` with `ref()` |
| Keep positions, sizes, and spacing visibly related | `calc()` |

## :material-horseshoe: Supported sections

Use `same_as` in these layout item sections:

| Section      | Typical use                                            |
| :----------- | :----------------------------------------------------- |
| `areas`      | Reuse area definitions.                                |
| `circles`    | Reuse circle positions, dimensions, and styles.        |
| `hlines`     | Reuse horizontal line geometry and styles.             |
| `horseshoes` | Reuse horseshoe geometry, scales, labels, and styling. |
| `icons`      | Reuse icon positions, sizing, and styles.              |
| `names`      | Reuse name positions and text styles.                  |
| `states`     | Reuse state positions and text styles.                 |
| `vlines`     | Reuse vertical line geometry and styles.               |

## :material-horseshoe: `same_as`

Use `same_as` to inherit an earlier item from the same section.

`same_as` combines the copied item's configuration with the settings written on the new item. That is why a copied item can keep the same styling and only change its position or entity.

```yaml linenums="1"
same_as: <id>
```

| Setting | What it does |
| :------ | :----------- |
| `same_as` | Uses an earlier item from the same tool list as the starting point. |
| Normal fields, such as `xpos` or `styles` | Give the copied item its own position, size, text, or style. |
| Named `id` values | Keep larger layouts readable when items are reordered. |

### Use named IDs

You can use the item number when a list is very small, but named IDs make repeated layouts easier to read.

```yaml linenums="1"
hlines:
  - xpos: 50      # id: "0"
    ypos: 64

  - same_as: 0    # refers to id "0"
    ypos: 75
```

### Move or resize a copied item

Use a delta field to add a numeric offset to an inherited value.

```yaml linenums="1"
same_as_d<field>: <number>
```

| Delta field | Use it to... |
| :--- | :--- |
| `same_as_dxpos` | Move the copied item horizontally. |
| `same_as_dypos` | Move the copied item vertically. |
| `same_as_dwidth` | Make the copied item wider or narrower. |
| `same_as_dheight` | Make the copied item taller or shorter. |
| `same_as_dlength` | Change the length of a copied line. |
| `same_as_dradius` | Change the radius of a copied circle, arc, or horseshoe. |
| `same_as_dentity_index` | Make the copied item use the next entity. |

Use `calc()` in a delta when the distance should use a named spacing value or another visible relationship.

### Replace a copied list or block

`same_as_replace` replaces a copied list or block. In this configuration, `humidity.color_stops` replaces `temperature.color_stops`:

```yaml linenums="1"
horseshoes:
  - id: temperature
    entity_index: 0
    xpos: 35
    ypos: 50
    radius: 20
    color_stops:
      colors:
        0: '#42a5f5'
        25: '#ef5350'

  - id: humidity
    entity_index: 1
    same_as: temperature
    same_as_replace:
      - color_stops
    color_stops:
      colors:
        0: '#66bb6a'
        70: '#ffca28'
```

The humidity horseshoe keeps `xpos`, `ypos`, and `radius` from temperature. `humidity.color_stops` replaces `temperature.color_stops`.

Use this for a complete nested setting, not for one ordinary value such as `xpos`, `radius`, or `entity_index`. Those values can be written directly on the copied item.

## :material-horseshoe: `constants`

Use `constants` to give a shared number, style, or configuration block a readable name.

```yaml linenums="1"
constants:
  centerX: 50
  lineStep: 11
  lineStyle:
    stroke: var(--disabled-text-color)
    stroke-width: 2
```

Use `ref()` to place that named value or block in an item. Use the name directly in `calc()` when it describes a position, size, or spacing relationship.

## :material-horseshoe: `calc()`

Use `calc()` when a position, size, or spacing is easier to understand as a relationship than as a final number.

```yaml linenums="1"
xpos: calc(50 - 4)
```

| You can use | Example |
| :--- | :--- |
| Numbers and named constants | `calc(center_x + column_gap)` |
| Arithmetic and parentheses | `calc((50 - 4) / 2)` |
| The functions listed below | `calc(sin(PI / 2))` |

### Supported operators

| Operator | Description    | Example              | Result |
| :------- | :------------- | :------------------- | :----- |
| `+`      | Addition       | `calc(50 + 4)`       | `54`   |
| `-`      | Subtraction    | `calc(50 - 4)`       | `46`   |
| `*`      | Multiplication | `calc(4 * 20)`       | `80`   |
| `/`      | Division       | `calc(100 / 4)`      | `25`   |
| `**`     | Exponentiation | `calc(2 ** 3)`       | `8`    |
| `()`     | Grouping       | `calc((50 - 4) / 2)` | `23`   |

### Supported functions and constants

| Function or constant | Description                                    | Example             | Result       |
| :------------------- | :--------------------------------------------- | :------------------ | :----------- |
| `sin()`              | Calculates the sine of an angle in radians.    | `calc(sin(PI / 2))` | `1`          |
| `cos()`              | Calculates the cosine of an angle in radians.  | `calc(cos(0))`      | `1`          |
| `tan()`              | Calculates the tangent of an angle in radians. | `calc(tan(0))`      | `0`          |
| `abs()`              | Returns the absolute value.                    | `calc(abs(-10))`    | `10`         |
| `round()`            | Rounds to the nearest integer.                 | `calc(round(10.6))` | `11`         |
| `floor()`            | Rounds down to the nearest integer.            | `calc(floor(10.9))` | `10`         |
| `ceil()`             | Rounds up to the nearest integer.              | `calc(ceil(10.1))`  | `11`         |
| `min()`              | Returns the lowest value.                      | `calc(min(10, 20))` | `10`         |
| `max()`              | Returns the highest value.                     | `calc(max(10, 20))` | `20`         |
| `sqrt()`             | Returns the square root.                       | `calc(sqrt(16))`    | `4`          |
| `PI`                 | Provides the mathematical constant π.          | `calc(PI)`          | `3.14159...` |

## :material-horseshoe: `ref()`

Use `ref()` to insert a value or configuration fragment from `constants`.

```yaml linenums="1"
constants:
  lineStyle:
    stroke: var(--disabled-text-color)
    stroke-width: 2

hlines:
  - xpos: 50
    ypos: 64
    length: 85
    styles: ref(lineStyle)
```

`ref()` is useful for shared styles, color stops, dimensions, positions, and other fixed card settings.

## :material-horseshoe: Related documentation

* [Reuse overview](reuse-introduction.md)
* [Reusable YAML card examples](reuse-card-examples.md)
* [JavaScript templates](../dynamic/javascript-templates.md)
