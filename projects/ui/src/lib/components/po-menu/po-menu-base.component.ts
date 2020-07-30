import { Input, Directive } from '@angular/core';

import {
  browserLanguage,
  convertToBoolean,
  convertToInt,
  isExternalLink,
  isTypeof,
  poLocaleDefault,
  validValue,
  uuid
} from '../../utils/util';

import { PoMenuFilter } from './po-menu-filter/po-menu-filter.interface';
import { PoMenuItem } from './po-menu-item.interface';
import { PoMenuService } from './services/po-menu.service';

export const poMenuLiteralsDefault = {
  en: { itemNotFound: 'Item not found.' },
  es: { itemNotFound: 'Elemento no encontrado.' },
  pt: { itemNotFound: 'Item não encontrado.' }
};

/**
 * @description
 *
 * Este é um componente de menu lateral que é utilizado para navegação nas páginas de uma aplicação.
 *
 * O componente po-menu recebe uma lista de objetos do tipo `MenuItem` com as informações dos itens de menu como
 * textos, links para redirecionamento, ações, até 4 níveis de menu e ícones para o primeiro nível de menu.
 */
@Directive()
export abstract class PoMenuBaseComponent {
  private _collapsed = false;
  private _filter = false;
  private _level;
  private _logo: string;
  private _maxLevel = 4;
  private _menus = [];
  private _params: any;
  private _service: string | PoMenuFilter;
  private _shortLogo: string;

  allowIcons: boolean;
  allowCollapseMenu: boolean;

  filteredItems;
  filterService: PoMenuFilter;

  readonly literals = {
    ...poMenuLiteralsDefault[poLocaleDefault],
    ...poMenuLiteralsDefault[browserLanguage()]
  };

  /**
   * @optional
   *
   * @description
   *
   * Colapsa (retrai) o menu e caso receba o valor `false` expande o menu.
   *
   * > Utilize esta propriedade para iniciar o menu colapsado.
   *
   * > Ao utilizar os métodos [`colapse`](documentation/po-menu#colapseMethod), [`expand`](documentation/po-menu#expandMethod) e
   * [`toggle`](documentation/po-menu#toggleMethod) o valor desta propriedade não é alterado.
   *
   * **Importante:**
   *
   * > O menu será colapsado/expandido apenas se todos os itens de menu tiverem valor nas propriedades `icon` e `shortLabel`.
   *
   * @default `false`
   */
  @Input('p-collapsed') set collapsed(collapsed: boolean) {
    this._collapsed = convertToBoolean(collapsed);

    this.validateCollapseClass();
  }

  get collapsed() {
    return this._collapsed;
  }

  /** Lista dos itens do menu. Se o valor estiver indefinido ou inválido, será inicializado como um array vazio. */
  @Input('p-menus') set menus(menus: Array<PoMenuItem>) {
    this._menus = Array.isArray(menus) ? menus : [];
  }

  get menus() {
    return this._menus;
  }

  get maxLevel() {
    return this._maxLevel;
  }

  /**
   * @optional
   *
   * @description
   *
   * Habilita um campo para pesquisa no menu.
   * A pesquisa é realizada em todos os níveis do menu e busca apenas pelos itens que contém uma ação e/ou link definidos,
   * ou também, pode ser realizada através de um serviço definido na propriedade `p-service`.
   *
   * > O campo de pesquisa é desabilitado se o menu estiver colapsado.
   *
   * @default `false`
   */
  @Input('p-filter') set filter(filter: boolean) {
    this._filter = <any>filter === '' ? true : convertToBoolean(filter);
    this.filteredItems = [...this._menus];
  }

  get filter() {
    return this._filter;
  }

  /**
   * @optional
   *
   * @description
   *
   * Nesta propriedade deve ser informada a URL do serviço em que será utilizado para realizar o filtro de itens do
   * menu quando realizar uma busca. Caso haja a necessidade de customização, pode ser informado um
   * serviço implementando a interface `PoMenuFilter`.
   *
   * Caso utilizada uma URL, o serviço deve retornar os dados conforme o
   * [Guia de implementação de APIs](https://po-ui.io/guides/api) do PO UI.
   *
   * Quando utilizada uma URL de serviço, será realizado um *GET* na URL informada, passando o valor digitado
   * no parâmetro `search`, veja exemplo:
   *
   * > O filtro no serviço será realizado caso contenha no mínimo três caracteres no campo de busca, por exemplo `tot`.
   *
   * ```
   * <po-menu p-service="/api/v1/fnd/menu">
   * </po-menu>
   *
   * Requisição: GET /api/v1/fnd/menu?search=contas
   * ```
   *
   * > É necessário que propriedade `p-filter` esteja habilitada.
   */
  @Input('p-service') set service(value: string | PoMenuFilter) {
    this._service = value || undefined;

    this.configService(this.service);
  }

  get service() {
    return this._service;
  }

  /**
   * @optional
   *
   * @description
   *
   * Deve ser informado um objeto que deseja-se utilizar na requisição de filtro dos itens de menu.
   *
   * Caso utilizado um serviço customizado, implementando a interface `PoMenuFilter`, o valor desta propriedade
   * será passado como parâmetro, na função `getFilteredData`.
   *
   * Quando utilizada uma URL de serviço, será realizado um *GET* na URL informada, passando os valores informados
   * nesta propriedade em conjunto com o parâmetro `search`, veja exemplo:
   *
   * ```
   * <po-menu p-service="/api/v1/fnd/menu" [p-params]="{ company: 1, user: 297767512 }">
   * </po-menu>
   *
   * Requisição: GET /api/v1/fnd/menu?search=contas&company=1&user=297767512
   * ```
   */
  @Input('p-params') set params(value: any) {
    this._params = value && isTypeof(value, 'object') ? value : undefined;
  }

  get params() {
    return this._params;
  }

  /**
   * @optional
   *
   * @description
   *
   * Caminho para a logomarca, que será exibida quando o componente estiver expandido, localizada na parte superior.
   *
   * > **Importante:**
   * - Caso esta propriedade estiver indefinida ou inválida o espaço para logomarca será removido.
   * - Como boa prática, indica-se utilizar imagens com até `24px` de altura e `224px` de largura,
   * caso ultrapassar esses valores a imagem será readequada no espaço disponível.
   */
  @Input('p-logo') set logo(value: any) {
    this._logo = isTypeof(value, 'string') && value.trim() ? value : undefined;
  }

  get logo() {
    return this._logo;
  }

  /**
   * @optional
   *
   * @description
   *
   * Caminho para a logomarca, que será exibida quando o componente estiver colapsado, localizada na parte superior.
   *
   * > **Importante:**
   * - Caso esta propriedade estiver indefinida ou inválida passa a assumir o valor informado na propriedade `p-logo` e na ausência desta o
   * espaço para logomarca será removido.
   * - Como boa prática, indica-se utilizar imagens com até `48px` de altura e `48px` de largura,
   * caso ultrapassar esses valores a imagem será readequada no espaço disponível.
   * - Caso não informar um valor, esta propriedade passa a assumir o valor informado na propriedade `p-logo`.
   */
  @Input('p-short-logo') set shortLogo(value: any) {
    this._shortLogo = isTypeof(value, 'string') && value.trim() ? value : undefined;
  }

  get shortLogo() {
    return this._shortLogo;
  }

  constructor(public menuService: PoMenuService) {}

  private configService(service: string | PoMenuFilter) {
    if (typeof service === 'string' && service.trim()) {
      // service url
      this.menuService.configProperties(service);
      this.filterService = this.menuService;
    } else if (typeof service === 'object' && service.getFilteredData) {
      // custom service
      this.filterService = service;
    } else {
      this.filterService = undefined;
    }
  }

  protected setMenuExtraProperties() {
    this.allowIcons = !!this.menus.length;
    this.allowCollapseMenu = !!this.menus.length;

    this.menus.forEach(menuItem => {
      this._level = 1;
      this.allowIcons = this.allowIcons ? validValue(menuItem.icon) : false;
      this.allowCollapseMenu = this.allowCollapseMenu && this.allowIcons ? validValue(menuItem.shortLabel) : false;
      this.removeBadgeAlert(menuItem);
      this.setMenuItemProperties(menuItem);

      if (menuItem.subItems) {
        this._level++;
        this.processSubItems(menuItem);
      }
    });
  }

  protected setMenuItemProperties(menuItem: PoMenuItem): void {
    menuItem['id'] = menuItem['id'] || uuid();
    menuItem['level'] = this._level;
    menuItem['type'] = this.setMenuType(menuItem);
  }

  protected validateMenus(menus): void {
    menus.forEach(menu => this.validateMenu(menu));
  }

  private processSubItems(menu) {
    menu.subItems.forEach((menuItem, index, menuItems) => {
      const previousItem = menuItems[index - 1];
      if (previousItem && previousItem.subItems) {
        this._level = previousItem['level'];
      }

      if (this._level <= this.maxLevel) {
        this.setMenuItemProperties(menuItem);

        if (menuItem.subItems) {
          this._level++;
          this.processSubItems(menuItem);
        }
      }

      if (!menu['badgeAlert']) {
        menu = this.setMenuBadgeAlert(menu, menuItem);
      }
    });

    menu.subItems = Object.assign([], menu.subItems);
  }

  private removeBadgeAlert(menuItem: PoMenuItem): void {
    if (menuItem['badgeAlert']) {
      delete menuItem['badgeAlert'];
    }

    if (menuItem.subItems) {
      menuItem.subItems.forEach(subItem => this.removeBadgeAlert(subItem));
    }
  }

  private setMenuBadgeAlert(parent: PoMenuItem, child: PoMenuItem): PoMenuItem {
    const childHasSubItems = child.subItems && child.subItems.length;
    const childHasBadgeAlert = child['badgeAlert'];
    const childHasBadge = child.badge && convertToInt(child.badge.value) >= 0;

    parent['badgeAlert'] = childHasBadgeAlert || (childHasBadge && !childHasSubItems);

    return parent;
  }

  private setMenuType(menuItem: PoMenuItem): string {
    if (menuItem.subItems && menuItem.subItems.length > 0 && this._level < this.maxLevel) {
      return 'subItems';
    }
    if (!menuItem.link) {
      return 'noLink';
    }
    if (isExternalLink(menuItem.link)) {
      return 'externalLink';
    }
    return 'internalLink';
  }

  private validateMenu(menuItem: PoMenuItem): void {
    if (!menuItem.label || menuItem.label.trim() === '') {
      throw new Error('O atributo PoMenuItem.label não pode ser vazio.');
    } else if (menuItem.subItems) {
      menuItem.subItems.forEach(subItem => {
        this.validateMenu(subItem);
      });
    }
  }

  protected abstract validateCollapseClass();
}
