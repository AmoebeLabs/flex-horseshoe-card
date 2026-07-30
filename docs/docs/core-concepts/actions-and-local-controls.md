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

Actions are available on horseshoes, entity parts, icons, lines, circles, arcs, and rectangles. Sparklines keep their pointer interaction for graph tooltips.

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
    scope: global
    persist: true
```

| Option | Default | Description |
| :----- | :------ | :---------- |
| `initial` | Required | Number used when the input is first created |
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

Every FHS card that should use a global input includes the same `fhs_input_number` in its own `entities` list. Those cards then update together, including while navigating between dashboards. Add `persist: true` to restore the latest value after a full page reload.

Persistence is available only with `scope: global`. Card-scoped inputs can use the same entity name in several card instances, so storing them under that shared name would cause conflicts. The stored value remains local to the current browser profile. Synchronization between browsers or devices requires a Home Assistant helper.

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
