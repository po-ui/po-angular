import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  DoCheck,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';

import { Router } from '@angular/router';

import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { getFormattedLink, isMobile, openExternalLink, uuid } from '../../utils/util';

import { PoMenuBaseComponent } from './po-menu-base.component';
import { PoMenuHeaderTemplateDirective } from './po-menu-header-template/po-menu-header-template.directive';
import { PoMenuItem } from './po-menu-item.interface';
import { PoMenuItemFiltered } from './po-menu-item/po-menu-item-filtered.interface';
import { PoMenuItemsService } from './services/po-menu-items.service';
import { PoMenuGlobalService } from './services/po-menu-global.service';
import { PoMenuService } from './services/po-menu.service';
import { PoLanguageService } from '../../services/po-language/po-language.service';

const poMenuDebounceTime = 400;
const poMenuMinLength = 3;
const poMenuRootLevel = 1;

/**
 * @docsExtends PoMenuBaseComponent
 *
 * @description
 *
 * Aparece completo em telas com largura maior que 1200px, caso contrário o menu é escondido e chamado por meio de um botão.
 *
 * O menu também pode ser colapsado. Essa opção é habilitada quando todos os itens de primeiro nível possuírem ícones e textos curtos.
 * Se colapsado, somente os itens de primeiro nível serão exibidos e, caso o item selecionado possua sub-níveis,
 * então o menu alternará novamente para o estado aberto.
 *
 * Existe a possibilidade de customizar a logomarca, que é exibida na parte superior do componente.
 *
 * E para adicionar um conteúdo personalizado entre a logomarca e o campo de filtro,
 * basta adicionar este conteúdo com a diretiva [**p-menu-header-template**](/documentation/po-menu-header-template).
 *
 * Caso utilizar o filtro de menus, é possível realizar buscas em serviço, apenas informando a URL do serviço ou a instância de
 * um serviço customizado implementando a interface `PoMenuFilter`.
 *
 * Para o menu funcionar corretamente é necessário importar o `RouterModule` e `Routes` do módulo principal de
 *  sua aplicação:
 *
 * ````
 * import { RouterModule, Routes } from '@angular/router';
 *
 * ...
 *
 * @NgModule({
 *   imports: [
 *     RouterModule,
 *     Routes,
 *     ...
 *     PoModule,
 *     ...
 *   ],
 *   declarations: [
 *     AppComponent
 *   ],
 *   providers: [],
 *   bootstrap: [AppComponent]
 * })
 * export class AppModule { }
 * ```
 *
 * Além disso é necessário criar um módulo configurando as rotas da aplicação.
 *
 * ```
 * import { NgModule } from '@angular/core';
 *
 * import { RouterModule, Routes } from '@angular/router';
 *
 * import { HelloWorldComponent } from './hello-world/hello-world.component';
 *
 * const routes: Routes = [
 *   {path: 'hello-world', component: HelloWorldComponent}
 * ];
 *
 * @NgModule({
 *   imports: [RouterModule.forRoot(routes, {useHash: true})],
 *   exports: [RouterModule]
 * })
 * export class AppRoutingModule {}
 * ```
 *
 * @example
 *
 * <example name="po-menu-basic" title="PO Menu Basic">
 *   <file name="sample-po-menu-basic/sample-po-menu-basic.component.html"> </file>
 *   <file name="sample-po-menu-basic/sample-po-menu-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-menu-labs" title="PO Menu Labs">
 *   <file name="sample-po-menu-labs/sample-po-menu-labs.component.html"> </file>
 *   <file name="sample-po-menu-labs/sample-po-menu-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-menu-human-resources" title="PO Menu - Human Resources">
 *   <file name="sample-po-menu-human-resources/sample-po-menu-human-resources.component.html"> </file>
 *   <file name="sample-po-menu-human-resources/sample-po-menu-human-resources.component.ts"> </file>
 *   <file name="sample-po-menu-human-resources/sample-po-menu-human-resources.service.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-menu',
  templateUrl: './po-menu.component.html',
  providers: [PoMenuItemsService, PoMenuService]
})
export class PoMenuComponent extends PoMenuBaseComponent implements AfterViewInit, OnDestroy, OnInit, DoCheck {
  @ContentChild(PoMenuHeaderTemplateDirective, { static: true }) menuHeaderTemplate: PoMenuHeaderTemplateDirective;

  activeMenuItem: PoMenuItem;
  collapsedMobile: boolean;
  filterLoading = false;
  groupedMenuItem: PoMenuItem;
  id = uuid();
  linkActive: string;
  mobileOpened: boolean = false;
  noData: boolean = false;
  timeoutFilter: any;

  private filteringItems: boolean = false;
  private menuInitialized: boolean = false;
  private menuPrevious: string = null;
  private resizeListener: () => void;

  private itemSubscription: Subscription;

  constructor(
    public changeDetector: ChangeDetectorRef,
    private element: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private menuItemsService: PoMenuItemsService,
    menuGlobalService: PoMenuGlobalService,
    menuService: PoMenuService,
    languageService: PoLanguageService
  ) {
    super(menuGlobalService, menuService, languageService);
  }

  private get isActiveItemMenuSubMenu() {
    return this.activeMenuItem['level'] > this.groupedMenuItem['level'];
  }

  get enableCollapse() {
    return this.isCollapsed && !this.collapsedMobile;
  }

  get enableCollapseButton() {
    return this.allowCollapseMenu && !this.collapsed && !this.mobileOpened;
  }

  get hasFooter() {
    return this.enableCollapseButton || this.enableCollapse;
  }

  get isCollapsed() {
    return this.allowCollapseMenu && this.collapsed;
  }

  ngDoCheck() {
    if (this.filteringItems && this.filter) {
      return;
    }

    const menuCurrent = JSON.stringify(this.menus);

    if (this.menuPrevious !== menuCurrent || !this.menuInitialized) {
      this.updateMenu();
      this.validateCollapseClass();
    }
  }

  ngOnDestroy() {
    this.itemSubscription.unsubscribe();

    if (this.resizeListener) {
      this.resizeListener();
    }

    this.menuGlobalService.sendRemovedApplicationMenu(this.id);
  }

  ngOnInit() {
    this.subscribeToMenuItem();
  }

  ngAfterViewInit() {
    this.menuGlobalService.sendApplicationMenu(this);
  }

  activateMenuByUrl(urlPath: string, menus: Array<PoMenuItem>) {
    if (menus) {
      const urlPathWithoutLastFragment = urlPath.substr(0, urlPath.lastIndexOf('/'));
      return menus.some(menu => {
        const formattedMenuLink = getFormattedLink(menu.link);
        const menuLinkPath = `${urlPathWithoutLastFragment}${formattedMenuLink.substr(
          formattedMenuLink.lastIndexOf('/')
        )}`;

        if (menuLinkPath === urlPath) {
          this.linkActive = formattedMenuLink;
          this.activateMenuItem(menu);
          return true;
        } else {
          return this.activateMenuByUrl(urlPath, menu.subItems);
        }
      });
    }
  }

  checkActiveMenuByUrl(urlPath: string): void {
    if (!this.linkActive || this.linkActive !== urlPath) {
      this.activateMenuByUrl(urlPath, this.menus);
    }
  }

  /**
   * <a id="colapseMethod"></a>
   *
   * *Método para colapsar (retrair) o menu.
   */
  collapse() {
    this.validateToggleMenu(true);
  }

  debounceFilter(filter: string) {
    clearTimeout(this.timeoutFilter);

    this.timeoutFilter = setTimeout(() => {
      this.filterProcess(filter);
    }, poMenuDebounceTime);
  }

  /**
   * <a id="expandMethod"></a>
   *
   * *Método para expandir (aumentar) o menu.
   */
  expand() {
    this.validateToggleMenu(false);
  }

  subscribeToMenuItem() {
    this.itemSubscription = this.menuItemsService.receiveFromChildMenuClicked().subscribe((menu: PoMenuItem) => {
      this.clickMenuItem(menu);
    });
  }

  /**
   * <a id="toggleMethod"></a>
   * *Método que colapsa e expande o menu alternadamente.
   *
   * > *Os métodos apenas vão colapsar/expandir o menu se:
   *  - Todos os itens de menu tiverem valor nas propriedades `icon` e `shortLabel`.
   */
  toggle() {
    this.validateToggleMenu(!this.collapsed);
  }

  toggleMenuMobile(): void {
    this.mobileOpened = !this.mobileOpened;
    this.collapsedMobile = this.collapsed && this.mobileOpened;

    this.validateCollapseClass(this.collapsedMobile);

    if (isMobile()) {
      return;
    }

    if (this.mobileOpened) {
      this.createResizeListener();
    }
  }

  private activateCollapseSubMenuItem() {
    this.clearGroupMenuIfFirstLevel(this.activeMenuItem);

    if (!this.collapsed && this.activeMenuItem['level'] > poMenuRootLevel && this.isActiveItemMenuSubMenu) {
      this.openParentMenu(this.activeMenuItem);
    }
  }

  private activateMenuItem(menu: PoMenuItem): void {
    this.activeMenuItem = menu;
    this.linkActive = menu.link;
    if (this.activeMenuItem['level'] > poMenuRootLevel) {
      this.openParentMenu(this.activeMenuItem);
    } else {
      this.groupedMenuItem = null;
    }
    this.menuItemsService.sendToChildMenuClicked({
      active: this.activeMenuItem,
      grouped: this.groupedMenuItem,
      activatedByRoute: true
    });
  }

  private areSubMenus(menus: Array<PoMenuItem>) {
    return menus.every(menu => menu['level'] > poMenuRootLevel);
  }

  protected checkingRouterChildrenFragments() {
    const childrenPrimary = this.router.parseUrl(this.router.url).root.children['primary'];

    return childrenPrimary ? `/${childrenPrimary.segments.map(it => it.path).join('/')}` : '';
  }

  private clearGroupMenuIfFirstLevel(activeMenuItem: PoMenuItem) {
    if (activeMenuItem['level'] === poMenuRootLevel) {
      this.groupedMenuItem = undefined;
    }
  }

  private clickMenuItem(menu: PoMenuItem) {
    if (menu.action) {
      this.executeMenuAction(menu);
    }

    if (menu['type'] === 'externalLink') {
      openExternalLink(menu.link);
    } else if (menu['type'] === 'internalLink') {
      this.activateMenuItem(menu);
    } else if (menu['type'] === 'subItems') {
      if (this.filteringItems) {
        this.filteringItems = false;
      }

      this.groupMenuItem(menu);
    }

    if (menu['type'] !== 'subItems') {
      this.mobileOpened = false;
    }
  }

  private convertToMenuItemFiltered(menuItem: any = { label: '', link: '' }): PoMenuItemFiltered {
    const { label, link } = menuItem;

    const menuItemFiltered: PoMenuItemFiltered = { label, link };

    this.setMenuItemProperties(menuItemFiltered);

    return menuItemFiltered;
  }

  private createResizeListener() {
    this.resizeListener = this.renderer.listen('window', 'resize', () => {
      this.toggleResize();
      this.resizeListener();
    });
  }

  private executeMenuAction(menu: PoMenuItem): void {
    menu.action(menu);
  }

  private async filterItems(filter: string) {
    const trimFilter = filter && filter.trim();

    if (trimFilter) {
      this.filteredItems = [];
      this.filteredItems = this.filterService
        ? await this.filterOnService(trimFilter)
        : this.filterLocalItems(trimFilter);
      this.filteringItems = true;
    } else {
      this.filteredItems = [...this.menus];
      this.filteringItems = false;
    }
  }

  private filterLocalItems(filter: string) {
    const filteredItems = [];

    this.findItems(this.menus, filter.toLowerCase(), filteredItems);

    return filteredItems;
  }

  private filterProcess(filter: string) {
    this.filterLoading = true;

    this.filterItems(filter)
      .then(() => {
        this.filterLoading = false;

        this.showNoData();
        this.changeDetector.detectChanges();
        this.menuItemsService.sendToChildMenuClicked({ active: this.activeMenuItem, grouped: this.groupedMenuItem });
      })
      .catch(error => {
        this.filterLoading = false;
        Promise.reject(error);
      });
  }

  private async filterOnService(search: string = '') {
    if (search.length >= poMenuMinLength) {
      return await this.filterService
        .getFilteredData(search, this.params)
        .pipe(map(menuItemsFiltered => menuItemsFiltered.map(menuItem => this.convertToMenuItemFiltered(menuItem))))
        .toPromise();
    } else {
      return this.filteredItems;
    }
  }

  private findItems(menus: Array<PoMenuItem>, filter: string, filteredItems: Array<any>) {
    menus.forEach(menu => {
      const hasAction = menu.action || menu.link;
      const labelHasFilter = menu.label.toLowerCase().includes(filter);

      if (labelHasFilter && hasAction) {
        const newMenu = { ...menu };

        if (newMenu.subItems?.length) {
          delete newMenu.subItems;
          newMenu['type'] = this.setMenuType(newMenu);
        }

        filteredItems.push(newMenu);
      }

      if (menu.subItems) {
        this.findItems(menu.subItems, filter, filteredItems);
      }
    });
  }

  private findParent(menus: Array<PoMenuItem>, menuItem: PoMenuItem): PoMenuItem {
    const getParent = function (menuItems: Array<PoMenuItem>, id) {
      if (menuItems) {
        for (let index = 0; index < menuItems.length; index++) {
          const menu = menuItems[index];
          if (menu.subItems && menu.subItems.find(subItem => subItem['id'] === id)) {
            return menu;
          }
          const found = getParent(menu.subItems, id);
          if (found) {
            return found;
          }
        }
      }
    };
    return getParent(menus, menuItem['id']);
  }

  private findRootParent(menus: Array<PoMenuItem>, menu: PoMenuItem): PoMenuItem {
    const findParent = this.findParent;

    const getRootParent = function (menuItems: Array<PoMenuItem>, menuItem): PoMenuItem {
      let parent = findParent(menuItems, menuItem);

      if (parent['level'] !== poMenuRootLevel) {
        parent = getRootParent(menuItems, parent);
      }
      return parent;
    };
    return getRootParent(menus, menu);
  }

  private getActiveMenuParent(menus: Array<PoMenuItem>, activeMenuItem: PoMenuItem, groupedMenuItem: PoMenuItem) {
    if (this.areSubMenus([groupedMenuItem, activeMenuItem])) {
      return this.findRootParent(menus, activeMenuItem);
    }
  }

  private groupMenuItem(menu: PoMenuItem): void {
    if (this.collapsed) {
      this.toggleMenuCollapse();
    }

    menu['isOpened'] = !menu['isOpened'];
    this.groupedMenuItem = menu;

    if (
      this.activeMenuItem &&
      menu['isOpened'] &&
      this.isActiveItemMenuSubMenu &&
      this.isRootMenuEqualGroupedMenu(this.menus, this.activeMenuItem, menu)
    ) {
      this.activateMenuItem(this.activeMenuItem);
    }

    this.menuItemsService.sendToChildMenuClicked({ active: this.activeMenuItem, grouped: this.groupedMenuItem });
  }

  private isRootMenuEqualGroupedMenu(
    menus: Array<PoMenuItem>,
    activeMenuItem: PoMenuItem,
    groupedMenuItem: PoMenuItem
  ) {
    const activeMenuRootParent = this.findRootParent(menus, activeMenuItem);
    return activeMenuRootParent['id'] === groupedMenuItem['id'];
  }

  private openParentMenu(childMenu: PoMenuItem): void {
    const parent = this.findParent(this.menus, childMenu);
    parent['isOpened'] = true;
    this.groupedMenuItem = parent;
  }

  private showNoData() {
    this.noData = this.filteredItems.length === 0;
  }

  private toggleGroupedMenuItem() {
    this.groupedMenuItem['isOpened'] = !this.collapsed && this.allowCollapseMenu;
  }

  private toggleMenuCollapse(collapsed: boolean = false) {
    this.collapsed = collapsed;

    if (this.groupedMenuItem && this.activeMenuItem) {
      this.groupedMenuItem =
        this.getActiveMenuParent(this.menus, this.activeMenuItem, this.groupedMenuItem) || this.groupedMenuItem;
      this.toggleGroupedMenuItem();
    }

    if (this.activeMenuItem) {
      this.activateCollapseSubMenuItem();
      this.menuItemsService.sendToChildMenuClicked({
        active: this.activeMenuItem,
        grouped: this.groupedMenuItem,
        activatedByRoute: true
      });
    }

    this.updateMenu();
  }

  private toggleResize() {
    if (this.mobileOpened) {
      this.mobileOpened = false;
      this.collapsedMobile = false;
      this.validateCollapseClass(this.collapsedMobile);
    }
  }

  private validateToggleMenu(collapsed: boolean) {
    if (!this.allowCollapseMenu) {
      return;
    }

    this.toggleMenuCollapse(collapsed);
  }

  private updateMenu() {
    this.menuInitialized = true;
    this.setMenuExtraProperties();
    this.filteredItems = [...this.menus];
    this.menuPrevious = JSON.stringify(this.menus);
    this.validateMenus(this.menus);
  }

  protected validateCollapseClass(collapsedMobile: boolean = false) {
    const wrapper = this.element.nativeElement.parentNode;
    this.renderer[this.isCollapsed && !collapsedMobile ? 'addClass' : 'removeClass'](wrapper, 'po-collapsed-menu');
  }
}
