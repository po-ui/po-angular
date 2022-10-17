import { AbstractControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, Input } from '@angular/core';

import { convertToBoolean, uuid } from '../../../utils/util';
import { PoInputGeneric } from '../po-input-generic/po-input-generic';

/**
 * @docsExtends PoInputBaseComponent
 *
 * @description
 * O po-password é um input específico para senhas. Já possui tipo, estilo e ícone predefinidos.
 *
 * @example
 *
 * <example name="po-password-basic" title="PO Password Basic">
 *   <file name="sample-po-password-basic/sample-po-password-basic.component.html"> </file>
 *   <file name="sample-po-password-basic/sample-po-password-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-password-labs" title="PO Password Labs">
 *   <file name="sample-po-password-labs/sample-po-password-labs.component.html"> </file>
 *   <file name="sample-po-password-labs/sample-po-password-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-password-reset" title="PO Password - Reset">
 *   <file name="sample-po-password-reset/sample-po-password-reset.component.html"> </file>
 *   <file name="sample-po-password-reset/sample-po-password-reset.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-password',
  templateUrl: './po-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoPasswordComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PoPasswordComponent),
      multi: true
    }
  ]
})
export class PoPasswordComponent extends PoInputGeneric {
  id = `po-password[${uuid()}]`;
  type = 'password';
  visiblePassword = false;

  private _hidePasswordPeek?: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Permite esconder a função de espiar a senha digitada.
   *
   * @default `false`
   */
  @Input('p-hide-password-peek') set hidePasswordPeek(value: boolean) {
    this._hidePasswordPeek = convertToBoolean(value);
    if (value) {
      this.visiblePassword = false;
      this.type = 'password';
    }
  }

  get hidePasswordPeek(): boolean {
    return this._hidePasswordPeek;
  }

  get autocomplete(): string {
    return this.noAutocomplete ? 'new-password' : 'on';
  }

  /* istanbul ignore next */
  constructor(el: ElementRef, cd: ChangeDetectorRef) {
    super(el, cd);
  }

  extraValidation(c: AbstractControl): { [key: string]: any } {
    return null;
  }

  showPassword() {
    this.visiblePassword = !this.visiblePassword;
    this.type = this.type === 'password' ? 'text' : 'password';
  }
}
