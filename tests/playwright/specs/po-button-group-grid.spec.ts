import { test } from '@playwright/test';

import { expectGridScreenshot, gridUrl, open, THEMES } from './helpers';
import { buildItems, CONTENTS, pointerTarget, SIZES, STATES_BY_TOGGLE, TOGGLES } from './po-button-group.matrix';

/**
 * COBERTURA ATIVA do po-button-group: a mesma matriz do po-button-group.spec.ts, com UM snapshot por
 * tema × tamanho × toggle (colunas = conteúdos; linhas = estados). hover/focus/active são forçados via CDP no
 * item certo (`forceItem`). Cada célula leva uma legenda (parte do snapshot):
 * "tema · tamanho · toggle" / "conteúdo · estado".
 */
for (const theme of THEMES) {
  test.describe(`po-button-group grid (${theme})`, () => {
    for (const size of SIZES)
      for (const toggle of TOGGLES) {
        const id = `${theme}--${size}--toggle-${toggle}`;
        test(id, async ({ page }) => {
          const rows = STATES_BY_TOGGLE[toggle].map(state =>
            CONTENTS.map(c => {
              const target = pointerTarget(state);
              return {
                component: 'button-group',
                caption: `${theme} · ${size} · toggle-${toggle}\n${c.name} · ${state}`,
                size,
                toggle,
                items: buildItems(c, toggle, state),
                force: target?.force,
                forceItem: target?.item
              };
            })
          );
          await open(page, gridUrl(theme, rows));
          await expectGridScreenshot(page, `${id}.png`);
        });
      }
  });
}
