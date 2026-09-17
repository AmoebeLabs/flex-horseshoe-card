# 12 — Theme-aware global color cache

## 1. Goal

Keep cross-card reuse of converted colors for the same effective theme/mode while preventing CSS-variable results from leaking across themes or light/dark modes.

## 2. Prerequisites

- Plan 06 async palette completion validity;
- Plan 07 direct palette/theme update route;
- Plan 08 paint-only invalidation rule.

## 3. Current-code validation

Confirm current `Colors.colorCache` lookup order, CSS variable resolution, `CardTheme` effective theme/mode tracking, palette variable application and any remaining whole-cache clearing.

## 4. Scope

Cache identity must include:

```text
effective Home Assistant theme name
active light/dark mode
configured color expression
```

Preserve shared/global cache efficiency. `hass.themes.theme` is runtime theme identity; do not use theme-picker/local-storage state as fallback identity unless current code explicitly changed and the plan is revised.

Palette application invalidates the affected theme/mode bucket after variables are applied. Literal colors may remain in the same bucket unless a simpler proven safe global literal cache fits current code without complexity.

Keep the existing computed-style resolution through the current card element. `var(--x, fallback)` keeps current parsing/resolution semantics; this plan changes cache identity, not CSS parsing.

One card moving from theme A to B starts using B's bucket while A remains reusable by other cards. A global light/dark change invalidates each used theme bucket idempotently: two cards observing the same mode change must not repeatedly clear freshly rebuilt values.

Manual per-card overrides of the same global variable name under the same declared theme are outside this shared-cache contract unless current FHS explicitly supports them as a first-class theme mechanism. FHS palette variables keep their unique `--fhs-*` naming contract rather than requiring computed-style fingerprints.

## 5. Out of scope

- per-card cache replacing global sharing;
- card lifecycle/invalidation redesign;
- history/data/geometry work on theme change;
- proven color/gradient/filter formula rewrite.

## 6. Implementation sequence

1. Add two-theme same-variable/different-value failing reproduction.
2. Add same-theme sharing and light/dark tests.
3. Carry effective theme name/mode through the minimum `CardTheme`/`Colors` interface.
4. replace destructive global clearing with idempotent affected-bucket invalidation;
5. preserve palette variable contract and invalidate after palette application;
6. verify theme/palette update uses Plan 08 paint-only route;
7. search for direct cache ownership/clears outside `Colors`.

## 7. Permanent tests

- same theme/mode shares result;
- different themes same CSS expression remain separate;
- dark/light separate;
- two same-theme cards do not repeatedly clear fresh cache;
- palette invalidates correct bucket;
- gradients/filters receive correct conversion;
- zero history/reaggregation on theme/palette-only update.

## 8. Definition of Done

- no cross-theme/mode CSS-variable cache leakage;
- same-theme cross-card reuse remains;
- cache ownership stays in `Colors`;
- CardTheme only supplies current identity/invalidation trigger;
- theme/palette work remains paint-only through established lifecycle;
- no second invalidation architecture introduced.

## 9. Guarantees for following plans

Final cleanup may remove obsolete global-clear code/comments but must retain this cache identity and paint-only behaviour.

## 10. Source material

Successor of the adjusted old Plan 13, now explicitly dependent on the completed lifecycle/change-detection plans rather than partially restating them.
