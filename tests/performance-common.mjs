import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { chromium } from 'playwright';

export const REPOSITORY_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const BASELINE_COMMIT = '16692192a33dd3423387ea99087c7d4b9447d5f8';
export const INPUT_CLOCK = '2026-09-27T12:00:00.000Z';
export const DEFAULT_VIEWPORT = { width: 1400, height: 1000 };
export const ALL_SCENARIOS = ['P21-A', 'P21-B', 'P21-C', 'P21-D', 'P21-E', 'P21-F', 'P21-G', 'P21-H', 'P21-I'];

export function parseBenchmarkArgs(argv, defaultScenarios = ALL_SCENARIOS) {
  const args = {
    baseline: BASELINE_COMMIT,
    candidate: 'working',
    scenarios: defaultScenarios,
    output: undefined,
  };

  for (const value of argv) {
    const match = value.match(/^--(baseline|candidate|scenario|output)=(.+)$/);
    if (!match) throw new Error(`Unsupported benchmark argument: ${value}`);
    const [, name, setting] = match;
    if (name === 'baseline') args.baseline = setting;
    if (name === 'candidate') args.candidate = setting;
    if (name === 'scenario') args.scenarios = setting.split(',').map((scenario) => scenario.trim());
    if (name === 'output') args.output = resolve(REPOSITORY_ROOT, setting);
  }

  if (!args.scenarios.length || args.scenarios.some((scenario) => !ALL_SCENARIOS.includes(scenario))) {
    throw new Error(`Scenario must be one or more of: ${ALL_SCENARIOS.join(', ')}`);
  }
  if (!args.baseline || !args.candidate) throw new Error('Both baseline and candidate references must be non-empty.');
  return args;
}

function resolveCommit(reference) {
  return execFileSync('git', ['rev-parse', '--verify', `${reference}^{commit}`], {
    cwd: REPOSITORY_ROOT,
    encoding: 'utf8',
  }).trim();
}

export async function loadBuild(reference, role) {
  if (reference === 'working') {
    const bundle = await readFile(resolve(REPOSITORY_ROOT, 'dist/flex-horseshoe-card.js'), 'utf8');
    return {
      role,
      requestedRef: reference,
      commit: resolveCommit('HEAD'),
      bundle,
      workingTreeDirty: execFileSync('git', ['status', '--porcelain'], { cwd: REPOSITORY_ROOT, encoding: 'utf8' }).trim().length > 0,
      bundleSource: 'working dist/flex-horseshoe-card.js',
    };
  }

  const commit = resolveCommit(reference);
  const bundle = execFileSync('git', ['show', `${commit}:dist/flex-horseshoe-card.js`], {
    cwd: REPOSITORY_ROOT,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  });
  return {
    role,
    requestedRef: reference,
    commit,
    bundle,
    workingTreeDirty: false,
    bundleSource: `${commit}:dist/flex-horseshoe-card.js`,
  };
}

export async function launchBenchmarkBrowser() {
  const browser = await chromium.launch({ headless: true });
  return { browser, version: browser.version() };
}

export async function openBundlePage(browser, bundle, viewport = DEFAULT_VIEWPORT) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const browserErrors = [];
  page.on('pageerror', (error) => browserErrors.push({ type: 'pageerror', message: error.message }));
  page.on('console', (message) => {
    if (message.type() === 'error') browserErrors.push({ type: 'console', message: message.text() });
  });
  await page.route('http://fhs.test/**', (route) => route.fulfill({
    contentType: 'text/html',
    body: '<body style="--primary-text-color:#222;--primary-color:#1565c0;--primary-background-color:#fff;--card-background-color:#fff"><main id="host" style="width:1400px"></main></body>',
  }));
  await page.addInitScript((fixedEpoch) => {
    const NativeDate = Date;
    window.benchmarkNow = fixedEpoch;
    window.setBenchmarkNow = (value) => { window.benchmarkNow = value; };
    window.Date = class BenchmarkDate extends NativeDate {
      constructor(...args) { super(...(args.length === 0 ? [window.benchmarkNow] : args)); }
      static now() { return window.benchmarkNow; }
    };
  }, Date.parse(INPUT_CLOCK));
  await page.goto('http://fhs.test/plan21-performance');
  await page.addScriptTag({ type: 'module', content: bundle });
  await page.evaluate(() => customElements.whenDefined('flex-horseshoe-card'));
  return { page, browserErrors };
}

export function requireMethod(owner, method, context) {
  if (!owner || typeof owner[method] !== 'function') {
    throw new Error(`Required benchmark operation '${context}.${method}' is unavailable.`);
  }
  return owner[method].bind(owner);
}

export function wrapCounted(owner, method, counter, context, afterCall = undefined) {
  const original = requireMethod(owner, method, context);
  owner[method] = function countedBenchmarkOperation(...args) {
    counter.calls += 1;
    const result = original(...args);
    if (afterCall) afterCall.call(this, args, result);
    return result;
  };
}

export function requiredMetric(metrics, name) {
  const metric = metrics.find((entry) => entry.name === name);
  if (!metric) throw new Error(`Required Chromium Performance metric '${name}' is unavailable.`);
  return metric.value;
}

export async function beginCdpMeasurement(page) {
  const session = await page.context().newCDPSession(page);
  await session.send('Performance.enable', { timeDomain: 'threadTicks' });
  const start = (await session.send('Performance.getMetrics')).metrics;
  for (const name of ['ThreadTime', 'TaskDuration', 'ScriptDuration', 'LayoutDuration', 'RecalcStyleDuration']) {
    requiredMetric(start, name);
  }
  return {
    session,
    start,
    async finish() {
      const end = (await session.send('Performance.getMetrics')).metrics;
      return Object.fromEntries(['ThreadTime', 'TaskDuration', 'ScriptDuration', 'LayoutDuration', 'RecalcStyleDuration'].map((name) => [
        name,
        1000 * (requiredMetric(end, name) - requiredMetric(start, name)),
      ]));
    },
  };
}

export function makeRunMetadata({ scenario, build, browserVersion, cardCount, rowCount = 0, binsPerHour = null, warmupUpdates, measuredUpdates, workload }) {
  return {
    scenario,
    buildRole: build.role,
    requestedRef: build.requestedRef,
    commit: build.commit,
    isPostBaselineBundle: build.isPostBaselineBundle ?? false,
    bundleSource: build.bundleSource,
    workingTreeDirty: build.workingTreeDirty,
    browser: `Chromium ${browserVersion}`,
    node: process.version,
    viewport: { ...DEFAULT_VIEWPORT, deviceScaleFactor: 1 },
    cardCount,
    rowCountPerCard: rowCount,
    binsPerHour,
    warmupUpdates,
    measuredUpdates,
    inputClock: INPUT_CLOCK,
    workload,
  };
}

export async function saveBenchmarkJson(path, result) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(result, null, 2)}\n`);
}

export function assertNoBrowserErrors(browserErrors, scenario, buildRole) {
  if (browserErrors.length) {
    throw new Error(`${scenario}/${buildRole} produced browser errors: ${JSON.stringify(browserErrors)}`);
  }
}

export async function settleCards(page, cards) {
  await page.evaluate(async (cardCount) => {
    const activeCards = window.plan21.cards.slice(0, cardCount);
    await Promise.all(activeCards.map((card) => card.updateComplete));
    await new Promise((resolveFrame) => requestAnimationFrame(() => requestAnimationFrame(resolveFrame)));
    await Promise.all(activeCards.map((card) => card.updateComplete));
  }, cards.length);
}
