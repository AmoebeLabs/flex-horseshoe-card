---
template: main.html
title: Using card templates
description: Define and use reusable Flexible Horseshoe Card templates in Lovelace YAML.
tags:
  - Card templates
  - Reuse
---
# Using card templates

A card template stores a complete reusable card design. You define the common card once and create individual cards by supplying only the entities and settings that differ.

This page shows how to define a user template, use it in a card, reuse shared color stops, and keep system and personal templates organized separately.

## :material-horseshoe: Create a card template

A card template is useful when several complete cards share the same structure and only a few supplied values differ.

```yaml linenums="1"
fhs_user_templates:
  templates:
    room_temperature:
      template:
        type: card
        defaults:
          - name: Temperature  # Name used for this template or supplied value
          - min: 0
          - max: 40

      card:
        entities:
          - entity: "[[entity]]"  # Home Assistant entity used by this card
            name: "[[name]]"  # Name used for this template or supplied value

        layout:
          horseshoes:
            - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
              xpos: 50  # Horizontal position; 50 = center of the card
              ypos: 50  # Vertical position; 50 = center of the card
              radius: 40  # Distance from the center to the Horseshoe path
              horseshoe_scale:
                min: "[[min]]"  # Value at the start of the scale
                max: "[[max]]"  # Value at the end of the scale

          states:
            - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
              xpos: 50  # Horizontal position; 50 = center of the card
              ypos: 50  # Vertical position; 50 = center of the card
```


## :material-horseshoe: Choose what the template supplies

`template.type` tells the card which block in the template is reused. The block name must match the type.

| `template.type` | Matching block | What it supplies |
| --- | --- | --- |
| `card` | `card:` | A complete card configuration. |
| `color_stops` | `color_stops:` | A reusable color-stop configuration. |
| `state_map` | `state_map:` | A reusable state mapping. |

The same mechanism also applies to another template body whose block name matches `template.type`.

## :material-horseshoe: Use the template for a card

Once a template exists, a card can reuse it and provide only the values that are different for that card.

```yaml linenums="1"
type: custom:flex-horseshoe-card

template:
  name: room_temperature  # Name used for this template or supplied value
  variables:
    - entity: sensor.living_room_temperature  # Home Assistant entity used by this card
    - name: Living room  # Name used for this template or supplied value
    - min: -10
    - max: 50
```

The instance contains only the values that make this card different.


## :material-horseshoe: Override values from the template

Values written where the template is used take precedence over the values supplied by the template. Nested mappings are combined, so you can override only one setting inside a larger block. Lists are replaced by the list supplied at the use site rather than appended to the template list.

You can use the short form when no variables are needed:

```yaml linenums="1"
template: room_temperature  # Apply this named card template
```

Use the object form when you also pass variables:

```yaml linenums="1"
template:
  name: room_temperature  # Reuse this named template
  variables:
    - entity: sensor.bedroom_temperature  # Supply the entity placeholder
```

## :material-horseshoe: Give variables default values

Defaults make a variable optional for a card instance. In the example above, `name`, `min`, and `max` already have defaults.

See [Template variables](template-variables.md) for lists and configuration blocks.

## :material-horseshoe: Reuse color stops as a template

Color-stop templates keep the same value-to-color meaning consistent across several cards or tools.

```yaml linenums="1"
# Define one reusable set of temperature colors.
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

Use it with:

```yaml linenums="1"
entities:
  - entity: sensor.temperature  # Entity used by this example

layout:
  rectangles:
    - xpos: 50  # Horizontal center of the Rectangle
      ypos: 50  # Vertical center of the Rectangle
      width: 50  # Rectangle width in card coordinates
      height: 24  # Rectangle height in card coordinates
      entity_index: 0  # Use the first entity configured above
      color_stops:
        template:
          name: temperature_colors  # Name used for this template or supplied value
```
## :material-horseshoe: Keep system and user templates separate

Use `fhs_sys_templates` for distributed templates and `fhs_user_templates` for your own templates.

If the same template name exists in more than one catalog, a template defined for the current view is found before a dashboard-level template. At the same level, `fhs_user_templates` is checked before `fhs_sys_templates`.

## :material-horseshoe: Related

- [Template variables](template-variables.md)
- [Color stops](../appearance/color-stops.md)
- [Reuse](../reuse/reuse-introduction.md)
