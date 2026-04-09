import { Input, Directive, TemplateRef, HostBinding } from '@angular/core';

import { convertToBoolean, convertToInt } from '../../utils/util';
import { PoColorPaletteEnum } from '../../enums/po-color-palette.enum';
import { PoCaptionTagColorEnum } from '../../enums/po-caption-tag-color.enum';

const poBadgeColors = [...(<any>Object).values(PoColorPaletteEnum), ...(<any>Object).values(PoCaptionTagColorEnum)];
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
   *   - <span class="dot po-color-01"></span> `color-01`
   *   - <span class="dot po-color-02"></span> `color-02`
   *   - <span class="dot po-color-03"></span> `color-03`
   *   - <span class="dot po-color-04"></span> `color-04`
   *   - <span class="dot po-color-05"></span> `color-05`
   *   - <span class="dot po-color-06"></span> `color-06`
   *   - <span class="dot po-color-07"></span> `color-07`
   *   - <span class="dot po-color-08"></span> `color-08`
   *   - <span class="dot po-color-09"></span> `color-09`
   *   - <span class="dot po-color-10"></span> `color-10`
   *   - <span class="dot po-color-11"></span> `color-11`
   *   - <span class="dot po-color-12"></span> `color-12`
   *
   * > Também é possível utilizar as 35 cores da paleta **Caption Tag Colors**:
   *
   *   - <span class="dot po-caption-tag-01"></span> `caption-tag-01` <span class="dot po-caption-tag-02"></span> `caption-tag-02` <span class="dot po-caption-tag-03"></span> `caption-tag-03` <span class="dot po-caption-tag-04"></span> `caption-tag-04` <span class="dot po-caption-tag-05"></span> `caption-tag-05`
   *   - <span class="dot po-caption-tag-06"></span> `caption-tag-06` <span class="dot po-caption-tag-07"></span> `caption-tag-07` <span class="dot po-caption-tag-08"></span> `caption-tag-08` <span class="dot po-caption-tag-09"></span> `caption-tag-09` <span class="dot po-caption-tag-10"></span> `caption-tag-10`
   *   - <span class="dot po-caption-tag-11"></span> `caption-tag-11` <span class="dot po-caption-tag-12"></span> `caption-tag-12` <span class="dot po-caption-tag-13"></span> `caption-tag-13` <span class="dot po-caption-tag-14"></span> `caption-tag-14` <span class="dot po-caption-tag-15"></span> `caption-tag-15`
   *   - <span class="dot po-caption-tag-16"></span> `caption-tag-16` <span class="dot po-caption-tag-17"></span> `caption-tag-17` <span class="dot po-caption-tag-18"></span> `caption-tag-18` <span class="dot po-caption-tag-19"></span> `caption-tag-19` <span class="dot po-caption-tag-20"></span> `caption-tag-20`
   *   - <span class="dot po-caption-tag-21"></span> `caption-tag-21` <span class="dot po-caption-tag-22"></span> `caption-tag-22` <span class="dot po-caption-tag-23"></span> `caption-tag-23` <span class="dot po-caption-tag-24"></span> `caption-tag-24` <span class="dot po-caption-tag-25"></span> `caption-tag-25`
   *   - <span class="dot po-caption-tag-26"></span> `caption-tag-26` <span class="dot po-caption-tag-27"></span> `caption-tag-27` <span class="dot po-caption-tag-28"></span> `caption-tag-28` <span class="dot po-caption-tag-29"></span> `caption-tag-29` <span class="dot po-caption-tag-30"></span> `caption-tag-30`
   *   - <span class="dot po-caption-tag-31"></span> `caption-tag-31` <span class="dot po-caption-tag-32"></span> `caption-tag-32` <span class="dot po-caption-tag-33"></span> `caption-tag-33` <span class="dot po-caption-tag-34"></span> `caption-tag-34` <span class="dot po-caption-tag-35"></span> `caption-tag-35`
   *
   * Exemplo de uso:
   * ```
   * <po-badge p-color="caption-tag-13" p-value="5"></po-badge>
   * ```
   *
   * @default `color-07`
   */
  @Input('p-color') set color(value: string) {
    if (value !== undefined && (value.includes('color') || value.startsWith('caption-tag-'))) {
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
   * É possível usar qualquer um dos ícones da [Biblioteca de ícones](https://po-ui.io/icons). conforme exemplo abaixo:
   * ```
   * <po-badge p-icon="an an-user"></po-badge>
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
