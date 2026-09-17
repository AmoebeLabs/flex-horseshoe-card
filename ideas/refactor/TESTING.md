# Shared regression and integration test strategy

## 1. Purpose

This file is the permanent test policy for every refactor plan. It is not a final “test phase”. Each plan adds the tests that first become meaningful at that plan's stable boundary; later plans retain them.

## 2. Four test layers

### Layer A — focused calculation/reproduction

Use for pure or mostly-pure behaviour and confirmed regressions: ranges, DST, aggregation, equality, cache identity, `ref()` copying.

### Layer B — neighbouring real FHS modules

Use real producer/consumer pairs wherever practical:

- History + Series;
- Series + Graph;
- Sparkline result + CardEntities;
- CardTheme + Colors;
- CardTools + real tool instances.

Mock only HA/network/time/DOM boundaries as needed.

### Layer C — complete card route

Construct the real card from existing YAML, assign `hass` through the public setter and assert runtime/visible results.

Critical route:

```text
HA sensor -> Sparkline -> fhs_sparkline.avg -> StateTool -> visible output
```

### Layer D — browser behaviour

Use real DOM/browser for SVG measurement, pointer lifecycle, node replacement, WebKit-sensitive routing, animation/cache soak and visual geometry where needed.

## 3. Test-before-fix rule

For a confirmed defect:

1. reproduce it with a failing behaviour test;
2. confirm the failure reason;
3. implement the fix;
4. make the reproduction pass;
5. run neighbouring/full suites.

Do not write only post-fix tests that mirror the new implementation.

## 4. Permanent-test rule

Tests describe behaviour/invariants, not plan phases. Keep them after later refactors.

Delete/rewrite a test only when it protects an implementation detail that is intentionally gone or an approved bug fix changes the expected result.

## 5. Existing YAML as fixtures

Prefer current documented/sample YAML. Include representative fixtures for:

- classic Horseshoe;
- generic path open/closed and marker;
- cartesian line/area/minmax;
- multi-series/offsets;
- state bands;
- radial;
- one interactive control;
- `fhs_sparkline.*` consumed by another tool.

Do not invent a test-only public schema.

## 6. Core permanent matrices

### Sparkline ownership/statistics

- all derived types: min/avg/max/min_time/max_time/duration/bin_duration/aggregate_func;
- implicit vs explicit primary series;
- multi-series shared bin plan;
- whole-period stats distinct from per-bin stats;
- real_time/state_bands bypass incompatible numeric-history assumptions.

### SparklineGraph characterization invariant

Before changing Graph ownership boundaries or splitting data from geometry, capture representative behaviour using the existing inputs at the stable Graph boundary. These tests remain permanent after the refactor.

Core invariant:

```text
same prepared input + same graph mode/config
        -> same processed statistics
        -> same graph geometry/result
```

Cover representative existing behaviour for:

- cartesian line/area;
- bars/dots where their calculation path differs;
- min/max envelope;
- multi-series inputs where Graph output contributes to a shared scale;
- radial;
- state_bands;
- real_time where it uses a Graph calculation path.

Assert stable numeric/statistical/geometry outputs directly using the precision already established by the suite. Do not freeze incidental private object layout, call-stack shape or temporary cache representation.

If a characterization test changes, classify it first: an architectural refactor is not sufficient reason to change the expected Graph result. A changed expectation requires a separately reproduced calculation defect or an explicitly approved semantic change.

### History/time

- rolling current period;
- main offset, series offset, combined offsets;
- implicit/explicit parity;
- calendar day/week/month where supported;
- Europe/Amsterdam spring and autumn DST;
- current HA sample included once in active range;
- historical ranges exclude current sample;
- request failure/recovery;
- stale response/disconnect inert;
- first-bin values including zero/negative.

### Data state

Transitions:

```text
initial -> loading -> data
initial -> loading -> empty
data -> loading refresh -> data
data -> loading refresh -> empty
data -> error -> recovery
full series + empty series
```

Assert no stale path/coords/tooltip/statistics.

### Data/geometry boundaries

- new data processes affected data once;
- resize/margins: zero history requests/reaggregation, geometry recalculates;
- theme/color: zero history/reaggregation and normal geometry rebuild, paint updates;
- pointer move: zero normal graph data/geometry rebuild.

Exact initialization call counts may differ because DOM measurement can require a follow-up. Assert functional boundaries rather than brittle internals.

### Lifecycle/derived flow

- one external `hass` assignment enters `setHass()` once;
- history/timer/FHS-input/palette completion never fakes another HA update;
- derived value changes update consumers;
- unchanged derived value does not pretend to change;
- JS-backed consumers preserve supported local-entity semantics;
- two consumers of one derived entity both update while Sparkline computes once.

### Effective-output equality

Example ordinary StateTool:

```text
20.1 -> "20"
20.4 -> "20"   no render solely for this tool
20.6 -> "21"   render
```

### Resource lifecycle

For parent disconnect and config replacement:

- timers cancelled;
- owned RAFs cancelled;
- global listeners removed;
- old async results inert;
- new tool works immediately when parent remains connected;
- reconnect does not duplicate resources.

### Pointer

- line -> radial -> line;
- same node re-render, replaced SVG node;
- drag -> pointerup/pointercancel/disconnect/replacement;
- pending RAF -> disconnect;
- tooltip active -> valid empty/config change.

### Horseshoe/path

- active animator -> disconnect/replacement -> RAF cancelled;
- long animation does not grow point/tangent cache per frame;
- stable measurement positions still reuse cache;
- existing path-engine tests remain unchanged.

### Async

- Palette simultaneous success shares fetch;
- failed palette request can retry;
- old reject cannot remove newer retry entry;
- ChildCards A/B completion orders always leave latest config current;
- stale palette completion cannot overwrite active config.

### Config/ref

- scalar/object/array/nested values;
- two independent consumers;
- current field-specific array semantics preserved.

### Theme/cache

- same theme/mode reuses conversion;
- different themes do not share CSS-var result;
- dark/light separated;
- palette invalidates correct bucket;
- paint changes do not trigger history/data work.

## 7. Browser matrix

- Chromium: complete configured core suite.
- WebKit: pointer, line/radial switching, SVG path measurement/binding, Horseshoe animation cleanup, known Safari-sensitive routes.
- Firefox: small core set where infrastructure cost is reasonable.

Do not multiply every screenshot case across every browser.

Use screenshot assertions only where visual geometry itself is under test. Prefer direct value/DOM/listener/count/state/cache assertions elsewhere.

## 8. Timezone determinism

Tests that assume UTC set UTC explicitly. Tests for local calendar/DST set the intended timezone explicitly (`Europe/Amsterdam`). Never depend on the developer machine timezone.

## 9. Mocking rules

Prefer real FHS neighbours. Mock only true boundaries:

- HA history/network;
- current clock;
- scheduler/timers/RAF when deterministic fake is useful;
- DOM APIs unavailable in Node.

Do not mock Graph/Series when the test exists to catch their interface mismatch.

## 10. Full-suite rule

Run focused tests during a plan. Before a plan is complete:

- run full Node suite;
- run affected Chromium suite;
- run required WebKit cases for touched SVG/interaction/lifecycle code;
- run build + ESLint.

Before the complete series is merged, run the full configured browser matrix and representative soak cases.

## 11. Failure diagnosis

When an existing test fails after a refactor, classify it before editing expectations:

- intentional confirmed bug fix;
- implementation regression;
- old test encoded an invalid implementation detail;
- timezone/browser nondeterminism.

Only the first or third case justifies changing expected behaviour, with an explicit reason.

## 12. Diagnostic metrics

After the major Sparkline/lifecycle work, rerun architecture metrics as diagnostics, not pass/fail thresholds. Expected direction: fewer GraphTool history writers, no internal parent `setHass()` feedback, smaller shared mutable-state surface and fewer repeated full Graph update paths. Do not reject clear algorithmic code because a complexity score remains high.
