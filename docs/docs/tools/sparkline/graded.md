---
template: main.html
title: Graded chart
description: Display sparkline history as ordered grades or severity levels.
tags:
  - Sparkline
  - Graded
---

# Graded chart

A graded chart emphasizes an ordered category or severity for each time bin. Use it when labels such as low, moderate, high, and very high matter more than an exact numeric height.

<!-- Add a graded chart screenshot here. -->

## :material-horseshoe: Basic graded chart

```yaml linenums="1"
sparkline:
  show:
    chart_type: graded

  graded:
    square: false

  color_stops:
    colors:
      - state: low
        color: "#66bb6a"
        rank: 0
      - state: moderate
        color: "#f9a825"
        rank: 1
      - state: high
        color: "#ed8003"
        rank: 2
      - state: very_high
        color: "#d32f2f"
        rank: 3
```

`rank` defines the visible order of the grades. The entity state selects the matching color-stop entry.

## :material-horseshoe: When to use graded

Use a graded chart for air quality, pollen, warnings, comfort levels, or another ordered state scale. Use an [equalizer](equalizer.md) when the graph should represent numeric height instead.

## :material-horseshoe: Related

- [Equalizer chart](equalizer.md)
- [State bands](state-bands.md)
- [Color stops](../../appearance/color-stops.md)
