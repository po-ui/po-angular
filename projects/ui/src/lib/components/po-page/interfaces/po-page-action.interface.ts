import { PoDropdownAction } from '../../po-dropdown';

/**
 * @description
 *
 * Interface para as ações dos componentes `po-page-default` e `po-page-list`.
 *
 * As ações podem ser exibidas como botões no cabeçalho ou agrupadas em um *dropdown*,
 * conforme o `PoPageActionsLayout` e o tamanho da tela.
 *
 * > As propriedades `separator`, `selected` e `subItems` possuem efeito apenas quando
 * a ação é exibida dentro do *dropdown*.
 *
 * @docsExtends PoDropdownAction
 *
 * @ignoreExtendedDescription
 *
 * @usedBy PoPageDefaultComponent, PoPageListComponent
 */
export interface PoPageAction extends PoDropdownAction {
  /**
   * @optional
   *
   * @description
   *
   * Define o estilo visual da ação quando exibida como botão fora do *dropdown*.
   *
   * Valores permitidos:
   * - `primary`: botão com maior destaque visual.
   * - `secondary`: estilo padrão.
   *
   * > Valores inválidos são ignorados e o componente aplica o estilo padrão da posição.
   *
   * > Somente uma ação pode ter `kind` igual a `primary`. Caso mais de uma defina `primary`,
   * apenas a primeira será mantida e as demais receberão `secondary`.
   *
   * > Quando não definido, o estilo é determinado pelo `PoPageActionsLayout`.
   */
  kind?: string;
}
