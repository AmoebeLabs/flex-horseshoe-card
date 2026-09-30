# FHS simplification plans 15–20

## Purpose

This package defines the follow-up simplification sequence for `AmoebeLabs/flex-horseshoe-card` after Plans 01–14.

The sequence is based on `master` commit `44eac7b6cb9d93e6b76a10f801576f052788d44e` (`5.4.7-dev.32`) and on the whole-chain review performed after Plan 14.

The objective is deliberately narrower than the previous architecture refactor:

- preserve public YAML and established visible behaviour;
- preserve proven Sparkline and Path/Horseshoe mathematics;
- make the existing configuration flow explicit and trustworthy;
- remove duplicate configuration validation, coercion and defaults from downstream consumers;
- remove repeated tool boilerplate where a current shared owner already exists;
- reduce total product-owned source, not merely move code into new files;
- leave a fully working, testable card after every plan.

This is **not** a rewrite and must not introduce a new generic framework.

## Central configuration model

The old hand-built tools remain the reference for the intended runtime model:

```text
compiled source config
        ↓
evaluate JavaScript when required
        ↓
configuration gatekeeper
  - defaults
  - legacy conversion
  - type conversion
  - normalization
  - validation
        ↓
this.config
        ↓
tool / controller / series / history / graph / renderer
```

`sourceConfig` is the stable, re-evaluable source owned by a tool after card-level compilation such as templates, `ref()`, `calc()`, entity addresses, compounds and `same_as`.

`sourceConfig` and `this.config` must not alias the same mutable object. The source must remain unchanged by runtime geometry, paint selection or other tool-owned derived fields.

A candidate produced from `sourceConfig` is a **local/transient value only**. It is normalized and validated before publication; it is not a third persistent configuration state.

`this.config` is the accepted active configuration. Tool-owned derived runtime fields such as calculated SVG geometry may remain attached to `this.config` where that is already the established design, but they are outputs added **after acceptance** and must never feed back into `sourceConfig` or candidate validation.

Once a value is exposed through `this.config`, downstream code must not validate, normalize, coerce, repair or invent fallback values for that configuration field again.

A JavaScript template does not weaken this rule. A new template result must pass through the same gatekeeper before it can replace `this.config`.

Theme/group changes are not configuration acceptance. They may invalidate paint or geometry derived from an already accepted config, but they must not cause public-schema validation/coercion to run again.

## Runtime checks that remain valid

The gatekeeper rule applies to configuration. It does not remove legitimate checks for:

1. **External runtime data** — Home Assistant states/history, missing entities, network results, DOM state.
2. **Asynchronous validity** — stale request identity, disconnect/replacement, retry state.
3. **Algorithmic edge cases** — a mathematically valid input producing a degenerate ratio, empty dataset or equivalent condition.
4. **Semantic conversion owned by a consumer** — for example parsing an accepted CSS font-size string into pixels for geometry. That is not re-validating the config schema.

Every downstream guard touched by these plans must be classified into one of those categories. A configuration-category guard is not allowed to remain downstream.

## Files in this package

| File | Purpose |
|---|---|
| `00-master-simplification-plan.md` | fixed architecture, sequencing and acceptance rules |
| [`2026.09.28-15-shared-tool-simplification.md`](../2026.09.28-15-shared-tool-simplification.md) | remove low-risk repeated tool boilerplate |
| [`2026.09.28-16-configuration-gatekeeper.md`](../2026.09.28-16-configuration-gatekeeper.md) | simplify source and active tool configuration ownership |
| [`2026.09.28-17-controls-trusted-config.md`](../2026.09.28-17-controls-trusted-config.md) | simplify repeated control configuration work without changing behavior |
| [`2026.09.30-18-sparkline-trusted-config.md`](../2026.09.30-18-sparkline-trusted-config.md) | consolidate proven duplicate Sparkline configuration work without changing behavior |
| `19-horseshoe-path-trusted-config.md` | do the same for Horseshoe/Path configuration |
| `20-whole-chain-simplification.md` | final guard/duplicate/readability audit and source-size acceptance |
| `TESTING.md` | permanent regression and verification policy |
| `CROSS-PLAN-REVIEW.md` | dependency and no-rework review |
| `REVIEW-FINDINGS.md` | findings from the broader code review that are intentionally separate from Plans 15–20 |

## Implementation order

```text
15 shared tool simplification
 -> 16 configuration gatekeeper
     -> 17 controls trusted config
         -> 18 Sparkline trusted config
             -> 19 Horseshoe/Path trusted config
                 -> 20 whole-chain simplification
```

Each plan branches from the completed previous plan. Do not implement dependent plans against sibling branches.

## Locator rule

All line ranges in these documents refer to commit `44eac7b6cb9d93e6b76a10f801576f052788d44e`.

They are locators, not permanent instructions. At the start of every plan:

1. resolve the actual branch/commit;
2. locate the named function/symbol;
3. verify that the described route still exists;
4. update only the line locator if earlier plans merely moved lines;
5. revise the plan before implementation if the ownership or functional premise changed.

The functional contract and Definition of Done are authoritative.

## Source-size rule

The Plan-14 source-size report recorded 23,785 code lines and 32,677 physical lines in product-owned `src/` excluding copied Home Assistant frontend code.

Recalculate the exact baseline at the beginning of Plan 15.

Every plan records:

- product-owned code lines before/after;
- physical source lines before/after;
- affected module sizes before/after;
- added and removed functions where useful.

A smaller file is not a success if the same logic was copied into another module.

The working expectation for Plans 15–20 is roughly **500–1,000 net product code lines removed**, but this is a review estimate, not a target that justifies compressing clear code or deleting required behaviour.
