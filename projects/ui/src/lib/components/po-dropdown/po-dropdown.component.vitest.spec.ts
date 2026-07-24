import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ChangeDetectionStrategy } from '@angular/core';

import { PoUtils as UtilsFunction } from '../../utils/util';
import { PoPopupComponent } from '../po-popup';
import { PoDropdownComponent } from './po-dropdown.component';

describe('PoDropdownComponent: ', () => {
  let component: PoDropdownComponent;
  let fixture: ComponentFixture<PoDropdownComponent>;
  let nativeElement: any;

  const keyboardEvents = (type: string, keyCode: number) => {
    const event = new KeyboardEvent(type, { keyCode });
    Object.defineProperty(event, 'keyCode', { value: keyCode });
    return event;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [PoDropdownComponent, PoPopupComponent]
    })
      .overrideComponent(PoDropdownComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();

    fixture = TestBed.createComponent(PoDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it(`onKeyDown: should call 'toggleDropdown' if enter is typed.`, () => {
      const eventEnterKey = { keyCode: 13 };

      const spy = vi.spyOn(component, 'toggleDropdown');
      component.onKeyDown(eventEnterKey);

      expect(spy).toHaveBeenCalled();
    });

    it(`onKeyDown: should call 'isKeyCodeEnter' if typed key is enter.`, () => {
      const eventEnterKey = { keyCode: 13 };

      const spy = vi.spyOn(UtilsFunction as any, 'isKeyCodeEnter');
      component.onKeyDown(eventEnterKey);

      expect(spy).toHaveBeenCalled();
    });

    it(`onKeyDown: shouldn't call 'toggleDropdown' if the typed key is not enter.`, () => {
      const eventDeleteKey = { keyCode: 46 };

      vi.spyOn(UtilsFunction as any, 'isKeyCodeEnter');
      const toggleSpy = vi.spyOn(component, 'toggleDropdown');
      component.onKeyDown(eventDeleteKey);

      expect(toggleSpy).not.toHaveBeenCalled();
      expect(UtilsFunction['isKeyCodeEnter']).toHaveBeenCalled();
    });

    it(`toggleDropdown: should call 'showDropdown' and not call 'hideDropdown' if has dropdownRef, is close and enable.`, () => {
      component.dropdownRef = { nativeElement: 'value' };
      component['open'] = false;
      component.disabled = false;

      const showSpy = vi.spyOn(component as any, 'showDropdown');
      const hideSpy = vi.spyOn(component as any, 'hideDropdown');

      component.toggleDropdown();

      expect(showSpy).toHaveBeenCalled();
      expect(hideSpy).not.toHaveBeenCalled();
    });

    it(`toggleDropdown: shouldn't call 'showDropdown' and call 'hideDropdown' if dropdownRef is undefined.`, () => {
      component.dropdownRef = undefined;

      const showSpy = vi.spyOn(component as any, 'showDropdown');
      const hideSpy = vi.spyOn(component as any, 'hideDropdown');

      component.toggleDropdown();

      expect(showSpy).not.toHaveBeenCalled();
      expect(hideSpy).toHaveBeenCalled();
    });

    it(`toggleDropdown: shouldn't call 'showDropdown' and call 'hideDropdown' if has dropdownRef and is open.`, () => {
      component.dropdownRef = { nativeElement: 'value' };
      component['open'] = true;

      const showSpy = vi.spyOn(component as any, 'showDropdown');
      const hideSpy = vi.spyOn(component as any, 'hideDropdown');

      component.toggleDropdown();

      expect(showSpy).not.toHaveBeenCalled();
      expect(hideSpy).toHaveBeenCalled();
    });

    it(`toggleDropdown: shouldn't call 'showDropdown' and call 'hideDropdown' if has dropdownRef, is close and disabled.`, () => {
      component.dropdownRef = { nativeElement: 'value' };
      component['open'] = false;
      component.disabled = true;

      const showSpy = vi.spyOn(component as any, 'showDropdown');
      const hideSpy = vi.spyOn(component as any, 'hideDropdown');

      component.toggleDropdown();

      expect(showSpy).not.toHaveBeenCalled();
      expect(hideSpy).toHaveBeenCalled();
    });

    it(`hideDropdown: should set icon with 'ICON_ARROW_DOWN', call 'removeListeners', set 'open' to 'false' and call 'popupRef.close'.`, () => {
      const fakeThis = {
        icon: undefined,
        removeListeners: vi.fn(),
        popupRef: {
          close: vi.fn()
        },
        open: undefined,
        changeDetector: {
          detectChanges: vi.fn()
        }
      };

      component['hideDropdown'].call(fakeThis);

      expect(fakeThis.icon).toBe('ICON_ARROW_DOWN');
      expect(fakeThis.removeListeners).toHaveBeenCalled();
      expect(fakeThis.popupRef.close).toHaveBeenCalled();
      expect(fakeThis.open).toBe(false);
      expect(fakeThis.changeDetector.detectChanges).toHaveBeenCalled();
    });

    it('initializeListeners: should initialize click, resize and scroll listeners.', () => {
      const wasClickedSpy = vi.spyOn(component as any, 'wasClickedOnDropdown');
      const hideSpy = vi.spyOn(component as any, 'hideDropdown');
      const addEventSpy = vi.spyOn(window, 'addEventListener');
      const listenSpy = vi.spyOn(component['renderer'], 'listen').mockImplementation((target, eventName, callback) => {
        callback({ target: document.createElement('div') });
        return () => {};
      });

      component['initializeListeners']();

      expect(wasClickedSpy).toHaveBeenCalled();
      expect(hideSpy).toHaveBeenCalled();
      expect(addEventSpy).toHaveBeenCalled();
      expect(listenSpy).toHaveBeenCalled();
    });

    it('onScroll: should call `hideDropdown` if `open` is `true`', () => {
      const hideSpy = vi.spyOn(component as any, 'hideDropdown');

      component['open'] = true;
      vi.spyOn(component as any, 'isDropdownClosed').mockReturnValue(false);

      component['onScroll']({ target: {} });

      expect(hideSpy).toHaveBeenCalled();
    });

    it('onScroll: shouldn`t call `hideDropdown` if `open` is `false`', () => {
      component['open'] = false;
      const hideSpy = vi.spyOn(component as any, 'hideDropdown');

      component['onScroll']({ target: {} });

      expect(hideSpy).not.toHaveBeenCalled();
    });

    it('onScroll: shouldn`t call `hideDropdown` if `open` is true and target.className is `po-popup-container`', () => {
      const fakeEvent = { target: { className: 'po-popup-container' } };
      component['open'] = true;

      const hideSpy = vi.spyOn(component as any, 'hideDropdown');

      component['onScroll'](fakeEvent);

      expect(hideSpy).not.toHaveBeenCalled();
    });

    it('isDropdownClosed: check dropdown menu visibility correctly', () => {
      vi.spyOn(component.dropdownRef.nativeElement, 'getBoundingClientRect').mockReturnValue({
        top: 50,
        bottom: 80
      } as DOMRect);

      Object.defineProperty(window, 'innerHeight', {
        configurable: true,
        get: () => 500
      });

      const isVisible = component['isDropdownClosed']();

      expect(isVisible).toBe(true);
    });

    describe('removeListeners:', () => {
      it('should remove click, resize and scroll listeners.', () => {
        component['clickoutListener'] = vi.fn();
        component['resizeListener'] = vi.fn();

        const removeEventSpy = vi.spyOn(window, 'removeEventListener');

        component['removeListeners']();

        expect(component['clickoutListener']).toHaveBeenCalled();
        expect(component['resizeListener']).toHaveBeenCalled();
        expect(removeEventSpy).toHaveBeenCalled();
      });

      it('should not remove click, if resize and scroll listeners are undefined', () => {
        component['clickoutListener'] = undefined;
        component['resizeListener'] = undefined;

        const removeEventSpy = vi.spyOn(window, 'removeEventListener');

        component['removeListeners']();

        expect(removeEventSpy).toHaveBeenCalled();
      });
    });

    it(`showDropdown: should set icon with 'ICON_ARROW_UP', call 'initializeListeners' set 'open' to 'true' and call 'popupRef.open'.`, () => {
      const fakeThis = {
        icon: undefined,
        initializeListeners: vi.fn(),
        popupRef: {
          open: vi.fn()
        },
        open: undefined,
        changeDetector: {
          detectChanges: vi.fn()
        }
      };

      component['showDropdown'].call(fakeThis);

      expect(fakeThis.icon).toBe('ICON_ARROW_UP');
      expect(fakeThis.initializeListeners).toHaveBeenCalled();
      expect(fakeThis.popupRef.open).toHaveBeenCalled();
      expect(fakeThis.open).toBe(true);
    });

    it(`wasClickedOnDropdown: should call 'hideDropdown' if 'checkClickArea' return 'false'.`, () => {
      const fakeEvent: any = { target: '' };

      const dropdownRef = {
        nativeElement: {
          contains: () => false
        }
      };
      component.dropdownRef = dropdownRef;

      const hideSpy = vi.spyOn(component as any, 'hideDropdown');

      component['wasClickedOnDropdown'](fakeEvent);

      expect(hideSpy).toHaveBeenCalled();
    });

    it(`wasClickedOnDropdown: shouldn't call 'hideDropdown' if 'checkClickArea' return 'true'.`, () => {
      const fakeEvent: any = { target: '' };
      const dropdownRef = {
        nativeElement: {
          contains: () => true
        }
      };
      component.dropdownRef = dropdownRef;

      vi.spyOn(component as any, 'checkClickArea').mockReturnValue(true);
      const hideSpy = vi.spyOn(component as any, 'hideDropdown');

      component['wasClickedOnDropdown'](fakeEvent);

      expect(hideSpy).not.toHaveBeenCalled();
    });
  });

  describe('Templates:', () => {
    it(`should apply -1 to 'tabindex' if 'disabled' is 'true'`, async () => {
      component.disabled = true;

      fixture.detectChanges();
      await fixture.whenStable();

      const dropdownElement = nativeElement.querySelector('.po-dropdown');
      expect(dropdownElement).toBeTruthy();
      expect(dropdownElement.getAttribute('tabindex')).toBe('-1');
    });

    it(`should apply 0 to 'tabindex' if 'disabled' is 'false'`, () => {
      component.disabled = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-dropdown[tabindex="0"]')).toBeTruthy();
    });

    it(`should call 'toggleDropdown' if click in 'po-dropdown'`, () => {
      const poDropdown = nativeElement.querySelector('.po-dropdown');

      const toggleSpy = vi.spyOn(component, 'toggleDropdown');

      poDropdown.dispatchEvent(new MouseEvent('click'));

      expect(toggleSpy).toHaveBeenCalled();
    });

    it(`should call 'onKeyDown' if press enter key in 'po-dropdown'`, () => {
      const poDropdown = nativeElement.querySelector('.po-dropdown');

      const keyDownSpy = vi.spyOn(component, 'onKeyDown');

      poDropdown.dispatchEvent(keyboardEvents('keydown', 13));

      expect(keyDownSpy).toHaveBeenCalled();
    });

    it(`should have a class 'po-dropdown-button-disabled' if 'disabled' is 'true'`, async () => {
      component.disabled = true;

      fixture.detectChanges();
      await fixture.whenStable();

      const disabledButton = nativeElement.querySelector('.po-dropdown-button-disabled');
      expect(disabledButton).toBeTruthy();
    });

    it(`shouldn't have a class 'po-dropdown-button-disabled' if 'disabled' is 'false'`, () => {
      component.disabled = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-dropdown-button-disabled')).toBeNull();
    });

    it(`should have icon ICON_ARROW_UP if click in 'po-dropdown'`, () => {
      fixture.detectChanges();
      const poDropdown = nativeElement.querySelector('.po-dropdown');

      expect(component.icon).toBe('ICON_ARROW_DOWN');

      component.actions = [{ label: 'action1', action: () => {} }];

      fixture.detectChanges();

      poDropdown.dispatchEvent(new MouseEvent('click'));

      fixture.detectChanges();

      expect(component.icon).toBe('ICON_ARROW_UP');
    });

    it(`should open a popup if have 'actions' and click in 'po-dropdown'`, () => {
      const poDropdown = nativeElement.querySelector('.po-dropdown');
      component.actions = [{ label: 'action1', action: () => {} }];

      vi.spyOn(component as any, 'showDropdown');

      fixture.detectChanges();

      poDropdown.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();
      nativeElement = fixture.debugElement.nativeElement;

      expect(component['showDropdown']).toHaveBeenCalled();
      expect(nativeElement.querySelector('.po-popup')).toBeTruthy();
    });

    it(`shouldn't open a popup if doesn't have 'actions' and click in 'po-dropdown'`, () => {
      const poDropdown = nativeElement.querySelector('.po-dropdown');
      component.actions = undefined;

      fixture.detectChanges();

      poDropdown.dispatchEvent(new MouseEvent('click'));

      fixture.detectChanges();
      nativeElement = fixture.debugElement.nativeElement;

      expect(nativeElement.querySelector('.po-popup')).toBeNull();
    });
  });
});
