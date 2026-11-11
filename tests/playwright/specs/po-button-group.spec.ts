import { expect, test } from '@playwright/test';

import { applyPointerState, open, THEMES } from './helpers';

type Toggle = 'none' | 'single' | 'multiple';
type Item = { label?: string; icon?: string; selected?: boolean; disabled?: boolean };
type Content = { name: string; items: Item[] };
type State =
  | 'default'
  | 'hover'
  | 'focus'
  | 'active'
  | 'item-disabled'
  | 'all-disabled'
  | 'selected'
  | 'selected-hover'
  | 'selected-focus';

const SIZES = ['small', 'medium']; // PoFieldSize: o grupo não tem 'large'
const TOGGLES: Toggle[] = ['none', 'single', 'multiple'];
const CONTENTS: Content[] = [
  { name: 'label', items: [{ label: 'Dia' }, { label: 'Semana' }, { label: 'Mês' }] },
  {
    name: 'icon-label',
    items: [
      { label: 'Lista', icon: 'an an-list' },
      { label: 'Grade', icon: 'an an-squares-four' },
      { label: 'Mapa', icon: 'an an-map-pin' }
    ]
  },
  { name: 'icon-only', items: [{ icon: 'an an-list' }, { icon: 'an an-squares-four' }, { icon: 'an an-map-pin' }] },
  {
    name: 'long-label',
    items: [
      { label: 'Um rótulo bem longo para testar' },
      { label: 'Curto' },
      { label: 'Outro rótulo razoavelmente longo' }
    ]
  }
];
const BASE_STATES: State[] = ['default', 'hover', 'focus', 'active', 'item-disabled', 'all-disabled'];
// "selected*" só faz sentido quando há seleção (toggle != none).
const STATES_BY_TOGGLE: Record<Toggle, State[]> = {
  none: BASE_STATES,
  single: [...BASE_STATES, 'selected', 'selected-hover', 'selected-focus'],
  multiple: [...BASE_STATES, 'selected', 'selected-hover', 'selected-focus']
};

function buildItems(c: Content, toggle: Toggle, state: State): Item[] {
  const items = c.items.map(i => ({ ...i }));
  if (state === 'item-disabled') items[1].disabled = true;
  if (state === 'all-disabled') items.forEach(i => (i.disabled = true));
  if (state.startsWith('selected')) {
    items[0].selected = true;
    if (toggle === 'multiple') items[2].selected = true;
  }
  return items;
}

for (const theme of THEMES) {
  test.describe(`po-button-group (${theme})`, () => {
    for (const size of SIZES)
      for (const toggle of TOGGLES)
        for (const c of CONTENTS)
          for (const state of STATES_BY_TOGGLE[toggle]) {
            const id = [theme, size, `toggle-${toggle}`, c.name, state].join('--');
            test(id, async ({ page }) => {
              const p = new URLSearchParams({
                c: 'button-group',
                theme,
                size,
                toggle,
                items: JSON.stringify(buildItems(c, toggle, state))
              });
              const stage = await open(page, `/?${p}`);
              const buttons = page.locator('po-button-group button');
              // hover/active/focus no 2º item; os "selected-*" agem no 1º (selecionado)
              if (state === 'hover' || state === 'active' || state === 'focus') {
                await applyPointerState(page, state, buttons.nth(1));
              }
              if (state === 'selected-hover') await applyPointerState(page, 'hover', buttons.nth(0));
              if (state === 'selected-focus') await applyPointerState(page, 'focus', buttons.nth(0));
              await expect(stage).toHaveScreenshot(`${id}.png`);
            });
          }
  });
}
