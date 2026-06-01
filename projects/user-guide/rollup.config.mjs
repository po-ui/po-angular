/* eslint-disable */
// @ts-check

/**
 * Rollup config para o pacote `@po-ui/user-guide`.
 *
 * Gera, em `projects/user-guide/dist/`:
 *  - `po-user-guide.iife.js`  (global `PoUserGuide`, próprio para `<script src>`)
 *  - `po-user-guide.esm.js`   (ESM)
 *  - `po-user-guide.umd.cjs`  (UMD/CommonJS)
 *  - `po-user-guide.css`      (estilos do popover + driver.js + fallbacks)
 *  - `po-user-guide.d.ts`     (tipagens consolidadas)
 *
 * O CSS é extraído apenas no primeiro bundle (IIFE) para evitar duplicação;
 * os demais reusam o mesmo arquivo emitido em disco.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';
import dts from 'rollup-plugin-dts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = __dirname;
const distDir = path.join(projectRoot, 'dist');

const banner =
  '/*! @po-ui/user-guide | MIT License | https://po-ui.io | inclui driver.js (MIT) e DOMPurify (MPL-2.0) */';

const baseInputPlugins = [
  nodeResolve({ browser: true, preferBuiltins: false }),
  commonjs(),
  typescript({
    tsconfig: path.join(projectRoot, 'tsconfig.json'),
    declaration: false,
    declarationDir: undefined,
    outDir: undefined,
    rootDir: path.join(projectRoot, 'src'),
    sourceMap: true,
    inlineSources: true
  })
];

/**
 * Build IIFE (também é o bundle responsável por extrair o CSS).
 * @type {import('rollup').RollupOptions}
 */
const iifeBundle = {
  input: path.join(projectRoot, 'src', 'iife.ts'),
  output: {
    file: path.join(distDir, 'po-user-guide.iife.js'),
    format: 'iife',
    name: 'PoUserGuide',
    banner,
    sourcemap: true,
    // Como o entry exporta default, expomos a classe direto no global `PoUserGuide`
    // em vez de `PoUserGuide.default`.
    footer: 'window.PoUserGuide = (window.PoUserGuide && window.PoUserGuide.default) || window.PoUserGuide;'
  },
  plugins: [
    ...baseInputPlugins,
    postcss({
      include: path.join(projectRoot, 'src', 'styles', 'index.css'),
      extract: path.join(distDir, 'po-user-guide.css'),
      minimize: true,
      sourceMap: true,
      plugins: [postcssImport()]
    }),
    terser({ format: { comments: /^\!/ } })
  ]
};

/**
 * Build ESM e UMD a partir do `public-api.ts`. O CSS já foi extraído pelo
 * bundle IIFE; aqui usamos `inject:false / extract:false` para evitar duplicação.
 * @type {import('rollup').RollupOptions}
 */
const esmAndUmdBundle = {
  input: path.join(projectRoot, 'src', 'public-api.ts'),
  output: [
    {
      file: path.join(distDir, 'po-user-guide.esm.js'),
      format: 'es',
      banner,
      sourcemap: true
    },
    {
      file: path.join(distDir, 'po-user-guide.umd.cjs'),
      format: 'umd',
      name: 'PoUserGuide',
      banner,
      sourcemap: true,
      exports: 'named'
    }
  ],
  plugins: [
    ...baseInputPlugins,
    postcss({
      include: path.join(projectRoot, 'src', 'styles', 'index.css'),
      inject: false,
      extract: false,
      minimize: false,
      plugins: [postcssImport()]
    })
  ]
};

/**
 * Build de tipagens (`.d.ts`) consolidadas em um único arquivo.
 *
 * O `rollup-plugin-dts` lê o output `.d.ts` produzido pelo `tsc` (configurado
 * pelo `@rollup/plugin-typescript` quando `declaration: true`). Para simplicidade,
 * usamos o próprio `public-api.ts` como entrada — o plugin invoca o compilador.
 * @type {import('rollup').RollupOptions}
 */
const dtsBundle = {
  input: path.join(projectRoot, 'src', 'public-api.ts'),
  output: {
    file: path.join(distDir, 'po-user-guide.d.ts'),
    format: 'es'
  },
  plugins: [dts()]
};

export default [iifeBundle, esmAndUmdBundle, dtsBundle];
