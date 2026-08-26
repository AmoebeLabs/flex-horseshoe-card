---
template: main.html
title: Dots chart
description: Display one separate point for every sparkline time bin.
tags:
  - Sparkline
  - Dots chart
---

# Dots chart

A dots chart shows every time bin as a separate point without connecting the values.

<!-- Add a dots chart screenshot here. -->

## :material-horseshoe: Basic dots chart

```yaml linenums="1"
sparkline:
  show:
    chart_type: dots

  dots:
    radius: 1
```

The history period and bins determine how many dots are shown.

## :material-horseshoe: Choose the detail level

Smaller dots allow more bins to remain readable. Larger dots emphasize individual values.

```yaml linenums="1"
sparkline:
  dots:
    radius: 0.75
```

## :material-horseshoe: Related

- [Line chart](line-chart.md)
- [Bar chart](bar-chart.md)
- [History periods and bins](sparkline-history-periods-and-bins.md)
