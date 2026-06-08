---
template: main.html
title: Basic Line tool
description: The line tool is a basic tool based on the SVG line element. You can apply CSS styling, user interactions and animations on this tool.
tags:
  - Horizontal Lines
  - Vertical Lines
---

[line-tool support]: https://github.com/amoebelabs/swiss-army-knife-card/releases/

# The Horizontal and Vertical Line Section

##:material-horseshoe: Basic usage
The horizontal or vertical line needs a center position and a length.
The only difference is the section: horizontal lines in the `hlines` and vertical lines in the `vlines` section.

### Example definitions

=== "Standalone"

    ```yaml title="Horizontal / Vertical config" linenums="1" hl_lines="1"
    - xpos: 50                  # xpos=50 is center position
      ypos: 50                  # ypos=50 is center position
      length: 25                # length of line.
      styles:
        stroke-width: 2         # Set stroke width using CSS attribute
    ```
=== "Connected"

    ```yaml title="Horizontal / Vertical config" linenums="1" hl_lines="1 7"
    - xpos: 50                  # xpos=50 is center position
      ypos: 50                  # ypos=50 is center position
      length: 25                # length of line.
      entity_index: 0           # connect to state of entity 0
      styles:
        stroke-width: 2         # Set stroke width using CSS attribute
    ```

### Fields:

| Field          | Required          | Description |
| :------------- | :---------------: | :---------- |
| `entity_index` | :material-check:  | Index in the `entities` section |
| `xpos`         | :material-check:  | X position on the 100x100 card canvas |
| `ypos`         | :material-check:  | Y position on the 100x100 card canvas |
| `length`       | :material-check:  | Length of the lines |
| `styles`       | :material-close:  | CSS style definitions |
| `color_stop`   | :material-close:  | Color stop used to set the font color based on the entity state |

Other fields:

| Field          | Required          | Description |
| :------------- | :---------------: | :---------- |
| `id`           | :material-close:  | Optional unique id within section to identify the name for `same_as` functionality |
| `group`         | :material-close:  | Group this building block belongs to. |
| `same_as*`         | :material-close:  | See same_as documentation. |

##:material-horseshoe: Styling
The Line tool has support for the following forms of styling:


| Method    |     Support      | Description                                 |
| :-------- | :--------------: | :------------------------------------------ |
| `styles`  | :material-check: | Using inline SVG and CSS styles             |

Populair properties:

| Property         | Does what?   | Example                                                 |
| :--------------- | :----------- | :------------------------------------------------------ |
| `stroke-width`   | Line width   | `stroke-width: 2em` sets width to relative width of 2em |
| `stroke`         | Line color   | `stroke: red`                                           |
| `opacity`        | Line opacity | `opacity: 0.7` sets the opacity of the stroke to 70%    |
| `stroke-linecap` | Line end     | `round`, `butt`, or `square`                            |


Reference: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/line

--8<-- "docs/tools/default-haptics.md"

##:material-horseshoe: Animations
The Line tool has support for the following forms of animations:

| Method       |     Support      | Description                                              |
| :----------- | :--------------: | :------------------------------------------------------- |
| `colorstops` | :material-check: | List of state values to set the color                    |
| `animations` | :material-check: | Operator state based animations with class/style styling |

!!! Info "The use of animations require the tool to be connected to an entity"
