import { expect, test } from '@playwright/test';

import { applyPointerState, FULL_MATRIX, open, Theme } from './helpers';
import {
  ButtonContent as Content,
  ButtonState as State,
  ButtonVariant as Variant,
  CONTENTS,
  SIZES,
  STATES,
  VARIANTS
} from './po-button.matrix';

/**
 * MATRIZ COMPLETA (1 teste por combinação, 1.368 snapshots). DESLIGADA por padrão: a cobertura ativa é o grid
 * (po-button-grid.spec.ts). Para reativar: PW_FULL=1 npx playwright test po-button.spec
 * (os snapshots continuam em __snapshots__/po-button.spec.ts/).
 */
function url(v: Variant, size: string, c: Content, state: State, theme: Theme): string {
  const p = new URLSearchParams({ kind: v.kind, size, theme });
  if (v.danger) p.set('danger', '1');
  if (c.icon) p.set('icon', c.icon);
  if (c.label) p.set('label', c.label);
  if (c.aria) p.set('aria', c.aria);
  if (state === 'disabled') p.set('disabled', '1');
  if (state === 'loading') p.set('loading', '1');
  return `/?${p}`;
}

function register(theme: Theme, variants: Variant[], sizes: string[], contents: Content[], states: State[]) {
  for (const v of variants)
    for (const size of sizes)
      for (const c of contents)
        for (const state of states) {
          const id = [theme, v.name, size, c.name, state].join('--');
          test(id, async ({ page }) => {
            const stage = await open(page, url(v, size, c, state, theme));
            if (state === 'hover' || state === 'active' || state === 'focus') {
              await applyPointerState(page, state, page.locator('po-button button'));
            }
            await expect(stage).toHaveScreenshot(`${id}.png`);
          });
        }
}

if (FULL_MATRIX) {
  test.describe('po-button (tema claro)', () => {
    register('light', VARIANTS, SIZES, CONTENTS, STATES);
  });

  // Tema escuro: recorte menor (tamanho médio) para manter o tempo de execução razoável.
  test.describe('po-button (tema escuro)', () => {
    register('dark', VARIANTS, ['medium'], CONTENTS.slice(0, 3), ['default', 'hover', 'focus', 'disabled']);
  });

  // Tema depreciado (poThemeDefaultDeprecated): MESMA matriz do tema padrão, claro e escuro.
  for (const theme of ['deprecated-light', 'deprecated-dark'] as const) {
    test.describe(`po-button (${theme})`, () => {
      register(theme, VARIANTS, SIZES, CONTENTS, STATES);
    });
  }
}
