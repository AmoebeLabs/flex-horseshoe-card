---
template: main.html
title: Graded chart
description: Display sparkline history as ordered grades or severity levels.
tags:
  - Sparkline
  - Graded
---
# Graded chart

A Graded chart is one way to draw Sparkline history as ordered value ranges or severity levels. Instead of emphasizing exact height, it shows which configured grade each time interval belongs to, which is useful for scores, warnings, comfort levels, or other threshold-based data.

This page shows how to select the Graded chart, define its grades with color stops, and control the visible grade shapes.

![Flexible Horseshoe graded chart with ordered air-quality levels](../../assets/screenshots/fhs-card-graded-awair--dark.webp)

## :material-horseshoe: Show a graded chart

Use a graded chart when values should be grouped into discrete colored grades rather than shown as a continuous line.

```yaml linenums="1"
entities:
  - entity: sensor.temperature  # Entity whose history is graphed

layout:
  sparklines:
    - xpos: 50  # Horizontal center of the graph
      ypos: 50  # Vertical center of the graph
      width: 80  # Graph width in card coordinates
      height: 35  # Graph height in card coordinates
      entity_index: 0  # Use the first entity configured above
      sparkline:
        show:
          chart_type: graded  # Show values as ordered grades
        graded:
          square: false  # Use rounded shapes
        color_stops:
          colors:
            - value: 0  # Start this color range at value 0
              color: "#d32f2f"
            - value: 50  # Start this color range at value 50
              color: "#ed8003"
            - value: 70  # Start this color range at value 70
              color: "#f9a825"
            - value: 90  # Start this color range at value 90
              color: "#66bb6a"
```
Each value starts a new grade. Keep the grade boundaries ordered from low to high.

## :material-horseshoe: Use explicit rank order

Set `show.chart_variant: rank_order` when the grade order should come from each color stop's `rank` value instead of the order of the configured color stops. This lets several value ranges share the same visible grade rank.

```yaml linenums="1"
entities:
  - entity: sensor.score  # Entity whose history is graded

layout:
  sparklines:
    - entity_index: 0
      xpos: 50
      ypos: 50
      sparkline:
        show:
          chart_type: graded
          chart_variant: rank_order  # Use color_stops rank values for the grade order
        color_stops:
          colors:
            - value: 0
              rank: 0
              color: red
            - value: 50
              rank: 1
              color: orange
            - value: 80
              rank: 2
              color: green
```

## :material-horseshoe: Change the grade shape

Use `graded.square` to switch between the supported square/rounded appearance.

## :material-horseshoe: Change the amount of history detail

The history period and bins determine how much time every displayed grade represents. Keep automatic bins for normal use and change density when needed.

## :material-horseshoe: Configuration options


`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `sparkline.show.chart_type` | `graded` | Yes | `line` | Set this to `graded` to select this chart family; omitting it leaves the Sparkline as the default Line chart. |
| `sparkline.show.chart_variant` | `rank_order` | No | Not set | Uses each color stop's `rank` value to determine the visible grade order. |
| `sparkline.graded.square` | boolean | No | `false` | `false` draws rounded grade blocks; `true` draws square grade blocks. |
| `sparkline.color_stops.colors[].value` | number | Yes | — | Lower bound of a grade. |
| `sparkline.color_stops.colors[].color` | color | Yes | — | Grade color. |
| `period.calendar.bins.per_hour` / `period.rolling_window.bins.per_hour` | number/`auto` | No | `auto` | Controls how many history intervals are graded per hour; more bins preserve shorter changes. |

## :material-horseshoe: Related

- [Equalizer chart](equalizer.md)
- [State bands](state-bands.md)
- [Color stops](../../appearance/color-stops.md)
