import { ElementRef } from '@angular/core';

import { expectPropertiesValues } from './../../util-test/util-expect.spec';

import { PoThemeA11yEnum, PoThemeService } from '../../services';
import { PoPopupBaseComponent } from './po-popup-base.component';

describe('PoPopupBaseComponent:', () => {
  let component: PoPopupBaseComponent;
  let poThemeServiceMock: jasmine.SpyObj<PoThemeService>;

  beforeEach(() => {
    poThemeServiceMock = jasmine.createSpyObj('PoThemeService', ['getA11yLevel', 'getA11yDefaultSize']);

    component = new PoPopupBaseComponent(poThemeServiceMock);
  });

  it('should be created', () => {
    expect(component instanceof PoPopupBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('actions: should set actions to `[]` when pass invalid values', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'string', {}];

      expectPropertiesValues(component, 'actions', invalidValues, []);
    });

    it('actions: should update property `p-actions` with valid values', () => {
      const validValues = [[{ label: 'Teste 1', action: () => {} }], [{ label: 'Teste 2', action: 'callOnChange' }]];

      expectPropertiesValues(component, 'actions', validValues, validValues);
    });

    it('position: should set position `bottom-left` when pass invalid values', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'string', [], {}];

      expectPropertiesValues(component, 'position', invalidValues, 'bottom-left');
    });

    it('position: should update property `p-position` with valid values', () => {
      const validValues = [
        'right',
        'right-top',
        'right-bottom',
        'top',
        'top-left',
        'top-right',
        'left',
        'left-top',
        'left-bottom',
        'bottom',
        'bottom-left',
        'bottom-right'
      ];

      expectPropertiesValues(component, 'position', validValues, validValues);
    });

    it('target: should update property `p-target` with ElementRef and HTML', () => {
      const elementRef = new ElementRef('<span></span>');
      const htmlElement = '<span></span>';

      const validValues = [elementRef, htmlElement];

      expectPropertiesValues(component, 'target', validValues, htmlElement);
    });

    it('hideArrow: should update with true value.', () => {
      const booleanValidTrueValues = [true, 'true', 1, ''];

      expectPropertiesValues(component, 'hideArrow', booleanValidTrueValues, true);
    });

    it('hideArrow: should update with false value.', () => {
      const booleanInvalidValues = [undefined, null, 2, 'string', 0, NaN];

      expectPropertiesValues(component, 'hideArrow', booleanInvalidValues, false);
    });

    it('isCornerAlign: should update property with true if valid values', () => {
      const validValues = [true, '', 'true'];

      expectPropertiesValues(component, 'isCornerAlign', validValues, true);
    });

    it('isCornerAlign: should update property with false if invalid values', () => {
      const invalidValues = [false, 'po', null, undefined, NaN];

      expectPropertiesValues(component, 'isCornerAlign', invalidValues, false);
    });

    it('customPositions: should set actions to `[]` if pass invalid values', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'string'];

      expectPropertiesValues(component, 'customPositions', invalidValues, []);
    });

    it('customPositions: should update property with valid value', () => {
      const validValue = [[{ label: 'action1', action: () => {} }], [{ label: 'action2' }]];

      expectPropertiesValues(component, 'customPositions', validValue, validValue);
    });

    describe('p-size', () => {
      it('should set property with valid values for accessibility level is AA', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);

        component.size = 'small';
        expect(component.size).toBe('small');

        component.size = 'medium';
        expect(component.size).toBe('medium');
      });

      it('should set property with valid values for accessibility level is AAA', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AAA);

        component.size = 'small';
        expect(component.size).toBe('medium');

        component.size = 'medium';
        expect(component.size).toBe('medium');
      });

      it('should return small when accessibility is AA and getA11yDefaultSize is small', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);
        poThemeServiceMock.getA11yDefaultSize.and.returnValue('small');

        component['_size'] = undefined;
        expect(component.size).toBe('small');
      });

      it('should return medium when accessibility is AA and getA11yDefaultSize is medium', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);
        poThemeServiceMock.getA11yDefaultSize.and.returnValue('medium');

        component['_size'] = undefined;
        expect(component.size).toBe('medium');
      });

      it('should return medium when accessibility is AAA, regardless of getA11yDefaultSize', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AAA);
        component['_size'] = undefined;
        expect(component.size).toBe('medium');
      });
    });
  });
});
