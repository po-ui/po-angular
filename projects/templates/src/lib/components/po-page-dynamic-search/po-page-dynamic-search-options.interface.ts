import { PoDynamicFormField, PoBreadcrumb, PoPageAction } from '@portinari/portinari-ui';

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
  filters?: Array<PoDynamicFormField>;

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
}
