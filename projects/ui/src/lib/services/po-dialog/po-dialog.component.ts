import { Component, ComponentRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Subscription } from 'rxjs';

import { poLocaleDefault } from '../po-language/po-language.constant';

import { PoLanguageService } from '../po-language/po-language.service';

import { PoDialogAlertLiterals } from './interfaces/po-dialog-alert-literals.interface';
import { PoDialogAlertOptions, PoDialogConfirmOptions } from './interfaces/po-dialog.interface';
import { PoDialogConfirmLiterals } from './interfaces/po-dialog-confirm-literals.interface';
import { PoDialogType } from './po-dialog.enum';
import { PoModalAction } from '../../components/po-modal/po-modal-action.interface';
import { PoModalComponent } from '../../components/po-modal/po-modal.component';

export const poDialogAlertLiteralsDefault = {
  en: <PoDialogAlertLiterals>{ ok: 'Ok' },
  es: <PoDialogAlertLiterals>{ ok: 'Ok' },
  pt: <PoDialogAlertLiterals>{ ok: 'Ok' },
  ru: <PoDialogAlertLiterals>{ ok: 'Ок' }
};

export const poDialogConfirmLiteralsDefault = {
  en: <PoDialogConfirmLiterals>{ cancel: 'Cancel', confirm: 'Confirm' },
  es: <PoDialogConfirmLiterals>{ cancel: 'Cancelar', confirm: 'Confirmar' },
  pt: <PoDialogConfirmLiterals>{ cancel: 'Cancelar', confirm: 'Confirmar' },
  ru: <PoDialogConfirmLiterals>{ cancel: 'отменить', confirm: 'подтвердить' }
};

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente que serve como container do po-dialog.service
 */

@Component({
  templateUrl: './po-dialog.component.html'
})
export class PoDialogComponent implements OnDestroy, OnInit {
  private language: string;

  // ViewChild para o uso do po-modal.component
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  // Title do poModal
  title: string;

  // Message do poModal
  message: string;

  // Objeto primary do poModal
  primaryAction: PoModalAction = { label: 'ok', action: () => {} };

  // Objeto secondary do poModal
  secondaryAction: PoModalAction;

  // Callback executado ao fechar o poModal
  closeAction: Function;

  // Literais usadas nos botão de alerta do poModal
  literalsAlert: PoDialogAlertLiterals;

  // Literais usadas nos botões de confirmação do poModal
  literalsConfirm: PoDialogConfirmLiterals;

  // Atributo para armazenar a referencia do componente criado via serviço.
  private componentRef: ComponentRef<PoDialogComponent>;
  private closeSubscription: Subscription;

  constructor(languageService: PoLanguageService) {
    this.language = languageService.getShortLanguage();
  }

  ngOnDestroy() {
    this.closeSubscription.unsubscribe();
  }

  ngOnInit() {
    this.closeSubscription = this.poModal.onXClosed.subscribe(close => this.close(true));
  }

  // Fecha o poModal
  close(xClosed = false): void {
    if (xClosed && this.closeAction) {
      this.closeAction();
    }

    this.poModal.close();
    this.destroy();
  }

  destroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  // Insere os valores recebidos de this.open para o poModal
  configDialog(primaryLabel?, primaryAction?, secondaryLabel?, secondaryAction?, closeAction?) {
    this.primaryAction = {
      label: primaryLabel,
      action: () => {
        if (primaryAction) {
          primaryAction();
        }
        this.close();
      }
    };

    if (secondaryLabel) {
      this.secondaryAction = {
        label: secondaryLabel,
        action: () => {
          if (secondaryAction) {
            secondaryAction();
          }
          this.close();
        }
      };
    }

    this.closeAction = closeAction;
  }

  // Insere os valores recebidos de po-dialog.service de acordo com o tipo de diálago solicitado
  open(
    dialogOptions: PoDialogConfirmOptions | PoDialogAlertOptions,
    dialogType: PoDialogType,
    componentRef?: ComponentRef<PoDialogComponent>
  ): void {
    this.title = dialogOptions.title;
    this.message = dialogOptions.message;

    this.componentRef = componentRef;

    this.setDialogLiterals(dialogOptions, dialogType);

    switch (dialogType) {
      case PoDialogType.Confirm: {
        this.configDialog(
          this.literalsConfirm.confirm,
          (<PoDialogConfirmOptions>dialogOptions).confirm,
          this.literalsConfirm.cancel,
          (<PoDialogConfirmOptions>dialogOptions).cancel,
          (<PoDialogConfirmOptions>dialogOptions).close
        );
        break;
      }
      case PoDialogType.Alert: {
        this.configDialog(this.literalsAlert.ok, (<PoDialogAlertOptions>dialogOptions).ok);
        break;
      }
    }

    this.poModal.open();
  }

  private setDialogLiterals(dialogOptions: PoDialogConfirmOptions | PoDialogAlertOptions, dialogType: PoDialogType) {
    const alertLiterals = poDialogAlertLiteralsDefault;
    const confirmLiterals = poDialogConfirmLiteralsDefault;
    const literals = dialogOptions.literals;

    if (dialogType === PoDialogType.Alert) {
      this.literalsAlert = { ...alertLiterals[poLocaleDefault], ...alertLiterals[this.language], ...literals };
    } else {
      this.literalsConfirm = {
        ...confirmLiterals[poLocaleDefault],
        ...confirmLiterals[this.language],
        ...literals
      };
    }
  }
}
