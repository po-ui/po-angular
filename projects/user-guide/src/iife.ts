/**
 * Entry-point usado pela build IIFE.
 *
 * - Re-exporta `PoUserGuide` como default para que o global `PoUserGuide` exposto
 *   pelo IIFE seja a própria classe (e não um objeto com `default`).
 * - Importa o CSS do popover/overlay para que o `rollup-plugin-postcss` extraia
 *   o `dist/po-user-guide.css` como artefato distribuível via CDN.
 */
import './styles/index.css';

export { PoUserGuide as default } from './po-user-guide';
