import { fakeAsync, tick } from '@angular/core/testing';

import { expectPropertiesValues } from './../../../util-test/util-expect.spec';
import { poLocaleDefault } from './../../../utils/util';
import * as UtilFunctions from './../../../utils/util';

import { PoPageDetailBaseComponent, poPageDetailLiteralsDefault } from './po-page-detail-base.component';

describe('PoPageDefaultBaseComponent:', () => {
  const component = new PoPageDetailBaseComponent();

  it('should be created', () => {
    expect(component instanceof PoPageDetailBaseComponent).toBeTruthy();
  });

  describe('Properties: ', () => {
    it('p-literals: should be in portuguese if browser is setted with an unsupported language', () => {
      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue('zw');

      component.literals = {};

      expect(component.literals).toEqual(poPageDetailLiteralsDefault[poLocaleDefault]);
    });

    it('p-literals: should be in portuguese if browser is setted with `pt`', () => {
      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue('pt');

      component.literals = {};

      expect(component.literals).toEqual(poPageDetailLiteralsDefault.pt);
    });

    it('p-literals: should be in english if browser is setted with `en`', () => {
      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue('en');

      component.literals = {};

      expect(component.literals).toEqual(poPageDetailLiteralsDefault.en);
    });

    it('p-literals: should be in spanish if browser is setted with `es`', () => {
      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue('es');

      component.literals = {};

      expect(component.literals).toEqual(poPageDetailLiteralsDefault.es);
    });

    it('p-literals: should be in russian if browser is setted with `ru`', () => {
      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue('ru');

      component.literals = {};

      expect(component.literals).toEqual(poPageDetailLiteralsDefault.ru);
    });

    it('p-literals: should accept custom literals', () => {
      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue(poLocaleDefault);

      const customLiterals = poPageDetailLiteralsDefault[poLocaleDefault];

      // Custom some literals
      customLiterals.back = 'Back custom';
      customLiterals.edit = 'Edit custom';

      component.literals = customLiterals;

      expect(component.literals).toEqual(customLiterals);
    });

    it('p-literals: should update property with default literals if is setted with invalid values', () => {
      const invalidValues = [null, undefined, false, true, '', 'literals', 0, 10, [], [1, 2], () => {}];

      spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue(poLocaleDefault);

      expectPropertiesValues(component, 'literals', invalidValues, poPageDetailLiteralsDefault[poLocaleDefault]);
    });

    it('title: should set title and call recalculateHeaderSize when set title', fakeAsync(() => {
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
