---
template: main.html
title: Entity Name tool
description: The Entity Name tool displays the Home Assistant Entity Name value. The text can be styled using CSS.
tags:
  - Section
  - Names
---

[entity-name-tool support]: https://github.com/amoebelabs/swiss-army-knife-card/releases/

# The Names Section

##:fhs-fhs-logo: Basic usage
Entity names are defined in the `names` section. This section is a list of names.

### Example definitions
One with named IDs and one with Auto IDs. IDs are required in this case for `id: first` to be referenced by same_as functionality.

=== "Connected - Named ID"

    ```yaml linenums="1" hl_lines="1"
    - type: custom:flex-horseshoe-card
      layout:
        names:
          - id: all             # just for clarity
            entity_index: 0
            xpos: 50
            ypos: 98
            ellipsis: 20
            styles:
              font-size: 1.4em
              text-transform: none
          - id: first           # for referencing same_as
            entity_index: 1     # entity 1
            group: L1           # part of group
            xpos: 44            # always design around center (50,50)...
            ypos: 50            # ...if part of group for easy positioning
            styles:             # styling
              text-anchor: end
              font-size: 1.2em
          - id: second          # just for clarity
            entity_index: 2
            group: L2
            same_as: first      # copies configuration from name with id=first
          - id: third           # just for clarity
            entity_index: 3
            group: L3
            same_as: first      # copies configuration from name with id=first
    ```

=== "Connected - Auto ID"

    ```yaml linenums="1" hl_lines="1"
    - type: custom:flex-horseshoe-card
      layout:
        names:
          - entity_index: 0
            xpos: 50
            ypos: 98
            ellipsis: 20
            styles:
              font-size: 1.4em
              text-transform: none
          - entity_index: 1     # entity 1
            group: L1           # part of group
            xpos: 44            # always design around center (50,50)...
            ypos: 50            # ...if part of group for easy positioning
            styles:             # styling
              text-anchor: end
              font-size: 1.2em
          - entity_index: 2
            group: L2
            same_as: 1          # copies configuration from name with index=1
          - entity_index: 3
            group: L3
            same_as: 1          # copies configuration from name with index=1
    ```


### Fields:

| Field          | Required          | Description |
| :------------- | :---------------: | :---------- |
| `entity_index` | :material-check:  | Index in the `entities` section |
| `xpos`         | :material-check:  | X position on the 100x100 card canvas |
| `ypos`         | :material-check:  | Y position on the 100x100 card canvas |
| `ellipsis`    | :material-close:  | Maximum number of characters before `...` |
| `styles`      | :material-close:  | CSS style definitions |
| `color_stop`  | :material-close:  | Color stop used to set the font color based on the entity state |

Other fields:

| Field          | Required          | Description |
| :------------- | :---------------: | :---------- |
| `id`           | :material-close:  | Optional unique id within section to identify the name for `same_as` functionality |
| `group`         | :material-close:  | Group this building block belongs to. |
| `same_as*`         | :material-close:  | See same_as documentation. |



!!! Tip "Always use a relative font-size: it fits well with the relative sizes used by FHS"
Unless you need a fixed size in pixels...

##:fhs-fhs-logo: Styling
An Entity Name has support for the following forms of styling:

| Method    |     Support      | Description                                 |
| :-------- | :--------------: | :------------------------------------------ |
| `styles`  | :material-check: | Using inline SVG and CSS styles             |

Populair properties:

| Property      | Does what?            | Example                                        |
| :------------ | :-------------------- | :--------------------------------------------- |
| `font-size`   | Font size             | `font-size: 12em` sets RELATIVE font size      |
| `text-anchor` | Anchor of text        | `text-anchor: start` or `middle`, or `end`     |
| `fill`        | Fill color            | `fill: red` sets fill to color red             |
| `opacity`     | Opacity (stroke/fill) | `opacity: 0.7` sets the opacity of text to 70% |

--8<-- "docs/tools/default-haptics.md"

##:fhs-fhs-logo: Animations
The Entity Name tool has support for the following forms of animations:

| Method       |     Support      | Description                                              |
| :----------- | :--------------: | :------------------------------------------------------- |
| `colorstops` | :material-check: | List of state values to set the color                    |
| `colorlists` | :material-close: | Using a colorlist definition                             |
| `animations` | :material-check: | Operator state based animations with class/style styling |
