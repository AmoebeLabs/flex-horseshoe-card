---
template: main.html
title: Localization
description: Use Home Assistant localization and entity metadata for translated names, states, units, icons, state colors, and number formatting.
tags:
- Localization
---

# Localization

The Flexible Horseshoe Card uses Home Assistant localization and entity metadata like precision and unit wherever possible.

In many cases, defining the entity is enough. The card can then use information that Home Assistant already knows, including the entity name, state, unit, icon, area, precision, state-based icon, state color, and localized number formatting.

This keeps the configuration shorter and helps the card behave more like a native Home Assistant card.

## :material-horseshoe: What is handled automatically?

When you add an entity to the `entities` section, the card attempts to use the localized values and metadata provided by Home Assistant.

This may include:

| Value             | Description                                                      |
| :---------------- | :--------------------------------------------------------------- |
| Entity name       | Uses the friendly name known by Home Assistant.                  |
| Area              | Uses the Home Assistant area assigned to the entity.             |
| State             | Displays the current entity state.                               |
| Unit              | Uses the entity unit, such as `kWh`, `W`, `%`, or `°C`.          |
| Precision         | Uses the number of decimals configured or exposed by the entity. |
| Number formatting | Applies localized number formatting from Home Assistant.         |
| Icon              | Uses the icon assigned to the entity.                            |
| State-based icon  | Uses an icon that changes with the entity state when available.  |
| Icon color        | Uses state-based or theme-aware colors when supported.           |

For example, a light can use its normal Home Assistant icon and color behavior. A weather entity can show the icon that matches the current condition. A sensor can use its own unit and precision without repeating those values in the card YAML.

## :material-horseshoe: Basic entity definition

For many entities, a minimal definition is enough:

```yaml linenums="1"
entities:
  - entity: sensor.energy_today
```

With only this configuration, the card can use the entity state, friendly name, unit, precision, icon, and other metadata supplied by Home Assistant.

This is usually the best starting point. Add extra fields only when the card needs to display something differently.

## :material-horseshoe: Names, units, and precision

The card follows Home Assistant entity metadata as closely as possible.

If Home Assistant knows that a sensor uses `kWh`, the card can display that unit automatically. If the entity provides a configured precision, the card can use that as well.

For example, an energy sensor configured with two decimal places and a unit of `kWh` can be displayed with those settings without additional YAML.

You can still override these values in the `entities` section:

```yaml linenums="1"
entities:
  - entity: sensor.energy_today
    name: Today
    decimals: 2
    unit: kWh
```

Use overrides when the card needs a shorter label, a different precision, or a custom display unit.

## :material-horseshoe: Icons and state-based icons

Home Assistant entities often provide their own icon. Some domains also change the icon according to the current state.

For example:

* a light can use a different visual state when it is on or off;
* a weather entity can show an icon that matches the current condition;
* a device or sensor can use the icon assigned in Home Assistant.

The card can use those icons automatically.

You can also override the icon for a specific card:

```yaml linenums="1"
entities:
  - entity: sensor.energy_today
    icon: mdi:flash
```

This is useful when you want a dashboard-specific icon without changing the entity itself in Home Assistant.

## :material-horseshoe: State colors

Some Home Assistant entities provide state-based colors.

A color light, for example, may expose a color that reflects its current light color. Other domains may provide state colors or theme-aware icon colors.

The card uses this behavior where supported, helping entity icons and visual elements remain consistent with the rest of Home Assistant.

When more control is needed, you can still define your own colors with styles, color stops, or templates.

## :material-horseshoe: Overriding localized values

Automatic localization is intended to reduce configuration, not limit control.

You can override Home Assistant values in the `entities` section whenever needed:

```yaml linenums="1"
entities:
  - entity: sensor.dsmr_reading_electricity_currently_delivered
    name: Total
    decimals: 2
    unit: kW
    icon: mdi:transmission-tower
    area: Electricity
```

Common reasons to use overrides include:

* shortening a name for a compact card;
* choosing a different icon for a specific dashboard;
* changing the number of displayed decimals;
* showing a custom unit;
* using a custom area label;
* applying a consistent naming style across several cards.

## :material-horseshoe: Formatting overrides

The `format` option lets you override the default Home Assistant formatting behavior.

[:octicons-tag-24: v5.4.7-dev.7][github-releases]

=== "Remove separator"

    ```yaml title="Remove separator and limit decimals" linenums="1" hl_lines="7-10"
    - type: custom:flex-horseshoe-card
      entities:
        - entity: sensor.dsmr_reading_electricity_currently_delivered
          name: "Total"
          icon: mdi:fire
          area: house
          format:
            separator: false    # Remove thousands separator
            decimals_min: 0     # Minimum number of decimals
            decimals_max: 2     # Maximum number of decimals
    ```

=== "Display raw state"
    ```yaml title="Display raw entity state as received from integration" linenums="1" hl_lines="7-9"
    - type: custom:flex-horseshoe-card
      entities:
        - entity: sensor.dsmr_reading_electricity_currently_delivered
          name: "Total"
          icon: mdi:fire
          area: house
          format:
            raw_state_keep: true  # Keep the raw state without normal formatting
            raw_state_clean: true # Remove underscores from the raw state
    ```
=== "Use a specific locale"
    ```yaml title="Specify locale for translations and formatting" linenums="1" hl_lines="7-10"
    - type: custom:flex-horseshoe-card
      entities:
        - entity: sensor.dsmr_reading_electricity_currently_delivered
          name: "Total"
          icon: mdi:fire
          area: house
          format:
            locale: 'nl-NL' # Force Dutch translations and formatting
    ```

## :material-horseshoe: Recommended approach

Start with the entity only:

```yaml linenums="1"
entities:
  - entity: sensor.energy_today
```

Then add overrides only where the default Home Assistant values do not fit the card design.

This keeps the YAML concise and easier to maintain. If the entity name, unit, precision, icon, or area later changes in Home Assistant, the card can follow that update automatically unless the value has been explicitly overridden.

## :material-horseshoe: Related sections

Localization affects several layout sections:

| Section  | Uses localized entity data for                         |
| :------- | :----------------------------------------------------- |
| `areas`  | Area labels.                                           |
| `names`  | Entity names or card-specific overrides.               |
| `states` | State values, units, decimals, and number formatting.  |
| `icons`  | Entity icons, overridden icons, and state-based icons. |

For layout and styling options, see [Home Assistant Entity Elements](../sections/entities-section.md).

<!--- External References... --->

[github-releases]: https://github.com/amoebelabs/flex-horseshoe-card/releases/
