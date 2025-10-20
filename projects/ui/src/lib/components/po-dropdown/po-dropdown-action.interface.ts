import { PoPopupAction } from '../po-popup/po-popup-action.interface';

/**
 * @description
 * Interface do componente po-dropdown
 *
 * @docsExtends PoPopupAction
 *
 * @usedBy PoDropdownComponent
 */
export interface PoDropdownAction extends PoPopupAction {
  /**
   * Array de ações (`PoDropdownAction`) usado para criar agrupadores de subitens.
   *
   * - Permite a criação de menus aninhados (submenus).
   * - O limite máximo de níveis de subitens é **3** (menu principal + 2 níveis de agrupadores).
   */
  subItems?: Array<PoDropdownAction>;
}
