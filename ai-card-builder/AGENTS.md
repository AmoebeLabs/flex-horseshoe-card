# Flexible Horseshoe Card — AI card builder

This directory contains the authoritative machine-readable authoring contract for Flexible Horseshoe Card (FHS).

## Version selection

Always use the highest numeric version for which both files exist in this directory:

- `fhs.schema.vN.json`
- `fhs.authoring.vN.json`

The schema and authoring file must use the same version number. If v10 and v11 are both present, use v11. Only use an older version when the user explicitly requests that version.

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

## v11 runtime-parity rules

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
