import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, keyframes, style } from '@angular/animations';

import { delay, filter, finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { uuid } from '../../utils/util';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { PoMenuGlobalService } from '../po-menu/services/po-menu-global.service';
import { PoMenuItem } from '../po-menu/po-menu-item.interface';
import { PoMenuComponent } from '../po-menu/po-menu.component';

import { PoNavbarBaseComponent } from './po-navbar-base.component';
import { PoNavbarItem } from './interfaces/po-navbar-item.interface';
import { PoNavbarItemsComponent } from './po-navbar-items/po-navbar-items.component';

const poNavbarNavigationWidth = 88;
const poNavbarMenuMedia = 768;
const poNavbarMatchMedia = `(max-width: ${poNavbarMenuMedia}px)`;
const poNavbarTiming = '250ms ease';

/**
 * @docsExtends PoNavbarBaseComponent
 */
@Component({
  selector: 'po-navbar',
  templateUrl: './po-navbar.component.html'
})
export class PoNavbarComponent extends PoNavbarBaseComponent implements AfterViewInit, OnDestroy, OnInit {
  disableRight: boolean;
  showItemsNavigation: boolean = false;

  private _menuComponent;

  private isNavbarUpdateMenu: boolean = false;
  private id = uuid();
  private mediaQuery: any;
  private offset: number = 0;
  private player: AnimationPlayer;
  private menuItems: Array<PoMenuItem>;
  private previousMenuComponentId;
  private previousMenusItems = [];

  private applicationMenuSubscription: Subscription;
  private menusSubscription: Subscription;
  private removedMenuSubscription: Subscription;

  protected windowResizeListener: () => void;

  get navbarItemNavigationDisableLeft() {
    return this.offset === 0;
  }

  get navbarItemNavigationDisableRight() {
    return this.disableRight && this.offset !== 0;
  }

  @ViewChild(PoNavbarItemsComponent, { read: ElementRef, static: true }) navbarItemsElement: ElementRef;

  @ViewChild(PoNavbarItemsComponent, { static: true }) navbarItems: PoNavbarItemsComponent;

  @ViewChild(PoMenuComponent) set menuComponent(menu: PoMenuComponent) {
    this._menuComponent = menu;

    this.previousMenuComponentId = menu?.id || this.previousMenuComponentId;
  }

  private get isCollapsedMedia() {
    return window.innerWidth < poNavbarMenuMedia;
  }

  constructor(
    poLanguageService: PoLanguageService,
    private renderer: Renderer2,
    private builder: AnimationBuilder,
    private changeDetector: ChangeDetectorRef,
    private menuGlobalService: PoMenuGlobalService
  ) {
    super(poLanguageService);
    this.windowResizeListener = this.renderer.listen(window, 'resize', this.displayItemsNavigation.bind(this));
  }

  ngOnInit() {
    // necessário para quando o menu da aplicação carregar os itens lazy e navbar estiver colapsado,
    // quando isso acontece, o navbar inclui 1 item de menu "Navbar links", portanto é removido quando
    // os novos itens de menu é carregado, a partir disso este tratamento é necessario para incluir
    // o navbar links apos a adição dos itens de menu da aplicação.
    this.menusSubscription = this.menuGlobalService.receiveMenus$.subscribe(newMenus => {
      const previousMenusiIsNavbarLinks =
        this.previousMenusItems?.length === 1 && this.previousMenusItems[0].id === this.id;

      if (this.applicationMenu && this.isCollapsedMedia && this.isNavbarUpdateMenu && previousMenusiIsNavbarLinks) {
        this.isNavbarUpdateMenu = false;

        this.applicationMenu.menus = [
          { label: this.literals.navbarLinks, subItems: this.items, id: this.id },
          ...newMenus
        ];
      }

      this.isNavbarUpdateMenu = false;
      this.previousMenusItems = newMenus;
    });

    this.removedMenuSubscription = this.menuGlobalService.receiveRemovedApplicationMenu$.subscribe(removedMenuId => {
      // verifica se o menu removido foi o presente no navbar, caso sim, ele mantem o applictionMenu.
      // é preciso para tratar a sequencia do ngDestroy, quando o menu do navbar era removido do DOM
      // disparava esse evento, sendo necessario tratar, para não tornar indefinido o applicationMenu
      this.applicationMenu =
        this.applicationMenu && this.previousMenuComponentId === removedMenuId ? this.applicationMenu : undefined;

      this.changeDetector.detectChanges();

      if (!this.applicationMenu && this.mediaQuery) {
        this.mediaQuery.removeListener(this.onMediaQueryChange);
      }
    });

    this.applicationMenuSubscription = this.menuGlobalService.receiveApplicationMenu$
      .pipe(delay(100))
      .subscribe(newMenu => {
        this.applicationMenu = this.previousMenuComponentId === newMenu.id ? undefined : newMenu;

        this.changeDetector.detectChanges();

        if (this.applicationMenu) {
          this.initNavbarMenu();
        }
      });
  }

  ngAfterViewInit() {
    this.displayItemsNavigation();
  }

  ngOnDestroy() {
    if (this.mediaQuery) {
      this.mediaQuery.removeListener(this.onMediaQueryChange);
    }

    this.removedMenuSubscription?.unsubscribe();
    this.applicationMenuSubscription?.unsubscribe();
    this.menusSubscription?.unsubscribe();
  }

  navigateItems(orientation: string) {
    orientation === 'left' ? this.navigateLeft() : this.navigateRight();

    this.animate(this.offset);
  }

  private allNavbarItemsWidth() {
    return this.navbarItems.allNavbarItems.reduce(
      (previous: any, current: any) => previous + current.nativeElement.offsetWidth,
      0
    );
  }

  private animate(offset: number) {
    const animation: AnimationFactory = this.buildTransitionAnimation(offset);

    this.player = animation.create(this.navbarItems.navbarItemsContainer.nativeElement);
    this.player.play();
  }

  private buildTransitionAnimation(offset: number) {
    return this.builder.build([animate(poNavbarTiming, keyframes([style({ transform: `translateX(${-offset}px)` })]))]);
  }

  private changeNavbarMenuItems(isCollapsedMedia: any, navbarItems: Array<PoNavbarItem>, label: string) {
    if (isCollapsedMedia) {
      this.applicationMenu.menus = [{ label, subItems: navbarItems, id: this.id }, ...this.applicationMenu.menus];
    } else {
      this.applicationMenu.menus = this.applicationMenu.menus.filter(m => m.id !== this.id);
    }

    this.isNavbarUpdateMenu = true;

    this.changeDetector.detectChanges();
  }

  private calculateLeftNavigation() {
    let calculatedOffset: number;

    this.navbarItems.allNavbarItems.some(navbarItem => {
      const navbarItemOffset = navbarItem.nativeElement.offsetLeft;
      const navbarItemWidth = navbarItem.nativeElement.offsetWidth;

      if (navbarItemOffset >= this.offset) {
        calculatedOffset = navbarItemOffset - (this.navbarItemsWidth() - navbarItemWidth);
        return true;
      }
    });
    return calculatedOffset;
  }

  private calculateRightNavigation(itemBreakPoint: number) {
    let calculatedOffset: number;

    this.navbarItems.allNavbarItems.some(navbarItem => {
      const offsetLeft = navbarItem.nativeElement.offsetLeft;
      const finalPosition = navbarItem.nativeElement.offsetWidth + offsetLeft;

      if (itemBreakPoint < finalPosition) {
        calculatedOffset = offsetLeft;
        return true;
      }
    });
    return calculatedOffset;
  }

  private displayItemsNavigation() {
    this.showItemsNavigation = this.navbarItemsWidth() < this.allNavbarItemsWidth() + poNavbarNavigationWidth;

    this.changeDetector.detectChanges();

    if (this.offset !== 0) {
      this.setOffsetToZero();
      this.animate(this.offset);
    }
  }

  private initNavbarMenu() {
    this.mediaQuery = window.matchMedia(poNavbarMatchMedia);

    if (this.isCollapsedMedia) {
      this.changeNavbarMenuItems(true, this.items, this.literals.navbarLinks);
    }

    this.validateMenuLogo();

    this.mediaQuery.addListener(this.onMediaQueryChange);
  }

  private navbarItemsWidth() {
    return this.navbarItemsElement.nativeElement.offsetWidth;
  }

  private navigateLeft() {
    this.disableRight = false;

    this.offset = this.calculateLeftNavigation();

    if (this.offset < 0) {
      this.setOffsetToZero();
    }
  }

  private navigateRight() {
    const maxAllowedOffset = this.allNavbarItemsWidth() - this.navbarItemsWidth();
    const itemBreakPoint = this.offset + this.navbarItemsWidth();

    this.offset = this.calculateRightNavigation(itemBreakPoint);

    this.validateMaxOffset(maxAllowedOffset);
  }

  private onMediaQueryChange = changed => {
    this.changeNavbarMenuItems(changed.matches, this.items, this.literals.navbarLinks);
  };

  private setOffsetToZero() {
    this.offset = 0;
  }

  private validateMaxOffset(maxAllowedOffset: number) {
    if (this.offset >= maxAllowedOffset) {
      this.offset = maxAllowedOffset;
      this.disableRight = true;
    }
  }

  protected validateMenuLogo() {
    if (this.applicationMenu.logo && this.logo) {
      this.applicationMenu.logo = undefined;
      this.changeDetector.detectChanges();
    }
  }
}
