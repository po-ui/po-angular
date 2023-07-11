import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  ViewChild
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputBoolean } from '../../../decorators';

import { uuid } from '../../../utils/util';

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
 * Pode-se ligar ou desligar o switch utilizando a tecla de espaço ou o clique do mouse.
 *
 * O texto exibido pode ser alterado de acordo com o valor setado aumentando as possibilidades de uso do componente,
 * portanto, recomenda-se informar textos que contextualizem seu uso para que facilite a compreensão do usuário.
 *
 * > O componente não altera o valor incial informado no *model*, portanto indica-se inicializa-lo caso ter necessidade.
 *
 * #### Boas práticas
 *
 * - Evite `labels` extensos que quebram o layout do `po-switch`, use `labels` diretos, curtos e intuitivos.
 *
 * #### Acessibilidade tratada no componente
 *
 * Algumas diretrizes de acessibilidade já são tratadas no componente, internamente, e não podem ser alteradas pelo proprietário do conteúdo. São elas:
 *
 * - Quando em foco, o switch é ativado usando a tecla de Espaço. [W3C WAI-ARIA 3.5 Switch - Keyboard Interaction](https://www.w3.org/WAI/ARIA/apg/patterns/switch/#keyboard-interaction-19)
 * - A área do foco precisar ter uma espessura de pelo menos 2 pixels CSS e o foco não pode ficar escondido por outros elementos da tela. [WCAG 2.4.12: Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance-enhanced)
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
export class PoSwitchComponent extends PoFieldModel<any> {
  @ViewChild('switchContainer', { static: true }) switchContainer: ElementRef;

  id = `po-switch[${uuid()}]`;

  // Parâmetro interno, não documentar
  @Input('p-value')
  @InputBoolean()
  value = false;

  private _labelOff: string = 'false';
  private _labelOn: string = 'true';
  private _labelPosition: PoSwitchLabelPosition = PoSwitchLabelPosition.Right;
  private _formatModel: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Indica se o `model` receberá o valor formatado pelas propriedades `p-label-on` e `p-label-off` ou
   * apenas o valor puro (sem formatação).
   *
   * > Por padrão será atribuído `false`.
   * @default `false`
   */
  @Input('p-format-model')
  @InputBoolean()
  set formatModel(format: boolean) {
    this._formatModel = format || false;
  }

  get formatModel() {
    return this._formatModel;
  }

  /**
   * @optional
   *
   * @description
   *
   * Posição de exibição do rótulo que fica ao lado do switch.
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

  onKeyDown(event) {
    if (event.which === PoKeyCodeEnum.space || event.keyCode === PoKeyCodeEnum.space) {
      event.preventDefault();
      this.eventClick();
    }
  }

  changeValue(value: any) {
    if (this.value !== value) {
      this.value = value;
      if (this.formatModel) {
        if (this.value) {
          this.updateModel(this.labelOn);
        } else {
          this.updateModel(this.labelOff);
        }
      } else {
        this.updateModel(value);
      }
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
      if (this.formatModel && !!value) {
        this.value = value.toLowerCase() === this.labelOn.toLowerCase();
      } else {
        this.value = !!value;
      }
      this.changeDetector.markForCheck();
    }
  }
}
