---
template: main.html
title: Entity Definitions
description: Brrrrrr.
tags:
  - Entities
---

## :material-horseshoe: Entity Definitions


# :material-horseshoe: Entities section

## Available entity options

| Name       |                  Type                   | Default  | Since  | Description                                                                                                    |
| ---------- | :-------------------------------------: | -------- | ------ | -------------------------------------------------------------------------------------------------------------- |
| attribute  |                 string                  | optional | v0.8.0 | The attribute to be used for the entity.                                                                       |
| unit       |                 string                  | optional | v0.8.0 | Specifies the entity or attribute unit to be displayed.                                                        |
| decimals   |                 number                  | optional | v0.8.0 | Specifies the decimals to format the entity or attribute value.                                                |
| name       |                 string                  | optional | v0.8.0 | Name used for entity or attribute. Overwrites the `friendly_name` attribute.                                   |
| area       |                 string                  | optional | v0.8.0 | Area used for entity or attribute.                                                                             |
| tap_action | [action object](#action-object-options) | optional | v0.8.0 | How to respond to a mouse-click or tap. See [available tap actions](#action-object-optionss) for requirements. |

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

## Action object options

(changed to be identical to mini graph card)

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
