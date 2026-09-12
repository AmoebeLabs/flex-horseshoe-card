# 03 — Sparkline loading, data, empty and error state

## 1. Goal

Give Sparkline explicit semantics for request state and processed-data state so old coordinates/statistics can never masquerade as readiness.

## 2. Prerequisites

Plans 01–02 complete. History request status and prepared data already have one stable owner/interface.

## 3. Current-code validation

Search for readiness inferred from coordinates, `historyDurationReady`, loading/preserve flags, Graph return booleans, tooltip selection and derived metadata availability. Confirm History from Plan 02 is the only request owner.

## 4. Scope

Distinguish at least the following semantic outcomes using the smallest current-code representation:

```text
not loaded
loading
valid data
valid empty
error
closed/stale
```

Also define:

- refresh while previous valid graph is temporarily shown;
- valid empty clearing old processed/geometry/statistics state;
- error distinct from empty;
- per-series state in multi-series graphs;
- tooltip/selection behaviour when current data disappears.

## 5. Out of scope

- history request/range ownership (closed in Plan 02);
- data/geometry performance separation (Plan 04);
- derived-entity publication flow (Plan 07). This plan only exposes the state/result that Plan 07 will consume.

## 6. Required semantics

Presentation may temporarily keep the previous graph during refresh/error if that is current FHS behaviour, but:

```text
previous graph visible temporarily
!= current request/data is ready
```

Valid empty must actively clear old data, coordinates/path representation, period statistics and active tooltip selection for that series.

A stale result is discarded by History before it can alter this state.

## 7. Implementation sequence

1. Add full -> empty reproduction and transition matrix tests.
2. Classify every readiness check as request status or processed-data status.
3. Make Graph report only processed data outcome; it does not know HA request lifecycle.
4. Coordinate per-series status in Series using History + Graph results.
5. Make valid empty clear old data/geometry/statistics deterministically.
6. Make tooltip selection clear when its current data/point disappears.
7. Replace ambiguous `historyDurationReady` uses with their real source question.
8. Remove old coordinate/readiness shortcuts after permanent transition tests pass.

## 8. Permanent tests

All `TESTING.md` data-state transitions, plus multi-series full+empty, stale result, disconnect during request, tooltip clearing and derived-stat source availability at the Sparkline result boundary.

## 9. Definition of Done

- valid empty is a first-class successful state;
- loading/error/empty are distinguishable without geometry inspection;
- Graph reports processed-data status, History reports request status, Series coordinates them;
- old coordinates cannot prove current readiness;
- temporary previous presentation does not publish itself as current data;
- tooltip/selection cannot point into stale geometry;
- no new broad readiness flag duplicates the underlying facts.

## 10. Guarantees for following plans

Following plans may assume:

- every current series result has explicit request/data semantics;
- empty/error transitions deterministically clear or preserve the right state;
- downstream derived entities and rendering never need to guess readiness from Graph internals.

## 11. Source material

Replaces old Plan 07; absorbs only the readiness semantics that old Plan 06 expected from it.
