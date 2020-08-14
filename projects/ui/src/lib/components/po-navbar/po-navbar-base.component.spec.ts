import { Directive } from '@angular/core';

import { expectPropertiesValues } from '../../util-test/util-expect.spec';

import * as utilsFunctions from '../../utils/util';
import { PoLanguageService } from '../../services/po-language/po-language.service';

import { PoNavbarBaseComponent, poNavbarLiteralsDefault } from './po-navbar-base.component';

@Directive()
export class PoNavbarComponent extends PoNavbarBaseComponent {
  validateMenuLogo() {}
}

describe('PoNavbarBaseComponent:', () => {
  const languageService = new PoLanguageService();
  const component = new PoNavbarComponent(languageService);

  it('should be created', () => {
    expect(component instanceof PoNavbarBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('iconActions: should update iconActions to `[]` if pass invalid values', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'string'];

      expectPropertiesValues(component, 'iconActions', invalidValues, []);
    });

    it('iconActions: should update iconActions` with valid value', () => {
      const validValue = [[{ label: 'action1', action: () => {} }], [{ label: 'action2' }]];

      expectPropertiesValues(component, 'iconActions', validValue, validValue);
    });

    it('items: should update items to `[]` if pass invalid values', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'string'];

      expectPropertiesValues(component, 'items', invalidValues, []);
    });

    it('items: should update items` with valid value', () => {
      const validValue = [[{ label: 'item1' }, { label: 'item2' }]];

      expectPropertiesValues(component, 'items', validValue, validValue);
    });

    it('literals: should be in portuguese if browser is setted with an unsupported language', () => {
      component['language'] = 'zw';

      component.literals = {};

      expect(component.literals).toEqual(poNavbarLiteralsDefault[utilsFunctions.poLocaleDefault]);
    });

    it('literals: should be in portuguese if browser is setted with `pt`', () => {
      component['language'] = 'pt';

      component.literals = {};

      expect(component.literals).toEqual(poNavbarLiteralsDefault.pt);
    });

    it('literals: should be in english if browser is setted with `en`', () => {
      component['language'] = 'en';

      component.literals = {};

      expect(component.literals).toEqual(poNavbarLiteralsDefault.en);
    });

    it('literals: should be in spanish if browser is setted with `es`', () => {
      component['language'] = 'es';

      component.literals = {};

      expect(component.literals).toEqual(poNavbarLiteralsDefault.es);
    });

    it('literals: should be in russian if browser is setted with `ru`', () => {
      component['language'] = 'ru';

      component.literals = {};

      expect(component.literals).toEqual(poNavbarLiteralsDefault.ru);
    });

    it('literals: should accept custom literals', () => {
      component['language'] = utilsFunctions.poLocaleDefault;

      const customLiterals = Object.assign({}, poNavbarLiteralsDefault[utilsFunctions.poLocaleDefault]);

      // Custom some literals
      customLiterals.navbarLinks = 'links';

      component.literals = customLiterals;

      expect(component.literals).toEqual(customLiterals);
    });

    it('literals: should update property with default literals if is setted with invalid values', () => {
      const invalidValues = [null, undefined, false, true, '', 'literals', 0, 10, [], [1, 2], () => {}];

      component['language'] = utilsFunctions.poLocaleDefault;

      expectPropertiesValues(
        component,
        'literals',
        invalidValues,
        poNavbarLiteralsDefault[utilsFunctions.poLocaleDefault]
      );
    });

    it('shadow: should update property with true if values are valid', () => {
      const validValues = [true, '', 'true'];

      expectPropertiesValues(component, 'shadow', validValues, true);
    });

    it('shadow: should update property with false if values are invalid', () => {
      const invalidValues = [false, 'po', null, undefined, NaN];

      expectPropertiesValues(component, 'shadow', invalidValues, false);
    });

    it('logo: should call `validateMenuLogo` if has `menu`', () => {
      spyOn(component, 'validateMenuLogo');

      component.menu = <any>{ logo: 'logo' };
      component.logo = 'logo';

      expect(component.validateMenuLogo).toHaveBeenCalled();
    });

    it('logo: shouldn`t call `validateMenuLogo` if doesn`t have `menu`', () => {
      spyOn(component, 'validateMenuLogo');

      component.menu = undefined;
      component.logo = 'logo';

      expect(component.validateMenuLogo).not.toHaveBeenCalled();
    });

    it('logo: should update property with valid values', () => {
      const validValues = ['any string value'];

      expectPropertiesValues(component, 'logo', validValues, 'any string value');
    });
  });
});
