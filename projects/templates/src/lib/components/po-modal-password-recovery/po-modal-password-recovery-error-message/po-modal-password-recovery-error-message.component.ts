import { Component, Input } from '@angular/core';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente utilizado para exibição da mensagem customizada de erro em um campo de formulário.
 */
@Component({
  selector: 'po-modal-password-recovery-error-message',
  templateUrl: './po-modal-password-recovery-error-message.component.html'
})
export class PoModalPasswordRecoveryErrorMessageComponent {
  /** Texto exibido na mensagem de erro. */
  @Input('p-text') text: string;
}
