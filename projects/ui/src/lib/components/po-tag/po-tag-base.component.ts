import { Directive, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

import { PoColorPaletteEnum } from '../../enums/po-color-palette.enum';
import { convertToBoolean } from '../../utils/util';

import { PoLanguageService } from './../../services/po-language/po-language.service';
import { poLocaleDefault } from '../../services/po-language/po-language.constant';
import { PoTagOrientation } from './enums/po-tag-orientation.enum';
import { PoTagType } from './enums/po-tag-type.enum';
import { PoTagItem } from './interfaces/po-tag-item.interface';
import { PoTagLiterals } from './interfaces/po-tag-literals.interface';

const poTagColors = (<any>Object).values(PoColorPaletteEnum);
const poTagOrientationDefault = PoTagOrientation.Vertical;

export const PoTagLiteralsDefault = {
  en: {
    remove: 'Clear'
  },
  es: {
    remove: 'Eliminar'
  },
  pt: {
    remove: 'Remover'
  },
  ru: {
    remove: 'удалять'
  }
};

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
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                            | Descrição                                             | Valor Padrão                                    |
 * |----------------------------------------|-------------------------------------------------------|-------------------------------------------------|
 * | **Default Values**                     |                                                       |                                                 |
 * | `--font-family`                        | Família tipográfica usada                             | `var(--font-family-theme)`                      |
 * | `--font-size`                          | Tamanho da fonte                                      | `var(--font-size-sm)`                           |
 * | `--line-height`                        | Tamanho da label                                      | `var(---line-height-sm)`                        |
 * | `--border-radius`                      | Contém o valor do raio dos cantos do elemento&nbsp;   | `var(--border-radius-pill)`                     |
 * | **Neutral**                            |                                                       |                                                 |
 * | `--color-neutral`                      | Cor principal no estado neutral                       | `var(--color-neutral-light-10)`                 |
 * | `--text-color-positive`                | Cor do texto no estado neutral                        | `var(--color-neutral-dark-80)`                  |
 * | **Positive**                           |                                                       |                                                 |
 * | `--color-positive`                     | Cor principal no estado positive                      | `var(--color-feedback-positive-lightest)`       |
 * | `--text-color-positive`                | Cor do texto no estado positive                       | `var(--color-feedback-positive-dark)`           |
 * | **Negative**                           |                                                       |                                                 |
 * | `--color-negative`                     | Cor principal no estado danger                        | `var(--color-feedback-negative-lightest)`       |
 * | `--text-color-negative`                | Cor do texto no estado danger                         | `var(--color-feedback-negative-darker)`         |
 * | **Warning**                            |                                                       |                                                 |
 * | `--color-tag-warning`                  | Cor principal no estado warning                       | `var(--color-feedback-warning-lightest)`        |
 * | `--text-color-warning`                 | Cor do texto no estado warning                        | `var(--color-feedback-warning-darkest)`         |
 * | **Info**                               |                                                       |                                                 |
 * | `--color-info`                         | Cor principal no estado info                          | `var(--color-feedback-info-lightest)`           |
 * | `--text-color-info`                    | Cor do texto no estado info                           | `var(--color-feedback-info-dark)`               |
 * | **Removable**                          |                                                       |                                                 |
 * | `--color`                              | Cor principal quando removable                        | `var(--color-brand-01-lightest)`                |
 * | `--border-color`                       | Cor de borda quando removable &nbsp;                  | `var(--color-brand-01-lighter)`                 |
 * | `--color-icon`                         | Cor do ícone quando removable &nbsp;                  | `var(--color-action-default)`                   |
 * | `--text-color`                         | Cor do texto quando removable &nbsp;                  | `var(--color-neutral-dark-80)`                  |
 * | `--color-hover`                        | Cor do hover no estado removable &nbsp;               | `var(--color-brand-01-lighter)`                 |
 * | **Focused**                            |                                                       |                                                 |
 * | `--outline-color-focused`              | Cor do outline do estado de focus                     | `var(--color-action-focus)`                     |
 * | **Disabled**                           |                                                       |                                                 |
 * | `--color-disabled`                     | Cor principal no estado disabled                      | `var(--color-neutral-light-20)`                 |
 * | `--border-color-disabled`              | Cor da borda no estado disabled &nbsp;                | `var(--color-action-disabled)`                  |
 * | `--color-icon-disabled`                | Cor do icone no estado disabled &nbsp;                | `var(--color-action-disabled)`                  |
 * | `--text-color-disabled`                | Cor do texto no estado disabled &nbsp;                | `var(--color-neutral-mid-60)`                   |
 *
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
  @Input({ alias: 'p-removable', transform: convertToBoolean }) removable: boolean = false;

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
  @Input({ alias: 'p-disabled', transform: convertToBoolean }) disabled: boolean = false;

  /** Texto da tag. */
  @Input('p-value') value: string;

  /**
   * @optional
   *
   * @description
   *
   * Ação que será executada ao clicar sobre o `po-tag` e que receberá como parâmetro um objeto contendo o seu valor e tipo.
   *
   * O evento de click só funciona se a tag não for removível.
   */
  @Output('p-click') click: EventEmitter<any> = new EventEmitter<PoTagItem>();

  /**
   * @optional
   *
   * @description
   *
   * Ação que sera executada quando clicar sobre o ícone de remover no `po-tag`
   */
  @Output('p-close') remove: EventEmitter<any> = new EventEmitter<any>();

  public readonly poTagOrientation = PoTagOrientation;
  public customColor;
  public customTextColor;
  private _color?: string;
  private _textColor?: string;
  private _icon?: boolean | string | TemplateRef<void>;
  private _orientation?: PoTagOrientation = poTagOrientationDefault;
  private _type?: PoTagType;
  private _literals: PoTagLiterals;
  private language: string;

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
   *  - `info`: cor azul claro que caracteriza conteúdo informativo.
   *  - `neutral`: cor cinza claro para uso geral.
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

  /**
   * @optional
   *
   * @description
   *
   * Objeto com as literais usadas no `po-tag`.
   *
   *
   * Para utilizar, basta passar a literal customizada:
   *
   * ```
   *  const customLiterals: PoTagLiterals = {
   *    remove: 'Remover itens'
   *  };
   * ```
   *
   * E para carregar as literais customizadas, basta apenas passar o objeto para o componente:
   *
   * ```
   * <po-tag
   *   [p-literals]="customLiterals">
   * </po-tag>
   * ```
   *
   * > O objeto padrão de literais será traduzido de acordo com o idioma do
   * [`PoI18nService`](/documentation/po-i18n) ou do browser.
   */
  @Input('p-literals') set literals(value: PoTagLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...PoTagLiteralsDefault[poLocaleDefault],
        ...PoTagLiteralsDefault[this.language],
        ...value
      };
    } else {
      this._literals = PoTagLiteralsDefault[this.language];
    }
  }

  get literals() {
    return this._literals || PoTagLiteralsDefault[this.language];
  }

  constructor(languageService: PoLanguageService) {
    this.language = languageService.getShortLanguage();
  }
}
