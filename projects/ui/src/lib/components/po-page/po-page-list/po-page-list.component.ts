import {
  AfterContentInit,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChange,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Router } from '@angular/router';

import { callFunction, isExternalLink, isTypeof, openExternalLink } from '../../../utils/util';
import { PoLanguageService } from './../../../services/po-language/po-language.service';

import { PoPageAction } from '../po-page-action.interface';

import { PoPageContentComponent } from '../po-page-content/po-page-content.component';
import { PoPageListBaseComponent } from './po-page-list-base.component';

/**
 * @docsExtends PoPageListBaseComponent
 *
 * @example
 *
 * <example name="po-page-list-basic" title="Portinari Page List Basic">
 *  <file name="sample-po-page-list-basic/sample-po-page-list-basic.component.html"> </file>
 *  <file name="sample-po-page-list-basic/sample-po-page-list-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-list-labs" title="Portinari Page List Labs">
 *  <file name="sample-po-page-list-labs/sample-po-page-list-labs.component.html"> </file>
 *  <file name="sample-po-page-list-labs/sample-po-page-list-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-list-hiring-processes" title="Portinari Page List - Hiring Processes">
 *  <file name="sample-po-page-list-hiring-processes/sample-po-page-list-hiring-processes.component.html"> </file>
 *  <file name="sample-po-page-list-hiring-processes/sample-po-page-list-hiring-processes.component.ts"> </file>
 *  <file name="sample-po-page-list-hiring-processes/sample-po-page-list-hiring-processes.service.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-page-list',
  templateUrl: './po-page-list.component.html'
})
export class PoPageListComponent extends PoPageListBaseComponent
  implements AfterContentInit, OnChanges, OnDestroy, OnInit {
  advancedSearch: string;
  dropdownActions: Array<PoPageAction>;
  isMobile: boolean;
  limitPrimaryActions: number = 3;
  parentRef: ViewContainerRef;

  private isRecalculate = true;
  private maxWidthMobile: number = 480;

  callFunction = callFunction;

  @ViewChild(PoPageContentComponent, { static: true }) poPageContent: PoPageContentComponent;

  constructor(
    viewRef: ViewContainerRef,
    languageService: PoLanguageService,
    public renderer: Renderer2,
    private router: Router
  ) {
    super(languageService);
    this.parentRef = viewRef['_hostView'][8];
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
      callFunction(item.action, this.parentRef);
    }
  }

  hasPageHeader(): boolean {
    return !!(this.title || (this.actions && this.actions.length) || (this.breadcrumb && this.breadcrumb.items.length));
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
    if (this.actions.length > this.limitPrimaryActions) {
      this.dropdownActions = this.actions.slice(this.limitPrimaryActions - 1);
    }
  }

  callActionFilter(field: string): void {
    this.callFunction(this.filter[field], this.parentRef);
  }

  onkeypress(key) {
    if (key === 13) {
      this.callActionFilter('action');
    }
  }

  changeModel(newModel): void {
    this.parentRef[this.filter.ngModel] = newModel;
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
