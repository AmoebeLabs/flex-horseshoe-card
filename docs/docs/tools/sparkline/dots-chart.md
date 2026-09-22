---
template: main.html
title: Dots chart
description: Display one separate point for every sparkline time bin.
tags:
  - Sparkline
  - Dots chart
---
# Dots chart

A Dots chart is one way to draw Sparkline history. Each displayed time interval appears as a separate point with no connecting line, so individual values and gaps remain visible.

This page shows how to select the Dots chart, control point size, choose the history detail, and combine dots with the shared Sparkline axes and labels.

![Flexible Horseshoe Sparkline dots chart example](../../assets/screenshots/fhs-card-dots-study-humidity--dark.webp)

See: [Sparkline History Template Card #060]

## :material-horseshoe: Show a dots chart

Use dots when each aggregated interval should remain a separate visible sample with no line connecting it to the next.

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
          chart_type: dots  # Draw one point for each time interval
        dots:
          radius: 1  # Size of each point
```
## :material-horseshoe: Make the points larger or smaller

Change the dot radius when points are hard to see or visually overpower the graph.

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
          chart_type: dots
        dots:
          radius: 0.75  # Size of each point
```
The period/bins determine how many points are shown. Smaller points leave more visual room when there are many intervals.

## :material-horseshoe: Choose the value shown by each point

Use `state_values.aggregate_func` when each interval should show its average, minimum, maximum, or another supported aggregate.

## :material-horseshoe: Add axes and labels

Dots supports the normal Sparkline axes, grid, tick marks, and labels. See [Axes and grid](axes-and-grid.md).

## :material-horseshoe: Configuration options


`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `sparkline.show.chart_type` | `dots` | Yes | `line` | Set this to `dots` to select this chart family; omitting it leaves the Sparkline as the default Line chart. |
| `sparkline.dots.radius` | number | No | `2` | Size of every point; increase it when individual samples are hard to see and reduce it when points overlap. |
| `sparkline.state_values.aggregate_func` | `avg`, `median`, `max`, `min`, `first`, `last`, `sum`, `delta`, `diff` | No | `avg` | Chooses the value represented by each historical point; see History periods and bins for the meaning of each choice. |
| `period.calendar.bins.per_hour` / `period.rolling_window.bins.per_hour` | number/`auto` | No | `auto` | Number of points/time interval. |
| `sparkline.show.axis.x`, `sparkline.show.axis.y` | boolean | No | `false` | Shows time and/or value axes when the position of each point needs a readable reference. |
| `sparkline.show.labels.x`, `sparkline.show.labels.y` | boolean | No | `false` | Shows the corresponding time/value labels next to the axes. |
| `series[].color` | color | No | Automatic palette | Per-series color. |

## :material-horseshoe: Related

- [Line chart](line-chart.md)
- [Bar chart](bar-chart.md)
- [History period](sparkline-history-periods-and-bins.md)

[Sparkline History Template Card #060]: https://github.com/AmoebeLabs/home-assistant-config/blob/master/lovelace/fhs_sys_templates/templates/51-cards/060-069/fhs-card-060-sensor-history-min-avg-max.yaml
