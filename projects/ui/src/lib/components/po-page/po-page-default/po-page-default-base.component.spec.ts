import { Directive } from '@angular/core';

import { expectPropertiesValues } from '../../../util-test/util-expect.spec';
import { poLocaleDefault } from './../../../services/po-language/po-language.constant';
import { PoLanguageService } from './../../../services/po-language/po-language.service';

import { PoThemeA11yEnum } from '../../../services';
import { PoPageDefaultBaseComponent, poPageDefaultLiteralsDefault } from './po-page-default-base.component';

@Directive()
class PoPageDefaultComponent extends PoPageDefaultBaseComponent {
  setDropdownActions() {}

  getVisibleActions() {}
}

describe('PoPageDefaultBaseComponent:', () => {
  let languageService: PoLanguageService;
  let component: PoPageDefaultComponent;

  beforeEach(() => {
    languageService = new PoLanguageService();

    component = new PoPageDefaultComponent(languageService);
  });

  it('should be created', () => {
    expect(component instanceof PoPageDefaultBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    describe('p-literals:', () => {
      it('should be in portuguese if `getShortLanguage` return an unsupported language.', () => {
        component['language'] = 'zw';

        component.literals = {};

        expect(component.literals).toEqual(poPageDefaultLiteralsDefault[poLocaleDefault]);
      });

      it('should be in portuguese if `getShortLanguage` return `pt`.', () => {
        component['language'] = 'pt';

        component.literals = {};

        expect(component.literals).toEqual(poPageDefaultLiteralsDefault.pt);
      });

      it('should be in english if `getShortLanguage` return `en`.', () => {
        component['language'] = 'en';

        component.literals = {};

        expect(component.literals).toEqual(poPageDefaultLiteralsDefault.en);
      });

      it('should be in spanish if `getShortLanguage` return `es`.', () => {
        component['language'] = 'es';

        component.literals = {};

        expect(component.literals).toEqual(poPageDefaultLiteralsDefault.es);
      });

      it('should be in russian if `getShortLanguage` return `ru`.', () => {
        component['language'] = 'ru';

        component.literals = {};

        expect(component.literals).toEqual(poPageDefaultLiteralsDefault.ru);
      });

      it('should accept custom literals.', () => {
        const customLiterals = poPageDefaultLiteralsDefault[poLocaleDefault];

        // Custom some literals
        customLiterals.otherActions = 'Other actions';

        component.literals = customLiterals;

        expect(component.literals).toEqual(customLiterals);
      });

      it('should update property with default literals if is setted with invalid values.', () => {
        const invalidValues = [null, undefined, false, true, '', 'literals', 0, 10, [], [1, 2], () => {}];

        component['language'] = poLocaleDefault;

        expectPropertiesValues(component, 'literals', invalidValues, poPageDefaultLiteralsDefault[poLocaleDefault]);
      });
    });

    it('p-title: should get title when set title', () => {
      component.title = 'teste';

      expect(component.title).toBe('teste');
    });

    it('p-actions: should update property `p-actions` to empty if is invalid values.', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'string', [], {}];

      expectPropertiesValues(component, 'actions', invalidValues, []);
    });

    it('p-actions: should update property `p-actions` if is valid values.', () => {
      const validValues = [[{ label: 'Share', icon: 'po-icon-share' }]];

      expectPropertiesValues(component, 'actions', validValues, validValues);
    });

    describe('p-page-header-type:', () => {
      it('should set `pageHeaderType` to `primary` when receiving `primary`.', () => {
        component.pageHeaderType = 'primary';
        expect(component.pageHeaderType).toBe('primary');
      });

      it('should set `pageHeaderType` to `secondary` when receiving `secondary`.', () => {
        component.pageHeaderType = 'secondary';
        expect(component.pageHeaderType).toBe('secondary');
      });

      it('should set `pageHeaderType` to `tertiary` when receiving `tertiary`.', () => {
        component.pageHeaderType = 'tertiary';
        expect(component.pageHeaderType).toBe('tertiary');
      });

      it('should default `pageHeaderType` to `primary` with invalid values.', () => {
        const invalidValues = ['invalid', '', null, undefined, 'other'];

        invalidValues.forEach(value => {
          component.pageHeaderType = value;
          expect(component.pageHeaderType).toBe('primary');
        });
      });
    });

    describe('p-page-actions-layout:', () => {
      it('should set `pageActionsLayout` to `default` when receiving `default`.', () => {
        component.pageActionsLayout = 'default';
        expect(component.pageActionsLayout).toBe('default');
      });

      it('should set `pageActionsLayout` to `dropdown` when receiving `dropdown`.', () => {
        component.pageActionsLayout = 'dropdown';
        expect(component.pageActionsLayout).toBe('dropdown');
      });

      it('should set `pageActionsLayout` to `mixed` when receiving `mixed`.', () => {
        component.pageActionsLayout = 'mixed';
        expect(component.pageActionsLayout).toBe('mixed');
      });

      it('should default `pageActionsLayout` to `default` with invalid values.', () => {
        const invalidValues = ['invalid', '', null, undefined, 'other'];

        invalidValues.forEach(value => {
          component.pageActionsLayout = value;
          expect(component.pageActionsLayout).toBe('default');
        });
      });
    });

    describe('backNavigation literal:', () => {
      it('should have `backNavigation` literal in english.', () => {
        expect(poPageDefaultLiteralsDefault.en.backNavigation).toBe('Back');
      });

      it('should have `backNavigation` literal in spanish.', () => {
        expect(poPageDefaultLiteralsDefault.es.backNavigation).toBe('Volver');
      });

      it('should have `backNavigation` literal in portuguese.', () => {
        expect(poPageDefaultLiteralsDefault.pt.backNavigation).toBe('Voltar');
      });

      it('should have `backNavigation` literal in russian.', () => {
        expect(poPageDefaultLiteralsDefault.ru.backNavigation).toBe('Назад');
      });
    });

    describe('p-components-size', () => {
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

        component.componentsSize = 'small';
        expect(component.componentsSize).toBe('small');

        component.componentsSize = 'medium';
        expect(component.componentsSize).toBe('medium');
      });

      it('should set property with valid values for accessibility level is AAA', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AAA);

        component.componentsSize = 'small';
        expect(component.componentsSize).toBe('medium');

        component.componentsSize = 'medium';
        expect(component.componentsSize).toBe('medium');
      });

      it('should return small when accessibility is AA and getA11yDefaultSize is small', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);
        localStorage.setItem('po-default-size', 'small');

        component['_componentsSize'] = undefined;
        expect(component.componentsSize).toBe('small');
      });

      it('should return medium when accessibility is AA and getA11yDefaultSize is medium', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);
        localStorage.setItem('po-default-size', 'medium');

        component['_componentsSize'] = undefined;
        expect(component.componentsSize).toBe('medium');
      });

      it('should return medium when accessibility is AAA, regardless of getA11yDefaultSize', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AAA);
        component['_componentsSize'] = undefined;
        expect(component.componentsSize).toBe('medium');
      });

      it('onThemeChange: should call applySizeBasedOnA11y', () => {
        spyOn<any>(component, 'applySizeBasedOnA11y');
        component['onThemeChange']();
        expect((component as any).applySizeBasedOnA11y).toHaveBeenCalled();
      });
    });
  });
});
