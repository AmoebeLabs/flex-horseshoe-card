# Multiple Sparkline Series and Period Offsets

## Current Assessment

The feature remains feasible and can preserve existing single-series YAML. The
current code and mini-graph-card establish the intended architecture:

```text
SparklineGraphTool
        |
        v
SparklineSeries
        |
        v
SparklineGraph[]
```

From a helicopter view, `SparklineSeries` creates multiple existing
single-series graphs, supplies each graph with its own data and combines their
results in one drawing area:

```text
SparklineSeries
  |-- SparklineGraph[0] <- temperature history
  |-- SparklineGraph[1] <- humidity history
  `-- SparklineGraph[2] <- energy history
```

Lines and areas are drawn over each other. Bars receive a position and series
count so the existing engine places them beside each other in the same time
bucket.

The new layer coordinates engines; it does not replace the engine.
`SparklineGraph` remains the reusable single-series calculation core also
derived from the engine used by SAK. Existing bucketing, aggregation, smoothing,
geometry and visual behavior remain authoritative.

This is a large feature. History concurrency, calendar projection, shared axes
and mixed chart geometry are the primary risks.

## Goal and Configuration

Support multiple entities, mixed cartesian types, comparative periods, two
y-axes and per-series statistics in one sparkline.

Existing YAML stays valid:

```yaml
entity_index: source[0]
```

The config layer turns this into one implicit series. Runtime code has one
series pipeline, not separate legacy and multi-series paths.

Explicit series inherit top-level sparkline config:

```yaml
entity_index: temperature[0]

period:
  type: calendar
  calendar:
    period: day
    offset: 0
    duration: { hour: 24 }
    bins: { per_hour: 2 }

sparkline:
  show:
    chart_type: line

series:
  - id: temperature_today
    entity_index: temperature[0]
    color: '#42a5f5'

  - id: temperature_yesterday
    entity_index: temperature[0]
    color: '#9e9e9e'
    period:
      calendar:
        offset: -1

  - id: heating
    entity_index: heating[0]
    color: '#ef5350'
    sparkline:
      show:
        chart_type: bar
```

A series uses the same nested config shape as the existing tool. Initially only
the period offset can vary per series. Type, duration and bins define the shared
reference x-axis and remain global. Series IDs are required, unique and stable.
Nested `entity_index` values already fit CardConfig's recursive slot handling.

## Responsibility Summary

| Layer | Receives | Owns | Produces |
| --- | --- | --- | --- |
| `SparklineGraphTool` | FHS config, HA states and history | HA lifecycle, requests, Lit, locale and interaction | normalized histories and rendered SVG |
| `SparklineSeries` | effective series config and histories | engines, offsets, shared axes and type coordination | ordered geometry and graph-wide axes |
| `SparklineGraph` | one config and one flat history array | existing buckets, aggregation and geometry | one series' values, bounds, metadata and geometry |

```text
SparklineGraphTool supplies config and data and performs rendering.
SparklineSeries coordinates all series and controls the engines.
SparklineGraph calculates exactly one series.
```

## SparklineGraphTool

The tool remains the adapter between FHS, Home Assistant, Lit and the graph
domain. It:

- receives lifecycle and entity states;
- evaluates validated runtime config;
- executes HA history requests;
- tracks request, range, refresh and reconnect state per series;
- supplies config, histories, dimensions and margins;
- formats axis labels through the HA locale;
- renders geometry, grid, axes, tickmarks, labels and legends;
- handles pointers, tooltips and animation;
- publishes derived `fhs_sparkline.*` entities.

Only this layer knows Home Assistant and Lit. History request state remains
keyed by series ID in this layer because it is HA lifecycle state.

## SparklineSeries

The new coordination layer:

- owns one existing `SparklineGraph` per configured series;
- stores effective series config;
- calculates source and reference ranges for offsets;
- adds source and plot timestamps;
- feeds each engine one flat history array;
- collects raw min/max from all engines;
- calculates primary and secondary shared bounds;
- sends final bounds back to assigned engines;
- groups chart families such as visible bars;
- assigns bar `position` and `total`;
- exposes one shared x-axis and all y-axis models;
- collects geometry, bucket metadata and statistics per series.

It coordinates calculations but does not duplicate them:

```js
class SparklineSeries {
  constructor(config) {
    this.items = config.series.map((seriesConfig) => ({
      id: seriesConfig.id,
      config: seriesConfig,
      graph: new SparklineGraph(/* existing arguments */),
      geometry: {},
      stats: {},
    }));
  }
}
```

## SparklineGraph

The existing reusable engine remains single-series. It owns one flat history
array, bucketing, aggregates, min/max envelopes, smoothing, coordinates,
gradients, bucket metadata, statistics and chart geometry.

It knows nothing about HA, FHS, Lit, legends, source entities or sibling graphs.

Its API remains close to the current API:

```js
graph.update(history);
graph.setYAxisBounds(min, max);
graph.getPath();
graph.getArea(path);
graph.getPoints();
graph.getBars(position, total, columnSpacing, rowSpacing);
```

`setYAxisBounds()` is only a runtime entry point into the existing y-bound
model. `SparklineGraph` already supports exact `y_axis.lower_bound` and
`y_axis.upper_bound` values; the method must reuse that same min/max and axis-
geometry path rather than introduce another range mechanism. Configured bounds
and shared bounds therefore end as the same engine input. The method is also
useful to SAK.

## Processing Flow

```text
Validated FHS config
  -> Tool builds effective series config
  -> Series creates one Graph per series
  -> Tool fetches missing HA history per series
  -> Series adds source_time and plot_time
  -> Every Graph calculates buckets and raw bounds
  -> Series calculates shared axis bounds
  -> Every Graph creates geometry with final bounds
  -> Tool renders geometry and graph-wide layers
```

The series calculation has two phases:

```js
update(histories) {
  this.items.forEach((item) => {
    item.graph.update(histories.get(item.id));
  });

  this.calculateSharedYAxisBounds();
  this.buildSeriesGeometry();
}
```

This preserves the existing engine flow:

```text
history -> buckets -> aggregation -> coordinates -> chart geometry
```

There is no second multi-series calculation path.

## Shared Axes

The series layer overlays independently calculated graphs in one draw area and
therefore coordinates their axes.

All series share the reference period, bins, dimensions and projected
`plot_time` positions. This yields matching x coordinates. The series layer
exposes one canonical x-axis.

Each engine first calculates its own y range:

```text
Series A: min 10, max 25
Series B: min  5, max 40
Primary:  min  5, max 40
```

The coordinator returns `5..40` to both engines so equal y positions represent
equal values:

```js
const min = Math.min(...primaryItems.map((item) => item.graph.min));
const max = Math.max(...primaryItems.map((item) => item.graph.max));

primaryItems.forEach((item) => {
  item.graph.setYAxisBounds(min, max);
});
```

Primary and secondary groups repeat this independently. Initially, visible axes
are limited to these two.

## Axes, Grid, Labels and Margins

| Concern | Current owner | Multi-series owner |
| --- | --- | --- |
| Buckets and one series' range | `SparklineGraph` | Each `SparklineGraph` |
| Shared x-axis | Implicitly one engine | `SparklineSeries` |
| Combined y ranges | Not present | `SparklineSeries` |
| Numeric ticks and positions | `SparklineGraph` | Engine API coordinated by Series |
| Locale label formatting | `SparklineGraphTool` | Tool |
| Label-size margins | `SparklineGraphTool` | Tool |
| SVG axis, grid and ticks | `SparklineGraphTool` | Tool |
| SVG chart rendering | Tool renders engine output | Tool |

The grid renders once: shared x-grid, primary y-grid, and secondary labels and
ticks on the opposite side. A secondary grid is not drawn unless explicitly
designed later.

Engines expose values and SVG positions:

```js
{ value: 20, y: 42 }
{ timestamp: 1787227200000, x: 135 }
```

The tool formats those values through HA and owns margins because space depends
on the actual text, fonts, offsets, ticks and visible axes.

The existing two-pass flow remains:

```text
1. Engines calculate provisional axes
2. Tool formats labels and measures the outer axis margins
3. Chart geometry contributes to the configured graph margin
4. Engines receive the final axis area and data area
5. Series calculates final axes and geometry
6. Tool renders all layers
```

The existing sparkline `margin` keeps its original meaning: space around the
rendered graph data. Axes introduced later must not consume or redefine that
margin. The geometry therefore uses two nested regions inside `graphArea`:

```text
axisArea
|-- axes and full grid
`-- effective margin
    `-- dataArea: line, area, dots and bars
```

The effective margin is calculated once before final geometry:

```js
effectiveMargin = configuredMargin + chartGeometryMargin;
```

`configuredMargin` is the existing user configuration. `chartGeometryMargin`
is space inherently required by the selected chart geometry. Bars, for
example, require half of the outer bar band at both ends of the x-range so the
first and last bars remain inside the y-axis and right graph boundary.

Once combined, every later calculation receives only `effectiveMargin`.
Axes, grid, labels, tooltips and renderers must not contain separate bar
branches or apply another correction. Their shared x-scale already accounts
for the total margin:

```text
axisArea start
| configured margin
| half outer bar band
| bar centres and grouped bars
| half outer bar band
| configured margin
axisArea end
```

For grouped bars, the automatic contribution uses half of the complete outer
bar group, not half of one bar. The x-axis line may still span the complete
`axisArea`; its grid, ticks, labels and hit coordinates use the shared scale
derived from `dataArea`.

Dots use the same contract without requiring dot-specific logic downstream. A
dot contributes its visible radius to the left, right, top and bottom geometry
margins. When the dot has a stroke, half of that stroke width is added as well:

```js
const dotExtent = radius + strokeWidth / 2;
chartGeometryMargin = {
  l: dotExtent,
  r: dotExtent,
  t: dotExtent,
  b: dotExtent,
};
```

The complete horizontal space reserved for an edge dot is therefore twice its
extent: one extent at the start and one at the end. This keeps circles inside
the graph bounds and prevents them from being clipped or drawn across an axis.

The result is one geometry contract for every layer:

```text
axisArea = graphArea minus measured label and tick space
dataArea = axisArea minus effectiveMargin
```

The engine may calculate a different geometry contribution for another chart
family, but that distinction ends when `effectiveMargin` has been produced.
Downstream code treats a margin as a margin.

## Legend and Graph Layout

The legend and graph are separate sibling regions. A legend is not an axis
margin and must never be inserted into the engine's margin model:

```text
SparklineGraphTool
  |-- legendArea
  `-- graphArea
       `-- measured label and tick space
            `-- axisArea
                 `-- effective margin
                      `-- dataArea
```

For a legend above the graph, the layout is:

```text
+-----------------------------------+
| legendArea                        |
+-----------------------------------+
| gap                               |
+-----------------------------------+
| graphArea                         |
|  +-----------------------------+  |
|  | label and tick space        |  |
|  |  +-----------------------+  |  |
|  |  | axisArea              |  |  |
|  |  |  +-----------------+  |  |  |
|  |  |  | effective margin|  |  |  |
|  |  |  |  +-----------+  |  |  |  |
|  |  |  |  | dataArea  |  |  |  |  |
|  |  |  |  +-----------+  |  |  |  |
|  |  |  +-----------------+  |  |  |
|  |  +-----------------------+  |  |
|  +-----------------------------+  |
+-----------------------------------+
```

The configured sparkline `width` and `height` describe the complete outer
tool bounds. Without a legend, `graphArea` occupies those complete bounds.
With a legend, the tool divides the same bounds into two independent regions:

```js
this.legendArea = {
  x: 0,
  y: 0,
  width: this.svg.width,
  height: legendHeight,
};

this.graphArea = {
  x: 0,
  y: legendHeight + legendGap,
  width: this.svg.width,
  height: this.svg.height - legendHeight - legendGap,
};
```

The series coordinator and graph engines receive only `graphArea`. Existing
axis-margin calculation then runs inside that region. The tool renders graph
output in a translated SVG group and renders the legend in its own group:

```html
<g transform="translate(graphArea.x graphArea.y)">
  <!-- grid, axes and all series -->
</g>

<g transform="translate(legendArea.x legendArea.y)">
  <!-- legend items -->
</g>
```

The same division applies to `bottom`, `left` and `right` positions.
Top and bottom legends normally lay out items horizontally; left and right
legends normally lay them out vertically.

| Layout concern | Owner |
| --- | --- |
| Divide outer bounds into legendArea and graphArea | `SparklineGraphTool` |
| Supply ordered legend metadata | `SparklineSeries` |
| Render legend SVG | `SparklineGraphTool` |
| Coordinate axes inside graphArea | `SparklineSeries` |
| Calculate chart geometry margin | `SparklineGraph[]` |
| Combine configured and chart geometry margins | `SparklineSeries` |
| Calculate data geometry inside dataArea | `SparklineGraph[]` |
| Calculate label and tick space around axisArea | `SparklineGraphTool` |

This guarantees:

```text
legendArea intersect graphArea = empty
```

Only a future explicitly configured overlay mode may place a legend over graph
geometry. It is not the default layout.


## Mixed Types and Bars

The engine already exposes `getBars(position, total)`. FHS currently hardcodes
`index = 0` and `total = 1`. Series replaces that coordination:

```js
const bars = this.items.filter(
  (item) => item.config.sparkline.show.chart_type === 'bar',
);

bars.forEach((item, position) => {
  item.geometry.bars = item.graph.getBars(
    position,
    bars.length,
    columnSpacing,
    rowSpacing,
  );
});
```

A line does not reduce bar width. The engine remains responsible for actual bar
coordinates; Series supplies only group position and size.

Phase one supports cartesian `line`, `area`, `dots` and `bar`.
Specialized families require explicit compatibility decisions and validation.

## Comparison with mini-graph-card

mini-graph-card creates one single-series `Graph` per entity:

```js
this.Graph = this.config.entities.map(
  (entity) => new Graph(/* entity settings */),
);
```

It fetches histories and updates each graph independently:

```js
await Promise.all(
  this.entity.map((entity, index) =>
    this.updateEntity(entity, index, start, end),
  ),
);

this.entity.forEach((entity, index) => {
  if (entity) this.Graph[index].update();
});
```

Its card combines primary and secondary bounds and returns them to each graph.
It coordinates bar positions while `Graph.getBars(position, total)` performs
the geometry.

This validates one engine per series, shared bounds above the engines, reuse of
`getBars()`, and one rendering of graph-wide axes and labels.

mini-graph-card keeps coordination in its card because one global graph type
applies to all entities. FHS wants mixed types. FHS therefore extracts the same
proven coordination into `SparklineSeries` instead of expanding the already
large tool.

## Period Offsets

The global period is the visible reference x-axis. Each series calculates a
source range from that reference range and its offset.

All normalized rows contain both timestamps:

```js
{
  state: 24.3,
  haState: '24.3',
  source_time: '2026-08-19T14:00:00Z',
  plot_time: '2026-08-20T14:00:00Z',
}
```

The engine uses `plot_time`; statistics and tooltips can use `source_time`.
Do not overwrite source timestamps or add runtime timestamp fallbacks.

Range calculation returns:

```js
{ sourceStart, sourceEnd, plotStart, plotEnd }
```

Calendar offsets use local boundaries because days can contain 23 or 25 hours.
Rolling offsets use signed whole-day differences of 24 hours each.

Completed historical ranges are static after a successful fetch. Active ranges
receive entity states and may resynchronize. Static status follows concrete
source boundaries, not only `calendar.offset < 0`.

Promise, accepted range, source ID and stale-response checks are per series.
Reference bucket and calendar timers can remain graph-wide.

## Tooltips, Colors and Derived Entities

A pointer selects one shared plot bucket. The tooltip can show every series and
retain source dates:

```text
Today       24.3 C   20 Aug 14:00
Yesterday   22.8 C   19 Aug 14:00
```

Fixed colors give stable series identity. Color stops can remain possible, but
a varying series needs an explicit legend identity color. The tool renders the
legend from ordered metadata supplied by Series.

Existing derived IDs remain unchanged:

```text
fhs_sparkline.climate_min
fhs_sparkline.climate_avg
```

Explicit series add their stable ID:

```text
fhs_sparkline.climate_today_min
fhs_sparkline.climate_yesterday_avg
```

CardEntities matches configured sparkline and series IDs directly rather than
splitting arbitrary underscore-delimited IDs.

## Backward Compatibility

A config without `series:` becomes conceptually:

```yaml
series:
  - id: default
    entity_index: source[0]
```

This normalization occurs once in config construction. Runtime layers receive a
complete list without missing-config fallbacks or parallel legacy paths.

## Source Impact

| Module | Expected impact |
| --- | --- |
| `sparkline-graph-tool.js` | Large: history lifecycle, rendering iteration, tooltip and graph-wide layers |
| `sparkline-series.js` | New: offsets, engine coordination, axes and grouped types |
| `sparkline-graph.js` | Small to medium: external bounds and timestamp contract |
| `card-tools.js` | Small: assign all series source entities |
| `card-entities.js` | Medium: series-specific derived states |
| `card-config.js` | Small: series validation |
| tests and showcases | Large |

## Incremental Implementation Plan

Every phase is independently testable and leaves the card usable. A new public
configuration option is enabled only in the phase that completes its config,
data, geometry, rendering and lifecycle behavior. No phase may depend on a
half-working public feature from the following phase.

| Phase | Completed capability | Existing cards | New capability usable after phase |
| --- | --- | --- | --- |
| 1 | Characterization tests | Unchanged and usable | None; current behavior is locked down |
| 2 | Axis/data geometry and effective margins | Unchanged and usable | Correct bar and dot edge geometry |
| 3 | Single-series coordinator | Unchanged and usable | None; architecture changes without public behavior |
| 4 | Multiple series on one y-axis | Unchanged and usable | Line, area and dots series |
| 5 | Mixed types and grouped bars | Unchanged and usable | Line/area/dots/bar combinations |
| 6 | Per-series period offsets | Unchanged and usable | Today/yesterday and relative rolling comparisons |
| 7 | Primary and secondary y-axes | Unchanged and usable | Independent left and right scales |
| 8 | Legend, derived entities and final showcase | Unchanged and usable | Complete documented feature |

Each phase ends with the full automated suite, a production build and the
relevant interactive showcase. A phase is not complete merely because its unit
tests pass; the existing showcase cards must still render and update normally.

### Phase 1: Lock Down Existing Behavior

Add characterization tests around the current single-series pipeline before
moving responsibilities:

- history normalization and bucketing;
- automatic and configured y-bounds;
- x/y tick values and positions;
- line, area, dots and bar geometry;
- positive, negative and crossing-zero bars;
- smoothing, fill and min/max envelopes;
- statistics and existing derived entity IDs;
- active and completed history refresh behavior.

No production behavior changes. The card remains exactly as usable as before.
These tests form the regression boundary for all following phases.

### Phase 2: Establish the Geometry Contract

Separate the geometry concepts already needed by the current single-series
card:

```text
graphArea
  -> measured label and tick space
  -> axisArea
  -> configured margin + chart geometry margin
  -> dataArea
```

Restore the existing `margin` meaning as space around graph data. Calculate one
`effectiveMargin` before final geometry. Bars contribute their outer half-band
and dots contribute radius plus half their stroke width. All downstream layers
receive the same final areas and contain no chart-specific corrections.

Tests prove that axes and grid retain their complete extent while bars and dots
remain inside them. Existing line and area coordinates must remain unchanged
when their effective margin does not change. The card remains fully usable and
this phase fixes the existing edge-overlap behavior independently of multiple
series.

### Phase 3: Introduce SparklineSeries with One Implicit Series

Normalize every existing config once into one internal series:

```yaml
series:
  - id: default
    entity_index: source[0]
```

Add `SparklineSeries`, but allow exactly one internal item in this phase. Move
engine ownership and coordination into it while leaving history fetching,
rendering and public YAML behavior unchanged.

Parity tests compare the old expected geometry, axes, statistics and IDs with
the coordinator output. Existing YAML and showcases must produce identical
results. The card remains fully usable; explicit multi-series YAML is not yet a
public capability.

### Phase 4: Add Multiple Series on One Shared Y-Axis

Enable explicit `series:` config for cartesian `line`, `area` and `dots`. The
tool fetches and owns request state per series. The coordinator:

- creates one existing graph engine per series;
- collects every raw range;
- calculates one shared primary range;
- applies that range through the existing y-bound path;
- exposes one canonical x-axis;
- returns ordered geometry and tooltip metadata.

Tests cover two and three series, repeated use of one source entity, independent
aggregate functions, empty history, out-of-order fetch completion, runtime
source changes and tooltip identity. Existing single-series cards continue
through the same coordinator. After this phase, same-axis multi-series charts
are complete and usable.

### Phase 5: Add Mixed Types and Grouped Bars

Enable `bar` in explicit series and permit supported cartesian types to share
one graph. Series selects the visible bar items, assigns `position` and `total`,
and passes those values to the existing engine bar API. Non-bar and hidden
series never consume a bar position.

The effective geometry margin is recalculated from the complete outer bar
group before final axes and geometry. Tests cover:

- line plus bar alignment;
- two and three bars beside each other;
- bar spacing and configured graph margin;
- positive, negative and crossing-zero groups;
- first and last groups staying inside both graph boundaries;
- dots and bars contributing the correct combined geometry margin.

After this phase, mixed charts and grouped bars are complete and usable.

### Phase 6: Add Per-Series Period Offsets

Add `source_time` and `plot_time` to normalized rows. Fetch source ranges per
series, retain the real timestamp for tooltips and project only plotting time
onto the shared reference period.

Support calendar and rolling offsets under their existing period semantics.
Completed historical ranges fetch once; active ranges continue receiving
current state and boundary updates.

Tests cover today versus yesterday, the same weekday one week earlier, rolling
range offsets, month/year boundaries, 23-hour and 25-hour days, stale responses
and source dates in tooltips. After this phase, period comparisons are complete
and usable without affecting zero-offset series.

### Phase 7: Add Primary and Secondary Y-Axes

Add validated per-series axis assignment. Missing assignment is normalized to
`primary`; explicit secondary series use `y_axis_id: secondary`. Series splits
items into two groups and independently calculates and applies bounds:

```text
primary series   -> shared bounds -> left axis
secondary series -> shared bounds -> right axis
```

Both groups retain the shared x-axis. The tool renders the primary grid once,
primary labels and ticks on the left, and secondary labels and ticks on the
right. Existing configured lower and upper bounds feed the same engine-bound
path as automatically combined bounds.

Tests cover independent ranges, configured bounds, different units, label
margins on both sides, hidden axes and series moving between groups at runtime.
After this phase, two-axis charts are complete and usable.

### Phase 8: Complete Presentation and Public Integration

Add the remaining user-facing integration:

- legend layout in its own sibling area;
- stable colors and ordered series metadata;
- per-series current values in legends and tooltips;
- series-specific min/avg/max/time derived entities;
- documentation, migration examples and config reference;
- an interactive showcase covering the supported combinations.

Compatibility tests retain existing derived IDs for implicit single-series
cards. Explicit series use stable IDs in their derived entity names. Legend
positions are tested without changing graph or axis geometry. At the end of
this phase the complete feature described by this document is public and
usable.

### Phase Gate

Every phase must satisfy all of these conditions before the next begins:

1. Existing single-series tests remain green.
2. New unit and integration tests for that phase are green.
3. Existing showcase cards render, update and fetch history normally.
4. The new capability introduced by that phase works in its showcase.
5. `npm run build` succeeds without new warnings.
6. No temporary runtime fallback, duplicate legacy path or disabled validation
   remains for a later phase.

## Issue and Branch Strategy

Use one parent issue as the feature epic. Its acceptance criteria describe the
complete capability and its checklist links the eight phase issues from the
incremental implementation plan.

The parent issue owns one long-lived integration branch:

```text
<parent-issue>-sparkline-multiple-series
```

Each phase gets its own subissue and branch. A phase branch is always created
from the latest integration branch, and its pull request targets that
integration branch:

```text
master
  `-- integration branch for parent issue
        |-- phase 1 branch -> PR to integration
        |-- phase 2 branch -> PR to integration
        |-- phase 3 branch -> PR to integration
        `-- ...
```

The sequence for every phase is:

1. Complete and merge the previous phase into the integration branch.
2. Run the phase gate on the integration branch.
3. Create the next phase branch from that verified integration state.
4. Implement only the next phase and its tests or showcase changes.
5. Open the phase PR with the integration branch as its base.
6. Merge only after that phase independently satisfies its phase gate.

Phase branches are sequential rather than parallel because later phases depend
on the tested architecture produced by earlier phases. Git branches have no
formal parent/child relationship; the PR base and linked GitHub subissues make
that relationship explicit.

A draft PR from the integration branch to `master` may remain open to show the
complete accumulated diff and test status. It must not be merged until:

- all eight subissues are complete;
- every phase PR is merged into the integration branch;
- the complete automated test suite and production build pass there;
- all existing and new showcase cards have been checked together;
- the parent issue acceptance criteria are satisfied;
- no temporary compatibility path, disabled validation or follow-up required
  for basic operation remains.

Only the final parent PR merges the integration branch into `master`. This keeps
`master` on the current working implementation until the complete multi-series
feature is usable, while preserving small reviewable and testable phase PRs.
Changes made to `master` during development are merged into the integration
branch and verified there before the next phase branch is created.

## Required Tests

### Compatibility

- Existing config produces identical geometry.
- Existing derived IDs and values remain unchanged.
- Existing refresh and reconnect behavior remains unchanged.

### Axes and Geometry

- Two lines share one x-axis and y-axis.
- Primary and secondary groups have independent bounds.
- Empty history in one series does not invalidate another.
- A runtime source change invalidates only its own series.
- Line plus bar uses aligned buckets.
- Two bars render beside each other.
- Lines and hidden bars do not count towards bar `total`.
- Positive, negative and crossing-zero bars use the correct baseline.
- Current smoothing, fill and envelope behavior remains identical.

### Offsets and Lifecycle

- Offset zero preserves source and plot times.
- Yesterday aligns to today's local clock.
- Rolling offsets align by elapsed range difference.
- Tooltips retain source dates.
- Completed ranges fetch once; active ranges receive updates.
- 23-hour and 25-hour days remain bounded.
- Concurrent requests can complete in any order.
- A stale response invalidates only its own series.
- Accepted history requests a render immediately.

### Visual Showcases

- multiple temperature lines;
- today versus yesterday;
- PV bars with an irradiance line;
- primary and secondary y-axis;
- grouped positive and negative bars;
- locale and theme changes with multiple visible series.

## Final Architectural Rule

```text
SparklineGraphTool handles FHS, Home Assistant and Lit.
SparklineSeries coordinates multiple graph engines.
SparklineGraph calculates exactly one series.
```

Every lower layer receives complete, validated input from the layer above.
Missing config is handled once during construction, not through runtime
fallbacks spread across the engine.
