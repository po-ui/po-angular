import { Component, EventEmitter, Input, Output } from '@angular/core';

import { isExternalLink, isTypeof } from '../../../utils/util';

import { PoPageLoginLiterals } from '../interfaces/po-page-login-literals.interface';
import { PoPageLoginRecovery } from '../interfaces/po-page-login-recovery.interface';

@Component({
  selector: 'po-page-login-popover',
  templateUrl: './po-page-login-popover.component.html'
})

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente para definição da mensagem de aviso de bloqueio do `po-page-login`.
 */
export class PoPageLoginPopoverComponent {
  recoveryType: string;

  private _recovery: string | Function | PoPageLoginRecovery;

  @Input('p-literals') literals: PoPageLoginLiterals;

  /** exibe o link de 'esqueci minha senha' e verifica se o valor é um link interno ou externo */
  @Input('p-recovery') set recovery(value: string | Function | PoPageLoginRecovery) {
    this._recovery = value;

    if (isTypeof(value, 'string')) {
      this.recoveryType = isExternalLink(value) ? 'externalLink' : 'internalLink';
    }
  }

  get recovery() {
    return this._recovery;
  }

  /** define se a mensagem deverá ser exibida caso seja maior que 0(zero) */
  @Input('p-remaining-attempts') remainingAttempts: number;

  /** se 'p-recovery' for do tipo Function ou PoPageLoginRecovery, emite para o método 'openUrl' do componente 'po-page-login' */
  @Output('p-forgot-password') forgotPassword = new EventEmitter<any>();

  onForgotPasswordClick(recovery) {
    this.forgotPassword.emit(recovery);
  }
}
