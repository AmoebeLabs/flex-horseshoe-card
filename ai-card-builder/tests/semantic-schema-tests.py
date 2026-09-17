#!/usr/bin/env python3
from __future__ import annotations

import importlib.util
import json
import subprocess
import sys
from pathlib import Path

from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parents[1]
SCHEMA_PATH = ROOT / "config-schema/generated/fhs.schema.json"
VALIDATOR_PATH = ROOT / "ha-validator/validate.py"
DASHBOARD_PATH = ROOT / "tests/dashboard.yaml"

schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
Draft202012Validator.check_schema(schema)
validator = Draft202012Validator(schema)

# One card exercises every control discriminator plus runtime/dynamic Sparkline values.
valid_card = {
    "type": "custom:flex-horseshoe-card",
    "entities": [{"entity": "sensor.one"}, {"entity": "sensor.two"}],
    "constants": {
        "base_column": 20,
        "column_1": "calc(base_column + 5)",
        "column_2": "calc(column_1 + 10)",
        "zpos": {"horseshoes": 10},
    },
    "layout": {
        "controls": [
            {"type": "toggle", "show": {"item_variant": "switch", "item_viz": "default", "item_style": "ha"}},
            {"type": "select", "option_map": [{"value": "one"}], "show": {"item_variant": "segmented", "item_viz": "viz_line", "item_style": "outlined_round"}, "viz_line": {}},
            {"type": "number", "show": {"item_variant": "stepper", "item_viz": "buttons", "item_style": "filled_square"}},
            {"type": "button", "show": {"item_variant": "default", "item_viz": "viz_button"}},
            {"type": "slider", "values": [{"entity_index": 0}, {"entity_index": 1}], "value": {"position": "top"}, "interaction": {"update_interval": 200}, "show": {"item_variant": "range", "item_viz": "circular", "item_style": "ha"}},
        ],
        "horseshoes": [{"bar_mode": "[[[ return 'normal'; ]]]", "state_map": {"map": [{"state": "on", "value": 1}]}}],
        "icons": [{"state_map": {"map": [{"state": "on", "icon": "mdi:check"}]}}],
        "texts": [{
            "xpos": 50,
            "ypos": 20,
            "text": "A long label",
            "text_overflow": {"mode": "fit", "fit": {"max_width": 40, "min_font_size": "0.7em"}},
        }],
        "sparklines": [{
            "width": 40,
            "height": 20,
            "zpos": "calc(zpos.horseshoes - 1)",
            "period": {"type": "[[[ return 'rolling_window'; ]]]", "real_time": True, "rolling_window": {"bins": {"density": "[[[ return 'medium'; ]]]"}}},
            "sparkline": {
                "animate": True,
                "styles": {},
                "colorstops_transition": "[[[ return 'smooth'; ]]]",
                "state_map": {"map": [{"state": "low", "value": 0}, {"state": "high", "value": 1}]},
                "show": {"chart_type": "line", "grid": False, "axis": {"x": True, "y": False}},
            },
        }],
    },
}
errors = list(validator.iter_errors(valid_card))
assert not errors, "Valid discriminator/dynamic fixture failed:\n" + "\n".join(e.message for e in errors)


# FHS boolean semantics: booleans may be represented as true/false or numeric 0/1.
for boolean_value in (True, False, 0, 1, "ref(flag)", "calc(1)", "[[[ return 1; ]]]"):
    boolean_card = {
        "type": "custom:flex-horseshoe-card",
        "constants": {"flag": 1},
        "entities": [{"entity": "sensor.one", "disabled": boolean_value}],
    }
    assert not list(validator.iter_errors(boolean_card)), f"valid FHS boolean form rejected: {boolean_value!r}"
for textual_boolean in ("true", "false", "0", "1"):
    boolean_card = {
        "type": "custom:flex-horseshoe-card",
        "entities": [{"entity": "sensor.one", "disabled": textual_boolean}],
    }
    assert list(validator.iter_errors(boolean_card)), f"textual boolean should not be public schema: {textual_boolean!r}"

# Current source tolerates null developer/tickmark config by normalizing it to an empty object.
null_tolerance_card = {
    "type": "custom:flex-horseshoe-card",
    "dev": None,
    "layout": {"horseshoes": [{"horseshoe_tickmarks": None}]},
}
assert not list(validator.iter_errors(null_tolerance_card)), "null normalization supported by current source must validate"

# Current StateTool accepts both object-form format options and its documented/current
# string modes. Keep the public schema explicit rather than accepting arbitrary strings.
state_format_card = {
    "type": "custom:flex-horseshoe-card",
    "entities": [{"entity": "sensor.one"}],
    "layout": {"states": [{"entity_index": 0, "xpos": 50, "ypos": 50, "format": {"raw_state_keep": True}}]},
}
assert not list(validator.iter_errors(state_format_card)), "current item-level state format object must validate"
for state_format in (
    "relative", "datetime", "datetime-short", "date_weekday-short",
    "time-24h", "brightness", "brightness_pct", "duration",
):
    card = {
        "type": "custom:flex-horseshoe-card",
        "entities": [{"entity": "sensor.one"}],
        "layout": {"states": [{"entity_index": 0, "format": state_format}]},
    }
    assert not list(validator.iter_errors(card)), f"current StateTool format string rejected: {state_format}"
invalid_state_format = {
    "type": "custom:flex-horseshoe-card",
    "layout": {"states": [{"format": "not-a-current-state-format"}]},
}
assert list(validator.iter_errors(invalid_state_format)), "arbitrary state format strings must not be public schema"

# StateTool supports state_map, including state_value mappings that translate
# textual states into numeric values used by color-stop rendering.
state_map_card = {
    "type": "custom:flex-horseshoe-card",
    "entities": [{"entity": "sensor.pollen"}],
    "layout": {
        "states": [{
            "id": "temperature",
            "entity_index": 0,
            "show": {"item_style": "colorstop"},
            "state_map": {
                "type": "state_value",
                "map": [
                    {"state": "low", "value": 0.99},
                    {"state": "moderate", "value": 1.99},
                    {"state": "high", "value": 2.99},
                ],
            },
            "color_stops": {"colors": {0: "green", 3: "red"}},
        }],
    },
}
assert not list(validator.iter_errors(state_map_card)), "StateTool state_map must be current valid syntax"

# Horseshoe path is raw authoring syntax: a literal path object or an exact ref(...)
# expression is valid. Python deliberately does not resolve the referenced object.
for path_value in (
    {"type": "rectangle", "width": 80, "height": 60, "start": 0, "end": 2, "direction": "counterclockwise"},
    "ref(path_cw)",
):
    path_card = {
        "type": "custom:flex-horseshoe-card",
        "constants": {
            "path_cw": {"type": "rectangle", "width": "calc(grid_width)", "height": 60, "start": 0, "end": 4},
            "grid_width": 80,
        },
        "layout": {"horseshoes": [{"path": path_value}]},
    }
    assert not list(validator.iter_errors(path_card)), f"valid horseshoe path authoring form rejected: {path_value!r}"
bad_path_card = {
    "type": "custom:flex-horseshoe-card",
    "layout": {"horseshoes": [{"path": "path_cw"}]},
}
assert list(validator.iter_errors(bad_path_card)), "arbitrary horseshoe path strings must remain invalid"

# AI-facing descriptions live in the authoritative definitions and survive schema generation.
path_schema = schema["$defs"]["layout.horseshoePath"]
assert "0=top-left" in path_schema["properties"]["start"]["description"]
assert "counterclockwise" in path_schema["properties"]["direction"]["description"]

# Circle migration is not a pure rename: legacy radius is raw SVG units while
# radius_percent is converted from the 100-unit logical card scale to SVG 200.
circle_source = (ROOT / "config-schema/definitions/layout/circles.yaml").read_text(encoding="utf-8")
assert "radius_percent = radius / 2" in circle_source

# same_as is public partial-override syntax. Required standalone fields may be
# inherited, while supplied overrides and same_as_d<field> still validate.
reuse_card = {
    "type": "custom:flex-horseshoe-card",
    "constants": {"step": 20},
    "layout": {
        "controls": [
            {
                "id": "show-axis-x",
                "type": "toggle",
                "entity_index": 0,
                "xpos": 20,
                "ypos": 50,
                "width": 10,
            },
            {
                "id": "show-fade",
                "same_as": "show-axis-x",
                "entity_index": 1,
                "same_as_dxpos": "calc(step)",
                "visibility": "[[[ return 'visible'; ]]]",
                "label": {"text": "Fade"},
            },
        ],
        "polygons": [
            {"id": "base-poly", "sides": 5, "width": 30, "height": 30},
            {"id": "copy-poly", "same_as": "base-poly", "xpos": 60},
        ],
        "texts": [
            {"id": "base-text", "text": "Base", "xpos": 20, "ypos": 20},
            {"id": "copy-text", "same_as": "base-text", "xpos": 40},
        ],
    },
}
reuse_errors = list(validator.iter_errors(reuse_card))
assert not reuse_errors, "same_as partial override fixture failed:\n" + "\n".join(e.message for e in reuse_errors)

# Nested object overrides are partial too. The inherited rectangle supplies
# fit.section while the copy only changes fit.item_id. A standalone rectangle
# with the same incomplete fit object must remain invalid.
nested_reuse_card = {
    "type": "custom:flex-horseshoe-card",
    "layout": {
        "rectangles": [
            {"id": "min_time", "fit": {"section": "states", "item_id": "min_time"}, "radius": 6},
            {"id": "max_time", "same_as": "min_time", "fit": {"item_id": "max_time"}},
        ],
    },
}
assert not list(validator.iter_errors(nested_reuse_card)), "nested same_as object override must inherit required keys"
standalone_incomplete_fit = {
    "type": "custom:flex-horseshoe-card",
    "layout": {"rectangles": [{"fit": {"item_id": "max_time"}}]},
}
assert list(validator.iter_errors(standalone_incomplete_fit)), "standalone fit must still require section"

# Without same_as the normal required contract remains active.
missing_type_card = {
    "type": "custom:flex-horseshoe-card",
    "layout": {"controls": [{"id": "broken", "xpos": 20}]},
}
assert list(validator.iter_errors(missing_type_card)), "control without type or same_as must remain invalid"

# Delta fields are generated only for known numeric/delta-capable properties.
unknown_delta_card = {
    "type": "custom:flex-horseshoe-card",
    "layout": {
        "controls": [
            {"id": "base", "type": "toggle", "xpos": 20},
            {"id": "copy", "same_as": "base", "same_as_dnot_a_field": 5},
        ],
    },
}
assert list(validator.iter_errors(unknown_delta_card)), "unknown same_as_d suffix must be rejected"

runtime_delta_card = {
    "type": "custom:flex-horseshoe-card",
    "layout": {
        "controls": [
            {"id": "base", "type": "toggle", "xpos": 20},
            {"id": "copy", "same_as": "base", "same_as_dxpos": "[[[ return 5; ]]]"},
        ],
    },
}
assert list(validator.iter_errors(runtime_delta_card)), "same_as_d must be statically numeric, not runtime JavaScript"

# Import utility module and verify the nested calc expression used by real cards.
spec = importlib.util.spec_from_file_location("fhs_validate", VALIDATOR_PATH)
module = importlib.util.module_from_spec(spec)
sys.modules["fhs_validate"] = module
assert spec.loader is not None
spec.loader.exec_module(module)
assert module.safe_calc("zpos.horseshoes - 1", {"zpos": {"horseshoes": 10}}) == 9
resolved_constants = module.resolve_constants({
    "base": 20,
    "column_1": "calc(base + 5)",
    "column_2": "calc(column_1 + 10)",
    "zpos": {"horseshoes": 10},
})
assert resolved_constants["column_2"] == 35
assert module.safe_calc("zpos.horseshoes - 1", {"zpos": module.DEFAULT_ZPOS}) == 399

identity = module.CardIdentity("test", "view", "views[0].cards[0]", module.Origin("test.yaml", 1), None, None, None)

# size, icon_size and icon_size_percent are all current IconTool sizing fields.
# Runtime priority is icon_size_percent > icon_size > size. Combinations remain
# valid but produce shadowing/precedence warnings.
for icon_field, icon_value in (("size", 2), ("icon_size", 2), ("icon_size_percent", 12)):
    icon_card = {
        "type": "custom:flex-horseshoe-card",
        "layout": {"icons": [{"icon": "mdi:check", icon_field: icon_value}]},
    }
    assert not list(validator.iter_errors(icon_card)), f"{icon_field} must be current valid IconTool syntax"
    icon_prov = module.provenance(icon_card, f"icon-{icon_field}.yaml")
    icon_diagnostics = []
    module.SchemaMetadataWalker(schema, validator, icon_diagnostics, identity, icon_prov, False).walk(icon_card)
    assert not any(d.code == "deprecated-field" for d in icon_diagnostics), f"{icon_field} must not be deprecated"

for conflicting_icon in (
    {"size": 2, "icon_size": 3},
    {"size": 2, "icon_size_percent": 12},
    {"icon_size": 3, "icon_size_percent": 12},
):
    conflicting_icon_card = {
        "type": "custom:flex-horseshoe-card",
        "layout": {"icons": [{"icon": "mdi:check", **conflicting_icon}]},
    }
    assert not list(validator.iter_errors(conflicting_icon_card)), "combined icon sizing fields remain schema-valid"
    conflicting_icon_prov = module.provenance(conflicting_icon_card, "icon-conflict.yaml")
    conflicting_icon_diagnostics = []
    module.SchemaMetadataWalker(schema, validator, conflicting_icon_diagnostics, identity, conflicting_icon_prov, False).walk(conflicting_icon_card)
    assert any(d.code == "conflicting-fields" and "takes precedence" in d.message for d in conflicting_icon_diagnostics), \
        f"icon sizing precedence warning missing for {conflicting_icon!r}"

# Control content icons are a different public interface: type: icon consumes
# item.size as a percentage of its content cell. The schema metadata must keep
# this distinction explicit so AI/migration tooling does not rename it.
authoring = json.loads((ROOT / "config-schema/generated/fhs.authoring.json").read_text(encoding="utf-8"))
control_authoring = authoring["layout/controls.yaml"]["control_content"]["icon_item_size"]
assert control_authoring["field"] == "size"
assert "Do not rename" in control_authoring["warning"]

# resolve_static gets the same DEFAULT_ZPOS scope as the JavaScript compiler.
zpos_card = {"layout": {"icons": [{"zpos": "calc(zpos.circles - 1)"}]}}
zpos_prov = module.provenance(zpos_card, "zpos.yaml")
zpos_diagnostics = []
zpos_resolved, _ = module.resolve_static(zpos_card, zpos_prov, zpos_diagnostics, identity)
assert zpos_resolved["layout"]["icons"][0]["zpos"] == 299
assert not any(d.code == "calc-unresolved" for d in zpos_diagnostics)

# An invalid nested field must not cause valid sibling fields to be reported as unknown.
diagnostics = []

pattern_diagnostics = []
pattern_card = {
    "type": "custom:flex-horseshoe-card",
    "layout": {"groups": [{"id": "g", "xpos": 50, "ypos": 50, "entity_index": 0}]},
}
pattern_prov = module.provenance(pattern_card, "pattern.yaml")
module.JsonSchemaAuditor(schema, validator, pattern_diagnostics, identity, pattern_prov, False).audit(pattern_card)
assert any(d.code == "unknown-field" and d.config_path.endswith("entity_index") for d in pattern_diagnostics)
assert not any("^same_as_d" in d.message for d in pattern_diagnostics), "schema regex must never be reported as a YAML field"

# Groups do not own entities or rotation in the current GroupManager contract.
group_invalid_card = {
    "type": "custom:flex-horseshoe-card",
    "layout": {"groups": [{"id": "g", "xpos": 50, "ypos": 50, "entity_index": 0, "rotate": 10}]},
}
group_diagnostics = []
group_prov = module.provenance(group_invalid_card, "group.yaml")
module.JsonSchemaAuditor(schema, validator, group_diagnostics, identity, group_prov, False).audit(group_invalid_card)
assert any(d.code == "unknown-field" and d.config_path.endswith("entity_index") for d in group_diagnostics)
assert any(d.code == "unknown-field" and d.config_path.endswith("rotate") for d in group_diagnostics)
prov = module.provenance(valid_card, "test.yaml")
bad_card = json.loads(json.dumps(valid_card))
bad_card["layout"]["sparklines"][0]["period"]["real_time"] = []
module.JsonSchemaAuditor(schema, validator, diagnostics, identity, prov, False).audit(bad_card)
assert any(d.code == "schema-form" or d.code == "schema-type" for d in diagnostics)
assert not any(d.code == "unknown-field" and d.field in {
    "layout.sparklines[0].xpos",
    "layout.sparklines[0].ypos",
    "layout.sparklines[0].width",
    "layout.sparklines[0].height",
    "layout.sparklines[0].period",
    "layout.sparklines[0].sparkline",
} for d in diagnostics)

# debug_state_map is obsolete debug configuration: accepted for migration reporting,
# but it must be annotated as deprecated rather than reported as unknown.
debug_card = {
    "type": "custom:flex-horseshoe-card",
    "layout": {"horseshoes": [{"debug_state_map": True}]},
}
debug_diagnostics = []
debug_prov = module.provenance(debug_card, "debug.yaml")
module.JsonSchemaAuditor(schema, validator, debug_diagnostics, identity, debug_prov, False).audit(debug_card)
module.SchemaMetadataWalker(schema, validator, debug_diagnostics, identity, debug_prov, False).walk(debug_card)
assert any(d.code == "deprecated-field" and d.config_path == "layout.horseshoes[0].debug_state_map" for d in debug_diagnostics)
assert not any(d.code == "unknown-field" and d.config_path == "layout.horseshoes[0].debug_state_map" for d in debug_diagnostics)

# Summary reports categories only: no grand warning/error total.
import io
from contextlib import redirect_stdout
summary_buffer = io.StringIO()
with redirect_stdout(summary_buffer):
    module.print_summary(219, {"unknown-field": 1}, {}, {"root-horseshoe": 3})
summary_text = summary_buffer.getvalue()
assert "unknown-field" in summary_text and "Legacy compatibility:" in summary_text and "root-horseshoe" in summary_text
assert "Diagnostic groups" not in summary_text
assert "warnings," not in summary_text.lower(), "summary must not print a grand warning total"

# Integration fixture: expected warnings only; no false control/calc/external-root findings.
proc = subprocess.run(
    [sys.executable, str(VALIDATOR_PATH), str(ROOT), "--dashboard", str(DASHBOARD_PATH)],
    check=False,
    text=True,
    capture_output=True,
)
assert proc.returncode == 0, proc.stdout + proc.stderr
out = proc.stdout
assert "old_unused_field" in out
assert "LEGACY [root-horseshoe] legacy root-level horseshoe field 'show' retained for backward compatibility" in out
assert "LEGACY [root-horseshoe] legacy root-level horseshoe field 'color_stops' retained for backward compatibility" in out
assert "Legacy compatibility:" in out
for forbidden in (
    "unknown FHS field 'grid_options'",
    "unknown FHS field 'view_layout'",
    "unknown FHS field 'style'",
    "unknown FHS field 'width'",
    "unknown FHS field 'height'",
    "legacy root-level horseshoe field 'xpos'",
    "legacy root-level horseshoe field 'ypos'",
    "calc-unresolved",
    "expected one of ['switch']",
    "expected one of ['default']",
    "unknown FHS field 'default_entities'",
    "Diagnostic groups:",
):
    assert forbidden not in out, forbidden
assert "Warnings:" in out and "Errors:" in out

print("schema-draft2020-12: OK")
print("control-discriminator-tests: OK")
print("dynamic-value-tests: OK")
print("fhs-boolean-tests: OK")
print("null-normalization-tests: OK")
print("state-format-tests: OK")
print("horseshoe-path-authoring-tests: OK")
print("ai-description-tests: OK")
print("icon-sizing-tests: OK")
print("summary-category-tests: OK")
print("same-as-partial-override-tests: OK")
print("same-as-delta-tests: OK")
print("schema-pattern-diagnostic-tests: OK")
print("group-contract-tests: OK")
print("nested-calc-tests: OK")
print("constant-dependency-tests: OK")
print("default-zpos-calc-tests: OK")
print("unevaluated-cascade-tests: OK")
print("text-fit-tests: OK")
print("sparkline-realtime-boolean-tests: OK")
print("state-map-shared-schema-tests: OK")
print("state-tool-state-map-tests: OK")
print("circle-radius-migration-tests: OK")
print("control-content-icon-size-tests: OK")
print("debug-state-map-migration-tests: OK")
print("ha-root-filter-tests: OK")
print("default-entities-tests: OK")
print("validator-fixture-tests: OK")
