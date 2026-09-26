# FHS refactor plans — dependency-aligned sequence

This directory replaces the previous subject-oriented plan ordering with an implementation sequence in which every completed plan leaves a stable improvement for the next plan.

The public YAML surface remains unchanged. The work is a repair and simplification of the existing FHS architecture, not a rewrite.

## Required reading order

For every implementation plan:

1. read `00-master-refactor-plan.md`;
2. read `TESTING.md`;
3. read the selected plan completely;
4. read every prerequisite plan named by it;
5. execute the current-code validation gate before editing.

## Implementation order

| Plan | Subject | Stable result used by later plans |
|---|---|---|
| 01 | Sparkline ownership and interfaces | one source for bins/statistics/metadata and normalized series ownership |
| 02 | Sparkline history, time and request lifecycle | one history owner and one source/plot time model |
| 03 | Sparkline data state | explicit loading/data/empty/error/stale semantics |
| [04](../2026.09.24-04-sparkline-data-and-geometry.md) | Sparkline data processing and geometry | reusable processed data separated from geometry/paint |
| [05](../2026.09.26-05-resource-lifecycle-foundation.md) | Resource lifecycle foundation | replacement/disconnect reliably reaches owner cleanup |
| [06](../2026.09.26-06-async-results-and-recovery.md) | Async results and recovery | obsolete callbacks inert; retryable failures recover |
| [07](../2026.09.26-07-card-lifecycle-and-derived-entities.md) | Card lifecycle and derived entity flow | `setHass()` external-only; local/derived updates flow forward |
| [08](../2026.09.26-08-change-detection-and-rendering.md) | Change detection and rendering | event-level invalidation uses stable data/geometry/lifecycle boundaries |
| 09 | Sparkline pointer interaction lifecycle | pointer state follows current DOM/data and always cleans up |
| 10 | Horseshoe animation and path cache | animation stops correctly and transient samples do not grow permanent cache |
| 11 | Config `ref()` and merge | referenced values preserve types without global merge rewrite |
| 12 | Theme-aware color cache | shared cache is theme/mode safe and paint-only updates stay paint-only |
| 13 | Final simplification and cleanup | obsolete guards/duplication/comments removed after causes are gone |
| 14 | CI and development-release safety | deterministic test/release gates protect the completed refactor |

`TESTING.md` is not an implementation phase. Its tests are added by the plan that first owns the behaviour and remain permanently in the suite.

Plan 11 is technically independent and may be implemented earlier if desired. Keeping it later in the numbered sequence avoids interrupting the core Sparkline/lifecycle chain; moving it earlier must not change any core-plan assumptions.
