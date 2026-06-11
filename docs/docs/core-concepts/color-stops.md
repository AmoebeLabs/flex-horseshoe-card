---
template: main.html
title: Color Stops
description: Brrrrrr.
tags:
  - Color Stops
---

As of v5.4.1

This example shows how to to define a colorstop for an entity. The first one is a `state`, the second one an `area`.
<br>In both cases, **the numeric** state of the entity determines the color.

```yaml
- type: 'custom:flex-horseshoe-card'
  entities:
    - entity: sensor.memory_use_percent
    - entity: light.1st_floor_hall_light

  states:
    - id: 0
      entity_index: 0
      xpos: 50
      ypos: 30
      styles:
        - font-size: 3em;
      color_stops:
        0: 'blue'
        1: 'green'
        2: 'yellow'
        3: 'orange'
        4: 'red'
        5: 'purple'

  areas:
    - id: 0
      entity_index: 0
      xpos: 50
      ypos: 85
      styles:
        - font-size: 1.2em;
      color_stops:
        0: 'blue'
        1: 'green'
        2: 'yellow'
        3: 'orange'
        4: 'red'
        5: 'purple'
```
