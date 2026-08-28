---
template: main.html
title: Actions
description: Configure tap, hold, and double-tap actions on Flexible Horseshoe Card tools and controls.
tags:
  - Interaction
  - Actions
---

# Actions

Actions define what happens when someone taps, holds, or double-taps a tool or control.

## :material-horseshoe: Available actions

| Action | Result |
| --- | --- |
| `more-info` | Opens details for the connected entity. |
| `toggle` | Toggles an on/off entity. |
| `perform-action` | Runs a Home Assistant action. |
| `navigate` | Opens another dashboard path. |
| `url` | Opens a web address. |
| `assist` | Starts Home Assistant Assist. |
| `none` | Disables that gesture. |

| Gesture | Configuration |
| --- | --- |
| Tap | `tap_action` |
| Hold | `hold_action` |
| Double tap | `double_tap_action` |

## :material-horseshoe: Toggle an entity

```yaml linenums="1"
tap_action:
  action: toggle
```

Use this on a tool connected through `entity_index`.

## :material-horseshoe: Perform a Home Assistant action

```yaml linenums="1"
tap_action:
  action: perform-action
  perform_action: light.turn_on
  target:
    entity_id: light.hall
  data:
    brightness_pct: 50
```

## :material-horseshoe: Navigate or open a URL

=== "Navigate"

    ```yaml linenums="1"
    tap_action:
      action: navigate
      navigation_path: /lovelace/lights
    ```

=== "Open a URL"

    ```yaml linenums="1"
    tap_action:
      action: url
      url_path: https://www.home-assistant.io/
    ```

## :material-horseshoe: Run actions in sequence

```yaml linenums="1"
tap_action:
  actions:
    - action: toggle
    - action: navigate
      navigation_path: /lovelace/lights
```

## :material-horseshoe: Haptic feedback

```yaml linenums="1"
tap_action:
  haptic: selection
  action: toggle
```

Haptic feedback depends on support in the Home Assistant Companion app.

## :material-horseshoe: Related

- [Interactive controls](../tools/controls/controls-overview.md)
- [Entities](../card-basics/entities.md)
