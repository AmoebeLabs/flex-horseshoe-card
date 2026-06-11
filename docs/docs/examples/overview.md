---
template: main.html
title: Installation of the card
description: The preferred way to install the flexible horseshoe card is using HACS from within your Home Assistant dashboard.\
tags:
  - HACS
  - Installation
---

The preferred method of using this card is by [`decluttering card`](https://github.com/custom-cards/decluttering-card) templates. You define the layout and default options in this template and use the template in your Lovelace config. This config stays clean this way: you only specify the entities, attributes, units and icons which are displayed according to the layout defined in the template.

The advice will become obvious once you scroll throught the list of card options :smile:

## A basic example

This is the card 1 of the examples. It shows the basic definition for the flexible horseshoe card using the darksky sensor with the temperature attribute and its unit and decimals.

![](../examples/flex-horseshoe-card--example-card-1.png)

```yaml
- type: 'custom:flex-horseshoe-card'
  entities:
    - entity: weather.dark_sky
      attribute: temperature
      decimals: 1
      unit: '°C'
      area: De Maan
  show:
    horseshoe_style: 'lineargradient'
  layout:
    states:
      # Refers to the first entity in the list, ie index 0
      # State value is positioned at (50%,60%) with a large font size
      # The size of the units are automatically calculated at 60% of the
      # state value font size and shifted upwards.
      # The default font color is the theme defined primary-text-color.
      - id: 0
        entity_index: 0
        xpos: 50
        ypos: 60
        styles:
          - font-size: 3.5em;
    areas:
      # Refers to the first entity in the list, ie index 1
      # Area value is positioned at (50%,35%) with font-size 1.5 and
      # an opacity of 80%.
      # The default font color is the theme defined primary-text-color.
      - id: 0
        entity_index: 0
        xpos: 50
        ypos: 35
        styles:
          - font-size: 1.5em;
          - opacity: 0.8;

  # Scale set to -10 to +40 degrees celcius
  horseshoe_scale:
    min: -10
    max: 40
  # color stop list with two colors. With the `lineargradient` fill style, only the
  # colors are used. The thresholds are ignored with this setting.
  color_stops:
    10: 'red'
    18: 'blue'
```

## Extending the basic example with two more entities and a horizontal line

This is card 4 of the examples. It extends the basic definition of card 1 with two more attributes from the darksky sensor and adds a horizontal line as a divider. We also swap the `area` with the `name` of the first entity.

![](../examples/flex-horseshoe-card--example-card-4.png)

```yaml
- type: 'custom:flex-horseshoe-card'
  entities:
    - entity: weather.dark_sky
      attribute: temperature
      decimals: 1
      name: '4: Ut Weer'
      unit: '°C'
    - entity: weather.dark_sky
      attribute: humidity
      decimals: 0
      unit: '%'
      icon: mdi:water-percent
    - entity: weather.dark_sky
      attribute: pressure
      decimals: 0
      unit: 'hPa'
      icon: mdi:gauge
  show:
    horseshoe_style: 'lineargradient'
  layout:
    hlines:
      # A horizontal line. Not connected to an entity
      - id: 0
        xpos: 50
        ypos: 42
        length: 40
        styles:
          - stroke: var(--primary-text-color);
          - stroke-width: 5;
          - stroke-linecap: round;
          - opacity: 0.7;
    states:
      # States 0 refers to the first entity in the list, ie index 0
      - id: 0
        entity_index: 0
        xpos: 50
        ypos: 34
        styles:
          - font-size: 3em;
      # States 1 refers to the second entity in the list, ie index 1
      - id: 1
        entity_index: 1
        xpos: 40
        ypos: 57
        styles:
          - text-anchor: start;
          - font-size: 1.5em;
      # States 2 refers to the third entity in the list, ie index 2
      - id: 2
        entity_index: 2
        xpos: 40
        ypos: 72
        styles:
          - text-anchor: start;
          - font-size: 1.5em;
    icons:
      # Icons 0 refers to the second entity in the list, ie index 1
      - id: 0
        entity_index: 1
        xpos: 37
        ypos: 57
        align: end
        size: 1.3
      # Icons 1 refers to the third entity in the list, ie index 2
      - id: 1
        entity_index: 2
        xpos: 37
        ypos: 72
        align: end
        size: 1.3
    names:
      # Names 0 refers to the first entity in the list, ie index 0
      - id: 0
        entity_index: 0
        xpos: 50
        ypos: 95

  # Scale set to -10 to +40 degrees celcius
  horseshoe_scale:
    min: -10
    max: 40
  # color stop list with 10 colors defined in the theme. With the `lineargradient` fill style, only the
  # first (16:) and last (25:) colors are used. The thresholds are ignored with this setting.
  color_stops:
    16: '#FFF6E3'
    17: '#FFE9B9'
    18: '#FFDA8A'
    19: '#FFCB5B'
    20: '#FFBF37'
    21: '#ffb414'
    22: '#FFAD12'
    23: '#FFA40E'
    24: '#FF9C0B'
    25: '#FF8C06'
```

## Extending the basic example with a lot more options like actions and animations

This is the card 12 of the examples. It displays the wattage (memory sensor is used for this value) and the state of two lights. Both ligts can be switched on and off. The left light uses a predefined animation (yello and zoomout), the right light uses a user defined animation.

Let's see how that looks :smile:

![](../examples/flex-horseshoe-card--example-card-12.png)

```yaml
- type: 'custom:flex-horseshoe-card'
  entities:
    # Abuse the memory_use_percent sensor as the wattage the bulbs use. Just to show the possibilities
    - entity: sensor.memory_use_percent
      decimals: 0
      name: '12: Two Bulbs'
      area: Hestia
      unit: W
      decimals: 0
      tap_action:
        action: more-info

    # The left light displayed on the card. Index 1
    - entity: light.1st_floor_hall_light
      name: 'hall'
      icon: mdi:lightbulb
      tap_action:
        action: call-service
        service: light.toggle
        service_data: { "entity_id" : "light.1st_floor_hall_light" }

    # The right light displayed on the card. Index 2
    - entity: light.gledopto
      name: 'opto'
      icon: mdi:lightbulb
      tap_action:
        action: call-service
        service: light.toggle
        service_data: { "entity_id" : "light.gledopto" }

  animations:
    # Animations for the second entity, index 1
    entity.1:
      - state: 'on'
        circles:
          - animation_id: 11
            styles:
              - fill: var(--theme-gradient-color-03);
              - opacity: 0.9;
              - transform-origin: 30% 50%;
              - animation: jello 1s ease-in-out both;
        icons:
          - animation_id: 10
            styles:
              - fill: black;
      - state: 'off'
        circles:
          - animation_id: 11
            reuse: true
            styles:
              - transform-origin: 30% 50%;
              - animation: zoomOut 1s ease-out both;
        icons:
          - animation_id: 10
            styles:
              - fill: var(--primary-text-color);

    # Animations for the third entity, index 2
    entity.2:
      - state: 'on'
        circles:
          - animation_id: 21
            styles:
              - fill: var(--theme-gradient-color-03);
              - stroke-width: 2;
              - stroke: var(--primary-background-color);
              - opacity: 0.9;
              - stroke-dasharray: 94;
              - stroke-dashoffset: 1000;
              - animation: stroke 2s ease-out forwards;

        icons:
          - animation_id: 20
            styles:
              - fill: black;

      - state: 'off'
        circles:
          - animation_id: 21
            styles:
              - fill: var(--primary-background-color);
              - opacity: 0.7;
        icons:
          - animation_id: 20
            styles:
              - fill: var(--primary-text-color);

  show:
    horseshoe_style: 'fixed'
  layout:
    states:
      - id: 0
        entity_index: 0
        animation_id: 0
        xpos: 50
        ypos: 28
        uom_font_size: 1.5
        styles:
          - font-size: 2.5em;
          - opacity: 0.9;
    names:
      - id: 0
        animation_id: 0
        entity_index: 0
        xpos: 50
        ypos: 100
        styles:
          - font-size: 1.2em;
          - opacity: 0.7;
      - id: 1
        animation_id: 1
        entity_index: 1
        xpos: 30
        ypos: 78
        styles:
          - font-size: 1.2em;
      - id: 2
        animation_id: 2
        entity_index: 2
        xpos: 70
        ypos: 78
        styles:
          - font-size: 1.2em;
    icons:
      - id: 0
        animation_id: 10
        xpos: 30
        ypos: 55
        entity_index: 1
        icon_size: 3.5
        styles:
          - color: var(--primary-text-color);;
      - id: 1
        animation_id: 20
        xpos: 70
        ypos: 55
        entity_index: 2
        icon_size: 3.5
        styles:
          - color: var(--primary-text-color);;
    circles:
      - animation_id: 3
        xpos: 30
        ypos: 50
        radius: 35
        styles:
          - fill: var(--primary-background-color);
      - animation_id: 11
        xpos: 30
        ypos: 50
        radius: 30
        entity_index: 1

      - animation_id: 2
        xpos: 70
        ypos: 50
        radius: 35
        styles:
          - fill: var(--primary-background-color);
      - animation_id: 21
        xpos: 70
        ypos: 50
        radius: 30
        entity_index: 2

  horseshoe_scale:
    min: 0
    max: 100
    color: 'var(--primary-background-color)'
  horseshoe_state:
    color: '#FFDA8A'
  color_stops:
    0: '#FFF6E3'
    10: '#FFE9B9'
    20: '#FFDA8A'
    30: '#FFCB5B'
    40: '#FFBF37'
    50: '#ffb414'
    60: '#FFAD12'
    70: '#FFA40E'
    80: '#FF9C0B'
    90: '#FF8C06'
  # The @keyframes stroke runs the stroke animation for the second lightbulb, entity light.gledopto
  style: |
    @keyframes stroke { to { stroke-dashoffset: 0; } }
```
