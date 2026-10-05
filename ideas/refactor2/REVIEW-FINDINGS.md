# Broader code-review findings at `44eac7b6cb9d93e6b76a10f801576f052788d44e`

This file records findings from the whole-code review that are relevant to future work but are intentionally not disguised as configuration simplification.

## 1. Findings addressed directly by Plans 15–20

### Repeated tool boilerplate

Confirmed duplicate/simple methods include coordinate forwarding, measured-text getters, Icon group transform forwarding, section factories and repeated control child traversal.

Addressed by Plans 15 and 17.

### Configuration policing below its owner

Confirmed in:

- BaseTool z-position coercion;
- Line/Polygon;
- Controls;
- Sparkline GraphTool constructor/runtime;
- Sparkline Series;
- Sparkline History;
- Sparkline Graph;
- Horseshoe Gauge;
- GaugeScale and presentation paths.

Addressed by Plans 16–20.

### SparklineGraphTool readability

The file remains about 6,044 physical lines and its `updateRuntimeConfig()` is about 300 lines at the baseline.

Plans 18 and 20 target configuration noise and remaining responsibility duplication without rewriting Graph math.

## 2. Correctness finding — missing Home Assistant entity

### Current behaviour

`src/main.js:updateSourceEntities()` skips a missing entity without clearing the previous entry.

`BaseTool.setEntities()` only updates when both entity and config exist.

Sparkline and derived entity paths later assume a bound entity.

Result: an entity that existed and then disappears can remain stale in ordinary tools or cause a dereference failure in Sparkline/derived paths.

### Required direction

This is **external runtime input**, not configuration.

Prefer one central current-entity publication rule over guards scattered through every tool.

Tests should cover:

- missing on first load;
- present -> missing;
- missing -> returned;
- JS entity selection;
- Sparkline source missing;
- derived Sparkline entity source missing;
- missing `sun.sun` when day/night is enabled.

Plan 20 now requires this to be fixed before final acceptance. It may use a separate implementation subissue/PR, but unresolved tracking alone cannot satisfy the final Definition of Done.

## 3. Trust/security finding — external SVG scripts

`src/icon-svg-source.js:33-70` currently calls SVGInjector with:

```text
evalScripts: "once"
```

This means an SVG asset can execute scripts.

FHS already intentionally supports trusted JavaScript templates, so this is not automatically a remote exploit. The concern is a different trust boundary: an icon asset URL silently becomes executable code.

Recommended separate change:

- decide whether script-bearing SVG is an intentional feature;
- if not, set script evaluation to never;
- validate supported URL schemes;
- add external-SVG tests.

Do not mix this with tool/config cleanup unless explicitly approved.

## 4. Template variable substitution

`src/card-templates.js:264-297` performs variable replacement by:

- `JSON.stringify()` template body;
- building regexes from variable names;
- string replacement;
- `JSON.parse()`.

Risks include regex metacharacters in keys and textual substitution across serialized JSON rather than structural value replacement.

Recommended separate refactor:

- recursively replace placeholder values/strings structurally;
- preserve scalar/object/array types;
- keep current template merge semantics;
- add compatibility tests.

## 5. Persisted/global FHS input state vs changed config

`CardInputEntities` validates public input config during `setConfig`, but global static Maps can retain state from a previous card/config.

For Select, stored localStorage state is checked against options only when the global Map is first populated. An already-populated global entry can bypass a later card's changed option set.

Number state likewise needs an explicit policy when current `min/max/step` differs from the config that created the retained value.

Recommended separate work:

- one read -> validate against current config -> migrate/reset/clamp policy;
- apply to both localStorage and already-populated global Maps;
- handle malformed storage JSON deliberately.

## 6. SVG URL classification

`src/icon-source.js` currently classifies SVG using:

```text
url.endsWith(".svg")
```

This misses common valid forms such as:

- `.SVG`;
- `.svg?version=...`;
- `.svg#fragment`.

Recommended small separate fix: classify using parsed pathname or a case-insensitive extension check before query/hash.

## 7. SVG internal IRI ids

`icon-svg-source.js` sets:

```text
renumerateIRIElements: false
```

Multiple injected SVGs with repeated ids may collide for gradients/masks/clip paths depending on DOM/shadow-root behaviour.

Do not change blindly. First add a browser test with two external SVGs containing identical internal ids and verify actual behaviour. Enable renumeration only if the reproduction demonstrates the issue and injector semantics match the desired fix.

## 8. `calc()` evaluator

`CardConfig.compileStaticValues()` allows a restricted character set and then evaluates with `Function(...)`.

Because FHS explicitly supports full JavaScript templates elsewhere, this is not treated as a new security boundary in this review.

Architecturally, however, `calc()` is broader than a true math-expression parser.

No change is required by Plans 15–20.

## 9. PathGeometry measurement cache

The per-owner measurement cache is not globally bounded.

Static config is fine. Highly dynamic JS path definitions can create many signatures over a long card lifetime.

Recommended only if reproduced/observable:

- small per-owner LRU;
- preserve stable measurement reuse;
- ensure animation sampling remains temporary as it is now.

## 10. Repository/tooling hygiene

Observed at the baseline/review:

- backup/copy/orig files remain in the tree and add search/review noise;
- several package version specs are blank while the lockfile pins versions;
- `home-assistant-js-websocket` appears in both dependencies and devDependencies;
- Biome has `recommended: false` and only a small rule set;
- CodeQL workflow still uses `actions/checkout@v3` and `github/codeql-action/*@v2` while other current workflows use newer action generations.

These are maintenance tasks, not reasons to mix tooling churn into Plans 15–20.

## 11. Priority suggestion

Separate from Plans 15–20:

1. missing-entity correctness;
2. external SVG script trust decision;
3. structural CardTemplates variable replacement;
4. persisted/global input revalidation;
5. SVG URL/IRI small fixes;
6. cache/tooling/repository hygiene.

Each should have its own reproduction/acceptance criteria.
