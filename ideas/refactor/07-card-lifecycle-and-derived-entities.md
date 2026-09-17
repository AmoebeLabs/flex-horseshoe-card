# 07 — Card lifecycle and derived entity flow

## 1. Goal

Make `setHass()` the external Home Assistant input route only and propagate FHS-local changes in one forward sequence, including complete `fhs_sparkline.*` publication.

This plan fully absorbs the old separate derived-entity plan because lifecycle ordering and derived publication are one functional change.

## 2. Prerequisites

Plans 01–06 complete:

- Sparkline result ownership stable;
- History/time stable;
- loading/data state explicit;
- Graph processing boundaries stable;
- cleanup/replacement stable;
- async palette/child completions validate their currency.

## 3. Current-code validation

Search current branch for:

```text
setHass(
requestUpdate(
requiresHassUpdate(
stateChanged
forceUpdate
updateSparklineEntities(
```

Classify every call/site by functional reason. Account for all internal parent-card `setHass()` routes before editing, especially FHS inputs, palette completion and Sparkline history/timer completion.

## 4. Scope

- external HA update order;
- async Sparkline-result continuation;
- timer/bin/calendar continuation;
- FHS-input continuation;
- palette-completion continuation;
- complete `fhs_sparkline.*` entity construction/equality/publication;
- JavaScript runtime config semantics for source and derived entities;
- animation sees final current entities;
- one card-wide render scheduling decision per logical data update, except justified DOM/presentation follow-ups.

## 5. Out of scope

- finest visible-output equality for every tool (Plan 08);
- deciding data vs geometry work (already enabled by Plan 04, globally routed by Plan 08);
- pointer/path specialized lifecycle (Plans 09/10).

## 6. Required normal HA order

Use a two-publication model while preserving the shared `entities` array identity:

```text
1  external hass setter -> setHass(newHass)
2  store/publish HA context to Templates/HomeAssistant/CardTheme/ChildCards
3  determine changed configured source/FHS input dependencies
4  update source entity entries in the existing shared entities array
5  evaluate source-dependent runtime entity config/groups/card styles as required
6  update Sparkline runtime config/source entities
7  let Sparkline produce synchronous current result
8  build/compare/publish fhs_sparkline.* entries into the same entities array
9  if derived values changed, conservatively reevaluate supported JS-backed consumers that may observe entities
10 update ordinary consumers of changed source/derived values
11 update animation selection/state against final entities
12 aggregate render requirement
13 mark source/domain markers handled
14 requestUpdate once when required
15 end
```

No step jumps back to 1.

## 7. Async/timer order

```text
current History/timer result
 -> Sparkline updates affected data/result
 -> rebuild affected fhs_sparkline.*
 -> compare/publish changed derived entries
 -> reevaluate supported JS-backed consumers of derived entities when required
 -> update ordinary dependent tools
 -> update affected animation state
 -> one render decision
 -> end
```

No `setHass(card._hass)`.

## 8. FHS-input order

FHS input change is local input, not a new HA object:

```text
CardInputEntities publishes changed state
 -> update shared source entity contents
 -> evaluate affected runtime config
 -> Sparkline + ordinary consumers in normal order
 -> derived outputs if Sparkline changes
 -> animations
 -> render decision
```

Preserve current local/global persistence and cross-card synchronization.

## 9. Palette order

Valid/current completion from Plan 06:

```text
apply palette variables/cache invalidation
 -> update affected visual tools/paint
 -> schedule required render/follow-up SVG gradient measurement
```

No entity/history/bin/statistics processing and no fake HA update.

## 10. `fhs_sparkline.*` publication

Supported current types:

```text
min avg max min_time max_time duration bin_duration aggregate_func
```

Use Plan 01's stable metadata sources and Plan 03's explicit state.

Compare the fields consumers can observe: state, unit, device class, name/label metadata and deliberately exposed attributes. Replace/mark only changed entries; do not set a global local-change flag merely because publication ran.

Preserve useful source-entity copying/schema behaviour unless a specific test proves leakage.

Graph-visible change and derived-entity change remain separate: geometry may change while published average remains equal.

## 11. JavaScript config dependency

Preserve current supported JS semantics. Templates/config can read the shared `entities` collection and broader HA context.

Do not build a dependency parser. When newly published derived values may affect existing JS-backed consumers, reevaluate them conservatively and use their existing active-config comparison to stop unnecessary follow-up work.

## 12. Implementation sequence

1. Add lifecycle counters/full-route baseline tests.
2. Implement complete derived-entity equality/publication using stable Plan 01/03 results.
3. Add direct Sparkline history/timer continuation and remove both parent `setHass()` feedback calls.
4. Replace FHS-input callback re-entry with direct local-input route.
5. Replace valid palette completion forced `setHass()` with direct paint route; retain required post-render SVG measurement.
6. Ensure shared entities-array identity is preserved while contents are updated at source and derived publication points.
7. Preserve JS-backed config semantics for derived values.
8. Aggregate final card render decision without adding recursion-prevention flags.
9. Remove feedback-only flags proven unused.
10. Run full lifecycle matrix.

## 13. Permanent tests

- external `hass` assignment enters `setHass()` once;
- history/timer completion never enters it;
- all eight derived types, primary/named series;
- equal derived output reports no local change; metadata change does;
- StateTool consumer updates from derived avg;
- two consumers update from one computation;
- supported JS consumer sees new derived value;
- FHS input reaches applicable cards without HA re-entry;
- palette repaint changes no history/data counters;
- stale history/palette result inert;
- reconnect/config replacement initializes current generation once;
- existing YAML unchanged.

## 14. Definition of Done

- `setHass()` has one external meaning;
- no internal Sparkline/FHS-input/palette route calls parent `setHass()`;
- `fhs_sparkline.*` publication is complete and equality-based;
- changed derived values reach consumers/animations directly;
- shared entities-array identity is preserved;
- async/timer result can update card in one forward sequence;
- no recursive-update prevention flags or event bus introduced;
- legitimate DOM/pointer/animation presentation renders remain narrow and do not restart data processing.

## 15. Guarantees for following plans

Plan 08 may assume all logical input routes already have one forward lifecycle and stable Sparkline data/geometry boundaries. It only refines what work/render is necessary; it does not redesign propagation.

## 16. Source material

Replaces old Plan 01 **and** old Plan 06 as one implementation plan. Includes the two-phase source/derived entity publication clarification from the plan review.
