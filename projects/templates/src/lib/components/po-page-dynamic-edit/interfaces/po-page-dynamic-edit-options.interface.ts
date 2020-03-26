import { PoBreadcrumb } from '@po-ui/ng-components';

import { PoPageDynamicEditField } from './po-page-dynamic-edit-field.interface';
import { PoPageDynamicEditActions } from './po-page-dynamic-edit-actions.interface';

/**
 * @usedBy PoPageDynamicEditComponent
 *
 * @description
 *
 * Interface para as propriedades de uma página dinâmica.
 */
export interface PoPageDynamicEditOptions {
  /**
   * Lista dos campos usados.
   */
  fields?: Array<PoPageDynamicEditField>;

  /**
   * Ações que o usuário poderá executar na página através de botões.
   */
  actions?: PoPageDynamicEditActions;

  /**
   * Objeto com propriedades do breadcrumb.
   */
  breadcrumb?: PoBreadcrumb;

  /**
   * Título da página.
   */
  title?: string;
}
