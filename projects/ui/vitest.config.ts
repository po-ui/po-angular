/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    angular({
      tsconfig: resolve(__dirname, 'tsconfig.spec.vitest.json')
    })
  ],
  cacheDir: resolve(__dirname, '../../node_modules/.cache/vitest-ui'),
  test: {
    globals: true,
    environment: 'jsdom',
    root: resolve(__dirname),
    include: ['src/**/*.vitest.spec.ts'],
    setupFiles: ['src/lib/util-test/util-setup.vitest.ts'],
    testTimeout: 8000,
    hookTimeout: 20000,
    deps: {
      inline: [/@angular/, /@po-ui/]
    },
    coverage: {
      provider: 'v8',
      reportsDirectory: resolve(__dirname, '../../coverage/ui-vitest'),
      reporter: ['html', 'lcovonly', 'text-summary', 'cobertura'],
      include: ['src/lib/**/*.ts'],
      exclude: [
        'src/lib/**/*.spec.ts',
        'src/lib/**/*.vitest.spec.ts',
        'src/lib/**/index.ts',
        'src/lib/util-test/**',
        'src/lib/**/*.module.ts',
        'src/lib/**/*.interface.ts',
        'src/lib/**/samples/**'
      ]
    }
  }
});
