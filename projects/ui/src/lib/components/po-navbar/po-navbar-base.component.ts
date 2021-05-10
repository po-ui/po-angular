import { Input, Directive } from '@angular/core';

import { convertToBoolean } from '../../utils/util';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { poLocaleDefault } from '../../services/po-language/po-language.constant';
import { PoMenuComponent } from '../po-menu';

import { PoNavbarIconAction } from './interfaces/po-navbar-icon-action.interface';
import { PoNavbarItem } from './interfaces/po-navbar-item.interface';
import { PoNavbarLiterals } from './interfaces/po-navbar-literals.interface';

export const poNavbarLiteralsDefault = {
  en: <PoNavbarLiterals>{
    navbarLinks: 'Navbar links'
  },
  es: <PoNavbarLiterals>{
    navbarLinks: 'Navbar links'
  },
  pt: <PoNavbarLiterals>{
    navbarLinks: 'Navbar links'
  },
  ru: <PoNavbarLiterals>{
    navbarLinks: 'Navbar связи'
  }
};

/**
 * @description
 *
 * O componente `po-navbar` é um cabeçalho fixo que permite apresentar uma lista de links para facilitar a navegação pelas
 * páginas da aplicação. Também possui ícones com ações.
 *
 * Quando utilizado em uma resolução menor que `768px`, o componente utilizará o menu corrente da aplicação para
 * incluir seus itens.
 *
 * Ao utilizar Navbar com Menu e ambos tiverem logo, será mantido o logo do Navbar.
 */
@Directive()
export abstract class PoNavbarBaseComponent {
  private _iconActions: Array<PoNavbarIconAction> = [];
  private _items: Array<PoNavbarItem> = [];
  private _literals: PoNavbarLiterals;
  private _logo: string;
  private _menu: PoMenuComponent;
  private _shadow: boolean = false;
  private language: string = poLocaleDefault;

  // Menu que esta sendo exibido na pagina corrente.
  applicationMenu: PoMenuComponent;

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
   * > O objeto padrão de literais será traduzido de acordo com o idioma do
   * [`PoI18nService`](/documentation/po-i18n) ou do browser.
   */
  @Input('p-literals') set literals(value: PoNavbarLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...poNavbarLiteralsDefault[poLocaleDefault],
        ...poNavbarLiteralsDefault[this.language],
        ...value
      };
    } else {
      this._literals = poNavbarLiteralsDefault[this.language];
    }
  }
  get literals() {
    return this._literals || poNavbarLiteralsDefault[this.language];
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

    if (this.applicationMenu) {
      this.validateMenuLogo();
    }
  }
  get logo() {
    return this._logo;
  }

  /**
   * @deprecated 6.x.x
   *
   * @optional
   *
   * @description
   * **Depreciado 6.x.x**
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

  constructor(languageService: PoLanguageService) {
    this.language = languageService.getShortLanguage();
  }

  protected abstract validateMenuLogo(): void;
}
