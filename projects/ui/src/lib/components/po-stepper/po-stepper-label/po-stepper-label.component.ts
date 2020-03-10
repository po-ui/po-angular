import { Component, Input } from '@angular/core';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente responsável por exibir as legendas dos *steps*.
 */
@Component({
  selector: 'po-stepper-label',
  templateUrl: './po-stepper-label.component.html'
})
export class PoStepperLabelComponent {
  // Conteúdo da label.
  @Input('p-content') content: string;
}
