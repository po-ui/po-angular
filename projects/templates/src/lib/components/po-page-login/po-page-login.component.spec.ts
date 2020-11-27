import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import {
  PoButtonComponent,
  PoComboComponent,
  PoInputComponent,
  PoLoginComponent,
  PoPasswordComponent,
  PoSelectComponent,
  PoSwitchComponent,
  poLocaleDefault
} from '@po-ui/ng-components';

import { PoModalPasswordRecoveryComponent } from '../po-modal-password-recovery/po-modal-password-recovery.component';
import { PoModalPasswordRecoveryType } from '../po-modal-password-recovery/enums/po-modal-password-recovery-type.enum';
import { PoPageLoginAuthenticationType } from './enums/po-page-login-authentication-type.enum';
import {
  PoPageLoginBaseComponent,
  poPageLoginLiteralIn,
  poPageLoginLiteralsDefault
} from './po-page-login-base.component';
import { PoPageLoginComponent } from './po-page-login.component';
import { PoPageLoginCustomField } from './interfaces/po-page-login-custom-field.interface';
import { PoPageLoginLiterals } from './interfaces/po-page-login-literals.interface';
import { PoPageLoginService } from './po-page-login.service';

describe('PoPageLoginComponent: ', () => {
  let component: PoPageLoginComponent;
  let fixture: ComponentFixture<PoPageLoginComponent>;

  let nativeElement: any;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, RouterTestingModule.withRoutes([])],
        declarations: [
          PoButtonComponent,
          PoComboComponent,
          PoInputComponent,
          PoLoginComponent,
          PoPasswordComponent,
          PoPageLoginComponent,
          PoSelectComponent,
          PoSwitchComponent
        ],
        providers: [HttpClient, HttpHandler, PoPageLoginService],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageLoginComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoPageLoginBaseComponent).toBeTruthy();
    expect(component instanceof PoPageLoginComponent).toBeTruthy();
  });

  it('should only start with the default classes and elements, shouldn`t have variations', () => {
    expect(nativeElement.querySelector('po-login')).toBeTruthy();
    expect(nativeElement.querySelector('po-password')).toBeTruthy();
    expect(nativeElement.querySelector('po-switch')).toBeTruthy();
    expect(nativeElement.querySelector('po-button[p-type="primary"]')).toBeTruthy();

    expect(nativeElement.querySelector('div.po-page-login-password-link')).toBeFalsy();

    expect(nativeElement.querySelector('.po-page-login-highlight-image')).toBeFalsy();
    expect(nativeElement.querySelector('.po-page-login-highlight-image-off')).toBeFalsy();
  });

  it('should only start with the default literals', () => {
    component.literals = poPageLoginLiteralsDefault[poLocaleDefault];

    fixture.detectChanges();

    expect(nativeElement.querySelector('po-login').innerHTML).toContain(component.literals.loginPlaceholder);
    expect(nativeElement.querySelector('po-login').innerHTML).not.toContain(component.literals.loginErrorPattern);

    expect(nativeElement.querySelector('po-password').innerHTML).toContain(component.literals.passwordPlaceholder);
    expect(nativeElement.querySelector('po-password').innerHTML).not.toContain(component.literals.passwordErrorPattern);

    expect(nativeElement.querySelector('po-switch').innerHTML).toContain(component.literals.rememberUser);

    expect(nativeElement.querySelector('po-button[p-type="primary"]').innerHTML).toContain(
      component.literals.submitLabel
    );

    expect(nativeElement.innerHTML).not.toContain(component.literals.forgotPassword);
  });

  it('should show custom literals', () => {
    const customLiterals: PoPageLoginLiterals = {
      loginPlaceholder: 'Custom placeholder login',
      passwordPlaceholder: 'Custom placeholder password',
      rememberUser: 'Custom remember user',
      submitLabel: 'Custom submit',
      forgotPassword: 'Custom forgot password',
      highlightInfo: 'Custom highlight info',
      registerUrl: 'Custom register URL'
    };

    component.literals = customLiterals;

    component.background = './assets/background.png';
    component.recovery = '/recovery';

    fixture.detectChanges();

    expect(nativeElement.querySelector('po-login').innerHTML).toContain(customLiterals.loginPlaceholder);

    expect(nativeElement.querySelector('po-password').innerHTML).toContain(customLiterals.passwordPlaceholder);

    expect(nativeElement.querySelector('po-switch').innerHTML).toContain(customLiterals.rememberUser);
    expect(nativeElement.querySelector('po-button[p-type="primary"]').innerHTML).toContain(customLiterals.submitLabel);
    expect(nativeElement.querySelector('.po-page-login-recovery-link').innerHTML).toContain(
      customLiterals.forgotPassword
    );

    expect(nativeElement.querySelector('po-page-background')).toBeTruthy();
  });

  it('should hide option `remember user` when `p-hide-remember-user` is equal `true`', () => {
    component.hideRememberUser = true;

    fixture.detectChanges();

    expect(nativeElement.querySelector('po-switch')).toBeFalsy();
    expect(nativeElement.querySelector('.po-page-login-info-icon-remember-user')).toBeFalsy();
  });

  it('should show a link when `p-recovery` set a value', () => {
    component.recovery = 'http://po.com.br';

    fixture.detectChanges();

    const divRecovery = nativeElement.querySelector('div.po-page-login-recovery-link');

    expect(divRecovery).toBeTruthy();
    expect(divRecovery.innerHTML).toContain(component.pageLoginLiterals.forgotPassword);
  });

  it('should show a new user when `p-register` set a value', () => {
    component.registerUrl = 'http://po.com.br';

    fixture.detectChanges();

    const divRegisterUrl = nativeElement.querySelector('div.po-page-login-register-link');

    expect(divRegisterUrl).toBeTruthy();
    expect(divRegisterUrl.innerHTML).toContain(component.pageLoginLiterals.registerUrl);
  });

  describe('Methods:', () => {
    describe('ngOnInit:', () => {
      it('should call checkingForRouteMetadata', () => {
        const activatedRoute = { snapshot: { data: {} } };

        spyOn(component, <any>'checkingForRouteMetadata');

        component.ngOnInit();

        expect(component['checkingForRouteMetadata']).toHaveBeenCalledWith(activatedRoute.snapshot.data);
      });

      it('should set selectedLanguage if languagesList is valid ', () => {
        component.languagesList = [{ language: 'en', description: 'English' }];

        spyOnProperty(component, 'language').and.returnValue('en');

        component.ngOnInit();

        expect(component.selectedLanguage).toBe('en');
      });

      it('should set selectedLanguage with a default language if languagesList is invalid ', () => {
        component.languagesList = [{ language: 'en', description: 'English' }];

        spyOnProperty(component, 'language').and.returnValue('ru');

        component.ngOnInit();

        expect(component.selectedLanguage).toBe('en');
      });
    });

    it('ngAfterViewChecked: should call `validateArrayChanges` if has differ', () => {
      spyOn(component, <any>'validateArrayChanges');

      component.ngAfterViewChecked();

      expect(component['validateArrayChanges']).toHaveBeenCalled();
    });

    it('ngAfterViewChecked: shouldn`t call `validateArrayChanges` if differ is undefined', () => {
      const fakeThis = {
        differ: undefined
      };

      spyOn(component, <any>'validateArrayChanges');

      component.ngAfterViewChecked.call(fakeThis);

      expect(component['validateArrayChanges']).not.toHaveBeenCalled();
    });

    it('activateSupport: should call setUrlRedirect if support is a string', () => {
      const expectedValue = '/string';
      component.support = expectedValue;
      spyOn(component, <any>'setUrlRedirect');

      component.activateSupport();

      expect(component['setUrlRedirect']).toHaveBeenCalledWith(expectedValue);
    });

    it('activateSupport: should call support if it is a function', () => {
      component.support = () => {};

      spyOn(component, <any>'setUrlRedirect');
      spyOn(component, <any>'support');

      component.activateSupport();

      expect(component.support).toHaveBeenCalled();
      expect(component['setUrlRedirect']).not.toHaveBeenCalled();
    });

    describe('changePasswordModel:', () => {
      it('should call `setPasswordErrors` with `passwordErrors`', () => {
        const errors = ['error'];
        component.passwordErrors = errors;

        spyOn(component, <any>'setPasswordErrors');

        component.changePasswordModel();

        expect(component['setPasswordErrors']).toHaveBeenCalledWith(errors);
      });

      it('should call `passwordChange.emit` if has `passwordChange`', () => {
        spyOn(component.passwordChange, 'emit');

        component.changePasswordModel();

        expect(component.passwordChange.emit).toHaveBeenCalled();
      });

      it('shouldn`t call `passwordChange.emit` if has `authenticationUrl`', () => {
        component.authenticationUrl = 'fakeUrl';
        spyOn(component.passwordChange, 'emit');

        component.changePasswordModel();

        expect(component.passwordChange.emit).not.toHaveBeenCalled();
      });
    });

    describe('changeLoginModel:', () => {
      it('should call `setLoginErrors` with `loginErrors`', () => {
        const errors = ['error'];
        component.loginErrors = errors;

        spyOn(component, <any>'setLoginErrors');
        component.changeLoginModel();

        expect(component['setLoginErrors']).toHaveBeenCalledWith(errors);
      });

      it('should call `loginChange.emit` if has `loginChange`', () => {
        spyOn(component.loginChange, 'emit');

        component.changeLoginModel();

        expect(component.loginChange.emit).toHaveBeenCalled();
      });

      it('shouldn`t call `loginChange.emit` if has `authenticationUrl`', () => {
        component.authenticationUrl = 'fakeUrl';
        spyOn(component.loginChange, 'emit');

        component.changeLoginModel();

        expect(component.loginChange.emit).not.toHaveBeenCalled();
      });
    });

    describe('generateLoginError: ', () => {
      it('should call `setLoginErrors` if `loginErrors` has value', () => {
        component.loginErrors = ['error'];
        spyOn(component, <any>'setLoginErrors');

        component['generateLoginError']();
        expect(component['setLoginErrors']).toHaveBeenCalled();
      });

      it('should call `resetControl` if `loginErrors` is empty', () => {
        component.loginForm = <any>{ form: { controls: { login: { hasError: () => {} } } } };
        component.loginErrors = [];
        spyOn(component, <any>'resetControl');

        component['generateLoginError']();
        expect(component['resetControl']).toHaveBeenCalled();
      });

      it('should call `resetControl` if `loginErrors` is undefined and `control` is defined', () => {
        component.loginForm = <any>{ form: { controls: { login: { hasError: () => {} } } } };

        component.loginErrors = undefined;
        spyOn(component, <any>'resetControl');

        component['generateLoginError']();
        expect(component['resetControl']).toHaveBeenCalled();
      });

      it('should call `resetControl` if `loginErrors` and `control` are undefined', () => {
        component.loginForm = <any>{ form: { controls: { login: undefined } } };

        component.loginErrors = undefined;
        spyOn(component, <any>'resetControl');

        component['generateLoginError']();
        expect(component['resetControl']).not.toHaveBeenCalled();
      });
    });

    describe('generatePasswordError: ', () => {
      it('should call `setPasswordErrors` if `passwordErrors` has value', () => {
        component.passwordErrors = ['error'];
        spyOn(component, <any>'setPasswordErrors');

        component['generatePasswordError']();
        expect(component['setPasswordErrors']).toHaveBeenCalled();
      });

      it('should call `resetControl` if `passwordErrors` is empty', () => {
        component.loginForm = <any>{ form: { controls: { password: { hasError: () => {} } } } };
        component.passwordErrors = [];
        spyOn(component, <any>'resetControl');

        component['generatePasswordError']();
        expect(component['resetControl']).toHaveBeenCalled();
      });

      it('should call `resetControl` if `passwordErrors` is undefined and `control` is defined', () => {
        component.loginForm = <any>{ form: { controls: { password: { hasError: () => {} } } } };

        component.passwordErrors = undefined;
        spyOn(component, <any>'resetControl');

        component['generatePasswordError']();
        expect(component['resetControl']).toHaveBeenCalled();
      });

      it('should call `resetControl` if `passwordErrors` and `control` are undefined', () => {
        component.loginForm = <any>{ form: { controls: { password: undefined } } };

        component.passwordErrors = undefined;
        spyOn(component, <any>'resetControl');

        component['generatePasswordError']();
        expect(component['resetControl']).not.toHaveBeenCalled();
      });
    });

    it('resetControl: should call `reset` if has control', () => {
      const fakeControl = {
        markAsPristine: () => {},
        markAsUntouched: () => {},
        updateValueAndValidity: () => {}
      };

      spyOn(fakeControl, 'markAsPristine');
      spyOn(fakeControl, 'markAsUntouched');
      spyOn(fakeControl, 'updateValueAndValidity');

      component['resetControl'](<any>fakeControl);

      expect(fakeControl.markAsPristine).toHaveBeenCalled();
      expect(fakeControl.markAsUntouched).toHaveBeenCalled();
      expect(fakeControl.updateValueAndValidity).toHaveBeenCalled();
    });

    describe('setControlErrors: ', () => {
      it('should call `markAsTouched`, `markAsDirty` and  `setErrors` if control and errors have value and `valid` is true', () => {
        const fakeControl = {
          valid: true,
          hasError: () => {},
          markAsTouched: () => {},
          markAsDirty: () => {},
          setErrors: () => {}
        };
        const errors = ['error'];
        const passwordErrorPattern = 'Pattern Error';
        const allPasswordErrors = 'allPasswordErrors';

        spyOn(fakeControl, 'markAsTouched');
        spyOn(fakeControl, 'markAsDirty');
        spyOn(fakeControl, 'setErrors');

        component['setControlErrors'](allPasswordErrors, <any>fakeControl, errors, passwordErrorPattern);

        expect(fakeControl.markAsTouched).toHaveBeenCalled();
        expect(fakeControl.markAsDirty).toHaveBeenCalled();
        expect(fakeControl.setErrors).toHaveBeenCalled();
      });

      it('should call `markAsTouched`, `markAsDirty` and  `setErrors` if control and errors have value and `pristine` is true', () => {
        const fakeControl = {
          pristine: true,
          valid: false,
          hasError: () => {},
          markAsTouched: () => {},
          markAsDirty: () => {},
          setErrors: () => {}
        };
        const errors = ['error'];
        const passwordErrorPattern = 'Pattern Error';
        const allPasswordErrors = 'allPasswordErrors';

        spyOn(fakeControl, 'markAsTouched');
        spyOn(fakeControl, 'markAsDirty');
        spyOn(fakeControl, 'setErrors');

        component['setControlErrors'](allPasswordErrors, <any>fakeControl, errors, passwordErrorPattern);

        expect(fakeControl.markAsTouched).toHaveBeenCalled();
        expect(fakeControl.markAsDirty).toHaveBeenCalled();
        expect(fakeControl.setErrors).toHaveBeenCalled();
      });

      it('shouldn`t call `markAsTouched`, `markAsDirty` and  `setErrors` if control and errors are empty', () => {
        const fakeControl = {
          hasError: () => {},
          markAsTouched: () => {},
          markAsDirty: () => {},
          setErrors: () => {}
        };
        const errors = [];
        const passwordErrorPattern = 'Pattern Error';
        const allPasswordErrors = 'allPasswordErrors';

        spyOn(fakeControl, 'markAsTouched');
        spyOn(fakeControl, 'markAsDirty');
        spyOn(fakeControl, 'setErrors');

        component['setControlErrors'](allPasswordErrors, <any>fakeControl, errors, passwordErrorPattern);

        expect(fakeControl.markAsTouched).not.toHaveBeenCalled();
        expect(fakeControl.markAsDirty).not.toHaveBeenCalled();
        expect(fakeControl.setErrors).not.toHaveBeenCalled();
      });

      it('shouldn`t call `markAsTouched`, `markAsDirty` and  `setErrors` if `valid` and `pristine` are false', () => {
        const fakeControl = {
          pristine: false,
          valid: false,
          hasError: () => {},
          markAsTouched: () => {},
          markAsDirty: () => {},
          setErrors: () => {}
        };
        const errors = ['error'];
        const passwordErrorPattern = 'Pattern Error';
        const allPasswordErrors = 'allPasswordErrors';

        spyOn(fakeControl, 'markAsTouched');
        spyOn(fakeControl, 'markAsDirty');
        spyOn(fakeControl, 'setErrors');

        component['setControlErrors'](allPasswordErrors, <any>fakeControl, errors, passwordErrorPattern);

        expect(fakeControl.markAsTouched).not.toHaveBeenCalled();
        expect(fakeControl.markAsDirty).not.toHaveBeenCalled();
        expect(fakeControl.setErrors).not.toHaveBeenCalled();
      });

      it('should set `allPasswordErrors` with errors', () => {
        const fakeControl = {
          hasError: () => {},
          valid: false
        };
        const errors = ['error'];
        const passwordErrorPattern = 'Pattern Error';
        const allPasswordErrors = 'allPasswordErrors';

        component['setControlErrors'](allPasswordErrors, <any>fakeControl, errors, passwordErrorPattern);

        expect(component.allPasswordErrors).toEqual(errors);
      });

      it('should set `allPasswordErrors` with errors and `passwordErrorPattern` if `hasError` returns true', () => {
        const fakeControl = {
          hasError: () => true,
          valid: false
        };
        const errors = ['error'];
        const passwordErrorPattern = 'Pattern Error';
        const allPasswordErrors = 'allPasswordErrors';

        component['setControlErrors'](allPasswordErrors, <any>fakeControl, errors, passwordErrorPattern);

        expect(component.allPasswordErrors).toEqual([...errors, ...[passwordErrorPattern]]);
      });
    });

    describe('validateArrayChanges', () => {
      it('should call `differ.diff` if `differ` has value', () => {
        const fakeDiffer = {
          diff: () => {}
        };

        const array = [
          {
            array: ['error'],
            callback: () => {}
          }
        ];

        spyOn(fakeDiffer, 'diff');
        component['validateArrayChanges'](fakeDiffer, array);

        expect(fakeDiffer.diff).toHaveBeenCalled();
      });

      it('should call `callback` if has `changes`', () => {
        const fakeDiffer = {
          diff: () => true
        };

        const array = [
          {
            array: ['error'],
            callback: () => {}
          },
          {
            array: ['error'],
            callback: () => {}
          }
        ];

        spyOn(array[0], 'callback');
        spyOn(array[1], 'callback');
        spyOn(component.changeDetector, 'detectChanges');

        component['validateArrayChanges'](fakeDiffer, array);

        expect(array[0].callback).toHaveBeenCalled();
        expect(array[1].callback).toHaveBeenCalled();
        expect(component.changeDetector.detectChanges).toHaveBeenCalled();
      });
    });

    it('setLoginErrors: should call `setLoginErrors`', () => {
      const errors = ['error'];
      spyOn(component, <any>'setControlErrors');

      component['setLoginErrors'](errors);
      expect(component['setControlErrors']).toHaveBeenCalled();
    });

    it('setPasswordErrors: should call `setControlErrors`', () => {
      const errors = ['error'];
      spyOn(component, <any>'setControlErrors');

      component['setPasswordErrors'](errors);
      expect(component['setControlErrors']).toHaveBeenCalled();
    });

    it('onSelectedLanguage: should set `selectedLanguage` with `en`', () => {
      component.onSelectedLanguage('en');

      expect(component.selectedLanguage).toBe('en');
    });

    it('setUrlRedirect: should call `window.open` with external url', () => {
      spyOn(window, 'open');

      component['setUrlRedirect']('http://po.com.br');

      expect(window.open).toHaveBeenCalled();
    });

    it('setUrlRedirect: should call `this.router.navigate` with internal url', () => {
      component.recovery = '/recovery';

      spyOn(component['router'], <any>'navigate');

      component['setUrlRedirect']('/recovery');

      expect(component['router'].navigate).toHaveBeenCalled();
    });

    it('openUrl: should call `setUrlRedirect` if recovery type is string', () => {
      const recovery = 'url';

      spyOn(component, <any>'setUrlRedirect');
      spyOn(component, <any>'createModalPasswordRecoveryComponent');

      component['openUrl'](recovery);

      expect(component['setUrlRedirect']).toHaveBeenCalledWith(recovery);
      expect(component['createModalPasswordRecoveryComponent']).not.toHaveBeenCalled();
    });

    it('openUrl should call `recovery` if recovery type is function: ', () => {
      const fakeThis = {
        recovery: () => {}
      };

      spyOn(component, <any>'setUrlRedirect');
      spyOn(component, <any>'createModalPasswordRecoveryComponent');
      spyOn(fakeThis, 'recovery');

      component['openUrl'](fakeThis.recovery);

      expect(fakeThis.recovery).toHaveBeenCalled();
      expect(component['setUrlRedirect']).not.toHaveBeenCalled();
      expect(component['createModalPasswordRecoveryComponent']).not.toHaveBeenCalled();
    });

    it('openUrl: should call `createModalPasswordRecoveryComponent` if recovery type is an object', () => {
      const recovery = { url: 'url' };

      spyOn(component, <any>'setUrlRedirect');
      spyOn(component, <any>'createModalPasswordRecoveryComponent');

      component['openUrl'](recovery);

      expect(component['setUrlRedirect']).not.toHaveBeenCalled();
      expect(component['createModalPasswordRecoveryComponent']).toHaveBeenCalledWith(recovery);
    });

    describe('createModalPasswordRecoveryComponent', () => {
      const componentRef: any = {
        instance: {
          open: () => {},
          type: undefined,
          urlRecovery: undefined,
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
        const poPageLoginRecovery = { url: 'url', type: PoModalPasswordRecoveryType.SMS };

        spyOn(componentReference.poComponentInjector, 'destroyComponentInApplication');

        component['createModalPasswordRecoveryComponent'].call(componentReference, poPageLoginRecovery);

        expect(componentReference.poComponentInjector.destroyComponentInApplication).toHaveBeenCalled();
      });

      it('should not destroy `componentRef` if it`s null', () => {
        const poPageLoginRecovery = { url: 'url', type: PoModalPasswordRecoveryType.SMS };

        spyOn(componentReference.poComponentInjector, 'destroyComponentInApplication');
        componentReference.componentRef = null;
        component['createModalPasswordRecoveryComponent'].call(componentReference, poPageLoginRecovery);

        expect(componentReference.poComponentInjector.destroyComponentInApplication).not.toHaveBeenCalled();
      });

      it(`should call 'createComponentInApplication', 'changeDetectorRef.detectChanges' and 'instance.open'
      and set instante.type with poPageLoginRecovery.type`, fakeAsync(() => {
        const poPageLoginRecovery = {
          url: 'url',
          type: PoModalPasswordRecoveryType.SMS,
          contactMail: 'email',
          phoneMask: 'mask'
        };

        spyOn(componentReference.poComponentInjector, 'createComponentInApplication').and.callThrough();
        spyOn(componentRef.changeDetectorRef, 'detectChanges');
        spyOn(componentRef.instance, 'open');

        component['createModalPasswordRecoveryComponent'].call(componentReference, poPageLoginRecovery);
        tick();

        expect(componentRef.instance.urlRecovery).toBe(poPageLoginRecovery.url);
        expect(componentRef.instance.type).toBe(poPageLoginRecovery.type);
        expect(componentRef.instance.phoneMask).toBe(poPageLoginRecovery.phoneMask);
        expect(componentRef.instance.contactEmail).toBe(poPageLoginRecovery.contactMail);
        expect(componentReference.poComponentInjector.createComponentInApplication).toHaveBeenCalledWith(
          PoModalPasswordRecoveryComponent
        );
        expect(componentRef.changeDetectorRef.detectChanges).toHaveBeenCalled();
        expect(componentRef.instance.open).toHaveBeenCalled();
      }));

      it(`should set 'instance.type' with PoModalPasswordRecoveryType.Email
      if poPageLoginRecovery doesnt't have a defined 'type' value`, fakeAsync(() => {
        const poPageLoginRecovery = { url: 'url' };

        spyOn(componentReference.poComponentInjector, 'createComponentInApplication').and.callThrough();
        spyOn(componentRef.changeDetectorRef, 'detectChanges');
        spyOn(componentRef.instance, 'open');

        component['createModalPasswordRecoveryComponent'].call(componentReference, poPageLoginRecovery);
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
        environment: 'teste',
        registerUrl: 'registerUrl',
        authenticationType: 'basic'
      };

      spyOn(component, <any>'checkingForMetadataProperty');

      component['checkingForRouteMetadata'](data);

      expect(component['checkingForMetadataProperty']).toHaveBeenCalledTimes(5);
    });

    it('checkingForRouteMetadata: should set authenticationUrl and recovery values according with data values', () => {
      const data = {
        serviceApi: 'apiUrl',
        recovery: { url: 'url', type: 'all' },
        environment: 'teste',
        registerUrl: 'registerUrl',
        authenticationType: 'Basic'
      };

      component['checkingForRouteMetadata'](data);

      expect(component.authenticationUrl).toEqual(data.serviceApi);
      expect(component.recovery['url']).toEqual(data.recovery.url);
      expect(component.recovery['type']).toEqual(data.recovery.type);
      expect(component.environment).toEqual(data.environment);
      expect(component.authenticationType).toEqual(data.authenticationType);
    });

    it('checkingForRouteMetadata: should keep properties with their own values if data doesn`t contain a match property', () => {
      component.authenticationUrl = 'authUrl';
      component.recovery = { url: 'recovery' };
      component.environment = 'dev';
      component.registerUrl = 'register';
      component.authenticationType = PoPageLoginAuthenticationType.Bearer;
      const data = { anotherProperty: 'anotherValue' };

      component['checkingForRouteMetadata'](data);

      expect(component.authenticationUrl).toBe('authUrl');
      expect(component.recovery['url']).toBe('recovery');
      expect(component.environment).toBe('dev');
      expect(component.registerUrl).toBe('register');
      expect(component.authenticationType).toEqual(PoPageLoginAuthenticationType.Bearer);
    });

    it(`concatenateLoginHintWithContactEmail: should call 'concatenateLiteral'`, () => {
      const email = 'email@mail.com';
      const defaultLoginHintLiteral = poPageLoginLiteralsDefault[poLocaleDefault].loginHint;
      const prepositionLiteral = poPageLoginLiteralIn[poLocaleDefault];

      spyOn(component, <any>'concatenateLiteral');
      spyOnProperty(component, 'language').and.returnValue(poLocaleDefault);

      component['concatenateLoginHintWithContactEmail'](email);

      expect(component['concatenateLiteral']).toHaveBeenCalledWith(
        email,
        'loginHint',
        defaultLoginHintLiteral,
        prepositionLiteral
      );
    });

    it(`concatenateLiteral: should call 'concatenate' and return expected value`, () => {
      const value = 'email@email.com.br';
      const currentLiteral = 'loginHint';
      const defaultLiteral = `Your login user was given to you at your first day.
      If you don't have this information contact support`;
      const prepositionLiteral = 'to';
      const result = {
        loginHint: `Your login user was given to you at your first day.
      If you don't have this information contact support to email@email.com.br`
      };

      spyOn(component, <any>'concatenate').and.callThrough();

      const expectedResult = component['concatenateLiteral'](value, currentLiteral, defaultLiteral, prepositionLiteral);

      expect(component['concatenate']).toHaveBeenCalledWith(defaultLiteral, prepositionLiteral, value);
      expect(expectedResult).toEqual(result);
    });

    it('concatenate: should concatenate the received parameters', () => {
      const expectedResult = component['concatenate']('Welcome', 'to', 'Company');

      expect(expectedResult).toBe('Welcome to Company');
    });
  });

  describe('Templates: ', () => {
    let customField: PoPageLoginCustomField;

    function switchLoading(value: boolean) {
      component.loading = value;
      fixture.detectChanges();
    }

    beforeEach(() => {
      // Garante que as literais sejam sempre as mesmas nos testes, independente do idioma do browser de teste
      component.literals = poPageLoginLiteralsDefault.en;
    });

    it('Loading: should disabled button when property is `true`.', () => {
      switchLoading(true);
      const button = fixture.debugElement.nativeElement.querySelector('.po-button-primary');

      expect(button.getAttribute('disabled')).not.toBeNull();
    });

    it('Label: should have label equal Enter on loading when `p-loading` is `false`.', () => {
      switchLoading(false);
      const button = fixture.debugElement.nativeElement.querySelector('.po-button-primary');

      expect(button.innerHTML).toContain(poPageLoginLiteralsDefault.en.submitLabel);
    });

    it('Label: should set alternative label on loading when `p-loading` is `true`.', () => {
      switchLoading(true);
      const button = fixture.debugElement.nativeElement.querySelector('.po-button-primary');

      expect(button.innerHTML).toContain(poPageLoginLiteralsDefault.en.submittedLabel);
    });

    it('should contain productName and welcome if productName and welcome are defined', () => {
      const productName = 'custom product name';
      const welcome = 'custom welcome';

      component.literals = { welcome };
      component.productName = productName;

      fixture.detectChanges();

      const productNameElement = fixture.debugElement.nativeElement.querySelector('.po-page-login-header-product-name');
      const welcomeElement = fixture.debugElement.nativeElement.querySelector('.po-page-login-header-welcome');

      expect(productNameElement.innerText).toBe(productName);
      expect(welcomeElement.innerText).toBe(welcome);
    });

    it('customField po-input: should have po-input when placeholder is filled and shouldn`t have po-select and po-combo.', () => {
      customField = {
        property: 'domain',
        placeholder: 'Enter your domain'
      };
      component.customField = customField;

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-input')).toBeTruthy();
      expect(nativeElement.querySelector('po-combo')).toBeFalsy();
      expect(nativeElement.querySelector('po-select')).toBeFalsy();
    });

    it('customField po-combo: should have po-combo when url is filled and shouldn`t have po-select  and po-input.', () => {
      customField = {
        property: 'domain',
        placeholder: 'Enter your domain',
        url: 'https://po-ui.io/sample/api/comboOption/heroes',
        fieldValue: 'nickname'
      };
      component.customField = customField;

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-combo')).toBeTruthy();
      expect(nativeElement.querySelector('po-select')).toBeFalsy();
      expect(nativeElement.querySelector('po-input')).toBeFalsy();
    });

    it('customField po-select: should have po-select when options is filled and shouldn`t have po-combo and po-input.', () => {
      customField = {
        property: 'domain',
        placeholder: 'Enter your domain',
        options: [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' }
        ]
      };
      component.customField = customField;

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-select')).toBeTruthy();
      expect(nativeElement.querySelector('po-combo')).toBeFalsy();
      expect(nativeElement.querySelector('po-input')).toBeFalsy();
    });

    it('customField po-select: should have po-select when options, url and fieldValue is filled.', () => {
      customField = {
        property: 'domain',
        placeholder: 'Enter your domain',
        options: [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' }
        ],
        url: 'https://po-ui.io/sample/api/comboOption/heroes',
        fieldValue: 'nickname'
      };
      component.customField = customField;

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-select')).toBeTruthy();
      expect(nativeElement.querySelector('po-combo')).toBeFalsy();
      expect(nativeElement.querySelector('po-input')).toBeFalsy();
    });

    it('should add label to po-login and po-password fields', () => {
      const loginLabel = 'Login label';
      const passwordLabel = 'Password label';

      component.literals = <PoPageLoginLiterals>{ loginLabel, passwordLabel };

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-login').outerHTML).toContain(loginLabel);
      expect(nativeElement.querySelector('po-password').outerHTML).toContain(passwordLabel);
    });

    it('should add 2 information icons with tooltip directive', () => {
      const infoIcons = nativeElement.querySelectorAll('.po-icon.po-field-icon.po-icon-info');

      expect(infoIcons.length).toBe(2);
      expect(infoIcons[0].outerHTML).toContain('p-tooltip');
      expect(infoIcons[1].outerHTML).toContain('p-tooltip');

      expect(nativeElement.querySelectorAll('.po-page-login-info-icon-container').length).toBe(2);
    });

    it('should add 2 errors `div` with icons and text', () => {
      component.allLoginErrors = ['Error 1', 'Error 2'];
      fixture.detectChanges();
      const divs = nativeElement.querySelectorAll('.po-field-container-error-item');

      expect(divs.length).toBe(2);
      divs.forEach(div => {
        expect(div.outerHTML).toContain('po-icon po-icon-exclamation');
        expect(div.outerHTML).toContain('po-field-container-error-text');
      });
    });

    it('should add 2 errors `div` with specific text updated on property `allLoginErors`', () => {
      component.allLoginErrors = ['Error 1', 'Error 2'];
      fixture.detectChanges();

      const divs = nativeElement.querySelectorAll(
        '.po-field-container-bottom-text-error.po-field-container-error-item'
      );

      expect(divs.length).toBe(2);
      divs.forEach((div, index) => {
        expect(div.outerHTML).toContain(component.allLoginErrors[index]);
      });
    });

    it('shouldn`t add error `div` if `allLoginErors` is empty', () => {
      component.allLoginErrors = [];
      fixture.detectChanges();

      const divs = nativeElement.querySelectorAll(
        '.po-field-container-bottom-text-error.po-field-container-error-item'
      );

      expect(divs.length).toBe(0);
    });

    it('should add errors and `input` login receive ng class error', () => {
      component.allLoginErrors = ['Error 1', 'Error 2'];
      fixture.detectChanges();

      const poLogin = nativeElement.querySelectorAll('po-login.ng-dirty.ng-invalid');

      expect(poLogin).toBeTruthy();
    });

    it('should show `po-page-login-recovery-link` div class if recovery contains value', () => {
      component.recovery = 'url';

      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-page-login-recovery-link').innerHTML).toContain(
        component.literals.forgotPassword
      );
    });
  });

  describe('environment tag', () => {
    it('should show warning tag if has `environment`', () => {
      const environment = 'dev';
      component.environment = environment;

      fixture.detectChanges();

      const tag = nativeElement.querySelector('po-tag');

      expect(tag).toBeTruthy();
      expect(tag.outerHTML).toContain('warning');
    });

    it('shouldn`t show warning tag if doesn`t have `environment`', () => {
      const environment = '';
      component.environment = environment;
      fixture.detectChanges();

      const tag = nativeElement.querySelector('po-tag');

      expect(tag).toBeFalsy();
    });
  });

  describe('support button', () => {
    it('should show support button if support is a string', () => {
      component.support = '/teste';

      fixture.detectChanges();

      const support = nativeElement.querySelector('.po-page-login-support');

      expect(support).toBeTruthy();
    });

    it('should show support button if support is a function', () => {
      component.support = () => {};

      fixture.detectChanges();

      const support = nativeElement.querySelector('.po-page-login-support');

      expect(support).toBeTruthy();
    });

    it('shouldn`t show button if doesn`t have `support`', () => {
      component.support = undefined;
      fixture.detectChanges();

      const support = nativeElement.querySelector('.po-page-login-support');

      expect(support.hidden).toBeTruthy();
    });
  });
});
