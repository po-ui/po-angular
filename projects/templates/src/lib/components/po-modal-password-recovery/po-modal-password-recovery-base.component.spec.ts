import { Directive } from '@angular/core';

import { PoLanguageService } from '@po-ui/ng-components';

import { PoModalPasswordRecoveryBaseComponent } from './po-modal-password-recovery-base.component';

import { expectPropertiesValues } from '../../util-test/util-expect.spec';

@Directive()
class PoModalPasswordRecoveryComponent extends PoModalPasswordRecoveryBaseComponent {
  completed(): void {}
  open(): void {}
  openConfirmation(): void {}
  openSmsCode(): void {}
}

describe('PoModalPasswordRecoveryBaseComponent:', () => {
  const poLanguageService: PoLanguageService = new PoLanguageService();
  let component: PoModalPasswordRecoveryComponent;

  beforeEach(() => {
    component = new PoModalPasswordRecoveryComponent(poLanguageService);
  });

  it('should be created', () => {
    expect(component instanceof PoModalPasswordRecoveryBaseComponent).toBeTruthy();
  });

  describe('Properties', () => {
    it('p-type: should update property `p-type` with valid values.', () => {
      const validValues = ['all', 'email', 'sms'];

      expectPropertiesValues(component, 'type', validValues, validValues);
    });

    it('p-type: should update property `p-type` with `email` if values are invalid.', () => {
      const invalidValues = [false, true, {}, 'invalid', []];

      expectPropertiesValues(component, 'type', invalidValues, 'email');
    });

    it('p-contact-email: should call `concatenateSMSErrorMessage`.', () => {
      component.contactEmail = 'email';

      spyOn(component, <any>'concatenateSMSErrorMessage')(component.contactEmail);

      expect(component['concatenateSMSErrorMessage']).toHaveBeenCalledWith(component.contactEmail);
    });

    it('p-phone-mask: should update property `phoneMask` with valid values.', () => {
      const validValues = ['(99) 9999-9999', '9999', '000000'];

      expectPropertiesValues(component, 'phoneMask', validValues, validValues);
    });

    it('p-phone-mask: should update property `phoneMask` with `(99) 9999-9999` if values are invalid.', () => {
      const invalidValues = [false, undefined, null, ''];

      expectPropertiesValues(component, 'phoneMask', invalidValues, '(99) 99999-9999');
    });

    it('p-phone-mask: should update properties `maxLength` and `minLength` with `phoneMask` length.', () => {
      const phoneMask = '(99) 99999-9999';
      component.phoneMask = phoneMask;

      expect(component.minLength).toBe(phoneMask.length);
      expect(component.maxLength).toBe(phoneMask.length);
    });
  });

  describe('Methods', () => {
    it('concatenateSMSErrorMessage: should concatenate if `contactEmail` has value: ', () => {
      const contactEmail = 'email';
      const expectedResult = `${component.literals.smsCodeErrorMessagePhrase} ${component.literals.prepositionIn} ${contactEmail}.`;
      const methodReturn = component['concatenateSMSErrorMessage'](contactEmail);

      expect(methodReturn).toBe(expectedResult);
    });

    it('concatenateSMSErrorMessage: should return default literal value if `contactEmail` has value: ', () => {
      const contactEmail = undefined;
      const expectedResult = `${component.literals.smsCodeErrorMessagePhrase}`;
      const methodReturn = component['concatenateSMSErrorMessage'](contactEmail);

      expect(methodReturn).toBe(expectedResult);
    });

    it('concatenateSMSErrorMessage: should return default literal value if `contactEmail` is an empty string: ', () => {
      const contactEmail = '';
      const expectedResult = `${component.literals.smsCodeErrorMessagePhrase}`;
      const methodReturn = component['concatenateSMSErrorMessage'](contactEmail);

      expect(methodReturn).toBe(expectedResult);
    });
  });
});
