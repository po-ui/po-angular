import { ElementRef, Input, Directive, Output, EventEmitter } from '@angular/core';

import { convertToBoolean } from '../../utils/util';
import { PO_CONTROL_POSITIONS } from './../../services/po-control-position/po-control-position.constants';

import { PoPopupAction } from './po-popup-action.interface';

const poPopupDefaultPosition = 'bottom-left';

/**
 * @description
 *
 * O componente `po-popup` é um container pequeno recomendado para ações de navegação:
 * Ele abre sobreposto aos outros componentes.
 *
 * É possível escolher as posições do `po-popup` em relação ao componente alvo, para isto veja a propriedade `p-position`.
 *
 * Também é possível informar um _template_ _header_ para o `po-popup`, que será exibido acima das ações.
 * Para funcionar corretamente é preciso adicionar a propriedade `p-popup-header-template` no elemento que servirá de template, por exemplo:
 *
 * ```
 * <po-popup [p-target]="target">
 *   <div p-popup-header-template>
 *     <div>
 *       Dev PO
 *     </div>
 *     <div>
 *       dev.po@po-ui.com.br
 *     </div>
 *   </div>
 * </po-popup >
 * ```
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (css)
 *
 *
 * | Propriedade                            | Descrição                                             | Valor Padrão                                    |
 * |----------------------------------------|-------------------------------------------------------|-------------------------------------------------|
 * | **Default Values**                     |                                                       |                                                 |
 * | `--border-radius`                      | Contém o valor do raio dos cantos do elemento&nbsp;   | `var(--border-radius-md)`                       |
 * | `--border-width`                       | Contém o valor da largura dos cantos do elemento&nbsp;| `var(--border-width-sm)`                        |
 * | `--border-color`                       | Cor da borda                                          | `var(--color-neutral-light-20)`                 |
 * | `--background`                         | Cor do background                                     | `var(--color-neutral-light-00)`                 |
 * | `--shadow`                             | Contém o valor da sombra do elemento                  | `var(--shadow-md)`                              |
 * | **po-popup po-item-list**              |                                                       |                                                 |
 * | `--font-family`                        | Família tipográfica usada                             | `var(--font-family-theme)`                      |
 * | `--font-size`                          | Tamanho da fonte                                      | `var(--font-size-default)`                      |
 * | `--line-height`                        | Tamanho da label                                      | `var(--line-height-md)`                         |
 * | **Action**                             |                                                       |                                                 |
 * | `--font-weight`                        | Peso da fonte                                         | `var(--font-weight-bold)`                       |
 * | `--color`                              | Cor principal do popup                                | `var(--color-action-default)`                   |
 * | **Hover**                              |                                                       |                                                 |
 * | `--color-hover`                        | Cor principal no estado hover                         | `var(--color-brand-01-darkest)`                 |
 * | `--background-hover`                   | Cor de background no estado hover                     | `var(--color-brand-01-lighter)`                 |
 * | **Focused**                            |                                                       |                                                 |
 * | `--outline-color-focused`              | Cor do outline do estado de focus                     | `var(--color-action-focus)`                     |
 * | **Pressed**                            |                                                       |                                                 |
 * | `--background-pressed`                 | Cor de background no estado de pressionado&nbsp;      | `var(--color-brand-01-light)`                   |
 * | **Disabled**                           |                                                       |                                                 |
 * | `--color-disabled`                     | Cor principal no estado disabled                      | `var(--color-action-disabled)`                  |
 * | **Selected**                           |                                                       |                                                 |
 * | `--font-weight-selected`               | Peso da fonte no estado selecionado                   | `var(--font-weight-bold)`                       |
 * | `--background-selected`                | Cor de background no estado selecionado               | `var(--color-brand-01-lightest)`                |
 * | **Option e check**                     |                                                       |                                                 |
 * | `--color-option`                       | Cor principa no estado Option/check                   | `var(--color-neutral-dark-90)`                  |
 *
 * > Para customização dos tokens do componenete, verifique o guia [Customização de cores do tema padrão](https://po-ui.io/guides/colors-customization).
 *
 */
@Directive()
export class PoPopupBaseComponent {
  arrowDirection: string = 'top-right';
  showPopup: boolean = false;

  protected oldTarget;
  protected param;
  protected clickoutListener: () => void;
  protected resizeListener: () => void;

  private _actions: Array<PoPopupAction>;
  private _customPositions?: Array<string>;
  private _hideArrow: boolean = false;
  private _isCornerAlign: boolean = false;
  private _position?: string = poPopupDefaultPosition;
  private _target: any;

  /** Lista de ações que serão exibidas no componente. */
  @Input('p-actions') set actions(value: Array<PoPopupAction>) {
    this._actions = Array.isArray(value) ? value : [];
  }

  get actions() {
    return this._actions;
  }

  /**
   * @optional
   *
   * @description
   *
   * Oculta a seta do componente *popup*.
   *
   * @default `false`
   */
  @Input('p-hide-arrow') set hideArrow(value: boolean) {
    this._hideArrow = convertToBoolean(value);
  }

  get hideArrow(): boolean {
    return this._hideArrow;
  }

  // Define se o `po-popup` será alinhado pelos cantos do elemento target.
  @Input('p-is-corner-align') set isCornerAlign(value: boolean) {
    this._isCornerAlign = convertToBoolean(value);
  }

  get isCornerAlign(): boolean {
    return this._isCornerAlign;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define a posição inicial que o `po-popup` abrirá em relação ao componente alvo. Sugere-se que seja
   * usada a orientação `bottom-left` (abaixo e a esquerda), porém o mesmo é flexível e será rotacionado
   * automaticamente para se adequar a tela, caso necessário.
   *
   * > Caso seja definido um `p-custom-positions` o componente irá abrir na posição definida na propriedade `p-position`
   * e caso não caiba na posição inicial ele irá rotacionar seguindo a ordem de posições definidas no `p-custom-positions`.
   *
   * Posições válidas:
   * - `right`: Posiciona o po-popup no lado direito do componente alvo.
   * - `right-bottom`: Posiciona o po-popup no lado direito inferior do componente alvo.
   * - `right-top`: Posiciona o po-popup no lado direito superior do componente alvo.
   * - `bottom`: Posiciona o po-popup abaixo do componente alvo.
   * - `bottom-left`: Posiciona o po-popup abaixo e à esquerda do componente alvo.
   * - `bottom-right`: Posiciona o po-popup abaixo e à direita do componente alvo.
   * - `left`: Posiciona o po-popup no lado esquerdo do componente alvo.
   * - `left-top`: Posiciona o po-popup no lado esquerdo superior do componente alvo.
   * - `left-bottom`: Posiciona o po-popup no lado esquerdo inferior do componente alvo.
   * - `top`: Posiciona o po-popup acima do componente alvo.
   * - `top-right`: Posiciona o po-popup acima e à direita do componente alvo.
   * - `top-left`: Posiciona o po-popup acima e à esquerda do componente alvo.
   *
   * @default `bottom-left`
   */
  @Input('p-position') set position(value: string) {
    this._position = PO_CONTROL_POSITIONS.includes(value) ? value : poPopupDefaultPosition;
  }

  get position(): string {
    return this._position;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define as posições e a sequência que o `po-popup` poderá rotacionar. A sequência será definida pela ordem passada
   * no *array*. Caso não seja definido, o `po-popup` irá rotacionar em todas as posições válidas.
   *
   * > O componente sempre irá abrir na posição definida no `p-position` e caso não caiba na posição definida o mesmo
   * irá rotacionar seguindo a ordem definida pelo `p-custom-position`.
   *
   * Posições válidas:
   * - `right`: Posiciona o po-popup no lado direito do componente alvo.
   * - `right-bottom`: Posiciona o po-popup no lado direito inferior do componente alvo.
   * - `right-top`: Posiciona o po-popup no lado direito superior do componente alvo.
   * - `bottom`: Posiciona o po-popup abaixo do componente alvo.
   * - `bottom-left`: Posiciona o po-popup abaixo e à esquerda do componente alvo.
   * - `bottom-right`: Posiciona o po-popup abaixo e à direita do componente alvo.
   * - `left`: Posiciona o po-popup no lado esquerdo do componente alvo.
   * - `left-top`: Posiciona o po-popup no lado esquerdo superior do componente alvo.
   * - `left-bottom`: Posiciona o po-popup no lado esquerdo inferior do componente alvo.
   * - `top`: Posiciona o po-popup acima do componente alvo.
   * - `top-right`: Posiciona o po-popup acima e à direita do componente alvo.
   * - `top-left`: Posiciona o po-popup acima e à esquerda do componente alvo.
   */
  @Input('p-custom-positions') set customPositions(value: Array<string>) {
    this._customPositions = Array.isArray(value) ? value : [];
  }

  get customPositions() {
    return this._customPositions;
  }

  /**
   * @description
   *
   * Para utilizar o `po-popup` deve-se colocar uma variável local no componente que disparará o evento
   * de abertura no mesmo e com isso, invocará a função `toggle`, por exemplo:
   *
   * ```
   * <span #icon class="po-icon po-icon-credit-payment" (click)="popup.toggle()">
   *   Credit Actions
   * </span>
   *
   * <po-popup #popup
   *   [p-actions]="actions"
   *   [p-target]="icon">
   * </po-popup>
   * ```
   *
   * Caso o elemento alvo for um componente, será preciso obter o `ElementRef` do mesmo e passá-lo à propriedade, por exemplo:
   *
   * ```
   * // component.html
   *
   * <po-button #poButton
   *   p-label="Open Popover"
   *   (p-click)="popup.toggle()">
   * </po-button>
   *
   * <po-popup #popup
   *   [p-actions]="actions"
   *   [p-target]="poButtonRef">
   * </po-popup>
   *
   * // component.ts
   *
   * @ViewChild('poButton', { read: ElementRef }) poButtonRef: ElementRef;
   * ```
   */
  @Input('p-target') set target(value: any) {
    this._target = value instanceof ElementRef ? value.nativeElement : value;
  }

  get target() {
    return this._target;
  }

  @Output('p-close') closeEvent: EventEmitter<any> = new EventEmitter();
}
