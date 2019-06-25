import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, keyframes, style } from '@angular/animations';

import { PoNavbarBaseComponent } from './po-navbar-base.component';
import { PoNavbarItemsComponent } from './po-navbar-items/po-navbar-items.component';

/**
 * @docsExtends PoNavbarBaseComponent
 */
@Component({
  selector: 'po-navbar',
  templateUrl: './po-navbar.component.html'
})
export class PoNavbarComponent extends PoNavbarBaseComponent implements AfterViewInit, OnDestroy {

  disableRight: boolean;
  showItemsNavigation: boolean = false;

  private allNavbarItemsWidth: any;
  private mediaQuery: any;
  private navbarItemsWidth: any;
  private offset: number = 0;
  private player: AnimationPlayer;

  protected windowResizeListener: () => void;

  @ViewChild(PoNavbarItemsComponent, { read: ElementRef, static: true }) navbarItemsElement: ElementRef;

  @ViewChild(PoNavbarItemsComponent, { static: true }) navbarItems: PoNavbarItemsComponent;

  constructor(private renderer: Renderer2, private builder: AnimationBuilder, private changeDetector: ChangeDetectorRef) {
    super();
    this.windowResizeListener = this.renderer.listen(window, 'resize', this.displayItemsNavigation.bind(this));
  }

  ngAfterViewInit() {
    this.displayItemsNavigation();
    this.menuWrapperAdjust();
  }

  ngOnDestroy() {
    if (this.mediaQuery) {
      this.mediaQuery.removeListener();
    }
  }

  navigateItems(orientation) {

    orientation === 'left' ? this.navigateLeft() : this.navigateRight();

    this.animate(this.offset);
  }

  private adjustNavbarMenu() {
    const navbarMenu = document.querySelector('po-navbar po-menu');
    const page = document.querySelector('.po-page');
    const navbarLogo = document.querySelector('.po-navbar-logo');
    navbarMenu.setAttribute('style', `display: none`);
    if (page) {
      page.setAttribute('style', 'margin-left: 0; width: 100%');
    }
    if (navbarLogo) {
      navbarLogo.setAttribute('style', `padding: 0 16px 0 0!important`);
    }
    this.mediaQuery.addListener(changed => {
      if (changed.matches) {
        navbarMenu.setAttribute('style', `display: block`);
        if (page) {
          page.setAttribute('style', 'margin-left: 256; width: calc(100% - 256px)');
        }
      } else {
        navbarMenu.setAttribute('style', `display: none`);
        if (page) {
          page.setAttribute('style', 'margin-left: 0; width: 100%');
        }
      }
    });
  }

  private adjustUserMenu() {
    const userMenuItems = this.menu.menus;
    this.mediaQuery.addListener(changed => {
      if (changed.matches) {
        const subItems = [{label: this.literals.navbarLinks, subItems: this.items}] ;
        this.menu.menus = [...subItems, ...this.menu.menus];
      } else {
        this.menu.menus = userMenuItems;
      }
    });
  }

  private animate(offset: number) {
    const animation: AnimationFactory = this.buildTransitionAnimation(offset);

    this.player = animation.create(this.navbarItems.navbarItemsContainer.nativeElement);
    this.player.play();
  }

  private buildTransitionAnimation(offset: number) {
    return this.builder.build([
      animate(
        '250ms ease',
        keyframes([style({ transform: `translateX(${offset}px)` })])
      )
    ]);
  }

  private displayItemsNavigation() {
    this.navbarItemsWidth = this.navbarItemsElement.nativeElement.offsetWidth;

    this.allNavbarItemsWidth =
      this.navbarItems.allNavbarItems.reduce((previous: any, current: any) => previous + current.nativeElement.offsetWidth, 0);

    this.showItemsNavigation = this.navbarItemsWidth < this.allNavbarItemsWidth + 88;

    this.changeDetector.detectChanges();

    if (this.offset !== 0) {
      this.offset = 0;
      this.animate(this.offset);
    }
  }

  private menuWrapperAdjust() {
    const body = document.querySelector('body');
    body.setAttribute('style', `height: calc(100% - 56px)`);
    this.mediaQuery = window.matchMedia('(max-width: 768px)');

    !this.menu ? this.adjustNavbarMenu() : this.adjustUserMenu();
  }

  private navigateRight() {

    const maxAllowedOffset = this.allNavbarItemsWidth - this.navbarItemsElement.nativeElement.offsetWidth;
    const itemBreakPoint = (this.offset * -1) + this.navbarItemsElement.nativeElement.offsetWidth;

    let movementInPixels = 0;

    this.navbarItems.allNavbarItems.some(navbarItem => {
      const finalPosition = navbarItem.nativeElement.offsetWidth + navbarItem.nativeElement.offsetLeft;

      if (itemBreakPoint < finalPosition) {
        movementInPixels = navbarItem.nativeElement.offsetLeft;
        return true;
      }

    });

    this.offset = (movementInPixels * -1);

    if ((this.offset * -1) >= maxAllowedOffset) {
      this.offset = maxAllowedOffset * -1;
      this.disableRight = true;
    }
  }

  private navigateLeft() {
    this.disableRight = false;

    let movementInPixels;

    this.navbarItems.allNavbarItems.some(navbarItem => {

      const navbarItemOffset = navbarItem.nativeElement.offsetLeft;

      if (navbarItemOffset >= (this.offset * -1)) {
        movementInPixels = navbarItemOffset - (this.navbarItemsElement.nativeElement.offsetWidth - navbarItem.nativeElement.offsetWidth);
        return true;
      }

    });

    this.offset = (movementInPixels * -1);

    if (this.offset > 0) {
      this.offset = 0;
    }
  }

}
