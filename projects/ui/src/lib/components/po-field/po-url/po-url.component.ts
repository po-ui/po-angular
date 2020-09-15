import { AfterViewInit, Component, ElementRef, forwardRef, OnDestroy } from '@angular/core';
import { AbstractControl, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';

import { PoInputGeneric } from '../po-input-generic/po-input-generic';

/**
 * @docsExtends PoInputBaseComponent
 *
 * @description
 *
 * po-url é um input específico para receber URL, com o pattern já configurado.
 *
 * @example
 *
 * <example name="po-url-basic" title="PO Url Basic">
 *   <file name="sample-po-url-basic/sample-po-url-basic.component.html"> </file>
 *   <file name="sample-po-url-basic/sample-po-url-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-url-labs" title="PO Url Labs">
 *   <file name="sample-po-url-labs/sample-po-url-labs.component.html"> </file>
 *   <file name="sample-po-url-labs/sample-po-url-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-url-shortener" title="PO Url - Shortener">
 *   <file name="sample-po-url-shortener/sample-po-url-shortener.component.html"> </file>
 *   <file name="sample-po-url-shortener/sample-po-url-shortener.component.ts"> </file>
 * </example>
 *
 */
@Component({
  selector: 'po-url',
  templateUrl: '../po-input/po-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoUrlComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PoUrlComponent),
      multi: true
    }
  ]
})
export class PoUrlComponent extends PoInputGeneric implements AfterViewInit, OnDestroy {
  icon = 'po-icon-world';

  type = 'url';

  pattern =
    '^((https|http):\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-A-Za-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&A-Za-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-A-Za-z\\d_]*)?$';

  mask = '';

  private listener = this.validateClassesForPattern.bind(this);

  /* istanbul ignore next */
  constructor(el: ElementRef) {
    super(el);
    this.maxlength = 254;
  }

  ngAfterViewInit() {
    // Se não tem ngModel ou reactive form adiciona validação com classes css
    setTimeout(() => {
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
