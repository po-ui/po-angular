import { fakeAsync, tick } from '@angular/core/testing';

import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { poLocaleDefault } from './../../../services/po-language/po-language.constant';
import { expectPropertiesValues } from './../../../util-test/util-expect.spec';

import { PoThemeA11yEnum } from '../../../services';
import { PoPageEditBaseComponent, poPageEditLiteralsDefault } from './po-page-edit-base.component';

describe('PoPageEditBaseComponent:', () => {
  let component: PoPageEditBaseComponent;

  beforeEach(() => {
    component = new PoPageEditBaseComponent(new PoLanguageService());
  });

  it('should be created', () => {
    expect(component instanceof PoPageEditBaseComponent).toBeTruthy();
  });

  describe('Properties: ', () => {
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
    });

    it('p-literals: should be in portuguese if browser is setted with an unsupported language', () => {
      component['language'] = 'zw';

      component.literals = {};

      expect(component.literals).toEqual(poPageEditLiteralsDefault[poLocaleDefault]);
    });

    it('p-literals: should be in portuguese if browser is setted with `pt`', () => {
      component['language'] = 'pt';

      component.literals = {};

      expect(component.literals).toEqual(poPageEditLiteralsDefault.pt);
    });

    it('p-literals: should be in english if browser is setted with `en`', () => {
      component['language'] = 'en';

      component.literals = {};

      expect(component.literals).toEqual(poPageEditLiteralsDefault.en);
    });

    it('p-literals: should be in spanish if browser is setted with `es`', () => {
      component['language'] = 'es';

      component.literals = {};

      expect(component.literals).toEqual(poPageEditLiteralsDefault.es);
    });

    it('p-literals: should be in russian if browser is setted with `ru`', () => {
      component['language'] = 'ru';

      component.literals = {};

      expect(component.literals).toEqual(poPageEditLiteralsDefault.ru);
    });

    it('p-literals: should accept custom literals', () => {
      component['language'] = poLocaleDefault;

      const customLiterals = poPageEditLiteralsDefault[poLocaleDefault];

      // Custom some literals
      customLiterals.save = 'Save custom';
      customLiterals.saveNew = 'Save and New custom';

      component.literals = customLiterals;

      expect(component.literals).toEqual(customLiterals);
    });

    it('p-literals: should update property with default literals if is setted with invalid values', () => {
      const invalidValues = [null, undefined, false, true, '', 'literals', 0, 10, [], [1, 2], () => {}];

      component['language'] = poLocaleDefault;

      expectPropertiesValues(component, 'literals', invalidValues, poPageEditLiteralsDefault[poLocaleDefault]);
    });

    it('should get title and call recalculateHeaderSize when set title', fakeAsync(() => {
      component.poPageContent = <any>{
        recalculateHeaderSize: () => {}
      };

      spyOn(component.poPageContent, 'recalculateHeaderSize');

      component.title = 'teste';

      tick();

      expect(component.title).toBe('teste');
      expect(component.poPageContent.recalculateHeaderSize).toHaveBeenCalled();
    }));
  });
});
