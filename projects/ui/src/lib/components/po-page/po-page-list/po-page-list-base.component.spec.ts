import { expectPropertiesValues } from '../../../util-test/util-expect.spec';
import { poLocaleDefault } from './../../../utils/util';
import * as UtilFunctions from './../../../utils/util';
import { PoLanguageService } from './../../../services/po-language/po-language.service';

import { PoDisclaimer } from '../../po-disclaimer/po-disclaimer.interface';

import { PoPageListBaseComponent, poPageListLiteralsDefault } from './po-page-list-base.component';

class PoPageListComponent extends PoPageListBaseComponent {
  setDropdownActions() {}
}

describe('PoPageListBaseComponent:', () => {
  const languageService = new PoLanguageService();
  const component = new PoPageListComponent(languageService);

  it('should be created', () => {
    expect(component instanceof PoPageListBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    describe('p-literals:', () => {
      it('should be in portuguese if `getShortLanguage` return an unsupported language.', () => {
        component['language'] = 'zw';

        component.literals = {};

        expect(component.literals).toEqual(poPageListLiteralsDefault[poLocaleDefault]);
      });

      it('should be in portuguese if `getShortLanguage` return `pt`.', () => {
        component['language'] = 'pt';

        component.literals = {};

        expect(component.literals).toEqual(poPageListLiteralsDefault.pt);
      });

      it('should be in english if `getShortLanguage` return `en`.', () => {
        component['language'] = 'en';

        component.literals = {};

        expect(component.literals).toEqual(poPageListLiteralsDefault.en);
      });

      it('should be in spanish if `getShortLanguage` return `es`.', () => {
        component['language'] = 'es';

        component.literals = {};

        expect(component.literals).toEqual(poPageListLiteralsDefault.es);
      });

      it('should be in russian if `getShortLanguage` return `ru`.', () => {
        component['language'] = 'ru';

        component.literals = {};

        expect(component.literals).toEqual(poPageListLiteralsDefault.ru);
      });

      it('should accept custom literals.', () => {
        spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue(poLocaleDefault);

        const customLiterals = poPageListLiteralsDefault[poLocaleDefault];

        // Custom some literals
        customLiterals.otherActions = 'Other actions';

        component.literals = customLiterals;

        expect(component.literals).toEqual(customLiterals);
      });

      it('should update property with default literals if is setted with invalid values.', () => {
        const invalidValues = [null, undefined, false, true, '', 'literals', 0, 10, [], [1, 2], () => {}];

        component['language'] = poLocaleDefault;

        expectPropertiesValues(component, 'literals', invalidValues, poPageListLiteralsDefault[poLocaleDefault]);
      });
    });

    it('should return object when set disclaimerGroup with undefined', () => {
      component.disclaimerGroup = undefined;

      expect(typeof component.disclaimerGroup === 'object').toBeTruthy();
    });

    it('should return object when set disclaimerGroup with null', () => {
      component.disclaimerGroup = null;

      expect(typeof component.disclaimerGroup === 'object').toBeTruthy();
    });

    it('should set disclaimer group with value', () => {
      const disclaimers: Array<PoDisclaimer> = [
        { value: 'hotel', label: 'Hotel', property: 'hotel' },
        { value: '500', label: 'Price', property: 'Preço' },
        { value: 'north', label: 'Region', property: 'region' }
      ];
      component.disclaimerGroup = { change: () => {}, disclaimers, title: 'teste' };

      expect(component.disclaimerGroup).toBeTruthy();
    });
  });
});
