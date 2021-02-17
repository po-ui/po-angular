import { Directive } from '@angular/core';

import { expectPropertiesValues } from './../../util-test/util-expect.spec';
import { poGaugeMinHeight } from './po-gauge-default-values.constant';

import { PoColorService } from '../../services/po-color/po-color.service';

import { PoGaugeBaseComponent } from './po-gauge-base.component';

@Directive()
class PoGaugeComponent extends PoGaugeBaseComponent {
  svgContainerSize() {}
}

describe('PoGaugeBaseComponent:', () => {
  let colorService: PoColorService;

  let component: PoGaugeComponent;

  beforeEach(() => {
    colorService = new PoColorService();

    component = new PoGaugeComponent(colorService);
  });

  it('should be create', () => {
    expect(component instanceof PoGaugeBaseComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    it('setGaugeHeight: should return `poGaugeMinHeight` if height is null', () => {
      const height = null;

      expect(component['setGaugeHeight'](height)).toBe(poGaugeMinHeight);
    });

    it('setGaugeHeight: should return `poGaugeMinHeight` if height is lower than 200', () => {
      const height = 100;

      expect(component['setGaugeHeight'](height)).toBe(poGaugeMinHeight);
    });

    it('setGaugeHeight: should return the value of height', () => {
      const height = 400;

      expect(component['setGaugeHeight'](height)).toBe(height);
    });
  });

  describe('Properties:', () => {
    it('p-description: should call `svgContainerSize`', () => {
      const description = 'description';
      const spySvgContainerSize = spyOn(component, <any>'svgContainerSize');

      component.description = description;

      expect(spySvgContainerSize).toHaveBeenCalled();
    });

    it('p-height: should call `setGaugeHeight`', () => {
      const height = 200;
      const spySetGaugeHeight = spyOn(component, <any>'setGaugeHeight');

      component.height = height;

      expect(spySetGaugeHeight).toHaveBeenCalledWith(height);
    });

    it('p-ranges: should update property with valid values', () => {
      const validValues = [[{ from: 0, to: 100, color: 'red', label: 'description' }], []];
      expectPropertiesValues(component, 'ranges', validValues, validValues);
    });

    it('p-ranges: should apply `[]` if it receives invalid values.', () => {
      const invalidValues = [false, true, {}, 'invalid', 123, null, undefined];

      expectPropertiesValues(component, 'ranges', invalidValues, []);
    });

    it('p-value: should update property with valid values', () => {
      const values = [0, 1, 200, '1', '200', 1.1, 100.0, '100.00', 0.1, '0.1'];
      const validValues = [0, 1, 200, 1, 200, 1.1, 100.0, 100.0, 0.1, 0.1];

      expectPropertiesValues(component, 'value', values, validValues);
    });

    it('p-value: shouldn`t update property if it receives invalid values', () => {
      const invalidValues = [[], {}, null, undefined, true, false, 'number', '10.6sss', '', '  '];

      expectPropertiesValues(component, 'value', invalidValues, undefined);
    });
  });
});
