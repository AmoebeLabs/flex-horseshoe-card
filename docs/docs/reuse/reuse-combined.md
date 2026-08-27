---
template: main.html
title: Combining `calc()` with `same_as`
description: Reuse layout items with `same_as`, apply calculated offsets with `calc()`, and build clear repeated patterns with delta fields.
tags:
- Reuse with same_as
- YAML Calc
---

# Combining `calc()` with `same_as`

Use this pattern when a card needs a regular row, column, ring, or repeated group of items. `same_as` keeps the shared design in one place; `calc()` keeps the distance, size, or position relationship readable.

## :material-horseshoe: Basic example

The example below creates three matching dividers with a clear vertical step.

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

The three dividers appear at these positions:

| Item | Source        | Calculation                | Result                   |
| :--- | :------------ | :------------------------- | :----------------------- |
| `0`  | Original item | `length: calc(4 * 20 + 5)` | `length: 85`, `ypos: 64` |
| `1`  | `same_as: 0`  | `ypos: 64 + calc(1 * 11)`  | `ypos: 75`               |
| `2`  | `same_as: 0`  | `ypos: 64 + calc(2 * 11)`  | `ypos: 86`               |

The expanded configuration is equivalent to:

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

The reusable form keeps the card YAML short while showing the intended spacing.

## :material-horseshoe: Continue from the previous item

Use this for a sequence where every next item starts one step after the previous item.

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

Each item continues the row from the item before it:

```text
second = first + 11
third  = second + 11
```

| Item     | Resulting `ypos` |
| :------- | :--------------- |
| `first`  | `64`             |
| `second` | `75`             |
| `third`  | `86`             |

This works well when the sequence should grow one item at a time.

## :material-horseshoe: Keep every offset relative to one base item

Use this when every copy should keep a fixed relationship to the first item.

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

The offsets are all measured from `first`:

```text
second = first + 1 step
third  = first + 2 steps
```

This makes fixed repetition patterns easy to adjust because every offset remains relative to the same base item.

## :material-horseshoe: Change one value by a fixed amount

Delta fields follow this pattern:

```yaml linenums="1"
same_as_d<field>: <number>
```

Use a delta field when the reused item needs a relative difference rather than a completely new value.

| Delta field       | Target field | Meaning                         |
| :---------------- | :----------- | :------------------------------ |
| `same_as_dxpos`   | `xpos`       | Adds to the inherited `xpos`.   |
| `same_as_dypos`   | `ypos`       | Adds to the inherited `ypos`.   |
| `same_as_dlength` | `length`     | Adds to the inherited `length`. |
| `same_as_dradius` | `radius`     | Adds to the inherited `radius`. |

The pattern also works with another numeric field when that is the part of the item you want to change.

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

The resulting pair is equivalent to:

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

## :material-horseshoe: Keep positions related to the center

Many card layouts are designed around the center point `50, 50`.

Use `calc()` so the intended offset remains visible in the configuration:

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

Both versions show the same positions. The calculated version keeps the symmetric relationship visible when the layout changes.

## :material-horseshoe: Keep repeated layouts predictable

| Rule | What to do |
| :--- | :--------- |
| Use numbers in `calc()` | Use it for a position, size, length, radius, or another numeric setting. |
| Use `same_as` after its base item | Put the shared base item earlier in the same tool list. |
| Use `same_as_d...` for relative changes | Keep repeated spacing and dimensions clear. |
| Use JavaScript templates for changing entity values | Use `calc()` only for fixed card relationships. |

## :material-horseshoe: Choose the clearer repetition pattern

Use chained `same_as` when each item should continue from the previous one.

Use the same base item when every copy follows a fixed offset pattern from one shared definition.

Both approaches reduce repeated YAML. Use the one that makes the intended layout easiest to recognize when you read the card later.
