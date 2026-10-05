# Plan 15B — Reference Architecture and Simple Tools

## 1. Goal

Prove the canonical tool architecture on the smallest real tools and turn that proven implementation into the copy-paste reference for every later family.

This plan should contain as little new abstraction as possible. It exists to answer concrete questions in working code:

- how does BaseTool receive the stable **template-visible** tool source without changing the current JavaScript `item` context?
- which existing defaults must remain before source capture/evaluation, and which belong in post-evaluation translation?
- how is the same post-evaluation translator used initially and after JS reevaluation?
- where does derived geometry live?
- how is runtime state represented without colliding with `StateTool.state`?
- how do group/layout changes invalidate geometry without becoming config changes?
- how much existing code is merely moved/renamed?

## 2. Scope

Primary proof tools:

- `ArcTool` — configuration + geometry reference.
- `IconTool` — configuration + geometry + runtime selection + async lifecycle reference.

Then propagate the proven pattern to:

- Circle;
- Line;
- Rectangle;
- Polygon;
- Name;
- Area;
- State.

Supporting changes:

- minimum required BaseTool hook for safe translation;
- `CardTools` geometry lookup;
- `text-tool-geometry.js` temporary compatibility adaptation; removal is deferred to 16B after TextTool migrates.

## 3. Non-goals

Do not redesign:

- shape math;
- path generators;
- StateTool formatting;
- icon loading;
- text measurement;
- Rectangle fit semantics;
- public YAML.

## 4. Target reference shape

A simple geometry tool should become recognisable as:

```text
constructor
  → prepare the same template-visible source current JS sees
  → super with sourceConfig + translator contract
  → tool-specific local resource setup

prepareSourceConfig(config)  // only where current behaviour requires it
  → preserve template-visible defaults/completion
  → sourceConfig

translateConfig(config)
  → post-evaluation public-to-internal normalization
  → post-evaluation defaults/completion
  → validation
  → complete canonical config

updateRuntimeConfig()
  → super.updateRuntimeConfig()
  → update geometry on config/group change
  → update paint only if needed

setState(...)
  → runtime only, if the tool is entity-bound

render()
  → config + geometry + runtime/paint
```

## 5. Pass A1 — establish the safe translator mechanism

The first implementation step is deliberately small.

BaseTool must be able to own the semantic current-config route:

```text
prepared template-visible source
→ sourceConfig
→ evaluate using the established item/context
→ translate
→ this.config
```

without invoking an overridden method before subclass initialization.

Acceptable directions include an explicitly supplied pure/static translator plus, where required, a small pure source-preparation function.

Requirements:

- characterize the current JavaScript-visible `item` before moving defaults;
- defaults/completion that current JS can observe remain in pre-source preparation;
- post-evaluation normalization/validation goes through the common translator;
- initial and JS reevaluation preserve the same source/evaluation/translation order;
- no persistent third current config is introduced;
- not-yet-migrated families can remain functional during the staged plan without becoming permanent alternate architecture;
- the result does not require a validator registry or generic framework.

### Required Arc characterization

Before changing Arc construction, add/retain a test proving the current ordering:

```text
radius omitted
source/template item sees radius = 45
`item.radius * 2` evaluates to 90
```

Also cover an explicit radius so the default does not incorrectly override authored input.

If a proposed BaseTool mechanism is more complex than the simple tools it supports, reject it and choose a smaller design.

## 6. Pass A2 — Arc reference

### Current

```text
constructor
  arcConfig = defaults + config
  super(arcConfig)
  config.svg = calculateSvgDimensions()
```

### Target

```text
compiled Arc item
→ Arc source preparation (xpos/ypos/radius/arc defaults that are currently JS-visible)
→ sourceConfig
→ JS evaluation
→ Arc translator
→ this.config

this.geometry.svg = calculateSvgDimensions(this.config)
```

Keep the current `calculateSvgDimensions()` calculations semantically unchanged.

The reference should make the main lifecycle obvious, for example:

```js
updateRuntimeConfig() {
  super.updateRuntimeConfig();

  if (this.configurationChanged || this.groupChanged) {
    this.updateGeometry();
  }
}
```

Do not extract `updateGeometry()` merely for symmetry if the direct assignment is more readable. The canonical owner matters more than forcing identical function counts.

## 7. Pass A3 — Icon runtime reference

Icon proves the same architecture with current state and asynchronous resources.

Preserve:

- `config.state_map` as configured state mapping;
- state-map matching behaviour;
- HA/entity icon selection;
- external SVG/image handling;
- `HomeAssistantIconPath` lifecycle;
- connected/disconnected cleanup.

Change:

```text
config.svg → geometry.svg
```

The currently selected map entry may be:

- local to the function when only needed once; or
- `runtime.stateMapItem` if multiple lifecycle stages reuse it.

Do not create a persistent merged `renderConfig` or similar object.

## 8. Pass A4 — remaining simple shapes

### Circle

- preserve radius/default preparation before `sourceConfig` where current JS can observe it; move only safe post-evaluation completion into canonical translation;
- move SVG dimensions to geometry;
- preserve legacy `radius` / `radius_percent` behaviour.

### Line

- keep legacy `lines` / `hlines` / `vlines` routing;
- classify Line defaults/legacy routing by current JS visibility; preserve any template-visible preparation before `sourceConfig` and move only safe post-evaluation work into translation;
- perform only the post-evaluation orientation/default completion in the same translator used after JS reevaluation;
- move SVG geometry out of config;
- preserve from/to calculations.

### Rectangle

- classify `fill_mask`, referenced-dimension padding and fit defaults by current JS visibility; preserve template-visible source preparation and translate the remaining completion once;
- move SVG/path-ready dimensions to geometry;
- preserve `getItemWidth`, `getItemHeight`, fit and measurement timing;
- do not freeze geometry before measured text has had its normal correction pass.

### Polygon

Preserve any template-visible `fill_mask` / `radius` defaults before `sourceConfig`; keep validation and path construction after the normal evaluation/translation boundary as current behaviour requires.

Current:

```text
config.svg
pathConfig
pathDefinition
```

Target:

```text
geometry.svg
geometry.pathInput
geometry.pathDefinition
```

Keep:

- sides/top validation;
- maximum radius check;
- `buildPolygonPathDefinition()`;
- group coordinate calculation.

## 9. Pass A5 — Name, Area and State

These tools prove that the same owner model works for measured text.

Their current `xpos` / `ypos` and State `show.uom` defaults are applied before BaseTool and may be visible to JavaScript. Characterize and preserve that source/evaluation order while moving only storage ownership.

### Name

```text
runtime.name
geometry.svg
geometry.estimatedWidth/Height
geometry.measuredWidth/Height
geometry.measuredXpos/Ypos
```

### Area

Same structure using `runtime.area`.

### State

```text
runtime.state
runtime.uom
geometry.*
```

This removes the semantic ambiguity where `StateTool.state` looks like a generic architecture state.

Preserve:

- formatting;
- UOM placement;
- estimated measurements;
- `getBBox()` correction;
- presentation change behaviour.

## 10. Paint/style reference contract

15B must establish the storage/API shape that Controls will later use without mutating child config.

For tools with runtime/parent-driven style replacement:

```text
config.styles    stable configured styles
paint.styles     current runtime/parent style map when present
```

The effective-style path must behave as if the current code had replaced `config.styles`, but without actually mutating config.

A small method such as `setPaintStyles(styles)` is preferred over direct parent knowledge of child internals. Its exact implementation should remain minimal.

Do not redesign style priority. Before the Controls migration, characterize overlap cases where the same property exists in parent state styles and child configured styles. The migrated route must reproduce the same final effective map.

Name/Area/State/Text measurement signatures must ultimately be based on **effective styles**, so font-metric changes caused by paint invalidate measurement geometry. TextTool completes this proof in 16B.

## 11. Pass A verification

After the mechanical ownership changes, run the focused tests before cleanup.

Failures at this stage should be traceable to:

- wrong field path;
- missed group invalidation;
- wrong source boundary;
- measurement ordering;
- or an unsafe translation hook.

Do not begin cleanup until Pass A is green.

## 12. Pass B — post-migration simplification

With the simple text-like tools now exposing canonical geometry, re-audit their local duplication.

### `text-tool-geometry.js` — deliberately retained in 15B

TextTool itself does not migrate until 16B, so this adapter **cannot be removed in 15B**.

During 15B it becomes the single explicit compatibility bridge:

```text
Name / Area / State  → read canonical tool.geometry
TextTool              → read the current pre-16B Text geometry representation
```

Do not spread this compatibility logic into callers.

Removal/reduction is owned by **16B Pass B**, after TextTool publishes the same geometry contract.

### Simple-tool cleanup

Remove only what became redundant:

- duplicated geometry fields;
- old comments that call derived SVG “config”;
- wrappers whose only job was forwarding historical storage;
- signatures that no longer compare unique concepts.

Do not rewrite calculations.

## 13. Tests

At minimum:

- `svg-geometry.browser.spec.js`;
- polygon Node/browser tests;
- StateTool formatting and decimals tests;
- icon source/async tests;
- config-ref browser tests;
- any Rectangle fit/measurement coverage touched by the move.

Run focused tests after Pass A and after Pass B.

## 14. Definition of Done

- Arc is a clean copy-compatible geometry reference.
- Icon is a clean copy-compatible runtime/async reference.
- simple tools expose canonical geometry rather than `config.svg`.
- defaults/validation use the same translation semantics initially and after JS evaluation.
- Name/Area/State use `runtime` and `geometry` recognisably.
- the implementation does not require a compatibility config alias.
- existing calculations and visible results are unchanged.
