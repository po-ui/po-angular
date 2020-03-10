import { Input, Directive } from '@angular/core';

import { convertToInt } from '../../utils/util';

const PO_BADGE_COLORS = [
  'color-01',
  'color-02',
  'color-03',
  'color-04',
  'color-05',
  'color-06',
  'color-07',
  'color-08',
  'color-09',
  'color-10',
  'color-11',
  'color-12'
];
const PO_BADGE_COLOR_DEFAULT = 'color-07';

/**
 * @description
 *
 * @docsPrivate
 *
 * Componente utilizado no `po-menu` para exibir por exemplo a quantidade de tarefas pendentes.
 */
@Directive()
export class PoBadgeBaseComponent {
  private _color: string;
  private _value: number;

  badgeValue: string;

  /**
   * @optional
   *
   * @description
   *
   * Define a cor de fundo do componente e aceita os valores:
   *
   * <span class="dot po-color-01"></span> `color-01`
   *
   * <span class="dot po-color-02"></span> `color-02`
   *
   * <span class="dot po-color-03"></span> `color-03`
   *
   * <span class="dot po-color-04"></span> `color-04`
   *
   * <span class="dot po-color-05"></span> `color-05`
   *
   * <span class="dot po-color-06"></span> `color-06`
   *
   * <span class="dot po-color-07"></span> `color-07`
   *
   * <span class="dot po-color-08"></span> `color-08`
   *
   * <span class="dot po-color-09"></span> `color-09`
   *
   * <span class="dot po-color-10"></span> `color-10`
   *
   * <span class="dot po-color-11"></span> `color-11`
   *
   * <span class="dot po-color-12"></span> `color-12`
   *
   * @default `color-07`
   */
  @Input('p-color') set color(value: string) {
    this._color = PO_BADGE_COLORS.includes(value) ? value : PO_BADGE_COLOR_DEFAULT;
  }

  get color(): string {
    return this._color;
  }

  /**
   * @description
   *
   * Número exibido no componente, caso o mesmo seja maior que 99 o valor exibido será 99+.
   */
  @Input('p-value') set value(value: number) {
    this._value = convertToInt(value);
    this.setBadgeValue(this._value);
  }

  get value(): number {
    return this._value;
  }

  private setBadgeValue(value: number) {
    const validRangeValue = (value || value === 0) && value >= 0 && value < 100;
    this.badgeValue = validRangeValue ? value.toString() : value > 99 ? '99+' : undefined;
  }
}
