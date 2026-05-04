import { PoPopupAction } from '../po-popup/po-popup-action.interface';

/**
 * @description
 *
 * Interface para as ações do componente `po-dropdown`.
 *
 * @docsExtends PoPopupAction
 *
 * @usedBy PoDropdownComponent
 */
export interface PoDropdownAction extends PoPopupAction {
  /**
   * @optional
   *
   * @description
   *
   * Array de ações (`PoDropdownAction`) usado para criar agrupadores de subitens (submenus).
   *
   * > Recomenda-se limitar a navegação a, no máximo, três níveis hierárquicos.
   */
  subItems?: Array<PoDropdownAction>;
}
