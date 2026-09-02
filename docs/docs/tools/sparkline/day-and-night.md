---
template: main.html
title: Day and night
description: Show daylight and nighttime behind a sparkline using the sun times from Home Assistant.
tags:
  - Sparkline
  - Day and night
  - Sun
---

# Day and night

A day-and-night layer shows when the sun is above or below the horizon. It makes daily patterns easier to recognize in values such as temperature, power, light level, or humidity.

The layer uses the `sun.sun` entity from Home Assistant. It follows the selected sparkline period and works with Cartesian charts, radial charts, and radial barcodes.

<!-- Add a day-and-night sparkline screenshot here. -->

## :material-horseshoe: Basic configuration

Enable the layer in `sparkline.show` and choose the appearance of day and night:

```yaml linenums="1"
sparkline:
  show:
    chart_type: area
    day_night: true

  day_night:
    day:
      styles:
        - fill: rgba(255, 214, 64, 0.12)

    night:
      styles:
        - fill: rgba(0, 0, 0, 0.25)
```

This fills the graph background. The graph, grid, axes, tick marks, and labels remain visible above it.

## :material-horseshoe: Show a separate band

A band keeps the day and night colors separate from the graph values. On a normal graph it becomes a strip at the top or bottom of the graph. On a radial chart or radial barcode it becomes a separate ring inside the graph.

```yaml linenums="1"
sparkline:
  show:
    day_night: true

  day_night:
    mode: band
    position: bottom
    size: 4
    offset: -1

    day:
      styles:
        - fill: rgba(255, 214, 64, 0.7)

    night:
      styles:
        - fill: rgba(0, 0, 0, 0.7)
```

The band stays inside the existing graph area. It does not make the complete sparkline larger or reserve additional space around the axes.

## :material-horseshoe: Configuration options

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `show.day_night` | boolean | No | `false` | Shows the day-and-night layer. |
| `day_night.mode` | string | No | `background` | Use `background` to color the graph area or `band` for a separate strip or ring. |
| `day_night.position` | string | No | `bottom` | Places a Cartesian band at the `top` or `bottom`. |
| `day_night.size` | number | No | `4` | Sets the width of a band or radial ring. |
| `day_night.offset` | number | No | `0` | Moves a band or ring outward with a positive value or inward with a negative value. |
| `day_night.day.styles` | styles | No | transparent | Styles the daylight periods. |
| `day_night.night.styles` | styles | No | theme divider color | Styles the nighttime periods. |

## :material-horseshoe: Choose a period

Use a `calendar` period to show complete days, including today's expected sunrise and sunset:

```yaml linenums="1"
period:
  type: calendar
  calendar:
    duration:
      hour: 24

sparkline:
  show:
    day_night: true
```

A `rolling_window` shows the recorded day and night periods within the moving time window.

## :material-horseshoe: Related

- [History periods and bins](sparkline-history-periods-and-bins.md)
- [Axes and grid](axes-and-grid.md)
- [Radial chart](radial-chart.md)
- [Radial barcode](radial-barcode.md)
- [Styling](../../appearance/styling.md)
