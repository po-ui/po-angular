import { AfterContentInit, Component, OnChanges, Renderer2, SimpleChange, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

import { PoLanguageService } from './../../../services/po-language/po-language.service';

import { callFunction, isExternalLink, isTypeof, openExternalLink } from '../../../utils/util';
import { PoPageAction } from '../po-page-action.interface';

import { PoPageDefaultBaseComponent } from './po-page-default-base.component';

/**
 * @docsExtends PoPageDefaultBaseComponent
 *
 * @example
 *
 * <example name="po-page-default-basic" title="PO Page Default Basic">
 *  <file name="sample-po-page-default-basic/sample-po-page-default-basic.component.html"> </file>
 *  <file name="sample-po-page-default-basic/sample-po-page-default-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-default-labs" title="PO Page Default Labs">
 *  <file name="sample-po-page-default-labs/sample-po-page-default-labs.component.html"> </file>
 *  <file name="sample-po-page-default-labs/sample-po-page-default-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-default-dashboard" title="PO Page Default - Dashboard">
 *  <file name="sample-po-page-default-dashboard/sample-po-page-default-dashboard.component.html"> </file>
 *  <file name="sample-po-page-default-dashboard/sample-po-page-default-dashboard.component.ts"> </file>
 *  <file name="sample-po-page-default-dashboard/sample-po-page-default-dashboard.service.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-page-default',
  templateUrl: './po-page-default.component.html'
})
export class PoPageDefaultComponent extends PoPageDefaultBaseComponent implements AfterContentInit, OnChanges {
  limitPrimaryActions: number = 3;
  dropdownActions: Array<PoPageAction>;
  isMobile: boolean;

  private maxWidthMobile: number = 480;

  constructor(
    viewRef: ViewContainerRef,
    languageService: PoLanguageService,
    private renderer: Renderer2,
    private router: Router
  ) {
    super(languageService);
  }

  public ngAfterContentInit(): void {
    this.setIsMobile();
    this.setDropdownActions();

    this.renderer.listen('window', 'resize', (event: Event) => {
      this.onResize(event);
    });
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    this.setDropdownActions();
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

  hasPageHeader() {
    return !!(
      this.title ||
      (this.visibleActions && this.visibleActions.length) ||
      (this.breadcrumb && this.breadcrumb.items.length)
    );
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
}
