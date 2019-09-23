import { TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';

import { configureTestSuite, expectPropertiesValues, getObservable } from '../../util-test/util-expect.spec';
import { poLocaleDefault } from './../../utils/util';
import * as UtilFunctions from './../../utils/util';

import {
  PoPageLoginBaseComponent,
  poPageLoginLiteralIn,
  poPageLoginLiteralTo,
  poPageLoginLiteralsDefault
} from './po-page-login-base.component';
import { PoPageLoginCustomField } from './interfaces/po-page-login-custom-field.interface';
import { PoPageLoginService } from './po-page-login.service';

const routerStub = {
  navigate: jasmine.createSpy('navigate')
};

export class PoPageLoginComponent extends PoPageLoginBaseComponent {
  protected setLoginErrors(value: Array<string>): void { }
  protected setPasswordErrors(value: Array<string>): void { }
}

describe('ThPageLoginBaseComponent: ', () => {

  let component: PoPageLoginBaseComponent;
  let servicePageLogin: PoPageLoginService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [ PoPageLoginService ]
    });
  });

  const booleanValidTrueValues = [true, 'true', 1, ''];
  const booleanValidFalseValues = [false, 'false', 0];
  const booleanInvalidValues = [undefined, null, 2, 'string'];

  beforeEach(() => {
    servicePageLogin = new PoPageLoginService(undefined);
    component = new PoPageLoginComponent(servicePageLogin, <any>routerStub);
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
        options: [{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }],
        url: 'https://portinari.io/sample/api/comboOption/heroes',
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
        url: 'https://portinari.io/sample/api/comboOption/heroes',
        fieldValue: 'nickname'
      };
      expect(component.customFieldType).toBe('combo');
    });

    it('p-custom-field: should update with object value', () => {
      const customField: PoPageLoginCustomField = {
        property: 'domain',
        value: 'jv01',
        pattern: '[a-z]',
        options: [{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }],
        url: 'https://portinari.io/sample/api/comboOption/heroes',
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
      const validValuesCustomField = ['/register', 'https://www.google.com'];

      expectPropertiesValues(component, 'registerUrl', validValuesCustomField, validValuesCustomField);
    });

    it('p-register-url: should update with invalid values', () => {
      const validValuesCustomField = [undefined, null, false, true, 1, [], NaN, {}];

      expectPropertiesValues(component, 'registerUrl', validValuesCustomField, undefined);
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

    describe('contactEmail', () => {
      it('should call `setLoginHintLiteral` with `selectedLanguage` and `contactEmail` as parameteres', () => {
        const email = 'test@mail.com';
        component.selectedLanguage = 'pt';

        spyOn(component, <any>'setLoginHintLiteral').and.returnValue(email);

        expectPropertiesValues(component, 'contactEmail', email, email);
        expect(component.setLoginHintLiteral).toHaveBeenCalledWith(component.selectedLanguage, component.contactEmail);
      });

      it('should call `setLoginHintLiteral` with `browserLanguage` and `contactEmail` as parameters', () => {
        const email = 'text@mail.com';
        component.selectedLanguage = undefined;

        spyOn(component, <any>'setLoginHintLiteral').and.returnValue(email);

        expectPropertiesValues(component, 'contactEmail', email, email);
        expect(component.setLoginHintLiteral).toHaveBeenCalledWith(UtilFunctions.browserLanguage(), component.contactEmail);
      });

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
    describe('productName', () => {
      it('should call `setTitleLiteral` with `selectedLanguage` and `productName` as parameteres', () => {
        const email = 'test@mail.com';
        component.selectedLanguage = 'pt';

        spyOn(component, <any>'setTitleLiteral').and.returnValue(email);

        expectPropertiesValues(component, 'productName', email, email);
        expect(component.setTitleLiteral).toHaveBeenCalledWith(component.selectedLanguage, component.productName);
      });

      it('should call `setTitleLiteral` with `browserLanguage` and `productName` as parameters', () => {
        const email = 'text@mail.com';
        component.selectedLanguage = undefined;

        spyOn(component, <any>'setTitleLiteral').and.returnValue(email);

        expectPropertiesValues(component, 'productName', email, email);
        expect(component.setTitleLiteral).toHaveBeenCalledWith(UtilFunctions.browserLanguage(), component.productName);
      });

    });

    it('p-literals: should set `containsCustomLiterals` with true if `literals.title` and `literalsDefault.loginHint` don`t match', () => {
      component['_literals'] = { title: 'Title', loginHint: poPageLoginLiteralsDefault[poLocaleDefault].loginHint };
      component.selectedLanguage = poLocaleDefault;
      const validLiterals = component['_literals'];

      spyOn(component, <any>'getLiterals');

      expectPropertiesValues(component, 'literals', validLiterals, validLiterals);
      expect(component.getLiterals).toHaveBeenCalledWith(poLocaleDefault, validLiterals);
      expect(component.containsCustomLiterals).toBe(true);

    });

    it('p-literals: should set `containsCustomLiterals` with false if `literals.title` and `literals.loginHint` are undefined', () => {
      component['_literals'] = { title: undefined, loginHint: undefined };
      component.selectedLanguage = poLocaleDefault;
      const validLiterals = component['_literals'];

      spyOn(component, <any>'getLiterals');

      expectPropertiesValues(component, 'literals', validLiterals, validLiterals);
      expect(component.getLiterals).toHaveBeenCalledWith(poLocaleDefault, validLiterals);
      expect(component.containsCustomLiterals).toBe(false);
    });

    it('p-literals: should set `containsCustomLiterals` with false if `literals.title` and `literalsDefault.loginHint` match', () => {
      component['_literals'] = {
        title: poPageLoginLiteralsDefault[poLocaleDefault].title,
        loginHint: poPageLoginLiteralsDefault[poLocaleDefault].loginHint
      };
      component.selectedLanguage = poLocaleDefault;
      const validLiterals = component['_literals'];

      spyOn(component, <any>'getLiterals');

      expectPropertiesValues(component, 'literals', validLiterals, validLiterals);
      expect(component.getLiterals).toHaveBeenCalledWith(poLocaleDefault, validLiterals);
      expect(component.containsCustomLiterals).toBe(false);

    });

    xit('p-literals: should set `containsCustomLiterals` with true if `literals.loginHint` and `literalsDefault.loginHint` match', () => {
      component['_literals'] = poPageLoginLiteralsDefault[poLocaleDefault];
      const validLiterals = component['_literals'];

      expectPropertiesValues(component, 'literals', validLiterals, validLiterals);

      expect(component.containsCustomLiterals).toBe(true);
    });

    it('p-literals: should call `getLiterals` with `selectedLanguage` and `literals` as parameters', () => {
      component['_literals'] = { title: 'Title' };
      component.selectedLanguage = 'pt';
      const validLiterals = component['_literals'];

      spyOn(component, <any>'getLiterals');

      expectPropertiesValues(component, 'literals', validLiterals, validLiterals);
      expect(component.getLiterals).toHaveBeenCalledWith('pt', validLiterals);
    });

    it('p-literals: should call `getLiterals` with selected Russian language and `literals` as parameters', () => {
      component['_literals'] = { title: 'Title' };
      component.selectedLanguage = 'ru';
      const validLiterals = component['_literals'];

      spyOn(component, <any>'getLiterals');

      expectPropertiesValues(component, 'literals', validLiterals, validLiterals);
      expect(component.getLiterals).toHaveBeenCalledWith('ru', validLiterals);
    });

    it('p-literals: should call `getLiterals` with `browserLanguage` and `literals` as parameters', () => {
      component['_literals'] = { title: 'Title' };
      const validLiterals = component['_literals'];

      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue(poLocaleDefault);
      spyOn(component, <any>'getLiterals');

      expectPropertiesValues(component, 'literals', validLiterals, validLiterals);
      expect(component.getLiterals).toHaveBeenCalledWith('pt', validLiterals);
    });

    it('p-literals: should update property with default literals if it contains invalid values', () => {
      const invalidValues = [null, undefined, false, true, '', 'literals', 0, 10, [], [1, 2], () => {}];

      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue(poLocaleDefault);

      expectPropertiesValues(component, 'literals', invalidValues, poPageLoginLiteralsDefault[poLocaleDefault]);
    });

    it('p-authentication-url: should update property `authenticationUrl` with valid value', () => {
      const validValue = 'value';

      expectPropertiesValues(component, 'authenticationUrl', validValue, validValue);
    });

    it('p-authentication-url: should set `authenticationUrl` to `undefined` if not a string value' , () => {
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

    it('p-blocked-url: should set `p-blocked-url` to `undefined` if not a string value' , () => {
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
  });

  it('p-literals: sbhouldn`t call `getLiterals` and set `containsCustomLiterals` with false if doesn`t contain a value', () => {
    const invalidValue = [undefined];

    spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue(poLocaleDefault);
    spyOn(component, <any>'getLiterals');

    expectPropertiesValues(component, 'literals', invalidValue, poPageLoginLiteralsDefault[poLocaleDefault]);
    expect(component.getLiterals).not.toHaveBeenCalled();
    expect(component.containsCustomLiterals).toBe(false);

  });

  describe('passwordErrors', () => {

    it('should update property with valid value', () => {
      const validValues = ['error'];

      expectPropertiesValues(component, 'passwordErrors', validValues, validValues);
    });

    it('should update property with empty array if value is invalid', () => {
      const inValidValues = [undefined, null, '', false];

      expectPropertiesValues(component, 'passwordErrors', inValidValues,  []);
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

      expectPropertiesValues(component, 'passwordErrors', inValidValues,  []);
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
          login: 'po@portinari.com',
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
        spyOn(component, <any> 'openInternalLink');
        spyOn(servicePageLogin, <any>'onLogin').and.returnValue(getObservable(response));

        component.onLoginSubmit();

        expect(servicePageLogin['onLogin']).toHaveBeenCalledWith(component.authenticationUrl, component.authenticationType, loginForm);
        expect(sessionStorage['setItem']).toHaveBeenCalledWith('PO_USER_LOGIN', JSON.stringify(response));
        expect(component['openInternalLink']).toHaveBeenCalledWith('/');
        expect(component.loginSubscription).toBeDefined();
        expect(component.loginSubmit.emit).not.toHaveBeenCalled();
      });

      it(`expect to apply property values and call 'redirectBlockedUrl' if error.code is 400`, () => {
        const loginForm = {
          login: 'po@portinari.com',
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
            blockedUrl: 'https://portinari.io/documentation/po-page-blocked-user'
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
        expect(component['redirectBlockedUrl']).toHaveBeenCalledWith(component.exceededAttemptsWarning, component.blockedUrl);
      });

      it(`expect to apply property values and call 'redirectBlockedUrl' if error.code is 401`, () => {
        const loginForm = {
          login: 'po@portinari.com',
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
            blockedUrl: 'https://portinari.io/documentation/po-page-blocked-user'
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
        expect(component['redirectBlockedUrl']).toHaveBeenCalledWith(component.exceededAttemptsWarning, component.blockedUrl);
      });

      it(`expect not be called 'redirectBlockedUrl' if error.code is 404`, () => {
        const loginForm = {
          login: 'po@portinari.com',
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
          login: 'po@portinari.com',
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
          login: 'po@portinari.com',
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

    it('concatenate: should concatenate the received parameters', () => {
      const expectedResult = component['concatenate']('Welcome', 'to', 'Company');

      expect(expectedResult).toBe('Welcome to Company');
    });

    it(`concatenateLiteral: should call 'concatenate' if 'value' has a value
      and 'literals.title' contains 'value'`, () => {
      const value = 'Portal RH';
      const currentLiteral = 'title';
      const defaultLiteral = 'Welcome';
      const prepositionLiteral = 'to';

      component.literals = { title: 'Portal RH'};

      spyOn(component, <any>'concatenate').and.returnValue(value);
      component['concatenateLiteral'](value, currentLiteral, defaultLiteral, prepositionLiteral);

      expect(component['concatenate']).toHaveBeenCalledWith(defaultLiteral, prepositionLiteral, value);
    });

    it(`concatenateLiteral: should call 'concatenate' if 'value' has a value
    and 'literals.title' contains 'defaultLiteral'`, () => {
      const value = 'Portal RH';
      const currentLiteral = 'title';
      const defaultLiteral = 'Welcome';
      const prepositionLiteral = 'to';

      component.literals = { title: poPageLoginLiteralsDefault['en'].title };
      // component.literals.title = poPageLoginLiteralsDefault['en'].title;

      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue('en');
      spyOn(component, <any>'getLiterals').and.callThrough();
      spyOn(component, <any>'concatenate').and.returnValue(value);

      component['concatenateLiteral'](value, currentLiteral, defaultLiteral, prepositionLiteral);

      expect(component['concatenate']).toHaveBeenCalledWith(defaultLiteral, prepositionLiteral, value);
    });

    it(`concatenateLiteral: shouldn't call 'concatenate' if 'value' doesn't have any value`, () => {
      const value = undefined;
      const currentLiteral = 'title';
      const defaultLiteral = 'Welcome';
      const prepositionLiteral = 'to';

      component.literals = { title: poPageLoginLiteralsDefault['en'].title };

      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue('en');
      spyOn(component, <any>'concatenate');

      component['concatenateLiteral'](value, currentLiteral, defaultLiteral, prepositionLiteral);

      expect(component['concatenate']).not.toHaveBeenCalled();
    });

    it(`concatenateLiteral: shouldn't call 'concatenate' if 'value' contains value
      however 'literals.title' is different from 'defaultLiteral' and 'value'`, () => {
      const value = 'Portal RH';
      const currentLiteral = 'title';
      const defaultLiteral = 'Welcome';
      const prepositionLiteral = 'to';

      component.literals = { title: 'Datasul' };

      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue('en');
      spyOn(component, <any>'concatenate');

      component['concatenateLiteral'](value, currentLiteral, defaultLiteral, prepositionLiteral);

      expect(component['concatenate']).not.toHaveBeenCalled();
    });

    it(`setLoginHintLiteral: should call 'concatenateLiteral' if has value`, () => {
      const email = 'email@mail.com';
      const defaultLoginHintLiteral = poPageLoginLiteralsDefault[poLocaleDefault].loginHint;
      const prepositionLiteral = poPageLoginLiteralIn[poLocaleDefault];

      spyOn(component, <any>'concatenateLiteral');

      component.setLoginHintLiteral(poLocaleDefault, email);

      expect(component['concatenateLiteral']).toHaveBeenCalledWith(email, 'loginHint', defaultLoginHintLiteral, prepositionLiteral);
    });

    it('setLoginHintLiteral: shouldn`t call `concatenateLiteral` if does not have value', () => {
      const email = undefined;

      spyOn(component, <any>'concatenateLiteral');

      component.setLoginHintLiteral(poLocaleDefault, email);

      expect(component['concatenateLiteral']).not.toHaveBeenCalled();
    });

    it(`setLoginHintLiteral: should set literals.loginHint with default value if value is undefined`, () => {
      const email = undefined;

      spyOn(component, <any>'concatenateLiteral');

      component.setLoginHintLiteral(poLocaleDefault, email);

      expect(component.literals.loginHint).toBe(poPageLoginLiteralsDefault[poLocaleDefault].loginHint);
      expect(component['concatenateLiteral']).not.toHaveBeenCalled();
    });

    it(`setTitleLiteral: should call 'concatenateLiteral' if contains value`, () => {
      const title = 'email@mail.com';
      const defaultTitleLiteral = poPageLoginLiteralsDefault[poLocaleDefault].title;
      const prepositionLiteral = poPageLoginLiteralTo[poLocaleDefault];

      spyOn(component, <any>'concatenateLiteral');

      component.setTitleLiteral(poLocaleDefault, title);

      expect(component['concatenateLiteral']).toHaveBeenCalledWith(title, 'title', defaultTitleLiteral, prepositionLiteral);
    });

    it('setTitleLiteral: shouldn`t call `concatenateLiteral` if does not have value', () => {
      const title = undefined;

      spyOn(component, <any>'concatenateLiteral');

      component.setTitleLiteral(poLocaleDefault, title);

      expect(component['concatenateLiteral']).not.toHaveBeenCalled();
    });

    it(`setTitleLiteral: should set literals.title with default value if value is undefined`, () => {
      const title = undefined;
      component.literals = poPageLoginLiteralsDefault[poLocaleDefault];

      spyOn(component, <any>'concatenateLiteral');

      component.setTitleLiteral(poLocaleDefault, title);

      expect(component.literals.title).toBe(poPageLoginLiteralsDefault[poLocaleDefault].title);
      expect(component['concatenateLiteral']).not.toHaveBeenCalled();
    });

    it(`setTitleLiteral: shouldn´t set literals.title with default value if value is undefined`, () => {
      const title = undefined;
      const literals = { title, loginHint: 'Teste 1' };

      component.literals = { ...literals };

      spyOn(component, <any>'concatenateLiteral');

      component.setTitleLiteral(poLocaleDefault, title);

      expect(component.literals.title).toEqual(title);
      expect(component['concatenateLiteral']).not.toHaveBeenCalled();
    });

    it(`getLiterals: should set 'p-literals' with browser language if 'language' and 'value' parameters haven't been passed
      and the browser is set with an unsupported language`, () => {
      component.literals = {};

      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue('aa');

      component.getLiterals(poLocaleDefault);

      expect(component.literals).toEqual(poPageLoginLiteralsDefault[poLocaleDefault]);
    });

    it(`getLiterals: should set 'p-literals' with browser language if 'language' and 'value' parameters haven't been passed and
      browser is set with a supported language`, () => {
      component.literals = {};

      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue('es');

      component.getLiterals();

      expect(component.literals).toEqual(poPageLoginLiteralsDefault['es']);
    });

    it(`getLiterals: should set 'p-literals' with browser language when has been passed only a value as parameter`, () => {
      const customLiterals = {};
      component.literals = {};

      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue('es');

      component.getLiterals(undefined, customLiterals);

      expect(component.literals).toEqual(poPageLoginLiteralsDefault['es']);
    });

    it(`getLiterals: should set 'p-literals' in spanish if the passed 'language' is 'es'`, () => {
      component.literals = {};

      component.getLiterals('es');

      expect(component.literals).toEqual(poPageLoginLiteralsDefault['es']);
    });

    it(`getLiterals: should set 'p-literals' in portuguese if the passed 'language' is 'pt'`, () => {
      component.literals = {};

      component.getLiterals('pt');

      expect(component.literals).toEqual(poPageLoginLiteralsDefault['pt']);
    });

    it(`getLiterals: should set 'p-literals' in english if the passed 'language' is 'en'`, () => {
      component.literals = {};

      component.getLiterals('en');

      expect(component.literals).toEqual(poPageLoginLiteralsDefault['en']);
    });

    it('getLiterals: should set `p-literals` custom literals when the developer set differ literals ', () => {
      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue('en');

      const customLiterals = {
        title: 'Custom title',
        submitLabel: 'Submit custom',
        highlightInfo: 'Custom info'
      };

      const expectedLiterals = {
        ...poPageLoginLiteralsDefault['en'],
        ...customLiterals
      };

      component.getLiterals('en', customLiterals);

      expect(component.literals).toEqual(expectedLiterals);
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

      spyOn(fakeSubscription, <any> 'unsubscribe');

      component.ngOnDestroy();

      expect(fakeSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('ngOnDestroy: should not unsubscribe if loginSubscription is falsy.', () => {
      const fakeSubscription = <any>{ unsubscribe: () => {} };
      component['loginSubscription'] = fakeSubscription;

      spyOn(fakeSubscription, <any> 'unsubscribe');

      component['loginSubscription'] = undefined;
      component.ngOnDestroy();

      expect(fakeSubscription.unsubscribe).not.toHaveBeenCalled();
    });

  });
});
