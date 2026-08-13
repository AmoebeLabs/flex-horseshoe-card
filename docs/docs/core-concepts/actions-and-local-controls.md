---
template: main.html
title: Actions and Interactive Controls
description: Configure tap, hold, double-tap, haptic feedback, multiple actions, item overrides, and browser-local helper entities in the Flexible Horseshoe Card.
tags:
- Actions
- Haptics
- Interactive controls
- Helpers
- Entities
---

# Actions and interactive controls

Actions make entities and individual layout items interactive. FHS uses the current Home Assistant dashboard action format, so you can use familiar actions such as opening more information, toggling an entity, performing an action, navigating, opening a URL, or starting Assist.

!!! info "If an entity_index is defined, a tap action opens its more-info dialog by default."

## :material-horseshoe: At a glance

Actions define what happens when someone interacts with the card. Interactive
controls give you ready-made controls for common dashboard tasks.


### Available actions

!!! success "The supported actions should be compatible with the Home Assistant actions"


| Action           | Result                                                     |
| :--------------- | :--------------------------------------------------------- |
| `more-info`      | Opens the more-info dialog for an entity                   |
| `toggle`         | Toggles an entity between its on and off states            |
| `perform-action` | Runs a Home Assistant action with optional target and data |
| `navigate`       | Opens another dashboard path                               |
| `url`            | Opens a URL                                                |
| `assist`         | Starts Home Assistant Assist                               |
| `none`           | Disables the configured gesture                            |

### Available gestures: Tap, hold, and double tap

Each shape or entity supports three gestures:

| Gesture    | Configuration       | Default     |
| :--------- | :------------------ | :---------- |
| Tap        | `tap_action`        | `more-info` |
| Hold       | `hold_action`       | None        |
| Double tap | `double_tap_action` | None        |

!!! warning "Double tap delays the single tap action with 250msec"
    This is the time frame the double tap needs to detect double tap.

### Interactive controls

!!! info "The interactive controls are specifically made for the Flexible Horseshoe to support user interactions."

| Control  | Use it to                                           |
| :------- | :-------------------------------------------------- |
| `button` | Show configurable content and run tap, hold, or double-tap actions |
| `toggle` | Display and change an on/off state                  |
| `select` | Choose one option with configurable content in every segment |
| `number` | Increase or decrease a numeric value in fixed steps |
| `slider` | Set a single value or a lower and upper range       |

<video
controls
autoplay
muted
loop
playsinline
style="display: block; width: 100%; max-width: 400px; margin-inline: auto;"

>

  <source src="../../../assets/videos/2026.08.13-fhs-showcase-controls.mp4" type="video/webm">
</video>

## :material-horseshoe: Actions

### Where actions can be configured

Configure an action on an entity when every item using that entity should behave alike:

```yaml linenums="1"
entities:
  - entity: light.hall
    tap_action:
      action: toggle
```

Configure the action on a layout item when only that item should behave differently:

```yaml linenums="1"
layout:
  icons:
    - id: hall-light
      entity_index: 0
      xpos: 50
      ypos: 50
      tap_action:
        action: perform-action
        perform_action: light.turn_on
        target:
          entity_id: light.hall
        data:
          brightness_pct: 50
```

An action on the item takes priority over the action on its entity. An item connected to an entity opens more-info on tap when neither defines a tap action. Items without an entity respond only to actions configured on the item. When the same Home Assistant entity appears more than once in the `entities` list, the clicked item uses its exact `entity_index`.

Actions are available on horseshoes, entity parts, text items, icons, lines, circles, arcs, and rectangles. Standalone text defaults to `none`, while sparklines keep their pointer interaction for graph tooltips.


```yaml linenums="1"
entities:
  - entity: light.hall
    tap_action:
      action: toggle
    hold_action:
      action: more-info
    double_tap_action:
      action: perform-action
      perform_action: light.turn_on
      target:
        entity_id: light.hall
      data:
        brightness_pct: 100
```

### Performing a Home Assistant action

Use `perform-action` when you want to call a Home Assistant action:

```yaml linenums="1"
tap_action:
  action: perform-action
  perform_action: light.turn_on
  target:
    entity_id: light.hall
  data:
    brightness_pct: 50
```

Older FHS configurations that use `call-service`, `service`, `service_data`, or `fire-dom-event` are still supported.

### Multiple actions

FHS can run multiple actions in sequence. They run in the order listed. Each entry inside `actions` is a normal Home Assistant action:

```yaml linenums="1"
tap_action:
  actions:
    - action: perform-action
      perform_action: light.turn_on
      target:
        entity_id: light.hall
    - action: navigate
      navigation_path: /lovelace/lights
```

You can also use an `actions` list inside `hold_action` and `double_tap_action`.

### Haptic feedback

Supported Home Assistant Companion apps can provide immediate feedback when a gesture is handled. Add `haptic` to a single action or to an action list:

```yaml linenums="1"
tap_action:
  haptic: success
  actions:
    - action: toggle
    - action: more-info
```

This uses the Home Assistant Companion app's haptic feedback.

Available values are `success`, `warning`, `failure`, `light`, `medium`, `heavy`, and `selection`. Device support depends on the Home Assistant Companion app.

## :material-horseshoe: Interactive controls

Interactive controls give you ready-made buttons, toggles, selectors, number
steppers, and sliders. Connect a control to an entity when you want to show or
change its value. For commands, configure an action instead, for example to open
details or perform a Home Assistant action.

| Control  | Common entity source                                                  |
| :------- | :-------------------------------------------------------------------- |
| `button` | Any entity, or an explicit action target                              |
| `toggle` | Home Assistant on/off entity, `input_boolean`, or `fhs_input_boolean` |
| `select` | `select`, `input_select`, or `fhs_input_select`                       |
| `number` | `input_number` or `fhs_input_number`                                  |
| `slider` | A numeric entity or numeric entity attribute                          |

Use a Home Assistant entity when the state is part of your home, is used by
automations, or needs to be shared across devices. Use an FHS browser-local
helper when the value only affects how FHS cards look or behave in the current
browser.

### Button control

A button combines configurable content with tap, hold, and double-tap actions.

#### Button content

A button can show text, an icon, entity information, status indicators, a
horseshoe, or a sparkline. Choose the content and its arrangement with
`content.mode`:

| Mode                 | Result                                  |
| :------------------- | :-------------------------------------- |
| `content_text` | Text |
| `content_icon` | Icon |
| `content_horizontal` | Content arranged from left to right |
| `content_vertical` | Content arranged from top to bottom |

Horizontal and vertical content use an `items` list. Every item has an `id`
and `type`:

```yaml linenums="1"
content:
  mode: content_horizontal
  content_horizontal:
    padding: { x: 2, y: 1 }
    gap: 2
    items:
      - id: icon
        type: icon
        icon: mdi:gesture-tap-button
      - id: label
        type: text
        text: Run
```

Combine any of these visual items in the same list:

| Item type   | Shows                             |
| :---------- | :-------------------------------- |
| `icon`      | An entity icon or configured icon |
| `text`      | Configured text                   |
| `state`     | Entity value and unit             |
| `name`      | Entity name                       |
| `area`      | Entity area                       |
| `line`      | Compact status line               |
| `circle`    | Compact status circle             |
| `horseshoe` | Compact horseshoe visualization   |
| `sparkline` | Compact history visualization     |

```yaml linenums="1"
content:
  mode: content_vertical
  content_vertical:
    padding:
      x: 1
      y: { top: 1, bottom: 1 }
    gap: 0.5
    items:
      - id: icon
        type: icon
        size: 40
      - id: value
        type: state
        styles:
          font-size: 0.6em
      - id: status
        type: line
        length: 5
```

`padding` creates space around the complete content. `gap` controls the
distance between items. Each item can use `margin` with `top`, `right`,
`bottom`, and `left` to refine its position. Set `entity_index` on an item
to show data from another entity. The complete button responds to its configured
tap, hold, and double-tap actions.

### Toggle control

A toggle displays and changes an `on` or `off` state. Connect it to an
existing Home Assistant entity, an `input_boolean`, or a browser-local
`fhs_input_boolean`.

A toggle can optionally show an icon inside its moving knob:

```yaml linenums="1"
content:
  mode: content_icon
  content_icon:
    icon:
      icon: mdi:check
```

### Select control

A select lets someone choose one value from a list of options. Templates can
use the chosen value directly, for example `area`, `bar`, or a room name.

Use `fhs_input_select` for a choice that belongs to the dashboard:

```yaml linenums="1"
entities:
  - entity: fhs_input_select.chart_type
    options:
      - line
      - area
      - bar
      - dots
    initial: line

layout:
  controls:
    - id: chart-type
      type: select
      entity_index: 0
      xpos: 50
      ypos: 90
      width: 90
      height: 12
```

When `option_map` is omitted, the control reads the option list from the
entity. This works with local `fhs_input_select` entities, Home Assistant
Dropdown helpers (`input_select`), and Select entities supplied by Home
Assistant integrations (`select`). Selecting a segment immediately changes
the chosen option.

Use a Home Assistant helper to share the selection with automations and
multiple devices. Use `fhs_input_select` for browser-local choices such as
chart type, room, sensor, or history period.

#### Select content

Each select segment can show text, an icon, or both. The content configuration
sets the same arrangement for every segment:

```yaml linenums="1"
content:
  mode: content_vertical
  content_vertical:
    padding: { x: 1, y: 1 }
    gap: 1
    icon:
      size: 40
    text:
      styles:
        font-size: 0.6em
```

#### Example of rich content for buttons and select

- top row (rooms) with button text and line status indicator below button. The status indicator is shifted down using padding.
- second row contains the sensor buttons. An icon, state value and again the status indicator is shiftd down using padding.
- last row (history) just contains text that shows the history time frame

<video
controls
autoplay
muted
loop
playsinline
style="display: block; width: 100%; max-width: 720px; margin-inline: auto;"

>

  <source src="../../../assets/videos/fhs-demo-card-awair-selectable--dark.mp4" type="video/webm">
</video>

A select can also present live information in every segment. Use the same
`items`, `padding`, `gap`, and item `margin` settings as button content.
The entity referenced by the select's `entity_index` holds the chosen option.
`option_map[].entity_index` chooses the entity displayed inside one segment.

This example shows an icon, current value, and status line for every sensor:

```yaml linenums="1"
content:
  mode: content_vertical
  content_vertical:
    padding: { x: 0.5, y: { top: 1, bottom: 1 } }
    gap: 0.5
    items:
      - id: icon
        type: icon
        size: 40
      - id: value
        type: state
        styles:
          font-size: 0.55em
      - id: status
        type: line
        length: 4

option_map:
  - value: score
    entity_index: room_sensors[0]
  - value: temperature
    entity_index: room_sensors[1]
  - value: humidity
    entity_index: room_sensors[2]
```

Give an item its own settings for a specific option through
`option_map[].content`. The item id connects the override to the shared item:

```yaml linenums="1"
option_map:
  - value: score
    entity_index: room_sensors[0]
    content:
      status:
        show:
          item_style: colorstopinterpolated
        colorstopinterpolated:
          stroke: true
          fill: false
        color_stops:
          template:
            name: fhs_colorstops_awair_score
```

Add an `option_map` when an option needs another label, an icon, visual entity,
or additional action data. The `value` normally matches the entity option.
`text` and `icon` determine what that segment shows:

```yaml linenums="1"
option_map:
  - value: "off"
    text: Uit
    icon: mdi:fan-off
  - value: low
    text: Laag
    icon: mdi:fan-speed-1
  - value: medium
    text: Normaal
    icon: mdi:fan-speed-2
  - value: high
    text: Hoog
    icon: mdi:fan-speed-3
```

For most selects, `value` is all that is needed. The other fields refine
matching and presentation:

| Field   | Purpose                                                                   |
| :------ | :------------------------------------------------------------------------ |
| `value` | Value supplied to the select action; required in an explicit `option_map` |
| `state` | Entity state that selects this segment; defaults to `value`               |
| `text`  | Visible label; defaults to `value`                                        |
| `icon`  | Optional icon shown with the label                                        |

For example, `state: heating` can select a segment whose action uses
`value: heat`, while `text: Verwarmen` provides the visible label.

#### Use an option in another action

A select can also call an action on another entity. Use `option(value)` where
the selected value belongs in the action data:

```yaml linenums="1"
tap_action:
  action: perform-action
  perform_action: climate.set_hvac_mode
  target:
    entity_id: climate.living_room
  data:
    hvac_mode: option(value)
```

An option can carry additional values when an action needs more than the
selected state:

```yaml linenums="1"
option_map:
  - value: comfort
    text: Comfort
    action_data:
      temperature: 21

tap_action:
  action: perform-action
  perform_action: climate.set_temperature
  target:
    entity_id: climate.living_room
  data:
    temperature: option(action_data.temperature)
```

Write `option(...)` as the complete value of a YAML field. It can be used in
tap, hold, and double-tap actions, including ordered action lists.

### Number control

A number control lets someone decrease or increase a value with minus and plus
buttons. Connect it to an `input_number` or `fhs_input_number` to use its
minimum, maximum, and step.

### Slider control

A slider lets someone choose a numeric value by dragging or tapping. It can
show one value or a lower and upper range, using a linear or circular layout.

An explicit item, entity, or card action overrides a control's default action.

## :material-horseshoe: Browser-local helper entities

FHS browser-local helpers remember values for FHS cards, such as a selected
chart, room, visible label, or history period. Controls and templates can use
these values throughout the current browser.

Use `scope: card` when each card instance needs its own value. Use
`scope: global` to share a value between FHS cards in the same browser tab.
Global helpers can add `persist: true` to restore their value after a page
reload.

### Boolean helper: `fhs_input_boolean`

Use `fhs_input_boolean` for a browser-local on/off choice. Set `initial` to `true` or `false`; when omitted, the choice starts as `off`.

`scope: global` shares the state between FHS cards in the current browser tab. Add `persist: true` to restore the global state after a full page reload.

```yaml linenums="1"
entities:
  - entity: fhs_input_boolean.show_labels
    initial: true
    scope: global
    persist: true
```

Change the choice explicitly with an action:

```yaml linenums="1"
tap_action:
  action: perform-action
  perform_action: fhs_input_boolean.toggle
  target:
    entity_id: fhs_input_boolean.show_labels
```

The explicit services `fhs_input_boolean.turn_on` and `fhs_input_boolean.turn_off` are also supported. A plain `action: toggle` works when the selected entity is a local FHS boolean.

In templates, the value is `on` or `off`:

```yaml linenums="1"
visibility: |
  [[[ return state === 'on' ? 'visible' : 'hidden'; ]]]
```

A local boolean can be used in the same way as a real Home Assistant `input_boolean`; choose the local `fhs_input_boolean` entity when the state should remain inside the browser, or reference the real `input_boolean` when Home Assistant should own and synchronize the state across devices.

`icon`, `name`, `slot`, and `disabled` are supported. Without an explicit icon, FHS uses `mdi:toggle-switch`.

### Select helper: `fhs_input_select`

Use `fhs_input_select` for a browser-local choice from a fixed list. The
selected option can be used directly in templates and entity names.

```yaml linenums="1"
entities:
  - entity: fhs_input_select.awair_room
    options:
      - livingroom
      - bedroom
      - study
    initial: livingroom
```

For example, an Awair card can use the selected room directly:

```yaml linenums="1"
entity: |
  [[[
    const room = entities[entity_slots.input_room[0]].state;
    return `sensor.awair_element_${room}_score`;
  ]]]
```

| Option    | Default      | Description                                                               |
| :-------- | :----------- | :------------------------------------------------------------------------ |
| `options` | Required     | Non-empty list of unique strings available for selection                  |
| `initial` | First option | Option selected when the input is first created                           |
| `scope`   | `card`       | Keeps the value in one card, or shares it between FHS cards with `global` |
| `persist` | `false`      | Restores a global input after a page reload when set to `true`            |

The selected value must be one of the configured options. Quote YAML words such
as `on`, `off`, `yes`, and `no` when they should remain strings.

A select control changes the local input automatically. It can also be changed
explicitly:

```yaml linenums="1"
tap_action:
  action: perform-action
  perform_action: fhs_input_select.select_option
  target:
    entity_id: fhs_input_select.awair_room
  data:
    option: study
```

Use `scope: global` to share the selection between FHS cards in the same
browser tab, and add `persist: true` to restore it after a page reload. Choose
a Home Assistant Dropdown helper to use the selection in automations and across
devices.

### Number helper: `fhs_input_number`

Use `fhs_input_number` for a browser-local numeric value, such as a history period, offset, or display setting. Controls, layout items, and templates can use the value.

```yaml linenums="1"
entities:
  - entity: fhs_input_number.history_days
    initial: 1
    min: 1
    max: 14
    step: 1
    scope: global
    persist: true
```

| Option    | Default  | Description                                                                                      |
| :-------- | :------- | :----------------------------------------------------------------------------------------------- |
| `initial` | Required | Number used when the input is first created                                                      |
| `min`     | None     | Lowest accepted value. Existing inputs remain unbounded when it is omitted.                      |
| `max`     | None     | Highest accepted value. Existing inputs remain unbounded when it is omitted.                     |
| `step`    | `1`      | Amount used by `increment` and `decrement`.                                                      |
| `scope`   | `card`   | `card` keeps the value in one card; `global` shares it with FHS cards in the current browser tab |
| `persist` | `false`  | Restores a global input after a page reload when set to `true`                                   |

Set the value with the familiar `perform-action` format:

```yaml linenums="1"
tap_action:
  action: perform-action
  perform_action: fhs_input_number.set_value
  target:
    entity_id: fhs_input_number.history_days
  data:
    value: 7
```

Incrementing and decrementing use the configured step and clamp the result to the configured bounds:

```yaml linenums="1"
- entity: fhs_input_number.horseshoe_offset
  initial: 0
  min: -20
  max: 20
  step: 1

layout:
  rectangles:
    - id: offset-up
      tap_action:
        action: perform-action
        perform_action: fhs_input_number.increment
        target:
          entity_id: fhs_input_number.horseshoe_offset
    - id: offset-down
      tap_action:
        action: perform-action
        perform_action: fhs_input_number.decrement
        target:
          entity_id: fhs_input_number.horseshoe_offset
```

The same services can be used with the legacy action format:

```yaml linenums="1"
tap_action:
  action: call-service
  service: fhs_input_number.increment
  service_data:
    entity_id: fhs_input_number.horseshoe_offset
```

Every FHS card that should use a global input includes the same `fhs_input_number` in its own `entities` list. Those cards then update together, including while navigating between dashboards. Add `persist: true` to restore the latest value after a full page reload.

Add `persist: true` to a helper with `scope: global` to restore its latest value after a page reload. The stored value belongs to the current browser profile. Choose a Home Assistant helper to synchronize the value across browsers and devices.

### Using a helper in a template

A graph can read the input through its position in the `entities` list. This example treats the selected value as a number of days:

```yaml linenums="1"
period:
  type: rolling_window
  rolling_window:
    duration:
      hour: |
        [[[
          return Number(entities[0].state) * 24;
        ]]]
    bins:
      per_hour: 2
```

Connect a control with `entity_index`. In its style template, `state` contains the current helper value, which makes the active choice easy to show:

```yaml linenums="1"
layout:
  rectangles:
    - id: seven-days
      entity_index: 0
      xpos: 75
      ypos: 12
      width: 18
      height: 8
      tap_action:
        haptic: selection
        action: perform-action
        perform_action: fhs_input_number.set_value
        target:
          entity_id: fhs_input_number.history_days
        data:
          value: 7
      styles:
        fill: |
          [[[
            return Number(state) === 7
              ? 'var(--primary-color)'
              : 'var(--secondary-background-color)';
          ]]]
```

Graphs, labels, colors, visibility, and other templated options can respond to the helper value.