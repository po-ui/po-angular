import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente para a seta que controla a passagem de itens do `po-slide`.
 */
@Component({
  selector: 'po-slide-control',
  templateUrl: './po-slide-control.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class PoSlideControlComponent {
  /** Tipo de controle que aceita os valores: 'previous' e 'next'. */
  @Input('p-control') control: string;

  /** Evento emitido ao clicar em um controle. */
  @Output('p-click') click = new EventEmitter<any>();
}
