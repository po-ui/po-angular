import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  ViewChild
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { PoFieldModel } from '../po-field.model';
import { PoKeyCodeEnum } from './../../../enums/po-key-code.enum';

import { PoSwitchLabelPosition } from './po-switch-label-position.enum';

/**
 * @docsExtends PoFieldModel
 *
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
 *
 * @example
 *
 * <example name="po-switch-basic" title="PO Switch Basic">
 *   <file name="sample-po-switch-basic/sample-po-switch-basic.component.html"> </file>
 *   <file name="sample-po-switch-basic/sample-po-switch-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-switch-labs" title="PO Switch Labs">
 *   <file name="sample-po-switch-labs/sample-po-switch-labs.component.html"> </file>
 *   <file name="sample-po-switch-labs/sample-po-switch-labs.component.ts"> </file>
 *   <file name="sample-po-switch-labs/sample-po-switch-labs.component.e2e-spec.ts"> </file>
 *   <file name="sample-po-switch-labs/sample-po-switch-labs.component.po.ts"> </file>
 * </example>
 *
 * <example name="po-switch-order" title="PO Switch - Order Summary">
 *   <file name="sample-po-switch-order/sample-po-switch-order.component.html"> </file>
 *   <file name="sample-po-switch-order/sample-po-switch-order.component.ts"> </file>
 * </example>
 *
 * <example name="po-switch-order-reactive-form" title="PO Switch - Order Summary Reactive Form">
 *   <file name="sample-po-switch-order-reactive-form/sample-po-switch-order-reactive-form.component.html"> </file>
 *   <file name="sample-po-switch-order-reactive-form/sample-po-switch-order-reactive-form.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-switch',
  templateUrl: './po-switch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoSwitchComponent),
      multi: true
    }
  ]
})
export class PoSwitchComponent extends PoFieldModel<boolean> implements AfterViewInit {
  @ViewChild('switchContainer', { static: true }) switchContainer: ElementRef;

  value = false;

  private _labelOff: string = 'false';
  private _labelOn: string = 'true';
  private _labelPosition: PoSwitchLabelPosition = PoSwitchLabelPosition.Right;

  /**
   * @optional
   *
   * @description
   *
   * Posição de exibição do rótulo.
   *
   * > Por padrão exibe à direita.
   */
  @Input('p-label-position') set labelPosition(position: PoSwitchLabelPosition) {
    this._labelPosition = position in PoSwitchLabelPosition ? parseInt(<any>position, 10) : PoSwitchLabelPosition.Right;
  }

  get labelPosition() {
    return this._labelPosition;
  }

  /**
   * Texto exibido quando o valor do componente for `false`.
   *
   * @default `false`
   */
  @Input('p-label-off') set labelOff(label: string) {
    this._labelOff = label || 'false';
  }

  get labelOff() {
    return this._labelOff;
  }

  /**
   * Texto exibido quando o valor do componente for `true`.
   *
   * @default `true`
   */
  @Input('p-label-on') set labelOn(label: string) {
    this._labelOn = label || 'true';
  }

  get labelOn() {
    return this._labelOn;
  }

  constructor(private changeDetector: ChangeDetectorRef) {
    super();
  }

  ngAfterViewInit() {
    if (this.autoFocus) {
      this.focus();
    }
  }

  /**
   * Função que atribui foco ao componente.
   *
   * Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:
   *
   * ```
   * import { PoSwitchComponent } from '@po-ui/ng-components';
   *
   * ...
   *
   * @ViewChild(PoSwitchComponent, { static: true }) switch: PoSwitchComponent;
   *
   * focusSwitch() {
   *   this.switch.focus();
   * }
   * ```
   */
  focus() {
    if (!this.disabled) {
      this.switchContainer.nativeElement.focus();
    }
  }

  onBlur() {
    this.onTouched?.();
  }

  getLabelPosition() {
    switch (this.labelPosition) {
      case PoSwitchLabelPosition.Left:
        return 'left';
      case PoSwitchLabelPosition.Right:
        return 'right';
      default:
        return 'right';
    }
  }

  getSwitchPosition() {
    switch (this.labelPosition) {
      case PoSwitchLabelPosition.Left:
        return 'right';
      case PoSwitchLabelPosition.Right:
        return 'left';
      default:
        return 'left';
    }
  }

  onKeyDown(event) {
    if (event.which === PoKeyCodeEnum.space || event.keyCode === PoKeyCodeEnum.space) {
      event.preventDefault();
      this.eventClick();
    }
  }

  changeValue(value: any) {
    if (this.value !== value) {
      this.value = value;
      this.updateModel(value);
      this.emitChange(this.value);
    }
  }

  eventClick() {
    if (!this.disabled) {
      this.changeValue(!this.value);
    }
  }

  onWriteValue(value: any): void {
    if (value !== this.value) {
      this.value = !!value;

      this.changeDetector.markForCheck();
    }
  }
}
