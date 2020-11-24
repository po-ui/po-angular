import { By } from '@angular/platform-browser';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { throwError } from 'rxjs';

import { PoFieldModule, PoI18nPipe, PoModalModule } from '@po-ui/ng-components';

import * as utilsFunctions from './../../utils/util';
import { getObservable } from './../../util-test/util-expect.spec';

import { PoModalPasswordRecoveryComponent } from './po-modal-password-recovery.component';
import { PoModalPasswordRecoveryErrorMessageComponent } from './po-modal-password-recovery-error-message/po-modal-password-recovery-error-message.component';
import { PoModalPasswordRecoveryModalContent } from './enums/po-modal-password-recovery-modal-content.enum';
import { PoModalPasswordRecoveryService } from './po-modal-password-recovery.service';
import { PoModalPasswordRecoveryType } from './enums/po-modal-password-recovery-type.enum';

describe('PoModalPasswordRecoveryComponent:', () => {
  let component: PoModalPasswordRecoveryComponent;
  let fixture: ComponentFixture<PoModalPasswordRecoveryComponent>;
  let debugElement;
  const fakeSubscription = <any>{ unsubscribe: () => {} };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, RouterTestingModule.withRoutes([]), PoFieldModule, PoModalModule],
        declarations: [PoModalPasswordRecoveryErrorMessageComponent, PoModalPasswordRecoveryComponent],
        providers: [PoI18nPipe, PoModalPasswordRecoveryService]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoModalPasswordRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component instanceof PoModalPasswordRecoveryComponent).toBeTruthy();
  });

  describe('Methods', () => {
    it('primaryAction: should call primaryAction.action ', () => {
      expect(component.primaryAction.action()).toBeUndefined();
      spyOn(component.primaryAction, 'action');
      component.primaryAction.action();
      expect(component.primaryAction.action).toHaveBeenCalled();
    });

    it('secondaryAction: should call secondaryAction.action ', () => {
      expect(component.secondaryAction.action()).toBeUndefined();
      spyOn(component.secondaryAction, 'action');
      component.secondaryAction.action();
      expect(component.secondaryAction.action).toHaveBeenCalled();
    });

    it('ngOnDestroy: should unsubscribe `passwordRecoverySubscription` on destroy', () => {
      component['passwordRecoverySubscription'] = fakeSubscription;

      spyOn(component['passwordRecoverySubscription'], <any>'unsubscribe');

      component.ngOnDestroy();

      expect(component['passwordRecoverySubscription'].unsubscribe).toHaveBeenCalled();
    });

    it('ngOnDestroy: should unsubscribe smsCodeSubscription` on destroy', () => {
      component['smsCodeSubscription'] = fakeSubscription;

      spyOn(component['smsCodeSubscription'], <any>'unsubscribe');

      component.ngOnDestroy();

      expect(component['smsCodeSubscription'].unsubscribe).toHaveBeenCalled();
    });

    it('open: should call checkFormType and set component.control', () => {
      const emailForm: any = {
        controls: {
          'email': 'email'
        }
      };
      component.emailForm = emailForm;
      component.type = PoModalPasswordRecoveryType.Email;

      spyOn(component, <any>'checkFormType').and.returnValue('email');
      spyOn(component, <any>'setEmailModalPhrasesAndActions');
      spyOn(component, <any>'formModelChangesCheck');
      spyOn(component.recoveryModalElement, 'open');

      component.open();

      expect(component['checkFormType']).toHaveBeenCalledWith(component.type);
      expect(component['control']).toBe(emailForm.controls.email);
    });

    it('open: should call setEmailModalPhrasesAndActions, recoveryModalElement.open and formModelChangesCheck', () => {
      component.recoveryModalElement = <any>{ open: () => {} };

      spyOn(component, <any>'setEmailModalPhrasesAndActions');
      spyOn(component, <any>'formModelChangesCheck');
      spyOn(component.recoveryModalElement, 'open');

      component.open();

      expect(component['setEmailModalPhrasesAndActions']).toHaveBeenCalled();
      expect(component.formModelChangesCheck).toHaveBeenCalled();
      expect(component.recoveryModalElement.open).toHaveBeenCalled();
    });

    it('completed: should call cancelAction', () => {
      spyOn(component, <any>'cancelAction');
      component.completed();
      expect(component['cancelAction']).toHaveBeenCalled();
    });

    it('formModelChangesCheck: `primaryAction.disabled` and `invalidEmail` should be `true`', () => {
      const emailForm: any = {
        dirty: true,
        invalid: true
      };
      component.emailForm = emailForm;

      component['formModelChangesCheck'](emailForm);

      expect(component.invalidEmail).toBe(true);
      expect(component.primaryAction.disabled).toBe(true);
    });

    it('formModelChangesCheck: `primaryAction.disabled` should be `true` and `invalidEmail` should be `false`', () => {
      const emailForm: any = {
        invalid: true,
        dirty: false
      };
      component.emailForm = emailForm;

      component['formModelChangesCheck'](emailForm);

      expect(component.invalidEmail).toBe(false);
      expect(component.primaryAction.disabled).toBe(true);
    });

    it('formModelChangesCheck: `emailPrimaryAction.disabled` and `invalidEmail` should be `false`', () => {
      const emailForm: any = {
        invalid: false,
        dirty: true
      };
      component.emailForm = emailForm;

      component['formModelChangesCheck'](emailForm);

      expect(component.invalidEmail).toBe(false);
      expect(component.primaryAction.disabled).toBe(false);
    });

    it(`formModelChangesCheck: should set showCustomCodeError with true if modalType is 'sms', codeError has value
      and smsCodeForm.pristine is true`, () => {
      const smsCodeForm: any = {
        pristine: true
      };

      component.showCustomCodeError = false;
      component.modalType = PoModalPasswordRecoveryModalContent.SMSCode;
      component.codeError = 'Error';
      component.smsCodeForm = smsCodeForm;

      component.formModelChangesCheck(smsCodeForm);

      expect(component.showCustomCodeError).toBe(true);
    });

    it(`formModelChangesCheck: should keep showCustomCodeError with false if modalType is 'email'`, () => {
      const smsCodeForm: any = {
        pristine: true
      };
      component.showCustomCodeError = false;
      component.modalType = PoModalPasswordRecoveryModalContent.Email;

      component.formModelChangesCheck(smsCodeForm);

      expect(component.showCustomCodeError).toBe(false);
    });

    it(`formModelChangesCheck: should set showCustomCodeError with false if modalType is 'sms'
      however codeError does not have value`, () => {
      const smsCodeForm: any = {
        pristine: true
      };

      component.showCustomCodeError = false;
      component.modalType = PoModalPasswordRecoveryModalContent.SMSCode;
      component.smsCodeForm = smsCodeForm;
      component.codeError = undefined;

      component.formModelChangesCheck(smsCodeForm);

      expect(component.showCustomCodeError).toBe(false);
    });

    it(`formModelChangesCheck: should set showCustomCodeError with false if modalType is 'sms'
      however smsCodeForm.pristine is false`, () => {
      const smsCodeForm: any = {
        pristine: false
      };

      component.showCustomCodeError = false;
      component.modalType = PoModalPasswordRecoveryModalContent.SMSCode;
      component.codeError = 'Error';
      component.smsCodeForm = smsCodeForm;

      component.formModelChangesCheck(smsCodeForm);

      expect(component.showCustomCodeError).toBe(false);
    });

    it('getInputType: should set type, control and call formModelChangesCheck and resetFormFields', fakeAsync(() => {
      const type = PoModalPasswordRecoveryType.Email;
      const emailForm: any = {
        controls: {
          'email': 'email'
        }
      };
      component.emailForm = emailForm;

      spyOn(component, <any>'pipeModalPhrases');
      spyOn(component, <any>'formModelChangesCheck');
      spyOn(component, <any>'resetFormFields');

      component.getInputType(type);
      tick();

      expect(component['pipeModalPhrases']).toHaveBeenCalled();
      expect(component.formModelChangesCheck).toHaveBeenCalledWith(component.emailForm);
      expect(component['resetFormFields']).toHaveBeenCalledWith(component['control']);
      expect(component['control']).toBe(emailForm.controls.email);
    }));

    it('openConfirmation: should set modalTitle, modalType and call setActions', () => {
      spyOn(component, <any>'setActions');

      component.openConfirmation();

      expect(component.modalTitle).toBe(component.literals.emailSentTitle);
      expect(component.modalType).toBe(PoModalPasswordRecoveryModalContent.Confirmation);
      expect(component['setActions']).toHaveBeenCalledWith(
        component['cancelAction'],
        component.literals.closeButton,
        component['submitAction'],
        component.literals.resendEmailButton,
        false
      );
    });

    it('openSmsCode: should set modalTitle, modalType and call setActions', fakeAsync(() => {
      component.modalType = PoModalPasswordRecoveryModalContent.SMSCode;
      const smsCodeForm: any = {
        controls: {
          'sms': 'sms'
        }
      };
      component.smsCodeForm = smsCodeForm;
      spyOn(component, <any>'setActions');
      spyOn(component, <any>'formModelChangesCheck');

      component.openSmsCode();
      fixture.detectChanges();

      tick();

      expect(component.modalTitle).toBe(component.literals.typeCodeTitle);
      expect(component.modalType).toBe(PoModalPasswordRecoveryModalContent.SMSCode);
      expect(component['setActions']).toHaveBeenCalledWith(
        component['submitSmsCodeAction'],
        component.literals.continueButton,
        component['cancelAction'],
        component.literals.cancelButton,
        true
      );
      expect(component.formModelChangesCheck).toHaveBeenCalledWith(component.smsCodeForm);
    }));

    it('resendSmsCode: should call incrementRetryAttempts and emit submit if urlRecovery is undefined', () => {
      component.submittedContactValue = {};

      spyOn(component, <any>'incrementRetryAttempts');
      spyOn(component.submit, 'emit');

      component.resendSmsCode();

      expect(component.submit.emit).toHaveBeenCalledWith(component.submittedContactValue);
      expect(component['incrementRetryAttempts']).toHaveBeenCalled();
    });

    it('resendSmsCode: should call incrementRetryAttempts and submitActionRequest if urlRecovery contains value', () => {
      component.submittedContactValue = { 'sms': '999', retry: 1 };
      component.urlRecovery = 'url';
      component.type = PoModalPasswordRecoveryType.SMS;

      spyOn(component, <any>'incrementRetryAttempts');
      spyOn(component, <any>'submitActionRequest');

      component.resendSmsCode();

      expect(component['incrementRetryAttempts']).toHaveBeenCalled();
      expect(component['submitActionRequest']).toHaveBeenCalledWith(component.submittedContactValue, component.type);
    });

    it('cancelAction: should call resetFormFields and recoveryModalElement.close', () => {
      component.recoveryModalElement = <any>{ close: () => {} };

      spyOn(component, <any>'resetFormFields');
      spyOn(component.recoveryModalElement, 'close');

      component['cancelAction']();

      expect(component['resetFormFields']).toHaveBeenCalledWith(component['control']);
      expect(component.recoveryModalElement.close).toHaveBeenCalled();
    });

    it('cancelAction: should set values to chosenTypeFormOption, chosenTypeFormOption and modalType,   ', () => {
      component.recoveryModalElement = <any>{ close: () => {} };
      component.submittedContactValue = { 'email': 'value' };

      spyOn(component, <any>'resetFormFields');
      spyOn(component.recoveryModalElement, 'close');

      component['cancelAction']();

      expect(component.submittedContactValue).toEqual({});
      expect(component.chosenTypeFormOption).toBe(PoModalPasswordRecoveryType.Email);
      expect(component.modalType).toBe(PoModalPasswordRecoveryModalContent.Email);
    });

    it('cancelAction: should keep `type` value with `all` if it`s value is `all`', () => {
      component.type = PoModalPasswordRecoveryType.All;

      spyOn(component, <any>'resetFormFields');
      spyOn(component.recoveryModalElement, 'close');

      component['cancelAction']();

      expect(component.type).toBe(PoModalPasswordRecoveryType.All);
    });

    it('cancelAction: should set `type` with PoModalPasswordRecoveryType.All', () => {
      component.modalPasswordRecoveryTypeAll = true;

      spyOn(component, <any>'resetFormFields');
      spyOn(component.recoveryModalElement, 'close');

      component['cancelAction']();

      expect(component.type).toBe(PoModalPasswordRecoveryType.All);
    });

    it('cancelAction: should return `type` with it`s own value', () => {
      component.modalPasswordRecoveryTypeAll = false;

      spyOn(component, <any>'resetFormFields');
      spyOn(component.recoveryModalElement, 'close');

      component['cancelAction']();

      expect(component.type).toBe(component.type);
    });

    it('checkFormType: should return type value if type is different from `all`', () => {
      component.type = PoModalPasswordRecoveryType.All;
      const expectedResult = component['checkFormType'](component.type);

      expect(expectedResult).toBe(PoModalPasswordRecoveryType.Email);
    });

    it('checkFormType: should return `email` if type value is equal `all`', () => {
      component.type = PoModalPasswordRecoveryType.SMS;
      const expectedResult = component['checkFormType'](component.type);

      expect(expectedResult).toBe(PoModalPasswordRecoveryType.SMS);
    });

    it('getEmitValue: should return phone value if type is `sms`', () => {
      component.type = PoModalPasswordRecoveryType.SMS;
      component.phone = 'phone';
      const expectedResult = component['getEmitValue'](component.type);

      expect(expectedResult).toBe(component.phone);
    });

    it('getEmitValue: should return email value if type is different from `sms`', () => {
      component.type = PoModalPasswordRecoveryType.Email;
      component.phone = 'phone';
      const expectedResult = component['getEmitValue'](component.type);

      expect(expectedResult).toBe(component.email);
    });

    it('formReset: should call markAsPristine, markAsUntouched and updateValueAndValidity', () => {
      const fakeControl = {
        markAsPristine: () => {},
        markAsUntouched: () => {},
        updateValueAndValidity: () => {}
      };

      component.emailForm = <any>{ controls: { email: 'email' } };
      component.emailModal = true;

      spyOn(fakeControl, 'markAsPristine');
      spyOn(fakeControl, 'markAsUntouched');
      spyOn(fakeControl, 'updateValueAndValidity');

      component.recoveryModalElement.open();
      component['formReset'](<any>fakeControl);

      expect(fakeControl.markAsPristine).toHaveBeenCalled();
      expect(fakeControl.markAsUntouched).toHaveBeenCalled();
      expect(fakeControl.updateValueAndValidity).toHaveBeenCalled();
    });

    it('incrementRetryAttempts: should increment submittedContactValue.retry value', () => {
      component.submittedContactValue.retry = 1;

      component['incrementRetryAttempts']();

      expect(component.submittedContactValue.retry).toBe(2);
    });

    it('incrementRetryAttempts: should set submittedContactValue.retry with 1 if it`s not defined yet', () => {
      component.submittedContactValue.retry = undefined;

      component['incrementRetryAttempts']();

      expect(component.submittedContactValue.retry).toBe(1);
    });

    it('pipeModalPhrases: should call setPipeArguments twice if type is `all`', () => {
      component.type = PoModalPasswordRecoveryType.All;
      component.emailForm = <any>{ form: { controls: { login: { hasError: () => {} } } } };

      spyOn(component, <any>'setPipeArguments');

      component['pipeModalPhrases']();

      expect(component['setPipeArguments']).toHaveBeenCalledTimes(2);
    });

    it('pipeModalPhrases: should call setPipeArguments twice if type is `email`', () => {
      component.emailForm = <any>{ form: { controls: { login: { hasError: () => {} } } } };
      component.type = PoModalPasswordRecoveryType.Email;

      spyOn(component, <any>'setPipeArguments');

      component['pipeModalPhrases']();

      expect(component['setPipeArguments']).toHaveBeenCalledTimes(2);
    });

    it('pipeModalPhrases: should call setPipeArguments twice if type is `sms`', () => {
      component.smsCodeForm = <any>{ form: { controls: { login: { hasError: () => {} } } } };
      component.type = PoModalPasswordRecoveryType.SMS;

      spyOn(component, <any>'setPipeArguments');

      component['pipeModalPhrases']();

      expect(component['setPipeArguments']).toHaveBeenCalledTimes(2);
    });

    it('resetFormFields: should set email, phone and smsCode with undefined and call formReset', () => {
      component.phone = 'phone';
      component.email = 'email';
      component.smsCode = 'smsCode';
      const control = {};

      spyOn(component, <any>'formReset');

      component['resetFormFields'](control);

      expect(component['formReset']).toHaveBeenCalledWith(<any>control);
    });

    it('setActions: should set the modal buttons actions and labels', () => {
      const fakeThis = {
        primaryAction: jasmine.any(Function),
        primarylabel: '',
        secondaryAction: jasmine.any(Function),
        secondaryLabel: '',
        disabled: true
      };

      component['setActions'](
        fakeThis.primaryAction,
        fakeThis.primarylabel,
        fakeThis.secondaryAction,
        fakeThis.secondaryLabel,
        fakeThis.disabled
      );

      expect(component.primaryAction.label).toBe(fakeThis.primarylabel);
      expect(component.secondaryAction.label).toBe(fakeThis.secondaryLabel);
      expect(component.primaryAction.disabled).toBe(fakeThis.disabled);
      expect(component.primaryAction.action).toEqual(fakeThis.primaryAction);
      expect(component.secondaryAction.action).toEqual(fakeThis.secondaryAction);
    });

    it('setAction: should call primaryAction.action and secondaryAction.action', () => {
      const fakeThis = {
        primaryAction: () => {},
        primarylabel: '',
        secondaryAction: () => {},
        secondaryLabel: '',
        disabled: true
      };

      spyOn(fakeThis, 'primaryAction');
      spyOn(fakeThis, 'secondaryAction');

      component['setActions'](
        fakeThis.primaryAction,
        fakeThis.primarylabel,
        fakeThis.secondaryAction,
        fakeThis.secondaryLabel,
        fakeThis.disabled
      );

      component.primaryAction.action();
      component.secondaryAction.action();

      expect(fakeThis.primaryAction).toHaveBeenCalled();
      expect(fakeThis.secondaryAction).toHaveBeenCalled();
    });

    it('setEmailModalPhrasesAndActions: should set modalTitle and call pipeModalPhrases and setActions', () => {
      component.emailForm = <any>{ form: { controls: { login: { hasError: () => {} } } } };
      component.type = PoModalPasswordRecoveryType.Email;

      spyOn(component, <any>'pipeModalPhrases');
      spyOn(component, <any>'setActions');

      component['setEmailModalPhrasesAndActions']();

      expect(component.modalTitle).toBe(component.literals.forgotPasswordTitle);
      expect(component['pipeModalPhrases']).toHaveBeenCalled();
      expect(component['setActions']).toHaveBeenCalled();
    });

    it('setEmailModalPhrasesAndActions: modalPasswordRecoveryTypeAll should be true if type value is equal `all` ', () => {
      component.emailForm = <any>{ form: { controls: { login: { hasError: () => {} } } } };
      component.type = PoModalPasswordRecoveryType.All;

      spyOn(component, <any>'pipeModalPhrases');
      spyOn(component, <any>'setActions');

      component['setEmailModalPhrasesAndActions']();

      expect(component.modalPasswordRecoveryTypeAll).toBe(true);
    });

    it('setEmailModalPhrasesAndActions: modalPasswordRecoveryTypeAll should be false if type value is different from `all` ', () => {
      component.emailForm = <any>{ form: { controls: { login: { hasError: () => {} } } } };
      component.type = PoModalPasswordRecoveryType.Email;

      spyOn(component, <any>'pipeModalPhrases');
      spyOn(component, <any>'setActions');

      component['setEmailModalPhrasesAndActions']();

      expect(component.modalPasswordRecoveryTypeAll).toBe(false);
    });

    it('setPipeArguments: should call `poI18nPipe.transform`', () => {
      const arg = '';
      const literalAttr = '';

      spyOn(component['poI18nPipe'], 'transform').and.callThrough();

      component['setPipeArguments'](literalAttr, arg);

      expect(component['poI18nPipe'].transform).toHaveBeenCalled();
    });

    it('assignSmsResponse: should assign a `smsBodyResponse` containing the property hash', () => {
      const responseObj = { hash: 'hash' };

      component['assignSmsResponse'](responseObj);

      expect(component['smsBodyResponse']).toEqual({ hash: 'hash' });
    });

    it('assignSmsResponse: should assign a `smsBodyResponse` containing the properties hash and urlValidationCode', () => {
      const responseObj = { hash: 'hash', urlValidationCode: 'urlValidationCode' };

      component['assignSmsResponse'](responseObj);

      expect(component['smsBodyResponse']).toEqual({ hash: 'hash', urlValidationCode: 'urlValidationCode' });
    });

    it(`redirectToChangePassword: should call 'openExternalLink' passing urlChangePassword and token as parameters if
    the redirectToChangePassword method param contains urlChangePassword property`, () => {
      const recoveryToken = { token: 'xpto', urlChangePassword: 'http://www.page.com.br/endpoint' };

      spyOn(utilsFunctions, 'isExternalLink').and.returnValue(true);
      spyOn(component, <any>'openExternalLink');
      spyOn(component, <any>'openInternalLink');

      component['redirectToChangePassword'](recoveryToken);

      expect(component['openExternalLink']).toHaveBeenCalledWith(recoveryToken.urlChangePassword, recoveryToken.token);
      expect(component['openInternalLink']).not.toHaveBeenCalled();
    });

    it(`redirectToChangePassword: should call 'openInternalLink' passing urlRecovery, urlChangePassword and token as parameters if
    the redirectToChangePassword method param contains urlChangePassword property`, () => {
      const recoveryToken = { token: 'xpto', urlChangePassword: 'endpoint' };
      component.urlRecovery = 'http://www.page.com.br';

      spyOn(utilsFunctions, 'isExternalLink').and.returnValue(false);
      spyOn(component, <any>'openExternalLink');
      spyOn(component, <any>'openInternalLink');

      component['redirectToChangePassword'](recoveryToken);

      expect(component['openInternalLink']).toHaveBeenCalledWith(
        component.urlRecovery,
        recoveryToken.urlChangePassword,
        recoveryToken.token
      );
      expect(component['openExternalLink']).not.toHaveBeenCalled();
    });

    it(`redirectToChangePassword: should call 'openInternalLink' passing urlRecovery, 'changePassword'
    and token as parameters if the redirectToChangePassword method param does not contain urlChangePassword property`, () => {
      const recoveryToken = { token: 'xpto' };
      component.urlRecovery = 'http://www.page.com.br';

      spyOn(component, <any>'openInternalLink');

      component['redirectToChangePassword'](recoveryToken);

      expect(component['openInternalLink']).toHaveBeenCalledWith(
        component.urlRecovery,
        'changePassword',
        recoveryToken.token
      );
    });

    it('openExternalLink: should call `window.open`', () => {
      spyOn(window, 'open');

      component['openExternalLink']('http://page.com.br', 'param');

      expect(window.open).toHaveBeenCalled();
    });

    it('openInternalLink: should call `router.navigate`', () => {
      spyOn(component['router'], <any>'navigate');

      component['openInternalLink']('http://page.com.br', '/endpoint', 'param');

      expect(component['router'].navigate).toHaveBeenCalled();
    });

    it('setRequestEndpoint: concatenate urlRecovery with the received param', () => {
      const urlValidationCode = 'urlValidationCode';
      component.urlRecovery = 'www.urlRecovery.com';

      const expectedResult = component['setRequestEndpoint'](urlValidationCode);

      expect(expectedResult).toBe(`${component.urlRecovery}/${urlValidationCode}`);
    });

    it('setRequestEndpoint: concatenate urlRecovery with `validation` if doesn`t have param', () => {
      const urlValidationCode = 'validation';
      component.urlRecovery = 'www.urlRecovery.com';

      const expectedResult = component['setRequestEndpoint']();

      expect(expectedResult).toBe(`${component.urlRecovery}/${urlValidationCode}`);
    });

    it('submitAction: should call incrementRetryAttempts if modalType value is confirmation', () => {
      component.modalType = PoModalPasswordRecoveryModalContent.Confirmation;

      spyOn(component, <any>'incrementRetryAttempts');
      spyOn(component, <any>'formReset');
      spyOn(component.submit, 'emit');

      component['submitAction']();

      expect(component['formReset']).not.toHaveBeenCalled();
      expect(component['incrementRetryAttempts']).toHaveBeenCalled();
    });

    it('submitAction: should: should call formReset if modalType value is different from confirmation', () => {
      component.modalType = PoModalPasswordRecoveryModalContent.Email;

      spyOn(component, <any>'incrementRetryAttempts');
      spyOn(component, <any>'formReset');
      spyOn(component.submit, 'emit');

      component['submitAction']();

      expect(component['formReset']).toHaveBeenCalled();
      expect(component['incrementRetryAttempts']).not.toHaveBeenCalled();
    });

    it('submitAction: should: should set submittedContactValue', () => {
      component.type = PoModalPasswordRecoveryType.Email;

      spyOn(component, <any>'formReset');
      spyOn(component, <any>'checkFormType').and.returnValue(PoModalPasswordRecoveryType.Email);
      spyOn(component, <any>'getEmitValue');
      spyOn(component.submit, 'emit');

      component['submitAction']();

      expect(component['checkFormType']).toHaveBeenCalledWith(component.type);
      expect(component['getEmitValue']).toHaveBeenCalledWith(component.type);
    });

    it('submitAction: should call `submitActionRequest` if urlRecovery contains value', () => {
      component.modalType = PoModalPasswordRecoveryModalContent.Email;
      component.type = PoModalPasswordRecoveryType.Email;
      component.urlRecovery = 'urlRecovery';

      spyOn(component, <any>'formReset');
      spyOn(component, <any>'submitActionRequest');
      spyOn(component.submit, 'emit');

      component['submitAction']();

      expect(component['submitActionRequest']).toHaveBeenCalledWith(component.submittedContactValue, component.type);
      expect(component.submit.emit).not.toHaveBeenCalled();
    });

    it('submitAction: should call `submit.emit` if urlRecovery does not contain a value', () => {
      component.modalType = PoModalPasswordRecoveryModalContent.Email;
      component.type = PoModalPasswordRecoveryType.Email;
      component.urlRecovery = undefined;

      spyOn(component, <any>'formReset');
      spyOn(component, <any>'submitActionRequest');
      spyOn(component.submit, 'emit');

      component['submitAction']();

      expect(component.submit.emit).toHaveBeenCalledWith(component.submittedContactValue);
      expect(component['submitActionRequest']).not.toHaveBeenCalled();
    });

    it(`submitActionRequest: should call poModalPasswordRecoveryService.post passing urlRecovery and data as params`, fakeAsync(() => {
      component.type = PoModalPasswordRecoveryType.Email;
      component.urlRecovery = 'urlRecovery';
      const data = { 'email': 'email@email.com' };
      const response = { status: 204 };
      const params = undefined;

      spyOn(component['poModalPasswordRecoveryService'], 'post').and.returnValue(getObservable(response));

      component['submitActionRequest'](data, component.type);
      tick();

      expect(component['poModalPasswordRecoveryService'].post).toHaveBeenCalledWith(
        component.urlRecovery,
        data,
        params
      );
    }));

    it(`submitActionRequest: should call poModalPasswordRecoveryService.post passing
    urlRecovery, data and queryParam 'sms' as parameters`, fakeAsync(() => {
      component.type = PoModalPasswordRecoveryType.SMS;
      component.urlRecovery = 'urlRecovery';
      const data = { 'email': 'email@email.com' };
      const response = { status: 204 };
      const params = { type: 'sms' };

      spyOn(component['poModalPasswordRecoveryService'], 'post').and.returnValue(getObservable(response));

      component['submitActionRequest'](data, component.type);
      tick();

      expect(component['poModalPasswordRecoveryService'].post).toHaveBeenCalledWith(
        component.urlRecovery,
        data,
        params
      );
    }));

    it('submitActionRequest: should call `openConfirmation` if response.status is `204` and type is `email`', fakeAsync(() => {
      const data = { 'email': 'email@email.com' };
      const response = { status: 204 };
      component.type = PoModalPasswordRecoveryType.Email;

      spyOn(component['poModalPasswordRecoveryService'], 'post').and.returnValue(getObservable(response));
      spyOn(component, 'openConfirmation');

      component['submitActionRequest'](data, component.type);
      tick();

      expect(component.openConfirmation).toHaveBeenCalled();
    }));

    it('submitActionRequest: shouldn`t call `openConfirmation` if response.status is different from `204`', fakeAsync(() => {
      const data = { 'email': 'email@email.com' };
      const response = { status: 200 };
      component.type = PoModalPasswordRecoveryType.Email;

      spyOn(component['poModalPasswordRecoveryService'], 'post').and.returnValue(getObservable(response));
      spyOn(component, 'openConfirmation');

      component['submitActionRequest'](data, component.type);
      tick();

      expect(component.openConfirmation).not.toHaveBeenCalled();
    }));

    it('submitActionRequest: shouldn`t call `openConfirmation` if type is not `email`', fakeAsync(() => {
      const data = { 'email': 'email@email.com' };
      const response = { status: 204 };
      component.type = PoModalPasswordRecoveryType.SMS;

      spyOn(component['poModalPasswordRecoveryService'], 'post').and.returnValue(getObservable(response));
      spyOn(component, 'openConfirmation');

      component['submitActionRequest'](data, component.type);
      tick();

      expect(component.openConfirmation).not.toHaveBeenCalled();
    }));

    it(`submitActionRequest: should call 'assignSmsResponse' and 'openSmsCode'
    if response.status is '200' and type is 'sms'`, fakeAsync(() => {
      const data = { 'email': 'email@email.com' };
      const response = { status: 200, body: {} };
      component.type = PoModalPasswordRecoveryType.SMS;

      spyOn(component['poModalPasswordRecoveryService'], 'post').and.returnValue(getObservable(response));
      spyOn(component, <any>'assignSmsResponse');
      spyOn(component, 'openSmsCode');

      component['submitActionRequest'](data, component.type);
      tick();

      expect(component['assignSmsResponse']).toHaveBeenCalledWith(response.body);
      expect(component.openSmsCode).toHaveBeenCalled();
    }));

    it(`submitActionRequest: shouldn't call 'assignSmsResponse' and 'openSmsCode'
    if response.status is different from '200'`, fakeAsync(() => {
      const data = { 'email': 'email@email.com' };
      const response = { status: 300, body: {} };
      component.type = PoModalPasswordRecoveryType.SMS;

      spyOn(component['poModalPasswordRecoveryService'], 'post').and.returnValue(getObservable(response));
      spyOn(component, <any>'assignSmsResponse');
      spyOn(component, 'openSmsCode');

      component['submitActionRequest'](data, component.type);
      tick();

      expect(component['assignSmsResponse']).not.toHaveBeenCalled();
      expect(component.openSmsCode).not.toHaveBeenCalled();
    }));

    it(`submitActionRequest: shouldn't call 'assignSmsResponse' and 'openSmsCode'
    if type is different from 'SMS'`, fakeAsync(() => {
      const data = { 'email': 'email@email.com' };
      const response = { status: 200, body: {} };
      component.type = PoModalPasswordRecoveryType.Email;

      spyOn(component['poModalPasswordRecoveryService'], 'post').and.returnValue(getObservable(response));
      spyOn(component, <any>'assignSmsResponse');
      spyOn(component, 'openSmsCode');

      component['submitActionRequest'](data, component.type);
      tick();

      expect(component['assignSmsResponse']).not.toHaveBeenCalled();
      expect(component.openSmsCode).not.toHaveBeenCalled();
    }));

    it('submitSmsCodeAction: should call `resetFields`', () => {
      component.smsCode = '123456';
      component['smsBodyResponse'] = { 'hash': 'xpto' };

      spyOn(component, <any>'resetFormFields');
      spyOn(component.codeSubmit, 'emit');

      component['submitSmsCodeAction']();

      expect(component['resetFormFields']).toHaveBeenCalledWith(component['control']);
    });

    it('submitSmsCodeAction: should set submittedCodeValue and call `submitSmsCodeRequest` if urlRecovery contains value', () => {
      component.submittedCodeValue = {};
      component.urlRecovery = 'url';
      component['smsBodyResponse'] = { 'hash': 'xpto' };
      const expectedSubmittedCodeValue = { 'code': component.smsCode, 'hash': component['smsBodyResponse'].hash };

      spyOn(component, <any>'resetFormFields');
      spyOn(component, <any>'submitSmsCodeRequest');
      spyOn(component.codeSubmit, 'emit');

      component['submitSmsCodeAction']();

      expect(component.submittedCodeValue).toEqual(expectedSubmittedCodeValue);
      expect(component['submitSmsCodeRequest']).toHaveBeenCalledWith(component.submittedCodeValue);
      expect(component.codeSubmit.emit).not.toHaveBeenCalled();
    });

    it('submitSmsCodeAction: should call `codeSubmit.emit` if urlRecovery does not contain a value', () => {
      component.submittedCodeValue = {};
      component.urlRecovery = undefined;
      component['smsBodyResponse'] = { 'hash': 'xpto' };

      spyOn(component, <any>'resetFormFields');
      spyOn(component, <any>'submitSmsCodeRequest');
      spyOn(component.codeSubmit, 'emit');

      component['submitSmsCodeAction']();

      expect(component['submitSmsCodeRequest']).not.toHaveBeenCalled();
      expect(component.codeSubmit.emit).toHaveBeenCalledWith(component.submittedCodeValue);
    });

    it('submitSmsCodeRequest: should call `completed` and `redirectToChangePassword` if response.status is 200', fakeAsync(() => {
      const data = { 'code': '119812', 'hash': 'xpto:111111' };
      const response = { status: 200, body: {} };
      component['smsBodyResponse'] = { 'hash': 'xpto', 'urlValidationCode': 'url' };

      spyOn(component, <any>'setRequestEndpoint').and.returnValue('url/route');
      spyOn(component['poModalPasswordRecoveryService'], 'post').and.returnValue(getObservable(response));
      spyOn(component, 'completed');
      spyOn(component, <any>'redirectToChangePassword');
      spyOn(component, <any>'openSmsCode');

      component['submitSmsCodeRequest'](data);
      tick();

      expect(component['setRequestEndpoint']).toHaveBeenCalled();
      expect(component.completed).toHaveBeenCalled();
      expect(component['redirectToChangePassword']).toHaveBeenCalledWith(response.body);
      expect(component.openSmsCode).not.toHaveBeenCalled();
    }));

    it('submitSmsCodeRequest: shouldn`t call `completed` and `redirectToChangePassword` if response.status isn`t 200', fakeAsync(() => {
      const data = { 'code': '119812', 'hash': 'xpto:111111' };
      const response = { status: 400, body: {} };
      component['smsBodyResponse'] = { 'hash': 'xpto', 'urlValidationCode': 'url' };

      spyOn(component, <any>'setRequestEndpoint').and.returnValue('url/route');
      spyOn(component['poModalPasswordRecoveryService'], 'post').and.returnValue(getObservable(response));
      spyOn(component, 'completed');
      spyOn(component, <any>'redirectToChangePassword');
      spyOn(component, <any>'openSmsCode');

      component['submitSmsCodeRequest'](data);
      tick();

      expect(component.completed).not.toHaveBeenCalled();
      expect(component['redirectToChangePassword']).not.toHaveBeenCalled();
      expect(component.openSmsCode).not.toHaveBeenCalled();
    }));

    it('submitSmsCodeRequest: should call `openSmsCode and set codeError if response is an error', fakeAsync(() => {
      const data = { 'code': '119812', 'hash': 'xpto:111111' };
      const error = { 'error': { 'message': 'message' } };
      component['smsBodyResponse'] = { 'hash': 'xpto', 'urlValidationCode': 'url' };

      spyOn(component, 'openSmsCode');
      spyOn(component, <any>'setRequestEndpoint').and.returnValue('route/url');
      spyOn(component['poModalPasswordRecoveryService'], 'post').and.returnValue(throwError(error));

      component['submitSmsCodeRequest'](data);

      expect(component.codeError).toEqual(error.error.message);
      expect(component.openSmsCode).toHaveBeenCalled();
    }));
  });

  describe('Templates', () => {
    it('should contain `po-modal-password-recovery-link` class if `contactEmail` has a value', () => {
      component.contactEmail = 'email';

      component.recoveryModalElement.open();
      fixture.detectChanges();

      expect(debugElement.querySelector('.po-modal-password-recovery-link')).toBeTruthy();
    });

    it('shouldn`t contain `po-modal-password-recovery-link` class if `contactEmail` is undefined', () => {
      component.contactEmail = undefined;

      component.recoveryModalElement.open();
      fixture.detectChanges();

      expect(debugElement.querySelector('.po-modal-password-recovery-link')).toBeFalsy();
    });

    it('should show `email/sms` fields content if modalType value is `Email`', () => {
      component.emailModalPhrases.firstPhrase = 'Phrase';
      component.modalType = PoModalPasswordRecoveryModalContent.Email;
      component.type = PoModalPasswordRecoveryType.All;

      component.recoveryModalElement.open();
      fixture.detectChanges();

      const expectedContent = fixture.debugElement.query(By.css('.po-modal-password-recovery-text')).nativeElement;

      expect(expectedContent.innerHTML).toContain(component.emailModalPhrases.firstPhrase);
      expect(expectedContent.innerHTML).not.toContain(component.literals.sentSmsCodePhrase);
      expect(expectedContent.innerHTML).not.toContain(component.literals.emailSentConfirmationPhrase);
    });

    it('should show `smsCode` field content if modalType value is `SMSCode`', () => {
      component.emailModalPhrases.firstPhrase = 'Phrase';

      component.modalType = PoModalPasswordRecoveryModalContent.SMSCode;
      component.type = PoModalPasswordRecoveryType.Email;

      component.recoveryModalElement.open();
      fixture.detectChanges();

      const expectedContent = fixture.debugElement.query(By.css('.po-modal-password-recovery-text')).nativeElement;

      expect(expectedContent.innerHTML).toContain(component.literals.sentSmsCodePhrase);
      expect(expectedContent.innerHTML).not.toContain(component.emailModalPhrases.firstPhrase);
      expect(expectedContent.innerHTML).not.toContain(component.literals.emailSentConfirmationPhrase);
    });

    it('should show `smsCode` field content if modalType value is `Confirmation`', () => {
      component.emailModalPhrases.firstPhrase = 'Phrase';
      component.modalType = PoModalPasswordRecoveryModalContent.Confirmation;
      component.type = PoModalPasswordRecoveryType.Email;

      component.recoveryModalElement.open();
      fixture.detectChanges();

      const expectedContent = fixture.debugElement.query(By.css('.po-modal-password-recovery-text')).nativeElement;

      expect(expectedContent.innerHTML).toContain(component.literals.emailSentConfirmationPhrase);
      expect(expectedContent.innerHTML).not.toContain(component.literals.sentSmsCodePhrase);
      expect(expectedContent.innerHTML).not.toContain(component.emailModalPhrases.firstPhrase);
    });

    it('should contain `po-field-container-error-text` class if `invalidEmail` and control are true', () => {
      component.control = <any>{
        dirty: true
      };
      component.invalidEmail = true;

      component.recoveryModalElement.open();
      fixture.detectChanges();

      expect(debugElement.querySelector('.po-field-container-error-text')).toBeTruthy();
    });

    it('shouldn`t contain `po-field-container-error-text` class if `invalidEmail` is false', () => {
      component.control = <any>{
        dirty: true
      };
      component.invalidEmail = false;

      component.recoveryModalElement.open();
      fixture.detectChanges();

      expect(debugElement.querySelector('.po-field-container-error-text')).toBeFalsy();
    });

    it('shouldn`t contain `po-field-container-error-text` class if `showCustomCodeError` is false', () => {
      component.modalType = PoModalPasswordRecoveryModalContent.SMSCode;
      component.type = PoModalPasswordRecoveryType.Email;
      component.showCustomCodeError = false;

      component.recoveryModalElement.open();
      fixture.detectChanges();

      expect(debugElement.querySelector('.po-field-container-error-text')).toBeFalsy();
    });

    it('should contain `po-field-container-error-text` class if `showCustomCodeError` is true', () => {
      component.modalType = PoModalPasswordRecoveryModalContent.SMSCode;
      component.type = PoModalPasswordRecoveryType.Email;
      component.showCustomCodeError = true;

      component.recoveryModalElement.open();
      fixture.detectChanges();

      expect(debugElement.querySelector('.po-field-container-error-text')).toBeTruthy();
    });
  });
});
