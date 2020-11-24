import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { PoModule } from '@po-ui/ng-components';

import * as utilsFunctions from './../../utils/util';
import { getObservable } from './../../util-test/util-expect.spec';
import { of } from 'rxjs';

import { PoModalPasswordRecoveryComponent } from '../po-modal-password-recovery/po-modal-password-recovery.component';
import { PoModalPasswordRecoveryType } from '../po-modal-password-recovery/enums/po-modal-password-recovery-type.enum';
import { PoPageChangePasswordComponent } from './po-page-change-password.component';
import { PoPageChangePasswordService } from './po-page-change-password.service';
import { PoPageBackgroundModule } from '../po-page-background/index';

describe('PoPageChangePasswordComponent:', () => {
  let component: PoPageChangePasswordComponent;
  let fixture: ComponentFixture<PoPageChangePasswordComponent>;
  let nativeElement: any;
  const fakeSubscription = <any>{ unsubscribe: () => {} };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, RouterTestingModule.withRoutes([]), PoModule, PoPageBackgroundModule],
        declarations: [PoPageChangePasswordComponent],
        providers: [HttpClient, HttpHandler, PoPageChangePasswordService]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('ngAfterViewInit: should call `subscribeToTokenParameter` if `urlNewPassword` has value', () => {
      component.urlNewPassword = '/home';

      spyOn(component, <any>'subscribeToTokenParameter');

      component.ngAfterViewInit();

      expect(component['subscribeToTokenParameter']).toHaveBeenCalled();
    });

    it('ngAfterViewInit: shouldn`t call `subscribeToTokenParameter` if `urlNewPassword` is undefined', () => {
      component.urlNewPassword = undefined;

      spyOn(component, <any>'subscribeToTokenParameter');

      component.ngAfterViewInit();

      expect(component['subscribeToTokenParameter']).not.toHaveBeenCalled();
    });

    it('ngOnDestroy: should unsubscribe `newPasswordSubscription` on destroy', () => {
      component['newPasswordSubscription'] = fakeSubscription;

      spyOn(component['newPasswordSubscription'], <any>'unsubscribe');

      component.ngOnDestroy();

      expect(component['newPasswordSubscription'].unsubscribe).toHaveBeenCalled();
    });

    it('ngOnInit: should call checkingForRouteMetadata', () => {
      const activatedRoute = { snapshot: { data: {} } };
      spyOn(component, <any>'checkingForRouteMetadata');
      component.ngOnInit();
      expect(component['checkingForRouteMetadata']).toHaveBeenCalledWith(activatedRoute.snapshot.data);
    });

    it('navigateTo: should call `window.open` if is `externalLink`', () => {
      component.urlBack = '/people';

      spyOn(utilsFunctions, 'isExternalLink').and.returnValue(true);
      spyOn(component['router'], <any>'navigate');
      spyOn(window, 'open');

      component.navigateTo('http://www.po-ui.com');

      expect(component['router'].navigate).not.toHaveBeenCalled();
      expect(window.open).toHaveBeenCalledWith('http://www.po-ui.com');
    });

    it('navigateTo: should call `router.navigate` if is `internalLink`', () => {
      component.urlBack = '/people';

      spyOn(utilsFunctions, 'isExternalLink').and.returnValue(false);
      spyOn(component['router'], <any>'navigate');
      spyOn(window, 'open');

      component.navigateTo('/po');

      expect(component['router'].navigate).toHaveBeenCalledWith(['/po']);
      expect(window.open).not.toHaveBeenCalled();
    });

    it('navigateTo: should call `router.navigate` with `` if is `internalLink` and url is not defined', () => {
      component.urlBack = '';

      spyOn(utilsFunctions, 'isExternalLink').and.returnValue(false);
      spyOn(component['router'], <any>'navigate');
      spyOn(window, 'open');

      component.navigateTo(undefined);

      expect(component['router'].navigate).toHaveBeenCalledWith(['/']);
      expect(window.open).not.toHaveBeenCalled();
    });

    describe('onLoginSubmit: ', () => {
      it('should call `emitSubmit` if has `submit`', () => {
        component.submit = new EventEmitter();
        component.submit.observers = <any>[{}];

        spyOn(component, <any>'emitSubmit');
        component.onLoginSubmit();

        expect(component['emitSubmit']).toHaveBeenCalled();
      });

      it('shouldn`t call `emitSubmit` if doesn`t have `submit`', () => {
        component.submit = undefined;

        spyOn(component, <any>'emitSubmit');
        component.onLoginSubmit();

        expect(component['emitSubmit']).not.toHaveBeenCalled();
      });

      it('should call `postUrlNewPassword` if has `urlNewPassword`', () => {
        component.urlNewPassword = '/home';

        spyOn(component, <any>'postUrlNewPassword');
        component.onLoginSubmit();

        expect(component['postUrlNewPassword']).toHaveBeenCalled();
      });

      it('shouldn`t call `postUrlNewPassword` if doesn`t have `urlNewPassword`', () => {
        component.urlNewPassword = undefined;

        spyOn(component, <any>'postUrlNewPassword');
        component.onLoginSubmit();

        expect(component['postUrlNewPassword']).not.toHaveBeenCalled();
      });
    });

    it('openConfirmation: should call `modal.open`', () => {
      component.modal = <any>{ open: () => {} };

      spyOn(component.modal, 'open');
      component.openConfirmation();

      expect(component.modal.open).toHaveBeenCalled();
    });

    describe('validatePassword:', () => {
      it('should call `setFormErrors` with `requirement` if `requirements.length` and `requirements` are invalid', () => {
        const controlNewPassword = component.passwordForm.controls['newPassword'];
        component.newPassword = 'password';
        component.requirements = [{ requirement: 'text', status: false }];

        spyOn(component, 'validateRequirement').and.returnValue(false);
        spyOn(component, <any>'setFormErrors');

        component.validatePassword();

        expect(component['setFormErrors']).toHaveBeenCalledWith({ 'requirement': true }, [controlNewPassword]);
      });

      it('shouldn`t call `setFormErrors` with `requirement` if `requirements.length` and `requirements` are valid', () => {
        const controlNewPassword = component.passwordForm.controls['newPassword'];
        component.newPassword = 'password';
        component.requirements = [{ requirement: 'text', status: true }];

        spyOn(component, 'validateRequirement').and.returnValue(true);
        spyOn(component, <any>'setFormErrors');

        component.validatePassword();

        expect(component['setFormErrors']).not.toHaveBeenCalledWith({ 'requirement': true }, [controlNewPassword]);
      });

      it('shouldn`t call `setFormErrors` with `requirement` if `requirements.length` is 0', () => {
        const controlNewPassword = component.passwordForm.controls['newPassword'];
        component.newPassword = 'password';
        component.requirements = [];

        spyOn(component, <any>'setFormErrors');

        component.validatePassword();

        expect(component['setFormErrors']).not.toHaveBeenCalledWith({ 'requirement': true }, [controlNewPassword]);
      });

      it('should call `setFormErrors` with `required` if `newPassword` is undefined', () => {
        const controlNewPassword = component.passwordForm.controls['newPassword'];
        component.newPassword = undefined;

        spyOn(component, <any>'setFormErrors');

        component.validatePassword();

        expect(component['setFormErrors']).toHaveBeenCalledWith({ 'required': true }, [controlNewPassword]);
      });

      it('should call `setFormErrors` with `required` if `newPassword` is defined but `confirmPassword` is undefined', () => {
        const controlConfirmPassword = component.passwordForm.controls['confirmPassword'];
        component.newPassword = 'password';
        component.confirmPassword = undefined;

        spyOn(component, <any>'setFormErrors');

        component.validatePassword();

        expect(component['setFormErrors']).toHaveBeenCalledWith({ 'required': true }, [controlConfirmPassword]);
      });

      it('should call `setFormErrors` with `equalPassword` if `newPassword` is different of `confirmPassword`', () => {
        const controlNewPassword = component.passwordForm.controls['newPassword'];
        const controlConfirmPassword = component.passwordForm.controls['confirmPassword'];

        component.newPassword = 'password';
        component.confirmPassword = 'different password';

        spyOn(component, <any>'setFormErrors');

        component.validatePassword();

        expect(component['setFormErrors']).toHaveBeenCalledWith({ 'equalPassword': true }, [
          controlNewPassword,
          controlConfirmPassword
        ]);
      });

      it('should call `setFormErrors` with `null` if `newPassword` and `confirmPassword` are equal', () => {
        const controlNewPassword = component.passwordForm.controls['newPassword'];
        const controlConfirmPassword = component.passwordForm.controls['confirmPassword'];
        component.newPassword = 'password';
        component.confirmPassword = 'password';

        spyOn(component, <any>'setFormErrors');

        component.validatePassword();

        expect(component['setFormErrors']).toHaveBeenCalledWith(null, [controlNewPassword, controlConfirmPassword]);
      });
    });

    it('validateRequirement: should call status function', () => {
      const requirement = { requirement: 'requirementValue', status: () => {} };

      spyOn(requirement, 'status');

      component.validateRequirement(requirement);
      expect(requirement.status).toHaveBeenCalled();
    });

    it('validateRequirement: should return status true', () => {
      const requirement = { requirement: 'requirementValue', status: true };
      const result = component.validateRequirement(requirement);
      expect(result).toBe(true);
    });

    it('emitSubmit: should call `submit.emit` with form data', () => {
      const expectedResult = { newPassword: 'new', currentPassword: 'current' };

      spyOn(component.submit, 'emit');
      component['emitSubmit'](expectedResult);

      expect(component.submit.emit).toHaveBeenCalledWith({
        currentPassword: expectedResult.currentPassword,
        newPassword: expectedResult.newPassword
      });
    });

    it('postUrlNewPassword: should call `post` if status is 204 should call `openConfirmation`', fakeAsync(() => {
      component.urlNewPassword = '/home';
      component.token = 'token';

      const data = { token: 'token', newPassword: 'new', currentPassword: 'current' };
      const response = { status: 204 };

      spyOn(component, 'openConfirmation');
      spyOn(component['service'], 'post').and.returnValue(getObservable(response));

      component['postUrlNewPassword'](data);
      tick();

      expect(component['service'].post).toHaveBeenCalledWith(component.urlNewPassword, data);
      expect(component.openConfirmation).toHaveBeenCalled();
    }));

    it('postUrlNewPassword: should call `post` if status isn`t 204 shouldn`t call `openConfirmation`', fakeAsync(() => {
      component.urlNewPassword = '/home';
      component.token = 'token';

      const data = { token: 'token', newPassword: 'new', currentPassword: 'current' };
      const response = { status: 400 };

      spyOn(component, 'openConfirmation');
      spyOn(component['service'], 'post').and.returnValue(getObservable(response));

      component['postUrlNewPassword'](data);
      tick();

      expect(component['service'].post).toHaveBeenCalledWith(component.urlNewPassword, data);
      expect(component.openConfirmation).not.toHaveBeenCalled();
    }));

    it('getLoginForm: should return object with `currentPassword` and `newPassword`', () => {
      component.currentPassword = 'current';
      component.newPassword = 'new';

      expect(component['getLoginForm']()).toEqual({
        currentPassword: component.currentPassword,
        newPassword: component.newPassword
      });
    });

    it('setFormErrors: should call `setErrors` with error foreach control', () => {
      const controlCurrentPassword = { setErrors: () => {} };
      const controlNewPassword = { setErrors: () => {} };

      spyOn(controlCurrentPassword, 'setErrors');
      spyOn(controlNewPassword, 'setErrors');

      component['setFormErrors']({ 'required': true }, [controlCurrentPassword, controlNewPassword]);

      expect(controlCurrentPassword.setErrors).toHaveBeenCalled();
      expect(controlNewPassword.setErrors).toHaveBeenCalled();
    });

    describe('subscribeToTokenParameter', () => {
      it('should subscribe to route parameters and set `token` if has token parameter', () => {
        const token = 'token';

        component['route'].queryParams = of({ token });

        component['subscribeToTokenParameter']();

        expect(component.token).toBe(token);
      });

      it('should subscribe to route parameters and doesn`t set `token` if doesn`t have token parameter', () => {
        component['route'].queryParams = of({});

        component['subscribeToTokenParameter']();

        expect(component.token).toBeUndefined();
      });
    });

    it('onForgotPasswordClick: should call `recoveryUrl` if recoveryUrl type is function: ', () => {
      const fakeThis = {
        recoveryUrl: () => {}
      };

      spyOn(component, <any>'createModalPasswordRecoveryComponent');
      spyOn(fakeThis, 'recoveryUrl');

      component['onForgotPasswordClick'](fakeThis.recoveryUrl);

      expect(fakeThis.recoveryUrl).toHaveBeenCalled();
      expect(component['createModalPasswordRecoveryComponent']).not.toHaveBeenCalled();
    });

    it('onForgotPasswordClick: should call `createModalPasswordRecoveryComponent` if recoveryUrl type is an object', () => {
      const recoveryUrl = { url: 'url' };

      spyOn(component, <any>'createModalPasswordRecoveryComponent');

      component['onForgotPasswordClick'](recoveryUrl);

      expect(component['createModalPasswordRecoveryComponent']).toHaveBeenCalledWith(recoveryUrl);
    });

    describe('createModalPasswordRecoveryComponent', () => {
      const componentRef: any = {
        instance: {
          open: () => {},
          type: undefined,
          recovery: undefined,
          phoneMask: undefined,
          contactEmail: undefined
        },
        changeDetectorRef: { detectChanges: () => {} }
      };

      const componentReference: any = {
        componentRef: componentRef,
        poComponentInjector: {
          destroyComponentInApplication: () => {},
          createComponentInApplication: () => componentRef
        }
      };

      it('should destroy `componentRef` it`s not null', () => {
        const recovery = { url: 'url', type: PoModalPasswordRecoveryType.SMS, contactMail: 'email', phoneMask: 'mask' };

        spyOn(componentReference.poComponentInjector, 'destroyComponentInApplication');

        component['createModalPasswordRecoveryComponent'].call(componentReference, recovery);

        expect(componentReference.poComponentInjector.destroyComponentInApplication).toHaveBeenCalled();
      });

      it('should not destroy `componentRef` if it`s null', () => {
        const recovery = {
          url: 'url',
          type: PoModalPasswordRecoveryType.SMS,
          contactMail: 'email',
          phoneMask: 'mask'
        };
        componentReference.componentRef = null;
        const spy = spyOn(componentReference.poComponentInjector, 'destroyComponentInApplication');

        component['createModalPasswordRecoveryComponent'].call(componentReference, recovery);

        expect(spy).not.toHaveBeenCalled();
      });

      it(`should call 'createComponentInApplication', 'changeDetectorRef.detectChanges' and 'instance.open'
      and set instante.type with recovery.type`, fakeAsync(() => {
        const recovery = { url: 'url', type: PoModalPasswordRecoveryType.SMS, contactMail: 'email', phoneMask: 'mask' };

        spyOn(componentReference.poComponentInjector, 'createComponentInApplication').and.callThrough();
        spyOn(componentRef.changeDetectorRef, 'detectChanges');
        spyOn(componentRef.instance, 'open');

        component['createModalPasswordRecoveryComponent'].call(componentReference, recovery);
        tick();

        expect(componentRef.instance.recovery).toBe(recovery.url);
        expect(componentRef.instance.type).toBe(recovery.type);
        expect(componentReference.poComponentInjector.createComponentInApplication).toHaveBeenCalledWith(
          PoModalPasswordRecoveryComponent
        );
        expect(componentRef.changeDetectorRef.detectChanges).toHaveBeenCalled();
        expect(componentRef.instance.open).toHaveBeenCalled();
      }));

      it(`should set 'instance.type' with PoModalPasswordRecoveryType.Email
      if recovery doesnt't have a defined 'type' value`, fakeAsync(() => {
        const recovery = { url: 'url' };

        spyOn(componentReference.poComponentInjector, 'createComponentInApplication').and.callThrough();
        spyOn(componentRef.changeDetectorRef, 'detectChanges');
        spyOn(componentRef.instance, 'open');

        component['createModalPasswordRecoveryComponent'].call(componentReference, recovery);
        tick();

        expect(componentRef.instance.type).toBe(PoModalPasswordRecoveryType.Email);
      }));
    });

    it('checkingForMetadataProperty: should return value if the object contains the expected property', () => {
      const object = { property: 'value' };
      const property = 'property';
      const expectedResult = component['checkingForMetadataProperty'](object, property);
      expect(expectedResult).toBe('value');
    });

    it('checkingForMetadataProperty: shoudn`t return if object doesn`t contain the expected property', () => {
      const object = { property: 'value' };
      const property = 'absentProperty';
      const expectedResult = component['checkingForMetadataProperty'](object, property);
      expect(expectedResult).toBe(undefined);
    });

    it('checkingForRouteMetadata: shouldn`t set authenticationUrl nor recovery if activatedRoute.data is empty', () => {
      const data = {};
      spyOn(component, <any>'checkingForMetadataProperty');
      component['checkingForRouteMetadata'](data);
      expect(component['checkingForMetadataProperty']).not.toHaveBeenCalled();
    });

    it('checkingForRouteMetadata: should call `checkingForMetadataProperty twice`', () => {
      const data = {
        serviceApi: 'apiUrl',
        recovery: { url: 'url', type: 'all' },
        hideCurrentPassword: false
      };
      spyOn(component, <any>'checkingForMetadataProperty');
      component['checkingForRouteMetadata'](data);
      expect(component['checkingForMetadataProperty']).toHaveBeenCalledTimes(3);
    });

    it('checkingForRouteMetadata: should set authenticationUrl and recovery values according with data values', () => {
      const data = {
        serviceApi: 'apiUrl',
        recovery: { url: 'url', type: 'all' },
        hideCurrentPassword: false
      };
      component['checkingForRouteMetadata'](data);
      expect(component.urlNewPassword).toEqual(data.serviceApi);
      expect(component.recovery['url']).toEqual(data.recovery.url);
      expect(component.recovery['type']).toEqual(data.recovery.type);
      expect(component.hideCurrentPassword).toEqual(data.hideCurrentPassword);
    });

    it('checkingForRouteMetadata: should keep properties with their own values if data doesn`t contain a match property', () => {
      component.urlNewPassword = 'newPasswordUrl';
      component.recovery = { url: 'recoveryUrl' };
      component.hideCurrentPassword = false;
      const data = { anotherProperty: 'anotherValue' };
      component['checkingForRouteMetadata'](data);
      expect(component.urlNewPassword).toBe('newPasswordUrl');
      expect(component.recovery['url']).toBe('recoveryUrl');
      expect(component.hideCurrentPassword).toBe(false);
    });
  });

  describe('Templates:', () => {
    it('should create header literals', () => {
      const header = nativeElement.querySelector('.po-page-blocked-user-header').innerHTML;
      expect(header).toContain(component.literals.createNewPassword);
      expect(header).toContain(component.literals.createNewPasswordPhrase);
    });

    it('should create `po-password` for current password', () => {
      const password = nativeElement.querySelector('po-password').outerHTML;
      expect(password).toContain('currentPassword');
    });

    it('shouldn`t create `po-password` for current password if `hideCurrentPassword` is true', () => {
      component.hideCurrentPassword = true;

      fixture.detectChanges();

      const password = nativeElement.querySelector('po-password').outerHTML;
      expect(password).not.toContain('currentPassword');
    });

    it('should create `.po-page-change-password-forgot-password` if `hideCurrentPassword` is false and `recovery` has value', () => {
      component.hideCurrentPassword = false;
      component.recovery = '/po';

      fixture.detectChanges();

      const recoveryLink = nativeElement.querySelector('.po-page-change-password-forgot-password');
      expect(recoveryLink).toBeTruthy();
    });

    it('shouldn`t create `.po-page-change-password-forgot-password` if `hideCurrentPassword` is true', () => {
      component.hideCurrentPassword = true;

      fixture.detectChanges();

      const recoveryLink = nativeElement.querySelector('.po-page-change-password-forgot-password');
      expect(recoveryLink).toBeFalsy();
    });

    it('shouldn`t create `.po-page-change-password-forgot-password` if `recovery` is undefined', () => {
      component.recovery = undefined;

      fixture.detectChanges();

      const recoveryLink = nativeElement.querySelector('.po-page-change-password-forgot-password');
      expect(recoveryLink).toBeFalsy();
    });

    it('should create `.po-page-change-password-forgot-password` with `routerLink` if `recoveryUrlType` is `internalLink`', () => {
      component.hideCurrentPassword = false;
      component.recovery = '/po';
      component.recoveryUrlType = 'internalLink';

      fixture.detectChanges();

      const recoveryLink = nativeElement.querySelector(
        '.po-page-change-password-forgot-password[ng-reflect-router-link="/po"]'
      );
      expect(recoveryLink).toBeTruthy();
    });

    it('should create `.po-page-change-password-forgot-password` with `href` if `recoveryUrlType` is `externalLink`', () => {
      component.hideCurrentPassword = false;
      component.recovery = 'http://po.com.br';
      component.recoveryUrlType = 'externalLink';

      fixture.detectChanges();

      const recoveryLink = nativeElement.querySelector(
        '.po-page-change-password-forgot-password[href="http://po.com.br"]'
      );
      expect(recoveryLink).toBeTruthy();
    });

    it('should call `onForgotPasswordClick` if `recoveryType` is undefined', () => {
      component.hideCurrentPassword = false;
      component.recovery = { url: 'url' };
      component.recoveryUrlType = undefined;

      spyOn(component, 'onForgotPasswordClick');

      fixture.detectChanges();

      const forgotPasswordLink = nativeElement.querySelector('.po-page-change-password-forgot-password');
      forgotPasswordLink.click();

      expect(component.onForgotPasswordClick).toHaveBeenCalledWith(component.recovery);
    });

    it('should create only one button if `hideCurrentPassword` is true', () => {
      component.hideCurrentPassword = true;

      fixture.detectChanges();

      const button = nativeElement.querySelectorAll('po-button');
      expect(button.length).toBe(1);
    });

    it('should create two buttons if `hideCurrentPassword` is false', () => {
      component.hideCurrentPassword = false;

      fixture.detectChanges();

      const button = nativeElement.querySelectorAll('po-button');
      expect(button.length).toBe(2);
    });

    it('should show password requirements if `showRequirements` is true', () => {
      component.showRequirements = true;
      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-page-change-password-required-container')).toBeTruthy();
    });

    it('shouldn`t show password requirements if `showRequirements` is false', () => {
      component.showRequirements = false;
      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-page-change-password-required-container')).toBeFalsy();
    });

    it('should add a `po-page-change-password-required-text` foreach password requirement', () => {
      const requirements = [
        { requirement: 'requirement', status: false },
        { requirement: 'requirement', status: false }
      ];

      component.requirements = requirements;
      fixture.detectChanges();
      expect(nativeElement.querySelectorAll('.po-page-change-password-required-text').length).toBe(2);
    });

    it('should add a `po-icon-ok` for a requirement with true status', () => {
      const requirements = [{ requirement: 'requirement', status: true }];
      component.requirements = requirements;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-icon-ok.po-page-change-password-required-ok')).toBeTruthy();
      expect(nativeElement.querySelector('.po-icon-minus po-page-change-password-required-minus')).toBeFalsy();
    });

    it('should add a `po-icon-minus` for a requirement with false status', () => {
      const requirements = [{ requirement: 'requirement', status: false }];
      component.requirements = requirements;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-icon-minus.po-page-change-password-required-minus')).toBeTruthy();
      expect(nativeElement.querySelector('.po-icon-ok.po-page-change-password-required-ok')).toBeFalsy();
    });

    it('should add requirement text', () => {
      const requirements = [{ requirement: 'requirement', status: false }];
      component.requirements = requirements;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-page-change-password-required-text').innerHTML).toContain(
        requirements[0].requirement
      );
    });
  });
});
