# Cross-plan review — dependency-aligned sequence

## 1. Review method

Checked every new plan for:

- prerequisite cycles;
- later-plan behaviour accidentally required early;
- ownership moved more than once;
- temporary compatibility code/tests;
- duplicated implementation responsibility;
- tests that would be thrown away by the next plan;
- mismatch between Definition of Done and guarantees consumed later.

## 2. Dependency graph

```text
01 ownership/interfaces
  -> 02 history/time/requests
      -> 03 data state
          -> 04 data/geometry
              -> 05 resource foundation
                  -> 06 async validity
                      -> 07 card lifecycle + derived flow
                          -> 08 change detection/rendering
                              -> 09 pointer lifecycle
                              -> 10 Horseshoe animation/cache
                              -> 12 theme-aware cache
                                  -> 13 cleanup
                                      -> 14 CI/release

11 ref()/merge is independent and may be inserted without changing this chain.
```

No circular prerequisite remains.

## 3. Cross-check findings resolved

### Old 03 -> 04 rework

Resolved: Plan 01 fixes stable ownership/interfaces but deliberately does not move History piecemeal. Plan 02 performs the coherent extraction/time model once.

### Old 04 requiring old 01 outcome

Resolved: Plan 02 only requires `SparklineHistory` itself to avoid parent-card lifecycle calls. Existing GraphTool propagation is allowed to remain until Plan 07, so no future lifecycle result is required prematurely.

### Old 07/06 circular readiness/publication

Resolved: Plan 03 owns state semantics and exposes them. Plan 07 later consumes them for publication; `CardEntities` does not create readiness rules.

### Old 02/05 circular invalidation capability

Resolved: Plan 04 first establishes real data/geometry/paint callable boundaries. Plan 08 then routes input events to them. Neither needs the other to become complete.

### Old 01/06 duplicate implementation

Resolved: one Plan 07 owns lifecycle + complete derived publication. No duplicate truth document remains.

### Palette stale completion split between old 01/11

Resolved: Plan 06 first makes palette completion current/stale safe. Plan 07 later changes only propagation from broad `setHass()` to direct paint flow.

### Resource overlap with pointer/Horseshoe plans

Resolved: Plan 05 creates permanent replacement/disconnect cleanup routing. Plans 09/10 only make their own internal handles/state correctly obey that route.

## 4. Test longevity review

Every plan's tests protect a lasting invariant:

- Plan 01 metadata ownership remains valid through the series.
- Plan 02 time/request tests remain unchanged after lifecycle refactor.
- Plan 03 state transitions remain unchanged after geometry/lifecycle changes.
- Plan 04 direct data/geometry boundary tests remain valid when Plan 08 routes events to them.
- Plan 05 replacement/cleanup forwarding tests remain valid when specialized resources are added.
- Plan 06 stale async tests remain valid after propagation changes.
- Plan 07 lifecycle/derived-route tests remain valid after Plan 08 optimizes scheduling.
- Plan 08 equality/call-boundary tests remain valid through specialized interaction/cache work.
- Plans 09–12 add domain-specific permanent regressions.

No plan intentionally introduces a test for a route that the next plan removes.

## 5. Current source validation at rewrite time

The reviewed source baseline is `731421a420e92cab7749ed9283fe832b9dc56247`. On 2026-09-12 current `master` was `a3e430123ecee6d3ba8b64e2a39039c550c36ddc`; the comparison contained documentation changes only. Therefore the source observations remain valid at this rewrite point.

This is not a waiver for future implementation. Every plan still begins with the mandatory current-code validation gate.

## 6. Final assessment

The sequence is monotonic: each completed plan reduces ambiguity or work and exposes a stable boundary consumed by the next plan. Later plans refine behaviour/performance through those boundaries instead of moving the same responsibility again.

The largest deliberate consolidation is previous Plan 06 into new Plan 07 because derived entity publication and card lifecycle propagation cannot be independently complete. The largest deliberate separation is previous Plan 03/04: ownership interfaces are fixed first, then History is moved exactly once.
