---
template: main.html
title: Entity Icon tool
description: The Entity Icon tool displays the Home Assistant Entity Icon value. The icon can be styled and animated using CSS.
tags:
  - Icons
  - Entity Icon
  - Section  
---

[entity-icon-tool support]: https://github.com/amoebelabs/swiss-army-knife-card/releases/

# The Icons Section

##:material-horseshoe: Basic usage
Entity Icons are defined in the `icons` section. This section is a list of icons.

| Type of Icon | Description                                 |
| :-------- | :------------------------------------------ |
| `icon`  | The obvious default: an icon is specifed like `icon: mdi:...` |
| `image` | Using an external image as the icon: `icon: url(/local/icons/icon-image.png)`
| `SVG`   | Using an external SVG as the icon: `icon: url(/local/icons/icon-svg.svg)`

### Default Value
By default, the icon is defined in the Home Assistant registry, where an `icon` is defined for the entity. That icon can also be state dependent.

### Overriding
The value of the `icon` can be overriden in:

- The cards entities definition, where the `icon` is hard-coded
- The icon item can define an icon
- The state map can define an icon dependent on the state of the entity

The Entity Icon tool needs a center position, size and alignment.
=== "Standalone"

    ```yaml linenums="1" hl_lines="1"
    - xpos: 50                  # xpos=50 is center position
      ypos: 50                  # ypos=50 is center position
      icon_size: 10             # Relative size of 10 (em)
      align: center             # Align (center, end, start)
      icon: mdi:dots-vertical   # Specify icon in item definition
      styles:
        fill: var(--primary-text-color)
    ```
=== "Connected"

    ```yaml
    - xpos: 50                  # xpos=50 is center position
      ypos: 50                  # ypos=50 is center position
      icon_size: 10             # Relative size of 10 (em)
      align: center             # Align (center, end, start)
      entity_index: 1           # Specify entity_index
      icon: url(/local/images/some-image.png) # Override Icon with external image
      styles:
        fill: var(--primary-text-color)
    ```
=== "Connected - State Map"

    The Icon can be specified by the state of the connected entity.
    
    ```yaml title="From demo card :34:" linenums="1"hl_lines="8"
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

##:material-horseshoe: Styling
The Entity Icon tool has support for the following forms of styling:

| Method    |     Support      | Description                                 |
| :-------- | :--------------: | :------------------------------------------ |
| `styles`  | :material-check: | Using inline SVG and CSS styles             |

Populair properties:

| Property  | Does what?            | Example                                        |
| :-------- | :-------------------- | :--------------------------------------------- |
| `fill`    | Fill color            | `fill: red` sets fill to color red             |
| `color`   | Fill color            | `color: red` sets fill to color red            |
| `opacity` | Opacity (stroke/fill) | `opacity: 0.7` sets the opacity of text to 70% |

--8<-- "docs/tools/default-haptics.md"

##:material-horseshoe: Animations
The Entity Icon tool has support for the following forms of animations:

| Method       |     Support      | Description                                              |
| :----------- | :--------------: | :------------------------------------------------------- |
| `colorstops` | :material-check: | List of state values to set the color                    |
| `animations` | :material-check: | Operator state based animations with class/style styling |
