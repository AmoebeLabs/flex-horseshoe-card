# Local FHS Entity Click Routing

## Main Goal

Route actions from local FHS entities to their real Home Assistant source
entity without changing the action configured on the clicked item.

Every entity id starting with `fhs_` is local to the card. It does not exist in
Home Assistant and must never be passed to a Home Assistant more-info dialog or
another entity-targeted action.

## Local Sparkline Entities

Sparkline tools create local entities for these calculated statistics:

- `min`
- `avg`
- `max`
- `min_time`
- `max_time`

Their runtime entity configs contain `source_entity_index`, which points to the
configured Home Assistant entity from which the graph and statistics were
derived.

The runtime state attributes of `min`, `avg`, and `max` also contain
`source_entity_id` for state formatting. That attribute is intentionally absent
from `min_time` and `max_time`, so it cannot be the general source for click
routing.

## Central Action Routing

All normal layout tools already pass their clicked entity through
`BaseTool.handlePopup()` to `main.handlePopup()`. Source resolution therefore
belongs in `main.handlePopup()` and must not be duplicated in state, name, icon,
or other tools.

The action flow is:

1. Find the runtime config belonging to the clicked entity.
2. Retain the `tap_action` from that clicked config.
3. For an entity id starting with `fhs_`, read `source_entity_index` from the
   runtime config and resolve the corresponding Home Assistant entity.
4. Pass the source entity id to the central action handler.
5. Pass ordinary Home Assistant entity ids through unchanged.

This separates the action configuration from the action target: the local item
controls what happens, while its Home Assistant source controls which entity is
opened.

## Required Invariants

- A local `fhs_` entity id is never sent to Home Assistant.
- Every local `fhs_` entity config has a valid `source_entity_index`.
- The source entity is present in the card's normal entities list.
- Individual tools do not implement their own local-entity routing.
- Local state values and formatting remain unchanged.
- Navigate, call-service, and fire-dom-event handling remain unchanged.

## Verification

Build the project with `npm run build` and verify:

- clicking `min`, `avg`, or `max` opens more-info for the source sensor
- clicking `min_time` or `max_time` opens the same source sensor
- state, name, and icon tools use identical routing
- ordinary Home Assistant entities still open their own more-info dialog
- a local entity retains its explicitly configured `tap_action`
- navigate, call-service, and fire-dom-event actions remain unchanged
