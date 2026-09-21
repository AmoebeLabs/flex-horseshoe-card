---
template: main.html
title: Reuse™ Reference
description: Reference the processing order, supported sections, syntax, and constraints for `same_as`, `calc()`, constants, and `ref()`.
tags:
- Reuse
- Reference
---
# Reuse™ reference

The Reuse reference contains the exact syntax behind reuse features. It covers `same_as`, delta fields, replacement rules, `constants`, `ref()`, and `calc()` after you have already decided which technique you need.

This page explains those settings precisely and links back to the Reuse overview and complete examples for the functional starting points.

## :material-horseshoe: Choose the setting

Start with the result you want, then use the corresponding reuse setting shown here.

| You want to... | Use |
| --- | --- |
| Start another item from the same configuration | `same_as` |
| Move/resize/change entity by a relative amount | `same_as_d...` |
| Replace a copied nested list or block | `same_as_replace` |
| Reuse a fixed number/style/configuration block | `constants` with `ref()` |
| Calculate a position, size, or spacing | `calc()` |

## :material-horseshoe: Reuse another item with `same_as`

Use `same_as` to start another visible item from the same configuration and then change only the settings that differ.

```yaml linenums="1"
layout:
  rectangles:
    - id: first  # Name this item so it can be referenced later
      xpos: 25  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      width: 30  # Width in card coordinates
      height: 20  # Height in card coordinates

    - id: second  # Name this item so it can be referenced later
      same_as: first  # Start with the settings from first
      xpos: 75  # Horizontal position; 50 = center of the card
```

`same_as` can only refer to an item that appears earlier in the same layout section. Every item receives an ID. If you omit `id`, the card uses that item's zero-based position in its own section as a text ID: `"0"`, `"1"`, `"2"`, and so on. Numbering starts again in each layout section. When you set `id` yourself, use that name instead.

## :material-horseshoe: Change a reused numeric value by an offset

Use `same_as_d<field>` when a reused item should add a numeric offset to a value it inherits. The target field must already exist on the reused item, and only numeric fields supported by that tool can be changed this way.

For example, `same_as_dxpos` adds to the inherited `xpos`, `same_as_dwidth` adds to `width`, and `same_as_dentity_index` adds to the inherited numeric entity index. The offset can be a number, `ref(...)`, or `calc(...)`.

```yaml linenums="1"
layout:
  rectangles:
    - id: panel
      xpos: 30  # Horizontal position of the first Rectangle
      ypos: 50  # Vertical position of the first Rectangle
      width: 24  # Width inherited by the second Rectangle
      height: 18  # Height inherited by the second Rectangle

    - same_as: panel  # Start with all settings from panel
      same_as_dxpos: 40  # 30 + 40 = xpos 70
      same_as_dwidth: 6  # 24 + 6 = width 30
```

The exact `same_as_d<field>` names depend on the tool. A field that is not numeric for that tool cannot be changed with a delta.

## :material-horseshoe: Replace a copied nested block

Use `same_as_replace` when a copied field must be replaced instead of combined with the inherited field. Each entry can be a top-level field such as `color_stops` or a nested path such as `color_stops.colors`.

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example
  - entity: sensor.example_2  # Entity used by this example

layout:
  horseshoes:
    - id: temperature  # Name this item so it can be referenced later
      entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      horseshoe_scale: {}  # Required scale block; uses the default 0–100 linear scale
      xpos: 35  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      radius: 20  # Distance from the center to the Horseshoe path
      color_stops:
        colors:
          0: "#42a5f5"
          25: "#ef5350"

    - id: humidity  # Name this item so it can be referenced later
      entity_index: 1  # Use entity 1 from entities: (0 = first entity)
      same_as: temperature  # Start with the settings from temperature
      same_as_replace:
        - color_stops.colors  # Replace only the inherited colors list
      color_stops:
        colors:
          0: "#66bb6a"
          70: "#ffca28"
```

Because only `color_stops.colors` is replaced, other inherited `color_stops` settings remain in place.

## :material-horseshoe: Reuse a value or block with `constants` and `ref()`

Use a constant when the same value or configuration block is needed in several places and should be changed from one definition.

```yaml linenums="1"
constants:
  lineStyle:
    stroke: var(--disabled-text-color)  # Border or line color
    stroke-width: 2  # Border or line thickness

layout:
  lines:
    - orientation: horizontal  # Arrange it from left to right
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 64  # Vertical position; 50 = center of the card
      length: 85  # Length of the line
      styles: ref(lineStyle)
```

Constant names must start with a letter or underscore and can then contain letters, numbers, and underscores. Do not put dots in a constant name.

`ref()` can insert a single value, a list, or a complete configuration block. Use dot notation to select a value inside a nested constant, for example `ref(theme.warning.stroke)`. Dot notation selects named properties; it does not use array indexes such as `[0]`. Each inserted list/object is copied, so changing an inherited block elsewhere does not change the constant itself.

## :material-horseshoe: Calculate a value with `calc()`

Use `calc()` when a configuration value can be derived from another reusable value instead of being repeated manually.

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

constants:
  centerX: 50
  gap: 4  # Space between these visible parts

layout:
  states:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: calc(centerX - gap)  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
```
`calc()` must produce one finite number. It can use numeric constants and numeric values inside nested constant objects. A constant calculated with `calc()` can use numeric constants declared earlier in the `constants:` block. Strings, booleans, and lists are not available inside `calc()`.

Supported operators are `+`, `-`, `*`, `/`, `**`, and parentheses. Supported functions/constants are `sin()`, `cos()`, `tan()`, `abs()`, `round()`, `floor()`, `ceil()`, `min()`, `max()`, `sqrt()`, and `PI`.

## :material-horseshoe: Related documentation

- [Reuse overview](reuse-introduction.md)
- [Reusable YAML card examples](reuse-card-examples.md)
- [Card templates](../card-templates/card-templates-overview.md)
