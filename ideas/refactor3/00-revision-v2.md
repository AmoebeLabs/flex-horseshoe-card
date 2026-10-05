# Revision V2 — Execution-Order and Presentation Contract Sharpening

This revision keeps the same audited master (`dd89eb08f029400730ce59a4112be34bba44deeb`) and the same 72-module scope. It sharpens four execution-critical points discovered during review of the first package.

## 1. JavaScript evaluation context is a functional contract

The canonical route remains:

```text
sourceConfig
→ local newConfig
→ translateConfig(newConfig)
→ this.config
```

But `sourceConfig` is **not** defined as raw authored YAML before every tool default.

It is the stable **template-visible source** that preserves the current working evaluation context.

Where current behaviour makes a default or structural completion visible to JavaScript through `item`, that preparation stays before `sourceConfig` is captured.

Example: Arc currently supplies the default `radius: 45` before BaseTool evaluates JavaScript. Therefore a template such as:

```js
return item.radius * 2;
```

must continue to see `45` and produce `90` when the user omitted `radius`.

The migration must classify tool preprocessing into:

```text
PRE-SOURCE / TEMPLATE-VISIBLE
  established defaults/completion that current JS can see

POST-EVALUATION TRANSLATION
  normalization/validation/completion that can safely occur after JS
```

Moving code between those phases is a functional change unless characterization proves equivalence.

## 2. Theme-selected color stops require an atomic cross-family cutover

The final architecture still places theme-selected/active paint under `paint`, not canonical config.

However, current consumers span ordinary tools, Controls, Sparkline and Horseshoe. Therefore Plan 16B must **not partially relocate shared active color-stop ownership**.

The revised sequence is:

- 16B defines the final rule and prepares presentation ownership;
- 17B/18B/19 make their families compatible with the canonical paint model;
- at the end of Plan 19, perform one atomic shared color-stop owner cutover across all remaining consumers;
- Plan 20 verifies that no theme-selected active color-stop output remains stored as canonical config.

Until that cutover, the existing storage remains a documented temporary legacy exception. Do not introduce duplicate config+paint copies as an intermediate architecture.

## 3. `text-tool-geometry.js` remains through Plan 15B

Plan 15B migrates Name/Area/State geometry before TextTool itself is migrated.

Therefore `text-tool-geometry.js` must remain as the single temporary compatibility adapter during 15B. It may read canonical `tool.geometry` for migrated text-like tools and the current TextTool geometry representation for TextTool.

The helper may be removed or reduced only in **16B Pass B**, after TextTool exposes the same canonical geometry contract.

## 4. Parent-driven child styles get a concrete presentation route

The Controls plans may no longer say only “move child styles to paint”.

15B/16B establish a concrete minimal contract:

```text
config.styles
    stable canonical configured style source

paint.styles
    current parent/runtime-driven style replacement when present

getStyles()/effective style calculation
    consumes paint.styles when present, otherwise config.styles,
    then applies the existing animation/filter/theme cascade exactly as before
```

For migration safety, the parent control computes the same merged style map it currently assigns into `child.tool.config.styles`, preserving the existing merge order, and publishes it through a small presentation method such as:

```text
setPaintStyles(styles)
```

The exact method name may follow the proven 15B/16B reference, but its semantics are fixed: change runtime presentation without mutating canonical config.

Text measurement must use the **effective styles**, so a presentation change affecting font metrics invalidates the measurement signature and geometry exactly as the current config mutation does.

Characterization tests must lock down style precedence before the Controls migration. Do not invent a new priority order during refactoring.

## 5. Codex weeklimit uage per plan using GPT-6.1 Sol high combined with Luna Max agents

| PLan | Start | End | Usage |
| +--+ | +---+ | +-+ | +---+ |
| 15B  | 50%   | 43% | 7%    |
| Corr | 40%   | 38% | 2%    |
| 16B  | 38%   | 31% | 7%    |
| 16C  | 30%   | 23% | 7%    |
| 17B  | 22%   | 14% | 8%    |
| 18B  | 100%  | 85% | 15%   | (free reset from OpenAI. Would have been on okt 5 instead of okt 3)
| 19   | 83%   | 74% | 9%    |
| 20   | 70%   | 58% | 12%   |
| 21   | 57%   | 42% | 15%   | (Plan 21 verification did cost some usage. Sol xhigh was also used, so more tokens than high!!!!)
| 22   | 39%   | 27% | 12%   | (Reading all source files takes a lot of the available usage)



