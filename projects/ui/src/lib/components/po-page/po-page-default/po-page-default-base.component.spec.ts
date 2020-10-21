import { Directive } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';

import * as UtilFunctions from './../../../utils/util';
import { expectPropertiesValues } from '../../../util-test/util-expect.spec';
import { PoLanguageService } from './../../../services/po-language/po-language.service';
import { poLocaleDefault } from './../../../services/po-language/po-language.constant';

import { PoPageDefaultBaseComponent, poPageDefaultLiteralsDefault } from './po-page-default-base.component';

@Directive()
class PoPageDefaultComponent extends PoPageDefaultBaseComponent {
  setDropdownActions() {}
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
        spyOn(UtilFunctions, <any>'browserLanguage').and.returnValue(poLocaleDefault);

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

    it('p-title: should get title and call recalculateHeaderSize when set title', fakeAsync(() => {
      component.poPageContent = <any>{
        recalculateHeaderSize: () => {}
      };

      spyOn(component.poPageContent, 'recalculateHeaderSize');

      component.title = 'teste';

      tick();

      expect(component.title).toBe('teste');
      expect(component.poPageContent.recalculateHeaderSize).toHaveBeenCalled();
    }));

    it('p-actions: should update property `p-actions` to empty if is invalid values.', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'string', [], {}];

      expectPropertiesValues(component, 'actions', invalidValues, []);
    });

    it('p-actions: should update property `p-actions` if is valid values.', () => {
      const validValues = [[{ label: 'Share', icon: 'po-icon-share' }]];

      expectPropertiesValues(component, 'actions', validValues, validValues);
    });
  });
});
