---
template: main.html
title: Axes and grid
description: Show automatic axes, grid lines, tick marks, and labels on sparkline charts.
tags:
  - Sparkline
  - Axes
  - Grid
---
# Axes and grid

A Sparkline can stay minimal, or it can add axes, grid lines, tick marks, and labels when the reader needs exact time and value references. The X-axis represents time and the Y-axis represents values or mapped states; radial charts use the same idea around and across the circle.

This page shows how to turn those elements on, style their labels, reserve graph space, and use a secondary Y-axis for another series.

## :material-horseshoe: Show time and value axes

Add axes when the graph needs readable time and value references rather than only showing its overall shape.

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
          axis:
            x: true  # Show the time axis
            y: true  # Show the value axis
          tickmarks:
            x: true  # Show tick marks on the time axis
            y: true  # Show tick marks on the value axis
          labels:
            x: true  # Show labels on the time axis
            y: true  # Show labels on the value axis
```
The X-axis represents time. The Y-axis represents values or mapped states.

## :material-horseshoe: Add grid lines

Grid lines make it easier to compare a point in the graph with a time or value position on an axis.

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
          grid:
            x: true  # Show time-grid lines
            y: true  # Show value-grid lines
```
Enable X and Y independently so the graph only shows the guides you need.

## :material-horseshoe: Style axis labels

Change label styling when axis text is too prominent, too small, or does not fit the surrounding card design.

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
      x_axis:
        labels:
          styles:
            font-size: 0.5em  # Size of the displayed text

      y_axis:
        labels:
          styles:
            font-size: 0.5em  # Size of the displayed text
```
## :material-horseshoe: Use more of the graph for the data

Hide Y-axis labels when the plotted values should use as much vertical/radial room as possible:

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
          labels:
            y: false  # Hide labels on the value axis
```
The grid, axis, and tick marks can stay visible without the labels.

## :material-horseshoe: Use two Y-axes

Assign each series to `primary` or `secondary`:

```yaml linenums="1"
entities:
  - entity: sensor.temperature  # First graph series
  - entity: sensor.humidity  # Second graph series

layout:
  sparklines:
    - xpos: 50  # Horizontal center of the graph
      ypos: 50  # Vertical center of the graph
      width: 80  # Graph width in card coordinates
      height: 35  # Graph height in card coordinates
      series:
        - id: temperature  # Name this series inside the graph
          entity_index: 0  # Use entity 0 from entities: (0 = first entity)
          y_axis_id: primary  # Use the primary Y-axis for this series

        - id: humidity  # Name this series inside the graph
          entity_index: 1  # Use entity 1 from entities: (0 = first entity)
          y_axis_id: secondary  # Use the secondary Y-axis for this series
```
Use this when the series have different units or very different ranges.

## :material-horseshoe: Add extra space around the graph

Use the Sparkline `margin` when labels, points, or bars need more room inside the configured graph size.

## :material-horseshoe: Configuration options


`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `sparkline.show.grid.x`, `sparkline.show.grid.y` | boolean | No | `false` | Adds horizontal and/or vertical guide lines so graph positions are easier to compare with an axis. |
| `sparkline.show.axis.x`, `sparkline.show.axis.y` | boolean | No | `false` | Shows the time and/or value axis when the graph needs readable reference scales. |
| `sparkline.show.tickmarks.x`, `sparkline.show.tickmarks.y` | boolean | No | `false` | Adds small marks at the positions used by the corresponding axis scale. |
| `sparkline.show.labels.x`, `sparkline.show.labels.y` | boolean | No | `false` | Shows readable time/value text at the selected axis positions. |
| `x_axis` | mapping | No | Default X-axis appearance | X-axis/label styling. |
| `y_axis` | mapping | No | Default Y-axis appearance | Y-axis/label styling. |
| `margin` | number/mapping | No | `0` | Adds room between the plotted data and graph edges when labels, ticks, or other edge content would otherwise collide. |
| `series[].y_axis_id` | `primary`, `secondary` | No | `primary` | `primary` uses the main value axis; `secondary` uses the separately scaled second value axis. |

## :material-horseshoe: Related

- [Sparkline overview](sparkline-overview.md)
- [Multiple series](multiple-series.md)
- [Radial chart](radial-chart.md)
