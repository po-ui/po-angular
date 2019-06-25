import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { browserLanguage, isExternalLink, isTypeof, poLocaleDefault } from '../../../utils/util';

import { poPageLoginLiteralsDefault } from './../po-page-login-base.component';
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
export class PoPageLoginPopoverComponent implements OnInit {

  literals;
  literalParams;
  recoveryType: string;

  private _recovery: string | Function | PoPageLoginRecovery;
  private _remainingAttempts: number;
  private _selectedLanguage: string;

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
  @Input('p-remaining-attempts') set remainingAttempts(value: number) {
    this._remainingAttempts = value;
    this.getLiterals(this.selectedLanguage);
  }

  get remainingAttempts() {
    return this._remainingAttempts;
  }

  /** define o idioma da mensagem conforme selecionado no 'po-page-login' */
  @Input('p-selected-language') set selectedLanguage(value: string) {
    this._selectedLanguage = value;
    this.getLiterals(value);
  }

  get selectedLanguage() {
    return this._selectedLanguage;
  }

  /** se 'p-recovery' for do tipo Function ou PoPageLoginRecovery, emite para o método 'openUrl' do componente 'po-page-login' */
  @Output('p-forgot-password') forgotPassword = new EventEmitter<any>();

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.getLiterals(this.selectedLanguage);
  }

  onForgotPasswordClick(recovery) {
    this.forgotPassword.emit(recovery);
  }

  private getLiterals(language?: string) {
    language = language || browserLanguage();

    this.literalParams = this.remainingAttempts;

    this.literals = {
      ...poPageLoginLiteralsDefault[poLocaleDefault],
      ...poPageLoginLiteralsDefault[language],
    };

    this.changeDetector.detectChanges();
  }

}
