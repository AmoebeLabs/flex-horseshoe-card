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

<!-- Add a bar chart screenshot here. -->

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
