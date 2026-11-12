import { expect, Locator, Page } from '@playwright/test';

export type Theme = 'light' | 'dark' | 'deprecated-light' | 'deprecated-dark';
export const THEMES: Theme[] = ['light', 'dark', 'deprecated-light', 'deprecated-dark'];

/** URL do harness em modo grid: `rows` é uma lista de linhas de células (ver harness/main.ts). */
export function gridUrl(theme: Theme, rows: object[][]): string {
  return `/?${new URLSearchParams({ c: 'grid', theme, rows: JSON.stringify(rows) })}`;
}

/** Abre o harness, espera fontes e a primeira célula e devolve o #stage (alvo do screenshot). */
export async function open(page: Page, href: string): Promise<Locator> {
  await page.goto(href);
  // primeira célula renderizada (qualquer componente), não só botões
  await page.locator('#stage .cell').first().waitFor();
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
  await page.evaluate(async () => {
    // 2 quadros: a transição disparada pelo hover/active só nasce no próximo recálculo de estilo.
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    document.getAnimations().forEach(a => {
      if (a.effect?.getComputedTiming().iterations === Infinity) {
        a.pause();
        a.currentTime = 0;
      } else {
        a.finish();
      }
    });
  });
}

/**
 * Força :hover / :focus(-visible) / :active em vários elementos de uma vez (CDP CSS.forcePseudoState),
 * para fotografar muitos estados na mesma página. Cada célula do grid marcada com data-force="hover|focus|active"
 * recebe o estado nos elementos que casam com o seu data-force-selector (padrão: "button"); o seletor pode ser uma
 * lista separada por vírgula (ex.: ".po-checkbox, .po-checkbox-label label").
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
    const cells = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: `[data-force="${force}"]` });
    for (const cellId of cells.nodeIds) {
      const attributes = (await cdp.send('DOM.getAttributes', { nodeId: cellId })).attributes;
      const at = attributes.indexOf('data-force-selector'); // [nome, valor, nome, valor, ...]
      const selector = at >= 0 ? attributes[at + 1] : 'button';
      const targets = await cdp.send('DOM.querySelectorAll', { nodeId: cellId, selector });
      for (const nodeId of targets.nodeIds) await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses });
    }
  }
  await freezeAnimations(page);
}

/**
 * Falha se algum grid cortar conteúdo: (1) algum elemento dentro de uma célula passa da borda da célula,
 * (2) a célula passa da borda do #stage (que é o que o screenshot captura), (3) há rolagem em #stage ou nas células.
 * Tolerância de 1 px (arredondamento). Roda em todo grid, então pega o problema em componentes novos.
 */
export async function assertGridNotClipped(page: Page): Promise<void> {
  const problems = await page.evaluate(() => {
    const out: string[] = [];
    const stage = document.querySelector('#stage') as HTMLElement;
    const sr = stage.getBoundingClientRect();
    if (stage.scrollWidth > stage.clientWidth + 1 || stage.scrollHeight > stage.clientHeight + 1) {
      out.push(`#stage rola: ${stage.scrollWidth}x${stage.scrollHeight} > ${stage.clientWidth}x${stage.clientHeight}`);
    }
    document.querySelectorAll<HTMLElement>('#stage .cell').forEach(cell => {
      const caption = cell.querySelector('.caption')?.textContent?.split('\n').join(' | ') ?? '?';
      const cr = cell.getBoundingClientRect();
      if (cr.right > sr.right + 1 || cr.bottom > sr.bottom + 1) out.push(`célula fora do #stage: ${caption}`);
      if (cell.scrollWidth > cell.clientWidth + 1) out.push(`célula rola na horizontal: ${caption}`);
      for (const el of Array.from(cell.querySelectorAll<HTMLElement>('*'))) {
        const r = el.getBoundingClientRect();
        // decorativos (aria-hidden, ex.: pontos do glow, posicionados por offset-path) não contam
        if (r.width === 0 || r.height === 0 || el.closest('[aria-hidden="true"]')) continue;
        if (r.right > cr.right + 1 || r.bottom > cr.bottom + 1 || r.left < cr.left - 1) {
          out.push(`<${el.tagName.toLowerCase()} class="${el.className}"> passa da célula: ${caption}`);
          break;
        }
      }
    });
    return out;
  });
  expect(problems, `conteúdo cortado no grid:\n${problems.join('\n')}`).toEqual([]);
}

/** Fim comum de todo teste de grid: força estados, confere cortes e compara o snapshot do #stage. */
export async function expectGridScreenshot(page: Page, name: string): Promise<void> {
  await forcePseudoStates(page);
  await assertGridNotClipped(page);
  await expect(page.locator('#stage')).toHaveScreenshot(name);
}
