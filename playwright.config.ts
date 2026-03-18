import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/visual',
  outputDir: './e2e/visual/test-results',
  snapshotDir: './e2e/visual/__snapshots__',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: [['html', { outputFolder: './e2e/visual/playwright-report' }]],
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: 'npx ng serve app --port 4200 --host 0.0.0.0',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
    timeout: 120000
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      animations: 'disabled'
    }
  }
});
