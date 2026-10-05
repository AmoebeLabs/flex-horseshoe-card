# Plan 17B — Controls on the Canonical Tool Architecture

Date: 2026-10-02

Baseline before prerequisite:

```text
918587917d0d306709edff4a05b1a0de226228cb
```

Status: revised execution plan. Implementation starts only after Plan 16C
(Evaluate JavaScript Before Translation) is merged and reviewed.

## 1. Goal and Functional Boundary

Give Controls the same recognizable configuration, geometry, runtime and paint
ownership as the reference tools while making Control configuration obey the
same JavaScript ordering as Horseshoe, Sparkline and the corrected BaseTool
route.

Controls keep:

```text
config
    authored/evaluated structural configuration
    configured presentation branches

geometry
    derived placement, bounds and native control geometry

runtime
    current HA values, selection and interaction state

paint
    current resolved child presentation where persistence is useful

lifecycle
    DOM references, listeners, timers, RAF handles and measurement scheduling
```

Structural inheritance is completed once per generated child lifetime. Runtime
state may select presentation, but it does not repeat structural inheritance or
mutate a child's canonical config.

The configuration route is:

```text
template-visible source preparation
→ sourceConfig
→ JavaScript evaluation
→ local newConfig
→ subtype translation / validation / preset completion
→ this.config
→ geometry / runtime / paint
```

No Control may validate, select a preset, select a visualization, choose an
orientation-dependent branch, or otherwise interpret a field while its value is
still unresolved `[[[ ... ]]]` syntax.

This plan does not invent a new JavaScript language or context. It restores
Controls to the existing FHS rule that dynamic configuration is evaluated before
its final value is interpreted.

Configured visibility remains configuration. Actual entity availability and
current interaction state remain runtime.

The shared active color-stop owner remains staged until Plan 19.

## 2. Prerequisite: Plan 16C

Plan 16C establishes the generic invariant:

> `translateConfig` receives only concrete/evaluated values.

17B relies on that behavior and must not reimplement the BaseTool evaluator.

Controls may use pure subtype translators after evaluation, but they do not
create:

```text
candidateConfig
activeConfig
effectiveConfig
renderConfig
controlRuntimeConfig
```

as alternative general config owners.

## 3. Current Control Ordering Problem

Current Controls do not all interpret selectors at the same lifecycle boundary.

Examples include constructor-time branching/validation on:

```text
orientation
show.item_variant
show.item_viz
show.item_style
content mode / subtype-specific shorthand
```

Button, Number, Select and Slider currently merge subtype defaults/presets before
BaseTool captures source. Toggle also has a separate post-super `buildConfig()`
path.

That order is incompatible with a dynamic selector such as:

```yaml
show:
  item_style: '[[[ return entities[entity_slots.style[0]].state; ]]]'
```

when constructor logic attempts to use the literal template string as a preset
key.

Horseshoe and Sparkline already demonstrate the expected user model:

```text
FHS input changes
→ JavaScript produces a new selector
→ current config changes
→ geometry/presentation follows
```

Controls must follow the same model.

## 4. Source Preparation Versus Subtype Translation

Before movement, characterize what each subtype currently exposes through
`item`.

Classify current constructor work as:

```text
PRE-SOURCE / TEMPLATE-VISIBLE
POST-EVALUATION TRANSLATION
DERIVED GEOMETRY / PRESENTATION
```

### PRE-SOURCE

Keep only preparation that is valid without interpreting an unresolved dynamic
selector.

Examples:

- context-independent common defaults;
- stable source-visible default branches;
- recursive haptic/default objects that do not depend on a dynamic selector;
- source normalization that does not require a final enum/value.

### POST-EVALUATION TRANSLATION

Move selector-dependent work here.

Examples:

- `orientation` validation;
- `show.item_variant` validation;
- `show.item_viz` validation;
- `show.item_style` validation;
- style/preset selection;
- orientation-dependent structural completion;
- visualization-dependent structural completion;
- safe content shorthand completion whose meaning depends on evaluated config.

### DERIVED GEOMETRY / PRESENTATION

Never put these in the translator:

- `config.svg`;
- native track/thumb coordinates;
- generated child placement;
- generated SVG/filter IDs;
- current selected/active branch;
- current HA options;
- current slider values/scale;
- current child paint.

## 5. Preserve Existing `item` Context Without Reintroducing Early Branching

Some current subtype constructors merge defaults/presets before BaseTool captures
source, so existing JavaScript may be able to read those completed values through
`item`.

Characterize this before moving preset completion.

If a currently supported JavaScript context demonstrably depends on a
selector-dependent preset being visible through `item`, preserve that behavior
with a bounded local evaluation sequence.

Allowed shape:

```text
stable prepared source
→ local selector evaluation where required
→ local preset/source completion
→ full existing evaluation with the existing item context
→ local newConfig
→ pure translator
→ this.config
```

These are evaluation phases, not additional persistent config owners.

Do not create a second `sourceConfig` or `activeConfig`.

If characterization proves the selected preset was never part of a supported
template-visible contract, keep the simpler one-pass route.

Record the result per subtype before implementation.

## 6. Dynamic Control Selectors Are Required Behavior

17B must explicitly support the normal dynamic forms for Control configuration
selectors.

At minimum characterize and support JavaScript for fields whose semantic value
is ordinary configuration and whose schema/general FHS contract allows dynamic
values, including:

```text
orientation
show.item_variant
show.item_viz
show.item_style
visibility
```

and subtype fields already defined through dynamic-value contracts.

Static and equivalent JavaScript forms must converge on the same canonical
configuration after evaluation/translation.

Example:

```yaml
show:
  item_style: ios
```

and:

```yaml
show:
  item_style: '[[[ return "ios"; ]]]'
```

must select the same Toggle preset.

A browser/FHS-input regression must prove at least one live selector switch,
for example:

```text
fhs_input_select
→ Toggle item_style
→ ha → ios → industrial
```

without recreating card configuration externally.

Likewise characterize dynamic orientation where the subtype supports both
orientations.

### Schema alignment

Update Control schema definitions so selector fields that are part of the
dynamic Control contract accept `common.javascript` consistently.

Do not leave runtime support and authoring schema in disagreement.

Regenerate derived schema output through the normal schema generation workflow.

## 7. ControlBase

Preserve common source-visible preparation where it does not depend on a dynamic
subtype selector:

- visibility/unavailable defaults;
- recursive haptic defaults;
- label defaults;
- label positioning/style defaults.

Do not remove existing visibility validation until equivalent failure
timing/behavior is proven.

Generated label TextTool creation remains separate because absolute coordinates
depend on current parent geometry.

A parent geometry change may recreate the label tool. Once created, the label
child source is stable for that child lifetime.

## 8. Family-Wide Geometry Rule

All five concrete controls use:

```text
geometry.svg
```

No migrated control retains:

```text
config.svg
```

as a compatibility copy.

Subtype geometry extends the same owner.

### Button

Move button SVG/bounds and indicator placement inputs into geometry.

### Select

Move control bounds, segment division and indicator placement into geometry.

### Toggle

Move:

```text
svgVbW
svgVbH
renderTrackX
renderTrackY
renderTrackWidth
renderTrackHeight
on/off knob positions
live derived icon transform
```

to geometry/render-derived owners.

Generated shadow/filter IDs are instance render resources, not config.

### Slider

Calculate fixed physical bounds when config/group geometry changes and let
pointer/render paths consume those values.

State-dependent thumb positions remain derived from current runtime values.

### Number

Fold current `numberGeometry` into:

```text
geometry.*
```

and remove the parallel `numberGeometry` owner.

Keep `valueMeasurementSignature` and `valueMeasurementPass` as explicit
measurement lifecycle fields.

## 9. Toggle

Replace the current split constructor + `buildConfig()` lifecycle with a
recognizable canonical route.

Do **not** make current `buildConfig()` wholesale into the translator.

Target:

```text
stable template-visible source preparation
→ sourceConfig
→ JavaScript evaluation
→ pure Toggle structural translator
    validate evaluated orientation
    validate evaluated item_variant/item_viz/item_style
    select preset
    complete structural preset config
→ this.config
→ geometry / generated resources
```

Both initial dynamic evaluation and later changed JavaScript use the same
translator.

Static config uses the same translation semantics without a JavaScript pass.

### Dormant Toggle fields

Characterize fields currently calculated but not consumed by rendering.

In particular, checked/unchecked preset `iconStyles` and any other dormant
derived fields must not become newly active merely because 17B introduces a
paint route.

Rules:

```text
currently live behavior
→ preserve

proven dead derived field
→ may be removed in Pass B

dormant field becoming visible
→ separate functional change, not 17B
```

## 10. Button, Select, Number and Slider Translation

Do not preserve the current mistake of consuming dynamic selectors before
evaluation merely because those subtypes historically completed presets in their
constructors.

### Button

After evaluated selectors are concrete:

- validate variant/viz/style;
- select the surface/shape preset;
- complete the selected visualization structure;
- preserve explicit state-map replacement semantics;
- publish one complete canonical config.

### Select

After evaluated selectors are concrete:

- validate variant/viz/style;
- select style/shape preset;
- preserve configured option-map structure;
- keep HA option discovery out of config.

### Number

After evaluated selectors are concrete:

- validate variant/viz/style/orientation;
- select orientation-dependent structural defaults;
- select visual preset;
- preserve content shorthand behavior;
- publish one complete config.

### Slider

After evaluated selectors are concrete:

- validate `single/range`;
- validate `linear/circular`;
- validate `ha` style;
- choose visualization-dependent structural defaults;
- normalize circular thumb length and other selector-dependent structure;
- complete single/range `values` structure.

Do not add translators merely for naming symmetry; add them where concrete
post-evaluation interpretation is actually required.

## 11. Generated Content and Structural Inheritance

Preserve the current inheritance order:

```text
parent entity
→ shared content item
→ per-option/item override by ID
→ complete generated child source
→ generated placement / pointer-transparent actions
→ child construction
```

Structural inheritance is resolved once per generated child lifetime.

The complete generated child source does not need to be written back into the
parent's canonical config.

Button keeps shared configured content.

Select keeps shared configured content plus each option's authored override
dictionary.

Different Select options may therefore create different complete child sources
from the same shared item.

### ControlContent canonical reference

`ControlContent.config` may reference canonical parent configuration.

Therefore ControlContent must **not mutate that shared parent object in place**
while normalizing padding, margins, items, or generated child inputs.

Normalized construction inputs and completed generated-child values remain local
construction/geometry data unless they are already canonical parent config.

Config/geometry/option changes may legitimately end one child lifetime and create
a replacement. End old child resources first and activate replacements exactly
once.

## 12. Parent Paint

Remove runtime writes such as:

```js
child.tool.config.styles = ...
```

Use the existing contract:

```js
child.tool.setPaintStyles(completeResolvedMap);
```

Preserve the exact merge priority:

```text
visual-state icon/text styles
→ configured child styles
→ control transition
→ child state-map/color-stop/animation/filter cascade
```

Configured child styles therefore keep their current priority over parent
selected/active visual styles where that is current behavior.

Semantic parent paint applies only to the current semantic scope:

```text
Icon
Text
State/Name/Area adapted to Text
```

Do not inject that semantic paint into:

```text
Line
Circle
Horseshoe
Sparkline
```

which retain their independent presentation behavior.

Text font-metric paint changes must trigger the 16B measurement invalidation
route. Control code does not reset Text measurement fields directly.

Keep configured active/inactive and selected/unselected branches in config.

Use current runtime selection to derive the current map locally.

Do not create:

```text
paint.active
paint.inactive
paint.selected
paint.unselected
paint.optionStates
```

as duplicate configured branches.

## 13. Button Runtime

Move current state ownership to:

```text
runtime.active
runtime.stateMapItem
```

The state-map entry references configured mapping; it is not another config.

Do not mutate retained child source/config merely to show active/inactive state.

Preserve entity-backed and entityless behavior.

## 14. Select Runtime

`config.option_map` means configured options only.

`runtime.options` is the effective list consumed by selection, actions, child
construction and rendering.

### Configured options

```text
runtime.options
```

may reference the current `config.option_map` array directly.

Do not deep-clone an equivalent second owner.

### HA-derived options

Normalize:

```text
entity.attributes.options
→ runtime.options
```

without assigning to `config.option_map` or `sourceConfig`.

### Existing field ownership

```text
usesEntityOptions
    keep explicit immutable source-mode flag

optionsInitialized
    keep explicit readiness/lifecycle signal

entityOptionsSignature
    keep explicit HA-input change signal

selectedOptionIndex
    → runtime.selectedIndex

optionDisplayTexts
    → runtime.optionDisplayTexts

optionDisplayTextSignature
    keep explicit display-label change signal

optionActionConfigs
    → runtime.actionConfigs
```

Do not add `runtime.selectedValue` unless a real consumer is discovered.

Derive it locally from current options/index when needed.

Unchanged HA options under changed control config must not retain stale inherited
content/actions.

Group-only changes reposition content without renormalizing options.

Preserve state/value/text distinction and `option(...)` action replacement.

## 15. Slider Runtime and Lifecycle

Target runtime grouping:

```text
runtime.values
runtime.displayValues
runtime.available
runtime.scale
runtime.activeValueIndex
runtime.dragging
runtime.draggingThumb
runtime.lastWrittenSignature
```

`lastWrittenSignature` is interaction runtime, not a timer/RAF handle.

Keep direct lifecycle handles where that is clearer:

```text
renderFrame
stateAnimationFrame
writeTimer
pointerMoveListener
pointerUpListener
```

Preserve:

- single/range semantics;
- HA-derived scale attributes;
- unknown/unavailable behavior;
- pointer capture;
- snapping/clamping;
- circular mapping;
- throttled writes;
- animations;
- action semantics;
- disconnect cleanup.

## 16. Number Runtime

Move:

```text
minusActionConfig
→ runtime.minusActionConfig

plusActionConfig
→ runtime.plusActionConfig
```

Preserve exact increment/decrement action conversion.

Generated minus/plus/value child tools remain legitimate generated children.

Measurement scheduling remains explicit lifecycle work.

## 17. ControlTool Dispatcher

Keep ControlTool as subtype compile/dispatch only.

Remove the obsolete commented implementation in Pass B after the family is
green.

Do not replace explicit subtype flow with a generic control engine.

## 18. Shared Color-Stop Exception

Controls become structurally ready for canonical paint ownership, but the common
active color-stop owner is not moved while Sparkline/Horseshoe remain on the old
shared owner.

No partial duplicate owner is introduced.

The cross-family cutover remains Plan 19.

## 19. Implementation Sequence

Use six integrated steps.

### Step 1 — Characterization

Record before changing product code:

- per-subtype source preparation;
- fields/presets visible through `item`;
- dynamic selector behavior;
- current style merge priority;
- child lifecycle/reconstruction rules;
- current runtime fields;
- before-LOC.

Add failing regression tests for dynamic selectors that currently hit
constructor-order bugs.

### Step 2 — ControlBase / subtype translation / geometry

- establish post-evaluation selector interpretation;
- move all five `config.svg` owners to `geometry.svg`;
- split Toggle structural translation from derived geometry/resources;
- align Control selector schemas with dynamic JavaScript contract.

### Step 3 — Content / Button / child paint

- stable generated source per child lifetime;
- no ControlContent in-place mutation of canonical parent config;
- no child `config.styles` writes;
- preserve exact semantic paint scope and priority.

### Step 4 — Select

- configured option map stays config;
- HA options become runtime;
- migrate selection/display/action owners;
- retain reconstruction/change-signature behavior.

### Step 5 — Slider / Number

- migrate current runtime owners;
- move fixed geometry;
- move Number commands;
- keep explicit lifecycle handles.

### Step 6 — Pass B / review / acceptance

- remove proven aliases, base-style snapshots and duplicate completion routes;
- remove dead commented ControlTool code;
- remove proven dead Toggle derived fields without activating them;
- run independent implementation review.

Each integrated step leaves a working feature branch.

## 20. Mandatory Tests

Extend existing:

```text
control-content.test.js
control-family-theme-refresh.test.js
control-slider.test.js
control-toggle-config.test.js
tool-config-architecture.test.js
relevant group/card lifecycle/browser suites
```

Cover at minimum:

### Dynamic configuration ordering

For every Control subtype with selector-driven structure:

```text
static value
vs
equivalent JavaScript value
```

must converge on equivalent canonical config/geometry.

Test representative:

- orientation;
- item_variant;
- item_viz;
- item_style;
- selector-dependent content/preset.

No translator/preset selector receives raw `[[[...]]]`.

Add a live browser/FHS-input regression that switches at least Toggle style:

```text
ha → ios → industrial
```

and verifies the same tool follows the current input.

### Geometry

- no migrated `config.svg`;
- Number has no parallel `numberGeometry`;
- actual group `xpos` and `ypos` changes rebuild geometry correctly;
- theme-only changes do not rebuild unrelated geometry/source.

### Generated children

- inheritance is resolved once per child lifetime;
- selection alone retains child/source identity;
- real config/group/option reconstruction creates one new source;
- old embedded Horseshoe/Sparkline resources are released once.

### Paint

Assert runtime state changes do not modify:

```text
child.config.styles
child.sourceConfig.styles
```

and the complete current map appears under child `paint.styles`.

Cover:

- Button active/inactive;
- Select selected/unselected;
- entityless Button;
- Icon state-map/color-stop/animation precedence;
- Text remeasurement with unchanged text;
- semantic-only parent paint;
- no new paint injection into data-visualization children.

### Select

- HA option update without canonical config mutation;
- unchanged HA options after changed control config;
- labels/actions/state/value distinction;
- configured option array shared rather than duplicated.

### Slider

- single/range;
- horizontal/vertical/circular;
- dynamic selector equivalence;
- unavailable values;
- attribute scale/values;
- writes/animation/drag cleanup;
- `runtime.lastWrittenSignature`.

### Number

- commands;
- measured centering;
- dynamic orientation/style equivalence;
- measurement lifecycle retained.

## 21. Pass B

After all runtime presentation is outside child config:

- remove base-style snapshots proven redundant;
- remove repeated active/unselected merges that canonical paint replaces;
- collapse genuinely identical child reconstruction branches;
- remove old constructor/post-super Toggle completion;
- remove old direct runtime aliases after migration;
- remove obsolete ControlTool commented code.

Do not replace readable subtype logic with a generic control framework.

## 22. Verification

After focused tests:

1. run affected Node tests;
2. run lint;
3. run affected browser cases in Chromium, WebKit and Firefox;
4. run Rollup/build once for user visual validation;
5. if product/build inputs change after visual approval, rebuild and rerun affected
   browser cases before requesting new visual approval;
6. run full acceptance suite on the final approved revision.

Record exact results and independent review disposition.

## 23. Definition of Done

- Plan 16C generic evaluate-before-translate ordering is the only BaseTool route.
- No Control consumes unresolved JavaScript as a final selector/preset value.
- Static and equivalent dynamic Control selector configs converge on the same
  canonical semantics.
- Public Control schema and runtime agree about dynamic selector support.
- Every Control has recognizable config/geometry/runtime/paint ownership.
- All five controls use `geometry.svg`; no compatibility `config.svg` remains.
- Current HA option lists are runtime.
- Active/selected presentation no longer mutates child config.
- Generated children receive one stable generated source per child lifetime.
- ControlContent does not mutate canonical parent config in place.
- Slider interaction runtime includes `lastWrittenSignature`.
- Dormant Toggle fields are not accidentally activated.
- Existing interaction, styling, actions, lifecycle and measurement behavior is
  preserved.
- Shared active color-stop ownership remains staged for Plan 19.
- Mandatory Pass B cleanup and independent implementation review are complete.
