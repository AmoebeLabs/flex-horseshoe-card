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

Entities are configured in the `entities` section of the Flexible Horseshoe Card.

In most cases, the only required field is the Home Assistant entity ID. The card can then use metadata already available in Home Assistant, including the entity name, area, icon, unit, precision, state formatting, and localization.

A minimal entity definition can therefore remain very small:

```yaml linenums="1"
entities:
  - entity: sensor.memory_use_percent
```

Where available, the card uses Home Assistant metadata automatically. Names, areas, states, numbers, and units follow the language and locale configured in Home Assistant.

You can override these defaults when needed. For example, you can provide a custom name or icon, change the number of decimals, display an attribute instead of the main state, or use a JavaScript template to calculate a dynamic value.

## :material-horseshoe: Basic usage

A basic definition points to a single entity:

```yaml linenums="1"
entities:
  - entity: sensor.memory_use_percent
```

You can also define multiple entities. Layout sections such as `states`, `names`, `areas`, and `icons` refer to them by `entity_index`.

```yaml title="Entities" linenums="1"
- type: custom:flex-horseshoe-card
  entities:
    - entity: sensor.dsmr_reading_electricity_currently_delivered
    - entity: sensor.dsmr_reading_phase_currently_delivered_l1
    - entity: sensor.dsmr_reading_phase_currently_delivered_l2
    - entity: sensor.dsmr_reading_phase_currently_delivered_l3
    - entity: sensor.dsmr_reading_electricity_currently_delivered
```

The first entry has index `0`, the second has index `1`, and so on.

## :material-horseshoe: Sparkline values as entities

A sparkline can make its statistics and active history settings available as regular card entities. Add only the values you want to use to `entities`, then refer to them by `entity:` or by their normal `entity_index` from states, names, icons, texts, or other layout items.

The entity ID starts with `fhs_sparkline`, followed by the sparkline `id` and the requested value:

```yaml title="Sparkline entities" linenums="1"
entities:
  - entity: sensor.temperature
  - entity: fhs_sparkline.temperature_history_min
  - entity: fhs_sparkline.temperature_history_avg
  - entity: fhs_sparkline.temperature_history_max
  - entity: fhs_sparkline.temperature_history_duration
  - entity: fhs_sparkline.temperature_history_bin_duration
  - entity: fhs_sparkline.temperature_history_aggregate_func

layout:
  sparklines:
    - id: temperature_history
      entity_index: 0
      # Remaining sparkline configuration

  states:
    - id: minimum
      entity: fhs_sparkline.temperature_history_min
      xpos: 20
      ypos: 85
    - id: average
      entity: fhs_sparkline.temperature_history_avg
      xpos: 50
      ypos: 85
    - id: maximum
      entity: fhs_sparkline.temperature_history_max
      xpos: 80
      ypos: 85
```

The available values are:

| Suffix | Value |
| :-- | :-- |
| `min` | Minimum value in the displayed period |
| `avg` | Average value in the displayed period |
| `max` | Maximum value in the displayed period |
| `min_time` | Time at which the minimum occurred |
| `max_time` | Time at which the maximum occurred |
| `duration` | Active history duration, shown in minutes, hours, or days |
| `bin_duration` | Actual duration of each bin, shown in minutes, hours, or days |
| `aggregate_func` | Function used for each bin, such as `avg`, `min`, `max`, or `median` |

A direct `entity:` reference is independent of list order. Card templates can place these entries in `default_entities` so every template instance receives the local values without changing the indices of entities supplied by the card.

Flexible Horseshoe Card automatically connects these values to the source entity used by the matching sparkline. Units, number formatting, and More info actions therefore continue to use that source sensor. You do not configure a separate source index.

Duration and bin size use Home Assistant duration formatting. For example, a bin duration of `0.5` hours is displayed as a localized duration with zero hours and thirty minutes. A setting that does not apply to the active graph type is shown using Home Assistant's translated **Unavailable** state.

## :material-horseshoe: Entity metadata from Home Assistant

The card uses Home Assistant metadata wherever possible. This keeps the YAML concise and helps the card remain consistent with the rest of your dashboard.

The following values can usually be obtained automatically:

| Value | Description |
| :---- | :---------- |
| Name | Friendly name assigned to the entity |
| Area | Home Assistant area assigned to the entity |
| State | Current entity state |
| Unit | Unit of measurement, such as `kWh`, `W`, `%`, or `°C` |
| Precision | Number formatting or precision defined for the entity |
| Icon | Entity icon, including state-based icons where supported |
| Icon color | State-based icon color when Home Assistant provides one |
| Localization | Translated names and states, plus locale-aware number formatting |

You usually do not need to repeat the name, unit, icon, or precision unless this card should display the entity differently.

## :material-horseshoe: Displaying an entity

You can override Home Assistant metadata directly in the entity definition:

```yaml title="Displaying an entity" linenums="1"
entities:
  - entity: sensor.memory_use_percent
    decimals: 0
    icon: mdi:memory
    name: '5: RAM Usage'
    area: Hestia
```

This example uses a custom name, icon, area, and precision instead of relying entirely on the Home Assistant defaults.

## :material-horseshoe: Displaying an attribute

An entity definition can display an attribute instead of the main state. This is useful for entities that expose several related values, such as weather entities.

```yaml title="Displaying an attribute" linenums="1"
entities:
  - entity: weather.dark_sky
    attribute: temperature
    units: '°C'
    icon: mdi:temperature
    decimals: 1
    name: 'Temperature'
```

You can also define multiple attributes from the same entity as separate entries:

```yaml title="Entities with attributes" linenums="1"
- type: custom:flex-horseshoe-card
  entities:
    - entity: weather.zoefdehaas
      attribute: temperature
    - entity: weather.zoefdehaas
      attribute: humidity
    - entity: weather.zoefdehaas
      attribute: pressure
    - entity: sun.sun
      attribute: elevation
    - entity: sun.sun
      attribute: azimuth
```

Each entry receives its own `entity_index`, even when several entries refer to the same Home Assistant entity.

## :material-horseshoe: Overriding entity values

The card can use Home Assistant defaults automatically, but you can override them in the `entities` section:

```yaml title="Entities with overrides" linenums="1"
- type: custom:flex-horseshoe-card
  entities:
    - entity: sensor.dsmr_reading_electricity_currently_delivered
      name: "Total"
      decimals: 2
      icon: mdi:fire
      area: house
```

Common reasons to override values include:

- using a shorter name on a compact card;
- displaying fewer or more decimals;
- choosing a card-specific icon;
- placing an entity under a different area label;
- giving an attribute its own name and unit.

## :material-horseshoe: Shared color stops

Define `color_stops` on an entity when several layout items should use the same thresholds and colors:

```yaml linenums="1"
entities:
  - entity: sensor.temperature
    color_stops:
      colors:
        0: blue
        18: green
        25: orange
        30: red
```

A layout item uses these colors after selecting `show.item_style: colorstop` or `show.item_style: colorstopgradient`. Entity-level color stops remain inactive for items that do not select either mode. A `color_stops` definition on the layout item overrides the entity definition for that item.

## :material-horseshoe: Overriding entity formatting

[:octicons-tag-24: v5.4.7-dev.7][github-releases]

The `format` option overrides the default Home Assistant formatting for an entity.

=== "Remove separator"

    ```yaml title="Remove separator and limit decimals" linenums="1" hl_lines="7-10"
    - type: custom:flex-horseshoe-card
      entities:
        - entity: sensor.dsmr_reading_electricity_currently_delivered
          name: "Total"
          icon: mdi:fire
          area: house
          format:
            separator: false    # Remove the thousands separator
            decimals_min: 0     # Minimum number of decimals
            decimals_max: 2     # Maximum number of decimals
    ```

=== "Display raw state"

    ```yaml title="Display raw entity state as received from integration" linenums="1" hl_lines="7-9"
    - type: custom:flex-horseshoe-card
      entities:
        - entity: sensor.dsmr_reading_electricity_currently_delivered
          name: "Total"
          icon: mdi:fire
          area: house
          format:
            raw_state_keep: true  # Keep the raw state without formatting
            raw_state_clean: true # Remove underscores from the raw state
    ```

=== "Use specific locale"

    ```yaml title="Specify locale for translations and formatting" linenums="1" hl_lines="7-10"
    - type: custom:flex-horseshoe-card
      entities:
        - entity: sensor.dsmr_reading_electricity_currently_delivered
          name: "Total"
          icon: mdi:fire
          area: house
          format:
            locale: 'nl-NL' # Force Dutch translations and formatting
    ```

## :material-horseshoe: Dynamic entity values

Some entity fields can use JavaScript templates. This allows parts of the entity definition to change in response to current entity states.

Use this when a name, icon, area, unit, or another supported value should be calculated dynamically instead of remaining fixed.

For example, the `name` can depend on the state of another entity:

```yaml title="Dynamic entity name" linenums="1"
- type: custom:flex-horseshoe-card
  entities:
    - entity: sensor.memory_use_percent
      name: |
        [[[
          const name = entities[1].state === 'on'
            ? '11: One Bulb ON'
            : '11: One Bulb OFF';
          return name;
        ]]]
      tap_action:
        action: more-info

    - entity: light.livingroom_light_duo_left_light
      name: 'hall'
      icon: mdi:lightbulb
      tap_action:
        action: perform-action
        perform_action: light.toggle
        target:
          entity_id: light.livingroom_light_duo_left_light
```

Here, the first entity changes its displayed name according to whether the second entity is `on`.

Supported icon fields can also use templates:

```yaml title="Dynamic entity icon" linenums="1"
entities:
  - entity: sensor.dsmr_reading_electricity_currently_delivered
    icon: |
      [[[
        const value = Number(state);
        return value >= 0.4
          ? 'mdi:flash'
          : 'mdi:flash-off';
      ]]]
```

Templates in the `entities` section use the same `[[[ ... ]]]` syntax as other JavaScript templates in the card.

!!! info "Dynamic values are evaluated during updates"
    JavaScript templates are dynamic. They can react to entity states and may be evaluated again whenever the card updates.

    This differs from static reuse features such as `same_as`, `calc()`, `constants`, and `ref()`, which are resolved during card setup.

For details about JavaScript templates, available variables, and reusable template variables, see the templating documentation.

## :material-horseshoe: Available entity options

| Name | Type | Required | Description |
| :--- | :---: | :------: | :---------- |
| `entity` | string | :material-check: | Home Assistant entity ID or a local `fhs_input_number`, `fhs_input_select`, or `fhs_input_boolean` ID |
| `attribute` | string | :material-close: | Attribute to display instead of the main entity state |
| `unit` | string | :material-close: | Unit displayed for the entity or attribute; can use a JavaScript template where supported |
| `decimals` | number | :material-close: | Number of decimals used to format the value |
| `name` | string | :material-close: | Custom name that overrides the Home Assistant friendly name; can use a JavaScript template where supported |
| `area` | string | :material-close: | Custom area that overrides the Home Assistant area for this card; can use a JavaScript template where supported |
| `icon` | string | :material-close: | Custom icon, image, SVG, or JavaScript template |
| `format` | object | :material-close: | Custom formatting options for the entity state |
| `tap_action` | object | :material-close: | Action performed when the entity is clicked or tapped |
| `hold_action` | object | :material-close: | Action performed when the entity is held |
| `double_tap_action` | object | :material-close: | Action performed when the entity is double tapped |
| `initial` | number/string/boolean | :material-close: | Initial value for a local Flexible Horseshoe Card input; a select defaults to its first option and a boolean defaults to `off` |
| `options` | list | :material-check: select only | Non-empty list of unique strings available to an `fhs_input_select` |
| `min` | number | :material-close: | Lowest value accepted by a local `fhs_input_number` |
| `max` | number | :material-close: | Highest value accepted by a local `fhs_input_number` |
| `step` | number | :material-close: | Increment/decrement amount for a local `fhs_input_number`; default: `1` |
| `scope` | string | :material-close: | Keeps a local input in one card or shares it with all Flexible Horseshoe Card cards in the current browser tab; default: `card` |
| `persist` | boolean | :material-close: | Restores a global local input after a page reload; default: `false` |

## :material-horseshoe: Available entity format options

[:octicons-tag-24: v5.4.7-dev.7][github-releases]

| Name | Type | Required | Description |
| :--- | :---: | :------: | :---------- |
| `separator` | boolean | :material-close: | Enables or disables the separator in a numeric state |
| `decimals_min` | number | :material-close: | Minimum number of decimals used to format the value |
| `decimals_max` | number | :material-close: | Maximum number of decimals used to format the value |
| `raw_state_keep` | boolean | :material-close: | Keeps the raw entity state and prevents normal formatting or translation |
| `raw_state_clean` | boolean | :material-close: | Removes underscores from the raw entity state |
| `locale` | string | :material-close: | Locale used to display and format the entity |

## :material-horseshoe: Icon options

When no icon is specified, the card uses the Home Assistant entity icon where possible.

You can override it with an MDI icon, external image, external SVG, or JavaScript template.

| Icon type | Example | Description |
| :-------- | :------ | :---------- |
| MDI icon | `icon: mdi:lightbulb` | Uses a Material Design icon |
| External image | `icon: url(/local/icons/icon-image.png)` | Uses an image file as the icon |
| External SVG | `icon: url(/local/icons/icon-svg.svg)` | Uses an SVG file as the icon |
| JavaScript template | `icon: \|` with `[[[ ... ]]]` | Returns the icon dynamically |

## :material-horseshoe: Actions and local controls

Entities support `tap_action`, `hold_action`, and `double_tap_action` using the current Home Assistant dashboard action format. An individual layout item can override the action configured on its entity. Flexible Horseshoe Card also supports ordered action lists, Companion-app haptic feedback, and browser-local number, select, and boolean inputs.

See [Actions and Local Controls](../interaction/actions.md) for the available actions and complete examples.

## :material-horseshoe: Entity layout elements

Defining an entity does not automatically display every part of it. The `entities` section defines the data source, while the layout sections determine what appears and where it is positioned.

| Entity part | Layout section | Description |
| :---------- | :------------- | :---------- |
| Area | `areas` | Displays the Home Assistant area or a custom area |
| Name | `names` | Displays the entity name or a custom name |
| State | `states` | Displays the entity state, including its unit and decimals |
| Icon | `icons` | Displays the entity icon or a standalone icon |

For detailed configuration of `areas`, `names`, `states`, and `icons`, see [Tools](../tools/tools-overview.md).

For translated names and states, localized units, state colors, and number formatting, see [Localization](../localization/overview.md).

<!--- External References... --->
[github-releases]: https://github.com/amoebelabs/flex-horseshoe-card/releases/
