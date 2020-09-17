import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

import { callFunction, isExternalLink, isTypeof, openExternalLink } from '../../utils/util';
import { PoControlPositionService } from '../../services/po-control-position/po-control-position.service';

import { PoPopupAction } from './po-popup-action.interface';
import { PoPopupBaseComponent } from './po-popup-base.component';

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
 * </example>
 *
 * <example name="po-popup-email" title="PO Popup Email">
 *   <file name="sample-po-popup-email/sample-po-popup-email.component.html"> </file>
 *   <file name="sample-po-popup-email/sample-po-popup-email.component.ts"> </file>
 * </example>
 *
 */
@Component({
  selector: 'po-popup',
  templateUrl: './po-popup.component.html',
  providers: [PoControlPositionService]
})
export class PoPopupComponent extends PoPopupBaseComponent {
  @ViewChild('popupRef', { read: ElementRef }) popupRef: ElementRef;

  constructor(
    viewContainerRef: ViewContainerRef,
    private renderer: Renderer2,
    private router: Router,
    private poControlPosition: PoControlPositionService,
    public changeDetector: ChangeDetectorRef
  ) {
    super();
  }

  /**
   * Fecha o componente *popup*.
   *
   * > Por padrão, este comportamento é acionado somente ao clicar fora do componente ou em determinada ação / url.
   */
  close() {
    this.removeListeners();

    this.showPopup = false;
  }

  onActionClick(popupAction: PoPopupAction) {
    const actionNoDisabled = popupAction && !this.returnBooleanValue(popupAction, 'disabled');

    if (popupAction && popupAction.action && actionNoDisabled) {
      this.close();
      popupAction.action(this.param || popupAction);
    }

    if (popupAction && popupAction.url && actionNoDisabled) {
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
    this.validateInitialContent();
  }

  returnBooleanValue(popupAction: any, property: string) {
    return isTypeof(popupAction[property], 'function')
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

  private clickedOutTarget(event) {
    return this.target && !this.target.contains(event.target);
  }

  private closePopupOnClickout(event: MouseEvent) {
    if (this.clickedOutTarget(event) && this.clickedOutDisabledItem(event) && this.clickedOutHeaderTemplate(event)) {
      this.close();
    }
  }

  private elementContains(element: HTMLElement, className: string) {
    return element && element.classList.contains(className);
  }

  private hasContentToShow() {
    return !!(this.popupRef.nativeElement && this.popupRef.nativeElement.clientHeight);
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

  private onScroll = ({ target }): void => {
    if (this.showPopup && target.className !== 'po-popup-container') {
      this.close();
    }
  };

  private openUrl(url: string) {
    if (isExternalLink(url)) {
      return openExternalLink(url);
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

  private setPosition() {
    this.poControlPosition.setElements(
      this.popupRef.nativeElement,
      8,
      this.target,
      this.customPositions,
      false,
      this.isCornerAlign
    );
    this.poControlPosition.adjustPosition(this.position);
    this.arrowDirection = this.poControlPosition.getArrowDirection();
  }

  private validateInitialContent() {
    if (this.hasContentToShow()) {
      this.setPosition();
      this.initializeListeners();
    } else {
      this.close();
    }
  }
}
