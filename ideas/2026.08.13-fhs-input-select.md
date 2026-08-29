# Flexible Horseshoe Card input select

## Goal

Use meaningful option states instead of numeric indexes for local selections,
while keeping the select control generic enough to drive any Home Assistant
service.

## Entity configuration

```yaml
- entity: fhs_input_select.chart_type
  slot: chart_type
  options: [line, area, bar, dots]
  initial: line
  scope: global
  persist: true
```

- `options` is a non-empty list of unique strings.
- `initial` defaults to the first option and must belong to `options`.
- `scope` supports `card` and `global`; persistence requires global scope.
- The runtime entity state is the selected string and `attributes.options`
  contains the complete list.

## Select option semantics

```yaml
option_map:
  - state: heating
    value: heat
    text: Heating
    icon: mdi:fire
```

- `state` matches the entity state or configured entity attribute.
- `state` defaults to `value`.
- `value` is supplied to actions.
- `text` defaults to `value` and is presentation only.
- Without `option_map`, segments are built from `entity.attributes.options`.

## Generic actions

```yaml
tap_action:
  action: perform-action
  perform_action: climate.set_hvac_mode
  target:
    entity_id: climate.living_room
  data:
    hvac_mode: option(value)
```

An exact `option(path)` scalar reads data from the pressed option while
preserving its datatype. It works in tap, hold and double-tap actions, including
action lists. The standard `select-option` action remains available for Home
Assistant `select`, `input_select`, local `fhs_input_select`, and existing
number-backed select controls.

## Acceptance

- Local card and global select state follow the normal card Hass pipeline.
- Global state and persistence synchronize between cards.
- Runtime changes to `attributes.options` rebuild only the select segments.
- State/value differences, entity attributes and nested option references are
  covered by automated tests.
- Existing number-backed select controls remain compatible.
