import { defineConfig, devices } from '@playwright/test';

const PORT = 4300;

export default defineConfig({
  testDir: './tests/playwright/specs',
  // Baselines sem sufixo de plataforma: a referência é SEMPRE a gerada em Linux (CI / Docker).
  snapshotPathTemplate: '{testDir}/../__snapshots__/{testFileName}/{arg}{ext}',
  // Grids são pesados (um snapshot de até 2000 × 1200 px com 72 botões): 90 s por teste em vez dos 30 s padrão.
  timeout: 90_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Local: sem retry (queremos ver instabilidade). CI: 1 retry; o Playwright marca o teste como "flaky" no relatório,
  // então não some. Medido: ~1 falha em ~2000 execuções por timeout de estabilidade do screenshot no glow.
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  expect: {
    // threshold: 0 = tolerância zero de cor por pixel (o padrão 0.2 deixava passar opacity .9 no hover).
    // timeout 30 s: os grids com glow (72 botões animados) levam mais de 5 s para estabilizar, e mais ainda com 4 grids em paralelo.
    toHaveScreenshot: {
      timeout: 30_000,
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
      threshold: 0,
      maxDiffPixels: 0
    }
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
    // PW_STATIC=1: serve o build já pronto (`ng build visual-harness`) em vez do dev-server; mais leve e rápido.
    command: process.env.PW_STATIC
      ? `python3 -m http.server ${PORT} --bind 127.0.0.1 --directory dist/visual-harness/browser`
      : 'npx ng serve visual-harness',
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000
  }
});
