import { ElementRef, EventEmitter, Input, Directive, Output } from '@angular/core';

import { convertToBoolean } from '../../utils/util';
import { PO_CONTROL_POSITIONS } from './../../services/po-control-position/po-control-position.constants';

const PO_POPOVER_DEFAULT_POSITION = 'right';
const PO_POPOVER_DEFAULT_TRIGGER = 'click';
const PO_POPOVER_TRIGGERS = ['click', 'hover'];

/**
 * @description
 *
 * O componente `po-popover` é um container pequeno recomendado para incluir vários tipos de conteúdo como:
 * gráficos, textos, imagens e inputs. Ele abre sobreposto aos outros componentes.
 *
 * Para mostrar apenas pequenos textos recomenda-se o uso da diretiva
 * [**po-tooltip**](https://po-ui.io/documentation/po-tooltip?view=doc).
 *
 * Para conteúdos maiores recomenda-se o uso do [**po-modal**](https://po-ui.io/documentation/po-modal?view=doc).
 *
 * Ele contém um título e também é possível escolher as posições do popover em relação ao componente pai,
 * as posições permitidas são: `right`, `right-top`, `right-bottom`, `top`, `top-left`, `top-right`,
 * `left`, `left-top`, `left-bottom`, `bottom`, `bottom-left` e `bottom-right`.
 *
 * Também é possível escolher entre os dois eventos que podem abrir o *popover*.
 * Os eventos permitidos são: `click` e `hover`.
 *
 */
@Directive()
export class PoPopoverBaseComponent {
  // Controla se o popover fica oculto ou visível, por padrão é oculto.
  isHidden: boolean = true;

  private _hideArrow: boolean = false;
  private _position?: string = PO_POPOVER_DEFAULT_POSITION;
  private _trigger?: string = PO_POPOVER_DEFAULT_TRIGGER;

  /**
   * @optional
   *
   * @description
   *
   * Desabilita a seta do componente *popover*.
   *
   * @default `false`
   */
  @Input('p-hide-arrow') set hideArrow(value: boolean) {
    this._hideArrow = convertToBoolean(value);
  }

  get hideArrow(): boolean {
    return this._hideArrow;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define a posição que o po-popover abrirá em relação ao componente alvo. Sugere-se que seja
   * usada a orientação "right" (direita), porém o mesmo é flexível e será rotacionado
   * automaticamente para se adequar a tela, caso necessário.
   *
   * Posições válidas:
   * - `right`: Posiciona o po-popover no lado direito do componente alvo.
   * - `right-bottom`: Posiciona o po-popover no lado direito inferior do componente alvo.
   * - `right-top`: Posiciona o po-popover no lado direito superior do componente alvo.
   * - `bottom`: Posiciona o po-popover abaixo do componente alvo.
   * - `bottom-left`: Posiciona o po-popover abaixo e à esquerda do componente alvo.
   * - `bottom-right`: Posiciona o po-popover abaixo e à direita do componente alvo.
   * - `left`: Posiciona o po-popover no lado esquerdo do componente alvo.
   * - `left-top`: Posiciona o po-popover no lado esquerdo superior do componente alvo.
   * - `left-bottom`: Posiciona o po-popover no lado esquerdo inferior do componente alvo.
   * - `top`: Posiciona o po-popover acima do componente alvo.
   * - `top-right`: Posiciona o po-popover acima e à direita do componente alvo.
   * - `top-left`: Posiciona o po-popover acima e à esquerda do componente alvo.
   *
   *
   * @default right
   */
  @Input('p-position') set position(value: string) {
    this._position = PO_CONTROL_POSITIONS.includes(value) ? value : PO_POPOVER_DEFAULT_POSITION;
  }

  get position(): string {
    return this._position;
  }

  /**
   * @description
   *
   * ElementRef do componente de origem responsável por abrir o popover.
   * Para utilizar o po-popover deve-se colocar uma variável no componente que vai disparar o evento
   * de abertura, exemplo:
   *
   * ```
   * <po-button
   *   p-label="Open Popover">
   * </po-button>
   *
   * <po-popover
   *   [p-target]="poButton"
   *   [p-title]="PO Popover">
   * </po-popover>
   * ```
   *
   * Também deve-se criar um ViewChild para cada popover, passando como referência o elemento do
   * HTML que irá disparar o evento. Exemplo:
   *
   * ```
   * @ViewChild(PoButtonComponent, {read: ElementRef}) poButton: PoButtonComponent;
   * ```
   *
   * Pode-se tambem informar diretamente o HTMLElement, para não ter que utilizar o ViewChild.
   * Para utilizar o po-popover deve-se colocar uma variável no componente que vai disparar o evento
   * de abertura, exemplo:
   *
   * ```
   * <button #target>
   *   Abrir popover
   * </button>
   *
   * <po-popover
   *     [p-target]="target"
   *     p-trigger="click" >
   * </po-popover>
   * ```
   *
   *
   *
   */
  @Input('p-target') target: ElementRef | HTMLElement;

  /** Título do popover. */
  @Input('p-title') title?: string;

  /**
   * @description
   *
   * Define o evento que abrirá o po-popover.
   *
   * Valores válidos:
   *  - `click`: Abre ao clicar no componente alvo.
   *  - `hover`: Abre ao passar o mouse sobre o componente alvo.
   *
   * @default click
   * @optional
   */
  @Input('p-trigger') set trigger(value: string) {
    this._trigger = PO_POPOVER_TRIGGERS.includes(value) ? value : PO_POPOVER_DEFAULT_TRIGGER;
  }

  get trigger(): string {
    return this._trigger;
  }

  /** Evento disparado ao fechar o popover. */
  @Output('p-close') closePopover = new EventEmitter<any>();

  protected clickoutListener: () => void;
  protected mouseEnterListener: () => void;
  protected mouseLeaveListener: () => void;
  protected resizeListener: () => void;
}
