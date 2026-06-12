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

A Flexible Horseshoe Card is configured with YAML. The card definition starts with the card type and then adds the parts the card needs: entities, card options, styles, animations, and the visual layout.

The `layout` section contains the visual elements that are drawn on the card, such as horseshoes, states, names, icons, circles, and lines.

This page gives a high-level overview of the card structure. The individual sections are explained in more detail on their own pages.

## :material-horseshoe: Basic structure

A typical card has this structure:

```yaml linenums="1" hl_lines="1 4 7 10 13 18 21 24 27 30 33 36 39 42 45"
- type: custom:flex-horseshoe-card

  entities:
    - <list of entities>

  aspectratio: 1/1

  styles:
    <styles for the card itself>

  animations:
    <animation definitions>

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

## :material-horseshoe: Top-level card options

The top level of the card contains the general configuration.

| Section | Purpose |
| :------ | :------ |
| `type` | Defines the custom card type |
| `entities` | Defines the Home Assistant entities and attributes used by the card |
| `aspectratio` | Defines the shape of the card |
| `styles` | Styles the card itself, such as background color or background image |
| `animations` | Defines reusable animations |
| `layout` | Contains the visual elements shown on the card |

## :material-horseshoe: Entities

The `entities` section defines the data the card can use.

A minimal entity definition only needs the entity id:

```yaml
entities:
  - entity: sensor.dsmr_reading_electricity_currently_delivered
```

The card will try to use Home Assistant metadata automatically, such as the entity name, area, icon, unit, precision, and localized state formatting.

You can override these values when needed:

```yaml
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

```yaml
aspectratio: 1/1
```

creates a square card. In this case, the base layout canvas is `100 x 100`.

A wider card can use another ratio:

```yaml
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

```yaml
styles:
  background: var(--card-background-color)
  border-radius: 12px
```

Item-level styling is configured inside the individual layout items.

## :material-horseshoe: Layout

The `layout` section contains the visual structure of the card.

This is where you define what appears on the card and where it should be placed.

```yaml
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

```yaml
layout:
  constants:
    centerX: 50
    centerY: 50
    lineStyle:
      stroke: var(--disabled-text-color)
      stroke-width: 2
```

Use `groups` to place multiple related items together:

```yaml
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

```yaml
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
- reuse
