# Plan 18B — Implementation Review

**Plan:** 18B — Sparkline Canonical Series and Runtime Architecture  
**Repository:** `AmoebeLabs/flex-horseshoe-card`  
**Reviewed branch:** `master`  
**Reviewed commit:** `65c6f4caaf63043660149360350008e9c67ff382`  
**Implementation baseline:** `f960daf78abd605604a81e5d2fef03efecaf8466`  
**Review type:** Final post-merge implementation review  
**Date:** 2026-10-03

## Final review status

```text
BLOCKING: 0
REWORK:   0
ADAPT:    0

PLAN 18B CLOSED
```

The merged implementation satisfies the approved 18B architecture.

No further 18B rework is required.

---

# 1. Executive conclusion

Plan 18B successfully replaces the previous duplicated Sparkline configuration route with one canonical publication path.

The effective architecture is now:

```text
sourceConfig
→ JavaScript evaluation
→ Sparkline translation / validation / completion
→ this.config
→ complete canonical this.config.series[]
→ Series / History / Graph runtime consumers
```

At the operational boundary:

```text
this.config.series[]
```

is the only complete current series configuration.

`SparklineSeries` no longer rebuilds parent + series configuration and no longer owns the raw explicit/implicit-series validation path.

The broader Sparkline runtime domains retain their intended responsibilities:

```text
GraphTool
→ canonical config publication
→ Tool lifecycle
→ SVG/layout/presentation
→ runtime coordination

Series
→ stable runtime series items
→ canonical config references
→ rows/request/data state
→ graph instances
→ bin planning
→ shared series layout

History
→ source/history rows
→ requests/timers/retries
→ range preparation
→ history input state

Graph
→ graph calculation input
→ processed data/statistics
→ graph geometry
```

The final implementation also contains the post-review corrections for:

```text
legacy per-series color-stop inheritance/theme refresh
whole-value JavaScript series[] + derived fhs_sparkline.* entities
```

and the later radial input-alias correction.

---

# 2. Reviewed merge

The final `master` is four commits ahead of the Plan-18B baseline.

Relevant implementation history:

```text
31c828d3
refactor: publish canonical Sparkline series and separate domain ownership

d992cd57
fix: match JS-series derived entities against canonical IDs

bb8b3835
docs: record final Plan 18B acceptance and review

65c6f4ca
merge/final Plan 18B state on master
```

The product changes are concentrated in the expected modules:

```text
src/base-tool.js
src/card-entities.js
src/sparkline-graph-tool.js
src/sparkline-series.js
src/sparkline-history.js
src/sparkline-graph.js
Sparkline schema
Sparkline tests/browser regressions
```

No additional product module was introduced.

---

# 3. KEEP — Canonical series publication

`SparklineGraphTool.translateConfig()` is now the single configuration builder for complete series configuration.

The route is:

```text
evaluated public Sparkline config
→ complete parent defaults / legacy forms
→ inspect raw explicit series overrides
→ validate explicit-only restrictions
→ inherit parent once
→ apply selector/style precedence
→ validate complete series
→ publish this.config.series[]
```

This preserves the important distinction between raw explicit input and inherited canonical result during validation.

After publication, runtime consumers no longer need that raw distinction.

---

# 4. KEEP — Series is no longer a configuration builder

`SparklineSeries.updateConfig()` now receives already-complete canonical entries.

Its role is limited to runtime ownership:

```text
match retained item by series ID
→ update entity_index / y_axis_id
→ bind item.config directly to canonical entry
→ preserve graph/history/runtime state where possible
```

The important identity invariant is implemented:

```text
item.config === this.config.series[n]
```

for the corresponding series.

Series no longer performs parent + series deep merge, raw series validation, implicit-series generation, selector/style inheritance repair or general configuration completion.

This is the central 18B ownership cutover and is complete.

---

# 5. KEEP — Implicit series is canonical runtime config only

Public YAML without an explicit `series` block is translated to one internal default series.

```text
sourceConfig
→ no authored series

this.config.series
→ [{ id: "default", ... }]
```

The implicit series is not written back into `sourceConfig`.

This preserves public/template-visible source semantics while giving downstream runtime code one normalized shape.

Implicit-only graph families such as existing barcode/state-band routes remain supported and are not accidentally rejected by explicit-series restrictions.

---

# 6. KEEP — Dynamic first publication is safe

Dynamic Sparkline configuration no longer constructs `Series` or `History` from unresolved source values.

For JavaScript-backed Sparkline config:

```text
constructor
→ captures source
→ no configuration-consuming Series/History owners

first updateRuntimeConfig()
→ evaluate
→ translate
→ publish complete config
→ initialize Series/History
```

Before first publication the tool is intentionally inert for render, presentation comparison, pointer handling, palette work, history work and connection forwarding.

The implementation uses the existing:

```text
hasJavascript
activeConfigInitialized
CardTools connection state
```

and does not add another pending/candidate/accepted/ready state machine.

The architecture regression suite exercises this full pre-publication lifecycle.

---

# 7. KEEP — Whole-value JavaScript `series[]`

The schema now explicitly supports:

```yaml
series:
  anyOf:
    - type: array
    - common.javascript
```

A whole-value series expression follows the normal outer Sparkline evaluation context:

```text
source expression
→ evaluate once
→ returned series array
→ raw-series validation
→ canonical inheritance/completion
→ this.config.series[]
```

No separate per-series evaluator was introduced.

The original JavaScript remains in `sourceConfig`, while canonical configuration receives the evaluated result.

Static and equivalent JavaScript series forms converge on the same runtime model.

---

# 8. KEEP — History is an input/data owner

`SparklineHistory.updateConfig()` has been renamed to:

```text
updateInputs()
```

which better reflects its actual responsibility.

History retains ownership of source rows, prepared rows, source ranges, request state, request numbers, timers, retry state, resynchronization state, day/night history, range reuse and incremental publication.

It receives current period/state-map/series input but is not a general Sparkline config owner.

No history formula or request model needed redesign for 18B.

---

# 9. KEEP — Graph owns calculation input and graph geometry

The Graph interface is now expressed as calculation input rather than public FHS configuration:

```text
buildGraphConfig()
→ buildGraphInput()

SparklineGraph.config
→ SparklineGraph.input

updateGraphConfig()
→ updateGraphInput()
```

The final source contains no remaining old Graph config aliases in the current Sparkline implementation.

Graph retains real calculation geometry such as coords, graph/data/axis/draw areas, geometry signatures and processed graded/bar/point/radial geometry.

This geometry was not incorrectly absorbed into GraphTool merely for naming symmetry.

---

# 10. KEEP — GraphTool geometry ownership

GraphTool now owns the Tool-level SVG and presentation geometry through:

```text
this.geometry
```

The previous parallel Sparkline owners:

```text
this.svg
this.config.svg
```

have been removed from the current implementation.

GraphTool geometry contains outer SVG dimensions, legend layout/measurement, shared Tool-level layout state, renderer path caches and presentation geometry.

Graph calculation geometry stays with `SparklineGraph`.

---

# 11. KEEP — Numeric grade ranges remain calculation input

18B correctly keeps a distinction between numeric grade/rank boundaries and paint.

GraphTool calculates and supplies:

```text
gradeValues
gradeRanks.rangeMin
gradeRanks.rangeMax
```

as calculation/geometry input.

Graph includes those values in the relevant data/geometry signatures for graded charts.

Therefore:

```text
numeric grade/rank change
→ appropriate graph/data/geometry invalidation

color-only presentation change
→ no unnecessary graph geometry rebuild
```

The architecture regression suite explicitly covers this ownership boundary.

---

# 12. KEEP — Automatic binning remains runtime output

Configured automatic binning remains:

```yaml
bins:
  per_hour: auto
```

inside canonical configuration.

`SparklineSeries` calculates the current effective numeric bin plan separately.

The numeric value is supplied to Graph input without rewriting canonical config.

This allows width/density/runtime changes to update bins without turning derived runtime state into configuration.

---

# 13. KEEP — Radial graph migration

A real post-implementation regression was found during 18B: several radial GraphTool consumers still read `Graph.config` after that field had been renamed to `Graph.input`.

Those missed consumers caused a radial-axis crash.

The implementation was corrected and the current Sparkline product source no longer contains those old Graph config consumers.

Regression coverage now includes:

```text
radial line
radial area
radial dots
implicit radial_barcode
```

with axes/grids/tickmarks/labels enabled.

The final visually validated build contains this correction.

---

# 14. KEEP — Legacy per-series color-stop correction

The independent post-review found that explicit legacy per-series color-stop overrides did not fully retain normalized parent/theme paint.

The final implementation corrects that after BaseTool performs parent theme normalization:

```text
normalized active parent color stops
+
last evaluated per-series legacy override
→ effective per-series legacy paint
```

Important properties are preserved:

```text
- no new raw-series cache;
- no second general config owner;
- no additional JavaScript evaluation on theme changes;
- canonical series object identity is retained;
- runtime Series item identity is retained;
- Graph identity is retained.
```

Inherited series still share the parent active color-stop object directly.

Only explicitly overridden legacy series require recomposition.

Tests cover both static and whole-value JavaScript series across:

```text
light → dark → light
```

including override replacement/reset and prevention of cumulative merge behavior.

This is acceptable as the bounded legacy bridge until the planned atomic Plan-19 color-stop owner cutover.

It should not be generalized into a new configuration-storage pattern.

---

# 15. KEEP — Derived `fhs_sparkline.*` values with whole-value JS series

The independent review also found that `CardEntities` previously tried to resolve series-derived entities before a whole-value JavaScript series array existed.

The final route is now:

```text
CardEntities initial resolution
→ recognize derived fhs_sparkline.* ID
→ do not evaluate GraphTool's series expression

GraphTool
→ evaluates series once
→ publishes canonical this.config.series[]

derived publication
→ bind named/primary derived source against canonical series IDs/entity_index
```

The derived-entity layer therefore does not become another JavaScript evaluator or configuration owner.

The later ambiguity around `bin_duration`, series IDs ending in `_bin`, and series IDs containing underscores is handled using complete canonical series ID + metric matching.

Regression coverage includes primary statistics, named-series statistics, duration, bin_duration, metric-like series IDs, decimals, source metadata, units/device classes, source entity IDs and one owning JS evaluation.

---

# 16. KEEP — Source and canonical configuration remain distinct

18B preserves the intended distinction:

```text
sourceConfig
→ stable template-visible source

this.config
→ current evaluated and completed Sparkline configuration

this.config.series[]
→ canonical current series configuration
```

Runtime rows, history, graph data, automatic bins, geometry and derived entities are not written back into `sourceConfig`.

No persistent candidate/raw/current config family was introduced.

---

# 17. Verification

The final recorded acceptance is:

```text
Node tests:     555 passed, 0 failed
Lint:           134 files passed
Browser cases:  112 passed
                Chromium / WebKit / Firefox
Build:          passed
Visual:         final corrected build accepted without visible deviation
```

The final post-review also recorded:

```text
P2 legacy series color stops
→ fixed and verified

P2 whole-array JS derived entities
→ fixed and verified

complete-ID derived entity ambiguity
→ fixed and verified

radial Graph.config/Input alias miss
→ fixed and verified
```

No remaining implementation finding was reported by the independent read-only reviewer after those corrections.

---

# 18. LOC result

Final product-code measurements recorded for 18B:

| Module | Code before | Code after | Delta |
| --- | ---: | ---: | ---: |
| `base-tool.js` | 237 | 243 | +6 |
| `card-entities.js` | 182 | 212 | +30 |
| `sparkline-graph-tool.js` | 4610 | 4729 | +119 |
| `sparkline-graph.js` | 1872 | 1872 | 0 |
| `sparkline-history.js` | 855 | 855 | 0 |
| `sparkline-series.js` | 367 | 282 | -85 |
| **Whole card / 72 src modules** | **23887** | **23957** | **+70** |

Physical source size changed by +93 lines.

The shape of the change is consistent with the architectural result:

```text
Series
→ removes repeated configuration construction

GraphTool / BaseTool / CardEntities
→ gain canonical publication
→ source-safe JS handling
→ deferred initialization
→ supported-input review corrections
```

18B was therefore not a LOC-reduction plan; it was an ownership/canonicalization plan.

---

# 19. Out-of-scope legacy observation

One existing combination remains worth recording separately from 18B:

```yaml
series:
  - id: comparison
    entity_index: |
      [[[ return 2; ]]]
```

combined with a named:

```text
fhs_sparkline.<sparkline>_comparison_*
```

derived entity.

For a static series array whose individual `series[].entity_index` is JavaScript, `CardEntities` can still inspect the raw series entry before GraphTool canonical publication.

The Sparkline itself evaluates the binding correctly, but that early derived-entity source binding may still see the raw `entity_index`.

This behavior already existed in the 18B baseline before the refactor.

Therefore:

```text
- it is not an 18B regression;
- it does not invalidate the canonical-series cutover;
- it should not reopen Plan 18B;
- if this combination is part of the supported public contract, it should be handled as a separate CardEntities/Sparkline-derived issue.
```

The whole-value JavaScript `series[]` path covered by 18B does not have this defect; that route is explicitly bound after canonical publication.

---

# 20. Final implementation disposition

```text
BLOCKING: 0
REWORK:   0
ADAPT:    0
```

No further Plan-18B implementation changes are required.

The intended final architecture is present:

```text
one stable sourceConfig
one canonical current this.config
one complete canonical this.config.series[]
one parent-to-series inheritance pass
Series as runtime coordinator
History as history/data owner
Graph as calculation engine
GraphTool as Tool/lifecycle/presentation coordinator
no new config state machine
no second raw-series/config owner
no public YAML regression
```

## Final status

```text
PLAN 18B IMPLEMENTATION APPROVED
PLAN 18B CLOSED
```
