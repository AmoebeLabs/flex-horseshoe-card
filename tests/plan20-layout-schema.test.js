import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { DEFAULT_RENDER_INDEX, DEFAULT_ZPOS } from '../src/const.js';
import { VISIBLE_LAYOUT_SECTIONS } from '../src/layout-sections.js';

test('layout sections and active schemas expose the current horseshoe section', () => {
  assert.ok(VISIBLE_LAYOUT_SECTIONS.includes('horseshoes'));
  assert.equal(DEFAULT_ZPOS.horseshoes, 400);
  assert.equal(DEFAULT_RENDER_INDEX.horseshoes, 400000);
  assert.ok(!VISIBLE_LAYOUT_SECTIONS.includes('horseshoes_v2'));
  assert.equal(Object.hasOwn(DEFAULT_ZPOS, 'horseshoes_v2'), false);
  assert.equal(Object.hasOwn(DEFAULT_RENDER_INDEX, 'horseshoes_v2'), false);

  // Check each currently consumed schema copy, including nested compound layouts.
  // Historical schema versions retain their original descriptions.
  for (const schemaPath of [
    '../ai-card-builder/config-schema/generated/fhs.schema.json',
    '../ai-card-builder/fhs.schema.v12.json',
    '../ai-card-builder/ha-validator/home-assistant-root-fields.json',
  ]) {
    const source = readFileSync(new URL(schemaPath, import.meta.url), 'utf8');
    const schema = JSON.parse(source);
    assert.equal(source.includes('horseshoes_v2'), false, schemaPath);
    assert.equal(schema.$defs['card.layout'].properties.horseshoes.$ref, '#/$defs/layout.horseshoes', schemaPath);
    assert.equal(schema.$defs['layout.compound'].properties.horseshoes.items.$ref, '#/$defs/layout.horseshoe', schemaPath);
  }
});
