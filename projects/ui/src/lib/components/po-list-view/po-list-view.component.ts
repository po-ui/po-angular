import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import {
  AfterContentInit,
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
import { PoListViewSelectionMode } from './enums/po-list-view-selection-mode.enum';
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
  ],
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
  @ViewChild('detailModal', { static: true }) detailModal: PoModalComponent;

  popupActions: Array<PoListViewAction> = [];
  detailModalItem: any = null;
  detailModalIndex: number;

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

  get itemClickable(): boolean {
    return this.itemClick.observed;
  }

  isItemClickable(item: any): boolean {
    return this.itemClick.observed && this.getVisibleActions(item).length <= 1;
  }

  onItemClick(item: any, event: MouseEvent): void {
    if (this.isItemClickable(item)) {
      this.itemClick.emit(this.deleteInternalAttrs(item));
    }
  }

  onItemKeyDown(item: any, event: KeyboardEvent): void {
    if (this.isItemClickable(item) && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      this.itemClick.emit(this.deleteInternalAttrs(item));
    }
  }

  onAdvancedArrowClick(item: any): void {
    const visibleActions = this.getVisibleActions(item);
    if (visibleActions.length === 1) {
      this.onClickAction(visibleActions[0], item);
    } else {
      this.runTitleAction(item);
    }
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

  getItemActionType(item: any): 'advanced' | 'multiple' | 'none' {
    const visibleActions = this.getVisibleActions(item);

    if (visibleActions.length >= 2) {
      return 'multiple';
    }

    if (visibleActions.length === 1) {
      return 'advanced';
    }

    return 'none';
  }

  getItemTag(item: any): string | undefined {
    const prop = this.propertyTag();
    return prop ? item[prop] : undefined;
  }

  getItemTagType(item: any): string {
    const prop = this.propertyTagType();
    return prop && item[prop] ? item[prop] : '';
  }

  getItemSubtitle(item: any): string | undefined {
    const prop = this.propertySubtitle();
    return prop ? item[prop] : undefined;
  }

  getItemHighlighted(item: any): boolean {
    const prop = this.propertyHighlighted();
    return prop ? !!item[prop] : false;
  }

  getItemAvatar(item: any): any {
    if (!this.propertyAvatar()) {
      return undefined;
    }

    const value = item[this.propertyAvatar()];

    if (!value) {
      return undefined;
    }

    if (typeof value === 'string') {
      return { src: value, size: this.avatarSize() };
    }

    if (value.icon || value.progress !== undefined || value.indeterminate) {
      return undefined;
    }

    const avatar = { ...value };
    avatar.size = this.avatarSize();
    return avatar;
  }

  getAvatarType(item: any): string {
    if (!this.propertyAvatar()) {
      return '';
    }

    const value = item[this.propertyAvatar()];

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

    return 'custom';
  }

  getAvatarData(item: any): any {
    if (!this.propertyAvatar()) {
      return undefined;
    }
    return item[this.propertyAvatar()];
  }

  getWidgetActions(item: any): Array<any> {
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

  onAnimationEvent(event: AnimationEvent, detail) {
    this.showDetail.emit(detail);
  }

  openDetailModal(item: any, index: number) {
    this.detailModalItem = item;
    this.detailModalIndex = index;
    this.showDetail.emit(item);
    this.changeDetector.detectChanges();
    this.detailModal.open();
  }

  onCloseDetailModal() {
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

    if (
      changesItems &&
      this.items?.length &&
      this.select &&
      this.selectionMode() === PoListViewSelectionMode.Multiple &&
      !this.hideSelectAll
    ) {
      this.showHeader = true;
    }
  }

  private initShowDetail() {
    if (this.items && this.items.length > 0 && this.hasDetailTemplate && this.listViewDetailTemplate.showDetail) {
      this.items.forEach(item => (item.$showDetail = this.listViewDetailTemplate.showDetail(item)));
    }
  }
}
