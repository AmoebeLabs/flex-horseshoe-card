---
template: main.html
title: Axes and grid
description: Show automatic axes, grid lines, tick marks, and labels on Cartesian sparkline charts.
tags:
  - Sparkline
  - Axes
  - Grid
---

# Axes and grid

Line, area, dots, bar, equalizer, and state-bands charts can show automatic axes and grid lines.

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

The X-axis represents time. The Y-axis represents values or mapped states.

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

## :material-horseshoe: Use two Y-axes

Assign series with different units or ranges to separate axes. Keep related series on the same axis so their vertical positions remain comparable.

```yaml linenums="1"
series:
  - id: temperature
    entity_index: 0
    color: "#42a5f5"
    y_axis: primary

  - id: humidity
    entity_index: 1
    color: "#66bb6a"
    y_axis: secondary
```

The primary axis is shown on the left and the secondary axis on the right.

## :material-horseshoe: Graph spacing

The graph reserves room for visible labels, tick marks, axes, bars, and dots. Use the sparkline `margin` when you want additional space around the plotted data.

## :material-horseshoe: Related

- [Line, area, dots, and bars](sparkline-overview.md#chart-types)
- [History periods and bins](sparkline-history-periods-and-bins.md)
