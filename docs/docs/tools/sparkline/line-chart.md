---
template: main.html
title: Line chart
description: Display entity history as a continuous sparkline trend.
tags:
  - Sparkline
  - Line chart
---

# Line chart

A line chart shows how a numeric value changes over time without filling the area below it.

Use it for a clear continuous trend. Its light visual weight also makes several series easier to compare in the same graph.

<!-- Add a line chart screenshot here. -->

## :material-horseshoe: Basic configuration

This example shows the average value over the latest 24 hours:

```yaml linenums="1"
layout:
  sparklines:
    - id: temperature-line
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
            per_hour: auto
            density: medium

      sparkline:
        state_values:
          aggregate_func: avg
          smoothing: true
        show:
          chart_type: line
        line:
          line_width: 1.5
```

## :material-horseshoe: Configuration options

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `show.chart_type` | string | No | `line` | Displays a line chart. |
| `line.line_width` | number | No | `1` | Sets the width of the line. |
| `line.styles` | mapping | No | default line styles | Applies styles such as opacity or a dashed stroke. |
| `line.show_minmax` | boolean | No | `false` | Shows the lowest and highest values measured within every interval. |
| `line.minmax.styles` | mapping | No | line color with `0.25` opacity | Styles the minimum-to-maximum band without changing the line. |
| `state_values.smoothing` | boolean | No | `true` | Uses smooth or straight connections. |
| `show.points` | boolean | No | `false` | Adds a point for every displayed interval. |
| `dots.radius` | number | No | `2` | Sets the radius of optional points. |
| `series[].color` | color | No | automatic palette | Gives each series a recognizable fixed color. |

## :material-horseshoe: Basic line chart

```yaml linenums="1"
sparkline:
  show:
    chart_type: line

  line:
    line_width: 1.5
```

## :material-horseshoe: Show variation within each interval

The line normally shows one aggregated value for every interval. Add a minimum-to-maximum band when the variation within those intervals should remain visible.

```yaml linenums="1"
sparkline:
  line:
    show_minmax: true
    styles:
      stroke: red
    minmax:
      styles:
        opacity: 0.2
```

The band uses the line color. Its opacity can be changed independently without making the line less visible.

## :material-horseshoe: Smooth or straight connections

```yaml linenums="1"
sparkline:
  state_values:
    smoothing: true
```

Disable smoothing when every change should use a straight connection.

## :material-horseshoe: Add points

```yaml linenums="1"
sparkline:
  show:
    chart_type: line
    points: true

  dots:
    radius: 1
```

## :material-horseshoe: Related

- [Area chart](area-chart.md)
- [Dots chart](dots-chart.md)
- [History periods and bins](sparkline-history-periods-and-bins.md)
- [Axes and grid](axes-and-grid.md)
