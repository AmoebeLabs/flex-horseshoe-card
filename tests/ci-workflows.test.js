import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { parse } from 'yaml';
import browserConfig from '../playwright.config.js';

// Read the actual workflows: these checks protect the release gates, not a copied fixture.
const development = parse(await readFile(new URL('../.github/workflows/dev-latest-prerelease.yml', import.meta.url), 'utf8'));
const releases = parse(await readFile(new URL('../.github/workflows/release-asset.yml', import.meta.url), 'utf8'));
const browsers = parse(await readFile(new URL('../.github/workflows/browser-tests.yml', import.meta.url), 'utf8'));
const { scripts } = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

test('one development writer keeps the active run and supersedes only pending runs', () => {
  assert.deepEqual(development.concurrency, { group: 'fhs-dev-latest', 'cancel-in-progress': false });
  assert.equal(development.jobs['build-and-publish'].concurrency, undefined);
  assert.deepEqual(development.on.push.branches, ['**']);
  assert.ok(Object.hasOwn(development.on, 'workflow_dispatch'));
  assert.equal(releases.jobs.upload.if, "github.event.release.tag_name != 'dev-latest'");
  assert.deepEqual(releases.on.release.types, ['published']);
});

test('development publication follows every required build and browser gate', () => {
  const job = development.jobs['build-and-publish'];
  assert.equal(job.if, undefined);
  assert.equal(job['continue-on-error'], undefined);
  assert.equal(job.strategy, undefined);
  assert.deepEqual(scripts.build, 'npm test && npm run lint && npm run rollup');

  const steps = job.steps;
  const build = steps.findIndex((step) => step.run === 'npm run build');
  const install = steps.findIndex((step) => step.run === 'npx playwright install --with-deps chromium webkit firefox');
  const testBrowsers = steps.findIndex((step) => step.run === 'npm run test:browser:all');
  const publish = steps.findIndex((step) => step.name === 'Replace dev-latest prerelease');
  assert.ok(build > steps.findIndex((step) => step.run === 'npm ci'));
  assert.ok(install > build);
  assert.ok(testBrowsers > install);
  assert.equal(publish, steps.length - 1);
  assert.ok(publish > testBrowsers);

  // A failed prerequisite must stop the same job before it can replace the release.
  for (const step of steps) {
    assert.equal(step.if, undefined);
    assert.equal(step['continue-on-error'], undefined);
  }
});

test('the prerelease artifact and notes belong to the tested checkout', () => {
  const steps = development.jobs['build-and-publish'].steps;
  const checkouts = steps.filter((step) => step.uses?.startsWith('actions/checkout@'));
  assert.equal(checkouts.length, 1);
  assert.equal(checkouts[0], steps[0]);
  assert.equal(checkouts[0].with['fetch-depth'], 0);
  assert.equal(checkouts[0].with.ref, undefined);
  assert.equal(development.env.DEV_TAG, 'dev-latest');
  assert.equal(development.env.ASSET, 'dist/flex-horseshoe-card.js');

  const publish = steps.at(-1);
  assert.equal(publish.env.GH_TOKEN, '${{ github.token }}');
  assert.match(publish.run, /git tag -f "\$DEV_TAG" "\$GITHUB_SHA"/);
  assert.match(publish.run, /gh release create "\$DEV_TAG" "\$ASSET"/);
  assert.match(publish.run, /--target "\$GITHUB_SHA"/);
  assert.match(publish.run, /Branch: \$GITHUB_REF_NAME/);
  assert.match(publish.run, /Commit: \$GITHUB_SHA/);
  assert.match(publish.run, /require\('\.\/package\.json'\)\.version/);
  assert.match(publish.run, /Version: \$version/);
  assert.match(publish.run, /\$GITHUB_SERVER_URL\/\$GITHUB_REPOSITORY\/actions\/runs\/\$GITHUB_RUN_ID/);
  assert.match(publish.run, /Workflow: \$run_url/);
  assert.match(publish.run, /--prerelease/);

  const syntax = spawnSync('bash', ['-n'], { input: publish.run, encoding: 'utf8' });
  assert.ifError(syntax.error);
  assert.equal(syntax.status, 0, syntax.stderr);
});

test('browser jobs and local commands use the permanent browser matrix', () => {
  assert.deepEqual(Object.keys(browsers.jobs), ['svg-geometry', 'webkit', 'firefox']);
  for (const [jobName, browser, script] of [
    ['svg-geometry', 'chromium', 'test:browser'],
    ['webkit', 'webkit', 'test:browser:webkit'],
    ['firefox', 'firefox', 'test:browser:firefox'],
  ]) {
    const steps = browsers.jobs[jobName].steps;
    assert.equal(steps.find((step) => step.uses?.startsWith('actions/setup-node@')).with['node-version'], 24);
    assert.equal(steps.at(-2).run, `npx playwright install --with-deps ${browser}`);
    assert.equal(steps.at(-1).run, `npm run ${script}`);
    assert.equal(steps.at(-1).if, undefined);
    assert.equal(scripts[script], `playwright test --project=${browser}`);
  }
  assert.equal(scripts['test:browser:all'], 'playwright test');
  assert.equal(browserConfig.use.timezoneId, 'Etc/UTC');
  assert.equal(browserConfig.projects[2].use.timezoneId, 'UTC');
  assert.deepEqual(browserConfig.use.viewport, { width: 800, height: 600 });
  assert.deepEqual(browserConfig.projects.map((project) => project.name), ['chromium', 'webkit', 'firefox']);
  assert.equal(browserConfig.projects[0].snapshotPathTemplate, '{testDir}/{testFilePath}-snapshots/{arg}-{platform}{ext}');
  assert.deepEqual(browserConfig.projects[1].testMatch, [
    '**/svg-geometry.browser.spec.js', '**/sparkline-pointer.browser.spec.js',
    '**/path-animator.browser.spec.js', '**/path-gradient-renderer.browser.spec.js',
    '**/horseshoe-marker.browser.spec.js', '**/horseshoe-cache.browser.spec.js',
    '**/theme-color-cache.browser.spec.js', '**/async-results.browser.spec.js',
    '**/config-ref.browser.spec.js', '**/tool-geometry.browser.spec.js',
  ]);
  assert.deepEqual(browserConfig.projects[2].testMatch, [
    '**/svg-geometry.browser.spec.js', '**/sparkline-pointer.browser.spec.js',
    '**/config-ref.browser.spec.js', '**/tool-geometry.browser.spec.js',
  ]);
});
