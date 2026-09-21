---
template: main.html
title: Circle
description: Add fixed or percentage-sized circles to a Flexible Horseshoe Card.
tags:
  - Circle
  - Card tools
---
# Circle

A Circle is a round visual shape that can be placed anywhere on a card. It can be used as a background, ring, dot, badge, highlight, or another decorative/structural element around other content.

This page shows how to place and size a Circle, choose its fill and border, understand the preferred and legacy radius forms, and optionally let its color follow an entity value.

## :material-horseshoe: Add a Circle

Use a Circle for a round marker, background, border, status indicator, or decorative element.

```yaml linenums="1"
layout:
  circles:
    - xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      radius_percent: 20  # Radius on the normal card coordinate scale
      styles:
        fill: var(--card-background-color)  # Fill color of this item
        stroke: var(--divider-color)  # Border color
```

## :material-horseshoe: Choose the size

For new configurations, prefer `radius_percent`. Despite its historical name, it follows the normal card coordinate scale, so the size is easy to relate to the rest of the layout:

```yaml linenums="1"
layout:
  circles:
    - xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      radius_percent: 20  # Radius on the normal card coordinate scale
```

Older cards can use legacy `radius`, which is kept for compatibility and uses the older Circle sizing scale:

```yaml linenums="1"
layout:
  circles:
    - xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      radius: 40  # Legacy radius; 40 gives the same size as radius_percent: 20
```

Use one radius method, not both. If both are present, `radius_percent` takes precedence.

## :material-horseshoe: Fill the Circle or show only the border

A Circle can use a fill, a border, or both, depending on whether it should look like a solid surface or a ring.

```yaml linenums="1"
layout:
  circles:
    - xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      radius_percent: 20  # Radius on the normal card coordinate scale
      styles:
        fill: none  # Keep the inside transparent; draw only the border
        stroke: var(--primary-color)  # Border color
        stroke-width: 2  # Border thickness
```

## :material-horseshoe: Change color with an entity

Add `entity_index`, `color_stops`, and the matching `item_style` when the Circle color should follow a value or state. See [Color stops](../../appearance/color-stops.md).

## :material-horseshoe: Configuration options

A Circle always needs a position and a visible radius. Choose **one** radius method; do not configure both. `radius_percent` is the preferred current form. `radius` remains available for existing cards and uses the older sizing scale.

### Position the Circle

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `xpos` | number | Yes | — | Horizontal position of the Circle center. `50` is the center of the card. |
| `ypos` | number | Yes | — | Vertical position of the Circle center. `50` is the center of the card. |

### Size the Circle with `radius_percent`

Use this method for new configurations.

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `radius_percent` | number | Yes | — | Circle radius on the normal card coordinate scale. On a 1/1 card, `10` is one tenth of the 100-unit reference size. |

### Size the Circle with legacy `radius`

Use this only when maintaining existing YAML that already uses `radius`.

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `radius` | number | Yes | — | Legacy radius using the older Circle sizing scale. For the same static size, `radius_percent` is half the legacy `radius` value. |

### Options for every Circle

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `entity_index` | entity index | No | Not set | Selects an entity when the Circle color, visibility, or action should follow that entity. |
| `styles` | mapping | No | Default Circle style | Sets the fill, border (`stroke`), opacity, and other SVG/CSS appearance. |
| `color_stops` | mapping | No | Not set | Changes Circle colors from an entity value or state. |

## :material-horseshoe: Related

- [Shapes](shapes-overview.md)
- [Appearance](../../appearance/appearance-overview.md)
- [Color stops](../../appearance/color-stops.md)
