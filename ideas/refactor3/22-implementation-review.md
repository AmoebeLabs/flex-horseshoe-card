# Plan 22 Implementation Review

**Date:** 2026-10-05  
**Repository:** `AmoebeLabs/flex-horseshoe-card`  
**Branch:** `feature/22-readable-functional-comments`  
**Baseline:** `6bfa69f67a204f7041806d1118c107560c247c19`

## Verdict

**BLOCKING: 0**  
**REWORK: 1**  
**Functional safety: confirmed**

The Plan 22 implementation is a substantial improvement and is functionally safe.

The branch should **not be merged yet**, but it does **not** need another broad rewrite pass. The remaining work is a small, targeted correction round for a limited number of comments that still use vague architecture-style wording.

No architecture or functional rework is required.

---

## Branch structure

The implementation is split correctly:

- `7e66e16` — dated Plan 22
- `2ffb542` — 22A, Group A comment rewrite
- `21b2ae6` — 22B, Group B and review-only cleanup
- `0f523669` — 22C, Group C review and results report

The branch is based on the correct Plan 21 baseline and is not behind `master`.

---

## Code-neutrality review

The implementation is comments-only as required.

Independent review of the 22A, 22B and 22C diffs found:

- **zero changed executable `src` lines**
- all added/removed `src` lines are comments, JSDoc or blank lines
- no executable identifiers were changed
- no imports or exports changed
- no literals or control flow changed

This independently supports the implementation report's Acorn verification:

- 190,600 executable tokens identical
- normalized ASTs identical
- protected legal/tooling comments identical
- baseline and candidate production bundles byte-for-byte identical
- identical SHA-256 for baseline, 22A, 22B and final

There is no indication that Plan 22 changed runtime behaviour.

---

## General comment quality

The Group A rewrite worked well.

The main modules now explain concrete FHS and Home Assistant behaviour instead of describing an abstract software architecture.

Examples include:

```js
// Sparkline can change fhs_sparkline.* values used by Text, State, Horseshoe
// and Controls. Store those values before evaluating their templates.
```

This clearly explains:

- which FHS feature is involved;
- why Sparkline runs first;
- which values it creates;
- which tools use those values afterwards.

The same improvement is visible throughout:

- `main.js`
- `base-tool.js`
- `card-entities.js`
- `path-geometry.js`
- `sparkline-history.js`
- `sparkline-series.js`
- `icon-svg-source.js`

The corrected `path-geometry.js` header also properly distinguishes between:

- path length measured once per path shape;
- reusable fixed point/direction samples;
- temporary animation samples that are replaced when the animated position changes.

The approved sample rewrites were retained rather than rewritten generically.

---

## Prohibited terminology check

The Plan 22 prohibited-word cleanup succeeded.

Across all changed modules, the reviewed comments no longer contain the generic architecture wording targeted by the plan, including:

- `owner`
- `ownership`
- `producer`
- `consumer`
- `publish`
- `publication`
- `invalidation`
- `presentation`
- `canonical`
- `effective`
- `runtime pass`
- `source pass`
- `domain`
- `retained work`

However, a small number of **other** words still produce the same type of vague architecture prose.

These should be corrected before merge.

---

# REWORK 1 — Remaining architecture-style wording

This is a bounded comment-only cleanup.

Do **not** perform another general rewrite of the branch.

Fix only the findings below and leave surrounding comments unchanged where they are already clear.

---

## 1. `runtime entity context`

### `src/area-tool.js`

Current:

```js
/**
 * Updates runtime entity context and displayed area text.
 */
```

Recommended:

```js
/** Stores the HA entity and updates the displayed Area text. */
```

### `src/name-tool.js`

Current:

```js
/**
 * Updates runtime entity context and displayed name text.
 */
```

Recommended:

```js
/** Stores the HA entity and updates the displayed Name text. */
```

### `src/state-tool.js`

Current:

```js
/**
 * Updates runtime entity context and displayed state/UOM text.
 */
```

Recommended:

```js
/** Stores the HA entity and rebuilds the displayed State value and unit. */
```

These current comments are generic enough to be pasted above unrelated functions. The replacements name the actual HA/FHS behaviour.

---

## 2. `pipeline`

### `src/card-input-entities.js`

Current:

```js
Global FHS inputs send their state through window events. This card
updates its local entity record through the normal hass pipeline.
```

Recommended:

```js
Global FHS inputs send their state through window events. This card
updates the matching local entity and processes it like any other entity change.
```

`normal hass pipeline` does not explain what the card actually does.

### `src/card-templates.js`

Current wording includes:

```js
before the normal FHS config pipeline continues.
```

Recommended:

```js
before FHS continues compiling the card's entities and layout.
```

Current:

```js
// Replace the input config in-place so setConfig can continue with the normal pipeline.
```

Recommended:

```js
// Replace the config in place so the compiled template becomes the config
// used by the rest of setConfig().
```

---

## 3. `lifecycle`

Several comments still use `lifecycle` as a generic substitute for concrete behaviour.

### `src/control-base.js`

Current:

```js
/** Gives rebuilt content the lifecycle already reached by this control. */
```

Recommended:

```js
/** Gives rebuilt content tools the Control's current HA and DOM connection state. */
```

The function explicitly forwards:

- `hassAvailable()`
- `connected()`
- `disconnected()`

The comment should say that.

Current:

```js
/** Runs TextTool measurement and overflow lifecycle after rendering. */
```

Recommended:

```js
/** Lets the label TextTool measure rendered text and finish wrapping or ellipsis. */
```

### `src/control-select.js`

Current:

```js
/** Runs child TextTool and IconTool post-render lifecycle hooks. */
```

Recommended:

```js
/** Lets option Text and Icon tools finish their post-render measurement and setup. */
```

### `src/control-content.js`

Current:

```js
// Use the existing FHS visual tools for each content type, preserving their
// normal state, color-stop, template, animation and lifecycle behavior.
```

Recommended:

```js
// Use the existing FHS visual tools so they keep their normal state,
// color-stop, template and animation handling.
```

The word `lifecycle` adds no useful functional information here.

---

## 4. `animation pipeline`

### `src/text-tool.js`

Current:

```js
// Source animations are resolved during render, after the animation
// pipeline has activated the styles for this exact state update.
```

Recommended:

```js
// Source animations are resolved during render, after the current animation
// has selected the styles for this state update.
```

This says what actually happened instead of naming an abstract pipeline.

---

## 5. Remaining vague `context` wording in `colors.js`

### `src/colors.js`

Current:

```js
// Cards with a matching context share one active mode/source/document set.
// A context transition clears only that shared bucket, once.
```

Recommended:

```js
// Cards using the same HA theme mode and palette documents share one color cache.
// When the theme or palette documents change, clear only that shared cache.
```

This is clearer and directly matches the fields used by the code.

Do **not** globally ban `context`.

`JavaScript template context`, for example, is a concrete and useful concept in FHS.

The issue is only vague usages such as `matching context` or `runtime entity context`.

---

## 6. `reproject` in `sparkline-graph-tool.js`

This wording is not as problematic as the findings above, but it is still less direct than necessary.

Examples include:

```js
@param {boolean} usePointerCoordinates - Reproject the event after graph bins change.
```

Recommended:

```js
@param {boolean} usePointerCoordinates - Recalculate the pointer position after graph bins change.
```

Current:

```js
/** Reprojects the active marker and tooltip after graph, layout or mounted-SVG updates. */
```

Recommended:

```js
/** Recalculates the active marker and tooltip position after graph, layout or SVG changes. */
```

The code recalculates pointer coordinates against the current graph. The comment should say that directly.

---

# What should not be changed

Do **not** start another broad Plan 22 rewrite.

The current comments in the large Group A modules are generally good and should remain untouched unless one of the specific findings above applies.

In particular:

- do not generically rewrite `main.js`;
- do not generically rewrite `path-geometry.js`;
- do not generically rewrite `sparkline-history.js`;
- do not generically rewrite `sparkline-series.js`;
- do not run all comments through another "consistency" pass.

The remaining work should be a deliberately small correction commit.

---

# Recommended correction instruction

Use a narrowly scoped task such as:

> Fix only the remaining Plan 22 wording findings listed in `22-implementation-review.md`.  
> Do not rewrite surrounding comments that are already clear.  
> Keep all changes comment-only.  
> Do not change executable code, identifiers, configuration, tests or public YAML.

After those corrections, rerun:

1. Acorn executable-token comparison;
2. normalized AST comparison;
3. protected legal/tooling-comment comparison;
4. lint;
5. Rollup;
6. production bundle byte comparison and SHA-256;
7. Plan 22 prohibited-word search;
8. an additional comment search for:
   - `pipeline`
   - `lifecycle`

Occurrences of `context`, `binding` or similar words should be reviewed manually rather than prohibited globally, because they can have legitimate concrete meanings.

---

# Final assessment

Plan 22 has achieved its main goal.

The source now reads much more like one programmer explaining FHS to another programmer:

- concrete Home Assistant and FHS concepts are named;
- comments explain what happens;
- comments usually explain why the ordering or special handling exists;
- the abstract `owner` / `producer` / `consumer` / `publication` vocabulary is gone;
- Group A was successfully rewritten without changing executable code;
- Group B preserved useful comments while replacing much of the weak wording;
- Group C remained essentially untouched.

The remaining findings are limited to a small number of comments using words such as `pipeline`, `lifecycle`, vague `context`, and `reproject`.

After that targeted correction round, the branch is merge-ready.
