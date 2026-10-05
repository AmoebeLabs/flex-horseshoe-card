# FHS Canonical Architecture Audit Package

**Repository:** `AmoebeLabs/flex-horseshoe-card`  
**Audited master:** `dd89eb08f029400730ce59a4112be34bba44deeb`

This V2 package turns the clarified copy-compatible tool architecture into a concrete audit and migration programme for the current master source, including the execution-order and presentation-contract corrections found during review of V1.

## V2 corrections

- `sourceConfig` is explicitly the stable **template-visible source**; existing JS-visible defaults remain before evaluation.
- shared active color stops are not partially moved; the owner cutover is atomic at the end of Plan 19.
- `text-tool-geometry.js` is retained through 15B and cleaned only after Text migrates in 16B.
- `paint.styles` / `setPaintStyles()` is the concrete retained-child presentation route, with existing style priority and text measurement behaviour preserved.

## Package contents

- `00-revision-v2.md` — the four execution-critical corrections applied to this revision.
- `01-canonical-architecture-contract.md` — strict vocabulary, ownership, lifecycle and readability contract.
- `02-current-master-audit.md` — current-master findings, feasibility analysis, family-by-family audit and support-module conclusions.
- `03-audit-matrix.csv` — all 72 product-owned `src/*.js` modules with action, risk, target plan and finding.
- `03-audit-matrix.json` — machine-readable version of the same matrix.
- `04-migration-sequence.md` — two-pass migration method and implementation order.
- `05-testing-and-verification.md` — regression strategy and architecture assertions.
- `06-existing-plan-supersession.md` — how the revised B-plans supersede earlier 15–18 architecture wording without discarding proven work.
- `15B-simple-tool-reference.md` — reference implementation and simple-tool rollout.
- `16B-canonical-config-lifecycle-and-text.md` — BaseTool lifecycle and TextTool migration.
- `17B-controls-canonical-architecture.md` — Controls migration.
- `18B-sparkline-canonical-series.md` — Sparkline migration.
- `19-horseshoe-path-canonical-architecture.md` — Horseshoe/Path migration.
- `20-whole-source-post-migration-audit.md` — strict final whole-source audit.
- `COMBINED-REPORT.md` — concatenated human-readable package.
- `SOURCES-AUDITED.txt` — complete 72-file product-owned audit scope.
- `manifest.json` — package metadata.

## Baseline recorded by current master documentation

| Metric | Current master / Plan 18 result |
| --- | ---: |
| Product-owned root `src/*.js` modules | 72 |
| Code lines | 23,665 |
| Comment-only lines | 5,550 |
| Blank lines | 3,156 |
| Physical lines | 32,371 |
| Node tests at Plan 18 acceptance | 507 |

The repository records that those Node tests, lint and Rollup passed and that affected browser regressions passed in Chromium, WebKit and Firefox.

## Central audit conclusion

The requested architecture is feasible on current master.

No audited tool or support module demonstrates a legitimate need for a second persistent **general tool configuration**. The difficult cases — Text parts, generated Control children, HA-derived Select options, Sparkline raw series restrictions and Horseshoe rank/string-state mapping — can all be represented with one canonical config plus explicit geometry/runtime/paint or a clearly named domain input.

The refactor should therefore preserve the existing proven algorithms and focus on ownership, naming, lifecycle alignment and the cleanup made possible after those responsibilities are colocated.
