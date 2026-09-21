---
template: main.html
title: CSS Styling
description: Style the card container and individual layout elements with CSS and SVG properties in their `styles` sections.
tags:
  - CSS Styling
---
# CSS styling

Styling changes the fixed appearance of a card or one of its visible items. It is used for things such as text size, fill color, borders, opacity, backgrounds, and Home Assistant theme colors.

This page shows the difference between card-level and item-level styling, the most useful CSS/SVG properties, and how to keep styling consistent with the active Home Assistant theme.

## :material-horseshoe: Change the card background

Change the card background when the complete card needs to blend into or stand apart from the surrounding dashboard.

```yaml linenums="1"
type: custom:flex-horseshoe-card
styles:
  background: var(--card-background-color)  # Card or item background
```

A background image can be used in the same place:

```yaml linenums="1"
type: custom:flex-horseshoe-card
styles:
  background-image: url('/local/images/backgrounds/energy-card.png')  # Image used as the card background
  background-size: cover  # Scale the background image to cover the card
  background-position: center  # Position of the background image
```

## :material-horseshoe: Change one item

Put `styles` on the item you want to change:

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  states:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      styles:
        font-size: 2.5em  # Size of the displayed text
        font-weight: bold  # Weight of the displayed text
        fill: var(--primary-text-color)  # Fill color of this item
```
Shapes and lines commonly use `fill`, `stroke`, and `stroke-width`:

```yaml linenums="1"
layout:
  circles:
    - xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      radius: 30  # Radius of the circle
      styles:
        fill: none  # Keep the inside transparent; draw only the border
        stroke: var(--primary-color)  # Border or line color
        stroke-width: 2  # Border or line thickness
```

## :material-horseshoe: Follow the Home Assistant theme

Use Home Assistant theme variables instead of fixed colors when the card should automatically fit the active theme:

```yaml linenums="1"
layout:
  rectangles:
    - xpos: 50  # Horizontal center of the Rectangle
      ypos: 50  # Vertical center of the Rectangle
      width: 50  # Rectangle width in card coordinates
      height: 24  # Rectangle height in card coordinates
      styles:
        fill: var(--primary-text-color)  # Fill color of this item
        stroke: var(--divider-color)  # Border or line color
        background: var(--card-background-color)  # Card or item background
```
## :material-horseshoe: Change a style from a state

Use a JavaScript template only when the style must change while the card is running:

```yaml linenums="1"
entities:
  - entity: input_boolean.example  # Entity used by this example

layout:
  rectangles:
    - xpos: 50  # Horizontal center of the Rectangle
      ypos: 50  # Vertical center of the Rectangle
      width: 50  # Rectangle width in card coordinates
      height: 24  # Rectangle height in card coordinates
      entity_index: 0  # Use the first entity configured above
      # Change the fill color from the current entity state.
      styles:
        fill: |
          [[[
            return state === 'on'
              ? 'var(--primary-color)'
              : 'var(--disabled-text-color)';
          ]]]
```
See [JavaScript templates](../dynamic/javascript-templates.md).

## :material-horseshoe: Reuse the same style

Reuse a style when several items should keep exactly the same appearance without repeating the style block.

```yaml linenums="1"
constants:
  dividerStyle:
    stroke: var(--disabled-text-color)  # Border or line color
    stroke-width: 2  # Border or line thickness
    opacity: 0.7  # Transparency: 1 = fully visible, 0 = invisible

layout:
  lines:
    - orientation: horizontal  # Arrange it from left to right
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 65  # Vertical position; 50 = center of the card
      length: 80  # Length of the line
      styles: ref(dividerStyle)
```

See [Reuse](../reuse/reuse-introduction.md) for shared values and blocks.


## :material-horseshoe: Use a named gradient

Define a gradient under `layout.gradients`, then use `gradient(name)` in a normal paint style such as `fill` or `stroke`. This keeps the gradient definition separate from the item that uses it.

```yaml linenums="1"
layout:
  gradients:
    accent:
      type: linear  # Draw the color change along a straight direction
      gradientUnits: objectBoundingBox  # Interpret 0..100 coordinates inside each painted item
      x1: 0  # Start at the left side of the painted item
      y1: 0
      x2: 100  # End at the right side of the painted item
      y2: 0
      stops:
        - offset: 0  # First color at 0% of the gradient
          color: var(--primary-color)
        - offset: 100  # Second color at 100% of the gradient
          color: var(--accent-color)

  rectangles:
    - xpos: 50  # Horizontal center of the Rectangle
      ypos: 50  # Vertical center of the Rectangle
      width: 60  # Rectangle width
      height: 28  # Rectangle height
      styles:
        fill: gradient(accent)  # Use the named gradient above
```

`type: linear` changes color along a straight direction. `type: radial` changes color outward from a center point. The default is `linear`.

`gradientUnits` controls what numeric gradient coordinates mean:

- `objectBoundingBox` — the default. Numbers use percentages from `0` through `100` inside the painted item, so `50` means 50%.
- `userSpaceOnUse` — numbers use the same logical card coordinates as normal layout dimensions.

Linear gradients use `x1`, `y1`, `x2`, and `y2`. Radial gradients use `cx`, `cy`, and `r`. Percentage strings such as `"50%"` can also be used. Each `stops` entry needs an `offset`; numeric offsets run from `0` through `100`. `color` sets the stop color and `opacity` runs from `0` (transparent) to `1` (opaque), with `1` as the default.

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `layout.gradients.<name>.type` | `linear`, `radial` | No | `linear` | Uses a straight or center-outward color transition. |
| `layout.gradients.<name>.gradientUnits` | `objectBoundingBox`, `userSpaceOnUse` | No | `objectBoundingBox` | Interprets numeric coordinates as item-relative percentages or normal card coordinates. |
| `x1`, `y1` | number / percentage string | No | `0%`, `0%` | Start point of a linear gradient. |
| `x2`, `y2` | number / percentage string | No | `100%`, `0%` | End point of a linear gradient. |
| `cx`, `cy` | number / percentage string | No | `50%`, `50%` | Center point of a radial gradient. |
| `r` | number / percentage string | No | `50%` | Radius of a radial gradient. |
| `stops[].offset` | number / string | Yes | — | Position of the stop; numeric values use 0..100 percent. |
| `stops[].color` | color | No | Not set | Color at this stop. |
| `stops[].opacity` | number 0..1 | No | `1` | Opacity at this stop. |

## :material-horseshoe: Clip an item to a shape

A named clip keeps only the part of an item that falls inside the configured Rectangle, Circle, or Arc. Define the clip under `layout.clips`, then put its name in the item's `clip` field.

```yaml linenums="1"
layout:
  clips:
    top_half:
      rectangles:
        - xpos: 50  # Center the clipping Rectangle on the card
          ypos: 25
          width: 100  # Keep the full card width
          height: 50  # Keep only the upper half

  circles:
    - xpos: 50  # Circle to be clipped
      ypos: 50
      radius_percent: 30
      clip: top_half  # Only the part inside the named clip remains visible
      styles:
        fill: var(--primary-color)
```

A clip can contain `rectangles`, `circles`, and `arcs`. For an absolute shape, use normal `xpos` and `ypos`. If a clip shape should follow each item that uses it, use `dxpos` and/or `dypos` instead; those values offset the shape from that item's center.

The shape fields are the same for clips and masks:

| Shape | Fields you need | Other fields |
| --- | --- | --- |
| Rectangle | `width`, `height`, plus `xpos`/`ypos` or `dxpos`/`dypos` | `radius`, `styles` |
| Circle | `radius_percent` or legacy `radius`, plus `xpos`/`ypos` or `dxpos`/`dypos` | `styles` |
| Arc | `radius`, `arc_degrees`, `rotate`, plus `xpos`/`ypos` or `dxpos`/`dypos` | `styles` |

## :material-horseshoe: Mask an item

A mask controls visibility gradually or in shaped areas. White parts of a mask keep the item visible; black parts hide it; gray or partly transparent mask colors create partial visibility. Define the mask under `layout.masks`, then reference it with `mask` on the item.

```yaml linenums="1"
layout:
  masks:
    round_window:
      circles:
        - xpos: 50  # Center of the visible mask area
          ypos: 50
          radius_percent: 24
          styles:
            fill: white  # White keeps this part of the item visible

  rectangles:
    - xpos: 50  # Item that receives the mask
      ypos: 50
      width: 70
      height: 50
      mask: round_window  # Show only the part inside the white circle
      styles:
        fill: var(--primary-color)
```

`mask` can also be a list of names. When several masks are listed, each additional mask further limits the result. If an item has both `mask` and `clip`, the masks are applied first and the clip limits the result afterward.

Like clips, mask definitions can contain `rectangles`, `circles`, and `arcs`, and `dxpos`/`dypos` makes those shapes relative to the item that uses the mask. If `clip` or `mask` is omitted from an item, that item is not clipped or masked.

## :material-horseshoe: Fade the edge of an Arc mask

`soft_arc` creates a gradual fade at both the curved edge and the straight closing edge of an Arc. It takes its shape from the **first Arc** in a named clip. Use an item-relative Arc (`dxpos`/`dypos`) when the same fade should follow the position of every item that uses the mask.

```yaml linenums="1"
layout:
  clips:
    gauge_shape:
      arcs:
        - dxpos: 0  # Keep the Arc centered on the item that uses the mask
          dypos: 0
          radius: 38  # Radius of the fading Arc
          arc_degrees: 260  # Visible angular span
          rotate: 0  # No extra rotation

  masks:
    soft_gauge:
      soft_arc:
        clip: gauge_shape  # Use the first Arc from this clip as the fade shape
        edge:
          stops_start: 85  # Start fading near the curved outer edge
        chord:
          stops_start: 85  # Start fading near the straight closing edge

  rectangles:
    - xpos: 50  # Item that receives the Arc-shaped fade
      ypos: 50
      width: 80
      height: 80
      mask: soft_gauge  # Apply both soft Arc fades
      styles:
        fill: var(--primary-color)
```

`soft_arc.clip` is required and names the clip that supplies the Arc. Both `edge` and `chord` are required. `stops_start` is a percentage from `0` through `100`; a larger value moves the start of the fade closer to the corresponding edge. If you omit the optional `stops` list, the fade goes from fully visible to transparent. A custom `stops` list uses `offset` values from `0` through `100` and `opacity` values from `0` through `1`.

## :material-horseshoe: Common style properties

These are the SVG/CSS properties most often used to control the visible appearance of items.

| Property | Typical use |
| --- | --- |
| `fill` | Text, icons, and filled shapes |
| `stroke` | Lines and borders |
| `stroke-width` | Border or line thickness |
| `opacity` | Transparency of the complete item |
| `fill-opacity` | Fill transparency |
| `stroke-opacity` | Border or line transparency |
| `font-size` | Text size |
| `font-weight` | Text weight |
| `text-anchor` | Text alignment |
| `stroke-linecap` | Shape of line ends |

Not every property applies to every item. The relevant tool page shows the normal choices for that item.

## :material-horseshoe: Related

- [Color stops](color-stops.md)
- [Color filters](color-filters.md)
- [JavaScript templates](../dynamic/javascript-templates.md)
- [Reuse](../reuse/reuse-introduction.md)
