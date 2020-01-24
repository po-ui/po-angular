import { Input, ViewChild, ElementRef } from '@angular/core';

import { PoSwitchLabelPosition } from './po-switch-label-position.enum';
import { PoField } from '../po-field';

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
export class PoSwitchBaseComponent extends PoField<boolean> {

  @ViewChild('switchContainer', { read: ElementRef, static: true }) switchContainer: ElementRef;

  switchValue: boolean = false;

  /*
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
    this.labelPosition = (position in PoSwitchLabelPosition) ? parseInt(<any>position, 10) : PoSwitchLabelPosition.Right;
  }

  changeValue(value: any) {
    if (this.switchValue !== value) {
      this.switchValue = value;

      this.updateModel(value);

      this.change.emit(this.switchValue);
    }
  }

  /**
   * Focar o componente
   */
  focus() {
    if (!this.disabled) {
      this.switchContainer.nativeElement.focus();
    }
  }

  eventClick() {
    if (!this.disabled) {
      this.changeValue(!this.switchValue);
    }
  }

  onWriteValue(value: boolean) {
    if (value !== this.switchValue) {
      this.switchValue = !!value;
    }
  }

}
