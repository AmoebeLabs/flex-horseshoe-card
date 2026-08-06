## :material-horseshoe: Haptic feedback

Supported Home Assistant Companion apps can provide feedback for a tap, hold, or double tap. Add `haptic` to the action configured on the item or its entity:

```yaml linenums="1"
tap_action:
  haptic: success
  action: more-info
```

The available values are `success`, `warning`, `failure`, `light`, `medium`, `heavy`, and `selection`. This uses Home Assistant's haptic event and does not require `browser_mod`.

See [Actions and Local Controls](../core-concepts/actions-and-local-controls.md) for item overrides, multiple actions, and gesture configuration.
