# Plan 18B — Plan Review

**Plan:** 18B — Sparkline Canonical Series and Runtime Architecture  
**Reviewed baseline:** `f960daf78abd605604a81e5d2fef03efecaf8466`  
**Review type:** Pre-implementation architecture and execution-plan review  
**Date:** 2026-10-03

## Review status

```text
BLOCKING: 0
REWORK:   0
ADAPT:    3
```

The overall architecture is sound. The canonical-series cutover, Series/History/Graph ownership boundaries and configuration route match the current code and should remain.

Three plan details should be made explicit before implementation so the execution does not accidentally move calculation geometry into GraphTool, consume unresolved dynamic Sparkline config too early, or leave the new canonical `series[]` contract inconsistent with the general JavaScript rule.

---

# 1. Overall assessment

The central 18B invariant is correct:

```text
sourceConfig
→ JavaScript evaluation
→ local newConfig
→ Sparkline translation / validation / completion
→ this.config
→ Series / History / Graph domain consumers
```

At the operational boundary:

```text
this.config.series[]
```

should be the only complete series configuration.

The current implementation justifies this change directly:

```text
GraphTool constructor
→ completes parent defaults / legacy forms / styles

Series.updateConfig()
→ validates raw series overrides
→ generates implicit series
→ merges parent + series again
→ applies selector/style priority
→ stores another effective item.config
```

18B correctly removes the second configuration-building route rather than merely renaming it.

The plan is also correct to preserve:

- public YAML;
- implicit versus explicit-series behavior;
- existing JavaScript context;
- history request semantics;
- row/data reuse;
- Graph calculation behavior;
- pointer/tooltip/legend behavior;
- the existing BaseTool 16C publication route;
- the Plan-19 color-stop owner cutover boundary.

No new validation framework, recovery layer or general Sparkline state machine is needed.

---

# ADAPT 1 — Separate GraphTool geometry from SparklineGraph calculation geometry explicitly

## Finding

The plan says that `Graph` retains its calculation input, processing state and geometry.

That is correct.

However, the GraphTool ownership table currently describes `geometry` broadly enough to include:

```text
path / point / bar geometry
```

while the domain-owner row also says Graph retains calculation results.

That boundary is ambiguous.

The current code shows that `SparklineGraph` itself owns genuine graph calculation geometry, including for example:

```text
coords
graphArea
axisArea
dataArea
drawArea
geometryInputSignature
geometryResultSignature
shared Y-axis geometry
graded geometry
bar/point coordinate calculations
```

`SparklineSeries` also coordinates shared graph layout such as bar positions and shared axis ranges.

Those results should not move into `GraphTool.geometry` merely because 18B is introducing a normal Tool-level geometry owner.

## Required plan clarification

Use a boundary such as:

```text
GraphTool.geometry
→ tool/SVG placement and dimensions
→ shared plot / axis margins owned by the tool
→ legend layout and measurement
→ GraphTool-owned renderer/path caches
→ animation/presentation geometry
→ geometry invalidation state owned by GraphTool

SparklineGraph
→ graph calculation geometry
→ coords
→ graph/data/axis/draw areas
→ graph geometry signatures
→ graph-family coordinate calculations
→ graded/bar/point geometry produced by the graph engine

SparklineSeries
→ shared series layout coordination
→ shared axis-range coordination
→ bar position/total coordination
```

No Tool-style wrapper should be introduced around Graph for symmetry.

## Grade ranges need the same clarification

The current owner table mentions:

```text
derived grade presentation/ranges
```

under paint.

That is too broad.

`SparklineGraph.getGrades()` uses `gradeRanks[].rangeMin` and `rangeMax` directly to calculate graded geometry.

Therefore the plan should explicitly split:

```text
calculation / Graph input:
- numeric grade boundaries
- rank ranges
- numeric mapping needed for geometry

paint:
- grade colors
- retained visual presentation
```

This already matches the later plan text that says numeric grade boundaries remain calculation input; the ownership table should say the same thing unambiguously.

## Disposition

```text
ADAPT
```

No architecture change is required. The plan only needs a sharper ownership boundary.

---

# ADAPT 2 — Define the pre-first-publication lifecycle for dynamic Sparklines

## Finding

The plan correctly states:

```text
Do not instantiate configuration-consuming Series/Graph processing
from unresolved values.

Use the existing activeConfigInitialized lifecycle signal.
Do not introduce another pending/accepted configuration state.
```

That is the right rule.

The current `SparklineGraphTool` constructor, however, creates configuration consumers immediately:

```js
this.sparklineSeries = new SparklineSeries(this.config);

this.sparklineHistory = new SparklineHistory(
  this.config.period,
  ...
);
```

and current lifecycle/presentation methods assume these owners exist:

```text
renderSvg()
→ sparklineSeries.dataState

hasPresentationChanged()
→ sparklineSeries.items

connected()
→ sparklineHistory.connected()

disconnected()
→ sparklineHistory.disconnected()

hassConnected()
→ connected()

requiresHassUpdate()
→ sparklineHistory.requiresHassUpdate()
```

Once 18B stops constructing Series/History from unresolved dynamic Sparkline config, there can be a legitimate interval between tool construction and first completed runtime configuration.

The plan currently describes the rule but does not state exactly how that interval remains safe.

## Required plan clarification

Choose one bounded implementation shape:

```text
A. construct only non-config-consuming empty owners
```

or:

```text
B. defer Series / History creation until first complete config publication
   and make pre-first-publication render/lifecycle tolerate their absence
   through the existing activeConfigInitialized signal
```

Do not add a new:

```text
ready
accepted
pending
candidate
```

state.

The implementation must still preserve the current card lifecycle ordering:

```text
source entities available
→ updateSparklineRuntimeConfig()
→ Sparkline current config is complete
→ bind Sparkline source entities
→ publish fhs_sparkline.* derived entities
→ update presentation consumers
```

## Required regression test

Add an explicit case:

```text
dynamic Sparkline constructed
→ unresolved selector / period / series source still present
→ render or presentation lifecycle may run before first publication
→ no Series/History/Graph consumes unresolved config
→ no crash
→ first updateRuntimeConfig publishes complete config
→ owners become usable from that config
```

Also cover connection/disconnection if the selected implementation can encounter those methods before first publication.

## Disposition

```text
ADAPT
```

This is the same lifecycle class that was made explicit for dynamic Controls in 17B. No new architecture is needed.

---

# ADAPT 3 — Make whole-value JavaScript for `series` an explicit 18B contract and test

## Finding

The plan correctly establishes the general FHS rule:

```text
ordinary configuration values
→ static
or
→ JavaScript resolving to the same accepted value/shape
```

and explicitly says that a schema omission does not make an ordinary field static.

That rule should be made concrete for the most important new canonical field in 18B:

```yaml
series: |
  [[[ return [
    {
      id: "temperature",
      entity_index: 1,
      sparkline: {
        show: {
          chart_type: "line"
        }
      }
    }
  ]; ]]]
```

The current public Sparkline schema still describes `series` as:

```yaml
series:
  type: array
```

while the current runtime also assumes a concrete array before Series processing.

18B is exactly the change that can make this consistent:

```text
source series value
→ evaluate once in outer Sparkline item context
→ resulting array becomes raw series translation input
→ validate explicit restrictions
→ inherit parent once
→ publish complete this.config.series[]
```

## Required plan clarification

Add an explicit test and schema task for:

```text
static series array
versus
whole-value JavaScript returning the same array
```

They must converge to the same canonical configuration.

Required assertions:

```text
- sourceConfig retains the original JavaScript expression;
- the expression executes once per owning configuration pass;
- evaluation uses the existing outer Sparkline item/entity context;
- no per-series re-evaluation is introduced;
- resulting raw series entries are validated before inheritance;
- final this.config.series[] entries are complete;
- Series receives canonical entries and performs no inheritance repair;
- static and equivalent JavaScript forms produce the same effective result.
```

Where the general FHS JS contract applies, align the directly affected schema locally:

```text
series:
→ array
or
→ common.javascript
```

Do not redesign the Sparkline schema beyond directly affected inconsistencies.

## Disposition

```text
ADAPT
```

This makes an existing plan principle explicit at the central 18B boundary.

---

# KEEP — Canonical series cutover

The central translation sequence should remain:

```text
evaluated public Sparkline input
→ complete parent legacy/default/style/period/axis config
→ inspect evaluated raw series overrides
→ validate restrictions that depend on explicit source fields
→ inherit parent once per series
→ apply existing selector/style precedence
→ validate complete series/shared restrictions
→ finish context-dependent publication fields
→ publish this.config with complete series[]
```

This ordering is important.

In particular, raw explicit-series restrictions must still be checked before parent inheritance erases the distinction between:

```text
field explicitly supplied by a series
```

and:

```text
field merely inherited from the parent
```

---

# KEEP — Preserve implicit versus explicit semantics

Canonical internal series must not make all public input behave as though the user authored explicit series.

This distinction must remain available during translation.

For example:

```text
implicit barcode / state_bands / other supported parent graph
```

must not suddenly fail explicit-series chart restrictions solely because final internal config now always contains:

```text
series[]
```

After translation, the distinction may disappear if no runtime consumer still requires it.

`hasExplicitSeries` should be removed from production runtime only after characterization proves it has no remaining role.

---

# KEEP — Series becomes a runtime consumer

`SparklineSeries.updateConfig()` currently performs general configuration work:

```text
- implicit series creation
- raw validation
- parent inheritance
- selector/style priority completion
- effective config construction
```

18B should remove that role.

After the cutover:

```text
Series
→ receives canonical config.series[] entries
→ reuses runtime items by stable series ID
→ stores current entity/entityConfig
→ owns rows/request/data state
→ owns graph instances
→ owns shared bin-plan coordination
→ owns shared series layout coordination
```

A runtime item's config should reference the corresponding canonical entry.

It should not:

```text
clone
re-merge
repair
complete
```

that entry.

---

# KEEP — Implicit series belongs in current config, not sourceConfig

For public YAML without `series`, translation should create:

```text
this.config.series = [
  {
    id: "default",
    ...
  }
]
```

The implicit internal series must not be written into `sourceConfig`.

That preserves template-visible public source semantics while giving runtime domains one canonical shape.

---

# KEEP — Existing JavaScript context

Nested series expressions currently run through the outer Sparkline template context.

18B should preserve that behavior.

Do not reinterpret:

```text
series[].some_template
```

as automatically meaning:

```text
entity = that series' entity_index
```

unless that is already the current contract for that expression.

In particular:

```text
parent expression inherited by N series
```

must not be evaluated N times.

The plan is correct to evaluate parent-owned source once and use the resulting values during canonical inheritance.

---

# KEEP — Automatic binning remains runtime calculation output

Keep:

```yaml
bins:
  per_hour: auto
```

as authored/current configuration.

Do not replace canonical configuration with the calculated numeric density.

The numeric result belongs to:

```text
SparklineSeries.binPlan
→ SparklineGraph input
```

This preserves configuration semantics while still allowing resize/density changes to recalculate bin layout without rewriting config.

---

# KEEP — History is an input/data owner, not a config owner

The planned rename is appropriate:

```text
SparklineHistory.updateConfig()
→ updateInputs()
```

The method receives current inputs but does not own general Sparkline configuration.

Keep History ownership of:

```text
source rows
prepared rows
source ranges
request state
timers
retry state
request-number stale protection
period signatures
day/night history
range reuse
incremental row publication
```

Do not move those into GraphTool runtime for architectural symmetry.

---

# KEEP — Graph input rename is mechanical and bounded

The following rename is appropriate:

```text
buildGraphConfig()
→ buildGraphInput()

updateGraphConfig()
→ updateGraphInput()

SparklineGraph.config
→ SparklineGraph.input

graphConfig locals/parameters
→ graphInput

rebuildGraphConfig
→ rebuildGraphInput
```

`SparklineGraph` does not own public FHS configuration.

It owns calculation input plus graph processing/data/geometry state.

The unused parent GraphTool `graphConfig` should be removed rather than renamed into another unused owner.

No graph formula changes belong in this step.

---

# KEEP — `geometry.svg` replaces both SVG aliases

18B should remove:

```text
this.svg
this.config.svg
```

as parallel owners and use:

```text
this.geometry.svg
```

for GraphTool-owned SVG placement/dimensions.

All real consumers must be updated.

Do not leave a compatibility copy in `config.svg`.

This includes generated Sparkline consumers inside Controls, legend/tooltip children and other internal consumers.

---

# KEEP — Color-stop cutover remains Plan 19

Do not pull the shared active color-stop ownership redesign forward.

18B may perform the minimum existing pre-publication synchronization needed to preserve current Sparkline behavior, but the atomic owner cutover remains Plan 19.

Theme/palette changes must not repeat the general parent/series inheritance route.

When validating paint-only reuse, distinguish pure presentation changes from numeric color-stop/rank inputs that actually affect Graph calculation geometry.

---

# KEEP — Change detection remains owner-specific

Do not simplify every signature into one general config signature.

Keep signatures that distinguish real expensive work:

```text
history inputs
data processing
bin plan
graph geometry
locale
legend measurement
pointer source
paint/presentation
```

The important guarantee remains:

```text
unrelated HA update
→ no history request
→ no full history traversal
→ no unnecessary bin processing
→ no unnecessary geometry rebuild
```

Likewise:

```text
pure paint change
→ no data/statistics/path recalculation
```

where the changed values truly are paint-only.

---

# KEEP — Implementation sequencing

The proposed order is appropriate:

```text
1. characterize current semantics and ownership
2. publish complete canonical series
3. make Series a runtime consumer
4. clarify History / Graph inputs
5. migrate GraphTool owners and complete cleanup pass
6. final acceptance / performance / post-review
```

Steps 2 and 3 should remain one logical cutover.

Do not leave a committed feature-branch state where:

```text
GraphTool publishes complete canonical series
and
Series still rebuilds the same effective config
```

as the accepted result of a step.

---

# Required plan changes before implementation

Add or clarify these three items:

```text
1. Explicit GraphTool.geometry versus SparklineGraph calculation-geometry boundary.
   Split numeric grade ranges from grade paint.

2. Explicit pre-first-publication behavior for dynamic Sparkline.
   No unresolved config consumer and no new readiness/config state.

3. Explicit whole-value JavaScript contract for series.
   Add schema alignment and static-vs-JS convergence regression.
```

Recommended wording can remain concise; no new subsystem or abstraction is needed.

---

# Verification additions

In addition to the existing plan matrix, explicitly include:

## Dynamic first publication

```text
construct dynamic Sparkline
→ unresolved config retained as source
→ render/lifecycle safe
→ no Series/History/Graph consumes unresolved config
→ first runtime publication creates/updates domain owners from complete config
```

## Whole-value series JavaScript

```text
static series[]
vs
series: [[[ return [...] ]]]

→ same canonical config.series[]
→ same IDs/order/bindings
→ same inheritance/style precedence
→ one owning evaluation
→ source template retained
```

## Geometry ownership

Architecture assertion:

```text
GraphTool.geometry
does not absorb SparklineGraph calculation geometry.
```

Verify `SparklineGraph` still owns its graph coordinate/area/signature results.

## Grade/rank invalidation

Verify:

```text
color-only grade change
→ presentation update only where appropriate

numeric grade range/boundary change
→ graph calculation/geometry invalidation where required
```

Do not classify all grade/color-stop changes as paint-only.

---

# Final review disposition

```text
BLOCKING: 0
REWORK:   0
ADAPT:    3
```

The plan does not need architectural rework.

Once the three clarifications above are incorporated:

```text
BLOCKING: 0
REWORK:   0
ADAPT:    0

PLAN 18B READY FOR IMPLEMENTATION
```

The important architectural choices already present in 18B should remain:

```text
one canonical current config
one complete canonical series array
one parent-to-series inheritance pass
Series as runtime coordinator
History as history/data owner
Graph as calculation engine
GraphTool as Tool/lifecycle/presentation coordinator
no new general config state
no generic Sparkline engine
no public YAML change
```
