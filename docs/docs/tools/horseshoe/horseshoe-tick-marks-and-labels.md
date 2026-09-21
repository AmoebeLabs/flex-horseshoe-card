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

Tick marks and labels add readable scale information around a Horseshoe. Ticks divide the scale into visible positions. Labels show the values or named states that belong to those positions.

This page shows how to add major and minor ticks, choose which values receive labels, move ticks and labels relative to the path, change label direction and spacing, and add label backgrounds or badges.

<!-- One comparison image can show default, moved outward, and horizontal labels. -->

## :material-horseshoe: Add major tick marks

Major ticks provide the main readable scale intervals, for example every 10 units on a 0–100 gauge.

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  horseshoes:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      radius: 42  # Distance from the center to the Horseshoe path
      tickmarks_radius: 43  # Place ticks at radius 43 instead of the Horseshoe radius 42

      horseshoe_scale:
        min: 0  # Value at the start of the scale
        max: 100  # Value at the end of the scale

      show:
        tickmarks:
          major: true

      horseshoe_tickmarks:
        ticks_major:
          ticksize: 10  # Draw a major tick every 10 scale units
          width: 5  # Length of each major tick away from the tick radius
          thickness: 2  # Thickness of each major tick along the path
```
`ticksize: 10` creates a major tick every 10 units on this scale.

## :material-horseshoe: Add minor tick marks

Minor ticks add intermediate scale positions when the major intervals alone are too coarse.

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  horseshoes:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      horseshoe_scale:
        min: 0  # Value at the start of the scale
        max: 100  # Value at the end of the scale

      show:
        tickmarks:
          major: true
          minor: true

      horseshoe_tickmarks:
        ticks_major:
          ticksize: 10  # Draw a major tick every 10 scale units
          width: 5  # Length of each major tick away from the tick radius
          thickness: 2  # Thickness of each major tick along the path

        ticks_minor:
          ticksize: 2  # Draw a minor tick every 2 scale units
          width: 2  # Length of each minor tick away from the tick radius
          thickness: 1  # Thickness of each minor tick along the path
```
Minor ticks that coincide with major ticks are not drawn twice.

## :material-horseshoe: Move the tick marks

Use the tick `offset` when the ticks should move inward or outward relative to their normal radius. Use `tickmarks_radius` on the Horseshoe when the complete tick-mark layer needs another base radius.

## :material-horseshoe: Add labels

Choose which values should receive labels with `show.labels_at`:

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  horseshoes:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      horseshoe_scale:
        min: 0  # Value at the start of the scale
        max: 100  # Value at the end of the scale

      show:
        labels_at: ticks_major  # Choose which scale values receive a label
        tickmarks: true

      horseshoe_tickmarks:
        ticks_major:
          ticksize: 10  # Draw a major tick every 10 scale units

      horseshoe_labels:
        offset: 12  # Distance of the labels from the Horseshoe radius
```
## :material-horseshoe: Choose which values get labels

Labels do not have to be shown at every possible value; choose the set that makes the scale readable without crowding it.

| `labels_at` | Labels shown |
| --- | --- |
| `none` | No labels |
| `minmax` | Minimum and maximum |
| `minmax0` | Minimum, zero, and maximum |
| `colorstop` / `colorstops` | Color-stop/scale boundaries |
| `ticks_major` | Major tick values |
| `both` | Color-stop and major-tick labels |
| `segment` / `stringstate` | Labels from mapped states |

## :material-horseshoe: Move the labels

Use `horseshoe_labels.offset` to move the label layer inward or outward:

```yaml linenums="1"
entities:
  - entity: sensor.example  # Entity displayed by this Horseshoe

layout:
  horseshoes:
    - entity_index: 0  # Use the first entity configured above
      horseshoe_scale: {}  # Required scale block; uses the default 0–100 linear scale
      xpos: 50  # Horizontal center of the Horseshoe
      ypos: 50  # Vertical center of the Horseshoe
      show:
        labels_at: minmax  # Show Horseshoe labels so the setting is visible
      horseshoe_labels:
        offset: 16  # Increase the distance between labels and the Horseshoe path
```
## :material-horseshoe: Change the label direction

Use `horseshoe_labels.orientation` to choose the label direction. `arc` follows the Horseshoe path and is the default. `horizontal` keeps every label level on the card instead of following the curve.

## :material-horseshoe: Keep enough space between labels

Use `distance_min` when labels would otherwise appear too close together:

```yaml linenums="1"
entities:
  - entity: sensor.example  # Entity displayed by this Horseshoe

layout:
  horseshoes:
    - entity_index: 0  # Use the first entity configured above
      horseshoe_scale: {}  # Required scale block; uses the default 0–100 linear scale
      xpos: 50  # Horizontal center of the Horseshoe
      ypos: 50  # Vertical center of the Horseshoe
      show:
        labels_at: minmax  # Show Horseshoe labels so the setting is visible
      horseshoe_labels:
        distance_min: 10  # Do not show labels whose values are closer than 10 units
```
This keeps the label layer readable by requiring a minimum value distance between visible labels.

## :material-horseshoe: Add a label background or badge

Use `show.label_background` for a band behind the label layer. `none` hides the band, `fixed` uses the configured background color, `colorstopsegments` divides the band into hard color-stop sections, `lineargradient` spreads the configured colors evenly across the path, and `colorstopgradient` places the gradient colors at their configured scale values. Configure the band under `horseshoe_labels.background`.

Set `show.label_badges: true` to draw a badge behind every individual label; `false` leaves the text without badges. Horizontal labels use circular badges, while labels that follow the path use capsule-shaped badges. Configure their size and appearance under `horseshoe_labels.badges`.

```yaml linenums="1"
entities:
  - entity: sensor.example  # Entity whose value is shown by the Horseshoe

layout:
  horseshoes:
    - entity_index: 0  # Use the first configured entity
      horseshoe_scale: {}  # Required scale block; uses the default 0–100 linear scale
      show:
        labels_at: ticks_major
        label_background: fixed
        label_badges: true
      horseshoe_tickmarks:
        ticks_major:
          ticksize: 10
      horseshoe_labels:
        orientation: horizontal
        background:
          width: 8
          styles:
            fill: var(--divider-color)
            opacity: 0.2
        badges:
          radius: 6
          color: var(--card-background-color)
          border_color: var(--divider-color)
```

## :material-horseshoe: Configuration options

### Major or minor tick layer

When you define `ticks_major` or `ticks_minor` yourself, the interval, length, and thickness are the three values that define that visible tick layer.

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `ticksize` | number | Yes | — | Value interval between neighboring ticks; for example `10` places ticks at 0, 10, 20, and so on. |
| `width` | number | Yes | — | Length of each tick away from its base radius. |
| `thickness` | number | Yes | — | Thickness of each tick along the path. |
| `offset` | number | No | `0` | Moves the complete tick layer relative to `tickmarks_radius`: positive outward, negative inward. |
| `shape` | `line`, `circle` | No | `line` | `line` draws a short tick across the path; `circle` draws a circular point. |
| `radius` | number | No | `width / 2` for circles | Radius of a circular tick when `shape: circle` is used. |
| `color` | color | No | Tick style color | Fixed tick color. |
| `color_mode` | `fixed`, `colorstop`, `colorstopinterpolated` | No | `fixed` | `fixed` uses `color`/`styles`; `colorstop` uses the discrete color-stop color for that tick value; `colorstopinterpolated` blends between neighboring color stops. |
| `styles` | mapping | No | Not set | Adds SVG/CSS appearance overrides to the tick layer. |

### Label visibility and background

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `show.labels_at` | `none`, `minmax`, `minmax0`, `colorstop`, `colorstops`, `ticks_major`, `both`, `segment`, `stringstate` | No | `none` | Chooses the label source; the visible result of each value is listed above. |
| `show.label_background` | `none`, `fixed`, `colorstopsegments`, `lineargradient`, `colorstopgradient` | No | `none` | Chooses whether the label band is hidden, fixed-color, divided into hard color-stop sections, or shown as an even/value-positioned gradient. |
| `show.label_badges` | boolean | No | `false` | `true` draws a badge behind every label; `false` shows only the text. |

### Labels

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `offset` | number | No | `12` | Moves labels relative to the Horseshoe path: positive outward, negative inward. |
| `distance_min` | number | No | `0` | Hides labels that would represent values closer together than this minimum difference. |
| `orientation` | `arc`, `horizontal` | No | `arc` | `arc` follows the Horseshoe path; `horizontal` keeps every label level on the card. |
| `arc_size` | number | No | Calculated | Amount of path space available to each label. |
| `ellipsis` | number | No | `0` / no truncation | Shortens a label after the configured character limit. |
| `stringstate_mode` | mapping | No | Not set | Appearance used for labels generated by `stringstate_mode`. |
| `stringstate_level` | mapping | No | Not set | Appearance used for labels generated by `stringstate_level`. |
| `color_filter` | mapping | No | Not set | Transforms the label color without changing the label value. |
| `styles` | mapping | No | Default label style | Sets font, color, alignment, and other label appearance. |

## :material-horseshoe: Related documentation

- [Horseshoe overview](horseshoe-overview.md)
- [Value and progress](horseshoe-scale-and-state.md)
- [Markers](horseshoe-markers.md)
- [Color stops](../../appearance/color-stops.md)
