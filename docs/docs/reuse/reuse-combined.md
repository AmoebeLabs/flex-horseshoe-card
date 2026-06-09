---
template: main.html
title: Combining Calc with same_as
description: Combine
tags:
  - reuse with same_as
  - YAML Calc
---

##:material-horseshoe: Combining calc() with same_as

`same_as` can be used to reuse another item in the same section.

This is useful when multiple items share most of their configuration, but only differ in one or two values.

```yaml
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

This means:

| Item | Source        | Calculation                | Result                   |
| :--- | :------------ | :------------------------- | :----------------------- |
| `0`  | original item | `length: calc(4 * 20 + 5)` | `length: 85`, `ypos: 64` |
| `1`  | `same_as: 0`  | `ypos: 64 + calc(1 * 11)`  | `ypos: 75`               |
| `2`  | `same_as: 0`  | `ypos: 64 + calc(2 * 11)`  | `ypos: 86`               |

Internally this becomes:
```yaml
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

So the external configuration stays short, while the internal configuration becomes complete.

Reuse with chained `same_as`

You can also build on the previous item.


```yaml
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

This means:
```
second = first + 11
third  = second + 11
```

Result:

| Item     | Resulting `ypos` |
| :------- | :--------------- |
| `first`  | `64`             |
| `second` | `75`             |
| `third`  | `86`             |

Reuse from the same base item

Instead of chaining, you can also reuse the first item directly.

```yaml
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

This means:
second = first + 1 step
third  = first + 2 steps

This can be clearer when all items follow a fixed pattern from the same base item.

##:material-horseshoe: Delta fields

Delta fields use this pattern:

```yaml
same_as_d<field>: <number>
```

The delta is added to the inherited value.

| Delta field       | Target field | Meaning                   |
| :---------------- | :----------- | :------------------------ |
| `same_as_dxpos`   | `xpos`       | Add to inherited `xpos`   |
| `same_as_dypos`   | `ypos`       | Add to inherited `ypos`   |
| `same_as_dlength` | `length`     | Add to inherited `length` |
| `same_as_dradius` | `radius`     | Add to inherited `radius` |

Because this pattern is generic, it can work for any numeric field on the reused item.

Example:

```yaml
circles:
  - id: outer
    xpos: 50
    ypos: 50
    radius: 40

  - id: inner
    same_as: outer
    same_as_dradius: -5
```
Result:

```yaml
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

### Positioning around the center

Many card layouts are designed around the center point 50,50.

With calc(), offsets from the center can stay visible in the configuration.

```yaml
icons:
  - id: left
    xpos: calc(50 - 4)
    ypos: 50

  - id: right
    xpos: calc(50 + 4)
    ypos: 50
```
This is easier to understand than:

```yaml
icons:
  - id: left
    xpos: 46
    ypos: 50

  - id: right
    xpos: 54
    ypos: 50
```
The calculated values are the same, but the intent is clearer.

Notes

| Rule                            | Description                                                               |
| :------------------------------ | :------------------------------------------------------------------------ |
| YAML does not calculate values  | `calc()` is added by the card, not by YAML itself.                        |
| Static only                     | `calc()` is evaluated once during config setup.                           |
| Runtime templates are different | Templates like `[[[ return ... ]]]` are evaluated during runtime updates. |
| Numeric result required         | `calc()` must return a finite number.                                     |
| `same_as` is reuse              | It copies another item from the same section.                             |
| `same_as_d...` is offset reuse  | It copies another item and adds a numeric delta to one field.             |
| List order matters              | `same_as` can only refer to an earlier item in the same list.             |

