#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
schema = json.loads((ROOT / 'config-schema/generated/fhs.schema.json').read_text())

assert 'x-fhs-authoring' in schema
coord = schema['x-fhs-authoring']['coordinate_system']
assert coord['center'] == [50, 50]
assert '2 internal SVG units' in coord['internal_svg']

groups = schema['x-fhs-authoring']['group_coordinates']
assert groups['neutral_item_position'] == [50, 50]
assert groups['examples'][0]['final'] == [30, 40]
assert groups['examples'][1]['final'] == [40, 35]

typography = schema['x-fhs-authoring']['typography']
assert typography['base_internal_font_size'] == 12
assert typography['base_svg_dimension'] == 200
assert typography['logical_em_equivalent'] == 6

styles = schema['$defs']['common.styles']['x-fhs-style-semantics']['font-size']
assert '1em ~= 6' in styles['fhs_reference']

circle = schema['$defs']['layout.circle']
text = json.dumps(circle)
assert 'radius_percent = radius / 2' in text

# Descriptions on generated definitions, including generated same_as branches.
def walk(node):
    if not isinstance(node, dict):
        return
    props = node.get('properties')
    if isinstance(props, dict):
        for name, child in props.items():
            if isinstance(child, bool):
                # JSON Schema boolean schemas (notably `false`) intentionally forbid a field
                # and therefore have no description object of their own.
                continue
            assert isinstance(child, dict)
            assert child.get('description'), f'missing generated description for property {name}'
            walk(child)
    for keyword in ('allOf', 'anyOf', 'oneOf'):
        branches = node.get(keyword)
        if isinstance(branches, list):
            for branch in branches:
                walk(branch)
    if isinstance(node.get('items'), dict):
        walk(node['items'])

for definition in schema['$defs'].values():
    assert definition.get('description')
    walk(definition)

print('semantic-schema-tests: OK')
