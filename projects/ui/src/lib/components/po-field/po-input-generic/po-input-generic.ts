import { AfterViewInit, ElementRef, HostListener, ViewChild, Directive } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { PoInputBaseComponent } from '../po-input/po-input-base.component';

/* tslint:disable:directive-class-suffix */
@Directive()
export abstract class PoInputGeneric extends PoInputBaseComponent implements AfterViewInit {
  @ViewChild('inp', { read: ElementRef, static: true }) inputEl: ElementRef;

  type = 'text';

  el: ElementRef;
  valueBeforeChange: any;
  timeoutChange: any;

  get autocomplete(): string {
    return this.noAutocomplete ? 'off' : 'on';
  }

  constructor(el: ElementRef) {
    super();

    this.el = el;
  }

  ngAfterViewInit() {
    this.afterViewInit();
  }

  afterViewInit() {
    this.verifyAutoFocus();
    if (this.type !== 'password') {
      this.setPaddingInput();
    }
  }

  focus() {
    if (!this.disabled) {
      this.inputEl.nativeElement.focus();
    }
  }

  setPaddingInput() {
    setTimeout(() => {
      const selectorIcons = '.po-field-icon-container:not(.po-field-icon-container-left) > .po-icon';
      let icons = this.el.nativeElement.querySelectorAll(selectorIcons).length;
      if (this.clean) {
        icons++;
      }
      if (icons) {
        this.inputEl.nativeElement.style.paddingRight = `${icons * 36}px`;
      }
    });
  }

  verifyAutoFocus() {
    if (this.autoFocus) {
      this.focus();
    }
  }

  @HostListener('keydown', ['$event']) onKeydown(e: any) {
    if (this.mask && !this.readonly && e.target.keyCode !== 229) {
      this.eventOnBlur(e);
      this.objMask.keydown(e);
    }
  }

  @HostListener('keyup', ['$event']) onKeyup(e: any) {
    if (this.mask && !this.readonly) {
      if (e.target.keyCode !== 229) {
        this.eventOnBlur(e);
        this.objMask.keyup(e);
      }
      this.callOnChange(this.objMask.valueToModel);
    }
  }

  eventOnInput(e: any) {
    let value = '';
    if (!this.mask) {
      value = this.validMaxLength(this.maxlength, e.target.value);
      this.inputEl.nativeElement.value = value;
    } else {
      this.objMask.blur(e);
      this.inputEl.nativeElement.value = this.objMask.valueToInput;
      value = this.objMask.valueToModel;
    }
    this.callOnChange(value);
  }

  validMaxLength(maxlength: number, value: string) {
    return (maxlength || maxlength === 0) && value.length > maxlength
      ? value.toString().substring(0, maxlength)
      : value;
  }

  eventOnFocus(e: any) {
    // Atualiza valor da variável que será usada para verificar se o campo teve alteração
    this.valueBeforeChange = this.inputEl.nativeElement.value;

    // Dispara evento quando o usuário entrar no campo
    // Este evento também é disparado quando o campo inicia com foco.
    this.enter.emit();
  }

  eventOnBlur(e: any) {
    this.onTouched?.();
    if (this.mask) {
      this.objMask.blur(e);
    }

    if (e.type === 'blur') {
      this.blur.emit();
      this.controlChangeEmitter();
    }
  }

  controlChangeEmitter() {
    const elementValue = this.inputEl.nativeElement.value;

    // Emite o evento change manualmente quando o campo é alterado
    // Este evento é controlado manualmente devido ao preventDefault existente na máscara
    // e devido ao controle do p-clean, que também precisa emitir change
    if (elementValue !== this.valueBeforeChange) {
      clearTimeout(this.timeoutChange);
      this.timeoutChange = setTimeout(() => {
        this.change.emit(elementValue);
      }, 200);
    }
  }

  eventOnClick(e: any) {
    // Atualiza a posição do cursor ao clicar
    if (this.mask) {
      this.objMask.click(e);
    }
  }

  hasInvalidClass() {
    return (
      this.el.nativeElement.classList.contains('ng-invalid') &&
      this.el.nativeElement.classList.contains('ng-dirty') &&
      this.inputEl.nativeElement.value !== ''
    );
  }

  getErrorPattern() {
    return this.errorPattern !== '' && this.hasInvalidClass() ? this.errorPattern : '';
  }

  validateClassesForPattern() {
    const value = this.getScreenValue();
    const element = this.el.nativeElement;

    if (value && !this.verifyPattern(this.pattern, value)) {
      element.classList.add('ng-invalid');
      element.classList.add('ng-dirty');
    } else {
      element.classList.remove('ng-invalid');
    }
  }

  verifyPattern(pattern: string, value: any) {
    return new RegExp(pattern).test(value);
  }

  clear(value) {
    this.callOnChange(value);
    this.controlChangeEmitter();
  }

  writeValueModel(value) {
    this.passedWriteValue = true;
    if (this.inputEl) {
      if (value) {
        if (this.mask) {
          this.inputEl.nativeElement.value = this.objMask.controlFormatting(String(value));

          // Se o model for definido como formatado, então precisa atualizá-lo no primeiro acesso
          if (this.objMask.formatModel) {
            this.callUpdateModelWithTimeout(this.objMask.valueToModel);
          }
        } else {
          this.inputEl.nativeElement.value = value;
        }
      } else {
        // Se o valor for indefinido, deve limpar o campo.
        this.inputEl.nativeElement.value = '';
      }
    }

    // Emite evento quando o model é atualizado, inclusive a primeira vez
    if (value) {
      this.changeModel.emit(value);
    }
  }

  getScreenValue() {
    const screenValue = (this.inputEl && this.inputEl.nativeElement.value) || undefined;

    if (this.type === 'number') {
      const parsedValue = parseFloat(screenValue);
      return parsedValue || parsedValue === 0 ? parsedValue : null;
    } else {
      return screenValue;
    }
  }

  abstract extraValidation(c: AbstractControl): { [key: string]: any };
}
