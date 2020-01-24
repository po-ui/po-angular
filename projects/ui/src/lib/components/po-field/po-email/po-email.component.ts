import { AfterViewInit, Component, ElementRef, forwardRef, OnDestroy } from '@angular/core';
import { AbstractControl, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';

import { PoInputGeneric } from '../po-input-generic/po-input-generic';

/**
 * @docsExtends PoInputBaseComponent
 *
 * @description
 *
 * po-email é um input específico para receber E-mail, com o pattern já configurado.
 *
 * @example
 *
 * <example name="po-email-basic" title="Portinari Email Basic">
 *  <file name="sample-po-email-basic/sample-po-email-basic.component.html"> </file>
 *  <file name="sample-po-email-basic/sample-po-email-basic.component.ts"> </file>
 *  <file name="sample-po-email-basic/sample-po-email-basic.component.e2e-spec.ts"> </file>
 *  <file name="sample-po-email-basic/sample-po-email-basic.component.po.ts"> </file>
 * </example>
 *
 * <example name="po-email-labs" title="Portinari Email Labs">
 *  <file name="sample-po-email-labs/sample-po-email-labs.component.html"> </file>
 *  <file name="sample-po-email-labs/sample-po-email-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-email-newsletter" title="Portinari Email - Newsletter">
 *  <file name="sample-po-email-newsletter/sample-po-email-newsletter.component.html"> </file>
 *  <file name="sample-po-email-newsletter/sample-po-email-newsletter.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-email',
  templateUrl: '../po-input/po-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoEmailComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PoEmailComponent),
      multi: true
    }
  ]
})
export class PoEmailComponent extends PoInputGeneric implements AfterViewInit, OnDestroy {

  icon = 'po-icon-mail';

  maxlength: number = 254;

  type = 'email';

  pattern = '^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$';

  mask = '';

  private listener = this.validateClassesForPattern.bind(this);

  constructor(el: ElementRef) {
    super(el);
  }

  ngAfterViewInit() {
    setTimeout(() => {
    // Se não tem ngModel ou reactive form adiciona validação com classes css
      if (!this.onChangePropagate) {
        this.inputEl.nativeElement.addEventListener('keyup', this.listener);
      }
    });
    super.ngAfterViewInit();
  }

  ngOnDestroy() {
    if (!this.onChangePropagate) {
      this.inputEl.nativeElement.removeEventListener('keyup', this.listener);
    }
  }

    extraValidation(c: AbstractControl): { [key: string]: any } {
    return null;
  }
}
