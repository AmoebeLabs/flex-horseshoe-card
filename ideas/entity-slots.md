# Entity slots

## Problem

Flexible Horseshoe Card keeps all configured entities in one flat entities[] list. Layout items can use entity_index, but a large list becomes difficult to maintain when template-owned default_entities, local Flexible Horseshoe Card inputs, dynamically selected entities, and extra card entities are combined.

A small change in that list can shift many indices and force the user to update unrelated layout configuration. Comments such as "room score entities start at 4" are fragile documentation rather than a stable reference.

## Goal

Add optional named slots as a configuration-layer alias for the existing flat entity list. Slots make related entities addressable by a local index without creating a second runtime entity collection.

Existing configurations must continue to work unchanged.

## Public configuration

An entity can start or change the active slot:

```yaml
entities:
  - entity: fhs_input_number.awair_sensor
    slot: inputs
  - entity: fhs_input_number.history_hours
  - entity: fhs_input_number.awair_room

  - entity: sensor.awair_element_study_score
    slot: room_sensors
  - entity: sensor.awair_element_study_temperature
  - entity: sensor.awair_element_study_humidity
```

The slot is sticky. The first entity in inputs is inputs[0]; following entities remain in that slot until another slot is specified. The next entity in room_sensors starts at room_sensors[0].

slot: default explicitly switches back to the default slot. A slot is never reset when it is encountered again; its next entity is appended to the existing local sequence.

Entities without any slot declaration use the default slot. This preserves the existing behavior for all current configurations.

Layout items may use either form:

```yaml
# Existing flat index; unchanged behavior.
entity_index: 7

# Named slot reference.
entity_index: room_sensors[1]
```

Animation targets use the same address syntax. The existing flat form remains valid:

```yaml
animations:
  entity.3: [...]
  entity.room_sensors[1]: [...]
```

Both forms are converted to the final flat runtime key before animation processing.

Slot names are simple identifiers such as inputs, sensors, rooms, or room_sensors.

## Flat runtime contract

The final entity list remains one flat array. For example:

```text
entities[]:       input, input, input, selected, score, score, score, sensor, sensor
flat index:       0,     1,     2,     3,        4,     5,     6,     7,      8
slot:             inputs inputs inputs selected  scores scores scores sensors sensors
local index:      0      1      2      0        0      1      2      0       1
```

Tools receive only the final flat index. This keeps actions, more-info, Flexible Horseshoe Card input routing, sparkline history, formatting, and the graph engine unchanged.

A named slot is only an address map:

```js
entity_slots = {
  inputs: [0, 1, 2],
  selected: [3],
  scores: [4, 5, 6],
  sensors: [7, 8],
};
```

JavaScript can use the existing state array through that map:

```js
entities[entity_slots.sensors[0]].state;
```

No second state collection is created.

## Entity-id references

entity: sensor.temperature keeps its current meaning. Flexible Horseshoe Card resolves the entity id against the final flat list and stores the resulting flat index internally.

This works regardless of the entity's slot. Duplicate entity ids remain ambiguous and require an explicit numeric or slot-based entity_index.

## Same-as deltas

same_as_dentity_index remains backwards compatible for numeric indices:

```yaml
entity_index: 7
same_as_dentity_index: 1
```

The result is flat index 8.

For a slot reference, the delta applies inside that slot:

```yaml
- id: sensor--value-0
  entity_index: room_sensors[0]

- id: sensor--value-1
  same_as: sensor--value-0
  same_as_dentity_index: 1
```

The second item resolves to room_sensors[1], and only afterwards to its flat index.

The configuration layer keeps the symbolic address until compounds and SameAs processing are complete. Internally an address is treated uniformly as either a flat address or a slot address; tools never see that intermediate form.

An explicit entity_index on a child overrides the inherited address and any same-as delta.

## Default entities

Default entities are merged before slot indices are finalized.

Normal entity fields may still be overridden by the explicit card configuration. The slot is identity metadata and is not an ordinary merge field:

- a default entity's slot remains authoritative;
- an explicit entity without a slot keeps the default entity's slot;
- an explicit conflicting slot for the same entity id is a configuration error;
- unmatched defaults participate in the final entity order and slot sequence.

This prevents a template override from silently moving a fixed entity to another slot while layout references still point to the original slot.

## Configuration-layer changes

The implementation is intentionally narrow:

- card-templates.js: preserve and validate slot ownership during default_entities merging;
- main.js: build the final slot-to-flat-index map, resolve slot-based entity_index values, and expose the map to the template context;
- templates.js: expose entity_slots alongside the existing entities context;
- same-as.js and compound compilation: retain symbolic slot addresses until same-as inheritance and deltas are complete.

No changes are required in layout tools, action execution, sparkline history, or the graph engine.

## Validation and tests

- Legacy cards without slots retain identical flat indices and behavior.
- Sticky slots append local indices, including when a slot is revisited later.
- slot: default switches the active slot without clearing previous entries.
- Slot references resolve correctly in normal layout items and compound children.
- Numeric indices retain flat-index semantics.
- Entity-id references continue to resolve correctly.
- Default entity overrides preserve slot ownership and reject conflicts.
- Slot-aware and numeric same_as_dentity_index both resolve correctly.
- More-info and Flexible Horseshoe Card input actions target the same entities as before.
- Invalid slot names, missing slots, and out-of-range local indices produce clear configuration errors.
- Run npm run lint and npm run build.

## Assumptions

- slot names are simple identifiers such as inputs, sensors, and rooms;
- a slot index uses bracket notation: sensors[0];
- numeric entity_index values always mean flat indices;
- entity remains exclusively an entity-id reference.
