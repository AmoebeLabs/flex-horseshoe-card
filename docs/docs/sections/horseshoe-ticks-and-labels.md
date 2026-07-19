---
template: main.html
title: Horseshoe Tick Marks and Labels
description: Add aligned major and minor tick marks, scale labels, label backgrounds, and badges to horseshoe gauges.
tags:
  - Section
  - Horseshoe
  - Labels
---

# Horseshoe tick marks and labels

Tick marks and labels follow the horseshoe scale automatically. Numeric divisions, text, and the current value therefore remain aligned for linear and spline scales.

## :material-horseshoe: Enable ticks and labels

Use `show.tickmarks` to render configured ticks. Use `show.labels_at` to select the values that receive a label.

```yaml linenums="1"
show:
  tickmarks: true
  labels_at: ticks_major

horseshoe_tickmarks:
  ticks_major:
    ticksize: 10
    width: 4
    thickness: 2

horseshoe_labels:
  offset: 12
  orientation: horizontal
```

## :material-horseshoe: Major and minor ticks

Major and minor ticks are configured independently. Minor values that coincide with a major value are automatically omitted from the minor layer.

| Field | Description |
| :---- | :---------- |
| `ticksize` | Numeric interval between ticks. |
| `width` | Radial width of each tick. |
| `thickness` | Arc length of each tick. |
| `offset` | Radial offset from `tickmarks_radius`. |
| `shape` | Tick shape; use `circle` for circular tick points. |
| `radius` | Circle radius when `shape` is `circle`. |
| `color` | Fixed tick color. |
| `color_mode` | Uses fixed, color-stop, or color-stop-gradient coloring. |
| `styles` | SVG styles applied to the tick layer. |

```yaml linenums="1"
horseshoe_tickmarks:
  ticks_major:
    ticksize: 10
    width: 5
    thickness: 2
    offset: 0
    color_mode: colorstop
    styles:
      - opacity: 0.9

  ticks_minor:
    ticksize: 2
    width: 2
    thickness: 1
    offset: 0
    styles:
      - fill: var(--secondary-text-color)
      - opacity: 0.5
```

For spline scales, minor ticks automatically adjust to prevent overlap in compressed parts of the scale.

## :material-horseshoe: Tick background

Enable the background with `show.tick_background`. Its radius starts from the same geometry as the ticks.

| Field | Description |
| :---- | :---------- |
| `width` | Width of the background band. |
| `offset` | Radial offset. |
| `gap` | Gap between segmented background parts. |
| `styles` | SVG styles applied to the background. |

```yaml linenums="1"
show:
  tickmarks: true
  tick_background: fixed

horseshoe_tickmarks:
  background:
    width: 6
    styles:
      - fill: var(--divider-color)
      - opacity: 0.2
```

## :material-horseshoe: Label sources

`show.labels_at` selects which scale values become labels.

| Value | Labels shown |
| :---- | :----------- |
| `none` | No labels. |
| `minmax` | Scale minimum and maximum. |
| `minmax0` | Minimum, zero, and maximum. |
| `colorstop` or `colorstops` | Scale boundaries and configured color stops. |
| `ticks_major` | Every configured major tick value. |
| `both` | Color-stop labels and major tick labels. |
| `segment` or `stringstate` | Labels from the configured state map. |

Duplicate values are removed before labels are positioned. `horseshoe_labels.distance_min` can suppress labels that are too close together in value space.

## :material-horseshoe: Label configuration

| Field | Default | Description |
| :---- | :------ | :---------- |
| `offset` | `12` | Radial distance from the horseshoe radius. |
| `distance_min` | `0` | Minimum value distance between visible labels. |
| `orientation` | `arc` | Text orientation relative to the horseshoe. |
| `arc_size` | Calculated | Arc available to each label. |
| `ellipsis` | | Controls truncation when text exceeds its available arc. |
| `stringstate_mode` | | Role styles for mutually exclusive string states. |
| `stringstate_level` | | Role styles for ordered string-state levels. |
| `color_filter` | | Optional shared color filter. |
| `styles` | | SVG text styles for all labels. |

```yaml linenums="1"
horseshoe_labels:
  offset: 12
  distance_min: 5
  orientation: horizontal
  styles:
    - fill: var(--primary-text-color)
    - font-size: 0.65em
```

## :material-horseshoe: Label backgrounds and badges

Label backgrounds follow the same fixed or color-stop background model as the other horseshoe layers. Enable them with `show.label_background` and configure the band under `horseshoe_labels.background`.

Badges are rendered behind individual labels when `show.label_badges` is enabled. Configure badge dimensions, colors, borders, and styles under `horseshoe_labels.badges`.

```yaml linenums="1"
show:
  labels_at: ticks_major
  label_background: fixed
  label_badges: true

horseshoe_labels:
  background:
    width: 8
    gap: 1
    styles:
      - fill: var(--card-background-color)

  badges:
    radius: 6
    color: var(--card-background-color)
    border_color: var(--divider-color)
    padding: 1
```

## :material-horseshoe: Mapped-state labels

For `stringstate_mode` and `stringstate_level`, labels are derived from the state map and positioned in the corresponding state segment. Role-specific styles can distinguish previous, current, and following states without changing the state geometry.

Keep the state map with the horseshoe state configuration and use the label configuration only for visible text and styling. This ensures the active segment and its label always refer to the same mapped state.

## :material-horseshoe: Related documentation

- [Horseshoe Gauges](horseshoes-section.md)
- [Horseshoe Scale and State](horseshoe-scale-and-state.md)
- [Color Stops](../core-concepts/color-stops.md)
- [CSS Styling](../core-concepts/css-styling.md)
