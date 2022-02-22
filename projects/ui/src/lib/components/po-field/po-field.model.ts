import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

import { InputBoolean } from '../../decorators';

@Directive()
export abstract class PoFieldModel<T> implements ControlValueAccessor {
  /** Rótulo exibido pelo componente. */
  @Input('p-label') label: string;

  /** Nome do componente. */
  @Input('name') name: string;

  /** Texto de apoio para o campo. */
  @Input('p-help') help: string;

  /**
   * @deprecated 14.x.x
   *
   * @optional
   *
   * @description
   *
   * **Deprecated 14.x.x**.
   *
   * Aplica o foco no elemento ao ser iniciado.
   *  > Caso mais de um elemento seja configurado com essa propriedade,
   * o último elemento declarado com ela terá o foco.
   *
   * @default `false`
   */
  @Input('p-auto-focus') @InputBoolean() autoFocus: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Indica se o campo será desabilitado.
   *
   * @default `false`
   */
  @Input('p-disabled') @InputBoolean() disabled: boolean = false;

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
