---
template: main.html
title: Area chart
description: Display entity history as a line with a filled area.
tags:
  - Sparkline
  - Area chart
---
# Area chart

An Area chart is one way to draw Sparkline history. It shows the trend as a line with a filled surface underneath, which gives the size of the value more visual weight than a line alone.

This page shows how to select the Area chart, choose a solid or faded fill, show the minimum-to-maximum range, and control the chart colors.

![Flexible Horseshoe sparkline area example](../../assets/screenshots/fhs-card-area-study-score--dark.webp)

See: [Sparkline History Template Card #060]

## :material-horseshoe: Show an area chart

Use an area chart when the filled shape of the history should emphasize magnitude as well as the trend line.

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
          chart_type: area  # Draw the history as a filled area
          line: true  # Keep the trend line visible on top of the fill
```
## :material-horseshoe: Fade the fill

Use a fading fill when a solid area is visually too heavy or hides other graph details.

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
          chart_type: area  # Draw the history as a filled area
          fill: fade  # Fade the fill instead of using one solid opacity
```
Use the normal solid fill when you do not want the fade.

## :material-horseshoe: Show or hide the line

Use `show.line` to keep or remove the line along the area. Use `line.line_width` to change its thickness.

## :material-horseshoe: Show the variation inside each interval

Show the min/max band when the filled average area hides short peaks and dips inside each displayed interval.

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
          chart_type: area
        area:
          show:
            minmax: true  # Show the minimum-to-maximum range for each interval
```
## :material-horseshoe: Change the area color

Use fixed styling or the shared color-stop modes. `colorstopgradient` maps colors across the visible value range.

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
          chart_type: area  # Draw the history as a filled area
          item_style: colorstopgradient  # Use the colorstopgradient appearance/color mode
        color_stops:
          colors:
            - value: 0  # Start this color range at value 0
              color: green  # Color used for this value or state
            - value: 50  # Start this color range at value 50
              color: orange  # Color used for this value or state
            - value: 100  # Start this color range at value 100
              color: red  # Color used for this value or state
```
## :material-horseshoe: Configuration options


`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `sparkline.show.chart_type` | `area` | Yes | `line` | Set this to `area` to select this chart family; omitting it leaves the Sparkline as the default Line chart. |
| `sparkline.show.item_style` | `auto`, `fixed`, `colorstop`, `colorstopinterpolated`, `colorstopgradient` | No | `auto` | `auto` uses the chart's normal automatic color; `fixed` uses the configured fixed area color; `colorstop` picks the discrete stop color for the current value; `colorstopinterpolated` blends one color between neighboring stops for the current value; `colorstopgradient` draws the configured value colors across the graph. |
| `sparkline.show.line` | boolean | No | `true` | Shows the line along the area. |
| `sparkline.show.fill` | `solid`, `fade` | No | `solid` | `solid` keeps one opacity through the filled Area; `fade` reduces the fill opacity away from the value line. |
| `sparkline.show.points` | boolean | No | `false` | Shows one point for each displayed time interval on top of the Area chart. |
| `sparkline.area.show.minmax` | boolean | No | `false` | Shows the minimum-to-maximum variation inside each interval instead of only its aggregated value. |
| `sparkline.area.color_filter` | mapping | No | Not set | Adjusts area color. |
| `sparkline.area.minmax.color_filter` | mapping | No | Not set | Adjusts min/max color. |
| `sparkline.line.line_width` | number | No | `1` | Thickness of the line along the area. |
| `sparkline.state_values.smoothing` | boolean | No | `true` | `true` draws smooth connections between interval values; `false` connects them with straight segments. |

## :material-horseshoe: Related

- [Line chart](line-chart.md)
- [Bar chart](bar-chart.md)
- [History period](sparkline-history-periods-and-bins.md)

[Sparkline History Template Card #060]: https://github.com/AmoebeLabs/home-assistant-config/blob/master/lovelace/fhs_sys_templates/templates/51-cards/060-069/fhs-card-060-sensor-history-min-avg-max.yaml
