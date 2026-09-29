# Shared testing policy for Plans 15–20

## 1. Purpose

Every plan must finish as a fully working version that can be tested independently.

Testing protects behaviour while implementation ownership changes. It must not encode temporary helper names.

## 2. Test layers

### A — configuration acceptance

For fields moved to the gatekeeper:

- static YAML value;
- equivalent JavaScript-produced value;
- invalid static value;
- defaults;
- legacy/public form normalization;
- accepted internal type.

For supported values, preserve the existing static and JavaScript routes. User-authored JavaScript failures are not a new card-level validation or recovery feature.

### B — neighbouring real modules

Use real adjacent owners where possible:

- BaseTool + concrete tool;
- ControlBase + concrete Control;
- Sparkline GraphTool + Series + History/Graph;
- Horseshoe normalizer + Gauge + Path generator.

Mock only actual boundaries such as HA network/time/DOM.

### C — complete card route

Build a real card from existing YAML, assign `hass`, and verify output.

Representative routes:

```text
HA entity -> StateTool -> visible text
HA entity -> Sparkline -> derived entity -> StateTool
HA entity -> Control -> visual state
HA entity -> Horseshoe -> path state
```

### D — browser

Use Playwright where DOM/SVG behaviour matters:

- text measurement and rectangle fit;
- Icon/HA icon DOM path;
- controls/pointer;
- Sparkline pointer/measurement;
- radial/cartesian switching;
- Horseshoe measured path/gradients/animation;
- WebKit-sensitive routes.

## 3. Gatekeeper-specific permanent tests

The suite must prove:

1. `sourceConfig` remains reusable after repeated JS evaluation.
2. `sourceConfig` and `this.config` do not alias; derived fields added to accepted config do not mutate source.
3. `newConfig` is local during the existing BaseTool processing; no third persistent config state is introduced.
4. Existing valid static and JavaScript configurations keep their established results.
5. Existing checks retain clear owners; no new JavaScript failure handling is introduced.
6. Accepted-config changes invalidate the correct config-dependent work.
7. Group/layout changes update placement/geometry without rerunning schema acceptance.
8. Theme/mode/palette changes update active theme-derived paint/geometry without rerunning schema acceptance.
9. Repeated render/paint-only updates do not rerun configuration acceptance unnecessarily.

## 4. Guard-classification tests

When removing a downstream guard, add/retain the behaviour test at the real boundary.

Examples:

- remove config numeric guard from History -> config acceptance test + existing History range result test;
- retain HA history numeric guard -> test invalid/unavailable HA row is ignored/represented correctly;
- remove render enum throw -> acceptance test rejects enum before render;
- retain CSS unit parsing -> geometry test proves accepted CSS units calculate correctly.

## 5. Plan-specific minimums

### Plan 15

- measured text geometry;
- rectangle fit;
- group transforms;
- section construction/render order.

### Plan 16

- valid static/JavaScript behavior and unchanged startup;
- independent source and active nested configuration;
- ordinary Line/Polygon checks and group/theme refreshes;
- numeric z-position used by sorting.

### Plan 17

- all control config families;
- Slider attribute runtime availability;
- child lifecycle forwarding;
- pointer/timer cleanup.

### Plan 18

Retain the complete Sparkline permanent matrices from the previous refactor:

- rolling/calendar/DST;
- offsets;
- implicit/explicit series;
- final effective series config after parent + override merge and paint precedence;
- multi-series;
- line/area/minmax/bar/dots;
- radial;
- state bands;
- real time;
- derived entities;
- loading/empty/error/recovery;
- pointer lifecycle;
- theme/cache reuse.

### Plan 19

- every path type;
- marker relationships;
- gradients;
- ticks/labels;
- animation;
- measured geometry;
- WebKit.

### Plan 20

- whole card;
- full browser matrix;
- representative manual visual check;
- mandatory missing-entity route: first missing, present -> missing, missing -> returned, Sparkline/derived source and day/night sun source.

## 6. Commands

During implementation use focused tests first.

Before each plan completes:

```text
npm test
npm run lint
npm run rollup
```

Run affected browser projects.

Before Plan 20 completes:

```text
npm run test:browser:all
```

`npm run build` is equivalent to Node tests + lint + Rollup and may be used as the combined non-browser gate.

## 7. Browser policy

Current scripts:

```text
npm run test:browser          # Chromium
npm run test:browser:webkit   # WebKit
npm run test:browser:firefox  # Firefox
npm run test:browser:all      # all configured projects
```

Keep screenshot assertions focused on actual visible geometry. Prefer direct DOM/state/value tests for ownership and gatekeeper behaviour.

## 8. Failure rule

When an existing test fails:

1. reproduce and understand it;
2. classify it as regression, intentional bug fix, invalid old implementation assertion, or nondeterminism;
3. do not update expected values merely because code moved.

Graph/Path formulas are preservation baselines unless a separate defect was reproduced and approved.

## 9. Source-size check is part of acceptance

After every plan measure product source.

A test-green refactor that simply moves duplicate code elsewhere does not satisfy these plans.
