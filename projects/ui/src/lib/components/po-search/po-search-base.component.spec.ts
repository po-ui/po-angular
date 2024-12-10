import { PoThemeA11yEnum, PoThemeService } from '../../services';
import { poLocaleDefault } from '../../services/po-language/po-language.constant';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { expectPropertiesValues } from '../../util-test/util-expect.spec';
import * as Utils from '../../utils/util';
import { poSearchLiteralsDefault } from './literals/po-search-literals-default';
import { PoSearchBaseComponent } from './po-search-base.component';

describe('PoSearchBaseComponent', () => {
  let component: PoSearchBaseComponent;
  let poThemeService: jasmine.SpyObj<PoThemeService>;

  beforeEach(() => {
    poThemeService = jasmine.createSpyObj('PoThemeService', ['getA11yDefaultSize', 'getA11yLevel']);

    component = new PoSearchBaseComponent(new PoLanguageService(), poThemeService);
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    it('label: should set label when is setted', () => {
      component['language'] = 'en';
      component.ariaLabel = 'Search';

      expect(component.ariaLabel).toBe('Search');
    });

    it('label: should concat label with literals', () => {
      component['language'] = 'en';
      component.ariaLabel = 'label button';
      expect(component.ariaLabel).toBe('label button Search');
    });

    it('should be set `literals` with browser language if `literals` is `undefined`', () => {
      component['language'] = Utils.getShortBrowserLanguage();
      component.literals = undefined;

      expect(component.literals).toEqual(poSearchLiteralsDefault[Utils.getShortBrowserLanguage()]);
    });

    it('should be in portuguese if browser is set with `pt`.', () => {
      component['language'] = 'pt';

      component.literals = {};

      expect(component.literals).toEqual(poSearchLiteralsDefault[poLocaleDefault]);
    });

    it('should be in english if browser is set with `en`.', () => {
      component['language'] = 'en';

      component.literals = {};

      expect(component.literals).toEqual(poSearchLiteralsDefault.en);
    });

    describe('p-size:', () => {
      it('should update size with valid values', () => {
        const validValues = ['medium'];

        expectPropertiesValues(component, 'size', validValues, validValues);
      });

      it('should update size to `medium` with invalid values', () => {
        poThemeService.getA11yDefaultSize.and.returnValue('medium');

        const invalidValues = ['extraSmall', 'extraLarge'];

        expectPropertiesValues(component, 'size', invalidValues, 'medium');
      });

      it('should use default size when size is not set', () => {
        poThemeService.getA11yDefaultSize.and.returnValue('small');

        component.size = undefined;
        expect(component.size).toBe('small');
      });

      it('should return `p-size` if it is defined', () => {
        component['_size'] = 'large';
        expect(component.size).toBe('large');
      });

      it('should call `getDefaultSize` and return its value if `p-size` is null or undefined', () => {
        spyOn(component as any, 'getDefaultSize').and.returnValue('medium');

        component['_size'] = null;
        expect(component.size).toBe('medium');
        expect(component['getDefaultSize']).toHaveBeenCalled();

        component['_size'] = undefined;
        expect(component.size).toBe('medium');
        expect(component['getDefaultSize']).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Methods: ', () => {
    describe('validateSize:', () => {
      it('should return the same size if valid and accessibility level allows it', () => {
        poThemeService.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);

        expect(component['validateSize']('small')).toBe('small');
        expect(component['validateSize']('medium')).toBe('medium');
      });

      it('should return `medium` if p-size is `small` and accessibility level is not `AA`', () => {
        poThemeService.getA11yLevel.and.returnValue(PoThemeA11yEnum.AAA);

        expect(component['validateSize']('small')).toBe('medium');
      });

      it('should return default size from getA11yDefaultSize if value is invalid', () => {
        poThemeService.getA11yDefaultSize.and.returnValue('small');

        expect(component['validateSize']('invalid')).toBe('small');
      });

      it('should return `medium` if default size is `medium`', () => {
        poThemeService.getA11yDefaultSize.and.returnValue('medium');

        expect(component['validateSize']('invalid')).toBe('medium');
      });
    });

    describe('getDefaultSize:', () => {
      it('should return `small` if getA11yDefaultSize returns `small`', () => {
        poThemeService.getA11yDefaultSize.and.returnValue('small');

        expect(component['getDefaultSize']()).toBe('small');
      });

      it('should return `medium` if getA11yDefaultSize returns `medium`', () => {
        poThemeService.getA11yDefaultSize.and.returnValue('medium');

        expect(component['getDefaultSize']()).toBe('medium');
      });
    });
  });
});
