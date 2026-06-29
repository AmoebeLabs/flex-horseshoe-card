---
template: main.html
title: YAML Card Structure
description: Overview of the main YAML structure used by the Flexible Horseshoe Card.
tags:
  - YAML
  - Structure
  - Card
---

# YAML card structure

A Flexible Horseshoe Card is configured with YAML. The card definition starts with the card type and then adds the parts the card needs: entities, card options, styles, animations, optional templates, composed cards, and the visual layout.

The `layout` section contains the visual elements drawn on the card, such as horseshoes, states, names, icons, circles, and lines.

This page gives a high-level overview of the card structure. The individual sections are explained in more detail on their own pages.

## :material-horseshoe: Basic structure

A typical card has this structure:

```yaml linenums="1" hl_lines="1 4 7 10 13 16 19 22 25 28 31 34 37 40 43 46 49"
- type: custom:flex-horseshoe-card

  entities:
    - <list of entities>

  aspectratio: 1/1

  styles:
    <styles for the card itself>

  animations:
    <animation definitions>

  template:
    <template definition>

  cards:
    - <composed card definitions>

  layout:

    constants:
      <reusable static values or style fragments>

    groups:
      <group definitions>

    areas:
      - <area layout items>

    circles:
      - <circle layout items>

    horseshoes:
      - <horseshoe layout items>

    icons:
      - <icon layout items>

    hlines:
      - <horizontal line layout items>

    names:
      - <name layout items>

    states:
      - <state layout items>

    vlines:
      - <vertical line layout items>
```

## :material-horseshoe: Load a card from a template

A card can use a named template to define its structure. The template provides the reusable card configuration, while the card instance can provide its own entities and variables.

```yaml linenums="1"
- type: custom:flex-horseshoe-card
  template:
    name: awair_tile
    entities:
      - entity: sensor.awair_score
    variables:
      - fhs_max: 100
```

Use templates when multiple cards share the same layout or styling but use different entities, values, or variables.

## :material-horseshoe: Compose multiple cards

You can define and place other cards inside a Flexible Horseshoe Card by using the top-level `cards` section.

Each composed card can have its own type, template, entities, position, and size.

```yaml linenums="1"
type: custom:flex-horseshoe-card
cards:
  - type: custom:flex-horseshoe-card
    template: awair_tile
    xpos: 25
    ypos: 50
    width: 40
    height: 40
    entities:
      - entity: sensor.awair_score
```

Composed cards are positioned on the parent card canvas. Use `xpos` and `ypos` to place the card, and `width` and `height` to control its size.

## :material-horseshoe: Top-level card options

The top level of the card contains the general configuration.

| Section | Purpose |
| :------ | :------ |
| `type` | Defines the custom card type |
| `entities` | Defines the Home Assistant entities and attributes used by the card |
| `aspectratio` | Defines the shape of the card |
| `styles` | Styles the card itself, such as background color or background image |
| `animations` | Defines reusable animations |
| `template` | Loads a named template for the card |
| `cards` | Defines one or more cards placed inside the current card |
| `layout` | Contains the visual elements shown on the card |

## :material-horseshoe: Entities

The `entities` section defines the data the card can use.

A minimal entity definition only needs the entity ID:

```yaml linenums="1"
entities:
  - entity: sensor.dsmr_reading_electricity_currently_delivered
```

The card will try to use Home Assistant metadata automatically, such as the entity name, area, icon, unit, precision, and localized state formatting.

You can override these values when needed:

```yaml linenums="1"
entities:
  - entity: sensor.dsmr_reading_electricity_currently_delivered
    name: Total
    decimals: 2
    icon: mdi:flash
    area: Electricity
```

For more details, see the entity definitions page.

## :material-horseshoe: Aspect ratio

The `aspectratio` option defines the shape of the card.

For example:

```yaml linenums="1"
aspectratio: 1/1
```

This creates a square card. In this case, the base layout canvas is `100 x 100`.

A wider card can use another ratio:

```yaml linenums="1"
aspectratio: 2/1
```

This creates a wider layout canvas of `200 x 100`.

The same positioning logic still applies, but the available horizontal space changes. More detailed positioning rules are explained in the positioning guide.

## :material-horseshoe: Card styles

The top-level `styles` section styles the card itself.

Use it for things like:

- card background color
- background image
- border radius
- padding
- other card-level CSS styling

Example:

```yaml linenums="1"
styles:
  background: var(--card-background-color)
  border-radius: 12px
```

Item-level styling is configured inside the individual layout items.

## :material-horseshoe: Layout

The `layout` section contains the visual structure of the card.

This is where you define what appears on the card and where it should be placed.

```yaml linenums="1"
layout:
  horseshoes:
    - entity_index: 0
      xpos: 50
      ypos: 50
      radius: 40
```

Layout items are positioned on a relative card canvas. For a square card with an aspect ratio of `1/1`, the base canvas is `100 x 100`.

## :material-horseshoe: Constants and groups

The `layout` section can also contain helper sections.

Use `constants` for reusable static values or style fragments:

```yaml linenums="1"
layout:
  constants:
    centerX: 50
    centerY: 50
    lineStyle:
      stroke: var(--disabled-text-color)
      stroke-width: 2
```

Use `groups` to place multiple related items together:

```yaml linenums="1"
layout:
  groups:
    L1:
      xpos: 23
      ypos: 72
```

Groups are especially useful when combined with `same_as`, because repeated items can share the same local position and then be placed by their group.

## :material-horseshoe: Layout sections

The visual parts of the card are defined in layout sections.

| Section | Used for |
| :------ | :------- |
| `areas` | Displaying the Home Assistant area of an entity |
| `circles` | Drawing circles |
| `horseshoes` | Drawing one or more horseshoes |
| `icons` | Displaying entity icons or standalone icons |
| `hlines` | Drawing horizontal lines |
| `names` | Displaying entity names |
| `states` | Displaying entity states and units |
| `vlines` | Drawing vertical lines |

Each section contains a list of items. Most layout items use `xpos` and `ypos` to define their position on the card.

## :material-horseshoe: Reuse

Larger card configurations can contain repeated layout items. To reduce duplicated YAML, layout items can use static reuse features such as `same_as`, `constants`, `ref()`, and `calc()`.

Example:

```yaml linenums="1"
layout:
  constants:
    lineStep: 11

  hlines:
    - id: first
      xpos: 50
      ypos: 64
      length: 85

    - id: second
      same_as: first
      same_as_dypos: calc(1 * lineStep)
```

Reuse keeps the YAML shorter and makes repeated layouts easier to maintain.

## :material-horseshoe: Where to go next

Use this page as a map of the card structure.

For more detail, continue with the pages about:

- entity definitions
- layout overview
- visual shapes
- entity elements
- horseshoes
- groups and positioning
- CSS styling
- templating
- composed cards
- reuse
