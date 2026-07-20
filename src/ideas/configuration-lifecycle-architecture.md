# Flexible Horseshoe Card - Configuration Lifecycle Architecture

## Goal

Flexible Horseshoe Card currently has several configuration representations and several independent JavaScript-template evaluation paths. A tool can receive static YAML, configuration expanded by an FHS template, values copied through `ref()`, values inherited through `same_as`, a partially normalized object, or a newly evaluated runtime object. The names `config` and `runtimeConfig` do not consistently explain which representation is being used.

This document records the current behavior and defines a target architecture. It is an investigation and design document only. It does not change production behavior.

The target must make these questions answerable from the code without tracing several unrelated functions:

- Which configuration layer is this object from?
- Has static inheritance already been applied?
- Can this field contain a JavaScript template?
- Where is that template evaluated?
- Has the result already been normalized?
- Which configuration must a tool use while calculating state, geometry and rendering?
- What work is required when Home Assistant publishes a new state?

## Current Configuration Flow

The current card-level flow starts in `main.js` and is approximately:

```text
raw Lovelace YAML
-> JSON clone
-> FHS card/part template expansion
-> assign layout ids
-> build constants and static calc constants
-> replace ref(...) throughout the config
-> evaluate calc(...) throughout the config
-> compile same_as inheritance
-> evaluate entity configuration
-> resolve layout entity ids to entity_index
-> merge card defaults
-> construct groups, masks and clips
-> normalize item color stops
-> construct tools
-> evaluate parts of the config again during state updates and rendering
```

The first part is a static configuration compiler. The later part is a mixture of runtime evaluation, normalization, state calculation and rendering. There is no single boundary between those responsibilities.

## Current Configuration Representations

### Raw YAML

The object passed to `setConfig()` is the user's Lovelace configuration. `setConfig()` immediately clones it through JSON serialization. The original input is not retained under a dedicated name, although the current error logger calls the working object `rawConfig`.

### Statically compiled card configuration

FHS reusable templates, IDs, constants, `ref()`, `calc()` and `same_as` mutate or replace parts of the cloned configuration. The resulting object is then merged with card defaults and assigned to `this.config` in the card.

This card configuration is mostly static, but it can still contain unresolved `[[[ ... ]]]` strings. Consequently, `this.config` at card level does not mean either completely static or completely runtime-ready.

### Tool source configuration

Most tool constructors receive an item from the card configuration. `BaseTool` stores that item in `this.config` and initially aliases the same object as `this.runtimeConfig`.

On every `BaseTool.setState()` call, the complete `this.config` object is recursively evaluated and the result replaces `this.runtimeConfig`. Tools are therefore expected to use `runtimeConfig` for dynamic behavior, but several tools still mix `config` and `runtimeConfig`.

### Independently resolved configuration

Not every component follows `BaseTool`:

- Horseshoes use a separate complete-config evaluation and normalization path.
- Entity definitions are evaluated from `main.js`.
- Item and sparkline color stops are evaluated from `_prepareItemColorStops()`.
- Animation styles and icons are evaluated from animation-specific code in `main.js`.
- Card-level styles are evaluated directly from `render()`.
- Some icon behavior performs additional evaluation in the tool.

These paths can evaluate the same source at different times and do not share a common active-config contract.

## Current Static Features

### FHS reusable templates

FHS templates run first. Their output is normal card configuration and continues through the remaining static compiler. They do not perform runtime JavaScript evaluation.

### Constants

`_buildConstants()` processes static `calc()` expressions inside `config.constants`. Numeric results are also made available to later static calculations.

Constants are not globally evaluated as JavaScript templates. This is correct because a JavaScript template can use `state`, `entity` and `item`, and those values only have meaning in the context of the final consumer.

### Static references

`ref(name)` copies the referenced constant into the target location before `same_as` runs. Objects and arrays are cloned. A copied value can still contain JavaScript templates.

For example:

```yaml
constants:
  dynamic_fill: |
    [[[
      return Number(state) > 10 ? 'red' : 'green';
    ]]]

layout:
  rectangles:
    - id: background
      styles:
        fill: ref(dynamic_fill)
```

The JavaScript expression is copied into the rectangle item. It must be detected and evaluated later in the context of that rectangle.

### Static calculations

`calc()` is a configuration-time numeric feature. It runs after references have been copied and before `same_as` inheritance. It is not a runtime JavaScript-template mechanism.

### Same-as inheritance

`same_as` merges already encountered items within a supported layout section. It copies or inherits JavaScript-template expressions but never evaluates them.

JavaScript detection must therefore happen after `same_as`. Detecting it earlier would miss templates inherited from another item or introduced through `ref()`.

The section lists are currently duplicated across the codebase. `SameAs.LAYOUT_SECTIONS` does not contain `sparklines`, while ID assignment, entity resolution and color-stop preparation do. This is an example of configuration features drifting apart because they do not share one section registry.

## JavaScript Constants

JavaScript templates stored in constants are supported through their eventual consumer, not through `same_as` itself.

There are two distinct routes:

```yaml
styles:
  fill: ref(dynamic_fill)
```

`ref()` copies the expression into the item. The item's JavaScript flag then covers the expression.

```yaml
styles:
  fill: |
    [[[ return constants['dynamic_fill']; ]]]
```

The outer expression is part of the item and makes the item dynamic. `Templates.getJsTemplateOrValue()` recursively evaluates the value returned by the outer expression, so the constant can return a primitive, object, array or another full JavaScript-template expression.

Constants must remain source values. Globally resolving all constants would be wrong because there is no single entity, state or item context in which to evaluate them.

## Practical End-User Template Pattern

A common existing pattern uses `config-template-card` variables as card-wide calculations and injects their results into entity icons, animation icons, animation styles and normal layout styles. The wrapper reevaluates those variables when an entity in its dependency list changes and then supplies the completed FHS config.

A direct FHS equivalent must list every entity read through `states[...]` in the FHS `entities` section, including supporting entities that have no visible layout item. Adding a dependency entity does not require rendering it. It only makes the update dependency explicit.

FHS constants are reusable source values rather than one globally evaluated result. A JavaScript-template constant can be copied into multiple consumers with `ref(name)`. Because JavaScript detection runs after references and `same_as`, every resulting entity, animation or layout item receives its own `hasJavascript` flag.

This preserves item context: the same constant can use `state`, `entity` or `item` differently in each consumer. The JavaScript function itself can be compiled once and cached, but its result is evaluated in the context of each marked consumer after a configured entity state changes.

For constants that only read `states[...]`, this produces the same visible behavior as card-wide variables. FHS must not assume that every constant is card-wide, because arbitrary constants can also depend on the consuming item.

## Current JavaScript Evaluation

`Templates.getJsTemplateOrValue()` recursively processes primitives, arrays, objects, object keys and full-string `[[[ ... ]]]` expressions. An expression can return another supported shape, which is processed recursively up to the configured depth.

Every evaluation currently constructs a new `Function`. There is no function cache and no recursive `hasJavascript` detector. As a result, a normal `BaseTool.setState()` recursively scans and recreates the entire item configuration even when the item contains no JavaScript.

Templates receive this public context:

| Variable | Current meaning |
| --- | --- |
| `hass` | Current Home Assistant object |
| `config` | Card-level compiled configuration, potentially still containing expressions |
| `entity` | Entity selected by the current item's `entity_index` |
| `entities` | Current FHS entity-state list |
| `states` | `hass.states` |
| `state` | Selected entity state or configured attribute |
| `constants` | `config.constants` |
| `item` | Item supplied as evaluation context |
| `user` | Current Home Assistant user |

The public JavaScript variable `config` must continue to mean the statically compiled card configuration. Changing it to a partially evaluated runtime object would make templates order-dependent: a template could observe an earlier item after evaluation but a later item before evaluation. There is no generally correct order for arbitrary user JavaScript.

## Current Evaluation Locations And Impact

| Component | Current evaluation location | Current impact |
| --- | --- | --- |
| Entity definitions | `_resolveEntityConfigs()` in `main.js` | The complete entity config is evaluated, currently more than once in a state pass |
| Ordinary visible tools | `BaseTool.setState()` | Every tool config is recursively scanned and cloned on each tool state update |
| Horseshoes | Horseshoe-specific state/config path | Evaluation and color-stop normalization differ from other tools |
| Sparklines | `BaseTool.setState()`, `_prepareItemColorStops()` and graph update code | Most rendering uses runtime config, but color stops and some fields follow separate paths |
| Item styles | Usually part of BaseTool evaluation; selected paths also evaluate separately | Support depends on the tool and callsite |
| Card-level styles | `main.js::render()` | JavaScript executes during Lit rendering |
| Color stops | `_prepareItemColorStops()` plus horseshoe-specific normalization | JavaScript evaluation and data-shape normalization are coupled |
| Animations | Animation handling in `main.js` | Only selected fields such as styles and icons are evaluated ad hoc |
| Icons | BaseTool plus icon render/update paths | Some values can be evaluated more than once or during rendering |
| Groups | `GroupManager` construction only | Group values are static and resolved groups are cached |
| Gradients | `MasksClips` construction only | Static and normalized once |
| Clips and masks | `MasksClips` construction only | Static and normalized once |
| Child cards | Child card's own `setConfig()` and Home Assistant lifecycle | Parent only creates, positions and forwards `hass` |

## Entity Dependencies For JavaScript Templates

The card's `setHass()` path first decides whether an entity has changed. That decision is based primarily on configured card entities, theme changes, forced updates and tool-specific history requirements.

A JavaScript template can read another Home Assistant entity through `states['sensor.example']`. Every entity used this way must also be present in the card-level `entities` list. This makes the dependency explicit and ensures that a change passes the existing entity-change gate.

FHS does not attempt to parse arbitrary JavaScript to discover entity dependencies. A template that references an entity which is absent from `entities` is outside the supported update contract and is not guaranteed to refresh when that entity changes.

## Target Configuration Layers

The target architecture uses four explicit layers.

### `rawConfig`

The unchanged Lovelace input. It exists only for diagnostics and error reporting.

### `compiledConfig`

The static card result after:

```text
FHS reusable templates
-> ids
-> constants
-> ref(...)
-> calc(...)
-> same_as
-> static validation
-> static external-key and shorthand normalization
```

`compiledConfig` retains JavaScript-template source strings. It is not mutated by Home Assistant state updates. It is also the object exposed as `config` to JavaScript templates for backward compatibility and deterministic behavior.

### `sourceConfig`

The statically compiled source belonging to one runtime component, such as an entity, visible tool, animation, card-style block or group. It contains that component's JavaScript expressions and is never replaced with their results.

For a tool:

```js
this.sourceConfig // expression-bearing compiled item
this.config       // active evaluated and normalized item
```

### Active `config`

The complete current configuration used by state calculation, geometry and rendering. It contains no unresolved expressions for the component being processed.

Tools must use only `this.config`. `runtimeConfig` is no longer needed after a later migration is complete. This matches the current sparkline graph engine, which can read a fully prepared graph configuration consistently through `this.config`.

## Target JavaScript Detection

After `ref()`, `calc()` and `same_as`, the configuration compiler recursively detects full JavaScript-template strings and records:

- `hasJavascript` per entity config.
- `hasJavascript` per visible layout item.
- `hasJavascript` per animation item.
- `hasJavascript` for card-level styles.
- `hasJavascript` per group.
- One aggregate card-level flag.

The detector includes object keys because dynamic color-stop keys are currently supported.

Compiled JavaScript functions are cached by their source text. Evaluation still uses the current `hass`, entity, state, item and user, but it does not create a new `Function` for the same source on every update.

Static items do not enter the recursive evaluator. Their active `config` can reuse the already normalized static object.

## Target Runtime Flow

The target Home Assistant update is:

```text
receive hass
-> update JavaScript context
-> determine configured entity-state changes, theme changes and tool lifecycle work
-> stop when none of these require an update
-> when a configured entity state changed: evaluate marked entity configs, groups, visible tools, animations and card styles
-> rebuild group geometry only when an evaluated group result changed
-> normalize changed active configs
-> calculate required state, data and derived geometry
-> perform independent theme or tool lifecycle work without reevaluating JavaScript config
-> request/render the card and compose the final visual result
```

No JavaScript-template evaluation occurs from a Lit `render()` method or an SVG renderer.

All configuration dynamics are therefore driven by configured entity-state changes. Rendering combines the latest active configs, calculated tool state and geometry, animation overlays, color-stop results, filters and styles. CSS animations continue in the browser without JavaScript evaluation or repeated Lit rendering.

The previous and next active config of a marked component are compared structurally. Normalization and derived geometry only run when the evaluated config changed. State-dependent calculations can still run when the entity state changed even when the active config itself did not.

## Target Normalization Order

For each visible item:

```text
sourceConfig
-> evaluate the complete item when hasJavascript is true
-> normalize external configuration names and accepted YAML shapes
-> normalize color_stops to internal colorstops
-> calculate entity state and tool-specific values
-> calculate geometry
-> render using this.config and compose the final styles
```

Evaluation and normalization are separate responsibilities. Normalization remains necessary even after the entire item has been evaluated because JavaScript can return an external YAML shape.

### Styles

Styles no longer need their own JavaScript callsite. A template anywhere inside `styles` is found while evaluating the complete item. During render, the evaluated styles are converted to the internal style dictionary and combined with the current animation styles, color-stop result, color filters and gradient references.

### Color stops

Color stops no longer need their own JavaScript callsite. The complete item is evaluated first. Afterwards, external `color_stops` is normalized to internal `colorstops` exactly once.

This also applies to `sparkline.color_stops`. The graph engine receives only the normalized active graph config.

### Tool-specific geometry

Coordinates, sizes, paths, scales and labels are derived only after the active config has been normalized. A tool never calculates geometry from `sourceConfig`.

## Target Support Boundary

JavaScript support should be consistent for complete user-facing components rather than selected individual fields.

| Configuration area | Target JavaScript support | Reason |
| --- | --- | --- |
| Entity definitions | Complete entity item | Names, icons, units, formatting and actions form one entity config |
| Visible layout tools | Complete item | Avoid field-by-field support differences |
| Horseshoes | Complete item | Same contract as other visible tools |
| Sparklines | Complete item, including nested sparkline config | Same contract as other visible tools |
| Card-level styles | Complete styles block | Already documented and currently supported |
| Animation items | Complete animation item | Avoid separate style/icon rules |
| Groups | Complete group config | Allows dynamic position, scale and group-level styling/filtering |
| Gradients | Static | SVG definition infrastructure is constructed once |
| Clips and masks | Static | SVG definition infrastructure is constructed once |
| Child-card config and placement | Child lifecycle | The child card owns its configuration and runtime behavior |

Groups without an entity binding can use `hass`, `states`, `constants`, `config` and `user`. `state` and `entity` only have meaning when the evaluated component has an `entity_index`.

## Impact By Component

### Cards without JavaScript

Impact should be lower than today. Static compilation runs once and all runtime template scans are skipped. Visible tools use their normalized static config directly.

### Cards with JavaScript

The card reevaluates marked components when one of its configured entities changes. Every entity read through `states[...]` must therefore also be listed in `entities`. Unchanged evaluated results do not trigger configuration normalization or geometry recalculation.

### Entities

Dynamic entity config is evaluated before selecting attributes, formatting values or exposing entity metadata to tools. The same active entity config must be used throughout one update pass.

### Ordinary visible tools

Every visible tool follows one sequence: evaluate complete item, normalize, process state, calculate geometry and render. Per-field evaluation disappears.

### Horseshoes

Horseshoes join the common source/active-config lifecycle. Horseshoe-specific scale mapping, state paths, labels and geometry remain horseshoe responsibilities and run after common evaluation and normalization.

### Sparklines

Sparkline tools join the same lifecycle. History management remains independent because it is data lifecycle rather than configuration lifecycle. The graph engine continues to receive one active graph config and can keep using `this.config` internally.

### Card-level styles

Card styles become a marked runtime component. Their JavaScript is evaluated before rendering and stored in the active card config. `render()` converts those active styles to the final style dictionary without executing JavaScript.

### Animations

The complete matching animation item is evaluated before state matching and application. Dynamic styles and icons no longer require different evaluators. Animation output remains separate from the tool source config and is merged at the existing visual stage.

### Groups

Groups are evaluated before tools because tools depend on their resolved positions, scales and filter chains. `GroupManager` is rebuilt only when an active group result changed. All tools in that group or a descendant group then recalculate dependent SVG geometry.

The cost is therefore not the JavaScript flag check. The meaningful cost occurs only when a dynamic group changes, because every dependent tool must move or rescale.

### Gradients, clips and masks

These remain static and continue to be normalized at card construction. Their renderers do not evaluate JavaScript.

### Child cards

The parent does not recursively evaluate child-card configuration. Each child remains a normal Home Assistant card with its own `setConfig()`, `hass` and render lifecycle. Parent placement remains static FHS configuration.

## Central Section Registry

The later implementation should define one authoritative list of visible layout sections and reuse it for:

- ID assignment.
- FHS part-template traversal.
- `same_as` compilation.
- Entity-id to `entity_index` resolution.
- JavaScript detection.
- Tool construction and lifecycle dispatch where applicable.
- Common color-stop normalization.

Definition sections such as clip/mask rectangles are a separate static registry. This prevents features such as sparklines from being accidentally omitted from only one compiler phase.

## Migration Strategy

The architecture can later be introduced without changing every tool at once.

### Phase 1: Inventory metadata without behavior changes

- Add the central section registry.
- Add recursive JavaScript detection and aggregate flags.
- Add function caching while retaining existing callsites.
- Record current support and compare it with the support boundary in this document.

### Phase 2: Establish the tool config contract

- Store expression-bearing item config as `sourceConfig`.
- Make `config` the active evaluated config.
- Skip evaluation for static items.
- Keep `runtimeConfig` temporarily as a compatibility alias while tools migrate.

### Phase 3: Migrate ordinary tools

- Move state, name, area, shape, line and icon tools to active `config`.
- Remove render-time and field-specific template evaluation from those tools.
- Keep final style composition in render and normalize color stops after whole-item evaluation.

### Phase 4: Migrate horseshoe and sparkline

- Route horseshoe through the common evaluation contract before horseshoe-specific processing.
- Route complete sparkline config through the same contract.
- Keep sparkline history and graph-engine responsibilities unchanged.

### Phase 5: Centralize non-tool dynamic components

- Evaluate marked entity configs once per update pass.
- Evaluate complete animation items consistently.
- Move card-style evaluation out of `render()`.
- Add dynamic groups and dependent geometry invalidation.

### Phase 6: Remove compatibility paths

- Remove `runtimeConfig` after every tool uses active `config`.
- Remove `_prepareItemColorStops()` as a JavaScript evaluator; retain color-stop normalization in the active-config pipeline.
- Remove animation and icon template callsites that duplicate whole-item evaluation.
- Update the user documentation with the explicit support matrix.

## Verification Scenarios For A Later Implementation

The later refactor should be verified against at least these scenarios:

1. A card without any JavaScript performs no runtime config evaluation.
2. A tool style depending on its own `state` updates correctly.
3. A tool field depending on `states[...]` updates when that entity is also present in the card-level `entities` list.
4. A JavaScript expression inherited through `same_as` is detected after compilation.
5. A JavaScript expression copied through `ref()` is detected in the final item.
6. A constant returned from another JavaScript template is recursively evaluated in the consuming item context.
7. Dynamic object keys in color stops continue to work.
8. External `color_stops` returned by JavaScript is normalized to internal `colorstops` once.
9. Card-level styles update without evaluating JavaScript during `render()`.
10. Horseshoe, sparkline and ordinary tools all read active config through the same property.
11. A dynamic group moves every direct and descendant tool while unrelated groups retain their geometry.
12. Gradients, clips and masks remain static.
13. Child cards continue to own their configuration lifecycle.
14. A JavaScript template reading `config` always observes deterministic `compiledConfig`, not a partially evaluated runtime object.

## Resulting Invariants

After a later implementation, the following rules should hold:

- Static composition always finishes before JavaScript detection.
- JavaScript evaluation always finishes before runtime normalization.
- JavaScript configuration is reevaluated only for configured entity-state changes.
- Runtime normalization always finishes before state and geometry calculation.
- State and geometry calculation always finish before rendering.
- Render functions never evaluate JavaScript.
- A tool's `this.config` is always ready to use.
- A tool's `this.sourceConfig` is never mutated by runtime updates.
- `constants` are source values and are evaluated only through a consuming component.
- `same_as` composes configuration but never evaluates it.
- Styles are composed during render and color stops are normalized before use; neither has a separate JavaScript evaluation path.
- Static SVG definitions remain outside the runtime template lifecycle.
