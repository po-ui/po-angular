import { PoPageBlockedUserBaseComponent } from './po-page-blocked-user-base.component';

import { expectPropertiesValues } from '../../util-test/util-expect.spec';

import { PoPageBlockedUserReasonParams } from './interfaces/po-page-blocked-user-reason-params.interface';

describe('PoPageBlockedUserBaseComponent:', () => {
  let component: PoPageBlockedUserBaseComponent;

  beforeEach(() => {
    component = new PoPageBlockedUserBaseComponent();
  });

  it('should be created', () => {
    expect(component instanceof PoPageBlockedUserBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('p-params: should update property `p-params` with invalid values.', () => {
      component.params = { attempts: 5, days: 90, hours: 24 };

      const invalidParams = [false, true, {}, 'invalid', []];

      expectPropertiesValues(component, 'params', invalidParams, { attempts: 5, days: 90, hours: 24 });
    });

    it('p-params: should update property `p-params` with valid values.', () => {
      const validParams: PoPageBlockedUserReasonParams = { attempts: 10, days: 10, hours: 10 };

      expectPropertiesValues(component, 'params', validParams, validParams);
    });

    it('p-reason: should update property `p-reason` with valid values.', () => {
      const validValues = ['none', 'exceededAttempts', 'expiredPassword'];

      expectPropertiesValues(component, 'reason', validValues, validValues);
    });

    it('p-reason: should update property `p-reason` with invalid values.', () => {
      const invalidValues = [false, true, {}, 'invalid', []];

      expectPropertiesValues(component, 'reason', invalidValues, 'none');
    });

    it('p-url-back: should set property `p-url-back` with passed value.', () => {
      const value: string = '/home';

      expectPropertiesValues(component, 'urlBack', value, value);
    });
  });
});
