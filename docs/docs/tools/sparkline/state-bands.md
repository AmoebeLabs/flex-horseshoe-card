---
template: main.html
title: State bands
description: Show how named Home Assistant states change over time.
tags:
  - Sparkline
  - State bands
---

# State bands

A state-bands chart shows when an entity was in each named state and how long that state lasted. Use it for named conditions rather than numeric trends.

It works well for heating modes, occupancy, machine states, alarms, doors, or another entity where duration and transitions matter more than a numeric trend.

The state band sparkline is inspired by the Sleep Cycle visualizations from Apple Health and others.

<!-- Add a state-bands chart screenshot here. -->
![Flexible Horseshoe sparkline state band example](../../assets/screenshots/fhs-demo-card-state_band-pollen-kruiden--dark.webp)

## :material-horseshoe: Basic configuration

This example shows when a climate system was off, heating, or cooling:

```yaml linenums="1"
layout:
  sparklines:
    - id: climate-states
      entity_index: 0
      xpos: 50
      ypos: 50
      width: 80
      height: 35

      period:
        type: rolling_window
        rolling_window:
          duration:
            hour: 24

      sparkline:
        show:
          chart_type: state_bands
        state_map:
          map:
            - state: "off"
              label: Off
              value: 0
            - state: heating
              label: Heating
              value: 1
            - state: cooling
              label: Cooling
              value: 2
```

## :material-horseshoe: Configuration options

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `show.chart_type` | string | No | `line` | Set to `state_bands` to display a categorical state timeline. |
| `state_map.map[].state` | string | Yes | - | Matches a Home Assistant state. |
| `state_map.map[].label` | string | No | state value | Sets the state label shown on the Y-axis. |
| `state_map.map[].value` | number | Yes | - | Sets the vertical level of the state. |
| `state_bands.update_interval` | duration | No | `5min` | Optional refresh interval for an ongoing current state. Leave the default for normal use. |
| `color_stops` | mapping | No | none | Assigns a color to every named state. |
| `show.axis.x`, `show.axis.y` | boolean | No | `false` | Shows the time or state axis. |
| `show.labels.x`, `show.labels.y` | boolean | No | `false` | Shows labels along the enabled axes. |

## :material-horseshoe: Basic state bands

```yaml linenums="1"
sparkline:
  show:
    chart_type: state_bands

  state_map:
    map:
      - state: "off"
        label: Off
        value: 0
      - state: heating
        label: Heating
        value: 1
      - state: cooling
        label: Cooling
        value: 2

```

Each map entry gives a state its visible label and vertical level.

## :material-horseshoe: Add state colors

```yaml linenums="1"
color_stops:
  colors:
    - state: "off"
      color: var(--disabled-text-color)
      rank: 0
    - state: heating
      color: var(--error-color)
      rank: 1
    - state: cooling
      color: var(--info-color)
      rank: 2
```

## :material-horseshoe: Show axes and labels

State bands can show time on the X-axis and state labels on the Y-axis:

```yaml linenums="1"
sparkline:
  show:
    axis:
      x: true
      y: true
    labels:
      x: true
      y: true
    tickmarks:
      x: true
      y: true
```

## :material-horseshoe: Related

- [Axes and grid](axes-and-grid.md)
- [Color stops](../../appearance/color-stops.md)
- [History periods and bins](sparkline-history-periods-and-bins.md)
