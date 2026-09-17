# 13 — Final simplification, duplication and comments

## 1. Goal

After all functional routes are proven, remove obsolete workaround flags, duplicate paths, dead comments and only the duplication whose separate responsibility has disappeared.

## 2. Prerequisites

Plans 01–10 and 12 complete; Plan 11 complete whenever it is included in the release series. Permanent tests from all completed plans are green.

## 3. Current-code validation

Rerun architecture/search metrics on the actual final branch: parent-card calls, history-state writers, stale readiness flags, direct requestUpdate/setHass sites, duplicate blocks, dead imports/methods and comments describing removed behaviour.

## 4. Scope

- remove lifecycle/history/readiness flags whose cause is gone;
- remove feedback-only code and obsolete force-update paths;
- remove old duplicate range/state calculations;
- review new helpers for unnecessary indirection;
- update comments/docblocks;
- optionally extract proven radial/text/path duplication where tests show identical responsibility;
- update developer/user docs and changelog for visible fixes;
- rerun diagnostic architecture metrics;
- review the previously identified radial path-builder duplication semantically before extracting anything;
- review repeated text-measurement lifecycle in AreaTool/NameTool/StateTool only if behaviour is truly identical;
- leave path-generator duplication explicit when local formulas are clearer;
- do not split StateTool/control logic merely because complexity metrics are high.

## 5. Out of scope

- new architecture or broad renaming;
- path-engine generalization;
- complexity-score driven splitting;
- new behaviour not already specified by a prior plan.

## 6. Implementation sequence

1. Search all obsolete feedback/guard/readiness state, including old `card.setHass(card._hass)` commentary, shadow History fields and coordinate-based readiness remnants.
2. Remove only code made unreachable/unnecessary by completed plans.
3. Run tests after each cleanup group.
4. Review duplicate blocks and extract only truly identical operations.
5. Inline trivial helper sprawl introduced during refactor where linear flow becomes clearer.
6. update comments and old historical implementation notes;
7. rerun parent-card/state-writer/dead-code analysis;
8. update user docs/changelog only for visible behaviour fixes;
9. run complete permanent test suite/browser/build matrix.

## 7. Permanent tests

No cleanup-only temporary suite. All prior permanent tests remain the acceptance suite. Add a test only if cleanup exposes a previously unprotected invariant.

## 8. Definition of Done

- no obsolete internal Hass feedback route/guard remains;
- history/readiness workarounds removed where their cause is gone;
- comments describe current behaviour;
- no newly invented architecture jargon in source identifiers;
- no dead methods/imports from old routes;
- code is more linear without micro-helper sprawl;
- proven algorithms/YAML remain intact;
- full permanent suite passes.

## 9. Guarantees for following plans

Plan 14 may treat runtime/source architecture as complete; it hardens CI/release execution only.

## 10. Source material

Refines old Plan 15. Cleanup is no longer expected to finish functionality left incomplete by earlier plans.
