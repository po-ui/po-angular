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
    expect(component instanceof PoSlideBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('height: should update property with valid values.', () => {
      const validValues = [0, 1500, 500, 200, 8000];

      expectPropertiesValues(component, 'height', validValues, validValues);
    });

    it('height: should update property if values are invalid.', () => {
      component.height = <any>'one';
      expect(component.height).toBeUndefined();

      component.height = <any>false;
      expect(component.height).toBeUndefined();

      component.height = undefined;
      expect(component.height).toBeUndefined();

      component.height = null;
      expect(component.height).toBeUndefined();
    });

    it('interval: should update property with values greater or equal than 1000 and call `startInterval`.', () => {
      const validValues = [1001, 10000, 2000, 1280, 1000];

      spyOn(component, <any>'startInterval');

      expectPropertiesValues(component, 'interval', validValues, validValues);
      expect(component['startInterval']).toHaveBeenCalledTimes(5);
    });

    it('interval: should update property with valid values less than 1000 and call `cancelInterval`.', () => {
      const validValues = [1, 0, 155, 999];

      spyOn(component, <any>'cancelInterval');

      expectPropertiesValues(component, 'interval', validValues, validValues);
      expect(component['cancelInterval']).toHaveBeenCalledTimes(4);
    });

    it('interval: should update property with `4000` if values are invalid and call `startInterval`.', () => {
      const invalidValues = [null, undefined, [], {}, false, 'false', true, 'true', 'string'];

      spyOn(component, <any>'startInterval');

      expectPropertiesValues(component, 'interval', invalidValues, 4000);
      expect(component['startInterval']).toHaveBeenCalledTimes(9);
    });

    it('slides: should update property with valid values and call `setSlideItems`.', () => {
      const validValues = [
        ['image-1', 'image-2'],
        [{ image: 'image-1' }, { image: 'image-2' }],
        [{ label: '1' }, { label: '2' }]
      ];

      spyOn(component, 'setSlideItems');

      expectPropertiesValues(component, 'slides', validValues, validValues);
      expect(component.setSlideItems).toHaveBeenCalledTimes(3);
    });
  });
});
