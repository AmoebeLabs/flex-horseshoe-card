import { defineConfig, devices } from '@playwright/test';

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
    ...devices['Desktop Chrome'],
    headless: true,
    viewport: { width: 800, height: 600 },
  },
});
