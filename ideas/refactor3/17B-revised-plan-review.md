# Plan 17B Revised Plan Review

Date: 2026-10-02

Reviewed repository:

```text
AmoebeLabs/flex-horseshoe-card
```

Reviewed code baseline:

```text
e16b0538320b595e5d2e5e983cc4276d05bf6165
```

Reviewed plan:

```text
Plan 17B - Controls on the Canonical Tool Architecture
```

Relevant prerequisite:

```text
Plan 16C - Evaluate JavaScript Before Translation
PR #856
```

## Overall conclusion

The revised Plan 17B is structurally sound and correctly builds on Plan 16C.

The intended route is now:

```text
sourceConfig
→ JavaScript evaluation
→ local newConfig
→ subtype translation / validation / preset completion
→ completeRuntimeConfig()
→ this.config
→ geometry / runtime / paint
```

Review result:

```text
BLOCKING: 0
REWORK:   1
ADAPT:    3
KEEP:     remaining architecture
```

The single REWORK concerns evaluation semantics: the same JavaScript expression
must not be evaluated twice in one configuration pass when a bounded selector
phase is required.

The three ADAPT points make generated-child JavaScript context, initial dynamic
Control rendering and dynamic inherited `entity_index` explicit.

---

# 1. REWORK — A selector/template expression must not be evaluated twice in one config pass

## Finding

Section 5 allows a bounded selector phase where characterization proves that an
existing `item` context depends on a selector-selected preset.

Conceptually:

```text
stable prepared source
→ local selector evaluation
→ preset/source completion
→ full existing evaluation
→ local newConfig
→ translator
→ completeRuntimeConfig()
→ this.config
```

The reason is valid, but a literal implementation can execute the same
expression twice.

Example:

```yaml
show:
  item_style: |
    [[[ return entities[entity_slots.style[0]].state; ]]]
```

The selector phase may resolve `item_style` once, after which a recursive
whole-source evaluation may visit the original template again.

That must not become the runtime model.

## Required invariant

Add explicitly:

```text
A template expression is evaluated at most once per configuration pass.
```

If a selector was resolved in a bounded selector phase, that resolved value is
reused by the remaining evaluation path. The same selector expression is not
evaluated again.

Correct conceptual route:

```text
sourceConfig
    item_style = [[[ ... ]]]

→ evaluate selector once
    item_style = ios

→ construct required local preset/item context using the resolved selector

→ evaluate only remaining unresolved fields in that context

→ one local newConfig

→ pure translator

→ completeRuntimeConfig()

→ this.config
```

Two context phases may be required. Two evaluations of the same expression are
not.

`activeConfigSignature` or equivalent change detection should represent the one
complete evaluated configuration, not independent persistent selector/full-pass
owners.

## Required tests

Add call-count characterization for:

```text
first dynamic pass
unchanged later pass
changed selector pass
```

One selector expression must execute once for each pass in which it actually
needs evaluation.

Static and equivalent JavaScript forms must still converge on the same canonical
config.

## Classification

```text
REWORK
```

---

# 2. ADAPT — Separate parent-owned and generated-child-owned JavaScript context

## Finding

Generated Control children can contain their own JavaScript configuration.

Those child templates belong to the generated child's own item/entity context.
A recursive parent-Control evaluation must not consume them first using the
parent Control as `item`.

This is the same class of context boundary already handled for outer TextTool
versus per-part Text JavaScript in Plan 16B.

## Required rule

Add explicitly:

```text
Parent-owned JavaScript
    is evaluated as part of the Control current configuration.

Generated-child-owned JavaScript
    remains source syntax until the generated child evaluates it with that
    child's existing item/entity context.
```

No child-owned expression should be:

```text
evaluated by parent
→ stored as child source
→ evaluated again by child
```

and no child-owned template should be consumed in the wrong parent context.

## Characterization

Step 1 should identify per subtype:

```text
parent config fields
generated child source fields
generated child context-sensitive JavaScript
```

before moving evaluation/completion.

## Required tests

Add a generated-child template case that records the `item` context and call
count.

Verify:

```text
parent template
→ parent Control context

child template
→ generated child context

each expression
→ exactly one owning evaluation
```

A Select with shared content and different option children is a useful case.

## Classification

```text
ADAPT
```

---

# 3. ADAPT — Make initial dynamic-Control rendering explicitly safe

## Finding

Plan 16C established that dynamic selector-dependent geometry is not valid until
the first fully evaluated current config has been published.

Controls currently create many selector-dependent children directly in their
constructors:

```text
Button content tools
Select option tools/content
Toggle IconTool
Slider StateTools
Number generated children
Control label TextTool
```

After migration, JavaScript-backed Controls must not construct those children
from unresolved source merely because existing render/lifecycle code assumes
they exist.

## Required rule

Add:

```text
A JavaScript-backed Control does not construct selector-dependent geometry or
generated children from unresolved source.

Before the first active configuration is published, render and lifecycle code
must safely tolerate those children being absent.

Use existing hasJavascript / activeConfigInitialized state.
Do not introduce another readiness/configuration owner.
```

Static Controls can still initialize immediately from concrete translated config.

## Required test

For at least one representative dynamic Control:

```text
construct
→ render before first updateRuntimeConfig()
→ no exception
→ no generated child built from unresolved selectors

first updateRuntimeConfig()
→ publish complete config
→ build geometry once
→ build generated children once
→ normal render
```

Also verify lifecycle forwarding does not touch non-existing children.

## Classification

```text
ADAPT
```

---

# 4. ADAPT — Test dynamic parent entity_index through generated-child inheritance

## Finding

Plan 16C now synchronizes live BaseTool entity binding from the published current
config.

Controls add structural child inheritance on top of that.

Generated children often inherit the parent entity:

```text
Button ControlContent
Control labels
Number generated children
Select option content
```

A dynamic parent:

```yaml
entity_index: '[[[ return ...; ]]]'
```

may therefore change which entity a generated child should inherit.

If the inherited entity is part of the generated child's stable source, the
implementation must not mutate an existing child config/source merely to simulate
new structural inheritance.

## Required rule

For:

```text
parent entity_index A → B
```

the parent follows the newly published current config.

For generated children:

- use an existing explicit live-binding route only where that is already the
  child contract;
- otherwise end the old child lifetime and construct one replacement source with
  the new inherited entity.

Do not fake structural inheritance by mutating:

```text
child.config.entity_index
child.sourceConfig.entity_index
```

after construction.

## Required test

Verify:

```text
parent entity_index becomes B
generated child binding follows B
old child closes once when replacement is required
replacement receives one stable source
selection/state updates do not repeat structural inheritance
```

Include at least Button/ControlContent or Number.

## Classification

```text
ADAPT
```

---

# 5. KEEP — Plan 16C is correctly used as the only BaseTool route

The revised plan correctly relies on the merged Plan 16C route:

```text
sourceConfig
→ JavaScript evaluation
→ local newConfig
→ subtype translation
→ completeRuntimeConfig()
→ this.config
```

Controls do not copy the evaluator and do not introduce a second general config
publication route.

Classification:

```text
KEEP
```

---

# 6. KEEP — Dynamic Control selectors are required behavior

The revised plan correctly treats dynamic Control configuration as normal FHS
behavior.

At minimum:

```text
orientation
show.item_variant
show.item_viz
show.item_style
visibility
```

are characterized and supported where they belong to the Control contract.

Static and equivalent JavaScript values must converge on the same canonical
result.

The live FHS-input browser regression is also correct, for example:

```text
Toggle item_style:
ha → ios → industrial
```

Schema alignment is explicitly required so authoring and runtime cannot disagree.

Classification:

```text
KEEP
```

---

# 7. KEEP — Source preparation, translation and geometry are distinct phases

The classification is correct:

```text
PRE-SOURCE / TEMPLATE-VISIBLE
POST-EVALUATION TRANSLATION
DERIVED GEOMETRY / PRESENTATION
```

Selector interpretation belongs after evaluation.

Geometry, generated IDs, current HA state and current child paint do not belong
in translators.

Classification:

```text
KEEP
```

---

# 8. KEEP — Toggle route is correctly redesigned

The target route is correct:

```text
stable source preparation
→ sourceConfig
→ JavaScript evaluation
→ local newConfig
→ pure Toggle structural translator
→ completeRuntimeConfig()
→ this.config
→ geometry / generated resources
```

Current `buildConfig()` must not simply be renamed to translator.

Dormant calculated fields such as currently unused checked/unchecked
`iconStyles` are explicitly prevented from becoming accidental new behavior.

Classification:

```text
KEEP
```

---

# 9. KEEP — Button, Select, Number and Slider interpret selectors after evaluation

The revised plan correctly removes constructor-first interpretation.

### Button

```text
validate evaluated variant/viz/style
select preset
complete visualization
preserve state-map replacement
```

### Select

```text
validate evaluated variant/viz/style
select preset
preserve configured option structure
keep HA options outside config
```

### Number

```text
validate evaluated variant/viz/style/orientation
select orientation-dependent structure
select visual preset
preserve shorthand behavior
```

### Slider

```text
validate evaluated single/range
validate evaluated linear/circular
validate style
choose visualization-dependent structure
normalize selector-dependent config
complete values structure
```

Classification:

```text
KEEP
```

---

# 10. KEEP — Family-wide geometry ownership

All five concrete Controls move:

```text
config.svg
→ geometry.svg
```

with no compatibility copy.

Number removes the parallel `numberGeometry` owner.

Toggle native geometry and generated resource IDs remain outside config.

Slider fixed physical bounds are geometry while current values/thumb positions
remain runtime-derived.

Classification:

```text
KEEP
```

---

# 11. KEEP — Generated child lifetime and ControlContent ownership

The structural route is correct:

```text
parent entity
→ shared content item
→ per-instance override
→ complete generated child source
→ child construction
```

once per generated child lifetime.

Completed child source is not written back into parent canonical config.

ControlContent is explicitly prohibited from mutating canonical parent config in
place.

Classification:

```text
KEEP
```

---

# 12. KEEP — Parent presentation uses setPaintStyles()

The plan correctly removes:

```js
child.tool.config.styles = ...
```

and uses:

```js
child.tool.setPaintStyles(completeResolvedMap);
```

while preserving the exact priority:

```text
visual-state icon/text styles
→ configured child styles
→ control transition
→ child state-map/color-stop/animation/filter cascade
```

Configured active/inactive and selected/unselected branches remain in config.

Current selection remains runtime.

No duplicate parent `paint.active`, `paint.selected`, etc. owners are introduced.

Classification:

```text
KEEP
```

---

# 13. KEEP — Semantic parent paint scope remains bounded

Parent semantic paint applies to:

```text
Icon
Text
State / Name / Area adapted to TextTool
```

and not to:

```text
Line
Circle
Horseshoe
Sparkline
```

Those visualizations retain their own presentation/state/color-stop behavior.

Text font-metric changes use the established 16B paint/measurement route.

Classification:

```text
KEEP
```

---

# 14. KEEP — Select ownership is explicit

The revised target is coherent:

```text
config.option_map
    configured options only

runtime.options
    effective options

runtime.selectedIndex
runtime.optionDisplayTexts
runtime.actionConfigs
```

Configured options may be referenced directly rather than cloned.

HA-derived options never overwrite config/sourceConfig.

No unused `runtime.selectedValue` owner is created.

Existing readiness/signature fields keep their narrow lifecycle/change roles.

Classification:

```text
KEEP
```

---

# 15. KEEP — Slider runtime/lifecycle boundary

Runtime:

```text
runtime.values
runtime.displayValues
runtime.available
runtime.scale
runtime.activeValueIndex
runtime.dragging
runtime.draggingThumb
runtime.lastWrittenSignature
```

Lifecycle handles stay explicit:

```text
renderFrame
stateAnimationFrame
writeTimer
pointerMoveListener
pointerUpListener
```

This is the correct distinction.

Classification:

```text
KEEP
```

---

# 16. KEEP — Number action and measurement ownership

Move:

```text
minusActionConfig
→ runtime.minusActionConfig

plusActionConfig
→ runtime.plusActionConfig
```

while keeping exact increment/decrement conversion behavior.

Measurement pass/signature state remains explicit lifecycle work.

Classification:

```text
KEEP
```

---

# 17. KEEP — ControlTool stays compile/dispatch only

The plan correctly keeps ControlTool simple.

Dead commented implementation may be removed in Pass B.

No generic Control engine is introduced.

Classification:

```text
KEEP
```

---

# 18. KEEP — Shared active color-stop owner remains staged for Plan 19

Controls can move presentation to the canonical paint API without partially
moving the shared active color-stop owner while Sparkline/Horseshoe remain on
their staged route.

No duplicate owner is introduced.

Classification:

```text
KEEP
```

---

# 19. KEEP — Implementation sequence and verification

The six-step sequence remains appropriate:

```text
1. characterization
2. ControlBase/subtype translation/geometry
3. content/Button/child paint
4. Select
5. Slider/Number
6. Pass B/review/acceptance
```

Verification correctly covers:

- static/dynamic selector equivalence;
- live FHS-input switching;
- geometry ownership;
- generated child lifetime;
- paint ownership/priority;
- Select runtime options;
- Slider interaction;
- Number measurement;
- group/theme behavior;
- three-browser acceptance.

The four findings from this review should be added before implementation.

Classification:

```text
KEEP
```

---

# 20. Required changes before approval

## REWORK

### 1. Prevent duplicate evaluation in bounded selector phases

Add:

```text
A template expression is evaluated at most once per configuration pass.
```

A resolved selector is reused by the remaining evaluation and is not recursively
evaluated a second time.

## ADAPT

### 1. Generated-child JavaScript context

Add:

```text
Parent evaluation must not consume templates belonging to a generated child's
own item/entity context.

No child-owned template is evaluated by the parent and then again by the child.
```

### 2. Initial dynamic-Control rendering

Add:

```text
Selector-dependent geometry and children do not exist until the first complete
dynamic config publication.

Pre-publication render/lifecycle safely tolerates that using existing
hasJavascript / activeConfigInitialized signals.
```

No new readiness flag.

### 3. Dynamic inherited entity_index

Add regression coverage for:

```text
parent entity_index A → B
```

and prove generated child binding follows the new structural source/lifetime rule
without config/source mutation.

---

# 21. Final review status

Current:

```text
BLOCKING: 0
REWORK:   1
ADAPT:    3
KEEP:     remaining architecture
```

After the four plan changes:

```text
BLOCKING: 0
REWORK:   0
ADAPT:    0
```

At that point Plan 17B is ready for implementation.

The remaining core invariant is:

```text
Each JavaScript expression is evaluated once per config pass, in the context
that owns it.

Parent Controls evaluate parent-owned configuration.
Generated children evaluate child-owned configuration.
Each tool publishes one canonical current config.
```
