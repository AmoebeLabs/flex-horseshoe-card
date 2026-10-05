# 20 — Whole-chain simplification and acceptance

## 1. Goal

Perform the final whole-product audit after every tool family uses trusted accepted configuration.

Remove remaining duplicate config policing, repeated trivial methods and obsolete simplification leftovers. Verify that the result is smaller and easier to read without changing user-visible semantics.

This is not an invitation to redesign working calculations.

## 2. Prerequisites

Plans 15–19 complete on one cumulative branch chain.

No temporary family exception to the trusted-config contract remains.

## 3. Functional contract after this plan

Across product-owned `src/`:

```text
configuration concern
    -> config acceptance owner

external HA/network/DOM concern
    -> runtime owner

async/lifecycle concern
    -> resource owner

algorithmic concern
    -> calculation owner
```

A downstream consumer cannot contain an "invalid configuration" guard simply because the same field used to be uncertain before Plans 16–19.

## 4. Whole-source guard audit

Search product source for at least:

```text
Number(
Number.isFinite(
Number.isInteger(
parseFloat(
parseInt(
isNaN(
?? 
||
throw Error
throw new Error
```

Do not remove by pattern.

For every occurrence in affected runtime code, record one category:

- C — configuration (not allowed downstream);
- R — external runtime input;
- A — async/lifecycle;
- M — mathematical/algorithmic;
- S — semantic conversion of an accepted type.

All remaining C occurrences below the gatekeeper must be removed or moved to acceptance.

### Examples expected to remain

- Home Assistant history state numeric validation;
- HA current entity numeric availability;
- DOM `dataset` conversion;
- CSS unit parsing needed for geometry;
- stale async result checks;
- one-point/empty graph math protection where proven necessary.

## 5. Duplicate-method audit

Repeat the Plan-15 inventory over all current product source.

Pay particular attention to:

- `updateRuntimeConfig`;
- `calculateSvgDimensions`;
- `hasPresentationChanged`;
- `updated`;
- `setState`;
- `setConfig`;
- child lifecycle forwarding;
- trivial group/layout adapters.

Do not centralize methods whose name is the same but semantics differ.

## 6. SparklineGraphTool readability audit

After Plan 18, review the remaining ~large GraphTool by responsibility rather than size.

Current baseline before the series is ~6,044 physical lines.

Candidate domains to inspect:

- pointer/tooltip ownership;
- legend presentation;
- chart-family render methods;
- DOM measurement;
- runtime graph coordination;
- paint helpers.

Extraction is allowed only when it:

- creates a real owner/lifetime boundary; or
- eliminates duplicate calculations/code; or
- makes the main coordination flow materially clearer with no source-size penalty that merely moves code.

Do not split readable linear rendering into dozens of wrappers.

## 7. External runtime entity contract — first-review follow-up

The broader review found a correctness issue that is **not** config validation but must be explicitly classified during the final whole-chain pass.

Current baseline:

- `src/main.js:updateSourceEntities()` around `208-215` returns early when a configured HA entity is missing and leaves the previous `this.entities[index]` object intact.
- `src/main.js:updateEntityPresentation()` similarly skips a missing resolved entity.
- `src/base-tool.js:setEntities(): 164-178` only calls `setState` when entity/config both exist, leaving the tool's previous state.
- `src/sparkline-graph-tool.js:setEntities(): 1444-1524` binds series entities and later dereferences them.
- `src/card-entities.js:updateSparklineEntities(): 132+` expects a source entity for derived outputs.

This is external runtime data, so the solution must **not** be another config guard.

Plan 20 must **resolve this correctness defect before the plan can be declared complete**.

The implementation may be delivered as a separate subissue/PR for review isolation, but it must be merged into the Plan-20 integration branch before Definition of Done. Merely registering/following up the defect is not sufficient for a completed simplification series.

Required functional result:

- a configured source that is absent on first load has one explicit current missing/unavailable representation;
- present -> missing clears/replaces the previously published current entity instead of retaining stale state;
- missing -> returned resumes normal publication;
- ordinary tools, Sparkline sources and derived entities consume that one central runtime contract;
- day/night handles missing `sun.sun` through the same explicit runtime-data principle;
- consumers do not each grow optional-chaining/guard variants to compensate.

Do not hide stale entity behaviour behind defensive optional chaining throughout consumers.

The preferred ownership is one central publication rule: consumers receive a current entity state or one explicit missing/unavailable representation, rather than each tool inventing its own handling.

## 8. Other first-review findings

Do not silently fold the following unrelated items into this plan:

- external SVG script execution;
- structural CardTemplates variable substitution;
- persisted/global FHS input state revalidation;
- SVG URL query/hash/case detection;
- possible SVG IRI id collisions;
- PathGeometry cache bound;
- package/repository hygiene.

See `REVIEW-FINDINGS.md`.

If one becomes necessary to complete the simplification safely, stop and make the dependency explicit.

## 9. Implementation sequence

1. Recalculate source metrics.
2. Run whole-source guard classification.
3. Remove/move every remaining configuration-category downstream guard.
4. Repeat duplicate-method/body inventory.
5. Remove only confirmed duplicate behaviour.
6. Review GraphTool's post-Plan-18 responsibility map.
7. Simplify only where a real boundary or deletion is demonstrated.
8. Implement the central missing-entity runtime contract (a separate subissue/PR is allowed, but it is mandatory before Plan-20 completion).
9. Verify there is no new parallel config state.
10. Verify `sourceConfig` is re-evaluation source and `this.config` is accepted config across tool families.
11. Run whole-chain producer/result/consumer review.
12. Run full Node/lint/build/browser matrix.
13. Record final LOC and compare to Plan-15 baseline.

## 10. Permanent tests

In addition to existing suites, add focused architecture-behaviour tests that prove:

- invalid config fails at acceptance, not rendering/Graph/History;
- equivalent static/JS config produces equivalent accepted state;
- repeated render/paint updates do not rerun config validation;
- missing external HA entity does not leave stale visible/derived state;
- consumer runtime checks still handle HA `unavailable`, invalid numeric history rows and stale async completions correctly.

Do not add tests that assert the absence/presence of a private helper by name.

## 11. Acceptance commands

Run:

```text
npm test
npm run lint
npm run rollup
npm run test:browser:all
```

Use the existing timezone policy from the previous refactor suite.

Perform representative manual/visual validation of:

- ordinary text/shape tools;
- Controls;
- Sparkline cartesian/radial/state bands;
- derived entities;
- Horseshoe path variants/gradients/labels/ticks/markers;
- theme switch;
- live config replacement.

## 12. Source-size/readability measurement

Working estimate for this final pass: **80–200 additional product code lines removed**.

Overall working estimate for Plans 15–20: **approximately 500–1,000 net product code lines removed**.

Do not treat the estimate as a quota.

Final report must include:

| Metric | Plan 15 baseline | Final |
|---|---:|---:|
| Product code LOC | measured | measured |
| Product physical source lines | measured | measured |
| SparklineGraphTool physical lines | measured | measured |
| HorseshoeGauge physical lines | measured | measured |
| BaseTool physical lines | measured | measured |
| Number of config-category downstream guards | measured | **0** |
| Duplicate methods removed | measured | measured |

Also describe readability in functional terms:

- what `BaseTool.updateRuntimeConfig()` now does;
- what SparklineGraphTool runtime config does;
- what HorseshoeGauge runtime config does;
- what Series/History/Graph no longer do;
- where external runtime data is validated.

## 13. Definition of Done

- no downstream configuration-category guards remain;
- remaining guards are classified and owned correctly;
- all major tool families use the same sourceConfig → gatekeeper → `this.config` model;
- no temporary family exception remains;
- confirmed duplicate tool methods/routes are removed;
- GraphTool/Horseshoe main flows are easier to read, not merely split;
- missing-entity runtime behaviour is fixed and covered by first-missing, present -> missing and missing -> returned tests;
- total product code is lower than Plan-15 baseline;
- full test/build/browser acceptance passes;
- public YAML and established numerical/visual behaviour are preserved.
