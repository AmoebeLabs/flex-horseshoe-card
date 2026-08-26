---
template: main.html
title: Radial barcode chart
description: Arrange colored sparkline time bins around a circle.
tags:
  - Sparkline
  - Radial barcode
---

# Radial barcode chart

A radial barcode arranges colored time bins around a circle. Use it for compact circular history displays and clock-like daily views.

<!-- Add radial barcode variant screenshots here. -->

## :material-horseshoe: Basic radial barcode

```yaml linenums="1"
sparkline:
  show:
    chart_type: radial_barcode
    chart_variant: sunburst_outward
    chart_viz: flower

  radial_barcode:
    size: 15
    line_width: 0.02
    column_spacing: 0.2

  color_stops:
    colors:
      0: "#1565c0"
      18: "#42a5f5"
      24: "#66bb6a"
      28: "#f9a825"
      35: "#d32f2f"
```

## :material-horseshoe: Choose the appearance

`chart_variant` chooses how the bins are aligned and in which direction they extend. `chart_viz` chooses the shape used for each bin.

Use the radial barcode showcase to compare combinations visually.

## :material-horseshoe: Related

- [Barcode](barcode.md)
- [Color stops](../../appearance/color-stops.md)
- [History periods and bins](sparkline-history-periods-and-bins.md)
- [Examples](../../examples/overview.md)
