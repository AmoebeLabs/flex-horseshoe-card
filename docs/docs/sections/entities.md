---
template: main.html
title: Entity Definitions
description: Brrrrrr.
tags:
  - Entities
  - Names
  - Areas
  - States
  - Icons
---

# Entities: areas, names, states and icons sections

##:material-horseshoe: Entity Definitions
Entities are defined in the `entities` section of the horseshoe card.

The most basic definition only defines the entity itself. All the other configuration items like name, area, icon and decimals are fetched from the Home Assistant Entity Registry.

### Available entity options

| Name       |                  Type                   | Default  | Since  | Description                                                                                                    |
| ---------- | :-------------------------------------: | -------- | ------ | -------------------------------------------------------------------------------------------------------------- |
| attribute  |                 string                  | optional | v0.8.0 | The attribute to be used for the entity.                                                                       |
| unit       |                 string                  | optional | v0.8.0 | Specifies the entity or attribute unit to be displayed.                                                        |
| decimals   |                 number                  | optional | v0.8.0 | Specifies the decimals to format the entity or attribute value.                                                |
| name       |                 string                  | optional | v0.8.0 | Name used for entity or attribute. Overwrites the `friendly_name` attribute.                                   |
| area       |                 string                  | optional | v0.8.0 | Area used for entity or attribute.                                                                             |
| tap_action | [action object](#action-object-options) | optional | v0.8.0 | How to respond to a mouse-click or tap. See [available tap actions](#action-object-optionss) for requirements. |

| Type of Icon | Description                                 |
| :-------- | :------------------------------------------ |
| `icon`  | The obvious default: an icon is specifed like `icon: mdi:...` |
| `image` | Using an external image as the icon: `icon: url(/local/icons/icon-image.png)`
| `SVG`   | Using an external SVG as the icon: `icon: url(/local/icons/icon-svg.svg)`

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
##:material-horseshoe: Entity Layout sections

### Example definitions

=== "Area"

    ```yaml title="Basic Area 1" linenums="1" hl_lines="1"
    - xpos: 50                  # xpos=50 is center position
      ypos: 50                  # ypos=50 is center position
      entity_index: 0           # connects to entity 0 in the entity definitions
      ellipsis: 20
      styles:
        font-size: 1.4em
        text-transform: none
    ```
    ```yaml title="Basic Area 2" linenums="1" hl_lines="1"
    - xpos: 50                  # xpos=50 is center position
      ypos: 50                  # ypos=50 is center position
      entity_index: 0           # connects to entity 0 in the entity definitions
      ellipsis: 20
      styles:
        font-size: 1.4em
        text-transform: none
      color_stop:               # Use of color stop: color of area depends on state
        colors:
          0: 'blue'
          0.1: 'green'
          0.4: 'yellow'
          1: 'orange'
          3: 'red'
          5: 'purple'
    ```

=== "Name"

    ```yaml title="Basic Name 1" linenums="1" hl_lines="1"
    - xpos: 50                  # xpos=50 is center position
      ypos: 50                  # ypos=50 is center position
      entity_index: 0           # connects to entity 0 in the entity definitions
      ellipsis: 20
      styles:
        font-size: 1.4em
        text-transform: none
    ```
    ```yaml title="Basic Name 2" linenums="1" hl_lines="1"
    - xpos: 50                  # xpos=50 is center position
      ypos: 50                  # ypos=50 is center position
      entity_index: 0           # connects to entity 0 in the entity definitions
      ellipsis: 20
      styles:
        font-size: 1.4em
        text-transform: none
      color_stop:               # Use of color stop: color of area depends on state
        colors:
          0: 'blue'
          0.1: 'green'
          0.4: 'yellow'
          1: 'orange'
          3: 'red'
          5: 'purple'
    ```

=== "State"

    ```yaml title="State" linenums="1" hl_lines="1 7"
    - xpos: 50                  # xpos=50 is center position
      ypos: 50                  # ypos=50 is center position
      length: 25                # length of line.
      entity_index: 0           # connect to state of entity 0
      styles:
        stroke-width: 2         # Set stroke width using CSS attribute
    ```

    ```yaml title="State" linenums="1" hl_lines="1 7"
    - xpos: 50                  # xpos=50 is center position
      ypos: 50                  # ypos=50 is center position
      length: 25                # length of line.
      entity_index: 0           # connect to state of entity 0
      styles:
        stroke-width: 2         # Set stroke width using CSS attribute
      color_stop:               # Use of color stop: color of circle depends on state
        colors:
          0: 'blue'
          0.1: 'green'
          0.4: 'yellow'
          1: 'orange'
          3: 'red'
          5: 'purple'
    ```

=== "Icon"

    ```yaml title="Standalone Icon" linenums="1" hl_lines="1"
    - xpos: 50                  # xpos=50 is center position
      ypos: 50                  # ypos=50 is center position
      icon_size: 10             # Relative size of 10 (em)
      align: center             # Align (center, end, start)
      icon: mdi:dots-vertical   # Specify icon in item definition
      styles:
        fill: var(--primary-text-color)
    ```
    ```yaml title="Entity Icon" linenums="1" hl_lines="1"
    - xpos: 50                  # xpos=50 is center position
      ypos: 50                  # ypos=50 is center position
      icon_size: 10             # Relative size of 10 (em)
      align: center             # Align (center, end, start)
      entity_index: 1           # Specify entity_index
      icon: url(/local/images/some-image.png) # Override Icon with external image
      styles:
        fill: var(--primary-text-color)
    ```

    ```yaml title="State Mapped Icon" linenums="1" hl_lines="1"
    - xpos: 50                  # xpos=50 is center position
      ypos: 50                  # ypos=50 is center position
      icon_size: 10             # Relative size of 10 (em)
      align: center             # Align (center, end, start)
      entity_index: 2
      state_map:
        map:
          - state: 'low'
            icon: url(/local/images/kleenex/pollen_weed_low.svg)
          - state: 'moderate'
            icon: url(/local/images/kleenex/pollen_weed_moderate.svg)
          - state: 'high'
            icon: url(/local/images/kleenex/pollen_weed_high.svg)
          - state: 'very_high'
            icon: url(/local/images/kleenex/pollen_weed_very_high.svg)
    ```

##:material-horseshoe: Configuration Fields

=== "Area"

    | Field          | Required          | Description |
    | :------------- | :---------------: | :---------- |
    | `xpos`         | :material-check:  | X position on the 100x100 card canvas |
    | `ypos`         | :material-check:  | Y position on the 100x100 card canvas |
    | `entity_index` | :material-check:  | Index in the `entities` section |
    | `ellipsis`     | :material-close:  | Maximum number of characters before `...` |
    | `styles`       | :material-close:  | CSS style definitions |
    | `color_stop`   | :material-close:  | Color stop used to set the font color based on the entity state |

=== "Name"

    | Field          | Required          | Description |
    | :------------- | :---------------: | :---------- |
    | `xpos`         | :material-check:  | X position on the 100x100 card canvas |
    | `ypos`         | :material-check:  | Y position on the 100x100 card canvas |
    | `entity_index` | :material-check:  | Index in the `entities` section |
    | `ellipsis`     | :material-close:  | Maximum number of characters before `...` |
    | `styles`       | :material-close:  | CSS style definitions |
    | `color_stop`   | :material-close:  | Color stop used to set the font color based on the entity state |

=== "State"

    | Field          | Required          | Description |
    | :------------- | :---------------: | :---------- |
    | `xpos`         | :material-check:  | X position on the 100x100 card canvas |
    | `ypos`         | :material-check:  | Y position on the 100x100 card canvas |
    | `entity_index` | :material-check:  | Index in the `entities` section |
    | `styles`       | :material-close:  | CSS style definitions |
    | `color_stop`   | :material-close:  | Color stop used to set the font color based on the entity state |
    | `state_map`    | :material-close:  | Entity state translation from named states to decimal states for color stops **NOT YET IMPLEMENTED** |

=== "Icon"

    | Field          | Required          | Description |
    | :------------- | :---------------: | :---------- |
    | `xpos`         | :material-check:  | X position on the 100x100 card canvas |
    | `ypos`         | :material-check:  | Y position on the 100x100 card canvas |
    | `icon_size`    | :material-check:  | Size of Icon |
    | `entity_index` | :material-close:  | Index in the `entities` section |
    | `styles`       | :material-close:  | CSS style definitions |
    | `color_stop`   | :material-close:  | Color stop used to set the font color based on the entity state |
    | `state_map`    | :material-close:  | Entity state dependent value of the icon |



Other fields:

| Field          | Required          | Description |
| :------------- | :---------------: | :---------- |
| `id`           | :material-close:  | Optional unique id within section to identify the name for `same_as` functionality |
| `group`         | :material-close:  | Group this building block belongs to. |
| `same_as*`         | :material-close:  | See same_as documentation. |

##:material-horseshoe: Styling
All Entity sections support the following forms of styling:


| Method    |     Support      | Description                                 |
| :-------- | :--------------: | :------------------------------------------ |
| `styles`  | :material-check: | Using inline SVG and CSS styles             |

Populair properties:

=== "Area"
    | Property         | Does what?   | Example                                                 |
    | :--------------- | :----------- | :------------------------------------------------------ |
    | `font-size`   | Font size             | `font-size: 12em` sets RELATIVE font size      |
    | `text-anchor` | Anchor of text        | `text-anchor: start` or `middle`, or `end`     |
    | `fill`        | Fill color            | `fill: red` sets fill to color red             |
    | `opacity`     | Opacity (stroke/fill) | `opacity: 0.7` sets the opacity of text to 70% |

    !!! Tip "Always use a relative font-size: it fits well with the relative sizes used by FHS"
        Unless you need a fixed size in pixels...

=== "Name"
    | Property         | Does what?   | Example                                                 |
    | :--------------- | :----------- | :------------------------------------------------------ |
    | `font-size`      | Font size             | `font-size: 12em` sets RELATIVE font size      |
    | `text-anchor`    | Anchor of text        | `text-anchor: start` or `middle`, or `end`     |
    | `fill`           | Fill color            | `fill: red` sets fill to color red             |
    | `opacity`        | Opacity (stroke/fill) | `opacity: 0.7` sets the opacity of text to 70% |

    !!! Tip "Always use a relative font-size: it fits well with the relative sizes used by FHS"
        Unless you need a fixed size in pixels...

=== "State"
    | Property         | Does what?   | Example                                                 |
    | :--------------- | :----------- | :------------------------------------------------------ |
    | `font-size`      | Font size             | `font-size: 12em` sets RELATIVE font size      |
    | `text-anchor`    | Anchor of text        | `text-anchor: start` or `middle`, or `end`     |
    | `fill`           | Fill color            | `fill: red` sets fill to color red             |
    | `opacity`        | Opacity (stroke/fill) | `opacity: 0.7` sets the opacity of text to 70% |

=== "Icon"
    | Property         | Does what?   | Example                                                 |
    | :--------------- | :----------- | :------------------------------------------------------ |
    | `fill`           | Fill color            | `fill: red` sets fill to color red             |
    | `opacity`        | Opacity (stroke/fill) | `opacity: 0.7` sets the opacity of text to 70% |

--8<-- "docs/tools/default-haptics.md"

##:material-horseshoe: Animations
The visual shapes support the following forms of animations:

| Method       |     Support      | Description                                              |
| :----------- | :--------------: | :------------------------------------------------------- |
| `colorstops` | :material-check: | List of state values to set the color                    |
| `animations` | :material-check: | Operator state based animations with class/style styling |

!!! Info "The use of animations require the tool to be connected to an entity"
