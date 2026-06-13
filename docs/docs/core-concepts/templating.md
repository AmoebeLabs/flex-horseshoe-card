---
template: main.html
title: JavaScript templating
description: Use JavaScript templates to create dynamic configuration based on entity states and attributes.
tags:
  - Templating
  - JavaScript
  - Dynamic Configuration
---

# JavaScript templating

JavaScript templates make parts of the card configuration dynamic.

Most card configuration is static: it is read during card setup and stays the same until the card is reloaded. JavaScript templates are different. They can return values based on the current state of an entity, an attribute, or another Home Assistant state.

This is useful when a visual element should change while Home Assistant is running. For example, you can change a color, icon, animation, style value, or color stop definition based on an entity state.

!!! info "Available since v5.4.1"
    JavaScript templates are supported in the `styles` section for dynamic styling based on entity or attribute values.

    Later versions also add template support in other parts of the configuration, such as entity definitions, color stops, and reusable variables.

## :material-horseshoe: Template syntax

A JavaScript template is written between triple brackets:

```yaml linenums="1"
[[[
  return 'var(--primary-text-color)';
]]]
```

In YAML, templates are usually written as a multiline value:

```yaml linenums="1"
fill: |
  [[[
    const value = Number(state);
    return value >= 4
      ? 'var(--error-color)'
      : 'var(--primary-text-color)';
  ]]]
```

The template must return the value that should be used by the card.

## :material-horseshoe: Available variables

The following variables are available inside JavaScript templates:

| Variable | Description |
| :------- | :---------- |
| `state` | The state of the entity connected to the current item |
| `states` | All Home Assistant states from `hass.states` |
| `variables` | Reusable values or templates defined in the card-level `variables` section |

### `state`

Use `state` when the template should respond to the entity connected to the current item through `entity_index`.

Example:

```yaml linenums="1"
const value = Number(state);
```

### `states`

Use `states` when the template needs to read another Home Assistant entity.

Example:

```yaml linenums="1"
const value = Number(states['sensor.battery_power'].state);
```

!!! note
    Entity ids must be written as strings inside square brackets, for example `states['sensor.battery_power']`.

### `variables`

Use `variables` when you want to reuse the same template or value in multiple places.

Example:

```yaml linenums="1"
[[[ return variables['flashAnimation']; ]]]
```

## :material-horseshoe: Dynamic styling based on the current entity

This example changes the `fill` color of an entity name based on the state of the connected entity.

If the state is `4` or higher, the text uses `--error-color`. Otherwise, it uses `--primary-text-color`.

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

Use `states` when the style should depend on a different entity than the one connected to the current item.

In this example, the text color depends on `sensor.battery_power`. Negative values return a red color, positive values return a green color, and zero falls back to the default text color.

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

## :material-horseshoe: Reusing templates with `variables`

For larger cards, templates can become repetitive. The card-level `variables` section lets you define reusable templates or reusable values once and use them in multiple places.

This keeps the YAML easier to read and makes later changes safer.

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
  variables:
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
    # Full YAML definition of a colorstop
    testColorStops3:
      0: 'blue'
      0.1: 'green'
      0.5: 'yellow'
      1: 'orange'
      3: 'red'
      5: 'purple'
```

## :material-horseshoe: Using reusable templates

After defining reusable values or templates in `variables`, you can reference them elsewhere in the card.

This example uses a reusable animation template for the horseshoe state and a reusable color stop definition for the horseshoe colors.

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
              return variables['flashAnimation'];
            ]]]
    color_stops: |
      [[[ return variables['testColorStops3']; ]]]
```

## :material-horseshoe: Advanced example: heavily templated battery card

The example below shows how far JavaScript templating can be taken. It combines reusable variables, dynamic entity icons, dynamic icon colors, state-based animations, and direct access to several Home Assistant states.

!!! warning "Advanced example"
    This example is intentionally large. It is meant to show what is possible, not as a recommended starting point for every card.

    It was created before Reuse™ was implemented.
    When a card starts to contain many repeated templates, consider simplifying the logic, using `variables`, or moving repeated behavior into smaller reusable pieces.

??? info "Advanced example with a lot of templating!"
    ```yaml title="Advanced templated battery card" linenums="1"
    type: custom:flex-horseshoe-card
    variables:
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

            const level = variables['batteryLevel'];
            const charging = variables['batteryCharging'];

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

                  const level = variables['batteryLevel'];
                  const charging = variables['batteryCharging'];

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

                  const level = variables['batteryLevel'];
                  const charging = variables['batteryCharging'];

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

                  const level = variables['batteryLevel'];
                  const charging = variables['batteryCharging'];

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

                  const level = variables['batteryLevel'];
                  const charging = variables['batteryCharging'];

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

This card uses templating in several different places:

| Template location | Purpose |
| :---------------- | :------ |
| `variables.batteryLevel` | Converts the battery state of charge to a rounded battery icon level |
| `variables.batteryCharging` | Checks whether the battery is currently charging |
| `entities.icon` | Selects different icons based on battery, grid, or power flow state |
| `animations.icons.icon` | Updates icons as part of state-based animation rules |
| `animations.icons.styles.fill` | Changes icon colors dynamically |
| `layout.icons.styles.fill` | Applies dynamic fallback colors directly on layout icons |

The example also shows why `variables` are important. Without them, the same battery-level and charging logic would have to be repeated even more often.

## :material-horseshoe: Static configuration vs dynamic templates

JavaScript templates are meant for values that can change while the card is active.

Use static configuration when a value is known in advance. Use JavaScript templates when the value depends on an entity state, attribute, or other dynamic data.

| Use | Best option |
| :-- | :---------- |
| Reuse the same static style block | `constants` and `ref()` |
| Calculate a fixed position or size | `calc()` |
| Copy similar layout items | `same_as` |
| Change a style based on an entity state | JavaScript template |
| Change an icon based on an entity state | JavaScript template |
| Reuse a dynamic expression | `variables` |

## :material-horseshoe: Practical tips

Keep templates as small as possible. Short templates are easier to read, debug, and reuse.

Convert numeric states with `Number()` before comparing them:

```yaml
const value = Number(state);
```

Always return a valid value for the field you are templating. For example, a style property should return a valid CSS value, and an icon field should return a valid icon name or image URL.

When reading another entity through `states`, make sure that entity exists. Missing or unavailable entities can otherwise return unexpected values.

!!! tip
    Use `variables` for templates that appear more than once. This keeps large cards cleaner and makes behavior easier to change later.
