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

Tick marks and labels follow the horseshoe scale automatically. This keeps numeric divisions, text labels, and the current value aligned, whether the gauge uses a linear or spline scale.

## :material-horseshoe: Enable ticks and labels

Enable configured tick marks with `show.tickmarks`. Use `show.labels_at` to choose which scale values receive a label.

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

Set tickmarks to false to hide both layers, or use an object to control
the configured layers independently:

```yaml linenums="1"
show:
  tickmarks:
    major: true
    minor: false
```

## :material-horseshoe: Major and minor ticks

Major and minor ticks are configured separately, so each layer can use its own spacing, size, color, and styling. When a minor tick falls on the same value as a major tick, it is automatically omitted from the minor layer.

| Field        | Description                                                       |
| :----------- | :---------------------------------------------------------------- |
| `ticksize`   | Defines the numeric interval between consecutive ticks.           |
| `width`      | Controls the radial width of each tick.                           |
| `thickness`  | Controls the arc length of each tick.                             |
| `offset`     | Moves the ticks inward or outward relative to `tickmarks_radius`. |
| `shape`      | Chooses the tick shape; use `circle` for circular tick points.    |
| `radius`     | Sets the circle radius when `shape` is `circle`.                  |
| `color`      | Applies a fixed tick color.                                       |
| `color_mode` | Chooses fixed, color-stop, or color-stop-gradient coloring.       |
| `styles`     | Applies SVG styles to the complete tick layer.                    |

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

On spline scales, minor tick spacing adjusts automatically in compressed parts of the scale to prevent overlap.

## :material-horseshoe: Tick background

Enable the tick background with `show.tick_background`. The background band uses the same underlying radius as the tick geometry, which keeps both layers aligned.

| Field    | Description                                    |
| :------- | :--------------------------------------------- |
| `width`  | Controls the width of the background band.     |
| `offset` | Moves the background inward or outward.        |
| `gap`    | Adds space between segmented background parts. |
| `styles` | Applies SVG styles to the background layer.    |

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

Use `show.labels_at` to choose which scale values are displayed as labels.

| Value                       | Labels shown                                 |
| :-------------------------- | :------------------------------------------- |
| `none`                      | No labels.                                   |
| `minmax`                    | The scale minimum and maximum.               |
| `minmax0`                   | The minimum, zero, and maximum.              |
| `colorstop` or `colorstops` | Scale boundaries and configured color stops. |
| `ticks_major`               | Every configured major tick value.           |
| `both`                      | Color-stop labels and major tick labels.     |
| `segment` or `stringstate`  | Labels from the configured state map.        |

Duplicate values are removed before label positions are calculated. Use `horseshoe_labels.distance_min` to hide labels that would otherwise appear too close together in value space.

## :material-horseshoe: Label configuration

| Field               | Default    | Description                                                     |
| :------------------ | :--------- | :-------------------------------------------------------------- |
| `offset`            | `12`       | Sets the radial distance from the horseshoe radius.             |
| `distance_min`      | `0`        | Defines the minimum value difference between visible labels.    |
| `orientation`       | `arc`      | Chooses how the text is oriented relative to the horseshoe.     |
| `arc_size`          | Calculated | Defines the amount of arc available to each label.              |
| `ellipsis`          |            | Controls truncation when a label exceeds its available arc.     |
| `stringstate_mode`  |            | Defines role-based styles for mutually exclusive string states. |
| `stringstate_level` |            | Defines role-based styles for ordered string-state levels.      |
| `color_filter`      |            | Applies an optional shared color filter.                        |
| `styles`            |            | Applies SVG text styles to all labels.                          |

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

Label backgrounds use the same fixed or color-stop model as other horseshoe layers. Enable them with `show.label_background`, then configure the band under `horseshoe_labels.background`.

Badges appear behind individual labels when `show.label_badges` is enabled. Their size, fill, border, padding, and additional styles can be configured under `horseshoe_labels.badges`.

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

For `stringstate_mode` and `stringstate_level`, labels come from the configured state map and are positioned within the corresponding state segment.

Role-specific styles can distinguish the previous, current, and following states without changing the underlying segment geometry.

Keep the state map with the horseshoe state configuration, and use the label settings only for visible text and styling. This keeps each label aligned with the same mapped state as its active segment.

## :material-horseshoe: Related documentation

* [Horseshoe Gauges](horseshoe-overview.md)
* [Horseshoe Scale and State](horseshoe-scale-and-state.md)
* [Color Stops](../../appearance/color-stops.md)
* [CSS Styling](../../appearance/styling.md)
