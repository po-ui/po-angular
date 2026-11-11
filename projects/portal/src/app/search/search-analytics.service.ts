import { Injectable } from '@angular/core';

/** Eventos de domínio da busca (ver `docs-study/global-search-analytics-plan.md`, seção 4). */
export type SearchEvent =
  | {
      name: 'search_open';
      via: 'header' | 'shortcut' | 'icon_mobile';
      surface: 'popover' | 'modal';
      shortcutKey?: 'ctrl_k' | 'cmd_k';
    }
  | { name: 'search_query'; term: string; resultsCount: number }
  | { name: 'search_no_results'; term: string }
  | {
      name: 'search_result_click';
      term: string;
      position: number;
      resultType: string;
      resultId: string;
      input: 'mouse' | 'keyboard';
      msToClick: number;
    }
  | { name: 'search_abandon'; termLength: number; resultsCount: number; reason: 'esc' | 'outside' | 'navigate_away' }
  | { name: 'search_index_error'; chunk: string; status?: number };

/**
 * Ganchos de analytics da busca. No MVP não faz nada: sem rede, sem cookie.
 * shortcut: no-op, trocar por um destino real (ex.: GA4 via InjectionToken) só depois da decisão de
 * destino, base legal e consentimento; o termo buscado é texto livre e pode ter dado pessoal.
 */
@Injectable({ providedIn: 'root' })
export class SearchAnalyticsService {
  track(_event: SearchEvent): void {}
}
