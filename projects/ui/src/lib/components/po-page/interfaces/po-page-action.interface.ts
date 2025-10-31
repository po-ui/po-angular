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
export interface PoPageAction extends PoDropdownAction {}
