import { expectPropertiesValues } from '../../../util-test/util-expect.spec';
import { poLocaleDefault } from './../../../utils/util';
import * as UtilFunctions from './../../../utils/util';

import { PoDisclaimer } from '../../po-disclaimer/po-disclaimer.interface';

import { PoPageListBaseComponent, poPageListLiteralsDefault } from './po-page-list-base.component';

class PoPageListComponent extends PoPageListBaseComponent {

  setDropdownActions() {}

}

describe('PoPageListBaseComponent:', () => {
  const component = new PoPageListComponent();

  it('should be created', () => {
    expect(component instanceof PoPageListBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('p-literals: should be in portuguese if browser is setted with an unsupported language', () => {
      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue('ru');

      component.literals = {};

      expect(component.literals).toEqual(poPageListLiteralsDefault[poLocaleDefault]);
    });

    it('p-literals: should be in portuguese if browser is setted with `pt`', () => {
      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue('pt');

      component.literals = {};

      expect(component.literals).toEqual(poPageListLiteralsDefault.pt);
    });

    it('p-literals: should be in english if browser is setted with `en`', () => {
      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue('en');

      component.literals = {};

      expect(component.literals).toEqual(poPageListLiteralsDefault.en);
    });

    it('p-literals: should be in spanish if browser is setted with `es`', () => {
      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue('es');

      component.literals = {};

      expect(component.literals).toEqual(poPageListLiteralsDefault.es);
    });

    it('p-literals: should accept custom literals', () => {
      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue(poLocaleDefault);

      const customLiterals = poPageListLiteralsDefault[poLocaleDefault];

      // Custom some literals
      customLiterals.otherActions = 'Other actions';

      component.literals = customLiterals;

      expect(component.literals).toEqual(customLiterals);
    });

    it('p-literals: should update property with default literals if is setted with invalid values', () => {
      const invalidValues = [null, undefined, false, true, '', 'literals', 0, 10, [], [1, 2], () => {}];

      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue(poLocaleDefault);

      expectPropertiesValues(component, 'literals', invalidValues, poPageListLiteralsDefault[poLocaleDefault]);
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
        { value: 'north', label: 'Region', property: 'region' },
      ];
      component.disclaimerGroup = {change: () => {}, disclaimers, title: 'teste'};

      expect(component.disclaimerGroup).toBeTruthy();
    });

  });

});
