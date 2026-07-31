---
template: main.html
title: Reusing Section Items
description: Reuse earlier layout items with `same_as`, override selected fields, apply numeric deltas, and combine reuse with static `calc()` expressions.
tags:
- Reuse
---

# Reusing section items

The `same_as` option lets an item inherit the configuration of an earlier item from the same section.

This is useful when several items share the same position, styling, dimensions, or nested configuration but differ in only a few fields. Instead of repeating the full definition, create one base item and reuse it.

The card resolves `same_as` while processing the configuration. Before rendering, every reused item becomes a complete item with all inherited and overridden values applied.

## :material-horseshoe: Basic example

The example below defines one horizontal line and reuses it twice. Each reused line keeps the original position, length, and style, but replaces `ypos`.

```yaml linenums="1"
hlines:
  - id: first
    xpos: 50
    ypos: 64
    length: 85
    styles:
      - stroke: var(--disabled-text-color)

  - id: second
    same_as: first
    ypos: 75

  - id: third
    same_as: first
    ypos: 86
```

The relationship between the items is:

| Item     | Description                                   |
| :------- | :-------------------------------------------- |
| `first`  | Defines the complete base item.               |
| `second` | Reuses `first` and replaces `ypos` with `75`. |
| `third`  | Reuses `first` and replaces `ypos` with `86`. |

The resolved configuration is equivalent to:

```yaml linenums="1"
hlines:
  - id: first
    xpos: 50
    ypos: 64
    length: 85
    styles:
      - stroke: var(--disabled-text-color)

  - id: second
    xpos: 50
    ypos: 75
    length: 85
    styles:
      - stroke: var(--disabled-text-color)

  - id: third
    xpos: 50
    ypos: 86
    length: 85
    styles:
      - stroke: var(--disabled-text-color)
```

The written YAML stays compact, while each resolved item still contains the complete configuration required for rendering.

## :material-horseshoe: Automatic IDs

When an item does not define an `id`, the card assigns one from its position in the list.

```yaml linenums="1"
hlines:
  - xpos: 50
    ypos: 64
    length: 85

  - same_as: 0
    ypos: 75

  - same_as: 0
    ypos: 86
```

This behaves as though the items had the following identifiers:

```yaml linenums="1"
hlines:
  - id: "0"
    xpos: 50
    ypos: 64
    length: 85

  - id: "1"
    same_as: 0
    ypos: 75

  - id: "2"
    same_as: 0
    ypos: 86
```

Both `same_as: 0` and `same_as: "0"` refer to the item with the generated ID `"0"`.

Automatic IDs are convenient for short configurations. Named IDs are usually easier to follow in larger layouts and remain clearer when items are reordered.

## :material-horseshoe: Overriding inherited fields

A reused item can replace any field inherited from its base item.

```yaml linenums="1"
circles:
  - id: base
    xpos: 50
    ypos: 50
    radius: 40
    styles:
      - fill: none
      - stroke: red

  - id: smaller
    same_as: base
    radius: 30
    styles:
      - fill: none
      - stroke: blue
```

The `smaller` circle inherits `xpos` and `ypos` from `base`, but uses its own radius and styles.

Fields defined on the reused item take precedence over the corresponding fields inherited from the base item.

## :material-horseshoe: Delta fields

For numeric values, delta fields can express the difference from the inherited value without replacing it directly.

Delta fields follow this pattern:

```yaml
same_as_d<field>: <number>
```

The card adds the delta to the inherited value of the matching field.

| Delta field       | Target field | Meaning                         |
| :---------------- | :----------- | :------------------------------ |
| `same_as_dxpos`   | `xpos`       | Adds to the inherited `xpos`.   |
| `same_as_dypos`   | `ypos`       | Adds to the inherited `ypos`.   |
| `same_as_dlength` | `length`     | Adds to the inherited `length`. |
| `same_as_dradius` | `radius`     | Adds to the inherited `radius`. |

```yaml linenums="1"
hlines:
  - id: first
    xpos: 50
    ypos: 64
    length: 85

  - id: second
    same_as: first
    same_as_dypos: 11

  - id: third
    same_as: first
    same_as_dypos: 22
```

The resulting positions are:

| Item     | Resulting `ypos` |
| :------- | :--------------- |
| `first`  | `64`             |
| `second` | `75`             |
| `third`  | `86`             |

Using delta fields makes the spacing relationship visible in the configuration.

## :material-horseshoe: Generic delta fields

The delta pattern is generic. `same_as_d<field>` can be used with any supported numeric field present on the reused item.

The example below creates a smaller circle by subtracting `5` from the inherited radius:

```yaml linenums="1"
circles:
  - id: outer
    xpos: 50
    ypos: 50
    radius: 40

  - id: inner
    same_as: outer
    same_as_dradius: -5
```

The resolved result is equivalent to:

```yaml linenums="1"
circles:
  - id: outer
    xpos: 50
    ypos: 50
    radius: 40

  - id: inner
    xpos: 50
    ypos: 50
    radius: 35
```

The same approach can adjust a line length:

```yaml linenums="1"
hlines:
  - id: base
    xpos: 50
    ypos: 64
    length: 85

  - id: shorter
    same_as: base
    same_as_dlength: -10
```

This resolves to:

```yaml linenums="1"
hlines:
  - id: base
    xpos: 50
    ypos: 64
    length: 85

  - id: shorter
    xpos: 50
    ypos: 64
    length: 75
```

## :material-horseshoe: Chained reuse

A reused item can serve as the base for a later item.

```yaml linenums="1"
hlines:
  - id: first
    xpos: 50
    ypos: 64
    length: 85

  - id: second
    same_as: first
    same_as_dypos: 11

  - id: third
    same_as: second
    same_as_dypos: 11
```

In this pattern, every item continues from the resolved result of the previous one:

```text
second = first + 11
third  = second + 11
```

| Item     | Resulting `ypos` |
| :------- | :--------------- |
| `first`  | `64`             |
| `second` | `75`             |
| `third`  | `86`             |

Chaining works well when each item naturally builds on the one before it.

## :material-horseshoe: Reusing the same base item

Instead of chaining, each reused item can refer directly to the same base item.

```yaml linenums="1"
hlines:
  - id: first
    xpos: 50
    ypos: 64
    length: 85

  - id: second
    same_as: first
    same_as_dypos: 11

  - id: third
    same_as: first
    same_as_dypos: 22
```

This pattern means:

```text
second = first + 11
third  = first + 22
```

Using one shared base item is often clearer when every copy follows a fixed spacing pattern from the same origin.

## :material-horseshoe: Combining `same_as` with `calc()`

Delta fields can also use static `calc()` expressions.

```yaml linenums="1"
hlines:
  - id: first
    xpos: 50
    ypos: 64
    length: calc(4 * 20 + 5)

  - id: second
    same_as: first
    same_as_dypos: calc(1 * 11)

  - id: third
    same_as: first
    same_as_dypos: calc(2 * 11)
```

The card resolves the calculations as follows:

| Item     | Calculation                | Result       |
| :------- | :------------------------- | :----------- |
| `first`  | `length: calc(4 * 20 + 5)` | `length: 85` |
| `second` | `64 + calc(1 * 11)`        | `ypos: 75`   |
| `third`  | `64 + calc(2 * 11)`        | `ypos: 86`   |

`calc()` is evaluated while the configuration is processed. It is static and is not reevaluated during entity updates.

See [Combining `calc()` with `same_as`](reuse-calc-same-as.md) for more detailed examples.

## :material-horseshoe: Supported sections

`same_as` can be used in layout item sections such as:

| Section      | Typical use                                                    |
| :----------- | :------------------------------------------------------------- |
| `horseshoes` | Reuse horseshoe geometry, scale settings, styling, and labels. |
| `states`     | Reuse state positions and text styles.                         |
| `texts`      | Reuse standalone or multipart labels and their styles.         |
| `names`      | Reuse name positions and text styles.                          |
| `areas`      | Reuse area definitions.                                        |
| `circles`    | Reuse circle positions, dimensions, and styles.                |
| `hlines`     | Reuse horizontal line geometry and styles.                     |
| `vlines`     | Reuse vertical line geometry and styles.                       |
| `icons`      | Reuse icon positions, sizing, and styles.                      |

The referenced item must always belong to the same section as the reused item.

## :material-horseshoe: Important rules

| Rule                                | Description                                                                      |
| :---------------------------------- | :------------------------------------------------------------------------------- |
| Same section only                   | `same_as` can only refer to an item in the same section.                         |
| Earlier items only                  | The referenced item must appear earlier in the same list.                        |
| ID-based lookup                     | `same_as` resolves an item by its `id`.                                          |
| Automatic IDs                       | When no `id` is defined, the item index is used as a string ID.                  |
| Overrides are allowed               | Fields on the reused item replace matching fields inherited from the base item.  |
| Delta fields are static             | `same_as_d...` values must resolve to finite numbers during configuration setup. |
| Runtime templates are not supported | Templates cannot be used as values for `same_as_d...` fields.                    |

## :material-horseshoe: Choosing a reuse pattern

Use direct overrides when only a few inherited fields need completely different values.

Use delta fields when the relationship between numeric values is more important than the final absolute value.

Use chained reuse when each item should continue from the previous result.

Use one shared base item when every copy follows a fixed pattern from the same origin.

The clearest configuration is usually the one that makes the intended visual relationship easiest to recognize.

## :material-horseshoe: Related documentation

* [Less YAML with Reuse](reuse-introduction.md)
* [Combining `calc()` with `same_as`](reuse-calc-same-as.md)
* [Reusable YAML Card Examples](reuse-card-examples.md)
* [Reuse Reference](reuse-reference.md)
* [Groups](../sections/groups-section.md)
