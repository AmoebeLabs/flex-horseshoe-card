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

/** Supplies inert GraphTool continuations when a test exercises History alone. */
const historyEvents = () => ({
  binBoundaryReached() {},
  seriesHistoryDue() {},
  dayNightHistoryDue() {},
});

/** Creates one History owner for a normalized Series item. */
const historyFor = (plotPeriod, item, stateBandsStateMap) => new SparklineHistory(plotPeriod, stateBandsStateMap, [item], true, false, historyEvents());

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
  withFixedTime('2026-09-12T12:30:00.000Z', 'Etc/UTC', () => {
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
  withFixedTime('2026-09-12T12:30:00.000Z', 'Etc/UTC', () => {
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

test('unchanged prepared history keeps its array identity across HA updates', () => {
  withFixedTime('2026-09-12T12:30:00.000Z', 'Etc/UTC', () => {
    const item = historyItem('temperature', 'sensor.temperature', rollingPeriod(0));
    const history = historyFor(rollingPeriod(0), item, {});
    const range = history.getSeriesRange(item);
    const rows = history.acceptHistoryRows(item, [{ state: '9', last_changed: '2026-09-12T11:00:00.000Z' }], range);

    assert.strictEqual(history.addCurrentEntityState(item, range), rows);
    item.entity = { ...item.entity, state: '13' };
    assert.notStrictEqual(history.addCurrentEntityState(item, range), rows);
  });
});

test('live measurements reuse converted history and retain every sample', () => {
  withFixedTime('2026-09-12T12:30:00.000Z', 'Etc/UTC', () => {
    const item = historyItem('temperature', 'sensor.temperature', rollingPeriod(0));
    const history = historyFor(rollingPeriod(0), item, {});
    const range = history.getSeriesRange(item);
    const firstRows = history.acceptHistoryRows(item, [
      { state: '9', last_changed: '2026-09-12T10:00:00.000Z' },
      { state: '10', last_changed: '2026-09-12T11:00:00.000Z' },
    ], range);
    const sourceRows = history.seriesRecords.get(item.id).sourceRows;

    assert.strictEqual(history.addCurrentEntityState(item, range), firstRows);
    assert.strictEqual(history.seriesRecords.get(item.id).sourceRows, sourceRows);
    item.entity = { ...item.entity, state: '13', last_changed: '2026-09-12T12:20:00.000Z' };
    const appended = history.addCurrentEntityState(item, range);
    assert.deepEqual(appended.map((row) => row.state), [9, 10, 12, 13]);
    firstRows.forEach((row, index) => assert.strictEqual(appended[index], row));

    // A delayed measurement is inserted at its own time, while a correction
    // changes only the measurement at that timestamp.
    item.entity = { ...item.entity, state: '11', last_changed: '2026-09-12T11:30:00.000Z' };
    const delayed = history.addCurrentEntityState(item, range);
    assert.deepEqual(delayed.map((row) => row.state), [9, 10, 11, 12, 13]);
    item.entity = { ...item.entity, state: '11.5' };
    const corrected = history.addCurrentEntityState(item, range);
    assert.deepEqual(corrected.map((row) => row.state), [9, 10, 11.5, 12, 13]);
    assert.strictEqual(corrected[4], appended[3]);
  });
});

test('History delivers accumulated source changes without choosing graph processing', () => {
  withFixedTime('2026-09-12T12:30:00.000Z', 'Etc/UTC', () => {
    const item = historyItem('temperature', 'sensor.temperature', rollingPeriod(0));
    const history = historyFor(rollingPeriod(0), item, {});
    const range = history.getSeriesRange(item);
    const initialRows = history.acceptHistoryRows(item, [{ state: '9', last_changed: '2026-09-12T11:00:00.000Z' }], range);
    const initial = history.takeRowsUpdate(item.id);
    assert.equal(initial.replaced, true);
    assert.strictEqual(initial.rows, initialRows);
    item.entity = { ...item.entity, state: '13', last_changed: '2026-09-12T12:20:00.000Z' };
    history.addCurrentEntityState(item, range);
    item.entity = { ...item.entity, state: '11', last_changed: '2026-09-12T11:30:00.000Z' };
    const rows = history.addCurrentEntityState(item, range);
    const update = history.takeRowsUpdate(item.id);
    assert.equal(update.replaced, false);
    assert.equal(update.changedFrom, Date.parse('2026-09-12T11:30:00.000Z'));
    assert.strictEqual(update.previousRows, initialRows);
    assert.strictEqual(update.rows, rows);
    item.entity = { ...item.entity, state: 'unavailable' };
    history.addCurrentEntityState(item, range);
    const correction = history.takeRowsUpdate(item.id);
    assert.equal(correction.changedFrom, Date.parse('2026-09-12T11:30:00.000Z'));
    assert.equal(correction.rows.some((row) => row.last_changed === item.entity.last_changed), false);
    const unchanged = history.takeRowsUpdate(item.id);
    assert.equal(unchanged.changedFrom, Infinity);
    assert.strictEqual(unchanged.previousRows, unchanged.rows);
  });
});

test('a live measurement publishes only its change without walking two weeks of retained rows', () => {
  withFixedTime('2026-09-12T12:30:00.000Z', 'Etc/UTC', () => {
    const period = { type: 'rolling_window', rolling_window: { offset: 0, duration: { hour: 336 } } };
    const item = historyItem('large-history', 'sensor.temperature', period);
    item.entity.last_changed = '2026-09-12T12:30:00.000Z';
    const history = historyFor(period, item, {});
    const range = history.getSeriesRange(item);
    const response = Array.from({ length: 20160 }, (_, index) => ({
      state: String(index % 40),
      last_changed: new Date(Date.now() - 336 * HOUR_MS + index * 60000).toISOString(),
    }));
    const initial = history.acceptHistoryRows(item, response, range);
    history.takeRowsUpdate(item.id);
    const record = history.seriesRecords.get(item.id);
    let conversionLookups = 0;
    for (const method of ['has', 'get']) {
      const original = record.preparedRowsBySource[method].bind(record.preparedRowsBySource);
      record.preparedRowsBySource[method] = (row) => {
        conversionLookups += 1;
        return original(row);
      };
    }
    for (const method of ['forEach', 'map', 'every', 'sort']) {
      record.sourceRows[method] = () => assert.fail('an ordinary live update must not traverse retained source rows');
    }
    initial.every = () => assert.fail('an ordinary live update must not compare every retained prepared row');
    Object.freeze(initial);

    item.entity = { ...item.entity, state: '13', last_changed: '2026-09-12T12:30:30.000Z' };
    const appended = history.addCurrentEntityState(item, range);
    assert.equal(appended.length, initial.length + 1);
    assert.equal(initial.length, 20161);
    assert.strictEqual(appended[10000], initial[10000]);
    assert.equal(appended.at(-1).state, 13);
    assert.ok(conversionLookups <= 2, 'conversion cache lookups must be bounded by changed rows, not history length');
    assert.strictEqual(history.takeRowsUpdate(item.id).previousRows, initial);
  });
});

test('incremental publication matches complete preparation for corrections, invalid states and delayed values', () => {
  withFixedTime('2026-09-12T12:30:00.000Z', 'Etc/UTC', () => {
    const item = historyItem('corrections', 'sensor.temperature', rollingPeriod(0));
    const history = historyFor(item.config.period, item, {});
    const range = history.getSeriesRange(item);
    const initial = history.acceptHistoryRows(item, [
      { state: '9', last_changed: '2026-09-12T10:00:00.000Z' },
      { state: 'unavailable', last_changed: '2026-09-12T10:30:00.000Z' },
      { state: '10', last_changed: '2026-09-12T11:00:00.000Z' },
    ], range);
    for (const [state, timestamp] of [
      ['11', '2026-09-12T10:45:00.000Z'],
      ['unknown', '2026-09-12T10:45:00.000Z'],
      ['11.5', '2026-09-12T10:45:00.000Z'],
      ['8', '2026-09-12T10:30:00.000Z'],
      ['unavailable', '2026-09-12T11:00:00.000Z'],
      ['13', '2026-09-12T12:20:00.000Z'],
    ]) {
      item.entity = { ...item.entity, state, last_changed: timestamp };
      const incremental = history.addCurrentEntityState(item, range);
      const complete = historyFor(item.config.period, item, {});
      assert.deepEqual(incremental, complete.acceptHistoryRows(item, history.seriesRecords.get(item.id).sourceRows, range));
    }
    assert.deepEqual(initial.map((row) => row.state), [9, 10, 12]);
  });
});

test('equivalent history replacements retain published rows and subsequent corrections remove the correct measurement', () => {
  withFixedTime('2026-09-12T12:30:00.000Z', 'Etc/UTC', () => {
    const item = historyItem('refresh', 'sensor.temperature', rollingPeriod(0));
    const history = historyFor(item.config.period, item, {});
    const range = history.getSeriesRange(item);
    const response = [{ state: '10', last_changed: '2026-09-12T11:00:00.000Z' }];
    const initial = history.acceptHistoryRows(item, response, range);
    assert.strictEqual(history.acceptHistoryRows(item, response.map((row) => ({ ...row })), range), initial);
    item.entity = { ...item.entity, state: 'unavailable', last_changed: response[0].last_changed };
    assert.deepEqual(history.addCurrentEntityState(item, range).map((row) => row.state), [12]);
    assert.deepEqual(initial.map((row) => row.state), [10, 12]);
  });
});

test('pruning removes only expired prepared rows while retaining the first visible state', () => {
  withFixedTime('2026-09-12T12:30:00.000Z', 'Etc/UTC', () => {
    const item = historyItem('expiry', 'sensor.temperature', rollingPeriod(0));
    const history = historyFor(item.config.period, item, {});
    const initial = history.acceptHistoryRows(item, [
      { state: '1', last_changed: '2026-09-11T10:00:00.000Z' },
      { state: 'unavailable', last_changed: '2026-09-11T11:00:00.000Z' },
      { state: '2', last_changed: '2026-09-11T12:20:00.000Z' },
      { state: '3', last_changed: '2026-09-11T12:50:00.000Z' },
      { state: '4', last_changed: '2026-09-12T11:00:00.000Z' },
    ], history.getSeriesRange(item));
    history.takeRowsUpdate(item.id);
    const record = history.seriesRecords.get(item.id);
    const originalGet = record.preparedRowsBySource.get.bind(record.preparedRowsBySource);
    let lookups = 0;
    record.preparedRowsBySource.get = (row) => { lookups += 1; return originalGet(row); };
    Object.freeze(initial);
    history.pruneActiveRows(item, 4);
    assert.equal(lookups, 2, 'only the two expired source rows need preparation lookup');
    assert.deepEqual(history.getRows(item.id).map((row) => row.state), [2, 3, 4, 12]);
    assert.strictEqual(history.getRows(item.id)[0], initial[1]);
    assert.equal(history.takeRowsUpdate(item.id).changedFrom, Infinity);
    assert.deepEqual(initial.map((row) => row.state), [1, 2, 3, 4, 12]);
  });
});

test('categorical live corrections update only the changed state and rebuild when its mapping changes', () => {
  withFixedTime('2026-09-12T12:30:00.000Z', 'Etc/UTC', () => {
    const item = historyItem('pollen', 'sensor.pollen', rollingPeriod(0));
    item.entity.state = 'low';
    item.config.sparkline.show.chart_type = 'state_bands';
    const stateMap = { map: [{ state: 'low', value: 0 }, { state: 'high', value: 1 }] };
    const history = historyFor(item.config.period, item, stateMap);
    const range = history.getSeriesRange(item);
    history.acceptHistoryRows(item, [{ state: 'high', last_changed: '2026-09-12T11:00:00.000Z' }], range);
    item.entity = { ...item.entity, state: 'unknown' };
    assert.deepEqual(history.addCurrentEntityState(item, range).map((row) => row.state), [1]);
    item.entity = { ...item.entity, state: 'high' };
    assert.deepEqual(history.addCurrentEntityState(item, range).map((row) => row.state), [1, 1]);
    stateMap.map[1].value = 2;
    assert.deepEqual(history.buildSeriesRows(item, range).map((row) => row.state), [2, 2]);
  });
});

test('changing a series offset rebuilds its projected timestamps and published rows', () => {
  withFixedTime('2026-09-12T12:30:00.000Z', 'Etc/UTC', () => {
    const item = historyItem('offset-change', 'sensor.temperature', rollingPeriod(0));
    const history = historyFor(rollingPeriod(0), item, {});
    const initialRange = history.getSeriesRange(item);
    const initial = history.acceptHistoryRows(item, [{ state: '10', last_changed: '2026-09-12T11:00:00.000Z' }], initialRange);
    history.takeRowsUpdate(item.id);

    item.config.period.rolling_window.offset = -1;
    const shifted = history.buildSeriesRows(item, history.getSeriesRange(item));
    const update = history.takeRowsUpdate(item.id);

    assert.notStrictEqual(shifted, initial);
    assert.notStrictEqual(shifted[0], initial[0]);
    assert.equal(shifted[0].source_time, '2026-09-12T11:00:00.000Z');
    assert.equal(shifted[0].plot_time, '2026-09-13T11:00:00.000Z');
    assert.equal(update.replaced, true);
    assert.strictEqual(update.previousRows, initial);
    assert.strictEqual(update.rows, shifted);
    assert.strictEqual(history.buildSeriesRows(item, history.getSeriesRange(item)), shifted);
  });
});

test('live calendar projection keeps repeated winter-time measurements ordered after insertion and correction', () => {
  withFixedTime('2026-10-25T03:30:00.000+01:00', 'Europe/Amsterdam', () => {
    const item = historyItem('projected-live', 'sensor.temperature', calendarPeriod(0));
    item.entity.last_changed = '2026-10-25T02:30:00.000Z';
    const history = historyFor(calendarPeriod(-1), item, {});
    const range = history.getSeriesRange(item);
    history.acceptHistoryRows(item, [
      { state: '10', last_changed: '2026-10-25T00:50:00.000Z' },
      { state: '20', last_changed: '2026-10-25T01:10:00.000Z' },
    ], range);
    for (const [state, timestamp] of [['30', '2026-10-25T01:20:00.000Z'], ['40', '2026-10-25T00:50:00.000Z']]) {
      item.entity = { ...item.entity, state, last_changed: timestamp };
      const incremental = history.addCurrentEntityState(item, range);
      const complete = historyFor(calendarPeriod(-1), item, {});
      assert.deepEqual(incremental, complete.acceptHistoryRows(item, history.seriesRecords.get(item.id).sourceRows, range));
    }
    assert.deepEqual(history.getRows(item.id).map((row) => row.state), [20, 30, 40, 12]);
  });
});

test('equal calendar projections retain source-time order through live insertion and correction', () => {
  withFixedTime('2026-10-25T03:30:00.000+01:00', 'Europe/Amsterdam', () => {
    const item = historyItem('equal-projection', 'sensor.temperature', calendarPeriod(0));
    item.entity.state = 'unavailable';
    item.entity.last_changed = '2026-10-25T02:30:00.000Z';
    const history = historyFor(calendarPeriod(-1), item, {});
    const range = history.getSeriesRange(item);
    const initial = history.acceptHistoryRows(item, [{ state: '20', last_changed: '2026-10-25T01:10:00.000Z' }], range);

    item.entity = { ...item.entity, state: '10', last_changed: '2026-10-25T00:10:00.000Z' };
    const inserted = history.addCurrentEntityState(item, range);
    assert.deepEqual(inserted.map((row) => row.state), [10, 20]);
    assert.deepEqual(inserted.map((row) => row.last_changed), ['2026-10-24T00:10:00.000Z', '2026-10-24T00:10:00.000Z']);
    assert.deepEqual(inserted.map((row) => row.source_time), ['2026-10-25T00:10:00.000Z', '2026-10-25T01:10:00.000Z']);

    item.entity = { ...item.entity, state: '21', last_changed: '2026-10-25T01:10:00.000Z' };
    const corrected = history.addCurrentEntityState(item, range);
    assert.deepEqual(corrected.map((row) => row.state), [10, 21]);
    assert.deepEqual(corrected.map((row) => row.source_time), ['2026-10-25T00:10:00.000Z', '2026-10-25T01:10:00.000Z']);
    assert.deepEqual(initial.map((row) => row.state), [20]);
  });
});

test('accepted HA history retains chronological order without sorting or mutating the response', () => {
  class OrderedHistoryRows extends Array {
    sort() { assert.fail('HA history is already ordered'); }
  }
  withFixedTime('2026-09-12T12:30:00.000Z', 'Etc/UTC', () => {
    const item = historyItem('temperature', 'sensor.temperature', rollingPeriod(0));
    const history = historyFor(rollingPeriod(0), item, {});
    const response = Object.freeze(OrderedHistoryRows.of(
      { state: '9', last_changed: '2026-09-12T10:00:00.000Z' },
      { state: '10', last_changed: '2026-09-12T11:00:00.000Z' },
    ));
    const rows = history.acceptHistoryRows(item, response, history.getSeriesRange(item));

    assert.deepEqual(rows.map((row) => row.state), [9, 10, 12]);
    assert.equal(response.length, 2);
    assert.notStrictEqual(history.seriesRecords.get(item.id).sourceRows, response);
  });
});

test('a parent rolling offset moves both the shared plot and inherited source window', () => {
  withFixedTime('2026-09-12T12:30:00.000Z', 'Etc/UTC', () => {
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

test('calendar projection orders the repeated winter-time hour on the shared plot day', () => {
  withFixedTime('2026-10-26T12:00:00.000+01:00', 'Europe/Amsterdam', () => {
    const item = historyItem('yesterday', 'sensor.temperature', calendarPeriod(-1));
    const history = historyFor(calendarPeriod(0), item, {});
    const response = Object.freeze([
      { state: '10', last_changed: '2026-10-25T00:50:00.000Z' },
      { state: '20', last_changed: '2026-10-25T01:10:00.000Z' },
    ]);
    const range = history.getSeriesRange(item);
    const rows = history.acceptHistoryRows(item, response, range);

    assert.deepEqual(rows.map((row) => row.state), [20, 10]);
    assert.deepEqual(rows.map((row) => row.plot_time), ['2026-10-26T01:10:00.000Z', '2026-10-26T01:50:00.000Z']);
    assert.deepEqual([...history.seriesRecords.get(item.id).sourceRows], [...response]);
    assert.strictEqual(history.buildSeriesRows(item, range), rows);
  });
});

test('combined parent and series rolling offsets retain both absolute source selections', () => {
  withFixedTime('2026-09-12T12:30:00.000Z', 'Etc/UTC', () => {
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
  withFixedTime('2026-09-12T12:30:00.000Z', 'Etc/UTC', () => {
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
  withFixedTime('2026-09-12T12:30:00.000Z', 'Etc/UTC', () => {
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

test('sun history and the current forecast become exact day and night segments', async () => {
  const NativeDate = globalThis.Date;
  const fixedNow = new NativeDate('2026-09-02T12:00:00.000Z').getTime();
  globalThis.Date = class extends NativeDate {
    constructor(...args) {
      super(...(args.length === 0 ? [fixedNow] : args));
    }

    static now() {
      return fixedNow;
    }
  };
  const period = calendarPeriod(0);
  const item = historyItem('temperature', 'sensor.temperature', period);
  const history = new SparklineHistory(period, {}, [item], true, true, historyEvents());
  history.bindDayNightEntity({
    state: 'above_horizon',
    last_changed: '2026-09-02T06:13:00.000Z',
    attributes: {
      next_rising: '2026-09-03T06:15:00.000Z',
      next_setting: '2026-09-02T18:47:00.000Z',
    },
  });

  try {
    const request = history.requestDayNightHistory({
      callApi: () => Promise.resolve([[
        { state: 'below_horizon', last_changed: '2026-09-02T00:00:00.000Z' },
        { state: 'above_horizon', last_changed: '2026-09-02T06:13:00.000Z' },
      ]]),
    });
    const result = await request.promise;

    assert.equal(result.status, 'accepted');
    assert.deepEqual(
      history.getDayNightSegments().map((segment) => ({
        state: segment.state,
        start: segment.start.toISOString(),
        end: segment.end.toISOString(),
      })),
      [
        { state: 'night', start: '2026-09-02T00:00:00.000Z', end: '2026-09-02T06:13:00.000Z' },
        { state: 'day', start: '2026-09-02T06:13:00.000Z', end: '2026-09-02T18:47:00.000Z' },
        { state: 'night', start: '2026-09-02T18:47:00.000Z', end: '2026-09-03T00:00:00.000Z' },
      ],
    );
  } finally {
    history.disconnected();
    globalThis.Date = NativeDate;
  }
});

test('represented sun history is reused for the same closed calendar range', async () => {
  const period = calendarPeriod(-1);
  const item = historyItem('temperature', 'sensor.temperature', period);
  const history = new SparklineHistory(period, {}, [item], true, true, historyEvents());
  history.bindDayNightEntity({
    state: 'above_horizon',
    last_changed: '2026-09-12T06:00:00.000Z',
    attributes: {
      next_rising: '2026-09-13T06:00:00.000Z',
      next_setting: '2026-09-12T18:00:00.000Z',
    },
  });
  let apiCalls = 0;
  const hass = {
    callApi() {
      apiCalls += 1;
      return Promise.resolve([[
        { state: 'below_horizon', last_changed: history.getDayNightRange().start.toISOString() },
      ]]);
    },
  };

  try {
    const firstRequest = history.requestDayNightHistory(hass);
    await firstRequest.promise;
    const repeatedRequest = history.requestDayNightHistory(hass);

    assert.equal(repeatedRequest.started, false);
    assert.equal(apiCalls, 1);
  } finally {
    history.disconnected();
  }
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
  assert.equal(history.getRequestFacts(item.id).requestState, 'loading');
  const firstResult = await firstRequest.promise;
  assert.equal(history.getRequestFacts(item.id).requestState, 'loaded');
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
    assert.equal(history.getRequestFacts(item.id).requestState, 'not_loaded');
    const failedRequest = history.requestSeriesHistory(item, hass);
    assert.equal(history.getRequestFacts(item.id).requestState, 'loading');
    const failedResult = await failedRequest.promise;
    assert.equal(history.getRequestFacts(item.id).requestState, 'error');
    const immediateRetry = history.requestSeriesHistory(item, hass);
    assert.equal(history.getRequestFacts(item.id).requestState, 'error');
    now = failedResult.retryAt;
    const recoveredRequest = history.requestSeriesHistory(item, hass);
    assert.equal(history.getRequestFacts(item.id).requestState, 'loading');
    const recoveredResult = await recoveredRequest.promise;
    assert.equal(history.getRequestFacts(item.id).requestState, 'loaded');

    assert.equal(failedResult.status, 'failed');
    assert.equal(immediateRetry.started, false);
    assert.equal(recoveredResult.status, 'accepted');
    assert.equal(apiCalls, 2);
  } finally {
    history.disconnected();
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
  assert.equal(history.getRequestFacts(item.id).requestState, 'loading');
  history.disconnected();
  assert.equal(history.getRequestFacts(item.id).requestState, 'closed');
  deferred.accept([[{ state: '10', last_changed: '2026-09-12T11:00:00.000Z' }]]);
  const result = await request.promise;

  assert.equal(result.status, 'stale');
  assert.equal(history.getRequestFacts(item.id).requestState, 'closed');
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
  const changes = history.updateConfig(item.config.period, {}, [item], true, false);
  const requestFacts = history.getRequestFacts(item.id);
  const request = history.requestSeriesHistory(item, {
    callApi: () => Promise.resolve([[{ state: '9', last_changed: '2026-09-11T12:00:00.000Z' }]]),
  });

  assert.equal(changes.periodChanged, true);
  assert.equal(requestFacts.requestState, 'loading');
  assert.equal(requestFacts.preserveGraphWhileLoading, true);
  assert.equal(history.hasRows(item.id), true);
  const result = await request.promise;
  assert.equal(result.status, 'accepted');
  assert.equal(result.rebuildGraphConfig, true);
});

test('a smaller requested range reuses accepted history without loading again', () => {
  const item = historyItem('reduced', 'sensor.reduced', {
    type: 'rolling_window',
    rolling_window: { offset: 0, duration: { hour: 48 } },
  });
  const history = historyFor(item.config.period, item, {});
  history.bindSeriesEntity(item);
  history.acceptHistoryRows(
    item,
    [{ state: '10', last_changed: '2026-09-12T11:00:00.000Z' }],
    history.getSeriesRange(item),
  );

  item.config.period = {
    type: 'rolling_window',
    rolling_window: { offset: 0, duration: { hour: 1 } },
  };
  history.updateConfig(item.config.period, {}, [item], true, false);
  const request = history.requestSeriesHistory(item, {
    callApi: () => {
      throw new Error('retained history must cover the smaller period');
    },
  });

  assert.equal(request.started, false);
  assert.equal(request.representedRange, true);
  assert.equal(history.getRequestFacts(item.id).requestState, 'loaded');
  assert.equal(history.getRequestFacts(item.id).resynchronizationRequested, false);
});

test('one day to two weeks to one day to two weeks reloads rows discarded by pruning', () => {
  withFixedTime('2026-09-12T12:30:00.000Z', 'Etc/UTC', () => {
    const oneDay = rollingPeriod(0);
    const twoWeeks = {
      type: 'rolling_window',
      rolling_window: { offset: 0, duration: { hour: 336 } },
    };
    const item = historyItem('duration-switch', 'sensor.duration_switch', oneDay);
    const history = historyFor(oneDay, item, {});
    history.bindSeriesEntity(item);
    history.acceptHistoryRows(item, [
      { state: '10', last_changed: '2026-09-12T11:00:00.000Z' },
    ], history.getSeriesRange(item));

    item.config.period = twoWeeks;
    history.updateConfig(twoWeeks, {}, [item], true, false);
    assert.equal(history.getRequestFacts(item.id).requestState, 'loading');
    history.acceptHistoryRows(item, [
      { state: '5', last_changed: '2026-08-30T12:00:00.000Z' },
      { state: '9', last_changed: '2026-09-05T12:00:00.000Z' },
      { state: '10', last_changed: '2026-09-11T16:00:00.000Z' },
      { state: '11', last_changed: '2026-09-12T11:00:00.000Z' },
    ], history.getSeriesRange(item));

    item.config.period = oneDay;
    history.updateConfig(oneDay, {}, [item], true, false);
    assert.equal(history.getRequestFacts(item.id).requestState, 'loaded');
    history.pruneActiveRows(item, 1);
    assert.equal(history.getRows(item.id).some((row) => row.source_time === '2026-08-30T12:00:00.000Z'), false);
    const retainedRequest = history.requestSeriesHistory(item, {
      callApi: () => {
        throw new Error('the current day must still be covered after pruning');
      },
    });
    assert.equal(retainedRequest.started, false);
    assert.equal(retainedRequest.representedRange, true);

    history.updateConfig(oneDay, {}, [item], true, false);
    assert.equal(history.getRequestFacts(item.id).requestState, 'loaded');

    item.config.period = twoWeeks;
    history.updateConfig(twoWeeks, {}, [item], true, false);
    assert.equal(history.getRequestFacts(item.id).requestState, 'loading');
    assert.equal(history.getRequestFacts(item.id).preserveGraphWhileLoading, true);
  });
});

test('an unevaluated dynamic duration does not calculate or request a history range', () => {
  const period = {
    type: 'rolling_window',
    rolling_window: { offset: 0 },
  };
  const item = historyItem('dynamic', 'sensor.dynamic', period);
  const history = new SparklineHistory(period, {}, [item], false, false, historyEvents());
  history.bindSeriesEntity(item);
  const request = history.requestSeriesHistory(item, {
    callApi: () => {
      throw new Error('history request must wait for the evaluated duration');
    },
  });

  assert.equal(request.historyAvailable, false);
  assert.equal(request.started, false);
});

test('an active source schedules the next exact bin boundary inside History', () => {
  const nativeNow = Date.now;
  const nativeSetTimeout = globalThis.setTimeout;
  const nativeClearTimeout = globalThis.clearTimeout;
  const timers = new Map();
  let nextTimer = 1;
  let binBoundaries = 0;
  Date.now = () => new Date('2026-09-12T12:07:30.000Z').getTime();
  globalThis.setTimeout = (callback, delay) => {
    const timer = nextTimer;
    nextTimer += 1;
    timers.set(timer, { callback, delay });
    return timer;
  };
  globalThis.clearTimeout = (timer) => timers.delete(timer);

  const period = rollingPeriod(0);
  const item = historyItem('active', 'sensor.active', period);
  const history = new SparklineHistory(period, {}, [item], true, false, {
    binBoundaryReached() { binBoundaries += 1; },
    seriesHistoryDue() {},
    dayNightHistoryDue() {},
  });

  try {
    history.scheduleTimeBoundaryUpdates('line', '1s', 4);
    const timer = [...timers.values()][0];
    assert.equal(timer.delay, 7 * 60 * 1000 + 30 * 1000 + 10);

    timer.callback();
    assert.equal(binBoundaries, 1);
  } finally {
    history.disconnected();
    Date.now = nativeNow;
    globalThis.setTimeout = nativeSetTimeout;
    globalThis.clearTimeout = nativeClearTimeout;
  }
});

test('calendar refresh uses the next real local midnight across spring DST', () => {
  const nativeSetTimeout = globalThis.setTimeout;
  const nativeClearTimeout = globalThis.clearTimeout;
  const delays = [];
  globalThis.setTimeout = (callback, delay) => {
    delays.push(delay);
    return delays.length;
  };
  globalThis.clearTimeout = () => {};

  try {
    withFixedTime('2026-03-29T00:30:00.000+01:00', 'Europe/Amsterdam', () => {
      const period = calendarPeriod(0);
      const item = historyItem('calendar', 'sensor.calendar', period);
      const history = new SparklineHistory(period, {}, [item], true, false, historyEvents());
      history.scheduleTimeBoundaryUpdates('line', '1s', 1);

      assert.ok(delays.includes(22.5 * HOUR_MS + 10));
      history.disconnected();
    });
  } finally {
    globalThis.setTimeout = nativeSetTimeout;
    globalThis.clearTimeout = nativeClearTimeout;
  }
});

test('a failed Series request emits one retry only when its History timer expires', async () => {
  const nativeNow = Date.now;
  const nativeSetTimeout = globalThis.setTimeout;
  const nativeClearTimeout = globalThis.clearTimeout;
  const timers = new Map();
  const dueSeries = [];
  let nextTimer = 1;
  Date.now = () => new Date('2026-09-12T12:00:00.000Z').getTime();
  globalThis.setTimeout = (callback, delay) => {
    const timer = nextTimer;
    nextTimer += 1;
    timers.set(timer, { callback, delay });
    return timer;
  };
  globalThis.clearTimeout = (timer) => timers.delete(timer);

  const period = rollingPeriod(0);
  const item = historyItem('retry-timer', 'sensor.retry_timer', period);
  const history = new SparklineHistory(period, {}, [item], true, false, {
    binBoundaryReached() {},
    seriesHistoryDue(seriesId) { dueSeries.push(seriesId); },
    dayNightHistoryDue() {},
  });

  try {
    history.bindSeriesEntity(item);
    const result = await history.requestSeriesHistory(item, {
      callApi: () => Promise.reject(new Error('temporary failure')),
    }).promise;
    const timer = [...timers.values()][0];

    assert.equal(result.status, 'failed');
    assert.equal(timer.delay, 30 * 1000);
    assert.deepEqual(dueSeries, []);

    timer.callback();
    assert.deepEqual(dueSeries, ['retry-timer']);
  } finally {
    history.disconnected();
    Date.now = nativeNow;
    globalThis.setTimeout = nativeSetTimeout;
    globalThis.clearTimeout = nativeClearTimeout;
  }
});

test('a bin boundary at midnight leaves the calendar boundary active', () => {
  const NativeDate = globalThis.Date;
  const nativeSetTimeout = globalThis.setTimeout;
  const nativeClearTimeout = globalThis.clearTimeout;
  const fixedNow = new NativeDate('2026-09-12T23:45:00.000Z').getTime();
  const timers = new Map();
  let nextTimer = 1;
  globalThis.Date = class extends NativeDate {
    constructor(...args) {
      super(...(args.length === 0 ? [fixedNow] : args));
    }

    static now() {
      return fixedNow;
    }
  };
  globalThis.setTimeout = (callback, delay) => {
    const timer = nextTimer;
    nextTimer += 1;
    timers.set(timer, { callback, delay });
    return timer;
  };
  globalThis.clearTimeout = (timer) => timers.delete(timer);

  const period = calendarPeriod(0);
  const item = historyItem('midnight-timers', 'sensor.midnight_timers', period);
  const history = new SparklineHistory(period, {}, [item], true, false, historyEvents());

  try {
    history.scheduleTimeBoundaryUpdates('line', '1s', 4);
    const binTimer = history.binBoundaryTimer;
    const calendarTimer = history.calendarRangeTimer;
    assert.equal(timers.get(binTimer).delay, timers.get(calendarTimer).delay);

    const binCallback = timers.get(binTimer).callback;
    timers.delete(binTimer);
    binCallback();

    assert.equal(timers.has(calendarTimer), true);
  } finally {
    history.disconnected();
    globalThis.Date = NativeDate;
    globalThis.setTimeout = nativeSetTimeout;
    globalThis.clearTimeout = nativeClearTimeout;
  }
});

test('a failed day and night request retries through its separate History timer', async () => {
  const nativeNow = Date.now;
  const nativeSetTimeout = globalThis.setTimeout;
  const nativeClearTimeout = globalThis.clearTimeout;
  const timers = new Map();
  let nextTimer = 1;
  let dayNightRequestsDue = 0;
  Date.now = () => new Date('2026-09-12T12:00:00.000Z').getTime();
  globalThis.setTimeout = (callback, delay) => {
    const timer = nextTimer;
    nextTimer += 1;
    timers.set(timer, { callback, delay });
    return timer;
  };
  globalThis.clearTimeout = (timer) => timers.delete(timer);

  const period = rollingPeriod(0);
  const item = historyItem('sun-retry', 'sensor.sun_retry', period);
  const history = new SparklineHistory(period, {}, [item], true, true, {
    binBoundaryReached() {},
    seriesHistoryDue() {},
    dayNightHistoryDue() { dayNightRequestsDue += 1; },
  });
  history.bindDayNightEntity({
    state: 'above_horizon',
    last_changed: '2026-09-12T06:00:00.000Z',
    attributes: {
      next_rising: '2026-09-13T06:01:00.000Z',
      next_setting: '2026-09-12T18:30:00.000Z',
    },
  });

  try {
    const result = await history.requestDayNightHistory({
      callApi: () => Promise.reject(new Error('temporary sun failure')),
    }).promise;
    const timer = [...timers.values()][0];

    assert.equal(result.status, 'failed');
    assert.equal(timer.delay, 30 * 1000);
    assert.equal(dayNightRequestsDue, 0);

    timer.callback();
    assert.equal(dayNightRequestsDue, 1);
  } finally {
    history.disconnected();
    Date.now = nativeNow;
    globalThis.setTimeout = nativeSetTimeout;
    globalThis.clearTimeout = nativeClearTimeout;
  }
});

test('a day and night response completed after disconnect is inert', async () => {
  const period = rollingPeriod(0);
  const item = historyItem('sun-disconnect', 'sensor.sun_disconnect', period);
  const history = new SparklineHistory(period, {}, [item], true, true, historyEvents());
  const deferred = deferredRequest();
  history.bindDayNightEntity({
    state: 'above_horizon',
    last_changed: '2026-09-12T06:00:00.000Z',
    attributes: {
      next_rising: '2026-09-13T06:01:00.000Z',
      next_setting: '2026-09-12T18:30:00.000Z',
    },
  });

  const request = history.requestDayNightHistory({ callApi: () => deferred.promise });
  history.disconnected();
  deferred.accept([[{ state: 'below_horizon', last_changed: '2026-09-11T18:30:00.000Z' }]]);
  const result = await request.promise;

  assert.equal(result.status, 'stale');
  assert.deepEqual(history.getDayNightSegments(), []);
  assert.equal(history.requiresHassUpdate(), false);
});
