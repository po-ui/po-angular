import { expectPropertiesValues } from '../../util-test/util-expect.spec';

import { PoToolbarBaseComponent } from './po-toolbar-base.component';

describe('PoToolbarBaseComponent:', () => {
  const component = new PoToolbarBaseComponent();

  it('should be created', () => {
    expect(component instanceof PoToolbarBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('notificationNumber: should set with invalid values and receive 0 value', () => {
      const invalidValues = [undefined, 'menu', true, false, NaN, [], {}];

      expectPropertiesValues(component, 'notificationNumber', invalidValues, 0);
    });

    it('notificationNumber: should set with valid values', () => {
      const validValues = [2, 2.2, '2'];

      expectPropertiesValues(component, 'notificationNumber', validValues, 2);
    });
  });

  describe('Methods: ', () => {
    describe('isShowProfile:', () => {
      beforeEach(() => {
        component.profile = undefined;
        component.profileActions = undefined;
      });

      it('should return `true` if have a profile.', () => {
        component.profile = { title: 'Jhony', avatar: 'link' };

        expect(component.isShowProfile).toBe(true);
      });

      it('should return `true` if have a profileItems.', () => {
        component.profileActions = [{ label: 'Ação', action: () => {} }];

        expect(component.isShowProfile).toBe(true);
      });

      it('should return `false` if not have a profile or profileItems', () => {
        component.profile = undefined;
        component.profileActions = undefined;

        expect(component.isShowProfile).toBe(false);
      });
    });
  });
});
