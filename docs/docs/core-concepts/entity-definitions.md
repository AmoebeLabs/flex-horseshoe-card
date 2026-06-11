##:material-horseshoe: Entity Definitions
Entities are defined in the `entities` section of the horseshoe card.

The most basic definition only defines the entity itself. All the other configuration items like name, area, icon and decimals are fetched from the Home Assistant Entity Registry.

Depending on the localization, names, areas and states are translated to the configured locale and formatting.

### Available entity options

| Name       |                  Type                   | Default  | Since  | Description                                                                                                    |
| ---------- | :-------------------------------------: | -------- | ------ | -------------------------------------------------------------------------------------------------------------- |
| attribute  |                 string                  | optional | v0.8.0 | The attribute to be used for the entity.                                                                       |
| unit       |                 string                  | optional | v0.8.0 | Specifies the entity or attribute unit to be displayed.                                                        |
| decimals   |                 number                  | optional | v0.8.0 | Specifies the decimals to format the entity or attribute value.                                                |
| name       |                 string                  | optional | v0.8.0 | Name used for entity or attribute. Overwrites the `friendly_name` attribute.                                   |
| area       |                 string                  | optional | v0.8.0 | Area used for entity or attribute.                                                                             |
| tap_action | [action object](#action-object-options) | optional | v0.8.0 | How to respond to a mouse-click or tap. See [available tap actions](#action-object-optionss) for requirements. |

### Available Icon options

| Type of Icon | Description                                 |
| :-------- | :------------------------------------------ |
| `icon`  | The obvious default: an icon is specifed like `icon: mdi:...` |
| `image` | Using an external image as the icon: `icon: url(/local/icons/icon-image.png)`
| `SVG`   | Using an external SVG as the icon: `icon: url(/local/icons/icon-svg.svg)`

### Action object options

| Name            |  Type  | Default     | Options                                         | Since  | Description                                                                             |
| --------------- | :----: | ----------- | ----------------------------------------------- | ------ | --------------------------------------------------------------------------------------- |
| action          | string | `more-info` | `more-info`, `navigate`, `call-service`, `none` | v0.8.0 | Action to perform                                                                       |
| service         | string | none        | Any service                                     | v0.8.0 | Service to call (e.g. `media_player.toggle`) when `action` is defined as `call-service` |
| service_data    | object | none        | Any service data                                | v0.8.0 | Service data to include with the service call (e.g. `entity_id: media_player.office`)   |
| navigation_path | string | none        | Any path                                        | v0.8.0 | Path to navigate to (e.g. `/lovelace/0/`) when `action` is defined as `navigate`        |

#### Example 3: a light switch:

```yaml
entities:
  - entity: light.1st_floor_hall_light
    name: 'hall'
    icon: mdi:lightbulb
    tap_action:
      action: call-service
      service: light.toggle
      service_data: { 'entity_id': 'light.1st_floor_hall_light' }
```


##:material-horseshoe: Basic usage
All entity parts have there own section in the layout:

| Part | Section | Description
| - | - | - |
| area | `areas` | The Home Assistant area of the entity |
| name | `names` | The (friendly) name of the entity |
| state | `states` | The state of the entity and its unit with decimals |
| icon | `icons` | The icon of the entity, or a standalone icon |

#### Example 1, displaying an entity:

```yaml
entities:
  - entity: sensor.memory_use_percent
    decimals: 0
    icon: mdi:memory
    name: '5: RAM Usage'
    area: Hestia
```

#### Example 2, displaying an attribute:

```yaml
entities:
  - entity: weather.dark_sky
    attribute: temperature
    units: '°C'
    icon: mdi:temperature
    decimals: 1
    name: 'Temperature'
```

=== "Entities"
    ```yaml title="Entities" linenums="1"
    - type: custom:flex-horseshoe-card
      entities:
        - entity: sensor.dsmr_reading_electricity_currently_delivered
        - entity: sensor.dsmr_reading_phase_currently_delivered_l1
        - entity: sensor.dsmr_reading_phase_currently_delivered_l2
        - entity: sensor.dsmr_reading_phase_currently_delivered_l3
        - entity: sensor.dsmr_reading_electricity_currently_delivered
    ```
=== "Entities with attributes"
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

You can override the area, name, decimals (precision) and icon fields in the definition.

```yaml title="Entities with overrides" linenums="1"
- type: custom:flex-horseshoe-card
  entities:
    - entity: sensor.dsmr_reading_electricity_currently_delivered
      name: "Total"
      decimals: 2
      icon: mdi:fire
      area: house
```
