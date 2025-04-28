import { expectPropertiesValues } from '../../util-test/util-expect.spec';

import { poLocaleDefault } from '../../services/po-language/po-language.constant';
import { PoListBoxBaseComponent, poListBoxLiteralsDefault } from './po-listbox-base.component';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { PoThemeA11yEnum, PoThemeService } from '../../services';

describe('PoListboxBaseComponent', () => {
  const languageService = new PoLanguageService();
  let component: PoListBoxBaseComponent;

  let poThemeServiceMock: jasmine.SpyObj<PoThemeService>;

  beforeEach(() => {
    poThemeServiceMock = jasmine.createSpyObj('PoThemeService', ['getA11yLevel', 'getA11yDefaultSize']);
    component = new PoListBoxBaseComponent(languageService, poThemeServiceMock);
  });

  it('should be created', () => {
    expect(component instanceof PoListBoxBaseComponent).toBeTruthy();
  });

  describe('Properties: ', () => {
    it('should update property `p-type` with valid values', () => {
      const validValues = ['action', 'check', 'option'];

      expectPropertiesValues(component, 'type', validValues, validValues);
    });
    it('should update property `p-type` with invalid values', () => {
      const invalidValues = ['secondary', 'primary', 'default'];

      expectPropertiesValues(component, 'type', invalidValues, 'action');
    });

    it('should update property `p-items` with valid values', () => {
      const items = [
        { label: 'a', value: 'a' },
        { label: 'b', value: 'b' },
        { label: 'c', value: 'c' }
      ];
      const validValues = [items];

      expectPropertiesValues(component, 'items', validValues, validValues);
    });
    it('should update property `p-items` with valid values', () => {
      const invalidValues = ['items', undefined];

      expectPropertiesValues(component, 'items', invalidValues, []);
    });

    describe('p-literals:', () => {
      it('should be in portuguese if browser is setted with an unsuported language', () => {
        component['language'] = 'zw';

        component.literals = {};

        expect(component.literals).toEqual(poListBoxLiteralsDefault[poLocaleDefault]);
      });

      it('should be in portuguese if browser is setted with `pt`', () => {
        component['language'] = 'pt';

        component.literals = {};

        expect(component.literals).toEqual(poListBoxLiteralsDefault.pt);
      });

      it('should be in english if browser is setted with `en`', () => {
        component['language'] = 'en';

        component.literals = {};

        expect(component.literals).toEqual(poListBoxLiteralsDefault.en);
      });

      it('should be in spanish if browser is setted with `es`', () => {
        component['language'] = 'es';

        component.literals = {};

        expect(component.literals).toEqual(poListBoxLiteralsDefault.es);
      });

      it('should be in russian if browser is setted with `ru`', () => {
        component['language'] = 'ru';

        component.literals = {};

        expect(component.literals).toEqual(poListBoxLiteralsDefault.ru);
      });

      it('should accept custom literals', () => {
        component['language'] = poLocaleDefault;

        const customLiterals = Object.assign({}, poListBoxLiteralsDefault[poLocaleDefault]);

        // Custom some literals
        customLiterals.noItems = 'No data custom';

        component.literals = customLiterals;

        expect(component.literals).toEqual(customLiterals);
      });

      it('should update property with default literals if is setted with invalid values', () => {
        const invalidValues = [null, undefined, false, true, '', 'literals', 0, 10, [], [1, 2], () => {}];

        component['language'] = poLocaleDefault;

        expectPropertiesValues(component, 'literals', invalidValues, poListBoxLiteralsDefault[poLocaleDefault]);
      });

      it('should get literals directly from poListBoxLiteralsDefault if it not initialized', () => {
        component['language'] = 'pt';
        component['_literals'] = null;
        expect(component.literals).toEqual(poListBoxLiteralsDefault['pt']);
      });
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

  describe('Methods: ', () => {
    it('should return true when items length is greater than 0 and first item has "options"', () => {
      component.items = [{ options: ['option1', 'option2'] }];

      const result = component.isItemListGroup;

      expect(result).toBeTrue();
    });

    it('should return false when first item does not have "options"', () => {
      component.items = [{ someProperty: 'value' }];

      const result = component.isItemListGroup;

      expect(result).toBeFalse();
    });
  });
});
