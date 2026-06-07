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
