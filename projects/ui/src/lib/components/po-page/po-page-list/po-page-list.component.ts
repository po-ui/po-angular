import {
  AfterContentInit,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChange,
  ViewChild,
  ViewContainerRef,
  ChangeDetectorRef,
  ElementRef
} from '@angular/core';
import { Router } from '@angular/router';

import { callFunction, isExternalLink, isTypeof, openExternalLink } from '../../../utils/util';
import { PoLanguageService } from './../../../services/po-language/po-language.service';

import { PoPageAction } from '../po-page-action.interface';
import { PoDisclaimer } from '../../po-disclaimer/po-disclaimer.interface';
import { PoDisclaimerGroupRemoveAction } from '../../po-disclaimer-group/po-disclaimer-group-remove-action.interface';

import { PoPageContentComponent } from '../po-page-content/po-page-content.component';
import { PoPageListBaseComponent } from './po-page-list-base.component';

/**
 * @docsExtends PoPageListBaseComponent
 *
 * @example
 *
 * <example name="po-page-list-basic" title="PO Page List Basic">
 *  <file name="sample-po-page-list-basic/sample-po-page-list-basic.component.html"> </file>
 *  <file name="sample-po-page-list-basic/sample-po-page-list-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-list-labs" title="PO Page List Labs">
 *  <file name="sample-po-page-list-labs/sample-po-page-list-labs.component.html"> </file>
 *  <file name="sample-po-page-list-labs/sample-po-page-list-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-list-hiring-processes" title="PO Page List - Hiring Processes">
 *  <file name="sample-po-page-list-hiring-processes/sample-po-page-list-hiring-processes.component.html"> </file>
 *  <file name="sample-po-page-list-hiring-processes/sample-po-page-list-hiring-processes.component.ts"> </file>
 *  <file name="sample-po-page-list-hiring-processes/sample-po-page-list-hiring-processes.service.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-page-list',
  templateUrl: './po-page-list.component.html'
})
export class PoPageListComponent
  extends PoPageListBaseComponent
  implements AfterContentInit, OnChanges, OnDestroy, OnInit {
  advancedSearch: string;
  dropdownActions: Array<PoPageAction>;
  isMobile: boolean;
  limitPrimaryActions: number = 3;

  @ViewChild('filterInput') filterInput: ElementRef;

  private isRecalculate = true;
  private maxWidthMobile: number = 480;

  callFunction = callFunction;

  @ViewChild(PoPageContentComponent, { static: true }) poPageContent: PoPageContentComponent;

  /* istanbul ignore next */
  constructor(
    viewRef: ViewContainerRef,
    languageService: PoLanguageService,
    public renderer: Renderer2,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {
    super(languageService);
    this.initializeListeners();
  }

  ngOnInit(): void {
    this.advancedSearch = this.initializeFixedLiterals();
  }

  ngAfterContentInit(): void {
    this.setIsMobile();
    this.setDropdownActions();
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    this.setDropdownActions();
  }

  ngOnDestroy() {
    this.removeListeners();
  }

  actionIsDisabled(action: any) {
    return isTypeof(action.disabled, 'function') ? action.disabled(action) : action.disabled;
  }

  callAction(item: PoPageAction): void {
    if (item.url) {
      isExternalLink(item.url) ? openExternalLink(item.url) : this.router.navigate([item.url]);
    } else if (item.action) {
      item.action();
    }
  }

  hasPageHeader(): boolean {
    return !!(
      this.title ||
      (this.visibleActions && this.visibleActions.length) ||
      (this.breadcrumb && this.breadcrumb.items.length)
    );
  }

  hasCustomFilterSize(): boolean {
    if (!this.filter) {
      return false;
    }
    return this.filter.width >= 1 && this.filter.width <= 6;
  }

  filterSizeClass(width: number): string {
    const smWidth = Math.max(this.filter?.advancedAction ? 6 : 2, width);
    const mdWidth = Math.max(this.filter?.advancedAction ? 4 : 1, width);
    if (this.filter?.advancedAction) {
      width = Math.max(width, 2);
    }
    return `po-sm-${smWidth} po-md-${mdWidth} po-lg-${width} po-xl-${width}`;
  }

  private onResize(event: Event): void {
    const width = (event.target as Window).innerWidth;

    if (width < this.maxWidthMobile) {
      this.isMobile = true;
      this.limitPrimaryActions = 2;
      this.setDropdownActions();
    } else {
      this.isMobile = false;
      this.limitPrimaryActions = 3;
      this.setDropdownActions();
    }
  }

  private setIsMobile(): void {
    if (window.innerWidth < this.maxWidthMobile) {
      this.isMobile = true;
      this.limitPrimaryActions = 2;
    }
  }

  setDropdownActions(): void {
    if (this.visibleActions.length > this.limitPrimaryActions) {
      this.dropdownActions = this.visibleActions.slice(this.limitPrimaryActions - 1);
    }
  }

  callActionFilter(field: string) {
    this.filter[field](this.filterInput.nativeElement.value);
    this.changeDetector.detectChanges();
  }
  /**
   * Limpa o campo de pesquisa.
   */
  clearInputSearch() {
    this.filterInput.nativeElement.value = null;
  }

  onkeypress(key) {
    if (key === 13) {
      this.callActionFilter('action');
    }
  }

  // Recebe evento change do disclaimer e recalcula tela
  onChangeDisclaimerGroup(disclaimers) {
    if (
      (disclaimers && disclaimers.length && this.isRecalculate) ||
      (disclaimers.length === 0 && !this.isRecalculate)
    ) {
      this.poPageContent.recalculateHeaderSize();
      this.isRecalculate = !this.isRecalculate;
    }

    if (this.disclaimerGroup && this.disclaimerGroup.change) {
      this.disclaimerGroup.change(disclaimers);
    }
  }

  onRemoveDisclaimer(removeData: PoDisclaimerGroupRemoveAction) {
    if (this.disclaimerGroup.remove) {
      this.disclaimerGroup.remove(removeData);
    }
  }

  onRemoveAllDisclaimers(removedDisclaimers: Array<PoDisclaimer>) {
    if (this.disclaimerGroup.removeAll) {
      this.disclaimerGroup.removeAll(removedDisclaimers);
    }
  }

  private initializeFixedLiterals() {
    const literal = {
      pt: {
        advancedSearch: 'Busca avançada'
      },
      en: {
        advancedSearch: 'Advanced search'
      },
      es: {
        advancedSearch: 'Búsqueda avanzada'
      },
      ru: {
        advancedSearch: 'полный поиск'
      }
    };

    return literal[this.language].advancedSearch;
  }

  private initializeListeners() {
    this.resizeListener = this.renderer.listen('window', 'resize', (event: MouseEvent) => {
      this.onResize(event);
    });
  }

  private removeListeners() {
    this.resizeListener();
  }
}
