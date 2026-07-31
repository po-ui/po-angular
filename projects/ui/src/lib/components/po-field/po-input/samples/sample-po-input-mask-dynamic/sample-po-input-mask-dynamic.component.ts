import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { MASK_CPF, onlyDigits, resolveMask } from './document-mask';

@Component({
  selector: 'sample-po-input-mask-dynamic',
  templateUrl: './sample-po-input-mask-dynamic.component.html',
  standalone: false
})
export class SamplePoInputMaskDynamicComponent {
  // NgModel
  document: string = '';
  mask: string = MASK_CPF;

  // Reactive Forms
  formMask: string = MASK_CPF;
  form = new FormGroup({
    document: new FormControl('')
  });

  constructor(private cd: ChangeDetectorRef) {}

  // --- NgModel ---

  handleKeydown(event: KeyboardEvent): void {
    this.updateMask(this.predictMaskFromKeydown(event, this.mask));
  }

  handlePaste(event: ClipboardEvent): void {
    this.updateMask(this.predictMaskFromPaste(event));
  }

  handleChangeModel(value: string): void {
    this.mask = resolveMask(onlyDigits(value).length);
  }

  // --- Reactive Forms ---

  handleFormKeydown(event: KeyboardEvent): void {
    this.updateFormMask(this.predictMaskFromKeydown(event, this.formMask));
  }

  handleFormPaste(event: ClipboardEvent): void {
    this.updateFormMask(this.predictMaskFromPaste(event));
  }

  handleFormChangeModel(value: string): void {
    this.formMask = resolveMask(onlyDigits(value).length);
  }

  /**
   * Calcula quantos dígitos o campo terá após a tecla ser processada e retorna a máscara
   * correspondente. A troca precisa acontecer ANTES do po-input consumir a tecla.
   */
  private predictMaskFromKeydown(event: KeyboardEvent, currentMask: string): string {
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return currentMask;
    }

    const input = event.target as HTMLInputElement;
    const value = input.value || '';
    const start = input.selectionStart ?? value.length;
    const end = input.selectionEnd ?? start;

    let length = onlyDigits(value).length - onlyDigits(value.slice(start, end)).length;

    if (/^[0-9]$/.test(event.key)) {
      length++;
    } else if (event.key === 'Backspace' && start === end && start > 0) {
      length--;
    } else if (event.key === 'Delete' && start === end && start < value.length) {
      length--;
    } else {
      return currentMask;
    }

    return resolveMask(length);
  }

  /** Calcula a quantidade de dígitos resultante de um paste e retorna a máscara correspondente. */
  private predictMaskFromPaste(event: ClipboardEvent): string {
    const input = event.target as HTMLInputElement;
    const value = input.value || '';
    const start = input.selectionStart ?? value.length;
    const end = input.selectionEnd ?? start;

    const pasted = onlyDigits(event.clipboardData?.getData('text') || '');
    const kept = onlyDigits(value).length - onlyDigits(value.slice(start, end)).length;

    return resolveMask(kept + pasted.length);
  }

  /**
   * Atualiza `this.mask` e propaga o binding imediatamente via detectChanges.
   * O detectChanges é necessário porque o po-input consome a máscara ainda dentro
   * do mesmo evento de teclado, antes do próximo ciclo de detecção de mudanças.
   */
  private updateMask(newMask: string): void {
    if (newMask !== this.mask) {
      this.mask = newMask;
      this.cd.detectChanges();
    }
  }

  /** Mesmo que `updateMask`, mas para o campo do Reactive Forms. */
  private updateFormMask(newMask: string): void {
    if (newMask !== this.formMask) {
      this.formMask = newMask;
      this.cd.detectChanges();
    }
  }
}
