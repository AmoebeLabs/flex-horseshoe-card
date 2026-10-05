# Plan 20 Review

Date: 2026-10-04

Reviewed plan:

`Plan 20 - Whole-Source Post-Migration Audit and Simplification`

Starting revision:

`82c96efccb0717d2febbe08f15aad3278401c9c7`

## Final Review Disposition

```text
BLOCKING: 0
REWORK:   0
ADAPT:    3
```

Plan 20 is structurally sound and ready after three targeted adaptations.

The main approach is correct:

- audit the current code as complete producer-to-consumer chains;
- do not treat search hits or field names as proof of duplication;
- distinguish real domain/lifecycle/measurement work from obsolete architecture;
- make small ownership/naming corrections first;
- perform a second whole-source pass afterwards;
- preserve current product behavior while removing proven redundancy.

The three adaptations below keep Plan 20 internally accurate and prevent it from accidentally turning temporary post-migration implementation details into permanent architectural contracts.

---

## 1. Confirmed Strengths

### 1.1 Whole-chain review method is correct

The plan explicitly requires tracing:

```text
producer
→ owner
→ consumer
→ render/lifecycle
```

before changing ownership.

That is the right basis for this cleanup. A field name, helper or signature can only be classified correctly after its full route is understood.

### 1.2 Initial Pass-A findings are mostly source-supported

The following proposed changes are supported by the current source and are appropriate Plan-20 work:

```text
resolvedEntityConfigs
→ runtimeEntityConfigs

activeGroupConfigs
→ runtimeGroupConfigs

ExternalSvgSources.setConfig()
→ clearPendingRequests()

remove CardTools.setToolEntityState()
remove ControlBase.hasControlLabel
remove unused HomeAssistant/CardTheme storage
remove Palette.loadAll downstream optional default
remove obsolete commented StateTool/Text/BaseTool descriptions
```

These are either naming corrections, duplicate state removal or trivial wrappers with no separate semantic responsibility.

### 1.3 Text geometry helper should remain

`text-tool-geometry.js` has a real functional purpose.

It chooses between:

```text
exact browser-measured geometry
```

and:

```text
estimated geometry
```

when exact measurement is not yet available.

That is not a trivial wrapper and should remain.

---

## 2. ADAPT 1 — Do Not Rename `activeConfigInitialized` to `configInitialized`

### 2.1 Problem

The plan currently proposes:

```text
activeConfigInitialized
→ configInitialized

activeConfigSignature
→ evaluatedConfigSignature
```

The second rename is reasonable.

The first is semantically inaccurate.

### 2.2 Current BaseTool behavior

`BaseTool` creates `this.config` in the constructor.

For static tools it can already be fully translated there:

```js
this.config =
  translateConfig && !this.hasJavascript
    ? translateConfig(config)
    : config;

this.activeConfigInitialized = false;
```

Therefore this state is possible:

```text
this.config exists
this.config is already translated
activeConfigInitialized === false
```

Renaming the flag to:

```text
configInitialized
```

would falsely imply that config does not yet exist or is not initialized.

### 2.3 Actual meaning

The flag indicates that the normal runtime-config phase has completed at least once.

For dynamic tools it additionally marks the boundary after which the first evaluated runtime configuration is available and render/lifecycle consumers may safely use it.

A more accurate name would be:

```text
runtimeConfigInitialized
```

or another equally explicit equivalent.

### 2.4 Required plan change

Replace the planned rename:

```text
activeConfigInitialized
→ configInitialized
```

with:

```text
activeConfigInitialized
→ runtimeConfigInitialized
```

or another name that explicitly refers to the runtime-config phase.

Keep:

```text
activeConfigSignature
→ evaluatedConfigSignature
```

unless implementation review finds a still clearer source-level term.

---

## 3. ADAPT 2 — Explicitly Remove the Accidental `horseshoes_v2` Development Alias

### 3.1 Problem

Plan 20 correctly states that transitional aliases and unnecessary adapters should not remain.

However, the plan does not explicitly identify:

```text
layout.horseshoes_v2
```

even though it is one of the clearest known examples of accidental compatibility.

### 3.2 Historical status

`horseshoes_v2` was not an intended public legacy contract.

It was a temporary development name used while the newer Horseshoe implementation was being built.

The implementation was later renamed to:

```text
horseshoes
```

but previous refactor work incorrectly treated the old temporary name as a compatibility alias.

The project now contains runtime, schema, tests and documentation that retroactively describe it as public legacy behavior.

### 3.3 Current remaining route

The current source still contains `horseshoes_v2` in:

```text
src/horseshoe-gauge.js
src/const.js
src/layout-sections.js

ai-card-builder/config-schema/definitions/layout/horseshoes_v2.yaml
ai-card-builder/config-schema/definitions/layout.yaml
ai-card-builder/config-schema/definitions/layout/compounds.yaml
generated schema metadata

tests/horseshoe-path-adapter.test.js

historical/current architecture documentation
```

`HorseshoeGauge.setConfig()` still reads both:

```text
layout.horseshoes_v2
layout.horseshoes
```

into the same current implementation.

### 3.4 Why explicit scope is necessary

Plan 20 also says to preserve public YAML.

Without an explicit note, an implementation agent could reasonably infer:

```text
schema says deprecated
test says compatibility alias
→ preserve it
```

That would repeat the original mistake.

Tests and schema entries created around an accidental development stage are not by themselves proof of a public product contract.

### 3.5 Required plan change

Add a known finding to the initial evidence table:

```text
layout.horseshoes_v2
→ REMOVE the complete accidental development alias.

Remove:
- runtime input route;
- section/constants entries;
- dedicated schema definition;
- generated schema references;
- tests whose only purpose is preserving the false alias;
- active documentation that presents it as compatibility.

Do not confuse this with genuine root-level historical Horseshoe configuration.
Review that separately on its own evidence.
```

This should be treated as a concrete Plan-20 cleanup target, not left to generic search.

---

## 4. ADAPT 3 — Do Not Turn Current `paint.styles` and Presentation Signatures Into Permanent Contracts

### 4.1 Problem

Plan 20 currently describes several current post-migration structures as if they are the final intended architecture.

Examples include:

```text
active colors/styles in paint
retained children consume current config and paint.styles
Text part signatures ... KEEP
```

For Plan 20 itself, preserving current behavior is appropriate.

However, subsequent discussion has established that several of these mechanisms are explicit Plan-21 review candidates.

Plan 20 should therefore avoid hardening them into permanent product contracts.

### 4.2 Known Plan-21 candidates

The current source contains:

```text
presentationSignature
hasPresentationChanged()
cardPresentationSignature

paint.styles
setPaintStyles()

palette/mapping signatures
exact internal object-identity reuse assertions
```

Some of these may remain after Plan 21.

Others may disappear entirely.

Plan 20 should not decide that question indirectly by adding documentation or tests that require the current implementation shape.

### 4.3 Required distinction

The plan should explicitly distinguish:

```text
functional behavior
```

from:

```text
current internal ownership/identity
```

For example, child style behavior that must be preserved is:

```text
the correct final SVG/CSS styles
the correct precedence
font-related style changes invalidate text measurement when necessary
```

The product requirement is not necessarily:

```text
styles must live in paint.styles
```

Likewise, a theme change may need to preserve:

```text
correct values
correct colors
correct geometry
correct visible output
```

but not necessarily:

```text
the exact same PathValueMapper object identity
```

unless that identity is demonstrated to protect meaningful processing cost.

### 4.4 Presentation signatures versus real signatures

This distinction should be explicit in Plan 20.

Examples of potentially justified signatures:

```text
text measurement signatures
async request identity
history/data revision
expensive geometry cache keys
```

These can prevent real:

```text
DOM measurement
network requests
history processing
geometry computation
```

and are valid runtime mechanisms.

Generic presentation signatures are different.

Current examples:

```text
BaseTool.presentationSignature
main.cardPresentationSignature
tool hasPresentationChanged() chains
```

exist primarily to determine whether `requestUpdate()` should occur after relevant state/theme/config work has already happened.

Those mechanisms are specifically deferred to Plan 21 for reconsideration.

### 4.5 Required plan wording

Add a constraint similar to:

```text
Preserve current visible style behavior, style priority, measurement behavior and
functional output during Plan 20.

Do not treat paint.styles, generic presentation signatures, or exact runtime
object identity as permanent product contracts.

Measurement, lifecycle, async, history and demonstrably expensive calculation
signatures may remain where they have a concrete function.

Generic render gating and presentation-diff simplification are deferred to
Plan 21 unless Plan 20 finds a trivially dead or unused mechanism.
```

Also revise the existing KEEP wording around Text part signatures so it means:

```text
KEEP signatures that protect a concrete evaluation, measurement,
HA-availability, async or interaction responsibility.
```

not:

```text
KEEP every current signature because it already exists.
```

### 4.6 Testing implication

Plan-20 tests should verify behavior rather than unnecessarily freezing internal architecture.

Prefer:

```text
rendered styles are correct
theme switch is correct
text measurement remains correct
graph/path result remains correct
no extra JS evaluation/history request occurs
```

over assertions such as:

```text
tool.paint.styles must exist
runtime object A must be strictly identical to previous runtime object A
presentationSignature must have a particular internal shape
```

unless that exact identity is the mechanism being deliberately protected and its performance/correctness role is documented.

---

## 5. Terminology Cleanup

This is not a separate ADAPT item, but should be folded into the implementation of ADAPT 3.

Plan 20 still uses architecture-heavy terms such as:

```text
publication
published config
first publication
palette publication
```

in places where the operation is simpler.

Prefer direct wording where possible:

```text
set/update config
first runtime-config update
update derived entity
palette loaded/available
```

Do not perform a blind global rename.

Only replace terminology where the underlying operation is ordinary and the architectural term adds no useful distinction.

This aligns with Plan 20's own Definition of Done: a maintainer should be able to open an unfamiliar tool and understand the route without learning private refactor terminology.

---

## 6. Confirmed Initial Findings

The following initial Plan-20 findings remain approved.

### `resolvedEntityConfigs`

Rename to:

```text
runtimeEntityConfigs
```

The current name reflects an older phase distinction and no longer describes the role clearly.

### `ExternalSvgSources.setConfig()`

Rename to:

```text
clearPendingRequests()
```

The method currently does:

```js
setConfig() {
  this.requests.clear();
}
```

It does not set configuration.

The existing stale-result, current-target and disconnect guards remain functional and should stay.

### `activeGroupConfigs`

Rename to:

```text
runtimeGroupConfigs
```

The source/runtime distinction remains real because JavaScript groups can be reevaluated.

GroupManager's derived/effective coordinate cache remains a separate real responsibility.

### CardTheme / HomeAssistant cleanup

Removing unread/duplicate storage is appropriate provided:

```text
theme observer/reconnect behavior
modeChanged signal
current HA reference required by theme observers
```

remain intact.

### `Palette.loadAll()`

Removing downstream optional default handling is appropriate if the producer guarantee is confirmed for every production call site.

### `CardTools.setToolEntityState()`

Remove if every caller simply forwards the same arguments to:

```js
tool.setEntities(...)
```

Update the complete caller set atomically.

### `ControlBase.hasControlLabel`

Remove duplicate boolean storage.

Read:

```js
this.config.label !== undefined
```

at the point where label creation/removal is decided.

Dynamic label behavior and child lifecycle must remain unchanged.

### `text-tool-geometry.js`

KEEP.

It contains a meaningful functional branch between exact and estimated geometry.

---

## 7. Pass-B Guidance

The Pass-B structure is good and should remain.

For each candidate mechanism ask:

```text
What produces it?
Who consumes it?
What work or incorrect behavior does it prevent?
Is the same guarantee already made earlier?
What observable behavior changes if it is removed?
```

Classify retained mechanisms by concrete purpose:

```text
configuration translation/validation
external HA/network/DOM handling
lifecycle readiness
measurement readiness
reachable algorithmic case
semantic conversion
expensive processing/cache
```

A mechanism should not be retained merely because:

```text
a previous plan introduced it
a test checks it
a schema/doc now mentions it
its name sounds architectural
```

Tests can preserve accidental architecture just as source code can.

---

## 8. Relationship With Plan 21

Plan 20 and Plan 21 should remain separate.

### Plan 20

Completes the current migration series:

```text
consistent names
one source/current config route
remove known duplicate owners
remove obsolete adapters
remove dead wrappers/state
complete whole-source audit
```

### Plan 21

Challenges remaining runtime/render complexity:

```text
state/theme change
→ process current values
→ requestUpdate()
→ Lit/browser

JS config context change
→ reevaluate config
→ process dependent values
→ requestUpdate()
```

It will reconsider:

```text
generic presentation signatures
render gating
paint/style indirection
trivial setters/getters
unnecessary cache/invalidation bookkeeping
internal identity tests
```

while preserving:

```text
real measurement
real async/resource lifecycle
real history processing
real expensive geometry/data calculations
```

Plan 20 should leave those mechanisms functionally intact unless they are plainly dead, but should not document them as immutable architecture.

---

## 9. Final Disposition

```text
BLOCKING: 0
REWORK:   0
ADAPT:    3
```

Required adaptations:

```text
ADAPT 1
Do not rename activeConfigInitialized to configInitialized.
Use runtimeConfigInitialized or another name describing the actual runtime phase.

ADAPT 2
Add layout.horseshoes_v2 as an explicit known accidental-development alias and
remove its complete runtime/schema/test/documentation compatibility route.

ADAPT 3
Preserve current style/render behavior during Plan 20, but do not make
paint.styles, generic presentation signatures or exact runtime object identity
permanent architecture contracts. Explicitly distinguish real
measurement/lifecycle/async/expensive-work signatures from generic render gating.
```

After these three adaptations:

```text
BLOCKING: 0
REWORK:   0
ADAPT:    0

PLAN 20 READY FOR IMPLEMENTATION
```
