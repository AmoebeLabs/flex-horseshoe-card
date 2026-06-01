---
template: main.html
title: Entity State tool
description: The Entity State tool displays the Home Assistant Entity State value. The text can be styled using CSS.
tags:
  - Tools
  - Tool
  - Entity State
---

[entity-state-tool support]: https://github.com/amoebelabs/swiss-army-knife-card/releases/

# The Entity State tool

[:octicons-tag-24: 1.0.0][entity-state-tool support] ·
:octicons-package-dependents-24: Output

The Entity State tool displays the Home Assistant Entity State value and unit of measurement.

<svg viewBox="0 0 600 110" xmlns="http://www.w3.org/2000/svg" width="600px">
  <g>
    <text x="50" y="70">
      <tspan class="sak-state__value" style="font-size:3em;fill:var(--md-primary-fg-color);font-weight:700;text-anchor:middle;">
        88
      </tspan>
      <tspan dx="-0.1em" dy="-0.35em" class="sak-state__uom" style="font-size: 1.8em;fill: var(--md-primary-fg-color);opacity:0.8;text-anchor:middle;">
        %
      </tspan>
    </text>
  </g>
  <g>
    <text >
      <tspan x="200" y="70" class="sak-state__value" style="font-size:3em;fill:var(--md-primary-fg-color);font-weight:700;text-anchor:middle;">
        88
      </tspan>
      <tspan dx="-1.8em" dy="0.9em" class="sak-state__uom" style="font-size:1.8em;fill: var(--md-primary-fg-color);opacity:0.8;alignment-baseline:central;text-anchor:middle;">
        %
      </tspan>
    </text>
  </g>
  <g>
    <text >
      <tspan x="350" y="70" class="sak-state__value" style="font-size:3em;fill:var(--md-primary-fg-color);font-weight:700;text-anchor:middle;">
        88
      </tspan>
      <tspan dx="-1.8em" dy="-1.8em" class="sak-state__uom" style="font-size:1.8em;fill: var(--md-primary-fg-color);opacity:0.8;alignment-baseline:central;text-anchor:middle;">
        %
      </tspan>
    </text>
  </g>
  <g>
    <text >
      <tspan x="500" y="70" class="sak-state__value" style="font-size:3em;fill:var(--md-primary-fg-color);font-weight:700;text-anchor:middle;">
        88
      </tspan>
      <tspan dx="-1.8em" dy="-1.8em" class="sak-state__uom" style="display:none;font-size:1.8em;fill: var(--md-primary-fg-color);opacity:0.8;alignment-baseline:central;text-anchor:middle;">
        %
      </tspan>
    </text>
  </g>
</svg>

##:fhs-fhs-logo: Basic usage
The Entity State tool needs a center position and the entity_index from which the state value is used.
=== "Connected"

```yaml linenums="1" hl_lines="1"
- type: 'state' # tooltype is 'state'
  position: # Position on (100x100) canvas
    cx: 50 # cx=50 is center position
    cy: 50 # cy=50 is center position
  entity_index: 0 # connect to state of entity 0
  styles:
    state:
      font-size: 6em
    uom:
      opacity: 0.8
```

##:fhs-fhs-logo: Advanced usage
The unit of measurement can be placed at the end (default), above (top), under (bottom) or not (none) alongside the state value.

=== "Connected"

```yaml linenums="1" hl_lines="6 7"
- type: 'state' # tooltype is 'state'
  position:
    cx: 50
    cy: 50
  entity_index: 0
  show:
    uom: bottom # default = end. Other top/bottom/none
  styles:
    state:
      font-size: 6em
    uom:
      opacity: 0.8
```

##:fhs-fhs-logo: State, Attribute, Attribute lists and Secondary Info

The state tool can do more than just display the state value of an entity. An attribute, or attribute from an attribute list and secondary info can also be used by the state tool.

###Displaying attributes
Nothing special, but of course attributes can be used for displaying the state of an entity.

```yaml title="views/view-sake8.yaml" linenums="1" hl_lines="3"
entities:
  - entity: weather.tha_moon
    attribute: temperature
    decimals: 1
    unit: '°C'
    icon: mdi:thermometer
    area: 'Tha Moon'
    name: 'Temperature'
```

###Displaying attributes from attribute list
In some cases, attributes are a list. This applies to the 5 day weather forecast for instance.
By indexing the array, you can get the right attribute you want.

```yaml title="views/view-sake1.yaml" linenums="1" hl_lines="3"
entities:
  - entity: weather.zoefdehaas
    attribute: forecast[0].temperature
    decimals: 1
    unit: '°C'
```

###State converter options
:octicons-tag-24: 2.5.1 · :octicons-tools-24: Experimental · :octicons-alert-24: BREAKING CHANGE

A state can have a predefined converter option. See [The supported converter options][swiss-army-knife-basic-state-converters].

###State formatting options
:octicons-tag-24: 2.5.1 · :octicons-tools-24: Experimental · :octicons-alert-24: BREAKING CHANGE

A state can have a format option. See [The supported format options][swiss-army-knife-basic-state-formatters].

###Displaying secondary info

Any entity can have secondary info. There is support for some of these attributes and formatting.

Depending on the secondary_info attribute type, the format can specify:

- brightness for a brightness attribute
- duration for a duration
- relative, date, time, datetime for attribute types of last_updated/changed/triggered.

```yaml title="views/view-sake8.yaml" linenums="1" hl_lines="3 4"
entities:
  - entity: weather.tha_moon
    secondary_info: last_updated # last_updated, last_changed, last_triggered
    format: relative # relative, date, time, datetime
```

##:fhs-fhs-logo: Styling
The Entity State tool has support for the following forms of styling:

| Method    |     Support      | Description                                 |
| :-------- | :--------------: | :------------------------------------------ |
| `classes` | :material-check: | Using SAK or User defined class definitions |
| `styles`  | :material-check: | Using inline SVG and CSS styles             |

The Entity State tool is composed of a two objects: "state" and "uom" as the selectors for styling:

```yaml linenums="1"hl_lines="7 9 12 14"
- type: 'state'
  position:
    cx: 50
    cy: 50
  entity_index: 0
  classes:
    state: # state value selector
      <...>
    uom: # state uom selector
      <...>
  styles:
    state: # state value selector
      <...>
    uom: # state uom selector
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
The Entity State tool has support for the following forms of animations:

| Method       |     Support      | Description                                              |
| :----------- | :--------------: | :------------------------------------------------------- |
| `colorstops` | :material-check: | List of state values to set the color                    |
| `colorlists` | :material-close: | Using a colorlist definition                             |
| `animations` | :material-check: | Operator state based animations with class/style styling |

<!--- Internal references --->

[swiss-army-knife-basic-state-converters]: ../basics/entity-state-converters.md 'Swiss Army Knife - Entity State Converters'
[swiss-army-knife-basic-state-formatters]: ../basics/localization-and-formatters.md 'Swiss Army Knife - Localization and Formatters'
