---
template: main.html
title: Using card templates
description: Define and use reusable Flexible Horseshoe Card templates in Lovelace YAML.
tags:
  - Card templates
  - Reuse
---

# Using card templates

A card template stores a reusable card configuration. Each card instance supplies the entity and any values that differ.

## :material-horseshoe: Define a user template

Add the catalog to your Lovelace dashboard or view configuration:

```yaml linenums="1"
fhs_user_templates:
  templates:
    room_temperature:
      template:
        type: card
        defaults:
          - name: Temperature
          - min: 0
          - max: 40

      card:
        entities:
          - entity: "[[entity]]"
            name: "[[name]]"

        layout:
          horseshoes:
            - entity_index: 0
              xpos: 50
              ypos: 50
              radius: 40
              horseshoe_scale:
                min: "[[min]]"
                max: "[[max]]"

          states:
            - entity_index: 0
              xpos: 50
              ypos: 50
```

Values between `[[` and `]]` are supplied by the card instance or by the template defaults.

## :material-horseshoe: Use the template

```yaml linenums="1"
type: custom:flex-horseshoe-card

template:
  name: room_temperature
  variables:
    - entity: sensor.living_room_temperature
    - name: Living room
    - min: -10
    - max: 50
```

The instance only contains values that make this card different.

## :material-horseshoe: Reuse color stops

Templates can also store shared color stops:

```yaml linenums="1"
fhs_user_templates:
  templates:
    temperature_colors:
      template:
        type: color_stops
      color_stops:
        colors:
          -10: "#1565c0"
          0: "#42a5f5"
          20: "#66bb6a"
          30: "#f9a825"
          40: "#d32f2f"
```

Use them in a tool:

```yaml linenums="1"
color_stops:
  template:
    name: temperature_colors
```

## :material-horseshoe: Organize system and user templates

Keep distributed templates in `fhs_sys_templates` and personal templates in `fhs_user_templates`. Updates can then replace system templates without changing your own catalog.

## :material-horseshoe: Related

- [Template variables](template-variables.md)
- [Color stops](../appearance/color-stops.md)
- [Reuse](../reuse/reuse-introduction.md)
