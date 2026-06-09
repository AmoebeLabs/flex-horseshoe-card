---
template: main.html
title: Visual Shapes
description: The line tool is a basic tool based on the SVG line element. You can apply CSS styling, user interactions and animations on this tool.
tags:
  - Circles
  - Horizontal Lines
  - Vertical Lines
---

[line-tool support]: https://github.com/amoebelabs/swiss-army-knife-card/releases/

# Visual Shapes: lines and circles sections

##:material-horseshoe: Basic usage
There are three visual shapes to use in the card:

| Shape | Section | Description
| - | - | - |
| circle | `circles` | Circle with centre position and radius or radius_percent |
| horizontal line | `hlines` | Horizontal lines with centre position and length |
| vertical line | `vlines` | Vertical lines with centre position and length |

The horizontal or vertical line needs a center position and a length.
The only difference is the section: horizontal lines in the `hlines` and vertical lines in the `vlines` section.

### Example definitions

=== "Circle"

    ```yaml title="Basic Circle 1" linenums="1" hl_lines="1"
    - xpos: 50                  # xpos=50 is center position
      ypos: 50                  # ypos=50 is center position
      radius: 25                # radius (in pixels) of circle
      styles:
        stroke-width: 2         # Set stroke width using CSS attribute
    ```
    ```yaml title="Basic Circle 2" linenums="1" hl_lines="1"
    - xpos: 50                  # xpos=50 is center position
      ypos: 50                  # ypos=50 is center position
      radius_percent: 25        # radius (in %) of circle
      entity_index: 0           # connects to entity 0 in the entity definitions
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

=== "Horizontal Line"

    ```yaml title="Horizontal / Vertical config" linenums="1" hl_lines="1 7"
    - xpos: 50                  # xpos=50 is center position
      ypos: 50                  # ypos=50 is center position
      length: 25                # length of line.
      entity_index: 0           # connect to state of entity 0
      styles:
        stroke-width: 2         # Set stroke width using CSS attribute
    ```

    ```yaml title="Horizontal / Vertical config" linenums="1" hl_lines="1 7"
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

=== "Vertical Line"

    ```yaml title="Horizontal / Vertical config" linenums="1" hl_lines="1 7"
    - xpos: 50                  # xpos=50 is center position
      ypos: 50                  # ypos=50 is center position
      length: 25                # length of line.
      entity_index: 0           # connect to state of entity 0
      styles:
        stroke-width: 2         # Set stroke width using CSS attribute
    ```

    ```yaml title="Horizontal / Vertical config" linenums="1" hl_lines="1 7"
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

##:material-horseshoe: Configuration Fields

=== "Circle"

    | Field          | Required          | Description |
    | :------------- | :---------------: | :---------- |
    | `xpos`         | :material-check:  | X position on the 100x100 card canvas |
    | `ypos`         | :material-check:  | Y position on the 100x100 card canvas |
    | `length`       | :material-check:  | Length of the lines |
    | `entity_index` | :material-close:  | Index in the `entities` section |
    | `styles`       | :material-close:  | CSS style definitions |
    | `color_stop`   | :material-close:  | Color stop used to set the font color based on the entity state |

=== "Horizontal Line"

    | Field          | Required          | Description |
    | :------------- | :---------------: | :---------- |
    | `xpos`         | :material-check:  | X position on the 100x100 card canvas |
    | `ypos`         | :material-check:  | Y position on the 100x100 card canvas |
    | `length`       | :material-check:  | Length of the lines |
    | `entity_index` | :material-close:  | Index in the `entities` section |
    | `styles`       | :material-close:  | CSS style definitions |
    | `color_stop`   | :material-close:  | Color stop used to set the font color based on the entity state |

=== "Vertical Line"

    | Field          | Required          | Description |
    | :------------- | :---------------: | :---------- |
    | `xpos`         | :material-check:  | X position on the 100x100 card canvas |
    | `ypos`         | :material-check:  | Y position on the 100x100 card canvas |
    | `length`       | :material-check:  | Length of the lines |
    | `entity_index` | :material-close:  | Index in the `entities` section |
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

=== "Circle"
    | Property         | Does what?   | Example                                                 |
    | :--------------- | :----------- | :------------------------------------------------------ |
    | `fill`          | Fill color            | `fill: red` sets fill to color red |
    | `stroke-width`  | Stroke width          | `stroke-width: 2em` sets width to relative width of 2em |
    | `stroke`        | Stroke color          | `stroke: blue` sets stroke to blue |
    | `opacity`       | Opacity (stroke/fill) | `opacity: 0.7` sets the opacity of circle to 70% |
    | `fill-opacity`  | Opacity for fill      | `fill-opacity: 0.5` sets the fill opacity to 50% |
    | `stroke-opacity`| Opacity for stroke    | `stroke-opacity: 0.5` sets the stroke opacity to 50% |

=== "Horizontal Line"
    | Property         | Does what?   | Example                                                 |
    | :--------------- | :----------- | :------------------------------------------------------ |
    | `stroke-width`   | Line width   | `stroke-width: 2em` sets width to relative width of 2em |
    | `stroke`         | Line color   | `stroke: red`                                           |
    | `opacity`        | Line opacity | `opacity: 0.7` sets the opacity of the stroke to 70%    |
    | `stroke-linecap` | Line end     | `round`, `butt`, or `square`                            |
=== "Vertical Line"
    | Property         | Does what?   | Example                                                 |
    | :--------------- | :----------- | :------------------------------------------------------ |
    | `stroke-width`   | Line width   | `stroke-width: 2em` sets width to relative width of 2em |
    | `stroke`         | Line color   | `stroke: red`                                           |
    | `opacity`        | Line opacity | `opacity: 0.7` sets the opacity of the stroke to 70%    |
    | `stroke-linecap` | Line end     | `round`, `butt`, or `square`                            |


--8<-- "docs/tools/default-haptics.md"

##:material-horseshoe: Animations
The visual shapes support the following forms of animations:

| Method       |     Support      | Description                                              |
| :----------- | :--------------: | :------------------------------------------------------- |
| `colorstops` | :material-check: | List of state values to set the color                    |
| `animations` | :material-check: | Operator state based animations with class/style styling |

!!! Info "The use of animations require the tool to be connected to an entity"
