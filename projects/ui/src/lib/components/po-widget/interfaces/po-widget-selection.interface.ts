/**
 * @docsPrivate
 *
 * @usedBy PoWidgetComponent
 *
 * @description
 *
 * Interface de uso **interno**, para o `po-list-view`, que descreve a coluna de seleção
 * (checkbox/radio) exibida à esquerda do conteúdo do `po-widget`.
 *
 */
export interface PoWidgetSelection {
  /**
   * Tipo do controle de seleção:
   * - `single`: exibe um `po-radio`.
   * - `multiple`: exibe um `po-checkbox`.
   */
  type: 'single' | 'multiple';

  /** Indica se o item está selecionado. */
  selected?: boolean;

  /** Callback executado quando a seleção muda. Recebe o novo estado (`boolean`). */
  change?: (selected: boolean) => void;
}
