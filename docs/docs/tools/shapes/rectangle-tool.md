---
template: main.html
title: Rectangle
description: Add fixed or automatically fitted rectangles to a Flexible Horseshoe Card.
tags:
  - Rectangle
  - Card tools
---
# Rectangle

A Rectangle adds a four-sided visual element to a card. You can use it as a background, border, panel, highlight, or box around another item.

You can set its position and size yourself, let it automatically fit around another item, or reuse an existing Rectangle. After that, you can round the corners, change the fill and border, color it from an entity, and control when it is visible.

This page shows each of those ways of using a Rectangle and explains the options that change its visible result.

## :material-horseshoe: Add a Rectangle

Set `xpos`, `ypos`, `width`, and `height` when you want to position and size the Rectangle yourself.

```yaml linenums="1"
layout:
  rectangles:
    - xpos: 50  # Horizontal center; 50 = center of the card
      ypos: 50  # Vertical center; 50 = center of the card
      width: 60  # Rectangle width in card coordinates
      height: 30  # Rectangle height in card coordinates
      radius: 4  # Round each corner by 4 units
      styles:
        fill: var(--card-background-color)  # Color inside the Rectangle
        stroke: var(--divider-color)  # Border color
        stroke-width: 1  # Border thickness
```

`xpos` and `ypos` position the center of the Rectangle. `width` and `height` set its size. `radius` rounds the corners.

## :material-horseshoe: Fit around another item

A fixed width works well when the content inside a Rectangle never changes size. But a state, name, or area can become wider or narrower when its value, formatting, font, or language changes.

Use `fit` when you want the Rectangle to keep following that item automatically. You then do **not** set `xpos`, `ypos`, `width`, or `height` for the Rectangle: the card gets all four from the referenced item.

The item being fitted needs an `id`:

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  states:
    - id: current-value  # Give the State an ID so the Rectangle can find it
      entity_index: 0  # Show the first entity configured on the card
      xpos: 50  # Position of the State that the Rectangle will follow
      ypos: 50

  rectangles:
    - fit:
        section: states  # Look for the referenced item in layout.states
        item_id: current-value  # Follow this State's measured position and size
        padding:
          x: 2  # Add 2 units of space on both the left and right
          y: 1  # Add 1 unit of space above and below
      radius: 3  # Round the fitted Rectangle corners
      styles:
        fill: none  # No fill; show only the border
        stroke: var(--divider-color)  # Border color
        stroke-width: 1  # Border thickness
```
The Rectangle now grows, shrinks, and moves with `current-value`. The padding only adds extra space around the measured item.

## :material-horseshoe: Change the fill and border

A Rectangle can have a fill, a border, or both. In YAML, the border uses the SVG style names `stroke` and `stroke-width`.

```yaml linenums="1"
layout:
  rectangles:
    - xpos: 50
      ypos: 50
      width: 60
      height: 30
      radius: 4
      styles:
        fill: var(--card-background-color)  # Color inside the Rectangle
        stroke: var(--primary-color)  # Border color
        stroke-width: 2  # Border thickness
```

Set `fill: none` when you only want the border.

## :material-horseshoe: Prevent the fill and border from visually overlapping

A Rectangle with both a fill and a border can show an unwanted darker edge. This becomes especially noticeable when you use `fill-opacity`, `stroke-opacity`, or a thick border.

The reason is simple: the border is drawn on the Rectangle edge, so part of it lies inside the Rectangle. If the fill continues underneath that inside part, the fill and border are drawn on top of each other. With opacity, that overlap can look darker or heavier than the rest of the border.

For example, this deliberately allows the overlap:

```yaml linenums="1"
layout:
  rectangles:
    - xpos: 50
      ypos: 50
      width: 60
      height: 30
      styles:
        fill: var(--primary-color)  # Use the Home Assistant theme color for the fill
        fill-opacity: 0.25  # Make the fill partly transparent
        stroke: var(--primary-color)  # Use the same theme color for the border
        stroke-opacity: 0.5  # Make the border partly transparent
        stroke-width: 4  # A thick border makes the overlap easy to see

      fill_mask: 0  # Let the fill continue underneath the inside part of the border
```

Use `fill_mask` to control where the fill stops. The default is `auto`:

```yaml linenums="1"
layout:
  rectangles:
    - xpos: 50  # Horizontal center of the Rectangle
      ypos: 50  # Vertical center of the Rectangle
      width: 60  # Rectangle width
      height: 30  # Rectangle height
      styles:
        fill: var(--primary-color)  # Fill color
        fill-opacity: 0.25  # Make overlap with the border visible
        stroke: var(--primary-color)  # Border color
        stroke-opacity: 0.5  # Make the border partly transparent
        stroke-width: 4  # Border thickness used by this example
      fill_mask: auto  # Stop the fill at the inside edge of the border
```
With `stroke-width: 4`, half of the border lies inside the Rectangle. `auto` therefore uses `2`, so the fill stops exactly where the inside edge of the border begins. The fill and border no longer overlap visually.

You can also set the distance yourself:

```yaml linenums="1"
layout:
  rectangles:
    - xpos: 50  # Horizontal center of the Rectangle
      ypos: 50  # Vertical center of the Rectangle
      width: 60  # Rectangle width
      height: 30  # Rectangle height
      styles:
        fill: var(--primary-color)  # Fill color
        fill-opacity: 0.25  # Make overlap with the border visible
        stroke: var(--primary-color)  # Border color
        stroke-opacity: 0.5  # Make the border partly transparent
        stroke-width: 4  # Border thickness used by this example
      fill_mask: 4  # Stop the fill 4 units inward from the Rectangle edge
```
For a border with `stroke-width: 4`:

- `fill_mask: 0` lets the fill continue underneath the inside half of the border;
- `fill_mask: auto` uses `2`, so the fill stops at the inside edge of the border;
- `fill_mask: 4` moves the fill edge another 2 units inward and creates visible space between the fill and border.

Larger values move the edge of the fill farther inward. Negative values are not supported.

You normally do not need to change `fill_mask` when the default result already looks right. It is mainly useful when opacity or a thick border makes the overlap visible, or when you deliberately want space between the fill and the border.

## :material-horseshoe: Change color with an entity value

Use `entity_index` and color stops when the Rectangle should change color with an entity value.

```yaml linenums="1"
entities:
  - entity: sensor.cpu_usage  # Home Assistant entity used for the Rectangle color

layout:
  rectangles:
    - entity_index: 0  # Use the first entity configured above
      xpos: 50
      ypos: 50
      width: 40
      height: 20
      radius: 3

      color_stops:
        colors:
          0: green  # Low values start green
          50: orange  # Mid-range values move toward orange
          100: red  # High values end red

      show:
        item_style: colorstopinterpolated  # Blend between the configured colors

      colorstopinterpolated:
        fill: true  # Apply the calculated color to the fill
        stroke: false  # Keep the border color unchanged
```

## :material-horseshoe: Reuse a Rectangle

Use `same_as` when several Rectangles should start with the same configuration. You only need to specify what changes in the reused Rectangle.

```yaml linenums="1"
layout:
  rectangles:
    - id: panel  # Give the Rectangle an ID so it can be reused
      xpos: 25
      ypos: 50
      width: 35
      height: 30
      radius: 4
      styles:
        fill: var(--card-background-color)
        stroke: var(--divider-color)

    - same_as: panel  # Reuse all settings from panel
      xpos: 75  # Override only the horizontal position
```

See [Reuse](../../reuse/reuse-introduction.md) for changing selected parts of a reused item.

## :material-horseshoe: Show or hide the Rectangle

Use `visibility` when the Rectangle is only relevant in a particular state. For example, a background panel can appear only while heating is active.

```yaml linenums="1"
entities:
  - entity: sensor.heating_state  # Entity that decides whether the Rectangle is shown

layout:
  rectangles:
    - entity_index: 0  # Use the first entity configured above
      xpos: 50
      ypos: 50
      width: 40
      height: 20
      radius: 3
      styles:
        fill: var(--primary-color)

      # Show the Rectangle only while the entity state is "heating".
      visibility: |
        [[[
          return state === 'heating' ? 'visible' : 'hidden';
        ]]]
```

See [Visibility](../../interaction/visibility.md) for more conditions.

## :material-horseshoe: Disable the Rectangle

Use `disabled` when a Rectangle is part of a reusable configuration but should not be created for one particular use of that configuration.

## :material-horseshoe: Configuration reference

The required fields depend on **how you create the Rectangle**. The tables below keep those methods separate so `Required` always means exactly `Yes` or `No` within that method.

### Set the position and size yourself

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `xpos` | number | Yes | — | Horizontal center position. |
| `ypos` | number | Yes | — | Vertical center position. |
| `width` | number / item reference | Yes | — | Rectangle width. |
| `height` | number / item reference | Yes | — | Rectangle height. |

### Fit around another item

When you use `fit`, `xpos`, `ypos`, `width`, and `height` are obtained from the referenced item and are not configured on the Rectangle itself.

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `fit` | mapping | Yes | — | Gets the Rectangle position and size from another item. |
| `fit.section` | string | Yes | — | Section containing the item, such as `states`, `names`, or `areas`. |
| `fit.item_id` | string | Yes | — | `id` of the item to fit around. |
| `fit.padding.x` | number | No | `1.5` | Extra space on the left and right. |
| `fit.padding.y` | number | No | `0.5` | Extra space above and below. |

### Reuse another Rectangle

When you use `same_as`, the reused Rectangle supplies its existing configuration. Only the settings you want to change need to be added.

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `same_as` | string | Yes | — | `id` of the Rectangle to reuse. |

### Options for every Rectangle

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `id` | string | No | List position as text | Gives the Rectangle a name that can be referenced by supported features such as `same_as`. If omitted, the card uses the Rectangle's zero-based position in `layout.rectangles` as a text ID: `"0"`, `"1"`, `"2"`, and so on. |
| `radius` | number / mapping | No | `0` | Rounds all or selected corners. `0` keeps square corners. |
| `fill_mask` | `auto` / number ≥ 0 | No | `auto` | Controls where the fill stops relative to the border. `auto` stops it at the inside edge of the border. Larger values move it farther inward. |
| `entity_index` | entity index | No | Not set | Selects the entity used by value- or state-dependent behavior. |
| `styles` | mapping | No | Default Rectangle style | Sets the fill, border, opacity, and other SVG/CSS appearance. |
| `color_stops` | mapping | No | Not set | Changes Rectangle colors from an entity value or state. |
| `visibility` | `visible`, `hidden`, or template | No | `visible` | `visible` renders the Rectangle; `hidden` keeps it out of view. A template can return either value dynamically. |
| `disabled` | boolean / template | No | `false` | Prevents the Rectangle from being created when true. |

## :material-horseshoe: Related

- [Shapes](shapes-overview.md)
- [Color stops](../../appearance/color-stops.md)
- [Visibility](../../interaction/visibility.md)
- [Reuse](../../reuse/reuse-introduction.md)
