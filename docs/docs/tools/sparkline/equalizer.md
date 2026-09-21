---
template: main.html
title: Equalizer chart
description: Display every sparkline time bin as a stack of numeric value levels.
tags:
  - Sparkline
  - Equalizer
---
# Equalizer chart

An Equalizer chart is one way to draw Sparkline history as discrete value levels. Each time interval becomes a vertical stack of blocks, making changes in level visible without drawing a continuous line or area.

This page shows how to select the Equalizer chart, choose the number and shape of levels, control spacing, and color the levels from their values.

![Flexible Horseshoe sparkline equalizer example](../../assets/screenshots/fhs-card-equalizer-study-temperature--dark.webp)

See: [Sparkline History Template Card #060]

## :material-horseshoe: Show an equalizer

Use an equalizer when values should be read as stacked levels instead of exact line positions.

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
          chart_type: equalizer  # Show each time interval as stacked levels
        equalizer:
          value_buckets: 10  # Number of vertical value levels
          square: false  # Use rounded shapes
          column_spacing: 1  # Space between neighboring time intervals
          row_spacing: 1
```
## :material-horseshoe: Change the number of levels

`value_buckets` controls how many vertical levels are available.

## :material-horseshoe: Change the block shape and spacing

Use `square` for square/rounded level shapes, `column_spacing` between time intervals, and `row_spacing` between value levels.

## :material-horseshoe: Add value colors

Color the levels when the equalizer should also communicate ranges such as low, normal, and high.

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
      # Color the equalizer levels from the value represented by each level.
      sparkline:
        show:
          chart_type: equalizer
        colorstops_transition: smooth
        color_stops:
          colors:
            0: "#42a5f5"
            20: "#66bb6a"
            30: "#f9a825"
            40: "#d32f2f"
```
## :material-horseshoe: Add a background level track

`equalizer.background.show.item_style` controls optional background blocks for every available level:

- `none` — no background level blocks.
- `fixed` — uses `equalizer.background.color`.
- `colorstopsegments` — uses hard color-stop sections based on each level's value.
- `lineargradient` — spreads the configured colors evenly across the available levels.
- `colorstopgradient` — smoothly interpolates colors according to the configured color-stop values.

```yaml linenums="1"
entities:
  - entity: sensor.temperature  # Entity whose history is graphed

layout:
  sparklines:
    - entity_index: 0  # Use the first configured entity
      xpos: 50  # Horizontal center of the graph
      ypos: 50  # Vertical center of the graph
      width: 80  # Graph width in card coordinates
      height: 35  # Graph height in card coordinates
      sparkline:
        show:
          chart_type: equalizer  # Draw history as stacked levels
        equalizer:
          value_buckets: 10  # Number of available vertical levels
          background:
            show:
              item_style: fixed  # Show fixed-color background level blocks
            color: var(--divider-color)  # Background level color
```

## :material-horseshoe: Configuration options


`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `sparkline.show.chart_type` | `equalizer` | Yes | `line` | Set this to `equalizer` to select this chart family; omitting it leaves the Sparkline as the default Line chart. |
| `sparkline.equalizer.value_buckets` | integer | No | `10` | Number of stacked levels available for representing the value; more levels give finer visual steps. |
| `sparkline.equalizer.square` | boolean | No | `false` | `false` draws rounded level blocks; `true` draws square level blocks. |
| `sparkline.equalizer.column_spacing` | number | No | `1` | Space between time intervals. |
| `sparkline.equalizer.row_spacing` | number | No | `1` | Space between levels. |
| `sparkline.equalizer.background.show.item_style` | `none`, `fixed`, `colorstopsegments`, `lineargradient`, `colorstopgradient` | No | `none` | Hides background levels, uses one fixed color, uses hard value-based color sections, spreads colors evenly, or interpolates them by configured stop values. |
| `sparkline.equalizer.background.color` | color | No | `var(--divider-color)` | Fixed background-level color used when `background.show.item_style: fixed`. |
| `sparkline.color_stops` | mapping | No | Not set | Changes level colors with the value so ranges such as low, normal, and high remain visible. |
| `sparkline.colorstops_transition` | `smooth`, `hard` | No | `smooth` | `smooth` blends between neighboring numeric color stops; `hard` switches directly from one stop color to the next. |

## :material-horseshoe: Related

- [Graded chart](graded.md)
- [Color stops](../../appearance/color-stops.md)
- [History period](sparkline-history-periods-and-bins.md)

[Sparkline History Template Card #060]: https://github.com/AmoebeLabs/home-assistant-config/blob/master/lovelace/fhs_sys_templates/templates/51-cards/060-069/fhs-card-060-sensor-history-min-avg-max.yaml
