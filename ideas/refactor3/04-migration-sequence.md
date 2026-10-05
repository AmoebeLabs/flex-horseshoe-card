# Migration Sequence and Audit Method

## 1. Two passes per family

Every family is migrated in two explicit passes inside the same plan.

### Pass A — Canonicalize structure

- preserve calculations;
- move data to the right owner;
- rename shared concepts;
- align lifecycle methods;
- remove parallel config publication only where necessary to establish the canonical route;
- perform the small glue rewrites required by changed ownership;
- verify behaviour immediately.

Pass A deliberately prefers:

```text
MOVE
RENAME
small ADAPT
```

over functional rewriting.

### Pass B — Simplify the result

After related responsibilities are adjacent under their correct owners, audit again:

- is this intermediate variable still needed?
- is this persistent copy still needed?
- is this signature still needed?
- is this helper only hiding what is now one linear step?
- is a config merge still repeated?
- is a guard still protecting an impossible old transition?
- is the same derived value stored twice?
- is a compatibility adapter now dead?
- are local synonyms still present?

Then remove the architectural redundancy and verify again.

This second pass is mandatory. Moving the old complexity into prettier containers is not the final result.

---

## 1A. Characterize ordering before moving code

Before Pass A moves constructor/factory work, identify whether current JavaScript sees that value through `item`.

```text
current pre-evaluation default/completion visible to JS
→ preserve before sourceConfig

not visible / safe post-evaluation normalization
→ candidate for translateConfig
```

This characterization is mandatory for Controls, Sparkline and Horseshoe and should be tested on the simple Arc reference first.

Likewise, before moving parent-driven child styles, characterize current merge priority and measurement effects.

## 2. Implementation order

```text
current-master audit
    ↓
15B — reference architecture + simple tools
    ↓
16B — complete canonical config lifecycle + Text
    ↓
17B — Controls
    ↓
18B — Sparkline
    ↓
19  — Horseshoe / Path integration
    ↓
20  — whole-source post-migration audit
```

The order is intentionally increasing in complexity.

The simple tools are not first because they matter more. They are first because a low-risk tool is the correct place to prove the architecture.

By the time Sparkline and Horseshoe are reached, `config / geometry / runtime / paint` and the lifecycle route should no longer be design proposals. They should be existing proven code patterns.

One cross-family exception is intentional: the shared active color-stop owner is cut over atomically at the end of Plan 19 after every family is prepared. Earlier plans must not introduce a partial duplicate owner.

---

## 3. Per-tool implementation report

Every implementation issue/PR should include the same short architecture table:

```text
Current owners
  config:
  geometry:
  runtime:
  paint:
  domain-specific:

Current lifecycle
  constructor:
  translation:
  updateRuntimeConfig:
  setState:
  connected/disconnected:
  render:

Deviations
  ...

Actions
  KEEP / RENAME / MOVE / MERGE / ADAPT / REMOVE / REWORK

Preserve
  exact calculations/functions that should remain semantically unchanged

Target owners
  ...

Pass-B cleanup candidates
  ...

Tests
  ...
```

This keeps the actual migration auditable against the plan instead of relying on prose interpretation.

---

## 4. Migration safety rule

Prefer this sequence:

```text
same calculation
same input semantics
same output semantics
new canonical storage/owner
```

before changing surrounding flow.

For example:

```text
this.config.svg = calculateSvgDimensions(this.config)
```

becomes conceptually:

```text
this.geometry.svg = calculateSvgDimensions(this.config)
```

before asking whether adjacent helpers are still necessary.

A small rewrite is acceptable when the previous interface depended on the old owner. Rewriting the calculation itself because it can be made “nicer” is out of scope.

---

## 5. Stop rule

If a family demonstrates that the canonical architecture cannot represent a legitimate existing behaviour without:

- a second persistent general config;
- a major functional rewrite;
- or a materially less readable lifecycle;

then stop that family and document the concrete conflict.

Do not hide the problem behind a newly named `active*`, `resolved*`, `effective*` or `runtimeConfig` layer.

Revise the architecture contract if the evidence requires it.

The current-master audit found no such blocker.

---

## 6. Cross-family review after each plan

At the end of each plan compare the newly migrated family with the previous reference family.

The question is not whether the code is identical. The question is whether the same architectural chapters are recognisable:

```text
translation
config
geometry
runtime
paint
state update
connection lifecycle
render
```

If a complex tool needs extra helpers, that is normal. If it needs a private alternative architecture, that requires explicit justification.
