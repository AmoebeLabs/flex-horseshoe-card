import {
  ALL_SCENARIOS,
  BASELINE_COMMIT,
  launchBenchmarkBrowser,
  loadBuild,
  parseBenchmarkArgs,
  REPOSITORY_ROOT,
  saveBenchmarkJson,
} from './performance-common.mjs';
import { runUpdateScenarios } from './performance-update-scenarios.mjs';
import { runSparklineScenarios } from './performance-sparkline.mjs';
import { runHorseshoeScenarios } from './performance-horseshoe-runner.mjs';
import { resolve } from 'node:path';

export async function runPlan21Benchmark(argv = process.argv.slice(2), defaultScenarios = ALL_SCENARIOS) {
  const args = parseBenchmarkArgs(argv, defaultScenarios);
  const { browser, version: browserVersion } = await launchBenchmarkBrowser();
  const result = {
    schemaVersion: 1,
    plan: 'Plan 21',
    recordedAt: new Date().toISOString(),
    baselineCommit: args.baseline,
    candidateRef: args.candidate,
    scenarios: args.scenarios,
    runs: { baseline: [], candidate: [] },
    execution: {
      node: process.version,
      browser: `Chromium ${browserVersion}`,
      command: `node ${process.argv[1].replace(`${REPOSITORY_ROOT}/`, '')} ${argv.join(' ')}`.trim(),
      timingPolicy: 'Unwrapped page for wall/CDP timing; separate fresh page for operation counters on A-H. P21-I records direct owner timings and mapper/cache operations.',
    },
  };

  try {
    const baselineBuild = await loadBuild(args.baseline, 'baseline');
    const candidateBuild = await loadBuild(args.candidate, 'candidate');
    baselineBuild.isPostBaselineBundle = false;
    candidateBuild.isPostBaselineBundle = candidateBuild.bundle !== baselineBuild.bundle;
    for (const build of [baselineBuild, candidateBuild]) {
      const scenarios = args.scenarios.filter((scenario) => ['P21-A', 'P21-B', 'P21-C', 'P21-D', 'P21-E', 'P21-F'].includes(scenario));
      result.runs[build.role].push(...await runUpdateScenarios(browser, browserVersion, build, scenarios));
      result.runs[build.role].push(...await runSparklineScenarios(browser, browserVersion, build, args.scenarios));
      result.runs[build.role].push(...await runHorseshoeScenarios(browser, browserVersion, build, args.scenarios));
    }
  } finally {
    await browser.close();
  }

  if (args.output) await saveBenchmarkJson(args.output, result);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  return result;
}

const invokedPath = process.argv[1] && resolve(process.argv[1]);
if (invokedPath === resolve(new URL(import.meta.url).pathname)) {
  runPlan21Benchmark().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
