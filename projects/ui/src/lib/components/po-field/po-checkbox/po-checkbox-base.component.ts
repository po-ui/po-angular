import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

import { convertToBoolean, uuid } from './../../../utils/util';
import { PoCheckboxSize } from './po-checkbox-size.enum';

/**
 * @description
 *
 * O componente `po-checkbox` exibe uma caixa de opção com um texto ao lado, na qual é possível marcar e desmarcar através tanto
 * no *click* do *mouse* quanto por meio da tecla *space* quando estiver com foco.
 *
 * Cada opção poderá receber um estado de marcado, desmarcado, indeterminado/mixed e desabilitado, como também uma ação que será disparada quando
 * ocorrer mudanças do valor.
 *
 * > O *model* deste componente aceitará valores igual à `true`, `false` ou `null` para quando for indeterminado/mixed.
 *
 * **Acessibilidade tratada no componente:**
 *
 * Algumas diretrizes de acessibilidade já são tratadas no componente, internamente, e não podem ser alteradas pelo proprietário do conteúdo. São elas:
 *
 * - O componente foi desenvolvido utilizando controles padrões HTML para permitir a identificação do mesmo na interface por tecnologias assistivas. [WCAG 4.1.2: Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value)
 * - A área do foco precisar ter uma espessura de pelo menos 2 pixels CSS e o foco não pode ficar escondido por outros elementos da tela. [WCAG 2.4.12: Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance-enhanced)
 * - A cor não deve ser o único meio para diferenciar o componente do seu estado marcado e desmarcado. [WGAG 1.4.1: Use of Color, 3.2.4: Consistent Identification](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color)
 */
@Directive()
export abstract class PoCheckboxBaseComponent implements ControlValueAccessor {
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
  @Input({ alias: 'p-auto-focus', transform: convertToBoolean }) autoFocus: boolean = false;

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

  //propriedade interna recebida do checkbox-group para verificar se o checkbox está ativo, inativo ou indeterminate
  @Input('p-checkboxValue') checkboxValue: boolean | null | string;

  //propriedade interna recebida do checkbox-group para verificar se o checkbox é required
  @Input({ alias: 'p-required', transform: convertToBoolean }) checkBoxRequired: boolean;

  //propriedade interna recebida para desabilitar o tabindex do checkbox na utilização dentro de um list-box
  @Input({ alias: 'p-disabled-tabindex', transform: convertToBoolean }) disabladTabindex: boolean = false;

  id = uuid();
  propagateChange: any;
  onTouched;

  private _disabled?: boolean = false;

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

  private _size?: string = PoCheckboxSize.medium;

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho do *checkbox*
   *
   * Valores válidos:
   * - `medium`: o `po-checkbox` fica do tamanho padrão, com 24px de altura.;
   * - `large`: o `po-checkbox` fica maior, com 32px de altura.;
   *
   * @default `medium`
   *
   */
  @Input('p-size') set size(value: string) {
    this._size = PoCheckboxSize[value] ? PoCheckboxSize[value] : PoCheckboxSize.medium;
  }

  get size(): string {
    return this._size;
  }

  changeValue() {
    if (this.propagateChange) {
      this.propagateChange(this.checkboxValue);
    }

    this.change.emit(this.checkboxValue);
  }

  checkOption(value: boolean | null | string) {
    if (!this.disabled) {
      value === 'mixed' ? this.changeModelValue(true) : this.changeModelValue(!value);
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
