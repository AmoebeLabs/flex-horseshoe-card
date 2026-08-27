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
![Flexible Horseshoe sparkline equalizer example](../../assets/screenshots/fhs-demo-card-graded-awair--dark.webp)

## :material-horseshoe: Basic configuration

This example displays ordered pollen levels over time:

```yaml linenums="1"
layout:
  sparklines:
    - id: pollen-levels
      entity_index: 0
      xpos: 50
      ypos: 50
      width: 80
      height: 35

      period:
        type: rolling_window
        rolling_window:
          duration:
            hour: 24
          bins:
            per_hour: auto
            density: medium

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

## :material-horseshoe: Configuration options

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `show.chart_type` | string | No | `line` | Set to `graded` to display ordered state levels. |
| `graded.square` | boolean | No | `false` | Uses square or rounded grade shapes. |
| `color_stops.colors[].state` | string | Yes | - | Matches a Home Assistant state. |
| `color_stops.colors[].color` | color | Yes | - | Chooses the visible color for that state. |
| `color_stops.colors[].rank` | number | No | list order | Defines the vertical order of the states. |
| `bins.per_hour` | number or `auto` | No | `auto` | Chooses how much history each displayed grade represents. |

!!! tip "Keep automatic bins"

    Leave `bins.per_hour` set to `auto` for normal use. Adjust `bins.density` when you want more or less detail without fixing the interval yourself.

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
