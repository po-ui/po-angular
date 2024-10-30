import {
  AfterViewInit,
  ElementRef,
  HostListener,
  ViewChild,
  Directive,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { PoInputBaseComponent } from '../po-input/po-input-base.component';
import { isObservable, of, Subscription, switchMap } from 'rxjs';

/* eslint-disable @angular-eslint/directive-class-suffix */
@Directive()
export abstract class PoInputGeneric extends PoInputBaseComponent implements AfterViewInit, OnDestroy {
  @ViewChild('inp', { read: ElementRef, static: true }) inputEl: ElementRef;

  type = 'text';

  el: ElementRef;
  valueBeforeChange: any;
  timeoutChange: any;
  private subscriptionValidator: Subscription = new Subscription();

  get autocomplete(): string {
    return this.noAutocomplete ? 'off' : 'on';
  }

  constructor(el: ElementRef, cd?: ChangeDetectorRef) {
    super(cd);

    this.el = el;
  }

  @HostListener('keydown', ['$event']) onKeydown(e: any) {
    if (this.mask && !this.readonly && e.target.keyCode !== 229) {
      this.eventOnBlur(e);
      this.objMask.keydown(e);
      if (this.passedWriteValue) {
        this.validateClassesForMask(true);
      }
    }
  }

  @HostListener('keyup', ['$event']) onKeyup(e: any) {
    if (this.mask && !this.readonly) {
      if (e.target.keyCode !== 229) {
        this.eventOnBlur(e);
        this.objMask.keyup(e);
      }
      this.callOnChange(this.objMask.valueToModel);
      if (this.errorAsyncProperties?.triggerMode === 'changeModel') {
        this.verifyErrorAsync();
      }
    }
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

  ngOnDestroy(): void {
    this.subscriptionValidator?.unsubscribe();
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
    this.inputEl.nativeElement.value = this.upperCase
      ? String(this.inputEl.nativeElement.value).toUpperCase()
      : this.inputEl.nativeElement.value;
    value = this.upperCase ? value.toUpperCase() : value;
    this.callOnChange(value);
    if (this.errorAsyncProperties?.triggerMode === 'changeModel') {
      this.verifyErrorAsync();
    }
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
        const errorAsync = this.errorAsyncProperties;
        if (errorAsync?.triggerMode === 'change' || !errorAsync?.triggerMode) {
          this.verifyErrorAsync();
        }
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
      (this.inputEl.nativeElement.value !== '' ||
        (this.showErrorMessageRequired && (this.required || this.hasValidatorRequired)))
    );
  }

  verifyErrorAsync() {
    if (this.errorPattern !== '' && this.errorAsyncProperties?.errorAsync) {
      const errorAsync = this.errorAsyncProperties.errorAsync(this.inputEl.nativeElement.value);
      if (isObservable(errorAsync)) {
        this.subscriptionValidator.unsubscribe();
        this.subscriptionValidator = errorAsync
          .pipe(
            switchMap(error => {
              const element = this.el.nativeElement;
              if (error) {
                element.classList.add('ng-invalid');
                element.classList.add('ng-dirty');
                this.cd.detectChanges();
              } else if (
                element.classList.contains('ng-invalid') &&
                element.classList.contains('ng-dirty') &&
                !this.isInvalid
              ) {
                element.classList.remove('ng-invalid');
                this.cd.detectChanges();
              }
              return of('');
            })
          )
          .subscribe();
      }
    }
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

  validateClassesForMask(keyDown: boolean = false) {
    const element = this.el.nativeElement;
    const elementValue = this.inputEl.nativeElement.value;

    if (!keyDown && !elementValue) {
      element.classList.add('ng-invalid-mask');
    } else {
      element.classList.remove('ng-invalid-mask');
    }
  }

  verifyPattern(pattern: string, value: any) {
    return new RegExp(pattern).test(value);
  }

  clear(value) {
    this.callOnChange(value);
    this.controlChangeEmitter();
    if (this.errorAsyncProperties?.triggerMode === 'changeModel') {
      this.verifyErrorAsync();
    }
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
      this.validateInitMask();
      this.changeModel.emit(value);
      this.verifyErrorAsync();
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

  validateInitMask() {
    if (this.mask) {
      this.validateClassesForMask();
    }
  }

  abstract extraValidation(c: AbstractControl): { [key: string]: any };
}
