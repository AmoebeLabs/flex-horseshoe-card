import test from 'node:test';
import assert from 'node:assert/strict';
import SparklineGraphTool from '../src/sparkline-graph-tool.js';

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
    process.env.TZ = previousTimeZone;
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

test('rolling current history uses the current shared plot and source window', () => {
  withFixedTime('2026-09-12T12:30:00.000Z', 'UTC', () => {
    const tool = Object.create(SparklineGraphTool.prototype);
    tool.config = { period: rollingPeriod(0) };

    const range = tool.getHistoryRange({ config: { period: rollingPeriod(0) } });

    assert.equal(range.plotStart.toISOString(), '2026-09-11T12:30:00.000Z');
    assert.equal(range.plotEnd.toISOString(), '2026-09-12T12:30:00.000Z');
    assert.equal(range.sourceStart.toISOString(), range.plotStart.toISOString());
    assert.equal(range.sourceEnd.toISOString(), range.plotEnd.toISOString());
    assert.equal(range.sourceRangeIsActive, true);
  });
});

test('a series rolling offset selects yesterday and projects it onto the shared current window', () => {
  withFixedTime('2026-09-12T12:30:00.000Z', 'UTC', () => {
    const tool = Object.create(SparklineGraphTool.prototype);
    tool.config = { period: rollingPeriod(0) };
    const item = {
      config: {
        period: rollingPeriod(-1),
        sparkline: { show: { chart_type: 'line' } },
      },
    };

    const range = tool.getHistoryRange(item);
    const rows = tool.buildHistorySeries(item, [{ state: '12', last_changed: '2026-09-11T10:00:00.000Z' }], {}, range);

    assert.equal(range.sourceStart.toISOString(), '2026-09-10T12:30:00.000Z');
    assert.equal(range.sourceEnd.toISOString(), '2026-09-11T12:30:00.000Z');
    assert.equal(range.plotStart.toISOString(), '2026-09-11T12:30:00.000Z');
    assert.equal(range.plotEnd.toISOString(), '2026-09-12T12:30:00.000Z');
    assert.equal(rows[0].source_time, '2026-09-11T10:00:00.000Z');
    assert.equal(rows[0].plot_time, '2026-09-12T10:00:00.000Z');
    assert.equal(range.sourceRangeIsActive, false);
  });
});

test('a parent rolling offset moves both the shared plot and inherited source window', { todo: 'fixed by Plan 02 SparklineHistory time ownership' }, () => {
  withFixedTime('2026-09-12T12:30:00.000Z', 'UTC', () => {
    const tool = Object.create(SparklineGraphTool.prototype);
    tool.config = { period: rollingPeriod(-1) };

    const range = tool.getHistoryRange({ config: { period: rollingPeriod(-1) } });

    assert.equal(range.plotStart.toISOString(), '2026-09-10T12:30:00.000Z');
    assert.equal(range.plotEnd.toISOString(), '2026-09-11T12:30:00.000Z');
    assert.equal(range.sourceStart.toISOString(), range.plotStart.toISOString());
    assert.equal(range.sourceEnd.toISOString(), range.plotEnd.toISOString());
    assert.equal(range.sourceRangeIsActive, false);
  });
});

test('combined parent and series rolling offsets retain both absolute source selections', { todo: 'fixed by Plan 02 SparklineHistory time ownership' }, () => {
  withFixedTime('2026-09-12T12:30:00.000Z', 'UTC', () => {
    const tool = Object.create(SparklineGraphTool.prototype);
    tool.config = { period: rollingPeriod(-1) };

    const range = tool.getHistoryRange({ config: { period: rollingPeriod(-2) } });

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
  test(`calendar ${name}`, { todo: 'fixed by Plan 02 local-calendar boundaries' }, () => {
    withFixedTime(now, 'Europe/Amsterdam', () => {
      const tool = Object.create(SparklineGraphTool.prototype);
      tool.config = { period: calendarPeriod(0) };

      const range = tool.getHistoryRange({ config: { period: calendarPeriod(0) } });

      assert.equal(range.plotStart.getHours(), 0);
      assert.equal(range.plotEnd.getHours(), 0);
      assert.equal((range.plotEnd.getTime() - range.plotStart.getTime()) / HOUR_MS, elapsedHours);
    });
  });
});

test('active history includes a newer current HA sample exactly once', { todo: 'fixed by Plan 02 history record ownership' }, () => {
  const tool = Object.create(SparklineGraphTool.prototype);
  const item = { config: { sparkline: { show: { chart_type: 'line' } } } };
  const currentEntity = { state: '13', last_changed: '2026-09-12T12:00:00.000Z' };
  const range = { rollingOffsetDays: 0, sourceRangeIsActive: true };
  const historyRows = [
    { state: '12', last_changed: '2026-09-12T11:00:00.000Z' },
    { state: '13', last_changed: '2026-09-12T12:00:00.000Z' },
  ];

  const rows = tool.buildHistorySeries(item, historyRows, currentEntity, range);

  assert.equal(rows.filter((row) => row.source_time === currentEntity.last_changed).length, 1);
});

test('unknown state-band history is skipped while valid transitions remain', { todo: 'fixed by Plan 02 history record ownership' }, () => {
  const tool = Object.create(SparklineGraphTool.prototype);
  tool.stateBandsStateMap = {
    map: [
      { state: 'off', value: 0 },
      { state: 'on', value: 1 },
    ],
  };
  const item = { config: { sparkline: { show: { chart_type: 'state_bands' } } } };
  const range = { rollingOffsetDays: 0, sourceRangeIsActive: false };

  const rows = tool.buildHistorySeries(
    item,
    [
      { state: 'off', last_changed: '2026-09-12T10:00:00.000Z' },
      { state: 'unknown', last_changed: '2026-09-12T11:00:00.000Z' },
      { state: 'on', last_changed: '2026-09-12T12:00:00.000Z' },
    ],
    {},
    range,
  );

  assert.deepEqual(rows.map((row) => row.haState), ['off', 'on']);
});
