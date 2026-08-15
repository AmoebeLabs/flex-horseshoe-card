---
template: main.html
title: Awair Card Examples
description: Explore an interactive Awair card for viewing indoor air quality measurements from different rooms and time periods.
hideno:
toc:
tags:
  - Demo Card
  - Awair Card
---

<!-- GT/GL -->

# Awair card examples

## :material-horseshoe: Visualization

This interactive Awair card brings several indoor air quality measurements together in one view. Use the controls to select a room, choose the measurement you want to inspect, and change the displayed history period.

{{ loop_video(
  "fhs-demo-card-awair-selectable--dark.mp4",
  "Interactive Awair showcase build with Flexible Horseshoe Car in Home Assistant",
  "A full demo showing the interactive possibilities of the Flexible Horseshoe Card with three Awair Elements. All sensors and selectable history duration.",
  "fhs-demo-card-awair-selectable--dark.png",
  "2026-08-15",
  "PT0M30S",
  "720px") }}

The current value, horseshoe, colors, name, unit, and history graph follow the selected measurement. This makes it possible to explore several Awair devices without filling the dashboard with a separate card for every sensor.

| Description                                                                  | Aspect ratio |
| :--------------------------------------------------------------------------- | :----------- |
| Displays selectable measurements and history from several Awair air sensors. | `1/1.4`      |

### Available controls

| Control     | type   | Options                                                 |
| :---------- | :----- | :------------------------------------------------------ |
| Room        | select | Living room, study, or bedroom.                         |
| Measurement | select | Awair score, temperature, humidity, CO2, VOC, or PM2.5. |
| History     | select | 1 hour, 12 hours, 1 day, 2 days, 1 week, or 2 weeks.    |

Selections can be shared by multiple FHS cards on the same dashboard. Changing a control can therefore update several related cards at once and keep their displayed room, measurement, or history period synchronized.

### Demonstrated functionality

| Feature            | Demonstrated use                                                                |
| :----------------- | :------------------------------------------------------------------------------ |
| Selection controls | Switches between rooms, measurements, and history periods directly on the card. |
| Horseshoe          | Displays the current measurement using its matching scale and colors.           |
| Sparkline history  | Shows the selected measurement over the chosen period.                          |
| Adaptive layout    | Keeps labels, values, and controls readable when their content changes.         |
| Shared selections  | Keeps multiple cards synchronized while browsing the dashboard.                 |

## :material-horseshoe: Required entities

This example uses Awair sensors for the available rooms and measurements. Change the entity IDs in the card configuration to match the names used by your Awair integration.

## YAML definition

??? info "Definition of the interactive Awair card"

    ```yaml linenums="1" hl_lines="1"
      - type: custom:flex-horseshoe-card

        entities:
          # Tijdelijke selector totdat fhs_input_text bestaat.
          - entity: fhs_input_number.awair_sensorc
            initial: 0
            scope: global
            unit: ''
          - entity: fhs_input_number.history_hours
            initial: 24
            scope: global
            unit: 'h'
          - entity: fhs_input_number.awair_room
            initial: 1
            scope: global
            unit: ''
          # Dynamische entity-slot. Alle weergegeven onderdelen gebruiken index.
          - entity: |
              [[[
                const room = constants.awair_rooms[Number(entities[2].state)];
                const sensor = constants.awair_sensors[Number(entities[0].state)];

                return `sensor.awair_element_${room}_${sensor}`;
              ]]]
            name:  |
              [[[
                const room =
                  constants.awair_rooms[Number(entities[2].state)];

                const sensor =
                  constants.awair_sensors[Number(entities[0].state)];

                const entityId =
                  `sensor.awair_element_${room}_${sensor}`;

                return states[entityId].attributes.friendly_name
                  .replace(/^Awair Element\s*/, '');
              ]]]
            decimals: 1

        constants:
          entity_index_sensor: 0
          entity_index_hours: 1
          entity_index_room: 2
          entity_index_awair: 3
          awair_rooms:
            - ''
            - livingroom
            - study
            - bedroom
          awair_sensors:
            - score
            - temperature
            - humidity
            - carbon_dioxide
            - volatile_organic_compounds
            - pm2_5
          awair_color_stops:
            - template:
                name: fhs_colorstops_awair_score
            - template:
                name: fhs_colorstops_awair_temperature
            - template:
                name: fhs_colorstops_awair_humidity
            - template:
                name: fhs_colorstops_awair_co2
            - template:
                name: fhs_colorstops_awair_voc
            - template:
                name: fhs_colorstops_awair_pm25

          awair_color_stop: |
            [[[
              return constants.awair_color_stops[
                Number(entities[0].state)
              ];
            ]]]
          get_value_from_item_id: |
            [[[
              return Number(item.id.split('--value-')[1]);
            ]]]


        layout:
          aspectratio: 1/1.4

          groups:
            - id: room
              xpos: 50
              ypos: 9

            - id: sensor-buttons
              xpos: 50
              ypos: 25

            - id: title
              xpos: 50
              ypos: 42

            - id: value
              xpos: 50
              ypos: 60

            - id: graph
              xpos: 50
              ypos: 95

            - id: duration-buttons
              xpos: 50
              ypos: 131

          compounds:
            # ------------------------------------------------------------------------
            # Room selector
            # ------------------------------------------------------------------------
            - id: room-selector
              group: room
              entity_index: calc(entity_index_room)

              rectangles:
                - id: background
                  xpos: 50
                  ypos: 50
                  width: 98
                  height: 13
                  radius: 2
                  styles:
                    fill: var(--divider-color)
                    fill-opacity: 0.5

                - id: livingroom--value-1
                  xpos: 18
                  ypos: 50
                  width: 30
                  height: 9
                  radius: 2
                  styles:
                    fill: var(--secondary-background-color)
                    fill-opacity: 0.2
                    stroke: |
                      [[[
                        const value = Number(item.id.split('--value-')[1]);

                        return Number(state) === value
                          ? 'var(--primary-color)'
                          : 'var(--divider-color)';
                      ]]]
                    stroke-opacity: 1
                    stroke-width: 1
                  tap_action:
                    haptic: selection
                    action: perform-action
                    perform_action: fhs_input_number.set_value
                    target:
                      entity_id: fhs_input_number.awair_room
                    data:
                      value: ref(get_value_from_item_id)

                - id: study--value-2
                  same_as: livingroom--value-1
                  same_as_dxpos: 32

                - id: bedroom--value-3
                  same_as: study--value-2
                  same_as_dxpos: 32

              texts:
                - id: livingroom--value-1
                  text: Livingroom
                  xpos: 18
                  ypos: 50
                  text_overflow:
                    mode: fit
                    fit:
                      max_width: 25
                  styles:
                    font-size: 0.8em
                    font-weight: 600
                    text-anchor: middle
                    dominant-baseline: central
                    fill: |
                      [[[
                        const value = Number(item.id.split('--value-')[1]);

                        return Number(state) === value
                          ? 'var(--primary-color)'
                          : 'var(--primary-text-color)';
                      ]]]

                - id: study--value-2
                  same_as: livingroom--value-1
                  same_as_dxpos: 32
                  text: Study

                - id: bedroom--value-3
                  same_as: study--value-2
                  same_as_dxpos: 32
                  text: Bedroom

            # ------------------------------------------------------------------------
            # sensor selector
            # ------------------------------------------------------------------------
            - id: sensor-selector
              group: sensor-buttons
              entity_index: calc(entity_index_sensor)

              rectangles:
                - id: background
                  xpos: 50
                  ypos: 50
                  width: 98
                  height: 13
                  radius: 2
                  styles:
                    stroke: var(--divider-color)
                    stroke-width: 1
                    stroke-opacity: 0.5
                    fill: none

                - id: sensor--value-0
                  xpos: 10
                  ypos: 50
                  width: 14
                  height: 10
                  radius: 2
                  styles:
                    fill: |
                      [[[
                        const value = Number(item.id.split('--value-')[1]);

                        return Number(state) === value
                          ? 'var(--primary-color)'
                          : 'var(--secondary-background-color)';
                      ]]]
                  tap_action:
                    haptic: selection
                    action: perform-action
                    perform_action: fhs_input_number.set_value
                    target:
                      entity_id: fhs_input_number.awair_sensorc
                    data:
                      value: ref(get_value_from_item_id)

                - id: sensor--value-1
                  same_as: sensor--value-0
                  same_as_dxpos: 16

                - id: sensor--value-2
                  same_as: sensor--value-1
                  same_as_dxpos: 16

                - id: sensor--value-3
                  same_as: sensor--value-2
                  same_as_dxpos: 16

                - id: sensor--value-4
                  same_as: sensor--value-3
                  same_as_dxpos: 16

                - id: sensor--value-5
                  same_as: sensor--value-4
                  same_as_dxpos: 16

              texts:
                - id: sensor--value-0
                  xpos: 10
                  ypos: 50
                  text: Score
                  text_overflow:
                    mode: fit
                    fit:
                      max_width: 12
                  styles:
                    font-size: 0.65em
                    text-anchor: middle
                    dominant-baseline: central
                    fill: |
                      [[[
                        const value = Number(item.id.split('--value-')[1]);

                        return Number(state) === value
                          ? 'var(--primary-background-color)'
                          : 'var(--primary-text-color)';
                      ]]]

                - id: sensor--value-1
                  same_as: sensor--value-0
                  same_as_dxpos: 16
                  text: Temp

                - id: sensor--value-2
                  same_as: sensor--value-1
                  same_as_dxpos: 16
                  text: Humidity

                - id: sensor--value-3
                  same_as: sensor--value-2
                  same_as_dxpos: 16
                  text: CO2

                - id: sensor--value-4
                  same_as: sensor--value-3
                  same_as_dxpos: 16
                  text: VOC

                - id: sensor--value-5
                  same_as: sensor--value-4
                  same_as_dxpos: 16
                  text: PM2.5

            # ------------------------------------------------------------------------
            # Selected sensor title
            # ------------------------------------------------------------------------
            - id: selected-title
              group: title
              entity_index: calc(entity_index_awair)

              icons:
                - id: icon
                  xpos: 10
                  yposc: 50
                  icon_size: 1
                  color_stops: ref(awair_color_stop)
                  show:
                    item_style: colorstopgradient

              names:
                - id: name
                  xpos: 18
                  ypos: 50
                  ellipsis: 22
                  styles:
                    font-size: 0.9em
                    text-anchor: start
                    fill: var(--secondary-text-color)
                    dominant-baseline: central

              horseshoes:
                - id: score
                  xpos: 10
                  ypos: 50
                  radius: 5
                  arc_degrees: 360
                  flip: both
                  horseshoe_state:
                    width: 4
                    linecap: butt
                  horseshoe_scale:
                    width: 2
                    linecap: butt
                    styles:
                      opacity: 0.6
                  color_stops: ref(awair_color_stop)
                  show:
                    horseshoe_style: colorstopgradient
                    scale_style: colorstop

            # ------------------------------------------------------------------------
            # Selected sensor value
            # ------------------------------------------------------------------------
            - id: selected-value
              group: value
              entity_index: calc(entity_index_awair)

              states:
                - id: state
                  xpos: 50
                  ypos: 50
                  show:
                    uom: end
                  styles:
                    font-size: 1.4em
                    font-weight: bold
                    text-anchor: middle
                    fill: var(--primary-text-color)

              rectangles:
                - id: background
                  fit:
                    section: states
                    item_id: state
                    padding:
                      x: 1
                      y: 1
                  radius: 2
                  show:
                    item_style: colorstopgradient
                  colorstopgradient:
                    fill: true
                    stroke: true
                  color_stops: ref(awair_color_stop)
                  styles:
                    fill-opacity: 0.2
                    stroke-opacity: 1
                    stroke-width: 1

            # ------------------------------------------------------------------------
            # sensor history
            # ------------------------------------------------------------------------
            - id: selected-history
              group: graph
              entity_index: calc(entity_index_awair)

              sparklines:
                - id: graph
                  xpos: 50
                  ypos: 50
                  width: 90
                  height: 50
                  margin: 0

                  period:
                    type: rolling_window
                    rolling_window:
                      duration:
                        hour: |
                          [[[
                            return Number(entities[1].state);
                          ]]]
                      bins:
                        per_hour: auto
                        density: medium

                  sparkline:
                    animate: true
                    show:
                      chart_type: area
                      line: true
                      area: true
                      fill: fade
                      points: false
                      grid: true
                      axis: true
                      tickmarks: true
                      labels: true
                      xlabels_at: ticks_major
                      ylabels_at: ticks_major

                    state_values:
                      aggregate_func: avg

                    line:
                      line_width: 1
                      show_dots: false

                    area:
                      show_minmax: true

                    color_stops: ref(awair_color_stop)

                  x_axis:
                    labels:
                      styles:
                        font-size: 0.5em

                  y_axis:
                    labels:
                      styles:
                        font-size: 0.5em

            # ------------------------------------------------------------------------
            # History duration selector
            # ------------------------------------------------------------------------
            - id: duration-selector
              group: duration-buttons
              entity_index: calc(entity_index_hours)

              rectangles:
                - id: history-hours--value-1
                  xpos: 10
                  ypos: 50
                  width: 12
                  height: 10
                  radius: 2
                  styles:
                    fill: |
                      [[[
                        const value = Number(item.id.split('--value-')[1]);

                        return Number(state) === value
                          ? 'var(--primary-color)'
                          : 'var(--secondary-background-color)';
                      ]]]
                  tap_action:
                    haptic: selection
                    action: perform-action
                    perform_action: fhs_input_number.set_value
                    target:
                      entity_id: fhs_input_number.history_hours
                    data:
                      value: ref(get_value_from_item_id)

                - id: history-hours--value-12
                  same_as: history-hours--value-1
                  same_as_dxpos: 16

                - id: history-hours--value-24
                  same_as: history-hours--value-12
                  same_as_dxpos: 16

                - id: history-hours--value-48
                  same_as: history-hours--value-24
                  same_as_dxpos: 16

                - id: history-hours--value-168
                  same_as: history-hours--value-48
                  same_as_dxpos: 16

                - id: history-hours--value-336
                  same_as: history-hours--value-168
                  same_as_dxpos: 16

              texts:
                - id: history-hours--value-1
                  xpos: 10
                  ypos: 50
                  text: 1U
                  styles:
                    font-size: 0.55em
                    font-weight: bold
                    text-anchor: middle
                    dominant-baseline: central
                    pointer-events: none
                    fill: |
                      [[[
                        const value = Number(item.id.split('--value-')[1]);

                        return Number(state) === value
                          ? 'var(--primary-background-color)'
                          : 'var(--primary-text-color)';
                      ]]]

                - id: history-hours--value-12
                  same_as: history-hours--value-1
                  same_as_dxpos: 16
                  text: 12U

                - id: history-hours--value-24
                  same_as: history-hours--value-12
                  same_as_dxpos: 16
                  text: 1D

                - id: history-hours--value-48
                  same_as: history-hours--value-24
                  same_as_dxpos: 16
                  text: 2D

                - id: history-hours--value-168
                  same_as: history-hours--value-48
                  same_as_dxpos: 16
                  text: 1W

                - id: history-hours--value-336
                  same_as: history-hours--value-168
                  same_as_dxpos: 16
                  text: 2W

    ```
