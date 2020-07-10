import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { callFunction, getFormattedLink, openExternalLink } from '../../utils/util';

import { PoMenuPanelBaseComponent } from './po-menu-panel-base.component';
import { PoMenuPanelItem } from './po-menu-panel-item/po-menu-panel-item.interface';
import { PoMenuPanelItemInternal } from './po-menu-panel-item/po-menu-panel-item-internal.interface';
import { PoMenuPanelItemsService } from './services/po-menu-panel-items.service';

/**
 * @docsExtends PoMenuPanelBaseComponent
 *
 * @description
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
 * <example name="po-menu-panel-basic" title="PO Menu Panel Basic">
 *   <file name="sample-po-menu-panel-basic/sample-po-menu-panel-basic.component.html"> </file>
 *   <file name="sample-po-menu-panel-basic/sample-po-menu-panel-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-menu-panel-labs" title="PO Menu Panel Labs">
 *   <file name="sample-po-menu-panel-labs/sample-po-menu-panel-labs.component.html"> </file>
 *   <file name="sample-po-menu-panel-labs/sample-po-menu-panel-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-menu-panel-customer" title="PO Menu Panel - Customers">
 *   <file name="sample-po-menu-panel-customer/sample-po-menu-panel-customer.component.html"> </file>
 *   <file name="sample-po-menu-panel-customer/sample-po-menu-panel-customer.component.ts"> </file>
 * </example>
 */

@Component({
  selector: 'po-menu-panel',
  templateUrl: './po-menu-panel.component.html'
})
export class PoMenuPanelComponent extends PoMenuPanelBaseComponent implements OnDestroy, OnInit {
  activeMenuItem: PoMenuPanelItem;
  linkActive: string;

  private routeSubscription: Subscription;
  private itemSubscription: Subscription;

  constructor(
    viewRef: ViewContainerRef,
    private location: Location,
    private menuItemsService: PoMenuPanelItemsService,
    private router: Router
  ) {
    super();
  }

  ngOnDestroy() {
    this.itemSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  ngOnInit() {
    this.subscribeToMenuItem();
    this.subscribeToRoute();
  }

  private activateMenuByUrl(urlPath: string, menus: Array<PoMenuPanelItem>) {
    if (menus) {
      return menus.some(menu => {
        if (getFormattedLink(menu.link) === urlPath) {
          this.activateMenuItem(menu);
          return true;
        }
      });
    }
  }

  private activateMenuItem(menu: PoMenuPanelItem): void {
    this.activeMenuItem = menu;
    this.linkActive = getFormattedLink(menu.link);
    this.menuItemsService.sendToChildMenuClicked({ active: this.activeMenuItem, activatedByRoute: true });
  }

  private checkActiveMenuByUrl(urlPath: string): void {
    if (!this.linkActive || this.linkActive !== urlPath) {
      this.activateMenuByUrl(urlPath, this.menus);
    }
  }

  private clickMenuItem(menu: PoMenuPanelItemInternal) {
    if (menu.action) {
      menu.action(menu);
    }

    if (menu.type === 'externalLink') {
      openExternalLink(menu.link);
    } else if (menu.type === 'internalLink') {
      this.activateMenuItem(menu);
    }
  }

  private subscribeToRoute() {
    this.routeSubscription = this.router.events.subscribe(rounterEvent => {
      if (rounterEvent instanceof NavigationEnd) {
        this.checkActiveMenuByUrl(this.location.path());
      }
    });
  }

  private subscribeToMenuItem() {
    this.itemSubscription = this.menuItemsService
      .receiveFromChildMenuClicked()
      .subscribe((menu: PoMenuPanelItemInternal) => this.clickMenuItem(menu));
  }
}
