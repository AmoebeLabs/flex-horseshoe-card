---
template: main.html
title: Reusing Section Parts
description: Brrrrrr.
tags:
  - Reuse
---


##:material-horseshoe: Reusing items with `same_as`

The `same_as` option lets you reuse an earlier item from the same section.

This is useful when multiple items share the same configuration, but only differ in a few fields. Instead of repeating the full configuration, define one base item and reuse it.

YAML itself does not provide this kind of item reuse. The card resolves `same_as` during config setup. Internally, every reused item becomes a complete item before rendering.

##:material-horseshoe: Basic example

```yaml
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

This means:

| Item     | Description                          |
| :------- | :----------------------------------- |
| `first`  | Full base item                       |
| `second` | Copies `first`, but overrides `ypos` |
| `third`  | Copies `first`, but overrides `ypos` |


Internally this becomes:

```yaml
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

Auto-generated ids

If no id is defined, the card assigns one automatically based on the item index.

```yaml
hlines:
  - xpos: 50
    ypos: 64
    length: 85

  - same_as: 0
    ypos: 75

  - same_as: 0
    ypos: 86
```    

This is resolved as if the config had these ids:

```yaml
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

same_as: 0 and same_as: "0" both refer to the item with id "0".

Overriding fields

A reused item can override any field from the base item.

```yaml
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

The smaller circle copies xpos and ypos from base, but changes radius and styles.

Delta fields

For numeric values, you can use delta fields.

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

Example:

```yaml
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

Result:

| Item     | Resulting `ypos` |
| :------- | :--------------- |
| `first`  | `64`             |
| `second` | `75`             |
| `third`  | `86`             |

Generic delta fields

Delta fields are generic.

This means same_as_d<field> can be used with any numeric field that exists on the reused item.
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
Another example:
```yaml
hlines:
  - id: base
    xpos: 50
    ypos: 64
    length: 85

  - id: shorter
    same_as: base
    same_as_dlength: -10
``` 
Result:
```yaml
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
Chained reuse

A reused item can itself be reused by a later item.

```yaml
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


Reusing the same base item

Instead of chaining, you can also reuse the same base item multiple times.

```yaml
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
This means:
```
second = first + 11
third  = first + 22
```

Combining same_as with calc()

Delta fields can also use static calc() expressions.
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

| Item     | Calculation                | Result       |
| :------- | :------------------------- | :----------- |
| `first`  | `length: calc(4 * 20 + 5)` | `length: 85` |
| `second` | `64 + calc(1 * 11)`        | `ypos: 75`   |
| `third`  | `64 + calc(2 * 11)`        | `ypos: 86`   |


##:material-horseshoe: Supported sections

same_as can be used in layout item sections such as:

| Section      | Example use                       |
| :----------- | :-------------------------------- |
| `horseshoes` | Reuse horseshoe settings          |
| `states`     | Reuse state text positions/styles |
| `names`      | Reuse name label positions/styles |
| `areas`      | Reuse area definitions            |
| `circles`    | Reuse circle positions/styles     |
| `hlines`     | Reuse horizontal line settings    |
| `vlines`     | Reuse vertical line settings      |
| `icons`      | Reuse icon positions/styles       |


Rules

| Rule                                      | Description                                                        |
| :---------------------------------------- | :----------------------------------------------------------------- |
| Same section only                         | `same_as` can only refer to an item in the same section.           |
| Earlier items only                        | `same_as` can only refer to an earlier item in the list.           |
| Id-based lookup                           | `same_as` refers to an item `id`.                                  |
| Auto ids                                  | If no `id` is defined, the item index is used as string id.        |
| Overrides are allowed                     | Fields on the reused item override fields from the base item.      |
| Delta fields are static                   | `same_as_d...` values must resolve to numbers during config setup. |
| Templates are not allowed in delta fields | Runtime templates are not valid for `same_as_d...`.                |


