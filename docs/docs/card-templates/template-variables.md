---
template: main.html
title: Template variables
description: Pass entities, labels, scale values, and other settings into reusable Flexible Horseshoe Card templates.
tags:
  - Card templates
  - Variables
---
# Template variables

Template variables are the values that are allowed to change between instances of the same card template. They let one reusable design accept a different entity, label, scale, list, or configuration block without duplicating the complete card.

This page shows how to define placeholders, give them defaults, supply values from a card instance, and pass larger lists or mappings when needed.

## :material-horseshoe: Add a variable to a template

Use a descriptive placeholder where the value is needed:

```yaml linenums="1"
template:
  type: card
  defaults:
    - name: Temperature  # Name used for this template or supplied value
    - unit: °C  # Unit shown with the value

card:
  entities:
    - entity: "[[entity]]"  # Home Assistant entity used by this card
      name: "[[name]]"  # Name shown to the user
      unit: "[[unit]]"  # Unit shown with the value
```

A placeholder without a default must be supplied by the card instance.

## :material-horseshoe: Supply values when using the template

Template variables let one reusable card structure receive the entity names, text, or other values that differ per use.

```yaml linenums="1"
template:
  name: room_temperature  # Name used for this template or supplied value
  variables:
    - entity: sensor.bedroom_temperature  # Home Assistant entity used by this card
    - name: Bedroom  # Name used for this template or supplied value
```

The default unit remains in use because this instance does not replace it.

## :material-horseshoe: Pass a list or configuration block

A variable can also contain a list or map:

```yaml linenums="1"
template:
  name: room_overview  # Name used for this template or supplied value
  variables:
    - rooms:
        - Living room
        - Bedroom
        - Study
```

## :material-horseshoe: Use variables only for differences between instances

Use a variable when the value is supplied when the card is created. Use a [JavaScript template](../dynamic/javascript-templates.md) when the value should change later with an entity state.

## :material-horseshoe: Related

- [Using card templates](using-card-templates.md)
- [Reuse](../reuse/reuse-introduction.md)
- [JavaScript templates](../dynamic/javascript-templates.md)
