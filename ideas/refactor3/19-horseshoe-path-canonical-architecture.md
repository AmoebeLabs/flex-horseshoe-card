# Plan 19 — Horseshoe / Path Canonical Architecture

## 1. Goal

Remove Horseshoe's semantic configuration swapping and map the already-working Path V3 implementation onto the canonical owners:

```text
config
geometry
runtime
paint
```

This is the deepest ownership migration in the programme. It is explicitly **not** a Path V3 rewrite.

## 2. Why Horseshoe is last

Current Horseshoe combines:

- public/legacy configuration normalization;
- group placement;
- path construction;
- path measurement/transforms;
- entity state mapping;
- ranked/string-state conversion;
- value mapping;
- state animation;
- adaptive gradients;
- labels/ticks/markers/backgrounds.

That complexity is legitimate.

What is not necessary is giving multiple meanings to `this.config` while doing it.

By Plan 19 the canonical architecture should already be proven by simple tools, Text, Controls and Sparkline. Horseshoe should therefore be a migration into an existing pattern, not the place where that pattern is invented.

## 2A. Preserve Horseshoe template-visible preparation

`HorseshoeGauge.setConfig()` / base normalization currently prepare values before the tool enters BaseTool. Some of that preparation may therefore be visible to JavaScript.

Before merging `normalizeBaseConfig()` and `normalizeRuntimeConfig()` responsibilities, classify every moved default/completion as template-visible or post-evaluation.

The canonical architecture requires one current config, but it does **not** permit changing the existing JavaScript `item` context/order.

## 3. Current-master semantic swapping

Current `HorseshoeGauge` contains persistent fields such as:

```text
activeItemConfig
runtimeConfig
pathConfig
this.config
```

and `setState()` receives:

```text
stateData.config
```

then publishes it by replacing `this.config`.

This means the same property can represent:

- the BaseTool item configuration;
- normalized renderer configuration;
- a state-specific ranked/string-state rendering configuration.

This is the primary architectural problem.

## 4. Target owners

### Configuration

```text
this.config
```

contains only the canonical current horseshoe configuration after source evaluation and tool translation.

### Geometry

```text
this.geometry.svg
this.geometry.pathInput
this.geometry.pathDefinition
this.geometry.pathGeometry
this.geometry.transformedPathGeometry
this.geometry.transform
this.geometry.pathElements
this.geometry.pathElementSources
```

The exact nesting should remain practical; these names describe the semantic destination, not a requirement for deep objects if direct properties are clearer.

### Runtime

```text
this.runtime.value
this.runtime.rawState
this.runtime.mappedState
this.runtime.stateMap
this.runtime.progress
this.runtime.displayProgress
this.runtime.valueMapper
this.runtime.scale
```

Animation engine state may remain inside `PathStateAnimator`, which is already a distinct domain owner.

### Paint

```text
this.paint.colorStops
this.paint.colorStopsMinMax
this.paint.stateGradient
this.paint.stateRanges
this.paint.stateSegmentPaints
this.paint.statePaints
this.paint.markerStyles
this.paint.backgrounds
```

Again, do not force pointless nesting when the domain object itself already owns the data. The rule is semantic ownership and naming consistency.

## 5. Configuration translation

Current `horseshoe-state.js` has two important config routines:

```text
normalizeBaseConfig()
normalizeRuntimeConfig()
```

Plan 19 should make them parts of one translation lifecycle.

They may remain separate pure helpers if that makes the translator easier to read, but they no longer represent different persistent config stages.

### Move out of canonical config where derived

Audit and relocate fields such as:

- `group_config` when it is current layout/group context rather than authored config;
- `svg`;
- calculated path coordinates;
- calculated group transforms;
- theme-selected color-stop output (at the shared atomic cutover described below);
- current mapped state;
- current zero/value-space overrides that only exist because of entity state.

### Preserve

Keep the established validation and normalization semantics for:

- scale min/max/type;
- line caps;
- path type fields;
- state modes;
- bar modes;
- tick/label config;
- public legacy compatibility.

## 6. State mapping contract

### Current

`getGaugeStateData(config, entity, entityConfig)` can return:

```text
config: state-specific active config
rawState
mappedState
value
```

For string color stops and rank-state it derives:

- a new state map;
- new color stops;
- possibly a new scale;
- mapped state/value.

### Target

Keep that derivation cohesive, but return explicit derived data instead of another general config.

Conceptually:

```text
rawState
value
mappedState
stateMap
renderColorStops
renderColorStopsMinMax
scaleOverride/valueSpace
```

The exact shape should be chosen for the simplest calling code.

Then:

```text
stateMap/mappedState/value      → runtime
render color/gradient inputs    → paint
state-specific scale/value map  → runtime or explicit domain mapping input
```

The state-mapping algorithm itself remains.

## 7. Configured state_map versus current state map

The public configured state map remains:

```text
config.state_map
```

A derived ranked/string-state mapping used for the current entity state is runtime data:

```text
runtime.stateMap
runtime.mappedState
```

Do not overwrite `config.state_map` to publish current display labels/mapping.

If localized display labels require a derived display map, treat that as runtime/presentation output.

## 8. Path input and definition

Current `pathConfig` is a derived input to path generators.

Rename/move it to the geometry domain:

```text
pathConfig → geometry.pathInput
```

Keep all existing generators:

- arc;
- line;
- rectangle;
- polygon;
- wave;
- spiral;
- infinity;
- offset path generation.

Keep validation such as polygon maximum radius.

## 9. PathGeometry and transforms

`PathGeometry` and `TransformedPathGeometry` already have good domain ownership and should remain.

Move the Horseshoe references into recognisable geometry ownership; do not rewrite measurement/caching algorithms.

Current transform keys/signatures should be reviewed only after migration to determine whether canonical geometry makes any duplicate keys unnecessary.

## 10. GaugeScale / PathValueMapper

These are domain calculation objects.

The current constructor argument names may be clarified so an object of options is not confused with the tool's general config.

Preserve:

- scale interpolation;
- spline behaviour;
- zero handling;
- progress/range mapping;
- state range construction.

## 11. Paint migration

Current Horseshoe already has many paint-like fields:

```text
stateGradient
stateRanges
stateSegmentPaints
statePaints
stateMarkerStyles
```

This makes the migration relatively direct.

Move/rename those under a consistent paint owner where it improves searchability, and ensure state/theme paint no longer requires config swapping.

Preserve:

- adaptive gradients;
- color-stop segment calculation;
- interpolated modes;
- bidirectional/absolute modes;
- marker color calculation;
- background gradient/reveal logic.

## 12. Labels, ticks and marker contracts

### `horseshoe-labels.js`

Currently consumes a `runtimeConfig` containing mapped state.

Change the function contract to explicit categories, for example:

```text
config
runtime
geometry/value mapper
```

Do not keep `runtimeConfig` just because the helper currently expects one object.

### `horseshoe-tickmarks.js`

Same principle: configuration inputs and current derived values should be distinguishable by parameter name.

### `horseshoe-marker.js`

Rename `pathConfig` arguments to `pathInput`/geometry terminology and pass current marker paint explicitly.

## 13. Path support modules

Do not force pure/support modules into BaseTool architecture.

Expected outcomes:

- `path-generators.js` — KEEP.
- `path-geometry.js` — KEEP, reference-quality geometry owner.
- `path-elements.js` — KEEP.
- renderers — KEEP.
- `path-animator.js` — KEEP domain lifecycle; optional `config` → `options` naming.
- `path-ranges.js` — preserve algorithms, clarify constructor/input vocabulary.

## 14. Pass A verification

Run Horseshoe/Path tests before any simplification.

Priority cases:

- numeric state;
- ordinary state maps;
- string color stops;
- rank-state mapping;
- labels at state/color stops;
- gradients;
- state marker;
- tick layers;
- bidirectional/symmetrical/absolute modes;
- transformed path geometry;
- cache lifecycle;
- state animation.

The first goal is to prove that moving owners did not change visible behaviour.

## 14A. Atomic shared active color-stop owner cutover

Plan 19 is the first point at which the ordinary tools/Text, Controls, Sparkline and Horseshoe have all been prepared for canonical paint ownership.

Perform the shared active color-stop storage move as one isolated integration substep:

```text
BEFORE
active theme/mode-selected color-stop output lives in config-shaped fields used across families

AFTER
structural/authored color-stop data remains configuration
active theme/mode/state presentation output lives under paint
```

Requirements:

- update **all** remaining consumers in the same working change;
- do not retain duplicate persistent config+paint owners;
- keep `ColorStops.normalize()` and color calculations semantically unchanged;
- preserve state-specific Horseshoe rank/string-state paint results;
- run ordinary-tool, Control, Sparkline and Horseshoe focused paint tests together immediately after the cutover.

If the complete cutover cannot be made green atomically, revert that substep and revise the plan. Do not leave half the codebase on each semantic owner.

## 15. Pass B cleanup

Only after Pass A is green, remove architecture that has become redundant:

- `activeItemConfig`;
- `runtimeConfig`;
- `stateData.config`;
- `pathConfig` as a standalone historical name;
- config copies used only to transition between stages;
- keys/signatures whose only purpose was protecting semantic config swapping;
- helpers that now simply forward adjacent canonical owners.

Keep real caches, renderer inputs, PathGeometry state and animator lifecycle.

## 16. Architecture assertions

At minimum prove:

```text
Horseshoe setState() never assigns this.config
no activeItemConfig
no runtimeConfig
no stateData.config contract
mapped state is runtime
path input/definition are geometry
current gradients/ranges are paint
```

## 17. Definition of Done

- `this.config` has one semantic identity for the complete tool lifetime.
- configuration translation is one route.
- entity state cannot replace configuration.
- geometry/path data is recognisably geometry.
- current mapping/progress is recognisably runtime.
- current color/gradient/range output is recognisably paint.
- Path V3 calculations and rendering remain functionally unchanged.
