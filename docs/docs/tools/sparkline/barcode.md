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

<!-- Add a barcode chart screenshot here. -->

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

## :material-horseshoe: Related

- [Radial barcode](radial-barcode.md)
- [Color stops](../../appearance/color-stops.md)
- [History periods and bins](sparkline-history-periods-and-bins.md)
