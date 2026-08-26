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

Use a state to show the current value of a Home Assistant entity or one of its attributes.

FHS uses Home Assistant formatting for the value and unit by default.

<!-- State examples image -->

##:material-horseshoe: Basic use

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

## :material-horseshoe: State and unit

For entities with a unit of measurement, FHS displays the value and unit together.

```yaml linenums="1"
entities:
  - entity: sensor.living_room_temperature

layout:
  states:
    - entity_index: 0
      xpos: 50
      ypos: 50
      styles:
        font-size: 2em
```

For a temperature sensor this could display:

**21.4 °C**

The unit follows Home Assistant by default. Set `unit` on the entity when you want to override it:

```yaml linenums="1"
entities:
  - entity: sensor.living_room_temperature
    unit: °F
```

See [Entities](../card-basics/entities.md) for selecting attributes and overriding entity values such as units and decimals.

## :material-horseshoe: Unit position

Use `show.uom` to place the unit beside, above, or below the state.

=== "End"

    ```yaml linenums="1"
    layout:
      states:
        - entity_index: 0
          xpos: 50
          ypos: 50
          show:
            uom: end
    ```

    This is the default.

=== "Top"

    ```yaml linenums="1"
    layout:
      states:
        - entity_index: 0
          xpos: 50
          ypos: 50
          show:
            uom: top
    ```

=== "Bottom"

    ```yaml linenums="1"
    layout:
      states:
        - entity_index: 0
          xpos: 50
          ypos: 50
          show:
            uom: bottom
    ```

The unit can be styled separately:

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

## :material-horseshoe: Position and alignment

Position the complete state with `xpos` and `ypos`.

```yaml linenums="1"
layout:
  states:
    - entity_index: 0
      xpos: 10
      ypos: 50
      styles:
        font-size: 2em
        text-anchor: start
```

Use `text-anchor` to control horizontal alignment:

* `start`
* `middle`
* `end`

See [Positioning and sizing](../card-basics/positioning-and-sizing.md) for the card coordinate system.

## :material-horseshoe: State appearance

Use `styles` to change the appearance of the state:

```yaml linenums="1"
layout:
  states:
    - entity_index: 0
      xpos: 50
      ypos: 50
      styles:
        font-size: 2.5em
        font-weight: bold
        fill: var(--primary-text-color)
        opacity: 1
```

Common styles include:

| Property      | Use                  |
| ------------- | -------------------- |
| `font-size`   | State text size      |
| `font-weight` | Text weight          |
| `text-anchor` | Horizontal alignment |
| `fill`        | Text color           |
| `opacity`     | Text opacity         |

See [Styling](../appearance/styling.md) for the complete styling guide.

## :material-horseshoe: Limit long states

Use `max_characters` to shorten long state values:

```yaml linenums="1"
layout:
  states:
    - entity_index: 0
      xpos: 50
      ypos: 50
      max_characters: 12
```

Only the state value is shortened. The unit remains separate.

`ellipsis` is also supported for existing configurations.

## :material-horseshoe: Formatting values

State values follow Home Assistant localization and formatting by default.

You can override formatting when a card needs different decimals, number formatting, dates, times, durations, or raw state values.

```yaml linenums="1"
entities:
  - entity: sensor.living_room_temperature
    decimals: 1
```

More advanced formatting belongs in the shared formatting configuration rather than the State tool itself.

See [Localization and formatting](../localization/overview.md).

## :material-horseshoe: Color from the entity

A state can change color according to its value:

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

Color stops are applied to the state text.

See [Color stops](../appearance/color-stops.md) for ranges, gradients, palettes, and interpolation.

## :material-horseshoe: Configuration

| Field            | Required | Default             | Description                                  |
| ---------------- | :------: | ------------------- | -------------------------------------------- |
| `entity_index`   |    Yes   |                     | Entity whose state is displayed              |
| `xpos`           |    Yes   |                     | Horizontal position                          |
| `ypos`           |    Yes   |                     | Vertical position                            |
| `show.uom`       |    No    | `end`               | Places the unit at `end`, `top`, or `bottom` |
| `uom`            |    No    |                     | Unit positioning and styling                 |
| `max_characters` |    No    |                     | Maximum displayed state length               |
| `ellipsis`       |    No    |                     | Legacy alias for limiting state length       |
| `format`         |    No    | Home Assistant      | Overrides state formatting                   |
| `styles`         |    No    | Default state style | SVG and CSS styling                          |
| `color_stops`    |    No    | Not set             | Colors the state from the entity value       |

### Shared tool options

States can also use shared card-tool features such as:

* `id`
* `group`
* `same_as`
* actions
* color stops
* animations

These are documented in their respective guides rather than repeated here.

## :material-horseshoe: Related

* [Name](name.md)
* [Area](area.md)
* [Icon](icon.md)
* [Entities](../card-basics/entities.md)
* [Localization and formatting](../localization/overview.md)
* [Positioning and sizing](../card-basics/positioning-and-sizing.md)
* [Styling](../appearance/styling.md)
* [Color stops](../appearance/color-stops.md)
* [Actions](../interaction/actions.md)
* [Animations](../interaction/animations.md)
