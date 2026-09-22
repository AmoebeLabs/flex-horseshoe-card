---
template: main.html
title: Line chart
description: Display entity history as a continuous sparkline trend.
tags:
  - Sparkline
  - Line chart
---
# Line chart

A Line chart is the simplest continuous way to draw Sparkline history. It connects the displayed values over time with one line, keeping the graph visually light while still showing the direction and shape of the trend.

This page shows how to select the Line chart, change line width and color, show variation within each interval, switch smoothing on or off, and add points.

## :material-horseshoe: Show a line chart

Use a line chart when the main goal is to see how a numeric value changes over time.

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
          chart_type: line  # Draw the history as a connected line

        line:
          line_width: 1.5  # Thickness of the graph line
```
The history period determines how many values are connected by the line.

## :material-horseshoe: Make the line thicker or thinner

Adjust line width when the trend is too faint or too dominant compared with the rest of the card.

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
        line:
          line_width: 2  # Thickness of the graph line
```
## :material-horseshoe: Show the variation inside each interval

Show the min/max band when the line’s average values hide short peaks and dips inside each displayed interval.

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
        line:
          show:
            minmax: true  # Show the minimum-to-maximum range for each interval
          minmax:
            styles:
              opacity: 0.2  # Transparency: 1 = fully visible, 0 = invisible
```
The line still shows the selected aggregate. The extra band shows the minimum-to-maximum range measured inside each interval.

## :material-horseshoe: Change the line color

Use a fixed stroke:

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
          chart_type: line  # Draw the history as a connected line
          item_style: fixed  # Use the fixed appearance/color mode
        line:
          styles:
            stroke: red  # Border or line color
```
Or use `colorstop`, `colorstopinterpolated`, or `colorstopgradient` with `color_stops`. See [Color stops](../../appearance/color-stops.md).

## :material-horseshoe: Use smooth or straight connections

Use smoothing for a flowing trend; turn it off when straight interval-to-interval changes are more informative.

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
        state_values:
          smoothing: false  # Use straight connections between values
```
Set it back to `true` for smooth connections.

## :material-horseshoe: Add points to the line

Add points when the individual aggregated intervals should remain visible on top of the connecting line.

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
          chart_type: line  # Draw the history as a connected line
          points: true  # Show a point for every displayed time interval
        dots:
          radius: 1  # Size of each point
```
## :material-horseshoe: Configuration options


`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `sparkline.show.chart_type` | `line` | No | `line` | Uses the default connected Line chart. |
| `sparkline.show.item_style` | `auto`, `fixed`, `colorstop`, `colorstopinterpolated`, `colorstopgradient` | No | `auto` | `auto` uses the chart's normal automatic color; `fixed` uses the configured fixed line color; `colorstop` picks the discrete stop color for the current value; `colorstopinterpolated` blends one color between neighboring stops for the current value; `colorstopgradient` draws the configured value colors across the graph. |
| `sparkline.line.line_width` | number | No | `1` | Line thickness. |
| `sparkline.line.color_filter` | mapping | No | Not set | Adjusts selected line color. |
| `sparkline.line.styles` | mapping | No | Default line style | Additional line appearance. |
| `sparkline.line.show.minmax` | boolean | No | `false` | Adds the minimum-to-maximum range for each interval when the line alone hides short peaks and dips. |
| `sparkline.line.minmax.color_filter` | mapping | No | Not set | Adjusts min/max color. |
| `sparkline.line.minmax.styles` | mapping | No | Line color with `0.25` opacity | Min/max appearance. |
| `sparkline.state_values.smoothing` | boolean | No | `true` | `true` draws smooth connections between interval values; `false` connects them with straight segments. |
| `sparkline.show.points` | boolean | No | `false` | Shows one point per interval. |
| `sparkline.dots.radius` | number | No | `2` | Size of optional points drawn on the line; larger values emphasize the individual displayed intervals. |
| `series[].color` | color | No | Automatic palette | Per-series fixed color. |

## :material-horseshoe: Related

- [Area chart](area-chart.md)
- [Dots chart](dots-chart.md)
- [History period](sparkline-history-periods-and-bins.md)
- [Axes and grid](axes-and-grid.md)
