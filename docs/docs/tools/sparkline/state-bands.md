---
template: main.html
title: State bands
description: Show how named Home Assistant states change over time.
tags:
  - Sparkline
  - State bands
---
# State bands

State bands are a Sparkline chart type for entities whose history consists of named states instead of meaningful numeric values. The graph shows which state was active at each time and how long it lasted, which suits modes, occupancy, alarms, doors, or other categorical history.

This page shows how to map named states to visible levels, color those states, and add time/state axes and labels.

![Flexible Horseshoe sparkline state band example](../../assets/screenshots/fhs-card-state_band-pollen-kruiden--dark.webp)

## :material-horseshoe: Show named states over time

Use state bands for entities whose history consists of named states such as `off`, `heating`, or `open` rather than continuous numbers.

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
          chart_type: state_bands  # Show named states over time
        state_map:
          map:
            - state: "off"
              label: Off
              value: 0  # Vertical level used for the off state
            - state: heating
              label: Heating
              value: 1  # Vertical level used for the heating state
            - state: cooling
              label: Cooling
              value: 2  # Vertical level used for the cooling state
```
Each mapped state receives a visible label and vertical level.

## :material-horseshoe: Add colors to the states

Give each named state a color when the timeline should be readable without inspecting every text label.

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
          chart_type: state_bands
        color_stops:
          colors:
            - state: "off"  # Use this color when the state is off
              color: var(--disabled-text-color)  # Color used for this value or state
              rank: 0  # Order of this named state in the visual scale
            - state: heating  # Use this color when the state is heating
              color: var(--error-color)  # Color used for this value or state
              rank: 1  # Order of this named state in the visual scale
            - state: cooling  # Use this color when the state is cooling
              color: var(--info-color)  # Color used for this value or state
              rank: 2  # Order of this named state in the visual scale
```
## :material-horseshoe: Show time and state labels

Add labels when the viewer needs to identify both when a state occurred and which state level is being shown.

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
          chart_type: state_bands
          axis:
            x: true  # Show the time axis
            y: true  # Show the value axis
          labels:
            x: true  # Show labels on the time axis
            y: true  # Show labels on the value axis
```
## :material-horseshoe: Keep the current state extending to now

`state_bands.update_interval` controls how often an unchanged current state extends toward the current time. The normal default is `5min`.

## :material-horseshoe: Configuration options


`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `sparkline.show.chart_type` | `state_bands` | Yes | `line` | Set this to `state_bands` to select this chart family; omitting it leaves the Sparkline as the default Line chart. |
| `sparkline.state_map.map[].state` | string | Yes | — | Home Assistant state to match. |
| `sparkline.state_map.map[].label` | string | No | State text | Visible state label. |
| `sparkline.state_map.map[].value` | number | Yes | — | Vertical state level. |
| `sparkline.state_bands.update_interval` | duration | No | `5min` | Refresh interval for an ongoing state. |
| `sparkline.color_stops` | mapping | No | Not set | Gives each named state its own color so the history can be recognized without reading every label. |
| `sparkline.show.axis.x/y` | boolean | No | `false` | Shows the time axis and/or the state-level axis when those references help interpret the bands. |
| `sparkline.show.labels.x/y` | boolean | No | `false` | Shows readable time and/or state labels next to the corresponding axes. |

## :material-horseshoe: Related

- [Axes and grid](axes-and-grid.md)
- [Color stops](../../appearance/color-stops.md)
- [History period](sparkline-history-periods-and-bins.md)
