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

The Name tool displays the name connected to an entity. By default it shows the Home Assistant entity name. You can also give the entity a fixed name or build a name from its entity, device, area, floor, and fixed text.

This page shows how to choose the displayed name in `entities:`, place it with `layout.names`, style it, shorten long names, and optionally color it from the entity value.

## :material-horseshoe: Show the entity name

Add the entity under `entities:` and refer to it from `layout.names` with `entity_index`:

```yaml linenums="1"
entities:  # Entities used by this example
  - entity: sensor.living_room_temperature

layout:
  names:
    - entity_index: 0
      xpos: 50
      ypos: 50
```

With no `name:` override, Home Assistant supplies the displayed entity name.

## :material-horseshoe: Use a fixed name

Set `name` on the entity when this card should use fixed text instead of the Home Assistant name:

```yaml linenums="1"
entities:  # Entities used by this example
  - entity: sensor.living_room_temperature
    name: Room temperature

layout:
  names:
    - entity_index: 0
      xpos: 50
      ypos: 50
```

## :material-horseshoe: Build a name from several parts

Home Assistant lets you assemble the displayed entities name from several parts, in the order you list them:

| Type | What is shown |
| --- | --- |
| `entity` | The entity name, for example `Temperature`. |
| `device` | The device name, for example `Awair Element`. |
| `area` | The area name, for example `Living room`. |
| `floor` | The floor name, for example `Ground floor`. |
| `text` | The fixed text from the `text` field. |

Put these parts under `entities[].name`.

```yaml linenums="1"
entities:  # Entities used by this example
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

This can display `Living room - Temperature`. Home Assistant supplies the current entity, device, area, and floor names. A `text` part remains exactly as configured.

## :material-horseshoe: Position and align the name

Position the name with `xpos` and `ypos`. Use `text-anchor` to control horizontal alignment: `start` starts the text at `xpos`, `middle` centers it on `xpos`, and `end` ends it at `xpos`.

```yaml linenums="1"
entities:  # Entities used by this example
  - entity: sensor.living_room_temperature

layout:
  names:
    - entity_index: 0
      xpos: 20
      ypos: 50
      styles:
        text-anchor: start
```

## :material-horseshoe: Shorten a long name

Use `ellipsis` to limit the displayed name length:

```yaml linenums="1"
entities:  # Entities used by this example
  - entity: sensor.living_room_temperature

layout:
  names:
    - entity_index: 0
      xpos: 50
      ypos: 50
      ellipsis: 18
```

Names longer than the configured length are shortened with an ellipsis. `max_characters` is an alternative field with the same effect. If both `max_characters` and `ellipsis` are set, `max_characters` is used.

## :material-horseshoe: Change color with the entity

Add `color_stops` when the displayed name should change color with the selected entity value or state. See [Color stops](../../appearance/color-stops.md).

## :material-horseshoe: Configuration options

`Required` applies to this `layout.names` item. `Not set` means the card adds no explicit value when the option is omitted.

| Field | Type | Required | Default | Description |
| --- | --- | :---: | --- | --- |
| `entity_index` | entity index | No | `0` | Chooses which configured entity name is displayed; when omitted, the first configured entity is used. |
| `xpos`, `ypos` | number | No | `0` | Position of the name; omitted coordinates place it at the top-left reference position. |
| `max_characters` | number | No | Not set | Maximum displayed character count. If both truncation fields are set, this value takes precedence. |
| `ellipsis` | number | No | Not set | Alternative character limit for shortening a long displayed name with `...`. |
| `styles` | mapping | No | Default name style | Sets text size, weight, alignment, color, opacity, and other text appearance. |
| `color_stops` | mapping | No | Not set | Changes the text color from the selected entity value or state. |

## :material-horseshoe: Related

- [Entities](../../card-basics/entities.md)
- [State](entity-state-tool.md)
- [Area](entity-area-tool.md)
- [Text](../shapes/text-tool.md)
