# 19 — Horseshoe and Path consume trusted configuration

## 1. Goal

Move Horseshoe/Path public configuration completion and validation to the accepted-config boundary so `HorseshoeGauge` can focus on path/gauge preparation, animation and rendering.

Preserve Path V3 geometry, measured gradients, labels, ticks, markers and state animation.

This plan also removes the current ambiguous general-config trio in `HorseshoeGauge`: `activeItemConfig`, `runtimeConfig` and `this.config`.

## 2. Prerequisites

- Plans 15–18 complete.
- Gatekeeper is stable across ordinary tools, Controls and Sparkline.
- Existing Path/Horseshoe characterization and browser tests pass before editing.

## 3. Functional contract after this plan

```text
Horseshoe sourceConfig
 -> evaluate JS
 -> normalize gauge/state/labels/ticks/marker
 -> normalize selected path type
 -> convert numeric internal fields
 -> validate cross-field relationships
 -> publish this.config
      ↓
HorseshoeGauge
 -> build path definition from accepted fields
 -> build scale/value mapper
 -> bind measured geometry
 -> build paint/path-element contracts
 -> animate/render
```

Path generators receive valid path inputs. They are not public-config validators.

## 4. Current-code anchors

### 4.1 Existing normalizers

`src/horseshoe-state.js`

- `normalizeBaseConfig`: starts at line 19
- `normalizeRuntimeConfig`: starts at line 136

`normalizeRuntimeConfig()` already applies many defaults and marker/state checks. This is the natural existing owner to extend or compose with a small path-specific normalizer.

Do not create a second parallel Horseshoe configuration architecture.

### 4.2 Current parallel Horseshoe config states

`src/horseshoe-gauge.js:90-185` currently does:

- constructor: `this.activeItemConfig = this.config`;
- constructor: `this.runtimeConfig = undefined`;
- runtime start: `this.config = this.activeItemConfig`;
- calls `super.updateRuntimeConfig()`;
- stores the result back into `activeItemConfig`;
- runs `normalizeRuntimeConfig(...)`;
- stores the normalized object in `runtimeConfig`;
- on an unchanged pass, swaps `this.config = this.runtimeConfig`.

This is exactly the parallel general configuration route the new contract forbids.

Permanent disposition:

- `sourceConfig` remains the stable BaseTool source;
- a transient candidate is evaluated and Horseshoe-normalized through the normal gatekeeper;
- **`this.config` becomes the one accepted Horseshoe runtime config**;
- `activeItemConfig` is removed;
- `runtimeConfig` is removed;
- `pathConfig` remains because it is not a second general config: it is a prepared, path-generator/geometry input derived from accepted `this.config`;
- `pathDefinition`, `renderContract`, gradients, ranges and other prepared results remain domain outputs/caches.

There must be no swap of `this.config` between two general config objects after this plan.

### 4.3 HorseshoeGauge runtime method

`src/horseshoe-gauge.js:updateRuntimeConfig(): 154-507`

This ~354-line method currently combines:

- BaseTool config activation;
- group config;
- Horseshoe runtime normalization;
- style defaults;
- animator settings;
- path public config selection/defaults;
- path validation;
- path geometry input construction;
- path definition generation;
- scale construction;
- transform preparation;
- further runtime state.

Important baseline validation anchors:

- `218-222` — center marker/path type and allowed path type;
- `237-241` — arc radius/degrees;
- `257` — line length;
- `281-286` — rectangle width/height/start/end/top/direction;
- `314-342` — polygon sides/dimensions/radius/start/end/top/direction/max radius;
- `350` — wave dimensions;
- `369` — spiral radii/points;
- `386` — infinity radii.

Those are public config rules and must move before accepted `this.config`.

### 4.4 Downstream config coercion

Examples found in current Horseshoe code:

- `Number(this.config.horseshoe_state.segment_gap)`
- `Number(this.config.horseshoe_state.width)`
- tick `min/max/ticksize/offset/width/radius`;
- label `arc_size`, badge width/height/padding/offset`;
- item rotation;
- `GaugeScale` constructor in `src/horseshoe-geometry.js:13-67` converts `config.min/max` with `Number(...)`.

Each must be classified.

Numeric public configuration used mathematically should normally already be numeric after acceptance.

Do not remove numeric conversion of a value whose accepted internal type intentionally remains a CSS/string style value without first changing/defining that contract.

## 5. Required design

### 5.1 One Horseshoe accepted config; remove the parallel general config route

Prefer extending/composing the existing Horseshoe state normalization over adding a new generic config subsystem.

A small path normalization function is justified because path shape fields form one coherent domain.

The complete Horseshoe candidate — including the selected path shape — must be normalized/validated before it becomes `this.config`.

Remove `activeItemConfig` and `runtimeConfig` rather than keeping them as aliases around the new gatekeeper.

`pathConfig` remains an allowed prepared domain object: it contains SVG/path-generator inputs calculated from accepted config and card/group dimensions. It must not become a backdoor second public-config state.

The path normalizer should return a complete accepted internal path config for the selected type.

### 5.2 Path type contracts

For each path type, acceptance owns defaults, numeric conversion and validation:

- arc;
- line;
- rectangle;
- polygon;
- wave;
- spiral;
- infinity.

After acceptance, `HorseshoeGauge` should not check whether the shape is valid before generating it.

### 5.3 Cross-field rules

Rules such as:

- center-attached marker only on supported path;
- rectangle/polygon start/end/top ranges;
- polygon maximum corner radius;
- direction enum;

must be checked once at acceptance.

### 5.4 Geometry stays geometry

Path generators and Gauge runtime code still calculate:

- SVG/card dimension conversion where that belongs to geometry;
- center coordinates;
- endpoints;
- path definitions/signatures;
- transforms;
- measured path length/tangents;
- gradients;
- label/tick positions.

Do not move calculation into the config layer merely because both use numbers.

### 5.5 Animator/lifecycle stays intact

Keep `PathStateAnimator`, measurement cache ownership, disconnect/replacement cleanup and paint-only reuse unchanged except for direct use of accepted config values.

## 6. Out of scope

- new Path V4;
- path formula changes;
- new shapes;
- new label/tick semantics;
- animation redesign;
- gradient redesign;
- state-map semantics;
- unrelated SVG source security.

## 7. Implementation sequence

1. Characterize accepted config/output for every current path type.
2. Define internal accepted path shape for each type.
3. Remove the `activeItemConfig` / `runtimeConfig` general-config swap and route both static and JS candidates through the BaseTool gatekeeper.
4. Move defaults/type conversion/config checks from Gauge runtime into the existing normalization boundary.
5. Ensure static and JS-produced path config use the same route.
6. Publish the one accepted path/gauge config atomically as `this.config`.
7. Recreate/update `pathConfig` only as a derived geometry/path-generator input from accepted `this.config`.
8. Simplify `HorseshoeGauge.updateRuntimeConfig()` so it constructs from accepted fields.
9. Remove config-category `Number(...)` from Gauge and GaugeScale.
10. Audit measured-gradient/tick/label code field by field:
   - accepted numeric config -> direct use;
   - CSS semantic string -> retain legitimate conversion;
   - runtime state -> retain runtime conversion.
11. Confirm Path generators contain no redundant public-config policing.
12. Measure source and run Node/browser characterization tests.

## 8. Checks that must remain

Keep:

- actual state/entity conversion;
- measured DOM/path availability;
- animation lifecycle checks;
- cache/signature comparison;
- algorithmic numerical protection where valid accepted geometry can still create a degenerate case;
- external palette/color availability.

## 9. Permanent tests

Cover static and JS-backed config for:

- every path type;
- rectangle/polygon direction/start/end/top;
- polygon maximum radius rejection;
- arc degree/radius bounds;
- line/wave lengths;
- spiral/infinity radii;
- marker attachment relationship.

Retain:

- exact path definition/measurement characterization;
- gradients;
- ticks;
- labels;
- markers;
- string states;
- animation cleanup;
- long-animation cache bounds;
- WebKit-sensitive cases.

## 10. Source-size/readability measurement

Working estimate: **100–220 product code lines removed**.

Record:

- `horseshoe-gauge.js` before/after;
- `horseshoe-state.js` before/after;
- any path normalizer;
- `horseshoe-geometry.js`;
- total product source.

Also record the remaining ordered responsibilities of `HorseshoeGauge.updateRuntimeConfig()`.

A smaller Gauge file caused only by moving the same code verbatim to another file is not a success.

## 11. Definition of Done

- Horseshoe/Path static and dynamic config share one acceptance route;
- `activeItemConfig` and `runtimeConfig` no longer exist as parallel general configuration states;
- `this.config` is the one accepted Horseshoe config;
- `pathConfig` is demonstrably derived geometry/path input, not another public-config route;
- Gauge runtime no longer validates public path schema;
- accepted numeric gauge/path fields are not repeatedly coerced;
- Path generators receive valid inputs;
- geometry/formulas/rendering remain unchanged;
- updateRuntimeConfig is materially shorter/clearer;
- total product source decreases;
- Node/lint/build/browser tests pass.

## 12. Guarantee for Plan 20

Every major tool family now uses the same configuration contract. Plan 20 can therefore enforce the rule across the whole product source without family exceptions.
