# Existing Refactor Documentation — Supersession Map

## 1. Purpose

Current master contains useful historical Plans 15–18 and the `ideas/refactor3` master documentation.

Those documents describe the reasoning and implementation result that produced the current working baseline. They should not be deleted as history.

However, several architectural statements are now explicitly superseded by the canonical architecture clarified after Plan 18.

This file identifies those conflicts so future implementation/review does not combine incompatible models.

---

## 2. `ideas/refactor2/README.md`

### Historical statements to supersede

The current README describes:

- a “configuration gatekeeper”;
- local “candidate” config;
- `this.config` as “accepted active configuration”;
- calculated fields such as `config.svg` as acceptable attached config outputs;
- downstream “accepted config”.

### Replacement vocabulary

Use:

```text
sourceConfig
local newConfig
translateConfig
this.config
geometry
runtime
paint
```

No candidate/accepted/gatekeeper architecture is needed.

Derived geometry should not remain in canonical config merely because that was the previous established contract.

---

## 3. `ideas/refactor2/00-master-simplification-plan.md`

### Historical statements to supersede

The current master plan explicitly permits calculated fields such as `config.svg` and frames the primary goal as trusted/accepted config followed by downstream guard removal.

### Replacement priority

The new primary goal is:

> one canonical tool configuration lifecycle plus canonical ownership/naming for geometry, runtime and paint.

Downstream guard simplification is a consequence of clearer ownership, not the architecture itself.

Plan 20 should therefore be an ownership/naming/lifecycle audit first and a guard/duplication audit second.

---

## 4. Existing Plan 15

`ideas/2026.09.28-15-shared-tool-simplification.md` is implemented history and remains useful.

It removed duplicated common methods and should **not** be reverted.

### 15B relationship

15B starts from that result and adds the stronger canonical data/lifecycle contract.

The existing Plan 15 result remains part of the baseline.

---

## 5. Existing Plan 16

`ideas/2026.09.28-16-configuration-gatekeeper.md` introduced valuable groundwork:

- deep `sourceConfig` snapshot;
- local `newConfig` during dynamic evaluation;
- separate configuration/group/theme change signals.

These changes should be retained where compatible.

### Statements to supersede

- “gatekeeper” terminology;
- implicit/unclassified subclass preprocessing; preprocessing that is already template-visible is now explicitly preserved as source preparation;
- derived fields such as `svg` remaining on config as a normal end state.

### 16B relationship

16B completes the idea rather than reverting it:

```text
consistent template-visible source preparation
→ sourceConfig
→ existing JS context/order
→ one post-evaluation translator
→ this.config
```

and moves derived data to canonical owners.

---

## 6. Existing Plan 17

`ideas/2026.09.28-17-controls-trusted-config.md` is useful implementation history and its proven behaviour constraints remain valuable.

### Explicit conflict

The existing plan states that HA-derived Select options continue to be stored in:

```text
this.config.option_map
```

and intentionally keeps existing control completion ordering rather than forcing uniform architecture.

That is now superseded.

### 17B replacement

```text
configured option_map → config
HA-derived options    → runtime
selected visuals      → paint/runtime
```

Existing control interaction, errors and visual behaviour remain the functional baseline.

---

## 7. Existing Plan 18

`ideas/2026.09.30-18-sparkline-trusted-config.md` is implemented history and records the current source/test baseline.

Its local GraphTool deduplication remains useful and should not be reverted.

### Explicit conflict

The existing Plan 18 deliberately leaves `SparklineSeries.updateConfig()` as the owner of effective series configuration and states that moving series completion to GraphTool would split ownership.

The clarified canonical architecture changes that conclusion.

### 18B replacement

The configuration owner is the tool:

```text
SparklineGraphTool.config.series[]
```

Series is a runtime/domain coordinator.

Raw series-only restrictions remain local inputs to the translation before inheritance, so moving canonical config ownership does **not** require losing those checks.

---

## 8. Existing Plan 19/20 references

Current refactor2 docs refer to future:

```text
19-horseshoe-path-trusted-config.md
20-whole-chain-simplification.md
```

Those future descriptions should be replaced by the Plan 19 and Plan 20 documents in this package.

The new Plan 19 is ownership reconstruction, not merely downstream trusted-config cleanup.

The new Plan 20 is the strict whole-source canonical architecture audit followed by simplification.

---

## 9. `ideas/refactor2/TESTING.md`

Much of the existing testing philosophy remains useful:

- preserve behaviour;
- test real boundaries;
- retain runtime/async/algorithmic checks;
- use browser tests for visible geometry;
- run full build/browser acceptance.

### Terminology to update

Replace acceptance/gatekeeper-specific architecture assertions with canonical ownership assertions, including:

- one config owner;
- no config swapping;
- geometry outside config;
- runtime HA data outside config;
- control child config immutability during state changes;
- canonical series ownership;
- Horseshoe state mapping outside config.

The `05-testing-and-verification.md` in this package is the new active policy for 15B–20.

---

## 10. Documentation rule during implementation

Historical plan files may keep their implemented-result text for traceability.

The active `ideas/refactor3/README.md` and master plan should be updated to point at the new canonical package/plans and clearly mark the earlier architecture statements as superseded.

Do not edit historical results to pretend the previous plans said something they did not say.

The history explains how current master was reached; the new plans define where it goes next.
