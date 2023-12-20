import { PoSearchBaseComponent } from './po-search-base.component';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { poSearchLiteralsDefault } from './literals/po-search-literals-default';
import { poLocaleDefault } from '../../services/po-language/po-language.constant';
import * as Utils from '../../utils/util';

describe('PoSearchBaseComponent', () => {
  let component: PoSearchBaseComponent;

  beforeEach(() => {
    component = new PoSearchBaseComponent(new PoLanguageService());
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
      component['language'] = Utils.browserLanguage();
      component.literals = undefined;

      expect(component.literals).toEqual(poSearchLiteralsDefault[Utils.browserLanguage()]);
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
  });
});
