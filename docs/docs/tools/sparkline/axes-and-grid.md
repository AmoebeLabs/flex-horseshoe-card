---
template: main.html
title: Axes and grid
description: Show automatic axes, grid lines, tick marks, and labels on sparkline charts.
tags:
  - Sparkline
  - Axes
  - Grid
---

# Axes and grid

Line, area, dots, bar, radial, equalizer, and state-bands charts can show automatic axes and grid lines.

Show the X-axis when the user needs to identify times and the Y-axis when values or named states need a visible scale. Grid lines make it easier to compare a point with both axes.

<!-- Add a chart with labeled X and Y display elements here. -->

## :material-horseshoe: Show both axes

```yaml linenums="1"
sparkline:
  show:
    grid:
      x: true
      y: true
    axis:
      x: true
      y: true
    tickmarks:
      x: true
      y: true
    labels:
      x: true
      y: true
```

The X-axis represents time. The Y-axis represents values or mapped states. On a radial chart, time follows the outer arc and values run outward from the center.

## :material-horseshoe: Configuration options

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `show.grid.x`, `show.grid.y` | boolean | No | `false` | Shows grid lines for either axis. |
| `show.axis.x`, `show.axis.y` | boolean | No | `false` | Shows the X-axis or Y-axis. |
| `show.tickmarks.x`, `show.tickmarks.y` | boolean | No | `false` | Shows tick marks along an axis. |
| `show.labels.x`, `show.labels.y` | boolean | No | `false` | Shows calculated time or value labels. |
| `x_axis` | mapping | No | default X-axis styling | Adjusts X-axis labels and appearance. |
| `y_axis` | mapping | No | default Y-axis styling | Adjusts Y-axis labels and appearance. |
| `margin` | number or mapping | No | `0` | Adds space around the plotted data. |
| `series[].y_axis_id` | string | No | `primary` | Assigns a series to the `primary` or `secondary` Y-axis. |

## :material-horseshoe: Style labels

```yaml linenums="1"
x_axis:
  labels:
    styles:
      font-size: 0.5em

y_axis:
  labels:
    styles:
      font-size: 0.5em
```

## :material-horseshoe: Use the complete value range

Hide the Y-axis labels when the chart should give its values as much visual space as possible. The lowest visible value then starts at one edge of the graph and the highest visible value reaches the other edge.

```yaml linenums="1"
sparkline:
  show:
    labels:
      y: false
```

Grid lines, tick marks, and the Y-axis can remain visible. They stay evenly spaced across the graph:

```yaml linenums="1"
sparkline:
  show:
    grid:
      y: true
    axis:
      y: true
    tickmarks:
      y: true
    labels:
      y: false
```

Show the Y-axis labels when readable scale values are more important than using the complete graph height or radial width.

## :material-horseshoe: Use two Y-axes

Assign series with different units or ranges to separate axes. Keep related series on the same axis so their vertical positions remain comparable.

```yaml linenums="1"
series:
  - id: temperature
    entity_index: 0
    color: "#42a5f5"
    y_axis_id: primary

  - id: humidity
    entity_index: 1
    color: "#66bb6a"
    y_axis_id: secondary
```

Cartesian charts show the primary axis on the left and the secondary axis on the right. Radial charts place them at separate sides of the configured arc.

## :material-horseshoe: Graph spacing

The graph reserves room for visible labels, tick marks, axes, bars, and dots. Use the sparkline `margin` when you want additional space around the plotted data.

## :material-horseshoe: Related

- [Line, area, dots, and bars](sparkline-overview.md#chart-types)
- [Radial chart](radial-chart.md)
- [History periods and bins](sparkline-history-periods-and-bins.md)
