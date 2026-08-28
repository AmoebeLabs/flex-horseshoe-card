---
template: main.html
title: State
description: Display the current state and unit of a Home Assistant entity in a Flexible Horseshoe Card.
tags:
  - State
  - Entity
  - Card tools
---

# State

The State tool shows the current value of a Home Assistant entity or attribute.

By default, the Flexible Horseshoe Card follows Home Assistant formatting for the value and unit, including locale, number formatting, and display precision.

<!-- State examples image -->

## :material-horseshoe: Basic configuration

Add states under `layout.states`:

```yaml linenums="1"
entities:
  - entity: sensor.living_room_temperature

layout:
  states:
    - id: temperature
      entity_index: 0
      xpos: 50
      ypos: 50
      styles:
        font-size: 2em
```

`entity_index` selects the entity whose state is displayed.

`xpos` and `ypos` position the state on the card.

See [Positioning and sizing](../../card-basics/positioning-and-sizing.md) for the card coordinate system.

## :material-horseshoe: Configuration options

| Field          | Required | Default             | Description                                  |
| -------------- | :------: | ------------------- | -------------------------------------------- |
| `entity_index` |    Yes   |                     | Entity whose state is displayed              |
| `xpos`         |    Yes   |                     | Horizontal position                          |
| `ypos`         |    Yes   |                     | Vertical position                            |
| `show.uom`     |    No    | `end`               | Places the unit at `end`, `top`, or `bottom` |
| `uom.styles`   |    No    |                     | Unit styling                                 |
| `ellipsis`     |    No    |                     | Maximum number of displayed state characters |
| `styles`       |    No    | Default state style | SVG and CSS styling                          |
| `color_stops`  |    No    | Not set             | Colors the state from the entity value       |

## :material-horseshoe: State and unit appearance

Use `styles` to change the appearance and alignment of the state.

```yaml linenums="1"
layout:
  states:
    - entity_index: 0
      xpos: 50
      ypos: 50
      styles:
        font-size: 2.5em
        font-weight: bold
        text-anchor: middle
        fill: var(--primary-text-color)
        opacity: 1
```

The unit can be styled separately with `uom.styles`:

```yaml linenums="1"
layout:
  states:
    - entity_index: 0
      xpos: 50
      ypos: 50
      styles:
        font-size: 2em
      uom:
        styles:
          font-size: 0.7em
          opacity: 0.6
```

Common styles include:

| Property      | Use                                                    |
| ------------- | ------------------------------------------------------ |
| `font-size`   | Text size                                              |
| `font-weight` | Text weight                                            |
| `text-anchor` | Horizontal alignment using `start`, `middle`, or `end` |
| `fill`        | Text color                                             |
| `opacity`     | Text opacity                                           |

See [Styling](../../appearance/styling.md) for the complete styling guide.

## :material-horseshoe: Keep long values readable

Use `ellipsis` to limit the number of displayed characters:

```yaml linenums="1"
layout:
  states:
    - entity_index: 0
      xpos: 50
      ypos: 50
      ellipsis: 12
```

The value is shortened after the configured number of characters. Its unit remains visible.

## :material-horseshoe: Formatting values

State values follow Home Assistant localization and formatting by default.

Configure decimals, units, locale, and other formatting options on the entity in the card's `entities` list. The same formatting is then used wherever that entity is shown in the card.

```yaml linenums="1"
entities:
  - entity: sensor.living_room_temperature
    decimals: 1
```

See [Entities](../../card-basics/entities.md) for entity configuration and [Localization and formatting](../../localization/overview.md) for formatting options.

## :material-horseshoe: Show values in color

Use color stops when the state should change color based on its value:

```yaml linenums="1"
layout:
  states:
    - entity_index: 0
      xpos: 50
      ypos: 50
      show:
        item_style: colorstop
      color_stops:
        colors:
          0: green
          50: orange
          100: red
```

The State tool applies the matching color to the displayed value.

See [Color stops](../../appearance/color-stops.md) for ranges, gradients, palettes, and interpolation.

## :material-horseshoe: Related

* [Name](entity-name-tool.md)
* [Area](entity-area-tool.md)
* [Icon](entity-icon-tool.md)
* [Entities](../../card-basics/entities.md)
* [Localization and formatting](../../localization/overview.md)
* [Positioning and sizing](../../card-basics/positioning-and-sizing.md)
* [Styling](../../appearance/styling.md)
* [Color stops](../../appearance/color-stops.md)
* [Actions](../../interaction/actions.md)
* [Animations](../../interaction/animations.md)
