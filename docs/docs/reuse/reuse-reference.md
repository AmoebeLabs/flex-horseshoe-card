---
template: main.html
title: Reuse Reference
description: Compact reference for same_as, calc(), constants and ref().
tags:
  - Reuse
  - Reference
---

# Reuse Reference

This page is a compact reference for the static reuse features.

For the explanation and examples, see [Better/Easier/Less YAML with Reuse](reuse-introduction.md).

##:material-horseshoe: Processing order

Reuse is processed during card setup.

1. `constants` are read.
2. `ref()` values are copied.
3. `calc()` expressions are evaluated.
4. `same_as` items are expanded.
5. The renderer receives complete configuration items.

These features are not runtime templates.

##:material-horseshoe: Supported sections

`same_as` can be used in layout item sections.

| Section | Example use |
| :------ | :---------- |
| `horseshoes` | Reuse horseshoe settings |
| `states` | Reuse state text positions and styles |
| `names` | Reuse name label positions and styles |
| `areas` | Reuse area definitions |
| `circles` | Reuse circle positions and styles |
| `hlines` | Reuse horizontal line settings |
| `vlines` | Reuse vertical line settings |
| `icons` | Reuse icon positions and styles |

##:material-horseshoe: `same_as`

```yaml
same_as: <id>
```

Rules:

| Rule | Description |
| :--- | :---------- |
| Same section only | `same_as` can only refer to an item in the same section |
| Earlier items only | `same_as` can only refer to an earlier item in the list |
| Id-based lookup | `same_as` refers to an item `id` |
| Auto ids | If no `id` is defined, the item index is used as string id |
| Overrides allowed | Fields on the reused item override fields from the base item |

### Auto ids

If no `id` is set, the item index is used as id.

```yaml
hlines:
  - xpos: 50      # id: "0"
    ypos: 64

  - same_as: 0    # refers to id "0"
    ypos: 75
```

`same_as: 0` and `same_as: "0"` are equivalent.

### Delta fields

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

The pattern is generic. It can be used with any inherited numeric field.

Rules:

| Rule | Description |
| :--- | :---------- |
| Numeric value required | The inherited value and delta must be numeric |
| Static only | Delta fields are resolved during card setup |
| `calc()` allowed | A delta value can use `calc()` |
| Runtime templates not allowed | `[[[ ... ]]]` is not valid in delta fields |

##:material-horseshoe: `constants`

Use `constants` for shared static values and config fragments.

```yaml
constants:
  centerX: 50
  lineStep: 11
  lineStyle:
    stroke: var(--disabled-text-color)
    stroke-width: 2
```

Constants can be used by `ref()` and by `calc()`.

##:material-horseshoe: `calc()`

```yaml
xpos: calc(50 - 4)
```

Rules:

| Rule | Description |
| :--- | :---------- |
| Static only | `calc()` is evaluated once during card setup |
| Numeric result required | The result must be a finite number |
| No runtime templates | JavaScript templates are not supported inside `calc()` |
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
| `round()` | Round to nearest integer | `calc(round(10.6))` | `11` |
| `floor()` | Round down | `calc(floor(10.9))` | `10` |
| `ceil()` | Round up | `calc(ceil(10.1))` | `11` |
| `min()` | Lowest value | `calc(min(10, 20))` | `10` |
| `max()` | Highest value | `calc(max(10, 20))` | `20` |
| `sqrt()` | Square root | `calc(sqrt(16))` | `4` |
| `PI` | Pi constant | `calc(PI)` | `3.14159...` |

##:material-horseshoe: `ref()`

`ref()` copies a value from `constants`.

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

Use `ref()` for shared styles, color stops, sizes and fixed layout values.

##:material-horseshoe: Static reuse vs runtime JavaScript templates

| Feature | When evaluated | Use for |
| :------ | :------------- | :------ |
| `same_as` | Card setup | Reusing section items |
| `same_as_d...` | Card setup | Static numeric offsets |
| `calc()` | Card setup | Static numeric calculations |
| `constants` | Card setup | Shared static values |
| `ref()` | Card setup | Copying static constants |
| `[[[ ... ]]]` | Runtime updates | Values that depend on entity state |
