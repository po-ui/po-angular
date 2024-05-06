import { PoOverlayBaseComponent } from './po-overlay-base.component';
import * as utilsFunctions from '../../utils/util';

describe('PoOverlayBaseComponent', () => {
  const component = new PoOverlayBaseComponent();

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    it('p-screen-lock: should update property `p-screen-lock` with valid values.', () => {
      component.screenLock = utilsFunctions.convertToBoolean(1);

      expect(component.screenLock).toBe(true);
    });

    it('p-screen-lock: should update property `p-screen-lock` with invalid values.', () => {
      component.screenLock = utilsFunctions.convertToBoolean(3);

      expect(component.screenLock).toBe(false);
    });
  });
});
