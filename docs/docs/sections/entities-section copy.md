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
##:material-horseshoe: Basic usage

All entity parts have there own section in the layout:

| Part | Section | Description
| - | - | - |
| area | `areas` | The Home Assistant area of the entity |
| name | `names` | The (friendly) name of the entity |
| state | `states` | The state of the entity and its unit with decimals |
| icon | `icons` | The icon of the entity, or a standalone icon |

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
      # Specify icon as icon, external image or external SVG
      icon: mdi:dots-vertical   # Specify icon in item definition
      icon: url(/local/images/some-image.png) # Override Icon with external image
      icon: url(/local/images/some-svg.svg) # Override Icon with external SVG
      styles:
        fill: var(--primary-text-color)
    ```
    ```yaml title="Entity Icon" linenums="1" hl_lines="1"
    - xpos: 50                  # xpos=50 is center position
      ypos: 50                  # ypos=50 is center position
      icon_size: 10             # Relative size of 10 (em)
      align: center             # Align (center, end, start)
      entity_index: 1           # Specify entity_index
      styles:
        fill: var(--primary-text-color)
    ```

    ```yaml title="State Mapped Icon" linenums="1" hl_lines="1"
    - xpos: 50                  # xpos=50 is center position
      ypos: 50                  # ypos=50 is center position
      icon_size: 10             # Relative size of 10 (em)
      align: center             # Align (center, end, start)
      entity_index: 2
      state_map:                # Translate text state to icon
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
    | `icon`         | :material-close:  | Define icon, external image or external SVG |
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
