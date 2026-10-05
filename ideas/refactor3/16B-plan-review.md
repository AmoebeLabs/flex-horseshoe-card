# Plan 16B Review — Canonical Configuration Lifecycle and Text

Date: 2026-10-02

Reviewed plan: `Plan 16B - Canonical Configuration Lifecycle and Text`

Reviewed baseline:

```text
91548f502e7c42f449b36d5563e7e9855070cf31
```

Current `master` is identical to that baseline.

## Overall conclusion

The architectural direction is correct:

```text
sourceConfig
→ local newConfig
→ this.config
```

with:

```text
config     = current configuration
runtime    = current entity/display data
geometry   = derived dimensions/measurement
paint      = parent-driven presentation
```

The proposed BaseTool entity migration, TextTool ownership migration, geometry cleanup, paint integration and color-stop staging all fit that model.

The plan should **not yet be executed literally as written**. Two points need to be made explicit first because the current wording still permits an implementation that accidentally recreates two Text configuration routes or evaluates Text JavaScript in the wrong context.

Classification:

```text
REWORK  2
ADAPT   3
KEEP    remaining architecture
```

---

# 1. REWORK — Define the outer/part JavaScript route explicitly

## Finding

The plan correctly says:

```text
sourceConfig.text = stable source parts
config.text       = completed current parts
```

and also correctly says that storing `text` in `sourceConfig` must **not** make it visible to outer JavaScript as part of the outer `item` context.

That requirement is not yet strong enough.

Today TextTool deliberately has two JavaScript evaluation contexts:

```text
outer TextTool config
```

and:

```text
individual text part
```

This is functional behavior, not accidental duplication.

Current TextTool effectively does:

```text
outer config
  → BaseTool JavaScript evaluation

inline source tools
  → their own config evaluation

source text parts
  → per-part JavaScript evaluation
  → each part gets its own item/entity context
```

The two phases are needed because their `item` contexts are different.

They must **not** become two configuration owners.

## Why the current plan is risky

BaseTool currently does this conceptually:

```js
this.hasJavascript =
  templates.hasJavascriptTemplates(this.sourceConfig);

newConfig =
  templates.getJsTemplateOrValue(
    this.sourceConfig,
    this.sourceConfig,
    { resolveKeys: true },
  );
```

`Templates.getJsTemplateOrValue()` recursively evaluates descendants.

Therefore, if 16B simply starts storing:

```js
sourceConfig.text
```

inside the ordinary BaseTool source, then JavaScript inside a text part can be:

1. detected as outer JavaScript;
2. recursively evaluated by BaseTool;
3. evaluated with the **outer TextTool item context**;
4. evaluated again later with the proper part context.

That would be wrong.

Merely saying that outer JavaScript must not *see* `text` in `item` does not solve this. The outer evaluator must also not recursively evaluate `sourceConfig.text`.

The outer `hasJavascript` scheduling signal must likewise exclude part JavaScript.

## Required target

There should still be exactly:

```text
one sourceConfig
one config
```

but Text may have two evaluation phases:

```text
phase 1: outer TextTool fields
phase 2: sourceConfig.text parts
```

A suitable conceptual route is:

```text
prepared sourceConfig
  ├─ outer fields
  └─ text: prepared source parts

        ↓

local outerSource projection
  = sourceConfig without text

        ↓

evaluate outerSource
with the existing outer item context

        ↓

update inline source-tool configuration
at the existing lifecycle boundary

        ↓

evaluate sourceConfig.text
part by part
with each part's existing item/entity context

        ↓

local newConfig = {
  ...evaluatedOuter,
  text: evaluatedParts,
}

        ↓

existing completion / normalization

        ↓

this.config = newConfig
```

`outerSource` is a **local projection**, not another stored source config.

Do not introduce:

```text
outerSourceConfig
activeTextConfig
runtimeTextConfig
effectiveTextConfig
```

or any equivalent persistent second owner.

## JavaScript flags

It is acceptable to retain two scheduling signals if they are useful:

```text
outer has JavaScript?
text parts have JavaScript?
```

because they control two genuinely different evaluation contexts.

They are **not** two configuration states.

`textPartsHaveJavascript` may therefore remain if it is still useful as immutable scheduling metadata. If it becomes unnecessary after the migration, remove it in Pass B.

The important rule is:

> two evaluation phases are valid; two configuration owners are not.

---

# 2. REWORK — Resolve the inline-source binding order

## Finding

The plan currently contains two statements that are individually sensible but do not yet form one unambiguous sequence.

It says:

```text
Inline source configuration updates
→ after outer evaluation
→ before per-part evaluation
```

but later also says:

```text
Bind evaluated inline-source entity indexes
during configuration processing.
```

An **evaluated** part `entity_index` does not exist until the per-part evaluation has happened.

The current implementation also mutates:

```js
sourceTool.entity_index
sourceTool.config.entity_index
```

inside `setState()`.

16B is correct to remove that configuration mutation from `setState()`, but the replacement order must be stated exactly.

## Required order

To preserve the current evaluation order while moving the binding to the configuration phase:

```text
1. evaluate outer Text config

2. update inline source-tool config
   at the same point as today

3. evaluate each Text part
   with its existing part context

4. bind the evaluated part entity_index
   to the inline source tool

5. finish local newConfig.text

6. publish this.config

7. setState()
   only supplies entity/runtime data
```

This keeps:

```text
source-tool config evaluation
before
Text part evaluation
```

as today.

But it moves the final evaluated binding out of `setState()`.

If implementation intentionally changes that order instead, it must first be characterized and proven equivalent. Do not silently reverse it as a cleanup.

## No second config route

Binding the inline source is not permission to introduce another Text config representation.

The final current Text parts remain:

```text
this.config.text
```

The inline Name/Area/State tool remains a real child tool with its own normal config.

---

# 3. ADAPT — Make the pre-publication BaseTool boundary explicit

## Finding

The plan says:

> Complete local `newConfig`, including its parts, before publishing the current configuration.

That is the right contract.

However, current BaseTool assigns:

```js
this.config = newConfig;
```

inside `BaseTool.updateRuntimeConfig()`.

Current TextTool then continues its own work **after**:

```js
super.updateRuntimeConfig();
```

So the desired 16B contract cannot be achieved merely by moving fields inside TextTool while leaving the BaseTool publication boundary unchanged.

## Required implementation constraint

BaseTool needs one clear pre-publication completion point that allows TextTool to finish its current config before `this.config` becomes current.

Do **not** solve this by copying the whole BaseTool JavaScript evaluator into TextTool.

Do **not** create a second Text config pipeline.

A small explicit completion/evaluation boundary in the normal BaseTool runtime-config route is appropriate, provided that:

- it is not called virtually from the BaseTool constructor;
- the default path for ordinary tools remains simple;
- TextTool uses it only because its part evaluation is context-dependent;
- `this.config` is assigned once to the complete current configuration.

The exact helper name is less important than preserving this one route.

---

# 4. ADAPT — Record the Text field ownership before movement

The plan already requires an ownership report in Pass A. That report should explicitly map the current TextTool fields before implementation.

A useful target is:

| Current TextTool field | Target | Action |
| --- | --- | --- |
| `sourceTextParts` | `sourceConfig.text` | REMOVE separate owner |
| `activeTextParts` | `config.text` | REMOVE separate owner |
| `activeTextPartsSignature` | change signal only, if still needed | ADAPT or REMOVE |
| `textParts` | `runtime.textParts` | MOVE |
| `config.svg` | `geometry.svg` | MOVE |
| `textFitScale` | `geometry.textFitScale` | MOVE |
| `characterWidthFactor` | `geometry.characterWidthFactor` | MOVE |
| `textFontSize` | `geometry.textFontSize` | MOVE |
| estimated/measured bounds | `geometry.*` | MOVE |
| `hasExactMeasurement` | `geometry.hasExactMeasurement` | MOVE |
| `textMeasurementSignature` | `geometry.textMeasurementSignature` | MOVE |
| `widthMeasurementParts` | runtime measurement content | MOVE |
| `widthOverflowParts` | runtime displayed overflow result | MOVE |
| width measurement result/signature | geometry/change signal | ADAPT |
| measurement DOM element arrays | lifecycle/DOM ownership | KEEP outside config/runtime/paint |
| `widthOverflowRevision` | async request identity | KEEP |
| `widthMeasurementScheduled` | async lifecycle | KEEP |
| `widthMeasurement` | async lifecycle | KEEP |
| `widthOverflowPending` | async measurement lifecycle | KEEP |
| `textClosed` | connection lifecycle | KEEP |

Do not create a generic:

```text
cache
measurementState
lifecycleState
```

object merely to group these fields.

Existing meaningful lifecycle fields can remain explicit.

The point is to prevent Pass B from deciding ownership by appearance rather than function.

---

# 5. KEEP — Atomic BaseTool entity/runtime migration

The proposed common migration is correct:

```text
this.entity
this.entityConfig
```

becomes:

```text
runtime.entity
runtime.entityConfig
```

for BaseTool consumers.

This should be atomic.

BaseTool should create the common runtime object once.

Migrated subclasses must extend it rather than replace it.

Conceptually:

```js
this.runtime = {
  entity: undefined,
  entityConfig: undefined,
};
```

and later:

```js
Object.assign(this.runtime, {
  state: '',
  uom: '',
});
```

rather than:

```js
this.runtime = {
  state: '',
  uom: '',
};
```

The plan already calls this out and should keep doing so.

## Important staging exception

Sparkline series items that currently own:

```text
item.entity
item.entityConfig
```

are separate domain objects and must remain unchanged.

Likewise Horseshoe's existing legacy:

```text
runtimeConfig
activeItemConfig
```

belongs to the still-unmigrated Horseshoe configuration route and remains until Plan 19.

Do not accidentally treat `runtimeConfig` as duplicate of the new common:

```text
runtime.entity
runtime.entityConfig
```

during 16B Pass B.

That temporary coexistence is intentional staging.

---

# 6. KEEP — Text runtime and geometry direction

The proposed ownership is correct:

```text
config.text
→ completed current part configuration

runtime.textParts
→ displayed text result

geometry
→ coordinates, estimates, exact bounds, fit and text metrics
```

Keep the existing:

- character wrap algorithm;
- width wrap algorithm;
- ellipsis behavior;
- fit scaling;
- bounding-box measurement;
- font-settling loop;
- stale-result rejection;
- disconnect/reconnect handling;
- previous exact geometry while replacement width measurement is pending;
- Rectangle correction render.

This is ownership movement, not a measurement rewrite.

---

# 7. KEEP / TEST — Parent paint semantics

The plan correctly preserves the Plan-15B/#841 contract:

```text
config.styles
→ configured child styles

paint.styles
→ complete parent-resolved replacement

paint.styles ?? config.styles
→ BaseTool style input
```

TextTool must not merge `config.styles` back into `paint.styles`.

Text part/source/state-map/color-stop/animation priority then continues at the existing later boundaries.

The proposed test coverage is appropriate.

The characterization should explicitly include at least one case where:

```text
outer paint font metric changes
+
displayed text stays identical
```

and one case where effective part/source styling changes the metric while the text value stays equal.

The signature must represent **effective measurement input**, not merely outer `paint.styles`.

Repeating the same effective paint must not restart asynchronous width measurement.

---

# 8. KEEP — `text-tool-geometry.js` staging

Correct:

- migrate TextTool to `geometry`;
- keep the shared accessor;
- remove only its dual-storage compatibility branch once TextTool is migrated;
- retain unrelated group-origin compatibility needed by later families.

Do not remove the accessor itself if CardTools still benefits from one common measured-text geometry boundary.

---

# 9. KEEP — Color-stop staging

The explicit exception is correct.

16B must not partially migrate active color-stop state to `paint`.

Keep the existing shared storage/algorithms until the planned atomic cutover in Plan 19.

Especially preserve the distinction between:

```text
configured Text parts
```

and:

```text
runtime-selected state_map overrides
```

Do not use 16B to normalize those into one new object.

---

# 10. ADAPT — Avoid the duplicate Rollup in the acceptance wording

The verification section currently says:

```text
before visual approval:
  one Rollup build

after visual approval:
  npm run build
```

But in this repository:

```text
npm run build
=
npm test
+ npm run lint
+ npm run rollup
```

So with no code change between visual approval and acceptance, that performs Rollup twice while the next sentence says not to repeat stages unnecessarily.

Use one of these routes.

If the visual build is unchanged after approval:

```text
before visual approval:
  npm run rollup

after approval:
  npm test
  npm run lint
  affected browser suites
```

Do not rerun Rollup.

If code changes after visual validation:

```text
npm run build
affected browser suites
```

is appropriate because the build is no longer the visually approved one.

---

# 11. KEEP — Five-step implementation staging

The five subissues are a sensible split:

```text
1. characterization
2. common runtime entity migration
3. Text source/current config
4. Text runtime/geometry/paint
5. cleanup/review/acceptance
```

Step 1 should record the exact JavaScript sequence from findings 1 and 2 before Step 3 starts.

That is more important than preserving the current field names.

---

# 12. Final review status

## REWORK before implementation

### REWORK 1

Make the two Text JavaScript contexts explicit while preserving:

```text
one sourceConfig
one config
```

BaseTool must neither detect nor recursively evaluate `sourceConfig.text` as outer JavaScript.

### REWORK 2

Resolve the inline-source order explicitly:

```text
outer eval
→ inline source config update
→ part eval
→ evaluated entity-index binding
→ complete config
→ setState
```

No configuration mutation remains in `setState()`.

## ADAPT

1. Define the BaseTool pre-publication completion boundary.
2. Record the concrete Text field ownership map before movement.
3. Remove the duplicate Rollup from the acceptance sequence.

## KEEP

- overall canonical config architecture;
- BaseTool runtime entity migration;
- no old/new entity aliases;
- separate Sparkline series-item entity ownership;
- Text runtime/geometry ownership;
- async measurement/lifecycle logic;
- parent-paint replacement semantics;
- geometry accessor staging;
- color-stop staging;
- five-step execution split;
- preservation of public YAML and existing calculations.

## Recommendation

After the two REWORK items are incorporated into the plan text, Plan 16B is structurally ready for implementation.

The key invariant should be written into the plan exactly once:

```text
TextTool has one source configuration and one current configuration.
Outer Text fields and Text parts may require separate JavaScript evaluation
because they have different item/entity contexts, but those phases never
become separate persistent configuration owners.
```
