# 10 — Horseshoe animation and path cache

## 1. Goal

Preserve the generic path engine while ensuring active Horseshoe animation ends with its owner and transient animation progress does not create unbounded permanent browser-measurement cache entries.

## 2. Prerequisites

- Plan 05 cleanup path reaches Horseshoe/animator owner;
- Plan 08 animation frames are excluded from normal card/history/data flow.

## 3. Current-code validation

Reproduce/check `PathGeometry` point/tangent cache keys, `PathStateAnimator` per-frame sampling, Horseshoe disconnect/replacement and any DOM segment accumulation claim before changing render structure.

## 4. Scope

- animator stop on disconnect/replacement/target replacement;
- permanent cache only for stable reusable measurement candidates;
- transient per-frame progress measured without permanent cache growth;
- preserve path signature/stable measurement reuse;
- prove DOM accumulation before any DOM-structure change.

## 5. Out of scope

- path math/YAML changes;
- rounding animation progress as primary fix;
- generic LRU/cache framework;
- unrelated path generator deduplication.

## 6. Required cache rule

Stable positions/path signatures may be cached. Arbitrary frame-by-frame progress samples are transient and must not populate a permanent map indefinitely.

Preferred direction: transient sampling bypasses permanent point/tangent cache while stable consumers retain reuse.

## 7. Implementation sequence

1. Add cache-growth soak reproduction and animator disconnect/replacement tests.
2. Classify current cache callers into stable vs transient.
3. Make transient animation sampling avoid permanent map insertion with the smallest local API change.
4. Preserve stable measurement reuse/path signature cache.
5. Ensure Horseshoe cleanup invokes animator stop through Plan 05's path.
6. Verify target/config replacement cannot leave old animation active.
7. Change DOM segment structure only if a focused test proves accumulation.
8. Run existing path-engine tests unchanged plus WebKit SVG/animation cases.

## 8. Permanent tests

- active animation -> disconnect/replacement -> RAF cancelled;
- many frames -> permanent point/tangent cache bounded for fixture;
- stable sample requests still reuse cached measurement;
- existing path numeric/visual tests unchanged.

## 9. Definition of Done

- animation does not create one permanent cache entry per frame;
- stable positions still reuse browser measurement;
- active animator stops on every owner ending;
- no path mathematics/config architecture rewritten;
- DOM changes made only for reproduced bug.

## 10. Guarantees for following plans

Path animation/cache lifetime is closed. Plan 13 may only perform proven duplication/comment cleanup around it.

## 11. Source material

Replaces old Plan 09, with generic replacement cleanup removed because Plan 05 already guarantees it.
