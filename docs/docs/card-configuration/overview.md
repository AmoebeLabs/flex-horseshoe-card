---
template: main.html
title: Installation of the card
description: The preferred way to install the flexible horseshoe card is using HACS from within your Home Assistant dashboard.\
tags:
  - HACS
  - Installation
---

## Main Card required, defaulted and pure optional sections

The Card Options are divided into Sections. To give a clear overview of which of the sheer number of sections are required, optional with defaults and optional, the following table is made.

The [examples section](#-examples-section) shows 12 examples of card definitions, from basic to using all available options!

Note: The examples will get decluttering templates as an example too, to show how you can better manage and maintain the all the card layouts without loosing overview in the Lovelace views.

Each section might have it's own required, defaulted and optional properties.

| Name                |                             Required                              |                    Optional /w </br> defaults                     |                             Optional                              | Since  | Description                                                                                                                                                                                                                                                |
| ------------------- | :---------------------------------------------------------------: | :---------------------------------------------------------------: | :---------------------------------------------------------------: | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type                | :material-horseshoe: |                                                                   |                                                                   | v0.8.0 | `custom:flex-horseshoe-card`.                                                                                                                                                                                                                              |
| entities            | :material-horseshoe: |                                                                   |                                                                   | v0.8.0 | One or more sensor entities in a list. See [entities section](#-entities-section) for requirements.                                                                                                                                                        |
| layout              | :material-horseshoe: |                                                                   |                                                                   | v0.8.0 | You MUST of course specify where each item is positioned on the card. See [available layout options](#available-layout-options) for requirements.                                                                                                          |
| horseshoe_scale     | :material-horseshoe: |                               some                                |                                                                   | v0.8.0 | Specifies the scale configuration, like min, max, width and color of the scale. See [horseshoe scale](#horseshoe-scale-options) for requirements.                                                                                                          |
| color_stops         | :material-horseshoe: |                                                                   |                                                                   | v0.8.0 | Set thresholds for horseshoe gradients and colormapping. See [color stops](#horseshoe-state-options) for requirements.                                                                                                                                     |
|                     |                                                                   |                                                                   |                                                                   |        |
| horseshoe_state     |                                                                   | :material-horseshoe: |                                                                   | v0.8.0 | Specifies the horseshoe width, and fixed color. See [horseshoe state](#horseshoe-state-options) for requirements.                                                                                                                                          |
| show                |                                                                   | :material-horseshoe: |                                                                   | v0.8.0 | Determines what is shown, like the scale and the horseshoe style. See [available show options](#available-show-options) for requirements.                                                                                                                  |
| card_filter         |                                                                   | :material-horseshoe: |                                                                   | v0.8.0 |
| entities tap_action |                                                                   | :material-horseshoe: |                                                                   | v0.8.0 | How to respond to a mouse-click or tap. See [available tap actions](#action-object-optionss) for requirements.                                                                                                                                             |
|                     |                                                                   |                                                                   |                                                                   |        |
| animations          |                                                                   |                                                                   | :material-horseshoe: | v0.8.0 | You can specify animations / dynamic behaviour depending on the state of an entity. Circles, lines and icons can be controlled depending on the state of a given entity. See [available animation options](#available-animation-options) for requirements. |

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

# :material-horseshoe: Layout section

## Available layout options

The layout options determine where the objects are located on the card, and their initial appearance like font, font size, color, width, fill color, stroke color, etc.

| Name          |                  Type                   |   Default    | Since  | Description                                                                                                                                                                                                                                                                  |
| ------------- | :-------------------------------------: | :----------: | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout object | [layout object](#layout-object-options) | **required** | v0.8.0 | Entity objects:<ul><li>`states` for displaying a entity or attribute value</li><li>`names` for the name of the entity</li><li>`icons` for the entity icons</li></ul>Graphic objects:<ul><li>`circles` for circles</li><li>`hlines` and `vlines` for drawing lines.</li></ul> |

## Layout object options

| Name                           |    Type    | Default        | Options                  | Since  | Description                                                                                                                                                                                                         |
| ------------------------------ | :--------: | -------------- | ------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                             |   number   | _not used yet_ |                          | v0.8.0 | Identifies the object.                                                                                                                                                                                              |
| xpos                           | percentage | **required**   | percentage 0..100        | v0.8.0 | Relative x-position in card. A value of 50 (%) places the object in the middle of the x-axis                                                                                                                        |
| ypos                           | percentage | **required**   | percentage 0..100        | v0.8.0 | Relative y-position in card. A value of 50 (%) places the object in the middle of the y-axis                                                                                                                        |
| length</br>_(lines only)_      | percentage | **required**   | percentage 0.100         | v0.8.0 | Relative length of a line. A value of 50 (%) means the line is half the size of the card's width                                                                                                                    |
| radius</br>_(circles only)_    |   pixels   | **required**   | > 1 / < 200              | v0.8.0 | Specifies the radius of the circle in pixels.                                                                                                                                                                       |
| icon*size</br> *(icons only)\_ |  em value  | **required**   | a value of 1 = 12px      | v0.8.0 | Specifies the size of the icon in em units. A calculation takes care of positioning the icon                                                                                                                        |
| align</br> _(icons only)_      |  position  | `middle`       | `start`/ `middle`/ `end` | v0.8.0 | Specifies the alignment of the icon relative to the xpos and ypos. Functions idential to the `text-anchor`css property. Used in positioning calculations for the icon.                                              |
| entity_index                   |   number   | **required**   | N/A                      | v0.8.0 | Refers to the 0-based index in the entity list which the layout is connected to                                                                                                                                     |
| animation_id                   |   number   | optional       | an Id                    | v0.8.0 | Identifies an animation in the animations section. It connects this layout object with dynamic behaviour                                                                                                            |
| styles                         |    list    | optional       | any valid css entry      | v0.8.0 | specify a list of css values to style the object. Must be terminated with a semicolon `;`.<br> Since v5.4.1 the `styles` section supports JavaScript templates for dynamic behaviour based on states or other logic |
| color_stops                    |    list    | optional       | N/A                      | v5.4.1 | specify a list of colors. The color of the object will change accordingly to the state of the entity                                                                                                                |

#### Example layout entry

The following layout is a part of card 5. For more complete examples, see the [examples section](#-examples-section)

![Another Example](https://tweakers.net/ext/f/xjuaTt3620GPgQyMnrrIIfth/full.png)

- xpos, ypos and length are **percentages**
- state layout 0 is connected to entity 0, ie the first entity in the entities section
- name layout 0 is also connected to entity 0

```yaml
layout:
  hlines:
    - id: 0
      xpos: 50
      ypos: 38
      length: 40
      styles:
        - stroke: var(--theme-gradient-color-01);
        - stroke-width: 5;
        - opacity: 0.9;
        - stroke-linecap: round;
  vlines:
    - id: 0
      xpos: 50
      ypos: 56
      length: 20
      styles:
        - stroke: white;
        - opacity: 0.5;
        - stroke-width: 2;
        - stroke-linecap: round;
  states:
    - id: 0
      entity_index: 0
      xpos: 50
      ypos: 30
      styles:
        - font-size: 3em;
        - opacity: 0.9;
  names:
    - id: 0
      entity_index: 0
      xpos: 50
      ypos: 100
      styles:
        - font-size: 1.2em;
```

# :material-horseshoe: Horseshoe section

## Horseshoe scale options

| Name     |  Type  | Default                           | Options                   | Since  | Description                                                                         |
| -------- | :----: | --------------------------------- | ------------------------- | ------ | ----------------------------------------------------------------------------------- |
| min      | number | **required**                      |                           | v0.8.0 | Minimum value of the scale / horseshoe                                              |
| max      | number | **required**                      |                           | v0.8.0 | Maximum value of the scale / horseshoe                                              |
| color    | color  | `var(--primary-background-color)` | any # or var color        | v0.8.0 | Color of the scale and tickmarks, if enabled through `show.scale_tickmarks` option. |
| width    | pixels | 6                                 | size in pixels            | v0.8.0 | Width of scale                                                                      |
| bar_mode | string | `normal`                          | `normal`, `bidirectional` | 5.4.3  | Horseshoe can go "bidirectionally" CV and CCW from the top/center which is always 0 |

#### Example:

```yaml
horseshoe_scale:
  min: 0
  max: 100
  width: 6
  color: 'var(--primary-background-color)'
```
