import {
  AfterContentInit,
  AfterViewChecked,
  AnimationCallbackEvent,
  ChangeDetectorRef,
  Component,
  ContentChild,
  DoCheck,
  ElementRef,
  inject,
  IterableDiffers,
  Renderer2,
  TemplateRef,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { Router } from '@angular/router';

import { PoLanguageService } from '../../services/po-language/po-language.service';
import { isExternalLink, openExternalLink, PoUtils } from '../../utils/util';
import { PoModalComponent } from '../po-modal/po-modal.component';
import { PoPopupComponent } from '../po-popup/po-popup.component';
import { PoWidgetSelection } from '../po-widget/interfaces/po-widget-selection.interface';

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
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class PoListViewComponent
  extends PoListViewBaseComponent
  implements AfterContentInit, DoCheck, AfterViewChecked
{
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @ContentChild(PoListViewContentTemplateDirective, { static: false })
  listViewContentTemplate: PoListViewContentTemplateDirective;
  @ContentChild(PoListViewDetailTemplateDirective, { static: false })
  listViewDetailTemplate: PoListViewDetailTemplateDirective;

  @ViewChild('avatarProgressTemplate', { static: true }) private readonly avatarProgressTemplate: TemplateRef<any>;
  @ViewChild('avatarIconTemplate', { static: true }) private readonly avatarIconTemplate: TemplateRef<any>;
  @ViewChild('avatarImageTemplate', { static: true }) private readonly avatarImageTemplate: TemplateRef<any>;
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

  protected isItemClickable(item: any): boolean {
    return this.itemClick.observed && this.getVisibleActions(item).length <= 1;
  }

  protected isCardFocusable(item: any): boolean {
    if (this.isItemClickable(item)) {
      return true;
    }

    return this.isTitleClickable(item) && !(this.select && this.isSingleSelection);
  }

  private isSelectionControlClick(event: MouseEvent | KeyboardEvent): boolean {
    const target = event?.target as HTMLElement | null;

    return !!target?.closest?.('po-checkbox, po-radio');
  }

  protected onItemClick(item: any, event: MouseEvent): void {
    if (this.isItemClickable(item)) {
      if (this.select && !this.isSelectionControlClick(event)) {
        if (this.isSingleSelection) {
          this.selectListItem(item);
        } else {
          this.onMultipleSelectionChange(item, !item.$selected);
        }
      }

      if (this.select && this.isSingleSelection && this.isSelectionControlClick(event)) {
        this.selectListItem(item);
      }
      this.itemClick.emit(this.deleteInternalAttrs(item));
    }
  }

  protected onItemKeyDown(item: any, event: KeyboardEvent): void {
    if (this.isItemClickable(item) && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      if (this.select && !this.isSelectionControlClick(event)) {
        if (this.isSingleSelection) {
          this.selectListItem(item);
        } else {
          this.onMultipleSelectionChange(item, !item.$selected);
        }
      }
      this.itemClick.emit(this.deleteInternalAttrs(item));
      return;
    }

    if (!this.isItemClickable(item) && this.isTitleClickable(item) && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      this.onTitleClick(item);
    }
  }

  protected onTitleKeyDown(item: any, event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      this.onTitleClick(item);
    }
  }

  private updateTitleFocusableElements(): void {
    try {
      const root: HTMLElement = this.elementRef?.nativeElement;
      if (!root || !this.items) {
        return;
      }

      const wrappers = Array.from(root.querySelectorAll<HTMLElement>('.po-list-view-item-wrapper'));

      wrappers.forEach((wrapper, index) => {
        this.updateTitleAccessibility(wrapper, index);
        this.updateSelectionControlsBinding(wrapper, index);
      });
    } catch (e) {
      // falha ao atualizar elementos focáveis do título, apenas logar o erro..
    }
  }

  private updateTitleAccessibility(wrapper: HTMLElement, index: number): void {
    const titleEl = wrapper.querySelector('.po-widget-title-action');

    if (!titleEl) {
      return;
    }

    if (this.isTitleClickable(this.items[index])) {
      this.bindTitleFocus(wrapper, titleEl, index);
    } else {
      this.unbindTitleFocus(wrapper, titleEl);
    }
  }

  private bindTitleFocus(wrapper: HTMLElement, titleEl: Element, index: number): void {
    if (titleEl.getAttribute('tabindex') !== '0') {
      this.renderer.setAttribute(titleEl, 'tabindex', '0');
    }

    const container = wrapper.querySelector('.po-widget-container');
    if (container) {
      this.renderer.setAttribute(container, 'tabindex', '-1');
    }

    if (wrapper.dataset.poListViewBound) {
      return;
    }

    const handler = (ev: KeyboardEvent) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        ev.stopPropagation();
        this.onTitleClick(this.items[index]);
      }
    };
    titleEl.addEventListener('keydown', handler);
    wrapper.dataset.poListViewBound = '1';
  }

  private unbindTitleFocus(wrapper: HTMLElement, titleEl: Element): void {
    if (titleEl.getAttribute('tabindex')) {
      this.renderer.removeAttribute(titleEl, 'tabindex');
    }
    if (wrapper.dataset.poListViewBound !== undefined) {
      delete wrapper.dataset.poListViewBound;
    }
  }

  private updateSelectionControlsBinding(wrapper: HTMLElement, index: number): void {
    try {
      this.updateRadioSelectionBinding(wrapper, index);
      this.updateCheckboxSelectionBinding(wrapper, index);
      this.updateSelectionControlTabindex(wrapper, index);
    } catch (e) {}
  }

  private updateSelectionControlTabindex(wrapper: HTMLElement, index: number): void {
    if (!this.select) {
      return;
    }

    const control = this.isSingleSelection
      ? wrapper.querySelector('po-radio input[type="radio"]')
      : wrapper.querySelector('po-checkbox .po-checkbox-outline');

    if (!control) {
      return;
    }

    const item = this.items?.[index];

    if (item && this.isItemClickable(item)) {
      this.renderer.setAttribute(control, 'tabindex', '-1');
    } else {
      this.renderer.setAttribute(control, 'tabindex', '0');
    }
  }

  private updateRadioSelectionBinding(wrapper: HTMLElement, index: number): void {
    const radioEl = wrapper.querySelector('po-radio');

    if (!radioEl) {
      return;
    }

    const radioBound = wrapper.dataset.poListViewRadioBound;

    if (this.select && this.isSingleSelection) {
      if (radioBound) {
        return;
      }

      const singleSelectionHandler = (ev: Event | KeyboardEvent) => this.handleSingleSelectionEvent(ev, index);

      (radioEl as any).__po_list_view_single_selection_handler = singleSelectionHandler;
      radioEl.addEventListener('click', singleSelectionHandler, true);
      radioEl.addEventListener('keydown', singleSelectionHandler, true);
      wrapper.dataset.poListViewRadioBound = '1';
    } else if (radioBound) {
      this.unbindControlHandler(radioEl, '__po_list_view_single_selection_handler', ['click', 'keydown']);
      delete wrapper.dataset.poListViewRadioBound;
    }
  }

  private handleSingleSelectionEvent(ev: Event | KeyboardEvent, index: number): void {
    const keyboardEvent = ev as KeyboardEvent;
    const isKeyboard = keyboardEvent && typeof keyboardEvent.key === 'string';

    if (isKeyboard && !this.isConfirmKey(keyboardEvent)) {
      return;
    }

    if (isKeyboard) {
      keyboardEvent.preventDefault();
    }
    ev.stopPropagation();

    const item = this.items ? this.items[index] : undefined;
    if (item) {
      this.selectListItem(item);
    }
  }

  private updateCheckboxSelectionBinding(wrapper: HTMLElement, index: number): void {
    const checkboxEl = wrapper.querySelector('po-checkbox');

    if (!checkboxEl) {
      return;
    }

    const checkboxBound = wrapper.dataset.poListViewCheckboxBound;

    if (this.select && !this.isSingleSelection) {
      if (checkboxBound) {
        return;
      }

      const captureHandler = (ev: KeyboardEvent) => this.handleCheckboxSelectionEvent(ev, index);

      (checkboxEl as any).__po_list_view_space_capture = captureHandler;
      checkboxEl.addEventListener('keydown', captureHandler, true);
      wrapper.dataset.poListViewCheckboxBound = '1';
    } else if (checkboxBound) {
      this.unbindControlHandler(checkboxEl, '__po_list_view_space_capture', ['keydown']);
      delete wrapper.dataset.poListViewCheckboxBound;
    }
  }

  private handleCheckboxSelectionEvent(ev: KeyboardEvent, index: number): void {
    if (!this.isConfirmKey(ev)) {
      return;
    }

    try {
      ev.preventDefault();
      ev.stopImmediatePropagation();
    } catch (e) {}

    const item = this.items ? this.items[index] : undefined;
    if (item) {
      this.onMultipleSelectionChange(item, !item.$selected);
    }
  }

  private isConfirmKey(ev: KeyboardEvent): boolean {
    const isEnter = ev.key === 'Enter' || ev.keyCode === 13;
    const isSpace = ev.key === ' ' || ev.key === 'Spacebar' || ev.code === 'Space' || ev.keyCode === 32;

    return isEnter || isSpace;
  }

  private unbindControlHandler(control: Element, handlerKey: string, events: Array<string>): void {
    const existingHandler = (control as any)[handlerKey];

    if (existingHandler) {
      try {
        events.forEach(eventName => control.removeEventListener(eventName, existingHandler, true));
      } catch (e) {}
      delete (control as any)[handlerKey];
    }
  }

  protected stopPropagation(event?: Event | null): void {
    event?.stopPropagation?.();
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
    if (this.titleAction.observers.length > 0) {
      this.runTitleAction(item);
    }

    const link = this.resolvedPropertyLink && item[this.resolvedPropertyLink];

    if (link) {
      if (isExternalLink(link)) {
        openExternalLink(link);
      } else {
        this.router.navigate([link]);
      }
    }
  }

  ngAfterContentInit(): void {
    this.initShowDetail();
  }

  ngDoCheck() {
    this.checkItemsChange();
  }

  ngAfterViewChecked(): void {
    this.updateTitleFocusableElements();
    this.syncSingleSelectionVisualState();
    this.hideInvalidAvatarIcons();
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

  trackBy(item: any, index: number) {
    if (item && typeof item === 'object') {
      return item;
    }

    return `${index}-${item}`;
  }

  override selectListItem(row: any) {
    super.selectListItem(row);
    this.ensureSingleSelectionConsistency(row);
    this.changeDetector.detectChanges();
    this.syncSingleSelectionVisualState();
  }

  protected onMultipleSelectionChange(item: any, value: boolean): void {
    item.$selected = value;
    this.selectAll = this['checkIfItemsAreSelected'](this.items);
    this.changeDetector.detectChanges();
  }

  private syncSingleSelectionVisualState(): void {
    if (!this.select || !this.isSingleSelection || !this.items?.length) {
      return;
    }

    const root = this.elementRef?.nativeElement as HTMLElement;
    if (!root) {
      return;
    }

    const selectedIndex = this.items.findIndex(item => !!item?.$selected);
    const wrappers = Array.from(root.querySelectorAll('.po-list-view-item-wrapper'));

    wrappers.forEach((wrapper, index) => {
      const isSelected = selectedIndex === index;

      if (isSelected) {
        this.renderer.addClass(wrapper, 'po-list-view-selected');
      } else {
        this.renderer.removeClass(wrapper, 'po-list-view-selected');
      }
    });
  }

  private ensureSingleSelectionConsistency(preferredRow?: any): void {
    if (!this.select || !this.isSingleSelection || !this.items?.length) {
      return;
    }

    let selectedIndex = this.items.findIndex(item => !!item?.$selected);

    if (preferredRow) {
      const preferredIndex = this.items.indexOf(preferredRow);
      if (preferredIndex > -1) {
        selectedIndex = preferredIndex;
      }
    }

    this.items.forEach((item, index) => {
      item.$selected = selectedIndex > -1 && index === selectedIndex;
    });
  }

  protected onMultipleSelectionKeydown(item: any, event: KeyboardEvent): void {
    const isEnter = event.key === 'Enter' || event.keyCode === 13;
    const isSpace = event.key === ' ' || event.key === 'Spacebar' || event.code === 'Space' || event.keyCode === 32;

    if (isEnter || isSpace) {
      event.preventDefault();
      event.stopPropagation();
      this.onMultipleSelectionChange(item, !item.$selected);
    }
  }

  protected getSelectionConfig(item: any): PoWidgetSelection | undefined {
    if (!this.select) {
      return undefined;
    }

    if (this.isSingleSelection) {
      return {
        type: 'single',
        selected: item.$selected,
        change: () => this.selectListItem(item)
      };
    }

    return {
      type: 'multiple',
      selected: item.$selected,
      change: (selected: boolean) => this.onMultipleSelectionChange(item, selected)
    };
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
      return { src: value, size: this.avatarSize(), customTemplate: this.avatarImageTemplate };
    }

    if (value.icon) {
      return { customTemplate: this.avatarIconTemplate, ...value };
    }

    if (value.progress !== undefined || value.indeterminate) {
      return { customTemplate: this.avatarProgressTemplate, ...value };
    }

    if (value.customTemplate) {
      return { customTemplate: value.customTemplate };
    }

    if (value.src) {
      return { ...value, size: this.avatarSize(), customTemplate: this.avatarImageTemplate };
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

  protected onAvatarImageError(wrapper?: HTMLElement): void {
    if (wrapper) {
      this.collapseAvatarContainer(wrapper);
    }
  }

  protected onAvatarImageLoad(event: Event, wrapper?: HTMLElement): void {
    const img = event?.target as HTMLImageElement;

    if (wrapper && img && (img.naturalWidth <= 1 || img.naturalHeight <= 1)) {
      this.collapseAvatarContainer(wrapper);
    }
  }

  private hideInvalidAvatarIcons(): void {
    const root: HTMLElement = this.elementRef?.nativeElement;

    if (!root) {
      return;
    }

    const iconWrappers = Array.from(root.querySelectorAll<HTMLElement>('[data-po-list-view-avatar-icon]'));

    iconWrappers.forEach(wrapper => {
      const iconElement = wrapper.querySelector('po-icon i');

      if (!iconElement) {
        return;
      }
      if (this.isIconGlyphEmpty(iconElement)) {
        this.collapseAvatarContainer(wrapper);
      } else {
        this.restoreAvatarContainer(wrapper);
      }
    });
  }

  private collapseAvatarContainer(innerWrapper: HTMLElement): void {
    this.renderer.setStyle(innerWrapper, 'display', 'none');

    const avatarContainer = innerWrapper.closest<HTMLElement>('.po-widget-container__avatar');
    if (avatarContainer) {
      this.renderer.setStyle(avatarContainer, 'display', 'none');
    }
  }

  private restoreAvatarContainer(innerWrapper: HTMLElement): void {
    this.renderer.removeStyle(innerWrapper, 'display');

    const avatarContainer = innerWrapper.closest<HTMLElement>('.po-widget-container__avatar');
    if (avatarContainer) {
      this.renderer.removeStyle(avatarContainer, 'display');
    }
  }

  private isIconGlyphEmpty(iconElement: Element): boolean {
    const before = getComputedStyle(iconElement, '::before').content;

    return !before || before === 'none' || before === 'normal' || before === '""' || before === "''";
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
    this.popupActions = this.getWidgetActions(item);
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
