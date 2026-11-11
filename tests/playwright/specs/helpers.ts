import { Locator, Page } from '@playwright/test';

export type Theme = 'light' | 'dark' | 'deprecated-light' | 'deprecated-dark';
export const THEMES: Theme[] = ['light', 'dark', 'deprecated-light', 'deprecated-dark'];

/** Abre o harness, espera fontes e o primeiro botão e devolve o #stage (alvo do screenshot). */
export async function open(page: Page, href: string): Promise<Locator> {
  await page.goto(href);
  await page.locator('#stage button').first().waitFor();
  await page.evaluate(() => document.fonts.ready);
  return page.locator('#stage');
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
}
