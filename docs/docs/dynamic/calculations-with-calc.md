---
template: main.html
title: Calculations with calc()
description: Calculate numeric positions, dimensions, and spacing directly in Flexible Horseshoe Card YAML.
tags:
  - Dynamic configuration
  - Calculations
  - Layout
---

# Calculations with calc()

Use `calc()` when a numeric setting is easier to understand as a relationship than as a final number.

## :material-horseshoe: Position around the center

```yaml linenums="1"
layout:
  icons:
    - xpos: calc(50 - 6)
      ypos: 50

    - xpos: calc(50 + 6)
      ypos: 50
```

This shows directly that both icons are placed six units from the center.

## :material-horseshoe: Create regular spacing

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

## :material-horseshoe: Available calculations

`calc()` supports:

- addition, subtraction, multiplication, division, and exponentiation;
- parentheses;
- `sin()`, `cos()`, and `tan()`;
- `abs()`, `round()`, `floor()`, and `ceil()`;
- `min()`, `max()`, and `sqrt()`;
- `PI`;
- numeric values from `constants`.

The result is a number used by the configured field. Use a [JavaScript template](javascript-templates.md) instead when the value must change with an entity state.

## :material-horseshoe: Related

- [Positioning and sizing](../card-basics/positioning-and-sizing.md)
- [Constants and ref()](constants-and-ref.md)
- [Reusing items with same_as](../reuse/reuse-with-same_as.md)
