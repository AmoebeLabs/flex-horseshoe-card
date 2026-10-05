# Plan 21 - Update, Render and Targeted Invalidation Architecture

Date: 2026-10-04  
Baseline: `16692192a33dd3423387ea99087c7d4b9447d5f8` (`master`, after Plan 20)  
Product baseline: 71 JavaScript product modules, 23,883 code lines, 5,381 comment-only lines, 3,126 blank lines, 32,390 physical lines.

## 1. Goal

Simplify the complete update/render architecture around the same basic model used by an ordinary Home Assistant card:

1. determine whether input relevant to this card changed;
2. if nothing relevant changed, stop immediately;
3. if relevant runtime data changed, process the affected runtime owners;
4. if dynamic JavaScript configuration exists, evaluate it only after a relevant dependency changed;
5. if evaluated configuration is unchanged, do not repeat configuration-dependent work;
6. if configuration changed, invalidate only the owners whose inputs actually changed;
7. request a Lit update;
8. let Lit reconcile the current rendered values with the existing DOM.

The card must not rebuild and serialize its complete final presentation merely to decide whether Lit may render.

Plan 21 is an architecture review across the entire product. It is not a collection of local cleanup opportunities around `hasPresentationChanged()`.

---

## 2. Core architecture

### 2.1 Two change streams

There are only two architectural sources of change.

#### A. Runtime data/context

The normal card lifecycle is driven by runtime inputs:

- configured Home Assistant entities and attributes;
- local/input entities;
- locale and entity display metadata where these affect visible output;
- theme changes;
- light/dark or day/night mode;
- reconnect/lifecycle state where an owner explicitly retained work.

The important rule is:

```text
new hass/context
→ did an input relevant to this card change?
    no  → stop
    yes → process affected runtime state
          → requestUpdate()
```

A new `hass` object alone is not a relevant change.

#### B. Dynamic JavaScript configuration

JavaScript makes configuration itself runtime-dependent.

That creates a second, explicit invalidation layer:

```text
relevant declared input changed
→ does the affected configuration contain JavaScript?
    no  → no JS evaluation
    yes → evaluate cached/compiled JavaScript
          → evaluated result equal to current config?
              yes → no config-dependent rebuild
              no  → accept new config
                    → invalidate only dependent owners
```

This is valid early change detection because it prevents real configuration and downstream work.

It is fundamentally different from reconstructing the final presentation after processing merely to decide whether a render should be suppressed.

---

## 3. Declared entities are the HA invalidation boundary

The configured entity list defines which Home Assistant state changes can invalidate the card.

JavaScript may still read arbitrary Home Assistant state:

```js
hass.states['sensor.external']
```

Plan 21 does not ban or parse this.

However, if `sensor.external` is not declared in the card's entity list, a change to only that entity does not invalidate the card.

Its current value remains readable the next time the card is legitimately updated.

If a JavaScript expression must respond immediately to `sensor.external`, the user must add it to the card's declared entities.

Therefore:

> The entity list is both card data input and dependency/subscription declaration for Home Assistant state invalidation.

This mirrors an environment where Home Assistant would deliver updates only for entities to which the card explicitly subscribed.

Do not retain a global implicit dependency on every entity in `hass.states` merely because JavaScript exists somewhere in the card.

---

## 4. First and second early exits

Plan 21 establishes two deliberate early invalidation boundaries.

### Gate 1 - relevant runtime input

```text
setHass()
→ compare declared card inputs / runtime context
→ nothing relevant changed?
    yes → return immediately
```

When Gate 1 returns:

- do not evaluate JavaScript config;
- do not rebuild runtime entity configs;
- do not update groups;
- do not update tools;
- do not update animations;
- do not evaluate final styles/presentation;
- do not call `requestUpdate()`.

This is expected to remove the current `cardHasJavascript` behaviour where any Home Assistant delivery can force JavaScript/config work.

### Gate 2 - dynamic config result

If relevant data changed and JavaScript-backed configuration must be evaluated:

```text
evaluate JS
→ evaluated configuration equal?
    yes → keep current config
          → do not perform config-dependent reconstruction
    no  → publish accepted config
          → invalidate only dependent owners
```

Existing evaluated-config reuse should remain where it serves this purpose.

---

## 5. Normal render rule

Once a relevant runtime update is accepted and required processing is complete:

```text
relevant runtime change
→ process current state/config-dependent owners
→ requestUpdate()
→ render current values/styles/colors
→ Lit reconciles bindings
```

There is no second generic application-level presentation comparison.

Example:

```text
HA state: 20.1 → 20.4
displayed text: "20" → "20"
paint: red → red

desired:
→ relevant entity changed
→ process current state
→ requestUpdate()
→ render produces "20" and red
→ Lit sees unchanged bindings and performs no unnecessary DOM mutation
```

The card must not reconstruct:

- final styles;
- paint;
- content;
- group presentation;
- child presentation;
- final tool output;

solely to discover that Lit would receive the same value.

---

## 6. Responsibility boundary with Lit

`requestUpdate()` is not equivalent to rebuilding the physical DOM.

Lit already performs value reconciliation.

Plan 21 therefore adopts the rule:

> Do not duplicate Lit's value reconciliation in application code.

The card owns:

- runtime state;
- evaluated config;
- derived data;
- paint inputs;
- geometry;
- measurement inputs;
- asynchronous resources.

Lit owns:

- template reconciliation;
- deciding which bindings actually changed;
- DOM updates required by those changed bindings.

Render suppression is not assumed to be an optimization.

A separate presentation-diff system is justified only if measurement proves that it costs less than letting Lit reconcile, and only if no simpler targeted optimization exists.

---

## 7. Performance principle

The card is not designed for high-frequency industrial telemetry.

Typical Home Assistant inputs are relatively slow:

- switches/lights: event-driven;
- temperature/humidity: seconds to minutes;
- power/energy: often around one update per second at the fast end;
- theme/day-night: rare;
- configuration changes: rare.

Do not optimize hypothetical tens or hundreds of renders per second at the cost of permanent architecture complexity.

Optimize measured expensive work first:

- JavaScript/config evaluation;
- history retrieval/conversion/publication;
- aggregation;
- statistics;
- graph geometry;
- SVG/path measurement;
- DOM text measurement;
- gradient sampling;
- asynchronous loading;
- animation/path sampling.

Only reconsider render suppression later if a controlled benchmark demonstrates that Lit reconciliation is itself a material bottleneck.

---

## 8. Main update flow

### 8.1 `main.js`

Review `setHass()` / `updateSourceEntities()` first.

Current architecture broadly does:

```text
setHass()
→ locale/entity display/theme checks
→ cardHasJavascript can force contextChanged
→ configured entity checks
→ runtime entity config evaluation
→ groups
→ sourceUpdateRequired
→ tools
→ animations
→ presentation signatures
→ maybe requestUpdate()
```

Target architecture:

```text
setHass()
→ update raw HA/theme helpers
→ determine:
    - declared entity/input change
    - locale/entity-display change where relevant
    - theme/mode change
    - reconnect-required owner work
→ nothing relevant?
    → return

→ evaluate only required dynamic config
→ publish accepted runtime config only when changed
→ process affected producers/derived entities
→ process affected runtime owners
→ update animation/effective style inputs in correct order
→ requestUpdate()
```

Remove the generic second render decision based on:

- `CardTools.hasPresentationChanged()`;
- `cardPresentationSignature`;
- `toolsChanged`;
- `cardStylesChanged`;
- normal-path `renderRequired`.

`updateEntityPresentation()` does not need to return a render boolean unless an actual consumer remains.

---

## 9. Theme and day/night

Theme/light-dark changes are legitimate runtime invalidation inputs.

They may require:

- palette resolution;
- paint/style reevaluation;
- gradient refresh;
- text measurement invalidation if effective font metrics change.

They do not automatically justify:

- Home Assistant entity reprocessing;
- History rebuild;
- aggregation;
- graph geometry;
- path geometry;
- arbitrary JavaScript config reevaluation.

Review each dependency explicitly.

Theme-only processing should normally end in `requestUpdate()` after its affected owners have been updated.

---

## 10. Animation ordering

The current generic presentation comparison also has an accidental ordering effect: Text presentation checking occurs after animation styles are current.

Removing `hasPresentationChanged()` must not lose this.

Measurement-sensitive tools need final effective text/font styles before measurement invalidation.

Review and establish an explicit order, likely equivalent to:

```text
runtime config
→ animation/effective-style selection
→ tool state / text measurement inputs
→ Sparkline presentation owners
→ requestUpdate()
```

or another sequence proven correct by existing behaviour.

Do not retain generic presentation comparison merely to preserve this side effect.

---

## 11. `CardAnimations`

`CardAnimations.update()` currently compares serialized style state before/after so `main.js` can decide whether rendering is required.

If no other consumer needs that boolean after generic render gating is removed:

- remove whole-style before/after `JSON.stringify()` comparison;
- update owned animation state directly;
- stop returning a generic render-change result.

Retain actual animation state, matching and reuse behaviour.

---

## 12. `BaseTool` shared contract

### Remove generic presentation state

Remove from the shared architecture:

- `presentationSignature`;
- `BaseTool.hasPresentationChanged()`;
- generic style/content serialization used only to gate rendering.

`BaseTool` must not build:

- effective styles;
- color-stop paint;
- color filters;
- group chains;
- arbitrary content snapshots;

solely to determine whether Lit should be called.

### Keep meaningful config invalidation

`configurationChanged`, `groupChanged`, `themeModeChanged`, `configChanged` or equivalents may remain only where consumers use them to avoid real work such as:

- config translation;
- child reconstruction;
- geometry reconstruction;
- palette calculation;
- measurement invalidation;
- other targeted owner work.

They must not become renamed presentation gating.

### `evaluatedConfigSignature`

Keep the JavaScript evaluated-config comparison unless review proves it unnecessary.

Its purpose is valid:

```text
same evaluated JS result
→ no new config
→ skip translation/inheritance/config-dependent reconstruction
```

---

## 13. Style and paint ownership

Generic configured styles are styles, not paint state.

Review:

```text
setPaintStyles()
paint.styles
```

against the shared rule:

```text
config.styles
    = configured tool styles

runtime/effective style override
    = temporary parent/state-selected style input where needed

paint
    = palette/color-stop/gradient/stroke/fill paint state
```

Controls genuinely pass temporary effective styles to Text/Icon children. Preserve that behaviour.

Simplify naming/ownership so ordinary styles are not stored under `paint` solely for historical reasons.

Do not introduce a new style manager.

A wrapper may remain where it owns a real side effect such as text measurement invalidation.

---

## 14. Ordinary tools and Text

### Ordinary tools

Remove `hasPresentationChanged()` overrides whose only purpose is the generic final render decision, including current Name, Area, State and Icon presentation comparisons.

Their real runtime state and render methods remain.

### Text measurement remains targeted invalidation

Retain mechanisms such as:

- `textMeasurementSignature`;
- `widthOverflowSourceSignature`;
- `widthOverflowMeasurementSignature`;
- measurement pending/revision state;
- async font/frame ownership;
- exact/estimated bounds.

These avoid actual browser measurement/layout work.

Text, Name, Area and State must receive final effective text/font styles before measurement invalidation.

A completed async DOM measurement may still call `requestUpdate()` directly when it produces new geometry or final wrap/ellipsis output.

---

## 15. Controls and nested tools

Apply the same architecture to Controls.

Remove recursive presentation aggregation from:

- `ControlBase`;
- Button;
- Toggle;
- Select;
- Slider;
- Number;
- Content;
- generated child tools.

A Control does not need to ask every child whether final output changed before Lit may render.

Retain:

- child runtime-config updates;
- state/entity forwarding;
- child reconstruction on real config/layout changes;
- effective active/inactive styles;
- Text/Icon measurement behaviour;
- interaction state;
- HA-derived Select options;
- lifecycle/availability state.

Review direct `setPaintStyles()` overrides in Name/Area/State and remove them if no real caller or side effect remains.

---

## 16. Sparkline

Sparkline uses the same normal render rule but must retain its proven expensive-work optimizations.

### Remove

Remove Sparkline presentation work whose only purpose is final render gating, including `SparklineGraphTool.hasPresentationChanged()`.

Do not serialize already-owned:

- processed data revisions;
- geometry signatures;
- statistics;
- colors;
- request/data state;
- legend state;

again merely to decide whether Lit may render.

### Retain targeted invalidation

Retain unless specific review proves otherwise:

- History request identities/generations;
- retained rows/ranges;
- conversion invalidation;
- `processedDataKey`;
- `processedDataRevision`;
- bucket plans/results;
- aggregation/statistics reuse;
- geometry input/result invalidation;
- Series shared layout reuse;
- pointer source identity;
- async day/night ownership.

### Palette and layout signatures

`paletteCalculationSignature` and `seriesLayoutSignature` may remain if they demonstrably avoid graph/layout/scale work.

They are not generic presentation gates.

Simplify their inputs where possible, but do not remove real geometry reuse.

---

## 17. Horseshoe and Path

### Remove generic Horseshoe presentation detection

Remove Horseshoe's `hasPresentationChanged()` contribution.

Mapped value, painted ranges, layers and marker styles do not need to be serialized again simply to gate Lit.

### Reassess `runtime.mappingKey`

Measure whether the mapping key is worth its complexity.

It currently avoids rebuilding work such as:

- state mapping;
- `GaugeScale`;
- `PathValueMapper`.

Benchmark representative:

- linear numeric scale;
- spline scale;
- ranked/string state map;
- ordinary numeric changes;
- theme-only changes.

If the avoided work is trivial, remove the key and calculate directly.

If spline/ranked mappings show meaningful cost, retain or narrow the key to actual expensive inputs.

Do not preserve object identity merely because old tests expect it.

### Retain true Path caches

Keep targeted caches protecting:

- path definitions/transforms;
- SVG measurements;
- tick/label geometry;
- measured gradient contracts;
- adaptive sampling;
- temporary samples;
- animation generations/frames;
- static geometry reuse.

Theme-only paint should continue to reuse path geometry where possible.

---

## 18. Async and owner-specific updates

Normal render simplification must not collapse independent async lifecycles.

Owner-specific completion may call `requestUpdate()` directly when it produces a new visible/geometric result.

Examples:

- resolved palette/CSS variables;
- external SVG/icon loading;
- History completion;
- Sparkline result completion;
- text/font measurement;
- day/night async data;
- Horseshoe animation frames;
- pointer interaction.

Each route remains bounded to its owner.

Do not restart the complete HA/config/data pipeline for a targeted async completion.

---

## 19. Whole-source architecture review

Review all 71 product modules, including modules without obvious Plan-21 search hits.

Do not ask:

> What can be simplified in this module?

Ask:

> Does this module follow the Plan-21 input → invalidation → update architecture?

Classify each relevant field/method/key/signature as:

| Classification | Rule |
| --- | --- |
| Runtime input tracking | Keep when required to determine whether this card is affected. |
| Dynamic config invalidation | Keep when it prevents config evaluation/rebuild. |
| Runtime/lifecycle state | Keep when connection/availability/interaction requires it. |
| Async identity | Keep when stale async results must be rejected. |
| Expensive-data invalidation | Keep when network/history/conversion/aggregation/statistics is avoided. |
| Expensive-geometry invalidation | Keep when graph/path/layout work is avoided. |
| DOM-measurement invalidation | Keep when browser measurement is avoided. |
| Render-only change detection | Remove. |
| Duplicate derived state | Remove or derive from real owner. |
| Style/paint indirection | Align with shared style ownership. |
| Internal identity assertion | Keep only if it proves avoided work or lifecycle correctness. |

For every retained cache/signature/key answer:

```text
Who produces it?
Who consumes it?
What concrete work does it prevent?
Would removing it change behaviour?
Would removing it repeat expensive work?
Is that work already protected earlier?
```

Historical existence is not evidence.

---

## 20. Test contract migration

Plan 21 changes the render policy introduced by Plan 08.

The product contract is no longer:

```text
same final presentation
→ Lit render count must be zero
```

The contract becomes:

```text
irrelevant card input
→ no work

relevant runtime input
→ correct current output
→ requestUpdate()

unchanged expensive input
→ expensive domain work is not repeated
```

### Rewrite/remove tests that enforce old implementation details

Review assertions around:

- `hasPresentationChanged()`;
- `presentationSignature`;
- `cardPresentationSignature`;
- exact `renderCount === 0` for equal final text/paint;
- mapper/state-map/scale identity with no performance/lifecycle purpose;
- exact signature shapes used only for render gating.

### Preserve and strengthen functional coverage

Keep tests for:

- state/attribute changes;
- rounded text correctness;
- color-threshold changes;
- UOM/icon/group/theme changes;
- light/dark changes;
- Controls;
- animations affecting text metrics;
- async completion;
- JavaScript config publication.

### Change arbitrary external-entity JS regression

Existing behaviour that any `hass.states[...]` access automatically invalidates on every global HA update is no longer the target contract.

Replace it with:

- JS may still read arbitrary `hass.states[...]`;
- only declared entities trigger HA-state invalidation;
- declaring an external dependency causes its change to trigger reevaluation;
- undeclared dependency becomes visible on the next legitimate card update.

---

## 21. Permanent performance benchmarks

Plan 21 makes the performance harness permanent instead of leaving one-off scripts in `/tmp`.

### 21.1 Existing update benchmark

The recovered historical 24-card benchmark now lives at:

```text
tests/performance-update.test.cjs
```

It originated as `/tmp/fhs-pointer-cpu-check.cjs`.

Its proven workload includes:

- Chromium;
- 24 historical Sparkline line cards;
- 24-hour rolling window;
- 800 History rows per card;
- bins `per_hour: 12`;
- real Lit rendering;
- fake immediate History API;
- counters for render/graph/pointer/history;
- internal method timing;
- CDP `Performance.enable` with `threadTicks`;
- `ThreadTime`, `TaskDuration`, `ScriptDuration`, `LayoutDuration`, `RecalcStyleDuration`;
- fixed warm-up/measured update phases.

Historical results from the earlier optimization must remain documented as context, not as hard timing thresholds.

### 21.2 Horseshoe/Path benchmark

Recover `/tmp/fhs-plan10-benchmark.mjs` into `tests/` as a permanent benchmark.

It measures Horseshoe gradients, path measurements and animation cost.

Before using it:

- update removed API calls such as `getPathElement`;
- preserve the original measured intent;
- do not redesign the workload around Plan 21;
- document any unavoidable adaptation.

Recommended permanent filename:

```text
tests/performance-horseshoe.test.mjs
```

### 21.3 Plan-21 benchmark scenarios

Before production changes, establish the current-master baseline for the following fixed workloads.

#### P21-A - irrelevant HA update, static config

24 cards receive new `hass` objects while none of their declared entities/attributes change.

Expected architecture:

```text
setHass
→ declared inputs unchanged
→ immediate return
```

Record:

- elapsed `setHass`;
- main-thread CPU;
- JS evaluations;
- config evaluations;
- tool updates;
- `requestUpdate`;
- render count.

#### P21-B - irrelevant HA update, JavaScript present

Same as A, but each card contains representative dynamic JavaScript config.

This is the critical current-path benchmark.

Target after Plan 21:

```text
declared inputs unchanged
→ 0 JS config evaluations
→ 0 config rebuilds
→ 0 requestUpdate
→ 0 render
```

A and B should become similar in cost when no declared dependency changes.

#### P21-C - relevant entity change, visible output changes

24 cards receive a real declared entity change producing a visible change.

Measure the normal full runtime route.

#### P21-D - relevant entity change, visible output remains equal

Example:

```text
20.1 → 20.4
formatted text: "20" → "20"
paint: unchanged
```

Target:

- normal runtime processing;
- `requestUpdate()` occurs;
- old generic presentation serialization is absent;
- Lit reconciles unchanged bindings.

This scenario measures the real tradeoff between old application-level render suppression and normal Lit reconciliation.

#### P21-E - JS evaluated, config result unchanged

A declared dependency changes.

Dynamic JS is evaluated, but its result equals the existing accepted config.

Target:

- JS evaluation occurs once where needed;
- no config-dependent reconstruction;
- runtime state still updates normally where required.

#### P21-F - JS evaluated, config result changes

A declared dependency changes and dynamic config genuinely changes.

Target:

- new config accepted;
- only dependent owners invalidated;
- required geometry/paint/measurement rebuilt;
- normal render follows.

#### P21-G - existing 24h historical Sparkline update

Use the recovered 24-card / 800-row historical workload unchanged enough to compare across commits.

Verify that Plan 21 does not regress proven History/Series/Graph reuse.

#### P21-H - heavy two-week Sparkline workload

Restore/add the 20,160 rows/card two-week variant used in the earlier Sparkline optimization.

Use the same warm-up/update count documented by the historical run.

This guards against accidentally removing expensive-data/geometry caches while simplifying rendering.

#### P21-I - Horseshoe/Path runtime and theme-only update

Use the recovered Plan-10 Horseshoe benchmark to compare:

- numeric state update;
- theme-only paint update;
- gradient/path measurement;
- animation cost.

This helps decide whether `runtime.mappingKey` and related targeted caches are worth retaining.

---

## 22. Performance metrics

Do not use wall-clock time alone.

Record both timings and operation counts.

### Browser/total timing

At minimum:

- complete update elapsed;
- CDP `ThreadTime`;
- `TaskDuration`;
- `ScriptDuration`;
- `LayoutDuration`;
- `RecalcStyleDuration`.

### Existing FHS User Timing

Use existing `dev.performance: true` phases where applicable:

- `setConfig`;
- `setHass`;
- `entities`;
- `groups`;
- `card-styles`;
- `tools`;
- `animations`;
- `render`;
- `updated`;
- `lit-update`;
- `update-cycle`.

Do not add nested timings together as CPU totals.

### Operation counters

Add/retain counters where useful for:

- `setHass` calls;
- relevant-card-input changes;
- JavaScript evaluations;
- entity-config evaluations;
- runtime-config rebuilds;
- group rebuilds;
- History requests;
- History conversions/publications;
- aggregation;
- statistics;
- graph geometry;
- path calculations;
- text measurements;
- `requestUpdate`;
- Lit render calls.

Operation counts are the stable acceptance evidence; timings are machine-dependent supporting evidence.

---

## 23. Benchmark execution policy

Performance benchmarks are permanent repository tools but are not required to run inside the ordinary fast Node test suite.

Add a clear package script if useful, for example:

```text
npm run test:performance
```

The exact script layout is implementation-owned.

Requirements:

- same browser;
- same card count;
- same fixed data;
- same fixed clock where applicable;
- same warm-up count;
- same measured update count;
- same viewport/zoom;
- same build mode;
- debug logging off;
- no unrelated History/pointer work;
- report browser errors.

Run baseline before Plan-21 production changes.

Run the exact same workloads after Plan 21.

Keep both result sets in the Plan-21 results document.

---

## 24. Historical benchmark reference

The recovered update benchmark previously produced results including:

- changed-value updates roughly `360–380 ms → 75–90 ms`;
- unchanged-value HA update roughly `125 ms → 2 ms`;
- first populated render roughly `498 ms → 269 ms`;
- later 24-hour update roughly `102.9 ms → 49.4 ms`;
- later two-week update roughly `1621.6 ms → 121.4 ms`;
- 24-hour renderer main-thread CPU roughly `110.2 ms → 56.4 ms`;
- two-week renderer main-thread CPU roughly `1621.4 ms → 120.8 ms`;
- main line path calculations `48 → 24`.

These are historical machine-dependent measurements, not Plan-21 pass/fail thresholds.

Their main value is demonstrating the usefulness of fixed multi-card fixtures and operation counts.

---

## 25. Implementation sequence

### Step 1 - baseline architecture matrix

Before changing production code:

- inventory all `requestUpdate()` routes;
- inventory all presentation signatures/change methods;
- inventory all JS/config invalidation signatures;
- inventory all targeted data/geometry/measurement caches;
- inventory style/paint ownership;
- inventory tests enforcing old Plan-08 render behaviour.

Produce the 71-module architecture matrix.

### Step 2 - restore and freeze performance harnesses

- keep `tests/performance-update.test.cjs`;
- recover/adapt `fhs-plan10-benchmark.mjs` into `tests/performance-horseshoe.test.mjs`;
- define P21-A through P21-I;
- add required operation counters;
- document fixed inputs and run instructions.

Do not change production architecture yet.

### Step 3 - measure current master

Run all Plan-21 performance workloads against baseline commit:

`16692192a33dd3423387ea99087c7d4b9447d5f8`

Record:

- timings;
- CPU metrics;
- operation counts;
- browser errors;
- relevant History/pointer activity.

### Step 4 - repair Gate 1

Change HA invalidation so `cardHasJavascript` alone no longer makes every `hass` delivery relevant.

Declared entity/input changes and explicit runtime context changes become the boundary.

Add focused functional tests before broad cleanup.

### Step 5 - verify Gate 2

Keep/simplify dynamic JS evaluated-config reuse.

Ensure:

- no JS config evaluation when Gate 1 rejects the update;
- marked config only is evaluated;
- equal evaluated config causes no config-dependent reconstruction;
- changed evaluated config invalidates only required owners.

### Step 6 - remove generic render gating

Update `main.js`, `CardTools`, `BaseTool`, animations and tool overrides.

Remove generic final presentation comparisons.

Normal accepted runtime updates end in `requestUpdate()`.

### Step 7 - fix explicit ordering

Ensure animations/effective styles are current before Text measurement invalidation.

Remove accidental reliance on `hasPresentationChanged()` ordering.

### Step 8 - align style/paint ownership

Simplify `setPaintStyles()` / `paint.styles` according to shared ownership rules.

Preserve Control effective-style behaviour and text measurement side effects.

### Step 9 - audit Sparkline/Horseshoe/Path targeted caches

Remove only render-only signatures.

Retain expensive-work caches.

Measure `runtime.mappingKey` before deciding its fate.

### Step 10 - migrate test contracts

Replace implementation-specific render suppression assertions with:

- correct output;
- correct dependency invalidation;
- avoided expensive work;
- correct async/lifecycle behaviour.

### Step 11 - whole-source Pass B

Review all 71 product modules again after implementation.

For every module record:

```text
runtime inputs
dynamic-config inputs
lifecycle/async ownership
expensive-work invalidation
measurement invalidation
style/paint ownership
remaining signatures/keys
Plan-21 exceptions
```

No-change modules still receive a review result.

### Step 12 - rerun permanent benchmarks

Run P21-A through P21-I unchanged against the final build.

Compare:

- total timing;
- main-thread CPU;
- FHS User Timing phases;
- operation counts.

Explain every material regression.

### Step 13 - final acceptance

Run:

- full Node suite;
- lint;
- Rollup/build;
- Chromium;
- WebKit;
- Firefox;
- visual validation;
- independent architecture review.

Report independent findings as BLOCKING / REWORK / ADAPT and resolve them before master merge.

Master remains unchanged until explicit user approval.

---

## 26. Expected Plan-21 performance outcomes

These are architectural expectations, not fixed timing thresholds.

### Irrelevant `hass` update

After Plan 21, a card whose declared inputs did not change should do approximately:

```text
setHass
→ dependency comparison
→ return
```

Especially for JavaScript-backed cards, expect large reductions in:

- JS evaluations;
- config object creation;
- serialization;
- runtime config work;
- tool work.

### Relevant update with equal presentation

Expect:

- one normal state update;
- one `requestUpdate()`;
- Lit reconciliation;
- no generic presentation serialization.

`render()` count may increase relative to Plan 08.

That is acceptable if total work is equal or lower and DOM output is correct.

### Heavy Sparkline

Expect no regression in:

- History request reuse;
- incremental publication;
- aggregation/statistics reuse;
- geometry reuse;
- path calculation counts.

### Theme-only

Expect:

- paint/style work;
- targeted measurement invalidation where needed;
- `requestUpdate()`;
- no History/data/geometry rebuild unless theme is a real input of that owner.

---

## 27. Out of scope

Plan 21 does not:

- redesign public YAML;
- add a JavaScript dependency parser;
- inspect arbitrary JS source for entity references;
- add a generic invalidation/event framework;
- throttle or drop Home Assistant updates;
- redesign Sparkline algorithms;
- redesign Horseshoe/Path formulas;
- optimize Lit internals;
- preserve zero-render behaviour as a product requirement;
- remove caches only because they use `signature`, `key`, `revision` or `changed`;
- create a release.

---

## 28. Documentation and comments

The final code should make the normal route obvious to a future maintainer.

Useful comments explain architecture such as:

```text
Only declared card inputs invalidate HA-dependent runtime/config work.
```

and:

```text
Once a relevant runtime update is accepted, request Lit reconciliation.
Targeted caches already protect expensive work.
```

Avoid comments that merely restate code or preserve old Plan-08 terminology.

Update active architecture documentation so Plan 21 supersedes the generic final-presentation render-gating policy from Plan 08.

Keep historical plans intact as historical records.

---

## 29. Source size reporting

Use the Plan-20 baseline:

| Metric | Plan-21 baseline |
| --- | ---: |
| Product modules | 71 |
| Code lines | 23,883 |
| Comment-only lines | 5,381 |
| Blank lines | 3,126 |
| Physical lines | 32,390 |

Record final whole-source metrics.

There is no LOC-reduction target.

Simpler ownership and fewer duplicate execution paths matter more than raw line count.

---

## 30. Definition of Done

A maintainer can explain the normal runtime route as:

```text
new HA/context input
→ did one of this card's declared inputs change?
    no  → stop
    yes → evaluate only required dynamic config
          → invalidate only affected expensive owners
          → requestUpdate()
          → Lit reconciles current presentation
```

And dynamic configuration as:

```text
relevant dependency changed
→ evaluate marked JS config
→ same result?
    yes → no config-dependent rebuild
    no  → accept new config and rebuild only dependents
```

Completion requires all of the following:

- `cardHasJavascript` no longer makes every global HA delivery a relevant update;
- declared entity/input dependencies form the HA invalidation boundary;
- arbitrary `hass.states[...]` remains readable from JS;
- undeclared JS dependencies do not trigger invalidation;
- no generic `hasPresentationChanged()` hierarchy or renamed equivalent remains;
- no complete presentation is serialized solely to gate Lit rendering;
- normal accepted runtime updates end in `requestUpdate()`;
- Lit owns final binding/DOM reconciliation;
- Text measurement still avoids unnecessary browser work;
- Sparkline retains expensive data/geometry reuse;
- Horseshoe/Path retain justified geometry/measurement caches;
- `runtime.mappingKey` remains only if benchmark evidence justifies it;
- generic styles and paint have clear ownership;
- all 71 product modules were reviewed against the same architecture;
- any exception is explicitly justified by lifecycle, async, measurement or measured performance;
- `tests/performance-update.test.cjs` is retained as a permanent benchmark;
- the Horseshoe/Path benchmark is restored under `tests/`;
- Plan-21 benchmark scenarios P21-A through P21-I are reproducible;
- baseline and final benchmark results are recorded;
- operation counts show why performance changed;
- full functional/browser acceptance passes;
- independent review finds no remaining generic presentation-gating architecture.
