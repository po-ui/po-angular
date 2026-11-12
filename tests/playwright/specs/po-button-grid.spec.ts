import { expect, test } from '@playwright/test';

import { forcePseudoStates, gridUrl, open, THEMES } from './helpers';
import { CONTENTS, SIZES, STATES, stateProps, VARIANTS } from './po-button.matrix';

/**
 * COBERTURA ATIVA do po-button: a mesma matriz do po-button.spec.ts (tamanho × conteúdo × estado), mas com UM
 * snapshot por tema × variação (72 células: linhas = tamanho × conteúdo; colunas = estados), em vez de 1 teste por
 * combinação. hover/focus/active são forçados via CDP. Cada célula leva uma legenda (parte do snapshot):
 * "tema · variação" / "tamanho · conteúdo · estado".
 */
for (const theme of THEMES) {
  test.describe(`po-button grid (${theme})`, () => {
    for (const v of VARIANTS) {
      test(`${theme}--${v.name}`, async ({ page }) => {
        const rows = SIZES.flatMap(size =>
          CONTENTS.map(c =>
            STATES.map(state => ({
              caption: `${theme} · ${v.name}\n${size} · ${c.name} · ${state}`,
              kind: v.kind,
              danger: v.danger,
              size,
              icon: c.icon,
              label: c.label,
              aria: c.aria,
              ...stateProps(state)
            }))
          )
        );
        const stage = await open(page, gridUrl(theme, rows));
        await forcePseudoStates(page);
        await expect(stage).toHaveScreenshot(`${theme}--${v.name}.png`);
      });
    }
  });
}
