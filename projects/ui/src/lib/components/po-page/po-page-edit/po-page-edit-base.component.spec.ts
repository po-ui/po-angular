import { tick, fakeAsync } from '@angular/core/testing';

import { expectPropertiesValues } from './../../../util-test/util-expect.spec';
import { poLocaleDefault } from './../../../utils/util';
import * as UtilFunctions from './../../../utils/util';

import { PoPageEditBaseComponent, poPageEditLiteralsDefault } from './po-page-edit-base.component';

describe('PoPageEditBaseComponent:', () => {
  const component = new PoPageEditBaseComponent();

  it('should be created', () => {
    expect(component instanceof PoPageEditBaseComponent).toBeTruthy();
  });

  describe('Properties: ', () => {
    it('p-literals: should be in portuguese if browser is setted with an unsupported language', () => {
      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue('zw');

      component.literals = {};

      expect(component.literals).toEqual(poPageEditLiteralsDefault[poLocaleDefault]);
    });

    it('p-literals: should be in portuguese if browser is setted with `pt`', () => {
      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue('pt');

      component.literals = {};

      expect(component.literals).toEqual(poPageEditLiteralsDefault.pt);
    });

    it('p-literals: should be in english if browser is setted with `en`', () => {
      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue('en');

      component.literals = {};

      expect(component.literals).toEqual(poPageEditLiteralsDefault.en);
    });

    it('p-literals: should be in spanish if browser is setted with `es`', () => {
      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue('es');

      component.literals = {};

      expect(component.literals).toEqual(poPageEditLiteralsDefault.es);
    });

    it('p-literals: should be in russian if browser is setted with `ru`', () => {
      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue('ru');

      component.literals = {};

      expect(component.literals).toEqual(poPageEditLiteralsDefault.ru);
    });

    it('p-literals: should accept custom literals', () => {
      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue(poLocaleDefault);

      const customLiterals = poPageEditLiteralsDefault[poLocaleDefault];

      // Custom some literals
      customLiterals.save = 'Save custom';
      customLiterals.saveNew = 'Save and New custom';

      component.literals = customLiterals;

      expect(component.literals).toEqual(customLiterals);
    });

    it('p-literals: should update property with default literals if is setted with invalid values', () => {
      const invalidValues = [null, undefined, false, true, '', 'literals', 0, 10, [], [1, 2], () => {}];

      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue(poLocaleDefault);

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
