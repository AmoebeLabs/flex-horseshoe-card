# 18 — Sparkline consumes trusted configuration

## 1. Goal

Remove repeated Sparkline configuration validation, coercion and defaults from `SparklineGraphTool`, `SparklineSeries`, `SparklineHistory` and `SparklineGraph`.

Preserve all established history, data-state, data/geometry, pointer and graph-math behaviour.

This plan targets one of the main remaining readability problems: configuration policing is mixed into a ~300-line `SparklineGraphTool.updateRuntimeConfig()` and duplicated across layers.

## 2. Prerequisites

- Plans 15–17 complete.
- Gatekeeper behaviour is already proven for static and JavaScript-backed config.
- Existing Sparkline characterization/integration tests from Plans 01–14 remain green before editing.

## 3. Functional contract after this plan

```text
Sparkline sourceConfig
  -> evaluate JS
  -> complete defaults
  -> normalize parent + series config
  -> convert internal numeric fields
  -> validate all public Sparkline schema/relationships
  -> publish accepted this.config
       ↓
SparklineSeries: coordinate accepted series
SparklineHistory: request/process external history using accepted periods
SparklineGraph: calculate from accepted numeric/config inputs
SparklineGraphTool: coordinate/present/own pointer and DOM behaviour
```

No lower layer re-validates public Sparkline configuration.

### Effective-series acceptance is mandatory

Sparkline series overrides are not validatable in isolation because the runtime series is the result of parent + series inheritance.

The acceptance route therefore treats the parent and all effective series as one atomic candidate set:

```text
normalize + validate parent Sparkline candidate
    ↓
materialize every effective series candidate
  - implicit single series becomes one explicit effective item
  - explicit series = parent + series override + paint precedence rules
    ↓
normalize + validate every final effective series candidate
    ↓
ALL parent + series candidates accepted
    ↓
atomically publish:
  - parent as this.config
  - accepted effective series collection to SparklineSeries
```

The normalized parent is **not published as `this.config` yet** while effective series are still being materialized or validated.

If the parent or any effective series fails acceptance, neither `this.config` nor the active series collection is replaced. The previously accepted runtime configuration remains intact.

Validation must occur **after** the final merge/precedence rules, not only against the raw parent or raw series override.

`SparklineSeries` may retain runtime rows/Graph/request state for an accepted series id, but it must not be the owner that decides whether the merged public config is valid.

## 4. Current-code anchors

### 4.1 SparklineGraphTool constructor

`src/sparkline-graph-tool.js:172-819`

The constructor currently:

- defines a large default config;
- normalizes style/public forms;
- validates static day/night config around baseline `631-646`;
- validates static radial config around `658-667`;
- prepares further graph settings.

Static validation is conditional when JavaScript is present because dynamic values are checked later.

That split is exactly what the common gatekeeper must replace.

### 4.2 Duplicate runtime validation

`SparklineGraphTool.updateRuntimeConfig(): 1136-1435`

Important current ranges:

- `1144-1159` — radial variant/arc/rotate/size validation;
- `1163-1182` — day/night styles/mode/position/size/offset/period checks;
- `1189` — calendar day duration correction/default behaviour;
- `1197-1208` — dynamic boolean visibility normalization;
- `1210-1230` — bar/equalizer config normalization and validation;
- `1240-1249` — y-axis numeric bounds validation;
- `1255-1266` — real-time bar/equalizer range requirements;
- `1271-1272` — history duration coercion/availability;
- remainder — actual runtime coordination/geometry/labels/history preservation.

The plan must remove only the config-category work, not the real coordination below it.

### 4.3 SparklineSeries validates public config

`src/sparkline-series.js:updateConfig(): 34-171`

Current checks include:

- non-empty/unique series ids;
- integer `entity_index`;
- old `y_axis` field shape;
- period override schema and numeric offset;
- `y_axis_id`;
- chart type;
- radial variant/restrictions;
- mixed radial/cartesian relationships;
- item-style enums.

Around baseline `109+`, `SparklineSeries` also creates `effectiveConfig = Merge.mergeDeep({}, config, seriesConfig)` and then applies series-wide paint precedence before validating several effective item-style fields. That merge order is semantically important.

These validation rules belong to configuration acceptance, but acceptance must operate on the **final effective config produced by the same inheritance/paint precedence**, not on the raw override.

Series must still retain items by id, rows, Graph instances, request/data state and shared layout/bin state.

### 4.4 SparklineHistory reconverts accepted period config

- `src/sparkline-history.js:getSeriesRange(): 166-225`
  - `Number(duration.hour)`
  - `Number(plot offset)`
  - `Number(source offset)`
- another period-hours conversion near baseline `1129`
- `buildSeriesRows(): 962-1096`
  - `Number.isFinite(Number(row.state))` around `1032`

The first group is config coercion and should disappear once accepted config is numeric.

The `row.state` check is external HA history validation and **must remain**.

### 4.5 SparklineGraph reconverts config

Examples:

- `src/sparkline-graph.js:836-837` — `Number(y_axis.lower_bound/upper_bound)`
- radial geometry around baseline `1682-1683` — `Number(arc_degrees/rotate)`
- other `Number(...)` calls must be classified individually because many operate on processed data/state map values rather than public config.

### 4.6 Presentation conversions

Examples in GraphTool:

- legend row/line-height conversion around `886-888`, `5736`, `5833`;
- `resolveAxisFontSizePixels(): 3314-3344`;
- pointer DOM `dataset` conversion around `2250`, `2610`, `2814`;
- entity numeric state around `1733-1736`.

Do **not** classify these by syntax alone.

`resolveAxisFontSizePixels()` is a good example of consumer-owned semantic conversion: an accepted CSS font-size string still has to become pixels for geometry. It may remain.

DOM dataset and HA entity conversion are runtime input and may remain.

## 5. Required design

### 5.1 One Sparkline acceptance route

Static config and dynamic JS results go through the same Sparkline normalization/validation.

Do not retain "validate now unless JavaScript, otherwise validate later in GraphTool".

### 5.2 Series receives final accepted effective series

The configuration owner must perform the same effective-series materialization that currently happens in `SparklineSeries.updateConfig()`:

1. create the implicit default series when no explicit `series` block exists;
2. merge parent config + series override;
3. apply series-wide paint precedence to line/area/minmax layers;
4. remove parent-only fields (`id`, `series`) from the effective item where required;
5. normalize internal types/defaults on the final result;
6. validate the final effective result and cross-series relationships.

Only then is the collection published to `SparklineSeries`.

The gatekeeper guarantees:

- ids exist and are unique;
- entity indexes are valid internal integers;
- period overrides have the accepted shape and numeric offsets;
- axes/chart families/item styles are valid after inheritance;
- parent/series radial compatibility is valid;
- implicit and explicit single-series configurations have the same internal contract.

`SparklineSeries.updateConfig()` keeps only work that coordinates/retains accepted series runtime state. If a small pure merge/materialization helper is shared between the config owner and Series construction, it must not leave validation ownership in Series.

### 5.3 History receives numeric period contract

History must not wonder whether duration/offset config is numeric.

It still owns:

- absolute source/plot ranges;
- local calendar/DST semantics;
- request identity;
- stale result protection;
- HA row validation;
- current sample inclusion;
- timers/retry/reconnect.

### 5.4 Graph receives accepted calculation config

Graph consumes numeric axis bounds and radial geometry config directly.

It retains algorithmic guards where valid accepted input can produce a degenerate geometry case.

### 5.5 GraphTool becomes orchestration/presentation

`updateRuntimeConfig()` should become materially shorter and read as ordered runtime work.

It may still:

- react to `configChanged`;
- retain old geometry while larger history loads;
- create/update Series/Graph inputs;
- resolve locale-dependent labels;
- calculate presentation geometry;
- coordinate day/night owner input;
- update caches/signatures.

It must not re-prove config schema.

### 5.6 No code-move illusion

A dedicated Sparkline config helper/module is allowed only if it replaces duplicated work and makes the boundary clearer. Total product LOC must decrease.

Do not merely move the constructor/runtime validation blocks intact into a new 300-line file.

## 6. Out of scope

- Graph formulas/statistics;
- history time formulas;
- bin algorithms;
- pointer behaviour;
- day/night visible semantics;
- chart renderer redesign;
- new chart types;
- derived entity semantics.

## 7. Implementation sequence

1. Capture current accepted config behaviour for representative chart families.
2. Define the normalized internal types for:
   - period;
   - axis bounds;
   - radial config;
   - day/night config;
   - bar/equalizer config;
   - series overrides.
3. Build one acceptance path for static and dynamic parent config.
4. Materialize the final effective series collection after parent/series merge, including the implicit single series, and validate those final results.
5. Add equivalence tests for implicit single series and an explicit single series with the same effective config.
6. Remove duplicated constructor/runtime validation.
7. Move Series public-schema/cross-series checks to the final effective-series acceptance step.
8. Remove config `Number(...)` coercions from History.
9. Remove config coercions from Graph.
10. Audit GraphTool's remaining `Number`, `isFinite`, defaults and throws.
11. Classify every remaining occurrence.
12. Simplify `updateRuntimeConfig()` after config work is gone; do not change formulas.
13. Verify implicit single-series and explicit series use the same accepted route.
14. Measure LOC and method complexity/readability.
15. Run complete Sparkline Node/integration suites and affected browser suites.

## 8. Checks that must remain

Explicit examples:

- `SparklineHistory.buildSeriesRows()` rejecting non-numeric HA history states;
- stale request/result identity;
- period coverage/request-state checks;
- pointer `dataset` numeric parsing;
- HA entity numeric state conversion/availability;
- Graph degenerate geometry guard such as finite `xRatio` if still required by valid one-point input;
- CSS unit parsing for axis/legend geometry when the accepted type is intentionally CSS-like.

## 9. Permanent tests

### Config acceptance

Test static and JS-backed versions of:

- radial arc/rotation/size;
- day/night mode/position/size/offset;
- y-axis bounds;
- real-time bar/equalizer ranges;
- series ids/entity indexes/offsets/axis ids/chart types/item styles;
- parent + explicit-series inheritance and series-wide paint precedence;
- implicit single series vs equivalent explicit single series;
- validation that only becomes decidable after the final effective merge;
- legacy boolean axis/grid/tickmark/label visibility normalization.

### Whole chain

Keep all existing tests for:

- rolling/calendar/DST;
- offsets;
- implicit/explicit series;
- multi-series shared scale/bin plan;
- line/area/minmax;
- bar/dots/radial/state bands/real time;
- loading/empty/error/recovery;
- derived entities;
- pointer lifecycle;
- theme-only reuse.

Add a focused assertion that downstream Series/History/Graph no longer reject a config that the gatekeeper has already accepted.

Do not write tests that assert private helper names.

## 10. Source-size/readability measurement

Working estimate: **150–300 product code lines removed**.

Record before/after:

- `sparkline-graph-tool.js`;
- `sparkline-series.js`;
- `sparkline-history.js`;
- `sparkline-graph.js`;
- any config helper added;
- total product source.

Also record the line span of `SparklineGraphTool.updateRuntimeConfig()` before/after and list its remaining responsibilities in order.

## 11. Definition of Done

- static/dynamic Sparkline config has one acceptance route;
- Series no longer validates public configuration;
- final effective series configs are accepted after inheritance/precedence, including the implicit single-series path;
- History no longer coerces accepted period config;
- Graph no longer coerces accepted axis/radial config;
- GraphTool no longer duplicates constructor config validation;
- remaining guards are categorized and justified;
- Graph/statistical/history results are unchanged;
- `updateRuntimeConfig()` is materially clearer;
- total product source decreases;
- tests/build/browser checks pass.

## 12. Guarantee for Plan 19

Sparkline, the largest complex consumer family, now follows the same trusted-config contract as simple tools and Controls. Horseshoe can be migrated without weakening the rule.
