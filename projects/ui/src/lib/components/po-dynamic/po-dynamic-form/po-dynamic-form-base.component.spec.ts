import { TitleCasePipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { expectPropertiesValues } from '../../../util-test/util-expect.spec';

import { PoThemeA11yEnum } from '../../../services';
import { PoThemeService } from '../../../services/po-theme/po-theme.service';
import { PoDynamicFormBaseComponent } from './po-dynamic-form-base.component';

describe('PoDynamicFormBaseComponent:', () => {
  let component: PoDynamicFormBaseComponent;
  let poThemeServiceMock: jasmine.SpyObj<PoThemeService>;

  beforeEach(() => {
    poThemeServiceMock = jasmine.createSpyObj('PoThemeService', ['getA11yLevel', 'getA11yDefaultSize']);

    TestBed.configureTestingModule({
      providers: [TitleCasePipe, { provide: PoThemeService, useValue: poThemeServiceMock }]
    });

    component = new PoDynamicFormBaseComponent(poThemeServiceMock);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties: ', () => {
    describe('p-components-size', () => {
      it('should set property with valid values for accessibility level is AA', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);

        component.componentsSize = 'small';
        expect(component.componentsSize).toBe('small');

        component.componentsSize = 'medium';
        expect(component.componentsSize).toBe('medium');
      });

      it('should set property with valid values for accessibility level is AAA', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AAA);

        component.componentsSize = 'small';
        expect(component.componentsSize).toBe('medium');

        component.componentsSize = 'medium';
        expect(component.componentsSize).toBe('medium');
      });

      it('should return small when accessibility is AA and getA11yDefaultSize is small', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);
        poThemeServiceMock.getA11yDefaultSize.and.returnValue('small');

        component['_componentsSize'] = undefined;
        expect(component.componentsSize).toBe('small');
      });

      it('should return medium when accessibility is AA and getA11yDefaultSize is medium', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);
        poThemeServiceMock.getA11yDefaultSize.and.returnValue('medium');

        component['_componentsSize'] = undefined;
        expect(component.componentsSize).toBe('medium');
      });

      it('should return medium when accessibility is AAA, regardless of getA11yDefaultSize', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AAA);
        component['_componentsSize'] = undefined;
        expect(component.componentsSize).toBe('medium');
      });
    });

    it('p-group-from: should set property to `false` if aren`t valid values', () => {
      const invalidValues = [undefined, null, false, 0, 'string'];

      expectPropertiesValues(component, 'groupForm', invalidValues, false);
    });

    it('p-group-from: should update property with `true` if valid values', () => {
      const validValues = ['true', true, ''];

      expectPropertiesValues(component, 'groupForm', validValues, true);
    });
  });
});
