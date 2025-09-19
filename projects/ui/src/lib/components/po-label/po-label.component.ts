import { Component, input, Input } from '@angular/core';
import { convertToBoolean } from '../../utils/util';

/**
 * @docsPrivate
 *
 * Componente de uso interno.
 */

@Component({
  selector: 'po-label',
  templateUrl: './po-label.component.html',
  standalone: false
})
export class PoLabelComponent {
  private _disabled?: boolean = false;
  private _field?: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Indica se o label está desativado.
   *
   * @default `false`
   */
  @Input('p-disabled') set disabled(value: boolean) {
    this._disabled = <any>value === '' ? true : convertToBoolean(value);
  }
  get disabled(): boolean {
    return this._disabled;
  }

  /**
   * @optional
   *
   * @description
   *
   * Indica se o label será de um field.
   *
   * @default `false`
   */
  @Input('p-field') set field(value: boolean) {
    this._field = <any>value === '' ? true : convertToBoolean(value);
  }

  get field(): boolean {
    return this._field;
  }

  /** Indica o campo vinculado ao label */
  @Input('p-for') for: string;

  /** Label do campo. */
  @Input('p-label') label?: string;

  /** Indica o tipo do campo vinculado ao label */
  @Input('p-requirement') requirement?: string;

  /**
   * @optional
   *
   * @description
   *
   * Habilita a quebra automática do texto. Quando ativada, o texto que excede
   * o espaço disponível é transferido para a próxima linha em pontos apropriados para uma
   * leitura clara.
   *
   * @default `false`
   */
  textWrap = input<boolean>(false, { alias: 'p-text-wrap' });
}
