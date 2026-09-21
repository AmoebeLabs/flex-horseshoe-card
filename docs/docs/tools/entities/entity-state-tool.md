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

The State tool displays the current state or numeric value of an entity. It can also show the unit and use the entity's formatting settings so the value matches Home Assistant or the overrides defined for this card.

This page shows how to add a State item, place the unit, format the value, keep long states readable, and optionally color the displayed value from the entity.

## :material-horseshoe: Show a state

Use the State tool when the current entity value is one of the visible pieces of information on the card.

```yaml linenums="1"
entities:
  - entity: sensor.living_room_temperature  # Home Assistant entity used by this card

layout:
  states:
    - entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
```

The unit and number formatting follow Home Assistant unless you override them on the entity.

## :material-horseshoe: Move the unit

Use `show.uom` when the unit should appear above, below, or at the end of the value:

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  states:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      show:
        uom: bottom
```
Style the unit separately with `uom.styles` when needed.

## :material-horseshoe: Keep a long value readable

Use `ellipsis` when a long state should be shortened instead of running into other parts of the card. `max_characters` is an alternative field with the same effect; when both are set, `max_characters` wins:

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  states:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      ellipsis: 14
```
## :material-horseshoe: Change number formatting

Put `format` on the entity when every State item using that entity should use the same formatting. Put an object-form `format` on a State item when only that displayed State should be formatted differently; the State item then takes precedence.

```yaml linenums="1"
entities:
  - entity: sensor.energy_total  # Home Assistant entity used by this card
    format:
      separator: true  # Show digit grouping
      decimals_min: 0  # Minimum number of decimals to display
      decimals_max: 1  # Maximum number of decimals to display

layout:
  states:
    - entity_index: 0
      xpos: 50
      ypos: 50
      format:
        locale: nl-NL  # Format this State item using this locale
```

Object-form `format` accepts these settings:

| Setting | Type | Default | Visible effect |
| --- | --- | --- | --- |
| `decimals_min` | integer | Home Assistant/entity precision | Sets the minimum number of decimal places. If it is greater than `decimals_max`, the maximum is used for both. |
| `decimals_max` | integer | Home Assistant/entity precision | Sets the maximum number of decimal places. |
| `locale` | string | Home Assistant locale | Formats numeric separators and grouping using the specified locale, for example `nl-NL`. |
| `separator` | boolean | Home Assistant number formatting | `true` keeps digit grouping; `false` removes grouping separators. |
| `raw_state_keep` | boolean | `false` | `true` shows the raw entity or attribute value instead of the normal Home Assistant formatted/localized value. |
| `raw_state_clean` | boolean | `false` | With `raw_state_keep: true`, `true` replaces underscores in a text value with spaces. |

See [Entities](../../card-basics/entities.md) and [Localization and formatting](../../localization/overview.md).


## :material-horseshoe: Format dates, times, brightness, and durations

Set `format` on the State item when the displayed state needs one of the fixed formatters below. Date and time formats follow the Home Assistant locale where applicable.

```yaml linenums="1"
entities:  # Entities used by this example
  - entity: sensor.example_timestamp

layout:
  states:
    - entity_index: 0
      xpos: 50
      ypos: 50
      format: datetime-short
```

| Format | Displayed result |
| --- | --- |
| `relative` | Relative time, such as a localized “2 hours ago”. |
| `total` | Currently displays `Not Yet Supported`; do not use it for a normal formatted value. |
| `datetime` | Full localized date and time. |
| `datetime-short` | Short localized date and time. |
| `datetime-short_with-year` | Short localized date and time including the year. |
| `datetime_seconds` | Localized date and time including seconds. |
| `datetime-numeric` | Numeric localized date and time. |
| `date` | Full localized date. |
| `date_month` | Month. |
| `date_month_year` | Month and year. |
| `date-short` | Short date using an abbreviated month and day. |
| `date-numeric` | Numeric localized date. |
| `date_weekday` | Weekday. |
| `date_weekday_day` | Weekday, month, and day. |
| `date_weekday-short` | Abbreviated weekday. |
| `time` | Localized time. |
| `time-24h` | 24-hour time. |
| `time-24h_date-short` | 24-hour time for recent values; otherwise a short date. |
| `time_weekday` | Localized weekday/time form. |
| `time_seconds` | Localized time including seconds. |
| `brightness` | Converts a 0–255 brightness value to a percentage. |
| `brightness_pct` | Converts a 0–255 brightness value to a percentage. |
| `duration` | Formats a duration supplied in seconds. |

The object-form settings described above remain available when a fixed string formatter is not what you need.

## :material-horseshoe: Change color with the value

Use value-based coloring when the state should immediately communicate severity or range as well as its number.

```yaml linenums="1"
entities:
  - entity: sensor.cpu_usage  # Home Assistant entity used by this card

layout:
  states:
    - entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card

      color_stops:
        colors:
          0: green
          60: orange
          90: red

      show:
        item_style: colorstopinterpolated  # Use the colorstopinterpolated appearance/color mode

      colorstopinterpolated:
        fill: true  # Apply the selected color to the fill
        stroke: false  # Do not apply the calculated color to the stroke
```

See [Color stops](../../appearance/color-stops.md) for all color modes.

## :material-horseshoe: Configuration options


`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `entity_index` | entity index | No | `0` | Chooses which entity this State uses; when omitted, the first configured entity is used. |
| `xpos`, `ypos` | number | No | `0` | Position of the state; omitted coordinates place it at the top-left reference position. |
| `show.uom` | `none`, `end`, `top`, `bottom` | No | `end` | `none` hides the unit; `end` puts it after the value; `top` places it above; `bottom` places it below. |
| `uom.styles` | mapping | No | Default unit style | Styles the unit separately. |
| `format` | string / mapping | No | Not set | Uses one of the fixed format values listed above, or object-form number/raw-state formatting options. |
| `max_characters` | number | No | Not set | Maximum displayed character count. If both truncation fields are set, this value takes precedence. |
| `ellipsis` | number | No | Not set | Alternative character limit that shortens long states with `...`. |
| `styles` | mapping | No | Default state style | Text appearance. |
| `color_stops` | mapping | No | Not set | Colors the state from an entity value/state. |

## :material-horseshoe: Related

- [Entities](../../card-basics/entities.md)
- [Name](entity-name-tool.md)
- [Icon](entity-icon-tool.md)
- [Color stops](../../appearance/color-stops.md)
- [Localization and formatting](../../localization/overview.md)
