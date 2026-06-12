---
template: main.html
title: Entity definitions
description: Define Home Assistant entities, attributes, icons, units, precision, names, areas, and tap actions for the Flexible Horseshoe Card.
tags:
  - Entities
  - Attributes
  - Icons
  - Actions
---

# Entity definitions

Entities are defined in the `entities` section of the Flexible Horseshoe Card.

In most cases, the only required field is the Home Assistant entity itself. The card then uses Home Assistant to fetch the default name, area, icon, unit, precision, state formatting, and localization.

This means a minimal entity definition can stay very small:

```yaml
entities:
  - entity: sensor.memory_use_percent
```

The card will use the available Home Assistant metadata where possible. Depending on your Home Assistant language and locale settings, names, areas, states, numbers, and units are displayed using the configured localization.

You can override these values when needed. For example, you can set a custom name, use a different icon, change the number of decimals, or display an attribute instead of the main entity state.

## :material-horseshoe: Basic usage

A basic entity definition only points to an entity:

```yaml
entities:
  - entity: sensor.memory_use_percent
```

You can also define multiple entities. Layout sections such as `states`, `names`, `areas`, and `icons` can then refer to these entities by their `entity_index`.

```yaml title="Entities" linenums="1"
- type: custom:flex-horseshoe-card
  entities:
    - entity: sensor.dsmr_reading_electricity_currently_delivered
    - entity: sensor.dsmr_reading_phase_currently_delivered_l1
    - entity: sensor.dsmr_reading_phase_currently_delivered_l2
    - entity: sensor.dsmr_reading_phase_currently_delivered_l3
    - entity: sensor.dsmr_reading_electricity_currently_delivered
```

The first entity has index `0`, the second entity has index `1`, and so on.

## :material-horseshoe: Entity metadata from Home Assistant

The card uses Home Assistant metadata as much as possible. This keeps your YAML shorter and helps the card behave consistently with the rest of your dashboard.

The following values can usually be taken from Home Assistant:

| Value | Description |
| :---- | :---------- |
| Name | The entity friendly name |
| Area | The Home Assistant area assigned to the entity |
| State | The current entity state |
| Unit | The unit of measurement, such as `kWh`, `W`, `%`, or `°C` |
| Precision | The number formatting or precision defined for the entity |
| Icon | The entity icon, including state-based icons where supported |
| Icon color | State-based icon color where Home Assistant provides it |
| Localization | Translated names, states, and formatted numbers based on your Home Assistant locale |

This is why you usually do not need to repeat the name, unit, icon, or precision unless you want to change how this specific card displays the entity.

## :material-horseshoe: Displaying an entity

You can override the default Home Assistant metadata in the entity definition.

```yaml title="Displaying an entity" linenums="1"
entities:
  - entity: sensor.memory_use_percent
    decimals: 0
    icon: mdi:memory
    name: '5: RAM Usage'
    area: Hestia
```

In this example, the card uses a custom name, icon, area, and precision instead of relying fully on the Home Assistant defaults.

## :material-horseshoe: Displaying an attribute

An entity definition can also point to an attribute. This is useful for entities that expose several useful values, such as weather entities.

```yaml title="Displaying an attribute" linenums="1"
entities:
  - entity: weather.dark_sky
    attribute: temperature
    units: '°C'
    icon: mdi:temperature
    decimals: 1
    name: 'Temperature'
```

You can also define several attributes from the same entity as separate entries:

```yaml title="Entities with attributes" linenums="1"
- type: custom:flex-horseshoe-card
  entities:
    - entity: weather.zoefdehaas
      attribute: temperature
    - entity: weather.zoefdehaas
      attribute: humidity
    - entity: weather.zoefdehaas
      attribute: pressure
    - entity: sun.sun
      attribute: elevation
    - entity: sun.sun
      attribute: azimuth
```

Each entry receives its own `entity_index`, even when several entries use the same Home Assistant entity.

## :material-horseshoe: Overriding entity values

The card can use Home Assistant defaults automatically, but you can override them in the `entities` section when needed.

```yaml title="Entities with overrides" linenums="1"
- type: custom:flex-horseshoe-card
  entities:
    - entity: sensor.dsmr_reading_electricity_currently_delivered
      name: "Total"
      decimals: 2
      icon: mdi:fire
      area: house
```

Common reasons to override values:

- use a shorter name on a small card
- show fewer or more decimals
- use a custom icon
- group an entity under a different area label
- display an attribute with its own name and unit

## :material-horseshoe: Available entity options

| Name | Type | Required | Description |
| :--- | :---: | :------: | :---------- |
| `entity` | string | :material-check: | Home Assistant entity id |
| `attribute` | string | :material-close: | Attribute to display instead of the main entity state |
| `unit` | string | :material-close: | Unit to display for the entity or attribute |
| `decimals` | number | :material-close: | Number of decimals used to format the value |
| `name` | string | :material-close: | Custom name. Overrides the Home Assistant friendly name |
| `area` | string | :material-close: | Custom area. Overrides the Home Assistant area for this card |
| `icon` | string | :material-close: | Custom icon, image, SVG, or JavaScript template |
| `tap_action` | object | :material-close: | Action to run when the entity is clicked or tapped |

## :material-horseshoe: Icon options

If no icon is defined, the card uses the Home Assistant icon for the entity where possible.

You can override the icon with an MDI icon, an external image, or an external SVG.

| Icon type | Example | Description |
| :-------- | :------ | :---------- |
| MDI icon | `icon: mdi:lightbulb` | Uses a Material Design icon |
| External image | `icon: url(/local/icons/icon-image.png)` | Uses an image file as the icon |
| External SVG | `icon: url(/local/icons/icon-svg.svg)` | Uses an SVG file as the icon |

Icons can also be defined dynamically with JavaScript templates where supported.

## :material-horseshoe: Tap actions

Use `tap_action` to define what should happen when the entity is clicked or tapped.

| Name | Type | Default | Options | Description |
| :--- | :--: | :------ | :------ | :---------- |
| `action` | string | `more-info` | `more-info`, `navigate`, `call-service`, `none` | Action to perform |
| `service` | string | none | Any Home Assistant service | Service to call when `action` is `call-service` |
| `service_data` | object | none | Any service data | Service data to include with the service call |
| `navigation_path` | string | none | Any path | Path to navigate to when `action` is `navigate` |

Example: a light switch that toggles a light when tapped.

```yaml title="Light switch tap action" linenums="1"
entities:
  - entity: light.1st_floor_hall_light
    name: 'hall'
    icon: mdi:lightbulb
    tap_action:
      action: call-service
      service: light.toggle
      service_data: { 'entity_id': 'light.1st_floor_hall_light' }
```

## :material-horseshoe: Entity layout elements

Defining an entity does not automatically show every part of that entity on the card. The `entities` section defines the data source. The layout sections decide which parts are shown and where they appear.

| Entity part | Layout section | Description |
| :---------- | :------------- | :---------- |
| Area | `areas` | Shows the Home Assistant area or custom area |
| Name | `names` | Shows the entity name or custom name |
| State | `states` | Shows the entity state, including unit and decimals |
| Icon | `icons` | Shows the entity icon or a standalone icon |

For detailed configuration of `areas`, `names`, `states`, and `icons`, see the Home Assistant entity elements page.
