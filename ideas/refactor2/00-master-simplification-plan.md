# 00 — FHS simplification master plan

## 1. Goal

Complete the simplification that remained after Plans 01–14.

The previous refactor repaired ownership, history, data/geometry separation, lifecycle, pointer handling, path animation and cache behaviour. It did not reduce product source as much as expected. The current code still contains repeated tool methods and, more importantly, configuration validation/default/coercion in consumers that should already receive accepted configuration.

This sequence repairs that remaining boundary without redesigning the card.

Baseline locator commit: `44eac7b6cb9d93e6b76a10f801576f052788d44e`.

## 2. Non-negotiable functional model

### 2.1 Card-level source preparation already exists

`src/main.js:setConfig()` currently performs the established card-level sequence around lines 432–557:

```text
clone incoming Lovelace config
 -> CardTemplates.compile
 -> Templates.beginConfig
 -> developer/card defaults
 -> assign layout ids
 -> compile ref()/calc()
 -> compile Controls disabled config
 -> remove disabled entities
 -> entity slots / address normalization
 -> compounds
 -> same_as
 -> remove disabled layout items
 -> FHS input validation
 -> action validation
 -> detect JavaScript templates
 -> runtime entity config preparation
 -> layout/entity-index finalization
 -> this.config = config
 -> construct concrete tools
```

Plans 15–20 do not replace this pipeline.

The tool-level `sourceConfig` is therefore not literal raw YAML. It is the stable tool source after the established card-level compilation steps.

### 2.2 Tool-level active configuration

For every `BaseTool` descendant:

```text
sourceConfig
   ↓
JavaScript evaluation when required
   ↓
normalization / defaults / type conversion / validation
   ↓
this.config
```

The meaning of the two names is fixed for correctly specified configuration:

- `sourceConfig`: stable input used when configuration must be evaluated again.
- `this.config`: the current active configuration after existing tool-level processing, consumed by runtime code.

"Accepted" in this document means processed through the existing configuration route. It does not promise that arbitrary user-authored JavaScript output is valid or that the card recovers from it.

### Source, candidate, accepted config and derived fields

The current baseline aliases `sourceConfig` and `this.config` in `BaseTool` and then lets tools add fields such as `svg`. That is incompatible with a stable re-evaluation source.

The permanent contract is:

```text
sourceConfig                    persistent; stable; never runtime-mutated
    ↓ evaluate/copy
candidate                       local variable only; never stored as a third config state
    ↓ defaults/normalize/convert/validate
this.config                     persistent accepted active config
    ↓
tool-owned derived fields       geometry/paint/cache outputs calculated after acceptance
```

`sourceConfig` and `this.config` must be structurally independent mutable objects. Runtime mutation of `this.config` must not mutate `sourceConfig`.

Existing calculated fields such as `config.svg` do **not** have to be moved into a new architecture merely for purity. They may remain attached to `this.config` when that is the established tool contract, provided that:

- they are calculated only after config acceptance;
- they are recreated/updated from accepted inputs;
- they are excluded from source/candidate equality and acceptance decisions;
- they never flow back into `sourceConfig`;
- they are not treated as user configuration on the next evaluation.

Do not introduce a parallel persistent generic `runtimeConfig`, `finalConfig`, `resolvedConfig`, `validatedConfig`, pipeline object or configuration state machine merely to express this rule.

A specialized tool may retain a domain-specific prepared object such as a path definition or graph result when it has a real separate meaning, but it must not create another ambiguous general configuration copy.

### 2.3 Gatekeeper guarantee

For correctly specified configuration, once `this.config` is published, consumers may assume:

- required defaults are present;
- legacy forms have been converted;
- values have the documented internal type;
- enums and ranges are valid;
- nested public config has been normalized to the internal shape;
- JavaScript-produced values followed the existing configuration route; no new error-recovery guarantee is implied.

For nested Sparkline series, `SparklineSeries.updateConfig()` is the existing
owner that checks raw overrides and builds effective series from the parent.
Publishing the parent `this.config` does not create a new atomic acceptance or
last-valid guarantee for that nested collection.

Consumers therefore must not:

- call `Number(...)` merely to re-prove a value that its configuration owner
  already converted; retain consumer conversion when numeric text is part of
  established config/signature change detection;
- call `Number.isFinite(...)` merely to re-prove a config field is numeric;
- repeat enum/range validation;
- apply a second default with `??`, `||` or equivalent;
- silently repair an invalid config;
- throw an "invalid configuration" error from a renderer, graph calculator, history processor or other downstream consumer.

### 2.4 Dynamic JavaScript follows existing configuration behavior

JavaScript-produced values use the ordinary configuration route; they do not create a separate tool lifecycle. The refactor preserves current startup, evaluation, rendering and failure behavior. The user authors the JavaScript template and can provide a default when Home Assistant data is absent. Do not add new validation, fallback or recovery behavior in Plans 16-20. See `16-plan-simplification-guardrails.md`.

### 2.5 Acceptance invalidation is distinct from layout and theme invalidation

The baseline currently overloads `configChanged` with:

- first/changed active JavaScript config;
- changed layout group;
- theme mode change.

That conflates different responsibilities.

After Plan 16:

- **accepted-config change** means source/evaluated configuration produced a different accepted configuration;
- **layout/group change** means accepted config is unchanged but its placement/context changed;
- **theme-derived presentation change** means accepted config is unchanged but active light/dark/palette-derived output changed.

A group or theme change must not rerun public-schema validation merely to refresh geometry or colors.

Theme-dependent `color_stops` are a special case: the active mode may select different stop values and therefore may legitimately invalidate paint and, where stop positions affect visible geometry/labels, geometry. That is still **derived theme materialization**, not a new public configuration acceptance.

The implementation may retain a small set of explicit booleans/flags, but their meanings must not overlap. Do not rename one overloaded flag without separating the work it controls.

### 2.6 Downstream checks are classified, not blindly removed

Every check encountered during this sequence is classified as exactly one of:

1. **configuration** — belongs at the gatekeeper and must not remain downstream;
2. **external runtime data** — remains with the owner of the HA/network/DOM data;
3. **async/lifecycle validity** — remains with the resource owner;
4. **algorithmic invariant/edge case** — remains where the calculation owns it;
5. **consumer-owned semantic conversion** — remains if it transforms an already-valid accepted type for the consumer's job, e.g. accepted CSS units to geometry pixels.

A plan may not delete a check until its category is established.

## 3. Simplicity rules

The target is the direct style of the original hand-built tools.

Prefer:

```text
accepted config
 -> calculate
 -> render
```

over helper chains whose only purpose is to satisfy style/complexity metrics.

Do not add:

- generic event buses;
- schema frameworks;
- validation registries;
- dependency injection layers;
- temporary compatibility paths;
- duplicate source/accepted config objects;
- defensive fallbacks "just in case";
- wrapper methods that only rename another method without removing repetition.

A small shared method is justified when it removes real duplicate behaviour and makes ownership clearer.

## 4. Source-size and readability rules

Every plan must reduce ambiguity. Most plans should also reduce total source.

A plan is not considered a simplification if it only moves the same logic from one large file into another.

For every plan record:

- total product code LOC before/after;
- total physical product source lines before/after;
- LOC of directly affected files;
- removed duplicate methods;
- remaining exceptions and why they remain.

Readability acceptance is qualitative but explicit:

- main lifecycle methods should read as ordered operations, not repeated input policing;
- config errors should originate at config acceptance;
- renderers should render;
- History should process history;
- Graph should calculate graphs;
- Series should own series override/effective configuration and coordinate
  series runtime state;
- Controls should handle actual control state/interactions;
- Horseshoe should build/use accepted path/gauge configuration.

## 5. Preserved behaviour

Unless a separately reproduced defect is named by a plan, preserve:

- public YAML;
- template syntax;
- `ref()`, `calc()`, `same_as`, compounds and slots;
- JavaScript-template semantics;
- Graph numerical/statistical output;
- Path generators and measured geometry;
- Safari/WebKit interaction routing;
- Sparkline history/time semantics;
- current derived entities;
- control interaction semantics;
- current state formatting;
- theme/palette behaviour;
- resource ownership and stale-result protection.

## 6. Per-plan mandatory structure

Every implementation plan contains:

1. Goal
2. Prerequisites
3. Functional contract after the plan
4. Current-code validation
5. Current-code anchors
6. Scope
7. Out of scope
8. Implementation sequence
9. Checks that must remain
10. Permanent tests
11. Source-size/readability measurement
12. Definition of Done
13. Guarantees for the next plan

## 7. Current-code validation gate

Before editing a plan:

1. resolve current commit;
2. open every named function;
3. search the whole product source for the relevant patterns;
4. follow producer → stored result → all consumers;
5. distinguish static config, dynamic config and external runtime state;
6. verify tests that already cover the route;
7. measure current LOC;
8. stop and revise the plan if earlier work changed the functional premise.

Do not implement from old line numbers alone.

## 8. Test policy

Use `TESTING.md`.

At minimum, every completed plan runs:

```text
npm test
npm run lint
npm run rollup
```

Run affected browser suites during the plan and the complete configured browser matrix where the changed route touches DOM/SVG/interaction behaviour.

Plan 20 runs:

```text
npm run test:browser:all
```

in addition to Node/lint/build.

## 9. Sequence

### Plan 15 — Shared tool simplification

Remove known duplicate one-line/common tool methods without changing the config contract.

| start | end | usage |
| +---+ | +-+ | +---+ |
| 9%    | 0%  | 9%    |
| 100%  | 99% | 1%    |

### Plan 16 — Configuration ownership

Separate the stable source from active tool configuration and remove redundant ordinary-tool work without changing behavior.

| start | end | usage |
| +---+ | +-+ | +---+ |
| 86%   | 77% | 9%    |


### Plan 17 — Controls trusted config

Move control configuration policing to the accepted-config boundary and finish shared child lifecycle forwarding.

| start | end | usage |
| +---+ | +-+ | +---+ |
| 71%   | 64% | 7%    |

### Plan 18 — Sparkline trusted config

Keep raw-override and effective-series configuration with Series. Remove only
proven duplicate config checks/conversions from History, Graph and presentation
code without changing signatures or runtime behavior.


| start | end | usage |
| +---+ | +-+ | +---+ |
| 59%   | 53% | 6%    |

### Plan 19 — Horseshoe/Path trusted config

Complete path/gauge normalization before Horseshoe calculation/rendering.

### Plan 20 — Whole-chain simplification

Audit the entire product source for remaining downstream config policing, duplicate routes and readability issues. Perform final measurements.

## 10. Relationship to broader code-review findings

The whole-code review found additional correctness/security/maintenance items. They are listed in `REVIEW-FINDINGS.md`.

Do not silently mix unrelated fixes into Plans 15–20. The important exception is that Plan 20 must identify downstream checks correctly; if an external-runtime bug is encountered, record it rather than disguising it as config cleanup.

## 11. Overall Definition of Done

The sequence is complete only when:

- `sourceConfig` remains the stable re-evaluation source;
- `this.config` is the active tool configuration after existing processing, consistently across tool families;
- correctly specified static and JavaScript-produced configuration follow their established tool-level routes without new failure or recovery behavior;
- Series owns its raw overrides and effective-series checks once; History,
  Graph, renderer, control and Horseshoe consumers do not repeat already
  completed public-configuration checks;
- remaining checks are demonstrably runtime, async, algorithmic or consumer-semantic;
- duplicated shared tool lifecycle/geometry boilerplate identified by the review is removed;
- no temporary validation path remains;
- total product source is lower than the recalculated Plan-15 baseline;
- each plan was independently buildable/testable;
- full Node, lint, build and browser acceptance passes;
- documented/sample YAML remains compatible.
