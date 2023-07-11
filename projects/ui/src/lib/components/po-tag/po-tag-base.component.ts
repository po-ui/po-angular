import { EventEmitter, Input, Output, Directive, TemplateRef } from '@angular/core';

import { convertToBoolean } from '../../utils/util';
import { PoColorPaletteEnum } from '../../enums/po-color-palette.enum';

import { PoTagItem } from './interfaces/po-tag-item.interface';
import { PoTagOrientation } from './enums/po-tag-orientation.enum';
import { PoTagType } from './enums/po-tag-type.enum';
import { InputBoolean } from '../../decorators';

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
   * Habilita a opção de remover a tag
   *
   * @default `false`
   */
  @Input('p-removable') @InputBoolean() removable: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Desabilita o `po-tag` e não permite que o usuário interaja com o mesmo.
   * > A propriedade `p-disabled` somente terá efeito caso a propriedade `p-removable` esteja definida como `true`.
   *
   * @default `false`
   */
  @Input('p-disabled') @InputBoolean() disabled: boolean = false;

  /** Texto da tag. */
  @Input('p-value') value: string;

  /**
   * @deprecated 16.x.x
   *
   * @optional
   *
   * @description
   *
   * **Deprecated 16.x.x**.
   *
   * > Por regras de acessibilidade a tag não terá mais evento de click. Indicamos o uso do `Po-button` ou `Po-link`
   * caso deseje esse comportamento.
   *
   * Ação que será executada ao clicar sobre o `po-tag` e que receberá como parâmetro um objeto contendo o seu valor e tipo.
   */
  @Output('p-click') click: EventEmitter<any> = new EventEmitter<PoTagItem>();

  /**
   * @optional
   *
   * @description
   *
   * Ação que sera executada quando clicar sobre o ícone de remover no `po-tag`
   */
  @Output('p-close') remove: EventEmitter<null> = new EventEmitter<null>();

  public readonly poTagOrientation = PoTagOrientation;
  public customColor;
  public customTextColor;
  private _color?: string;
  private _textColor?: string;
  private _icon?: boolean | string | TemplateRef<void>;
  private _inverse?: boolean;
  private _orientation?: PoTagOrientation = poTagOrientationDefault;
  private _type?: PoTagType;

  /**
   * @optional
   *
   * @description
   *
   * Determina a cor da tag. As maneiras de customizar as cores são:
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
   * - Para uma melhor acessibilidade no uso do componente é recomendável utilizar cores com um melhor contraste em relação ao background.
   *
   * > **Atenção:** A propriedade `p-type` sobrepõe esta definição.
   */
  @Input('p-color') set color(value: string) {
    this._color = poTagColors.includes(value) ? value : undefined;
    if (this._color === undefined) {
      CSS.supports('color', value) ? (this.customColor = value) : (this.customColor = undefined);
    }
  }

  get color(): string {
    return this._color;
  }

  /**
   * @optional
   *
   * @description
   *
   * Determina a cor do texto da tag. As maneiras de customizar as cores são:
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
   * - Para uma melhor acessibilidade no uso do componente é recomendável utilizar cores com um melhor contraste em relação ao background.
   *
   * > **Atenção:** A propriedade `p-type` sobrepõe esta definição.
   */
  @Input('p-text-color') set textColor(value: string) {
    this._textColor = poTagColors.includes(value) ? value : undefined;
    if (this._textColor === undefined) {
      CSS.supports('color', value) ? (this.customTextColor = value) : (this.customTextColor = undefined);
    }
  }

  get textColor(): string {
    return this._textColor;
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
   * @deprecated 16.x.x
   *
   * @optional
   *
   * @description
   *
   * > Por regras de acessibilidade e usabilidade a tag não terá a inversão de cores no componente.
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
    if (!this.removable) {
      this._type = (<any>Object).values(PoTagType).includes(value) ? value : undefined;
    }
  }

  get type(): PoTagType {
    return this._type;
  }
}
