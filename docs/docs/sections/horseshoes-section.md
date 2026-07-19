---
template: main.html
title: Horseshoe Gauge Overview
description: Build configurable Home Assistant horseshoe gauges with scales, state arcs, colors, tick marks, labels, and reusable layout definitions.
tags:
  - Section
  - Horseshoe
  - Gauge
---

# Horseshoe gauges

The horseshoe section renders one or more circular or partial-circle gauges in the card layout. Each horseshoe combines a value scale with a state layer and can add backgrounds, color stops, tick marks, and labels around the same geometry.

Horseshoes use the card coordinate system. A position of `50, 50` is the center of a `100 x 100` card, while wider or taller cards can use coordinates beyond `100` along their longer dimension.

## :material-horseshoe: Basic usage

Add horseshoes to `layout.horseshoes`. Connect each item to an entity with `entity_index` and define the numeric range under `horseshoe_scale`.

```yaml linenums="1"
layout:
  horseshoes:
    - entity_index: 0
      xpos: 50
      ypos: 50
      radius: 42
      arc_degrees: 260

      horseshoe_scale:
        min: 0
        max: 100

      horseshoe_state:
        width: 12
```

The entity index refers to the corresponding item in the card-level `entities` list. See [Entity Definitions](../core-concepts/entity-definitions.md) for entity configuration.

## :material-horseshoe: Horseshoe anatomy

A horseshoe consists of several parts that can be shown and styled independently.

| Layer | Configuration | Purpose |
| :---- | :------------ | :------ |
| Horseshoe background | `horseshoe_background` | Optional arc behind the complete gauge. |
| Scale | `horseshoe_scale` | Defines the value range, scale geometry, width, and base appearance. |
| State | `horseshoe_state` | Displays the current entity value or mapped state. |
| Tick background | `horseshoe_tickmarks.background` | Optional background behind the tick layer. |
| Tick marks | `horseshoe_tickmarks.ticks_major` and `ticks_minor` | Places numeric divisions along the scale. |
| Label background | `horseshoe_labels.background` | Optional background behind the labels. |
| Labels | `horseshoe_labels` | Places numeric or mapped-state text around the scale. |

The scale and state behavior are documented in [Horseshoe Scale and State](horseshoe-scale-and-state.md). Tick marks and labels are documented together in [Horseshoe Tick Marks and Labels](horseshoe-ticks-and-labels.md).

## :material-horseshoe: Position and geometry

| Field | Default | Description |
| :---- | :------ | :---------- |
| `entity_index` | | Entity from the card-level `entities` list. |
| `xpos` | `50` | Horizontal center in FHS card coordinates. |
| `ypos` | `50` | Vertical center in FHS card coordinates. |
| `radius` | `45` | Radius used by the scale and state layers. |
| `tickmarks_radius` | `43` | Base radius used for tick marks. |
| `arc_degrees` | `260` | Total visible arc in degrees. |
| `start_angle` | Calculated from `arc_degrees` | Starting angle of the horseshoe. |
| `bar_mode` | `normal` | Determines how the state arc grows across the scale. |
| `zero_ratio` | Calculated from the scale | Position of zero for applicable bidirectional modes. |
| `flip` | | Flips the rendered layout on the configured axis. |
| `same_as` | | Reuses another horseshoe definition. |

Positioning can also be inherited from a group. See [Positioning and Groups](../core-concepts/positioning-and-groups.md) and [Groups Section](groups-section.md).

## :material-horseshoe: Show options

Visibility and presentation choices are grouped under `show`.

| Field | Default | Description |
| :---- | :------ | :---------- |
| `horseshoe` | `true` | Shows or hides the complete horseshoe. |
| `horseshoe_style` | `fixed` | Chooses fixed or color-stop state coloring. |
| `horseshoe_background` | `none` | Selects the horseshoe background mode. |
| `tickmarks` | | Enables the configured major and minor tick marks. |
| `tick_background` | `none` | Selects the tick background mode. |
| `labels_at` | `none` | Selects the values used to create labels. |
| `label_background` | `none` | Selects the label background mode. |
| `label_badges` | | Shows label badges when configured. |

Older configurations can contain `ticks` or `scale_tickmarks`. Current configurations should use the current horseshoe fields shown on these pages.

## :material-horseshoe: Color stops

Color stops can color the active state, scale, backgrounds, tick marks, and labels. A fixed threshold color uses `colorstop`; an interpolated transition uses `colorstopgradient`.

```yaml linenums="1"
show:
  horseshoe_style: colorstopgradient

color_stops:
  colors:
    0: '#3498db'
    60: '#2ecc71'
    80: '#f1c40f'
    100: '#e74c3c'
```

Reusable definitions, light and dark mode colors, and transition behavior are documented in [Color Stops](../core-concepts/color-stops.md).

## :material-horseshoe: Styling

Each horseshoe part has its own `styles` collection.

```yaml linenums="1"
horseshoe_scale:
  styles:
    - opacity: 0.35

horseshoe_state:
  styles:
    - opacity: 1
    - filter: drop-shadow(0 0 1px var(--primary-color))
```

Common SVG properties include `fill`, `stroke`, `stroke-width`, `opacity`, `fill-opacity`, and `stroke-opacity`. See [CSS Styling](../core-concepts/css-styling.md) and [Color Filters](../core-concepts/color-filters.md) for shared styling behavior.

## :material-horseshoe: Related documentation

- [Horseshoe Scale and State](horseshoe-scale-and-state.md)
- [Horseshoe Tick Marks and Labels](horseshoe-ticks-and-labels.md)
- [Color Stops](../core-concepts/color-stops.md)
- [Animations](../core-concepts/animations.md)
- [Reusable YAML Card Examples](../reuse/reuse-card-examples.md)
