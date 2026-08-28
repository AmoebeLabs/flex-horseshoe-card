---
template: main.html
title: Your first card
description: Create a Flexible Horseshoe Card with a gauge, icon, and current entity state.
tags:
  - Getting started
  - Horseshoe
  - YAML
---

# Your first card

Create a horseshoe gauge that shows an entity icon and its current state in the center.

<!-- Add a screenshot of the completed first card here. -->

## :material-horseshoe: Add the card

Open a dashboard in edit mode, add a Manual card, and enter:

```yaml linenums="1"
type: custom:flex-horseshoe-card

entities:
  - entity: sensor.living_room_temperature

layout:
  aspectratio: 1/1

  horseshoes:
    - entity_index: 0
      xpos: 50
      ypos: 50
      radius: 40
      horseshoe_scale:
        min: 0
        max: 40
      show:
        horseshoe_style: colorstop
      color_stops:
        colors:
          0: "#42a5f5"
          20: "#66bb6a"
          30: "#f9a825"
          40: "#d32f2f"

  icons:
    - entity_index: 0
      xpos: 50
      ypos: 39
      size: 4

  states:
    - entity_index: 0
      xpos: 50
      ypos: 57
      show:
        uom: end
      styles:
        font-size: 1.6em
        font-weight: bold
        text-anchor: middle
```

Replace `sensor.living_room_temperature` with an entity from your Home Assistant instance.

## :material-horseshoe: Match the scale to your entity

The example uses a scale from `0` to `40`. Change these values when your entity uses another range:

```yaml linenums="1"
horseshoe_scale:
  min: -10
  max: 50
```

The horseshoe fills according to the entity state. Its color follows the configured color stops.

## :material-horseshoe: Position the contents

The card coordinate system runs from `0` to `100`. The horseshoe is centered at `50, 50`. The icon and state use the same horizontal center and different vertical positions.

Adjust `xpos`, `ypos`, `radius`, and text styles until the card matches your dashboard.

## :material-horseshoe: Continue building

- [Card overview](../card-basics/card-overview.md)
- [Entities](../card-basics/entities.md)
- [Positioning and sizing](../card-basics/positioning-and-sizing.md)
- [Horseshoe gauges](../tools/horseshoe/horseshoe-overview.md)
- [Color stops](../appearance/color-stops.md)
