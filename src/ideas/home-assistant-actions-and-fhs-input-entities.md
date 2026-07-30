# Home Assistant Actions and FHS Input Entities

## Problem

FHS currently resolves a clicked entity configuration by entity id. That is
ambiguous when the same Home Assistant entity appears more than once, and a
layout item cannot override the action of its configured entity. The existing
handler also uses the older `call-service` format and handles only a single tap
action.

Dashboard controls sometimes need state that is relevant only to the current
card or browser tab. A typical example is one row of 1, 3, and 7 day buttons
that controls several history graphs. Creating and maintaining a persistent
Home Assistant helper for browser-local presentation state is unnecessary.

## Public configuration

An FHS number input uses the same entity model as a Home Assistant
`input_number` helper:

```yaml
entities:
  - entity: fhs_input_number.history_days
    initial: 1
    scope: global
```

`scope: card` keeps the value in one card. `scope: global` shares it between
FHS cards in the current browser tab. Global values reset after a full page
reload.

Actions use the current Home Assistant dashboard action format:

```yaml
tap_action:
  action: perform-action
  perform_action: fhs_input_number.set_value
  target:
    entity_id: fhs_input_number.history_days
  data:
    value: 7
```

FHS additionally accepts an ordered action list while every list entry remains
a normal Home Assistant action object:

```yaml
tap_action:
  actions:
    - action: perform-action
      perform_action: fhs_input_number.set_value
      target:
        entity_id: fhs_input_number.history_days
      data:
        value: 7
    - action: perform-action
      perform_action: light.turn_on
      target:
        entity_id: light.dashboard_indicator
      data:
        brightness_pct: 50
```

The singular and `actions:` forms are also supported by `hold_action` and
`double_tap_action`.

Supported Companion apps can provide immediate haptic feedback for any gesture:

```yaml
tap_action:
  haptic: success
  action: more-info
```

The same `haptic` option can wrap an ordered `actions:` list. FHS emits
Home Assistant's normal haptic event, so this does not require `browser_mod`.

## Architecture

1. The gesture layer turns mouse, touch, or keyboard interaction into `tap`,
   `hold`, or `double_tap` without knowing the configured action.
2. The routing layer selects the item action, entity action at the exact
   `entity_index`, card action, or tap default.
3. The execution layer handles Home Assistant action objects. Modern
   `perform-action` uses `perform_action`, `target`, and `data`; legacy
   `call-service` remains supported for existing cards.
4. The FHS input layer intercepts only
   `perform_action: fhs_input_number.set_value`. Every other action remains a
   Home Assistant action.
5. Changing an FHS input replaces its HA-shaped entity state and enters the
   existing configured-entity update pipeline exactly once. Tools, templates,
   styles, graph runtime configuration, and history code do not receive a
   special FHS-input path.

Global values live in a static map on the card class. A namespaced window event
notifies mounted cards containing the same global entity. Cards subscribe in
`connectedCallback()` and unsubscribe in `disconnectedCallback()`.

## Follow-up: generic local entity storage

Move FHS input ownership out of `main.js` into a cohesive
`FhsLocalEntityStore`. The store should own HA-shaped local entity records,
scope handling, value changes, and notifications. The card remains responsible
for actions, templates, and the normal entity/tool update pipeline.

The store starts with `fhs_input_number`, but its state and notification model
must not depend on number-specific behavior. This leaves room for future local
input types without adding another static map and event route to the card.

Proposed scopes:

- `card`: private to one card; `initial` remains required;
- `global`: shared by FHS cards in the current loaded page and retained across
  Lovelace view switches;
- `browser`: shared like `global`, but persisted in namespaced `localStorage`.

For shared entities, one owner card may provide `initial`; consumer cards only
reference the entity and scope. The first available initial value seeds a new
entity and publishes the same update used by `set_value`. It must not overwrite
an existing global or stored value. If neither persisted state nor `initial`
exists, the local entity remains `unknown` until a card sets it.

Browser persistence is local to one Home Assistant origin and browser profile.
Desktop browsers and Companion App WebViews therefore retain their own values
but do not synchronize with each other. Cross-device state continues to require
a real Home Assistant helper. The normal custom window event handles cards in
the current page; the browser `storage` event can synchronize other tabs using
the same origin.

## Action behavior

FHS supports the current Home Assistant action types: `more-info`, `toggle`,
`perform-action`, `navigate`, `url`, `assist`, and `none`. Existing
`call-service` and `fire-dom-event` configurations remain compatible.

The optional `haptic` value is emitted before the selected action list. Values
follow the Home Assistant Companion app names: `success`, `warning`, `failure`,
`light`, `medium`, `heavy`, and `selection`.

Action precedence is evaluated separately for tap, hold, and double tap:

1. layout item;
2. configured entity at `entity_index`;
3. card;
4. default `more-info` for tap only.

Hold and double tap are enabled only when configured. Gesture timing follows
Home Assistant: a 500 ms hold and a 250 ms double-tap window. Confirmation is
not part of this implementation.

## Compatibility and testing

Cards without item actions or FHS inputs retain their existing behavior.
Testing must cover duplicate entity ids, item overrides, singular and ordered
actions, all supported action types, mouse and touch gestures, local inputs,
global synchronization, active-button styling, listener cleanup, existing
JavaScript templates, and representative horseshoe and sparkline cards.

Dynamic graph duration remains part of the existing template and graph
pipeline. This feature does not add graph-specific history invalidation.
