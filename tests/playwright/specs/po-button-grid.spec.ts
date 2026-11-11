import { expect, test } from '@playwright/test';

import { forcePseudoStates, open, THEMES } from './helpers';

/**
 * EXPERIMENTO DE ESCALA: a mesma matriz do po-button.spec.ts (tamanho × conteúdo × estado), mas com UM
 * snapshot por tema × variação (6 linhas × ... células), em vez de 1 teste por combinação.
 * Estados de ponteiro são forçados via CDP. Linhas = tamanho × conteúdo; colunas = estados.
 */
const VARIANTS = [
  { name: 'primary', kind: 'primary', danger: false },
  { name: 'primary-danger', kind: 'primary', danger: true },
  { name: 'secondary', kind: 'secondary', danger: false },
  { name: 'secondary-danger', kind: 'secondary', danger: true },
  { name: 'tertiary', kind: 'tertiary', danger: false },
  { name: 'glow', kind: 'glow', danger: false }
];
const SIZES = ['small', 'medium', 'large'];
const CONTENTS = [
  { label: 'Salvar' },
  { icon: 'an an-plus', label: 'Adicionar' },
  { icon: 'an an-plus', aria: 'Adicionar' },
  { icon: 'an an-plus', label: 'Um rótulo bem longo para testar quebra e truncamento do botão' }
];
const STATES = [
  { force: undefined },
  { force: 'hover' },
  { force: 'focus' },
  { force: 'active' },
  { disabled: true },
  { loading: true }
];

for (const theme of THEMES) {
  test.describe(`po-button grid (${theme})`, () => {
    for (const v of VARIANTS) {
      test(`${theme}--${v.name}`, async ({ page }) => {
        const rows = SIZES.flatMap(size =>
          CONTENTS.map(c => STATES.map(s => ({ kind: v.kind, danger: v.danger, size, ...c, ...s })))
        );
        const stage = await open(page, `/?${new URLSearchParams({ c: 'grid', theme, rows: JSON.stringify(rows) })}`);
        await forcePseudoStates(page);
        await expect(stage).toHaveScreenshot(`${theme}--${v.name}.png`);
      });
    }
  });
}
