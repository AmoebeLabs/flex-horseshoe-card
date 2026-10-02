import { defineConfig, devices } from '@playwright/test';

// Keep Node-side fixture dates in the same timezone as each browser context.
process.env.TZ = 'Etc/UTC';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.browser.spec.js',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'line',
  outputDir: '/tmp/fhs-playwright-results',
  use: {
    headless: true,
    viewport: { width: 800, height: 600 },
    timezoneId: 'Etc/UTC',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 800, height: 600 } },
      // Keep the original Chromium reference names when adding named projects.
      snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}-{platform}{ext}',
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], viewport: { width: 800, height: 600 } },
      testMatch: [
        '**/svg-geometry.browser.spec.js',
        '**/sparkline-pointer.browser.spec.js',
        '**/path-animator.browser.spec.js',
        '**/path-gradient-renderer.browser.spec.js',
        '**/horseshoe-marker.browser.spec.js',
        '**/horseshoe-cache.browser.spec.js',
        '**/theme-color-cache.browser.spec.js',
        '**/async-results.browser.spec.js',
        '**/config-ref.browser.spec.js',
        '**/tool-geometry.browser.spec.js',
        '**/tool-config-evaluation.browser.spec.js',
      ],
    },
    {
      name: 'firefox',
      // Firefox's timezone override accepts the canonical browser name UTC, not its Etc/UTC alias.
      use: { ...devices['Desktop Firefox'], viewport: { width: 800, height: 600 }, timezoneId: 'UTC' },
      testMatch: [
        '**/svg-geometry.browser.spec.js',
        '**/sparkline-pointer.browser.spec.js',
        '**/config-ref.browser.spec.js',
        '**/tool-geometry.browser.spec.js',
        '**/tool-config-evaluation.browser.spec.js',
      ],
    },
  ],
});
