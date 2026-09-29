# Plan 16 — Simplification Refactor Guardrails

## Purpose

Plan 16 is a **simplification refactor**.

Its purpose is to make configuration handling easier to understand and easier to maintain by centralizing existing configuration processing.

It is **not** a functional redesign.

The overriding rule is:

> **Preserve existing behavior unless a behavior change is explicitly requested and reviewed separately.**

---

## What Plan 16 should do

Plan 16 may simplify the internal structure by:

- centralizing configuration defaults, normalization and validation;
- making the distinction between source configuration and active configuration clearer;
- removing duplicate configuration checks from downstream consumers;
- separating configuration changes from theme and layout/group changes;
- removing redundant conversions and defensive checks that only exist because configuration ownership is currently unclear;
- reducing code and simplifying ownership.

The goal is fewer responsibilities per class, fewer repeated checks, and a clearer path from configuration input to active configuration.

---

## What Plan 16 must NOT do

Do **not** add new behavior for hypothetical or currently unobserved problems.

In particular, Plan 16 must not introduce:

- new startup behavior;
- new rendering behavior;
- new JavaScript lifecycle behavior;
- new pending states;
- new configuration states or status flags;
- new fallback behavior;
- new retry behavior;
- new error-recovery behavior;
- new handling of `undefined`;
- new handling of `NaN`;
- new “keep last valid config” behavior;
- new suppression of geometry or rendering;
- new Home Assistant state rules;
- new validator frameworks;
- new abstraction layers;
- new generic clean-code helpers that only move logic around;
- new defensive checks for scenarios that are not part of the current task.

If current code has a theoretical edge case that is not causing an actual known problem, leave it alone during this refactor.

If it becomes a real problem later, handle it as a separate bugfix with its own scope and tests.

---

## JavaScript

JavaScript configuration must continue to behave as it behaves today.

Do not create a special JavaScript-specific lifecycle.

Do not invent concepts such as:

- pending JavaScript config;
- pending tools;
- accepted tools;
- runtime candidates;
- acceptance states;
- delayed render states.

JavaScript is simply part of the existing configuration flow.

The refactor may move where configuration is processed, but it must not change the observable behavior of JavaScript-backed tools.

---

## `undefined`, missing state and startup

Do not redesign these cases in Plan 16.

A Home Assistant state may currently be:

- numeric;
- text;
- `unknown`;
- `unavailable`;
- `undefined`;
- otherwise absent during startup or updates.

That is runtime data.

Plan 16 must not turn normal runtime state values into configuration errors.

Likewise, do not invent new startup behavior for cases where Home Assistant data is not yet available.

The startup route must continue to behave as it does before Plan 16.

If there is currently a theoretical path such as:

```text
JavaScript → undefined → numeric configuration field → NaN geometry
```

Plan 16 must **not** redesign that path unless it is required to preserve existing behavior during the refactor.

Do not add “keep the last valid configuration” as a new feature in Plan 16.

The correct choice for such a case is:

> **Keep the fault path separate; the refactor preserves behavior.**

---

## Configuration ownership

The simplification target is straightforward:

```text
source configuration
    ↓
existing processing:
defaults / normalization / validation
    ↓
active configuration
    ↓
existing geometry / rendering / runtime behavior
```

The important improvement is that configuration rules should have one clear owner.

Once configuration has passed that point, downstream code should not repeatedly:

- apply the same defaults;
- convert the same value again;
- validate the same configuration field again;
- guard against configuration states that the configuration owner already handles.

This is the simplification.

Do not replace repeated checks with a more complicated framework.

---

## Home Assistant state vs configuration

Keep these two concerns separate.

### Configuration

Configuration has defined fields and existing rules.

Those rules may be centralized.

### Home Assistant state

Home Assistant state is runtime data.

It must continue through the existing state/update path.

Do not validate arbitrary HA state as if it were configuration.

A textual state, `unknown`, `unavailable`, `undefined`, or another runtime value is not automatically a configuration problem.

---

## Updates

A configuration refactor must not interfere with normal Home Assistant state processing.

Do not introduce early returns or new control flow that prevents the current state from reaching the tools that already consume it.

Configuration processing and state processing should remain functionally equivalent to the current implementation.

---

## Tests

Tests for Plan 16 should primarily prove that the simplification did not change behavior.

Focus on:

- existing valid static configuration still behaves the same;
- existing JavaScript configuration still behaves the same;
- existing Home Assistant state handling still behaves the same;
- existing startup behavior still behaves the same;
- existing geometry remains unchanged for the same configuration;
- existing theme behavior remains unchanged;
- existing group/layout behavior remains unchanged;
- public YAML behavior remains unchanged.

Do not create a large new test matrix for hypothetical error behavior that Plan 16 is not supposed to change.

If a new test requires defining a brand-new behavior, that is a warning sign that the refactor scope is expanding.

---

## Code-size and complexity rule

Plan 16 exists to simplify.

Therefore:

> **Do not add large amounts of infrastructure to remove small amounts of duplication.**

A good implementation should normally reduce or consolidate code.

Avoid:

- generic validator systems;
- new state machines;
- layers of wrappers;
- chains of helper functions;
- duplicated “clean” abstractions;
- defensive programming added without a demonstrated need.

If the implementation starts adding hundreds or thousands of lines, stop and reconsider the design.

The result should be easier to read than the code it replaces.

---

## Review rule

When Codex encounters an edge case during implementation, ask:

> **Is this required to preserve current behavior, or am I inventing a new behavior?**

If it is a new behavior:

> **Do not implement it in Plan 16.**

Record it separately if useful, but do not expand the refactor.

---

## Final definition

Plan 16 is successful when:

- configuration handling is simpler;
- configuration rules have a clearer single owner;
- repeated downstream configuration checks are reduced;
- theme/layout/config responsibilities are clearer;
- public behavior remains the same;
- startup behavior remains the same;
- JavaScript behavior remains the same;
- Home Assistant state behavior remains the same;
- geometry and rendering remain the same;
- the codebase is smaller or materially simpler;
- no new configuration framework or lifecycle machinery has been introduced.

**This is a simplification refactor, not a redesign and not a bugfix project.**
