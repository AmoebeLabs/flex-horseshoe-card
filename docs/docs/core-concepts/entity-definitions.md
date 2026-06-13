---
template: main.html
title: Entity definitions
description: Define Home Assistant entities, attributes, icons, units, precision, names, areas, tap actions, and dynamic entity values for the Flexible Horseshoe Card.
tags:
  - Entities
  - Attributes
  - Icons
  - Actions
  - Templates
---

# Entity definitions

Entities are defined in the `entities` section of the Flexible Horseshoe Card.

In most cases, the only required field is the Home Assistant entity itself. The card then uses Home Assistant to fetch the default name, area, icon, unit, precision, state formatting, and localization.

This means a minimal entity definition can stay very small:

```yaml linenums="1"
entities:
  - entity: sensor.memory_use_percent
```

The card will use the available Home Assistant metadata where possible. Depending on your Home Assistant language and locale settings, names, areas, states, numbers, and units are displayed using the configured localization.

You can override these values when needed. For example, you can set a custom name, use a different icon, change the number of decimals, display an attribute instead of the main entity state, or use a JavaScript template for dynamic entity values.

## :material-horseshoe: Basic usage

A basic entity definition only points to an entity:

```yaml linenums="1"
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

## :material-horseshoe: Overriding entity formatting

[:octicons-tag-24: v5.4.7-dev.7][github-releases]

The `format` option in the entities section allows you to override the default formatting of Home Assistantg.

```yaml title="Entities with format option" linenums="1"
- type: custom:flex-horseshoe-card
  entities:
    - entity: sensor.dsmr_reading_electricity_currently_delivered
      name: "Total"
      icon: mdi:fire
      area: house
      format:
        separator: false    # Remove thousands separator
        decimals_min: 0     # minimal and...
        decimals_max: 2     # ... maximum number of digits
```


## :material-horseshoe: Dynamic entity values

Some entity fields can also use JavaScript templates. This makes it possible to change parts of the entity definition based on the current state of an entity.

This is useful when a name, icon, area, unit, or other supported entity value should change dynamically instead of staying fixed.

For example, the `name` can depend on the state of another entity:

```yaml title="Dynamic entity name" linenums="1"
- type: custom:flex-horseshoe-card
  entities:
    - entity: sensor.memory_use_percent
      name: |
        [[[
          const name = entities[1].state === 'on'
            ? '11: One Bulb ON'
            : '11: One Bulb OFF';
          return name;
        ]]]
      tap_action:
        action: more-info

    - entity: light.livingroom_light_duo_left_light
      name: 'hall'
      icon: mdi:lightbulb
      tap_action:
        action: call-service
        service: light.toggle
        service_data: { "entity_id" : "light.livingroom_light_duo_left_light" }
```

In this example, the first entity uses a dynamic name. The name changes depending on whether the second entity is `on` or not.

Dynamic templates can also be used for icons where supported:

```yaml title="Dynamic entity icon" linenums="1"
entities:
  - entity: sensor.dsmr_reading_electricity_currently_delivered
    icon: |
      [[[
        const value = Number(state);
        return value >= 0.4
          ? 'mdi:flash'
          : 'mdi:flash-off';
      ]]]
```

Templates in the `entities` section use the same `[[[ ... ]]]` syntax as other JavaScript templates in the card.

!!! info "Dynamic values are evaluated during updates"
    JavaScript templates are dynamic. They can react to entity states and may be evaluated again when the card updates.

    This is different from static reuse features such as `same_as`, `calc()`, `constants`, and `ref()`, which are resolved during card setup.

For more details about JavaScript templates, available variables, and reusable template variables, see the templating page.

## :material-horseshoe: Available entity options

| Name | Type | Required | Description |
| :--- | :---: | :------: | :---------- |
| `entity` | string | :material-check: | Home Assistant entity id |
| `attribute` | string | :material-close: | Attribute to display instead of the main entity state |
| `unit` | string | :material-close: | Unit to display for the entity or attribute. Can use a JavaScript template where supported |
| `decimals` | number | :material-close: | Number of decimals used to format the value |
| `name` | string | :material-close: | Custom name. Overrides the Home Assistant friendly name. Can use a JavaScript template where supported |
| `area` | string | :material-close: | Custom area. Overrides the Home Assistant area for this card. Can use a JavaScript template where supported |
| `icon` | string | :material-close: | Custom icon, image, SVG, or JavaScript template |
| `format` | string | :material-close: | Custom formatting of an entity state |
| `tap_action` | object | :material-close: | Action to run when the entity is clicked or tapped |

## :material-horseshoe: Available entity format options
[:octicons-tag-24: v5.4.7-dev.7][github-releases]

| Name | Type | Required | Description |
| :--- | :---: | :------: | :---------- |
| `separator` | boolean | :material-close: | Enables/disables separator in numeric state |
| `decimals_min` | number | :material-close: | Minimal number of decimals used to format the value |
| `decimals_max` | number | :material-close: | Maximum number of decimals used to format the value |
| `raw_state_keep` | boolean | :material-close: | Keeps raw entity state if enabled. Prevents formatting or translations |
| `raw_state_clean` | boolean | :material-close: | Cleans raw entity states from underscores |
| `locale` | string | :material-close: | The locale in which you want the entity to be displayed |

## :material-horseshoe: Icon options

If no icon is defined, the card uses the Home Assistant icon for the entity where possible.

You can override the icon with an MDI icon, an external image, an external SVG, or a JavaScript template.

| Icon type | Example | Description |
| :-------- | :------ | :---------- |
| MDI icon | `icon: mdi:lightbulb` | Uses a Material Design icon |
| External image | `icon: url(/local/icons/icon-image.png)` | Uses an image file as the icon |
| External SVG | `icon: url(/local/icons/icon-svg.svg)` | Uses an SVG file as the icon |
| JavaScript template | `icon: |` with `[[[ ... ]]]` | Returns the icon dynamically |

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

<!--- External References... --->
[github-releases]: https://github.com/amoebelabs/flex-horseshoe-card/releases/
