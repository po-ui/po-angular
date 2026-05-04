/**
 * @usedBy PoPageDefaultComponent
 *
 * @description
 *
 * Define os layouts de exibição das ações no cabeçalho do `po-page-default`.
 *
 * > Compatível com todos os valores de `PoPageHeaderType`.
 */
export enum PoPageActionsLayout {
  /**
   * Exibe as ações como botões (até 3 em desktop e 2 em mobile), agrupando as demais no *dropdown*.
   *
   * Quando `PoPageAction.kind` não é definido, a primeira ação recebe o estilo `primary`
   * e as demais recebem `secondary`.
   */
  default = 'default',

  /**
   * Agrupa todas as ações exclusivamente dentro do menu *dropdown*.
   */
  dropdown = 'dropdown',

  /**
   * Exibe a primeira ação como botão e agrupa as demais no *dropdown*.
   */
  mixed = 'mixed'
}
