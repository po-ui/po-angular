import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';

import { PoControlPositionService } from '../../services/po-control-position/po-control-position.service';
import { isExternalLink, uuid, PoUtils } from '../../utils/util';

import { PoListBoxComponent } from '../po-listbox';
import { PoPopupAction } from './po-popup-action.interface';
import { PoPopupBaseComponent } from './po-popup-base.component';

const PO_POPUP_ARROW_TO_CORNER_POSITION: Record<string, string> = {
  'bottom-left': 'top-left',
  'bottom-right': 'top-right',
  'top-right': 'bottom-right',
  'top-left': 'bottom-left'
};

const PO_POPUP_ARROW_TO_POSITION: Record<string, string> = {
  bottom: 'top',
  'bottom-right': 'top-left',
  'bottom-left': 'top-right',
  left: 'right',
  'left-bottom': 'right-top',
  'left-top': 'right-bottom',
  top: 'bottom',
  'top-left': 'bottom-right',
  'top-right': 'bottom-left',
  right: 'left',
  'right-top': 'left-bottom',
  'right-bottom': 'left-top'
};

/**
 *
 * @docsExtends PoPopupBaseComponent
 *
 * @example
 *
 * <example name="po-popup-basic" title="PO Popup - Basic">
 *   <file name="sample-po-popup-basic/sample-po-popup-basic.component.html"> </file>
 *   <file name="sample-po-popup-basic/sample-po-popup-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-popup-labs" title="PO Popup - Labs">
 *   <file name="sample-po-popup-labs/sample-po-popup-labs.component.html"> </file>
 *   <file name="sample-po-popup-labs/sample-po-popup-labs.component.ts"> </file>
 *   <file name="sample-po-popup-labs/sample-po-popup-labs.component.css"> </file>
 * </example>
 *
 * <example name="po-popup-email" title="PO Popup Email">
 *   <file name="sample-po-popup-email/sample-po-popup-email.component.html"> </file>
 *   <file name="sample-po-popup-email/sample-po-popup-email.component.ts"> </file>
 *   <file name="sample-po-popup-email/sample-po-popup-email.component.css"> </file>
 * </example>
 *
 */
@Component({
  selector: 'po-popup',
  templateUrl: './po-popup.component.html',
  providers: [PoControlPositionService],
  standalone: false
})
export class PoPopupComponent extends PoPopupBaseComponent implements AfterViewInit {
  id = `po-popup[${uuid()}]`;
  private readonly renderer = inject(Renderer2);
  private readonly router = inject(Router);
  private readonly poControlPosition = inject(PoControlPositionService);
  changeDetector = inject(ChangeDetectorRef);

  @ViewChild('popupRef', { read: ElementRef }) popupRef: ElementRef;
  @ViewChild('listbox', { read: ElementRef }) listbox: ElementRef;

  private readonly popupOffset = 8;
  private readonly viewportMargin = 8;

  //utilizado apenas no theme builder
  @ViewChild('poListBoxRef') poListBoxRef: PoListBoxComponent;

  ngAfterViewInit() {
    if (this.templateIcon && this.target) {
      this.target = this.target?.iconElement?.nativeElement;
    }
  }

  /**
   * Fecha o componente *popup*.
   *
   * > Por padrão, este comportamento é acionado somente ao clicar fora do componente ou em determinada ação / url.
   */
  close(closeEvent?: { reason?: string; origin?: string }) {
    this.removeListeners();

    this.showPopup = false;
    this.closeEvent.emit();

    if (closeEvent?.reason === 'escape') {
      this.focusTarget();
    }
  }

  onActionClick(popupAction: PoPopupAction) {
    const actionNoDisabled = popupAction && !this.returnBooleanValue(popupAction, 'disabled');

    if (popupAction?.action && actionNoDisabled) {
      this.close();
      popupAction.action(this.param || popupAction);
    }

    if (popupAction?.url && actionNoDisabled) {
      this.close();
      return this.openUrl(popupAction.url);
    }
  }

  /**
   * Abre o componente *popup*.
   *
   * > É possível informar um parâmetro que será utilizado na execução da ação do item e na função de desabilitar.
   */
  open(param?) {
    this.oldTarget = this.target;
    this.param = param;
    this.showPopup = true;
    this.changeDetector.detectChanges();
    this.openEvent.emit();
    this.validateInitialContent();
  }

  returnBooleanValue(popupAction: any, property: string) {
    return PoUtils.isTypeof(popupAction[property], 'function')
      ? popupAction[property](this.param || popupAction)
      : popupAction[property];
  }

  /**
   * Responsável por abrir e fechar o *popup*.
   *
   * Quando disparado abrirá o *popup* e caso o mesmo já estiver aberto e possuir o mesmo `target` irá fecha-lo.
   *
   * É possível informar um parâmetro que será utilizado na execução da ação do item e na função de desabilitar.
   */
  toggle(param?) {
    this.showPopup && this.oldTarget === this.target ? this.close() : this.open(param);
  }

  onClickItem(item: any) {
    if (!item.goBack) {
      this.clickItem.emit(item);
    }

    if (item.subItems || item.$subItemTemplate || item.goBack) {
      this.changeDetector.detectChanges();
      this.validateInitialContent();
    }
  }

  onContentChange() {
    if (!this.showPopup) {
      return;
    }

    this.changeDetector.detectChanges();

    if (this.hasContentToShow()) {
      this.setPosition(this.getStickyPositions());
    }
  }

  protected checkAllActionIsInvisible() {
    if (this.rootLazyLoad && !this.actions.length) {
      return false;
    }

    if (this.actions.every(item => item.visible === false)) {
      return true;
    }
    return false;
  }

  private clickedOutDisabledItem(event) {
    const containsItemDisabled =
      this.elementContains(event.target, 'po-popup-item-disabled') ||
      this.elementContains(event.target.parentElement, 'po-popup-item-disabled');

    return !containsItemDisabled;
  }

  private clickedOutHeaderTemplate(event) {
    const popupHeaderTemplate = this.popupRef && this.popupRef.nativeElement.querySelector('[p-popup-header-template]');
    return !(popupHeaderTemplate && popupHeaderTemplate.contains(event.target));
  }

  private isEventInsideElement(event: MouseEvent, element?: HTMLElement): boolean {
    if (!element) {
      return false;
    }

    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];

    return path.length ? path.includes(element) : element.contains(event.target as Node);
  }

  private clickedOutTarget(event) {
    return this.target && !this.isEventInsideElement(event, this.target);
  }

  private clickedOutPopup(event) {
    return this.popupRef?.nativeElement && !this.isEventInsideElement(event, this.popupRef.nativeElement);
  }

  private closePopupOnClickout(event: MouseEvent) {
    if (
      this.clickedOutTarget(event) &&
      this.clickedOutPopup(event) &&
      this.clickedOutDisabledItem(event) &&
      this.clickedOutHeaderTemplate(event)
    ) {
      this.close();
    }
  }

  private elementContains(element: HTMLElement, className: string) {
    return element && element.classList.contains(className);
  }

  private hasContentToShow() {
    return !!(this.popupRef?.nativeElement && this.listbox?.nativeElement);
  }

  private initializeListeners() {
    this.resizeListener = this.renderer.listen('window', 'resize', () => {
      this.close();
    });

    this.clickoutListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
      this.closePopupOnClickout(event);
    });

    window.addEventListener('scroll', this.onScroll, true);
  }

  private readonly onScroll = ({ target }): void => {
    const { showPopup, popupRef } = this;

    if (showPopup && popupRef?.nativeElement && target instanceof Node && !popupRef.nativeElement.contains(target)) {
      this.close();
    }
  };

  private openUrl(url: string) {
    if (isExternalLink(url)) {
      return PoUtils.openExternalLink(url);
    }

    if (url) {
      return this.router.navigate([url]);
    }
  }

  private removeListeners() {
    if (this.clickoutListener) {
      this.clickoutListener();
    }

    if (this.resizeListener) {
      this.resizeListener();
    }

    window.removeEventListener('scroll', this.onScroll, true);
  }

  private setPosition(preferredPositions?: Array<string>) {
    if (this.listbox.nativeElement.querySelector('.po-listbox')) {
      const customPositions = preferredPositions?.length ? preferredPositions : this.customPositions;

      this.poControlPosition.setElements(
        this.popupRef.nativeElement,
        this.popupOffset,
        this.target,
        customPositions,
        false,
        this.isCornerAlign
      );
      this.poControlPosition.adjustPosition(this.position);
      this.arrowDirection = this.poControlPosition.getArrowDirection();
      this.clampHeightToViewport();
    }
  }

  private clampHeightToViewport(): void {
    const popupElement: HTMLElement = this.popupRef?.nativeElement;
    const targetElement: HTMLElement = this.target;
    const scrollElement = this.getScrollableListboxElement();

    if (!popupElement || !targetElement || !scrollElement) {
      return;
    }

    if (!this.isOpeningUp()) {
      this.renderer.removeStyle(scrollElement, 'maxHeight');
      return;
    }

    const targetRect = targetElement.getBoundingClientRect();
    const spaceAbove = targetRect.top - this.popupOffset - this.viewportMargin;

    if (spaceAbove <= 0) {
      return;
    }

    if (popupElement.offsetHeight > spaceAbove) {
      const nonScrollableHeight = popupElement.offsetHeight - scrollElement.offsetHeight;
      const maxScrollHeight = Math.max(spaceAbove - nonScrollableHeight, 0);

      this.renderer.setStyle(scrollElement, 'maxHeight', `${maxScrollHeight}px`);
      this.poControlPosition.adjustPosition(this.position);
      this.arrowDirection = this.poControlPosition.getArrowDirection();
    }
  }

  private getScrollableListboxElement(): HTMLElement | null {
    const listboxElement: HTMLElement = this.listbox?.nativeElement;

    if (!listboxElement) {
      return null;
    }

    return listboxElement.querySelector<HTMLElement>('ul[role=listbox]') ?? listboxElement;
  }

  private isOpeningUp(): boolean {
    const currentPosition = this.isCornerAlign
      ? PO_POPUP_ARROW_TO_CORNER_POSITION[this.arrowDirection]
      : PO_POPUP_ARROW_TO_POSITION[this.arrowDirection];

    return !!currentPosition && currentPosition.startsWith('top');
  }

  private getStickyPositions(): Array<string> | undefined {
    const positions = this.customPositions;

    if (!positions?.length) {
      return undefined;
    }

    const currentPosition = this.isCornerAlign
      ? PO_POPUP_ARROW_TO_CORNER_POSITION[this.arrowDirection]
      : PO_POPUP_ARROW_TO_POSITION[this.arrowDirection];

    const currentIndex = currentPosition ? positions.indexOf(currentPosition) : -1;

    if (currentIndex <= 0) {
      return positions;
    }

    return [...positions.slice(currentIndex), ...positions.slice(0, currentIndex)];
  }

  private validateInitialContent() {
    if (this.hasContentToShow()) {
      this.setPosition();
      this.initializeListeners();
    } else if (!this.rootLazyLoad) {
      this.close();
    }
  }

  private focusTarget(): void {
    const focusableTarget = this.target as HTMLElement;

    if (focusableTarget && typeof focusableTarget.focus === 'function') {
      focusableTarget.focus();
    }
  }
}
