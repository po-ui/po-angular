import type { Type } from '@angular/core';

/**
 * Carrega, sob demanda, o componente de exemplo indicado (ex.: 'po-avatar').
 *
 * O módulo com os exemplos é importado dinamicamente (`import()`), mantendo-os num chunk separado,
 * fora do bundle de quem usa. Retorna `undefined` quando não existe exemplo para o nome.
 */
export async function loadPreviewSampleComponent(name: string): Promise<Type<unknown> | undefined> {
  const { PREVIEW_SAMPLES } = await import('./preview-samples');
  return PREVIEW_SAMPLES[name];
}
