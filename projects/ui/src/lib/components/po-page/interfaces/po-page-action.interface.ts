import { PoDropdownAction } from '../../po-dropdown';

/**
 * @description
 *
 * Interface para as ações dos componentes `po-page-default` e `po-page-list`.
 *
 * As ações são exibidas como botões no cabeçalho e, caso excedam o limite de exibição ou o layout
 * seja configurado para tal, são agrupadas automaticamente em um *dropdown*.
 *
 * **Regras de exibição e agrupamento:**
 * - Propriedades como `selected`, `separator`, `type` e `subItems` possuem efeito apenas quando a ação
 * está dentro do *dropdown*.
 * - O uso de `subItems` (agrupadores) só é renderizado quando a ação é movida para o menu de overflow.
 * - O limite de botões visíveis (fora do *dropdown*) varia conforme o tamanho da tela ou a
 * propriedade `p-page-actions-layout`.
 *
 * @ignoreExtendedDescription
 *
 * @usedBy PoPageDefaultComponent, PoPageListComponent
 */
export interface PoPageAction extends PoDropdownAction {
  /**
   * @description
   *
   * Define o estilo visual da ação quando ela é exibida como um botão.
   *
   * Valores válidos:
   * - `primary`: Botão com maior destaque visual.
   * - `secondary`: Estilo padrão para a maioria das ações.
   * - `tertiary`: Botão com menor destaque (apenas texto/ícone).
   *
   * > Aplicável quando `PoPageActionsLayout` for `mixed`. No layout `default`, a primeira ação é sempre `primary`
   * e as demais `secondary`, independente do valor de `kind`.
   *
   * > Quando o header é do tipo `secondary` ou `tertiary`, o valor padrão desta propriedade passa a ser `secondary`.
   */
  kind?: string;
}
