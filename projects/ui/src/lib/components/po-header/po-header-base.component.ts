import { Directive, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { PoLanguageService } from '../../services';
import { poLocaleDefault } from '../../services/po-language/po-language.constant';
import { convertToBoolean, isExternalLink } from '../../utils/util';
import { PoMenuItem } from '../po-menu';
import { PoHeaderActionTool } from './interfaces/po-header-action-tool.interface';
import { PoHeaderActions } from './interfaces/po-header-actions.interface';
import { PoHeaderBrand } from './interfaces/po-header-brand.interface';
import { PoHeaderLiterals } from './interfaces/po-header-literals.interface';
import { PoHeaderUser } from './interfaces/po-header-user.interface';

export const poNavbarLiteralsDefault = {
  en: <PoHeaderLiterals>{
    headerLinks: 'Header links',
    notifications: 'Notifications'
  },
  es: <PoHeaderLiterals>{
    headerLinks: 'Header links',
    notifications: 'Notificaciones'
  },
  pt: <PoHeaderLiterals>{
    headerLinks: 'Header links',
    notifications: 'Notificações'
  },
  ru: <PoHeaderLiterals>{
    headerLinks: 'Header связи',
    notifications: 'Уведомления'
  }
};

/**
 * @description
 *
 * O componente `po-header` é um cabeçalho fixo que permite apresentar itens com ações, divididos em `p-brand`, `p-menu-items`, `p-actions-tools` e `p-header-user`.
 *
 * - `p-brand`: Possibilita a inclusão de uma imagem e o titulo do header.
 * - `p-menu-items`: Possibilita a inclusão de uma lista de itens com ações ou links.
 * - `p-actions-tools`: Possibilita a inclusão de até 3 botões com ações.
 * - `p-header-user`: Possibilita a inclusão de uma imagem representando a marca e avatar.
 *
 * O componente `po-header` pode ser usado de duas formas:
 *
 * Com `po-menu` definido pelo usuário:
 * ```
 * ...
 * <po-header
 *   [p-brand]="brand"
 *   [p-menu-items]="items"
 *   [p-actions-tools]="actions"
 *   [p-header-user]="user"
 * ></po-header>
 *
 * <div class="po-wrapper">
 *   <po-menu [p-menus]="itemsMenu">
 *   </po-menu>
 *
 *   <po-page-default>
 *       <router-outlet></router-outlet>
 *   </po-page-default>
 * </div>
 * ...
 * ```
 *
 * Passando os itens diretamente para o `po-header` pela propriedade `p-menus`:
 * ```
 * ...
 * <po-header
 *   [p-brand]="brand"
 *   [p-menu-items]="items"
 *   [p-actions-tools]="actions"
 *   [p-header-user]="user"
 *   [p-menus]="itensMenu"
 * ></po-header>
 *
 * <div class="po-wrapper">
 *   <po-page-default>
 *       <router-outlet></router-outlet>
 *   </po-page-default>
 * </div>
 * ...
 * ```
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                              | Descrição                                                  | Valor Padrão                                      |
 * |------------------------------------------|------------------------------------------------------------|---------------------------------------------------|
 * | `--font-family`                          | Família tipográfica usada                                  | `var(--font-family-theme)`                        |
 * | `--font-weight`                          | Peso da fonte                                              | `var(--font-weight-bold)`                         |
 * | `--text-color`                           | Cor do texto                                               | `var(--color-neutral-dark-70)`                    |                                                                        | ---                                             |
 * | `--outline-color-focused`                | Cor do outline dos itens de sub-menu e customer            | `var(--color-neutral-dark-95)`                    |                                                                        | ---                                             |
 * | `--object-fit-brand`                     | Valor do object-fit da imagem do logo                      | `contain`                                         |                                                                        | ---                                             |
 * | `--object-fit-customer`                  | Valor do object-fit da imagem do logo na seção customer    | `contain`                                         |                                                                        | ---                                             |
 * | `--object-fit-customer-user`             | Valor do object-fit da imagem do avatar                    | `cover`                                           |                                                                        | ---                                             |
 * | **Header**                               |                                                            |                                                   |
 * | `--background-color`                     | Cor de background do header                                | `var(--color-neutral-light-05)`                   |
 * | `--border-radius-bottom-left`            | Valor do radius do lado esquerdo do header                 | `var(--border-radius-md)`                         |
 * | `--border-radius-bottom-right`           | Valor do radius do lado direito do header                  | `var(--border-radius-md)`                         |
 * | `--base shadow`                          | Cor da sombra do header                                    | `0 1px 8px rgba(0, 0, 0, 0.1)`                  |
 * | **Sub-menu**                             |                                                            |                                                   |
 * | `--border-radius`                        | Valor do radius dos itens do sub-menu                      | `var(--border-radius-md);`                        |
 * | `--text-color-submenu`                   | Cor do texto dos itens do sub-menu                         | `var(--color-brand-01-base)`                      |
 * | `--icon-color`                           | Cor do ícone do sub-menu com itens                         | `var(--color-brand-01-base)`                      |
 * | `--border-color`                         | Cor da borda                                               | `var(--color-transparent)`                        |
 * | `--shadow`                               | Contém o valor da sombra do elemento                       | `var(--shadow-none)`                              |
 * | **Sub-menu - Hover**                     |                                                            |                                                   |
 * | `--background-hover`                     | Cor de background dos itens do sub-menu no estado hover    | `var(--color-brand-01-lighter)`                   |
 * | `--icon-color-hover`                     | Cor do ícone dos itens de sub-menu no estado hover         | `var(--color-brand-01-darkest)`                   |
 * | `--text-color-hover`                     | Cor do texo dos itens de sub-menu no estado hover          | `var(--color-brand-01-darkest)`                   |
 * | **Sub-menu - pressed**                   |                                                            |                                                   |
 * | `--background-pressed`                   | Cor de background dos itens do sub-menu no estado pressed  | `var(--color-brand-01-light)`                     |
 * | `--icon-color-pressed`                   | Cor do ícone dos itens de sub-menu no estado pressed       | `var(--color-brand-01-darkest)`                   |
 * | `--text-color-pressed`                   | Cor do texo dos itens de sub-menu no estado pressed        | `var(--color-brand-01-darkest)`                   |
 * | **Sub-menu - selected**                  |                                                            |                                                   |
 * | `--background-selected`                  | Cor de background dos itens do sub-menu no estado selected | `var(--color-brand-01-light)`                     |
 * | `--icon-color-selected`                  | Cor do ícone dos itens de sub-menu no estado selected      | `var(--color-neutral-dark-95)`                    |
 * | `--text-color-selected`                  | Cor do texo dos itens de sub-menu no estado selected       | `var(--color-brand-01-darkest)`                   |
 * | **Customer**                             |                                                            |                                                   |
 * | `--background-color-customer`            | Cor do background da seção customer                        | `var(--color-neutral-light-00)`                   |
 * | `--border-color`                         | Cor da borda da seção customer                             | `var(--color-neutral-light-10)`                   |
 * | `--border-style`                         | Estilo da borda da seção customer                          | `solid`                                           |
 * | `--border-width`                         | Largura da borda da seção customer                         | `var(--border-width-sm)`                          |
 * | **Customer - hover**                     |                                                            |                                                   |
 * | `--background-color-customer-hover`      | Cor do background da seção customer no estado hover        | `var(--color-brand-01-lighter)`                   |
 * | `--background-color-customer-hover`      | Cor do background da seção customer no estado hover        | `var(--color-brand-01-lighter)`                   |
 * | **Customer - pressed**                   |                                                            |                                                   |
 * | `--background-color-customer-pressed`    | Cor do background da seção customer no estado pressed      | `var(--color-brand-01-light)`                     |
 *
 */
@Directive()
export abstract class PoHeaderBaseComponent {
  private _menuItems: Array<PoHeaderActions> = [];
  public menuCollapseJoin = [];
  public menuCollapseJoinExternal = [];
  private _brand: PoHeaderBrand | string;
  private _literals: PoHeaderLiterals;
  private language: string = poLocaleDefault;

  /**
   * @optional
   *
   * @description
   *
   * Número de itens dentro do botão de overflow. Caso a largura do header não suportar a quantidade de itens passadas, um botão com itens será criado.
   * Essa propriedade possibilita a escolha de quantos itens estarão dentro do botão de overflow.
   *
   * > Ao utilizar essa propriedade o `po-header` não irá realizar o calculo automatíco de itens.
   *
   */
  @Input('p-amount-more') amountMore?: number;

  /**
   * @optional
   *
   * @description
   *
   * Esconde o botão de menu colapsado.
   *
   */
  @Input('p-hide-button-menu') hideButtonMenu?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Habilita campo para filtrar itens no menu
   *
   */
  @Input({ alias: 'p-filter-menu', transform: convertToBoolean }) filterMenu?: boolean;

  //Habilita apenas o evento ao clicar no menu hamburguer desabilitando o side-menu lateral
  @Input('p-side-menu-only-action') sideMenuOnlyAction?: boolean = false;

  //Habilita mais de 3 itens na seção de tools.
  //Propriedade para uso interno, não indicamos uso dessa propriedade
  @Input('p-force-actions-tools') forceActionTools?: boolean = false;

  //propriedade interna
  @Input('p-not-change-context') notChangeContext?: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Propriedade para configurar a seção de brand do `po-header`
   *
   * Caso seja enviada uma string, apenas o logo sera mostrado com o valor da string passada.
   *
   */
  @Input('p-brand')
  set brand(value: PoHeaderBrand | string) {
    if (typeof value === 'string') {
      this._brand = { logo: value, link: '/' };
    } else {
      this._brand = {
        ...value,
        link: value?.link || '/'
      };
    }
  }

  get brand(): PoHeaderBrand | string {
    return this._brand;
  }

  /**
   * @optional
   *
   * @description
   *
   * Propriedade para configurar a seção de tools do `po-header`
   *
   * > Máximo de 3 itens, o componente irá ignorar os itens caso seja mandado mais itens que o suportado.
   *
   */
  @Input('p-actions-tools') actionsTools: Array<PoHeaderActionTool> = [];

  /**
   * @optional
   *
   * @description
   *
   * Propriedade para configurar a seção de headerUser do `po-header`
   *
   */
  @Input('p-header-user') headerUser: PoHeaderUser;

  /**
   * @optional
   *
   * @description
   *
   * Propriedade para configurar a seção de menu do `po-header`.
   * Cada item pode receber uma label e uma ação
   *
   * > Os itens irão ficar visíveis em uma tela de até 960px
   *
   */
  @Input('p-menu-items') set menuItems(items: Array<PoHeaderActions>) {
    this._menuItems = items.map(item => ({
      ...item,
      id: item.id || this.generateRandomId(),
      $internalRoute: item.link && !isExternalLink(item.link) ? true : false
    }));
  }

  /**
   * @optional
   *
   * @description
   *
   * Lista dos itens do menu. Se o valor estiver indefinido ou inválido, será inicializado como um array vazio.
   *
   * > O menu poderá ser aberto via botão hamburguer quando a tela tiver menos que 960px
   *
   */
  @Input('p-menus') menuCollapse: Array<PoMenuItem> = [];

  /**
   * @optional
   *
   * @description
   *
   * Template customiado que será renderizado após os itens definidos na propriedade `p-menu-items`
   *
   */
  @Input('p-header-template') headerTemplate: TemplateRef<any>;

  /**
   * @optional
   *
   * @description
   *
   * Objeto com a literal usada na propriedade `p-literals`.
   *
   * Para customizar a literal, basta declarar um objeto do tipo `PoHeaderLiterals` conforme exemplo abaixo:
   *
   * ```
   *  const customLiterals: PoHeaderLiterals = {
   *    headerLinks: 'Itens de navegação',
   *    notifications: 'Mensagens'
   *  };
   * ```
   *
   * E para carregar as literais customizadas, basta apenas passar o objeto para o componente.
   *
   * ```
   * <po-header
   *   [p-literals]="customLiterals">
   * </po-header>
   * ```
   *
   * > O objeto padrão de literais será traduzido de acordo com o idioma do
   * [`PoI18nService`](/documentation/po-i18n) ou do browser.
   */
  @Input('p-literals') set literals(value: PoHeaderLiterals) {
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
   * Evento emitido ao clicar no botão para colapsar ou expandir menu.
   *
   */
  @Output('p-colapsed-menu') colapsedMenuEvent = new EventEmitter();

  constructor(languageService: PoLanguageService) {
    this.language = languageService.getShortLanguage();
  }

  get menuItems(): Array<PoHeaderActions> {
    return this._menuItems;
  }

  private generateRandomId(): string {
    return String(Math.floor(Math.random() * 9999 + 1));
  }
}
