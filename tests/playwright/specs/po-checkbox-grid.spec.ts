import { test } from '@playwright/test';

import { expectGridScreenshot, gridUrl, open, THEMES } from './helpers';
import { CONTENTS, FORCE_SELECTOR, SIZES, STATES, VALUES } from './po-checkbox.matrix';

/**
 * po-checkbox em grade: UM snapshot por tema × tamanho (4 × 3 = 12). Linhas = valor × conteúdo
 * (3 × 6 = 18); colunas = estados (default, hover, focus, active, disabled). hover/focus/active são forçados via CDP.
 * Legenda de cada célula (parte do snapshot): "tema · tamanho · valor" / "conteúdo · estado".
 * Não existe p-label-hidden nem tamanhos além de small/medium/large neste componente; o texto de erro não é
 * uma propriedade do po-checkbox (só `p-help`).
 */
for (const theme of THEMES) {
  test.describe(`po-checkbox grid (${theme})`, () => {
    for (const size of SIZES) {
      const id = `${theme}--${size}`;
      test(id, async ({ page }) => {
        const rows = Object.entries(VALUES).flatMap(([valueName, value]) =>
          CONTENTS.map(content =>
            STATES.map(state => ({
              component: 'checkbox',
              caption: `${theme} · ${size} · ${valueName}\n${content.name} · ${state}`,
              size,
              value,
              label: content.label,
              labelWrap: content.labelWrap,
              width: content.width,
              help: content.help,
              helper: content.helper,
              required: content.required,
              disabled: state === 'disabled',
              force: state === 'hover' || state === 'focus' || state === 'active' ? state : undefined,
              forceSelector:
                state === 'hover' || state === 'focus' || state === 'active' ? FORCE_SELECTOR[state] : undefined
            }))
          )
        );
        await open(page, gridUrl(theme, rows));
        await expectGridScreenshot(page, `${id}.png`);
      });
    }
  });
}
