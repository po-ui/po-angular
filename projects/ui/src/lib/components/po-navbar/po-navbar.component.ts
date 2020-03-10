import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  Renderer2,
  ViewChild
} from '@angular/core';
import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, keyframes, style } from '@angular/animations';

import { PoMenuItem } from '../po-menu';
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
export class PoNavbarComponent extends PoNavbarBaseComponent implements AfterViewInit, OnDestroy {
  disableRight: boolean;
  showItemsNavigation: boolean = false;

  private mediaQuery: any;
  private offset: number = 0;
  private player: AnimationPlayer;
  private menuItems: Array<PoMenuItem>;

  protected windowResizeListener: () => void;

  get navbarItemNavigationDisableLeft() {
    return this.offset === 0;
  }

  get navbarItemNavigationDisableRight() {
    return this.disableRight && this.offset !== 0;
  }

  @ViewChild(PoNavbarItemsComponent, { read: ElementRef, static: true }) navbarItemsElement: ElementRef;

  @ViewChild(PoNavbarItemsComponent, { static: true }) navbarItems: PoNavbarItemsComponent;

  constructor(
    private renderer: Renderer2,
    private builder: AnimationBuilder,
    private changeDetector: ChangeDetectorRef
  ) {
    super();
    this.windowResizeListener = this.renderer.listen(window, 'resize', this.displayItemsNavigation.bind(this));
  }

  ngAfterViewInit() {
    this.displayItemsNavigation();

    if (this.menu) {
      this.initNavbarMenu();
    }
  }

  ngOnDestroy() {
    if (this.mediaQuery) {
      this.mediaQuery.removeListener(this.onMediaQueryChange);
    }
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

  private changeNavbarMenuItems(
    isCollapsedMedia: any,
    menuItems: Array<PoMenuItem>,
    navbarItems: Array<PoNavbarItem>,
    label: string
  ) {
    if (isCollapsedMedia) {
      const subItems = [{ label, subItems: navbarItems }];
      this.menu.menus = [...subItems, ...menuItems];
    } else {
      this.menu.menus = menuItems;
    }
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
    this.menuItems = this.menu.menus;

    if (window.innerWidth < poNavbarMenuMedia) {
      this.changeNavbarMenuItems(true, this.menuItems, this.items, this.literals.navbarLinks);
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
    this.changeNavbarMenuItems(changed.matches, this.menuItems, this.items, this.literals.navbarLinks);
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
    if (this.menu.logo && this.logo) {
      this.menu.logo = undefined;
      this.menu.changeDetector.detectChanges();
    }
  }
}
