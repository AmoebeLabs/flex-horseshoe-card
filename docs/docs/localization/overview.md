---
template: main.html
title: Localization and formatting
description: Use Home Assistant names, units, icons, precision, locale, and state formatting in Flexible Horseshoe Card.
tags:
  - Localization
  - Formatting
---
# Localization and formatting

The card normally uses the names, states, units, icons, precision, and locale already known by Home Assistant. That keeps a card consistent with the rest of the dashboard without repeating display settings for every entity.

This page shows what the card takes from Home Assistant automatically and how to override formatting only when a particular card should display something differently.

## :material-horseshoe: Use the Home Assistant display

Use Home Assistant formatting when the card should follow the same unit, precision, and locale the user sees elsewhere in Home Assistant.

```yaml linenums="1"
entities:
  - entity: sensor.energy_today  # Home Assistant entity used by this card
```

Entity tools can now use the localized name, state, unit, icon, and area supplied by Home Assistant.

## :material-horseshoe: Override the display for this card

Override formatting locally when this card needs different text or numeric presentation without changing the Home Assistant entity itself.

```yaml linenums="1"
entities:
  - entity: sensor.energy_today  # Home Assistant entity used by this card
    name: Today  # Name shown to the user
    decimals: 2  # Number of decimals to display
    unit: kWh  # Unit shown with the value
    icon: mdi:flash  # Icon shown to the user
```

## :material-horseshoe: Change number formatting

Use the number-format options when the displayed precision or decimal formatting needs to differ from the Home Assistant default.

```yaml linenums="1"
entities:
  - entity: sensor.energy_today  # Home Assistant entity used by this card
    format:
      separator: false  # Do not show grouping separators
      decimals_min: 0  # Minimum number of decimals to display
      decimals_max: 2  # Maximum number of decimals to display
```

## :material-horseshoe: Show a raw state

Use a raw state when the original Home Assistant value is more useful than its normal formatted display.

```yaml linenums="1"
entities:
  - entity: sensor.device_mode  # Home Assistant entity used by this card
    format:
      raw_state_keep: true  # Show the raw Home Assistant state
      raw_state_clean: true  # Replace underscores in the raw state with spaces
```

## :material-horseshoe: Use a specific locale

Set a locale only when this card should format values differently from the active Home Assistant locale.

```yaml linenums="1"
entities:
  - entity: sensor.energy_today  # Home Assistant entity used by this card
    format:
      locale: nl-NL  # Use this locale for formatting
```

## :material-horseshoe: Formatting options

Use this table to choose the smallest formatting override needed; omitted options continue to follow Home Assistant where applicable.

| Option | Use |
| --- | --- |
| `separator` | Shows or removes numeric grouping |
| `decimals_min` | Minimum displayed decimal places |
| `decimals_max` | Maximum displayed decimal places |
| `raw_state_keep` | Shows the raw entity state |
| `raw_state_clean` | Replaces underscores in a raw state with spaces |
| `locale` | Uses a specific locale for this entity |

## :material-horseshoe: Related

- [Entities](../card-basics/entities.md)
- [State](../tools/entities/entity-state-tool.md)
- [Icon](../tools/entities/entity-icon-tool.md)
