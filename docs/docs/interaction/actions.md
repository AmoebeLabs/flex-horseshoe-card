---
template: main.html
title: Actions
description: Configure tap, hold, and double-tap actions on card tools and controls.
tags:
  - Interaction
  - Actions
---
# Actions

An action defines what happens when the user taps, holds, or double-taps an actionable item. The same action format is used by layout tools and controls.

This page lists every generic action value, the fields each action uses, and the special action shorthands that belong only to Number and Slider controls.

## :material-horseshoe: Add an action to an item

Use `tap_action`, `hold_action`, or `double_tap_action` on the item that should respond:

```yaml linenums="1"
entities:  # Entities used by this example
  - entity: light.living_room

layout:
  states:
    - entity_index: 0
      xpos: 50
      ypos: 50
      tap_action:
        action: more-info
      hold_action:
        action: toggle
      double_tap_action:
        action: none
```

`more-info` opens the entity details, `toggle` toggles the selected entity, and `none` makes that gesture do nothing.

## :material-horseshoe: Generic action values

These values can be used in normal `tap_action`, `hold_action`, and `double_tap_action` configuration:

| Action | What happens | Main extra field(s) |
| --- | --- | --- |
| `none` | Nothing happens for that gesture. | None |
| `more-info` | Opens Home Assistant's details dialog for the selected entity. | None |
| `toggle` | Toggles the selected on/off entity. | None |
| `perform-action` | Runs a Home Assistant action/service. | `perform_action`, optionally `target` and `data` |
| `call-service` | Runs a Home Assistant service using the compatible service form. | `service`, optionally `target` and `service_data` |
| `navigate` | Opens another Home Assistant dashboard path. | `navigation_path`, optionally `navigation_replace` |
| `url` | Opens a web address. | `url_path` |
| `assist` | Starts Home Assistant Assist. | Optionally `pipeline_id`, `start_listening` |
| `fire-dom-event` | Fires the configured Home Assistant/custom-card event action. | Additional event fields required by the receiving integration/card |
| `select-option` | Writes `option` to Select/Input select. The same router also writes a numeric `option` value to Input number/local number targets. | `option` |

## :material-horseshoe: Run a Home Assistant action

Use `perform-action` with `perform_action`:

```yaml linenums="1"
entities:  # Entities used by this example
  - entity: light.living_room

layout:
  states:
    - entity_index: 0
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

`call-service` is the compatible service form and uses `service:` plus `service_data:` instead of `perform_action:` plus `data:`.

## :material-horseshoe: Navigate or open a URL

`navigate` uses `navigation_path`. Set `navigation_replace: true` when the new path should replace the same Home Assistant client-history entry instead of adding another one:

```yaml linenums="1"
entities:  # Entities used by this example
  - entity: light.living_room

layout:
  states:
    - entity_index: 0
      xpos: 50
      ypos: 50
      tap_action:
        action: navigate
        navigation_path: /lovelace/lights
```

`url` uses `url_path`:

```yaml linenums="1"
entities:  # Entities used by this example
  - entity: light.living_room

layout:
  states:
    - entity_index: 0
      xpos: 50
      ypos: 50
      tap_action:
        action: url
        url_path: https://www.home-assistant.io/
```

## :material-horseshoe: Select an option

Use `select-option` when an action should choose one option on the selected Select/Input select entity:

```yaml linenums="1"
entities:  # Entities used by this example
  - entity: input_select.mode

layout:
  states:
    - entity_index: 0
      xpos: 50
      ypos: 50
      tap_action:
        action: select-option
        option: Eco
```

## :material-horseshoe: Run several actions in order

Use `actions` when one gesture should run several actions sequentially:

```yaml linenums="1"
entities:  # Entities used by this example
  - entity: light.living_room

layout:
  states:
    - entity_index: 0
      xpos: 50
      ypos: 50
      tap_action:
        actions:
          - action: toggle
          - action: navigate
            navigation_path: /lovelace/lights
```

## :material-horseshoe: Target another entity

An item normally acts on the entity selected by that item. Set `entity` inside the action when the action should target another entity instead:

```yaml linenums="1"
entities:  # Entities used by this example
  - entity: light.living_room

layout:
  states:
    - entity_index: 0
      xpos: 50
      ypos: 50
      tap_action:
        action: toggle
        entity: light.hall
```

## :material-horseshoe: Add haptic feedback

Set `haptic` in the action when supported by the Home Assistant Companion app:

```yaml linenums="1"
entities:  # Entities used by this example
  - entity: light.living_room

layout:
  states:
    - entity_index: 0
      xpos: 50
      ypos: 50
      tap_action:
        action: toggle
        haptic: selection
```

## :material-horseshoe: Number and Slider action shorthands

`increment` and `decrement` are **not** generic actions. They are special shorthand values for the minus/plus actions of a Number control.

A Slider has its own `set_value_action`. Its default shorthand is `set-value`. Do not use `set-value` as a normal tap, hold, or double-tap action elsewhere.

See [Number control](../tools/controls/number-tool.md) and [Slider](../tools/controls/slider-tool.md) for their complete configuration.

## :material-horseshoe: Related

- [Interactive controls](../tools/controls/controls-overview.md)
- [Entities](../card-basics/entities.md)
- [Visibility](visibility.md)
