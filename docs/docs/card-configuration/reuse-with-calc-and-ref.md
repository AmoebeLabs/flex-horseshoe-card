---
template: main.html
title: YAML Calculations
description: Brrrrrr.
tags:
  - YAML Calculations
---

## YAML Calculations

## Static `calc()` expressions

YAML itself does not calculate values.

This means YAML normally treats this as text, not as a formula:

```yaml
xpos: 50 - 4
```
The card would not automatically understand that this should become:

```yaml
xpos: 46
```

For this reason, the card supports static calc() expressions.

A calc() expression is evaluated once during config setup. The result becomes a normal number in the internal card configuration. This makes layouts easier to read, easier to maintain, and easier to reuse.

### Why use calc()?

| Use case               | Without `calc()`                    | With `calc()`                          |
| :--------------------- | :---------------------------------- | :------------------------------------- |
| Position around center | `xpos: 46`                          | `xpos: calc(50 - 4)`                   |
| Repeated spacing       | `ypos: 86`                          | `ypos: calc(64 + 2 * 11)`              |
| Width based on parts   | `length: 85`                        | `length: calc(4 * 20 + 5)`             |
| Circular positioning   | manually calculated `xpos` / `ypos` | `xpos: calc(50 + cos(angle) * radius)` |
| Reuse with offsets     | duplicate full config               | `same_as` + `same_as_d...`             |

## Static `calc()` expressions

The card supports static `calc()` expressions in numeric configuration fields.

A `calc()` expression is evaluated once during config setup. The result becomes a normal number in the internal card configuration. This makes it easier to define positions, sizes, offsets, and repeated layout patterns without manually calculating every value.

```yaml
hlines:
  - xpos: 50
    ypos: 64
    length: calc(4 * 20 + 5)

  - same_as: 0
    same_as_dypos: calc(1 * 11)

  - same_as: 0
    same_as_dypos: calc(2 * 11)
```
Internally this becomes:
```yaml
    hlines:
  - id: "0"
    xpos: 50
    ypos: 64
    length: 85

  - id: "1"
    xpos: 50
    ypos: 75
    length: 85

  - id: "2"
    xpos: 50
    ypos: 86
    length: 85
```

!!! Info "calc() is static. It is not a template and is not evaluated during runtime updates."


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

| Function / constant | Description              | Example             | Result       |
| :------------------ | :----------------------- | :------------------ | :----------- |
| `sin()`             | Sine                     | `calc(sin(PI / 2))` | `1`          |
| `cos()`             | Cosine                   | `calc(cos(0))`      | `1`          |
| `tan()`             | Tangent                  | `calc(tan(0))`      | `0`          |
| `abs()`             | Absolute value           | `calc(abs(-10))`    | `10`         |
| `round()`           | Round to nearest integer | `calc(round(10.6))` | `11`         |
| `floor()`           | Round down               | `calc(floor(10.9))` | `10`         |
| `ceil()`            | Round up                 | `calc(ceil(10.1))`  | `11`         |
| `min()`             | Lowest value             | `calc(min(10, 20))` | `10`         |
| `max()`             | Highest value            | `calc(max(10, 20))` | `20`         |
| `sqrt()`            | Square root              | `calc(sqrt(16))`    | `4`          |
| `PI`                | Pi constant              | `calc(PI)`          | `3.14159...` |


### Examples

Position around the card center

```yaml
icons:
  - xpos: calc(50 - 4)
    ypos: 50

  - xpos: calc(50 + 4)
    ypos: 50
```    

Repeated vertical spacing

```yaml
hlines:
  - xpos: 50
    ypos: 64
    length: calc(4 * 20 + 5)

  - same_as: 0
    same_as_dypos: calc(1 * 11)

  - same_as: 0
    same_as_dypos: calc(2 * 11)
```

Trigonometric positioning

```yaml
circles:
  - xpos: calc(50 + cos(0) * 20)
    ypos: calc(50 + sin(0) * 20)
    radius: 2

  - xpos: calc(50 + cos(PI / 2) * 20)
    ypos: calc(50 + sin(PI / 2) * 20)
    radius: 2
```

### Notes

| Rule                    | Description                                                                          |
| :---------------------- | :----------------------------------------------------------------------------------- |
| Static only             | `calc()` is evaluated during config setup, not during rendering.                     |
| Numeric result required | The result must be a finite number.                                                  |
| No templates            | JavaScript templates like `[[[ return 10; ]]]` are not supported inside `calc()`.    |
| No CSS values           | CSS values such as `10px`, `1em`, or `var(--color)` are not valid.                   |
| No variables            | Only numbers, operators, and explicitly supported functions/constants are available. |


