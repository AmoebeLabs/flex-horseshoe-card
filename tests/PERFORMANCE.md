# Plan 21 Performance Benchmarks

These benchmarks are manual tools, not part of `npm test`. They load the committed `dist/flex-horseshoe-card.js` bundle for each side of a comparison and use Chromium through Playwright. Do not build the product as part of a baseline run.

## Commands

Run all scenarios against the immutable Plan-21 baseline and a candidate bundle:

```sh
node tests/performance-plan21.mjs \
  --baseline=16692192a33dd3423387ea99087c7d4b9447d5f8 \
  --candidate=working \
  --scenario=P21-A,P21-B,P21-C,P21-D,P21-E,P21-F,P21-G,P21-H,P21-I \
  --output=tests/performance-results/plan21-comparison.json
```

`--baseline` defaults to the immutable SHA above. `--candidate` accepts a commit SHA or `working`; `working` reads the existing `dist/flex-horseshoe-card.js` and records `HEAD` plus whether the worktree is dirty. Each invocation measures both baseline and candidate. `--scenario` accepts one scenario or a comma-separated selection. `--output` is optional; without it, JSON is written to stdout.

The focused entry points use the same CLI and default to their workload groups:

```sh
node tests/performance-update.test.cjs --baseline=16692192a33dd3423387ea99087c7d4b9447d5f8 --candidate=working --scenario=P21-G,P21-H
node tests/performance-horseshoe.test.mjs --baseline=16692192a33dd3423387ea99087c7d4b9447d5f8 --candidate=working --scenario=P21-I
```

For a baseline-only comparison, set `--candidate` to the same immutable SHA. The output then contains baseline and candidate-role runs of the same bundle. Store the baseline-role measurements before product changes; do not relabel measurements from a working or moving branch as the baseline.

## Fixed Environment

Every scenario/build gets a fresh Chromium page and the same fixture values. The viewport is 1400 x 1000 CSS pixels at device scale factor 1. The page clock is fixed at `2026-09-27T12:00:00.000Z`; test updates advance it only where the historical update sequence did. The browser console and uncaught page errors are captured, and each run fails if errors occur or required fixture data does not settle.

Timing and operation counting use separate fresh pages for P21-A through P21-H. The timing pass leaves the measured methods unwrapped. The counter pass wraps required operations and reports counts separately; do not use counter-pass wall time as the timing result. P21-I measures direct owner calls and cache identities in its scenario page. Chromium CDP reports `ThreadTime`, `TaskDuration`, `ScriptDuration`, `LayoutDuration`, and `RecalcStyleDuration`; wall time is reported alongside them. These metrics are not additive, and nested User Timing phases must not be summed as CPU time.

Results include schema version, scenario, role, requested reference, resolved commit, bundle source, dirty-worktree state, browser and Node versions, viewport, card count, row count per card, bins/hour, warm-up and measured update counts, fixed input clock, timings, operation counters, settled state, and browser errors. Timings are evidence, not machine-independent thresholds. Operation counts are the more stable comparison.

## Scenarios

| Scenario | Fixed workload and expected observation |
| --- | --- |
| P21-A | 24 cards with static config receive a new `hass` object after only undeclared `sensor.noise` changes. Record `setHass`, entity/config/group/tool work, `requestUpdate`, and render counts. |
| P21-B | The same 24-card fixture has a JavaScript-backed fill template; only `sensor.noise` changes. The baseline records the existing unrelated-update JS/config route. A candidate bundle differing from baseline is checked for zero JS evaluations, entity-config evaluations, group updates, tool config passes, config invalidations, `requestUpdate`, and renders. |
| P21-C | 24 cards change their declared state from 20.1 to 21.1 with zero-decimal display. The visible text changes from `20` to `21`. |
| P21-D | 24 cards change from 20.1 to 20.4 with zero-decimal display and fixed paint. Visible text remains `20`; normal relevant-input work and render behavior are recorded. |
| P21-E | The same relevant 20.1 to 20.4 update evaluates a marked fill template whose result remains blue. The harness checks that no tool config invalidation is counted. |
| P21-F | The relevant update changes the template result from blue to red at 20.5 and displays `21`. The harness checks that config invalidation occurs. |
| P21-G | Historical Sparkline workload: 24 line-chart cards, a rolling 24-hour window, 800 rows per card, and 12 bins/hour. |
| P21-H | Heavy Sparkline workload: the same 24 cards and chart configuration, 20,160 rows per card across 14 days, and 12 bins/hour. |
| P21-I | Recovered three-gauge gradient/path fixture plus linear, spline, and ranked-state mapping cases. Measures numeric mapping, theme-only updates, gradient changes, and path animation sampling. |

P21-G and P21-H retain 7 warm-up updates and 15 measured updates per run. Their fixed update sequence starts with an irrelevant delivery and a same-state replacement, then sends the historical small numeric changes. The fake History API returns the same settled row array for each card; initial History requests and requests during the measured phase are reported separately. G uses the recovered 108-second row spacing; H uses 60-second spacing over 14 days.

P21-I retains the historical 40 warm-up updates and 5 repetitions of 200 updates for gradient and path-paint loops. The mapping matrix uses the same warm-up/measurement counts for linear numeric, spline numeric, and rank-state input. It records `GaugeScale`/`PathValueMapper` identity replacement/reuse and mapping-key changes along with direct `setState` wall timings and CDP CPU. The theme-only pass publishes the current mapping state to `hass` before changing only `themes.darkMode`, so it does not accidentally include state changes from the direct mapping loop. It records whether mapper, scale, path geometry, and path measurement owners are retained.

## Harness Adaptations

- The recovered update script's absolute Playwright path was replaced with the repository package import. Its historical version-label loop was replaced by explicit SHA/working bundle selection.
- The recovered horseshoe script was renamed from `.cjs` to `.mjs`, matching its ES-module imports. The fixture import is relative to `tests/`.
- Horseshoe paint reads use the current `gauge.paint.stateGradient` owner. SVG measurement hooks use `gauge.geometry.pathGeometry.pathElement`; the removed `getPathElement()` API is not used.
- The original three-gauge Horseshoe fixture is preserved for gradient and animation measurements. Linear, spline, and ranked-state mapping use three additional one-gauge cards in the same scenario page, so all mapping types have separately attributable CPU and operation evidence.
- Counter passes fail if required methods or fixture operations are missing. The presentation-diff method is reported only when present because Plan 21 intentionally removes that render-only API.

Keep the benchmark inputs, browser version, page size, update counts, and bundle references unchanged for comparisons. Record any future workload adaptation in this file and in the corresponding result metadata before comparing numbers.
