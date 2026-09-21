---
template: main.html
title: Multiple series
description: Show several entities or time periods in one Flexible Horseshoe Card sparkline.
tags:
  - Sparkline
  - Multiple series
  - Legend
---
# Multiple series

A Sparkline normally draws one history series, but it can show several series inside the same graph area. Each series can use another entity, name, color, chart appearance, period, or one of the two Y-axis - primary or secondary - while sharing the overall Sparkline.

This page shows how to add multiple series, style and name them, show a legend, give a series its own period, and use a secondary Y-axis when needed.

## :material-horseshoe: Show multiple entities in one graph

Use multiple series when several histories should share one time frame so their changes can be viewed together.

```yaml linenums="1"
entities:
  - entity: sensor.living_room_temperature  # Home Assistant entity used by this card
  - entity: sensor.bedroom_temperature  # Home Assistant entity used by this card

layout:
  sparklines:
    - id: room-history  # Name this item so it can be referenced later
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      width: 88  # Width of the graph
      height: 42  # Height of the graph

      period:
        type: rolling_window  # Always show the latest moving time range
        rolling_window:
          duration:
            hour: 24  # Show 24 hours of history
          bins:
            per_hour: auto  # Let the card choose a readable time interval automatically
            density: medium  # Choose low, medium, or high detail when intervals are automatic

      series:
        - id: living-room  # Name this series inside the graph
          entity_index: 0  # Use the first entity configured above
          name: Living room  # Name shown to the user
          color: "#42a5f5"
          sparkline:
            show:
              chart_type: line  # Draw the history as a connected line

        - id: bedroom  # Name this series inside the graph
          entity_index: 1  # Use the second entity configured above
          name: Bedroom  # Name shown to the user
          color: "#f9a825"
          sparkline:
            show:
              chart_type: line  # Draw the history as a connected line
```

The parent Sparkline supplies the shared period, axes, grid, and drawing area. Each series chooses its own entity and can override supported graph settings.

## :material-horseshoe: Give every series its own appearance

Each series can have its own name, color, and supported chart settings:

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
          name: Temperature  # Name shown to the user
          color: "#42a5f5"
          sparkline:
            show:
              chart_type: line  # Draw the history as a connected line

        - id: humidity  # Name this series inside the graph
          entity_index: 1  # Use entity 1 from entities: (0 = first entity)
          name: Humidity  # Name shown to the user
          color: "#66bb6a"
          sparkline:
            show:
              chart_type: dots  # Draw one point for each time interval
            dots:
              radius: 0.75  # Size of each point
```
## :material-horseshoe: Show a legend

Add a legend when colors alone are not enough to identify which series belongs to which entity.

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
        - id: temperature
          entity_index: 0
        - id: humidity
          entity_index: 1
      sparkline:
        show:
          legend: true  # Show a legend for the configured series

      legend:
        position: top  # Place this element at the top
        rows: 1
        gap: 4  # Space between these visible parts
        item_gap: 2
```
Without a custom `name`, the card builds the label from the Home Assistant area/entity information.

## :material-horseshoe: Show another period in the same graph

A series can override the **offset** inside the parent's active calendar or rolling-window period. It does not replace the parent period type, duration, or bin settings. This example shows today and yesterday on the same time-of-day axis:

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
      period:
        type: calendar  # Follow a calendar period such as today or yesterday
        calendar:
          period: day  # Use one calendar day as the period
          offset: 0  # Use the current calendar period
          duration:
            hour: 24  # Show 24 hours of history
          bins:
            per_hour: 2  # Use 2 displayed interval(s) per hour

      series:
        - id: today  # Name this series inside the graph
          entity_index: 0  # Use entity 0 from entities: (0 = first entity)
          name: Today  # Name shown to the user

        - id: yesterday  # Name this series inside the graph
          entity_index: 0  # Use entity 0 from entities: (0 = first entity)
          name: Yesterday  # Name shown to the user
          period:
            calendar:
              offset: -1  # Move back 1 calendar period(s); -1 = previous period
```
## :material-horseshoe: Show the min/max range for a series

Line and area series can show the minimum-to-maximum range represented inside each displayed interval:

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
        - id: cpu  # Name this series inside the graph
          entity_index: 0  # Use entity 0 from entities: (0 = first entity)
          sparkline:
            show:
              chart_type: line  # Draw the history as a connected line
            line:
              show:
                minmax: true  # Show the minimum-to-maximum range for each interval
```
## :material-horseshoe: Use a second Y-axis

Use separate Y-axes when series have different units or value ranges:

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
See [Axes and grid](axes-and-grid.md) for how the two axes are shown.

## :material-horseshoe: Override the chart type for one series

Inside `series[].sparkline.show.chart_type`, an explicit series can use `line`, `area`, `dots`, `bar`, or `radial`. Other parent chart families are not valid as per-series chart types. A radial series can use `line`, `area`, or `dots` as its `chart_variant`.

## :material-horseshoe: Use different radial variants

When the parent graph is radial, individual series can use radial `line`, `area`, or `dots` variants while sharing the same arc and time bins.

## :material-horseshoe: Configuration options


`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `series[].id` | string | Yes | — | Unique series name inside the graph. |
| `series[].entity_index` | entity index | Yes | — | Entity whose history is shown. |
| `series[].name` | string/structured name | No | Area/entity name | Label used by legend/tooltip. |
| `series[].color` | color | No | Automatic palette | Fixed series color. |
| `series[].sparkline` | mapping | No | Shared graph settings | Per-series chart settings. |
| `series[].period` | mapping | No | Shared period | Overrides only `offset` inside the parent-selected `calendar` or `rolling_window` branch; period type, duration, and bins stay shared. |
| `series[].y_axis_id` | `primary`, `secondary` | No | `primary` | `primary` uses the main Y-axis; `secondary` uses the second Y-axis. |
| `sparkline.show.legend` | boolean | No | `false` | Shows the legend. |
| `sparkline.legend.position` | `top`, `bottom`, `left`, `right` | No | `top` | `top` and `bottom` place the legend in horizontal rows above/below the graph; `left` and `right` place it in a vertical column beside the graph. |
| `sparkline.legend.rows` | integer | No | `1` | Rows for top/bottom legends. |
| `sparkline.legend.gap` | number | No | `4` | Space between legend and graph. |
| `sparkline.legend.item_gap` | number | No | `1` | Space between marker and label. |

## :material-horseshoe: Related

- [Sparkline overview](sparkline-overview.md)
- [History period](sparkline-history-periods-and-bins.md)
- [Axes and grid](axes-and-grid.md)
- [Radial chart](radial-chart.md)
