---
template: main.html
title: Multiple series
description: Compare several entities or time periods in one Flexible Horseshoe Card sparkline.
tags:
  - Sparkline
  - Multiple series
  - Legend
---

# Multiple series

Use multiple series to compare entities or time periods on one shared graph.

<!-- Add a multiple-series chart with a legend here. -->

## :material-horseshoe: Compare several entities

When `series` is present, every graph line or bar is defined in that list:

```yaml linenums="1"
series:
  - id: living-room
    entity_index: 0
    name: Living room
    color: "#42a5f5"
    sparkline:
      show:
        chart_type: line

  - id: bedroom
    entity_index: 1
    name: Bedroom
    color: "#f9a825"
    sparkline:
      show:
        chart_type: line

  - id: humidity
    entity_index: 2
    name: Humidity
    color: "#66bb6a"
    sparkline:
      show:
        chart_type: dots
      dots:
        radius: 0.75
```

The parent sparkline supplies the shared period, bins, axes, grid, and tooltip. A series only supplies settings that differ.

## :material-horseshoe: Compare today with yesterday

```yaml linenums="1"
period:
  type: calendar
  calendar:
    period: day
    offset: 0
    duration:
      hour: 24
    bins:
      per_hour: 2

series:
  - id: today
    entity_index: 0
    name: Today
    color: "#42a5f5"

  - id: yesterday
    entity_index: 0
    name: Yesterday
    color: "#9e9e9e"
    period:
      calendar:
        offset: -1
```

Both series use the same time-of-day X-axis. The tooltip identifies the series and shows the source time for its value.

## :material-horseshoe: Show a legend

Enable the legend with the shared show settings:

```yaml linenums="1"
sparkline:
  show:
    legend: true

legend:
  position: top
  rows: 2
  gap: 4
  item_gap: 2
  styles:
    font-size: 0.55em
```

Use `top` or `bottom` for a horizontal legend and `left` or `right` for a vertical legend.

## :material-horseshoe: Use two Y-axes

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

Use two axes when the series have different units or ranges.

## :material-horseshoe: Related

- [Axes and grid](axes-and-grid.md)
- [History periods and bins](sparkline-history-periods-and-bins.md)
- [Line chart](line-chart.md)
- [Bar chart](bar-chart.md)
