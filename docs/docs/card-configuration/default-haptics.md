##:fhs-fhs-logo: Haptics
!!! Info "See: https://companion.home-assistant.io/docs/integrations/haptics/ for devices that support haptics"

The tool supports haptic feedback through `user_actions`/ `tap_action` definition

| Action | Haptic   | Description                                                                                                                    |
| ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Click  | `haptic` | Uses the haptic property defined in the `user_actions` definition of the tool. If not specified, a default of `medium` is used |

```yaml linenums="1" hl_lines="11"
tools:
  - type: icon
    position:
      cx: 10
      cy: 10
      align: center
      icon_size: 15
    entity_index: 0
    user_actions:
      tap_action:
        haptic: success
        actions:
          - action: more-info
```

Possible values for haptic feedback:

| Haptic    | Description                                                          |
| --------- | -------------------------------------------------------------------- |
| success   | Indicates that a task or action has completed.                       |
| warning   | Indicates that a task or action has produced a warning of some kind. |
| failure   | Indicates that a task or action has failed.                          |
| light     | Provides a physical metaphor that complements the visual experience. |
| medium    | Provides a physical metaphor that complements the visual experience. |
| heavy     | Provides a physical metaphor that complements the visual experience. |
| selection | Indicates that the selection is actively changing.                   |
