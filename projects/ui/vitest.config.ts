import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    isolate: false,
    fileParallelism: false,
    environment: 'happy-dom',
    setupFiles: ['src/lib/util-test/vitest-setup.ts'],
    include: ['src/**/*.spec.ts'],
    exclude: ['schematics/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: '../../coverage/ui',
      reporter: ['html', 'lcovonly', 'text-summary', 'cobertura'],
      watermarks: {
        statements: [50, 75],
        functions: [50, 75],
        branches: [50, 75],
        lines: [50, 75]
      },
      thresholds: {
        statements: 99,
        branches: 99,
        functions: 99,
        lines: 99
      }
    },
    testTimeout: 120000,
    hookTimeout: 50000,
    reporters: ['default']
  }
});
