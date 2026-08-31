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

A name shows the name of a Home Assistant entity anywhere on the card. Use it for a clear label beside a value, icon, graph, or control.

By default, Flexible Horseshoe Card uses the default (short) entity name from Home Assistant. When the entity configuration selects an attribute, it uses the translated attribute name instead. You can provide your own name in the entity configuration.

<!-- Name examples image -->

## :material-horseshoe: Basic configuration

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

## :material-horseshoe: Configuration options

| Field          | Required | Description                           |
| -------------- | :------: | ------------------------------------- |
| `entity_index` |    Yes   | Entity whose name is displayed        |
| `xpos`         |    Yes   | Horizontal position on the card       |
| `ypos`         |    Yes   | Vertical position on the card         |
| `ellipsis`     |    No    | Maximum displayed name length         |
| `styles`       |    No    | Text styling                          |
| `color_stops`  |    No    | Colors the name from the entity state |

## :material-horseshoe: Use a custom name

Set `name` on the entity when the card should display another name:

=== "Home Assistant name"
    Home Assistant returns the entity name as the name by default
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

## :material-horseshoe: Choose what the name shows

!!! info ":octicons-tag-24: Available for custom cards since Home Assistant 2026.4!"
    The Flexible Horseshoe Card therefore requires this version as the minimal version.

A short name is useful when a card shows one entity. When several rooms or devices show the same measurement, add more context so each label remains recognizable.

Put the following name parts in the order they should appear:

| Type | default | What the user sees |
| --- | --- |--- |
| `entity` | Yes | Short entity name, such as `Temperature` |
| `device` | No | Device name, such as `Awair Element` |
| `area` | No | Area name, such as `Living room` |
| `floor` | No | Floor name, such as `Ground floor` |
| `text` | No | Text supplied in the card configuration |

This example distinguishes equal measurements from different rooms:

```yaml linenums="1"
entities:
  - entity: sensor.living_room_temperature
    name:
      - type: area
      - type: text
        text: "-"
      - type: entity

layout:
  names:
    - entity_index: 0
      xpos: 50
      ypos: 50
```

The resulting label can be `Living room - Temperature`. Home Assistant supplies the current area, floor, device, and entity names, so those parts follow changes made in Home Assistant. Literal `text` remains exactly as configured.

A plain string is still the simplest choice when the complete label should be fixed:

```yaml linenums="1"
entities:
  - entity: sensor.living_room_temperature
    name: Indoor temperature
```

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

See [Positioning and sizing](../../card-basics/positioning-and-sizing.md) for the card coordinate system.

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

See [Styling](../../appearance/styling.md) for the complete styling guide.

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

See [Color stops](../../appearance/color-stops.md) for ranges, gradients, palettes, and interpolation.

## :material-horseshoe: Related

* [Area](entity-area-tool.md)
* [State](entity-state-tool.md)
* [Text](../shapes/text-tool.md)
* [Entities](../../card-basics/entities.md)
* [Positioning and sizing](../../card-basics/positioning-and-sizing.md)
* [Styling](../../appearance/styling.md)
* [Color stops](../../appearance/color-stops.md)
* [Actions](../../interaction/actions.md)
* [Animations](../../interaction/animations.md)
