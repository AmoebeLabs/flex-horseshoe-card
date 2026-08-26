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

<!-- Add a line chart screenshot here. -->

## :material-horseshoe: Basic line chart

```yaml linenums="1"
sparkline:
  show:
    chart_type: line

  line:
    line_width: 1.5
```

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
