---
template: main.html
title: Day and night
description: Show daylight and nighttime behind a sparkline using the sun times from Home Assistant.
tags:
  - Sparkline
  - Day and night
  - Sun
---
# Day and night

The Day and night layer adds daylight and nighttime information to a Sparkline. The card uses Home Assistant's `sun.sun` times and aligns them with the same history period as the graph, which makes daily patterns easier to relate to sunrise and sunset.

This page shows how to use day/night as a graph background or separate band/ring and how to position and style that layer.

## :material-horseshoe: Show day and night behind the graph

Use the background mode when daylight context should sit behind the data without taking extra graph space.

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
          day_night: true  # Show daylight and nighttime on the graph

        day_night:
          day:
            styles:
              - fill: rgba(255, 214, 64, 0.12)  # Color used for daylight periods
          night:
            styles:
              - fill: rgba(0, 0, 0, 0.25)  # Color used for nighttime periods
```
The graph itself remains visible above the background.

## :material-horseshoe: Show a separate day/night band

Use a band when day/night information should remain visually separate from the data itself.

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
          day_night: true  # Show daylight and nighttime on the graph

        day_night:
          mode: band
          position: bottom  # Place this element at the bottom
          size: 4      # Thickness of the day/night band or radial ring
          offset: -1   # Move 1 unit inward; positive values move outward
```
On a normal graph this creates a strip. On a radial graph/barcode it creates a separate ring.

## :material-horseshoe: Move or resize the band

Use:

- `position` for top/bottom on Cartesian graphs;
- `size` for band/ring thickness;
- `offset` to move it inward or outward.

## :material-horseshoe: Choose the history period

A calendar period is useful when the graph should follow complete days, including today's sunrise and sunset. A rolling window shows the recorded day/night sections inside a moving range.

## :material-horseshoe: Configuration options


`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `sparkline.show.day_night` | boolean | No | `false` | Shows the day/night layer. |
| `sparkline.day_night.mode` | `background`, `band` | No | `background` | `background` shades day/night behind the graph; `band` draws a separate day/night band or radial ring. |
| `sparkline.day_night.position` | `top`, `bottom` | No | `bottom` | Places a Cartesian day/night band above or below the graph. |
| `sparkline.day_night.size` | number | No | `4` | Band/ring thickness. |
| `sparkline.day_night.offset` | number | No | `0` | Positive moves the band/ring outward; negative inward. |
| `sparkline.day_night.day.styles` | mapping | No | Transparent | Day appearance. |
| `sparkline.day_night.night.styles` | mapping | No | Theme divider color | Night appearance. |

## :material-horseshoe: Related

- [History period](sparkline-history-periods-and-bins.md)
- [Axes and grid](axes-and-grid.md)
- [Radial chart](radial-chart.md)
- [Styling](../../appearance/styling.md)
