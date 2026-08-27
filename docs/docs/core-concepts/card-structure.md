---
template: main.html
title: YAML Card Structure
description: Understand the Flexible Horseshoe Card YAML structure, including entities, layout sections, tools, styling, and card templates.
tags:
  - YAML
  - Structure
  - Card
---
# YAML card structure

The Flexible Horseshoe Card is configured with YAML. A card definition starts with the card type and then includes only the sections needed for that card, such as entities, card options, styles, animations, templates, composed cards, and layout elements.

The `layout` section contains the visual elements rendered on the card, including horseshoes, states, names, icons, circles, and lines.

This page provides a high-level map of the card structure. Each section is covered in more detail on its own documentation page.

## :material-horseshoe: Basic structure

A typical card follows this structure:

```yaml linenums="1" hl_lines="1 3 6 8 11 14 17 20 22 25 28 31 34 37 40 43 46 49"
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
      - <entity area layout items>

    circles:
      - <circle layout items>

    controls:
      - <control layout items>

    horseshoes:
      - <horseshoe layout items>

    hlines:
      - <horizontal line layout items>

    icons:
      - <entity icon layout items>

    lines:
      - <uniform line (horizontal, vertical, fromto) layout items>

    names:
      - <entity name layout items>

    states:
      - <entity state layout items>

    vlines:
      - <vertical line layout items>
```

You do not need to include every section. Add only the parts required by the card you are building.

## :material-horseshoe: Load a card from a template

A card can use a named template to provide a reusable structure. The card instance can then supply its own entities and variables.

```yaml linenums="1"
- type: custom:flex-horseshoe-card
  template:
    name: awair_tile
    entities:
      - entity: sensor.awair_score
    variables:
      - fhs_max: 100
```

Templates are useful when several cards share the same layout or styling but use different entities, values, or variables.

## :material-horseshoe: Compose multiple cards

Use the top-level `cards` section to place other cards inside a Flexible Horseshoe Card.

Each composed card can define its own type, template, entities, position, and size.

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

Composed cards are positioned on the parent card canvas. Use `xpos` and `ypos` for placement, and `width` and `height` for size.

## :material-horseshoe: Top-level card options

The top level contains the card’s general configuration.

| Section | Purpose |
| :------ | :------ |
| `type` | Defines the custom card type. |
| `entities` | Defines the Home Assistant entities and attributes used by the card. |
| `aspectratio` | Defines the card shape and layout canvas. |
| `styles` | Styles the card container, such as its background or border. |
| `animations` | Defines reusable animations. |
| `template` | Loads a named card template. |
| `cards` | Defines one or more cards placed inside the current card. |
| `layout` | Contains the visual elements rendered on the card. |

## :material-horseshoe: Entities

The `entities` section defines the data available to the card.

A minimal entity definition requires only the entity ID:

```yaml linenums="1"
entities:
  - entity: sensor.dsmr_reading_electricity_currently_delivered
```

The card can use Home Assistant metadata automatically, including the entity name, area, icon, unit, precision, and localized state formatting.

Override these values only when the card needs a different presentation:

```yaml linenums="1"
entities:
  - entity: sensor.dsmr_reading_electricity_currently_delivered
    name: Total
    decimals: 2
    icon: mdi:flash
    area: Electricity
```

For more information, see the entity definitions page.

## :material-horseshoe: Aspect ratio

The `aspectratio` option defines the shape of the card and its relative layout canvas.

```yaml linenums="1"
aspectratio: 1/1
```

This creates a square card with a base canvas of `100 × 100`.

A wider card can use a different ratio:

```yaml linenums="1"
aspectratio: 2/1
```

This creates a `200 × 100` layout canvas. The positioning model stays the same, but more horizontal space becomes available.

For detailed coordinate rules, see the positioning guide.

## :material-horseshoe: Card styles

The top-level `styles` section controls the card container.

Use it for properties such as:

- background color;
- background image;
- border radius;
- padding;
- other card-level CSS styling.

```yaml linenums="1"
styles:
  background: var(--card-background-color)
  border-radius: 12px
```

Styles for individual visual elements belong inside their respective layout items.

## :material-horseshoe: Layout

The `layout` section defines the visual structure of the card.

It determines which elements appear and where they are placed.

```yaml linenums="1"
layout:
  horseshoes:
    - entity_index: 0
      xpos: 50
      ypos: 50
      radius: 40
```

Layout items use a relative coordinate system. On a square card with `aspectratio: 1/1`, the base canvas is `100 × 100`.

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

Use `groups` to position several related items as one visual unit:

```yaml linenums="1"
layout:
  groups:
    L1:
      xpos: 23
      ypos: 72
```

Groups are especially useful with `same_as`. Reused items can keep the same local position and styling while their group determines where they appear on the card.

## :material-horseshoe: Layout sections

Visual elements are defined in dedicated layout sections.

| Section | Used for |
| :------ | :------- |
| `areas` | Displays the Home Assistant area of an entity. |
| `circles` | Draws circles. |
| `horseshoes` | Draws one or more horseshoe gauges. |
| `icons` | Displays entity icons or standalone icons. |
| `hlines` | Draws horizontal lines. |
| `names` | Displays entity names. |
| `states` | Displays entity states and units. |
| `vlines` | Draws vertical lines. |

Each section contains a list of items. Most layout items use `xpos` and `ypos` to define their position.

## :material-horseshoe: Reuse

Larger card definitions often contain repeated layout items. Static reuse features such as `same_as`, `constants`, `ref()`, and `calc()` reduce duplication.

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

Reuse keeps configurations shorter and makes repeated layouts easier to update consistently.

## :material-horseshoe: Where to go next

Use this page as a map of the available card sections.

Continue with the documentation for:

- [entity definitions](../core-concepts/entity-definitions.md);
- [layout overview](../sections/layout-overview.md);
- [visual shapes](../sections/visual-shapes-section.md);
- [entity elements](../sections/entities-section.md);
- [horseshoes](../sections/horseshoes-section.md);
- [groups and positioning](../core-concepts/positioning-and-groups.md);
- [CSS styling](../core-concepts/css-styling.md);
- [templating](../core-concepts/templating.md);
- composed cards;
- [reuse](../reuse/reuse-introduction.md).
