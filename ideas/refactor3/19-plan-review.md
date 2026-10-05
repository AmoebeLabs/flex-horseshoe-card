# Plan 19 — Plan Review

**Plan:** 19 — Horseshoe / Path Canonical Architecture  
**Reviewed baseline:** `65c6f4caaf63043660149360350008e9c67ff382`  
**Review type:** Pre-implementation architecture and execution-plan review  
**Date:** 2026-10-03

## Review status

```text
BLOCKING: 0
REWORK:   0
ADAPT:    3
```

The overall architecture is sound.

Plan 19 should keep its main direction:

```text
one canonical current Horseshoe config
→ explicit runtime / geometry / paint owners
→ no state-specific config replacement
→ one atomic active color-stop cutover
→ mandatory cleanup pass after ownership is correct
```

No new Horseshoe lifecycle, generic palette framework or additional configuration state machine is required.

Three plan details should be made more explicit before implementation.

---

# Complexity note

Some of the terminology in this plan sounds more complicated than the intended implementation actually is.

The important point is:

```text
Plan 19 should REMOVE hidden complexity,
not introduce new runtime machinery.
```

The current Horseshoe implementation gets away with apparently simpler code because several different things are stored in the same objects:

```text
config
runtime state
active theme color stops
state-specific mapping
derived SVG coordinates
painted ranges
```

For example, the current code temporarily replaces `this.config` with:

```text
activeItemConfig
runtimeConfig
stateData.config
```

and state mapping can create another config-shaped object containing active color stops, mapped state and even a different scale.

That makes some lifecycle cases look simple because consumers can always read everything from `this.config`, but the complexity is only hidden inside config mutation.

Plan 19 makes the ownership explicit:

```text
config
→ authored/current settings

runtime
→ current entity/value/mapping

geometry
→ path/layout/measurement

paint
→ active colors/gradients/painted ranges
```

The three ADAPT points below are therefore not requests for additional subsystems.

In particular:

```text
"deferred first publication"
```

does **not** mean adding a queue, delayed worker or new state machine.

It simply means:

```text
if a field is JavaScript
→ evaluate it first
→ only then calculate a path from it
```

Before JavaScript-capable canonical configuration became the common architecture, the constructor was frequently handed already-prepared values and could calculate immediately. Once ordinary fields may be unresolved JavaScript, path calculation cannot safely happen before those values exist.

Use the already existing:

```text
activeConfigInitialized
```

signal. Do not invent anything else.

Likewise, the Sparkline color-stop provenance point does not require keeping an entire raw series config. It only prevents losing the distinction between:

```text
inherited parent paint
```

and:

```text
an explicitly authored series override
```

after the old config-shaped active paint storage is removed.

The state-map paint point is similar: the old implementation stores semantic mapping and active palette colors in the same derived map. Plan 19 can simplify that by keeping mapping as mapping and paint as paint.

---

# 1. Overall assessment

The plan correctly identifies the two major remaining architecture problems:

```text
Horseshoe
→ competing configuration stages

shared color-stop chain
→ active palette output still stored in config-shaped fields
```

The approved publication direction is correct:

```text
existing card compilation / legacy routing
→ source preparation
→ sourceConfig
→ JavaScript evaluation
→ local newConfig
→ translateConfig
→ complete current config
→ this.config
→ runtime / geometry / paint
```

This should use the existing BaseTool evaluation/publication route.

Do not copy the evaluator into Horseshoe.

Do not make BaseTool call subclass-specific translation from its constructor.

---

# ADAPT 1 — Make the pre-first-publication Horseshoe lifecycle concrete

## Finding

The plan already says unresolved dynamic configuration must not feed:

```text
path generation
scale calculations
marker setup
rendering
```

and that the existing first-publication/readiness pattern should be reused.

That is the correct rule.

The current Horseshoe, however, still has lifecycle methods that can access configuration before a normal entity/state pass.

For example, `updated()` reads:

```text
config.show.state_marker
config.horseshoe_marker.icon
```

while the constructor currently receives values that were already prepared by the old `normalizeBaseConfig()` route.

Once Plan 19 moves that preparation to the canonical evaluation/publication route, dynamic Horseshoe fields may still be unresolved before first publication.

## Required plan clarification

State explicitly:

```text
before first complete dynamic publication:

render()
→ inert / empty

updated()
→ no path/marker/config consumer requiring evaluated values

updatePalettePaint()
→ inert

hasPresentationChanged()
→ no unresolved calculation consumer

setState()
→ only after current config has been published

connected()/disconnected()
→ preserve existing concrete async resource lifecycle only
```

After first publication:

```text
complete this.config
→ initialize/update geometry
→ initialize/update animator/marker resources where required
→ continue using the real card connection state
```

Use only the existing:

```text
hasJavascript
activeConfigInitialized
```

and existing CardTools connection state.

Do **not** add:

```text
ready
pending
candidate
accepted
```

or another lifecycle state machine.

## `show.horseshoe`

The current static setup filters instances using:

```text
config.show.horseshoe !== false
```

while the schema permits dynamic `show.horseshoe`.

When source preparation moves, preserve the existing semantics intentionally.

Do not accidentally evaluate or structurally interpret an unresolved JavaScript value during `setConfig()`.

## Required regression

Add a focused case:

```text
dynamic Horseshoe constructed
→ render/update/connect lifecycle occurs before first publication
→ no unresolved value reaches path/scale/marker generation
→ no crash
→ first updateRuntimeConfig publishes complete config
→ path/runtime/paint owners become usable
```

## Disposition

```text
ADAPT
```

This should remain a small lifecycle boundary, not a new system.

---

# ADAPT 2 — Define how explicit Sparkline series color-stop overrides survive the Plan-19 cutover

## Finding

Plan 19 correctly requires:

```text
active palette output leaves config
temporary 18B Sparkline color-stop bridge disappears
parent/series inheritance remains equivalent
explicit legacy series overrides remain equivalent
```

The missing detail is how the implementation remembers that a series actually authored an override after canonical inheritance has completed.

18B temporarily solves this on a theme change by recovering the last evaluated series source from the existing config signature.

That temporary bridge must disappear in Plan 19.

However, after canonical inheritance:

```text
series.sparkline.colorstops
```

alone does not necessarily tell us whether the value was:

```text
inherited from the parent
```

or:

```text
explicitly overridden by that series
```

This distinction matters on:

```text
light → dark → light
```

because the parent active paint changes while the explicit series override must still be applied.

It is especially important for:

```yaml
series: |
  [[[ return [...] ]]]
```

because a theme switch must not cause another JavaScript evaluation merely to rediscover the override.

## Required plan clarification

During the normal canonical series publication pass, retain only the minimum authored override information needed for active paint composition.

Conceptually:

```text
evaluated raw series entry
       │
       ├─ canonical inherited series config
       │
       └─ explicit legacy color-stop override, when authored
                    ↓
              series paint
```

Do **not** retain:

```text
complete raw series config
second current config
raw-series cache
parsed activeConfigSignature as runtime data
```

The destination can be narrow series paint/provenance state owned by the already-stable runtime series item.

No new general configuration owner is needed.

## Required regressions

```text
static explicit series override
whole-series-JS explicit override

light → dark → light

→ parent active palette changes
→ explicit series override remains applied
→ no extra JavaScript evaluation
→ no activeConfigSignature used as a config data source
→ no raw-series cache
→ stable Series item identity
→ stable Graph identity where graph input did not change
```

## Disposition

```text
ADAPT
```

This closes the temporary 18B bridge cleanly rather than replacing it with another hidden config owner.

---

# ADAPT 3 — Keep palette-derived state-map colors in paint, not semantic runtime mapping

## Finding

The new Horseshoe owner table is broadly correct:

```text
config
→ configured state map

runtime
→ raw/numeric/mapped state
→ display state map
→ effective scale
→ mapper
→ unpainted ranges

paint
→ active stops
→ gradients
→ painted ranges
→ marker/background/layer appearance
```

The current state resolver, however, mixes mapping and paint.

For string/rank state modes it can derive colors from the active color-stop palette and write those colors into the runtime state-map/mapped-state structures.

For example, a ranked state can receive its color from the currently active source color stop.

That means a theme-only change can force semantic runtime mapping to be rebuilt merely because a color changed.

This conflicts with the intended Plan-19 invalidation rule:

```text
color-only palette change
→ paint refresh

numeric rank/threshold change
→ calculation/mapping refresh
```

## Required plan clarification

Separate semantic runtime mapping from active palette-derived paint.

Runtime should retain semantic information such as:

```text
state
value
rank
display label
relation
source value
effective numeric mapping
```

Paint should retain palette-derived presentation such as:

```text
active fallback color
mapped-state render color
rank/string render color
painted ranges
marker color
gradient stops
```

An explicitly configured color inside a state-map entry remains valid configuration input.

The point is specifically that a color obtained only from the **current active palette** should not become semantic runtime ownership.

## Required regressions

For both:

```text
string color stops
rank_state
```

verify:

```text
light → dark → light
without entity-state change

→ mapped numeric value unchanged
→ selected rank unchanged
→ semantic state-map result unchanged
→ effective calculation scale unchanged
→ active paint colors change correctly
```

Also verify numeric threshold/rank changes still invalidate the required mapping/calculation owners.

## Disposition

```text
ADAPT
```

---

# KEEP — One canonical Horseshoe config

Remove the current competing config stages:

```text
activeItemConfig
runtimeConfig
stateData.config
state-specific this.config replacement
```

`this.config` should remain the sole current complete Horseshoe configuration.

Entity-state processing must publish derived values to runtime/paint rather than replacing configuration.

This is the main architectural objective of the Horseshoe migration.

---

# KEEP — State mapping remains cohesive

Keep state mapping in the existing Horseshoe state domain.

Change only its output shape.

Instead of:

```text
getGaugeStateData()
→ another config-shaped object
```

prefer explicit output such as:

```text
rawState
mappedValue
mappedState
displayStateMap
effectiveScaleInput
renderStops / rank mapping inputs
```

The Horseshoe caller then publishes those values to their real owners.

Do not scatter the actual mapping algorithms across GraphTool/BaseTool/renderers.

---

# KEEP — `pathConfig` moves to geometry

The current standalone:

```text
pathConfig
```

is derived path-generator input.

Move it to something equivalent to:

```text
geometry.pathInput
```

The intended flow becomes:

```text
config path settings
→ geometry.pathInput
→ pathDefinition
→ PathGeometry measurement/cache
→ transformed geometry
```

Preserve every existing path calculation and group/legacy placement formula.

Do not interpret this migration as permission to change geometry.

---

# KEEP — Do not merely rename `renderContract`

The existing `renderContract` mixes:

```text
runtime ranges
painted ranges
clipping
layer appearance
background presentation
```

Do not keep it as another generic object under a different name.

Place retained values under:

```text
runtime
```

or:

```text
paint
```

according to what they actually represent.

Update renderer inputs accordingly.

---

# KEEP — Atomic active color-stop cutover

The Plan-19 color-stop migration genuinely spans multiple families:

```text
BaseTool
CardEntities
ordinary tools
Text
Control children
Sparkline
Horseshoe
```

Therefore the active owner cutover should remain one working integration change.

Structural/authored definitions remain configuration:

```text
color_stops
theme/mode blocks
scales
legacy supported authored forms
```

Active selected output belongs outside canonical configuration.

Do not leave a mixed final state where some renderers consume:

```text
config.colorstops
```

and others consume:

```text
paint.colorStops
```

for the same semantic active value.

If the atomic step cannot produce a working complete chain, revise the substep instead of committing a permanent half-cutover.

---

# KEEP — Active stops can be calculation input

Do not simplify active color stops to "colors only."

Normalized stops can contain:

```text
numeric values
ranks
named scales
threshold information
```

These can affect:

```text
Horseshoe scale defaults
rank/string mapping
Sparkline grade/rank calculation
labels/ticks
geometry-dependent thresholds
```

Provide the required numeric/mapping information explicitly to the calculation owner.

A color-only change should remain paint-only where possible.

A numeric threshold/rank change must still invalidate the affected calculations.

---

# KEEP — Text and child paint stay at their real owner

Text requires special care because it has:

```text
outer item paint
per-part paint
state-map part overrides
referenced/generated source parts
```

The Plan-19 destination is correct:

```text
part-level active paint
```

rather than mutating canonical part config with selected palette output.

Control-generated children should continue to receive explicit parent paint through the established child paint boundary.

Do not create a second general palette container around generated children.

---

# KEEP — Two internal passes

Keep the mandatory two-pass implementation:

```text
Pass A
→ ownership cutover
→ preserve behavior

Pass B
→ remove redundant copies / aliases / signatures / wrappers
```

Do not optimize for LOC while owners are still moving.

Pass B is where proven leftovers should be removed after the new boundaries are working.

---

# KEEP — Verification scope

The broad verification matrix is justified because the active color-stop migration is card-wide even though the main tool migration is Horseshoe.

Keep focused coverage for:

```text
static vs equivalent JavaScript
template-visible source context
one JS evaluation
numeric state
state maps
string/rank state
localized labels
all bar modes
negative/zero transitions
animation interruption
all Path V3 shapes
group movement/scale/rotation
labels/ticks/markers
gradient/segment/fixed modes
light/dark/light
entity/item priority
Text parts
Control children
Sparkline parent/series overrides
grade/rank invalidation
async palette/icon completion
disconnect/reconnect
measurement/cache reuse
```

Use output and behavior as the compatibility baseline rather than old internal object shapes.

---

# KEEP — Delivery sequence

The proposed implementation sequence should remain:

```text
1. characterize current behavior/owners
2. canonical Horseshoe config + explicit state output
3. geometry/domain owner migration
4. atomic shared active color-stop cutover
5. mandatory cleanup pass
6. full acceptance and independent review
```

Do not defer an incomplete active-paint owner into Plan 20.

---

# Required changes before implementation

Add or sharpen these three points:

```text
1. Concrete pre-first-publication behavior for dynamic Horseshoe.
   Use existing readiness only; no new lifecycle state.

2. Explicit narrow provenance for Sparkline per-series legacy color-stop overrides
   so the temporary 18B bridge can disappear without a raw config cache or
   extra JavaScript evaluation.

3. Keep palette-derived rank/string-state colors under paint rather than
   semantic runtime state-map ownership.
```

No other architectural change is required.

---

# Final review disposition

```text
BLOCKING: 0
REWORK:   0
ADAPT:    3
```

After those clarifications are incorporated:

```text
BLOCKING: 0
REWORK:   0
ADAPT:    0

PLAN 19 READY FOR IMPLEMENTATION
```

The intended architecture remains deliberately simple:

```text
sourceConfig
→ one stable source

this.config
→ one current configuration

runtime
→ current state/mapping

geometry
→ path/layout/measurement

paint
→ active presentation

existing domain owners
→ animation, measurement and async icon lifecycle
```

The plan should not introduce additional configuration layers, new generic palette infrastructure or another readiness/state machine.
