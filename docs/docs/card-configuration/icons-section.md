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

# The Entity Icon tool

[:octicons-tag-24: 1.0.0][entity-icon-tool support] ·
:octicons-package-dependents-24: Output

The Entity Icon tool displays the Home Assistant Entity Icon.

:material-thermometer:

##:material-horseshoe: Basic usage
!!! Info "If no icon is specified in the entities configuration, the icon specified by Home Assistant is used"

The Entity Icon tool needs a center position, size and alignment.
=== "Standalone"

    ```yaml linenums="1" hl_lines="1"
    - type: 'icon'              # tooltype is 'icon'
      position:                 # Position on (100x100) canvas
        cx: 50                  # cx=50 is center position
        cy: 50                  # cy=50 is center position
        icon_size: 10           # Relative size of 10 (em)
        align: center           # Align (center, end, start)
      icon: mdi:dots-vertical   # Specify icon in tool
      styles:
        icon:
          fill: var(--primary-text-color)
    ```
=== "Connected"

    The Entity Icon tool fetches the icon from the entity_index.
    ```yaml linenums="1" hl_lines="1"
    - type: 'icon'              # tooltype is 'icon'
      position:                 # Position on (100x100) canvas
        cx: 50                  # cx=50 is center position
        cy: 50                  # cy=50 is center position
        icon_size: 10           # Relative size of 10 (em)
        align: center           # Align (center, end, start)
      entity_index: 0           # connect to state of entity 0
      styles:
        icon:
          fill: var(--primary-text-color)
    ```
=== "Connected - Icon overruled"

    The Entity Icon tool can have it's entity icon overruled by the tool.
    ```yaml title="From example view-sake2.yml" linenums="1"hl_lines="8"
    - type: icon
      position:
        cx: 10
        cy: 10
        align: center
        icon_size: 15
      entity_index: 0
      icon: mdi:dots-vertical   # Overwrite icon from entity: use menu icon
      user_actions:
        tap_action:
          haptic: success
          actions:
            - action: more-info # display more-info popup when clicked
      styles:
        capture:
          opacity: 0
        icon:
          fill: var(--primary-text-color)
    ```

##:material-horseshoe: Styling
The Entity Icon tool has support for the following forms of styling:

| Method    |     Support      | Description                                 |
| :-------- | :--------------: | :------------------------------------------ |
| `classes` | :material-check: | Using SAK or User defined class definitions |
| `styles`  | :material-check: | Using inline SVG and CSS styles             |

The Entity Icon tool is composed of a single object: "icon" and this is the selector for styling:

```yaml linenums="1"hl_lines="9 12"
- type: 'icon'
  position:
    cx: 50
    cy: 50
    icon_size: 10
    align: center
  entity_index: 0
  classes:
    icon: # icon selector
      <...>
  styles:
    icon: # icon selector
      <...>
```

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
| `colorlists` | :material-close: | Using a colorlist definition                             |
| `animations` | :material-check: | Operator state based animations with class/style styling |
