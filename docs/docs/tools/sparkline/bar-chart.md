---
template: main.html
title: Bar chart
description: Display every sparkline time bin as a vertical bar.
tags:
  - Sparkline
  - Bar chart
---

# Bar chart

A bar chart shows every time bin as a separate vertical bar. Positive and negative values extend from the zero line in opposite directions.

Use it for hourly energy, rainfall, production, counts, or another history where individual intervals should remain visually distinct.

<!-- Add a bar chart screenshot here. -->
![Flexible Horseshoe sparkline equalizer example](../../assets/screenshots/fhs-demo-card-bars-study-co2--dark.webp)

## :material-horseshoe: Basic configuration

This example shows one average value for every hour in the latest day:

```yaml linenums="1"
layout:
  sparklines:
    - id: hourly-values
      entity_index: 0
      xpos: 50
      ypos: 50
      width: 80
      height: 35

      period:
        type: rolling_window
        rolling_window:
          duration:
            hour: 24
          bins:
            per_hour: 1

      sparkline:
        state_values:
          aggregate_func: avg
        show:
          chart_type: bar
        bar:
          column_spacing: 0.5
```

## :material-horseshoe: Configuration options

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `show.chart_type` | string | No | `line` | Set to `bar` to display a bar chart. |
| `show.fill` | string | No | solid | Uses a solid fill or a separate `fade` for every bar. |
| `bar.column_spacing` | number | No | `1` | Sets the space between neighboring bars. |
| `state_values.aggregate_func` | string | No | `avg` | Chooses the value represented by each bar. |
| `bins.per_hour` | number or `auto` | No | `auto` | Chooses how many bars can appear within each hour. |
| `series[].color` | color | No | automatic palette | Gives each series a recognizable fixed color. |

!!! tip "Keep automatic bins"

    Leave `bins.per_hour` set to `auto` for normal use. Flexible Horseshoe Card then chooses a suitable bar interval automatically. Set a number only when you deliberately need a fixed number of bars per hour.

## :material-horseshoe: Basic bar chart

```yaml linenums="1"
sparkline:
  show:
    chart_type: bar

  bar:
    column_spacing: 0.5
```

## :material-horseshoe: Fade each bar

```yaml linenums="1"
sparkline:
  show:
    chart_type: bar
    fill: fade
```

The fade follows the length and direction of each bar.

## :material-horseshoe: Related

- [Area chart](area-chart.md)
- [Dots chart](dots-chart.md)
- [History periods and bins](sparkline-history-periods-and-bins.md)
- [Axes and grid](axes-and-grid.md)
