import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente para o conjunto de círculos que faz a passagem de itens do `po-slide`.
 */
@Component({
  selector: 'po-slide-circles',
  templateUrl: './po-slide-circles.component.html'
})
export class PoSlideCirclesComponent {
  /** Index do slide atual. */
  @Input('p-current-slide-index') currentSlideIndex: number;

  /** Itens do slide. */
  @Input('p-items') items: Array<any>;

  /** Evento emitido ao clicar em um controle. */
  @Output('p-click') click = new EventEmitter<any>();
}
