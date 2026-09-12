# 02 — Sparkline history, time and request lifecycle

## 1. Goal

Create one permanent history/time owner and one testable model for source windows, plot windows, offsets, current samples, request identity, refresh and retry.

## 2. Prerequisites

Plan 01 complete. This plan relies on its stable Series/Graph/result ownership and does not revisit it.

## 3. Current-code validation

Verify current writers/callers for history loading/resync/preserve flags, source-range calculations, current-sample insertion, refresh timers and stale-request checks. Confirm Plan 01 guarantees are present.

Baseline: `src/sparkline-graph-tool.js`, `src/sparkline-series.js` and HA history helpers.

## 4. Scope

- extract/concentrate history responsibility into `SparklineHistory` when current code confirms that remains the clean boundary;
- absolute source-history windows;
- shared plot window inputs supplied by Series;
- rolling/calendar ranges and offsets;
- DST-correct calendar calculations;
- current HA sample inclusion/deduplication;
- history ordering/input normalization required by existing semantics;
- request identity/stale response rejection;
- retry/recovery timing;
- bin/calendar refresh timers owned by History;
- History cleanup of its own resources;
- day/night auxiliary history under the same History owner but kept separate from normal numeric series data;
- history reuse only when entity/source and absolute requested range actually satisfy the request;
- tooltip/X-axis consumers reuse the already-calculated time boundaries instead of repeating offset/calendar arithmetic.

## 5. Out of scope

- user-visible loading/empty/error semantics beyond the request facts History must report (Plan 03);
- Graph data/geometry split (Plan 04);
- card-wide `setHass()` re-entry removal (Plan 07). History itself must not call the parent card, but an existing GraphTool continuation may remain until Plan 07.

## 6. Required time model

Keep these separate:

```text
plot window       where the series appears relative to the shared graph timeline
source window     absolute timestamps requested/read for that series
```

Offsets may relate them but may never cancel an absolute source period by applying relative arithmetic twice.

Order:

1. normalize period/series inputs;
2. determine shared plot window;
3. determine shared bin plan from Series;
4. determine each absolute source window;
5. request/reuse history;
6. add current HA sample only when that source range includes the live period;
7. return prepared records + source range + request status + next refresh information.

Calendar boundaries use local-calendar semantics and are tested around DST. Bin/calendar refresh schedules the next real boundary rather than assuming a fixed 24-hour delay.

Day/night auxiliary history reuses the same request-validity, retry and cleanup rules, but retains its separate sun-state semantics and does not enter normal numeric bin processing.

History reuse is keyed by the actual entity/source plus absolute source range; visually similar projected plot ranges are not enough. Tooltip and X-axis presentation consume prepared timestamps/ranges and do not create a second offset/calendar model.

## 7. Request validity

A completion is usable only when it still matches the live History owner, series/source/range/config and has not been closed/replaced.

A stale completion changes nothing. A failed request may be retried later without tight loops.

## 8. Implementation sequence

1. Lock current rolling/calendar/offset behaviour with tests.
2. Add the reproduced main-offset failure and DST cases.
3. Add current-sample inclusion/dedup tests and failure/recovery/stale cases.
4. Inventory every history/time state field and writer.
5. Define the minimal concrete History inputs/outputs using existing FHS data shapes.
6. Move source-range/request/current-sample/refresh/retry state as one coherent group; avoid helper-by-helper migration.
7. Make request identity and close/inert behaviour private to the History owner.
8. Update GraphTool/Series callers to consume the stable result.
9. Remove duplicate range arithmetic and duplicate request state from GraphTool.
10. Run state-band, multi-series and offset matrices.

## 9. Permanent tests

All `TESTING.md` history/time tests, including:

- rolling/current/main offset/series offset/combined;
- implicit/explicit parity;
- Europe/Amsterdam DST;
- active current sample exactly once;
- historical offset excludes current sample;
- failure -> later success;
- stale/disconnected response inert;
- state-band unknown/unavailable normalization without losing valid transitions.

## 10. Definition of Done

- one visible calculation path produces plot and source ranges;
- main/series offsets cannot accidentally cancel historical requests;
- calendar ranges are DST-correct;
- active current measurement is included exactly once when applicable;
- request/retry/refresh/stale state has one owner;
- old GraphTool history-state duplicates are removed;
- History owns and cleans up its timers/request relevance;
- History never calls parent `setHass()` or parent render methods;
- tests pass with unchanged YAML.

## 11. Guarantees for following plans

Following plans may assume:

- prepared history and request status come from one permanent History owner;
- source/plot ranges and refresh times are stable interfaces;
- stale history results are already rejected before downstream processing;
- Plan 03 only needs to define semantic data/readiness outcomes, not move request ownership again.

## 12. Source material

Replaces old Plan 04 plus the history-ownership extraction portion of old Plan 03 and history-specific stale/recovery rules from old Plan 11.
