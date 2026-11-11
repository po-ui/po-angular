import { expect, test } from '@playwright/test';

import { applyPointerState, open, Theme } from './helpers';

type Variant = { name: string; kind: string; danger: boolean };
type Content = { name: string; icon?: string; label?: string; aria?: string };
type State = 'default' | 'hover' | 'focus' | 'active' | 'disabled' | 'loading';

// p-danger é ignorado em tertiary/glow (ver PoButtonBaseComponent), por isso não entram com danger.
const VARIANTS: Variant[] = [
  { name: 'primary', kind: 'primary', danger: false },
  { name: 'primary-danger', kind: 'primary', danger: true },
  { name: 'secondary', kind: 'secondary', danger: false },
  { name: 'secondary-danger', kind: 'secondary', danger: true },
  { name: 'tertiary', kind: 'tertiary', danger: false },
  { name: 'glow', kind: 'glow', danger: false }
];
const SIZES = ['small', 'medium', 'large'];
const CONTENTS: Content[] = [
  { name: 'label', label: 'Salvar' },
  { name: 'icon-label', icon: 'an an-plus', label: 'Adicionar' },
  { name: 'icon-only', icon: 'an an-plus', aria: 'Adicionar' },
  { name: 'long-label', icon: 'an an-plus', label: 'Um rótulo bem longo para testar quebra e truncamento do botão' }
];
const STATES: State[] = ['default', 'hover', 'focus', 'active', 'disabled', 'loading'];

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
