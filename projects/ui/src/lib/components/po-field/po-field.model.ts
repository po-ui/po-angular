import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

import { convertToBoolean } from '../../utils/util';

@Directive()
export abstract class PoFieldModel<T> implements ControlValueAccessor {
  /** Rótulo exibido pelo componente. */
  @Input('p-label') label: string;

  /** Nome do componente. */
  @Input('name') name: string;

  /** Texto de apoio para o campo. */
  @Input('p-help') help: string;

  /**
   * @optional
   *
   * @description
   *
   * Indica se o campo será desabilitado.
   *
   * @default `false`
   */
  @Input({ alias: 'p-disabled', transform: convertToBoolean }) disabled: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao alterar valor do campo.
   */
  @Output('p-change') change: EventEmitter<T> = new EventEmitter<T>();

  value: T;

  protected onTouched;

  private propagateChange: any;

  constructor() {}

  // Função implementada do ControlValueAccessor
  // Usada para interceptar os estados de habilitado via forms api
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: T): void {
    this.onWriteValue(value);
  }

  emitChange(value) {
    this.change.emit(value);
  }

  protected updateModel(value: T) {
    if (this.propagateChange) {
      this.propagateChange(value);
    }
  }

  abstract onWriteValue(value: T): void;
}
