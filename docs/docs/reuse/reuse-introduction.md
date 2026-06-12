---
template: main.html
title: Less YAML with Reuse
description: Reduce repeated YAML with same_as, calc(), constants, and ref().
tags:
  - Reuse
  - YAML
---

# Better and Less YAML with Reuse™

Flexible Horseshoe Card layouts can grow quickly. When building larger cards myself, I often ended up with a lot of repeated YAML. Many items used the same positions, styles, colors, or layout rules, while only one or two fields changed.

That made the configuration harder to read and slower to update. A small visual change could mean editing the same value in several places.

Reuse™ was added to make that easier.

Instead of repeating full YAML blocks, you define the shared part once and reuse it wherever needed. The card expands this into a complete internal configuration before rendering. The rendered result is the same, but the external YAML stays shorter, cleaner, and easier to maintain.

For practical card examples, see [Card Examples](./reuse-card-examples.md).


## :material-horseshoe: The problem

A common layout pattern is a small group of repeated items. In this example, the card contains three horizontal lines with the same position logic, length, and style.

![](../assets/screenshots/fhs-demo-card-30a-electricity--dark.png)

Without reuse, the same values must be repeated for every line:

=== "Standard YAML"
    ```yaml linenums="1" hl_lines="2 9 16"
    hlines:
      - xpos: 50
        ypos: 64
        length: 85
        styles:
          stroke: var(--disabled-text-color)
          stroke-width: 2

      - xpos: 50
        ypos: 75 # 11 lower than previous hline
        length: 85
        styles:
          stroke: var(--disabled-text-color)
          stroke-width: 2

      - xpos: 50
        ypos: 86 # 11 lower than previous hline
        length: 85
        styles:
          stroke: var(--disabled-text-color)
          stroke-width: 2
    ```

This works, but it is not ideal while designing a card. If the length, style, starting position, or spacing changes, you have to update the same values in multiple places.

YAML anchors can reduce some duplication:

=== "YAML anchors"
    ```yaml linenums="1" hl_lines="2"
    hlines:
      - &hline_base
        xpos: 50
        ypos: 64
        length: 85
        styles:
          stroke: var(--disabled-text-color)
          stroke-width: 2

      - <<: *hline_base
        ypos: 75

      - <<: *hline_base
        ypos: 86
    ```

However, anchors are not a complete solution:

- YAML anchors cannot calculate repeated spacing.
- Anchor names must be unique across the entire YAML file.
- The syntax is harder for many users to read.
- Overriding values can cause duplicate-key warnings in the Home Assistant YAML loader.

Example duplicate-key warning:

```text
Logger: annotatedyaml.constructors
Source: util/yaml/loader.py:65

YAML file /config/lovelace/views/whatever.yaml contains duplicate key "ypos".
```

That is why the card includes its own reuse system.

## :material-horseshoe: The reuse approach

The same three lines can be written as one base line and two reused lines:

=== "With reuse"
    ```yaml linenums="1" hl_lines="2 9 16 19"
    constants:
      lineStep: 11
      defaultLineStyle:
        stroke: var(--disabled-text-color)
        stroke-width: 2

    hlines:
      - id: first
        xpos: 50
        ypos: 64
        length: 85
        styles: ref(defaultLineStyle)

      - id: second
        same_as: first
        same_as_dypos: calc(1 * lineStep)

      - id: third
        same_as: first
        same_as_dypos: calc(2 * lineStep)
    ```

This keeps the pattern easy to see:

| Item | Meaning | Result |
| :--- | :------ | :----- |
| `first` | Base line | `ypos: 64` |
| `second` | Same as `first`, 1 step lower | `ypos: 75` |
| `third` | Same as `first`, 2 steps lower | `ypos: 86` |

Internally, the card expands this into full items before rendering:

```yaml
hlines:
  - id: first
    xpos: 50
    ypos: 64
    length: 85
    styles:
      stroke: var(--disabled-text-color)
      stroke-width: 2

  - id: second
    xpos: 50
    ypos: 75
    length: 85
    styles:
      stroke: var(--disabled-text-color)
      stroke-width: 2

  - id: third
    xpos: 50
    ypos: 86
    length: 85
    styles:
      stroke: var(--disabled-text-color)
      stroke-width: 2
```

The external configuration stays compact. The internal configuration is still complete.

### Main features

| Feature | Purpose |
| :------ | :------ |
| `same_as` | Reuse an earlier item from the same section |
| `same_as_d...` | Reuse an item and add a numeric offset |
| `constants` | Define reusable static values or configuration fragments |
| `calc()` | Use static calculations in numeric fields. Required to use `constants` |
| `ref()` | Copy a value from `constants` into the configuration |

All of these are static configuration features. They are processed during card setup, not during every render.

## :material-horseshoe: Reusing items with `same_as`

`same_as` copies an earlier item from the same section.

```yaml
circles:
  - id: base
    xpos: 50
    ypos: 50
    radius: 40
    styles:
      stroke: red
      fill: none

  - id: smaller
    same_as: base
    radius: 30
    styles:
      stroke: blue
      fill: none
```

The `smaller` circle copies `xpos` and `ypos` from `base`, but overrides `radius` and `styles`.

### Automatic ids or named ids

Each item can have an explicit `id`:

```yaml
hlines:
  - id: first
    xpos: 50
    ypos: 64
    length: 85

  - id: second
    same_as: first
    ypos: 75
```

If no `id` is defined, the card automatically assigns one based on the item index:

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

`same_as: 0` and `same_as: "0"` both refer to the first item.

Automatic ids are fine for short examples. For larger card configurations, named ids are usually easier to understand.

### Delta fields

A reused item can override a field directly:

```yaml
hlines:
  - id: first
    xpos: 50
    ypos: 64
    length: 85

  - id: second
    same_as: first
    ypos: 75
```

For repeated numeric changes, a delta field is often clearer:

```yaml
hlines:
  - id: first
    xpos: 50
    ypos: 64
    length: 85

  - id: second
    same_as: first
    same_as_dypos: 11
```

A delta field uses this pattern:

```yaml
same_as_d<field>: <number>
```

The delta is added to the inherited value.

| Delta field | Target field | Meaning |
| :---------- | :----------- | :------ |
| `same_as_dxpos` | `xpos` | Add to the inherited `xpos` |
| `same_as_dypos` | `ypos` | Add to the inherited `ypos` |
| `same_as_dlength` | `length` | Add to the inherited `length` |
| `same_as_dradius` | `radius` | Add to the inherited `radius` |

The pattern is generic. You can use `same_as_d<field>` with any inherited numeric field.

Example with circles:

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

Result: `inner.radius` becomes `35`.

## :material-horseshoe: Static calculations with `calc()` and `constants`

YAML itself does not calculate values.

```yaml
xpos: 50 - 4
```

That is text, not a formula.

Use `calc()` when a numeric value should be calculated during card setup:

```yaml
icons:
  - id: left
    xpos: calc(50 - 4)
    ypos: 50

  - id: right
    xpos: calc(50 + 4)
    ypos: 50
```

This makes the intent clear: both icons are placed around the center point.

Another example, but now also using numeric `constants`:

```yaml
constants:
  centerX: 50
  lineStep: 11
layout:
  hlines:
    - id: first
      xpos: calc(centerX)
      ypos: 64
      length: calc(4 * 20 + 5)

    - id: second
      same_as: first
      same_as_dypos: calc(1 * lineStep)

    - id: third
      same_as: first
      same_as_dypos: calc(2 * lineStep)
```

Result:

| Item | Calculation | Result |
| :--- | :---------- | :----- |
| `first` | `length: calc(4 * 20 + 5)` | `length: 85` |
| `second` | `64 + calc(1 * lineStep)` | `ypos: 75` |
| `third` | `64 + calc(2 * lineStep)` | `ypos: 86` |

!!! info "Static only"
    `calc()` is evaluated once during configuration setup. It is not a JavaScript template and is not evaluated during runtime updates.

## :material-horseshoe: Constants and `ref()`

Use `constants` for shared static values or configuration fragments.

Use `ref()` to copy one of those constants into the configuration.

```yaml
constants:
  centerX: 50
  iconOffset: 4
  lineStyle:
    stroke: var(--disabled-text-color)
    stroke-width: 2

icons:
  - id: left
    xpos: calc(centerX - iconOffset)
    ypos: 50

  - id: right
    xpos: calc(centerX + iconOffset)
    ypos: 50

hlines:
  - id: divider
    xpos: ref(centerX)
    ypos: 64
    length: 85
    styles: ref(lineStyle)
```

This keeps shared values in one place.

If the center position, icon spacing, or line style changes later, you only need to update the constant.

### Chained reuse or one base item

There are two useful ways to create repeated items.

Use one base item when every item follows a fixed pattern from the same source:

```yaml
constants:
  centerX: 50
  lineStep: 11
layout:
  hlines:
    - id: first
      xpos: calc(centerX)
      ypos: 64
      length: calc(4 * 20 + 5)

    - id: second
      same_as: first
      same_as_dypos: calc(1 * lineStep)

    - id: third
      same_as: first
      same_as_dypos: calc(2 * lineStep)
```


This means:

```text
second = first + 1 step
third  = first + 2 steps
```

Use chained reuse when each item builds on the previous item:

```yaml
constants:
  centerX: 50
  lineStep: 11
layout:
  hlines:
    - id: first
      xpos: calc(centerX)
      ypos: 64
      length: calc(4 * 20 + 5)

    - id: second
      same_as: first
      same_as_dypos: calc(lineStep)

    - id: third
      same_as: second
      same_as_dypos: calc(lineStep)
```

This means:

```text
second = first + 11
third  = second + 11
```

For fixed grids or repeated spacing, reusing one base item is often clearer. For progressive changes, chained reuse can be more compact.

### Larger items: horseshoes

Reuse becomes more valuable when the repeated item is larger.

A simple line only has a few fields. A horseshoe can contain scale settings, state settings, tick marks, labels, colors, widths, minimum and maximum values, and display options.

```yaml linenums="1" hl_lines="2 16 24"
constants:
  defaultColorStops:
    0: '#49ce4b'
    50: '#fed125'
    100: '#e9343d'

horseshoes:
  - id: base
    group: base
    radius: 45
    horseshoe_scale:
      min: 0
      max: 100
      width: 6
    horseshoe_state:
      width: 8
    show:
      horseshoe: true
      ticks: true
    color_stops: ref(defaultColorStops)

  - id: power
    group: power
    same_as: base
    entity_index: 1
    color_stops: ref(powerColorStops)
    horseshoe_scale:
      min: 0
      max: 5000

  - id: temperature
    group: temperature
    same_as: base
    entity_index: 2
    color_stops: ref(temperatureColorStops)
    horseshoe_scale:
      min: -10
      max: 40
```

Only the differences are shown in the reused horseshoes. The shared visual setup stays in `base`.

!!! success "Bigger repeated blocks benefit the most"
    Reusing a three-line block saves a little YAML. Reusing a horseshoe with nested settings can save a lot of YAML and makes later changes much safer.

## :material-horseshoe: When to use reuse

Use reuse when a layout has a clear pattern:

- repeated lines, circles, icons, names, or states
- multiple horseshoes with the same visual setup
- shared styles or color stops
- fixed spacing between items
- positions calculated from a shared center point
- several values derived from one constant

Do not use reuse everywhere. For a single unique item, normal YAML is often clearer.
