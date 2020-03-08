import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

import { v4 as uuid } from 'uuid';

import { PoModalBaseComponent } from './po-modal-base.component';
import { PoModalService } from './po-modal-service';

/**
 * @docsExtends PoModalBaseComponent
 *
 * @example
 *
 * <example name="po-modal-basic" title="Portinari Modal Basic">
 *  <file name="sample-po-modal-basic/sample-po-modal-basic.component.html"> </file>
 *  <file name="sample-po-modal-basic/sample-po-modal-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-modal-labs" title="Portinari Modal Labs">
 *  <file name="sample-po-modal-labs/sample-po-modal-labs.component.html"> </file>
 *  <file name="sample-po-modal-labs/sample-po-modal-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-modal-fruits-salad" title="Portinari Modal - Fruits Salad">
 *  <file name="sample-po-modal-fruits-salad/sample-po-modal-fruits-salad.component.html"> </file>
 *  <file name="sample-po-modal-fruits-salad/sample-po-modal-fruits-salad.component.ts"> </file>
 * </example>
 */

@Component({
  selector: 'po-modal',
  templateUrl: './po-modal.component.html'
})
export class PoModalComponent extends PoModalBaseComponent {

  @ViewChild('modalContent', { read: ElementRef }) modalContent: ElementRef;

  private firstElement;
  private focusFunction;
  private focusableElements = 'input, select, textarea, button:not([disabled]), a';
  private id: string = uuid();
  private sourceElement;

  onResizeListener: () => void;

  constructor(private poModalService: PoModalService, private renderer: Renderer2, private changeDetector: ChangeDetectorRef) {
    super();
  }

  close(xClosed = false) {
    this.poModalService.modalActive = undefined;

    super.close(xClosed);

    this.removeEventListeners();

    if (this.sourceElement) {
      this.sourceElement.focus();
    }
  }

  closeModalOnEscapeKey(event) {
    if (!this.hideClose) {
      event.preventDefault();
      event.stopPropagation();
      this.close();
    }
  }

  getPrimaryActionButtonType() {
    return this.primaryAction.danger ? 'danger' : 'primary';
  }

  getSecondaryActionButtonType() {
    return this.secondaryAction && this.secondaryAction.danger && !this.primaryAction.danger ? 'danger' : 'default';
  }

  onClickOut(event) {
    if (this.clickOut && !this.modalContent.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  open() {
    this.sourceElement = document.activeElement;

    super.open();

    this.handleFocus();
  }

  private handleFocus(): any {
    this.poModalService.modalActive = this.id;

    setTimeout(() => {
      if (this.modalContent) {
        this.initFocus();
        document.addEventListener('focus', this.focusFunction, true);
      }
    });
  }

  private initFocus() {
    this.focusFunction = (event: any) => {
      this.poModalService.modalActive = this.poModalService.modalActive || this.id;
      const modalElement = this.modalContent.nativeElement;

      if (!modalElement.contains(event.target) && this.poModalService.modalActive === this.id) {
        event.stopPropagation();
        this.firstElement.focus();
      }
    };

    this.setFirstElement();

    if (this.hideClose) {
      this.firstElement.focus();
    } else {
      const firstFieldElement =
        this.modalContent.nativeElement.querySelectorAll(this.focusableElements)[1] ||
        this.modalContent.nativeElement;
      firstFieldElement.focus();
    }
  }

  private removeEventListeners() {
    document.removeEventListener('focus', this.focusFunction, true);
  }

  private setFirstElement() {
    this.firstElement = this.modalContent.nativeElement.querySelector(this.focusableElements) || this.modalContent.nativeElement;
  }

}
