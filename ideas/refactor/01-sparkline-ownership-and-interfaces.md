# 01 — Sparkline ownership and interfaces

## 1. Goal

Make the existing Sparkline layers expose values from the module that actually owns them, without yet moving the full history/time implementation.

This plan fixes ownership drift once so later history, state, geometry and lifecycle work can rely on stable boundaries.

## 2. Prerequisites

- Plan 00 and `TESTING.md` read.
- No other implementation plan required.

## 3. Current-code validation

Run Plan 00's validation gate. In particular verify:

- `CardEntities.updateSparklineEntities()` still probes Sparkline/Graph objects for metadata;
- effective bin information is still rediscovered or accessed through the wrong layer;
- implicit and explicit series still have distinct internal paths where identified by the review;
- GraphTool/Series/Graph responsibilities match the baseline sufficiently for the changes below.

Baseline files: `src/card-entities.js`, `src/sparkline-graph-tool.js`, `src/sparkline-series.js`, `src/sparkline-graph.js`.

## 4. Scope

- establish the permanent responsibility map;
- normalize implicit/explicit series into the same Series-level shape as early as practical;
- make Series the source of shared bin-plan information;
- make Graph the source of per-series processed statistics;
- expose a stable Sparkline result/metadata route for `CardEntities`;
- fix the reproduced duration/bin-duration/aggregate metadata source defect using the real owner.

## 5. Out of scope

- extracting/rebuilding full history/time request logic (Plan 02);
- loading/empty/error state redesign (Plan 03);
- data/geometry split (Plan 04);
- derived-entity propagation/equality and parent lifecycle (Plan 07);
- graph formula rewrites.

## 6. Required design

### GraphTool

Coordinates one Sparkline item and presentation. It may expose coherent current metadata/results but must not duplicate Graph formulas.

### Series

Owns normalized series list, shared plot/bin decisions and multi-series coordination.

### Graph

Owns one series' data processing/statistics and geometry. Do not add history/network/card proxies merely to satisfy old callers.

#### Graph preservation invariant

`SparklineGraph` is treated as the proven calculation core for this refactor. The purpose of this plan is to correct ownership and expose stable interfaces around that core, not to redesign graph mathematics.

```text
same prepared input + same graph mode
        -> same processed statistics
        -> same graph geometry/result
```

Only add the smallest interface/accessor needed to expose an already-owned result. Do not rewrite a Graph formula or alter calculation semantics unless a separate failing regression test reproduces a real defect first.

### Metadata map

Use one explicit mapping:

| derived value | stable source |
|---|---|
| min/avg/max/min_time/max_time | processed period statistics for selected series |
| duration | normalized/current period result exposed by Sparkline coordination |
| bin_duration | effective shared Series bin plan |
| aggregate_func | active normalized aggregation selection for binned historical data |

`CardEntities` represents these values; it does not derive them from arbitrary Graph members.

## 7. Implementation sequence

1. Add/reuse reproduction for incorrect derived metadata source.
2. Inventory current value owners and callers.
3. Normalize implicit/explicit series representation without changing YAML.
4. Establish one Series-level bin-plan result.
5. Establish one Graph-level period-statistics result using existing formulas.
6. Add the smallest GraphTool/Series result accessor needed by `CardEntities`.
7. Change `CardEntities` source lookup to that stable route.
8. Remove only duplicate/proxy ownership made obsolete by these changes.
9. Run permanent ownership/statistics tests.

Do not extract history here merely because its future owner is known.

## 8. Permanent tests

From `TESTING.md`:

- all eight derived metadata types at the source/interface level;
- implicit/explicit primary-series parity;
- multi-series shared bin duration;
- whole-period statistics unchanged;
- state_bands/real_time avoid incompatible numeric assumptions;
- permanent `SparklineGraph` characterization fixtures from `TESTING.md`;
- existing representative graph output unchanged for identical prepared input.

## 9. Definition of Done

- every metadata value used by `CardEntities` has one real owner;
- `CardEntities` no longer probes Graph for history/bin members it does not own;
- shared bin plan is a Series result, not recalculated by consumers;
- implicit and explicit series use the same internal ownership rules;
- no proxy methods were added to preserve a wrong dependency;
- characterization tests prove that representative Graph inputs produce the same statistics/geometry before and after this plan;
- no proven `SparklineGraph` formula or calculation semantic changed unless a separately reproduced defect required that change;
- existing YAML remains unchanged;
- full required test suite passes.

## 10. Guarantees for following plans

Following plans may assume:

- Series is the permanent owner of shared series/bin coordination;
- Graph is the permanent owner of per-series processing/statistics/geometry;
- derived metadata has a stable Sparkline-facing source;
- implicit and explicit series no longer require separate ownership semantics;
- Plan 02 may move history/time state without changing these interfaces again.

## 11. Source material

Replaces the ownership/interface portions of old Plan 03 and the metadata-source portions of old Plan 06.
