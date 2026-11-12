import { expect, test } from '@playwright/test';

import { applyPointerState, FULL_MATRIX, open, THEMES } from './helpers';
import { buildItems, CONTENTS, pointerTarget, SIZES, STATES_BY_TOGGLE, TOGGLES } from './po-button-group.matrix';

/**
 * MATRIZ COMPLETA (1 teste por combinação, 768 snapshots). DESLIGADA por padrão: a cobertura ativa é o grid
 * (po-button-group-grid.spec.ts). Para reativar: PW_FULL=1 npx playwright test po-button-group.spec
 * (os snapshots continuam em __snapshots__/po-button-group.spec.ts/).
 */
if (FULL_MATRIX) {
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
                const target = pointerTarget(state);
                if (target) {
                  await applyPointerState(page, target.force, page.locator('po-button-group button').nth(target.item));
                }
                await expect(stage).toHaveScreenshot(`${id}.png`);
              });
            }
    });
  }
}
