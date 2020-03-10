import { Component, EventEmitter, Input, Output } from '@angular/core';
/**
 * @docsPrivate
 *
 * @description
 *
 * Este é um componente interno utilizado pelo po-disclaimer-group, se comporta como um botão e recebe uma ação para remover todos os
 * po-disclaimers do grupo.
 */
@Component({
  selector: 'po-disclaimer-remove',
  templateUrl: './po-disclaimer-remove.component.html'
})
export class PoDisclaimerRemoveComponent {
  /** Texto exibido.  */
  @Input('p-label') label?: string;

  /** Ação para remover todos.  */
  @Output('p-remove-all-action') removeAllAction = new EventEmitter();

  // Emite a ação de remover todos.
  removeAction() {
    this.removeAllAction.emit();
  }
}
