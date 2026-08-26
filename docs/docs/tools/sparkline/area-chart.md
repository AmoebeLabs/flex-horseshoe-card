---
template: main.html
title: Area chart
description: Display entity history as a line with a filled area.
tags:
  - Sparkline
  - Area chart
---

# Area chart

An area chart combines a trend line with a filled area. Use it when the magnitude of the value should have more visual weight.

<!-- Add an area chart screenshot here. -->

## :material-horseshoe: Basic area chart

```yaml linenums="1"
sparkline:
  show:
    chart_type: area
    line: true
    area: true
```

## :material-horseshoe: Fade the fill

```yaml linenums="1"
sparkline:
  show:
    chart_type: area
    fill: fade
```

## :material-horseshoe: Show the value range

```yaml linenums="1"
sparkline:
  area:
    show_minmax: true
```

The range shows the minimum and maximum values represented by each time bin.

## :material-horseshoe: Related

- [Line chart](line-chart.md)
- [Bar chart](bar-chart.md)
- [History periods and bins](sparkline-history-periods-and-bins.md)
