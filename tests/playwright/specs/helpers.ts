import { Locator, Page } from '@playwright/test';

export type Theme = 'light' | 'dark' | 'deprecated-light' | 'deprecated-dark';
export const THEMES: Theme[] = ['light', 'dark', 'deprecated-light', 'deprecated-dark'];

/** Abre o harness, espera fontes e o primeiro botão e devolve o #stage (alvo do screenshot). */
export async function open(page: Page, href: string): Promise<Locator> {
  await page.goto(href);
  await page.locator('#stage button').first().waitFor();
  await page.evaluate(() => document.fonts.ready);
  await freezeAnimations(page);
  return page.locator('#stage');
}

/**
 * Deixa o quadro determinístico: animações infinitas (pontos do glow do po-button) param em t=0 e as finitas
 * (transições de hover etc.) vão direto ao fim. `animations: 'disabled'` do Playwright sozinho deixava o glow
 * variar alguns pixels por execução. Chamar de novo depois de mudar o estado (hover/active/focus).
 */
export async function freezeAnimations(page: Page): Promise<void> {
  await page.evaluate(() =>
    document.getAnimations().forEach(a => {
      if (a.effect?.getComputedTiming().iterations === Infinity) {
        a.pause();
        a.currentTime = 0;
      } else {
        a.finish();
      }
    })
  );
}

export type PointerState = 'hover' | 'active' | 'focus';

/** Aplica hover / mouse pressionado / foco por teclado (Tab = :focus-visible real) em `target`. */
export async function applyPointerState(page: Page, state: PointerState, target: Locator): Promise<void> {
  if (state === 'hover') await target.hover();
  if (state === 'active') {
    await target.hover();
    await page.mouse.down();
  }
  if (state === 'focus') {
    const index = await target.evaluate(el =>
      Array.from(document.querySelectorAll('#stage button:not([disabled])')).indexOf(el)
    );
    for (let i = 0; i <= index; i++) await page.keyboard.press('Tab');
  }
  await freezeAnimations(page);
}

/**
 * Força :hover / :focus(-visible) / :active em vários elementos de uma vez (CDP CSS.forcePseudoState),
 * para fotografar muitos estados na mesma página. Elementos marcados com data-force="hover|focus|active".
 */
export async function forcePseudoStates(page: Page): Promise<void> {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  const { root } = await cdp.send('DOM.getDocument', { depth: 0 });
  const classes: Record<string, string[]> = {
    hover: ['hover'],
    focus: ['focus', 'focus-visible'],
    active: ['hover', 'active']
  };
  for (const [force, forcedPseudoClasses] of Object.entries(classes)) {
    const { nodeIds } = await cdp.send('DOM.querySelectorAll', {
      nodeId: root.nodeId,
      selector: `[data-force="${force}"] button`
    });
    for (const nodeId of nodeIds) await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses });
  }
  await freezeAnimations(page);
}
