# 11 — Config `ref()` and merge behaviour

## 1. Goal

Fix static `ref()` type corruption while preserving existing field-specific merge/append behaviour.

## 2. Prerequisites

Only Plan 00 + `TESTING.md`. This plan is independent of the core chain and may be implemented earlier as a separate change.

## 3. Current-code validation

Reproduce current array `ref()` behaviour in `CardConfig.compileStaticValues()` and inventory `Merge.mergeDeep()` call sites that depend on arrays before changing either boundary.

## 4. Scope

A referenced value preserves structural type and consumer independence:

```text
scalar -> scalar
object -> object
array -> array
nested combinations -> same structure
```

Two references to one structured constant must not cross-mutate under legitimate runtime mutation.

## 5. Out of scope

- global merge semantics redesign;
- universal “arrays replace” rule;
- cycle-aware clone framework for unsupported cyclic config;
- changing current validation/error messages or silently coercing unsupported referenced types.

## 6. Required design

Copy semantics for “insert this referenced constant” are distinct from inheritance merge semantics. Prefer fixing the `ref()` copy boundary without changing `Merge.mergeDeep()` globally.

Preserve current colour-stop/series append-or-replace behaviour as proven by existing YAML/tests. `main.setConfig()` JSON-cloning does not by itself guarantee that two later `ref()` insertions are independent; independence must be provided at the local reference/copy boundary.

## 7. Implementation sequence

1. Add array/nested/two-consumer failing reproductions.
2. Inventory merge call sites and field-specific array semantics.
3. Fix `ref()` copy boundary if sufficient.
4. Only change `Merge` if every affected caller is explicitly proven safe.
5. Correct misleading comments for touched behaviour.
6. Run config/template/SameAs/compound/Sparkline inheritance suite.

## 8. Permanent tests

All `TESTING.md` config/ref matrix plus representative colour-stop inheritance.

## 9. Definition of Done

- arrays remain arrays;
- nested types preserved;
- multiple refs independent;
- unrelated merge semantics unchanged;
- current YAML/config inheritance compatible;
- no architecture-specific config abstraction introduced.

## 10. Guarantees for following plans

Later plans may assume `ref()` preserves types and need not revisit merge semantics unless a separate defect is reproduced.

## 11. Source material

Direct successor of old Plan 12; only numbering/order changed.
