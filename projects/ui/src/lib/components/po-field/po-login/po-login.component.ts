import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { convertToBoolean, uuid } from '../../../utils/util';

import { PoInputGeneric } from '../po-input-generic/po-input-generic';

/* istanbul ignore next */
const providers = [
  {
    provide: NG_VALUE_ACCESSOR,
    // eslint-disable-next-line
    useExisting: forwardRef(() => PoLoginComponent),
    multi: true
  },
  {
    provide: NG_VALIDATORS,
    // eslint-disable-next-line
    useExisting: forwardRef(() => PoLoginComponent),
    multi: true
  }
];

/**
 * @docsExtends PoInputBaseComponent
 *
 * @description
 * O `po-login` é um input específico para login. Já possui tipo, estilo e ícone predefinidos.
 *
 * @example
 *
 * <example name="po-login-basic" title="PO Login Basic">
 *  <file name="sample-po-login-basic/sample-po-login-basic.component.html"> </file>
 *  <file name="sample-po-login-basic/sample-po-login-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-login-labs" title="PO Login Labs">
 *  <file name="sample-po-login-labs/sample-po-login-labs.component.html"> </file>
 *  <file name="sample-po-login-labs/sample-po-login-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-login-confirm" title="PO Login - Confirm Identity">
 *  <file name="sample-po-login-confirm/sample-po-login-confirm.component.html"> </file>
 *  <file name="sample-po-login-confirm/sample-po-login-confirm.component.ts"> </file>
 * </example>
 *
 */
@Component({
  selector: 'po-login',
  templateUrl: './po-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers,
  standalone: false
})
export class PoLoginComponent extends PoInputGeneric {
  id = `po-login[${uuid()}]`;
  type = 'text';
  private _noAutocompleteLogin?: boolean = true;

  @Input('p-no-autocomplete') override set noAutocomplete(value: boolean) {
    this._noAutocompleteLogin = convertToBoolean(value);
  }

  override get noAutocomplete() {
    return this._noAutocompleteLogin;
  }

  override get autocomplete(): string {
    return this.noAutocomplete ? 'off' : 'on';
  }

  /* istanbul ignore next */
  constructor(el: ElementRef, cd: ChangeDetectorRef) {
    super(el, cd);
  }

  extraValidation(c: AbstractControl): { [key: string]: any } {
    return null;
  }
}
