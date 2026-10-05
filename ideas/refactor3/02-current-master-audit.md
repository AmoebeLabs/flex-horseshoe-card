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
