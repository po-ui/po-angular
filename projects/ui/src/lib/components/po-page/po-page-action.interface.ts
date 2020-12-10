import { PoPopupAction } from '../po-popup/po-popup-action.interface';

/**
 * @description
 * Interface para as ações dos componentes po-page-default e po-page-list.
 *
 * > As propriedades `selected`, `separator` e `type` serão vistas a partir da terceira ação e somente quando
 * definir quatro ações ou mais.
 *
 * @docsExtends PoPopupAction
 *
 * @usedBy PoPageDefaultComponent, PoPageListComponent
 */
export interface PoPageAction extends PoPopupAction {}
