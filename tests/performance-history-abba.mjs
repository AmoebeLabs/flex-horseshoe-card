/**
 * Repeat the unchanged two-week Sparkline workload in baseline/candidate/
 * candidate/baseline order. Keep timing and counter pages separate so a slow
 * browser interval can be compared without changing the measured owner route.
 */
import {
  launchBenchmarkBrowser,
  loadBuild,
  parseBenchmarkArgs,
  saveBenchmarkJson,
} from './performance-common.mjs';
import { runSparklineScenarios } from './performance-sparkline.mjs';

const args = parseBenchmarkArgs(process.argv.slice(2), ['P21-H']);
if (args.scenarios.length !== 1 || args.scenarios[0] !== 'P21-H') {
  throw new Error('The history ABBA diagnostic runs P21-H only.');
}
const baseline = await loadBuild(args.baseline, 'baseline');
const candidate = await loadBuild(args.candidate, 'candidate');
baseline.isPostBaselineBundle = false;
candidate.isPostBaselineBundle = candidate.bundle !== baseline.bundle;
const { browser, version } = await launchBenchmarkBrowser();
const result = {
  schemaVersion: 1,
  diagnostic: 'Plan 21 P21-H order-balanced repeat',
  recordedAt: new Date().toISOString(),
  baselineCommit: baseline.commit,
  candidateCommit: candidate.commit,
  order: ['baseline', 'candidate', 'candidate', 'baseline'],
  execution: {
    node: process.version,
    browser: `Chromium ${version}`,
    arguments: process.argv.slice(2),
    timingPolicy: 'Existing P21-H workload unchanged; fresh unwrapped timing and counter pages for every run.',
  },
  runs: [],
};

try {
  // Reuse the permanent H runner, including its clock, rows, warm-ups, delays
  // and measured deliveries. Only the bundle order differs from the A-I run.
  for (const [index, build] of [baseline, candidate, candidate, baseline].entries()) {
    const [run] = await runSparklineScenarios(browser, version, build, ['P21-H']);
    result.runs.push({ order: index + 1, role: build.role, ...run });
    process.stdout.write(`${JSON.stringify({
      order: index + 1,
      role: build.role,
      commit: build.commit,
      warmupMeanMs: run.timing.warmupMeanMs,
      meanMs: run.timing.timing.meanUpdateMs,
      medianMs: run.timing.timing.medianUpdateMs,
      cpuMs: run.timing.timing.cpuMs,
      operations: run.counterPass.operations,
    })}\n`);
  }
} finally {
  await browser.close();
}

if (args.output) await saveBenchmarkJson(args.output, result);
