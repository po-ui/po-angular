import { PoBreadcrumb } from '@po-ui/ng-components';

import { PoPageDynamicDetailActions } from './po-page-dynamic-detail-actions.interface';
import { PoPageDynamicDetailField } from './po-page-dynamic-detail-field.interface';

/**
 * @usedBy PoPageDynamicDetailComponent
 *
 * @description
 *
 * Interface para as propriedades de uma página dinâmica.
 */
export interface PoPageDynamicDetailOptions {
  /**
   * Lista dos campos usados no formulário de detalhe.
   *
   * Caso precise alterar um campo que já exista deve ser passado o atributo `property` com o mesmo conteúdo do original.
   */
  fields?: Array<PoPageDynamicDetailField>;

  /**
   * Ações que o usuário poderá executar na página através de botões.
   *
   * Caso precise alterar uma ação informe a propriedade que deve ser alterada segundo a interface `PoPageDynamicDetailActions`
   */
  actions?: PoPageDynamicDetailActions;

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
