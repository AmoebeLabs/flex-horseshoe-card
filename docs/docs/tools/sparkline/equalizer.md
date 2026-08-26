---
template: main.html
title: Equalizer chart
description: Display every sparkline time bin as a stack of numeric value levels.
tags:
  - Sparkline
  - Equalizer
---

# Equalizer chart

An equalizer shows the height of every time bin as a stack of levels. Use it when you want a block-based view of numeric changes over time.

<!-- Add an equalizer chart screenshot here. -->

## :material-horseshoe: Basic equalizer

```yaml linenums="1"
sparkline:
  show:
    chart_type: equalizer

  equalizer:
    value_buckets: 10
    square: false
    column_spacing: 1
    row_spacing: 1
```

`value_buckets` chooses the number of vertical levels. Column and row spacing control the gaps between the blocks.

## :material-horseshoe: Add value colors

```yaml linenums="1"
sparkline:
  colorstops_transition: smooth
  color_stops:
    colors:
      0: "#42a5f5"
      20: "#66bb6a"
      30: "#f9a825"
      40: "#d32f2f"
```

Each displayed level follows the configured value colors.

## :material-horseshoe: Related

- [Graded chart](graded.md)
- [Color stops](../../appearance/color-stops.md)
- [History periods and bins](sparkline-history-periods-and-bins.md)
- [Axes and grid](axes-and-grid.md)
