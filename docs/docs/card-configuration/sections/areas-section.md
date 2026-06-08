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

# The Entity Area Section

##:material-horseshoe: Basic Usage

Entity areas are defined in the `areas` section. This section is a list of areas.
<br>The value of the area can be defined by:

- The cards entities definition, where the area is hard-coded
- From the Home Assistant registry, where an area is defined for the entity

### Example definitions

The Entity Area item needs a center position and the `entity_index` from which the area text is used.


=== "Connected"

```yaml linenums="1" hl_lines="1"
- xpos: 50 # xpos=50 is center position
  ypos: 50 # ypos=50 is center position
  entity_index: 0 # connect to state of entity 0
  styles:
    font-size: 12em # set font size to 12em
```

!!! Tip "Always use a relative font-size: it fits well with the relative sizes used by FHS"
Unless you need a fixed size in pixels...

##:material-horseshoe: Styling
The Entity Area tool has support for the following forms of styling:

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

##:material-horseshoe: Animations
The Entity Area tool has support for the following forms of animations:

| Method       |     Support      | Description                                              |
| :----------- | :--------------: | :------------------------------------------------------- |
| `colorstops` | :material-check: | List of state values to set the color                    |
| `animations` | :material-check: | Operator state based animations with class/style styling |
