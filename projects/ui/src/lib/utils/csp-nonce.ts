import { Renderer2 } from '@angular/core';

/**
 * @docsPrivate
 *
 * Aplica o nonce da Content-Security-Policy (token `CSP_NONCE` do Angular) a um elemento criado em tempo de execução
 * (ex.: `<style>`), para que ele seja aceito por políticas sem `'unsafe-inline'`.
 *
 * Deve ser chamado antes de o elemento ser inserido no DOM. Sem nonce configurado, o elemento permanece inalterado.
 *
 * @param element Elemento que receberá o nonce.
 * @param nonce Valor do `CSP_NONCE`. `null`, `undefined` ou vazio não alteram o elemento.
 * @param renderer (Opcional) Renderer usado para definir o atributo. Sem ele, é usado `element.setAttribute`.
 */
export function applyCspNonce(element: Element, nonce: string | null | undefined, renderer?: Renderer2): void {
  if (!element || !nonce) {
    return;
  }

  if (renderer) {
    renderer.setAttribute(element, 'nonce', nonce);
  } else {
    element.setAttribute('nonce', nonce);
  }
}
