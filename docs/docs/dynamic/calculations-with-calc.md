---
template: main.html
title: Calculations with calc()
description: Calculate numeric positions, dimensions, and spacing directly in Flexible Horseshoe Card YAML.
tags:
  - Dynamic configuration
  - Calculations
  - Layout
---

# Keep a layout aligned

Use this when a card should stay visually balanced: items either side of the center, a regular row, or a set of items around a circle. Write the relationship in the YAML instead of working out every final number yourself.

## :material-horseshoe: Place two items either side of the center

```yaml linenums="1"
layout:
  icons:
    - xpos: calc(50 - 6)
      ypos: 50

    - xpos: calc(50 + 6)
      ypos: 50
```

This shows directly that both icons are placed six units from the center.

## :material-horseshoe: Calculate a position or size

| Option | Use it when you want to... |
| --- | --- |
| `calc(...)` | Calculate one numeric position, dimension, size, or spacing value. |
| A value from `constants` | Use the same named number in several calculations. |

## :material-horseshoe: Keep a row evenly spaced

```yaml linenums="1"
constants:
  first_row: 30
  row_step: 12

layout:
  lines:
    - ypos: calc(first_row)
      xpos: 50
      length: 80

    - same_as: 0
      same_as_dypos: calc(row_step)

    - same_as: 0
      same_as_dypos: calc(2 * row_step)
```

## :material-horseshoe: Arrange items around a circle

Use `sin()` and `cos()` when several items should follow the same circular layout.

```yaml linenums="1"
constants:
  center_x: 50
  center_y: 50
  radius: 20

layout:
  circles:
    - id: right
      xpos: calc(center_x + cos(0) * radius)
      ypos: calc(center_y + sin(0) * radius)
      radius: 2

    - id: bottom
      xpos: calc(center_x + cos(PI / 2) * radius)
      ypos: calc(center_y + sin(PI / 2) * radius)
      radius: 2
```

## :material-horseshoe: Adjust a whole layout from named measurements

Give the center and spacing a name when the same relationship appears in several places.

```yaml linenums="1"
constants:
  center_x: 50
  column_gap: 12

layout:
  icons:
    - xpos: calc(center_x - column_gap)
      ypos: 50

    - xpos: calc(center_x + column_gap)
      ypos: 50
```

## :material-horseshoe: Use the calculation you need

`calc()` supports:

- addition, subtraction, multiplication, division, and exponentiation;
- parentheses;
- `sin()`, `cos()`, and `tan()`;
- `abs()`, `round()`, `floor()`, and `ceil()`;
- `min()`, `max()`, and `sqrt()`;
- `PI`;
- numeric values from `constants`.

### Operators

| Operator | Example | Result |
| --- | --- | --- |
| `+` | `calc(50 + 4)` | `54` |
| `-` | `calc(50 - 4)` | `46` |
| `*` | `calc(4 * 20)` | `80` |
| `/` | `calc(100 / 4)` | `25` |
| `**` | `calc(2 ** 3)` | `8` |
| `()` | `calc((50 - 4) / 2)` | `23` |

### Functions and values

| Function or value | Example | Result |
| --- | --- | --- |
| `sin()` | `calc(sin(PI / 2))` | `1` |
| `cos()` | `calc(cos(0))` | `1` |
| `tan()` | `calc(tan(0))` | `0` |
| `abs()` | `calc(abs(-10))` | `10` |
| `round()` | `calc(round(10.6))` | `11` |
| `floor()` | `calc(floor(10.9))` | `10` |
| `ceil()` | `calc(ceil(10.1))` | `11` |
| `min()` | `calc(min(10, 20))` | `10` |
| `max()` | `calc(max(10, 20))` | `20` |
| `sqrt()` | `calc(sqrt(16))` | `4` |
| `PI` | `calc(PI)` | `3.14159...` |

Use radians with `sin()`, `cos()`, and `tan()`.

## :material-horseshoe: Choose readable YAML

Use `calc()` when the relationship is useful to see in the YAML. Use the final number directly when no relationship needs to be explained. Use a [JavaScript template](javascript-templates.md) only when a value should respond to an entity state.

## :material-horseshoe: Related

- [Positioning and sizing](../card-basics/positioning-and-sizing.md)
- [Constants and ref()](constants-and-ref.md)
- [Reusing items with same_as](../reuse/reuse-with-same_as.md)
