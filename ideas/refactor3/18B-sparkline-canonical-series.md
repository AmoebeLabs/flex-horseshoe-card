# Plan 18B — Sparkline Canonical Series and Runtime Architecture

## 1. Goal

Move Sparkline onto the same one-config architecture without rewriting history, graph math, pointer behaviour or rendering.

The defining Plan 18B invariant is:

> `this.config.series[]` is always the sole canonical internal series configuration representation, and every entry is already complete.

## 2. Current ownership problem

Current GraphTool performs substantial pre-BaseTool processing:

```text
raw sparkline config
→ normalizedConfig
→ defaults/style/period completion
→ sparklineConfig
→ super(sparklineConfig)
```

Later, `SparklineSeries.updateConfig()` performs another configuration route:

```text
parent config
+ raw series override
→ effectiveConfig
→ item.config
```

The result works, but a maintainer must understand two different config owners before understanding runtime series behaviour.

## 2A. Preserve Sparkline JavaScript source preparation order

GraphTool currently performs substantial defaults/legacy/style/period work before BaseTool receives the config. The migration must first determine which of those values are visible to JavaScript `item` today.

Classify each operation as:

```text
PRE-SOURCE / TEMPLATE-VISIBLE
POST-EVALUATION TRANSLATION
```

Only the second category is freely moved into `translateConfig()`.

Do not force all constructor defaults after JS merely to match a diagram. Static and dynamic configs must retain the same evaluation context/order as current master.

## 3. Non-goals

Do not redesign:

- history request timing;
- bucketing;
- aggregation;
- statistics;
- graph geometry algorithms;
- radial/cartesian drawing math;
- pointer interaction;
- tooltip behaviour;
- current public YAML.

## 4. GraphTool canonical translation

Move current constructor/runtime config completion into one recognisable translation route.

The translator may be long. That is acceptable if it reads linearly.

A good shape is conceptually:

```text
clone/evaluated source
→ legacy public translations
→ defaults
→ style dictionaries
→ period completion
→ chart/radial/day-night validation
→ axes
→ complete series[]
→ final canonical config
```

Extract a helper only for substantial concepts such as series translation or axes when it improves readability.

Do not create a general validation framework.

## 5. Canonical implicit series

The absence of public `series:` is only an input form.

Internally:

```text
implicit single series
→ config.series[0]
```

Downstream configuration code must no longer branch on “implicit versus explicit” merely to build effective config.

The generated default series ID/entity binding must preserve current behaviour and existing derived-entity naming contracts.

## 6. Raw override validation

Some validations must inspect the raw override **before** parent inheritance.

Examples identified in current Series logic include restrictions where merging can hide whether the field was explicitly supplied by the series.

The translation sequence is therefore:

```text
raw series override
→ validate override-only restrictions
→ merge parent + override
→ apply paint precedence
→ validate completed series/cross-series constraints
→ publish config.series[]
```

The raw override is a local translation input, not a persistent config owner.

## 7. Parent + series merge

Resolve inheritance exactly once.

Current:

```text
SparklineSeries.updateConfig()
  effectiveConfig = Merge.mergeDeep({}, parent, series)
```

Target:

```text
SparklineGraphTool translation
  config.series[n] = complete effective series config
```

A runtime Series item may hold a direct reference to that canonical entry if useful. It must not build and own another object that semantically becomes the series configuration.

## 8. SparklineSeries target

Series remains a real, useful domain coordinator.

It should own runtime concerns such as:

- stable series IDs;
- entity binding/current entities;
- request/data state coordination;
- graph objects;
- cartesian/radial layout coordination;
- reuse of runtime items by ID;
- data-state results.

It should not own public config completion.

## 9. SparklineHistory target

History is not a tool and does not need config/geometry/runtime/paint containers merely for symmetry.

Its current domain ownership is good:

- `seriesRecords`;
- rows;
- request timers;
- retry/resynchronization state;
- period/time calculations.

The current method name `updateConfig(...)` is misleading because the object does not own the public Sparkline config.

Rename the contract to an accurate input name, preferably:

```text
updateInputs(...)
```

or another equally clear domain-specific name if implementation review reveals a better one.

Preserve all history algorithms.

## 10. SparklineGraph target

`SparklineGraph` is a calculation engine.

The object passed by GraphTool is a derived calculation contract, not the canonical tool configuration.

Recommended vocabulary:

```text
buildGraphConfig()  → buildGraphInput()
graphConfig         → graphInput
SparklineGraph.config → SparklineGraph.input
```

This is a potentially large mechanical rename because graph math reads the object frequently.

Perform it as an isolated checked step. Do not combine the rename with formula changes.

## 11. GraphTool derived owners

The final exact grouping should be determined while migrating, but the semantic target is:

### Geometry

```text
geometry.svg
geometry.graphArea
geometry.margins
geometry.axes
geometry.legend layout
```

### Runtime

```text
current series/entity data
loading/data state
pointer/hover state
current derived values
```

### Paint

```text
day/night paint
state-band/graded paint
series presentation data where persistent
active color-stop paint after the shared Plan-19 cutover
```

During 18B, Sparkline must be made ready to consume the canonical paint owner, but do not create a duplicate active color-stop copy while Horseshoe/other remaining consumers still depend on the legacy location. The final shared owner switch is atomic in Plan 19.

### Graph input

The calculation contract handed to each `SparklineGraph` remains a unique domain concept and may be named `graphInput` rather than forced under `geometry`.

## 12. `this.svg` and `config.svg`

Current GraphTool keeps both `this.svg` and `this.config.svg`.

After migration there should be one geometry owner.

Do not keep both merely to reduce the initial diff. If a staged mechanical transition needs a short-lived local alias inside one commit, remove it before Plan 18B is complete.

## 13. Change detection

Sparkline legitimately needs multiple signatures because history/data/geometry can change independently.

Do not remove signatures merely because there are many.

Audit each signature after canonical series migration:

- what owner does it compare?
- does it still prevent real expensive work?
- is it duplicated now that series configuration is canonical?

Only redundant signatures disappear in Pass B.

## 14. Pass A verification

Focus on configuration equivalence first:

- implicit single vs equivalent explicit single;
- multi-series;
- stable series IDs;
- entity indexes;
- raw override restrictions;
- period offsets;
- axis IDs;
- parent/series paint precedence;
- radial restrictions;
- state bands/day-night.

Then verify history/graph results remain unchanged.

## 15. Pass B cleanup

With complete series config in one owner:

- remove `effectiveConfig` construction from Series;
- remove implicit/explicit config branches that have no runtime meaning;
- remove duplicate inheritance/paint completion;
- simplify GraphTool coordination where downstream no longer repairs config;
- re-evaluate config-related signatures;
- keep external/runtime/numerical guards owned by History/Graph.

Do not use the cleanup pass to optimize graph formulas.

## 16. Tests

Run the complete existing Sparkline Node and browser test families after both passes.

Architecture assertions should prove:

```text
no persistent effectiveConfig in SparklineSeries
config.series[] exists for implicit and explicit forms
History input update is not called config ownership
Graph calculation input is not named/treated as public tool config
```

## 17. Definition of Done

- `this.config.series[]` is the only canonical series configuration representation;
- every series entry is complete before runtime Series coordination;
- raw override restrictions are preserved at translation time;
- Series no longer reconstructs public config;
- History retains its domain logic with clearer input naming;
- Graph retains all calculation logic with clearer input naming;
- graph/history/render output is unchanged.
