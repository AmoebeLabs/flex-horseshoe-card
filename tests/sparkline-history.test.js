import test from 'node:test';
import assert from 'node:assert/strict';
import SparklineHistory from '../src/sparkline-history.js';

const HOUR_MS = 60 * 60 * 1000;

/** Runs one time calculation against a fixed clock and local time zone. */
const withFixedTime = (isoTime, timeZone, callback) => {
  const NativeDate = globalThis.Date;
  const previousTimeZone = process.env.TZ;
  const fixedNow = new NativeDate(isoTime);

  process.env.TZ = timeZone;
  globalThis.Date = class extends NativeDate {
    constructor(...args) {
      super(...(args.length === 0 ? [fixedNow.getTime()] : args));
    }

    static now() {
      return fixedNow.getTime();
    }
  };

  try {
    callback(NativeDate);
  } finally {
    globalThis.Date = NativeDate;
    if (previousTimeZone === undefined) delete process.env.TZ;
    else process.env.TZ = previousTimeZone;
  }
};

/** Builds the period shape already supplied by sparkline configuration. */
const rollingPeriod = (offset) => ({
  type: 'rolling_window',
  rolling_window: { offset, duration: { hour: 24 } },
});

/** Builds one complete local-calendar day period. */
const calendarPeriod = (offset) => ({
  type: 'calendar',
  calendar: { period: 'day', offset, duration: { hour: 24 } },
});

/** Creates one History owner for a normalized Series item. */
const historyFor = (plotPeriod, item, stateBandsStateMap) => new SparklineHistory(plotPeriod, stateBandsStateMap, [item], true);

/** Builds one bound numeric history Series for request-lifecycle tests. */
const historyItem = (id, entityId, period) => ({
  id,
  entity: {
    entity_id: entityId,
    state: '12',
    last_changed: '2026-09-12T12:00:00.000Z',
  },
  entityConfig: {},
  rows: [],
  config: {
    id,
    period,
    history: {},
    sparkline: { show: { chart_type: 'line' } },
  },
});

/** Exposes explicit completion controls for overlapping HA request tests. */
const deferredRequest = () => {
  let accept;
  let reject;
  const promise = new Promise((resolve, rejectPromise) => {
    accept = resolve;
    reject = rejectPromise;
  });
  return { promise, accept, reject };
};

test('rolling current history uses the current shared plot and source window', () => {
  withFixedTime('2026-09-12T12:30:00.000Z', 'UTC', () => {
    const item = { id: 'default', config: { period: rollingPeriod(0) } };
    const history = historyFor(rollingPeriod(0), item, {});
    const range = history.getSeriesRange(item);

    assert.equal(range.plotStart.toISOString(), '2026-09-11T12:30:00.000Z');
    assert.equal(range.plotEnd.toISOString(), '2026-09-12T12:30:00.000Z');
    assert.equal(range.sourceStart.toISOString(), range.plotStart.toISOString());
    assert.equal(range.sourceEnd.toISOString(), range.plotEnd.toISOString());
    assert.equal(range.sourceRangeIsActive, true);
  });
});

test('a series rolling offset selects yesterday and projects it onto the shared current window', () => {
  withFixedTime('2026-09-12T12:30:00.000Z', 'UTC', () => {
    const item = {
      id: 'yesterday',
      entity: { state: '13', last_changed: '2026-09-12T12:00:00.000Z' },
      entityConfig: {},
      config: {
        period: rollingPeriod(-1),
        sparkline: { show: { chart_type: 'line' } },
      },
    };
    const history = historyFor(rollingPeriod(0), item, {});
    const range = history.getSeriesRange(item);
    const rows = history.acceptHistoryRows(item, [{ state: '12', last_changed: '2026-09-11T10:00:00.000Z' }], range);

    assert.equal(range.sourceStart.toISOString(), '2026-09-10T12:30:00.000Z');
    assert.equal(range.sourceEnd.toISOString(), '2026-09-11T12:30:00.000Z');
    assert.equal(range.plotStart.toISOString(), '2026-09-11T12:30:00.000Z');
    assert.equal(range.plotEnd.toISOString(), '2026-09-12T12:30:00.000Z');
    assert.equal(rows[0].source_time, '2026-09-11T10:00:00.000Z');
    assert.equal(rows[0].plot_time, '2026-09-12T10:00:00.000Z');
    assert.equal(range.sourceRangeIsActive, false);
  });
});

test('a parent rolling offset moves both the shared plot and inherited source window', () => {
  withFixedTime('2026-09-12T12:30:00.000Z', 'UTC', () => {
    const item = { id: 'default', config: { period: rollingPeriod(-1) } };
    const history = historyFor(rollingPeriod(-1), item, {});
    const range = history.getSeriesRange(item);

    assert.equal(range.plotStart.toISOString(), '2026-09-10T12:30:00.000Z');
    assert.equal(range.plotEnd.toISOString(), '2026-09-11T12:30:00.000Z');
    assert.equal(range.sourceStart.toISOString(), range.plotStart.toISOString());
    assert.equal(range.sourceEnd.toISOString(), range.plotEnd.toISOString());
    assert.equal(range.sourceRangeIsActive, false);
  });
});

test('combined parent and series rolling offsets retain both absolute source selections', () => {
  withFixedTime('2026-09-12T12:30:00.000Z', 'UTC', () => {
    const item = { id: 'two-days-ago', config: { period: rollingPeriod(-2) } };
    const history = historyFor(rollingPeriod(-1), item, {});
    const range = history.getSeriesRange(item);

    assert.equal(range.plotStart.toISOString(), '2026-09-10T12:30:00.000Z');
    assert.equal(range.plotEnd.toISOString(), '2026-09-11T12:30:00.000Z');
    assert.equal(range.sourceStart.toISOString(), '2026-09-09T12:30:00.000Z');
    assert.equal(range.sourceEnd.toISOString(), '2026-09-10T12:30:00.000Z');
  });
});

[
  ['spring DST day contains 23 real hours', '2026-03-29T12:00:00.000+02:00', 23],
  ['autumn DST day contains 25 real hours', '2026-10-25T12:00:00.000+01:00', 25],
].forEach(([name, now, elapsedHours]) => {
  test(`calendar ${name}`, () => {
    withFixedTime(now, 'Europe/Amsterdam', () => {
      const item = { id: 'default', config: { period: calendarPeriod(0) } };
      const history = historyFor(calendarPeriod(0), item, {});
      const range = history.getSeriesRange(item);

      assert.equal(range.plotStart.getHours(), 0);
      assert.equal(range.plotEnd.getHours(), 0);
      assert.equal((range.plotEnd.getTime() - range.plotStart.getTime()) / HOUR_MS, elapsedHours);
    });
  });
});

test('active history includes a newer current HA sample exactly once', () => {
  const currentEntity = { state: '13', last_changed: '2026-09-12T12:00:00.000Z' };
  const item = {
    id: 'default',
    entity: currentEntity,
    entityConfig: {},
    config: { period: rollingPeriod(0), sparkline: { show: { chart_type: 'line' } } },
  };
  const history = historyFor(rollingPeriod(0), item, {});
  const range = history.getSeriesRange(item);
  const historyRows = [
    { state: '12', last_changed: '2026-09-12T11:00:00.000Z' },
    { state: '13', last_changed: '2026-09-12T12:00:00.000Z' },
  ];

  const rows = history.acceptHistoryRows(item, historyRows, range);

  assert.equal(rows.filter((row) => row.source_time === currentEntity.last_changed).length, 1);
});

test('active rolling pruning follows the parent plot offset', () => {
  withFixedTime('2026-09-12T12:30:00.000Z', 'UTC', () => {
    const item = {
      id: 'today-on-yesterday',
      entity: { state: '13', last_changed: '2026-09-12T12:30:00.000Z' },
      entityConfig: {},
      rows: [],
      config: {
        period: rollingPeriod(0),
        sparkline: { show: { chart_type: 'line' } },
      },
    };
    const history = historyFor(rollingPeriod(-1), item, {});
    const range = history.getSeriesRange(item);
    history.acceptHistoryRows(item, [{ state: '12', last_changed: '2026-09-11T12:30:00.000Z' }], range);

    const statisticsRange = history.pruneActiveRows(item, 4);

    assert.equal(new Date(statisticsRange.start).toISOString(), '2026-09-10T12:45:00.000Z');
    assert.equal(new Date(statisticsRange.end).toISOString(), '2026-09-11T12:30:00.000Z');
  });
});

test('closed historical ranges exclude the current HA sample', () => {
  withFixedTime('2026-09-12T12:30:00.000Z', 'UTC', () => {
    const item = {
      id: 'yesterday',
      entity: { state: '13', last_changed: '2026-09-12T12:00:00.000Z' },
      entityConfig: {},
      config: { period: rollingPeriod(-1), sparkline: { show: { chart_type: 'line' } } },
    };
    const history = historyFor(rollingPeriod(0), item, {});
    const range = history.getSeriesRange(item);
    const rows = history.acceptHistoryRows(item, [{ state: '12', last_changed: '2026-09-11T10:00:00.000Z' }], range);

    assert.deepEqual(rows.map((row) => row.haState), ['12']);
  });
});

test('unknown state-band history is skipped while valid transitions remain', () => {
  const stateBandsStateMap = {
    map: [
      { state: 'off', value: 0 },
      { state: 'on', value: 1 },
    ],
  };
  const item = {
    id: 'states',
    entity: { state: 'on', last_changed: '2026-09-12T12:00:00.000Z' },
    entityConfig: {},
    config: { period: rollingPeriod(-1), sparkline: { show: { chart_type: 'state_bands' } } },
  };
  const history = historyFor(rollingPeriod(0), item, stateBandsStateMap);
  const range = history.getSeriesRange(item);

  const rows = history.acceptHistoryRows(
    item,
    [
      { state: 'off', last_changed: '2026-09-12T10:00:00.000Z' },
      { state: 'unknown', last_changed: '2026-09-12T11:00:00.000Z' },
      { state: 'on', last_changed: '2026-09-12T12:00:00.000Z' },
    ],
    range,
  );

  assert.deepEqual(rows.map((row) => row.haState), ['off', 'on']);
});

test('completed calendar history is reused for the same entity and absolute source day', async () => {
  const item = historyItem('yesterday', 'sensor.energy', calendarPeriod(-1));
  const history = historyFor(calendarPeriod(-1), item, {});
  let apiCalls = 0;
  const hass = {
    callApi() {
      apiCalls += 1;
      return Promise.resolve([[{ state: '10', last_changed: '2026-09-11T12:00:00.000Z' }]]);
    },
  };
  history.bindSeriesEntity(item);

  const firstRequest = history.requestSeriesHistory(item, hass);
  const firstResult = await firstRequest.promise;
  history.finishAcceptedResult(item.id);
  const repeatedRequest = history.requestSeriesHistory(item, hass);

  assert.equal(firstResult.status, 'accepted');
  assert.equal(repeatedRequest.started, false);
  assert.equal(apiCalls, 1);
});

test('an older entity request cannot replace rows accepted for the current entity', async () => {
  const item = historyItem('source', 'sensor.first', rollingPeriod(0));
  const history = historyFor(rollingPeriod(0), item, {});
  const firstRequest = deferredRequest();
  const secondRequest = deferredRequest();
  const requests = [firstRequest, secondRequest];
  const hass = { callApi: () => requests.shift().promise };
  history.bindSeriesEntity(item);

  const firstDecision = history.requestSeriesHistory(item, hass);
  item.entity = {
    entity_id: 'sensor.second',
    state: '22',
    last_changed: '2026-09-12T12:00:00.000Z',
  };
  assert.equal(history.bindSeriesEntity(item), true);
  const secondDecision = history.requestSeriesHistory(item, hass);

  secondRequest.accept([[{ state: '20', last_changed: '2026-09-12T11:00:00.000Z' }]]);
  const secondResult = await secondDecision.promise;
  firstRequest.accept([[{ state: '10', last_changed: '2026-09-12T11:00:00.000Z' }]]);
  const firstResult = await firstDecision.promise;

  assert.equal(secondResult.status, 'accepted');
  assert.equal(firstResult.status, 'stale');
  assert.equal(history.getRows(item.id).at(-1).haState, '22');
});

test('a failed request waits before a later request can recover', async () => {
  const nativeNow = Date.now;
  let now = nativeNow();
  Date.now = () => now;
  const item = historyItem('retry', 'sensor.retry', rollingPeriod(0));
  const history = historyFor(rollingPeriod(0), item, {});
  let apiCalls = 0;
  const hass = {
    callApi() {
      apiCalls += 1;
      if (apiCalls === 1) return Promise.reject(new Error('temporary failure'));
      return Promise.resolve([[{ state: '11', last_changed: '2026-09-12T11:00:00.000Z' }]]);
    },
  };
  history.bindSeriesEntity(item);

  try {
    const failedResult = await history.requestSeriesHistory(item, hass).promise;
    const immediateRetry = history.requestSeriesHistory(item, hass);
    now = failedResult.retryAt;
    const recoveredResult = await history.requestSeriesHistory(item, hass).promise;

    assert.equal(failedResult.status, 'failed');
    assert.equal(immediateRetry.started, false);
    assert.equal(recoveredResult.status, 'accepted');
    assert.equal(apiCalls, 2);
  } finally {
    Date.now = nativeNow;
  }
});

test('a request completed after disconnect is inert', async () => {
  const item = historyItem('disconnect', 'sensor.disconnect', rollingPeriod(0));
  const history = historyFor(rollingPeriod(0), item, {});
  const deferred = deferredRequest();
  const hass = { callApi: () => deferred.promise };
  history.bindSeriesEntity(item);

  const request = history.requestSeriesHistory(item, hass);
  history.disconnected();
  deferred.accept([[{ state: '10', last_changed: '2026-09-12T11:00:00.000Z' }]]);
  const result = await request.promise;

  assert.equal(result.status, 'stale');
  assert.equal(history.hasRows(item.id), false);
  assert.equal(history.requiresHassUpdate(), false);
});

test('a calendar response crossing midnight is stale and requests the new absolute day', async () => {
  const NativeDate = globalThis.Date;
  let fixedNow = new NativeDate('2026-09-12T23:59:00.000Z').getTime();
  globalThis.Date = class extends NativeDate {
    constructor(...args) {
      super(...(args.length === 0 ? [fixedNow] : args));
    }

    static now() {
      return fixedNow;
    }
  };
  const item = historyItem('midnight', 'sensor.midnight', calendarPeriod(0));
  const history = historyFor(calendarPeriod(0), item, {});
  const firstRequest = deferredRequest();
  const secondRequest = deferredRequest();
  const requests = [firstRequest, secondRequest];
  const hass = { callApi: () => requests.shift().promise };
  history.bindSeriesEntity(item);

  try {
    const firstDecision = history.requestSeriesHistory(item, hass);
    fixedNow = new NativeDate('2026-09-13T00:01:00.000Z').getTime();
    item.entity.last_changed = '2026-09-13T00:01:00.000Z';
    firstRequest.accept([[{ state: '10', last_changed: '2026-09-12T23:00:00.000Z' }]]);
    const staleResult = await firstDecision.promise;
    const secondDecision = history.requestSeriesHistory(item, hass);
    secondRequest.accept([[{ state: '11', last_changed: '2026-09-13T00:00:00.000Z' }]]);
    const acceptedResult = await secondDecision.promise;

    assert.equal(staleResult.status, 'stale');
    assert.equal(staleResult.retryImmediately, true);
    assert.equal(secondDecision.started, true);
    assert.equal(acceptedResult.status, 'accepted');
  } finally {
    globalThis.Date = NativeDate;
  }
});

test('a larger requested range keeps accepted rows until matching history arrives', async () => {
  const item = historyItem('expanded', 'sensor.expanded', rollingPeriod(0));
  const history = historyFor(rollingPeriod(0), item, {});
  history.bindSeriesEntity(item);
  history.acceptHistoryRows(
    item,
    [{ state: '10', last_changed: '2026-09-12T11:00:00.000Z' }],
    history.getSeriesRange(item),
  );

  item.config.period = {
    type: 'rolling_window',
    rolling_window: { offset: 0, duration: { hour: 48 } },
  };
  const changes = history.updateConfig(item.config.period, {}, [item], true);
  const requestFacts = history.getRequestFacts(item.id);
  const request = history.requestSeriesHistory(item, {
    callApi: () => Promise.resolve([[{ state: '9', last_changed: '2026-09-11T12:00:00.000Z' }]]),
  });

  assert.equal(changes.periodChanged, true);
  assert.equal(requestFacts.loading, true);
  assert.equal(requestFacts.preserveGraphWhileLoading, true);
  assert.equal(history.hasRows(item.id), true);
  const result = await request.promise;
  assert.equal(result.status, 'accepted');
  assert.equal(result.rebuildGraphConfig, true);
});

test('an unevaluated dynamic duration does not calculate or request a history range', () => {
  const period = {
    type: 'rolling_window',
    rolling_window: { offset: 0 },
  };
  const item = historyItem('dynamic', 'sensor.dynamic', period);
  const history = new SparklineHistory(period, {}, [item], false);
  history.bindSeriesEntity(item);
  const request = history.requestSeriesHistory(item, {
    callApi: () => {
      throw new Error('history request must wait for the evaluated duration');
    },
  });

  assert.equal(request.historyAvailable, false);
  assert.equal(request.started, false);
});
