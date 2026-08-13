---
template: main.html
title: Reuse Reference
description: Reference the processing order, supported sections, syntax, and constraints for `same_as`, `calc()`, constants, and `ref()`.
tags:
- Reuse
- Reference
---

# Reuse reference

This page provides a compact reference for the static Reuse™ features.

For a practical introduction with complete examples, see [Less YAML with Reuse](reuse-introduction.md).

## :material-horseshoe: Processing order

Reuse features are processed once while the card configuration is prepared.

1. FHS templates and placeholders are expanded.
2. Item IDs and `constants` are recorded.
3. `ref()` values are copied from `constants`.
4. `calc()` expressions are evaluated.
5. `same_as` items are expanded.
6. JavaScript templates are detected in the resolved components.

These features are static and are not reevaluated when entity states change.

Components that contain JavaScript templates are evaluated later through the dynamic configuration lifecycle described in [Templates](../core-concepts/templating.md#dynamic-configuration-lifecycle).

## :material-horseshoe: Supported sections

`same_as` can be used in the following layout item sections:

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

```yaml
same_as: <id>
```

| Rule               | Description                                                     |
| :----------------- | :-------------------------------------------------------------- |
| Same section only  | The referenced item must belong to the same section.            |
| Earlier items only | The referenced item must appear earlier in the same list.       |
| ID-based lookup    | `same_as` resolves an item by its `id`.                         |
| Automatic IDs      | When no `id` is defined, the item index is used as a string ID. |
| Overrides allowed  | Fields on the reused item replace matching inherited fields.    |

### Automatic IDs

When an item does not define an `id`, the card assigns one from its list index.

```yaml
hlines:
  - xpos: 50      # id: "0"
    ypos: 64

  - same_as: 0    # refers to id "0"
    ypos: 75
```

Both `same_as: 0` and `same_as: "0"` refer to the item with the generated ID `"0"`.

Named IDs are usually easier to follow in larger configurations, especially when items may be reordered.

### Delta fields

Use a delta field to add a numeric offset to an inherited value.

```yaml
same_as_d<field>: <number>
```

The card adds the delta to the inherited value of the matching field.

| Delta field       | Target field | Effect                          |
| :---------------- | :----------- | :------------------------------ |
| `same_as_dxpos`   | `xpos`       | Adds to the inherited `xpos`.   |
| `same_as_dypos`   | `ypos`       | Adds to the inherited `ypos`.   |
| `same_as_dlength` | `length`     | Adds to the inherited `length`. |
| `same_as_dradius` | `radius`     | Adds to the inherited `radius`. |

The pattern is generic and can be used with any supported inherited numeric field.

| Rule                    | Description                                                               |
| :---------------------- | :------------------------------------------------------------------------ |
| Numeric values required | Both the inherited value and the delta must be numeric.                   |
| Static evaluation       | Delta fields are resolved during card setup.                              |
| `calc()` supported      | A delta value may use a static `calc()` expression.                       |
| No runtime templates    | JavaScript templates such as `[[[ ... ]]]` are not valid in delta fields. |

## :material-horseshoe: `constants`

Use `constants` to store shared static values or reusable configuration fragments.

```yaml
constants:
  centerX: 50
  lineStep: 11
  lineStyle:
    stroke: var(--disabled-text-color)
    stroke-width: 2
```

Constants can be inserted with `ref()` or used inside supported `calc()` expressions.

## :material-horseshoe: `calc()`

Use `calc()` when a numeric value should be calculated during configuration setup.

```yaml
xpos: calc(50 - 4)
```

| Rule                    | Description                                                             |
| :---------------------- | :---------------------------------------------------------------------- |
| Static evaluation       | `calc()` is evaluated once during card setup.                           |
| Numeric result required | The result must be a finite number.                                     |
| No runtime templates    | JavaScript templates cannot be used inside `calc()`.                    |
| No CSS values           | Values such as `10px`, `1em`, and `var(--color)` are not valid results. |
| Constants supported     | Static constants may be used inside `calc()`.                           |

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

```yaml
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

`ref()` is useful for shared styles, color stops, dimensions, positions, and other fixed configuration values.

Because the referenced value is copied during configuration setup, later changes to runtime state do not alter it.

## :material-horseshoe: Static reuse and dynamic templates

Static reuse features are resolved while the card is being configured. JavaScript templates are evaluated later when runtime values are updated.

| Feature        | Evaluation time | Typical use                                     |
| :------------- | :-------------- | :---------------------------------------------- |
| `same_as`      | Card setup      | Reusing section items.                          |
| `same_as_d...` | Card setup      | Applying static numeric offsets.                |
| `calc()`       | Card setup      | Performing static numeric calculations.         |
| `constants`    | Card setup      | Storing shared static values and fragments.     |
| `ref()`        | Card setup      | Inserting values from `constants`.              |
| `[[[ ... ]]]`  | Runtime updates | Producing dynamic values based on entity state. |

Use the static reuse features for layout structure and shared configuration. Use JavaScript templates only when a value must respond to runtime state.

## :material-horseshoe: Related documentation

* [Less YAML with Reuse](reuse-introduction.md)
* [Reusing Section Items](reuse-with-same_as.md)
* [YAML Calculations](reuse-with-calc-and-ref.md)
* [Combining `calc()` with `same_as`](reuse-combined.md)
* [Reusable YAML Card Examples](reuse-card-examples.md)
* [Templates](../core-concepts/templating.md)
