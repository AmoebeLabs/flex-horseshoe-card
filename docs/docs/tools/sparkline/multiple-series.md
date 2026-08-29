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

Multiple series compare entities or time periods on one shared graph. Use them to see related measurements together instead of switching between separate graphs.

Each series can have its own entity, name, color, chart type, and Y-axis. The graph shares its period, bins, X-axis, drawing area, and tooltip across all series.

<!-- Add a multiple-series chart with a legend here. -->

## :material-horseshoe: Basic configuration

This complete example compares three rooms over the latest 24 hours:

```yaml linenums="1"
entities:
  - entity: sensor.living_room_temperature
    slot: living_room
  - entity: sensor.bedroom_temperature
    slot: bedroom
  - entity: sensor.study_humidity
    slot: study

layout:
  sparklines:
    - id: room-history
      xpos: 50
      ypos: 50
      width: 88
      height: 42

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
          legend: true

      legend:
        position: top
        rows: 1
        gap: 4
        item_gap: 2

      series:
        - id: living-room
          entity_index: living_room[0]
          name: Living room
          color: "#42a5f5"
          sparkline:
            show:
              chart_type: line

        - id: bedroom
          entity_index: bedroom[0]
          name: Bedroom
          color: "#f9a825"
          sparkline:
            show:
              chart_type: area

        - id: study
          entity_index: study[0]
          name: Study humidity
          color: "#66bb6a"
          sparkline:
            show:
              chart_type: dots
            dots:
              radius: 0.75
```

Without a configured `name`, legend and tooltip labels combine the Home Assistant area with the short entity or attribute name. Related sensors therefore remain distinguishable, for example `Living room Temperature` and `Bedroom Temperature`. A `series[].name` overrides that label and accepts the same [name choices](../entities/entity-name-tool.md#choose-what-the-name-shows).

## :material-horseshoe: Configuration options

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `series[].id` | string | Yes | - | Sets the unique name for the series inside the graph. |
| `series[].entity_index` | entity index | Yes | - | Selects the entity whose history is displayed. |
| `series[].name` | string or structured name | No | area and entity name | Sets the name shown in the legend and tooltip. |
| `series[].color` | color | No | automatic palette | Sets a fixed color for the series. |
| `series[].sparkline` | mapping | No | shared sparkline settings | Changes the chart type or chart-specific settings for this series. |
| `series[].period` | mapping | No | shared period | Selects a supported period override, such as an earlier day. |
| `series[].y_axis_id` | string | No | `primary` | Uses the `primary` or `secondary` Y-axis. |
| `sparkline.show.legend` | boolean | No | `false` | Shows or hides the legend. |
| `legend.position` | string | No | `top` | Places the legend at the `top`, `bottom`, `left`, or `right`. |
| `legend.rows` | number | No | `1` | Divides a top or bottom legend over this number of rows. |
| `legend.gap` | number | No | `4` | Sets the space between the legend and graph. |
| `legend.item_gap` | number | No | `1` | Sets the space between a marker and its label. |

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

The parent sparkline supplies the period, bins, axes, grid, and tooltip. A series can override some of the settings.

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

Set `show.legend` to `true` to show the series names and colors:

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
    y_axis_id: primary

  - id: humidity
    entity_index: 1
    color: "#66bb6a"
    y_axis_id: secondary
```

Use two axes when the series have different units or ranges.

## :material-horseshoe: Related

- [Axes and grid](axes-and-grid.md)
- [History periods and bins](sparkline-history-periods-and-bins.md)
- [Line chart](line-chart.md)
- [Bar chart](bar-chart.md)
