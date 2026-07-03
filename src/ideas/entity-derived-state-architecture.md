# Entity Derived State Architecture

## Goal

Add one central entity-level place where FHS can derive a visual runtime state from the original Home Assistant state.

This avoids repeating the same `state_map`, conversion, rank mapping, or JavaScript template on every shape/tool that needs a numeric or transformed value.

## Core Idea

Each configured entity can have two states inside FHS:

- `raw_state`: the original Home Assistant state or configured attribute value.
- `derived_state`: an optional FHS-only visual state derived from the raw state.

The Home Assistant entity is never changed. This is only card-internal runtime data.

## Why Entity-Level

Without entity-level derived state, every visual item needs its own conversion:

```yaml
arcs:
  - entity_index: 0
    color_stops:
      ...
    state_map:
      ...

rectangles:
  - entity_index: 0
    color_stops:
      ...
    state_map:
      ...
```

With entity-level derived state, the entity is converted once during `set hass`, and all visual tools use that value:

```yaml
entities:
  - entity: sensor.pollen_level
    derived_state:
      state_map:
        type: state_value
        map:
          - state: low
            value: 0
          - state: moderate
            value: 1
          - state: high
            value: 2
```

Then all shapes can use normal color stops:

```yaml
arcs:
  - entity_index: 0
    color_stops:
      colors:
        - value: 0
          color: green
        - value: 1
          color: yellow
        - value: 2
          color: red
```

## Runtime Model

During `set hass`, FHS builds an entity runtime context.

Proposed runtime fields:

The runtime object should be named `fhsEntityState` in code.

```js
{
  entityId: 'sensor.pollen_level',
  stateObj,
  rawState: 'moderate',
  rawUnit: undefined,
  state: 1,
  unit: 'level',
  colorStops,
  hasDerivedState: true
}
```

Meaning:

- `entityId` is the Home Assistant entity id.
- `stateObj` is the original Home Assistant state object.
- `rawState` is what Home Assistant provided, or the configured attribute value.
- `rawUnit` is the original unit if available.
- `state` is the visual state used by tools by default.
- `unit` is the unit belonging to the visual state.
- `colorStops` is the optional entity-level default color-stop config.
- `hasDerivedState` tells renderers/debugging that conversion happened.

If no `derived_state` is configured, `state` equals `rawState` and `unit` equals `rawUnit`.


## Naming Rules

YAML/config uses lowercase names with underscores where needed:

```yaml
derived_state:
color_stops:
item_style:
stops_start:
```

JavaScript/runtime objects use camelCase:

```js
fhsEntityState.rawState
fhsEntityState.rawUnit
fhsEntityState.colorStops
fhsEntityState.hasDerivedState
```

Do not name the runtime object `entityObj`, because that can be confused with the original Home Assistant entity/state object. Use `fhsEntityState` for the FHS runtime state context.

## Config Forms

### State Map

String state to numeric visual value:

```yaml
entities:
  - entity: sensor.pollen_level
    name: Pollen
    derived_state:
      state_map:
        type: state_value
        map:
          - state: low
            value: 0
          - state: moderate
            value: 1
          - state: high
            value: 2
      unit: level
```

### Convert Expression

Simple numeric conversion:

```yaml
entities:
  - entity: sensor.energy_wh
    name: Energy
    derived_state:
      convert: state / 1000
      unit: kWh
```

Here `state` means the raw numeric state or attribute value.

### JavaScript Template

For advanced cases:

```yaml
entities:
  - entity: sensor.energy_wh
    name: Energy
    derived_state:
      template: |
        return {
          state: Number(state) / 1000,
          unit: 'kWh'
        };
```

The template can return either a primitive value or an object:

```js
return 42;
```

or:

```js
return {
  state: 42,
  unit: 'kWh'
};
```

## Tool Behavior

Tools should not know how the value was derived.

Tools should ask for the entity runtime state and use:

- `state` for visual calculations;
- `unit` for visual derived unit if that tool renders the visual state;
- `raw_state` only when explicitly rendering the original Home Assistant value.

This helps:

- `color_stops`
- shapes
- horseshoes
- ranking displays
- future runtime gradients using `color_stop`

## Color Stops

With derived state, generic shape color stops can remain simple:

```yaml
color_stops:
  colors:
    - value: 0
      color: green
    - value: 1
      color: yellow
    - value: 2
      color: red
```

The color stop code receives a numeric visual state, regardless of whether it came from a raw numeric state, a state map, or a conversion.


## Entity-Level Color Stops

Entities can also define default `color_stops` for every visual item that uses that entity.

```yaml
entities:
  - entity: sensor.pollen_level
    derived_state:
      state_map:
        type: state_value
        map:
          - state: low
            value: 0
          - state: moderate
            value: 1
          - state: high
            value: 2
      unit: level

    color_stops:
      colors:
        - value: 0
          color: green
        - value: 1
          color: yellow
        - value: 2
          color: red
```

Item-level `color_stops` still override entity-level `color_stops`.

The entity-level config only defines reusable visual data. The item decides whether to use it.

## Item Style Selection

Generic layout items can use `show.item_style` to choose how their visual color is determined.

```yaml
layout:
  arcs:
    - entity_index: 0
      show:
        item_style: colorstop
```

Proposed values:

```yaml
show:
  item_style: none               # do not apply automatic item color
  item_style: colorstop          # use the runtime color from color_stops
  item_style: colorstop_gradient # future: use color stop gradient output
  item_style: fixed              # future/optional: explicitly use configured/default styles only
  item_style: inherit            # future/optional: use entity/card default behavior
```

This follows the existing horseshoe pattern where config can exist independently from `show` options. It also keeps templates useful: a template can provide entity defaults and color stops, while each item can override `show.item_style`.


## Default Behavior

Entity-level derived state and color stops are reusable data. They must not automatically restyle every item.

Default rule:

```yaml
show:
  item_style: none
```

This preserves existing behavior:

- FHS applies no automatic item color;
- existing cards keep using their configured `styles`;
- animations remain free to style the item;
- tool defaults remain active;
- `names`, `areas`, and `states` do not suddenly inherit entity color stops;
- entity-level `color_stops` are passive until an item explicitly opts in.

Items opt in like this:

```yaml
show:
  item_style: colorstop
```

Templates can opt in for specific visual item templates, while text-oriented templates can keep `none`.

This keeps the configuration simple: define derived state and color stops once at entity level, then decide per item whether those visual defaults are used.

## Units

A derived state can have its own unit:

```yaml
derived_state:
  convert: state / 1000
  unit: kWh
```

This keeps the raw entity unit available while allowing the visual state to use a different unit.

## Scope

This should be implemented in a separate branch/PR.

It is not part of the masks/clips PR.

## Open Decisions

- Final field name: `derived_state`, `visual_state`, or another name.
- Whether state text renderers default to raw state or derived state.
- Whether templates can access all entities or only the current entity context.
- Whether `convert` should be a JavaScript expression or a smaller controlled expression syntax.
