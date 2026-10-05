# Plan 22 — Rewrite FHS Comments as Normal Functional English

**Date:** 2026-10-04  
**Repository:** `AmoebeLabs/flex-horseshoe-card`  
**Baseline:** `6bfa69f67a204f7041806d1118c107560c247c19`  
**Baseline commit:** `refactor: simplify update/render and targeted invalidation (Plan 21)`  
**Suggested branch:** `feature/22-readable-functional-comments`

---

# 1. Purpose

Plan 22 changes **comments only**.

There are no functional code changes.
There are no architecture changes.
There are no internal renames in this plan.
There are no configuration changes.
There are no test-behaviour changes.

The goal is simple:

> Make the FHS source readable by replacing abstract AI-style comments with normal functional English about Home Assistant, the FHS card, its tools, its configuration and the visible behaviour those tools implement.

FHS is a Home Assistant card.

Its comments should therefore talk about:

- Home Assistant;
- HA entities;
- the FHS card;
- configured entities;
- local FHS inputs;
- JavaScript templates;
- groups;
- Text;
- State;
- Name;
- Area;
- Icon;
- Control;
- Sparkline;
- Sparkline History;
- Sparkline Series;
- Horseshoe;
- Path;
- graphs;
- labels;
- legends;
- styles;
- color stops;
- themes;
- animations;
- SVG;
- browser text measurement.

Comments must not replace these concrete things with abstract software-architecture terminology.

---

# 2. Absolute rule

> **Comments describe what Home Assistant or FHS does, why it does it, and where the value goes next when that matters. They do not describe an abstract software architecture.**

A useful comment should help answer one or more of these questions:

1. Which Home Assistant or FHS feature are we dealing with?
2. What changed or caused this code to run?
3. What does the card do here?
4. Why is that necessary?
5. What uses the value afterwards?

For non-obvious code, explain the local flow.

Good:

```text
Home Assistant sends a new state for a configured entity
→ FHS stores the new entity
→ Sparkline updates first
→ Sparkline refreshes fhs_sparkline.* values
→ Text, State, Horseshoe and Controls receive the final values
→ Lit renders the card
```

Rejected:

```text
source update
→ producer publication
→ consumer presentation
```

---

# 3. Comments describe behaviour, not implementation technique

Use this test:

> **If the implementation is replaced without changing FHS behaviour, should the comment still make sense?**

Usually the answer must be yes.

Good:

```js
// When the Sparkline period changes, History may need rows for another time
// range. Keep the current graph visible until the new History rows are available.
```

Rejected:

```js
// Invalidate the History owner and publish the new request state.
```

Technical details are only useful when they explain a real FHS limitation or requirement, for example:

- SVG y coordinates grow downward;
- exact browser text size is only known after rendering;
- Home Assistant sends `ready` after a websocket reconnect;
- Lit may replace an SVG path;
- a Home Assistant formatter or registry changed.

Even then, the comment must explain what that means for the card.

---


# 4A. JSDoc follows exactly the same rules

JSDoc is comment and is fully in scope for Plan 22.

Class descriptions, method descriptions, `@param`, `@returns`, and other JSDoc text must use the same normal functional English as inline comments.

For Group A modules, JSDoc is removed together with the other explanatory comments and written again from the uncommented code.

Do not preserve bad JSDoc merely because it is formatted as `/** ... */`.

### Rejected

```js
/**
 * Returns effective geometry for a text tool, using its SVG measurement when available.
 */
```

### Required style

```js
/**
 * Returns the measured Text position and size when browser measurements are
 * available. Otherwise returns the estimated Text size used before measurement.
 */
```

The same rule applies to `@param` and `@returns`.

### Rejected

```js
@param {boolean} dayNightEnabled - Whether this History owner also maintains sun history.
```

### Required style

```js
@param {boolean} dayNightEnabled - Whether this Sparkline also requests sun.sun History for the day/night background.
```

### Rejected

```js
@param {object} config - Effective series configuration.
```

### Required style

```js
@param {object} config - Sparkline Series config used for this graph.
```

JSDoc is often the first explanation a programmer reads before entering a function, so abstract architecture language there is just as unacceptable as in inline comments.

---

# 4. Architecture terminology is prohibited in explanatory comments

The following wording is rejected when it replaces a concrete FHS or Home Assistant description:

- owner
- ownership
- domain owner
- lifecycle owner
- child owner
- producer
- consumer
- publication
- publish, when the code simply stores, sets, updates, passes or uses something
- propagation
- invalidation
- presentation
- presentation state
- presentation consumer
- domain, when the actual FHS feature is known
- canonical, when it only means "the config/value we use"
- effective, when it only means "the styles/value currently used"
- retained work
- runtime pass
- source pass
- processing pass
- context-dependent domain
- derived result
- active result
- resolved result
- output object
- processing object
- component, when the actual FHS tool can be named
- object, when the actual FHS or HA thing can be named
- class/subclass in comments when the actual FHS tools can be named

Do not replace one vague word with another:

```text
owner        → manager
publication  → propagation
effective    → resolved
consumer     → receiver
result       → output
```

That is not an improvement.

Name the actual thing.

---

# 5. Plan 22 has three module treatments

Not every module should be handled the same way.

The current source contains:

1. modules whose comments are heavily polluted by abstract AI terminology;
2. mixed modules containing both useful comments and poor comments;
3. older/manual modules that already use normal human-readable language.

Plan 22 must treat these groups differently.

---

# 6. Group A — Strip explanatory comments and rewrite them from scratch

For the worst modules, do **not** edit the existing comments sentence by sentence.

The existing wording is itself part of the problem and can steer the rewrite back toward the same abstract terminology.

For Group A modules:

1. keep the original file available through Git;
2. make a working copy;
3. remove explanatory comments from the working copy;
4. do not change executable code;
5. read the uncommented module from top to bottom;
6. reconstruct the functional flow from:
   - the code;
   - FHS configuration;
   - Home Assistant behaviour;
   - callers;
   - tests;
7. add new comments only where they actually improve understanding;
8. write those comments from scratch in normal functional English;
9. only after the new comments are complete, compare with the old Git version;
10. check whether an old comment contained an important functional reason or edge case that the rewrite missed;
11. if so, add that missing fact back in normal English.

The old comments must **not** be used as the wording template.

They are only a final information check.

## Group A modules

This classification is part of Plan 22 and is **not** an implementation decision.

Do not move modules between groups.

Group A is:

- `src/main.js`
- `src/base-tool.js`
- `src/card-entities.js`
- `src/sparkline-graph-tool.js`
- `src/sparkline-history.js`
- `src/sparkline-series.js`
- `src/path-geometry.js`
- `src/icon-svg-source.js`

For these modules, remove the existing explanatory comments and JSDoc in the working copy and write them again from the code and FHS/Home Assistant behaviour.

Good functional facts from the old comments may be reintroduced only after the fresh rewrite, during the final comparison with the original Git version.

---

# 7. Group A examples

## `main.js`

### Current

```js
// Unrelated HA traffic still reaches child cards and connection owners in
// setHass(). FHS config and tools run only for declared inputs, supported
// context changes, or work retained by an asynchronous owner.
```

### Rewrite from actual behaviour

```js
// setHass() always gives embedded cards and actions the newest Home Assistant
// object. The FHS card itself only continues when a configured HA entity,
// local FHS input, locale or theme changed, or when Sparkline still needs work
// such as refreshing History after a reconnect.
```

---

### Current

```js
// Producers consume source configuration once. Publish their outputs before
// activating presentation consumers against the final shared entity values.
```

### Rewrite

```js
// Update Sparkline first because it can create fhs_sparkline.* entity values.
// Store those values before updating Text, State, Horseshoe, Icon and Control
// tools that may use them.
```

---

### Current

```js
// A relevant runtime pass publishes current bindings; Lit reconciles any
// equal values. Data, geometry and measurement owners retain their caches.
```

### Rewrite

```js
// Something used by this card changed, so request one render. Lit leaves
// unchanged DOM values alone. Sparkline History, Path calculations and text
// measurements only repeat when their own inputs changed.
```

---

## `base-tool.js`

### Current

```js
// Static config can be translated immediately. Dynamic source stays intact
// until the normal runtime pass evaluates it before translation and publication.
```

### Rewrite

```js
// A tool without JavaScript can normalize its config immediately. When the
// config contains [[[ ... ]]], keep the original config until Home Assistant
// is available, evaluate the JavaScript, and then normalize the returned config.
```

---

### Current

```js
// Multipart tools finish their own evaluation contexts and child bindings
// here, so state processing always sees the complete current configuration.
```

### Rewrite

```js
// Text and Control tools can add configuration for their own nested items.
// Finish that work before assigning the current HA entity, so setState() sees
// the complete config that will be rendered.
```

The actual overrides must be checked before naming tools.

---

## `card-entities.js`

### Current

```js
/**
 * Evaluates entity templates and links local Sparkline entities to their sources.
 * Presentation rebuilds use already published series to retain final bindings.
 */
```

### Rewrite

```js
/**
 * Evaluates [[[ ... ]]] in `entities` and connects every fhs_sparkline.* entity
 * to the Sparkline and Series that provide its value. When Sparkline has already
 * evaluated a JavaScript `series` config, use that current Series config here.
 */
```

---

### Current

```js
/**
 * Publishes changed local Sparkline values and their source metadata into
 * the shared array. Equal results retain the entity object consumers know.
 */
```

### Rewrite

```js
/**
 * Stores changed fhs_sparkline.* values in the card's shared entity array.
 * Keep the existing entity object when the value and metadata are unchanged,
 * so tools using that entity do not see a false HA-style entity change.
 */
```

---

## `sparkline-graph-tool.js`

### Current

```js
/** Captures source; only complete configuration creates graph domain owners. */
```

### Rewrite

```js
/**
 * Stores the Sparkline config. If `series` contains JavaScript, Series, History
 * and graph objects are created after that JavaScript returns the first valid config.
 */
```

---

### Current

```js
// A period change invalidates only History's source/request state. Existing
// graph geometry remains mounted while a missing expanded range is loaded.
```

### Rewrite

```js
// When the Sparkline period changes, History may need rows for another time
// range. Request the missing rows, but keep the current graph visible until
// the new History data is available.
```

---

## `sparkline-history.js`

### Current

```js
/**
 * Owns the source records and time windows used by one Sparkline tool.
 *
 * The parent period determines one shared plot window. Each normalized Series
 * item supplies its effective source period, so an offset changes the requested
 * timestamps without introducing another timeline inside the graph engine.
 */
```

### Rewrite

```js
/**
 * Keeps the History rows and requested time ranges for one Sparkline.
 *
 * The Sparkline `period` defines the time shown on the graph. A Series `offset`
 * changes which HA History timestamps are requested for that Series, but all
 * Series are still drawn against the same visible Sparkline time range.
 */
```

---

### Current

```js
/** Returns request and preservation facts consumed by GraphTool presentation. */
```

### Rewrite

```js
/** Returns the History request state needed by SparklineGraphTool for this Series. */
```

---

## `sparkline-series.js`

### Current

```js
/**
 * Coordinates the graph engines belonging to one sparkline layout item.
 *
 * GraphTool supplies complete canonical entries. Series retains their runtime
 * items and coordinates shared bins, axis ranges and graph placement.
 */
```

### Rewrite

```js
/**
 * Keeps the Series used by one Sparkline and their SparklineGraph instances.
 *
 * It calculates the shared bin layout, axis ranges and graph placement so all
 * Series in the Sparkline use the same visible graph area.
 */
```

---

## `path-geometry.js`

### Current

```js
/**
 * Owns the bind, measure, cache, and invalidation lifecycle for one active SVG
 * centerline. Path generators provide the definition; later geometry features
 * consume the bound element and its cached browser measurement.
 */
```

### Rewrite

```js
/**
 * Keeps the rendered SVG path and its browser measurements for a Horseshoe or
 * other Path-based tool. The path length is measured once per path shape and
 * reused. Fixed point/direction samples are also reused, while animation uses
 * temporary samples that are replaced when the animated Path position changes.
 */
```

If other concrete FHS tools use `PathGeometry`, name them too.

---

### Current

```js
/**
 * Reports whether consumers may display output that depends on browser geometry.
 */
```

### Rewrite

```js
/** Returns true after the current SVG path has been rendered and measured. */
```

---

# 8. Group B — Keep good comments, rewrite only weak sections, add missing context

Group B modules are mixed.

They already contain useful comments, but also contain specific sections with abstract wording.

For these modules:

1. do not strip all comments;
2. preserve clear human-readable comments;
3. rewrite only comments that fail the functional-language rules;
4. add comments only where the current flow is genuinely hard to understand;
5. do not increase comment volume for its own sake.

## Group B modules

This classification is fixed for Plan 22.

Do not move modules between groups.

Group B is:

- `src/card-layout.js`
- `src/card-tools.js`
- `src/card-theme.js`
- `src/home-assistant.js`
- `src/templates.js`
- `src/sparkline-graph.js`
- `src/text-tool.js`
- `src/text-tool-geometry.js`
- `src/control-base.js`
- `src/control-content.js`
- `src/control-select.js`
- `src/control-slider.js`
- `src/icon-tool.js`
- `src/icon-source.js`
- `src/horseshoe-state.js`
- `src/horseshoe-gauge.js`
- `src/color-stops.js`
- `src/area-tool.js`
- `src/name-tool.js`
- `src/state-tool.js`
- `src/line-tool.js`
- `src/polygon-tool.js`
- `src/rectangle-tool.js`

Every file in this group is reviewed in place. Keep good comments, rewrite only comments/JSDoc that fail the Plan 22 language rules, and add new comments only where a real functional explanation is missing.

---

# 9. Group B examples

## `card-layout.js`

### Current

```js
// A changed parent changes the effective position, visibility, and scale of all descendants.
```

### Rewrite

```js
// When a group changes, every nested group can move, hide, rotate or scale with
// it. Mark those nested groups as changed so their tools recalculate geometry.
```

---

### Current

```js
/** Clears group invalidation after all tools have consumed it. */
```

### Rewrite

```js
/** Clears the changed-group list after every tool has handled the new group geometry. */
```

---

## `card-tools.js`

Keep good current comments such as:

```js
/** Returns the tools from one named layout section. */
```

and:

```js
/** Assigns entity data to every tool in the requested sections. */
```

Rewrite weak comments such as:

```js
/** Closes every old owner before replacement can construct new resources. */
```

to:

```js
/** Disconnects all existing tools before a new card config creates replacement tools. */
```

And:

```js
/** Updates graph legend consumers after the final entity publication. */
```

to:

```js
/** Updates Sparkline legend Text tools after all fhs_sparkline.* entity values are current. */
```

---

## `card-theme.js`

### Current

```js
// Every color consumer receives the host whose inherited CSS it must read.
// Theme/cache metadata is filled before these conversions become reusable.
```

### Rewrite

```js
// Color conversion may need CSS variables inherited by this card. Keep the card
// element and active HA theme here so color stops, gradients and palettes all
// resolve colors against the same CSS values.
```

---

## `home-assistant.js`

### Current

```js
// Entity presentation depends on HA formatter implementations and registry
// objects as well as locale. Their references identify that display context.
```

### Rewrite

```js
// Text shown for an HA entity can change when the locale, HA formatting
// functions, entity registry, device registry, area registry or floor registry
// changes. Track those references so FHS reformats entity names and states.
```

---

## `templates.js`

### Current

```js
/** Publishes the final named slots after disabled entities have been removed. */
```

### Rewrite

```js
/** Stores the final named entity slots after disabled entries have been removed. */
```

---

## `sparkline-graph.js`

### Current

```js
// Empty is a successful current result. Remove every processed value from
// the previous input so no consumer can mistake old geometry for data.
```

### Rewrite

```js
// An empty History response is valid. Clear values, coordinates, axes and
// statistics from the previous History rows so the Sparkline renders no old data.
```

---

## `text-tool.js`

### Current

```js
/**
 * Invalidates measurements from the same effective text styles used by render.
 * Parent-selected styles and source animations can change font metrics without changing
 * displayed text. Equal inputs leave the current async measurement untouched.
 */
```

### Rewrite

```js
/**
 * Checks whether the rendered Text must be measured again.
 *
 * A Control style, state_map style, color-stop style or animation can change
 * the font without changing the text itself. Only start a new browser measurement
 * when the rendered text, font styles or text_overflow settings actually changed.
 */
```

Only mention style sources confirmed by the code.

---

## `control-content.js`

### Current

```js
// Tool implementations differ between ypos and yposc, so publish the same
// absolute center through both names. The enclosing control remains the
// sole pointer target regardless of child tool capabilities.
```

### Rewrite

```js
// Some tools read `ypos` and others read `yposc`. Give both fields the same
// Control item center so every item is drawn at the same position. Pointer
// actions stay on the Control itself, not on the Text, Icon or other item inside it.
```

---

## `control-select.js`

### Current

```js
/** Selects the active option and publishes state plus visual styles. */
```

### Rewrite

```js
/** Finds the selected option from the HA entity and updates its Text, Icon and option styles. */
```

Adjust to the exact values updated.

---

## `icon-tool.js`

### Current

```js
/** Stores the selected map entry once for the presentation and render phases. */
```

### Rewrite

```js
/** Finds the state_map entry for the current HA entity and keeps it for this render. */
```

---

## `icon-source.js`

### Current

```js
/**
 * Returns a cached path or starts reading it from the hidden ha-icon rendered
 * by the consumer. A source change cancels the previous polling loop.
 */
```

### Rewrite

```js
/**
 * Returns a cached SVG path for an HA icon. If it is not cached yet, read the
 * path from the hidden <ha-icon>. When another icon is requested, stop polling
 * for the previous one.
 */
```

---

## `icon-svg-source.js`

### Current

```js
/**
 * Loads on detached staging nodes, then publishes only into the original
 * current placeholder. The library's own DOM replacement is isolated from
 * Lit until this owner has accepted the result.
 */
```

### Rewrite

```js
/**
 * Loads an external SVG in a detached element first. Replace the matching SVG
 * placeholder in the card only when that placeholder still exists and still
 * points to the same URL. This prevents an older async load from replacing a
 * newer Icon after Lit has rendered again.
 */
```

---

## `horseshoe-gauge.js`

### Current

```js
// Binding a master path precedes building its gradients in updated(). Keep
// that first measured pass with its normal owner, even if a palette finishes
// in between those two lifecycle steps.
```

### Rewrite

```js
// A gradient that follows the Horseshoe path needs the browser-measured path
// length. If a palette finishes loading before that measurement is available,
// wait for updated() to bind and measure the path before building the gradient.
```

---

## `color-stops.js`

Keep already readable comments.

For example:

```js
/** Selects the active mode-specific color list or falls back to the default list. */
```

can remain, or may be made slightly more concrete:

```js
/** Uses the light/dark color-stop list for the current HA theme, or the default list when none is configured. */
```

Do not rewrite it merely for churn.

---


# 9A. Specific JSDoc examples from current `master`

These examples are taken directly from current `master` and are mandatory examples for Plan 22.

## `src/sparkline-history.js`

### Current

```js
/**
 * Owns the source records and time windows used by one Sparkline tool.
 *
 * The parent period determines one shared plot window. Each normalized Series
 * item supplies its effective source period, so an offset changes the requested
 * timestamps without introducing another timeline inside the graph engine.
 */
```

### Required style

```js
/**
 * Keeps the History rows and requested time ranges for one Sparkline.
 *
 * The Sparkline `period` defines the time shown on the graph. A Series `offset`
 * changes which HA History timestamps are requested for that Series, but all
 * Series are still drawn against the same visible Sparkline time range.
 */
```

### Current `@param`

```js
@param {boolean} dayNightEnabled - Whether this History owner also maintains sun history.
```

### Required style

```js
@param {boolean} dayNightEnabled - Whether this Sparkline also requests sun.sun History for the day/night background.
```

---

## `src/sparkline-series.js`

### Current

```js
/**
 * Coordinates the graph engines belonging to one sparkline layout item.
 *
 * GraphTool supplies complete canonical entries. Series retains their runtime
 * items and coordinates shared bins, axis ranges and graph placement.
 */
```

### Required style

```js
/**
 * Keeps the Series used by one Sparkline and their SparklineGraph instances.
 *
 * It calculates the shared bin layout, axis ranges and graph placement so all
 * Series in the Sparkline use the same visible graph area.
 */
```

### Current

```js
/**
 * Rebinds canonical entries while retaining runtime history and graph state.
 *
 * @param {object} config - Validated static or runtime sparkline configuration.
 * @param {object|undefined} sourceConfig - Raw source evaluated for this publication.
 */
```

### Required style

```js
/**
 * Applies a changed Sparkline Series config while keeping existing History and
 * graph data for Series whose ids still exist.
 *
 * @param {object} config - Current validated Sparkline config.
 * @param {object|undefined} sourceConfig - Original Sparkline config used for configured Series overrides.
 */
```

---

## `src/path-geometry.js`

### Current class JSDoc

```js
/**
 * Owns the bind, measure, cache, and invalidation lifecycle for one active SVG
 * centerline. Path generators provide the definition; later geometry features
 * consume the bound element and its cached browser measurement.
 */
```

### Required style

```js
/**
 * Keeps the rendered SVG path and its browser measurements for a Horseshoe or
 * other Path-based tool. The path length is measured once per path shape and
 * reused. Fixed point/direction samples are also reused, while animation uses
 * temporary samples that are replaced when the animated Path position changes.
 */
```

### Current method JSDoc

```js
/**
 * Activates a centerline definition and invalidates the current DOM binding
 * only when its geometry signature changes.
 *
 * @param {object} pathDefinition - Stable centerline definition with d and signature fields.
 * @returns {boolean} True when a new DOM binding is required.
 */
```

### Required style

```js
/**
 * Stores a new SVG path definition. When the path shape changed, wait until Lit
 * has rendered the new <path> before using browser measurements for it.
 *
 * @param {object} pathDefinition - SVG path definition containing the `d` value and geometry signature.
 * @returns {boolean} True when Lit must render and bind a new SVG path.
 */
```

### Current

```js
/**
 * Reports whether consumers may display output that depends on browser geometry.
 *
 * @returns {boolean} True after the active rendered path has been bound.
 */
```

### Required style

```js
/**
 * Returns whether the current SVG path has been rendered and measured.
 *
 * @returns {boolean} True when its browser measurements are available.
 */
```

---

## `src/sparkline-graph-tool.js`

### Current

```js
/** Captures source; only complete configuration creates graph domain owners. */
```

### Required style

```js
/**
 * Stores the Sparkline config. If `series` contains JavaScript, Series, History
 * and graph objects are created after that JavaScript returns the first valid config.
 */
```

### Current

```js
/** Publishes canonical series and composes active palettes on their stable paint owners. */
```

### Required style

```js
/**
 * Applies the current Sparkline Series config and recalculates Series colors
 * when the config, group or Home Assistant light/dark mode changed.
 */
```

### Current

```js
/** Creates Series and History from published configuration, retaining card connection. */
```

### Required style

```js
/**
 * Creates the Sparkline Series, History and graph objects after the first complete
 * Sparkline config is available, then prepares the initial bins and graph layout.
 */
```

---

## `src/control-slider.js`

### Current

```js
/** Captures source; state, dragging and display values have one runtime owner. */
```

### Required style

```js
/**
 * Stores the Slider config and initializes its current value, displayed value
 * and drag state. A range Slider keeps one value for each configured handle.
 */
```

---

## `src/text-tool-geometry.js`

### Current

```js
/**
 * Returns effective geometry for a text tool, using its SVG measurement when available.
 *
 * @param {object} tool - Name, area, state, or standalone text tool.
 * @returns {{xpos: number, ypos: number, width: number, height: number}} Text geometry.
 */
```

### Required style

```js
/**
 * Returns the position and size used by a Name, Area, State or Text tool.
 * Use the browser-measured Text size when available; otherwise use the estimated
 * size calculated before the Text was rendered.
 *
 * @param {object} tool - Name, Area, State or Text tool.
 * @returns {{xpos: number, ypos: number, width: number, height: number}} Text position and size in SVG units.
 */
```

---

# 9B. Group A stripping explicitly includes JSDoc

For Group A modules, removing explanatory comments means removing and recreating:

- `//` explanatory comments;
- `/* ... */` explanatory comments;
- `/** ... */` JSDoc descriptions;
- JSDoc `@param` descriptions;
- JSDoc `@returns` descriptions.

Executable declarations remain untouched.

Write the new JSDoc from the actual function behaviour. Do not copy the old JSDoc wording and replace a few terms.

The original Git version is only used afterwards to check whether an important functional fact or edge case was missed.

Not every function must receive JSDoc again. Add it only where it genuinely helps explain FHS behaviour, parameters, return values, or a non-obvious reason.

---

# 10. Group C — Preserve the existing human-readable style

Group C modules already demonstrate the required style.

They should be reviewed for missing context, but existing comments should normally remain untouched.

Group C is fixed for Plan 22:

- `src/circle-tool.js`
- `src/arc-tool.js`

These modules are the reference style. Preserve their existing comments unless a concrete functional explanation is genuinely missing.

Do not move other modules into Group C during implementation.

## `circle-tool.js`

Good existing examples:

```js
/**
 * Layout circle tool that renders SVG circle shapes.
 */
```

```js
/** Updates circle configuration and geometry before entity data is assigned. */
```

```js
/**
 * Converts circle config coordinates to SVG center and radius values.
 */
```

```js
// Keep legacy radius behavior. Use radius_percent when the radius must follow the card percentage scale.
```

These comments simply name:

- circle;
- SVG;
- config;
- center;
- radius;
- entity data.

That is exactly the desired style.

---

## `arc-tool.js`

Good existing examples:

```js
/**
 * Layout arc tool that renders a closed chord arc shape matching horseshoe geometry.
 */
```

```js
/** Updates arc configuration and geometry before entity data is assigned. */
```

```js
/**
 * Converts arc config to SVG center, radius, angles, and end points.
 */
```

```js
// SVG y grows downward; this matches the horseshoe angle convention.
```

Again, no invented vocabulary is required.

These older/manual modules are reference material for the rest of Plan 22.

---

# 11. Do not add comments where none are needed

Plan 22 is not a comment-count exercise.

A comment that only repeats the next line should be removed or not added.

Bad:

```js
// Update config.
this.updateConfig();
```

Bad:

```js
// Return the result.
return result;
```

If there is no useful reason, flow or edge case to explain, no comment is better than noise.

---

# 12. Comment quality test

Every non-trivial comment must pass these checks.

## A. Does it name the actual feature?

Rejected:

```text
The owner recalculates its result.
```

Accepted:

```text
TextTool measures the rendered label again when its text or font changes.
```

## B. Does it explain the reason when the code is not obvious?

Rejected:

```text
Update the current state.
```

Accepted:

```text
Store the current HA entity before formatting the State value, because the unit
and display precision can depend on entity attributes.
```

## C. Could the exact same sentence be pasted above ten unrelated functions?

If yes, reject it.

Automatically suspicious:

```text
Update the current context.
Publish the result.
Retain owner state.
Process the source.
Update presentation.
Invalidate dependent consumers.
Apply effective values.
Continue the runtime pass.
```

## D. Does the comment survive an internal implementation change?

If FHS behaviour remains identical but changing an Array to a Map or a callback
to another mechanism makes the comment wrong, the comment is probably too
implementation-specific.

Rewrite it at the functional level.

---

# 13. Comments may be longer

Comment LOC is irrelevant.

Three clear lines are better than five abstract words.

The reader should be taken through:

```text
what changed
→ which Home Assistant/FHS feature reacts
→ what it does
→ why it does that
→ what uses the value next
```

The source should read like one programmer explaining the card to another programmer.

---

# 14. Executable code is frozen for Plan 22

Plan 22 is comments only.

Do not change:

- JavaScript expressions;
- property names;
- method names;
- class names;
- imports;
- exports;
- literals used by executable code;
- control flow;
- whitespace inside string literals;
- public YAML;
- tests except where a comment-only test fixture genuinely contains comments as data.

Even obvious bad names such as `effectiveStyles` are **not renamed in Plan 22**.

They may be recorded for a later Plan 22B if desired.

This separation is deliberate.

Plan 22 first makes the source understandable without introducing any executable change.

---

# 15. Generated bundle must not change

This is a hard acceptance criterion.

Because Plan 22 changes comments only, the production bundle must be unchanged.

Build the baseline and Plan 22 branch using the same toolchain and compare:

```text
dist/flex-horseshoe-card.js
```

The expected result is:

```text
byte-for-byte identical
```

If the build process inserts timestamps or other non-deterministic content, first
prove that separately and compare the deterministic JavaScript payload.

Do not accept a bundle difference without identifying the exact reason.

A changed executable bundle means Plan 22 has exceeded its scope.

---

# 16. Additional source-level code check

In addition to the bundle comparison, perform a source check that ignores:

- comments;
- insignificant whitespace.

The executable tokens in every changed `src/*.js` file must match the baseline.

The purpose is to catch accidental code changes even before the bundle is built.

Plan 22 should be demonstrably behaviour-neutral by construction.

---

# 17. Whole-source review scope

Review every product module under `src/`.

The three groups guide the method; they do not reduce scope.

For each module record one of:

- **A — comments stripped and rewritten from scratch**
- **B — existing comments preserved selectively; weak comments rewritten**
- **C — existing human-readable comments retained; only missing context considered**

The final report must list every reviewed module as `A`, `B`, `C`, or `review-only`, and must show which issue/commit changed it, if any.

---

# 17A. Fixed classification

The A/B/C classification in this plan is mandatory.

Codex does not decide which modules are "bad", "mixed", or "good enough".

> **The module classification below is part of Plan 22 and is not an implementation decision. Do not move modules between groups.**

Modules not explicitly listed in A, B or C are **review-only** for Plan 22.

`review-only` is a reporting status, not a fourth rewrite strategy.

For review-only modules:

- inspect their comments and JSDoc;
- do not rewrite them unless a comment clearly violates the Plan 22 language rules;
- do not reclassify them into A, B or C;
- report them explicitly as `review-only` in the final module list;
- if a comment change is genuinely necessary, include that comment-only change in **Issue 22B** while keeping the module classified as `review-only`.

Every `src/` module is reviewed, but only the named A/B/C modules belong to those rewrite groups.

This keeps the scope deterministic and makes review and rollback straightforward.

---

# 17B. Execute Plan 22 as three separate issues

Plan 22 must be implemented in three separate issues and three separate commits or merge commits.

Do not combine A, B and C in one implementation issue.

The reason is practical:

- each comment strategy is different;
- each result can be reviewed independently;
- a bad result can be reverted without touching the other groups;
- Git history makes it obvious which comment changes belong together;
- the bundle/hash check can be repeated after every group.

## Issue 22A — Rewrite Group A from scratch

Scope: only Group A modules.

Work:

1. remove existing explanatory comments and JSDoc in the working copy;
2. keep executable code untouched;
3. read the uncommented modules from top to bottom;
4. write new comments and JSDoc from actual FHS/Home Assistant behaviour;
5. compare with the original Git version afterwards;
6. restore only functional facts or edge cases that were missed;
7. run source-token and bundle checks;
8. commit only Group A comment changes.

Expected result: the most AI-polluted modules receive a completely fresh functional explanation.

## Issue 22B — Clean the mixed Group B modules

Scope: Group B modules, plus comment-only corrections in `review-only` modules when a comment clearly violates the Plan 22 language rules. `review-only` modules remain classified as `review-only`.

Work:

1. preserve existing comments that are already clear;
2. rewrite comments/JSDoc that use abstract architecture language;
3. add context only where a non-obvious FHS behaviour is currently unexplained;
4. do not rewrite clear human-readable text for consistency;
5. run source-token and bundle checks;
6. commit only Group B comment changes.

Expected result: mixed modules keep their useful comments while the bad sections are corrected.

## Issue 22C — Review and protect Group C style

Scope: only Group C modules.

Work:

1. treat the current comments as reference quality;
2. do not rewrite existing comments merely for stylistic consistency;
3. add comments only when an important functional reason is genuinely missing;
4. if no changes are needed, the issue may close with no product-code commit;
5. run the normal zero-code-change checks for any edited file.

Expected result: good human-written comments remain good and are not replaced by AI-style prose.

## Commit and rollback rule

Each issue must have its own commit or merge commit.

Do not squash A, B and C together before review.

That gives three independent rollback points:

```text
22A — rewritten Group A comments
22B — cleaned Group B comments
22C — Group C review / minimal additions
```

If one group produces a poor result, revert only that group.

---


# 17C. Preserve legal and tooling comments

When Group A comments are stripped from the working copy, remove only explanatory comments and JSDoc that are being rewritten.

Do **not** remove or rewrite comments that are required for tooling, legal compliance or source processing, including:

- license and copyright text;
- ESLint directives such as `eslint-disable`, `eslint-enable` and `eslint-disable-next-line`;
- Istanbul/coverage directives;
- build or bundler directives;
- source-map or code-generation directives;
- TypeScript/JSDoc directives that affect tooling rather than documentation;
- comments whose exact text is required by an external library or build step.

These comments are outside the readability rewrite and must remain unchanged.

---

# 17D. Use the approved sample rewrites as the style reference

The three reviewed sample modules are approved examples of the desired Plan 22 style:

- `src/text-tool-geometry.js`
- `src/icon-svg-source.js`
- `src/path-geometry.js`

Their rewritten comments are the **starting point and style reference**, not immutable text.

When Plan 22 reaches these modules:

- keep wording that is already clear, concrete and functionally correct;
- do not run the whole module through another generic style rewrite;
- corrections are allowed when they make the explanation factually more accurate or functionally clearer;
- any correction must stay in the same concrete FHS/HA language;
- do not replace clear functional wording with abstract architecture terminology.

For example, the `path-geometry.js` header was corrected because path length and fixed samples are reused differently from temporary animation samples. That kind of factual clarification is explicitly allowed and desired.

The purpose of the samples is to provide target quality while still allowing technically necessary corrections.

---

# 18. Execution sequence

## Step 1 — Baseline

Start from:

```text
6bfa69f67a204f7041806d1118c107560c247c19
```

Create a separate Plan 22 branch.

Build the current production bundle and record its hash.

Run the normal baseline tests.

---

## Step 2 — Use the fixed A/B/C classification

Do not classify modules during implementation.

Use the exact Group A, B and C lists in this plan.

Modules outside those lists are review-only unless a comment clearly violates the Plan 22 language rules.

---

## Step 3 — Issue 22A: rewrite Group A modules

For each Group A module:

1. remove explanatory comments and JSDoc in the working copy;
2. keep executable code untouched;
3. read the uncommented code from top to bottom;
4. add only useful functional comments;
5. finish the rewrite without copying old wording;
6. compare against the old Git version afterwards;
7. recover only missing functional facts or important edge cases.

This is a fresh explanation pass.

---

## Step 4 — Issue 22B: clean Group B modules

For Group B:

- preserve good comments;
- rewrite abstract sections;
- add missing context only where useful;
- remove comments that say nothing.

---

## Step 5 — Issue 22C: review Group C modules

For Group C:

- preserve the current writing style;
- do not rewrite good comments;
- only add a comment when an important non-obvious reason is currently missing.

---

## Step 6 — Whole-source reread

Read all `src/` modules again as a human reader.

Do not use the banned-word search as the main review method.

Ask:

> If I know FHS but have not worked on this function recently, do I understand
> what part of Home Assistant/FHS this is, what happens here, why it happens,
> and what happens next when that matters?

If not, the module is not complete.

---

## Step 7 — Search for leftover abstract wording

Search comments for at least:

```text
owner
ownership
producer
consumer
publication
publish
invalidation
presentation
canonical
effective
runtime pass
source pass
domain
retained work
```

Every remaining occurrence must be justified by a concrete unavoidable meaning.

Otherwise rewrite it.

This search is a final check, not the primary review method.

---

## Step 8 — Verify zero code changes

Perform:

1. source comparison ignoring comments/insignificant whitespace;
2. normal Node tests;
3. lint;
4. Rollup;
5. production bundle hash/byte comparison.

The production bundle must match the baseline.

Browser acceptance is optional for pure comment changes if the source-token and
bundle comparisons prove no executable code changed, but it may still be run as
an additional repository sanity check.

---

# 19. Final report

The Plan 22 report must itself use the same functional language.

It must include:

- every reviewed `src/` module;
- its `A`, `B`, `C`, or `review-only` classification;
- examples of Group A modules rewritten from scratch;
- examples of good Group B comments preserved;
- examples of weak Group B comments rewritten;
- Group C modules deliberately left mostly untouched;
- comments removed because they added no information;
- any unclear code names recorded for possible Plan 22B;
- baseline bundle hash;
- Plan 22 bundle hash;
- explicit statement that the bundle is byte-for-byte identical;
- source executable-token comparison result;
- Node result;
- lint result;
- Rollup result;
- any functional issue noticed but deliberately not fixed.

Do not report:

```text
Improved ownership terminology and normalized presentation comments.
```

Report concrete changes, for example:

```text
main.js now explains that Sparkline updates before the other tools because it
can create fhs_sparkline.* entities. The old producer/consumer wording was removed.
```

---

# 20. Acceptance criteria

Plan 22 is complete only when:

- every product module under `src/` has been reviewed;
- the fixed A/B/C classification was followed without moving modules between groups;
- every remaining `src/` module was reported as `review-only`;
- 22A, 22B and 22C were executed as separate issues and separate commits or merge commits;
- Group A comments and JSDoc were rewritten from the uncommented code rather than edited from old wording;
- clear existing human-written comments were preserved;
- comments and JSDoc use concrete Home Assistant and FHS terminology;
- comments explain flow, reason or context where the code is not obvious;
- abstract architecture language has been removed from explanatory comments;
- `publish/publication` is not used for ordinary storing/updating/passing of values;
- `owner` is not used as a generic replacement for Sparkline, History, Text, Path, Control, etc.;
- `effective` is not used in comments to invent a second concept where FHS only has one;
- license text, lint/build directives and other tooling-required comments were preserved unchanged;
- approved sample rewrites were used as the style baseline and only changed for concrete functional/factual reasons;
- no executable identifier is renamed in Plan 22;
- no executable source token changes;
- public YAML is unchanged;
- Node tests pass;
- lint passes;
- Rollup passes;
- `dist/flex-horseshoe-card.js` is byte-for-byte identical to the baseline build after 22A, after 22B, and after 22C when 22C changes product files;
- the final whole-source reread finds no section that requires an architecture dictionary to understand.

---

# 21. One-sentence standard

> **Write comments as normal functional English about Home Assistant and the FHS card: name the actual thing, say what happens, and explain why it matters.**
