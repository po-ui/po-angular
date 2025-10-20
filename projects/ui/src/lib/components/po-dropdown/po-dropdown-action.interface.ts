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
   *
   * > Boas práticas de desenvolvimento:
   * Recomenda-se limitar a navegação a, no máximo, três níveis hierárquicos.
   * Isso evita sobrecarga cognitiva, facilita a memorização da estrutura e garante uma melhor experiência de uso.
   */
  subItems?: Array<PoDropdownAction>;
}
