import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  IterableDiffers,
  OnDestroy,
  Renderer2,
  ViewChild
} from '@angular/core';

import { PoBreadcrumbBaseComponent } from './po-breadcrumb-base.component';
import { PoBreadcrumbItem } from './po-breadcrumb-item.interface';

/**
 * @docsExtends PoBreadcrumbBaseComponent
 *
 * @example
 *
 * <example name="po-breadcrumb-basic" title="PO Breadcrumb Basic">
 *  <file name="sample-po-breadcrumb-basic/sample-po-breadcrumb-basic.component.html"> </file>
 *  <file name="sample-po-breadcrumb-basic/sample-po-breadcrumb-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-breadcrumb-labs" title="PO Breadcrumb Labs">
 *  <file name="sample-po-breadcrumb-labs/sample-po-breadcrumb-labs.component.html"> </file>
 *  <file name="sample-po-breadcrumb-labs/sample-po-breadcrumb-labs.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-breadcrumb',
  templateUrl: './po-breadcrumb.component.html'
})
export class PoBreadcrumbComponent extends PoBreadcrumbBaseComponent implements AfterViewInit, DoCheck, OnDestroy {
  showDropdown: boolean = false;
  showDropdownToggle: boolean = false;
  dropdownItems: Array<PoBreadcrumbItem>;

  private _breadcrumbItemsLenght: number = 0;
  private calculatedElement = false;
  private differ;
  private hiddenWithoutResize = false;
  private initialized = false;
  private timeoutResize;

  @ViewChild('breadcrumb', { read: ElementRef, static: true }) breadcrumbElement: ElementRef;
  @ViewChild('dropdownIcon', { read: ElementRef }) dropdownIcon: ElementRef;

  constructor(differs: IterableDiffers, private element: ElementRef, public renderer: Renderer2) {
    super();
    this.differ = differs.find([]).create(null);
  }

  ngAfterViewInit() {
    this.initialized = true;

    this.initializeResizeListener();
  }

  ngDoCheck() {
    const breadcrumbWidth = this.breadcrumbElement.nativeElement.offsetWidth;

    // Permite que os disclaimers sejam calculados na primeira vez que o componente torna-se visível,
    // evitando com isso, problemas com Tabs ou Divs que iniciem escondidas.
    if (breadcrumbWidth && !this.calculatedElement && this.initialized) {
      this.initBreadcrumbSize();
    }

    if (this.hiddenWithoutResize) {
      this.debounceResize();
      this.hiddenWithoutResize = false;
    }

    this.checkChangeOnItems();
  }

  ngOnDestroy() {
    this.removeClickoutListener();
    this.removeResizeListener();
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
    this.initializeClickoutListener();
  }

  private wasClickedonDropdown = (event: MouseEvent) => {
    const clickedOutIconDropdown = this.checkClickOutElement(event, this.dropdownIcon);

    if (clickedOutIconDropdown) {
      this.showDropdown = false;
      this.removeClickoutListener();
    }
  };

  private checkClickOutElement(event, element) {
    return element && !element.nativeElement.contains(event.target);
  }

  private checkChangeOnItems() {
    if (this.differ) {
      const changes = this.differ.diff(this.items);
      if (changes) {
        this.calcBreadcrumbItemsWidth();
        this.calculatedElement = false;
      }
    }
  }

  private calcBreadcrumb() {
    const breadcrumbFavorite = this.getBreadcrumbFavoriteWidth();
    const breadcrumb = this.getBreadcrumbWidth(breadcrumbFavorite);

    if (breadcrumb <= this._breadcrumbItemsLenght) {
      this.enableBreadcrumbResponsive();
    } else {
      this.disableBreadcrumbResponsive();
    }
  }

  private getBreadcrumbFavoriteWidth() {
    return this.favoriteService
      ? this.element.nativeElement.querySelector('.po-breadcrumb-favorite').offsetWidth + 20
      : 0;
  }

  private getBreadcrumbWidth(breadcrumbFavorite) {
    return this.element.nativeElement.querySelector('.po-breadcrumb').offsetWidth - breadcrumbFavorite;
  }

  private calcBreadcrumbItemsWidth() {
    const breadcrumbItem = this.element.nativeElement.querySelectorAll(
      '.po-breadcrumb-item, .po-breadcrumb-item-unclickable'
    );

    this._breadcrumbItemsLenght = Array.from(breadcrumbItem)
      .map(breadcrumb => breadcrumb['offsetWidth'])
      .reduce((a, b) => a + b, 16);
  }

  private enableBreadcrumbResponsive() {
    this.showDropdownToggle = true;
    this.itemsView = this.items.slice(-2);
    this.dropdownItems = this.items.slice(0, -2).reverse();
  }

  private disableBreadcrumbResponsive() {
    this.showDropdownToggle = false;
    this.itemsView = [].concat(this.items);
    this.showDropdown = false;
  }

  private debounceResize() {
    clearTimeout(this.timeoutResize);
    this.timeoutResize = setTimeout(() => {
      if (
        this.calculatedElement &&
        !this.hiddenWithoutResize &&
        this.breadcrumbElement.nativeElement.offsetWidth === 0
      ) {
        this.hiddenWithoutResize = true;
      } else {
        this.calcBreadcrumb();
      }
    }, 50);
  }

  private initBreadcrumbSize() {
    this.calcBreadcrumbItemsWidth();
    this.calcBreadcrumb();
    this.calculatedElement = true;
  }

  private initializeClickoutListener() {
    this.clickoutListener = this.renderer.listen('document', 'click', this.wasClickedonDropdown);
  }

  private initializeResizeListener() {
    this.resizeListener = this.renderer.listen('window', 'resize', (event: MouseEvent) => {
      this.debounceResize();
    });
  }

  private removeClickoutListener() {
    if (this.clickoutListener) {
      this.clickoutListener();
    }
  }

  private removeResizeListener() {
    this.resizeListener();
  }
}
