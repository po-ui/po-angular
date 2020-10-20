import * as utilsFunctions from './../../../utils/util';
import { expectPropertiesValues } from '../../../util-test/util-expect.spec';
import { PoLanguageService } from '../../../../../../ui/src/lib/services/po-language/po-language.service';
import { poLocaleDefault } from '../../../../../../ui/src/lib/services/po-language/po-language.constant';
import { PoAdvancedFilterBaseComponent, poAdvancedFiltersLiteralsDefault } from './po-advanced-filter-base.component';

describe('PoAdvancedFilterBaseComponent', () => {
  let component;

  const languageService = new PoLanguageService();

  beforeEach(() => {
    component = new PoAdvancedFilterBaseComponent(<any>languageService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    it('filters: should set `filters` to `[]` if not Array value', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'string', {}];

      expectPropertiesValues(component, 'filters', invalidValues, []);
    });

    it('filters: should update property `p-filters` with valid values', () => {
      const validValues = [[{ property: 'Teste 1' }], [{ property: 'Teste 2' }]];

      expectPropertiesValues(component, 'filters', validValues, validValues);
    });

    describe('literals:', () => {
      it('should be in portuguese if browser is setted with an unsupported language', () => {
        component['language'] = 'zw';

        component.literals = {};

        expect(component.literals).toEqual(poAdvancedFiltersLiteralsDefault[poLocaleDefault]);
      });

      it('should be in portuguese if browser is setted with `pt`', () => {
        component['language'] = 'pt';

        component.literals = {};

        expect(component.literals).toEqual(poAdvancedFiltersLiteralsDefault.pt);
      });

      it('should be in english if browser is setted with `en`', () => {
        component['language'] = 'en';

        component.literals = {};

        expect(component.literals).toEqual(poAdvancedFiltersLiteralsDefault.en);
      });

      it('should be in spanish if browser is setted with `es`', () => {
        component['language'] = 'es';

        component.literals = {};

        expect(component.literals).toEqual(poAdvancedFiltersLiteralsDefault.es);
      });

      it('should be in russian if browser is setted with `ru`', () => {
        component['language'] = 'ru';

        component.literals = {};

        expect(component.literals).toEqual(poAdvancedFiltersLiteralsDefault.ru);
      });

      it('should accept custom literals', () => {
        component['language'] = poLocaleDefault;

        const customLiterals = Object.assign({}, poAdvancedFiltersLiteralsDefault[poLocaleDefault]);

        customLiterals.title = 'Filtro avançado';
        customLiterals.cancelLabel = 'Fechar';
        customLiterals.confirmLabel = 'Aplicar';

        component.literals = customLiterals;

        expect(component.literals).toEqual(customLiterals);
      });

      it('should update property with default literals if is setted with invalid values', () => {
        const invalidValues = [null, undefined, false, true, '', 'literals', 0, 10, [], [1, 2], () => {}];

        component['language'] = 'pt';

        expectPropertiesValues(component, 'literals', invalidValues, poAdvancedFiltersLiteralsDefault[poLocaleDefault]);
      });

      it('should get literals directly from poAdvancedFiltersLiteralsDefault if it not initialized', () => {
        component['language'] = 'pt';

        expect(component.literals).toEqual(poAdvancedFiltersLiteralsDefault['pt']);
      });
    });
  });

  describe('Methods:', () => {
    describe('getValuesFromForm', () => {
      it('should return an object containing filter and optionsService key values if optionsServiceChosenOptions has length', () => {
        component.filter = { name: 'name', birthdate: 'Birthdate', age: '', city: 12345 };
        component.optionsServiceChosenOptions = [{ label: 'Vancouver', value: 12345 }];

        const expectedReturnValue = { filter: component.filter, optionsService: component.optionsServiceChosenOptions };

        component['getValuesFromForm']();

        expect(component['getValuesFromForm']()).toEqual(expectedReturnValue);
      });

      it('should return an object with undefined to optionService if optionsServiceChosenOptions doesn`t have length', () => {
        component.filter = { name: 'name', birthdate: 'Birthdate', age: '', city: 12345 };
        component.optionsServiceChosenOptions = [];

        const expectedReturnValue = { filter: component.filter, optionsService: undefined };

        component['getValuesFromForm']();

        expect(component['getValuesFromForm']()).toEqual(expectedReturnValue);
      });

      it('should return the items that do not have undefined or empty property values.', () => {
        component.filter = { name: 'name', birthdate: 'Birthdate', age: '', Adress: undefined };

        const filteredItems = { filter: { name: 'name', birthdate: 'Birthdate' }, optionsService: undefined };

        expect(component['getValuesFromForm']()).toEqual(filteredItems);
      });
    });

    it('primaryAction: should emit `searchEvent` and call `getValuesFromForm` and `poModal.close`', () => {
      component.poModal = <any>{ close: () => {} };

      spyOn(component.searchEvent, 'emit');
      spyOn(component.poModal, 'close');
      spyOn(component, <any>'getValuesFromForm');

      component.primaryAction.action();

      expect(component.searchEvent.emit).toHaveBeenCalled();
      expect(component.poModal.close).toHaveBeenCalled();
      expect(component['getValuesFromForm']).toHaveBeenCalled();
    });

    it('secondaryAction: should call `poModal.close`', () => {
      component.poModal = <any>{ close: () => {} };

      spyOn(component.poModal, 'close');

      component.secondaryAction.action();

      expect(component.poModal.close).toHaveBeenCalled();
    });
  });
});
