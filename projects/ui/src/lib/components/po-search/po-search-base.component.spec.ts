import { PoThemeA11yEnum } from '../../services';
import { poLocaleDefault } from '../../services/po-language/po-language.constant';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import * as Utils from '../../utils/util';
import { poSearchLiteralsDefault, poSearchLiteralsDefaultExecute } from './literals/po-search-literals-default';
import { PoSearchBaseComponent } from './po-search-base.component';

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

    describe('literals with type execute', () => {
      const expected = {
        ...poSearchLiteralsDefault.en,
        ...poSearchLiteralsDefaultExecute.en
      };

      beforeEach(() => {
        component.type = 'execute';
        component['language'] = 'en';
      });

      it('should be in english if browser is set with `en`', () => {
        component.literals = {};

        expect(component.literals).toEqual(expected);
      });

      it('should be set `literals` with browser language if `literals` is `undefined`', () => {
        component.literals = undefined;

        expect(component.literals).toEqual(expected);
      });

      it('should return the literal when not set', () => {
        expect(component.literals).toEqual(expected);
      });
    });

    describe('p-size', () => {
      beforeEach(() => {
        document.documentElement.removeAttribute('data-a11y');
        localStorage.removeItem('po-default-size');
      });

      afterEach(() => {
        document.documentElement.removeAttribute('data-a11y');
        localStorage.removeItem('po-default-size');
      });

      it('should set property with valid values for accessibility level is AA', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);

        component.size = 'small';
        expect(component.size).toBe('small');

        component.size = 'medium';
        expect(component.size).toBe('medium');
      });

      it('should set property with valid values for accessibility level is AAA', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AAA);

        component.size = 'small';
        expect(component.size).toBe('medium');

        component.size = 'medium';
        expect(component.size).toBe('medium');
      });

      it('should return small when accessibility is AA and getA11yDefaultSize is small', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);
        localStorage.setItem('po-default-size', 'small');

        component['_size'] = undefined;
        expect(component.size).toBe('small');
      });

      it('should return medium when accessibility is AA and getA11yDefaultSize is medium', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);
        localStorage.setItem('po-default-size', 'medium');

        component['_size'] = undefined;
        expect(component.size).toBe('medium');
      });

      it('should return medium when accessibility is AAA, regardless of getA11yDefaultSize', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AAA);
        component['_size'] = undefined;
        expect(component.size).toBe('medium');
      });
    });

    describe('keysLabel', () => {
      it('should slice the array if it has more than 3 elements', () => {
        component.keysLabel = ['a', 'b', 'c', 'd', 'e'];
        expect(component.keysLabel).toEqual(['a', 'b', 'c']);
      });
    });

    describe('p-loading:', () => {
      it('should set loading to true', () => {
        component.loading = true;

        expect(component.loading).toBeTrue();
      });

      it('should set loading to false', () => {
        component.loading = false;

        expect(component.loading).toBeFalse();
      });

      it('loading should not affect disabled state', () => {
        component.disabled = false;

        component.loading = true;
        expect(component.disabled).toBeFalse();

        component.disabled = true;
        component.loading = false;
        expect(component.disabled).toBeTrue();
      });

      it('should set loading=true when input receives empty string', () => {
        component.loading = '' as any;

        expect(component.loading).toBeTrue();
      });

      it('should set loading=false when input receives string "false"', () => {
        component.loading = 'false' as any;

        expect(component.loading).toBeFalse();
      });

      it('should set loading=true when input receives string "true"', () => {
        component.loading = 'true' as any;

        expect(component.loading).toBeTrue();
      });

      it('should not throw when cd is undefined', () => {
        component['cd'] = undefined;

        expect(() => (component.loading = true)).not.toThrow();
      });

      it('mapSizeToIcon: should map sizes to icon sizes', () => {
        expect(component.mapSizeToIcon('small')).toBe('xs');
        expect(component.mapSizeToIcon('medium')).toBe('sm');
        expect(component.mapSizeToIcon('large')).toBe('sm');
        expect(component.mapSizeToIcon(undefined)).toBe('sm');
        expect(component.mapSizeToIcon('invalid')).toBe('sm');
      });
    });

    describe('isDisabled:', () => {
      beforeEach(() => {
        component.type = 'action'; // default seguro
      });

      describe('when type is NOT locate', () => {
        it('should return false when disabled and loading are false', () => {
          component.disabled = false;
          component.loading = false;

          expect(component.isDisabled).toBeFalse();
        });

        it('should return true when disabled is true and loading is false', () => {
          component.disabled = true;
          component.loading = false;

          expect(component.isDisabled).toBeTrue();
        });

        it('should return true when disabled is false and loading is true', () => {
          component.disabled = false;
          component.loading = true;

          expect(component.isDisabled).toBeTrue();
        });

        it('should return true when disabled and loading are true', () => {
          component.disabled = true;
          component.loading = true;

          expect(component.isDisabled).toBeTrue();
        });
      });

      describe('when type is locate', () => {
        beforeEach(() => {
          component.type = 'locate';
        });

        it('should ignore loading when disabled is false', () => {
          component.disabled = false;
          component.loading = true;

          expect(component.isDisabled).toBeFalse();
        });

        it('should return true when disabled is true', () => {
          component.disabled = true;
          component.loading = true;

          expect(component.isDisabled).toBeTrue();
        });
      });
    });
  });
});
