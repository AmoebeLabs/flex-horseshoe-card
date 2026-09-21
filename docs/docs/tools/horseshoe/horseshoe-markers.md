---
template: main.html
title: Horseshoe Markers
description: Show the current Horseshoe value with a circle, triangle, icon, or center pointer.
tags:
- Section
- Horseshoe
- Marker
---
# Horseshoe markers

A Horseshoe can show the current entity value in several ways. The progress path shows how far the value has moved across the scale. A marker is a small shape or icon that marks the exact current position. It moves when the value changes.

This page shows how to add a marker, show it with or without the progress path, move it inward or outward, change its shape or icon, and use a pointer from the center of a circular Horseshoe.

<!-- One comparison image can show: path circle, offset marker, triangle/icon, center pointer. -->

## :material-horseshoe: Show a marker on the path

A path marker is useful when the exact current position should remain visible even if the progress path itself is subtle or hidden.

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  horseshoes:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      radius: 42  # Distance from the center to the Horseshoe path

      horseshoe_scale:
        min: 0  # Value at the start of the scale
        max: 100  # Value at the end of the scale

      show:
        state_marker: true  # Show a marker at the current value

      horseshoe_marker:
        attach_to: path  # Place the marker directly on the Horseshoe path
        shape: circle  # Use a circle marker
```
The marker follows the current entity value along the path.

## :material-horseshoe: Show progress and a marker together

Leave state progress enabled and enable the marker as well:

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  horseshoes:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      horseshoe_scale: {}  # Required scale block; uses the default 0–100 linear scale
      show:
        state_progress: true  # Show the filled progress up to the current value
        state_marker: true  # Show a marker at the current value
```
## :material-horseshoe: Move the marker away from the path

Use `offset` to move a path marker relative to the Horseshoe radius. `offset: 0` places the marker on the path. A positive value moves it outward, farther from the center; a negative value moves it inward, closer to the center.

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  horseshoes:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      horseshoe_scale: {}  # Required scale block; uses the default 0–100 linear scale
      show:
        state_marker: true  # Show a marker at the current value
      horseshoe_marker:
        attach_to: path  # Place the marker directly on the Horseshoe path
        shape: circle  # Use a circle marker
        offset: 4  # Move 4 units outward from the radius; use -4 to move inward
```
## :material-horseshoe: Change the marker shape

Use a circle or triangle:

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
        state_marker: true  # Make the marker visible
      horseshoe_marker:
        attach_to: path  # Place the marker directly on the Horseshoe path
        shape: triangle  # Use a triangle marker
        size: 8  # Set the marker size
        rotate: 0  # Rotate the result by 0°
```
Use `icon` instead of `shape` when the marker should be an icon. Do not configure both for the same marker.

## :material-horseshoe: Point to the value from the center

A center marker points from the middle of an arc toward the current value:

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  horseshoes:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      horseshoe_scale: {}  # Required scale block; uses the default 0–100 linear scale
      path:
        type: arc
        radius: 42  # Distance from the center to the Horseshoe path
        arc_degrees: 260  # Draw 260° of the full 360° circle

      show:
        state_marker: true  # Show a marker at the current value

      horseshoe_marker:
        attach_to: center  # Draw the marker from the center toward the value
        icon: mdi:triangle  # Icon shown to the user
```
Center attachment is used with an arc path and requires an icon.

## :material-horseshoe: Move the start and end of a center pointer

For a center marker, `start_offset` changes where the pointer starts and `end_offset` changes where it stops. Positive offsets move outward from the center; negative offsets move inward.

```yaml linenums="1"
entities:
  - entity: sensor.example  # Entity displayed by this Horseshoe

layout:
  horseshoes:
    - entity_index: 0  # Use the first entity configured above
      horseshoe_scale: {}  # Required scale block; uses the default 0–100 linear scale
      xpos: 50  # Horizontal center of the Horseshoe
      ypos: 50  # Vertical center of the Horseshoe
      path:
        type: arc  # Center pointers require an arc path
        radius: 42
      show:
        state_marker: true  # Make the marker visible
      horseshoe_marker:
        attach_to: center      # Draw the pointer from the center toward the current value
        icon: mdi:arrow-up-bold # Use this icon as the pointer shape
        start_offset: 4        # Start 4 units away from the exact center
        end_offset: -2         # Stop 2 units before reaching the Horseshoe path
```
Use a positive `end_offset` when the pointer should extend beyond the Horseshoe path instead.

## :material-horseshoe: Configuration options

A marker can sit **on the Horseshoe path** or act as a **pointer from the center**. Keep those two uses separate: a path marker can use a simple shape or icon, while a center pointer requires an icon and an arc path.

### Marker on the path

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `attach_to` | `path` | No | `path` | Keeps the marker on the current-value position of the Horseshoe path. |
| `shape` | `circle`, `triangle` | No | `circle` when no icon is configured | `circle` draws a round marker; `triangle` draws a directional triangular marker. Do not set this together with `icon`. |
| `icon` | string | No | Not set | Uses a Home Assistant icon or `url(...)` instead of `shape`. |
| `offset` | number | No | `0` | Moves the marker relative to the path: `0` = on the path, positive = outward, negative = inward. |
| `size` | number | No | `horseshoe_state.width` | Sets the path-marker size; for a circle this is the diameter. |

### Pointer from the center

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `attach_to` | `center` | Yes | — | Set to `center`. This form requires `path.type: arc`. |
| `icon` | string | Yes | — | Icon used as the center pointer. A center pointer does not use `shape`. |
| `start_offset` | number | No | `0` | Changes where the pointer starts: positive starts farther from the center, negative starts behind the center. |
| `end_offset` | number | No | `0` | Changes where the pointer ends: negative stops before the Horseshoe path, positive extends beyond it. |

### Options for both marker forms

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `aspectratio` | number | No | `1` | Width/height ratio for icon or triangle markers. For a center pointer, the offsets determine its length and `aspectratio` determines its width. |
| `rotate` | number | No | `0` | Rotates the marker/icon in degrees when its visual direction needs correction. |
| `styles` | mapping | No | Current `horseshoe_state` appearance | Overrides marker fill, stroke, opacity, and other SVG/CSS appearance. |

## :material-horseshoe: Related documentation

- [Horseshoe overview](horseshoe-overview.md)
- [Value and progress](horseshoe-scale-and-state.md)
- [Path shapes](horseshoe-path-shapes.md)
