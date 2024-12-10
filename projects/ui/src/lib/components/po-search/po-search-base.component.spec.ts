import { PoThemeA11yEnum, PoThemeService } from '../../services';
import { poLocaleDefault } from '../../services/po-language/po-language.constant';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import * as Utils from '../../utils/util';
import { poSearchLiteralsDefault } from './literals/po-search-literals-default';
import { PoSearchBaseComponent } from './po-search-base.component';

describe('PoSearchBaseComponent', () => {
  let component: PoSearchBaseComponent;
  let poThemeServiceMock: jasmine.SpyObj<PoThemeService>;

  beforeEach(() => {
    poThemeServiceMock = jasmine.createSpyObj('PoThemeService', ['getA11yLevel', 'getA11yDefaultSize']);

    component = new PoSearchBaseComponent(new PoLanguageService(), poThemeServiceMock);
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
