# FHS - Masks, Clips And Gradients

## Current Scope

This document describes the implemented masks/clips support in this branch.

Supported definition sections:

- `layout.gradients`
- `layout.clips`
- `layout.masks`

Supported mask/clip source shapes:

- `rectangles`
- `circles`
- `arcs`

Supported visible item usage:

- `clip: name`
- `mask: name`
- `mask: [name_a, name_b]` for nested masks
- `styles: fill: gradient(name)` or `stroke: gradient(name)`

Not part of this PR:

- path-based clip/mask definitions
- horseshoe-as-mask source definitions
- runtime `color_stop` values inside reusable gradients

## Basic Model

- `clip` is a hard boundary rendered as SVG `<clipPath>`.
- `mask` is an alpha/transparency layer rendered as SVG `<mask>`.
- `layout.gradients`, `layout.clips`, and `layout.masks` are rendered inside SVG `<defs>`.
- Visible layout items reference masks/clips by user-facing name.
- Generated SVG ids are scoped with the card id, so multiple cards can reuse the same config names.

Example:

```yaml
layout:
  gradients:
    circle-fade:
      type: radial
      cx: 50
      cy: 50
      r: 50
      stops:
        - offset: 0
          color: white
          opacity: 1
        - offset: 75
          color: white
          opacity: 1
        - offset: 100
          color: white
          opacity: 0

  clips:
    avatar-circle:
      circles:
        - dxpos: 0
          dypos: 0
          radius: 34

  masks:
    avatar-soft-edge:
      circles:
        - dxpos: 0
          dypos: 0
          radius: 34
          styles:
            - fill: gradient(circle-fade)

  icons:
    - id: avatar
      icon: url(/local/images/avatar.jpg)
      xpos: 50
      ypos: 50
      icon_size_percent: 34
      clip: avatar-circle
      mask: avatar-soft-edge
```

## Coordinate Rules

Clip/mask definitions use SVG `userSpaceOnUse`.

Absolute source shapes use `xpos`/`ypos` just like normal layout items.

Relative source shapes use `dxpos`/`dypos` and are rendered per visible item using that item as anchor:

```yaml
clips:
  circle-window:
    circles:
      - dxpos: 0
        dypos: 0
        radius: 34
```

This lets one clip or mask definition be reused by multiple items without repeating absolute positions.

## Gradients

Gradients are defined under `layout.gradients` and referenced from styles with `gradient(name)`.

```yaml
layout:
  gradients:
    blue-radial:
      type: radial
      cx: 50
      cy: 35
      r: 65
      stops:
        - offset: 0
          color: '#e3f2fd'
        - offset: 45
          color: '#42a5f5'
        - offset: 100
          color: '#0d47a1'

  rectangles:
    - id: clipped_square
      xpos: 25
      ypos: 26
      width: 37
      height: 37
      clip: circle-window
      styles:
        - fill: gradient(blue-radial)
```

Numeric gradient coordinates and offsets use the same user-facing `0..100` style as the rest of FHS config. The renderer converts them to SVG percentages for `objectBoundingBox` gradients.

## Clips

A clip provides a hard boundary.

```yaml
clips:
  circle-window:
    circles:
      - dxpos: 0
        dypos: 0
        radius: 34

rectangles:
  - id: clipped_square
    xpos: 25
    ypos: 26
    width: 37
    height: 37
    clip: circle-window
    styles:
      - fill: gradient(blue-radial)
```

Result: the rectangle renders as a hard circle.

## Masks

A mask controls alpha/transparency.

White means visible. Transparent means hidden. Normal SVG alpha mask behavior applies.

```yaml
masks:
  top-notch:
    rectangles:
      - dxpos: 0
        dypos: 0
        width: 39
        height: 26
        radius: 8
        styles:
          - fill: white
    circles:
      - dxpos: 0
        dypos: -13
        radius: 13
        styles:
          - fill: gradient(notch-soft-mask)

rectangles:
  - id: notched_card
    xpos: 25
    ypos: 73
    width: 39
    height: 26
    radius: 8
    mask: top-notch
    styles:
      - fill: '#43a047'
```

## Nested Masks

Multiple masks can be applied as a list:

```yaml
mask:
  - mask_a
  - mask_b
```

The renderer nests the masks. This is important because multiple shapes inside one SVG mask are painted together, while nested masks constrain each other.

## Soft Arc

`soft_arc` is a specialized helper for fading an arc-shaped item without forcing users to hand-tune rectangle positions and sizes.

It uses an existing arc clip definition as geometry source:

```yaml
clips:
  image-arc-window:
    arcs:
      - dxpos: 0
        dypos: 0
        radius: 21
        arc_degrees: 260
        rotate: 0
```

Then the mask defines two fade directions:

```yaml
masks:
  image-arc-soft:
    soft_arc:
      clip: image-arc-window
      edge:
        stops_start: 75
        stops:
          - offset: 0
            opacity: 1
          - offset: 100
            opacity: 0
      chord:
        stops_start: 75
        stops:
          - offset: 0
            opacity: 1
          - offset: 50
            opacity: 0.5
          - offset: 100
            opacity: 0
```

Usage:

```yaml
icons:
  - id: map_image
    entity_index: 0
    xpos: 50
    yposc: 50
    icon_size_percent: 42
    icon: url(/local/images/backgrounds/map-background.jpg)
    clip: image-arc-window
    mask: image-arc-soft
```

Meaning:

- `edge` fades from the arc center toward the round outer edge.
- `chord` fades from the arc center toward the straight chord line between the arc start and end points.
- `stops_start` tells where the configured `stops` begin.
- `stops.offset` is local to the range from `stops_start` to the edge/chord.

This avoids the old hand-tuned config with `dypos`, `width`, and `height` for the chord fade.

## Complete Test Example

The current working test card lives in:

```text
masks-clips-example.yaml
```

It covers:

- a rectangle clipped by a circle
- a rectangle with a soft notch mask
- a rectangle masked by an arc
- an arc clipped by an arc clip
- an image using `soft_arc` edge and chord fades

## Implementation Notes

- Definitions are normalized once during card setup.
- Relative definitions with `dxpos`/`dypos` are rendered per visible item.
- Gradients are card-scoped.
- Clip and mask ids are card-scoped.
- `gradient(name)` is translated to the scoped `url(#...)` form during render-style processing.
- `soft_arc` generates item-scoped gradients and masks because its geometry depends on the visible item using it.

## Separate Follow-Up

Runtime item colors inside reusable gradients are intentionally not part of this PR. See:

```text
gradient-runtime-color-architecture.md
```
