import { PoSearchComponent } from '@po-ui/ng-components';

/**
 * Escreve no `po-search` o texto compartilhado (`SearchService.text`) quando ele veio do outro campo.
 * Dispara `input` para o `po-search` atualizar o próprio estado (botão de limpar); o eco que volta pelo
 * `p-change-model` tem o mesmo texto e é ignorado por quem escuta (`value === service.text()`).
 */
export function syncSearchInput(search: PoSearchComponent | undefined, text: string): void {
  const input = search?.poSearchInput?.nativeElement as HTMLInputElement | undefined;

  if (!input || input.value === text) return;

  input.value = text;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}
