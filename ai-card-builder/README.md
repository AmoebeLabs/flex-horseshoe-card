# FHS config-first schema source v12

This is the ninth test version of the Flexible Horseshoe Card configuration definition and Home Assistant audit validator.

The primary organization rule remains:

> **The definition tree mirrors the public FHS YAML.**

If a card contains `layout.states:`, its public definition is in `config-schema/definitions/layout/states.yaml`. The same rule applies to `groups`, `gradients`, `clips`, `masks`, `circles`, `lines`, `horseshoes`, `sparklines`, `controls`, and the other visible layout sections. `common/` contains only reusable schema building blocks.

## What changed after the first real HA audit

The first Home Assistant run checked 219 FHS cards and exposed an important problem: the first Python validator was partially re-implementing JSON Schema itself. That made valid `oneOf` configurations, especially controls, appear invalid.

V2 removes that responsibility from the FHS code. Formal schema validation now uses the official Python `jsonschema` Draft 2020-12 validator. The FHS Python code is responsible only for FHS/HA-specific work around it:

- loading YAML with Home Assistant's annotated YAML loader;
- finding concrete FHS cards;
- expanding FHS card templates and template variables;
- compiling `default_entities` like the current FHS `CardTemplates` implementation;
- preserving source/template provenance;
- resolving static `ref()` and `calc()` expressions;
- validating public `same_as` / `same_as_d...` reuse syntax declaratively in JSON Schema;
- reporting schema errors in a compact FHS-oriented format;
- reading schema annotations such as `deprecated` for migration warnings;
- grouping shared-template diagnostics across concrete cards.

There is no silent fallback to a home-grown JSON Schema interpreter. If `jsonschema` is not importable, the validator stops with one explicit runtime error.

## Root-level fields

FHS validation now distinguishes three different kinds of card-root fields.

1. **Current FHS fields** are validated normally (`type`, `entities`, `constants`, `layout`, etc.).
2. **External Lovelace/card-placement fields** are removed before FHS validation. The current list is stored in `ha-validator/home-assistant-root-fields.json` and includes `grid_options`, `view_layout`, `visibility`, and root-level card-mod `style`.
3. **Legacy FHS root horseshoe fields** remain schema-valid for backward compatibility, but V7 reports them separately as `LEGACY [root-horseshoe]` rather than mixing them into actionable warnings.

For example, root-level `color_stops` now reports:

```text
LEGACY [root-horseshoe] legacy root-level horseshoe field 'color_stops' retained for backward compatibility; current form is layout.horseshoes[].color_stops
```

This does **not** mean `color_stops` itself is deprecated. `layout.horseshoes[].color_stops` and other current uses remain normal public configuration.

## Other v2 corrections

- Control `oneOf` dispatch is handled by the official schema engine.
- `controlSlider` includes current `values`, `value`, and `interaction` configuration.
- Sparkline `show.grid`, `show.axis`, `show.tickmarks`, and `show.labels` accept both booleans and axis objects.
- Runtime JavaScript values are allowed for the audited Sparkline/Horseshoe enum fields that are runtime-selectable.
- `sparkline.animate` and `sparkline.styles` are represented.
- `chart_variant` is intentionally permissive in this pass because its valid values depend on `chart_type` (Cartesian, radial, barcode, radial barcode, etc.).
- `calc()` understands nested constants such as `calc(zpos.horseshoes - 1)`.
- Intermediate reusable schemas such as `common.textBase` and `layout.controlBase` are no longer prematurely closed with `unevaluatedProperties: false`; only the final public tool contract closes the inherited object.

## Generate JSON Schema

The hand-maintained YAML in `config-schema/definitions/` is authoritative. The generated JSON files are build products.

The repository generator recursively discovers every YAML definition file and rejects duplicate definitions and unresolved `$ref`s:

```bash
npm install
node config-schema/generator/generate.mjs
```

`config-schema/package.json` contains the small `yaml` development dependency used by the generator.

## Home Assistant test

Copy the contents of `ha-validator/` to the directory you use in Home Assistant, for example:

```text
/config/tools/ha-validator/
├── validate.py
├── fhs.schema.json
├── home-assistant-root-fields.json
└── requirements.txt
```

Then run:

```bash
python /config/tools/ha-validator/validate.py /config
```

The header should now contain both the Home Assistant loader and the official schema engine, for example:

```text
FHS validator: loader=homeassistant.util.yaml, schema=jsonschema 4.x Draft2020-12, dashboards=5, strict=False
```

If the runtime does not contain `jsonschema`, the validator stops immediately with a clear error rather than producing unreliable results.

## Prototype limitations still intentionally present

This remains a compatibility-first prototype. Some deeper Horseshoe/Sparkline/control substructures are deliberately permissive and should be tightened from real cards and current source behavior. The Python validator deliberately does not reproduce the JavaScript `SameAs.compile()` / `Merge.mergeDeep` implementation or compound rendering expansion. Runtime JavaScript is recognized but not executed.

The goal of the next real HA run is therefore not zero warnings. It is a much cleaner split between:

- genuine modernisation findings in old examples/templates;
- schema areas that still need definition work;
- genuine invalid configuration.


## v3 refinement after the second real Home Assistant audit

- suppresses `unevaluatedProperties` cascade noise for fields that are already part of the schema contract;
- accepts the current Sparkline shorthand `period.real_time: true/false` as well as the object form;
- adds the current TextTool `text_overflow.mode: fit` / `fit.max_width` / `fit.min_font_size` form;
- resolves dependencies between `constants` before evaluating `calc()` and `ref()`;
- keeps genuine deprecated/legacy findings visible for modernization.

## v4 reuse/schema refinement

V4 moves `same_as` validation to the public YAML contract instead of reproducing the JavaScript merge engine in Python.

- An item with `same_as` is a partial override. Fields that are required for a standalone item may be inherited and therefore omitted locally.
- Without `same_as`, the original `required` contract remains active.
- Polymorphic controls have a generated `same_as` override branch, so an inherited toggle/select/number/button/slider does not need to repeat `type`.
- The generator derives `same_as_d<field>` names from known numeric/delta-capable fields. The syntax intentionally has no underscore after `d`, for example `same_as_dxpos` and `same_as_dentity_index`.
- Delta values are static numeric offsets: literal numbers, `ref()`, or `calc()`. Runtime JavaScript is not accepted because the FHS JavaScript implementation applies these deltas during config-time compilation.
- The Python validator no longer runs a second structure audit on a Python-reimplemented `same_as` result. JSON Schema validates the public configuration once; the static resolver remains only for provenance-aware `ref()` / `calc()` diagnostics.
- `debug_state_map` is recognized as an obsolete debug-only horseshoe field and produces a migration warning instead of an unknown-field warning.
- `state_map` now has one shared `common.stateMap` definition and is referenced by current icon, horseshoe, and Sparkline state-map configuration.

Regression coverage includes a Cartesian-showcase-style inherited control, inherited polygon/text required fields, valid `same_as_dxpos`, invalid unknown delta suffixes, and rejection of runtime-JavaScript deltas. The supplied card 091 control list was also checked directly: 21 controls, 0 schema errors.

## v5 refinements

- FHS boolean-like fields use `true|false|0|1` plus supported `ref()`, `calc()`, and JavaScript forms. Textual `"true"`/`"false"` are intentionally not part of the public schema.
- `disabled` uses that shared FHS boolean contract for entities and layout items.
- Python `calc()` diagnostics now include the same built-in `DEFAULT_ZPOS` namespace as the JavaScript `CardConfig` compiler.
- `sparkline.colorstops_transition` follows the current `smooth|hard` contract.
- `common.styles` accepts `null` and `false`, matching `ConfigHelper.toStyleDict()`.
- `dev: null` and `horseshoe_tickmarks: null` are accepted because current JavaScript normalizes them to empty configuration.
- Horseshoe path `degrees` is included in the current path definition.
- State items accept the current object-form `format:` block used by `StateTool`.
- `additionalProperties` diagnostics derive actual unknown keys from the instance; schema regexes are never printed as fake YAML fields.
- `layout.groups[].entity_index` and `layout.groups[].rotate` remain intentionally invalid under the current `GroupManager` contract.
- Old top-level Sparkline `animate` / `entity_indexes` and other unsupported legacy shapes remain warnings rather than being made permissive.

## v6 refinements

V6 is the first pass intended to be clean enough for iterative configuration cleanup rather than primarily validator cleanup.

- `layout.icons[].icon_size` is current valid syntax again. It uses the font-size-based/typographic sizing scale and is no longer deprecated.
- `layout.icons[].icon_size_percent` remains the geometric sizing mode relative to the FHS SVG/card.
- Legacy `layout.icons[].size` remains accepted but is deprecated with migration target `icon_size`.
- Configuring both `icon_size` and `icon_size_percent` remains schema-valid because current runtime behavior is deterministic; the validator emits `WARNING [conflicting-fields]` and reports that `icon_size_percent` takes precedence.
- Horseshoe `path` accepts either a literal path object or exact `ref(...)` authoring syntax. The Python validator does not resolve that reference into a runtime path object for schema validation; the FHS JavaScript config compiler remains authoritative for the resolved value.
- State `format` accepts the current StateTool string modes in addition to the object-form formatting block. Arbitrary strings are not advertised as public schema.
- Validator summaries report warning/error counts per diagnostic category and no longer print one grand warning total.
- A first AI-facing semantic layer is stored directly in schema `description` metadata. The rectangle/polygon path definition now explains path numbering, `start`, `end`, `top`, and `direction`; icon sizing descriptions explain the difference between typographic and geometric sizing. These descriptions are generated into JSON Schema and can later be reused for AI-oriented reference output.

Regression coverage includes the card-075-style `path: ref(path_cw)` authoring pattern, current/legacy/conflicting icon sizing, StateTool string formats, generated AI descriptions, category-only summary output, and all previous v4/v5 fixtures. The supplied card 091 template still validates with 0 schema errors after normal `default_entities` preprocessing.

## v7 cleanup/diagnostic refinement

V7 is built from the V6 cleanup run and is intended to remove the false positives discovered while manually modernizing the real 219-card Home Assistant configuration.

- `layout.icons[].size`, `icon_size`, and `icon_size_percent` are all current supported IconTool fields. Runtime precedence is `icon_size_percent > icon_size > size`; mixed forms stay valid but produce a `conflicting-fields` warning because a lower-priority value is shadowed.
- Control-content icons are explicitly documented as a different interface: inside `content_horizontal` / `content_vertical` item stacks, `type: icon` uses `size` as the cell-relative percentage. It must not be mechanically renamed to `icon_size`.
- `same_as` partial overrides now support nested object inheritance declaratively. A rectangle copy may override only `fit.item_id` while inheriting required `fit.section`; a standalone rectangle still requires the complete `fit` object. The Python validator still does not execute `SameAs.compile()` or `Merge.mergeDeep()`.
- Root-level card-mod `style` is treated as external card metadata and is stripped only at FHS card root. Nested FHS `style` fields are not globally made permissive.
- `xpos`, `ypos`, `width`, `height`, `zpos`, and `frameless` on an FHS card inside a parent FHS `cards:` array are recognized as parent-owned ChildCards placement metadata. They are stripped before expanding the nested card template, matching the runtime boundary.
- Root Horseshoe compatibility fields are reported in a separate `Legacy compatibility` summary instead of actionable warnings.
- `layout.states[].state_map` is current valid syntax, including `type: state_value` mappings used to turn textual states into values for color-stop behavior.
- Circle migration metadata now records the non-trivial unit conversion: legacy `radius` is raw SVG units, so preserving visual size requires `radius_percent = radius / 2`.

The expected effect on the last V6 audit is that card-mod `style`, child-card placement, nested `same_as fit.section`, and StateTool `state_map` findings disappear from Warnings. The remaining warnings should therefore be actual fields to inspect, while historical root Horseshoe cards appear only under `Legacy compatibility`.


## v8 semantic authoring pass

V8 does not change the formal validation contract from V7. It enriches that contract so humans and AI systems can reason about FHS geometry instead of merely knowing which keys are legal. A validation-structure comparison with all annotation keywords removed is byte-for-byte equivalent in meaning to V7, and the full regression suite still passes.

The generated JSON Schema now carries the authoring model directly in standard `description` / `examples` annotations plus non-validating `x-fhs-*` metadata:

- A normal `1/1` card is a **100 x 100 logical authoring canvas**. `0,0` is top-left, `50,50` is the centre, and `100,100` is bottom-right.
- The runtime base SVG dimension is 200, so ordinary logical geometry is converted at **2 internal SVG units per logical unit**.
- Aspect ratio extends the logical canvas without changing the reference scale: `2/1` corresponds to 200 x 100 logical units and a 400 x 200 internal viewBox.
- Groups deliberately use **50,50 as the local neutral position**. An item at `50,50` appears exactly at the group position. The runtime relation is `final_x = group.xpos + item.xpos - 50` and the same for y. This keeps newly grouped content visible around the middle instead of forcing authors to design around a `0,0` corner. Nested groups use the same rule recursively.
- Typography is called out as a different unit space. Current FHS text uses `FONT_SIZE=12` inside the 200-unit base SVG viewBox, so **1em is approximately 6 FHS logical units** on the standard card. `2em` is therefore about 12 logical units; an em value must not be interpreted as an ordinary width/height number.
- Legacy/raw SVG values are explicitly distinguished from current logical dimensions. In particular, legacy circle `radius` is a raw SVG dimension while `radius_percent` is the current logical form; preserving a static numeric radius requires `radius_percent = radius / 2`.
- Group, position, dimension, angle, entity-index and layer fields carry `x-fhs-unit` / coordinate-space annotations where their unit is known. `common.styles` contains `x-fhs-style-semantics` for font-size and style-space dimensions.
- Every directly declared public schema property now has a human-readable description. Important spatial and context-sensitive fields also include examples and runtime-verified explanations.

The root schema contains an `x-fhs-authoring` block with the coordinate system, group formulas, typography conversion, dimension spaces, and concrete examples. The same high-value material is also emitted in `fhs.authoring.json` for consumers that prefer a compact authoring index.

`SEMANTIC-COVERAGE.json` records the generated coverage counts for this pass.


## v9 relationship / behavior pass

V9 preserves the complete V8 validation contract and adds one non-validating top-level `x-fhs-relationships` block to the generated schema. The block is a configuration dependency graph for behavior that JSON Schema structure alone cannot explain.

The relationship vocabulary is deliberately small: `provides`, `requires`, `activates`, `overrides`, `fallback`, `references`, and `affects`. Relations use public FHS YAML paths and may target semantic capabilities prefixed with `@`. They explain behavior; they are not additional validation keywords.

The first relationship set covers entity binding, generic layout color stops, horseshoe color modes and scale fallbacks, `state_map`, `same_as`, geometry references (`fit` and dimension references), groups, clips, masks, animations, color-filter cascade, `ref()`, `calc()`, and templates.

The key color-stop distinction is explicit: entity-level `color_stops` provides a passive palette; ordinary layout items activate consumption through `show.item_style`, horseshoes through `show.horseshoe_style` / `show.scale_style`; local item color stops override the selected entity palette.

`tests/behavior-schema-tests.py` checks the vocabulary and representative relations. `VALIDATION-COMPATIBILITY.json` records the annotation-stripped SHA-256 of V8 and V9 and must show equal hashes. The normal regression suite is unchanged and must still pass.


## v10 relationship / AI authoring pass

V10 keeps the v9 validation contract unchanged and expands the non-validating behavior graph.
It adds explicit runtime relationships for state formatting/UOM, gesture fallback and targeting,
horseshoe color-scale/background/marker behavior, group parent/visibility transforms, controls,
and nested composite entity bindings.

The `ai-card-builder/` directory is the portable AI authoring bundle. Its `AGENTS.md` instructs
AI consumers to use the highest matching schema/authoring version in that directory and to treat
the schema, descriptions and `x-fhs-relationships` as the authoritative FHS contract instead of
mixing syntax from other Home Assistant cards.


## v11/v12 source restoration

V12 restores the config-first chain after v11 and the first v12 draft had been refined directly in the generated JSON artifacts.

The reconstruction starts from the last retained YAML source tree (v10), projects the complete v10→v11 and v11→v12 deltas back into the owning YAML modules, and regenerates the machine artifacts from those sources.

Current source/build facts:

- `config-schema/definitions/` contains **48 YAML files** and is authoritative;
- those files contain **111 public/reusable definitions**;
- the generated behavior graph contains **200 relationships**;
- the YAML definition tree is approximately **7,573 lines**;
- the generator is `config-schema/generator/generate.mjs`;
- `config-schema/generated/fhs.schema.json` and `fhs.authoring.json` are build products only.

The original hand-refined v12 JSON was first reproduced with **zero parsed-JSON differences**. Its canonical SHA-256 was `e253c806555968111abb59dfb18ae3758eeb78d1f1a118b533c3e3dffcfd3584` on both sides of that comparison.

Running the older config-first semantic coverage test then exposed ten property schemas introduced during the direct v11/v12 JSON work that lacked descriptions. The restored source adds only those descriptions plus their `x-fhs-semantic-source` annotations. After stripping standard annotations and all `x-fhs-*` metadata, the pre-restoration and final restored v12 schemas have the same canonical validation hash:

`0fa65ed63168563248b116ca0e042989b6218ea5f58440cf8c3d2c10aef1d8e9`

So the final source-restored v12 has the same validation behavior as the first v12 draft, with complete semantic descriptions again.

### Generator correction discovered during restoration

The generator files retained in the v8-v10 bundles were byte-identical, but the generated artifacts in those bundles had subsequently been enriched in ways the retained generator could not fully reproduce. In particular, historical generated `same_as` branches and top-level authoring metadata could not be regenerated from the retained source/generator pair.

V12 therefore makes that previously implicit build behavior explicit:

- definition-level metadata stays on the public generated definition when a `same_as` branch is generated;
- source-controlled `generation.reuse_overrides` records only the historical compatibility delta of generated reuse branches, without duplicating complete tool definitions;
- `authoring_root` allows source-controlled top-level authoring metadata such as release information;
- compatibility deltas are applied **after** reuse derivation so they cannot affect another tool's generated branch.

This is the first generator change required by the source restoration. It is not a change to FHS public YAML syntax; it restores deterministic generation of the already-defined contract.

### Validation

The restored source passes:

- JSON Schema Draft 2020-12 meta-validation;
- the full legacy config-first regression suite;
- `behavior-schema-tests.py` with 200 relationships;
- `semantic-schema-tests.py` with descriptions on every describable generated property;
- `v12-schema-tests.py` covering local FHS entities, slider metadata, JavaScript entity context, and the Sparkline selector matrix.

`VALIDATION-COMPATIBILITY.json` records validation-structure equivalence with the pre-restoration v12. `SEMANTIC-COVERAGE.json` records the current generated semantic coverage.
