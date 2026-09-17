# Mapping from previous plans to the dependency-aligned sequence

| Previous document | New destination | Reason |
|---|---|---|
| 00 master | 00 master | rewritten around prerequisites/DoD/guarantees/current-code gate |
| 01 lifecycle (adjusted) | 07 | waits until Sparkline, cleanup and async validity are stable |
| 02 change detection | 08 | now follows completed data/geometry separation |
| 03 Sparkline responsibilities | 01 + 02 | stable ownership first; actual History extraction/time work second |
| 04 history/time/offsets | 02 | one permanent History/time implementation |
| 05 data/geometry | 04 | implemented before global invalidation depends on it |
| 06 derived entities | 01 (source ownership) + 07 (publication/propagation) | removes duplicate lifecycle plan; no separate implementation phase |
| 07 loading/empty/error | 03 | explicit state after History ownership is stable |
| 08 resource lifecycle | 05 + specialized 09/10 | foundation separated from pointer/path-specific corrections |
| 09 Horseshoe animation/path cache | 10 | builds on cleanup + change-detection guarantees |
| 10 pointer lifecycle | 09 | builds on cleanup + explicit data state |
| 11 async results/recovery | 02 (History) + 06 (Palette/ChildCards) | async validity placed with real functional owners |
| 12 config ref/merge | 11 | remains independent |
| 13 theme-aware cache (adjusted) | 12 | now consumes established paint-only lifecycle |
| 14 regression/integration | TESTING.md | shared permanent strategy, not final implementation phase |
| 15 cleanup | 13 | cleanup only after all causes are removed |
| 16 CI/release | 14 | protects permanent suite at end |

## Important removal of rework

- History is not partially extracted in one plan and reorganized again in the next.
- Loading/readiness is not inferred through an interface that a later plan removes.
- Derived entity publication is not a separate phase from the lifecycle that consumes it.
- Change detection no longer requires geometry-only behaviour before the data/geometry split exists.
- Palette lifecycle no longer implements stale-result logic that a later async plan replaces.
- Resource foundation no longer tries to fully solve pointer/path-specific defects and then re-solve them later.
