import { Directive, Input } from '@angular/core';

import { convertToBoolean } from '../../utils/util';
import { PO_CONTROL_POSITIONS } from './../../services/po-control-position/po-control-position.constants';

const PO_TOOLTIP_POSITION_DEFAULT = 'bottom';

/**
 * @description
 *
 * A diretiva po-tooltip deve ser utilizada para oferecer informações adicionais quando os usuários
 * passam o mouse ou realizam o foco sobre o elemento alvo ao qual ela está atribuída.
 *
 * O conteúdo é formado por um pequeno texto que deve contribuir para uma tomada de decisão ou
 * orientação do usuário. A ativação dele pode estar em qualquer componente ou tag HTML.
 *
 * Para textos maiores ou no caso de haver a necessidade de utilizar algum outro elemento como
 * conteúdo deve-se utilizar o [**po-popover**](https://po-ui.io/documentation/po-popover?view=doc).
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                                  | Descrição                                                        | Valor Padrão                                     |
 * |----------------------------------------------|------------------------------------------------------------------|--------------------------------------------------|
 * | **Default Values**                           |                                                                  |                                                  |
 * | `--border-radius` &nbsp;                     | Contém o valor do raio dos cantos do elemento&nbsp;              | `var(--border-radius-md)`                        |
 * | `--color`                                    | Cor principal da tooltip                                         | `var(--color-neutral-dark-80)`                   |
 * | `--font-family`                              | Família tipográfica usada                                        | `var(--font-family-theme)`                       |
 * | `--text-color`                               | Cor do texto                                                     | `var(--color-neutral-light-00)`                  |
 *
 */

@Directive()
export abstract class PoTooltipBaseDirective {
  /**
   * @optional
   *
   * @description
   *
   * Define que o po-tooltip será incluido no body e não dentro do elemento ao qual o tooltip foi especificado.
   * Opção necessária para o caso de uso de tooltip em um elemento SVG.
   *
   * @default `false`
   */
  @Input({ alias: 'p-append-in-body', transform: convertToBoolean }) appendInBody: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Controla a exibição da seta de indicação da tooltip.
   *
   * Quando `true`, a seta que aponta para o elemento alvo será ocultada.
   * Quando `false`, a seta será exibida normalmente.
   *
   * Essa propriedade é útil em cenários onde a seta não é necessária ou pode interferir no layout da aplicação.
   *
   * @default `false`
   */
  @Input({ alias: 'p-hide-arrow', transform: convertToBoolean }) hideArrow: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Permite a renderização de conteúdo HTML dentro da tooltip.
   *
   * Quando `true`, o valor da propriedade `tooltip` será interpretado como HTML,
   * possibilitando a utilização de tags e elementos HTML dentro da tooltip.
   * Caso `false`, o conteúdo será tratado como texto puro.
   *
   * @default `false`
   */
  @Input({ alias: 'p-inner-html', transform: convertToBoolean }) innerHtml: boolean = false;

  protected _tooltipPosition?: string = 'bottom';
  protected tooltipContent;

  private _displayTooltip: boolean = false;
  private _tooltip: string = '';

  /**
   * @description
   *
   * Habilita e atribui um texto ao po-tooltip.
   *
   * **Como boa prática, indica-se utilizar um texto com até 140 caracteres.**
   */
  @Input('p-tooltip') set tooltip(tooltip: string) {
    this._tooltip = tooltip;
  }
  get tooltip() {
    return this._tooltip;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define a posição que o po-tooltip abrirá em relação ao componente alvo. Sugere-se que seja
   * usada a orientação "bottom" (abaixo), porém o mesmo é flexível e será rotacionado
   * automaticamente para se adequar a tela, caso necessário.
   *
   * Posições válidas:
   * - `right`: Posiciona o po-tooltip no lado direito do componente alvo.
   * - `right-bottom`: Posiciona o po-tooltip no lado direito inferior do componente alvo.
   * - `right-top`: Posiciona o po-tooltip no lado direito superior do componente alvo.
   * - `bottom`: Posiciona o po-tooltip abaixo do componente alvo.
   * - `bottom-left`: Posiciona o po-tooltip abaixo e à esquerda do componente alvo.
   * - `bottom-right`: Posiciona o po-tooltip abaixo e à direita do componente alvo.
   * - `left`: Posiciona o po-tooltip no lado esquerdo do componente alvo.
   * - `left-top`: Posiciona o po-tooltip no lado esquerdo superior do componente alvo.
   * - `left-bottom`: Posiciona o po-tooltip no lado esquerdo inferior do componente alvo.
   * - `top`: Posiciona o po-tooltip acima do componente alvo.
   * - `top-right`: Posiciona o po-tooltip acima e à direita do componente alvo.
   * - `top-left`: Posiciona o po-tooltip acima e à esquerda do componente alvo.
   *
   * @default bottom
   */
  @Input('p-tooltip-position') set tooltipPosition(position: string) {
    this._tooltipPosition = PO_CONTROL_POSITIONS.includes(position) ? position : PO_TOOLTIP_POSITION_DEFAULT;
  }
  get tooltipPosition(): string {
    return this._tooltipPosition;
  }

  @Input({ alias: 'p-display-tooltip', transform: convertToBoolean }) set displayTooltip(value: boolean) {
    this._displayTooltip = value;
    this._displayTooltip ? this.addTooltipAction() : this.removeTooltipAction();
  }

  get displayTooltip(): boolean {
    return this._displayTooltip;
  }

  protected abstract addTooltipAction();
  protected abstract removeTooltipAction();
}
