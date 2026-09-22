---
template: main.html
title: Horseshoe Gauge Overview
description: Build configurable Home Assistant horseshoe gauges with scales, state progress, markers, colors, tick marks, labels, and reusable layout definitions.
tags:
- Section
- Horseshoe
- Gauge
---
# Horseshoe gauges

A Horseshoe is a gauge that maps an entity value onto an arc or another path. The path provides the visual scale, while the current value can be shown as progress, a marker, labels, colors, or a combination of those elements.

This page builds the basic Horseshoe, explains its position, radius, arc, and value range, and introduces the other Horseshoe topics you can add afterward.

## :material-horseshoe: Add a basic Horseshoe

A basic Horseshoe needs an entity and a value scale; the remaining settings mainly change its geometry and presentation.

```yaml linenums="1"
entities:
  - entity: sensor.cpu_usage  # Home Assistant entity used by this card

layout:
  horseshoes:
    - entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      radius: 42  # Distance from the center to the Horseshoe path
      arc_degrees: 260  # Draw 260° of the full 360° circle

      horseshoe_scale:
        min: 0  # Value at the start of the scale
        max: 100  # Value at the end of the scale
```

`radius` sets the size of the normal circular Horseshoe. `arc_degrees` controls how much of the circle is used. `min` and `max` define the value range.

The normal position settings are `xpos` and `ypos`. Existing configurations can also use `horseshoe_position` with `xpos`/`ypos` or `cx`/`cy`; those values supply the same Horseshoe center when the top-level position is omitted.

## :material-horseshoe: Change how the value is shown

The current value normally grows from the start of the scale. Bidirectional modes instead let positive and negative values grow from zero, which is useful for values such as power flow, deviation, or temperature difference. You can also change the scale mapping and the thickness of the base and active paths.

See [Value and progress](horseshoe-scale-and-state.md) for the complete choices.

## :material-horseshoe: Add colors

Use value colors when the gauge should communicate meaning such as normal, warning, and critical at a glance.

```yaml linenums="1"
entities:
  - entity: sensor.cpu_usage  # Home Assistant entity used by this card

layout:
  horseshoes:
    - entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      radius: 42  # Distance from the center to the Horseshoe path
      arc_degrees: 260  # Draw 260° of the full 360° circle

      horseshoe_scale:
        min: 0  # Value at the start of the scale
        max: 100  # Value at the end of the scale

      color_stops:
        colors:
          0: green
          60: orange
          90: red

      show:
        horseshoe_style: colorstopinterpolated
```

See [Color stops](../../appearance/color-stops.md) for the shared color system.

## :material-horseshoe: Add tick marks and labels

Add ticks and labels when the viewer needs to read approximate values from the gauge rather than only see its progress.

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  horseshoes:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      radius: 42  # Distance from the center to the Horseshoe path
      tickmarks_radius: 43  # Put the ticks 1 unit outside the Horseshoe radius of 42

      horseshoe_scale:
        min: 0  # Value at the start of the scale
        max: 100  # Value at the end of the scale

      show:
        tickmarks: true
        labels_at: ticks_major  # Choose which scale values receive a label

      horseshoe_tickmarks:
        ticks_major:
          ticksize: 10  # Draw a major tick every 10 scale units

      horseshoe_labels:
        offset: 12  # Distance of the labels from the Horseshoe radius
```
See [Tick marks and labels](horseshoe-tick-marks-and-labels.md) to position, style, and space them.

## :material-horseshoe: Mark the current value

Add a marker when you want a point, triangle, icon, or center pointer to show exactly where the current value is.

See [Markers](horseshoe-markers.md).

## :material-horseshoe: Use another path shape

The Horseshoe does not have to be circular. It can follow a line, rectangle, polygon, wave, spiral, or infinity path.

See [Path shapes](horseshoe-path-shapes.md).

## :material-horseshoe: Visual guide

The Horseshoe can combine several visible parts:

- the base scale/path;
- current-value progress;
- an optional background;
- tick marks;
- labels;
- a current-value marker.

One annotated overview image is enough here to identify those parts. The detail pages explain how to use each one.

<!-- Keep/add one annotated Horseshoe overview image here. -->

## :material-horseshoe: Configuration reference


`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Field / block | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `entity_index` | entity index | No | `0` | Chooses the entity used by the Horseshoe; when omitted, the first configured entity is used. |
| `xpos` | number | No | `50` | Horizontal center; values below `50` move the Horseshoe left and values above `50` move it right. |
| `ypos` | number | No | `50` | Vertical center; values below `50` move the Horseshoe up and values above `50` move it down. |
| `yposc` | number | No | Not set | Alternative vertical-center coordinate on the same 0–100 scale. When set, it is used instead of `ypos`. |
| `horseshoe_position` | mapping | No | Not set | Alternative Horseshoe center block. Use `xpos`/`ypos` or `cx`/`cy` inside it when top-level `xpos`/`ypos` are not used. |
| `radius` | number | No | `45` | Distance from the center to the normal circular Horseshoe path; larger values make the gauge larger. |
| `tickmarks_radius` | number | No | `43` | Distance from the center to the tick-mark layer, so it can sit inside or outside the main path. |
| `arc_degrees` | number | No | `260` | Amount of the circle used by the normal arc path; `360` makes a complete circle. |
| `start_angle` | number | No | Calculated from `arc_degrees` | Rotates where the circular path begins when the automatically centered start position is not suitable. |
| `bar_mode` | `normal`, `bidirectional`, `bidirectional_symmetrical`, `bidirectional_linear`, `absolute` | No | `normal` | Chooses where progress starts and how it grows. The Value and progress page explains the visible behavior of all five values. |
| `zero_ratio` | number | No | Calculated from scale | Places the zero point for `bidirectional`, `bidirectional_symmetrical`, and `bidirectional_linear`; normally the card derives it from the configured minimum and maximum. |
| `horseshoe_scale` | mapping | Yes | — | Required scale block. Its `min`, `max`, and `type` fields have their own defaults, so an empty `horseshoe_scale: {}` still creates the default 0–100 linear scale. |
| `horseshoe_state` | mapping | No | Defaults applied | Controls the active part of the path that shows the current value. |
| `horseshoe_marker` | mapping | No | Defaults applied | Adds a shape, icon, or center pointer at the current value position. |
| `horseshoe_tickmarks` | mapping | No | Not set | Adds major and/or minor scale marks so values can be read more precisely. |
| `horseshoe_labels` | mapping | No | Defaults applied | Shows selected scale values as text around or near the path. |
| `horseshoe_background` | mapping | No | Not set | Optional background settings; activate with `show.horseshoe_background`. |
| `path` | mapping | No | Standard `arc` | Uses another path shape instead of the normal circular Horseshoe. |
| `show` | mapping | No | Defaults applied | Controls which Horseshoe layers are visible and which color modes they use; the detail pages describe the values for each nested setting. |
| `same_as` | string | No | Not set | Reuses another Horseshoe definition. |

## :material-horseshoe: Related documentation

- [Value and progress](horseshoe-scale-and-state.md)
- [Markers](horseshoe-markers.md)
- [Tick marks and labels](horseshoe-tick-marks-and-labels.md)
- [Path shapes](horseshoe-path-shapes.md)
- [Color stops](../../appearance/color-stops.md)
