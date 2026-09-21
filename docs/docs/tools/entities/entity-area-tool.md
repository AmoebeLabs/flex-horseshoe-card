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

The Area tool displays the Home Assistant area associated with an entity. It is useful when the card should identify where a device or sensor belongs without repeating that text manually.

This page shows how to add an Area item, choose its position and text appearance, keep long area names readable, and optionally color the text from the entity value.

## :material-horseshoe: Show the area

Use the Area tool when the card should display the Home Assistant area associated with an entity.

```yaml linenums="1"
entities:
  - entity: sensor.living_room_temperature  # Home Assistant entity used by this card

layout:
  areas:
    - entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
```

The card uses the entity's Home Assistant area unless you override it for this card.

## :material-horseshoe: Use another area name

Override the area text when the automatic Home Assistant area name is not the wording you want on this card.

```yaml linenums="1"
entities:
  - entity: sensor.living_room_temperature  # Home Assistant entity used by this card
    area: Downstairs  # Area name shown for this entity
```

## :material-horseshoe: Position and style the area

Position and style the Area text so it fits the visual hierarchy of the card.

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  areas:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 20  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      styles:
        text-anchor: start  # Horizontal alignment of the text
        font-size: 1em  # Size of the displayed text
```
## :material-horseshoe: Shorten a long area name

Use ellipsis when a long area name would collide with nearby content or exceed the space available.

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  areas:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      ellipsis: 16
```

`max_characters` is an alternative field with the same effect. If both fields are set, `max_characters` is used.
## :material-horseshoe: Change color with the entity

Use `color_stops` when the area text should change color with the selected entity. See [Color stops](../../appearance/color-stops.md).

## :material-horseshoe: Configuration options


`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `entity_index` | entity index | No | `0` | Chooses the entity whose area is shown; when omitted, the first configured entity is used. |
| `xpos`, `ypos` | number | No | `0` | Position of the area text; omitted coordinates place it at the top-left reference position. |
| `max_characters` | number | No | Not set | Maximum displayed character count. If both truncation fields are set, this value takes precedence. |
| `ellipsis` | number | No | Not set | Alternative character limit that shortens a long area name with `...`. |
| `styles` | mapping | No | Default area text style | Text appearance and alignment. |
| `color_stops` | mapping | No | Not set | Changes color from entity value/state. |

## :material-horseshoe: Related

- [Entities](../../card-basics/entities.md)
- [Name](entity-name-tool.md)
- [State](entity-state-tool.md)
