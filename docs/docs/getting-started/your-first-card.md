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

Your first card only needs one entity and a few visible items. Building one working card first shows the basic relationship between `entities:` and `layout:` before you add more features.

This page builds a simple Horseshoe card with an entity value, icon, and name, then points to the topics you can add next.

![Your First Horseshoe Card](../assets/screenshots/fhs-your-first-card-horseshoe.png)

## :material-horseshoe: Add the card

Open a dashboard in edit mode, add a **Manual** card, and enter:

```yaml linenums="1"
type: custom:flex-horseshoe-card

entities:
  - entity: sensor.__your_temperature_sensor__  # Home Assistant entity used by this card

layout:
  horseshoes:
    - entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      radius: 45  # Distance from the center to the Horseshoe path
      arc_degrees: 260  # Draw 260° of the full 360° circle

      horseshoe_scale:
        min: 0  # Value at the start of the scale
        max: 40  # Value at the end of the scale

  states:
    - entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 55  # Vertical position; 50 = center of the card
```

Replace `sensor.__your_temperature_sensor__` with one of your own entities.

The Horseshoe shows the entity value between `0` and `40`. The State tool shows the same value in the center.

## :material-horseshoe: Add more to the card

From here, choose what you want to add:

- [Add an icon, name, area, or state](../tools/tools-overview.md#entity-information)
- [Change the Horseshoe](../tools/horseshoe/horseshoe-overview.md)
- [Show history](../tools/sparkline/sparkline-overview.md)
- [Add shapes](../tools/shapes/shapes-overview.md)
- [Add controls](../tools/controls/controls-overview.md)
- [Change colors and appearance](../appearance/appearance-overview.md)

![Flexible Horseshoe Card #36 with horseshoe and sparkline](../assets/screenshots/fhs-card-036-horseshoe-sparkline-power.png)
