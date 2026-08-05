import test from 'node:test';
import assert from 'node:assert/strict';
import Compounds from '../compounds.js';
import SameAs from '../same-as.js';

const entityAddress = (slot, index) => ({
  type: 'entity_address',
  slot,
  index,
});

/**
 * Verifies that SameAs keeps numeric legacy indices flat and increments
 * named slot addresses within their own slot.
 */
test('same_as_dentity_index preserves flat and named entity addresses', () => {
  const config = {
    layout: {
      groups: [],
      lines: [
        {
          id: 'flat-0',
          entity_index: entityAddress('flat', 7),
        },
        {
          id: 'flat-1',
          same_as: 'flat-0',
          same_as_dentity_index: 1,
        },
        {
          id: 'slot-0',
          entity_index: entityAddress('sensors', 0),
        },
        {
          id: 'slot-1',
          same_as: 'slot-0',
          same_as_dentity_index: 1,
        },
      ],
    },
  };

  SameAs.compile(config);

  assert.deepEqual(config.layout.lines[1].entity_index, entityAddress('flat', 8));
  assert.deepEqual(config.layout.lines[3].entity_index, entityAddress('sensors', 1));
});

/**
 * Verifies that slot-aware entity addresses survive compound expansion and
 * SameAs compilation before the main card resolves them to flat indices.
 */
test('compound children retain slot addresses through compilation', () => {
  const config = {
    layout: {
      groups: [],
      lines: [],
      compounds: [
        {
          id: 'sensor-controls',
          lines: [
            {
              id: 'sensor-0',
              entity_index: entityAddress('sensors', 0),
            },
            {
              id: 'sensor-1',
              same_as: 'sensor-0',
              same_as_dentity_index: 1,
            },
          ],
        },
      ],
    },
  };

  Compounds.compile(config);
  SameAs.compile(config);

  assert.deepEqual(config.layout.lines[0].entity_index, entityAddress('sensors', 0));
  assert.deepEqual(config.layout.lines[1].entity_index, entityAddress('sensors', 1));
});
