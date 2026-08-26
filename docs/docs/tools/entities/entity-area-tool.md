---
template: main.html
title: Area
description: Display the Home Assistant area of an entity in a Flexible Horseshoe Card.
tags:
  - Area
  - Entity
  - Card tools
---

# Area

Use an area to show the Home Assistant area assigned to an entity, such as `Living room`, `Kitchen`, or `Bedroom`.

The displayed area follows the entity selected with `entity_index`.

<!-- Area examples image -->

## :material-horseshoe: Basic use

Add areas under `layout.areas`:

```yaml linenums="1"
entities:
  - entity: sensor.living_room_temperature

layout:
  areas:
    - id: room
      entity_index: 0
      xpos: 50
      ypos: 50
```

`entity_index` selects the entity whose area is displayed.

`xpos` and `ypos` position the area text on the card.

## :material-horseshoe: Where the area comes from

FHS uses the Home Assistant area assigned to the entity.

If the entity itself has no area, the area assigned to its device is used.

You can override the displayed area in the entity configuration:

=== "Home Assistant area"

    ```yaml linenums="1"
    entities:
      - entity: sensor.living_room_temperature

    layout:
      areas:
        - entity_index: 0
          xpos: 50
          ypos: 50
    ```

=== "Custom area"

    ```yaml linenums="1"
    entities:
      - entity: sensor.living_room_temperature
        area: Downstairs

    layout:
      areas:
        - entity_index: 0
          xpos: 50
          ypos: 50
    ```

    The custom `area` value takes priority over the Home Assistant area.

## :material-horseshoe: Size and position

Position the area with `xpos` and `ypos`:

```yaml linenums="1"
layout:
  areas:
    - entity_index: 0
      xpos: 10
      ypos: 90
      styles:
        text-anchor: start
        font-size: 1em
```

Use `text-anchor` to align the text around its position:

* `start` — text starts at `xpos`
* `middle` — text is centered on `xpos`
* `end` — text ends at `xpos`

See [Positioning and sizing](../../card-basics/positioning-and-sizing.md) for the card coordinate system.

## :material-horseshoe: Text appearance

Use `styles` to change the appearance of the area:

```yaml linenums="1"
layout:
  areas:
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

See [Styling](../../appearance/styling.md) for the complete styling guide.

## :material-horseshoe: Shorten long area names

Use `ellipsis` to limit the displayed length:

```yaml linenums="1"
layout:
  areas:
    - entity_index: 0
      xpos: 50
      ypos: 50
      ellipsis: 20
```

Longer area names are shortened with an ellipsis.

## :material-horseshoe: Color from the entity

An area can change color with the state of its entity:

```yaml linenums="1"
layout:
  areas:
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

Area color stops are applied to the text.

See [Color stops](../../appearance/color-stops.md) for ranges, gradients, palettes, and interpolation.

## Configuration

| Field          | Required | Description                           |
| -------------- | :------: | ------------------------------------- |
| `entity_index` |    Yes   | Entity whose area is displayed        |
| `xpos`         |    Yes   | Horizontal position on the card       |
| `ypos`         |    Yes   | Vertical position on the card         |
| `ellipsis`     |    No    | Maximum displayed text length         |
| `styles`       |    No    | Text styling                          |
| `color_stops`  |    No    | Colors the text from the entity state |

## :material-horseshoe: Related

* [Name](entity-name-tool.md)
* [State](entity-state-tool.md)
* [Text](../shapes/text-tool.md)
* [Entities](../../card-basics/entities.md)
* [Positioning and sizing](../../card-basics/positioning-and-sizing.md)
* [Styling](../../appearance/styling.md)
* [Color stops](../../appearance/color-stops.md)
* [Actions](../../interaction/actions.md)
* [Animations](../../interaction/animations.md)
