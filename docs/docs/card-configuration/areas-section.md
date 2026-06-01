---
template: main.html
title: Entity Area tool
description: The Entity Area tool displays the Home Assistant Entity Area value. The text can be styled using CSS.
tags:
  - Tools
  - Tool
  - Entity Area
---

[entity-area-tool support]: https://github.com/amoebelabs/swiss-army-knife-card/releases/

# The Entity Area tool

[:octicons-tag-24: 1.0.0][entity-area-tool support] ·
:octicons-package-dependents-24: Output

The Entity Area tool displays the Home Assistant Entity Area value.

<svg viewBox="0 0 400 25" xmlns="http://www.w3.org/2000/svg" width="400px">
  <text x="20" y="20" font-size="20" fill="grey">
    <tspan>Livingroom</tspan>
  </text>
</svg>

##:fhs-fhs-logo: Basic usage
The Entity Area tool needs a center position and the entity_index from which the area text is used.
=== "Connected"

```yaml linenums="1" hl_lines="1"
- type: 'area' # tooltype is 'area'
  position: # Position on (100x100) canvas
    cx: 50 # cx=50 is center position
    cy: 50 # cy=50 is center position
  entity_index: 0 # connect to state of entity 0
  styles:
    area:
      font-size: 12em # set font size to 12em
```

!!! Tip "Always use a relative font-size: it fits well with the relative sizes used by SAK"
Unless you need a fixed size in pixels...

##:fhs-fhs-logo: Styling
The Entity Area tool has support for the following forms of styling:

| Method    |     Support      | Description                                 |
| :-------- | :--------------: | :------------------------------------------ |
| `classes` | :material-check: | Using SAK or User defined class definitions |
| `styles`  | :material-check: | Using inline SVG and CSS styles             |

The Entity Area tool is composed of a single object: "area" and this is the selector for styling:

```yaml linenums="1"hl_lines="7 10"
- type: 'area'
  position:
    cx: 50
    cy: 50
  entity_index: 0 # connect to entity 0
  classes:
    area: # area selector
      <...>
  styles:
    area: # area selector
      <...>
```

Populair properties:

| Property      | Does what?            | Example                                        |
| :------------ | :-------------------- | :--------------------------------------------- |
| `font-size`   | Font size             | `font-size: 12em` sets RELATIVE font size      |
| `text-anchor` | Anchor of text        | `text-anchor: start` or `middle`, or `end`     |
| `fill`        | Fill color            | `fill: red` sets fill to color red             |
| `opacity`     | Opacity (stroke/fill) | `opacity: 0.7` sets the opacity of text to 70% |

--8<-- "docs/tools/default-haptics.md"

##:fhs-fhs-logo: Animations
The Entity Area tool has support for the following forms of animations:

| Method       |     Support      | Description                                              |
| :----------- | :--------------: | :------------------------------------------------------- |
| `colorstops` | :material-check: | List of state values to set the color                    |
| `colorlists` | :material-close: | Using a colorlist definition                             |
| `animations` | :material-check: | Operator state based animations with class/style styling |
