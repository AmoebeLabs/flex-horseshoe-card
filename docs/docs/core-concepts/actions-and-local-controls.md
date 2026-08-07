---
template: main.html
title: Actions and Local Controls
description: Configure tap, hold, double-tap, haptic feedback, multiple actions, item overrides, and browser-local controls in the Flexible Horseshoe Card.
tags:
  - Actions
  - Haptics
  - Local controls
  - Entities
---
# Actions and local controls

Actions make an entity or an individual layout item interactive. FHS follows the current Home Assistant dashboard action format, so familiar actions such as opening more information, toggling an entity, performing an action, navigating, opening a URL, or starting Assist use the same YAML.

A normal tap opens the entity's more-info dialog by default.

## :material-horseshoe: Where actions can be configured

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

The item action takes priority over the action on its entity. If neither is present, FHS uses the card action and then the default tap action. This also works when the same Home Assistant entity appears more than once in the `entities` list: the clicked item's exact `entity_index` is used.

Actions are available on horseshoes, entity parts, text items, icons, lines, circles, arcs, and rectangles. Standalone text defaults to `none`, while sparklines keep their pointer interaction for graph tooltips.

## :material-horseshoe: Button controls

A compact interactive button can be declared as a standalone control. This
replaces the repeated rectangle, text and icon items commonly used for
selectors:

```yaml
layout:
  controls:
    - id: history-period
      type: button
      mode: select
      entity_index: 0
      xpos: 50
      ypos: 50
      width: 80
      height: 14
      states:
        - value: 24
          text: 1D
        - value: 168
          text: 1W
      content:
        mode: text
        text_overflow:
          mode: fit
          fit:
            max_width: 18
      viz:
        select:
          indicator:
            fill: var(--primary-color)
        animation:
          duration: 200
          easing: ease
```

Button controls support `button`, `toggle`, `select` and `number`
modes. Toggle controls use the entity's Home Assistant `on` or `off`
state. Select controls use the matching `states[].value`; `input_select`
uses `select_option` and an FHS number input uses `set_value`. Number
controls render minus, value and plus content and use the entity's configured
step, minimum and maximum.

The button content can be text, an icon, or both horizontally or vertically.
Text content uses the normal TextTool pipeline, including fit, ellipsis, wrap,
styles and measurements. Labels support relative positions and offsets. A
button's explicit item, entity or card action overrides its mode-default action.

## :material-horseshoe: Tap, hold, and double tap

The same action format is available for all three gestures:

| Gesture | Configuration | Default |
| :------ | :------------ | :------ |
| Tap | `tap_action` | `more-info` |
| Hold | `hold_action` | None |
| Double tap | `double_tap_action` | None |

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

## :material-horseshoe: Home Assistant actions

| Action | Purpose |
| :----- | :------ |
| `more-info` | Opens the more-info dialog for the selected entity |
| `toggle` | Toggles the selected entity |
| `perform-action` | Performs a Home Assistant action with optional target and data |
| `navigate` | Opens another dashboard path |
| `url` | Opens a URL |
| `assist` | Starts Home Assistant Assist |
| `none` | Disables the gesture |

Use `perform-action` for service calls:

```yaml linenums="1"
tap_action:
  action: perform-action
  perform_action: light.turn_on
  target:
    entity_id: light.hall
  data:
    brightness_pct: 50
```

Existing FHS configurations using `call-service`, `service`, and `service_data` remain supported. Existing `fire-dom-event` actions also remain supported.

## :material-horseshoe: Multiple actions

FHS can run several actions in their listed order. Each entry inside `actions` is a normal Home Assistant action:

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

The `actions` list can also be used inside `hold_action` and `double_tap_action`.

## :material-horseshoe: Haptic feedback

Supported Home Assistant Companion apps can provide immediate feedback when a gesture is handled. Add `haptic` to a single action or to an action list:

```yaml linenums="1"
tap_action:
  haptic: success
  actions:
    - action: toggle
    - action: more-info
```

This uses Home Assistant's haptic event and does not require `browser_mod`.

Available values are `success`, `warning`, `failure`, `light`, `medium`, `heavy`, and `selection`. Device support depends on the Home Assistant Companion app.

## :material-horseshoe: Local number inputs

An `fhs_input_number` stores a small dashboard control value without creating a Home Assistant helper. It behaves as an entity inside the card, so layout items and JavaScript templates can use its current state.

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

| Option | Default | Description |
| :----- | :------ | :---------- |
| `initial` | Required | Number used when the input is first created |
| `min` | None | Lowest accepted value. Existing inputs remain unbounded when it is omitted. |
| `max` | None | Highest accepted value. Existing inputs remain unbounded when it is omitted. |
| `step` | `1` | Amount used by `increment` and `decrement`. |
| `scope` | `card` | `card` keeps the value in one card; `global` shares it with FHS cards in the current browser tab |
| `persist` | `false` | Restores a global input after a page reload when set to `true` |

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

```yaml
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

```yaml
tap_action:
  action: call-service
  service: fhs_input_number.increment
  service_data:
    entity_id: fhs_input_number.horseshoe_offset
```

Every FHS card that should use a global input includes the same `fhs_input_number` in its own `entities` list. Those cards then update together, including while navigating between dashboards. Add `persist: true` to restore the latest value after a full page reload.

Persistence is available only with `scope: global`. Card-scoped inputs can use the same entity name in several card instances, so storing them under that shared name would cause conflicts. The stored value remains local to the current browser profile. Synchronization between browsers or devices requires a Home Assistant helper.

## :material-horseshoe: Local boolean inputs

An `fhs_input_boolean` stores a local on/off state without creating a Home Assistant helper. Its runtime state follows Home Assistant and is either `on` or `off`. The optional `initial` value accepts `true` or `false`; when omitted, the input starts as `off`.

`scope: global` shares the state between FHS cards in the current browser tab. Add `persist: true` to restore the global state after a full page reload.

```yaml linenums="1"
entities:
  - entity: fhs_input_boolean.show_labels
    initial: true
    scope: global
    persist: true
```

Use the Home Assistant-compatible local services:

```yaml linenums="1"
tap_action:
  action: perform-action
  perform_action: fhs_input_boolean.toggle
  target:
    entity_id: fhs_input_boolean.show_labels
```

The explicit services `fhs_input_boolean.turn_on` and `fhs_input_boolean.turn_off` are also supported. A plain `action: toggle` works when the selected entity is a local FHS boolean.

Templates receive the runtime state as `on` or `off`:

```yaml linenums="1"
visibility: |
  [[[ return state === 'on' ? 'visible' : 'hidden'; ]]]
```

A local boolean can be used in the same way as a real Home Assistant `input_boolean`; choose the local `fhs_input_boolean` entity when the state should remain inside the browser, or reference the real `input_boolean` when Home Assistant should own and synchronize the state across devices.

`icon`, `name`, `slot`, and `disabled` are supported. Without an explicit icon, FHS uses `mdi:toggle-switch`.

## :material-horseshoe: Using a local input in a template

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

A control can use that same entity as its `entity_index`. Its style template then receives the current input as `state`, which makes an active choice easy to show:

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

This is the same dynamic configuration path used for Home Assistant entity updates. The graph, label, color, or any other templated option can react to the new value.
