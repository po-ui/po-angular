import { Input, Directive } from '@angular/core';

import { browserLanguage, convertToBoolean, poLocaleDefault } from '../../utils/util';

import { PoMenuComponent } from '../po-menu';
import { PoNavbarIconAction } from './interfaces/po-navbar-icon-action.interface';
import { PoNavbarItem } from './interfaces/po-navbar-item.interface';
import { PoNavbarLiterals } from './interfaces/po-navbar-literals.interface';

export const poNavbarLiteralsDefault = {
  en: <PoNavbarLiterals> {
    navbarLinks: 'Navbar links'
  },
  es: <PoNavbarLiterals> {
    navbarLinks: 'Navbar links'
  },
  pt: <PoNavbarLiterals> {
    navbarLinks: 'Navbar links'
  },
  ru: <PoNavbarLiterals> {
    navbarLinks: 'Navbar связи'
  }
};

/**
 * @description
 *
 * O componente `po-navbar` é um cabeçalho fixo que permite apresentar uma lista de links para facilitar a navegação pelas
 * páginas da aplicação. Também possui ícones com ações.
 */
@Directive()
export abstract class PoNavbarBaseComponent {

  private _iconActions: Array<PoNavbarIconAction> = [];
  private _items: Array<PoNavbarItem> = [];
  private _literals: PoNavbarLiterals;
  private _logo: string;
  private _shadow: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define uma lista de ações apresentadas em ícones no lado direito do `po-navbar`.
   */
  @Input('p-icon-actions') set iconActions(value: Array<PoNavbarIconAction>) {
    this._iconActions = Array.isArray(value) ? value : [];
  }

  get iconActions(): Array<PoNavbarIconAction> {
    return this._iconActions;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define uma lista de items do `po-navbar`.
   */
  @Input('p-items') set items(value: Array<PoNavbarItem>) {
    this._items = Array.isArray(value) ? value : [];
  }

  get items(): Array<PoNavbarItem> {
    return this._items;
  }

  /**
   * @optional
   *
   * @description
   *
   * Objeto com a literal usada na propriedade `p-literals`.
   *
   * Para customizar a literal, basta declarar um objeto do tipo `PoNavbarLiterals` conforme exemplo abaixo:
   *
   * ```
   *  const customLiterals: PoNavbarLiterals = {
   *    navbarLinks: 'Itens de navegação'
   *  };
   * ```
   *
   * E para carregar as literais customizadas, basta apenas passar o objeto para o componente.
   *
   * ```
   * <po-navbar
   *   [p-literals]="customLiterals">
   * </po-navbar>
   * ```
   *
   *  > O objeto padrão de literais será traduzido de acordo com o idioma do *browser* (pt, en, es).
   */
  @Input('p-literals') set literals(value: PoNavbarLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...poNavbarLiteralsDefault[poLocaleDefault],
        ...poNavbarLiteralsDefault[browserLanguage()],
        ...value
      };
    } else {
      this._literals = poNavbarLiteralsDefault[browserLanguage()];
    }
  }
  get literals() {
    return this._literals || poNavbarLiteralsDefault[browserLanguage()];
  }

  /**
   * @optional
   *
   * @description
   *
   * Define a logo apresentada `po-navbar`.
   */
  @Input('p-logo') set logo(value: string) {
    this._logo = value;

    if (this.menu) {
      this.validateMenuLogo();
    }
  }
  get logo() {
    return this._logo;
  }

  /**
   * @optional
   *
   * @description
   *
   * Caso já possua um menu na aplicação o mesmo deve ser repassado para essa propriedade para que quando entre em modo
   * responsivo os items do `po-navbar` possam ser adicionados no primeiro item do menu definido.
   *
   * > Ao utilizar menu e navbar com logo mantém apenas a logo do navbar.
   *
   * Exemplo:
   *
   * ```
   * <po-navbar
   *  [p-items]="items"
   *  [p-icon-actions]="iconActions"
   *  [p-menu]="userMenu">
   * </po-navbar>
   * <div class="po-wrapper">
   *  <po-menu #userMenu
   *   [p-menus]="[{ label: 'Item 1', link: '/' }]">
   *  </po-menu>
   * </div>
   * ```
   */
  @Input('p-menu') menu?: PoMenuComponent;

  /**
   * @optional
   *
   * @description
   *
   * Aplica uma sombra na parte inferior do `po-navbar`.
   *
   * @default `false`
   */
  @Input('p-shadow') set shadow(value: boolean) {
    this._shadow = convertToBoolean(value);
  }

  get shadow(): boolean {
    return this._shadow;
  }

  protected abstract validateMenuLogo(): void;

}
