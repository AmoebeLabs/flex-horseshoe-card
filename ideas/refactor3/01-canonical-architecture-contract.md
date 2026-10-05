# Canonical Tool Architecture Contract

## 1. Objective

The architecture must make an unfamiliar tool predictable before its implementation is read.

The design target is **copy-compatible architecture**:

> Equivalent components use the same lifecycle methods, parameter meanings, data categories and canonical names. Tool-specific behaviour changes the contents of those methods and structures, not their architectural role.

A new tool should normally be able to start as a copy of a comparable existing tool. Its calculations and render body may be different; its surrounding architecture should remain recognisable.

This is not a functional rewrite. The architecture around proven code changes; proven calculations do not unless a small interface adaptation is necessary.

---

## 2. Tool source boundary and JavaScript evaluation order

For a BaseTool descendant, `sourceConfig` means:

> the stable **template-visible tool source** after established card-level compilation/routing and after any tool preparation that is already visible to JavaScript today, but before runtime, geometry or paint output.

This definition is deliberately behavioural rather than theoretical.

The current implementation sometimes applies defaults before BaseTool captures its source. Those defaults are not automatically architectural mistakes. If current JavaScript can observe them through `item`, moving them after evaluation changes user-visible behaviour.

Example:

```text
Arc user config omits radius
→ current Arc source preparation supplies radius: 45
→ template evaluates `item.radius * 2`
→ result is 90
```

The refactor must preserve that result.

### 2.1 Two classes of tool preprocessing

Every pre-existing constructor/factory transformation is classified before movement:

```text
PRE-SOURCE / TEMPLATE-VISIBLE
  defaults or structural completion current JS can observe
  → must remain before sourceConfig is captured/evaluated

POST-EVALUATION TRANSLATION
  validation/normalization/completion not required by current JS context
  → belongs in translateConfig(newConfig)
```

Do not move code from the first category to the second merely to make the diagram prettier.

Card-level compilation may continue to perform established operations such as:

- card templates;
- `ref()` and `calc()`;
- `same_as`;
- compounds;
- IDs;
- disabled filtering;
- entity-slot/index addressing;
- section routing and legacy section identification where required.

A tool may use a small pure source-preparation function before BaseTool when current behaviour requires template-visible defaults. That preparation creates `sourceConfig`; it is **not** a second persistent current config.

The architecture requirement is that the meaning and ordering are explicit and testable, not that every default is forcibly moved after JavaScript.

---

## 3. The single current-configuration route

Once the stable template-visible source exists, every BaseTool descendant conceptually follows one route:

```text
compiled/routed item
    ↓
prepare template-visible source when current behaviour requires it
    ↓
sourceConfig
    ↓
evaluate dynamic JavaScript with the same item/context ordering as today
    ↓
newConfig                    local/transient only
    ↓
translateConfig(newConfig)   post-evaluation canonical translation
    ↓
this.config                  sole current canonical tool configuration
```

### Rules

- `sourceConfig` is stable and preserves the established template-visible defaults/context.
- `sourceConfig` never receives geometry, runtime or paint output.
- JavaScript evaluation order and `item` semantics are part of the functional contract.
- `newConfig` exists only as a local variable during processing.
- `newConfig` is never persisted as `this.newConfig`.
- `this.config` is the only current canonical tool configuration.
- `setState()` never publishes or swaps a configuration.
- group/layout changes do not create another config.
- theme changes do not create another config.
- current HA state does not create another config.
- a runtime item may reference a subtree of `this.config`; it may not reconstruct and own another effective general config.

Persistent general aliases such as the following are therefore not valid end-state architecture:

```text
activeConfig
activeItemConfig
runtimeConfig
effectiveConfig
resolvedConfig
acceptedConfig
candidateConfig
normalizedConfig
stateData.config
```

A local variable named `normalizedConfig` or `effectiveConfig` during one pure preparation/translation is not inherently wrong. The rule concerns persistent ownership and multiple semantic current-config routes.

---

## 4. Safe translation implementation

Uniform translation must not be implemented by invoking an overridden subclass method from the BaseTool constructor before subclass construction is complete.

For example, this is too fragile as a generic mechanism:

```js
class BaseTool {
  constructor(config) {
    this.config = this.translateConfig(config);
  }
}
```

because the overridden translator may eventually depend on subclass state that has not been initialized yet.

The reference implementation should instead use a pure/static/explicit translator contract with stable inputs. Exact wiring is proven on the simple tools in Plan 15B.

The important invariant is not the syntax of the hook. It is that **initial construction and later JS reevaluation preserve the same source-preparation, JavaScript-context and translation semantics**.

A translator may not be made “more uniform” by moving a currently template-visible default to a point after JavaScript evaluation.

---

## 5. Canonical data vocabulary

Shared concepts use shared names. Local synonyms for the same architectural concept are not introduced.

### 5.1 Configuration

```text
sourceConfig
newConfig
this.config
```

### 5.2 Geometry

```text
this.geometry
this.geometrySignature
```

Typical members may include:

```text
geometry.svg
geometry.bounds
geometry.pathInput
geometry.pathDefinition
geometry.path
geometry.transform
geometry.axis
geometry.measurement
```

The contents are tool-specific. The owner name is not.

### 5.3 Runtime

```text
this.runtime
this.runtimeSignature
```

Typical members may include:

```text
runtime.entity
runtime.entityConfig
runtime.value
runtime.state
runtime.uom
runtime.mappedState
runtime.stateMapItem
runtime.options
runtime.selectedIndex
runtime.progress
runtime.available
runtime.dragging
```

The shared container is called `runtime`, not `state`, because `StateTool` legitimately has a domain value called state.

### 5.4 Paint / presentation

```text
this.paint
this.paintSignature
```

Typical persistent derived presentation data may include:

```text
paint.styles
paint.colorStops
paint.gradient
paint.ranges
paint.marker
```

Do not create an empty paint object in every tool merely for symmetry. The rule is:

> if the same category exists, it has the same name and semantic owner.

Theme-selected active color-stop output is a final-state paint concept, but its owner must not be moved partially. Because ordinary tools, Controls, Sparkline and Horseshoe currently consume active color stops from config-shaped data, the shared cutover is performed atomically only after all families are prepared. Until that cutover, the current location is a documented temporary legacy exception; no duplicate persistent config+paint owner is introduced.

### 5.5 Effective style / parent-presentation contract

`config.styles` remains canonical configuration.

When current runtime/parent state must change how a retained child tool is presented, that change is published as paint rather than by modifying the child config.

The minimal migration contract is:

```text
config.styles
    stable configured style source

paint.styles
    current runtime/parent-driven replacement style map when present

effective styles
    use paint.styles when present, otherwise config.styles,
    then apply the existing animation/filter/theme cascade
```

A small method such as `setPaintStyles(styles)` may be used so a retained child can receive runtime presentation without exposing config mutation as an API.

For migration safety, callers initially publish the **same fully merged style map they currently assign to `config.styles`**. This preserves the existing style priority mechanically. Do not invent a universal new priority order during this refactor.

Text-like measurement must use the effective styles. If an effective presentation change alters a measurement-relevant property, the measurement signature/geometry is invalidated exactly as under the current config-mutation route.

Characterization tests must establish current precedence where parent state styles and configured child styles overlap.

### 5.6 Unique domain data

Unique responsibilities may retain clear domain names:

```text
history
graph
animation
requests
cache
statistics
```

Support modules do not need to imitate BaseTool. They still use canonical shared vocabulary where shared concepts occur.

A derived graph calculation contract, for example, should not be called public `config` if it is not configuration ownership.

---

## 6. Shared lifecycle vocabulary

Where present, these lifecycle methods keep the same role and parameter meaning:

```text
constructor(...)
translateConfig(config)
updateRuntimeConfig()
setState(entity, entityConfig)
connected()
disconnected()
hassAvailable()
hassConnected()
firstUpdated()
updated()
render()
```

A tool need not implement every no-op itself if BaseTool already owns it.

The key rule is that when the method exists, a developer already knows what category of work to find there.

### `updateRuntimeConfig()`

- runs the common config-update route;
- reacts to actual canonical config changes;
- invalidates/rebuilds config-derived geometry/paint as appropriate;
- does not process current HA state as configuration.

### `setState(entity, entityConfig)`

- processes current runtime entity state;
- may derive runtime and state-dependent paint;
- does not replace `this.config`.

### `connected()` / `disconnected()`

- own DOM/connection lifetime resources;
- use the same semantic contract across every tool and support component that exposes these methods.

### `render()`

- consumes canonical config plus current derived owners;
- does not repair or rebuild configuration.

---

## 7. Linear readability rule

Lifecycle methods should show their important steps in execution order.

Preferred shape:

```js
updateRuntimeConfig() {
  super.updateRuntimeConfig();

  if (this.geometryChanged) {
    this.updateGeometry();
  }

  if (this.paintChanged) {
    this.updatePaint();
  }
}
```

A longer linear function can be clearer than a chain of tiny wrappers.

Extract a helper when:

- the block represents a genuine independent calculation;
- it is reused;
- or the parent function would otherwise become genuinely difficult to scan.

Do not extract a helper merely to move five readable lines somewhere else.

The opposite extreme is also avoided: a thousand-line lifecycle function is not “linear simplicity”. Large self-contained calculations such as path creation, axis translation or series translation are legitimate helpers.

---

## 8. Preserve / Adapt / Remove

Every implementation diff should be explainable as one of these categories.

### PRESERVE

Proven functional code remains semantically unchanged:

- Home Assistant entity/state interpretation;
- state/value conversion;
- formatting;
- color conversion/interpolation;
- path algorithms;
- history request/time calculations;
- Sparkline graph math;
- text measurement behaviour;
- pointer/action behaviour;
- existing normalization algorithms whose semantics are not the architecture problem.

### ADAPT

Small glue changes are expected because ownership changes:

```text
config.svg              → geometry.svg
config.mapped_state     → runtime.mappedState
numberGeometry          → geometry
resolvedEntityConfigs   → runtimeEntityConfigs
graphConfig             → graphInput
```

### REMOVE / REPLACE

Architectural ballast is in scope:

- parallel config owners;
- repeated parent/child config merges;
- HA runtime state written into config;
- theme/state-derived paint written into config;
- config copies used only as a change state;
- helpers made unnecessary by colocation;
- duplicate lifecycle routes;
- local synonyms for canonical owners;
- child tool config mutation used as runtime presentation state.

---

## 9. Generated child tools

Controls legitimately generate child Text/Icon/State/etc. tools.

The rule is:

> A generated child may receive generated source configuration at construction, but once constructed it follows the same stable-source / canonical-config rules as every other tool.

A parent geometry change may recreate a child with a new generated source if that is the simplest existing design.

What is not allowed is retaining a child and using its `config` as mutable runtime paint storage.

---

## 10. Change detection

Change detection is derived from canonical owners, not from another configuration layer.

Examples:

```text
configSignature
geometrySignature
runtimeSignature
paintSignature
presentationSignature
```

Use the name that describes what is actually compared.

`presentationSignature` remains a valid concept when it intentionally covers the final visible result rather than paint alone.

---

## 11. Searchability is an architecture requirement

A maintainer should be able to search for:

```text
sourceConfig
translateConfig
this.config
geometry
runtime
paint
connected
disconnected
setState
render
```

and land on the expected responsibility without memorising every tool.

Therefore:

> canonical concepts use canonical names across the codebase; different names imply genuinely different responsibilities.

---

## 12. New-build test

After every family migration ask:

> If this tool were created today using the canonical architecture, would we still choose this ownership, naming and lifecycle structure?

This question applies to architecture, not to working algorithms.

A path, color, history or formatting routine is not rewritten merely because a different implementation could be imagined today.
