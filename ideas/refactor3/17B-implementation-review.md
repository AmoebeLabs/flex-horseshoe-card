# Plan 17B — Implementation Review

**Repository:** `AmoebeLabs/flex-horseshoe-card`  
**Reviewed branch:** `master`  
**Reviewed commit:** `8534f489cf77b6094b5c54f39574ac1b099ffd88`  
**Plan:** 17B — Controls on the Canonical Tool Architecture  
**Review type:** Independent post-merge implementation review  
**Date:** 2026-10-03

## Review status

```text
BLOCKING: 0
REWORK:   2
ADAPT:    1
```

The broad 17B architecture is implemented and should remain in place. The remaining findings are bounded corrections; they do not require reopening the Control architecture.

---

## 1. Executive conclusion

Plan 17B has successfully moved Controls onto the intended canonical ownership model:

```text
sourceConfig
→ JavaScript evaluation
→ translation / validation / completion
→ this.config
→ geometry / runtime / paint
```

The implementation also correctly separates generated child source from parent-owned source, moves fixed geometry into `geometry`, moves current mutable state into `runtime`, and uses paint overrides instead of mutating child canonical configuration for transient presentation.

The three findings from the earlier implementation review are also present as corrected behavior:

- dynamically removed labels end their child lifetime;
- an action resolving through JavaScript to `none` does not receive default haptic feedback;
- direct Select option icons use the option entity rather than the parent Select entity.

A fresh review of the merged `master` nevertheless finds two remaining product-level inconsistencies and one schema inconsistency.

---

# REWORK 1 — Whole-value JavaScript can still be structurally merged before evaluation

## Finding

The final 17B rule is:

```text
type
→ static compile/dispatch identity

all other ordinary Control configuration
→ static or JavaScript
→ JavaScript evaluates first
→ the resolved value is then translated / normalized / validated
```

`ControlBase.updateRuntimeConfig()` intentionally performs a bounded selector pass so that selectors such as `orientation` and `show.item_style` can establish the preset/default context visible through `item`.

Current route in `src/control-base.js`:

```js
const selectorContext = Merge.mergeDeep(
  this.translateControlConfig({}, true),
  sourceConfig,
);

const orientation = this.templates.getJsTemplateOrValue(
  selectorContext,
  selectorContext.orientation,
);

const show = this.templates.getJsTemplateOrValue(
  selectorContext,
  selectorContext.show,
);

sourceConfig = this.translateControlConfig(
  { ...sourceConfig, orientation, show },
  true,
);
```

That extra context pass is valid in principle. The problem is that some subtype translators still perform structural merging of other values during that pass.

### Select

`ControlSelect.translateConfig()` currently performs:

```js
const selectConfig = Merge.mergeDeep(
  DEFAULT_SELECT_CONFIG,
  SELECT_STYLE_PRESETS[selectedConfig.show.item_style],
  config,
);

const selectedVizName = selectConfig.show.item_viz;

selectConfig[selectedVizName] = Merge.mergeDeep(
  DEFAULT_SELECT_CONFIG.viz_button,
  selectConfig[selectedVizName],
);

if (forTemplateContext) return selectConfig;
```

The schema now explicitly allows complete JavaScript values for both:

```yaml
viz_button:
  anyOf:
    - type: object
    - common.javascript

viz_line:
  anyOf:
    - type: object
    - common.javascript
```

Therefore this is valid authored configuration:

```yaml
viz_line: |
  [[[ return {
    indicator: {
      position: "bottom"
    }
  }; ]]]
```

During the template-context pass that value is still an unresolved JavaScript string. It is nevertheless passed into `Merge.mergeDeep()` as though it were already the concrete visualization object.

That violates the 17B rule that unresolved ordinary configuration remains source until its owning JavaScript evaluation.

### Button

`ControlButton.translateConfig()` has the same pattern:

```js
const selectedVizName = buttonConfig.show.item_viz;

buttonConfig[selectedVizName] = Merge.mergeDeep(
  DEFAULT_BUTTON_CONFIG.viz_button,
  buttonConfig[selectedVizName],
);
```

The bounded context pass therefore has the same risk whenever the selected visualization itself is authored as a whole-value JavaScript template.

## Required correction

The `forTemplateContext` route must only structurally complete values that are already concrete.

A whole-value JavaScript template must remain untouched during this temporary context-building phase.

Conceptually:

```text
selector fields needed for preset selection
→ evaluate once

temporary preset/default context
→ complete only concrete source shapes

all remaining parent-owned JavaScript
→ evaluate once in that context

final translator
→ normalize / validate / complete concrete configuration
```

Do not introduce another configuration owner or another generic lifecycle layer.

## Required regression tests

At minimum:

1. Select static `viz_line` object versus whole-value JS returning the same object.
2. Button static selected visualization versus whole-value JS returning the same object.
3. Assert:
   - identical final `this.config`;
   - identical geometry;
   - JavaScript expression evaluated once;
   - original `sourceConfig` still contains the template;
   - no temporary translated form leaks back into source.

---

# REWORK 2 — Generated child runtime state does not always follow the child's own entity binding

## Finding

17B establishes that generated children are real tools with their own source/config context.

If a generated child has:

```text
entity_index = 2
```

then both:

```text
JavaScript evaluation context
and
runtime entity/state publication
```

must use entity 2.

The earlier independent review found this exact problem for direct Select option icons. That path is now correctly repaired using the child's actual binding.

However, the same inconsistency remains in other direct generated-child routes.

---

## Button direct IconTool / TextTool

Button child configuration starts with the parent binding:

```js
entity_index: this.entity_index
```

but authored child config is merged over it, so the child can end up with a different `entity_index`.

The generated child can therefore legitimately own another entity.

Yet `ControlButton.setState()` publishes:

```js
this.contentIconTool.setState(entity, entityConfig);
this.contentTextTool.setState(entity, entityConfig);
```

where `entity` and `entityConfig` are the parent Button's state arguments.

That can produce:

```text
child.config.entity_index = 2
child JavaScript context  = entity 2
child runtime.entity      = parent entity
```

The child configuration and child runtime then disagree about ownership.

---

## Toggle direct IconTool

The same pattern exists for the optional thumb icon.

Its generated config may establish its own binding, but runtime state is supplied with:

```js
this.iconTool.setState(entity, entityConfig);
```

using the parent Toggle entity.

This matters for entity-derived icons, state maps, HA icon styling and other child behavior that consumes `runtime.entity`.

---

## Select direct TextTool

The previously repaired icon route is now correct.

Direct option text is not.

The generated TextTool is created with:

```js
entity_index: option.entity_index
```

but `ControlSelect.setState()` still calls:

```js
textTool.setState(entity, entityConfig);
```

using the parent Select entity.

Thus icon and text generated for the same option currently follow different runtime binding rules.

---

## Number generated children

Number creates generated IconTool/TextTool/StateTool children using the parent binding as the default, with child configuration merged over those generated configs.

`ControlNumber.setState()` later calls:

```js
this.minusContentTool.setState(entity, entityConfig);
this.plusContentTool.setState(entity, entityConfig);
this.valueStateTool.setState(entity, entityConfig);
```

Again, this forces the parent state arguments rather than respecting the final child binding.

Only paths where an explicit child binding is actually supported need correction/testing.

---

## Existing correct model

Slider already demonstrates the intended behavior.

Its generated value tools are updated from each tool/value binding:

```js
valueTool.setState(
  this.card.entities[sliderValueConfig.entity_index],
  this.card.resolvedEntityConfigs[sliderValueConfig.entity_index],
);
```

The corrected Select option icon path similarly uses the existing card-level tool/entity publication route.

## Required correction

Use the generated child's effective `entity_index` when publishing its runtime state.

Prefer the existing normal tool-state route already used elsewhere rather than introducing a new helper or Control-specific state abstraction.

Conceptually:

```text
generated child source/config
→ child.entity_index

child.entity_index
→ child JavaScript entity
→ child runtime entity
→ child state-map / formatting / HA presentation
```

All of these must refer to the same binding.

## Required regression tests

Add focused tests for at least:

- Button direct icon with child entity different from parent;
- Toggle direct icon with child entity different from parent;
- Select direct text with option entity different from parent;
- Number generated child only where an explicit child binding is part of the supported configuration.

Each test should confirm both:

```text
template evaluation entity
runtime.entity
```

match the generated child's effective `entity_index`.

---

# ADAPT 1 — Button schema does not describe the implemented visualization configuration

## Finding

The Button runtime uses:

```text
show.item_viz = viz_button | viz_line

config.viz_button
config.viz_line
```

`ControlButton.translateConfig()` directly accesses:

```js
buttonConfig[selectedVizName]
```

where `selectedVizName` is `viz_button` or `viz_line`.

The current public Button schema, however, declares:

```yaml
button:
  anyOf:
    - type: object
    - common.javascript
```

and does not declare `viz_button` / `viz_line` in the Button-specific schema section.

This is inconsistent with both the actual runtime model and the general 17B JavaScript contract.

## Required correction

Align the Button schema with the actual configuration names used by the implementation.

The schema should describe the real ordinary configuration values:

```text
viz_button
viz_line
```

and, under the 17B rule, each ordinary whole value should accept either its static shape or `common.javascript`.

This is an ADAPT rather than a product REWORK because the runtime ownership model itself is already clear; the public schema description is lagging behind it.

---

# Confirmed KEEP — 17B architecture

The following implementation decisions are correct and should remain.

## KEEP — one canonical current Control config

No second active/candidate Control configuration owner was introduced.

The intended ownership remains:

```text
sourceConfig = stable authored/template source
this.config  = current completed Control configuration
geometry     = derived geometry
runtime      = current mutable state
paint        = current presentation override
```

## KEEP — bounded selector context instead of field-by-field evaluation

The selector pre-pass is justified because selected orientation/style/visualization determines defaults and presets that other JavaScript expressions may legally inspect through `item`.

The correction in REWORK 1 is not to remove this mechanism. It is only to prevent unrelated unresolved whole-value templates from being consumed structurally during that bounded pass.

## KEEP — one evaluation per owning pass

The selector values are reused in the remaining pass rather than evaluating the same selector expression twice.

The regression suite explicitly covers selector call counts.

## KEEP — generated child JavaScript remains child-owned

`ControlBase.isChildConfigPath()` preserves generated child configuration until the generated tool evaluates it in its own item/entity context.

This is the correct architecture and should not be replaced by evaluating the complete Control tree recursively at the parent level.

## KEEP — dynamic first publication

Dynamic Controls defer child/geometry creation until a usable evaluated configuration has been published.

The implementation does not introduce a separate pending/accepted configuration state machine.

## KEEP — dynamic label removal

When a dynamic label resolves from present to absent, the old TextTool is disconnected and removed.

The regression test confirms its lifetime ends exactly once.

## KEEP — action completion after evaluation

Whole-action and nested-action JavaScript are evaluated before normal Control haptic completion.

A dynamic action resolving to `none` now behaves like static `none` and receives no default haptic feedback.

## KEEP — Select option icon binding fix

Direct Select option icons now use each option's completed entity binding both for JavaScript evaluation and runtime entity state.

This is the model the other direct generated-child routes should follow.

## KEEP — geometry/runtime/paint ownership

The implementation correctly moves fixed Control geometry out of semantic config and avoids using child `config.styles` as mutable presentation state.

No reversal is recommended.

---

# Verification reviewed

PR #865 records the following post-implementation verification:

```text
Node tests:      540 passed
Lint:            133 files passed
Browser cases:   50 validated
                 19 Chromium
                 19 WebKit
                 12 Firefox
Schema checks:   passed
Build:           passed with known Culori warnings only
Visual check:    no deviation reported
```

Those results are useful evidence for the covered paths.

The current review findings are combination gaps not exercised by those tests:

```text
whole selected visualization authored as JavaScript
+
template-context translation

and

generated child with entity binding different from parent
+
direct parent setState() publication
```

The existing green suite therefore does not contradict these findings.

The broader Python semantic suite was already recorded as blocked by the separate pre-existing HA-validator defect tracked outside 17B.

---

# Required correction set

Keep the repair bounded.

```text
1. Make template-context translation source-safe for whole-value JS.
2. Publish runtime state to direct generated children by their effective child binding.
3. Align Button schema with actual viz_button / viz_line runtime configuration.
4. Add focused regression tests for exactly these combinations.
5. Re-run existing Node, lint, browser and schema acceptance.
```

Do not:

```text
- introduce another config owner;
- introduce a generic Control state engine;
- replace the bounded selector pass with field-by-field evaluation;
- evaluate generated child JavaScript in the parent context;
- alter the established static-config behavior or YAML merge precedence.
```

---

# Final review disposition

```text
BLOCKING: 0
REWORK:   2
ADAPT:    1
```

Plan 17B is architecturally sound and should not be reopened.

The merge needs three bounded follow-up corrections before the implementation review can be closed at:

```text
BLOCKING: 0
REWORK:   0
ADAPT:    0
```

The two REWORK items are both consistency defects against rules already established by 17B, not requests for additional architecture.
