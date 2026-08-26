---
template: main.html
title: State bands
description: Show how named Home Assistant states change over time.
tags:
  - Sparkline
  - State bands
---

# State bands

Use a state-bands chart to show when an entity was in each named state and how long that state lasted.

<!-- Add a state-bands chart screenshot here. -->

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

  state_bands:
    update_interval: 1000
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
