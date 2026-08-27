---
template: main.html
title: Barcode chart
description: Display entity history as a compact linear sequence of colored time bins.
tags:
  - Sparkline
  - Barcode
---

# Barcode chart

A barcode shows each time bin as a colored column. Use it when threshold changes matter more than exact vertical height.

It works well for temperature ranges, air quality, tariffs, occupancy, warnings, and other histories that can be understood from color alone.

<!-- Add a barcode chart screenshot here. -->
![Flexible Horseshoe sparkline equalizer example](../../assets/screenshots/fhs-demo-card-barcode_audio-study-voc--dark.webp)

## :material-horseshoe: Basic configuration

This example shows a color-coded temperature history for the latest 24 hours:

```yaml linenums="1"
layout:
  sparklines:
    - id: temperature-barcode
      entity_index: 0
      xpos: 50
      ypos: 50
      width: 80
      height: 20

      period:
        type: rolling_window
        rolling_window:
          duration:
            hour: 24
          bins:
            per_hour: auto
            density: medium

      sparkline:
        state_values:
          aggregate_func: avg
        show:
          chart_type: barcode
        barcode:
          column_spacing: 0.2
        color_stops:
          colors:
            0: "#1565c0"
            18: "#42a5f5"
            24: "#66bb6a"
            28: "#f9a825"
            35: "#d32f2f"
```

## :material-horseshoe: Configuration options

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `show.chart_type` | string | No | `line` | Set to `barcode` to display a linear barcode chart. |
| `show.chart_variant` | string | No | Not set | Selects how values occupy the barcode height. See [Chart variants](#chart-variants). |
| `barcode.column_spacing` | number | No | `1` | Sets the space between neighboring columns. |
| `color_stops` | mapping | No | none | Assigns colors to numeric ranges or named states. |
| `colorstops_transition` | string | No | `smooth` | Uses `hard` or `smooth` transitions between numeric color stops. |
| `bins.per_hour` | number or `auto` | No | `auto` | Chooses how much history every column represents. |
| `show.axis.x` | boolean | No | `false` | Shows the time axis below the barcode. |
| `show.labels.x` | boolean | No | `false` | Shows labels along the enabled time axis. |

!!! tip "Keep automatic bins"

    Leave `bins.per_hour` set to `auto` for normal use. FHS then fits the barcode columns to the available width and selected history period.

## :material-horseshoe: Basic barcode

```yaml linenums="1"
sparkline:
  show:
    chart_type: barcode

  barcode:
    column_spacing: 0.2

  color_stops:
    colors:
      0: "#1565c0"
      18: "#42a5f5"
      24: "#66bb6a"
      28: "#f9a825"
      35: "#d32f2f"
```

The period and bin settings determine how much history each column represents.

## :material-horseshoe: Chart variants

Choose how values should occupy the barcode height.

| `chart_variant` value | Visible result |
| --- | --- |
| Not set | Every time interval fills the complete chart height. |
| `audio` | Value bars grow above and below the horizontal center. |
| `stalactites` | Value bars grow downward from the top. |
| `stalagmites` | Value bars grow upward from the bottom. |

```yaml linenums="1"
sparkline:
  show:
    chart_type: barcode
    chart_variant: audio
```

## :material-horseshoe: Related

- [Radial barcode](radial-barcode.md)
- [Color stops](../../appearance/color-stops.md)
- [History periods and bins](sparkline-history-periods-and-bins.md)
