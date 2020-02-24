import { Component, EventEmitter, Output, Input } from '@angular/core';
import { convertToBoolean } from '../../utils/util';
import { TimeLineCard } from './models/timeline-card.model';

const PO_TIMELINE_SIZES = ['sm', 'md', 'lg'];
const PO_TIMELINE_SIZE_DEFAULT = 'lg';

@Component({
  selector: 'po-timeline',
  templateUrl: './po-timeline.component.html',
  styleUrls: ['./po-timeline.component.scss']
})
/**
 * @description
 * 
 * Componente utilizado para criar uma linha do tempo de algum acontencimento especifico.
 * 
 * O `po-timeline` conta com alguns recursos como controle de tamanho, e seleção dos paineis/acontecimentos.
 * 
 * @example
 *
 * <example name="po-timeline-basic" title="Portinari Timeline Basic">
 *  <file name="sample-po-timeline-basic/sample-po-timeline-basic.component.html"> </file>
 *  <file name="sample-po-timeline-basic/sample-po-timeline-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-timeline-labs" title="Portinari Timeline Labs">
 *  <file name="sample-po-timeline-labs/sample-po-timeline-labs.component.html"> </file>
 *  <file name="sample-po-timeline-labs/sample-po-timeline-labs.component.ts"> </file>
 * </example>
 */
export class PoTimelineComponent {

  private _timeLineSize: string = 'lg';
  private _clickable: boolean = false;

  /**
   * @description
   * Propriedade que receberá os dados dos cards
   */
  @Input('p-cards') cards: TimeLineCard[] = [];

  /**
   * @optional
   * 
   * @description 
   * Controla o tamanho do `po-timeline`.
   * #### Tamanhos disponíveis:
   * - `sm`, recomendado para espaços menores que 50% da tela.
   * - `md`, recomendado para utilizar com 50% da tela.
   * - `lg`, recomendado para utilizar com 100% da tela.
   * 
   * @default `lg`
   */
  @Input('p-size') set timelineSize(size: string) {
    this._timeLineSize = PO_TIMELINE_SIZES.includes(size) ? size : PO_TIMELINE_SIZE_DEFAULT;
  };
  get timelineSize(): string {
    return this._timeLineSize;
  }

  /**
   * @optional
   * 
   * @description 
   * Utilizado para controlar se o card pode ser clicado ou não.
   * > Quando a propriedade estiver habilitada, ao clicar em um card, um evento irá ser emitido com seus dados.
   * 
   * @default `false`
   */
  @Input('p-clickable') set clickable(value: boolean) {
    this._clickable = convertToBoolean(value);
  }
  get clickable(): boolean {
    return this._clickable;
  }

  /**
   * @description 
   * Evento usado para emitir um click no card
   */
  @Output('p-click') onClickCard: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  /**
   * @method `cardSelect` Método que emite um evento com os dados do card a partir de um click
   * @param card Dados do card selecionado
   */
  cardSelect(card: TimeLineCard) {
    if (this.clickable) { return this.onClickCard.emit(card); }
  }
}
