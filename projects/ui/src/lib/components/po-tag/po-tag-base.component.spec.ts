import { expectPropertiesValues } from '../../util-test/util-expect.spec';

import { PoColorPaletteEnum } from '../../enums/po-color-palette.enum';

import { poLocaleDefault } from './../../services/po-language/po-language.constant';
import { PoLanguageService } from './../../services/po-language/po-language.service';
import { PoTagOrientation } from './enums/po-tag-orientation.enum';
import { PoTagType } from './enums/po-tag-type.enum';
import { PoTagBaseComponent, PoTagLiteralsDefault } from './po-tag-base.component';

describe('PoTagBaseComponent:', () => {
  const component = new PoTagBaseComponent(new PoLanguageService());
  const poTagColors = (<any>Object).values(PoColorPaletteEnum);

  it('should be created', () => {
    expect(component instanceof PoTagBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('color: should update to true value.', () => {
      const colorsValidTrueValues = poTagColors;

      expectPropertiesValues(component, 'color', colorsValidTrueValues, colorsValidTrueValues);
    });

    it('color: shouldn´t update to false value.', () => {
      const colorsInalidTrueValues = [undefined, null, 2, 'string', 0, NaN];

      expectPropertiesValues(component, 'color', colorsInalidTrueValues, undefined);
    });

    it('icon: should update to true value with `type`.', () => {
      component.type = PoTagType.Info;
      const booleanValidTrueValues = [true, 'true', 1, ''];

      expectPropertiesValues(component, 'icon', booleanValidTrueValues, true);
    });

    it('icon: should update to false if `type` is true.', () => {
      component.type = PoTagType.Info;
      const booleanInvalidValues = [undefined, null, 2, 'string', 0, NaN];

      expectPropertiesValues(component, 'icon', booleanInvalidValues, false);
    });

    it('icon: should update to true if `type` is undefined.', () => {
      component.type = undefined;
      const validValues = ['po-icon-ok', 'po-icon-company', 'po-icon-news'];

      expectPropertiesValues(component, 'icon', validValues, validValues);
    });

    it('inverse: should update property with valid and invalid values.', () => {
      const validValues = [true, 'true', 1, ''];
      const invalidValues = [false, 'false', 0];

      expectPropertiesValues(component, 'inverse', validValues, true);
      expectPropertiesValues(component, 'inverse', invalidValues, false);
    });

    it('orientation: should update property with valid values', () => {
      const validValues = (<any>Object).values(PoTagOrientation);

      expectPropertiesValues(component, 'orientation', validValues, validValues);
    });

    it('orientation: should update property with `PoTagOrientation.vertical` if values are invalid', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'aa', [], {}];

      expectPropertiesValues(component, 'orientation', invalidValues, PoTagOrientation.Vertical);
    });

    it('type: should update property with valid values', () => {
      const validValues = ['danger', 'info', 'success', 'warning'];

      expectPropertiesValues(component, 'type', validValues, validValues);
    });

    it('type: should update property with `info` if values are invalid', () => {
      const invalidValues = [undefined, null, '', true, false, 0, -1, 12, 15, 'aa', [], {}];

      expectPropertiesValues(component, 'type', invalidValues, undefined);
    });

    it('customColor: should change the value with a color name', () => {
      component.color = 'red';
      expect(component.customColor).toBe('red');
    });

    it('customColor: should change the value with a hex color', () => {
      component.color = '#fff';
      expect(component.customColor).toBe('#fff');
    });

    it('customColor: should change the value with a rgb', () => {
      component.color = 'rgb(35, 233, 215)';
      expect(component.customColor).toBe('rgb(35, 233, 215)');
    });

    it('color: should change color to default value if value is invalid', () => {
      component.color = 'deep red';
      expect(component.color).toBe(undefined);
    });

    it('textColor: should update to true value.', () => {
      const colorsValidTrueValues = poTagColors;

      expectPropertiesValues(component, 'textColor', colorsValidTrueValues, colorsValidTrueValues);
    });

    it('textColor: shouldn´t update to false value.', () => {
      const colorsInalidTrueValues = [undefined, null, 2, 'string', 0, NaN];

      expectPropertiesValues(component, 'textColor', colorsInalidTrueValues, undefined);
    });

    it('customTextColor : should change the value with a color name', () => {
      component.textColor = 'red';
      expect(component.customTextColor).toBe('red');
    });

    it('customTextColor : should change the value with a hex color', () => {
      component.textColor = '#fff';
      expect(component.customTextColor).toBe('#fff');
    });

    it('customTextColor : should change the value with a rgb', () => {
      component.textColor = 'rgb(35, 233, 215)';
      expect(component.customTextColor).toBe('rgb(35, 233, 215)');
    });

    it('customTextColor : should change color to default value if value is invalid', () => {
      component.textColor = 'deep red';
      expect(component.customTextColor).toBe(undefined);
    });

    it('p-literals: should be in portuguese if browser is setted with an unsupported language', () => {
      component['language'] = 'zw';

      component.literals = {};

      expect(component.literals).toEqual(PoTagLiteralsDefault[poLocaleDefault]);
    });

    it('p-literals: should be in portuguese if browser is setted with `pt`', () => {
      component['language'] = 'pt';

      component.literals = {};

      expect(component.literals).toEqual(PoTagLiteralsDefault.pt);
    });

    it('p-literals: should be in english if browser is setted with `en`', () => {
      component['language'] = 'en';

      component.literals = {};

      expect(component.literals).toEqual(PoTagLiteralsDefault.en);
    });

    it('p-literals: should be in spanish if browser is setted with `es`', () => {
      component['language'] = 'es';

      component.literals = {};

      expect(component.literals).toEqual(PoTagLiteralsDefault.es);
    });

    it('p-literals: should be in russian if browser is setted with `ru`', () => {
      component['language'] = 'ru';

      component.literals = {};

      expect(component.literals).toEqual(PoTagLiteralsDefault.ru);
    });

    it('p-literals: should accept custom literals', () => {
      component['language'] = poLocaleDefault;

      const customLiterals = Object.assign({}, PoTagLiteralsDefault[poLocaleDefault]);

      customLiterals.remove = 'Remove custom';

      component.literals = customLiterals;

      expect(component.literals).toEqual(customLiterals);
    });

    it('p-literals: should update property with default literals if is setted with invalid values', () => {
      const invalidValues = [null, undefined, false, true, '', 'literals', 0, 10, [], [1, 2], () => {}];

      component['language'] = poLocaleDefault;

      expectPropertiesValues(component, 'literals', invalidValues, PoTagLiteralsDefault[poLocaleDefault]);
    });

    it('p-literals: should update property with default literals if _literals is undefined', () => {
      component['language'] = 'pt';

      component['_literals'] = undefined;

      expect(component.literals).toEqual(PoTagLiteralsDefault.pt);
    });
  });
});
