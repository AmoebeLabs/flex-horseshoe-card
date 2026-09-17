# 08 — Change detection and rendering

## 1. Goal

Use the stable lifecycle and Sparkline processing boundaries to perform only the work invalidated by an input and render only when effective visible output changed.

## 2. Prerequisites

Plans 01–07 complete. In particular:

- Plan 04 already provides real data/geometry/paint boundaries;
- Plan 07 already provides one forward card update route.

This plan must not recreate either mechanism.

## 3. Current-code validation

Inventory current broad change flags, `renderRequired`, tool config/state comparison, direct `requestUpdate()` calls and GraphTool change results. Verify Plan 04/07 guarantees before editing.

## 4. Scope

Distinguish:

```text
source/input may have changed
effective tool result changed
visible output changed
```

Route known changes to the cheapest stable boundary:

| change | history | data | geometry | paint/render |
|---|---|---|---|---|
| unrelated HA entity | no | no | no | no |
| equal effective ordinary value | no | cheap compare | no | no |
| changed ordinary value | no | tool state | only if required | yes |
| new Sparkline measurement | reuse/request as required | yes | if result changed | yes |
| bin/time boundary | reconsider | yes | yes | yes |
| width/margins | no | no | yes | yes |
| theme/color | no | no | no normal geometry | yes |
| entity/period/offset/aggregate | yes | yes | yes | yes |
| pointer | no | no | no normal graph rebuild | targeted presentation |
| animation frame | no | no | state-layer only | targeted presentation |

## 5. Out of scope

- changing lifecycle order (Plan 07 closed it);
- further Graph algorithm restructuring (Plan 04 closed it);
- pointer correctness details (Plan 09);
- Horseshoe cache mechanics (Plan 10).

## 6. Required change-reporting style

Let the owner that understands an effective result decide equality. Existing functions may return/change a small boolean/result where clear; do not force a generic enum or make every method return a new architecture object.

Preserve `BaseTool` active-config comparison: evaluating JS config does not mean effective config changed.

## 7. Main render aggregation

A Hass assignment does not itself prove a render is needed after initialization. Main combines real child/domain results and schedules once.

Justified separate follow-ups remain allowed for DOM measurement, gradient painting, pointer overlay or animation; they must not restart normal data flow.

## 8. Implementation sequence

1. Inventory every current “changed” flag and classify its meaning.
2. Add ordinary effective-output equality test.
3. Wire ordinary tool update results to effective-change decisions.
4. Wire Sparkline event reasons to Plan 04 data/geometry/paint boundaries.
5. Ensure theme-only, resize-only, pointer and animation routes enter only allowed work.
6. Narrow final `main` render aggregation using Plan 07's forward route.
7. Preserve initialization/reconnect required renders.
8. Add instrumentation/call-count assertions around functional boundaries.
9. Remove broad “hass arrived => render” assumptions made obsolete here.

## 9. Permanent tests

All `TESTING.md` effective-output and data/geometry event-level tests, including StateTool `20.1 -> 20.4 -> "20"`, theme-only, resize-only, new Sparkline measurement, pointer and animation boundaries.

## 10. Definition of Done

- normal Hass assignment does not guarantee render after initialization;
- tools calculate only when inputs may matter and decide their own effective result;
- geometry-only events do zero reaggregation/history;
- paint-only events do zero history/data and no normal geometry;
- pointer/animation remain outside normal graph rebuild;
- one logical data event produces one understandable render decision;
- no generic invalidation framework introduced.

## 11. Guarantees for following plans

Plans 09/10/12 may rely on stable event-level rules: pointer, animation and theme/palette work cannot accidentally fall back into history/data processing.

## 12. Source material

Replaces old Plan 02 while consuming the already-complete capability of old Plan 05 rather than requiring it later.
