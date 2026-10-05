# Plan 17B Review — Controls on the Canonical Tool Architecture

Date: 2026-10-02

Reviewed repository:

```text
AmoebeLabs/flex-horseshoe-card
```

Reviewed master:

```text
918587917d0d306709edff4a05b1a0de226228cb
```

Relevant completed prerequisites:

```text
Plan 15B
Plan 16B
Plan 16B follow-up #850
```

Reviewed plan:

```text
Plan 17B — Controls on the Canonical Tool Architecture
```

## Overall conclusion

The direction of Plan 17B is correct.

Controls are indeed the next family where the remaining architectural violations are concentrated:

```text
config.svg
HA-derived Select options stored in config
runtime state selecting presentation by mutating child config.styles
subtype-specific completion paths
mixed geometry / config / runtime ownership
```

The plan correctly targets:

```text
config
geometry
runtime
paint
```

and correctly uses the `setPaintStyles()` route established by Plans 15B–16B.

The plan should **not yet be executed literally as written**. Three areas need rework before implementation because the current wording can produce the wrong ownership split or create duplicate presentation state.

Review classification:

```text
REWORK: 3
ADAPT:  4
KEEP:   remaining architecture
```

---

# 1. REWORK — Split Toggle source preparation, translation and derived geometry

## Finding

Plan 17B currently says:

> One Toggle translator owns:
>
> - defaults;
> - subtype/style selection;
> - orientation completion;
> - content defaults;
> - validation;
> - final canonical Toggle config.

That is too broad for the current Toggle lifecycle.

Current construction does:

```text
DEFAULT_TOGGLE_CONFIG
+ orientation-specific defaults
+ authored config
→ super(...)
```

Only after BaseTool captures the source does Toggle run:

```js
this.validateOrientation(this.config.orientation);
this.config = this.buildConfig(this.config);
```

Therefore the pre-BaseTool defaults are already template-visible.

Moving all Toggle defaults into one post-evaluation translator would change what JavaScript sees through `item`.

That violates the plan's own section 3 requirement:

```text
PRE-SOURCE / TEMPLATE-VISIBLE
POST-EVALUATION TRANSLATION
```

## Current `buildConfig()` also mixes configuration and derived data

`ControlToggle.buildConfig()` currently writes all of the following into config:

```text
svgVbW
svgVbH
renderTrackX
renderTrackY
renderTrackWidth
renderTrackHeight
on.knobX
on.knobY
off.knobX
off.knobY
iconTransform
shadow.id
```

Several of those are derived render geometry.

`shadow.id` is also instance-dependent:

```js
`${this.cardId}-${this.id}-toggle-shadow`
```

That cannot belong to a pure BaseTool translator because a pure translator must not depend on subclass instance state.

## Required target

The Toggle route should be stated explicitly as:

```text
template-visible source preparation
    defaults already visible to JS
    orientation-dependent defaults already visible to JS
    content defaults already visible to JS
        ↓
sourceConfig
        ↓
JavaScript evaluation
        ↓
pure Toggle translator
    subtype/style selection
    structural validation
    selected preset completion
        ↓
config
        ↓
geometry / generated render data
```

### Keep before source capture

Preserve all defaults that JavaScript already observes today:

```text
DEFAULT_TOGGLE_CONFIG
orientation-specific source defaults
existing source-visible content defaults
```

### Move into pure post-evaluation translation

Suitable translator responsibilities include:

```text
show.item_variant validation
show.item_viz validation
show.item_style validation
orientation validation
selected style preset completion
structural configuration completion
```

### Move out of config

Derived render information belongs under geometry or local render data:

```text
renderTrackX
renderTrackY
renderTrackWidth
renderTrackHeight
knob positions
viewBox-derived dimensions
icon transform if derived only
```

Generated resource identity such as:

```text
shadow.id
```

should not be treated as authored/current canonical config merely because the renderer needs it.

## Important invariant

Do not replace the current Toggle inconsistency with a translator that simply moves more derived data into canonical config.

The result must be:

```text
source preparation
≠
translation
≠
geometry/render derivation
```

## Classification

```text
REWORK
```

---

# 2. REWORK — Do not require one parent `config.content.items[]` as the effective child config

## Finding

Plan 17B says:

> The parent control should expose complete effective content items before normal runtime state handling.
>
> For example:
>
> `config.content.items[]`

That model does not fit every current `ControlContent` use.

Current `ControlContent` resolves:

```text
parent entity
+ shared source content item
+ per-button/per-option override
→ merged child item
```

For Button, the override map may be empty.

For Select, the override is option-specific:

```js
option.content
```

Therefore the same shared:

```text
config.content.items[]
```

can produce different effective child configurations for different Select options.

There is no single canonical completed `config.content.items[]` that can represent all generated Select child instances.

## Better architectural rule

The important invariant is not where the completed generated child config is stored in the parent.

The important invariant is:

```text
shared content source
+ inherited parent entity
+ per-instance override
        ↓
complete generated child source config
        ↓
child tool construction
```

and that resolution occurs once per generated child lifetime.

Generated child source config then stays stable for that child instance.

## Required wording

Replace the requirement that effective generated items must necessarily live under:

```text
config.content.items[]
```

with something like:

```text
Structural inheritance is resolved once when each generated child source
configuration is built.

The parent may retain shared configured content and per-instance overrides.
The completed generated child source does not need to be stored back into
the parent's canonical config.
```

This also avoids creating large duplicated child configurations inside the parent merely for architectural symmetry.

## Button and Select remain valid

Button:

```text
shared content
+ inherited entity
→ generated child source
```

Select:

```text
shared content
+ option.content override
+ option.entity_index
→ generated child source for that option
```

Both satisfy the same architectural rule.

## Classification

```text
REWORK
```

---

# 3. REWORK — Do not duplicate active/inactive/selected/unselected config branches into persistent paint state

## Finding

The proposed family target says:

```text
paint
  selected/unselected
  active/inactive
  unavailable visual overrides
```

and ControlSelect proposes:

```text
paint.optionStates
```

This risks creating a second persistent copy of presentation data already owned by config.

Button already has configured branches such as:

```text
config.viz.active
config.viz.inactive
```

Select already has:

```text
config.viz.selected
config.viz.unselected
```

Runtime only needs to identify the current branch.

For example:

```text
runtime.active
runtime.stateMapItem
```

or:

```text
runtime.selectedIndex
```

The current effective child style can then be derived locally.

## Required paint rule

Use:

```text
config
    configured presentation branches

runtime
    current selected state/index/value

paint
    only current resolved/published presentation when a persistent paint owner
    is actually required
```

Prefer local current paint derivation when there is no need to persist it:

```js
const visualState = runtime.active ? viz.active : viz.inactive;
```

then:

```js
child.setPaintStyles(resolvedStyles);
```

For Select:

```text
runtime.selectedIndex
+ config selected/unselected branches
→ locally resolved child paint
→ child.setPaintStyles()
```

Do not introduce redundant long-lived containers such as:

```text
paint.active
paint.inactive
paint.selected
paint.unselected
paint.optionStates
```

unless there is a concrete consumer that requires the currently resolved output to remain stored.

## Main 17B paint invariant

The important correction is:

> Runtime presentation must no longer use child `config.styles` as paint storage.

The plan does **not** need to force every parent control to store all possible visual branches again under `paint`.

## Classification

```text
REWORK
```

---

# 4. ADAPT — Make `config.svg → geometry.svg` a hard family-wide rule

## Finding

All five current concrete control types still store derived SVG coordinates in config:

```text
ControlButton
ControlSelect
ControlToggle
ControlSlider
ControlNumber
```

Each currently uses:

```js
this.config.svg = this.calculateSvgDimensions(...)
```

Plan 17B mentions geometry migration in several subtype sections, but the family-wide invariant should be explicit.

## Required target

For all concrete controls:

```text
config.svg
→ geometry.svg
```

No migrated control should retain:

```text
config.svg
```

as a compatibility duplicate.

## Subtype geometry

Subtype geometry should extend the same owner.

Examples:

### Number

Current:

```text
config.svg
numberGeometry
```

Target:

```text
geometry.svg
geometry.horizontal
geometry.innerWidth
geometry.innerHeight
geometry.buttonSize
geometry.valueWidth
geometry.valueHeight
geometry.minusCenterX
geometry.minusCenterY
geometry.plusCenterX
geometry.plusCenterY
```

Do not finish 17B with:

```text
geometry.svg
+
numberGeometry
```

as parallel derived owners.

### Toggle

Derived viewBox, track and thumb placement should likewise join its geometry owner rather than remain embedded in config.

### Slider

The currently computed center/bounds and subtype-specific linear/circular layout data should consume `geometry.svg` rather than `config.svg`.

## Classification

```text
ADAPT
```

---

# 5. ADAPT — Complete the ControlSelect ownership map before implementation

## Finding

The plan correctly identifies the primary violation:

```js
this.config.option_map = ...
```

inside `setState()` for HA-derived options.

That should move out of canonical config.

However, current Select owns more state than the proposed target lists.

Current fields include:

```text
usesEntityOptions
optionsInitialized
entityOptionsSignature
selectedOptionIndex
optionDisplayTexts
optionDisplayTextSignature
optionActionConfigs
```

These should be classified before movement.

## Suggested ownership map

### Structural / immutable flag

```text
usesEntityOptions
```

This may remain an explicit field if useful.

It describes the configured source mode, not current HA state.

### Config

```text
config.option_map
```

Contains explicitly authored/evaluated configured options only.

Do not write HA-derived options into it.

### Runtime

```text
runtime.options
runtime.selectedIndex
runtime.optionDisplayTexts
runtime.actionConfigs
```

where applicable.

### Change signals / lifecycle metadata

```text
entityOptionsSignature
optionDisplayTextSignature
optionsInitialized
```

These are signals, not config copies.

Keep them explicit if they still have distinct lifecycle purposes.

## Avoid duplicate option ownership for explicit maps

For a select with an explicitly configured option map, do not unnecessarily deep-clone the complete option list into a second runtime owner.

Conceptually:

```js
const effectiveOptions = this.usesEntityOptions
  ? this.runtime.options
  : this.config.option_map;
```

is sufficient.

If implementation chooses to assign:

```js
runtime.options = config.option_map;
```

for a static select, sharing the immutable current array is preferable to maintaining two independently owned equivalent copies.

## `selectedValue`

The plan currently proposes:

```text
runtime.selectedValue
```

Keep it only if a concrete downstream consumer benefits from it.

If all consumers can derive it from:

```text
runtime.selectedIndex
+
effective options
```

then storing it is unnecessary duplication.

## Classification

```text
ADAPT
```

---

# 6. ADAPT — Preserve ControlContent's current semantic paint scope

## Finding

Current `ControlContent.setState()` intentionally applies parent active/selected styles only to:

```text
icon
text
```

Children of public type:

```text
state
name
area
```

are adapted to TextTool and therefore follow the semantic text route.

Data visualization children:

```text
line
circle
horseshoe
sparkline
```

retain their own styles, state and color-stop handling.

This is an important current behavior boundary.

## Required target

When replacing:

```js
child.tool.config.styles = ...
```

with:

```js
child.tool.setPaintStyles(...)
```

preserve the exact same scope:

```text
semantic icon/text child
→ receive parent selected/active paint

line/circle/horseshoe/sparkline
→ do not receive that semantic paint injection
```

Do not generalize the new paint API to every `ControlContent` child merely because all children now support canonical tool ownership.

## Style priority must remain exact

For the first migration, preserve the current merge order:

```js
Merge.mergeDeep(
  ConfigHelper.toStyleDict(visualState[child.type].styles),
  childBaseStyles,
  {
    transition: ...
  },
)
```

This means configured child/base styles currently override parent selected/active visual styles.

The first 17B migration must preserve that priority exactly.

Do not "simplify" the argument order.

## Classification

```text
ADAPT
```

---

# 7. ADAPT — Classify Number measurement lifecycle separately from runtime entity state

## Finding

The plan correctly identifies:

```text
numberGeometry
→ geometry

minusActionConfig
plusActionConfig
→ runtime
```

Current Number also owns:

```text
valueMeasurementSignature
valueMeasurementPass
```

These fields are part of the child text measurement lifecycle.

They are not authored config and they are not ordinary HA-derived runtime data.

## Required ownership

Suggested target:

```text
numberGeometry
→ geometry.*

minusActionConfig
plusActionConfig
→ runtime.minusActionConfig
→ runtime.plusActionConfig

valueMeasurementSignature
valueMeasurementPass
→ keep explicit measurement lifecycle fields
```

Do not force those fields under `runtime` merely because they are not config.

This follows the same rule established during Text 16B:

```text
configuration
runtime display/entity state
geometry
async/measurement lifecycle
```

may remain distinct owners when the lifecycle fields have real identity or scheduling meaning.

## Classification

```text
ADAPT
```

---

# 8. KEEP — ControlBase source-order characterization

The plan is correct to require all constructor/factory work to be classified as:

```text
PRE-SOURCE / TEMPLATE-VISIBLE
POST-EVALUATION TRANSLATION
```

This is necessary.

Current ControlBase completes before BaseTool:

```text
visibility default
unavailable styles
recursive haptics
label defaults
label positioning
label styles
```

Some or all of these may already be observable through JavaScript because they are supplied before `super(...)`.

Do not move them mechanically after evaluation.

The target is one current config, not uniform placement of every default.

Classification:

```text
KEEP
```

---

# 9. KEEP — Repeated visibility validation

The plan explicitly says not to remove the current visibility validation until equivalent behavior is proven.

That is correct.

Current `ControlBase.updateRuntimeConfig()` validates every pass:

```js
if (!['visible', 'hidden', 'unavailable'].includes(this.config.visibility)) {
  throw Error(...);
}
```

Existing tests deliberately protect repeated failure behavior.

Do not remove or move that validation merely because a control translator exists.

Classification:

```text
KEEP
```

---

# 10. KEEP — Child paint must use the 15B/16B presentation contract

The plan correctly targets the current violations in Button, Select and ControlContent.

Current runtime logic still performs assignments such as:

```js
child.tool.config.styles = ...
```

That is precisely what should disappear.

The correct target is:

```js
child.tool.setPaintStyles(resolvedStyles);
```

where `resolvedStyles` is the **same complete merged dictionary currently assigned to config**.

Do not invent:

```text
renderConfig
effectiveConfig
runtimeConfig
activeChildConfig
```

for presentation.

The existing BaseTool contract is sufficient.

Classification:

```text
KEEP
```

---

# 11. KEEP — Text children must remeasure through the 16B paint route

This requirement is correct and important.

When a control changes a Text child font-related style while displayed text stays equal:

```text
font-size
font-family
font-weight
letter-spacing
etc.
```

the child must invalidate exact measurement through the existing 16B effective-style measurement path.

Control code should not directly reset Text geometry or measurement signatures.

Publishing paint is the correct interface.

Classification:

```text
KEEP
```

---

# 12. KEEP — Button state belongs to runtime, not config

The proposed Button direction is correct.

Current fields/logic conceptually become:

```text
runtime.stateMapItem
runtime.active
```

while configured visual branches remain in config.

The selected state map result should not become a new current config.

Background/indicator/current child paint may be derived from:

```text
runtime.active
+
config visualization branches
```

Classification:

```text
KEEP
```

---

# 13. KEEP — Select HA-derived options must stop mutating canonical config

Current Select does:

```js
this.config.option_map = ControlSelect.normalizeOptionMap(...)
```

inside `setState()`.

This is a genuine canonical ownership violation.

Moving current HA-derived option definitions to runtime is correct.

The existing normalization behavior, errors, action construction, child recreation and display formatting should remain unchanged.

Classification:

```text
KEEP
```

---

# 14. KEEP — Slider runtime migration is directionally correct

The proposed Slider runtime list matches the current functional role of the fields:

```text
values
displayValues
available
scale
activeValueIndex
dragging
draggingThumb
lastWrittenSignature
renderFrame
stateAnimationFrame
writeTimer
```

The plan is also correct not to require all of these to be mechanically nested if that harms the pointer hot path.

Recommended rule:

```text
entity-derived / current slider state
→ runtime ownership should be recognizable

interaction handles / RAF / timers
→ may stay direct when lifecycle clarity is better
```

Preserve:

```text
pointer capture
global listeners
range crossing rules
HA scale resolution
unknown/unavailable current value behavior
invalid scale errors
throttled writes
animation
disconnect cleanup
```

Classification:

```text
KEEP
```

---

# 15. KEEP — Number action payloads are runtime

Current Number builds:

```text
minusActionConfig
plusActionConfig
```

from current entity domain/state context in `setState()`.

Moving these under runtime is appropriate:

```text
runtime.minusActionConfig
runtime.plusActionConfig
```

The existing increment/decrement → perform-action conversion must remain unchanged.

Classification:

```text
KEEP
```

---

# 16. KEEP — ControlTool remains compile/dispatch only

The live ControlTool responsibility is currently already simple:

```text
compile subtype-specific static work
dispatch subtype constructors
```

The old commented implementation is dead code and can be removed in Pass B once the migrated family is green.

Do not replace it with a registry or generic control engine.

Classification:

```text
KEEP
```

---

# 17. KEEP — Shared color-stop owner remains staged until Plan 19

The explicit exception is correct.

Controls should use canonical child paint interfaces without prematurely moving the shared active color-stop owner while Sparkline/Horseshoe still use the staged storage.

Do not create a partial duplicate owner.

Classification:

```text
KEEP
```

---

# 18. ADAPT — Clarify the "inheritance happens once" invariant

The current Definition of Done says:

```text
common + subtype + item inheritance happens once
```

That is directionally correct but can be interpreted too literally.

Generated children may legitimately be destroyed and recreated after:

```text
real configuration change
group/geometry change
HA-derived Select option-set change
```

When a new child instance is created, its structural source must naturally be assembled again.

## Better invariant

Use:

```text
Structural inheritance is resolved once per generated child lifetime.

Runtime state may select presentation, but it does not repeat structural
configuration inheritance or mutate the child's canonical config.
```

This captures the intended architecture without forbidding legitimate child reconstruction.

This wording is part of the earlier ControlContent ADAPT/REWORK and should be reflected in the final Definition of Done.

---

# 19. Pass A verification additions

The existing verification section is good.

Add explicit characterization for the three reworked areas.

## Toggle

Before migration, record which values are visible to JavaScript before `buildConfig()`.

Verify after migration:

```text
static Toggle config
=
equivalent valid JavaScript Toggle config

for:
orientation
style
content
selected preset
```

Also assert that derived Toggle geometry is absent from canonical config where migrated.

## Generated child inheritance

For Button and Select:

```text
shared source
+ inherited entity
+ per-instance override
→ one generated child source
```

Verify that runtime state changes do not rebuild that structural child source merely to change presentation.

## Paint storage

Assert that runtime selection:

```text
Button active/inactive
Select selected/unselected
ControlContent parent state
```

does not mutate:

```text
child.config.styles
child.sourceConfig.styles
```

and that the complete resolved dictionary is published through `paint.styles`.

---

# 20. Suggested ownership summary

A useful final architecture summary for Plan 17B is:

```text
config
    authored/evaluated structural control configuration
    configured presentation branches
    explicitly configured Select option_map

geometry
    control SVG center/bounds
    subtype layout
    button/segment/thumb coordinates
    generated child placement inputs

runtime
    BaseTool entity/entityConfig
    selected state/index
    HA-derived Select options
    HA-derived slider scale/values/availability
    generated action payloads
    current interaction values

paint
    currently resolved presentation only where persistence is useful
    child paint published via setPaintStyles()

lifecycle
    DOM refs
    measurement passes
    RAF handles
    timers
    pointer/listener state where explicit ownership remains clearer
```

The architecture does not require every non-config field to be nested.

---

# 21. Final review status

## REWORK before implementation

### REWORK 1 — Toggle ownership split

Separate:

```text
template-visible source preparation
post-evaluation pure structural translation
derived geometry/render data
```

Do not make current `buildConfig()` wholesale into the translator.

### REWORK 2 — Generated ControlContent child config

Do not require one parent:

```text
config.content.items[]
```

to hold every effective generated child configuration.

Resolve structural inheritance once per child lifetime and pass the complete generated source directly to the child.

### REWORK 3 — Paint duplication

Do not copy configured:

```text
active/inactive
selected/unselected
```

branches into permanent parent paint state.

Keep them in config, keep current selection in runtime, derive current paint locally, and publish only resolved child paint where required.

## ADAPT

1. Make `config.svg → geometry.svg` explicit for all five concrete controls.
2. Record the full ControlSelect field ownership map before movement.
3. Preserve ControlContent's semantic icon/text-only paint injection scope and exact merge priority.
4. Keep Number measurement signatures/passes as explicit measurement lifecycle unless a real owner requires otherwise.
5. Clarify "inheritance once" as once per generated child lifetime.

The fifth wording change is closely related to REWORK 2 and does not represent another architectural blocker.

## KEEP

- canonical config/geometry/runtime/paint direction;
- ControlBase source-order characterization;
- visibility validation behavior;
- `setPaintStyles()` child presentation route;
- Text child measurement invalidation through 16B;
- Button state-map/current-active runtime ownership;
- Select HA option migration out of config;
- Slider runtime direction and interaction preservation;
- Number generated runtime action payloads;
- ControlTool compile/dispatch role;
- color-stop staging until Plan 19;
- Pass A / Pass B approach;
- no generic control engine.

---

# Recommendation

After the three REWORK items are incorporated, Plan 17B is structurally ready for implementation.

The key architectural invariant should be stated once in the plan:

```text
Controls keep authored/evaluated structure in config, derived layout in
geometry, current HA/interaction state in runtime, and publish current child
presentation through paint.

Structural inheritance is resolved once per generated child lifetime.
Runtime state may select presentation, but it never repeats structural
inheritance or mutates a child's canonical config.
```
