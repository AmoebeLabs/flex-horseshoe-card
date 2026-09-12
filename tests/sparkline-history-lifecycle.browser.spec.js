import { readFile } from 'node:fs/promises';

import { expect, test } from '@playwright/test';

test('History cancels every owned timer when its card disconnects', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.route('http://fhs.test/**', async (route) => {
    const pathname = new URL(route.request().url()).pathname;

    if (pathname === '/sparkline-history-lifecycle-fixture') {
      await route.fulfill({
        contentType: 'text/html',
        body: `
          <script type="module">
            import SparklineHistory from '/src/sparkline-history.js';

            const activeTimers = new Map();
            let nextTimer = 1;
            const events = [];
            const nativeSetTimeout = globalThis.setTimeout;
            const nativeClearTimeout = globalThis.clearTimeout;

            globalThis.setTimeout = (callback, delay) => {
              const timer = nextTimer;
              nextTimer += 1;
              activeTimers.set(timer, { callback, delay });
              return timer;
            };
            globalThis.clearTimeout = (timer) => activeTimers.delete(timer);

            const period = {
              type: 'calendar',
              calendar: {
                period: 'day',
                offset: 0,
                duration: { hour: 24 },
              },
            };
            const item = {
              id: 'temperature',
              entity: { entity_id: 'sensor.temperature' },
              entityConfig: {},
              config: {
                period,
                history: { refresh_interval: '1m' },
              },
            };
            const history = new SparklineHistory(period, {}, [item], true, true, {
              binBoundaryReached: () => events.push('bin'),
              seriesHistoryDue: () => events.push('series'),
              dayNightHistoryDue: () => events.push('day-night'),
            });

            history.bindSeriesEntity(item);
            history.bindDayNightEntity({
              state: 'above_horizon',
              last_changed: '2026-09-12T06:00:00.000Z',
              attributes: {
                next_rising: '2026-09-13T06:01:00.000Z',
                next_setting: '2026-09-12T18:30:00.000Z',
              },
            });
            history.scheduleTimeBoundaryUpdates('line', '1s', 4);
            history.scheduleSeriesHistoryRequest(item, Date.now() + 60 * 1000);

            const dayNightRequest = history.requestDayNightHistory({
              callApi: () => Promise.reject(new Error('temporary sun failure')),
            });
            const dayNightResult = await dayNightRequest.promise;
            const timerCountBeforeDisconnect = activeTimers.size;

            history.disconnected();
            window.sparklineHistoryLifecycleResult = {
              dayNightStatus: dayNightResult.status,
              timerCountBeforeDisconnect,
              timerCountAfterDisconnect: activeTimers.size,
              binTimer: history.binBoundaryTimer,
              calendarTimer: history.calendarRangeTimer,
              seriesTimer: history.seriesRecords.get(item.id).requestTimer,
              dayNightTimer: history.dayNightRecord.requestTimer,
              events,
            };

            globalThis.setTimeout = nativeSetTimeout;
            globalThis.clearTimeout = nativeClearTimeout;
          </script>
        `,
      });
      return;
    }

    const source = await readFile(new URL(`..${pathname}`, import.meta.url), 'utf8');
    await route.fulfill({ contentType: 'text/javascript', body: source });
  });

  await page.goto('http://fhs.test/sparkline-history-lifecycle-fixture');
  await page.waitForFunction(() => window.sparklineHistoryLifecycleResult !== undefined);

  expect(pageErrors).toEqual([]);
  expect(await page.evaluate(() => window.sparklineHistoryLifecycleResult)).toEqual({
    dayNightStatus: 'failed',
    timerCountBeforeDisconnect: 4,
    timerCountAfterDisconnect: 0,
    binTimer: undefined,
    calendarTimer: undefined,
    seriesTimer: undefined,
    dayNightTimer: undefined,
    events: [],
  });
});

test('a pending refresh keeps retained tooltip interaction active', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.route('http://fhs.test/**', async (route) => {
    const pathname = new URL(route.request().url()).pathname;

    if (pathname === '/sparkline-tooltip-state-fixture') {
      await route.fulfill({
        contentType: 'text/html',
        body: `
          <div id="tooltip" style="display:block"></div>
          <svg><line id="indicator" style="visibility:visible"></line></svg>
          <script type="module">
            import SparklineGraphTool from '/src/sparkline-graph-tool.js';

            const primary = { requestState: 'loaded', dataState: 'has_data' };
            const comparison = { requestState: 'loading', dataState: 'has_data' };
            const tooltip = document.getElementById('tooltip');
            const indicator = document.getElementById('indicator');
            const tool = Object.assign(Object.create(SparklineGraphTool.prototype), {
              config: { sparkline: { show: { chart_type: 'line' } } },
              sparklineSeries: {
                items: [primary, comparison],
                primaryItem: primary,
                dataState: 'has_data',
              },
              tooltip: { index: 4 },
              tooltipVisible: true,
              activePoint: 4,
              activeX: 36,
              elements: { tooltip, activeIndicator: indicator },
              mouseEventToPoint: () => ({ x: 20, y: 20 }),
              pointToGraphX: (point) => point.x,
              snapPointerXToGraphPoint: (x) => x,
              getPointIndexFromX: () => 2,
              updateTooltipFromPointIndex() {
                this.tooltip = { index: 2, title: '10:00' };
                this.tooltipVisible = true;
              },
              updateTooltipContentDom() {},
              updateTooltipPositionDom() {},
            });

            tool.updateActivePointer(new PointerEvent('pointermove', { clientX: 20, clientY: 20 }));
            window.sparklineTooltipStateResult = {
              tooltipVisible: tool.tooltipVisible,
              activePoint: tool.activePoint,
              activeX: tool.activeX,
              tooltipDisplay: tooltip.style.display,
              indicatorVisibility: indicator.style.visibility,
            };
          </script>
        `,
      });
      return;
    }

    const source = await readFile(new URL(`..${pathname}`, import.meta.url), 'utf8');
    await route.fulfill({ contentType: 'text/javascript', body: source });
  });

  await page.goto('http://fhs.test/sparkline-tooltip-state-fixture');
  await page.waitForFunction(() => window.sparklineTooltipStateResult !== undefined);

  expect(pageErrors).toEqual([]);
  expect(await page.evaluate(() => window.sparklineTooltipStateResult)).toEqual({
    tooltipVisible: true,
    activePoint: 4,
    activeX: 20,
    tooltipDisplay: 'block',
    indicatorVisibility: 'visible',
  });
});
