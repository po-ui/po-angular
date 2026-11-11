import { defineConfig, devices } from '@playwright/test';

const PORT = 4300;

export default defineConfig({
  testDir: './tests/playwright/specs',
  // Baselines sem sufixo de plataforma: a referência é SEMPRE a gerada em Linux (CI / Docker).
  snapshotPathTemplate: '{testDir}/../__snapshots__/{testFileName}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0, // retry mascara flakiness; queremos ver instabilidade
  workers: process.env.CI ? 2 : 4,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  expect: {
    toHaveScreenshot: { animations: 'disabled', caret: 'hide', scale: 'css', maxDiffPixels: 0 }
  },
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    viewport: { width: 400, height: 300 },
    deviceScaleFactor: 1,
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    colorScheme: 'light',
    reducedMotion: 'reduce'
  },
  projects: [
    // Firefox/WebKit ficam fora da POC: dobram snapshots e tempo, e renderizam fontes diferente.
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 500, height: 300 } } }
  ],
  webServer: {
    command: 'npx ng serve visual-harness',
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000
  }
});
