import { poLocaleDefault } from '../../services';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { expectPropertiesValues } from '../../util-test/util-expect.spec';
import { convertToBoolean } from '../../utils/util';
import { PoAccordionBaseComponent, poAccordionLiteralsDefault } from './po-accordion-base.component';

describe('PoAccordionBaseComponent:', () => {
  const languageService: PoLanguageService = new PoLanguageService();
  let component: PoAccordionBaseComponent;

  beforeEach(() => {
    component = new PoAccordionBaseComponent(languageService);
  });

  describe('Properties:', () => {
    it('should be created', () => {
      expect(component instanceof PoAccordionBaseComponent).toBeTruthy();
    });

    it('p-literals: should be in portuguese if browser is setted with an unsupported language', () => {
      component['language'] = 'zw';

      component.literals = {};

      expect(component.literals).toEqual(poAccordionLiteralsDefault[poLocaleDefault]);
    });

    it('p-literals: should be in portuguese if browser is setted with `pt`', () => {
      component['language'] = 'pt';

      component.literals = {};

      expect(component.literals).toEqual(poAccordionLiteralsDefault.pt);
    });

    it('p-literals: should be in english if browser is setted with `en`', () => {
      component['language'] = 'en';

      component.literals = {};

      expect(component.literals).toEqual(poAccordionLiteralsDefault.en);
    });

    it('p-literals: should be in spanish if browser is setted with `es`', () => {
      component['language'] = 'es';

      component.literals = {};

      expect(component.literals).toEqual(poAccordionLiteralsDefault.es);
    });

    it('p-literals: should be in russian if browser is setted with `ru`', () => {
      component['language'] = 'ru';

      component['_literals'] = undefined;

      expect(component.literals).toEqual(poAccordionLiteralsDefault.ru);
    });

    it('p-literals: should accept custom literals', () => {
      component['language'] = poLocaleDefault;

      const customLiterals = Object.assign({}, poAccordionLiteralsDefault[poLocaleDefault]);

      customLiterals.closeAllItems = 'Close';

      component.literals = customLiterals;

      expect(component.literals).toEqual(customLiterals);
    });

    it('p-literals: should update property with default literals if is setted with invalid values', () => {
      const invalidValues = [null, undefined, false, true, '', 'literals', 0, 10, [], [1, 2], () => {}];

      component['language'] = poLocaleDefault;

      expectPropertiesValues(component, 'literals', invalidValues, poAccordionLiteralsDefault[poLocaleDefault]);
    });

    it('showManagerAccordion: should set property `p-show-manager-accordion` to `false` if invalid value', () => {
      component.showManagerAccordion = convertToBoolean(3);

      expect(component.showManagerAccordion).toBe(false);
    });

    it('hideRemoveAllDisclaimer: should update property `p-show-manager-accordion` to `true` with valid values', () => {
      component.showManagerAccordion = convertToBoolean(1);

      expect(component.showManagerAccordion).toBe(true);
    });

    it('allowExpandItems: should set property `p-allow-expand-all-items` to `false` if invalid value', () => {
      component.allowExpandItems = convertToBoolean(3);

      expect(component.allowExpandItems).toBe(false);
    });

    it('hideRemoveAllDisclaimer: should update property `p-allow-expand-all-items` to `true` with valid values', () => {
      component.allowExpandItems = convertToBoolean(1);

      expect(component.allowExpandItems).toBe(true);
    });

    describe('size:', () => {
      it('should set size property with valid value `medium`', () => {
        component.size = 'medium';

        expect(component.size).toBe('medium');
      });

      it('should set size property with valid value `small` (or default if AA not configured)', () => {
        component.size = 'small';
        const size = component.size;

        expect(['small', 'medium']).toContain(size);
      });

      it('should return default size if value is invalid', () => {
        component.size = 'invalid-size';
        const defaultSize = component.size;

        expect(defaultSize).toBeTruthy();
        expect(['small', 'medium']).toContain(defaultSize);
      });

      it('should return default size if value is undefined', () => {
        component['_size'] = undefined;
        const size = component.size;

        expect(size).toBeTruthy();
        expect(['small', 'medium']).toContain(size);
      });

      it('should return default size if value is null', () => {
        component.size = null;
        const size = component.size;

        expect(size).toBeTruthy();
        expect(['small', 'medium']).toContain(size);
      });

      it('should return default size if value is empty string', () => {
        component.size = '';
        const size = component.size;

        expect(size).toBeTruthy();
        expect(['small', 'medium']).toContain(size);
      });

      it('should validate size using validateSizeFn', () => {
        component.size = 'medium';
        expect(component.size).toBe('medium');

        component.size = 'invalid';
        const size = component.size;
        expect(['small', 'medium']).toContain(size);
      });

      it('should use getDefaultSizeFn when size is not set', () => {
        component['_size'] = undefined;
        const size = component.size;

        expect(size).toBeTruthy();
        expect(['small', 'medium']).toContain(size);
      });

      it('should persist the size value after being set with valid value', () => {
        const testSize = 'medium';
        component.size = testSize;

        expect(component.size).toBe(testSize);

        expect(component.size).toBe(testSize);
      });
    });
  });
});
