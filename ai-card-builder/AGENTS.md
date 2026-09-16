# Flexible Horseshoe Card — AI card builder

This directory contains the authoritative machine-readable authoring contract for Flexible Horseshoe Card (FHS).

## Version selection

Always use the highest numeric version for which both files exist in this directory:

- `fhs.schema.vN.json`
- `fhs.authoring.vN.json`

The schema and authoring file must use the same version number. If v11 and v12 are both present, use v12. Only use an older version when the user explicitly requests that version.

## Source of truth

When creating, modifying, reviewing, validating, or explaining FHS YAML:

1. Use the matching `fhs.schema.vN.json` as the authoritative public syntax and structure contract.
2. Use schema `description` fields for field semantics.
3. Use top-level `x-fhs-relationships` for dependencies, selectors, inheritance, activation, overrides, fallbacks, references, providers, and cross-field effects.
4. Use `fhs.authoring.vN.json` for preferred valid authoring patterns and runtime-parity guidance.
5. Treat behavior explicitly described by these files as authoritative for FHS authoring.

A structurally valid field does not necessarily have an effect by itself. Resolve the relevant relationships before generating YAML.

## Do not mix card syntaxes

Do not infer FHS syntax from Swiss Army Knife Card, Mushroom, button-card, gauge cards, other custom cards, or conflicting internet examples.

Do not invent fields, nesting, modes, or relationships. If requested behavior cannot be derived from the supplied schema, descriptions, relationships, or authoring file, say that it is not established by the supplied FHS definition.

## External knowledge and standards

The FHS v12 schema, relationships, and authoring file are authoritative for FHS configuration syntax and behavior.

External sources may be used to understand general concepts such as Home Assistant entity terminology, JavaScript language semantics, and SVG/CSS presentation properties. They must never be used to invent, extend, replace, or override FHS fields, nesting, enum values, relationships, or runtime context.

Similarity is not compatibility. A feature that looks like a Home Assistant helper or another custom card feature does not inherit that product's configuration syntax unless the FHS contract explicitly says so.

FHS visual tools render primarily as SVG. Standard SVG/CSS presentation knowledge is appropriate inside documented FHS style fields. Do not introduce HTML elements or HTML-only layout assumptions such as flex/grid merely because `styles` uses CSS-like properties.

## v12 runtime-parity rules

### Sparkline

For `layout.sparklines[]`:

- keep `period`, `x_axis`, `y_axis`, and `series` at the sparkline item root;
- put graph rendering configuration under the nested `sparkline:` block;
- put `show`, `line`, `area`, `bar`, `dots`, `equalizer`, `graded`, `barcode`, `state_bands`, `radial`, `radial_barcode`, and sparkline `color_stops` under `sparkline:`;
- use `duration.hour`; express one day as `hour: 24`, not `day: 1`;
- put per-series graph overrides under `series[].sparkline`;
- do not use `show.area`; `show.chart_type: area` selects the area chart;
- treat grid, axis, tickmarks, and labels as independent show switches, limited only by the selected chart family's axis capabilities.

For radial series, `chart_variant` is `line`, `area`, or `dots`. Radial series share the parent `sparkline.radial` geometry.

`chart_variant` and `chart_viz` are not universal selectors. Use the v12 selector matrix:
- `barcode`: optional `chart_variant` = `audio`, `stalactites`, or `stalagmites`; omit `chart_viz`;
- `graded`: optional `chart_variant` = `rank_order`; omit `chart_viz`;
- `radial`: `chart_variant` = `line`, `area`, or `dots`; omit `chart_viz`;
- `radial_barcode`: `chart_variant` = `fixed`, `sunburst`, `sunburst_centered`, `sunburst_outward`, or `sunburst_inward`; `chart_viz` = `bar`, `flower`, `flower2`, or `rice_grain`;
- other chart families: omit both selectors.

When a selector is not meaningful, omit the field. Do not invent placeholders such as `default`, `none`, or `standard`.

### Browser-local FHS entities

`fhs_input_number`, `fhs_input_boolean`, and `fhs_input_select` are entity domains, not complete entity ids and not control child blocks.

Define them as ordinary root `entities[]` entries using normal `domain.object_id` syntax:

```yaml
entities:
  - entity: fhs_input_number.horseshoe_width
    initial: 6
    min: 2
    max: 20
    step: 1
    scope: card
```

Bind controls through `entity_index`. Do not author `controls[].fhs_input_number:` or a bare `entity: fhs_input_number`.

Use FHS-local inputs for settings that belong only to the card/browser. Use a Home Assistant helper when automations, other dashboards, or other devices need the same value.

### JavaScript templates

Treat the documented JavaScript context as a runtime API:

- `state`: current bound item's resolved state/attribute;
- `entity`: complete current bound entity;
- `entities`: resolved FHS card entity list, including configured FHS-local inputs;
- `entity_slots`: slot name to entity-index arrays;
- `states`: Home Assistant `hass.states`;
  when reading `states['domain.object_id']`, also list that HA entity in root `entities[]` so its changes update the card;
- `hass`: Home Assistant frontend object;
- `constants`: resolved card constants;
- `item`: current FHS item context;
- `user`: current Home Assistant user.

`entities` and `states` are not aliases. Read an FHS-local input through `entities[index].state` (or a named slot), not by assuming it exists in `states`.

Do not invent context interfaces such as `tools.<id>.value`. General JavaScript language features are allowed, but the available FHS context is only what v12 documents.

A JavaScript template returns the complete value for the containing YAML field. Its result must satisfy that field's documented type/value semantics.

### Slider numeric metadata

For sliders, `interaction` is for pointer/write behavior such as `update_interval` and `haptic`. Numeric `min`, `max`, and `step` belong to `scale` or to the bound numeric entity. Do not author `interaction.step`.

### Constants

`constants` supports scalar values, arrays, configuration fragments, and nested object namespaces.

- top-level constant names use JavaScript-style identifiers;
- `.` means nested object traversal;
- `ref(theme.colors.warning)` may return a scalar, object, or array;
- referenced objects/arrays are deep-cloned;
- `calc(geometry.horseshoe.radius * 2)` may use nested numeric paths;
- `calc()` is numeric only and constants are compiled in declaration order;
- array-index paths such as `ref(items[0])` are not supported;
- `ref()` and `calc()` are whole-value expressions, not string interpolation.

### Actions

Generic actions do not include `increment`, `decrement`, or `set-value`.

- `increment` and `decrement` are local shorthand only for number-control minus/plus buttons and are translated to bound-domain `perform-action`;
- `set-value` is local to slider `set_value_action` and is translated to bound-domain `set_value`;
- `actions[]` executes sequentially.

### Gradients, masks, and clips

- reference `layout.gradients.<name>` from styles with `gradient(name)`;
- do not emit raw `url(#name)` for an FHS gradient because runtime SVG ids are card-scoped;
- numeric `objectBoundingBox` gradient coordinates and numeric stop offsets use 0..100 percentage semantics;
- `mask` may be one name or an array; arrays are nested in order;
- masks are applied before the clip;
- `soft_arc` derives geometry from the first arc in its referenced clip.

## Mandatory final validation pass

Generation is not validation.

After creating or modifying a complete FHS configuration, and before returning it to the user, perform a separate final validation pass using the matching v12 files as authority. Re-read the completed configuration as a whole and correct violations before output.

Check at least:

1. every field exists in the schema and is at the correct hierarchy level;
2. required discriminators and required fields are present;
3. static enum/selector values are valid for the selected type or chart family;
4. relevant `x-fhs-relationships` are satisfied, including activation, references, inheritance, overrides and fallbacks;
5. `entity_index`, slots, ids, `same_as`, `ref()`, `calc()`, gradients and control bindings resolve coherently;
6. FHS-local entities use complete `domain.object_id` syntax and live under `entities[]`;
7. JavaScript uses only documented template context values and returns a valid value for the receiving field;
8. numeric control metadata is placed on the bound entity or documented control scale, not guessed into interaction fields;
9. one part of the final configuration does not contradict another.

Validation must use the supplied FHS specification, not the model's recollection of FHS, Home Assistant, an internet example, or the configuration it just generated. If behavior cannot be established from the v12 contract, state the uncertainty instead of inventing a solution.

## Existing FHS cards

When the user supplies an existing FHS card:

- preserve valid working configuration unless the requested change requires changing it;
- make the smallest coherent change that satisfies the request;
- preserve existing entities, item ids, templates, groups, positions, styles, and reuse patterns where possible;
- extend the existing structure instead of rebuilding the whole card;
- use the existing card for visual/layout context while the schema remains authoritative for validity.

## Reuse and inheritance

Resolve reuse before duplicating configuration. Prefer FHS templates, constants, `same_as`, `ref()`, and `calc()` when applicable.

Entity-level configuration may intentionally supply behavior to multiple layout items. For example, color-stop-aware tools can consume entity-level `color_stops` through `entity_index` when their selected rendering mode activates color-stop behavior. Do not copy shared configuration locally unless an override is intended.

When a reusable color-stop model also defines its numeric domain, prefer `color_stops.scales.default` together with `colors`. Compact valid color-stop mappings/lists remain supported.

## YAML output

Generate plain Home Assistant YAML. Do not use YAML anchors or aliases unless explicitly requested.

Prefer current, non-deprecated public fields. Do not replace valid FHS reuse syntax with another mechanism merely because another valid form exists.

## Explanations

When useful, explain a change by naming the relevant FHS field or relationship. Distinguish between:

- FHS-defined behavior;
- FHS defaults and fallbacks;
- authoring choices such as positions, spacing, dimensions, and visual balance.
