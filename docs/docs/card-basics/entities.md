---
template: main.html
title: Entity Definitions
description: Configure Home Assistant entities, attributes, names, icons, units, precision, actions, formatting, and dynamic values throughout the card.
tags:
  - Entities
  - Attributes
  - Icons
  - Actions
  - Templates
---
# Entity definitions

The `entities:` section tells the card which Home Assistant data a card can use. An entry can be a normal entity, an attribute, or a local input. The same entry can also define how that data should be shown in this card.

This page shows how to add entities, refer to them with `entity_index`, select attributes, and override names, units, icons, and formatting. It also explains the optional `slot` setting.

## :material-horseshoe: Add an entity

Add an entity when the card needs a Home Assistant state, attribute, name, icon, or other entity information.

```yaml linenums="1"
entities:
  - entity: sensor.memory_use_percent  # Home Assistant entity used by this card
```

The card uses Home Assistant information such as the entity name, icon, area, unit, precision, and localized state where possible.

## :material-horseshoe: Add several entities

Add multiple entities when different parts of the same card need data from different Home Assistant entities.

```yaml linenums="1"
entities:
  - entity: sensor.living_room_temperature  # First entity: entity_index 0
  - entity: sensor.living_room_humidity     # Second entity: entity_index 1
```

Use `entity_index` when a layout item needs one of those entities. The index follows the order in `entities:`: the first entity is `0`, the second is `1`, and so on.

```yaml linenums="1"
entities:
  - entity: sensor.living_room_temperature  # entity_index 0
  - entity: sensor.living_room_humidity     # entity_index 1

layout:
  states:
    - entity_index: 0  # Use the first entity: living-room temperature
      xpos: 35         # Horizontal position; 50 = center of the card
      ypos: 50         # Vertical position; 50 = center of the card

    - entity_index: 1  # Use the second entity: living-room humidity
      xpos: 65
      ypos: 50
```

## :material-horseshoe: Use an optional entity slot

Normally, use numeric `entity_index` values such as `0`, `1`, and `2` to select entities.

`slot` is an optional setting that gives a group of entities a name. You can then use that name with an index, such as `room[0]` or `room[1]`, instead of keeping track of the entity's position in the complete `entities:` list.

For example, I use slots on larger cards when I otherwise lose track of which numeric index belongs to which entity. You may use them for any other reason that makes your own configuration easier to read.

The number between brackets is the position **inside that slot**, starting at zero. `room[0]` is the first entity in the `room` slot, `room[1]` is the second, and `room[2]` is the third.

```yaml linenums="1"
entities:
  - entity: sensor.living_room_temperature
    slot: room  # Start the room slot; this entity is room[0]

  - entity: sensor.living_room_humidity
                # No new slot: this entity is room[1]

  - entity: sensor.living_room_co2
                # Still in room: this entity is room[2]

  - entity: sensor.outdoor_temperature
    slot: outdoor  # Start another slot; this entity is outdoor[0]

layout:
  states:
    - entity_index: room[0]  # Living-room temperature
      xpos: 30
      ypos: 50

    - entity_index: room[1]  # Living-room humidity
      xpos: 50
      ypos: 50

    - entity_index: outdoor[0]  # Outdoor temperature
      xpos: 70
      ypos: 50
```

A `slot:` starts a named group. The following entities stay in that group until another `slot:` starts a new one.

### Use slots in a card template

If a card that uses slots is turned into a template, keep those slot names with the template. The template continues to use addresses such as `room[0]` and `room[1]`, so every use of that template must supply the expected entities through those same slot names and in the expected order.

For example, this template uses `room[0]` for temperature and `room[1]` for humidity:

```yaml linenums="1"
fhs_user_templates:
  templates:
    room_summary:
      template:
        type: card

      card:
        default_entities:
          - entity: "[[temperature_entity]]"
            slot: room  # room[0]: temperature

          - entity: "[[humidity_entity]]"
                       # room[1]: humidity

        layout:
          states:
            - entity_index: room[0]  # Use the temperature entity
              xpos: 40
              ypos: 50

            - entity_index: room[1]  # Use the humidity entity
              xpos: 60
              ypos: 50
```

Because the template itself refers to `room[0]` and `room[1]`, those positions keep the same meaning every time the template is used.


## :material-horseshoe: Use an attribute

Use `attribute` when the value you want is an attribute instead of the main state:

```yaml linenums="1"
entities:
  - entity: weather.home  # Home Assistant entity used by this card
    attribute: temperature  # Use this attribute instead of the main weather state
```

Several attributes from the same Home Assistant entity can be added as separate entries.

## :material-horseshoe: Change how an entity is shown

Override Home Assistant defaults only when this card needs another presentation:

```yaml linenums="1"
entities:
  - entity: sensor.memory_use_percent  # Home Assistant entity used by this card
    name: Memory  # Name shown to the user
    icon: mdi:memory  # Icon shown to the user
    decimals: 0  # Number of decimals to display
    unit: "%"  # Unit shown with the value
```

You can change the name, icon, area, unit, or precision without changing the original Home Assistant entity.

## :material-horseshoe: Change number and state formatting

Use `format` when the normal Home Assistant formatting is not what this card needs:

```yaml linenums="1"
entities:
  - entity: sensor.energy_total  # Home Assistant entity used by this card
    format:
      separator: true  # Show number grouping separators
      decimals_min: 0  # Minimum number of decimals to display
      decimals_max: 2  # Maximum number of decimals to display
```

For raw textual states:

```yaml linenums="1"
entities:
  - entity: sensor.mode  # Home Assistant entity used by this card
    format:
      raw_state_keep: true  # Show the raw Home Assistant state
      raw_state_clean: true  # Replace underscores in the raw state with spaces
```

See [Localization and formatting](../localization/overview.md) for locale-aware names, units, numbers, and states.

## :material-horseshoe: Convert a value before it is displayed

Use `convert` when the source value itself must be changed before the normal display formatting is applied.

| Value | Result |
| --- | --- |
| `brightness_pct` | Converts a 0–255 brightness value to a percentage. |
| `multiply(n)` | Multiplies the value by `n`; for example `multiply(100)`. |
| `divide(n)` | Divides the value by `n`; for example `divide(1000)`. |
| `rgb_csv` | Converts a supported light color attribute to `r,g,b` text. |
| `rgb_hex` | Converts a supported light color attribute to hexadecimal color text. |

```yaml linenums="1"
entities:
  - entity: sensor.power_kw  # Source entity
    convert: multiply(1000)  # Convert kW to W before display formatting
    unit: W                  # Show the converted unit in this card
```

The `rgb_csv` and `rgb_hex` converters are for light color attributes and use the light's current Home Assistant color information.

## :material-horseshoe: Put shared actions on an entity

You can set `tap_action`, `hold_action`, or `double_tap_action` on an entity entry. A layout item using that entity uses its own action when one is configured; otherwise it can use the corresponding entity action. If neither the item nor the entity defines a tap action, a normal Home Assistant entity opens `more-info` on tap.

```yaml linenums="1"
entities:
  - entity: light.living_room  # Entity used by layout items
    tap_action:
      action: toggle           # Used by bound items that do not define their own tap_action

layout:
  icons:
    - entity_index: 0          # This Icon inherits the entity tap action
      xpos: 50
      ypos: 50
```

See [Actions](../interaction/actions.md) for all generic action values.

## :material-horseshoe: Add shared state mapping or colors

`state_map` stores state-dependent values such as numeric mappings, labels, ranks, or icons for features that use mapped states. `color_stops` stores value/state-to-color rules at the entity level so bound tools can use the same color definition. The feature page that consumes the mapping explains which map fields it needs.

## :material-horseshoe: Local input entity fields

Local input entities use the same root `entities:` list but are created by the card rather than by Home Assistant. They must use one of these domains: `fhs_input_number.*`, `fhs_input_boolean.*`, or `fhs_input_select.*`. They are not added to Home Assistant's state machine.

`scope` and `persist` work the same for all three types: `scope: card` keeps a separate value in one card, `scope: global` shares the value with other cards in the same Home Assistant client, and `persist: true` can restore only a global value on that client/device. The `local` flag is set automatically and normally should not be entered yourself.

| Local input type | Type-specific fields |
| --- | --- |
| `fhs_input_number.*` | `initial` is required and numeric. `min`/`max` are optional bounds, `step` defaults to `1`, `unit` defaults to empty, and `decimals` defaults to `0`. |
| `fhs_input_boolean.*` | `initial` is optional and defaults to `false` / `off`. |
| `fhs_input_select.*` | `options` is required and must contain unique non-empty text values. `initial` defaults to the first option and must be one of the configured options. |

See [Local input entities](../tools/controls/browser-local-inputs.md) and the Number, Boolean, and Select input pages for complete examples.

## :material-horseshoe: Configuration options


`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `entity` | string | Yes | — | Home Assistant entity ID or local input ID. |
| `slot` | string | No | `Not set` | Gives this entity and the following entities a group name so items can use addresses such as `room[0]`. |
| `attribute` | string | No | Entity state | Uses an attribute instead of the main state. |
| `unit` | string | No | Home Assistant unit | Overrides the unit for this card. |
| `decimals` | number | No | Home Assistant precision | Overrides the displayed numeric precision. |
| `name` | string/list | No | Home Assistant name | Overrides the automatic Home Assistant name. |
| `area` | string | No | Home Assistant area | Overrides the Home Assistant area for this card. |
| `icon` | string | No | Home Assistant icon | Overrides the Home Assistant icon. |
| `convert` | string | No | Not set | Converts the source value before display formatting. Accepted converters are listed above. |
| `format` | object/string | No | Home Assistant/card formatting | Overrides normal state formatting. |
| `state_map` | mapping | No | Not set | Supplies state-dependent values, labels, ranks, icons, or numeric mappings to features that use mapped states. |
| `color_stops` | mapping | No | Not set | Supplies entity-level value/state colors to bound tools. |
| `disabled` | boolean / dynamic value | No | `false` | Disables this entity entry when true. |
| `tap_action` | action | No | `more-info` for a normal Home Assistant entity | Tap action used by layout items that select this entity and do not define their own tap action. |
| `hold_action` | action | No | Not set | Hold action used by layout items that select this entity and do not define their own hold action. |
| `double_tap_action` | action | No | Not set | Double-tap action used by layout items that select this entity and do not define their own double-tap action. |
| `template` | template reference | No | Not set | Merges a configured template into this entity entry before local values override it. |

### Format options

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `separator` | boolean | No | Home Assistant number formatting | Enables or disables digit grouping for numeric values. |
| `decimals_min` | integer | No | Home Assistant precision | Minimum number of decimal places shown. |
| `decimals_max` | integer | No | Home Assistant precision | Maximum number of decimal places shown. |
| `raw_state_keep` | boolean | No | `false` | Shows the raw entity state instead of normal Home Assistant formatting/localization. |
| `raw_state_clean` | boolean | No | `false` | Replaces underscores with spaces when `raw_state_keep` is enabled. |
| `locale` | string | No | Home Assistant locale | Uses a specific locale for this entity, for example `nl-NL`. |

## :material-horseshoe: Related

- [State](../tools/entities/entity-state-tool.md)
- [Name](../tools/entities/entity-name-tool.md)
- [Area](../tools/entities/entity-area-tool.md)
- [Icon](../tools/entities/entity-icon-tool.md)
- [Local input entities](../tools/controls/browser-local-inputs.md)
- [Localization and formatting](../localization/overview.md)
- [JavaScript templates](../dynamic/javascript-templates.md)

[github-releases]: https://github.com/amoebelabs/flex-horseshoe-card/releases/
