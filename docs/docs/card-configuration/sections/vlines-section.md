---
template: main.html
title: Basic Line tool
description: The line tool is a basic tool based on the SVG line element. You can apply CSS styling, user interactions and animations on this tool.
tags:
  - Vertical Lines
---

[line-tool support]: https://github.com/amoebelabs/swiss-army-knife-card/releases/

# The Line tool

[:octicons-tag-24: 1.0.0][line-tool support] ·
:octicons-package-dependents-24: Output

The Line tool is based on the SVG basic `<line>` element shape

<svg viewBox="0 0 100 10" xmlns="http://www.w3.org/2000/svg" width="100px">
  <line x1="5" y1="5" x2="95" y2="5" stroke="black" stroke-width="2"/>
</svg>

##:material-horseshoe: Basic usage
The Line tool needs a center position and a length, or start and endpoints.
=== "Standalone"

    ```yaml title="Horizontal / Vertical config" linenums="1" hl_lines="1"
    - type: 'line'              # tooltype is 'line'
      position:                 # Position on (100x100) canvas
        orientation: 'vertical' # Vertical, horizontal
        cx: 50                  # cx=50 is center position
        cy: 50                  # cy=50 is center position
        length: 25              # length of line.
      style:
        line:
          stroke-width: 2       # Set stroke width using CSS attribute
    ```
    ```yaml title="FromTo config" linenums="1" hl_lines="1"
    - type: 'line'              # tooltype is 'line'
      position:                 # Position on (100x100) canvas
        orientation: 'fromto'   # fromto (x1,y1,x2,y2)
        x1: 0                   # from: upperleft corner
        y1: 0
        x2: 100                 # to: lowerright corner
        y2: 100
      style:
        line:
          stroke-width: 2       # Set stroke width using CSS attribute
    ```
=== "Connected"

    ```yaml title="Horizontal / Vertical config" linenums="1" hl_lines="1 7"
    - type: 'line'              # tooltype is 'line'
      position:                 # Position on (100x100) canvas
        orientation: 'vertical' # Vertical, horizontal or fromto
        cx: 50                  # cx=50 is center position
        cy: 50                  # cy=50 is center position
        length: 25              # length of line.
      entity_index: 0           # connect to state of entity 0
      style:
        line:
          stroke-width: 2       # Set stroke width using CSS attribute
    ```
    ```yaml title="FromTo config" linenums="1" hl_lines="1 8"
    - type: 'line'              # tooltype is 'line'
      position:                 # Position on (100x100) canvas
        orientation: 'fromto'   # fromto (x1,y1,x2,y2)
        x1: 0                   # from: upperleft corner
        y1: 0
        x2: 100                 # to: lowerright corner
        y2: 100
      entity_index: 0           # connect to state of entity 0
      style:
        line:
          stroke-width: 2       # Set stroke width using CSS attribute
    ```

##:material-horseshoe: Styling
The Line tool has support for the following forms of styling:

| Method    |     Support      | Description                                 |
| :-------- | :--------------: | :------------------------------------------ |
| `classes` | :material-check: | Using SAK or User defined class definitions |
| `styles`  | :material-check: | Using inline SVG and CSS styles             |

The Line tool is composed of a single object: "line" and this is the selector for styling:

```yaml linenums="1" hl_lines="8 11"
- type: 'line'
  position:
    orientation: 'vertical'
    cx: 50
    cy: 50
    length: 25
  classes:
    line: # Line selector
      <...>
  styles:
    line: # Line selector
      <...>
```

Populair properties:

| Property       | Does what?   | Example                                                 |
| :------------- | :----------- | :------------------------------------------------------ |
| `stroke-width` | Line width   | `stroke-width: 2em` sets width to relative width of 2em |
| `stroke`       | Line color   | `stroke: red`                                           |
| `opacity`      | Line opacity | `opacity: 0.7` sets the opacity of the stroke to 70%    |

Reference: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/line

--8<-- "docs/tools/default-haptics.md"

##:material-horseshoe: Animations
The Line tool has support for the following forms of animations:

| Method       |     Support      | Description                                              |
| :----------- | :--------------: | :------------------------------------------------------- |
| `colorstops` | :material-check: | List of state values to set the color                    |
| `colorlists` | :material-close: | Using a colorlist definition                             |
| `animations` | :material-check: | Operator state based animations with class/style styling |

!!! Info "The use of animations require the tool to be connected to an entity"
