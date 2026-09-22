---
template: main.html
title: Color stops
description: Color horseshoes, shapes, text, icons, and graphs from numeric values or named states.
tags:
  - Color stops
  - Horseshoes
  - Shapes
  - Sparkline
---
# Color stops

Color stops let a visible color follow a numeric value or a named state. The same idea can be used by Horseshoes, shapes, entity tools, and Sparkline graphs, so one familiar color scale can be reused throughout a card.

This page shows how to define numeric and state-based colors, choose between fixed ranges and smooth transitions, and reuse the same color stops in several places.

## :material-horseshoe: Change color with a numeric value

Use numeric color stops when the visible color should communicate where a number sits in a range.

```yaml linenums="1"
entities:
  - entity: sensor.temperature  # Entity used by this example

layout:
  rectangles:
    - xpos: 50  # Horizontal center of the Rectangle
      ypos: 50  # Vertical center of the Rectangle
      width: 50  # Rectangle width in card coordinates
      height: 24  # Rectangle height in card coordinates
      entity_index: 0  # Use the first entity configured above
      color_stops:
        colors:
          - value: 0  # Start this color range at value 0
            color: "#42a5f5"
          - value: 20  # Start this color range at value 20
            color: "#66bb6a"
          - value: 30  # Start this color range at value 30
            color: "#f9a825"
          - value: 40  # Start this color range at value 40
            color: "#d32f2f"
```
Each value starts the next color range.

## :material-horseshoe: Change color with a named state

Use state color stops when values such as `low`, `open`, or `heating` should each have a recognizable color.

```yaml linenums="1"
entities:
  - entity: sensor.temperature  # Entity used by this example

layout:
  rectangles:
    - xpos: 50  # Horizontal center of the Rectangle
      ypos: 50  # Vertical center of the Rectangle
      width: 50  # Rectangle width in card coordinates
      height: 24  # Rectangle height in card coordinates
      entity_index: 0  # Use the first entity configured above
      color_stops:
        colors:
          - state: low  # Use this color when the state is low
            color: "#66bb6a"
            rank: 0  # Order of this named state in the visual scale
          - state: moderate  # Use this color when the state is moderate
            color: "#f9a825"
            rank: 1  # Order of this named state in the visual scale
          - state: high  # Use this color when the state is high
            color: "#d32f2f"
            rank: 2  # Order of this named state in the visual scale
```
`rank` gives ordered displays a consistent level order.

## :material-horseshoe: Use one matching color

For a shape or entity item, select the matching value color with `item_style`:

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  rectangles:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      width: 40  # Width in card coordinates
      height: 20  # Height in card coordinates

      show:
        item_style: colorstop  # Use the colorstop appearance/color mode

      color_stops:
        colors:
          0: green
          50: orange
          100: red
```
The tool page shows which paint block controls fill and/or stroke for that item.

## :material-horseshoe: Blend between colors

Use `colorstopinterpolated` when a numeric value should receive a blended color between two stops:

```yaml linenums="1"
entities:
  - entity: sensor.temperature  # Entity used by this example

layout:
  rectangles:
    - xpos: 50  # Horizontal center of the Rectangle
      ypos: 50  # Vertical center of the Rectangle
      width: 50  # Rectangle width in card coordinates
      height: 24  # Rectangle height in card coordinates
      entity_index: 0  # Use the first entity configured above
      show:
        item_style: colorstopinterpolated  # Use the colorstopinterpolated appearance/color mode

      colorstopinterpolated:
        fill: true  # Apply the selected color to the fill
        stroke: false  # Do not apply the calculated color to the stroke
```
## :material-horseshoe: Color a Horseshoe

Horseshoes support several ways of applying the same stop list:

| Horseshoe style | Visible result |
| --- | --- |
| `fixed` | One configured fixed color; color stops do not choose the active color. |
| `colorstop` | One discrete color-stop color selected for the current value. |
| `colorstopinterpolated` | One current-value color blended between neighboring stops. |
| `colorstopsegments` | Separate solid ranges positioned by their configured values. |
| `autominmax` | One current-value color interpolated between the automatic minimum and maximum endpoint colors. |
| `minmaxgradient` | A gradient across the active progress between the endpoint colors of its active range. |
| `lineargradient` | All applicable configured colors distributed evenly across the active progress. |
| `colorstopgradient` | A continuous gradient whose colors follow their configured values and scale positions. |

See [Horseshoe](../tools/horseshoe/horseshoe-overview.md) for the Horseshoe example.

## :material-horseshoe: Add space between segments

Segmented colors normally touch each other. If adjacent ranges visually run together, use `gap` to put a clear break between them; `0` leaves them touching and larger positive values add more space.

```yaml linenums="1"
entities:
  - entity: sensor.example  # Entity displayed by this Horseshoe

layout:
  horseshoes:
    - entity_index: 0  # Use the first entity configured above
      horseshoe_scale: {}  # Required scale block; uses the default 0–100 linear scale
      xpos: 50  # Horizontal center of the Horseshoe
      ypos: 50  # Vertical center of the Horseshoe
      show:
        horseshoe_style: colorstopsegments  # Draw the configured color ranges as separate segments
      color_stops:
        gap: 2  # Space between the colored segments
        colors:
          - value: 0  # Start this color range at value 0
            color: green  # Color used for this value or state
          - value: 50  # Start this color range at value 50
            color: orange  # Color used for this value or state
          - value: 100  # Start this color range at value 100
            color: red  # Color used for this value or state
```
## :material-horseshoe: Use different colors in light and dark mode

Use mode-specific colors when one palette does not remain readable against both Home Assistant light and dark themes.

```yaml linenums="1"
entities:
  - entity: sensor.temperature  # Entity used by this example

layout:
  rectangles:
    - xpos: 50  # Horizontal center of the Rectangle
      ypos: 50  # Vertical center of the Rectangle
      width: 50  # Rectangle width in card coordinates
      height: 24  # Rectangle height in card coordinates
      entity_index: 0  # Use the first entity configured above
      # Use different colors for Home Assistant light and dark mode.
      color_stops:
        modes:
          light:
            0: green  # Light-mode color at the low end
            100: red  # Light-mode color at the high end
          dark:
            0: "#4ade80"  # Dark-mode color at the low end
            100: "#f87171"  # Dark-mode color at the high end
```

Put the stop list directly under `modes.light` and `modes.dark`. Do not add another `colors:` level inside those mode blocks. If the active mode has no entry, the normal `color_stops.colors` list is used instead.
## :material-horseshoe: Supply a default numeric scale

Add `scales.default.min` and `scales.default.max` when the color definition should also provide its numeric range. A Horseshoe uses this range as the default for omitted `horseshoe_scale.min`/`max`; explicit Horseshoe scale values still win. Real-time Bar and Equalizer Sparklines can also use this range for their current-value scale.

```yaml linenums="1"
entities:
  - entity: sensor.temperature  # Entity whose value uses this color scale

layout:
  horseshoes:
    - entity_index: 0  # Use the first entity configured above
      horseshoe_scale: {}  # Use the default min/max supplied by color_stops
      color_stops:
        scales:
          default:
            min: 0  # Low end of the shared numeric scale
            max: 40  # High end of the shared numeric scale
        colors:
          0: "#42a5f5"
          20: "#66bb6a"
          40: "#d32f2f"
```

## :material-horseshoe: Accepted color-list forms

The explicit `colors:` list used elsewhere on this page can carry extra fields such as `state`, `rank`, and `label`. For simple numeric stops, the card also accepts a compact mapping such as `colors: {0: blue, 20: green, 40: red}` or a top-level compact `color_stops` mapping. These forms produce the same ordered numeric stops; use the explicit list when each stop needs extra metadata.

## :material-horseshoe: Reuse the same color stops

Store the definition as a color-stop template:

```yaml linenums="1"
fhs_user_templates:
  templates:
    temperature_colors:
      template:
        type: color_stops
      color_stops:
        colors:
          - value: 0  # Start this color range at value 0
            color: "#42a5f5"
          - value: 20  # Start this color range at value 20
            color: "#66bb6a"
          - value: 30  # Start this color range at value 30
            color: "#f9a825"
          - value: 40  # Start this color range at value 40
            color: "#d32f2f"
```

Use it where the same scale is needed:

```yaml linenums="1"
entities:
  - entity: sensor.temperature  # Entity used by this example

layout:
  rectangles:
    - xpos: 50  # Horizontal center of the Rectangle
      ypos: 50  # Vertical center of the Rectangle
      width: 50  # Rectangle width in card coordinates
      height: 24  # Rectangle height in card coordinates
      entity_index: 0  # Use the first entity configured above
      color_stops:
        template:
          name: temperature_colors  # Name used for this template or supplied value
```
## :material-horseshoe: Related

- [Horseshoe](../tools/horseshoe/horseshoe-overview.md)
- [Shapes](../tools/shapes/shapes-overview.md)
- [Sparkline graphs](../tools/sparkline/sparkline-overview.md)
- [Palettes](palettes.md)
