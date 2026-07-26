---
template: main.html
title: Combining `calc()` with `same_as`
description: Reuse layout items with `same_as`, apply calculated offsets with `calc()`, and build clear repeated patterns with delta fields.
tags:
- Reuse with same_as
- YAML Calc
---

# Combining `calc()` with `same_as`

`same_as` reuses an earlier item from the same section. Combine it with `calc()` when several items share the same configuration but need calculated differences in position, size, or another numeric field.

This keeps the YAML compact while making repeated layout patterns easier to recognize and maintain.

## :material-horseshoe: Basic example

The example below defines one horizontal line and reuses it twice. Each reused line keeps the original length and style, but moves farther down the card.

```yaml linenums="1"
hlines:
  - xpos: 50
    ypos: 64
    length: calc(4 * 20 + 5)
    styles:
      - stroke: var(--disabled-text-color)

  - same_as: 0
    same_as_dypos: calc(1 * 11)

  - same_as: 0
    same_as_dypos: calc(2 * 11)
```

The card resolves the configuration as follows:

| Item | Source        | Calculation                | Result                   |
| :--- | :------------ | :------------------------- | :----------------------- |
| `0`  | Original item | `length: calc(4 * 20 + 5)` | `length: 85`, `ypos: 64` |
| `1`  | `same_as: 0`  | `ypos: 64 + calc(1 * 11)`  | `ypos: 75`               |
| `2`  | `same_as: 0`  | `ypos: 64 + calc(2 * 11)`  | `ypos: 86`               |

Internally, the resolved items are equivalent to:

```yaml linenums="1"
hlines:
  - id: "0"
    xpos: 50
    ypos: 64
    length: 85
    styles:
      - stroke: var(--disabled-text-color)

  - id: "1"
    xpos: 50
    ypos: 75
    length: 85
    styles:
      - stroke: var(--disabled-text-color)

  - id: "2"
    xpos: 50
    ypos: 86
    length: 85
    styles:
      - stroke: var(--disabled-text-color)
```

The external configuration stays short, while the resolved configuration still contains all required values.

## :material-horseshoe: Chaining `same_as`

A reused item can build on the item before it.

```yaml linenums="1"
hlines:
  - id: first
    xpos: 50
    ypos: 64
    length: calc(4 * 20 + 5)

  - id: second
    same_as: first
    same_as_dypos: 11

  - id: third
    same_as: second
    same_as_dypos: 11
```

In this pattern, every item starts from the result of the previous one:

```text
second = first + 11
third  = second + 11
```

| Item     | Resulting `ypos` |
| :------- | :--------------- |
| `first`  | `64`             |
| `second` | `75`             |
| `third`  | `86`             |

Chaining works well when each item should continue from the previous position.

## :material-horseshoe: Reusing the same base item

You can also make every reused item refer directly to the first one.

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

This pattern means:

```text
second = first + 1 step
third  = first + 2 steps
```

Using the same base item can make fixed repetition patterns easier to understand. Each offset remains relative to one shared definition rather than depending on the previous item.

## :material-horseshoe: Delta fields

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

The pattern is generic and can be used with any supported numeric field on the reused item.

For example, the inner circle below reuses the outer circle and reduces its radius by `5`:

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

## :material-horseshoe: Positioning around the center

Many card layouts are designed around the center point `50, 50`.

Using `calc()` keeps the intended offset visible in the configuration:

```yaml linenums="1"
icons:
  - id: left
    xpos: calc(50 - 4)
    ypos: 50

  - id: right
    xpos: calc(50 + 4)
    ypos: 50
```

The same positions could be written as fixed values:

```yaml linenums="1"
icons:
  - id: left
    xpos: 46
    ypos: 50

  - id: right
    xpos: 54
    ypos: 50
```

Both versions produce the same result. The calculated version makes it clearer that the two icons are positioned symmetrically around the center.

## :material-horseshoe: Important rules

| Rule                            | Description                                                                  |
| :------------------------------ | :--------------------------------------------------------------------------- |
| YAML does not calculate values  | `calc()` is provided by the card, not by YAML itself.                        |
| Static evaluation               | `calc()` is evaluated once while the configuration is processed.             |
| Runtime templates are different | Templates such as `[[[ return ... ]]]` are evaluated during runtime updates. |
| Numeric result required         | `calc()` must return a finite number.                                        |
| `same_as` reuses an item        | It inherits another item from the same section.                              |
| `same_as_d...` adds an offset   | It inherits another item and adds a numeric delta to one field.              |
| List order matters              | `same_as` can only refer to an earlier item in the same list.                |

## :material-horseshoe: Choosing a reuse pattern

Use chained `same_as` when each item should continue from the previous one.

Use the same base item when every copy follows a fixed offset pattern from one shared definition.

Both approaches reduce repeated YAML. The best choice is the one that makes the intended layout easiest to understand.
