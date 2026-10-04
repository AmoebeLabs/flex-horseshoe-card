import {
  BASELINE_COMMIT, assertNoBrowserErrors, beginCdpMeasurement,
  launchBenchmarkBrowser, loadBuild, saveBenchmarkJson,
} from './performance-common.mjs';
import { createMappingCards, openHorseshoePage } from './performance-horseshoe-runner.mjs';

// Diagnostic only: keep the input value and normal setState work identical,
// then force a mapping-key miss to measure the work that this cache avoids.
const build = await loadBuild(BASELINE_COMMIT, 'baseline');
const { browser, version } = await launchBenchmarkBrowser();
const results = [];
try {
  const { page, browserErrors } = await openHorseshoePage(browser, build);
  await createMappingCards(page);
  for (const mapping of ['linear', 'spline', 'ranked']) {
    // Counterbalance the order so a first-pass JIT warm-up does not favor one route.
    for (const forceMiss of [false, true, true, false]) {
      await page.evaluate(({ mapping, forceMiss }) => {
        const entry = window.horseshoeMappings.find((item) => item.key === mapping);
        const gauge = entry.card.cardTools.getBySection('horseshoes')[0];
        for (let index = 0; index < 40; index += 1) {
          if (forceMiss) gauge.runtime.mappingKey = undefined;
          gauge.setState(gauge.runtime.entity, {});
        }
      }, { mapping, forceMiss });
      const measurement = await beginCdpMeasurement(page);
      const result = await page.evaluate(({ mapping, forceMiss }) => {
        const entry = window.horseshoeMappings.find((item) => item.key === mapping);
        const gauge = entry.card.cardTools.getBySection('horseshoes')[0];
        let mapperBuilds = 0;
        const batchesMs = [];
        for (let batch = 0; batch < 5; batch += 1) {
          const start = performance.now();
          for (let index = 0; index < 200; index += 1) {
            const previousMapper = gauge.runtime.valueMapper;
            if (forceMiss) gauge.runtime.mappingKey = undefined;
            gauge.setState(gauge.runtime.entity, {});
            if (gauge.runtime.valueMapper !== previousMapper) mapperBuilds += 1;
          }
          batchesMs.push(performance.now() - start);
        }
        return { mapping, forceMiss, batchesMs, mapperBuilds, value: gauge.runtime.value };
      }, { mapping, forceMiss });
      result.cpuMs = await measurement.finish();
      result.pass = results.filter((entry) => entry.mapping === mapping).length + 1;
      if (result.mapperBuilds !== (forceMiss ? 1000 : 0)) throw new Error('Mapping diagnostic did not exercise the expected cache route.');
      results.push(result);
    }
  }
  assertNoBrowserErrors(browserErrors, 'mapping-cache-diagnostic', 'baseline');
} finally {
  await browser.close();
}
const report = { diagnostic: true, baseline: BASELINE_COMMIT, browser: version, node: process.version, warmup: 40, measuredUpdates: 1000, order: 'cached, forced miss, forced miss, cached', results };
await saveBenchmarkJson('tests/performance-results/2026.10.04-plan21-mapping-cache-diagnostic.json', report);
console.log(JSON.stringify(report, null, 2));
