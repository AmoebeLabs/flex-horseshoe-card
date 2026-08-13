import test from 'node:test';
import assert from 'node:assert/strict';
import SparklineGraphTool from '../src/sparkline-graph-tool.js';

test('accepted history keeps its update flag active through the card pipeline', async () => {
  const tool = Object.create(SparklineGraphTool.prototype);
  const entity = {
    entity_id: 'sensor.active',
    state: '12',
    last_changed: '2026-08-13T10:00:00.000Z',
    last_updated: '2026-08-13T10:00:00.000Z',
  };
  const range = {
    start: new Date('2026-08-12T10:00:00.000Z'),
    end: new Date('2026-08-13T10:00:00.000Z'),
  };
  const updateFlagsSeenByCard = [];
  const hass = {
    callApi: async () => [[entity]],
  };

  Object.assign(tool, {
    cardId: 'test-card',
    config: {
      id: 'history',
      period: {
        type: 'rolling_window',
        rolling_window: { duration: { hour: 24 } },
      },
      history: {},
    },
    entity,
    historyDurationReady: true,
    historyPromise: undefined,
    historySeries: undefined,
    historyPeriodSignature: 'active-period',
    historyEntityId: entity.entity_id,
    historyResynchronizationRequested: false,
    historyLoading: false,
    preserveGraphWhileHistoryLoads: false,
    card: {
      dev: { debug: false },
      _hass: hass,
      resolvedEntityConfigs: [],
      entities: [],
      requestUpdate() {},
      cardTools: { getBySection: () => [tool] },
      cardEntities: { updateSparklineEntities() {} },
      setHass() {
        updateFlagsSeenByCard.push(tool.requiresHassUpdate());
      },
    },
    getHistoryRange: () => range,
    acceptedHistoryContainsRange: () => false,
    buildHistorySeries: (rows) => rows,
    addCurrentEntityToHistory() {},
    updateGraphFromSeries() {},
    clearTooltip() {},
  });

  tool.fetchHistoryIfNeeded(entity);
  await tool.historyPromise;

  assert.deepEqual(updateFlagsSeenByCard, [true]);
  assert.equal(tool.historyResynchronizationRequested, false);
  assert.equal(tool.historyLoading, false);
});
