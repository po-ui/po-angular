import { ControlValueAccessor } from '@angular/forms';
import { ChangeDetectorRef, EventEmitter, Input, Output, Directive } from '@angular/core';

import { convertToBoolean } from '../../../utils/util';
import { InputBoolean } from '../../../decorators';

import { PoSwitchLabelPosition } from './po-switch-label-position.enum';

/**
 * @description
 *
 * O componente `po-switch` é um [checkbox](/documentation/po-checkbox-group) mais intuitivo, pois faz analogia a um interruptor.
 * Deve ser usado quando deseja-se transmitir a ideia de ligar / desligar uma funcionalidade específica.
 *
 * Pode-se ligar ou deligar o botão utilizando a tecla de espaço ou o clique do mouse.
 *
 * O texto exibido pode ser alterado de acordo com o valor setado aumentando as possibilidades de uso do componente,
 * portanto, recomenda-se informar textos que contextualizem seu uso para que facilite a compreensão do usuário.
 *
 * > O componente não altera o valor incial informado no *model*, portanto indica-se inicializa-lo caso ter necessidade.
 */
@Directive()
export class PoSwitchBaseComponent implements ControlValueAccessor {
  private _disabled?: boolean = false;

  propagateChange: any;
  onTouched;
  switchValue: boolean = false;

  /** Nome do componente. */
  @Input('name') name: string;

  /**
   * @optional
   *
   * @description
   *
   * Aplica o foco no elemento ao ser iniciado.
   *  > Caso mais de um elemento seja configurado com essa propriedade,
   * o último elemento declarado com ela terá o foco.
   *
   * @default `false`
   */
  @Input('p-auto-focus') @InputBoolean() autoFocus: boolean = false;

  /** Rótulo exibido pelo componente. */
  @Input('p-label') label?: string;

  /** Texto de apoio para o campo. */
  @Input('p-help') help?: string;

  /**
   * Texto exibido quando o valor do componente for `true`.
   *
   * @default `true`
   */
  labelOn?: string = 'true';
  @Input('p-label-on') set setLabelOn(label: string) {
    this.labelOn = label || 'true';
  }

  /**
   * Texto exibido quando o valor do componente for `false`.
   *
   * @default `false`
   */
  labelOff?: string = 'false';
  @Input('p-label-off') set setLabelOff(label: string) {
    this.labelOff = label || 'false';
  }

  /**
   * @optional
   *
   * @description
   *
   * Posição de exibição do rótulo.
   *
   * > Por padrão exibe à direita.
   */
  labelPosition?: PoSwitchLabelPosition = PoSwitchLabelPosition.Right;
  @Input('p-label-position') set setLabelPosition(position: PoSwitchLabelPosition) {
    this.labelPosition = position in PoSwitchLabelPosition ? parseInt(<any>position, 10) : PoSwitchLabelPosition.Right;
  }

  /**
   * @optional
   *
   * @description
   *
   * Indica se o campo será desabilitado.
   *
   * @default `false`
   */
  @Input('p-disabled') set disabled(disabled: boolean) {
    this._disabled = convertToBoolean(disabled);
  }

  get disabled() {
    return this._disabled;
  }

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao alterar valor do campo.
   */
  @Output('p-change') change: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Função para atualizar o ngModel do componente, necessário quando não for utilizado dentro da tag form.
   */
  @Output('ngModelChange') ngModelChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private changeDetector: ChangeDetectorRef) {}

  changeValue(value: any) {
    if (this.switchValue !== value) {
      this.switchValue = value;

      if (this.propagateChange) {
        this.propagateChange(value);
      } else {
        this.ngModelChange.emit(value);
      }
      this.change.emit(this.switchValue);
    }
  }

  eventClick() {
    if (!this.disabled) {
      this.changeValue(!this.switchValue);
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

  writeValue(value: any): void {
    if (value !== this.switchValue) {
      this.switchValue = !!value;

      this.changeDetector.markForCheck();
    }
  }
}
