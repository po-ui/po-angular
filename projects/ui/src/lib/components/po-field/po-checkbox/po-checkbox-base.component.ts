import { ControlValueAccessor } from '@angular/forms';
import { EventEmitter, Input, Output, Directive } from '@angular/core';

import { convertToBoolean, uuid } from './../../../utils/util';
import { InputBoolean } from '../../../decorators';

/**
 * @description
 *
 * O componente `po-checkbox` exibe uma caixa de opção com um texto ao lado, na qual é possível marcar e desmarcar através tanto
 * no *click* do *mouse* quanto por meio da tecla *space* quando estiver com foco.
 *
 * Cada opção poderá receber um estado de marcado, desmarcado, indeterminado e desabilitado, como também uma ação que será disparada quando
 * ocorrer mudanças do valor.
 *
 * > O *model* deste componente aceitará valores igual à `true`, `false` ou `null` para quando for indeterminado.
 */
@Directive()
export abstract class PoCheckboxBaseComponent implements ControlValueAccessor {
  checkboxValue: boolean | null;
  id = uuid();
  propagateChange: any;
  onTouched;

  private _disabled?: boolean = false;

  /** Define o nome do *checkbox*. */
  @Input('name') name: string;

  /**
   * @optional
   *
   * @description
   *
   * Aplica foco no elemento ao ser iniciado.
   *
   * > Caso mais de um elemento seja configurado com essa propriedade, apenas o último elemento declarado com ela terá o foco.
   *
   * @default `false`
   */
  @Input('p-auto-focus') @InputBoolean() autoFocus: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define o estado do *checkbox* como desabilitado.
   *
   * @default `false`
   */
  @Input('p-disabled') set disabled(value: boolean) {
    this._disabled = convertToBoolean(value);
  }

  get disabled(): boolean {
    return this._disabled;
  }

  /** Texto de exibição do *checkbox*. */
  @Input('p-label') label?: string;

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado quando o valor do *checkbox* for alterado.
   */
  @Output('p-change') change: EventEmitter<any> = new EventEmitter<any>();

  changeValue() {
    if (this.propagateChange) {
      this.propagateChange(this.checkboxValue);
    }

    this.change.emit(this.checkboxValue);
  }

  checkOption(value: boolean | null) {
    if (!this.disabled) {
      this.changeModelValue(!value);
      this.changeValue();
    }
  }

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

  writeValue(value: any) {
    if (value !== this.checkboxValue) {
      this.changeModelValue(value);
    }
  }

  protected abstract changeModelValue(value: boolean | null);
}
