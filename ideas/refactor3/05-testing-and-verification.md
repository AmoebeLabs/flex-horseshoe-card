# Regression and Architecture Verification

## 1. Functional invariant

Internal object shapes are intentionally allowed to change.

Externally meaningful behaviour is not.

For supported existing inputs preserve:

- accepted YAML/config behaviour;
- current JavaScript-template behaviour, including the exact template-visible default/context ordering;
- Home Assistant state interpretation;
- visible text and units;
- positions and dimensions;
- path geometry;
- colors and gradients;
- control interactions;
- history results;
- Sparkline graph results;
- lifecycle cleanup;
- browser rendering.

The architecture refactor is successful when those results remain while the internal owners become simpler.

---

## 2. Existing command baseline

Current `package.json` provides:

```bash
npm test
npm run lint
npm run rollup
npm run build
npm run test:browser
npm run test:browser:all
```

`npm run build` already executes Node tests, lint and Rollup.

---

## 3. Existing relevant test families

### Simple tools / geometry

- `tests/svg-geometry.browser.spec.js`
- `tests/polygon-tool.test.js`
- `tests/polygon-tool.browser.spec.js`
- `tests/state-tool-decimals.test.js`
- `tests/state-tool-formatting.test.js`
- `tests/icon-source.test.js`
- `tests/icon-async-results.test.js`
- `tests/config-ref.browser.spec.js`

### Lifecycle / configuration / async

- `tests/card-lifecycle.browser.spec.js`
- `tests/card-change-detection.browser.spec.js`
- `tests/card-domain-classes.test.js`
- `tests/config-ref-integration.test.js`
- `tests/config-ref.browser.spec.js`
- `tests/async-results.test.js`
- `tests/async-results.browser.spec.js`
- `tests/theme-color-cache.test.js`
- `tests/theme-color-cache.browser.spec.js`

### Controls

- `tests/control-content.test.js`
- `tests/control-family-theme-refresh.test.js`
- `tests/control-slider.test.js`
- `tests/control-toggle-config.test.js`

### Sparkline

- `tests/sparkline-graph-tool.test.js`
- `tests/sparkline-series.test.js`
- `tests/sparkline-history.test.js`
- `tests/sparkline-history-lifecycle.browser.spec.js`
- `tests/sparkline-graph.test.js`
- `tests/sparkline-pointer.test.js`
- `tests/sparkline-pointer.browser.spec.js`

### Horseshoe / Path

- `tests/horseshoe-state.test.js`
- `tests/horseshoe-labels.test.js`
- `tests/horseshoe-cache.browser.spec.js`
- `tests/horseshoe-marker.browser.spec.js`
- `tests/horseshoe-path-adapter.test.js`
- `tests/horseshoe-path-adapter.browser.spec.js`
- `tests/path-animator.test.js`
- `tests/path-animator.browser.spec.js`
- `tests/path-elements.test.js`
- `tests/path-elements.browser.spec.js`
- `tests/path-generators.test.js`
- `tests/path-geometry.test.js`
- `tests/path-ranges.test.js`
- `tests/path-renderer.test.js`
- `tests/path-renderer.browser.spec.js`
- `tests/path-gradient-renderer.test.js`
- `tests/path-gradient-renderer.browser.spec.js`
- `tests/path-side-positions.browser.spec.js`

---

## 4. Architecture-level assertions

Add small, direct source/ownership tests as families migrate. Do not build a large validator framework.

Useful final assertions include:

- no migrated BaseTool descendant stores derived SVG under `this.config.svg`;
- no tool owns persistent `activeItemConfig` or `runtimeConfig`;
- no Sparkline runtime owner creates persistent `effectiveConfig`;
- `ControlSelect.setState()` does not assign `this.config.option_map`;
- control state processing does not assign `child.tool.config.styles`;
- Horseshoe `setState()` does not assign `this.config`;
- no instance owns `this.newConfig`;
- configured `state_map` remains in config while selected/current mapping is runtime/local;
- initial and dynamic tool config use the same source-preparation/evaluation/translation semantics;
- template-visible defaults remain visible at the same stage (Arc `radius: 45` characterization is the reference);
- parent-driven paint styles preserve current merge priority;
- effective Text-like paint changes still invalidate measurement geometry when font metrics change;
- no shared active color-stop owner is partially migrated across families.

These assertions are valuable because they verify the architecture itself, which visual screenshots cannot prove.

---

## 5. Mandatory characterization tests before ownership movement

### JavaScript item context

For every family with preprocessing before BaseTool, capture at least one representative test showing what `item` sees before moving that preprocessing.

Arc minimum:

```text
omitted radius + template using item.radius
→ 45 is visible
→ expression result remains 90
```

Controls/Sparkline/Horseshoe need equivalent focused cases for any defaults whose visibility would change if moved.

### Style priority and measurement

Before Controls stop mutating child `config.styles`, test an overlap where the same style property is present in configured child styles and state/selection styles. The final effective style must remain identical.

For Text-like child content, include a metric-affecting style change and prove measurement/geometry is invalidated exactly as before.

### Shared color-stop cutover

At the Plan-19 atomic owner switch, run focused ordinary-tool, Control, Sparkline and Horseshoe paint tests together. A partially migrated owner is not an acceptable intermediate result.

---

## 6. Two-pass verification

### After Pass A

Run focused unit tests and the browser tests most closely related to the migrated family.

At this point failures are highly local because the primary changes are ownership, move and rename.

### After Pass B

Run the same focused suite again.

A helper/guard/signature deletion is accepted only when the existing observable behaviour remains covered.

---

## 7. Full final verification

Before Plan 20 completes:

```bash
npm run build
npm run test:browser:all
```

plus all architecture assertions introduced in Plans 15B–19.

---

## 7. Diff review rule

A large algorithmic diff inside an ownership-refactor plan is suspicious.

Reviewers should ask:

> Why did this calculation change?

A valid answer is that the changed owner/interface required a small adaptation.

“It could be implemented more elegantly” is not sufficient scope for this project.

---

## 8. What equality means

Do not require internal equality of objects that the refactor intentionally removes.

For example, there is no requirement that an old `runtimeConfig` object remain byte-for-byte reproducible after Horseshoe moves those fields to runtime/paint.

Verify instead that:

```text
same valid input
→ same interpreted meaning
→ same geometry/value/paint
→ same rendered/interacted result
```

That is the correct black-box invariant for an architecture migration.
