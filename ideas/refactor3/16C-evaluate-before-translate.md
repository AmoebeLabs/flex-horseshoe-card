# Plan 16C — Evaluate JavaScript Before Translation

Date: 2026-10-02

Baseline:

```text
918587917d0d306709edff4a05b1a0de226228cb
```

Status: execution plan drafted. This plan is a prerequisite for Plan 17B.

## 1. Goal

Correct the remaining generic configuration-ordering defect in BaseTool:

> A tool-specific translator/validator must never receive unresolved JavaScript
> template syntax for a field that is allowed to be dynamic.

The canonical configuration route is:

```text
template-visible source preparation
→ sourceConfig
→ JavaScript evaluation when present
→ local newConfig
→ pure translation / validation
→ completeRuntimeConfig()
→ this.config
```

For static configuration the JavaScript step may be skipped, but the semantic
ordering remains the same:

```text
sourceConfig
→ pure translation / validation
→ this.config
```

Translation always consumes concrete configuration values.

This plan restores the existing FHS dynamic-configuration contract. It does not
introduce a second config owner, candidate state, last-valid-config recovery, or
a new JavaScript syntax.

## 2. Why this plan exists

BaseTool currently captures source correctly:

```js
this.sourceConfig = structuredClone(config);
this.hasJavascript = templates.hasJavascriptTemplates(this.sourceConfig);
```

but then immediately does:

```js
this.config = translateConfig ? translateConfig(config) : config;
```

even when `hasJavascript === true`.

That means a translator may receive literal template text such as:

```yaml
orientation: '[[[ return "vertical"; ]]]'
```

before the normal JavaScript evaluation phase.

This conflicts with the public/runtime model already demonstrated by:

```text
Horseshoe:
fhs_input_select → JavaScript → show.horseshoe_style / bar_mode

Sparkline:
runtime input → JavaScript → sparkline.show.chart_type
```

and with existing schema contracts such as:

```text
Line orientation     enum OR JavaScript
Polygon sides        integer OR JavaScript
Rectangle fill_mask  number/auto OR JavaScript through dynamic numeric values
BaseTool zpos/dzpos  dynamicNumber
BaseTool entity_index common.entityIndex including JavaScript
```

The problem is therefore generic lifecycle ordering, not a Control-specific
exception.

## 3. Scope

### In scope

- BaseTool translator ordering.
- Existing BaseTool `translateConfig` consumers:
  - LineTool;
  - RectangleTool;
  - PolygonTool.
- Generic BaseTool fields whose public schema already allows JavaScript but whose
  runtime alias/value is currently captured before evaluated config publication.
- Architecture tests that currently encode constructor-time translation for
  dynamic source.
- Focused schema/runtime consistency assertions for already-documented dynamic
  fields.

### Out of scope

- Control subtype preset/style completion. Plan 17B owns that.
- Sparkline family ownership cleanup. Plan 18B owns that.
- Horseshoe canonical owner cleanup. Plan 19 owns that.
- Shared active color-stop owner migration.
- New template syntax or new template context objects.
- A general configuration acceptance/recovery framework.

## 4. BaseTool target route

### 4.1 Static source

When the finalized source contains no JavaScript:

```text
prepared config
→ sourceConfig
→ translateConfig(sourceConfig/current static input)
→ this.config
```

Static invalid values retain immediate validation behavior.

The constructor may continue to translate static configuration once.

Group/theme-only updates do not rerun translation.

### 4.2 JavaScript source

When the finalized source contains JavaScript:

```text
prepared config
→ sourceConfig
→ constructor retains only source-safe working values
→ first active runtime-config pass
→ evaluate sourceConfig
→ local evaluatedConfig
→ translateConfig(evaluatedConfig)
→ completeRuntimeConfig()
→ this.config
```

The translator is **not** called against the unresolved source during
construction.

Every later actual JavaScript change follows the same route:

```text
sourceConfig
→ evaluate
→ compare evaluated signature
→ translate only when evaluated config changed
→ publish this.config
```

Equal evaluation retains the existing current config object and does not rerun
translation.

### 4.3 Constructor working state is not another config owner

Some current tool constructors calculate provisional geometry before the first
Home Assistant/runtime configuration pass.

Do not introduce:

```text
pendingConfig
candidateConfig
runtimeConfig
preTranslatedConfig
```

to solve this.

For JavaScript-backed tools the constructor may temporarily expose the existing
source-prepared object through `this.config` where old constructors require it,
but it is not treated as the first complete translated current configuration.

The lifecycle invariant is:

> Before `setState()` or ordinary runtime consumption, `updateRuntimeConfig()`
> has evaluated, translated and published the complete current config.

This is the same publication boundary established by 16B.

## 5. Translator contract

`translateConfig` remains:

- pure;
- independent of subclass instance state;
- free of geometry;
- free of paint;
- free of HA runtime state;
- invoked only with concrete/evaluated configuration values.

A translator may:

- validate evaluated enum/selectors;
- normalize evaluated public shapes;
- fill safe post-evaluation structural defaults;
- return a new completed config object where required.

A translator must not:

- inspect unresolved `[[[ ... ]]]` strings as if they were final values;
- perform geometry calculations;
- create generated SVG/resource IDs;
- inspect the subclass instance;
- mutate `sourceConfig`.

## 6. Existing translator consumers

### 6.1 LineTool

Current translator validates:

```text
orientation ∈ horizontal | vertical | fromto
```

The schema already allows JavaScript for `orientation`.

Required characterization:

```yaml
orientation: vertical
```

and:

```yaml
orientation: '[[[ return "vertical"; ]]]'
```

must reach the same translated current config before geometry is used.

Also verify a runtime change:

```text
horizontal → vertical → fromto where the corresponding geometry inputs are valid
```

without translator execution against template syntax.

### 6.2 RectangleTool

Current translator validates evaluated `fill_mask`.

A JavaScript-backed numeric/`auto` value must be evaluated first, then validated.

Preserve existing width/height/fit source preparation and geometry behavior.

### 6.3 PolygonTool

Current translator validates/completes:

```text
sides
width
height
radius
top
fill_mask
```

`top` completion depends on evaluated `sides`, so both belong after evaluation.

At minimum characterize:

```yaml
sides: '[[[ return 6; ]]]'
top: '[[[ return 2; ]]]'
```

and prove the resulting canonical config/geometry matches the equivalent static
configuration.

## 7. Generic BaseTool dynamic aliases

Audit BaseTool fields that are copied into direct runtime aliases before the
first evaluated config publication.

### `entity_index`

The schema uses `common.entityIndex`, which accepts JavaScript.

Current constructor assignment:

```js
this.entity_index = config.entity_index ?? defaultEntityIndex;
```

must not leave the tool permanently bound to the unresolved source value.

After complete current config publication, synchronize the live binding from:

```text
this.config.entity_index ?? defaultEntityIndex
```

when configuration actually changes.

Do not create recursive template evaluation. A dynamic `entity_index` template
still evaluates in the existing template context; tests should use context that
does not require the unresolved item's own `state/entity`, for example
`entities`, `entity_slots`, `constants`, `states`, or other non-circular inputs.

Generated child tools that intentionally manage entity binding separately keep
their existing family-specific rules.

### `zpos` / `dzpos`

These are already recomputed after current config publication:

```js
this.zpos = Number(this.config.zpos) + Number(this.config.dzpos);
```

Add regression coverage proving JavaScript-backed values become concrete before
the published render layer is used.

Do not add a second z-position owner.

### Other generic fields

Audit constructor-time reads of schema-dynamic BaseTool fields. Fix only cases
where the raw source value is retained/validated as though it were final.

Do not broaden `group`, IDs, reuse addresses, or other fields whose public
contract is not dynamic.

## 8. Error timing

Preserve static validation timing.

For JavaScript-backed fields:

```text
template syntax
→ evaluate
→ validate evaluated result
```

Therefore an invalid dynamic result fails when the first/current evaluated
configuration is completed, not earlier merely because the raw value is a
template string.

This is intentional and is the correct dynamic equivalent of static
validation.

Do not retain an invalid previous config as recovery behavior in this plan.

## 9. Tests

Update `tool-config-architecture.test.js` so it no longer asserts that a
translator runs once in the constructor for a JavaScript-backed source.

Required BaseTool translator assertions:

```text
static source:
  constructor translations = 1

dynamic source before first active pass:
  constructor translations = 0

first active pass:
  evaluate = 1
  translate = 1
  translator input contains concrete values

unchanged later evaluation:
  current config identity retained
  no additional translation

changed later evaluation:
  evaluate
  translate once
  publish new current config

group/theme-only change:
  no translation solely for geometry/paint changes
```

Add direct real-tool regressions for:

- Line dynamic `orientation`;
- Rectangle dynamic `fill_mask`;
- Polygon dynamic `sides` and `top`;
- dynamic invalid translated values;
- dynamic `entity_index` publication/binding;
- dynamic `zpos/dzpos`.

Where practical, compare static and JavaScript forms of the same value and
assert identical canonical config/geometry after the active config pass.

## 10. Pass B audit

After the ordering fix is green:

- remove comments/tests that describe constructor-time translation of unresolved
  dynamic source as intentional;
- remove any redundant translator guards added only to tolerate template strings;
- do not create helper layers merely to hide the ordering;
- keep source preparation and translation visibly separate.

No generic "configuration engine" is introduced.

## 11. Verification

Run:

1. focused BaseTool/config-architecture tests;
2. Line/Rectangle/Polygon focused tests;
3. relevant card lifecycle/group tests;
4. full Node tests and lint;
5. affected browser geometry tests in Chromium, WebKit and Firefox;
6. Rollup/build for visual verification if product inputs changed.

Record exact results in the implementation review.

## 12. Definition of Done

- `translateConfig` never receives unresolved JavaScript source.
- Static translation still happens once with current failure behavior.
- Dynamic config evaluates before translation.
- Equal evaluations retain config identity and avoid repeated translation.
- Line/Rectangle/Polygon documented dynamic translated fields work through the
  canonical route.
- BaseTool direct aliases do not retain stale unresolved values for already
  documented dynamic fields.
- No second persistent config owner is introduced.
- `setState()` always receives a complete evaluated/translated current config.
- No Control/Sparkline/Horseshoe family migration is pulled forward.

Plan 17B starts only after this generic ordering is merged and reviewed.
