import { Directive } from '@angular/core';

import { expectPropertiesValues } from './../../util-test/util-expect.spec';

import { PoSlideBaseComponent } from './po-slide-base.component';

@Directive()
class PoSlideComponent extends PoSlideBaseComponent {
  cancelInterval() {}
  startSlide() {}
  setSlideItems() {}
  startInterval() {}
  setSlideHeight(height: number) {}
}

describe('PoSlideBaseComponent:', () => {
  const component = new PoSlideComponent();

  it('should be created', () => {
    expect(component instanceof PoSlideBaseComponent).toBe(true);
  });

  describe('Properties:', () => {
    it('height: should update property with valid values.', () => {
      const validValues = [0, 1500, 500, 200, 8000];

      expectPropertiesValues(component, 'height', validValues, validValues);
    });

    it('height: should update property if values are invalid.', () => {
      component.height = 'one' as any;
      expect(component.height).toBeUndefined();

      component.height = false as any;
      expect(component.height).toBeUndefined();

      component.height = undefined;
      expect(component.height).toBeUndefined();

      component.height = null;
      expect(component.height).toBeUndefined();
    });

    it('interval: should update property with values greater or equal than 1000 and call `startInterval`.', () => {
      const validValues = [1001, 10000, 2000, 1280, 1000];

      const spy = vi.spyOn(component as any, 'startInterval').mockImplementation(() => {});

      expectPropertiesValues(component, 'interval', validValues, validValues);
      expect(spy).toHaveBeenCalledTimes(5);
    });

    it('interval: should update property with valid values less than 1000 and call `cancelInterval`.', () => {
      const validValues = [1, 0, 155, 999];

      const spy = vi.spyOn(component as any, 'cancelInterval').mockImplementation(() => {});

      expectPropertiesValues(component, 'interval', validValues, validValues);
      expect(spy).toHaveBeenCalledTimes(4);
    });

    it('interval: should update property with `4000` if values are invalid and call `startInterval`.', () => {
      const invalidValues = [null, undefined, [], {}, false, 'false', true, 'true', 'string'];

      const spy = vi.spyOn(component as any, 'startInterval').mockImplementation(() => {});
      spy.mockClear();

      expectPropertiesValues(component, 'interval', invalidValues, 4000);
      expect(spy).toHaveBeenCalledTimes(9);
    });

    it('slides: should update property with valid values and call `setSlideItems`.', () => {
      const validValues = [
        ['image-1', 'image-2'],
        [{ image: 'image-1' }, { image: 'image-2' }],
        [{ label: '1' }, { label: '2' }]
      ];

      const spy = vi.spyOn(component, 'setSlideItems').mockImplementation(() => {});

      expectPropertiesValues(component, 'slides', validValues, validValues);
      expect(spy).toHaveBeenCalledTimes(3);
    });
  });
});
