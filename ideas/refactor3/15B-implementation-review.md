# Plan 15B — Implementation Review

Date: 2026-10-01  
Repository: `AmoebeLabs/flex-horseshoe-card`  
Baseline: `dd89eb08f029400730ce59a4112be34bba44deeb`  
Reviewed merge commit: `83c6206e11454a456a665891f13222ad4636d7c1`  
PR: `#839 — feat: canonical simple-tool configuration and geometry (Plan 15B)`

## Result

Plan 15B is structurally sound. The migrated tools follow the intended ownership model and the implementation preserves the important JavaScript/default ordering.

One concrete issue remains in the staged paint interface:

- **REWORK:** Icon loses `state_map.styles` as soon as `paint.styles` is present.

This is not currently a visible production regression because `setPaintStyles()` has no production parent callers yet. It becomes a real regression when Controls migrate to `paint.styles` in Plan 17B, and the same precedence rule must be kept in mind while TextTool is migrated in 16B.

The rest of the reviewed 15B architecture can remain.

## Review findings

| Classification | Area | Finding | Action |
| --- | --- | --- | --- |
| **REWORK** | Icon paint/state-map precedence | `paint.styles` currently bypasses `renderItem.styles`, so `state_map.styles` disappears when paint is active. | Fix before production use of `setPaintStyles()`. |
| **ADAPT** | Paint API contract/tests | Replacement semantics are valid only if `paint.styles` is explicitly the **complete parent-resolved effective child style map**. Current tests make a partial replacement look like the intended caller contract. | Clarify comments/tests; do not redefine paint as an ordinary partial override by accident. |
| **KEEP** | BaseTool config lifecycle | Explicit pure `translateConfig` avoids constructor virtual dispatch and preserves a single `this.config`. | No change. |
| **KEEP** | JS/default ordering | Tool defaults remain in `sourceConfig` before template evaluation. | No change. |
| **KEEP** | Geometry/runtime ownership | Migrated derived SVG/measurement data is under `geometry`; displayed values are under `runtime`. | No change. |
| **KEEP** | Local render merge | Icon's local `renderItem = Merge.mergeDeep(config, stateMapItem)` is transient render data, not a second persistent config owner. | Keep it or simplify only if behavior remains identical. |
| **KEEP** | Text compatibility bridge | `text-tool-geometry.js` is still required while TextTool remains on the old storage model. | Remove only in 16B when TextTool no longer needs it. |
| **KEEP** | Staged consumers | ControlNumber and Sparkline use the migrated StateTool geometry/runtime fields without redesigning their own architecture. | No change. |

---

## 1. REWORK — Icon drops state-map styles when paint is active

### Historical behavior

Before 15B, Controls first built the complete effective child style map with `Merge.mergeDeep()` and assigned it to the child config.

For example, ControlSelect used the equivalent of:

```js
iconTool.config.styles = Merge.mergeDeep(
  ConfigHelper.toStyleDict(optionStyle.icon.styles),
  ConfigHelper.toStyleDict(this.optionIconBaseStyles[optionIndex]),
  {
    transition: `fill ${transition}, color ${transition}, opacity ${transition}`,
  },
);
```

`Merge.mergeDeep()` is left-to-right, with later values winning. Therefore the historical control precedence is:

```text
selected/unselected or active/inactive parent style
→ child/base configured style
→ transition
```

Icon then applied its state map afterwards:

```js
const renderItem = smItem
  ? Merge.mergeDeep(item, smItem)
  : item;

let configStyle = ConfigHelper.toStyleDict(renderItem.styles);
```

Therefore `state_map.styles` historically overrides the effective child/control styles.

After that, Icon applies color stops and animation styles.

For overlapping paint properties the effective historical order is therefore approximately:

```text
HA/default icon paint
→ parent control visual style
→ child/base configured style
→ state_map.styles
→ color-stop paint
→ animation styles
→ final color-filter/render processing
```

### Current 15B behavior

15B changed Icon to:

```js
let configStyle = ConfigHelper.toStyleDict(
  this.paint?.styles ?? renderItem.styles
);
```

Once `paint.styles` exists, `renderItem.styles` is no longer read at all.

That means a state map can still change fields such as icon, flip, animation id or color filter through `renderItem`, but its `styles` block is ignored.

### Why this matters

Today this is dormant because `setPaintStyles()` has no production parent caller. The current Controls still mutate child `config.styles` through their old route.

When Plan 17B replaces that mutation with `setPaintStyles()`, Icon state-map style precedence changes unless this is corrected first.

This violates the 15B requirement to preserve the existing selected-child style merge priority.

### Recommended fix

Do **not** build another persistent or semi-persistent effective config.

Keep `renderItem` for the ordinary state-map config overrides, but resolve styles separately:

```js
let configStyle;

if (this.paint?.styles === undefined) {
  configStyle = ConfigHelper.toStyleDict(renderItem.styles);
} else {
  configStyle = Merge.mergeDeep(
    ConfigHelper.toStyleDict(this.paint.styles),
    ConfigHelper.toStyleDict(smItem?.styles ?? {}),
  );
}
```

Then keep the existing color-stop and animation pipeline unchanged.

This gives:

```text
paint.styles
→ state_map.styles
→ color stops
→ animation
```

when parent paint is active, which reproduces the old ordering without constructing:

```text
config
→ config + paint
→ config + paint + state-map
```

### Required regression test

Add an Icon test with all three layers present:

```text
configured/base child styles
parent paint styles
state_map.styles
animation styles
```

The test should prove that:

```text
parent publishes the already-resolved child/control style map
state_map still overrides matching paint properties
animation remains final
config.styles remains unchanged
```

---

## 2. ADAPT — define `paint.styles` as complete effective parent paint

The old implementation confirms an important distinction.

Controls did **not** simply apply a partial parent style after the child's configured styles. They first merged the parent visual state with the child's stored base styles, then assigned the resulting complete map to the child.

Therefore this 15B model is valid:

```text
config.styles = configured/base child style
paint.styles  = complete style map resolved by the parent
```

and BaseTool may select:

```js
this.paint?.styles ?? this.config.styles
```

without automatically merging the two again.

### What should not be done

Do not blindly change BaseTool to:

```js
Merge.mergeDeep(this.config.styles, this.paint.styles)
```

if `paint.styles` remains a complete effective map.

That would mix two different contracts and makes it unclear whether the parent or child owns precedence resolution.

It can also encourage 17B to pass only selected/unselected overrides, which would reverse historical priority for explicitly configured child styles if paint is then applied last.

### Current test weakness

The 15B BaseTool test currently calls:

```js
setPaintStyles({
  stroke: 'paint',
  'font-size': '20px',
});
```

and expects configured `fill` to disappear.

That correctly tests **replacement**, but it does not demonstrate the real historical parent contract, because old Controls produced a complete merged child style map before publishing it.

The browser test does the same with NameTool: it supplies only a new font size and fill.

These tests are useful for proving that config is not mutated, but they make it too easy to interpret `paint.styles` as an ordinary partial override.

### Recommended adjustment

Keep replacement semantics, but make the API description explicit:

> `paint.styles` is the complete effective style map published by a parent after applying that parent's existing merge precedence. It replaces `config.styles` at the child render boundary; it is not a partial override dictionary.

Update test naming accordingly.

For example:

```text
BaseTool uses parent-resolved paint styles without mutating configured styles
```

instead of:

```text
BaseTool paint styles replace configured styles
```

A test may still prove replacement behavior, but it should also contain a realistic complete parent-resolved style map.

---

## 3. KEEP — BaseTool configuration lifecycle

The new BaseTool route matches the intended architecture:

```text
sourceConfig
→ local evaluated newConfig
→ translateConfig
→ this.config
```

Important properties are correct:

- `sourceConfig` is cloned before tool-specific translation.
- The translator is supplied explicitly instead of dispatching to a subclass method from the BaseTool constructor.
- Changed JavaScript output is translated before publication to `this.config`.
- Unchanged evaluated output retains the current `this.config` object identity.
- No `runtimeConfig`, `activeConfig`, `effectiveConfig` or equivalent second persistent configuration owner was introduced.

No redesign is needed here.

---

## 4. KEEP — defaults remain visible to JavaScript

Arc is the important reference case.

Defaults are still applied before BaseTool captures `sourceConfig`:

```js
const arcConfig = {
  xpos: 50,
  ypos: 50,
  radius: 45,
  arc_degrees: 260,
  rotate: 0,
  flip: 'none',
  ...config,
};
```

Therefore template code such as:

```js
[[[ return item.radius * 2; ]]]
```

still sees `radius: 45` when the user omitted it.

The new tests explicitly cover the omitted and explicit radius cases and preserve config identity on equal reevaluation.

This is the required behavior and should remain unchanged in later plans.

---

## 5. KEEP — geometry/runtime ownership

The simple tools now consistently use the intended owners:

```text
config    = accepted/current general configuration
geometry  = derived SVG/path/measurement data
runtime   = current displayed/entity-derived data
paint     = parent-driven presentation
```

Reviewed migrations:

```text
Arc        config.svg → geometry.svg
Circle     config.svg → geometry.svg
Line       config.svg → geometry.svg
Rectangle  config.svg → geometry.svg
Polygon    config.svg/pathConfig/pathDefinition
           → geometry.svg/pathInput/pathDefinition
Icon       config.svg → geometry.svg
           selected state-map entry → runtime.stateMapItem
Name       name + measurements → runtime.name + geometry.*
Area       area + measurements → runtime.area + geometry.*
State      state/uom + measurements → runtime.state/runtime.uom + geometry.*
```

No migrated production consumer was found still depending on the old `config.svg` or direct StateTool measurement paths.

The remaining `config.svg` usage in Controls, TextTool, Horseshoe and other unmigrated families is expected staging for later plans.

---

## 6. KEEP — transient Icon `renderItem` is not an effective config owner

This remains acceptable:

```js
const renderItem = smItem
  ? Merge.mergeDeep(this.config, smItem)
  : this.config;
```

`renderItem` is local to the presentation/render operation. It is not stored on the tool and does not create a second lifecycle/configuration source.

It also preserves the existing state-map behavior for non-style fields.

The paint fix should therefore resolve the style layers separately rather than introducing a stored `paintItem`, `effectiveConfig`, `renderConfig` or similar object.

---

## 7. KEEP — measured text migration

Name, Area and State correctly moved:

```text
formatted display content → runtime
measurement cache/results → geometry
```

Their measurement signature now follows the effective render styles through `getStyles()` and is invalidated when `setPaintStyles()` changes the effective style map.

Rectangle still recalculates fit geometry during render after browser measurement, preserving the existing correction cycle instead of freezing text fit at configuration time.

The duplicated `setPaintStyles()` overrides in Name/Area/State are justified for now because each must trigger text-measurement invalidation. Do not introduce a new generic hook solely to remove these three small methods before the TextTool migration establishes the final shared shape.

---

## 8. KEEP — `text-tool-geometry.js` compatibility bridge

The adapter is doing exactly the required staged job:

```text
migrated Name/Area/State → tool.geometry
legacy TextTool          → direct measurement fields + config.svg
```

Removing it in 15B would force a partial TextTool migration and widen the functional scope.

Keep it through 15B. Re-evaluate and remove it in 16B only after TextTool owns the same geometry structure directly.

---

## 9. KEEP — ControlNumber and Sparkline changes are bounded consumer adaptations

The ControlNumber changes only redirect StateTool reads:

```text
textMeasurementSignature → geometry.textMeasurementSignature
config.svg center         → geometry.svg center
```

The Sparkline formatter only redirects temporary StateTool formatting output:

```text
state/uom → runtime.state/runtime.uom
```

Neither change introduces a second configuration model or redesigns those families early.

This is appropriate 15B staging.

---

## 10. Pass-B cleanup assessment

No broad cleanup rework is required.

### KEEP

- explicit `translateConfig` argument in BaseTool;
- tool-local geometry rebuilds;
- `runtime.stateMapItem` caching in Icon;
- `text-tool-geometry.js` bridge;
- local Icon `renderItem`;
- measured text paint invalidation overrides;
- current active color-stop storage.

### REMOVE / avoid

Do not add:

```text
runtimeConfig
effectiveConfig
activeConfig
paintItem stored on the instance
renderConfig stored on the instance
```

Do not move active color-stop state into `paint` during 15B/16B/17B/18B piecemeal; keep that for the planned atomic Path/Horseshoe integration.

### ADAPT

Only the paint/state-map precedence and its API documentation/tests need adjustment.

---

## Required follow-up before 17B

1. **Fix Icon paint + state-map style composition.**
2. **Add a regression test for `paint.styles → state_map.styles → color stops → animation`.**
3. **Clarify that `setPaintStyles()` accepts a complete parent-resolved style map.**
4. **In 17B, preserve the old Control merge order when replacing `child.config.styles = ...` with `child.setPaintStyles(...)`.**
5. **In 16B, do not let the TextTool migration accidentally bypass state-map/part style precedence when paint support is connected.**

The old Control merge itself should be **PRESERVED**. The 17B adaptation is only where its result is published:

```text
OLD
parent merge → child.config.styles

NEW
parent merge → child.setPaintStyles(result)
```

The merge order should not be redesigned as part of that move.

---

## Final assessment

Plan 15B does not need architectural rollback.

The core model is correct:

```text
sourceConfig
→ local newConfig
→ translateConfig
→ this.config

this.config + layout/group → geometry
this.config + HA state     → runtime
this.config + presentation → paint
```

The single outstanding issue is a layer-precedence bug in the staged Icon paint path. Fix that boundary and keep the rest of 15B as the reference implementation for 16B/17B.
