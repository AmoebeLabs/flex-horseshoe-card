# FILE: README.md

# FHS Canonical Architecture Audit Package

**Repository:** `AmoebeLabs/flex-horseshoe-card`  
**Audited master:** `dd89eb08f029400730ce59a4112be34bba44deeb`

This V2 package turns the clarified copy-compatible tool architecture into a concrete audit and migration programme for the current master source, including the execution-order and presentation-contract corrections found during review of V1.

## V2 corrections in ideas/refactor3

- `sourceConfig` is explicitly the stable **template-visible source**; existing JS-visible defaults remain before evaluation.
- shared active color stops are not partially moved; the owner cutover is atomic at the end of Plan 19.
- `text-tool-geometry.js` is retained through 15B and cleaned only after Text migrates in 16B.
- `paint.styles` / `setPaintStyles()` is the concrete retained-child presentation route, with existing style priority and text measurement behaviour preserved.

## Package contents

- `00-revision-v2.md` — the four execution-critical corrections applied to this revision.
- `01-canonical-architecture-contract.md` — strict vocabulary, ownership, lifecycle and readability contract.
- `02-current-master-audit.md` — current-master findings, feasibility analysis, family-by-family audit and support-module conclusions.
- `03-audit-matrix.csv` — all 72 product-owned `src/*.js` modules with action, risk, target plan and finding.
- `03-audit-matrix.json` — machine-readable version of the same matrix.
- `04-migration-sequence.md` — two-pass migration method and implementation order.
- `05-testing-and-verification.md` — regression strategy and architecture assertions.
- `06-existing-plan-supersession.md` — how the revised B-plans supersede earlier 15–18 architecture wording without discarding proven work.
- `15B-simple-tool-reference.md` — reference implementation and simple-tool rollout.
- `16B-canonical-config-lifecycle-and-text.md` — BaseTool lifecycle and TextTool migration.
- `17B-controls-canonical-architecture.md` — Controls migration.
- `18B-sparkline-canonical-series.md` — Sparkline migration.
- `19-horseshoe-path-canonical-architecture.md` — Horseshoe/Path migration.
- `20-whole-source-post-migration-audit.md` — strict final whole-source audit.
- `COMBINED-REPORT.md` — concatenated human-readable package.
- `SOURCES-AUDITED.txt` — complete 72-file product-owned audit scope.
- `manifest.json` — package metadata.

## Baseline recorded by current master documentation

| Metric | Current master / Plan 18 result |
| --- | ---: |
| Product-owned root `src/*.js` modules | 72 |
| Code lines | 23,665 |
| Comment-only lines | 5,550 |
| Blank lines | 3,156 |
| Physical lines | 32,371 |
| Node tests at Plan 18 acceptance | 507 |

The repository records that those Node tests, lint and Rollup passed and that affected browser regressions passed in Chromium, WebKit and Firefox.

## Central audit conclusion

The requested architecture is feasible on current master.

No audited tool or support module demonstrates a legitimate need for a second persistent **general tool configuration**. The difficult cases — Text parts, generated Control children, HA-derived Select options, Sparkline raw series restrictions and Horseshoe rank/string-state mapping — can all be represented with one canonical config plus explicit geometry/runtime/paint or a clearly named domain input.

The refactor should therefore preserve the existing proven algorithms and focus on ownership, naming, lifecycle alignment and the cleanup made possible after those responsibilities are colocated.

---

# FILE: 00-revision-v2.md

# Revision V2 — Execution-Order and Presentation Contract Sharpening

This revision keeps the same audited master (`dd89eb08f029400730ce59a4112be34bba44deeb`) and the same 72-module scope. It sharpens four execution-critical points discovered during review of the first package.

## 1. JavaScript evaluation context is a functional contract

The canonical route remains:

```text
sourceConfig
→ local newConfig
→ translateConfig(newConfig)
→ this.config
```

But `sourceConfig` is **not** defined as raw authored YAML before every tool default.

It is the stable **template-visible source** that preserves the current working evaluation context.

Where current behaviour makes a default or structural completion visible to JavaScript through `item`, that preparation stays before `sourceConfig` is captured.

Example: Arc currently supplies the default `radius: 45` before BaseTool evaluates JavaScript. Therefore a template such as:

```js
return item.radius * 2;
```

must continue to see `45` and produce `90` when the user omitted `radius`.

The migration must classify tool preprocessing into:

```text
PRE-SOURCE / TEMPLATE-VISIBLE
  established defaults/completion that current JS can see

POST-EVALUATION TRANSLATION
  normalization/validation/completion that can safely occur after JS
```

Moving code between those phases is a functional change unless characterization proves equivalence.

## 2. Theme-selected color stops require an atomic cross-family cutover

The final architecture still places theme-selected/active paint under `paint`, not canonical config.

However, current consumers span ordinary tools, Controls, Sparkline and Horseshoe. Therefore Plan 16B must **not partially relocate shared active color-stop ownership**.

The revised sequence is:

- 16B defines the final rule and prepares presentation ownership;
- 17B/18B/19 make their families compatible with the canonical paint model;
- at the end of Plan 19, perform one atomic shared color-stop owner cutover across all remaining consumers;
- Plan 20 verifies that no theme-selected active color-stop output remains stored as canonical config.

Until that cutover, the existing storage remains a documented temporary legacy exception. Do not introduce duplicate config+paint copies as an intermediate architecture.

## 3. `text-tool-geometry.js` remains through Plan 15B

Plan 15B migrates Name/Area/State geometry before TextTool itself is migrated.

Therefore `text-tool-geometry.js` must remain as the single temporary compatibility adapter during 15B. It may read canonical `tool.geometry` for migrated text-like tools and the current TextTool geometry representation for TextTool.

The helper may be removed or reduced only in **16B Pass B**, after TextTool exposes the same canonical geometry contract.

## 4. Parent-driven child styles get a concrete presentation route

The Controls plans may no longer say only “move child styles to paint”.

15B/16B establish a concrete minimal contract:

```text
config.styles
    stable canonical configured style source

paint.styles
    current parent/runtime-driven style replacement when present

getStyles()/effective style calculation
    consumes paint.styles when present, otherwise config.styles,
    then applies the existing animation/filter/theme cascade exactly as before
```

For migration safety, the parent control computes the same merged style map it currently assigns into `child.tool.config.styles`, preserving the existing merge order, and publishes it through a small presentation method such as:

```text
setPaintStyles(styles)
```

The exact method name may follow the proven 15B/16B reference, but its semantics are fixed: change runtime presentation without mutating canonical config.

Text measurement must use the **effective styles**, so a presentation change affecting font metrics invalidates the measurement signature and geometry exactly as the current config mutation does.

Characterization tests must lock down style precedence before the Controls migration. Do not invent a new priority order during refactoring.

---

# FILE: 01-canonical-architecture-contract.md

# Canonical Tool Architecture Contract

## 1. Objective

The architecture must make an unfamiliar tool predictable before its implementation is read.

The design target is **copy-compatible architecture**:

> Equivalent components use the same lifecycle methods, parameter meanings, data categories and canonical names. Tool-specific behaviour changes the contents of those methods and structures, not their architectural role.

A new tool should normally be able to start as a copy of a comparable existing tool. Its calculations and render body may be different; its surrounding architecture should remain recognisable.

This is not a functional rewrite. The architecture around proven code changes; proven calculations do not unless a small interface adaptation is necessary.

---

## 2. Tool source boundary and JavaScript evaluation order

For a BaseTool descendant, `sourceConfig` means:

> the stable **template-visible tool source** after established card-level compilation/routing and after any tool preparation that is already visible to JavaScript today, but before runtime, geometry or paint output.

This definition is deliberately behavioural rather than theoretical.

The current implementation sometimes applies defaults before BaseTool captures its source. Those defaults are not automatically architectural mistakes. If current JavaScript can observe them through `item`, moving them after evaluation changes user-visible behaviour.

Example:

```text
Arc user config omits radius
→ current Arc source preparation supplies radius: 45
→ template evaluates `item.radius * 2`
→ result is 90
```

The refactor must preserve that result.

### 2.1 Two classes of tool preprocessing

Every pre-existing constructor/factory transformation is classified before movement:

```text
PRE-SOURCE / TEMPLATE-VISIBLE
  defaults or structural completion current JS can observe
  → must remain before sourceConfig is captured/evaluated

POST-EVALUATION TRANSLATION
  validation/normalization/completion not required by current JS context
  → belongs in translateConfig(newConfig)
```

Do not move code from the first category to the second merely to make the diagram prettier.

Card-level compilation may continue to perform established operations such as:

- card templates;
- `ref()` and `calc()`;
- `same_as`;
- compounds;
- IDs;
- disabled filtering;
- entity-slot/index addressing;
- section routing and legacy section identification where required.

A tool may use a small pure source-preparation function before BaseTool when current behaviour requires template-visible defaults. That preparation creates `sourceConfig`; it is **not** a second persistent current config.

The architecture requirement is that the meaning and ordering are explicit and testable, not that every default is forcibly moved after JavaScript.

---

## 3. The single current-configuration route

Once the stable template-visible source exists, every BaseTool descendant conceptually follows one route:

```text
compiled/routed item
    ↓
prepare template-visible source when current behaviour requires it
    ↓
sourceConfig
    ↓
evaluate dynamic JavaScript with the same item/context ordering as today
    ↓
newConfig                    local/transient only
    ↓
translateConfig(newConfig)   post-evaluation canonical translation
    ↓
this.config                  sole current canonical tool configuration
```

### Rules

- `sourceConfig` is stable and preserves the established template-visible defaults/context.
- `sourceConfig` never receives geometry, runtime or paint output.
- JavaScript evaluation order and `item` semantics are part of the functional contract.
- `newConfig` exists only as a local variable during processing.
- `newConfig` is never persisted as `this.newConfig`.
- `this.config` is the only current canonical tool configuration.
- `setState()` never publishes or swaps a configuration.
- group/layout changes do not create another config.
- theme changes do not create another config.
- current HA state does not create another config.
- a runtime item may reference a subtree of `this.config`; it may not reconstruct and own another effective general config.

Persistent general aliases such as the following are therefore not valid end-state architecture:

```text
activeConfig
activeItemConfig
runtimeConfig
effectiveConfig
resolvedConfig
acceptedConfig
candidateConfig
normalizedConfig
stateData.config
```

A local variable named `normalizedConfig` or `effectiveConfig` during one pure preparation/translation is not inherently wrong. The rule concerns persistent ownership and multiple semantic current-config routes.

---

## 4. Safe translation implementation

Uniform translation must not be implemented by invoking an overridden subclass method from the BaseTool constructor before subclass construction is complete.

For example, this is too fragile as a generic mechanism:

```js
class BaseTool {
  constructor(config) {
    this.config = this.translateConfig(config);
  }
}
```

because the overridden translator may eventually depend on subclass state that has not been initialized yet.

The reference implementation should instead use a pure/static/explicit translator contract with stable inputs. Exact wiring is proven on the simple tools in Plan 15B.

The important invariant is not the syntax of the hook. It is that **initial construction and later JS reevaluation preserve the same source-preparation, JavaScript-context and translation semantics**.

A translator may not be made “more uniform” by moving a currently template-visible default to a point after JavaScript evaluation.

---

## 5. Canonical data vocabulary

Shared concepts use shared names. Local synonyms for the same architectural concept are not introduced.

### 5.1 Configuration

```text
sourceConfig
newConfig
this.config
```

### 5.2 Geometry

```text
this.geometry
this.geometrySignature
```

Typical members may include:

```text
geometry.svg
geometry.bounds
geometry.pathInput
geometry.pathDefinition
geometry.path
geometry.transform
geometry.axis
geometry.measurement
```

The contents are tool-specific. The owner name is not.

### 5.3 Runtime

```text
this.runtime
this.runtimeSignature
```

Typical members may include:

```text
runtime.entity
runtime.entityConfig
runtime.value
runtime.state
runtime.uom
runtime.mappedState
runtime.stateMapItem
runtime.options
runtime.selectedIndex
runtime.progress
runtime.available
runtime.dragging
```

The shared container is called `runtime`, not `state`, because `StateTool` legitimately has a domain value called state.

### 5.4 Paint / presentation

```text
this.paint
this.paintSignature
```

Typical persistent derived presentation data may include:

```text
paint.styles
paint.colorStops
paint.gradient
paint.ranges
paint.marker
```

Do not create an empty paint object in every tool merely for symmetry. The rule is:

> if the same category exists, it has the same name and semantic owner.

Theme-selected active color-stop output is a final-state paint concept, but its owner must not be moved partially. Because ordinary tools, Controls, Sparkline and Horseshoe currently consume active color stops from config-shaped data, the shared cutover is performed atomically only after all families are prepared. Until that cutover, the current location is a documented temporary legacy exception; no duplicate persistent config+paint owner is introduced.

### 5.5 Effective style / parent-presentation contract

`config.styles` remains canonical configuration.

When current runtime/parent state must change how a retained child tool is presented, that change is published as paint rather than by modifying the child config.

The minimal migration contract is:

```text
config.styles
    stable configured style source

paint.styles
    current runtime/parent-driven replacement style map when present

effective styles
    use paint.styles when present, otherwise config.styles,
    then apply the existing animation/filter/theme cascade
```

A small method such as `setPaintStyles(styles)` may be used so a retained child can receive runtime presentation without exposing config mutation as an API.

For migration safety, callers initially publish the **same fully merged style map they currently assign to `config.styles`**. This preserves the existing style priority mechanically. Do not invent a universal new priority order during this refactor.

Text-like measurement must use the effective styles. If an effective presentation change alters a measurement-relevant property, the measurement signature/geometry is invalidated exactly as under the current config-mutation route.

Characterization tests must establish current precedence where parent state styles and configured child styles overlap.

### 5.6 Unique domain data

Unique responsibilities may retain clear domain names:

```text
history
graph
animation
requests
cache
statistics
```

Support modules do not need to imitate BaseTool. They still use canonical shared vocabulary where shared concepts occur.

A derived graph calculation contract, for example, should not be called public `config` if it is not configuration ownership.

---

## 6. Shared lifecycle vocabulary

Where present, these lifecycle methods keep the same role and parameter meaning:

```text
constructor(...)
translateConfig(config)
updateRuntimeConfig()
setState(entity, entityConfig)
connected()
disconnected()
hassAvailable()
hassConnected()
firstUpdated()
updated()
render()
```

A tool need not implement every no-op itself if BaseTool already owns it.

The key rule is that when the method exists, a developer already knows what category of work to find there.

### `updateRuntimeConfig()`

- runs the common config-update route;
- reacts to actual canonical config changes;
- invalidates/rebuilds config-derived geometry/paint as appropriate;
- does not process current HA state as configuration.

### `setState(entity, entityConfig)`

- processes current runtime entity state;
- may derive runtime and state-dependent paint;
- does not replace `this.config`.

### `connected()` / `disconnected()`

- own DOM/connection lifetime resources;
- use the same semantic contract across every tool and support component that exposes these methods.

### `render()`

- consumes canonical config plus current derived owners;
- does not repair or rebuild configuration.

---

## 7. Linear readability rule

Lifecycle methods should show their important steps in execution order.

Preferred shape:

```js
updateRuntimeConfig() {
  super.updateRuntimeConfig();

  if (this.geometryChanged) {
    this.updateGeometry();
  }

  if (this.paintChanged) {
    this.updatePaint();
  }
}
```

A longer linear function can be clearer than a chain of tiny wrappers.

Extract a helper when:

- the block represents a genuine independent calculation;
- it is reused;
- or the parent function would otherwise become genuinely difficult to scan.

Do not extract a helper merely to move five readable lines somewhere else.

The opposite extreme is also avoided: a thousand-line lifecycle function is not “linear simplicity”. Large self-contained calculations such as path creation, axis translation or series translation are legitimate helpers.

---

## 8. Preserve / Adapt / Remove

Every implementation diff should be explainable as one of these categories.

### PRESERVE

Proven functional code remains semantically unchanged:

- Home Assistant entity/state interpretation;
- state/value conversion;
- formatting;
- color conversion/interpolation;
- path algorithms;
- history request/time calculations;
- Sparkline graph math;
- text measurement behaviour;
- pointer/action behaviour;
- existing normalization algorithms whose semantics are not the architecture problem.

### ADAPT

Small glue changes are expected because ownership changes:

```text
config.svg              → geometry.svg
config.mapped_state     → runtime.mappedState
numberGeometry          → geometry
resolvedEntityConfigs   → runtimeEntityConfigs
graphConfig             → graphInput
```

### REMOVE / REPLACE

Architectural ballast is in scope:

- parallel config owners;
- repeated parent/child config merges;
- HA runtime state written into config;
- theme/state-derived paint written into config;
- config copies used only as a change state;
- helpers made unnecessary by colocation;
- duplicate lifecycle routes;
- local synonyms for canonical owners;
- child tool config mutation used as runtime presentation state.

---

## 9. Generated child tools

Controls legitimately generate child Text/Icon/State/etc. tools.

The rule is:

> A generated child may receive generated source configuration at construction, but once constructed it follows the same stable-source / canonical-config rules as every other tool.

A parent geometry change may recreate a child with a new generated source if that is the simplest existing design.

What is not allowed is retaining a child and using its `config` as mutable runtime paint storage.

---

## 10. Change detection

Change detection is derived from canonical owners, not from another configuration layer.

Examples:

```text
configSignature
geometrySignature
runtimeSignature
paintSignature
presentationSignature
```

Use the name that describes what is actually compared.

`presentationSignature` remains a valid concept when it intentionally covers the final visible result rather than paint alone.

---

## 11. Searchability is an architecture requirement

A maintainer should be able to search for:

```text
sourceConfig
translateConfig
this.config
geometry
runtime
paint
connected
disconnected
setState
render
```

and land on the expected responsibility without memorising every tool.

Therefore:

> canonical concepts use canonical names across the codebase; different names imply genuinely different responsibilities.

---

## 12. New-build test

After every family migration ask:

> If this tool were created today using the canonical architecture, would we still choose this ownership, naming and lifecycle structure?

This question applies to architecture, not to working algorithms.

A path, color, history or formatting routine is not rewritten merely because a different implementation could be imagined today.

---

# FILE: 02-current-master-audit.md

# Current Master Architecture Audit

**Repository:** `AmoebeLabs/flex-horseshoe-card`  
**Audited ref:** `master` at `dd89eb08f029400730ce59a4112be34bba44deeb`  
**Audited product scope:** all 72 product-owned root `src/*.js` modules.

## 1. Scope and method

The audit is deliberately broader than the BaseTool hierarchy.

Every product-owned root JavaScript module was inspected against the same semantic questions:

1. What does this module own?
2. Does `config` actually mean configuration?
3. Does current mutable data have a recognisable runtime owner?
4. Does geometry live under a recognisable geometry owner?
5. Does state/theme-derived visual output live as paint/presentation rather than config mutation?
6. Are the same concepts named the same way as elsewhere?
7. Does a lifecycle method have the same meaning as the same method elsewhere?
8. Is data persisted twice under historical names?
9. Does a helper exist because responsibilities are truly separate, or only because code is historically scattered?
10. Can the existing calculation remain untouched while ownership is corrected?

The tool hierarchy is held to the strict canonical contract. Support modules are not forced into BaseTool shape, but shared concepts must use recognisable semantics.

Excluded from the architecture target:

- copied Home Assistant frontend code under `src/frontend_mods/`;
- `.orig` and rebase/backup files;
- tests, docs, generated/dist output and builder/schema projects.

Those exclusions are explicit, not omissions.

---

## 2. Current baseline

The current repository's Plan 18 result records:

| Metric | Value |
| --- | ---: |
| Product-owned root `src/*.js` modules | 72 |
| Code lines | 23,665 |
| Comment-only lines | 5,550 |
| Blank lines | 3,156 |
| Physical lines | 32,371 |
| Node tests at Plan 18 acceptance | 507 |

It also records passing lint/Rollup and affected browser regression tests in Chromium, WebKit and Firefox.

This audit therefore starts from a functionally proven master and treats existing calculations as assets to preserve.

---

## 3. Overall feasibility conclusion

The canonical architecture is **feasible** on current master.

No audited tool or support module demonstrates a legitimate need for a second persistent general tool configuration.

The difficult cases are real but bounded:

1. `TextTool` has per-part source/evaluated/render state outside BaseTool.
2. Controls generate child tools and currently use child `config.styles` as runtime presentation storage.
3. `ControlSelect` receives an option list from current HA entity attributes and currently writes that list into config.
4. Sparkline must validate some facts on the raw series override before inheritance removes those facts.
5. `SparklineGraph` calls a derived graph calculation input `config` although it is not the public tool config owner.
6. Horseshoe rank/string-state conversion currently derives a state-specific scale, state map and color stops and packages them as a new `config`.
7. theme-aware color-stop normalization currently combines structural normalization and active mode selection.

None of those behaviours requires preserving parallel general configuration ownership.

They can be represented by:

```text
canonical config
+ geometry
+ runtime
+ paint
+ explicitly named domain inputs where needed
```

The refactor should therefore be an ownership reconstruction, not a product rewrite.

---

## 4. Action taxonomy

Each module receives one or more of these actions:

- **KEEP** — architecture/ownership is already appropriate.
- **RENAME** — responsibility is correct, vocabulary is not canonical.
- **MOVE** — existing value/calculation belongs under another owner.
- **MERGE** — multiple routes/owners represent one lifecycle.
- **ADAPT** — small glue/interface change is needed after a move.
- **CLEANUP / REMOVE** — historical structure becomes unnecessary.
- **REWORK** — ownership/lifecycle is materially wrong; proven algorithms still remain.
- **REVIEW** — the final name/shape should be decided after neighbouring migration makes the simplest result visible.

---

## 5. Current-master anchors

### 5.1 BaseTool

Current `BaseTool` already contains an important part of the desired model:

```text
sourceConfig
local newConfig
this.config
```

but the boundary is not yet explicit enough.

The class clones the `config` it receives into `sourceConfig`. Many subclasses have already applied defaults or structural completion before that call. The audit initially treated that uniformly as a defect; the review found that some of those values are part of the **existing JavaScript `item` context** and therefore must remain before source capture/evaluation.

The required change is not “move all preprocessing after BaseTool”. It is to classify it consistently as template-visible source preparation versus post-evaluation translation.

`updateRuntimeConfig()` then:

- identifies configuration/group/theme changes;
- evaluates JS to a local `newConfig`;
- materialises color stops;
- publishes `this.config`;
- updates z-position state.

This is a good foundation, not the final contract.

Required change:

```text
card-level compiled/routed item
→ preserve established template-visible defaults/completion
→ sourceConfig
→ evaluate with current item/context ordering
→ post-evaluation tool translation
→ this.config
```

The common BaseTool route must ultimately stop being the place where active theme paint becomes indistinguishable from canonical config. Because active color-stop consumers span multiple families, that owner change is deferred to one atomic cutover after the families are prepared; no partial duplicate owner is acceptable.

A key implementation constraint is that BaseTool must not call an overridden subclass translator before subclass construction is complete.

### 5.2 Main/CardTools lifecycle proves the target order

The current card lifecycle already provides an important guarantee:

```text
updateRuntimeConfig()
→ publish current tool config/derived configuration work
→ set runtime entity states
```

`main.js` / `CardTools` therefore already support the desired rule that `setState()` can trust current config and should not manufacture a new one.

`CardTools` is one of the stronger architectural modules in the codebase. It owns collections and forwards lifecycle phases instead of interpreting every tool's internals.

### 5.3 Simple shapes

The simple tools are the best proving ground because most required changes are mechanical.

Current pattern:

```text
defaults before super
→ BaseTool receives prepared object
→ JavaScript can therefore observe some defaults through item
→ config.svg = calculateSvgDimensions()
```

This occurs in Arc/Circle/Rectangle and related forms. The defaults must be classified before movement. Arc `radius: 45` is confirmed template-visible and therefore remains in pre-source preparation.

Line additionally has legacy `hlines` / `vlines` translation and orientation validation.

Polygon stores:

```text
config.svg
pathConfig
pathDefinition
```

Target:

```text
config
geometry.svg
geometry.pathInput
geometry.pathDefinition
```

The existing geometry equations and path generators do not need redesign.

### 5.4 Rectangle ordering constraint

Rectangle fit geometry can depend on measured text geometry.

Moving the result from `config.svg` to `geometry` must preserve the existing timing in which an estimated measurement can later be corrected by actual DOM measurement.

This is an ordering concern, not a reason for config/geometry mixing.

### 5.5 Name / Area / State

These tools make the ownership problem particularly visible.

They have configuration, displayed runtime content, estimated geometry and measured geometry, but those categories are currently stored as unrelated direct fields.

Target examples:

```text
NameTool
  config
  runtime.name
  geometry.svg
  geometry.estimatedWidth
  geometry.measuredWidth

StateTool
  config
  runtime.state
  runtime.uom
  geometry.*
```

`StateTool` is the concrete reason the generic shared container should be called `runtime`, not `state`.

Formatting and measurement routines remain untouched.

### 5.6 Icon

Icon already demonstrates a good distinction:

```text
config.state_map
current selected map entry (local)
```

It does not need a persistent second config for the selected entry.

Required work is primarily:

- `config.svg` → `geometry.svg`;
- optionally expose a persistent selected map item as `runtime.stateMapItem` only if it is actually reused;
- keep the effective render item local;
- keep `HomeAssistantIconPath` async lifecycle as-is.

### 5.7 TextTool

Text is the first major ownership deviation.

Current persistent structures include:

```text
sourceTextParts
activeTextParts
activeTextPartsSignature
textParts
```

These form a separate parts configuration/evaluation pipeline next to BaseTool.

The target is:

```text
sourceConfig.text[]
→ translation/evaluation
→ config.text[]

runtime.textParts
geometry.measurement / fitting
```

The migration must preserve:

- per-part entity context;
- per-part JavaScript;
- source State/Name/Area tools;
- state-map overrides;
- localization;
- color-stop behaviour;
- wrapping, ellipsis and fit;
- DOM measurement and rerender timing.

After the move, `sourceTextParts` and `activeTextParts` should be kept only if they still represent unique concepts. If they merely mirror `sourceConfig.text` and `config.text`, they disappear in Pass B.

`text-tool-geometry.js` is deliberately retained as a single compatibility adapter during 15B because TextTool migrates only here in 16B. It is removed/reduced only after Text exposes the same geometry contract.

### 5.8 Controls

Controls contain both a useful pattern and several ownership violations.

Useful pattern:

```text
common/default
+ subtype/style
+ item override
→ complete concrete item
```

That is exactly the inheritance model the canonical architecture wants.

The problem is that completion and runtime presentation are split across different stages.

#### ControlBase

Common defaults, haptics and label completion run before BaseTool. Before moving them, classify which values current JavaScript can observe through `item`; those remain template-visible source preparation. The generated label TextTool can remain a generated child, but its source/config must follow the same child contract.

#### ControlContent

It currently resolves parent entity + source item + per-item override, then later `setState()` mutates `child.tool.config.styles`.

Target:

```text
complete item config once
+ generated child geometry
+ runtime/paint visual state
```

The revised plan makes that presentation route concrete: retained child tools receive the same currently merged style map through `paint.styles` / `setPaintStyles()` instead of config mutation. Characterization tests preserve existing merge priority and Text measurement effects.

#### Toggle

Current route contains both:

```text
constructor → super → buildConfig(this.config)
```

and a later dynamic-config route that calls `buildConfig()` again.

That is a direct example of a tool-specific second completion route and should become one translator.

#### Button

State-map selection is legitimate runtime state. Writing active/inactive visual styles into child config is not.

#### Select

The clearest config/runtime violation is:

```text
HA entity.attributes.options
→ this.config.option_map
```

Target:

```text
config.option_map       authored config only
runtime.options         effective current options
runtime.selectedIndex
runtime.actionConfigs
paint.optionStates
```

#### Slider

Slider is healthier. Most entity-driven values are already separate, but naming/ownership is scattered across:

```text
sliderValues
displaySliderValues
sliderAvailable
resolvedScale
activeValueIndex
dragging
...
```

These can move mechanically under `runtime` while pointer/keyboard/action calculations remain unchanged.

#### Number

`numberGeometry` is already correctly recognised as geometry conceptually; it simply needs the canonical owner name. Generated action configs are runtime-derived.

### 5.9 Sparkline

Sparkline is large, but the core architectural issue is narrow and identifiable.

#### GraphTool

The constructor performs substantial defaults/legacy/style/period/validation work before BaseTool and later maintains several derived forms. That pre-BaseTool work must be classified by JavaScript visibility; it is not safe to move wholesale after evaluation:

```text
this.svg
this.config.svg
this.graphConfig
```

The end-state should make the categories explicit instead of reducing the 6,000-line coordinator by arbitrary extraction.

#### Series

Current `SparklineSeries.updateConfig()` effectively does:

```text
raw configured series
→ merge parent + override
→ effectiveConfig
→ persistent item.config
```

That is the main Plan 18B configuration violation.

Target:

```text
GraphTool translation
  raw override validation
  parent + override merge
  paint precedence
  completed config.series[]

Series
  runtime identity
  entity binding
  request/data state
  graph/layout coordination
```

Raw override-only restrictions **must still run before merge**, because some facts disappear after inheritance. This is a local translation concern, not a reason for a second persistent config owner.

#### History

History is a strong unique domain owner. Its method named `updateConfig()` receives period/state-map/series/runtime inputs rather than owning public configuration. `updateInputs()` is more accurate.

The history request/timer/row/time algorithms remain.

#### Graph

`SparklineGraph` receives a derived calculation object from GraphTool and calls it `config`.

That object should be renamed to `input` or `graphInput` because it is not the tool's canonical configuration.

This can be a large mechanical rename, so it should be isolated and verified rather than mixed with graph math.

### 5.10 Horseshoe

Horseshoe is the strongest current violation and therefore belongs late in the sequence.

Current `HorseshoeGauge` maintains or swaps among:

```text
activeItemConfig
runtimeConfig
this.config
stateData.config
pathConfig
```

`setState()` explicitly replaces `this.config` with a state-derived object.

At the same time, the class already contains distinct geometry/paint concepts such as PathGeometry, path definitions, transforms, gradients, ranges and state paints. The new architecture therefore aligns with concepts already present rather than inventing an alien model.

Target:

```text
config
  translated horseshoe configuration

geometry
  svg
  pathInput
  pathDefinition
  pathGeometry
  transformedPathGeometry
  transform
  path element geometry

runtime
  value
  mappedState
  active state map
  progress
  animation/value mapper runtime

paint
  active color stops
  scale/state gradients
  state ranges/segment paints
  marker/background/label/tick paint
```

#### horseshoe-state

`getGaugeStateData()` currently returns a new config for string color stops, rank-state and normal mapped state.

The algorithm itself should stay. Its output contract changes to explicit derived values, for example:

```text
rawState
value
mappedState
stateMap
renderColorStops
scaleOverride
```

Those outputs then feed runtime/paint rather than another config.

#### Support path modules

The Path V3 modules are mostly healthy and should not be dragged through a tool-style rewrite.

`PathGeometry` in particular is already a good example of clear domain naming.

The main support changes are contract names such as:

```text
pathConfig → pathInput
PathValueMapper(config) → PathValueMapper(options/input)
```

where the object is not tool configuration.

### 5.11 Theme/color stops

`ColorStops.normalize(value, mode)` is proven conversion code and should remain.

The architectural question is where its active mode-selected result lives.

Do not replace the color-stop parser/interpolator during this project.

### 5.12 Support modules

Support code is generally more consistent than the tools and should not be forced into a framework.

Notable semantic cleanups:

- `main.js`: `resolvedEntityConfigs` should align with `buildRuntimeEntityConfigs()` and become `runtimeEntityConfigs`.
- `CardLayout`: review `sourceGroupConfigs` / `activeGroupConfigs`; preserve a second object only if it is a real dynamic group configuration lifecycle, not historical naming.
- `CardConfig.initializeCardRuntimeDefaults()`: the method writes configuration defaults, so “runtime” is misleading.
- `ExternalSvgSources.setConfig()`: the method resets request state rather than setting config.
- `SparklineHistory.updateConfig()`: update history inputs, not public config.
- `SparklineGraph.config`: graph calculation input, not public config.
- `PathValueMapper(config)`: domain options/input, not tool config.

---

## 6. Feasibility constraints

### 6.1 Internal generated children

Controls can continue to generate real child tools. Recreating a child because parent geometry changed is compatible with the architecture.

The important distinction is:

```text
new generated child source/config      allowed
mutating retained child config as state/paint storage   not allowed
```

### 6.2 Sparkline raw series validation

The translation phase must keep temporary access to the raw override long enough to validate restrictions that cannot be reconstructed from the inherited result.

This local data is not another persistent config lifecycle.

### 6.3 Horseshoe rank/string-state conversion

Rank/string-state mapping changes several derived outputs together. Keep that calculation cohesive even when its result is published into different owners.

Do not split the algorithm merely to make the containers look pure.

### 6.4 Base constructor safety

Do not achieve “one translator everywhere” with unsafe virtual dispatch from the BaseTool constructor.

### 6.5 Measurement timing

Text/Rectangle fitting depends on estimated then measured geometry. Ownership changes must not alter the established correction timing.

---

## 7. Expected migration depth

### Mostly mechanical MOVE / RENAME

- Arc
- Circle
- Line
- Rectangle
- Polygon
- Name
- Area
- State
- Icon
- text geometry adapter
- several support vocabulary cleanups

### Moderate ownership change

- BaseTool
- ControlBase
- Number
- Slider
- CardLayout terminology
- SparklineHistory input naming
- SparklineGraph calculation-input naming
- Horseshoe label/marker/tick helper contracts

### Deep ownership reconstruction, algorithms preserved

- TextTool
- ControlContent / Button / Select / Toggle
- SparklineGraphTool / SparklineSeries
- HorseshoeGauge / horseshoe-state

---

## 8. Complete 72-module audit matrix

The same matrix is available as CSV and JSON in the package.

| Module | Kind | Action | Risk | Plan | Finding |
| --- | --- | --- | --- | --- | --- |
| `src/action-handler.js` | support/runtime | KEEP | Low | 20 | Local options/state are runtime concepts and do not masquerade as FHS tool configuration; lifecycle cleanup is explicit. |
| `src/arc-tool.js` | tool/simple shape | MOVE; RENAME | Low | 15B | Arc defaults are currently template-visible (radius 45 must remain visible to item before JS). Preserve that pre-source preparation; move derived SVG to geometry and keep arc math. |
| `src/area-tool.js` | tool/text-like | MOVE; RENAME | Medium | 15B | xpos/ypos defaults are applied before BaseTool and may be template-visible; preserve current JS context, then move displayed area to runtime and SVG/measurement fields to geometry. |
| `src/base-tool.js` | tool base | REWORK | High | 15B;16B | sourceConfig currently captures the prepared template-visible object. Make source preparation explicit, preserve JS item/context order, then use one post-evaluation translation route; geometry/paint/runtime stay separate. |
| `src/card-actions.js` | support/domain | KEEP | Low | 20 | Action configs are real configuration inputs and executable copies are local/transient; no parallel persistent config owner. |
| `src/card-animations.js` | support/paint | KEEP; REVIEW | Low | 20 | Owns presentation output cleanly. Keep domain styles; only align vocabulary if final paint terminology makes a direct rename clearer. |
| `src/card-config.js` | support/config compiler | RENAME; REVIEW | Low | 20 | Legitimate config owner. initializeCardRuntimeDefaults writes configuration defaults, so rename if retained; preserve proven compilation routines. |
| `src/card-entities.js` | support/runtime config | RENAME; REVIEW | Medium | 20 | buildRuntimeEntityConfigs is semantically correct, while callers use resolvedEntityConfigs. Standardize one term; review theme-selected color-stop ownership. |
| `src/card-input-entities.js` | support/runtime | KEEP | Low | 20 | this.config is actual card configuration and entity state is separate runtime data. |
| `src/card-layout.js` | support/layout | RENAME; REVIEW | Medium | 20 | Own dynamic group source/current lifecycle is legitimate, but sourceGroupConfigs/activeGroupConfigs should be checked against canonical vocabulary and duplicate state. |
| `src/card-styles.js` | support/static | KEEP | Low | 20 | Static stylesheet only. |
| `src/card-templates.js` | support/config compiler | KEEP | Low | 20 | Intentional config-time compiler before tool source boundaries. |
| `src/card-theme.js` | support/runtime/paint | KEEP | Low | 20 | Clear owner of theme runtime and paint context; connected/disconnected lifecycle is already consistent. |
| `src/card-tools.js` | support/tool coordinator | ADAPT; CLEANUP | Low | 15B-20 | Good lifecycle coordinator. Adapt geometry lookup to canonical tool.geometry; text-tool-geometry may become removable. |
| `src/child-cards.js` | support/domain | KEEP; RENAME | Low | 20 | cardsConfig is recognizable configuration and child items are runtime/domain data. Optional terminology cleanup only. |
| `src/circle-tool.js` | tool/simple shape | MOVE; RENAME | Low | 15B | Radius/default preparation currently precedes BaseTool and may be template-visible. Preserve evaluation order, then move derived SVG to geometry; keep radius behavior. |
| `src/color-filter.js` | support/paint | KEEP | Low | 16B;20 | Proven paint/conversion implementation; ownership at callers may change, algorithm should not. |
| `src/color-stops.js` | support/config+paint | ADAPT; REVIEW | Medium | 16B | Preserve proven normalization. Final active theme-selected result belongs to paint, but owner cutover is atomic across all families at end of Plan 19; no duplicate persistent owner. |
| `src/colors.js` | support/paint | KEEP | Low | 20 | Proven calculation library; explicitly outside functional rewrite scope. |
| `src/compounds.js` | support/config compiler | KEEP | Low | 20 | Correct config-time compiler; output feeds normal tool source. |
| `src/config-helper.js` | support/helper | KEEP | Low | 20 | Stateless helper with no ownership issue. |
| `src/const.js` | support/static | KEEP | Low | 20 | No mutable architecture state. |
| `src/control-base.js` | tool/control base | MERGE; MOVE | Medium | 17B | Common defaults/haptics/label completion may be template-visible today. Characterize and preserve order; migrate child presentation to the canonical paint route without config mutation. |
| `src/control-button.js` | tool/control | REWORK | High | 17B | Button defaults/presets precede BaseTool and may be JS-visible. Preserve source order; move SVG/selection to geometry/runtime and publish selected visual styles through child paint with unchanged merge priority. |
| `src/control-content.js` | support/control child owner | REWORK | High | 17B | Resolve effective child source once. Replace runtime child config.styles mutation with the 16B paint.styles/setPaintStyles route, preserving exact merge priority and Text measurement effects. |
| `src/control-number.js` | tool/control | MOVE; RENAME; ADAPT | Medium | 17B | Defaults/presets and normalized source currently precede BaseTool and may be JS-visible. Preserve source/evaluation order; move numberGeometry to geometry and generated actions to runtime. |
| `src/control-select.js` | tool/control | REWORK | High | 17B | Select defaults/presets precede BaseTool and may be JS-visible. Preserve source order; HA options become runtime and selected child styles use paint with unchanged priority; shared color-stop cutover waits for Plan 19. |
| `src/control-slider.js` | tool/control | MOVE; RENAME; ADAPT | Medium | 17B | Defaults/variant completion precedes BaseTool and may be JS-visible. Preserve source/evaluation order; consolidate existing runtime values/scale/availability and move SVG to geometry without changing interaction math. |
| `src/control-toggle.js` | tool/control | MERGE; REWORK | High | 17B | Toggle has template-visible constructor preparation plus a second post-super buildConfig route. Preserve current JS-visible source defaults, then unify post-evaluation completion and move SVG to geometry. |
| `src/control-tool.js` | support/dispatcher | CLEANUP | Low | 17B | Active code is a dispatcher. Remove obsolete commented implementation in post-migration cleanup; retain routing. |
| `src/fhs-input-number.js` | support/config+runtime helper | KEEP | Low | 20 | Proven config normalization and bounded runtime math; no persistent competing owner. |
| `src/fhs-input-select.js` | support/config helper | KEEP | Low | 20 | Pure config-time normalization. |
| `src/group-manager.js` | support/layout | KEEP; RENAME | Low | 20 | Clear layout owner. Update comments/parameters that describe items as active runtime config once canonical tool config is established. |
| `src/home-assistant.js` | support/runtime | KEEP | Low | 20 | Strong reference for consistent runtime ownership and connected/disconnected semantics. |
| `src/horseshoe-gauge.js` | tool/complex | REWORK | Very High | 19 | Current source is prepared by Horseshoe normalization before BaseTool and may be JS-visible. Preserve that order while removing config swapping and separating geometry/runtime/paint. |
| `src/horseshoe-geometry.js` | support/calculation | KEEP; RENAME | Low | 19 | Proven geometry/math. Constructor config arguments can be made domain-specific if useful; calculations stay intact. |
| `src/horseshoe-labels.js` | support/presentation | ADAPT; RENAME | Medium | 19 | Consumes runtimeConfig.mapped_state, demonstrating config/runtime conflation. Change contract to explicit config plus runtime/geometry inputs. |
| `src/horseshoe-marker.js` | support/presentation | ADAPT; RENAME | Low | 19 | pathConfig is really path input/geometry. Rename contract and consume canonical geometry/runtime/paint values. |
| `src/horseshoe-state.js` | support/config+runtime | REWORK | High | 19 | normalizeBaseConfig may contribute template-visible source values while normalizeRuntimeConfig/getGaugeStateData mix later config/runtime/paint. Preserve source order; split post-evaluation translation from runtime mapping/paint without changing algorithms. |
| `src/horseshoe-tickmarks.js` | support/presentation | ADAPT; RENAME | Low | 19 | Update contracts that currently expect mixed runtime config; preserve calculations. |
| `src/icon-source.js` | support/async | KEEP | Low | 15B;20 | Async lifecycle is clean and domain-specific; tool should consume its results as runtime/presentation data. |
| `src/icon-svg-source.js` | support/async | RENAME | Low | 20 | setConfig only clears requests and does not set configuration; rename to a lifecycle-accurate action if touched. |
| `src/icon-tool.js` | tool/stateful | MOVE; RENAME; ADAPT | Medium | 15B | State-map separation is already good. Move SVG to geometry; selected map item may be runtime/local; avoid persistent merged render config. |
| `src/layout-sections.js` | support/static | KEEP | Low | 20 | Good shared registry and vocabulary source. |
| `src/line-tool.js` | tool/simple shape | MOVE; RENAME; ADAPT | Medium | 15B | Classify defaults/legacy routing by current JS visibility. Preserve template-visible preparation before sourceConfig; move safe post-evaluation validation/normalization to translation and SVG to geometry. |
| `src/main.js` | card root | RENAME; ADAPT | Medium | 20 | Lifecycle order already proves config update before setState. Standardize resolvedEntityConfigs to runtimeEntityConfigs and keep tool-specific ownership out of root. |
| `src/masks-clips.js` | support/render/config | KEEP; REVIEW | Low | 20 | Own this.config is legitimate full card config. Do not force tool lifecycle; review terminology only. |
| `src/merge.js` | support/utility | KEEP | Low | 20 | Core proven utility. |
| `src/name-tool.js` | tool/text-like | MOVE; RENAME | Medium | 15B | xpos/ypos defaults are applied before BaseTool and may be template-visible; preserve that source order, move displayed name to runtime and SVG/measurement fields to geometry. |
| `src/palettes.js` | support/paint/cache | KEEP | Low | 20 | Clear paint/cache domain. |
| `src/path-animator.js` | support/runtime | KEEP; RENAME | Low | 19 | Independent runtime lifecycle. Constructor config is animation options; optional semantic rename only. |
| `src/path-elements-renderer.js` | support/render | KEEP | Low | 19;20 | No persistent architecture state. |
| `src/path-elements.js` | support/geometry | KEEP | Low | 19 | Pure geometry/domain calculations; preserve. |
| `src/path-generators.js` | support/geometry | KEEP | Low | 19 | Proven path algorithms; explicitly preserve. |
| `src/path-geometry.js` | support/geometry/cache | KEEP | Low | 19 | Already has strong geometry vocabulary and ownership; reference-quality support module. |
| `src/path-gradient-renderer.js` | support/render/paint | KEEP | Low | 19 | Pure render/paint consumer. |
| `src/path-mask-renderer.js` | support/render | KEEP | Low | 19 | Pure renderer. |
| `src/path-ranges.js` | support/runtime/calculation | RENAME; ADAPT | Medium | 19 | Constructor config is domain options rather than tool config. Rename input contract; preserve mapping algorithms. |
| `src/path-renderer.js` | support/render | KEEP | Low | 19 | Pure renderer. |
| `src/polygon-tool.js` | tool/simple shape | MOVE; RENAME | Medium | 15B | fill_mask/radius defaults precede BaseTool and may be template-visible. Preserve source order; move derived SVG/pathInput/pathDefinition under geometry and keep validation/generator logic. |
| `src/rectangle-tool.js` | tool/simple shape | MOVE; RENAME | Medium | 15B | Radius/fill-mask/fit sizing preparation precedes BaseTool and may be template-visible. Classify and preserve source order; move derived/fit SVG to geometry without changing measurement timing. |
| `src/same-as.js` | support/config compiler | KEEP | Low | 20 | Correct config-time transformation before tool source. |
| `src/sparkline-graph-tool.js` | tool/complex | REWORK | Very High | 18B | Large pre-BaseTool completion must be classified by JS visibility, not moved wholesale. Preserve evaluation order, canonicalize complete series, then separate geometry/runtime/paint/graph input. |
| `src/sparkline-graph.js` | support/calculation | RENAME; ADAPT | Medium | 18B | this.config is a derived graph calculation input, not tool public config. Rename to input/graphInput; preserve all graph math and signatures. |
| `src/sparkline-history.js` | support/history | RENAME; ADAPT | Medium | 18B | Strong domain owner, but updateConfig receives inputs rather than owning public config. Rename to updateInputs and retain history algorithms. |
| `src/sparkline-series.js` | support/runtime series | REWORK | High | 18B | Builds persistent effectiveConfig by remerging parent+series. Canonical translation must publish complete config.series[]; Series keeps runtime identity/state/layout. |
| `src/sparkline-state.js` | support/constants | KEEP | Low | 20 | Clear domain vocabulary; state here is an explicit state-machine concept. |
| `src/state-tool.js` | tool/text-like | MOVE; RENAME | Medium | 15B | xpos/ypos/show.uom completion occurs before BaseTool and may be template-visible. Preserve source/evaluation order; move displayed state/UOM to runtime and SVG/measurements to geometry. |
| `src/templates.js` | support/evaluator | KEEP | Low | 16B;20 | Proven evaluator. Canonical tool translation must reuse it rather than replace it. |
| `src/text-tool-geometry.js` | support/geometry adapter | ADAPT; REMOVE? | Low | 15B;16B | Must remain as the single 15B compatibility adapter because TextTool migrates in 16B; remove/reduce only after Text exposes canonical geometry. |
| `src/text-tool.js` | tool/complex text | REWORK | High | 16B | Unify parts under canonical config while preserving per-part JS context/order. Effective paint styles must participate in measurement invalidation; geometry adapter cleanup follows in 16B Pass B. |
| `src/utils.js` | support/utility | KEEP | Low | 20 | Stateless utility module. |
---

## 9. Audit conclusion

The whole-source audit supports proceeding with the strict architecture.

The implementation should not start by rewriting the complex tools. It should first make the smallest tools demonstrate the contract with primarily mechanical movement. Each later family then reuses an already proven structure.

After every structural migration, the code must be audited a second time. That second audit is where historical helpers, duplicate signatures, repeated merges and defensive layers made unnecessary by colocation are removed.

The final standard is not merely “the code still works”. It is:

> the code still works as before, while configuration, geometry, runtime, paint and lifecycle are predictable enough that a maintainer can find the correct responsibility without memorising each tool's private architecture.

---

# FILE: 04-migration-sequence.md

# Migration Sequence and Audit Method

## 1. Two passes per family

Every family is migrated in two explicit passes inside the same plan.

### Pass A — Canonicalize structure

- preserve calculations;
- move data to the right owner;
- rename shared concepts;
- align lifecycle methods;
- remove parallel config publication only where necessary to establish the canonical route;
- perform the small glue rewrites required by changed ownership;
- verify behaviour immediately.

Pass A deliberately prefers:

```text
MOVE
RENAME
small ADAPT
```

over functional rewriting.

### Pass B — Simplify the result

After related responsibilities are adjacent under their correct owners, audit again:

- is this intermediate variable still needed?
- is this persistent copy still needed?
- is this signature still needed?
- is this helper only hiding what is now one linear step?
- is a config merge still repeated?
- is a guard still protecting an impossible old transition?
- is the same derived value stored twice?
- is a compatibility adapter now dead?
- are local synonyms still present?

Then remove the architectural redundancy and verify again.

This second pass is mandatory. Moving the old complexity into prettier containers is not the final result.

---

## 1A. Characterize ordering before moving code

Before Pass A moves constructor/factory work, identify whether current JavaScript sees that value through `item`.

```text
current pre-evaluation default/completion visible to JS
→ preserve before sourceConfig

not visible / safe post-evaluation normalization
→ candidate for translateConfig
```

This characterization is mandatory for Controls, Sparkline and Horseshoe and should be tested on the simple Arc reference first.

Likewise, before moving parent-driven child styles, characterize current merge priority and measurement effects.

## 2. Implementation order

```text
current-master audit
    ↓
15B — reference architecture + simple tools
    ↓
16B — complete canonical config lifecycle + Text
    ↓
17B — Controls
    ↓
18B — Sparkline
    ↓
19  — Horseshoe / Path integration
    ↓
20  — whole-source post-migration audit
```

The order is intentionally increasing in complexity.

The simple tools are not first because they matter more. They are first because a low-risk tool is the correct place to prove the architecture.

By the time Sparkline and Horseshoe are reached, `config / geometry / runtime / paint` and the lifecycle route should no longer be design proposals. They should be existing proven code patterns.

One cross-family exception is intentional: the shared active color-stop owner is cut over atomically at the end of Plan 19 after every family is prepared. Earlier plans must not introduce a partial duplicate owner.

---

## 3. Per-tool implementation report

Every implementation issue/PR should include the same short architecture table:

```text
Current owners
  config:
  geometry:
  runtime:
  paint:
  domain-specific:

Current lifecycle
  constructor:
  translation:
  updateRuntimeConfig:
  setState:
  connected/disconnected:
  render:

Deviations
  ...

Actions
  KEEP / RENAME / MOVE / MERGE / ADAPT / REMOVE / REWORK

Preserve
  exact calculations/functions that should remain semantically unchanged

Target owners
  ...

Pass-B cleanup candidates
  ...

Tests
  ...
```

This keeps the actual migration auditable against the plan instead of relying on prose interpretation.

---

## 4. Migration safety rule

Prefer this sequence:

```text
same calculation
same input semantics
same output semantics
new canonical storage/owner
```

before changing surrounding flow.

For example:

```text
this.config.svg = calculateSvgDimensions(this.config)
```

becomes conceptually:

```text
this.geometry.svg = calculateSvgDimensions(this.config)
```

before asking whether adjacent helpers are still necessary.

A small rewrite is acceptable when the previous interface depended on the old owner. Rewriting the calculation itself because it can be made “nicer” is out of scope.

---

## 5. Stop rule

If a family demonstrates that the canonical architecture cannot represent a legitimate existing behaviour without:

- a second persistent general config;
- a major functional rewrite;
- or a materially less readable lifecycle;

then stop that family and document the concrete conflict.

Do not hide the problem behind a newly named `active*`, `resolved*`, `effective*` or `runtimeConfig` layer.

Revise the architecture contract if the evidence requires it.

The current-master audit found no such blocker.

---

## 6. Cross-family review after each plan

At the end of each plan compare the newly migrated family with the previous reference family.

The question is not whether the code is identical. The question is whether the same architectural chapters are recognisable:

```text
translation
config
geometry
runtime
paint
state update
connection lifecycle
render
```

If a complex tool needs extra helpers, that is normal. If it needs a private alternative architecture, that requires explicit justification.

---

# FILE: 05-testing-and-verification.md

# Regression and Architecture Verification

## 1. Functional invariant

Internal object shapes are intentionally allowed to change.

Externally meaningful behaviour is not.

For supported existing inputs preserve:

- accepted YAML/config behaviour;
- current JavaScript-template behaviour, including the exact template-visible default/context ordering;
- Home Assistant state interpretation;
- visible text and units;
- positions and dimensions;
- path geometry;
- colors and gradients;
- control interactions;
- history results;
- Sparkline graph results;
- lifecycle cleanup;
- browser rendering.

The architecture refactor is successful when those results remain while the internal owners become simpler.

---

## 2. Existing command baseline

Current `package.json` provides:

```bash
npm test
npm run lint
npm run rollup
npm run build
npm run test:browser
npm run test:browser:all
```

`npm run build` already executes Node tests, lint and Rollup.

---

## 3. Existing relevant test families

### Simple tools / geometry

- `tests/svg-geometry.browser.spec.js`
- `tests/polygon-tool.test.js`
- `tests/polygon-tool.browser.spec.js`
- `tests/state-tool-decimals.test.js`
- `tests/state-tool-formatting.test.js`
- `tests/icon-source.test.js`
- `tests/icon-async-results.test.js`
- `tests/config-ref.browser.spec.js`

### Lifecycle / configuration / async

- `tests/card-lifecycle.browser.spec.js`
- `tests/card-change-detection.browser.spec.js`
- `tests/card-domain-classes.test.js`
- `tests/config-ref-integration.test.js`
- `tests/config-ref.browser.spec.js`
- `tests/async-results.test.js`
- `tests/async-results.browser.spec.js`
- `tests/theme-color-cache.test.js`
- `tests/theme-color-cache.browser.spec.js`

### Controls

- `tests/control-content.test.js`
- `tests/control-family-theme-refresh.test.js`
- `tests/control-slider.test.js`
- `tests/control-toggle-config.test.js`

### Sparkline

- `tests/sparkline-graph-tool.test.js`
- `tests/sparkline-series.test.js`
- `tests/sparkline-history.test.js`
- `tests/sparkline-history-lifecycle.browser.spec.js`
- `tests/sparkline-graph.test.js`
- `tests/sparkline-pointer.test.js`
- `tests/sparkline-pointer.browser.spec.js`

### Horseshoe / Path

- `tests/horseshoe-state.test.js`
- `tests/horseshoe-labels.test.js`
- `tests/horseshoe-cache.browser.spec.js`
- `tests/horseshoe-marker.browser.spec.js`
- `tests/horseshoe-path-adapter.test.js`
- `tests/horseshoe-path-adapter.browser.spec.js`
- `tests/path-animator.test.js`
- `tests/path-animator.browser.spec.js`
- `tests/path-elements.test.js`
- `tests/path-elements.browser.spec.js`
- `tests/path-generators.test.js`
- `tests/path-geometry.test.js`
- `tests/path-ranges.test.js`
- `tests/path-renderer.test.js`
- `tests/path-renderer.browser.spec.js`
- `tests/path-gradient-renderer.test.js`
- `tests/path-gradient-renderer.browser.spec.js`
- `tests/path-side-positions.browser.spec.js`

---

## 4. Architecture-level assertions

Add small, direct source/ownership tests as families migrate. Do not build a large validator framework.

Useful final assertions include:

- no migrated BaseTool descendant stores derived SVG under `this.config.svg`;
- no tool owns persistent `activeItemConfig` or `runtimeConfig`;
- no Sparkline runtime owner creates persistent `effectiveConfig`;
- `ControlSelect.setState()` does not assign `this.config.option_map`;
- control state processing does not assign `child.tool.config.styles`;
- Horseshoe `setState()` does not assign `this.config`;
- no instance owns `this.newConfig`;
- configured `state_map` remains in config while selected/current mapping is runtime/local;
- initial and dynamic tool config use the same source-preparation/evaluation/translation semantics;
- template-visible defaults remain visible at the same stage (Arc `radius: 45` characterization is the reference);
- parent-driven paint styles preserve current merge priority;
- effective Text-like paint changes still invalidate measurement geometry when font metrics change;
- no shared active color-stop owner is partially migrated across families.

These assertions are valuable because they verify the architecture itself, which visual screenshots cannot prove.

---

## 5. Mandatory characterization tests before ownership movement

### JavaScript item context

For every family with preprocessing before BaseTool, capture at least one representative test showing what `item` sees before moving that preprocessing.

Arc minimum:

```text
omitted radius + template using item.radius
→ 45 is visible
→ expression result remains 90
```

Controls/Sparkline/Horseshoe need equivalent focused cases for any defaults whose visibility would change if moved.

### Style priority and measurement

Before Controls stop mutating child `config.styles`, test an overlap where the same style property is present in configured child styles and state/selection styles. The final effective style must remain identical.

For Text-like child content, include a metric-affecting style change and prove measurement/geometry is invalidated exactly as before.

### Shared color-stop cutover

At the Plan-19 atomic owner switch, run focused ordinary-tool, Control, Sparkline and Horseshoe paint tests together. A partially migrated owner is not an acceptable intermediate result.

---

## 6. Two-pass verification

### After Pass A

Run focused unit tests and the browser tests most closely related to the migrated family.

At this point failures are highly local because the primary changes are ownership, move and rename.

### After Pass B

Run the same focused suite again.

A helper/guard/signature deletion is accepted only when the existing observable behaviour remains covered.

---

## 7. Full final verification

Before Plan 20 completes:

```bash
npm run build
npm run test:browser:all
```

plus all architecture assertions introduced in Plans 15B–19.

---

## 7. Diff review rule

A large algorithmic diff inside an ownership-refactor plan is suspicious.

Reviewers should ask:

> Why did this calculation change?

A valid answer is that the changed owner/interface required a small adaptation.

“It could be implemented more elegantly” is not sufficient scope for this project.

---

## 8. What equality means

Do not require internal equality of objects that the refactor intentionally removes.

For example, there is no requirement that an old `runtimeConfig` object remain byte-for-byte reproducible after Horseshoe moves those fields to runtime/paint.

Verify instead that:

```text
same valid input
→ same interpreted meaning
→ same geometry/value/paint
→ same rendered/interacted result
```

That is the correct black-box invariant for an architecture migration.

---

# FILE: 06-existing-plan-supersession.md

# Existing Refactor Documentation — Supersession Map

## 1. Purpose

Current master contains useful historical Plans 15–18 and the `ideas/refactor2` master documentation.

Those documents describe the reasoning and implementation result that produced the current working baseline. They should not be deleted as history.

However, several architectural statements are now explicitly superseded by the canonical architecture clarified after Plan 18.

This file identifies those conflicts so future implementation/review does not combine incompatible models.

---

## 2. `ideas/refactor2/README.md`

### Historical statements to supersede

The current README describes:

- a “configuration gatekeeper”;
- local “candidate” config;
- `this.config` as “accepted active configuration”;
- calculated fields such as `config.svg` as acceptable attached config outputs;
- downstream “accepted config”.

### Replacement vocabulary

Use:

```text
sourceConfig
local newConfig
translateConfig
this.config
geometry
runtime
paint
```

No candidate/accepted/gatekeeper architecture is needed.

Derived geometry should not remain in canonical config merely because that was the previous established contract.

---

## 3. `ideas/refactor2/00-master-simplification-plan.md`

### Historical statements to supersede

The current master plan explicitly permits calculated fields such as `config.svg` and frames the primary goal as trusted/accepted config followed by downstream guard removal.

### Replacement priority

The new primary goal is:

> one canonical tool configuration lifecycle plus canonical ownership/naming for geometry, runtime and paint.

Downstream guard simplification is a consequence of clearer ownership, not the architecture itself.

Plan 20 should therefore be an ownership/naming/lifecycle audit first and a guard/duplication audit second.

---

## 4. Existing Plan 15

`ideas/2026.09.28-15-shared-tool-simplification.md` is implemented history and remains useful.

It removed duplicated common methods and should **not** be reverted.

### 15B relationship

15B starts from that result and adds the stronger canonical data/lifecycle contract.

The existing Plan 15 result remains part of the baseline.

---

## 5. Existing Plan 16

`ideas/2026.09.28-16-configuration-gatekeeper.md` introduced valuable groundwork:

- deep `sourceConfig` snapshot;
- local `newConfig` during dynamic evaluation;
- separate configuration/group/theme change signals.

These changes should be retained where compatible.

### Statements to supersede

- “gatekeeper” terminology;
- implicit/unclassified subclass preprocessing; preprocessing that is already template-visible is now explicitly preserved as source preparation;
- derived fields such as `svg` remaining on config as a normal end state.

### 16B relationship

16B completes the idea rather than reverting it:

```text
consistent template-visible source preparation
→ sourceConfig
→ existing JS context/order
→ one post-evaluation translator
→ this.config
```

and moves derived data to canonical owners.

---

## 6. Existing Plan 17

`ideas/2026.09.28-17-controls-trusted-config.md` is useful implementation history and its proven behaviour constraints remain valuable.

### Explicit conflict

The existing plan states that HA-derived Select options continue to be stored in:

```text
this.config.option_map
```

and intentionally keeps existing control completion ordering rather than forcing uniform architecture.

That is now superseded.

### 17B replacement

```text
configured option_map → config
HA-derived options    → runtime
selected visuals      → paint/runtime
```

Existing control interaction, errors and visual behaviour remain the functional baseline.

---

## 7. Existing Plan 18

`ideas/2026.09.30-18-sparkline-trusted-config.md` is implemented history and records the current source/test baseline.

Its local GraphTool deduplication remains useful and should not be reverted.

### Explicit conflict

The existing Plan 18 deliberately leaves `SparklineSeries.updateConfig()` as the owner of effective series configuration and states that moving series completion to GraphTool would split ownership.

The clarified canonical architecture changes that conclusion.

### 18B replacement

The configuration owner is the tool:

```text
SparklineGraphTool.config.series[]
```

Series is a runtime/domain coordinator.

Raw series-only restrictions remain local inputs to the translation before inheritance, so moving canonical config ownership does **not** require losing those checks.

---

## 8. Existing Plan 19/20 references

Current refactor2 docs refer to future:

```text
19-horseshoe-path-trusted-config.md
20-whole-chain-simplification.md
```

Those future descriptions should be replaced by the Plan 19 and Plan 20 documents in this package.

The new Plan 19 is ownership reconstruction, not merely downstream trusted-config cleanup.

The new Plan 20 is the strict whole-source canonical architecture audit followed by simplification.

---

## 9. `ideas/refactor2/TESTING.md`

Much of the existing testing philosophy remains useful:

- preserve behaviour;
- test real boundaries;
- retain runtime/async/algorithmic checks;
- use browser tests for visible geometry;
- run full build/browser acceptance.

### Terminology to update

Replace acceptance/gatekeeper-specific architecture assertions with canonical ownership assertions, including:

- one config owner;
- no config swapping;
- geometry outside config;
- runtime HA data outside config;
- control child config immutability during state changes;
- canonical series ownership;
- Horseshoe state mapping outside config.

The `05-testing-and-verification.md` in this package is the new active policy for 15B–20.

---

## 10. Documentation rule during implementation

Historical plan files may keep their implemented-result text for traceability.

The active `ideas/refactor2/README.md` and master plan should be updated to point at the new canonical package/plans and clearly mark the earlier architecture statements as superseded.

Do not edit historical results to pretend the previous plans said something they did not say.

The history explains how current master was reached; the new plans define where it goes next.

---

# FILE: 15B-simple-tool-reference.md

# Plan 15B — Reference Architecture and Simple Tools

## 1. Goal

Prove the canonical tool architecture on the smallest real tools and turn that proven implementation into the copy-paste reference for every later family.

This plan should contain as little new abstraction as possible. It exists to answer concrete questions in working code:

- how does BaseTool receive the stable **template-visible** tool source without changing the current JavaScript `item` context?
- which existing defaults must remain before source capture/evaluation, and which belong in post-evaluation translation?
- how is the same post-evaluation translator used initially and after JS reevaluation?
- where does derived geometry live?
- how is runtime state represented without colliding with `StateTool.state`?
- how do group/layout changes invalidate geometry without becoming config changes?
- how much existing code is merely moved/renamed?

## 2. Scope

Primary proof tools:

- `ArcTool` — configuration + geometry reference.
- `IconTool` — configuration + geometry + runtime selection + async lifecycle reference.

Then propagate the proven pattern to:

- Circle;
- Line;
- Rectangle;
- Polygon;
- Name;
- Area;
- State.

Supporting changes:

- minimum required BaseTool hook for safe translation;
- `CardTools` geometry lookup;
- `text-tool-geometry.js` temporary compatibility adaptation; removal is deferred to 16B after TextTool migrates.

## 3. Non-goals

Do not redesign:

- shape math;
- path generators;
- StateTool formatting;
- icon loading;
- text measurement;
- Rectangle fit semantics;
- public YAML.

## 4. Target reference shape

A simple geometry tool should become recognisable as:

```text
constructor
  → prepare the same template-visible source current JS sees
  → super with sourceConfig + translator contract
  → tool-specific local resource setup

prepareSourceConfig(config)  // only where current behaviour requires it
  → preserve template-visible defaults/completion
  → sourceConfig

translateConfig(config)
  → post-evaluation public-to-internal normalization
  → post-evaluation defaults/completion
  → validation
  → complete canonical config

updateRuntimeConfig()
  → super.updateRuntimeConfig()
  → update geometry on config/group change
  → update paint only if needed

setState(...)
  → runtime only, if the tool is entity-bound

render()
  → config + geometry + runtime/paint
```

## 5. Pass A1 — establish the safe translator mechanism

The first implementation step is deliberately small.

BaseTool must be able to own the semantic current-config route:

```text
prepared template-visible source
→ sourceConfig
→ evaluate using the established item/context
→ translate
→ this.config
```

without invoking an overridden method before subclass initialization.

Acceptable directions include an explicitly supplied pure/static translator plus, where required, a small pure source-preparation function.

Requirements:

- characterize the current JavaScript-visible `item` before moving defaults;
- defaults/completion that current JS can observe remain in pre-source preparation;
- post-evaluation normalization/validation goes through the common translator;
- initial and JS reevaluation preserve the same source/evaluation/translation order;
- no persistent third current config is introduced;
- not-yet-migrated families can remain functional during the staged plan without becoming permanent alternate architecture;
- the result does not require a validator registry or generic framework.

### Required Arc characterization

Before changing Arc construction, add/retain a test proving the current ordering:

```text
radius omitted
source/template item sees radius = 45
`item.radius * 2` evaluates to 90
```

Also cover an explicit radius so the default does not incorrectly override authored input.

If a proposed BaseTool mechanism is more complex than the simple tools it supports, reject it and choose a smaller design.

## 6. Pass A2 — Arc reference

### Current

```text
constructor
  arcConfig = defaults + config
  super(arcConfig)
  config.svg = calculateSvgDimensions()
```

### Target

```text
compiled Arc item
→ Arc source preparation (xpos/ypos/radius/arc defaults that are currently JS-visible)
→ sourceConfig
→ JS evaluation
→ Arc translator
→ this.config

this.geometry.svg = calculateSvgDimensions(this.config)
```

Keep the current `calculateSvgDimensions()` calculations semantically unchanged.

The reference should make the main lifecycle obvious, for example:

```js
updateRuntimeConfig() {
  super.updateRuntimeConfig();

  if (this.configurationChanged || this.groupChanged) {
    this.updateGeometry();
  }
}
```

Do not extract `updateGeometry()` merely for symmetry if the direct assignment is more readable. The canonical owner matters more than forcing identical function counts.

## 7. Pass A3 — Icon runtime reference

Icon proves the same architecture with current state and asynchronous resources.

Preserve:

- `config.state_map` as configured state mapping;
- state-map matching behaviour;
- HA/entity icon selection;
- external SVG/image handling;
- `HomeAssistantIconPath` lifecycle;
- connected/disconnected cleanup.

Change:

```text
config.svg → geometry.svg
```

The currently selected map entry may be:

- local to the function when only needed once; or
- `runtime.stateMapItem` if multiple lifecycle stages reuse it.

Do not create a persistent merged `renderConfig` or similar object.

## 8. Pass A4 — remaining simple shapes

### Circle

- preserve radius/default preparation before `sourceConfig` where current JS can observe it; move only safe post-evaluation completion into canonical translation;
- move SVG dimensions to geometry;
- preserve legacy `radius` / `radius_percent` behaviour.

### Line

- keep legacy `lines` / `hlines` / `vlines` routing;
- classify Line defaults/legacy routing by current JS visibility; preserve any template-visible preparation before `sourceConfig` and move only safe post-evaluation work into translation;
- perform only the post-evaluation orientation/default completion in the same translator used after JS reevaluation;
- move SVG geometry out of config;
- preserve from/to calculations.

### Rectangle

- classify `fill_mask`, referenced-dimension padding and fit defaults by current JS visibility; preserve template-visible source preparation and translate the remaining completion once;
- move SVG/path-ready dimensions to geometry;
- preserve `getItemWidth`, `getItemHeight`, fit and measurement timing;
- do not freeze geometry before measured text has had its normal correction pass.

### Polygon

Preserve any template-visible `fill_mask` / `radius` defaults before `sourceConfig`; keep validation and path construction after the normal evaluation/translation boundary as current behaviour requires.

Current:

```text
config.svg
pathConfig
pathDefinition
```

Target:

```text
geometry.svg
geometry.pathInput
geometry.pathDefinition
```

Keep:

- sides/top validation;
- maximum radius check;
- `buildPolygonPathDefinition()`;
- group coordinate calculation.

## 9. Pass A5 — Name, Area and State

These tools prove that the same owner model works for measured text.

Their current `xpos` / `ypos` and State `show.uom` defaults are applied before BaseTool and may be visible to JavaScript. Characterize and preserve that source/evaluation order while moving only storage ownership.

### Name

```text
runtime.name
geometry.svg
geometry.estimatedWidth/Height
geometry.measuredWidth/Height
geometry.measuredXpos/Ypos
```

### Area

Same structure using `runtime.area`.

### State

```text
runtime.state
runtime.uom
geometry.*
```

This removes the semantic ambiguity where `StateTool.state` looks like a generic architecture state.

Preserve:

- formatting;
- UOM placement;
- estimated measurements;
- `getBBox()` correction;
- presentation change behaviour.

## 10. Paint/style reference contract

15B must establish the storage/API shape that Controls will later use without mutating child config.

For tools with runtime/parent-driven style replacement:

```text
config.styles    stable configured styles
paint.styles     current runtime/parent style map when present
```

The effective-style path must behave as if the current code had replaced `config.styles`, but without actually mutating config.

A small method such as `setPaintStyles(styles)` is preferred over direct parent knowledge of child internals. Its exact implementation should remain minimal.

Do not redesign style priority. Before the Controls migration, characterize overlap cases where the same property exists in parent state styles and child configured styles. The migrated route must reproduce the same final effective map.

Name/Area/State/Text measurement signatures must ultimately be based on **effective styles**, so font-metric changes caused by paint invalidate measurement geometry. TextTool completes this proof in 16B.

## 11. Pass A verification

After the mechanical ownership changes, run the focused tests before cleanup.

Failures at this stage should be traceable to:

- wrong field path;
- missed group invalidation;
- wrong source boundary;
- measurement ordering;
- or an unsafe translation hook.

Do not begin cleanup until Pass A is green.

## 12. Pass B — post-migration simplification

With the simple text-like tools now exposing canonical geometry, re-audit their local duplication.

### `text-tool-geometry.js` — deliberately retained in 15B

TextTool itself does not migrate until 16B, so this adapter **cannot be removed in 15B**.

During 15B it becomes the single explicit compatibility bridge:

```text
Name / Area / State  → read canonical tool.geometry
TextTool              → read the current pre-16B Text geometry representation
```

Do not spread this compatibility logic into callers.

Removal/reduction is owned by **16B Pass B**, after TextTool publishes the same geometry contract.

### Simple-tool cleanup

Remove only what became redundant:

- duplicated geometry fields;
- old comments that call derived SVG “config”;
- wrappers whose only job was forwarding historical storage;
- signatures that no longer compare unique concepts.

Do not rewrite calculations.

## 13. Tests

At minimum:

- `svg-geometry.browser.spec.js`;
- polygon Node/browser tests;
- StateTool formatting and decimals tests;
- icon source/async tests;
- config-ref browser tests;
- any Rectangle fit/measurement coverage touched by the move.

Run focused tests after Pass A and after Pass B.

## 14. Definition of Done

- Arc is a clean copy-compatible geometry reference.
- Icon is a clean copy-compatible runtime/async reference.
- simple tools expose canonical geometry rather than `config.svg`.
- defaults/validation use the same translation semantics initially and after JS evaluation.
- Name/Area/State use `runtime` and `geometry` recognisably.
- the implementation does not require a compatibility config alias.
- existing calculations and visible results are unchanged.

---

# FILE: 16B-canonical-config-lifecycle-and-text.md

# Plan 16B — Canonical Configuration Lifecycle and Text

## 1. Goal

Finish the common BaseTool configuration contract proven by Plan 15B and migrate TextTool, the most complex ordinary non-control/non-graph tool, onto that contract.

The current-config route remains deliberately simple:

```text
sourceConfig
→ local newConfig
→ translateConfig
→ this.config
```

The important refinement is that `sourceConfig` is the stable **template-visible source**, not necessarily raw authored YAML before every default.

No candidate/accepted/pending state machine is introduced.

## 2. Prerequisite

Plan 15B must already have proven:

- a safe source-preparation + translator mechanism;
- preservation of current JavaScript `item` context/order;
- canonical geometry ownership;
- config/group invalidation behaviour;
- runtime naming on simple tools;
- the minimal `config.styles` / `paint.styles` presentation route.

Plan 16B extends that proven mechanism rather than redesigning it.

## 3. BaseTool target

The common semantic route is:

```text
compiled/routed item
    ↓
prepare template-visible source where current behaviour requires it
    ↓
sourceConfig
    ↓
optional JS evaluation with the same context/order as today
    ↓
newConfig                 local only
    ↓
post-evaluation tool translation
    ↓
this.config
```

### Required invariants

- `sourceConfig` does not alias mutable current config.
- `sourceConfig` means “stable template-visible source” for every migrated tool.
- a default already observable through JavaScript remains observable at the same point.
- `this.config` is complete before `setState()`.
- group changes do not imply config translation unless source/evaluated config changed.
- theme changes do not imply config translation merely because paint changed.
- geometry/runtime/paint cannot feed back into source equality/signatures.

## 4. JavaScript evaluation order is protected behaviour

Before moving any constructor/factory default, classify it as:

```text
PRE-SOURCE / TEMPLATE-VISIBLE
or
POST-EVALUATION TRANSLATION
```

Use characterization tests where the distinction is not obvious.

The Arc proof from 15B is the reference:

```text
omitted radius
→ sourceConfig contains radius: 45
→ `item.radius * 2` evaluates to 90
```

Controls, Sparkline and Horseshoe must receive the same treatment later. Their existing pre-BaseTool completion cannot be moved after evaluation wholesale.

This plan therefore standardizes **the meaning and ordering**, not an artificial rule that all defaults must live in `translateConfig()`.

## 5. Common runtime entity context

Current BaseTool stores:

```text
this.entity
this.entityConfig
```

The canonical vocabulary prefers:

```text
this.runtime.entity
this.runtime.entityConfig
```

Perform this migration only if it can be done mechanically without a long-lived compatibility alias. A repo-wide mechanical substep is preferable to an alias spanning later plans.

## 6. Concrete paint-style route

Plan 17B must not invent the child presentation mechanism. 16B finishes it.

Canonical storage:

```text
config.styles
    stable canonical configured style source

paint.styles
    current runtime/parent-driven replacement map when present
```

The effective-style resolver uses:

```text
paint.styles ?? config.styles
```

at the same point where current code consumes `config.styles`, then applies the existing animation/filter/theme cascade unchanged.

A small method such as:

```text
setPaintStyles(styles)
```

should:

1. publish/clear `paint.styles`;
2. update presentation change detection;
3. allow Text-like tools to invalidate measurement when effective font-metric styles changed.

### Style priority

Do **not** invent new merge precedence.

For Controls later, the parent initially computes the same fully merged map it currently assigns into `child.tool.config.styles` and passes that exact result through `setPaintStyles()`.

Characterization tests must cover overlapping properties so the existing order is locked before migration.

### Text measurement consequence

Text/Name/Area/State measurement signatures must use the **effective styles**, not only `config.styles`.

A paint change affecting properties such as font size/weight/spacing must cause the same measurement correction as the current config mutation route.

## 7. Color stops and theme ownership — no partial cutover

The final semantic split remains:

```text
authored/structural color-stop configuration → config
active light/dark/theme-selected output       → paint
```

The proven `ColorStops.normalize()` logic remains unchanged.

However, current active color-stop consumers span ordinary tools, Controls, Sparkline and Horseshoe. Plan 16B must therefore **not move the shared active owner partially**.

Revised migration rule:

```text
16B  define the final paint rule; keep current shared storage as a documented legacy exception
17B  make Controls compatible with canonical paint ownership
18B  make Sparkline compatible with canonical paint ownership
19   make Horseshoe compatible, then perform one atomic shared owner cutover
20   verify no theme-selected active color-stop output remains in canonical config
```

Until the Plan-19 cutover:

- do not create duplicate persistent `config.colorstops` + `paint.colorStops` copies;
- do not remove current fields that unmigrated consumers still require;
- do not treat the temporary legacy location as the desired final architecture.

This is an explicit staged exception for migration safety, not a second design.

## 8. Change detection

Use explicit signatures/flags for the owner that changed:

```text
configurationChanged
groupChanged
themeModeChanged
geometrySignature
paintSignature
presentationSignature
```

Do not preserve another current config solely for comparison.

## 9. TextTool current deviation

TextTool currently owns a separate parts path:

```text
sourceTextParts
activeTextParts
activeTextPartsSignature
textParts
```

The outer BaseTool config and inner parts therefore do not share one source/current-config lifecycle.

## 10. TextTool target

### Configuration

```text
sourceConfig.text[]
→ preserve current per-part evaluation context/order
→ local evaluated parts
→ translate parts
→ config.text[]
```

Every `config.text[]` entry is the complete current canonical part configuration needed downstream.

### Runtime

```text
runtime.textParts
runtime.stateMap selections
runtime.resolved displayed values
```

A selected state-map entry is current interpretation, not another config.

### Geometry

```text
geometry.svg
geometry.estimated*
geometry.measured*
geometry.fit/wrap data where persistent
```

Short-lived render locals stay local.

## 11. Preserve Text behaviour

Preserve unchanged semantics for:

- per-part `entity_index` context;
- per-part JavaScript evaluation and startup order;
- inline State/Name/Area source behaviour;
- state-map matching;
- localization;
- source styles;
- color stops;
- wrapping;
- ellipsis;
- fit/max-width;
- measurement/rerender timing.

## 12. Part-specific entity context

Current Text code sometimes adapts the source context for a part before evaluation. That remains legitimate.

Context preparation occurs inside the one Text source/evaluation route and must not create another persistent source/active config model.

## 13. `text-tool-geometry.js` transition

15B deliberately retained this helper because TextTool had not migrated yet.

After TextTool publishes canonical geometry, 16B Pass B decides whether the helper:

- becomes a truly domain-useful common geometry accessor; or
- disappears and `CardTools` consumes `tool.geometry` directly.

The temporary dual-storage compatibility branch must not survive 16B.

## 14. Pass A verification

Add/retain focused tests for:

- template-visible defaults/order;
- static text parts;
- equivalent JS-produced parts;
- part-specific entity indexes;
- state-map text selection;
- fit/wrap/ellipsis;
- measurement correction;
- `setPaintStyles()` style precedence;
- measurement invalidation from effective paint styles;
- theme changes.

Verify source remains unchanged by geometry/runtime/paint output.

## 15. Pass B cleanup

Inspect:

- whether `sourceTextParts` duplicates `sourceConfig.text`;
- whether `activeTextParts` duplicates `config.text`;
- whether `activeTextPartsSignature` is still needed;
- whether multiple part-normalization helpers can become one linear translation;
- whether `textParts` should simply be `runtime.textParts`;
- whether measurement fields can be grouped without wrappers;
- whether `text-tool-geometry.js` is now redundant.

Remove only structures made redundant by canonical ownership.

## 16. Support-module vocabulary

Keep the proven `Templates`, `ColorStops` and `ColorFilter` algorithms.

Align directly adjacent comments/method names that still describe the sole current config as “accepted/active”. Plan 20 owns the repo-wide terminology sweep.

## 17. Definition of Done

- BaseTool has one source-to-current-config semantic route.
- source preparation preserves existing JavaScript `item` context/order.
- migrated tools share the same meaning of `sourceConfig` and `this.config`.
- `paint.styles` provides the concrete runtime presentation route used later by Controls.
- TextTool no longer owns a second persistent parts-config lifecycle.
- current text output is runtime; measurement is geometry.
- `text-tool-geometry.js` no longer contains a migration compatibility branch.
- shared active color-stop storage has **not** been partially moved; the deferred atomic cutover is explicit.
- existing Text/BaseTool behaviour remains green.

---

# FILE: 17B-controls-canonical-architecture.md

# Plan 17B — Controls on the Canonical Tool Architecture

## 1. Goal

Move every control onto the same config / geometry / runtime / paint model proven by Plans 15B–16B while preserving all control behaviour.

Controls are the first family that proves a second important architectural rule:

> parent/common configuration plus item/subtype override is resolved once into complete canonical child configuration; runtime does not repeat inheritance.

## 2. Family target

```text
config
  complete authored/evaluated control configuration

geometry
  SVG center/bounds
  button/segment/thumb placement
  generated child placement

runtime
  current entity values
  HA-derived option lists
  selected index/value
  generated action payloads
  slider scale/availability
  pointer/drag state

paint
  selected/unselected
  active/inactive
  unavailable visual overrides
```

Generated child tools receive stable generated source configuration for the lifetime of that child instance.

### Shared color-stop migration exception

The common active color-stop owner is **not** moved in this plan if doing so would leave Sparkline/Horseshoe on the old owner. Controls should be made structurally ready for canonical paint ownership, but the shared storage cutover remains the atomic Plan-19 integration step defined by 16B.

## 3. Preserve Control JavaScript source ordering

Button, Number, Select, Slider, Toggle and ControlBase currently complete different defaults/presets before BaseTool sees their source.

Do not move those operations wholesale after JavaScript evaluation.

For each subtype, classify existing constructor/factory work as:

```text
PRE-SOURCE / TEMPLATE-VISIBLE
POST-EVALUATION TRANSLATION
```

Characterize representative JS configs before movement. Values already visible through `item` remain visible in the same order after migration.

The canonical goal is one **current config**, not an artificial requirement that every default execute after JS.

## 4. ControlBase

### Current

ControlBase completes:

- common visibility/unavailable defaults;
- haptic defaults recursively;
- label defaults;
- label positioning/style defaults;

before calling BaseTool.

### Target

Classify those operations first. Defaults/completion current JS can observe remain in template-visible source preparation; only the safe post-evaluation portion moves into the canonical control translator.

Keep generated label TextTool creation separate because its absolute coordinates depend on current parent geometry.

A parent geometry change may recreate the label tool. Once created, the label child config is not runtime paint storage.

### Runtime visibility

`visible / hidden / unavailable` remains config when authored as such.

Actual entity availability or current interaction state remains runtime.

Do not remove the existing visibility validation merely because a new translation exists until equivalent failure timing/behaviour is proven.

## 5. ControlContent

ControlContent currently performs a valuable inheritance operation:

```text
parent entity
+ shared source content item
+ per-button/per-option override
→ merged item
```

The operation stays; its ownership moves earlier.

### Target configuration

The parent control should expose complete effective content items before normal runtime state handling.

For example:

```text
config.content.items[]
```

contains the completed item configuration expected by child construction.

### Geometry

Cell division, margin application and generated absolute child coordinates are derived geometry.

Keep the current calculations.

### Paint violation to remove

Current `ControlContent.setState()` assigns active visual styles into:

```text
child.tool.config.styles
```

Replace that with an explicit presentation route.

Use the `paint.styles` / `setPaintStyles()` contract established by 15B/16B. It must not introduce a second “render config”.

For the first migration, compute the **same merged style map in the same argument order** that current code assigns to `child.tool.config.styles`, then publish that map with `setPaintStyles()`. This keeps style priority unchanged while moving ownership.

If the child is Text-like, the new paint path must trigger the same effective-style measurement invalidation proven in 16B.

## 6. ControlToggle

### Current issue

Toggle completes selected style/config after `super(...)` using `buildConfig()` and re-runs that completion when dynamic config changes.

This means initial and dynamic tool completion are not one recognisable translation route.

### Target

One Toggle translator owns:

- defaults;
- subtype/style selection;
- orientation completion;
- content defaults;
- validation;
- final canonical Toggle config.

Both construction and dynamic JS reevaluation use that translator.

Geometry calculation remains derived from `this.config` and group layout.

## 7. ControlButton

Preserve:

- button style presets;
- actions;
- state-map selection;
- content construction;
- interaction behaviour.

Change ownership:

```text
config.svg                  → geometry.svg
current state-map entry     → runtime.stateMapItem
active/inactive visual data → paint
```

Do not mutate retained content Icon/Text config to display active/inactive styles.

## 8. ControlSelect

Select is the clearest runtime/config boundary in the family.

### Current

When options come from a Home Assistant entity, `setState()` normalizes them and writes them into:

```text
this.config.option_map
```

### Target

```text
config.option_map
    explicitly configured option map only

runtime.options
    current effective option list/map

runtime.selectedIndex
runtime.selectedValue
runtime.actionConfigs

paint.optionStates
    selected/unselected presentation
```

The existing option normalization code remains. It simply publishes to runtime when the source is HA state.

### Child tools

Selected/unselected styles must not be written to child config.

## 9. ControlSlider

Slider already separates much of its runtime data. This migration is mostly ownership/naming.

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
runtime.renderFrame
runtime.stateAnimationFrame
runtime.writeTimer
```

Do not group fields if doing so makes pointer hot paths materially less clear; canonical naming is the goal, not object nesting at any cost. The final implementation may keep tightly coupled lifecycle handles direct if justified, but entity-derived state should be recognisable as runtime.

Move control SVG/bounds into geometry.

Preserve:

- single/range semantics;
- HA-derived scale attributes;
- unknown/unavailable handling;
- pointer capture;
- throttled writes;
- animations;
- actions.

## 10. ControlNumber

Move:

```text
numberGeometry → geometry
minusActionConfig → runtime.minusActionConfig
plusActionConfig  → runtime.plusActionConfig
```

The increment/decrement action conversion remains exactly the existing behaviour.

Generated minus/plus/value child tools remain legitimate generated children.

## 11. ControlTool dispatcher

The live responsibility of `ControlTool` is subtype compile/dispatch.

Keep that role simple.

Remove the large obsolete commented implementation during Pass B after the family is green.

## 12. Pass A verification

Run control tests after the ownership changes but before cleanup.

Verify especially:

- static and JS Toggle configs are equivalent;
- group moves rebuild geometry correctly;
- theme-only changes update presentation without rebuilding unrelated config;
- Select HA options update without canonical config mutation;
- Button/Content selection changes do not mutate child config;
- overlapping configured and state-driven child styles preserve the current priority exactly;
- Text child font-metric presentation changes invalidate measurement through the 16B paint route;
- Slider current behaviour is unchanged.

## 13. Pass B cleanup

Once runtime presentation no longer uses child config:

- remove `baseStyles` snapshots if they are no longer required;
- remove repeated active/unselected style merges that can be produced once by paint;
- collapse duplicate child reconstruction/update branches where canonical ownership makes them identical;
- remove config completion helpers that have become part of one linear translator;
- remove obsolete comments and dead commented ControlTool code.

Do not replace explicit readable control flow with a generic “control engine”.

## 14. Tests

At minimum:

- `control-content.test.js`;
- `control-family-theme-refresh.test.js`;
- `control-slider.test.js`;
- `control-toggle-config.test.js`;
- relevant card lifecycle/group/browser tests.

Add direct architecture assertions for:

```text
ControlSelect.setState does not assign config.option_map
ControlContent/Button/Select runtime state does not assign child config.styles
```

## 15. Definition of Done

- every control has recognisable config/geometry/runtime/paint ownership;
- common + subtype + item inheritance happens once;
- current HA option lists are runtime;
- selected/active visual state is paint/runtime rather than config mutation;
- generated children follow the same canonical child rules as top-level tools;
- all interaction behaviour remains unchanged.

---

# FILE: 18B-sparkline-canonical-series.md

# Plan 18B — Sparkline Canonical Series and Runtime Architecture

## 1. Goal

Move Sparkline onto the same one-config architecture without rewriting history, graph math, pointer behaviour or rendering.

The defining Plan 18B invariant is:

> `this.config.series[]` is always the sole canonical internal series configuration representation, and every entry is already complete.

## 2. Current ownership problem

Current GraphTool performs substantial pre-BaseTool processing:

```text
raw sparkline config
→ normalizedConfig
→ defaults/style/period completion
→ sparklineConfig
→ super(sparklineConfig)
```

Later, `SparklineSeries.updateConfig()` performs another configuration route:

```text
parent config
+ raw series override
→ effectiveConfig
→ item.config
```

The result works, but a maintainer must understand two different config owners before understanding runtime series behaviour.

## 2A. Preserve Sparkline JavaScript source preparation order

GraphTool currently performs substantial defaults/legacy/style/period work before BaseTool receives the config. The migration must first determine which of those values are visible to JavaScript `item` today.

Classify each operation as:

```text
PRE-SOURCE / TEMPLATE-VISIBLE
POST-EVALUATION TRANSLATION
```

Only the second category is freely moved into `translateConfig()`.

Do not force all constructor defaults after JS merely to match a diagram. Static and dynamic configs must retain the same evaluation context/order as current master.

## 3. Non-goals

Do not redesign:

- history request timing;
- bucketing;
- aggregation;
- statistics;
- graph geometry algorithms;
- radial/cartesian drawing math;
- pointer interaction;
- tooltip behaviour;
- current public YAML.

## 4. GraphTool canonical translation

Move current constructor/runtime config completion into one recognisable translation route.

The translator may be long. That is acceptable if it reads linearly.

A good shape is conceptually:

```text
clone/evaluated source
→ legacy public translations
→ defaults
→ style dictionaries
→ period completion
→ chart/radial/day-night validation
→ axes
→ complete series[]
→ final canonical config
```

Extract a helper only for substantial concepts such as series translation or axes when it improves readability.

Do not create a general validation framework.

## 5. Canonical implicit series

The absence of public `series:` is only an input form.

Internally:

```text
implicit single series
→ config.series[0]
```

Downstream configuration code must no longer branch on “implicit versus explicit” merely to build effective config.

The generated default series ID/entity binding must preserve current behaviour and existing derived-entity naming contracts.

## 6. Raw override validation

Some validations must inspect the raw override **before** parent inheritance.

Examples identified in current Series logic include restrictions where merging can hide whether the field was explicitly supplied by the series.

The translation sequence is therefore:

```text
raw series override
→ validate override-only restrictions
→ merge parent + override
→ apply paint precedence
→ validate completed series/cross-series constraints
→ publish config.series[]
```

The raw override is a local translation input, not a persistent config owner.

## 7. Parent + series merge

Resolve inheritance exactly once.

Current:

```text
SparklineSeries.updateConfig()
  effectiveConfig = Merge.mergeDeep({}, parent, series)
```

Target:

```text
SparklineGraphTool translation
  config.series[n] = complete effective series config
```

A runtime Series item may hold a direct reference to that canonical entry if useful. It must not build and own another object that semantically becomes the series configuration.

## 8. SparklineSeries target

Series remains a real, useful domain coordinator.

It should own runtime concerns such as:

- stable series IDs;
- entity binding/current entities;
- request/data state coordination;
- graph objects;
- cartesian/radial layout coordination;
- reuse of runtime items by ID;
- data-state results.

It should not own public config completion.

## 9. SparklineHistory target

History is not a tool and does not need config/geometry/runtime/paint containers merely for symmetry.

Its current domain ownership is good:

- `seriesRecords`;
- rows;
- request timers;
- retry/resynchronization state;
- period/time calculations.

The current method name `updateConfig(...)` is misleading because the object does not own the public Sparkline config.

Rename the contract to an accurate input name, preferably:

```text
updateInputs(...)
```

or another equally clear domain-specific name if implementation review reveals a better one.

Preserve all history algorithms.

## 10. SparklineGraph target

`SparklineGraph` is a calculation engine.

The object passed by GraphTool is a derived calculation contract, not the canonical tool configuration.

Recommended vocabulary:

```text
buildGraphConfig()  → buildGraphInput()
graphConfig         → graphInput
SparklineGraph.config → SparklineGraph.input
```

This is a potentially large mechanical rename because graph math reads the object frequently.

Perform it as an isolated checked step. Do not combine the rename with formula changes.

## 11. GraphTool derived owners

The final exact grouping should be determined while migrating, but the semantic target is:

### Geometry

```text
geometry.svg
geometry.graphArea
geometry.margins
geometry.axes
geometry.legend layout
```

### Runtime

```text
current series/entity data
loading/data state
pointer/hover state
current derived values
```

### Paint

```text
day/night paint
state-band/graded paint
series presentation data where persistent
active color-stop paint after the shared Plan-19 cutover
```

During 18B, Sparkline must be made ready to consume the canonical paint owner, but do not create a duplicate active color-stop copy while Horseshoe/other remaining consumers still depend on the legacy location. The final shared owner switch is atomic in Plan 19.

### Graph input

The calculation contract handed to each `SparklineGraph` remains a unique domain concept and may be named `graphInput` rather than forced under `geometry`.

## 12. `this.svg` and `config.svg`

Current GraphTool keeps both `this.svg` and `this.config.svg`.

After migration there should be one geometry owner.

Do not keep both merely to reduce the initial diff. If a staged mechanical transition needs a short-lived local alias inside one commit, remove it before Plan 18B is complete.

## 13. Change detection

Sparkline legitimately needs multiple signatures because history/data/geometry can change independently.

Do not remove signatures merely because there are many.

Audit each signature after canonical series migration:

- what owner does it compare?
- does it still prevent real expensive work?
- is it duplicated now that series configuration is canonical?

Only redundant signatures disappear in Pass B.

## 14. Pass A verification

Focus on configuration equivalence first:

- implicit single vs equivalent explicit single;
- multi-series;
- stable series IDs;
- entity indexes;
- raw override restrictions;
- period offsets;
- axis IDs;
- parent/series paint precedence;
- radial restrictions;
- state bands/day-night.

Then verify history/graph results remain unchanged.

## 15. Pass B cleanup

With complete series config in one owner:

- remove `effectiveConfig` construction from Series;
- remove implicit/explicit config branches that have no runtime meaning;
- remove duplicate inheritance/paint completion;
- simplify GraphTool coordination where downstream no longer repairs config;
- re-evaluate config-related signatures;
- keep external/runtime/numerical guards owned by History/Graph.

Do not use the cleanup pass to optimize graph formulas.

## 16. Tests

Run the complete existing Sparkline Node and browser test families after both passes.

Architecture assertions should prove:

```text
no persistent effectiveConfig in SparklineSeries
config.series[] exists for implicit and explicit forms
History input update is not called config ownership
Graph calculation input is not named/treated as public tool config
```

## 17. Definition of Done

- `this.config.series[]` is the only canonical series configuration representation;
- every series entry is complete before runtime Series coordination;
- raw override restrictions are preserved at translation time;
- Series no longer reconstructs public config;
- History retains its domain logic with clearer input naming;
- Graph retains all calculation logic with clearer input naming;
- graph/history/render output is unchanged.

---

# FILE: 19-horseshoe-path-canonical-architecture.md

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

---

# FILE: 20-whole-source-post-migration-audit.md

# Plan 20 — Whole-Source Post-Migration Audit and Simplification

## 1. Goal

Audit the migrated source as if it had been designed with the canonical architecture from the beginning.

Plan 20 is not a last round of feature work. It is the strict architecture and simplification acceptance pass.

## 2. Scope

All 72 product-owned root `src/*.js` modules.

Tools receive strict canonical lifecycle/owner checks.

Support modules receive semantic ownership and vocabulary checks without being forced into BaseTool structure.

## 3. Tool audit route

For every BaseTool descendant, be able to identify this route directly:

```text
compiled/routed item
→ preserve required template-visible source preparation
→ sourceConfig
→ evaluate with the established item/context ordering
→ local newConfig
→ translate
→ this.config
→ geometry / runtime / paint
→ render
```

A tool may omit categories it does not need.

A complex tool may contain additional domain helpers.

It may not introduce a private competing lifecycle for the same concepts.

## 4. Strict tool checklist

For every tool answer yes/no and record any deviation:

1. Does `sourceConfig` mean the stable template-visible source, with existing JavaScript-visible defaults/context preserved?
2. Is `newConfig` local only?
3. Is `this.config` the sole current canonical tool configuration?
4. Do initial and dynamic updates preserve the same source-preparation → JS-evaluation → translation order?
5. Can `setState()` run without publishing a config?
6. Is HA state kept out of canonical config?
7. Is derived geometry outside canonical config?
8. Is theme/state-derived paint outside canonical config, including active color-stop output after the Plan-19 cutover?
9. Does configured `state_map` remain configuration while current selection is runtime/local?
10. Is parent/common + item/series inheritance resolved once?
11. Does a parent avoid mutating retained child config as runtime state?
12. Are lifecycle method names used with the same meaning as other tools?
13. Do lifecycle parameters mean the same thing across tools?
14. Is the main flow readable in execution order?
15. Is `text-tool-geometry.js` free of the temporary 15B compatibility branch (or removed if redundant)?
16. Does parent/runtime child presentation use `paint.styles` rather than config mutation while preserving characterized merge priority?
17. Do Text-like tools base measurement invalidation on effective styles so paint changes affecting font metrics still rebuild geometry?
18. Are all shared active color-stop consumers on the single paint owner with no legacy duplicate?
19. Do signatures describe actual owner changes rather than act as hidden config copies?
20. Is the same derived value stored only once unless caching has a concrete reason?
21. Would the architecture look reasonable if the tool were written today?
22. Were proven functional algorithms left intact?

## 5. Support-module checklist

For every support module:

- Does `config` really mean configuration owned/consumed as configuration?
- Does `runtime` really mean current mutable state?
- Does `geometry` really mean derived geometry?
- Is `paint`/presentation clearly distinguished from config?
- Are unique domain names such as `history`, `graph`, `cache`, `animation` actually unique concepts?
- Does a method called `setConfig()` actually set configuration?
- Does `updateConfig()` actually update configuration?
- Does `active`, `resolved` or `effective` duplicate a canonical concept without adding meaning?
- Is persistent state duplicated?
- Has an adapter become unnecessary because all tools now expose the same owner?
- Are lifecycle names (`connected`, `disconnected`) semantically consistent?

## 6. Mechanical search audit

Search the whole product source for at least:

```text
this.config =
this.config.svg
runtimeConfig
activeConfig
activeItemConfig
effectiveConfig
resolvedConfig
normalizedConfig
source*Config
graphConfig
pathConfig
numberGeometry
.config.styles =
this.config.option_map =
mapped_state
prepareSourceConfig
paint.styles
setPaintStyles
text-tool-geometry
```

Do not blindly delete every hit.

Classify each remaining hit:

```text
legitimate local variable
legitimate unique domain concept
canonical shared concept with wrong name
old architecture that must be removed
```

## 7. Canonical vocabulary audit

Search for local synonyms of:

```text
config
geometry
runtime
paint
history
graphInput
cache
*Signature
*Changed
```

A different name is acceptable only when it communicates a genuinely different responsibility.

Examples of expected post-migration checks:

- `resolvedEntityConfigs` should not survive alongside `runtimeEntityConfigs` if they mean the same thing.
- a graph calculation contract should not still be called `config` merely from history.
- `numberGeometry` should not survive if every other tool uses `geometry`.
- `setConfig()` should not remain on a class where the method only clears async requests.

## 8. Pass A — strict compliance

Fix remaining ownership/naming deviations with the smallest changes possible.

This is the point where support-module terminology is normalised across the codebase.

Do not turn naming cleanup into another large abstraction layer.

## 9. Pass B — final simplification audit

Now inspect the architecture after all responsibilities are in their final locations.

For each module ask:

- is this helper still necessary?
- is this intermediate object still necessary?
- is this persistent state still necessary?
- is this signature still necessary?
- is this guard still protecting a possible state?
- is this fallback still reachable?
- is this config merge still repeated?
- are two lifecycle functions now one obvious linear operation?
- is a compatibility adapter now dead?
- is the same information stored twice?
- would this layer be introduced in a fresh implementation today?

Remove architectural redundancy only.

## 10. Guard classification

Do not equate “simplification” with deleting checks.

Every surviving/removal candidate check should be classifiable as:

```text
configuration translation/validation
external HA/network/DOM runtime data
lifecycle readiness
algorithmic edge case possible with valid config
consumer-owned semantic conversion
```

A config guard that has become impossible downstream can disappear.

A guard against real external runtime data remains with its consumer.

## 11. Source-size report

Record final:

- product-owned root modules;
- code lines;
- comment-only lines;
- blank lines;
- physical lines;
- per-family deltas against `dd89eb08...` and against the immediately preceding plan.

Source size is a signal, not the architecture goal.

A small increase is acceptable when it establishes a clear owner. The final result should nevertheless remove duplicate routes and therefore trend toward less repeated code.

## 12. Full regression acceptance

Run:

```bash
npm run build
npm run test:browser:all
```

plus all architecture source assertions introduced in Plans 15B–19.

Any visual difference must be treated as a regression unless explicitly separated into another feature/fix.

## 13. Documentation cleanup

Update or replace old refactor documentation that still describes:

```text
gatekeeper
candidate config
accepted config
active config as a separate conceptual state
config.svg as accepted derived config
Series as owner of effective series config
Select HA options as canonical config
```

The final docs should use the canonical vocabulary only.

Historical implementation-result documents may remain as history, but the active master-plan README must clearly mark them as superseded where their architecture no longer applies.

## 14. Final Definition of Done

The project is complete when a maintainer can open an unfamiliar tool and, without first learning its private history, know where to search for:

```text
configuration
geometry
runtime
paint
lifecycle
rendering
```

The same names mean the same things throughout the product source.

The code behaves as before, but the architecture no longer requires memorising each tool and module individually.

---
