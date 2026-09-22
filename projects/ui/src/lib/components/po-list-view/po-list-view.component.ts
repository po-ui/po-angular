import {
  AfterContentInit,
  AnimationCallbackEvent,
  ChangeDetectorRef,
  Component,
  ContentChild,
  DoCheck,
  IterableDiffers,
  ViewChild,
  inject
} from '@angular/core';
import { Router } from '@angular/router';

import { PoLanguageService } from '../../services/po-language/po-language.service';
import { isExternalLink, openExternalLink, PoUtils } from '../../utils/util';
import { PoModalComponent } from '../po-modal/po-modal.component';
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
 * <example name="po-list-view-field-properties" title="PO List View - Field Properties">
 *  <file name="sample-po-list-view-field-properties/sample-po-list-view-field-properties.component.html"> </file>
 *  <file name="sample-po-list-view-field-properties/sample-po-list-view-field-properties.component.ts"> </file>
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
  standalone: false
})
export class PoListViewComponent extends PoListViewBaseComponent implements AfterContentInit, DoCheck {
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  @ContentChild(PoListViewContentTemplateDirective, { static: true })
  listViewContentTemplate: PoListViewContentTemplateDirective;
  @ContentChild(PoListViewDetailTemplateDirective, { static: true })
  listViewDetailTemplate: PoListViewDetailTemplateDirective;

  @ViewChild('popup', { static: true }) poPopupComponent: PoPopupComponent;
  @ViewChild('detailModal', { static: true }) protected detailModal: PoModalComponent;

  popupActions: Array<PoListViewAction> = [];
  protected detailModalItem: any = null;
  protected detailModalIndex: number;

  private readonly differ;
  private readonly widgetActionsCache = new Map<any, Array<any>>();
  private cachedActionsRef: Array<any> = null;

  constructor() {
    const differs = inject(IterableDiffers);
    const languageService = inject(PoLanguageService);

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

  get titleHasAction() {
    return this.titleAction.observers.length > 0;
  }

  protected isTitleClickable(item: any): boolean {
    return this.titleAction.observers.length > 0 || !!(this.resolvedPropertyLink && item[this.resolvedPropertyLink]);
  }

  protected get itemClickable(): boolean {
    return this.itemClick.observed;
  }

  protected isItemClickable(item: any): boolean {
    return this.itemClick.observed && this.getVisibleActions(item).length <= 1;
  }

  protected onItemClick(item: any, event: MouseEvent): void {
    if (this.isItemClickable(item)) {
      this.itemClick.emit(this.deleteInternalAttrs(item));
    }
  }

  protected onItemKeyDown(item: any, event: KeyboardEvent): void {
    if (this.isItemClickable(item) && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      this.itemClick.emit(this.deleteInternalAttrs(item));
    }
  }

  protected onAdvancedArrowClick(item: any): void {
    const visibleActions = this.getVisibleActions(item);
    if (visibleActions.length === 1) {
      this.onClickAction(visibleActions[0], item);
    } else {
      this.runTitleAction(item);
    }
  }

  protected onTitleClick(item: any): void {
    const link = this.resolvedPropertyLink && item[this.resolvedPropertyLink];

    if (link) {
      if (isExternalLink(link)) {
        openExternalLink(link);
      } else {
        this.router.navigate([link]);
      }
      return;
    }

    this.runTitleAction(item);
  }

  ngAfterContentInit(): void {
    this.initShowDetail();
  }

  ngDoCheck() {
    this.checkItemsChange();
  }

  checkTitleType(item: any) {
    if (this.resolvedPropertyLink && item[this.resolvedPropertyLink]) {
      return item[this.resolvedPropertyLink].startsWith('http') ? 'externalLink' : 'internalLink';
    }

    return 'noLink';
  }

  getItemTitle(item) {
    return this.hasContentTemplate && this.listViewContentTemplate.title
      ? this.listViewContentTemplate.title(item)
      : item[this.resolvedPropertyTitle];
  }

  hasItems(): boolean {
    return this.items && this.items.length > 0;
  }

  returnBooleanValue(listViewAction: PoListViewAction, item: any, property: string) {
    return PoUtils.isTypeof(listViewAction[property], 'function')
      ? (<any>listViewAction)[property](item)
      : listViewAction[property];
  }

  trackBy(index) {
    return index;
  }

  override selectListItem(row: any) {
    super.selectListItem(row);
    this.changeDetector.detectChanges();
  }

  override onClickAction(listViewAction: PoListViewAction, item: any) {
    if (listViewAction.url) {
      if (isExternalLink(listViewAction.url)) {
        openExternalLink(listViewAction.url);
      } else {
        this.router.navigate([listViewAction.url]);
      }
      return;
    }
    super.onClickAction(listViewAction, item);
  }

  protected getItemActionType(item: any): 'advanced' | 'multiple' | 'none' {
    const visibleActions = this.getVisibleActions(item);

    if (visibleActions.length >= 2) {
      return 'multiple';
    }

    if (visibleActions.length === 1) {
      return 'advanced';
    }

    return 'none';
  }

  protected getItemTag(item: any): string | undefined {
    const prop = this.resolvedPropertyTag;
    return prop ? item[prop] : undefined;
  }

  protected getItemTagType(item: any): string {
    const prop = this.resolvedPropertyTagType;
    return prop && item[prop] ? item[prop] : '';
  }

  protected getItemSubtitle(item: any): string | undefined {
    const prop = this.resolvedPropertySubtitle;
    return prop ? item[prop] : undefined;
  }

  protected getItemHighlighted(item: any): boolean {
    const prop = this.resolvedPropertyHighlighted;
    return prop ? !!item[prop] : false;
  }

  protected getItemAvatar(item: any): any {
    if (!this.resolvedPropertyAvatar) {
      return undefined;
    }

    const value = item[this.resolvedPropertyAvatar];

    if (!value) {
      return undefined;
    }

    if (typeof value === 'string') {
      return { src: value, size: this.avatarSize() };
    }

    if (value.icon || value.progress !== undefined || value.indeterminate || value.customTemplate) {
      return undefined;
    }

    const avatar = { ...value };
    avatar.size = this.avatarSize();
    return avatar;
  }

  protected getAvatarType(item: any): string {
    if (!this.resolvedPropertyAvatar) {
      return '';
    }

    const value = item[this.resolvedPropertyAvatar];

    if (!value) {
      return '';
    }

    if (typeof value === 'string') {
      return 'image';
    }

    if (value.icon) {
      return 'icon';
    }

    if (value.progress !== undefined || value.indeterminate) {
      return 'progress';
    }

    if (value.customTemplate) {
      return 'custom';
    }

    return '';
  }

  protected getAvatarData(item: any): any {
    if (!this.resolvedPropertyAvatar) {
      return undefined;
    }
    return item[this.resolvedPropertyAvatar];
  }

  protected getWidgetActions(item: any): Array<any> {
    if (this.cachedActionsRef !== this.actions) {
      this.widgetActionsCache.clear();
      this.cachedActionsRef = this.actions;
    }

    if (this.widgetActionsCache.has(item)) {
      return this.widgetActionsCache.get(item);
    }

    const visibleActions = this.getVisibleActions(item);

    let result: Array<any>;

    if (visibleActions.length >= 2) {
      result = visibleActions.map(listAction => ({
        ...listAction,
        action: () => {
          if (listAction.url) {
            if (isExternalLink(listAction.url)) {
              openExternalLink(listAction.url);
            } else {
              this.router.navigate([listAction.url]);
            }
          } else if (listAction.action) {
            const cleanItem = this['deleteInternalAttrs'](item);
            listAction.action(cleanItem);
          }
        }
      }));
    } else {
      result = [];
    }

    this.widgetActionsCache.set(item, result);
    return result;
  }

  togglePopup(item, targetRef: HTMLElement) {
    this.popupTarget = targetRef;
    this.popupActions = this.getVisibleActions(item);
    this.changeDetector.detectChanges();

    this.poPopupComponent.toggle(item);
  }

  protected animateDetailEnter(event: AnimationCallbackEvent, item: any): void {
    this.showDetail.emit(item);

    const element = event.target as HTMLElement;
    const height = element.scrollHeight;
    const previousOverflowY = element.style.overflowY;
    element.style.overflowY = 'hidden';

    const animation = element.animate([{ height: '0px' }, { height: `${height}px` }], {
      duration: 100,
      easing: 'linear'
    });

    animation.onfinish = () => {
      element.style.overflowY = previousOverflowY;
    };
  }

  protected animateDetailLeave(event: AnimationCallbackEvent): void {
    const element = event.target as HTMLElement;
    const height = element.scrollHeight;
    element.style.overflowY = 'hidden';

    const animation = element.animate([{ height: `${height}px` }, { height: '0px' }], {
      duration: 100,
      easing: 'linear'
    });

    animation.onfinish = () => {
      event.animationComplete();
    };
  }

  protected openDetailModal(item: any, index: number) {
    this.detailModalItem = item;
    this.detailModalIndex = index;
    this.showDetail.emit(item);
    this.changeDetector.detectChanges();
    this.detailModal.open();
  }

  protected onCloseDetailModal() {
    this.detailModalItem = null;
  }

  // Avalia a visibilidade das ações por item, passando o item corrente.
  protected getVisibleActions(item): Array<PoListViewAction> {
    return this.actions?.filter(action => this.returnBooleanValue(action, item, 'visible') !== false) ?? [];
  }

  private checkItemsChange() {
    const changesItems = this.differ.diff(this.items);

    if (changesItems) {
      this.widgetActionsCache.clear();
    }

    if (changesItems && this.selectAll) {
      this.selectAll = null;
    }

    if (changesItems && this.items?.length && this.select && !this.singleSelect && !this.hideSelectAll) {
      this.showHeader = true;
    }
  }

  private initShowDetail() {
    if (this.items && this.items.length > 0 && this.hasDetailTemplate && this.listViewDetailTemplate.showDetail) {
      this.items.forEach(item => (item.$showDetail = this.listViewDetailTemplate.showDetail(item)));
    }
  }
}
