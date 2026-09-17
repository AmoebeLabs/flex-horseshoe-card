# 09 — Sparkline pointer interaction lifecycle

## 1. Goal

Keep pointer/tooltip behaviour correct across graph-type changes, DOM replacement, drag lifecycle, data becoming empty, disconnect and config replacement without rewriting Safari-sensitive routing.

## 2. Prerequisites

- Plan 03 explicit current data/empty state;
- Plan 05 permanent cleanup path;
- Plan 08 pointer events excluded from normal data/geometry flow.

## 3. Current-code validation

Reproduce/check line -> radial runtime switching, handler closures, actual SVG node identity, window-level drag listeners, pointer RAF and tooltip state. Run WebKit baseline before broad event changes.

## 4. Scope

- stable handler identity without capturing mutable old graph mode/series;
- handlers attached to the current SVG node exactly once;
- drag start/move/end/cancel;
- global listener + RAF ownership;
- disconnect/replacement ends active interaction through Plan 05 cleanup;
- data/config change clears invalid selection/tooltip.

## 5. Out of scope

- changing History/data/geometry flow;
- creating an interaction framework;
- broad event API modernization.

## 6. Required behaviour

Stored callbacks read current runtime graph family/series at execution time. “Handlers attached” must be tied to actual node reference, not merely a boolean that survives node replacement.

Pointerup, pointercancel, disconnect and replacement use the same concrete interaction-end cleanup.

## 7. Implementation sequence

1. Add line/radial and survivor reproductions.
2. Inventory captured mutable variables in stored callbacks.
3. Make graph-family/series lookup current at event/frame execution.
4. Track actual SVG node receiving handlers.
5. Consolidate concrete pointer-end cleanup enough for all endings.
6. Own/cancel pointer RAF and window listeners locally.
7. clear tooltip/selection on Plan 03 empty/config replacement.
8. Run Chromium + mandatory WebKit lifecycle cases.

## 8. Permanent tests

Complete `TESTING.md` pointer matrix and listener/RAF add-remove balance where test DOM supports it.

## 9. Definition of Done

- pointer behaviour always follows current graph type/data;
- old closures do not retain obsolete chart state;
- rerender does not duplicate listeners and a replaced node receives handlers;
- drag listeners/RAF always end on pointerup/cancel/disconnect/replacement;
- empty/reconfiguration clears invalid tooltip state;
- pointer interaction never enters history/data/setHass flow;
- Safari-safe route remains covered.

## 10. Guarantees for following plans

Pointer lifetime is closed. Final cleanup may remove obsolete guards/comments but must not redesign the event route without a new reproduced defect.

## 11. Source material

Replaces old Plan 10; uses Plan 05 instead of reimplementing replacement cleanup and Plan 03 instead of inventing tooltip readiness.
