import { PoPickerMouseDownGuard } from './po-picker-mouse-down-guard';

describe('PoPickerMouseDownGuard:', () => {
  let isInsidePicker: jasmine.Spy;
  let guard: PoPickerMouseDownGuard;

  beforeEach(() => {
    isInsidePicker = jasmine.createSpy('isInsidePicker').and.returnValue(true);
    guard = new PoPickerMouseDownGuard(isInsidePicker);
  });

  describe('register:', () => {
    it('should make `consume` return true when the target is inside the picker', () => {
      const target = document.createElement('div');

      guard.register(target);

      expect(isInsidePicker).toHaveBeenCalledWith(target);
      expect(guard.consume()).toBeTrue();
    });

    it('should make `consume` return false when the target is outside the picker', () => {
      isInsidePicker.and.returnValue(false);

      guard.register(document.createElement('div'));

      expect(guard.consume()).toBeFalse();
    });

    it('should make `consume` return false without calling `isInsidePicker` when target is undefined', () => {
      guard.register(undefined);

      expect(isInsidePicker).not.toHaveBeenCalled();
      expect(guard.consume()).toBeFalse();
    });
  });

  describe('consume:', () => {
    it('should return false by default', () => {
      expect(guard.consume()).toBeFalse();
    });

    it('should reset the state so it is valid only for the next click', () => {
      guard.register(document.createElement('div'));

      expect(guard.consume()).toBeTrue();
      expect(guard.consume()).toBeFalse();
    });
  });

  describe('listen:', () => {
    it('should listen `mousedown` on document and register the event target', () => {
      const target = document.createElement('div');
      const renderer: any = {
        listen: jasmine.createSpy('listen').and.callFake((_element, _eventName, callback) => {
          callback({ target });
          return () => {};
        })
      };

      guard.listen(renderer);

      expect(renderer.listen).toHaveBeenCalledWith('document', 'mousedown', jasmine.any(Function));
      expect(guard.consume()).toBeTrue();
    });

    it('should remove the previous listener before listening again', () => {
      const removeListener = jasmine.createSpy('removeListener');
      const renderer: any = { listen: jasmine.createSpy('listen').and.returnValue(removeListener) };

      guard.listen(renderer);
      guard.listen(renderer);

      expect(removeListener).toHaveBeenCalledTimes(1);
      expect(renderer.listen).toHaveBeenCalledTimes(2);
    });
  });

  describe('destroy:', () => {
    it('should remove the listener and reset the state', () => {
      const removeListener = jasmine.createSpy('removeListener');
      const renderer: any = { listen: () => removeListener };

      guard.listen(renderer);
      guard.register(document.createElement('div'));
      guard.destroy();

      expect(removeListener).toHaveBeenCalledTimes(1);
      expect(guard.consume()).toBeFalse();
    });

    it('should not throw when there is no listener', () => {
      expect(() => guard.destroy()).not.toThrow();
    });
  });
});
