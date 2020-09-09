import { PoBreadcrumb } from '@po-ui/ng-components';

import { PoPageDynamicTableActions } from './po-page-dynamic-table-actions.interface';
import { PoPageDynamicTableFilters } from './po-page-dynamic-table-filters.interface';
import { PoPageDynamicTableCustomAction } from './po-page-dynamic-table-custom-action.interface';
import { PoPageDynamicTableCustomTableAction } from './po-page-dynamic-table-custom-table-action.interface';

/**
 * @usedBy PoPageDynamicTableComponent
 *
 * @description
 *
 * Interface para as propriedades de uma página dinâmica.
 */
export interface PoPageDynamicTableOptions {
  /**
   * Lista dos campos usados na tabela e busca avançada.
   *
   * Caso precise alterar um field que já exista deve ser passado o atributo `property` com o mesmo conteúdo do original.
   */
  fields?: Array<PoPageDynamicTableFilters>;

  /**
   * Ações que o usuário poderá executar na página através de botões.
   */
  actions?: PoPageDynamicTableActions;

  /**
   * Objeto com propriedades do breadcrumb.
   *
   * Caso esse atributo seja utilizado ele sempre irá substituir o original.
   */
  breadcrumb?: PoBreadcrumb;

  /**
   * Título da página.
   *
   * Caso esse atributo seja utilizado ele sempre irá substituir o original.
   */
  title?: string;

  /**
   * Mantém na modal de Busca Avançada os valores preenchidos do último filtro realizado pelo usuário.
   *
   * Caso esse atributo seja utilizado ele sempre irá substituir o original.
   */
  keepFilters?: boolean;

  /**
   * Permite a utilização da pesquisa rápida junto com a pesquisa avançada.
   *
   * Desta forma, ao ter uma pesquisa avançada estabelecida e ser
   * preenchido a pesquisa rápida, o filtro será concatenado adicionando a pesquisa
   * rápida também na lista de `disclaimers` a aplicando uma nova busca com a concatenação.
   *
   * Por exemplo, com os seguintes filtros aplicados:
   *   - filtro avançado: `{ name: 'Mike', age: '12' }`
   *   - filtro rápido: `{ search: 'paper' }`
   *
   * A requisição dos dados na API ficará com os parâmetros:
   * ```
   * page=1&pageSize=10&name=Mike&age=12&search=paper
   * ```
   */
  concatFilters?: boolean;

  /**
   * Lista de ações customizadas da página que serão incorporadas às ações informadas através da propriedade `actions`
   *
   * Essas ações ficam localizadas na parte superior da página em botões com ações.
   *
   * Exemplo de utilização:
   * ```
   * [
   *  { label: 'Export', action: this.export.bind(this) },
   *  { label: 'Print', action: this.print.bind(this) }
   * ];
   * ```
   */
  pageCustomActions?: Array<PoPageDynamicTableCustomAction>;

  /**
   * Lista de ações customizadas da tabela que serão incorporadas às ações informadas através da propriedade `actions`.
   *
   * Exemplo de utilização:
   * ```
   * [
   *  { label: 'Apply Discount', action: this.applyDiscount.bind(this) },
   *  { label: 'Details', action: this.details.bind(this) }
   * ];
   * ```
   */
  tableCustomActions?: Array<PoPageDynamicTableCustomTableAction>;

  /**
   * Largura do campo de busca, utilizando o *Grid System*,
   * e limitado ao máximo de 6 colunas. O tamanho mínimo é controlado
   * conforme resolução de tela para manter a consistência do layout.
   */
  quickSearchWidth?: number;
}
