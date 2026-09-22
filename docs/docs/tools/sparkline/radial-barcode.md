---
template: main.html
title: Radial barcode chart
description: Arrange colored sparkline time bins around a circle.
tags:
  - Sparkline
  - Radial barcode
---
# Radial barcode chart

A Radial barcode is a circular form of Sparkline history. Each time interval becomes a colored segment around an arc or circle, so time is read around the ring instead of from left to right.

This page shows how to select the Radial barcode, choose its inward/outward variant and segment shape, control the arc and spacing, apply value colors, and add a time scale around the ring.

![Flexible Horseshoe radial barcode example](../../assets/screenshots/fhs-card-study-temperature-week-radial_barcode-flower--dark.webp)

## :material-horseshoe: Show a radial barcode

Use a radial barcode when each time interval should be a separate segment arranged around an arc.

```yaml linenums="1"
entities:
  - entity: sensor.temperature  # Entity whose history is graphed

layout:
  sparklines:
    - xpos: 50  # Horizontal center of the graph
      ypos: 50  # Vertical center of the graph
      width: 80  # Graph width in card coordinates
      height: 35  # Graph height in card coordinates
      entity_index: 0  # Use the first entity configured above
      sparkline:
        show:
          chart_type: radial_barcode  # Show colored time intervals around a circle
          chart_variant: sunburst_outward  # Use the sunburst_outward variant of this chart type
          chart_viz: flower  # Draw each interval with the flower visualization

        radial_barcode:
          arc_degrees: 270  # Draw 270° of the full 360° circle
          rotate: -135  # Rotate the result by -135°
          size: 15  # Radial width used to draw the values
          line_width: 0.02  # Thickness of the graph line
          column_spacing: 0.2  # Space between neighboring time intervals

        color_stops:
          colors:
            0: "#1565c0"
            18: "#42a5f5"
            24: "#66bb6a"
            28: "#f9a825"
            35: "#d32f2f"
```
## :material-horseshoe: Choose how values grow in the ring

Set `chart_variant`:

| Variant | Result |
| --- | --- |
| `fixed` | Every segment has the same radial depth |
| `sunburst` / `sunburst_centered` | Values grow inward and outward |
| `sunburst_outward` | Values grow outward |
| `sunburst_inward` | Values grow inward |

## :material-horseshoe: Choose the segment shape

Set `chart_viz`:

| Visualization | Result |
| --- | --- |
| `bar` | Straight radial bars |
| `flower` | Rounded petal-like segments |
| `flower2` | Second flower shape |
| `rice_grain` | Rounded seed-like segments |

{{ loop_video(
  "fhs-demo-card-sparkline-radial-barcode-showcase.webm",
  "Interactive Radial Barcode showcase build with Flexible Horseshoe Card in Home Assistant",
  "A complete demonstration of the Sparkline Radial Barcode chart possibilities.",
  "fhs-card-awair-selectable--dark.png",
  "2026-08-28",
  "PT0M20S",
  "720px") }}

## :material-horseshoe: Change the ring size and spacing

Use `radial_barcode.size`, `line_width`, and `column_spacing` to change the radial depth, segment stroke, and gap between intervals.

## :material-horseshoe: Add a time scale

Add the radial time scale when the viewer needs to know where particular times sit around the arc.

```yaml linenums="1"
entities:
  - entity: sensor.temperature  # Entity whose history is graphed

layout:
  sparklines:
    - xpos: 50  # Horizontal center of the graph
      ypos: 50  # Vertical center of the graph
      width: 80  # Graph width in card coordinates
      height: 35  # Graph height in card coordinates
      entity_index: 0  # Use the first entity configured above
      sparkline:
        show:
          chart_type: radial_barcode  # Show colored time intervals around a circle
          axis:
            x: true  # Show the time axis
          tickmarks:
            x: true  # Show tick marks on the time axis
          labels:
            x: true  # Show labels on the time axis

      x_axis:
        labels:
          orientation: arc  # Follow the circular time axis instead of keeping labels horizontal
```
## :material-horseshoe: Configuration options


`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `sparkline.show.chart_type` | `radial_barcode` | Yes | `line` | Set this to `radial_barcode` to select this chart family; omitting it leaves the Sparkline as the default Line chart. |
| `sparkline.show.chart_variant` | `fixed`, `sunburst`, `sunburst_centered`, `sunburst_outward`, `sunburst_inward` | No | `fixed` appearance when omitted | `fixed` keeps every segment at full ring depth; `sunburst` and `sunburst_centered` vary depth around the ring center; `sunburst_outward` grows outward; `sunburst_inward` grows inward. |
| `sparkline.show.chart_viz` | `bar`, `flower`, `flower2`, `rice_grain` | No | `bar` | `bar` uses straight ring segments; `flower` and `flower2` use rounded petal shapes; `rice_grain` rounds both sides into a seed-like shape. |
| `sparkline.radial_barcode.arc_degrees` | number | No | `360` | Amount of the circle used by the radial barcode; values must be greater than `0` and at most `360`. |
| `sparkline.radial_barcode.rotate` | number | No | `0` | Rotates where the radial barcode starts around the circle. |
| `sparkline.radial_barcode.size` | number | No | `5` | Radial depth. |
| `sparkline.radial_barcode.line_width` | number | No | `0` | Segment stroke width. |
| `sparkline.radial_barcode.column_spacing` | number | No | `1` | Angular gap between intervals. |
| `sparkline.show.grid.x` | boolean | No | `false` | `true` shows time-grid spokes; `false` hides them. |
| `sparkline.show.axis.x` | boolean | No | `false` | `true` shows the outer time-axis arc; `false` hides it. |
| `sparkline.show.tickmarks.x` | boolean | No | `false` | `true` shows time-axis tick marks; `false` hides them. |
| `sparkline.show.labels.x` | boolean | No | `false` | `true` shows time labels; `false` hides them. |
| `x_axis.labels.orientation` | `horizontal`, `arc` | No | `horizontal` | `horizontal` keeps time labels level; `arc` makes them follow the radial time axis. |
| `sparkline.color_stops` | mapping | No | Not set | Value/state colors. |
| `period.calendar.bins.per_hour` / `period.rolling_window.bins.per_hour` | number/`auto` | No | `auto` | Controls how many angular history segments are drawn per hour; more bins preserve shorter changes. |

## :material-horseshoe: Related

- [Radial chart](radial-chart.md)
- [Barcode](barcode.md)
- [Color stops](../../appearance/color-stops.md)
- [History period](sparkline-history-periods-and-bins.md)
- [Examples](../../examples/overview.md)
