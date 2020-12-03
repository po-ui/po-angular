import { Component, EventEmitter, Output, Input } from '@angular/core';
import { PoTimelineMode } from './enums/po-timeline-mode.enum';
import { PoTimelineItem } from './interfaces/po-timeline-item.interface';

const PO_TIMELINE_MODE_DEFAULT = PoTimelineMode.Full;

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
  private _timeLineMode: PoTimelineMode = PO_TIMELINE_MODE_DEFAULT;

  /**
   * @description
   * Propriedade que receberá os dados dos itens
   */
  @Input('p-items') items: Array<PoTimelineItem> = [];

  /**
   * @optional
   *
   * @description
   * Controla o tamanho do `po-timeline`.
   * #### Tamanhos disponíveis:
   * - `compact`, itens são exibidos um abaixo do outro com 100% de width
   * - `full`, itens são exibidos um abaixo do outro intercalando direito e esquerda com 50% de width
   * @default `full`
   */
  @Input('p-mode') set timelineMode(value: PoTimelineMode) {
    this._timeLineMode = (<any>Object).values(PoTimelineMode).includes(value) ? value : PO_TIMELINE_MODE_DEFAULT;
  }
  get timelineMode(): PoTimelineMode {
    return this._timeLineMode;
  }

  public get timelineModeClass(): string {
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
  @Output('p-click') onClickItem: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @method itemSelected Método que emite um evento com os dados do item a partir de um click
   * @param item Dados do item selecionado
   */
  itemSelected(item: PoTimelineItem) {
    if (this.clickable) {
      this.onClickItem.emit(item);
    }
  }
}
