/** Numero minimo de repeticoes do array para o infinity scroll. */
const INFINITY_SCROLL_MIN_REPEAT = 3;

/** Numero minimo de itens totais para o infinity scroll funcionar corretamente. */
const INFINITY_SCROLL_MIN_ITEMS = 30;

/**
 * @docsPrivate
 *
 * Helper com funcoes puras de matematica e layout para o infinity scroll
 * do po-timer. Nenhuma dessas funcoes acessa estado do componente — recebem
 * e devolvem apenas valores, facilitando testes unitarios isolados.
 */
export class PoTimerScrollHelper {
  /**
   * Normaliza o offset para o intervalo [sectionHeight, 2 * sectionHeight).
   *
   * Matematica:
   *   mod = ((offset - sH) % sH + sH) % sH  →  resultado em [0, sH)
   *   retorno = mod + sH                     →  resultado em [sH, 2*sH)
   *
   * Funciona para qualquer valor de offset (positivo, negativo, multiplos).
   */
  static wrapOffset(offset: number, sectionHeight: number): number {
    if (sectionHeight <= 0) {
      return offset;
    }
    const mod = (((offset - sectionHeight) % sectionHeight) + sectionHeight) % sectionHeight;
    return mod + sectionHeight;
  }

  /**
   * Calcula o passo (em px) por item, incluindo o gap entre itens.
   *
   * Para N itens num flex-column com altura H, gap G e padding P:
   *   scrollHeight = N*H + (N-1)*G + 2*P
   *   passo = H + G = (scrollHeight - 2*P + G) / N
   */
  static getCellStep(itemsEl: HTMLElement, displayCount: number): number {
    if (!itemsEl || displayCount === 0) {
      return 40;
    }
    const style = getComputedStyle(itemsEl);
    const gap = parseFloat(style.rowGap) || 0;
    const paddingTop = parseFloat(style.paddingTop) || 0;
    const paddingBottom = parseFloat(style.paddingBottom) || 0;
    return (itemsEl.scrollHeight - paddingTop - paddingBottom + gap) / displayCount;
  }

  /**
   * Calcula o indice no displayArray do item visivel no topo a partir do offset.
   * Usa Math.round para snap ao item mais proximo.
   */
  static computeTopDisplayIndex(offset: number, step: number, displayLength: number): number {
    if (step <= 0 || displayLength === 0) {
      return 0;
    }
    const raw = Math.round(offset / step);
    return ((raw % displayLength) + displayLength) % displayLength;
  }

  /**
   * Repete o array fonte o numero necessario de vezes para manter
   * o infinity scroll com pelo menos INFINITY_SCROLL_MIN_ITEMS itens.
   *
   * Quando o array fonte tem menos de 6 itens, retorna uma copia simples
   * (sem repeticao), pois o infinity scroll nao e utilizado.
   */
  static repeatArray(source: Array<number>): Array<number> {
    if (!source || source.length === 0) {
      return [];
    }

    if (source.length < 6) {
      return [...source];
    }

    const repeats = Math.max(INFINITY_SCROLL_MIN_REPEAT, Math.ceil(INFINITY_SCROLL_MIN_ITEMS / source.length));

    const result: Array<number> = [];
    for (let i = 0; i < repeats; i++) {
      result.push(...source);
    }
    return result;
  }
}
