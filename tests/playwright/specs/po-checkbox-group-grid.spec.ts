import { test } from '@playwright/test';

import { expectGridScreenshot, gridUrl, open, THEMES } from './helpers';
import { CONTENTS, FORCE_SELECTOR, LAYOUTS, LONG, OPTIONS, SIZES, STATES, VALUES } from './po-checkbox-group.matrix';

/**
 * po-checkbox-group em grade, dois tipos de snapshot por tema:
 *  1) `<tema>--<tamanho>` (4 × 2 = 8): linhas = valor × conteúdo (3 × 6 = 18); colunas = estados (default, hover,
 *     focus, active, disabled). hover/focus/active são forçados (CDP) só na 1ª opção; as outras ficam em repouso.
 *  2) `<tema>--layout` (4): colunas (1 a 4), textos longos, opção desabilitada, título compacto, label com quebra.
 * Viewport de 1000 px: o grid system do po-style usa media query (a partir de 961 px vale `p-columns` inteiro; abaixo
 * disso o componente cai para 2 colunas ou 1).
 * Não coberto de propósito: mensagem de erro (`p-field-error-message` só aparece com ng-invalid + ng-dirty, que exige
 * interação) e `fixed` na opção (não muda o visual). O po-checkbox-group só tem tamanhos small e medium.
 */
test.use({ viewport: { width: 1000, height: 300 } });

for (const theme of THEMES) {
  test.describe(`po-checkbox-group grid (${theme})`, () => {
    for (const size of SIZES) {
      const id = `${theme}--${size}`;
      test(id, async ({ page }) => {
        const rows = Object.entries(VALUES).flatMap(([valueName, v]) =>
          CONTENTS.map(content =>
            STATES.map(state => ({
              component: 'checkbox-group',
              caption: `${theme} · ${size} · ${valueName}\n${content.name} · ${state}`,
              size,
              options: OPTIONS,
              columns: 1,
              value: v.value,
              indeterminate: v.indeterminate,
              label: content.label,
              help: content.help,
              helper: content.helper,
              required: content.required,
              showRequired: content.required,
              optional: content.optional,
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

    test(`${theme}--layout`, async ({ page }) => {
      const rows = LAYOUTS.map(layout => [
        {
          component: 'checkbox-group',
          caption: `${theme} · medium\n${layout.name}`,
          size: 'medium',
          width: layout.width ?? 800,
          columns: layout.columns,
          options: OPTIONS.concat({ label: 'Svelte', value: 'svelte' }).map((o, i) => ({
            ...o,
            label: layout.long ? `${o.label}: ${LONG}` : o.label,
            disabled: layout.disabledOption && i === 1
          })),
          value: ['angular', 'vue'],
          label: layout.labelWrap ? `${LONG} (título do grupo)` : 'Frameworks favoritos',
          labelWrap: layout.labelWrap,
          compactLabel: layout.compactLabel,
          help: layout.compactLabel ? 'Texto de ajuda do campo' : undefined
        }
      ]);
      await open(page, gridUrl(theme, rows));
      await expectGridScreenshot(page, `${theme}--layout.png`);
    });
  });
}
