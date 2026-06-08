---
template: main.html
title: Advanced Horseshoe tool
description: The horseshoe tool ...
tags:
  - Tools
  - Tool
  - Horseshoe
---

[horseshoe-tool support]: https://github.com/amoebelabs/flex-horseshoe-card/releases/

# The Horse Shoe tool

[:octicons-tag-24: 1.0.0][horseshoe-tool support] ·
:octicons-package-dependents-24: Output

TBD!

##:material-horseshoe: Basic usage

=== "Standalone"

    ```yaml linenums="1" hl_lines="1"
      - type: 'horseshoe'           # tooltype is 'horseshoe'
    ```
=== "Connected"

    ```yaml linenums="1" hl_lines="1 2"
    - type: 'horseshoe'           # tooltype is 'horseshoe'
      entity_index: 0           # connect to state of entity 0
    ```


##:material-horseshoe: Available show options

All options are optional.

| Name            |   Default    |                                  Parameter                                  | Since  | Description                                                                                                                                      |
| --------------- | :----------: | :-------------------------------------------------------------------------: | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| scale_tickmarks |     true     |                              `true` / `false`                               | v0.8.0 | Display scale                                                                                                                                    |
| horseshoe_style | `autominmax` | `fixed` / `autominmax`/ `colorstop` / `colorstopgradient`/ `lineargradient` | v0.8.0 | Fill style. Most fill styles need the colorstop list to be specified. See [horseshoe fill style list](#horseshoe-fill-styles) for a description. |


##:material-horseshoe: Styling
The Horse Shoe tool has support for the following forms of styling:

| Method    |     Support      | Description                                 |
| :-------- | :--------------: | :------------------------------------------ |
| `classes` | :material-check: | Using SAK or User defined class definitions |
| `styles`  | :material-check: | Using inline SVG and CSS styles             |

The Horse Shoe is ...

```yaml linenums="1"hl_lines="10 13"
- type: 'horseshoe'
```

Populair properties:

| Property         | Does what?            | Example                                                 |
| :--------------- | :-------------------- | :------------------------------------------------------ |
| `fill`           | Fill color            | `fill: red` sets fill to color red                      |
| `stroke-width`   | Stroke width          | `stroke-width: 2em` sets width to relative width of 2em |
| `stroke`         | Stroke color          | `stroke: blue` sets stroke to blue                      |
| `opacity`        | Opacity (stroke/fill) | `opacity: 0.7` sets the opacity of rect to 70%          |
| `fill-opacity`   | Opacity for fill      | `fill-opacity: 0.5` sets the fill opacity to 50%        |
| `stroke-opacity` | Opacity for stroke    | `stroke-opacity: 0.5` sets the stroke opacity to 50%    |

--8<-- "docs/tools/default-haptics.md"

##:material-horseshoe: Animations
The Horse Shoe tool has support for the following forms of animations:

| Method       |     Support      | Description                                              |
| :----------- | :--------------: | :------------------------------------------------------- |
| `colorstops` | :material-close: | List of state values to set the color                    |
| `colorlists` | :material-close: | Using a colorlist definition                             |
| `animations` | :material-close: | Operator state based animations with class/style styling |

!!! Info "The use of animations require the tool to be connected to an entity"

##:material-horseshoe: Examples

##:material-horseshoe: Detailed specification
