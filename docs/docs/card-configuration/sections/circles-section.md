---
template: main.html
title: Basic Circle tool
description: The circle tool is a basic tool based on the SVG circle element. You can apply CSS styling, user interactions and animations on this tool.
tags:
  - Tools
  - Tool
  - Circle
---

[circle-tool support]: https://github.com/amoebelabs/swiss-army-knife-card/releases/
# The Circle tool
[:octicons-tag-24: 1.0.0][circle-tool support] ·
:octicons-package-dependents-24: Output

The Circle tool is based on the SVG basic `<circle>`element shape.

<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100px">
  <circle cx="50" cy="50" r="45" fill="var(--md-primary-fg-color--light)" stroke="var(--md-primary-fg-color--dark)" stroke-width="2"/>
</svg>

##:material-horseshoe: Basic usage
The Circle tool needs a center position and a radius.

=== "Standalone"
    ```yaml linenums="1" hl_lines="1"
    - type: 'circle'            # tooltype is 'circle'
      position:                 # Position on (100x100) canvas
        cx: 50                  # cx=50 is center position
        cy: 50                  # cy=50 is center position
        radius: 25              # radius of circle. Width/height is 50
    ```
=== "Connected"
    ```yaml linenums="1" hl_lines="1 6"
    - type: 'circle'            # tooltype is 'circle'
      position:                 # Position on (100x100) canvas
        cx: 50                  # cx=50 is center position
        cy: 50                  # cy=50 is center position
        radius: 25              # radius of circle. Width/height is 50
      entity_index: 0           # connect to state of entity 0
    ```

##:material-horseshoe: Styling
The Circle tool has support for the following forms of styling:

| Method       | Support          | Description            |
| :----------- | :--------------: | :-------------------- |
| `classes`    | :material-check: | Using SAK or User defined class definitions  |
| `styles`     | :material-check: | Using inline SVG and CSS styles |

The Circle tool is composed of a single object: "circle" and this is the selector for styling:
```yaml linenums="1" hl_lines="7 10"
- type: 'circle'
  position:
    cx: 50
    cy: 50
    radius: 25
  classes:
    circle:                   # Circle selector
      <...>
  styles:
    circle:                   # Circle selector
      <...>
```
Populair properties:

| Property       | Does what?            | Example                                                 |
| :-------------- | :-------------------- | :------------------------------------------------------ |
| `fill`          | Fill color            | `fill: red` sets fill to color red |
| `stroke-width`  | Stroke width          | `stroke-width: 2em` sets width to relative width of 2em |
| `stroke`        | Stroke color          | `stroke: blue` sets stroke to blue |
| `opacity`       | Opacity (stroke/fill) | `opacity: 0.7` sets the opacity of circle to 70% |
| `fill-opacity`  | Opacity for fill      | `fill-opacity: 0.5` sets the fill opacity to 50% |
| `stroke-opacity`| Opacity for stroke    | `stroke-opacity: 0.5` sets the stroke opacity to 50% |

Reference: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/circle

--8<-- "docs/tools/default-haptics.md"

##:material-horseshoe: Animations
The Circle tool has support for the following forms of animations:

| Method       | Support          | Description            |
| :----------- | :--------------: | :-------------------- |
| `colorstops` | :material-check: | List of state values to set the color |
| `colorlists` | :material-close: | Using a colorlist definition |
| `animations` | :material-check: | Operator state based animations with class/style styling |

!!! Info "The use of animations require the tool to be connected to an entity"




