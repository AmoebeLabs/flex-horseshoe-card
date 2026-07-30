---
template: main.html
title: Home Assistant Entity Elements
description: Configure positioned areas, names, states, and icons that display Home Assistant entity data in the card layout.
tags:
- Entities
- Names
- Areas
- States
- Icons
---

# Home Assistant entity elements: areas, names, states, and icons

Entity elements display text and icons from the entities configured on the card. Use them to show a Home Assistant area, friendly name, current state, or entity icon anywhere in the layout.

Each element type has its own layout section:

| Element | Section  | Description                                                             |
| :------ | :------- | :---------------------------------------------------------------------- |
| Area    | `areas`  | Displays the Home Assistant area assigned to the entity.                |
| Name    | `names`  | Displays the entity name or friendly name.                              |
| State   | `states` | Displays the current state, including its unit and configured decimals. |
| Icon    | `icons`  | Displays the entity icon or a standalone icon.                          |

All four element types use the same positioning system. `xpos` and `ypos` place an item on the `100 × 100` card canvas, while `entity_index` connects it to an entry in the card-level `entities` section.

Icons can also be used without an entity by defining the icon directly in the layout item.

## :material-horseshoe: Basic usage

### Example definitions

=== "Area"
    Display the Home Assistant area assigned to an entity:

    ```yaml title="Basic area" linenums="1" hl_lines="1"
    - xpos: 50                  # Horizontal center position
      ypos: 50                  # Vertical center position
      entity_index: 0           # Connects to entity 0
      ellipsis: 20
      styles:
        font-size: 1.4em
        text-transform: none
    ```

    Add color stops when the area text should change color with the entity state:

    ```yaml title="Area with color stops" linenums="1" hl_lines="1"
    - xpos: 50                  # Horizontal center position
      ypos: 50                  # Vertical center position
      entity_index: 0           # Connects to entity 0
      ellipsis: 20
      styles:
        font-size: 1.4em
        text-transform: none
      color_stop:               # Changes the text color based on the entity state
        colors:
          0: 'blue'
          0.1: 'green'
          0.4: 'yellow'
          1: 'orange'
          3: 'red'
          5: 'purple'
    ```

=== "Name"
    Display the name or friendly name of an entity:

    ```yaml title="Basic name" linenums="1" hl_lines="1"
    - xpos: 50                  # Horizontal center position
      ypos: 50                  # Vertical center position
      entity_index: 0           # Connects to entity 0
      ellipsis: 20
      styles:
        font-size: 1.4em
        text-transform: none
    ```

    Color stops can make the name respond visually to the entity state:

    ```yaml title="Name with color stops" linenums="1" hl_lines="1"
    - xpos: 50                  # Horizontal center position
      ypos: 50                  # Vertical center position
      entity_index: 0           # Connects to entity 0
      ellipsis: 20
      styles:
        font-size: 1.4em
        text-transform: none
      color_stop:               # Changes the text color based on the entity state
        colors:
          0: 'blue'
          0.1: 'green'
          0.4: 'yellow'
          1: 'orange'
          3: 'red'
          5: 'purple'
    ```

=== "State"
    Display the current entity state:

    ```yaml title="Basic state" linenums="1" hl_lines="1"
    - xpos: 50                  # Horizontal center position
      ypos: 50                  # Vertical center position
      entity_index: 0           # Connects to entity 0
      styles:
        font-size: 1.4em
        text-anchor: middle
    ```

    Add color stops when the state text should change color according to its value:

    ```yaml title="State with color stops" linenums="1" hl_lines="1"
    - xpos: 50                  # Horizontal center position
      ypos: 50                  # Vertical center position
      entity_index: 0           # Connects to entity 0
      styles:
        font-size: 1.4em
        text-anchor: middle
      color_stop:               # Changes the text color based on the entity state
        colors:
          0: 'blue'
          0.1: 'green'
          0.4: 'yellow'
          1: 'orange'
          3: 'red'
          5: 'purple'
    ```

=== "Icon"
    A standalone icon does not require `entity_index`:

    ```yaml title="Standalone icon" linenums="1" hl_lines="1"
    - xpos: 50                  # Horizontal center position
      ypos: 50                  # Vertical center position
      icon_size: 10             # Relative icon size in em
      align: center             # Use center, start, or end
      icon: mdi:dots-vertical   # MDI icon, image URL, or SVG URL
      styles:
        fill: var(--primary-text-color)
    ```

    External images and SVG files can be used in the same field:

    ```yaml title="External image icon" linenums="1"
    - xpos: 50
      ypos: 50
      icon_size: 10
      align: center
      icon: url(/local/images/some-image.png)
    ```

    Connect the item to an entity to use that entity’s icon:

    ```yaml title="Entity icon" linenums="1" hl_lines="1"
    - xpos: 50                  # Horizontal center position
      ypos: 50                  # Vertical center position
      icon_size: 10             # Relative icon size in em
      align: center             # Use center, start, or end
      entity_index: 1           # Uses the icon of entity 1
      styles:
        fill: var(--primary-text-color)
    ```

    A state map can choose a different icon for each named state:

    ```yaml title="State-mapped icon" linenums="1" hl_lines="1"
    - xpos: 50
      ypos: 50
      icon_size: 10
      align: center
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

## :material-horseshoe: Configuration fields

The available fields vary slightly by element type.

=== "Area"
    | Field | Required | Description |
    | :---- | :------: | :---------- |
    | `xpos` | :material-check: | Horizontal position on the `100 × 100` card canvas. |
    | `ypos` | :material-check: | Vertical position on the `100 × 100` card canvas. |
    | `entity_index` | :material-check: | Index of the connected entity in the `entities` section. |
    | `ellipsis` | :material-close: | Maximum text length before an ellipsis is added. |
    | `styles` | :material-close: | Applies CSS and SVG styles to the text. |
    | `color_stop` | :material-close: | Uses the entity state to determine the text color. |

=== "Name"
    | Field | Required | Description |
    | :---- | :------: | :---------- |
    | `xpos` | :material-check: | Horizontal position on the `100 × 100` card canvas. |
    | `ypos` | :material-check: | Vertical position on the `100 × 100` card canvas. |
    | `entity_index` | :material-check: | Index of the connected entity in the `entities` section. |
    | `ellipsis` | :material-close: | Maximum text length before an ellipsis is added. |
    | `styles` | :material-close: | Applies CSS and SVG styles to the text. |
    | `color_stop` | :material-close: | Uses the entity state to determine the text color. |

=== "State"
    | Field | Required | Description |
    | :---- | :------: | :---------- |
    | `xpos` | :material-check: | Horizontal position on the `100 × 100` card canvas. |
    | `ypos` | :material-check: | Vertical position on the `100 × 100` card canvas. |
    | `entity_index` | :material-check: | Index of the connected entity in the `entities` section. |
    | `styles` | :material-close: | Applies CSS and SVG styles to the state text. |
    | `color_stop` | :material-close: | Uses the entity state to determine the text color. |
    | `state_map` | :material-close: | Maps named states to decimal values for color stops. **Not yet implemented.** |

=== "Icon"
    | Field | Required | Description |
    | :---- | :------: | :---------- |
    | `xpos` | :material-check: | Horizontal position on the `100 × 100` card canvas. |
    | `ypos` | :material-check: | Vertical position on the `100 × 100` card canvas. |
    | `icon_size` | :material-check: | Controls the relative size of the icon. |
    | `align` | :material-close: | Aligns the icon using `start`, `center`, or `end`. |
    | `entity_index` | :material-close: | Index of the connected entity in the `entities` section. |
    | `icon` | :material-close: | Defines an MDI icon, external image, or external SVG. |
    | `styles` | :material-close: | Applies CSS and SVG styles to the icon. |
    | `color_stop` | :material-close: | Uses the entity state to determine the icon color. |
    | `state_map` | :material-close: | Chooses an icon based on the current entity state. |

### Shared fields

These fields are available across the entity element sections.

| Field      |     Required     | Description                                                                                    |
| :--------- | :--------------: | :--------------------------------------------------------------------------------------------- |
| `id`       | :material-close: | Optional identifier that must be unique within the section and can be referenced by `same_as`. |
| `group`    | :material-close: | Assigns the layout item to a group.                                                            |
| `same_as*` | :material-close: | Reuses another item from the same section. See the `same_as` documentation.                    |

## :material-horseshoe: Styling

All entity element sections support inline CSS and SVG styling through `styles`.

| Method   |      Support     | Description                        |
| :------- | :--------------: | :--------------------------------- |
| `styles` | :material-check: | Applies inline CSS and SVG styles. |

### Common style properties

=== "Area"
    | Property | Purpose | Example |
    | :------- | :------ | :------ |
    | `font-size` | Controls the text size. | `font-size: 1.2em` |
    | `text-anchor` | Controls horizontal text alignment. | `start`, `middle`, or `end` |
    | `fill` | Sets the text color. | `fill: red` |
    | `opacity` | Controls the text opacity. | `opacity: 0.7` |

    !!! tip "Use relative font sizes when possible"
        Relative font sizes work well with the flexible sizing of the card. Use fixed pixel sizes only when the text must keep an exact visual size.

=== "Name"
    | Property | Purpose | Example |
    | :------- | :------ | :------ |
    | `font-size` | Controls the text size. | `font-size: 1.2em` |
    | `text-anchor` | Controls horizontal text alignment. | `start`, `middle`, or `end` |
    | `fill` | Sets the text color. | `fill: red` |
    | `opacity` | Controls the text opacity. | `opacity: 0.7` |

    !!! tip "Use relative font sizes when possible"
        Relative font sizes work well with the flexible sizing of the card. Use fixed pixel sizes only when the text must keep an exact visual size.

=== "State"
    | Property | Purpose | Example |
    | :------- | :------ | :------ |
    | `font-size` | Controls the text size. | `font-size: 1.2em` |
    | `text-anchor` | Controls horizontal text alignment. | `start`, `middle`, or `end` |
    | `fill` | Sets the text color. | `fill: red` |
    | `opacity` | Controls the text opacity. | `opacity: 0.7` |

=== "Icon"

    | Property | Purpose | Example |
    | :------- | :------ | :------ |
    | `fill` | Sets the icon color. | `fill: red` |
    | `opacity` | Controls the icon opacity. | `opacity: 0.7` |

--8<-- "docs/sections/default-haptics.md"

## :material-horseshoe: Color stops and animations

Entity elements can use color stops and animations when connected to an entity.

| Method        |      Support     | Description                                       |
| :------------ | :--------------: | :------------------------------------------------ |
| `color_stops` | :material-check: | Uses state values to determine the element color. |
| `animations`  | :material-check: | Applies state-based class or style changes.       |

!!! info "Animations require an entity"
Connect the item to an entity through `entity_index` before using animations.
