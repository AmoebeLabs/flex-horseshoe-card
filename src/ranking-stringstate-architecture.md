# Ranking Stringstate Architecture

## Goal

Some sensors, like Awair-style grading, have a numeric value but should be shown as ranked string states.

Example:

- very bad
- bad
- below average
- average
- good

The numeric thresholds and colors already belong in `color_stops`. Therefore `color_stops` should determine the active rank.

The textual meaning of a rank belongs in `state_map`. That keeps the color-stop config reusable for shapes and prevents repeating the same string state on every threshold.

Labels and label styles do not belong in this `state_map`. They stay in the existing `horseshoe_labels.stringstate_level` or `horseshoe_labels.stringstate_mode` config.

## Current Stringstate Behavior

The current horseshoe string-state implementation already works with:

```yaml
horseshoe_state:
  mode: stringstate_level
```

or:

```yaml
horseshoe_state:
  mode: stringstate_mode
```

Those modes use `state_map.map` as runtime input.

The current meaning is:

- `stringstate_mode`: only the current state segment is active.
- `stringstate_level`: the current state segment and all lower/before states are active.

The current renderer and label builder already know how to work with:

- `state_map.map`
- `runtimeConfig.mapped_state`
- `before`
- `current`
- `after`

That should stay intact.

## State Map Owns The Mapping Type

The mapping strategy belongs in `state_map`, because that is where the mapping data lives.

`horseshoe_state.mode` remains display-only. It decides how the mapped state is rendered.

```yaml
horseshoe_state:
  mode: stringstate_level
```

`state_map.type` decides how the active mapped state is found.

That means the state-map processing function can always look at one config object and know what to do:

```text
state_map.type + state_map.map -> mapped_state
```

The `type` name describes the primary lookup direction as `inputField_outputField`. The lookup returns the whole matching entry, not only the output field.

Examples:

```text
state_value = find map entry by state, primary output is value
rank_state  = find map entry by rank, primary output is state
state_icon  = find map entry by state, primary output is icon
```

The basic lookup is therefore generic:

```text
inputField, outputField = state_map.type.split("_")
entry = state_map.map.find(item[inputField] == inputValue)
outputValue = entry[outputField]
```

The important part is that `entry` remains available as the mapped result. Existing maps already rely on this, for example icon maps can contain `state`, `value`, `icon`, styles, and other fields in the same record. Returning the whole entry keeps that behavior extensible.

No separate flag is needed in `horseshoe_state` or `color_stops`.

## Type: state_value

`state_value` is the current/default behavior. If `type` is missing, it behaves as `state_value`.

```yaml
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

Flow:

```text
raw Home Assistant string state
        |
        v
state_map.map lookup by state
        |
        v
mapped numeric value
        |
        v
existing stringstate rendering
```

Use this when Home Assistant already provides textual states.

## Type: rank_state

`rank_state` is the new ranked color-stop behavior.

```yaml
state_map:
  type: rank_state
  map:
    - rank: 0
      state: good
    - rank: 1
      state: average
    - rank: 2
      state: below_average
    - rank: 3
      state: bad
    - rank: 4
      state: very_bad
```

Flow:

```text
raw Home Assistant numeric value
        |
        v
color_stops threshold lookup
        |
        v
active rank
        |
        v
state_map.map lookup by rank
        |
        v
canonical string state
        |
        v
existing stringstate rendering
```

Use this when the entity is numeric, but the display should behave as ordered string states.

For this type:

- `color_stops.colors[].rank` is the external key from threshold to rank.
- `state_map.map[].rank` is the key from rank to canonical state.
- `state_map.map[].state` is the canonical string state.
- `state_map.map[].value` is not needed in YAML.

The runtime still derives an internal `value` from the order in `state_map.map`, because the current string-state renderer compares values internally. That `value` is a compatibility value, not user config.

## Preferred YAML Shape

```yaml
horseshoe_state:
  mode: stringstate_level

color_stops:
  colors:
    - value: -1000
      color: '#e63740'
      rank: 4
    - value: 9
      color: '#fb8600'
      rank: 3
    - value: 11
      color: '#faaa00'
      rank: 2
    - value: 17
      color: '#fdd125'
      rank: 1
    - value: 18
      color: '#49ce4c'
      rank: 0
    - value: 25.001
      color: '#fdd125'
      rank: 1
    - value: 26.001
      color: '#faaa00'
      rank: 2
    - value: 31.001
      color: '#fb8600'
      rank: 3
    - value: 33.001
      color: '#e63740'
      rank: 4

state_map:
  type: rank_state
  map:
    - rank: 0
      state: good
    - rank: 1
      state: average
    - rank: 2
      state: below_average
    - rank: 3
      state: bad
    - rank: 4
      state: very_bad
```

In this shape:

- `color_stops.colors[].value` defines the numeric thresholds.
- `color_stops.colors[].color` defines the visual color for that threshold.
- `color_stops.colors[].rank` defines the grade for that numeric range.
- `state_map.type: rank_state` selects the reverse lookup path.
- `state_map.map[].rank` links a rank to a canonical string state.
- `state_map.map[].state` is the canonical string state name.

This avoids `stringstate` inside every color stop and avoids duplicate `value` fields in the user config.

## Label Config Stays Separate

Labels and label styles stay in the existing string-state label config.

Example:

```yaml
horseshoe_labels:
  stringstate_level:
    current:
      styles:
        - font-weight: bold
    state_map:
      map:
        - state: good
          label: Good
          styles:
            - fill: black
        - state: average
          label: Average
        - state: below_average
          label: Below average
        - state: bad
          label: Bad
        - state: very_bad
          label: Very bad
```

This keeps the current separation:

- global rank-to-state mapping lives in `state_map`.
- label text and label styling live in `horseshoe_labels.stringstate_level` or `horseshoe_labels.stringstate_mode`.

## Active State Lookup

For ranked color stops, the active state is found in two steps.

First, find the active color-stop interval for the numeric value.

Example:

```text
sensor value = 22
active color stop = value 18, rank 0, color #49ce4c
```

Then find the state-map entry with the same rank:

```yaml
mapped_state:
  rank: 0
  state: good
  color: '#49ce4c'
```

The active color from the color stop can be copied into the runtime mapped state. That gives the existing state path and label builders access to the same color without making them perform threshold matching.

## Runtime State Map

For the renderer, the runtime structure should still look like the existing `state_map.map`.

Configured YAML:

```yaml
state_map:
  type: rank_state
  map:
    - rank: 0
      state: good
    - rank: 1
      state: average
    - rank: 2
      state: below_average
```

Runtime shape:

```yaml
state_map:
  type: rank_state
  map:
    - rank: 0
      state: good
      value: 0
      color: '#49ce4c'
    - rank: 1
      state: average
      value: 1
      color: '#fdd125'
    - rank: 2
      state: below_average
      value: 2
      color: '#faaa00'
```

The user does not configure `value` for `rank_state`. It is an internal compatibility value for the current string-state implementation.

The existing string-state code can then calculate `before`, `current`, and `after` by comparing the order of `state_map.map` with `mapped_state.value`.

No renderer-specific rank logic is needed.

## Normal Color Stops Versus Ranked Stringstate

Normal color-stop rendering remains unchanged.

```text
numeric value -> color_stops -> color
```

Ranked string-state rendering is only active when explicitly configured.

```text
numeric value -> color_stops -> rank -> state_map(type: rank_state) -> stringstate rendering
```

That distinction matters because a normal gradient or segmented scale should still use the real numeric thresholds. Only the string-state display should group by rank.

## Where This Should Live

The correct place is after `ColorStops.normalize(...)` and before `horseshoe-shapes.js` builds paths and labels.

That means the hook should be in the horseshoe runtime state preparation, close to:

- `normalizeRuntimeConfig(...)`
- `getGaugeStateData(...)`

That layer already decides:

- the active numeric value
- the active `mapped_state`
- the runtime `state_map`
- the normalized `colorStops`

The renderer should not receive raw ranking logic. It should receive the same kind of runtime data it already receives today.

## Why Not Put This In The Renderer

The renderer should only render final paths and styles.

If rank matching is done in the renderer, the same logic would need to be repeated for:

- state paths
- labels
- label backgrounds
- tick/background segments
- future shapes

That is exactly what the current architecture tries to avoid.

## Why Not Replace Current Stringstate Modes

The current `stringstate_mode` and `stringstate_level` already solve the display problem once a mapped state exists.

Ranking from color stops should only produce that mapped state. It should not create a second string-state implementation.

That keeps:

- `before/current/after`
- label style overrides
- state-specific label styles
- mode versus level behavior

working exactly as they do now.

## Scope For First Implementation

The generic `inputField_outputField` model explains the direction, but the first implementation should only use it for the horseshoe `rank_state` case.

Existing tools that already support `state_map`, such as icons, must not be changed by this work.

Existing config like this must keep its current behavior:

```yaml
state_map:
  map:
    - state: low
      icon: mdi:leaf
    - state: high
      icon: mdi:alert
```

The first implementation scope is only:

```yaml
horseshoe_state:
  mode: stringstate_level

state_map:
  type: rank_state
  map:
    - rank: 0
      state: good
    - rank: 1
      state: average
```

So:

- `type` remains optional.
- missing `type` keeps existing behavior.
- existing icon/state map behavior is not migrated.
- the new generic lookup is only used by the horseshoe rank-state path.
- wider generic state-map processing can be considered later, after the horseshoe version is proven.

## Two Horseshoes From One Color Stop Constant

A useful result of this setup is that one color-stop constant can drive two visual horseshoes.

The shared constant contains thresholds, colors, and ranks:

```yaml
constants:
  awair_temperature_stops:
    colors:
      - value: -1000
        color: '#e63740'
        rank: 4
      - value: 9
        color: '#fb8600'
        rank: 3
      - value: 11
        color: '#faaa00'
        rank: 2
      - value: 17
        color: '#fdd125'
        rank: 1
      - value: 18
        color: '#49ce4c'
        rank: 0
      - value: 25.001
        color: '#fdd125'
        rank: 1
      - value: 26.001
        color: '#faaa00'
        rank: 2
      - value: 31.001
        color: '#fb8600'
        rank: 3
      - value: 33.001
        color: '#e63740'
        rank: 4
```

The first horseshoe can render the real numeric value:

```yaml
horseshoes:
  - id: awair_temperature_value
    entity_index: 0
    color_stops: ref(awair_temperature_stops)
    horseshoe_state:
      mode: value
```

The second horseshoe can render the ranked interpretation around it:

```yaml
horseshoes:
  - id: awair_temperature_rank
    entity_index: 0
    color_stops: ref(awair_temperature_stops)
    horseshoe_state:
      mode: stringstate_level
    state_map:
      type: rank_state
      map:
        - rank: 0
          state: good
        - rank: 1
          state: average
        - rank: 2
          state: below_average
        - rank: 3
          state: bad
        - rank: 4
          state: very_bad
```

Both horseshoes use the same numeric entity and the same color-stop constant.

The difference is only the interpretation:

```text
numeric value -> color_stops -> numeric horseshoe
numeric value -> color_stops -> rank -> state_map(type: rank_state) -> ranked horseshoe
```

## Rank State Produces A Normal Runtime Config

`rank_state` must be resolved before shape builders and renderers run.

The renderer must not know about ranks, Awair thresholds, or reverse state-map lookup. It should only receive normal runtime data.

For `state_map.type: rank_state`, the horseshoe runtime preparation creates a ranked runtime view:

```text
original numeric colorStops
        |
        v
rank_state translation
        |
        v
normal ranked runtimeConfig
```

The ranked runtime config contains:

```text
sourceColorStops   = original numeric threshold color stops
colorStops         = derived ranked color stops used for rendering
state_map.map      = derived/normalized ranked state map with internal values
mapped_state       = active ranked state entry
value              = active ranked runtime value
```

After that translation, all downstream code remains predictable:

```text
runtimeConfig -> horseshoe-shapes.js -> horseshoe-renderer.js
```

The shape builders and renderers then work exactly as they already do for string-state modes.

## Source Versus Render Color Stops

For `rank_state`, two color-stop views are needed.

`sourceColorStops` keeps the original numeric thresholds:

```yaml
colors:
  - value: -1000
    color: '#e63740'
    rank: 4
  - value: 18
    color: '#49ce4c'
    rank: 0
  - value: 33.001
    color: '#e63740'
    rank: 4
```

This is used only to find the active rank from the real numeric entity value.

`colorStops` becomes the ranked render scale:

```yaml
colors:
  - value: 0
    color: '#49ce4c'
    rank: 0
  - value: 1
    color: '#fdd125'
    rank: 1
  - value: 2
    color: '#faaa00'
    rank: 2
  - value: 3
    color: '#fb8600'
    rank: 3
  - value: 4
    color: '#e63740'
    rank: 4
```

This ranked `colorStops` is what scale, state, labels, backgrounds, and tickmarks use during rendering.

That keeps scale, state, and labels in the same value space.

## Why This Keeps The Renderer Simple

The renderer receives normal path items and styles.

It does not need branches for:

- rank lookup
- original numeric thresholds
- repeated ranks
- Awair-style middle-good ranges
- reverse state-map lookup

All of that is resolved once in the horseshoe runtime state preparation.

This matches the existing string-state architecture: the render layers do not decide what a state means; they render the normalized runtime model.

## Runtime Processing Versus Display

`rank_state` is a runtime processing step, not a display mode.

The display mode stays in `horseshoe_state.mode`:

```yaml
horseshoe_state:
  mode: stringstate_level
```

The runtime mapping type stays in `state_map.type`:

```yaml
state_map:
  type: rank_state
```

That means the implementation must keep these concerns separate:

```text
runtime processing:
  raw numeric value -> sourceColorStops -> rank -> state_map -> mapped_state

render display:
  runtimeConfig -> shapes -> renderer
```

The conversion belongs before display items are built.

## Safe Implementation Point

The safest implementation point is in `horseshoe-state.js`, inside or directly next to `getGaugeStateData()`.

That function already has the required inputs:

- resolved horseshoe config
- normalized `runtimeConfig`
- entity state or attribute value
- normalized `runtimeConfig.colorStops`
- `runtimeConfig.state_map`

It also already returns the outputs that downstream code uses:

- `runtimeConfig`
- `mappedState`
- `value`

So the `rank_state` branch can be added there without changing working renderer or shape code.

The current/default path stays as it is:

```text
state_value or missing type:
  raw state/value -> state_map -> mappedState -> value
```

The new path is only active when configured:

```text
rank_state:
  raw numeric value -> sourceColorStops -> active rank -> state_map -> mappedState -> ranked value
```

## Code That Should Stay Untouched

This work should not change:

- `StateTool.buildState()`
- state text formatting
- icon state-map behavior
- normal color-stop color lookup
- `horseshoe-shapes.js` rendering decisions
- `horseshoe-renderer.js`

Those parts already work and should continue to receive normal runtime data.

The only required change is a local runtime translation for horseshoes using:

```yaml
state_map:
  type: rank_state
```

After that translation, downstream code should not be able to tell whether the runtime state came from explicit `state_value` mapping or from ranked color stops.
