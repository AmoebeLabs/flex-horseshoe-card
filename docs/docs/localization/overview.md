---
template: main.html
title: Localization and formatting
description: Use Home Assistant names, units, icons, precision, locale, and state formatting in Flexible Horseshoe Card.
tags:
  - Localization
  - Formatting
---

# Localization and formatting

FHS uses the name, state, unit, precision, icon, area, and locale known by Home Assistant. In many cards, defining the entity is enough.

## :material-horseshoe: Start with the entity

```yaml linenums="1"
entities:
  - entity: sensor.energy_today
```

Entity tools can now show the localized name, state, unit, icon, and area.

## :material-horseshoe: Override the display

Add an override only where this card should look different:

```yaml linenums="1"
entities:
  - entity: sensor.energy_today
    name: Today
    decimals: 2
    unit: kWh
    icon: mdi:flash
```

## :material-horseshoe: Formatting options

=== "Number formatting"

    ```yaml linenums="1"
    entities:
      - entity: sensor.energy_today
        format:
          separator: false
          decimals_min: 0
          decimals_max: 2
    ```

=== "Raw state"

    ```yaml linenums="1"
    entities:
      - entity: sensor.device_mode
        format:
          raw_state_keep: true
          raw_state_clean: true
    ```

=== "Specific locale"

    ```yaml linenums="1"
    entities:
      - entity: sensor.energy_today
        format:
          locale: nl-NL
    ```

| Option | Use |
| --- | --- |
| `separator` | Shows or removes number grouping. |
| `decimals_min` | Sets the minimum displayed decimal places. |
| `decimals_max` | Sets the maximum displayed decimal places. |
| `raw_state_keep` | Displays the entity state without normal formatting. |
| `raw_state_clean` | Replaces underscores in a raw state with spaces. |
| `locale` | Uses a specific locale for this entity. |

## :material-horseshoe: Related

- [Entities](../card-basics/entities.md)
- [Entity state](../tools/entities/entity-state-tool.md)
- [Entity icon](../tools/entities/entity-icon-tool.md)
