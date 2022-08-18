import { Directive, EventEmitter, Input, Output } from '@angular/core';

import { ControlValueAccessor } from '@angular/forms';
import { InputBoolean } from '../../../decorators';
import { uuid } from './../../../utils/util';
import { PoRadioSize } from './po-radio-size.enum';

/**
 * @docsPrivate
 *
 * @description
 *
 * O componente `po-radio` é um componente interno e deve ser utilizado em conjunto com o componente `po-radio-group`.
 */

@Directive()
export abstract class PoRadioBaseComponent implements ControlValueAccessor {
  /** Define o nome do *radio*. */
  @Input('name') name: string;

  /** Texto de exibição do *radio* */
  @Input('p-label') label?: string;

  /** Define o status do *radio* */
  @Input('p-checked') radioValue: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define o estado do *radio* como desabilitado;
   *
   * @default `false`
   */
  @Input('p-disabled') @InputBoolean() disabled: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado quando o valor do *radio* for alterado.
   */
  @Output('p-change') change: EventEmitter<any> = new EventEmitter<any>();

  id = uuid();
  propagateChange: any;
  onTouched;

  private _size: PoRadioSize = PoRadioSize.medium;

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho do *radio*
   * @default `medium`
   */
  @Input('p-size') set size(value: string) {
    this._size = PoRadioSize[value] ? PoRadioSize[value] : PoRadioSize.medium;
  }

  get size() {
    return this._size;
  }

  changeValue() {
    if (this.propagateChange) {
      this.propagateChange(this.radioValue);
    }

    this.change.emit(this.radioValue);
  }

  checkOption(value: boolean) {
    if (this.disabled) {
      return;
    }
    this.changeModelValue(true);
    this.changeValue();
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: any) {
    if (value !== this.radioValue) {
      this.changeModelValue(value);
    }
  }

  protected abstract changeModelValue(value: boolean | string);
}
