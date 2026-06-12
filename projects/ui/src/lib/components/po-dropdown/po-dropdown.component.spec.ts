import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PoUtils as UtilsFunction } from '../../utils/util';

import { ChangeDetectionStrategy } from '@angular/core';
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
  });

  beforeEach(() => {
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

      vi.spyOn(component as any, 'toggleDropdown');
      component.onKeyDown(eventEnterKey);

      expect(component['toggleDropdown']).toHaveBeenCalled();
    });

    it(`onKeyDown: should call 'isKeyCodeEnter' if typed key is enter.`, () => {
      const eventEnterKey = { keyCode: 13 };

      vi.spyOn(UtilsFunction as any, 'isKeyCodeEnter');
      component.onKeyDown(eventEnterKey);

      expect(UtilsFunction['isKeyCodeEnter']).toHaveBeenCalled();
    });

    it(`onKeyDown: shouldn't call 'toggleDropdown' if the typed key is not enter.`, () => {
      const eventDeleteKey = { keyCode: 46 };

      vi.spyOn(UtilsFunction as any, 'isKeyCodeEnter');
      vi.spyOn(component as any, 'toggleDropdown');
      component.onKeyDown(eventDeleteKey);

      expect(component.toggleDropdown).not.toHaveBeenCalled();
      expect(UtilsFunction['isKeyCodeEnter']).toHaveBeenCalled();
    });

    it(`toggleDropdown: should call 'showDropdown' and not call 'hideDropdown' if has dropdownRef, is close and enable.`, () => {
      component.dropdownRef = { nativeElement: 'value' };
      component['open'] = false;
      component.disabled = false;

      vi.spyOn(component as any, 'showDropdown');
      vi.spyOn(component as any, 'hideDropdown');

      component.toggleDropdown();

      expect(component['showDropdown']).toHaveBeenCalled();
      expect(component['hideDropdown']).not.toHaveBeenCalled();
    });

    it(`toggleDropdown: shouldn't call 'showDropdown' and call 'hideDropdown' if dropdownRef is undefined.`, () => {
      component.dropdownRef = undefined;

      vi.spyOn(component as any, 'showDropdown');
      vi.spyOn(component as any, 'hideDropdown');

      component.toggleDropdown();

      expect(component['showDropdown']).not.toHaveBeenCalled();
      expect(component['hideDropdown']).toHaveBeenCalled();
    });

    it(`toggleDropdown: shouldn't call 'showDropdown' and call 'hideDropdown' if has dropdownRef and is open.`, () => {
      component.dropdownRef = { nativeElement: 'value' };
      component['open'] = true;

      vi.spyOn(component as any, 'showDropdown');
      vi.spyOn(component as any, 'hideDropdown');

      component.toggleDropdown();

      expect(component['showDropdown']).not.toHaveBeenCalled();
      expect(component['hideDropdown']).toHaveBeenCalled();
    });

    it(`toggleDropdown: shouldn't call 'showDropdown' and call 'hideDropdown' if has dropdownRef, is close and disabled.`, () => {
      component.dropdownRef = { nativeElement: 'value' };
      component['open'] = false;
      component.disabled = true;

      vi.spyOn(component as any, 'showDropdown');
      vi.spyOn(component as any, 'hideDropdown');

      component.toggleDropdown();

      expect(component['showDropdown']).not.toHaveBeenCalled();
      expect(component['hideDropdown']).toHaveBeenCalled();
    });

    it(`hideDropdown: should set icon with 'ICON_ARROW_DOWN', call 'removeListeners', set 'open' to 'false'
    and call 'popupRef.close'.`, () => {
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

      component[`hideDropdown`].call(fakeThis);

      expect(fakeThis.icon).toBe('ICON_ARROW_DOWN');
      expect(fakeThis.removeListeners).toHaveBeenCalled();
      expect(fakeThis.popupRef.close).toHaveBeenCalled();
      expect(fakeThis.open).toBe(false);
      expect(fakeThis.changeDetector.detectChanges).toHaveBeenCalled();
    });

    it('initializeListeners: should initialize click, resize and scroll listeners.', () => {
      const wasClickedOnDropdown = vi.spyOn(component as any, 'wasClickedOnDropdown');
      const hideDropdown = vi.spyOn(component as any, 'hideDropdown');
      const addEventListener = vi.spyOn(window as any, 'addEventListener');
      const listen = vi
        .spyOn(component['renderer'], 'listen')
        .mockImplementation((target: any, eventName: any, callback: any) => callback({}));

      component['initializeListeners']();

      expect(wasClickedOnDropdown).toHaveBeenCalled();
      expect(hideDropdown).toHaveBeenCalled();
      expect(addEventListener).toHaveBeenCalled();
      expect(listen).toHaveBeenCalled();
    });

    it('onScroll: should call `hideDropdown` if `open` is `true`', () => {
      vi.spyOn(component as any, 'hideDropdown');

      component['open'] = true;
      vi.spyOn(component as any, 'isDropdownClosed').mockReturnValue(false);

      component['onScroll']({ target: {} });

      expect(component['hideDropdown']).toHaveBeenCalled();
    });

    it('onScroll: shouldn`t call `hideDropdown` if `open` is `false`', () => {
      component['open'] = false;
      vi.spyOn(component as any, 'hideDropdown');

      component['onScroll']({ target: {} });

      expect(component['hideDropdown']).not.toHaveBeenCalled();
    });

    it('onScroll: shouldn`t call `hideDropdown` if `open` is true and target.className is `po-popup-container`', () => {
      const fakeEvent = { target: { className: 'po-popup-container' } };
      component['open'] = true;

      vi.spyOn(component as any, 'hideDropdown');

      component['onScroll'](fakeEvent);

      expect(component['hideDropdown']).not.toHaveBeenCalled();
    });

    it('isDropdownClosed: check dropdown menu visibility correctly', () => {
      const dropdownTop = 50;
      const dropdownHeight = 30;

      vi.spyOn(component.dropdownRef.nativeElement, 'getBoundingClientRect').mockReturnValue({
        top: dropdownTop,
        bottom: dropdownTop + dropdownHeight
      });

      Object.defineProperty(window, 'innerHeight', {
        configurable: true,
        get: () => 500
      });

      const isVisible = component['isDropdownClosed']();

      expect(isVisible).toBe(true);
    });

    describe('removeListeners:', () => {
      it('should remove click, resize and scroll listeners.', () => {
        component['clickoutListener'] = () => {};
        component['resizeListener'] = () => {};

        vi.spyOn(component as any, 'clickoutListener');
        vi.spyOn(component as any, 'resizeListener');
        vi.spyOn(window as any, 'removeEventListener');

        component['removeListeners']();

        expect(component['clickoutListener']).toHaveBeenCalled();
        expect(component['resizeListener']).toHaveBeenCalled();
        expect(window.removeEventListener).toHaveBeenCalled();
      });

      it('should not remove click, if resize and scroll listeners are undefined', () => {
        component['clickoutListener'] = undefined;
        component['resizeListener'] = undefined;

        vi.spyOn(window as any, 'removeEventListener');

        component['removeListeners']();

        expect(window.removeEventListener).toHaveBeenCalled();
      });
    });

    it(`showDropdown: should set icon with 'ICON_ARROW_UP', call 'initializeListeners' set 'open' to 'false'
    and call 'popupRef.close'.`, () => {
      const fakeThis = {
        icon: undefined,
        initializeListeners: () => {},
        popupRef: {
          open: () => {}
        },
        open: undefined,
        changeDetector: {
          detectChanges: () => {}
        }
      };

      vi.spyOn(fakeThis as any, 'initializeListeners');
      vi.spyOn(fakeThis.popupRef as any, 'open');

      component[`showDropdown`].call(fakeThis);

      expect(fakeThis.icon).toBe('ICON_ARROW_UP');
      expect(fakeThis.initializeListeners).toHaveBeenCalled();
      expect(fakeThis.popupRef.open).toHaveBeenCalled();
      expect(fakeThis.open).toBe(true);
    });

    it(`wasClickedOnDropdown: should call 'hideDropdown' if 'checkClickArea' return 'false'.`, () => {
      const fakeEvent: any = {
        target: ''
      };

      const dropdownRef = {
        nativeElement: {
          contains: () => false
        }
      };
      component.dropdownRef = dropdownRef;

      vi.spyOn(component as any, 'hideDropdown');

      component['wasClickedOnDropdown'](fakeEvent);

      expect(component['hideDropdown']).toHaveBeenCalled();
    });

    it(`wasClickedOnDropdown: shouldn't call 'hideDropdown' if 'checkClickArea' return 'true'.`, () => {
      const fakeEvent: any = {
        target: ''
      };
      const dropdownRef = {
        nativeElement: {
          contains: () => true
        }
      };
      component.dropdownRef = dropdownRef;

      vi.spyOn(component as any, 'checkClickArea').mockReturnValue(true);
      vi.spyOn(component as any, 'hideDropdown');

      component['wasClickedOnDropdown'](fakeEvent);

      expect(component['hideDropdown']).not.toHaveBeenCalled();
    });
  });

  describe('Templates:', () => {
    it(`should apply -1 to 'tabindex' if 'disabled' is 'true'`, () => {
      component.disabled = true;

      fixture.detectChanges();
      fixture.whenStable();

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

      vi.spyOn(component as any, 'toggleDropdown');

      const clickEvent = new MouseEvent('click');

      poDropdown.dispatchEvent(clickEvent);

      expect(component.toggleDropdown).toHaveBeenCalled();
    });

    it(`should call 'toggleDropdown' if press enter key in 'po-dropdown'`, () => {
      const poDropdown = nativeElement.querySelector('.po-dropdown');

      vi.spyOn(component as any, 'onKeyDown');

      poDropdown.dispatchEvent(keyboardEvents('keydown', 13));

      expect(component.onKeyDown).toHaveBeenCalled();
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

    it(`should have a class 'po-icon-arrow-up' if 'click' in 'po-dropdown'`, () => {
      fixture.detectChanges();
      const poDropdown = nativeElement.querySelector('.po-dropdown');

      expect(component.icon).toBe('ICON_ARROW_DOWN');

      component.actions = [{ label: 'action1', action: () => {} }];

      fixture.detectChanges();

      const clickEvent = new MouseEvent('click');
      poDropdown.dispatchEvent(clickEvent);

      fixture.detectChanges();

      expect(component.icon).toBe('ICON_ARROW_UP');
    });

    it(`should open a popup if have 'actions' and click in 'po-dropdown'`, () => {
      const poDropdown = nativeElement.querySelector('.po-dropdown');
      component.actions = [{ label: 'action1', action: () => {} }];

      vi.spyOn(component as any, 'showDropdown');
      if (component.popupRef) {
        vi.spyOn(component.popupRef as any, 'open');
      }

      fixture.detectChanges();

      const clickEvent = new MouseEvent('click');
      poDropdown.dispatchEvent(clickEvent);
      fixture.detectChanges();
      nativeElement = fixture.debugElement.nativeElement;

      expect(component['showDropdown']).toHaveBeenCalled();

      if (component.popupRef) {
        expect(component.popupRef.open).toHaveBeenCalled();
      }

      expect(nativeElement.querySelector('.po-popup')).toBeTruthy();
    });

    it(`shouldn't open a popup if doesn't have 'actions' and click in 'po-dropdown'`, () => {
      const poDropdown = nativeElement.querySelector('.po-dropdown');
      component.actions = undefined;

      fixture.detectChanges();

      const clickEvent = new MouseEvent('click');
      poDropdown.dispatchEvent(clickEvent);

      fixture.detectChanges();
      nativeElement = fixture.debugElement.nativeElement;

      expect(nativeElement.querySelector('.po-popup')).toBeNull();
    });
  });
});
