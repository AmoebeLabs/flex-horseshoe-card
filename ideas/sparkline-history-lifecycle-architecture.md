# FHS Sparkline History Lifecycle

## Main Goal

Make sparkline history loading and realtime updates predictable for every supported period type without mixing closed historical data with the current Home Assistant state.

The graph engine remains responsible for bucket calculations and graph geometry. The sparkline tool remains responsible for:

- selecting the requested history range
- fetching Home Assistant history
- maintaining the in-memory history series
- adding realtime samples for active periods
- refreshing closed calendar ranges when the local date changes

This work extends the current implementation. It is not a graph engine rewrite.

## Current Problem

The tool currently adds the current entity to history through several paths:

- while building the fetched history series
- immediately after a history fetch
- after every Home Assistant state update
- at every bin boundary

That behavior is correct for active periods:

- `rolling_window`
- `calendar` with `offset: 0`

It is incorrect for a closed historical calendar period such as `calendar.offset: -1`. The current state is newer than that requested range. The calendar reducer clamps its bucket index to the last available bucket, so the current value contaminates the final bucket of yesterday.

The existing five-minute history refresh also treats active and closed periods the same. Closed historical periods are static until the local date changes and do not need repeated history requests.

The existing `real_time` mode has a different purpose. It displays only the current state and must not enter the history-fetch lifecycle at all. The graph engine currently assigns this mode one hour and one point to make its bucket and coordinate calculations work. That internal hour is not a requested history window.

## Required Invariants

### Home Assistant source data is immutable

Never change `last_changed`, `last_updated`, or another field on a Home Assistant history row. Realtime samples may be newly created objects with their own timestamp, but fetched source rows must remain unchanged.

### The period type controls the history lifecycle

The configured period type is always present and must be used directly:

- `real_time` contains one current sample and never fetches history.
- `rolling_window` is always active and receives realtime samples.
- `calendar.offset === 0` is the active calendar range and receives realtime samples.
- `calendar.offset < 0` is a closed historical range and never receives the current entity.

Future calendar offsets are outside the scope of this change.

### Real-time mode is history-free

For `real_time`, every Home Assistant state change replaces the one-item series with the new current sample. It does not append samples, maintain a time window, schedule bin-boundary updates, fetch history, or calculate a calendar range.

The engine's internal one-hour value may remain where it is required for the existing one-point calculation. The tool must not interpret it as permission to request one hour of history.

### The latest active bucket is realtime

For active periods, every new Home Assistant state must be added to the latest bucket. That bucket must recalculate its value, minimum, average, and maximum from all samples assigned to that bucket.

At a bin boundary, the current state must seed the newly active bucket even when the sensor value itself has not changed.

### Closed calendar ranges are static

Once history for `calendar.offset < 0` has been fetched, its rows and buckets remain unchanged until the requested calendar range changes at local midnight.

### The reducer does not own history retention

The reducer creates temporary bucket groups. It does not remove rows from `historySeries`. Retention and pruning therefore belong to the sparkline tool, before data is passed to the graph engine.

## Behavior Matrix

| Period | Initial history fetch | Realtime samples | Bin-boundary sample | Range refresh |
| --- | --- | --- | --- | --- |
| `real_time` | No | Replace current sample | No | Never |
| `rolling_window` | Yes | Yes | Yes | Reconnect or explicit resync |
| `calendar.offset === 0` | Yes | Yes | Yes | Local midnight, reconnect, or explicit resync |
| `calendar.offset < 0` | Yes | No | No | Local midnight only |

## Implementation Plan

### 1. Keep real-time mode outside the history lifecycle

When `period.type === 'real_time'`, the tool must use only the current entity state.

The real-time path must:

- build a one-item series from the current entity
- replace that item after every Home Assistant state change
- update the graph and derived entities directly
- skip history range calculation and API fetching
- skip bin-boundary and local-midnight timers
- skip history retention and pruning

Acceptance criteria:

- No Home Assistant history request is made.
- The displayed value changes immediately with the entity state.
- The series always contains one current sample.
- The engine's internal one-hour value does not become a history window.
- Existing real-time graph types continue to render.

### 2. Prevent realtime contamination of historical calendar periods

The history series built for `calendar.offset < 0` must contain only rows returned by the Home Assistant history request.

Apply the period condition consistently to:

- history series construction
- post-fetch current-state insertion
- `setState()` realtime insertion
- bin-boundary insertion

Do not change the reducer to compensate for incorrect tool input.

Acceptance criteria:

- `offset: -1` does not change when the current sensor changes.
- `offset: -2` does not change when the current sensor changes.
- The final historical bucket contains only samples from its requested range.
- Fetched Home Assistant timestamps remain unchanged.

### 3. Preserve realtime updates for active periods

Keep the existing realtime path for `rolling_window` and `calendar.offset === 0`.

Every state update must:

- append a new realtime sample
- pass the complete active series to the reducer
- recalculate the latest bucket
- update graph paths, tooltip values, and derived min/avg/max entities

Acceptance criteria:

- The active bucket updates without another history fetch.
- Min, average, and max change when new values arrive in the same bucket.
- Rolling-window and active-calendar behavior remain identical from a user perspective.

### 4. Separate bin-boundary updates from history fetching

A bin boundary is a graph update event, not automatically a history-fetch event.

For an active period, the boundary callback must:

- create a realtime sample from the current entity
- add it to the newly active bucket
- recalculate the graph

For a closed historical period, the boundary callback must not alter the series.

Acceptance criteria:

- A stable sensor seeds each new active bin.
- No history request is required to advance an active graph by one bin.
- Closed historical graphs do not update at ordinary bin boundaries.

### 5. Refresh calendar ranges at local midnight

Store the start and end of the history range represented by `historySeries`. For calendar periods, calculate the next local midnight and schedule a timer for that timestamp.

When the timer runs:

- calculate the calendar history range again
- compare it with the stored range
- bypass the normal refresh deadline when the range changed
- replace `historySeries` with the newly fetched range
- schedule the next local-midnight timer

Timers can run late when a browser or mobile device sleeps. The callback must therefore calculate the range from the current local date instead of assuming that it ran exactly at midnight.

Acceptance criteria:

- After midnight, `offset: -1` changes from the old yesterday to the new yesterday.
- A sleeping browser refreshes the range when it resumes.
- Daylight-saving transitions do not depend on a fixed 24-hour timeout.
- The timer is cleared when the card is disconnected.

### 6. Prune live history to the active window

Without periodic full history replacement, active `historySeries` would grow for as long as the card remains open.

Before passing live history to the reducer:

- remove samples older than the active range
- retain at most one sample immediately before the range start when it is needed as the initial state
- retain every sample inside the range
- retain current realtime samples assigned to the active bucket

Acceptance criteria:

- Memory use does not grow indefinitely.
- The first bucket still has the correct initial state.
- The latest bucket still contains all realtime samples needed for min/avg/max.

### 7. Replace periodic fetching with explicit resynchronization

After pruning is implemented, a full history request every five minutes is no longer required for a continuously connected active card.

History should be fetched when:

- the tool is initialized
- the requested calendar range changes
- Home Assistant reconnects after updates may have been missed
- an explicitly configured resynchronization policy requests it

The current `refresh_interval` may remain as an optional recovery mechanism, but it should not be required for normal realtime graph operation.

Acceptance criteria:

- A connected active card remains correct without repeated full history requests.
- Reconnect fills any gap left by missed Home Assistant events.
- Closed historical calendar periods are not fetched repeatedly during the same local day.

### 8. Define out-of-range sample handling

The tool must pass only intentional input to the reducer.

- One valid sample before the range may be retained as the initial state.
- Samples inside the active range are bucketed normally.
- Current samples are accepted only for active periods.
- Samples newer than a closed historical range are excluded before reduction.

The active latest bucket must continue to accept realtime data. This rule only prevents out-of-range current data from entering a closed historical period.

Acceptance criteria:

- No historical final bucket is contaminated by the current state.
- No active latest bucket loses realtime samples.
- Boundary behavior is identical for graph paths, tooltips, and derived entities.

### 9. Add regression coverage for the history lifecycle

Cover at least:

- real-time initial state
- real-time state replacement
- real-time mode without a history request or timer
- rolling window initial fetch
- rolling window realtime update
- rolling window bin transition
- active calendar initial fetch
- active calendar realtime update
- active calendar local-midnight transition
- calendar offset `-1`
- calendar offset `-2`
- browser sleep across local midnight
- Home Assistant reconnect
- pruning while preserving one pre-range state
- latest-bucket min/avg/max recalculation

## Delivery Order

Implement and verify the subissues in this order:

1. keep real-time mode outside the history lifecycle
2. block realtime data for closed historical calendar periods
3. verify realtime behavior for active periods
4. separate bin-boundary updates from history fetching
5. add local-midnight calendar range refresh
6. prune live history
7. reduce periodic history fetching
8. formalize out-of-range handling
9. complete regression coverage

Each step must preserve working rolling-window behavior before the next step is started.

## Non-Goals

- Do not modify Home Assistant source timestamps.
- Do not make the graph engine responsible for API fetching.
- Do not change graph rendering, axes, tooltip rendering, or chart types.
- Do not combine calendar and rolling-window calculations.
- Do not turn the internal real-time one-hour engine value into a history window.
- Do not add fallback period types or infer a period when configuration is missing.
- Do not redesign the existing graph engine while changing the history lifecycle.
