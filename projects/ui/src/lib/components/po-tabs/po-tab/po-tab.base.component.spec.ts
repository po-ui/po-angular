import { Directive } from '@angular/core';

import { expectPropertiesValues } from '../../../util-test/util-expect.spec';

import { PoTabBaseComponent } from './po-tab-base.component';

@Directive()
class PoTabComponent extends PoTabBaseComponent {
  setDisplayOnActive() {}
}

describe('PoTabBaseComponent', () => {
  const component: PoTabComponent = new PoTabComponent();

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    const expectedReturnTrue = true;
    const expectedReturnFalse = false;

    it('active: should set `active` with valid values', () => {
      const validValues = ['', true, 1, [], {}, 'true'];

      expectPropertiesValues(component, 'active', validValues, expectedReturnTrue);
    });

    it('active: should set `active` to false with invalid values', () => {
      const invalidValues = [null, undefined, NaN, false, 0, 'false', 'teste'];

      expectPropertiesValues(component, 'active', invalidValues, expectedReturnFalse);
    });

    it('active: should call `setDisplayOnActive`', () => {
      spyOn(component, <any>'setDisplayOnActive');
      component.active = true;
      expect(component['setDisplayOnActive']).toHaveBeenCalled();
    });

    it('disabled: should set `disabled` with valid values', () => {
      const validValues = ['', true, 1, [], {}, 'true'];

      expectPropertiesValues(component, 'disabled', validValues, expectedReturnTrue);
    });

    it('disabled: should set `disabled` to false with invalid values', () => {
      const invalidValues = [null, undefined, NaN, false, 0, 'false', 'teste'];

      expectPropertiesValues(component, 'disabled', invalidValues, expectedReturnFalse);
    });

    it('hide: should set `hide` with valid values', () => {
      const validValues = ['', true, 1, [], {}, 'true'];

      expectPropertiesValues(component, 'hide', validValues, expectedReturnTrue);
    });

    it('hide: should set `hide` to false with invalid values', () => {
      const invalidValues = [null, undefined, NaN, false, 0, 'false', 'teste'];

      expectPropertiesValues(component, 'hide', invalidValues, expectedReturnFalse);
    });
  });
});
