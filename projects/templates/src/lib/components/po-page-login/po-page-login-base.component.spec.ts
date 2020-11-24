import { Directive } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { throwError } from 'rxjs';

import { expectPropertiesValues, getObservable } from '../../util-test/util-expect.spec';
import * as UtilFunctions from './../../utils/util';

import { PoPageLoginBaseComponent, poPageLoginLiteralsDefault } from './po-page-login-base.component';
import { PoPageLoginCustomField } from './interfaces/po-page-login-custom-field.interface';
import { PoPageLoginService } from './po-page-login.service';
import { PoLanguage, poLanguageDefault, PoLanguageService, poLocaleDefault } from '@po-ui/ng-components';

const routerStub = {
  navigate: jasmine.createSpy('navigate')
};
export class PoPageLoginComponent extends PoPageLoginBaseComponent {
  protected concatenateLoginHintWithContactEmail(contactEmail: string): void {}
  protected concatenateTitleWithProductName(productName: string): void {}
  protected setLoginErrors(value: Array<string>): void {}
  protected setPasswordErrors(value: Array<string>): void {}
}

describe('PoPageLoginBaseComponent: ', () => {
  let component: PoPageLoginBaseComponent;
  let servicePageLogin: PoPageLoginService;
  let languageService: PoLanguageService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [],
        providers: [PoPageLoginService, PoLanguageService]
      }).compileComponents();
    })
  );

  const booleanValidTrueValues = [true, 'true', 1, ''];
  const booleanValidFalseValues = [false, 'false', 0];
  const booleanInvalidValues = [undefined, null, 2, 'string'];

  beforeEach(() => {
    servicePageLogin = new PoPageLoginService(undefined);
    languageService = new PoLanguageService();

    component = new PoPageLoginComponent(servicePageLogin, <any>routerStub, languageService);
  });

  it('should be created', () => {
    expect(component instanceof PoPageLoginBaseComponent).toBeTruthy();
  });

  it('should update property `p-hide-remember-user` with valid values', () => {
    expectPropertiesValues(component, 'hideRememberUser', booleanValidTrueValues, true);
    expectPropertiesValues(component, 'hideRememberUser', booleanValidFalseValues, false);
  });

  it('should update property `p-hide-remember-user` with `false` when invalid values', () => {
    expectPropertiesValues(component, 'hideRememberUser', booleanInvalidValues, false);
  });

  it('shouldn`t update `rememberUser` when `p-hide-remember-user` is `false`', () => {
    component['rememberUser'] = true;

    component.hideRememberUser = false;

    expect(component['rememberUser']).toBeTruthy();
  });

  it('should update `rememberUser` with `false` when `p-hide-remember-user` is `true`', () => {
    component['rememberUser'] = true;

    component.hideRememberUser = true;

    expect(component['rememberUser']).toBeFalsy();
  });

  describe('Properties: ', () => {
    it('p-custom-field: should update with string values', () => {
      const validValuesCustomField = ['customField', 'domain'];

      expectPropertiesValues(component, 'customField', validValuesCustomField, validValuesCustomField);
    });

    it('p-custom-field: should update with invalid values', () => {
      const invalidValuesCustomField = [undefined, null, false, true, 1, {}, [], NaN, ''];

      expectPropertiesValues(component, 'customField', invalidValuesCustomField, undefined);
    });

    it('p-custom-field: should set `input` value to customFieldType when p-custom-field is setted with string type', () => {
      component.customField = 'teste';
      expect(component.customFieldType).toBe('input');
    });

    it(`p-custom-field: should set 'input' value to customFieldType when
      p-custom-field is setted with object with no options and no url`, () => {
      component.customField = {
        property: 'domain',
        value: 'jv01',
        pattern: '[a-z]',
        options: undefined,
        url: undefined,
        fieldValue: 'nickname'
      };
      expect(component.customFieldType).toBe('input');
    });

    it('p-custom-field: should set `select` value to customFieldType when p-custom-field is setted with object with options', () => {
      component.customField = {
        property: 'domain',
        value: 'jv01',
        pattern: '[a-z]',
        options: [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' }
        ],
        url: 'https://po-ui.io/sample/api/comboOption/heroes',
        fieldValue: 'nickname'
      };
      expect(component.customFieldType).toBe('select');
    });

    it('p-custom-field: should set `combo` value to customFieldType when p-custom-field is setted with object with no options', () => {
      component.customField = {
        property: 'domain',
        value: 'jv01',
        pattern: '[a-z]',
        options: undefined,
        url: 'https://po-ui.io/sample/api/comboOption/heroes',
        fieldValue: 'nickname'
      };
      expect(component.customFieldType).toBe('combo');
    });

    it('p-custom-field: should update with object value', () => {
      const customField: PoPageLoginCustomField = {
        property: 'domain',
        value: 'jv01',
        pattern: '[a-z]',
        options: [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' }
        ],
        url: 'https://po-ui.io/sample/api/comboOption/heroes',
        fieldValue: 'nickname'
      };
      const validValuesCustomField = [customField];

      expectPropertiesValues(component, 'customField', validValuesCustomField, validValuesCustomField);
    });

    it('p-environment: should set environment with max length of 40', () => {
      const largeText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quisua.';
      const shortText = 'Lorem ipsum dolor';
      const expectedLargeValue = 'Lorem ipsum dolor sit amet, consectetur ';
      const expectedShortValue = 'Lorem ipsum dolor';

      expectPropertiesValues(component, 'environment', largeText, expectedLargeValue);
      expectPropertiesValues(component, 'environment', shortText, expectedShortValue);
    });

    it('p-register-url: should update with valid values', () => {
      const validValuesCustomField = ['/register', 'https://www.fakeUrlPo.com'];

      expectPropertiesValues(component, 'registerUrl', validValuesCustomField, validValuesCustomField);
    });

    it('p-register-url: should update with invalid values', () => {
      const validValuesCustomField = [undefined, null, false, true, 1, [], NaN, {}];

      expectPropertiesValues(component, 'registerUrl', validValuesCustomField, undefined);
    });

    it('language: should return `selectedLanguage` if its is defined', () => {
      component.selectedLanguage = 'pt';

      expect(component.language).toBe('pt');
    });

    it('language: should return `getShortBrowserLanguage` if `selectedLanguage` is undefined', () => {
      component.selectedLanguage = undefined;

      spyOn(UtilFunctions, 'getShortBrowserLanguage').and.returnValue('en');

      expect(component.language).toBe('en');
    });

    it('p-loading: should set `true` when attributed valid values.', () => {
      const validValues = [true, 'true', 1, ''];
      expectPropertiesValues(component, 'loading', validValues, true);
    });

    it('p-loading: should set `false` when attributed invalid values.', () => {
      const invalidValues = [false, undefined, 0];
      expectPropertiesValues(component, 'loading', invalidValues, false);
    });

    it('p-exceeded-attempts-warning: should update with valid values.', () => {
      const values = [1, '1'];
      const expectedValues = [1, 1];
      component.exceededAttemptsWarning = 1;
      const expectedValue = true;

      spyOn(UtilFunctions, 'convertToInt').and.callThrough();

      expectPropertiesValues(component, 'exceededAttemptsWarning', values, expectedValues);
      expect(UtilFunctions.convertToInt).toHaveBeenCalled();
      expect(component.showExceededAttemptsWarning).toBe(expectedValue);
    });

    it('p-exceeded-attempts-warning: should set `this.showExceededAttemptsWarning` with `false`.', () => {
      component.exceededAttemptsWarning = 0;
      const expectedValue = false;

      expect(component.showExceededAttemptsWarning).toBe(expectedValue);
    });

    it('pageLoginLiterals: should spread an object overlapped by `customLiterals`', () => {
      spyOnProperty(component, 'language').and.returnValue('en');

      component.literals = {
        'welcome': 'Custom welcome',
        'loginHint': 'Custom Login Hint'
      };

      component.productName = 'Produto';
      component.contactEmail = 'user@mail.com';

      const concatedLoginHint = { 'loginHint': 'Custom Login Hint user@mail.com' };

      const expectedResult = {
        ...poPageLoginLiteralsDefault[poLocaleDefault],
        ...poPageLoginLiteralsDefault[component.language],
        ...concatedLoginHint,
        ...component.literals
      };

      expect(component.pageLoginLiterals).toEqual(expectedResult);
    });

    it('pageLoginLiterals: should spread an object without `contactEmail` and `productName`', () => {
      spyOnProperty(component, 'language').and.returnValue('en');

      component.literals = {
        'welcome': 'Custom welcome',
        'loginHint': 'Custom Login Hint'
      };

      component.productName = undefined;
      component.contactEmail = undefined;

      const expectedResult = {
        ...poPageLoginLiteralsDefault[poLocaleDefault],
        ...poPageLoginLiteralsDefault[component.language],
        ...component.literals
      };

      expect(component.pageLoginLiterals).toEqual(expectedResult);
    });

    it('p-environment: should set environment with max length of 40', () => {
      const largeText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quisua.';
      const shortText = 'Lorem ipsum dolor';
      const expectedLargeValue = 'Lorem ipsum dolor sit amet, consectetur ';
      const expectedShortValue = 'Lorem ipsum dolor';

      expectPropertiesValues(component, 'environment', largeText, expectedLargeValue);
      expectPropertiesValues(component, 'environment', shortText, expectedShortValue);
    });

    describe('loginErrors', () => {
      it('should update property with valid values', () => {
        const validValues = ['Error 1', 'Error 2', 'Error 3'];
        expectPropertiesValues(component, 'loginErrors', validValues, validValues);
      });

      it('should update property with empty array if values is invalid', () => {
        const validValues = [null, undefined, false, ''];
        expectPropertiesValues(component, 'loginErrors', validValues, []);
      });

      it('should call `setLoginErrors` when property is updated', () => {
        const validValues = ['Error 1', 'Error 2', 'Error 3'];
        spyOn(component, <any>'setLoginErrors');
        component.loginErrors = validValues;
        expect(component['setLoginErrors']).toHaveBeenCalled();
      });

      it('should call `setLoginErrors` with validValues when property is updated', () => {
        const validValues = ['Error 1', 'Error 2', 'Error 3'];
        spyOn(component, <any>'setLoginErrors');
        component.loginErrors = validValues;
        expect(component['setLoginErrors']).toHaveBeenCalledWith(validValues);
      });
    });

    describe('p-languages:', () => {
      it('should set property with default languages when the value is invalid.', () => {
        const invalidValues = [null, undefined, NaN];
        const expectedValues = [poLanguageDefault];

        expectPropertiesValues(component, 'languagesList', invalidValues, expectedValues);
      });

      it('should set property with the language defined by the browse if the value is empty.', () => {
        const validValues = [[]];
        const expectedValues = [[{ description: 'Português', language: 'pt' }]];
        spyOnProperty(component, 'language').and.returnValue('pt');
        expectPropertiesValues(component, 'languagesList', validValues, expectedValues);
        expect(component.showLanguage).toBeFalse();
      });

      it('should set property with the language if the value is valid.', () => {
        const languages: Array<PoLanguage> = [
          { description: 'português', language: 'pt' },
          { description: 'english', language: 'en' }
        ];
        const validValues = [languages];

        expectPropertiesValues(component, 'languagesList', validValues, validValues);
        expect(component.showLanguage).toBeTrue();
      });
    });

    it('p-literals: should update property with valid values.', () => {
      const validValues = { 'title': 'Custom Title', 'loginHint': 'Custom Login Hint' };

      expectPropertiesValues(component, 'literals', validValues, validValues);
    });

    it('p-authentication-url: should update property `authenticationUrl` with valid value', () => {
      const validValue = 'value';

      expectPropertiesValues(component, 'authenticationUrl', validValue, validValue);
    });

    it('p-authentication-url: should set `authenticationUrl` to `undefined` if not a string value', () => {
      const invalidValues = [undefined, null, true, false, 0, 1, {}, [1, 2]];

      expectPropertiesValues(component, 'authenticationUrl', invalidValues, undefined);
    });

    it('p-authentication-type: should update property `p-authentication-type` with valid values.', () => {
      const validValues = ['Basic', 'Bearer'];

      expectPropertiesValues(component, 'authenticationType', validValues, validValues);
    });

    it('p-authentication-type: should update property `p-authentication-type` with `Basic` if it`s an invalid value.', () => {
      const invalidValues = [false, true, {}, 'invalid', []];

      expectPropertiesValues(component, 'authenticationType', invalidValues, 'Basic');
    });

    it('p-blocked-url: should update property `p-blocked-url` with valid value', () => {
      const validValue = 'value';

      expectPropertiesValues(component, 'blockedUrl', validValue, validValue);
    });

    it('p-blocked-url: should set `p-blocked-url` to `undefined` if not a string value', () => {
      const invalidValues = [undefined, null, true, false, 0, 1, {}, [1, 2]];

      expectPropertiesValues(component, 'blockedUrl', invalidValues, undefined);
    });

    it('p-login: `loginChange` shouldn`t call `emitLoginChange` if authenticationUrl have a value', () => {
      component.authenticationUrl = 'url';
      const loginValue = 'value';

      spyOn(component.loginChange, 'emit');
      component.login = loginValue;

      expect(component.loginChange.emit).not.toHaveBeenCalled();
    });

    it('p-login: `loginChange` should call `emitLoginChange` if authenticationUrl doesn`t have a value', () => {
      component.authenticationUrl = undefined;
      const loginValue = 'value';

      spyOn(component.loginChange, 'emit');
      component.login = loginValue;

      expect(component.loginChange.emit).toHaveBeenCalled();
    });

    it('p-recovery: should update property `p-recovery` with valid value', () => {
      const validValue = ['value', () => {}, { 'url': 'http://url.com' }];

      expectPropertiesValues(component, 'recovery', validValue, validValue);
    });
  });

  describe('passwordErrors', () => {
    it('should update property with valid value', () => {
      const validValues = ['error'];

      expectPropertiesValues(component, 'passwordErrors', validValues, validValues);
    });

    it('should update property with empty array if value is invalid', () => {
      const inValidValues = [undefined, null, '', false];

      expectPropertiesValues(component, 'passwordErrors', inValidValues, []);
    });

    it('should call `setPasswordErrors` with value', () => {
      const value = ['error'];

      spyOn(component, <any>'setPasswordErrors');
      component.passwordErrors = value;

      expect(component['setPasswordErrors']).toHaveBeenCalledWith(value);
    });
  });

  describe('passwordErrors', () => {
    it('should update property with valid value', () => {
      const validValues = ['error'];

      expectPropertiesValues(component, 'passwordErrors', validValues, validValues);
    });

    it('should update property with empty array if value is invalid', () => {
      const inValidValues = [undefined, null, '', false];

      expectPropertiesValues(component, 'passwordErrors', inValidValues, []);
    });

    it('should call `setPasswordErrors` with value', () => {
      const value = ['error'];

      spyOn(component, <any>'setPasswordErrors');
      component.passwordErrors = value;

      expect(component['setPasswordErrors']).toHaveBeenCalledWith(value);
    });
  });

  describe('Methods: ', () => {
    describe('onLoginSubmit', () => {
      it(`should call 'loginService.onLogin', 'sessionStorage.setItem' and 'openInternalLink'
      and define loginSubscription if authenticationUrl has value`, () => {
        const response = { status: 204, user: 'admin', name: 'Administrator' };
        const loginForm = {
          login: 'po@po-ui.com',
          password: '123@456',
          rememberUser: false
        };

        component.login = loginForm.login;
        component.loginSubscription = undefined;
        component.password = loginForm.password;
        component.authenticationUrl = 'url';
        component['rememberUser'] = loginForm.rememberUser;

        spyOn(component.loginSubmit, 'emit');
        spyOn(sessionStorage, 'setItem');
        spyOn(component, <any>'openInternalLink');
        spyOn(servicePageLogin, <any>'onLogin').and.returnValue(getObservable(response));

        component.onLoginSubmit();

        expect(servicePageLogin['onLogin']).toHaveBeenCalledWith(
          component.authenticationUrl,
          component.authenticationType,
          loginForm
        );
        expect(sessionStorage['setItem']).toHaveBeenCalledWith('PO_USER_LOGIN', JSON.stringify(response));
        expect(component['openInternalLink']).toHaveBeenCalledWith('/');
        expect(component.loginSubscription).toBeDefined();
        expect(component.loginSubmit.emit).not.toHaveBeenCalled();
      });

      it(`expect to apply property values and call 'redirectBlockedUrl' if error.code is 400`, () => {
        const loginForm = {
          login: 'po@po-ui.com',
          password: '123@456',
          rememberUser: false
        };

        const error = {
          error: {
            code: '400',
            message: 'Oops! Auto login failed. Please enter your username and password to log in.',
            detailedMessage: 'Invalid credentials',
            maxAttemptsRemaining: 2,
            loginWarnings: ['Usuário e/ou senha inválidos'],
            passwordWarnings: ['Usuário e/ou senha inválidos'],
            blockedUrl: 'https://po-ui.io/documentation/po-page-blocked-user'
          }
        };

        component.login = loginForm.login;
        component.password = loginForm.password;
        component.authenticationUrl = 'url';
        component.exceededAttemptsWarning = 3;
        component['rememberUser'] = loginForm.rememberUser;
        component.loginSubscription = undefined;

        spyOn(component, <any>'redirectBlockedUrl');
        spyOn(servicePageLogin, <any>'onLogin').and.returnValue(throwError(error));

        component.onLoginSubmit();

        expect(component.loginSubscription).toBeDefined();
        expect(component.exceededAttemptsWarning).toBe(error.error.maxAttemptsRemaining);
        expect(component.loginErrors).toEqual(error.error.loginWarnings);
        expect(component.passwordErrors).toEqual(error.error.passwordWarnings);
        expect(component.blockedUrl).toBe(error.error.blockedUrl);
        expect(component['redirectBlockedUrl']).toHaveBeenCalledWith(
          component.exceededAttemptsWarning,
          component.blockedUrl
        );
      });

      it(`expect to apply property values and call 'redirectBlockedUrl' if error.code is 401`, () => {
        const loginForm = {
          login: 'po@po-ui.com',
          password: '123@456',
          rememberUser: false
        };

        const error = {
          error: {
            code: '401',
            message: 'Oops! Auto login failed. Please enter your username and password to log in.',
            detailedMessage: 'Invalid credentials',
            maxAttemptsRemaining: 2,
            loginWarnings: ['Usuário e/ou senha inválidos'],
            passwordWarnings: ['Usuário e/ou senha inválidos'],
            blockedUrl: 'https://po-ui.io/documentation/po-page-blocked-user'
          }
        };

        component.login = loginForm.login;
        component.password = loginForm.password;
        component.authenticationUrl = 'url';
        component.exceededAttemptsWarning = 3;
        component['rememberUser'] = loginForm.rememberUser;
        component.loginSubscription = undefined;

        spyOn(component, <any>'redirectBlockedUrl');
        spyOn(servicePageLogin, <any>'onLogin').and.returnValue(throwError(error));

        component.onLoginSubmit();

        expect(component.loginSubscription).toBeDefined();
        expect(component.exceededAttemptsWarning).toBe(error.error.maxAttemptsRemaining);
        expect(component.loginErrors).toEqual(error.error.loginWarnings);
        expect(component.passwordErrors).toEqual(error.error.passwordWarnings);
        expect(component.blockedUrl).toBe(error.error.blockedUrl);
        expect(component['redirectBlockedUrl']).toHaveBeenCalledWith(
          component.exceededAttemptsWarning,
          component.blockedUrl
        );
      });

      it(`expect not be called 'redirectBlockedUrl' if error.code is 404`, () => {
        const loginForm = {
          login: 'po@po-ui.com',
          password: '123@456',
          rememberUser: false
        };

        const error = {
          error: {
            code: '404',
            message: 'Not Found.',
            detailedMessage: 'Not Found.'
          }
        };

        component.login = loginForm.login;
        component.password = loginForm.password;
        component.authenticationUrl = 'url';
        component['rememberUser'] = loginForm.rememberUser;
        component.loginSubscription = undefined;

        spyOn(component, <any>'redirectBlockedUrl');
        spyOn(servicePageLogin, <any>'onLogin').and.returnValue(throwError(error));

        component.onLoginSubmit();

        expect(component.loginSubscription).toBeDefined();
        expect(component['redirectBlockedUrl']).not.toHaveBeenCalled();
      });

      it('should call `loginSubmit.emit` in `onLoginSubmit` with login values if doesn`t have authenticationUrl', () => {
        const loginForm = {
          login: 'po@po-ui.com',
          password: '123@456',
          rememberUser: false
        };

        component.login = loginForm.login;
        component.password = loginForm.password;
        component['rememberUser'] = loginForm.rememberUser;
        component.authenticationUrl = undefined;

        spyOn(component.loginSubmit, 'emit');

        component.onLoginSubmit();

        expect(component.loginSubmit.emit).toHaveBeenCalledWith(loginForm);
      });

      it('should call `loginSubmit.emit` in `onLoginSubmit` with customField property value', () => {
        const loginForm = {
          login: 'po@po-ui.com',
          password: '123@456',
          rememberUser: false
        };

        component.customField = 'domain';

        component = Object.assign(component, loginForm);

        spyOn(component.loginSubmit, 'emit');

        component.onLoginSubmit();

        loginForm[<string>component.customField] = undefined;
        expect(component.loginSubmit.emit).toHaveBeenCalledWith(loginForm);
      });
    });

    it('getDefaultCustomFieldObject: should return custom field object with property `domain`', () => {
      const customFieldObject = component['getDefaultCustomFieldObject']('domain');

      expect(typeof customFieldObject === 'object').toBeTruthy();
      expect(customFieldObject.property).toBe('domain');
    });

    it('closePopover: should update value of `showExceededAttemptsWarning`', () => {
      component.closePopover();

      expect(component.showExceededAttemptsWarning).toBeFalsy();
    });

    it('redirectBlockedUrl: should call `openExternalLink` if blockedUrl is an external link', () => {
      const attempts = 0;
      const blockedUrl = 'http://url.com.br';

      spyOn(UtilFunctions, 'isExternalLink').and.returnValue(true);
      spyOn(component, <any>'openExternalLink');
      spyOn(component, <any>'openInternalLink');

      component['redirectBlockedUrl'](attempts, blockedUrl);

      expect(UtilFunctions.isExternalLink).toHaveBeenCalledWith(blockedUrl);
      expect(component['openExternalLink']).toHaveBeenCalledWith(blockedUrl);
      expect(component['openInternalLink']).not.toHaveBeenCalled();
    });

    it('redirectBlockedUrl: should call `openInternalLink` if blockedUrl is an internal link', () => {
      const attempts = 0;
      const blockedUrl = '/url';

      spyOn(UtilFunctions, 'isExternalLink').and.returnValue(false);
      spyOn(component, <any>'openExternalLink');
      spyOn(component, <any>'openInternalLink');

      component['redirectBlockedUrl'](attempts, blockedUrl);

      expect(UtilFunctions.isExternalLink).toHaveBeenCalledWith(blockedUrl);
      expect(component['openInternalLink']).toHaveBeenCalledWith(blockedUrl);
      expect(component['openExternalLink']).not.toHaveBeenCalled();
    });

    it('redirectBlockedUrl: shouldn`t call `openInternalLink` nor `openExternalLink` if attempts is different from 0', () => {
      const attempts = 1;
      const blockedUrl = '/url';

      spyOn(UtilFunctions, 'isExternalLink');
      spyOn(component, <any>'openExternalLink');
      spyOn(component, <any>'openInternalLink');

      component['redirectBlockedUrl'](attempts, blockedUrl);

      expect(UtilFunctions.isExternalLink).not.toHaveBeenCalled();
      expect(component['openInternalLink']).not.toHaveBeenCalled();
      expect(component['openExternalLink']).not.toHaveBeenCalled();
    });

    it('openInternalLink: should call `router.navigate`', () => {
      const url = '/url';
      component['openInternalLink'](url);

      expect(routerStub.navigate).toHaveBeenCalled();
    });

    it('openExternalLink: should call `window.open`', () => {
      const url = '/url';
      spyOn(window, 'open');

      component['openExternalLink'](url);

      expect(window.open).toHaveBeenCalled();
    });

    it('ngOnDestroy: should `unsubscribe` loginSubscription', () => {
      const fakeSubscription = <any>{ unsubscribe: () => {} };
      component['loginSubscription'] = fakeSubscription;

      spyOn(fakeSubscription, <any>'unsubscribe');

      component.ngOnDestroy();

      expect(fakeSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('ngOnDestroy: should not unsubscribe if loginSubscription is falsy.', () => {
      const fakeSubscription = <any>{ unsubscribe: () => {} };
      component['loginSubscription'] = fakeSubscription;

      spyOn(fakeSubscription, <any>'unsubscribe');

      component['loginSubscription'] = undefined;
      component.ngOnDestroy();

      expect(fakeSubscription.unsubscribe).not.toHaveBeenCalled();
    });
  });
});
