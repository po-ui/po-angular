import { AfterContentInit, Component, inject, OnChanges, OnDestroy, Renderer2, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';

import { PoLanguageService } from './../../../services/po-language/po-language.service';

import { isExternalLink, isTypeof, PoUtils } from '../../../utils/util';
import { AnimaliaIconDictionary } from '../../po-icon/po-icon-dictionary';
import { PoPageAction } from '../interfaces/po-page-action.interface';

import { backNavigationAriaLabels, PoPageDefaultBaseComponent } from './po-page-default-base.component';

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
 *  <file name="sample-po-page-default-dashboard/sample-po-page-default-dashboard.component.css"> </file>
 *  <file name="sample-po-page-default-dashboard/sample-po-page-default-dashboard.service.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-page-default',
  templateUrl: './po-page-default.component.html',
  standalone: false
})
export class PoPageDefaultComponent
  extends PoPageDefaultBaseComponent
  implements AfterContentInit, OnChanges, OnDestroy
{
  private readonly renderer = inject(Renderer2);
  private readonly router = inject(Router);

  readonly backIcon: string = AnimaliaIconDictionary.ICON_ARROW_BACK;
  readonly backNavigationLabel: string;

  limitPrimaryActions: number = 3;
  dropdownActions: Array<PoPageAction>;
  isMobile: boolean;

  private readonly maxWidthMobile: number = 480;
  private _primaryKindUsed = false;
  private resizeUnlisten: () => void;

  constructor() {
    const languageService = inject(PoLanguageService);

    super(languageService);

    this.backNavigationLabel = backNavigationAriaLabels[this.language] || backNavigationAriaLabels['en'];
  }

  public ngAfterContentInit(): void {
    this.setIsMobile();
    this.setDropdownActions();

    this.resizeUnlisten = this.renderer.listen('window', 'resize', (event: Event) => {
      this.onResize(event);
    });
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    this.setDropdownActions();
  }

  ngOnDestroy(): void {
    if (this.resizeUnlisten) {
      this.resizeUnlisten();
    }
  }

  actionIsDisabled(action: any) {
    return isTypeof(action.disabled, 'function') ? action.disabled(action) : action.disabled;
  }

  actionIsVisible(action: any) {
    return isTypeof(action.visible, 'function') ? action.visible(action) : action.visible;
  }

  callAction(item: PoPageAction): void {
    if (item.url) {
      isExternalLink(item.url) ? PoUtils.openExternalLink(item.url) : this.router.navigate([item.url]);
    } else if (item.action) {
      item.action();
    }
  }

  hasPageHeader() {
    this.visibleActions = this.getVisibleActions();
    this._primaryKindUsed = false;

    if (this.pageHeaderType === 'secondary') {
      return true;
    }

    if (this.pageHeaderType === 'tertiary') {
      return !!(this.title || this.visibleActions?.length);
    }

    return !!(this.title || this.visibleActions?.length || this.breadcrumb?.items.length);
  }

  setDropdownActions(): void {
    if (this.pageActionsLayout === 'dropdown') {
      this.dropdownActions = this.visibleActions;
    } else if (this.pageActionsLayout === 'mixed') {
      this.dropdownActions = this.visibleActions.slice(1);
    } else {
      if (this.visibleActions.length > this.limitPrimaryActions) {
        this.dropdownActions = this.visibleActions.slice(this.limitPrimaryActions - 1);
      } else {
        this.dropdownActions = [];
      }
    }
  }

  getVisibleActions() {
    return this.actions.filter(action => this.actionIsVisible(action) !== false);
  }

  // Retorna o kind validado da ação. Apenas 'primary' e 'secondary' são permitidos.
  // Valores inválidos são ignorados, retornando o fallback informado.
  // Somente uma ação pode ter kind 'primary' — a primeira encontrada mantém,
  // as demais caem para 'secondary'.
  getActionKind(action: PoPageAction, fallback: string): string {
    if (action.kind === 'primary') {
      if (!this._primaryKindUsed) {
        this._primaryKindUsed = true;
        return 'primary';
      }
      return 'secondary';
    }

    return action.kind === 'secondary' ? action.kind : fallback;
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
}
