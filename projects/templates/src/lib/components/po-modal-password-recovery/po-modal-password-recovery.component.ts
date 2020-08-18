import { Component, OnDestroy, ViewChild } from '@angular/core';
import { AbstractControl, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import {
  PoI18nPipe,
  PoLanguageService,
  PoModalAction,
  PoModalComponent,
  PoRadioGroupOption
} from '@po-ui/ng-components';

import { isExternalLink } from '../../utils/util';

import { PoModalPasswordRecovery } from './interfaces/po-modal-password-recovery.interface';
import { PoModalPasswordRecoveryBaseComponent } from './po-modal-password-recovery-base.component';
import { PoModalPasswordRecoveryModalContent } from './enums/po-modal-password-recovery-modal-content.enum';
import { PoModalPasswordRecoveryService } from './po-modal-password-recovery.service';
import { PoModalPasswordRecoveryType } from './enums/po-modal-password-recovery-type.enum';

/**
 * @docsExtends PoModalPasswordRecoveryBaseComponent
 *
 * @example
 *
 * <example name="po-modal-password-recovery-basic" title="PO Modal Password Recovery Basic">
 *  <file name="sample-po-modal-password-recovery-basic/sample-po-modal-password-recovery-basic.component.html"> </file>
 *  <file name="sample-po-modal-password-recovery-basic/sample-po-modal-password-recovery-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-modal-password-recovery-labs" title="PO Modal Password Recovery Labs">
 *  <file name="sample-po-modal-password-recovery-labs/sample-po-modal-password-recovery-labs.component.html"> </file>
 *  <file name="sample-po-modal-password-recovery-labs/sample-po-modal-password-recovery-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-modal-password-recovery-request" title="PO Modal Password Recovery Request">
 *  <file name="sample-po-modal-password-recovery-request/sample-po-modal-password-recovery-request.component.html"> </file>
 *  <file name="sample-po-modal-password-recovery-request/sample-po-modal-password-recovery-request.component.ts"> </file>
 * </example>
 */

@Component({
  selector: 'po-modal-password-recovery',
  templateUrl: './po-modal-password-recovery.component.html'
})
export class PoModalPasswordRecoveryComponent extends PoModalPasswordRecoveryBaseComponent implements OnDestroy {
  chosenTypeFormOption: string = PoModalPasswordRecoveryType.Email;
  codeMask: string = '9 9 9 9 9 9';
  control: AbstractControl;
  emailModal: boolean = true;
  emailModalPhrases = { firstPhrase: null as string, secondPhrase: null as string };
  endpoint: string = '.';
  invalidCode: boolean = false;
  invalidEmail: boolean = false;
  modalTitle: string;
  modalType: PoModalPasswordRecoveryModalContent = PoModalPasswordRecoveryModalContent.Email;
  showCustomCodeError: boolean;
  smsCodeErrorMessagePhrase: string;
  submittedCodeValue = {} as PoModalPasswordRecovery;
  submittedContactValue = {} as PoModalPasswordRecovery;

  private passwordRecoverySubscription: Subscription;
  private smsBodyResponse;
  private smsCodeSubscription: Subscription;

  @ViewChild('emailForm') emailForm: NgForm;

  @ViewChild('recoveryModal', { static: true }) recoveryModalElement: PoModalComponent;

  @ViewChild('smsCodeForm') smsCodeForm: NgForm;

  primaryAction: PoModalAction = { label: undefined, action: () => {} };

  secondaryAction: PoModalAction = { label: undefined, action: () => {} };

  typeFormOptions: Array<PoRadioGroupOption> = [
    { label: 'e-mail', value: PoModalPasswordRecoveryType.Email },
    { label: 'SMS', value: PoModalPasswordRecoveryType.SMS }
  ];

  constructor(
    private router: Router,
    private poI18nPipe: PoI18nPipe,
    private poModalPasswordRecoveryService: PoModalPasswordRecoveryService,
    poLanguageService: PoLanguageService
  ) {
    super(poLanguageService);
  }

  ngOnDestroy() {
    if (this.passwordRecoverySubscription) {
      this.passwordRecoverySubscription.unsubscribe();
    }

    if (this.smsCodeSubscription) {
      this.smsCodeSubscription.unsubscribe();
    }
  }

  completed() {
    this.cancelAction();
  }

  formModelChangesCheck(form: NgForm) {
    const invalidForm = form.invalid;
    this.invalidEmail = invalidForm && form.dirty;
    this.primaryAction.disabled = invalidForm;

    if (this.modalType === PoModalPasswordRecoveryModalContent.SMSCode) {
      const codeError: boolean = this.codeError !== undefined && this.codeError !== '';
      this.showCustomCodeError = codeError && form.pristine;
    }
  }

  getInputType(type) {
    this.type = type;
    this.pipeModalPhrases();
    setTimeout(() => {
      this.control = this.emailForm.controls[type];
      this.formModelChangesCheck(this.emailForm);
      this.resetFormFields(this.control);
    });
  }

  open() {
    const control = this.checkFormType(this.type);
    this.control = this.emailForm.controls[control];
    this.setEmailModalPhrasesAndActions();
    this.formModelChangesCheck(this.emailForm);
    this.recoveryModalElement.open();
  }

  openConfirmation() {
    this.modalTitle = this.literals.emailSentTitle;
    this.modalType = PoModalPasswordRecoveryModalContent.Confirmation;
    this.setActions(
      this.cancelAction,
      this.literals.closeButton,
      this.submitAction,
      this.literals.resendEmailButton,
      false
    );
  }

  openSmsCode() {
    this.modalTitle = this.literals.typeCodeTitle;
    this.modalType = PoModalPasswordRecoveryModalContent.SMSCode;
    this.setActions(
      this.submitSmsCodeAction,
      this.literals.continueButton,
      this.cancelAction,
      this.literals.cancelButton,
      true
    );

    setTimeout(() => {
      this.control = this.smsCodeForm.controls['sms'];
      this.formModelChangesCheck(this.smsCodeForm);
    });
  }

  resendSmsCode() {
    this.incrementRetryAttempts();
    if (this.urlRecovery) {
      this.submitActionRequest(this.submittedContactValue, this.type);
    } else {
      this.submit.emit(this.submittedContactValue);
    }
  }

  private assignSmsResponse(responseObj) {
    this.smsBodyResponse = Object.assign({}, { hash: responseObj.hash });
    if (responseObj.urlValidationCode) {
      this.smsBodyResponse = Object.assign(this.smsBodyResponse, { urlValidationCode: responseObj.urlValidationCode });
    }
  }

  private cancelAction() {
    this.resetFormFields(this.control);
    this.submittedContactValue = {};

    this.chosenTypeFormOption = PoModalPasswordRecoveryType.Email;
    this.modalType = PoModalPasswordRecoveryModalContent.Email;
    this.type = this.modalPasswordRecoveryTypeAll ? PoModalPasswordRecoveryType.All : this.type;
    this.recoveryModalElement.close();
  }

  private checkFormType(type: PoModalPasswordRecoveryType) {
    return type !== PoModalPasswordRecoveryType.All ? type : PoModalPasswordRecoveryType.Email;
  }

  private formReset(control: AbstractControl) {
    control.markAsPristine();
    control.markAsUntouched();
    control.updateValueAndValidity();
  }

  private getEmitValue(type: PoModalPasswordRecoveryType) {
    return type === PoModalPasswordRecoveryType.SMS ? this.phone : this.email;
  }

  private incrementRetryAttempts() {
    this.submittedContactValue.retry = this.submittedContactValue.retry + 1 || 1;
  }

  private openExternalLink(url, queryParam) {
    window.open(`${url}?token=${queryParam}`, '_self');
  }

  private openInternalLink(url, endpoint, queryParam) {
    this.router.navigate([`${url}/${endpoint}`], { queryParams: { token: queryParam } });
  }

  private pipeModalPhrases() {
    if (this.type === PoModalPasswordRecoveryType.SMS) {
      this.emailModalPhrases.firstPhrase = this.setPipeArguments(
        this.literals.recoveryPasswordPhrase,
        this.literals.sms
      );
      this.emailModalPhrases.secondPhrase = this.setPipeArguments(
        this.literals.supportContact,
        this.literals.telephone
      );
    } else {
      this.emailModalPhrases.firstPhrase = this.setPipeArguments(
        this.literals.recoveryPasswordPhrase,
        this.literals.email
      );
      this.emailModalPhrases.secondPhrase = this.setPipeArguments(this.literals.supportContact, this.literals.email);
    }
  }

  private redirectToChangePassword(recoveryToken: PoModalPasswordRecovery) {
    const urlChangePassword = recoveryToken.urlChangePassword;
    if (urlChangePassword) {
      isExternalLink(urlChangePassword)
        ? this.openExternalLink(urlChangePassword, recoveryToken.token)
        : this.openInternalLink(this.urlRecovery, urlChangePassword, recoveryToken.token);
    } else {
      const changePasswordEndpoint = 'changePassword';
      this.openInternalLink(this.urlRecovery, changePasswordEndpoint, recoveryToken.token);
    }
  }

  private resetFormFields(control) {
    this.formReset(control);
    this.email = undefined;
    this.phone = undefined;
    this.smsCode = undefined;
  }

  private setActions(primaryAction, primarylabel, secondaryAction, secondaryLabel, disabled) {
    this.primaryAction.action = () => primaryAction.call(this);
    this.primaryAction.label = primarylabel;
    this.secondaryAction.action = () => secondaryAction.call(this);
    this.secondaryAction.label = secondaryLabel;
    this.primaryAction.disabled = disabled;
  }

  private setEmailModalPhrasesAndActions() {
    this.modalTitle = this.literals.forgotPasswordTitle;
    this.pipeModalPhrases();
    this.modalPasswordRecoveryTypeAll = this.type === PoModalPasswordRecoveryType.All;
    this.setActions(this.submitAction, this.literals.sendButton, this.cancelAction, this.literals.cancelButton, true);
  }

  private setRequestEndpoint(urlValidationCode?: string) {
    const endpoint = urlValidationCode || 'validation';

    return `${this.urlRecovery}/${endpoint}`;
  }

  private setPipeArguments(literalAttr: string, arg: string) {
    return this.poI18nPipe.transform(literalAttr, arg);
  }

  private submitAction() {
    this.modalType === PoModalPasswordRecoveryModalContent.Confirmation
      ? this.incrementRetryAttempts()
      : this.formReset(this.control);
    this.submittedContactValue[this.checkFormType(this.type)] = this.getEmitValue(this.type);
    if (this.urlRecovery) {
      this.submitActionRequest(this.submittedContactValue, this.type);
    } else {
      this.submit.emit(this.submittedContactValue);
    }
  }

  private submitActionRequest(data: PoModalPasswordRecovery, modalType: PoModalPasswordRecoveryType) {
    const params = modalType === PoModalPasswordRecoveryType.SMS ? { type: 'sms' } : undefined;

    this.passwordRecoverySubscription = this.poModalPasswordRecoveryService
      .post(this.urlRecovery, data, params)
      .subscribe(response => {
        if (
          (modalType === PoModalPasswordRecoveryType.Email || modalType === PoModalPasswordRecoveryType.All) &&
          response.status === 204
        ) {
          this.openConfirmation();
        } else if (modalType === PoModalPasswordRecoveryType.SMS && response.status === 200) {
          this.assignSmsResponse(response.body);
          this.openSmsCode();
        }
      });
  }

  private submitSmsCodeAction() {
    this.submittedCodeValue.code = this.smsCode;

    if (this.urlRecovery) {
      this.submittedCodeValue = Object.assign(this.submittedCodeValue, { hash: this.smsBodyResponse.hash });
      this.submitSmsCodeRequest(this.submittedCodeValue);
    } else {
      this.codeSubmit.emit(this.submittedCodeValue);
    }
    this.resetFormFields(this.control);
  }

  private submitSmsCodeRequest(data: PoModalPasswordRecovery) {
    this.smsCodeSubscription = this.poModalPasswordRecoveryService
      .post(this.setRequestEndpoint(this.smsBodyResponse.urlValidationCode), data)
      .subscribe(
        response => {
          const successStatus = response.status === 200;
          if (successStatus) {
            this.completed();
            this.redirectToChangePassword(response.body);
          }
        },
        error => {
          this.codeError = error.error.message;
          this.openSmsCode();
        }
      );
  }
}
