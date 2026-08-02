---
template: main.html
title: Templates
description: Define reusable card, tool, and color-stop templates, pass template variables, and calculate dynamic values with JavaScript templates.
tags:
  - Templating
  - Templates
  - JavaScript
  - Dynamic Configuration
---

# Templates

The Flexible Horseshoe Card supports two complementary template systems:

- **FHS templates** provide reusable configuration blocks for cards, color stops, state maps, and other named parts.
- **JavaScript templates** calculate dynamic values while the card is running.

Store FHS templates in `fhs_templates`. Place this section at view level when only one view needs the templates, or at dashboard level when several views should share them.

Write JavaScript templates directly in configuration values using triple brackets. Use them when a value depends on an entity state, attribute, or another Home Assistant entity.

## :material-horseshoe: FHS templates

FHS templates are reusable configuration blocks identified by name.

Define them under `fhs_templates.templates`:

```yaml linenums="1"
fhs_templates:
  templates:
    <template_name>:
      template:
        type: <template_type>
      <template_content>
```

The `template.type` field determines what the template contains. A template may define a complete card or a reusable part such as `color_stops` or `state_maps`.

## :material-horseshoe: Where to define `fhs_templates`

Define `fhs_templates` at view level when only that view needs the templates. Place it in the dashboard configuration when several views should share them.

The template structure is the same in both locations:

```yaml linenums="1"
fhs_templates:
  templates:
    awair_test:
      template:
        type: card
      card:
        entities:
          - entity: sensor.awair_score
```

## :material-horseshoe: Template types

FHS templates support several kinds of reusable configuration.

| Template type | Used for |
| :------------ | :------- |
| `card` | Reusing a complete or partial Flexible Horseshoe Card configuration |
| `color_stops` | Reusing color stop definitions |
| `state_map` / `state_maps` | Reusing state-to-value mappings |
| other supported template parts | Reusing other named configuration fragments supported by the card |

A `card` template contains a `card` section. Other template types use their own matching content section.

## :material-horseshoe: Template defaults and placeholders

Templates can provide default values and insert them into their content through placeholders.

Placeholders are written with double square brackets:

```yaml linenums="1"
'[[entity]]'
'[[label]]'
'[[max]]'
```

Defaults are defined under `template.defaults`:

```yaml linenums="1"
template:
  type: card
  defaults:
    - label: Score
    - max: 100
```

A card can override these values when it loads the template. Any value that is not supplied uses its default.

## :material-horseshoe: Card templates

A `card` template stores reusable card configuration. It works well when several cards share a layout, styling, entity structure, constants, or other options.

```yaml linenums="1"
fhs_templates:
  templates:
    awair_test:
      template:
        type: card
        defaults:
          - label: Score
          - max: 100
      card:
        entities:
          - entity: '[[entity]]'
            name: '[[label]]'

        dev:
          debug: true

        constants:
          max: '[[max]]'

        layout:
          states:
            - entity_index: 0
              xpos: 50
              ypos: 50
              color_stops:
                template:
                  name: fhs_colorstops_awair_score

          names:
            - entity_index: 0
              xpos: 50
              ypos: 65
              color_stops:
                template:
                  name: fhs_colorstops_awair_score
```

This creates a reusable card template named `awair_test`. It requires an `entity` value and provides defaults for `label` and `max`. The placeholders `[[entity]]`, `[[label]]`, and `[[max]]` insert those values into the card configuration.

Templates can also refer to other templates. In this example, both the `states` and `names` items use the shared `fhs_colorstops_awair_score` color-stop template.

## :material-horseshoe: Default entities in a card template

Use `default_entities` when a card template needs its own supporting entities in addition to the entities supplied by each card. This is useful for local sparkline values because their names are fixed by the sparkline `id`.

```yaml linenums="1"
card:
  default_entities:
    - entity: fhs_sparkline.temperature_history_min
      name: Minimum
    - entity: fhs_sparkline.temperature_history_avg
      name: Average
    - entity: fhs_sparkline.temperature_history_max
      name: Maximum

  layout:
    states:
      - entity: fhs_sparkline.temperature_history_min
        xpos: 20
        ypos: 85
      - entity: fhs_sparkline.temperature_history_avg
        xpos: 50
        ypos: 85
      - entity: fhs_sparkline.temperature_history_max
        xpos: 80
        ypos: 85
```

Entities supplied by the card keep their existing order. Missing default entities are added after them. When the card supplies an entity with the same ID, its options override the template defaults while unspecified options remain available.

Use `entity:` for these fixed local entities so the layout does not depend on where they appear in the final entities list. Continue to use `entity_index` for variable Home Assistant entities supplied to a reusable template.

## :material-horseshoe: Loading a card template

Load a named card template with the card-level `template` option.

```yaml linenums="1"
- type: custom:flex-horseshoe-card
  entities:
    - entity: sensor.awair_score
  template:
    name: awair_test
    variables:
      - label: Score
      - max: 100
```

The template supplies the shared configuration, while the card instance provides the placeholder values.

## :material-horseshoe: Color stop templates

Color-stop templates let several layout items or cards share the same value-to-color rules. Use them when states, names, horseshoes, or other supported elements should follow one common palette.

```yaml linenums="1"
fhs_templates:
  templates:
    fhs_colorstops_awair_score:
      template:
        type: color_stops
      color_stops:
        0: '#d32f2f'
        60: '#fbc02d'
        80: '#388e3c'
        100: '#00c853'
```

Reference the template from a card or another card template:

```yaml linenums="1"
color_stops:
  template:
    name: fhs_colorstops_awair_score
```

This keeps the color logic in one maintainable definition.

## :material-horseshoe: State map templates

State-map templates reuse mappings from states to labels, icons, colors, styles, or other supported values. They are useful when several cards or layout items interpret the same states in the same way.

```yaml linenums="1"
fhs_templates:
  templates:
    fhs_state_map_battery:
      template:
        type: state_map
      state_map:
        charging:
          label: Charging
          icon: mdi:battery-charging
        discharging:
          label: Discharging
          icon: mdi:battery-arrow-down
        idle:
          label: Idle
          icon: mdi:battery
```

Reference the state map by name from a card or template:

```yaml linenums="1"
state_map:
  template:
    name: fhs_state_map_battery
```

Use the singular or plural template type supported by your card version and target field.

## :material-horseshoe: Compose multiple cards

Use the top-level `cards` section to place other cards inside a Flexible Horseshoe Card. Each nested card can define its own type, template, entities, position, and size.

```yaml linenums="1"
type: custom:flex-horseshoe-card
cards:
  - type: custom:flex-horseshoe-card
    entities:
      - entity: sensor.awair_score
    template:
      name: awair_test
      variables:
        - label: Score
        - max: 100
    xpos: 25
    ypos: 50
    width: 40
    height: 40
```

Nested cards use the parent card canvas. Position them with `xpos` and `ypos`, and set their size with `width` and `height`.

## :material-horseshoe: When to use FHS templates

Use FHS templates when configuration should be reusable before the card is rendered.

| Use | Best option |
| :-- | :---------- |
| Reuse a complete or partial card configuration | `type: card` template |
| Create similar cards with different entities | Card template with placeholders |
| Create similar cards with different labels or limits | Card template with defaults and placeholders |
| Reuse the same color stop rules | `type: color_stops` template |
| Reuse the same state mapping | `type: state_map` or `type: state_maps` template |
| Place multiple reusable cards inside one card | `cards` with card templates |

FHS templates are static definitions resolved with the card configuration. Choose JavaScript templates instead when a value must change while the card is active.

## :material-horseshoe: JavaScript templating

JavaScript templates make individual configuration values dynamic.

Most configuration is read during setup and remains unchanged until the card reloads. A JavaScript template can instead return a value based on the current entity, one of its attributes, or another Home Assistant state.

Use this when a visual element should react at runtime—for example, by changing its color, icon, animation, style, or color-stop definition.

!!! info "Available since v5.4.1"
    JavaScript templates are supported in the `styles` section for dynamic styling based on entity or attribute values.

    Later versions (as of v5.4.7) also add template support in other parts of the configuration, such as entity definitions, color stops, and reusable constants.

!!! warning "Breaking change in v5.4.7-dev.14"
    `variables` was renamed to `constants` because the FHS template engine uses variables for placeholder replacement.

    Move existing entries from `variables` to `constants` and update template references from `variables[...]` to `constants[...]`. The underlying behavior remains the same.

## :material-horseshoe: JavaScript template syntax

Write JavaScript templates between triple brackets:

```yaml linenums="1"
[[[
  return 'var(--primary-text-color)';
]]]
```

In YAML, a multiline value is usually the clearest form:

```yaml linenums="1"
fill: |
  [[[
    const value = Number(state);
    return value >= 4
      ? 'var(--error-color)'
      : 'var(--primary-text-color)';
  ]]]
```

The template must return a value that is valid for the target field.

## :material-horseshoe: Available template variables

The following variables are available inside JavaScript templates:

| Variable | Description |
| :------- | :---------- |
| `state` | State or configured attribute of the entity connected to the current item |
| `entity` | Complete Home Assistant state object connected to the current item |
| `entities` | State objects for all entries in the card-level `entities` list |
| `states` | All Home Assistant states from `hass.states` |
| `hass` | Current Home Assistant frontend object |
| `config` | Statically compiled card configuration |
| `constants` | Values or JavaScript source stored in the card-level `constants` section |
| `item` | Complete configuration component currently being evaluated |
| `user` | Current Home Assistant user |

### `state`

Use `state` to read the state or configured attribute of the entity connected through `entity_index`.

Example:

```yaml linenums="1"
const value = Number(state);
```

### `states`

Use `states` to read another Home Assistant entity.

Example:

```yaml linenums="1"
const value = Number(states['sensor.battery_power'].state);
```

!!! note
    Entity IDs must be written as strings inside square brackets, for example `states['sensor.battery_power']`.

### `constants`

Use `constants` to share the same template or value across several fields.

Example:

```yaml linenums="1"
[[[ return constants['flashAnimation']; ]]]
```

## :material-horseshoe: Where JavaScript templates can be used

JavaScript templates can be used in fields within the supported sections below. Their results are updated when a registered entity changes.

| Configuration section | Supported items |
| :-------------------- | :-------------- |
| Entity definitions | Items in `entities` |
| Layout tools | Items in `horseshoes`, `horseshoes_v2`, `states`, `names`, `areas`, `circles`, `arcs`, `rectangles`, `lines`, `hlines`, `vlines`, `icons`, and `sparklines` |
| Layout groups | Groups in `layout.groups`, including position, scale, and color filters |
| Animations | State items in `animations` |
| Card styles | The card-level `styles` block |

!!! warning "Register every states dependency"
    Every entity read through `states['entity.id']` must also be present in the card-level `entities` list. Otherwise, changes to that entity do not update the card.

A JavaScript template stored in `constants` uses the entity connected to the item where it is referenced. A returned value may itself contain another `[[[ ... ]]]` template.

## :material-horseshoe: Dynamic styling based on the current entity

This example changes an entity name’s `fill` color based on the connected state. Values of `4` or higher use `--error-color`; lower values use `--primary-text-color`.

```yaml linenums="1"
names:
  - id: 0
    entity_index: 0
    xpos: 50
    ypos: 100
    styles:
      - font-size: 1.2em;
      - fill: |
          [[[
            const value = Number(state);
            return value >= 4
              ? 'var(--error-color);'
              : 'var(--primary-text-color);';
          ]]]
```

## :material-horseshoe: Reading another entity with `states`

Use `states` when a value depends on an entity other than the one connected to the current item.

Here, the text color follows `sensor.battery_power`: negative values are red, positive values are green, and zero uses the default text color.

```yaml linenums="1"
names:
  - id: 0
    entity_index: 0
    xpos: 50
    ypos: 100
    styles:
      - font-size: 1.2em;
      - fill: |
          [[[
            const v = Number(states['sensor.battery_power'].state);
            if (v < 0) return '#ff4d4d';
            if (v > 0) return '#00c853';
            return 'var(--primary-text-color)';
          ]]]
```

## :material-horseshoe: Reusing JavaScript templates with `constants`

Templates can become repetitive in larger cards. Store shared templates and values under card-level `constants`, then reference them wherever they are needed.

This keeps the YAML easier to scan and gives repeated logic a single place to update.

```yaml linenums="1"
- type: custom:flex-horseshoe-card
  entities:
    - entity: sensor.dsmr_reading_phase_currently_delivered_l1
      decimals: 2
      name: 'L1'
    - entity: sensor.dsmr_reading_phase_currently_delivered_l2
      decimals: 2
      name: 'L2'
    - entity: sensor.dsmr_reading_phase_currently_delivered_l3
      decimals: 2
      name: 'L3'
    - entity: sensor.dsmr_reading_electricity_currently_delivered
      decimals: 2
      name: 'All'
      # Change icon depending on state of this entity
      icon: |
        [[[
          const value = Number(state);
          return value >= 0.4
            ? 'mdi:flash'
            : 'mdi:flash-off';
        ]]]
    - entity: sensor.dsmr_reading_electricity_currently_delivered
      decimals: 2
    - entity: light.livingroom_light_duo_left_light
      name: 'extra hall'
      icon: mdi:lightbulb
  constants:
    # Flash if state > 0.3. 3 times for 1 second
    flashAnimation: |
      [[[
        const value = Number(state);
        return value >= 0.3
          ? 'flash 1s ease-in-out 3'
          : 'none';
      ]]]
    # Color stop template containing nested templates
    testColorStops: |
      [[[
        return {
          0: 'black',
          0.1: `[[[ return 'hotpink'; ]]]`,
          0.5: 'yellow',
          1: 'orange',
          3: `[[[ return 'red'; ]]]`,
          5: `[[[ return 'purple'; ]]]`,
        };
      ]]]
    # Color stop definition defined fully by JavaScript template
    testColorStops2: |
      [[[
        return {
          0: 'blue',
          0.1: 'green',
          0.5: 'yellow',
          1: 'orange',
          3: 'red',
          5: 'purple',
        };
      ]]]
    # Full YAML definition of a color stop
    testColorStops3:
      0: 'blue'
      0.1: 'green'
      0.5: 'yellow'
      1: 'orange'
      3: 'red'
      5: 'purple'
```

## :material-horseshoe: Using reusable JavaScript templates

After defining a reusable value or template in `constants`, reference it elsewhere in the card.

The example below uses one shared animation template for the horseshoe state and one shared color-stop definition for its colors.

```yaml linenums="1"
horseshoes:
  - entity_index: 3
    xpos: 75
    ypos: 69
    radius: 20
    tickmarks_radius: 18
    arc_degrees: 300
    show:
      horseshoe: true
      scale_tickmarks: true
      horseshoe_style: colorstop
    horseshoe_scale:
      min: 0
      max: 5
      width: 6
      color: var(--secondary-background-color)
      ticksize: 1
    horseshoe_state:
      width: 12
      styles:
        - animation: |
            [[[
              return constants['flashAnimation'];
            ]]]
    color_stops: |
      [[[ return constants['testColorStops3']; ]]]
```

## :material-horseshoe: Advanced example: heavily templated battery card

The following card combines reusable constants, dynamic entity icons and colors, state-based animations, and direct access to several Home Assistant states.

!!! warning "Advanced example"
    This intentionally large example demonstrates the available possibilities rather than a recommended starting point.

    It predates Reuse™. For new cards with repeated logic, consider simplifying the templates, using `constants`, or moving shared behavior into smaller reusable definitions.

??? info "Advanced example with a lot of templating!"
    ```yaml title="Advanced templated battery card" linenums="1"
    type: custom:flex-horseshoe-card
    constants:
      batteryLevel: |
        [[[
          const soc = Number(states['sensor.sh15t_a2572404405_battery_level_soc']?.state);
          if (!Number.isFinite(soc)) return 0;
          return Math.min(100, Math.max(10, Math.round(soc / 10) * 10));
        ]]]
      batteryCharging: |
        [[[
          const p = Number(states['sensor.sh15t_a2572404405_battery_charging_power']?.state ?? 0);
          return Number.isFinite(p) && p > 0;
        ]]]
    show:
      horseshoe_style: colorstopgradient
      scale_tickmarks: true
    entities:
      - entity: sensor.sh15t_a2572404405_battery_level_soc
        decimals: 0
        unit: "%"
        area: Battery
        name: House Battery
        icon: |
          [[[
            const soc = Number(states['sensor.sh15t_a2572404405_battery_level_soc']?.state);

            const level = constants['batteryLevel'];
            const charging = constants['batteryCharging'];

            if (!Number.isFinite(soc)) return 'mdi:battery-unknown';

            if (soc <= 5) {
              return charging
                ? 'mdi:battery-charging-outline'
                : 'mdi:battery-outline';
            }

            if (level >= 100) {
              return charging
                ? 'mdi:battery-charging-outline'
                : 'mdi:battery';
            }

            return charging
              ? 'mdi:battery-charging'
              : `mdi:battery-${level}`;
          ]]]
      - entity: sensor.battery_flow
        decimals: 2
        unit: kW
        area: Power
        icon: |
          [[[
            const val = Number(states['sensor.battery_flow']?.state ?? 0);

            if (!Number.isFinite(val) || val === 0) {
              return 'mdi:transmission-tower';
            }

            return val > 0
              ? 'mdi:battery-arrow-up'
              : 'mdi:battery-arrow-down';
          ]]]
      - entity: sensor.battery_time_estimate
        area: Battery Time
      - entity: binary_sensor.battery_charging
      - entity: binary_sensor.battery_discharging
      - entity: binary_sensor.battery_idle
      - entity: sensor.grid_flow
        decimals: 2
        unit: kW
        area: Power
        icon: |
          [[[
            const val = Number(states['sensor.grid_flow']?.state ?? 0);

            if (!Number.isFinite(val) || val === 0) {
              return 'mdi:transmission-tower';
            }

            return val > 0
              ? 'mdi:transmission-tower-export'
              : 'mdi:transmission-tower-import';
          ]]]
      - entity: binary_sensor.grid_idle
    animations:
      entity.3:
        - state: "on"
          icons:
            - animation_id: 1
              icon: |
                [[[
                  const soc = Number(states['sensor.sh15t_a2572404405_battery_level_soc']?.state);

                  const level = constants['batteryLevel'];
                  const charging = constants['batteryCharging'];

                  if (!Number.isFinite(soc)) return 'mdi:battery-unknown';

                  if (soc <= 5) {
                    return charging
                      ? 'mdi:battery-charging-outline'
                      : 'mdi:battery-outline';
                  }

                  if (level >= 100) {
                    return charging
                      ? 'mdi:battery-charging-outline'
                      : 'mdi:battery';
                  }

                  return charging
                    ? 'mdi:battery-charging'
                    : `mdi:battery-${level}`;
                ]]]
              styles:
                - fill: |
                    [[[
                      const soc = Number(states['sensor.sh15t_a2572404405_battery_level_soc']?.state);

                      if (!Number.isFinite(soc)) return 'white';
                      if (soc <= 20) return 'red';
                      if (soc <= 40) return 'orange';
                      if (soc <= 60) return 'yellow';

                      return 'green';
                    ]]]
        - state: "off"
          icons:
            - animation_id: 1
              icon: |
                [[[
                  const soc = Number(states['sensor.sh15t_a2572404405_battery_level_soc']?.state);

                  const level = constants['batteryLevel'];
                  const charging = constants['batteryCharging'];

                  if (!Number.isFinite(soc)) return 'mdi:battery-unknown';

                  if (soc <= 5) {
                    return charging
                      ? 'mdi:battery-charging-outline'
                      : 'mdi:battery-outline';
                  }

                  if (level >= 100) {
                    return charging
                      ? 'mdi:battery-charging-outline'
                      : 'mdi:battery';
                  }

                  return charging
                    ? 'mdi:battery-charging'
                    : `mdi:battery-${level}`;
                ]]]
              styles:
                - fill: |
                    [[[
                      const soc = Number(states['sensor.sh15t_a2572404405_battery_level_soc']?.state);

                      if (!Number.isFinite(soc)) return 'white';
                      if (soc <= 20) return 'red';
                      if (soc <= 40) return 'orange';
                      if (soc <= 60) return 'yellow';

                      return 'green';
                    ]]]
      entity.4:
        - state: "on"
          icons:
            - animation_id: 2
              icon: |
                [[[
                  const val = Number(states['sensor.battery_flow']?.state ?? 0);

                  if (!Number.isFinite(val) || val === 0) {
                    return 'mdi:transmission-tower';
                  }

                  return val > 0
                    ? 'mdi:battery-arrow-up'
                    : 'mdi:battery-arrow-down';
                ]]]
              styles:
                - fill: |
                    [[[
                      const val = Number(states['sensor.battery_flow']?.state ?? 0);

                      if (val > 0) return 'green';
                      if (val < 0) return 'orange';

                      return 'grey';
                    ]]]
        - state: "off"
          icons:
            - animation_id: 2
              icon: |
                [[[
                  const val = Number(states['sensor.battery_flow']?.state ?? 0);

                  if (!Number.isFinite(val) || val === 0) {
                    return 'mdi:transmission-tower';
                  }

                  return val > 0
                    ? 'mdi:battery-arrow-up'
                    : 'mdi:battery-arrow-down';
                ]]]
              styles:
                - fill: transparent
      entity.5:
        - state: "on"
          icons:
            - animation_id: 3
              icon: |
                [[[
                  const soc = Number(states['sensor.sh15t_a2572404405_battery_level_soc']?.state);

                  const level = constants['batteryLevel'];
                  const charging = constants['batteryCharging'];

                  if (!Number.isFinite(soc)) return 'mdi:battery-unknown';

                  if (soc <= 5) {
                    return charging
                      ? 'mdi:battery-charging-outline'
                      : 'mdi:battery-outline';
                  }

                  if (level >= 100) {
                    return charging
                      ? 'mdi:battery-charging-outline'
                      : 'mdi:battery';
                  }

                  return charging
                    ? 'mdi:battery-charging'
                    : `mdi:battery-${level}`;
                ]]]
              styles:
                - fill: |
                    [[[
                      const soc = Number(states['sensor.sh15t_a2572404405_battery_level_soc']?.state);

                      if (!Number.isFinite(soc)) return 'white';
                      if (soc <= 20) return 'red';
                      if (soc <= 40) return 'orange';
                      if (soc <= 60) return 'yellow';

                      return 'green';
                    ]]]
        - state: "off"
          icons:
            - animation_id: 3
              icon: |
                [[[
                  const soc = Number(states['sensor.sh15t_a2572404405_battery_level_soc']?.state);

                  const level = constants['batteryLevel'];
                  const charging = constants['batteryCharging'];

                  if (!Number.isFinite(soc)) return 'mdi:battery-unknown';

                  if (soc <= 5) {
                    return charging
                      ? 'mdi:battery-charging-outline'
                      : 'mdi:battery-outline';
                  }

                  if (level >= 100) {
                    return charging
                      ? 'mdi:battery-charging-outline'
                      : 'mdi:battery';
                  }

                  return charging
                    ? 'mdi:battery-charging'
                    : `mdi:battery-${level}`;
                ]]]
              styles:
                - fill: |
                    [[[
                      const soc = Number(states['sensor.sh15t_a2572404405_battery_level_soc']?.state);

                      if (!Number.isFinite(soc)) return 'white';
                      if (soc <= 20) return 'red';
                      if (soc <= 40) return 'orange';
                      if (soc <= 60) return 'yellow';

                      return 'green';
                    ]]]
      entity.7:
        - state: "on"
          icons:
            - animation_id: 4
              icon: mdi:transmission-tower
              styles:
                - fill: |
                    [[[
                      const val = Number(states['sensor.grid_flow']?.state ?? 0);

                      if (val < 0) return 'green';
                      if (val > 0) return 'orange';

                      return 'grey';
                    ]]]
        - state: "off"
          icons:
            - animation_id: 4
              icon: |
                [[[
                  const val = Number(states['sensor.grid_flow']?.state ?? 0);

                  if (!Number.isFinite(val) || val === 0) {
                    return 'mdi:transmission-tower';
                  }

                  return val > 0
                    ? 'mdi:transmission-tower-export'
                    : 'mdi:transmission-tower-import';
                ]]]
              styles:
                - fill: |
                    [[[
                      const val = Number(states['sensor.grid_flow']?.state ?? 0);

                      if (val < 0) return 'green';
                      if (val > 0) return 'orange';

                      return 'grey';
                    ]]]
    layout:
      hlines:
        - id: 0
          xpos: 50
          ypos: 35
          length: 70
          styles:
            - opacity: 0.2;
      states:
        - id: 0
          entity_index: 0
          xpos: 45
          ypos: 48
          styles:
            - font-size: 1.5em;
        - id: 1
          entity_index: 1
          xpos: 50
          ypos: 61
          styles:
            - font-size: 1.5em;
        - id: 2
          entity_index: 2
          xpos: 50
          ypos: 98
          styles:
            - font-size: 1em;
        - id: 6
          entity_index: 6
          xpos: 50
          ypos: 74
          styles:
            - font-size: 1.5em;
      areas:
        - id: 0
          entity_index: 0
          xpos: 50
          ypos: 30
          styles:
            - font-size: 1.5em;
        - id: 1
          entity_index: 2
          xpos: 50
          ypos: 90
          styles:
            - font-size: 0.9em;
      icons:
        - id: 0
          animation_id: 1
          entity_index: 0
          xpos: 35
          ypos: 48
          align: end
          icon_size: 1
          styles:
            - animation: flash 5s ease-in-out infinite;
        - id: 1
          animation_id: 2
          entity_index: 1
          xpos: 35
          ypos: 61
          align: end
          icon_size: 1
          styles:
            - animation: flash 5s ease-in-out infinite;
        - id: 2
          animation_id: 3
          entity_index: 0
          xpos: 35
          ypos: 48
          align: end
          icon_size: 1
          styles:
            - fill: |
                [[[
                  const soc = Number(states['sensor.sh15t_a2572404405_battery_level_soc']?.state);

                  if (!Number.isFinite(soc)) return 'white';
                  if (soc <= 20) return 'red';
                  if (soc <= 40) return 'orange';
                  if (soc <= 60) return 'yellow';

                  return 'green';
                ]]]
        - id: 6
          animation_id: 4
          entity_index: 6
          xpos: 35
          ypos: 74
          align: end
          icon_size: 1
          styles:
            - fill: |
                [[[
                  const val = Number(states['sensor.grid_flow']?.state ?? 0);

                  if (val < 0) return 'green';
                  if (val > 0) return 'orange';

                  return 'grey';
                ]]]
    horseshoe_scale:
      min: 0
      max: 100
      width: 3
      color: rgba(200, 200, 200, 0.6)
    color_stops:
      "20": red
      "40": orange
      "60": yellow
      "80": green
    card_mod:
      style: |
        ha-card {
          border: none;
          height: 340px;
          width: 340px;
        }
    ```

## :material-horseshoe: What this example demonstrates

This card uses JavaScript templates in several parts of its configuration:

| Template location | Purpose |
| :---------------- | :------ |
| `constants.batteryLevel` | Converts the battery state of charge to a rounded battery icon level |
| `constants.batteryCharging` | Checks whether the battery is currently charging |
| `entities.icon` | Selects different icons based on battery, grid, or power flow state |
| `animations.icons.icon` | Updates icons as part of state-based animation rules |
| `animations.icons.styles.fill` | Changes icon colors dynamically |
| `layout.icons.styles.fill` | Applies dynamic fallback colors directly on layout icons |

The shared `constants` prevent the battery-level and charging logic from being repeated in even more places.

## :material-horseshoe: Static configuration, FHS templates, and dynamic templates

Static configuration, FHS templates, and JavaScript templates each solve a different problem.

Use ordinary configuration for values known in advance. Choose FHS templates for reusable cards, color stops, state maps, and other named fragments. Use JavaScript templates only when a value depends on runtime entity data.

| Use | Best option |
| :-- | :---------- |
| Reuse a complete or partial card configuration | FHS `card` template |
| Create multiple similar cards with different entities | FHS card template with placeholders |
| Create multiple similar cards with different limits or labels | FHS card template with defaults |
| Reuse the same color stop rules | FHS `color_stops` template |
| Reuse the same state mapping | FHS `state_map` or `state_maps` template |
| Place multiple reusable cards inside one card | `cards` with FHS card templates |
| Reuse the same static style block inside one card | `constants` and `ref()` |
| Calculate a fixed position or size | `calc()` |
| Copy similar layout items | `same_as` |
| Change a style based on an entity state | JavaScript template |
| Change an icon based on an entity state | JavaScript template |
| Reuse a dynamic expression inside one card | JavaScript template in `constants` |

## :material-horseshoe: Practical tips

Keep templates focused. Short templates are easier to read, test, and reuse.

Use card templates for repeated structures, and reserve JavaScript templates for values that genuinely need to change at runtime.

Convert numeric states with `Number()` before comparing them:

```yaml
const value = Number(state);
```

Always return a value accepted by the target field. A style property must return valid CSS, while an icon field must return a valid icon name or image URL.

When reading another entity through `states`, account for missing or unavailable states and register the entity in the card-level `entities` list.

!!! tip
    Use card templates for repeated card layouts. Use `constants` for templates or values that appear more than once inside a card.
