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
import { PoPopupComponent } from '../po-popup/po-popup.component';
import { PoLanguageService } from '../../services/po-language/po-language.service';

export const poBreadcrumbLiterals: Object = {
  en: <any>{
    literalButtonPopup: 'Menu pop up collapsed'
  },
  es: <any>{
    literalButtonPopup: 'Menú pop up colapsado'
  },
  pt: <any>{
    literalButtonPopup: 'Menu pop up colapsado'
  },
  ru: <any>{
    literalButtonPopup: 'меню свернуто'
  }
};

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
  @ViewChild('breadcrumb', { read: ElementRef, static: true }) breadcrumbElement: ElementRef;
  @ViewChild('dropdownIcon', { read: ElementRef }) dropdownIcon: ElementRef;
  @ViewChild('target', { read: ElementRef }) svgTarget: ElementRef;
  @ViewChild('popup') popupContainer: PoPopupComponent;

  showDropdown: boolean = false;
  showDropdownToggle: boolean = false;
  dropdownItems: Array<PoBreadcrumbItem>;
  literals;
  hiddenLiteralFavorite = false;

  private _breadcrumbItemsLenght: number = 0;
  private calculatedElement = false;
  private differ;
  private hiddenWithoutResize = false;
  private initialized = false;
  private timeoutResize;

  constructor(
    differs: IterableDiffers,
    private element: ElementRef,
    public renderer: Renderer2,
    public languageService: PoLanguageService
  ) {
    super();
    this.differ = differs.find([]).create(null);
    const language = languageService.getShortLanguage();

    this.literals = {
      ...poBreadcrumbLiterals[language]
    };
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
    this.removeResizeListener();
  }

  emitAction(item: PoBreadcrumbItem) {
    if (item.action) {
      item.action();
    }
  }

  openPopup(event) {
    if (event.code === 'Enter' || event.code === 'Space') {
      this.popupContainer.open();
    }
  }

  closePopUp() {
    this.svgTarget.nativeElement.focus();
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
    const existLabel = this.existsFavoritelabel();
    const breadcrumb = this.getBreadcrumbWidth(breadcrumbFavorite, existLabel);
    const breadcrumbTooltip = this.getBreadcrumbTooltipWidth();
    if (breadcrumb <= this._breadcrumbItemsLenght) {
      this.enableBreadcrumbResponsive();
    } else {
      this.disableBreadcrumbResponsive();
    }

    if (breadcrumbTooltip && breadcrumb <= breadcrumbTooltip) {
      this.hiddenLiteralFavorite = true;
    } else {
      this.hiddenLiteralFavorite = false;
    }
  }

  private getBreadcrumbFavoriteWidth() {
    return this.favoriteService
      ? this.element.nativeElement.querySelector('.po-breadcrumb-favorite').offsetWidth + 20
      : 0;
  }

  private getBreadcrumbTooltipWidth() {
    return this.favoriteService ? this.element.nativeElement.querySelector('.po-breadcrumb-tooltip')?.offsetWidth : 0;
  }

  private existsFavoritelabel() {
    return !!this.element.nativeElement.querySelector('.po-breadcrumb-favorite-label');
  }

  private getBreadcrumbWidth(breadcrumbFavorite, existLabel) {
    const widthSpan = !existLabel ? 95 : 0;
    return this.element.nativeElement.querySelector('.po-breadcrumb').offsetWidth - (breadcrumbFavorite + widthSpan);
  }

  private calcBreadcrumbItemsWidth() {
    const breadcrumbItem = this.element.nativeElement.querySelectorAll('.po-breadcrumb-item');

    this._breadcrumbItemsLenght = Array.from(breadcrumbItem)
      .map(breadcrumb => breadcrumb['offsetWidth'])
      .reduce((a, b) => a + b, 16);
  }

  private enableBreadcrumbResponsive() {
    this.showDropdownToggle = true;
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

  private initializeResizeListener() {
    this.resizeListener = this.renderer.listen('window', 'resize', (event: MouseEvent) => {
      this.debounceResize();
    });
  }

  private removeResizeListener() {
    this.resizeListener();
  }
}
