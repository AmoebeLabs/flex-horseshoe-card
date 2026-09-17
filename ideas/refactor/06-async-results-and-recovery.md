# 06 — Async results and recovery

## 1. Goal

Make every remaining non-History async owner accept results only when they still belong to the live operation, and allow retry after transient cache failures.

## 2. Prerequisites

- Plan 02: History stale/retry behaviour already stable.
- Plan 05: replacement/disconnect cleanup paths already stable.

## 3. Current-code validation

Verify current `Palette.load()`, `CardTheme.loadPalettes()`, `ChildCards` async config creation and other overlapping async writes. Confirm History already satisfies this plan's rule and does not need redesign.

## 4. Scope

- ChildCards latest-config-wins;
- palette pending-success sharing;
- palette failed-entry recovery;
- old rejection cannot delete newer retry entry;
- CardTheme palette completion cannot apply old config;
- disconnected/replaced owners ignore late completions;
- targeted scan of other real overlapping async-write risks;
- preserve existing user/developer-visible error reporting while still allowing retry.

## 5. Out of scope

- generic async manager;
- History rewrite;
- replacing palette completion's current card update route (Plan 07). This plan only makes the completion valid/current; Plan 07 changes how a valid completion propagates.

## 6. Required local validity rule

Depending on owner, compare only concrete needed facts: live instance, config sequence/reference, palette key/URL, current config. Do not propagate architecture vocabulary into code.

## 7. Implementation sequence

1. Add ChildCards A/B out-of-order reproduction.
2. Add Palette failure -> later successful retry reproduction.
3. Lock concurrent pending-load sharing.
4. Add local latest-operation check to ChildCards.
5. Remove only the exact failed palette cache entry if still current.
6. Add CardTheme overlapping-palette-config test and fix if vulnerable.
7. Make owner disconnect/replacement invalidate later completion.
8. Search remaining async/fetch/Promise routes and change only proven overlapping-lifetime risks.
9. Run History stale tests to prove no regression without modifying its ownership.

## 8. Permanent tests

All `TESTING.md` async matrix: palette simultaneous success/failure/retry, ChildCards A/B both completion orders, stale palette config, disconnect/replacement late callback.

## 9. Definition of Done

- old async results cannot overwrite newer config/state;
- palette failure does not poison future attempts;
- concurrent successful palette requests still share work;
- ignored async results cannot render or reattach resources;
- History remains unchanged except compatibility with already-established interfaces;
- no generic async framework introduced.

## 10. Guarantees for following plans

Plan 07 may assume palette and ChildCards completions are already validated as current before propagation. It only needs to replace broad card re-entry with direct functional routes.

## 11. Source material

Replaces old Plan 11 except history-specific request validity, which permanently moved into Plan 02.
