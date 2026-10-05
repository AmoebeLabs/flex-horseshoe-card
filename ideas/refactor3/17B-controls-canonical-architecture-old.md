# Plan 17B — Controls on the Canonical Tool Architecture

## 1. Goal

Move every control onto the same config / geometry / runtime / paint model proven by Plans 15B–16B while preserving all control behaviour.

Controls are the first family that proves a second important architectural rule:

> parent/common configuration plus item/subtype override is resolved once into complete canonical child configuration; runtime does not repeat inheritance.

## 2. Family target

```text
config
  complete authored/evaluated control configuration

geometry
  SVG center/bounds
  button/segment/thumb placement
  generated child placement

runtime
  current entity values
  HA-derived option lists
  selected index/value
  generated action payloads
  slider scale/availability
  pointer/drag state

paint
  selected/unselected
  active/inactive
  unavailable visual overrides
```

Generated child tools receive stable generated source configuration for the lifetime of that child instance.

### Shared color-stop migration exception

The common active color-stop owner is **not** moved in this plan if doing so would leave Sparkline/Horseshoe on the old owner. Controls should be made structurally ready for canonical paint ownership, but the shared storage cutover remains the atomic Plan-19 integration step defined by 16B.

## 3. Preserve Control JavaScript source ordering

Button, Number, Select, Slider, Toggle and ControlBase currently complete different defaults/presets before BaseTool sees their source.

Do not move those operations wholesale after JavaScript evaluation.

For each subtype, classify existing constructor/factory work as:

```text
PRE-SOURCE / TEMPLATE-VISIBLE
POST-EVALUATION TRANSLATION
```

Characterize representative JS configs before movement. Values already visible through `item` remain visible in the same order after migration.

The canonical goal is one **current config**, not an artificial requirement that every default execute after JS.

## 4. ControlBase

### Current

ControlBase completes:

- common visibility/unavailable defaults;
- haptic defaults recursively;
- label defaults;
- label positioning/style defaults;

before calling BaseTool.

### Target

Classify those operations first. Defaults/completion current JS can observe remain in template-visible source preparation; only the safe post-evaluation portion moves into the canonical control translator.

Keep generated label TextTool creation separate because its absolute coordinates depend on current parent geometry.

A parent geometry change may recreate the label tool. Once created, the label child config is not runtime paint storage.

### Runtime visibility

`visible / hidden / unavailable` remains config when authored as such.

Actual entity availability or current interaction state remains runtime.

Do not remove the existing visibility validation merely because a new translation exists until equivalent failure timing/behaviour is proven.

## 5. ControlContent

ControlContent currently performs a valuable inheritance operation:

```text
parent entity
+ shared source content item
+ per-button/per-option override
→ merged item
```

The operation stays; its ownership moves earlier.

### Target configuration

The parent control should expose complete effective content items before normal runtime state handling.

For example:

```text
config.content.items[]
```

contains the completed item configuration expected by child construction.

### Geometry

Cell division, margin application and generated absolute child coordinates are derived geometry.

Keep the current calculations.

### Paint violation to remove

Current `ControlContent.setState()` assigns active visual styles into:

```text
child.tool.config.styles
```

Replace that with an explicit presentation route.

Use the `paint.styles` / `setPaintStyles()` contract established by 15B/16B. It must not introduce a second “render config”.

For the first migration, compute the **same merged style map in the same argument order** that current code assigns to `child.tool.config.styles`, then publish that map with `setPaintStyles()`. This keeps style priority unchanged while moving ownership.

If the child is Text-like, the new paint path must trigger the same effective-style measurement invalidation proven in 16B.

## 6. ControlToggle

### Current issue

Toggle completes selected style/config after `super(...)` using `buildConfig()` and re-runs that completion when dynamic config changes.

This means initial and dynamic tool completion are not one recognisable translation route.

### Target

One Toggle translator owns:

- defaults;
- subtype/style selection;
- orientation completion;
- content defaults;
- validation;
- final canonical Toggle config.

Both construction and dynamic JS reevaluation use that translator.

Geometry calculation remains derived from `this.config` and group layout.

## 7. ControlButton

Preserve:

- button style presets;
- actions;
- state-map selection;
- content construction;
- interaction behaviour.

Change ownership:

```text
config.svg                  → geometry.svg
current state-map entry     → runtime.stateMapItem
active/inactive visual data → paint
```

Do not mutate retained content Icon/Text config to display active/inactive styles.

## 8. ControlSelect

Select is the clearest runtime/config boundary in the family.

### Current

When options come from a Home Assistant entity, `setState()` normalizes them and writes them into:

```text
this.config.option_map
```

### Target

```text
config.option_map
    explicitly configured option map only

runtime.options
    current effective option list/map

runtime.selectedIndex
runtime.selectedValue
runtime.actionConfigs

paint.optionStates
    selected/unselected presentation
```

The existing option normalization code remains. It simply publishes to runtime when the source is HA state.

### Child tools

Selected/unselected styles must not be written to child config.

## 9. ControlSlider

Slider already separates much of its runtime data. This migration is mostly ownership/naming.

Target runtime grouping:

```text
runtime.values
runtime.displayValues
runtime.available
runtime.scale
runtime.activeValueIndex
runtime.dragging
runtime.draggingThumb
runtime.lastWrittenSignature
runtime.renderFrame
runtime.stateAnimationFrame
runtime.writeTimer
```

Do not group fields if doing so makes pointer hot paths materially less clear; canonical naming is the goal, not object nesting at any cost. The final implementation may keep tightly coupled lifecycle handles direct if justified, but entity-derived state should be recognisable as runtime.

Move control SVG/bounds into geometry.

Preserve:

- single/range semantics;
- HA-derived scale attributes;
- unknown/unavailable handling;
- pointer capture;
- throttled writes;
- animations;
- actions.

## 10. ControlNumber

Move:

```text
numberGeometry → geometry
minusActionConfig → runtime.minusActionConfig
plusActionConfig  → runtime.plusActionConfig
```

The increment/decrement action conversion remains exactly the existing behaviour.

Generated minus/plus/value child tools remain legitimate generated children.

## 11. ControlTool dispatcher

The live responsibility of `ControlTool` is subtype compile/dispatch.

Keep that role simple.

Remove the large obsolete commented implementation during Pass B after the family is green.

## 12. Pass A verification

Run control tests after the ownership changes but before cleanup.

Verify especially:

- static and JS Toggle configs are equivalent;
- group moves rebuild geometry correctly;
- theme-only changes update presentation without rebuilding unrelated config;
- Select HA options update without canonical config mutation;
- Button/Content selection changes do not mutate child config;
- overlapping configured and state-driven child styles preserve the current priority exactly;
- Text child font-metric presentation changes invalidate measurement through the 16B paint route;
- Slider current behaviour is unchanged.

## 13. Pass B cleanup

Once runtime presentation no longer uses child config:

- remove `baseStyles` snapshots if they are no longer required;
- remove repeated active/unselected style merges that can be produced once by paint;
- collapse duplicate child reconstruction/update branches where canonical ownership makes them identical;
- remove config completion helpers that have become part of one linear translator;
- remove obsolete comments and dead commented ControlTool code.

Do not replace explicit readable control flow with a generic “control engine”.

## 14. Tests

At minimum:

- `control-content.test.js`;
- `control-family-theme-refresh.test.js`;
- `control-slider.test.js`;
- `control-toggle-config.test.js`;
- relevant card lifecycle/group/browser tests.

Add direct architecture assertions for:

```text
ControlSelect.setState does not assign config.option_map
ControlContent/Button/Select runtime state does not assign child config.styles
```

## 15. Definition of Done

- every control has recognisable config/geometry/runtime/paint ownership;
- common + subtype + item inheritance happens once;
- current HA option lists are runtime;
- selected/active visual state is paint/runtime rather than config mutation;
- generated children follow the same canonical child rules as top-level tools;
- all interaction behaviour remains unchanged.
