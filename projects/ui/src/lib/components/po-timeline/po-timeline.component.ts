import { Component, EventEmitter, Output, Input } from '@angular/core';
import { PoTimelineItem } from './interfaces/po-timeline-item.interface';

const PO_TIMELINE_SIZES = ['compact', 'full'];
const PO_TIMELINE_SIZE_DEFAULT = 'full';

@Component({
  selector: 'po-timeline',
  templateUrl: './po-timeline.component.html'
})
/**
 * @description
 *
 * Componente utilizado para criar uma linha do tempo de algum acontencimento especifico.
 *
 * O `po-timeline` conta com alguns recursos como controle de tamanho, e seleção dos paineis (acontecimentos)
 */
export class PoTimelineComponent {
  private _timeLineMode: string = 'full';

  /**
   * @description
   * Propriedade que receberá os dados dos itens
   */
  @Input('p-items') items: PoTimelineItem[] = [];

  /**
   * @optional
   *
   * @description
   * Controla o tamanho do `po-timeline`.
   * #### Tamanhos disponíveis:
   * - `compact`, itens são exibidos um abaixo do outro com 100% de width
   * - `full`, itens são exibidos um abaixo do outro intercalando direito e esquerda com 50% de width
   * @default `lg`
   */
  @Input('p-mode') set timelineMode(size: string) {
    this._timeLineMode = PO_TIMELINE_SIZES.includes(size) ? size : PO_TIMELINE_SIZE_DEFAULT;
  }
  get timelineMode(): string {
    return 'po-timeline-' + this._timeLineMode;
  }

  /**
   * @description
   * Utilizado para controlar se o item é clicável ou não
   * > Quando a propriedade estiver habilitada, ao clicar em um item, um evento irá ser emitido com seus dados.
   */
  @Input('p-clickable') clickable: boolean;

  /**
   * @description
   * Evento usado para emitir um click no item
   */
  @Output('p-click') onClickCard: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  /**
   * @method cardSelect Método que emite um evento com os dados do item a partir de um click
   * @param card Dados do item selecionado
   */
  itemSelected(card: PoTimelineItem) {
    if (this.clickable) {
      return this.onClickCard.emit(card);
    }
  }
}
