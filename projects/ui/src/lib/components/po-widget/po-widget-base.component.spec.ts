import { Directive } from '@angular/core';

import { PoWidgetBaseComponent } from './po-widget-base.component';

import { expectPropertiesValues } from '../../util-test/util-expect.spec';

@Directive()
class PoWidgetComponent extends PoWidgetBaseComponent {
  setHeight(value: any) {}
}

describe('PoWidgetBaseComponent:', () => {
  const component = new PoWidgetComponent();

  it('should be created', () => {
    expect(component instanceof PoWidgetBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('height: should update property `p-height` with valid values', () => {
      const validValues = [1200, 1500, 500, 200, 8000];

      expectPropertiesValues(component, 'height', validValues, validValues);
    });

    it('no-shadow: should update property `p-no-shadow` with valid values and call `setHeight`', () => {
      const validValues = [false, true, '', 'false', 'true'];
      const expectedValues = [false, true, true, false, true];

      spyOn(component, 'setHeight');

      expectPropertiesValues(component, 'noShadow', validValues, expectedValues);
      expect(component.setHeight).toHaveBeenCalled();
    });

    it('no-shadow: should update property `p-no-shadow` with invalid values and call `setHeight`', () => {
      const invalidValues = [12, null, undefined, 'undefined', 'null'];
      const expectedValues = [false, false, false, false, false];

      spyOn(component, 'setHeight');

      expectPropertiesValues(component, 'noShadow', invalidValues, expectedValues);
      expect(component.setHeight).toHaveBeenCalled();
    });

    it('background: should update property `p-background` with valid values', () => {
      const validValues = ['0', '123', ' ', 'false', 'true', 'null', 'undefined', '../assets/image.png'];

      expectPropertiesValues(component, 'background', validValues, validValues);
    });

    it('background: should update property `p-background` with invalid values', () => {
      const invalidValues = [123, 0, '', false, true, null, {}, [''], undefined];

      expectPropertiesValues(component, 'background', invalidValues, undefined);
    });

    it('p-primary: should update property with valid values', () => {
      const validValues = [false, true, '', 'false', 'true'];
      const expectedValues = [false, true, true, false, true];

      expectPropertiesValues(component, 'primary', validValues, expectedValues);
    });

    it('p-primary: should update property with invalid values', () => {
      const invalidValues = [12, null, undefined, 'undefined', 'null'];
      const expectedValues = [false, false, false, false, false];

      expectPropertiesValues(component, 'primary', invalidValues, expectedValues);
    });

    it('p-help: should update property with invalid values and call `setHeight`.', () => {
      const invalidValues = [12, null, undefined, {}, []];

      spyOn(component, 'setHeight');

      expectPropertiesValues(component, 'help', invalidValues, '');
      expect(component.setHeight).toHaveBeenCalled();
    });

    it('p-help: should update property with valid values and call `setHeight`.', () => {
      const validValues = ['test', 'value', 'false', '0'];

      spyOn(component, 'setHeight');

      expectPropertiesValues(component, 'help', validValues, validValues);
      expect(component.setHeight).toHaveBeenCalled();
    });

    it('p-primary-label: should update property with invalid values and call `setHeight`.', () => {
      const invalidValues = [12, null, undefined, {}, []];

      spyOn(component, 'setHeight');

      expectPropertiesValues(component, 'primaryLabel', invalidValues, '');
      expect(component.setHeight).toHaveBeenCalled();
    });

    it('p-primary-label: should update property with valid values and call `setHeight`.', () => {
      const validValues = ['test', 'value', 'false', '0'];

      spyOn(component, 'setHeight');

      expectPropertiesValues(component, 'primaryLabel', validValues, validValues);
      expect(component.setHeight).toHaveBeenCalled();
    });

    it('p-title: should update property with invalid values and call `setHeight`.', () => {
      const invalidValues = [12, null, undefined, {}, []];

      spyOn(component, 'setHeight');

      expectPropertiesValues(component, 'title', invalidValues, '');
      expect(component.setHeight).toHaveBeenCalled();
    });

    it('p-title: should update property with valid values and call `setHeight`.', () => {
      const validValues = ['test', 'value', 'false', '0'];

      spyOn(component, 'setHeight');

      expectPropertiesValues(component, 'title', validValues, validValues);
      expect(component.setHeight).toHaveBeenCalled();
    });

    it('p-disabled: should update property with true if valid values and call `onDisabled.emit`', () => {
      const validValues = [true, '', 'true'];

      const spyOnDisabled = spyOn(component.onDisabled, 'emit');

      expectPropertiesValues(component, 'disabled', validValues, true);

      expect(spyOnDisabled).toHaveBeenCalledWith(true);
    });

    it('p-disabled: should update property with false if invalid values and call `onDisabled.emit`', () => {
      const invalidValues = [false, 'po', null, undefined, NaN];

      const spyOnDisabled = spyOn(component.onDisabled, 'emit');

      expectPropertiesValues(component, 'disabled', invalidValues, false);

      expect(spyOnDisabled).toHaveBeenCalledWith(false);
    });
  });
});
