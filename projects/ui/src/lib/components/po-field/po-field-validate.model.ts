import { ChangeDetectorRef, Directive, Input } from '@angular/core';
import { AbstractControl, ValidationErrors, Validator, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { convertToBoolean } from '../..//utils/util';
import { PoFieldModel } from './po-field.model';
import { requiredFailed } from './validators';

/**
 * @docsExtends PoFieldModel
 */
@Directive()
export abstract class PoFieldValidateModel<T> extends PoFieldModel<T> implements Validator {
  /**
   * @optional
   *
   * @description
   *
   * Define se a indicação de campo opcional será exibida.
   *
   * > Não será exibida a indicação se:
   * - O campo conter `p-required`;
   * - Não possuir `p-help` e/ou `p-label`.
   *
   * @default `false`
   */
  @Input({ alias: 'p-optional', transform: convertToBoolean }) optional: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define que o campo será obrigatório.
   *
   * @default `false`
   */
  @Input({ alias: 'p-required', transform: convertToBoolean }) required: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Exibe a mensagem setada se o campo estiver vazio e for requerido.
   *
   * > Necessário que a propriedade `p-required` esteja habilitada.
   *
   */
  @Input('p-field-error-message') fieldErrorMessage: string;

  /**
   * @optional
   *
   * @description
   *
   * Limita a exibição da mensagem de erro a duas linhas e exibe um tooltip com o texto completo.
   *
   * > Caso essa propriedade seja definida como `true`, a mensagem de erro será limitada a duas linhas
   * e um tooltip será exibido ao passar o mouse sobre a mensagem para mostrar o conteúdo completo.
   *
   * @default `false`
   */
  @Input('p-error-limit') errorLimit: boolean = false;

  /**
   *  Define se a indicação de campo obrigatório será exibida.
   *
   * > Não será exibida a indicação se:
   * - Não possuir `p-help` e/ou `p-label`.
   */
  @Input('p-show-required') showRequired: boolean = false;

  protected hasValidatorRequired = false;
  private onValidatorChange;

  constructor(public changeDetector: ChangeDetectorRef) {
    super();
  }

  validate(abstractControl: AbstractControl): ValidationErrors {
    if (!this.hasValidatorRequired && this.fieldErrorMessage && abstractControl.hasValidator(Validators.required)) {
      this.hasValidatorRequired = true;
    }

    if (requiredFailed(this.required || this.hasValidatorRequired, this.disabled, abstractControl.value)) {
      this.changeDetector.markForCheck();
      return {
        required: {
          valid: false
        }
      };
    }

    return this.extraValidation(abstractControl);
  }

  registerOnValidatorChange(fn: any) {
    this.onValidatorChange = fn;
  }

  validateModel() {
    if (this.onValidatorChange) {
      this.onValidatorChange();
    }
  }

  abstract extraValidation(c: AbstractControl): { [key: string]: any };
}
