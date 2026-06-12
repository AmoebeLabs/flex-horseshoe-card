---
template: main.html
title: Home Assistant Entity Elements
description: Configure areas, names, states, and icons for Home Assistant entities.
tags:
  - Entities
  - Names
  - Areas
  - States
  - Icons
---

# Home Assistant entity elements: areas, names, states, and icons

## :material-horseshoe: Basic usage

Entity elements display information from the entities defined in the card. They are used for the text and icon parts of a layout: the Home Assistant area, the friendly name, the current state, and the entity icon.

Each type has its own layout section:

| Element | Section | Description |
| :------ | :------ | :---------- |
| Area | `areas` | Shows the Home Assistant area of the entity |
| Name | `names` | Shows the entity name or friendly name |
| State | `states` | Shows the entity state, including unit and decimals |
| Icon | `icons` | Shows the entity icon or a standalone icon |

All of these elements use the same basic positioning system. `xpos` and `ypos` place the element on the 100x100 card canvas. `entity_index` connects the element to an entity from the `entities` section.

Icons can also be used without an entity by defining the icon directly in the layout item.

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

## :material-horseshoe: Configuration fields

The fields below are available for each entity element type.

=== "Area"

    | Field | Required | Description |
    | :---- | :------: | :---------- |
    | `xpos` | :material-check: | X position on the 100x100 card canvas |
    | `ypos` | :material-check: | Y position on the 100x100 card canvas |
    | `entity_index` | :material-check: | Index in the `entities` section |
    | `ellipsis` | :material-close: | Maximum number of characters before `...` |
    | `styles` | :material-close: | CSS style definitions |
    | `color_stop` | :material-close: | Color stop used to set the text color based on the entity state |

=== "Name"

    | Field | Required | Description |
    | :---- | :------: | :---------- |
    | `xpos` | :material-check: | X position on the 100x100 card canvas |
    | `ypos` | :material-check: | Y position on the 100x100 card canvas |
    | `entity_index` | :material-check: | Index in the `entities` section |
    | `ellipsis` | :material-close: | Maximum number of characters before `...` |
    | `styles` | :material-close: | CSS style definitions |
    | `color_stop` | :material-close: | Color stop used to set the text color based on the entity state |

=== "State"

    | Field | Required | Description |
    | :---- | :------: | :---------- |
    | `xpos` | :material-check: | X position on the 100x100 card canvas |
    | `ypos` | :material-check: | Y position on the 100x100 card canvas |
    | `entity_index` | :material-check: | Index in the `entities` section |
    | `styles` | :material-close: | CSS style definitions |
    | `color_stop` | :material-close: | Color stop used to set the text color based on the entity state |
    | `state_map` | :material-close: | Entity state translation from named states to decimal states for color stops **NOT YET IMPLEMENTED** |

=== "Icon"

    | Field | Required | Description |
    | :---- | :------: | :---------- |
    | `xpos` | :material-check: | X position on the 100x100 card canvas |
    | `ypos` | :material-check: | Y position on the 100x100 card canvas |
    | `icon_size` | :material-check: | Icon size |
    | `entity_index` | :material-close: | Index in the `entities` section |
    | `icon` | :material-close: | Define an icon, external image, or external SVG |
    | `styles` | :material-close: | CSS style definitions |
    | `color_stop` | :material-close: | Color stop used to set the icon color based on the entity state |
    | `state_map` | :material-close: | Entity state-dependent icon value |

### Shared fields

These fields can be used across the entity element sections.

| Field | Required | Description |
| :---- | :------: | :---------- |
| `id` | :material-close: | Optional unique id within the section, used by `same_as` |
| `group` | :material-close: | Group this layout item belongs to |
| `same_as*` | :material-close: | Reuse another item from the same section. See the `same_as` documentation |

## :material-horseshoe: Styling

All entity element sections support inline SVG and CSS styling through the `styles` field.

| Method | Support | Description |
| :----- | :-----: | :---------- |
| `styles` | :material-check: | Inline SVG and CSS styles |

### Popular style properties

=== "Area"

    | Property | Purpose | Example |
    | :------- | :------ | :------ |
    | `font-size` | Text size | `font-size: 12em` sets a relative font size |
    | `text-anchor` | Text alignment | `text-anchor: start`, `middle`, or `end` |
    | `fill` | Text color | `fill: red` sets the text color to red |
    | `opacity` | Text opacity | `opacity: 0.7` sets the text opacity to 70% |

    !!! tip "Use relative font sizes when possible"
        Relative font sizes fit well with the relative sizing used by the Flexible Horseshoe Card. Use fixed pixel sizes only when you need a fixed visual size.

=== "Name"

    | Property | Purpose | Example |
    | :------- | :------ | :------ |
    | `font-size` | Text size | `font-size: 12em` sets a relative font size |
    | `text-anchor` | Text alignment | `text-anchor: start`, `middle`, or `end` |
    | `fill` | Text color | `fill: red` sets the text color to red |
    | `opacity` | Text opacity | `opacity: 0.7` sets the text opacity to 70% |

    !!! tip "Use relative font sizes when possible"
        Relative font sizes fit well with the relative sizing used by the Flexible Horseshoe Card. Use fixed pixel sizes only when you need a fixed visual size.

=== "State"

    | Property | Purpose | Example |
    | :------- | :------ | :------ |
    | `font-size` | Text size | `font-size: 12em` sets a relative font size |
    | `text-anchor` | Text alignment | `text-anchor: start`, `middle`, or `end` |
    | `fill` | Text color | `fill: red` sets the text color to red |
    | `opacity` | Text opacity | `opacity: 0.7` sets the text opacity to 70% |

=== "Icon"

    | Property | Purpose | Example |
    | :------- | :------ | :------ |
    | `fill` | Icon color | `fill: red` sets the icon color to red |
    | `opacity` | Icon opacity | `opacity: 0.7` sets the icon opacity to 70% |

--8<-- "docs/tools/default-haptics.md"

## :material-horseshoe: Color stops and animations

Entity elements can use color stops and animations when they are connected to an entity.

| Method | Support | Description |
| :----- | :-----: | :---------- |
| `colorstops` | :material-check: | List of state values used to set the color |
| `animations` | :material-check: | State-based animations using class or style changes |

!!! info "Animations require an entity"
    Animations require the item to be connected to an entity with `entity_index`.
