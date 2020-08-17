import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  DoCheck,
  IterableDiffers,
  ViewChild
} from '@angular/core';

import { isTypeof } from '../../utils/util';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { PoPopupComponent } from '../po-popup/po-popup.component';

import { PoListViewAction } from './interfaces/po-list-view-action.interface';
import { PoListViewBaseComponent } from './po-list-view-base.component';
import { PoListViewContentTemplateDirective } from './po-list-view-content-template/po-list-view-content-template.directive';
import { PoListViewDetailTemplateDirective } from './po-list-view-detail-template/po-list-view-detail-template.directive';

/**
 * @docsExtends PoListViewBaseComponent
 *
 * @example
 *
 * <example name="po-list-view-basic" title="PO List View Basic">
 *  <file name="sample-po-list-view-basic/sample-po-list-view-basic.component.html"> </file>
 *  <file name="sample-po-list-view-basic/sample-po-list-view-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-list-view-labs" title="PO List View Labs">
 *  <file name="sample-po-list-view-labs/sample-po-list-view-labs.component.html"> </file>
 *  <file name="sample-po-list-view-labs/sample-po-list-view-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-list-view-hiring-processes" title="PO List View - Hiring Processes">
 *  <file name="sample-po-list-view-hiring-processes/sample-po-list-view-hiring-processes.component.html"> </file>
 *  <file name="sample-po-list-view-hiring-processes/sample-po-list-view-hiring-processes.component.ts"> </file>
 *  <file name="sample-po-list-view-hiring-processes/sample-po-list-view-hiring-processes.service.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-list-view',
  templateUrl: './po-list-view.component.html',
  animations: [
    trigger('showHideDetail', [
      state('*', style({ 'overflow-y': 'visible' })),
      state('void', style({ 'overflow-y': 'hidden' })),
      transition('* => void', [style({ height: '*', 'overflow-y': 'hidden' }), animate(100, style({ height: 0 }))]),
      transition('void => *', [style({ height: '0' }), animate(100, style({ height: '*' }))])
    ])
  ]
})
export class PoListViewComponent extends PoListViewBaseComponent implements AfterContentInit, DoCheck {
  @ContentChild(PoListViewContentTemplateDirective, { static: true })
  listViewContentTemplate: PoListViewContentTemplateDirective;
  @ContentChild(PoListViewDetailTemplateDirective, { static: true })
  listViewDetailTemplate: PoListViewDetailTemplateDirective;

  @ViewChild('popup', { static: true }) poPopupComponent: PoPopupComponent;

  private differ;

  constructor(private changeDetector: ChangeDetectorRef, differs: IterableDiffers, languageService: PoLanguageService) {
    super(languageService);
    this.differ = differs.find([]).create(null);
  }

  get hasContentTemplate(): boolean {
    return !!this.listViewContentTemplate;
  }

  get hasDetailTemplate(): boolean {
    return !!this.listViewDetailTemplate;
  }

  get displayShowMoreButton(): boolean {
    return this.items && this.items.length > 0 && this.showMore.observers.length > 0;
  }

  get showButtonsActions(): boolean {
    return this.visibleActions && this.visibleActions.length > 0 && this.visibleActions.length <= 2;
  }

  get showPopupActions(): boolean {
    return this.visibleActions && this.visibleActions.length > 2;
  }

  get titleHasAction() {
    return this.titleAction.observers.length > 0;
  }

  get visibleActions() {
    return this.actions && this.actions.filter(action => action.visible !== false);
  }

  ngAfterContentInit(): void {
    this.initShowDetail();
  }

  ngDoCheck() {
    this.checkItemsChange();
  }

  checkTitleType(item: any) {
    if (this.propertyLink && item[this.propertyLink]) {
      return item[this.propertyLink].startsWith('http') ? 'externalLink' : 'internalLink';
    }

    return 'noLink';
  }

  getItemTitle(item) {
    return this.hasContentTemplate && this.listViewContentTemplate.title
      ? this.listViewContentTemplate.title(item)
      : item[this.propertyTitle];
  }

  hasItems(): boolean {
    return this.items && this.items.length > 0;
  }

  returnBooleanValue(listViewAction: PoListViewAction, item: any) {
    return isTypeof(listViewAction.disabled, 'function')
      ? (<any>listViewAction).disabled(item)
      : listViewAction.disabled;
  }

  trackBy(index) {
    return index;
  }

  togglePopup(item, targetRef: HTMLElement) {
    this.popupTarget = targetRef;
    this.changeDetector.detectChanges();

    this.poPopupComponent.toggle(item);
  }

  private checkItemsChange() {
    const changesItems = this.differ.diff(this.items);

    if (changesItems && this.selectAll) {
      this.selectAll = null;
    }

    if (changesItems && this.items && this.items.length && this.select && !this.hideSelectAll) {
      this.showHeader = true;
    }
  }

  private initShowDetail() {
    if (this.items && this.items.length > 0 && this.hasDetailTemplate && this.listViewDetailTemplate.showDetail) {
      this.items.forEach(item => (item.$showDetail = this.listViewDetailTemplate.showDetail(item)));
    }
  }
}
