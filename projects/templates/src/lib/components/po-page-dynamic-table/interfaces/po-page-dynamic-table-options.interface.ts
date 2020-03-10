import { PoBreadcrumb } from '@portinari/portinari-ui';

import { PoPageDynamicTableField } from './po-page-dynamic-table-field.interface';
import { PoPageDynamicTableActions } from './po-page-dynamic-table-actions.interface';

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
  fields?: Array<PoPageDynamicTableField>;

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
}
