# Review of Plan 16 — Configuration Gatekeeper

## Overall assessment

Plan 16 is architecturally sound and is close to being implementation-ready.

The core model is correct:

```text
sourceConfig
    ↓
candidate
    ↓
defaults / type conversion / normalization / validation
    ↓
this.config
    ↓
geometry / rendering / runtime
```

The key rule should remain:

> `this.config` is accepted configuration. Consumers do not validate, repair, default or coerce configuration again.

Before implementation, I would still tighten the following points.

---

## 1. Remove the special “pending JavaScript tool” model

JavaScript should not create a separate tool lifecycle or tool state.

It is only another producer of a configuration candidate:

```text
sourceConfig
→ evaluate JavaScript with the current context
→ candidate
→ gatekeeper
→ this.config
```

If JavaScript can already produce a valid value without Home Assistant state, that value may be accepted normally.

If the produced candidate is invalid, it is simply not accepted.

Do **not** introduce concepts such as:

- pending tool;
- accepted tool;
- special render suppression because a tool contains JavaScript;
- special lifecycle forwarding for JavaScript-backed tools.

Remove the wording in Plan 16 that says JavaScript-backed ordinary tools remain instantiated but unrendered until a first successful HA-context evaluation.

Also remove the matching special test.

The simpler invariant is enough:

> A new JavaScript result replaces `this.config` only after the complete candidate has been accepted.

---

## 2. Home Assistant state is runtime data, not configuration

The configuration gatekeeper validates configuration fields.

It must **not** decide whether a Home Assistant state is valid.

Home Assistant state may legitimately be:

```text
12.7
on
off
open
closed
home
hello
unknown
unavailable
```

All of these may be valid runtime values.

For example:

```text
entity.state = "unavailable"
→ StateTool
→ display "unavailable"
```

This must continue to work.

A state only becomes subject to a configuration field's contract when JavaScript uses that state to produce that configuration field.

Example:

```yaml
arc_degrees: '[[[ return state; ]]]'
```

If:

```text
state = "270"
```

the accepted configuration may normalize that to numeric `270`.

If:

```text
state = "unavailable"
```

the Home Assistant state itself is still valid runtime data, but `"unavailable"` is not a valid value for the numeric `arc_degrees` configuration field.

Recommended explicit rule for Plan 16:

> The configuration gatekeeper validates configuration values, not Home Assistant state values. Entity states remain external runtime data and may be numeric, textual, `unknown`, `unavailable`, or any other value supported by Home Assistant.

And:

> A Home Assistant state is subject to a configuration field's contract only when a JavaScript template uses that state to produce that configuration field. The source state itself remains runtime data.

This distinction is important to prevent defensive `Number(...)` / `Number.isFinite(...)` checks from spreading through runtime consumers again.

---

## 3. `sourceConfig` and `this.config` must be deeply independent

The plan already says they must not alias. Make this stronger.

It is not enough that:

```js
sourceConfig !== this.config
```

Nested mutable structures must not alias either.

For example:

```text
sourceConfig.show !== this.config.show
sourceConfig.color_stops !== this.config.color_stops
sourceConfig.state_map !== this.config.state_map
```

Recommended rule:

> No mutable object or array in accepted `this.config` may alias the corresponding source value in `sourceConfig`.

Add a regression test that mutates a nested accepted value and verifies that `sourceConfig` remains structurally unchanged.

Derived fields such as `svg` may remain attached to `this.config`, but they must never flow back into `sourceConfig`.

---

## 4. Use “candidate acceptance failure”, not “JavaScript evaluation failure”

The current template engine catches JavaScript exceptions and returns `undefined`.

That means the gatekeeper cannot reliably distinguish:

- JavaScript execution failure;
- a template that intentionally returned `undefined`.

Plan 16 does not need to redesign the template engine.

Keep the boundary simple:

```text
template evaluator
→ result

gatekeeper
→ candidate accepted or rejected
```

Use wording such as:

> failed candidate acceptance

instead of:

> failed evaluation

If a candidate is rejected after there was already a valid `this.config`, retain the previous accepted config.

No additional template-error protocol is required for Plan 16.

---

## 5. Determine `configChanged` after normalization and validation

`configChanged` should describe a change in **accepted configuration**.

The sequence should be:

```text
evaluate source
    ↓
candidate
    ↓
defaults / normalize / type conversion / validate
    ↓
accepted candidate
    ↓
compare with previous accepted configuration
    ↓
configChanged
```

Do not compare only the raw JavaScript result.

For example:

```text
candidate A: zpos omitted
candidate B: zpos = 0
```

may normalize to exactly the same accepted config.

That should not count as a real configuration change.

Also:

- a rejected candidate must not update the accepted-config signature;
- derived fields such as `svg` must not participate in accepted-config comparison;
- active theme materialization must not participate in accepted-config comparison.

---

## 6. Atomic publication includes config-derived runtime fields

`this.config` is not the only runtime field currently derived from config.

For example `BaseTool` also keeps:

```text
this.entity_index
this.zpos
```

If JavaScript changes `entity_index`, it must not be possible to end up with:

```text
this.config.entity_index = 3
this.entity_index = old value 0
```

Define two groups clearly.

### Stable construction identity

These remain fixed for the tool instance:

```text
id
index
renderIndex
tool/section identity
```

### Accepted-config-derived runtime fields

These must be refreshed atomically with the accepted config:

```text
entity_index
zpos
other cached shortcuts derived directly from accepted config
```

Conceptually:

```text
publish this.config
→ update accepted-config-derived fields
→ calculate geometry / derived presentation data
```

No half-old / half-new state.

---

## 7. Treat active theme color stops as derived materialization

The separation between config change, layout/group change and theme change is correct.

Make the `color_stops` distinction explicit:

```text
color_stops
```

is accepted configuration.

The active light/dark result:

```text
colorstops
```

is theme-derived runtime materialization.

Therefore:

```text
accepted color_stops unchanged
light → dark
→ active colorstops changes
→ update affected paint/geometry
→ NO schema acceptance
```

This prevents theme changes from looking like configuration changes.

Theme-dependent stop positions may still affect geometry or labels; they simply do so as derived theme output, not as new public configuration.

---

## 8. Add an invalidation matrix

Before changing `configChanged`, inventory every current consumer and classify what actually invalidates it.

At minimum distinguish:

- accepted configuration change;
- group/layout change;
- theme/palette change.

Do not replace one broad flag with:

```js
if (configChanged || layoutChanged || themeChanged) {
  // do everything
}
```

That would recreate the current problem under three names.

A small matrix in the plan is enough, for example:

| Work | Config | Group/layout | Theme |
|---|:---:|:---:|:---:|
| schema acceptance | yes | no | no |
| SVG coordinates | yes | yes | no |
| active color stops | yes | no | yes |
| theme-dependent geometry/labels | if config changed | if layout affects them | yes where applicable |
| render paint | yes where relevant | no | yes |

The exact matrix should be based on current code.

---

## 9. Update the current-code locators to post-Plan-15 master

Plan 16 correctly uses Plan-15 master as its prerequisite:

```text
56cba001e95c3f1e550cf019320cdcabba9686bb
```

Some locators are still from before Plan 15.

On current master the relevant methods are approximately:

| Symbol | Current line |
|---|---:|
| `BaseTool.updateRuntimeConfig()` | 68 |
| `NameTool.updateRuntimeConfig()` | 46 |
| `AreaTool.updateRuntimeConfig()` | 46 |
| `StateTool.updateRuntimeConfig()` | 304 |
| `TextTool.updateRuntimeConfig()` | 173 |
| `IconTool.updateRuntimeConfig()` | 69 |
| `RectangleTool.updateRuntimeConfig()` | 61 |
| `PolygonTool.updateRuntimeConfig()` | 33 |
| `LineTool.updateRuntimeConfig()` | 89 |
| `CircleTool.updateRuntimeConfig()` | 31 |
| `ArcTool.updateRuntimeConfig()` | 36 |
| `CardTools.getSortedRenderableTools()` | 106 |
| `LineTool.validateOrientation()` | 103 |
| `PolygonTool.setPolygonPathDefinition()` | 44 |

Update those locators before implementation so the plan matches its own baseline.

---

## 10. Relax the Plan-16-local LOC rule slightly

The current rule says roughly:

> If the central mechanism adds more code than it removes, stop and simplify it.

The intention is good: avoid building a framework.

But Plan 16 creates the permanent shared acceptance boundary that Plans 17–19 will use to remove much more downstream code.

A small local increase can therefore be reasonable.

Suggested wording:

> If the central mechanism materially increases product source, stop and review whether the boundary has become over-engineered.

Still require:

- no validator framework;
- no extra persistent config layer;
- no generic runtime state machine;
- no helper chains that merely rename existing logic.

---

## What is already strong in the plan

The five implementation stages are well ordered:

```text
1. stable source / BaseTool acceptance
2. shape-tool acceptance
3. text + icon acceptance
4. independent invalidation
5. consumer cleanup + integration
```

That sequence keeps the work testable and prevents config acceptance, geometry and theme semantics from being mixed into one large change.

The planned tests are also good, especially:

- source vs accepted independence;
- static vs JavaScript equivalence;
- rejected candidate preserves previous accepted config;
- group-only change without schema acceptance;
- theme-only change without schema acceptance;
- numeric accepted z-position;
- unchanged geometry.

---

## Recommended changes before implementation

The four most important changes are:

1. **Remove the special pending/unrendered JavaScript-tool model.**
2. **Explicitly state that Home Assistant states are free runtime data, including textual, `unknown` and `unavailable` states.**
3. **Determine `configChanged` only after normalization and validation of the candidate.**
4. **Atomically publish config-derived runtime fields such as `entity_index` and `zpos` together with `this.config`.**

Also recommended:

5. require deep source/accepted independence;
6. define active theme `colorstops` as derived materialization;
7. add an invalidation matrix;
8. update post-Plan-15 locators;
9. make the local LOC rule slightly less absolute.

With those adjustments, Plan 16 is clear enough to implement without encouraging another layer of defensive validation or a new configuration architecture.
