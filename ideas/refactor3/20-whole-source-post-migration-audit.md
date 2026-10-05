# Plan 20 — Whole-Source Post-Migration Audit and Simplification

## 1. Goal

Audit the migrated source as if it had been designed with the canonical architecture from the beginning.

Plan 20 is not a last round of feature work. It is the strict architecture and simplification acceptance pass.

## 2. Scope

All 72 product-owned root `src/*.js` modules.

Tools receive strict canonical lifecycle/owner checks.

Support modules receive semantic ownership and vocabulary checks without being forced into BaseTool structure.

## 3. Tool audit route

For every BaseTool descendant, be able to identify this route directly:

```text
compiled/routed item
→ preserve required template-visible source preparation
→ sourceConfig
→ evaluate with the established item/context ordering
→ local newConfig
→ translate
→ this.config
→ geometry / runtime / paint
→ render
```

A tool may omit categories it does not need.

A complex tool may contain additional domain helpers.

It may not introduce a private competing lifecycle for the same concepts.

## 4. Strict tool checklist

For every tool answer yes/no and record any deviation:

1. Does `sourceConfig` mean the stable template-visible source, with existing JavaScript-visible defaults/context preserved?
2. Is `newConfig` local only?
3. Is `this.config` the sole current canonical tool configuration?
4. Do initial and dynamic updates preserve the same source-preparation → JS-evaluation → translation order?
5. Can `setState()` run without publishing a config?
6. Is HA state kept out of canonical config?
7. Is derived geometry outside canonical config?
8. Is theme/state-derived paint outside canonical config, including active color-stop output after the Plan-19 cutover?
9. Does configured `state_map` remain configuration while current selection is runtime/local?
10. Is parent/common + item/series inheritance resolved once?
11. Does a parent avoid mutating retained child config as runtime state?
12. Are lifecycle method names used with the same meaning as other tools?
13. Do lifecycle parameters mean the same thing across tools?
14. Is the main flow readable in execution order?
15. Is `text-tool-geometry.js` free of the temporary 15B compatibility branch (or removed if redundant)?
16. Does parent/runtime child presentation use `paint.styles` rather than config mutation while preserving characterized merge priority?
17. Do Text-like tools base measurement invalidation on effective styles so paint changes affecting font metrics still rebuild geometry?
18. Are all shared active color-stop consumers on the single paint owner with no legacy duplicate?
19. Do signatures describe actual owner changes rather than act as hidden config copies?
20. Is the same derived value stored only once unless caching has a concrete reason?
21. Would the architecture look reasonable if the tool were written today?
22. Were proven functional algorithms left intact?

## 5. Support-module checklist

For every support module:

- Does `config` really mean configuration owned/consumed as configuration?
- Does `runtime` really mean current mutable state?
- Does `geometry` really mean derived geometry?
- Is `paint`/presentation clearly distinguished from config?
- Are unique domain names such as `history`, `graph`, `cache`, `animation` actually unique concepts?
- Does a method called `setConfig()` actually set configuration?
- Does `updateConfig()` actually update configuration?
- Does `active`, `resolved` or `effective` duplicate a canonical concept without adding meaning?
- Is persistent state duplicated?
- Has an adapter become unnecessary because all tools now expose the same owner?
- Are lifecycle names (`connected`, `disconnected`) semantically consistent?

## 6. Mechanical search audit

Search the whole product source for at least:

```text
this.config =
this.config.svg
runtimeConfig
activeConfig
activeItemConfig
effectiveConfig
resolvedConfig
normalizedConfig
source*Config
graphConfig
pathConfig
numberGeometry
.config.styles =
this.config.option_map =
mapped_state
prepareSourceConfig
paint.styles
setPaintStyles
text-tool-geometry
```

Do not blindly delete every hit.

Classify each remaining hit:

```text
legitimate local variable
legitimate unique domain concept
canonical shared concept with wrong name
old architecture that must be removed
```

## 7. Canonical vocabulary audit

Search for local synonyms of:

```text
config
geometry
runtime
paint
history
graphInput
cache
*Signature
*Changed
```

A different name is acceptable only when it communicates a genuinely different responsibility.

Examples of expected post-migration checks:

- `resolvedEntityConfigs` should not survive alongside `runtimeEntityConfigs` if they mean the same thing.
- a graph calculation contract should not still be called `config` merely from history.
- `numberGeometry` should not survive if every other tool uses `geometry`.
- `setConfig()` should not remain on a class where the method only clears async requests.

## 8. Pass A — strict compliance

Fix remaining ownership/naming deviations with the smallest changes possible.

This is the point where support-module terminology is normalised across the codebase.

Do not turn naming cleanup into another large abstraction layer.

## 9. Pass B — final simplification audit

Now inspect the architecture after all responsibilities are in their final locations.

For each module ask:

- is this helper still necessary?
- is this intermediate object still necessary?
- is this persistent state still necessary?
- is this signature still necessary?
- is this guard still protecting a possible state?
- is this fallback still reachable?
- is this config merge still repeated?
- are two lifecycle functions now one obvious linear operation?
- is a compatibility adapter now dead?
- is the same information stored twice?
- would this layer be introduced in a fresh implementation today?

Remove architectural redundancy only.

## 10. Guard classification

Do not equate “simplification” with deleting checks.

Every surviving/removal candidate check should be classifiable as:

```text
configuration translation/validation
external HA/network/DOM runtime data
lifecycle readiness
algorithmic edge case possible with valid config
consumer-owned semantic conversion
```

A config guard that has become impossible downstream can disappear.

A guard against real external runtime data remains with its consumer.

## 11. Source-size report

Record final:

- product-owned root modules;
- code lines;
- comment-only lines;
- blank lines;
- physical lines;
- per-family deltas against `dd89eb08...` and against the immediately preceding plan.

Source size is a signal, not the architecture goal.

A small increase is acceptable when it establishes a clear owner. The final result should nevertheless remove duplicate routes and therefore trend toward less repeated code.

## 12. Full regression acceptance

Run:

```bash
npm run build
npm run test:browser:all
```

plus all architecture source assertions introduced in Plans 15B–19.

Any visual difference must be treated as a regression unless explicitly separated into another feature/fix.

## 13. Documentation cleanup

Update or replace old refactor documentation that still describes:

```text
gatekeeper
candidate config
accepted config
active config as a separate conceptual state
config.svg as accepted derived config
Series as owner of effective series config
Select HA options as canonical config
```

The final docs should use the canonical vocabulary only.

Historical implementation-result documents may remain as history, but the active master-plan README must clearly mark them as superseded where their architecture no longer applies.

## 14. Final Definition of Done

The project is complete when a maintainer can open an unfamiliar tool and, without first learning its private history, know where to search for:

```text
configuration
geometry
runtime
paint
lifecycle
rendering
```

The same names mean the same things throughout the product source.

The code behaves as before, but the architecture no longer requires memorising each tool and module individually.
