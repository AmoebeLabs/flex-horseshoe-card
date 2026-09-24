# 00 — FHS master refactor plan

## 1. Purpose

Define one fixed direction for the refactor and make the plan sequence cumulative: every completed plan must leave a stable implementation boundary that later plans can rely on without moving the same responsibility again.

This work is:

- a repair and simplification of the existing architecture;
- compatible with existing YAML;
- conservative around proven Sparkline/path mathematics and Safari-sensitive event handling.

It is not:

- a rewrite;
- a new configuration language;
- a generic event bus/invalidation framework;
- a reason to split readable linear functions into helper chains.

## 2. Baseline and current-code rule

Reviewed source baseline:

- version: `5.4.7-dev.31`;
- source commit: `731421a420e92cab7749ed9283fe832b9dc56247`.

At the plan rewrite on 2026-09-12, `master` was `a3e430123ecee6d3ba8b64e2a39039c550c36ddc`. The only commit after the source baseline changed documentation, not `src`, so the reviewed source observations were still current.

That does **not** make source line numbers permanent instructions.

### Mandatory current-code validation gate

Before implementing any plan:

1. resolve the current working branch/commit;
2. open every named source owner/function in that plan;
3. search the working tree for the relevant calls, flags and resource creation sites;
4. verify that each baseline defect/route still exists;
5. verify that prerequisites from earlier plans are present exactly as guaranteed;
6. identify current tests that already protect the route;
7. update only implementation details/locators when code moved without changing the plan's architectural guarantee;
8. stop and revise the plan first if the current code invalidates a prerequisite, ownership decision or Definition of Done.

Architectural goals, prerequisites, Definition of Done and guarantees are authoritative. Baseline line numbers and nearby implementation shapes are locators only.

## 3. Fixed runtime direction

Normal external HA update:

```text
Home Assistant update
        -> main.setHass(hass)               external HA entry only
        -> publish current HA context
        -> publish/prepare current source entities/config
        -> update affected Sparkline/tool inputs
        -> Sparkline may produce fhs_sparkline.* outputs
        -> publish only changed derived outputs
        -> update consumers of changed source/derived values
        -> update animations/presentation state
        -> make one card-wide render decision
        -> end
```

Async Sparkline result:

```text
history/timer result
        -> prove result belongs to live request/tool/config
        -> process affected Sparkline result
        -> update changed fhs_sparkline.* outputs
        -> update affected consumers/animations
        -> render only when output requires it
        -> end
```

No internal route may restart the external HA entry merely to propagate local work.

## 4. Stable responsibility map

### `main.js`

Owns card-level ordering and final render scheduling. It does not calculate Sparkline bins, history ranges or graph geometry.

### `CardTools`

Owns tool instances and forwards lifecycle/update calls. It does not become a second `main.js` or learn graph/history semantics.

### `CardEntities`

Owns entity-shaped source/local representations and publication/equality of `fhs_sparkline.*`. It does not calculate Sparkline statistics.

### `SparklineGraphTool`

Owns one configured Sparkline tool, coordinates History/Series, and owns SVG/presentation/pointer behaviour.

### `SparklineHistory`

After Plan 02, owns source ranges, HA history requests, current-sample inclusion, request identity, refresh/retry timing and its own cleanup.

### `SparklineSeries`

Owns normalized series collection, shared plot/bin plan, multi-series coordination, shared scale/margins/drawing area.

### `SparklineGraph`

Owns per-series data processing/statistics and geometry from prepared inputs. It knows no HA network/card lifecycle/timers/global listeners.

### `CardTheme` / `Colors`

`CardTheme` owns current theme/mode and paint invalidation. `Colors` owns color resolution/conversion/shared cache. Neither owns history/data recalculation.

### Path owners

`PathGeometry` owns measurement/reuse. `PathStateAnimator` owns one active path-state animation. Horseshoe forwards cleanup; card lifecycle does not manage animation frames directly.

### Layer and interface rule

Each layer receives prepared input, performs the work it owns, and exposes a small functional result to its consumer.

A lower layer must not reach into a higher layer to obtain configuration, lifecycle state or missing context. Configuration compatibility, defaults and normalization end at the appropriate adapter/coordination boundary; lower processing layers operate on normalized runtime input.

A consumer must not reconstruct, rediscover or recalculate information already owned by another layer. It obtains that information through the owner's stable interface.

Internal algorithmic complexity is acceptable. Cross-layer behaviour must remain simple, directional and predictable.

## 5. Fundamental distinctions

Keep these distinctions explicit:

```text
source changed
!= effective tool state changed
!= visible output changed
```

```text
history request state
!= processed data state
!= graph geometry
!= paint/presentation
```

```text
fhs_input_*          local card inputs
!=
fhs_sparkline.*     local outputs derived from Sparkline
```

## 6. No temporary architecture rule

A plan may leave unrelated existing debt for a later plan, but it must not introduce a bridge that the next plan is expected to replace.

Do not add:

- duplicate ownership “for compatibility”;
- shadow entity/result collections;
- recursive-update prevention flags;
- temporary event buses;
- tests that assert a deliberately temporary implementation shape.

If a later plan needs a new capability, the earlier plan should expose a stable functional boundary once, then the later plan should consume it.

## 7. Permanent-test rule

`TESTING.md` is the shared strategy.

Tests added by a plan must normally remain after later plans. A later plan may change a test only when:

- the test encoded an implementation detail rather than behaviour; or
- an approved bug fix changes the visible result.

Do not write large groups of tests for an intermediate route that is intentionally removed in the next plan.

## 8. Plan structure — mandatory

Every implementation plan contains:

1. Goal
2. Prerequisites
3. Current-code validation
4. Scope
5. Out of scope
6. Required design/behaviour
7. Implementation sequence
8. Permanent tests
9. Definition of Done
10. Guarantees for following plans

A plan is not complete merely because tests pass. Its Definition of Done must also prove that the responsibility boundary is clean and no temporary compatibility route remains.

## 9. Naming and function-shape rules

Use existing FHS vocabulary and concrete functional names. Do not manufacture source identifiers from plan prose such as:

`Contract`, `Feature`, `Resolved`, `Committed`, `Pipeline`, `Stage`, `OwnershipState`.

Prefer long, readable, linear functions when one coherent operation is naturally sequential. Extract code when it has its own ownership/lifetime or real repeated operation, not to satisfy a complexity number.

Do not sprinkle `Number(...)`, `Number.isFinite(...)`, `??`, `||` or similar defensive fallbacks through proven algorithms without a demonstrated local input problem.

## 10. Proven code to preserve

Do not rewrite without a reproduced defect:

- normalized path generators and transforms;
- measured path geometry mathematics;
- Sparkline graph formulas that tests do not show to be wrong;
- Safari-specific interaction routing;
- existing YAML schema;
- existing field-specific merge semantics.

### SparklineGraph preservation invariant

Treat `SparklineGraph` as a proven calculation core unless a separately reproduced defect demonstrates otherwise. Refactor its inputs, ownership boundaries, call frequency and result interfaces before considering formula changes.

For the same prepared input and calculation mode, the refactor must preserve the same observable Graph result within the precision already used by the existing tests:

```text
same prepared input
        -> same processed statistics
        -> same graph geometry/result
```

A new accessor or result interface may expose an existing Graph result. It must not silently redefine that result. If a formula/semantic change is genuinely required, reproduce and document that defect separately instead of hiding it inside an architectural refactor.

## 11. Resource and async rules

Whoever creates a resource owns its handle and cleanup.

Both endings matter:

```text
DOM disconnect
configuration/tool replacement while card remains connected
```

Every async completion must prove it still belongs to the live operation before mutating state. Apply this locally in each owner; do not create a generic Promise manager.

## 12. Implementation sequence

The core dependency chain is:

```text
01 ownership/interfaces
 -> 02 history/time/request lifecycle
 -> 03 explicit data state
 -> 04 data/geometry separation
 -> 05 replacement/disconnect cleanup foundation
 -> 06 async result validity/recovery
 -> 07 card lifecycle + derived/local flow
 -> 08 change detection/render scheduling
 -> 09 pointer lifecycle
 -> 10 Horseshoe animation/path cache
 -> 12 theme-aware color cache
 -> 13 final cleanup
 -> 14 CI/release hardening
```

Plan 11 (`ref()`/merge) is independent and may be inserted earlier. It must not be mixed opportunistically into Sparkline/lifecycle changes.

## 13. Branch/issue rule

A plan may contain subissues/commits for reviewability, but one plan's feature branch must finish at its Definition of Done before the next dependent plan begins.

The next plan branches from the completed previous-plan state. Do not start dependent implementation against an unfinished sibling branch.

## 14. Overall Definition of Done

The series is complete only when:

- `setHass()` is external HA input only;
- Sparkline ownership, history/time, data state and graph processing have one clear home each;
- source/plot offsets and DST/current-sample behaviour are correct;
- valid empty/error/stale results are explicit;
- processed data is not repeated for geometry/paint-only changes;
- `fhs_sparkline.*` reaches consumers without HA re-entry;
- replacement/disconnect stops resources and late results are inert;
- pointer/Horseshoe lifetimes are bounded and Safari-safe;
- `ref()` preserves value types without global merge drift;
- theme cache is safe across themes/modes;
- obsolete workaround state has been removed;
- existing YAML remains compatible;
- permanent tests prove the cross-module routes.

## 15. Implementation complexity and model choice

This is a risk-based recommendation, not a requirement or a claim that one model guarantees correctness. `GPT-6 Luna (max)` is suitable for a bounded change with an explicit interface and permanent tests. Prefer `GPT-6 Sol (xhigh)` when the work requires architectural decisions, timing/race analysis, browser-specific behaviour, or verification across several owners. A higher reasoning-effort setting does not remove the need for those checks. Reassess the model if current-code validation reveals wider coupling than the plan describes. See the [OpenAI model selection guidance](https://developers.openai.com/api/docs/guides/model-selection/).

| Plan | Complexity | Recommended implementation/review |
| --- | --- | --- |
| 01 — Sparkline ownership and interfaces | High | Sol (xhigh) for the ownership boundary; Luna (max) for isolated tests after the interface is fixed. |
| 02 — history, time and requests | High | Sol (xhigh) for request identity, offsets and DST; Luna (max) for a tightly specified test or local change. |
| 03 — explicit data state | Medium-high | Sol (xhigh) for state transitions and integration; Luna (max) for a single transition with clear expected behaviour. |
| 04 — data and geometry separation | High | Sol (xhigh) for Graph/Series/Tool coordination and final integration; Luna (max) for bounded changes with existing result invariants. |
| 05 — resource lifecycle foundation | High | Sol (xhigh) for replacement/disconnect ownership; Luna (max) for one resource owner and its cleanup tests. |
| 06 — async results and recovery | High | Sol (xhigh) for stale-result and retry races; Luna (max) for an isolated completion path once validity rules are fixed. |
| 07 — card lifecycle and derived entities | Very high | Sol (xhigh) for the whole plan; do not assign the external-update/local-output flow to Luna as one task. |
| 08 — change detection and rendering | Very high | Sol (xhigh) for event-level data/geometry/paint decisions; Luna (max) only for precisely bounded subissues. |
| 09 — pointer interaction lifecycle | Medium-high | Sol (xhigh) for DOM/Safari integration; Luna (max) for focused pointer tests or one owner. |
| 10 — Horseshoe animation and path cache | Medium-high | Sol (xhigh) for animation/cache lifetime and Safari checks; Luna (max) for a local cache or cleanup subissue. |
| 11 — configuration `ref()` and merge | Medium | Luna (max) for the scoped implementation and type-preservation test matrix; Sol (xhigh) for final merge-semantics review. |
| 12 — theme-aware color cache | Medium-high | Luna (max) for a well-specified cache-key change; Sol (xhigh) for cross-card/theme invalidation and review. |
| 13 — final simplification and cleanup | High breadth | Sol (xhigh) for deciding what is obsolete and verifying behaviour; Luna (max) for small, independently tested removals. |
| 14 — CI and dev-release safety | Medium-high | Luna (max) for isolated test/workflow edits; Sol (xhigh) for release concurrency, artifact lineage and final review. |

Use the same branch, Definition of Done and permanent-test rules regardless of model. Model choice is an aid to execution, not a substitute for visual validation or the required integration tests.
