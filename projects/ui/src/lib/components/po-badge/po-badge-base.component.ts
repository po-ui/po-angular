import { Input, Directive, TemplateRef, HostBinding } from '@angular/core';

import { convertToBoolean, convertToInt } from '../../utils/util';
import { PoColorPaletteEnum } from '../../enums/po-color-palette.enum';

const poBadgeColors = (<any>Object).values(PoColorPaletteEnum);
const PO_BADGE_COLOR_DEFAULT = 'color-07';
export type PoBadgeStatus = 'disabled' | 'negative' | 'positive' | 'warning';
export type PoBadgeSize = 'small' | 'medium' | 'large';
export type PoBadgeIcon = string | boolean | TemplateRef<void>;

/**
 * @description
 *
 * Utilizado para exibir a quantidade de notificações.
 */
@Directive()
export class PoBadgeBaseComponent {
  badgeValue: string;
  customColor: string;

  private _color: string = PO_BADGE_COLOR_DEFAULT;
  private _value: number;
  private _status?: PoBadgeStatus;
  private _ariaLabel: string;

  /**
   * @description
   *
   * Define um `aria-label` para o `po-badge`
   */
  @Input('p-aria-label') set ariaLabel(value: string) {
    if (value === undefined) {
      this._ariaLabel = '';
    }
    this._ariaLabel = value;
  }

  get ariaLabel(): string {
    return this._ariaLabel;
  }

  /**
   * @optional
   *
   * @description
   *
   * Determina a cor do `po-badge`. As maneiras de customizar as cores são:
   * - Hexadeximal, por exemplo `#c64840`;
   * - RGB, como `rgb(0, 0, 165)`;
   * - O nome da cor, por exemplo `blue`;
   * - Usando uma das cores do tema do PO:
   * Valores válidos:
   *  - <span class="dot po-color-01"></span> `color-01`
   *  - <span class="dot po-color-02"></span> `color-02`
   *  - <span class="dot po-color-03"></span> `color-03`
   *  - <span class="dot po-color-04"></span> `color-04`
   *  - <span class="dot po-color-05"></span> `color-05`
   *  - <span class="dot po-color-06"></span> `color-06`
   *  - <span class="dot po-color-07"></span> `color-07`
   *  - <span class="dot po-color-08"></span> `color-08`
   *  - <span class="dot po-color-09"></span> `color-09`
   *  - <span class="dot po-color-10"></span> `color-10`
   *  - <span class="dot po-color-11"></span> `color-11`
   *  - <span class="dot po-color-12"></span> `color-12`
   *
   * @default `color-07`
   */
  @Input('p-color') set color(value: string) {
    if (value !== undefined && value.includes('color')) {
      this._color = poBadgeColors.includes(value) ? value : PO_BADGE_COLOR_DEFAULT;
    } else {
      CSS.supports('background-color', value) ? (this.customColor = value) : (this.customColor = undefined);
    }
  }

  get color(): string {
    return this._color;
  }

  /**
   * @optional
   *
   * @description
   * Ícone exibido no `po-badge`.
   *
   * Para exibir icone do status atual declare a propriedade `p-icon`. conforme exemplo abaixo:
   * ```
   * <po-badge [p-icon]="true"></po-badge>
   * ```
   * É possível usar qualquer um dos ícones da [Biblioteca de ícones](/guides/icons). conforme exemplo abaixo:
   * ```
   * <po-badge p-icon="po-icon-user"></po-badge>
   * ```
   * Também é possível utilizar outras fontes de ícones, por exemplo a biblioteca *Font Awesome*, da seguinte forma:
   * ```
   * <po-badge p-icon="fa fa-podcast"></po-badge>
   * ```
   * Outra opção seria a customização do ícone através do `TemplateRef`, conforme exemplo abaixo:
   * ```
   * <po-badge [p-icon]="template"></po-badge>
   *
   * <ng-template #template>
   *  <ion-icon style="font-size: inherit" name="heart"></ion-icon>
   * </ng-template>
   * ```
   */
  @Input('p-icon') icon: PoBadgeIcon;

  /**
   * @description
   *
   * Define o estado do `po-badge`
   *
   * Valores válidos:
   * - `positive`: Define a cor do `po-badge` com a cor de feedback positivo.;
   * - `negative`: Define a cor do `po-badge` com a cor de feedback negative.;
   * - `warning`: Define a cor do `po-badge` com a cor de feedback warning.;
   * - `disabled`: Define a cor do `po-badge` com a cor de feedback disabled;
   *
   */
  @HostBinding('attr.p-status')
  @Input('p-status')
  set status(value: PoBadgeStatus) {
    this._status = ['positive', 'negative', 'warning', 'disabled'].includes(value) ? value : undefined;
  }

  get status(): PoBadgeStatus {
    return this._status;
  }

  /**
   * @description
   *
   * Define o tamanho do `po-badge`
   *
   * Valores válidos:
   * - `small`: o `po-badge` fica do tamanho padrão, com 8px de altura.;
   * - `medium`: o `po-badge` fica do tamanho padrão, com 16px de altura.;
   * - `large`: o `po-badge` fica do tamanho padrão, com 24px de altura.;
   *
   * @default `medium`
   */
  @Input('p-size') size: PoBadgeSize = 'medium';

  /**
   * @description
   *
   * Exibe uma borda para o `po-badge`
   *
   * > Pode personalizar cor da bordar com a propriedade `p-color-border`
   */
  @Input({ alias: 'p-show-border', transform: convertToBoolean }) showBorder: boolean = false;

  /**
   * @description
   *
   * Número exibido no componente, caso o mesmo seja maior que 9 o valor exibido será 9+.
   */
  @Input('p-value') set value(value: number) {
    this._value = value <= 0 ? 0 : convertToInt(value);
  }

  get value(): number {
    return this._value;
  }
}
