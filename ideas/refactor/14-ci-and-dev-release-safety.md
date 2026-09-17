# 14 — CI and development-release safety

## 1. Goal

Make the permanent test suite and shared development prerelease workflow deterministic enough to protect the completed refactor without turning CI into a separate architecture project.

## 2. Prerequisites

- `TESTING.md` permanent matrix exists in code from prior plans;
- Plan 13 runtime cleanup complete for the release series.

Timezone determinism may be fixed earlier if it blocks a preceding plan, but release-workflow changes stay here.

## 3. Current-code validation

Read the current workflows end-to-end. Verify test commands, timezone assumptions, browser jobs, dev-latest trigger/branch policy, shared writer behaviour, build/test gates and release source identity before editing.

## 4. Scope

- explicit timezone for UTC-dependent and local-calendar tests;
- full Node suite remains normal gate;
- required WebKit and small Firefox coverage from `TESTING.md`;
- serialize/supersede shared dev-latest writers if current workflow still permits overlapping writes;
- publish only artifacts that passed required build/test gates;
- retain enough SHA/version identity to diagnose published source.

## 5. Out of scope

- changing branch/release product policy merely to solve concurrency;
- file-change-only partial Node CI;
- huge browser screenshot matrix.

## 6. Implementation sequence

1. Run/read current CI and prerelease workflow.
2. Make timezone semantics explicit.
3. ensure Chromium/WebKit/Firefox jobs match permanent strategy;
4. confirm whether multiple branches intentionally write one shared dev-latest;
5. simulate/reason about overlap and add the smallest correct concurrency rule;
6. ensure tests/build precede publish;
7. preserve current branch policy and version naming;
8. expose source SHA if not already clear.

## 7. Permanent tests

- CI executes full Node suite;
- timezone-sensitive tests deterministic;
- Safari-sensitive set executes in WebKit;
- workflow validation for shared writer/concurrency where practical;
- release job cannot run from failed build/test prerequisites.

## 8. Definition of Done

- test outcomes do not depend on runner timezone;
- full Node suite is a normal gate;
- browser coverage matches permanent strategy;
- uncontrolled overlapping writers cannot corrupt shared dev-latest;
- branch/release semantics were not silently changed;
- published artifact is traceable to source commit.

## 9. Guarantees for following plans

There is no dependent implementation plan. The completed repository may rely on deterministic CI, browser coverage and serialized shared prerelease publishing as ongoing release safeguards.

## 10. Source material

Successor of old Plan 16; old Plan 14 has become shared `TESTING.md` rather than an implementation phase.
