import { AbstractControl, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  Input,
  HostListener
} from '@angular/core';

import { minFailed, maxFailed } from '../validators';

import { PoNumberBaseComponent } from './po-number-base.component';

import { uuid } from '../../../utils/util';

/**
 * @docsExtends PoInputBaseComponent
 *
 * @description
 *
 * O `po-number` é um input específico para receber apenas números.
 * É possível configurar um valor mínimo, máximo e um step com p-min, p-max e p-step,
 * respectivamente.
 *
 * @example
 *
 * <example name="po-number-basic" title="PO Number Basic">
 *  <file name="sample-po-number-basic/sample-po-number-basic.component.html"> </file>
 *  <file name="sample-po-number-basic/sample-po-number-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-number-labs" title="PO Number Labs">
 *  <file name="sample-po-number-labs/sample-po-number-labs.component.html"> </file>
 *  <file name="sample-po-number-labs/sample-po-number-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-number-calculate" title="PO Number - Calculate">
 *  <file name="sample-po-number-calculate/sample-po-number-calculate.component.html"> </file>
 *  <file name="sample-po-number-calculate/sample-po-number-calculate.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-number',
  templateUrl: './po-number.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoNumberComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PoNumberComponent),
      multi: true
    }
  ]
})
export class PoNumberComponent extends PoNumberBaseComponent {
  /**
   * @optional
   *
   * @description
   *
   * Intervalo.
   *
   * @default 1
   */
  @Input('p-step') step?: string = '1';

  /** Valor mínimo.
   *
   * > Quando o valor mínimo for um número com decimais aconselha-se utilizar junto da propriedade `p-step` também passando a ela um valor decimal.
   */
  min?: number;
  @Input('p-min') set setMin(min: number) {
    this.min = !isNaN(min) ? min : undefined;
    this.validateModel();
  }

  /** Valor máximo.
   *
   * > Quando o valor máximo for um número com decimais aconselha-se utilizar junto da propriedade `p-step` também passando a ela um valor decimal.
   */
  max?: number;
  @Input('p-max') set setMax(max: number) {
    this.max = !isNaN(max) ? max : undefined;
    this.validateModel();
  }

  id = `po-number[${uuid()}]`;

  /* istanbul ignore next */
  constructor(el: ElementRef, cd: ChangeDetectorRef) {
    super(el, cd);
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: Event) {
    event.preventDefault();
  }

  extraValidation(abstractControl: AbstractControl): { [key: string]: any } {
    // Verifica se já possui algum error pattern padrão.
    this.errorPattern = this.errorPattern !== 'Valor Inválido' ? this.errorPattern : '';

    if (minFailed(this.min, abstractControl.value)) {
      return {
        min: {
          valid: false
        }
      };
    }

    if (maxFailed(this.max, abstractControl.value)) {
      return {
        max: {
          valid: false
        }
      };
    }

    if (this.invalidInputValueOnBlur) {
      this.errorPattern = this.errorPattern || 'Valor Inválido';

      return {
        number: {
          valid: false
        }
      };
    }

    return null;
  }

  getErrorPatternMessage() {
    return this.errorPattern !== '' && this.containsInvalidClass() ? this.errorPattern : '';
  }

  private containsInvalidClass(): boolean {
    return (
      (this.el.nativeElement.classList.contains('ng-invalid') &&
        this.el.nativeElement.classList.contains('ng-dirty') &&
        this.inputEl.nativeElement.value !== '') ||
      this.invalidInputValueOnBlur
    );
  }
}
