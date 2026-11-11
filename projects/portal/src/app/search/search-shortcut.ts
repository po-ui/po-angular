import { NgZone } from '@angular/core';

import { SearchOpenRequest } from './search-launcher.service';

export function isMacPlatform(nav: Pick<Navigator, 'platform' | 'userAgent'> = navigator): boolean {
  return /mac|iphone|ipad/i.test(nav.platform || nav.userAgent || '');
}

/** Rótulo do atalho para o hint visual. */
export function shortcutLabel(nav?: Pick<Navigator, 'platform' | 'userAgent'>): string {
  return isMacPlatform(nav) ? '⌘ K' : 'Ctrl K';
}

/**
 * Ctrl+K (ou Cmd+K). Não intercepta no editor Monaco, que usa Ctrl+K como prefixo de acordes.
 * Em campos de texto comuns ainda abre (padrão de Docusaurus/Algolia).
 */
export function matchSearchShortcut(event: KeyboardEvent): SearchOpenRequest | null {
  const isK = typeof event.key === 'string' && event.key.toLowerCase() === 'k';

  if (!isK || event.altKey || event.shiftKey || !(event.ctrlKey || event.metaKey)) return null;

  const target = event.target as Element | null;

  if (target?.closest?.('.monaco-editor')) return null;

  return { via: 'shortcut', shortcutKey: event.metaKey ? 'cmd_k' : 'ctrl_k' };
}

/**
 * Escuta o teclado fora da zona (uma tecla qualquer não dispara detecção de mudanças)
 * e só entra na zona quando o atalho casa.
 * @returns função que remove o listener
 */
export function listenSearchShortcut(
  zone: NgZone,
  onShortcut: (request: SearchOpenRequest) => void,
  doc: Document = document
): () => void {
  const handler = (event: KeyboardEvent) => {
    const request = matchSearchShortcut(event);

    if (request) {
      event.preventDefault();
      zone.run(() => onShortcut(request));
    }
  };

  zone.runOutsideAngular(() => doc.addEventListener('keydown', handler));

  return () => doc.removeEventListener('keydown', handler);
}
