---
template: main.html
title: Localization
description: Use Home Assistant localization for names, states, units, icons, state colors, and number formatting.
tags:
  - Localization
---

# Localization

The Flexible Horseshoe Card uses Home Assistant localization wherever possible.

In most cases, you only need to define the entity. The card then uses the information Home Assistant already knows about that entity, such as its name, state, unit of measurement, icon, state-based icon, state color, area, and number formatting.

This keeps the card configuration shorter and makes the card behave more like native Home Assistant cards.

## :material-horseshoe: What is handled automatically?

When an entity is added to the `entities` section, the card tries to use the localized Home Assistant values for that entity.

This includes:

| Value | Description |
| :---- | :---------- |
| Entity name | The friendly name known by Home Assistant |
| Area | The Home Assistant area assigned to the entity |
| State | The current state of the entity |
| Unit | The unit of measurement, such as `kWh`, `W`, `%`, or `°C` |
| Precision | The number of decimals configured or exposed by the entity |
| Number formatting | Localized number formatting from Home Assistant |
| Icon | The icon assigned to the entity |
| State-based icon | Icons that change based on the entity state |
| Icon color | State-based colors, such as light colors or weather-related colors |

For example, a light entity can use its normal Home Assistant icon and color behavior. A weather entity can use the icon that matches the current weather state. A sensor can use its own unit and precision without having to repeat those values in the card configuration.

## :material-horseshoe: Basic entity definition

For many entities, a minimal definition is enough:

```yaml
entities:
  - entity: sensor.energy_today
```

With only this configuration, the card can use the entity state, friendly name, unit, precision, icon, and other Home Assistant-provided metadata.

This is usually the best starting point. Only add extra fields when you want to change something for this specific card.

## :material-horseshoe: Names, units, and precision

The card follows the entity information from Home Assistant as much as possible.

If Home Assistant knows that a sensor uses `kWh`, the card can display that unit. If the entity has a configured precision, that precision is also respected.

For example, if an energy sensor is configured in Home Assistant with two decimals and a unit of `kWh`, the card can display the value using those settings without requiring additional YAML.

You can still override these values in the `entities` section when needed:

```yaml
entities:
  - entity: sensor.energy_today
    name: Today
    decimals: 2
    unit: kWh
```

Use overrides when the card needs a shorter label, a different display precision, or a custom unit for presentation.

## :material-horseshoe: Icons and state-based icons

Home Assistant entities often provide their own icon. Some icons can also change depending on the state.

For example:

- a light can show a different visual state when it is on or off
- a weather entity can show an icon that matches the current condition
- a device or sensor can use the icon assigned in Home Assistant

The card can use those icons automatically.

You can also override the icon in the `entities` section:

```yaml
entities:
  - entity: sensor.energy_today
    icon: mdi:flash
```

This is useful when you want a card-specific icon without changing the entity itself in Home Assistant.

## :material-horseshoe: State colors

Some Home Assistant entities provide state-based colors.

A color light, for example, can expose a color that matches the current light color. Other domains can also provide state-based coloring or theme-aware icon colors.

The card tries to use this behavior where it makes sense, so icons and visual elements can feel consistent with the rest of Home Assistant.

You can still define your own colors with styles, color stops, or templates if you want more control.

## :material-horseshoe: Overriding localized values

Automatic localization is meant to reduce configuration, not remove control.

You can override Home Assistant values in the `entities` section whenever needed:

```yaml
entities:
  - entity: sensor.dsmr_reading_electricity_currently_delivered
    name: Total
    decimals: 2
    unit: kW
    icon: mdi:transmission-tower
    area: Electricity
```

Common reasons to override values:

- use a shorter name on a small card
- show a different icon for this specific dashboard
- change the number of decimals
- display a custom unit
- use a custom area label
- make several cards use the same naming style

## :material-horseshoe: Recommended approach

Start with the entity only:

```yaml
entities:
  - entity: sensor.energy_today
```

Then add overrides only where the default Home Assistant values do not fit the card design.

This keeps your YAML clean and makes the card easier to maintain. If you later change the entity name, unit, precision, icon, or area in Home Assistant, the card can follow those changes automatically unless you have explicitly overridden them.

## :material-horseshoe: Related sections

Localization affects the values shown by several layout sections:

| Section | Uses localized entity data for |
| :------ | :----------------------------- |
| `areas` | Area labels |
| `names` | Entity names or overridden names |
| `states` | State values, units, decimals, and formatting |
| `icons` | Entity icons, overridden icons, and state-based icons |

For layout and styling options, see the documentation for Home Assistant entity elements.
