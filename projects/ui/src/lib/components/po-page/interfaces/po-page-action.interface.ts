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
   * Define o estilo visual da ação quando ela é exibida como botão fora do *dropdown*.
   *
   * Valores permitidos:
   * - `primary`: Botão com maior destaque visual.
   * - `secondary`: Estilo padrão para a maioria das ações.
   *
   * > Valores inválidos são ignorados, mantendo o valor padrão da posição da ação.
   *
   * > Aplicável apenas a ações exibidas como botões (fora do *dropdown*). Ações dentro do *dropdown* não utilizam esta propriedade.
   *
   * > Funciona independentemente da posição da ação e com qualquer `PoPageHeaderType` ou `PoPageActionsLayout`.
   *
   * **Valores padrão por posição (quando `kind` não é definido):**
   * - Layout `default`: primeira ação = `primary`, demais = `secondary`.
   * - Layout `mixed`: primeira ação = `primary` (header primary) ou `secondary` (header secondary/tertiary).
   */
  kind?: string;
}
