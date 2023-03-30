import { expectPropertiesValues } from '../../../util-test/util-expect.spec';
import { PoItemListBaseComponent } from './po-item-list-base.component';

describe('PoListBoxBaseComponent', () => {
  const component = new PoItemListBaseComponent();

  it('should be created', () => {
    expect(component instanceof PoItemListBaseComponent).toBeTruthy();
  });

  describe('Properties: ', () => {
    it('should update property `p-type` with valid values', () => {
      const validValues = ['action', 'check', 'option'];

      expectPropertiesValues(component, 'type', validValues, validValues);
    });
    it('should update property `p-type` with invalid values', () => {
      const invalidValues = ['secondary', 'primary', 'default'];

      expectPropertiesValues(component, 'type', invalidValues, 'action');
    });

    it('should set _visible to true if value is true, null or undefined', () => {
      component.visible = true;
      expect(component['_visible']).toBe(true);

      component.visible = null;
      expect(component['_visible']).toBe(true);

      component.visible = undefined;
      expect(component['_visible']).toBe(true);
    });

    it('should set _visible to false if value is not a function or a truthy value', () => {
      component.visible = false;
      expect(component['_visible']).toBe(false);

      component.visible = '';
      expect(component['_visible']).toBe(false);

      component.visible = 0;
      expect(component['_visible']).toBe(false);
    });

    it('should set _disabled if value is true', () => {
      component.disabled = true;
      expect(component['_disabled']).toBeTrue();
    });

    it('should set true if value is null', () => {
      component.disabled = null;
      expect(component['_disabled']).toBeFalse();
    });

    it('should set true if value is undefined', () => {
      component.disabled = undefined;
      expect(component['_disabled']).toBeFalse();
    });
  });
});
