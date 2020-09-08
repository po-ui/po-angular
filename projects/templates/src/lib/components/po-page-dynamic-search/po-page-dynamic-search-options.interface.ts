import { PoBreadcrumb, PoPageAction } from '@po-ui/ng-components';
import { PoPageDynamicSearchFilters } from './po-page-dynamic-search-filters.interface';

/**
 * @usedBy PoPageDynamicSearchComponent
 *
 * @description
 *
 * Interface para a customização de uma página dinâmica.
 */
export interface PoPageDynamicSearchOptions {
  /**
   * Lista dos campos usados na busca avançada. Caso não seja passado a busca avançada não será exibida.
   *
   * Caso precise alterar um filtro que já exista deve ser passado o atributo `property` com o mesmo conteúdo do original.
   */
  filters?: Array<PoPageDynamicSearchFilters>;

  /**
   * Lista de ações que o usuário poderá executar na página através de botões.
   *
   * Caso precise alterar uma ação que já exista deve ser passado o atributo `label` com o mesmo conteúdo do original.
   */
  actions?: Array<PoPageAction>;

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
   * Mantém na modal de busca avançada os valores preenchidos do último filtro realizado pelo usuário.
   *
   * Caso esse atributo seja utilizado ele sempre irá substituir o original.
   */
  keepFilters?: boolean;

  /**
   * Permite a utilização da pesquisa rápida junto com a pesquisa avançada.
   *
   * Desta forma, ao ter uma pesquisa avançada estabelecida e ser
   * preenchido a pesquisa rápida, o filtro será concatenado adicionando a pesquisa
   * rápida também na lista de disclaimers.
   *
   * > Os valores que são emitidos no `p-quick-search` e no `p-advanced-search`
   * permanecem separados durante a emissão dos valores alterados. A concatenação
   * é apenas nos `disclaimers`.
   */
  concatFilters?: boolean;

  /**
   * Largura do campo de busca, utilizando o *Grid System*,
   * e limitado ao máximo de 6 colunas. O tamanho mínimo é controlado
   * conforme resolução de tela para manter a consistência do layout.
   */
  quickSearchWidth?: number;
}
