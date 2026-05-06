import { PoPopupAction } from '../../po-popup/po-popup-action.interface';

/**
 * @description
 *
 * Interface que define as ações do componente `po-list-view`.
 *
 * > As propriedades `subItems`, `separator`, `url` e `selected` serão vistas a partir da terceira ação e somente quando
 * definir quatro ações ou mais.
 *
 * @docsExtends PoPopupAction
 *
 * @ignoreExtendedDescription
 *
 * @usedBy PoListViewComponent
 */
export interface PoListViewAction extends PoPopupAction {}
