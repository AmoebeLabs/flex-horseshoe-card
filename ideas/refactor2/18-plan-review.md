# Plan 18 review — Sparkline configuration simplification

Reviewed against current master after Plan 17: `bcef58fab9d217f0c90114101d2d99f336983e06`

## Overall assessment

This Plan 18 is much better scoped than the earlier version.

The earlier proposal for atomic parent/series acceptance, keeping the last valid configuration, or adding a new recovery path has correctly been removed. That is important: Plan 18 should remain a simplification refactor and must not introduce a new Sparkline lifecycle or error model.

The current plan is close, but I would **not implement it yet**.

There are two important technical changes I recommend before execution, plus two smaller scope clarifications.

---

## 1. Keep `SparklineSeries.updateConfig()` as the owner of series configuration

This is the most important point.

The plan currently says:

> Move public series-schema and cross-series checks to the Sparkline configuration boundary after the same parent/override merge and paint precedence. Pass completed effective items to `SparklineSeries`; it retains identity, rows, graphs, bin layout, and request/data state without rechecking public YAML.

On current master, `SparklineSeries.updateConfig()` is already the natural owner of the series configuration process.

It currently owns:

- implicit versus explicit series construction;
- series ID validation;
- unique IDs;
- required `entity_index`;
- `y_axis_id`;
- series-period override restrictions;
- radial/cartesian relationship checks;
- parent/series chart-type relationship checks;
- series chart variant checks;
- parent + series deep merge;
- series-wide paint precedence;
- final effective item configuration;
- preserving existing items by ID;
- retaining rows, graph instances, request state and data state.

Those responsibilities are closely related.

Moving the configuration half into `SparklineGraphTool` would likely create this:

```text
GraphTool:
  inspect raw series
  validate raw series
  merge parent + override
  apply paint precedence
  validate effective series
  create completed series config

Series:
  receive completed series config
  find existing items
  preserve rows / graph / request state
```

That is more architecture, not less.

### Important technical detail

Not every rule can be validated only after parent + override merge.

For example, a series may only override the active period's `offset`.

This must remain invalid:

```yaml
series:
  - period:
      rolling_window:
        duration:
          hour: 12
```

After merging with the parent, the final effective config contains a perfectly normal duration. If validation only examines the merged result, the code can no longer determine that the series override illegally supplied `duration`.

The same applies to rules such as:

- series period may only override `offset`;
- series-owned `sparkline.radial` is forbidden because radial geometry belongs to the parent;
- explicit `id`;
- explicit `entity_index`;
- the wrong `seriesConfig.y_axis` form.

These are rules about the **raw series override**, not merely the completed effective config.

### Recommended plan wording

Replace the current step-2 direction with:

> `SparklineSeries.updateConfig()` remains the owner of effective series configuration. Validate restrictions that apply specifically to the raw series override before merging. Then merge parent + override, apply the existing paint precedence, and validate rules that apply to the completed effective series and relationships between series. Preserve existing item identity and runtime state by ID.

And:

> Simplify `SparklineSeries.updateConfig()` around that order. Do not move series configuration construction into `SparklineGraphTool` merely to create a separate boundary.

That keeps one owner and avoids creating another configuration layer.

---

## 2. Do not normalize numeric text just to remove downstream `Number(...)`

The plan currently says:

> Only a configured value whose current contract already accepts numeric text may be converted once to a number at the Sparkline configuration boundary.

That sounds reasonable, but for Sparkline it can change behavior.

Sparkline configuration objects are also used for change detection.

For example, `SparklineHistory` stores:

```js
JSON.stringify(item.config.period)
```

as a period signature.

That means:

```yaml
duration:
  hour: "24"
```

and:

```yaml
duration:
  hour: 24
```

are not necessarily identical for lifecycle/change-detection purposes, even though individual calculations may currently use:

```js
Number(...)
```

for both.

A JavaScript-backed field could also change from:

```text
"24"
```

to:

```text
24
```

Today that may count as a configuration/period change.

If Plan 18 converts both representations to `24` earlier, that distinction can disappear.

That would be a functional change.

### Recommended plan wording

Replace or qualify the numeric-normalization rule with:

> Do not normalize numeric text merely to remove downstream `Number(...)` calls. Move a conversion only when the current code already treats both representations identically across configuration comparison, History signatures, Series updates and graph calculations. Otherwise leave the conversion with its current consumer.

So the objective is not:

```text
remove Number()
```

The objective is:

```text
remove only proven duplicate conversion
```

---

## 3. Do not copy the Plan-17 theme-change pattern to Sparkline

The plan already partly recognizes this in section 5:

> Theme-selected color-stop scales may change active paint or geometry without being a new public configuration.

This should be stated more strongly in the implementation section.

For Controls, Plan 17 could often simplify:

```text
theme-only
→ no geometry/child recreation
```

Sparkline is different.

A theme change can select different color stops.

For real-time bar/equalizer graphs, those active color-stop scales can determine:

```text
y range
→ graph coordinates
→ geometry
```

So a Sparkline theme change can legitimately require graph configuration or geometry work even when public YAML did not change.

### Recommended plan wording

Add:

> Do not copy the Plan-17 control pattern to Sparkline. `themeModeChanged` may legitimately require graph configuration or geometry work when the active theme changes color-stop scales or other geometry inputs.

This prevents an over-aggressive replacement of broad change conditions without auditing what theme changes actually affect.

---

## 4. Make the three implementation stages optional and keep new tests focused

The plan currently says:

> Use three subissues with these independently checkable results.

That is more rigid than necessary.

Plan 17 showed that the actual implementation can become much smaller than originally expected after the code audit.

### Recommended wording

Use:

> The following are implementation stages, not a required number of issues or PRs. Split them only when the audited changes provide a useful independent ownership boundary.

The same applies to the regression section.

The list of behaviors to preserve is useful, but it should not become a requirement to create a new test matrix for every untouched Sparkline feature.

### Recommended test wording

Add:

> Existing tests provide regression coverage for untouched behavior. Add new permanent tests only for configuration processing or consumer checks that actually move, change triggering conditions, or disappear.

That keeps test growth proportional to the refactor.

---

## What is already good in the plan

The following parts should remain:

- explicit rejection of atomic parent/series acceptance;
- no last-valid-config state;
- no new pending/retry/recovery configuration lifecycle;
- `sourceConfig` remains the stable source;
- `this.config` remains the active tool config;
- no new public YAML;
- no new defaults;
- JavaScript remains on the existing BaseTool route;
- `undefined` is not globally treated as invalid;
- dynamic history duration continues through `periodDurationAvailable`;
- calendar-day minimum and warning preserve current behavior;
- History keeps HA row validation;
- History keeps stale-request, loading, timer and reconnect ownership;
- Graph keeps valid-input algorithmic guards;
- CSS/font/SVG conversions stay presentation-owned where appropriate;
- DOM pointer parsing stays pointer-owned;
- theme-selected color-stop scales remain runtime/theme behavior, not a new config error;
- no LOC target;
- no generic Sparkline validator framework;
- no attempt to make invalid JavaScript recoverable.

These boundaries are consistent with the simplification goal.

---

## Recommended revised Step 2

A safer Step 2 would be:

### Effective-series configuration

Keep `SparklineSeries.updateConfig()` as the owner of series configuration.

For each series:

1. validate rules that apply to the raw series override itself;
2. merge the parent configuration and the series override using the current merge behavior;
3. apply the current series-wide paint precedence;
4. validate rules that apply to the completed effective series;
5. validate relationships between the completed series collection;
6. reuse the existing item with the same ID so rows, Graph instances, request state and data state remain intact.

The implicit single series follows the same effective-config path while preserving the existing `default` ID and parent entity binding.

Remove checks from Graph/History consumers only when they duplicate a guarantee already established here. Do not move series configuration into GraphTool solely to create another boundary.

---

## Final assessment

The architecture and scope are now mostly correct.

Before implementation I would make these four changes:

1. keep `SparklineSeries.updateConfig()` as the owner of raw override → merge → paint precedence → effective series → preserved runtime item;
2. do not normalize numeric text unless lifecycle/change-detection behavior is proven identical;
3. explicitly warn that Sparkline theme changes may legitimately affect geometry and must not copy Plan 17 mechanically;
4. make issue splitting and new test creation proportional to the actual audited changes.

With those changes, Plan 18 is ready for implementation as a **behavior-preserving Sparkline simplification refactor**, rather than a new configuration architecture.
