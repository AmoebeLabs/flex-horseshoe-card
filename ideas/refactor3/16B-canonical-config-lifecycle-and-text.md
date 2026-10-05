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
