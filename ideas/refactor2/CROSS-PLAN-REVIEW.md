# Cross-plan review — Plans 15–20

## 1. Dependency graph

```text
15 shared tool simplification
  -> 16 configuration ownership
      -> 17 controls
          -> 18 Sparkline
              -> 19 Horseshoe/Path
                  -> 20 whole-chain audit
```

No plan requires a later plan's implementation to be correct.

## 2. Why Plan 15 comes first

It removes mechanically confirmed duplication without touching configuration semantics.

That reduces review noise before the configuration cleanup and provides an immediate working source reduction.

## 3. Why Plan 16 precedes all family cleanup

Plan 16 clarifies configuration ownership before family-specific cleanup. It separates the stable `sourceConfig` from active `this.config` and distinguishes configuration, layout/group and theme changes while preserving existing behavior.

Plans 17–19 can therefore remove only configuration work proven redundant within each family, without inventing a new validation or acceptance contract.

## 4. Why Controls precede Sparkline/Horseshoe

Controls are complex enough to exercise the distinction between configuration work and external runtime data, but smaller than Sparkline/Horseshoe.

The Slider is especially useful because it demonstrates the critical distinction:

```text
configured scale source schema -> config
current entity attribute value -> external runtime data
```

## 5. Why Sparkline is separate

Sparkline has four owners with deliberately repaired responsibilities:

- GraphTool;
- Series;
- History;
- Graph.

Mixing config cleanup with Horseshoe would make whole-chain verification too broad.

Plan 18 keeps raw-override checks and final effective-series configuration in
`SparklineSeries.updateConfig()`, including the implicit single-series path.
Graph/history formulas and signature-sensitive numeric representations remain
unchanged.

## 6. Why Horseshoe is after Sparkline

Horseshoe already has `normalizeBaseConfig()` and `normalizeRuntimeConfig()`, but Gauge still mixes public path validation into runtime path construction.

Plan 19 can clarify Horseshoe's existing configuration ownership without inventing another architecture. It also removes Horseshoe's current `activeItemConfig` / `runtimeConfig` parallel general-config route so `this.config` becomes its normal active configuration. Gauge/Path should not repeat public-config checks already covered by the existing Horseshoe config owner; legitimate algorithmic and runtime checks remain.

## 7. Why the whole-source guard audit is last

Before Plans 16–19, some downstream config checks are temporarily still necessary because their family has not migrated.

Only after Plan 19 can Plan 20 audit remaining downstream config-category
guards globally. The target is zero **proven redundant** downstream config
checks, not zero checks of every kind. Series-owned raw/effective config checks
are configuration work, not downstream revalidation.

## 8. No temporary architecture

No plan may introduce:

- a validator that the next plan replaces;
- a second config state that the next plan removes;
- a temporary fallback;
- new duplicate static/dynamic validation as a temporary bridge.

A family completed in one plan must not rely on a temporary configuration
route that the next plan has to remove.

## 9. Stable guarantees by plan

| Plan | Permanent result |
|---|---|
| 15 | shared boilerplate removed; no config semantic change |
| 16 | stable `sourceConfig`, active `this.config`, and distinct config/layout/theme invalidation; existing behavior preserved |
| 17 | Controls avoid proven repeated config work; runtime HA data remains runtime |
| 18 | Series owns raw/effective series config and runtime items; History/Graph lose only proven duplicate config work |
| 19 | Horseshoe uses `this.config` as its normal active configuration; only proven duplicate public-config checks are removed |
| 20 | final whole-chain audit of remaining duplication, guards and readability; separately identified runtime defects remain separate unless explicitly brought into scope |

## 10. First-review findings

Broader findings are deliberately separated in `REVIEW-FINDINGS.md`.

The missing-entity finding remains separate from Plans 15–20. Plan 20 may use
it to classify external runtime checks, but does not have to fix it.

External SVG, CardTemplates substitution and persisted-input issues do not block the simplification work unless implementation discovers a direct dependency.
