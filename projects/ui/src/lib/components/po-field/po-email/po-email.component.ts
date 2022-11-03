import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  OnDestroy
} from '@angular/core';
import { AbstractControl, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { uuid } from '../../../utils/util';

import { PoInputGeneric } from '../po-input-generic/po-input-generic';

/* istanbul ignore next */
const providers = [
  {
    provide: NG_VALUE_ACCESSOR,
    // eslint-disable-next-line
    useExisting: forwardRef(() => PoEmailComponent),
    multi: true
  },
  {
    provide: NG_VALIDATORS,
    // eslint-disable-next-line
    useExisting: forwardRef(() => PoEmailComponent),
    multi: true
  }
];

/**
 * @docsExtends PoInputBaseComponent
 *
 * @description
 *
 * po-email é um input específico para receber E-mail, com o pattern já configurado.
 *
 * @example
 *
 * <example name="po-email-basic" title="PO Email Basic">
 *  <file name="sample-po-email-basic/sample-po-email-basic.component.html"> </file>
 *  <file name="sample-po-email-basic/sample-po-email-basic.component.ts"> </file>
 *  <file name="sample-po-email-basic/sample-po-email-basic.component.e2e-spec.ts"> </file>
 *  <file name="sample-po-email-basic/sample-po-email-basic.component.po.ts"> </file>
 * </example>
 *
 * <example name="po-email-labs" title="PO Email Labs">
 *  <file name="sample-po-email-labs/sample-po-email-labs.component.html"> </file>
 *  <file name="sample-po-email-labs/sample-po-email-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-email-newsletter" title="PO Email - Newsletter">
 *  <file name="sample-po-email-newsletter/sample-po-email-newsletter.component.html"> </file>
 *  <file name="sample-po-email-newsletter/sample-po-email-newsletter.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-email',
  templateUrl: '../po-input/po-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers
})
export class PoEmailComponent extends PoInputGeneric implements AfterViewInit, OnDestroy {
  id = `po-email[${uuid()}]`;
  icon = 'po-icon-mail';

  type = 'email';

  // Consideramos o uso do nosso pattern com a seguinte expressão.
  // Antes do símbolo @:
  // - não há limite de caracteres.
  // - não pode haver espaços em branco, caracteres acentuados, caracteres especiais ou símbolos.
  // - pode começar com letras, números, hífen ou undescore (underline).
  //
  // Depois do símbolo @:
  // - o domínio tem um limite de até 66 caracteres após um separador.
  // - separador deve ser um 'ponto' (.).
  // - o primeiro bloco pode conter letras, números, hífen ou underscore (underline).
  // - após o primeiro separador é permitido apenas letras.
  // - não pode haver espaços em branco, caracteres acentuados, caracteres especiais ou símbolos.
  //
  // Limite total de 254 caracteres para o e-mail.
  //
  // As recomendações foram consultadas nas RFC 1034, RFC 5321 e RFC 5322.
  //
  // RFC 1034 - https://datatracker.ietf.org/doc/html/rfc1034#section-3
  // RFC 5321 - https://datatracker.ietf.org/doc/html/rfc5321#section-4.5.3.1
  // RFC 5322 - https://datatracker.ietf.org/doc/html/rfc5322#section-3.4
  pattern = '^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([A-Za-z]{2,66}(?:\\.[A-Za-z]{2})?)$';

  mask = '';

  private listener = this.validateClassesForPattern.bind(this);

  /* istanbul ignore next */
  constructor(el: ElementRef, cd: ChangeDetectorRef) {
    super(el, cd);
    this.maxlength = 254;
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
