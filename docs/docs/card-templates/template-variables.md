---
template: main.html
title: Template variables
description: Pass entities, labels, scale values, and other settings into reusable Flexible Horseshoe Card card templates.
tags:
  - Card templates
  - Variables
---

# Template variables

Template variables are values that differ between instances of the same card design.

## :material-horseshoe: Define placeholders

Use a descriptive placeholder wherever the template needs a supplied value:

```yaml linenums="1"
template:
  type: card
  defaults:
    - name: Temperature
    - unit: °C

card:
  entities:
    - entity: "[[entity]]"
      name: "[[name]]"
      unit: "[[unit]]"
```

A default makes the variable optional for the card instance. A placeholder without a default must be supplied.

## :material-horseshoe: Supply values

```yaml linenums="1"
template:
  name: room_temperature
  variables:
    - entity: sensor.bedroom_temperature
    - name: Bedroom
```

The instance uses the default unit and supplies its own entity and name.

## :material-horseshoe: Pass lists and configuration blocks

A variable can also contain a list or map:

```yaml linenums="1"
template:
  name: room_overview
  variables:
    - rooms:
        - Living room
        - Bedroom
        - Study
```

Use variables for meaningful differences between card instances. Keep state-dependent values in [JavaScript templates](../dynamic/javascript-templates.md).

## :material-horseshoe: Related

- [Using card templates](using-card-templates.md)
- [JavaScript templates](../dynamic/javascript-templates.md)
