import { expectPropertiesValues } from '../../util-test/util-expect.spec';
import { poLocaleDefault } from './../../../../../ui/src/lib/services/po-language/po-language.constant';
import { PoLanguageService } from './../../../../../ui/src/lib/services/po-language/po-language.service';

import { Component } from '@angular/core';
import { PoThemeA11yEnum, PoThemeService } from '@po-ui/ng-components';
import { convertToBoolean } from '../../utils/util';
import { PoPageDynamicSearchFilters } from './interfaces/po-page-dynamic-search-filters.interface';
import { PoPageDynamicSearchLiterals } from './interfaces/po-page-dynamic-search-literals.interface';
import { PoAdvancedFilterLiterals } from './po-advanced-filter/po-advanced-filter-literals.interface';
import {
  PoPageDynamicSearchBaseComponent,
  poPageDynamicSearchLiteralsDefault
} from './po-page-dynamic-search-base.component';

@Component({
  selector: 'mock-component',
  template: '',
  standalone: false
})
class MockComponent extends PoPageDynamicSearchBaseComponent {
  onChangeFilters(filters: Array<PoPageDynamicSearchFilters>) {}
}

describe('PoPageDynamicSearchBaseComponent:', () => {
  let component;
  let poThemeServiceMock: jasmine.SpyObj<PoThemeService>;
  const languageService = new PoLanguageService();

  beforeEach(() => {
    poThemeServiceMock = jasmine.createSpyObj('PoThemeService', ['getA11yLevel', 'getA11yDefaultSize']);

    component = new MockComponent(<any>languageService, poThemeServiceMock);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    describe('p-components-size', () => {
      it('should set property with valid values for accessibility level is AA', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);

        component.componentsSize = 'small';
        expect(component.componentsSize).toBe('small');

        component.componentsSize = 'medium';
        expect(component.componentsSize).toBe('medium');
      });

      it('should set property with valid values for accessibility level is AAA', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AAA);

        component.componentsSize = 'small';
        expect(component.componentsSize).toBe('medium');

        component.componentsSize = 'medium';
        expect(component.componentsSize).toBe('medium');
      });

      it('should return small when accessibility is AA and getA11yDefaultSize is small', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);
        poThemeServiceMock.getA11yDefaultSize.and.returnValue('small');

        component['_componentsSize'] = undefined;
        expect(component.componentsSize).toBe('small');
      });

      it('should return medium when accessibility is AA and getA11yDefaultSize is medium', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);
        poThemeServiceMock.getA11yDefaultSize.and.returnValue('medium');

        component['_componentsSize'] = undefined;
        expect(component.componentsSize).toBe('medium');
      });

      it('should return medium when accessibility is AAA, regardless of getA11yDefaultSize', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AAA);
        component['_componentsSize'] = undefined;
        expect(component.componentsSize).toBe('medium');
      });
    });

    it('filters: should set `filters` to `[]` if not Array value', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'string', {}];

      expectPropertiesValues(component, 'filters', invalidValues, []);
    });

    it('filters: should update property `p-filters` with valid values', () => {
      const validValues = [[{ property: 'Teste 1' }], [{ property: 'Teste 2' }]];

      expectPropertiesValues(component, 'filters', validValues, validValues);
    });

    it('hideRemoveAllDisclaimer: should set property `p-hide-remove-all-disclaimer` to `false` if invalid value', () => {
      component.hideRemoveAllDisclaimer = convertToBoolean(3);

      expect(component.hideRemoveAllDisclaimer).toBe(false);
    });

    it('hideRemoveAllDisclaimer: should update property `p-hide-remove-all-disclaimer` to `true` with valid values', () => {
      component.hideRemoveAllDisclaimer = convertToBoolean(1);

      expect(component.hideRemoveAllDisclaimer).toBe(true);
    });

    it('hideCloseDisclaimers: should set property `p-hide-close-disclaimers` to `[]` if not Array value', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'string', {}];

      expectPropertiesValues(component, 'hideCloseDisclaimers', invalidValues, []);
    });

    it('hideCloseDisclaimers: should update property `p-hide-close-disclaimers` with valid values', () => {
      const validValues = [['Teste 1'], ['Teste 2', 'Teste 3']];

      expectPropertiesValues(component, 'hideCloseDisclaimers', validValues, validValues);
    });

    it('should return stringify value with filter without searchService', () => {
      const columns: Array<any> = [{ property: 'test' }, { searchService: 'service/test' }];
      const result = '[{"property":"test"},{}]';
      const filter = component['stringify'](columns);
      expect(filter).toEqual(result);
    });

    describe('p-literals:', () => {
      it('should be in portuguese if browser is setted with an unsupported language', () => {
        component['language'] = 'zw';

        component.literals = {};

        expect(component.literals).toEqual(poPageDynamicSearchLiteralsDefault[poLocaleDefault]);
      });

      it('should be in portuguese if browser is setted with `pt`', () => {
        component['language'] = 'pt';

        component.literals = {};

        expect(component.literals).toEqual(poPageDynamicSearchLiteralsDefault.pt);
      });

      it('should be in english if browser is setted with `en`', () => {
        component['language'] = 'en';

        component.literals = {};

        expect(component.literals).toEqual(poPageDynamicSearchLiteralsDefault.en);
      });

      it('should be in spanish if browser is setted with `es`', () => {
        component['language'] = 'es';

        component.literals = {};

        expect(component.literals).toEqual(poPageDynamicSearchLiteralsDefault.es);
      });

      it('should be in russian if browser is setted with `ru`', () => {
        component['language'] = 'ru';

        component.literals = {};

        expect(component.literals).toEqual(poPageDynamicSearchLiteralsDefault.ru);
      });

      it('should accept custom literals', () => {
        component['language'] = poLocaleDefault;

        const customLiterals = Object.assign({}, poPageDynamicSearchLiteralsDefault[poLocaleDefault]);

        customLiterals.filterTitle = 'Filtro avançado';
        customLiterals.disclaimerGroupTitle = 'Filtros aplicados:';

        component.literals = customLiterals;

        expect(component.literals).toEqual(customLiterals);
      });

      it('should update property with default literals if is setted with invalid values', () => {
        const invalidValues = [null, undefined, false, true, '', 'literals', 0, 10, [], [1, 2], () => {}];

        component['language'] = poLocaleDefault;

        expectPropertiesValues(
          component,
          'literals',
          invalidValues,
          poPageDynamicSearchLiteralsDefault[poLocaleDefault]
        );
      });

      it('should get literals directly from poPageDynamicSearchLiteralsDefault if it not initialized', () => {
        component['language'] = 'pt';

        expect(component.literals).toEqual(poPageDynamicSearchLiteralsDefault['pt']);
      });
    });

    it('p-quick-search-width: should update property p-quick-search-width with valid values.', () => {
      const validValues = [105, 1, 98, 0];

      expectPropertiesValues(component, 'quickSearchWidth', validValues, validValues);
    });

    it('p-quick-search-width: should update property p-quick-search-width with invalid values for undefined.', () => {
      const invalidValues = [null, undefined, '', ' ', {}, [], false, true];

      expectPropertiesValues(component, 'quickSearchWidth', invalidValues, undefined);
    });
  });

  describe('Methods:', () => {
    it('setAdvancedFilterLiterals: should set `advancedFilterLiterals` with `pageDynamicSearchLiterals`.', () => {
      const title = 'Filtro avançado';
      const cancelLabel = 'Fechar';
      const confirmLabel = 'Confirmar';

      const expectedValue: PoAdvancedFilterLiterals = { title, cancelLabel, confirmLabel };

      const pageDynamicSearchLiterals: PoPageDynamicSearchLiterals = {
        filterCancelLabel: cancelLabel,
        filterConfirmLabel: confirmLabel,
        filterTitle: title
      };

      component['setAdvancedFilterLiterals'](pageDynamicSearchLiterals);

      expect(component.advancedFilterLiterals).toEqual(expectedValue);
    });
  });

  describe('p-visible-fixed-filters:', () => {
    it('should update `_visibleFixedFilters` when `visibleFixedFilters` is set', () => {
      component.visibleFixedFilters = true;
      expect(component['_visibleFixedFilters']).toBe(true);

      component.visibleFixedFilters = false;
      expect(component['_visibleFixedFilters']).toBe(false);
    });

    it('should return `_visibleFixedFilters` when `visibleFixedFilters` is accessed', () => {
      component['_visibleFixedFilters'] = true;
      expect(component.visibleFixedFilters).toBe(true);

      component['_visibleFixedFilters'] = false;
      expect(component.visibleFixedFilters).toBe(false);
    });

    it('should have a default value of `true` for `visibleFixedFilters` if not set', () => {
      expect(component.visibleFixedFilters).toBeTrue();
    });
  });
});
