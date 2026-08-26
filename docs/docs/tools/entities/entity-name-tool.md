---
template: main.html
title: Name
description: Display the Home Assistant name of an entity in a Flexible Horseshoe Card.
tags:
  - Name
  - Entity
  - Card tools
---

# Name

Use a name to show the name of a Home Assistant entity anywhere on the card.

By default, FHS uses the entity name from Home Assistant. You can provide your own name in the entity configuration.

<!-- Name examples image -->

## :material-horseshoe: Basic use

Add names under `layout.names`:

```yaml linenums="1"
entities:
  - entity: sensor.living_room_temperature

layout:
  names:
    - id: temperature-name
      entity_index: 0
      xpos: 50
      ypos: 50
```

`entity_index` selects the entity whose name is displayed.

`xpos` and `ypos` position the name on the card.

## :material-horseshoe: Use a custom name

Set `name` on the entity when the card should display another name:

=== "Home Assistant name"

    ```yaml linenums="1"
    entities:
      - entity: sensor.living_room_temperature

    layout:
      names:
        - entity_index: 0
          xpos: 50
          ypos: 50
    ```

=== "Custom name"

    ```yaml linenums="1"
    entities:
      - entity: sensor.living_room_temperature
        name: Living room

    layout:
      names:
        - entity_index: 0
          xpos: 50
          ypos: 50
    ```

    The configured `name` takes priority over the name supplied by Home Assistant.

## :material-horseshoe: Position and alignment

Position the name with `xpos` and `ypos`:

```yaml linenums="1"
layout:
  names:
    - entity_index: 0
      xpos: 10
      ypos: 90
      styles:
        text-anchor: start
```

Use `text-anchor` to control horizontal alignment:

* `start` — text starts at `xpos`
* `middle` — text is centered on `xpos`
* `end` — text ends at `xpos`

See [Positioning and sizing](../card-basics/positioning-and-sizing.md) for the card coordinate system.

## :material-horseshoe: Text appearance

Use `styles` to change the appearance of the name:

```yaml linenums="1"
layout:
  names:
    - entity_index: 0
      xpos: 50
      ypos: 50
      styles:
        font-size: 1.4em
        font-weight: bold
        text-transform: none
        fill: var(--secondary-text-color)
        opacity: 0.8
```

Common styles include:

| Property         | Use                  |
| ---------------- | -------------------- |
| `font-size`      | Text size            |
| `font-weight`    | Text weight          |
| `text-anchor`    | Horizontal alignment |
| `text-transform` | Text capitalization  |
| `fill`           | Text color           |
| `opacity`        | Text opacity         |

See [Styling](../appearance/styling.md) for the complete styling guide.

## :material-horseshoe: Shorten long names

Use `ellipsis` to limit the displayed name length:

```yaml linenums="1"
layout:
  names:
    - entity_index: 0
      xpos: 50
      ypos: 50
      ellipsis: 20
```

Names longer than the configured length are shortened with an ellipsis.

## :material-horseshoe: Color from the entity

A name can change color based on the state of its entity:

```yaml linenums="1"
layout:
  names:
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

Color stops are applied to the text.

See [Color stops](../appearance/color-stops.md) for ranges, gradients, palettes, and interpolation.

## :material-horseshoe: Configuration

| Field          | Required | Description                           |
| -------------- | :------: | ------------------------------------- |
| `entity_index` |    Yes   | Entity whose name is displayed        |
| `xpos`         |    Yes   | Horizontal position on the card       |
| `ypos`         |    Yes   | Vertical position on the card         |
| `ellipsis`     |    No    | Maximum displayed name length         |
| `styles`       |    No    | Text styling                          |
| `color_stops`  |    No    | Colors the name from the entity state |

### Shared tool options

Names can also use shared card-tool features such as:

* `id`
* `group`
* `same_as`
* actions
* color stops
* animations

These are documented in their respective guides rather than repeated here.

## :material-horseshoe: Related

* [Area](area.md)
* [State](state.md)
* [Text](text.md)
* [Entities](../card-basics/entities.md)
* [Positioning and sizing](../card-basics/positioning-and-sizing.md)
* [Styling](../appearance/styling.md)
* [Color stops](../appearance/color-stops.md)
* [Actions](../interaction/actions.md)
* [Animations](../interaction/animations.md)
