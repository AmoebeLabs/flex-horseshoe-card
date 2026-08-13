import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeFhsInputSelectConfig } from '../src/fhs-input-select.js';

const config = (overrides = {}) => ({
  entity: 'fhs_input_select.test',
  options: ['line', 'area', 'bar'],
  ...overrides,
});

test('uses the first option as initial state and publishes select defaults', () => {
  const normalized = normalizeFhsInputSelectConfig(config());

  assert.equal(normalized.initial, 'line');
  assert.equal(normalized.scope, 'card');
  assert.equal(normalized.persist, false);
  assert.equal(normalized.local, true);
  assert.equal(normalized.icon, 'mdi:form-dropdown');
});

test('preserves a valid explicit initial option', () => {
  const normalized = normalizeFhsInputSelectConfig(config({ initial: 'bar', scope: 'global', persist: true }));

  assert.equal(normalized.initial, 'bar');
  assert.equal(normalized.scope, 'global');
  assert.equal(normalized.persist, true);
});

test('rejects invalid option lists and initial states', () => {
  assert.throws(() => normalizeFhsInputSelectConfig(config({ options: [] })), /non-empty array/);
  assert.throws(() => normalizeFhsInputSelectConfig(config({ options: ['line', ''] })), /non-empty strings/);
  assert.throws(() => normalizeFhsInputSelectConfig(config({ options: ['line', 'line'] })), /unique/);
  assert.throws(() => normalizeFhsInputSelectConfig(config({ initial: 'dots' })), /initial must be one of its options/);
});
