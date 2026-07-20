---
template: main.html
title: Reuse Reference
description: Reference the processing order, supported sections, syntax, and constraints for `same_as`, `calc()`, constants, and `ref()`.
tags:
  - Reuse
  - Reference
---

# Reuse Reference

This page is a compact reference for the static Reuse™ features.

For a more practical introduction with examples, see [Better/Easier/Less YAML with Reuse](reuse-introduction.md).

## :material-horseshoe: Processing order

Reuse is processed once during card setup.

1. FHS templates and placeholders are expanded.
2. Item ids and `constants` are recorded.
3. `ref()` values are copied from `constants`.
4. `calc()` expressions are evaluated.
5. `same_as` items are expanded.
6. JavaScript templates are detected in the finalized components.

These reuse features are static. They are not re-evaluated during entity updates. Marked JavaScript components are evaluated later through the dynamic configuration lifecycle described on the [Templates](../core-concepts/templating.md#dynamic-configuration-lifecycle) page.

## :material-horseshoe: Supported sections

`same_as` can be used in layout item sections.

| Section | Example use |
| :------ | :---------- |
| `areas` | Reuse area definitions |
| `circles` | Reuse circle positions and styles |
| `hlines` | Reuse horizontal line settings |
| `horseshoes` | Reuse horseshoe settings |
| `icons` | Reuse icon positions and styles |
| `names` | Reuse name label positions and styles |
| `states` | Reuse state text positions and styles |
| `vlines` | Reuse vertical line settings |

## :material-horseshoe: `same_as`

Use `same_as` to copy an earlier item from the same section.

```yaml
same_as: <id>
```

Rules:

| Rule | Description |
| :--- | :---------- |
| Same section only | `same_as` can only refer to an item in the same section |
| Earlier items only | `same_as` can only refer to an earlier item in the list |
| Id-based lookup | `same_as` refers to an item `id` |
| Automatic ids | If no `id` is defined, the item index is used as a string id |
| Overrides allowed | Fields on the reused item override fields from the base item |

### Automatic ids

If no `id` is set, the item index is used as the id.

```yaml
hlines:
  - xpos: 50      # id: "0"
    ypos: 64

  - same_as: 0    # refers to id "0"
    ypos: 75
```

`same_as: 0` and `same_as: "0"` are equivalent.

### Delta fields

Use delta fields to add a numeric offset to an inherited value.

```yaml
same_as_d<field>: <number>
```

The delta is added to the inherited value.

Common examples:

| Delta field | Target field |
| :---------- | :----------- |
| `same_as_dxpos` | `xpos` |
| `same_as_dypos` | `ypos` |
| `same_as_dlength` | `length` |
| `same_as_dradius` | `radius` |

The pattern is generic. You can use `same_as_d<field>` with any inherited numeric field.

Rules:

| Rule | Description |
| :--- | :---------- |
| Numeric value required | The inherited value and the delta must both be numeric |
| Static only | Delta fields are resolved during card setup |
| `calc()` allowed | A delta value can use `calc()` |
| Dynamic templates not allowed | `[[[ ... ]]]` is not valid in delta fields |

## :material-horseshoe: `constants`

Use `constants` for shared static values and configuration fragments.

```yaml
constants:
  centerX: 50
  lineStep: 11
  lineStyle:
    stroke: var(--disabled-text-color)
    stroke-width: 2
```

Constants can be used by `ref()` and inside `calc()` expressions.

## :material-horseshoe: `calc()`

Use `calc()` when a numeric value should be calculated during card setup.

```yaml
xpos: calc(50 - 4)
```

Rules:

| Rule | Description |
| :--- | :---------- |
| Static only | `calc()` is evaluated once during card setup |
| Numeric result required | The result must be a finite number |
| No dynamic templates | JavaScript templates are not supported inside `calc()` |
| No CSS values | `10px`, `1em`, and `var(--color)` are not valid |
| Constants allowed | Static constants can be used inside `calc()` |

### Supported operators

| Operator | Description | Example | Result |
| :------- | :---------- | :------ | :----- |
| `+` | Addition | `calc(50 + 4)` | `54` |
| `-` | Subtraction | `calc(50 - 4)` | `46` |
| `*` | Multiplication | `calc(4 * 20)` | `80` |
| `/` | Division | `calc(100 / 4)` | `25` |
| `**` | Exponentiation | `calc(2 ** 3)` | `8` |
| `()` | Grouping | `calc((50 - 4) / 2)` | `23` |

### Supported functions and constants

| Function / constant | Description | Example | Result |
| :------------------ | :---------- | :------ | :----- |
| `sin()` | Sine | `calc(sin(PI / 2))` | `1` |
| `cos()` | Cosine | `calc(cos(0))` | `1` |
| `tan()` | Tangent | `calc(tan(0))` | `0` |
| `abs()` | Absolute value | `calc(abs(-10))` | `10` |
| `round()` | Round to the nearest integer | `calc(round(10.6))` | `11` |
| `floor()` | Round down | `calc(floor(10.9))` | `10` |
| `ceil()` | Round up | `calc(ceil(10.1))` | `11` |
| `min()` | Lowest value | `calc(min(10, 20))` | `10` |
| `max()` | Highest value | `calc(max(10, 20))` | `20` |
| `sqrt()` | Square root | `calc(sqrt(16))` | `4` |
| `PI` | Pi constant | `calc(PI)` | `3.14159...` |

## :material-horseshoe: `ref()`

Use `ref()` to copy a value from `constants`.

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

Use `ref()` for shared styles, color stops, sizes, and fixed layout values.

## :material-horseshoe: Static reuse vs dynamic JavaScript templates

Static reuse features are resolved during card setup. JavaScript templates are evaluated later, during runtime state updates.

| Feature | When evaluated | Use for |
| :------ | :------------- | :------ |
| `same_as` | During card setup | Reusing section items |
| `same_as_d...` | During card setup | Static numeric offsets |
| `calc()` | During card setup | Static numeric calculations |
| `constants` | During card setup | Shared static values |
| `ref()` | During card setup | Copying static constants |
| `[[[ ... ]]]` | During card updates | Dynamic values that depend on entity state |
