import { PoDropdownAction } from '../../po-dropdown';

/**
 * @description
 * Interface para as ações dos componentes po-page-default e po-page-list.
 *
 * > Quando o array de actions possui quatro ou mais registros, os dois últimos e os seguintes são automaticamente agrupados no po-dropdown.
 * A partir desse ponto, as propriedades `selected`, `separator`, `type` e `subItems` passam a ter efeito apenas nas ações exibidas dentro do dropdown, ou seja, a partir da terceira ação.
 * Dessa forma, o uso de subItems (agrupadores dentro do dropdown) só terá efeito quando houver pelo menos quatro ações definidas.
 *
 * @docsExtends PoDropdownAction
 *
 * @ignoreExtendedDescription
 *
 * @usedBy PoPageDefaultComponent, PoPageListComponent
 */
export interface PoPageAction extends PoDropdownAction {
  /**
   * Define o estilo visual do botão da ação. Valores: `primary`, `secondary`, `tertiary`.
   *
   * Compatível com `PoPageHeaderType`:
   * - `secondary`: o `kind` de cada ação é definido individualmente (padrão: `secondary`).
   * - `tertiary`: o `kind` de cada ação é definido individualmente (padrão: `secondary`).
   * - `primary`: a primeira ação é sempre `primary` e as demais `secondary` (comportamento atual mantido).
   *   A propriedade `kind` não tem efeito no header `primary`.
   */
  kind?: string;
}
