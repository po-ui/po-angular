/**
 * @usedBy PoPageDefaultComponent
 *
 * @description
 *
 * Enum que define os layouts de ações disponíveis no `po-page-default`.
 *
 * > Compatível com todos os valores de `PoPageHeaderType` (`primary`, `secondary` e `tertiary`).
 *
 * Define os layouts de exibição das ações no cabeçalho.
 */
export enum PoPageActionsLayout {
  /**
   * Comportamento padrão: as ações são exibidas como botões (até 3 em desktop e 2 em mobile)
   * e as demais são agrupadas no *dropdown*.
   */
  default = 'default',

  /** Todas as ações são agrupadas exclusivamente dentro do menu *dropdown*. */
  dropdown = 'dropdown',

  /**
   * A primeira ação é exibida como um botão de destaque e todas as demais são movidas para o *dropdown*.
   */
  mixed = 'mixed'
}
