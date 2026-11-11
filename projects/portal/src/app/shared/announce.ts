const REGION_ID = 'app-live-announcer';

/**
 * Anuncia uma mensagem para leitor de tela (`aria-live="polite"`), sem nenhum efeito visual.
 *
 * Substitui o `LiveAnnouncer` do CDK: ele depende da classe `.cdk-visually-hidden`, cujo CSS o portal não
 * carrega, então o elemento ficava visível no fim do `body` (24 px), criava overflow e uma segunda barra de
 * rolagem na página. Aqui o estilo vai inline e `position: fixed`, que nunca entra no tamanho rolável.
 */
export function announce(message: string, doc: Document = document): void {
  let region = doc.getElementById(REGION_ID);

  if (!region) {
    region = doc.createElement('div');
    region.id = REGION_ID;
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.style.cssText =
      'position:fixed;top:0;left:0;width:1px;height:1px;margin:-1px;padding:0;border:0;' +
      'overflow:hidden;clip-path:inset(50%);white-space:nowrap';
    doc.body.appendChild(region);
  }

  // Limpa e escreve no próximo ciclo: a mesma mensagem repetida também é anunciada.
  region.textContent = '';
  setTimeout(() => (region.textContent = message), 50);
}
