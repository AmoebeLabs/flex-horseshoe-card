# 04 — Sparkline data processing and geometry

## 1. Goal

Make Sparkline capable of reusing processed data when only scale/layout/geometry/paint changes, while preserving proven graph algorithms.

Permanent functional split:

```text
prepared source data -> processed graph data/statistics
processed graph data + final scale/drawing inputs -> geometry
geometry + theme/palette/style -> paint/presentation
```

## 2. Prerequisites

Plans 01–03 complete. Ownership, History and explicit data state are fixed and must not be revisited here.

## 3. Current-code validation

Verify repeated `SparklineGraph.update()`/`updateCartesianGraphs()` passes, shared-scale/margin calculation, min/max envelope work and current radial/state-band routes. Confirm which blocks are data-only, geometry-only, paint-only or mixed.

## 4. Scope

- expose/reuse one processed-data result per affected series;
- keep whole-period statistics mathematically unchanged;
- fix first-bin regression if still reproduced;
- derive shared Y range from processed results;
- determine final margins/drawing area once;
- calculate geometry from final scale without reaggregation;
- reuse bin/minmax results where semantics are identical;
- preserve separate state_bands/real_time/radial requirements.

## 5. Out of scope

- global event invalidation/render scheduling (Plan 08);
- graph formula redesign;
- radial duplicate cleanup unless necessary for the split (otherwise Plan 13).

## 6. Required behaviour

Processed data must be replaced when real data inputs change: source/history, bin/aggregation plan, missing-data semantics or data-mode config.

It must be reusable when only drawing rectangle, margins, scale-to-pixel geometry or paint changes.

Series coordinates shared scale/layout; Graph owns per-series processing + geometry; GraphTool presents.

### Graph preservation invariant

This plan may separate existing Graph work into reusable data and geometry boundaries, but it must not change the meaning of the calculations themselves. The split is successful when the same prepared data/config still produces the same statistics and geometry while unnecessary repeated work disappears.

```text
same prepared input + same final scale/layout
        -> same processed statistics
        -> same geometry/result
```

Moving an existing calculation to the correct boundary is allowed. Replacing or "improving" its formula is not part of this plan unless a separately reproduced defect requires it.

## 7. Implementation sequence

1. Add direct call-boundary tests around current repeated updates.
2. Lock first-bin and whole-period statistic behaviour.
3. Identify data-only and geometry-only blocks without rewriting formulas.
4. expose/store the existing processed result in a concrete FHS-shaped structure;
5. process all affected series data before deriving shared Y scale;
6. determine final margins/drawing area;
7. calculate geometry once from final inputs;
8. update min/max envelope to reuse the existing bin result when identical;
9. verify radial/state_bands/real_time independently;
10. remove only repeated full Graph calls made unnecessary by the stable split.

## 8. Permanent tests

From `TESTING.md`:

- line/area/bar/dots representative cases;
- minmax envelope;
- multi-series shared/fixed/automatic Y ranges;
- geometry resize with same data -> zero history/reaggregation;
- paint-only direct call -> zero data/geometry rebuild where measurement is not required;
- first bin zero/negative/multiple values;
- state_bands, radial, real_time;
- permanent `SparklineGraph` characterization fixtures remain unchanged for identical prepared input.

## 9. Definition of Done

- historical/raw data processes once per required data update;
- final shared scale/margins use processed results;
- geometry can recalculate without history/bin/statistics work;
- paint can update without data work and without normal geometry work;
- whole-period statistics retain existing meaning;
- multi-series shared axes no longer require repeated full data processing;
- representative characterization fixtures prove unchanged Graph statistics/geometry for unchanged prepared inputs;
- no proven `SparklineGraph` formula or calculation semantic changed unless a separately reproduced defect required that change;
- Graph remains algorithmically close to the proven implementation.

## 10. Guarantees for following plans

Following plans may assume Sparkline has stable callable boundaries for:

- data processing;
- geometry/layout;
- paint/presentation.

Plan 08 can route events to these boundaries without introducing a second invalidation architecture.

## 11. Source material

Replaces old Plan 05. Unlike the old ordering, this plan completes the data/geometry capability before global change-detection rules depend on it.
