As of v5.4.1

Support for JavaScript templates in the `styles` section to get dynamic styling based on entity or attribute values.

The following variables are availeble in the JavaScript part:

| Variable    | Description                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------ |
| `state`     | State of entity                                                                                                    |
| `states`    | All the state values from hass: index them with the name of the sensor, ie `states[sensor.my-sensor]` for instance |
| `variables` | Reference to re=usable templates, ie `[[[ return variables['testColorStops']; ]]]` for instance                    |

The example shows that the `fill` of an entities `name` depends on the value of the state.
<br>If state >= 4 then `fill` = `error-color`, else `primary-text-color`

```yaml
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

Using `states` to evaluate a color. If state < 0 then some red color, else green color.

```yaml
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

Using `variables` to re-use templates.

```yaml
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

and using them:

```yaml
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
