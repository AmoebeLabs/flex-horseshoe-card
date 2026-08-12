import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeFhsInputNumberConfig,
  clampFhsInputNumberValue,
  calculateFhsInputNumberNextValue,
} from '../src/fhs-input-number.js';

const config = (overrides = {}) => ({
  entity: 'fhs_input_number.test',
  initial: 5,
  ...overrides,
});

test('normalizes step and keeps omitted bounds unbounded', () => {
  const normalized = normalizeFhsInputNumberConfig(config());

  assert.equal(normalized.step, 1);
  assert.equal(normalized.min, undefined);
  assert.equal(normalized.max, undefined);
  assert.equal(normalized.scope, 'card');
});

test('validates and preserves explicit min, max, and step', () => {
  const normalized = normalizeFhsInputNumberConfig(config({ min: 0, max: 10, step: 0.5 }));

  assert.equal(normalized.min, 0);
  assert.equal(normalized.max, 10);
  assert.equal(normalized.step, 0.5);
  assert.equal(clampFhsInputNumberValue(normalized, -1), 0);
  assert.equal(clampFhsInputNumberValue(normalized, 11), 10);
});

test('increment and decrement use step and stop at bounds', () => {
  const normalized = normalizeFhsInputNumberConfig(config({ min: 0, max: 10, step: 2 }));

  assert.equal(calculateFhsInputNumberNextValue(normalized, 5, 1), 7);
  assert.equal(calculateFhsInputNumberNextValue(normalized, 9, 1), 10);
  assert.equal(calculateFhsInputNumberNextValue(normalized, 1, -1), 0);
});

test('rejects invalid numeric settings', () => {
  assert.throws(() => normalizeFhsInputNumberConfig(config({ step: 0 })), /step must be a positive number/);
  assert.throws(() => normalizeFhsInputNumberConfig(config({ min: 10, max: 10 })), /min must be lower than max/);
  assert.throws(() => normalizeFhsInputNumberConfig(config({ min: 6 })), /initial must not be lower than min/);
});
