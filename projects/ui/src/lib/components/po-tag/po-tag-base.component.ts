import { EventEmitter, Input, Output, Directive, TemplateRef } from '@angular/core';

import { convertToBoolean } from '../../utils/util';
import { PoColorPaletteEnum } from '../../enums/po-color-palette.enum';

import { PoTagItem } from './interfaces/po-tag-item.interface';
import { PoTagOrientation } from './enums/po-tag-orientation.enum';
import { PoTagType } from './enums/po-tag-type.enum';

const poTagColors = (<any>Object).values(PoColorPaletteEnum);
const poTagOrientationDefault = PoTagOrientation.Vertical;

/**
 * @description
 *
 * Este componente permite exibir um valor em forma de um marcador colorido, sendo possível definir uma legenda e realizar customizações
 * na cor, iconografia e tipo.
 *
 * Além disso, é possível definir uma ação que será executada tanto ao *click* quanto através das teclas *enter/space* enquanto navega
 * utilizando a tecla *tab*.
 *
 * Seu uso é recomendado para informações que necessitem de destaque em forma de marcação.
 */
@Directive()
export class PoTagBaseComponent {
  private _color?: string;
  private _icon?: boolean | string | TemplateRef<void>;
  private _inverse?: boolean;
  private _orientation?: PoTagOrientation = poTagOrientationDefault;
  private _type?: PoTagType;

  public readonly poTagOrientation = PoTagOrientation;

  /**
   * @optional
   *
   * @description
   *
   * Define uma cor para a *tag*.
   *
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
   * > **Atenção:** A propriedade `p-type` sobrepõe esta definição.
   */
  @Input('p-color') set color(value: string) {
    this._color = poTagColors.includes(value) ? value : undefined;
  }

  get color(): string {
    return this._color;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define ou ativa um ícone que será exibido ao lado do valor da *tag*.
   *
   * Quando `p-type` estiver definida, basta informar um valor igual a `true` para que o ícone seja exibido conforme descrições abaixo:
   * - <span class="po-icon po-icon-ok"></span> - `success`
   * - <span class="po-icon po-icon-warning"></span> - `warning`
   * - <span class="po-icon po-icon-close"></span> - `danger`
   * - <span class="po-icon po-icon-info"></span> - `info`
   *
   * Também É possível usar qualquer um dos ícones da [Biblioteca de ícones](/guides/icons). conforme exemplo abaixo:
   * ```
   * <po-tag p-icon="po-icon-user" p-value="PO Tag"></po-tag>
   * ```
   * como também utilizar outras fontes de ícones, por exemplo a biblioteca *Font Awesome*, da seguinte forma:
   * ```
   * <po-tag p-icon="fa fa-podcast" p-value="PO Tag"></po-button>
   * ```
   * Outra opção seria a customização do ícone através do `TemplateRef`, conforme exemplo abaixo:
   * ```
   * <po-tag [p-icon]="template" p-value="Tag template ionic"></po-button>
   *
   * <ng-template #template>
   *  <ion-icon style="font-size: inherit" name="heart"></ion-icon>
   * </ng-template>
   * ```
   * > Para o ícone enquadrar corretamente, deve-se utilizar `font-size: inherit` caso o ícone utilizado não aplique-o.
   *
   * @default `false`
   */
  @Input('p-icon') set icon(value: boolean | string | TemplateRef<void>) {
    if (this.type) {
      this._icon = convertToBoolean(value);
    } else {
      this._icon = value;
    }
  }

  get icon() {
    return this._icon;
  }

  /**
   * @optional
   *
   * @description
   *
   * Ativa a inversão de cores configuradas no componente, possibilitando uma visualização de status ativo e inativo.
   *
   * > A cor do texto, do ícone e da borda ficam com a cor utilizada na propriedade `p-color` ou a cor correspondente ao `p-type`,
   * e a cor do fundo fica branca.
   *
   * @default `false`
   */
  @Input('p-inverse') set inverse(value: boolean) {
    this._inverse = convertToBoolean(value);
  }

  get inverse(): boolean {
    return this._inverse;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define uma legenda que será exibida acima ou ao lado da *tag*, de acordo com a `p-orientation`.
   */
  @Input('p-label') label?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define o *layout* de exibição.
   *
   * @default `vertical`
   */
  @Input('p-orientation') set orientation(value: PoTagOrientation) {
    this._orientation = (<any>Object).values(PoTagOrientation).includes(value) ? value : poTagOrientationDefault;
  }

  get orientation(): PoTagOrientation {
    return this._orientation;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o tipo da *tag*.
   *
   * Valores válidos:
   *  - `success`: cor verde utilizada para simbolizar sucesso ou êxito.
   *  - `warning`: cor amarela que representa aviso ou advertência.
   *  - `danger`: cor vermelha para erro ou aviso crítico.
   *  - `info`: cor cinza escuro que caracteriza conteúdo informativo.
   *
   * > Quando esta propriedade for definida, irá sobrepor a definição de `p-color` e `p-icon` somente será exibido caso seja `true`.
   *
   * @default `info`
   */
  @Input('p-type') set type(value: PoTagType) {
    this._type = (<any>Object).values(PoTagType).includes(value) ? value : undefined;
  }

  get type(): PoTagType {
    return this._type;
  }

  /** Texto da tag. */
  @Input('p-value') value: string;

  /**
   * @optional
   *
   * @description
   *
   * Ação que será executada ao clicar sobre o `po-tag` e que receberá como parâmetro um objeto contendo o seu valor e tipo.
   */
  @Output('p-click') click: EventEmitter<any> = new EventEmitter<PoTagItem>();
}
