# Review — Plan 17: Control configuration simplification

Reviewed plan: `2026.09.28 - 17 - Control configuration simplification`  
Reviewed code baseline: `55cf29d1619b1b7acfdf942c457b10b0678977e8`

## Overall assessment

Plan 17 is now pointed in the right direction.

The most important rule is stated clearly:

> Plan 17 is a simplification refactor. Existing YAML, JavaScript behavior, Home Assistant state handling, rendering, interaction, error behavior and child lifecycle must remain unchanged.

That is the correct boundary.

The current code also supports the plan's main technical assumption: Plan 16 already provides separate `configurationChanged`, `groupChanged` and `themeModeChanged` signals, while `configChanged` is deliberately still the combined compatibility signal for tool families that have not yet been simplified.

Plan 17 should therefore simplify Controls by using those existing signals more precisely. It should **not** create a new configuration system, lifecycle, validator layer or error model.

I would make a few changes to the plan before implementation.

---

## 1. Do not imply that Plan 16 validates control-specific configuration

The current wording in section 6 says:

> Remove only repeated public-config completion/checks for which existing constructor or accepted-config work already provides the same result and failure behavior.

This is slightly dangerous.

Plan 16 provides:

- a stable `sourceConfig`;
- the active `this.config`;
- separate change signals.

It does **not** generally validate Button, Number, Select, Slider or Toggle-specific fields.

For example, `BaseTool` does not know whether:

- a Toggle orientation is valid;
- a Slider scale is valid;
- a Select indicator position is valid;
- a Number content mode is valid.

Those rules still belong to the control that currently owns them.

### Recommended wording

Replace the sentence with something closer to:

> Remove only repeated control-configuration work for which the existing control constructor or another existing control-owned path already provides the same result and failure behavior.

This avoids Codex interpreting Plan 16 as a reason to delete control checks that still have only one owner.

---

## 2. Make the intended `configChanged` cleanup explicit

The code currently has this compatibility behavior in `BaseTool`:

```js
this.configChanged =
  this.configurationChanged
  || this.groupChanged
  || this.themeModeChanged;
```

That is exactly why Controls repeat work on group and theme changes.

Plan 17 should explicitly say:

> Do not replace `configChanged` with another broad combined condition everywhere. Decide separately whether the work depends on configuration, group/layout, or theme.

The likely pattern for Controls is:

```text
configuration changed
→ configuration-specific completion/checks
→ rebuild children whose configuration actually changed

configuration changed OR group changed
→ recalculate geometry where group geometry affects SVG coordinates

theme changed
→ only theme-dependent work

always
→ forward the existing child update calls exactly as required
```

This is a simplification of the existing flow, not a new flow.

The exact condition must still be checked per control.

---

## 3. Toggle is the clearest real simplification target

`ControlToggle` currently does this in the constructor:

```js
super(toggleConfig, ...);
this.validateOrientation(this.config.orientation);
this.config = this.buildConfig(this.config);
this.config.svg = this.calculateSvgDimensions();
```

and later:

```js
if (this.configChanged) {
  this.config = this.buildConfig(this.config);
  this.validateOrientation(this.config.orientation);
  this.config.svg = this.calculateSvgDimensions(this.config);
  this.createThumbIconTool();
  this.createControlLabelTextTool(...);
}
```

Because `configChanged` currently also means group or theme change, Toggle repeats `buildConfig()` and `validateOrientation()` when public configuration did not change.

That is a genuine Plan-17 target.

However, **do not delete `buildConfig()` from runtime configuration updates entirely**.

`BaseTool.sourceConfig` is captured by `super(...)` before Toggle performs its post-`super` `buildConfig()` work. Therefore a later JavaScript configuration update can still require `buildConfig()` again.

The safe simplification is:

- `buildConfig()` only when configuration actually changed;
- `validateOrientation()` only when configuration actually changed;
- geometry when configuration or group geometry requires it;
- child recreation only when the child's actual configuration/placement changed;
- theme-only changes must not rerun Toggle config completion just because the old broad flag did.

This distinction should be stated explicitly in the plan.

---

## 4. Button, Number, Select and Slider are different from Toggle

Button, Number, Select and Slider perform most of their defaults, preset selection and public checks **before** calling `super(...)`.

Therefore their completed configuration is already what `BaseTool` receives and stores as `sourceConfig`.

Their `updateRuntimeConfig()` methods mostly use `configChanged` to recalculate geometry and rebuild child tools.

That means Plan 17 should not go looking for control-validation code to centralize in these classes if there is no repeated validation there.

The useful question is instead:

> Which geometry or child rebuilds currently happen only because `configChanged` also includes group/theme changes?

That is where simplification may exist.

Do not force a change in a control family where the audit finds no real duplicate work.

The existing plan already says this in section 8; keep that rule.

---

## 5. `ControlBase.visibility` is probably a condition change, not a deletion

`ControlBase.updateRuntimeConfig()` currently checks:

```js
if (!['visible', 'hidden', 'unavailable'].includes(this.config.visibility)) {
  throw Error(...);
}
```

This check currently runs on every runtime-config pass.

There is no equivalent constructor validation in `ControlBase`.

Therefore this is **not** a safe unconditional deletion.

A reasonable simplification may be to run it only when configuration actually changed:

```js
if (this.configurationChanged) {
  // existing visibility check
}
```

That preserves the existing owner and existing error, but stops repeating the check for group/theme-only updates.

The audit should verify this before changing it.

---

## 6. Slider runtime checks must remain exactly runtime checks

The plan is correct here and should stay strict.

`ControlSlider.setState()` currently resolves:

- `scale.min`;
- `scale.max`;
- `scale.step`;

from either configured literals or current HA attributes.

It then validates the resolved values and separately determines whether the current slider value is numeric.

These are different things.

Preserve:

```text
invalid resolved scale
→ existing error

valid scale + unavailable/unknown/non-numeric current entity value
→ existing non-interactive background-track presentation
```

Do not:

- move HA-derived scale checks into constructor configuration validation;
- treat a missing/non-numeric scale as ordinary unavailable state;
- invent fallback min/max/step values;
- add new recovery behavior.

This part of Plan 17 is already written correctly.

---

## 7. Preserve Select's current HA-derived option behavior

`ControlSelect.setState()` can rebuild `option_map` from:

```js
entity.attributes.options
```

and currently stores that result in `this.config.option_map`.

That may not be the cleanest theoretical ownership model, but it is existing behavior and Plan 17 is not the place to redesign it.

Add one explicit guardrail:

> Do not move HA-derived `option_map` out of `this.config`, introduce a second option state object, or otherwise redesign Select runtime option ownership in Plan 17.

Plan 17 may avoid unnecessary config work around it, but it should not restructure this behavior.

The existing render-time indicator-position error and `ControlContent` item validation should also remain where they are, as the plan already states.

---

## 8. Do not rebuild children merely to make signal handling look uniform

All control families currently forward updates to child tools.

That child forwarding must remain.

But parent child **recreation** and child **update forwarding** are not the same thing.

Plan 17 should distinguish them.

For example:

```text
createNumberContentTools()
createButtonContentTools()
createOptionContentTools()
createSliderValueTools()
createThumbIconTool()
createControlLabelTextTool()
```

are reconstruction operations.

By contrast:

```text
child.updateRuntimeConfig()
child.setState(...)
child.updated()
child.connected()
child.disconnected()
```

are lifecycle/update forwarding.

Do not combine these into one generic abstraction.

Do not centralize child lifecycles.

Only reduce reconstruction when the audit proves configuration/group/theme did not require it.

This is consistent with the existing out-of-scope section and should be made explicit in the implementation checklist.

---

## 9. The permanent-test section is still broader than necessary

Section 10 currently says:

> Characterize all five control families with representative valid static configurations and currently supported JavaScript-backed fields.

For a simplification refactor, that can easily turn into a large new test suite even if only one or two control families actually change.

I would narrow this.

### Recommended rule

> Use existing tests as regression coverage. Add focused permanent tests only for behavior directly affected by removed or reconditioned work. Do not add new tests for an untouched control family solely because it is part of Plan 17.

For example, if the final implementation only changes:

- Toggle config work on theme/group updates;
- ControlBase visibility checking;
- Button/Number/Select/Slider child reconstruction conditions;

then tests should target exactly those changes.

The plan already correctly excludes new invalid-JavaScript behavior tests. Keep that.

---

## 10. Do not force three implementation PRs if the audit finds a tiny change

The proposed three stages are sensible:

1. characterize/classify;
2. cleanup;
3. integration/verification.

They do not necessarily need to become three substantial code PRs if the audit discovers that only a very small amount of code can safely be removed.

The important result is the reviewed deletion list and a small readable final diff.

Do not create infrastructure or artificial changes merely to fill the planned issue structure.

This is a process recommendation only; the code scope is more important.

---

# Control-by-control review

## ControlBase

Keep:

- defaults;
- haptic completion;
- label completion;
- lifecycle forwarding;
- unavailable action behavior.

Likely simplification:

- visibility validation should only need to run when configuration actually changes, if verification confirms identical behavior.

Do not create a shared control validator framework.

---

## Toggle

Strongest Plan-17 target.

Likely simplification:

- `buildConfig()` only for actual configuration changes;
- `validateOrientation()` only for actual configuration changes;
- avoid theme-only config rebuilds;
- recalculate geometry only for the signals that actually affect it;
- recreate icon/label only when their input configuration/placement actually changed.

Important:

- runtime `buildConfig()` itself cannot simply be removed because Toggle performs that completion after `BaseTool` captured `sourceConfig`.

---

## Button

Constructor already completes presets and public checks before `super(...)`.

Likely simplification is limited to avoiding unnecessary geometry/content reconstruction caused by the broad `configChanged` flag.

Keep:

- state-map runtime selection;
- content state styling;
- child update/lifecycle forwarding;
- action behavior;
- measurement/animation behavior.

---

## Number

Constructor already completes its presets before `super(...)`.

Likely simplification is again around unnecessary reconstruction, not around inventing new config validation.

Keep:

- measurement passes;
- runtime action generation;
- child state forwarding;
- press animation;
- all current interaction behavior.

---

## Select

Keep:

- constructor checks;
- render-time indicator-position check;
- HA-derived options;
- option rebuilding;
- formatting;
- child validation/lifecycle.

Possible simplification:

- avoid geometry/content reconstruction on signals that do not actually require it.

Do not redesign option ownership.

---

## Slider

Keep:

- constructor configuration checks;
- HA-resolved scale validation;
- current-value availability behavior;
- range ordering;
- pointer/drag checks;
- timers/animation cleanup;
- disconnect behavior.

Possible simplification:

- avoid geometry/value-tool reconstruction on theme/group updates where existing child/group handling already covers the change.

Do not turn runtime scale validation into config validation.

---

# Suggested additions to the Plan 17 document

I would add these rules explicitly:

> **Plan 16 does not prove control-specific configuration validity. A control check may be removed only when the same control already guarantees the same result and error behavior elsewhere.**

> **Do not replace `configChanged` with another broad combined condition. Configuration, group/layout and theme changes must trigger only the work they actually require.**

> **Child recreation and child lifecycle forwarding are different responsibilities. Plan 17 may reduce unnecessary recreation but must not redesign or centralize child lifecycles.**

> **Select's current HA-derived option ownership remains unchanged in Plan 17.**

> **Use existing regression coverage and add focused tests only for code whose triggering conditions or repeated work actually change. Do not build a new all-controls test suite solely for this refactor.**

---

# Final verdict

Plan 17 is substantially better scoped than the earlier refactor direction and is close to implementation-ready.

The plan already gets the most important points right:

- simplification only;
- no public behavior change;
- no new JavaScript failure semantics;
- no new unavailable/fallback behavior;
- runtime HA data stays runtime data;
- Slider scale checks stay runtime checks;
- child lifecycle work is out of scope;
- no forced LOC target;
- no generic framework.

Before implementation I would make the five clarifications above:

1. do not imply Plan 16 validates control-specific fields;
2. explicitly prohibit replacing `configChanged` with another broad combined condition;
3. document why Toggle's `buildConfig()` remains necessary for real configuration changes;
4. explicitly preserve Select's current HA-derived option ownership;
5. narrow new tests to the code actually changed.

With those changes, Plan 17 is suitable for a **small, behavior-preserving simplification refactor** rather than another redesign.
