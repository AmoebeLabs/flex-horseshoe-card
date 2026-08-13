---
template: main.html
title: YAML Calculations
description: Use static `calc()` expressions to calculate numeric positions, sizes, spacing, and offsets during card configuration.
tags:
- YAML Calculations
---

# YAML calculations

YAML does not evaluate arithmetic expressions on its own. A value such as:

```yaml
xpos: 50 - 4
```

is treated as text rather than calculated as:

```yaml
xpos: 46
```

To make numeric layouts easier to read and maintain, the card supports static `calc()` expressions. These expressions are evaluated once while the configuration is processed, and their result becomes a normal number in the resolved card configuration.

## :material-horseshoe: Why use `calc()`?

`calc()` keeps the relationship between values visible in the YAML. Instead of storing only the final number, you can show how that number is derived.

| Use case                      | Without `calc()`                      | With `calc()`                          |
| :---------------------------- | :------------------------------------ | :------------------------------------- |
| Position around the center    | `xpos: 46`                            | `xpos: calc(50 - 4)`                   |
| Repeated spacing              | `ypos: 86`                            | `ypos: calc(64 + 2 * 11)`              |
| Length based on several parts | `length: 85`                          | `length: calc(4 * 20 + 5)`             |
| Circular positioning          | Manually calculated `xpos` and `ypos` | `xpos: calc(50 + cos(angle) * radius)` |
| Reuse with offsets            | Repeated full definitions             | `same_as` with `same_as_d...`          |

The calculated form is especially useful when a layout is based on a shared center, regular spacing, repeated dimensions, or geometric relationships.

## :material-horseshoe: Basic usage

Use `calc()` in numeric configuration fields:

```yaml linenums="1"
hlines:
  - xpos: 50
    ypos: 64
    length: calc(4 * 20 + 5)

  - same_as: 0
    same_as_dypos: calc(1 * 11)

  - same_as: 0
    same_as_dypos: calc(2 * 11)
```

The card resolves this configuration to the equivalent numeric values:

```yaml linenums="1"
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

!!! info "`calc()` is static"
`calc()` is evaluated once during configuration setup. It is not a runtime template and is not reevaluated when entity states change.

## :material-horseshoe: Supported operators

| Operator | Description    | Example              | Result |
| :------- | :------------- | :------------------- | :----- |
| `+`      | Addition       | `calc(50 + 4)`       | `54`   |
| `-`      | Subtraction    | `calc(50 - 4)`       | `46`   |
| `*`      | Multiplication | `calc(4 * 20)`       | `80`   |
| `/`      | Division       | `calc(100 / 4)`      | `25`   |
| `**`     | Exponentiation | `calc(2 ** 3)`       | `8`    |
| `()`     | Grouping       | `calc((50 - 4) / 2)` | `23`   |

Parentheses can make longer expressions easier to read and ensure operations are evaluated in the intended order.

## :material-horseshoe: Supported functions and constants

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

Trigonometric functions use radians rather than degrees.

## :material-horseshoe: Positioning around the card center

Many card layouts are designed around the center point `50, 50`.

Using `calc()` keeps the intended offset visible:

```yaml linenums="1"
icons:
  - xpos: calc(50 - 4)
    ypos: 50

  - xpos: calc(50 + 4)
    ypos: 50
```

The result is the same as using `46` and `54`, but the calculated version makes it clear that both icons are placed symmetrically around the center.

## :material-horseshoe: Repeated spacing

Regular spacing is easier to maintain when the step size remains visible in the expression.

```yaml linenums="1"
hlines:
  - xpos: 50
    ypos: 64
    length: calc(4 * 20 + 5)

  - same_as: 0
    same_as_dypos: calc(1 * 11)

  - same_as: 0
    same_as_dypos: calc(2 * 11)
```

This creates three lines at `ypos` values `64`, `75`, and `86`.

When the spacing changes, the relationship between the lines remains easy to recognize.

## :material-horseshoe: Trigonometric positioning

Trigonometric functions can place items around a center point.

```yaml linenums="1"
circles:
  - xpos: calc(50 + cos(0) * 20)
    ypos: calc(50 + sin(0) * 20)
    radius: 2

  - xpos: calc(50 + cos(PI / 2) * 20)
    ypos: calc(50 + sin(PI / 2) * 20)
    radius: 2
```

The first circle is positioned to the right of the center. The second is positioned below it when the card coordinate system increases downward along the Y-axis.

Use the same pattern with different angles to distribute items around a circle.

## :material-horseshoe: Using constants in calculations

Static constants can make repeated calculations easier to update.

```yaml linenums="1"
constants:
  centerX: 50
  centerY: 50
  iconOffset: 4
  lineStep: 11

layout:
  icons:
    - xpos: calc(centerX - iconOffset)
      ypos: calc(centerY)

    - xpos: calc(centerX + iconOffset)
      ypos: calc(centerY)

  hlines:
    - xpos: calc(centerX)
      ypos: 64
      length: calc(4 * 20 + 5)

    - same_as: 0
      same_as_dypos: calc(lineStep)
```

Changing a shared constant updates every expression that uses it, without requiring the final values to be recalculated manually.

## :material-horseshoe: Important rules

| Rule                                  | Description                                                                                                                    |
| :------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------- |
| Static evaluation                     | `calc()` is evaluated during configuration setup, not during rendering or entity updates.                                      |
| Numeric result required               | The expression must resolve to a finite number.                                                                                |
| No runtime templates                  | JavaScript templates such as `[[[ return 10; ]]]` cannot be used inside `calc()`.                                              |
| No CSS values                         | Values such as `10px`, `1em`, or `var(--color)` are not valid calculation results.                                             |
| Supported values only                 | Expressions may use numbers, supported operators, supported functions, constants, and permitted reusable configuration values. |
| YAML does not perform the calculation | `calc()` is provided by the card and is not part of standard YAML.                                                             |

## :material-horseshoe: When to use `calc()`

Use `calc()` when the relationship between values is useful to see in the configuration.

Typical examples include:

* positions relative to the card center
* regular spacing between repeated items
* dimensions built from several parts
* circular or angular positioning
* offsets used with `same_as`
* values based on shared constants

For a unique value with no meaningful relationship to other settings, writing the final number directly may be clearer.

## :material-horseshoe: Related documentation

* [Less YAML with Reuse](reuse-introduction.md)
* [Reusing Section Items](reuse-with-same_as.md)
* [Combining `calc()` with `same_as`](reuse-combined.md)
* [Reusable YAML Card Examples](reuse-card-examples.md)
* [Reuse Reference](reuse-reference.md)
